import { Link, useLocation } from 'react-router-dom';
import { Heart, User, ShieldPlus, Menu, X, ArrowRight } from 'lucide-react';
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

      {/* Mobile Curtain Menu - Full Screen */}
      <div className={cn(
        "fixed inset-0 z-[150] lg:hidden transition-all duration-700",
        isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}>
        {/* Full-screen backdrop with heavy blur */}
        <div className="absolute inset-0 bg-white/95 backdrop-blur-3xl" onClick={() => setIsMenuOpen(false)} />
        
        {/* Header inside menu to allow closing */}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-[160]">
             <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#246b38] rounded-lg flex items-center justify-center">
                   <ShieldPlus className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-black text-[#1a1a1a] tracking-tighter uppercase">Menú</span>
             </div>
             <button 
                onClick={() => setIsMenuOpen(false)}
                className="p-4 bg-gray-100 rounded-2xl text-[#246b38] hover:bg-[#e0efd5] transition-all active:scale-90"
              >
                 <X className="w-6 h-6" />
              </button>
        </div>

        {/* Links centered vertically */}
        <div className={cn(
          "absolute inset-0 flex flex-col justify-center items-center px-8 transition-all duration-700 transform ease-out z-[155]",
          isMenuOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        )}>
           <div className="flex flex-col gap-4 w-full max-w-sm">
             {links.map((link, index) => {
               const isActive = location.pathname === link.path;
               return (
                 <Link
                  key={link.name}
                  to={link.path}
                  style={{ transitionDelay: `${index * 50}ms` }}
                  className={cn(
                    "flex items-center justify-between p-6 rounded-[2rem] text-xl font-black transition-all border-4",
                    isActive 
                      ? "bg-[#246b38] text-white border-[#246b38] shadow-2xl shadow-[#246b38]/30 scale-105" 
                      : "text-gray-400 border-transparent hover:text-[#246b38] hover:border-[#246b38]/10"
                  )}
                 >
                   {link.name}
                   <ArrowRight className={cn("w-6 h-6 transition-transform", isActive ? "translate-x-0" : "-translate-x-4 opacity-0")} />
                 </Link>
               );
             })}
           </div>
           
           <div className="absolute bottom-12 text-center w-full">
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.5em] mb-4">Nutriconfianza &copy; 2024</p>
              <div className="flex justify-center gap-4">
                 <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                 <div className="w-1.5 h-1.5 rounded-full bg-[#246b38]" />
                 <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
              </div>
           </div>
        </div>
      </div>
    </>
  );
}
