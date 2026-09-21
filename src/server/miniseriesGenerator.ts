import { GoogleGenAI, Type } from "@google/genai";
import { CARTOON_CHARACTERS_FE, SERIES_ENVIRONMENTS_FE, ScenographyDirection, EpisodeSEO } from "../data/cartoonCharactersFe";

export interface MiniseriesGenerationRequest {
  topic: string;
  totalParts?: number;
  category?: string;
  lockedEnvironmentId?: string;
}

export interface GeneratedDialogueTurn {
  speakerName: string;
  speakerId: string;
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
  lockedEnvironmentId?: string;
  lockedEnvironmentName?: string;
  lockedEnvironmentPromptEn?: string;
  scenographyDirection?: ScenographyDirection;
  episodes: GeneratedMiniserieEpisode[];
}

/**
 * Programmatic context-aware fallback generator.
 * Guaranteed to reflect the user's specific topic and include Jesus as an active, speaking character
 * with 100% immutable Netflix-standard continuity for environments, wardrobe, and character models.
 */
export function buildFallbackMiniseries(
  topic: string,
  totalParts: number = 3,
  category: string = "milagro_familiar",
  requestedEnvId?: string
): GeneratedMiniseriesPackage {
  const cleanTopic = topic.trim() || "El milagro que nadie esperaba";
  const lowerTopic = cleanTopic.toLowerCase();

  // Determine secondary character archetype based on topic keywords
  let secondaryId = 'sara_madre_fe';
  let secondaryName = 'Sara';
  let humanArchetype = 'la madre luchadora que clamó sin cesar';

  if (lowerTopic.includes('centurion') || lowerTopic.includes('centurión') || lowerTopic.includes('soldado') || lowerTopic.includes('roma')) {
    secondaryId = 'marcus_centurion';
    secondaryName = 'Centurión Marcus';
    humanArchetype = 'el militar conmovido que suplica por su hija';
  } else if (lowerTopic.includes('abuela') || lowerTopic.includes('abuelita') || lowerTopic.includes('anciana') || lowerTopic.includes('anciano')) {
    secondaryId = 'abuelita_esperanza';
    secondaryName = 'Abuelita Esperanza';
    humanArchetype = 'la intercesora de la madrugada';
  } else if (lowerTopic.includes('niño') || lowerTopic.includes('nino') || lowerTopic.includes('hijo pequeño') || lowerTopic.includes('mateo')) {
    secondaryId = 'mateo_nino_fe';
    secondaryName = 'Mateo';
    humanArchetype = 'el pequeño creyente';
  } else if (lowerTopic.includes('joven') || lowerTopic.includes('calle') || lowerTopic.includes('gigante') || lowerTopic.includes('david')) {
    secondaryId = 'david_pastor_valiente';
    secondaryName = 'David';
    humanArchetype = 'el joven que no se rinde ante la adversidad';
  } else {
    // Default to Sara, beloved archetype for faith and family struggle
    secondaryId = 'sara_madre_fe';
    secondaryName = 'Sara';
    humanArchetype = 'la madre luchadora que clamó sin cesar';
  }

  // Determine locked environment from SERIES_ENVIRONMENTS_FE
  let env = SERIES_ENVIRONMENTS_FE[0]; // cocina_madrugada_azulejos (rustic kitchen with tiles)
  if (requestedEnvId) {
    const found = SERIES_ENVIRONMENTS_FE.find(e => e.id === requestedEnvId);
    if (found) env = found;
  } else if (secondaryId === 'marcus_centurion') {
    env = SERIES_ENVIRONMENTS_FE.find(e => e.id === 'portico_romano_guardia') || SERIES_ENVIRONMENTS_FE[4];
  } else if (lowerTopic.includes('hospital') || lowerTopic.includes('enfermedad') || lowerTopic.includes('médico') || lowerTopic.includes('medico') || lowerTopic.includes('sanidad') || lowerTopic.includes('cáncer')) {
    env = SERIES_ENVIRONMENTS_FE.find(e => e.id === 'sala_espera_hospital_noche') || SERIES_ENVIRONMENTS_FE[3];
  } else if (secondaryId === 'abuelita_esperanza' || lowerTopic.includes('oracion') || lowerTopic.includes('oración') || lowerTopic.includes('vigilia')) {
    env = SERIES_ENVIRONMENTS_FE.find(e => e.id === 'habitacion_oracion_humilde') || SERIES_ENVIRONMENTS_FE[1];
  } else if (secondaryId === 'david_pastor_valiente' || lowerTopic.includes('colina') || lowerTopic.includes('valle') || lowerTopic.includes('monte')) {
    env = SERIES_ENVIRONMENTS_FE.find(e => e.id === 'colina_getsemani_atardecer') || SERIES_ENVIRONMENTS_FE[2];
  }

  const jesusChar = CARTOON_CHARACTERS_FE.find(c => c.id === 'jesus_cartoon_3d')!;
  const secondaryChar = CARTOON_CHARACTERS_FE.find(c => c.id === secondaryId) || CARTOON_CHARACTERS_FE[3];

  const envLockTag = `[LOCKED ENVIRONMENT - ${env.shortTag.toUpperCase()}]: ${env.architecturePromptEn} Lighting: ${env.lightingSetup}. Props: ${env.propsAndAtmosphere}. EXACT SAME ROOM, ARCHITECTURAL DETAILS, TILES, AND PROPS IN ALL ANGLES.`;
  const charJesusLock = `[LOCKED CHARACTER - JESUS]: ${jesusChar.exactModelSheetLockEn}`;
  const charSecLock = `[LOCKED CHARACTER - ${secondaryName.toUpperCase()}]: ${secondaryChar.exactModelSheetLockEn}`;
  const negativeLock = `[NEGATIVE CONTINUITY PROMPT: ${env.negativePromptEn}, no changes in character clothing, no change of hairstyle, no facial morphing, no extra limbs, no camera jump cuts]`;

  const seriesId = `miniserie_${Date.now()}`;
  const partsCount = Math.max(2, Math.min(4, totalParts));

  const episodes: GeneratedMiniserieEpisode[] = Array.from({ length: partsCount }).map((_, epIdx) => {
    const epNum = epIdx + 1;
    const isLast = epNum === partsCount;

    let epTitle = `Parte ${epNum}: El Clamor en el Dolor`;
    if (epNum === 2) epTitle = `Parte ${epNum}: El Encuentro con el Maestro Jesús`;
    if (epNum === 3) epTitle = isLast ? `Parte ${epNum}: El Gran Milagro y la Gloria de Dios` : `Parte ${epNum}: La Fe Desafiada`;
    if (epNum === 4) epTitle = `Parte ${epNum}: Desenlace Glorioso y Restauración Total`;

    const scenographyStage = {
      stageName: epNum === 1 ? 'Aflicción Inicial & Penumbra' : isLast ? 'Luz Divina & Restauración Total' : 'La Luz Rompe la Oscuridad',
      environmentState: epNum === 1 
        ? `En ${env.name}, la atmósfera es fría y austera. Muebles desgastados por los años, sombras largas, la mesa tiene la Biblia cerrada y una vela titilante a punto de extinguirse que traduce la angustia humana.`
        : isLast
        ? `En ${env.name}, el amanecer celestial baña el recinto. El mobiliario se percibe cálido y renovado, la Biblia está abierta y el resplandor divino de 3200K llena cada rincón de paz y gloria.`
        : `En ${env.name}, el haz de luz dorada de Jesús penetra por el umbral o ventana, produciendo un dramático claroscuro donde la penumbra retrocede ante la gloria del Maestro.`,
      lightingState: epNum === 1 ? 'Luz de luna fría y sombras profundas (2800K azulado)' : isLast ? 'Luz de amanecer dorada omnidireccional y resplandor celestial (5500K)' : 'Contraluz dramático con aura dorada de Jesús iluminando los rostros',
      objectsState: epNum === 1 ? 'Biblia cerrada sobre la mesa rústica, vela solitaria titilante' : isLast ? 'Biblia abierta reflejando luz dorada, orden y reverencia restaurados' : 'La llama de la vela se aviva firme, hojas de la Biblia iluminadas por el aura de Cristo'
    };

    const scenes: GeneratedMiniserieScene[] = [
      // ESCENA 1: Presentación del conflicto según el tema (10s continuous shot)
      {
        sceneNumber: 1,
        durationSec: 10,
        characterId: secondaryId,
        secondaryCharacterId: 'jesus_cartoon_3d',
        charactersInShot: [secondaryId, 'jesus_cartoon_3d'],
        interactionType: 'dos_personajes_frente_a_frente',
        timeframe: '00:00 - 00:10',
        action: `Interior rústico de ${env.name} en penumbra a las 3:00 AM. ${secondaryName} está de rodillas junto a la mesa de pino envejecido con las manos juntas sobre la Biblia familiar cerrada; una lámpara de arcilla con llama vacilante proyecta sombras melancólicas. Al fondo, Jesús cruza el umbral con túnica de lino blanco inmaculado y manto azul cielo, proyectando un haz volumétrico celestial dorado a 3200K que corta la penumbra del recinto.`,
        scenographyDetails: {
          exactLocation: `Interior rústico de ${env.name}, vigas de cedro envejecido y paredes de adobe encalado con textura rugosa.`,
          narrativeProps: 'Biblia familiar de cuero gastado cerrada en la mesa de pino, lámpara de barro con llama vacilante, cruz de olivo en la pared.',
          lightingSetup: 'Claroscuro melancólico a 2800K azulado nocturno contrastado por el primer haz celestial dorado a 3200K que proyecta Jesús.',
          spatialPlacement: `${secondaryName} arrodillada en tercio izquierdo junto a la mesa en sombras; Jesús entra por el tercio derecho bañando el recinto de claridad.`
        },
        dialogueExchange: [
          {
            speakerName: secondaryName,
            speakerId: secondaryId,
            dialogueSpanish: `¡Señor Jesús, no resisto más este dolor! Ya no me quedan fuerzas humanas y las puertas se cerraron; ¡escucha mi alma clamando en esta oscuridad!`,
            emotionalTone: 'Lágrimas y clamor desgarrador continuo de fe viva',
            voicePresetName: secondaryChar.voiceProfile.elevenLabsPreset
          },
          {
            speakerName: 'Maestro Jesús',
            speakerId: 'jesus_cartoon_3d',
            dialogueSpanish: `Hijo mío, enjuaga tu llanto que no estás solo. He descendido para librarte y derramar vida sobre tu hogar; mírame a los ojos y cree.`,
            emotionalTone: 'Voz profunda, cálida, sin pausas vacías, amor sobrenatural',
            voicePresetName: jesusChar.voiceProfile.elevenLabsPreset
          }
        ],
        narration: `En el capítulo ${epNum}, la angustia parecía insoportable. [PAUSA] Pero una presencia divina rompió la soledad.`,
        onScreenText: `${cleanTopic.toUpperCase().slice(0, 30)} · Cap. ${epNum}`,
        secondaryLabel: '🔴 MINISERIE DE FE',
        lockedEnvironmentId: env.id,
        lockedEnvironmentName: env.name,
        lockedEnvironmentPromptEn: env.architecturePromptEn,
        imageToVideoPrompt: `${envLockTag}\n${charJesusLock}\n${charSecLock}\n[EXACT CINEMATIC SCENOGRAPHY (7 PRINCIPLES)]: 3D Pixar-Disney aesthetic. Setting: rustic interior ${env.architecturePromptEn}. Foreground: distressed rough-hewn pine table with closed leather-bound family Bible and a flickering clay oil lamp casting soft dancing shadows. Lighting: dramatic cinematic chiaroscuro, 2800K moody nocturnal shadows pierced by a 3200K volumetric celestial golden light beam radiating from Jesus Christ. Camera: vertical 9:16 portrait composition, 50mm lens, shallow depth of field.\nClip continuo de 10s: ${secondaryName} de rodillas junto a la mesa; Jesucristo animado 3D se acerca extendiendo su mano compasiva. Diálogo continuo sincronizado en español (sin silencios vacíos): [00:00-00:05] ${secondaryName}: "¡Señor Jesús, no resisto más este dolor! Ya no me quedan fuerzas humanas y las puertas se cerraron; ¡escucha mi alma clamando en esta oscuridad!". [00:05-00:09] Jesús consolando con amor: "Hijo mío, enjuaga tu llanto que no estás solo. He descendido para librarte y derramar vida sobre tu hogar; mírame a los ojos y cree". [00:09-00:10] Haz dorado y soplido de paz.\n${negativeLock}`,
        englishPromptWithSpanishDialogue: `${envLockTag}\n${charJesusLock}\n${charSecLock}\n[EXACT CINEMATIC SCENOGRAPHY (7 PRINCIPLES)]: High-end 3D Pixar-Disney animation. Interior ${env.architecturePromptEn}. Foreground: distressed rough-hewn pine table with closed leather-bound family Bible and a flickering clay oil lamp. Background: weathered adobe walls with antique olive-wood cross. Lighting: dramatic chiaroscuro, 2800K moody nocturnal shadows pierced by a 3200K volumetric celestial golden light beam radiating from Jesus Christ. Framing: vertical 9:16 portrait cinema composition, 50mm lens, shallow depth of field.\n10-second continuous cinematic shot. Non-stop engaging Latin American Spanish lip-sync:\n[00:00-00:05] ${secondaryName} kneels weeping by the rustic table in ${env.shortTag}, speaking passionately: "¡Señor Jesús, no resisto más este dolor! Ya no me quedan fuerzas humanas y las puertas se cerraron; ¡escucha mi alma clamando en esta oscuridad!".\n[00:05-00:09] Jesus Christ approaches with glowing golden aura, speaking tenderly without dead air: "Hijo mío, enjuaga tu llanto que no estás solo. He descendido para librarte y derramar vida sobre tu hogar; mírame a los ojos y cree".\n[00:09-00:10] Jesus steps closer with tender compassion. Octane 8K volumetric lighting.\n${negativeLock}`,
        masterNetflixPrompt: `[NETFLIX CONTINUITY MASTER - SCENE 1]\n${envLockTag}\n${charJesusLock}\n${charSecLock}\n[EXACT SCENOGRAPHY]: Interior rustic table, closed Bible, flickering terracotta lamp, 3200K divine god-rays.\n[ACTION 10s]: Camera slowly glides forward in ${env.name}. ${secondaryName} weeps; Jesus approaches and consoles.\n[LIP-SYNC]: Spanish dialogue.\n${negativeLock}`,
        sfx: 'Trueno lejano angustioso (-6dB), golpe en madera de mesa (-8dB), chasquido de llama viva (-10dB), brisa celestial envolvente (-12dB)',
        sfxTimeline: [
          { atSecond: '00:00 - 00:02', sound: 'Golpe sordo de rodillas y quejido profundo (-6dB)', purpose: 'Enganche auditivo inmediato de apertura' },
          { atSecond: '00:03 - 00:05', sound: 'Chasquido de llama de aceite y crujido de madera vieja (-10dB)', purpose: 'Tensión ambiental de madrugada' },
          { atSecond: '00:05 - 00:07', sound: 'Brisa celestial cálida (Whoosh sobrenatural -8dB)', purpose: 'Aparición e impacto visual de Jesús' },
          { atSecond: '00:08 - 00:10', sound: 'Campana de cristal etérea y destello de luz (-10dB)', purpose: 'Transición suave a la siguiente escena' }
        ],
        bgMusicMood: 'Piano melancólico en 432Hz con cuerdas suaves a 55 BPM'
      },
      // ESCENA 2: Diálogo íntimo cara a cara con Jesús (10s continuous shot)
      {
        sceneNumber: 2,
        durationSec: 10,
        characterId: 'jesus_cartoon_3d',
        secondaryCharacterId: secondaryId,
        charactersInShot: ['jesus_cartoon_3d', secondaryId],
        interactionType: 'encuentro_con_jesus',
        timeframe: '00:10 - 00:20',
        action: `En el mismo recinto de ${env.name}, junto a la mesa de pino rústico donde la lámpara de aceite arde ahora con llama viva y estable, Jesús mira fijamente a los ojos a ${secondaryName} y coloca suavemente Su mano sobre su hombro; la luz dorada a 3200K disipa las sombras frías y refleja destellos sobre las páginas de la Biblia.`,
        scenographyDetails: {
          exactLocation: `Mismo espacio de ${env.name}, plano medio íntimo junto a la mesa de madera tallada.`,
          narrativeProps: 'La lámpara de arcilla arde con llama dorada serena, la Biblia familiar reposa abierta en salmo de promesa.',
          lightingSetup: 'Luz volumétrica cálida a 3200K envolviendo los rostros con halo suave y partículas divinas doradas en suspensión.',
          spatialPlacement: 'Plano medio conjunto frente a frente; Jesús en el tercio derecho inclinándose con amor paternal hacia el tercio izquierdo.'
        },
        dialogueExchange: [
          {
            speakerName: 'Maestro Jesús',
            speakerId: 'jesus_cartoon_3d',
            dialogueSpanish: `Dime con todo tu corazón: ¿crees que tengo el poder de arrancar esta aflicción y transformar para siempre lo que hoy llamas imposible?`,
            emotionalTone: 'Mirada compasiva penetrante y autoridad paternal sin pausas',
            voicePresetName: jesusChar.voiceProfile.elevenLabsPreset
          },
          {
            speakerName: secondaryName,
            speakerId: secondaryId,
            dialogueSpanish: `¡Creo con toda mi alma, mi Señor! ¡Perdona si dudé en la soledad, pero hoy me rindo ante Ti y pongo mi casa en tus santas manos!`,
            emotionalTone: 'Rendición apasionada, emoción desbordante continua',
            voicePresetName: secondaryChar.voiceProfile.elevenLabsPreset
          }
        ],
        narration: `Cuando el Maestro te mira a los ojos, [PAUSA] el miedo pierde toda su fuerza.`,
        onScreenText: 'EL MAESTRO TE SOSTIENE',
        secondaryLabel: 'Juan 11:40',
        lockedEnvironmentId: env.id,
        lockedEnvironmentName: env.name,
        lockedEnvironmentPromptEn: env.architecturePromptEn,
        imageToVideoPrompt: `${envLockTag}\n${charJesusLock}\n${charSecLock}\n[EXACT CINEMATIC SCENOGRAPHY (7 PRINCIPLES)]: 3D Pixar-Disney aesthetic in the EXACT SAME ${env.architecturePromptEn}. Intimate warm two-shot beside the rustic pine table. The terracotta oil lamp burns steadily with warm amber flame. The family Bible sits open on the table reflecting golden ambient light. 3200K warm rim lighting and floating divine dust motes.\nClip continuo de 10s en vertical 9:16: Jesús coloca su mano sobre el hombro de ${secondaryName}. Diálogo continuo en español: [00:00-00:05] Jesús: "Dime con todo tu corazón: ¿crees que tengo el poder de arrancar esta aflicción y transformar para siempre lo que hoy llamas imposible?". [00:05-00:09] ${secondaryName}: "¡Creo con toda mi alma, mi Señor! ¡Perdona si dudé en la soledad, pero hoy me rindo ante Ti y pongo mi casa en tus santas manos!". [00:09-00:10] Partículas doradas.\n${negativeLock}`,
        englishPromptWithSpanishDialogue: `${envLockTag}\n${charJesusLock}\n${charSecLock}\n[EXACT CINEMATIC SCENOGRAPHY (7 PRINCIPLES)]: High-end Pixar 3D animated style inside the EXACT SAME ${env.shortTag}. Intimate scene arrangement: rustic table foreground with open holy Bible reflecting golden amber illumination from the terracotta oil lamp. Background adobe wall with soft bokeh. 3200K warm volumetric key light focusing on facial expressions.\n10-second continuous cinematic two-shot in vertical 9:16. Dynamic character interaction: Jesus Christ rests His radiant right hand upon ${secondaryName}'s shoulder. Full 10s engaging Latin American Spanish lip-sync:\n[00:00-00:05] Jesus looks deeply into their eyes speaking firmly: "Dime con todo tu corazón: ¿crees que tengo el poder de arrancar esta aflicción y transformar para siempre lo que hoy llamas imposible?".\n[00:05-00:09] ${secondaryName} clutches their chest with heartfelt tears: "¡Creo con toda mi alma, mi Señor! ¡Perdona si dudé en la soledad, pero hoy me rindo ante Ti y pongo mi casa en tus santas manos!".\n[00:09-00:10] Golden warm glow expands between them. 8K render.\n${negativeLock}`,
        masterNetflixPrompt: `[NETFLIX CONTINUITY MASTER - SCENE 2]\n${envLockTag}\n${charJesusLock}\n${charSecLock}\n[EXACT SCENOGRAPHY]: Same rustic pine table, open Bible reflecting warm amber, glowing terracotta lamp, 3200K golden halo.\n[ACTION 10s]: Two-shot in ${env.name}. Jesus hand on ${secondaryName}'s shoulder. Eye contact and faith dialogue.\n[LIP-SYNC]: Spanish dialogue.\n${negativeLock}`,
        sfx: 'Latido cardíaco acelerado que se calma (-8dB), murmullo de fuego sereno (-12dB), resonancia de cuerdas celestiales (-10dB)',
        sfxTimeline: [
          { atSecond: '00:00 - 00:02', sound: 'Latido ansioso en pecho (thump-thump) que desacelera (-8dB)', purpose: 'Conexión empática con la angustia del personaje' },
          { atSecond: '00:03 - 00:05', sound: 'Resonancia sutil de arpa en 432Hz al contacto de la mano (-10dB)', purpose: 'Subrayar el toque físico de Jesús' },
          { atSecond: '00:06 - 00:08', sound: 'Sollozo aliviado y exhalación profunda (-9dB)', purpose: 'Realismo emocional del llanto de fe' },
          { atSecond: '00:08 - 00:10', sound: 'Zumbido armónico de partículas doradas en suspensión (-12dB)', purpose: 'Preparación de la atmósfera para el milagro' }
        ],
        bgMusicMood: 'Cuerdas conmovedoras y crescendo de esperanza'
      },
      // ESCENA 3: El momento sobrenatural del milagro por la palabra de Jesús
      {
        sceneNumber: 3,
        durationSec: 10,
        characterId: 'jesus_cartoon_3d',
        secondaryCharacterId: secondaryId,
        charactersInShot: ['jesus_cartoon_3d', secondaryId],
        interactionType: 'encuentro_con_jesus',
        timeframe: '00:20 - 00:30',
        action: `En el centro de ${env.name}, Jesús alza Su mano derecha con resplandor glorioso y decreta la orden de sanidad y victoria sobre "${cleanTopic}". La Biblia familiar en la mesa resplandece sobrenaturalmente y ondas de luz celestial a 4500K inundan cada rincón de la arquitectura de adobe y madera, rompiendo toda tiniebla.`,
        scenographyDetails: {
          exactLocation: `Centro majestuoso de ${env.name}, la arquitectura rústica transformada por la gloria celestial.`,
          narrativeProps: 'Biblia abierta de par en par emanando rayos dorados, la lámpara de aceite proyecta luz radiante, cartas o ataduras del pasado se desvanecen.',
          lightingSetup: 'Ondas volumétricas de luz dorada celestial a 4500K en ángulo ascendente, resplandor divino que satura los tonos madera y adobe.',
          spatialPlacement: 'Jesús en el centro del plano vertical 9:16 con mano alzada en soberana autoridad; ${secondaryName} arrodillada en reverente asombro.'
        },
        dialogueExchange: [
          {
            speakerName: 'Maestro Jesús',
            speakerId: 'jesus_cartoon_3d',
            dialogueSpanish: `¡Por la autoridad de mi Padre declaro sanidad, rompimiento de cadenas y restauración total sobre tu vida! ¡Queda libre ahora mismo!`,
            emotionalTone: 'Autoridad soberana majestuosa, potente y sin pausas',
            voicePresetName: jesusChar.voiceProfile.elevenLabsPreset
          },
          {
            speakerName: secondaryName,
            speakerId: secondaryId,
            dialogueSpanish: `¡Siento un fuego bendito quemando toda tristeza en mi pecho! ¡El peso que me ahogaba se fue, estoy respirando libertad!`,
            emotionalTone: 'Grito de asombro sagrado, éxtasis y gozo instantáneo',
            voicePresetName: secondaryChar.voiceProfile.elevenLabsPreset
          }
        ],
        narration: `Una sola palabra de Jesús [PAUSA] cambia el destino de toda una generación.`,
        onScreenText: 'LA PALABRA DE PODER',
        secondaryLabel: 'Mateo 8:13',
        lockedEnvironmentId: env.id,
        lockedEnvironmentName: env.name,
        lockedEnvironmentPromptEn: env.architecturePromptEn,
        imageToVideoPrompt: `${envLockTag}\n${charJesusLock}\n${charSecLock}\n[EXACT CINEMATIC SCENOGRAPHY (7 PRINCIPLES)]: 3D Pixar-Disney aesthetic in the EXACT SAME ${env.architecturePromptEn}. The rustic room is supercharged with divine glory. Volumetric god-rays stream across the ceiling cedar beams and adobe walls. The open family Bible on the pine table radiates celestial golden luminescence. 4500K divine glow.\nClip de 10s en vertical 9:16: Jesús de Nazaret extiende su mano luminosa hacia adelante; ondas de luz dorada celestial bañan a ${secondaryName}. Diálogo continuo en español: [00:00-00:05] Jesús: "¡Por la autoridad de mi Padre declaro sanidad, rompimiento de cadenas y restauración total sobre tu vida! ¡Queda libre ahora mismo!". [00:05-00:09] ${secondaryName}: "¡Siento un fuego bendito quemando toda tristeza en mi pecho! ¡El peso que me ahogaba se fue, estoy respirando libertad!". [00:09-00:10] Destello de gloria.\n${negativeLock}`,
        englishPromptWithSpanishDialogue: `${envLockTag}\n${charJesusLock}\n${charSecLock}\n[EXACT CINEMATIC SCENOGRAPHY (7 PRINCIPLES)]: High-end 3D Pixar-Disney animation in the EXACT SAME ${env.shortTag}. The architectural environment is illuminated by supernatural divine rays bouncing off cedar timber beams and terracotta tiles. Center stage: open Scriptures on the wooden table emitting radiant light particles. 4500K celestial brilliance.\n10-second continuous dramatic scene in vertical 9:16. Jesus Christ raises His glowing hand, releasing a wave of divine light. Non-stop rapid-fire Latin American Spanish lip-sync:\n[00:00-00:05] Jesus declares with sovereign loving authority: "¡Por la autoridad de mi Padre declaro sanidad, rompimiento de cadenas y restauración total sobre tu vida! ¡Queda libre ahora mismo!".\n[00:05-00:09] ${secondaryName} gasps in shock as peace floods their soul: "¡Siento un fuego bendito quemando toda tristeza en mi pecho! ¡El peso que me ahogaba se fue, estoy respirando libertad!".\n[00:09-00:10] Golden lens flares swirl. Synced lip-sync.\n${negativeLock}`,
        masterNetflixPrompt: `[NETFLIX CONTINUITY MASTER - SCENE 3]\n${envLockTag}\n${charJesusLock}\n${charSecLock}\n[EXACT SCENOGRAPHY]: Supernatural god-rays across cedar beams, glowing Scriptures on table, 4500K divine breakthrough illumination.\n[ACTION 10s]: Divine miracle wave in ${env.name}. Jesus raises right hand; ${secondaryName} receives breakthrough.\n[LIP-SYNC]: Spanish dialogue.\n${negativeLock}`,
        sfx: 'Impacto sónico celestial (boom de luz -6dB), campana de bronce vibrante (-8dB), viento torrencial divino (-8dB), coro angélico en ráfaga (-10dB)',
        sfxTimeline: [
          { atSecond: '00:00 - 00:02', sound: 'Impacto de bajo cinematográfico (Sub-bass drop celestial -6dB)', purpose: 'Subrayar el decreto y orden divina de Jesús' },
          { atSecond: '00:03 - 00:05', sound: 'Ráfaga de viento sobrenatural y crujido de cadenas rompiéndose (-7dB)', purpose: 'Efecto auditivo de liberación y milagro' },
          { atSecond: '00:06 - 00:08', sound: 'Jadeo de asombro y bocanada de aire recuperado (-8dB)', purpose: 'Resonancia orgánica de la sanidad en el personaje' },
          { atSecond: '00:08 - 00:10', sound: 'Campana de gloria y vibración de cuerdas a 432Hz (-10dB)', purpose: 'Cierre del clímax y fijación de retención' }
        ],
        bgMusicMood: 'Coro celestial imponente con orquesta en crescendo'
      },
      // ESCENA 4: La manifestación visible y el asombro
      {
        sceneNumber: 4,
        durationSec: 10,
        characterId: secondaryId,
        secondaryCharacterId: 'jesus_cartoon_3d',
        charactersInShot: [secondaryId, 'jesus_cartoon_3d'],
        interactionType: 'reaccion_asombro',
        timeframe: '00:30 - 00:40',
        action: `En la misma ${env.name}, la luz dorada del alba entra por el ventanal rústico de cedro, iluminando toda la estancia con serenidad y orden. ${secondaryName} contempla el milagro cumplido con lágrimas de júbilo y gratitud infinita junto a Jesús, mientras la mesa de madera y la Biblia abierta quedan como testimonio sagrado de la promesa cumplida.`,
        scenographyDetails: {
          exactLocation: `Estancia iluminada de ${env.name}, luz del amanecer entrando por el ventanal rústico.`,
          narrativeProps: 'Biblia familiar abierta en salmo de acción de gracias, ramo de flores campestres en jarra de barro en la mesa, ambiente de paz total.',
          lightingSetup: 'Luz matutina dorada a 5500K bañando el espacio con rayos cálidos y claros, resplandor divino suave y pacífico.',
          spatialPlacement: 'Jesús y el personaje humano de pie en plano medio conjunto sonriendo, enmarcados por la arquitectura rústica restaurada.'
        },
        dialogueExchange: [
          {
            speakerName: secondaryName,
            speakerId: secondaryId,
            dialogueSpanish: `¡Es real, Jesús mío, no es un sueño! ¡Mira mis manos, mira esta paz inquebrantable, lo que todos dijeron que era imposible Tú lo hiciste!`,
            emotionalTone: 'Grito apasionado de gratitud, risa y lágrimas de júbilo continuo',
            voicePresetName: secondaryChar.voiceProfile.elevenLabsPreset
          },
          {
            speakerName: 'Maestro Jesús',
            speakerId: 'jesus_cartoon_3d',
            dialogueSpanish: `Tu fe perseveró en el fuego y hoy ha vencido. Corre y sé testigo vivo ante los tuyos, porque las maravillas de Dios recién comienzan.`,
            emotionalTone: 'Sonrisa radiante, ternura paternal activa y continua',
            voicePresetName: jesusChar.voiceProfile.elevenLabsPreset
          }
        ],
        narration: `Lo que el mundo daba por perdido, [PAUSA] en las manos de Cristo floreció.`,
        onScreenText: 'EL MILAGRO CUMPLIDO',
        secondaryLabel: 'Lucas 1:37',
        lockedEnvironmentId: env.id,
        lockedEnvironmentName: env.name,
        lockedEnvironmentPromptEn: env.architecturePromptEn,
        imageToVideoPrompt: `${envLockTag}\n${charJesusLock}\n${charSecLock}\n[EXACT CINEMATIC SCENOGRAPHY (7 PRINCIPLES)]: 3D Pixar-Disney aesthetic in the EXACT SAME ${env.architecturePromptEn}. Golden dawn light at 5500K floods through the rustic window. The wooden dining table is orderly with a clay pitcher, wildflower sprigs, and the open family Bible. Peace and divine order restored to the household.\nClip de 10s en vertical 9:16: ${secondaryName} sonríe con lágrimas de alegría incontenible junto a Jesús resplandeciente. Diálogo continuo en español: [00:00-00:05] ${secondaryName}: "¡Es real, Jesús mío, no es un sueño! ¡Mira mis manos, mira esta paz inquebrantable, lo que todos dijeron que era imposible Tú lo hiciste!". [00:05-00:09] Jesús sonriendo: "Tu fe perseveró en el fuego y hoy ha vencido. Corre y sé testigo vivo ante los tuyos, porque las maravillas de Dios recién comienzan". [00:09-00:10] Luz del alba.\n${negativeLock}`,
        englishPromptWithSpanishDialogue: `${envLockTag}\n${charJesusLock}\n${charSecLock}\n[EXACT CINEMATIC SCENOGRAPHY (7 PRINCIPLES)]: High-end Pixar 3D animated style inside the EXACT SAME ${env.shortTag}. Restored interior architecture: soft morning dawn sunlight streaming through distressed timber window frame. On the pine table: open holy Scriptures, terracotta pitcher, peaceful atmosphere. 5500K natural warm morning light.\n10-second continuous emotional shot in vertical 9:16. ${secondaryName} weeps with pure joy beside Jesus Christ who wears the exact same tunic and blue sash. Fluid Latin American Spanish lip-sync:\n[00:00-00:05] ${secondaryName}: "¡Es real, Jesús mío, no es un sueño! ¡Mira mis manos, mira esta paz inquebrantable, lo que todos dijeron que era imposible Tú lo hiciste!".\n[00:05-00:09] Jesus speaks warmly: "Tu fe perseveró en el fuego y hoy ha vencido. Corre y sé testigo vivo ante los tuyos, porque las maravillas de Dios recién comienzan".\n[00:09-00:10] Warm morning light floods through window.\n${negativeLock}`,
        masterNetflixPrompt: `[NETFLIX CONTINUITY MASTER - SCENE 4]\n${envLockTag}\n${charJesusLock}\n${charSecLock}\n[EXACT SCENOGRAPHY]: Morning dawn through rustic window, restored peaceful interior, open Bible on pine table, 5500K warm ambient glow.\n[ACTION 10s]: Joy and grateful tears in ${env.name}. Jesus smiles lovingly beside ${secondaryName}.\n[LIP-SYNC]: Spanish dialogue.\n${negativeLock}`,
        sfx: 'Canto matutino de gorriones (-12dB), roce alegre de telas al abrazar (-9dB), carillón de luz matutina (-10dB), respiración llena de dicha (-10dB)',
        sfxTimeline: [
          { atSecond: '00:00 - 00:02', sound: 'Exclamación de júbilo y palmada de alegría en las manos (-7dB)', purpose: 'Enganche de victoria y rompimiento de tensión' },
          { atSecond: '00:03 - 00:05', sound: 'Canto cristalino de aves y brisa matutina en ventana (-11dB)', purpose: 'Sensación de nuevo amanecer y restauración' },
          { atSecond: '00:06 - 00:08', sound: 'Risa serena y tono cálido de bendición (-8dB)', purpose: 'Paz inmersiva del abrazo de Jesús' },
          { atSecond: '00:08 - 00:10', sound: 'Acorde majestuoso de violines y campanas de iglesia a lo lejos (-10dB)', purpose: 'Elevación emotiva del espectador' }
        ],
        bgMusicMood: 'Himno sinfónico pastoral triunfante'
      },
      // ESCENA 5: Cierre del capítulo (Gancho o Victoria Final)
      {
        sceneNumber: 5,
        durationSec: 10,
        characterId: 'jesus_cartoon_3d',
        secondaryCharacterId: secondaryId,
        charactersInShot: ['jesus_cartoon_3d', secondaryId],
        interactionType: isLast ? 'plano_conjunto_familiar' : 'dos_personajes_frente_a_frente',
        timeframe: '00:40 - 00:50',
        action: isLast 
          ? `En el umbral iluminado de ${env.name}, Jesús bendice a ${secondaryName} y a todos los que miran el video con las manos extendidas y una promesa eterna; el resplandor divino corona el hogar en paz.`
          : `En el umbral de ${env.name}, una nueva luz sobrenatural se abre en el camino de tierra exterior; Jesús y ${secondaryName} miran hacia el horizonte con suspenso dramático y expectación profética.`,
        scenographyDetails: {
          exactLocation: `Umbral de la puerta rústica de cedro de ${env.name}, conectando el interior del hogar con el exterior.`,
          narrativeProps: isLast ? 'Hogar rebosante de luz dorada, Biblia familiar en primer plano' : 'Camino exterior con misterioso resplandor en la lejanía, puerta de cedro entreabierta',
          lightingSetup: isLast ? 'Luz divina frontal a 5500K que bendice directamente a la cámara' : 'Contraluz dramático de suspenso con haz misterioso desde el horizonte exterior',
          spatialPlacement: 'Jesús y el personaje humano enmarcados por el umbral de madera en composición cinematográfica 9:16.'
        },
        dialogueExchange: isLast
          ? [
              {
                speakerName: 'Maestro Jesús',
                speakerId: 'jesus_cartoon_3d',
                dialogueSpanish: `A ti que miras este video con aflicción en tu corazón: hoy entro a tu hogar a hacer este mismo milagro; escribe AMÉN y recibe mi paz ahora mismo.`,
                emotionalTone: 'Mirada fija a cámara con bendición directa apasionada',
                voicePresetName: jesusChar.voiceProfile.elevenLabsPreset
              },
              {
                speakerName: secondaryName,
                speakerId: secondaryId,
                dialogueSpanish: `¡Amén Señor de la gloria! ¡No guardes este milagro solo para ti, compártelo ahora con quien necesita esperanza urgente!`,
                emotionalTone: 'Llamado de fe enérgica y entusiasmo victorioso',
                voicePresetName: secondaryChar.voiceProfile.elevenLabsPreset
              }
            ]
          : [
              {
                speakerName: secondaryName,
                speakerId: secondaryId,
                dialogueSpanish: `¡Señor Jesús!... ¡Mira esa columna de fuego resplandeciendo sobre el sendero de mi casa, qué secreto nos estás revelando ahora!`,
                emotionalTone: 'Suspenso cinematográfico extremo y asombro creciente',
                voicePresetName: secondaryChar.voiceProfile.elevenLabsPreset
              },
              {
                speakerName: 'Maestro Jesús',
                speakerId: 'jesus_cartoon_3d',
                dialogueSpanish: `Aún no has visto nada comparado con lo que viene; prepara tu corazón para la revelación de mañana en la siguiente parte.`,
                emotionalTone: 'Misterio divino magnético que atrapa al espectador',
                voicePresetName: jesusChar.voiceProfile.elevenLabsPreset
              }
            ],
        narration: isLast
          ? `Jesús nunca llega tarde. Si tú crees en Su poder, escribe AMÉN y comparte esta serie completa.`
          : `Pero esto era solo el comienzo del milagro. [PAUSA] ¿Qué ocurrirá al amanecer? Descúbrelo en la PARTE ${epNum + 1}.`,
        onScreenText: isLast ? 'ESCRIBE "AMÉN" Y COMPARTE' : `CONTINÚA EN PARTE ${epNum + 1}`,
        secondaryLabel: isLast ? 'FIN DE LA SERIE' : `PARTE ${epNum + 1} MAÑANA`,
        lockedEnvironmentId: env.id,
        lockedEnvironmentName: env.name,
        lockedEnvironmentPromptEn: env.architecturePromptEn,
        imageToVideoPrompt: isLast
          ? `${envLockTag}\n${charJesusLock}\n${charSecLock}\n[EXACT CINEMATIC SCENOGRAPHY (7 PRINCIPLES)]: 3D Pixar-Disney aesthetic. Grand finale at the luminous doorway of ${env.architecturePromptEn}. Luminous 5500K golden divine blessing directly lighting the foreground. Full family home restored.\nClip final de 10s en vertical 9:16 en la misma ${env.name}: Jesús de Nazaret animado 3D bendiciendo hacia la cámara junto a ${secondaryName}. Diálogo continuo en español: [00:00-00:05] Jesús mirando al espectador: "A ti que miras este video con aflicción en tu corazón: hoy entro a tu hogar a hacer este mismo milagro; escribe AMÉN y recibe mi paz ahora mismo". [00:05-00:09] ${secondaryName}: "¡Amén Señor de la gloria! ¡No guardes este milagro solo para ti, compártelo ahora con quien necesita esperanza urgente!". [00:09-00:10] Texto: ESCRIBE AMÉN.\n${negativeLock}`
          : `${envLockTag}\n${charJesusLock}\n${charSecLock}\n[EXACT CINEMATIC SCENOGRAPHY (7 PRINCIPLES)]: 3D Pixar-Disney aesthetic. Cinematic cliffhanger at the rustic doorway of ${env.architecturePromptEn}. A mysterious celestial glow illuminates the exterior country pathway, casting dramatic long shadows into the entryway.\nClip de 10s en vertical 9:16 con suspenso dramático en la puerta de ${env.name}: Jesús y ${secondaryName} mirando una luz misteriosa. Diálogo continuo en español: [00:00-00:05] ${secondaryName}: "¡Señor Jesús!... ¡Mira esa columna de fuego resplandeciendo sobre el sendero de mi casa, qué secreto nos estás revelando ahora!". [00:05-00:09] Jesús: "Aún no has visto nada comparado con lo que viene; prepara tu corazón para la revelación de mañana en la siguiente parte". [00:09-00:10] Texto: CONTINÚA EN PARTE ${epNum + 1}.\n${negativeLock}`,
        englishPromptWithSpanishDialogue: isLast
          ? `${envLockTag}\n${charJesusLock}\n${charSecLock}\n[EXACT CINEMATIC SCENOGRAPHY (7 PRINCIPLES)]: High-end 3D Pixar-Disney animation. Grand finale at the luminous doorway of ${env.shortTag}. Radiant 5500K golden blessing. Pure peace and restoration.\n10-second continuous grand finale in vertical 9:16 (Pixar 3D style) inside the EXACT SAME ${env.shortTag}. Jesus Christ extends His loving hands toward camera in direct blessing with ${secondaryName} smiling in joy. Non-stop rapid dialogue in Latin American Spanish:\n[00:00-00:05] Jesus speaks into camera: "A ti que miras este video con aflicción en tu corazón: hoy entro a tu hogar a hacer este mismo milagro; escribe AMÉN y recibe mi paz ahora mismo".\n[00:05-00:09] ${secondaryName}: "¡Amén Señor de la gloria! ¡No guardes este milagro solo para ti, compártelo ahora con quien necesita esperanza urgente!".\n[00:09-00:10] Title: "ESCRIBE AMÉN". 10s synced lip-sync.\n${negativeLock}`
          : `${envLockTag}\n${charJesusLock}\n${charSecLock}\n[EXACT CINEMATIC SCENOGRAPHY (7 PRINCIPLES)]: High-end 3D Pixar-Disney animation. Cinematic cliffhanger at the doorway of ${env.shortTag}. A glowing supernatural mystery on the rustic dirt pathway outside casts dramatic chiaroscuro rims.\n10-second continuous cinematic cliffhanger in vertical 9:16 (Pixar 3D style) at the doorway of the EXACT SAME ${env.shortTag}. Dramatic cliffhanger as ${secondaryName} gazes at a distant bright glow. Non-stop dialogue in Latin American Spanish:\n[00:00-00:05] ${secondaryName}: "¡Señor Jesús!... ¡Mira esa columna de fuego resplandeciendo sobre el sendero de mi casa, qué secreto nos estás revelando ahora!".\n[00:05-00:09] Jesus smiles with calm divine omniscience: "Aún no has visto nada comparado con lo que viene; prepara tu corazón para la revelación de mañana en la siguiente parte".\n[00:09-00:10] Title: "CONTINÚA EN PARTE ${epNum + 1}". 10s synced lip-sync.\n${negativeLock}`,
        masterNetflixPrompt: isLast
          ? `[NETFLIX CONTINUITY MASTER - SCENE 5 (FINALE)]\n${envLockTag}\n${charJesusLock}\n${charSecLock}\n[EXACT SCENOGRAPHY]: Luminous doorway, full home blessing, 5500K celestial glory.\n[ACTION 10s]: Direct blessing to camera in ${env.name}. Jesus and ${secondaryName} invite viewers to comment AMEN.\n[LIP-SYNC]: Spanish dialogue.\n${negativeLock}`
          : `[NETFLIX CONTINUITY MASTER - SCENE 5 (CLIFFHANGER)]\n${envLockTag}\n${charJesusLock}\n${charSecLock}\n[EXACT SCENOGRAPHY]: Doorway silhouette, mysterious pathway glow on the horizon, dramatic cinematic rim lighting.\n[ACTION 10s]: Cliffhanger at door of ${env.name}. Glowing mystery on the path.\n[LIP-SYNC]: Spanish dialogue.\n${negativeLock}`,
        sfx: isLast ? 'Campana solemne de gloria eterna (-6dB), repique triunfal de aleluya (-8dB), aplauso etéreo (-10dB)' : 'Acorde de suspenso celestial (Braam -6dB), latido misterioso acelerado (-7dB), zumbido de misterio cósmico (-9dB)',
        sfxTimeline: isLast
          ? [
              { atSecond: '00:00 - 00:02', sound: 'Campana solemne de templo y eco celestial (-6dB)', purpose: 'Enganche directo a la cámara' },
              { atSecond: '00:03 - 00:05', sound: 'Oleada dorada de bendición (Whoosh suave -8dB)', purpose: 'Acompañamiento del llamado a comentar' },
              { atSecond: '00:06 - 00:08', sound: 'Chime radiante y arpa de victoria (-9dB)', purpose: 'Subrayar el llamado a compartir' },
              { atSecond: '00:08 - 00:10', sound: 'Acorde glorioso final y campana de paz sostenida (-8dB)', purpose: 'Retención y llamado a comentar AMÉN' }
            ]
          : [
              { atSecond: '00:00 - 00:02', sound: 'Golpe cinematográfico de intriga (Braam dramático -6dB)', purpose: 'Alerta instantánea de cliffhanger' },
              { atSecond: '00:03 - 00:05', sound: 'Crujido de madera y puerta chirriando al abrirse (-8dB)', purpose: 'Tensión de suspenso del umbral' },
              { atSecond: '00:06 - 00:08', sound: 'Latido acelerado (thud-thud) y zumbido misterioso (-7dB)', purpose: 'Curiosidad magnética para la siguiente parte' },
              { atSecond: '00:08 - 00:10', sound: 'Crescendo abrupto de cuerdas que se corta en seco (-6dB)', purpose: 'Corte de suspenso para obligar a ver la Parte 2' }
            ],
        bgMusicMood: isLast ? 'Himno victorioso de adoración y gloria' : 'Suspenso cinematográfico con chelo y campanas'
      }
    ];

    return {
      episodeNumber: epNum,
      episodeTitle: epTitle,
      hook: epNum === 1
        ? `Nadie imaginaba lo que estaba a punto de suceder con "${cleanTopic}". Cuando todo parecía perdido, Jesús apareció.`
        : `A la mañana siguiente, lo que ocurrió con ${secondaryName} dejó a todos con la boca abierta. Jesús no había terminado aún.`,
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
      whoInhabits: `Espacio íntimo habitado por ${secondaryName} y su familia, marcado por la memoria y la fe probada.`,
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
        characterName: secondaryName,
        environmentConnection: 'Su espacio refleja su abatimiento: la silla en la esquina en sombras y la mesa con papeles o elementos que expresan su dolor.'
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
    primaryCharacterIds: ['jesus_cartoon_3d', secondaryId],
    lockedEnvironmentId: env.id,
    lockedEnvironmentName: env.name,
    lockedEnvironmentPromptEn: env.architecturePromptEn,
    scenographyDirection,
    episodes
  };
}

/**
 * Generates a complete serialized miniseries using Gemini AI.
 * Strictly enforces that Jesus Christ is an active protagonist with spoken dialogue in Spanish
 * and enforces Netflix-grade continuity across environment, character wardrobe, and voice profiles.
 */
export async function generateMiniseriesWithGemini(
  ai: GoogleGenAI,
  req: MiniseriesGenerationRequest
): Promise<GeneratedMiniseriesPackage> {
  const { topic, totalParts = 3, category = "milagro_familiar", lockedEnvironmentId } = req;
  const targetParts = Math.max(2, Math.min(4, Number(totalParts) || 3));
  const cleanTopic = topic?.trim() || "El perdón del padre ausente que volvió a las 3:00 AM";

  const systemInstruction = `Eres el Director Creativo de Guiones y Productor Ejecutivo de Miniseries y Telenovelas de Fe Serializadas con animación 3D (estilo Pixar/Disney) con estándar de continuidad cinematográfica NETFLIX.

DIRECTIVA CRÍTICA #1: FIDELIDAD TOTAL AL TEMA
La historia DEBE estar íntimamente relacionada con el TEMA EXACTO proporcionado por el usuario ("${cleanTopic}"). No inventes historias genéricas desconectadas. Si el tema trata de un padre, un centurión, un hospital, una viuda, un milagro médico o un joven de la calle, la trama debe centrarse 100% en ese conflicto real.

DIRECTIVA CRÍTICA #2: JESÚS DE NAZARET ES PERSONAJE PROTAGÓNICO VIVO Y ACTIVO
Jesús ('jesus_cartoon_3d', nombre: 'Maestro Jesús') OBLIGATORIAMENTE debe ser un personaje principal dentro de la historia.
- Jesús debe aparecer físicamente en las escenas clave, no solo como un concepto lejano.
- Jesús debe tener parlamentos propios en los intercambios de diálogo (speakerName: 'Maestro Jesús', speakerId: 'jesus_cartoon_3d').
- Sus líneas deben ser en español latinoamericano, llenas de gracia, ternura paternal, compasión y autoridad divina para sanar, perdonar, consolar o romper cadenas.
- Jesús debe interactuar de cerca con los personajes humanos (poner su mano en el hombro, bendecir, mirar a los ojos con amor, tomar la mano del enfermo).
- 'charactersInShot' en las escenas clave debe incluir siempre a 'jesus_cartoon_3d' junto al personaje humano (interacción de 2 o más personajes en el mismo plano cinematográfico).

DIRECTIVA CRÍTICA #3: CONTINUIDAD NETFLIX DE ENTORNO, VESTUARIO Y VOCES (CONSISTENCIA TOTAL ENTRE CLIPS)
Para evitar que IAs como Flow, Kling, Runway o Sora cambien bruscamente la habitación, la ropa o las voces entre escenas:
1. BLOQUE DE ENTORNO FIJO (LOCKED ENVIRONMENT):
   Cada capítulo DEBE tener un escenario fijo e inmutable (ej: "Rustic interior kitchen with Andalusian ceramic tiles, distressed wooden dining table, warm candle lantern at 3:00 AM midnight").
   TODAS las 5 escenas del capítulo DEBEN incluir en 'englishPromptWithSpanishDialogue' el tag exacto:
   "[LOCKED ENVIRONMENT: <descripción idéntica de la habitación, azulejos, iluminación y muebles>]". NUNCA cambies de una cocina interior a un prado exterior soleado entre la escena 1 y la escena 2.
2. BLOQUE DE VESTUARIO Y MODEL SHEET FIJO (LOCKED CHARACTERS & WARDROBE):
   Cada personaje DEBE tener su vestuario y peinado bloqueados en TODAS las escenas:
   - Jesús: "[LOCKED CHARACTER - JESUS: Jesus Christ, 33yo, noble kind face, hazel eyes, wavy brown shoulder-length hair, neat short beard, off-white linen tunic with sky-blue woven sash draped over left shoulder, soft golden divine aura. EXACT SAME FACE, HAIR AND ROBE IN EVERY SHOT]".
   - Personaje Humano: "[LOCKED CHARACTER: <Nombre>, <edad>, <peinado fijo e inmutable>, <ropa exacta idéntica en todos los planos>, <expresión>]".
3. BLOQUE DE VOCES FIJAS:
   Indica en cada turno de diálogo el 'voicePresetName' y el perfil de voz (Jesús: Barítono cálido reverente 0.88x; Personaje: timbre emotivo constante).
4. PROMPTS NEGATIVOS OBLIGATORIOS:
   En cada prompt incluye: "[NEGATIVE PROMPT: no change of room or setting, no outdoor hills if indoor scene, no change of character clothing, no change of hairstyle, no facial morphing, no extra limbs]".

DIRECTIVA CRÍTICA #3B: MAESTRÍA EN DIRECCIÓN DE ESCENOGRAFÍA Y NARRATIVA ESPACIAL EN CADA ESCENA (LOS 7 PRINCIPIOS CINEMATOGRÁFICOS)
Como Director de Arte y Escenógrafo de animación 3D de alta gama (estilo Pixar/Disney), DEBES incorporar la escenografía exacta directamente en el guion de CADA escena:
1. Análisis del Espacio y Ubicación Concreta: Cada escena ocurre en un lugar físico determinado (ej: "Interior de cocina rústica en penumbra a las 3:00 AM con paredes de adobe blanco encalado y vigas de cedro").
2. Visión del Director: Tono reverente y dramático, atmósfera densa y palpable con partículas doradas de polvo en suspensión.
3. Identidad Visual Coherente: Materiales y texturas detalladas (madera de pino envejecida con vetas marcadas, cerámica de barro cocido, lino rústico) e iluminación volumétrica calculada (2800K luz de luna y vela en el conflicto; 3200K-5500K resplandor divino celestial de Jesús).
4. El Espacio Refleja a los Personajes: La disposición de los personajes respecto al mobiliario proyecta su angustia o su fe (arrodillado en sombras junto a la mesa en el tercio izquierdo; Jesús entra por el centro o derecha trayendo claridad).
5. Objetos Narrativos Activos: Cada escena debe incluir objetos narrativos tangibles que cuentan la historia (la Biblia familiar con hojas gastadas por las lágrimas, la lámpara de aceite con llama temblorosa, cartas de cobro o diagnósticos médicos, cruz de madera rústica en la pared).
6. Evolución Escénica: La escenografía debe progresar visualmente a lo largo de los capítulos (de la penumbra y soledad del inicio, a la iluminación cálida y orden restaurado con el milagro de Jesús).
7. Coordinación Escenografía, Vestuario e Iluminación: El lino blanco y manto azul cielo de Jesús contrastan armónicamente contra la madera cálida y los tonos neutros del fondo.

EN CADA ESCENA:
- El campo 'action' DEBE describir la escenografía física, la posición exacta de los personajes frente a los muebles y los objetos narrativos presentes en el encuadre.
- El campo 'englishPromptWithSpanishDialogue' e 'imageToVideoPrompt' DEBEN comenzar con el bloque exacto de escenografía:
  "[EXACT CINEMATIC SCENOGRAPHY (7 PRINCIPLES)]: 3D Pixar-Disney animation, <arquitectura exacta de la habitación, texturas de madera y adobe, muebles rústicos específicos, objetos narrativos activos como la Biblia familiar y la lámpara de aceite, iluminación volumétrica con rayos a 45 grados y resplandor divino cálido a 3200K, composición vertical 9:16 con profundidad de campo cinematográfica>".

DIRECTIVA CRÍTICA #4: ESTRUCTURA POR CAPÍTULO Y PLANOS DE 10 SEGUNDOS (DIÁLOGOS DENSOS Y CERO SILENCIOS)
- Debes generar EXACTAMENTE ${targetParts} capítulos completos y divididos (Parte 1 a Parte ${targetParts}).
- Cada capítulo tiene EXACTAMENTE 5 escenas continuas de 10 segundos cada una (durationSec: 10, total 50 segundos por capítulo).
- En CADA plano debe haber interacción real entre 2 personajes en cuadro.
- PROHIBIDO EL SILENCIO O LOS DIÁLOGOS CORTOS: La gente abandona los videos si hay pausas o silencios prolongados. Los 10 segundos deben estar COMPLETAMENTE LLENOS de diálogo continuo y apasionado entre los dos personajes con intercambio rápido (mínimo 28 a 40 palabras por escena de 10s):
  * [00:00 - 00:05]: Turno 1 (Personaje 1 clama o pregunta con profunda emoción, 14-20 palabras).
  * [00:05 - 00:09]: Turno 2 (Personaje 2 o Maestro Jesús responde con autoridad, consuelo o decreto de milagro sin vacíos, 14-20 palabras).
  * En esos 10 segundos POR MUCHO puede haber medio segundo de silencio para respiración dramática; el resto es habla continua de alto enganche y retención.
- EFECTOS DE SONIDO SFX FRECUENTES (CRONOGRAMA CADA 2 SEGUNDOS):
  * Cada escena debe incluir un 'sfxTimeline' con 4 impactos o efectos sonoros distribuidos a lo largo de los 10s (00:00-00:02, 00:03-00:05, 00:06-00:08, 00:08-00:10).
  * Ejemplos de SFX: Truenos, latidos acelerados, quejidos, pasos celestiales, crujidos de madera, arpas en 432Hz, whooshes de luz dorada, campanas triunfales y suspiros de alivio.
- TRANSICIONES CINEMATOGRÁFICAS ENTRE VIDEOS ('transitionToNext' y 'transitionType'):
  * Cada escena debe especificar una regla de transición visual continua y fluida hacia la siguiente toma (sin saltos bruscos ni cuadros negros):
    - Disolvencia de Luz Dorada (0.5s a 3200K): empalma la mirada o el gesto con resplandor celestial continuo.
    - Match Cut de Continuidad: la mano extendida o el giro de cabeza continúa exactamente en el primer fotograma del plano siguiente.
    - Whip Pan Dinámico Celestial (0.3s): barrido dinámico de cámara con desenfoque direccional.
    - Zoom In Continuo Suave (0.4s): avance de lente sin salto que sumerge al espectador.
- Prompts en inglés ('englishPromptWithSpanishDialogue') en formato cinematográfico 9:16 estilo Pixar 3D de alta gama con los candados de continuidad arriba descritos.

DIRECTIVA CRÍTICA #5: SUSPENSO SERIALIZADO Y GANCHO VIRAL
- Cada capítulo tiene un hook inicial poderoso en los primeros 2 segundos.
- Los capítulos intermedios terminan con un cliffhanger irresistible que obliga al espectador a esperar la siguiente parte.
- El último capítulo culmina con la victoria gloriosa del milagro de Jesús y el llamado directo a comentar "AMÉN".`;

  const userPrompt = `Genera la miniserie completa dividida de ${targetParts} capítulos para el tema: "${cleanTopic}".
Categoría: ${category}.
RECUERDA: La IA generadora DEBE aplicar maestría escenográfica cinematográfica en cada guion y escena:
- Identifica y describe el espacio exacto (materiales, vigas, muros de adobe, texturas).
- Define la disposición espacial de los personajes respecto a los muebles (mesa, umbral, sillas).
- Define la iluminación volumétrica calculada (2800K para conflicto a 3200K-5500K para gloria de Jesús).
- Incluye objetos narrativos activos en cada escena (Biblia familiar, lámpara de aceite con llama viva, cruz de madera).
Jesús de Nazaret ('jesus_cartoon_3d') DEBE estar presente físicamente como personaje activo y hablar en los diálogos de las escenas impartiendo el milagro, la paz o el perdón.
Cada capítulo debe tener 5 escenas continuas de 10 segundos cada una.`;

  const candidateModels = [
    "gemini-3.8-flash",
    "gemini-3.1-flash-lite",
    "gemini-flash-latest"
  ];

  let lastError: any = null;

  for (const model of candidateModels) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
        model,
        contents: userPrompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              seriesTitle: { type: Type.STRING },
              logline: { type: Type.STRING },
              category: { type: Type.STRING },
              categoryLabel: { type: Type.STRING },
              totalPartsPlanned: { type: Type.INTEGER },
              bannerHook: { type: Type.STRING },
              primaryCharacterIds: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
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
                          durationSec: { type: Type.NUMBER },
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
                          scenographyDetails: {
                            type: Type.OBJECT,
                            properties: {
                              exactLocation: { type: Type.STRING },
                              narrativeProps: { type: Type.STRING },
                              lightingSetup: { type: Type.STRING },
                              spatialPlacement: { type: Type.STRING }
                            }
                          },
                          sfx: { type: Type.STRING },
                          sfxTimeline: {
                            type: Type.ARRAY,
                            items: {
                              type: Type.OBJECT,
                              properties: {
                                atSecond: { type: Type.STRING },
                                sound: { type: Type.STRING },
                                purpose: { type: Type.STRING }
                              },
                              required: ["atSecond", "sound", "purpose"]
                            }
                          },
                          transitionToNext: { type: Type.STRING },
                          transitionType: { type: Type.STRING },
                          bgMusicMood: { type: Type.STRING }
                        },
                        required: [
                          "sceneNumber",
                          "durationSec",
                          "characterId",
                          "charactersInShot",
                          "action",
                          "dialogueExchange",
                          "narration",
                          "onScreenText",
                          "imageToVideoPrompt",
                          "englishPromptWithSpanishDialogue",
                          "sfx",
                          "bgMusicMood"
                        ]
                      }
                    },
                    socialPackage: {
                      type: Type.OBJECT,
                      properties: {
                        youtubeTitle: { type: Type.STRING },
                        facebookTitle: { type: Type.STRING },
                        caption: { type: Type.STRING },
                        hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
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
      // Ensure Jesus is explicitly in primary character list
      if (!result.primaryCharacterIds.includes('jesus_cartoon_3d')) {
        result.primaryCharacterIds.unshift('jesus_cartoon_3d');
      }

      // Determine appropriate environment for consistency
      const matchedEnv = (lockedEnvironmentId && SERIES_ENVIRONMENTS_FE.find(e => e.id === lockedEnvironmentId))
        || SERIES_ENVIRONMENTS_FE[0];
      
      if (!result.lockedEnvironmentId) {
        result.lockedEnvironmentId = matchedEnv.id;
        result.lockedEnvironmentName = matchedEnv.name;
        result.lockedEnvironmentPromptEn = matchedEnv.architecturePromptEn;
      }

      const jesusChar = CARTOON_CHARACTERS_FE.find(c => c.id === 'jesus_cartoon_3d')!;
      const secondaryId = result.primaryCharacterIds.find(id => id !== 'jesus_cartoon_3d') || 'sara_madre_fe';
      const secondaryChar = CARTOON_CHARACTERS_FE.find(c => c.id === secondaryId) || CARTOON_CHARACTERS_FE[3];

      const envLockTag = `[LOCKED ENVIRONMENT - ${matchedEnv.shortTag.toUpperCase()}]: ${matchedEnv.architecturePromptEn} Lighting: ${matchedEnv.lightingSetup}. EXACT SAME ROOM, ARCHITECTURAL DETAILS, TILES, AND PROPS IN ALL ANGLES.`;
      const charJesusLock = `[LOCKED CHARACTER - JESUS]: ${jesusChar.exactModelSheetLockEn}`;
      const charSecLock = `[LOCKED CHARACTER - ${secondaryChar.name.toUpperCase()}]: ${secondaryChar.exactModelSheetLockEn}`;
      const negativeLock = `[NEGATIVE CONTINUITY PROMPT: ${matchedEnv.negativePromptEn}, no changes in character clothing, no change of hairstyle, no facial morphing, no extra limbs, no camera jump cuts]`;

      result.episodes.forEach(ep => {
        ep.lockedEnvironmentId = ep.lockedEnvironmentId || matchedEnv.id;
        ep.lockedEnvironmentName = ep.lockedEnvironmentName || matchedEnv.name;
        ep.lockedEnvironmentPromptEn = ep.lockedEnvironmentPromptEn || matchedEnv.architecturePromptEn;

        // Ensure complete SEO fields for every chapter
        if (!ep.socialPackage) {
          ep.socialPackage = {
            youtubeTitle: `🔴 ${result.seriesTitle || cleanTopic} (Parte ${ep.episodeNumber}) #MiniserieDeFe #Jesus`,
            facebookTitle: `Lo que Jesús hizo cuando todo parecía perdido (Parte ${ep.episodeNumber})`,
            caption: `¿Estás pasando por una prueba difícil? Mira cómo Jesús intervino en esta historia de fe.\n\n👉 Escribe AMÉN y comparte.\n👉 Comenta PARTE ${ep.episodeNumber + 1}.`,
            hashtags: ['#MiniserieDeFe', `#Parte${ep.episodeNumber}`, '#JesusEsReal', '#MilagroDeDios'],
            pinnedComment: `Escribe tu clamor aquí abajo: "Jesús, yo creo en Tu poder para mi familia". Amén.`
          };
        }
        if (!ep.socialPackage.tiktokTitle) {
          ep.socialPackage.tiktokTitle = `¿Qué harías si Jesús entra a tu casa en tu peor momento? (Parte ${ep.episodeNumber})`;
        }
        if (!ep.socialPackage.seoKeywords || ep.socialPackage.seoKeywords.length === 0) {
          ep.socialPackage.seoKeywords = [
            'Jesús hace milagros',
            'serie cristiana animada 3d',
            'clamor en aflicción',
            'oracion de la noche',
            'testimonio real de fe'
          ];
        }
        if (!ep.socialPackage.searchQueries || ep.socialPackage.searchQueries.length === 0) {
          ep.socialPackage.searchQueries = [
            'oracion a jesus cuando no hay esperanza',
            `serie de fe capitulo ${ep.episodeNumber}`,
            'milagro de jesus en la familia'
          ];
        }
        if (!ep.socialPackage.thumbnailHook) {
          ep.socialPackage.thumbnailHook = `LO QUE JESÚS HIZO EN EL MOMENTO MÁS DIFÍCIL • PARTE ${ep.episodeNumber}`;
        }
        if (!ep.socialPackage.suggestedAudio) {
          ep.socialPackage.suggestedAudio = 'Worship Cinematic Ambient Piano & Strings 432Hz';
        }

        ep.scenes.forEach((sc, scIdx) => {
          sc.lockedEnvironmentId = sc.lockedEnvironmentId || matchedEnv.id;
          sc.lockedEnvironmentName = sc.lockedEnvironmentName || matchedEnv.name;
          sc.lockedEnvironmentPromptEn = sc.lockedEnvironmentPromptEn || matchedEnv.architecturePromptEn;
          
          sc.sfx = sc.sfx || 'Respiración contenida, suave brisa celestial (-10dB)';
          if (!sc.sfxTimeline || sc.sfxTimeline.length === 0) {
            sc.sfxTimeline = [
              { atSecond: '00:00 - 00:02', sound: 'Golpe auditivo de entrada o suspiro profundo (-7dB)', purpose: 'Enganche auditivo inmediato' },
              { atSecond: '00:03 - 00:05', sound: 'Foco de ambiente: llama crepitante o paso celestial (-10dB)', purpose: 'Tensión dramática continua' },
              { atSecond: '00:06 - 00:08', sound: 'Whoosh celestial / resonancia de cuerdas (-8dB)', purpose: 'Acompañamiento del clímax del diálogo' },
              { atSecond: '00:08 - 00:10', sound: 'Campana o eco suave de transición (-10dB)', purpose: 'Conexión a la siguiente escena sin silencio' }
            ];
          }
          sc.bgMusicMood = sc.bgMusicMood || 'Piano en 432Hz con cuerdas suaves de esperanza (-18dB)';
          const defaultTransitions = [
            'Disolvencia de Luz Dorada (0.5s) a 3200K empalmando la mirada hacia la siguiente escena sin saltos ni cortes negros',
            'Match Cut Continuo de Movimiento: El gesto del brazo enlaza directamente con el primer plano de la escena siguiente',
            'Zoom In Continuo Suave (0.4s) con haz de luz celestial que sumerge al espectador sin salto',
            'Whip Pan Dinámico Celestial (0.3s) con desenfoque de movimiento horizontal conectando al clímax',
            'Fundido de Resplandor Eterno (0.6s) con destello celestial final invitando a comentar AMÉN'
          ];
          sc.transitionToNext = sc.transitionToNext || defaultTransitions[scIdx % defaultTransitions.length];
          sc.transitionType = sc.transitionType || (scIdx === 0 ? 'disolvencia_dorada' : scIdx === 1 ? 'match_cut' : scIdx === 2 ? 'zoom_continuo' : 'whip_pan');
          sc.action = sc.action || '';
          sc.narration = sc.narration || '';
          sc.onScreenText = sc.onScreenText || 'DIOS DE MILAGROS';
          sc.secondaryLabel = sc.secondaryLabel || 'MINISERIE DE FE';
          sc.charactersInShot = sc.charactersInShot || ['jesus_cartoon_3d'];
          sc.dialogueExchange = sc.dialogueExchange || [];
          sc.timeframe = sc.timeframe || '00:00 - 00:10';
          sc.englishPromptWithSpanishDialogue = sc.englishPromptWithSpanishDialogue || sc.imageToVideoPrompt || '';
          sc.imageToVideoPrompt = sc.imageToVideoPrompt || sc.englishPromptWithSpanishDialogue || '';

          if (!sc.scenographyDetails) {
            sc.scenographyDetails = {
              exactLocation: `Interior rústico de ${matchedEnv.name}, muros de adobe y vigas de cedro.`,
              narrativeProps: 'Biblia familiar abierta en la mesa de pino, lámpara de aceite con llama activa, cruz de madera.',
              lightingSetup: 'Iluminación volumétrica cálida a 3200K con halo celestial dorado de Jesús.',
              spatialPlacement: 'Composición cinematográfica 9:16, plano conjunto frente a frente con profundidad de campo.'
            };
          }

          if (!sc.masterNetflixPrompt) {
            sc.masterNetflixPrompt = `${envLockTag}\n${charJesusLock}\n${charSecLock}\n${sc.englishPromptWithSpanishDialogue}\n${negativeLock}`;
          }
          if (!sc.englishPromptWithSpanishDialogue.includes('LOCKED ENVIRONMENT')) {
            sc.englishPromptWithSpanishDialogue = `${envLockTag}\n${charJesusLock}\n${charSecLock}\n${sc.englishPromptWithSpanishDialogue}\n${negativeLock}`;
          }
          if (!sc.imageToVideoPrompt.includes('LOCKED ENVIRONMENT')) {
            sc.imageToVideoPrompt = `${envLockTag}\n${charJesusLock}\n${charSecLock}\n${sc.imageToVideoPrompt}\n${negativeLock}`;
          }
        });
      });

      if (!result.scenographyDirection) {
        const fallbackObj = buildFallbackMiniseries(result.seriesTitle || cleanTopic, result.episodes.length, result.category || category, matchedEnv.id);
        result.scenographyDirection = fallbackObj.scenographyDirection;
      }

      return result;
    } catch (err: any) {
        lastError = err;
        const errMsg = String(err?.message || err);
        const isTransient = errMsg.includes("503") || errMsg.includes("UNAVAILABLE") || errMsg.includes("high demand") || errMsg.includes("429");
        if (isTransient && attempt < 1) {
          const delay = 800 + Math.floor(Math.random() * 400);
          console.warn(`[MiniseriesGenerator] Transient spike on ${model} (attempt ${attempt + 1}/2). Retrying in ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }
        break; // Advance to next model pool
      }
    }
    // Brief pause before trying next model pool
    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  // If all candidate models experienced temporary demand spikes or rate limits, serve the theme-aligned series
  console.info(`[MiniseriesGenerator] Serving theme-aligned series with Jesus due to upstream temporary demand: "${cleanTopic}"`);
  return buildFallbackMiniseries(cleanTopic, targetParts, category, lockedEnvironmentId);
}
