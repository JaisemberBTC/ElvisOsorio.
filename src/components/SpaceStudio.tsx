import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Play, 
  Pause, 
  RotateCcw, 
  Copy, 
  Check, 
  Share2, 
  Smartphone, 
  Monitor, 
  Volume2, 
  VolumeX, 
  Film, 
  Clapperboard, 
  Bot, 
  Quote, 
  FileText, 
  Layers, 
  Lightbulb, 
  Download, 
  ExternalLink, 
  Youtube, 
  Facebook, 
  Flame, 
  Award, 
  CheckCircle2,
  Video,
  Captions,
  AlertCircle
} from 'lucide-react';
import { FaithScriptData } from '../types';
import { INITIAL_SCRIPT_DATA, SCRIPT_TEMPLATES } from '../data/initialData';
import { DevotionalReader } from '../utils/audioSynth';

export const SpaceStudio: React.FC = () => {
  const [scriptData, setScriptData] = useState<FaithScriptData>(INITIAL_SCRIPT_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [topic, setTopic] = useState('');
  const [format, setFormat] = useState('Reel / TikTok 9:16 (45-60s)');
  const [tone, setTone] = useState('Inspirador, reconfortante y lleno de fe');
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9'>('9:16');
  
  // Video Simulator state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Video Rendering / Export State
  const [isExportingVideo, setIsExportingVideo] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [publishToast, setPublishToast] = useState<{ platform: string; message: string } | null>(null);

  const timerRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const scenes = scriptData.scenes || [];
  const currentScene = scenes[currentSceneIdx] || scenes[0];
  const totalDuration = scenes.reduce((acc, s) => acc + (s.durationSec || 10), 0);

  // Generate Script & Storyboard via Gemini
  const handleGenerate = async (e?: React.FormEvent, customTopic?: string) => {
    if (e) e.preventDefault();
    const queryTopic = customTopic || topic || "Paz en la tormenta y renovación de fuerzas";
    
    setIsLoading(true);
    setIsPlaying(false);
    DevotionalReader.stop();
    setIsVoiceActive(false);

    try {
      const res = await fetch('/api/gemini/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: queryTopic,
          format,
          tone,
          durationSeconds: 50
        })
      });

      if (!res.ok) throw new Error('Error al conectar con el estudio de IA');
      const data = await res.json();
      setScriptData(data);
      setCurrentSceneIdx(0);
      setPlaybackTime(0);
    } catch (err: any) {
      console.error("Error generating script:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Video Simulator Timer Loop
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setInterval(() => {
        setPlaybackTime((prev) => {
          const nextTime = prev + 1;
          
          let accumulated = 0;
          for (let i = 0; i < scenes.length; i++) {
            accumulated += scenes[i].durationSec || 10;
            if (nextTime < accumulated) {
              if (currentSceneIdx !== i) {
                setCurrentSceneIdx(i);
                if (isVoiceActive) {
                  DevotionalReader.speak(scenes[i].narrationText);
                }
              }
              return nextTime;
            }
          }

          setIsPlaying(false);
          DevotionalReader.stop();
          return 0;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, scenes, currentSceneIdx, isVoiceActive]);

  const togglePlayback = () => {
    if (isPlaying) {
      setIsPlaying(false);
      DevotionalReader.stop();
    } else {
      setIsPlaying(true);
      if (isVoiceActive) {
        DevotionalReader.speak(currentScene?.narrationText || scriptData.hook);
      }
    }
  };

  const resetPlayback = () => {
    setIsPlaying(false);
    DevotionalReader.stop();
    setCurrentSceneIdx(0);
    setPlaybackTime(0);
  };

  const toggleVoice = () => {
    const nextState = !isVoiceActive;
    setIsVoiceActive(nextState);
    if (nextState && isPlaying && currentScene) {
      DevotionalReader.speak(currentScene.narrationText);
    } else {
      DevotionalReader.stop();
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Export Subtitles in standard .SRT format
  const handleDownloadSRT = () => {
    let srtContent = '';
    let accumulatedMs = 0;

    const formatTimestamp = (ms: number) => {
      const totalSec = Math.floor(ms / 1000);
      const hours = String(Math.floor(totalSec / 3600)).padStart(2, '0');
      const minutes = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0');
      const seconds = String(totalSec % 60).padStart(2, '0');
      const millis = String(ms % 1000).padStart(3, '0');
      return `${hours}:${minutes}:${seconds},${millis}`;
    };

    scenes.forEach((sc, idx) => {
      const startMs = accumulatedMs;
      const durationMs = (sc.durationSec || 10) * 1000;
      const endMs = startMs + durationMs;
      accumulatedMs = endMs;

      srtContent += `${idx + 1}\n`;
      srtContent += `${formatTimestamp(startMs)} --> ${formatTimestamp(endMs)}\n`;
      srtContent += `${sc.onScreenText}\n`;
      srtContent += `${sc.narrationText}\n\n`;
    });

    const blob = new Blob([srtContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Subtitulos_${scriptData.title.replace(/\s+/g, '_').slice(0, 30)}.srt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Render & Record full video directly in browser using Canvas & MediaRecorder
  const handleRenderAndDownloadVideo = async () => {
    if (!canvasRef.current) return;
    setIsExportingVideo(true);
    setExportProgress(0);

    const canvas = canvasRef.current;
    const width = aspectRatio === '9:16' ? 720 : 1280;
    const height = aspectRatio === '9:16' ? 1280 : 720;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setIsExportingVideo(false);
      return;
    }

    try {
      // Setup Audio Stream with Celestial Harmonic Pad
      let combinedStream: MediaStream;
      let audioCtx: AudioContext | null = null;
      let osc1: OscillatorNode | null = null;
      let osc2: OscillatorNode | null = null;

      try {
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const audioDest = audioCtx.createMediaStreamDestination();
        
        // 432Hz tuning harmonic pad
        osc1 = audioCtx.createOscillator();
        osc2 = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(432 / 2, audioCtx.currentTime); // 216 Hz warm sub
        
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(432 * 1.5 / 2, audioCtx.currentTime); // 324 Hz harmonic fifth

        gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);

        osc1.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.connect(audioDest);

        osc1.start();
        osc2.start();

        const videoStream = canvas.captureStream(30);
        combinedStream = new MediaStream([
          ...videoStream.getVideoTracks(),
          ...audioDest.stream.getAudioTracks()
        ]);
      } catch (audioErr) {
        combinedStream = canvas.captureStream(30);
      }

      let mediaRecorder: MediaRecorder;
      const mimeTypes = ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm', 'video/mp4'];
      let selectedMime = '';
      for (const m of mimeTypes) {
        if (MediaRecorder.isTypeSupported(m)) {
          selectedMime = m;
          break;
        }
      }

      mediaRecorder = new MediaRecorder(combinedStream, selectedMime ? { mimeType: selectedMime } : undefined);
      const recordedChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          recordedChunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        if (osc1) try { osc1.stop(); } catch(e){}
        if (osc2) try { osc2.stop(); } catch(e){}
        if (audioCtx) try { audioCtx.close(); } catch(e){}

        const blob = new Blob(recordedChunks, { type: selectedMime || 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Video_Devocional_${scriptData.title.replace(/\s+/g, '_').slice(0, 25)}.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setIsExportingVideo(false);
        setExportProgress(100);
      };

      mediaRecorder.start();

      // Render frames across scenes
      const totalScenes = scenes.length;
      const fps = 30;
      const sceneFrames = scenes.map((s) => (s.durationSec || 8) * fps);
      const totalFrames = sceneFrames.reduce((a, b) => a + b, 0);
      let currentFrame = 0;

      for (let sIdx = 0; sIdx < totalScenes; sIdx++) {
        const sc = scenes[sIdx];
        const numFrames = sceneFrames[sIdx];

        for (let f = 0; f < numFrames; f++) {
          currentFrame++;
          const progress = currentFrame / totalFrames;
          setExportProgress(Math.floor(progress * 100));

          // Draw Canvas Frame
          ctx.save();
          // Dark celestial background
          const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
          if (sIdx % 3 === 0) {
            bgGrad.addColorStop(0, '#0c192c');
            bgGrad.addColorStop(0.5, '#020617');
            bgGrad.addColorStop(1, '#1e1305');
          } else if (sIdx % 3 === 1) {
            bgGrad.addColorStop(0, '#1c120c');
            bgGrad.addColorStop(0.5, '#020617');
            bgGrad.addColorStop(1, '#091e3a');
          } else {
            bgGrad.addColorStop(0, '#020617');
            bgGrad.addColorStop(0.5, '#1e1b4b');
            bgGrad.addColorStop(1, '#020617');
          }
          ctx.fillStyle = bgGrad;
          ctx.fillRect(0, 0, width, height);

          // Atmospheric glowing light aura
          const aura = ctx.createRadialGradient(width / 2, height * 0.35, 10, width / 2, height * 0.35, width * 0.6);
          aura.addColorStop(0, 'rgba(245, 158, 11, 0.25)');
          aura.addColorStop(0.6, 'rgba(56, 189, 248, 0.1)');
          aura.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = aura;
          ctx.fillRect(0, 0, width, height);

          // Floating golden particles (procedural)
          for (let p = 0; p < 18; p++) {
            const px = ((p * 97 + currentFrame * 1.5) % width);
            const py = ((p * 131 + currentFrame * 2) % height);
            const pSize = (p % 3) + 1.5;
            ctx.fillStyle = `rgba(245, 215, 120, ${0.2 + (p % 4) * 0.15})`;
            ctx.beginPath();
            ctx.arc(px, py, pSize, 0, Math.PI * 2);
            ctx.fill();
          }

          // Top Header Watermark
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.font = 'bold 24px serif';
          ctx.textAlign = 'center';
          ctx.fillText('🕊️ ESPACIO DE FE & ORACIÓN', width / 2, 70);

          // Scene Indicator badge
          ctx.fillStyle = 'rgba(245, 158, 11, 0.2)';
          ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(width / 2 - 120, 100, 240, 36, 18);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#fef08a';
          ctx.font = 'bold 16px sans-serif';
          ctx.fillText(`ESCENA ${sc.sceneNumber} DE ${totalScenes}`, width / 2, 124);

          // On-Screen Subtitle Hook Box
          ctx.fillStyle = 'rgba(2, 6, 23, 0.85)';
          ctx.strokeStyle = 'rgba(245, 158, 11, 0.8)';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.roundRect(40, height * 0.25, width - 80, 100, 24);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#fbbf24';
          ctx.font = 'bold 28px sans-serif';
          ctx.fillText(sc.onScreenText, width / 2, height * 0.25 + 60);

          // Scripture / Narration Card
          ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.roundRect(50, height * 0.42, width - 100, height * 0.35, 24);
          ctx.fill();
          ctx.stroke();

          // Narration Text wrapped
          ctx.fillStyle = '#f8fafc';
          ctx.font = 'italic 24px serif';
          ctx.textAlign = 'center';

          const words = sc.narrationText.split(' ');
          let line = '';
          let lineY = height * 0.42 + 60;
          const maxLineWidth = width - 160;

          for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxLineWidth && n > 0) {
              ctx.fillText(line, width / 2, lineY);
              line = words[n] + ' ';
              lineY += 36;
            } else {
              line = testLine;
            }
          }
          ctx.fillText(line, width / 2, lineY);

          // Verse Reference anchor
          ctx.fillStyle = '#38bdf8';
          ctx.font = 'bold 20px sans-serif';
          ctx.fillText(`— ${scriptData.primaryBibleVerse.reference}`, width / 2, height * 0.73);

          // Bottom CTA Banner
          ctx.fillStyle = 'rgba(245, 158, 11, 0.15)';
          ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(40, height - 120, width - 80, 56, 16);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 20px sans-serif';
          ctx.fillText(sIdx === totalScenes - 1 ? scriptData.callToAction : '❤️ Toca dos veces • Guarda y comparte', width / 2, height - 85);

          // Progress line
          ctx.fillStyle = '#f59e0b';
          ctx.fillRect(40, height - 40, (width - 80) * progress, 8);

          ctx.restore();

          // Wait a tick every 5 frames so browser doesn't choke
          if (f % 5 === 0) {
            await new Promise((r) => setTimeout(r, 10));
          }
        }
      }

      mediaRecorder.stop();
    } catch (err: any) {
      console.error("Video export error:", err);
      setIsExportingVideo(false);
    }
  };

  // Direct Social Publishing Actions
  const handlePublishToYouTube = () => {
    const formattedTitle = `🔴 ${scriptData.title} | Oración & Fe #Shorts`;
    const fullDescription = `${scriptData.hook}\n\n📖 Versículo: ${scriptData.primaryBibleVerse.reference} - "${scriptData.primaryBibleVerse.text}"\n\n🙏 Oración: ${scriptData.closingPrayer}\n\n💬 ${scriptData.callToAction}\n\n${scriptData.socialMetadata.hashtags.join(' ')}`;
    
    navigator.clipboard.writeText(`${formattedTitle}\n\n---\n\n${fullDescription}`);
    setPublishToast({
      platform: 'YouTube',
      message: '¡Título, descripción y hashtags copiados! Abriendo YouTube Studio...'
    });
    setTimeout(() => setPublishToast(null), 6000);

    window.open('https://studio.youtube.com/', '_blank');
  };

  const handlePublishToFacebook = () => {
    const fbText = `🕊️ ${scriptData.title}\n\n"${scriptData.hook}"\n\n📖 ${scriptData.primaryBibleVerse.reference}: "${scriptData.primaryBibleVerse.text}"\n\n🙏 ${scriptData.closingPrayer}\n\n💬 ${scriptData.callToAction}\n\n${scriptData.socialMetadata.hashtags.join(' ')}`;
    
    navigator.clipboard.writeText(fbText);
    setPublishToast({
      platform: 'Facebook',
      message: '¡Texto con llamado a la acción copiado! Abriendo Facebook Reels Creator...'
    });
    setTimeout(() => setPublishToast(null), 6000);

    window.open('https://www.facebook.com/reels/create', '_blank');
  };

  const handlePublishToTikTok = () => {
    const tikTokCaption = `${scriptData.hook} 🙏 ${scriptData.callToAction} ${scriptData.socialMetadata.hashtags.slice(0, 5).join(' ')}`;
    navigator.clipboard.writeText(tikTokCaption);
    setPublishToast({
      platform: 'TikTok',
      message: '¡Caption viral copiado! Abriendo TikTok Creator Center...'
    });
    setTimeout(() => setPublishToast(null), 6000);

    window.open('https://www.tiktok.com/creator-center/upload', '_blank');
  };

  const formatFullScript = () => {
    let md = `# ${scriptData.title}\n\n`;
    md += `**Gancho:** ${scriptData.hook}\n`;
    md += `**Tema:** ${scriptData.mainTheme}\n`;
    md += `**Versículo Clave:** ${scriptData.primaryBibleVerse.reference} - "${scriptData.primaryBibleVerse.text}"\n\n`;
    md += `## ESCENAS DEL STORYBOARD\n\n`;
    scriptData.scenes.forEach((s) => {
      md += `### Escena ${s.sceneNumber} (${s.durationSec}s)\n`;
      md += `- **Texto en Pantalla:** ${s.onScreenText}\n`;
      md += `- **Locución:** ${s.narrationText}\n`;
      md += `- **Prompt Visual:** ${s.visualPrompt}\n`;
      md += `- **Cámara:** ${s.cameraMovement}\n`;
      md += `- **Atmósfera:** ${s.atmosphere || 'Serena'}\n\n`;
    });
    md += `## ORACIÓN DE CIERRE & LLAMADO A LA ACCIÓN\n`;
    md += `${scriptData.closingPrayer}\n\n`;
    md += `**CTA:** ${scriptData.callToAction}\n\n`;
    md += `## METADATOS PARA REDES\n`;
    md += `**Descripción:**\n${scriptData.socialMetadata.caption}\n\n`;
    md += `**Hashtags:** ${scriptData.socialMetadata.hashtags.join(' ')}\n`;
    return md;
  };

  const sceneBackgrounds = [
    'from-amber-950 via-stone-900 to-amber-900/40',
    'from-blue-950 via-slate-900 to-indigo-950',
    'from-stone-900 via-amber-950/60 to-yellow-950/50',
    'from-stone-950 via-purple-950/40 to-stone-900'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Hidden offscreen canvas for rendering high-res video */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Floating Notification Toast */}
      {publishToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-900/95 border border-amber-400/40 shadow-2xl backdrop-blur-xl flex items-center gap-3 text-slate-100 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="text-xs">
            <p className="font-bold text-amber-300">{publishToast.platform}</p>
            <p className="text-slate-300">{publishToast.message}</p>
          </div>
        </div>
      )}

      {/* Studio Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900/40 border border-white/5 backdrop-blur-xl shadow-2xl p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            Fórmula de Alta Retención: Gancho (Hook 0-3s) • Desarrollo • Cierre Viral
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-tight text-white font-cinzel">
            Estudio de Creación & Publicación de Videos de Fe
          </h2>
          <p className="text-sm md:text-base text-slate-400 font-sans leading-relaxed">
            Genera guiones diseñados para retener a la audiencia desde el primer segundo, renderiza y descarga el video (.webm), exporta subtítulos (.srt) y publica con un clic en YouTube Shorts, Facebook Reels, TikTok e Instagram.
          </p>
        </div>

        {/* High-Retention Viral Presets */}
        <div className="relative z-10 mt-6 pt-4 border-t border-white/5">
          <p className="text-xs font-semibold text-slate-400 mb-2.5 flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            Plantillas Virales de Alta Retención (Click para Generar):
          </p>
          <div className="flex flex-wrap gap-2">
            {SCRIPT_TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.id}
                onClick={() => {
                  setTopic(tmpl.topic);
                  setTone(tmpl.tone);
                  handleGenerate(undefined, tmpl.topic);
                }}
                className="px-3.5 py-1.5 rounded-xl text-xs font-medium bg-white/5 hover:bg-amber-400/20 text-slate-300 hover:text-amber-200 border border-white/5 hover:border-amber-400/40 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>{tmpl.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Studio Workspace: 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Creator Prompter & Multi-Agent Script Inspector */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Prompt & Parameters Form */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 border border-white/5 backdrop-blur-xl shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <h3 className="text-base font-bold text-white flex items-center gap-2 font-cinzel">
                <Clapperboard className="w-4 h-4 text-amber-400" />
                Configurar Nuevo Video de Fe
              </h3>
              <span className="text-xs text-slate-500">Gemini 3.7 Flash</span>
            </div>

            <form onSubmit={(e) => handleGenerate(e)} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Tema, Versículo o Motivo de Oración
                </label>
                <textarea
                  rows={2}
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Ej: Si estás viendo esto antes de dormir ora conmigo, Salmo 91 rompe cadenas, 3 cosas que Dios te dice hoy..."
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-950/60 border border-white/10 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/30 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Formato de Publicación
                  </label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-950/60 border border-white/10 text-slate-200 text-xs focus:outline-none focus:border-amber-400/60"
                  >
                    <option value="Reel / TikTok 9:16 (45-60s)" className="bg-slate-900">Reel / TikTok 9:16 (45-60s)</option>
                    <option value="YouTube Shorts 9:16 (30-45s)" className="bg-slate-900">YouTube Shorts 9:16 (30-45s)</option>
                    <option value="YouTube Video 16:9 (60-90s)" className="bg-slate-900">YouTube Horizontal 16:9 (60-90s)</option>
                    <option value="Devocional Cuadrado 1:1 (Instagram)" className="bg-slate-900">Devocional Cuadrado 1:1 (Instagram)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Tono Espiritual
                  </label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-950/60 border border-white/10 text-slate-200 text-xs focus:outline-none focus:border-amber-400/60"
                  >
                    <option value="Inspirador, reconfortante y lleno de fe" className="bg-slate-900">Inspirador & Reconfortante</option>
                    <option value="Con autoridad espiritual y fe inquebrantable" className="bg-slate-900">Autoridad Espiritual & Fe</option>
                    <option value="Íntimo, sereno y oracional para la noche" className="bg-slate-900">Íntimo & Oracional para la Noche</option>
                    <option value="Épico con enseñanza bíblica histórica" className="bg-slate-900">Épico & Enseñanza Bíblica</option>
                    <option value="Acción de gracias y celebración gozosa" className="bg-slate-900">Acción de Gracias & Gozo</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:w-auto px-7 py-3 rounded-2xl text-sm font-bold bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.25)] transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin text-slate-950" />
                      <span>Generando Guion de Alta Retención con IA...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-slate-950" />
                      <span>Generar Guion & Storyboard Completo</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Current Script Details & Multi-Scene Storyboard */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 border border-white/5 backdrop-blur-xl shadow-2xl space-y-6">
            
            {/* Title & Key Anchors */}
            <div className="space-y-4 pb-4 border-b border-white/5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-widest">
                    {scriptData.mainTheme}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white font-cinzel mt-0.5">
                    {scriptData.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadSRT}
                    className="px-3 py-1.5 rounded-xl text-xs font-medium bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                    title="Descargar archivo de subtítulos .SRT"
                  >
                    <Captions className="w-3.5 h-3.5 text-amber-400" />
                    <span>Subtítulos .SRT</span>
                  </button>

                  <button
                    onClick={() => handleCopy(formatFullScript(), 'all-script')}
                    className="px-3 py-1.5 rounded-xl text-xs font-medium bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                    title="Copiar Guion Completo en Markdown"
                  >
                    {copiedKey === 'all-script' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'all-script' ? 'Copiado' : 'Copiar Todo'}</span>
                  </button>
                </div>
              </div>

              {/* Hook Card (0-3s) */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3.5 shadow-inner">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-300 shrink-0 mt-0.5">
                  <Flame className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                      ⚡ GANCHO INICIAL (HOOK 0-3s):
                    </p>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 font-semibold">
                      Interrupción de scroll
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 font-medium italic mt-1 leading-relaxed">
                    "{scriptData.hook}"
                  </p>
                </div>
              </div>

              {/* Primary Scripture Box */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-start gap-3.5">
                <Quote className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-amber-300 font-cinzel">
                    {scriptData.primaryBibleVerse.reference}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-200 font-scripture italic mt-0.5 leading-relaxed">
                    "{scriptData.primaryBibleVerse.text}"
                  </p>
                </div>
              </div>

              {/* Closing Prayer & Viral CTA Box */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 space-y-2">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                    👑 Cierre de Decreto & Llamado a la Acción (CTA Viral):
                  </span>
                </div>
                <p className="text-xs text-slate-300 italic">
                  "{scriptData.closingPrayer}"
                </p>
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-300">
                  📣 CTA: {scriptData.callToAction}
                </div>
              </div>
            </div>

            {/* Scenes Breakdown (Director's Storyboard) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  Desglose de Escenas ({scenes.length} Escenas • {totalDuration}s)
                </h4>
                <span className="text-[11px] text-slate-400">
                  Música: <strong className="text-slate-300 font-normal">{scriptData.musicMood}</strong>
                </span>
              </div>

              <div className="space-y-3">
                {scenes.map((scene, idx) => {
                  const isActive = currentSceneIdx === idx;
                  return (
                    <div
                      key={scene.sceneNumber || idx}
                      onClick={() => {
                        setCurrentSceneIdx(idx);
                        if (isVoiceActive) DevotionalReader.speak(scene.narrationText);
                      }}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
                        isActive
                          ? 'bg-slate-900/80 border-amber-400/60 shadow-[0_0_20px_rgba(245,158,11,0.15)] ring-1 ring-amber-400/40'
                          : 'bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/[0.08]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            isActive ? 'bg-amber-400 text-slate-950' : 'bg-white/10 text-slate-400'
                          }`}>
                            {scene.sceneNumber}
                          </span>
                          <span className="text-xs font-bold text-white">
                            Escena {scene.sceneNumber}
                          </span>
                          <span className="text-[10px] text-slate-400 px-2 py-0.5 rounded-full bg-slate-950/60 border border-white/10">
                            {scene.durationSec}s
                          </span>
                        </div>
                        
                        {scene.atmosphere && (
                          <span className="text-[10px] text-slate-400 italic hidden sm:inline">
                            🎨 {scene.atmosphere}
                          </span>
                        )}
                      </div>

                      {/* Subtitle / On-screen Badge */}
                      <div className="mb-2.5">
                        <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/20">
                          Texto en Pantalla: "{scene.onScreenText}"
                        </span>
                      </div>

                      {/* Narration */}
                      <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 mb-2">
                        <p className="text-xs text-slate-300 font-sans leading-relaxed">
                          <strong className="text-amber-400 font-medium">🎙️ Locución:</strong> {scene.narrationText}
                        </p>
                      </div>

                      {/* Visual Prompt & Camera */}
                      <div className="text-[11px] text-slate-400 space-y-1">
                        <p>
                          <strong className="text-slate-300">🖼️ Prompt Visual:</strong> {scene.visualPrompt}
                        </p>
                        <p>
                          <strong className="text-slate-300">🎥 Cámara:</strong> {scene.cameraMovement}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Direct Social Media Publishing Hub */}
            <div className="p-6 rounded-3xl bg-slate-950/80 border border-amber-400/20 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white font-cinzel flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-amber-400" />
                    Centro de Publicación Rápida en Redes
                  </h4>
                  <p className="text-xs text-slate-400">
                    Copia el contenido optimizado y abre el creador en 1 clic
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* YouTube Studio Button */}
                <button
                  onClick={handlePublishToYouTube}
                  className="p-3.5 rounded-2xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-slate-100 flex items-center justify-between transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold">
                      <Youtube className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-white group-hover:text-red-300 transition-colors">
                        Subir a YouTube Shorts
                      </p>
                      <p className="text-[10px] text-slate-400">Copia Título SEO + Tags</p>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
                </button>

                {/* Facebook Creator Button */}
                <button
                  onClick={handlePublishToFacebook}
                  className="p-3.5 rounded-2xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-slate-100 flex items-center justify-between transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                      <Facebook className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors">
                        Publicar en Facebook Reels
                      </p>
                      <p className="text-[10px] text-slate-400">Copia Copy con Amén</p>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
                </button>

                {/* TikTok Creator Button */}
                <button
                  onClick={handlePublishToTikTok}
                  className="p-3.5 rounded-2xl bg-pink-600/20 hover:bg-pink-600/30 border border-pink-500/30 text-slate-100 flex items-center justify-between transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-600 to-cyan-500 text-white flex items-center justify-center font-bold text-xs">
                      TT
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-white group-hover:text-pink-300 transition-colors">
                        Subir a TikTok Web
                      </p>
                      <p className="text-[10px] text-slate-400">Copia Hook Viral</p>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
                </button>

                {/* Instagram Direct */}
                <button
                  onClick={() => {
                    handleCopy(
                      `${scriptData.socialMetadata.caption}\n\n${scriptData.socialMetadata.hashtags.join(' ')}`,
                      'insta-copy'
                    );
                    setPublishToast({
                      platform: 'Instagram',
                      message: '¡Texto y hashtags copiados! Abriendo Instagram...'
                    });
                    setTimeout(() => setPublishToast(null), 5000);
                    window.open('https://www.instagram.com/', '_blank');
                  }}
                  className="p-3.5 rounded-2xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-slate-100 flex items-center justify-between transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 via-pink-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs">
                      IG
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                        Publicar en Instagram
                      </p>
                      <p className="text-[10px] text-slate-400">Copia Descripción & Tags</p>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
                </button>
              </div>

              {/* Caption & Hashtags Preview */}
              <div className="pt-2 border-t border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-400">
                    Descripción y Hashtags automáticos:
                  </span>
                  <button
                    onClick={() => handleCopy(
                      `${scriptData.socialMetadata.caption}\n\n${scriptData.socialMetadata.hashtags.join(' ')}`,
                      'social-copy'
                    )}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    {copiedKey === 'social-copy' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'social-copy' ? 'Copiado' : 'Copiar'}</span>
                  </button>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 text-xs text-slate-300 leading-relaxed">
                  {scriptData.socialMetadata.caption}
                </div>
                <div className="flex flex-wrap gap-1">
                  {scriptData.socialMetadata.hashtags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-900/60 text-amber-400/90 border border-white/5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Live Video Simulator, Downloader & Reel Player */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="sticky top-24 p-6 sm:p-7 rounded-3xl bg-slate-900/40 border border-white/5 backdrop-blur-xl shadow-2xl space-y-5">
            
            {/* Simulator Header & Aspect Ratio Selector */}
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="text-sm font-bold text-white font-cinzel">
                  Simulador de Video en Vivo
                </h3>
              </div>

              <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-white/10 text-xs">
                <button
                  onClick={() => setAspectRatio('9:16')}
                  className={`p-1.5 rounded-lg flex items-center gap-1 font-medium transition-colors cursor-pointer ${
                    aspectRatio === '9:16' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Formato Vertical 9:16 (TikTok, Reels, Shorts)"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>9:16</span>
                </button>
                <button
                  onClick={() => setAspectRatio('16:9')}
                  className={`p-1.5 rounded-lg flex items-center gap-1 font-medium transition-colors cursor-pointer ${
                    aspectRatio === '16:9' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Formato Horizontal 16:9 (YouTube)"
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>16:9</span>
                </button>
              </div>
            </div>

            {/* Video Canvas Simulator */}
            <div className="flex justify-center">
              <div
                className={`relative overflow-hidden rounded-3xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.8)] bg-gradient-to-b ${
                  sceneBackgrounds[currentSceneIdx % sceneBackgrounds.length]
                } transition-all duration-700 flex flex-col justify-between p-5 ${
                  aspectRatio === '9:16' ? 'w-[280px] sm:w-[310px] h-[520px]' : 'w-full h-[320px]'
                }`}
              >
                {/* Decorative background glow & light ray effects */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-400/20 rounded-full blur-2xl pointer-events-none animate-pulse" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-slate-950/90 pointer-events-none" />

                {/* Top Video Overlay: Watermark & Chapter */}
                <div className="relative z-10 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/70 backdrop-blur-md border border-white/10 text-slate-200">
                    <span>🕊️</span>
                    <span className="text-[10px] font-bold font-cinzel">FE VIVA</span>
                  </div>

                  <div className="px-2.5 py-1 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-500/40 text-amber-300 text-[10px] font-semibold">
                    Escena {currentScene?.sceneNumber || 1}/{scenes.length}
                  </div>
                </div>

                {/* Center Content: Animated Scripture Badge & Key Verse */}
                <div className="relative z-10 text-center space-y-4 my-auto">
                  {/* Dynamic On-Screen Subtitle Tag */}
                  <div className="inline-block px-3 py-1.5 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-amber-400/50 shadow-lg animate-bounce">
                    <p className="text-xs sm:text-sm font-extrabold text-amber-300 tracking-wide uppercase font-cinzel">
                      {currentScene?.onScreenText || scriptData.hook}
                    </p>
                  </div>

                  {/* Primary Verse or Scene Narration Highlight */}
                  <div className="p-4 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-white/10 text-slate-100 shadow-xl max-w-xs mx-auto">
                    <p className="text-xs sm:text-sm font-scripture italic leading-relaxed text-amber-100/90">
                      "{currentScene?.narrationText || scriptData.primaryBibleVerse.text}"
                    </p>
                    <p className="text-[10px] font-bold text-amber-400 mt-1.5 font-cinzel">
                      — {scriptData.primaryBibleVerse.reference}
                    </p>
                  </div>
                </div>

                {/* Bottom Video Overlay: Closing Prayer / CTA */}
                <div className="relative z-10 space-y-2">
                  <div className="px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/10 text-center">
                    <p className="text-[11px] font-medium text-slate-300">
                      {currentSceneIdx === scenes.length - 1 ? scriptData.callToAction : "Toca dos veces si recibes esta palabra"}
                    </p>
                  </div>

                  {/* Scene Progress Bars */}
                  <div className="flex gap-1">
                    {scenes.map((_, idx) => (
                      <div
                        key={idx}
                        className={`h-1 flex-1 rounded-full transition-all ${
                          idx < currentSceneIdx
                            ? 'bg-amber-400'
                            : idx === currentSceneIdx
                            ? 'bg-amber-400 animate-pulse'
                            : 'bg-slate-700/60'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Simulator Controls & Real Video Downloader */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>Tiempo: {playbackTime}s / {totalDuration}s</span>
                <span>Escena {currentSceneIdx + 1} de {scenes.length}</span>
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={resetPlayback}
                  className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 transition-colors cursor-pointer"
                  title="Reiniciar reproducción"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={togglePlayback}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.25)] transition-all cursor-pointer"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4 text-slate-950" />
                      <span>Pausar</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 text-slate-950" />
                      <span>Reproducir Reel</span>
                    </>
                  )}
                </button>

                <button
                  onClick={toggleVoice}
                  className={`p-3 rounded-2xl transition-colors cursor-pointer ${
                    isVoiceActive
                      ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                      : 'bg-white/5 text-slate-400 hover:text-slate-200 border border-white/5'
                  }`}
                  title={isVoiceActive ? "Voz en off activa" : "Activar voz en off (Text to Speech)"}
                >
                  {isVoiceActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
              </div>

              {/* Direct Render & Download Video (.webm / .mp4) Button */}
              <div className="pt-2">
                <button
                  onClick={handleRenderAndDownloadVideo}
                  disabled={isExportingVideo}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(245,158,11,0.3)] transition-all cursor-pointer disabled:opacity-60"
                >
                  {isExportingVideo ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin text-slate-950" />
                      <span>Renderizando Video ({exportProgress}%)...</span>
                    </>
                  ) : (
                    <>
                      <Video className="w-4 h-4 text-slate-950" />
                      <span>🎬 Renderizar & Descargar Video para Redes (.WEBM)</span>
                    </>
                  )}
                </button>
                <p className="text-[10px] text-center text-slate-400 mt-1.5">
                  Listo para subir directamente a TikTok, YouTube Shorts, Reels y Facebook
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
