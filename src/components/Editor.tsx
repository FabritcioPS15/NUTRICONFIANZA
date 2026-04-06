import { X, Image as ImageIcon, Send, Smile, Paperclip, Loader2, Play } from 'lucide-react';
import { useState, useRef } from 'react';
import { cn } from '../lib/utils';
import { Post } from '../types';
import { supabase } from '../lib/supabase';

interface EditorProps {
  onClose: () => void;
  onPost: (content: Post) => void;
}

export function Editor({ onClose, onPost }: EditorProps) {
  const [text, setText] = useState('');
  const [selectedTag, setSelectedTag] = useState('Diabetes');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'image' | 'video' | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const tags = ['Diabetes', 'Hipertensión', 'Obesidad', 'General'];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('Publicaciones')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('Publicaciones')
        .getPublicUrl(filePath);

      setUploadedUrl(publicUrl);
      setFileType(file.type.startsWith('video/') ? 'video' : 'image');

    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error al subir el archivo. Por favor, intenta de nuevo.');
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = () => {
    setUploadedUrl(null);
    setFileType(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = () => {
    if (!text.trim() && !uploadedUrl) return;
    
    const newPost: Post = {
      id: Date.now(),
      user: "Usuario Invitado",
      time: "Ahora mismo",
      tag: selectedTag,
      avatar: "bg-gray-200",
      desc: text,
      img: uploadedUrl || undefined,
      mediaType: fileType || undefined,
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
        <div className="p-8 space-y-6 max-h-[80vh] overflow-y-auto">
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
            className="w-full min-h-[100px] text-gray-700 text-lg resize-none border-none focus:ring-0 placeholder:text-gray-300"
          />

          {/* Preview Area */}
          {(isUploading || uploadedUrl) && (
            <div className="relative rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 min-h-[200px] flex items-center justify-center">
              {isUploading ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-8 h-8 text-[#246b38] animate-spin" />
                  <p className="text-sm text-gray-500 font-medium">Subiendo archivo...</p>
                </div>
              ) : uploadedUrl && (
                <>
                  {fileType === 'video' ? (
                    <div className="relative w-full aspect-video">
                      <video 
                        src={uploadedUrl} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <Play className="w-12 h-12 text-white fill-white opacity-80" />
                      </div>
                    </div>
                  ) : (
                    <img 
                      src={uploadedUrl} 
                      alt="Preview" 
                      className="w-full h-auto max-h-[300px] object-contain"
                    />
                  )}
                  <button
                    onClick={removeFile}
                    className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors backdrop-blur-sm"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          )}

          <div className="flex items-center gap-4 pt-4 border-t border-gray-50">
            <input 
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept="image/*,video/*"
            />
            
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="text-gray-400 hover:text-[#246b38] transition-colors p-2 hover:bg-gray-50 rounded-lg disabled:opacity-50"
            >
              <ImageIcon className="w-5 h-5" />
            </button>
            <button 
              onClick={() => {
                const url = prompt('Ingresa el link de YouTube, TikTok o imagen:');
                if (url) {
                  setUploadedUrl(url);
                  setFileType('video'); // Default to video for links (the iframe handler will manage it)
                }
              }}
              className="text-gray-400 hover:text-[#246b38] transition-colors p-2 hover:bg-gray-50 rounded-lg"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            <button className="text-gray-400 hover:text-[#246b38] transition-colors p-2 hover:bg-gray-50 rounded-lg">
              <Smile className="w-5 h-5" />
            </button>
            
            <button 
              onClick={handleSubmit}
              disabled={(!text.trim() && !uploadedUrl) || isUploading}
              className={cn(
                "ml-auto flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all",
                (text.trim() || uploadedUrl) && !isUploading
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
