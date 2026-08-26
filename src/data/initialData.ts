import { FaithScriptData, PrayerData, PrayerCandle, DailyDevotional, BlessingCard } from '../types';

export const INITIAL_SCRIPT_DATA: FaithScriptData = {
  title: "Cuando Sientas Que No Puedes Más | La Promesa de Isaías",
  hook: "¿Sientes que tus fuerzas se han agotado hoy? Detente 30 segundos, esto es para ti.",
  mainTheme: "Renovación sobrenatural de fuerzas y confianza inquebrantable en Dios",
  primaryBibleVerse: {
    reference: "Isaías 40:29-31",
    text: "Él da esfuerzo al cansado, y multiplica las fuerzas al que no tiene ningunas. Los que esperan a Jehová tendrán nuevas fuerzas; levantarán alas como las águilas."
  },
  closingPrayer: "Señor, hoy deposito en tus manos mi fatiga. Recibo tu paz que sobrepasa todo entendimiento y declaro que me levantaré con nuevas alas. Amén.",
  callToAction: "Escribe 'AMÉN' si recibes estas fuerzas hoy y compártelo con quien necesite aliento.",
  musicMood: "Piano celestial cálido a 60 BPM con suaves cuerdas orquestales",
  scenes: [
    {
      sceneNumber: 1,
      durationSec: 8,
      visualPrompt: "Close-up cinematográfico de una persona en silueta frente a una ventana al amanecer, rayos de luz dorada penetrando suavemente en la habitación.",
      cameraMovement: "Zoom in lento y fluido hacia la luz del sol",
      narrationText: "A veces el camino se vuelve tan pesado que parece imposible dar un paso más... [pausa]",
      onScreenText: "CUANDO TUS FUERZAS SE AGOTAN",
      atmosphere: "Luz dorada crepuscular con partículas de polvo flotando en paz"
    },
    {
      sceneNumber: 2,
      durationSec: 12,
      visualPrompt: "Vista panorámica de montañas majestuosas envueltas en niebla luminosa matutina, con un águila remontando el vuelo con gracia sobre las nubes.",
      cameraMovement: "Paneo aéreo majestuoso siguiendo la trayectoria del vuelo hacia el cielo abierto",
      narrationText: "Pero la Biblia dice: Él da esfuerzo al cansado y multiplica las fuerzas al que no tiene ningunas. No estás solo en esta batalla.",
      onScreenText: "ÉL MULTIPLICA TUS FUERZAS",
      atmosphere: "Cielo azul sereno y destellos celestiales"
    },
    {
      sceneNumber: 3,
      durationSec: 14,
      visualPrompt: "Manos unidas en oración suave sobre una mesa rústica, iluminadas por la llama cálida y titilante de una vela encendida.",
      cameraMovement: "Movimiento orbital lento con desenfoque de fondo bokeh dorado",
      narrationText: "Hoy Dios te dice: Descansa en mí. Mis brazos te sostienen y mis planes para ti siguen en pie. Respira su paz.",
      onScreenText: "DESCANSAR EN DIOS",
      atmosphere: "Calidez hogareña y presencia santa"
    },
    {
      sceneNumber: 4,
      durationSec: 11,
      visualPrompt: "Texto bíblico resplandeciente en tipografía dorada elegante sobre un fondo de cielo estrellado y amanecer brillante.",
      cameraMovement: "Cámara fija con leve respiración y destello de luz central",
      narrationText: "Declara conmigo: 'Dios es mi fortaleza'. Escribe Amén y comparte este mensaje de esperanza.",
      onScreenText: "ESCRIBE AMÉN • COMPARTE ESPERANZA",
      atmosphere: "Victoria y adoración"
    }
  ],
  socialMetadata: {
    hashtags: ["#OracionDeLaNoche", "#DiosEsFiel", "#FeCristiana", "#VersiculoDelDia", "#PazDeDios", "#MotivacionEspiritual", "#JesusTeAma"],
    caption: "🕊️ Si hoy te sientes sin fuerzas, recuerda que Dios no se cansa ni se fatiga. Tómate este minuto de oración y permite que Él renueve tu espíritu. 💬 Deja tu 'Amén' en los comentarios y bendice a alguien hoy compartiendo este video.",
    pinnedComment: "🙏 ¿Por qué motivo te gustaría que oremos juntos hoy? Deja tu petición aquí abajo y nos uniremos en fe por ti."
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
    suggestedColors: {
      gradientStart: "#0c1f2c",
      gradientEnd: "#164e63",
      accentColor: "#38bdf8"
    }
  }
];
