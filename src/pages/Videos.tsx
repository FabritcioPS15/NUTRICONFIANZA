import { Play, Loader2, X, Bookmark, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video } from '../types';
import { supabase } from '../lib/supabase/client';
import { useAuth } from '../hooks/useAuth';
import { useFavorites } from '../hooks/useFavorites';
import { useWatched } from '../hooks/useWatched';

const INITIAL_VIDEOS: Video[] = [
  {
    id: 'v1',
    title: 'Índice Glucémico: Qué es y cómo afecta tu energía',
    category: 'Diabetes',
    desc: 'Descubre por qué no todos los carbohidratos son iguales para tu metabolismo.',
    img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=1200',
    likes: 2400,
    liked: false
  }
];

export function Videos() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { favorites, addFavorite, removeFavorite } = useFavorites(user?.id || null);
  const { markAsWatched } = useWatched(user?.id || null);
  const categories = ['Todos', 'Diabetes', 'Hipertensión', 'Obesidad', 'General'];
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [videosList, setVideosList] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingVideo, setPlayingVideo] = useState<Video | null>(null);

  useEffect(() => {
    fetchVideos();
  }, [selectedCategory]);

  useEffect(() => {
    if (playingVideo && user?.id) {
      markAsWatched(String(playingVideo.id), 'video');
    }
  }, [playingVideo, user?.id, markAsWatched]);

  const handleViewVideo = (video: Video) => {
    markAsWatched(String(video.id), 'video');
    navigate(`/view-video/${video.id}`);
  };

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

      if (data && data.length > 0) {
        const mapped: Video[] = data.map(v => ({
          id: v.id,
          title: v.title || "",
          category: v.category || "General",
          desc: v.description || "",
          img: v.thumbnail_url || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400",
          videoUrl: v.media_url,
          likes: v.likes_count || 0,
          liked: false
        }));
        setVideosList(mapped);
      } else {
        setVideosList(INITIAL_VIDEOS.filter(v => selectedCategory === 'Todos' || v.category === selectedCategory));
      }
    } catch (err) {
      console.error('Error fetching videos:', err);
      setVideosList(INITIAL_VIDEOS);
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

  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/watch?v=')) {
      return url.replace('watch?v=', 'embed/');
    }
    if (url.includes('youtu.be/')) {
      return url.replace('youtu.be/', 'youtube.com/embed/');
    }
    return url;
  };

  const isIframeable = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  return (
    <div className="py-8 animate-fade-in-up">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar - Integrated Filters for Desktop */}
        <div className="w-full lg:w-[320px] flex-shrink-0 space-y-12">
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-[#246b38] leading-tight mb-6 tracking-tighter">
              Curaduría de Bienestar
            </h1>
            <p className="text-gray-500 font-medium leading-relaxed mb-10">
              Aprende con cápsulas educativas diseñadas por expertos. Una experiencia visual sin distracciones para tu salud.
            </p>
            
            {/* Desktop Navigation List (Sidebar) */}
            <div className="hidden lg:flex flex-col gap-3">
               <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Filtrar Contenido</h3>
               {categories.map((cat) => {
                 const isActive = selectedCategory === cat;
                 return (
                   <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      "group flex flex-col p-5 rounded-[2rem] transition-all border-2 text-left relative overflow-hidden",
                      isActive 
                        ? "bg-[#246b38] border-[#246b38] text-white shadow-xl shadow-[#246b38]/20" 
                        : "bg-white border-gray-50 text-gray-400 hover:border-[#246b38]/20 hover:text-[#246b38]"
                    )}
                   >
                     <div className="flex items-center justify-between z-10">
                       <span className="font-black text-sm uppercase tracking-widest">{cat}</span>
                       <div className={cn("w-1.5 h-1.5 rounded-full transition-all", isActive ? "bg-white scale-150" : "bg-gray-200 group-hover:bg-[#246b38]")} />
                     </div>
                     {isActive && <div className="absolute top-0 left-0 w-1.5 h-full bg-white opacity-50" />}
                   </button>
                 );
               })}
            </div>
          </div>

          <div className="space-y-6">
             <div className="bg-[#f2f4f1] p-8 rounded-[2.5rem] border-l-4 border-[#246b38] shadow-sm">
                <span className="text-[10px] font-black text-[#246b38] uppercase tracking-widest block mb-1">Destacado hoy</span>
                <p className="text-xs font-bold text-gray-400 leading-relaxed">Control glucémico: Mitos y realidades en la alimentación diaria.</p>
             </div>
             <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm opacity-60">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Próximamente</span>
                <p className="text-xs font-bold text-gray-400 leading-relaxed">Webinar en vivo: Nutrición para la salud cardiovascular el 15 de Octubre.</p>
             </div>
          </div>
        </div>

        {/* Dynamic Content Feed */}
        <div className="flex-1 space-y-10">
          {/* Mobile Category Dropdown Filter */}
          <div className="lg:hidden relative mb-10 z-50">
            <div className="flex items-center gap-4">
              <div className="relative group w-full">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 bg-white border-2 border-gray-100 px-8 py-5 rounded-[2rem] font-black text-sm text-[#1a1a1a] shadow-sm hover:border-[#246b38]/30 transition-all active:scale-95 w-full justify-between"
                >
                  <div className="flex items-center gap-2">
                     <div className="w-2.5 h-2.5 rounded-full bg-[#246b38]" />
                     Explorar: {selectedCategory}
                  </div>
                  <ChevronDown className={cn("w-5 h-5 text-[#246b38] transition-transform", isDropdownOpen && "rotate-180")} />
                </button>
                
                {isDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
                    <div className="absolute top-full left-0 right-0 mt-3 bg-white/95 backdrop-blur-2xl border-2 border-gray-100 rounded-[2.5rem] overflow-hidden shadow-2xl z-20 p-2 animate-in fade-in slide-in-from-top-2 duration-300">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => {
                            setSelectedCategory(cat);
                            setIsDropdownOpen(false);
                          }}
                          className={cn(
                            "w-full text-left px-8 py-5 rounded-2xl text-sm font-black transition-all flex items-center justify-between group/item",
                            selectedCategory === cat 
                              ? "bg-[#246b38] text-white shadow-lg shadow-[#246b38]/20" 
                              : "text-gray-500 hover:bg-[#e0efd5] hover:text-[#246b38]"
                          )}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Video List */}
          <div className="space-y-8">
            {loading ? (
              <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 text-[#246b38] animate-spin" /></div>
            ) : videosList.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                <p className="text-gray-400 font-medium">Próximamente más videos.</p>
              </div>
            ) : (
              videosList.map((video) => (
                <div key={video.id} className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm group">
                  <div
                    className="relative aspect-[16/9] cursor-pointer overflow-hidden"
                    onClick={() => handleViewVideo(video)}
                  >
                    <img 
                      src={video.img} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                      alt={video.title} 
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
                        <Play className="w-8 h-8 fill-current text-[#1a1a1a]" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row justify-between items-start mb-4 gap-4">
                      <div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-[#246b38] bg-[#e0efd5] px-3 py-1 rounded-lg mb-3 inline-block">
                          {video.category}
                        </span>
                        <h2 className="text-xl md:text-2xl font-black text-[#1a1a1a] mb-2 leading-tight">{video.title}</h2>
                        <p className="text-gray-500 text-sm font-medium">{video.desc}</p>
                      </div>
                      <div className="flex gap-2">
                         <button
                           onClick={() => toggleSave(String(video.id))}
                           className={cn(
                             "p-4 rounded-2xl transition-all shadow-sm",
                             isFavorite(String(video.id)) ? "bg-[#246b38] text-white" : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                           )}
                         >
                           <Bookmark className={cn("w-5 h-5", isFavorite(String(video.id)) ? "fill-current" : "")} />
                         </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Video Player Modal */}
      {playingVideo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 animate-fade-in">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-sm" onClick={() => setPlayingVideo(null)} />
          <button 
            onClick={() => setPlayingVideo(null)}
            className="absolute top-6 right-6 text-white hover:rotate-90 transition-transform p-3 z-[110]"
          >
            <X className="w-10 h-10" />
          </button>
          
          <div className="relative w-full max-w-6xl aspect-[16/9] bg-black rounded-3xl overflow-hidden shadow-2xl z-[101]">
            {isIframeable(playingVideo.videoUrl || '') ? (
              <iframe
                src={getEmbedUrl(playingVideo.videoUrl || '')}
                className="w-full h-full border-none"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video 
                src={playingVideo.videoUrl} 
                controls 
                autoPlay 
                className="w-full h-full object-contain"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
