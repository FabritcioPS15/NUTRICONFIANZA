import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  FileText, 
  User, 
  Calendar,
  Tag,
  Loader2
} from 'lucide-react';
import { supabase } from '../lib/supabase/client';

export function ViewFlyer() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [flyer, setFlyer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchFlyer();
  }, [id]);

  const fetchFlyer = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('creator_content')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setFlyer(data);
    } catch (err) {
      console.error('Error fetching flyer:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#246b38] animate-spin" />
      </div>
    );
  }

  if (!flyer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Flyer no encontrado</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfdfd]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button 
            onClick={() => navigate('/creador')}
            className="flex items-center gap-2 text-gray-400 hover:text-[#246b38] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" /> Volver al Panel
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Flyer Image */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-100 rounded-[3rem] p-8 shadow-sm">
              <div className="bg-gray-100 rounded-2xl overflow-hidden mb-6">
                <img src={flyer.media_url} alt={flyer.title} className="w-full h-auto" />
              </div>

              <h1 className="text-3xl font-black text-[#1a1a1a] mb-4">{flyer.title}</h1>
              
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{flyer.author_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(flyer.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Info Sidebar */}
          <div className="space-y-6">
            <div className="bg-white border border-gray-100 rounded-[3rem] p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#246b38] rounded-2xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-[#1a1a1a]">Información</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Categoría</p>
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-[#246b38]" />
                    <span className="font-medium text-[#1a1a1a]">{flyer.category}</span>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Tipo</p>
                  <span className="font-medium text-[#1a1a1a]">Flyer</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-[3rem] p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-4 text-[#1a1a1a]">Acciones</h3>
              <button 
                onClick={() => window.open(flyer.media_url, '_blank')}
                className="w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 bg-[#246b38] hover:bg-[#1a4d2e] text-white transition-colors"
              >
                <FileText className="w-5 h-5" /> Abrir en Nueva Ventana
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
