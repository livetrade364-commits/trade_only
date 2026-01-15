import React from 'react';
import { ArrowUp, ArrowDown, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { SectorPerformance } from '../types';
import { cn } from '../lib/utils';

interface SectorCardProps {
  data: SectorPerformance;
}

const SectorCard: React.FC<SectorCardProps> = ({ data }) => {
  const isPositive = data.performance >= 0;

  return (
    <div className="bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow rounded-xl p-4 border border-gray-100 group">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className={cn(
            "p-2 rounded-lg transition-colors",
            isPositive ? "bg-green-50 text-green-600 group-hover:bg-green-100" : "bg-red-50 text-red-600 group-hover:bg-red-100"
          )}>
            {isPositive ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 line-clamp-1" title={data.name}>
              {data.name}
            </h4>
            <span className="text-xs text-gray-500 font-mono">{data.symbol}</span>
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex items-end justify-between">
        <div className="flex items-baseline space-x-1">
          <span className={cn(
            "text-2xl font-bold tracking-tight",
            isPositive ? "text-green-600" : "text-red-600"
          )}>
            {isPositive ? '+' : ''}{data.performance.toFixed(2)}
          </span>
          <span className={cn(
            "text-sm font-medium",
            isPositive ? "text-green-600" : "text-red-600"
          )}>
            %
          </span>
        </div>
        
        <div className={cn(
          "flex items-center text-xs font-medium px-2 py-1 rounded-full",
          isPositive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
        )}>
          {isPositive ? <ArrowUp className="h-3 w-3 mr-0.5" /> : <ArrowDown className="h-3 w-3 mr-0.5" />}
          {isPositive ? 'Gain' : 'Loss'}
        </div>
      </div>
      
      {/* Mini bar chart visualization */}
      <div className="mt-3 w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
        <div 
          className={cn("h-full rounded-full", isPositive ? "bg-green-500" : "bg-red-500")}
          style={{ width: `${Math.min(Math.abs(data.performance) * 10, 100)}%` }} 
        />
      </div>
    </div>
  );
};

export default SectorCard;
