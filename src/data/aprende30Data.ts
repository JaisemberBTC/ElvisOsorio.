export interface Aprende30CategoryMeta {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  color: string;
  badgeBg: string;
  borderColor: string;
  sampleTopics: string[];
  bannerPrefix: string;
  defaultImages: string[];
}

export const APRENDE_30_CATEGORIES: Record<string, Aprende30CategoryMeta> = {
  ventas_negocios: {
    id: 'ventas_negocios',
    name: 'Ventas y Negocios de Alto Rendimiento',
    shortName: 'Ventas & Negocios',
    icon: '💼',
    color: 'from-amber-500 to-orange-600',
    badgeBg: 'bg-amber-500/15 text-amber-300',
    borderColor: 'border-amber-500/30',
    bannerPrefix: '🔴 APRENDE A VENDER EN 30s',
    sampleTopics: [
      'Aprende a vender en 30 segundos',
      'Cómo cerrar una venta cuando te dicen "está muy caro"',
      'El secreto del silencio tras decir tu precio',
      '3 preguntas mágicas que descubren el dolor del cliente',
      'La regla de oro para negociar con clientes difíciles'
    ],
    defaultImages: [
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1080&q=85',
      'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1080&q=85',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1080&q=85'
    ]
  },
  finanzas_dinero: {
    id: 'finanzas_dinero',
    name: 'Finanzas Inteligentes y Dinero',
    shortName: 'Finanzas & Dinero',
    icon: '💰',
    color: 'from-emerald-500 to-teal-600',
    badgeBg: 'bg-emerald-500/15 text-emerald-300',
    borderColor: 'border-emerald-500/30',
    bannerPrefix: '🔴 TRUCO DE DINERO EN 30s',
    sampleTopics: [
      'La regla 50/30/20 explicada en 30 segundos',
      'Interés compuesto: Cómo convertir $100 en $100,000',
      '3 errores con tarjetas de crédito que te dejan en quiebra',
      'Activos vs Pasivos: Por qué los ricos no compran pasivos',
      'El fondo de emergencia que el 90% olvida tener'
    ],
    defaultImages: [
      'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1080&q=85',
      'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=1080&q=85',
      'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1080&q=85'
    ]
  },
  productividad_habitos: {
    id: 'productividad_habitos',
    name: 'Productividad y Hábitos Atómicos',
    shortName: 'Productividad & Hábitos',
    icon: '⚡',
    color: 'from-blue-500 to-indigo-600',
    badgeBg: 'bg-blue-500/15 text-blue-300',
    borderColor: 'border-blue-500/30',
    bannerPrefix: '🔴 HACK DE PRODUCTIVIDAD EN 30s',
    sampleTopics: [
      'La regla de los 2 minutos para eliminar la flojera',
      'El método Pomodoro visual que triplica tu concentración',
      'Matriz de Eisenhower: Lo urgente vs Lo importante',
      'Cómo leer 1 libro por semana con la técnica de skimming',
      'La regla de no romper la cadena de Jerry Seinfeld'
    ],
    defaultImages: [
      'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=1080&q=85',
      'https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=1080&q=85',
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1080&q=85'
    ]
  },
  psicologia_mente: {
    id: 'psicologia_mente',
    name: 'Psicología Humana y Sesgos Mentales',
    shortName: 'Psicología & Mente',
    icon: '🧠',
    color: 'from-purple-500 to-pink-600',
    badgeBg: 'bg-purple-500/15 text-purple-300',
    borderColor: 'border-purple-500/30',
    bannerPrefix: '🔴 PSICOLOGÍA OSCURA EN 30s',
    sampleTopics: [
      'Cómo saber si alguien te está mintiendo en 30 segundos',
      'El efecto Pratfall: Por qué equivocarse te hace más simpático',
      'El truco de la mirada fija para imponer respeto',
      'El sesgo de anclaje: Cómo te manipulan con los precios',
      'Cómo pedir favores usando la palabra mágica "porque"'
    ],
    defaultImages: [
      'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=1080&q=85',
      'https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?w=1080&q=85',
      'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1080&q=85'
    ]
  },
  ciencia_curiosidades: {
    id: 'ciencia_curiosidades',
    name: 'Ciencia Asombrosa y Curiosidades',
    shortName: 'Ciencia & Curiosidades',
    icon: '🔬',
    color: 'from-cyan-500 to-blue-600',
    badgeBg: 'bg-cyan-500/15 text-cyan-300',
    borderColor: 'border-cyan-500/30',
    bannerPrefix: '🔴 DATO CIENTÍFICO EN 30s',
    sampleTopics: [
      'Lo que le pasa a tu cerebro cuando tomas café',
      'El lugar más silencioso de la Tierra donde puedes oír tu sangre',
      'El efecto Mpemba: Por qué el agua caliente se congela antes',
      'Por qué bostezamos: La verdad médica que no sabías',
      'El misterio del pulpo: 3 corazones y sangre azul'
    ],
    defaultImages: [
      'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=1080&q=85',
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1080&q=85',
      'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1080&q=85'
    ]
  },
  tecnologia_ia: {
    id: 'tecnologia_ia',
    name: 'Tecnología e Inteligencia Artificial',
    shortName: 'Tecnología & IA',
    icon: '🤖',
    color: 'from-indigo-500 to-violet-600',
    badgeBg: 'bg-indigo-500/15 text-indigo-300',
    borderColor: 'border-indigo-500/30',
    bannerPrefix: '🔴 HACK DE IA EN 30s',
    sampleTopics: [
      '3 Prompts de IA que te ahorran 5 horas de trabajo',
      'La web secreta para resumir PDFs de 200 páginas en 10 segundos',
      'Atajos de teclado que el 90% de los usuarios desconoce',
      'Cómo crear presentaciones profesionales con IA en 30 segundos',
      'El truco para saber si un correo electrónico es phishing'
    ],
    defaultImages: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1080&q=85',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1080&q=85',
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1080&q=85'
    ]
  },
  historia_cultura: {
    id: 'historia_cultura',
    name: 'Historia y Cultura Express',
    shortName: 'Historia & Cultura',
    icon: '📚',
    color: 'from-amber-600 to-yellow-600',
    badgeBg: 'bg-amber-600/15 text-amber-200',
    borderColor: 'border-amber-600/30',
    bannerPrefix: '🔴 HISTORIA EXPRESS EN 30s',
    sampleTopics: [
      'El invento accidental del microondas por un chocolate derretido',
      'Cómo los romanos enfriaban sus bebidas sin electricidad',
      'La biblioteca de Alejandría: Qué se perdió realmente',
      'El origen del apretón de manos: ¿Por qué lo hacemos?',
      'La guerra más corta de la historia que duró 38 minutos'
    ],
    defaultImages: [
      'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=1080&q=85',
      'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1080&q=85',
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1080&q=85'
    ]
  }
};

export const INITIAL_APRENDE_30_PACKAGE = {
  id: 'aprende30-sample',
  channelHandle: '@Aprendeen30segundos',
  channelUrl: 'https://www.youtube.com/@Aprendeen30segundos',
  titulo: 'Aprende a VENDER en 30 Segundos 🚀 (El Secreto de los Mejores)',
  categoria: 'ventas_negocios' as const,
  duracion_segundos: 30 as const,
  banner_hook_superior: '🔴 APRENDE A VENDER EN 30s',
  gancho_inicial: '¿Sabías que el 95% de las personas comete este error al vender? No vendas el producto, vende la transformación.',
  guion_completo: '¿Sabías que el 95% de la gente comete este error al vender? Dejan de escuchar y solo hablan del producto. El secreto está en hacer una pregunta clave: "¿Qué es lo que más te preocupa hoy?". Cuando escuchas su problema y ofreces la solución exacta, la venta se cierra sola. Guarda este video para tu próxima venta y suscríbete a @Aprendeen30segundos para dominar un truco nuevo cada día.',
  escenas: [
    {
      sceneNumber: 1,
      durationSec: 10,
      inicio_segundo: 0,
      fin_segundo: 10,
      stageTitle: 'Gancho Disruptivo (0-10s)',
      visualPrompt: 'Confident business person speaking passionately, cinematic dramatic lighting, neon accents, vertical 9:16 ratio, 8k resolution',
      narration: '¿Sabías que el 95% de la gente comete este error fatal al vender? Se enfocan en hablar del producto en vez de escuchar la necesidad real del cliente.',
      onScreenText: 'NO VENDAS EL PRODUCTO',
      secondaryTitle: '💡 El Gran Error',
      imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1080&q=85',
      cameraMovement: 'zoom_in_suave',
      subtitleSlots: [
        { id: 'slot-1', text: 'EL 95% COMETE ESTE ERROR', startSec: 0, endSec: 3.3, label: 'Gancho (0-3s)' },
        { id: 'slot-2', text: 'NO VENDAS EL PRODUCTO', startSec: 3.3, endSec: 6.6, label: 'Error (3-6s)' },
        { id: 'slot-3', text: 'ESCÚCHALO EN 30s', startSec: 6.6, endSec: 10, label: 'Revelación (6-10s)' }
      ]
    },
    {
      sceneNumber: 2,
      durationSec: 10,
      inicio_segundo: 10,
      fin_segundo: 20,
      stageTitle: 'El Secreto Revelado (10-20s)',
      visualPrompt: 'Close up handshake with glowing golden light and digital financial data charts in background, 9:16 vertical 8k',
      narration: 'El secreto es hacer una pregunta quirúrgica: "¿Cuál es tu mayor obstáculo ahora?". Cuando descubres su dolor y muestras el puente, la venta se cierra sola.',
      onScreenText: 'PREGUNTA POR SU DOLOR',
      secondaryTitle: '⚡ La Pregunta Clave',
      imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1080&q=85',
      cameraMovement: 'paneo_dinamico',
      subtitleSlots: [
        { id: 'slot-4', text: 'HAZ ESTA PREGUNTA', startSec: 10, endSec: 13.3, label: 'Técnica (10-13s)' },
        { id: 'slot-5', text: 'DESCUBRE SU PROBLEMA', startSec: 13.3, endSec: 16.6, label: 'Solución (13-16s)' },
        { id: 'slot-6', text: 'LA VENTA SE CIERRA', startSec: 16.6, endSec: 20, label: 'Cierre (16-20s)' }
      ]
    },
    {
      sceneNumber: 3,
      durationSec: 10,
      inicio_segundo: 20,
      fin_segundo: 30,
      stageTitle: 'Aplicación & Llamado a la Acción (20-30s)',
      visualPrompt: 'High energy modern office with celebratory success graphic, YouTube subscribe bell animation icon, sleek 9:16 format',
      narration: 'Aplica esto en tu próxima llamada y verás la diferencia. Guarda este video antes de olvidarlo y suscríbete a @Aprendeen30segundos para más hacks diarios.',
      onScreenText: 'GUARDA Y SUSCRÍBETE',
      secondaryTitle: '🚀 Cierre Viral',
      imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1080&q=85',
      cameraMovement: 'zoom_out_suave',
      subtitleSlots: [
        { id: 'slot-7', text: 'PRUÉBALO HOY MISMO', startSec: 20, endSec: 23.3, label: 'Acción (20-23s)' },
        { id: 'slot-8', text: 'GUARDA ESTE VIDEO', startSec: 23.3, endSec: 26.6, label: 'Guarda (23-26s)' },
        { id: 'slot-9', text: 'SÍGUENOS @APRENDEEN30S', startSec: 26.6, endSec: 30, label: 'Canal (26-30s)' }
      ]
    }
  ],
  miniatura_texto: 'NO VENDAS ASÍ',
  miniatura_visual: 'Persona señalando a la cámara con expresión asombrada y gráfico de ventas en verde neón subiendo, visual prompt: Shocked charismatic professional holding glowing red sign with "ERROR" in bold 3D, neon sales chart soaring in background, 9:16 vertical 8k render',
  ctr_estimado: 15.6,
  retencion_proyectada: 91,
  musica_sugerida: 'Lo-Fi Focus Beat a 124 BPM con sintetizador sutil',
  descripcion_youtube: `⚡ Aprende a vender en 30 segundos! El secreto que aplican los mejores negociadores del mundo.\n\n👉 Suscríbete a @Aprendeen30segundos para dominar una habilidad nueva en menos de 1 minuto.\n\n#Aprendeen30segundos #shorts #ventas #negocios #crecimiento #trucos #emprendimiento`,
  hashtags: ['#Aprendeen30segundos', '#shorts', '#ventas', '#negocios', '#tips', '#educacion'],
  llamado_accion: 'Guarda este video y suscríbete a @Aprendeen30segundos para no perderte el hack de mañana.',
  tarjeta_flash: {
    titulo: 'Cómo Cerrar una Venta en 30s',
    subtitulo: 'El método que utiliza el 1% de los mejores cerradores',
    categoriaLabel: 'Ventas y Negocios',
    errorComun: 'El 95% habla solo de las características del producto y aburre al cliente.',
    puntosClave: [
      'Haz la pregunta quirúrgica: "¿Cuál es tu mayor obstáculo ahora?"',
      'Guarda silencio absoluto tras hacer tu pregunta clave.',
      'Presenta tu oferta únicamente como el puente que elimina su dolor.'
    ],
    accionInmediata: 'En tu próxima llamada: habla 20% y haz que tu cliente hable el 80%.',
    quoteDestacada: '"La gente no compra productos, compra mejores versiones de sí misma."',
    badgeCanal: '@Aprendeen30segundos',
    formato: 'cuadrada',
    colorTema: 'rojo_ambar'
  }
};

export const INITIAL_DAILY_CAPSULES = [
  {
    id: 'capsule-1',
    fecha: 'Hoy • Edición Diaria',
    titulo: 'La Regla de los 2 Minutos para Vencer la Procrastinación',
    categoria: 'productividad_habitos' as const,
    categoriaNombre: 'Productividad y Hábitos Atómicos',
    icono: '⚡',
    gancho3s: '¿Sabías que tu cerebro solo necesita 120 segundos para engañar a la pereza?',
    explicacion30s: 'Si una tarea toma menos de dos minutos, hazla inmediatamente. Y si es un proyecto enorme, solo comprométete a hacer los primeros 2 minutos. Una vez que comienzas, el principio de inercia hace que tu cerebro quiera terminarla. Nunca negocies con la flojera.',
    sabiasQue: 'El 80% de la resistencia mental desaparece después de los primeros 120 segundos de acción física.',
    retoDelDia: 'Elige la tarea que más has postergado hoy y trabaja en ella exactamente 2 minutos con un cronómetro.',
    puntosClave: [
      'Si toma menos de 2 minutos: hazlo ya sin pensarlo.',
      'Para metas gigantes: solo inicia 120 segundos.',
      'La inercia vence a la pereza una vez que rompes el reposo.'
    ],
    citaMaestra: '"El secreto de salir adelante es simplemente comenzar." — Mark Twain',
    tarjeta: {
      titulo: 'La Regla de los 2 Minutos',
      subtitulo: 'Destruye la procrastinación en 120 segundos',
      categoriaLabel: 'Productividad y Hábitos',
      errorComun: 'Esperar a "tener ganas" antes de empezar una tarea difícil.',
      puntosClave: [
        'Regla 1: Si toma < 2 min, ejecútala inmediatamente.',
        'Regla 2: Si es un hábito nuevo, que empiece durando 2 min.',
        'La fricción mental solo existe en el momento de arrancar.'
      ],
      accionInmediata: 'Abre esa tarea pendiente y dale solo 120 segundos de foco.',
      quoteDestacada: '"Es más fácil actuar para sentir ganas, que esperar las ganas para actuar."',
      badgeCanal: '@Aprendeen30segundos',
      colorTema: 'rojo_ambar' as const
    },
    videoPackage: {
      id: 'capsule-video-1',
      channelHandle: '@Aprendeen30segundos',
      channelUrl: 'https://www.youtube.com/@Aprendeen30segundos',
      titulo: 'Vence la Procrastinación en 30 Segundos ⏳ (La Regla de los 2 Minutos)',
      categoria: 'productividad_habitos' as const,
      duracion_segundos: 30 as const,
      banner_hook_superior: '🔴 REGLA DE LOS 2 MINUTOS',
      gancho_inicial: '¿Sabías que tu cerebro solo necesita 120 segundos para engañar a la pereza? En 30 segundos te explico cómo activarlo.',
      guion_completo: '¿Sabías que tu cerebro solo necesita 120 segundos para destruir la pereza? Si una tarea toma menos de 2 minutos, hazla ya. Si es enorme, comprométete solo a los primeros 2 minutos. La física mental dice que un cuerpo en movimiento se mantiene en movimiento. Guarda este video y suscríbete a @Aprendeen30segundos.',
      escenas: [
        {
          sceneNumber: 1,
          durationSec: 10,
          inicio_segundo: 0,
          fin_segundo: 10,
          stageTitle: 'El Engaño Mental (0-10s)',
          visualPrompt: 'Glowing digital hourglass countdown clock displaying 02:00 with neon red and amber sparks, cinematic dark atmospheric studio, 9:16 vertical 8k',
          narration: '¿Sabías que tu mente solo necesita 120 segundos para hackear la pereza? Si algo toma menos de dos minutos, no lo pienses: hazlo ya.',
          onScreenText: 'LA REGLA DE LOS 2 MINUTOS',
          secondaryTitle: '⚡ Hack de Enfoque',
          imageUrl: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=1080&q=85',
          cameraMovement: 'zoom_in_suave',
          subtitleSlots: [
            { id: 'c1-s1', text: 'EL ENGAÑO MENTAL', startSec: 0, endSec: 3.3, label: 'Gancho (0-3s)' },
            { id: 'c1-s2', text: 'MENOS DE 2 MINUTOS', startSec: 3.3, endSec: 6.6, label: 'Regla (3-6s)' },
            { id: 'c1-s3', text: 'HAZLO DE INMEDIATO', startSec: 6.6, endSec: 10, label: 'Acción (6-10s)' }
          ]
        },
        {
          sceneNumber: 2,
          durationSec: 10,
          inicio_segundo: 10,
          fin_segundo: 20,
          stageTitle: 'La Inercia Atómica (10-20s)',
          visualPrompt: 'Dynamic 3D glowing domino effect pushing a massive boulder effortlessly, hyperrealistic physics visualization, cinematic lighting, 9:16 vertical',
          narration: 'Para proyectos gigantescos, haz solo los primeros 2 minutos. Una vez que rompes el reposo, el principio de inercia te empuja a terminar.',
          onScreenText: 'ROMPE LA FRICCIÓN',
          secondaryTitle: '💡 Principio Físico',
          imageUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1080&q=85',
          cameraMovement: 'paneo_dinamico',
          subtitleSlots: [
            { id: 'c1-s4', text: 'SOLO 2 MINUTOS', startSec: 10, endSec: 13.3, label: 'Inicio (10-13s)' },
            { id: 'c1-s5', text: 'ROMPE LA FRICCIÓN', startSec: 13.3, endSec: 16.6, label: 'Inercia (13-16s)' },
            { id: 'c1-s6', text: 'TU CEREBRO CONTINÚA', startSec: 16.6, endSec: 20, label: 'Resultado (16-20s)' }
          ]
        },
        {
          sceneNumber: 3,
          durationSec: 10,
          inicio_segundo: 20,
          fin_segundo: 30,
          stageTitle: 'Aplicación Inmediata (20-30s)',
          visualPrompt: 'Person in focused flow state at clean futuristic desk with golden checked todo list floating, YouTube subscribe button with bell, 9:16 8k',
          narration: 'Pruébalo con esa tarea que estás postergando hoy. Guarda este video para cuando tengas pereza y suscríbete a @Aprendeen30segundos para más hacks.',
          onScreenText: 'PRUÉBALO AHORA MISMO',
          secondaryTitle: '🚀 Cierre Viral',
          imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1080&q=85',
          cameraMovement: 'zoom_out_suave',
          subtitleSlots: [
            { id: 'c1-s7', text: 'PRUÉBALO HOY MISMO', startSec: 20, endSec: 23.3, label: 'Reto (20-23s)' },
            { id: 'c1-s8', text: 'GUARDA ESTE VIDEO', startSec: 23.3, endSec: 26.6, label: 'Guarda (23-26s)' },
            { id: 'c1-s9', text: 'SÍGUENOS @APRENDEEN30S', startSec: 26.6, endSec: 30, label: 'Canal (26-30s)' }
          ]
        }
      ],
      miniatura_texto: 'NO PROCRASTINES MÁS',
      miniatura_visual: 'Clock exploding into golden fragments with high contrast red neon 2-minute timer and focused expression',
      ctr_estimado: 16.2,
      retencion_proyectada: 92,
      musica_sugerida: 'Focus Techno Beat 126 BPM con sintetizador nítido',
      descripcion_youtube: '⚡ Destruye la procrastinación en 30 segundos con la Regla de los 2 Minutos.\n\n👉 Suscríbete a @Aprendeen30segundos para dominar un hack diario en menos de 1 minuto.\n\n#shorts #Aprendeen30segundos #productividad #habitos',
      hashtags: ['#Aprendeen30segundos', '#shorts', '#productividad', '#habitos', '#trucos'],
      llamado_accion: 'Guarda este video y suscríbete a @Aprendeen30segundos para no perderte el hack de mañana.'
    }
  },
  {
    id: 'capsule-2',
    fecha: 'Psicología de Alto Impacto',
    titulo: 'El Sesgo de Anclaje: Cómo Negociar Cualquier Precio',
    categoria: 'psicologia_mente' as const,
    categoriaNombre: 'Psicología Humana y Sesgos Mentales',
    icono: '🧠',
    gancho3s: '¿Sabías que el primer número que dices en una negociación controla el 80% del resultado?',
    explicacion30s: 'En psicología, el primer número mencionado actúa como un ancla mental. Si eres el primero en tirar una cifra ambiciosa pero justificada, la otra parte negociará alrededor de tu número, no del de ellos. Quien ancla primero, controla la mesa.',
    sabiasQue: 'Experimentos de Harvard demostraron que anclar con un número específico (ej. $4,950 en lugar de $5,000) genera un 35% más de credibilidad.',
    retoDelDia: 'En tu próxima negociación, sé el primero en proponer un rango con ancla alta.',
    puntosClave: [
      'El primer número fijado se convierte en el estándar de referencia.',
      'Usa números precisos ($2,850 en lugar de $3,000) para mayor solidez.',
      'Nunca dejes que el otro ancle primero sin una contra-oferta inmediata.'
    ],
    citaMaestra: '"En una negociación, el silencio y la primera cifra definen el juego."',
    tarjeta: {
      titulo: 'El Sesgo de Anclaje',
      subtitulo: 'El truco psicológico que define quién gana negociando',
      categoriaLabel: 'Psicología y Persuasión',
      errorComun: 'Tener miedo a decir el primer precio y dejar que el otro tome el control.',
      puntosClave: [
        'Ancla tú primero: la mente humana compara todo con el primer dato recibido.',
        'Números precisos transmiten cálculo real y preparación.',
        'Si te anclan bajo, reancla inmediatamente con un argumento técnico.'
      ],
      accionInmediata: 'Antes de negociar, define tu número de anclaje ambicioso.',
      quoteDestacada: '"Quien fija el ancla, dirige el barco de la negociación."',
      badgeCanal: '@Aprendeen30segundos',
      colorTema: 'violeta' as const
    }
  },
  {
    id: 'capsule-3',
    fecha: 'Finanzas Inteligentes',
    titulo: 'La Regla del 50/30/20: Ordena tu Dinero en 30 Segundos',
    categoria: 'finanzas_dinero' as const,
    categoriaNombre: 'Finanzas Inteligentes y Dinero',
    icono: '💰',
    gancho3s: '¿A dónde se va tu sueldo a final de mes? Con esta regla nunca volverás a estar en ceros.',
    explicacion30s: 'Divide tus ingresos netos en 3 cubos automáticos: 50% para necesidades básicas como renta y comida, 30% para tus deseos y estilo de vida, y un 20% sagrado para ahorro e inversión. El truco secreto: automatiza el 20% el mismo día que cobras, no al final.',
    sabiasQue: 'Ahorrando e invirtiendo el 20% a un 8% anual durante 20 años, multiplicas tu patrimonio por más de 5 veces gracias al interés compuesto.',
    retoDelDia: 'Revisa tu extracto bancario de este mes y calcula qué porcentaje gastaste en deseos vs necesidades.',
    puntosClave: [
      '50% Necesidades estrictas (sin lujos camuflados).',
      '30% Deseos y disfrute culpable sin remordimientos.',
      '20% Libertad financiera e inversión automática.'
    ],
    citaMaestra: '"No ahorres lo que te queda después de gastar; gasta lo que te queda después de ahorrar."',
    tarjeta: {
      titulo: 'La Regla 50 / 30 / 20',
      subtitulo: 'El mapa financiero más simple y efectivo del mundo',
      categoriaLabel: 'Finanzas y Dinero',
      errorComun: 'Intentar ahorrar "lo que sobre a fin de mes" (nunca sobra nada).',
      puntosClave: [
        '50% Necesidades básicas (vivienda, servicios, comida esencial).',
        '30% Estilo de vida (salidas, compras, ocio controlado).',
        '20% Ahorro e Inversión (automatizado el día 1).'
      ],
      accionInmediata: 'Programa una transferencia automática del 20% el día de pago.',
      quoteDestacada: '"Págate a ti primero antes de pagarle al resto del mundo."',
      badgeCanal: '@Aprendeen30segundos',
      colorTema: 'esmeralda' as const
    }
  }
];
