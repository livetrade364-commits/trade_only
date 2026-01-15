import React, { useEffect } from 'react';
import { useMarketStore } from '../store/useMarketStore';
import Layout from '../components/Layout';
import StockCard from '../components/StockCard';
import SectorCard from '../components/SectorCard';
import GainerCard from '../components/GainerCard';
import { Loader2 } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { 
    marketOverview, 
    sectorPerformance, 
    topGainers,
    isLoading, 
    error, 
    fetchMarketOverview, 
    fetchSectorPerformance,
    fetchTopGainers 
  } = useMarketStore();

  useEffect(() => {
    fetchMarketOverview();
    fetchSectorPerformance();
    fetchTopGainers();
  }, [fetchMarketOverview, fetchSectorPerformance, fetchTopGainers]);

  return (
    <Layout>
      <div className="space-y-10">
        {/* Market Overview Section */}
        <div>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate mb-6">
            Market Overview
          </h2>
          {isLoading && marketOverview.length === 0 ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : error ? (
            <div className="bg-red-50 p-4 rounded-md">
              <p className="text-red-700">{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {marketOverview.map((item) => (
                <StockCard key={item.symbol} data={item} />
              ))}
            </div>
          )}
        </div>

        {/* Top Gainers Section */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Top Gainers
          </h3>
          {topGainers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {topGainers.map((stock) => (
                <GainerCard key={stock.symbol} data={stock} />
              ))}
            </div>
          ) : (
             !isLoading && <p className="text-gray-500">No gainers data available at the moment.</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
