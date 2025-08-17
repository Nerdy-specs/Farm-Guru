# FarmGuru - AI-Powered Agricultural Assistant

## 🔑 LLM Setup (Hugging Face Inference API)

- Set `HF_API_KEY` in your backend `.env` to enable Hugging Face Inference API with `mistralai/Mixtral-8x7B-Instruct`.
- Create/Manage your token at: https://huggingface.co/settings/tokens
- When `HF_API_KEY` is not set, FarmGuru uses a deterministic fallback: short 1–2 sentence answer, fixed confidence (0.5), simple actions, and retrieved docs as sources.

Example backend `.env` values:
```
HF_API_KEY=hf_...your_token...
DATABASE_URL=...
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
```

## 🌾 Features

- **Smart Query System**: Ask questions via text or voice input
- **Image Analysis**: Upload crop images for disease detection and treatment recommendations
- **Weather Integration**: Real-time weather forecasts and agricultural recommendations
- **Market Prices**: Live market data with trend analysis and trading signals
- **Government Schemes**: Automatic matching with PM-KISAN, PMFBY, and other schemes
- **Community Forum**: Connect with other farmers and share experiences
- **Multilingual Support**: Full Hindi and English interface
- **Offline Support**: PWA with offline caching for essential features

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account (for database and storage)
- Python 3.8+ (for backend)

### Frontend Setup

1. **Clone and install dependencies:**
```bash
git clone <YOUR_GIT_URL>
cd farmguru
npm install
```

2. **Environment setup:**
```bash
cp .env.example .env
# Edit .env with your actual values
```

3. **Start development server:**
```bash
npm run dev
```

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Install Python dependencies:**
```bash
pip install -r requirements.txt
```

3. **Setup environment:**
```bash
cp .env.example .env
# Edit .env with your database and API keys (see LLM Setup above)
```

4. **Start backend server:**
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Supabase Setup

1. **Create a new Supabase project** at [supabase.com](https://supabase.com)

2. **Enable required extensions:**
   - Go to Database → Extensions
   - Enable `vector` extension for pgvector support

3. **Run database migrations:**
   - Copy the SQL from `supabase/migrations/` and run in SQL Editor
   - Or use Supabase CLI: `supabase db push`

4. **Create storage bucket:**
   - Go to Storage → Create bucket
   - Name: `farm-images`
   - Make it public for image uploads

5. **Get your credentials:**
   - Project URL: `https://your-project.supabase.co`
   - Anon key: Found in Settings → API

## 📱 Usage

- With `HF_API_KEY` set, queries call Hugging Face Inference API and return JSON.
- Without the key, deterministic fallback is used for consistent demos.

### Basic Queries
- **Text**: "When should I irrigate my wheat crop?"
- **Voice**: Click microphone and speak your question
- **Image**: Upload crop photos for disease analysis

### Government Schemes
- Select your state and crop to see applicable schemes
- Get eligibility criteria and required documents
- Direct links to application portals

### Market Analysis
- View current prices and 7-day trends
- Get BUY/SELL/HOLD recommendations
- Compare prices across different mandis

### Community Features
- Create posts to ask questions
- Share farming experiences
- Get help from other farmers

## 🛠️ Development

### Available Scripts

```bash
# Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run format       # Format code with Prettier

# Backend
uvicorn app.main:app --reload  # Start backend server
python -m pytest              # Run tests
```

### Project Structure

```
farmguru/
├── src/
│   ├── components/          # React components
│   ├── pages/              # Page components
│   ├── lib/                # Utilities and configs
│   ├── integrations/       # Supabase integration
│   └── utils/              # Helper functions
├── backend/
│   ├── app/                # FastAPI application
│   ├── data_samples/       # Sample data for seeding
│   └── prompt_templates/   # LLM prompt templates
├── supabase/
│   └── migrations/         # Database migrations
└── public/                 # Static assets
```

## 🧪 Testing

### Test Flows

1. **Text Query Test:**
```bash
# Start both frontend and backend
npm run dev  # Terminal 1
cd backend && uvicorn app.main:app --reload  # Terminal 2

# Test: Ask "When should I irrigate my wheat in Bengaluru?"
# Expected: JSON response with sources and recommendations
```

2. **Voice Input Test:**
```bash
# Click microphone button and speak
# Expected: Speech transcription and query processing
```

3. **Image Upload Test:**
```bash
# Upload sample image from data_samples/
# Expected: Image uploaded to Supabase, analysis returned
```

4. **Policy Matching Test:**
```bash
# Select state: Karnataka, crop: wheat
# Expected: PM-KISAN and PMFBY schemes displayed
```

5. **Offline Test:**
```bash
# Disconnect network and reload
# Expected: PWA shows cached UI and last results
```

## 🔧 Troubleshooting

### Common Issues

**CORS Errors:**
```bash
# Ensure backend CORS_ORIGINS includes frontend URL
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

**OpenAI API Fallback:**
```bash
# Backend works without OpenAI key using deterministic responses
# For full functionality, add OPENAI_API_KEY to backend/.env
```

**Supabase Connection:**
```bash
# Verify environment variables are set correctly
# Check Supabase project URL and anon key
# Ensure pgvector extension is enabled
```

## 🎥 Demo Script (60 seconds)

1. **Opening (10s)**: "FarmGuru - AI assistant for farmers in Hindi and English"
2. **Voice Query (15s)**: Click mic, ask "When to plant tomatoes in Karnataka?"
3. **Image Upload (15s)**: Upload leaf image, show disease detection
4. **Government Schemes (10s)**: Show PM-KISAN eligibility and documents
5. **Community (10s)**: Create post, show farmer interactions

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Indian Council of Agricultural Research (ICAR) for agricultural guidelines
- India Meteorological Department (IMD) for weather data
- Ministry of Agriculture & Farmers Welfare for scheme information
- Farmers across India for their valuable feedback and insights

## ✨ New Multi-Page UI (React Router v6)

- Home `/` – Hero with voice CTA, quick prompts
- Query `/query` – Text/voice/image query with animated results and sources
- Weather `/weather` – District/state forecasts with irrigation guidance
- Market `/market` – Commodity search, 7-day sparkline and BUY/HOLD/SELL
- Schemes `/schemes` – PM-KISAN/PMFBY matching and Apply links
- Diagnostics `/diagnostics` – Image upload, stubbed results, safety warnings
- Community `/community` – Feed, create post, comments, moderation hint
- Profile `/profile` – Saved queries/alerts placeholders and language note
- Admin `/admin` – Flagged queries with moderation actions (stub)
- About `/about` – Data sources, accessibility, limitations and ethics

### Design System
- Palette: Forest `#2a8f6d` → Leaf `#74c69d` gradient, Accent Sun `#f6a71d`
- Typography: Inter + Noto Sans Devanagari, mobile-first sizes
- Cards: Glass effect with backdrop-blur, rounded-2xl, soft shadows
- Animations: Framer Motion slide/fade + micro hover scale via `AnimatedCard`
- Background: Subtle leaf gradients via `src/styles/backgrounds.css`

### Accessibility
- Keyboard focusable controls, visible focus styles
- `aria-live` announcements for results/status
- Alt text and SVG titles included

## 🧩 How to Run Locally

1. Install deps
```bash
npm install
```
2. Create `.env` in project root (optional but recommended)
```bash
VITE_API_URL=http://localhost:8000
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```
3. Start frontend
```bash
npm run dev
```
4. Start backend (separate terminal)
```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Notes:
- Without `VITE_API_URL`, app runs in demo mode with deterministic fallbacks.
- Without Supabase keys, image upload features show a dev-only banner and gracefully degrade.

## 🎥 Updated Demo Script (30–60s)

1. Home: show hero + voice CTA and quick prompts
2. Query: type a question, submit, show animated ResultCard and sources
3. Market: search "tomato", see sparkline and SELL/HOLD/BUY
4. Schemes: choose state/crop, view at least one scheme and Apply link
5. Diagnostics: upload `sample_leaf_1.jpg`, see progress and safe recommendation
6. Community: create a post; show optimistic render
7. PWA: install prompt and offline reload (last query appears)

## 📸 Screenshots to Capture

- Home hero + quick prompts
- Query with results and sources
- Market with sparkline and signal badge
- Schemes with policy cards and Apply
- Diagnostics with upload progress + warning

## 🗺️ Files Added/Modified

- Components: `Header`, `Footer`, `BottomTabs`, `HeroIllustration`, `AnimatedCard`, `Sparkline`
- Pages: Home, Query, Weather, Market, Schemes, Diagnostics, Community, Profile, Admin, About
- Routing: `src/routes.tsx`, wired in `src/App.tsx`
- Styles: `src/styles/backgrounds.css`
- Assets: `src/assets/hero-plant.svg`, `src/assets/bg-leaf-pattern.svg`
- Misc: `src/lib/analytics.ts`

## ✅ Acceptance Checklist

- Header logo → Home; Bottom tabs work on mobile
- Query calls backend at `/api/query` (with demo fallback)
- Voice/image supported in QueryInput; aria-live announcements
- Weather/Market/Schemes call respective endpoints with inputs
- Diagnostics uses Supabase upload + chem recommendations fallback
- Community supports creating posts with optimistic UI
- Installable PWA; offline shows last cached query
- Keyboard-only navigation reaches mic, input, submit, and sources