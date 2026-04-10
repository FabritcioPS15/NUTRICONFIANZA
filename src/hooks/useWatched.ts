import { useState, useEffect, useCallback } from 'react';
import { watchedService, Watched } from '../services/watched.service';

export function useWatched(userId: string | null) {
  const [watched, setWatched] = useState<Watched[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getWatched = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    const result = await watchedService.getWatched(userId);
    setWatched(result.watched);
    setError(result.error);
    setLoading(false);
    return result;
  }, [userId]);

  const markAsWatched = useCallback(async (contentId: string, contentType: 'video' | 'flyer', duration: number = 0, completed: boolean = false) => {
    if (!userId) return { error: new Error('User not logged in') };
    setLoading(true);
    setError(null);
    const result = await watchedService.markAsWatched(userId, contentId, contentType, duration, completed);
    if (!result.error) {
      await getWatched();
    }
    setLoading(false);
    return result;
  }, [userId, getWatched]);

  const isWatched = useCallback(async (contentId: string) => {
    if (!userId) return { isWatched: false, error: new Error('User not logged in') };
    const result = await watchedService.isWatched(userId, contentId);
    return result;
  }, [userId]);

  const getWatchedCount = useCallback(async () => {
    if (!userId) return { count: 0, error: new Error('User not logged in') };
    const result = await watchedService.getWatchedCount(userId);
    return result;
  }, [userId]);

  // Auto-load watched when userId changes
  useEffect(() => {
    if (userId) {
      getWatched();
    }
  }, [userId, getWatched]);

  return {
    watched,
    loading,
    error,
    getWatched,
    markAsWatched,
    isWatched,
    getWatchedCount,
    watchedCount: watched.length,
  };
}
