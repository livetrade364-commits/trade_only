import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  wishlist: string[];
  checkUser: () => Promise<void>;
  signOut: () => Promise<void>;
  fetchWishlist: () => Promise<void>;
  addToWishlist: (symbol: string) => Promise<void>;
  removeFromWishlist: (symbol: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  wishlist: [],

  checkUser: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user ?? null;
      set({ user, isLoading: false });

      if (user) {
        get().fetchWishlist();
      }

      // Listen for changes on auth state (signed in, signed out, etc.)
      supabase.auth.onAuthStateChange((_event, session) => {
        const currentUser = session?.user ?? null;
        set({ user: currentUser, isLoading: false });
        if (currentUser) {
            get().fetchWishlist();
        } else {
            set({ wishlist: [] });
        }
      });
    } catch (error) {
      console.error('Error checking user session:', error);
      set({ isLoading: false });
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, wishlist: [] });
  },

  fetchWishlist: async () => {
    const { user } = get();
    if (!user) return;

    const { data, error } = await supabase
      .from('watchlist')
      .select('symbol')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching wishlist:', error);
      return;
    }

    set({ wishlist: data.map((item) => item.symbol) });
  },

  addToWishlist: async (symbol: string) => {
    const { user, wishlist } = get();
    if (!user) return;

    // Optimistic update
    set({ wishlist: [...wishlist, symbol] });

    const { error } = await supabase
      .from('watchlist')
      .insert([{ user_id: user.id, symbol }]);

    if (error) {
      console.error('Error adding to wishlist:', error);
      // Revert on error
      set({ wishlist: wishlist });
    }
  },

  removeFromWishlist: async (symbol: string) => {
    const { user, wishlist } = get();
    if (!user) return;

    // Optimistic update
    set({ wishlist: wishlist.filter((s) => s !== symbol) });

    const { error } = await supabase
      .from('watchlist')
      .delete()
      .eq('user_id', user.id)
      .eq('symbol', symbol);

    if (error) {
      console.error('Error removing from wishlist:', error);
      // Revert on error
      set({ wishlist: wishlist });
    }
  },
}));
