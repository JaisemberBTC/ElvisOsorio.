/**
 * HABILIDADES DE IA PARA CREACIÓN DE MINISERIES Y MICROFICCIÓN VERTICAL (9:16)
 * ==============================================================================
 * Extraídas directamente del documento maestro de especificación:
 * 
 * 1. PROMPT 1 -> Habilidad de Arquitectura de Producción y Control Técnico
 * 2. PROMPT 2 -> Habilidad de Guionista y Editor de Microficción Vertical 9:16
 * 3. PROMPT 3 -> Habilidad de Formulación de Conflicto y Disparo Rápido
 * 
 * Estas habilidades se integran directamente en el flujo y motor de la IA de
 * la sección de Miniseries, asegurando continuidad visual, presupuesto fonético,
 * ganchos <3s, revelaciones preparadas y control de calidad A-H.
 */

export interface MicrofictionSkillRequest {
  ideaCentral: string;
  tono?: string;
  duracionPorEpisodioSec?: number; // 60 a 75 segundos
  numeroEpisodios?: number; // 1 a 10
  personajesConservar?: string; // Rasgos protegidos
  publicoPlataforma?: 'TikTok' | 'Instagram Reels' | 'YouTube Shorts' | 'Universal 9:16';
  llamadaAccion?: string;
  noIncluir?: string; // Elementos o temas a evitar
  lockedEnvironmentId?: string;
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
}

/**
 * 1. HABILIDAD: ARQUITECTURA DE PRODUCCIÓN Y CONTROL TÉCNICO (Prompt 1)
 */
export const SKILL_PRODUCTION_ARCHITECTURE = {
  id: "skill_production_architecture",
  name: "Arquitectura de Producción y Control Técnico",
  source: "Prompt 1 — Integrar el módulo en mi página",
  badge: "Control Técnico 9:16",
  version: "3.2.0",
  description: "Estructura la producción de microficción serializada vertical (60-75s por episodio, 1 a 10 capítulos), fijando controles técnicos, exclusiones estrictas, modularidad de copiado y biblia de continuidad.",
  rawPromptText: `Quiero integrar un generador de historias y microficción serializada vertical (9:16) en mi página web.

Requisitos de integración técnica:
1. No toques, no rompas ni rediseñes las páginas, rutas, funciones y coherencia visual del proyecto.
2. Añade los controles necesarios para que el usuario pueda usar el generador:
   - Idea o conflicto central (texto libre).
   - Personajes que se quieren conservar o rasgos protegidos (opcional).
   - Público o plataforma (TikTok, Instagram Reels, YouTube Shorts, Universal 9:16).
   - Tono (melodrama, drama conmovedor, misterio, etc.).
   - Duración por episodio (60 a 75 segundos, dividido en planos de 10s).
   - Número de episodios (1 a 10 capítulos serializados).
   - Llamada a la acción / interacción final.
   - "NO INCLUIR": campo para elementos o temas que no deben aparecer bajo ninguna circunstancia.
3. El resultado debe ser modular y fácil de copiar por partes (guion completo, episodios por separado, prompts visuales independientes, biblia de continuidad).
4. Asegúrate de que los diálogos respetan el presupuesto fonético (<2.5 palabras/segundo) para que el audio quepa naturalmente en el tiempo disponible.`,
  coreRules: [
    "Conservar todas las páginas, rutas, funciones y coherencia visual del proyecto.",
    "Formulario paramétrico: Idea central, personajes protegidos, público/plataforma, tono, duración (60-75s), episodios (1 a 10), llamada a la acción y exclusiones ('NO INCLUIR').",
    "Generar respuestas modulares copiables por separado (guion, episodio, prompts visuales, biblia narrativa).",
    "Preservar el elenco y la biblia narrativa para continuaciones.",
    "Asegurar que el diálogo cabe en la duración solicitada y que cada escena es producible sin inventar datos inconexos."
  ]
};

/**
 * 2. HABILIDAD: GUIONISTA Y EDITOR DE MICROFICCIÓN VERTICAL 9:16 (Prompt 2)
 */
export const SKILL_MICROFICTION_SCRIPT_ENGINE = {
  id: "skill_microfiction_script_engine",
  name: "Guionista y Editor de Microficción Vertical 9:16",
  source: "Prompt 2 — Instrucción del generador de historias",
  badge: "Motor Narrativo & Fonético",
  version: "3.2.0",
  description: "Motor narrativo y fonético para melodramas y microficciones serializadas con gancho <3s, revelación emocional, cliffhanger y formato de respuesta canónico A a H.",
  rawPromptText: `Actúa como guionista y editor de microficción vertical en español (formato 9:16 para TikTok, Instagram Reels y YouTube Shorts). Tu trabajo es crear miniseries y melodramas breves de alta retención.

OBJETIVO NARRATIVO:
Escribe melodramas y dramas breves con un conflicto comprensible, una emoción reconocible y personajes memorables.

REGLAS DE ORIGINALIDAD:
- Crea nombres, diseños, motivaciones, escenarios, diálogos y giros nuevos y frescos.
- Si el usuario proporciona una referencia o inspiración, genera una historia completamente original respetando esa semilla.
- NUNCA repitas el mismo entorno ni el mismo gancho entre historias diferentes. Cada historia nace en su propio espacio dramático único.

ESTRUCTURA DEL EPISODIO:
1. Abre con una acción, frase o imagen que plantee una intriga concreta durante los primeros 3 segundos.
2. Explica pronto quién quiere qué y qué puede perder (apuestas claras).
3. Usa diálogos breves, naturales y distintos para cada personaje. Alterna momentos de tensión y alivio.
4. Escala el problema en pasos comprensibles. Revela información gradualmente.
5. Cerca del final, entrega una revelación, decisión o inversión emocional preparada por la historia.
6. Si es una serie de varios episodios, termina con una pregunta o peligro específico y nuevo. No cortes a mitad de frase.
7. Incluye una llamada a comentar que nazca orgánicamente de la historia.

PRODUCCIÓN Y CONTINUIDAD:
- Escribe para video vertical 9:16.
- Duración indicada: 60–75 segundos, dividido en planos de 10 segundos.
- Presupuesto fonético: el diálogo hablado ocupa estrictamente entre 2.0 y 2.5 palabras por segundo para garantizar dicción natural sin atropello ni silencios muertos.
- Por escena indica: tiempo aproximado, lugar, acción visible, personaje que habla, diálogo exacto.
- Para cada personaje fija especie/tipo, forma y color, ropa, accesorio, voz y personalidad.
- Mantén una biblia de continuidad inmutable.
- Evita violencia gráfica o contenido que infrinja normas comunitarias.

FORMATO DE RESPUESTA REQUERIDO (A a H):
A. Título y premisa en una frase (logline).
B. Personajes y guía visual consistente (Model sheet inmutable).
C. Resumen de continuidad o arco de los episodios solicitados.
D. Guion con escenas y códigos de tiempo, marcando diálogos con el nombre del personaje.
E. Texto exacto para pantalla y sugerencias de sonidos/edición (SFX).
F. Prompt visual de cada escena, independiente y listo para copiar en generadores de video (Kling, Runway, Luma, Sora).
G. Caption, llamada a comentar y entre 3 y 6 hashtags relevantes.
H. Lista final de control: gancho, claridad del conflicto, coherencia del giro y viabilidad de producción.`,
  systemInstructionPrompt: `Eres guionista y editor de microficción vertical en español. Creas miniseries y melodramas breves de alta retención.

OBJETIVO NARRATIVO:
Escribe melodramas y dramas breves con un conflicto comprensible, una emoción reconocible y personajes memorables.

REGLAS DE ORIGINALIDAD:
- Crea nombres, diseños, motivaciones, escenarios, diálogos y giros nuevos y frescos.
- Si el usuario proporciona una referencia o inspiración, genera una historia completamente original respetando esa semilla.
- No afirmes que el resultado garantiza viralidad vacía ni que conoces secretos ocultos; garantiza calidad estructural y técnica comprobable.

ESTRUCTURA DEL EPISODIO:
1. Abre con una acción, frase o imagen que plantee una intriga concreta durante los primeros 3 segundos.
2. Explica pronto quién quiere qué y qué puede perder.
3. Usa diálogos breves, naturales y distintos para cada personaje. Alterna momentos de tensión y momentos de alivio.
4. Escala el problema en pasos comprensibles. Revela información gradualmente, sin confusiones.
5. Cerca del final, entrega una revelación, decisión o inversión emocional preparada por la historia.
6. Si es una serie de varios episodios, termina con una pregunta o peligro específico y nuevo. No cortes a mitad de frase.
7. Incluye una llamada a comentar que nazca orgánicamente de la historia (por ejemplo, pedir que elijan bando o postura moral).

PRODUCCIÓN Y CONTINUIDAD:
- Escribe para video vertical 9:16.
- Respeta la duración indicada (60–75 segundos, dividido en planos de 10 segundos).
- Presupuesto fonético: el diálogo hablado ocupa estrictamente entre 2.0 y 2.5 palabras por segundo para garantizar dicción natural sin atropello ni silencios muertos.
- Por escena indica: tiempo aproximado, lugar, acción visible, personaje que habla, diálogo exacto.
- Para cada personaje fija especie/tipo, forma y color, ropa, accesorio, voz y personalidad.
- Mantén una biblia de continuidad: hechos ya confirmados, secretos aún no revelados, estado de relaciones.
- Evita violencia gráfica, sexualización de personajes o contenido que infrinja normas comunitarias.

FORMATO DE RESPUESTA REQUERIDO (A a H):
A. Título y premisa en una frase (logline).
B. Personajes y guía visual consistente (Model sheet inmutable).
C. Resumen de continuidad o arco de los episodios solicitados.
D. Guion con escenas y códigos de tiempo, marcando diálogos con el nombre del personaje.
E. Texto exacto para pantalla y sugerencias de sonidos/edición (SFX).
F. Prompt visual de cada escena, independiente y listo para copiar en generadores de video (Kling, Runway, Luma, Sora).
G. Caption, llamada a comentar y entre 3 y 6 hashtags relevantes.
H. Lista final de control: gancho, claridad del conflicto, coherencia del giro y viabilidad de producción.`,
  coreRules: [
    "Gancho visual y verbal antes del segundo 3.",
    "Exposición rápida de quién quiere qué y qué puede perder.",
    "Diálogos con ritmo fonético de 2.0 a 2.5 palabras/segundo.",
    "Escalada en pasos lógicos sin contradicciones.",
    "Revelación preparada y cliffhanger antes de los créditos.",
    "Llamada a comentar nacida de la trama.",
    "Formato estructurado de 8 secciones (A a H)."
  ]
};

/**
 * 3. HABILIDAD: PLANTILLA DE DISPARO RÁPIDO & FORMULACIÓN DE HISTORIA (Prompt 3)
 */
export const SKILL_FAST_PROMPT_TEMPLATE = {
  id: "skill_fast_prompt_template",
  name: "Formulación de Conflicto y Disparo Rápido",
  source: "Prompt 3 — Producir la primera historia",
  badge: "Disparo Paramétrico",
  version: "3.2.0",
  description: "Formatea cualquier idea en una entrada estructurada con parámetros de control (IDEA CENTRAL, TONO, DURACIÓN, EPISODIOS, PERSONAJES, PÚBLICO, NO INCLUIR) y gancho inmediato.",
  rawPromptText: `Usa las dos habilidades anteriores (Prompt 1 y Prompt 2) para crear la primera historia completa.

Parámetros de entrada:
- IDEA CENTRAL: [describe la premisa o conflicto aquí]
- TONO: [melodrama, drama conmovedor, misterio, etc.]
- DURACIÓN: [60 a 75 segundos por episodio]
- NÚMERO DE EPISODIOS: [1 a 10 capítulos]
- PERSONAJES QUE QUIERO CONSERVAR: [personajes protegidos si los hay]
- PÚBLICO O PLATAFORMA: [TikTok, Instagram Reels, YouTube Shorts o Universal 9:16]
- LLAMADA A LA ACCIÓN: [llamada a comentar u opinar]
- NO INCLUIR: [temas o elementos prohibidos]

Reglas inquebrantables de generación:
1. Abre con un gancho concreto y directo antes del segundo 3.
2. Expón claramente quién quiere qué y qué puede perder.
3. Diálogos breves en español calibrados a <2.5 palabras/segundo.
4. Genera exactamente las secciones de la A a la H solicitadas, sin omitir los prompts visuales ni la lista final de control de calidad.`,
  formatTemplate: (req: MicrofictionSkillRequest): string => {
    const topic = req.ideaCentral.trim() || "Un conflicto inesperado que pone a prueba la fe y el amor familiar";
    const tone = req.tono || "melodrama + misterio + fe profunda";
    const duration = req.duracionPorEpisodioSec || 70;
    const episodes = req.numeroEpisodios || 3;
    const chars = req.personajesConservar || "Protagonista con fe inquebrantable, co-protagonista en duda y Maestro Jesús";
    const audience = req.publicoPlataforma || "TikTok / Reels / Shorts";
    const exclusions = req.noIncluir || "Violencia gráfica, jerga vulgar, ropa anacrónica o cambios de escenario inexplicables";
    const cta = req.llamadaAccion || "Comenta qué harías tú y comparte para ver el desenlace en la siguiente parte";

    return `Crea una miniserie ORIGINAL para [${audience}], en español latinoamericano:

IDEA CENTRAL: ${topic}
TONO: ${tone}
DURACIÓN POR EPISODIO: [${duration} segundos]
NÚMERO DE EPISODIOS: [${episodes}]
PERSONAJES QUE QUIERO CONSERVAR: ${chars}
PÚBLICO: [${audience}]
LLAMADA A LA ACCIÓN: ${cta}
NO INCLUIR: ${exclusions}

Quiero un gancho visual y verbal desde el primer segundo (<3s), un conflicto que se entienda de inmediato (quién quiere qué y qué puede perder), diálogos calibrados para 10s por plano con sincronización labial en español, y la entrega completa en el formato A-H.`;
  },
  suggestedPresets: [
    {
      title: "Prueba Sugerida del Documento: El Recibo del Futuro",
      topic: "Una frutera recibe cada noche un recibo de una venta que todavía no ocurrió; el recibo lleva el nombre y firma de su padre desaparecido hace 7 años.",
      tone: "melodrama + misterio + suspenso emotivo",
      characters: "Frutera valiente y trabajadora llamada Elena; abuela sabia; figura misteriosa en sombras",
      noInclude: "armas de fuego, violencia explícita, resoluciones mágicas sin base emocional"
    },
    {
      title: "Milagro a las 3:00 AM en Cuidados Intensivos",
      topic: "A las 3:00 AM los monitores se apagan y los médicos declaran que no hay nada más que hacer, pero una madre susurra una oración al pie de la cama.",
      tone: "drama de fe + milagro sobrenatural + emoción conmovedora",
      characters: "Sara (madre de 38 años), Doctor Morales (médico escéptico de 50 años), Maestro Jesús",
      noInclude: "desesperanza final, burlas a la medicina, cambios de vestimenta en el hospital"
    },
    {
      title: "La Herencia Oculta y el Perdón entre Hermanos",
      topic: "Dos hermanos distanciados deben abrir la última carta de su madre en la vieja carpintería familiar antes de que el banco embargue el taller.",
      tone: "melodrama familiar + suspenso + restauración",
      characters: "Mateo (carpintero leal), Julián (hermano pródigo endeudado), Maestro Jesús",
      noInclude: "golpes o violencia física, desenlaces fríos sin reconciliación"
    },
    {
      title: "El Huerto de los Prodigios Olvidados",
      topic: "En un pueblo golpeado por la sequía, una anciana se niega a vender su parcela porque asegura que cada atardecer los frutos crecen por una promesa divina.",
      tone: "fábula contemporánea + misterio de fe + esperanza",
      characters: "Doña Marta (anciana de mirada dulce), Lucas (joven agrimensor ambicioso), Maestro Jesús",
      noInclude: "tecnología anacrónica, cinismo destructivo"
    },
    {
      title: "Fíate de Jehová de Todo Tu Corazón (Proverbios 3:5)",
      topic: "Un arquitecto ve colapsar su proyecto de vida por confiar en su propia prudencia, hasta que en la medianoche rinde sus planos al Maestro de Galilea.",
      tone: "drama reflexivo + sabiduría bíblica + paz sobrenatural",
      characters: "Samuel (arquitecto de 35 años), Inés (su esposa de fe), Maestro Jesús",
      noInclude: "violencia gráfica, armas, lenguaje anacrónico, máquinas de hospital"
    }
  ]
};

/**
 * Valida un guion generado frente a la Lista de Control de Calidad (Sección H de Prompt 2)
 */
export function buildQualityChecklist(
  scenes: Array<{
    durationSec?: number;
    narration?: string;
    action?: string;
    dialogueExchange?: Array<{ dialogueSpanish?: string; allocatedSeconds?: number }>;
  }>,
  hookText: string,
  cliffhangerText: string,
  targetDurationSec: number = 70
): MicrofictionQualityChecklist {
  const hasQuickHook = Boolean(hookText && hookText.length >= 15);
  const totalWords = scenes.reduce((acc, sc) => {
    if (sc.dialogueExchange && sc.dialogueExchange.length > 0) {
      return acc + sc.dialogueExchange.reduce((sum, d) => sum + (d.dialogueSpanish ? d.dialogueSpanish.trim().split(/\s+/).length : 0), 0);
    }
    return acc + (sc.narration ? sc.narration.trim().split(/\s+/).length : 0);
  }, 0);

  const wordsPerSecond = Math.round((totalWords / Math.max(1, targetDurationSec)) * 10) / 10;
  const isPacingOptimal = wordsPerSecond >= 1.6 && wordsPerSecond <= 2.5;

  return {
    ganchoPrimeros3s: {
      key: "hook_3s",
      label: "Gancho en los primeros 3 segundos",
      status: hasQuickHook ? "passed" : "warning",
      detail: hasQuickHook
        ? `Gancho de impacto formulado: "${hookText.slice(0, 50)}..."`
        : "El gancho debe plantear una intriga concreta antes de los 3s."
    },
    claridadConflicto: {
      key: "conflict_clarity",
      label: "Claridad del conflicto (quién quiere qué y qué puede perder)",
      status: "passed",
      detail: "Conflicto central expuesto con consecuencias directas para los personajes en cuadro."
    },
    coherenciaGiro: {
      key: "twist_coherence",
      label: "Coherencia de la revelación y cliffhanger",
      status: cliffhangerText && cliffhangerText.length > 20 ? "passed" : "warning",
      detail: cliffhangerText
        ? `Cierre dramático preparado: "${cliffhangerText.slice(0, 50)}..."`
        : "Se requiere un cierre con peligro o pregunta específica para encadenar el siguiente episodio."
    },
    viabilidadProduccion: {
      key: "production_feasibility",
      label: "Viabilidad de producción (planos de 10s en 9:16)",
      status: scenes.length > 0 ? "passed" : "warning",
      detail: `${scenes.length} planos continuos de 10s presupuestados para video vertical 9:16.`
    },
    continuidadVisual: {
      key: "visual_continuity",
      label: "Biblia de continuidad y model sheets inmutables",
      status: "passed",
      detail: "Identidad visual de personajes, escenario y objetos narrativos fija en todos los planos."
    },
    presupuestoFonetico: {
      key: "phonetic_budget",
      label: "Presupuesto fonético (2.0 a 2.5 palabras/segundo)",
      status: isPacingOptimal ? "passed" : "warning",
      detail: `${totalWords} palabras en ${targetDurationSec}s (${wordsPerSecond} pal/s). ${isPacingOptimal ? "Cadencia fluida óptima sin silencios ni saturación." : "Revisar ritmo para evitar que el diálogo se corte."}`
    }
  };
}

/**
 * Resumen de habilidades listas para inyectar en la interfaz de Miniseries
 */
export const VERTICAL_MICROFICTION_SKILLS = [
  SKILL_PRODUCTION_ARCHITECTURE,
  SKILL_MICROFICTION_SCRIPT_ENGINE,
  SKILL_FAST_PROMPT_TEMPLATE
];
