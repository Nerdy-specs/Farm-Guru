import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from 'recharts';

interface PricePoint { date: string; price: number; volume?: number }

interface MarketChartProps {
	data: PricePoint[];
	smaPeriod?: number;
}

const MarketChart: React.FC<MarketChartProps> = ({ data, smaPeriod = 7 }) => {
	if (!data || data.length === 0) return null;
	// Simple SMA
	const sma = data.map((_, idx) => {
		if (idx < smaPeriod - 1) return null;
		const window = data.slice(idx - smaPeriod + 1, idx + 1);
		return window.reduce((acc, p) => acc + p.price, 0) / smaPeriod;
	});
	const annotated = data.map((p, i) => ({ ...p, sma: sma[i] }));
	const last = annotated[annotated.length - 1];
	const signal = last && last.sma ? (last.price > last.sma ? 'SELL' : last.price < last.sma ? 'BUY' : 'HOLD') : 'HOLD';
	const signalColor = signal === 'BUY' ? '#22c55e' : signal === 'SELL' ? '#ef4444' : '#f59e0b';

	return (
		<div className="w-full h-64">
			<ResponsiveContainer width="100%" height="100%">
				<LineChart data={annotated} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
					<CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
					<XAxis dataKey="date" tick={{ fontSize: 11 }} hide />
					<YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${v}`} width={50} />
					<Tooltip formatter={(v: any) => [`₹${v}`, 'Price']} labelFormatter={(l) => String(l)} />
					<Line type="monotone" dataKey="price" stroke="#2A8F6D" strokeWidth={2} dot={false} />
					<Line type="monotone" dataKey="sma" stroke="#64748b" strokeWidth={1.5} dot={false} />
					{last && <ReferenceLine y={last.sma || 0} stroke="#64748b" strokeDasharray="4 4" />}
				</LineChart>
			</ResponsiveContainer>
			<div className="text-xs text-muted-foreground mt-2">Signal: <span style={{ color: signalColor }}>{signal}</span></div>
		</div>
	);
};

export default MarketChart;