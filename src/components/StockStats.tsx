import React from 'react';
import { DollarSign, BarChart2, TrendingUp, Activity } from 'lucide-react';

interface StockStatsProps {
  quote: any;
}

const StockStats: React.FC<StockStatsProps> = ({ quote }) => {
  return (
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
  );
};

export default StockStats;
