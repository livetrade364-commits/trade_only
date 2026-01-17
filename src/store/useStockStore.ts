import { create } from 'zustand';

interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  peRatio: number | null;
  eps: number | null;
  dayHigh: number;
  dayLow: number;
  open: number;
  previousClose: number;
  timestamp: number;
  website?: string; // We might need to fetch this separately or mock it
  exchange?: string;
}

interface StockHistoryPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface StockState {
  quote: StockQuote | null;
  history: StockHistoryPoint[] | null;
  isLoading: boolean;
  error: string | null;
  fetchQuote: (symbol: string) => Promise<void>;
  fetchHistory: (symbol: string, period?: string) => Promise<void>;
}

export const useStockStore = create<StockState>((set) => ({
  quote: null,
  history: null,
  isLoading: false,
  error: null,
  
  fetchQuote: async (symbol: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/stock/${symbol}`);
      if (!response.ok) throw new Error('Failed to fetch quote');
      
      const data = await response.json();
      
      // Transform backend data to match frontend interface
      const quote: StockQuote = {
        symbol: data.symbol,
        name: data.name,
        price: data.price,
        change: data.change,
        changePercent: data.percent_change,
        volume: data.volume,
        marketCap: data.market_cap,
        peRatio: data.pe_ratio,
        eps: data.eps,
        dayHigh: data.day_high,
        dayLow: data.day_low,
        open: data.open,
        previousClose: data.previous_close,
        timestamp: Date.now(),
        // Mocking website for logo demo purposes since yfinance might not return it in basic info
        // In a real app, we'd fetch profile data
        website: `www.${data.name.split(' ')[0].toLowerCase()}.com`.replace(',', '') 
      };
      
      set({ quote, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchHistory: async (symbol: string, period = '1mo') => {
    try {
      // Map frontend periods to yfinance periods if needed
      // yfinance supports: 1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max
      const response = await fetch(`${API_URL}/api/stock/${symbol}/history?period=${period}`);
      if (!response.ok) throw new Error('Failed to fetch history');
      
      const data = await response.json();
      set({ history: data });
    } catch (error) {
      console.error('Failed to fetch history:', error);
      // Don't set global error here to avoid blocking the quote view
    }
  }
}));
