import { ArrowRight, CheckCircle2, Play, BookText, Users, Leaf, Scale, Microscope, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Inicio() {
  return (
    <div className="flex flex-col gap-24 py-12">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center gap-12 mt-8 animate-fade-in-up">
        <div className="flex-1 space-y-8">
          <h1 className="text-6xl font-bold text-[#1a1a1a] tracking-tight leading-tight">
            NUTRICONFIANZA
            <br />
            <span className="text-[#3b8751] font-medium text-4xl italic">"Cuida tu salud sin mitos"</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-xl leading-relaxed">
            Accede a información curada por expertos, videos educativos y una comunidad que prioriza tu bienestar real. Descubre la nutrición basada en evidencia.
          </p>
          <div className="flex items-center gap-4">
            <button className="bg-[#246b38] hover:bg-[#1a4d2e] text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2">
              Comenzar ahora <ArrowRight className="w-4 h-4" />
            </button>
            <button className="bg-gray-100 hover:bg-gray-200 text-[#1a1a1a] px-6 py-3 rounded-lg font-medium transition-colors">
              Saber más
            </button>
          </div>
        </div>
        <div className="flex-1 relative">
          <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-red-800 to-red-600 aspect-square w-[90%] ml-auto relative">
            <img 
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800" 
              alt="Professional"
              className="object-cover w-full h-full object-top"
            />
          </div>
          <div className="absolute -bottom-6 left-4 bg-white rounded-xl shadow-xl p-4 flex items-center gap-4 border border-gray-100">
            <div className="bg-[#1a4d2e] rounded-full p-1.5 flex items-center justify-center">
               <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Garantía</p>
              <p className="font-bold text-sm text-[#1a1a1a]">100% Evidencia</p>
            </div>
          </div>
        </div>
      </section>

      {/* Acceso Directo */}
      <section className="space-y-8 animate-fade-in-up stagger-1 opacity-0 fill-mode-forwards" style={{ animationFillMode: 'forwards' }}>
        <h2 className="text-2xl font-bold text-[#1a1a1a]">Acceso Directo</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Link to="/videos" className="p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6">
              <Play className="w-6 h-6 text-[#246b38] fill-current" />
            </div>
            <h3 className="text-xl font-bold mb-3">Videos</h3>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
              Lecciones visuales sobre nutrición, mitos desmentidos y guías paso a paso.
            </p>
            <div className="bg-[#4d6d56] group-hover:bg-[#344d3b] transition-colors text-white text-sm font-medium py-3 rounded-lg w-full flex justify-center items-center gap-2">
              Explorar Contenido <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          <Link to="/flyers" className="p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-6">
              <BookText className="w-6 h-6 text-red-700" />
            </div>
            <h3 className="text-xl font-bold mb-3">Flyers</h3>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
              Infografías descargables y resúmenes visuales para llevar tu salud al siguiente nivel.
            </p>
            <div className="bg-[#4d6d56] group-hover:bg-[#344d3b] transition-colors text-white text-sm font-medium py-3 rounded-lg w-full flex justify-center items-center gap-2">
              Descargar Flyers <ArrowRight className="w-4 h-4 rotate-90" />
            </div>
          </Link>

          <Link to="/comunidad" className="p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6">
              <Users className="w-6 h-6 text-[#246b38] fill-current" />
            </div>
            <h3 className="text-xl font-bold mb-3">Comunidad</h3>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
              Únete a miles de personas compartiendo sus logros y dudas en un ambiente seguro.
            </p>
            <div className="bg-[#4d6d56] group-hover:bg-[#344d3b] transition-colors text-white text-sm font-medium py-3 rounded-lg w-full flex justify-center items-center gap-2">
              Entrar al Grupo <Users className="w-4 h-4" />
            </div>
          </Link>
        </div>
      </section>

      {/* Icons line */}
      <section className="flex justify-center gap-16 md:gap-32 py-8 border-y border-gray-100">
        <div className="flex flex-col items-center gap-3">
          <Leaf className="w-6 h-6 text-[#4d6d56]" />
          <span className="text-xs font-bold text-gray-500 tracking-widest uppercase">Natural</span>
        </div>
        <div className="flex flex-col items-center gap-3">
          <Scale className="w-6 h-6 text-[#4d6d56]" />
          <span className="text-xs font-bold text-gray-500 tracking-widest uppercase">Equilibrio</span>
        </div>
        <div className="flex flex-col items-center gap-3">
          <Microscope className="w-6 h-6 text-[#4d6d56]" />
          <span className="text-xs font-bold text-gray-500 tracking-widest uppercase">Ciencia</span>
        </div>
        <div className="flex flex-col items-center gap-3">
          <Brain className="w-6 h-6 text-[#4d6d56]" />
          <span className="text-xs font-bold text-gray-500 tracking-widest uppercase">Mental</span>
        </div>
      </section>

      {/* Event Promo */}
      <section className="bg-[#e4e6df] rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-12">
        <div className="bg-[#c2ceca] flex-1 rounded-2xl aspect-square max-w-[400px] flex items-center justify-center p-8 relative overflow-hidden">
          {/* Abstract graphic representation */}
          <div className="absolute inset-0 opacity-50 flex items-center justify-center">
            <div className="w-64 h-64 border-[24px] border-white/40 rounded-full flex flex-col items-center justify-center gap-4">
               <div className="w-12 h-12 bg-[#5d8b74] rounded-full flex items-center justify-center"><Leaf className="text-white w-5 h-5"/></div>
               <div className="w-16 h-16 bg-[#5d8b74] rounded-full flex items-center justify-center"><Microscope className="text-white w-6 h-6"/></div>
            </div>
          </div>
          <span className="text-[#3b8751] font-bold text-2xl z-10 font-[Inter] tracking-wide relative top-28">virtuross</span>
        </div>
        <div className="flex-1 space-y-6">
          <span className="bg-[#c4ddcc] text-[#246b38] text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
            Próximo Evento
          </span>
          <h2 className="text-4xl font-bold text-[#1a1a1a] leading-tight">
            Mitos de la nutrición: Webinar en vivo
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Acompáñanos este viernes en una sesión exclusiva donde desglosaremos las mentiras más comunes del marketing alimentario.
          </p>
          <button className="text-[#246b38] font-semibold flex items-center gap-2 hover:underline pt-4">
            Inscribirse gratis <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
