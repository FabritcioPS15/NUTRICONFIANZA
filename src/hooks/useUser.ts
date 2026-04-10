import { useState } from 'react';
import { userService } from '../services/user.service';
import { UserProfile, UserProgress } from '../types/user';

export function useUser(userId: string | null) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getProfile = async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    const result = await userService.getProfile(userId);
    setProfile(result.profile);
    setError(result.error);
    setLoading(false);
    return result;
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!userId) return { profile: null, error: new Error('No user ID') };
    setLoading(true);
    setError(null);
    const result = await userService.updateProfile(userId, updates);
    setProfile(result.profile);
    setError(result.error);
    setLoading(false);
    return result;
  };

  const getProgress = async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    const result = await userService.getProgress(userId);
    setProgress(result.progress);
    setError(result.error);
    setLoading(false);
    return result;
  };

  const updateAccessibility = async (accessibility: UserProfile['accessibility']) => {
    if (!userId) return { error: new Error('No user ID') };
    setLoading(true);
    setError(null);
    const result = await userService.updateAccessibility(userId, accessibility);
    setError(result.error);
    setLoading(false);
    return result;
  };

  return {
    profile,
    progress,
    loading,
    error,
    getProfile,
    updateProfile,
    getProgress,
    updateAccessibility,
  };
}
