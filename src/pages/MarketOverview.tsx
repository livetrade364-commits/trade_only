import React, { useEffect } from 'react';
import { useMarketStore } from '../store/useMarketStore';
import Layout from '../components/Layout';
import SectorCard from '../components/SectorCard';
import { Loader2 } from 'lucide-react';

const MarketOverview: React.FC = () => {
  const { 
    sectorPerformance, 
    isLoading, 
    error, 
    fetchSectorPerformance,
  } = useMarketStore();

  useEffect(() => {
    fetchSectorPerformance();
  }, [fetchSectorPerformance]);

  return (
    <Layout>
      <div className="space-y-10">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate mb-6">
            Market Overview
          </h2>
          
          {/* Sector Performance Section */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Sector Performance
            </h3>
            {isLoading && sectorPerformance.length === 0 ? (
               <div className="flex justify-center py-10">
                 <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
               </div>
            ) : error ? (
              <div className="bg-red-50 p-4 rounded-md">
                <p className="text-red-700">{error}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {sectorPerformance.map((sector) => (
                  <SectorCard key={sector.symbol} data={sector} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MarketOverview;
