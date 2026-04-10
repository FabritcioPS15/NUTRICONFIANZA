export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string; // e.g., "monthly", "yearly"
  features: string[];
  is_popular?: boolean;
  color: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  start_date: string;
  end_date?: string;
  auto_renew: boolean;
}

export interface NutritionPlan {
  id: string;
  user_id: string;
  name: string;
  type: 'anti_inflammatory' | 'weight_loss' | 'muscle_gain' | 'balanced';
  start_date: string;
  end_date?: string;
  meals: Meal[];
  progress: number;
}

export interface Meal {
  id: string;
  day: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  snacks: string[];
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fats: number;
  };
}
