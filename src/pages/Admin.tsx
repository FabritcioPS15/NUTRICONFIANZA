import { useState, useEffect } from 'react';
import { Shield, Users, Search, Trash2, Crown, User as UserIcon, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAdmin } from '../hooks/useAdmin';
import { useAuth } from '../hooks/useAuth';
import { UserProfile } from '../types/user';
import { UserRole } from '../types/auth';

export function Admin() {
  const { user: currentUser, profileLoaded } = useAuth();
  const { users, stats, loading, error, getAllUsers, updateUserRole, updateUserPlan, deleteUser, getUserStats } = useAdmin();

  const [filters, setFilters] = useState<{ role?: UserRole; search?: string; plan?: string }>({});
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);

  useEffect(() => {
    getAllUsers();
    getUserStats();
  }, []);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value || undefined }));
    getAllUsers({ ...filters, [key]: value || undefined });
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'super_admin': return 'bg-red-100 text-red-800';
      case 'admin': return 'bg-orange-100 text-orange-800';
      case 'premium': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'super_admin': return <Shield className="w-4 h-4" />;
      case 'admin': return <Crown className="w-4 h-4" />;
      case 'premium': return <Crown className="w-4 h-4" />;
      default: return <UserIcon className="w-4 h-4" />;
    }
  };

  if (!profileLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-[#477d1e] animate-spin" />
      </div>
    );
  }

  if (!currentUser || currentUser.role !== 'super_admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Acceso Denegado</h2>
          <p className="text-gray-600">No tienes permisos para acceder a esta página.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-[#477d1e]" />
            <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
          </div>
          <p className="text-gray-600">Gestiona usuarios, roles y planes de suscripción</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <Users className="w-8 h-8 text-[#477d1e]" />
                <span className="text-2xl font-bold text-gray-900">{stats.total_users}</span>
              </div>
              <p className="text-sm text-gray-600">Total de Usuarios</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <Shield className="w-8 h-8 text-red-600" />
                <span className="text-2xl font-bold text-gray-900">{stats.super_admins + stats.admins}</span>
              </div>
              <p className="text-sm text-gray-600">Administradores</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <Crown className="w-8 h-8 text-purple-600" />
                <span className="text-2xl font-bold text-gray-900">{stats.premium_users}</span>
              </div>
              <p className="text-sm text-gray-600">Usuarios Premium</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <UserIcon className="w-8 h-8 text-blue-600" />
                <span className="text-2xl font-bold text-gray-900">{stats.regular_users}</span>
              </div>
              <p className="text-sm text-gray-600">Usuarios Normales</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar por nombre..."
                  value={filters.search || ''}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#477d1e]"
                />
              </div>
            </div>

            <select
              value={filters.role || ''}
              onChange={(e) => handleFilterChange('role', e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#477d1e]"
            >
              <option value="">Todos los roles</option>
              <option value="super_admin">Super Admin</option>
              <option value="admin">Admin</option>
              <option value="premium">Premium</option>
              <option value="user">Usuario</option>
            </select>

            <select
              value={filters.plan || ''}
              onChange={(e) => handleFilterChange('plan', e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#477d1e]"
            >
              <option value="">Todos los planes</option>
              <option value="Premium">Premium</option>
              <option value="Basic">Básico</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Usuarios</h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-[#477d1e] animate-spin" />
            </div>
          ) : error ? (
            <div className="p-6 text-center text-red-600">
              Error al cargar usuarios: {error.message}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usuario
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rol
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Miembro desde
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-[#8aaa1f] flex items-center justify-center">
                            <span className="text-sm font-medium text-[#477d1e]">
                              {user.full_name?.charAt(0) || 'U'}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.full_name || 'Sin nombre'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {user.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={cn("inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium", getRoleBadgeColor(user.role))}>
                          {getRoleIcon(user.role)}
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {user.plan}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(user.created_at).toLocaleDateString('es-ES')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => { setSelectedUser(user); setShowRoleModal(true); }}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Cambiar rol"
                          >
                            <Shield className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => { setSelectedUser(user); setShowPlanModal(true); }}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Cambiar plan"
                          >
                            <Crown className="w-4 h-4" />
                          </button>
                          {user.role !== 'super_admin' && (
                            <button
                              onClick={() => deleteUser(user.id)}
                              className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Eliminar usuario"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Role Change Modal */}
        {showRoleModal && selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h3 className="text-xl font-bold mb-4">Cambiar Rol de Usuario</h3>
              <p className="text-gray-600 mb-4">
                Cambiar el rol de <strong>{selectedUser.full_name}</strong>
              </p>
              <select
                className="w-full px-4 py-2 border border-gray-200 rounded-lg mb-4"
                defaultValue={selectedUser.role}
                onChange={(e) => updateUserRole(selectedUser.id, e.target.value as UserRole)}
              >
                <option value="user">Usuario</option>
                <option value="premium">Premium</option>
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRoleModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => setShowRoleModal(false)}
                  className="flex-1 px-4 py-2 bg-[#477d1e] text-white rounded-lg hover:bg-[#477d1e]"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Plan Change Modal */}
        {showPlanModal && selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h3 className="text-xl font-bold mb-4">Cambiar Plan de Usuario</h3>
              <p className="text-gray-600 mb-4">
                Cambiar el plan de <strong>{selectedUser.full_name}</strong>
              </p>
              <select
                className="w-full px-4 py-2 border border-gray-200 rounded-lg mb-4"
                defaultValue={selectedUser.plan}
                onChange={(e) => updateUserPlan(selectedUser.id, e.target.value)}
              >
                <option value="Plan Gratuito">Plan Gratuito</option>
                <option value="Premium">Premium</option>
              </select>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPlanModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => setShowPlanModal(false)}
                  className="flex-1 px-4 py-2 bg-[#477d1e] text-white rounded-lg hover:bg-[#477d1e]"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
