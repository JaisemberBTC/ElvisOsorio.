import { FaithScriptData, PrayerData, PrayerCandle, DailyDevotional, BlessingCard, InnovativeHookItem } from '../types';

export const INITIAL_SCRIPT_DATA: FaithScriptData = {
  title: "Nadie Vio Tus Lágrimas Anoche... Pero Jesús Estuvo Ahí",
  hook: "Detén un segundo tus pensamientos... Nadie vio la lágrima que cayó en tu almohada anoche, pero Jesús estaba a tu lado sosteniendo tu corazón.",
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
      durationSec: 10,
      visualPrompt: "Primer plano cinematográfico de Jesús con túnica blanca resplandeciente y luz celestial dorada, mirando a la cámara con infinita compasión y extendiendo suavemente su mano en señal de bienvenida.",
      cameraMovement: "Cámara lenta acercándose suavemente al rostro amoroso y luminoso de Jesús",
      narrationText: "Hijo mío... sé cuántas veces has sonreído de día mientras en silencio tu corazón lloraba en la noche. No temas, porque Yo estoy contigo.",
      onScreenText: "HE VISTO TUS LÁGRIMAS EN SILENCIO",
      atmosphere: "Luz celestial dorada y resplandor sagrado"
    },
    {
      sceneNumber: 2,
      durationSec: 10,
      visualPrompt: "Jesús en plano medio extendiendo sus manos llagadas de amor y bendición hacia ti, emanando rayos de luz de sanidad y paz divina.",
      cameraMovement: "Paneo suave mostrando las manos protectoras de Cristo con partículas doradas",
      narrationText: "Hoy quiero que escuches mi voz en lo profundo de tu alma: Yo no me he olvidado de ti. Cada lágrima la guardé y cada oración la escuché.",
      onScreenText: "YO NO ME HE OLVIDADO DE TI",
      atmosphere: "Aura celestial y partículas de bendición"
    },
    {
      sceneNumber: 3,
      durationSec: 10,
      visualPrompt: "Jesús con ambas manos abiertas en gesto de paz sobre un paisaje sereno, disipando la tormenta con un amanecer de gloria y luz viva.",
      cameraMovement: "Apertura cinematográfica de luz celestial con movimiento fluido",
      narrationText: "Ven a mí si estás cansado o afligido. Yo calmo tus vientos, quito toda angustia de tu pecho y multiplico tus fuerzas.",
      onScreenText: "YO CALMO TU TORMENTA HOY",
      atmosphere: "Paz sobrenatural y gloria divina"
    },
    {
      sceneNumber: 4,
      durationSec: 10,
      visualPrompt: "Jesucristo triunfante y coronado de luz celestial, bendiciendo con majestad y amor eterno bajo el resplandor de las nubes doradas.",
      cameraMovement: "Cámara lenta con resplandor dorado y destellos de victoria eterna",
      narrationText: "Recibe mi paz en este momento. Levántate con fe y declara la victoria, porque grandes cosas haré en tu vida. Te amo con amor eterno.",
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
    tone: 'Íntimo, sereno y oracional para la noche',
    customHook: 'No apagues la luz todavía... Jesús me mandó a dejar este manto de paz sobre tu almohada esta noche.',
    projectedRetention: 89
  },
  {
    id: 'salmo-91-cadenas',
    title: '🛡️ Salmo 91: Rompe Cadenas y Protección',
    topic: 'Declaración poderosa de protección del Salmo 91 contra todo temor, peligro y enfermedad en el hogar',
    format: 'YouTube Shorts 9:16 (30-45s)',
    tone: 'Con autoridad espiritual y fe inquebrantable',
    customHook: 'Ninguna plaga tocará tu puerta ni la de tus hijos. Repite esta protección del Salmo 91 ahora mismo.',
    projectedRetention: 92
  },
  {
    id: '3-cosas-dios-dice',
    title: '⚡ 3 Cosas que Dios te Dice Hoy (#3 Impactante)',
    topic: '3 promesas urgentes y directas al corazón para quien siente que sus fuerzas se terminaron hoy',
    format: 'Reel / TikTok 9:16 (45-60s)',
    tone: 'Inspirador, reconfortante y lleno de fe',
    customHook: 'Préstame 20 segundos... La tercera cosa que Dios me dijo que te entregara cambiará por completo tu semana.',
    projectedRetention: 86
  },
  {
    id: 'sanidad-milagrosa',
    title: '🕊️ Decreto de Sanidad y Quiebre de Dolor',
    topic: 'Oración por sanidad física, milagro en el cuerpo y consuelo emocional en el nombre de Jesús',
    format: 'Shorts 9:16 (55s)',
    tone: 'Con autoridad espiritual, fe y amor',
    customHook: 'Pon tu mano donde hay dolor o preocupación... Jesús está extendiendo su mano llagada de poder sobre ti.',
    projectedRetention: 91
  },
  {
    id: 'apertura-puertas',
    title: '🚪 Dios Abre Puertas Donde No las Hay',
    topic: 'Mensaje de fe para abrir caminos en finanzas, trabajo y bendición familiar imposible',
    format: 'YouTube Video 16:9 (60-90s)',
    tone: 'Inspirador, motivador y lleno de gozo',
    customHook: 'Si sentías que esa puerta se cerró para siempre, prepárate: Dios está abriendo un camino en medio del desierto.',
    projectedRetention: 84
  },
  {
    id: 'bendicion-hijos',
    title: '👨‍👩‍👧‍👦 Manto de Bendición Sobre Tus Hijos',
    topic: 'Oración de cobertura y bendición para proteger a los hijos en todo lugar',
    format: 'Reel 9:16 (50s)',
    tone: 'Cálido, protector y familiar',
    customHook: 'Padre o madre que amas a tus hijos: no pases de largo sin soltar esta bendición y blindaje angelical sobre ellos.',
    projectedRetention: 94
  }
];

// ⚡ Dynamic & Highly Innovative Scroll-Stopping Hooks Bank (Retention >70% to 94%)
export const INNOVATIVE_HOOKS_BANK: InnovativeHookItem[] = [
  // Urgencia de Amor & Sorpresa
  {
    id: 'hook-urg-1',
    category: 'urgencia_amor',
    categoryLabel: 'Urgencia de Amor',
    hookText: 'Detén un momento tus pensamientos... Esta noche Jesús no te dejará con la duda ni el corazón vacío.',
    onScreenText: 'JESÚS RESPONDE TU DUDA ESTA NOCHE',
    projectedScrollStopPct: 88.5,
    psychologicalTrigger: 'Interrupción empática y promesa de respuesta inmediata',
    recommendedVisual: 'Jesús mirando con ternura infinita y luz celestial dorada'
  },
  {
    id: 'hook-urg-2',
    category: 'urgencia_amor',
    categoryLabel: 'Urgencia de Amor',
    hookText: 'Mírame a los ojos... Yo no he terminado contigo. Lo que el enemigo intentó destruir, Yo lo haré florecer.',
    onScreenText: 'LO MEJOR APENAS COMIENZA EN TU VIDA',
    projectedScrollStopPct: 91.2,
    psychologicalTrigger: 'Contacto visual directo de Cristo y autoridad restauradora',
    recommendedVisual: 'Primer plano cinematográfico del rostro sereno y amoroso de Cristo'
  },
  {
    id: 'hook-urg-3',
    category: 'urgencia_amor',
    categoryLabel: 'Urgencia de Amor',
    hookText: 'Espera un segundo... Tengo algo que decirte antes de que tomes esa decisión tan difícil.',
    onScreenText: 'ANTES DE QUE TOMES ESA DECISIÓN...',
    projectedScrollStopPct: 87.0,
    psychologicalTrigger: 'Curiosidad y dirección oportuna en momentos de incertidumbre',
    recommendedVisual: 'Jesús extendiendo una mano protectora hacia la cámara'
  },

  // Oración Silenciosa & Revelación
  {
    id: 'hook-oracion-1',
    category: 'oracion_silenciosa',
    categoryLabel: 'Oración en Secreto',
    hookText: 'Nadie vio las lágrimas que derramaste en tu almohada anoche, pero Jesús estaba ahí recogiendo cada una de ellas.',
    onScreenText: 'HE VISTO TUS LÁGRIMAS EN SILENCIO',
    projectedScrollStopPct: 93.8,
    psychologicalTrigger: 'Validación emocional profunda de dolores no compartidos',
    recommendedVisual: 'Jesús en santuario de luz nocturna con lágrimas convertidas en perlas de gloria'
  },
  {
    id: 'hook-oracion-2',
    category: 'oracion_silenciosa',
    categoryLabel: 'Oración en Secreto',
    hookText: 'Esa oración que hiciste sin palabras, solo suspirando de dolor... el Padre la escuchó con perfecta claridad.',
    onScreenText: 'TU ORACIÓN EN SILENCIO FUE ESCUCHADA',
    projectedScrollStopPct: 89.4,
    psychologicalTrigger: 'Consuelo instantáneo y fe en que Dios entiende lo inexpresable',
    recommendedVisual: 'Rayo de luz divina descendiendo desde el cielo sobre un corazón arrodillado'
  },
  {
    id: 'hook-oracion-3',
    category: 'oracion_silenciosa',
    categoryLabel: 'Oración en Secreto',
    hookText: 'Pensaste que estabas solo en medio de la tormenta, pero fui Yo quien sostuvo tu barca para que no te hundieras.',
    onScreenText: 'YO SOSTUVE TU BARCA EN LA TORMENTA',
    projectedScrollStopPct: 90.1,
    psychologicalTrigger: 'Revelación de protección oculta en tiempos oscuros',
    recommendedVisual: 'Jesús calmando las aguas bravas con luz amaneciendo en el horizonte'
  },

  // Rompe Ansiedad & Carga
  {
    id: 'hook-ansiedad-1',
    category: 'rompe_ansiedad',
    categoryLabel: 'Romper Ansiedad',
    hookText: 'Suelta esa presión en el pecho... Respira profundo. Jesús acaba de entrar a tu habitación a llevarse tu angustia.',
    onScreenText: 'RESPIRA: JESÚS ENTRÓ A TU HABITACIÓN',
    projectedScrollStopPct: 92.5,
    psychologicalTrigger: 'Instrucción somática inmediata combinada con paz espiritual',
    recommendedVisual: 'Jesús entrando con manto blanco radiante y aura de serenidad infinita'
  },
  {
    id: 'hook-ansiedad-2',
    category: 'rompe_ansiedad',
    categoryLabel: 'Romper Ansiedad',
    hookText: 'El problema que te quitó el sueño esta semana ya tiene fecha de caducidad en el calendario de Dios.',
    onScreenText: 'TU PROBLEMA TIENE FECHA DE CADUCIDAD',
    projectedScrollStopPct: 86.8,
    psychologicalTrigger: 'Certeza profética y alivio frente a la preocupación continua',
    recommendedVisual: 'Jesús señalando un horizonte iluminado con luz de amanecer'
  },
  {
    id: 'hook-ansiedad-3',
    category: 'rompe_ansiedad',
    categoryLabel: 'Romper Ansiedad',
    hookText: 'Deja de pelear con tus propias fuerzas. Hoy Jesús toma el control de tu batalla y te entrega su victoria.',
    onScreenText: 'ENTREGA TU BATALLA HOY A JESÚS',
    projectedScrollStopPct: 84.3,
    psychologicalTrigger: 'Rendición liberadora y descanso mental',
    recommendedVisual: 'Jesús con manto glorioso y brazos abiertos en bendición'
  },

  // Protección Salmo 91
  {
    id: 'hook-salmo-1',
    category: 'proteccion_salmo91',
    categoryLabel: 'Protección Salmo 91',
    hookText: 'Activa este escudo sobre tu hogar: Ninguna plaga tocará tu morada ni la de tus hijos. Salmo 91 declarado ahora.',
    onScreenText: 'BLINDAJE DEL SALMO 91 PARA TU CASA',
    projectedScrollStopPct: 94.2,
    psychologicalTrigger: 'Instinto de protección del hogar y los seres amados',
    recommendedVisual: 'Alas doradas celestiales cubriendo un hogar con fuego divino'
  },
  {
    id: 'hook-salmo-2',
    category: 'proteccion_salmo91',
    categoryLabel: 'Protección Salmo 91',
    hookText: 'Caerán a tu lado mil, y diez mil a tu diestra; mas a ti no llegará. Escucha la orden de los ángeles hoy.',
    onScreenText: 'A TI NO LLEGARÁ EL MAL • SALMO 91',
    projectedScrollStopPct: 91.5,
    psychologicalTrigger: 'Invocación de autoridad bíblica inquebrantable',
    recommendedVisual: 'Ángeles de luz y Jesucristo protegiendo el camino de un creyente'
  },

  // Sanidad y Milagros
  {
    id: 'hook-sanidad-1',
    category: 'sanidad_milagro',
    categoryLabel: 'Sanidad y Milagros',
    hookText: 'Donde la medicina dijo que no había nada más que hacer, Jesús dice: \'Yo soy tu sanador y te levanto hoy\'.',
    onScreenText: 'JESÚS TIENE LA ÚLTIMA PALABRA',
    projectedScrollStopPct: 93.0,
    psychologicalTrigger: 'Esperanza desafiante frente a diagnósticos difíciles',
    recommendedVisual: 'Manos llagadas de Jesús emitiendo rayos de luz pura de sanidad'
  },
  {
    id: 'hook-sanidad-2',
    category: 'sanidad_milagro',
    categoryLabel: 'Sanidad y Milagros',
    hookText: 'Pon tu mano en tu corazón 10 segundos... Hay un milagro de sanidad interior ocurriendo en ti en este instante.',
    onScreenText: 'MILAGRO DE SANIDAD EN TU CORAZÓN',
    projectedScrollStopPct: 89.7,
    psychologicalTrigger: 'Llamado a la acción físico y expectativa de fe instantánea',
    recommendedVisual: 'Corazón resplandeciente en el pecho de Jesús iluminando todo el entorno'
  },

  // Puertas Abiertas & Provisión
  {
    id: 'hook-puertas-1',
    category: 'puertas_abiertas',
    categoryLabel: 'Puertas Abiertas',
    hookText: 'Esa puerta que los hombres te cerraron en la cara, Dios la usará para abrirte un portón de gloria que nadie cerrará.',
    onScreenText: 'DIOS ABRE UN PORTÓN DE GLORIA',
    projectedScrollStopPct: 88.0,
    psychologicalTrigger: 'Reivindicación divina y giro positivo de destinos',
    recommendedVisual: 'Gran puerta de luz dorada abriéndose en un muro de piedra'
  },
  {
    id: 'hook-puertas-2',
    category: 'puertas_abiertas',
    categoryLabel: 'Puertas Abiertas',
    hookText: 'No te preocupes por la cuenta que vence mañana... El Dios que multiplicó los panes y los peces ya tiene tu provisión.',
    onScreenText: 'TU PROVISIÓN YA ESTÁ EN CAMINO',
    projectedScrollStopPct: 87.5,
    psychologicalTrigger: 'Alivio ante el estrés financiero con anclaje en milagros bíblicos',
    recommendedVisual: 'Manos de Jesús bendiciendo y derramando luz de abundancia'
  },

  // Nocturno & Paz para Dormir
  {
    id: 'hook-noche-1',
    category: 'nocturno_paz',
    categoryLabel: 'Paz Nocturna',
    hookText: 'No te vayas a dormir con esa carga en la mente. Déjamela a Mí y duerme bajo la sombra de mis alas esta noche.',
    onScreenText: 'ENTREGA TU CARGA ANTES DE DORMIR',
    projectedScrollStopPct: 91.8,
    psychologicalTrigger: 'Invitación a descansar y soltar el insomnio antes de cerrar los ojos',
    recommendedVisual: 'Jesús bendiciendo bajo un cielo estrellado con luna llena de paz'
  },
  {
    id: 'hook-noche-2',
    category: 'nocturno_paz',
    categoryLabel: 'Paz Nocturna',
    hookText: 'Si este video apareció en tu pantalla a oscuras, es porque Dios mandó a sus ángeles a vigilar tu habitación hoy.',
    onScreenText: 'ÁNGELES CUSTODIANDO TU HABITACIÓN',
    projectedScrollStopPct: 92.4,
    psychologicalTrigger: 'Sensación de compañía divina en momentos de soledad nocturna',
    recommendedVisual: 'Presencia de luz celestial guardando una habitación en calma'
  }
];

export const getRandomInnovativeHook = (excludeHook?: string, categoryFilter?: string): InnovativeHookItem => {
  let pool = INNOVATIVE_HOOKS_BANK;
  if (categoryFilter) {
    pool = pool.filter(h => h.category === categoryFilter);
  }
  if (excludeHook && pool.length > 1) {
    pool = pool.filter(h => h.hookText !== excludeHook);
  }
  if (pool.length === 0) pool = INNOVATIVE_HOOKS_BANK;
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
};

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
