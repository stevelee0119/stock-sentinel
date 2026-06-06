import React from 'react';
import type { StockData } from '../services/api';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

interface StockGridProps {
  stocks: StockData[];
}

const StockGrid: React.FC<StockGridProps> = ({ stocks }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-10">
      {stocks.map((stock) => {
        const isPositive = stock.change > 0;
        const isNegative = stock.change < 0;

        return (
          <div 
            key={stock.symbol} 
            className="group relative bg-slate-900/50 backdrop-blur-sm border border-slate-800/60 p-5 rounded-2xl shadow-xl hover:shadow-2xl hover:border-slate-600/50 transition-all duration-300 overflow-hidden flex flex-col justify-between h-full"
          >
            {/* Top Section: Name and Symbol */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg text-slate-100 group-hover:text-white transition-colors leading-tight mb-1">
                  {stock.name}
                </h3>
                <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase bg-slate-800/50 px-2 py-0.5 rounded-md">
                  {stock.symbol.split('.')[0]}
                </span>
              </div>
              <div className={`p-2 rounded-lg ${
                isPositive ? 'bg-red-500/10 text-red-500' : 
                isNegative ? 'bg-blue-500/10 text-blue-500' : 
                'bg-slate-500/10 text-slate-500'
              }`}>
                {isPositive ? <TrendingUp size={18} /> : 
                 isNegative ? <TrendingDown size={18} /> : 
                 <Minus size={18} />}
              </div>
            </div>

            {/* Middle Section: Price */}
            <div className="mb-4">
              <div className="text-3xl font-black text-white tracking-tight">
                {stock.price.toLocaleString()}
                <span className="text-sm font-medium text-slate-500 ml-1">KRW</span>
              </div>
              <div className={`flex items-center gap-1.5 mt-1 text-sm font-bold ${
                isPositive ? 'text-red-500' : 
                isNegative ? 'text-blue-500' : 
                'text-slate-400'
              }`}>
                <span>{isPositive ? '▲' : isNegative ? '▼' : '-'}</span>
                <span>{Math.abs(stock.change).toLocaleString()}</span>
                <span className="opacity-80">({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)</span>
              </div>
            </div>

            {/* Sparkline Chart */}
            <div className="h-16 -mx-5 -mb-5 mt-auto bg-slate-950/30">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stock.history}>
                  <YAxis hide domain={['auto', 'auto']} />
                  <Line 
                    type="monotone" 
                    dataKey="close" 
                    stroke={isPositive ? '#ef4444' : isNegative ? '#3b82f6' : '#94a3b8'} 
                    strokeWidth={2} 
                    dot={false}
                    isAnimationActive={true}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            {/* Hover Indicator */}
            <div className={`absolute bottom-0 left-0 w-full h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ${
              isPositive ? 'bg-red-500' : isNegative ? 'bg-blue-500' : 'bg-slate-500'
            }`} />
          </div>
        );
      })}
    </div>
  );
};

export default StockGrid;
