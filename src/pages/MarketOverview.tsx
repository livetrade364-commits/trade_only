import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { ArrowUp, ArrowDown, RefreshCw, TrendingUp, TrendingDown, Activity, Zap, HeartPulse, Pill } from 'lucide-react';
import { cn, API_URL } from '../lib/utils';
import { getLogoUrl } from '../lib/logo';

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  percent_change: number;
}

const StockLogo = ({ symbol, name }: { symbol: string, name: string }) => {
  const [error, setError] = useState(false);
  const logoUrl = getLogoUrl(undefined, symbol);

  if (error || !logoUrl) {
    return (
      <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-gray-100 text-gray-600">
        {symbol[0]}
      </div>
    );
  }

  return (
    <img 
      src={logoUrl} 
      alt={name}
      className="w-10 h-10 rounded-full object-contain bg-white border border-gray-100 p-1"
      onError={() => setError(true)}
    />
  );
};

export default function MarketOverview() {
  const [moversType, setMoversType] = useState<'gainers' | 'losers'>('gainers');
  const [movers, setMovers] = useState<StockData[]>([]);
  const [techStocks, setTechStocks] = useState<StockData[]>([]);
  const [healthStocks, setHealthStocks] = useState<StockData[]>([]);
  const [pharmaStocks, setPharmaStocks] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [moversRes, techRes, healthRes, pharmaRes] = await Promise.all([
        fetch(`${API_URL}/api/market/movers?type=${moversType}`),
        fetch(`${API_URL}/api/market/sector/tech`),
        fetch(`${API_URL}/api/market/sector/health`),
        fetch(`${API_URL}/api/market/sector/pharma`)
      ]);

      setMovers(await moversRes.json());
      setTechStocks(await techRes.json());
      setHealthStocks(await healthRes.json());
      setPharmaStocks(await pharmaRes.json());
    } catch (error) {
      console.error('Failed to fetch market data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [moversType]);

  const StockCard = ({ stock }: { stock: StockData }) => (
    <Link 
      to={`/stock/${stock.symbol}`}
      className="block bg-white p-4 rounded-xl border border-gray-100 hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
           <StockLogo symbol={stock.symbol} name={stock.name} />
           <div>
             <h4 className="font-bold text-gray-900">{stock.symbol}</h4>
             <p className="text-xs text-gray-500 truncate w-20">{stock.name}</p>
           </div>
        </div>
        <div className={`text-sm font-medium ${stock.percent_change >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
          {stock.percent_change >= 0 ? '+' : ''}{stock.percent_change.toFixed(2)}%
        </div>
      </div>
      <div className="mt-3 font-mono font-semibold text-gray-900 text-right">
        ${stock.price.toFixed(2)}
      </div>
    </Link>
  );

  return (
    <Layout>
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Market Overview</h1>
            <p className="text-gray-500">In-depth analysis of sectors and top movers</p>
          </div>
          <button 
            onClick={fetchData}
            className="p-2 text-gray-500 hover:text-emerald-600 transition-colors bg-white border border-gray-200 rounded-lg shadow-sm w-fit"
            title="Refresh Data"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        {/* Top Movers Section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-blue-500" />
              Market Movers
            </h3>
            <div className="flex bg-gray-100 p-1 rounded-lg w-fit">
              <button
                onClick={() => setMoversType('gainers')}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all",
                  moversType === 'gainers'
                    ? "bg-white text-emerald-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                )}
              >
                <TrendingUp size={16} />
                Top Gainers
              </button>
              <button
                onClick={() => setMoversType('losers')}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all",
                  moversType === 'losers'
                    ? "bg-white text-red-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                )}
              >
                <TrendingDown size={16} />
                Top Losers
              </button>
            </div>
          </div>
          
          <div className="divide-y divide-gray-100">
            {loading ? (
              <div className="p-8 text-center text-gray-400">Loading market data...</div>
            ) : movers.length === 0 ? (
              <div className="p-8 text-center text-gray-400">No data available</div>
            ) : (
              movers.map((mover) => (
                <Link 
                  key={mover.symbol}
                  to={`/stock/${mover.symbol}`}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <StockLogo symbol={mover.symbol} name={mover.name} />
                    <div>
                      <h4 className="font-bold text-gray-900">{mover.symbol}</h4>
                      <p className="text-xs text-gray-500">{mover.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-medium text-gray-900">${mover.price.toFixed(2)}</div>
                    <div className={cn(
                      "text-xs font-medium flex items-center justify-end mt-0.5",
                      mover.percent_change >= 0 ? "text-emerald-600" : "text-red-600"
                    )}>
                      {mover.percent_change >= 0 ? '+' : ''}{mover.percent_change.toFixed(2)}%
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Sector Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tech Sector */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <Zap className="h-5 w-5 mr-2 text-yellow-500" />
              Technology
            </h3>
            <div className="space-y-3">
              {techStocks.map(stock => <StockCard key={stock.symbol} stock={stock} />)}
            </div>
          </div>

          {/* Health Sector */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <HeartPulse className="h-5 w-5 mr-2 text-rose-500" />
              Healthcare
            </h3>
            <div className="space-y-3">
              {healthStocks.map(stock => <StockCard key={stock.symbol} stock={stock} />)}
            </div>
          </div>

          {/* Pharma Sector */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <Pill className="h-5 w-5 mr-2 text-purple-500" />
              Pharma
            </h3>
            <div className="space-y-3">
              {pharmaStocks.map(stock => <StockCard key={stock.symbol} stock={stock} />)}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
