import { useState, useEffect } from 'react';
import { type StockData, fetchStocks } from './services/api';
import StockGrid from './components/StockGrid';
import MainChart from './components/MainChart';
import { LayoutDashboard, RefreshCcw } from 'lucide-react';

function App() {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const loadData = async () => {
    try {
      console.log('Fetching stocks...');
      const data = await fetchStocks();
      console.log('Data received:', data);
      if (data && data.length > 0) {
        setStocks(data);
        setError(null);
      } else {
        setError('데이터가 비어 있습니다.');
      }
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Failed to load stocks:', err);
      setError('서버 연결 실패. 백엔드 서버가 실행 중인지 확인하세요.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 max-w-[1600px] mx-auto min-h-screen bg-slate-950 text-slate-50 selection:bg-red-500/30">
      <header className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-6 bg-slate-900/40 backdrop-blur-md p-6 rounded-2xl border border-slate-800/50 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-red-500 to-red-700 p-3 rounded-xl shadow-lg shadow-red-900/20">
            <LayoutDashboard className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-white uppercase leading-none">
              Stock <span className="text-red-500">Sentinel</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Real-time Market Monitor</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 font-mono bg-slate-950/50 px-3 py-1.5 rounded-full border border-slate-800">
              <RefreshCcw size={12} className={`${loading ? 'animate-spin' : ''} text-red-500`} />
              <span className="text-[10px] text-slate-500 uppercase tracking-tighter">Updated:</span>
              <span className="text-slate-200">{lastUpdated || '--:--:--'}</span>
            </div>
          </div>
        </div>
      </header>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 p-5 rounded-2xl mb-8 text-red-400 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {loading && stocks.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-slate-800 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-6 text-slate-400 font-bold tracking-widest uppercase text-xs animate-pulse">Synchronizing Data...</p>
        </div>
      ) : (
        <main className="space-y-8 animate-in fade-in duration-700">
          <section>
            <div className="flex items-center gap-2 mb-4 px-1">
              <div className="w-1 h-4 bg-red-600 rounded-full" />
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Market Overview</h2>
            </div>
            <StockGrid stocks={stocks} />
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4 px-1">
              <div className="w-1 h-4 bg-red-600 rounded-full" />
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Performance Analytics</h2>
            </div>
            <MainChart stocks={stocks} />
          </section>
          
          <footer className="mt-16 pt-10 border-t border-slate-900/50 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-600">
            <p className="text-xs font-medium tracking-wide italic">© 2026 Stock Sentinel. Intelligent Market Intelligence.</p>
            <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest">
              <span className="hover:text-slate-400 cursor-pointer transition-colors">Documentation</span>
              <span className="hover:text-slate-400 cursor-pointer transition-colors">Privacy</span>
              <span className="hover:text-slate-400 cursor-pointer transition-colors">API Status</span>
            </div>
          </footer>
        </main>
      )}
    </div>
  );
}

export default App;
