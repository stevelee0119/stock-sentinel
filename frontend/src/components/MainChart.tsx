import { useMemo } from 'react';
import type { StockData } from '../services/api';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface MainChartProps {
  stocks: StockData[];
}

const COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

const MainChart = ({ stocks }: MainChartProps) => {
  const chartData = useMemo(() => {
    if (stocks.length === 0) return [];

    const dateMap: { [key: string]: any } = {};
    
    stocks.forEach((stock) => {
      const basePrice = stock.history[0]?.close;
      if (!basePrice) return;

      stock.history.forEach((h) => {
        if (!dateMap[h.date]) {
          dateMap[h.date] = { date: h.date };
        }
        const yieldValue = ((h.close - basePrice) / basePrice) * 100;
        dateMap[h.date][stock.name] = parseFloat(yieldValue.toFixed(2));
      });
    });

    return Object.values(dateMap).sort((a: any, b: any) => a.date.localeCompare(b.date));
  }, [stocks]);

  return (
    <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/50 p-6 rounded-2xl shadow-2xl h-[500px]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-black text-slate-100 tracking-tight">Yield Performance Analytics</h2>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">7-Day Relative Growth (%)</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="#475569" 
            tick={{ fontSize: 10, fontWeight: 700 }}
            tickFormatter={(value) => value.substring(5)} 
            dy={10}
          />
          <YAxis 
            stroke="#475569" 
            tick={{ fontSize: 10, fontWeight: 700 }}
            unit="%" 
            dx={-10}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(15, 23, 42, 0.9)', 
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(51, 65, 85, 0.5)', 
              borderRadius: '12px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }}
            itemStyle={{ fontSize: '12px', fontWeight: 600 }}
          />
          <Legend 
            verticalAlign="top" 
            align="right" 
            iconType="circle"
            wrapperStyle={{ paddingTop: '0', paddingBottom: '20px' }} 
          />
          {stocks.map((stock, index) => (
            <Line
              key={stock.symbol}
              type="monotone"
              dataKey={stock.name}
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2, fill: '#0f172a' }}
              activeDot={{ r: 6, strokeWidth: 0 }}
              animationDuration={1500}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MainChart;
