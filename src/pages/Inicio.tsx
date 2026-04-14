import { ArrowRight, CheckCircle2, Play, BookText, Users, Leaf, Scale, Microscope, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Inicio() {
  return (
    <div className="flex flex-col gap-16 md:gap-32 py-10 md:py-20">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center gap-12 animate-fade-in-up">
        <div className="flex-1 space-y-6 md:space-y-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#8aaa1f] text-[#477d1e] text-[10px] font-black uppercase tracking-[0.2em] mb-2 mx-auto md:mx-0">
             <Leaf className="w-3 h-3" /> Nutrición Basada en Evidencia
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-8xl font-black text-[#1a1a1a] tracking-tight leading-[1.1]">
            NUTRI<span className="text-[#477d1e]">CONFIANZA</span>
            <br className="hidden md:block" />
            <span className="text-gray-400 font-medium text-2xl sm:text-3xl md:text-5xl italic block mt-2">"Cuida tu salud sin mitos"</span>
          </h1>
          <p className="text-gray-500 text-base md:text-xl max-w-xl leading-relaxed mx-auto md:mx-0">
            Accede a información curada por expertos, videos educativos y una comunidad que prioriza tu bienestar real. Descubre la nutrición basada en ciencia.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
            <button className="w-full sm:w-auto bg-[#477d1e] hover:bg-[#477d1e] text-white px-10 py-5 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 shadow-xl shadow-[#477d1e]/20 hover:scale-105 active:scale-95">
              Comenzar ahora <ArrowRight className="w-5 h-5" />
            </button>
            <button className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-[#1a1a1a] px-10 py-5 rounded-2xl font-bold transition-all">
              Explorar Guías
            </button>
          </div>
        </div>
        
        <div className="flex-1 relative w-full md:w-auto">
          <div className="rounded-[3rem] overflow-hidden bg-gray-100 aspect-square w-full md:w-[90%] ml-auto relative shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=1200" 
              alt="Professional"
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
          <div className="absolute -bottom-6 left-1/2 -ms-28 md:ms-0 md:left-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-6 flex items-center gap-5 border border-white/20 w-56 md:w-auto">
            <div className="bg-[#477d1e] rounded-xl p-3 flex items-center justify-center shadow-lg shadow-[#477d1e]/20">
               <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Información</p>
              <p className="font-black text-sm text-[#1a1a1a]">100% Científica</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Access Grid */}
      <section className="space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 text-center md:text-left">
           <div>
              <h2 className="text-3xl md:text-5xl font-black text-[#1a1a1a] tracking-tight mb-4">Acceso Directo</h2>
              <p className="text-gray-400 font-medium">Todo nuestro conocimiento organizado para ti.</p>
           </div>
           <Link to="/videos" className="text-[#477d1e] font-bold flex items-center gap-2 hover:gap-4 transition-all group">
             Ver todo el contenido <ArrowRight className="w-5 h-5 group-hover:rotate-45" />
           </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link to="/videos" className="p-10 rounded-[3rem] bg-white border border-gray-100 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-bl-[4rem] group-hover:bg-green-100 transition-colors" />
            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-8 relative z-10 transition-transform group-hover:scale-110">
              <Play className="w-6 h-6 text-[#477d1e] fill-current" />
            </div>
            <h3 className="text-2xl font-black mb-4 text-[#1a1a1a]">Videos</h3>
            <p className="text-gray-500 text-sm mb-10 leading-relaxed font-medium">
              Lecciones visuales sobre nutrición, mitos desmentidos y guías prácticas de alimentación concienzuda.
            </p>
            <div className="flex items-center gap-2 text-[#477d1e] font-black text-[10px] uppercase tracking-widest">
              Explorar <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          <Link to="/flyers" className="p-10 rounded-[3rem] bg-white border border-gray-100 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 rounded-bl-[4rem] group-hover:bg-rose-100 transition-colors" />
            <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center mb-8 relative z-10 transition-transform group-hover:scale-110">
              <BookText className="w-6 h-6 text-rose-700" />
            </div>
            <h3 className="text-2xl font-black mb-4 text-[#1a1a1a]">Flyers</h3>
            <p className="text-gray-500 text-sm mb-10 leading-relaxed font-medium">
              Infografías descargables y resúmenes visuales diseñados para ser entendidos a primera vista.
            </p>
            <div className="flex items-center gap-2 text-rose-700 font-black text-[10px] uppercase tracking-widest">
              Descargar <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          <Link to="/comunidad" className="p-10 rounded-[3rem] bg-[#477d1e] shadow-xl hover:shadow-2xl transition-all group relative overflow-hidden text-white">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-bl-[4rem] group-hover:bg-white/20 transition-colors" />
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-8 relative z-10 transition-transform group-hover:scale-110">
              <Users className="w-6 h-6 text-white fill-current" />
            </div>
            <h3 className="text-2xl font-black mb-4">Comunidad</h3>
            <p className="text-white/70 text-sm mb-10 leading-relaxed font-medium">
              Únete a miles de personas compartiendo sus logros y dudas en un ambiente profesional y seguro.
            </p>
            <div className="flex items-center gap-2 text-white font-black text-[10px] uppercase tracking-widest">
              Unirse ahora <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </div>
      </section>

      {/* Values/Stats Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 py-12 border-y border-gray-100 bg-gray-50/50 -mx-4 md:-mx-8 px-8 rounded-[3rem]">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md">
             <Leaf className="w-6 h-6 text-[#477d1e]" />
          </div>
          <span className="text-[10px] font-black text-gray-500 tracking-[0.2em] uppercase">100% Natural</span>
        </div>
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md">
             <Scale className="w-6 h-6 text-[#477d1e]" />
          </div>
          <span className="text-[10px] font-black text-gray-500 tracking-[0.2em] uppercase">Equilibrio Real</span>
        </div>
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md">
            <Microscope className="w-6 h-6 text-[#477d1e]" />
          </div>
          <span className="text-[10px] font-black text-gray-500 tracking-[0.2em] uppercase">Ciencia Pura</span>
        </div>
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md">
             <Brain className="w-6 h-6 text-[#477d1e]" />
          </div>
          <span className="text-[10px] font-black text-gray-500 tracking-[0.2em] uppercase">Mente Sana</span>
        </div>
      </section>

      {/* Modern Event CTA */}
      <section className="relative overflow-hidden bg-[#1a1a1a] rounded-[4rem] p-10 md:p-20 text-white group">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#477d1e]/20 blur-[100px] -z-0 pointer-events-none" />
        <div className="flex flex-col md:flex-row items-center gap-16 relative z-10">
          <div className="flex-1 space-y-8 text-center md:text-left">
            <span className="text-[10px] font-black px-4 py-2 bg-[#477d1e] rounded-full uppercase tracking-widest shadow-lg shadow-[#477d1e]/40">
              PRÓXIMO WEBINAR
            </span>
            <h2 className="text-4xl md:text-6xl font-black leading-tight italic">
              "Mitos Alimentarios que <span className="text-[#477d1e] not-italic underline decoration-white/20">Agotan tu Energía</span>"
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed max-w-xl">
              Este viernes analizaremos junto a expertos las mentiras más comunes de la industria y cómo recuperar tu rendimiento vital con ciencia.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 items-center justify-center md:justify-start">
               <button className="w-full sm:w-auto bg-white text-black px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#477d1e] hover:text-white transition-all shadow-xl shadow-white/5">
                 Reservar Mi Cupo Gratis
               </button>
               <div className="flex -space-x-4">
                  {[1,2,3,4].map(n => (
                    <div key={n} className="w-10 h-10 rounded-full border-4 border-[#1a1a1a] bg-gray-600 overflow-hidden">
                       <img src={`https://i.pravatar.cc/100?u=${n}`} alt="" />
                    </div>
                  ))}
                  <div className="flex items-center ml-4 text-xs font-bold text-gray-500">+1.2k inscritos</div>
               </div>
            </div>
          </div>
          <div className="flex-1 hidden md:block">
            <div className="relative">
               <div className="w-full aspect-square rounded-[3rem] bg-[#477d1e]/10 border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-700">
                  <Play className="w-20 h-20 text-[#477d1e] fill-current animate-pulse" />
               </div>
               <div className="absolute -top-4 -right-4 w-24 h-24 bg-white rounded-full flex items-center justify-center text-[#1a1a1a] font-black text-[10px] uppercase text-center p-4 shadow-2xl rotate-12">
                  En Vivo este Viernes
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
