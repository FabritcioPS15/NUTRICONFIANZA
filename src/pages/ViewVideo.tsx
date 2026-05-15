import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Video as VideoIcon,
  User,
  Calendar,
  Info,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { supabase } from '../lib/supabase/client';
import { cn, getEmbedUrl, isEmbeddable, resolveMediaUrl } from '../lib/utils';

export function ViewVideo() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [video, setVideo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchVideo();
  }, [id]);

  const fetchVideo = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('creator_content')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setVideo(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#f8f9f5]">
        <Loader2 className="w-10 h-10 text-[#477d1e] animate-spin" />
      </div>
    );
  }

  if (!video) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#f8f9f5]">
        <div className="text-center space-y-4">
          <p className="text-gray-500 font-bold text-xl">Video no encontrado</p>
          <button
            onClick={() => navigate('/videos')}
            className="px-6 py-3 bg-[#477d1e] text-white rounded-2xl font-bold"
          >
            Volver a Videos
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="h-screen bg-[#f8faf7] flex flex-col overflow-hidden">
      {/* Header sutil e integrado */}
      <header className="px-8 py-6 flex items-center justify-between flex-shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-[#477d1e] transition-all font-bold group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Volver al Panel
        </button>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#477d1e] animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Nutriconfianza TV</span>
        </div>
      </header>

      {/* Main Content Area - Distribuido para NO hacer scroll */}
      <main className="flex-1 px-8 pb-8 flex flex-col gap-6 overflow-hidden max-w-6xl mx-auto w-full">

        {/* Video Player Section - Toma el espacio necesario pero no más */}
        <section className="flex-1 min-h-0 bg-white rounded-[2.5rem] shadow-2xl shadow-green-900/5 p-4 sm:p-6 flex flex-col border border-white">
          <div className="flex-1 rounded-[2rem] overflow-hidden bg-black relative group shadow-inner">
            {isEmbeddable(video.media_url) ? (
              <iframe 
                src={getEmbedUrl(video.media_url)}
                className="w-full h-full border-0"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                loading="lazy"
              />
            ) : video.media_url.includes('tiktok.com') || video.media_url.includes('youtu') ? (
              <div className="w-full h-full flex flex-col items-center justify-center p-10 text-center space-y-6 bg-gradient-to-br from-gray-900 to-black">
                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center animate-pulse">
                   <VideoIcon className="w-10 h-10 text-[#477d1e]" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-white text-xl font-black">Este video requiere vista externa</h3>
                  <p className="text-gray-400 text-sm max-w-xs mx-auto">
                    Los links de compartir (short links) de TikTok deben abrirse en su plataforma original.
                  </p>
                </div>
                <button 
                  onClick={() => window.open(video.media_url, '_blank')}
                  className="px-8 py-4 bg-[#477d1e] text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-[#477d1e]/20"
                >
                  Ver en {video.media_url.includes('tiktok') ? 'TikTok' : 'YouTube'}
                </button>
              </div>
            ) : (
              <video src={resolveMediaUrl(video.media_url)} controls className="w-full h-full" />
            )}
          </div>

          {/* Metadata Compacta debajo del video */}
          <div className="pt-4 px-2 flex items-end justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-3xl font-black text-[#1a1a1a] tracking-tight truncate">{video.title}</h1>
              <div className="flex items-center gap-4 mt-1 text-gray-400 font-bold text-[10px] uppercase tracking-widest">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#477d1e]" />
                  <span>{video.author_name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#477d1e]" />
                  <span>{new Date(video.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}</span>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0">
              <span className="font-black text-[#477d1e] bg-[#477d1e]/5 px-4 py-2 rounded-xl text-xs uppercase tracking-widest border border-[#477d1e]/10">
                {video.category}
              </span>
            </div>
          </div>
        </section>

        {/* Action Grid Compacta al fondo */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-shrink-0">
          {/* Info Card */}
          <div className="bg-white/50 backdrop-blur-md rounded-[2rem] p-5 flex items-center justify-between border border-white">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#477d1e]/10 rounded-xl flex items-center justify-center">
                <Info className="w-5 h-5 text-[#477d1e]" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Estado del Contenido</p>
                <p className="text-sm font-bold text-[#1a1a1a]">Disponible en tu Plan</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 rounded-lg text-[10px] font-black text-[#477d1e] uppercase">
              <div className="w-1.5 h-1.5 rounded-full bg-[#477d1e]" />
              Activo
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={() => window.open(resolveMediaUrl(video.media_url), '_blank')}
            className="group relative overflow-hidden py-5 rounded-[2rem] bg-[#477d1e] text-white font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-[#477d1e]/20"
          >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <ExternalLink className="w-5 h-5 relative z-10" />
            <span className="relative z-10">Abrir en Pantalla Completa</span>
          </button>
        </section>

      </main>
    </div>
  );
}
