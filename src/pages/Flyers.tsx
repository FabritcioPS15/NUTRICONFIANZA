import { Bookmark, Loader2, Search, LayoutGrid, Activity, Heart, Apple, Dumbbell } from 'lucide-react';
import { cn, resolveMediaUrl } from '../lib/utils';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flyer } from '../types';
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

export function Flyers() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { favorites, addFavorite, removeFavorite } = useFavorites(user?.id || null);
  const { markAsWatched } = useWatched(user?.id || null);
  
  const [selectedCat, setSelectedCat] = useState('Todos');
  const [flyersList, setFlyersList] = useState<Flyer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFlyers();
  }, [selectedCat]);

  const fetchFlyers = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('creator_content')
        .select('*')
        .eq('content_type', 'flyer')
        .order('created_at', { ascending: false });

      if (selectedCat !== 'Todos') {
        query = query.eq('category', selectedCat);
      }

      const { data, error } = await query;

      if (error) throw error;

      if (data) {
        const mapped: Flyer[] = data.map(f => ({
          id: f.id,
          title: f.title || "",
          desc: f.description || "",
          tag: f.category || "General",
          img: f.media_url ? resolveMediaUrl(f.media_url) : "https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&q=80&w=400",
          featured: false,
          saved: false,
          info: "PDF"
        }));
        setFlyersList(mapped);
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
      await addFavorite(id, 'flyer');
    }
  };

  const isFavorite = (id: string) => {
    return favorites.some(f => f.content_id === id);
  };

  const handleViewFlyer = (flyer: Flyer) => {
    markAsWatched(String(flyer.id), 'flyer');
    navigate(`/view-flyer/${flyer.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 text-[#477d1e] animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-32 animate-fade-in overflow-x-hidden">
      
      {/* Instagram-style Category Filter */}
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-12 border-b border-gray-50 mb-12">
        <div className="flex flex-wrap justify-center gap-6 md:gap-12">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCat === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className={cn(
                  "group flex flex-col items-center gap-3 transition-all",
                  isActive ? "text-[#477d1e]" : "text-gray-400 hover:text-[#477d1e]"
                )}
              >
                <div className={cn(
                  "w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-all border-2",
                  isActive 
                    ? "bg-white border-[#477d1e] p-1 scale-110 shadow-lg" 
                    : "bg-gray-50 border-transparent hover:border-gray-200"
                )}>
                   <div className={cn(
                     "w-full h-full rounded-full flex items-center justify-center",
                     isActive ? "bg-[#477d1e] text-white" : "bg-white text-gray-400"
                   )}>
                      <cat.icon className="w-6 h-6 md:w-8 md:h-8" />
                   </div>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Header */}
      <div className="text-center max-w-4xl mx-auto px-6 mb-16">
        <h1 className="text-4xl md:text-6xl font-black text-[#1a1a1a] tracking-tighter mb-4">
          Galería de Conocimiento
        </h1>
        <p className="text-gray-400 font-medium max-w-xl mx-auto leading-relaxed">
          Explora nuestras guías visuales en un formato limpio y directo. <br className="hidden md:block" />
          Haz clic para abrir el recurso completo.
        </p>
      </div>

      {/* Instagram-style Grid Gallery */}
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {flyersList.length === 0 ? (
           <div className="w-full flex flex-col items-center py-40 bg-gray-50 rounded-[4rem] border-4 border-dashed border-gray-100 text-gray-300">
              <Search className="w-16 h-16 mb-4" />
              <p className="text-xl font-bold">Aún no hay infografías aquí.</p>
           </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-8">
            {flyersList.map((flyer) => (
              <div 
                key={flyer.id} 
                className="relative aspect-square group cursor-pointer overflow-hidden rounded-3xl md:rounded-[3rem] bg-gray-50 border border-gray-100 shadow-sm"
                onClick={() => handleViewFlyer(flyer)}
              >
                <img 
                  src={flyer.img} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                  alt={flyer.title} 
                />
                
                {/* Instagram-style hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex flex-col items-center justify-center p-6 text-center">
                   <div className="opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 flex flex-col items-center">
                      <p className="text-white text-[10px] font-black uppercase tracking-[0.3em] mb-2">{flyer.tag}</p>
                      <h3 className="text-white text-base md:text-xl font-black leading-tight line-clamp-3 px-4">
                        {flyer.title}
                      </h3>
                      <div className="mt-6 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                         <Search className="w-6 h-6" />
                      </div>
                   </div>
                </div>

                {/* Favorite Bookmark */}
                <button
                  onClick={(e) => { e.stopPropagation(); toggleSave(String(flyer.id)); }}
                  className={cn(
                    "absolute top-4 right-4 md:top-8 md:right-8 w-10 h-10 md:w-14 md:h-14 rounded-2xl flex items-center justify-center backdrop-blur-md transition-all shadow-lg z-20",
                    isFavorite(String(flyer.id)) ? "bg-[#477d1e] text-white scale-110" : "bg-white/90 text-gray-400 hover:text-[#477d1e] opacity-0 group-hover:opacity-100"
                  )}
                >
                  <Bookmark className={cn("w-5 h-5 md:w-6 md:h-6", isFavorite(String(flyer.id)) ? "fill-current" : "")} />
                </button>

                {/* Mobile Label (always visible on small screens if you want, but sticking to clean style) */}
                <div className="absolute bottom-4 left-4 right-4 md:hidden">
                   <div className="bg-black/20 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                      <p className="text-white font-black text-[10px] line-clamp-1">{flyer.title}</p>
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
