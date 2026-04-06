import { useState } from 'react';
import { 
  Upload, 
  Video as VideoIcon, 
  FileText, 
  Clock, 
  ChevronDown,
  FileCheck,
  Send
} from 'lucide-react';
import { cn } from '../lib/utils';

export function PanelCreador() {
  const [contentType, setContentType] = useState<'video' | 'flyer'>('video');
  const [selectedCategory, setSelectedCategory] = useState('Diabetes');

  const categories = ['Diabetes', 'Hipertensión', 'Obesidad', 'General'];

  const recentPosts = [
    {
      id: 1,
      title: "Desayunos Saludables",
      time: "Hace 2 horas",
      category: "Diabetes",
      img: "https://images.unsplash.com/photo-1494390248081-4e521a5940db?auto=format&fit=crop&q=80&w=200",
    },
    {
      id: 2,
      title: "Control de Presión Arterial",
      time: "Ayer",
      category: "Hipertensión",
      img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=200",
    },
    {
      id: 3,
      title: "Mitos de la Obesidad",
      time: "15 Oct 2024",
      category: "Obesidad",
      img: "https://images.unsplash.com/photo-1511688858344-185ca3895e63?auto=format&fit=crop&q=80&w=200",
    }
  ];

  return (
    <div className="py-12 bg-[#fdfdfd] animate-fade-in-up">
      <div className="mb-12 flex items-center justify-between gap-4">
        <div>
          <span className="text-[#3b8751] font-bold text-xs uppercase tracking-widest bg-[#e0efd5] px-4 py-1.5 rounded-full mb-4 inline-block">
             Expert: Elena Rodríguez
          </span>
          <h1 className="text-5xl font-black text-[#1a1a1a] mb-4 tracking-tighter">
            Panel de Creador
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl leading-relaxed">
            Comparte tu conocimiento experto con la comunidad. Sube contenido educativo de alta calidad para transformar vidas.
          </p>
        </div>
        <div className="hidden md:flex flex-col items-end">
           <img 
             src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150" 
             className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-xl mb-2" 
             alt="Elena Rodríguez"
           />
           <span className="font-bold text-sm text-[#1a1a1a]">Elena Rodríguez</span>
           <span className="text-[10px] text-gray-400 font-medium">Nutricionista Clínica</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-gray-100 rounded-[3rem] p-10 shadow-sm">
            <h2 className="flex items-center gap-3 text-2xl font-bold mb-10 text-[#1a1a1a]">
              <div className="p-2 bg-[#e0efd5] rounded-xl">
                 <Upload className="w-6 h-6 text-[#246b38]" />
              </div>
              Nueva Publicación
            </h2>

            <div className="space-y-8">
              {/* Title Section */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Título del Contenido</label>
                <input 
                  type="text" 
                  placeholder="Ej: Guía Nutricional para la Diabetes Tipo 2"
                  className="w-full bg-[#f3f4f6]/50 border-none rounded-2xl p-5 text-[#1a1a1a] font-medium placeholder:text-gray-300 focus:ring-2 focus:ring-[#2a5934]/20 transition-all"
                />
              </div>

              {/* Row: Category and Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Categoría</label>
                  <div className="relative">
                    <select 
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full appearance-none bg-[#f3f4f6]/50 border-none rounded-2xl p-5 text-[#1a1a1a] font-medium focus:ring-2 focus:ring-[#2a5934]/20 transition-all cursor-pointer"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Tipo de Contenido</label>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setContentType('video')}
                      className={cn(
                        "flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all group",
                        contentType === 'video' 
                          ? "bg-[#e0efd5] border-[#246b38] text-[#246b38]" 
                          : "bg-gray-50 border-transparent text-gray-400 hover:bg-gray-100"
                      )}
                    >
                      <VideoIcon className="w-6 h-6" />
                      <span className="text-xs font-bold">Video</span>
                    </button>
                    <button 
                       onClick={() => setContentType('flyer')}
                       className={cn(
                        "flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all group",
                        contentType === 'flyer' 
                          ? "bg-[#e0efd5] border-[#246b38] text-[#246b38]" 
                          : "bg-gray-50 border-transparent text-gray-400 hover:bg-gray-100"
                      )}
                    >
                      <FileText className="w-6 h-6" />
                      <span className="text-xs font-bold">Flyer</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Upload Dropzone */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Archivo de Contenido</label>
                <div className="border-2 border-dashed border-[#e0efd5] rounded-[2.5rem] p-16 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50/50 transition-colors group">
                   <div className="w-16 h-16 bg-[#e0efd5] rounded-3xl flex items-center justify-center mb-6 text-[#246b38] group-hover:scale-110 transition-transform">
                      <FileCheck className="w-8 h-8" />
                   </div>
                   <h3 className="text-lg font-bold text-[#1a1a1a] mb-2">Arrastra y suelta tu archivo aquí</h3>
                   <p className="text-sm text-gray-400 mb-8">MP4, PDF o JPG hasta 50MB</p>
                   <button className="text-[#246b38] text-sm font-bold underline underline-offset-4 decoration-2">
                     O selecciona desde tu carpeta
                   </button>
                </div>
              </div>

              {/* Submit Button */}
              <button className="w-full bg-[#2a5934] hover:bg-[#1a4d2e] text-white py-6 rounded-[2rem] font-bold text-lg flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-[#2a5934]/20 mt-4">
                <Send className="w-5 h-5" /> Publicar Contenido
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div className="bg-[#f3f4f6]/80 rounded-[3rem] p-8 border border-white">
            <h3 className="text-xl font-bold mb-8 text-[#1a1a1a]">Mis Publicaciones Recientes</h3>
            <div className="space-y-6">
              {recentPosts.map(post => (
                <div key={post.id} className="flex gap-4 items-center group cursor-pointer bg-white p-4 rounded-[2rem] border border-gray-50 hover:shadow-md transition-all">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-sm flex-shrink-0">
                    <img src={post.img} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-[#1a1a1a] truncate mb-1">{post.title}</h4>
                    <div className="flex items-center gap-3">
                       <p className="text-[10px] text-gray-400 flex items-center gap-1">
                         <Clock className="w-3 h-3" /> {post.time}
                       </p>
                       <span className={cn(
                         "text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest",
                         post.category === 'Diabetes' ? "bg-green-100 text-green-700" : 
                         post.category === 'Hipertensión' ? "bg-emerald-100 text-emerald-800" : 
                         "bg-rose-100 text-rose-700"
                       )}>
                         {post.category}
                       </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-8 py-5 border-2 border-gray-200 rounded-[2rem] text-sm font-bold text-gray-500 hover:bg-white hover:border-[#246b38] hover:text-[#246b38] transition-all">
              Ver historial completo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
