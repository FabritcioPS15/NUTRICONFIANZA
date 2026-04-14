import { Plus, Heart, MessageSquare, Share2, MoreHorizontal, Dumbbell, Apple, Activity, Users, Bookmark, Loader2, LogIn, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '../lib/utils';
import { Editor } from '../components/ui/Editor';
import { Post } from '../types';
import { supabase } from '../lib/supabase/client';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';


const INITIAL_POSTS = [
  {
    id: 1,
    user: "María G.",
    time: "Hace 2 horas",
    tag: "Diabetes",
    avatar: "bg-[#8aaa1f]",
    desc: "¡Hola a todos! Acabo de probar una receta de pan integral con semillas que no me disparó el azúcar. ¿Alguien más tiene trucos para desayunos lentos?",
    img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800",
    likes: 24,
    comments: 8,
    liked: false,
    saved: false
  },
  {
    id: 2,
    user: "Roberto S.",
    time: "Hace 5 horas",
    tag: "Obesidad",
    avatar: "bg-[#ffccd5]",
    desc: "Hoy completé mi primer paseo de 30 minutos sin cansarme demasiado. Es un pequeño paso, pero me siento increíble. ¡Gracias por el apoyo del grupo!",
    likes: 56,
    comments: 12,
    liked: false,
    saved: false
  },
  {
    id: 3,
    user: "Elena V.",
    time: "Hace 8 horas",
    tag: "Hipertensión",
    avatar: "bg-[#ccf0d4]",
    desc: "¿Cómo manejan el consumo de sal en eventos familiares? Me cuesta mucho decir que no cuando todos están comiendo snacks procesados. ¿Tienen alguna estrategia que no parezca grosera?",
    likes: 15,
    comments: 21,
    liked: false,
    saved: false
  }
];

const getEmbedUrl = (url: string) => {
  if (url.includes('youtube.com/watch?v=')) return url.replace('watch?v=', 'embed/');
  if (url.includes('youtu.be/')) return url.replace('youtu.be/', 'youtube.com/embed/');
  return url;
};

const isIframeable = (url: string) => {
  if (!url) return false;
  return url.includes('youtube.com') || url.includes('youtu.be') || url.includes('tiktok.com');
};

export function Comunidad() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const isSuperAdmin = user?.role === 'super_admin';

  // Fetch posts from Supabase on mount
  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          // Fetch user's likes and saved posts
          let userLikedPostIds: string[] = [];
          let userSavedPostIds: string[] = [];

          if (user?.id) {
            const [likesData, savedData] = await Promise.all([
              supabase.from('post_likes').select('post_id').eq('user_id', user.id),
              supabase.from('saved_posts').select('post_id').eq('user_id', user.id)
            ]);

            if (likesData.data) {
              userLikedPostIds = likesData.data.map(l => l.post_id);
            }
            if (savedData.data) {
              userSavedPostIds = savedData.data.map(s => s.post_id);
            }
          }

          // Map DB fields to our Post interface
          const mappedPosts: Post[] = data.map(p => ({
            id: p.id,
            user: p.user_name || "Usuario Invitado",
            time: new Date(p.created_at).toLocaleString(),
            tag: p.tag || "General",
            avatar: p.avatar_style || "bg-gray-200",
            desc: p.description || "",
            img: p.media_url,
            mediaType: p.media_type as 'image' | 'video',
            likes: p.likes_count || 0,
            comments: p.comments_count || 0,
            liked: userLikedPostIds.includes(p.id),
            saved: userSavedPostIds.includes(p.id)
          }));
          setPosts(mappedPosts);
        } else {
          setPosts(INITIAL_POSTS);
        }
      } catch (err) {
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [user?.id]);

  const toggleLike = async (id: string | number) => {
    if (!user?.id) return;

    const post = posts.find(p => p.id === id);
    if (!post) return;

    try {
      if (post.liked) {
        // Remove like from DB
        await supabase
          .from('post_likes')
          .delete()
          .eq('user_id', user.id)
          .eq('post_id', id);

        // Decrement likes count in posts table
        await supabase
          .from('posts')
          .update({ likes_count: Math.max(0, post.likes - 1) })
          .eq('id', id);
      } else {
        // Add like to DB
        await supabase
          .from('post_likes')
          .insert([{ user_id: user.id, post_id: id }]);

        // Increment likes count in posts table
        await supabase
          .from('posts')
          .update({ likes_count: post.likes + 1 })
          .eq('id', id);
      }

      // Update local state
      setPosts(posts.map(p => {
        if (p.id === id) {
          return {
            ...p,
            liked: !p.liked,
            likes: p.liked ? p.likes - 1 : p.likes + 1
          };
        }
        return p;
      }));
    } catch (error) {
      alert('Error al dar like');
    }
  };

  const toggleSave = async (id: string | number) => {
    if (!user?.id) return;

    const post = posts.find(p => p.id === id);
    if (!post) return;

    try {
      if (post.saved) {
        // Remove saved post from DB
        await supabase
          .from('saved_posts')
          .delete()
          .eq('user_id', user.id)
          .eq('post_id', id);
      } else {
        // Add saved post to DB
        await supabase
          .from('saved_posts')
          .insert([{ user_id: user.id, post_id: id }]);
      }

      // Update local state
      setPosts(posts.map(p => {
        if (p.id === id) {
          return {
            ...p,
            saved: !p.saved
          };
        }
        return p;
      }));
    } catch (error) {
      alert('Error al guardar');
    }
  };

  const handleNewPost = async (newPost: Post) => {
    // Insert into Supabase
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([{
          user_id: user?.id,
          user_name: newPost.user,
          avatar_style: newPost.avatar,
          tag: newPost.tag,
          description: newPost.desc,
          media_url: newPost.img,
          media_type: newPost.mediaType,
          likes_count: newPost.likes,
          comments_count: newPost.comments
        }])
        .select()
        .single();

      if (error) throw error;

      // Update local state with the post from DB (includes the generated ID)
      if (data) {
        const mappedPost: Post = {
          id: data.id,
          user: data.user_name || "Usuario Invitado",
          time: new Date(data.created_at).toLocaleString(),
          tag: data.tag || "General",
          avatar: data.avatar_style || "bg-gray-200",
          desc: data.description || "",
          img: data.media_url,
          mediaType: data.media_type as 'image' | 'video',
          likes: data.likes_count || 0,
          comments: data.comments_count || 0,
          liked: false,
          saved: false
        };
        setPosts([mappedPost, ...posts]);
      }
    } catch (err) {
      alert('Error al publicar');
    }
  };

  const handleDeletePost = async (postId: string | number) => {
    if (!isSuperAdmin) return;
    
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      // Remove from local state
      setPosts(posts.filter(post => post.id !== postId));
    } catch (error) {
      alert('Error al eliminar la publicación');
    }
  };

  return (
    <div className="py-8 animate-fade-in-up">
      {isEditorOpen && (
        <Editor
          onClose={() => setIsEditorOpen(false)}
          onPost={handleNewPost}
        />
      )}

      {/* ... (rest of the UI remains the same) ... */}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-7xl font-black text-[#1a1a1a] leading-tight mb-4 tracking-tighter">
            Nuestro Espacio de<br className="hidden md:block" /> Bienestar
          </h1>
          <p className="text-gray-500 font-medium leading-relaxed">
            Un lugar para compartir experiencias, aprender juntos y construir<br className="hidden md:block" /> hábitos saludables con el apoyo de la comunidad.
          </p>
        </div>
        {user ? (
          <button
            onClick={() => setIsEditorOpen(true)}
            className="w-full md:w-auto bg-[#477d1e] hover:bg-[#477d1e] text-white px-8 py-5 rounded-[2rem] font-bold flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-[#477d1e]/20"
          >
            <Plus className="w-6 h-6" /> Nueva publicación
          </button>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="w-full md:w-auto bg-[#8aaa1f] hover:bg-[#8aaa1f] text-[#477d1e] px-8 py-5 rounded-[2rem] font-bold flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-[#477d1e]/20"
          >
            <LogIn className="w-6 h-6" /> Inicia sesión para publicar
          </button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full lg:w-64 flex-shrink-0 space-y-8">
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Temas Destacados</h3>
            <ul className="space-y-2">
              <li>
                <button className="w-full text-left bg-[#8aaa1f] text-[#477d1e] px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3">
                  <Activity className="w-4 h-4" /> Diabetes
                </button>
              </li>
              <li>
                <button className="w-full text-left hover:bg-gray-50 text-gray-700 px-4 py-3 rounded-xl font-medium text-sm transition-colors flex items-center gap-3">
                  <Heart className="w-4 h-4" /> Hipertensión
                </button>
              </li>
              <li>
                <button className="w-full text-left hover:bg-gray-50 text-gray-700 px-4 py-3 rounded-xl font-medium text-sm transition-colors flex items-center gap-3">
                  <Dumbbell className="w-4 h-4" /> Obesidad
                </button>
              </li>
              <li>
                <button className="w-full text-left hover:bg-gray-50 text-gray-700 px-4 py-3 rounded-xl font-medium text-sm transition-colors flex items-center gap-3">
                  <Apple className="w-4 h-4" /> Alimentación General
                </button>
              </li>
            </ul>
          </div>

          <div className="bg-[#f5f5f5] rounded-3xl p-6 flex flex-col items-center justify-center text-center">
            <h3 className="font-bold text-[#1a1a1a] mb-6">Meta Semanal</h3>
            <div className="relative w-32 h-32 flex items-center justify-center mb-4">
              <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="56" stroke="#e5e7eb" strokeWidth="12" fill="none" />
                <circle cx="64" cy="64" r="56" stroke="#2a5934" strokeWidth="12" fill="none" strokeDasharray="351.8" strokeDashoffset="87.9" strokeLinecap="round" />
              </svg>
              <span className="text-3xl font-bold text-[#2a5934] relative z-10">75%</span>
            </div>
            <p className="text-xs text-gray-500 font-medium">Comunidad activa hoy</p>
          </div>
        </div>

        {/* Feed */}
        <div className="flex-1 space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-10 h-10 text-[#477d1e] animate-spin" />
              <p className="text-gray-500 font-medium animate-pulse">Cargando comunidad...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
              <p className="text-gray-400 font-medium">No hay publicaciones aún. ¡Sé el primero!</p>
            </div>
          ) : (
            posts.map((post) => (
            <div key={post.id} className="bg-white border border-gray-100 rounded-[2rem] p-6 md:p-8 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${post.avatar} flex items-center justify-center`}>
                    <Users className="w-5 h-5 text-black/40" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1a1a1a] text-sm">{post.user}</h4>
                    <p className="text-xs text-gray-400">
                      {post.time} • <span className={cn(
                        "font-semibold",
                        post.tag === 'Diabetes' ? 'text-[#2a5934]' : post.tag === 'Obesidad' ? 'text-rose-600' : 'text-[#477d1e]'
                      )}>{post.tag}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isSuperAdmin && (
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                      title="Eliminar publicación"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal className="w-5 h-5" /></button>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed mb-6">{post.desc}</p>

              {post.img && (
                <div className="rounded-2xl overflow-hidden mb-6 bg-gray-50 flex items-center justify-center aspect-video">
                  {isIframeable(post.img) ? (
                    <iframe
                      src={getEmbedUrl(post.img)}
                      className="w-full h-full border-none"
                      allowFullScreen
                    />
                  ) : post.mediaType === 'video' ? (
                    <video 
                      src={post.img} 
                      controls 
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <img 
                      src={post.img} 
                      alt="Post content" 
                      className="w-full h-full object-cover" 
                    />
                  )}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-gray-50">
                <button
                  onClick={() => toggleLike(post.id)}
                  className={cn("flex items-center gap-2 text-sm font-bold transition-colors", post.liked ? "text-rose-600" : "text-gray-600 hover:text-rose-600")}
                >
                  <Heart className={cn("w-4 h-4", post.liked ? "fill-current" : "")} /> {post.likes} Me gusta
                </button>
                <button className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-[#2a5934] transition-colors">
                  <MessageSquare className="w-4 h-4" /> Comentar
                </button>
                <div className="flex items-center gap-4 ml-auto">
                  <button
                    onClick={() => toggleSave(post.id)}
                    className={cn("flex items-center gap-2 text-sm font-bold transition-colors", post.saved ? "text-[#2a5934]" : "text-gray-600 hover:text-[#2a5934]")}
                  >
                    <Bookmark className={cn("w-4 h-4", post.saved ? "fill-current" : "")} /> Guardar
                  </button>
                  <button className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors">
                    <Share2 className="w-4 h-4" /> Compartir
                  </button>
                </div>
              </div>
            </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
