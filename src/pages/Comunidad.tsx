import { Plus, Heart, MessageSquare, Share2, MoreHorizontal, Dumbbell, Apple, Activity, Users, Bookmark } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '../lib/utils';
import { Editor } from '../components/Editor';
import { Post } from '../types';


const INITIAL_POSTS = [
  {
    id: 1,
    user: "María G.",
    time: "Hace 2 horas",
    tag: "Diabetes",
    avatar: "bg-[#cce3d1]",
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

export function Comunidad() {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('nutriconfianza_posts');
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });

  useEffect(() => {
    localStorage.setItem('nutriconfianza_posts', JSON.stringify(posts));
  }, [posts]);

  const toggleLike = (id: string | number) => {
    setPosts(posts.map(post => {
      if (post.id === id) {
        return {
          ...post,
          liked: !post.liked,
          likes: post.liked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  const toggleSave = (id: string | number) => {
    setPosts(posts.map(post => {
      if (post.id === id) {
        return {
          ...post,
          saved: !post.saved
        };
      }
      return post;
    }));
  };

  const handleNewPost = (newPost: Post) => {
    setPosts([newPost, ...posts]);
  };

  return (
    <div className="py-8 animate-fade-in-up">
      {isEditorOpen && (
        <Editor
          onClose={() => setIsEditorOpen(false)}
          onPost={handleNewPost}
        />
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-[#1a1a1a] leading-tight mb-2 tracking-tight">
            Nuestro Espacio de<br />Bienestar
          </h1>
          <p className="text-gray-600">
            Un lugar para compartir experiencias, aprender juntos y construir<br className="hidden md:block" /> hábitos saludables con el apoyo de la comunidad.
          </p>
        </div>
        <button
          onClick={() => setIsEditorOpen(true)}
          className="bg-[#2a5934] hover:bg-[#1a4d2e] text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-green-900/10"
        >
          <Plus className="w-5 h-5" /> Nueva publicación
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full lg:w-64 flex-shrink-0 space-y-8">
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Temas Destacados</h3>
            <ul className="space-y-2">
              <li>
                <button className="w-full text-left bg-[#cce3d1] text-[#246b38] px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3">
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
          {posts.map((post) => (
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
                        post.tag === 'Diabetes' ? 'text-[#2a5934]' : post.tag === 'Obesidad' ? 'text-rose-600' : 'text-[#246b38]'
                      )}>{post.tag}</span>
                    </p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal className="w-5 h-5" /></button>
              </div>

              <p className="text-gray-700 leading-relaxed mb-6">{post.desc}</p>

              {post.img && (
                <div className="rounded-2xl overflow-hidden mb-6 max-h-[300px]">
                  <img src={post.img} alt="Post content" className="w-full h-full object-cover" />
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
          ))}
        </div>
      </div>
    </div>
  );
}
