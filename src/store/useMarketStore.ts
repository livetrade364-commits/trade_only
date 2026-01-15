import { create } from 'zustand';
import api from '../api/axios';
import { MarketIndex, SectorPerformance, StockGainer } from '../types';

interface MarketState {
  marketOverview: MarketIndex[];
  sectorPerformance: SectorPerformance[];
  topGainers: StockGainer[];
  isLoading: boolean;
  error: string | null;
  fetchMarketOverview: () => Promise<void>;
  fetchSectorPerformance: () => Promise<void>;
  fetchTopGainers: () => Promise<void>;
}

export const useMarketStore = create<MarketState>((set) => ({
  marketOverview: [],
  sectorPerformance: [],
  topGainers: [],
  isLoading: false,
  error: null,
  fetchMarketOverview: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/market/overview');
      set({ marketOverview: response.data, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch market overview', isLoading: false });
    }
  },
  fetchSectorPerformance: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/market/sectors');
      set({ sectorPerformance: response.data, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch sector performance', isLoading: false });
    }
  },
  fetchTopGainers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/market/gainers');
      set({ topGainers: response.data, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch top gainers', isLoading: false });
    }
  },
}));
