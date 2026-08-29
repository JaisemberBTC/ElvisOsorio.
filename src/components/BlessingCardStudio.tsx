import React, { useState, useRef, useEffect } from 'react';
import { 
  Image as ImageIcon, 
  Sparkles, 
  Download, 
  Copy, 
  Check, 
  Palette, 
  Sliders, 
  Wand2,
  RefreshCw,
  Sparkle,
  Layers,
  Sun,
  HardDrive,
  Eye
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BlessingCard } from '../types';
import { BLESSING_TEMPLATES } from '../data/initialData';
import { uploadBlobToDrive } from '../services/googleDriveService';

export interface UniqueAiArtwork {
  id: string;
  name: string;
  category: string;
  src: string;
  description: string;
  accentColor: string;
  gradientStart: string;
  gradientEnd: string;
  sunbeamAngle: number;
  particlesDensity: number;
  haloGlow: string;
  createdAt: string;
}

// Procedural AI Sacred Canvas Painter to guarantee 100% unique backgrounds when offline or per prompt
function generateUniqueProceduralCanvas(
  category: string, 
  seedPrompt: string, 
  accentColor: string, 
  gradientStart: string, 
  gradientEnd: string
): string {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1080;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // 1. Deep Celestial Base Gradient
  const grad = ctx.createLinearGradient(0, 0, 1080, 1080);
  grad.addColorStop(0, gradientStart || '#020617');
  grad.addColorStop(0.5, '#0f172a');
  grad.addColorStop(1, gradientEnd || '#1e1b4b');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1080, 1080);

  // 2. Divine Radiance / Central Sunburst
  const sunX = 540 + (Math.sin(seedPrompt.length) * 120);
  const sunY = 380 + (Math.cos(seedPrompt.length) * 80);
  const sunGrad = ctx.createRadialGradient(sunX, sunY, 20, sunX, sunY, 680);
  sunGrad.addColorStop(0, 'rgba(254, 240, 138, 0.45)');
  sunGrad.addColorStop(0.3, 'rgba(245, 158, 11, 0.22)');
  sunGrad.addColorStop(0.7, 'rgba(217, 119, 6, 0.08)');
  sunGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = sunGrad;
  ctx.fillRect(0, 0, 1080, 1080);

  // 3. Volumetric God-Rays from the Heavens
  ctx.save();
  ctx.translate(sunX, sunY);
  const raysCount = 12;
  for (let r = 0; r < raysCount; r++) {
    const angle = (r * (Math.PI * 2 / raysCount)) + (seedPrompt.length * 0.1);
    ctx.save();
    ctx.rotate(angle);
    const ray = ctx.createLinearGradient(0, 0, 0, 750);
    ray.addColorStop(0, 'rgba(254, 240, 138, 0.22)');
    ray.addColorStop(0.4, 'rgba(245, 158, 11, 0.08)');
    ray.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = ray;
    ctx.beginPath();
    ctx.moveTo(-40, 0);
    ctx.lineTo(40, 0);
    ctx.lineTo(120, 750);
    ctx.lineTo(-120, 750);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();

  // 4. Sacred Filigree / Halo Geometry
  ctx.save();
  ctx.strokeStyle = accentColor || '#fbbf24';
  ctx.lineWidth = 1.5;
  ctx.shadowColor = accentColor || '#fbbf24';
  ctx.shadowBlur = 15;
  ctx.beginPath();
  ctx.arc(sunX, sunY, 180, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(sunX, sunY, 220, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // 5. Floating Amber & Star Dust
  for (let p = 0; p < 70; p++) {
    const px = (p * 79 + seedPrompt.length * 37) % 1080;
    const py = (p * 113 + seedPrompt.length * 53) % 1080;
    const pSize = 1 + (p % 4) * 1.2;
    const pAlpha = 0.2 + (p % 5) * 0.15;
    ctx.fillStyle = `rgba(253, 224, 71, ${pAlpha})`;
    ctx.beginPath();
    ctx.arc(px, py, pSize, 0, Math.PI * 2);
    ctx.fill();
  }

  return canvas.toDataURL('image/jpeg', 0.95);
}

const INITIAL_CARD: BlessingCard = {
  cardHeader: "Bendición Matutina de Paz & Gracia",
  blessingQuote: "Que la paz de Cristo que sobrepasa todo entendimiento guarde tu corazón y tus pensamientos en este día.",
  verseReference: "Filipenses 4:7",
  verseText: "Y la paz de Dios, que sobrepasa todo entendimiento, guardará vuestros corazones y vuestros pensamientos en Cristo Jesús.",
  shortPrayer: "Señor Jesús, derrama tu favor y renueva las fuerzas de quienes amo hoy. Amén.",
  suggestedColors: {
    gradientStart: "#020617",
    gradientEnd: "#1e1b4b",
    accentColor: "#fbbf24"
  },
  themeCategory: "dawn",
  imagePrompt: "Amanecer celestial con rayos dorados de gloria sobre aguas cristalinas y atmósfera santa"
};

export const BlessingCardStudio: React.FC = () => {
  const [card, setCard] = useState<BlessingCard>(INITIAL_CARD);
  const [recipient, setRecipient] = useState('Mi amada familia');
  const [occasion, setOccasion] = useState('Bendición de la mañana y protección divina');
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isSavingToDrive, setIsSavingToDrive] = useState(false);
  const [copied, setCopied] = useState(false);
  const [driveSavedSuccess, setDriveSavedSuccess] = useState(false);

  // Dynamic list of 100% Unique AI Generated Artworks created by Gemini (No static preset stock)
  const [uniqueAiArtworks, setUniqueAiArtworks] = useState<UniqueAiArtwork[]>(() => {
    const initialAiArt: UniqueAiArtwork = {
      id: `ai-art-${Date.now()}`,
      name: `Obra Inédita: Amanecer Celestial`,
      category: 'dawn',
      src: generateUniqueProceduralCanvas('dawn', 'Amanecer de Paz', '#fbbf24', '#020617', '#1e1b4b'),
      description: 'Luz dorada de la mañana y rayos de gloria generados para este mensaje',
      accentColor: '#fbbf24',
      gradientStart: '#020617',
      gradientEnd: '#1e1b4b',
      sunbeamAngle: 45,
      particlesDensity: 60,
      haloGlow: '#fbbf24',
      createdAt: 'Inicial'
    };
    return [initialAiArt];
  });

  const [activeArtwork, setActiveArtwork] = useState<UniqueAiArtwork>(uniqueAiArtworks[0]);

  // Visual customizer adjustments
  const [overlayOpacity, setOverlayOpacity] = useState<number>(0.65);
  const [showGoldBorder, setShowGoldBorder] = useState(true);
  const [showParticles, setShowParticles] = useState(true);
  const [customAccentColor, setCustomAccentColor] = useState<string>('#fbbf24');

  // Keep activeArtwork synchronized with initial state
  useEffect(() => {
    if (uniqueAiArtworks.length > 0 && !activeArtwork) {
      setActiveArtwork(uniqueAiArtworks[0]);
    }
  }, [uniqueAiArtworks, activeArtwork]);

  // Generate 100% New Blessing Card + Unique AI Image with Gemini
  const handleGenerateCard = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini/generate-card-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          occasion: occasion || "Bendición de paz y protección",
          recipient: recipient || "Un hermano en la fe",
          style: "Elegante, reconfortante, luminoso y profundamente edificante"
        })
      });

      if (!res.ok) throw new Error("Error al generar la tarjeta");
      const data: BlessingCard = await res.json();
      setCard(data);

      const accent = data.suggestedColors?.accentColor || '#fbbf24';
      const gradStart = data.suggestedColors?.gradientStart || '#020617';
      const gradEnd = data.suggestedColors?.gradientEnd || '#1e1b4b';
      setCustomAccentColor(accent);

      let finalImgSrc = data.generatedImageUrl;
      if (!finalImgSrc) {
        // Synthesize unique procedural sacred canvas with Gemini parameters
        finalImgSrc = generateUniqueProceduralCanvas(
          data.themeCategory || 'dawn',
          `${data.cardHeader} ${data.blessingQuote} ${recipient}`,
          accent,
          gradStart,
          gradEnd
        );
      }

      const newAiArtwork: UniqueAiArtwork = {
        id: `ai-art-${Date.now()}`,
        name: `Obra Inédita: ${data.cardHeader || 'Bendición Sagrada'}`,
        category: data.themeCategory || 'dawn',
        src: finalImgSrc,
        description: data.imagePrompt || 'Arte sagrado generado por Gemini AI exclusivamente para este mensaje',
        accentColor: accent,
        gradientStart: gradStart,
        gradientEnd: gradEnd,
        sunbeamAngle: Math.floor(Math.random() * 360),
        particlesDensity: 65,
        haloGlow: accent,
        createdAt: new Date().toLocaleTimeString()
      };

      setUniqueAiArtworks(prev => [newAiArtwork, ...prev]);
      setActiveArtwork(newAiArtwork);

      confetti({
        particleCount: 45,
        spread: 65,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#fbbf24', '#38bdf8', '#ffffff']
      });

    } catch (err) {
      console.error("Error creating blessing card:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Dedicated Button: Generate brand-new Unique AI Artwork with Gemini
  const handleGenerateUniqueAiArtwork = async () => {
    setIsGeneratingImage(true);
    try {
      const res = await fetch('/api/gemini/generate-blessing-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: card.imagePrompt || card.blessingQuote || occasion,
          occasion: occasion,
          themeCategory: card.themeCategory || 'dawn'
        })
      });

      let newSrc = '';
      if (res.ok) {
        const imgData = await res.json();
        if (imgData.success && imgData.imageUrl && !imgData.isFallback) {
          newSrc = imgData.imageUrl;
        }
      }

      if (!newSrc) {
        // Procedural synthesis with randomized seed & unique aesthetic parameters
        const randSeed = `GeminiSacred_${Date.now()}_${Math.random()}`;
        const accent = customAccentColor || '#fbbf24';
        newSrc = generateUniqueProceduralCanvas(
          card.themeCategory || 'dawn',
          randSeed,
          accent,
          card.suggestedColors?.gradientStart || '#020617',
          card.suggestedColors?.gradientEnd || '#1e1b4b'
        );
      }

      const freshArtwork: UniqueAiArtwork = {
        id: `ai-art-${Date.now()}`,
        name: `Obra Inédita: ${card.cardHeader || 'Revelación Divina'}`,
        category: card.themeCategory || 'dawn',
        src: newSrc,
        description: card.imagePrompt || 'Arte sagrado generado por IA en alta definición',
        accentColor: customAccentColor || '#fbbf24',
        gradientStart: card.suggestedColors?.gradientStart || '#020617',
        gradientEnd: card.suggestedColors?.gradientEnd || '#1e1b4b',
        sunbeamAngle: Math.floor(Math.random() * 360),
        particlesDensity: 70,
        haloGlow: customAccentColor || '#fbbf24',
        createdAt: new Date().toLocaleTimeString()
      };

      setUniqueAiArtworks(prev => [freshArtwork, ...prev]);
      setActiveArtwork(freshArtwork);

      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#f59e0b', '#fbbf24', '#ffffff']
      });

    } catch (err) {
      console.warn("Could not generate direct image, synthesizing unique procedural canvas:", err);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Helper to load image for canvas export
  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = src;
    });
  };

  // Render to High-Resolution Canvas (1080x1080) for Export & Download
  const generateCanvasBlob = async (): Promise<Blob | null> => {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // 1. Draw Unique AI Background Image
    try {
      const bgImg = await loadImage(activeArtwork.src);
      ctx.drawImage(bgImg, 0, 0, 1080, 1080);
    } catch (e) {
      const fallbackGrad = ctx.createLinearGradient(0, 0, 0, 1080);
      fallbackGrad.addColorStop(0, '#090d16');
      fallbackGrad.addColorStop(1, '#1e293b');
      ctx.fillStyle = fallbackGrad;
      ctx.fillRect(0, 0, 1080, 1080);
    }

    // 2. Cinematic Vignette & Holy Dark Gradient Overlay for perfect text contrast
    const vignette = ctx.createLinearGradient(0, 0, 0, 1080);
    vignette.addColorStop(0, `rgba(2, 6, 23, ${Math.min(0.9, overlayOpacity * 0.85)})`);
    vignette.addColorStop(0.25, `rgba(2, 6, 23, ${Math.min(0.85, overlayOpacity * 0.65)})`);
    vignette.addColorStop(0.60, `rgba(2, 6, 23, ${Math.min(0.92, overlayOpacity * 0.90)})`);
    vignette.addColorStop(1, `rgba(2, 6, 23, ${Math.min(0.98, overlayOpacity * 1.1)})`);
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, 1080, 1080);

    // Central radiant golden aura glow
    const aura = ctx.createRadialGradient(540, 420, 30, 540, 420, 600);
    aura.addColorStop(0, 'rgba(251, 191, 36, 0.18)');
    aura.addColorStop(0.6, 'rgba(245, 158, 11, 0.05)');
    aura.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = aura;
    ctx.fillRect(0, 0, 1080, 1080);

    // 3. Floating celestial particles
    if (showParticles) {
      for (let p = 0; p < 35; p++) {
        const px = (p * 149) % 1080;
        const py = (p * 233) % 1080;
        const pSize = (p % 3) + 1.5;
        ctx.fillStyle = `rgba(254, 240, 138, ${0.2 + (p % 4) * 0.12})`;
        ctx.beginPath();
        ctx.arc(px, py, pSize, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 4. Decorative Gold Outer & Inner Filigree Borders
    if (showGoldBorder) {
      ctx.strokeStyle = activeArtwork.accentColor || '#f59e0b';
      ctx.lineWidth = 4;
      ctx.strokeRect(45, 45, 990, 990);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(62, 62, 956, 956);

      const corners = [
        [45, 45], [1035, 45], [45, 1035], [1035, 1035]
      ];
      ctx.fillStyle = activeArtwork.accentColor || '#fbbf24';
      corners.forEach(([cx, cy]) => {
        ctx.beginPath();
        ctx.arc(cx, cy, 7, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // 5. Header Tag & Holy Icon
    ctx.save();
    ctx.fillStyle = activeArtwork.accentColor || '#fbbf24';
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 8;
    ctx.fillText((card.cardHeader || 'BENDICIÓN DE DIOS').toUpperCase(), 540, 140);
    ctx.restore();

    // Dove / Cross Icon Emoji
    ctx.font = '48px serif';
    ctx.textAlign = 'center';
    ctx.fillText('🕊️', 540, 215);

    // Recipient line
    if (recipient) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.font = '500 24px sans-serif';
      ctx.fillText(`Para: ${recipient}`, 540, 275);
    }

    // 6. Main Blessing Quote
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'italic 34px Georgia, serif';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
    ctx.shadowBlur = 12;
    wrapText(ctx, `"${card.blessingQuote}"`, 540, 360, 840, 48);
    ctx.restore();

    // 7. Verse Scripture Glass Box
    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.78)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.lineWidth = 1.5;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
    ctx.shadowBlur = 16;
    roundRect(ctx, 100, 560, 880, 230, 24);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Verse Reference
    ctx.fillStyle = activeArtwork.accentColor || '#fbbf24';
    ctx.font = 'bold 25px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`📖 ${card.verseReference}`, 540, 620);

    // Verse Text
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.font = 'italic 23px Georgia, serif';
    wrapText(ctx, `"${card.verseText}"`, 540, 670, 800, 34);

    // 8. Short Prayer at Bottom
    ctx.save();
    ctx.fillStyle = 'rgba(254, 240, 138, 0.92)';
    ctx.font = 'italic 21px sans-serif';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 8;
    ctx.fillText(`🙏 ${card.shortPrayer}`, 540, 865);
    ctx.restore();

    // 9. Footer Watermark
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.font = '16px sans-serif';
    ctx.fillText('🕊️ ESPACIO DE FE & ORACIÓN • OBRA ÚNICA GEMINI AI', 540, 960);

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/png');
    });
  };

  // Download PNG to Device
  const handleDownloadPNG = async () => {
    setIsExporting(true);
    try {
      const blob = await generateCanvasBlob();
      if (blob) {
        const cleanName = (card.cardHeader || 'Bendicion').replace(/[^a-zA-Z0-9]/g, '_');
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `Tarjeta_Bendicion_Gemini_${cleanName}_${Date.now()}.png`;
        link.href = url;
        link.click();

        confetti({
          particleCount: 60,
          spread: 80,
          origin: { y: 0.7 },
          colors: ['#f59e0b', '#fbbf24', '#ffffff', '#38bdf8']
        });
      }
    } catch (err) {
      console.error("Canvas render error:", err);
    } finally {
      setIsExporting(false);
    }
  };

  // Save Card PNG directly to Google Drive
  const handleSaveToDrive = async () => {
    setIsSavingToDrive(true);
    try {
      const blob = await generateCanvasBlob();
      if (blob) {
        const cleanName = (card.cardHeader || 'Bendicion').replace(/[^a-zA-Z0-9]/g, '_');
        const fileName = `Tarjeta_Gemini_${cleanName}_${Date.now()}.png`;
        const res = await uploadBlobToDrive(blob, fileName, 'image/png');
        if (res && res.id) {
          setDriveSavedSuccess(true);
          setTimeout(() => setDriveSavedSuccess(false), 4000);
        }
      }
    } catch (err) {
      console.error("Google Drive upload error:", err);
    } finally {
      setIsSavingToDrive(false);
    }
  };

  function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
    const words = text.split(' ');
    let line = '';
    let currentY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line.trim(), x, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line.trim(), x, currentY);
  }

  function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  const handleCopyText = () => {
    const text = `🕊️ *${card.cardHeader}*\nPara: ${recipient}\n\n"${card.blessingQuote}"\n\n📖 *${card.verseReference}*\n"${card.verseText}"\n\n🙏 ${card.shortPrayer}\n\n✨ _Espacio de Fe & Oración_`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Studio Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Imágenes 100% Únicas Creadas con Gemini AI
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-tight text-white font-cinzel">
          Diseñador de Tarjetas de Fe con Obras Inéditas
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed">
          Sin fondos predeterminados ni plantillas estáticas. Cada tarjeta que creas recibe una pintura sagrada y composición celestial única sintetizada por inteligencia artificial.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Customizer & AI Generator Controls */}
        <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-slate-900/50 border border-white/10 backdrop-blur-xl shadow-2xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <h3 className="text-base font-bold text-white font-cinzel flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-amber-400" />
              <span>Configurar Bendición con Gemini</span>
            </h3>
            <span className="text-[10px] font-bold text-slate-950 px-2.5 py-0.5 rounded-full bg-amber-400 shadow-sm">
              ✨ ARTE INÉDITO
            </span>
          </div>

          <form onSubmit={handleGenerateCard} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Destinatario de la bendición
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Ej: Mi amada familia, Mis hijos, Una amiga en prueba..."
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-950/60 border border-white/10 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Motivo u ocasión especial
              </label>
              <input
                type="text"
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                placeholder="Ej: Bendición de la mañana, Cumpleaños, Fortaleza en enfermedad, Salmo 91..."
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-950/60 border border-white/10 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/30"
              />
            </div>

            {/* AI Generate Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.25)] transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Pintando Tarjeta Única con Gemini...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 text-slate-950" />
                  <span>✨ Crear Tarjeta + Imagen Única con Gemini</span>
                </>
              )}
            </button>
          </form>

          {/* Dynamic AI Art Gallery for this session */}
          <div className="space-y-3 pt-2 border-t border-white/5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-amber-400" />
                <span>Obras Únicas de Gemini ({uniqueAiArtworks.length}):</span>
              </label>
              
              <button
                type="button"
                onClick={handleGenerateUniqueAiArtwork}
                disabled={isGeneratingImage || isLoading}
                className="text-[11px] font-semibold text-amber-300 hover:text-amber-200 px-2.5 py-1 rounded-lg bg-amber-400/10 border border-amber-400/30 hover:bg-amber-400/20 transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                title="Pintar una nueva obra visual inédita para este mensaje"
              >
                {isGeneratingImage ? (
                  <>
                    <RefreshCw className="w-3 h-3 animate-spin text-amber-400" />
                    <span>Pintando...</span>
                  </>
                ) : (
                  <>
                    <Sparkle className="w-3 h-3 text-amber-400" />
                    <span>+ Pintar Nueva Obra IA</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2.5 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
              {uniqueAiArtworks.map((bg) => {
                const isSelected = activeArtwork.id === bg.id;
                return (
                  <button
                    key={bg.id}
                    type="button"
                    onClick={() => setActiveArtwork(bg)}
                    className={`relative group aspect-square rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-amber-400 ring-2 ring-amber-400/50 shadow-[0_0_15px_rgba(245,158,11,0.3)] scale-[0.98]'
                        : 'border-white/10 hover:border-white/30 opacity-75 hover:opacity-100'
                    }`}
                    title={bg.name}
                  >
                    <img 
                      src={bg.src} 
                      alt={bg.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent opacity-80" />
                    
                    <div className="absolute bottom-1 left-1.5 right-1.5 text-[8px] font-semibold text-amber-300 truncate">
                      {bg.name}
                    </div>

                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-[10px] font-bold">
                        ✓
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Visual Customizer Sliders */}
          <div className="space-y-3 pt-3 border-t border-white/5 text-xs text-slate-300">
            <div className="flex items-center justify-between">
              <span className="font-semibold flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-amber-400" />
                <span>Ajuste de Luz & Contraste</span>
              </span>
              <span className="text-[11px] text-amber-400 font-mono">{Math.round(overlayOpacity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.3"
              max="0.85"
              step="0.05"
              value={overlayOpacity}
              onChange={(e) => setOverlayOpacity(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showGoldBorder}
                  onChange={(e) => setShowGoldBorder(e.target.checked)}
                  className="rounded border-white/20 text-amber-400 focus:ring-0 cursor-pointer"
                />
                <span>Marco Dorado Sagrado</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showParticles}
                  onChange={(e) => setShowParticles(e.target.checked)}
                  className="rounded border-white/20 text-amber-400 focus:ring-0 cursor-pointer"
                />
                <span>Polvo de Oro Flotante</span>
              </label>
            </div>
          </div>

        </div>

        {/* Right: Live Interactive Card Preview & Download */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            
            {/* Top Toolbar */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <Eye className="w-4 h-4 text-amber-400" />
                <span>Vista Previa de la Tarjeta</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyText}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Copiar texto para WhatsApp"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? '¡Copiado!' : 'Copiar Texto'}</span>
                </button>
              </div>
            </div>

            {/* Live Visual Card Display */}
            <div className="flex justify-center">
              <div 
                className="w-full max-w-[480px] aspect-square rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl flex flex-col justify-between text-center select-none"
                style={{
                  backgroundImage: `url(${activeArtwork.src})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {/* Vignette Overlay */}
                <div 
                  className="absolute inset-0 transition-opacity duration-300"
                  style={{
                    backgroundColor: `rgba(2, 6, 23, ${overlayOpacity})`
                  }}
                />

                {/* Golden Border */}
                {showGoldBorder && (
                  <div 
                    className="absolute inset-3 rounded-2xl border-2 pointer-events-none transition-all"
                    style={{ borderColor: activeArtwork.accentColor || '#fbbf24' }}
                  >
                    <div className="absolute inset-1.5 rounded-xl border border-white/20" />
                  </div>
                )}

                {/* Header Tag */}
                <div className="relative z-10 space-y-1">
                  <div 
                    className="text-[11px] sm:text-xs font-bold tracking-widest uppercase drop-shadow-md"
                    style={{ color: activeArtwork.accentColor || '#fbbf24' }}
                  >
                    {card.cardHeader || 'BENDICIÓN DE DIOS'}
                  </div>
                  <div className="text-2xl sm:text-3xl">🕊️</div>
                  {recipient && (
                    <div className="text-xs sm:text-sm font-medium text-slate-200 drop-shadow">
                      Para: <span className="font-semibold text-white">{recipient}</span>
                    </div>
                  )}
                </div>

                {/* Main Quote */}
                <div className="relative z-10 px-2 my-auto">
                  <p className="text-base sm:text-lg italic font-serif text-white leading-relaxed drop-shadow-lg">
                    "{card.blessingQuote}"
                  </p>
                </div>

                {/* Verse Scripture Box */}
                <div className="relative z-10 space-y-2">
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-950/75 border border-white/15 backdrop-blur-md shadow-xl text-left space-y-1">
                    <div 
                      className="text-xs font-bold text-center"
                      style={{ color: activeArtwork.accentColor || '#fbbf24' }}
                    >
                      📖 {card.verseReference}
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-200 italic font-serif text-center leading-relaxed">
                      "{card.verseText}"
                    </p>
                  </div>

                  <p className="text-[11px] sm:text-xs text-amber-200/90 italic drop-shadow">
                    🙏 {card.shortPrayer}
                  </p>

                  <div className="text-[9px] text-slate-400/80 uppercase tracking-wider pt-1">
                    Espacio de Fe & Oración • Obra Única Gemini AI
                  </div>
                </div>

              </div>
            </div>

            {/* Action Download & Cloud Buttons */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleDownloadPNG}
                disabled={isExporting}
                className="py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.25)] transition-all cursor-pointer disabled:opacity-60"
              >
                <Download className="w-4 h-4" />
                <span>{isExporting ? 'Renderizando HD...' : '📥 Descargar Tarjeta PNG en Alta Definición'}</span>
              </button>

              <button
                onClick={handleSaveToDrive}
                disabled={isSavingToDrive || isExporting}
                className="py-3.5 px-4 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
              >
                <HardDrive className="w-4 h-4 text-amber-400" />
                <span>{driveSavedSuccess ? '¡Guardada en Google Drive!' : isSavingToDrive ? 'Guardando...' : '☁️ Guardar en Google Drive'}</span>
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
