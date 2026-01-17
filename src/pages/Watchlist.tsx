import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuthStore } from '../store/useAuthStore';
import { ArrowUp, ArrowDown, Trash2, Loader2 } from 'lucide-react';
import { getLogoUrl } from '../lib/logo';
import { API_URL } from '../lib/utils';

interface WatchlistItem {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  name: string;
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

export default function Watchlist() {
  const { wishlist, removeFromWishlist, isAuthenticated } = useAuthStore();
  const [data, setData] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (wishlist.length === 0) {
        setData([]);
        return;
      }

      setLoading(true);
      try {
        // Fetch data for each symbol
        // In a real app, we'd have a bulk endpoint
        const promises = wishlist.map(async (symbol) => {
          try {
            const res = await fetch(`${API_URL}/api/stock/${symbol}`);
            if (!res.ok) return null;
            const quote = await res.json();
            return {
              symbol: quote.symbol,
              name: quote.name,
              price: quote.price,
              change: quote.change,
              changePercent: quote.percent_change,
            };
          } catch {
            return null;
          }
        });

        const results = await Promise.all(promises);
        setData(results.filter((item): item is WatchlistItem => item !== null));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [wishlist]);

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-gray-900">Sign in to view your watchlist</h2>
          <p className="mt-2 text-gray-500 mb-6">Track your favorite stocks in one place.</p>
          <Link to="/login" className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
            Sign In
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Your Watchlist</h1>

        {wishlist.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-500">Your watchlist is empty.</p>
            <Link to="/search" className="text-emerald-600 hover:underline mt-2 inline-block">
              Search for stocks to add
            </Link>
          </div>
        ) : loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-emerald-600" size={32} />
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="divide-y divide-gray-100">
              {data.map((item) => (
                <div key={item.symbol} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 hover:bg-gray-50 transition-colors gap-4">
                  <Link to={`/stock/${item.symbol}`} className="flex-1 flex items-center gap-4">
                    <StockLogo symbol={item.symbol} name={item.name} />
                    <div className="w-16">
                      <span className="font-bold text-gray-900">{item.symbol}</span>
                    </div>
                    <div className="flex-1 px-4 hidden sm:block">
                      <div className="text-sm text-gray-500 truncate">{item.name}</div>
                    </div>
                  </Link>
                  
                  <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto mt-2 sm:mt-0 pl-14 sm:pl-0">
                    <div className="text-left sm:text-right w-32">
                      <div className="font-mono font-medium">${item.price.toFixed(2)}</div>
                      <div className="text-xs text-gray-500 sm:hidden">{item.name}</div>
                    </div>
                    <div className={`text-right w-24 flex justify-end ${item.change >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      <div className="flex items-center gap-1">
                        {item.change >= 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                        {Math.abs(item.changePercent).toFixed(2)}%
                      </div>
                    </div>
                    <button 
                      onClick={() => removeFromWishlist(item.symbol)}
                      className="ml-4 p-2 text-gray-400 hover:text-red-500 transition-colors"
                      title="Remove from watchlist"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
