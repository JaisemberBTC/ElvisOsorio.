import { FaithScriptData, PrayerData, PrayerCandle, DailyDevotional, BlessingCard } from '../types';

export const INITIAL_SCRIPT_DATA: FaithScriptData = {
  title: "Hijo Mío, Ya No Llores Más | Jesús Te Habla al Corazón",
  hook: "Hijo mío, si este video apareció en tu pantalla hoy, detén tu prisa... Necesitaba hablarte.",
  mainTheme: "Jesucristo consolando tu corazón, secando tus lágrimas y renovando tus fuerzas",
  primaryBibleVerse: {
    reference: "Mateo 11:28",
    text: "Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar."
  },
  closingPrayer: "Jesús amado, tomo tu mano en este momento. Entrego mi cansancio, mis lágrimas y mis temores a tus pies. Recibo tu descanso sobrenatural y tu paz inagotable. Amén.",
  callToAction: "Declara 'Amén Jesús, tomo tu mano' en los comentarios, guarda esta bendición y compártela con quien amas.",
  musicMood: "Piano celestial en 432Hz con cuerdas suaves y atmósfera de paz divina a 56 BPM",
  scenes: [
    {
      sceneNumber: 1,
      durationSec: 8,
      visualPrompt: "Jesucristo resplandeciente con túnica blanca y luz dorada mirando a la cámara con infinita compasión y ternura paternal.",
      cameraMovement: "Cámara lenta acercándose al rostro amoroso y luminoso de Jesús",
      narrationText: "Hijo mío... sé cuántas veces has sonreído de día mientras en silencio tu corazón lloraba de noche. [pausa]",
      onScreenText: "HE VISTO TUS LÁGRIMAS EN SILENCIO",
      atmosphere: "Luz celestial dorada y resplandor sagrado"
    },
    {
      sceneNumber: 2,
      durationSec: 10,
      visualPrompt: "Jesús extendiendo sus manos llagadas de amor y bendición hacia ti, emanando rayos de luz de sanidad y paz.",
      cameraMovement: "Paneo suave mostrando las manos protectoras de Cristo",
      narrationText: "Hoy quiero que escuches mi voz: Yo no me he olvidado de ti. Cada lágrima tuya la guardé y cada oración la escuché.",
      onScreenText: "YO NO ME HE OLVIDADO DE TI",
      atmosphere: "Aura celestial y partículas de bendición"
    },
    {
      sceneNumber: 3,
      durationSec: 11,
      visualPrompt: "Jesús calmando la tormenta en el mar, el cielo oscuro se abre en un amanecer de gloria y luz viva.",
      cameraMovement: "Apertura cinematográfica de luz celestial sobre el agua serena",
      narrationText: "Ven a mí si estás cansado. Yo calmo tus vientos, yo quito tu angustia y multiplico tus fuerzas.",
      onScreenText: "YO CALMO TU TORMENTA HOY",
      atmosphere: "Paz sobrenatural y gloria divina"
    },
    {
      sceneNumber: 4,
      durationSec: 11,
      visualPrompt: "Jesucristo abrazando con amor infinito, coronado de luz y gloria celestial, mirándote con bendición eterna.",
      cameraMovement: "Cámara lenta con resplandor dorado y destellos de victoria",
      narrationText: "Recibe mi paz esta noche. Levántate con fe, porque grandes cosas haré en tu vida. Te amo con amor eterno.",
      onScreenText: "DECLARA 'AMÉN JESÚS' • RECIBE TU PAZ",
      atmosphere: "Gloria, amor incondicional y victoria"
    }
  ],
  socialMetadata: {
    hashtags: ["#JesusTeHabla", "#OracionDeFe", "#PazDeDios", "#JesusTeAma", "#DevocionalCristiano", "#FeEnDios", "#ShortsDeFe"],
    caption: "🕊️ Jesús tiene un mensaje especial para tu corazón hoy: 'Hijo mío, no temas, yo estoy contigo'. Si recibes esta palabra de consuelo, escribe tu 'Amén' y compártelo con alguien que necesite sentir el abrazo de Dios hoy.",
    pinnedComment: "❤️ Escribe aquí tu petición o declara 'Gracias Jesús por tu paz' para orar juntos por tu vida y tu familia."
  }
};

export const INITIAL_PRAYER_DATA: PrayerData = {
  title: "Oración de Paz Profunda y Restauración del Alma",
  scriptureAnchor: {
    verse: "Filipenses 4:6-7",
    text: "Por nada estéis afanosos, sino sean conocidas vuestras peticiones delante de Dios en toda oración y ruego, con acción de gracias. Y la paz de Dios, que sobrepasa todo entendimiento, guardará vuestros corazones y vuestros pensamientos en Cristo Jesús.",
    application: "Nos recuerda que la paz no es la ausencia de problemas, sino la presencia viva de Dios en medio de cualquier circunstancia."
  },
  prayerBody: {
    invocation: "Padre Celestial, Dios de amor y de toda consolación, en este momento aquieto mi mente y mi corazón en tu santa presencia.",
    surrender: "Te entrego cada preocupación que me roba el sueño, cada dolor que pesa en mi pecho y cada incertidumbre sobre el futuro. Reconozco que mis fuerzas son limitadas, pero tu poder es infinito.",
    proclamation: "Declaro que tu paz sobrenatural inunda ahora mismo cada rincón de mi hogar, mi mente y mi espíritu. Ninguna tormenta puede apagar la luz de tu amor. Decreto sanidad en mi cuerpo, armonía en mi familia y provisión abundante para cada necesidad.",
    gratitudeAndAmen: "Gracias por escuchar mi voz aun en el silencio de mi corazón. Confío plenamente en tus promesas eternas. En el poderoso nombre de Jesús, ¡Amén!"
  },
  fullText: "Padre Celestial, Dios de amor y de toda consolación, en este momento aquieto mi mente y mi corazón en tu santa presencia. Te entrego cada preocupación que me roba el sueño, cada dolor que pesa en mi pecho y cada incertidumbre sobre el futuro. Reconozco que mis fuerzas son limitadas, pero tu poder es infinito. Declaro que tu paz sobrenatural inunda ahora mismo cada rincón de mi hogar, mi mente y mi espíritu. Ninguna tormenta puede apagar la luz de tu amor. Decreto sanidad en mi cuerpo, armonía en mi familia y provisión abundante para cada necesidad. Gracias por escuchar mi voz aun en el silencio de mi corazón. Confío plenamente en tus promesas eternas. En el poderoso nombre de Jesús, ¡Amén!",
  dailyAffirmation: "Hoy decido soltar el control y descansar en la perfecta fidelidad de Dios. Mi corazón está en paz.",
  meditationPrompt: "Cierra tus ojos durante 1 minuto, inhala profundamente la gracia de Dios y exhala toda tensión repitiendo: 'El Señor es mi pastor, nada me faltará'."
};

export const INITIAL_CANDLES: PrayerCandle[] = [
  {
    id: 'c-1',
    personName: 'Familia Ramírez',
    intention: 'Por la sanidad completa de mi abuela Carmen y paz en nuestro hogar durante este tratamiento.',
    category: 'sanidad',
    litAt: 'Hace 15 min',
    amenCount: 42,
    userAmened: false
  },
  {
    id: 'c-2',
    personName: 'Mateo & Sofía',
    intention: 'Por dirección divina en un nuevo emprendimiento y sabiduría para bendecir a otros.',
    category: 'finanzas',
    litAt: 'Hace 45 min',
    amenCount: 28,
    userAmened: true
  },
  {
    id: 'c-3',
    personName: 'Lucía M.',
    intention: 'Por restauración y perdón en mi matrimonio, para que el amor de Dios sea el centro.',
    category: 'matrimonio',
    litAt: 'Hace 2 horas',
    amenCount: 65,
    userAmened: false
  },
  {
    id: 'c-4',
    personName: 'David H.',
    intention: 'Oración por liberación de la ansiedad y fortaleza para mis hijos en sus estudios.',
    category: 'familia',
    litAt: 'Hace 3 horas',
    amenCount: 89,
    userAmened: false
  },
  {
    id: 'c-5',
    personName: 'Hermana Gloria',
    intention: 'Acción de gracias por la provisión de Dios y oración por los enfermos en los hospitales.',
    category: 'general',
    litAt: 'Hace 5 horas',
    amenCount: 114,
    userAmened: false
  }
];

export const INITIAL_DEVOTIONAL: DailyDevotional = {
  date: new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
  devotionalTitle: "El Refugio Seguro en Medio de la Incertidumbre",
  verseReference: "Salmos 91:1-2",
  verseText: "El que habita al abrigo del Altísimo morará bajo la sombra del Omnipotente. Diré yo a Jehová: Esperanza mía, y castillo mío; mi Dios, en quien confiaré.",
  biblicalContext: "El Salmo 91 fue compuesto como un cántico de máxima seguridad para el pueblo de Israel en tiempos de peligro, plagas y batallas, enfatizando la protección personal que Dios brinda a quien decide permanecer cerca de Él.",
  reflectionText: "Habitar en el abrigo de Dios no es una visita dominical ocasional; es hacer de la presencia del Padre nuestro hogar cotidiano. Cuando las noticias del mundo amenazan con desestabilizar nuestras emociones, la sombra del Omnipotente se extiende como un escudo protector. Su sombra es tan grande que ningún enemigo puede franquearla. Confiar significa entregar la ansiedad de mañana para disfrutar de la gracia provista para hoy.",
  keyTakeaways: [
    "Haz de la oración tu primera respuesta ante la preocupación, no tu último recurso.",
    "Declara con tu boca las promesas bíblicas antes de dejar que los pensamientos negativos ganen terreno.",
    "Extiende la paz que recibes hoy brindando una palabra de aliento a alguien a tu alrededor."
  ],
  guidedPrayer: "Amado Señor, gracias porque nunca me dejas desamparado. Hoy elijo entrar en tu presencia y descansar bajo tus alas protectoras. Lléname de valentía, renueva mi gozo y guíame en cada decisión de este día. Amén.",
  thoughtOfTheDay: "La distancia entre tu problema y la solución es tan corta como la distancia de tus rodillas al suelo."
};

export const SCRIPT_TEMPLATES = [
  {
    id: 'noche-paz-dormir',
    title: '🌙 Si Viste Esto Antes de Dormir (Viral 3s)',
    topic: 'Oración de la noche para soltar toda angustia, insomnio y recibir paz sobrenatural antes de dormir',
    format: 'Reel / TikTok 9:16 (45-60s)',
    tone: 'Íntimo, sereno y oracional para la noche'
  },
  {
    id: 'salmo-91-cadenas',
    title: '🛡️ Salmo 91: Rompe Cadenas y Protección',
    topic: 'Declaración poderosa de protección del Salmo 91 contra todo temor, peligro y enfermedad en el hogar',
    format: 'YouTube Shorts 9:16 (30-45s)',
    tone: 'Con autoridad espiritual y fe inquebrantable'
  },
  {
    id: '3-cosas-dios-dice',
    title: '⚡ 3 Cosas que Dios te Dice Hoy (#3 Impactante)',
    topic: '3 promesas urgentes y directas al corazón para quien siente que sus fuerzas se terminaron hoy',
    format: 'Reel / TikTok 9:16 (45-60s)',
    tone: 'Inspirador, reconfortante y lleno de fe'
  },
  {
    id: 'sanidad-milagrosa',
    title: '🕊️ Decreto de Sanidad y Quiebre de Dolor',
    topic: 'Oración por sanidad física, milagro en el cuerpo y consuelo emocional en el nombre de Jesús',
    format: 'Shorts 9:16 (55s)',
    tone: 'Con autoridad espiritual, fe y amor'
  },
  {
    id: 'apertura-puertas',
    title: '🚪 Dios Abre Puertas Donde No las Hay',
    topic: 'Mensaje de fe para abrir caminos en finanzas, trabajo y bendición familiar imposible',
    format: 'YouTube Video 16:9 (60-90s)',
    tone: 'Inspirador, motivador y lleno de gozo'
  },
  {
    id: 'bendicion-hijos',
    title: '👨‍👩‍👧‍👦 Manto de Bendición Sobre Tus Hijos',
    topic: 'Oración de cobertura y bendición para proteger a los hijos en todo lugar',
    format: 'Reel 9:16 (50s)',
    tone: 'Cálido, protector y familiar'
  }
];

export const BLESSING_TEMPLATES: BlessingCard[] = [
  {
    cardHeader: "BENDICIÓN DE LA MAÑANA",
    blessingQuote: "Que la luz del rostro de Dios brille sobre ti y llene tu jornada de paz, salud y bendiciones inesperadas.",
    verseReference: "Números 6:24-26",
    verseText: "Jehová te bendiga, y te guarde; Jehová haga resplandecer su rostro sobre ti, y tenga de ti misericordia.",
    shortPrayer: "Señor, bendice cada paso que dé hoy y guárdame de todo mal.",
    themeCategory: "dawn",
    imagePrompt: "Amanecer celestial dorado con rayos de gloria sobre un lago sereno",
    suggestedColors: {
      gradientStart: "#1c1917",
      gradientEnd: "#292524",
      accentColor: "#f59e0b"
    }
  },
  {
    cardHeader: "PROMESA DE ESPERANZA",
    blessingQuote: "No temas lo que viene, porque Aquel que prometió estar contigo todos los días es fiel para cumplirlo.",
    verseReference: "Josué 1:9",
    verseText: "Mira que te mando que te esfuerces y seas valiente; no temas ni desmayes, porque Jehová tu Dios estará contigo.",
    shortPrayer: "Padre, en ti pongo mi confianza inamovible hoy.",
    themeCategory: "peace",
    imagePrompt: "Jesús trayendo calma y paz sobre las aguas en la tormenta",
    suggestedColors: {
      gradientStart: "#0c1f2c",
      gradientEnd: "#164e63",
      accentColor: "#38bdf8"
    }
  }
];
