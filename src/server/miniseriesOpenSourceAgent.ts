import { createHash } from 'node:crypto';
import { buildFlowPrompt } from '../utils/flowPromptBuilder.ts';
import {
  BIBLICAL_VIDEO_CREATION_RULE,
  FAITH_VIDEO_EXPERIMENT_NOTE,
  FAITH_VIDEO_FORMAT_FLOW_DIRECTIONS_EN,
  FAITH_VIDEO_FORMAT_GUIDANCE,
  FAITH_VIDEO_FORMAT_OPTIONS,
  SHAREABILITY_RULE,
  type FaithVideoFormat
} from '../skills/verticalMicrofictionSkill.ts';

export interface LLMProvider {
  readonly id: string;
  completeJSON(systemPrompt: string, userPrompt: string): Promise<unknown>;
}

export interface MiniseriesAgentOptions {
  topic?: string;
  totalParts?: number;
  category?: string;
  creativeApproach?: CreativeApproach | string;
  videoFormat?: FaithVideoFormat | string;
  bibleReference?: string;
  lockedEnvironmentId?: string;
  customCharacters?: string;
  audiencePlatform?: string;
  tone?: string;
  callToAction?: string;
  noInclude?: string;
}

export type CreativeApproach = 'auto' | 'decision' | 'companionship' | 'daily-faith' | 'biblical-lens';
export type VideoFormat = FaithVideoFormat;

export const CREATIVE_APPROACH_OPTIONS = [
  { id: 'auto', label: 'Elegir según mi tema' },
  { id: 'decision', label: 'La decisión que nadie ve' },
  { id: 'companionship', label: 'Acompañar el dolor sin promesas fáciles' },
  { id: 'daily-faith', label: 'La fe en un gesto cotidiano' },
  { id: 'biblical-lens', label: 'Una mirada menos obvia al texto bíblico' }
] as const;

const clampParts = (value: unknown) => Math.max(2, Math.min(5, Math.round(Number(value) || 3)));
const tidy = (value: unknown, fallback = '') => typeof value === 'string' && value.trim() ? value.trim() : fallback;
const hashText = (value: string) => createHash('sha256').update(value).digest('hex');

class OllamaLLMProvider implements LLMProvider {
  readonly id = 'ollama';
  constructor(private readonly baseUrl: string, private readonly model: string) {}

  async completeJSON(systemPrompt: string, userPrompt: string): Promise<unknown> {
    const response = await fetch(`${this.baseUrl.replace(/\/+$/, '')}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.model,
        stream: false,
        format: 'json',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        options: { temperature: 0.75 }
      }),
      signal: AbortSignal.timeout(120_000)
    });
    if (!response.ok) throw new Error(`Ollama respondió con HTTP ${response.status}`);
    const payload = await response.json() as any;
    return parseJsonContent(payload?.message?.content);
  }
}

class OpenAICompatibleLLMProvider implements LLMProvider {
  readonly id = 'openai-compatible';
  constructor(private readonly baseUrl: string, private readonly model: string, private readonly apiKey?: string) {}

  async completeJSON(systemPrompt: string, userPrompt: string): Promise<unknown> {
    const base = this.baseUrl.replace(/\/+$/, '');
    const endpoint = /\/chat\/completions$/i.test(base) ? base : `${base}/chat/completions`;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (this.apiKey) headers.Authorization = `Bearer ${this.apiKey}`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: this.model,
        temperature: 0.75,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ]
      }),
      signal: AbortSignal.timeout(120_000)
    });
    if (!response.ok) throw new Error(`El proveedor compatible respondió con HTTP ${response.status}`);
    const payload = await response.json() as any;
    return parseJsonContent(payload?.choices?.[0]?.message?.content);
  }
}

function parseJsonContent(content: unknown): unknown {
  if (typeof content !== 'string') {
    if (content && typeof content === 'object') return content;
    throw new Error('El proveedor no devolvió contenido JSON.');
  }
  const cleaned = content.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start >= 0 && end > start) return JSON.parse(cleaned.slice(start, end + 1));
    throw new Error('La respuesta del proveedor no contiene un objeto JSON válido.');
  }
}

export function createConfiguredMiniseriesProvider(env: NodeJS.ProcessEnv = process.env): LLMProvider | null {
  const requested = (env.MINISERIES_LLM_PROVIDER || 'auto').trim().toLowerCase();
  if (requested === 'local' || requested === 'template' || requested === 'none') return null;
  const model = env.MINISERIES_LLM_MODEL || 'qwen2.5:7b';
  const ollamaUrl = env.OLLAMA_BASE_URL || (requested === 'ollama' ? env.MINISERIES_LLM_BASE_URL : undefined);
  const compatibleUrl = env.MINISERIES_LLM_BASE_URL;

  if (requested === 'ollama' || (requested === 'auto' && ollamaUrl)) {
    return new OllamaLLMProvider(ollamaUrl || 'http://127.0.0.1:11434', model);
  }
  if (requested === 'openai-compatible' || (requested === 'auto' && compatibleUrl)) {
    return new OpenAICompatibleLLMProvider(
      compatibleUrl || 'http://127.0.0.1:1234/v1',
      model,
      env.MINISERIES_LLM_API_KEY
    );
  }
  return null;
}

const CHARACTER_BASES = [
  {
    id: 'protagonista_fe', name: 'Lucía Vega', role: 'Protagonista; enfrenta un dilema humano y decide cómo responder', apparentAge: '34 años', gender: 'femenino',
    skin: 'tono oliva medio con subtono cálido', face: 'rostro ovalado, pecas leves, ojos café oscuro', hair: 'cabello castaño oscuro, ondulado, a la altura de los hombros, raya lateral', build: 'complexión media, postura que pasa de tensa a abierta',
    wardrobe: 'suéter color terracota, camisa marfil y pantalón oscuro, sin cambios entre segmentos', accessories: 'anillo sencillo de plata en la mano derecha y bolso de lona marrón', voice: 'voz femenina adulta, cálida, algo ronca al emocionarse; español latinoamericano neutral',
    promptAgeEn: '34-year-old woman', promptGenderEn: 'female', promptSkinEn: 'medium warm olive skin', promptFaceEn: 'oval face, faint freckles, dark brown eyes', promptHairEn: 'shoulder-length wavy dark brown hair with a side part', promptBuildEn: 'medium build, initially tense posture that gradually opens', promptWardrobeEn: 'terracotta sweater, ivory shirt, and dark trousers; unchanged between segments', promptAccessoriesEn: 'simple silver ring on her right hand and a brown canvas bag', promptVoiceEn: 'adult warm female voice, slightly husky when emotional; neutral Latin American Spanish accent',
    voicePresetName: 'voz femenina cálida y natural'
  },
  {
    id: 'companero_fe', name: 'Tomás Vega', role: 'Persona cercana que escucha, pregunta y ofrece apoyo sin imponer una solución', apparentAge: '38 años', gender: 'masculino',
    skin: 'tono moreno claro con subtono dorado', face: 'rostro rectangular, nariz recta, ojos café, una pequeña cicatriz en la ceja izquierda', hair: 'cabello negro corto con textura natural, barba de dos días', build: 'complexión delgada, hombros encorvados al inicio',
    wardrobe: 'chaqueta azul marino gastada, camiseta gris y jeans oscuros, sin cambios entre segmentos', accessories: 'reloj analógico negro en la muñeca izquierda', voice: 'voz masculina adulta de registro medio, respiración contenida; español latinoamericano neutral',
    promptAgeEn: '38-year-old man', promptGenderEn: 'male', promptSkinEn: 'light brown skin with a golden undertone', promptFaceEn: 'rectangular face, straight nose, brown eyes, small scar on the left eyebrow', promptHairEn: 'short naturally textured black hair and two-day stubble', promptBuildEn: 'slender build, shoulders initially hunched', promptWardrobeEn: 'worn navy jacket, gray T-shirt, and dark jeans; unchanged between segments', promptAccessoriesEn: 'black analog watch on his left wrist', promptVoiceEn: 'adult male mid-register voice with restrained breathing; neutral Latin American Spanish accent',
    voicePresetName: 'voz masculina serena y contenida'
  }
];

const BIBLICAL_CHARACTER_BASES = [
  {
    id: 'biblical_protagonist', name: 'Protagonista bíblico', role: 'Figura humana del pasaje; representar el texto con reverencia y sin añadir citas inventadas', apparentAge: 'adulto de unos 34 años', gender: 'masculino',
    skin: 'tono oliva medio, curtido por el sol', face: 'rostro ovalado, nariz recta, ojos café oscuro', hair: 'cabello oscuro ondulado hasta la nuca, barba corta natural', build: 'complexión media, postura cansada pero firme',
    wardrobe: 'túnica sencilla de lino color arena, manto de lana marrón y sandalias de cuero, constantes entre segmentos', accessories: 'cordón de tela sencillo, sin objetos modernos', voice: 'voz masculina adulta, cálida y natural; español latinoamericano neutral',
    promptAgeEn: 'adult man in his mid-thirties', promptGenderEn: 'male', promptSkinEn: 'sun-weathered medium olive skin', promptFaceEn: 'oval face, straight nose, dark brown eyes', promptHairEn: 'dark wavy hair to the nape and a short natural beard', promptBuildEn: 'medium build, tired but steady posture', promptWardrobeEn: 'simple sand-colored linen tunic, brown wool mantle, and leather sandals; unchanged between segments', promptAccessoriesEn: 'simple fabric cord, no modern objects', promptVoiceEn: 'adult warm natural male voice; neutral Latin American Spanish accent', voicePresetName: 'voz masculina histórica, cálida y natural'
  },
  {
    id: 'biblical_witness', name: 'Testigo del relato', role: 'Acompañante humano del pasaje; si no se identifica en la Escritura, dejarlo sin nombre', apparentAge: 'adulta de unos 32 años', gender: 'femenino',
    skin: 'tono oliva cálido', face: 'rostro redondeado, pómulos suaves, ojos marrones', hair: 'cabello oscuro recogido bajo un velo de lino sencillo', build: 'complexión media, movimientos atentos y sobrios',
    wardrobe: 'túnica de lino crudo y manto azul apagado, sin cambios entre segmentos', accessories: 'velo de lino sin adornos, sin objetos modernos', voice: 'voz femenina adulta, serena y articulada; español latinoamericano neutral',
    promptAgeEn: 'adult woman in her early thirties', promptGenderEn: 'female', promptSkinEn: 'warm olive skin', promptFaceEn: 'rounded face, soft cheekbones, brown eyes', promptHairEn: 'dark hair tied back beneath a simple linen veil', promptBuildEn: 'medium build, attentive restrained movement', promptWardrobeEn: 'undyed linen tunic and muted blue mantle; unchanged between segments', promptAccessoriesEn: 'plain linen veil, no ornament, no modern objects', promptVoiceEn: 'adult calm, clearly articulated female voice; neutral Latin American Spanish accent', voicePresetName: 'voz femenina serena y natural'
  }
];

const APPROACH_CONFIG: Record<Exclude<CreativeApproach, 'auto'>, any> = {
  decision: {
    label: 'La decisión que nadie ve',
    faithMessage: 'Confiar en Dios no siempre elimina el costo de elegir la verdad; puede dar valor para dar ese paso con honestidad.',
    openingReplyEs: 'Estoy aquí; miremos los hechos y decidamos sin presión hoy.',
    visuals: [
      'an unsigned form beside a folded receipt; one hand stops just above the signature line',
      'a phone with an unread message rests beside a work badge; the protagonist pauses before replying',
      'a second document reveals who could be affected by the choice; keep all text unreadable',
      'the protagonist opens a worn Bible beside the unsigned form and takes one steady breath',
      'the unsigned form remains on the table as the protagonist chooses to speak face to face'
    ],
    stages: [
      { title: 'Lo que no podía firmar', hook: 'Me pidió firmar algo falso.', conflict: 'Una persona de confianza le pide respaldar algo que no coincide con lo ocurrido.', reveal: 'Un detalle concreto muestra que otra persona también podría cargar con las consecuencias.', cliffhanger: 'Ahora debe decidir si habla aunque la relación pueda cambiar.', question: '¿Qué harías si decir la verdad pudiera costarte algo valioso?' },
      { title: 'El costo de negarse', hook: 'Si digo que no, lo pierdo.', conflict: 'El silencio parece proteger una oportunidad importante, pero deja a alguien expuesto.', reveal: 'La presión no desaparece; ahora el protagonista comprende quién asumiría el costo.', cliffhanger: 'Una respuesta vence hoy y no hay una salida sin consecuencias.', question: '¿Qué te ayudaría a elegir con honestidad bajo presión?' },
      { title: 'La persona detrás de la decisión', hook: 'Alguien más pagaría por esto.', conflict: 'La decisión afecta a una persona que no tuvo voz en el asunto.', reveal: 'Escuchar a esa persona cambia el problema de una ventaja personal a una cuestión de cuidado.', cliffhanger: 'El protagonista tendrá que explicar su decisión cara a cara.', question: '¿A quién considerarías antes de tomar una decisión difícil?' },
      { title: 'La verdad dicha en voz alta', hook: 'Hoy no voy a esconderlo.', conflict: 'Decir la verdad puede cerrar una puerta y abrir una conversación incómoda.', reveal: 'La otra persona no resuelve todo, pero reconoce un hecho que antes negaba.', cliffhanger: 'La consecuencia inmediata queda pendiente para el siguiente capítulo.', question: '¿Qué te sostiene cuando hacer lo correcto tiene un costo?' },
      { title: 'El primer paso después del no', hook: 'Lo correcto también puede doler.', conflict: 'La decisión está tomada, pero sus efectos y la relación siguen sin resolverse.', reveal: 'El protagonista acepta ayuda y propone una forma concreta de reparar el daño.', cliffhanger: 'La historia no promete recompensa fácil; deja un compromiso que habrá que sostener.', question: '¿Qué paso pequeño te ayudaría a vivir tu fe hoy?' }
    ]
  },
  companionship: {
    label: 'Acompañar el dolor sin promesas fáciles',
    faithMessage: 'El dolor no demuestra falta de fe; pedir compañía, expresar la duda y buscar ayuda también pueden convivir con confiar en Dios.',
    openingReplyEs: 'No tienes que resolverlo ahora; puedo quedarme aquí contigo hoy.',
    visuals: [
      'a person sits alone in a parked car at dusk, hands still on the steering wheel',
      'a cold cup and an untouched meal sit on the kitchen table; a friend waits without interrupting',
      'the protagonist finally looks up and admits the question they have been hiding',
      'two people sit quietly beside an open Bible; no supernatural light or instant cure',
      'the protagonist accepts a ride or a practical offer of help as morning light enters'
    ],
    stages: [
      { title: 'El cansancio que no se veía', hook: 'Hoy no pude fingir más.', conflict: 'La persona sostiene su rutina mientras oculta un agotamiento que ya afecta su día.', reveal: 'Alguien nota el silencio y pregunta sin exigir una explicación bonita.', cliffhanger: 'Por primera vez, el protagonista considera responder con sinceridad.', question: '¿Qué te habría gustado escuchar en un día así?' },
      { title: 'Cuando las frases hechas no ayudan', hook: 'No necesito que lo arregles.', conflict: 'La persona teme que su tristeza o duda sea tratada como falta de fe.', reveal: 'El acompañante deja de ofrecer respuestas rápidas y escucha la historia completa.', cliffhanger: 'La pregunta difícil sigue ahí, incluso después de la conversación.', question: '¿Qué tipo de compañía ayuda cuando no hay una respuesta rápida?' },
      { title: 'La pregunta que seguía abierta', hook: 'Todavía no entiendo por qué.', conflict: 'La pérdida o la incertidumbre no desaparece después de orar.', reveal: 'El protagonista descubre que puede hablar con Dios sin fingir certeza.', cliffhanger: 'Aceptar compañía será el siguiente paso, no una solución instantánea.', question: '¿Puedes llevar una duda a Dios sin esconderla?' },
      { title: 'Pedir ayuda también es un paso', hook: 'Necesito que te quedes hoy.', conflict: 'Pedir ayuda se siente vulnerable, aunque la persona ya no quiera cargar sola.', reveal: 'Un amigo ofrece presencia y apoyo concreto; el problema de fondo permanece.', cliffhanger: 'La ayuda deberá continuar mañana, cuando vuelva el silencio.', question: '¿A quién podrías pedir compañía esta semana?' },
      { title: 'La esperanza sin final perfecto', hook: 'Hoy el dolor sigue aquí.', conflict: 'No hay un cambio mágico; el protagonista debe decidir cómo atravesar el día.', reveal: 'Una pequeña rutina de cuidado hace posible dar el siguiente paso acompañado.', cliffhanger: 'La vida continúa con preguntas, y también con una esperanza compartida.', question: '¿Qué gesto de cuidado puedes ofrecerte hoy?' }
    ]
  },
  'daily-faith': {
    label: 'La fe en un gesto cotidiano',
    faithMessage: 'La fe también puede hacerse visible en actos cotidianos de verdad, misericordia, paciencia y cuidado, sin convertirlos en una fórmula para obtener algo.',
    openingReplyEs: 'A veces un paso pequeño ya expresa fe de verdad.',
    visuals: [
      'a thumb hovers above a draft apology on a phone; the screen contains no readable text',
      'the protagonist notices a neighbor struggling with grocery bags in a stairwell',
      'a shared bus stop grows quiet as the protagonist chooses to listen instead of rushing away',
      'the protagonist pauses for a brief prayer before answering a tense message',
      'two neighbors share a simple meal at a doorway; no grand transformation is implied'
    ],
    stages: [
      { title: 'El gesto que nadie notó', hook: 'Nadie vio lo que elegí.', conflict: 'Una situación cotidiana ofrece una salida cómoda que dejaría a alguien sin apoyo.', reveal: 'Un gesto pequeño cambia cómo la otra persona vive ese momento, aunque no arregla todo.', cliffhanger: 'Mañana la misma decisión volverá a presentarse.', question: '¿Qué gesto pequeño te ha hecho sentir acompañado?' },
      { title: 'Cinco minutos para escuchar', hook: 'Solo tenía cinco minutos.', conflict: 'La prisa empuja al protagonista a ignorar a alguien que necesita ser escuchado.', reveal: 'Una pregunta sincera revela que la necesidad era distinta de lo que parecía.', cliffhanger: 'Escuchar abre una conversación que no se puede resolver de inmediato.', question: '¿A quién podrías escuchar con más atención hoy?' },
      { title: 'La respuesta que no envié', hook: 'Casi respondí con rabia.', conflict: 'Un mensaje hiere y el protagonista debe decidir si devuelve el daño.', reveal: 'La pausa y una oración breve cambian la respuesta, no el hecho ocurrido.', cliffhanger: 'La otra persona todavía no responde.', question: '¿Qué te ayuda a pausar antes de responder con enojo?' },
      { title: 'Una disculpa sin excusas', hook: 'Esta vez sí voy a llamar.', conflict: 'Reconocer el propio error cuesta más que explicar por qué ocurrió.', reveal: 'Una disculpa clara abre la posibilidad de conversar, sin exigir perdón inmediato.', cliffhanger: 'La reparación dependerá de lo que haga después.', question: '¿Qué hace que una disculpa se sienta sincera?' },
      { title: 'Mañana también cuenta', hook: 'Mañana volveré a intentarlo.', conflict: 'Un solo acto de bondad no elimina el hábito ni la dificultad.', reveal: 'El protagonista elige una práctica pequeña que sí puede repetir.', cliffhanger: 'La fe cotidiana se probará otra vez al día siguiente.', question: '¿Qué práctica sencilla quieres repetir esta semana?' }
    ]
  },
  'biblical-lens': {
    label: 'Una mirada menos obvia al texto bíblico',
    faithMessage: 'El texto bíblico conserva su contexto; su principio puede dialogar con la vida presente sin inventar palabras, hechos ni promesas.',
    openingReplyEs: 'Veamos qué afirma el texto y qué sigue siendo interpretación.',
    visuals: [
      'a reader opens a Bible to the requested passage and traces the surrounding verses, not only a single line',
      'a quiet margin note prompts a question about a character’s choice before the famous outcome',
      'two readers compare the passage with its surrounding context; no invented quotation is shown',
      'the reader closes the Bible and considers how the principle applies to a present-day decision',
      'a small everyday action echoes the passage’s theme without reenacting an unverified event'
    ],
    stages: [
      { title: 'Antes de la escena conocida', hook: 'La historia empieza antes del milagro.', conflict: 'Una escena famosa deja una decisión previa casi fuera de cuadro.', reveal: 'Leer el contexto muestra una tensión humana que el resumen suele saltar.', cliffhanger: 'La decisión inicial cambia cómo entendemos el desenlace conocido.', question: '¿Qué parte del relato sueles pasar por alto?' },
      { title: 'La pregunta que quedó abierta', hook: 'Casi nadie mira esta decisión.', conflict: 'El personaje enfrenta una elección antes de recibir una respuesta visible.', reveal: 'El pasaje no promete que toda situación termine igual.', cliffhanger: 'La respuesta exige distinguir fe, contexto e interpretación.', question: '¿Qué pregunta te despierta este pasaje?' },
      { title: 'Lo que el texto sí dice', hook: 'El detalle cambia la lectura.', conflict: 'Una frase fuera de contexto parece decir más de lo que realmente afirma.', reveal: 'Al leer los versículos cercanos, cambia la aplicación fácil.', cliffhanger: 'Todavía queda por preguntar qué significa hoy con honestidad.', question: '¿Lees el contexto completo antes de aplicar un versículo?' },
      { title: 'La aplicación no es una cita', hook: 'Esto es aplicación, no cita.', conflict: 'Una dramatización puede confundirse con palabras que la Biblia nunca registra.', reveal: 'El narrador separa con claridad el hecho bíblico de la escena imaginada.', cliffhanger: 'La pregunta espiritual queda abierta para la vida presente.', question: '¿Cómo conectas la Biblia con tu vida sin cambiar su sentido?' },
      { title: 'Una verdad para llevar al día', hook: 'La enseñanza va más allá.', conflict: 'La audiencia necesita una idea clara, no una promesa automática de resultado.', reveal: 'El principio se convierte en una acción cotidiana posible y humilde.', cliffhanger: 'La historia invita a volver al texto y seguir pensando.', question: '¿Qué principio del pasaje quieres practicar esta semana?' }
    ]
  }
};

function resolveVideoFormat(requested: unknown, topic: string, category?: string): Exclude<VideoFormat, 'auto'> {
  const value = String(requested || 'auto').trim().toLowerCase();
  if (value !== 'auto' && FAITH_VIDEO_FORMAT_OPTIONS.some((option) => option.id === value)) {
    return value as Exclude<VideoFormat, 'auto'>;
  }
  if (category === 'historia_biblica' || /historia b[ií]blica|personaje b[ií]blico|pasaje b[ií]blico|pedro|job|daniel/i.test(topic)) return 'cinematic-bible';
  if (/pregunta|por qu[eé].{0,24}dios|dios.{0,24}calla|ansiedad.{0,24}fe|duda.{0,24}fe/i.test(topic)) return 'hard-faith-question';
  if (/oraci[oó]n|orar|oremos|hablar con dios/i.test(topic)) return 'first-person-prayer';
  return 'modern-verse-story';
}

function getVideoFormatLabel(videoFormat: Exclude<VideoFormat, 'auto'>): string {
  return FAITH_VIDEO_FORMAT_OPTIONS.find((option) => option.id === videoFormat)?.label || 'Microhistoria actual conectada a un versículo';
}

function getFormatFaithMessage(videoFormat: VideoFormat): string {
  const messages: Record<Exclude<VideoFormat, 'auto'>, string> = {
    'first-person-prayer': 'La oración permite hablar honestamente con Dios; no es una fórmula para controlar la respuesta ni garantizar un resultado.',
    'cinematic-bible': 'El relato bíblico se entiende en su contexto; su desenlace no se presenta como una garantía individual para quien mira.',
    'modern-verse-story': 'Un principio bíblico contextualizado puede orientar una decisión presente, sin asegurar que desaparezcan sus consecuencias.',
    'hard-faith-question': 'La Biblia contiene lamento y preguntas honestas; leerla en contexto evita culpar a quien sufre o simplificar a Dios.'
  };
  return messages[videoFormat === 'auto' ? 'modern-verse-story' : videoFormat];
}

function resolveCreativeApproach(requested: unknown, topic: string, category?: string, videoFormat?: VideoFormat): Exclude<CreativeApproach, 'auto'> {
  const value = String(requested || 'auto').trim().toLowerCase();
  if (value in APPROACH_CONFIG) return value as Exclude<CreativeApproach, 'auto'>;
  if (videoFormat === 'cinematic-bible') return 'biblical-lens';
  if (videoFormat === 'first-person-prayer' || videoFormat === 'hard-faith-question') return 'companionship';
  if (category === 'historia_biblica' || /historia b[ií]blica|personaje b[ií]blico|pasaje b[ií]blico/i.test(topic)) return 'biblical-lens';
  if (/duelo|p[eé]rdida|cansancio|agotamiento|soledad|duda|ansiedad|luto|tristeza/i.test(topic)) return 'companionship';
  if (/\b(oraci[oó]n|perdonar|perd[oó]n|ayudar|gesto|h[aá]bito|pr[aá]ctica|misericordia)\b/i.test(topic)) return 'daily-faith';
  return 'decision';
}

function selectedStageIndexes(totalParts: number): number[] {
  return ({ 2: [0, 4], 3: [0, 2, 4], 4: [0, 1, 3, 4], 5: [0, 1, 2, 3, 4] } as Record<number, number[]>)[totalParts] || [0, 2, 4];
}

function buildEditorialOutline(topic: string, totalParts: number, requestedApproach?: string, category?: string, videoFormat: VideoFormat = 'modern-verse-story') {
  const approach = resolveCreativeApproach(requestedApproach, topic, category, videoFormat);
  const config = APPROACH_CONFIG[approach];
  const faithMessage = config.faithMessage;
  const formatHooks: Partial<Record<Exclude<VideoFormat, 'auto'>, string[]>> = {
    'first-person-prayer': [
      'Señor, necesito hablarte con honestidad.',
      'Dios, tengo miedo de esconderme.',
      'Señor, ayúdame a pedir ayuda.',
      'Señor, el problema sigue aquí.',
      'Gracias, Dios; no quiero caminar sola.'
    ],
    'hard-faith-question': [
      '¿Por qué Dios parece guardar silencio?',
      '¿Dudar significa que perdí la fe?',
      '¿Y si la respuesta todavía no llega?',
      '¿Orar sirve cuando nada cambia?',
      '¿Puedo creer mientras sigo preguntando?'
    ],
    'cinematic-bible': [
      'Lo que pasó antes del milagro importa.',
      'Esta decisión ocurrió antes del desenlace.',
      'El contexto cambia lo que creemos leer.',
      'El texto no dice todo lo que imaginamos.',
      'Esta escena exige contexto, no certezas rápidas.'
    ]
  };
  const formatOpeningLines: Partial<Record<Exclude<VideoFormat, 'auto'>, string[]>> = {
    'first-person-prayer': [
      'Señor, necesito hablarte con honestidad; hoy ya no quiero esconderme.',
      'Dios, tengo miedo de esconderme; no quiero ocultarte nada hoy.',
      'Señor, ayúdame a pedir ayuda; hoy no puedo hacerlo sola.',
      'Señor, el problema sigue aquí; acompáñame en este primer paso.',
      'Gracias, Dios; no quiero caminar sola hoy, aunque sigo cansada.'
    ],
    'hard-faith-question': [
      '¿Por qué Dios parece guardar silencio justo cuando más lo necesito?',
      '¿Dudar significa que perdí la fe para siempre, de verdad?',
      '¿Y si la respuesta todavía no llega, aunque la espero?',
      '¿Orar sirve cuando nada cambia en mi vida hoy?',
      '¿Puedo creer mientras sigo preguntando y siento que Dios calla?'
    ],
    'cinematic-bible': [
      'Lo que pasó antes del milagro importa; cambia la historia.',
      'Esta decisión ocurrió antes del desenlace y cambió la historia.',
      'El contexto cambia lo que creemos leer en el pasaje.',
      'El texto no dice todo lo que imaginamos; revisemos su contexto.',
      'Esta escena exige contexto, no certezas rápidas ni atajos.'
    ]
  };
  return selectedStageIndexes(totalParts).map((stageIndex, episodeIndex) => {
    const stage = config.stages[stageIndex];
    const hook = formatHooks[videoFormat]?.[stageIndex] || stage.hook;
    const hookWords = hook.trim().split(/\s+/);
    const openingExtension = ['Y', 'quiero', 'hablarlo', 'contigo', 'hoy', 'mismo'].slice(0, Math.max(0, 10 - hookWords.length));
    return {
      episodeNumber: episodeIndex + 1,
      ...stage,
      hook,
      faithMessage,
      objective: `Conectar «${topic}» con la etapa ${episodeIndex + 1} del arco: ${stage.conflict}`,
      openingActionEn: `At frame 0, ${videoFormat === 'cinematic-bible'
        ? 'a historically grounded live-action reenactment of the requested biblical passage, beginning on a human choice or reaction'
        : videoFormat === 'first-person-prayer'
          ? 'a recognizable contemporary person beginning a first-person prayer during a real human difficulty; no supernatural presence'
          : videoFormat === 'hard-faith-question'
            ? 'a close, human reaction to the difficult question, with a second person listening without judgment'
            : config.visuals[stageIndex]}. Begin on a visible human choice or reaction; no title card, slow setup, or readable generated text.`,
      openingLineEs: formatOpeningLines[videoFormat]?.[stageIndex] || [...hookWords, ...openingExtension].join(' '),
      openingReplyEs: config.openingReplyEs,
      propAction: config.visuals[stageIndex],
      commentQuestion: stage.question,
      creativeApproach: approach
    };
  });
}

function makeSoftCTA(candidate: unknown, fallback: string): string {
  const value = tidy(candidate, fallback);
  const coercive = /(?:si (?:crees|amas|tienes fe).{0,50}(?:comenta|escribe|comparte)|(?:comenta|escribe).{0,35}(?:am[eé]n|declara|demuestra tu fe)|no (?:pases|deslices)|comparte.{0,35}(?:prueba tu fe|bendici[oó]n)|obligad[oa])/i;
  const engagementBait = /(?:para (?:que|as[ií]).{0,35}(?:algoritmo|viral|alcance|vistas|distribuci[oó]n)|(?:dale|deja tu|reg[aá]lame un) like|comenta y comparte|comparte y comenta|comenta.{0,30}para (?:subir|viralizar|aumentar las vistas))/i;
  return coercive.test(value) || engagementBait.test(value) ? fallback : value;
}

function chooseLocation(topic: string, lockedEnvironmentId?: string, videoFormat: VideoFormat = 'modern-verse-story') {
  if (lockedEnvironmentId) return `User-locked environment (${lockedEnvironmentId}), represented as a real contemporary location`;
  if (videoFormat === 'cinematic-bible') {
    if (/pedro|barca|mar|tormenta|viento|olas/i.test(topic)) return 'a first-century Galilean lakeshore and a small wooden fishing boat, grounded in the referenced Gospel passage';
    if (/daniel|le[oó]n|babilonia|foso/i.test(topic)) return 'an ancient Babylonian stone courtyard and restrained lion enclosure, grounded in the referenced biblical passage';
    if (/job|ceniza|desierto|sufrimiento/i.test(topic)) return 'a modest ancient Near Eastern stone courtyard with earth and ash, grounded in the referenced biblical passage';
    return 'a historically grounded first-century Judean or Galilean village, with period-appropriate stone, linen, wood, and natural light';
  }
  if (/trabajo|empleo|jefe|oficina|compa[nñ]ero|firma|recibo|decisi[oó]n laboral/i.test(topic)) return 'a modest workplace break room and quiet office corridor in a Latin American city';
  if (/bus|autob[uú]s|transporte|camino|viaje|calle/i.test(topic)) return 'a city bus stop and a nearby neighborhood sidewalk in a Latin American city';
  if (/oraci[oó]n|gesto|h[aá]bito|misericordia|perd[oó]n/i.test(topic)) return 'a shared apartment building entrance and small neighborhood kitchen in a Latin American city';
  if (/hospital|enfermedad|sanidad|m[eé]dico|cl[ií]nica/i.test(topic)) return 'a neighborhood hospital waiting room in a Latin American city';
  if (/deuda|desalojo|casa|alquiler|familia|padre|madre/i.test(topic)) return 'the modest kitchen of a family apartment in a Latin American city';
  if (/duelo|p[eé]rdida|cementerio/i.test(topic)) return 'a small neighborhood chapel and its courtyard in a Latin American city';
  return 'the connected living room and kitchen of a contemporary family home in a Latin American city';
}

function characterRecord(base: any, customName?: string) {
  const name = customName || base.name;
  const visualIdentity = `${base.apparentAge}; piel ${base.skin}; ${base.face}; ${base.hair}; ${base.build}. Apariencia de persona real filmada en live-action.`;
  const visualIdentityEn = `${base.promptAgeEn}; ${base.promptSkinEn}; ${base.promptFaceEn}; ${base.promptHairEn}; ${base.promptBuildEn}. Photorealistic live-action human.`;
  const exactModelSheetLockEn = `${name}, ${visualIdentityEn} Fixed wardrobe: ${base.promptWardrobeEn}. Fixed accessories: ${base.promptAccessoriesEn}. Preserve the exact same actor identity, face, age, skin, hair, body, wardrobe, accessories, and voice in every shot. No stylization.`;
  const avatarSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160"><rect width="160" height="160" rx="24" fill="${base.gender === 'femenino' ? '#573b54' : '#25415a'}"/><circle cx="80" cy="58" r="31" fill="#c99573"/><path d="M30 154c5-37 24-56 50-56s45 19 50 56" fill="${base.gender === 'femenino' ? '#b96550' : '#263b55'}"/><path d="M48 55c3-29 18-42 34-42 20 0 34 18 33 43-10-6-20-18-25-28-8 17-23 26-42 27" fill="${base.gender === 'femenino' ? '#30252a' : '#211e20'}"/></svg>`;
  return {
    ...base,
    name,
    subtitle: base.role,
    age: base.apparentAge,
    archetype: base.role,
    avatarEmoji: base.gender === 'femenino' ? '👩' : '👨',
    themeColor: base.gender === 'femenino' ? '#b96550' : '#446783',
    accentGradient: base.gender === 'femenino' ? 'from-rose-700 to-amber-700' : 'from-sky-800 to-slate-700',
    shortDescription: visualIdentity,
    visualIdentity,
    description: visualIdentity,
    exactModelSheetLockEn,
    promptAgeEn: base.promptAgeEn,
    promptGenderEn: base.promptGenderEn,
    promptSkinEn: base.promptSkinEn,
    promptFaceEn: base.promptFaceEn,
    promptHairEn: base.promptHairEn,
    promptBuildEn: base.promptBuildEn,
    promptWardrobeEn: base.promptWardrobeEn,
    promptAccessoriesEn: base.promptAccessoriesEn,
    promptVoiceEn: base.promptVoiceEn,
    fixedIdentityPrompt: `${name}: ${visualIdentity} Vestuario fijo: ${base.wardrobe}. Accesorios: ${base.accessories}.`,
    fixedIdentityPromptEn: exactModelSheetLockEn,
    clothingStyle: base.wardrobe,
    lockedWardrobeDesc: base.wardrobe,
    accessories: base.accessories,
    fallbackImage: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(avatarSvg)}`,
    keyEmotions: [],
    signatureProps: [base.accessories],
    bibleReferenceQuote: 'Referencia temática de la serie; no es una cita bíblica textual.',
    voiceProfile: {
      gender: base.gender,
      tone: base.voice,
      pace: 'natural, con pausas y respiración humana',
      pitchFactor: base.gender === 'femenino' ? 1.02 : 0.94,
      speedRate: 0.96,
      elevenLabsPreset: base.voicePresetName
    }
  };
}

function spokenWordCount(text: unknown): number {
  return String(text || '').trim().split(/\s+/).filter(Boolean).length;
}

function timeDialogueTurns(turns: any[], targetSeconds = 9.2): any[] {
  const wordCounts = turns.map((turn) => spokenWordCount(turn.dialogueSpanish));
  const totalWords = wordCounts.reduce((sum, count) => sum + count, 0) || turns.length;
  const format = (seconds: number) => `00:${seconds.toFixed(1).padStart(4, '0')}`;
  let elapsed = 0;
  return turns.map((turn, index) => {
    const allocatedSeconds = index === turns.length - 1
      ? Number((targetSeconds - elapsed).toFixed(1))
      : Number((targetSeconds * wordCounts[index] / totalWords).toFixed(1));
    const start = elapsed;
    elapsed = Number((elapsed + allocatedSeconds).toFixed(1));
    return {
      ...turn,
      timeWindow: `${format(start)}–${format(elapsed)}`,
      allocatedSeconds
    };
  });
}

function createFallbackMiniseries(rawOptions: MiniseriesAgentOptions) {
  const options = { ...rawOptions, totalParts: clampParts(rawOptions.totalParts) };
  const topic = tidy(options.topic, 'Una familia aprende a orar en medio de una crisis');
  const videoFormat = resolveVideoFormat(options.videoFormat, topic, options.category);
  const videoFormatLabel = getVideoFormatLabel(videoFormat);
  const topicHash = hashText(topic.toLocaleLowerCase('es'));
  const storySeed = hashText(`${topicHash}:${Date.now()}:${Math.random()}`);
  const totalParts = options.totalParts;
  const plans = buildEditorialOutline(topic, totalParts, options.creativeApproach, options.category, videoFormat);
  const approach = plans[0]?.creativeApproach || resolveCreativeApproach('auto', topic, options.category, videoFormat);
  const approachConfig = APPROACH_CONFIG[approach];
  const formatExplicit = Boolean(options.videoFormat && options.videoFormat !== 'auto');
  const faithMessage = formatExplicit ? getFormatFaithMessage(videoFormat) : approachConfig.faithMessage;
  plans.forEach((plan: any) => { plan.faithMessage = faithMessage; });
  const userNames = (options.customCharacters || '').split(/[;,\n]/).map((part) => part.trim()).filter(Boolean);
  const historical = videoFormat === 'cinematic-bible';
  const namedBiblicalFigure = historical ? topic.match(/Jes[uú]s|Pedro|Job|Daniel|Mois[eé]s|David|Ester|Rut|Marta|Mar[ií]a/i)?.[0] : undefined;
  const characterBases = historical ? BIBLICAL_CHARACTER_BASES : CHARACTER_BASES;
  const protagonistBase = historical && namedBiblicalFigure ? { ...characterBases[0], name: namedBiblicalFigure } : characterBases[0];
  const protagonist = characterRecord(protagonistBase, userNames[0]);
  const companion = characterRecord(characterBases[1], userNames[1]);
  const characters = [protagonist, companion];
  const location = chooseLocation(topic, options.lockedEnvironmentId, videoFormat);
  const bibleReference = tidy(options.bibleReference, 'Referencia bíblica por definir según el mensaje de fe');
  const musicStyles = [
    { genre: 'intimate piano, low strings, and soft pulses', bpm: 72, key: 'D minor resolving toward F major', motif: 'three ascending notes that return as an emotional answer' },
    { genre: 'nylon-string guitar, warm cello, and original ambient texture', bpm: 78, key: 'A minor with a luminous resolution', motif: 'a brief five-note arpeggio that matures in each chapter' },
    { genre: 'felt piano, viola, and very subtle organic percussion', bpm: 68, key: 'E minor with an open resolution', motif: 'a repeated note that grows into a hopeful phrase' }
  ];
  const audioStyle = musicStyles[parseInt(storySeed.slice(0, 2), 16) % musicStyles.length];
  const uniqueMotif = `${audioStyle.motif}; series signature ${storySeed.slice(0, 6)}`;
  const outline = plans;
  const seriesId = `feflow_${storySeed.slice(0, 12)}_${Date.now().toString(36)}`;
  const series: any = {
    id: seriesId,
    seriesTitle: topic.length > 64 ? `${topic.slice(0, 61).trim()}…` : topic,
    logline: `Pieza desde el formato «${videoFormatLabel}» y el enfoque «${approachConfig.label}», sobre ${topic.toLocaleLowerCase('es')}: fe y humanidad sin resultados garantizados.`,
    videoFormat,
    videoFormatLabel,
    creativeApproach: approach,
    creativeApproachLabel: approachConfig.label,
    category: options.category || 'prueba_fe',
    categoryLabel: 'Fe, oración y esperanza',
    totalPartsPlanned: totalParts,
    bannerHook: outline[0].hook,
    primaryCharacterIds: characters.map((character) => character.id),
    characters,
    castCount: characters.length,
    lockedEnvironmentId: options.lockedEnvironmentId || (historical ? 'world_biblical_period' : 'world_latin_family_home'),
    lockedEnvironmentName: location,
    lockedEnvironmentPromptEn: historical
      ? `Photorealistic live-action historical biblical setting, period-appropriate materials and wardrobe, no modern objects: ${location}.`
      : `Photorealistic live-action contemporary Latin American setting: ${location}.`,
    bibleReference,
    seriesBible: {
      seriesId,
      version: 1,
      theme: topic,
      videoFormat,
      videoFormatLabel,
      videoFormatGuidance: FAITH_VIDEO_FORMAT_GUIDANCE[videoFormat],
      videoFormatFlowDirectionEn: FAITH_VIDEO_FORMAT_FLOW_DIRECTIONS_EN[videoFormat],
      creativeApproach: approach,
      creativeApproachLabel: approachConfig.label,
      editorialHypothesis: `Probar el formato «${videoFormatLabel}» como hipótesis creativa, no como evidencia de demanda, saturación o rendimiento garantizado.`,
      faithMessage,
      faithApproach: 'La fe se expresa mediante verdad, cuidado, oración y decisiones observables; no se usa como fórmula para obtener un resultado ni se promete una solución milagrosa inmediata.',
      bibleReference,
      bibleUseNote: historical
        ? 'Toda interacción o diálogo no registrado de forma explícita en el pasaje es dramatización, no cita bíblica. Separar hechos del texto, interpretación y ficción; verificar la referencia y la traducción antes de mostrar una cita literal.'
        : options.bibleReference
          ? 'Referencia indicada por el usuario. No insertar una cita textual hasta verificar la traducción elegida.'
          : 'No se indicó referencia. Elegir y verificar una que sustente el mensaje de fe antes de publicar; no insertar texto literal sin confirmar traducción.',
      characterBible: characters.map(({ id, name, role, visualIdentity, wardrobe, accessories, voice }: any) => ({ id, name, role, visualIdentity, wardrobe, accessories, voice })),
      worldBible: {
        location,
        eraAndArchitecture: historical
          ? 'Historically grounded ancient Near Eastern or first-century Judean/Galilean architecture and materials; no modern objects or fantasy set dressing.'
          : 'Contemporary era; realistic working- or middle-class home, everyday materials and props, no fantasy set dressing.',
        timeOfDay: historical
          ? 'Natural daylight or lamplight appropriate to the passage; keep time consistent within each chapter.'
          : 'Afternoon gradually moves toward evening across the story; keep time consistent within each chapter.',
        weather: 'Mild weather, with no unjustified continuity changes.',
        palette: historical
          ? 'natural sand, earth, muted indigo and linen; historically plausible daylight or firelight, no magical glow'
          : 'ochre, terracotta, and natural blues; warm practical interior light and neutral shadows, no magical glow',
        cameraLanguage: historical
          ? 'intimate cinematic live-action reenactment, 35 mm, physically plausible movement, human reactions, period-appropriate framing'
          : 'intimate observational camera, 35 mm, subtle action-motivated movement, close reactions',
        lighting: historical ? 'natural sunlight, shade, or historically plausible firelight' : 'available window light and household lamps; natural cinematic contrast',
        recurringProps: historical
          ? ['only objects supported by the passage or its historical setting', 'period-appropriate linen, wood, clay, and stone']
          : ['worn-cover Bible when relevant to the story', 'one approach-specific everyday prop', 'mobile phone with no readable screen text'],
        continuityRule: historical
          ? 'Keep the same passage-appropriate location, architecture, wardrobe, props, light direction, and camera axis throughout the series.'
          : 'Keep the same room, layout, furniture, objects, and camera axis throughout the series.'
      },
      audioBible: {
        originalScore: `Original score identity ${storySeed.slice(0, 6)}: ${audioStyle.genre}; ${audioStyle.bpm} BPM; ${audioStyle.key}; signature motif ${uniqueMotif}.`,
        genre: audioStyle.genre,
        bpm: audioStyle.bpm,
        key: audioStyle.key,
        signatureMotif: uniqueMotif,
        mixNotes: 'voces al frente; música -18 a -22 dB bajo los diálogos; sin letra, loops comerciales ni cambios bruscos de volumen',
        episodeVariations: outline.map((plan, index) => `Capítulo ${index + 1}: variar intensidad y registro según el giro de «${plan.title}», manteniendo el mismo motivo musical.`)
      },
      episodeOutline: outline,
      experimentNote: FAITH_VIDEO_EXPERIMENT_NOTE,
      generatedEpisodeIds: [],
      lastEpisodeNumber: totalParts,
      nextEpisodeSeed: `Continuación causal posterior a ${outline[totalParts - 1].title}: ${outline[totalParts - 1].cliffhanger}`,
      usedHooks: outline.map((plan) => plan.hook),
      biblicalVideoCreationRule: BIBLICAL_VIDEO_CREATION_RULE,
      audienceShareabilityRule: SHAREABILITY_RULE,
      prePublishChecklist: [
        'YouTube: idioma español; publicar como Público si ese es el objetivo; subtítulos activados y revisados; título y miniatura fieles; no marcar “contenido creado para niños” salvo que realmente esté dirigido a niños.',
        'Facebook: usar perfil profesional o página según corresponda; subir el archivo original sin marca de agua de otra plataforma; permitir comentarios si se desea, responder preguntas valiosas con videos y revisar periódicamente la calidad de cuenta/página y la elegibilidad para recomendaciones.'
      ],
      continuityLock: true
    },
    episodes: [] as any[]
  };

  const standardSceneActions = (plan: any, episodeNumber: number) => [
    `${plan.openingActionEn} Keep the action legible and emotionally specific from frame 0; no title, fade, or introductory pause.`,
    `${companion.name} listens without interrupting as ${protagonist.name} names the concrete stakes of this chapter. Show the cost through a restrained pause, not melodramatic gestures.`,
    `${protagonist.name} notices new information that changes the choice at hand. Let a glance, a physical detail, and the companion's response carry the reveal; no exposition montage.`,
    `${protagonist.name} glances at the Bible and expresses the episode's faith message as a personal reflection, not as a quotation spoken by God or Jesus.`,
    episodeNumber < totalParts
      ? `${protagonist.name} takes one observable first step. A new consequence interrupts the moment and both characters react; end on a causal question, not a guaranteed miracle.`
      : `${protagonist.name} and ${companion.name} choose one realistic next action. The underlying difficulty remains; end with honest, restrained hope and no instant cure.`
  ];
  const sceneActions = (plan: any, episodeNumber: number) => {
    if (videoFormat === 'first-person-prayer') return [
      `${plan.openingActionEn} Show a real human difficulty and a person beginning an honest first-person prayer; no supernatural presence, glowing hand, or instant relief.`,
      `${protagonist.name} continues praying in their own words while ${companion.name} listens as a clearly human friend; do not imply the friend speaks for God.`,
      `${protagonist.name} admits a specific fear or need. Use natural breathing, a grounded gesture, and an unchanged everyday setting; no guaranteed answer appears.`,
      `${protagonist.name} asks for strength to take one realistic next step; ${companion.name} offers practical human support without resolving the whole problem.`,
      episodeNumber < totalParts
        ? `${protagonist.name} finishes this prayer with one observable next step. A new practical obstacle remains and creates a truthful cliffhanger.`
        : `${protagonist.name} and ${companion.name} remain present together. End with honest hope while the underlying difficulty remains unresolved.`
    ];
    if (videoFormat === 'hard-faith-question') return [
      `${plan.openingActionEn} Show the difficult question through a human reaction, not a sensational image; no title card or instant answer.`,
      `${companion.name} listens without correcting or diagnosing ${protagonist.name}; keep the question emotionally specific and the performance compassionate.`,
      `The two characters examine the surrounding biblical context together; avoid a proof-text montage, invented quotation, or simplistic theological certainty.`,
      `${protagonist.name} names what the passage can and cannot establish. Keep any application distinct from Scripture and leave room for honest doubt.`,
      episodeNumber < totalParts
        ? `The conversation remains open; ${protagonist.name} chooses one careful next step and a new question leads into the next chapter.`
        : `End with companionship and a clear, modest reflection; do not claim the question is solved or that doubt proves a lack of faith.`
    ];
    if (videoFormat === 'cinematic-bible') return [
      `${plan.openingActionEn} Recreate only passage-supported historical details; any added action is restrained dramatization, never a fabricated biblical quotation.`,
      `${protagonist.name} reacts to the immediate human stakes of the passage while ${companion.name} remains a historically plausible witness; do not add unverified named characters.`,
      `Reveal a passage-grounded detail or consequence with a close human reaction. Keep objects, architecture, clothing, and light period-appropriate; no modern props.`,
      `Show the passage's meaning through action and historically plausible dialogue; separate biblical events from interpretation, and never put invented words in God's or Jesus's mouth.`,
      episodeNumber < totalParts
        ? `End on a consequence supported by the passage or clearly marked dramatization, creating a causal cliffhanger without inventing a miracle.`
        : `End reverently on the passage's verified outcome or a clearly labeled application; do not promise the audience an identical result.`
    ];
    return standardSceneActions(plan, episodeNumber);
  };
  const sceneDialogues = (plan: any, episodeNumber: number) => {
    if (videoFormat === 'first-person-prayer') return [
      [[protagonist.name, plan.openingLineEs], [companion.name, 'Te escucho; no tienes que resolverlo todo esta noche.']],
      [[protagonist.name, 'Dios, tengo miedo y no quiero esconderme más de ti.'], [companion.name, 'Puedes hablar con honestidad; me quedo aquí contigo hoy.']],
      [[protagonist.name, 'Señor, ayúdame a pedir ayuda; hoy ya no puedo sola.'], [companion.name, 'Pedir ayuda también es un paso valiente y concreto.']],
      [[protagonist.name, 'Señor, el problema sigue aquí; acompáñame en este primer paso.'], [companion.name, 'No estás sola; mañana podemos buscar apoyo concreto juntos.']],
      [[protagonist.name, 'Gracias, Dios; sigo cansada, pero hoy no quiero caminar sola.'], [companion.name, 'Aquí seguimos, paso a paso, sin fingir que ya pasó.']]
    ];
    if (videoFormat === 'hard-faith-question') return [
      [[protagonist.name, plan.openingLineEs], [companion.name, 'Tu pregunta merece espacio; no daré respuestas fáciles ahora.']],
      [[protagonist.name, '¿Dudar significa que perdí la fe para siempre, de verdad?'], [companion.name, 'La Biblia muestra personas que preguntan desde el dolor también.']],
      [[protagonist.name, '¿Y si la respuesta que espero todavía no llega hoy?'], [companion.name, 'Leo el salmo completo, no solo la frase que recuerdo.']],
      [[protagonist.name, '¿Orar sirve cuando nada parece cambiar a mi alrededor?'], [companion.name, 'No encontré una respuesta sencilla, pero puedo orar sin fingir.']],
      [[protagonist.name, '¿Puedo creer mientras sigo preguntando y siento que Dios calla?'], [companion.name, 'No todo se resuelve hoy; podemos acompañarnos mientras seguimos.']]
    ];
    if (videoFormat === 'cinematic-bible') {
      const firstReply = spokenWordCount(plan.openingLineEs) > 10
        ? 'No sé qué vendrá, pero no quiero apartarme hoy.'
        : 'No sé qué vendrá, pero no quiero apartarme de ti.';
      return [
      [[protagonist.name, plan.openingLineEs], [companion.name, firstReply]],
      [[protagonist.name, 'No sé qué sintió; el pasaje no cuenta ese detalle.'], [companion.name, 'Representemos la escena con respeto, sin afirmar pensamientos ajenos.']],
      [[protagonist.name, 'El texto conserva su contexto; no prometamos el mismo desenlace.'], [companion.name, 'Cada historia merece una lectura atenta y humilde hoy.']],
      [[protagonist.name, 'Tengo miedo de lo que ocurra si doy este paso.'], [companion.name, 'No estás solo; demos el paso con cuidado hoy.']],
      [[protagonist.name, 'No todo terminó como esperaba, pero sigo confiando en Dios.'], [companion.name, 'Lo que ocurrió merece ser contado con respeto hoy.']]
      ];
    }
    const faithDialogue: Record<string, string[]> = {
      decision: ['Le pedí a Dios valor, no una excusa para mentir.', 'La fe no borra el costo de decir la verdad.'],
      companionship: ['Dudar no me vuelve menos amado por Dios, aunque duela.', 'Puedo pedir ayuda sin tener todas las respuestas hoy.'],
      'daily-faith': ['Oré antes de responder; no quiero herir por cansancio.', 'Dios también importa en cómo trato a quien tengo cerca.'],
      'biblical-lens': ['El texto no dice eso; debo leerlo con cuidado.', 'La aplicación es mía: Dios invita a buscar verdad con humildad.']
    };
    const [faithLine, faithReply] = faithDialogue[approach];
    return [
      [[protagonist.name, plan.openingLineEs], [companion.name, plan.openingReplyEs]],
      [[protagonist.name, 'Me asusta lo que cambie si digo esto hoy.'], [companion.name, 'No voy a presionarte; podemos pensar el siguiente paso juntos.']],
      [[protagonist.name, 'Lo que descubrí cambia la decisión, no borra lo ocurrido.'], [companion.name, 'Ahora sé qué debo preguntar antes de contestar o actuar.']],
      [[protagonist.name, faithLine], [companion.name, faithReply]],
      episodeNumber < totalParts
        ? [[protagonist.name, 'No está resuelto, pero hoy puedo dar este primer paso.'], [companion.name, '¿Me acompañas a descubrir qué sucede cuando diga la verdad?']]
        : [[protagonist.name, 'No todo cambió hoy; sigo confiando en Dios paso a paso.'], [companion.name, 'Mañana vuelvo a intentarlo, sin fingir que ya sané.']]
    ];
  };

  series.episodes = outline.map((plan: any, episodeIndex: number) => {
    const episodeNumber = episodeIndex + 1;
    const actions = sceneActions(plan, episodeNumber);
    const dialogueSets = sceneDialogues(plan, episodeNumber);
    const scenes = actions.map((action, sceneIndex) => {
      const start = String(sceneIndex * 10).padStart(2, '0');
      const end = String((sceneIndex + 1) * 10).padStart(2, '0');
      const rawDialogueExchange = dialogueSets[sceneIndex].map(([speakerName, dialogueSpanish]: string[], turnIndex: number) => ({
        speakerName,
        speakerId: speakerName === protagonist.name ? protagonist.id : companion.id,
        timeWindow: '',
        allocatedSeconds: 0,
        dialogueSpanish,
        emotionalTone: turnIndex === 0 ? 'urgent, intimate, natural, and restrained' : 'human, fluid response with subtext',
        voicePresetName: speakerName === protagonist.name ? protagonist.voicePresetName : companion.voicePresetName
      }));
      const dialogueExchange = timeDialogueTurns(rawDialogueExchange);
      return {
        sceneNumber: sceneIndex + 1,
        durationSec: 10,
        timeframe: `00:${start}–00:${end}`,
        characterId: protagonist.id,
        secondaryCharacterId: companion.id,
        charactersInShot: [protagonist.id, companion.id],
        interactionType: sceneIndex === 0 ? 'reaccion_asombro' : 'dos_personajes_frente_a_frente',
        action,
        environment: location,
        camera: sceneIndex === 0 ? 'tight close shot on the specific prop and immediate human reaction, one continuous take' : 'close medium shot on a consistent 180-degree axis, alternating eyelines within one continuous take',
        lens: 'cinematic 35 mm equivalent, natural perspective, moderate depth of field',
        cameraMovement: sceneIndex === 0 ? 'a brisk, controlled push-in completed within the first 0.5 seconds, then settle without a cut' : 'very subtle, physically plausible continuous lateral move',
        lighting: historical ? 'natural daylight, shade, or period-appropriate firelight; preserve the same light direction between segments' : 'warm practical light and soft shadows; preserve the same light direction between segments',
        performance: 'believable micro-expressions, human Latin American Spanish delivery, clear articulation, natural breathing and warmth; pauses only when they serve the meaning, never a robotic cadence or artificial rush',
        dialogueExchange,
        narration: '',
        subtitleSuggestion: sceneIndex === 0 ? plan.hook : dialogueExchange[0].dialogueSpanish,
        onScreenText: sceneIndex === 0 ? plan.hook : '',
        sfx: historical
          ? 'period-appropriate wind, footsteps, cloth, water, or fire ambience only when supported by the visible action and passage'
          : sceneIndex === 0 ? 'paper brushing the table, a ceramic cup settling, soft household ambience' : 'realistic interior ambience, natural breathing, and a brief phone vibration only when the action calls for it',
        bgMusicMood: `${audioStyle.genre}; ${audioStyle.bpm} BPM; variation on ${uniqueMotif}; emotional intensity ${['soft suspense', 'anticipation', 'reveal', 'decision', 'restrained relief'][sceneIndex]}`,
        negativePrompt: options.noInclude || 'no graphic violence, profanity, cartoon style, guaranteed visible miracles, or generated unreadable text'
      };
    });
    const candidateCta = makeSoftCTA(options.callToAction, plan.commentQuestion);
    const commentQuestion = /[?？]/.test(candidateCta) ? candidateCta : plan.commentQuestion;
    const socialPackage = {
      youtubeTitle: `${plan.title} | Miniserie de fe y oración — Capítulo ${episodeNumber}`,
      facebookTitle: `${plan.title}: una historia de fe y decisiones reales (Capítulo ${episodeNumber})`,
      tiktokTitle: `${plan.title} | Parte ${episodeNumber} de ${totalParts}`,
      caption: `${plan.hook}\n\nCapítulo ${episodeNumber} de ${totalParts}. Formato: ${videoFormatLabel}. Enfoque: ${approachConfig.label}. Sobre ${topic.toLocaleLowerCase('es')}. Mensaje de fe: ${faithMessage}\n\nSi quieres conversar: ${commentQuestion}`,
      hashtags: ['#MiniserieDeFe', '#Oracion', '#HistoriasDeFe', '#Esperanza', `#Capitulo${episodeNumber}`, '#FeEnLaVidaReal'],
      pinnedComment: commentQuestion,
      seoKeywords: ['miniserie cristiana', 'microdrama de fe', 'historias de fe en la vida real', plan.title.toLocaleLowerCase('es')],
      searchQueries: [`historia de fe sobre ${topic}`, 'miniserie cristiana de oración y esperanza'],
      thumbnailHook: plan.hook,
      suggestedAudio: `${audioStyle.genre}, ${audioStyle.bpm} BPM, motivo original ${storySeed.slice(0, 6)}`
    };
    const episode: any = {
      episodeNumber,
      episodeTitle: plan.title,
      hook: plan.hook,
      videoFormat,
      videoFormatLabel,
      creativeApproach: approach,
      faithMessage,
      objective: plan.objective,
      conflict: plan.conflict,
      escalation: `${plan.reveal}; la presión obliga a cada personaje a elegir cómo responder.`,
      twist: plan.reveal,
      cliffhanger: plan.cliffhanger,
      shareabilityPlan: {
        audienceProblemOrDesire: plan.conflict,
        hookSentence: plan.hook,
        rapidTransformation: `${protagonist.name} deja de enfrentar sola la incertidumbre y da un primer paso de confianza; el conflicto mayor permanece abierto.`,
        reasonToShare: 'Puede enviarse a alguien que atraviesa una verdad familiar difícil porque ofrece compañía y esperanza realista, no una solución mágica.',
        metricsToReview: ['retención 0–1 s y 0–3 s', 'tiempo promedio', 'finalización', 'comentarios', 'compartidos/envíos', 'guardados', 'antigüedad de publicación comparable'],
        dataStatus: 'Hipótesis editorial; comparar publicaciones con antigüedad similar y no inferir tendencias de muestras pequeñas.'
      },
      lockedEnvironmentId: series.lockedEnvironmentId,
      lockedEnvironmentName: location,
      lockedEnvironmentPromptEn: series.lockedEnvironmentPromptEn,
      scenes,
      socialPackage,
      status: 'ready',
      previousStateHash: episodeIndex > 0 ? hashText(`${seriesId}:${episodeIndex}:${outline[episodeIndex - 1].cliffhanger}`) : null,
      nextEpisodeSeed: episodeNumber < totalParts ? outline[episodeIndex + 1].title : series.seriesBible.nextEpisodeSeed
    };
    return episode;
  });

  finalizeSeries(series);
  return series;
}

function buildGenerationPrompt(options: MiniseriesAgentOptions, series: any): string {
  const formatBrief = `Formato de video seleccionado: ${series.videoFormatLabel} (${series.videoFormat}).\nGuía editorial obligatoria: ${series.seriesBible.videoFormatGuidance}\nNota de experimentación: ${FAITH_VIDEO_EXPERIMENT_NOTE}\n\n`;
  const outline = series.seriesBible.episodeOutline.map((episode: any) => ({
    episodeNumber: episode.episodeNumber,
    videoFormat: series.videoFormat,
    creativeApproach: episode.creativeApproach,
    faithMessage: episode.faithMessage,
    plannedTitle: episode.title,
    openingHook: episode.hook,
    openingVisual: episode.openingActionEn,
    commentQuestion: episode.commentQuestion,
    objective: episode.objective,
    conflict: episode.conflict,
    reveal: episode.reveal,
    cliffhanger: episode.cliffhanger
  }));
  return `${formatBrief}Tema del usuario: ${tidy(options.topic, 'fe, oración y esperanza')}\nNúmero exacto de capítulos: ${series.totalPartsPlanned} (permitido únicamente 2–5).\nBase bíblica solicitada: ${tidy(options.bibleReference, 'proponer una referencia temática, sin citar texto literal')}\nTono: ${tidy(options.tone, 'humano, reverente, cinematográfico, emocional sin manipulación')}\nCTA: ${tidy(options.callToAction, 'pregunta reflexiva suave, opcional y al final del copy SEO')}\nNo incluir: ${tidy(options.noInclude, 'violencia gráfica, lenguaje vulgar, promesas de milagros garantizados, logos, marcas de agua, caricatura')}\nPlataforma: ${tidy(options.audiencePlatform, 'TikTok/Reels/Shorts verticales')}\n\nBiblia de continuidad y plan completo previo:\n${JSON.stringify({ seriesTitle: series.seriesTitle, logline: series.logline, characters: series.characters.map((character: any) => ({ name: character.name, role: character.role, visualIdentity: character.visualIdentity, wardrobe: character.wardrobe, accessories: character.accessories, voice: character.voice })), worldBible: series.seriesBible.worldBible, audioBible: series.seriesBible.audioBible, episodeOutline: outline }, null, 2)}\n\nDevuelve únicamente un objeto JSON, sin Markdown, con esta forma:\n{\n  "seriesTitle": "...", "logline": "...", "bannerHook": "...", "bibleReference": "...", "bibleUseNote": "...",\n  "characters": [{"id":"protagonista_fe","name":"...","role":"...","apparentAge":"...","skin":"...","face":"...","hair":"...","build":"...","wardrobe":"...","accessories":"...","voice":"..."}],\n  "worldBible": {"location":"...","eraAndArchitecture":"...","timeOfDay":"...","weather":"...","palette":"...","cameraLanguage":"...","lighting":"...","recurringProps":["..."]},\n  "audioBible": {"originalScore":"...","genre":"...","bpm":72,"key":"...","signatureMotif":"...","mixNotes":"...","episodeVariations":["..."]},\n  "episodeOutline": [{"episodeNumber":1,"title":"...","objective":"...","conflict":"...","reveal":"...","cliffhanger":"..."}],\n  "episodes": [{"episodeNumber":1,"episodeTitle":"...","hook":"...","objective":"...","conflict":"...","escalation":"...","twist":"...","cliffhanger":"...",\n    "scenes": [{"sceneNumber":1,"action":"...","environment":"...","camera":"...","lens":"...","cameraMovement":"...","lighting":"...","performance":"...","dialogueExchange":[{"speakerName":"...","dialogueSpanish":"...","timeWindow":"00:00.0–00:04.6","emotionalTone":"..."},{"speakerName":"...","dialogueSpanish":"...","timeWindow":"00:04.6–00:09.2","emotionalTone":"..."}],"narration":"","sfx":"...","bgMusicMood":"...","subtitleSuggestion":"..."}],\n    "socialPackage": {"youtubeTitle":"...","facebookTitle":"...","tiktokTitle":"...","caption":"...","hashtags":["..."],"pinnedComment":"...","seoKeywords":["..."],"searchQueries":["..."],"thumbnailHook":"...","suggestedAudio":"..."}}]\n}\n\nReglas obligatorias:\n- Respeta el formato de video elegido en todas las escenas y metadatos; escribe instrucciones técnicas de Flow en inglés y diálogos, títulos, captions y SEO en español latinoamericano.\n- Devuelve exactamente ${series.totalPartsPlanned} capítulos y exactamente cinco escenas por capítulo; cada escena dura 10 s, para 50 s por capítulo. No cambies el plan general de continuidad ni el orden causal.\n- Cada escena debe incluir exactamente dos turnos conversacionales, uno por cada personaje visible, con 19–20 palabras habladas en total y 9–11 por turno. Usa español latinoamericano natural a unas 2,1 palabras por segundo: el diálogo debe ocupar aproximadamente 9,2 de los 10 segundos (92%), sin silencios largos ni velocidad artificial. El servidor ajustará las ventanas proporcionalmente. La primera frase del primer segmento debe ser un hook inmediato.\n- Cada capítulo tiene objetivo, conflicto, escalada, giro y cierre/cliffhanger causalmente distintos. No repitas hook, revelación, escenario de apertura ni acción clave.\n- Mantén los mismos actores humanos hiperrealistas, rostros, edades aparentes, piel, cabello, complexión, vestuario, accesorios y voces en los cinco segmentos y en todos los capítulos. Máximo tres personajes principales por escena.\n- Mantén el mismo entorno, luz, paleta, utilería y eje de cámara; cambia solo lo exigido por la acción. Movimiento físicamente posible, cámara cinematográfica y actuación contenida.\n- Música original única de esta serie, con género, BPM, instrumentos, motivo y cambios de intensidad por escena; SFX y ambiente también deben quedar especificados en cada segmento. No usar canciones comerciales, marcas ni imitar artistas.\n- Evita pedir likes, comentarios o compartidos solo para obtener distribución. No presentes la frecuencia como regla: 1–2 videos diarios por 60 días no es una fórmula demostrada; si se propone 1 video diario por 21 días, es un sprint experimental sin garantía.\n- El nicho es fe, oración y versículos. La fe debe expresarse mediante decisiones y vida cotidiana; no prometas resultados milagrosos. No atribuyas ficción como cita textual a Dios, Jesús o la Biblia. Si parafraseas, indícalo y no inventes referencias.\n- No copies personajes, tramas, frases, música, imágenes, marcas ni estilo visual de cuentas existentes. Usa solo recursos narrativos generales: problema inmediato, curiosidad dosificada, escalada, revelación y continuidad entre partes.\n- Cada capítulo necesita SEO propio para TikTok, Facebook y YouTube: títulos, descripción/caption, palabras clave, hashtags, hook de miniatura y comentario fijado. Sin clickbait engañoso ni CTA insistente.\n- Los prompts se completarán con una plantilla Flow autosuficiente; describe acción, cámara, luz, actuación y audio en los campos anteriores.`;
}

function mergeModelOutput(series: any, rawOutput: unknown) {
  const output = (rawOutput && typeof rawOutput === 'object' && 'miniseries' in (rawOutput as any))
    ? (rawOutput as any).miniseries
    : rawOutput as any;
  if (!output || typeof output !== 'object') throw new Error('El modelo no devolvió una serie JSON.');
  const originalHooks = new Set<string>();
  if (typeof output.seriesTitle === 'string') series.seriesTitle = output.seriesTitle.trim().slice(0, 100) || series.seriesTitle;
  if (typeof output.logline === 'string') series.logline = output.logline.trim() || series.logline;
  if (typeof output.bannerHook === 'string') series.bannerHook = output.bannerHook.trim() || series.bannerHook;
  if (typeof output.bibleReference === 'string') series.seriesBible.bibleReference = output.bibleReference.trim();
  if (typeof output.bibleUseNote === 'string') series.seriesBible.bibleUseNote = output.bibleUseNote.trim();

  if (Array.isArray(output.characters)) {
    series.characters = series.characters.map((fallbackCharacter: any, index: number) => {
      const candidate = output.characters[index];
      if (!candidate || typeof candidate !== 'object') return fallbackCharacter;
      const merged = { ...fallbackCharacter };
      for (const key of ['name', 'role', 'apparentAge', 'skin', 'face', 'hair', 'build', 'wardrobe', 'accessories', 'voice']) {
        if (typeof candidate[key] === 'string' && candidate[key].trim()) merged[key] = candidate[key].trim();
      }
      merged.age = merged.apparentAge || merged.age;
      merged.promptAgeEn = tidy(candidate.promptAgeEn || candidate.apparentAge, fallbackCharacter.promptAgeEn);
      merged.promptGenderEn = tidy(candidate.promptGenderEn, fallbackCharacter.promptGenderEn);
      merged.promptSkinEn = tidy(candidate.promptSkinEn || candidate.skin, fallbackCharacter.promptSkinEn);
      merged.promptFaceEn = tidy(candidate.promptFaceEn || candidate.face, fallbackCharacter.promptFaceEn);
      merged.promptHairEn = tidy(candidate.promptHairEn || candidate.hair, fallbackCharacter.promptHairEn);
      merged.promptBuildEn = tidy(candidate.promptBuildEn || candidate.build, fallbackCharacter.promptBuildEn);
      merged.promptWardrobeEn = tidy(candidate.promptWardrobeEn || candidate.wardrobe, fallbackCharacter.promptWardrobeEn);
      merged.promptAccessoriesEn = tidy(candidate.promptAccessoriesEn || candidate.accessories, fallbackCharacter.promptAccessoriesEn);
      merged.promptVoiceEn = tidy(candidate.promptVoiceEn || candidate.voice, fallbackCharacter.promptVoiceEn);
      merged.visualIdentity = `${merged.promptAgeEn}; skin: ${merged.promptSkinEn}; facial features: ${merged.promptFaceEn}; hair: ${merged.promptHairEn}; build: ${merged.promptBuildEn}. Photorealistic live-action human.`;
      merged.shortDescription = merged.visualIdentity;
      merged.description = merged.visualIdentity;
      merged.clothingStyle = merged.wardrobe;
      merged.lockedWardrobeDesc = merged.wardrobe;
      merged.fixedIdentityPrompt = `${merged.name}: ${merged.visualIdentity} Vestuario fijo: ${merged.wardrobe}. Accesorios: ${merged.accessories}.`;
      merged.exactModelSheetLockEn = `${merged.name}, ${merged.visualIdentity} Fixed wardrobe: ${merged.promptWardrobeEn}. Fixed accessories: ${merged.promptAccessoriesEn}. Fixed voice: ${merged.promptVoiceEn}. Preserve exact identity and live-action photorealism in every shot.`;
      merged.fixedIdentityPromptEn = merged.exactModelSheetLockEn;
      merged.voiceProfile = { ...fallbackCharacter.voiceProfile, tone: merged.voice };
      return merged;
    });
  }
  if (output.worldBible && typeof output.worldBible === 'object') {
    series.seriesBible.worldBible = { ...series.seriesBible.worldBible, ...output.worldBible };
    series.lockedEnvironmentName = tidy(output.worldBible.location, series.lockedEnvironmentName);
  }
  if (output.audioBible && typeof output.audioBible === 'object') {
    series.seriesBible.audioBible = { ...series.seriesBible.audioBible, ...output.audioBible };
  }
  if (Array.isArray(output.episodeOutline) && output.episodeOutline.length === series.totalPartsPlanned) {
    series.seriesBible.episodeOutline = output.episodeOutline;
  }

  const sourceEpisodes = Array.isArray(output.episodes) ? output.episodes : [];
  for (const episode of series.episodes) {
    const source = sourceEpisodes.find((item: any) => Number(item?.episodeNumber) === episode.episodeNumber);
    if (!source) continue;
    const fallbackOpeningHook = episode.hook;
    if (typeof source.hook === 'string' && source.hook.trim() && spokenWordCount(source.hook) <= 8) episode.hook = source.hook.trim();
    for (const [key, sourceKey] of [['episodeTitle', 'episodeTitle'], ['objective', 'objective'], ['conflict', 'conflict'], ['escalation', 'escalation'], ['twist', 'twist'], ['cliffhanger', 'cliffhanger']]) {
      if (typeof source[sourceKey] === 'string' && source[sourceKey].trim()) (episode as any)[key] = source[sourceKey].trim();
    }
    const normalizedHook = episode.hook.toLocaleLowerCase('es').replace(/\W+/g, ' ').trim();
    if (originalHooks.has(normalizedHook)) episode.hook = series.seriesBible.episodeOutline[episode.episodeNumber - 1]?.hook || episode.hook;
    originalHooks.add(episode.hook.toLocaleLowerCase('es').replace(/\W+/g, ' ').trim());

    const sourceScenes = Array.isArray(source.scenes) ? source.scenes : Array.isArray(source.segments) ? source.segments : [];
    episode.scenes = episode.scenes.map((fallbackScene: any, index: number) => {
      const candidate = sourceScenes.find((item: any) => Number(item?.sceneNumber || item?.segmentNumber) === index + 1) || sourceScenes[index];
      if (!candidate || typeof candidate !== 'object') return fallbackScene;
      const merged: any = { ...fallbackScene };
      for (const key of ['action', 'environment', 'camera', 'lens', 'cameraMovement', 'lighting', 'performance', 'narration', 'sfx', 'bgMusicMood', 'subtitleSuggestion', 'negativePrompt']) {
        if (typeof candidate[key] === 'string' && candidate[key].trim()) merged[key] = candidate[key].trim();
      }
      const turns = Array.isArray(candidate.dialogueExchange) ? candidate.dialogueExchange : Array.isArray(candidate.dialogue) ? candidate.dialogue : [];
      if (turns.length >= 2) {
        const normalizedTurns = turns.slice(0, 2).map((turn: any, turnIndex: number) => {
          const fallbackTurn = fallbackScene.dialogueExchange[Math.min(turnIndex, fallbackScene.dialogueExchange.length - 1)];
          const speakerName = tidy(turn.speakerName || turn.speaker, fallbackTurn.speakerName);
          const speaker = series.characters.find((character: any) => character.name === speakerName) || series.characters[turnIndex % series.characters.length];
          return {
            ...fallbackTurn,
            speakerName,
            speakerId: speaker.id,
            timeWindow: '',
            allocatedSeconds: 0,
            dialogueSpanish: tidy(turn.dialogueSpanish || turn.text, fallbackTurn.dialogueSpanish),
            emotionalTone: tidy(turn.emotionalTone, fallbackTurn.emotionalTone),
            voicePresetName: speaker.voicePresetName
          };
        });
        const distinctVoices = new Set(normalizedTurns.map((turn: any) => turn.speakerId));
        const turnWordCounts = normalizedTurns.map((turn: any) => spokenWordCount(turn.dialogueSpanish));
        const spokenWordCountTotal = turnWordCounts.reduce((sum: number, count: number) => sum + count, 0);
        const normalizeOpeningText = (text: string) => text.toLocaleLowerCase('es').replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim();
        const openingMatchesHook = index !== 0 || normalizeOpeningText(normalizedTurns[0].dialogueSpanish).startsWith(normalizeOpeningText(episode.hook));
        merged.dialogueExchange = timeDialogueTurns(normalizedTurns);
        if (
          distinctVoices.size < 2 ||
          spokenWordCountTotal < 19 || spokenWordCountTotal > 20 ||
          turnWordCounts.some((count: number) => count < 9 || count > 11) ||
          !openingMatchesHook
        ) merged.dialogueExchange = fallbackScene.dialogueExchange;
        if (index === 0 && !openingMatchesHook) episode.hook = fallbackOpeningHook;
      }
      merged.timeframe = `00:${String(index * 10).padStart(2, '0')}–00:${String((index + 1) * 10).padStart(2, '0')}`;
      merged.durationSec = 10;
      merged.sceneNumber = index + 1;
      merged.charactersInShot = [...new Set(merged.dialogueExchange.map((turn: any) => turn.speakerId))];
      merged.onScreenText = tidy(merged.subtitleSuggestion, '');
      return merged;
    });

    if (source.socialPackage && typeof source.socialPackage === 'object') {
      const fallbackPinnedComment = episode.socialPackage.pinnedComment;
      const fallbackCaption = episode.socialPackage.caption;
      episode.socialPackage = { ...episode.socialPackage, ...source.socialPackage };
      episode.socialPackage.pinnedComment = makeSoftCTA(episode.socialPackage.pinnedComment, fallbackPinnedComment);
      episode.socialPackage.caption = makeSoftCTA(episode.socialPackage.caption, fallbackCaption);
      if (!/[?？]/.test(String(episode.socialPackage.pinnedComment || ''))) episode.socialPackage.pinnedComment = fallbackPinnedComment;
      if (!/[?？]/.test(String(episode.socialPackage.caption || ''))) episode.socialPackage.caption = fallbackCaption;
    }
  }
  series.seriesBible.characterBible = series.characters.map((character: any) => ({
    id: character.id, name: character.name, role: character.role, visualIdentity: character.visualIdentity,
    wardrobe: character.wardrobe, accessories: character.accessories, voice: character.voice
  }));
  return series;
}

function finalizeSeries(series: any) {
  const allPrompts = new Set<string>();
  for (const episode of series.episodes) {
    const audienceProblemOrDesire = tidy(episode.conflict || episode.objective, 'problema o deseo central por concretar');
    episode.shareabilityPlan = episode.shareabilityPlan || {
      audienceProblemOrDesire,
      hookSentence: tidy(episode.hook, 'Hook por revisar'),
      rapidTransformation: tidy(episode.reveal || episode.twist || episode.escalation, 'entregar un primer cambio emocional o una decisión observable sin resolver mágicamente todo el arco'),
      reasonToShare: `Hipótesis: alguien que atraviesa «${audienceProblemOrDesire}» podría enviárselo a otra persona en una situación parecida para ofrecerle compañía y una perspectiva útil; validar con datos reales.`,
      metricsToReview: ['retención 0–1 s y 0–3 s', 'tiempo promedio', 'finalización', 'compartidos/envíos', 'guardados', 'comentarios', 'antigüedad de publicación comparable'],
      dataStatus: 'Hipótesis editorial; comparar publicaciones con antigüedad similar y no inferir tendencias de muestras pequeñas.'
    };
    episode.scenes = episode.scenes.slice(0, 5);
    episode.scenes.forEach((scene: any, index: number) => {
      scene.durationSec = 10;
      scene.sceneNumber = index + 1;
      scene.timeframe = `00:${String(index * 10).padStart(2, '0')}–00:${String((index + 1) * 10).padStart(2, '0')}`;
      scene.englishPromptWithSpanishDialogue = buildFlowPrompt(series, episode, scene);
      scene.imageToVideoPrompt = scene.englishPromptWithSpanishDialogue;
      scene.masterNetflixPrompt = scene.englishPromptWithSpanishDialogue;
      scene.flowPrompt = scene.englishPromptWithSpanishDialogue;
    });
    episode.contentHash = hashText(`${episode.hook}\n${episode.scenes.map((scene: any) => `${scene.action}|${scene.dialogueExchange.map((turn: any) => turn.dialogueSpanish).join('|')}`).join('\n')}`);
    episode.content_hash = episode.contentHash;
    if (allPrompts.has(episode.contentHash)) throw new Error('Se detectó un capítulo duplicado en la miniserie.');
    allPrompts.add(episode.contentHash);
  }
  series.seriesBible.generatedEpisodeIds = series.episodes.map((episode: any) => `${series.id}-C${String(episode.episodeNumber).padStart(2, '0')}`);
  series.seriesBible.lastEpisodeNumber = series.episodes.length;
  series.seriesBible.previousStateHash = series.episodes.length > 1 ? series.episodes[series.episodes.length - 2].contentHash : null;
  series.seriesBible.nextEpisodeSeed = series.episodes[series.episodes.length - 1]?.nextEpisodeSeed || '';
  series.seriesBible.version = 1;
}

export async function generateOpenSourceMiniseries(options: MiniseriesAgentOptions, provider = createConfiguredMiniseriesProvider()) {
  const normalized: MiniseriesAgentOptions = {
    ...options,
    topic: tidy(options.topic, 'Una historia de fe y esperanza'),
    totalParts: clampParts(options.totalParts),
    creativeApproach: options.creativeApproach || 'auto',
    videoFormat: options.videoFormat || 'auto',
    callToAction: options.callToAction ? makeSoftCTA(options.callToAction, '') : undefined
  };
  const series = createFallbackMiniseries(normalized);
  if (!provider) return { miniseries: series, provider: 'plantilla-local', isFallback: true };
  try {
    const systemPrompt = `Eres un agente de escritura y continuidad para microseries originales de fe, oración y esperanza. Sigue cada restricción del usuario. No imites obras, canales ni marcas. Devuelve solo JSON válido y nunca inventes una cita bíblica textual.\n\nFORMATO SELECCIONADO: ${series.videoFormatLabel}. ${series.seriesBible.videoFormatGuidance}\n\nREGLAS PRIORITARIAS DE SALIDA: Todas las instrucciones de producción que se incorporan a prompts Flow (acción, identidad, entorno, cámara, luz, actuación, audio y restricciones) deben escribirse en inglés. Conserva en español latinoamericano únicamente los diálogos hablados, títulos/captions SEO y comentarios de audiencia. El hook de cada capítulo tiene máximo ocho palabras, inicia literalmente el primer diálogo y comienza en el cuadro 0; la primera palabra audible debe ocurrir antes de 0,3 s. No abras con saludo, plano de establecimiento, fundido, título, logotipo ni zoom lento. Escribe cada capítulo con una apertura visual distinta y una sola pregunta reflexiva concreta en el copy. Usa las métricas como señales, no como promesas; compara publicaciones de antigüedad semejante y no generalices a partir de muestras pequeñas. ${FAITH_VIDEO_EXPERIMENT_NOTE}\n\n${BIBLICAL_VIDEO_CREATION_RULE}\n\n${SHAREABILITY_RULE}`;
    const output = await provider.completeJSON(systemPrompt, buildGenerationPrompt(normalized, series));
    mergeModelOutput(series, output);
    finalizeSeries(series);
    return { miniseries: series, provider: provider.id, isFallback: false };
  } catch (error: any) {
    console.warn(`[miniseries-agent:${provider.id}] generación estructurada no disponible; usando plantilla local.`, error?.message || '');
    return { miniseries: series, provider: 'plantilla-local', isFallback: true, warning: 'No se pudo usar el proveedor configurado; se generó una versión de respaldo local.' };
  }
}

export function buildLocalMiniseriesForTest(options: MiniseriesAgentOptions) {
  return createFallbackMiniseries(options);
}
