import { Download, Bookmark, Eye, Loader2, X, ChevronDown, ArrowUp } from 'lucide-react';
import { cn } from '../lib/utils';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flyer } from '../types';
import { supabase } from '../lib/supabase/client';
import { useAuth } from '../hooks/useAuth';
import { useFavorites } from '../hooks/useFavorites';
import { useWatched } from '../hooks/useWatched';

const INITIAL_FLYERS: Flyer[] = [
  {
    id: 'f1',
    title: "Protocolo FODMAP Simplificado",
    desc: "Una guía paso a paso para identificar sensibilidades alimentarias sin perder el placer de comer.",
    tag: "SALUD DIGESTIVA",
    img: "https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&q=80&w=600",
    featured: true,
    saved: false
  }
];

export function Flyers() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { favorites, addFavorite, removeFavorite } = useFavorites(user?.id || null);
  const { markAsWatched } = useWatched(user?.id || null);
  const filters = ['Todos los Temas', 'Diabetes', 'Hipertensión', 'Obesidad', 'General'];
  const [selectedFilter, setSelectedFilter] = useState('Todos los Temas');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [flyersList, setFlyersList] = useState<Flyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingFlyer, setViewingFlyer] = useState<Flyer | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetchFlyers();
  }, [selectedFilter]);

  const fetchFlyers = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('creator_content')
        .select('*')
        .eq('content_type', 'flyer')
        .order('created_at', { ascending: false });

      if (selectedFilter !== 'Todos los Temas') {
        query = query.eq('category', selectedFilter);
      }

      const { data, error } = await query;

      if (error) throw error;

      if (data && data.length > 0) {
        const mapped: Flyer[] = data.map(f => ({
          id: f.id,
          title: f.title || "",
          desc: f.description || "",
          tag: f.category?.toUpperCase() || "RECURSO",
          img: f.media_url || "https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&q=80&w=400",
          featured: false,
          saved: false,
          info: "PDF"
        }));
        setFlyersList(mapped);
      } else {
        setFlyersList(INITIAL_FLYERS.filter(f => selectedFilter === 'Todos los Temas' || f.tag?.includes(selectedFilter.toUpperCase())));
      }
    } catch (err) {
      console.error('Error fetching flyers:', err);
      setFlyersList(INITIAL_FLYERS);
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

  return (
    <div className="py-8 animate-fade-in-up">
      <div className="flex flex-col lg:flex-row gap-12 relative">
        {/* Sidebar - Desktop Filters */}
        <div className="w-full lg:w-[320px] flex-shrink-0 space-y-12 lg:sticky lg:top-24 h-fit">
          <div>
            <h1 className="text-4xl md:text-6xl font-black text-[#1a1a1a] leading-tight mb-6 tracking-tighter">
               Conocimiento <br /><span className="text-[#3b8751] italic font-medium">Visual.</span>
            </h1>
            <p className="text-gray-500 font-medium leading-relaxed mb-10">
               Descubre nuestra biblioteca de infografías diseñadas por expertos. Información veraz para llevar contigo siempre.
            </p>

            {/* Desktop Vertical Menu */}
            <div className="hidden lg:flex flex-col gap-3">
               <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Temas de Interés</h3>
               {filters.map((filter) => {
                 const isActive = selectedFilter === filter;
                 return (
                   <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter)}
                    className={cn(
                      "group flex flex-col p-5 rounded-[2rem] transition-all border-2 text-left relative overflow-hidden",
                      isActive 
                        ? "bg-[#246b38] border-[#246b38] text-white shadow-xl shadow-[#246b38]/20" 
                        : "bg-white border-gray-50 text-gray-400 hover:border-[#246b38]/20 hover:text-[#246b38]"
                    )}
                   >
                     <div className="flex items-center justify-between z-10">
                       <span className="font-black text-sm uppercase tracking-widest">{filter}</span>
                       <div className={cn("w-1.5 h-1.5 rounded-full transition-all", isActive ? "bg-white scale-150" : "bg-gray-200 group-hover:bg-[#246b38]")} />
                     </div>
                     {isActive && <div className="absolute top-0 left-0 w-1.5 h-full bg-white opacity-50" />}
                   </button>
                 );
               })}
            </div>
          </div>

          <div className="bg-[#f8f9fa] p-8 rounded-[3rem] border border-gray-100">
             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-4">Recurso Premium</span>
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                   <Download className="w-5 h-5 text-[#246b38]" />
                </div>
                <p className="text-xs font-bold text-gray-600">Todos los PDF están verificados por clínicos.</p>
             </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-10">
          {/* Mobile Category Dropdown Filter */}
          <div className="lg:hidden relative mb-10 z-50">
            <div className="relative group w-full">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 bg-white border-2 border-gray-100 px-8 py-5 rounded-[2rem] font-black text-sm text-[#1a1a1a] shadow-sm hover:border-[#246b38]/30 transition-all active:scale-95 w-full justify-between"
              >
                <div className="flex items-center gap-2">
                   <div className="w-2.5 h-2.5 rounded-full bg-[#3b8751]" />
                   Filtrar: {selectedFilter}
                </div>
                <ChevronDown className={cn("w-5 h-5 text-[#3b8751] transition-transform", isDropdownOpen && "rotate-180")} />
              </button>
              
              {isDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
                  <div className="absolute top-full left-0 right-0 mt-3 bg-white/95 backdrop-blur-3xl border-2 border-gray-100 rounded-[2.5rem] overflow-hidden shadow-2xl z-20 p-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    {filters.map((filter) => (
                      <button
                        key={filter}
                        onClick={() => {
                          setSelectedFilter(filter);
                          setIsDropdownOpen(false);
                        }}
                        className={cn(
                          "w-full text-left px-8 py-5 rounded-2xl text-sm font-black transition-all flex items-center justify-between group/item",
                          selectedFilter === filter 
                            ? "bg-[#246b38] text-white shadow-lg shadow-[#246b38]/20" 
                            : "text-gray-500 hover:bg-[#e0efd5] hover:text-[#246b38]"
                        )}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="space-y-12">
            {loading ? (
              <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 text-[#246b38] animate-spin" /></div>
            ) : flyersList.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                 <p className="text-gray-400 font-medium">Buscando más recursos...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Regular Flyers Grid */}
                {flyersList.map((flyer) => (
                   <div key={flyer.id} className="bg-white rounded-[3rem] overflow-hidden border border-gray-100 shadow-sm flex flex-col group">
                      <div className="h-64 bg-gray-100 relative overflow-hidden cursor-pointer" onClick={() => handleViewFlyer(flyer)}>
                         <img src={flyer.img} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={flyer.title} />
                         <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           <Eye className="w-8 h-8 text-white" />
                         </div>
                         <button
                           onClick={(e) => { e.stopPropagation(); toggleSave(String(flyer.id)); }}
                           className={cn(
                             "absolute top-5 right-5 w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-md transition-all shadow-lg",
                             isFavorite(String(flyer.id)) ? "bg-[#246b38] text-white" : "bg-white/80 text-gray-600 hover:bg-white"
                           )}
                         >
                            <Bookmark className={cn("w-5 h-5", isFavorite(String(flyer.id)) ? "fill-current" : "")} />
                         </button>
                      </div>
                      <div className="p-6 md:p-8 flex flex-col flex-1">
                         <div className="mb-4">
                           <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest">{flyer.tag}</span>
                           <h3 className="text-xl font-bold text-[#1a1a1a] mt-1">{flyer.title}</h3>
                         </div>
                         <button
                           onClick={() => handleViewFlyer(flyer)}
                           className="mt-auto w-full bg-[#1a4d2e] hover:bg-[#123820] text-white py-4 rounded-[1.5rem] font-bold text-sm flex justify-center items-center gap-2 transition-all hover:scale-[1.02]"
                         >
                           Ver Recurso
                         </button>
                      </div>
                   </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Flyer Viewer Modal - Premium Version */}
      {viewingFlyer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 animate-fade-in group">
          <div className="absolute inset-0 bg-black/98 backdrop-blur-xl" onClick={() => setViewingFlyer(null)} />
          
          <button 
            onClick={() => setViewingFlyer(null)}
            className="absolute top-8 right-8 text-white/50 hover:text-white hover:rotate-90 transition-all p-3 z-[110]"
          >
            <X className="w-12 h-12 stroke-[1.5]" />
          </button>
          
          <div className="relative w-full max-w-7xl h-full flex flex-col lg:flex-row items-center gap-12 z-[101]">
            {/* Image Section */}
            <div className="flex-1 h-full flex items-center justify-center">
              <img 
                src={viewingFlyer.img} 
                className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10" 
                alt={viewingFlyer.title} 
              />
            </div>

            {/* Info Section */}
            <div className="w-full lg:w-[400px] flex flex-col text-left">
               <span className="text-[10px] font-black tracking-[0.3em] text-[#3b8751] bg-[#3b8751]/10 px-4 py-2 rounded-xl w-max mb-6">
                 {viewingFlyer.tag}
               </span>
               <h2 className="text-4xl font-bold text-white mb-6 leading-tight tracking-tight">
                 {viewingFlyer.title}
               </h2>
               <p className="text-white/60 text-lg leading-relaxed mb-10 font-medium">
                 {viewingFlyer.desc}
               </p>

               <div className="space-y-6">
                  <div className="flex items-center gap-4 p-6 bg-white/5 rounded-[2rem] border border-white/10">
                    <div className="w-12 h-12 rounded-full bg-[#3b8751] flex items-center justify-center text-white font-bold">
                       {viewingFlyer.info === 'PDF' ? 'P' : 'R'}
                    </div>
                    <div>
                       <p className="text-white/40 text-[9px] font-black uppercase tracking-widest">Recurso Verificado</p>
                       <p className="text-white font-bold text-sm">Contenido para Salud Clínica</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button className="flex-1 bg-white text-[#1a1a1a] px-8 py-5 rounded-[2rem] font-bold text-sm flex items-center justify-center gap-3 hover:scale-[1.02] shadow-xl transition-all">
                      <Download className="w-5 h-5" /> Descargar PDF
                    </button>
                    <button
                      onClick={() => toggleSave(String(viewingFlyer.id))}
                      className={cn(
                        "p-5 rounded-[2rem] font-bold text-sm flex items-center transition-all border",
                        isFavorite(String(viewingFlyer.id))
                          ? "bg-[#246b38] border-transparent text-white"
                          : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                      )}
                    >
                      <Bookmark className={cn("w-6 h-6", isFavorite(String(viewingFlyer.id)) ? "fill-current" : "")} />
                    </button>
                  </div>
               </div>

               <p className="mt-12 text-white/30 text-[9px] font-black uppercase tracking-widest">
                 Nutriconfianza Knowledge Hub &copy; 2024
               </p>
            </div>
          </div>
        </div>
      )}
      {/* Back to Top */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-10 right-10 w-14 h-14 bg-[#246b38]/90 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-90 transition-all z-[60] border-4 border-white/20 backdrop-blur-xl animate-in fade-in zoom-in slide-in-from-bottom-5 duration-500"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-6 h-6 stroke-[3]" />
        </button>
      )}
    </div>
  );
}
