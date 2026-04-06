import { Link, useLocation } from 'react-router-dom';
import { Heart, User, ShieldPlus, Menu, X, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { useState, useEffect } from 'react';

export function Navbar() {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const links = [
    { name: 'Inicio', path: '/' },
    { name: 'Videos', path: '/videos' },
    { name: 'Flyers', path: '/flyers' },
    { name: 'Comunidad', path: '/comunidad' },
    { name: 'Panel Creador', path: '/creador' },
    { name: 'Guardados', path: '/guardados' },
  ];

  return (
    <>
      <nav className={cn(
        "sticky top-0 z-[100] transition-all duration-500 px-6 md:px-12 py-4 flex items-center justify-between w-full",
        isScrolled 
          ? "bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] py-3" 
          : "bg-white/50 backdrop-blur-md border-b border-transparent py-5"
      )}>
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 group relative z-[110]">
          <div className="w-10 h-10 bg-[#246b38] rounded-xl flex items-center justify-center shadow-lg shadow-[#246b38]/20 group-hover:rotate-12 transition-transform">
             <ShieldPlus className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-black text-[#1a1a1a] tracking-tighter">
            NUTRI<span className="text-[#246b38]">CONFIANZA</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-1 bg-gray-100/50 p-1 rounded-2xl border border-gray-200/20">
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 border-2",
                  isActive 
                    ? "bg-[#246b38] text-white border-[#246b38] shadow-md shadow-[#246b38]/20" 
                    : "text-gray-400 border-transparent hover:text-[#246b38] hover:border-[#246b38]/30 hover:bg-white"
                )}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-2 md:gap-3 relative z-[110]">
          <Link 
            to="/guardados" 
            className={cn(
              "p-3 rounded-2xl transition-all relative group",
              location.pathname === '/guardados' ? "bg-rose-50 text-rose-500" : "bg-gray-100/50 text-gray-400 hover:bg-rose-50 hover:text-rose-500"
            )}
          >
            <Heart className={cn("w-5 h-5", location.pathname === '/guardados' ? "fill-current" : "group-hover:fill-current")} />
          </Link>
          
          <Link 
            to="/perfil" 
            className={cn(
              "p-3 rounded-2xl transition-all group hidden md:flex",
              location.pathname === '/perfil' ? "bg-[#e0efd5] text-[#246b38]" : "bg-gray-100/50 text-gray-400 hover:bg-[#e0efd5] hover:text-[#246b38]"
            )}
          >
            <User className="w-5 h-5" />
          </Link>
          
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-3 bg-gray-100/50 rounded-2xl text-[#246b38] hover:bg-[#e0efd5] transition-colors"
          >
             {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <div className={cn(
        "fixed inset-0 z-[90] lg:hidden transition-all duration-500",
        isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsMenuOpen(false)} />
        <div className={cn(
          "absolute right-0 top-0 bottom-0 w-[80%] max-w-xs bg-white shadow-2xl p-8 pt-28 flex flex-col gap-4 transform transition-transform duration-500 ease-out",
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        )}>
           <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4 border-b border-gray-100 pb-4">Menú de Navegación</h3>
           {links.map((link) => {
             const isActive = location.pathname === link.path;
             return (
               <Link
                key={link.name}
                to={link.path}
                className={cn(
                  "flex items-center justify-between p-4 rounded-2xl font-bold transition-all",
                  isActive 
                    ? "bg-[#e0efd5] text-[#246b38]" 
                    : "text-gray-600 hover:bg-gray-50"
                )}
               >
                 {link.name}
                 <ChevronRight className={cn("w-4 h-4 opacity-30", isActive && "opacity-100")} />
               </Link>
             );
           })}
           
           <div className="mt-auto bg-gray-50 p-6 rounded-3xl">
              <p className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-[0.1em]">Configuración</p>
              <Link to="/perfil" className="flex items-center gap-3 text-gray-700 font-bold text-sm">
                 <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-200">
                    <User className="w-5 h-5 text-[#246b38]" />
                 </div>
                 Mi Perfil
              </Link>
           </div>
        </div>
      </div>
    </>
  );
}
