import React, { useEffect, useState } from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface MarketStatusCardProps {
  marketState: string;
  exchange?: string;
  timezone?: string;
}

const MarketStatusCard: React.FC<MarketStatusCardProps> = ({ marketState, exchange, timezone }) => {
  const [timeToOpen, setTimeToOpen] = useState<string | null>(null);

  // Normalize market state (yfinance returns states like 'REGULAR', 'CLOSED', 'PRE', 'POST', etc.)
  const state = marketState?.toUpperCase() || 'CLOSED';
  const isOpen = state === 'REGULAR' || state === 'OPEN';
  const isPreMarket = state === 'PRE' || state === 'PREPRE';
  const isPostMarket = state === 'POST' || state === 'POSTPOST';
  
  // Determine color and label based on state
  let statusColor = "bg-red-100 text-red-700 border-red-200";
  let iconColor = "text-red-500";
  let label = "Market Closed";
  let message = "Market is closed. Prices are static.";

  if (isOpen) {
    statusColor = "bg-emerald-100 text-emerald-700 border-emerald-200";
    iconColor = "text-emerald-500";
    label = "Market Open";
    message = "Data is updating in real-time.";
  } else if (isPreMarket) {
    statusColor = "bg-orange-100 text-orange-700 border-orange-200";
    iconColor = "text-orange-500";
    label = "Pre-Market";
    message = "Trading before official market hours.";
  } else if (isPostMarket) {
    statusColor = "bg-blue-100 text-blue-700 border-blue-200";
    iconColor = "text-blue-500";
    label = "After Hours";
    message = "Trading after official market hours.";
  }

  // Calculate time to open if closed and we have timezone info
  useEffect(() => {
    if (isOpen || !timezone) {
      setTimeToOpen(null);
      return;
    }

    const calculateTimeToOpen = () => {
      try {
        // Current time in the exchange's timezone
        const now = new Date();
        const exchangeTimeStr = now.toLocaleString('en-US', { timeZone: timezone });
        const exchangeTime = new Date(exchangeTimeStr);
        
        let openHour = 9;
        let openMinute = 30; // Default NYSE/NASDAQ

        // Adjust for Indian markets
        if (exchange?.includes('NSE') || exchange?.includes('BSE') || timezone === 'Asia/Kolkata') {
          openHour = 9;
          openMinute = 15;
        }

        // Create open time date object for TODAY
        const openTime = new Date(exchangeTime);
        openTime.setHours(openHour, openMinute, 0, 0);

        // If currently before open time (same day)
        if (exchangeTime < openTime) {
          const diffMs = openTime.getTime() - exchangeTime.getTime();
          const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
          const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
          
          if (diffHrs > 0) {
            setTimeToOpen(`Opens in ${diffHrs}h ${diffMins}m`);
          } else {
            setTimeToOpen(`Opens in ${diffMins}m`);
          }
        } else {
          // If after open time (meaning it's closed for the day/weekend), 
          // we don't show countdown as next day calculation is complex with weekends/holidays
          setTimeToOpen(null);
        }
      } catch {
        // Fallback if timezone is invalid
        setTimeToOpen(null);
      }
    };

    calculateTimeToOpen();
    const interval = setInterval(calculateTimeToOpen, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [isOpen, timezone, exchange]);

  return (
    <div className={cn(
      "flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border shadow-sm transition-all",
      statusColor
    )}>
      <div className="flex items-center gap-3">
        <div className={cn("p-2 rounded-full bg-white/50 backdrop-blur-sm shadow-sm", iconColor)}>
          {isOpen ? <Clock className="h-5 w-5 animate-pulse" /> : <AlertCircle className="h-5 w-5" />}
        </div>
        <div>
          <h4 className="font-bold text-sm sm:text-base flex items-center gap-2">
            {label}
            {exchange && <span className="text-xs opacity-75 font-normal px-2 py-0.5 bg-white/30 rounded-full">{exchange}</span>}
          </h4>
          <p className="text-xs sm:text-sm opacity-90 mt-0.5">
            {message}
          </p>
        </div>
      </div>
      {!isOpen && (
        <div className="mt-3 sm:mt-0 sm:ml-4 text-xs font-medium px-3 py-1.5 bg-white/40 rounded-lg whitespace-nowrap">
          {timeToOpen || "Market Closed"}
        </div>
      )}
    </div>
  );
};

export default MarketStatusCard;
