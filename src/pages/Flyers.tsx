import { Download, Bookmark, Eye, Loader2, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { useState, useEffect } from 'react';
import { Flyer } from '../types';
import { supabase } from '../lib/supabase';

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
  const filters = ['Todos los Temas', 'Diabetes', 'Hipertensión', 'Obesidad', 'General'];
  const [selectedFilter, setSelectedFilter] = useState('Todos los Temas');
  const [flyersList, setFlyersList] = useState<Flyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingFlyer, setViewingFlyer] = useState<Flyer | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('nutriconfianza_saved_flyers');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    fetchFlyers();
  }, [selectedFilter]);

  useEffect(() => {
    localStorage.setItem('nutriconfianza_saved_flyers', JSON.stringify(savedIds));
  }, [savedIds]);

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

  const toggleSave = (id: string) => {
    setSavedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div className="py-8 space-y-12 animate-fade-in-up">
      <div className="max-w-3xl">
        <h1 className="text-4xl md:text-7xl font-black text-[#1a1a1a] leading-[1.1] mb-6 tracking-tighter">
          Conocimiento Visual<br />para tu <span className="text-[#3b8751] italic font-medium">Bienestar.</span>
        </h1>
        <p className="text-gray-500 font-medium leading-relaxed text-base md:text-xl">
          Descubre nuestra biblioteca de infografías diseñadas por expertos. Información veraz para llevar contigo siempre.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 border-y border-gray-100 py-6">
        <span className="text-xs font-black text-gray-400 uppercase tracking-widest mr-4">Filtrar:</span>
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setSelectedFilter(filter)}
            className={cn(
              "px-6 py-2 rounded-2xl text-xs font-bold transition-all",
              selectedFilter === filter 
                ? "bg-[#246b38] text-white shadow-lg shadow-[#246b38]/20" 
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            )}
          >
            {filter}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 text-[#246b38] animate-spin" /></div>
      ) : flyersList.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
           <p className="text-gray-400 font-medium">Buscando más recursos...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Featured Flyer */}
          {flyersList.length > 0 && (
            <div className="lg:col-span-2 bg-[#f8f9fa] rounded-[3rem] overflow-hidden border border-gray-100 shadow-sm flex flex-col group relative">
              <div className="h-80 bg-slate-800 relative overflow-hidden cursor-pointer" onClick={() => setViewingFlyer(flyersList[0])}>
                <img 
                  src={flyersList[0].img} 
                  className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
                  alt={flyersList[0].title}
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <div className="bg-white/90 p-4 rounded-full shadow-2xl">
                     <Eye className="w-8 h-8 text-[#1a1a1a]" />
                   </div>
                </div>
              </div>
              <div className="p-6 md:p-10 flex items-center justify-between flex-1">
                <div className="max-w-md">
                  <p className="text-[#246b38] text-[10px] font-black uppercase tracking-widest mb-3 bg-[#e0efd5] px-3 py-1 rounded-lg w-max">
                    {flyersList[0].tag}
                  </p>
                  <h3 className="text-3xl font-bold text-[#1a1a1a] mb-3">{flyersList[0].title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{flyersList[0].desc}</p>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => toggleSave(String(flyersList[0].id))}
                    className={cn(
                      "w-14 h-14 transition-all rounded-3xl flex items-center justify-center shadow-sm", 
                      savedIds.includes(String(flyersList[0].id)) ? "bg-[#246b38] text-white" : "bg-white text-gray-400 hover:bg-gray-50 border border-gray-100"
                    )}
                  >
                    <Bookmark className={cn("w-6 h-6", savedIds.includes(String(flyersList[0].id)) ? "fill-current" : "")} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Regular Flyers Grid */}
          {flyersList.slice(1).map((flyer) => (
             <div key={flyer.id} className="bg-white rounded-[3rem] overflow-hidden border border-gray-100 shadow-sm flex flex-col group">
                <div className="h-64 bg-gray-100 relative overflow-hidden cursor-pointer" onClick={() => setViewingFlyer(flyer)}>
                   <img src={flyer.img} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={flyer.title} />
                   <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <Eye className="w-8 h-8 text-white" />
                   </div>
                   <button 
                     onClick={(e) => { e.stopPropagation(); toggleSave(String(flyer.id)); }}
                     className={cn(
                       "absolute top-5 right-5 w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-md transition-all shadow-lg", 
                       savedIds.includes(String(flyer.id)) ? "bg-[#246b38] text-white" : "bg-white/80 text-gray-600 hover:bg-white"
                     )}
                   >
                      <Bookmark className={cn("w-5 h-5", savedIds.includes(String(flyer.id)) ? "fill-current" : "")} />
                   </button>
                </div>
                <div className="p-6 md:p-8 flex flex-col flex-1">
                   <div className="mb-4">
                     <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest">{flyer.tag}</span>
                     <h3 className="text-xl font-bold text-[#1a1a1a] mt-1">{flyer.title}</h3>
                   </div>
                   <button 
                     onClick={() => setViewingFlyer(flyer)}
                     className="mt-auto w-full bg-[#1a4d2e] hover:bg-[#123820] text-white py-4 rounded-[1.5rem] font-bold text-sm flex justify-center items-center gap-2 transition-all hover:scale-[1.02]"
                   >
                     Ver Recurso
                   </button>
                </div>
             </div>
          ))}
        </div>
      )}

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
                        savedIds.includes(String(viewingFlyer.id)) 
                          ? "bg-[#246b38] border-transparent text-white" 
                          : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                      )}
                    >
                      <Bookmark className={cn("w-6 h-6", savedIds.includes(String(viewingFlyer.id)) ? "fill-current" : "")} />
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
    </div>
  );
}
