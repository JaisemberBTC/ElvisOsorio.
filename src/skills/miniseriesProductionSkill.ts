/**
 * MINISERIES PRODUCTION SKILL (HABILIDAD DE CÓDIGO ABIERTO)
 * =========================================================
 * Núcleo de inteligencia automatizado desacoplado de interfaces visuales.
 * Funciona como una habilidad programática modular (Skill/Agent Capability)
 * para orquestar la preproducción y producción cinematográfica de series 3D de fe.
 * 
 * Cumplimiento estricto:
 * 1. Respeto inquebrantable de género (historias de mujeres tienen protagonista mujer).
 * 2. Generación de escenarios 3D únicos no reciclados para cada historia.
 * 3. Planos continuos de 10 segundos divididos entre 2, 3 o más personajes (coral dialogue).
 * 4. Generación serializada exacta de todos los capítulos pedidos (2, 3 o 4 partes).
 */

import { CARTOON_CHARACTERS_FE, SERIES_ENVIRONMENTS_FE, ScenographyDirection, EpisodeSEO, CartoonCharacter } from "../data/cartoonCharactersFe";
import { syncScenePromptWithExactDialogue } from "../utils/dialoguePromptSync";
import { 
  detectStoryProtagonistAndCast, 
  generateUniqueCastForTopic,
  cartoonCharacterFromDynamic,
  generateActionSpecificFoleySounds,
  generateUniqueScenographyForTopic,
  generateContextualSceneDialogueArc, 
  calibrateAndPaceDialogue,
  countWordsSpanish,
  ProtagonistCast, 
  UniqueScenography 
} from "../utils/miniseriesDomain";

export interface MiniseriesSkillManifest {
  name: string;
  version: string;
  license: string;
  type: "autonomous_skill_engine";
  description: string;
  capabilities: string[];
  supportedVideoEngines: string[];
  supportedTtsEngines: string[];
}

export interface SkillProductionRequest {
  topic: string;
  totalParts?: number;
  category?: string;
  targetVideoEngine?: 'kling' | 'runway' | 'luma' | 'veo' | 'sora';
  lockedEnvironmentId?: string;
}

export interface GeneratedDialogueTurn {
  speakerName: string;
  speakerId: string;
  role?: string;
  timeWindow?: string;
  allocatedSeconds?: number;
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
 * Open-Source Skill Manifest
 */
export const MINISERIES_SKILL_MANIFEST: MiniseriesSkillManifest = {
  name: "MiniseriesFaithProductionSkill",
  version: "2.4.0-open",
  license: "MIT - Open Source Generative Agent Skill",
  type: "autonomous_skill_engine",
  description: "Habilidad autónoma de código abierto para guionizar, escenificar y orquestar miniseries cinematográficas 3D con Jesucristo, continuidad Netflix y división de diálogos en planos continuos de 10s.",
  capabilities: [
    "gender_continuity_enforcement",
    "unique_scenography_synthesis",
    "multi_person_10s_coral_dialogues",
    "progressive_multichapter_serialization",
    "jesus_active_theophany_direction",
    "cross_engine_prompt_optimization"
  ],
  supportedVideoEngines: ["kling", "runway", "luma", "veo", "sora"],
  supportedTtsEngines: ["elevenlabs", "fish_audio", "edge_tts", "openai_tts"]
};

/**
 * Builds the canonical 5 scenes of 10 seconds for an episode,
 * dividing the 10 seconds across multiple characters (2, 3 or more).
 */
export function buildEpisodeScenes10s(
  epNum: number,
  totalParts: number,
  topic: string,
  cast: ProtagonistCast,
  env: UniqueScenography,
  category: string = "milagro_familiar"
): GeneratedMiniserieScene[] {
  return generateContextualSceneDialogueArc(topic, category, cast, env, epNum, totalParts);
}

/**
 * Executes the complete autonomous production skill for a topic.
 * Fully modular and callable from scripts, background services, endpoints, or UI.
 */
export function executeProductionSkill(req: SkillProductionRequest): GeneratedMiniseriesPackage {
  const cleanTopic = (req.topic || '').trim() || 'Una mujer de fe que clama por un milagro imposible';
  const partsCount = Math.max(2, Math.min(4, Number(req.totalParts) || 3));
  const category = req.category || 'milagro_familiar';

  // 1. Analyze topic & synthesize bespoke dynamic cast (1 to 4 characters)
  const dynamicCast = generateUniqueCastForTopic(cleanTopic, category);
  const cast = detectStoryProtagonistAndCast(cleanTopic, category);
  const uiCharacters: CartoonCharacter[] = dynamicCast.characters.map(d => cartoonCharacterFromDynamic(d));

  // 2. Synthesize dedicated unique 3D scenario
  const env = req.lockedEnvironmentId
    ? (SERIES_ENVIRONMENTS_FE.find(e => e.id === req.lockedEnvironmentId) || generateUniqueScenographyForTopic(cleanTopic, category, dynamicCast))
    : generateUniqueScenographyForTopic(cleanTopic, category, dynamicCast);

  // 3. Build episodes matching exactly target partsCount
  const episodes: GeneratedMiniserieEpisode[] = Array.from({ length: partsCount }).map((_, epIdx) => {
    const epNum = epIdx + 1;
    const isFirst = epNum === 1;
    const isLast = epNum === partsCount;

    let epTitle = `Parte ${epNum}: El Clamor en el Dolor y la Impotencia Humana`;
    if (epNum === 2) epTitle = `Parte ${epNum}: El Encuentro Revelador y la Prueba de Fe`;
    if (epNum === 3) epTitle = isLast ? `Parte ${epNum}: El Gran Milagro Sobrenatural y la Gloria de Dios` : `Parte ${epNum}: La Batalla Espiritual y la Victoria`;
    if (epNum === 4) epTitle = `Parte ${epNum}: Desenlace Glorioso, Restauración Total y Testimonio`;

    const scenes = buildEpisodeScenes10s(epNum, partsCount, cleanTopic, cast, env);

    // Apply action-specific Foley SFX to all scenes
    scenes.forEach(sc => {
      const foley = generateActionSpecificFoleySounds(sc.action, env.name, sc.sceneNumber, cleanTopic);
      sc.sfx = foley.sfx;
      sc.sfxTimeline = foley.sfxTimeline;
    });

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

    return {
      episodeNumber: epNum,
      episodeTitle: epTitle,
      hook: isFirst
        ? `Nadie imaginaba lo que estaba a punto de suceder con "${cleanTopic}". Cuando todo parecía perdido, Jesús apareció.`
        : `A la mañana siguiente, lo que ocurrió con ${cast.protagonist.name} dejó a todos con la boca abierta. Jesús no había terminado aún.`,
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
      whoInhabits: `Espacio íntimo habitado por ${cast.protagonist.name} y ${cast.supporting.name}, marcado por la memoria y la fe probada.`,
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
        characterName: cast.protagonist.name,
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
    id: `miniserie_skill_${Date.now()}`,
    seriesTitle: cleanTopic.slice(0, 50),
    logline: `Miniserie de fe serializada (${partsCount} capítulos): ${cleanTopic}. Jesucristo como protagonista resolutivo con planos continuos de 10s y diálogos divididos.`,
    category,
    categoryLabel: 'Milagro & Intervención de Jesús',
    totalPartsPlanned: partsCount,
    bannerHook: `🔴 LO QUE JESÚS HIZO CUANDO PARECÍA EL FINAL • ${cleanTopic.toUpperCase().slice(0, 30)}`,
    primaryCharacterIds: ['jesus_cartoon_3d', ...dynamicCast.characters.map(c => c.id)],
    characters: uiCharacters,
    castCount: dynamicCast.castSize,
    lockedEnvironmentId: env.id,
    lockedEnvironmentName: env.name,
    lockedEnvironmentPromptEn: env.architecturePromptEn,
    scenographyDirection,
    episodes
  };
}
