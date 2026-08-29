import React, { useRef, useEffect } from 'react';
import { 
  GripVertical, 
  Plus, 
  Trash2, 
  Copy, 
  ArrowUp, 
  ArrowDown, 
  CheckSquare, 
  Square, 
  Image as ImageIcon,
  Quote, 
  Code, 
  Sparkles,
  BookOpen,
  Lightbulb,
  Upload,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { BlockItem, BlockType } from '../../types';

interface BlockItemRendererProps {
  block: BlockItem;
  index: number;
  totalBlocks: number;
  isSelected: boolean;
  isDarkTheme: boolean;
  onUpdate: (id: string, updates: Partial<BlockItem>) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onInsertBelow: (index: number, type?: BlockType) => void;
  onSlashTrigger: (blockId: string, position: { top: number; left: number }, query: string) => void;
  onSlashClose: () => void;
  onSelectionChange: (e: React.SyntheticEvent) => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
}

export const BlockItemRenderer: React.FC<BlockItemRendererProps> = ({
  block,
  index,
  totalBlocks,
  isSelected,
  isDarkTheme,
  onUpdate,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  onInsertBelow,
  onSlashTrigger,
  onSlashClose,
  onSelectionChange,
  onDragStart,
  onDragOver,
  onDrop
}) => {
  const contentRef = useRef<HTMLDivElement | null>(null);

  // Sync content with div if external changes happen
  useEffect(() => {
    if (contentRef.current && contentRef.current.innerText !== (block.content || '')) {
      contentRef.current.innerText = block.content || '';
    }
  }, [block.content]);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const text = e.currentTarget.innerText;
    onUpdate(block.id, { content: text });

    // Check for slash command
    if (text.startsWith('/')) {
      const rect = e.currentTarget.getBoundingClientRect();
      onSlashTrigger(block.id, {
        top: rect.bottom + window.scrollY + 6,
        left: rect.left + window.scrollX
      }, text);
    } else {
      onSlashClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      if (block.type !== 'code') {
        e.preventDefault();
        onInsertBelow(index, block.type === 'todo-list' ? 'todo-list' : 'paragraph');
      }
    } else if (e.key === 'Backspace' && !block.content && totalBlocks > 1) {
      e.preventDefault();
      onDelete(block.id);
    }
  };

  const getPlaceholder = (type: BlockType): string => {
    switch (type) {
      case 'heading-1':
        return 'Título Principal... (Escribe "/" para comandos)';
      case 'heading-2':
        return 'Subtítulo...';
      case 'heading-3':
        return 'Encabezado menor...';
      case 'paragraph':
        return 'Escribe texto o pulsa "/" para insertar bloques...';
      case 'quote':
        return 'Escribe una cita inspiradora o testimonio...';
      case 'scripture-callout':
        return 'Escribe el versículo bíblico o promesa de Dios...';
      case 'todo-list':
        return 'Nueva tarea o punto devocional...';
      case 'code':
        return '// Escribe o pega código aquí...';
      case 'callout':
        return 'Escribe una reflexión o aviso importante...';
      default:
        return 'Escribe aquí...';
    }
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDrop={(e) => onDrop(e, index)}
      className={`group relative flex items-start gap-1 py-1 px-2 rounded-2xl transition-all ${
        isSelected 
          ? isDarkTheme ? 'bg-amber-400/5 ring-1 ring-amber-400/20' : 'bg-amber-50/50 ring-1 ring-amber-200' 
          : 'hover:bg-black/5 dark:hover:bg-white/[0.02]'
      }`}
    >
      {/* Left Block Controls (Grip + Inserter + Actions) */}
      <div className="opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity flex items-center gap-0.5 pt-1.5 -ml-1 shrink-0 select-none">
        
        {/* Quick Inserter (+) */}
        <button
          type="button"
          onClick={() => onInsertBelow(index, 'paragraph')}
          className={`p-1 rounded-lg transition-colors cursor-pointer ${
            isDarkTheme ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'
          }`}
          title="Insertar bloque debajo"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>

        {/* Drag Handle (⋮⋮) */}
        <div
          className={`p-1 rounded-lg cursor-grab active:cursor-grabbing transition-colors ${
            isDarkTheme ? 'text-slate-500 hover:text-slate-300 hover:bg-white/10' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
          }`}
          title="Arrastra para reordenar"
        >
          <GripVertical className="w-3.5 h-3.5" />
        </div>

        {/* Move Up / Down */}
        <div className="hidden sm:flex items-center">
          {index > 0 && (
            <button
              type="button"
              onClick={() => onMoveUp(index)}
              className={`p-1 rounded transition-colors ${
                isDarkTheme ? 'text-slate-500 hover:text-slate-200' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Mover arriba"
            >
              <ArrowUp className="w-3 h-3" />
            </button>
          )}
          {index < totalBlocks - 1 && (
            <button
              type="button"
              onClick={() => onMoveDown(index)}
              className={`p-1 rounded transition-colors ${
                isDarkTheme ? 'text-slate-500 hover:text-slate-200' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Mover abajo"
            >
              <ArrowDown className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Block Content Canvas */}
      <div className="flex-1 min-w-0 py-0.5">
        
        {/* HEADING 1 */}
        {block.type === 'heading-1' && (
          <div
            ref={contentRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onSelect={onSelectionChange}
            data-placeholder={getPlaceholder(block.type)}
            className={`outline-none text-2xl sm:text-3xl font-extrabold tracking-tight font-cinzel leading-tight ${
              isDarkTheme ? 'text-white' : 'text-slate-900'
            } empty:before:content-[attr(data-placeholder)] empty:before:text-slate-500/50 empty:before:pointer-events-none`}
          />
        )}

        {/* HEADING 2 */}
        {block.type === 'heading-2' && (
          <div
            ref={contentRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onSelect={onSelectionChange}
            data-placeholder={getPlaceholder(block.type)}
            className={`outline-none text-xl sm:text-2xl font-bold font-cinzel leading-snug ${
              isDarkTheme ? 'text-amber-300' : 'text-amber-900'
            } empty:before:content-[attr(data-placeholder)] empty:before:text-slate-500/50 empty:before:pointer-events-none`}
          />
        )}

        {/* HEADING 3 */}
        {block.type === 'heading-3' && (
          <div
            ref={contentRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onSelect={onSelectionChange}
            data-placeholder={getPlaceholder(block.type)}
            className={`outline-none text-base sm:text-lg font-bold leading-snug ${
              isDarkTheme ? 'text-sky-300' : 'text-slate-800'
            } empty:before:content-[attr(data-placeholder)] empty:before:text-slate-500/50 empty:before:pointer-events-none`}
          />
        )}

        {/* PARAGRAPH */}
        {block.type === 'paragraph' && (
          <div
            ref={contentRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onSelect={onSelectionChange}
            data-placeholder={getPlaceholder(block.type)}
            className={`outline-none text-sm sm:text-base leading-relaxed ${
              isDarkTheme ? 'text-slate-200' : 'text-slate-700'
            } empty:before:content-[attr(data-placeholder)] empty:before:text-slate-500/50 empty:before:pointer-events-none`}
          />
        )}

        {/* SCRIPTURE CALLOUT (FAITH BLOCK) */}
        {block.type === 'scripture-callout' && (
          <div className={`p-4 rounded-2xl border transition-all ${
            isDarkTheme 
              ? 'bg-amber-500/10 border-amber-400/30 text-amber-100 shadow-[0_0_20px_rgba(245,158,11,0.08)]' 
              : 'bg-amber-50 border-amber-300 text-amber-950'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 font-cinzel">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Palabra Sagrada & Versículo</span>
              </span>
              <input
                type="text"
                value={block.caption || ''}
                onChange={(e) => onUpdate(block.id, { caption: e.target.value })}
                placeholder="Ej: Salmos 91:1-2"
                className={`text-xs font-bold px-2 py-0.5 rounded-lg border outline-none ${
                  isDarkTheme 
                    ? 'bg-slate-950/60 border-amber-400/30 text-amber-300' 
                    : 'bg-white border-amber-200 text-amber-900'
                }`}
              />
            </div>
            <div
              ref={contentRef}
              contentEditable
              suppressContentEditableWarning
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              onSelect={onSelectionChange}
              data-placeholder={getPlaceholder(block.type)}
              className="outline-none text-sm sm:text-base italic font-serif leading-relaxed empty:before:content-[attr(data-placeholder)] empty:before:text-amber-400/50 empty:before:pointer-events-none"
            />
          </div>
        )}

        {/* CHECKLIST / TODO-LIST */}
        {block.type === 'todo-list' && (
          <div className="flex items-start gap-2.5">
            <button
              type="button"
              onClick={() => onUpdate(block.id, { checked: !block.checked })}
              className={`mt-0.5 p-0.5 rounded transition-colors cursor-pointer ${
                block.checked 
                  ? 'text-amber-400' 
                  : isDarkTheme ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {block.checked ? (
                <CheckSquare className="w-4 h-4 text-emerald-400" />
              ) : (
                <Square className="w-4 h-4" />
              )}
            </button>
            <div
              ref={contentRef}
              contentEditable
              suppressContentEditableWarning
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              onSelect={onSelectionChange}
              data-placeholder={getPlaceholder(block.type)}
              className={`flex-1 outline-none text-sm sm:text-base leading-relaxed transition-all ${
                block.checked 
                  ? 'line-through opacity-50' 
                  : isDarkTheme ? 'text-slate-200' : 'text-slate-700'
              } empty:before:content-[attr(data-placeholder)] empty:before:text-slate-500/50 empty:before:pointer-events-none`}
            />
          </div>
        )}

        {/* BLOCKQUOTE */}
        {block.type === 'quote' && (
          <div className="pl-4 border-l-4 border-amber-400 my-1 space-y-1">
            <div
              ref={contentRef}
              contentEditable
              suppressContentEditableWarning
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              onSelect={onSelectionChange}
              data-placeholder={getPlaceholder(block.type)}
              className={`outline-none text-sm sm:text-base italic leading-relaxed ${
                isDarkTheme ? 'text-slate-200' : 'text-slate-700'
              } empty:before:content-[attr(data-placeholder)] empty:before:text-slate-500/50 empty:before:pointer-events-none`}
            />
            <input
              type="text"
              value={block.caption || ''}
              onChange={(e) => onUpdate(block.id, { caption: e.target.value })}
              placeholder="— Autor / Referencia (opcional)"
              className={`text-xs outline-none bg-transparent ${
                isDarkTheme ? 'text-slate-400 placeholder:text-slate-600' : 'text-slate-500 placeholder:text-slate-400'
              }`}
            />
          </div>
        )}

        {/* CODE BLOCK */}
        {block.type === 'code' && (
          <div className={`rounded-2xl border p-3 font-mono text-xs overflow-hidden ${
            isDarkTheme ? 'bg-slate-950 border-white/10 text-cyan-300' : 'bg-slate-900 border-slate-700 text-cyan-200'
          }`}>
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <Code className="w-3 h-3 text-cyan-400" />
                <span>{block.language || 'typescript'}</span>
              </span>
              <select
                value={block.language || 'typescript'}
                onChange={(e) => onUpdate(block.id, { language: e.target.value })}
                className="bg-transparent text-slate-400 outline-none text-[10px] cursor-pointer"
              >
                <option value="typescript">TypeScript</option>
                <option value="javascript">JavaScript</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="json">JSON</option>
                <option value="python">Python</option>
              </select>
            </div>
            <div
              ref={contentRef}
              contentEditable
              suppressContentEditableWarning
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              data-placeholder={getPlaceholder(block.type)}
              className="outline-none whitespace-pre-wrap font-mono leading-relaxed empty:before:content-[attr(data-placeholder)] empty:before:text-slate-600 empty:before:pointer-events-none"
            />
          </div>
        )}

        {/* CALLOUT NOTE */}
        {block.type === 'callout' && (
          <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
            isDarkTheme 
              ? 'bg-sky-500/10 border-sky-400/30 text-sky-100' 
              : 'bg-sky-50 border-sky-200 text-sky-900'
          }`}>
            <span className="text-xl shrink-0 mt-0.5">{block.calloutIcon || '💡'}</span>
            <div
              ref={contentRef}
              contentEditable
              suppressContentEditableWarning
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              onSelect={onSelectionChange}
              data-placeholder={getPlaceholder(block.type)}
              className="flex-1 outline-none text-sm leading-relaxed empty:before:content-[attr(data-placeholder)] empty:before:text-sky-400/50 empty:before:pointer-events-none"
            />
          </div>
        )}

        {/* BULLET LIST */}
        {block.type === 'bullet-list' && (
          <div className="flex items-start gap-2.5">
            <span className="text-base leading-none mt-1 select-none text-amber-400">•</span>
            <div
              ref={contentRef}
              contentEditable
              suppressContentEditableWarning
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              onSelect={onSelectionChange}
              data-placeholder="Elemento de lista..."
              className={`flex-1 outline-none text-sm sm:text-base leading-relaxed ${
                isDarkTheme ? 'text-slate-200' : 'text-slate-700'
              } empty:before:content-[attr(data-placeholder)] empty:before:text-slate-500/50 empty:before:pointer-events-none`}
            />
          </div>
        )}

        {/* NUMBERED LIST */}
        {block.type === 'numbered-list' && (
          <div className="flex items-start gap-2.5">
            <span className="text-xs font-bold leading-none mt-1.5 select-none text-amber-400 font-mono">
              {index + 1}.
            </span>
            <div
              ref={contentRef}
              contentEditable
              suppressContentEditableWarning
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              onSelect={onSelectionChange}
              data-placeholder="Paso numerado..."
              className={`flex-1 outline-none text-sm sm:text-base leading-relaxed ${
                isDarkTheme ? 'text-slate-200' : 'text-slate-700'
              } empty:before:content-[attr(data-placeholder)] empty:before:text-slate-500/50 empty:before:pointer-events-none`}
            />
          </div>
        )}

        {/* IMAGE / MEDIA BLOCK */}
        {block.type === 'image' && (
          <div className="space-y-2 my-2">
            {block.imageUrl ? (
              <div className="relative group/img rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                <img
                  src={block.imageUrl}
                  alt={block.caption || 'Media block'}
                  className="w-full max-h-96 object-cover rounded-2xl"
                />
                <div className="absolute top-2 right-2 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-xl backdrop-blur-md">
                  <button
                    type="button"
                    onClick={() => {
                      const newUrl = prompt('Ingresa nueva URL de imagen:', block.imageUrl);
                      if (newUrl) onUpdate(block.id, { imageUrl: newUrl });
                    }}
                    className="p-1 text-slate-300 hover:text-white rounded"
                    title="Cambiar URL"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className={`p-6 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 text-center transition-colors ${
                isDarkTheme ? 'bg-slate-950/40 border-white/15' : 'bg-slate-50 border-slate-300'
              }`}>
                <ImageIcon className="w-8 h-8 text-slate-400" />
                <div className="text-xs text-slate-400">
                  <span>Pega una URL o escribe un enlace de imagen:</span>
                </div>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/photo-..."
                  onChange={(e) => {
                    if (e.target.value.trim().startsWith('http')) {
                      onUpdate(block.id, { imageUrl: e.target.value.trim() });
                    }
                  }}
                  className={`w-full max-w-sm px-3 py-1.5 rounded-xl text-xs outline-none border ${
                    isDarkTheme ? 'bg-slate-900 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-800'
                  }`}
                />
              </div>
            )}
            <input
              type="text"
              value={block.caption || ''}
              onChange={(e) => onUpdate(block.id, { caption: e.target.value })}
              placeholder="Leyenda o pie de foto (opcional)..."
              className={`w-full text-center text-xs outline-none bg-transparent ${
                isDarkTheme ? 'text-slate-400 placeholder:text-slate-600' : 'text-slate-500 placeholder:text-slate-400'
              }`}
            />
          </div>
        )}

        {/* DIVIDER */}
        {block.type === 'divider' && (
          <div className="py-3">
            <hr className={`border-t ${isDarkTheme ? 'border-white/10' : 'border-slate-200'}`} />
          </div>
        )}

      </div>

      {/* Right Block Action Popover (Duplicate / Delete) */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 pt-1.5 shrink-0">
        <button
          type="button"
          onClick={() => onDuplicate(block.id)}
          className={`p-1 rounded-lg transition-colors cursor-pointer ${
            isDarkTheme ? 'text-slate-500 hover:text-slate-300 hover:bg-white/10' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
          }`}
          title="Duplicar bloque"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>

        {totalBlocks > 1 && (
          <button
            type="button"
            onClick={() => onDelete(block.id)}
            className={`p-1 rounded-lg transition-colors cursor-pointer ${
              isDarkTheme ? 'text-slate-500 hover:text-rose-400 hover:bg-rose-500/10' : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
            }`}
            title="Eliminar bloque"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

    </div>
  );
};
