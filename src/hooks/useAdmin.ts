import { useState } from 'react';
import { adminService, UserListFilters, UserStats } from '../services/admin.service';
import { UserProfile } from '../types/user';
import { UserRole } from '../types/auth';

export function useAdmin() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getAllUsers = async (filters?: UserListFilters) => {
    setLoading(true);
    setError(null);
    const result = await adminService.getAllUsers(filters);
    setUsers(result.users);
    setError(result.error);
    setLoading(false);
    return result;
  };

  const updateUserRole = async (userId: string, role: UserRole) => {
    setLoading(true);
    setError(null);
    const result = await adminService.updateUserRole(userId, role);
    setError(result.error);
    setLoading(false);
    if (!result.error) {
      // Refresh user list
      await getAllUsers();
    }
    return result;
  };

  const updateUserPlan = async (userId: string, plan: string) => {
    setLoading(true);
    setError(null);
    const result = await adminService.updateUserPlan(userId, plan);
    setError(result.error);
    setLoading(false);
    if (!result.error) {
      // Refresh user list
      await getAllUsers();
    }
    return result;
  };

  const deleteUser = async (userId: string) => {
    setLoading(true);
    setError(null);
    const result = await adminService.deleteUser(userId);
    setError(result.error);
    setLoading(false);
    if (!result.error) {
      // Refresh user list
      await getAllUsers();
    }
    return result;
  };

  const getUserStats = async () => {
    setLoading(true);
    setError(null);
    const result = await adminService.getUserStats();
    setStats(result.stats);
    setError(result.error);
    setLoading(false);
    return result;
  };

  return {
    users,
    stats,
    loading,
    error,
    getAllUsers,
    updateUserRole,
    updateUserPlan,
    deleteUser,
    getUserStats,
  };
}
