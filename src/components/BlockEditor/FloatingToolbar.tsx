import React from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  Code, 
  Link as LinkIcon, 
  Highlighter, 
  Sparkles,
  Heading1,
  Heading2,
  List
} from 'lucide-react';

interface FloatingToolbarProps {
  position: { top: number; left: number } | null;
  onApplyFormat: (format: 'bold' | 'italic' | 'underline' | 'strike' | 'code' | 'highlight' | 'link') => void;
  isDarkTheme: boolean;
}

export const FloatingToolbar: React.FC<FloatingToolbarProps> = ({
  position,
  onApplyFormat,
  isDarkTheme
}) => {
  if (!position) return null;

  return (
    <div
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: 'translate(-50%, -100%)'
      }}
      className={`fixed z-50 mb-2 flex items-center gap-0.5 p-1 rounded-xl shadow-2xl backdrop-blur-xl border animate-in fade-in zoom-in-95 duration-150 ${
        isDarkTheme
          ? 'bg-slate-900/95 border-amber-400/30 text-slate-200 shadow-[0_10px_30px_rgba(0,0,0,0.8)]'
          : 'bg-white/95 border-slate-200 text-slate-800 shadow-xl'
      }`}
      onMouseDown={(e) => {
        // Prevent loss of selection
        e.preventDefault();
      }}
    >
      <button
        type="button"
        onClick={() => onApplyFormat('bold')}
        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
          isDarkTheme ? 'hover:bg-white/10 hover:text-amber-300' : 'hover:bg-slate-100 hover:text-slate-900'
        }`}
        title="Negrita (Ctrl+B)"
      >
        <Bold className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        onClick={() => onApplyFormat('italic')}
        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
          isDarkTheme ? 'hover:bg-white/10 hover:text-amber-300' : 'hover:bg-slate-100 hover:text-slate-900'
        }`}
        title="Cursiva (Ctrl+I)"
      >
        <Italic className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        onClick={() => onApplyFormat('underline')}
        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
          isDarkTheme ? 'hover:bg-white/10 hover:text-amber-300' : 'hover:bg-slate-100 hover:text-slate-900'
        }`}
        title="Subrayado (Ctrl+U)"
      >
        <Underline className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        onClick={() => onApplyFormat('strike')}
        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
          isDarkTheme ? 'hover:bg-white/10 hover:text-amber-300' : 'hover:bg-slate-100 hover:text-slate-900'
        }`}
        title="Tachado"
      >
        <Strikethrough className="w-3.5 h-3.5" />
      </button>

      <div className={`w-[1px] h-4 mx-0.5 ${isDarkTheme ? 'bg-white/10' : 'bg-slate-200'}`} />

      <button
        type="button"
        onClick={() => onApplyFormat('code')}
        className={`p-1.5 rounded-lg transition-colors cursor-pointer font-mono text-xs ${
          isDarkTheme ? 'hover:bg-white/10 hover:text-amber-300' : 'hover:bg-slate-100 hover:text-slate-900'
        }`}
        title="Código en línea"
      >
        <Code className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        onClick={() => onApplyFormat('highlight')}
        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
          isDarkTheme ? 'hover:bg-amber-400/20 text-amber-300' : 'hover:bg-amber-100 text-amber-600'
        }`}
        title="Resaltador dorado"
      >
        <Highlighter className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        onClick={() => onApplyFormat('link')}
        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
          isDarkTheme ? 'hover:bg-white/10 hover:text-sky-300' : 'hover:bg-slate-100 hover:text-sky-600'
        }`}
        title="Insertar enlace"
      >
        <LinkIcon className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
