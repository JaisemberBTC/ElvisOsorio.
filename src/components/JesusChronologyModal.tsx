import React, { useState, useMemo } from 'react';
import { 
  X, 
  Search, 
  Sparkles, 
  Check, 
  BookOpen, 
  Eye, 
  Layers, 
  Heart, 
  Compass, 
  Sun,
  Shield,
  Shuffle
} from 'lucide-react';
import { 
  JESUS_CHRONOLOGY_GALLERY, 
  JesusSceneItem, 
  searchJesusChronology,
  getSequenceOfConsecutiveJesusScenes,
  markSceneIdAsUsed,
  getUsedSceneIds
} from '../data/jesusChronologyGallery';

interface JesusChronologyModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetSceneIdx?: number;
  totalScenes?: number;
  onSelectSceneForIdx: (sceneIdx: number, imageUrl: string, sceneItem: JesusSceneItem) => void;
  onApplyFullSequence?: (scenes: JesusSceneItem[]) => void;
}

const ERA_FILTERS = [
  { id: 'all', label: '✨ Todas las Escenas', icon: '🕊️' },
  { id: 'milagros_sanidades', label: '🌿 Milagros & Sanidad', icon: '✨' },
  { id: 'soberania_creacion', label: '🌊 Paz en la Tormenta', icon: '⚡' },
  { id: 'resurreccion_victoria', label: '👑 Resurrección & Pascua', icon: '🌅' },
  { id: 'pasion_getsemani', label: '🫒 Getsemaní & Amor Fiel', icon: '💧' },
  { id: 'cruz_calvario', label: '✝️ La Cruz & Redención', icon: '❤️' },
  { id: 'parabolas_vivas', label: '🐑 El Buen Pastor', icon: '🌾' },
  { id: 'encuentros_misericordia', label: '🤝 Encuentros de Gracia', icon: '💧' },
  { id: 'sermon_monte', label: '🏔️ Sermón del Monte', icon: '📜' },
  { id: 'transfiguracion_gloria', label: '☀️ Gloria & Transfiguración', icon: '🌟' },
  { id: 'multiplicacion_provision', label: '🍞 Provisión & Panes', icon: '🐟' },
  { id: 'ministerio_inicial', label: '🕊️ Bautismo & Desierto', icon: '🔥' },
  { id: 'ascension_intercesion', label: '🌌 Trono & Intercesión', icon: '🛡️' },
];

export const JesusChronologyModal: React.FC<JesusChronologyModalProps> = ({
  isOpen,
  onClose,
  targetSceneIdx = 0,
  totalScenes = 4,
  onSelectSceneForIdx,
  onApplyFullSequence
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEra, setSelectedEra] = useState('all');
  const [selectedItem, setSelectedItem] = useState<JesusSceneItem | null>(null);

  const usedIds = useMemo(() => new Set(getUsedSceneIds()), [isOpen]);

  const filteredScenes = useMemo(() => {
    return searchJesusChronology(searchQuery, selectedEra);
  }, [searchQuery, selectedEra]);

  if (!isOpen) return null;

  const handleApplySingle = (item: JesusSceneItem) => {
    const chosenUrl = item.localFallbackImage || item.cloudImageUrl;
    markSceneIdAsUsed(item.id);
    onSelectSceneForIdx(targetSceneIdx, chosenUrl, item);
    onClose();
  };

  const handleApplyBatchSequence = () => {
    if (onApplyFullSequence) {
      const sequence = getSequenceOfConsecutiveJesusScenes(totalScenes, searchQuery || selectedEra);
      onApplyFullSequence(sequence);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-6xl max-h-[92vh] bg-slate-900 border border-amber-500/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-bold shadow-lg shrink-0">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-amber-300 font-cinzel flex items-center gap-2">
                <span>Historia Completa de Jesucristo</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Jesús Siempre Protagonista • Sin Repetición
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Selecciona una escena sagrada para la Escena {targetSceneIdx + 1}, o asigna una secuencia continua única a todo el video.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {onApplyFullSequence && (
              <button
                type="button"
                onClick={handleApplyBatchSequence}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md hover:shadow-amber-500/20 transition-all cursor-pointer"
                title="Asigna escenas continuas sin repetir a todas las escenas del video"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>Asignar Secuencia Completa ({totalScenes} escenas)</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search & Era Filter Pills */}
        <div className="p-4 border-b border-white/10 bg-slate-950/60 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por momento: 'tormenta', 'Lázaro', 'Bartimeo', 'Getsemaní', 'buen pastor', 'cruz', 'sanidad'..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/90 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Limpiar
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {ERA_FILTERS.map(era => (
              <button
                key={era.id}
                type="button"
                onClick={() => setSelectedEra(era.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedEra === era.id
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5'
                }`}
              >
                <span>{era.icon}</span>
                <span>{era.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Scene Cards Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredScenes.map((item) => {
            const isUsedRecently = usedIds.has(item.id);
            const isSelected = selectedItem?.id === item.id;
            const imgSrc = item.localFallbackImage || item.cloudImageUrl;

            return (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`rounded-2xl border transition-all flex flex-col overflow-hidden cursor-pointer group ${
                  isSelected 
                    ? 'border-amber-400 bg-slate-800/90 shadow-lg shadow-amber-400/10 ring-2 ring-amber-400/30'
                    : 'border-white/10 bg-slate-950/70 hover:border-amber-500/40 hover:bg-slate-900/80'
                }`}
              >
                {/* Image Container with 16:9 / 9:16 aspect */}
                <div className="relative h-44 bg-black overflow-hidden shrink-0">
                  <img
                    src={imgSrc}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/40" />

                  {/* Badges */}
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-black/70 text-amber-300 border border-amber-400/30 backdrop-blur-sm">
                    {item.eraLabel}
                  </span>

                  {isUsedRecently && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-semibold bg-slate-900/80 text-slate-400 border border-white/10 backdrop-blur-sm">
                      Usado en sesión previa
                    </span>
                  )}

                  <span className="absolute bottom-2 left-2 text-[10px] font-mono text-amber-400 bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
                    {item.bibleVerse.reference}
                  </span>
                </div>

                {/* Content */}
                <div className="p-3.5 flex flex-col justify-between flex-1 space-y-2.5">
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-300 italic line-clamp-2 mt-1">
                      "{item.bibleVerse.text}"
                    </p>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-900/90 border border-white/5 text-[11px] space-y-1">
                    <p className="text-amber-200/90 font-medium line-clamp-2">
                      <span className="text-amber-400 font-bold">Jesús: </span>
                      {item.jesusPresence}
                    </p>
                    <p className="text-slate-400 text-[10px] line-clamp-1">
                      <span className="text-slate-300 font-semibold">Consuelo: </span>
                      {item.emotionalResonance}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="pt-1 flex items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-1">
                      {item.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[9px] text-slate-400 bg-white/5 px-1.5 py-0.5 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApplySingle(item);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 shrink-0 shadow-sm transition-all cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Asignar a Escena {targetSceneIdx + 1}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-3.5 border-t border-white/10 bg-slate-950 text-center flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
          <span>
            Total de {JESUS_CHRONOLOGY_GALLERY.length} momentos canónicos curados donde Jesús es el centro visual visible.
          </span>
          <span className="text-amber-400/90 font-medium">
            ⚡ Algoritmo inteligente anti-repetición activado (LRU persistent)
          </span>
        </div>

      </div>
    </div>
  );
};
