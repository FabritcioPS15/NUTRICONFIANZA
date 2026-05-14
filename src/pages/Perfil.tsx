import { Edit3, LogOut, User, Eye, Heart, Loader2, Crown, CreditCard, Check, X, MessageSquare, Bookmark } from 'lucide-react';
import { cn } from '../lib/utils';
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSubscription } from '../hooks/usePlans';
import { useFavorites } from '../hooks/useFavorites';
import { useWatched } from '../hooks/useWatched';
import { useCommunityStats } from '../hooks/useCommunityStats';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase/client';

export function Perfil() {
  const { user, loading, signOut } = useAuth();
  const { subscription, loading: subscriptionLoading } = useSubscription(user?.id || null);
  const { favorites, favoritesCount } = useFavorites(user?.id || null);
  const { watched } = useWatched(user?.id || null);
  const { stats: communityStats, loading: communityStatsLoading } = useCommunityStats(user?.id || null);
  const navigate = useNavigate();
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(true);
  const [contentDetails, setContentDetails] = useState<Record<string, any>>({});
  const [showFavorites, setShowFavorites] = useState(false);
  const [showWatched, setShowWatched] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.full_name || '');
  const [editAvatarColor, setEditAvatarColor] = useState(user?.avatar_url || 'bg-[#8aaa1f]');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const avatarColors = [
    { name: 'Verde Lima', class: 'bg-[#8aaa1f]' },
    { name: 'Verde Bosque', class: 'bg-[#477d1e]' },
    { name: 'Azul Suave', class: 'bg-[#8ba8d1]' },
    { name: 'Coral', class: 'bg-[#f0a3a3]' },
    { name: 'Dorado', class: 'bg-[#d4af37]' },
    { name: 'Púrpura', class: 'bg-[#a38bd1]' },
  ];

  // Load accessibility settings from profile
  useEffect(() => {
    if (user?.accessibility) {
      if (user.accessibility.highContrast !== undefined && user.accessibility.highContrast !== highContrast) {
        setHighContrast(user.accessibility.highContrast);
      }
      if (user.accessibility.largeText !== undefined && user.accessibility.largeText !== largeText) {
        setLargeText(user.accessibility.largeText);
      }
    }
  }, [user?.accessibility]);

  // Save accessibility settings to profile when they change
  useEffect(() => {
    const saveAccessibilitySettings = async () => {
      if (!user?.id) return;

      // Only save if different from current user object to avoid loops
      const currentHighContrast = user.accessibility?.highContrast ?? false;
      const currentLargeText = user.accessibility?.largeText ?? true;

      if (highContrast === currentHighContrast && largeText === currentLargeText) {
        return;
      }

      try {
        await supabase
          .from('profiles')
          .update({
            accessibility: {
              highContrast,
              largeText,
            }
          })
          .eq('id', user.id);
      } catch (error) {
        console.error('Error saving settings:', error);
      }
    };

    saveAccessibilitySettings();
  }, [highContrast, largeText, user?.id, user?.accessibility]);

  useEffect(() => {
    const fetchContentDetails = async () => {
      const allContentIds = [
        ...favorites.map(f => f.content_id),
        ...watched.map(w => w.content_id)
      ];

      if (allContentIds.length === 0) return;

      const { data } = await supabase
        .from('creator_content')
        .select('*')
        .in('id', allContentIds);

      if (data) {
        const detailsMap: Record<string, any> = {};
        data.forEach(item => {
          detailsMap[item.id] = item;
        });
        setContentDetails(detailsMap);
      }
    };

    fetchContentDetails();
  }, [favorites, watched]);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleSaveProfile = async () => {
    if (!user?.id) return;
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          full_name: editName,
          avatar_url: editAvatarColor,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      setIsEditing(false);
      window.location.reload();
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error al actualizar el perfil. Verifica las políticas RLS en Supabase.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user?.id) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // 1. Subir imagen al Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // 3. Actualizar perfil con la nueva URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      window.location.reload();
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      alert(`Error al cargar imagen: ${error.message || 'Verifica que el bucket "avatars" exista y sea público'}`);
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[#8aaa1f]/20 border-t-[#477d1e] rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <User className="w-6 h-6 text-[#477d1e]" />
          </div>
        </div>
        <p className="text-[#477d1e] font-bold animate-pulse">Cargando tu universo...</p>
      </div>
    );
  }

  if (!user) return null;

  const memberSince = user.created_at 
    ? new Date(user.created_at).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
    : 'Fecha desconocida';

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-[#f0f9eb] to-white -z-10 opacity-70" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 space-y-12">
        {/* Profile Header Card */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#8aaa1f] to-[#477d1e] rounded-[2.5rem] blur opacity-10 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-white/80 backdrop-blur-xl border border-white rounded-[2.5rem] p-6 sm:p-10 shadow-2xl shadow-[#477d1e]/5">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Avatar Section */}
              <div className="relative">
                <div className={cn(
                  "w-32 h-32 sm:w-40 sm:h-40 rounded-3xl shadow-2xl flex items-center justify-center transition-transform duration-500 hover:scale-105 overflow-hidden",
                  user.avatar_url?.startsWith('bg-') ? user.avatar_url : 'bg-gradient-to-br from-[#8aaa1f] to-[#477d1e]'
                )}>
                  {user.avatar_url && !user.avatar_url.startsWith('bg-') ? (
                    <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-16 h-16 sm:w-20 sm:h-20 text-white/90 drop-shadow-lg" />
                  )}
                  
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                    </div>
                  )}
                </div>
                
                {/* Botón de subida de archivo */}
                <label className="absolute -bottom-2 -right-2 bg-white text-[#477d1e] p-3 rounded-2xl shadow-xl hover:scale-110 transition-transform border border-gray-100 cursor-pointer">
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleUploadAvatar}
                    disabled={isUploading}
                  />
                  <Edit3 className="w-5 h-5" />
                </label>
              </div>

              {/* Info Section */}
              <div className="flex-1 text-center md:text-left space-y-4">
                <div className="space-y-2">
                  <div className="flex flex-col md:flex-row md:items-center gap-3">
                    <h1 className="text-3xl sm:text-5xl font-black text-[#1a1a1a] tracking-tight">
                      {user.full_name || 'Usuario'}
                    </h1>
                    <div className={cn(
                      "inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider mx-auto md:mx-0",
                      user.role === 'super_admin' ? "bg-purple-500 text-white shadow-lg shadow-purple-200" :
                      user.role === 'admin' ? "bg-blue-500 text-white shadow-lg shadow-blue-200" :
                      user.role === 'premium' ? "bg-[#477d1e] text-white shadow-lg shadow-green-200" :
                      "bg-gray-100 text-gray-500"
                    )}>
                      {user.role === 'super_admin' && <Crown className="w-3 h-3 fill-current" />}
                      {user.role === 'premium' && <Crown className="w-3 h-3 fill-current" />}
                      {user.role || 'Miembro'}
                    </div>
                  </div>
                  <p className="text-gray-400 font-medium flex items-center justify-center md:justify-start gap-2">
                    <Bookmark className="w-4 h-4 text-[#8aaa1f]" />
                    Miembro desde <span className="text-[#477d1e] font-bold">{memberSince}</span>
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
                  <button 
                    onClick={() => {
                      setEditName(user.full_name || '');
                      setEditAvatarColor(user.avatar_url || 'bg-[#8aaa1f]');
                      setIsEditing(true);
                    }}
                    className="bg-[#477d1e] text-white px-8 py-4 rounded-2xl font-bold text-sm hover:bg-[#3a6618] transition-all hover:shadow-xl hover:shadow-[#477d1e]/20 active:scale-95 flex items-center gap-2"
                  >
                    <Edit3 className="w-4 h-4" /> Configurar Perfil
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="bg-red-50 text-red-600 px-8 py-4 rounded-2xl font-bold text-sm hover:bg-red-100 transition-all active:scale-95 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Salir
                  </button>
                </div>
              </div>

              {/* Stats Highlights */}
              <div className="hidden lg:grid grid-cols-2 gap-4">
                <div className="bg-[#f0f9eb] p-6 rounded-[2rem] border border-[#8aaa1f]/10 text-center space-y-1">
                  <span className="text-3xl font-black text-[#477d1e] block">{favoritesCount}</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Favoritos</span>
                </div>
                <div className="bg-blue-50 p-6 rounded-[2rem] border border-blue-100 text-center space-y-1">
                  <span className="text-3xl font-black text-blue-600 block">{communityStatsLoading ? '...' : communityStats.likesGiven + communityStats.postsCreated}</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Social</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bento Grid Layout for Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content (Left/Center) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div
                onClick={() => setShowFavorites(!showFavorites)}
                className="group bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/50 cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Heart className="w-7 h-7 text-red-500 fill-current" />
                  </div>
                  <div className="px-3 py-1 bg-red-100 text-red-600 text-[10px] font-black rounded-full uppercase tracking-wider">
                    {favoritesCount} ítems
                  </div>
                </div>
                <h3 className="text-xl font-black text-[#1a1a1a] mb-2">Contenido Guardado</h3>
                <p className="text-gray-400 text-sm leading-relaxed">Tus videos, recetas y flyers favoritos organizados en un solo lugar.</p>
              </div>

              <div
                onClick={() => setShowWatched(!showWatched)}
                className="group bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/50 cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MessageSquare className="w-7 h-7 text-blue-500" />
                  </div>
                  <div className="px-3 py-1 bg-blue-100 text-blue-600 text-[10px] font-black rounded-full uppercase tracking-wider">
                    {communityStatsLoading ? '...' : communityStats.postsCreated} posts
                  </div>
                </div>
                <h3 className="text-xl font-black text-[#1a1a1a] mb-2">Actividad Social</h3>
                <p className="text-gray-400 text-sm leading-relaxed">Tu impacto en la comunidad: posts, comentarios y likes compartidos.</p>
              </div>
            </div>

            {/* Expanded Content View (Animated) */}
            {showFavorites && (
              <div className="bg-white/50 backdrop-blur-md rounded-[3rem] p-8 border border-white shadow-2xl animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-black text-[#1a1a1a] flex items-center gap-3">
                    <Heart className="w-6 h-6 text-red-500" /> Mis Favoritos
                  </h3>
                  <button onClick={() => setShowFavorites(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                {favorites.length === 0 ? (
                  <div className="text-center py-16 space-y-4">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                      <Heart className="w-10 h-10 text-gray-200" />
                    </div>
                    <p className="text-gray-400 font-medium">Aún no has guardado contenido.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {favorites.map((fav) => {
                      const content = contentDetails[fav.content_id];
                      return (
                        <div
                          key={fav.id}
                          onClick={() => navigate(fav.content_type === 'video' ? '/videos' : '/flyers')}
                          className="group relative bg-white rounded-3xl p-4 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-20 h-20 bg-[#f0f9eb] rounded-2xl overflow-hidden flex-shrink-0 relative">
                              {content?.thumbnail_url ? (
                                <img src={content.thumbnail_url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Heart className="w-8 h-8 text-[#8aaa1f]/30" />
                                </div>
                              )}
                              <div className="absolute top-1 right-1 px-2 py-0.5 bg-black/50 backdrop-blur-md text-[8px] text-white font-bold rounded-full uppercase">
                                {fav.content_type}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-[#1a1a1a] truncate group-hover:text-[#477d1e] transition-colors">{content?.title || 'Contenido Premium'}</h4>
                              <p className="text-xs text-gray-400 font-medium">Nutriconfianza Exclusive</p>
                              <div className="flex items-center gap-1 mt-2">
                                <Eye className="w-3 h-3 text-[#8aaa1f]" />
                                <span className="text-[10px] text-[#8aaa1f] font-bold">Ver ahora</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Recent History Section */}
            {!showFavorites && !showWatched && (
              <div className="space-y-6">
                <h3 className="text-2xl font-black text-[#1a1a1a] px-2 flex items-center gap-3">
                  <Eye className="w-6 h-6 text-[#477d1e]" /> Visto recientemente
                </h3>
                {watched.length === 0 ? (
                  <div className="bg-white rounded-[2.5rem] p-12 text-center border border-dashed border-gray-200">
                    <p className="text-gray-400 font-medium">Tu historial aparecerá aquí.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {watched.slice(0, 4).map((w) => {
                      const content = contentDetails[w.content_id];
                      return (
                        <div
                          key={w.id}
                          onClick={() => navigate(w.content_type === 'video' ? '/videos' : '/flyers')}
                          className="bg-white/60 hover:bg-white rounded-[2rem] p-4 border border-white shadow-lg shadow-gray-100 hover:shadow-2xl transition-all duration-300 cursor-pointer"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                              {content?.thumbnail_url ? (
                                <img src={content.thumbnail_url} alt="" className="w-full h-full object-cover rounded-2xl" />
                              ) : (
                                <Eye className="w-8 h-8 text-blue-200" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest">{w.content_type}</p>
                              <h4 className="font-bold text-sm text-[#1a1a1a] truncate">{content?.title || 'Cargando título...'}</h4>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Side Panels (Right) */}
          <div className="lg:col-span-4 space-y-8">
            {/* Membership Card */}
            <div className="relative overflow-hidden group">
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-[#477d1e] to-yellow-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative bg-[#1a1a1a] rounded-[2.5rem] p-8 text-white shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#477d1e]/20 blur-3xl -mr-16 -mt-16"></div>
                <div className="relative z-10 space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                      <Crown className="w-6 h-6 text-yellow-400" />
                    </div>
                    <span className={cn(
                      "text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full",
                      subscription?.status === 'active' ? "bg-[#477d1e] text-white" : "bg-red-500/20 text-red-300"
                    )}>
                      {subscription?.status === 'active' ? 'Socio Activo' : 'Sin Membresía'}
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-black mb-1">
                      {subscription ? subscription.plan_id.charAt(0).toUpperCase() + subscription.plan_id.slice(1) : 'Plan Gratuito'}
                    </h3>
                    <p className="text-white/50 text-xs font-medium">Nutriconfianza Premium Experience</p>
                  </div>

                  {subscription ? (
                    <div className="space-y-4 pt-4 border-t border-white/10">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-white/40 uppercase tracking-widest">Renovación</span>
                        <span className="text-yellow-400">{new Date(subscription.end_date || '').toLocaleDateString('es-ES')}</span>
                      </div>
                      <button onClick={() => navigate('/planes')} className="w-full bg-white/5 hover:bg-white/10 text-white py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-colors border border-white/10">
                        Gestionar Plan
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6 pt-4 border-t border-white/10 text-center">
                      <p className="text-sm text-white/60">Desbloquea el acceso ilimitado a todos los planes y videos.</p>
                      <button onClick={() => navigate('/planes')} className="w-full bg-[#477d1e] hover:bg-[#8aaa1f] text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-[#477d1e]/20 active:scale-95">
                        Mejorar ahora
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Preferences / Accessibility */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/50 space-y-8">
              <h3 className="text-xl font-black text-[#1a1a1a] flex items-center gap-3">
                <Eye className="w-6 h-6 text-[#477d1e]" /> Preferencias
              </h3>
              
              <div className="space-y-6">
                <div className="group flex items-center justify-between p-2 rounded-2xl hover:bg-gray-50 transition-colors">
                  <div className="space-y-0.5">
                    <span className="text-sm font-bold text-gray-800">Modo Lectura</span>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Texto más grande</p>
                  </div>
                  <button 
                    onClick={() => setLargeText(!largeText)} 
                    className={cn("w-14 h-7 rounded-full transition-all relative", largeText ? "bg-[#477d1e]" : "bg-gray-200")}
                  >
                    <div className={cn("w-5 h-5 bg-white rounded-full absolute top-1 transition-all shadow-md", largeText ? "left-8" : "left-1")} />
                  </button>
                </div>

                <div className="group flex items-center justify-between p-2 rounded-2xl hover:bg-gray-50 transition-colors">
                  <div className="space-y-0.5">
                    <span className="text-sm font-bold text-gray-800">Alto Contraste</span>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Para mejor visibilidad</p>
                  </div>
                  <button 
                    onClick={() => setHighContrast(!highContrast)} 
                    className={cn("w-14 h-7 rounded-full transition-all relative", highContrast ? "bg-[#477d1e]" : "bg-gray-200")}
                  >
                    <div className={cn("w-5 h-5 bg-white rounded-full absolute top-1 transition-all shadow-md", highContrast ? "left-8" : "left-1")} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal - Premium Redesign */}
      {isEditing && (
        <div className="fixed inset-0 bg-[#1a1a1a]/80 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] p-8 sm:p-12 max-w-xl w-full shadow-2xl shadow-black/20 animate-in zoom-in-95 duration-300 relative overflow-hidden">
            {/* Modal Decorations */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#f0f9eb] rounded-full -mr-16 -mt-16 -z-10"></div>
            
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-black text-[#1a1a1a] flex items-center gap-3">
                <Edit3 className="w-8 h-8 text-[#477d1e]" /> Editar Perfil
              </h2>
              <button 
                onClick={() => setIsEditing(false)}
                className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-8">
              {/* Name Input */}
              <div className="space-y-3">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Nombre Público</label>
                <div className="relative">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                  <input 
                    type="text" 
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Tu nombre completo"
                    className="w-full pl-14 pr-6 py-5 bg-gray-50 border-none rounded-[2rem] focus:ring-4 focus:ring-[#477d1e]/10 focus:bg-white transition-all text-lg font-bold text-[#1a1a1a] shadow-inner"
                  />
                </div>
              </div>

              {/* Avatar Color Selector */}
              <div className="space-y-4">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Estilo de Avatar</label>
                <div className="grid grid-cols-6 gap-3">
                  {avatarColors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setEditAvatarColor(color.class)}
                      className={cn(
                        "w-12 h-12 rounded-2xl transition-all relative flex items-center justify-center shadow-lg",
                        color.class,
                        editAvatarColor === color.class ? "scale-110 ring-4 ring-[#477d1e]/20" : "hover:scale-105 opacity-80 hover:opacity-100"
                      )}
                      title={color.name}
                    >
                      {editAvatarColor === color.class && <Check className="w-6 h-6 text-white drop-shadow-md" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6">
                <button 
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                  className="flex-1 px-8 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all disabled:opacity-30"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="flex-[2] bg-gradient-to-r from-[#8aaa1f] to-[#477d1e] text-white px-8 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:shadow-2xl hover:shadow-[#477d1e]/30 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Procesando...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" /> Guardar Cambios
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
