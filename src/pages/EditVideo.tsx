import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Video as VideoIcon, 
  Save, 
  Loader2,
  Upload,
  Link as LinkIcon
} from 'lucide-react';
import { supabase } from '../lib/supabase/client';

export function EditVideo() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [video, setVideo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [category, setCategory] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [uploadType, setUploadType] = useState<'file' | 'link'>('file');
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (id) fetchVideo();
  }, [id]);

  const fetchVideo = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('creator_content')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setVideo(data);
      setTitle(data.title || '');
      setAuthorName(data.author_name || '');
      setCategory(data.category || 'General');
      setMediaUrl(data.media_url || '');
      setThumbnailUrl(data.thumbnail_url || '');
      setUploadType(data.media_url?.includes('supabase.co') ? 'file' : 'link');
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('Publicaciones')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('Publicaciones')
        .getPublicUrl(filePath);

      setMediaUrl(data.publicUrl);
    } catch (err) {
      alert('Error al subir el archivo');
    }
  };

  const handleThumbnailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `thumbnail-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('Publicaciones')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('Publicaciones')
        .getPublicUrl(filePath);

      setThumbnailUrl(data.publicUrl);
    } catch (err) {
      alert('Error al subir el thumbnail');
    }
  };

  const handleSave = async () => {
    if (!title || !authorName || !mediaUrl) {
      alert('Por favor completa todos los campos');
      return;
    }

    try {
      setSaving(true);
      
      // Primero verificar si el registro existe
      const { data: existingRecord, error: fetchError } = await supabase
        .from('creator_content')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      if (!existingRecord) {
        alert('El registro no existe');
        return;
      }

      // Ahora actualizar usando la función RPC
      const { error: rpcError, data: updatedRecord } = await supabase.rpc('update_creator_content', {
        p_id: id,
        p_title: title,
        p_author_name: authorName,
        p_category: category,
        p_media_url: mediaUrl,
        p_thumbnail_url: thumbnailUrl,
      });

      if (rpcError) {
        throw rpcError;
      }

      if (updatedRecord?.media_url === mediaUrl) {
        alert('Cambios guardados correctamente');
        navigate('/creador');
      } else {
        alert('El link no se guardó correctamente. Por favor intenta de nuevo.');
      }
    } catch (err) {
      alert(`Error al guardar los cambios: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#246b38] animate-spin" />
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
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white border border-gray-100 rounded-[3rem] p-8 shadow-sm">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-[#246b38] rounded-2xl flex items-center justify-center">
              <VideoIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-[#1a1a1a]">Editar Video</h1>
              <p className="text-gray-500">Modifica la información del video</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Título */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 block">
                Título
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-[#246b38]/20 focus:border-[#246b38] transition-all outline-none"
                placeholder="Título del video"
              />
            </div>

            {/* Autor */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 block">
                Autor
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-[#246b38]/20 focus:border-[#246b38] transition-all outline-none"
                placeholder="Nombre del autor"
              />
            </div>

            {/* Categoría */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 block">
                Categoría
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-[#246b38]/20 focus:border-[#246b38] transition-all outline-none"
              >
                <option value="Diabetes">Diabetes</option>
                <option value="Hipertensión">Hipertensión</option>
                <option value="Obesidad">Obesidad</option>
                <option value="General">General</option>
              </select>
            </div>

            {/* Thumbnail */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 block">
                Thumbnail (Imagen de vista previa)
              </label>
              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-[#246b38] transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="hidden"
                  id="thumbnail-upload"
                />
                <label htmlFor="thumbnail-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">Haz click para subir una imagen</p>
                  {thumbnailUrl && (
                    <div className="mt-4">
                      <img src={thumbnailUrl} alt="Thumbnail preview" className="max-h-40 mx-auto rounded-xl" />
                      <p className="text-sm text-green-600 mt-2">Thumbnail cargado</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Tipo de subida */}
            <div className="flex gap-4">
              <button
                onClick={() => setUploadType('file')}
                className={`px-6 py-3 rounded-xl font-bold transition-all ${uploadType === 'file' ? 'bg-[#246b38] text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                Subir Archivo
              </button>
              <button
                onClick={() => setUploadType('link')}
                className={`px-6 py-3 rounded-xl font-bold transition-all ${uploadType === 'link' ? 'bg-[#246b38] text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                Link Social
              </button>
            </div>

            {/* Archivo o Link */}
            {uploadType === 'file' ? (
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 block">
                  Archivo de Video
                </label>
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-[#246b38] transition-colors">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="video-upload"
                  />
                  <label htmlFor="video-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Haz click para subir un video</p>
                    {mediaUrl && <p className="text-sm text-green-600 mt-2">Archivo cargado</p>}
                  </label>
                </div>
              </div>
            ) : (
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 block">
                  Link del Video
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 pl-12 pr-4 focus:ring-2 focus:ring-[#246b38]/20 focus:border-[#246b38] transition-all outline-none"
                    placeholder="Pega el link de YouTube, TikTok, etc."
                  />
                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>
            )}

            {/* Preview */}
            {mediaUrl && (
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 block">
                  Vista Previa
                </label>
                <div className="aspect-video bg-gray-100 rounded-2xl overflow-hidden">
                  {mediaUrl.includes('youtube') || mediaUrl.includes('youtu.be') ? (
                    <iframe 
                      src={mediaUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  ) : (
                    <video src={mediaUrl} controls className="w-full h-full" />
                  )}
                </div>
              </div>
            )}

            {/* Botón Guardar */}
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 bg-[#246b38] hover:bg-[#1a4d2e] text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
