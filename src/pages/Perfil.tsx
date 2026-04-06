import { Edit3, LogOut, User, Eye, Heart, Play, FileText, LineChart, Bookmark } from 'lucide-react';
import { cn } from '../lib/utils';
import { useState, useEffect } from 'react';

export function Perfil() {
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(true);
  const [voiceRead, setVoiceRead] = useState(false);

  // Load saved content from localStorage
  const [savedVideos, setSavedVideos] = useState<any[]>([]);
  const [savedFlyers, setSavedFlyers] = useState<any[]>([]);
  const [savedPosts, setSavedPosts] = useState<any[]>([]);

  useEffect(() => {
    const videos = localStorage.getItem('nutriconfianza_videos');
    if (videos) {
      setSavedVideos(JSON.parse(videos).filter((v: any) => v.liked)); // Using liked as "saved" for videos in this demo context or could add a 'saved' prop
    }
    
    const flyers = localStorage.getItem('nutriconfianza_flyers');
    if (flyers) {
      setSavedFlyers(JSON.parse(flyers).filter((f: any) => f.saved));
    }

    const posts = localStorage.getItem('nutriconfianza_posts');
    if (posts) {
      setSavedPosts(JSON.parse(posts).filter((p: any) => p.saved));
    }
  }, []);

  return (
    <div className="py-8 space-y-12 max-w-5xl animate-fade-in-up">
      {/* Header Profile */}
      <div className="flex flex-col md:flex-row items-center md:justify-between gap-6">
        <div className="flex items-center gap-6">
          <img 
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200" 
            alt="Elena Rodríguez"
            className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
          />
          <div>
            <h1 className="text-4xl font-bold text-[#1a1a1a] mb-1 tracking-tight">Elena Rodríguez</h1>
            <p className="text-gray-500 font-medium">Miembro desde Enero 2024</p>
          </div>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button className="flex-1 md:flex-none justify-center bg-[#cce3d1] hover:bg-[#b5d5bd] tracking-wide text-[#246b38] px-6 py-3 rounded-full font-bold text-sm flex items-center gap-2 transition-colors">
            <Edit3 className="w-4 h-4" /> Editar Perfil
          </button>
          <button className="flex-1 md:flex-none justify-center bg-[#f0d4d4] hover:bg-[#e6c1c1] tracking-wide text-red-800 px-6 py-3 rounded-full font-bold text-sm flex items-center gap-2 transition-colors">
            <LogOut className="w-4 h-4" /> Cerrar Sesión
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Sidebar */}
        <div className="w-full lg:w-80 space-y-6 flex-shrink-0">
          <div className="bg-white border border-gray-100 shadow-sm rounded-3xl p-8">
            <h3 className="flex items-center gap-3 font-bold text-lg mb-8 text-[#1a1a1a]">
              <User className="w-5 h-5 text-[#246b38] fill-current" /> Datos Personales
            </h3>
            
            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Email</p>
                <p className="font-medium text-sm text-[#1a1a1a]">elena.rod@bienestar.com</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Objetivo</p>
                <p className="font-medium text-sm text-[#1a1a1a]">Nutrición Antiinflamatoria</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Plan Actual</p>
                <span className="bg-green-300 text-green-900 text-[10px] font-black uppercase px-3 py-1 rounded-full">Premium</span>
              </div>
            </div>
          </div>

          <div className="bg-[#f5f5f5] rounded-3xl p-8">
            <h3 className="flex items-center gap-3 font-bold text-lg mb-8 text-[#1a1a1a]">
              <Eye className="w-5 h-5 text-[#246b38] fill-current" /> Accesibilidad
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Texto Grande</span>
                <button onClick={() => setLargeText(!largeText)} className={cn("w-12 h-6 rounded-full transition-colors relative", largeText ? "bg-[#246b38]" : "bg-gray-300")}>
                  <div className={cn("w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow", largeText ? "left-6" : "left-0.5")} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Alto Contraste</span>
                <button onClick={() => setHighContrast(!highContrast)} className={cn("w-12 h-6 rounded-full transition-colors relative", highContrast ? "bg-[#246b38]" : "bg-gray-300")}>
                  <div className={cn("w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow", highContrast ? "left-6" : "left-0.5")} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Lectura por Voz</span>
                <button onClick={() => setVoiceRead(!voiceRead)} className={cn("w-12 h-6 rounded-full transition-colors relative", voiceRead ? "bg-[#246b38]" : "bg-gray-300")}>
                  <div className={cn("w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow", voiceRead ? "left-6" : "left-0.5")} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main content right */}
        <div className="flex-1 space-y-12">
          {/* Videos Guardados */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#1a1a1a]">Videos Favoritos</h2>
              <button className="text-xs font-bold text-[#246b38] hover:underline uppercase tracking-wider">Ver todos</button>
            </div>
            {savedVideos.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {savedVideos.map(video => (
                  <div key={video.id} className="bg-[#f8f9fa] rounded-3xl overflow-hidden border border-gray-100 shadow-sm group cursor-pointer">
                    <div className="aspect-[16/9] relative overflow-hidden bg-black/10">
                      <img src={video.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={video.title} />
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-lg mb-3">{video.title}</h3>
                      <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                        <span className="flex items-center gap-1"><Play className="w-3 h-3" /> 12 min</span>
                        <span className="flex items-center gap-1 text-rose-500"><Heart className="w-3 h-3 fill-current" /> {video.likes}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm italic">No has marcado ningún video como favorito aún.</p>
            )}
          </section>

          {/* Flyers & Guías */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#1a1a1a]">Flyers & Guías Guardadas</h2>
              <button className="text-xs font-bold text-[#246b38] hover:underline uppercase tracking-wider">Ver todo</button>
            </div>
            {savedFlyers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {savedFlyers.map(flyer => (
                  <div key={flyer.id} className="bg-white border border-gray-100 shadow-sm rounded-3xl p-6 flex flex-col items-center justify-center text-center aspect-[4/5] hover:shadow-md transition-shadow group cursor-pointer relative">
                    <div className="w-16 h-16 bg-[#e0efd5] rounded-2xl flex items-center justify-center mb-6 text-[#246b38] group-hover:scale-110 transition-transform">
                      <FileText className="w-8 h-8 font-black" />
                    </div>
                    <h4 className="font-bold text-sm text-[#1a1a1a]">{flyer.title}</h4>
                    <Bookmark className="absolute top-4 right-4 w-4 h-4 text-[#246b38] fill-current" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm italic">No tienes flyers guardados todavía.</p>
            )}
          </section>

          {/* Publicaciones Guardadas */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#1a1a1a]">Publicaciones Guardadas</h2>
            </div>
            {savedPosts.length > 0 ? (
               <div className="space-y-4">
                 {savedPosts.map(post => (
                   <div key={post.id} className="bg-white border border-gray-100 rounded-2xl p-6 flex gap-4 items-center shadow-sm">
                      <div className={`w-10 h-10 rounded-full ${post.avatar} flex items-center justify-center flex-shrink-0`}>
                        <Bookmark className="w-5 h-5 text-green-700 fill-current" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-sm text-[#1a1a1a]">{post.user}</h4>
                        <p className="text-xs text-gray-500 line-clamp-1">{post.desc}</p>
                      </div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase">{post.tag}</span>
                   </div>
                 ))}
               </div>
            ) : (
              <p className="text-gray-400 text-sm italic">No has guardado ninguna publicación de la comunidad.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
