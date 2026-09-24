import React, { useState, useEffect, useMemo } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Calendar, 
  Volume2, 
  VolumeX, 
  Share2, 
  Copy, 
  Check, 
  CheckCheck,
  Quote, 
  CheckCircle2, 
  Lightbulb, 
  Heart,
  RefreshCw,
  Flame,
  Clock,
  ChevronRight,
  Music,
  Play,
  Pause,
  ExternalLink,
  MessageSquare,
  Globe,
  Hash,
  Send,
  Sliders,
  Radio,
  Layers,
  Palette,
  Film,
  Download,
  Shuffle,
  Mic,
  Activity,
  Headphones,
  Disc,
  Volume1
} from 'lucide-react';
import { DailyDevotional, DevotionalSong, BlessingCard, FaithScriptData } from '../types';
import { INITIAL_DEVOTIONAL } from '../data/initialData';
import { DevotionalReader, worshipSongEngine } from '../utils/audioSynth';

interface DailyDevotionalViewProps {
  onNavigateToCardStudio?: () => void;
  onNavigateToVideoStudio?: () => void;
}

const DEFAULT_DEVOTIONAL_SONG: DevotionalSong = {
  songTitle: "Nuevas Son Cada Mañana",
  musicalStyle: "Balada Acústica de Adoración en 432 Hz con Piano y Cuerdas Celestes",
  keyAndTempo: "Sol Mayor (G) • 68 BPM • Tiempo Lento de Adoración",
  chordsProgression: "G - D/F# - Em7 - Cadd9 (Verso) / C - D - G - Em (Coro)",
  sections: [
    {
      section: "Verso 1",
      lyrics: "Al despuntar el alba sobre mi ventana,\ntu dulce voz me llama a descansar en ti.\nAunque la noche fue larga y hubo tempestad,\ntu fidelidad eterna no me dejará caer.",
      chordsHint: "[G] - [D/F#] - [Em7] - [Cadd9]"
    },
    {
      section: "Pre-Coro",
      lyrics: "Miro al cielo y puedo respirar,\ntu amor infinito me vuelve a levantar.",
      chordsHint: "[Am7] - [Bm7] - [Cadd9] - [D]"
    },
    {
      section: "Coro",
      lyrics: "¡Nuevas son cada mañana tus bondades, Señor!\n¡Grande es tu fidelidad, mi Redentor!\nNo hay tormenta que apague tu verdad,\nen tus brazos encuentro sanidad y paz.",
      chordsHint: "[G] - [D] - [Em] - [Cadd9]"
    },
    {
      section: "Verso 2",
      lyrics: "Tus llagas de amor son mi refugio eterno,\nen ti no hay sombra, solo luz y salvación.\nHoy entrego mi carga, mis miedos y aflicción,\nporque tú vives y reina tu bendición.",
      chordsHint: "[G] - [D/F#] - [Em7] - [Cadd9]"
    },
    {
      section: "Puente",
      lyrics: "Santo, Santo, digno es el Señor,\ntodo mi ser te rinde adoración.\nDeclaro hoy tu gracia, tu gloria y tu poder,\n¡conmigo estás y nunca temeré!",
      chordsHint: "[Em] - [D] - [C] - [D]"
    },
    {
      section: "Coro Final",
      lyrics: "¡Nuevas son cada mañana tus bondades, Señor!\n¡Grande es tu fidelidad, mi Redentor!\nAleluya, por siempre cantaré,\nen tu amparo seguro viviré.",
      chordsHint: "[G] - [D] - [Em] - [Cadd9]"
    },
    {
      section: "Outro",
      lyrics: "Amén... En ti confío, mi Jesús... Amén.",
      chordsHint: "[Cadd9] - [G/B] - [Am7] - [G]"
    }
  ],
  fullLyrics: `[Verso 1]\nAl despuntar el alba sobre mi ventana,\ntu dulce voz me llama a descansar en ti.\nAunque la noche fue larga y hubo tempestad,\ntu fidelidad eterna no me dejará caer.\n\n[Pre-Coro]\nMiro al cielo y puedo respirar,\ntu amor infinito me vuelve a levantar.\n\n[Coro]\n¡Nuevas son cada mañana tus bondades, Señor!\n¡Grande es tu fidelidad, mi Redentor!\nNo hay tormenta que apague tu verdad,\nen tus brazos encuentro sanidad y paz.\n\n[Verso 2]\nTus llagas de amor son mi refugio eterno,\nen ti no hay sombra, solo luz y salvación.\nHoy entrego mi carga, mis miedos y aflicción,\nporque tú vives y reina tu bendición.\n\n[Puente]\nSanto, Santo, digno es el Señor,\ntodo mi ser te rinde adoración.\nDeclaro hoy tu gracia, tu gloria y tu poder,\n¡conmigo estás y nunca temeré!\n\n[Coro Final]\n¡Nuevas son cada mañana tus bondades, Señor!\n¡Grande es tu fidelidad, mi Redentor!\nAleluya, por siempre cantaré,\nen tu amparo seguro viviré.\n\n[Outro]\nAmén... En ti confío, mi Jesús... Amén.`,
  spiritualMessage: "Inspirada en Lamentaciones 3:22-23, esta alabanza recuerda que cada amanecer renueva el amor y la compasión inagotable de Dios."
};

export const DailyDevotionalView: React.FC<DailyDevotionalViewProps> = ({
  onNavigateToCardStudio,
  onNavigateToVideoStudio
}) => {
  const [devotional, setDevotional] = useState<DailyDevotional>(INITIAL_DEVOTIONAL);
  const [isLoading, setIsLoading] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [voiceMode, setVoiceMode] = useState<'jesus' | 'church' | 'peace'>('jesus');
  const [withChurchAmbience, setWithChurchAmbience] = useState(true);
  const [showJesusTeleprompter, setShowJesusTeleprompter] = useState(true);
  const [activeJesusPhraseIndex, setActiveJesusPhraseIndex] = useState(0);
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>('Hoy, ' + new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }));
  
  // Custom prompt & topics
  const [customTopic, setCustomTopic] = useState('');
  
  // Social Media SEO state
  const [seoTab, setSeoTab] = useState<'instagram' | 'whatsapp' | 'hashtags' | 'metadata'>('instagram');
  const [copiedSeoType, setCopiedSeoType] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Christian Praise Song State
  const [song, setSong] = useState<DevotionalSong>(DEFAULT_DEVOTIONAL_SONG);
  const [isGeneratingSong, setIsGeneratingSong] = useState(false);
  const [isSongPlaying, setIsSongPlaying] = useState(false);
  const [songMode, setSongMode] = useState<'vocals-and-melody' | 'melody-only'>('vocals-and-melody');
  const [selectedSongStyle, setSelectedSongStyle] = useState('Balada Pop de Adoración');
  const [arrangementStyle, setArrangementStyle] = useState<'balada-pop' | 'acustico-intimo' | 'pop-worship-gloria' | 'santuario-432hz'>('balada-pop');
  const [singerVoiceStyle, setSingerVoiceStyle] = useState<'salmista-principal' | 'adoracion-intima' | 'clamor-gloria'>('salmista-principal');
  const [currentBeat, setCurrentBeat] = useState(1);
  const [currentSectionName, setCurrentSectionName] = useState('Intro');

  // Action toast state
  const [actionToast, setActionToast] = useState<{ title: string; desc: string } | null>(null);

  // Coherent Spoken Script for Jesus
  const jesusSpokenScript = useMemo(() => {
    return DevotionalReader.formatJesusSpokenScript({
      devotionalTitle: devotional.devotionalTitle,
      verseReference: devotional.verseReference,
      verseText: devotional.verseText,
      reflectionText: devotional.reflectionText,
      guidedPrayer: devotional.guidedPrayer,
      thoughtOfTheDay: devotional.thoughtOfTheDay
    });
  }, [devotional]);

  // 1. AUTOMATIC DAILY UPDATE ON MOUNT (Checks if date changed or loads fresh)
  useEffect(() => {
    const todayStr = new Date().toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const cachedData = localStorage.getItem('saved_daily_devotional_data');
    const cachedDate = localStorage.getItem('saved_daily_devotional_date');
    const cachedSong = localStorage.getItem('saved_daily_devotional_song');

    if (cachedData && cachedDate === todayStr) {
      try {
        const parsed = JSON.parse(cachedData);
        setDevotional(parsed);
        if (parsed.lastUpdated) {
          setLastUpdatedTime(parsed.lastUpdated);
        }
        if (cachedSong) {
          setSong(JSON.parse(cachedSong));
        } else {
          generateInspiredSong(parsed);
        }
      } catch (e) {
        handleGenerateDevotional(undefined, true);
      }
    } else {
      // Different day or first time: trigger automatic daily generation
      handleGenerateDevotional(undefined, true);
    }
  }, []);

  // Generate / Refresh Devotional
  const handleGenerateDevotional = async (topic?: string, isAuto = false) => {
    const query = topic || customTopic || "Fidelidad y renovación de misericordias de Dios para hoy";
    setIsLoading(true);
    DevotionalReader.stop();
    worshipSongEngine.stop();
    setIsReading(false);
    setIsSongPlaying(false);

    const todayDateFormatted = new Date().toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    const nowTimeStr = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

    try {
      const res = await fetch('/api/gemini/daily-devotional', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          focusTopic: query,
          dateString: todayDateFormatted
        })
      });

      if (!res.ok) throw new Error("Error al obtener el devocional");
      const data = await res.json();
      const updatedDevotional: DailyDevotional = {
        ...data,
        lastUpdated: `Hoy a las ${nowTimeStr}`
      };

      setDevotional(updatedDevotional);
      setLastUpdatedTime(`Hoy a las ${nowTimeStr}`);

      // Save to localStorage for automatic daily caching
      localStorage.setItem('saved_daily_devotional_data', JSON.stringify(updatedDevotional));
      localStorage.setItem('saved_daily_devotional_date', todayDateFormatted);

      // Also generate/update the Christian praise song based on this new devotional
      generateInspiredSong(updatedDevotional);

      if (!isAuto) {
        showToast('¡Devocional Actualizado con Éxito!', 'Se ha generado un nuevo mensaje de fe, oración y alabanza para hoy.');
      }
    } catch (err) {
      console.warn("[DailyDevotional] Handled notice:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate AI Christian Praise Song for this Devotional
  const generateInspiredSong = async (devData?: DailyDevotional, styleOverride?: string) => {
    const currentDev = devData || devotional;
    const songStyle = styleOverride || selectedSongStyle;
    setIsGeneratingSong(true);
    worshipSongEngine.stop();
    setIsSongPlaying(false);

    try {
      const res = await fetch('/api/gemini/devotional-song', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          devotionalTitle: currentDev.devotionalTitle,
          verseReference: currentDev.verseReference,
          verseText: currentDev.verseText,
          reflectionText: currentDev.reflectionText,
          songStyle: songStyle
        })
      });

      if (!res.ok) throw new Error("Error al componer alabanza");
      const songData = await res.json();
      setSong(songData);
      localStorage.setItem('saved_daily_devotional_song', JSON.stringify(songData));
    } catch (err) {
      console.warn("[DevotionalSong] Handled notice:", err);
    } finally {
      setIsGeneratingSong(false);
    }
  };

  // 3. Audio Locution: Solemn & Loving Jesus Voice with Church Sanctuary Ambience
  const toggleVoice = () => {
    if (isReading) {
      DevotionalReader.stop();
      setIsReading(false);
    } else {
      worshipSongEngine.stop();
      setIsSongPlaying(false);
      setIsReading(true);

      const textToRead = jesusSpokenScript.fullScript;
      setActiveJesusPhraseIndex(0);

      DevotionalReader.speak(textToRead, {
        voiceMode: voiceMode,
        withChurchAmbience: withChurchAmbience,
        onBoundary: (charIndex) => {
          if (jesusSpokenScript.phrases.length > 0) {
            const totalChars = textToRead.length;
            const progressRatio = charIndex / Math.max(1, totalChars);
            const calculatedIdx = Math.min(
              jesusSpokenScript.phrases.length - 1,
              Math.floor(progressRatio * jesusSpokenScript.phrases.length)
            );
            setActiveJesusPhraseIndex(calculatedIdx);
          }
        },
        onEnd: () => {
          setIsReading(false);
          setActiveJesusPhraseIndex(0);
        }
      });
    }
  };

  // Play / Stop AI Worship Song (Full Band & Salmista Voice)
  const toggleSongPlayback = () => {
    if (isSongPlaying) {
      worshipSongEngine.stop();
      setIsSongPlaying(false);
    } else {
      DevotionalReader.stop();
      setIsReading(false);
      setIsSongPlaying(true);

      worshipSongEngine.playWorshipSong({
        lyrics: song.fullLyrics,
        withVocals: songMode === 'vocals-and-melody',
        arrangementStyle: arrangementStyle,
        singerStyle: singerVoiceStyle,
        bpm: arrangementStyle === 'acustico-intimo' ? 68 : arrangementStyle === 'pop-worship-gloria' ? 78 : 72,
        onBeat: (beatNumber, sectionName) => {
          setCurrentBeat(beatNumber);
          setCurrentSectionName(sectionName);
        },
        onEnd: () => {
          setIsSongPlaying(false);
        }
      });
    }
  };

  // Toast Helper
  const showToast = (title: string, desc: string) => {
    setActionToast({ title, desc });
    setTimeout(() => setActionToast(null), 4500);
  };

  // 4. ACTION 1: CREATE BLESSING CARD FROM THIS DEVOTIONAL
  const handleCreateCardFromDevotional = () => {
    const cardData: BlessingCard = {
      cardHeader: devotional.devotionalTitle.toUpperCase(),
      blessingQuote: devotional.thoughtOfTheDay || `Que la presencia de Dios llene tu corazón hoy con paz y renuevo.`,
      verseReference: devotional.verseReference,
      verseText: devotional.verseText,
      shortPrayer: devotional.guidedPrayer,
      suggestedRecipient: 'Mi amada familia y hermanos en la fe',
      suggestedOccasion: 'Devocional Diario y Palabra de Bendición',
      suggestedColors: {
        gradientStart: '#020617',
        gradientEnd: '#1e1b4b',
        accentColor: '#fbbf24'
      },
      themeCategory: 'dawn',
      imagePrompt: `A breathtaking celestial golden sunrise representing ${devotional.verseReference}`,
      generatedImageUrl: '/sacred-assets/celestial-sunrise.jpg'
    };

    sessionStorage.setItem('devotional_to_card_transfer', JSON.stringify(cardData));
    showToast('¡Devocional Transferido al Estudio de Tarjetas!', 'Abriendo el diseñador para personalizar tu imagen y descargarla.');
    
    if (onNavigateToCardStudio) {
      onNavigateToCardStudio();
    }
  };

  // 4. ACTION 2: CREATE VIDEO FROM THIS DEVOTIONAL
  const handleCreateVideoFromDevotional = () => {
    const videoScript: FaithScriptData = {
      title: devotional.devotionalTitle,
      hook: `Hijo mío, hoy tengo una palabra de paz y renuevo para tu corazón...`,
      mainTheme: devotional.devotionalTitle,
      primaryBibleVerse: {
        reference: devotional.verseReference,
        text: devotional.verseText
      },
      closingPrayer: devotional.guidedPrayer,
      callToAction: `Escribe 'AMÉN' en los comentarios y comparte esta palabra con alguien que ames.`,
      musicMood: "Piano celestial en 432 Hz con almohadilla de cuerdas solemnes",
      scenes: [
        {
          sceneNumber: 1,
          durationSec: 8,
          visualPrompt: "Jesucristo mirando con amor infinito y misericordia en un amanecer celestial dorado",
          cameraMovement: "Zoom lento hacia el rostro compasivo de Jesús con partículas doradas de gloria",
          narrationText: `Hijo mío... sé lo que ha pasado tu corazón. Hoy quiero recordarte que mis misericordias se renuevan para ti en esta mañana.`,
          onScreenText: `Hijo mío, mis misericordias son nuevas para ti hoy...`,
          atmosphere: "Luz celestial dorada y calma profunda"
        },
        {
          sceneNumber: 2,
          durationSec: 10,
          visualPrompt: "Jesús extendiendo sus manos llagadas de luz y disipando las nubes oscuras de aflicción",
          cameraMovement: "Paneo suave mostrando sus manos extendidas hacia ti con rayos de sanidad",
          narrationText: `Como dice mi Palabra en ${devotional.verseReference}: "${devotional.verseText}". Ninguna tormenta podrá apagar mi fidelidad hacia ti.`,
          onScreenText: `${devotional.verseReference}: "${devotional.verseText}"`,
          atmosphere: "Amanecer glorioso disipando la tempestad"
        },
        {
          sceneNumber: 3,
          durationSec: 12,
          visualPrompt: "Jesús bendiciendo un hogar con rayos dorados de paz y amparo",
          cameraMovement: "Cámara lenta elevándose en reverencia mientras desciende la presencia divina",
          narrationText: `${devotional.reflectionText.slice(0, 160)}... Descansa confiado en mi amparo.`,
          onScreenText: `Descansa confiado: Yo cuido de ti y de los tuyos.`,
          atmosphere: "Santuario de luz cálida y paz celestial"
        },
        {
          sceneNumber: 4,
          durationSec: 10,
          visualPrompt: "Jesucristo de pie en un campo luminoso mirando al cielo con bendición eterna",
          cameraMovement: "Plano solemne con destellos divinos",
          narrationText: `${devotional.guidedPrayer}`,
          onScreenText: `Declara 'Amén' y recibe esta bendición hoy.`,
          atmosphere: "Luz de victoria y gloria eterna"
        }
      ],
      socialMetadata: {
        hashtags: ["#DevocionalDiario", "#JesusTeAma", "#PalabraDeDios", "#FeYEsperanza", "#PromesasDeDios", "#Salmo91"],
        caption: `✨ Devocional del Día: ${devotional.devotionalTitle}\n📖 ${devotional.verseReference}: "${devotional.verseText}"\n🙏 ${devotional.guidedPrayer}\n\nSi recibes esta palabra en tu vida hoy, ¡escribe AMÉN y compártela! 🕊️💖`,
        pinnedComment: `🕊️ Oremos juntos hoy: Deja aquí tu petición de oración y declaremos en el nombre de Jesús que su paz llena tu hogar. Amén.`
      }
    };

    sessionStorage.setItem('devotional_to_video_transfer', JSON.stringify(videoScript));
    showToast('¡Devocional Transferido al Estudio de Video!', 'Abriendo el estudio para simular el reel, reproducir la voz y exportar el video.');

    if (onNavigateToVideoStudio) {
      onNavigateToVideoStudio();
    }
  };

  // Copy helper
  const handleCopyBasic = () => {
    const text = `📖 *DEVOCIONAL DEL DÍA: ${devotional.devotionalTitle}*\n📅 ${devotional.date}\n\n*${devotional.verseReference}*\n"${devotional.verseText}"\n\n*Reflexión:*\n${devotional.reflectionText}\n\n*Oración:*\n"${devotional.guidedPrayer}"\n\n💡 *Pensamiento del Día:* "${devotional.thoughtOfTheDay}"`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 2. COMPUTED HIGH-IMPACT SEO & SOCIAL MEDIA DATA
  const seoData = useMemo(() => {
    const title = devotional.devotionalTitle || 'Devocional Diario de Fe';
    const verseRef = devotional.verseReference || 'Palabra de Dios';
    const verse = devotional.verseText || '';
    const reflection = devotional.reflectionText || '';
    const prayer = devotional.guidedPrayer || '';
    const thought = devotional.thoughtOfTheDay || '';
    const takeaways = devotional.keyTakeaways || [];

    // Instagram / Facebook / TikTok / Threads
    const instagramCaption = `🕊️✨ DEVOCIONAL DEL DÍA ✨🕊️
📖 "${title.toUpperCase()}"
📅 ${devotional.date}

📜 Pasaje Bíblico: ${verseRef}
"${verse}"

🌿 Reflexión para tu Corazón:
${reflection}

✅ 3 Claves Prácticas para Hoy:
${takeaways.map((t, i) => `${i + 1}. ${t}`).join('\n')}

🙏 Oración Guiada de Consagración:
"${prayer}"

💡 Mensaje para Recordar:
"${thought}"

🕊️ Declara esta promesa viva sobre tu vida y tu familia hoy.
✨ Si recibes esta palabra con fe, ¡escribe *AMÉN* 🙏 en los comentarios y compártela con alguien que la necesite! 💖

#DevocionalDiario #PalabraDeDios #VersiculoDelDia #FeEnDios #JesusTeAma #PromesasDeDios #OracionDeLaManana #DiosEsFiel #PazEspiritual #Salmos #CristoVive #Esperanza`;

    // WhatsApp & Telegram Markdown
    const whatsappCaption = `🕊️ *DEVOCIONAL DEL DÍA*
📖 *${title}*
📅 _${devotional.date}_

📜 *${verseRef}*
_«${verse}»_

🌿 *Reflexión:*
${reflection}

🙏 *Oración:*
"${prayer}"

💡 *Pensamiento del Día:*
_${thought}_

🕊️ _¡Que la gracia y la paz del Señor Jesucristo inunden tu día y tu hogar! Comparte esta bendición hoy._ ✨`;

    // SEO Meta Tags for Web / Blogs / YouTube
    const seoTitle = `🕊️ Devocional Diario: ${title.slice(0, 45)} | ${verseRef}`;
    const seoDescription = `Devocional cristiano diario con la promesa de ${verseRef}: "${verse.slice(0, 95)}...". Reflexión, oración y aplicación práctica para tu vida hoy.`;
    const seoKeywords = `devocional cristiano diario, versiculo del dia ${verseRef.toLowerCase()}, palabra de dios hoy, oracion matutina, promesas biblicas, reflexion cristiana, fe en cristo, elvis osorio`;

    const rawHashtags = [
      '#DevocionalDiario',
      '#VersiculoDelDia',
      '#PalabraDeDios',
      '#FeEnDios',
      '#DiosEsFiel',
      '#PromesasDeDios',
      '#JesusTeAma',
      '#OracionMatutina',
      '#PazEspiritual',
      '#CristoVive',
      '#Salmos',
      '#Bendiciones'
    ];

    return {
      instagramCaption,
      whatsappCaption,
      seoTitle,
      seoDescription,
      seoKeywords,
      rawHashtags,
      hashtagsString: rawHashtags.join(' ')
    };
  }, [devotional]);

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
        console.log('Share canceled', e);
      }
    } else {
      handleCopySeo(seoData.whatsappCaption, 'whatsapp-native');
    }
  };

  // Download Lyrics as TXT file
  const handleDownloadLyrics = () => {
    const element = document.createElement("a");
    const file = new Blob([
      `ALABANZA CRISTIANA: ${song.songTitle}\n` +
      `Estilo: ${song.musicalStyle}\n` +
      `Tono y Tempo: ${song.keyAndTempo}\n` +
      `Progresión de Acordes: ${song.chordsProgression}\n` +
      `Mensaje: ${song.spiritualMessage}\n\n` +
      `----------------------------------------\n` +
      `${song.fullLyrics}`
    ], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${song.songTitle.replace(/\s+/g, '_')}_Letra_y_Acordes.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const topicSuggestions = [
    'Paz en la Tormenta',
    'Sanidad y Esperanza',
    'Fe Inquebrantable',
    'Propósito y Dirección',
    'Perdón y Libertad',
    'Bendición Familiar',
    'Gratitud en la Prueba',
    'Provisión Sobrenatural'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-fadeIn">
      
      {/* Toast Notification */}
      {actionToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-900/95 border border-amber-400/40 backdrop-blur-xl shadow-2xl flex items-center gap-3 text-sm text-slate-200 max-w-md animate-slideUp">
          <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h5 className="font-bold text-white text-xs">{actionToast.title}</h5>
            <p className="text-[11px] text-slate-300">{actionToast.desc}</p>
          </div>
        </div>
      )}

      {/* TOP HEADER BAR: Daily Status & Refresh Button */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-bold shadow-[0_0_20px_rgba(245,158,11,0.3)]">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white font-cinzel">
                Devocional Diario & Altar de Fe
              </h2>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Auto-Actualizado Diario</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <Calendar className="w-3 h-3 text-amber-400" />
              <span>{devotional.date}</span>
              <span className="text-slate-600">•</span>
              <Clock className="w-3 h-3 text-slate-500" />
              <span className="text-slate-400">{lastUpdatedTime}</span>
            </p>
          </div>
        </div>

        {/* Action Button: Manual Refresh Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleGenerateDevotional()}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:scale-105 active:scale-95 disabled:opacity-50"
            title="Generar devocional fresco para hoy con IA"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Actualizando...' : 'Actualizar Devocional de Hoy'}</span>
          </button>
        </div>
      </div>

      {/* TWO PRIMARY ACTION BUTTONS: CREATE CARD & CREATE VIDEO */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Button 1: Create Blessing Card */}
        <button
          type="button"
          onClick={handleCreateCardFromDevotional}
          className="group p-5 rounded-3xl bg-gradient-to-br from-amber-950/40 via-slate-900/80 to-slate-900/60 border border-amber-400/30 hover:border-amber-400/60 backdrop-blur-xl shadow-xl transition-all cursor-pointer text-left flex items-center justify-between hover:shadow-[0_0_30px_rgba(245,158,11,0.15)] hover:scale-[1.01] active:scale-[0.99]"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform shadow-md">
              <Palette className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">
                ✨ 1 Clic • Estudio Gráfico
              </span>
              <h3 className="text-sm sm:text-base font-bold text-white font-cinzel">
                Crear Tarjeta con este Devocional
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Diseña, cambia fondos celestial y descarga en JPG para compartir
              </p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-amber-400 group-hover:text-slate-950 text-slate-400 flex items-center justify-center transition-colors">
            <ChevronRight className="w-4 h-4" />
          </div>
        </button>

        {/* Button 2: Create Video / Reel */}
        <button
          type="button"
          onClick={handleCreateVideoFromDevotional}
          className="group p-5 rounded-3xl bg-gradient-to-br from-blue-950/40 via-slate-900/80 to-slate-900/60 border border-blue-400/30 hover:border-blue-400/60 backdrop-blur-xl shadow-xl transition-all cursor-pointer text-left flex items-center justify-between hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] hover:scale-[1.01] active:scale-[0.99]"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-400/20 border border-blue-400/40 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform shadow-md">
              <Film className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider block">
                🎬 1 Clic • Estudio Cinematográfico
              </span>
              <h3 className="text-sm sm:text-base font-bold text-white font-cinzel">
                Crear Video con este Devocional
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Genera el Reel 9:16 con voz de Jesús, escenas 3D y exporta el video
              </p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-blue-400 group-hover:text-slate-950 text-slate-400 flex items-center justify-center transition-colors">
            <ChevronRight className="w-4 h-4" />
          </div>
        </button>

      </div>

      {/* 2-Column Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 8-Cols: Devotional Hero, Reflection, Church Voice & AI Christian Song Studio */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Immersive Signature Hero Verse Card */}
          <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/40 border border-white/5 backdrop-blur-xl shadow-2xl relative overflow-hidden space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest text-amber-500/80 font-bold">
                Palabra de Dios para Hoy • {devotional.date}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyBasic}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 transition-colors cursor-pointer"
                  title="Copiar versículo y devocional"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-light leading-tight text-white font-cinzel">
              "{devotional.verseText}"
            </h1>

            <div className="flex items-center justify-between flex-wrap gap-2">
              <p className="text-amber-400 font-serif italic text-lg sm:text-xl">
                {devotional.verseReference}
              </p>
              {devotional.biblicalContext && (
                <span className="text-xs text-slate-400 bg-white/5 px-3 py-1 rounded-xl border border-white/5">
                  📜 {devotional.biblicalContext}
                </span>
              )}
            </div>

            {/* AUDIO LOCUTION: JESUS SOLEMN & ENGAGING VOICE WITH TELEPROMPTER & 432 Hz PAD */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-amber-950/30 via-slate-950/80 to-slate-950/90 border border-amber-500/30 backdrop-blur-md space-y-4 shadow-lg">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-400/20 text-amber-300 flex items-center justify-center shadow-md border border-amber-400/30">
                    <Volume2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2 font-cinzel">
                      <span>Locución con la Voz de Jesús</span>
                      {isReading && (
                        <span className="flex items-center gap-1 text-[10px] text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-full border border-amber-400/30 animate-pulse">
                          <Activity className="w-3 h-3 text-amber-400" />
                          Hablando en vivo...
                        </span>
                      )}
                    </h4>
                    <p className="text-[11px] text-slate-300">
                      Discurso coherente, claro y paternal que toca el alma, con pad de santuario 432 Hz
                    </p>
                  </div>
                </div>

                {/* Voice Mode Selector */}
                <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-white/10 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setVoiceMode('jesus')}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      voiceMode === 'jesus'
                        ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Voz de Jesús
                  </button>
                  <button
                    type="button"
                    onClick={() => setVoiceMode('church')}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      voiceMode === 'church'
                        ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Solemne Santuario
                  </button>
                  <button
                    type="button"
                    onClick={() => setVoiceMode('peace')}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      voiceMode === 'peace'
                        ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Paz Profunda
                  </button>
                </div>
              </div>

              {/* Jesus Engaging Spoken Monologue Teleprompter */}
              {showJesusTeleprompter && (
                <div className="p-4 rounded-xl bg-slate-900/90 border border-amber-400/20 space-y-2 max-h-48 overflow-y-auto">
                  <div className="flex items-center justify-between text-[11px] text-amber-300/80 font-cinzel">
                    <span className="flex items-center gap-1">
                      <Mic className="w-3 h-3 text-amber-400" />
                      Discurso de Jesús para tu Corazón
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(jesusSpokenScript.fullScript);
                        showToast('¡Discurso de Jesús Copiado!', 'El texto del discurso ha sido copiado al portapapeles.');
                      }}
                      className="hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-[10px]"
                    >
                      <Copy className="w-3 h-3" />
                      Copiar Discurso
                    </button>
                  </div>
                  
                  <div className="space-y-2 text-xs leading-relaxed">
                    {jesusSpokenScript.phrases.map((phrase, idx) => (
                      <p
                        key={idx}
                        className={`p-2 rounded-lg transition-all ${
                          isReading && activeJesusPhraseIndex === idx
                            ? 'bg-amber-400/20 text-amber-200 font-semibold border-l-2 border-amber-400 shadow-sm scale-[1.01]'
                            : 'text-slate-300'
                        }`}
                      >
                        {phrase}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Audio Controls Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <button
                  type="button"
                  onClick={toggleVoice}
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-slate-950 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(251,191,36,0.3)] cursor-pointer text-xs active:scale-95"
                >
                  {isReading ? (
                    <>
                      <Pause className="w-4 h-4 text-slate-950 animate-pulse" />
                      <span>Pausar Locución de Jesús</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 text-slate-950 fill-current" />
                      <span>Escuchar Voz de Jesús & Santuario</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer text-[11px] text-slate-300 hover:text-white">
                    <input
                      type="checkbox"
                      checked={withChurchAmbience}
                      onChange={(e) => setWithChurchAmbience(e.target.checked)}
                      className="rounded bg-slate-800 border-white/10 text-amber-400 focus:ring-0 cursor-pointer"
                    />
                    <span>🏛️ Pad Armónico 432 Hz</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => setShowJesusTeleprompter(!showJesusTeleprompter)}
                    className="text-[11px] text-amber-300/80 hover:text-amber-200 underline cursor-pointer"
                  >
                    {showJesusTeleprompter ? 'Ocultar Texto' : 'Ver Teleprompter'}
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* Devotional Reflection Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 border border-white/5 backdrop-blur-xl shadow-xl space-y-5">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-cinzel">
                Reflexión para el Corazón
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-cinzel mt-1">
                {devotional.devotionalTitle}
              </h2>
            </div>

            <p className="text-sm sm:text-base text-slate-200 font-sans leading-relaxed whitespace-pre-line">
              {devotional.reflectionText}
            </p>

            {/* 3 Practical Takeaways */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 font-cinzel">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Aplicación Práctica para tu Día
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {devotional.keyTakeaways.map((point, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md space-y-2 hover:bg-white/10 transition-all"
                  >
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      {point}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Guided Prayer */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md space-y-2">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 font-cinzel">
                <Heart className="w-3.5 h-3.5 text-amber-400" />
                Oración de Consagración
              </h4>
              <p className="text-xs sm:text-sm text-slate-200 font-sans italic leading-relaxed">
                "{devotional.guidedPrayer}"
              </p>
            </div>

            {/* Thought of the Day Badge */}
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
              <p className="text-xs text-amber-200 font-medium">
                💡 <strong className="text-amber-300">Pensamiento del Día:</strong> "{devotional.thoughtOfTheDay}"
              </p>
            </div>

          </div>

          {/* 3. NEW FEATURE: AI CHRISTIAN SONG & REAL WORSHIP BAND (Ritmo de Adoración Contemporánea con Banda & Salmista) */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-purple-950/40 via-slate-900/80 to-slate-900/50 border border-purple-500/30 backdrop-blur-xl shadow-xl space-y-6">
            
            {/* Song Header & Persistent Singer Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 text-purple-300 flex items-center justify-center shadow-lg">
                  <Music className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-white font-cinzel">
                      Canción de Adoración & Banda Real en Vivo
                    </h3>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      🥁 Batería • 🎸 Bajo • 🎹 Piano
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Ritmo y producción de Pop Worship / Balada de Adoración inspirada en {devotional.verseReference}
                  </p>
                </div>
              </div>

              {/* Regenerate Song Button */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => generateInspiredSong()}
                  disabled={isGeneratingSong}
                  className="px-3.5 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-500/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                  title="Componer otra alabanza inspirada"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isGeneratingSong ? 'animate-spin' : ''}`} />
                  <span>{isGeneratingSong ? 'Componiendo...' : 'Nueva Canción IA'}</span>
                </button>
              </div>
            </div>

            {/* DEDICATED WORSHIP SINGER CARD (SALMISTA DAVID / CANTANTE FIJO DE ADORACIÓN) */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-amber-500 p-0.5 shadow-md flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-amber-300 text-xs font-bold font-cinzel">
                    🎤 Salmista
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h5 className="text-xs font-bold text-white">
                      Salmista Principal (Cantante de Adoración)
                    </h5>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                      Voz Fija de la Sección
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Voz cálida de adorador latino contemporáneo con cadencia poética y vibrato sagrado
                  </p>
                </div>
              </div>

              {/* Singer Vocal Style Selector */}
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-white/5 text-[10px]">
                <button
                  type="button"
                  onClick={() => setSingerVoiceStyle('salmista-principal')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    singerVoiceStyle === 'salmista-principal'
                      ? 'bg-purple-500 text-white font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Salmista Principal
                </button>
                <button
                  type="button"
                  onClick={() => setSingerVoiceStyle('adoracion-intima')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    singerVoiceStyle === 'adoracion-intima'
                      ? 'bg-purple-500 text-white font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Adoración Íntima
                </button>
                <button
                  type="button"
                  onClick={() => setSingerVoiceStyle('clamor-gloria')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    singerVoiceStyle === 'clamor-gloria'
                      ? 'bg-purple-500 text-white font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Clamor de Gloria
                </button>
              </div>
            </div>

            {/* REAL-TIME BAND RHYTHM METERS & CONTROLS */}
            <div className="p-5 rounded-2xl bg-slate-950/90 border border-purple-500/20 space-y-4">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-base font-bold text-amber-300 font-cinzel">
                    "{song.songTitle}"
                  </h4>
                  <p className="text-xs text-purple-200/90 font-medium mt-0.5">
                    🎻 {song.musicalStyle}
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                    🎹 Tono: {song.keyAndTempo} • Acordes: {song.chordsProgression}
                  </p>
                </div>

                {/* Synthesis Playback Button */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-white/10 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setSongMode('vocals-and-melody')}
                      className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                        songMode === 'vocals-and-melody'
                          ? 'bg-purple-500 text-white font-bold shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      🎤 Cantante + Banda
                    </button>
                    <button
                      type="button"
                      onClick={() => setSongMode('melody-only')}
                      className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                        songMode === 'melody-only'
                          ? 'bg-purple-500 text-white font-bold shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      🎼 Instrumental
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={toggleSongPlayback}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 hover:from-purple-400 hover:to-indigo-400 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:scale-105 active:scale-95"
                  >
                    {isSongPlaying ? (
                      <>
                        <Pause className="w-4 h-4 text-white animate-pulse" />
                        <span>Pausar Alabanza</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 text-white fill-current" />
                        <span>Reproducir con Banda & Salmista</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* RHYTHM BEAT & SECTION TRACKER (Visual Band Active States) */}
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-slate-300 font-bold font-cinzel">Sección Actual:</span>
                    <span className="text-amber-400 font-bold bg-amber-400/10 px-2.5 py-0.5 rounded-md border border-amber-400/20">
                      {isSongPlaying ? currentSectionName : 'Lista para iniciar'}
                    </span>
                  </div>

                  {/* 4/4 Beat Indicator */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-400 font-mono">Compás 4/4:</span>
                    {[1, 2, 3, 4].map(b => (
                      <span
                        key={b}
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold font-mono transition-all ${
                          isSongPlaying && currentBeat === b
                            ? 'bg-amber-400 text-slate-950 scale-110 shadow-[0_0_10px_rgba(251,191,36,0.5)]'
                            : 'bg-white/5 text-slate-400'
                        }`}
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Instruments Activity Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  <div className={`p-2 rounded-lg border text-center transition-all ${isSongPlaying ? 'bg-purple-500/15 border-purple-500/30 text-purple-200' : 'bg-white/5 border-white/5 text-slate-500'}`}>
                    <span className="text-[11px] font-bold block">🥁 Batería Acústica</span>
                    <span className="text-[9px] text-slate-400">Kick & Snare Rim</span>
                  </div>
                  <div className={`p-2 rounded-lg border text-center transition-all ${isSongPlaying ? 'bg-amber-500/15 border-amber-500/30 text-amber-200' : 'bg-white/5 border-white/5 text-slate-500'}`}>
                    <span className="text-[11px] font-bold block">🎸 Bajo de Adoración</span>
                    <span className="text-[9px] text-slate-400">Raíz & Sub-bajo</span>
                  </div>
                  <div className={`p-2 rounded-lg border text-center transition-all ${isSongPlaying ? 'bg-blue-500/15 border-blue-500/30 text-blue-200' : 'bg-white/5 border-white/5 text-slate-500'}`}>
                    <span className="text-[11px] font-bold block">🎹 Piano & Guitarra</span>
                    <span className="text-[9px] text-slate-400">Arpegios Sol Mayor</span>
                  </div>
                  <div className={`p-2 rounded-lg border text-center transition-all ${isSongPlaying ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-200' : 'bg-white/5 border-white/5 text-slate-500'}`}>
                    <span className="text-[11px] font-bold block">🎻 Cuerdas 432 Hz</span>
                    <span className="text-[9px] text-slate-400">Atmósfera de Gloria</span>
                  </div>
                </div>
              </div>

              {/* Structured Lyrics Sections Cards */}
              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {song.sections.map((sec, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isSongPlaying && currentSectionName.toLowerCase().includes(sec.section.toLowerCase().slice(0, 4))
                        ? 'bg-purple-950/70 border-purple-400 shadow-md scale-[1.01]'
                        : 'bg-slate-900/90 border-white/5 hover:border-purple-500/30'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold text-purple-300 font-cinzel">
                      <span>[{sec.section}]</span>
                      {sec.chordsHint && (
                        <span className="text-[10px] text-amber-400/90 font-mono bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
                          {sec.chordsHint}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line font-sans mt-1">
                      {sec.lyrics}
                    </p>
                  </div>
                ))}
              </div>

              {/* Actions: Copy & Download Lyrics */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5">
                <span className="text-[11px] text-slate-400 italic">
                  "{song.spiritualMessage}"
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(song.fullLyrics);
                      showToast('¡Letra Copiada!', 'La letra completa de la alabanza ha sido copiada al portapapeles.');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Letra</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadLyrics}
                    className="px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Descargar TXT</span>
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* 2. NEW FEATURE: COMPLETE SEO & SOCIAL MEDIA COPYWRITING MODULE */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-950/70 border border-amber-500/20 backdrop-blur-xl shadow-xl space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-sm">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2 font-cinzel">
                    <span>SEO & Copywriting para Redes Sociales</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      ⚡ Listo para Publicar
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Textos de alto impacto optimizados para Instagram, WhatsApp, TikTok, Facebook y blogs
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                  title="Abrir directo en WhatsApp"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={handleNativeShare}
                  className="px-3 py-1.5 rounded-xl bg-amber-400/15 hover:bg-amber-400/25 text-amber-300 border border-amber-400/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                  title="Compartir en cualquier red"
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
                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-white/10 text-xs text-slate-200 font-sans leading-relaxed whitespace-pre-line max-h-56 overflow-y-auto select-all shadow-inner">
                  {seoData.instagramCaption}
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <span className="text-[11px] text-slate-400">
                    Incluye versículo, reflexión, 3 claves, oración, llamada a comentar "AMÉN" y hashtags.
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
                <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/20 text-xs text-emerald-100 font-sans leading-relaxed whitespace-pre-line max-h-56 overflow-y-auto select-all shadow-inner font-mono">
                  {seoData.whatsappCaption}
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <span className="text-[11px] text-emerald-300/80">
                    Formateado con negritas <code className="text-white bg-white/10 px-1 rounded">*texto*</code> y cursivas para chats.
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
                    Hashtags bíblicos de alto tráfico para maximizar alcance y bendición.
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

          {/* Topic Generator Bar */}
          <div className="p-6 rounded-3xl bg-slate-900/40 border border-white/5 backdrop-blur-xl shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2 font-cinzel">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Explorar Devocionales por Tema Específico
              </h3>
              <span className="text-xs text-slate-500">Gemini AI Studio</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {topicSuggestions.map((t) => (
                <button
                  key={t}
                  onClick={() => handleGenerateDevotional(t)}
                  disabled={isLoading}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-medium bg-white/5 hover:bg-amber-400/20 text-slate-300 hover:text-amber-200 border border-white/5 hover:border-amber-400/40 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <span>🌿</span>
                  <span>{t}</span>
                </button>
              ))}
            </div>

            <div className="flex gap-2 pt-1">
              <input
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder="O escribe un tema personalizado (ej: gratitud en la prueba, sanidad, perdón)..."
                className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-950/60 border border-white/10 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400"
              />
              <button
                onClick={() => handleGenerateDevotional()}
                disabled={isLoading}
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
              >
                {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>Generar</span>
              </button>
            </div>
          </div>

        </div>

        {/* Right 4-Cols: Spiritual Community Panel */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Testimonial & Community Card */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl shadow-2xl space-y-6">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3 font-cinzel">
                Testimonio de Fe Reciente
              </h4>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-xs italic text-slate-300 leading-relaxed">
                "Dios abrió puertas donde no las había. El devocional de esta mañana me devolvió la paz en el momento exacto que lo necesitaba."
                <p className="mt-2 text-[10px] text-slate-500 non-italic font-semibold">
                  — María G. • Miembro de la Comunidad
                </p>
              </div>
            </div>

            {/* Quick Action Badges */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center space-y-1">
                <span className="text-base">🕯️</span>
                <p className="text-[11px] font-medium text-slate-200">128 Velas</p>
                <span className="text-[10px] text-slate-500 block">Encendidas</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center space-y-1">
                <span className="text-base">📖</span>
                <p className="text-[11px] font-medium text-slate-200">66 Libros</p>
                <span className="text-[10px] text-slate-500 block">Escrituras</span>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
