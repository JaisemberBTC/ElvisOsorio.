/**
 * faithContentStrategySkill.ts
 * HABILIDAD DE IA MAESTRA: ESTRATEGIA DE CONTENIDO, CREACIÓN DE GUIONES (17 PUNTOS),
 * GENERACIÓN DE PROMPTS Y CRECIMIENTO DIGITAL ÉTICO CRISTIANO.
 * 
 * Nicho Principal: FE, ORACIÓN Y VERSÍCULOS BÍBLICOS.
 * Audiencias prioritarias: Hispanos en EE.UU., España, México, Chile, Colombia y Latinoamérica.
 */

export interface ContentStrategyScript17 {
  // 17 PUNTOS OBLIGATORIOS
  objetivoContenido: string; // 1. Objetivo del contenido
  tipoContenido: 'descubrimiento' | 'confianza' | 'conversion'; // 2. Descubrimiento, Confianza o Conversión
  publicoEspecifico: string; // 3. Público específico
  problemaONecesidad: string; // 4. Problema o necesidad concreta
  gancho3Segundos: string; // 5. Gancho para los primeros 3 segundos (<3s)
  guionCompleto: string; // 6. Guion completo palabra por palabra (natural, conversacional)
  versiculoBiblico: {
    libro: string;
    capitulo: number;
    versiculo: string;
    traduccion: string; // Ej: RVR1960, NTV, NVI, DHH
    textoCompleto: string;
  }; // 7. Versículo bíblico y referencia correcta
  explicacionContexto: string; // 8. Explicación breve del contexto y aplicación
  textoEnPantalla: string[]; // 9. Texto que aparecerá en pantalla (subtítulos clave y banners)
  ideasEscenasYFondo: string[]; // 10. Ideas de escenas, imágenes o videos de fondo
  duracionRecomendada: string; // 11. Duración recomendada (ej: 30s, 45s, 60s)
  tituloPortada: string; // 12. Título o frase para la portada
  descripcionPublicacion: string; // 13. Descripción para publicar (copywriting)
  llamadaALaAccion: string; // 14. Llamada a la acción (CTA)
  hashtags: string[]; // 15. Hashtags relevantes
  promptIaImagenVideo: {
    klingRunwayPromptEn: string;
    midjourneyPromptEn: string;
    descripcionPlanoEs: string;
  }; // 16. Prompt para generar imágenes o videos con IA
  metricaPrincipal: string; // 17. Métrica principal a revisar (guardados, compartidos, retención, etc.)
}

export interface ContentPlanItem {
  dia: number;
  tema: string;
  categoria: 'alcance' | 'ensenanza' | 'comunidad' | 'oracion' | 'reflexion' | 'conversion';
  tipo: 'descubrimiento' | 'confianza' | 'conversion';
  versiculo: string;
  gancho: string;
  formato: string; // Reels/TikTok 9:16, Carrusel, Historia, Audio
  guionSintetizado: string;
  cta: string;
  plataformaRecomendada: 'Instagram' | 'TikTok' | 'YouTube Shorts' | 'Facebook' | 'WhatsApp';
  horaSugerida: string;
  productoRelacionado?: string;
  metricaObservar: string;
}

export interface EthicalMonetizationItem {
  id: string;
  nombreProducto: string;
  tipo: 'digital' | 'servicio' | 'comunidad' | 'fisico';
  publicoComprador: string;
  problemaQueResuelve: string;
  queIncluye: string[];
  queNoGarantiza: string; // Rigor ético cristiano
  precioSugeridoPorPais: {
    eeuu: string; // Ej: $17 - $27 USD
    espana: string; // Ej: 15€ - 25€ EUR
    mexico: string; // Ej: $199 - $349 MXN
    chile: string; // Ej: $12.000 - $19.000 CLP
    colombia: string; // Ej: $49.000 - $79.000 COP
    latamGeneral: string; // Ej: $9 - $15 USD
  };
  plataformaVenta: string; // Hotmart, Gumroad, Stan Store, WhatsApp directo, Stripe
  estrategiaPromocion: string;
  riesgosEticos: string;
  formaDeValidarSinGastar: string;
}

export interface ContentRecycledFormats {
  tiktok: string;
  instagramReel: string;
  youtubeShort: string;
  instagramStory: string[];
  carruselSlides: { slideNumber: number; title: string; body: string }[];
  facebookPost: string;
  whatsappMessage: string;
  audioOracionGuion: string;
  emailNewsletter: { subject: string; body: string };
  blogPostSummary: string;
  imagePromptAi: string;
  videoPromptAi: string;
}

export interface StrategicDiagnosisAJ {
  diagnostico: string; // A. Diagnóstico
  publicoObjetivo: string; // B. Público objetivo
  oportunidad: string; // C. Oportunidad
  estrategia: string; // D. Estrategia
  ideasContenido: string[]; // E. Ideas de contenido
  guionesCompletos: ContentStrategyScript17[]; // F. Guiones completos
  productosRelacionados: string[]; // G. Productos o servicios relacionados
  planPublicacion: string; // H. Plan de publicación
  metricas: string[]; // I. Métricas
  proximasAcciones: string[]; // J. Próximas acciones
}

/**
 * Principios éticos fundamentales que rigen cada recomendación, guion y producto.
 */
export const PRINCIPIOS_ETICOS_CRISTIANOS = [
  "Bíblico, respetuoso y esperanzador: basado en las Sagradas Escrituras y el evangelio de Cristo.",
  "Emocional, pero JAMÁS manipulador: no jugar con la vulnerabilidad, dolor o pérdida de las personas.",
  "Cero Teología de la Prosperidad: NUNCA presentar el dinero o la riqueza como recompensa automática de Dios.",
  "Cero Milagros Garantizados en fecha específica: la soberanía de Dios y el amor de Cristo están por encima de fórmulas mágicas.",
  "Sin sacar versículos de contexto: respetar la exégesis y el propósito original del pasaje bíblico.",
  "Respeto interdenominacional: jamás atacar a otras iglesias, denominaciones, religiones ni personas.",
  "Sin miedo, culpa o condenación: construir fe desde la gracia, el amor y la verdad de Dios.",
  "Claridad total en ofertas: explicar qué incluye, qué resuelve, precio transparente y qué NO garantiza."
];

/**
 * Banco maestro de ganchos (<3s) de alta retención sin promesas falsas.
 */
export const BANCO_GANCHOS_ETICOS = [
  { gancho: "Si hoy sientes que tus fuerzas se acabaron, escucha esta breve oración.", categoria: "oracion" },
  { gancho: "Este versículo es el que necesitas leer cuando la ansiedad no te deja dormir.", categoria: "ansiedad" },
  { gancho: "Antes de irte a descansar hoy, entrega esta carga a Dios.", categoria: "noche" },
  { gancho: "Tal vez Dios no te está cerrando la puerta; tal vez te está guardando de un peligro.", categoria: "reflexion" },
  { gancho: "Tres versículos bíblicos que debes memorizar cuando sientas soledad.", categoria: "biblico" },
  { gancho: "Si estás esperando una respuesta de Dios en silencio, no pases este mensaje.", categoria: "esperanza" },
  { gancho: "Lo que este salmo realmente significa para tu familia hoy.", categoria: "ensenanza" },
  { gancho: "Una oración de 30 segundos para comenzar tu mañana con la paz de Cristo.", categoria: "manana" },
  { gancho: "Cuando el dinero falta y la preocupación abruma, Dios nos dejó esta promesa.", categoria: "dificultades" },
  { gancho: "¿Te cuesta concentrarte al orar? Este método bíblico cambió mis mañanas.", categoria: "habito" }
];

/**
 * Banco de Llamadas a la Acción (CTAs) naturales y de comunidad.
 */
export const BANCO_CTAS_ETICAS = [
  "Guarda esta oración para repetirla con calma en tu tiempo a solas con Dios.",
  "Escribe 'amén' si recibes esta palabra con fe en tu corazón.",
  "Comparte este mensaje con un familiar o amigo que hoy necesite consuelo.",
  "Déjame en los comentarios tu motivo de oración y estaré orando por ti hoy.",
  "Sígueme para recibir un versículo y una reflexión bíblica cada día.",
  "Comenta la palabra 'GUÍA' si deseas aprender a estudiar la Biblia paso a paso.",
  "Descarga en el enlace de mi perfil el plan devocional gratuito para tu semana."
];

/**
 * Matriz de Monetización Ética de Productos y Servicios Digitales Cristianos.
 */
export const MATRIZ_MONETIZACION_CRISTIANA: EthicalMonetizationItem[] = [
  {
    id: "devocional_digital_30d",
    nombreProducto: "Devocional Digital Guiado (30 Días de Paz en la Tormenta)",
    tipo: "digital",
    publicoComprador: "Creyentes que sufren de ansiedad, estrés diario o dificultad para tener su tiempo devocional constante.",
    problemaQueResuelve: "Falta de constancia, no saber qué pasaje leer cada día y necesidad de aplicar la Biblia a situaciones reales.",
    queIncluye: [
      "PDF interactivo de 30 lecturas devocionales profundas",
      "Preguntas de reflexión y aplicación personal diaria",
      "Oración modelo para cada mañana y noche",
      "Audios MP3 descargables de 3 minutos por devocional",
      "Plantilla de diario de oración para imprimir o usar en tablet"
    ],
    queNoGarantiza: "No garantiza la desaparición instantánea de problemas externos, sino fortaleza espiritual y comunión con Dios para afrontarlos.",
    precioSugeridoPorPais: {
      eeuu: "$19 USD",
      espana: "17€ EUR",
      mexico: "$299 MXN (~$15 USD)",
      chile: "$14.900 CLP (~$16 USD)",
      colombia: "$59.000 COP (~$15 USD)",
      latamGeneral: "$12 - $15 USD"
    },
    plataformaVenta: "Hotmart / Gumroad / Stan Store con pago en moneda local",
    estrategiaPromocion: "Contenido de confianza con fragmentos de las reflexiones y CTA 'Comenta GUÍA y te envío el primer día gratis'.",
    riesgosEticos: "No prometer curas clínicas de salud mental; aclarar que complementa la atención médica y pastoral.",
    formaDeValidarSinGastar: "Publicar un carrusel de 3 días de devocional gratuito. Si más de 50 personas lo descargan y piden más, crear el de 30 días."
  },
  {
    id: "plan_oracion_familia",
    nombreProducto: "Plan y Diario de Oración por los Hijos y la Familia",
    tipo: "digital",
    publicoComprador: "Padres y madres cristianos que desean interceder con fundamento bíblico por sus hijos y hogar.",
    problemaQueResuelve: "Angustia por la crianza en un mundo difícil, falta de un plan estructurado de oración familiar.",
    queIncluye: [
      "Guía con 40 versículos específicos de protección y sabiduría para hijos",
      "Diario de motivos de oración con registro de respuestas de fe",
      "Tarjetas bíblicas imprimibles para colocar en la habitación de los hijos",
      "Video explicativo de 15 minutos sobre el poder de la bendición de los padres"
    ],
    queNoGarantiza: "No promete que los hijos nunca cometan errores, sino la fidelidad de orar conforme a la voluntad de Dios.",
    precioSugeridoPorPais: {
      eeuu: "$17 USD",
      espana: "15€ EUR",
      mexico: "$249 MXN",
      chile: "$12.500 CLP",
      colombia: "$49.000 COP",
      latamGeneral: "$10 - $12 USD"
    },
    plataformaVenta: "Hotmart / Lemon Squeezy",
    estrategiaPromocion: "Reels sobre dificultades comunes de la maternidad/paternidad y cómo orar versículos específicos.",
    riesgosEticos: "Evitar inducir culpa maternal/paternal. El mensaje debe ser de gracia y descanso en Dios.",
    formaDeValidarSinGastar: "Hacer un live de oración por los hijos o compartir un PDF de 5 versículos. Medir interés antes de maquetar."
  },
  {
    id: "taller_estudio_biblico",
    nombreProducto: "Mini-Curso: Cómo Leer y Entender la Biblia Sin Confundirte",
    tipo: "digital",
    publicoComprador: "Cristianos recién convertidos o personas que llevan años en la iglesia pero les cuesta interpretar la Biblia.",
    problemaQueResuelve: "Sensación de que la Biblia es muy compleja, confusión con el Antiguo Testamento y miedo a malas interpretaciones.",
    queIncluye: [
      "4 módulos en video cortos (10-15 min cada uno)",
      "Método OIA (Observación, Interpretación y Aplicación) explicado de forma sencilla",
      "Guía para elegir traducciones bíblicas según tu necesidad",
      "Plantilla de Notion y PDF para tomar notas de estudio bíblico"
    ],
    queNoGarantiza: "No otorga un título teológico formal ni reemplaza el estudio continuo y la comunidad eclesiástica.",
    precioSugeridoPorPais: {
      eeuu: "$29 - $37 USD",
      espana: "27€ - 35€ EUR",
      mexico: "$499 MXN (~$25 USD)",
      chile: "$24.000 CLP",
      colombia: "$99.000 COP (~$24 USD)",
      latamGeneral: "$19 - $24 USD"
    },
    plataformaVenta: "Hotmart / Kajabi / Skool",
    estrategiaPromocion: "Videos cortos explicando '3 errores comunes al leer el Génesis' o 'Qué significa realmente Mateo 6:33'.",
    riesgosEticos: "Mantenerse fiel al texto bíblico histórico y no imponer dogmas denominacionales divisivos.",
    formaDeValidarSinGastar: "Hacer un taller en vivo gratuito por Zoom de 40 minutos. Si asisten más de 30 personas, ofrecer la grabación ampliada."
  },
  {
    id: "comunidad_oracion_privada",
    nombreProducto: "Círculo de Oración & Discipulado Semanal (Membresía)",
    tipo: "comunidad",
    publicoComprador: "Personas solas, creyentes en el extranjero sin iglesia hispana cercana o creyentes con hambre de compañerismo.",
    problemaQueResuelve: "Soledad espiritual, falta de rendición de cuentas y necesidad de apoyo en oración continua.",
    queIncluye: [
      "Grupo privado y moderado de WhatsApp / Telegram para peticiones de oración",
      "Reunión semanal en vivo de 45 min por Zoom de estudio y oración",
      "Devocional exclusivo de inicio de semana en audio",
      "Acceso a biblioteca de recursos bíblicos y guías"
    ],
    queNoGarantiza: "No sustituye a la congregación local ni asume responsabilidades pastorales sacramentales.",
    precioSugeridoPorPais: {
      eeuu: "$9.99 USD / mes",
      espana: "8.99€ EUR / mes",
      mexico: "$149 MXN / mes",
      chile: "$7.500 CLP / mes",
      colombia: "$29.000 COP / mes",
      latamGeneral: "$6 - $8 USD / mes"
    },
    plataformaVenta: "Patreon / Skool / Hotmart Suscripciones",
    estrategiaPromocion: "Invitar después de videos de oración comunitaria donde muchos comentan peticiones en los comentarios.",
    riesgosEticos: "Proteger la privacidad de los miembros. Moderar estrictamente para evitar estafas o cadenas de mensajes no deseados.",
    formaDeValidarSinGastar: "Abrir un grupo piloto gratuito de 14 días con 20 personas seleccionadas para evaluar compromiso y dinamismo."
  }
];

/**
 * Función generadora del Plan de 7, 30 o 90 Días con equilibrio de los 6 pilares.
 */
export function buildFaithContentPlan(
  days: 7 | 30 | 90,
  dailyHoursAvailable: number = 2,
  primaryCountryFocus: string = 'EE.UU. Latinos y Latinoamérica'
): ContentPlanItem[] {
  const pilares = ['alcance', 'oracion', 'ensenanza', 'comunidad', 'reflexion', 'conversion'] as const;
  const tipos = ['descubrimiento', 'confianza', 'conversion'] as const;

  const catalogVerses = [
    { verse: "Filipenses 4:6-7", topic: "Ansiedad y paz de Dios", hook: "Si la preocupación no te dejó dormir anoche, lee esto antes de empezar tu día." },
    { verse: "Salmos 23:1-3", topic: "Provisión y descanso del alma", hook: "¿Sientes que estás corriendo sin descanso? El Buen Pastor tiene algo para ti hoy." },
    { verse: "Jeremías 29:11", topic: "Planes de bienestar y esperanza", hook: "Cuando todo parece incierto, Dios ya tiene trazado tu mañana." },
    { verse: "Isaías 41:10", topic: "Vencer el temor y la debilidad", hook: "No temas a lo que viene esta semana; la mano de Dios no se ha acortado." },
    { verse: "Mateo 6:33", topic: "Priorizar el Reino y dejar el afán", hook: "Lo que este versículo realmente nos enseña sobre el dinero y el trabajo." },
    { verse: "Salmos 46:1-2", topic: "Dios nuestro amparo y fortaleza", hook: "Tres verdades bíblicas para cuando sientas que tu mundo se tambalea." },
    { verse: "Romanos 8:28", topic: "Propósito en medio de pruebas difíciles", hook: "¿Por qué Dios permite situaciones que duelen tanto? Mira esta respuesta bíblica." },
    { verse: "Proverbios 3:5-6", topic: "Confianza en Dios vs propia lógica", hook: "El error más común al tomar decisiones importantes en la vida cristiana." },
    { verse: "Salmos 91:1-2", topic: "Habitar bajo la sombra del Altísimo", hook: "Haz esta oración de protección bíblica antes de salir de casa." },
    { verse: "1 Pedro 5:7", topic: "Echar toda ansiedad sobre Él", hook: "Una oración de 35 segundos para soltar lo que no puedes controlar." },
    { verse: "Josué 1:9", topic: "Esfuerzo, valentía y presencia de Dios", hook: "Si estás a punto de rendirte en este proyecto o prueba, escucha esto." },
    { verse: "Santiago 1:5", topic: "Pedir sabiduría a Dios sin dudar", hook: "¿Necesitas tomar una decisión difícil? Pide esto a Dios antes de actuar." }
  ];

  const plan: ContentPlanItem[] = [];

  for (let d = 1; d <= days; d++) {
    const pilar = pilares[(d - 1) % pilares.length];
    const tipo = pilar === 'conversion' ? 'conversion' : (pilar === 'alcance' || pilar === 'oracion' ? 'descubrimiento' : 'confianza');
    const vObj = catalogVerses[(d - 1) % catalogVerses.length];

    const formats = ['Reels & TikTok 9:16', 'Carrusel Educativo', 'YouTube Short', 'Historia Diaria'];
    const format = formats[(d - 1) % formats.length];

    const cta = pilar === 'conversion'
      ? "Escribe 'DEVOCIONAL' en comentarios y te comparto el recurso con descuento especial hoy."
      : (pilar === 'oracion' 
          ? "Guarda este video para orar en la noche y comenta tu petición para sumarla a mi oración."
          : (pilar === 'comunidad'
              ? "¿Has vivido una prueba similar? Cuéntamelo en comentarios; leemos cada mensaje con amor."
              : "Sígueme para recibir un mensaje bíblico diario que fortalezca tu fe."));

    const productRel = pilar === 'conversion' 
      ? (d % 2 === 0 ? "Devocional Digital 30 Días de Paz" : "Plan de Oración Familiar")
      : undefined;

    plan.push({
      dia: d,
      tema: `Día ${d}: ${vObj.topic}`,
      categoria: pilar,
      tipo,
      versiculo: vObj.verse,
      gancho: vObj.hook,
      formato: format,
      guionSintetizado: `Gancho <3s: "${vObj.hook}" -> Versículo: ${vObj.verse} explicado en 2 frases -> Aplicación práctica -> ${cta}`,
      cta,
      plataformaRecomendada: (d % 3 === 0 ? 'YouTube Shorts' : (d % 2 === 0 ? 'Instagram' : 'TikTok')),
      horaSugerida: d % 2 === 0 ? "07:00 AM (inicio de jornada)" : "08:30 PM (descanso nocturno)",
      productoRelacionado: productRel,
      metricaObservar: pilar === 'conversion' ? 'Clics en enlace / Mensajes recibidos' : (pilar === 'oracion' ? 'Guardados y comentarios' : 'Retención primeros 5s y Compartidos')
    });
  }

  return plan;
}

/**
 * Recicla una sola idea o versículo en los 12 formatos digitales clave.
 */
export function recycleFaithContentTo12Formats(
  tema: string,
  versiculoRef: string,
  versiculoTexto: string,
  explicacion: string,
  cta: string
): ContentRecycledFormats {
  return {
    tiktok: `[TIKTOK 9:16 - 30s]\nGANCHO (<3s): "Si hoy sientes que la carga es muy pesada, quédate 30 segundos conmigo."\nTEXTO: ${versiculoTexto} (${versiculoRef}).\nAPLICACIÓN: ${explicacion}\nCTA: ${cta}\n#Fe #Oracion #VersiculoDelDia #DiosEsFiel`,
    instagramReel: `[REEL 9:16 - RITMO VISUAL CÁLIDO]\nPORTADA: "Lee esto cuando sientas que no puedes más 🕊️"\nAUDIO: Piano suave sacral 432Hz.\nGUION: "${versiculoTexto}". ${explicacion}.\nCOPY: Guarda este reel para esos momentos donde necesitas recordar que Dios tiene el control. Amén. 🙏`,
    youtubeShort: `[YOUTUBE SHORT 9:16]\nTÍTULO: ${tema} | ${versiculoRef}\nSUBTÍTULOS RESALTADOS EN AMARILLO.\nNARRACIÓN: "No te rindas hoy. La Biblia dice en ${versiculoRef}: '${versiculoTexto}'. Esto nos enseña que ${explicacion}. Suscríbete para tu devocional diario."`,
    instagramStory: [
      `Historia 1 (Pregunta/Encuesta): "¿Te ha costado mantener la paz en esta semana? [Sí, ha sido difícil / Dios me ha sostenido]"`,
      `Historia 2 (El Versículo): Fondo cálido aesthetic con el texto bíblico: "${versiculoTexto}" (${versiculoRef}).`,
      `Historia 3 (Oración guiada): "Señor, pongo mi corazón en tus manos hoy. Llena de paz mi hogar. Amén."`,
      `Historia 4 (Sticker de Enlace / Interacción): "Desliza o toca aquí para recibir el devocional completo de esta semana."`
    ],
    carruselSlides: [
      { slideNumber: 1, title: `Cuando sientas que tus fuerzas se agotan...`, body: "Desliza para leer lo que Dios te dice hoy 👉" },
      { slideNumber: 2, title: `El Versículo Clave`, body: `"${versiculoTexto}" — ${versiculoRef}` },
      { slideNumber: 3, title: `Lo que realmente significa`, body: explicacion },
      { slideNumber: 4, title: `Cómo aplicarlo hoy en 3 pasos`, body: "1. No enfrentes el problema en tus fuerzas.\n2. Ora con honestidad.\n3. Descansa en su fidelidad." },
      { slideNumber: 5, title: `Oración Final`, body: "Señor, gracias porque tu gracia me basta y tu poder se perfecciona en mi debilidad." },
      { slideNumber: 6, title: `¿Fue de bendición?`, body: "Guarda este carrusel para repasarlo y compártelo con alguien que lo necesite hoy." }
    ],
    facebookPost: `"${versiculoTexto}" — ${versiculoRef}\n\nQuerida familia en la fe:\n\n${explicacion}\n\nMuchas veces intentamos resolver todo con nuestras propias capacidades y terminamos agotados. Pero la invitación de Cristo sigue siendo la misma: 'Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar'.\n\n¿Por qué motivo deseas que oremos por ti hoy? Déjanos tu comentario aquí abajo. Los leemos todos y estamos orando juntos como comunidad.\n\nComparte esta bendición en tu muro para llevar esperanza a tus amigos. 🙏✨`,
    whatsappMessage: `🕊️ *Palabra de Aliento para tu Día*\n\n"${versiculoTexto}"\n_${versiculoRef}_\n\n${explicacion}\n\nQue la paz de Dios guarde tus pensamientos y tu familia hoy. Si conoces a alguien pasando por un momento difícil, reenvíale este mensajito de fe. ¡Dios te bendiga! ✨`,
    audioOracionGuion: `(Música de fondo: violonchelo y arpa suave a 432Hz)\n\n"Cierra tus ojos por un momento y respira profundo. Deja de lado por un instante las prisas y la ansiedad.\n\nRecuerda lo que nos enseña la Palabra en ${versiculoRef}: '${versiculoTexto}'.\n\nPadre amado, nos acercamos a Ti sabiendo que no estamos solos. Tú conoces las batallas silenciosas de quien escucha este audio. Te pedimos que derrames de tu paz que sobrepasa todo entendimiento, sanes las heridas del corazón y renueves las fuerzas.\n\nConfiamos en tu fidelidad en el nombre de Jesús. Amén."`,
    emailNewsletter: {
      subject: `🕊️ Para cuando las fuerzas parecen no alcanzar (${versiculoRef})`,
      body: `Hola querido hermano/a,\n\nEspero que estés teniendo una bendecida semana.\n\nQuería escribirte unas líneas directas al corazón hoy con un versículo que ha sido un ancla para mi vida:\n\n"${versiculoTexto}" (${versiculoRef})\n\n${explicacion}\n\nA veces la mayor muestra de fe no es hacer más cosas, sino aprender a descansar en las manos de Dios.\n\nSi necesitas un plan guiado de oración para este mes, recuerda que tenemos disponible nuestro Devocional Digital Guiado de 30 Días con audios y guías prácticas.\n\nPuedes conocerlo aquí: [Enlace]\n\nUn abrazo en Cristo,\nTu comunidad de Fe & Oración.`
    },
    blogPostSummary: `Artículo: "${tema} - Cómo Encontrar Esperanza Bíblica en Momentos de Prueba". Explora el contexto histórico de ${versiculoRef}, el significado de las palabras originales en hebreo/griego y 3 aplicaciones concretas para la familia, el trabajo y las emociones.`,
    imagePromptAi: `Cinematic 9:16 vertical photography, warm morning sunlight streaming through open wooden window onto an open worn Holy Bible with ribbon bookmark, a steaming ceramic mug of tea beside it on a rustic cedar table, peaceful dust motes illuminated by 3400K golden volumetric rays, ultra-realistic 8k depth of field, gentle, holy, serene, peaceful atmosphere.`,
    videoPromptAi: `Cinematic slow 10s push-in vertical 9:16 video: gentle warm volumetric morning light illuminating a person in quiet reflection with hands open in grateful prayer, eyes closed with peaceful expression, soft bokeh background with olive branch and open Scripture, subtle floating golden particles, high-end 35mm film grain, 24fps.`
  };
}
