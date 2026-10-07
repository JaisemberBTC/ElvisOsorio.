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
  const allScenesHaveVisuals = sceneList.length > 0 && sceneList.every((scene) =>
    Boolean(scene?.action && scene?.environment && scene?.camera)
  );
  const item = (key: string, label: string, status: MicrofictionQualityControlItem['status'], detail: string) => ({ key, label, status, detail });

  return {
    ganchoPrimeros3s: item('hook', 'Hook inicial', hook?.trim() ? 'passed' : 'warning', hook?.trim() ? `Hook definido: ${hook}` : 'Falta definir un hook específico para abrir la historia.'),
    claridadConflicto: item('conflict', 'Conflicto', sceneList.length >= 2 ? 'info' : 'warning', sceneList.length >= 2 ? 'La secuencia tiene varias escenas para presentar y hacer avanzar el conflicto.' : 'Agrega escenas que expliquen qué está en juego.'),
    coherenciaGiro: item('cliffhanger', 'Giro o cierre', cliffhanger?.trim() ? 'passed' : 'info', cliffhanger?.trim() ? `Cierre declarado: ${cliffhanger}` : 'Revisar que el giro o cliffhanger conecte causalmente con el capítulo siguiente.'),
    viabilidadProduccion: item('duration', 'Duración y estructura', sceneList.length === 5 && durationSec === 50 ? 'passed' : 'warning', `Estructura actual: ${sceneList.length} escenas, ${durationSec} s declarados; la meta Flow es 5 × 10 s = 50 s.`),
    continuidadVisual: item('continuity', 'Continuidad visual', allScenesHaveVisuals ? 'info' : 'warning', allScenesHaveVisuals ? 'Cada escena tiene acción, entorno y cámara; revisar además la biblia de identidad entre planos.' : 'Completa acción, entorno y cámara en cada escena.'),
    presupuestoFonetico: item('dialogue', 'Diálogo por segmento', wordsPerScene.length > 0 && wordsPerScene.every((count) => count >= 19 && count <= 20) ? 'passed' : 'warning', wordsPerScene.length ? `Palabras habladas por escena: ${wordsPerScene.join(', ')}. Meta: 19–20 palabras, dos turnos equilibrados y cerca de 9,2 segundos de voz; Flow puede variar la cadencia.` : 'Todavía no hay diálogos para revisar.')
  };
}

const commonFormat = `FORMATO DE ENTREGA OBLIGATORIO
- De 2 a 5 capítulos, elegidos por el usuario.
- Cada capítulo dura exactamente 50 segundos: cinco prompts Flow autónomos de diez segundos.
- Escribe en español latinoamericano natural. Cada prompt incluye acción, personajes presentes, entorno, cámara, lente, movimiento, luz, actuación, diálogo literal, voces, música original, SFX, ambiente, subtítulo sugerido y restricciones.
- Repite en los cinco prompts la biblia necesaria para que cada segmento funcione si se pega por separado en Flow.
- Reparte diálogo natural entre dos personajes visibles: 19–20 palabras habladas por segmento, normalmente 9–11 por turno; apunta a 9,2 segundos de voz con pausas muy breves, sin acelerar ni dejar silencios largos.
- Mantén rostro, edad aparente, piel, cabello, vestuario, accesorios, voz, escenario, utilería, luz, paleta y eje de cámara entre capítulos.
- Personajes humanos hiperrealistas en live-action, con actuación natural; no caricatura ni estética 3D.
- Planifica el arco completo antes de escribir: objetivo, conflicto, escalada, revelación y cliffhanger de cada capítulo, todos causalmente conectados.
- La música instrumental debe ser original para cada serie, tener un motivo reconocible y variar según la emoción. Incluir efectos y mezcla bajo el diálogo.
- Añade SEO individual por capítulo: títulos para TikTok, Facebook y YouTube Shorts, caption, palabras clave, hashtags, hook de portada y comentario fijado.
- Trata los versículos con cuidado: distingue referencia, cita textual verificada y paráfrasis. No inventes citas ni prometas milagros garantizados.
- Usa recursos narrativos generales (problema inmediato, curiosidad, escalada, revelación, continuidad); no copies personajes, frases, música, tramas, imágenes, marcas ni estética distintiva de otros creadores.
- Diseña para retención; no prometas porcentajes, viralidad ni resultados analíticos que no se hayan medido.
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
      title: 'La carta junto a la Biblia',
      topic: 'Una hija encuentra una carta familiar que contradice lo que le contaron y debe decidir si escuchará a su hermano.',
      tone: 'misterio íntimo, drama familiar, fe y esperanza realista',
      characters: 'Lucía (34 años, cabello castaño ondulado, suéter terracota); Tomás (38 años, barba de dos días, chaqueta azul marino)',
      noInclude: 'violencia gráfica, insultos, desenlace milagroso automático'
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
