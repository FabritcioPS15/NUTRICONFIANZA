import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, KeyRound, Loader2, Eye, EyeOff, ShieldPlus } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { cn } from '../lib/utils';

export function Login() {
  const navigate = useNavigate();
  const { signIn, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const result = await signIn({ email, password });
    if (result.error) {
      setError(result.error.message);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Image */}
      <div className="lg:w-1/2 bg-gradient-to-br from-[#246b38] to-[#1a4d2e] p-12 flex flex-col justify-center items-center">
        <div className="text-center">
          <div className="w-64 h-64 bg-white/10 rounded-full flex items-center justify-center mb-8">
            <User className="w-32 h-32 text-white" />
          </div>
          <h1 className="text-4xl font-black text-white mb-4 tracking-tighter">Nutri<span className="text-[#e0efd5]">confianza</span></h1>
          <p className="text-white/80 text-lg font-medium">Tu salud, nuestra prioridad</p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="lg:w-1/2 bg-white p-12 flex flex-col justify-center">
        {/* Logo at the top */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#246b38] rounded-2xl mb-4 shadow-lg">
            <ShieldPlus className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-black text-[#1a1a1a]">Bienvenido de nuevo</h2>
        </div>

        <div className="w-full max-w-md mx-auto">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-2xl text-sm font-medium mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Email</label>
              <div className="relative group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="tu@email.com"
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-5 pl-12 focus:ring-2 focus:ring-[#246b38]/20 focus:border-[#246b38] transition-all font-bold group-hover:bg-gray-100"
                />
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-[#246b38] transition-colors" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Contraseña</label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-5 pl-12 pr-12 focus:ring-2 focus:ring-[#246b38]/20 focus:border-[#246b38] transition-all font-bold group-hover:bg-gray-100"
                />
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-[#246b38] transition-colors" />
                <button
                  type="button"
                  onClick={() => {
                    setShowPassword(!showPassword);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#246b38] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-[#246b38] focus:ring-[#246b38] focus:ring-offset-0"
                />
                <span className="text-sm text-gray-600 font-medium group-hover:text-[#246b38] transition-colors">Recuérdame</span>
              </label>
              <Link to="/recuperar-password" className="text-sm text-[#246b38] font-black hover:underline hover:text-[#1a4d2e] transition-colors">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={cn(
                "w-full py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-lg shadow-[#246b38]/20",
                loading ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-[#246b38] hover:bg-[#1a4d2e] text-white hover:scale-[1.01] active:scale-[0.99] hover:shadow-xl hover:shadow-[#246b38]/30"
              )}
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Iniciar Sesión"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm font-medium">
              ¿No tienes cuenta?{' '}
              <Link to="/registro" className="text-[#246b38] font-black hover:underline hover:text-[#1a4d2e] transition-colors">
                Regístrate gratis
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
