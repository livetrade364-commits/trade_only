import { create } from 'zustand';
import api from '../api/axios';
import { StockQuote, StockHistory, SearchResult } from '../types';

interface StockState {
  quote: StockQuote | null;
  history: StockHistory | null;
  searchResults: SearchResult[];
  isLoading: boolean;
  error: string | null;
  fetchQuote: (symbol: string) => Promise<void>;
  fetchHistory: (symbol: string, period: string) => Promise<void>;
  searchStocks: (query: string) => Promise<void>;
  clearSearchResults: () => void;
}

export const useStockStore = create<StockState>((set, get) => ({
  quote: null,
  history: null,
  searchResults: [],
  isLoading: false,
  error: null,
  fetchQuote: async (symbol: string) => {
    // If the symbol has changed, clear the previous quote and set loading
    const currentQuote = get().quote;
    if (!currentQuote || currentQuote.symbol !== symbol) {
      set({ quote: null, isLoading: true, error: null });
    }

    try {
      const response = await api.get(`/stock/quote/${symbol}`);
      set({ quote: response.data, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch stock quote', isLoading: false });
    }
  },
  fetchHistory: async (symbol: string, period: string) => {
    // If the symbol has changed, clear the previous history and set loading
    const currentHistory = get().history;
    if (!currentHistory || currentHistory.symbol !== symbol) {
      set({ history: null, isLoading: true, error: null });
    }

    try {
      const response = await api.get(`/stock/history/${symbol}?period=${period}`);
      set({ history: response.data, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch stock history', isLoading: false });
    }
  },
  searchStocks: async (query: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/stock/search?q=${query}`);
      set({ searchResults: response.data, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to search stocks', isLoading: false });
    }
  },
  clearSearchResults: () => set({ searchResults: [] }),
}));
