import { useState, useEffect } from 'react';
import { authService } from '../services/auth.service';
import { AuthState, SignUpData, SignInData } from '../types/auth';

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Check initial session
    authService.getCurrentUser().then(({ user, error }) => {
      setAuthState({ user, loading: false, error });
    });

    // Listen for auth changes
    const { data: { subscription } } = authService.onAuthStateChange((user) => {
      setAuthState({ user, loading: false, error: null });
    });

    return () => subscription.unsubscribe();
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
    setAuthState({ ...authState, loading: false, error: result.error });
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
