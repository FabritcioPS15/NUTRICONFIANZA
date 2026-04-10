import { useState, useEffect, useCallback } from 'react';
import { favoritesService, Favorite } from '../services/favorites.service';

export function useFavorites(userId: string | null) {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getFavorites = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    const result = await favoritesService.getFavorites(userId);
    setFavorites(result.favorites);
    setError(result.error);
    setLoading(false);
    return result;
  }, [userId]);

  const addFavorite = useCallback(async (contentId: string, contentType: 'video' | 'flyer') => {
    if (!userId) return { error: new Error('User not logged in') };
    setLoading(true);
    setError(null);
    const result = await favoritesService.addFavorite(userId, contentId, contentType);
    if (!result.error) {
      await getFavorites();
    }
    setLoading(false);
    return result;
  }, [userId, getFavorites]);

  const removeFavorite = useCallback(async (contentId: string) => {
    if (!userId) return { error: new Error('User not logged in') };
    setLoading(true);
    setError(null);
    const result = await favoritesService.removeFavorite(userId, contentId);
    if (!result.error) {
      await getFavorites();
    }
    setLoading(false);
    return result;
  }, [userId, getFavorites]);

  const isFavorite = useCallback(async (contentId: string) => {
    if (!userId) return { isFavorite: false, error: new Error('User not logged in') };
    const result = await favoritesService.isFavorite(userId, contentId);
    return result;
  }, [userId]);

  const getFavoritesCount = useCallback(async () => {
    if (!userId) return { count: 0, error: new Error('User not logged in') };
    const result = await favoritesService.getFavoritesCount(userId);
    return result;
  }, [userId]);

  // Auto-load favorites when userId changes
  useEffect(() => {
    if (userId) {
      getFavorites();
    }
  }, [userId, getFavorites]);

  return {
    favorites,
    loading,
    error,
    getFavorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    getFavoritesCount,
    favoritesCount: favorites.length,
  };
}
