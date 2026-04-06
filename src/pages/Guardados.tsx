import { useState, useEffect } from 'react';
import { 
  Bookmark, 
  Heart, 
  ChevronRight
} from 'lucide-react';
import { cn } from '../lib/utils';

export function Guardados() {
  const [activeTab, setActiveTab] = useState('Todos');
  const tabs = ['Todos', 'Videos', 'Flyers', 'Me Gusta'];

  useEffect(() => {
    // Simulated load from localStorage
    localStorage.getItem('nutriconfianza_videos');
    localStorage.getItem('nutriconfianza_flyers');
    localStorage.getItem('nutriconfianza_posts');
  }, []);

  return (
    <div className="py-12 bg-[#fdfdfd] animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-8">
        <div>
          <h1 className="text-5xl font-black text-[#1a1a1a] mb-4 tracking-tighter flex items-center gap-4">
            <Bookmark className="w-10 h-10 text-[#2a5934] fill-current" /> Mis Guardados
          </h1>
          <p className="text-gray-500 text-lg max-w-lg leading-relaxed font-medium">
            Tu biblioteca personal de nutrición y bienestar. Todo lo que te inspira, organizado en un solo lugar.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-gray-100/80 p-1.5 rounded-[2rem] flex items-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-8 py-3 rounded-full text-sm font-bold transition-all",
                activeTab === tab 
                  ? "bg-white text-[#1a1a1a] shadow-sm" 
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Featured Card - Large Video */}
        <div className="lg:col-span-3">
          <div className="relative group bg-white rounded-[3rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500">
            <div className="aspect-[21/10] relative overflow-hidden bg-black/10">
              <img 
                src="https://images.unsplash.com/photo-1547517023-7ca0c162f816?auto=format&fit=crop&q=80&w=1200" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                alt="Nutrición background" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />
              <button className="absolute top-8 left-8 bg-[#2a5934] text-white px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest">
                Video
              </button>
              <div className="absolute top-8 right-8 text-white font-black text-6xl opacity-40 select-none">
                nutrición
              </div>

              <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end">
                <div className="max-w-xl">
                   <h2 className="text-3xl font-bold text-white mb-3">5 Recetas de Almuerzos Verdes en 15 Minutos</h2>
                   <p className="text-white/70 font-medium">Aprende a preparar platos balanceados y nutritivos sin pasar horas en la cocina.</p>
                </div>
                <Bookmark className="w-8 h-8 text-white fill-current" />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Vertical Card - Flyer */}
        <div className="relative h-full">
          <div className="bg-[#c2e4cc] rounded-[2.5rem] p-10 h-full flex flex-col justify-between group cursor-pointer hover:shadow-lg transition-all border border-white/40">
            <div>
              <div className="flex justify-between items-start mb-6">
                <span className="bg-[#1a4d2e] text-white px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest">
                  Flyer
                </span>
              </div>
              <h3 className="text-2xl font-bold text-[#1a4d2e] mb-4 leading-tight">Guía: Súper Alimentos de Temporada</h3>
              <p className="text-[#2a5934]/70 text-sm font-medium mb-8">Descubre qué frutas y verduras tienen su pico nutricional este mes y cómo integrarlas.</p>
              
              <button className="flex items-center gap-2 bg-[#1a4d2e] text-white px-6 py-3 rounded-full font-bold text-xs hover:gap-4 transition-all">
                Ver Guía Completa <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-8 rounded-3xl overflow-hidden shadow-2xl transform group-hover:rotate-3 transition-transform duration-500">
               <img 
                 src="https://images.unsplash.com/photo-1540189567004-729f1c249a2e?auto=format&fit=crop&q=80&w=400" 
                 alt="Alimentos mockup" 
                 className="w-full h-full object-cover"
               />
            </div>
          </div>
        </div>

        {/* Lower Grid of Cards */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all group">
            <div className="aspect-square relative overflow-hidden bg-[#e6f0ed]">
               <img src="https://images.unsplash.com/photo-1512438248247-f0f2a5a8b7f0?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Mindfulness" />
               <div className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-sm">
                 <Heart className="w-5 h-5 text-rose-500 fill-current" />
               </div>
            </div>
            <div className="p-8">
              <span className="text-[10px] font-black uppercase text-[#2a5934] tracking-widest block mb-3">Mindfulness</span>
              <h4 className="font-bold text-lg text-[#1a1a1a]">Meditación para Digestión Consciente</h4>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
           <div className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all group">
            <div className="aspect-square relative overflow-hidden bg-[#f0ede6]">
               <img src="https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Etiquetas" />
               <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-md text-white px-3 py-1 rounded-lg text-[10px] font-bold">
                 08:45
               </div>
               <div className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-sm">
                 <Bookmark className="w-5 h-5 text-[#246b38] fill-current" />
               </div>
            </div>
            <div className="p-8">
              <span className="text-[10px] font-black uppercase text-[#2a5934] tracking-widest block mb-3">Video</span>
              <h4 className="font-bold text-lg text-[#1a1a1a]">Cómo Leer Etiquetas de Nutrición</h4>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
           <div className="bg-[#241a1a] rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all group relative">
             <div className="flex h-[320px]">
               <div className="flex-1 p-10 flex flex-col justify-end relative z-10">
                 <span className="text-[10px] font-black uppercase text-white/50 tracking-widest block mb-4">Flyer</span>
                 <h4 className="font-bold text-3xl text-white leading-tight">Porciones Ideales para el Plato Perfecto</h4>
               </div>
               <div className="w-1/2 relative">
                 <img src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" alt="Plato saludable" />
                 <div className="absolute inset-x-0 bottom-0 top-0 bg-gradient-to-l from-transparent to-[#241a1a]" />
               </div>
             </div>
             <div className="absolute top-8 right-8 bg-white/10 backdrop-blur-md p-3 rounded-2xl shadow-xl">
                <Bookmark className="w-6 h-6 text-white fill-current" />
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
