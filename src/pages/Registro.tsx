import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, KeyRound, Loader2, Leaf, Mail } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { cn } from '../lib/utils';

export function Registro() {
  const navigate = useNavigate();
  const { signUp, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const result = await signUp({ email, password, full_name: fullName });
    if (result.error) {
      setError(result.error.message);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f2f4f1] to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#246b38] rounded-3xl mb-4 shadow-lg shadow-[#246b38]/20">
            <Leaf className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-[#1a1a1a] mb-2 tracking-tighter">Nutriconfianza</h1>
          <p className="text-gray-500 text-sm font-medium">Crea tu cuenta para comenzar</p>
        </div>

        {/* Register Card */}
        <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#e0efd5]/50 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#246b38]/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative">
            <h2 className="text-2xl font-black text-[#1a1a1a] text-center mb-8">Crear cuenta</h2>
            
            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-2xl text-sm font-medium mb-6">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Nombre completo</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="Juan Pérez"
                    className="w-full bg-gray-50 border-none rounded-2xl p-5 pl-12 focus:ring-2 focus:ring-[#246b38]/20 transition-all font-bold"
                  />
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Email</label>
                <div className="relative">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="tu@email.com"
                    className="w-full bg-gray-50 border-none rounded-2xl p-5 pl-12 focus:ring-2 focus:ring-[#246b38]/20 transition-all font-bold"
                  />
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Contraseña</label>
                <div className="relative">
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full bg-gray-50 border-none rounded-2xl p-5 pl-12 focus:ring-2 focus:ring-[#246b38]/20 transition-all font-bold"
                  />
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className={cn(
                  "w-full py-6 rounded-3xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-xl shadow-[#246b38]/20 mt-6",
                  loading ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-[#246b38] hover:bg-[#1a4d2e] text-white hover:scale-[1.02] active:scale-[0.98]"
                )}
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Crear Cuenta"}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-500 text-sm font-medium">
                ¿Ya tienes cuenta?{' '}
                <Link to="/login" className="text-[#246b38] font-black hover:underline">
                  Inicia sesión
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
