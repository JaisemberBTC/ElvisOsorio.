/**
 * HABILIDADES DE PRODUCCIÓN PARA MINISERIES FE FLOW
 * Arquitectura narrativa compartida por la interfaz; la generación LLM vive en
 * src/server/miniseriesOpenSourceAgent.ts y puede usar Ollama/API compatible.
 */

export interface MicrofictionSkillRequest {
  ideaCentral: string;
  tono?: string;
  duracionPorEpisodioSec?: number;
  numeroEpisodios?: number;
  personajesConservar?: string;
  publicoPlataforma?: 'TikTok' | 'Instagram Reels' | 'YouTube Shorts' | 'Universal 9:16';
  llamadaAccion?: string;
  noIncluir?: string;
  lockedEnvironmentId?: string;
  bibleReference?: string;
}

export interface MicrofictionQualityControlItem {
  key: string;
  label: string;
  status: 'passed' | 'warning' | 'info';
  detail: string;
}

export interface MicrofictionQualityChecklist {
  ganchoPrimeros3s: MicrofictionQualityControlItem;
  claridadConflicto: MicrofictionQualityControlItem;
  coherenciaGiro: MicrofictionQualityControlItem;
  viabilidadProduccion: MicrofictionQualityControlItem;
  continuidadVisual: MicrofictionQualityControlItem;
  presupuestoFonetico: MicrofictionQualityControlItem;
  potencialCompartir: MicrofictionQualityControlItem;
}

export function buildQualityChecklist(
  scenes: any[],
  hook: string,
  cliffhanger = '',
  durationSec = 50
): MicrofictionQualityChecklist {
  const sceneList = Array.isArray(scenes) ? scenes : [];
  const wordsPerScene = sceneList.map((scene) =>
    (scene?.dialogueExchange || []).reduce((sum: number, turn: any) =>
      sum + String(turn?.dialogueSpanish || '').trim().split(/\s+/).filter(Boolean).length, 0)
  );
  const hookWordCount = String(hook || '').trim().split(/\s+/).filter(Boolean).length;
  const openingScene = sceneList[0];
  const openingTurn = openingScene?.dialogueExchange?.[0];
  const startsAtFrameZero = typeof openingTurn?.timeWindow === 'string'
    && /^00:00(?:\.0)?[–-]/.test(openingTurn.timeWindow.trim());
  const firstSecondHookValid = hookWordCount > 0 && hookWordCount <= 8
    && Boolean(openingScene?.action && openingScene?.camera && openingTurn?.dialogueSpanish)
    && startsAtFrameZero;
  const allScenesHaveVisuals = sceneList.length > 0 && sceneList.every((scene) =>
    Boolean(scene?.action && scene?.environment && scene?.camera)
  );
  const item = (key: string, label: string, status: MicrofictionQualityControlItem['status'], detail: string) => ({ key, label, status, detail });

  return {
    ganchoPrimeros3s: item('hook', 'Hook en el primer segundo', firstSecondHookValid ? 'passed' : 'warning', firstSecondHookValid
      ? `Hook de ${hookWordCount} palabras; hay acción visible desde el primer cuadro y el diálogo inicia en 00:00.0. Confirmar la ejecución al editar.`
      : `Revisar apertura: hook de ${hookWordCount} palabras; requiere acción visible en el cuadro inicial y primera línea temporizada desde 00:00.0 (máximo 8 palabras en el hook).`),
    claridadConflicto: item('conflict', 'Conflicto', sceneList.length >= 2 ? 'info' : 'warning', sceneList.length >= 2 ? 'La secuencia tiene varias escenas para presentar y hacer avanzar el conflicto.' : 'Agrega escenas que expliquen qué está en juego.'),
    coherenciaGiro: item('cliffhanger', 'Giro o cierre', cliffhanger?.trim() ? 'passed' : 'info', cliffhanger?.trim() ? `Cierre declarado: ${cliffhanger}` : 'Revisar que el giro o cliffhanger conecte causalmente con el capítulo siguiente.'),
    viabilidadProduccion: item('duration', 'Duración y estructura', sceneList.length === 5 && durationSec === 50 ? 'passed' : 'warning', `Estructura actual: ${sceneList.length} escenas, ${durationSec} s declarados; la meta Flow es 5 × 10 s = 50 s.`),
    continuidadVisual: item('continuity', 'Continuidad visual', allScenesHaveVisuals ? 'info' : 'warning', allScenesHaveVisuals ? 'Cada escena tiene acción, entorno y cámara; revisar además la biblia de identidad entre planos.' : 'Completa acción, entorno y cámara en cada escena.'),
    presupuestoFonetico: item('dialogue', 'Diálogo por segmento', wordsPerScene.length > 0 && wordsPerScene.every((count) => count >= 19 && count <= 20) ? 'passed' : 'warning', wordsPerScene.length ? `Palabras habladas por escena: ${wordsPerScene.join(', ')}. Meta: 19–20 palabras, dos turnos equilibrados y cerca de 9,2 segundos de voz; Flow puede variar la cadencia.` : 'Todavía no hay diálogos para revisar.'),
    potencialCompartir: item('shareability', 'Valor humano y conversación', 'info', 'Identifica la necesidad emocional, la idea útil y si la historia abre una conversación voluntaria. Contrasta la hipótesis con retención, finalización, compartidos/envíos, guardados y comentarios reales; no inventar resultados ni forzar la participación.')
  };
}

export type FaithVideoFormat = 'auto' | 'first-person-prayer' | 'cinematic-bible' | 'modern-verse-story' | 'hard-faith-question';

export const FAITH_VIDEO_FORMAT_OPTIONS = [
  { id: 'auto', label: 'Recomendar según la idea', description: 'El agente sugiere uno de los cuatro formatos; es una decisión creativa, no una predicción de alcance.' },
  { id: 'first-person-prayer', label: 'Oración en primera persona', description: 'Una persona ora desde su experiencia; no hay voz atribuida a Dios ni promesas de resultado.' },
  { id: 'cinematic-bible', label: 'Miniserie bíblica cinematográfica', description: 'Dramatización humana del pasaje, con contexto y distinción entre Escritura e imaginación.' },
  { id: 'modern-verse-story', label: 'Microhistoria actual conectada a un versículo', description: 'Un dilema cotidiano se conecta con una referencia bíblica verificada o una paráfrasis identificada.' },
  { id: 'hard-faith-question', label: 'Pregunta difícil de fe', description: 'Reflexión compasiva y bíblicamente contextual, sin respuestas simplistas.' }
] as const;

export const FAITH_VIDEO_FORMAT_GUIDANCE: Record<Exclude<FaithVideoFormat, 'auto'>, string> = {
  'first-person-prayer': `FORMATO: ORACIÓN EN PRIMERA PERSONA. Una persona humana ora a Dios con lenguaje natural y concreto, hablando desde su propia experiencia. Si aparece otra voz, debe ser un acompañante humano claramente identificado; nunca la voz de Dios ni de Jesús. No uses una presencia luminosa como prueba de intervención, ni afirmes que ver, comentar o compartir hará que la oración sea respondida.`,
  'cinematic-bible': `FORMATO: MINISERIE BÍBLICA CINEMATOGRÁFICA. Narra desde un punto de vista humano dentro del contexto histórico del pasaje. Mantén los hechos y el sentido del texto; identifica como dramatización cualquier diálogo, pensamiento o detalle no afirmado por la Escritura. No inventes citas, milagros ni desenlaces y no confundas interpretación con texto bíblico.`,
  'modern-verse-story': `FORMATO: MICROHISTORIA ACTUAL CONECTADA A UN VERSÍCULO. Cuenta una situación cotidiana reconocible y muestra una respuesta plausible, sin resolver mágicamente el problema. Explica con claridad la conexión con el pasaje. Añade durante la edición la referencia bíblica; muestra una cita textual solo si la traducción fue verificada y elegida, de lo contrario presenta una paráfrasis rotulada o solo la referencia.`,
  'hard-faith-question': `FORMATO: PREGUNTA DIFÍCIL DE FE. Abre con la duda formulada con compasión, escucha antes de responder y trabaja un pasaje en contexto. Reconoce lo que el texto no resuelve; no diagnostiques, culpes a quien sufre ni ofrezcas una respuesta teológica discutible como consenso universal.`
};

export const FAITH_VIDEO_FORMAT_FLOW_DIRECTIONS_EN: Record<Exclude<FaithVideoFormat, 'auto'>, string> = {
  'first-person-prayer': 'FIRST-PERSON PRAYER: One human character prays to God in natural first-person language from a concrete lived experience. Any second voice must be a clearly identified human companion, never God or Jesus. Do not imply a supernatural presence, guaranteed answer, or platform action that secures a blessing.',
  'cinematic-bible': 'CINEMATIC BIBLICAL MINISERIES: Re-enact the requested passage from a human point of view with period-appropriate detail. Preserve the meaning and stated events of Scripture. Treat any invented dialogue, thought, or unstated detail as dramatization, never as a Bible quotation. Do not invent miracles or outcomes.',
  'modern-verse-story': 'MODERN STORY CONNECTED TO A BIBLE VERSE: Show a recognizable present-day situation and a plausible response without magically solving the problem. Make the connection to the passage clear. Add the Bible reference in post; use an exact quotation only after verifying the selected translation, otherwise identify a paraphrase or show the reference alone.',
  'hard-faith-question': 'DIFFICULT QUESTION OF FAITH: Open compassionately with the question, listen before answering, and consider a Bible passage in context. Acknowledge what the text does not resolve. Do not diagnose, blame the person who suffers, or present a disputed interpretation as universal consensus.'
};

export const FAITH_VIDEO_EXPERIMENT_NOTE = 'La frecuencia de publicación es una decisión editorial, no una regla de ranking. Una publicación diaria durante 21 días puede usarse como sprint experimental opcional; registrar resultados reales, comparar videos de antigüedad semejante y cambiar una variable principal por prueba. No prometer viralidad ni recomendar 1–2 videos diarios durante 60 días como fórmula algorítmica.';

export const SHAREABILITY_RULE = `REGLA EDITORIAL DE VALOR HUMANO Y APRENDIZAJE (OBLIGATORIA)
Parte de una necesidad concreta de una persona reconocible. Usa emoción auténtica —tensión moral, empatía, pérdida, alivio, asombro o esperanza— y entrega una idea clara sobre Dios o un paso útil, sin exagerar el dolor ni convertirlo en espectáculo.
La participación debe nacer de una pregunta que valga la pena conversar. Toda invitación a comentar, guardar o compartir es opcional; nunca condicione la fe, la protección o la bendición de Dios a una acción en la plataforma. No uses vergüenza, miedo, falsa urgencia espiritual ni “comenta Amén” como prueba de fe. Evita pedir likes, comentarios o compartidos solo para aumentar la distribución; no prometas dopamina, viralidad ni tasas de retención.
Repite el ciclo idea → video → medición → aprendizaje. Cuando haya datos reales, revisa retención en 0–1 s y 0–3 s, tiempo promedio, finalización, compartidos/envíos, guardados y comentarios. Compara publicaciones con antigüedad y distribución semejantes; una muestra pequeña o publicación reciente no demuestra una tendencia. Sin datos suficientes, declara hipótesis. Si la caída más temprana aparece en el primer segundo, prueba cambiar solo el primer cuadro o la primera frase antes de rehacer el capítulo.`;

export const BIBLICAL_VIDEO_CREATION_RULE = `CONFIGURACIÓN DE CREACIÓN — MICRODRAMAS CONTEMPORÁNEOS DE FE Y RELATOS BÍBLICOS
POSICIONAMIENTO: no supongas que el nicho cristiano o las historias bíblicas están saturados; la evidencia pública disponible es limitada. Prueba como hipótesis ángulos que acompañen problemas presentes: una decisión moral difícil, duelo/duda/cansancio sin promesas fáciles, o un gesto cotidiano de fe. Si la persona pide una historia bíblica, busca un detalle, una pregunta o una consecuencia menos obvia, sin distorsionar el pasaje.
MENSAJE: la persona debe poder decir qué enseña la historia acerca de Dios o de la fe. Vincula ese mensaje con una situación actual y una referencia pertinente. Distingue texto bíblico, interpretación y dramatización; nunca inventes citas, hechos, milagros o promesas. No culpes a quien sufre ni presentes la fe como una fórmula para obtener sanidad, dinero o reconciliación.
HOOK Y EMOCIÓN: abre con una decisión, anomalía o gesto visible desde el cuadro 0 y di la primera palabra antes de 0,3 s. Sin saludo, introducción académica, fundido, tarjeta ni logotipo. Máximo ocho palabras en el hook. Construye tensión emocional honesta, curiosidad y una recompensa espiritual clara; no sensacionalices el dolor ni prometas reacciones psicológicas o resultados de plataforma.
ENFOQUES NARRATIVOS: (1) “La decisión que nadie ve”: dilema actual y costo real; (2) acompañamiento de duelo, duda o agotamiento, sin solución mágica; (3) fe expresada en una acción cotidiana; (4) cuando se solicite, una perspectiva bíblica menos obvia, fiel al contexto. Estos enfoques no son lo mismo que el formato de video.
FORMATOS DISPONIBLES: (1) oración en primera persona; (2) miniserie bíblica cinematográfica; (3) microhistoria actual conectada a un versículo; (4) pregunta difícil de fe. Respeta la elección del usuario y cambia una variable creativa por prueba; ningún formato garantiza alcance.
ESTRUCTURA PARA ESTE PROYECTO: conserva exactamente 50 s por capítulo (cinco segmentos Flow autónomos de 10 s). Distribuye la historia así: 0–1 s acción y frase gancho; 1–10 s problema humano concreto; 10–30 s escalada y riesgo; 30–40 s significado bíblico aplicado con fidelidad; 40–50 s transformación plausible y cierre. Cada segmento abre con información visual nueva desde el cuadro 0; no resuelvas el arco total de una miniserie en un solo capítulo.
CTA ÉTICO: puede haber una pregunta reflexiva opcional en el copy, nunca una exigencia dentro del video. No pidas comentar “Amén”, compartir o guardar como condición para recibir la bendición, mostrar fe o evitar un daño.
PRODUCCIÓN VISUAL Y SONORA: vertical 9:16; actuación humana, cercana y cinematográfica; dentro de cada toma continua, introduce cambio visual perceptible cada 2–4 s mediante gesto, mirada, acción, foco o movimiento motivado. Mantén identidad visual coherente. Dirige voces cálidas, articuladas y naturales, con respiración y pausas solo cuando sirvan al sentido; evita la cadencia robótica. Añade subtítulos completos, legibles, sincronizados y revisados en edición; música instrumental original debajo de la voz. El texto bíblico en pantalla se incorpora en edición, no se pide al generador visual.
PUBLICACIÓN: títulos y miniaturas veraces, sin clickbait; no publiques ni cambies cuentas automáticamente. La frecuencia no es una regla de ranking; si se propone un sprint de 21 días, es solo una prueba editorial. Las hipótesis creativas no equivalen a resultados comprobados ni garantizan viralidad.`;

const commonFormat = `FORMATO DE ENTREGA OBLIGATORIO
- De 2 a 5 capítulos, elegidos por el usuario.
- Cada capítulo dura exactamente 50 segundos: cinco prompts Flow autónomos de diez segundos.
- Escribe en inglés todas las instrucciones de producción que irán a Flow; conserva el diálogo hablado literal en español latinoamericano natural. Mantén en español los títulos, captions y metadatos SEO. Cada prompt incluye acción, personajes presentes, entorno, cámara, lente, movimiento, luz, actuación, diálogo literal, voces, música original, SFX, ambiente, subtítulo sugerido y restricciones.
- Repite en los cinco prompts la biblia necesaria para que cada segmento funcione si se pega por separado en Flow.
- Reparte diálogo natural entre dos personajes visibles: 19–20 palabras habladas por segmento, normalmente 9–11 por turno. En el primer segmento, el hook (máximo ocho palabras) abre literalmente la primera intervención, que comienza en 00:00.0; evita una introducción muda o aceleración artificial.
- Mantén rostro, edad aparente, piel, cabello, vestuario, accesorios, voz, escenario, utilería, luz, paleta y eje de cámara entre capítulos.
- Personajes humanos hiperrealistas en live-action, con actuación natural; no caricatura ni estética 3D.
- Planifica el arco completo antes de escribir: objetivo, conflicto, escalada, revelación y cliffhanger de cada capítulo, todos causalmente conectados.
- La música instrumental debe ser original para cada serie, tener un motivo reconocible y variar según la emoción. Incluir efectos y mezcla bajo el diálogo.
- Añade SEO individual por capítulo: títulos para TikTok, Facebook y YouTube Shorts, caption, palabras clave, hashtags, hook de portada y comentario fijado.
- Trata los versículos con cuidado: distingue referencia, cita textual verificada y paráfrasis. No inventes citas ni prometas milagros garantizados.
- Usa recursos narrativos generales (problema inmediato, curiosidad, escalada, revelación, continuidad); no copies personajes, frases, música, tramas, imágenes, marcas ni estética distintiva de otros creadores.
- Elige explícitamente un enfoque: dilema moral contemporáneo, acompañamiento ante dolor/duda/cansancio, gesto cotidiano de fe o perspectiva bíblica contextual cuando se solicite. Deja claro el mensaje sobre Dios sin confundirlo con una cita no verificada.
- Elige explícitamente uno de los cuatro formatos disponibles y sigue su guía específica: oración en primera persona, miniserie bíblica cinematográfica, microhistoria actual conectada a un versículo o pregunta difícil de fe. No los presentes como formatos “más virales”.
- La interacción es invitación voluntaria; no la condiciona a la fe, a un milagro ni a la bendición. Evita “comenta Amén” como prueba espiritual, culpa, amenaza o urgencia religiosa.
${BIBLICAL_VIDEO_CREATION_RULE}
${SHAREABILITY_RULE}
- Diseña para retención; no prometas porcentajes, viralidad ni resultados analíticos que no se hayan medido. Compara videos con edad de publicación semejante y trata las muestras pequeñas como señales no concluyentes.
`;

export const SKILL_PRODUCTION_ARCHITECTURE = {
  id: 'skill_production_architecture',
  name: 'Arquitectura de Producción y Continuidad Flow',
  source: 'FeFlow Open Agent',
  badge: 'Flow 9:16 · 50 s',
  version: '4.0.0',
  description: 'Organiza 2–5 capítulos de 50 segundos en cinco prompts Flow autosuficientes de 10 segundos, con biblia visual, sonora y de continuidad.',
  rawPromptText: `Eres arquitecto de producción de miniseries verticales. Antes de escribir escenas, fija una biblia de personajes, entorno, utilería, color, cámara, voces y música. Planifica el arco completo de 2–5 capítulos y luego divide cada capítulo en cinco prompts independientes de diez segundos. Repite las anclas de continuidad en cada prompt; cada prompt debe poder usarse por sí solo en Flow.\n\n${commonFormat}`
};

export const SKILL_MICROFICTION_SCRIPT_ENGINE = {
  id: 'skill_microfiction_script_engine',
  name: 'Guionista de Microficción de Fe',
  source: 'FeFlow Open Agent',
  badge: 'Hook · Escalada · Resolución',
  version: '4.0.0',
  description: 'Escribe dramas originales de fe, oración y esperanza con una apertura inmediata, diálogo latinoamericano y cliffhangers causales.',
  rawPromptText: `Escribe una miniserie original de fe, oración y esperanza para video vertical. Abre en medio de una anomalía, una pérdida o una decisión durante los primeros dos segundos. Expón pronto quién necesita qué y qué puede perder. Dosifica la información, cambia la tensión o revela un detalle cada cinco a ocho segundos, y termina cada capítulo con una consecuencia pendiente. Resuelve el arco final con esperanza plausible y acciones observables, sin garantizar milagros ni simplificar el dolor.\n\n${commonFormat}`
};

export const SKILL_FAST_PROMPT_TEMPLATE = {
  id: 'skill_fast_prompt_template',
  name: 'Formulación de Historia y Disparo Rápido',
  source: 'FeFlow Open Agent',
  badge: 'Tema → Miniserie',
  version: '4.0.0',
  description: 'Formatea un tema, versículo y elenco para el agente abierto; la cantidad de capítulos se limita a 2–5 y cada uno dura 50 segundos.',
  rawPromptText: `Usa esta entrada para crear la miniserie completa. Primero fija continuidad y arco; después entrega cinco prompts Flow autónomos por capítulo y su paquete SEO.\n\n${commonFormat}`,
  formatTemplate: (req: MicrofictionSkillRequest): string => {
    const topic = req.ideaCentral.trim() || 'Una familia encuentra esperanza al enfrentar una verdad difícil';
    const tone = req.tono || 'humano, reverente, cinematográfico y emocional sin manipulación';
    const episodes = Math.max(2, Math.min(5, Math.round(Number(req.numeroEpisodios) || 3)));
    const chars = req.personajesConservar || 'Define dos personajes humanos adultos, con identidad visual, vestuario y voz constantes';
    const audience = req.publicoPlataforma || 'Universal 9:16';
    const exclusions = req.noIncluir || 'violencia gráfica, lenguaje vulgar, textos ilegibles, caricatura, promesas de milagros garantizados';
    const cta = req.llamadaAccion || 'Pregunta reflexiva suave, solo en el copy SEO';
    const verse = req.bibleReference || 'Propón una referencia temática; no cites literalmente si no está verificada';
    return `TEMA: ${topic}\nTONO: ${tone}\nREFERENCIA BÍBLICA: ${verse}\nCAPÍTULOS: ${episodes}\nDURACIÓN: 50 segundos por capítulo, cinco prompts de 10 segundos\nELENCO: ${chars}\nPLATAFORMA: ${audience}\nCTA: ${cta}\nNO INCLUIR: ${exclusions}\n\n${commonFormat}`;
  },
  suggestedPresets: [
    {
      title: 'El costo de decir la verdad',
      topic: 'Una persona recibe presión en el trabajo para firmar un informe incorrecto y su fe la enfrenta al costo de decir la verdad.',
      tone: 'dilema moral actual, tensión íntima, fe y consecuencias realistas',
      characters: 'Lucía (34 años, cabello castaño ondulado, suéter terracota); Tomás (38 años, barba de dos días, chaqueta azul marino)',
      noInclude: 'violencia gráfica, insultos, represalias milagrosamente resueltas, cita bíblica no verificada'
    },
    {
      title: 'Una oración en la sala de espera',
      topic: 'Durante una larga noche de hospital, dos hermanos deben decirse una verdad que llevan años evitando.',
      tone: 'drama humano, oración, tensión contenida y esperanza',
      characters: 'Marina (36 años, cabello negro recogido); Andrés (40 años, camisa gris y reloj antiguo)',
      noInclude: 'diagnósticos inventados, burla a la medicina, promesas de curación'
    },
    {
      title: 'La llamada que nadie esperaba',
      topic: 'Un padre ausente llama después de años y pide conversar; su hija decide qué límites necesita antes de responder.',
      tone: 'reconciliación gradual, misterio emocional, fe cotidiana',
      characters: 'Elena (32 años, cabello corto, chaqueta verde); Rafael (58 años, cabello canoso, camisa de trabajo)',
      noInclude: 'perdón obligatorio, manipulación emocional, soluciones instantáneas'
    },
    {
      title: 'La deuda a la luz del día',
      topic: 'Una familia descubre una deuda oculta y debe elegir entre culpar a alguien o pedir ayuda con honestidad.',
      tone: 'suspenso cotidiano, decisiones morales, consuelo',
      characters: 'Camila (35 años, blusa azul); Julián (37 años, suéter gris); Inés (60 años, chal vino)',
      noInclude: 'violencia gráfica, estereotipos, promesas de riqueza milagrosa'
    },
    {
      title: 'El primer paso para pedir perdón',
      topic: 'Dos hermanas se reencuentran en la cocina de su madre después de una discusión que cambió la familia.',
      tone: 'íntimo, espiritual, cálido y realista',
      characters: 'Sara (29 años, cabello rizado oscuro); Paula (33 años, cabello negro largo)',
      noInclude: 'borrado de límites personales, reconciliación forzada, citas bíblicas inventadas'
    }
  ]
};
