import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useStockStore } from '../store/useStockStore';
import { useAuthStore } from '../store/useAuthStore';
import Layout from '../components/Layout';
import StockChart from '../components/StockChart';
import { Loader2, ArrowUp, ArrowDown, Activity, DollarSign, BarChart2, TrendingUp, Heart } from 'lucide-react';
import { cn } from '../lib/utils';
import { getLogoUrl } from '../lib/logo';

const StockDetail: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const { quote, history, isLoading, error, fetchQuote, fetchHistory } = useStockStore();
  const { wishlist, addToWishlist, removeFromWishlist } = useAuthStore();
  const [period, setPeriod] = useState('1mo');
  const [imageError, setImageError] = useState(false);
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

      // Start polling every 10 seconds for real-time price updates
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

  const isPositive = quote.change >= 0;
  const logoUrl = getLogoUrl(quote.website, quote.symbol);

  return (
    <Layout>
      <div className="space-y-8 animate-fade-in">
        {/* Header Section */}
        <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex items-start space-x-5">
              <div className="flex-shrink-0">
                {logoUrl && !imageError ? (
                  <img 
                    src={logoUrl} 
                    alt={`${quote.symbol} logo`} 
                    className="h-16 w-16 md:h-20 md:w-20 rounded-2xl object-contain bg-gray-50 border border-gray-100 p-2 shadow-sm"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="h-16 w-16 md:h-20 md:w-20 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100 shadow-sm">
                    <span className="text-2xl font-bold text-blue-600">{quote.symbol[0]}</span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                  {quote.symbol}
                </h1>
                <p className="text-lg text-gray-500 font-medium mt-1">
                  {quote.name || quote.symbol}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    Stock
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {quote.exchange || 'US Market'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
                  ${quote.price.toFixed(2)}
                </span>
              </div>
              <div className={cn(
                "flex items-center mt-2 px-3 py-1 rounded-lg font-semibold text-sm",
                isPositive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
              )}>
                {isPositive ? <ArrowUp className="h-4 w-4 mr-1.5" /> : <ArrowDown className="h-4 w-4 mr-1.5" />}
                <span className="text-lg">${Math.abs(quote.change).toFixed(2)}</span>
                <span className="mx-1.5 opacity-30">|</span>
                <span className="text-lg">{Math.abs(quote.changePercent).toFixed(2)}%</span>
              </div>
              <p className="text-xs text-gray-400 mt-2 font-medium">
                Last updated: {new Date(quote.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart Column */}
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

          {/* Stats Column */}
          <div className="space-y-6">
            <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <BarChart2 className="h-5 w-5 mr-2 text-blue-500" />
                Key Statistics
              </h3>
              
              <div className="grid grid-cols-1 gap-y-5">
                <div className="flex items-center justify-between p-3 bg-gray-50/50 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex items-center text-sm text-gray-500">
                    <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                    Market Cap
                  </div>
                  <div className="font-bold text-gray-900">
                    ${(quote.marketCap / 1e9).toFixed(2)}B
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50/50 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex items-center text-sm text-gray-500">
                    <TrendingUp className="h-4 w-4 mr-2 text-gray-400" />
                    Volume
                  </div>
                  <div className="font-bold text-gray-900">
                    {(quote.volume / 1e6).toFixed(2)}M
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50/50 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex items-center text-sm text-gray-500">
                    <Activity className="h-4 w-4 mr-2 text-gray-400" />
                    P/E Ratio
                  </div>
                  <div className="font-bold text-gray-900">
                    {quote.peRatio ? quote.peRatio.toFixed(2) : 'N/A'}
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50/50 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex items-center text-sm text-gray-500">
                    <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                    EPS
                  </div>
                  <div className="font-bold text-gray-900">
                    {quote.eps ? `$${quote.eps.toFixed(2)}` : 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StockDetail;
