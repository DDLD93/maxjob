import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { Member as User } from '../types/index'



interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;

  // Auth methods
  processUser: (supabaseUser: SupabaseUser) => Promise<User>;
  login: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null, user: User | null }>;
  loginWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  logout: () => Promise<void>;

  // Session methods
  checkSession: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      token: null,
      loading: false,

      // Convert Supabase user to our User format
      processUser: async (supabaseUser: SupabaseUser): Promise<User> => {
        // Get user profile from profiles table
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', supabaseUser.id)
          .single();

        return {
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          name: profile?.name || supabaseUser.user_metadata?.name || null,
          membership: profile?.membership || 'standard',
          avatar_url: profile?.avatar_url || null,
        };
      },

      login: async (email: string, password: string) => {
        set({ loading: true });
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) throw error;

          if (data.user) {
            const user = await get().processUser(data.user);
            set({
              user,
              isAuthenticated: true,
              token: data.session?.access_token || null,
              loading: false
            });
          }

          return { error: null };
        } catch (error) {
          set({ loading: false });
          return { error: error as Error };
        }
      },

      signUp: async (email: string, password: string) => {
        set({ loading: true });
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
          });

          if (error) throw error;

          set({
            user: null,
            isAuthenticated: true,
            token: data.session?.access_token || null,
            loading: false,
          });

          // let user: User | null = null;

          // if (data.user) {
          //   // Create a profile record
          //   await supabase.from('profiles').insert({
          //     id: data.user.id,
          //     email: data.user.email,
          //     name: data.user.user_metadata?.name || null,
          //     membership: 'standard',
          //     created_at: new Date().toISOString(),
          //   });

          //   user = await get().processUser(data.user);

          //   set({ 
          //     user,
          //     isAuthenticated: true,
          //     token: data.session?.access_token || null,
          //     loading: false,
          //   });
          // }

          return { error: null, user: null };
        } catch (error) {
          set({ loading: false });
          return { error: error as Error, user: null };
        }
      },

      loginWithGoogle: async () => {
        set({ loading: true });
        try {
          const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: `${window.location.origin}/auth/callback`,
            },
          });

          if (error) throw error;
        } catch (error) {
          console.error('Google login error:', error);
        } finally {
          set({ loading: false });
        }
      },

      resetPassword: async (email: string) => {
        set({ loading: true });
        try {
          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/reset-password`,
          });

          set({ loading: false });
          return { error };
        } catch (error) {
          set({ loading: false });
          return { error: error as Error };
        }
      },

      logout: async () => {
        set({ loading: true });
        await supabase.auth.signOut();
        set({
          user: null,
          isAuthenticated: false,
          token: null,
          loading: false
        });
      },

      checkSession: async () => {
        set({ loading: true });
        try {
          const { data } = await supabase.auth.getSession();

          if (data.session?.user) {
            const user = await get().processUser(data.session.user);
            set({
              user,
              isAuthenticated: true,
              token: data.session.access_token,
              loading: false
            });
            return true;
          } else {
            set({
              user: null,
              isAuthenticated: false,
              token: null,
              loading: false
            });
            return false;
          }
        } catch (error) {
          console.error('Session check error:', error);
          set({ loading: false });
          return false;
        }
      },
    }),
    {
      name: 'auth-storage',
      // Don't persist these function keys
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        token: state.token,
      }),
    }
  )
);