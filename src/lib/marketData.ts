// Market trading hours and timezone information
// Source: Aggregated from common stock exchange data

export interface MarketInfo {
  name: string;
  timezone: string; // IANA timezone database name
  openTime: string; // HH:mm (24-hour format)
  closeTime: string; // HH:mm (24-hour format)
  currency: string;
  country: string;
}

export const MARKET_DATA: Record<string, MarketInfo> = {
  // United States
  'NYQ': { name: 'NYSE', timezone: 'America/New_York', openTime: '09:30', closeTime: '16:00', currency: 'USD', country: 'USA' },
  'NMS': { name: 'NASDAQ', timezone: 'America/New_York', openTime: '09:30', closeTime: '16:00', currency: 'USD', country: 'USA' },
  'NASDAQ': { name: 'NASDAQ', timezone: 'America/New_York', openTime: '09:30', closeTime: '16:00', currency: 'USD', country: 'USA' },
  'NYSE': { name: 'NYSE', timezone: 'America/New_York', openTime: '09:30', closeTime: '16:00', currency: 'USD', country: 'USA' },
  
  // India
  'NSE': { name: 'National Stock Exchange of India', timezone: 'Asia/Kolkata', openTime: '09:15', closeTime: '15:30', currency: 'INR', country: 'India' },
  'BSE': { name: 'Bombay Stock Exchange', timezone: 'Asia/Kolkata', openTime: '09:15', closeTime: '15:30', currency: 'INR', country: 'India' },
  'NSI': { name: 'NSE', timezone: 'Asia/Kolkata', openTime: '09:15', closeTime: '15:30', currency: 'INR', country: 'India' },
  
  // United Kingdom
  'LSE': { name: 'London Stock Exchange', timezone: 'Europe/London', openTime: '08:00', closeTime: '16:30', currency: 'GBP', country: 'UK' },
  'LONE': { name: 'LSE', timezone: 'Europe/London', openTime: '08:00', closeTime: '16:30', currency: 'GBP', country: 'UK' },
  
  // Japan
  'JPX': { name: 'Tokyo Stock Exchange', timezone: 'Asia/Tokyo', openTime: '09:00', closeTime: '15:00', currency: 'JPY', country: 'Japan' },
  'TSE': { name: 'Tokyo Stock Exchange', timezone: 'Asia/Tokyo', openTime: '09:00', closeTime: '15:00', currency: 'JPY', country: 'Japan' },
  
  // China/Hong Kong
  'HKG': { name: 'Hong Kong Stock Exchange', timezone: 'Asia/Hong_Kong', openTime: '09:30', closeTime: '16:00', currency: 'HKD', country: 'Hong Kong' },
  'SHH': { name: 'Shanghai Stock Exchange', timezone: 'Asia/Shanghai', openTime: '09:30', closeTime: '15:00', currency: 'CNY', country: 'China' },
  
  // Europe
  'FRA': { name: 'Frankfurt Stock Exchange', timezone: 'Europe/Berlin', openTime: '09:00', closeTime: '17:30', currency: 'EUR', country: 'Germany' },
  'PAR': { name: 'Euronext Paris', timezone: 'Europe/Paris', openTime: '09:00', closeTime: '17:30', currency: 'EUR', country: 'France' },
  'AMS': { name: 'Euronext Amsterdam', timezone: 'Europe/Amsterdam', openTime: '09:00', closeTime: '17:30', currency: 'EUR', country: 'Netherlands' },
  
  // Canada
  'TOR': { name: 'Toronto Stock Exchange', timezone: 'America/Toronto', openTime: '09:30', closeTime: '16:00', currency: 'CAD', country: 'Canada' },
  'TSX': { name: 'Toronto Stock Exchange', timezone: 'America/Toronto', openTime: '09:30', closeTime: '16:00', currency: 'CAD', country: 'Canada' },
  
  // Australia
  'ASX': { name: 'Australian Securities Exchange', timezone: 'Australia/Sydney', openTime: '10:00', closeTime: '16:00', currency: 'AUD', country: 'Australia' },
};

export const getMarketInfo = (exchange?: string, currency?: string): MarketInfo | null => {
  if (exchange && MARKET_DATA[exchange]) {
    return MARKET_DATA[exchange];
  }
  
  // Heuristic fallbacks based on currency if exchange is missing or unknown
  if (currency === 'INR') return MARKET_DATA['NSE'];
  if (currency === 'USD') return MARKET_DATA['NYSE'];
  if (currency === 'GBP') return MARKET_DATA['LSE'];
  if (currency === 'JPY') return MARKET_DATA['JPX'];
  if (currency === 'EUR') return MARKET_DATA['FRA']; // Default to Frankfurt for Euro for now
  if (currency === 'AUD') return MARKET_DATA['ASX'];
  if (currency === 'CAD') return MARKET_DATA['TOR'];
  if (currency === 'HKD') return MARKET_DATA['HKG'];
  
  return null;
};
