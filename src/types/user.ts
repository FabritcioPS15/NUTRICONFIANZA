import { UserRole } from './auth';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  objective?: string;
  plan: string;
  created_at: string;
  role: UserRole;
  profile_changes_count?: number;
  accessibility?: any;
}

export interface UserProgress {
  user_id: string;
  plan_completion: number;
  days_active: number;
  flyers_read: number;
  videos_watched: number;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlocked_at?: string;
}
