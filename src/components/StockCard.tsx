import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { MarketIndex } from '../types';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

interface StockCardProps {
  data: MarketIndex;
}

const StockCard: React.FC<StockCardProps> = ({ data }) => {
  const isPositive = data.change >= 0;
  const navigate = useNavigate();

  const handleClick = () => {
      // Remove the caret (^) from the symbol if present for the URL
      const cleanSymbol = data.symbol.replace('^', '');
      // For indices, we might want to keep the caret or handle it specifically in the backend.
      // However, yfinance usually expects the caret for indices.
      // Let's pass the full symbol and let the backend/frontend logic handle it.
      // Actually, standard URLs might not like '^', but let's try.
      // If it's an index, usually we want to see its detail page too.
      navigate(`/stock/${encodeURIComponent(data.symbol)}`);
  };

  return (
    <div 
      onClick={handleClick}
      className="bg-white overflow-hidden shadow rounded-lg p-5 cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm font-medium text-gray-500 truncate">{data.name}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{data.price.toLocaleString()}</p>
        </div>
        <div className={cn(
          "flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium",
          isPositive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        )}>
          {isPositive ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
          {Math.abs(data.changePercent).toFixed(2)}%
        </div>
      </div>
      <div className="mt-2">
        <span className={cn(
          "text-sm",
          isPositive ? "text-green-600" : "text-red-600"
        )}>
          {data.change > 0 ? '+' : ''}{data.change.toFixed(2)}
        </span>
        <span className="text-sm text-gray-500 ml-2">Today</span>
      </div>
    </div>
  );
};

export default StockCard;
