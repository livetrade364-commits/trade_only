import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, TrendingUp } from 'lucide-react';
import { StockGainer } from '../types';
import { getLogoUrl } from '../lib/logo';

interface GainerCardProps {
  data: StockGainer;
}

const GainerCard: React.FC<GainerCardProps> = ({ data }) => {
  const [imageError, setImageError] = useState(false);
  const logoUrl = getLogoUrl(data.website);

  return (
    <Link to={`/stock/${data.symbol}`} className="block">
      <div className="bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow rounded-xl p-4 border border-gray-100 h-full">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center space-x-3">
            {logoUrl && !imageError ? (
              <img 
                src={logoUrl} 
                alt={`${data.symbol} logo`} 
                className="h-10 w-10 rounded-full object-contain bg-gray-50 p-1"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="bg-green-50 p-2.5 rounded-full text-green-600">
                <TrendingUp className="h-5 w-5" />
              </div>
            )}
            <div>
              <h4 className="font-bold text-gray-900">{data.symbol}</h4>
              <p className="text-xs text-gray-500 truncate max-w-[100px]" title={data.name}>{data.name}</p>
            </div>
          </div>
          <div className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full flex items-center">
            <ArrowUp className="h-3 w-3 mr-0.5" />
            {data.changePercent.toFixed(2)}%
          </div>
        </div>
        
        <div className="flex justify-between items-end mt-4">
          <div>
            <p className="text-2xl font-bold text-gray-900">${data.price.toFixed(2)}</p>
            <p className="text-sm text-green-600 font-medium">+{data.change.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GainerCard;
