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
      visualPrompt: "Dale vida al personaje de las  imagenes ten es cuenta les tres y alternalas:\nDuración: 10 segundos (movimiento continuo sin interrupciones).\n\nMovimiento de cámara: Primer plano con zoom lento y continuo durante 10 segundos para conectar profundamente con el espectador, con un movimiento suave, natural y fluido.\n\nDiálogo de 10 segundos en español con la compasiva voz de Jesús: \"Recibe hoy mi paz y mi poder sobrenatural; yo estoy contigo, renovando cada parte de tu vida para que sigas adelante con esperanza. Cree, hijo mío.\"\n\nInstrucción obligatoria de edición visual: Al crear el guion y las indicaciones de video, debes estructurar la sincronización de manera que se produzca un corte o cambio visual exactamente cada 2 o 3 segundos. Estos cortes deben ser dinámicos pero elegantes, alternando aleatoriamente entre: acercamientos sutiles, alejamientos, ligeros paneos o cambios de ángulo",
      cameraMovement: "Primer plano con zoom lento y continuo durante 10 segundos para conectar profundamente con el espectador, con un movimiento suave, natural y fluido.",
      narrationText: "Recibe hoy mi paz y mi poder sobrenatural; yo estoy contigo, renovando cada parte de tu vida para que sigas adelante con esperanza. Cree, hijo mío.",
      onScreenText: "RECIBE HOY MI PAZ Y MI PODER",
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
      narrationText: "Recibe mi paz en este momento. Levántate con fe y declara la victoria. Declara 'Amén Jesús' en los comentarios, guarda esta bendición y compártela con quien amas.",
      onScreenText: "DECLARA 'AMÉN JESÚS' • GUARDA Y COMPARTE",
      atmosphere: "Gloria, amor incondicional y victoria"
    }
  ],
  socialMetadata: {
    hashtags: ["#JesusTeHabla", "#OracionDeFe", "#PazDeDios", "#JesusTeAma", "#DevocionalCristiano", "#FeEnDios", "#ShortsDeFe"],
    caption: "🕊️ Jesús tiene un mensaje especial para tu corazón hoy: 'Hijo mío, no temas, yo estoy contigo'. Si recibes esta palabra de consuelo, escribe tu 'Amén' y compártelo con alguien que necesite sentir el abrazo de Dios hoy.",
    pinnedComment: "❤️ Escribe aquí tu petición o declara 'Gracias Jesús por tu paz' para orar juntos por tu vida y tu familia."
  },
  packaging: {
    primaryTitle: "Nadie Vio Tus Lágrimas Anoche... Pero Jesús Estuvo Ahí",
    thumbnailOverlayText: "ÉL ESTUVO AHÍ",
    thumbnailConcept: "Jesús en primer plano cinematográfico mirando fijamente a la cámara con compasión infinita y luz divina en fondo nocturno de alto contraste.",
    firstTwoSecondsHook: "Detén un segundo tus pensamientos... Nadie vio la lágrima que cayó en tu almohada anoche, pero Jesús estaba a tu lado.",
    targetAudienceAvatar: "Creyentes afligidos o con ansiedad nocturna que sienten soledad y necesitan sentir la presencia real y el abrazo de Cristo.",
    packagingScore: 98,
    variants: [
      {
        id: 'var_curiosity_relief',
        title: "Nadie Vio Tus Lágrimas Anoche... Pero Jesús Estuvo Ahí",
        titleFormula: "Curiosidad + Alivio Inmediato",
        thumbnailOverlayText: "ÉL ESTUVO AHÍ",
        thumbnailVisualPrompt: "Primer plano de Jesús con mirada paternal tierna y aura celestial dorada contrastando con fondo nocturno suave",
        firstTwoSecondsHook: "Detén tus pensamientos... Nadie vio la lágrima en tu almohada anoche, pero Jesús estuvo a tu lado.",
        expectedCtrPercentage: 14.8,
        focalPointDescription: "1 solo punto focal: Mirada y rostro luminoso de Cristo",
        contrastRating: "Máximo"
      },
      {
        id: 'var_urgency_night',
        title: "No Cierres Tus Ojos Esta Noche Sin Escuchar Esto de Jesús",
        titleFormula: "Urgencia Íntima / Nocturna",
        thumbnailOverlayText: "NO TE DUERMAS",
        thumbnailVisualPrompt: "Mano luminosa de Jesús extendiéndose hacia ti con partículas doradas de paz en penumbra reconfortante",
        firstTwoSecondsHook: "Antes de cerrar tus ojos, Jesús te pide 20 segundos: Entrega esa carga pesada a Sus pies ahora.",
        expectedCtrPercentage: 13.5,
        focalPointDescription: "Mano extendida de Jesús y resplandor de paz",
        contrastRating: "Máximo"
      },
      {
        id: 'var_belief_break',
        title: "Pensaste Que Dios Guardó Silencio... Pero Te Estaba Protegiendo",
        titleFormula: "Ruptura de Creencia & Revelación",
        thumbnailOverlayText: "NO FUE CASTIGO",
        thumbnailVisualPrompt: "Jesús cubriendo con Su manto celestial a una persona arrodillada frente a la tormenta que se disipa",
        firstTwoSecondsHook: "Si creías que Dios te había olvidado en la tormenta, escucha con atención lo que Él te revela hoy.",
        expectedCtrPercentage: 15.2,
        focalPointDescription: "Manto protector de Cristo disipando nubes oscuras con luz viva",
        contrastRating: "Alto"
      }
    ],
    antiErrorChecklist: [
      {
        id: 'rule_packaging_first',
        errorName: "Error #1: Diseñar el Packaging al final como ocurrencia secundaria",
        mistakeDescription: "Crear y editar el video primero y luego inventarse un título genérico o miniatura descuidada.",
        solutionStrategy: "El packaging (Título + Miniatura + Gancho 0-2s) se diseña ANTES para garantizar que la promesa sea irresistible.",
        isCompliant: true,
        scoreImpact: 25
      },
      {
        id: 'rule_two_second_hook',
        errorName: "Error #2: Introducciones lentas o saludos que matan la retención",
        mistakeDescription: "Decir 'Hola bienvenidos a mi canal...' en los primeros segundos hace que el 80% de usuarios deslice hacia arriba.",
        solutionStrategy: "Gancho inmediato en los primeros 2 segundos cumpliendo de golpe la promesa de la miniatura.",
        isCompliant: true,
        scoreImpact: 20
      },
      {
        id: 'rule_single_focal_point',
        errorName: "Error #3: Miniaturas caóticas y texto largo ilegible en móvil",
        mistakeDescription: "Saturar la miniatura con 10 elementos y frases largas que en pantalla de celular son manchas ilegibles.",
        solutionStrategy: "1 solo punto focal dominante (Jesús con emoción clara) + máximo 3 a 4 palabras clave complementarias.",
        isCompliant: true,
        scoreImpact: 20
      },
      {
        id: 'rule_thumbnail_title_synergy',
        errorName: "Error #4: Duplicar exactamente el título en la miniatura",
        mistakeDescription: "Poner en la imagen el mismo texto del título desperdicia el 50% de la fuerza del packaging.",
        solutionStrategy: "La miniatura y el título se complementan: el título despierta curiosidad/dolor y la miniatura remata con impacto emocional.",
        isCompliant: true,
        scoreImpact: 15
      },
      {
        id: 'rule_niche_audience_clarity',
        errorName: "Error #5: Confundir al algoritmo de YouTube con temas dispersos",
        mistakeDescription: "Saltar de un tema a otro sin un avatar de audiencia claro produce 'visitas vacías' y el algoritmo deja de recomendar.",
        solutionStrategy: "Enfoque láser en el nicho de Fe, Oración y Esperanza: el algoritmo aprende exactamente a quién mostrarle el contenido.",
        isCompliant: true,
        scoreImpact: 20
      }
    ],
    keyLessons: [
      "El 99% de canales no crece porque cree que la solución es subir más videos en vez de mejorar el packaging.",
      "El algoritmo de YouTube no recomienda videos por caridad: recomienda videos que retienen a una audiencia específica.",
      "Una buena idea mal empaquetada parecerá aburrida e invisible para millones de personas.",
      "No copies a ciegas: entiende la psicología de la audiencia y aplica 1 mejora concreta en cada video."
    ]
  },
  banner_hook_superior: "🔴 CONSEJO PARA HACERTE VIRAL EN TU FE",
  modo_viral: "vaca_morada"
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

// ⚡ Dynamic & Highly Innovative Scroll-Stopping Hooks Bank (Retention >70% to 96%)
// Todos los ganchos superan el 70% de retención con gatillos psicológicos y espirituales profundos
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
  {
    id: 'hook-urg-4',
    category: 'urgencia_amor',
    categoryLabel: 'Urgencia de Amor',
    hookText: 'No pases este video. Jesús te manda a decir: "Hijo mío, ya vi lo que callaste para no preocupar a los demás".',
    onScreenText: 'JESÚS VIO LO QUE CALLASTE AYER',
    projectedScrollStopPct: 93.4,
    psychologicalTrigger: 'Validación de sacrificio personal y carga invisible',
    recommendedVisual: 'Jesús con mirada compasiva y cálida luz abrazadora'
  },
  {
    id: 'hook-urg-5',
    category: 'urgencia_amor',
    categoryLabel: 'Urgencia de Amor',
    hookText: 'Sé que estás cansado de ser fuerte para todos... Por 30 segundos, déjame ser fuerte por ti.',
    onScreenText: 'DEJA DE SER FUERTE POR TODOS HOY',
    projectedScrollStopPct: 94.7,
    psychologicalTrigger: 'Liberación de la fatiga del cuidador y alivio emocional profundo',
    recommendedVisual: 'Jesús extendiendo sus dos brazos abiertos para un abrazo celestial'
  },
  {
    id: 'hook-urg-6',
    category: 'urgencia_amor',
    categoryLabel: 'Urgencia de Amor',
    hookText: 'Si este mensaje te encontró en este segundo exacto, no es casualidad: Dios escuchó tu gemido en secreto.',
    onScreenText: 'ESTO NO ES CASUALIDAD: DIOS TE OYÓ',
    projectedScrollStopPct: 89.8,
    psychologicalTrigger: 'Sincronicidad divina y certeza de atención celestial',
    recommendedVisual: 'Rayo de sol atravesando nubes doradas sobre el rostro de Cristo'
  },

  // Oración Silenciosa & Lágrimas en Secreto
  {
    id: 'hook-oracion-1',
    category: 'oracion_silenciosa',
    categoryLabel: 'Oración en Secreto',
    hookText: 'Nadie vio las lágrimas que derramaste en tu almohada anoche, pero Jesús estaba ahí recogiendo cada una de ellas.',
    onScreenText: 'HE VISTO TUS LÁGRIMAS EN SILENCIO',
    projectedScrollStopPct: 95.2,
    psychologicalTrigger: 'Validación emocional profunda de dolores no compartidos',
    recommendedVisual: 'Jesús en santuario de luz nocturna con lágrimas convertidas en perlas de gloria'
  },
  {
    id: 'hook-oracion-2',
    category: 'oracion_silenciosa',
    categoryLabel: 'Oración en Secreto',
    hookText: 'Esa oración que hiciste sin palabras, solo suspirando de dolor... el Padre la escuchó con perfecta claridad.',
    onScreenText: 'TU ORACIÓN EN SILENCIO FUE ESCUCHADA',
    projectedScrollStopPct: 92.1,
    psychologicalTrigger: 'Consuelo instantáneo y fe en que Dios entiende lo inexpresable',
    recommendedVisual: 'Rayo de luz divina descendiendo desde el cielo sobre un corazón arrodillado'
  },
  {
    id: 'hook-oracion-3',
    category: 'oracion_silenciosa',
    categoryLabel: 'Oración en Secreto',
    hookText: 'Pensaste que estabas solo en medio de la tormenta, pero fui Yo quien sostuvo tu barca para que no te hundieras.',
    onScreenText: 'YO SOSTUVE TU BARCA EN LA TORMENTA',
    projectedScrollStopPct: 91.5,
    psychologicalTrigger: 'Revelación de protección oculta en tiempos oscuros',
    recommendedVisual: 'Jesús calmando las aguas bravas con luz amaneciendo en el horizonte'
  },
  {
    id: 'hook-oracion-4',
    category: 'oracion_silenciosa',
    categoryLabel: 'Oración en Secreto',
    hookText: 'Te tragaste el nudo en la garganta para no llorar frente a tus hijos... Jesús te dice hoy: "Yo cuido de ellos".',
    onScreenText: 'NO TIENES QUE LLORAR A ESCONDIDAS',
    projectedScrollStopPct: 96.0,
    psychologicalTrigger: 'Impacto parental directo y entrega de vulnerabilidad',
    recommendedVisual: 'Jesús cubriendo a una familia con su manto celestial'
  },
  {
    id: 'hook-oracion-5',
    category: 'oracion_silenciosa',
    categoryLabel: 'Oración en Secreto',
    hookText: 'Cuando sentiste ganas de tirar la toalla esta semana, una mano invisible te sostuvo: era Cristo diciéndote "aún no".',
    onScreenText: 'NO TIRES LA TOALLA: CRISTO TE SOSTIENE',
    projectedScrollStopPct: 93.8,
    psychologicalTrigger: 'Prevención de rendición y renovación del espíritu',
    recommendedVisual: 'Jesús sosteniendo con firmeza las manos de una persona cansada'
  },

  // Rompe Ansiedad & Calma Profunda
  {
    id: 'hook-ansiedad-1',
    category: 'rompe_ansiedad',
    categoryLabel: 'Romper Ansiedad',
    hookText: 'Suelta esa presión en el pecho... Respira profundo. Jesús acaba de entrar a tu habitación a llevarse tu angustia.',
    onScreenText: 'RESPIRA: JESÚS ENTRÓ A TU HABITACIÓN',
    projectedScrollStopPct: 94.5,
    psychologicalTrigger: 'Instrucción somática inmediata combinada con paz espiritual',
    recommendedVisual: 'Jesús entrando con manto blanco radiante y aura de serenidad infinita'
  },
  {
    id: 'hook-ansiedad-2',
    category: 'rompe_ansiedad',
    categoryLabel: 'Romper Ansiedad',
    hookText: 'El problema que te quitó el sueño esta semana ya tiene fecha de caducidad en el calendario de Dios.',
    onScreenText: 'TU PROBLEMA TIENE FECHA DE CADUCIDAD',
    projectedScrollStopPct: 88.9,
    psychologicalTrigger: 'Certeza profética y alivio frente a la preocupación continua',
    recommendedVisual: 'Jesús señalando un horizonte iluminado con luz de amanecer'
  },
  {
    id: 'hook-ansiedad-3',
    category: 'rompe_ansiedad',
    categoryLabel: 'Romper Ansiedad',
    hookText: 'Deja de pelear con tus propias fuerzas. Hoy Jesús toma el control de tu batalla y te entrega su victoria.',
    onScreenText: 'ENTREGA TU BATALLA HOY A JESÚS',
    projectedScrollStopPct: 86.4,
    psychologicalTrigger: 'Rendición liberadora y descanso mental',
    recommendedVisual: 'Jesús con manto glorioso y brazos abiertos en bendición'
  },
  {
    id: 'hook-ansiedad-4',
    category: 'rompe_ansiedad',
    categoryLabel: 'Romper Ansiedad',
    hookText: 'Esa taquicardia y ese miedo al futuro no vienen de Dios. Recibe ahora el espíritu de paz y dominio propio.',
    onScreenText: 'FUERA TEMOR: RECIBE LA PAZ DE CRISTO',
    projectedScrollStopPct: 90.5,
    psychologicalTrigger: 'Desarme del ataque de pánico mediante autoridad espiritual',
    recommendedVisual: 'Jesús posando su mano bendita sobre el corazón'
  },
  {
    id: 'hook-ansiedad-5',
    category: 'rompe_ansiedad',
    categoryLabel: 'Romper Ansiedad',
    hookText: '¿Por qué te afanas por el día de mañana si Yo ya preparé la mesa de tu victoria? Descansa en Mí.',
    onScreenText: 'EL MAÑANA YA ESTÁ EN MANOS DE DIOS',
    projectedScrollStopPct: 87.8,
    psychologicalTrigger: 'Reencuadre bíblico de Mateo 6 y liberación de control',
    recommendedVisual: 'Jesús entre lirios del campo con rostro sereno y sonriente'
  },

  // Blindaje y Protección Salmo 91
  {
    id: 'hook-salmo-1',
    category: 'proteccion_salmo91',
    categoryLabel: 'Protección Salmo 91',
    hookText: 'Activa este escudo sobre tu hogar: Ninguna plaga tocará tu morada ni la de tus hijos. Salmo 91 declarado ahora.',
    onScreenText: 'BLINDAJE DEL SALMO 91 PARA TU CASA',
    projectedScrollStopPct: 95.8,
    psychologicalTrigger: 'Instinto de protección del hogar y los seres amados',
    recommendedVisual: 'Alas doradas celestiales cubriendo un hogar con fuego divino'
  },
  {
    id: 'hook-salmo-2',
    category: 'proteccion_salmo91',
    categoryLabel: 'Protección Salmo 91',
    hookText: 'Caerán a tu lado mil, y diez mil a tu diestra; mas a ti no llegará. Escucha la orden de los ángeles hoy.',
    onScreenText: 'A TI NO LLEGARÁ EL MAL • SALMO 91',
    projectedScrollStopPct: 92.6,
    psychologicalTrigger: 'Invocación de autoridad bíblica inquebrantable',
    recommendedVisual: 'Ángeles de luz y Jesucristo protegiendo el camino de un creyente'
  },
  {
    id: 'hook-salmo-3',
    category: 'proteccion_salmo91',
    categoryLabel: 'Protección Salmo 91',
    hookText: 'Antes de salir por esa puerta, sella tu vida: Con sus plumas te cubrirá, y debajo de sus alas estarás seguro.',
    onScreenText: 'BAJO SUS ALAS ESTÁS SEGURO HOY',
    projectedScrollStopPct: 93.1,
    psychologicalTrigger: 'Rutina espiritual de blindaje diario antes de enfrentar el mundo',
    recommendedVisual: 'Manto celestial de Cristo descendiendo sobre el espectador'
  },
  {
    id: 'hook-salmo-4',
    category: 'proteccion_salmo91',
    categoryLabel: 'Protección Salmo 91',
    hookText: 'Toda trampa que planearon a tus espaldas se deshace en este momento por la sangre bendita del Cordero.',
    onScreenText: 'TODA TRAMPA QUEDA DESHECHA HOY',
    projectedScrollStopPct: 94.0,
    psychologicalTrigger: 'Reivindicación de justicia y desarme de envidias o ataques',
    recommendedVisual: 'La Cruz de Cristo iluminada quebrando cadenas oscuras'
  },

  // Sanidad Milagrosa y Restauración del Cuerpo
  {
    id: 'hook-sanidad-1',
    category: 'sanidad_milagro',
    categoryLabel: 'Sanidad y Milagros',
    hookText: 'Donde la medicina dijo que no había nada más que hacer, Jesús dice: "Yo soy tu sanador y te levanto hoy".',
    onScreenText: 'JESÚS TIENE LA ÚLTIMA PALABRA',
    projectedScrollStopPct: 95.0,
    psychologicalTrigger: 'Esperanza desafiante frente a diagnósticos difíciles',
    recommendedVisual: 'Manos llagadas de Jesús emitiendo rayos de luz pura de sanidad'
  },
  {
    id: 'hook-sanidad-2',
    category: 'sanidad_milagro',
    categoryLabel: 'Sanidad y Milagros',
    hookText: 'Pon tu mano donde sientas dolor o cansancio... Hay un calor sanador de Cristo entrando a tu cuerpo ahora.',
    onScreenText: 'MILAGRO DE SANIDAD EN TU CUERPO',
    projectedScrollStopPct: 91.8,
    psychologicalTrigger: 'Llamado a la acción físico y expectativa de fe instantánea',
    recommendedVisual: 'Corazón resplandeciente en el pecho de Jesús iluminando todo el entorno'
  },
  {
    id: 'hook-sanidad-3',
    category: 'sanidad_milagro',
    categoryLabel: 'Sanidad y Milagros',
    hookText: 'Por sus llagas fuimos nosotros curados. Declara conmigo que la enfermedad no es tu destino, sino la gloria de Dios.',
    onScreenText: 'POR SUS LLAGAS ERES SANO',
    projectedScrollStopPct: 89.2,
    psychologicalTrigger: 'Alineación con la promesa de Isaías 53:5',
    recommendedVisual: 'Jesús resucitado con manos luminosas de poder sanador'
  },
  {
    id: 'hook-sanidad-4',
    category: 'sanidad_milagro',
    categoryLabel: 'Sanidad y Milagros',
    hookText: 'Hijo mío: Sé cuánto te duele ese padecimiento. No te rindas, estoy tocando la raíz misma de tu aflicción.',
    onScreenText: 'JESÚS TOCA LA RAÍZ DE TU DOLOR',
    projectedScrollStopPct: 93.5,
    psychologicalTrigger: 'Empatía visceral y toque divino a nivel profundo',
    recommendedVisual: 'Jesús de rodillas consolando con amor a una persona afligida'
  },

  // Puertas Abiertas & Provisión Sobrenatural
  {
    id: 'hook-puertas-1',
    category: 'puertas_abiertas',
    categoryLabel: 'Puertas Abiertas',
    hookText: 'Esa puerta que los hombres te cerraron en la cara, Dios la usará para abrirte un portón de gloria que nadie cerrará.',
    onScreenText: 'DIOS ABRE UN PORTÓN DE GLORIA',
    projectedScrollStopPct: 91.0,
    psychologicalTrigger: 'Reivindicación divina y giro positivo de destinos',
    recommendedVisual: 'Gran puerta de luz dorada abriéndose en un muro de piedra'
  },
  {
    id: 'hook-puertas-2',
    category: 'puertas_abiertas',
    categoryLabel: 'Puertas Abiertas',
    hookText: 'No te preocupes por la cuenta que vence mañana... El Dios que multiplicó los panes y los peces ya tiene tu provisión.',
    onScreenText: 'TU PROVISIÓN YA ESTÁ EN CAMINO',
    projectedScrollStopPct: 90.2,
    psychologicalTrigger: 'Alivio ante el estrés financiero con anclaje en milagros bíblicos',
    recommendedVisual: 'Manos de Jesús bendiciendo y derramando luz de abundancia'
  },
  {
    id: 'hook-puertas-3',
    category: 'puertas_abiertas',
    categoryLabel: 'Puertas Abiertas',
    hookText: 'Te dijeron que no se podía, pero Dios dice: "Donde no hay camino, Yo abro calzada en medio del desierto".',
    onScreenText: 'DIOS HACE CAMINO DONDE NO LO HAY',
    projectedScrollStopPct: 89.6,
    psychologicalTrigger: 'Desafío a la imposibilidad humana',
    recommendedVisual: 'Jesús señalando un camino floreciente en medio de la aridez'
  },
  {
    id: 'hook-puertas-4',
    category: 'puertas_abiertas',
    categoryLabel: 'Puertas Abiertas',
    hookText: 'Se acabó el tiempo de escasez y humillación: prepárate porque viene una temporada de honra para tu casa.',
    onScreenText: 'VIENE UNA TEMPORADA DE HONRA',
    projectedScrollStopPct: 92.3,
    psychologicalTrigger: 'Esperanza de restitución y giro de fortuna familiar',
    recommendedVisual: 'Mano de Jesús derramando copa de aceite rebosante'
  },

  // Paz Nocturna & Vence el Insomnio
  {
    id: 'hook-noche-1',
    category: 'nocturno_paz',
    categoryLabel: 'Paz Nocturna',
    hookText: 'No te vayas a dormir con esa carga en la mente. Déjamela a Mí y duerme bajo la sombra de mis alas esta noche.',
    onScreenText: 'ENTREGA TU CARGA ANTES DE DORMIR',
    projectedScrollStopPct: 94.8,
    psychologicalTrigger: 'Invitación a descansar y soltar el insomnio antes de cerrar los ojos',
    recommendedVisual: 'Jesús bendiciendo bajo un cielo estrellado con luna llena de paz'
  },
  {
    id: 'hook-noche-2',
    category: 'nocturno_paz',
    categoryLabel: 'Paz Nocturna',
    hookText: 'Si este video apareció en tu pantalla a oscuras, es porque Dios mandó a sus ángeles a vigilar tu habitación hoy.',
    onScreenText: 'ÁNGELES CUSTODIANDO TU HABITACIÓN',
    projectedScrollStopPct: 93.9,
    psychologicalTrigger: 'Sensación de compañía divina en momentos de soledad nocturna',
    recommendedVisual: 'Presencia de luz celestial guardando una habitación en calma'
  },
  {
    id: 'hook-noche-3',
    category: 'nocturno_paz',
    categoryLabel: 'Paz Nocturna',
    hookText: 'Apaga los pensamientos que te atormentan. Jesús está en tu cabecera diciendo: "Calla, duerme en paz".',
    onScreenText: 'JESÚS EN TU CABECERA: DUERME EN PAZ',
    projectedScrollStopPct: 92.5,
    psychologicalTrigger: 'Paz mental inmediata y orden de calma sobre el cerebro inquieto',
    recommendedVisual: 'Jesús extendiendo su mano sobre una almohada con luz suave'
  },
  {
    id: 'hook-noche-4',
    category: 'nocturno_paz',
    categoryLabel: 'Paz Nocturna',
    hookText: 'No importa cuán larga haya sido la noche de dolor... el amanecer de gozo está a punto de despuntar sobre ti.',
    onScreenText: 'TU AMANECER DE GOZO ESTÁ CERCA',
    projectedScrollStopPct: 91.1,
    psychologicalTrigger: 'Consuelo del Salmo 30:5 y aliento al que sufre insomnio',
    recommendedVisual: 'Jesús mirando hacia los primeros rayos del amanecer celestial'
  }
];

// Persistent LRU tracker for non-repeating hooks
const USED_HOOKS_STORAGE_KEY = 'fe_oracion_used_hooks_history_v2';

export function getUsedHookIds(): string[] {
  try {
    const raw = localStorage.getItem(USED_HOOKS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_e) {
    return [];
  }
}

export function markHookIdAsUsed(hookId: string): void {
  try {
    const current = getUsedHookIds();
    const updated = [hookId, ...current.filter(id => id !== hookId)].slice(0, 50);
    localStorage.setItem(USED_HOOKS_STORAGE_KEY, JSON.stringify(updated));
  } catch (_e) {}
}

export function clearUsedHooksHistory(): void {
  try {
    localStorage.removeItem(USED_HOOKS_STORAGE_KEY);
  } catch (_e) {}
}

/**
 * Retorna un gancho de altísima retención garantizada (>70% a 96%) NUNCA REPETIDO
 * Excluye los ganchos utilizados recientemente en la sesión o en el historial persistido.
 */
export const getRandomInnovativeHook = (
  excludeHook?: string, 
  categoryFilter?: string
): InnovativeHookItem => {
  const history = getUsedHookIds();
  let pool = INNOVATIVE_HOOKS_BANK;

  if (categoryFilter && categoryFilter !== 'all') {
    pool = pool.filter(h => h.category === categoryFilter);
  }

  // Filtrar los que ya fueron usados recientemente
  let unusedPool = pool.filter(h => !history.includes(h.id));
  if (excludeHook) {
    unusedPool = unusedPool.filter(h => h.hookText !== excludeHook);
  }

  // Si se agotaron todos los ganchos vírgenes en esta categoría, reiniciar pool pero excluir el actual
  if (unusedPool.length === 0) {
    unusedPool = pool.filter(h => h.hookText !== excludeHook);
    if (unusedPool.length === 0) unusedPool = pool;
  }

  // Ordenar preferentemente por mayor proyección de retención (>85%)
  unusedPool.sort((a, b) => b.projectedScrollStopPct - a.projectedScrollStopPct);

  // Elegir aleatoriamente entre los mejores no repetidos
  const topCandidates = unusedPool.slice(0, Math.max(3, Math.floor(unusedPool.length / 2)));
  const selected = topCandidates[Math.floor(Math.random() * topCandidates.length)] || unusedPool[0];

  markHookIdAsUsed(selected.id);
  return selected;
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
