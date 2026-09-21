import React, { useState } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Wand2, 
  Layers, 
  ExternalLink, 
  Image as ImageIcon, 
  Film, 
  Sliders, 
  CheckCircle2, 
  Flame, 
  Zap, 
  Eye 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Aprende30Package, Aprende30Scene } from '../types';

interface Aprende30PromptStudioProps {
  currentPackage: Aprende30Package;
  onUpdatePackage: (pkg: Aprende30Package) => void;
  onGenerateSceneImage: (sceneIdx: number) => void;
  generatingSceneImageIndex: number | null;
  onGenerateScript?: () => void;
  isGenerating?: boolean;
  onCloseEmbedded?: () => void;
}

const STYLE_ENHANCERS = [
  { label: 'Luz Volumétrica Dorada', suffix: ', celestial volumetric godrays, golden hour studio lighting, deep peaceful aura, photorealistic 8k' },
  { label: 'Cinemático 8K Realista', suffix: ', hyperrealistic cinematic 8k, shot on 35mm lens, dramatic studio lighting, ultra-sharp detail, masterpiece' },
  { label: 'Primer Plano Emotivo', suffix: ', intense emotional close-up looking directly into camera, shallow depth of field, 85mm portrait lens' },
  { label: 'Infografía 3D Neón', suffix: ', dynamic 3D floating icons, vibrant red and amber neon glowing edges, depth of field, 8k resolution' }
];

export const MANDATORY_VISUAL_EDITING_INSTRUCTION = "Instrucción obligatoria de edición visual: Al crear el guion y las indicaciones de video, debes estructurar la sincronización de manera que se produzca un corte o cambio visual exactamente cada 2 o 3 segundos. Estos cortes deben ser dinámicos pero elegantes, alternando aleatoriamente entre: acercamientos sutiles, alejamientos, ligeros paneos o cambios de ángulo";

export function formatMasterVideoPromptForScene(scene: Aprende30Scene, idx: number): string {
  if (scene.masterVideoPrompt && scene.masterVideoPrompt.includes('Dale vida al personaje')) {
    return scene.masterVideoPrompt;
  }
  const duration = scene.durationSec || 10;
  const cam = scene.cameraMovement || (idx === 0 
    ? `Primer plano con zoom lento y continuo durante ${duration} segundos para conectar profundamente con el espectador, con un movimiento suave, natural y fluido.`
    : idx === 1
      ? `Paneo dinámico de enfoque con iluminación de contraste suave y contacto visual penetrante.`
      : `Acercamiento lento con iluminación gloriosa y apertura de resolución triunfante.`);
  const dialogue = (scene.narration || '').trim();

  return `Dale vida al personaje de las imagenes ten en cuenta las tres y alternalas:
Duración: ${duration} segundos (movimiento continuo sin interrupciones).

Movimiento de cámara: ${cam}

Diálogo de ${duration} segundos en español con voz clara y empática (locución de mínimo 9 segundos): "${dialogue}"

${MANDATORY_VISUAL_EDITING_INSTRUCTION}`;
}

export function formatImagePromptForScene(scene: Aprende30Scene, idx: number, engine: 'midjourney' | 'flux' | 'leonardo'): string {
  const shotAngle = idx === 0 
    ? "Cinematic wide establishing shot, dramatic atmospheric studio lighting, deep emotional resonance" 
    : idx === 1 
      ? "Medium close-up looking directly into viewer's eyes, deep emotional connection, soft rim light" 
      : "Heroic resolution detail shot with glorious volumetric golden light rays, uplifting triumphant atmosphere";
  
  const base = scene.visualPrompt || 'Cinematic vertical 9:16 educational short visual, photorealistic 8k';
  
  if (engine === 'midjourney') {
    return `Cinematic masterpiece, ${shotAngle}, ${base}, 8k resolution, photorealistic, volumetric godrays, dramatic studio lighting, deep cinematic depth of field, vertical 9:16 portrait --ar 9:16 --v 6.1 --style raw`;
  }
  if (engine === 'flux') {
    return `Cinematic masterpiece, ${shotAngle}, ${base}, 8k resolution, photorealistic, volumetric lighting, shot on 35mm lens, vertical 9:16 --aspect 9:16 --quality 8k`;
  }
  return `Cinematic masterpiece, ${shotAngle}, ${base}, 8k resolution, photorealistic, volumetric studio lighting, deep depth of field --ar 9:16 --alchemy --photoreal`;
}

export const Aprende30PromptStudio: React.FC<Aprende30PromptStudioProps> = ({
  currentPackage,
  onUpdatePackage,
  onGenerateSceneImage,
  generatingSceneImageIndex,
  onGenerateScript,
  isGenerating,
  onCloseEmbedded
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [promptCategory, setPromptCategory] = useState<'video_master' | 'image_prompts'>('image_prompts');
  const [selectedEngine, setSelectedEngine] = useState<'midjourney' | 'flux' | 'leonardo'>('midjourney');

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Copy all prompts in batch (Master Video or Image Prompts)
  const handleCopyAllPrompts = () => {
    let allText = '';
    if (promptCategory === 'video_master') {
      allText = `🎬 PROMPTS MAESTROS DE VIDEO (FÓRMULA ORACIÓN / CONTINUIDAD 3 TOMAS)
Tema: ${currentPackage.titulo}
Canal: ${currentPackage.channelHandle}

==================================================
📌 ESCENA 1 (0-10s) - GANCHO DISRUPTIVO:
==================================================
${formatMasterVideoPromptForScene(currentPackage.escenas[0] || {} as any, 0)}

==================================================
📌 ESCENA 2 (10-20s) - EL SECRETO REVELADO:
==================================================
${formatMasterVideoPromptForScene(currentPackage.escenas[1] || {} as any, 1)}

==================================================
📌 ESCENA 3 (20-30s) - APLICACIÓN & CIERRE:
==================================================
${formatMasterVideoPromptForScene(currentPackage.escenas[2] || {} as any, 2)}`;
    } else {
      allText = `🎬 PROMPTS DE IMAGEN GENERADOS CON IA (${selectedEngine.toUpperCase()} 9:16)
Tema: ${currentPackage.titulo}
Canal: ${currentPackage.channelHandle}

📌 ESCENA 1 (0-10s - Gancho Disruptivo):
${formatImagePromptForScene(currentPackage.escenas[0] || {} as any, 0, selectedEngine)}

📌 ESCENA 2 (10-20s - El Secreto):
${formatImagePromptForScene(currentPackage.escenas[1] || {} as any, 1, selectedEngine)}

📌 ESCENA 3 (20-30s - Cierre & Suscripción):
${formatImagePromptForScene(currentPackage.escenas[2] || {} as any, 2, selectedEngine)}

🖼️ MINIATURA / PORTADA (YouTube Shorts):
Cinematic masterpiece, ${currentPackage.miniatura_visual || 'Thumbnail prompt'}, dramatic 3-point studio lighting, high contrast, 8k resolution, vertical 9:16 portrait ${selectedEngine === 'midjourney' ? '--ar 9:16 --v 6.1 --style raw' : '--aspect 9:16'}`;
    }

    navigator.clipboard.writeText(allText);
    setCopiedKey('all_prompts');
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleApplyStyleEnhancer = (sceneIdx: number, suffix: string) => {
    const newEscenas = [...currentPackage.escenas];
    if (newEscenas[sceneIdx]) {
      const currentPrompt = newEscenas[sceneIdx].visualPrompt || '';
      // Avoid duplicate suffix
      if (!currentPrompt.includes(suffix.trim().slice(0, 15))) {
        newEscenas[sceneIdx] = {
          ...newEscenas[sceneIdx],
          visualPrompt: `${currentPrompt.trim()}${suffix}`
        };
        onUpdatePackage({
          ...currentPackage,
          escenas: newEscenas
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-5 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-red-600 to-amber-500 text-white flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3 h-3" /> Prompts de IA Integrados
            </span>
            <span className="text-xs text-amber-300 font-semibold">Short: "{currentPackage.titulo}"</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-white mt-1">
            Estudio de Prompts IA (Misma Característica de Video Devocional)
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl">
            Prompts con características cinemáticas 8K, iluminación volumétrica dorada, alternancia de tomas (0-10s, 10-20s, 20-30s) y fórmula de video continuo con cortes cada 2 a 3 segundos.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Switch Category: Video Master vs Image */}
          <div className="flex items-center bg-slate-950 border border-white/10 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setPromptCategory('image_prompts')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                promptCategory === 'image_prompts'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Prompts de Imagen</span>
            </button>
            <button
              type="button"
              onClick={() => setPromptCategory('video_master')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                promptCategory === 'video_master'
                  ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Prompt Maestro Video</span>
            </button>
          </div>

          {/* Engine Selector for Image */}
          {promptCategory === 'image_prompts' && (
            <div className="flex items-center bg-slate-950 border border-white/10 p-1 rounded-xl">
              {(['midjourney', 'flux', 'leonardo'] as const).map((eng) => (
                <button
                  key={eng}
                  type="button"
                  onClick={() => setSelectedEngine(eng)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                    selectedEngine === eng
                      ? 'bg-amber-400 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {eng}
                </button>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={handleCopyAllPrompts}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all cursor-pointer"
          >
            {copiedKey === 'all_prompts' ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4 text-amber-400" />}
            <span>{copiedKey === 'all_prompts' ? '¡Todos Copiados!' : promptCategory === 'video_master' ? 'Copiar 3 Prompts de Video' : 'Copiar 3 Prompts de Imagen'}</span>
          </button>

          {onCloseEmbedded && (
            <button
              type="button"
              onClick={onCloseEmbedded}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              Ocultar
            </button>
          )}
        </div>
      </div>

      {/* Grid: 3 Scenes + Thumbnail */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Scenes 1, 2, 3 */}
        {currentPackage.escenas.map((scene, idx) => {
          const videoMasterPrompt = formatMasterVideoPromptForScene(scene, idx);
          const imageEnginePrompt = formatImagePromptForScene(scene, idx, selectedEngine);

          return (
            <div 
              key={idx}
              className="bg-slate-900/80 border border-white/10 rounded-2xl p-5 space-y-4 hover:border-amber-400/40 transition-all shadow-lg"
            >
              {/* Scene Title */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-red-600 text-white font-black text-xs flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-white leading-none">
                      Escena {idx + 1} ({scene.inicio_segundo}-{scene.fin_segundo}s)
                    </h4>
                    <span className="text-[11px] text-amber-300 font-medium">
                      {scene.stageTitle}
                    </span>
                  </div>
                </div>

                {promptCategory === 'video_master' ? (
                  <button
                    type="button"
                    onClick={() => handleCopy(videoMasterPrompt, `video_scene_${idx}`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-red-600/80 to-amber-500/80 hover:from-red-600 hover:to-amber-500 text-white transition-all cursor-pointer shadow-sm"
                  >
                    {copiedKey === `video_scene_${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5 text-white" />}
                    <span>{copiedKey === `video_scene_${idx}` ? '¡Copiado!' : 'Copiar Prompt Video'}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleCopy(imageEnginePrompt, `image_scene_${idx}`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/30 transition-all cursor-pointer"
                  >
                    {copiedKey === `image_scene_${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
                    <span>{copiedKey === `image_scene_${idx}` ? '¡Copiado!' : `Copiar ${selectedEngine.toUpperCase()}`}</span>
                  </button>
                )}
              </div>

              {/* Master Video Prompt Mode */}
              {promptCategory === 'video_master' ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] text-amber-300 font-bold flex items-center gap-1">
                      <Film className="w-3 h-3 text-red-400" />
                      <span>Prompt Maestro de Video (Fórmula Oración / Runway / Sora):</span>
                    </label>
                    <span className="text-[10px] text-slate-400">10s continuo • Cortes c/ 2-3s</span>
                  </div>
                  <textarea
                    rows={6}
                    value={scene.masterVideoPrompt || videoMasterPrompt}
                    onChange={(e) => {
                      const newEscenas = [...currentPackage.escenas];
                      newEscenas[idx] = { ...newEscenas[idx], masterVideoPrompt: e.target.value };
                      onUpdatePackage({ ...currentPackage, escenas: newEscenas });
                    }}
                    className="w-full bg-slate-950 border border-amber-500/20 rounded-xl p-3 text-xs text-amber-100/90 font-mono focus:outline-none focus:border-amber-400 leading-relaxed"
                  />
                  <p className="text-[10px] text-slate-400 italic">
                    Incluye alternancia de 3 tomas, zoom continuo, locución de 9-10s y regla estricta de edición dinámica.
                  </p>
                </div>
              ) : (
                /* Image Prompt Mode */
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] text-slate-300 block mb-1 font-semibold flex items-center justify-between">
                      <span>Prompt Visual 9:16 ({selectedEngine.toUpperCase()}):</span>
                      <span className="text-[10px] text-amber-400 font-normal">Misma calidad cinemática de oración</span>
                    </label>
                    <textarea
                      rows={3}
                      value={scene.visualPrompt}
                      onChange={(e) => {
                        const newEscenas = [...currentPackage.escenas];
                        newEscenas[idx] = { ...newEscenas[idx], visualPrompt: e.target.value };
                        onUpdatePackage({ ...currentPackage, escenas: newEscenas });
                      }}
                      placeholder="Cinematic vertical visual description in English..."
                      className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-amber-400 leading-relaxed"
                    />
                  </div>

                  {/* Style Booster Chips */}
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1 font-bold uppercase tracking-wider">
                      ⚡ Potenciadores de Estilo:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {STYLE_ENHANCERS.map((enh, enhIdx) => (
                        <button
                          key={enhIdx}
                          type="button"
                          onClick={() => handleApplyStyleEnhancer(idx, enh.suffix)}
                          className="text-[10px] px-2 py-1 rounded-lg bg-white/5 hover:bg-amber-400/20 text-slate-300 hover:text-amber-200 border border-white/10 transition-all cursor-pointer"
                        >
                          + {enh.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons: Generate Image with AI */}
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-mono">
                      Aspecto: 9:16 (Shorts)
                    </span>

                    <button
                      type="button"
                      onClick={() => onGenerateSceneImage(idx)}
                      disabled={generatingSceneImageIndex === idx}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-400/20 text-amber-300 hover:bg-amber-400/30 border border-amber-400/30 transition-all cursor-pointer"
                    >
                      <Wand2 className={`w-3.5 h-3.5 ${generatingSceneImageIndex === idx ? 'animate-spin' : ''}`} />
                      <span>{generatingSceneImageIndex === idx ? 'Generando...' : 'Generar Imagen con este Prompt'}</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          );
        })}

        {/* Thumbnail / Portada Prompt */}
        <div className="bg-slate-900/70 border border-amber-500/30 rounded-2xl p-5 space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center">
                🖼️
              </span>
              <div>
                <h4 className="text-sm font-bold text-white leading-none">
                  Miniatura / Portada (Shorts)
                </h4>
                <span className="text-[11px] text-amber-300 font-medium">
                  CTR Proyectado: {currentPackage.ctr_estimado}%
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleCopy(currentPackage.miniatura_visual, 'thumb_prompt')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-slate-200 transition-all cursor-pointer"
            >
              {copiedKey === 'thumb_prompt' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
              <span>{copiedKey === 'thumb_prompt' ? '¡Copiado!' : 'Copiar Prompt'}</span>
            </button>
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1 font-medium">
              Texto de Impacto de la Miniatura:
            </label>
            <input
              type="text"
              value={currentPackage.miniatura_texto}
              onChange={(e) => onUpdatePackage({ ...currentPackage, miniatura_texto: e.target.value.toUpperCase() })}
              className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-yellow-300 font-black tracking-wider focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1 font-medium">
              Prompt Visual para Generar la Miniatura:
            </label>
            <textarea
              rows={4}
              value={currentPackage.miniatura_visual}
              onChange={(e) => onUpdatePackage({ ...currentPackage, miniatura_visual: e.target.value })}
              className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-amber-400 leading-relaxed"
            />
          </div>

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200 leading-relaxed">
            💡 <span className="font-bold text-white">Consejo de CTR de @Aprendeen30segundos:</span> Usa contraste extremo, un rostro con emoción clara o un objeto 3D en primer plano, y texto de máximo 3 palabras en mayúsculas amarillas o blancas.
          </div>
        </div>

      </div>

    </div>
  );
};
