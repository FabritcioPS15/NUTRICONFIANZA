import { Play, Loader2, X, Bookmark } from 'lucide-react';
import { cn } from '../lib/utils';
import { useState, useEffect } from 'react';
import { Video } from '../types';
import { supabase } from '../lib/supabase';

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
  const categories = ['Todos', 'Diabetes', 'Hipertensión', 'Obesidad', 'General'];
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [videosList, setVideosList] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingVideo, setPlayingVideo] = useState<Video | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('nutriconfianza_saved_videos');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    fetchVideos();
  }, [selectedCategory]);

  useEffect(() => {
    localStorage.setItem('nutriconfianza_saved_videos', JSON.stringify(savedIds));
  }, [savedIds]);

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

  const toggleSave = (id: string) => {
    setSavedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
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
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-3 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              "px-5 py-2 rounded-full text-sm font-medium transition-colors",
              selectedCategory === cat 
                ? "bg-[#246b38] text-white" 
                : "bg-[#cce3d1] text-[#246b38] hover:bg-[#b5d5bd]"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar */}
        <div className="w-full lg:w-72 flex-shrink-0 space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-[#246b38] leading-tight mb-4">
              Curaduría de Bienestar
            </h1>
            <p className="text-gray-600 leading-relaxed">
              Videos educativos para tu salud. Reproduce contenido experto sin salir de la plataforma.
            </p>
          </div>
        </div>

        {/* Video List */}
        <div className="flex-1 space-y-8">
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
                  onClick={() => setPlayingVideo(video)}
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
                
                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#246b38] bg-[#e0efd5] px-3 py-1 rounded-lg mb-3 inline-block">
                        {video.category}
                      </span>
                      <h2 className="text-2xl font-bold text-[#1a1a1a] mb-2">{video.title}</h2>
                      <p className="text-gray-500 text-sm">{video.desc}</p>
                    </div>
                    <div className="flex gap-2">
                       <button 
                         onClick={() => toggleSave(String(video.id))}
                         className={cn(
                           "p-4 rounded-2xl transition-all shadow-sm",
                           savedIds.includes(String(video.id)) ? "bg-[#246b38] text-white" : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                         )}
                       >
                         <Bookmark className={cn("w-5 h-5", savedIds.includes(String(video.id)) ? "fill-current" : "")} />
                       </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
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
