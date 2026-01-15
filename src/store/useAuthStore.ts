import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  checkUser: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,

  checkUser: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      set({ user: session?.user ?? null, isLoading: false });

      // Listen for changes on auth state (signed in, signed out, etc.)
      supabase.auth.onAuthStateChange((_event, session) => {
        set({ user: session?.user ?? null, isLoading: false });
      });
    } catch (error) {
      console.error('Error checking user session:', error);
      set({ isLoading: false });
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  },
}));
