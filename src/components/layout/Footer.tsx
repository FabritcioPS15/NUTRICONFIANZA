import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-[#477d1e] to-[#8aaa1f] text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="space-y-4 flex flex-col items-center text-center">
            <div className="mb-4">
              <div className="w-36 h-36 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden">
                <img src="/logos/NutriconfianzaLogo.png" alt="Nutriconfianza" className="w-32 h-32 object-contain brightness-0 invert" />
              </div>
            </div>
            <p className="text-white/80 text-sm leading-relaxed">
              Educación para tu bienestar. Guía nutricional personalizada para una vida más saludable y feliz.
            </p>
            <div className="flex gap-3 pt-2">
              <a href="#" className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-all hover:scale-110">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-all hover:scale-110">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-all hover:scale-110">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#f78620] rounded-full"></span>
              Enlaces Rápidos
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-white/80 hover:text-white transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-white/40 rounded-full group-hover:bg-[#f78620] transition-colors"></span>
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/videos" className="text-white/80 hover:text-white transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-white/40 rounded-full group-hover:bg-[#f78620] transition-colors"></span>
                  Videos
                </Link>
              </li>
              <li>
                <Link to="/flyers" className="text-white/80 hover:text-white transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-white/40 rounded-full group-hover:bg-[#f78620] transition-colors"></span>
                  Flyers
                </Link>
              </li>
              <li>
                <Link to="/comunidad" className="text-white/80 hover:text-white transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-white/40 rounded-full group-hover:bg-[#f78620] transition-colors"></span>
                  Comunidad
                </Link>
              </li>
              <li>
                <Link to="/planes" className="text-white/80 hover:text-white transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-white/40 rounded-full group-hover:bg-[#f78620] transition-colors"></span>
                  Planes
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#055b68] rounded-full"></span>
              Recursos
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="#" className="text-white/80 hover:text-white transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-white/40 rounded-full group-hover:bg-[#055b68] transition-colors"></span>
                  Blog de Nutrición
                </Link>
              </li>
              <li>
                <Link to="#" className="text-white/80 hover:text-white transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-white/40 rounded-full group-hover:bg-[#055b68] transition-colors"></span>
                  Recetas Saludables
                </Link>
              </li>
              <li>
                <Link to="#" className="text-white/80 hover:text-white transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-white/40 rounded-full group-hover:bg-[#055b68] transition-colors"></span>
                  Calculadora IMC
                </Link>
              </li>
              <li>
                <Link to="#" className="text-white/80 hover:text-white transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-white/40 rounded-full group-hover:bg-[#055b68] transition-colors"></span>
                  Guías de Salud
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full"></span>
              Contacto
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-white/60 mb-1">Email</p>
                  <a href="mailto:info@nutriconfianza.com" className="text-sm text-white hover:text-[#f78620] transition-colors">
                    info@nutriconfianza.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-white/60 mb-1">Teléfono</p>
                  <a href="tel:+1234567890" className="text-sm text-white hover:text-[#f78620] transition-colors">
                    +1 (234) 567-890
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-white/60 mb-1">Ubicación</p>
                  <p className="text-sm text-white">Ciudad, País</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/70 text-sm text-center md:text-left">
              © 2024 NUTRICONFIANZA. Todos los derechos reservados.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <Link to="#" className="text-white/70 hover:text-white transition-colors text-sm">
                Términos
              </Link>
              <Link to="#" className="text-white/70 hover:text-white transition-colors text-sm">
                Privacidad
              </Link>
              <Link to="#" className="text-white/70 hover:text-white transition-colors text-sm">
                Cookies
              </Link>
              <Link to="#" className="text-white/70 hover:text-white transition-colors text-sm">
                Accesibilidad
              </Link>
            </div>
            <p className="text-white/70 text-sm flex items-center gap-1">
              Hecho con <Heart className="w-4 h-4 text-[#f78620] fill-[#f78620]" /> para tu bienestar
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
