import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Video as VideoIcon, 
  FileText, 
  ChevronDown,
  FileCheck,
  Send,
  Loader2,
  CheckCircle2,
  Link as LinkIcon,
  User,
  Edit2,
  PlusCircle,
  XCircle,
  Lock,
  KeyRound,
  LogOut,
  Trash2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase/client';

export function PanelCreador() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [contentType, setContentType] = useState<'video' | 'flyer'>('video');
  const [uploadType, setUploadType] = useState<'file' | 'link'>('file');
  const [linkUrl, setLinkUrl] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Diabetes');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ['Diabetes', 'Hipertensión', 'Obesidad', 'General'];

  // Auth States
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthChecked(true);
    });
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session) fetchRecentPosts();
    });
    
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) fetchRecentPosts();
  }, [user]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoggingIn(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (err: any) {
      alert(`Error de acceso: ${err.message}`);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const fetchRecentPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('creator_content')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setRecentPosts(data || []);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `expert-content/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('Publicaciones')
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('Publicaciones')
        .getPublicUrl(filePath);

      setUploadedUrl(publicUrl);
    } catch (err: any) {
      alert(`Error al subir (${err.message || 'Error de conexión'}). Asegúrate de tener el Bucket "Publicaciones" creado en Supabase con políticas públicas de inserción.`);
    } finally {
      setIsUploading(false);
    }
  };

  const startEdit = (post: any) => {
    if (post.content_type === 'video') {
      navigate(`/edit-video/${post.id}`);
    } else if (post.content_type === 'flyer') {
      navigate(`/edit-flyer/${post.id}`);
    }
  };

  const deletePost = async (postId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!confirm('¿Estás seguro de que quieres eliminar este contenido? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      const { error } = await supabase.rpc('delete_creator_content', {
        p_id: postId,
      });

      if (error) throw error;

      // Recargar la lista de posts
      fetchRecentPosts();
      alert('Contenido eliminado correctamente');
    } catch (err) {
      alert('Error al eliminar el contenido');
    }
  };

  const cancelEdit = () => {
    setEditId(null);
    setTitle('');
    setAuthorName('');
    setLinkUrl('');
    setUploadedUrl(null);
    setUploadType('file');
  };

  const handleSubmit = async () => {
    const finalUrl = uploadType === 'link' ? linkUrl : uploadedUrl;

    if (!title || !authorName || !finalUrl) {
      alert('Por favor completa todos los campos (título, autor y archivo/link)');
      return;
    }

    try {
      setIsUploading(true);
      
      const payload = {
        title,
        author_name: authorName,
        category: selectedCategory,
        content_type: contentType,
        media_url: finalUrl,
        thumbnail_url: contentType === 'video' ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400' : finalUrl
      };

      if (editId) {
        const { error } = await supabase
          .from('creator_content')
          .update(payload)
          .eq('id', editId);
        if (error) throw error;
        alert('¡Contenido actualizado con éxito!');
      } else {
        const { error } = await supabase
          .from('creator_content')
          .insert([payload]);
        if (error) throw error;
        alert('¡Contenido publicado con éxito!');
      }

      cancelEdit();
      fetchRecentPosts();
    } catch (err) {
      alert('Error al guardar el contenido');
    } finally {
      setIsUploading(false);
    }
  };

  if (!authChecked) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
        <Loader2 className="w-10 h-10 text-[#477d1e] animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 animate-fade-in-up">
        <div className="w-full max-w-md bg-white rounded-[3rem] border border-gray-100 shadow-2xl p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#8aaa1f]/50 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#477d1e]/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative">
            <div className="w-20 h-20 bg-[#8aaa1f] rounded-[2rem] flex items-center justify-center mb-8 mx-auto">
               <Lock className="w-10 h-10 text-[#477d1e]" />
            </div>
            
            <h1 className="text-3xl font-black text-[#1a1a1a] mb-4 tracking-tighter">Acceso Reservado</h1>
            <p className="text-gray-500 text-center mb-10 text-sm font-medium">Ingresa tus credenciales para gestionar el contenido de Nutriconfianza.</p>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Email</label>
                <div className="relative">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="admin@nutriconfianza.com"
                    className="w-full bg-gray-50 border-none rounded-2xl p-5 pl-12 focus:ring-2 focus:ring-[#477d1e]/20 transition-all font-bold"
                  />
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
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
                    placeholder="••••••••"
                    className="w-full bg-gray-50 border-none rounded-2xl p-5 pl-12 focus:ring-2 focus:ring-[#477d1e]/20 transition-all font-bold"
                  />
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isLoggingIn}
                className={cn(
                  "w-full py-6 rounded-3xl font-bold transition-all shadow-xl shadow-[#477d1e]/20 flex items-center justify-center gap-3",
                  isLoggingIn ? "bg-gray-100 text-gray-400" : "bg-[#477d1e] hover:bg-[#477d1e] text-white"
                )}
              >
                {isLoggingIn ? <Loader2 className="w-5 h-5 animate-spin" /> : "Entrar al Panel"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-[#fdfdfd] animate-fade-in-up">
      <div className="mb-12 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#477d1e] bg-[#8aaa1f] px-3 py-1 rounded-full">
               Sesión Activa
            </span>
            <button 
              onClick={handleLogout}
              className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-rose-600 transition-colors flex items-center gap-1"
            >
               <LogOut className="w-3 h-3" /> Cerrar Sesión
            </button>
          </div>
          <h1 className="text-5xl font-black text-[#1a1a1a] mb-4 tracking-tighter">
            {editId ? 'Editando Contenido' : 'Panel de Creador'}
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl leading-relaxed">
            {editId ? `Estas modificando: ${title}` : 'Comparte tu conocimiento experto con la comunidad mundial de Nutriconfianza.'}
          </p>
        </div>
        {editId && (
          <button 
            onClick={cancelEdit}
            className="flex items-center gap-2 bg-rose-50 text-rose-600 px-6 py-3 rounded-2xl font-bold hover:bg-rose-100 transition-colors"
          >
            <XCircle className="w-5 h-5" /> Cancelar Edición
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-gray-100 rounded-[3rem] p-10 shadow-sm relative overflow-hidden">
            {editId && <div className="absolute top-0 left-0 w-2 h-full bg-[#477d1e]" />}
            <h2 className="flex items-center gap-3 text-2xl font-bold mb-10 text-[#1a1a1a]">
              <div className="p-2 bg-[#8aaa1f] rounded-xl">
                 {editId ? <Edit2 className="w-6 h-6 text-[#477d1e]" /> : <PlusCircle className="w-6 h-6 text-[#477d1e]" />}
              </div>
              {editId ? 'Modificar Publicación' : 'Nueva Publicación'}
            </h2>

            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Nombre del Autor/Creador</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="Ej: Nut. Juan Pérez"
                      className="w-full bg-[#f3f4f6]/50 border-none rounded-2xl p-5 pl-12 text-[#1a1a1a] font-medium placeholder:text-gray-300 focus:ring-2 focus:ring-[#477d1e]/20 transition-all font-bold"
                    />
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Título del Contenido</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ej: Guía Nutricional 2024"
                    className="w-full bg-[#f3f4f6]/50 border-none rounded-2xl p-5 text-[#1a1a1a] font-medium placeholder:text-gray-300 focus:ring-2 focus:ring-[#477d1e]/20 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Categoría</label>
                  <div className="relative">
                    <select 
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full appearance-none bg-[#f3f4f6]/50 border-none rounded-2xl p-5 text-[#1a1a1a] font-medium focus:ring-2 focus:ring-[#477d1e]/20 transition-all cursor-pointer"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Tipo de Contenido</label>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setContentType('video')}
                      className={cn(
                        "flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all group",
                        contentType === 'video' 
                          ? "bg-[#8aaa1f] border-[#477d1e] text-[#477d1e]" 
                          : "bg-gray-50 border-transparent text-gray-400 hover:bg-gray-100"
                      )}
                    >
                      <VideoIcon className="w-6 h-6" />
                      <span className="text-xs font-bold">Video</span>
                    </button>
                    <button 
                       onClick={() => setContentType('flyer')}
                       className={cn(
                        "flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all group",
                        contentType === 'flyer' 
                          ? "bg-[#8aaa1f] border-[#477d1e] text-[#477d1e]" 
                          : "bg-gray-50 border-transparent text-gray-400 hover:bg-gray-100"
                      )}
                    >
                      <FileText className="w-6 h-6" />
                      <span className="text-xs font-bold">Flyer</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Fuente del Contenido</label>
                  <div className="flex bg-gray-100 p-1 rounded-xl">
                    <button 
                      onClick={() => setUploadType('file')}
                      className={cn("px-4 py-1.5 rounded-lg text-xs font-bold transition-all", uploadType === 'file' ? "bg-white text-[#477d1e] shadow-sm" : "text-gray-400")}
                    >
                      Archivo
                    </button>
                    <button 
                      onClick={() => setUploadType('link')}
                      className={cn("px-4 py-1.5 rounded-lg text-xs font-bold transition-all", uploadType === 'link' ? "bg-white text-[#477d1e] shadow-sm" : "text-gray-400")}
                    >
                      Link Social
                    </button>
                  </div>
                </div>

                {uploadType === 'file' ? (
                  <>
                    <input 
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      className="hidden"
                      accept={contentType === 'video' ? 'video/*' : 'image/*,application/pdf'}
                    />
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className={cn(
                        "border-2 border-dashed rounded-[2.5rem] p-16 flex flex-col items-center justify-center text-center cursor-pointer transition-colors group",
                        uploadedUrl ? "border-green-500 bg-green-50/10" : "border-[#8aaa1f] hover:bg-gray-50/50"
                      )}
                    >
                       <div className={cn(
                         "w-16 h-16 rounded-3xl flex items-center justify-center mb-6 transition-transform",
                         uploadedUrl ? "bg-green-100 text-green-600" : "bg-[#8aaa1f] text-[#477d1e] group-hover:scale-110"
                       )}>
                          {isUploading ? <Loader2 className="w-8 h-8 animate-spin" /> : uploadedUrl ? <CheckCircle2 className="w-8 h-8" /> : <FileCheck className="w-8 h-8" />}
                       </div>
                       <h3 className="text-lg font-bold text-[#1a1a1a] mb-2">
                         {uploadedUrl ? "¡Archivo listo!" : "Selecciona tu archivo"}
                       </h3>
                       <p className="text-sm text-gray-400 mb-8 font-medium">MP4, PDF o JPG hasta 50MB</p>
                    </div>
                  </>
                ) : (
                  <div className="relative">
                    <input 
                      type="text"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      placeholder="Pega el link de YouTube, TikTok, Twitter o TikTok aquí..."
                      className="w-full bg-[#f3f4f6] border-2 border-[#8aaa1f] rounded-2xl p-8 text-sm focus:ring-2 focus:ring-[#2a5934]/20 transition-all outline-none"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-[#8aaa1f] rounded-xl">
                      <LinkIcon className="w-5 h-5 text-[#477d1e]" />
                    </div>
                  </div>
                )}
              </div>

              <button 
                onClick={handleSubmit}
                disabled={isUploading || (uploadType === 'file' ? !uploadedUrl : !linkUrl) || !title || !authorName}
                className={cn(
                  "w-full py-6 rounded-[2rem] font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-xl mt-4",
                  isUploading || (uploadType === 'file' ? !uploadedUrl : !linkUrl) || !title || !authorName
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-[#2a5934] hover:bg-[#477d1e] text-white hover:scale-[1.02] active:scale-[0.98] shadow-[#2a5934]/20"
                )}
              >
                {isUploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-5 h-5" />}
                {editId ? 'Actualizar Contenido' : 'Publicar Contenido'}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-[3rem] p-8 border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold mb-8 text-[#1a1a1a]">Publicaciones Recientes</h3>
            <div className="space-y-6">
              {loading ? (
                <div className="flex justify-center p-10"><Loader2 className="w-8 h-8 text-gray-300 animate-spin" /></div>
              ) : recentPosts.length === 0 ? (
                <p className="text-center text-gray-400 text-sm">No hay publicaciones.</p>
              ) : (
                recentPosts.map(post => (
                  <div 
                    key={post.id} 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      startEdit(post);
                    }}
                    className={cn(
                      "flex gap-4 items-center group cursor-pointer p-4 rounded-[2rem] border transition-all",
                      editId === post.id ? "bg-[#8aaa1f] border-[#477d1e]" : "bg-gray-50 border-transparent hover:border-[#8aaa1f]"
                    )}
                  >
                    <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-sm flex-shrink-0 bg-white flex items-center justify-center">
                      {post.content_type === 'video' ? <VideoIcon className="w-5 h-5 text-[#477d1e]" /> : <FileText className="w-5 h-5 text-[#477d1e]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-[#1a1a1a] truncate mb-0.5">{post.title}</h4>
                      <p className="text-[10px] text-gray-500 font-bold mb-1">Por: {post.author_name}</p>
                      <div className="flex items-center gap-3">
                         <span className="text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest bg-white/50 text-gray-600">
                           {post.category}
                         </span>
                         <Edit2 className="w-3 h-3 text-gray-300 group-hover:text-[#477d1e] ml-auto transition-colors" />
                         <Trash2 
                           className="w-3 h-3 text-gray-300 group-hover:text-red-500 transition-colors"
                           onClick={(e) => deletePost(post.id, e)}
                         />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
