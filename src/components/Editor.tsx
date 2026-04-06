import { X, Image as ImageIcon, Send, Smile, Paperclip } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/utils';
import { Post } from '../types';

interface EditorProps {
  onClose: () => void;
  onPost: (content: Post) => void;
}

export function Editor({ onClose, onPost }: EditorProps) {
  const [text, setText] = useState('');
  const [selectedTag, setSelectedTag] = useState('Diabetes');
  const tags = ['Diabetes', 'Hipertensión', 'Obesidad', 'General'];

  const handleSubmit = () => {
    if (!text.trim()) return;
    
    const newPost = {
      id: Date.now(),
      user: "Usuario Invitado",
      time: "Ahora mismo",
      tag: selectedTag,
      avatar: "bg-gray-200",
      desc: text,
      likes: 0,
      comments: 0,
      liked: false,
      saved: false
    };

    onPost(newPost);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-[#1a1a1a]">Nueva publicación</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#cce3d1] flex items-center justify-center">
              <span className="text-[#246b38] font-bold text-xs">UX</span>
            </div>
            <div>
               <p className="text-sm font-bold text-[#1a1a1a]">Usuario Invitado</p>
               <div className="flex gap-2 mt-1">
                 {tags.map(tag => (
                   <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider transition-colors",
                      selectedTag === tag ? "bg-[#246b38] text-white" : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                    )}
                   >
                     {tag}
                   </button>
                 ))}
               </div>
            </div>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="¿Qué quieres compartir hoy con la comunidad?"
            className="w-full min-h-[150px] text-gray-700 text-lg resize-none border-none focus:ring-0 placeholder:text-gray-300"
          />

          <div className="flex items-center gap-4 pt-4 border-t border-gray-50">
            <button className="text-gray-400 hover:text-[#246b38] transition-colors p-2 hover:bg-gray-50 rounded-lg">
              <ImageIcon className="w-5 h-5" />
            </button>
            <button className="text-gray-400 hover:text-[#246b38] transition-colors p-2 hover:bg-gray-50 rounded-lg">
              <Paperclip className="w-5 h-5" />
            </button>
            <button className="text-gray-400 hover:text-[#246b38] transition-colors p-2 hover:bg-gray-50 rounded-lg">
              <Smile className="w-5 h-5" />
            </button>
            
            <button 
              onClick={handleSubmit}
              disabled={!text.trim()}
              className={cn(
                "ml-auto flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all",
                text.trim() 
                  ? "bg-[#246b38] text-white shadow-lg shadow-green-900/20 hover:scale-105 active:scale-95" 
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              )}
            >
              Publicar <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
