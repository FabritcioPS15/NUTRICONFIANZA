import { supabase } from '../lib/supabase/client';

export interface Favorite {
  id: string;
  user_id: string;
  content_id: string;
  content_type: 'video' | 'flyer';
  created_at: string;
}

export const favoritesService = {
  async addFavorite(userId: string, contentId: string, contentType: 'video' | 'flyer'): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from('user_favorites')
        .insert({
          user_id: userId,
          content_id: contentId,
          content_type: contentType,
        });

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  },

  async removeFavorite(userId: string, contentId: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', userId)
        .eq('content_id', contentId);

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  },

  async getFavorites(userId: string): Promise<{ favorites: Favorite[]; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        return { favorites: [], error };
      }

      return { favorites: data as Favorite[], error: null };
    } catch (error) {
      return { favorites: [], error: error as Error };
    }
  },

  async isFavorite(userId: string, contentId: string): Promise<{ isFavorite: boolean; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .select('id')
        .eq('user_id', userId)
        .eq('content_id', contentId)
        .maybeSingle();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          return { isFavorite: false, error: null };
        }
        return { isFavorite: false, error };
      }

      return { isFavorite: !!data, error: null };
    } catch (error) {
      return { isFavorite: false, error: error as Error };
    }
  },

  async getFavoritesCount(userId: string): Promise<{ count: number; error: Error | null }> {
    try {
      const { count, error } = await supabase
        .from('user_favorites')
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
};
