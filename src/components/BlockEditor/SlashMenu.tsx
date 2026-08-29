import React, { useState, useEffect, useRef } from 'react';
import { 
  Heading1, 
  Heading2, 
  Heading3, 
  Pilcrow, 
  CheckSquare, 
  Quote, 
  Code, 
  Image as ImageIcon, 
  Sparkles, 
  Minus, 
  List, 
  ListOrdered, 
  Lightbulb,
  Search,
  BookOpen
} from 'lucide-react';
import { BlockType } from '../../types';

export interface SlashCommandOption {
  type: BlockType;
  title: string;
  description: string;
  icon: React.ReactNode;
  shortcut?: string;
  category: 'text' | 'format' | 'media' | 'faith';
}

const SLASH_COMMANDS: SlashCommandOption[] = [
  {
    type: 'paragraph',
    title: 'Texto / Párrafo',
    description: 'Escribe texto libre o narración estándar.',
    icon: <Pilcrow className="w-4 h-4" />,
    shortcut: 'P',
    category: 'text'
  },
  {
    type: 'heading-1',
    title: 'Título Grande (H1)',
    description: 'Encabezado de sección principal o apertura.',
    icon: <Heading1 className="w-4 h-4 text-amber-400" />,
    shortcut: '#',
    category: 'text'
  },
  {
    type: 'heading-2',
    title: 'Subtítulo Medio (H2)',
    description: 'Subtítulo temático o punto clave.',
    icon: <Heading2 className="w-4 h-4 text-sky-400" />,
    shortcut: '##',
    category: 'text'
  },
  {
    type: 'heading-3',
    title: 'Encabezado Menor (H3)',
    description: 'Título de sub-sección o nota breve.',
    icon: <Heading3 className="w-4 h-4 text-emerald-400" />,
    shortcut: '###',
    category: 'text'
  },
  {
    type: 'scripture-callout',
    title: 'Versículo Bíblico / Altar',
    description: 'Bloque sagrado con borde dorado y referencia.',
    icon: <BookOpen className="w-4 h-4 text-amber-300" />,
    shortcut: '🕊️',
    category: 'faith'
  },
  {
    type: 'todo-list',
    title: 'Lista de Tareas (Checklist)',
    description: 'Elementos interactivos con casilla de verificación.',
    icon: <CheckSquare className="w-4 h-4 text-emerald-400" />,
    shortcut: '[]',
    category: 'format'
  },
  {
    type: 'quote',
    title: 'Cita / Testimonio',
    description: 'Cita destacada con sangría y autor.',
    icon: <Quote className="w-4 h-4 text-purple-400" />,
    shortcut: '>',
    category: 'format'
  },
  {
    type: 'code',
    title: 'Bloque de Código',
    description: 'Fragmento de código con sintaxis resaltada.',
    icon: <Code className="w-4 h-4 text-cyan-400" />,
    shortcut: '```',
    category: 'format'
  },
  {
    type: 'callout',
    title: 'Nota Destacada (Callout)',
    description: 'Caja con ícono para avisos o reflexiones.',
    icon: <Lightbulb className="w-4 h-4 text-yellow-400" />,
    shortcut: '💡',
    category: 'format'
  },
  {
    type: 'bullet-list',
    title: 'Lista con Viñetas',
    description: 'Lista simple con puntos ordenados.',
    icon: <List className="w-4 h-4" />,
    shortcut: '-',
    category: 'format'
  },
  {
    type: 'numbered-list',
    title: 'Lista Numerada',
    description: 'Lista secuencial con números 1, 2, 3...',
    icon: <ListOrdered className="w-4 h-4" />,
    shortcut: '1.',
    category: 'format'
  },
  {
    type: 'image',
    title: 'Imagen / Media',
    description: 'Inserta una imagen o foto sagrada.',
    icon: <ImageIcon className="w-4 h-4 text-rose-400" />,
    shortcut: 'img',
    category: 'media'
  },
  {
    type: 'divider',
    title: 'Divisor Horizontal',
    description: 'Línea visual para separar secciones.',
    icon: <Minus className="w-4 h-4 text-slate-400" />,
    shortcut: '---',
    category: 'media'
  }
];

interface SlashMenuProps {
  position: { top: number; left: number };
  query: string;
  onSelect: (type: BlockType) => void;
  onClose: () => void;
  isDarkTheme: boolean;
}

export const SlashMenu: React.FC<SlashMenuProps> = ({
  position,
  query,
  onSelect,
  onClose,
  isDarkTheme
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const cleanQuery = query.replace(/^\//, '').toLowerCase().trim();
  const filteredCommands = SLASH_COMMANDS.filter((cmd) =>
    cmd.title.toLowerCase().includes(cleanQuery) ||
    cmd.description.toLowerCase().includes(cleanQuery) ||
    (cmd.shortcut && cmd.shortcut.toLowerCase().includes(cleanQuery))
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [cleanQuery]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          onSelect(filteredCommands[selectedIndex].type);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, filteredCommands, onSelect, onClose]);

  if (filteredCommands.length === 0) {
    return (
      <div
        style={{ top: `${position.top}px`, left: `${position.left}px` }}
        className={`fixed z-50 p-3 rounded-2xl shadow-2xl border text-xs ${
          isDarkTheme ? 'bg-slate-900 border-white/10 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
        }`}
      >
        No se encontraron bloques para "{cleanQuery}"
      </div>
    );
  }

  return (
    <div
      ref={menuRef}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`
      }}
      className={`fixed z-50 w-72 max-h-80 overflow-y-auto rounded-2xl shadow-2xl backdrop-blur-xl border p-1.5 scrollbar-thin animate-in fade-in zoom-in-95 duration-100 ${
        isDarkTheme
          ? 'bg-slate-950/95 border-amber-400/30 text-slate-200 shadow-[0_15px_40px_rgba(0,0,0,0.8)]'
          : 'bg-white/95 border-slate-200 text-slate-800 shadow-2xl'
      }`}
    >
      <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-400/90 border-b border-white/5 flex items-center justify-between">
        <span>Insertar Bloque</span>
        <span className="text-slate-500 font-mono text-[9px]">↑ ↓ para navegar</span>
      </div>

      <div className="py-1 space-y-0.5">
        {filteredCommands.map((cmd, idx) => {
          const isSelected = idx === selectedIndex;
          return (
            <button
              key={cmd.type + idx}
              type="button"
              onMouseEnter={() => setSelectedIndex(idx)}
              onClick={() => onSelect(cmd.type)}
              className={`w-full p-2 rounded-xl flex items-start gap-2.5 text-left transition-colors cursor-pointer ${
                isSelected
                  ? isDarkTheme 
                    ? 'bg-amber-400/15 text-amber-300 border border-amber-400/30' 
                    : 'bg-amber-50 text-amber-900 border border-amber-200'
                  : 'hover:bg-white/5 border border-transparent'
              }`}
            >
              <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                isDarkTheme ? 'bg-slate-900 border border-white/10' : 'bg-slate-100 border border-slate-200'
              }`}>
                {cmd.icon}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold truncate">{cmd.title}</span>
                  {cmd.shortcut && (
                    <span className="text-[10px] font-mono opacity-50 px-1 rounded bg-black/20">
                      {cmd.shortcut}
                    </span>
                  )}
                </div>
                <p className={`text-[11px] truncate mt-0.5 ${isDarkTheme ? 'text-slate-400' : 'text-slate-500'}`}>
                  {cmd.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
