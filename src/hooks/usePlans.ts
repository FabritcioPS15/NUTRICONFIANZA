import { useState, useEffect, useCallback } from 'react';
import { plansService } from '../services/plans.service';
import { Plan, Subscription, NutritionPlan } from '../types/plans';

export function usePlans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getAllPlans = async () => {
    setLoading(true);
    setError(null);
    const result = await plansService.getAllPlans();
    setPlans(result.plans);
    setError(result.error);
    setLoading(false);
    return result;
  };

  const getPlanById = async (planId: string) => {
    setLoading(true);
    setError(null);
    const result = await plansService.getPlanById(planId);
    setLoading(false);
    return result;
  };

  return {
    plans,
    loading,
    error,
    getAllPlans,
    getPlanById,
  };
}

export function useSubscription(userId: string | null) {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getUserSubscription = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    const result = await plansService.getUserSubscription(userId);
    setSubscription(result.subscription);
    setError(result.error);
    setLoading(false);
    return result;
  }, [userId]);

  // Auto-load subscription when userId changes
  useEffect(() => {
    if (userId) {
      getUserSubscription();
    }
  }, [userId, getUserSubscription]);

  const createSubscription = async (planId: string) => {
    if (!userId) return { subscription: null, error: new Error('No user ID') };
    setLoading(true);
    setError(null);
    const result = await plansService.createSubscription(userId, planId);
    setSubscription(result.subscription);
    setError(result.error);
    setLoading(false);
    return result;
  };

  const cancelSubscription = async () => {
    if (!subscription) return { error: new Error('No subscription to cancel') };
    setLoading(true);
    setError(null);
    const result = await plansService.cancelSubscription(subscription.id);
    setError(result.error);
    setLoading(false);
    return result;
  };

  return {
    subscription,
    loading,
    error,
    getUserSubscription,
    createSubscription,
    cancelSubscription,
    hasActiveSubscription: subscription?.status === 'active',
  };
}

export function useNutritionPlan(userId: string | null) {
  const [nutritionPlan, setNutritionPlan] = useState<NutritionPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getUserNutritionPlan = async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    const result = await plansService.getUserNutritionPlan(userId);
    setNutritionPlan(result.nutritionPlan);
    setError(result.error);
    setLoading(false);
    return result;
  };

  const createNutritionPlan = async (plan: Omit<NutritionPlan, 'id' | 'user_id'>) => {
    if (!userId) return { nutritionPlan: null, error: new Error('No user ID') };
    setLoading(true);
    setError(null);
    const result = await plansService.createNutritionPlan(userId, plan);
    setNutritionPlan(result.nutritionPlan);
    setError(result.error);
    setLoading(false);
    return result;
  };

  return {
    nutritionPlan,
    loading,
    error,
    getUserNutritionPlan,
    createNutritionPlan,
  };
}
