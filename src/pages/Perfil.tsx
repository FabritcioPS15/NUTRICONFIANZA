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

  // Load accessibility settings from profile
  useEffect(() => {
    if (user?.accessibility) {
      if (user.accessibility.highContrast !== undefined) {
        setHighContrast(user.accessibility.highContrast);
      }
      if (user.accessibility.largeText !== undefined) {
        setLargeText(user.accessibility.largeText);
      }
    }
  }, [user]);

  // Save accessibility settings to profile when they change
  useEffect(() => {
    const saveAccessibilitySettings = async () => {
      if (!user?.id) return;

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
        alert('Error al guardar configuración');
      }
    };

    saveAccessibilitySettings();
  }, [highContrast, largeText, user?.id]);

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

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#477d1e] animate-spin" />
      </div>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  const memberSince = user.created_at 
    ? new Date(user.created_at).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
    : 'Fecha desconocida';

  return (
    <div className="py-6 sm:py-8 px-4 sm:px-6 space-y-8 sm:space-y-12 max-w-5xl mx-auto animate-fade-in-up">
      {/* Header Profile */}
      <div className="flex flex-col items-center text-center sm:text-left sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="flex flex-col items-center sm:flex-row sm:items-center gap-4 sm:gap-6">
          <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-[#8aaa1f] border-4 border-white shadow-md flex items-center justify-center">
            <User className="w-10 h-10 sm:w-14 sm:h-14 text-[#477d1e]" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold text-[#1a1a1a] mb-1 tracking-tight">{user.full_name || user.email?.split('@')[0] || 'Usuario'}</h1>
            <p className="text-gray-500 font-medium text-sm sm:text-base">Miembro desde {memberSince}</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none justify-center bg-[#8aaa1f] hover:bg-[#b5d5bd] tracking-wide text-[#477d1e] px-5 sm:px-6 py-3 rounded-full font-bold text-sm flex items-center gap-2 transition-colors">
            <Edit3 className="w-4 h-4" /> Editar Perfil
          </button>
          <button 
            onClick={handleLogout}
            className="flex-1 sm:flex-none justify-center bg-[#f0d4d4] hover:bg-[#e6c1c1] tracking-wide text-red-800 px-5 sm:px-6 py-3 rounded-full font-bold text-sm flex items-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Cerrar Sesión
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 items-start">
        {/* Left Sidebar */}
        <div className="w-full lg:w-80 space-y-6 flex-shrink-0">
          <div className="bg-white border border-gray-100 shadow-sm rounded-3xl p-5 sm:p-8">
            <h3 className="flex items-center gap-3 font-bold text-base sm:text-lg mb-6 sm:mb-8 text-[#1a1a1a]">
              <User className="w-5 h-5 text-[#477d1e] fill-current" /> Datos Personales
            </h3>
            
            <div className="space-y-4 sm:space-y-6">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Email</p>
                <p className="font-medium text-sm text-[#1a1a1a] break-all">{user.email}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Nombre</p>
                <p className="font-medium text-sm text-[#1a1a1a]">{user.full_name || 'No especificado'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Rol</p>
                <div className={cn(
                  "flex items-center gap-2 text-[10px] font-black uppercase px-3 py-1.5 rounded-full w-fit",
                  user.role === 'super_admin' ? "bg-purple-100 text-purple-900" :
                  user.role === 'admin' ? "bg-blue-100 text-blue-900" :
                  user.role === 'premium' ? "bg-green-100 text-green-900" :
                  "bg-gray-100 text-gray-700"
                )}>
                  {user.role === 'super_admin' && <Crown className="w-3 h-3" />}
                  {user.role || 'user'}
                </div>
              </div>
            </div>
          </div>

          {/* Suscripción / Membresía */}
          <div className="bg-gradient-to-br from-[#477d1e] to-[#477d1e] rounded-3xl p-5 sm:p-8 text-white shadow-lg">
            <h3 className="flex items-center gap-3 font-bold text-base sm:text-lg mb-6 sm:mb-8">
              <Crown className="w-5 h-5" /> Mi Membresía
            </h3>
            
            {subscriptionLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : subscription ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium opacity-90">Estado</span>
                  <span className={cn(
                    "text-xs font-bold uppercase px-2 py-1 rounded-full",
                    subscription.status === 'active' ? "bg-green-400 text-green-900" :
                    subscription.status === 'cancelled' ? "bg-red-400 text-red-900" :
                    "bg-yellow-400 text-yellow-900"
                  )}>
                    {subscription.status === 'active' ? 'Activa' :
                     subscription.status === 'cancelled' ? 'Cancelada' :
                     subscription.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium opacity-90">Plan ID</span>
                  <span className="text-xs font-mono opacity-75">{subscription.plan_id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium opacity-90">Inicio</span>
                  <span className="text-xs opacity-75">{new Date(subscription.start_date).toLocaleDateString('es-ES')}</span>
                </div>
                {subscription.end_date && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium opacity-90">Fin</span>
                    <span className="text-xs opacity-75">{new Date(subscription.end_date).toLocaleDateString('es-ES')}</span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-2 border-t border-white/20">
                  <span className="text-sm font-medium opacity-90">Renovación</span>
                  {subscription.auto_renew ? (
                    <span className="flex items-center gap-1 text-xs font-medium text-green-300">
                      <Check className="w-3 h-3" /> Activada
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-medium text-red-300">
                      <X className="w-3 h-3" /> Desactivada
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <CreditCard className="w-8 h-8 mx-auto mb-2 opacity-75" />
                <p className="text-sm font-medium opacity-90 mb-3">Sin suscripción activa</p>
                <button onClick={() => navigate('/planes')} className="bg-white text-[#477d1e] px-4 py-2 rounded-full text-xs font-bold hover:bg-[#8aaa1f] transition-colors">
                  Ver Planes
                </button>
              </div>
            )}
          </div>

          <div className="bg-[#f5f5f5] rounded-3xl p-5 sm:p-8">
            <h3 className="flex items-center gap-3 font-bold text-base sm:text-lg mb-6 sm:mb-8 text-[#1a1a1a]">
              <Eye className="w-5 h-5 text-[#477d1e] fill-current" /> Accesibilidad
            </h3>
            
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Texto Grande</span>
                <button onClick={() => setLargeText(!largeText)} className={cn("w-12 h-6 rounded-full transition-colors relative", largeText ? "bg-[#477d1e]" : "bg-gray-300")}>
                  <div className={cn("w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow", largeText ? "left-6" : "left-0.5")} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Alto Contraste</span>
                <button onClick={() => setHighContrast(!highContrast)} className={cn("w-12 h-6 rounded-full transition-colors relative", highContrast ? "bg-[#477d1e]" : "bg-gray-300")}>
                  <div className={cn("w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow", highContrast ? "left-6" : "left-0.5")} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main content right */}
        <div className="flex-1 space-y-8 sm:space-y-12 w-full">
          {/* Mi Progreso */}
          <section>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-[#1a1a1a]">Mi Progreso</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div
                onClick={() => setShowFavorites(!showFavorites)}
                className="bg-white border border-gray-100 shadow-sm rounded-3xl p-4 sm:p-6 text-center cursor-pointer hover:shadow-md transition-all hover:border-[#477d1e]/30"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#8aaa1f] rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-[#477d1e] fill-current" />
                </div>
                <h3 className="font-bold text-base sm:text-lg mb-2">Contenido Guardado</h3>
                <p className="text-gray-500 text-xs sm:text-sm">Guarda tus videos y flyers preferidos</p>
                <div className="mt-3 sm:mt-4 text-xl sm:text-2xl font-bold text-[#477d1e]">{favoritesCount}</div>
                <p className="text-xs text-gray-400">Elementos guardados</p>
              </div>

              <div
                onClick={() => setShowWatched(!showWatched)}
                className="bg-white border border-gray-100 shadow-sm rounded-3xl p-4 sm:p-6 text-center cursor-pointer hover:shadow-md transition-all hover:border-[#477d1e]/30"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#8aaa1f] rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-[#477d1e]" />
                </div>
                <h3 className="font-bold text-base sm:text-lg mb-2">Mi Comunidad</h3>
                <p className="text-gray-500 text-xs sm:text-sm">Likes, posts e interacción</p>
                <div className="mt-3 sm:mt-4 text-xl sm:text-2xl font-bold text-[#477d1e]">{communityStatsLoading ? '...' : communityStats.likesGiven + communityStats.postsCreated}</div>
                <p className="text-xs text-gray-400">Interacciones totales</p>
              </div>
            </div>

            {/* Sección expandida de Contenido Guardado */}
            {showFavorites && (
              <div className="mt-6 bg-white border border-gray-100 rounded-3xl p-6">
                <h3 className="text-lg font-bold text-[#1a1a1a] mb-4">Todo tu Contenido Guardado</h3>
                {favorites.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No tienes contenido guardado aún.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {favorites.map((fav) => {
                      const content = contentDetails[fav.content_id];
                      return (
                        <div
                          key={fav.id}
                          onClick={() => navigate(fav.content_type === 'video' ? '/videos' : '/flyers')}
                          className="bg-gray-50 border border-gray-100 rounded-2xl p-4 cursor-pointer hover:shadow-md transition-all hover:border-[#477d1e]/20"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-16 h-16 bg-[#8aaa1f] rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                              {content?.thumbnail_url ? (
                                <img src={content.thumbnail_url} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <Heart className="w-6 h-6 text-[#477d1e] fill-current" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-gray-400 mb-1">{fav.content_type === 'video' ? 'Video' : 'Flyer'}</p>
                              <p className="font-bold text-sm text-[#1a1a1a] truncate">{content?.title || 'Sin título'}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Sección expandida de Comunidad */}
            {showWatched && (
              <div className="mt-6 bg-white border border-gray-100 rounded-3xl p-6">
                <h3 className="text-lg font-bold text-[#1a1a1a] mb-4">Estadísticas de Comunidad</h3>
                {communityStatsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-[#477d1e]" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-center">
                      <div className="w-12 h-12 bg-[#8aaa1f] rounded-full flex items-center justify-center mx-auto mb-3">
                        <Heart className="w-6 h-6 text-[#477d1e] fill-current" />
                      </div>
                      <div className="text-2xl font-bold text-[#477d1e] mb-1">{communityStats.likesGiven}</div>
                      <p className="text-xs text-gray-500">Likes dados</p>
                    </div>
                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-center">
                      <div className="w-12 h-12 bg-[#8aaa1f] rounded-full flex items-center justify-center mx-auto mb-3">
                        <MessageSquare className="w-6 h-6 text-[#477d1e]" />
                      </div>
                      <div className="text-2xl font-bold text-[#477d1e] mb-1">{communityStats.postsCreated}</div>
                      <p className="text-xs text-gray-500">Posts creados</p>
                    </div>
                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-center">
                      <div className="w-12 h-12 bg-[#f0d4d4] rounded-full flex items-center justify-center mx-auto mb-3">
                        <Bookmark className="w-6 h-6 text-[#477d1e]" />
                      </div>
                      <div className="text-2xl font-bold text-[#477d1e] mb-1">{communityStats.postsSaved}</div>
                      <p className="text-xs text-gray-500">Posts guardados</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Separador visual */}
            <div className="border-t border-gray-200 my-6"></div>

            {/* Contenido Reciente */}
            {(favorites.length > 0 || watched.length > 0) && (
              <div>
                <h3 className="text-lg font-bold text-[#1a1a1a] mb-4">Contenido Reciente</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {favorites.slice(0, 2).map((fav) => {
                    const content = contentDetails[fav.content_id];
                    return (
                      <div
                        key={fav.id}
                        onClick={() => navigate(fav.content_type === 'video' ? '/videos' : '/flyers')}
                        className="bg-white border border-gray-100 rounded-2xl p-4 cursor-pointer hover:shadow-md transition-all hover:border-[#477d1e]/20"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-16 bg-[#8aaa1f] rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {content?.thumbnail_url ? (
                              <img src={content.thumbnail_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <Heart className="w-6 h-6 text-[#477d1e] fill-current" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-400 mb-1">{fav.content_type === 'video' ? 'Video' : 'Flyer'}</p>
                            <p className="font-bold text-sm text-[#1a1a1a] truncate">{content?.title || 'Sin título'}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {watched.slice(0, 2).map((w) => {
                    const content = contentDetails[w.content_id];
                    return (
                      <div
                        key={w.id}
                        onClick={() => navigate(w.content_type === 'video' ? '/videos' : '/flyers')}
                        className="bg-white border border-gray-100 rounded-2xl p-4 cursor-pointer hover:shadow-md transition-all hover:border-[#477d1e]/20"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-16 bg-[#8aaa1f] rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {content?.thumbnail_url ? (
                              <img src={content.thumbnail_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <Eye className="w-6 h-6 text-[#477d1e]" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-400 mb-1">{w.content_type === 'video' ? 'Video' : 'Flyer'}</p>
                            <p className="font-bold text-sm text-[#1a1a1a] truncate">{content?.title || 'Sin título'}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
