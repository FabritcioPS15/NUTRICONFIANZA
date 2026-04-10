import { useState, useEffect } from 'react';
import { authService } from '../services/auth.service';
import { supabase } from '../lib/supabase/client';
import { AuthState, SignUpData, SignInData, User } from '../types/auth';

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  const loadUserProfile = async (authUser: User | null) => {
    if (!authUser) {
      return authUser;
    }

    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        return authUser;
      }

      // Merge auth user with profile data
      const mergedUser = {
        ...authUser,
        email: authUser.email || profile.email || '',
        role: profile.role || 'user',
        full_name: profile.full_name || (authUser as any).user_metadata?.full_name,
        created_at: profile.created_at || (authUser as any).created_at || '',
        updated_at: profile.updated_at || new Date().toISOString(),
        avatar_url: profile.avatar_url,
        accessibility: profile.accessibility,
      } as User;

      console.log('Loaded user profile:', { email: mergedUser.email, role: mergedUser.role, profileRole: profile.role });
      return mergedUser;
    } catch (error) {
      console.error('Error loading user profile:', error);
      return authUser;
    }
  };

  useEffect(() => {
    let mounted = true;

    // Check initial session
    authService.getCurrentUser().then(async ({ user, error }) => {
      if (!mounted) return;
      const userProfile = await loadUserProfile(user);
      setAuthState({ user: userProfile, loading: false, error });
    });

    // Listen for auth changes (sync callback - just update auth state)
    const { data: { subscription } } = authService.onAuthStateChange((user) => {
      if (!mounted) return;
      setAuthState({ user, loading: false, error: null });
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (data: SignUpData) => {
    setAuthState({ ...authState, loading: true, error: null });
    const result = await authService.signUp(data);
    setAuthState({ ...authState, loading: false, error: result.error });
    return result;
  };

  const signIn = async (data: SignInData) => {
    setAuthState({ ...authState, loading: true, error: null });
    const result = await authService.signIn(data);
    const userProfile = await loadUserProfile(result.user);
    setAuthState({ ...authState, loading: false, error: result.error, user: userProfile });
    return result;
  };

  const signOut = async () => {
    setAuthState({ ...authState, loading: true, error: null });
    const result = await authService.signOut();
    setAuthState({ user: null, loading: false, error: result.error });
    return result;
  };

  return {
    ...authState,
    signUp,
    signIn,
    signOut,
    isAuthenticated: !!authState.user,
  };
}
