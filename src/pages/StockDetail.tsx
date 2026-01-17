import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useStockStore } from '../store/useStockStore';
import { useAuthStore } from '../store/useAuthStore';
import Layout from '../components/Layout';
import StockChart from '../components/StockChart';
import StockHeader from '../components/StockHeader';
import StockStats from '../components/StockStats';
import { Loader2, Activity } from 'lucide-react';
import { cn } from '../lib/utils';

const StockDetail: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const { quote, history, isLoading, error, fetchQuote, fetchHistory } = useStockStore();
  const { wishlist, addToWishlist, removeFromWishlist } = useAuthStore();
  const [period, setPeriod] = useState('1mo');
  const pollingInterval = useRef<NodeJS.Timeout | null>(null);

  const isWishlisted = quote ? wishlist.includes(quote.symbol) : false;

  const toggleWishlist = () => {
    if (!quote) return;
    if (isWishlisted) {
      removeFromWishlist(quote.symbol);
    } else {
      addToWishlist(quote.symbol);
    }
  };

  useEffect(() => {
    if (symbol) {
      fetchQuote(symbol);
      fetchHistory(symbol, period);

      pollingInterval.current = setInterval(() => {
        fetchQuote(symbol);
      }, 10000);
    }

    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
      }
    };
  }, [symbol, period, fetchQuote, fetchHistory]);

  const periods = [
    { label: '1D', value: '1d' },
    { label: '5D', value: '5d' },
    { label: '1M', value: '1mo' },
    { label: '3M', value: '3mo' },
    { label: '6M', value: '6mo' },
    { label: '1Y', value: '1y' },
    { label: 'YTD', value: 'ytd' },
  ];

  if (isLoading && !quote) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        </div>
      </Layout>
    );
  }

  if (error || !quote) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
          <div className="bg-red-50 p-4 rounded-full mb-4">
            <Activity className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Stock Not Found</h2>
          <p className="text-gray-500 max-w-md">
            We couldn't find the stock symbol you're looking for. Please check the symbol and try again.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8 animate-fade-in">
        <StockHeader 
          quote={quote} 
          toggleWishlist={toggleWishlist} 
          isWishlisted={isWishlisted} 
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-blue-500" />
                  Price History
                </h3>
                <div className="flex bg-gray-100 p-1 rounded-lg">
                  {periods.map((p) => (
                    <button
                      key={p.value}
                      onClick={() => setPeriod(p.value)}
                      className={cn(
                        "px-3 py-1 text-xs font-semibold rounded-md transition-all duration-200",
                        period === p.value
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-gray-500 hover:text-gray-900 hover:bg-gray-200/50"
                      )}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-[400px] w-full">
                {history ? (
                  <StockChart data={history} />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gray-50/50 rounded-xl">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <StockStats quote={quote} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StockDetail;
