import { Link, useLocation } from 'react-router-dom';
import { Heart, Utensils, ShieldPlus } from 'lucide-react';
import { cn } from '../lib/utils';

export function Navbar() {
  const location = useLocation();

  const links = [
    { name: 'Inicio', path: '/' },
    { name: 'Videos', path: '/videos' },
    { name: 'Flyers', path: '/flyers' },
    { name: 'Comunidad', path: '/comunidad' },
    { name: 'Creador', path: '/creador' },
  ];

  return (
    <nav className="flex items-center justify-between px-8 py-5 bg-[#fdfdfd] sticky top-0 z-50">
      <Link to="/" className="text-[#1a4d2e] font-bold tracking-tight text-xl">
        NUTRICONFIANZA
      </Link>

      <div className="flex items-center gap-8">
        {links.map((link) => {
          // Hacky fix for home vs other paths matching
          const isActuallyActive = location.pathname === link.path;

          return (
            <Link
              key={link.name}
              to={link.path}
              className={cn(
                "text-sm font-medium transition-colors hover:text-[#1a4d2e] pb-1 border-b-2",
                isActuallyActive ? "text-[#1a4d2e] border-[#1a4d2e]" : "text-gray-500 border-transparent"
              )}
            >
              {link.name}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-4 text-[#1a4d2e]">
        <Link to="/guardados" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <Heart className="w-5 h-5" fill="currentColor" />
        </Link>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <Utensils className="w-5 h-5" fill="currentColor" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ShieldPlus className="w-5 h-5" fill="currentColor" />
        </button>
      </div>
    </nav>
  );
}
