import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  wishlist: string[];
  isLoading: boolean;
  loading: boolean; // Alias for isLoading to fix compatibility
  initialize: () => Promise<void>;
  signIn: (email: string) => Promise<{ error: Error | null }>;
  verifyOtp: (email: string, token: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  addToWishlist: (symbol: string) => Promise<void>;
  removeFromWishlist: (symbol: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  wishlist: [],
  isLoading: true,
  loading: true,

  initialize: async () => {
    try {
      // Check for existing session first
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        // If session is invalid (e.g. refresh token missing), clear local state
        console.warn("Session check failed", error);
        set({ user: null, isAuthenticated: false, wishlist: [] });
        return;
      }
      
      if (session?.user) {
        const user = { 
          id: session.user.id, 
          email: session.user.email!,
          name: session.user.user_metadata?.name
        };
        
        set({ user, isAuthenticated: true });

        // Fetch wishlist from DB
        const { data: wishlistData } = await supabase
          .from('wishlist')
          .select('symbol')
          .eq('user_id', user.id);

        if (wishlistData) {
          set({ wishlist: wishlistData.map(item => item.symbol) });
        }
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        // Handle specific auth events if needed
        if (event === 'SIGNED_OUT') {
           set({ user: null, isAuthenticated: false, wishlist: [] });
           return;
        }

        if (session?.user) {
          const user = { 
            id: session.user.id, 
            email: session.user.email!,
            name: session.user.user_metadata?.name
          };

          set({ user, isAuthenticated: true });

          // Fetch wishlist on auth change
          const { data: wishlistData } = await supabase
            .from('wishlist')
            .select('symbol')
            .eq('user_id', user.id);

          if (wishlistData) {
            set({ wishlist: wishlistData.map(item => item.symbol) });
          }
        } else {
          set({ user: null, isAuthenticated: false, wishlist: [] });
        }
      });
    } catch (error) {
      console.error('Auth initialization error:', error);
      // Ensure we don't leave the app in a weird loading state
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false, loading: false });
    }
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  signIn: async (_email: string) => {
    return { error: null };
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  verifyOtp: async (_email, _token) => {
    return { error: null };
  },

  signOut: async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      set({ user: null, isAuthenticated: false, wishlist: [] });
    }
  },

  addToWishlist: async (symbol) => {
    const { user, wishlist } = get();
    if (!user) return;
    
    // Optimistic update
    if (!wishlist.includes(symbol)) {
      set({ wishlist: [...wishlist, symbol] });
      
      const { error } = await supabase
        .from('wishlist')
        .insert({ user_id: user.id, symbol });
        
      if (error) {
        console.error('Failed to add to wishlist:', error);
        // Revert on error
        set({ wishlist });
      }
    }
  },

  removeFromWishlist: async (symbol) => {
    const { user, wishlist } = get();
    if (!user) return;

    // Optimistic update
    const newWishlist = wishlist.filter(s => s !== symbol);
    set({ wishlist: newWishlist });

    const { error } = await supabase
      .from('wishlist')
      .delete()
      .eq('user_id', user.id)
      .eq('symbol', symbol);

    if (error) {
      console.error('Failed to remove from wishlist:', error);
      // Revert on error
      set({ wishlist });
    }
  }
}));
