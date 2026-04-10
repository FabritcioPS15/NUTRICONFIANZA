import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-[#f5f5f5] py-12 px-8 mt-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h2 className="text-[#1a4d2e] font-bold tracking-tight mb-2">NUTRICONFIANZA</h2>
          <p className="text-sm text-gray-500">© 2024 NUTRICONFIANZA. Educación para tu bienestar.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-6 md:gap-8 min-w-0">
          <Link to="#" className="text-sm text-gray-500 hover:text-[#1a4d2e] transition-colors">Accesibilidad</Link>
          <Link to="#" className="text-sm text-gray-500 hover:text-[#1a4d2e] transition-colors">Términos</Link>
          <Link to="#" className="text-sm text-gray-500 hover:text-[#1a4d2e] transition-colors">Privacidad</Link>
          <Link to="#" className="text-sm text-gray-500 hover:text-[#1a4d2e] transition-colors">Contacto</Link>
        </div>
      </div>
    </footer>
  );
}
