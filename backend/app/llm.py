"""
LLM service for FarmGuru with Hugging Face Inference API integration and deterministic fallback.
"""
import os
import json
from typing import List, Dict, Any, Optional
import httpx

class LLMService:
    def __init__(self):
        self.hf_api_key = os.getenv("HF_API_KEY")
        self.hf_model_url = "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct"
            
    async def synthesize(self, question: str, docs: List[Dict[str, Any]], agent_hint: str = "general") -> Dict[str, Any]:
        """Synthesize answer from retrieved documents"""
        if not docs:
            return {
                "answer": "I don't know — please consult a local expert.",
                "confidence": 0.0,
                "actions": ["Ask a local agricultural expert"],
                "sources": [],
                "meta": {"agent": agent_hint, "retrieved_ids": []}
            }
            
        # Load prompt template
        prompt_template = self._load_prompt_template()
        
        # Format documents for prompt
        doc_text = self._format_docs_for_prompt(docs)
        
        # Create full prompt
        full_prompt = prompt_template.replace("<<USER_QUESTION>>", question)
        full_prompt += f"\nRetrieved docs:\n{doc_text}\n\nReturn only JSON."
        
        # Try Hugging Face first, then deterministic fallback
        if self.hf_api_key:
            try:
                response_text = await self._call_hf(full_prompt)
                parsed_response = self._parse_and_validate_response(response_text, docs, agent_hint)
                if parsed_response:
                    return parsed_response
            except Exception as e:
                print(f"Hugging Face API error: {e}")
                
        # Deterministic fallback
        return self._deterministic_fallback(question, docs, agent_hint)
        
    def _load_prompt_template(self) -> str:
        """Load the RAG prompt template"""
        try:
            with open("prompt_templates/rag_prompt.txt", "r") as f:
                return f.read()
        except FileNotFoundError:
            return """You are FarmGuru. Use ONLY the retrieved passages below (labeled [DOC1],[DOC2]...[DOCn]). Do NOT invent facts. If none of the passages support the user's question, reply exactly: "I don't know — please consult a local expert." Output must be strict JSON with fields: answer (short 1-2 sentences), confidence (0-1), actions (array of 1-3 concise actions), sources (array with title,url,snippet). For chemistry/chemical suggestions: do NOT provide dosages or prescriptive application guidance—only broad IPM steps and advise to consult local extension.
User question: <<USER_QUESTION>>"""
            
    def _format_docs_for_prompt(self, docs: List[Dict[str, Any]]) -> str:
        """Format documents for the prompt"""
        formatted_docs = []
        for i, doc in enumerate(docs, 1):
            title = doc.get('title', 'Unknown')
            url = doc.get('source_url', 'No URL')
            content = doc.get('content', '')[:500]  # Truncate for token limits
            
            formatted_docs.append(f"[DOC{i}] Title: {title}, URL: {url}\n{content}")
            
        return "\n\n".join(formatted_docs)
        
    async def _call_hf(self, prompt: str) -> str:
        """Call Hugging Face Inference API for text generation"""
        headers = {
            "Authorization": f"Bearer {self.hf_api_key}",
            "Accept": "application/json",
            "Content-Type": "application/json",
        }
        payload = {
            "inputs": prompt,
            "parameters": {"max_new_tokens": 256}
        }
        async with httpx.AsyncClient(timeout=60) as client:
            resp = await client.post(self.hf_model_url, headers=headers, json=payload)
            if resp.status_code != 200:
                raise RuntimeError(f"HF Inference API error: {resp.status_code} {resp.text}")
            data = resp.json()
            # Typical HF Inference returns a list with {"generated_text": ...}
            if isinstance(data, list) and len(data) > 0:
                generated = data[0].get("generated_text")
                if not generated:
                    # Some hosted models might return dict with different key
                    generated = data[0].get("summary_text") or json.dumps(data)
                return generated
            elif isinstance(data, dict):
                return data.get("generated_text", json.dumps(data))
            else:
                raise ValueError("Unexpected HF response format")
        
    def _parse_and_validate_response(self, response: str, docs: List[Dict[str, Any]], agent_hint: str) -> Optional[Dict[str, Any]]:
        """Parse and validate LLM response"""
        try:
            # Try to extract JSON from response
            response = response.strip()
            if response.startswith("```json"):
                response = response[7:]
            if response.endswith("```"):
                response = response[:-3]
                
            parsed = json.loads(response)
            
            # Validate required fields
            required_fields = ["answer", "confidence", "actions", "sources"]
            if not all(field in parsed for field in required_fields):
                return None
                
            # Add metadata
            parsed["meta"] = {
                "agent": agent_hint,
                "retrieved_ids": [doc.get('id') for doc in docs if doc.get('id')]
            }
            
            return parsed
            
        except (json.JSONDecodeError, KeyError) as e:
            print(f"Response parsing error: {e}")
            return None
            
    def _deterministic_fallback(self, question: str, docs: List[Dict[str, Any]], agent_hint: str) -> Dict[str, Any]:
        """Deterministic fallback when HF API is not available"""
        # Concatenate small snippets for context
        snippets = [doc.get('content', '')[:150] for doc in docs[:2]]
        combined_content = " ".join(snippets).strip()
        
        # Short 1–2 sentence conservative answer
        if any(k in question.lower() for k in ['water', 'irrigat', 'rain']):
            answer = "Check soil moisture at 2–3 inch depth and consider current rainfall before irrigating."
            actions = ["Check soil moisture", "Review local forecast"]
        elif any(k in question.lower() for k in ['pest', 'disease', 'bug']):
            answer = "Use Integrated Pest Management (IPM) practices and consult local experts for specific guidance."
            actions = ["Remove affected parts", "Consult KVK expert"]
        elif any(k in question.lower() for k in ['fertilizer', 'nutrient']):
            answer = "Do a soil test first and apply a balanced fertilizer as recommended by local guidelines."
            actions = ["Get soil test", "Follow local guidance"]
        else:
            base = combined_content[:160] if combined_content else "Information is limited."
            answer = f"{base} Please consult local experts for specific advice."
            actions = ["Consult agricultural officer"]
        
        # Fixed confidence per requirement
        confidence = 0.5
        
        # Format sources = retrieved docs
        sources = []
        for doc in docs:
            sources.append({
                "title": doc.get('title', 'Agricultural Guide'),
                "url": doc.get('source_url', '#'),
                "snippet": doc.get('content', '')[:150]
            })
            
        return {
            "answer": answer,
            "confidence": confidence,
            "actions": actions[:2],  # ensure 1–2 actions
            "sources": sources,
            "meta": {
                "agent": agent_hint,
                "retrieved_ids": [doc.get('id') for doc in docs if doc.get('id')]
            }
        }

# Global LLM service instance
llm_service = LLMService()