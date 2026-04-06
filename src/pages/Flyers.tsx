import { Download, Bookmark, Eye } from 'lucide-react';
import { cn } from '../lib/utils';
import { useState, useEffect } from 'react';
import { Flyer } from '../types';

const INITIAL_FLYERS = [
  {
    id: 'f1',
    title: "Protocolo FODMAP Simplificado",
    desc: "Una guía paso a paso para identificar sensibilidades alimentarias sin perder el placer de comer.",
    tag: "DESTACADO: SALUD DIGESTIVA",
    img: "https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&q=80&w=600",
    featured: true,
    saved: false
  },
  {
    id: 'f2',
    title: "Top 10 Alimentos Probióticos",
    desc: "Alimentos ricos en microorganismos vivos que benefician tu salud intestinal.",
    tag: "",
    info: "4.8 MB • PDF",
    img: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=600",
    featured: false,
    saved: false
  },
  {
    id: 'f3',
    title: "Guía de Porciones Inteligentes",
    desc: "",
    tag: "",
    img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600",
    featured: false,
    saved: false
  },
  {
    id: 'f4',
    title: "Hidratación y Micronutrientes",
    desc: "",
    tag: "",
    img: "https://images.unsplash.com/photo-1550505096-7bbef112ea70?auto=format&fit=crop&q=80&w=600",
    featured: false,
    saved: false
  },
  {
    id: 'f5',
    title: "Mitos sobre el Gluten",
    desc: "",
    tag: "",
    img: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600",
    featured: false,
    saved: false
  }
];

export function Flyers() {
  const filters = ['Todos los Temas', 'Salud Intestinal', 'Nutrición Anti-Inflamatoria', 'Diabetes & Glucosa', 'Suplementación Consciente'];

  const [flyersList, setFlyersList] = useState<Flyer[]>(() => {
    const saved = localStorage.getItem('nutriconfianza_flyers');
    return saved ? JSON.parse(saved) : INITIAL_FLYERS;
  });

  useEffect(() => {
    localStorage.setItem('nutriconfianza_flyers', JSON.stringify(flyersList));
  }, [flyersList]);

  const toggleSave = (id: string | number) => {
    setFlyersList(flyersList.map((f: Flyer) => {
      if (f.id === id) {
        return {
          ...f,
          saved: !f.saved
        };
      }
      return f;
    }));
  };

  return (
    <div className="py-8 space-y-12 animate-fade-in-up">
      <div className="max-w-2xl">
        <h1 className="text-5xl font-bold text-[#1a1a1a] leading-tight mb-4 tracking-tight">
          Conocimiento Visual<br />para tu <span className="text-[#3b8751] italic font-semibold">Bienestar.</span>
        </h1>
        <p className="text-gray-600 leading-relaxed text-lg">
          Descubre nuestra biblioteca de infografías diseñadas para simplificar la nutrición clínica y la salud digestiva. Información veraz en un formato que puedes llevar contigo.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 border-y border-gray-100 py-4">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mr-2">Filtrar Por:</span>
        {filters.map((filter, i) => (
          <button
            key={filter}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-semibold transition-colors",
              i === 0 
                ? "bg-[#cce3d1] text-[#246b38]" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Featured Card */}
        <div className="lg:col-span-2 bg-[#f8f9fa] rounded-3xl overflow-hidden border border-gray-100 shadow-sm flex flex-col group">
          <div className="h-64 bg-slate-800 relative overflow-hidden">
            <img 
              src={flyersList[0].img} 
              className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
              alt={flyersList[0].title}
            />
          </div>
          <div className="p-8 flex items-end justify-between flex-1">
            <div className="max-w-md">
              <p className="text-[#246b38] text-[10px] font-bold uppercase tracking-widest mb-2">{flyersList[0].tag}</p>
              <h3 className="text-2xl font-bold text-[#1a1a1a] mb-2">{flyersList[0].title}</h3>
              <p className="text-gray-500 text-sm">{flyersList[0].desc}</p>
            </div>
            <div className="flex gap-2">
              <button className="w-10 h-10 bg-[#246b38] hover:bg-[#1a4d2e] transition-colors rounded-full flex items-center justify-center text-white">
                <Download className="w-4 h-4" />
              </button>
              <button 
                onClick={() => toggleSave(flyersList[0].id)}
                className={cn("w-10 h-10 transition-colors rounded-full flex items-center justify-center", flyersList[0].saved ? "bg-[#246b38] text-white" : "bg-gray-200 text-gray-600 hover:bg-gray-300")}
              >
                <Bookmark className={cn("w-4 h-4", flyersList[0].saved ? "fill-current" : "")} />
              </button>
            </div>
          </div>
        </div>

        {/* Regular Flyer Card 1 */}
        <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm flex flex-col group">
           <div className="h-64 bg-[#c2ceca] relative overflow-hidden">
            <img 
              src={flyersList[1].img} 
              className="absolute inset-0 w-full h-full object-cover mix-blend-multiply" 
              alt={flyersList[1].title}
            />
          </div>
          <div className="p-6 flex flex-col flex-1">
             <h3 className="text-lg font-bold text-[#1a1a1a] mb-auto">{flyersList[1].title}</h3>
             <div className="flex items-center justify-between mt-4">
               <span className="text-xs font-bold text-gray-400">{flyersList[1].info}</span>
               <div className="flex gap-2">
                 <button className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-600 transition-colors">
                   <Download className="w-4 h-4" />
                 </button>
                 <button 
                   onClick={() => toggleSave(flyersList[1].id)}
                   className={cn("w-8 h-8 rounded-full flex items-center justify-center transition-colors", flyersList[1].saved ? "bg-[#246b38] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200")}
                 >
                   <Bookmark className={cn("w-4 h-4", flyersList[1].saved ? "fill-current" : "")} />
                 </button>
               </div>
             </div>
          </div>
        </div>

        {/* Regular cards 2,3,4 */}
        {flyersList.slice(2).map((flyer: Flyer) => (
           <div key={flyer.id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm flex flex-col group">
              <div className="h-48 bg-gray-100 relative overflow-hidden">
                 <img src={flyer.img} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={flyer.title} />
                 <button 
                   onClick={() => toggleSave(flyer.id)}
                   className={cn("absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors", flyer.saved ? "bg-[#246b38] text-white" : "bg-white/80 text-gray-600 hover:bg-white")}
                 >
                    <Bookmark className={cn("w-4 h-4", flyer.saved ? "fill-current" : "")} />
                 </button>
              </div>
              <div className="p-6 flex flex-col flex-1">
                 <h3 className="text-md font-bold text-[#1a1a1a] mb-4 text-center">{flyer.title}</h3>
                 <button className="mt-auto w-full bg-[#1a4d2e] hover:bg-[#123820] text-white py-2.5 rounded-xl font-medium text-sm flex justify-center items-center gap-2 transition-colors">
                   <Eye className="w-4 h-4" /> Ver Flyer Completo
                 </button>
              </div>
           </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="bg-[#2a5934] rounded-3xl p-10 mt-8 relative overflow-hidden">
        <div className="relative z-10 max-w-lg">
          <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
            ¿Buscas algo específico para tu condición médica?
          </h2>
          <p className="text-[#a4ccb1] text-sm mb-8 leading-relaxed">
            Contamos con guías personalizadas para pacientes con SII, SIBO y enfermedades autoinmunes. Solicita un recurso a medida.
          </p>
          <button className="bg-[#cce3d1] hover:bg-white text-[#2a5934] transition-colors px-6 py-3 rounded-full font-bold text-sm">
            Contactar con un Especialista
          </button>
        </div>
      </div>
    </div>
  );
}
