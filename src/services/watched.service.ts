import { supabase } from '../lib/supabase/client';

export interface Watched {
  id: string;
  user_id: string;
  content_id: string;
  content_type: 'video' | 'flyer';
  watch_duration: number; // in seconds
  completed: boolean;
  last_watched_at: string;
  created_at: string;
}

export const watchedService = {
  async markAsWatched(userId: string, contentId: string, contentType: 'video' | 'flyer', duration: number = 0, completed: boolean = false): Promise<{ error: Error | null }> {
    try {
      // Check if already exists
      const { data: existing } = await supabase
        .from('user_watched')
        .select('id')
        .eq('user_id', userId)
        .eq('content_id', contentId)
        .maybeSingle();

      if (existing) {
        // Update existing record
        const { error } = await supabase
          .from('user_watched')
          .update({
            watch_duration: duration,
            completed: completed,
            last_watched_at: new Date().toISOString(),
          })
          .eq('user_id', userId)
          .eq('content_id', contentId);

        if (error) {
          return { error };
        }
      } else {
        // Insert new record
        const { error } = await supabase
          .from('user_watched')
          .insert({
            user_id: userId,
            content_id: contentId,
            content_type: contentType,
            watch_duration: duration,
            completed: completed,
            last_watched_at: new Date().toISOString(),
          });

        if (error) {
          return { error };
        }
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  },

  async getWatched(userId: string): Promise<{ watched: Watched[]; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('user_watched')
        .select('*')
        .eq('user_id', userId)
        .order('last_watched_at', { ascending: false });

      if (error) {
        return { watched: [], error };
      }

      return { watched: data as Watched[], error: null };
    } catch (error) {
      return { watched: [], error: error as Error };
    }
  },

  async getWatchedCount(userId: string): Promise<{ count: number; error: Error | null }> {
    try {
      const { count, error } = await supabase
        .from('user_watched')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (error) {
        return { count: 0, error };
      }

      return { count: count || 0, error: null };
    } catch (error) {
      return { count: 0, error: error as Error };
    }
  },

  async isWatched(userId: string, contentId: string): Promise<{ isWatched: boolean; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('user_watched')
        .select('id')
        .eq('user_id', userId)
        .eq('content_id', contentId)
        .maybeSingle();

      if (error) {
        if (error.code === 'PGRST116') {
          return { isWatched: false, error: null };
        }
        return { isWatched: false, error };
      }

      return { isWatched: !!data, error: null };
    } catch (error) {
      return { isWatched: false, error: error as Error };
    }
  },
};
