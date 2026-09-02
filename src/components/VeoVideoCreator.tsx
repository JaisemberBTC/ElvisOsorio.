import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Video, 
  Play, 
  Pause, 
  Download, 
  Upload, 
  Wand2, 
  Film, 
  Eye, 
  RefreshCw, 
  Volume2, 
  VolumeX, 
  Layers, 
  Compass, 
  Sun, 
  Sparkle, 
  Sliders, 
  Maximize2,
  Check,
  FolderSync,
  HardDrive,
  Flame,
  ArrowRight,
  Clapperboard
} from 'lucide-react';
import { JESUS_ARTWORKS, JesusArtwork } from '../data/jesusVisuals';
import { VeoMotionConfig, VeoGeneratedClip } from '../types';
import { ambientSound } from '../utils/audioSynth';
import { uploadVideoToDrive } from '../services/googleDriveService';
import { CinematicPromptBuilder, CinematicPromptData } from './CinematicPromptBuilder';
import confetti from 'canvas-confetti';

interface VeoVideoCreatorProps {
  onSendToCapcutTimeline?: (clip: {
    title: string;
    imageUrl: string;
    durationSec: number;
    visualPrompt: string;
    onScreenText: string;
    narrationText: string;
  }) => void;
  onOpenCapcut?: () => void;
}

export const VeoVideoCreator: React.FC<VeoVideoCreatorProps> = ({
  onSendToCapcutTimeline,
  onOpenCapcut
}) => {
  // Source Image Selection
  const [selectedArtwork, setSelectedArtwork] = useState<JesusArtwork>(JESUS_ARTWORKS[0]);
  const [customImageUrl, setCustomImageUrl] = useState<string | null>(null);
  const [customImageName, setCustomImageName] = useState<string>('Imagen Personalizada');
  
  // Motion Configuration
  const [cameraMovement, setCameraMovement] = useState<'parallax-3d' | 'orbital-arc' | 'crane-ascent' | 'living-breath' | 'glory-pulse' | 'anamorphic-drift'>('parallax-3d');
  const [intensity, setIntensity] = useState<'gentle' | 'cinematic' | 'dramatic'>('cinematic');
  const [durationSec, setDurationSec] = useState<number>(5);
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9' | '1:1'>('9:16');
  const [fps, setFps] = useState<25 | 30 | 60>(30);
  const [lightingEffect, setLightingEffect] = useState<'celestial-sun-rays' | 'ethereal-glow' | 'divine-shimmer' | 'golden-particles' | 'none'>('celestial-sun-rays');
  const [audioTrack, setAudioTrack] = useState<'432hz-solfeggio' | 'celestial-harp' | 'mountain-wind' | 'temple-bells' | 'none'>('432hz-solfeggio');
  
  // User Prompt & Gemini AI Directives
  const [userPrompt, setUserPrompt] = useState<string>('Jesús resucitado con rayos de gloria celestial, respiración viva y túnica mecida por el viento santo');
  const [showPromptBuilder, setShowPromptBuilder] = useState<boolean>(false);
  const [isEnhancingPrompt, setIsEnhancingPrompt] = useState<boolean>(false);
  const [enhancedVeoData, setEnhancedVeoData] = useState<{
    veoCinematicPrompt?: string;
    spanishDescription?: string;
    cameraDirective?: string;
    lightingDirective?: string;
    particleDirective?: string;
    recommendedMusicTrack?: string;
  } | null>(null);

  const handleApplyStructuredPrompt = (formattedPrompt: string, data?: CinematicPromptData) => {
    setUserPrompt(formattedPrompt);
    if (data) {
      if (data.cameraMovement.toLowerCase().includes('orbital') || data.cameraMovement.toLowerCase().includes('giro')) {
        setCameraMovement('orbital-arc');
      } else if (data.cameraMovement.toLowerCase().includes('ascendente') || data.cameraMovement.toLowerCase().includes('tilt')) {
        setCameraMovement('crane-ascent');
      } else {
        setCameraMovement('parallax-3d');
      }

      if (data.lightingAtmosphere.toLowerCase().includes('rayo') || data.lightingAtmosphere.toLowerCase().includes('dorad')) {
        setLightingEffect('celestial-sun-rays');
      } else if (data.lightingAtmosphere.toLowerCase().includes('partícula') || data.lightingAtmosphere.toLowerCase().includes('oro')) {
        setLightingEffect('golden-particles');
      } else {
        setLightingEffect('ethereal-glow');
      }

      if (data.nativeAudio.toLowerCase().includes('432')) {
        setAudioTrack('432hz-solfeggio');
      } else if (data.nativeAudio.toLowerCase().includes('arpa')) {
        setAudioTrack('celestial-harp');
      } else if (data.nativeAudio.toLowerCase().includes('viento') || data.nativeAudio.toLowerCase().includes('brisa')) {
        setAudioTrack('mountain-wind');
      }
    }
  };

  // Playback & Canvas Animation State
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isRenderingVideo, setIsRenderingVideo] = useState<boolean>(false);
  const [renderProgress, setRenderProgress] = useState<number>(0);
  const [isSavingToDrive, setIsSavingToDrive] = useState<boolean>(false);
  const [driveSaveSuccess, setDriveSaveSuccess] = useState<boolean>(false);
  const [sentToCapcutSuccess, setSentToCapcutSuccess] = useState<boolean>(false);

  // Generated Clips History
  const [generatedClips, setGeneratedClips] = useState<VeoGeneratedClip[]>([]);

  // Canvas Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const imgElementRef = useRef<HTMLImageElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const activeImageSrc = customImageUrl || selectedArtwork.src;
  const activeImageTitle = customImageUrl ? customImageName : selectedArtwork.name;

  // Load and cache active image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imgElementRef.current = img;
    };
    img.src = activeImageSrc;
  }, [activeImageSrc]);

  // Audio Ambience Sync
  useEffect(() => {
    if (isPlaying && !isMuted && audioTrack !== 'none') {
      const trackMap: Record<string, any> = {
        '432hz-solfeggio': 'sanctuary',
        'celestial-harp': 'harp',
        'mountain-wind': 'wind',
        'temple-bells': 'bells'
      };
      ambientSound.playTrack(trackMap[audioTrack] || 'sanctuary');
    } else {
      ambientSound.stop();
    }
    return () => {
      ambientSound.stop();
    };
  }, [isPlaying, isMuted, audioTrack]);

  // Animation Loop on Canvas
  useEffect(() => {
    let running = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const renderLoop = () => {
      if (!running) return;

      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const progress = (elapsed % durationSec) / durationSec; // 0 to 1

      const width = canvas.width;
      const height = canvas.height;

      // Clear Canvas
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, width, height);

      const img = imgElementRef.current;
      if (img && img.complete) {
        ctx.save();

        // Intensity multiplier
        const intensityMult = intensity === 'gentle' ? 0.04 : intensity === 'cinematic' ? 0.09 : 0.16;

        // Calculate Camera Transformations based on Veo Motion preset
        let scale = 1.0;
        let offsetX = 0;
        let offsetY = 0;
        let rotation = 0;

        switch (cameraMovement) {
          case 'parallax-3d': {
            // Smooth zoom-in with breathing sine wave
            scale = 1.05 + Math.sin(progress * Math.PI) * intensityMult * 1.5;
            offsetY = Math.sin(progress * Math.PI * 2) * 12 * (intensity === 'dramatic' ? 2 : 1);
            offsetX = Math.cos(progress * Math.PI * 2) * 6;
            break;
          }
          case 'orbital-arc': {
            // Subtle 3D rotational pan
            scale = 1.1 + Math.sin(progress * Math.PI) * (intensityMult * 0.8);
            offsetX = Math.sin(progress * Math.PI * 2) * 35 * (intensity === 'gentle' ? 0.5 : 1.2);
            rotation = Math.sin(progress * Math.PI * 2) * 0.02 * (intensity === 'dramatic' ? 1.8 : 1);
            break;
          }
          case 'crane-ascent': {
            // Vertical ascent towards the celestial light
            scale = 1.08 + progress * intensityMult;
            offsetY = (0.5 - progress) * 60 * (intensity === 'gentle' ? 0.5 : 1.3);
            break;
          }
          case 'living-breath': {
            // Subtle breathing simulation (rhythmic chest and face pulse)
            const breath = Math.sin(progress * Math.PI * 4); // 2 breaths per cycle
            scale = 1.06 + breath * (intensityMult * 0.6);
            offsetY = breath * 6;
            break;
          }
          case 'glory-pulse': {
            // Pulse of radiant energy
            const pulse = Math.pow(Math.sin(progress * Math.PI * 2), 2);
            scale = 1.08 + pulse * (intensityMult * 1.2);
            break;
          }
          case 'anamorphic-drift': {
            // Slow horizontal cinematic drift
            scale = 1.12;
            offsetX = (progress - 0.5) * 45 * (intensity === 'gentle' ? 0.5 : 1.2);
            break;
          }
        }

        // Apply Transformation Center
        ctx.translate(width / 2, height / 2);
        ctx.rotate(rotation);
        ctx.scale(scale, scale);
        ctx.translate(-width / 2 + offsetX, -height / 2 + offsetY);

        // Draw Image (Cover aspect ratio)
        const imgRatio = img.width / img.height;
        const canvasRatio = width / height;
        let drawW = width;
        let drawH = height;
        let drawX = 0;
        let drawY = 0;

        if (imgRatio > canvasRatio) {
          drawW = height * imgRatio;
          drawX = (width - drawW) / 2;
        } else {
          drawH = width / imgRatio;
          drawY = (height - drawH) / 2;
        }

        ctx.drawImage(img, drawX, drawY, drawW, drawH);
        ctx.restore();

        // 2. Dynamic Lighting & Volumetric Rays
        if (lightingEffect === 'celestial-sun-rays' || lightingEffect === 'ethereal-glow') {
          ctx.save();
          const lightIntensity = 0.15 + Math.sin(progress * Math.PI * 2) * 0.08;
          const rayGrad = ctx.createRadialGradient(
            width * 0.5 + Math.sin(progress * Math.PI * 2) * 40,
            height * 0.25,
            30,
            width * 0.5,
            height * 0.5,
            width * 0.9
          );
          rayGrad.addColorStop(0, `rgba(254, 240, 138, ${lightIntensity * 1.6})`);
          rayGrad.addColorStop(0.35, `rgba(245, 158, 11, ${lightIntensity * 0.8})`);
          rayGrad.addColorStop(0.7, `rgba(217, 119, 6, ${lightIntensity * 0.25})`);
          rayGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

          ctx.fillStyle = rayGrad;
          ctx.fillRect(0, 0, width, height);

          // Ethereal god rays lines
          const numRays = 7;
          for (let r = 0; r < numRays; r++) {
            const rayAngle = ((r - numRays / 2) * 0.25) + Math.sin(elapsed * 0.5 + r) * 0.05;
            ctx.save();
            ctx.translate(width * 0.5, 0);
            ctx.rotate(rayAngle);
            const linearRay = ctx.createLinearGradient(0, 0, 0, height);
            linearRay.addColorStop(0, 'rgba(254, 240, 138, 0.15)');
            linearRay.addColorStop(0.5, 'rgba(245, 158, 11, 0.05)');
            linearRay.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = linearRay;
            ctx.fillRect(-60, 0, 120, height * 1.3);
            ctx.restore();
          }
          ctx.restore();
        }

        // 3. Floating Golden Dust Particles
        if (lightingEffect === 'golden-particles' || lightingEffect === 'celestial-sun-rays' || lightingEffect === 'divine-shimmer') {
          ctx.save();
          const particleCount = 45;
          for (let i = 0; i < particleCount; i++) {
            const seedX = (i * 97) % width;
            const seedY = (i * 131) % height;
            const speed = 20 + (i % 5) * 8;
            const px = (seedX + Math.sin(elapsed * 0.8 + i) * 25) % width;
            const py = (seedY - elapsed * speed) % height;
            const adjustedPy = py < 0 ? height + py : py;
            const size = 1.5 + (i % 3) * 1.5;
            const alpha = 0.25 + Math.sin(elapsed * 2 + i) * 0.2;

            ctx.fillStyle = `rgba(253, 224, 71, ${Math.max(0, alpha)})`;
            ctx.beginPath();
            ctx.arc(px, adjustedPy, size, 0, Math.PI * 2);
            ctx.fill();

            // Shimmer cross glint for largest particles
            if (i % 7 === 0) {
              ctx.strokeStyle = `rgba(255, 255, 255, ${Math.max(0, alpha * 0.8)})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(px - 5, adjustedPy);
              ctx.lineTo(px + 5, adjustedPy);
              ctx.moveTo(px, adjustedPy - 5);
              ctx.lineTo(px, adjustedPy + 5);
              ctx.stroke();
            }
          }
          ctx.restore();
        }

        // 4. Cinematic Dark Holy Vignette
        const vignette = ctx.createRadialGradient(
          width / 2, height / 2, width * 0.35,
          width / 2, height / 2, width * 0.85
        );
        vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
        vignette.addColorStop(0.7, 'rgba(2, 6, 23, 0.4)');
        vignette.addColorStop(1, 'rgba(2, 6, 23, 0.85)');
        ctx.fillStyle = vignette;
        ctx.fillRect(0, 0, width, height);

        // 5. Veo 3 Watermark / Overlay Badge in Live Mode
        ctx.save();
        ctx.fillStyle = 'rgba(2, 6, 23, 0.65)';
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
        ctx.lineWidth = 1;
        const badgeW = 200;
        const badgeH = 28;
        const badgeX = (width - badgeW) / 2;
        const badgeY = height - 44;
        ctx.beginPath();
        ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 14);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('✨ GOOGLE VEO 3 LIVING VIDEO', width / 2, badgeY + 18);
        ctx.restore();
      }

      if (isPlaying) {
        animationFrameId.current = requestAnimationFrame(renderLoop);
      }
    };

    if (isPlaying) {
      animationFrameId.current = requestAnimationFrame(renderLoop);
    }

    return () => {
      running = false;
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isPlaying, cameraMovement, intensity, durationSec, lightingEffect, selectedArtwork, customImageUrl]);

  // Enhance prompt with Gemini AI
  const handleEnhancePromptWithGemini = async () => {
    setIsEnhancingPrompt(true);
    try {
      const res = await fetch('/api/gemini/veo-prompt-enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawPrompt: userPrompt || activeImageTitle,
          cameraMovement,
          intensity,
          mood: 'Paz sagrada, unción de vida y resplandor celestial'
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          setEnhancedVeoData(data.data);
          if (data.data.recommendedMusicTrack) {
            setAudioTrack(data.data.recommendedMusicTrack);
          }
          confetti({
            particleCount: 30,
            spread: 50,
            origin: { y: 0.7 },
            colors: ['#f59e0b', '#fbbf24', '#38bdf8', '#ffffff']
          });
        }
      }
    } catch (err) {
      console.warn("Error enhancing Veo prompt:", err);
    } finally {
      setIsEnhancingPrompt(false);
    }
  };

  // Custom User Image Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCustomImageUrl(event.target.result as string);
          setCustomImageName(file.name.replace(/\.[^/.]+$/, ""));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Render & Export Full Video Clip (.WEBM / .MP4)
  const handleRenderAndDownloadVideo = async (saveToDriveOnly: boolean = false) => {
    if (!canvasRef.current) return;
    setIsRenderingVideo(true);
    setRenderProgress(0);

    const canvas = canvasRef.current;
    const stream = canvas.captureStream(fps);

    // Audio stream synthesis for export
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    const audioCtx = new AudioCtx();
    const dest = audioCtx.createMediaStreamDestination();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(174.61, audioCtx.currentTime); // 432 Hz harmonic F3
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    osc.connect(gain);
    gain.connect(dest);
    osc.start();

    const combinedTracks = [
      ...stream.getVideoTracks(),
      ...dest.stream.getAudioTracks()
    ];
    const combinedStream = new MediaStream(combinedTracks);

    let mimeType = 'video/webm;codecs=vp9,opus';
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'video/webm';
    }

    const recorder = new MediaRecorder(combinedStream, {
      mimeType,
      videoBitsPerSecond: 6000000
    });

    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = async () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const videoUrl = URL.createObjectURL(blob);

      // Save to generated clips history
      const newClip: VeoGeneratedClip = {
        id: `veo-${Date.now()}`,
        title: `Veo 3: ${activeImageTitle}`,
        prompt: userPrompt,
        enhancedVeoPrompt: enhancedVeoData?.veoCinematicPrompt || userPrompt,
        sourceImageUrl: activeImageSrc,
        sourceImageName: activeImageTitle,
        motionConfig: {
          id: cameraMovement,
          name: cameraMovement,
          description: '',
          icon: '✨',
          cameraMovement,
          intensity,
          durationSec,
          aspectRatio,
          fps,
          lightingEffect,
          audioTrack
        },
        videoBlobUrl: videoUrl,
        createdAt: new Date().toLocaleTimeString(),
        durationSec
      };

      setGeneratedClips(prev => [newClip, ...prev]);

      if (saveToDriveOnly) {
        setIsSavingToDrive(true);
        const fileName = `Veo3_${activeImageTitle.replace(/\s+/g, '_')}_${Date.now()}.webm`;
        const driveRes = await uploadVideoToDrive(blob, newClip.title);
        setIsSavingToDrive(false);
        if (driveRes && driveRes.id) {
          setDriveSaveSuccess(true);
          setTimeout(() => setDriveSaveSuccess(false), 4000);
        }
      } else {
        const a = document.createElement('a');
        a.href = videoUrl;
        a.download = `Veo3_LivingVideo_${activeImageTitle.replace(/\s+/g, '_')}_${Date.now()}.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }

      osc.stop();
      audioCtx.close();
      setIsRenderingVideo(false);
      setRenderProgress(100);

      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#fbbf24', '#38bdf8', '#ffffff']
      });
    };

    recorder.start(100);

    // Progress counter
    const totalMs = durationSec * 1000;
    const intervalMs = 100;
    let currentMs = 0;
    const progressTimer = setInterval(() => {
      currentMs += intervalMs;
      const p = Math.min(99, Math.round((currentMs / totalMs) * 100));
      setRenderProgress(p);
      if (currentMs >= totalMs) {
        clearInterval(progressTimer);
        recorder.stop();
      }
    }, intervalMs);
  };

  // Send current living scene directly to CapCut Video Editor timeline
  const handleSendToCapcut = () => {
    if (onSendToCapcutTimeline) {
      onSendToCapcutTimeline({
        title: `Veo 3: ${activeImageTitle}`,
        imageUrl: activeImageSrc,
        durationSec,
        visualPrompt: enhancedVeoData?.veoCinematicPrompt || userPrompt,
        onScreenText: activeImageTitle.toUpperCase(),
        narrationText: enhancedVeoData?.spanishDescription || userPrompt
      });
      setSentToCapcutSuccess(true);
      setTimeout(() => setSentToCapcutSuccess(false), 3500);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Top Banner */}
      <div className="mb-6 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/80 p-6 border border-amber-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950 tracking-wider uppercase flex items-center gap-1 shadow-md">
                <Sparkles className="w-3.5 h-3.5" />
                Google Veo 3 Video AI
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/10 text-slate-300 border border-white/10">
                Dar Vida a Imágenes & Retratos
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white font-cinzel">
              Creador de Video Veo 3: Animación Cinemática Viva
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              Transforma imágenes estáticas de Jesús, pasajes bíblicos o fotos personales en videos vivos con movimiento 3D, rayos de gloria, respiración sagrada y directivas hiperrealistas de Google Veo 3.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowPromptBuilder(!showPromptBuilder)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md border ${
                showPromptBuilder 
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-amber-400/20' 
                  : 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border-amber-500/40'
              }`}
            >
              <Clapperboard className="w-4 h-4 text-amber-400" />
              <span>{showPromptBuilder ? 'Ocultar Constructor' : '🎬 Constructor de Prompts'}</span>
            </button>

            {onOpenCapcut && (
              <button
                onClick={onOpenCapcut}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <Film className="w-4 h-4 text-amber-400" />
                <span>Ir a CapCut</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Structured Cinematic Prompt Builder Banner / Drawer */}
      {showPromptBuilder && (
        <div className="mb-6 animate-fadeIn">
          <CinematicPromptBuilder
            onApplyPrompt={handleApplyStructuredPrompt}
            onSendToVeoStudio={(prompt) => {
              setUserPrompt(prompt);
              setShowPromptBuilder(false);
              confetti({
                particleCount: 40,
                spread: 60,
                origin: { y: 0.6 }
              });
            }}
          />
        </div>
      )}

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Controls & Motion Directives (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Step 1: Image Selector */}
          <div className="rounded-2xl bg-slate-900/80 border border-white/10 p-4 space-y-3 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>1. Seleccionar Imagen a Animar</span>
              </label>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Upload className="w-3 h-3" />
                <span>Subir Foto Propia</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* Jesus Artworks Carousel */}
            <div className="grid grid-cols-4 gap-2 max-h-44 overflow-y-auto pr-1 scrollbar-thin">
              {JESUS_ARTWORKS.map((art) => {
                const isSelected = !customImageUrl && selectedArtwork.id === art.id;
                return (
                  <button
                    key={art.id}
                    onClick={() => {
                      setSelectedArtwork(art);
                      setCustomImageUrl(null);
                    }}
                    className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all text-left group cursor-pointer ${
                      isSelected ? 'border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.4)] scale-[0.98]' : 'border-white/10 opacity-70 hover:opacity-100 hover:border-white/30'
                    }`}
                  >
                    <img 
                      src={art.src} 
                      alt={art.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                    <span className="absolute bottom-1 left-1 right-1 text-[9px] font-medium text-white truncate drop-shadow-md">
                      {art.name}
                    </span>
                    {isSelected && (
                      <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-[10px] font-bold">
                        ✓
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {customImageUrl && (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-400/10 border border-amber-400/30 text-xs text-amber-200">
                <div className="flex items-center gap-2 truncate">
                  <img src={customImageUrl} alt="Custom" className="w-7 h-7 rounded-lg object-cover border border-amber-400/40" />
                  <span className="font-semibold truncate">{customImageName}</span>
                </div>
                <button
                  onClick={() => setCustomImageUrl(null)}
                  className="text-[11px] text-slate-400 hover:text-white underline cursor-pointer"
                >
                  Restaurar Galería
                </button>
              </div>
            )}
          </div>

          {/* Step 2: Veo 3 Camera Motion Presets */}
          <div className="rounded-2xl bg-slate-900/80 border border-white/10 p-4 space-y-3 backdrop-blur-md">
            <label className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              <span>2. Movimiento de Cámara Cinemático (Veo 3)</span>
            </label>

            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'parallax-3d', title: '🕊️ Parallax 3D', desc: 'Acercamiento dimensional vivo' },
                { id: 'living-breath', title: '🌊 Respiración Sagrada', desc: 'Pulso de vida y brisa en manto' },
                { id: 'orbital-arc', title: '☀️ Giro Orbital 360°', desc: 'Arco con rayos de sol móviles' },
                { id: 'crane-ascent', title: '👑 Ascenso Celestial', desc: 'Elevación hacia los cielos' },
                { id: 'glory-pulse', title: '💫 Pulso de Gloria', desc: 'Onda expansiva de luz divina' },
                { id: 'anamorphic-drift', title: '🎥 Cine Anamórfico', desc: 'Deriva horizontal de 35mm' }
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setCameraMovement(m.id as any)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    cameraMovement === m.id
                      ? 'bg-amber-400/15 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                      : 'bg-slate-950/60 border-white/5 text-slate-300 hover:border-white/20 hover:bg-slate-950'
                  }`}
                >
                  <div className="font-semibold text-xs text-white">{m.title}</div>
                  <div className="text-[10px] text-slate-400 leading-tight mt-0.5">{m.desc}</div>
                </button>
              ))}
            </div>

            {/* Motion Intensity & Duration */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block mb-1">Intensidad</span>
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-white/10 text-xs">
                  {(['gentle', 'cinematic', 'dramatic'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setIntensity(lvl)}
                      className={`flex-1 py-1 rounded-lg text-center text-[10px] font-semibold capitalize transition-colors cursor-pointer ${
                        intensity === lvl ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {lvl === 'gentle' ? 'Sutil' : lvl === 'cinematic' ? 'Cinemático' : 'Épico'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-400 block mb-1">Duración del Clip</span>
                <select
                  value={durationSec}
                  onChange={(e) => setDurationSec(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  <option value={3}>3 segundos (Rápido / Hook)</option>
                  <option value={5}>5 segundos (Recomendado)</option>
                  <option value={8}>8 segundos (Cinemático)</option>
                  <option value={10}>10 segundos (Extendido)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Step 3: Lighting FX & Sacred Audio */}
          <div className="rounded-2xl bg-slate-900/80 border border-white/10 p-4 space-y-3 backdrop-blur-md">
            <label className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5" />
              <span>3. Atmósfera de Iluminación & Frecuencia 432 Hz</span>
            </label>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block mb-1">Efecto de Luz</span>
                <select
                  value={lightingEffect}
                  onChange={(e) => setLightingEffect(e.target.value as any)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  <option value="celestial-sun-rays">☀️ Rayos Solares Celestes</option>
                  <option value="golden-particles">✨ Polvo de Oro Flotante</option>
                  <option value="ethereal-glow">🌟 Resplandor Sagrado</option>
                  <option value="divine-shimmer">💫 Destellos & Halos</option>
                  <option value="none">Sin Efectos de Luz</option>
                </select>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-400 block mb-1">Banda Sonora</span>
                <select
                  value={audioTrack}
                  onChange={(e) => setAudioTrack(e.target.value as any)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  <option value="432hz-solfeggio">✨ Altar 432 Hz Solfeggio</option>
                  <option value="celestial-harp">🎵 Arpa de Paz</option>
                  <option value="mountain-wind">🍃 Brisa del Monte</option>
                  <option value="temple-bells">🔔 Campanas Sacras</option>
                  <option value="none">Silencio</option>
                </select>
              </div>
            </div>

            {/* Prompt Directives & Gemini Enhancement */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-300">Prompt / Visión de la Escena:</span>
                <button
                  type="button"
                  onClick={handleEnhancePromptWithGemini}
                  disabled={isEnhancingPrompt}
                  className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-[10px] flex items-center gap-1 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  {isEnhancingPrompt ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                  <span>{isEnhancingPrompt ? 'Optimizando con Gemini...' : '✨ Optimizar Veo 3'}</span>
                </button>
              </div>
              <textarea
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                rows={2}
                placeholder="Describe cómo deseas que cobre vida la imagen..."
                className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400/60"
              />
            </div>

            {/* Enhanced Gemini Directives Display */}
            {enhancedVeoData && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1.5 text-xs text-amber-200/90 animate-fadeIn">
                <div className="flex items-center gap-1.5 font-bold text-amber-300">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Directiva Veo 3 Generada:</span>
                </div>
                <p className="text-[11px] text-slate-300 italic">{enhancedVeoData.spanishDescription}</p>
                <div className="text-[10px] text-amber-400/80 font-mono bg-slate-950/60 p-2 rounded-lg truncate">
                  {enhancedVeoData.veoCinematicPrompt}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: Interactive Live Canvas Player & Export (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="rounded-3xl bg-slate-900/90 border border-white/10 p-5 shadow-2xl backdrop-blur-xl relative">
            
            {/* Top Canvas Bar */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-slate-200">
                  Reproductor Audiovisual Veo 3 HD
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Aspect Ratio Switcher */}
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-white/10 text-xs">
                  <button
                    onClick={() => setAspectRatio('9:16')}
                    className={`px-2 py-0.5 rounded-lg font-semibold text-[10px] transition-colors cursor-pointer ${
                      aspectRatio === '9:16' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    9:16 Vertical
                  </button>
                  <button
                    onClick={() => setAspectRatio('16:9')}
                    className={`px-2 py-0.5 rounded-lg font-semibold text-[10px] transition-colors cursor-pointer ${
                      aspectRatio === '16:9' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    16:9 Cine
                  </button>
                  <button
                    onClick={() => setAspectRatio('1:1')}
                    className={`px-2 py-0.5 rounded-lg font-semibold text-[10px] transition-colors cursor-pointer ${
                      aspectRatio === '1:1' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    1:1 Post
                  </button>
                </div>
              </div>
            </div>

            {/* Video Canvas Container */}
            <div className="flex justify-center bg-slate-950 rounded-2xl p-2 border border-white/5 overflow-hidden">
              <div className={`relative ${
                aspectRatio === '9:16' ? 'w-[280px] sm:w-[320px] h-[500px] sm:h-[568px]' :
                aspectRatio === '16:9' ? 'w-full max-w-[540px] h-[300px]' :
                'w-[340px] h-[340px]'
              } rounded-xl overflow-hidden shadow-2xl border border-amber-500/20`}>
                <canvas
                  ref={canvasRef}
                  width={aspectRatio === '9:16' ? 720 : aspectRatio === '16:9' ? 1280 : 720}
                  height={aspectRatio === '9:16' ? 1280 : aspectRatio === '16:9' ? 720 : 720}
                  className="w-full h-full object-cover"
                />

                {/* Floating Play/Pause overlay button */}
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="absolute bottom-4 right-4 p-3 rounded-full bg-slate-950/80 hover:bg-slate-900 border border-white/20 text-amber-300 backdrop-blur-md shadow-lg transition-all cursor-pointer"
                  title={isPlaying ? 'Pausar animación' : 'Reproducir animación'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="absolute bottom-4 left-4 p-3 rounded-full bg-slate-950/80 hover:bg-slate-900 border border-white/20 text-amber-300 backdrop-blur-md shadow-lg transition-all cursor-pointer"
                  title={isMuted ? 'Activar audio 432 Hz' : 'Silenciar audio'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Playback Controls & Status */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/5 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-200">{activeImageTitle}</span>
                <span>•</span>
                <span className="text-amber-400 font-mono">{durationSec}s @ {fps}fps</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] bg-white/5 px-2.5 py-1 rounded-lg">
                  {cameraMovement.replace('-', ' ').toUpperCase()}
                </span>
                <span className="text-[11px] bg-amber-500/10 text-amber-300 px-2.5 py-1 rounded-lg">
                  {lightingEffect.replace('-', ' ').toUpperCase()}
                </span>
              </div>
            </div>

            {/* Render Progress Bar */}
            {isRenderingVideo && (
              <div className="mt-4 p-4 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                  <span className="flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Procesando y Renderizando Video Veo 3...
                  </span>
                  <span>{renderProgress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 transition-all duration-150"
                    style={{ width: `${renderProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Action Buttons: Export & Send to CapCut */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => handleRenderAndDownloadVideo(false)}
                disabled={isRenderingVideo}
                className="py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all cursor-pointer disabled:opacity-60"
              >
                <Download className="w-4 h-4" />
                <span>🎬 Descargar Video Veo 3</span>
              </button>

              <button
                onClick={handleSendToCapcut}
                disabled={isRenderingVideo}
                className="py-3.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-400/30 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {sentToCapcutSuccess ? <Check className="w-4 h-4 text-emerald-400" /> : <Film className="w-4 h-4 text-amber-400" />}
                <span>{sentToCapcutSuccess ? '¡Enviado a CapCut!' : '🎛️ Enviar a CapCut'}</span>
              </button>

              <button
                onClick={() => handleRenderAndDownloadVideo(true)}
                disabled={isRenderingVideo || isSavingToDrive}
                className="py-3.5 px-4 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
              >
                {driveSaveSuccess ? <Check className="w-4 h-4 text-emerald-400" /> : <HardDrive className="w-4 h-4 text-slate-400" />}
                <span>{driveSaveSuccess ? '¡Guardado en Drive!' : isSavingToDrive ? 'Guardando...' : '☁️ Guardar en Drive'}</span>
              </button>
            </div>

          </div>

          {/* Generated History Clips (if any) */}
          {generatedClips.length > 0 && (
            <div className="rounded-2xl bg-slate-900/80 border border-white/10 p-4 space-y-3 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5" />
                  <span>Clips Generados en esta Sesión ({generatedClips.length})</span>
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {generatedClips.map((clip) => (
                  <div key={clip.id} className="p-2.5 rounded-xl bg-slate-950/80 border border-white/5 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <img src={clip.sourceImageUrl} alt={clip.title} className="w-8 h-8 rounded-lg object-cover" />
                      <div className="truncate">
                        <div className="text-[11px] font-semibold text-white truncate">{clip.title}</div>
                        <div className="text-[9px] text-slate-400">{clip.createdAt} • {clip.durationSec}s</div>
                      </div>
                    </div>
                    {clip.videoBlobUrl && (
                      <a
                        href={clip.videoBlobUrl}
                        download={`${clip.id}.webm`}
                        className="w-full py-1 rounded-lg bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 text-[10px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        <Download className="w-2.5 h-2.5" />
                        <span>Descargar</span>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
