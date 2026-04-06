import { Play, Heart, Share2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { useState, useEffect } from 'react';
import { Video } from '../types';

const INITIAL_VIDEOS = [
  {
    id: 'v1',
    title: 'Índice Glucémico: Qué es y cómo afecta tu energía',
    category: 'Diabetes',
    desc: 'Descubre por qué no todos los carbohidratos son iguales para tu metabolismo.',
    img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=1200',
    likes: 2400,
    liked: false
  },
  {
    id: 'v2',
    title: 'Sodio Oculto: El enemigo invisible de tu presión',
    category: 'Hipertensión',
    desc: 'Aprende a leer etiquetas y encontrar el sodio en productos que parecen saludables.',
    img: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=1200',
    likes: 1800,
    liked: false
  }
];

export function Videos() {
  const categories = ['Todos', 'Diabetes', 'Hipertensión arterial', 'Obesidad', 'Prevención'];
  
  const [videosList, setVideosList] = useState<Video[]>(() => {
    const saved = localStorage.getItem('nutriconfianza_videos');
    return saved ? JSON.parse(saved) : INITIAL_VIDEOS;
  });

  useEffect(() => {
    localStorage.setItem('nutriconfianza_videos', JSON.stringify(videosList));
  }, [videosList]);

  const toggleLike = (id: string | number) => {
    setVideosList(videosList.map((v: Video) => {
      if (v.id === id) {
        return {
          ...v,
          liked: !v.liked,
          likes: v.liked ? v.likes - 1 : v.likes + 1
        };
      }
      return v;
    }));
  };

  return (
    <div className="py-8 animate-fade-in-up">
      {/* Categories */}
      <div className="flex flex-wrap gap-3 mb-10">
        {categories.map((cat, i) => (
          <button
            key={cat}
            className={cn(
              "px-5 py-2 rounded-full text-sm font-medium transition-colors",
              i === 0 
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
              Aprende con cápsulas educativas diseñadas por expertos. Una experiencia visual sin distracciones para tu salud.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-5 bg-[#f8f9fa] rounded-2xl border-l-4 border-[#246b38]">
              <h3 className="font-bold text-[#246b38] text-sm mb-1">Destacado hoy</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Control glucémico: Mitos y verdades en la alimentación diaria.
              </p>
            </div>
            <div className="p-5 bg-[#f8f9fa] rounded-2xl">
              <h3 className="font-bold text-[#1a1a1a] text-sm mb-1">Próximamente</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Webinar en vivo: Nutrición para la salud cardiovascular el 15 de Octubre.
              </p>
            </div>
          </div>
        </div>

        {/* Video Feed */}
        <div className="flex-1 space-y-6">
          {videosList.map((video: Video) => (
            <div key={video.id} className="relative rounded-3xl overflow-hidden aspect-[16/9] group cursor-pointer shadow-sm">
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors z-10"/>
              <img 
                src={video.img}
                alt={video.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 bg-gradient-to-t from-black/80 to-transparent">
                <span className={cn(
                  "text-white text-xs font-bold px-3 py-1 uppercase tracking-widest rounded mb-4 w-max",
                  video.category === 'Diabetes' ? "bg-[#246b38]" : "bg-[#c25e7c]"
                )}>
                  {video.category}
                </span>
                <h2 className="text-3xl font-bold text-white mb-2 leading-tight">
                  {video.title}
                </h2>
                <p className="text-gray-200 mb-6 max-w-2xl">
                  {video.desc}
                </p>
                <div className="flex items-center gap-6">
                  <button className="w-14 h-14 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform text-[#1a1a1a]">
                    <Play className="w-6 h-6 fill-current" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleLike(video.id); }}
                    className={cn("flex items-center gap-2 transition-colors", video.liked ? "text-rose-500" : "text-white")}
                  >
                    <Heart className={cn("w-5 h-5", video.liked ? "fill-current" : "")} />
                    <span className="font-medium">{(video.likes / 1000).toFixed(1)}k</span>
                  </button>
                  <button className="flex items-center gap-2 text-white">
                    <Share2 className="w-5 h-5" />
                    <span className="font-medium">Compartir</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
