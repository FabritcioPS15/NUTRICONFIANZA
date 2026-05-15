import { Play, Loader2, X, Bookmark, Activity, Heart, Apple, Dumbbell, LayoutGrid, Search } from 'lucide-react';
import { cn, resolveMediaUrl } from '../lib/utils';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video } from '../types';
import { supabase } from '../lib/supabase/client';
import { useAuth } from '../hooks/useAuth';
import { useFavorites } from '../hooks/useFavorites';
import { useWatched } from '../hooks/useWatched';

const CATEGORIES = [
  { id: 'Todos', name: 'TODOS', icon: LayoutGrid },
  { id: 'Diabetes', name: 'DIABETES', icon: Activity },
  { id: 'Hipertensión', name: 'HIPERTENSIÓN', icon: Heart },
  { id: 'Obesidad', name: 'OBESIDAD', icon: Dumbbell },
  { id: 'General', name: 'GENERAL', icon: Apple }
];

export function Videos() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { favorites, addFavorite, removeFavorite } = useFavorites(user?.id || null);
  const { markAsWatched } = useWatched(user?.id || null);

  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [videosList, setVideosList] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideos();
  }, [selectedCategory]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('creator_content')
        .select('*')
        .eq('content_type', 'video')
        .order('created_at', { ascending: false });

      if (selectedCategory !== 'Todos') {
        query = query.eq('category', selectedCategory);
      }

      const { data, error } = await query;

      if (error) throw error;

      if (data) {
        const mapped: Video[] = data.map(v => ({
          id: v.id,
          title: v.title || "",
          category: v.category || "General",
          desc: v.description || "",
          img: v.thumbnail_url ? resolveMediaUrl(v.thumbnail_url) : "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400",
          videoUrl: v.media_url,
          likes: v.likes_count || 0,
          liked: false
        }));
        setVideosList(mapped);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSave = async (id: string) => {
    const isFav = favorites.some(f => f.content_id === id);
    if (isFav) {
      await removeFavorite(id);
    } else {
      await addFavorite(id, 'video');
    }
  };

  const isFavorite = (id: string) => {
    return favorites.some(f => f.content_id === id);
  };

  const handleViewVideo = (video: Video) => {
    markAsWatched(String(video.id), 'video');
    navigate(`/view-video/${video.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 text-[#477d1e] animate-spin" />
      </div>
    );
  }

  const featuredVideo = videosList[0];
  const nextVideos = videosList.slice(1, 4);
  const remainingVideos = videosList.slice(4);

  return (
    <div className="bg-white min-h-screen animate-fade-in flex flex-col lg:flex-row gap-8 pb-20">

      {/* Sidebar de Filtros Vertical */}
      <aside className="lg:w-24 lg:sticky lg:top-24 h-fit flex flex-col items-center gap-6 py-8 px-4 bg-gray-50/50 rounded-3xl border border-gray-100 flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-[#477d1e]/10 flex items-center justify-center text-[#477d1e] mb-4">
          <Search className="w-5 h-5" />
        </div>

        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "group flex flex-col items-center gap-2 transition-all",
                isActive ? "text-[#477d1e]" : "text-gray-300 hover:text-[#477d1e]"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center transition-all border-2",
                isActive ? "bg-[#477d1e] border-[#477d1e] text-white shadow-lg shadow-[#477d1e]/20" : "bg-white border-transparent"
              )}>
                <cat.icon className="w-5 h-5" />
              </div>
              <span className="text-[8px] font-black uppercase tracking-widest">{cat.name}</span>
            </button>
          );
        })}

        {/* Destacado Hoy Box */}
        <div className="mt-20 hidden lg:block">
          <div className="w-48 -rotate-90 origin-bottom-left translate-x-12 translate-y-24">
            <div className="bg-[#477d1e]/5 p-6 rounded-[2rem] border-l-4 border-[#477d1e]">
              <p className="text-[10px] font-black uppercase text-[#477d1e] mb-1">Destacado hoy</p>
              <p className="text-[8px] font-bold text-gray-400 line-clamp-2">Nuevas estrategias de control metabólico avanzado.</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 space-y-12">

        {/* Top Section: Featured + Next Videos */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Big Featured Video */}
          {featuredVideo && (
            <div className="lg:col-span-2 relative aspect-video rounded-[3rem] overflow-hidden group cursor-pointer shadow-2xl shadow-green-900/10" onClick={() => handleViewVideo(featuredVideo)}>
              <img src={featuredVideo.img} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt={featuredVideo.title} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 fill-current text-[#1a1a1a] translate-x-0.5" />
                </div>
              </div>

              <div className="absolute bottom-10 left-10 text-white">
                <span className="px-4 py-1.5 bg-[#477d1e] rounded-xl text-[10px] font-black uppercase tracking-widest mb-4 inline-block">
                  {featuredVideo.category}
                </span>
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight">{featuredVideo.title}</h2>
              </div>
            </div>
          )}

          {/* Next Videos List */}
          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#1a1a1a] flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#477d1e]" />
              Siguientes Videos
            </h3>
            <div className="space-y-4">
              {nextVideos.map((v) => (
                <div key={v.id} className="flex items-center gap-4 group cursor-pointer" onClick={() => handleViewVideo(v)}>
                  <div className="w-32 aspect-video rounded-2xl overflow-hidden relative flex-shrink-0">
                    <img src={v.img} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={v.title} />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <Play className="w-4 h-4 text-white fill-current" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-black text-[#1a1a1a] leading-tight line-clamp-2 group-hover:text-[#477d1e] transition-colors">{v.title}</h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-widest">{v.category}</p>
                  </div>
                </div>
              ))}
              {nextVideos.length === 0 && <p className="text-gray-400 text-xs font-bold">No hay videos sugeridos.</p>}
            </div>
          </div>
        </section>

        {/* Remaining Videos Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {remainingVideos.map((video) => (
            <div key={video.id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] overflow-hidden group flex flex-col">
              <div className="relative aspect-video overflow-hidden cursor-pointer" onClick={() => handleViewVideo(video)}>
                <img src={video.img} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={video.title} />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

                <button
                  onClick={(e) => { e.stopPropagation(); toggleSave(String(video.id)); }}
                  className={cn(
                    "absolute top-5 right-5 w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-md transition-all shadow-lg",
                    isFavorite(String(video.id)) ? "bg-[#477d1e] text-white" : "bg-white/90 text-gray-400 hover:text-[#477d1e]"
                  )}
                >
                  <Bookmark className={cn("w-5 h-5", isFavorite(String(video.id)) ? "fill-current" : "")} />
                </button>
              </div>

              <div className="p-8">
                <span className="text-[10px] font-black uppercase text-[#477d1e] bg-[#477d1e]/5 px-3 py-1 rounded-lg tracking-widest mb-3 inline-block">
                  {video.category}
                </span>
                <h3 className="text-xl font-black text-[#1a1a1a] leading-tight tracking-tight line-clamp-2">{video.title}</h3>
              </div>
            </div>
          ))}
        </section>

      </main>

    </div>
  );
}
