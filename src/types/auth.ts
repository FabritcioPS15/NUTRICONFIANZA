export type UserRole = 'super_admin' | 'admin' | 'premium' | 'user';

export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
  accessibility?: {
    highContrast?: boolean;
    largeText?: boolean;
  };
}

export interface SignUpData {
  email: string;
  password: string;
  full_name?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthError {
  message: string;
  code?: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: AuthError | null;
}
