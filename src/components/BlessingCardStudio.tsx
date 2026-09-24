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
  CheckCheck,
  UploadCloud,
  FolderUp,
  Palette,
  Type,
  Edit3,
  Trash2,
  Maximize2,
  ZoomIn,
  BookOpen,
  Heart,
  Search,
  X,
  RotateCcw,
  AlignLeft,
  AlignCenter
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BlessingCard } from '../types';
import { uploadBlobToDrive } from '../services/googleDriveService';
import { 
  BIBLICAL_VERSES_COLLECTION,
  BibleVerseItem,
  findBestMatchingVerse,
  getNextMatchingVerse
} from '../data/biblicalVersesLibrary';

export const BIBLICAL_CATEGORIES = [
  { id: 'all', name: '✨ Todos' },
  { id: 'salmos-proteccion', name: '🛡️ Salmos Protección' },
  { id: 'salmos-manana', name: '🌅 Salmos Mañana' },
  { id: 'salmos-noche', name: '🌙 Salmos Noche' },
  { id: 'sanidad', name: '🌿 Sanidad' },
  { id: 'fortaleza', name: '⚔️ Fortaleza' },
  { id: 'paz', name: '🕊️ Paz' },
  { id: 'familia', name: '👨‍👩‍👧‍👦 Familia' },
  { id: 'promesas', name: '📜 Promesas' },
  { id: 'amor', name: '💖 Amor' }
];

// Curated High-Definition Sacred Spiritual Environments
export const SACRED_THEME_PRESETS = [
  // 1. LUZ & AMANECERES CELESTIALES
  {
    id: 'dawn-1',
    name: '🌅 Amanecer de Fe',
    category: 'dawn',
    badge: 'Luz Radiante',
    url: '/sacred-assets/celestial-sunrise.jpg',
    accentColor: '#fbbf24',
    promptDesc: 'Amanecer celestial con rayos dorados de gloria y luz viva matutina'
  },
  {
    id: 'dawn-2',
    name: '☀️ Resplandor del Alba',
    category: 'dawn',
    badge: 'Alta Iluminación',
    url: '/sacred-assets/celestial_sunrise_dawn_1787717221920.jpg',
    accentColor: '#f59e0b',
    promptDesc: 'Nuevo amanecer lleno de misericordia y resplandor divino'
  },
  // 2. JESÚS EN GLORIA & MAJESTAD
  {
    id: 'jesus-1',
    name: '✨ Jesús Bendiciendo',
    category: 'jesus',
    badge: 'Luz Celestial',
    url: '/sacred-assets/jesus-blessing.jpg',
    accentColor: '#fbbf24',
    promptDesc: 'Presencia gloriosa y redentora de Jesucristo con luz celestial'
  },
  {
    id: 'jesus-2',
    name: '👑 Bendición Soberana',
    category: 'jesus',
    badge: 'Gracia Divina',
    url: '/sacred-assets/jesus_divine_blessing_1787716123982.jpg',
    accentColor: '#fcd34d',
    promptDesc: 'Jesús derramando bendición y paz sobre tu familia'
  },
  {
    id: 'resurrected-1',
    name: '👑 Rey Resucitado',
    category: 'jesus',
    badge: 'Victoria',
    url: '/sacred-assets/jesus-resurrected.jpg',
    accentColor: '#f59e0b',
    promptDesc: 'Jesucristo triunfante y resucitado en majestad'
  },
  {
    id: 'resurrected-2',
    name: '☀️ Cristo Triunfante',
    category: 'jesus',
    badge: 'Luz Eterna',
    url: '/sacred-assets/jesus_resurrected_king_1787717534726.jpg',
    accentColor: '#fbbf24',
    promptDesc: 'El Rey de Gloria resucitado venciendo toda oscuridad'
  },
  {
    id: 'shepherd-1',
    name: '🐑 Buen Pastor',
    category: 'jesus',
    badge: 'Amor y Cuidado',
    url: '/sacred-assets/jesus-shepherd.jpg',
    accentColor: '#fbbf24',
    promptDesc: 'Jesús el Buen Pastor cuidando sus ovejas en verdes pastos'
  },
  {
    id: 'shepherd-2',
    name: '🌾 Amor del Pastor',
    category: 'jesus',
    badge: 'Protección',
    url: '/sacred-assets/jesus_shepherd_love_1787717500827.jpg',
    accentColor: '#f59e0b',
    promptDesc: 'Abrazo tierno del Buen Pastor que jamás te dejará'
  },
  {
    id: 'teaching-1',
    name: '📖 Sabiduría Divina',
    category: 'jesus',
    badge: 'Palabra Viva',
    url: '/sacred-assets/jesus-teaching.jpg',
    accentColor: '#fbbf24',
    promptDesc: 'Jesús enseñando la Palabra viva y eterna a los creyentes'
  },
  {
    id: 'teaching-2',
    name: '📜 Luz de Sabiduría',
    category: 'jesus',
    badge: 'Dirección',
    url: '/sacred-assets/jesus_teaching_wisdom_1787717523974.jpg',
    accentColor: '#fde047',
    promptDesc: 'Lámpara es a mis pies tu palabra y lumbrera a mi camino'
  },
  // 3. PAZ & ESPÍRITU SANTO
  {
    id: 'dove-1',
    name: '🕊️ Espíritu Santo',
    category: 'peace',
    badge: 'Paz Celestial',
    url: '/sacred-assets/heavenly-dove.jpg',
    accentColor: '#38bdf8',
    promptDesc: 'Paloma celestial y unción santa del Espíritu de Dios'
  },
  {
    id: 'dove-2',
    name: '🕊️ Fuego y Gloria',
    category: 'peace',
    badge: 'Unción Fresca',
    url: '/sacred-assets/heavenly_dove_light_1787717258852.jpg',
    accentColor: '#67e8f9',
    promptDesc: 'Luz viva y presencia reconfortante del Consolador'
  },
  {
    id: 'peace-1',
    name: '🏞️ Aguas de Reposo',
    category: 'peace',
    badge: 'Calma Total',
    url: '/sacred-assets/jesus-peace.jpg',
    accentColor: '#34d399',
    promptDesc: 'Aguas tranquilas y paz en medio de la tormenta con Jesús'
  },
  {
    id: 'peace-2',
    name: '🌊 Jesús Calma el Mar',
    category: 'peace',
    badge: 'Serenidad',
    url: '/sacred-assets/jesus_peace_in_storm_1787716138284.jpg',
    accentColor: '#38bdf8',
    promptDesc: 'Paz sobrenatural que aquieta toda tormenta y temor'
  },
  // 4. SANIDAD & GRACIA
  {
    id: 'healing-1',
    name: '🌿 Sanidad Divina',
    category: 'healing',
    badge: 'Restauración',
    url: '/sacred-assets/jesus-healing.jpg',
    accentColor: '#a7f3d0',
    promptDesc: 'Luz viva de sanidad, restauración y nuevas fuerzas espirituales'
  },
  {
    id: 'healing-2',
    name: '💫 Rayos de Milagro',
    category: 'healing',
    badge: 'Vida Nueva',
    url: '/sacred-assets/jesus_healing_light_1787716152719.jpg',
    accentColor: '#86efac',
    promptDesc: 'Poder de Cristo trayendo salud al cuerpo y al espíritu'
  },
  {
    id: 'family-1',
    name: '🏡 Hogar & Huerto',
    category: 'healing',
    badge: 'Bendición Hogar',
    url: '/sacred-assets/olive-garden.jpg',
    accentColor: '#fcd34d',
    promptDesc: 'Bendición sobre el hogar, concordia y paz en el monte de los olivos'
  },
  {
    id: 'family-2',
    name: '🌿 Paz en el Huerto',
    category: 'healing',
    badge: 'Descanso',
    url: '/sacred-assets/olive_garden_peace_1787717233225.jpg',
    accentColor: '#a3e635',
    promptDesc: 'Lugar sagrado de reposo donde Dios renueva el alma'
  },
  {
    id: 'prayer-1',
    name: '🕯️ Oración Sagrada',
    category: 'healing',
    badge: 'Intercesión',
    url: '/sacred-assets/jesus-prayer.jpg',
    accentColor: '#c084fc',
    promptDesc: 'Comunión íntima y clamor ferviente en la presencia del Padre'
  },
  {
    id: 'prayer-2',
    name: '🔥 Fuego del Altar',
    category: 'healing',
    badge: 'Presencia Viva',
    url: '/sacred-assets/jesus_sacred_prayer_1787717512349.jpg',
    accentColor: '#e879f9',
    promptDesc: 'Jesús intercediendo por ti ante el trono celestial'
  },
  // 5. CRUZ DE VICTORIA
  {
    id: 'cross-1',
    name: '✝️ La Cruz de Gracia',
    category: 'cross',
    badge: 'Victoria',
    url: '/sacred-assets/cross-sunrise.jpg',
    accentColor: '#f59e0b',
    promptDesc: 'Cruz de la victoria y gracia sobre el horizonte dorado'
  },
  {
    id: 'cross-2',
    name: '🌟 Cruz de Esperanza',
    category: 'cross',
    badge: 'Resplandor',
    url: '/sacred-assets/cross_sunrise_hope_1787717245799.jpg',
    accentColor: '#fbbf24',
    promptDesc: 'La cruz luminosa al alba proclamando salvación'
  },
  // 6. NOCHE CELESTIAL
  {
    id: 'night-1',
    name: '🌌 Noche de Paz',
    category: 'night',
    badge: 'Paz Nocturna',
    url: '/sacred-assets/jesus-night.jpg',
    accentColor: '#38bdf8',
    promptDesc: 'Noche estrellada celestial con reflejos de paz y descanso divino'
  },
  {
    id: 'night-2',
    name: '⭐ Santuario Nocturno',
    category: 'night',
    badge: 'Protección',
    url: '/sacred-assets/jesus_night_sanctuary_1787716164249.jpg',
    accentColor: '#60a5fa',
    promptDesc: 'Jesús velando tus sueños y alejando todo insomnio'
  },
  // 7. NOVELDADES SACRAS EXCLUSIVAS (ALTA RESOLUCIÓN 1080x1080)
  {
    id: 'novel-jesus-arms',
    name: '✨ Jesús de Brazos Abiertos',
    category: 'jesus',
    badge: '🔥 Novedad',
    url: '/sacred-assets/jesus_open_arms_glory.jpg',
    accentColor: '#fbbf24',
    promptDesc: 'Jesús resplandeciente en gloria y bienvenida con brazos abiertos de gracia'
  },
  {
    id: 'novel-dawn-walk',
    name: '🌅 Luz Radiante del Alba',
    category: 'dawn',
    badge: '🔥 Novedad',
    url: '/sacred-assets/jesus_walking_light_dawn.jpg',
    accentColor: '#f59e0b',
    promptDesc: 'Jesús caminando en la luz viva del amanecer sobre verdes pastos de paz'
  },
  {
    id: 'novel-compassion',
    name: '💧 Compasión y Consuelo',
    category: 'healing',
    badge: '🔥 Novedad',
    url: '/sacred-assets/jesus_compassion_tears.jpg',
    accentColor: '#c084fc',
    promptDesc: 'Mirada viva de compasión profunda que seca las lágrimas y da aliento'
  },
  {
    id: 'novel-embrace',
    name: '🕊️ Manos de Amparo Divino',
    category: 'healing',
    badge: '🔥 Novedad',
    url: '/sacred-assets/jesus_divine_hands_embrace.jpg',
    accentColor: '#fcd34d',
    promptDesc: 'Abrazo y manos protectoras del Altísimo cubriendo a tu familia'
  },
  {
    id: 'novel-sanctuary',
    name: '🏛️ Luz Viva en el Santuario',
    category: 'healing',
    badge: '🔥 Novedad',
    url: '/sacred-assets/jesus_miracle_light_sanctuary.jpg',
    accentColor: '#38bdf8',
    promptDesc: 'Rayos celestiales de milagro y presencia santa en el altar'
  },
  {
    id: 'novel-peace-solace',
    name: '🌿 Paz que Sobrepasa Entendimiento',
    category: 'peace',
    badge: '🔥 Novedad',
    url: '/sacred-assets/jesus_peace_solace.jpg',
    accentColor: '#34d399',
    promptDesc: 'Paz inmutable de Cristo que aquieta toda ansiedad y temor'
  },
  {
    id: 'novel-cross-radiant',
    name: '✝️ Cruz Radiante de Salvación',
    category: 'cross',
    badge: '🔥 Novedad',
    url: '/sacred-assets/jesus_radiant_cross_salvation.jpg',
    accentColor: '#fbbf24',
    promptDesc: 'Cruz de gloria y redención iluminando todo el horizonte con luz divina'
  },
  {
    id: 'novel-morning-glory',
    name: '☀️ Victoria de Resurrección',
    category: 'dawn',
    badge: '🔥 Novedad',
    url: '/sacred-assets/jesus_morning_resurrection_glory.jpg',
    accentColor: '#f59e0b',
    promptDesc: 'Amanecer triunfante proclamando que Cristo vive y reina para siempre'
  },
  {
    id: 'novel-starry-refuge',
    name: '🌌 Refugio Bajo las Estrellas',
    category: 'night',
    badge: '🔥 Novedad',
    url: '/sacred-assets/jesus_night_starry_refuge.jpg',
    accentColor: '#818cf8',
    promptDesc: 'Noche celestial con Jesús como refugio seguro velando tu descanso'
  },
  {
    id: 'novel-living-waters',
    name: '🌊 Manantial de Aguas Vivas',
    category: 'healing',
    badge: '🔥 Novedad',
    url: '/sacred-assets/jesus_healing_hands_living_waters.jpg',
    accentColor: '#38bdf8',
    promptDesc: 'Ríos de agua viva y salud fluyendo de las manos santas de Jesús'
  },
  {
    id: 'novel-counselor-hope',
    name: '🌟 Consejero de Esperanza',
    category: 'jesus',
    badge: '🔥 Novedad',
    url: '/sacred-assets/jesus_counselor_hope.jpg',
    accentColor: '#fbbf24',
    promptDesc: 'Cristo consejero admirable trayendo dirección certera y gozo'
  },
  {
    id: 'novel-triumphant-light',
    name: '👑 Resplandor Triunfante',
    category: 'jesus',
    badge: '🔥 Novedad',
    url: '/sacred-assets/jesus_triumphant_light.jpg',
    accentColor: '#f59e0b',
    promptDesc: 'Luz soberana que disipa toda tiniebla e ilumina tu camino'
  },
  {
    id: 'novel-infinite-mercy',
    name: '💖 Misericordia Eterna',
    category: 'jesus',
    badge: '🔥 Novedad',
    url: '/sacred-assets/jesus_infinite_mercy.jpg',
    accentColor: '#f43f5e',
    promptDesc: 'Amor incondicional de Jesús derramando perdón y bendición sobre tu vida'
  }
];

// Procedural AI Sacred Canvas Synthesizer with High-Luminosity Radiant Atmosphere
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

  // 1. High-Luminosity Warm Base Gradient (avoiding pitch black)
  const grad = ctx.createLinearGradient(0, 0, 1080, 1080);
  if (isNight) {
    grad.addColorStop(0, '#0f172a');
    grad.addColorStop(0.35, '#1e1b4b');
    grad.addColorStop(0.7, '#312e81');
    grad.addColorStop(1, '#1e293b');
  } else if (isMorning) {
    grad.addColorStop(0, '#78350f');
    grad.addColorStop(0.30, '#b45309');
    grad.addColorStop(0.65, '#f59e0b');
    grad.addColorStop(1, '#fef08a');
  } else {
    grad.addColorStop(0, gradientStart || '#1e1b4b');
    grad.addColorStop(0.45, '#3b82f6');
    grad.addColorStop(0.85, '#f59e0b');
    grad.addColorStop(1, gradientEnd || '#fef3c7');
  }
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1080, 1080);

  // 2. Mountain silhouette in background (warm deep silhouette, never pitch black)
  ctx.fillStyle = isNight ? '#1e1b4b' : '#451a03';
  ctx.beginPath();
  ctx.moveTo(0, 780);
  ctx.lineTo(220, 660);
  ctx.lineTo(440, 730);
  ctx.lineTo(680, 620);
  ctx.lineTo(880, 710);
  ctx.lineTo(1080, 640);
  ctx.lineTo(1080, 1080);
  ctx.lineTo(0, 1080);
  ctx.closePath();
  ctx.fill();

  // 3. Brilliant Divine Radiance / Central Source
  const sunX = 540 + (Math.sin(promptSeed.length + Date.now() * 0.001) * 60);
  const sunY = isNight ? 320 : 360;
  const sunGrad = ctx.createRadialGradient(sunX, sunY, 15, sunX, sunY, 680);
  
  if (isNight) {
    sunGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)'); // Radiant Moonlight
    sunGrad.addColorStop(0.25, 'rgba(186, 230, 253, 0.65)');
    sunGrad.addColorStop(0.65, 'rgba(147, 197, 253, 0.25)');
  } else {
    sunGrad.addColorStop(0, 'rgba(255, 255, 255, 0.98)'); // Intense Golden Sunlight
    sunGrad.addColorStop(0.20, 'rgba(254, 240, 138, 0.85)');
    sunGrad.addColorStop(0.55, 'rgba(245, 158, 11, 0.45)');
    sunGrad.addColorStop(0.80, 'rgba(217, 119, 6, 0.20)');
  }
  sunGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = sunGrad;
  ctx.fillRect(0, 0, 1080, 1080);

  // 4. Volumetric God-Rays of Pure Light
  ctx.save();
  ctx.translate(sunX, sunY);
  const raysCount = isNight ? 12 : 20;
  for (let r = 0; r < raysCount; r++) {
    const angle = (r * (Math.PI * 2 / raysCount)) + (promptSeed.length * 0.12);
    ctx.save();
    ctx.rotate(angle);
    const ray = ctx.createLinearGradient(0, 0, 0, 850);
    if (isNight) {
      ray.addColorStop(0, 'rgba(224, 242, 254, 0.35)');
      ray.addColorStop(0.4, 'rgba(147, 197, 253, 0.15)');
    } else {
      ray.addColorStop(0, 'rgba(255, 255, 255, 0.55)');
      ray.addColorStop(0.3, 'rgba(254, 240, 138, 0.35)');
      ray.addColorStop(0.6, 'rgba(245, 158, 11, 0.18)');
    }
    ray.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = ray;
    ctx.beginPath();
    ctx.moveTo(-45, 0);
    ctx.lineTo(45, 0);
    ctx.lineTo(130, 850);
    ctx.lineTo(-130, 850);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();

  // 5. Sacred Cross / Halo of Golden Light
  ctx.save();
  ctx.strokeStyle = accentColor || (isNight ? '#67e8f9' : '#fde047');
  ctx.lineWidth = 2.5;
  ctx.shadowColor = accentColor || (isNight ? '#38bdf8' : '#fbbf24');
  ctx.shadowBlur = 35;
  ctx.beginPath();
  ctx.arc(sunX, sunY, 190, 0, Math.PI * 2);
  ctx.stroke();

  // Draw delicate Holy Cross in background
  ctx.lineWidth = 3.5;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.beginPath();
  ctx.moveTo(sunX, sunY - 75);
  ctx.lineTo(sunX, sunY + 85);
  ctx.moveTo(sunX - 50, sunY - 25);
  ctx.lineTo(sunX + 50, sunY - 25);
  ctx.stroke();
  ctx.restore();

  // 6. Floating Star & Amber Particles
  const particlesTotal = isNight ? 95 : 75;
  for (let p = 0; p < particlesTotal; p++) {
    const px = (p * 83 + promptSeed.length * 41) % 1080;
    const py = (p * 109 + promptSeed.length * 59) % 1080;
    const pSize = 1.4 + (p % 4) * 1.8;
    const pAlpha = 0.4 + (p % 5) * 0.18;
    ctx.fillStyle = isNight 
      ? `rgba(224, 242, 254, ${pAlpha})` 
      : `rgba(254, 240, 138, ${pAlpha})`;
    ctx.beginPath();
    ctx.arc(px, py, pSize, 0, Math.PI * 2);
    ctx.fill();
  }

  return canvas.toDataURL('image/jpeg', 0.95);
}

const getInitialDynamicCard = (): BlessingCard => {
  const hour = new Date().getHours();
  const isNight = hour >= 19 || hour < 6;
  const initialVerse = findBestMatchingVerse({
    timeOfDay: isNight ? 'night' : 'morning',
    topic: isNight ? 'Paz y descanso en Dios' : 'Fuerzas, fe y nuevo día'
  });

  return {
    cardHeader: initialVerse.headerTitle,
    blessingQuote: initialVerse.blessingQuote,
    verseReference: initialVerse.reference,
    verseText: initialVerse.text,
    shortPrayer: initialVerse.prayer,
    suggestedColors: {
      gradientStart: isNight ? "#020617" : "#0f172a",
      gradientEnd: isNight ? "#1e1b4b" : "#312e81",
      accentColor: initialVerse.accentColor || (isNight ? "#38bdf8" : "#fbbf24")
    },
    themeCategory: initialVerse.recommendedTheme,
    imagePrompt: isNight 
      ? "Celestial starry night with calm moonlit waters and divine serenity" 
      : "A breathtaking celestial golden sunrise with glorious divine rays",
    generatedImageUrl: isNight 
      ? "/sacred-assets/jesus-night.jpg"
      : "/sacred-assets/celestial-sunrise.jpg"
  };
};

export interface DailyAutomatedCardRecord {
  id: string;
  type: 'morning' | 'night';
  card: BlessingCard;
  artworkSrc: string;
  generatedAt: string;
}

export const BlessingCardStudio: React.FC = () => {
  const [card, setCard] = useState<BlessingCard>(getInitialDynamicCard);
  const initialHour = new Date().getHours();
  const isInitialNight = initialHour >= 19 || initialHour < 6;
  const [recipient, setRecipient] = useState('Mi amada familia');
  const [occasion, setOccasion] = useState(isInitialNight ? 'Bendición de Buenas Noches y Paz' : 'Bendición de Buenos Días y Fortaleza');
  const [timeOfDayContext, setTimeOfDayContext] = useState<'morning' | 'night' | 'custom'>(isInitialNight ? 'night' : 'morning');
  
  // Dynamic Active Artwork (Replaces static gallery)
  const [activeArtworkSrc, setActiveArtworkSrc] = useState<string>(
    isInitialNight ? '/sacred-assets/jesus-night.jpg' : '/sacred-assets/celestial-sunrise.jpg'
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

  // Visual Customizer & Illumination System
  const [overlayOpacity, setOverlayOpacity] = useState<number>(0.22); // Reduced default from 0.60 to 0.22 so cards are bright and vibrant
  const [cardBrightness, setCardBrightness] = useState<number>(1.25); // 125% brightness for divine radiance
  const [cardContrast, setCardContrast] = useState<number>(1.05); // 105% crisp contrast
  const [celestialAuraGlow, setCelestialAuraGlow] = useState<boolean>(true); // Radiant sunburst golden aura
  const [galleryCategory, setGalleryCategory] = useState<string>('all');
  const [showGoldBorder, setShowGoldBorder] = useState(true);
  const [showParticles, setShowParticles] = useState(true);
  const [customAccentColor, setCustomAccentColor] = useState<string>('#fbbf24');

  // Studio Mode: 'editor' (Editor de Tarjeta & Subir Imagen) | 'generator' (IA Gemini)
  const [studioMode, setStudioMode] = useState<'editor' | 'generator'>('editor');

  // Custom Image Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [customImageInfo, setCustomImageInfo] = useState<{ name: string; size: string } | null>(null);
  const [imageZoom, setImageZoom] = useState<number>(1);
  const [imagePosition, setImagePosition] = useState<'center' | 'top' | 'bottom'>('center');
  const [imageFilter, setImageFilter] = useState<'none' | 'radiant' | 'warm' | 'golden' | 'sepia' | 'mono'>('none');

  // Card Content & Typography State
  const [cardIcon, setCardIcon] = useState<string>('🕊️');
  const [cardFooter, setCardFooter] = useState<string>('ESPACIO DE FE & ORACIÓN • OBRA ÚNICA ELVIS OSORIO');
  const [fontFamily, setFontFamily] = useState<'serif' | 'cinzel' | 'sans'>('serif');
  const [textAlign, setTextAlign] = useState<'center' | 'left'>('center');

  // Bible Verse Library Modal
  const [isVerseModalOpen, setIsVerseModalOpen] = useState(false);
  const [verseSearchTerm, setVerseSearchTerm] = useState('');
  const [verseCategoryFilter, setVerseCategoryFilter] = useState<string>('all');

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

      const morningArtList = [
        '/sacred-assets/celestial-sunrise.jpg',
        '/sacred-assets/celestial_sunrise_dawn_1787717221920.jpg',
        '/sacred-assets/cross-sunrise.jpg',
        '/sacred-assets/cross_sunrise_hope_1787717245799.jpg',
        '/sacred-assets/jesus-blessing.jpg',
        '/sacred-assets/jesus_divine_blessing_1787716123982.jpg',
        '/sacred-assets/jesus-resurrected.jpg',
        '/sacred-assets/jesus_resurrected_king_1787717534726.jpg',
        '/sacred-assets/jesus-shepherd.jpg',
        '/sacred-assets/jesus_shepherd_love_1787717500827.jpg',
        '/sacred-assets/jesus_open_arms_glory.jpg',
        '/sacred-assets/jesus_walking_light_dawn.jpg',
        '/sacred-assets/jesus_morning_resurrection_glory.jpg',
        '/sacred-assets/jesus_radiant_cross_salvation.jpg',
        '/sacred-assets/jesus_counselor_hope.jpg',
        '/sacred-assets/jesus_triumphant_light.jpg'
      ];
      const nightArtList = [
        '/sacred-assets/jesus-night.jpg',
        '/sacred-assets/jesus_night_sanctuary_1787716164249.jpg',
        '/sacred-assets/jesus-peace.jpg',
        '/sacred-assets/jesus_peace_in_storm_1787716138284.jpg',
        '/sacred-assets/jesus-prayer.jpg',
        '/sacred-assets/jesus_sacred_prayer_1787717512349.jpg',
        '/sacred-assets/heavenly-dove.jpg',
        '/sacred-assets/heavenly_dove_light_1787717258852.jpg',
        '/sacred-assets/olive-garden.jpg',
        '/sacred-assets/olive_garden_peace_1787717233225.jpg',
        '/sacred-assets/jesus_night_starry_refuge.jpg',
        '/sacred-assets/jesus_compassion_tears.jpg',
        '/sacred-assets/jesus_divine_hands_embrace.jpg',
        '/sacred-assets/jesus_peace_solace.jpg',
        '/sacred-assets/jesus_healing_hands_living_waters.jpg',
        '/sacred-assets/jesus_infinite_mercy.jpg'
      ];

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
              gradientStart: "#78350f",
              gradientEnd: "#f59e0b",
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
              gradientStart: "#0f172a",
              gradientEnd: "#312e81",
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

  // Assign a novel sacred artwork automatically with guaranteed freshness
  const handleAssignRandomNovelArtwork = () => {
    const novelPresets = SACRED_THEME_PRESETS.filter(p => p.badge?.includes('Novedad') || p.id.startsWith('novel-'));
    const pool = novelPresets.length > 0 ? novelPresets : SACRED_THEME_PRESETS;
    const candidates = pool.filter(p => p.url !== activeArtworkSrc);
    const chosen = candidates[Math.floor(Math.random() * candidates.length)] || pool[0];
    
    handleSelectPresetArtwork(chosen);
    setCustomImageInfo(null);
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.65 },
      colors: ['#fbbf24', '#f59e0b', '#38bdf8', '#c084fc']
    });
  };

  // Handle custom image file processing (drag & drop or file input)
  const handleProcessCustomImageFile = (file: File) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      if (uploadEvent.target?.result) {
        setActiveArtworkSrc(uploadEvent.target.result as string);
        setCustomImageInfo({
          name: file.name,
          size: (file.size / 1024).toFixed(1) + ' KB'
        });
        setArtworkPromptDescription(`Foto personalizada: ${file.name}`);
        setIsGenerativeModelImage(false);
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.65 },
          colors: ['#fbbf24', '#f59e0b', '#ffffff']
        });
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle custom image file upload
  const handleCustomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessCustomImageFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleProcessCustomImageFile(file);
    }
  };

  const handleRestoreDefaultImage = () => {
    const defaultUrl = timeOfDayContext === 'night' 
      ? '/sacred-assets/jesus-night.jpg' 
      : '/sacred-assets/celestial-sunrise.jpg';
    setActiveArtworkSrc(defaultUrl);
    setCustomImageInfo(null);
    setImageZoom(1);
    setImagePosition('center');
    setImageFilter('none');
    setIsGenerativeModelImage(true);
    setArtworkPromptDescription('Fondo sagrado predeterminado restaurado');
  };

  const getCssFilter = (filterType: string) => {
    const base = `brightness(${cardBrightness}) contrast(${cardContrast})`;
    switch (filterType) {
      case 'radiant': return `${base} saturate(1.35) brightness(1.25)`;
      case 'warm': return `${base} sepia(0.2) saturate(1.3) brightness(1.1) hue-rotate(-10deg)`;
      case 'golden': return `${base} sepia(0.35) saturate(1.4) brightness(1.15)`;
      case 'sepia': return `${base} sepia(0.6) contrast(1.1)`;
      case 'mono': return `${base} grayscale(1) contrast(1.15)`;
      default: return base;
    }
  };

  const handleApplyVerseFromLibrary = (verseItem: BibleVerseItem) => {
    setCard(prev => ({
      ...prev,
      verseReference: verseItem.reference,
      verseText: verseItem.text,
      cardHeader: verseItem.headerTitle || prev.cardHeader,
      blessingQuote: verseItem.blessingQuote || prev.blessingQuote,
      shortPrayer: verseItem.prayer || prev.shortPrayer
    }));
    if (verseItem.accentColor) {
      setCustomAccentColor(verseItem.accentColor);
    }
    setIsVerseModalOpen(false);
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.7 }
    });
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
          style: "Elegante, reconfortante, luminoso y profundamente espiritual",
          excludedVerses: [card.verseReference]
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

  // Thematic Preset Click: Instantly changes verse, colors, and content aligned to the theme
  const handleThematicPresetClick = (
    val: string,
    time: 'morning' | 'night' | 'custom',
    categoryTheme?: 'dawn' | 'night' | 'jesus' | 'cross' | 'peace' | 'healing' | 'olive' | 'worship'
  ) => {
    setOccasion(val);
    setTimeOfDayContext(time);

    // Automatically find and assign a contextually matched verse
    const matched = findBestMatchingVerse({
      topic: val,
      timeOfDay: time,
      themeCategory: categoryTheme,
      excludedReferences: [card.verseReference]
    });

    if (matched) {
      const isNightTheme = time === 'night' || matched.recommendedTheme === 'night';
      setCard(prev => ({
        ...prev,
        verseReference: matched.reference,
        verseText: matched.text,
        cardHeader: matched.headerTitle,
        blessingQuote: matched.blessingQuote,
        shortPrayer: matched.prayer,
        themeCategory: matched.recommendedTheme,
        suggestedColors: {
          gradientStart: isNightTheme ? '#020617' : '#0f172a',
          gradientEnd: isNightTheme ? '#0f172a' : '#1e1b4b',
          accentColor: matched.accentColor || (isNightTheme ? '#38bdf8' : '#fbbf24')
        }
      }));

      if (matched.accentColor) {
        setCustomAccentColor(matched.accentColor);
      }

      const artMap: Record<string, string> = {
        healing: '/sacred-assets/jesus_healing_light_1787716152719.jpg',
        night: '/sacred-assets/jesus-night.jpg',
        peace: '/sacred-assets/jesus_peace_in_storm_1787716138284.jpg',
        cross: '/sacred-assets/cross_sunrise_hope_1787717245799.jpg',
        jesus: '/sacred-assets/jesus_divine_blessing_1787716123982.jpg',
        olive: '/sacred-assets/olive_garden_peace_1787717233225.jpg',
        dawn: '/sacred-assets/celestial-sunrise.jpg',
        worship: '/sacred-assets/heavenly_dove_light_1787717258852.jpg'
      };
      const matchingArt = artMap[matched.recommendedTheme] || (isNightTheme ? '/sacred-assets/jesus-night.jpg' : '/sacred-assets/celestial-sunrise.jpg');
      setActiveArtworkSrc(matchingArt);
      setIsGenerativeModelImage(true);
    }
  };

  // Rotates dynamically to the next contextual Bible verse without repeating
  const handleCycleNextVerse = () => {
    const nextVerse = getNextMatchingVerse(card.verseReference, {
      topic: occasion || card.cardHeader,
      timeOfDay: timeOfDayContext,
      themeCategory: card.themeCategory,
      headerTitle: card.cardHeader
    });

    if (nextVerse) {
      setCard(prev => ({
        ...prev,
        verseReference: nextVerse.reference,
        verseText: nextVerse.text,
        cardHeader: nextVerse.headerTitle,
        blessingQuote: nextVerse.blessingQuote,
        shortPrayer: nextVerse.prayer
      }));
      if (nextVerse.accentColor) {
        setCustomAccentColor(nextVerse.accentColor);
      }
    }
  };

  // Header preset click: changes header and immediately aligns the verse
  const handleHeaderPresetClick = (hdr: string) => {
    const isNightHdr = hdr.includes('NOCHE');
    const matched = findBestMatchingVerse({
      headerTitle: hdr,
      topic: hdr,
      timeOfDay: isNightHdr ? 'night' : 'morning',
      excludedReferences: [card.verseReference]
    });

    setCard(prev => ({
      ...prev,
      cardHeader: hdr,
      verseReference: matched.reference,
      verseText: matched.text,
      blessingQuote: matched.blessingQuote,
      shortPrayer: matched.prayer,
      themeCategory: matched.recommendedTheme,
      suggestedColors: {
        gradientStart: isNightHdr ? '#020617' : '#0f172a',
        gradientEnd: isNightHdr ? '#0f172a' : '#1e1b4b',
        accentColor: matched.accentColor || (isNightHdr ? '#38bdf8' : '#fbbf24')
      }
    }));
    if (matched.accentColor) {
      setCustomAccentColor(matched.accentColor);
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

    // 1. Draw Unique AI Background Image or Custom Uploaded Image
    try {
      const bgImg = await loadImage(activeArtworkSrc);
      const zoom = imageZoom || 1;
      const targetW = 1080 * zoom;
      const targetH = 1080 * zoom;
      const offsetX = (1080 - targetW) / 2;
      let offsetY = (1080 - targetH) / 2;
      if (imagePosition === 'top') offsetY = 0;
      if (imagePosition === 'bottom') offsetY = 1080 - targetH;

      const baseFilter = `brightness(${cardBrightness}) contrast(${cardContrast})`;
      if (imageFilter !== 'none') {
        if (imageFilter === 'warm') ctx.filter = `${baseFilter} sepia(0.2) saturate(1.3) brightness(1.1) hue-rotate(-10deg)`;
        else if (imageFilter === 'golden') ctx.filter = `${baseFilter} sepia(0.35) saturate(1.4) brightness(1.15)`;
        else if (imageFilter === 'sepia') ctx.filter = `${baseFilter} sepia(0.6) contrast(1.1)`;
        else if (imageFilter === 'mono') ctx.filter = `${baseFilter} grayscale(1) contrast(1.15)`;
        else if (imageFilter === 'radiant') ctx.filter = `${baseFilter} saturate(1.35) brightness(1.25)`;
      } else {
        ctx.filter = baseFilter;
      }
      ctx.drawImage(bgImg, offsetX, offsetY, targetW, targetH);
      ctx.filter = 'none';
    } catch (e) {
      const fallbackGrad = ctx.createLinearGradient(0, 0, 0, 1080);
      fallbackGrad.addColorStop(0, '#78350f');
      fallbackGrad.addColorStop(0.5, '#b45309');
      fallbackGrad.addColorStop(1, '#fbbf24');
      ctx.fillStyle = fallbackGrad;
      ctx.fillRect(0, 0, 1080, 1080);
    }

    // 2. High-Luminosity Soft Overlay for text contrast without making the card dark
    const vignette = ctx.createLinearGradient(0, 0, 0, 1080);
    vignette.addColorStop(0, `rgba(15, 23, 42, ${Math.min(0.45, overlayOpacity * 0.45)})`);
    vignette.addColorStop(0.30, `rgba(15, 23, 42, ${Math.min(0.25, overlayOpacity * 0.25)})`);
    vignette.addColorStop(0.65, `rgba(15, 23, 42, ${Math.min(0.55, overlayOpacity * 0.65)})`);
    vignette.addColorStop(1, `rgba(15, 23, 42, ${Math.min(0.75, overlayOpacity * 0.85)})`);
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, 1080, 1080);

    // Central radiant aura glow (Divine Illumination)
    if (celestialAuraGlow) {
      const aura = ctx.createRadialGradient(540, 400, 25, 540, 400, 680);
      aura.addColorStop(0, customAccentColor === '#38bdf8' ? 'rgba(186, 230, 253, 0.40)' : 'rgba(254, 240, 138, 0.40)');
      aura.addColorStop(0.35, customAccentColor === '#38bdf8' ? 'rgba(56, 189, 248, 0.22)' : 'rgba(251, 191, 36, 0.22)');
      aura.addColorStop(0.70, customAccentColor === '#38bdf8' ? 'rgba(14, 165, 233, 0.08)' : 'rgba(245, 158, 11, 0.08)');
      aura.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = aura;
      ctx.fillRect(0, 0, 1080, 1080);
    }

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

    // Sacred Icon Emoji
    ctx.font = '48px serif';
    ctx.textAlign = 'center';
    ctx.fillText(cardIcon || '🕊️', 540, 215);

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
    ctx.fillText(cardFooter || '🕊️ ESPACIO DE FE & ORACIÓN • OBRA ÚNICA ELVIS OSORIO', 540, 960);

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
          Diseña tarjetas de bendición sagradas con tu propia foto o con arte generativo, personaliza el versículo, la oración y descarga en alta resolución 1080x1080 HD.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Customizer & AI Generator Controls */}
        <div className="lg:col-span-5 p-5 sm:p-7 rounded-3xl bg-slate-900/50 border border-white/10 backdrop-blur-xl shadow-2xl space-y-6">
          
          {/* Mode Switcher Tabs */}
          <div className="flex rounded-2xl bg-slate-950/80 p-1.5 border border-white/10 shadow-inner">
            <button
              type="button"
              onClick={() => setStudioMode('editor')}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                studioMode === 'editor'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>🎨 Editor de Tarjeta</span>
            </button>
            <button
              type="button"
              onClick={() => setStudioMode('generator')}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                studioMode === 'generator'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>✨ Generador IA (Gemini)</span>
            </button>
          </div>

          {/* ============================================================ */}
          {/* MODE 1: CARD EDITOR (SUBIR IMAGEN + PERSONALIZAR CONTENIDO) */}
          {/* ============================================================ */}
          {studioMode === 'editor' && (
            <div className="space-y-6">
              
              {/* 1. SECCIÓN SUBIR IMAGEN PERSONALIZADA */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-amber-400/20 shadow-inner space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UploadCloud className="w-4 h-4 text-amber-400" />
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Subir Imagen Personalizada
                    </h4>
                  </div>
                  <span className="text-[10px] text-amber-300/90 font-medium bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/30">
                    📸 1080x1080 HD
                  </span>
                </div>

                {/* Dropzone Container */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-4 rounded-xl border-2 border-dashed text-center transition-all cursor-pointer relative overflow-hidden group ${
                    isDragging
                      ? 'border-amber-400 bg-amber-400/15 scale-[1.01]'
                      : customImageInfo
                        ? 'border-emerald-400/40 bg-slate-900/50 hover:border-amber-400/50'
                        : 'border-white/20 bg-slate-900/40 hover:border-amber-400/50 hover:bg-slate-900/70'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCustomImageUpload}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-amber-400/15 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FolderUp className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-200">
                        {isDragging ? '¡Suelta tu imagen aquí!' : 'Haz clic o arrastra tu foto aquí'}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Formatos JPG, PNG, WEBP • Se adapta perfectamente a la tarjeta
                      </p>
                    </div>
                  </div>
                </div>

                {/* Active Image Status & Adjustment Controls */}
                <div className="pt-2 space-y-3">
                  <div className="flex items-center justify-between gap-3 bg-slate-900/80 p-2.5 rounded-xl border border-white/10">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-amber-400/40 shrink-0 bg-slate-950">
                        <img
                          src={activeArtworkSrc}
                          alt="Fondo Activo"
                          className="w-full h-full object-cover"
                          style={{ filter: getCssFilter(imageFilter) }}
                          onError={(e) => {
                            e.currentTarget.src = '/sacred-assets/celestial-sunrise.jpg';
                          }}
                        />
                      </div>
                      <div className="min-w-0 text-left">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            customImageInfo 
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                              : 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                          }`}>
                            {customImageInfo ? '📸 Tu Foto' : '🎨 Fondo Sagrado'}
                          </span>
                          {customImageInfo && (
                            <span className="text-[10px] text-slate-400 font-mono">
                              {customImageInfo.size}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-200 font-medium truncate mt-0.5">
                          {customImageInfo ? customImageInfo.name : artworkPromptDescription}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
                      <button
                        type="button"
                        onClick={handleAssignRandomNovelArtwork}
                        className="p-1.5 rounded-lg bg-gradient-to-r from-amber-500/25 to-purple-500/25 hover:from-amber-500/35 hover:to-purple-500/35 text-amber-200 border border-amber-400/40 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all shadow-sm active:scale-95"
                        title="Asignar automáticamente una nueva imagen sagrada novedosa a la tarjeta"
                      >
                        <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
                        <span>🎲 Asignar Novedad</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="p-1.5 rounded-lg bg-amber-400/15 hover:bg-amber-400/25 text-amber-300 border border-amber-400/30 text-[10px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                        title="Cambiar imagen"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Cambiar</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleRestoreDefaultImage}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 border border-white/10 text-[10px] font-medium cursor-pointer transition-colors"
                        title="Restaurar fondo sagrado predeterminado"
                      >
                        Restaurar
                      </button>
                    </div>
                  </div>

                  {/* Image Adjustments (Zoom, Vertical Position, Filter, Contrast Veil) */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                    {/* Zoom Slider */}
                    <div className="bg-slate-900/60 p-2 rounded-xl border border-white/5 space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-400 font-medium flex items-center gap-1">
                          <ZoomIn className="w-3 h-3 text-amber-400" />
                          <span>Escala</span>
                        </span>
                        <span className="text-amber-400 font-mono font-bold">{Math.round(imageZoom * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="2.5"
                        step="0.05"
                        value={imageZoom}
                        onChange={(e) => setImageZoom(parseFloat(e.target.value))}
                        className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-amber-400"
                      />
                    </div>

                    {/* Illumination / Brightness Slider */}
                    <div className="bg-slate-900/60 p-2 rounded-xl border border-amber-400/20 space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-amber-300 font-medium flex items-center gap-1">
                          <Sun className="w-3 h-3 text-amber-400" />
                          <span>Iluminación / Brillo</span>
                        </span>
                        <span className="text-amber-400 font-mono font-bold">{Math.round(cardBrightness * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0.8"
                        max="1.8"
                        step="0.05"
                        value={cardBrightness}
                        onChange={(e) => setCardBrightness(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-amber-400"
                        title="Aumenta el brillo general de la tarjeta sagrada"
                      />
                    </div>

                    {/* Contrast / Soft Veil Overlay Slider */}
                    <div className="bg-slate-900/60 p-2 rounded-xl border border-white/5 space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-400 font-medium flex items-center gap-1">
                          <Sliders className="w-3 h-3 text-amber-400" />
                          <span>Tinte de Sombra (Velo)</span>
                        </span>
                        <span className="text-amber-400 font-mono font-bold">{Math.round(overlayOpacity * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0.05"
                        max="0.75"
                        step="0.05"
                        value={overlayOpacity}
                        onChange={(e) => setOverlayOpacity(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-amber-400"
                        title="Ajusta la sombra para contraste: a menor porcentaje, mayor luminosidad"
                      />
                    </div>

                    {/* Contrast Level */}
                    <div className="bg-slate-900/60 p-2 rounded-xl border border-white/5 space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-400 font-medium flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-400" />
                          <span>Contraste & Nitidez</span>
                        </span>
                        <span className="text-amber-400 font-mono font-bold">{Math.round(cardContrast * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0.85"
                        max="1.35"
                        step="0.05"
                        value={cardContrast}
                        onChange={(e) => setCardContrast(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-amber-400"
                      />
                    </div>

                    {/* Filter Atmosphere */}
                    <div className="bg-slate-900/60 p-2 rounded-xl border border-white/5 space-y-1">
                      <span className="text-[10px] text-slate-400 font-medium block">
                        Filtro Sagrado
                      </span>
                      <select
                        value={imageFilter}
                        onChange={(e) => setImageFilter(e.target.value as any)}
                        className="w-full bg-slate-800 text-slate-200 text-[10px] rounded px-1.5 py-0.5 border border-white/10 focus:outline-none focus:border-amber-400 cursor-pointer"
                      >
                        <option value="none">✨ Original Luminous</option>
                        <option value="radiant">🌟 Máxima Luz Radiante</option>
                        <option value="golden">👑 Gloria Dorada</option>
                        <option value="warm">🌅 Amanecer Cálido</option>
                        <option value="sepia">📜 Pergamino Sagrado</option>
                        <option value="mono">🕊️ Pureza B & N</option>
                      </select>
                    </div>

                    {/* Vertical Alignment */}
                    <div className="bg-slate-900/60 p-2 rounded-xl border border-white/5 space-y-1">
                      <span className="text-[10px] text-slate-400 font-medium block">
                        Enfoque
                      </span>
                      <div className="flex gap-1">
                        {(['top', 'center', 'bottom'] as const).map((pos) => (
                          <button
                            key={pos}
                            type="button"
                            onClick={() => setImagePosition(pos)}
                            className={`flex-1 py-0.5 text-[9px] font-bold rounded transition-all cursor-pointer capitalize ${
                              imagePosition === pos
                                ? 'bg-amber-400 text-slate-950 shadow-sm'
                                : 'bg-slate-800/80 text-slate-400 hover:text-white'
                            }`}
                          >
                            {pos === 'top' ? 'Arr' : pos === 'center' ? 'Cen' : 'Abj'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Quick Divine Lighting Presets */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setCardBrightness(1.40);
                        setOverlayOpacity(0.15);
                        setCardContrast(1.10);
                        setImageFilter('radiant');
                        setCelestialAuraGlow(true);
                      }}
                      className="flex-1 py-1 px-2 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/40 text-amber-300 text-[10px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer shadow-sm"
                    >
                      <Sun className="w-3 h-3 text-amber-400" />
                      <span>✨ Máxima Luz (+35% Brillo)</span>
                    </button>
                    <label className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={celestialAuraGlow}
                        onChange={(e) => setCelestialAuraGlow(e.target.checked)}
                        className="rounded border-white/20 text-amber-400 focus:ring-0 cursor-pointer"
                      />
                      <span>🌟 Aureola Divina</span>
                    </label>
                  </div>

                  {/* Sacred Preset Visual Gallery (24 Curated High-Definition Artworks) */}
                  <div className="pt-3 border-t border-white/10 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-amber-300 font-bold flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                        <span>Galería Visual de Obras Sagradas ({SACRED_THEME_PRESETS.length} Disponibles)</span>
                      </span>
                      <span className="text-[9px] text-slate-400">
                        Haz clic para aplicar fondo con iluminación perfecta
                      </span>
                    </div>

                    {/* Category Filter Pills */}
                    <div className="flex flex-wrap gap-1">
                      {[
                        { id: 'all', label: `✨ Todas (${SACRED_THEME_PRESETS.length})` },
                        { id: 'novel', label: `🔥 Novedades (${SACRED_THEME_PRESETS.filter(p => p.badge?.includes('Novedad') || p.id.startsWith('novel-')).length})` },
                        { id: 'dawn', label: '🌅 Luz & Alba' },
                        { id: 'jesus', label: '👑 Jesús en Gloria' },
                        { id: 'peace', label: '🕊️ Paz & Espíritu' },
                        { id: 'healing', label: '🌿 Sanidad & Oración' },
                        { id: 'cross', label: '✝️ Cruz de Victoria' },
                        { id: 'night', label: '🌌 Noche Celestial' }
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setGalleryCategory(tab.id)}
                          className={`text-[10px] px-2 py-0.5 rounded-full border transition-all cursor-pointer ${
                            galleryCategory === tab.id
                              ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold shadow-sm'
                              : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {/* Visual Artwork Thumbnail Cards */}
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-56 overflow-y-auto pr-1">
                      {SACRED_THEME_PRESETS.filter(p => {
                        if (galleryCategory === 'all') return true;
                        if (galleryCategory === 'novel') return p.badge?.includes('Novedad') || p.id.startsWith('novel-');
                        return p.category === galleryCategory;
                      }).map((preset) => {
                        const isSelected = activeArtworkSrc === preset.url && !customImageInfo;
                        return (
                          <div
                            key={preset.id}
                            onClick={() => {
                              handleSelectPresetArtwork(preset);
                              setCustomImageInfo(null);
                            }}
                            className={`group relative rounded-xl overflow-hidden border transition-all cursor-pointer text-left flex flex-col ${
                              isSelected 
                                ? 'border-amber-400 ring-2 ring-amber-400/50 shadow-lg shadow-amber-500/20' 
                                : 'border-white/10 hover:border-amber-400/50 hover:shadow-md'
                            }`}
                            title={preset.promptDesc}
                          >
                            <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                              <img
                                src={preset.url}
                                alt={preset.name}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                              {preset.badge && (
                                <span className="absolute top-1 right-1 text-[8px] font-bold px-1.5 py-0.2 rounded-full bg-amber-400/90 text-slate-950">
                                  {preset.badge}
                                </span>
                              )}
                              {isSelected && (
                                <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow">
                                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                                </div>
                              )}
                            </div>
                            <div className="p-1.5 bg-slate-950/90 flex flex-col justify-between">
                              <span className="text-[10px] font-medium text-slate-200 truncate group-hover:text-amber-300">
                                {preset.name}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. SECCIÓN TEXTOS & CONTENIDO DE LA TARJETA */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Type className="w-4 h-4 text-amber-400" />
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Editor de Mensaje & Dedicatoria
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsVerseModalOpen(true)}
                    className="px-2.5 py-1 rounded-lg bg-amber-400/15 hover:bg-amber-400/25 border border-amber-400/30 text-amber-300 text-[10px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <BookOpen className="w-3 h-3" />
                    <span>Biblioteca Bíblica</span>
                  </button>
                </div>

                {/* Encabezado / Título Superior */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Título Superior de la Tarjeta
                  </label>
                  <input
                    type="text"
                    value={card.cardHeader || ''}
                    onChange={(e) => setCard(c => ({ ...c, cardHeader: e.target.value }))}
                    placeholder="BENDICIÓN DE DIOS"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-slate-100 text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-amber-400"
                  />
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {[
                      'UN NUEVO AMANECER DE ESPERANZA',
                      'NOCHE DE PAZ Y DESCANSO',
                      'ORACIÓN DE SANIDAD Y FE',
                      'BENDICIÓN PARA NUESTRO HOGAR',
                      'REFUGIO Y FORTALEZA'
                    ].map((hdr, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleHeaderPresetClick(hdr)}
                        title={`Aplicar título y versículo bíblico acorde a ${hdr}`}
                        className="text-[9px] px-2 py-0.5 rounded bg-white/5 hover:bg-amber-400/20 text-slate-300 hover:text-amber-200 border border-white/5 cursor-pointer transition-colors"
                      >
                        {hdr}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Emblema / Icono Sagrado */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Emblema Sagrado Central
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                    {[
                      { icon: '🕊️', name: 'Paloma' },
                      { icon: '✝️', name: 'Cruz' },
                      { icon: '🌅', name: 'Sol' },
                      { icon: '✨', name: 'Luz' },
                      { icon: '🌿', name: 'Olivo' },
                      { icon: '💖', name: 'Amor' },
                      { icon: '👑', name: 'Corona' },
                      { icon: '🛡️', name: 'Escudo' }
                    ].map((item) => (
                      <button
                        key={item.icon}
                        type="button"
                        onClick={() => setCardIcon(item.icon)}
                        className={`py-1.5 rounded-xl border text-base flex flex-col items-center justify-center transition-all cursor-pointer ${
                          cardIcon === item.icon
                            ? 'bg-amber-400/20 border-amber-400 shadow-md scale-105'
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                        title={item.name}
                      >
                        <span>{item.icon}</span>
                        <span className="text-[8px] text-slate-400 mt-0.5">{item.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Destinatario ("Para:") */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-semibold text-slate-300">
                      Destinatario ("Para:")
                    </label>
                    <button
                      type="button"
                      onClick={handleRandomRecipient}
                      className="text-[10px] text-amber-400 hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <Shuffle className="w-2.5 h-2.5" />
                      <span>Sugerir</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="Ej: Mi amada familia, Mis hijos..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
                  />
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {['👨‍👩‍👧‍👦 Mi amada familia', '❤️ Mis amados hijos', '🕊️ Quien necesita consuelo hoy', '🙏 Hermanos en la fe'].map((r, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setRecipient(r)}
                        className="text-[9px] px-2 py-0.5 rounded bg-white/5 hover:bg-amber-400/20 text-slate-300 hover:text-amber-200 border border-white/5 cursor-pointer"
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Frase Central de Bendición */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Frase Principal de Bendición
                  </label>
                  <textarea
                    rows={3}
                    value={card.blessingQuote}
                    onChange={(e) => setCard(c => ({ ...c, blessingQuote: e.target.value }))}
                    placeholder="Escribe aquí la bendición o mensaje central..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-slate-100 text-xs font-serif italic focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Versículo Bíblico: Referencia & Texto */}
                <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Versículo Bíblico</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleCycleNextVerse}
                        title="Cambiar automáticamente a otro versículo bíblico acorde a la temática de esta tarjeta"
                        className="text-[10px] text-amber-300 hover:text-amber-200 bg-amber-400/15 hover:bg-amber-400/25 px-2 py-0.5 rounded-lg border border-amber-400/25 font-semibold flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                      >
                        <RefreshCw className="w-3 h-3 text-amber-400" />
                        <span>Rotar Versículo Acorde</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsVerseModalOpen(true)}
                        className="text-[10px] text-amber-400 hover:text-amber-300 font-semibold hover:underline cursor-pointer"
                      >
                        📖 Biblioteca
                      </button>
                    </div>
                  </div>
                  <div>
                    <input
                      type="text"
                      value={card.verseReference}
                      onChange={(e) => setCard(c => ({ ...c, verseReference: e.target.value }))}
                      placeholder="Referencia (ej: Lamentaciones 3:22-23)"
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-white/10 text-amber-300 text-xs font-bold focus:outline-none focus:border-amber-400 mb-1.5"
                    />
                    <textarea
                      rows={2}
                      value={card.verseText}
                      onChange={(e) => setCard(c => ({ ...c, verseText: e.target.value }))}
                      placeholder="Texto del versículo bíblico..."
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-white/10 text-slate-200 text-xs italic font-serif focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Oración Breve */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Oración Breve / Plegaria
                  </label>
                  <textarea
                    rows={2}
                    value={card.shortPrayer}
                    onChange={(e) => setCard(c => ({ ...c, shortPrayer: e.target.value }))}
                    placeholder="Plegaria breve..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-slate-100 text-xs italic focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Pie de Tarjeta / Firma */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Firma o Pie de Tarjeta
                  </label>
                  <input
                    type="text"
                    value={cardFooter}
                    onChange={(e) => setCardFooter(e.target.value)}
                    placeholder="ESPACIO DE FE & ORACIÓN • OBRA ÚNICA ELVIS OSORIO"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 text-xs font-medium focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* 3. SECCIÓN ESTILOS, TIPOGRAFÍA & COLORES */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-white/10 space-y-3.5">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-amber-400" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Estilos, Tipografía & Acabados
                  </h4>
                </div>

                {/* Color de Acento */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
                    Color de Acento Divino
                  </label>
                  <div className="flex items-center gap-2">
                    {[
                      { color: '#fbbf24', name: 'Oro' },
                      { color: '#f59e0b', name: 'Ámbar' },
                      { color: '#38bdf8', name: 'Cielo' },
                      { color: '#34d399', name: 'Esmeralda' },
                      { color: '#c084fc', name: 'Púrpura' },
                      { color: '#ffffff', name: 'Blanco' }
                    ].map((item) => (
                      <button
                        key={item.color}
                        type="button"
                        onClick={() => setCustomAccentColor(item.color)}
                        className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                          customAccentColor === item.color ? 'scale-125 border-white shadow-lg' : 'border-transparent hover:scale-110'
                        }`}
                        style={{ backgroundColor: item.color }}
                        title={item.name}
                      />
                    ))}
                    <div className="ml-auto flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-400">Libre:</span>
                      <input
                        type="color"
                        value={customAccentColor}
                        onChange={(e) => setCustomAccentColor(e.target.value)}
                        className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                    </div>
                  </div>
                </div>

                {/* Tipografía & Alineación */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-300 mb-1">
                      Tipografía
                    </label>
                    <div className="flex gap-1">
                      {[
                        { id: 'serif' as const, label: 'Serif' },
                        { id: 'cinzel' as const, label: 'Cinzel' },
                        { id: 'sans' as const, label: 'Moderna' }
                      ].map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => setFontFamily(f.id)}
                          className={`flex-1 py-1 text-[10px] font-semibold rounded-lg border transition-all cursor-pointer ${
                            fontFamily === f.id
                              ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-sm'
                              : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                          }`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-300 mb-1">
                      Alineación
                    </label>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => setTextAlign('center')}
                        className={`flex-1 py-1 text-[10px] font-semibold rounded-lg border flex items-center justify-center gap-1 transition-all cursor-pointer ${
                          textAlign === 'center'
                            ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-sm'
                            : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        <AlignCenter className="w-3 h-3" />
                        <span>Centro</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setTextAlign('left')}
                        className={`flex-1 py-1 text-[10px] font-semibold rounded-lg border flex items-center justify-center gap-1 transition-all cursor-pointer ${
                          textAlign === 'left'
                            ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-sm'
                            : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        <AlignLeft className="w-3 h-3" />
                        <span>Izquierda</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Opacidad del Fondo & Toggles */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-300 font-semibold flex items-center gap-1">
                      <Sliders className="w-3 h-3 text-amber-400" />
                      <span>Oscuridad del Fondo (Contraste)</span>
                    </span>
                    <span className="text-[11px] text-amber-400 font-mono font-bold">
                      {Math.round(overlayOpacity * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="0.9"
                    step="0.05"
                    value={overlayOpacity}
                    onChange={(e) => setOverlayOpacity(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                  />

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer text-[11px] text-slate-300">
                      <input
                        type="checkbox"
                        checked={showGoldBorder}
                        onChange={(e) => setShowGoldBorder(e.target.checked)}
                        className="rounded border-white/20 text-amber-400 focus:ring-0 cursor-pointer"
                      />
                      <span>Marco Dorado Sagrado</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-[11px] text-slate-300">
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

            </div>
          )}

          {/* ============================================================ */}
          {/* MODE 2: GENERADOR IA (GEMINI GENERATIVE PROMPT & ENGINE)      */}
          {/* ============================================================ */}
          {studioMode === 'generator' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <h3 className="text-sm font-bold text-white font-cinzel flex items-center gap-2">
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
                      onClick={() => handleThematicPresetClick('Bendición de Buenos Días y Renovación', 'morning', 'dawn')}
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
                      onClick={() => handleThematicPresetClick('Bendición de Buenas Noches y Paz para Dormir', 'night', 'night')}
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
                      { label: '🌅 Buenos Días', val: 'Bendición de Buenos Días y Renovación de Fe', time: 'morning' as const, theme: 'dawn' as const },
                      { label: '🌙 Buenas Noches', val: 'Bendición de Buenas Noches y Paz para Dormir', time: 'night' as const, theme: 'night' as const },
                      { label: '🌿 Sanidad', val: 'Oración de Sanidad, Restauración y Salud Divina', time: 'morning' as const, theme: 'healing' as const },
                      { label: '🕊️ Paz en Tormenta', val: 'Paz y Confianza en medio de la Prueba', time: 'custom' as const, theme: 'peace' as const },
                      { label: '✝️ Gracia & Cruz', val: 'La Gracia Redentora de Jesucristo en la Cruz', time: 'custom' as const, theme: 'cross' as const },
                      { label: '🏡 Familia', val: 'Bendición, Protección y Unidad Familiar', time: 'morning' as const, theme: 'olive' as const },
                      { label: '🛡️ Salmo 91', val: 'Amparo y Protección Divina del Salmo 91', time: 'custom' as const, theme: 'peace' as const }
                    ].map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleThematicPresetClick(item.val, item.time, item.theme)}
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

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => setStudioMode('editor')}
                    className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center justify-center gap-1.5 hover:underline cursor-pointer mx-auto"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>¿Quieres subir tu foto o retocar textos? Ir al Editor de Tarjeta</span>
                  </button>
                </div>
              </div>
            </div>
          )}

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
                className="w-full max-w-[480px] aspect-square rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl flex flex-col justify-between select-none transition-all duration-300"
                style={{
                  backgroundImage: `url(${activeArtworkSrc})`,
                  backgroundSize: imageZoom > 1 ? `${imageZoom * 100}%` : 'cover',
                  backgroundPosition: imagePosition === 'top' ? 'center top' : imagePosition === 'bottom' ? 'center bottom' : 'center',
                  filter: getCssFilter(imageFilter)
                }}
              >
                {/* High-Luminosity Soft Overlay (allows background artwork and divine light to shine through) */}
                <div 
                  className="absolute inset-0 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: `linear-gradient(to bottom, rgba(15, 23, 42, ${overlayOpacity * 0.45}) 0%, rgba(15, 23, 42, ${overlayOpacity * 0.20}) 35%, rgba(15, 23, 42, ${overlayOpacity * 0.55}) 70%, rgba(15, 23, 42, ${overlayOpacity * 0.80}) 100%)`
                  }}
                />

                {/* Central Radiant Sunburst / Celestial Aura Glow */}
                {celestialAuraGlow && (
                  <div 
                    className="absolute inset-0 pointer-events-none transition-all duration-500"
                    style={{
                      background: customAccentColor === '#38bdf8'
                        ? 'radial-gradient(circle at 50% 40%, rgba(186, 230, 253, 0.35) 0%, rgba(56, 189, 248, 0.18) 40%, transparent 75%)'
                        : 'radial-gradient(circle at 50% 40%, rgba(254, 240, 138, 0.35) 0%, rgba(245, 158, 11, 0.18) 40%, transparent 75%)'
                    }}
                  />
                )}

                {/* Floating Celestial Light Particles */}
                {showParticles && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute w-2 h-2 rounded-full bg-amber-200/40 blur-[1px] top-1/4 left-1/5 animate-pulse" />
                    <div className="absolute w-3 h-3 rounded-full bg-amber-300/30 blur-[2px] top-1/3 right-1/4 animate-pulse delay-75" />
                    <div className="absolute w-1.5 h-1.5 rounded-full bg-white/50 top-1/2 left-1/3 animate-ping" />
                    <div className="absolute w-2.5 h-2.5 rounded-full bg-amber-100/40 blur-[1px] bottom-1/3 right-1/5 animate-pulse delay-150" />
                  </div>
                )}

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
                <div className={`relative z-10 space-y-1 ${textAlign === 'left' ? 'text-left' : 'text-center'}`}>
                  <div 
                    className="text-[11px] sm:text-xs font-bold tracking-widest uppercase drop-shadow-md"
                    style={{ color: customAccentColor || '#fbbf24' }}
                  >
                    {card.cardHeader || 'BENDICIÓN DE DIOS'}
                  </div>
                  <div className="text-2xl sm:text-3xl">{cardIcon || '🕊️'}</div>
                  {recipient && (
                    <div className="text-xs sm:text-sm font-medium text-slate-200 drop-shadow">
                      Para: <span className="font-semibold text-white">{recipient}</span>
                    </div>
                  )}
                </div>

                {/* Main Quote */}
                <div className={`relative z-10 px-2 my-auto ${textAlign === 'left' ? 'text-left' : 'text-center'}`}>
                  <p className={`text-base sm:text-lg italic text-white leading-relaxed drop-shadow-lg ${fontFamily === 'cinzel' ? 'font-cinzel' : fontFamily === 'sans' ? 'font-sans' : 'font-serif'}`}>
                    "{card.blessingQuote}"
                  </p>
                </div>

                {/* Verse Scripture Box */}
                <div className="relative z-10 space-y-2">
                  <div className={`p-3.5 sm:p-4 rounded-2xl bg-slate-950/75 border border-white/15 backdrop-blur-md shadow-xl space-y-1 ${textAlign === 'left' ? 'text-left' : 'text-center'}`}>
                    <div 
                      className="text-xs font-bold"
                      style={{ color: customAccentColor || '#fbbf24' }}
                    >
                      📖 {card.verseReference}
                    </div>
                    <p className={`text-[11px] sm:text-xs text-slate-200 italic leading-relaxed ${fontFamily === 'cinzel' ? 'font-cinzel' : fontFamily === 'sans' ? 'font-sans' : 'font-serif'}`}>
                      "{card.verseText}"
                    </p>
                  </div>

                  <p className={`text-[11px] sm:text-xs text-amber-200/90 italic drop-shadow ${textAlign === 'left' ? 'text-left' : 'text-center'}`}>
                    🙏 {card.shortPrayer}
                  </p>

                  {/* Persistent Branding Signature Line for Elvis Osorio */}
                  <div className="text-[9px] text-slate-300/85 uppercase tracking-wider pt-1 font-semibold text-center">
                    {cardFooter || '🕊️ ESPACIO DE FE & ORACIÓN • OBRA ÚNICA ELVIS OSORIO'}
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

      {/* ============================================================ */}
      {/* MODAL: BIBLIOTECA SAGRADA DE VERSÍCULOS BÍBLICOS             */}
      {/* ============================================================ */}
      {isVerseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-3xl max-h-[88vh] flex flex-col rounded-3xl bg-slate-900 border border-amber-400/30 shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-slate-950/80">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white font-cinzel">
                    Biblioteca Sagrada de Versículos Bíblicos
                  </h3>
                  <p className="text-xs text-slate-400">
                    Selecciona un versículo para insertarlo instantáneamente en tu tarjeta
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsVerseModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search & Categories Bar */}
            <div className="p-4 border-b border-white/10 bg-slate-950/40 space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={verseSearchTerm}
                  onChange={(e) => setVerseSearchTerm(e.target.value)}
                  placeholder="Buscar por libro, palabra clave (paz, sanidad, amor, salmo)..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/90 border border-white/10 text-slate-200 text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                {BIBLICAL_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setVerseCategoryFilter(cat.id)}
                    className={`px-3 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      verseCategoryFilter === cat.id
                        ? 'bg-amber-400 text-slate-950 shadow-md font-bold'
                        : 'bg-white/5 border border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/10'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Verses List */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-3.5 flex-1 max-h-[58vh]">
              {BIBLICAL_VERSES_COLLECTION
                .filter((v) => {
                  const matchesCategory = verseCategoryFilter === 'all' || v.category === verseCategoryFilter;
                  const query = verseSearchTerm.toLowerCase().trim();
                  if (!query) return matchesCategory;
                  const matchesQuery = 
                    v.reference.toLowerCase().includes(query) ||
                    v.text.toLowerCase().includes(query) ||
                    v.categoryLabel.toLowerCase().includes(query) ||
                    v.blessingQuote.toLowerCase().includes(query) ||
                    v.keywords?.some((k: string) => k.toLowerCase().includes(query));
                  return matchesCategory && matchesQuery;
                })
                .map((verse) => (
                  <div
                    key={verse.id}
                    className="p-4 rounded-2xl bg-slate-950/70 border border-white/10 hover:border-amber-400/40 transition-all space-y-2 group"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-amber-300 font-cinzel">
                          📖 {verse.reference}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-300/90 border border-amber-400/20 font-medium">
                          {verse.categoryLabel}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleApplyVerseFromLibrary(verse)}
                        className="px-3 py-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                      >
                        <Sparkle className="w-3.5 h-3.5" />
                        <span>Aplicar a Tarjeta</span>
                      </button>
                    </div>

                    <p className="text-xs text-slate-200 italic font-serif leading-relaxed">
                      "{verse.text}"
                    </p>

                    <div className="pt-1.5 border-t border-white/5 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
                      <span className="truncate max-w-md italic">
                        🙏 "{verse.blessingQuote}"
                      </span>
                    </div>
                  </div>
                ))}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-white/10 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
              <span>💡 Al aplicar un versículo, se actualiza la cita, oración y título de tu tarjeta automáticamente.</span>
              <button
                type="button"
                onClick={() => setIsVerseModalOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium cursor-pointer"
              >
                Cerrar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

