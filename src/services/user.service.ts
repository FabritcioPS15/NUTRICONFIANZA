import { supabase } from '../lib/supabase/client';
import { UserProfile, UserProgress } from '../types/user';

export const userService = {
  async getProfile(userId: string): Promise<{ profile: UserProfile | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        return { profile: null, error };
      }

      return { profile: data as UserProfile, error: null };
    } catch (error) {
      return { profile: null, error: error as Error };
    }
  },

  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<{ profile: UserProfile | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        return { profile: null, error };
      }

      return { profile: data as UserProfile, error: null };
    } catch (error) {
      return { profile: null, error: error as Error };
    }
  },

  async getProgress(userId: string): Promise<{ progress: UserProgress | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        return { progress: null, error };
      }

      return { progress: data as UserProgress, error: null };
    } catch (error) {
      return { progress: null, error: error as Error };
    }
  },

  async updateAccessibility(userId: string, accessibility: UserProfile['accessibility']): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ accessibility })
        .eq('user_id', userId);

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  },
};
