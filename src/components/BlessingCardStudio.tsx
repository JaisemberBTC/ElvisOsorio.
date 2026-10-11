import React, { useState } from 'react';
import { Copy, Download, RefreshCw, Sparkles } from 'lucide-react';

const CARD_SCENES = [
  {
    label: 'Jesús ofrece consuelo',
    image: '/sacred-assets/jesus-peace.jpg',
    prompt: 'A single, respectful, photorealistic scene of Jesus offering quiet comfort at dawn, warm natural light, cinematic but reverent, one coherent environment, uncluttered lower third reserved for later verse typography.'
  },
  {
    label: 'Jesús, buen pastor',
    image: '/sacred-assets/jesus-shepherd.jpg',
    prompt: 'A single, respectful, photorealistic scene of Jesus as a gentle shepherd in a peaceful landscape, warm natural light, cinematic but reverent, one coherent environment, uncluttered lower third reserved for later verse typography.'
  },
  {
    label: 'Jesús en oración',
    image: '/sacred-assets/jesus-prayer.jpg',
    prompt: 'A single, respectful, photorealistic scene of Jesus in quiet prayer at sunrise, soft golden light, cinematic but reverent, one coherent environment, uncluttered lower third reserved for later verse typography.'
  },
  {
    label: 'Jesús bendice',
    image: '/sacred-assets/jesus-blessing.jpg',
    prompt: 'A single, respectful, photorealistic scene of Jesus offering a gentle blessing, compassionate expression, warm natural light, cinematic but reverent, one coherent environment, uncluttered lower third reserved for later verse typography.'
  }
];

function wrapCanvasText(context: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (line && context.measureText(candidate).width > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export const BlessingCardStudio: React.FC = () => {
  const [recipient, setRecipient] = useState('');
  const [verseRef, setVerseRef] = useState('Salmos 23:1');
  const [verseText, setVerseText] = useState('El Señor es mi pastor; nada me faltará.');
  const [blessing, setBlessing] = useState('Que la gracia, el amor y la protección de Dios inunden tu vida y la de tu familia en este día.');
  const [sceneIndex, setSceneIndex] = useState(0);
  const [copiedAction, setCopiedAction] = useState<'message' | 'prompt' | null>(null);
  const selectedScene = CARD_SCENES[sceneIndex];

  const copyText = async (text: string, action: 'message' | 'prompt') => {
    await navigator.clipboard.writeText(text);
    setCopiedAction(action);
    window.setTimeout(() => setCopiedAction(null), 2000);
  };

  const handleCopyText = () => {
    const recipientLine = recipient.trim() ? `Para: ${recipient.trim()}\n\n` : '';
    void copyText(`${recipientLine}“${verseText.trim()}”\n\n${blessing.trim()}\n\nReferencia bíblica: ${verseRef.trim()}`, 'message');
  };

  const handleCopyImagePrompt = () => {
    const prompt = `${selectedScene.prompt} Square 1:1 composition, a single scene only. No collage, no split panels, no lettering, no verse reference, no logo, no watermark, no footer, no extra people. The verse and blessing will be typeset separately in the finished card.`;
    void copyText(prompt, 'prompt');
  };

  const handleDownloadCard = () => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1080;
      const context = canvas.getContext('2d');
      if (!context) return;

      const side = Math.min(image.naturalWidth, image.naturalHeight);
      const sourceX = (image.naturalWidth - side) / 2;
      const sourceY = (image.naturalHeight - side) / 2;
      context.drawImage(image, sourceX, sourceY, side, side, 0, 0, 1080, 1080);

      const overlay = context.createLinearGradient(0, 250, 0, 1080);
      overlay.addColorStop(0, 'rgba(4, 8, 18, 0.02)');
      overlay.addColorStop(0.38, 'rgba(4, 8, 18, 0.22)');
      overlay.addColorStop(0.72, 'rgba(4, 8, 18, 0.78)');
      overlay.addColorStop(1, 'rgba(4, 8, 18, 0.91)');
      context.fillStyle = overlay;
      context.fillRect(0, 0, 1080, 1080);
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.shadowColor = 'rgba(0, 0, 0, 0.8)';
      context.shadowBlur = 14;
      context.fillStyle = '#fffaf0';

      const verseFontSize = verseText.length > 130 ? 38 : verseText.length > 80 ? 44 : 50;
      context.font = `italic ${verseFontSize}px Georgia, serif`;
      const verseLines = wrapCanvasText(context, `“${verseText.trim()}”`, 850);
      const verseLineHeight = verseFontSize * 1.28;
      const verseStartY = 640;
      verseLines.forEach((line, index) => {
        context.fillText(line, 540, verseStartY + index * verseLineHeight, 880);
      });

      const blessingFontSize = blessing.length > 150 ? 25 : blessing.length > 95 ? 29 : 33;
      context.font = `500 ${blessingFontSize}px Arial, sans-serif`;
      context.fillStyle = '#f5dfb3';
      const blessingLines = wrapCanvasText(context, blessing.trim(), 840);
      const blessingLineHeight = blessingFontSize * 1.35;
      const blessingStartY = verseStartY + verseLines.length * verseLineHeight + 54;
      blessingLines.forEach((line, index) => {
        context.fillText(line, 540, blessingStartY + index * blessingLineHeight, 870);
      });

      const link = document.createElement('a');
      link.download = 'tarjeta-devocional-1080x1080.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    image.onerror = () => window.alert('No se pudo cargar la escena seleccionada. Intenta cambiar de imagen.');
    image.src = selectedScene.image;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Diseñador de Tarjetas de Bendición</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-cinzel text-white">Tarjetas de Fe & Esperanza</h1>
        <p className="text-xs text-slate-400">Una escena divina única en formato 1:1, con el versículo y una sola frase de bendición.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/5 space-y-4">
          <h3 className="text-sm font-semibold text-amber-300 uppercase tracking-wider">Personalizar Mensaje</h3>

          <div className="space-y-1">
            <label className="text-xs text-slate-400">Destinatario (solo se incluye en el texto copiado):</label>
            <input
              type="text"
              value={recipient}
              onChange={(event) => setRecipient(event.target.value)}
              placeholder="Ej.: Para mi mamá"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400/50"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-400">Referencia bíblica (no aparece dentro de la imagen):</label>
            <input
              type="text"
              value={verseRef}
              onChange={(event) => setVerseRef(event.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400/50"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-400">Texto del versículo:</label>
            <textarea
              rows={3}
              value={verseText}
              onChange={(event) => setVerseText(event.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400/50 resize-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-400">Una frase de bendición:</label>
            <textarea
              rows={3}
              value={blessing}
              onChange={(event) => setBlessing(event.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400/50 resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-slate-400">Escena divina (catálogo local, una sola escena):</label>
            <select
              value={sceneIndex}
              onChange={(event) => setSceneIndex(Number(event.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400/50"
            >
              {CARD_SCENES.map((scene, index) => <option key={scene.image} value={index}>{scene.label}</option>)}
            </select>
          </div>

          <button
            type="button"
            onClick={() => void handleCopyText()}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5 text-amber-400" />
            <span>{copiedAction === 'message' ? '¡Texto copiado!' : 'Copiar texto para compartir (incluye referencia)'}</span>
          </button>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/5 space-y-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Vista previa · escena única</span>
            <span className="text-[10px] text-amber-400 font-mono">1080 × 1080</span>
          </div>

          <div className="aspect-square rounded-2xl border border-amber-500/30 shadow-2xl relative overflow-hidden bg-slate-950 text-center">
            <img src={selectedScene.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/0 via-slate-950/15 to-slate-950/90" />
            <div className="absolute inset-x-5 bottom-7 sm:inset-x-8 sm:bottom-9 z-10 space-y-4">
              <p className="text-sm sm:text-base md:text-lg italic font-scripture text-white leading-relaxed drop-shadow-lg">“{verseText}”</p>
              <p className="text-xs sm:text-sm text-amber-100 font-sans leading-relaxed drop-shadow-lg">{blessing}</p>
            </div>
          </div>

          <p className="text-[10px] text-slate-500">En el arte solo aparecen el versículo y la frase. La referencia y el destinatario quedan fuera del PNG.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleDownloadCard}
              className="py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar PNG 1080 × 1080</span>
            </button>
            <button
              type="button"
              onClick={handleCopyImagePrompt}
              className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {copiedAction === 'prompt' ? <Copy className="w-3.5 h-3.5 text-emerald-400" /> : <RefreshCw className="w-3.5 h-3.5 text-amber-400" />}
              <span>{copiedAction === 'prompt' ? '¡Prompt copiado!' : 'Copiar prompt de escena'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
