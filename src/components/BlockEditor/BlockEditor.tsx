import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  FileText, 
  Sparkles, 
  Moon, 
  Sun, 
  Download, 
  Copy, 
  Check, 
  Code, 
  Eye, 
  Edit3, 
  RotateCcw, 
  Plus, 
  Share2, 
  Save, 
  Clock, 
  Layers, 
  CheckCircle2, 
  RefreshCw, 
  Flame, 
  BookOpen, 
  Quote, 
  ArrowRight,
  Maximize2,
  FolderSync
} from 'lucide-react';
import { BlockItem, BlockType, BlockEditorDocument } from '../../types';
import { BlockItemRenderer } from './BlockItemRenderer';
import { FloatingToolbar } from './FloatingToolbar';
import { SlashMenu } from './SlashMenu';
import { blocksToHTML, blocksToMarkdown } from './BlockEditorExport';
import confetti from 'canvas-confetti';

interface BlockEditorProps {
  initialDocument?: BlockEditorDocument;
  onSave?: (doc: BlockEditorDocument) => void;
  onApplyToVideoSimulator?: (scriptText: string) => void;
  onClose?: () => void;
}

const DEFAULT_BLOCKS: BlockItem[] = [
  {
    id: 'block-1',
    type: 'heading-1',
    content: '🕊️ Guion & Devocional: Jesús Calma Tu Tempestad'
  },
  {
    id: 'block-2',
    type: 'paragraph',
    content: 'Este editor de bloques interactivo te permite estructurar la narración, versículos y escenas del video en vivo con la misma fluidez que Notion y Medium.'
  },
  {
    id: 'block-3',
    type: 'scripture-callout',
    content: 'Paz os dejo, mi paz os doy; yo no os la doy como el mundo la da. No se turbe vuestro corazón, ni tenga miedo.',
    caption: 'Juan 14:27'
  },
  {
    id: 'block-4',
    type: 'heading-2',
    content: 'Puntos Clave para la Narración en Video'
  },
  {
    id: 'block-5',
    type: 'todo-list',
    content: 'Interrupción de scroll con el Gancho de Jesús en los primeros 3 segundos',
    checked: true
  },
  {
    id: 'block-6',
    type: 'todo-list',
    content: 'Proyectar la imagen sagrada de Cristo con respiración viva y resplandor áureo',
    checked: true
  },
  {
    id: 'block-7',
    type: 'todo-list',
    content: 'Llamado a la acción: "Comenta Amén y recibe esta bendición"',
    checked: false
  },
  {
    id: 'block-8',
    type: 'quote',
    content: 'No hay tormenta que pueda derribar la barca donde Cristo va al mando.',
    caption: 'Reflexión Pastoral'
  },
  {
    id: 'block-9',
    type: 'callout',
    content: 'Escribe "/" en cualquier línea vacía para desplegar el menú de bloques sagrados, listas, citas y código.',
    calloutIcon: '✨'
  }
];

export const BlockEditor: React.FC<BlockEditorProps> = ({
  initialDocument,
  onSave,
  onApplyToVideoSimulator,
  onClose
}) => {
  // Theme state
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(true);
  
  // Document State
  const [docTitle, setDocTitle] = useState<string>(initialDocument?.title || 'Guion de Video & Devocional');
  const [blocks, setBlocks] = useState<BlockItem[]>(initialDocument?.blocks || DEFAULT_BLOCKS);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  // UI Modes
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);

  // Autosave status
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [lastSavedTime, setLastSavedTime] = useState<string>('Ahora mismo');
  const autosaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Floating Selection Toolbar State
  const [floatingToolbarPos, setFloatingToolbarPos] = useState<{ top: number; left: number } | null>(null);

  // Slash Command Menu State
  const [slashMenuState, setSlashMenuState] = useState<{
    isOpen: boolean;
    blockId: string | null;
    position: { top: number; left: number };
    query: string;
  }>({
    isOpen: false,
    blockId: null,
    position: { top: 0, left: 0 },
    query: ''
  });

  // Drag and Drop State
  const dragItemIndex = useRef<number | null>(null);

  // Copy feedback state
  const [copiedFormat, setCopiedFormat] = useState<'html' | 'json' | 'md' | null>(null);

  // Trigger Autosave debounced
  const triggerAutosave = useCallback(() => {
    setSaveStatus('saving');
    if (autosaveTimeoutRef.current) clearTimeout(autosaveTimeoutRef.current);

    autosaveTimeoutRef.current = setTimeout(() => {
      const currentDoc: BlockEditorDocument = {
        id: initialDocument?.id || `doc-${Date.now()}`,
        title: docTitle,
        updatedAt: new Date().toISOString(),
        blocks: blocks,
        theme: isDarkTheme ? 'dark' : 'light'
      };

      try {
        localStorage.setItem('fe_oracion_block_editor_doc_v1', JSON.stringify(currentDoc));
      } catch (e) {
        console.warn('Could not save to localStorage:', e);
      }

      if (onSave) onSave(currentDoc);

      setSaveStatus('saved');
      const now = new Date();
      setLastSavedTime(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`);
    }, 1200);
  }, [docTitle, blocks, isDarkTheme, initialDocument?.id, onSave]);

  // Handle Block Updates
  const handleUpdateBlock = (id: string, updates: Partial<BlockItem>) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
    );
    triggerAutosave();
  };

  // Delete Block
  const handleDeleteBlock = (id: string) => {
    if (blocks.length <= 1) return;
    setBlocks((prev) => prev.filter((b) => b.id !== id));
    triggerAutosave();
  };

  // Duplicate Block
  const handleDuplicateBlock = (id: string) => {
    const idx = blocks.findIndex((b) => b.id === id);
    if (idx === -1) return;
    const target = blocks[idx];
    const newBlock: BlockItem = {
      ...target,
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`
    };
    const updated = [...blocks];
    updated.splice(idx + 1, 0, newBlock);
    setBlocks(updated);
    triggerAutosave();
  };

  // Move Block Up / Down
  const handleMoveBlock = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= blocks.length) return;
    const updated = [...blocks];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setBlocks(updated);
    triggerAutosave();
  };

  // Insert Block Below
  const handleInsertBelow = (index: number, type: BlockType = 'paragraph') => {
    const newBlock: BlockItem = {
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type,
      content: ''
    };
    const updated = [...blocks];
    updated.splice(index + 1, 0, newBlock);
    setBlocks(updated);
    setSelectedBlockId(newBlock.id);
    setSlashMenuState({ isOpen: false, blockId: null, position: { top: 0, left: 0 }, query: '' });
    triggerAutosave();
  };

  // Slash command handler
  const handleSlashTrigger = (blockId: string, position: { top: number; left: number }, query: string) => {
    setSlashMenuState({
      isOpen: true,
      blockId,
      position,
      query
    });
  };

  const handleSlashSelect = (newType: BlockType) => {
    if (!slashMenuState.blockId) return;
    const cleanContent = (blocks.find((b) => b.id === slashMenuState.blockId)?.content || '').replace(/^\/[a-zA-Z0-9]*/, '').trim();
    
    handleUpdateBlock(slashMenuState.blockId, {
      type: newType,
      content: cleanContent
    });
    setSlashMenuState({ isOpen: false, blockId: null, position: { top: 0, left: 0 }, query: '' });
  };

  // Handle Text Selection for Floating Toolbar
  const handleSelectionChange = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !selection.toString().trim()) {
      setFloatingToolbarPos(null);
      return;
    }

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      setFloatingToolbarPos({
        top: rect.top - 8,
        left: rect.left + rect.width / 2
      });
    } else {
      setFloatingToolbarPos(null);
    }
  };

  // Apply rich text formatting (bold, italic, etc)
  const handleApplyFormat = (format: string) => {
    document.execCommand(format === 'strike' ? 'strikethrough' : format, false);
    handleSelectionChange();
    triggerAutosave();
  };

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    dragItemIndex.current = index;
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (dragItemIndex.current === null || dragItemIndex.current === targetIndex) return;
    handleMoveBlock(dragItemIndex.current, targetIndex);
    dragItemIndex.current = null;
  };

  // Template loader
  const loadTemplate = (templateType: 'devotional' | 'viral-script' | 'prayer') => {
    let newBlocks: BlockItem[] = [];
    if (templateType === 'devotional') {
      newBlocks = [
        { id: 't-1', type: 'heading-1', content: '🌿 Devocional: Renovación en el Desierto' },
        { id: 't-2', type: 'paragraph', content: 'Cuando tus fuerzas se agotan, la gracia de Dios se perfecciona en tu debilidad.' },
        { id: 't-3', type: 'scripture-callout', content: 'Pero los que esperan a Jehová tendrán nuevas fuerzas; levantarán alas como las águilas.', caption: 'Isaías 40:31' },
        { id: 't-4', type: 'heading-2', content: '3 Pasos para tu Meditación' },
        { id: 't-5', type: 'todo-list', content: 'Dedicar 5 minutos de silencio en la presencia de Jesús', checked: false },
        { id: 't-6', type: 'todo-list', content: 'Entregar la preocupación que más te inquieta hoy', checked: false },
        { id: 't-7', type: 'quote', content: 'La oración no cambia a Dios, cambia al que ora.', caption: 'C.S. Lewis' }
      ];
    } else if (templateType === 'viral-script') {
      newBlocks = [
        { id: 'v-1', type: 'heading-1', content: '⚡ Guion Viral: No Esperes a que Sea Tarde' },
        { id: 'v-2', type: 'callout', content: 'Gancho (0-3s): "Detén tu pantalla si necesitas que Dios sane tu corazón hoy."', calloutIcon: '🔥' },
        { id: 'v-3', type: 'heading-2', content: 'Cuerpo del Video (4-25s)' },
        { id: 'v-4', type: 'paragraph', content: 'Jesús te dice hoy: Hijo mío, he visto tus noches sin dormir y tu esfuerzo silencioso...' },
        { id: 'v-5', type: 'scripture-callout', content: 'Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar.', caption: 'Mateo 11:28' },
        { id: 'v-6', type: 'heading-3', content: 'Llamado a la Acción Viral' },
        { id: 'v-7', type: 'paragraph', content: 'Escribe "Amén Jesús" en los comentarios y comparte esta bendición con alguien que ames.' }
      ];
    } else {
      newBlocks = [
        { id: 'p-1', type: 'heading-1', content: '🕊️ Oración de Protección para la Familia' },
        { id: 'p-2', type: 'scripture-callout', content: 'El que habita al abrigo del Altísimo morará bajo la sombra del Omnipotente.', caption: 'Salmo 91:1' },
        { id: 'p-3', type: 'quote', content: 'Señor Jesús, cubro con tu sangre preciosa cada rincón de mi hogar y la vida de mis hijos. Amén.', caption: 'Oración de Altar' }
      ];
    }
    setBlocks(newBlocks);
    triggerAutosave();
  };

  // Stats calculation
  const totalWords = blocks.reduce((acc, b) => acc + (b.content ? b.content.trim().split(/\s+/).filter(Boolean).length : 0), 0);
  const readingTimeMin = Math.max(1, Math.ceil(totalWords / 200));

  // Copy full document
  const handleCopyCleanHTML = () => {
    const html = blocksToHTML(blocks, docTitle);
    navigator.clipboard.writeText(html);
    setCopiedFormat('html');
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  const handleCopyJSON = () => {
    const json = JSON.stringify({ title: docTitle, updatedAt: new Date().toISOString(), blocks }, null, 2);
    navigator.clipboard.writeText(json);
    setCopiedFormat('json');
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  const handleCopyMarkdown = () => {
    const md = blocksToMarkdown(blocks, docTitle);
    navigator.clipboard.writeText(md);
    setCopiedFormat('md');
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  // Download HTML or JSON
  const handleDownloadFile = (type: 'html' | 'json' | 'md') => {
    let content = '';
    let mime = 'text/plain';
    let ext = 'txt';

    if (type === 'html') {
      content = blocksToHTML(blocks, docTitle);
      mime = 'text/html';
      ext = 'html';
    } else if (type === 'json') {
      content = JSON.stringify({ title: docTitle, blocks, updatedAt: new Date().toISOString() }, null, 2);
      mime = 'application/json';
      ext = 'json';
    } else {
      content = blocksToMarkdown(blocks, docTitle);
      mime = 'text/markdown';
      ext = 'md';
    }

    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${docTitle.toLowerCase().replace(/[^a-z0-9]/g, '_') || 'documento'}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`w-full rounded-3xl transition-colors duration-200 border shadow-2xl overflow-hidden ${
      isDarkTheme 
        ? 'bg-slate-950/95 border-amber-500/20 text-slate-100' 
        : 'bg-white border-slate-200 text-slate-900'
    }`}>
      
      {/* Top Professional Header Toolbar */}
      <div className={`px-4 sm:px-6 py-3.5 border-b flex flex-wrap items-center justify-between gap-3 backdrop-blur-xl ${
        isDarkTheme ? 'border-white/10 bg-slate-900/60' : 'border-slate-200 bg-slate-50/80'
      }`}>
        
        {/* Left: Document Badge, Title & Autosave Status */}
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl flex items-center justify-center ${
            isDarkTheme ? 'bg-amber-400/10 text-amber-400 border border-amber-400/30' : 'bg-amber-100 text-amber-800'
          }`}>
            <FileText className="w-4 h-4" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-cinzel">Editor de Bloques (Notion Style)</span>
              
              {/* Autosave Status Pill */}
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold transition-all ${
                saveStatus === 'saved'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : saveStatus === 'saving'
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  : 'bg-slate-500/15 text-slate-400'
              }`}>
                {saveStatus === 'saved' && <CheckCircle2 className="w-3 h-3" />}
                {saveStatus === 'saving' && <RefreshCw className="w-3 h-3 animate-spin" />}
                <span>
                  {saveStatus === 'saved' ? `Guardado (${lastSavedTime})` : saveStatus === 'saving' ? 'Guardando...' : 'Sin guardar'}
                </span>
              </span>
            </div>
            
            <p className="text-[11px] text-slate-400">
              {totalWords} palabras • ~{readingTimeMin} min de lectura • {blocks.length} bloques
            </p>
          </div>
        </div>

        {/* Right: Controls & Export Tools */}
        <div className="flex items-center gap-2">
          
          {/* Preset Templates */}
          <div className="hidden md:flex items-center gap-1 bg-black/20 p-1 rounded-xl border border-white/5 text-xs">
            <span className="text-[10px] text-slate-400 px-1 font-semibold">Plantillas:</span>
            <button
              type="button"
              onClick={() => loadTemplate('devotional')}
              className={`px-2 py-0.5 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                isDarkTheme ? 'hover:bg-white/10 text-slate-300' : 'hover:bg-slate-200 text-slate-700'
              }`}
            >
              Devocional
            </button>
            <button
              type="button"
              onClick={() => loadTemplate('viral-script')}
              className={`px-2 py-0.5 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                isDarkTheme ? 'hover:bg-white/10 text-slate-300' : 'hover:bg-slate-200 text-slate-700'
              }`}
            >
              Guion Viral
            </button>
          </div>

          {/* Preview / Edit Mode Switch */}
          <button
            type="button"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
              isPreviewMode
                ? 'bg-sky-500/20 text-sky-300 border-sky-500/40 shadow-sm'
                : isDarkTheme ? 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10' : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
            title="Alternar entre modo edición de bloques y vista de lectura"
          >
            {isPreviewMode ? <Edit3 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{isPreviewMode ? 'Modo Edición' : 'Vista Previa'}</span>
          </button>

          {/* Theme Switcher (Dark / Light) */}
          <button
            type="button"
            onClick={() => setIsDarkTheme(!isDarkTheme)}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              isDarkTheme ? 'bg-white/5 hover:bg-white/10 text-amber-300 border-white/10' : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
            title={isDarkTheme ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
          >
            {isDarkTheme ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Export Button */}
          <button
            type="button"
            onClick={() => setShowExportModal(!showExportModal)}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar</span>
          </button>

          {/* Close if in modal mode */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isDarkTheme ? 'text-slate-400 hover:text-white border-white/10' : 'text-slate-500 hover:text-slate-900 border-slate-200'
              }`}
            >
              ✕
            </button>
          )}

        </div>
      </div>

      {/* Export Drawer / Panel */}
      {showExportModal && (
        <div className={`p-4 sm:p-5 border-b animate-in fade-in slide-in-from-top-3 duration-200 ${
          isDarkTheme ? 'bg-slate-900/90 border-white/10' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 font-cinzel">
                <Code className="w-4 h-4" />
                <span>Exportación de Contenido Limpio & Estructurado</span>
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Genera código HTML semántico listo para pegar en tu blog/web, JSON modular o Markdown.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleCopyCleanHTML}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold flex items-center gap-1.5 border border-white/10 transition-colors cursor-pointer"
              >
                {copiedFormat === 'html' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedFormat === 'html' ? 'HTML Copiado' : 'Copiar HTML Limpio'}</span>
              </button>

              <button
                type="button"
                onClick={handleCopyJSON}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold flex items-center gap-1.5 border border-white/10 transition-colors cursor-pointer"
              >
                {copiedFormat === 'json' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Code className="w-3.5 h-3.5" />}
                <span>{copiedFormat === 'json' ? 'JSON Copiado' : 'Copiar JSON'}</span>
              </button>

              <button
                type="button"
                onClick={handleCopyMarkdown}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold flex items-center gap-1.5 border border-white/10 transition-colors cursor-pointer"
              >
                {copiedFormat === 'md' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <FileText className="w-3.5 h-3.5" />}
                <span>{copiedFormat === 'md' ? 'MD Copiado' : 'Copiar Markdown'}</span>
              </button>

              <div className="h-5 w-[1px] bg-white/10 mx-1" />

              <button
                type="button"
                onClick={() => handleDownloadFile('html')}
                className="px-3 py-1.5 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 text-xs font-bold border border-amber-400/30 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar .HTML</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Block Canvas Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-12 min-h-[480px]">
        
        {/* Document Main Heading Title (Editable) */}
        <div className="mb-6 pb-4 border-b border-white/10">
          <input
            type="text"
            value={docTitle}
            onChange={(e) => {
              setDocTitle(e.target.value);
              triggerAutosave();
            }}
            placeholder="Título del Documento o Guion..."
            className={`w-full text-2xl sm:text-4xl font-extrabold tracking-tight font-cinzel outline-none bg-transparent ${
              isDarkTheme ? 'text-white placeholder:text-slate-600' : 'text-slate-900 placeholder:text-slate-400'
            }`}
          />
        </div>

        {/* Read-Only Preview Mode */}
        {isPreviewMode ? (
          <div className="space-y-4 prose dark:prose-invert max-w-none">
            {blocks.map((block) => {
              switch (block.type) {
                case 'heading-1':
                  return <h1 key={block.id} className="text-2xl font-bold font-cinzel">{block.content}</h1>;
                case 'heading-2':
                  return <h2 key={block.id} className="text-xl font-bold font-cinzel text-amber-400">{block.content}</h2>;
                case 'heading-3':
                  return <h3 key={block.id} className="text-lg font-bold text-sky-400">{block.content}</h3>;
                case 'paragraph':
                  return <p key={block.id} className="leading-relaxed">{block.content}</p>;
                case 'scripture-callout':
                  return (
                    <div key={block.id} className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-amber-200 my-3">
                      <p className="italic text-base">"{block.content}"</p>
                      {block.caption && <p className="text-xs font-bold text-amber-400 mt-1 font-cinzel">— {block.caption}</p>}
                    </div>
                  );
                case 'quote':
                  return (
                    <blockquote key={block.id} className="pl-4 border-l-4 border-amber-400 italic my-2">
                      <p>{block.content}</p>
                      {block.caption && <cite className="text-xs opacity-75 not-italic">— {block.caption}</cite>}
                    </blockquote>
                  );
                case 'todo-list':
                  return (
                    <div key={block.id} className="flex items-center gap-2">
                      <input type="checkbox" checked={block.checked} readOnly className="accent-amber-400" />
                      <span className={block.checked ? 'line-through opacity-60' : ''}>{block.content}</span>
                    </div>
                  );
                case 'code':
                  return (
                    <pre key={block.id} className="p-3 rounded-xl bg-slate-900 text-cyan-300 font-mono text-xs overflow-x-auto">
                      <code>{block.content}</code>
                    </pre>
                  );
                case 'callout':
                  return (
                    <div key={block.id} className="p-3.5 rounded-xl bg-sky-500/10 border border-sky-400/30 text-sky-200 flex items-start gap-2.5">
                      <span>{block.calloutIcon || '💡'}</span>
                      <p className="text-sm">{block.content}</p>
                    </div>
                  );
                case 'divider':
                  return <hr key={block.id} className="my-4 border-white/10" />;
                default:
                  return <p key={block.id}>{block.content}</p>;
              }
            })}
          </div>
        ) : (
          /* Interactive Block List */
          <div className="space-y-1">
            {blocks.map((block, index) => (
              <BlockItemRenderer
                key={block.id}
                block={block}
                index={index}
                totalBlocks={blocks.length}
                isSelected={selectedBlockId === block.id}
                isDarkTheme={isDarkTheme}
                onUpdate={handleUpdateBlock}
                onDelete={handleDeleteBlock}
                onDuplicate={handleDuplicateBlock}
                onMoveUp={(idx) => handleMoveBlock(idx, idx - 1)}
                onMoveDown={(idx) => handleMoveBlock(idx, idx + 1)}
                onInsertBelow={handleInsertBelow}
                onSlashTrigger={handleSlashTrigger}
                onSlashClose={() => setSlashMenuState({ isOpen: false, blockId: null, position: { top: 0, left: 0 }, query: '' })}
                onSelectionChange={handleSelectionChange}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              />
            ))}

            {/* Bottom Inserter Button */}
            <div className="pt-6">
              <button
                type="button"
                onClick={() => handleInsertBelow(blocks.length - 1, 'paragraph')}
                className={`w-full py-3 rounded-2xl border-2 border-dashed flex items-center justify-center gap-2 text-xs font-semibold transition-all cursor-pointer ${
                  isDarkTheme 
                    ? 'border-white/10 hover:border-amber-400/40 text-slate-400 hover:text-amber-300 hover:bg-white/[0.02]' 
                    : 'border-slate-200 hover:border-amber-400 text-slate-500 hover:text-amber-900 hover:bg-amber-50/50'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>Haz clic aquí o pulsa Enter para añadir un nuevo bloque</span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Floating Selection Toolbar on text highlight */}
      <FloatingToolbar
        position={floatingToolbarPos}
        onApplyFormat={handleApplyFormat}
        isDarkTheme={isDarkTheme}
      />

      {/* Slash Command Palette Popup */}
      {slashMenuState.isOpen && (
        <SlashMenu
          position={slashMenuState.position}
          query={slashMenuState.query}
          onSelect={handleSlashSelect}
          onClose={() => setSlashMenuState({ isOpen: false, blockId: null, position: { top: 0, left: 0 }, query: '' })}
          isDarkTheme={isDarkTheme}
        />
      )}

      {/* Bottom Footer Tip Bar */}
      <div className={`px-6 py-2.5 border-t flex flex-wrap items-center justify-between text-[11px] text-slate-400 ${
        isDarkTheme ? 'border-white/5 bg-slate-950' : 'border-slate-200 bg-slate-50'
      }`}>
        <div className="flex items-center gap-3">
          <span>💡 <strong>Tip:</strong> Escribe <code className="px-1 py-0.5 rounded bg-white/10 font-mono text-amber-300">/</code> para abrir el menú rápido de bloques.</span>
          <span>•</span>
          <span>Arrastra el icono <code className="px-1 py-0.5 rounded bg-white/10 font-mono text-slate-300">⋮⋮</code> para reordenar bloques.</span>
        </div>

        <div className="flex items-center gap-2">
          {onApplyToVideoSimulator && (
            <button
              type="button"
              onClick={() => {
                const fullText = blocks.map(b => b.content).filter(Boolean).join('\n\n');
                onApplyToVideoSimulator(fullText);
                confetti({
                  particleCount: 30,
                  spread: 60,
                  origin: { y: 0.8 },
                  colors: ['#f59e0b', '#38bdf8', '#ffffff']
                });
              }}
              className="px-3 py-1 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 font-bold border border-amber-400/40 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Flame className="w-3 h-3 text-amber-400" />
              <span>Sincronizar con Simulador de Video</span>
            </button>
          )}
        </div>
      </div>

    </div>
  );
};
