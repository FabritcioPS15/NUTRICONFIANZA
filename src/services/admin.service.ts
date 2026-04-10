import { supabase } from '../lib/supabase/client';
import { UserProfile } from '../types/user';
import { UserRole } from '../types/auth';

export interface UserListFilters {
  role?: UserRole;
  search?: string;
  plan?: string;
  status?: 'active' | 'inactive';
}

export const adminService = {
  async getAllUsers(filters?: UserListFilters): Promise<{ users: UserProfile[]; error: Error | null }> {
    try {
      let query = supabase.from('profiles').select('*');

      if (filters?.role) {
        query = query.eq('role', filters.role);
      }

      if (filters?.search) {
        query = query.ilike('full_name', `%${filters.search}%`);
      }

      if (filters?.plan) {
        query = query.eq('plan', filters.plan);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        return { users: [], error };
      }

      return { users: data as UserProfile[], error: null };
    } catch (error) {
      return { users: [], error: error as Error };
    }
  },

  async updateUserRole(userId: string, role: UserRole): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', userId);

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  },

  async updateUserPlan(userId: string, plan: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ plan })
        .eq('id', userId);

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  },

  async deleteUser(userId: string): Promise<{ error: Error | null }> {
    try {
      // Delete user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (profileError) {
        return { error: profileError };
      }

      // Delete auth user (requires admin privileges)
      const { error: authError } = await supabase.auth.admin.deleteUser(userId);

      if (authError) {
        return { error: authError };
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  },

  async getUserStats(): Promise<{ stats: UserStats | null; error: Error | null }> {
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('role, plan');

      if (error) {
        return { stats: null, error };
      }

      const stats: UserStats = {
        total_users: profiles.length,
        super_admins: profiles.filter(p => p.role === 'super_admin').length,
        admins: profiles.filter(p => p.role === 'admin').length,
        premium_users: profiles.filter(p => p.role === 'premium').length,
        regular_users: profiles.filter(p => p.role === 'user').length,
        premium_plan_users: profiles.filter(p => p.plan === 'Premium').length,
        basic_plan_users: profiles.filter(p => p.plan === 'Basic').length,
      };

      return { stats, error: null };
    } catch (error) {
      return { stats: null, error: error as Error };
    }
  },

  // suspendUser and activateUser removed - status column may not exist in profiles table
};

export interface UserStats {
  total_users: number;
  super_admins: number;
  admins: number;
  premium_users: number;
  regular_users: number;
  premium_plan_users: number;
  basic_plan_users: number;
}
