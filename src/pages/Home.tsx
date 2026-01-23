import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { ArrowUp, ArrowDown, RefreshCw, TrendingUp } from 'lucide-react';
import { getLogoUrl } from '../lib/logo';
import { API_URL } from '../lib/utils';

interface MarketIndex {
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
      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-gray-100 text-gray-600`}>
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

export default function Home() {
  const [indices, setIndices] = useState<MarketIndex[]>([]);
  const [movers, setMovers] = useState<MarketIndex[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMarketData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [overviewRes, moversRes] = await Promise.all([
        fetch(`${API_URL}/api/market/overview`),
        fetch(`${API_URL}/api/market/movers`)
      ]);

      if (!overviewRes.ok || !moversRes.ok) {
        throw new Error('Failed to fetch market data');
      }

      const overviewData = await overviewRes.json();
      const moversData = await moversRes.json();

      setIndices(overviewData);
      setMovers(moversData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
  }, []);

  return (
    <Layout>
      <div className="space-y-6 lg:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Market Overview</h1>
            <p className="text-gray-500 text-sm mt-1">Global market performance and top movers</p>
          </div>
          <button 
            onClick={fetchMarketData}
            className="p-2 text-gray-500 hover:text-emerald-600 transition-colors bg-white border border-gray-200 rounded-lg shadow-sm w-fit"
            title="Refresh Data"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100">
            {error}
            <p className="text-sm mt-1 text-red-500">Make sure the backend server is running.</p>
          </div>
        )}

        {/* Indices Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading && !indices.length ? (
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-pulse h-32"></div>
            ))
          ) : (
            indices.map((index) => (
              <Link to={`/stock/${index.symbol}`} key={index.symbol} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow block">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{index.name}</h3>
                    <span className="text-xs text-gray-500 font-mono">{index.symbol}</span>
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-medium ${index.change >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {index.change >= 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                    {Math.abs(index.percent_change).toFixed(2)}%
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-2xl font-bold text-gray-900">
                    {index.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <div className={`text-sm mt-1 ${index.change >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {index.change >= 0 ? '+' : ''}{index.change.toFixed(2)}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Movers Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
                  Top Movers (Tech)
                </h3>
              </div>
              
              <div className="space-y-4">
                {loading && !movers.length ? (
                  [1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-16 bg-gray-50 rounded-xl animate-pulse"></div>
                  ))
                ) : (
                  movers.map((mover) => (
                    <Link 
                      key={mover.symbol} 
                      to={`/stock/${mover.symbol}`}
                      className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl hover:bg-gray-50 transition-colors group"
                    >
                      <div className="flex items-center gap-4">
                        <StockLogo symbol={mover.symbol} name={mover.name} />
                        <div>
                          <h4 className="font-bold text-gray-900">{mover.symbol}</h4>
                          <p className="text-xs text-gray-500">{mover.name}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-mono font-medium text-gray-900">
                          ${mover.price.toFixed(2)}
                        </div>
                        <div className={`text-xs font-medium flex items-center justify-end mt-0.5 ${
                          mover.change >= 0 ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                          {mover.change >= 0 ? '+' : ''}{mover.percent_change.toFixed(2)}%
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
             <div className="bg-emerald-50 rounded-2xl p-8 border border-emerald-100 h-full">
              <h2 className="text-xl font-bold text-emerald-900 mb-2">Welcome to Tradex</h2>
              <p className="text-emerald-700 mb-6">
                Search for stocks using the search bar above, or check your portfolio and watchlist in the sidebar.
              </p>
              <Link to="/search" className="block w-full py-3 px-4 bg-emerald-600 text-white text-center font-medium rounded-xl hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-200">
                Find Stocks
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
