import { useState, useEffect } from 'react';
import { 
  Bookmark, 
  ChevronRight,
  Loader2,
  Play,
  X,
  Download,
  Eye
} from 'lucide-react';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';

export function Guardados() {
  const [activeTab, setActiveTab] = useState('Todos');
  const tabs = ['Todos', 'Videos', 'Flyers'];
  const [savedItems, setSavedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingVideo, setPlayingVideo] = useState<any | null>(null);
  const [viewingFlyer, setViewingFlyer] = useState<any | null>(null);

  useEffect(() => {
    fetchSavedItems();
  }, []);

  const fetchSavedItems = async () => {
    try {
      setLoading(true);
      const vIds = JSON.parse(localStorage.getItem('nutriconfianza_saved_videos') || '[]');
      const fIds = JSON.parse(localStorage.getItem('nutriconfianza_saved_flyers') || '[]');
      const allIds = [...vIds, ...fIds];

      if (allIds.length === 0) {
        setSavedItems([]);
        return;
      }

      const { data, error } = await supabase
        .from('creator_content')
        .select('*')
        .in('id', allIds);

      if (error) throw error;
      setSavedItems(data || []);
    } catch (err) {
      console.error('Error fetching saved items:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = savedItems.filter(item => {
    if (activeTab === 'Todos') return true;
    if (activeTab === 'Videos') return item.content_type === 'video';
    if (activeTab === 'Flyers') return item.content_type === 'flyer';
    return true;
  });

  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/watch?v=')) return url.replace('watch?v=', 'embed/');
    if (url.includes('youtu.be/')) return url.replace('youtu.be/', 'youtube.com/embed/');
    return url;
  };

  const isIframeable = (url: string) => {
    return url && (url.includes('youtube.com') || url.includes('youtu.be') || url.includes('tiktok.com'));
  };

  const removeSaved = (id: string, type: string) => {
    const key = type === 'video' ? 'nutriconfianza_saved_videos' : 'nutriconfianza_saved_flyers';
    const current = JSON.parse(localStorage.getItem(key) || '[]');
    const updated = current.filter((i: string) => i !== id);
    localStorage.setItem(key, JSON.stringify(updated));
    setSavedItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="py-12 bg-[#fdfdfd] animate-fade-in-up min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start mb-16 gap-8">
        <div>
          <h1 className="text-5xl font-black text-[#1a1a1a] mb-4 tracking-tighter flex items-center gap-4">
            <div className="p-3 bg-[#e0efd5] rounded-2xl">
               <Bookmark className="w-10 h-10 text-[#2a5934] fill-current" />
            </div>
            Biblioteca Personal
          </h1>
          <p className="text-gray-500 text-lg max-w-lg leading-relaxed font-medium">
            Tu colección curada de contenido experto. Los recursos que necesitas para tu bienestar, siempre a mano.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-gray-100/80 p-1.5 rounded-[2rem] flex items-center gap-1 shadow-inner">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-10 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all",
                activeTab === tab 
                  ? "bg-[#246b38] text-white shadow-lg" 
                  : "text-gray-400 hover:text-gray-600"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
           <Loader2 className="w-12 h-12 text-[#246b38] animate-spin" />
           <p className="text-gray-400 font-bold tracking-widest uppercase text-[10px]">Cargando tu colección...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-40 bg-gray-50 rounded-[4rem] border-2 border-dashed border-gray-200">
           <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
              <Bookmark className="w-10 h-10" />
           </div>
           <h3 className="text-2xl font-bold text-gray-400 mb-2">No tienes nada guardado aún</h3>
           <p className="text-gray-400 max-w-xs mx-auto">Explora las secciones de Videos y Flyers para agregar contenido a tu biblioteca.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-[3rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all group h-full flex flex-col">
              <div className="aspect-[16/10] relative overflow-hidden bg-gray-100">
                 <img 
                   src={item.thumbnail_url || item.media_url} 
                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                   alt={item.title} 
                 />
                 <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                 
                 <div className="absolute top-6 left-6">
                    <span className={cn(
                      "px-4 py-1.5 rounded-full font-black text-[9px] uppercase tracking-widest text-white shadow-xl",
                      item.content_type === 'video' ? "bg-[#246b38]" : "bg-[#c25e7c]"
                    )}>
                      {item.content_type}
                    </span>
                 </div>

                 <button 
                   onClick={() => removeSaved(item.id, item.content_type)}
                   className="absolute top-6 right-6 p-3 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl text-rose-500 hover:scale-110 active:scale-95 transition-all"
                 >
                   <Bookmark className="w-5 h-5 fill-current" />
                 </button>

                 <div 
                   className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                   onClick={() => item.content_type === 'video' ? setPlayingVideo(item) : setViewingFlyer(item)}
                 >
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-2xl">
                       {item.content_type === 'video' ? <Play className="w-6 h-6 text-[#1a1a1a] fill-current" /> : <Eye className="w-6 h-6 text-[#1a1a1a]" />}
                    </div>
                 </div>
              </div>

              <div className="p-8 flex flex-col flex-1">
                 <div className="mb-4">
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-2">{item.category}</span>
                    <h3 className="text-xl font-bold text-[#1a1a1a] leading-tight group-hover:text-[#246b38] transition-colors">{item.title}</h3>
                 </div>
                 
                 <div className="mt-auto pt-6 flex items-center justify-between border-t border-gray-50">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Experto: {item.author_name}</p>
                    <button 
                      onClick={() => item.content_type === 'video' ? setPlayingVideo(item) : setViewingFlyer(item)}
                      className="text-[#246b38] flex items-center gap-2 font-black text-[10px] uppercase tracking-widest hover:gap-3 transition-all"
                    >
                      Ver Ahora <ChevronRight className="w-4 h-4" />
                    </button>
                 </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Video Player Modal */}
      {playingVideo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 animate-fade-in">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-sm" onClick={() => setPlayingVideo(null)} />
          <button onClick={() => setPlayingVideo(null)} className="absolute top-6 right-6 text-white p-3 z-[110] hover:rotate-90 transition-transform">
            <X className="w-10 h-10" />
          </button>
          <div className="relative w-full max-w-6xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl z-[101]">
            {isIframeable(playingVideo.media_url) ? (
              <iframe src={getEmbedUrl(playingVideo.media_url)} className="w-full h-full border-none" allowFullScreen />
            ) : (
              <video src={playingVideo.media_url} controls autoPlay className="w-full h-full object-contain" />
            )}
          </div>
        </div>
      )}

      {/* Flyer Viewer Modal */}
      {viewingFlyer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 animate-fade-in">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => setViewingFlyer(null)} />
          <button onClick={() => setViewingFlyer(null)} className="absolute top-6 right-6 text-white p-3 z-[110] hover:rotate-90 transition-transform">
            <X className="w-10 h-10" />
          </button>
          <div className="relative w-full max-w-4xl h-full flex flex-col items-center justify-center z-[101]">
            <img src={viewingFlyer.media_url} className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl" alt="" />
            <div className="mt-8 text-center text-white">
               <h2 className="text-2xl font-bold mb-4">{viewingFlyer.title}</h2>
               <div className="flex gap-4 justify-center">
                 <button className="bg-white text-[#1a1a1a] px-8 py-3 rounded-full font-bold text-sm flex items-center gap-2">
                   <Download className="w-4 h-4" /> Descargar
                 </button>
                 <button 
                   onClick={() => removeSaved(viewingFlyer.id, 'flyer')}
                   className="bg-white/10 text-white px-8 py-3 rounded-full font-bold text-sm border border-white/20 hover:bg-rose-500 hover:border-rose-500 transition-all"
                 >
                   Eliminar de Biblioteca
                 </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
