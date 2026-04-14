import { Link, useLocation } from 'react-router-dom';
import { User, Menu, X, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';

export function Navbar() {
  const location = useLocation();
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isSuperAdmin = user?.role === 'super_admin';
  const canAccessCreator = user?.role === 'premium' || user?.role === 'admin' || user?.role === 'super_admin';

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
    ...(canAccessCreator ? [{ name: 'Panel Creador', path: '/creador' }] : []),
    ...(isSuperAdmin ? [{ name: 'Admin', path: '/admin' }] : []),
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
          <img 
            src="/logos/NutriconfianzaLogo.png" 
            alt="Nutriconfianza Logo" 
            className="w-9 h-9 md:w-10 md:h-10 object-contain group-hover:rotate-12 transition-transform"
          />
          <span className="text-lg md:text-xl font-black text-[#1a1a1a] tracking-tighter">
            NUTRI<span className="text-[#477d1e]">CONFIANZA</span>
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
                    ? "bg-[#477d1e] text-white border-[#477d1e] shadow-md shadow-[#477d1e]/20" 
                    : "text-gray-400 border-transparent hover:text-[#477d1e] hover:border-[#477d1e]/30 hover:bg-white"
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
            to="/perfil" 
            className={cn(
              "p-3 rounded-2xl transition-all group",
              location.pathname === '/perfil' ? "bg-[#8aaa1f] text-[#477d1e]" : "bg-gray-100/50 text-gray-400 hover:bg-[#8aaa1f] hover:text-[#477d1e]"
            )}
          >
            <User className="w-5 h-5" />
          </Link>
          
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-3 bg-gray-100/50 rounded-2xl text-[#477d1e] hover:bg-[#8aaa1f] transition-colors"
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
                <img 
                  src="/logos/NutriconfianzaLogo.png" 
                  alt="Nutriconfianza Logo" 
                  className="w-8 h-8 object-contain"
                />
                <span className="text-sm font-black text-[#1a1a1a] tracking-tighter uppercase">Menú</span>
             </div>
             <button 
                onClick={() => setIsMenuOpen(false)}
                className="p-4 bg-gray-100 rounded-2xl text-[#477d1e] hover:bg-[#8aaa1f] transition-all active:scale-90"
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
                      ? "bg-[#477d1e] text-white border-[#477d1e] shadow-2xl shadow-[#477d1e]/30 scale-105" 
                      : "text-gray-400 border-transparent hover:text-[#477d1e] hover:border-[#477d1e]/10"
                  )}
                 >
                   {link.name}
                   <ArrowRight className={cn("w-6 h-6 transition-transform", isActive ? "translate-x-0" : "-translate-x-4 opacity-0")} />
                 </Link>
               );
             })}
             
             {/* Auth Links */}
             {!user ? (
               <>
                 <Link
                  to="/login"
                  style={{ transitionDelay: `${links.length * 50}ms` }}
                  className={cn(
                    "flex items-center justify-between p-6 rounded-[2rem] text-xl font-black transition-all border-4",
                    location.pathname === '/login'
                      ? "bg-[#477d1e] text-white border-[#477d1e] shadow-2xl shadow-[#477d1e]/30 scale-105" 
                      : "text-gray-400 border-transparent hover:text-[#477d1e] hover:border-[#477d1e]/10"
                  )}
                 >
                   Iniciar Sesión
                   <ArrowRight className={cn("w-6 h-6 transition-transform", location.pathname === '/login' ? "translate-x-0" : "-translate-x-4 opacity-0")} />
                 </Link>
                 <Link
                  to="/registro"
                  style={{ transitionDelay: `${(links.length + 1) * 50}ms` }}
                  className={cn(
                    "flex items-center justify-between p-6 rounded-[2rem] text-xl font-black transition-all border-4",
                    location.pathname === '/registro'
                      ? "bg-[#477d1e] text-white border-[#477d1e] shadow-2xl shadow-[#477d1e]/30 scale-105" 
                      : "text-gray-400 border-transparent hover:text-[#477d1e] hover:border-[#477d1e]/10"
                  )}
                 >
                   Registrarse
                   <ArrowRight className={cn("w-6 h-6 transition-transform", location.pathname === '/registro' ? "translate-x-0" : "-translate-x-4 opacity-0")} />
                 </Link>
               </>
             ) : (
               <Link
                to="/perfil"
                style={{ transitionDelay: `${links.length * 50}ms` }}
                className={cn(
                  "flex items-center justify-between p-6 rounded-[2rem] text-xl font-black transition-all border-4",
                  location.pathname === '/perfil'
                    ? "bg-[#477d1e] text-white border-[#477d1e] shadow-2xl shadow-[#477d1e]/30 scale-105" 
                    : "text-gray-400 border-transparent hover:text-[#477d1e] hover:border-[#477d1e]/10"
                )}
               >
                 Mi Perfil
                 <ArrowRight className={cn("w-6 h-6 transition-transform", location.pathname === '/perfil' ? "translate-x-0" : "-translate-x-4 opacity-0")} />
               </Link>
             )}
           </div>
           
           <div className="absolute bottom-12 text-center w-full">
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.5em] mb-4">Nutriconfianza &copy; 2024</p>
              <div className="flex justify-center gap-4">
                 <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                 <div className="w-1.5 h-1.5 rounded-full bg-[#477d1e]" />
                 <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
              </div>
           </div>
        </div>
      </div>
    </>
  );
}
