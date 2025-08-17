import { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import AnimatedCard from '@/components/AnimatedCard';
import { MarketCard } from '@/components/MarketCard';
import prices from '@/data/prices.json';

const MarketChart = lazy(() => import('@/components/MarketChart'));

type CommodityKey = keyof typeof prices;

const MarketPage = () => {
  const [commodity, setCommodity] = useState<CommodityKey>('tomato');
  const [mandi, setMandi] = useState('Bangalore');
  const [submitted, setSubmitted] = useState<{ commodity: CommodityKey; mandi: string }>({ commodity: 'tomato', mandi: 'Bangalore' });
  const liveRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (liveRef.current) liveRef.current.textContent = `Loading market for ${submitted.commodity} in ${submitted.mandi}`; }, [submitted]);

  return (
    <div className="space-y-6">
      <AnimatedCard className="p-4">
        <h1 className="text-xl font-semibold mb-2">Market</h1>
        <p className="text-sm text-muted-foreground mb-3">Live commodity prices, 7-day trend sparkline and BUY/SELL/HOLD signals.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input value={commodity} onChange={(e) => setCommodity(e.target.value as CommodityKey)} placeholder="Commodity" aria-label="Commodity" />
          <Input value={mandi} onChange={(e) => setMandi(e.target.value)} placeholder="Mandi" aria-label="Mandi" />
          <Button onClick={() => setSubmitted({ commodity, mandi })} className="w-full">Get Prices</Button>
        </div>
        <div ref={liveRef} aria-live="polite" className="sr-only" />
      </AnimatedCard>

      <MarketCard commodity={submitted.commodity} mandi={submitted.mandi} />

      <AnimatedCard className="p-4">
        <h2 className="font-medium mb-2">7-day Chart</h2>
        <Suspense fallback={<div className="text-sm text-muted-foreground">Loading chart…</div>}>
          <MarketChart data={prices[submitted.commodity]} />
        </Suspense>
      </AnimatedCard>
    </div>
  );
};

export default MarketPage;