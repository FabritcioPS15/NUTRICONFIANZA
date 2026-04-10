import { supabase } from '../lib/supabase/client';
import { SignUpData, SignInData, User, AuthError, UserRole } from '../types/auth';

export const authService = {
  async signUp(data: SignUpData): Promise<{ user: User | null; error: AuthError | null }> {
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.full_name,
            role: 'user',
            plan: 'basic',
          },
        },
      });

      if (error) {
        return { user: null, error: { message: error.message, code: error.name } };
      }

      // Create profile in profiles table with basic plan
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            email: data.email,
            full_name: data.full_name,
            role: 'user',
            plan: 'basic',
            created_at: new Date().toISOString(),
          });

        if (profileError) {
          console.error('Error creating profile:', profileError);
        }
      }

      return { user: authData.user as User, error: null };
    } catch (error) {
      return { user: null, error: { message: 'Error al crear cuenta' } };
    }
  },

  async signIn(data: SignInData): Promise<{ user: User | null; error: AuthError | null }> {
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        return { user: null, error: { message: error.message, code: error.name } };
      }

      return { user: authData.user as User, error: null };
    } catch (error) {
      return { user: null, error: { message: 'Error al iniciar sesión' } };
    }
  },

  async signOut(): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        return { error: { message: error.message, code: error.name } };
      }
      return { error: null };
    } catch (error) {
      return { error: { message: 'Error al cerrar sesión' } };
    }
  },

  async getCurrentUser(): Promise<{ user: User | null; error: AuthError | null }> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        return { user: null, error: { message: error.message, code: error.name } };
      }

      if (!user) {
        return { user: null, error: null };
      }

      // Fetch user profile from profiles table to get the role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        // Return auth user as fallback
        return { user: user as User, error: null };
      }

      // Merge auth user with profile data
      const mergedUser: User = {
        id: user.id,
        email: user.email || profile.email || '',
        role: profile.role || 'user',
        full_name: profile.full_name || user.user_metadata?.full_name,
        created_at: profile.created_at || user.created_at || '',
        updated_at: profile.updated_at || new Date().toISOString(),
        avatar_url: profile.avatar_url,
        accessibility: profile.accessibility,
      };

      return { user: mergedUser, error: null };
    } catch (error) {
      return { user: null, error: { message: 'Error al obtener usuario' } };
    }
  },

  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user as User || null);
    });
  },

  hasPermission(user: User | null, requiredRole: UserRole): boolean {
    if (!user) return false;
    
    const roleHierarchy: Record<UserRole, number> = {
      super_admin: 4,
      admin: 3,
      premium: 2,
      user: 1,
    };

    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  },

  isSuperAdmin(user: User | null): boolean {
    return user?.role === 'super_admin';
  },

  isAdmin(user: User | null): boolean {
    return user?.role === 'super_admin' || user?.role === 'admin';
  },

  isPremium(user: User | null): boolean {
    return user?.role === 'premium' || user?.role === 'super_admin' || user?.role === 'admin';
  },
};
