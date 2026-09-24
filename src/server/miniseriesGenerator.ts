import { GoogleGenAI, Type } from "@google/genai";
import { CARTOON_CHARACTERS_FE, SERIES_ENVIRONMENTS_FE, type ScenographyDirection, type EpisodeSEO, type CartoonCharacter } from "../data/cartoonCharactersFe.ts";
import { syncScenePromptWithExactDialogue, buildCanonicalDialogueBlock } from "../utils/dialoguePromptSync.ts";
import { getPrioritizedModels, demoteModel } from "./geminiResilience.ts";
import { 
  detectStoryProtagonistAndCast, 
  generateUniqueCastForTopic,
  cartoonCharacterFromDynamic,
  generateActionSpecificFoleySounds,
  generateUniqueScenographyForTopic, 
  generateContextualSceneDialogueArc,
  calibrateAndPaceDialogue, 
  countWordsSpanish, 
  type ProtagonistCast, 
  type DynamicCastEnsemble,
  type DynamicStoryCharacter,
  type UniqueScenography 
} from "../utils/miniseriesDomain.ts";

export { detectStoryProtagonistAndCast, generateUniqueCastForTopic, cartoonCharacterFromDynamic, generateActionSpecificFoleySounds, generateUniqueScenographyForTopic, generateContextualSceneDialogueArc, calibrateAndPaceDialogue, countWordsSpanish };
export type { ProtagonistCast, DynamicCastEnsemble, DynamicStoryCharacter, UniqueScenography };

export interface MiniseriesGenerationRequest {
  topic: string;
  totalParts?: number;
  category?: string;
  lockedEnvironmentId?: string;
}

export interface GeneratedDialogueTurn {
  speakerName: string;
  speakerId: string;
  role?: string;
  timeWindow?: string;
  allocatedSeconds?: number;
  wordCount?: number;
  wordsPerSecond?: number;
  pacingStatus?: 'perfecto' | 'óptimo' | 'ajustado';
  dialogueSpanish: string;
  emotionalTone: string;
  voicePresetName?: string;
}

export interface GeneratedMiniserieScene {
  sceneNumber: number;
  durationSec: number;
  characterId: string;
  secondaryCharacterId?: string;
  charactersInShot: string[];
  interactionType: 'dos_personajes_frente_a_frente' | 'abrazo_consuelo' | 'encuentro_con_jesus' | 'plano_conjunto_familiar' | 'reaccion_asombro' | 'confrontacion_redencion';
  timeframe: string;
  action: string;
  dialogueExchange: GeneratedDialogueTurn[];
  narration: string;
  onScreenText: string;
  secondaryLabel: string;
  imageToVideoPrompt: string;
  englishPromptWithSpanishDialogue: string;
  masterNetflixPrompt?: string;
  lockedEnvironmentId?: string;
  lockedEnvironmentName?: string;
  lockedEnvironmentPromptEn?: string;
  scenographyDetails?: {
    exactLocation: string;
    narrativeProps: string;
    lightingSetup: string;
    spatialPlacement: string;
  };
  sfx: string;
  sfxTimeline?: {
    atSecond: string;
    sound: string;
    purpose: string;
  }[];
  transitionToNext?: string;
  transitionType?: string;
  bgMusicMood: string;
}

export interface GeneratedMiniserieEpisode {
  episodeNumber: number;
  episodeTitle: string;
  hook: string;
  conflict: string;
  escalation: string;
  cliffhanger: string;
  lockedEnvironmentId?: string;
  lockedEnvironmentName?: string;
  lockedEnvironmentPromptEn?: string;
  scenographyStage?: {
    stageName: string;
    environmentState: string;
    lightingState: string;
    objectsState: string;
  };
  scenes: GeneratedMiniserieScene[];
  socialPackage: EpisodeSEO;
}

export interface GeneratedMiniseriesPackage {
  id: string;
  seriesTitle: string;
  logline: string;
  category: string;
  categoryLabel: string;
  totalPartsPlanned: number;
  bannerHook: string;
  primaryCharacterIds: string[];
  characters?: CartoonCharacter[];
  castCount?: number;
  lockedEnvironmentId?: string;
  lockedEnvironmentName?: string;
  lockedEnvironmentPromptEn?: string;
  scenographyDirection?: ScenographyDirection;
  episodes: GeneratedMiniserieEpisode[];
}

/**
 * Builds a robust, context-aware fallback miniseries.
 * - Respects female vs male protagonist strictly.
 * - Synthesizes a UNIQUE scenario for the story topic.
 * - Divides the 10-second scene time among 2 or 3+ characters (multi-person coral dialogues).
 * - Generates ALL requested chapters (e.g. 2, 3, or 4 parts) with progressive non-repeated storylines!
 */
export function buildFallbackMiniseries(
  topic: string,
  totalParts: number = 3,
  category: string = "milagro_familiar",
  requestedEnvId?: string
): GeneratedMiniseriesPackage {
  const cleanTopic = topic.trim() || "El milagro que nadie esperaba";
  const dynamicCast = generateUniqueCastForTopic(cleanTopic, category);
  const partsCount = Math.max(2, Math.min(4, Number(totalParts) || 3));

  // Dynamic characters array and UI-ready CartoonCharacter objects
  const dynamicChars = dynamicCast.characters;
  const uiCharacters: CartoonCharacter[] = dynamicChars.map(d => cartoonCharacterFromDynamic(d));

  const cast = detectStoryProtagonistAndCast(cleanTopic, category);

  // Generate unique scenario or find requested
  let env = requestedEnvId ? (SERIES_ENVIRONMENTS_FE.find(e => e.id === requestedEnvId) || generateUniqueScenographyForTopic(cleanTopic, category, cast)) : generateUniqueScenographyForTopic(cleanTopic, category, cast);

  const jesusChar = CARTOON_CHARACTERS_FE.find(c => c.id === 'jesus_cartoon_3d')!;
  const protagonist = cast.protagonist;
  const supporting = cast.supporting;

  const envLockTag = `[LOCKED ENVIRONMENT - ${env.shortTag}]: ${env.architecturePromptEn} Lighting: ${env.lightingSetup}. Props: ${env.propsAndAtmosphere}. EXACT SAME ROOM AND PROPS IN ALL SCENES.`;
  const charJesusLock = `[LOCKED CHARACTER - JESUS]: ${jesusChar.exactModelSheetLockEn}`;
  const charProtagonistLock = `[LOCKED CHARACTER - ${protagonist.name.toUpperCase()}]: ${protagonist.modelSheetLockEn}`;
  const charSupportingLock = `[LOCKED CHARACTER - ${supporting.name.toUpperCase()}]: ${supporting.modelSheetLockEn}`;
  const negativeLock = `[NEGATIVE CONTINUITY PROMPT: ${env.negativePromptEn}, no changes in character clothing, no change of hairstyle, no facial morphing, no extra limbs, no camera jump cuts]`;

  const seriesId = `miniserie_${Date.now()}`;

  // Build the requested number of episodes with progressive narrative arcs
  const episodes: GeneratedMiniserieEpisode[] = Array.from({ length: partsCount }).map((_, epIdx) => {
    const epNum = epIdx + 1;
    const isFirst = epNum === 1;
    const isLast = epNum === partsCount;

    let epTitle = `Parte ${epNum}: El Clamor en el Dolor y la Impotencia Humana`;
    if (epNum === 2) epTitle = `Parte ${epNum}: El Encuentro Revelador y la Prueba de Fe`;
    if (epNum === 3) epTitle = isLast ? `Parte ${epNum}: El Gran Milagro Sobrenatural y la Gloria de Dios` : `Parte ${epNum}: La Batalla Espiritual y la Victoria`;
    if (epNum === 4) epTitle = `Parte ${epNum}: Desenlace Glorioso, Restauración Total y Testimonio`;

    const scenographyStage = {
      stageName: isFirst ? 'Penumbra, Dolor & Clamor Inicial' : isLast ? 'Luz Divina Plena & Restauración Total' : 'La Luz Rompe la Oscuridad',
      environmentState: isFirst 
        ? `En ${env.name}, la atmósfera es fría y sobrecogedora. Sombras densas cubren el espacio, reflejando el dolor insoportable de la prueba.`
        : isLast
        ? `En ${env.name}, la gloria matutina y celestial inunda cada rincón a 5500K. Los objetos y el espacio irradian paz divina y restauración eterna.`
        : `En ${env.name}, el resplandor de Jesús penetra creando un fuerte claroscuro que disipa el temor y renueva la atmósfera.`,
      lightingState: isFirst ? '2700K sombras alargadas y penumbra de medianoche' : isLast ? '5500K luz dorada celestial omnidireccional y partículas de gloria' : '3400K contraluz divino cálido alrededor de Jesús',
      objectsState: isFirst ? 'Escrituras cerradas, vela temblorosa a punto de apagarse' : isLast ? 'Biblia abierta resplandeciendo, vasijas u objetos rebosantes de bendición' : 'Vela reavivada con llama firme y dorada'
    };

    // 5 scenes per episode, dynamically synthesized based on topic, category, characters, and scenario
    const scenes: GeneratedMiniserieScene[] = generateContextualSceneDialogueArc(
      cleanTopic,
      category,
      cast,
      env,
      epNum,
      partsCount
    );

    return {
      episodeNumber: epNum,
      episodeTitle: epTitle,
      hook: isFirst
        ? `Nadie imaginaba lo que estaba a punto de suceder con "${cleanTopic}". Cuando todo parecía perdido, Jesús apareció.`
        : `A la mañana siguiente, lo que ocurrió con ${protagonist.name} dejó a todos con la boca abierta. Jesús no había terminado aún.`,
      conflict: `La familia o persona enfrenta la imposibilidad de "${cleanTopic}", agotando todo recurso humano.`,
      escalation: `La prueba sube de intensidad hasta que un clamor sincero a Jesús abre los cielos.`,
      cliffhanger: isLast
        ? `El milagro se consumó. Dios restauró lo que el enemigo quiso destruir. Deja tu AMÉN si crees en el poder de Jesús hoy.`
        : `Cuando pensaban que todo había terminado, el Maestro les reveló algo que cambiaría sus vidas... ¿Qué pasará? Descúbrelo en la PARTE ${epNum + 1}.`,
      lockedEnvironmentId: env.id,
      lockedEnvironmentName: env.name,
      lockedEnvironmentPromptEn: env.architecturePromptEn,
      scenographyStage,
      scenes,
      socialPackage: {
        youtubeTitle: `🔴 ${cleanTopic.slice(0, 42)} (Parte ${epNum}) #MiniserieDeFe #Jesus`,
        facebookTitle: `Lo que Jesús hizo cuando todo parecía perdido te llenará de lágrimas de fe (Parte ${epNum})`,
        tiktokTitle: `¿Qué harías si Jesús entra a tu casa en tu peor momento? (Parte ${epNum})`,
        caption: `¿Estás pasando por un momento difícil? Mira cómo Jesús intervino en esta historia de fe sobre "${cleanTopic}".\n\n📖 "Cree solamente, y será salva" - Lucas 8:50\n\n👉 Escribe "AMÉN" y comparte este video con tu familia.\n👉 Comenta "PARTE ${epNum + 1}" para ver el siguiente capítulo.`,
        hashtags: ['#MiniserieDeFe', `#Parte${epNum}`, '#JesusEsReal', '#MilagroDeDios', '#OracionYFe', '#HistoriasDeFe', '#TikTokCristiano', '#DiosTeAma'],
        pinnedComment: `Escribe tu petición aquí abajo y declara: "Jesús, yo creo en Tu poder para mi familia". Amén.`,
        seoKeywords: [
          'Jesús hace milagros',
          'serie cristiana animada 3d',
          'clamor en aflicción',
          'oracion de la noche',
          'testimonio real de fe',
          'historias biblicas animadas pixar'
        ],
        searchQueries: [
          'oracion a jesus cuando no hay esperanza',
          `serie de fe capitulo ${epNum}`,
          'milagro de jesus en la familia',
          'dios hace lo imposible'
        ],
        thumbnailHook: `LO QUE JESÚS HIZO EN "${cleanTopic.toUpperCase().slice(0, 24)}" • PARTE ${epNum}`,
        suggestedAudio: 'Worship Cinematic Ambient Piano & Strings 432Hz'
      }
    };
  });

  const scenographyDirection: ScenographyDirection = {
    scriptAnalysis: {
      location: env.name,
      historicalEra: 'Bíblica contemporánea con resonancia espiritual universal',
      whoInhabits: `Espacio íntimo habitado por ${protagonist.name} y ${supporting.name}, marcado por la memoria y la fe probada.`,
      currentSituation: `Crisis extrema vinculada a "${cleanTopic}", donde la desesperación humana da paso a un clamor sincero a Jesús.`,
      conveyedEmotion: 'Dolor y quebranto inicial, seguido de asombro sobrenatural, reverencia sagrada y paz transformadora.',
      keyNarrativeObjects: ['Biblia familiar de madera y cuero', 'Vela de aceite titilante', 'Mesa rústica de clamor', 'Cruz de madera tallada en la pared'],
      evolutionThroughSeries: 'Evolución dramática: de la penumbra fría y sombras de aflicción en la Parte 1 al resplandor celestial y luz dorada de amanecer en la Parte final.'
    },
    directorsVision: {
      tone: 'Drama espiritual con clímax milagroso y teofanía de Jesús.',
      animationStyle: 'Animación 3D cinematográfica estilo Pixar/DreamWorks de alta fidelidad, con texturas táctiles, expresiones hiper-emotivas y renderizado Octane 8K.',
      atmosphere: 'Íntima y sagrada, con claroscuros dramáticos y haces de luz volumétrica dorada que rompen la oscuridad del recinto.'
    },
    visualIdentity: {
      dominantColors: ['#0F172A (Azul Medianoche)', '#78350F (Roble Rústico)', '#F59E0B (Dorado Celestial)', '#F8FAFC (Lino Crudo)'],
      furnitureTypes: 'Mesa maciza de roble con vetas profundas, sillas de pino artesanales, alacena austera y ventana con marco de piedra.',
      materialsAndTextures: 'Madera curtida, lino crudo, barro cocido, piedra arenisca y metal oxidado en bisagras.',
      lightingDesign: 'Comienza en luz fría de luna (2800K azulada) y evoluciona hacia luz volumétrica dorada cálida (3200K - 5500K) emitida por el aura de Jesús.',
      recurringProps: ['Biblia con marcapáginas de cinta roja', 'Lámpara de arcilla con llama viva', 'Cruz en la pared de fondo']
    },
    characterPersonalSpaces: [
      {
        characterName: protagonist.name,
        environmentConnection: `Su espacio refleja su abatimiento: la silla en sombras y la mesa que expresa su dolor.`
      },
      {
        characterName: 'Maestro Jesús',
        environmentConnection: 'Su presencia altera el espacio: una columna de luz dorada penetra con Él, iluminando los objetos opacos y trayendo armonía visible.'
      }
    ],
    narrativeObjects: [
      {
        objectName: 'La Biblia Familiar',
        symbolism: 'La promesa y fidelidad eterna de Dios',
        narrativeRole: 'Permanece cerrada en la angustia inicial; tras la palabra de Jesús, se abre reflejando un brillo celestial.'
      },
      {
        objectName: 'La Lámpara de Aceite',
        symbolism: 'La fe que vacila pero no se apaga',
        narrativeRole: 'Su llama titila con debilidad en el momento de mayor aflicción; al extender Jesús Su mano, arde con fuerza y calma.'
      },
      {
        objectName: 'La Cruz en la Pared',
        symbolism: 'El ancla de esperanza y pacto en el hogar',
        narrativeRole: 'Punto de referencia espacial fijo en todos los planos continuos para asegurar continuidad cinematográfica perfecta.'
      }
    ],
    scenographyEvolutionByEpisode: [
      {
        episodeNumber: 1,
        stageName: 'Penumbra & Aflicción Humana',
        environmentState: `En ${env.name}, la habitación está sumida en sombras frías. La atmósfera es densa y solitaria.`,
        lightingState: 'Luz de luna fría entrando por la ventana, sombras largas y claroscuro melancólico.',
        objectsState: 'Biblia cerrada sobre la mesa de roble, vela vacilante solitaria.'
      },
      {
        episodeNumber: 2,
        stageName: 'La Presencia Divina Rompe la Oscuridad',
        environmentState: `Jesús entra en ${env.name}. Un haz de luz dorada celestial transforma la textura de las paredes.`,
        lightingState: 'Contraluz dramático con resplandor dorado celestial (3200K) contrastando con la penumbra previa.',
        objectsState: 'La llama de la vela cobra vigor y las páginas de la Biblia se iluminan suavemente.'
      },
      {
        episodeNumber: partsCount,
        stageName: 'Amanecer de Gloria & Restauración Total',
        environmentState: `En ${env.name}, la habitación entera queda inundada de luz matutina cálida y bendición celestial.`,
        lightingState: 'Luz omnidireccional cálida y brillante (5500K) con partículas doradas de paz flotando.',
        objectsState: 'La Biblia abierta de par en par, la mesa ordenada y el espacio lleno de vida y gozo.'
      }
    ],
    departmentCoordination: {
      wardrobeHarmony: 'El lino blanco crudo y manto azul cielo de Jesús resaltan con pureza contra la madera oscura del fondo.',
      lightingAndColorPalette: 'Gradación cromática de tonos fríos de luto hacia dorados cálidos de resurrección.',
      cameraAndAtmosphere: 'Movimientos verticales 9:16 lentos, dignos y reverentes, sin cortes rápidos.',
      soundDesignSync: 'SFX sutiles de crujido de madera y viento frío que se transforman en acordes de arpa, piano en 432Hz y campanada celestial.'
    }
  };

  return {
    id: seriesId,
    seriesTitle: cleanTopic.slice(0, 50),
    logline: `Miniserie de fe serializada con continuidad cinematográfica Netflix: ${cleanTopic}. Una historia dramática y conmovedora donde Jesucristo aparece como protagonista trayendo salvación y milagros.`,
    category,
    categoryLabel: 'Milagro & Intervención de Jesús',
    totalPartsPlanned: partsCount,
    bannerHook: `🔴 LO QUE JESÚS HIZO CUANDO PARECÍA EL FINAL • ${cleanTopic.toUpperCase().slice(0, 30)}`,
    primaryCharacterIds: ['jesus_cartoon_3d', ...dynamicChars.map(c => c.id)],
    characters: uiCharacters,
    castCount: dynamicCast.castSize,
    lockedEnvironmentId: env.id,
    lockedEnvironmentName: env.name,
    lockedEnvironmentTag: env.tag,
    lockedEnvironmentPromptEn: env.architecturePromptEn,
    castProtagonistName: protagonist.name,
    castProtagonistDescription: protagonist.description,
    castSupportingName: supporting?.name,
    castSupportingDescription: supporting?.description,
    scenographyDirection,
    episodes
  };
}

/**
 * Generates a complete serialized miniseries using Gemini AI.
 * Strictly enforces:
 * 1. Exact gender and character matching (if topic is about a woman, protagonist MUST be female, pronouns 'ella', Jesus calls her 'Hija mía').
 * 2. Dedicated UNIQUE 3D scenarios synthesized for each story (no recycling static generic kitchens).
 * 3. 10-second continuous scenes with the 10 seconds divided dynamically between characters (multi-person coral dialogues with 2, 3 or more characters).
 * 4. STRICT delivery of all requested chapters (e.g. 2, 3, or 4 parts) with zero missing episodes.
 */
export async function generateMiniseriesWithGemini(
  ai: GoogleGenAI,
  req: MiniseriesGenerationRequest
): Promise<GeneratedMiniseriesPackage> {
  const { topic, totalParts = 3, category = "milagro_familiar", lockedEnvironmentId } = req;
  const targetParts = Math.max(2, Math.min(4, Number(totalParts) || 3));
  const cleanTopic = topic?.trim() || "Una mujer de fe que clama por un milagro imposible";

  // Pre-analyze cast and scenario with dynamic multi-character synthesizer (1 to 4 characters!)
  const dynamicCast = generateUniqueCastForTopic(cleanTopic, category);
  const detectedCast = detectStoryProtagonistAndCast(cleanTopic, category);
  const detectedEnv = lockedEnvironmentId
    ? (SERIES_ENVIRONMENTS_FE.find(e => e.id === lockedEnvironmentId) || generateUniqueScenographyForTopic(cleanTopic, category, dynamicCast))
    : generateUniqueScenographyForTopic(cleanTopic, category, dynamicCast);

  const uiCharacters: CartoonCharacter[] = dynamicCast.characters.map(d => cartoonCharacterFromDynamic(d));

  const castDescriptions = dynamicCast.characters.map((c, i) => 
    `  * Personaje ${i + 1} (${c.role}): ${c.name}, ${c.age}, ${c.gender === 'female' ? 'Mujer' : 'Hombre'}. Arquetipo: "${c.archetype}". Postura/Estado: "${c.posture}". Vestuario fijo: "${c.clothingStyle}". Model sheet: "${c.modelSheetLockEn}". Voz: "${c.voicePreset}". ID: "${c.id}".`
  ).join('\n');

  const systemInstruction = `ERES EL EQUIPO SUPREMO DE CREACIÓN CINEMATOGRÁFICA Y SHOWRUNNING DE MINISERIES Y TELENOVELAS DE FE SERIALIZADAS 3D (ESTILO PIXAR/DISNEY) CON ESTÁNDAR NETFLIX:
1. GUIONISTA JEFE Y ESCRITOR NARRATIVO: Escribes guiones 100% ÚNICOS, viscerales, conmovedores y específicos para el tema. PROHIBIDO repetir tramas genéricas, frases trilladas o situaciones recicladas. Cada historia tiene su propio conflicto, dolor humano auténtico y resolución milagrosa.
2. DIRECTOR CINEMATOGRÁFICO DE PUESTA EN ESCENA: Cada plano de 10 segundos es continuo, en formato vertical 9:16, con dirección de cámara, miradas, proxémica y posiciones espaciales precisas.
3. DISEÑADOR DE SONIDO Y FOLEY DE ACCIONES ESPECÍFICAS: Cada acción física tiene su sonido foley exacto y único (ej: arrugar una factura, choque de cristal, bip de monitor médico, crujido de rodillas en madera, fricción de telas en un abrazo, roce de cadenas, viento gélido cesando).
4. DIRECTOR DE CASTING Y PERSONAJES ÚNICOS: Cada miniserie tiene su propio reparto exclusivo y único (de 1 a 4 personajes según el tema) con nombres, edades, vestuarios y estados emocionales diseñados para la trama. NUNCA uses los mismos personajes de historias anteriores.
5. PRODUCTOR EJECUTIVO DE RETENCIÓN VIRAL: Garantizas ganchos en los primeros 2 segundos, micro-cliffhangers en el segundo 10 de cada escena y cliffhangers serializados entre capítulos para devorar la serie completa.

REPARTO Y PERSONAJES ASIGNADOS PARA ESTA SERIE (${dynamicCast.castSize} Personajes Únicos):
${castDescriptions}

DIRECTIVA CRÍTICA #1: REPARTO EXCLUSIVO Y CONCORDANCIA DE GÉNERO
- Usa los personajes únicos generados arriba.
- El protagonista es ${dynamicCast.protagonist.name} (${dynamicCast.protagonist.gender === 'female' ? 'mujer' : 'hombre'}, pronombres: "${dynamicCast.protagonist.pronoun}").
- Jesús debe llamarle "${dynamicCast.protagonist.vocative}".
${dynamicCast.secondary ? `- Personaje de apoyo: ${dynamicCast.secondary.name} (${dynamicCast.secondary.role}).` : '- Miniserie íntima de un solo personaje protagonista ante la presencia de Jesús.'}

DIRECTIVA CRÍTICA #2: ESCENARIO 3D ÚNICO
- Escenario exclusivo: "${detectedEnv.name}" (Tag: ${detectedEnv.shortTag}). Arquitectura: ${detectedEnv.architecturePromptEn}.

DIRECTIVA CRÍTICA #3: EFECTOS DE SONIDO (SFX) Y FOLEY DE ACCIONES ESPECÍFICAS
- En CADA escena debes incluir en 'sfx' los sonidos físicos foley exactos sincronizados con la acción concreta:
  * Ejemplo médico: 'Bip continuo de monitor cardíaco (-9dB), goteo en bolsa de suero (-10dB), sollozo contenido (-8dB)'
  * Ejemplo deudas/papeles: 'Crujido de papel de desalojo arrugándose (-7dB), suspiro tembloroso (-9dB), golpe sordo en mesa (-8dB)'
  * Ejemplo tormenta: 'Golpe de ola en madera mojada (-7dB), viento rugiendo (-8dB), crujido de mástil (-9dB)'
  * La entrada de Jesús siempre incorpora 'Whoosh cálido celestial, resplandor dorado a 432Hz y campana sagrada tenue (-8dB)'.

DIRECTIVA CRÍTICA #4: REGLA DE ORO DE CADENCIA ORAL (MÁXIMO 18 A 22 PALABRAS EN 10 SEGUNDOS)
- Escena de 10 segundos continuos: entre todos los personajes suman MÁXIMO 18 a 22 palabras totales.
- Turno de 3s: 5 a 7 palabras. Turno de 4s: 7 a 9 palabras. Turno de 5s: 9 a 11 palabras.
- Si hay 2 o 3 personajes, el diálogo es coral y dividido: 3s + 3s + 4s = 10s.

DIRECTIVA CRÍTICA #5: SERIALIZACIÓN COMPLETA (${targetParts} CAPÍTULOS OBLIGATORIOS)
- Genera exactamente ${targetParts} capítulos en 'episodes', cada uno con 5 escenas de 10 segundos continuos.`;

  const userPrompt = `Genera la miniserie cinematográfica ÚNICA y original de EXACTAMENTE ${targetParts} capítulos para el tema: "${cleanTopic}".
Categoría: ${category}.
REGLAS OBLIGATORIAS:
1. GUION ÚNICO Y ORIGINAL: Escribe diálogos y conflicto específicos para "${cleanTopic}", sin repetir fórmulas genéricas.
2. REPARTO ÚNICO (${dynamicCast.castSize} personajes): Protagonista ${dynamicCast.protagonist.name} (${dynamicCast.protagonist.gender})${dynamicCast.secondary ? ` y ${dynamicCast.secondary.name}` : ''} + Maestro Jesús.
3. SONIDOS FOLEY ÚNICOS DE ACCIONES ESPECÍFICAS: Detalla en 'sfx' los efectos físicos foley vinculados a cada acción física concreta.
4. CADENCIA ORAL MÁXIMA 2.0-2.2 PAL/S: Máximo 18-22 palabras por escena de 10s.
5. EXACTAMENTE ${targetParts} CAPÍTULOS en el array 'episodes'.`;

  const candidateModels = getPrioritizedModels("gemini-3.8-flash");

  for (const model of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: userPrompt,
        config: {
          systemInstruction,
          temperature: 0.7,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              seriesTitle: { type: Type.STRING },
              logline: { type: Type.STRING },
              totalPartsPlanned: { type: Type.INTEGER },
              bannerHook: { type: Type.STRING },
              primaryCharacterIds: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              lockedEnvironmentId: { type: Type.STRING },
              lockedEnvironmentName: { type: Type.STRING },
              lockedEnvironmentPromptEn: { type: Type.STRING },
              episodes: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    episodeNumber: { type: Type.INTEGER },
                    episodeTitle: { type: Type.STRING },
                    hook: { type: Type.STRING },
                    conflict: { type: Type.STRING },
                    escalation: { type: Type.STRING },
                    cliffhanger: { type: Type.STRING },
                    scenes: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          sceneNumber: { type: Type.INTEGER },
                          durationSec: { type: Type.INTEGER },
                          characterId: { type: Type.STRING },
                          secondaryCharacterId: { type: Type.STRING },
                          charactersInShot: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                          },
                          interactionType: { type: Type.STRING },
                          timeframe: { type: Type.STRING },
                          action: { type: Type.STRING },
                          dialogueExchange: {
                            type: Type.ARRAY,
                            items: {
                              type: Type.OBJECT,
                              properties: {
                                speakerName: { type: Type.STRING },
                                speakerId: { type: Type.STRING },
                                timeWindow: { type: Type.STRING },
                                allocatedSeconds: { type: Type.INTEGER },
                                dialogueSpanish: { type: Type.STRING },
                                emotionalTone: { type: Type.STRING }
                              },
                              required: ["speakerName", "speakerId", "dialogueSpanish", "emotionalTone"]
                            }
                          },
                          narration: { type: Type.STRING },
                          onScreenText: { type: Type.STRING },
                          secondaryLabel: { type: Type.STRING },
                          imageToVideoPrompt: { type: Type.STRING },
                          englishPromptWithSpanishDialogue: { type: Type.STRING },
                          sfx: { type: Type.STRING },
                          bgMusicMood: { type: Type.STRING }
                        },
                        required: ["sceneNumber", "durationSec", "characterId", "charactersInShot", "action", "dialogueExchange", "narration", "onScreenText", "englishPromptWithSpanishDialogue", "sfx", "bgMusicMood"]
                      }
                    },
                    socialPackage: {
                      type: Type.OBJECT,
                      properties: {
                        youtubeTitle: { type: Type.STRING },
                        facebookTitle: { type: Type.STRING },
                        tiktokTitle: { type: Type.STRING },
                        caption: { type: Type.STRING },
                        hashtags: {
                          type: Type.ARRAY,
                          items: { type: Type.STRING }
                        },
                        pinnedComment: { type: Type.STRING }
                      },
                      required: ["youtubeTitle", "facebookTitle", "caption", "hashtags", "pinnedComment"]
                    }
                  },
                  required: ["episodeNumber", "episodeTitle", "hook", "conflict", "escalation", "cliffhanger", "scenes", "socialPackage"]
                }
              }
            },
            required: ["seriesTitle", "logline", "totalPartsPlanned", "bannerHook", "primaryCharacterIds", "episodes"]
          }
        }
      });

      const parsedText = response.text?.trim();
      if (!parsedText) {
        throw new Error("Respuesta vacía de Gemini al generar miniserie");
      }

      const result = JSON.parse(parsedText) as GeneratedMiniseriesPackage;
      if (!result.id) {
        result.id = `miniserie_ai_${Date.now()}`;
      }

      // Check and enforce target parts count: if Gemini returned fewer than targetParts, complete them!
      if (!Array.isArray(result.episodes) || result.episodes.length < targetParts) {
        console.warn(`[GeminiMiniseries] Gemini returned ${result.episodes?.length || 0} episodes, but ${targetParts} were requested. Completing missing episodes...`);
        const fallbackPackage = buildFallbackMiniseries(cleanTopic, targetParts, category, detectedEnv.id);
        const existingEpisodes = result.episodes || [];
        const missingEpisodes = fallbackPackage.episodes.slice(existingEpisodes.length, targetParts);
        result.episodes = [...existingEpisodes, ...missingEpisodes];
      }

      result.totalPartsPlanned = targetParts;
      result.characters = uiCharacters;
      result.castCount = dynamicCast.castSize;

      // Ensure Jesus is in primary character list
      if (!result.primaryCharacterIds.includes('jesus_cartoon_3d')) {
        result.primaryCharacterIds.unshift('jesus_cartoon_3d');
      }
      for (const char of dynamicCast.characters) {
        if (!result.primaryCharacterIds.includes(char.id)) {
          result.primaryCharacterIds.push(char.id);
        }
      }

      // Ensure unique environment lock
      result.lockedEnvironmentId = detectedEnv.id;
      result.lockedEnvironmentName = detectedEnv.name;
      result.lockedEnvironmentPromptEn = detectedEnv.architecturePromptEn;

      const envLockTag = `[LOCKED ENVIRONMENT - ${detectedEnv.shortTag}]: ${detectedEnv.architecturePromptEn} Lighting: ${detectedEnv.lightingSetup}. Props: ${detectedEnv.propsAndAtmosphere}. EXACT SAME ROOM AND PROPS IN ALL SCENES.`;
      const charJesusLock = `[LOCKED CHARACTER - JESUS]: ${CARTOON_CHARACTERS_FE.find(c => c.id === 'jesus_cartoon_3d')?.exactModelSheetLockEn}`;
      const charProtagonistLock = `[LOCKED CHARACTER - ${dynamicCast.protagonist.name.toUpperCase()}]: ${dynamicCast.protagonist.modelSheetLockEn}`;
      const charSupportingLock = dynamicCast.supporting ? `[LOCKED CHARACTER - ${dynamicCast.supporting.name.toUpperCase()}]: ${dynamicCast.supporting.modelSheetLockEn}` : '';
      const negativeLock = `[NEGATIVE CONTINUITY PROMPT: ${detectedEnv.negativePromptEn}, no changes in character clothing, no change of hairstyle, no facial morphing, no extra limbs, no camera jump cuts]`;

      result.episodes.forEach(ep => {
        ep.lockedEnvironmentId = detectedEnv.id;
        ep.lockedEnvironmentName = detectedEnv.name;
        ep.lockedEnvironmentPromptEn = detectedEnv.architecturePromptEn;

        ep.scenes.forEach((sc, scIdx) => {
          sc.durationSec = 10;
          sc.lockedEnvironmentId = detectedEnv.id;
          sc.lockedEnvironmentName = detectedEnv.name;
          sc.lockedEnvironmentPromptEn = detectedEnv.architecturePromptEn;

          // Ensure multi-character presence
          if (!Array.isArray(sc.charactersInShot) || sc.charactersInShot.length < 2) {
            sc.charactersInShot = [dynamicCast.protagonist.id, dynamicCast.supporting ? dynamicCast.supporting.id : 'jesus_cartoon_3d', 'jesus_cartoon_3d'];
          }

          // Strictly calibrate oral cadence (< 2.2 words/sec) and distribute time windows
          if (Array.isArray(sc.dialogueExchange) && sc.dialogueExchange.length > 0) {
            sc.dialogueExchange = calibrateAndPaceDialogue(sc.dialogueExchange, 10);
          }

          // Build synchronized prompts with exact calibrated dialogue and word counts
          const dialogSummary = (sc.dialogueExchange || [])
            .map(t => `[${t.timeWindow || '00:00-00:03'}] ${t.speakerName} (${t.allocatedSeconds || 3}s, ${t.wordCount || countWordsSpanish(t.dialogueSpanish)} words): "${t.dialogueSpanish}"`)
            .join('\n');

          const baseSynced = `${envLockTag}\n${charJesusLock}\n${charProtagonistLock}\n${charSupportingLock}\n[CONTINUOUS 10s SHOT - FLUID SPEECH ~2.0 words/sec]: High-end Pixar 3D animated style inside ${detectedEnv.shortTag}. Multi-person synchronized Latin American Spanish dialogue:\n${dialogSummary}\n${negativeLock}`;
          sc.englishPromptWithSpanishDialogue = baseSynced;
          sc.imageToVideoPrompt = baseSynced;
          sc.masterNetflixPrompt = `[NETFLIX CONTINUITY - SCENE ${scIdx + 1}]\n${envLockTag}\n${charJesusLock}\n${charProtagonistLock}\n${charSupportingLock}\n[ACTION 10s]: ${sc.action}. Divided dialogue: ${(sc.dialogueExchange || []).length} turns in 10s.\n${negativeLock}`;
        });
      });

      if (!result.scenographyDirection) {
        const fallbackObj = buildFallbackMiniseries(cleanTopic, targetParts, category, detectedEnv.id);
        result.scenographyDirection = fallbackObj.scenographyDirection;
      }

      return result;
    } catch (err: any) {
      const errMsg = String(err?.message || err);
      const isQuota = errMsg.includes("exceeded your current quota") || errMsg.includes("RESOURCE_EXHAUSTED");
      if (isQuota) {
        demoteModel(model, 120000);
        continue;
      }
      const isTransient = errMsg.includes("503") || errMsg.includes("UNAVAILABLE") || errMsg.includes("high demand") || errMsg.includes("overloaded");
      if (isTransient) {
        demoteModel(model, 60000);
        continue;
      }
      continue;
    }
  }

  // Graceful fallback: dynamically synthesize complete series with Jesus, the correct gender protagonist, unique scenario, and divided 10s multi-person scenes
  console.info(`[MiniseriesGenerator] Serving dynamically synthesized series with Jesus: "${cleanTopic}"`);
  return buildFallbackMiniseries(cleanTopic, targetParts, category, lockedEnvironmentId);
}
