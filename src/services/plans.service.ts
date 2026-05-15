import { supabase } from '../lib/supabase/client';
import { Plan, Subscription, NutritionPlan } from '../types/plans';

export const plansService = {
  async getAllPlans(): Promise<{ plans: Plan[]; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .order('price', { ascending: true });

      if (error) {
        return { plans: [], error };
      }

      return { plans: data as Plan[], error: null };
    } catch (error) {
      return { plans: [], error: error as Error };
    }
  },

  async getPlanById(planId: string): Promise<{ plan: Plan | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .eq('id', planId)
        .single();

      if (error) {
        return { plan: null, error };
      }

      return { plan: data as Plan, error: null };
    } catch (error) {
      return { plan: null, error: error as Error };
    }
  },

  async getUserSubscription(userId: string): Promise<{ subscription: Subscription | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        return { subscription: null, error };
      }

      return { subscription: data as Subscription, error: null };
    } catch (error) {
      return { subscription: null, error: error as Error };
    }
  },

  async createSubscription(userId: string, planId: string): Promise<{ subscription: Subscription | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .insert({
          user_id: userId,
          plan_id: planId,
          status: 'active',
          start_date: new Date().toISOString(),
          auto_renew: true,
        })
        .select()
        .single();

      if (error) {
        return { subscription: null, error };
      }

      return { subscription: data as Subscription, error: null };
    } catch (error) {
      return { subscription: null, error: error as Error };
    }
  },

  async cancelSubscription(subscriptionId: string): Promise<{ error: Error | null }> {
    try {
      // Cancel the subscription
      const { error } = await supabase
        .from('subscriptions')
        .update({ status: 'cancelled', auto_renew: false })
        .eq('id', subscriptionId);

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  },

  async getUserNutritionPlan(userId: string): Promise<{ nutritionPlan: NutritionPlan | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('nutrition_plans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        return { nutritionPlan: null, error };
      }

      return { nutritionPlan: data as NutritionPlan, error: null };
    } catch (error) {
      return { nutritionPlan: null, error: error as Error };
    }
  },

  async createNutritionPlan(userId: string, plan: Omit<NutritionPlan, 'id' | 'user_id'>): Promise<{ nutritionPlan: NutritionPlan | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('nutrition_plans')
        .insert({
          user_id: userId,
          ...plan,
        })
        .select()
        .single();

      if (error) {
        return { nutritionPlan: null, error };
      }

      return { nutritionPlan: data as NutritionPlan, error: null };
    } catch (error) {
      return { nutritionPlan: null, error: error as Error };
    }
  },
};
