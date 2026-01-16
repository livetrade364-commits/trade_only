import React, { useEffect } from 'react';
import { useMarketStore } from '../store/useMarketStore';
import Layout from '../components/Layout';
import SectorCard from '../components/SectorCard';
import { Loader2, TrendingUp, TrendingDown, Activity, BarChart2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

const MarketOverview: React.FC = () => {
  const { 
    marketOverview,
    topGainers,
    sectorPerformance, 
    isLoading, 
    error, 
    fetchMarketOverview,
    fetchTopGainers,
    fetchSectorPerformance,
  } = useMarketStore();

  useEffect(() => {
    fetchMarketOverview();
    fetchTopGainers();
    fetchSectorPerformance();
  }, [fetchMarketOverview, fetchTopGainers, fetchSectorPerformance]);

  if (isLoading && marketOverview.length === 0 && topGainers.length === 0 && sectorPerformance.length === 0) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-[60vh]">
          <Loader2 className="h-12 w-12 animate-spin text-emerald-600" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-10 animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-900">Market Overview</h1>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Major Indices Section */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Activity className="h-6 w-6 text-emerald-600" />
            <h2 className="text-xl font-bold text-gray-900">Major Indices</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {marketOverview.map((index) => (
              <div key={index.symbol} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-900">{index.symbol}</h3>
                  {index.changePercent >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  ${index.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className={cn(
                  "flex items-center text-sm font-medium",
                  index.changePercent >= 0 ? "text-emerald-600" : "text-red-600"
                )}>
                  <span>{index.change >= 0 ? '+' : ''}{index.change.toFixed(2)}</span>
                  <span className="mx-1">|</span>
                  <span>{index.changePercent >= 0 ? '+' : ''}{index.changePercent.toFixed(2)}%</span>
                </div>
              </div>
            ))}
            {marketOverview.length === 0 && !isLoading && (
              <div className="col-span-full text-center text-gray-500 py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                No market indices data available
              </div>
            )}
          </div>
        </section>

        {/* Top Gainers Section */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-6 w-6 text-emerald-600" />
            <h2 className="text-xl font-bold text-gray-900">Top Gainers</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {topGainers.map((stock) => (
              <Link to={`/stock/${stock.symbol}`} key={stock.symbol} className="block group">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 group-hover:border-emerald-200 group-hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold">
                        {stock.symbol[0]}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">{stock.symbol}</h3>
                        <p className="text-xs text-gray-500 truncate max-w-[120px]">{stock.name}</p>
                      </div>
                    </div>
                    <div className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full">
                      +{stock.changePercent.toFixed(2)}%
                    </div>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-lg font-bold text-gray-900">${stock.price.toFixed(2)}</div>
                      <div className="text-xs text-emerald-600 font-medium">
                        +${stock.change.toFixed(2)} Today
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-gray-400 uppercase tracking-wider">Volume</div>
                      <div className="text-xs font-semibold text-gray-600">{(stock.volume / 1000000).toFixed(1)}M</div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
             {topGainers.length === 0 && !isLoading && (
              <div className="col-span-full text-center text-gray-500 py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                No top gainers data available
              </div>
            )}
          </div>
        </section>

        {/* Sector Performance Section */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <BarChart2 className="h-6 w-6 text-emerald-600" />
            <h2 className="text-xl font-bold text-gray-900">Sector Performance</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {sectorPerformance.map((sector) => (
              <SectorCard key={sector.symbol} data={sector} />
            ))}
            {sectorPerformance.length === 0 && !isLoading && (
              <div className="col-span-full text-center text-gray-500 py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                No sector performance data available
              </div>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default MarketOverview;
