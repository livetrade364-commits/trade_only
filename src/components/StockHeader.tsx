import React from 'react';
import { ArrowUp, ArrowDown, Heart } from 'lucide-react';
import { cn } from '../lib/utils';
import { getLogoUrl } from '../lib/logo';
import { formatCurrency } from '../lib/currency';
import { StockQuote } from '../store/useStockStore';

interface StockHeaderProps {
  quote: StockQuote;
  toggleWishlist: () => void;
  isWishlisted: boolean;
}

const StockHeader: React.FC<StockHeaderProps> = ({ quote, toggleWishlist, isWishlisted }) => {
  const isPositive = quote.change >= 0;
  const logoUrl = getLogoUrl(quote.website, quote.symbol);
  const [imageError, setImageError] = React.useState(false);

  return (
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
            <div className="flex items-center gap-3">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                {quote.symbol.replace(/\.NS$/, '')}
              </h1>
              <button 
                onClick={toggleWishlist}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Heart 
                  className={cn("h-6 w-6 transition-colors", isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400")} 
                />
              </button>
            </div>
            <p className="text-lg text-gray-500 font-medium mt-1">
              {quote.name || quote.symbol}
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {quote.type || 'Stock'}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {quote.exchange || 'Market'}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {quote.currency === 'INR' ? '🇮🇳 India' : quote.currency === 'USD' ? '🇺🇸 USA' : quote.currency || 'Global'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start md:items-end">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
              {formatCurrency(quote.price, quote.currency)}
            </span>
          </div>
          <div className={cn(
            "flex items-center mt-2 px-3 py-1 rounded-lg font-semibold text-sm",
            isPositive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          )}>
            {isPositive ? <ArrowUp className="h-4 w-4 mr-1.5" /> : <ArrowDown className="h-4 w-4 mr-1.5" />}
            <span className="text-lg">{formatCurrency(Math.abs(quote.change), quote.currency)}</span>
            <span className="mx-1.5 opacity-30">|</span>
            <span className="text-lg">{Math.abs(quote.changePercent).toFixed(2)}%</span>
          </div>
          <p className="text-xs text-gray-400 mt-2 font-medium">
            Last updated: {new Date(quote.timestamp).toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StockHeader;
