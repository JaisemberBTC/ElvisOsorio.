import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Image as ImageIcon, 
  Sparkles, 
  Download, 
  Copy, 
  Check, 
  Sliders, 
  Wand2, 
  RefreshCw, 
  Sparkle, 
  Layers, 
  Sun, 
  Moon, 
  HardDrive, 
  Eye, 
  Calendar, 
  Clock, 
  Zap, 
  CheckCircle2,
  BookmarkCheck,
  Share2,
  Send,
  Hash,
  Globe,
  MessageSquare,
  ExternalLink,
  Shuffle,
  CheckCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BlessingCard } from '../types';
import { uploadBlobToDrive } from '../services/googleDriveService';
import { 
  BIBLICAL_VERSES_COLLECTION
} from '../data/biblicalVersesLibrary';

// Curated High-Definition Sacred Spiritual Environments
export const SACRED_THEME_PRESETS = [
  {
    id: 'dawn-1',
    name: '🌅 Amanecer de Fe',
    category: 'dawn',
    url: '/sacred-assets/celestial-sunrise.jpg',
    accentColor: '#fbbf24',
    promptDesc: 'Amanecer celestial con rayos dorados de gloria y luz viva matutina'
  },
  {
    id: 'night-1',
    name: '🌌 Noche de Paz',
    category: 'night',
    url: '/sacred-assets/jesus-night.jpg',
    accentColor: '#38bdf8',
    promptDesc: 'Noche estrellada celestial con reflejos de paz y descanso divino'
  },
  {
    id: 'jesus-1',
    name: '✨ Jesús Bendiciendo',
    category: 'jesus',
    url: '/sacred-assets/jesus-blessing.jpg',
    accentColor: '#fbbf24',
    promptDesc: 'Presencia gloriosa y redentora de Jesucristo con luz celestial'
  },
  {
    id: 'shepherd-1',
    name: '🐑 Buen Pastor',
    category: 'jesus',
    url: '/sacred-assets/jesus-shepherd.jpg',
    accentColor: '#fbbf24',
    promptDesc: 'Jesús el Buen Pastor cuidando sus ovejas en verdes pastos'
  },
  {
    id: 'cross-1',
    name: '✝️ La Cruz de Gracia',
    category: 'cross',
    url: '/sacred-assets/cross-sunrise.jpg',
    accentColor: '#f59e0b',
    promptDesc: 'Cruz de la victoria y gracia sobre el horizonte dorado'
  },
  {
    id: 'peace-1',
    name: '🏞️ Aguas de Reposo',
    category: 'peace',
    url: '/sacred-assets/jesus-peace.jpg',
    accentColor: '#34d399',
    promptDesc: 'Aguas tranquilas y paz en medio de la tormenta con Jesús'
  },
  {
    id: 'healing-1',
    name: '🌿 Sanidad Divina',
    category: 'healing',
    url: '/sacred-assets/jesus-healing.jpg',
    accentColor: '#a7f3d0',
    promptDesc: 'Luz viva de sanidad, restauración y nuevas fuerzas espirituales'
  },
  {
    id: 'family-1',
    name: '🏡 Hogar & Huerto',
    category: 'olive',
    url: '/sacred-assets/olive-garden.jpg',
    accentColor: '#fcd34d',
    promptDesc: 'Bendición sobre el hogar, concordia y paz en el monte de los olivos'
  },
  {
    id: 'dove-1',
    name: '🕊️ Espíritu Santo',
    category: 'worship',
    url: '/sacred-assets/heavenly-dove.jpg',
    accentColor: '#38bdf8',
    promptDesc: 'Paloma celestial y unción santa del Espíritu de Dios'
  },
  {
    id: 'resurrected-1',
    name: '👑 Rey Resucitado',
    category: 'jesus',
    url: '/sacred-assets/jesus-resurrected.jpg',
    accentColor: '#f59e0b',
    promptDesc: 'Jesucristo triunfante y resucitado en majestad'
  },
  {
    id: 'prayer-1',
    name: '🕯️ Oración Sagrada',
    category: 'worship',
    url: '/sacred-assets/jesus-prayer.jpg',
    accentColor: '#c084fc',
    promptDesc: 'Comunión íntima y clamor ferviente en la presencia del Padre'
  },
  {
    id: 'teaching-1',
    name: '📖 Sabiduría Divina',
    category: 'jesus',
    url: '/sacred-assets/jesus-teaching.jpg',
    accentColor: '#fbbf24',
    promptDesc: 'Jesús enseñando la Palabra viva y eterna a los creyentes'
  }
];

// Procedural AI Sacred Canvas Synthesizer ensuring 100% unique visual composition per prompt
function generateDynamicProceduralArtwork(
  themeCategory: string, 
  promptSeed: string, 
  accentColor: string, 
  gradientStart: string, 
  gradientEnd: string
): string {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1080;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const isNight = themeCategory === 'night' || promptSeed.toLowerCase().includes('noche') || promptSeed.toLowerCase().includes('dormir');
  const isMorning = themeCategory === 'dawn' || promptSeed.toLowerCase().includes('mañana') || promptSeed.toLowerCase().includes('buenos');

  // 1. Deep Celestial Base Gradient
  const grad = ctx.createLinearGradient(0, 0, 1080, 1080);
  if (isNight) {
    grad.addColorStop(0, '#020617');
    grad.addColorStop(0.35, '#0b132b');
    grad.addColorStop(0.7, '#1c1444');
    grad.addColorStop(1, '#0f172a');
  } else if (isMorning) {
    grad.addColorStop(0, '#0f172a');
    grad.addColorStop(0.35, '#1e293b');
    grad.addColorStop(0.7, '#451a03');
    grad.addColorStop(1, '#78350f');
  } else {
    grad.addColorStop(0, gradientStart || '#020617');
    grad.addColorStop(0.5, '#0f172a');
    grad.addColorStop(1, gradientEnd || '#1e1b4b');
  }
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1080, 1080);

  // 2. Mountain silhouette in background
  ctx.fillStyle = isNight ? '#030712' : '#0c0a09';
  ctx.beginPath();
  ctx.moveTo(0, 750);
  ctx.lineTo(220, 620);
  ctx.lineTo(440, 700);
  ctx.lineTo(680, 580);
  ctx.lineTo(880, 680);
  ctx.lineTo(1080, 600);
  ctx.lineTo(1080, 1080);
  ctx.lineTo(0, 1080);
  ctx.closePath();
  ctx.fill();

  // 3. Divine Radiance / Central Source
  const sunX = 540 + (Math.sin(promptSeed.length + Date.now() * 0.001) * 60);
  const sunY = isNight ? 320 : 380;
  const sunGrad = ctx.createRadialGradient(sunX, sunY, 20, sunX, sunY, 650);
  
  if (isNight) {
    sunGrad.addColorStop(0, 'rgba(224, 242, 254, 0.65)'); // Moonlight
    sunGrad.addColorStop(0.25, 'rgba(56, 189, 248, 0.28)');
    sunGrad.addColorStop(0.65, 'rgba(147, 51, 234, 0.12)');
  } else {
    sunGrad.addColorStop(0, 'rgba(254, 240, 138, 0.75)'); // Golden sunrise
    sunGrad.addColorStop(0.25, 'rgba(245, 158, 11, 0.35)');
    sunGrad.addColorStop(0.65, 'rgba(217, 119, 6, 0.15)');
  }
  sunGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = sunGrad;
  ctx.fillRect(0, 0, 1080, 1080);

  // 4. Volumetric God-Rays
  ctx.save();
  ctx.translate(sunX, sunY);
  const raysCount = isNight ? 10 : 16;
  for (let r = 0; r < raysCount; r++) {
    const angle = (r * (Math.PI * 2 / raysCount)) + (promptSeed.length * 0.12);
    ctx.save();
    ctx.rotate(angle);
    const ray = ctx.createLinearGradient(0, 0, 0, 780);
    if (isNight) {
      ray.addColorStop(0, 'rgba(224, 242, 254, 0.22)');
      ray.addColorStop(0.4, 'rgba(147, 197, 253, 0.08)');
    } else {
      ray.addColorStop(0, 'rgba(254, 240, 138, 0.35)');
      ray.addColorStop(0.4, 'rgba(245, 158, 11, 0.12)');
    }
    ray.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = ray;
    ctx.beginPath();
    ctx.moveTo(-40, 0);
    ctx.lineTo(40, 0);
    ctx.lineTo(120, 780);
    ctx.lineTo(-120, 780);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();

  // 5. Sacred Cross / Halo of Light
  ctx.save();
  ctx.strokeStyle = accentColor || (isNight ? '#38bdf8' : '#fbbf24');
  ctx.lineWidth = 2;
  ctx.shadowColor = accentColor || (isNight ? '#38bdf8' : '#fbbf24');
  ctx.shadowBlur = 25;
  ctx.beginPath();
  ctx.arc(sunX, sunY, 190, 0, Math.PI * 2);
  ctx.stroke();

  // Draw delicate Holy Cross in background
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.beginPath();
  ctx.moveTo(sunX, sunY - 70);
  ctx.lineTo(sunX, sunY + 80);
  ctx.moveTo(sunX - 45, sunY - 25);
  ctx.lineTo(sunX + 45, sunY - 25);
  ctx.stroke();
  ctx.restore();

  // 6. Floating Star & Amber Particles
  const particlesTotal = isNight ? 95 : 60;
  for (let p = 0; p < particlesTotal; p++) {
    const px = (p * 83 + promptSeed.length * 41) % 1080;
    const py = (p * 109 + promptSeed.length * 59) % 1080;
    const pSize = 1.2 + (p % 4) * 1.5;
    const pAlpha = 0.3 + (p % 5) * 0.16;
    ctx.fillStyle = isNight 
      ? `rgba(224, 242, 254, ${pAlpha})` 
      : `rgba(253, 224, 71, ${pAlpha})`;
    ctx.beginPath();
    ctx.arc(px, py, pSize, 0, Math.PI * 2);
    ctx.fill();
  }

  return canvas.toDataURL('image/jpeg', 0.95);
}

const INITIAL_CARD: BlessingCard = {
  cardHeader: "UN NUEVO AMANECER DE ESPERANZA",
  blessingQuote: "Que la luz de este nuevo día ilumine cada paso que des, recordándote que las misericordias de Dios son nuevas cada mañana.",
  verseReference: "Lamentaciones 3:22-23",
  verseText: "El gran amor del Señor nunca se acaba, y su compasión jamás se agota. Cada mañana se renuevan sus bondades; ¡muy grande es su fidelidad!",
  shortPrayer: "Señor, gracias por este nuevo día. Que tu luz guíe mis pensamientos y que tu paz inunde mi corazón mientras camino bajo tu gracia. Amén.",
  suggestedColors: {
    gradientStart: "#020617",
    gradientEnd: "#1e1b4b",
    accentColor: "#fbbf24"
  },
  themeCategory: "dawn",
  imagePrompt: "A breathtaking celestial golden sunrise with glorious divine rays",
  generatedImageUrl: "/sacred-assets/celestial-sunrise.jpg"
};

export interface DailyAutomatedCardRecord {
  id: string;
  type: 'morning' | 'night';
  card: BlessingCard;
  artworkSrc: string;
  generatedAt: string;
}

export const BlessingCardStudio: React.FC = () => {
  const [card, setCard] = useState<BlessingCard>(INITIAL_CARD);
  const [recipient, setRecipient] = useState('Mi amada familia');
  const [occasion, setOccasion] = useState('Bendición de Buenos Días y Renovación');
  const [timeOfDayContext, setTimeOfDayContext] = useState<'morning' | 'night' | 'custom'>('morning');
  
  // Dynamic Active Artwork (Replaces static gallery)
  const [activeArtworkSrc, setActiveArtworkSrc] = useState<string>(
    INITIAL_CARD.generatedImageUrl || '/sacred-assets/celestial-sunrise.jpg'
  );
  const [artworkPromptDescription, setArtworkPromptDescription] = useState<string>(
    'Amanecer celestial con rayos dorados de gloria y luz viva generada para este mensaje'
  );
  const [isGenerativeModelImage, setIsGenerativeModelImage] = useState<boolean>(true);

  // States
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isSavingToDrive, setIsSavingToDrive] = useState(false);
  const [copied, setCopied] = useState(false);
  const [driveSavedSuccess, setDriveSavedSuccess] = useState(false);

  // Social Media SEO state
  const [seoTab, setSeoTab] = useState<'instagram' | 'whatsapp' | 'hashtags' | 'metadata'>('instagram');
  const [copiedSeoType, setCopiedSeoType] = useState<string | null>(null);

  // Automated Daily Cards Store (Morning & Night)
  const [automatedCards, setAutomatedCards] = useState<DailyAutomatedCardRecord[]>([]);
  const [isAutoSchedulerRunning, setIsAutoSchedulerRunning] = useState(true);
  const [isGeneratingDailyBatch, setIsGeneratingDailyBatch] = useState(false);

  // Visual Customizer
  const [overlayOpacity, setOverlayOpacity] = useState<number>(0.60);
  const [showGoldBorder, setShowGoldBorder] = useState(true);
  const [showParticles, setShowParticles] = useState(true);
  const [customAccentColor, setCustomAccentColor] = useState<string>('#fbbf24');

  // Trigger Automatic 2 Daily Cards on Initial Mount or Load Transferred Devotional Card
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('devotional_to_card_transfer');
      if (raw) {
        const data = JSON.parse(raw);
        if (data && data.verseText) {
          setCard(data);
          if (data.generatedImageUrl) {
            setActiveArtworkSrc(data.generatedImageUrl);
          }
          setRecipient(data.suggestedRecipient || 'Mi amada familia y seres queridos');
          setOccasion(data.suggestedOccasion || 'Palabra de Bendición y Devocional');
          sessionStorage.removeItem('devotional_to_card_transfer');
          generateAutomatedDailyBatch(false); // background load without overriding canvas
          return;
        }
      }
    } catch (e) {
      console.error('Error loading transferred devotional card:', e);
    }
    generateAutomatedDailyBatch(true);
  }, []);

  // Generate 2 Daily Cards (Buenos Días & Buenas Noches) with guaranteed randomization and non-repeating verses
  const generateAutomatedDailyBatch = async (autoApplyToCanvas = true) => {
    setIsGeneratingDailyBatch(true);
    try {
      // Gather currently used verse references to guarantee fresh ones
      const currentVerses = automatedCards.map(c => c.card?.verseReference).filter(Boolean);

      const res = await fetch('/api/gemini/generate-daily-automated-cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timestamp: Date.now(),
          seed: Math.floor(Math.random() * 1000000),
          excludedVerses: currentVerses
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.cards && Array.isArray(data.cards) && data.cards.length > 0) {
          const records: DailyAutomatedCardRecord[] = data.cards.map((c: any) => {
            const isMorning = c.type === 'morning';
            const accent = c.suggestedColors?.accentColor || (isMorning ? '#fbbf24' : '#38bdf8');
            
            const artSrc = c.generatedImageUrl || (isMorning 
              ? '/sacred-assets/celestial-sunrise.jpg' 
              : '/sacred-assets/jesus-night.jpg'
            );

            return {
              id: `auto-${c.type}-${Date.now()}-${Math.random()}`,
              type: c.type,
              card: c,
              artworkSrc: artSrc,
              generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
          });

          setAutomatedCards(records);

          // If triggered manually or initial, load the matching card into the canvas immediately with its auto-generated recipient
          if (autoApplyToCanvas && records.length > 0) {
            const preferred = records.find(r => r.type === timeOfDayContext) || records[0];
            handleApplyAutomatedCard(preferred);
          }
          return;
        }
      }

      // Dynamic Client-side Randomizer Fallback if API is offline
      const morningVerses = BIBLICAL_VERSES_COLLECTION.filter(v => 
        (v.category === 'salmos-manana' || v.category === 'fortaleza' || v.category === 'promesas' || v.recommendedTheme === 'dawn') &&
        !currentVerses.includes(v.reference)
      );
      const nightVerses = BIBLICAL_VERSES_COLLECTION.filter(v => 
        (v.category === 'salmos-noche' || v.category === 'salmos-proteccion' || v.category === 'paz' || v.recommendedTheme === 'night') &&
        !currentVerses.includes(v.reference)
      );

      const mPool = morningVerses.length > 0 ? morningVerses : BIBLICAL_VERSES_COLLECTION.filter(v => v.recommendedTheme !== 'night');
      const nPool = nightVerses.length > 0 ? nightVerses : BIBLICAL_VERSES_COLLECTION.filter(v => v.recommendedTheme === 'night' || v.category === 'paz');

      const pickM = mPool[Math.floor(Math.random() * mPool.length)];
      const pickN = nPool[Math.floor(Math.random() * nPool.length)];

      const morningArtList = ['/sacred-assets/celestial-sunrise.jpg', '/sacred-assets/cross-sunrise.jpg', '/sacred-assets/jesus-blessing.jpg'];
      const nightArtList = ['/sacred-assets/jesus-night.jpg', '/sacred-assets/jesus-peace.jpg', '/sacred-assets/jesus-prayer.jpg'];

      const fallbackRecords: DailyAutomatedCardRecord[] = [
        {
          id: `auto-morning-${Date.now()}`,
          type: 'morning',
          card: {
            cardHeader: pickM.headerTitle,
            blessingQuote: pickM.blessingQuote,
            verseReference: pickM.reference,
            verseText: pickM.text,
            shortPrayer: pickM.prayer,
            suggestedRecipient: "Para mi amada familia y amigos al iniciar el día",
            suggestedOccasion: "Bendición de Buenos Días y Renovación de Fe",
            themeCategory: 'dawn',
            imagePrompt: "Amanecer celestial dorado con rayos de gloria y bendición matutina",
            suggestedColors: {
              gradientStart: "#020617",
              gradientEnd: "#1e1b4b",
              accentColor: pickM.accentColor || "#fbbf24"
            }
          },
          artworkSrc: morningArtList[Math.floor(Math.random() * morningArtList.length)],
          generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        {
          id: `auto-night-${Date.now()}`,
          type: 'night',
          card: {
            cardHeader: pickN.headerTitle,
            blessingQuote: pickN.blessingQuote,
            verseReference: pickN.reference,
            verseText: pickN.text,
            shortPrayer: pickN.prayer,
            suggestedRecipient: "Para quienes buscan descanso y paz en Dios esta noche",
            suggestedOccasion: "Bendición de Buenas Noches y Paz para Dormir",
            themeCategory: 'night',
            imagePrompt: "Noche celestial serena bajo el amparo de Cristo",
            suggestedColors: {
              gradientStart: "#020617",
              gradientEnd: "#0f172a",
              accentColor: pickN.accentColor || "#38bdf8"
            }
          },
          artworkSrc: nightArtList[Math.floor(Math.random() * nightArtList.length)],
          generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ];

      setAutomatedCards(fallbackRecords);
      if (autoApplyToCanvas) {
        const preferred = fallbackRecords.find(r => r.type === timeOfDayContext) || fallbackRecords[0];
        handleApplyAutomatedCard(preferred);
      }
    } catch (err) {
      console.warn("Could not fetch automated daily batch:", err);
    } finally {
      setIsGeneratingDailyBatch(false);
    }
  };

  // Load a specific automated card into the studio canvas & automatically update recipient and occasion
  const handleApplyAutomatedCard = (record: DailyAutomatedCardRecord) => {
    setCard(record.card);
    setActiveArtworkSrc(record.artworkSrc);
    setCustomAccentColor(record.card.suggestedColors?.accentColor || (record.type === 'morning' ? '#fbbf24' : '#38bdf8'));
    setTimeOfDayContext(record.type);
    setArtworkPromptDescription(record.card.imagePrompt || (record.type === 'morning' ? 'Amanecer dorado matutino' : 'Paz celestial nocturna'));
    setIsGenerativeModelImage(true);

    // AUTO-GENERATE RECIPIENT ACCORDING TO THE GENERATED CARD
    const newRecipient = record.card.suggestedRecipient || (
      record.type === 'morning' 
        ? 'Para mi amada familia y amigos al iniciar el día'
        : 'Para quienes buscan descanso y paz en Dios esta noche'
    );
    const newOccasion = record.card.suggestedOccasion || (
      record.type === 'morning'
        ? 'Bendición de Buenos Días y Renovación de Fe'
        : 'Bendición de Buenas Noches y Paz para Dormir'
    );

    setRecipient(newRecipient);
    setOccasion(newOccasion);

    confetti({
      particleCount: 35,
      spread: 55,
      origin: { y: 0.6 },
      colors: record.type === 'morning' ? ['#f59e0b', '#fbbf24', '#ffffff'] : ['#38bdf8', '#818cf8', '#ffffff']
    });
  };

  // Quick Random Recipient Suggestion Generator
  const handleRandomRecipient = () => {
    const isMorning = timeOfDayContext === 'morning';
    const isNight = timeOfDayContext === 'night';

    const morningRecipients = [
      'Para mi amada familia al iniciar este hermoso día',
      'Para mis hijos en su jornada escolar y de vida',
      'Para mis amigos y compañeros de trabajo con bendición',
      'Para quien hoy necesita renovar sus fuerzas y su fe',
      'Para mis hermanos en Cristo que despiertan con gratitud',
      'Para un ser amado que inicia nuevos proyectos con Dios'
    ];

    const nightRecipients = [
      'Para mi hogar y seres queridos al culminar la jornada',
      'Para quienes buscan descanso, paz y reposo en Dios',
      'Para mis hijos bajo el amparo de los ángeles del Señor',
      'Para un amigo en aflicción que necesita paz para dormir',
      'Para toda persona que entrega sus cargas al Señor esta noche',
      'Para mi amada familia en dulce comunión con Cristo'
    ];

    const generalRecipients = [
      'Para mi amada familia con todo mi corazón',
      'Para una persona muy especial que guardo en mis oraciones',
      'Para quien necesita consuelo, fortaleza y esperanza hoy',
      'Para mis hermanos en la fe en todo momento',
      'Para mis seres queridos con la bendición del Señor'
    ];

    const pool = isMorning ? morningRecipients : isNight ? nightRecipients : generalRecipients;
    const filtered = pool.filter(r => r !== recipient);
    const chosen = filtered[Math.floor(Math.random() * filtered.length)] || pool[0];
    setRecipient(chosen);
  };

  // Apply one of the curated sacred preset environments
  const handleSelectPresetArtwork = (preset: typeof SACRED_THEME_PRESETS[0]) => {
    setActiveArtworkSrc(preset.url);
    setCustomAccentColor(preset.accentColor);
    setArtworkPromptDescription(preset.promptDesc);
    setIsGenerativeModelImage(true);
  };

  // Handle custom image file upload
  const handleCustomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setActiveArtworkSrc(uploadEvent.target.result as string);
          setArtworkPromptDescription(`Imagen personalizada cargada: ${file.name}`);
          setIsGenerativeModelImage(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // 1. Asynchronous Call: Generate Card + Brand New Generative Artwork with Gemini
  const handleGenerateCard = async (e?: React.FormEvent, forcedTimeOfDay?: 'morning' | 'night') => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setIsGeneratingImage(true);

    const activeTime = forcedTimeOfDay || timeOfDayContext;

    try {
      const res = await fetch('/api/gemini/generate-card-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          occasion: occasion || (activeTime === 'morning' ? "Bendición de Buenos Días" : activeTime === 'night' ? "Bendición de Buenas Noches" : "Bendición de Paz"),
          recipient: recipient || "Mi amada familia",
          timeOfDay: activeTime,
          style: "Elegante, reconfortante, luminoso y profundamente espiritual"
        })
      });

      if (!res.ok) throw new Error("Error al generar la tarjeta");
      const data: BlessingCard = await res.json();
      setCard(data);

      if (data.suggestedRecipient) {
        setRecipient(data.suggestedRecipient);
      }
      if (data.suggestedOccasion) {
        setOccasion(data.suggestedOccasion);
      }

      const accent = data.suggestedColors?.accentColor || (activeTime === 'night' ? '#38bdf8' : '#fbbf24');
      const gradStart = data.suggestedColors?.gradientStart || '#020617';
      const gradEnd = data.suggestedColors?.gradientEnd || (activeTime === 'night' ? '#0f172a' : '#1e1b4b');
      setCustomAccentColor(accent);

      let finalImgSrc = data.generatedImageUrl;
      if (finalImgSrc) {
        setIsGenerativeModelImage(true);
        setActiveArtworkSrc(finalImgSrc);
      } else {
        setIsGenerativeModelImage(false);
        const dynamicCanvas = generateDynamicProceduralArtwork(
          data.themeCategory || (activeTime === 'night' ? 'night' : 'dawn'),
          `${data.cardHeader} ${data.blessingQuote} ${recipient} ${Date.now()}`,
          accent,
          gradStart,
          gradEnd
        );
        setActiveArtworkSrc(dynamicCanvas);
      }

      setArtworkPromptDescription(data.imagePrompt || (activeTime === 'morning' ? 'Amanecer dorado de esperanza' : 'Paz celestial de noche'));

      confetti({
        particleCount: 45,
        spread: 65,
        origin: { y: 0.6 },
        colors: activeTime === 'night' ? ['#38bdf8', '#818cf8', '#ffffff'] : ['#f59e0b', '#fbbf24', '#ffffff']
      });

    } catch (err) {
      console.error("Error creating blessing card:", err);
    } finally {
      setIsLoading(false);
      setIsGeneratingImage(false);
    }
  };

  // 2. Asynchronous Call: Generate ONLY a New Generative Image with Prompt Variation
  const handleGenerateGenerativeArtwork = async () => {
    setIsGeneratingImage(true);
    try {
      const res = await fetch('/api/gemini/generate-blessing-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: card.imagePrompt || card.blessingQuote || occasion,
          occasion: occasion,
          themeCategory: card.themeCategory || (timeOfDayContext === 'night' ? 'night' : 'dawn'),
          timeOfDay: timeOfDayContext,
          recipient: recipient
        })
      });

      let newSrc = '';
      if (res.ok) {
        const imgData = await res.json();
        if (imgData.success && imgData.imageUrl) {
          newSrc = imgData.imageUrl;
          setIsGenerativeModelImage(true);
          setArtworkPromptDescription(imgData.promptUsed || 'Obra visual sagrada seleccionada para este mensaje');
        }
      }

      if (!newSrc) {
        setIsGenerativeModelImage(false);
        const randSeed = `SacredSeed_${Date.now()}_${Math.random()}`;
        const accent = customAccentColor || (timeOfDayContext === 'night' ? '#38bdf8' : '#fbbf24');
        newSrc = generateDynamicProceduralArtwork(
          card.themeCategory || (timeOfDayContext === 'night' ? 'night' : 'dawn'),
          randSeed,
          accent,
          card.suggestedColors?.gradientStart || '#020617',
          card.suggestedColors?.gradientEnd || '#1e1b4b'
        );
      }

      setActiveArtworkSrc(newSrc);

      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.7 },
        colors: timeOfDayContext === 'night' ? ['#38bdf8', '#c084fc', '#ffffff'] : ['#f59e0b', '#fbbf24', '#ffffff']
      });

    } catch (err) {
      console.warn("Could not generate direct image, synthesizing unique dynamic canvas:", err);
      const fallbackUrl = timeOfDayContext === 'night'
        ? '/sacred-assets/jesus-night.jpg'
        : '/sacred-assets/celestial-sunrise.jpg';
      setActiveArtworkSrc(fallbackUrl);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Helper to load image for canvas export with reliable fallback
  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => {
        // Safe fallback image for canvas
        const fallbackImg = new Image();
        fallbackImg.crossOrigin = 'anonymous';
        fallbackImg.onload = () => resolve(fallbackImg);
        fallbackImg.onerror = () => resolve(img);
        fallbackImg.src = '/sacred-assets/celestial-sunrise.jpg';
      };
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
      const bgImg = await loadImage(activeArtworkSrc);
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

    // Central radiant aura glow
    const aura = ctx.createRadialGradient(540, 420, 30, 540, 420, 600);
    aura.addColorStop(0, customAccentColor === '#38bdf8' ? 'rgba(56, 189, 248, 0.18)' : 'rgba(251, 191, 36, 0.18)');
    aura.addColorStop(0.6, 'rgba(0, 0, 0, 0.05)');
    aura.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = aura;
    ctx.fillRect(0, 0, 1080, 1080);

    // 3. Floating celestial particles
    if (showParticles) {
      for (let p = 0; p < 35; p++) {
        const px = (p * 149) % 1080;
        const py = (p * 233) % 1080;
        const pSize = (p % 3) + 1.5;
        ctx.fillStyle = customAccentColor === '#38bdf8' 
          ? `rgba(186, 230, 253, ${0.2 + (p % 4) * 0.12})` 
          : `rgba(254, 240, 138, ${0.2 + (p % 4) * 0.12})`;
        ctx.beginPath();
        ctx.arc(px, py, pSize, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 4. Decorative Gold Outer & Inner Filigree Borders
    if (showGoldBorder) {
      ctx.strokeStyle = customAccentColor || '#f59e0b';
      ctx.lineWidth = 4;
      ctx.strokeRect(45, 45, 990, 990);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(62, 62, 956, 956);

      const corners = [
        [45, 45], [1035, 45], [45, 1035], [1035, 1035]
      ];
      ctx.fillStyle = customAccentColor || '#fbbf24';
      corners.forEach(([cx, cy]) => {
        ctx.beginPath();
        ctx.arc(cx, cy, 7, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // 5. Header Tag & Holy Icon
    ctx.save();
    ctx.fillStyle = customAccentColor || '#fbbf24';
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 8;
    ctx.fillText((card.cardHeader || 'BENDICIÓN DE DIOS').toUpperCase(), 540, 140);
    ctx.restore();

    // Dove Icon Emoji
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
    ctx.fillStyle = customAccentColor || '#fbbf24';
    ctx.font = 'bold 25px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`📖 ${card.verseReference}`, 540, 620);

    // Verse Text
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.font = 'italic 23px Georgia, serif';
    wrapText(ctx, `"${card.verseText}"`, 540, 670, 800, 34);

    // 8. Short Prayer at Bottom
    ctx.save();
    ctx.fillStyle = customAccentColor === '#38bdf8' ? 'rgba(186, 230, 253, 0.95)' : 'rgba(254, 240, 138, 0.92)';
    ctx.font = 'italic 21px sans-serif';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 8;
    ctx.fillText(`🙏 ${card.shortPrayer}`, 540, 865);
    ctx.restore();

    // 9. Footer Watermark / Signature Line (Explicit Requirement)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.font = 'bold 15px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🕊️ ESPACIO DE FE & ORACIÓN • OBRA ÚNICA ELVIS OSORIO', 540, 960);

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
        link.download = `Tarjeta_ElvisOsorio_${cleanName}_${Date.now()}.png`;
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
        const fileName = `Tarjeta_ElvisOsorio_${cleanName}_${Date.now()}.png`;
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
    const text = `🕊️ *${card.cardHeader}*\nPara: ${recipient}\n\n"${card.blessingQuote}"\n\n📖 *${card.verseReference}*\n"${card.verseText}"\n\n🙏 ${card.shortPrayer}\n\n✨ _Espacio de Fe & Oración • Obra Única Elvis Osorio_`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Computed High-Impact SEO & Social Media Metadata
  const seoData = useMemo(() => {
    const isMorning = timeOfDayContext === 'morning';
    const isNight = timeOfDayContext === 'night';
    const header = card.cardHeader || 'BENDICIÓN DE DIOS';
    const verseRef = card.verseReference || 'Palabra de Dios';
    const verse = card.verseText || '';
    const quote = card.blessingQuote || '';
    const prayer = card.shortPrayer || '';
    const recText = recipient ? `💌 Dedicado con amor: ${recipient}` : '';

    // 1. Social Media Formatted Caption (Instagram, Facebook, Threads, TikTok)
    const instagramCaption = `🕊️✨ ${header} ✨🕊️
${recText ? `${recText}\n` : ''}
"${quote}"

📖 Versículo Bíblico: ${verseRef}
"${verse}"

🙏 Oración de Entrega:
"${prayer}"

🕊️ Declara esta bendición en tu vida y en tu hogar hoy.
✨ Si recibes esta promesa con fe, ¡escribe *AMÉN* 🙏 en los comentarios y compártela con alguien que la necesite! 💖

${isMorning ? '#BuenosDias #VersiculoDelDia #PalabraDeDios #FeEnDios #DiosEsFiel #PromesasDeDios #OracionMatutina #JesusTeAma #Bendiciones #PazEspiritual #Salmos #CristoVive' : isNight ? '#BuenasNoches #PazEnDios #Salmo91 #Salmo4 #OracionDeLaNoche #DescansoEnDios #AngelesDeDios #Fe #Jesucristo #ProteccionDivina #DulceSueno #PazInterior' : '#PalabraDeDios #VersiculoDelDia #FeEnDios #DiosEsFiel #PromesasDeDios #Oracion #JesusTeAma #PazEspiritual #Bendiciones #Salmo91 #Esperanza'}`;

    // 2. WhatsApp & Telegram Markdown Direct Share
    const whatsappCaption = `🕊️ *${header}*
${recText ? `_${recText}_\n` : ''}
"${quote}"

📖 *${verseRef}*
_«${verse}»_

🙏 *Oración:*
"${prayer}"

🕊️ _Que la paz y la gracia del Señor Jesús reposen sobre ti y tu familia. ¡Compártelo hoy!_ ✨`;

    // 3. Structured SEO Meta Tags (For Web, Blogs, Pinterest)
    const seoTitle = `🕊️ ${header.length > 55 ? header.slice(0, 55) + '...' : header} | ${verseRef}`;
    const seoDescription = `Tarjeta de bendición diaria: "${quote.slice(0, 110)}..." Encuentra paz, oración y la promesa de ${verseRef} para compartir.`;
    const seoKeywords = isMorning 
      ? 'tarjeta cristiana buenos dias, versiculo del dia, bendicion matutina, oracion de la manana, salmos diarios, promesas biblicas, fe en cristo, elvis osorio'
      : isNight 
      ? 'tarjeta cristiana buenas noches, versiculo para dormir en paz, salmo 91 proteccion, oracion de la noche, descanso en dios, paz espiritual'
      : 'tarjetas cristianas, versiculos biblicos, oracion de sanidad, promesas de dios, bendiciones cristianas, salmos de proteccion';

    // 4. Classified Hashtags Arrays
    const rawHashtags = isMorning 
      ? ['#BuenosDias', '#VersiculoDelDia', '#PalabraDeDios', '#FeEnDios', '#DiosEsFiel', '#PromesasDeDios', '#OracionMatutina', '#JesusTeAma', '#Bendiciones', '#PazEspiritual', '#CristoVive', '#Salmos']
      : isNight
      ? ['#BuenasNoches', '#PazEnDios', '#Salmo91', '#Salmo4', '#OracionDeLaNoche', '#DescansoEnDios', '#AngelesDeDios', '#Fe', '#Jesucristo', '#ProteccionDivina', '#DulceSueno', '#PazInterior']
      : ['#PalabraDeDios', '#VersiculoDelDia', '#FeEnDios', '#DiosEsFiel', '#JesusSana', '#PromesasDeDios', '#Oracion', '#PazEspiritual', '#Bendiciones', '#Salmo91', '#FamiliaEnDios'];

    const hashtagsString = rawHashtags.join(' ');

    return {
      instagramCaption,
      whatsappCaption,
      seoTitle,
      seoDescription,
      seoKeywords,
      rawHashtags,
      hashtagsString
    };
  }, [card, recipient, timeOfDayContext]);

  // Copy helper for SEO items
  const handleCopySeo = (text: string, typeKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSeoType(typeKey);
    setTimeout(() => setCopiedSeoType(null), 3000);
  };

  // Open WhatsApp direct share
  const handleShareWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(seoData.whatsappCaption)}`;
    window.open(url, '_blank');
  };

  // Native Web Share API
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: seoData.seoTitle,
          text: seoData.whatsappCaption,
        });
      } catch (e) {
        console.log('Share canceled or failed', e);
      }
    } else {
      handleCopySeo(seoData.whatsappCaption, 'whatsapp-native');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Studio Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Generador de Arte Generativo Dinámico con IA
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-tight text-white font-cinzel">
          Diseñador de Tarjetas con Obra Única Elvis Osorio
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed">
          Cada tarjeta y obra de arte es generada de forma asíncrona y 100% inédita con variación de prompt según el momento (Buenos Días con luz dorada de amanecer vs. Buenas Noches con paz estelar).
        </p>
      </div>

      {/* Automated Daily 2-Card Schedule Panel */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-cinzel flex items-center gap-2">
                <span>Automatización Diaria (2 Tarjetas por Día)</span>
                <span className="text-[10px] font-semibold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Activa
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Genera automáticamente una tarjeta matutina de "Buenos Días" y una nocturna de "Buenas Noches" con arte y textos distintos.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => generateAutomatedDailyBatch(true)}
              disabled={isGeneratingDailyBatch}
              className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              title="Regenerar tarjetas automáticas de hoy"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isGeneratingDailyBatch ? 'animate-spin' : ''}`} />
              <span>{isGeneratingDailyBatch ? 'Actualizando...' : 'Actualizar 2 Tarjetas'}</span>
            </button>
          </div>
        </div>

        {/* 2 Daily Cards Cards Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Buenos Días */}
          {(() => {
            const mRecord = automatedCards.find(c => c.type === 'morning');
            const mCard = mRecord?.card;
            const headerTitle = mCard?.cardHeader || "¡BUENOS DÍAS! LA FUERZA Y EL PODER DE DIOS";
            const quote = mCard?.blessingQuote || "Hoy el Señor renueva tus fuerzas como las del águila. Camina confiado en que Sus bendiciones te alcanzarán.";
            const verse = mCard?.verseReference || "Isaías 40:29-31";
            const artSrc = mRecord?.artworkSrc || "/sacred-assets/celestial-sunrise.jpg";

            return (
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-amber-400/30 hover:border-amber-400/50 transition-all space-y-3 relative group overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <div className="w-6 h-6 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center shrink-0">
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <span className="text-xs font-bold text-amber-400 tracking-wide truncate" title={headerTitle}>
                      {headerTitle}
                    </span>
                  </div>
                  <span className="text-[10px] text-amber-300/70 font-mono shrink-0 px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20">
                    07:00 AM
                  </span>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-amber-400/20 bg-slate-900 relative">
                    <img 
                      src={artSrc} 
                      alt="Arte Matutino" 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        e.currentTarget.src = "/sacred-assets/celestial-sunrise.jpg";
                      }} 
                    />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <p className="text-xs text-slate-200 italic line-clamp-2 leading-relaxed">
                      "{quote}"
                    </p>
                    <p className="text-[11px] font-semibold text-amber-400 font-mono truncate">
                      📖 {verse}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end pt-1 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => {
                      if (mRecord) {
                        handleApplyAutomatedCard(mRecord);
                      } else {
                        setTimeOfDayContext('morning');
                        setOccasion('Bendición de Buenos Días y Renovación');
                        handleGenerateCard(undefined, 'morning');
                      }
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-400/15 hover:bg-amber-400/25 text-amber-300 border border-amber-400/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-sm"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Cargar & Diseñar</span>
                  </button>
                </div>
              </div>
            );
          })()}

          {/* Card 2: Buenas Noches */}
          {(() => {
            const nRecord = automatedCards.find(c => c.type === 'night');
            const nCard = nRecord?.card;
            const headerTitle = nCard?.cardHeader || "¡BUENAS NOCHES! EN PAZ ME ACOSTARÉ Y DORMIRÉ";
            const quote = nCard?.blessingQuote || "Suelta toda carga y preocupación a los pies de la cruz. El Dios de la paz vela por tu reposo esta noche.";
            const verse = nCard?.verseReference || "Salmos 4:8";
            const artSrc = nRecord?.artworkSrc || "/sacred-assets/jesus-night.jpg";

            return (
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-sky-400/30 hover:border-sky-400/50 transition-all space-y-3 relative group overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <div className="w-6 h-6 rounded-lg bg-sky-400/10 border border-sky-400/30 flex items-center justify-center shrink-0">
                      <Moon className="w-3.5 h-3.5 text-sky-400" />
                    </div>
                    <span className="text-xs font-bold text-sky-400 tracking-wide truncate" title={headerTitle}>
                      {headerTitle}
                    </span>
                  </div>
                  <span className="text-[10px] text-sky-300/70 font-mono shrink-0 px-2 py-0.5 rounded-full bg-sky-400/10 border border-sky-400/20">
                    08:00 PM
                  </span>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-sky-400/20 bg-slate-900 relative">
                    <img 
                      src={artSrc} 
                      alt="Arte Nocturno" 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        e.currentTarget.src = "/sacred-assets/jesus-night.jpg";
                      }} 
                    />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <p className="text-xs text-slate-200 italic line-clamp-2 leading-relaxed">
                      "{quote}"
                    </p>
                    <p className="text-[11px] font-semibold text-sky-400 font-mono truncate">
                      📖 {verse}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end pt-1 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => {
                      if (nRecord) {
                        handleApplyAutomatedCard(nRecord);
                      } else {
                        setTimeOfDayContext('night');
                        setOccasion('Bendición de Buenas Noches y Paz para Dormir');
                        handleGenerateCard(undefined, 'night');
                      }
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-sky-400/15 hover:bg-sky-400/25 text-sky-300 border border-sky-400/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-sm"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Cargar & Diseñar</span>
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Customizer & AI Generator Controls */}
        <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-slate-900/50 border border-white/10 backdrop-blur-xl shadow-2xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <h3 className="text-base font-bold text-white font-cinzel flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-amber-400" />
              <span>Configuración & Prompt Dinámico</span>
            </h3>
            <span className="text-[10px] font-bold text-slate-950 px-2.5 py-0.5 rounded-full bg-amber-400 shadow-sm">
              ✨ 100% INÉDITO
            </span>
          </div>

          <form onSubmit={(e) => handleGenerateCard(e)} className="space-y-4">
            {/* Time of Day Context Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Momento / Variación de Prompt Visual
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setTimeOfDayContext('morning');
                    setOccasion('Bendición de Buenos Días y Renovación');
                  }}
                  className={`py-2 px-2.5 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    timeOfDayContext === 'morning'
                      ? 'bg-amber-400/20 border-amber-400 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                      : 'bg-slate-950/40 border-white/5 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Buenos Días</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTimeOfDayContext('night');
                    setOccasion('Bendición de Buenas Noches y Paz para Dormir');
                  }}
                  className={`py-2 px-2.5 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    timeOfDayContext === 'night'
                      ? 'bg-sky-400/20 border-sky-400 text-sky-300 shadow-[0_0_10px_rgba(56,189,248,0.2)]'
                      : 'bg-slate-950/40 border-white/5 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5 text-sky-400" />
                  <span>Buenas Noches</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTimeOfDayContext('custom');
                  }}
                  className={`py-2 px-2.5 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    timeOfDayContext === 'custom'
                      ? 'bg-purple-400/20 border-purple-400 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                      : 'bg-slate-950/40 border-white/5 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Sparkle className="w-3.5 h-3.5 text-purple-400" />
                  <span>Personalizada</span>
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <span>Destinatario de la bendición</span>
                  <span className="text-[10px] text-amber-400 font-medium bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                    ✨ Dinámico con IA
                  </span>
                </label>
                <button
                  type="button"
                  onClick={handleRandomRecipient}
                  className="text-[11px] text-amber-300 hover:text-amber-200 flex items-center gap-1 hover:underline cursor-pointer transition-colors"
                  title="Sugerir otra dedicatoria aleatoria"
                >
                  <Shuffle className="w-3 h-3 text-amber-400" />
                  <span>Sugerir otro</span>
                </button>
              </div>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Ej: Mi amada familia, Mis hijos, Una amiga en prueba..."
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-950/60 border border-white/10 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/30 transition-all"
              />
              
              {/* Quick Contextual Recipient Tags */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {[
                  '👨‍👩‍👧‍👦 Mi amada familia',
                  '❤️ Mis hijos y seres queridos',
                  '💼 Amigos en el trabajo',
                  '🕊️ Quien necesita paz y consuelo',
                  '🙏 Hermanos en la fe'
                ].map((sug, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setRecipient(sug)}
                    className={`text-[10px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                      recipient === sug
                        ? 'bg-amber-400/20 border-amber-400/60 text-amber-200 font-semibold shadow-[0_0_10px_rgba(245,158,11,0.15)]'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/10'
                    }`}
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Motivo u ocasión especial
                </label>
                <span className="text-[10px] text-slate-400">Temas con arte relacionado:</span>
              </div>
              <input
                type="text"
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                placeholder="Ej: Sanidad divina, Paz en la tormenta, Jesús el Buen Pastor, Cumpleaños..."
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-950/60 border border-white/10 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/30"
              />

              {/* Thematic Quick Buttons */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {[
                  { label: '🌅 Buenos Días', val: 'Bendición de Buenos Días y Renovación de Fe', time: 'morning' as const },
                  { label: '🌙 Buenas Noches', val: 'Bendición de Buenas Noches y Paz para Dormir', time: 'night' as const },
                  { label: '🌿 Sanidad', val: 'Oración de Sanidad, Restauración y Salud Divina', time: 'morning' as const },
                  { label: '🕊️ Paz en Tormenta', val: 'Paz y Confianza en medio de la Prueba', time: 'custom' as const },
                  { label: '✝️ Gracia & Cruz', val: 'La Gracia Redentora de Jesucristo en la Cruz', time: 'custom' as const },
                  { label: '🏡 Familia', val: 'Bendición, Protección y Unidad Familiar', time: 'morning' as const },
                  { label: '🛡️ Salmo 91', val: 'Amparo y Protección Divina del Salmo 91', time: 'custom' as const }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setOccasion(item.val);
                      setTimeOfDayContext(item.time);
                    }}
                    className="text-[10px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-amber-400/20 text-slate-300 hover:text-amber-200 border border-white/10 transition-all cursor-pointer"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              type="submit"
              disabled={isLoading || isGeneratingImage}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.25)] transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Sintetizando Tarjeta + Obra Inédita con Gemini...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 text-slate-950" />
                  <span>✨ Crear Tarjeta + Imagen Única con Gemini</span>
                </>
              )}
            </button>
          </form>

          {/* Dynamic Generative Artwork Status, Thumbnail Preview & Preset Gallery */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                <span>Obra Visual Activa en Fondo:</span>
              </label>
              
              <button
                type="button"
                onClick={handleGenerateGenerativeArtwork}
                disabled={isGeneratingImage || isLoading}
                className="text-[11px] font-semibold text-amber-300 hover:text-amber-200 px-3 py-1 rounded-lg bg-amber-400/10 border border-amber-400/30 hover:bg-amber-400/20 transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                title="Generar nueva obra visual generativa para este mensaje"
              >
                {isGeneratingImage ? (
                  <>
                    <RefreshCw className="w-3 h-3 animate-spin text-amber-400" />
                    <span>Pintando con IA...</span>
                  </>
                ) : (
                  <>
                    <Sparkle className="w-3 h-3 text-amber-400" />
                    <span>🎨 Pintar Nueva Imagen</span>
                  </>
                )}
              </button>
            </div>

            {/* Thumbnail Preview & Description */}
            <div className="flex gap-3 items-center bg-slate-900/90 p-2.5 rounded-xl border border-white/5">
              <div className="w-16 h-16 rounded-lg overflow-hidden border border-amber-400/40 relative shrink-0 shadow-md bg-slate-950">
                <img 
                  src={activeArtworkSrc} 
                  alt="Fondo Activo" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = timeOfDayContext === 'night'
                      ? '/sacred-assets/jesus-night.jpg'
                      : '/sacred-assets/celestial-sunrise.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                <span className="absolute bottom-0.5 right-0.5 text-[8px] bg-black/80 text-amber-300 px-1 rounded font-mono font-bold">
                  {isGenerativeModelImage ? 'IA' : 'Lienzo'}
                </span>
              </div>
              <div className="text-[11px] text-slate-300 font-sans leading-relaxed min-w-0">
                <span className="font-bold text-amber-400 block truncate">
                  {isGenerativeModelImage ? '✨ Imagen Única Generada por IA' : '🎨 Composición Sagrada'}
                </span>
                <p className="text-slate-400 line-clamp-2 text-[10px] mt-0.5">
                  "{artworkPromptDescription}"
                </p>
              </div>
            </div>

            {/* Quick Sacred Environment Presets */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-semibold text-slate-300">Ambientes Sagrados Inmediatos:</span>
                <label className="text-amber-400/90 hover:text-amber-300 cursor-pointer flex items-center gap-1 font-medium">
                  <span>📁 Subir Foto</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleCustomImageUpload} 
                    className="hidden" 
                  />
                </label>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {SACRED_THEME_PRESETS.map((preset) => {
                  const isSelected = activeArtworkSrc === preset.url;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectPresetArtwork(preset)}
                      className={`text-[10px] py-1 px-1.5 rounded-lg border text-left truncate transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-amber-400/20 border-amber-400 text-amber-200 font-bold shadow-sm' 
                          : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                      title={preset.promptDesc}
                    >
                      {preset.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Visual Customizer Sliders */}
          <div className="space-y-3 pt-2 border-t border-white/5 text-xs text-slate-300">
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
                <span>Lienzo de Tarjeta en Tiempo Real</span>
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
                  backgroundImage: `url(${activeArtworkSrc})`,
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
                    style={{ borderColor: customAccentColor || '#fbbf24' }}
                  >
                    <div className="absolute inset-1.5 rounded-xl border border-white/20" />
                  </div>
                )}

                {/* Header Tag */}
                <div className="relative z-10 space-y-1">
                  <div 
                    className="text-[11px] sm:text-xs font-bold tracking-widest uppercase drop-shadow-md"
                    style={{ color: customAccentColor || '#fbbf24' }}
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
                      style={{ color: customAccentColor || '#fbbf24' }}
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

                  {/* Persistent Branding Signature Line for Elvis Osorio */}
                  <div className="text-[9px] text-slate-300/85 uppercase tracking-wider pt-1 font-semibold">
                    🕊️ ESPACIO DE FE & ORACIÓN • OBRA ÚNICA ELVIS OSORIO
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

            {/* NEW: Generador de SEO & Copywriting para Redes Sociales */}
            <div className="mt-6 p-5 sm:p-6 rounded-3xl bg-slate-950/70 border border-amber-500/20 backdrop-blur-xl shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-sm">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>Generador de SEO & Copy para Redes</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        ⚡ Listo para Publicar
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Textos virales optimizados para Instagram, Facebook, WhatsApp, TikTok y blogs
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleShareWhatsApp}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                    title="Abrir y compartir directo en WhatsApp"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNativeShare}
                    className="px-3 py-1.5 rounded-xl bg-amber-400/15 hover:bg-amber-400/25 text-amber-300 border border-amber-400/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                    title="Compartir en cualquier red o dispositivo"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Compartir</span>
                  </button>
                </div>
              </div>

              {/* Tab Navigation for SEO Formats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 rounded-2xl bg-slate-900/80 border border-white/5 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setSeoTab('instagram')}
                  className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    seoTab === 'instagram'
                      ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Instagram / FB</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSeoTab('whatsapp')}
                  className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    seoTab === 'whatsapp'
                      ? 'bg-emerald-400 text-slate-950 font-bold shadow-md'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSeoTab('hashtags')}
                  className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    seoTab === 'hashtags'
                      ? 'bg-sky-400 text-slate-950 font-bold shadow-md'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <Hash className="w-3.5 h-3.5" />
                  <span>Hashtags SEO</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSeoTab('metadata')}
                  className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    seoTab === 'metadata'
                      ? 'bg-purple-400 text-slate-950 font-bold shadow-md'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Metadatos Web</span>
                </button>
              </div>

              {/* Tab 1: Instagram & Facebook & TikTok */}
              {seoTab === 'instagram' && (
                <div className="space-y-3 animate-fadeIn">
                  <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-white/10 text-xs text-slate-200 font-sans leading-relaxed whitespace-pre-line max-h-48 overflow-y-auto select-all shadow-inner">
                    {seoData.instagramCaption}
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <span className="text-[11px] text-slate-400">
                      Incluye saludo, dedicatoria, versículo, oración, llamada a comentar "AMÉN" y hashtags.
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopySeo(seoData.instagramCaption, 'instagram')}
                      className="px-4 py-2 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 border border-amber-400/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-sm"
                    >
                      {copiedSeoType === 'instagram' ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSeoType === 'instagram' ? '¡Caption Copiado!' : 'Copiar Caption Completo'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 2: WhatsApp & Telegram */}
              {seoTab === 'whatsapp' && (
                <div className="space-y-3 animate-fadeIn">
                  <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/20 text-xs text-emerald-100 font-sans leading-relaxed whitespace-pre-line max-h-48 overflow-y-auto select-all shadow-inner font-mono">
                    {seoData.whatsappCaption}
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <span className="text-[11px] text-emerald-300/80">
                      Formateado con negritas <code className="text-white bg-white/10 px-1 rounded">*texto*</code> y cursivas para grupos de chat.
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleShareWhatsApp}
                        className="px-3.5 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer hover:bg-emerald-400 active:scale-95 shadow-md"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Abrir en WhatsApp</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCopySeo(seoData.whatsappCaption, 'whatsapp')}
                        className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 border border-white/15 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                      >
                        {copiedSeoType === 'whatsapp' ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedSeoType === 'whatsapp' ? '¡Copiado!' : 'Copiar Mensaje'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Hashtags SEO */}
              {seoTab === 'hashtags' && (
                <div className="space-y-3 animate-fadeIn">
                  <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-white/10 space-y-2.5">
                    <div className="flex flex-wrap gap-1.5">
                      {seoData.rawHashtags.map((tag, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleCopySeo(tag, `tag-${idx}`)}
                          className="px-2.5 py-1 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/20 text-[11px] font-mono transition-colors cursor-pointer flex items-center gap-1"
                          title="Clic para copiar este hashtag"
                        >
                          <span>{tag}</span>
                          {copiedSeoType === `tag-${idx}` && <Check className="w-2.5 h-2.5 text-emerald-400" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <span className="text-[11px] text-slate-400">
                      Hashtags de alto tráfico basados en fe, bendición y el momento seleccionado.
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopySeo(seoData.hashtagsString, 'all-hashtags')}
                      className="px-4 py-2 rounded-xl bg-sky-400/20 hover:bg-sky-400/30 text-sky-200 border border-sky-400/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-sm"
                    >
                      {copiedSeoType === 'all-hashtags' ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSeoType === 'all-hashtags' ? '¡Todos Copiados!' : 'Copiar Todos los Hashtags'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 4: Web & Blog SEO Metadata */}
              {seoTab === 'metadata' && (
                <div className="space-y-3 animate-fadeIn">
                  <div className="space-y-2 text-xs">
                    <div className="p-3 rounded-xl bg-slate-900/90 border border-white/10 space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-purple-300">
                        <span>Meta Title (SEO Title):</span>
                        <span className="text-slate-400">{seoData.seoTitle.length} caracteres</span>
                      </div>
                      <p className="text-slate-200 font-mono text-[11px] select-all bg-black/30 p-2 rounded-lg">
                        {seoData.seoTitle}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/90 border border-white/10 space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-purple-300">
                        <span>Meta Description (SEO Snippet):</span>
                        <span className="text-slate-400">{seoData.seoDescription.length} caracteres</span>
                      </div>
                      <p className="text-slate-200 font-mono text-[11px] select-all bg-black/30 p-2 rounded-lg">
                        {seoData.seoDescription}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/90 border border-white/10 space-y-1">
                      <div className="text-[11px] font-semibold text-purple-300">
                        Keywords Relevantes:
                      </div>
                      <p className="text-slate-300 text-[11px] font-mono select-all">
                        {seoData.seoKeywords}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => handleCopySeo(
                        `Title: ${seoData.seoTitle}\nDescription: ${seoData.seoDescription}\nKeywords: ${seoData.seoKeywords}`,
                        'full-metadata'
                      )}
                      className="px-4 py-2 rounded-xl bg-purple-400/20 hover:bg-purple-400/30 text-purple-200 border border-purple-400/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-sm"
                    >
                      {copiedSeoType === 'full-metadata' ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSeoType === 'full-metadata' ? '¡Metadatos Copiados!' : 'Copiar Todo el Paquete SEO'}</span>
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>

      </div>

    </div>
  );
};

