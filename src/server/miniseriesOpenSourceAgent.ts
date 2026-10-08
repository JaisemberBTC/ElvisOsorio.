import { createHash } from 'node:crypto';
import { buildFlowPrompt } from '../utils/flowPromptBuilder.ts';
import { SHAREABILITY_RULE } from '../skills/verticalMicrofictionSkill.ts';

export interface LLMProvider {
  readonly id: string;
  completeJSON(systemPrompt: string, userPrompt: string): Promise<unknown>;
}

export interface MiniseriesAgentOptions {
  topic?: string;
  totalParts?: number;
  category?: string;
  bibleReference?: string;
  lockedEnvironmentId?: string;
  customCharacters?: string;
  audiencePlatform?: string;
  tone?: string;
  callToAction?: string;
  noInclude?: string;
}

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
    id: 'protagonista_fe', name: 'Lucía Vega', role: 'Protagonista; busca la verdad y una forma de reparar el daño', apparentAge: '34 años', gender: 'femenino',
    skin: 'tono oliva medio con subtono cálido', face: 'rostro ovalado, pecas leves, ojos café oscuro', hair: 'cabello castaño oscuro, ondulado, a la altura de los hombros, raya lateral', build: 'complexión media, postura que pasa de tensa a abierta',
    wardrobe: 'suéter color terracota, camisa marfil y pantalón oscuro, sin cambios entre segmentos', accessories: 'anillo sencillo de plata en la mano derecha y bolso de lona marrón', voice: 'voz femenina adulta, cálida, algo ronca al emocionarse; español latinoamericano neutral',
    voicePresetName: 'voz femenina cálida y natural'
  },
  {
    id: 'companero_fe', name: 'Tomás Vega', role: 'Hermano y contraparte; oculta una verdad por miedo a perder a su familia', apparentAge: '38 años', gender: 'masculino',
    skin: 'tono moreno claro con subtono dorado', face: 'rostro rectangular, nariz recta, ojos café, una pequeña cicatriz en la ceja izquierda', hair: 'cabello negro corto con textura natural, barba de dos días', build: 'complexión delgada, hombros encorvados al inicio',
    wardrobe: 'chaqueta azul marino gastada, camiseta gris y jeans oscuros, sin cambios entre segmentos', accessories: 'reloj analógico negro en la muñeca izquierda', voice: 'voz masculina adulta de registro medio, respiración contenida; español latinoamericano neutral',
    voicePresetName: 'voz masculina serena y contenida'
  }
];

const ARC_BANK: Record<number, any[]> = {
  2: [
    { title: 'La carta que llegó mientras oraban', hook: '¿Quién dejó esta carta al lado de la Biblia hoy?', objective: 'mostrar la herida familiar y la decisión pendiente', conflict: 'Lucía encuentra una nota que contradice lo que su familia le contó', reveal: 'la nota prueba que alguien intentó reparar el daño en secreto', cliffhanger: 'un golpe en la puerta anuncia que la persona que falta ha vuelto' },
    { title: 'La verdad que nadie se atrevía a decir', hook: '¿Quién espera tras la puerta y aún no sabe pedir perdón?', objective: 'enfrentar la verdad y elegir el primer paso hacia la reconciliación', conflict: 'Lucía debe escuchar sin negar el daño ni prometer un final fácil', reveal: 'Tomás confiesa por qué guardó la carta', cliffhanger: 'la familia decide hablar de nuevo, aunque la reparación apenas empieza' }
  ],
  3: [
    { title: 'El nombre que faltaba en la carta', hook: '¿Por qué el nombre de mi padre está escrito aquí?', objective: 'presentar la herida y abrir una pregunta urgente', conflict: 'una carta antigua contradice el relato familiar', reveal: 'la firma coincide con la de alguien que todos creían ausente', cliffhanger: 'una llamada interrumpe la oración' },
    { title: 'La llamada que nadie quería contestar', hook: 'Ese teléfono no sonaba desde hace siete años; hoy vuelve.', objective: 'aumentar presión y revelar una pieza de la verdad', conflict: 'responder puede reabrir una herida que Lucía no ha sanado', reveal: 'Tomás conoce el origen del mensaje', cliffhanger: 'Lucía escucha una voz conocida al otro lado' },
    { title: 'La decisión que abre la puerta al perdón', hook: 'No puedo cambiar el pasado; sí decidiré qué hago ahora.', objective: 'dar una resolución emocional honesta y esperanzadora', conflict: 'perdonar no elimina las consecuencias ni garantiza reconciliación inmediata', reveal: 'la oración impulsa una conversación concreta y sincera', cliffhanger: 'la familia acuerda comenzar de nuevo, paso a paso' }
  ],
  4: [
    { title: 'La fotografía detrás de la Biblia', hook: 'Esa foto no debería estar escondida junto a la Biblia.', objective: 'introducir un secreto familiar y una pregunta emocional', conflict: 'Lucía descubre una señal de que alguien le ocultó una verdad', reveal: 'la fecha de la foto cambia lo que ella creía', cliffhanger: 'Tomás reconoce el lugar y se queda sin palabras' },
    { title: 'Una oración interrumpida por la verdad', hook: 'Tomás, dime por qué apareces en esta foto familiar antigua.', objective: 'poner a prueba la confianza entre hermanos', conflict: 'la respuesta amenaza con separar a la familia', reveal: 'Tomás admite que intentó proteger a alguien, pero empeoró el daño', cliffhanger: 'una llamada anuncia que esa persona está cerca' },
    { title: 'La puerta que nadie quería abrir', hook: 'Si abres, ya no podrás fingir que no lo sabes.', objective: 'llevar el conflicto a una decisión moral', conflict: 'Lucía puede escuchar la verdad o marcharse para siempre', reveal: 'la persona que regresa trae una disculpa, no una solución mágica', cliffhanger: 'Lucía decide escuchar, pero pone un límite claro' },
    { title: 'El primer paso después del silencio', hook: 'No te prometo olvidar; sí voy a escucharte esta noche.', objective: 'cerrar el arco con esperanza realista y un acto concreto', conflict: 'la confianza necesita tiempo y reparación', reveal: 'la familia acuerda buscar ayuda y hablar con honestidad', cliffhanger: 'la oración compartida marca el comienzo, no el final' }
  ],
  5: [
    { title: 'La carta que nadie debía encontrar', hook: 'Esta carta tiene una fecha de mañana… y mi nombre.', objective: 'crear una anomalía y presentar la herida central', conflict: 'Lucía sospecha que su familia le oculta algo', reveal: 'el papel fue escrito años atrás, pero alguien lo dejó hoy', cliffhanger: 'la letra al reverso pertenece a Tomás' },
    { title: 'El secreto que se sentó a la mesa', hook: 'Tomás, ¿por qué guardaste esto tanto tiempo sin decirme nada?', objective: 'confrontar al personaje que conoce parte de la verdad', conflict: 'una confesión puede romper el vínculo entre hermanos', reveal: 'Tomás actuó por miedo, no por maldad', cliffhanger: 'un audio guardado en el teléfono completa la pista' },
    { title: 'La voz que volvió después de siete años', hook: 'Esa voz no puede ser de quien estoy pensando ahora.', objective: 'revelar una verdad familiar y elevar el costo emocional', conflict: 'Lucía debe decidir si responde la llamada', reveal: 'la persona ausente quiere asumir responsabilidad', cliffhanger: 'anuncia que llegará esa misma noche' },
    { title: 'Perdonar no borra lo que ocurrió', hook: 'Si vienes a pedirme que olvide, no voy a abrir.', objective: 'poner límites y distinguir perdón de reconciliación automática', conflict: 'el encuentro exige verdad, escucha y responsabilidad', reveal: 'la disculpa incluye una acción concreta para reparar el daño', cliffhanger: 'Lucía acepta hablar, pero no sabe si podrá confiar' },
    { title: 'Una conversación para empezar de nuevo', hook: 'No todo está resuelto, pero hoy dejamos de escondernos juntos.', objective: 'cerrar con una respuesta espiritual y una esperanza plausible', conflict: 'la familia debe sostener el cambio después de la emoción', reveal: 'la oración se vuelve un compromiso cotidiano de verdad y cuidado', cliffhanger: 'la mesa vuelve a reunirlos, ahora con nuevos límites' }
  ]
};

function chooseLocation(topic: string, lockedEnvironmentId?: string) {
  if (lockedEnvironmentId) return `Entorno fijado por el usuario (${lockedEnvironmentId}), representado como un lugar real y contemporáneo`;
  if (/hospital|enfermedad|sanidad|m[eé]dico|cl[ií]nica/i.test(topic)) return 'sala de espera de un hospital de barrio en una ciudad latinoamericana';
  if (/deuda|desalojo|casa|alquiler|familia|padre|madre/i.test(topic)) return 'cocina modesta de un apartamento familiar en una ciudad latinoamericana';
  if (/duelo|p[eé]rdida|cementerio/i.test(topic)) return 'pequeña capilla de barrio y su patio, en una ciudad latinoamericana';
  return 'sala y cocina conectadas de una vivienda familiar contemporánea en una ciudad latinoamericana';
}

function characterRecord(base: any, customName?: string) {
  const name = customName || base.name;
  const visualIdentity = `${base.apparentAge}; piel ${base.skin}; ${base.face}; ${base.hair}; ${base.build}. Apariencia de persona real filmada en live-action.`;
  const exactModelSheetLockEn = `${name}, ${visualIdentity} Fixed wardrobe: ${base.wardrobe}. Fixed accessories: ${base.accessories}. Preserve the exact same actor identity, face, age, skin, hair, body, wardrobe and accessories in every shot. Photorealistic live-action human, no stylization.`;
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
  const topicHash = hashText(topic.toLocaleLowerCase('es'));
  const storySeed = hashText(`${topicHash}:${Date.now()}:${Math.random()}`);
  const totalParts = options.totalParts;
  const plans = ARC_BANK[totalParts];
  const userNames = (options.customCharacters || '').split(/[;,\n]/).map((part) => part.trim()).filter(Boolean);
  const protagonist = characterRecord(CHARACTER_BASES[0], userNames[0]);
  const companion = characterRecord(CHARACTER_BASES[1], userNames[1]);
  const characters = [protagonist, companion];
  const location = chooseLocation(topic, options.lockedEnvironmentId);
  const bibleReference = tidy(options.bibleReference, 'Salmo 34:18');
  const musicStyles = [
    { genre: 'piano íntimo con cuerdas graves y pulsos suaves', bpm: 72, key: 're menor que resuelve hacia fa mayor', motif: 'tres notas ascendentes que vuelven como respuesta emocional' },
    { genre: 'guitarra de nylon, cello cálido y textura ambiental original', bpm: 78, key: 'la menor con cierre luminoso', motif: 'arpegio breve de cinco notas que madura en cada capítulo' },
    { genre: 'piano de fieltro, viola y percusión orgánica muy discreta', bpm: 68, key: 'mi menor con resolución abierta', motif: 'nota repetida que se convierte en una frase esperanzadora' }
  ];
  const audioStyle = musicStyles[parseInt(storySeed.slice(0, 2), 16) % musicStyles.length];
  const uniqueMotif = `${audioStyle.motif}; firma de serie ${storySeed.slice(0, 6)}`;
  const outline = plans.map((plan, index) => ({ episodeNumber: index + 1, ...plan }));
  const seriesId = `feflow_${storySeed.slice(0, 12)}_${Date.now().toString(36)}`;
  const series: any = {
    id: seriesId,
    seriesTitle: topic.length > 64 ? `${topic.slice(0, 61).trim()}…` : topic,
    logline: `Microdrama original sobre ${topic.toLocaleLowerCase('es')}: una familia atraviesa una verdad difícil, la pone en oración y elige un paso concreto hacia la esperanza.`,
    category: options.category || 'prueba_fe',
    categoryLabel: 'Fe, oración y esperanza',
    totalPartsPlanned: totalParts,
    bannerHook: outline[0].hook,
    primaryCharacterIds: characters.map((character) => character.id),
    characters,
    castCount: characters.length,
    lockedEnvironmentId: options.lockedEnvironmentId || 'world_latin_family_home',
    lockedEnvironmentName: location,
    lockedEnvironmentPromptEn: `Photorealistic live-action contemporary Latin American family setting: ${location}.`,
    bibleReference,
    seriesBible: {
      seriesId,
      version: 1,
      theme: topic,
      faithApproach: 'La fe se expresa mediante oración, verdad, cuidado y decisiones observables; la esperanza no garantiza una solución milagrosa inmediata.',
      bibleReference,
      bibleUseNote: options.bibleReference
        ? 'Referencia indicada por el usuario. No insertar una cita textual hasta verificar la traducción elegida.'
        : 'Referencia temática sugerida: Salmo 34:18. Se usa como orientación, sin reproducir el versículo literalmente; verificar la traducción antes de publicar.',
      characterBible: characters.map(({ id, name, role, visualIdentity, wardrobe, accessories, voice }: any) => ({ id, name, role, visualIdentity, wardrobe, accessories, voice })),
      worldBible: {
        location,
        eraAndArchitecture: 'Época contemporánea; vivienda realista de clase trabajadora o media, materiales y utilería cotidianos, sin decorado fantástico.',
        timeOfDay: 'La tarde avanza hacia la noche a lo largo de la historia; mantener la hora coherente en cada capítulo.',
        weather: 'Clima templado, sin cambios de continuidad injustificados.',
        palette: 'ocres, terracotas y azules naturales; luz práctica cálida en interior y sombras neutras, sin resplandor mágico',
        cameraLanguage: 'cámara de observación íntima, 35 mm, movimientos discretos motivados por la acción y primeros planos para reacciones',
        lighting: 'luz disponible de ventana y lámparas domésticas; contraste cinematográfico natural',
        recurringProps: ['Biblia de tapas gastadas', 'sobre color crema', 'taza de cerámica azul', 'teléfono móvil con pantalla sin texto legible'],
        continuityRule: 'El mismo espacio, distribución, muebles, objetos y ejes de cámara permanecen constantes en toda la serie.'
      },
      audioBible: {
        originalScore: `Tema musical original ${storySeed.slice(0, 6)}: ${audioStyle.genre}; ${audioStyle.bpm} BPM; ${audioStyle.key}; motivo ${uniqueMotif}.`,
        genre: audioStyle.genre,
        bpm: audioStyle.bpm,
        key: audioStyle.key,
        signatureMotif: uniqueMotif,
        mixNotes: 'voces al frente; música -18 a -22 dB bajo los diálogos; sin letra, loops comerciales ni cambios bruscos de volumen',
        episodeVariations: outline.map((plan, index) => `Capítulo ${index + 1}: variar intensidad y registro según el giro de «${plan.title}», manteniendo el mismo motivo musical.`)
      },
      episodeOutline: outline,
      generatedEpisodeIds: [],
      lastEpisodeNumber: totalParts,
      nextEpisodeSeed: `Coda posterior a ${outline[totalParts - 1].title}: una decisión cotidiana que sostiene la esperanza`,
      usedHooks: outline.map((plan) => plan.hook),
      audienceShareabilityRule: SHAREABILITY_RULE,
      continuityLock: true
    },
    episodes: [] as any[]
  };

  const sceneActions = (plan: any, episodeNumber: number) => [
    `En el primer segundo, ${protagonist.name} encuentra el sobre color crema junto a la Biblia abierta; el temblor de su mano deja ver el miedo a una verdad familiar. ${companion.name} está frente a ella y le acerca la mano sin presionarla. ${protagonist.name} decide abrirlo acompañada: la escena transforma aislamiento en apoyo, aunque el secreto siga pendiente. La imagen plantea la pregunta del capítulo «${plan.hook}».`,
    `${companion.name} reconoce la letra del sobre y admite que lleva años ocultando una parte de la historia. Una mirada y una mano que se detiene revelan que ambos conocen el costo de esa verdad.`,
    `${protagonist.name} abre el sobre y encuentra una fotografía familiar doblada y una fecha escrita a mano. ${companion.name} baja la mirada; una llamada vibra sobre la mesa, sin texto legible.`,
    `La conversación se vuelve más tensa. ${protagonist.name} respira, mira la Biblia y hace una oración breve en voz baja; ${companion.name} responde con una verdad concreta, sin atribuir palabras inventadas a Dios.`,
    episodeNumber < totalParts
      ? `${protagonist.name} decide no destruir la carta. El teléfono vuelve a vibrar y ambos miran hacia la puerta. Cortar justo antes de saber quién llegó, dejando causalmente abierto el capítulo siguiente: ${plan.cliffhanger}.`
      : `${protagonist.name} y ${companion.name} ponen la carta sobre la mesa y acuerdan hablar con honestidad y buscar ayuda si la necesitan. No todo queda resuelto; el gesto inicia una reparación realista. Cerrar con alivio sobrio y esperanza.`
  ];
  const sceneDialogues = (plan: any, episodeNumber: number) => {
    const hookWords = spokenWordCount(plan.hook);
    const openingReply = hookWords >= 12
      ? 'Respira; no estás sola. Vamos paso a paso.'
      : hookWords >= 11
        ? 'Respira; no estás sola, me quedo aquí contigo ahora.'
        : 'Respira; no tienes que abrir esa carta completamente sola hoy.';
    return [
      [[protagonist.name, plan.hook], [companion.name, openingReply]],
      [[companion.name, 'Reconozco esta letra; lleva años escondiendo un secreto de familia.'], [protagonist.name, 'Mira la firma; dime si también recuerdas a quién pertenece.']],
      [[protagonist.name, 'Le pedí a Dios claridad, no que todo cambiara hoy.'], [companion.name, 'La fecha de esta foto cambia todo lo que sabíamos.']],
      [[companion.name, 'Me equivoqué al callar y no voy a justificarlo más.'], [protagonist.name, 'No puedo borrar el pasado, pero hoy sí quiero escucharte.']],
      episodeNumber < totalParts
        ? [[protagonist.name, 'No sé quién espera detrás de la puerta; tengo miedo.'], [companion.name, 'Quédate conmigo; juntos vamos a escuchar la verdad que llegue.']]
        : [[protagonist.name, 'No todo sanó hoy, pero ya no cargo esto sola.'], [companion.name, 'Mañana seguimos hablando; hoy elegimos la verdad y la paciencia.']]
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
        emotionalTone: turnIndex === 0 ? 'urgencia íntima, natural y contenida' : 'respuesta humana, fluida y con subtexto',
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
        camera: sceneIndex === 0 ? 'primer plano del objeto que se abre a un primer plano de la reacción, sin corte' : 'plano medio cercano en eje de 180 grados, alternando miradas dentro de la misma toma',
        lens: '35 mm cinematográfico, perspectiva natural, profundidad de campo moderada',
        cameraMovement: sceneIndex === 0 ? 'acercamiento lento y motivado hacia la carta' : 'desplazamiento lateral muy leve, físicamente posible y continuo',
        lighting: 'luz cálida de lámpara doméstica y sombras suaves; mantener la misma dirección de luz entre segmentos',
        performance: 'microexpresiones, pausas breves y respiración real; lágrimas solo si la emoción las justifica',
        dialogueExchange,
        narration: '',
        subtitleSuggestion: sceneIndex === 0 ? plan.hook : dialogueExchange[0].dialogueSpanish,
        onScreenText: sceneIndex === 0 ? plan.hook : '',
        sfx: sceneIndex === 0 ? 'papel rozando la mesa, taza que termina de asentarse, ambiente doméstico tenue' : 'ambiente interior realista, respiración y vibración corta del teléfono cuando corresponda',
        bgMusicMood: `${audioStyle.genre}; ${audioStyle.bpm} BPM; variante de ${uniqueMotif}; intensidad emocional ${['suspenso suave', 'expectativa', 'revelación', 'decisión', 'alivio sobrio'][sceneIndex]}`,
        negativePrompt: options.noInclude || 'sin violencia gráfica, sin lenguaje vulgar, sin estética de caricatura, sin milagros visuales garantizados ni texto ilegible'
      };
    });
    const socialPackage = {
      youtubeTitle: `${plan.title} | Miniserie de fe y oración — Capítulo ${episodeNumber}`,
      facebookTitle: `${plan.title}: una historia de fe, familia y perdón (Capítulo ${episodeNumber})`,
      tiktokTitle: `${plan.title} | Parte ${episodeNumber} de ${totalParts}`,
      caption: `${plan.hook}\n\nCapítulo ${episodeNumber} de ${totalParts}. Una historia original sobre ${topic.toLocaleLowerCase('es')}, oración y esperanza realista. Si conoces a alguien que necesita sentirse acompañado ante una verdad difícil, puedes enviársela como un gesto de apoyo. ${episodeNumber < totalParts ? `El siguiente capítulo continúa: ${plan.cliffhanger}` : 'La reparación comienza con una conversación honesta.'}`,
      hashtags: ['#MiniserieDeFe', '#Oracion', '#HistoriasDeFe', '#Esperanza', `#Capitulo${episodeNumber}`, '#FeEnLaVidaReal'],
      pinnedComment: '¿Qué paso pequeño te ha ayudado a recuperar la esperanza?',
      seoKeywords: ['miniserie cristiana', 'historia de fe y oración', 'esperanza en familia', 'microdrama de fe', plan.title.toLocaleLowerCase('es')],
      searchQueries: [`historia de fe sobre ${topic}`, 'miniserie cristiana de oración y esperanza'],
      thumbnailHook: plan.hook,
      suggestedAudio: `${audioStyle.genre}, ${audioStyle.bpm} BPM, motivo original ${storySeed.slice(0, 6)}`
    };
    const episode: any = {
      episodeNumber,
      episodeTitle: plan.title,
      hook: plan.hook,
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
        metricsToReview: ['retención 0–3 s', 'tiempo promedio', 'finalización', 'compartidos/envíos', 'guardados', 'comentarios'],
        dataStatus: 'Hipótesis editorial; no equivale a datos medidos de audiencia.'
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
  const outline = series.seriesBible.episodeOutline.map((episode: any) => ({
    episodeNumber: episode.episodeNumber,
    plannedTitle: episode.title,
    objective: episode.objective,
    conflict: episode.conflict,
    reveal: episode.reveal,
    cliffhanger: episode.cliffhanger
  }));
  return `Tema del usuario: ${tidy(options.topic, 'fe, oración y esperanza')}\nNúmero exacto de capítulos: ${series.totalPartsPlanned} (permitido únicamente 2–5).\nBase bíblica solicitada: ${tidy(options.bibleReference, 'proponer una referencia temática, sin citar texto literal')}\nTono: ${tidy(options.tone, 'humano, reverente, cinematográfico, emocional sin manipulación')}\nCTA: ${tidy(options.callToAction, 'pregunta reflexiva suave, opcional y al final del copy SEO')}\nNo incluir: ${tidy(options.noInclude, 'violencia gráfica, lenguaje vulgar, promesas de milagros garantizados, logos, marcas de agua, caricatura')}\nPlataforma: ${tidy(options.audiencePlatform, 'TikTok/Reels/Shorts verticales')}\n\nBiblia de continuidad y plan completo previo:\n${JSON.stringify({ seriesTitle: series.seriesTitle, logline: series.logline, characters: series.characters.map((character: any) => ({ name: character.name, role: character.role, visualIdentity: character.visualIdentity, wardrobe: character.wardrobe, accessories: character.accessories, voice: character.voice })), worldBible: series.seriesBible.worldBible, audioBible: series.seriesBible.audioBible, episodeOutline: outline }, null, 2)}\n\nDevuelve únicamente un objeto JSON, sin Markdown, con esta forma:\n{\n  "seriesTitle": "...", "logline": "...", "bannerHook": "...", "bibleReference": "...", "bibleUseNote": "...",\n  "characters": [{"id":"protagonista_fe","name":"...","role":"...","apparentAge":"...","skin":"...","face":"...","hair":"...","build":"...","wardrobe":"...","accessories":"...","voice":"..."}],\n  "worldBible": {"location":"...","eraAndArchitecture":"...","timeOfDay":"...","weather":"...","palette":"...","cameraLanguage":"...","lighting":"...","recurringProps":["..."]},\n  "audioBible": {"originalScore":"...","genre":"...","bpm":72,"key":"...","signatureMotif":"...","mixNotes":"...","episodeVariations":["..."]},\n  "episodeOutline": [{"episodeNumber":1,"title":"...","objective":"...","conflict":"...","reveal":"...","cliffhanger":"..."}],\n  "episodes": [{"episodeNumber":1,"episodeTitle":"...","hook":"...","objective":"...","conflict":"...","escalation":"...","twist":"...","cliffhanger":"...",\n    "scenes": [{"sceneNumber":1,"action":"...","environment":"...","camera":"...","lens":"...","cameraMovement":"...","lighting":"...","performance":"...","dialogueExchange":[{"speakerName":"...","dialogueSpanish":"...","timeWindow":"00:00.0–00:04.6","emotionalTone":"..."},{"speakerName":"...","dialogueSpanish":"...","timeWindow":"00:04.6–00:09.2","emotionalTone":"..."}],"narration":"","sfx":"...","bgMusicMood":"...","subtitleSuggestion":"..."}],\n    "socialPackage": {"youtubeTitle":"...","facebookTitle":"...","tiktokTitle":"...","caption":"...","hashtags":["..."],"pinnedComment":"...","seoKeywords":["..."],"searchQueries":["..."],"thumbnailHook":"...","suggestedAudio":"..."}}]\n}\n\nReglas obligatorias:\n- Devuelve exactamente ${series.totalPartsPlanned} capítulos y exactamente cinco escenas por capítulo; cada escena dura 10 s, para 50 s por capítulo. No cambies el plan general de continuidad ni el orden causal.\n- Cada escena debe incluir exactamente dos turnos conversacionales, uno por cada personaje visible, con 19–20 palabras habladas en total y 9–11 por turno. Usa español latinoamericano natural a unas 2,1 palabras por segundo: el diálogo debe ocupar aproximadamente 9,2 de los 10 segundos (92%), sin silencios largos ni velocidad artificial. El servidor ajustará las ventanas proporcionalmente. La primera frase del primer segmento debe ser un hook inmediato.\n- Cada capítulo tiene objetivo, conflicto, escalada, giro y cierre/cliffhanger causalmente distintos. No repitas hook, revelación, escenario de apertura ni acción clave.\n- Mantén los mismos actores humanos hiperrealistas, rostros, edades aparentes, piel, cabello, complexión, vestuario, accesorios y voces en los cinco segmentos y en todos los capítulos. Máximo tres personajes principales por escena.\n- Mantén el mismo entorno, luz, paleta, utilería y eje de cámara; cambia solo lo exigido por la acción. Movimiento físicamente posible, cámara cinematográfica y actuación contenida.\n- Música original única de esta serie, con género, BPM, instrumentos, motivo y cambios de intensidad por escena; SFX y ambiente también deben quedar especificados en cada segmento. No usar canciones comerciales, marcas ni imitar artistas.\n- El nicho es fe, oración y versículos. La fe debe expresarse mediante decisiones y vida cotidiana; no prometas resultados milagrosos. No atribuyas ficción como cita textual a Dios, Jesús o la Biblia. Si parafraseas, indícalo y no inventes referencias.\n- No copies personajes, tramas, frases, música, imágenes, marcas ni estilo visual de cuentas existentes. Usa solo recursos narrativos generales: problema inmediato, curiosidad dosificada, escalada, revelación y continuidad entre partes.\n- Cada capítulo necesita SEO propio para TikTok, Facebook y YouTube: títulos, descripción/caption, palabras clave, hashtags, hook de miniatura y comentario fijado. Sin clickbait engañoso ni CTA insistente.\n- Los prompts se completarán con una plantilla Flow autosuficiente; describe acción, cámara, luz, actuación y audio en los campos anteriores.`;
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
      merged.visualIdentity = `${merged.apparentAge}; piel ${merged.skin}; ${merged.face}; ${merged.hair}; ${merged.build}. Apariencia de persona real filmada en live-action.`;
      merged.shortDescription = merged.visualIdentity;
      merged.description = merged.visualIdentity;
      merged.clothingStyle = merged.wardrobe;
      merged.lockedWardrobeDesc = merged.wardrobe;
      merged.fixedIdentityPrompt = `${merged.name}: ${merged.visualIdentity} Vestuario fijo: ${merged.wardrobe}. Accesorios: ${merged.accessories}.`;
      merged.exactModelSheetLockEn = `${merged.name}, ${merged.visualIdentity} Fixed wardrobe: ${merged.wardrobe}. Fixed accessories: ${merged.accessories}. Preserve exact identity and live-action photorealism in every shot.`;
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
    for (const [key, sourceKey] of [['episodeTitle', 'episodeTitle'], ['hook', 'hook'], ['objective', 'objective'], ['conflict', 'conflict'], ['escalation', 'escalation'], ['twist', 'twist'], ['cliffhanger', 'cliffhanger']]) {
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
        merged.dialogueExchange = timeDialogueTurns(normalizedTurns);
        if (
          distinctVoices.size < 2 ||
          spokenWordCountTotal < 19 || spokenWordCountTotal > 20 ||
          turnWordCounts.some((count: number) => count < 9 || count > 11)
        ) merged.dialogueExchange = fallbackScene.dialogueExchange;
      }
      merged.timeframe = `00:${String(index * 10).padStart(2, '0')}–00:${String((index + 1) * 10).padStart(2, '0')}`;
      merged.durationSec = 10;
      merged.sceneNumber = index + 1;
      merged.charactersInShot = [...new Set(merged.dialogueExchange.map((turn: any) => turn.speakerId))];
      merged.onScreenText = tidy(merged.subtitleSuggestion, '');
      return merged;
    });

    if (source.socialPackage && typeof source.socialPackage === 'object') {
      episode.socialPackage = { ...episode.socialPackage, ...source.socialPackage };
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
      metricsToReview: ['retención 0–3 s', 'tiempo promedio', 'finalización', 'compartidos/envíos', 'guardados', 'comentarios'],
      dataStatus: 'Hipótesis editorial; usar datos reales cuando estén disponibles y no inventar resultados.'
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
    totalParts: clampParts(options.totalParts)
  };
  const series = createFallbackMiniseries(normalized);
  if (!provider) return { miniseries: series, provider: 'plantilla-local', isFallback: true };
  try {
    const systemPrompt = `Eres un agente de escritura y continuidad para microseries originales de fe, oración y esperanza. Sigue cada restricción del usuario. No imites obras, canales ni marcas. Devuelve solo JSON válido y nunca inventes una cita bíblica textual.\n\n${SHAREABILITY_RULE}`;
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
