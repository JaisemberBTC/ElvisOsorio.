import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  Calendar, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Flame, 
  Zap, 
  Clock, 
  Lightbulb, 
  CheckCircle2, 
  Film, 
  Download, 
  Copy, 
  Check, 
  RefreshCw, 
  ChevronRight, 
  AlertCircle,
  Quote,
  Target
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Aprende30DailyCapsule, Aprende30Package } from '../types';
import { INITIAL_DAILY_CAPSULES, APRENDE_30_CATEGORIES } from '../data/aprende30Data';

interface Aprende30DailyCapsuleViewProps {
  onLoadCapsuleIntoVideoEditor: (pkg: Aprende30Package) => void;
  onOpenCardStudioWithData: (card: any) => void;
}

export const Aprende30DailyCapsuleView: React.FC<Aprende30DailyCapsuleViewProps> = ({
  onLoadCapsuleIntoVideoEditor,
  onOpenCardStudioWithData
}) => {
  const [capsulesList, setCapsulesList] = useState<Aprende30DailyCapsule[]>(INITIAL_DAILY_CAPSULES);
  const [activeCapsuleIndex, setActiveCapsuleIndex] = useState<number>(0);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const activeCapsule = capsulesList[activeCapsuleIndex] || capsulesList[0];

  // Speech Audio Reader for the 30s Capsule
  const handleToggleAudio = () => {
    if (!('speechSynthesis' in window)) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const textToRead = `${activeCapsule.titulo}. ${activeCapsule.gancho3s}. ${activeCapsule.explicacion30s}. Sabías que: ${activeCapsule.sabiasQue}. Reto de hoy: ${activeCapsule.retoDelDia}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'es-ES';
    utterance.rate = 1.15;
    utterance.pitch = 1.05;

    const voices = window.speechSynthesis.getVoices();
    const spanishVoice = voices.find(v => v.lang.startsWith('es') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Pablo') || v.name.includes('Jorge')));
    if (spanishVoice) {
      utterance.voice = spanishVoice;
    }

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  // Generate a brand new daily capsule with Gemini
  const handleGenerateNewCapsule = async () => {
    setIsGeneratingAi(true);
    try {
      const res = await fetch('/api/aprende30s/generate-daily-capsule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: selectedCategoryFilter !== 'all' ? selectedCategoryFilter : 'productividad_habitos'
        })
      });

      const data = await res.json();
      if (data.success && data.capsule) {
        // Build video package from the new capsule
        const newPkg: Aprende30Package = {
          id: `capsule-pkg-${Date.now()}`,
          channelHandle: '@Aprendeen30segundos',
          channelUrl: 'https://www.youtube.com/@Aprendeen30segundos',
          titulo: `${data.capsule.titulo} en 30 Segundos 🚀`,
          categoria: data.capsule.categoria || 'productividad_habitos',
          duracion_segundos: 30,
          banner_hook_superior: `🔴 ${data.capsule.titulo.toUpperCase()}`,
          gancho_inicial: data.capsule.gancho3s,
          guion_completo: `${data.capsule.gancho3s} ${data.capsule.explicacion30s} Guarda este video y síguenos en @Aprendeen30segundos.`,
          escenas: [
            {
              sceneNumber: 1,
              durationSec: 10,
              inicio_segundo: 0,
              fin_segundo: 10,
              stageTitle: 'El Gancho Disruptivo (0-10s)',
              visualPrompt: 'Surprised student looking at glowing golden holographic clock ticking down in vertical 9:16 aspect ratio, 8k cinematic lighting',
              narration: data.capsule.gancho3s,
              onScreenText: 'EL ERROR DEL 95%',
              secondaryTitle: '⚡ Gancho 30s',
              imageUrl: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=1080&q=85',
              cameraMovement: 'zoom_in_suave',
              subtitleSlots: [
                { id: 's1', text: data.capsule.gancho3s.slice(0, 30), startSec: 0, endSec: 5, label: 'Inicio' },
                { id: 's2', text: 'APRENDE EN 30 SEGUNDOS', startSec: 5, endSec: 10, label: 'Promesa' }
              ]
            },
            {
              sceneNumber: 2,
              durationSec: 10,
              inicio_segundo: 10,
              fin_segundo: 20,
              stageTitle: 'La Explicación Clave (10-20s)',
              visualPrompt: 'Dynamic 3D glowing gears and arrows connecting together effortlessly in high contrast vertical 9:16 layout, cyberpunk neon lights',
              narration: data.capsule.explicacion30s,
              onScreenText: 'EL SECRETO',
              secondaryTitle: '💡 La Clave',
              imageUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1080&q=85',
              cameraMovement: 'paneo_dinamico',
              subtitleSlots: [
                { id: 's3', text: 'EL SECRETO ESTÁ AQUÍ', startSec: 10, endSec: 15, label: 'Clave 1' },
                { id: 's4', text: 'APLICA ESTE PRINCIPIO', startSec: 15, endSec: 20, label: 'Clave 2' }
              ]
            },
            {
              sceneNumber: 3,
              durationSec: 10,
              inicio_segundo: 20,
              fin_segundo: 30,
              stageTitle: 'Acción y Suscripción (20-30s)',
              visualPrompt: 'Celebrating young creator with golden trophy icon floating and YouTube subscribe button animation, 9:16 vertical 8k',
              narration: `Aplica este reto hoy: ${data.capsule.retoDelDia}. Guarda este video y síguenos en @Aprendeen30segundos.`,
              onScreenText: 'PRUÉBALO HOY',
              secondaryTitle: '🚀 Cierre Viral',
              imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1080&q=85',
              cameraMovement: 'zoom_out_suave',
              subtitleSlots: [
                { id: 's5', text: 'PRUÉBALO HOY MISMO', startSec: 20, endSec: 25, label: 'Acción' },
                { id: 's6', text: 'SÍGUENOS @APRENDEEN30S', startSec: 25, endSec: 30, label: 'Canal' }
              ]
            }
          ],
          miniatura_texto: data.capsule.titulo.slice(0, 18).toUpperCase(),
          miniatura_visual: 'Charismatic person pointing to glowing holographic 3D icon with high contrast neon lights',
          ctr_estimado: 15.5,
          retencion_proyectada: 90,
          musica_sugerida: 'Lo-Fi Focus Beat a 124 BPM',
          descripcion_youtube: `⚡ ${data.capsule.titulo} en 30 segundos!\n\n👉 Suscríbete a @Aprendeen30segundos para hacks diarios.\n\n#Aprendeen30segundos #shorts`,
          hashtags: ['#Aprendeen30segundos', '#shorts', '#educacion'],
          llamado_accion: 'Guarda este video y suscríbete a @Aprendeen30segundos.',
          tarjeta_flash: data.capsule.tarjeta
        };

        const fullCapsule: Aprende30DailyCapsule = {
          ...data.capsule,
          videoPackage: newPkg
        };

        setCapsulesList([fullCapsule, ...capsulesList]);
        setActiveCapsuleIndex(0);

        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.error('Error generating daily capsule:', err);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Transfer capsule to the video editor
  const handleLoadIntoVideo = () => {
    if (activeCapsule.videoPackage) {
      onLoadCapsuleIntoVideoEditor(activeCapsule.videoPackage);
    } else {
      // Auto build package from capsule data
      const pkg: Aprende30Package = {
        id: `capsule-pkg-${Date.now()}`,
        channelHandle: '@Aprendeen30segundos',
        channelUrl: 'https://www.youtube.com/@Aprendeen30segundos',
        titulo: `${activeCapsule.titulo} en 30 Segundos 🚀`,
        categoria: activeCapsule.categoria,
        duracion_segundos: 30,
        banner_hook_superior: `🔴 ${activeCapsule.titulo.toUpperCase()}`,
        gancho_inicial: activeCapsule.gancho3s,
        guion_completo: `${activeCapsule.gancho3s} ${activeCapsule.explicacion30s} Guarda este video y síguenos en @Aprendeen30segundos.`,
        escenas: [
          {
            sceneNumber: 1,
            durationSec: 10,
            inicio_segundo: 0,
            fin_segundo: 10,
            stageTitle: 'El Gancho (0-10s)',
            visualPrompt: 'Dynamic 3D conceptual infographic in vertical 9:16, glowing sparks, dark room',
            narration: activeCapsule.gancho3s,
            onScreenText: 'EL ERROR DEL 95%',
            secondaryTitle: '⚡ Gancho 30s',
            imageUrl: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=1080&q=85',
            cameraMovement: 'zoom_in_suave',
            subtitleSlots: [
              { id: 's1', text: activeCapsule.gancho3s.slice(0, 30), startSec: 0, endSec: 5, label: 'Inicio' },
              { id: 's2', text: 'APRENDE EN 30 SEGUNDOS', startSec: 5, endSec: 10, label: 'Promesa' }
            ]
          },
          {
            sceneNumber: 2,
            durationSec: 10,
            inicio_segundo: 10,
            fin_segundo: 20,
            stageTitle: 'La Clave (10-20s)',
            visualPrompt: 'Glowing gears in 3D representing smart workflow, vertical 9:16',
            narration: activeCapsule.explicacion30s,
            onScreenText: 'EL SECRETO',
            secondaryTitle: '💡 La Clave',
            imageUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1080&q=85',
            cameraMovement: 'paneo_dinamico',
            subtitleSlots: [
              { id: 's3', text: 'EL SECRETO ESTÁ AQUÍ', startSec: 10, endSec: 15, label: 'Clave 1' },
              { id: 's4', text: 'APLICA ESTE PRINCIPIO', startSec: 15, endSec: 20, label: 'Clave 2' }
            ]
          },
          {
            sceneNumber: 3,
            durationSec: 10,
            inicio_segundo: 20,
            fin_segundo: 30,
            stageTitle: 'Acción (20-30s)',
            visualPrompt: 'Person in flow state at desk with floating checkmark, YouTube subscribe badge, 9:16',
            narration: `Reto de hoy: ${activeCapsule.retoDelDia}. Guarda este video y síguenos en @Aprendeen30segundos.`,
            onScreenText: 'PRUÉBALO HOY',
            secondaryTitle: '🚀 Cierre Viral',
            imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1080&q=85',
            cameraMovement: 'zoom_out_suave',
            subtitleSlots: [
              { id: 's5', text: 'PRUÉBALO HOY MISMO', startSec: 20, endSec: 25, label: 'Acción' },
              { id: 's6', text: 'SÍGUENOS @APRENDEEN30S', startSec: 25, endSec: 30, label: 'Canal' }
            ]
          }
        ],
        miniatura_texto: activeCapsule.titulo.slice(0, 18).toUpperCase(),
        miniatura_visual: 'Charismatic person pointing to glowing holographic 3D icon with high contrast neon lights',
        ctr_estimado: 15.2,
        retencion_proyectada: 90,
        musica_sugerida: 'Lo-Fi Focus Beat',
        descripcion_youtube: `⚡ ${activeCapsule.titulo} en 30 segundos!\n\n👉 Suscríbete a @Aprendeen30segundos para no perderte el hack de mañana.\n\n#Aprendeen30segundos #shorts`,
        hashtags: ['#Aprendeen30segundos', '#shorts', '#educacion'],
        llamado_accion: 'Guarda este video y suscríbete a @Aprendeen30segundos.',
        tarjeta_flash: activeCapsule.tarjeta
      };
      onLoadCapsuleIntoVideoEditor(pkg);
    }
  };

  const handleCopyText = (text: string, fieldKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldKey);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Channel Identity */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-red-950/70 via-slate-900/90 to-amber-950/60 border border-red-500/30 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-600 text-white shadow-sm flex items-center gap-1">
                <Flame className="w-3 h-3" />
                <span>Píldora de Sabiduría Diaria</span>
              </span>
              <span className="text-xs text-amber-300 font-bold">
                {activeCapsule.fecha}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
              Cápsula Diaria: Aprende en 30 Segundos
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
              La dosis diaria de conocimiento de alto impacto. Transfórmala en un guion, crea el video con un solo clic o exporta la tarjeta flash para tus redes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleToggleAudio}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isPlayingAudio
                  ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/30 animate-pulse'
                  : 'bg-white/10 text-slate-200 hover:bg-white/20'
              }`}
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
              <span>{isPlayingAudio ? 'Detener Voz' : 'Escuchar en 30s'}</span>
            </button>

            <button
              type="button"
              onClick={handleGenerateNewCapsule}
              disabled={isGeneratingAi}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white shadow-lg shadow-red-600/30 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingAi ? 'animate-spin' : ''}`} />
              <span>{isGeneratingAi ? 'Creando Cápsula...' : 'Nueva Cápsula con IA'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Capsule Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {capsulesList.map((cap, idx) => (
          <button
            key={cap.id}
            type="button"
            onClick={() => {
              setActiveCapsuleIndex(idx);
              if (isPlayingAudio) window.speechSynthesis.cancel();
              setIsPlayingAudio(false);
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border shrink-0 ${
              activeCapsuleIndex === idx
                ? 'bg-red-600 text-white border-red-500 shadow-md'
                : 'bg-slate-900/70 text-slate-400 border-white/10 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>{cap.icono}</span>
            <span className="truncate max-w-[200px]">{cap.titulo}</span>
          </button>
        ))}
      </div>

      {/* Main Capsule Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Capsule Content (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Main Card */}
          <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-6 space-y-5 shadow-xl">
            
            {/* Header */}
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400/15 text-amber-300 border border-amber-400/30 flex items-center gap-1.5">
                <span>{activeCapsule.icono}</span>
                <span>{activeCapsule.categoriaNombre}</span>
              </span>

              <button
                type="button"
                onClick={() => handleCopyText(
                  `🔴 ${activeCapsule.titulo.toUpperCase()}\n\n⚡ ${activeCapsule.gancho3s}\n\n${activeCapsule.explicacion30s}\n\n💡 Sabías que: ${activeCapsule.sabiasQue}\n\n🎯 Reto de hoy: ${activeCapsule.retoDelDia}\n\n👉 @Aprendeen30segundos`,
                  'capsule_all'
                )}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                {copiedField === 'capsule_all' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
                <span>{copiedField === 'capsule_all' ? '¡Copiado!' : 'Copiar Cápsula'}</span>
              </button>
            </div>

            {/* Title */}
            <div>
              <h3 className="text-2xl font-black text-white leading-tight">
                {activeCapsule.titulo}
              </h3>
            </div>

            {/* Hook of 3 Seconds */}
            <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/30">
              <div className="text-[11px] font-black text-red-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                <Flame className="w-3.5 h-3.5" />
                <span>El Gancho de los Primeros 3 Segundos:</span>
              </div>
              <p className="text-sm font-bold text-red-100 italic">
                "{activeCapsule.gancho3s}"
              </p>
            </div>

            {/* Explanation in 30 Seconds */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>La Explicación en 30 Segundos (Lectura Rápida):</span>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-white/5">
                {activeCapsule.explicacion30s}
              </p>
            </div>

            {/* Did you know & Daily Challenge */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-500/30">
                <div className="text-[11px] font-bold text-indigo-400 flex items-center gap-1 mb-1">
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>¿SABÍAS QUE?</span>
                </div>
                <p className="text-xs text-indigo-100 leading-snug">
                  {activeCapsule.sabiasQue}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/30">
                <div className="text-[11px] font-bold text-amber-400 flex items-center gap-1 mb-1">
                  <Target className="w-3.5 h-3.5" />
                  <span>RETO PRÁCTICO DE HOY</span>
                </div>
                <p className="text-xs text-amber-100 leading-snug">
                  {activeCapsule.retoDelDia}
                </p>
              </div>
            </div>

            {/* Master Quote */}
            {activeCapsule.citaMaestra && (
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                <p className="text-xs italic text-slate-300">
                  {activeCapsule.citaMaestra}
                </p>
              </div>
            )}

            {/* Action Bar: Load into Video / Card */}
            <div className="pt-2 border-t border-white/10 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleLoadIntoVideo}
                className="flex-1 min-w-[200px] flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-xs font-black bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white shadow-lg shadow-red-600/30 transition-all cursor-pointer"
              >
                <Film className="w-4 h-4" />
                <span>Crear Video de 30s con esta Cápsula</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenCardStudioWithData(activeCapsule.tarjeta)}
                className="flex items-center gap-1.5 px-4 py-3 rounded-2xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>Ver y Descargar Tarjeta Flash</span>
              </button>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: Interactive Mini Card Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/70 border border-white/10 rounded-3xl p-5 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Tarjeta Flash de esta Cápsula:
              </span>
              <span className="text-[10px] text-amber-400">Lista para publicar</span>
            </div>

            {/* Mini Visual Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-red-950/60 via-slate-950 to-black border-2 border-red-500/30 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-red-600 text-white">
                  @Aprendeen30segundos
                </span>
                <span className="text-[10px] font-bold text-amber-400">
                  {activeCapsule.categoriaNombre}
                </span>
              </div>

              <h4 className="text-base font-black text-white leading-tight">
                {activeCapsule.tarjeta?.titulo || activeCapsule.titulo}
              </h4>

              <p className="text-xs font-semibold text-amber-300">
                {activeCapsule.tarjeta?.subtitulo || activeCapsule.gancho3s}
              </p>

              <div className="space-y-1.5 pt-1">
                {(activeCapsule.tarjeta?.puntosClave || activeCapsule.puntosClave || []).slice(0, 3).map((pt, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-200">
                    <span className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 font-black text-[9px] flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-[11px] leading-snug">{pt}</span>
                  </div>
                ))}
              </div>

              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-200 font-medium">
                💡 <span className="font-bold text-white">Aplica esto hoy:</span> {activeCapsule.retoDelDia}
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[9px] text-slate-400">
                <span>Guarda este hack diario</span>
                <span className="font-bold text-amber-400">youtube.com/@Aprendeen30segundos</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onOpenCardStudioWithData(activeCapsule.tarjeta)}
              className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Abrir en Estudio de Tarjetas (Descargar PNG)</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
