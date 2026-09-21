export interface CartoonCharacter {
  id: string;
  name: string;
  subtitle: string;
  age: string;
  role: string;
  archetype: string;
  shortDescription: string;
  avatarEmoji: string;
  themeColor: string;
  accentGradient: string;
  fallbackImage: string;
  fixedIdentityPrompt: string;
  fixedIdentityPromptEn: string;
  clothingStyle: string;
  lockedWardrobeDesc: string;
  exactModelSheetLockEn: string;
  keyEmotions: { emotion: string; description: string; promptSnippet: string }[];
  signatureProps: string[];
  voiceProfile: {
    gender: 'masculino' | 'femenino' | 'niño' | 'anciano';
    tone: string;
    pace: string;
    elevenLabsPreset: string;
    geminiVoiceName?: string;
    stability?: number;
    clarity?: number;
    pitchFactor?: number;
    speedRate?: number;
  };
  bibleReferenceQuote: string;
}

export interface SeriesEnvironment {
  id: string;
  name: string;
  shortTag: string;
  category: string;
  timeOfDay: string;
  lightingSetup: string;
  architecturePromptEn: string;
  propsAndAtmosphere: string;
  negativePromptEn: string;
  previewEmoji: string;
}

export interface DialogueTurn {
  speakerName: string;
  speakerId: string;
  dialogueSpanish: string;
  emotionalTone: string;
  voicePresetName?: string;
}

export interface MiniserieEpisodeScene {
  sceneNumber: number;
  durationSec: number;
  characterId: string;
  secondaryCharacterId?: string;
  charactersInShot: string[];
  interactionType: 'dos_personajes_frente_a_frente' | 'abrazo_consuelo' | 'encuentro_con_jesus' | 'plano_conjunto_familiar' | 'reaccion_asombro' | 'confrontacion_redencion';
  timeframe: string;
  action: string;
  dialogueExchange?: DialogueTurn[];
  narration: string;
  onScreenText: string;
  secondaryLabel?: string;
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
    atSecond: string; // e.g. "00:00 - 00:02"
    sound: string;    // e.g. "Golpe sordo de angustia y trueno lejano (-6dB)"
    purpose: string;  // e.g. "Corte de retención inicial"
  }[];
  bgMusicMood: string;
  imageUrl?: string;
}

export interface EpisodeSEO {
  youtubeTitle: string;
  facebookTitle: string;
  tiktokTitle?: string;
  caption: string;
  hashtags: string[];
  pinnedComment: string;
  seoKeywords?: string[];
  searchQueries?: string[];
  thumbnailHook?: string;
  suggestedAudio?: string;
}

export interface ScenographyDirection {
  scriptAnalysis: {
    location: string;
    historicalEra: string;
    whoInhabits: string;
    currentSituation: string;
    conveyedEmotion: string;
    keyNarrativeObjects: string[];
    evolutionThroughSeries: string;
  };
  directorsVision: {
    tone: string;
    animationStyle: string;
    atmosphere: string;
  };
  visualIdentity: {
    dominantColors: string[];
    furnitureTypes: string;
    materialsAndTextures: string;
    lightingDesign: string;
    recurringProps: string[];
  };
  characterPersonalSpaces: {
    characterName: string;
    environmentConnection: string;
  }[];
  narrativeObjects: {
    objectName: string;
    symbolism: string;
    narrativeRole: string;
  }[];
  scenographyEvolutionByEpisode: {
    episodeNumber: number;
    stageName: string;
    environmentState: string;
    lightingState: string;
    objectsState: string;
  }[];
  departmentCoordination: {
    wardrobeHarmony: string;
    lightingAndColorPalette: string;
    cameraAndAtmosphere: string;
    soundDesignSync: string;
  };
}

export interface MiniserieEpisode {
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
  scenes: MiniserieEpisodeScene[];
  socialPackage: EpisodeSEO;
}

export interface MiniserieTemplate {
  id: string;
  seriesTitle: string;
  logline: string;
  category: 'milagro_familiar' | 'prueba_fe' | 'historia_biblica' | 'sanidad_imposible' | 'misterio_3am';
  categoryLabel: string;
  totalPartsPlanned: number;
  bannerHook: string;
  primaryCharacterIds: string[];
  lockedEnvironmentId?: string;
  lockedEnvironmentName?: string;
  lockedEnvironmentPromptEn?: string;
  scenographyDirection?: ScenographyDirection;
  episodes: MiniserieEpisode[];
}

export const CARTOON_CHARACTERS_FE: CartoonCharacter[] = [
  {
    id: 'jesus_cartoon_3d',
    name: 'Maestro Jesús',
    subtitle: 'El Salvador y Guía Misericordioso',
    age: '33 años',
    role: 'Protagonista Divino / Salvador',
    archetype: 'El Maestro Amoroso y Protector',
    shortDescription: 'Diseño de personaje animado 3D estilo Pixar/DreamWorks: mirada compasiva con ojos avellana brillantes, cabello ondulado castaño, sonrisa cálida y presencia de paz sobrenatural que reconforta al instante.',
    avatarEmoji: '✨',
    themeColor: '#f59e0b',
    accentGradient: 'from-amber-400 via-yellow-500 to-amber-600',
    fallbackImage: '/sacred-assets/jesus-blessing.jpg',
    fixedIdentityPrompt: 'Personaje animado 3D estilo Pixar y Disney moderno de alta gama: Jesús de Nazaret, 33 años, rostro bondadoso y radiante con grandes ojos avellana expresivos llenos de compasión, cabello castaño ondulado suave a los hombros, barba corta prolija y recortada. Viste túnica de lino blanco crudo con bordados suaves en el cuello y manto azul cielo brillante sobre el hombro. Piel cálida del Medio Oriente, iluminación volumétrica dorada de estudio 3D, renderizado Octane 8K, texturas suaves y amigables. Sin deformaciones, consistencia exacta de rostro.',
    fixedIdentityPromptEn: 'High-end 3D animated character in modern Pixar and Disney style: Jesus Christ, 33 years old, deeply kind and loving radiant face with large expressive hazel eyes glowing with compassion, wavy shoulder-length soft brown hair, neatly groomed short beard. Wearing off-white linen tunic with subtle embroidered trim and sky-blue woven shawl draped over shoulder. Warm Middle Eastern skin tone, golden hour studio lighting, 8K Octane render, smooth stylized textures. Exact facial consistency for animation.',
    clothingStyle: 'Túnica de lino blanco marfil con bordes hebreos bordados, manto azul cielo celeste, sandalias de cuero artesanal.',
    lockedWardrobeDesc: 'Túnica de lino blanco crudo con manto azul cielo sobre el hombro izquierdo, cabello castaño ondulado y barba corta prolija (Inmutable en todos los planos).',
    exactModelSheetLockEn: 'LOCKED CHARACTER DNA: Jesus Christ, 33yo, deeply kind noble face with large expressive radiant hazel eyes, soft wavy shoulder-length brown hair, trimmed neat short beard. Wearing off-white linen tunic with subtle embroidery and sky-blue woven sash draped over left shoulder. Warm golden volumetric divine aura. EXACT SAME FACE, HAIR AND ROBE IN EVERY SHOT.',
    keyEmotions: [
      { emotion: 'Compasión y Consuelo', description: 'Mirada tierna inclinando suavemente la cabeza hacia adelante', promptSnippet: 'warm compassionate gaze, tender gentle smile, extending hand forward with divine grace' },
      { emotion: 'Oración Ferviente', description: 'Manos juntas, ojos cerrados en comunión íntima con el Padre', promptSnippet: 'eyes closed in deep prayer, hands gently clasped, soft heavenly golden glow on face' },
      { emotion: 'Poder y Autoridad de Paz', description: 'Mano alzada calmando la tormenta o reprendiendo el temor', promptSnippet: 'commanding calm expression, right hand raised radiating peaceful light, hair softly moved by breeze' }
    ],
    signatureProps: ['Manto azul cielo de lino', 'Pan recién partido con destello dorado', 'Pergamino de gracia'],
    voiceProfile: {
      gender: 'masculino',
      tone: 'Voz profunda, cálida, de calma infinita y autoridad amorosa (33-35 años, barítono reverente, acento neutro).',
      pace: 'Pausada, reverente, de 2.0 palabras por segundo con silencios reconfortantes.',
      elevenLabsPreset: 'Deep Warm Compassionate Male - Jesus',
      geminiVoiceName: 'Puck',
      stability: 0.88,
      clarity: 0.95,
      pitchFactor: 0.88,
      speedRate: 0.88
    },
    bibleReferenceQuote: '"La paz os dejo, mi paz os doy; yo no os la doy como el mundo la da." — Juan 14:27'
  },
  {
    id: 'mateo_nino_fe',
    name: 'Mateo (Niño de Fe)',
    subtitle: 'El Pequeño Intercesor Inocente',
    age: '8 años',
    role: 'Protagonista Infantil / El Corazón Puro',
    archetype: 'El Inocente de Fe Inquebrantable',
    shortDescription: 'Niño animado 3D de 8 años con ojos oscuros vivaces y grandes, cabello castaño rebelde, suéter tejido azul noche y una sonrisa luminosa que conmueve a las abuelas y madres de Facebook y YouTube.',
    avatarEmoji: '👦',
    themeColor: '#38bdf8',
    accentGradient: 'from-sky-400 via-blue-500 to-indigo-600',
    fallbackImage: '/sacred-assets/heavenly-dove.jpg',
    fixedIdentityPrompt: 'Personaje animado 3D estilo Pixar: Mateo, niño latino de 8 años con cabello castaño desordenado y travieso, grandes ojos cafés expresivos y brillantes de asombro infantil, pecas suaves en la nariz. Viste una sudadera con capucha azul marino desgastada con coderas y pantalones de mezclilla. Expresión tierna y pura, renderizado 3D de alta gama con iluminación cálida.',
    fixedIdentityPromptEn: 'Pixar-style 3D animated character: Mateo, an 8-year-old Latino boy with messy fluffy brown hair, large expressive deep-brown eyes full of innocent wonder, soft freckles on nose. Wearing a cozy slightly oversized navy-blue hoodie and jeans. Emotional tender facial expressions, premium 3D cartoon render, warm volumetric rim lighting. Consistent face and body proportions.',
    clothingStyle: 'Sudadera azul noche con capucha, camiseta blanca debajo, jeans gastados y tenis rojos tipo lona.',
    lockedWardrobeDesc: 'Sudadera azul marino con capucha, cabello castaño revuelto y tenis rojos (Inmutable en todos los planos).',
    exactModelSheetLockEn: 'LOCKED CHARACTER DNA: Mateo, 8yo boy, messy fluffy brown hair, expressive dark-brown eyes, soft freckles. Wearing oversized navy-blue hoodie with elbow patches and denim jeans. EXACT SAME CLOTHES AND HAIRSTYLE IN ALL CUTS.',
    keyEmotions: [
      { emotion: 'Asombro Inocente', description: 'Boca entreabierta y ojos gigantes mirando un milagro', promptSnippet: 'eyes wide with innocent awe, jaw slightly dropped in wonder, hands pressed against chest' },
      { emotion: 'Lágrimas de Empatía', description: 'Ojitos húmedos abrazando a su abuela o madre', promptSnippet: 'glistening tear in eye, deeply empathetic gentle expression, reaching out to hug' },
      { emotion: 'Alegría Jubilosa', description: 'Sonrisa de oreja a oreja saltando de emoción', promptSnippet: 'radiant cheerful smile, jumping with joy, sparkling animated eyes' }
    ],
    signatureProps: ['Oveja de peluche de lana blanca', 'Biblia infantil con cinta roja', 'Farolito de hojalata'],
    voiceProfile: {
      gender: 'niño',
      tone: 'Voz infantil dulce, transparente, de 8 años con ternura conmovedora.',
      pace: 'Natural, emotiva, con preguntas llenas de asombro y fe.',
      elevenLabsPreset: 'Young Tender Boy - Innocent Faith',
      geminiVoiceName: 'Zephyr',
      stability: 0.78,
      clarity: 0.90,
      pitchFactor: 1.25,
      speedRate: 1.02
    },
    bibleReferenceQuote: '"Dejad a los niños venir a mí, y no se lo impidáis; porque de los tales es el reino de los cielos." — Mateo 19:14'
  },
  {
    id: 'abuelita_esperanza',
    name: 'Abuelita Esperanza',
    subtitle: 'La Guerrera de Oración de la Madrugada',
    age: '72 años',
    role: 'Pilar Familiar / Intercesora Nocturna',
    archetype: 'La Abuela Protectora y Sabia',
    shortDescription: 'Abuelita de 72 años estilo animación 3D: moño de cabello plateado pulcro, gafas doradas de montura redonda, chal lila tejido a mano y manos arrugadas que sostienen una vieja Biblia gastada.',
    avatarEmoji: '👵',
    themeColor: '#c084fc',
    accentGradient: 'from-purple-400 via-fuchsia-500 to-rose-500',
    fallbackImage: '/sacred-assets/jesus-shepherd.jpg',
    fixedIdentityPrompt: 'Personaje animado 3D estilo Pixar: Abuelita Esperanza, entrañable mujer hispana de 72 años, rostro bondadoso con suaves arrugas de sonrisa alrededor de ojos marrones tiernos y sabios, cabello blanco plateado recogido en un moño elegante. Usa gafas redondas con montura delgada dorada, un chal de lana color lavanda sobre un vestido floral modesto. Expresión de devoción serena y amor incondicional, renderizado 3D de alta gama.',
    fixedIdentityPromptEn: 'Pixar-style 3D animated character: Grandma Esperanza, a 72-year-old beloved grandmother, warm wrinkled kind face with gentle smiling eyes behind delicate round golden reading glasses, silvery-white hair tied in a neat bun. Wearing a cozy hand-knitted lavender wool shawl over a simple modest floral dress. Deep serene prayerful expression, warm interior kitchen lighting, 8K animated render.',
    clothingStyle: 'Vestido floral modesto azul marino, chal tejido color lavanda suave, gafas doradas de lectura.',
    lockedWardrobeDesc: 'Vestido floral modesto, chal tejido color lavanda y gafas doradas redondas con moño blanco plateado (Inmutable en todos los planos).',
    exactModelSheetLockEn: 'LOCKED CHARACTER DNA: Grandma Esperanza, 72yo, kind wrinkled face, round golden reading glasses, silvery-white hair in tidy bun. Wearing hand-knitted lavender shawl over navy floral dress. EXACT SAME ATTIRE, GLASSES AND HAIR IN ALL SHOTS.',
    keyEmotions: [
      { emotion: 'Oración Secreta de Madrugada', description: 'Ojos cerrados sosteniendo la Biblia con reverencia y lágrimas', promptSnippet: 'eyes closed in tearful midnight intercession, clutching old worn leather Bible to heart' },
      { emotion: 'Alivio y Paz Sobrenatural', description: 'Suspiro de gratitud mirando hacia el cielo con una sonrisa leve', promptSnippet: 'deep sigh of holy relief, gentle smiling lips, looking upwards with glowing peaceful face' },
      { emotion: 'Amor Maternal a su Nieto', description: 'Acariciando la cabeza de Mateo con dulzura infinita', promptSnippet: 'tenderly stroking young boy hair, warm grandmotherly affection, glowing warm amber light' }
    ],
    signatureProps: ['Biblia antigua de cuero con marcas amarillas', 'Vela de cera ámbar', 'Taza de té de manzanilla humeante'],
    voiceProfile: {
      gender: 'anciano',
      tone: 'Voz madura, suave, cálida, maternal, llena de paz y experiencia de vida (acento de abuela hispana).',
      pace: 'Pausada, íntima, susurrada en los momentos de oración.',
      elevenLabsPreset: 'Warm Elderly Matriarch - Grandma Prayer',
      geminiVoiceName: 'Aoede',
      stability: 0.85,
      clarity: 0.92,
      pitchFactor: 0.92,
      speedRate: 0.85
    },
    bibleReferenceQuote: '"No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios que te esfuerzo." — Isaías 41:10'
  },
  {
    id: 'sara_madre_fe',
    name: 'Sara (Madre Luchadora)',
    subtitle: 'La Fe en Medio de la Dificultad',
    age: '29 años',
    role: 'Madre Joven / Superación & Fortaleza',
    archetype: 'La Madre Valiente que no se Rinde',
    shortDescription: 'Madre joven de 29 años estilo animación 3D: mirada decidida pero vulnerable, cabello castaño recogido en un moño bajo con mechones suaves, blusa sencilla azul cielo con delantal beige rústico.',
    avatarEmoji: '👩',
    themeColor: '#ec4899',
    accentGradient: 'from-pink-500 via-rose-500 to-amber-500',
    fallbackImage: '/sacred-assets/cross-sunrise.jpg',
    fixedIdentityPrompt: 'Personaje animado 3D estilo Pixar: Sara, madre joven de 29 años, hermosa y trabajadora con cabello castaño recogido en un moño bajo elegante con mechones sueltos a los lados, ojos almendrados color miel llenos de emoción y valentía. Viste vestido modesto de algodón azul claro cubierto por un delantal rústico beige de cocina. Rostro expresivo que combina angustia materna y fe inquebrantable.',
    fixedIdentityPromptEn: 'Pixar-style 3D animated character: Sara, a 29-year-old hardworking mother, dark brown hair gathered in a neat low bun with soft loose side tendrils, expressive almond honey-brown eyes, tear tracks glistening on cheeks. Wearing a modest light-blue cotton dress covered by a rustic coarse beige kitchen apron. Exact facial bone structure and wardrobe consistency.',
    clothingStyle: 'Vestido modesto de algodón azul claro, delantal rústico beige de cocina y cabello en moño bajo con mechones sueltos.',
    lockedWardrobeDesc: 'Vestido modesto azul claro, delantal de cocina beige rústico y cabello en moño bajo con mechones laterales (Inmutable en todos los planos).',
    exactModelSheetLockEn: 'LOCKED CHARACTER DNA: Sara, 29-year-old Latina woman, brown hair styled in a tidy low bun with soft side tendrils, expressive almond honey-brown eyes, teardrop glistening on cheek, wearing the EXACT SAME modest pale-blue linen dress and coarse beige kitchen apron in every shot. NO OUTFIT OR HAIRSTYLE MUTATION.',
    keyEmotions: [
      { emotion: 'Angustia y Desahogo', description: 'Mano en el pecho mientras mira las cuentas o la alacena vacía', promptSnippet: 'hand clutched to chest, tearful vulnerable look of financial struggle, whispering a prayer' },
      { emotion: 'Abrazo de Protección', description: 'Envolviendo a sus pequeños con sus brazos como escudo', promptSnippet: 'protective embrace holding children close, fierce determined motherly gaze' }
    ],
    signatureProps: ['Hojalata con las últimas monedas', 'Delantal de lino', 'Carta de la escuela de sus hijos'],
    voiceProfile: {
      gender: 'femenino',
      tone: 'Voz femenina joven, emotiva, con matices de quiebre y recuperación valiente.',
      pace: 'Dinámica, con pausas de ahogo emocional y suspiros de fe.',
      elevenLabsPreset: 'Young Mother Resilient - Sara',
      geminiVoiceName: 'Kore',
      stability: 0.78,
      clarity: 0.92,
      pitchFactor: 1.05,
      speedRate: 0.94
    },
    bibleReferenceQuote: '"Jehová es mi fortaleza y mi cántico, y ha sido mi salvación." — Éxodo 15:2'
  },
  {
    id: 'marcus_centurion',
    name: 'Centurión Marcus',
    subtitle: 'El Guerrero de Corazón Quebrantado',
    age: '38 años',
    role: 'Antagonista Redimido / De la Dureza a la Gracia',
    archetype: 'El Conquistador que Encuentra al Rey Verdadero',
    shortDescription: 'Soldado romano imponente de 38 años estilo animación 3D: coraza de bronce con relieves, capa roja carmesí, mandíbula cuadrada severa que se quiebra en llanto ante el amor y la sanidad de su hija.',
    avatarEmoji: '🛡️',
    themeColor: '#ef4444',
    accentGradient: 'from-red-600 via-amber-600 to-slate-800',
    fallbackImage: '/sacred-assets/jesus-resurrected.jpg',
    fixedIdentityPrompt: 'Personaje animado 3D estilo Pixar: Centurión Marcus, militar romano de 38 años, contextura atlética e imponente, mandíbula cuadrada y cicatriz leve en la ceja izquierda, cabello corto oscuro militar. Viste armadura romana clásica con peto de bronce pulido con grabados de águila, túnica roja carmesí y capa larga. Expresión dura y disciplined que se transforma en asombro y redención con lágrimas.',
    fixedIdentityPromptEn: 'Pixar-style 3D animated character: Centurion Marcus, a 38-year-old imposing Roman officer, square strong jaw with subtle scar on brow, short cropped dark hair. Wearing stylized polished bronze muscle cuirass with eagle engraving, crimson red cape and leather pteruges armor. Hard disciplined expression turning into deep emotional brokenness and wonder, dramatic cinematic rim lighting.',
    clothingStyle: 'Armadura romana de bronce dorado con peto esculpido, capa roja carmesí sujeta con broches de león, faldón de tiras de cuero.',
    lockedWardrobeDesc: 'Coraza de bronce romano esculpido con águila, capa roja carmesí y túnica militar (Inmutable en todos los planos).',
    exactModelSheetLockEn: 'LOCKED CHARACTER DNA: Centurion Marcus, 38yo, square jaw, scarred left brow, cropped black military hair. Wearing polished bronze muscle cuirass, crimson wool cape with brass lion clasp, leather pteruges armor. EXACT SAME ARMOR AND HAIRCUT IN ALL SCENES.',
    keyEmotions: [
      { emotion: 'Autoridad Implacable', description: 'Mirada severa con la mano sobre la empuñadura de la espada', promptSnippet: 'severe commanding posture, hand resting on gladius sword hilt, sharp disciplined eyes' },
      { emotion: 'Espada Caída y Rendición', description: 'De rodillas en el polvo, ojos llorosos ante el Maestro', promptSnippet: 'dropping sword to the dust, kneeling in complete surrender, tears streaming down warrior face' }
    ],
    signatureProps: ['Gladius de bronce romano pulido', 'Capa carmesí de oficial', 'Sello imperial de cera'],
    voiceProfile: {
      gender: 'masculino',
      tone: 'Voz grave, marcial, imponente de mando militar que se quiebra en un susurro conmovido.',
      pace: 'Firme, autoritaria al inicio; suave y temblorosa en la rendición.',
      elevenLabsPreset: 'Imposing Warrior Redeemed - Marcus',
      geminiVoiceName: 'Fenrir',
      stability: 0.90,
      clarity: 0.94,
      pitchFactor: 0.82,
      speedRate: 0.90
    },
    bibleReferenceQuote: '"De cierto os digo, que ni aun en Israel he hallado tanta fe." — Mateo 8:10'
  },
  {
    id: 'david_pastor_valiente',
    name: 'David (El Pastor Valiente)',
    subtitle: 'El Vencedor de Gigantes',
    age: '16 años',
    role: 'Héroe Juvenil Bíblico',
    archetype: 'El Campeón de Dios',
    shortDescription: 'Joven pastor de 16 años estilo animación 3D: cabello rojizo rizado, ojos brillantes sin miedo, túnica de lana sencilla con zurrón y honda de cuero, enfrentando gigantes con la fe en su Creador.',
    avatarEmoji: '🪨',
    themeColor: '#10b981',
    accentGradient: 'from-emerald-500 via-teal-500 to-amber-500',
    fallbackImage: '/sacred-assets/jesus-teaching.jpg',
    fixedIdentityPrompt: 'Personaje animado 3D estilo Pixar: David adolescente de 16 años, rostro pecoso lleno de coraje y fe radiante, cabello rizado castaño cobrizo revuelto por el viento, ojos verdes decididos. Viste túnica modesta de pastor en lana cruda sujeta con cinturón de cuero, zurrón de pastor al hombro y una honda de cuero en la mano derecha. Postura heroica pero humilde.',
    fixedIdentityPromptEn: 'Pixar-style 3D animated character: Young teenage David (16yo), courageous freckled face, messy reddish-brown curly hair blowing in the wind, determined emerald green eyes. Wearing rustic shepherd tunic of off-white wool with leather belt, leather satchel strap across chest, holding a simple leather sling in hand. Humble yet fearless heroic posture, golden daylight valley render.',
    clothingStyle: 'Túnica de lana beige crudo, cinturón de cuero rústico, zurrón de pastor de cuero curtido y sandalias sencillas.',
    lockedWardrobeDesc: 'Túnica de pastor en lana beige crudo, zurrón de cuero al hombro y cabello rojizo rizado al viento (Inmutable en todos los planos).',
    exactModelSheetLockEn: 'LOCKED CHARACTER DNA: Young David, 16yo, messy reddish-brown curly hair, emerald eyes, freckles. Wearing off-white raw wool tunic, leather belt and cross-body leather satchel. Holding leather sling. EXACT SAME CLOTHING AND WEAPON PROPS IN ALL SHOTS.',
    keyEmotions: [
      { emotion: 'Valentía Serena', description: 'Mirando hacia arriba al coloso sin pestañear con sonrisa de fe', promptSnippet: 'calm fearless smile looking up at giant shadow, clutching smooth stone with unwavering confidence' },
      { emotion: 'Adoración con Arpa', description: 'Tocando el arpa en la colina bajo las estrellas', promptSnippet: 'playing small wooden harp, eyes closed in heartfelt worship, starry night sky background' }
    ],
    signatureProps: ['Honda de cuero de pastor', '5 piedras lisas de río', 'Arpa pequeña de madera de olivo'],
    voiceProfile: {
      gender: 'masculino',
      tone: 'Voz juvenil, clara, firme, sin arrogancia pero con autoridad divina.',
      pace: 'Ágil, enérgica, proclamando con valentía la palabra de Dios.',
      elevenLabsPreset: 'Young Courageous Hero - David',
      geminiVoiceName: 'Charon',
      stability: 0.82,
      clarity: 0.92,
      pitchFactor: 1.10,
      speedRate: 1.00
    },
    bibleReferenceQuote: '"Tú vienes a mí con espada y lanza y jabalina; mas yo vengo a ti en el nombre de Jehová de los ejércitos." — 1 Samuel 17:45'
  }
];

export const SERIES_ENVIRONMENTS_FE: SeriesEnvironment[] = [
  {
    id: 'cocina_madrugada_azulejos',
    name: 'Cocina Rústica con Azulejos y Candil (Madrugada 3:00 AM)',
    shortTag: 'Cocina Azulejos 3:00 AM',
    category: 'Hogar & Madrugada',
    timeOfDay: '3:00 AM - Noche profunda',
    lightingSetup: 'Warm amber glow from clay oil lamp and wax candles, volumetric soft amber shadows, cold dark midnight exterior visible through rustic window glass',
    architecturePromptEn: 'Interior of a modest rustic kitchen, traditional handcrafted glazed ceramic tiles with subtle blue and terracotta floral patterns along the wall backsplash, weathered dark wooden dining table with rustic grain, open wooden shelves with clay pots and ceramic dishes, stone floor, warm hearth in the background. EXACT SAME ROOM, ARCHITECTURE, TILE PATTERNS AND CAMERA SPACE ACROSS ALL SHOTS.',
    propsAndAtmosphere: 'Worn leather-bound Bible on the table, steaming mug of herbal tea, small flickering flame, rustic linen apron hanging, emotional quiet intimacy',
    negativePromptEn: 'no outdoor background, no sunny daylight, no change of room, no modern shiny stainless steel appliances, no open grass fields, no shifting furniture',
    previewEmoji: '🏮'
  },
  {
    id: 'habitacion_oracion_humilde',
    name: 'Habitación Humilde de Oración y Vigilia Nocturna',
    shortTag: 'Habitación de Oración',
    category: 'Intercesión & Silencio',
    timeOfDay: 'Madrugada 3:30 AM',
    lightingSetup: 'Single warm bedside lantern, moonlight beam slicing through wooden lattice shutters onto the floor',
    architecturePromptEn: 'Modest quiet bedroom with rustic whitewashed textured plaster walls, simple wooden floorboards, rustic wooden bed frame with patchwork cotton quilt, wooden prayer stool in corner. EXACT SAME ROOM AND PROPS IN ALL ANGLES.',
    propsAndAtmosphere: 'Tears glistening, open Bible on prayer stool, soft heavenly blue-and-gold ambient glow entering room',
    negativePromptEn: 'no outdoor daylight, no modern luxury decor, no change of wallpaper, no sudden daylight',
    previewEmoji: '🕯️'
  },
  {
    id: 'colina_getsemani_atardecer',
    name: 'Colina de Olivos al Atardecer Dorado (Getsemaní)',
    shortTag: 'Colina de Getsemaní',
    category: 'Naturaleza Bíblica & Trascendencia',
    timeOfDay: 'Hora Dorada / Atardecer Bíblico',
    lightingSetup: 'Low golden sun setting behind distant mountains, deep orange and amber volumetric god-rays piercing through olive branches',
    architecturePromptEn: 'Galilean olive hillside landscape, ancient gnarled olive tree trunks with silver-green leaves, dusty limestone path, warm golden dust particles floating in the breeze. EXACT SAME HILLSIDE ANGLE AND LIGHTING DIRECTION.',
    propsAndAtmosphere: 'Warm breeze moving garments, sacred peaceful silence, ancient stone wall',
    negativePromptEn: 'no modern roads, no telephone poles, no gloomy dark rain, no modern buildings',
    previewEmoji: '🌅'
  },
  {
    id: 'sala_espera_hospital_noche',
    name: 'Sala de Hospital / Espera a Medianoche',
    shortTag: 'Hospital Medianoche',
    category: 'Sanidad & Prueba Médica',
    timeOfDay: '02:00 AM - Medianoche',
    lightingSetup: 'Warm cinematic stylized interior lighting, wall clock hands frozen at 2:00 AM, gentle golden glow descending from ceiling',
    architecturePromptEn: 'Warmly stylized hospital recovery or waiting room, soft teal and beige walls, wooden armchairs, glass window reflecting nighttime rain, warm bedside monitor. EXACT SAME HOSPITAL ROOM IN EVERY SHOT.',
    propsAndAtmosphere: 'Medical report folder on table, paper cup, miracle light entering the doorway',
    negativePromptEn: 'no harsh cold fluorescent flicker, no outdoor garden, no sudden daytime sunshine',
    previewEmoji: '🏥'
  },
  {
    id: 'portico_romano_guardia',
    name: 'Pórtico Romano de Piedra y Antorchas',
    shortTag: 'Pórtico Romano',
    category: 'Autoridad & Redención',
    timeOfDay: 'Noche cerrada con antorchas',
    lightingSetup: 'Dramatic chiaroscuro firelight from iron wall torches, dancing amber highlights on bronze armor and limestone pillars',
    architecturePromptEn: 'Ancient Roman villa entrance with massive carved limestone pillars, stone paved terrace overlooking the dark Sea of Galilee, heavy cedarwood door with iron studs. EXACT SAME ARCHITECTURAL PROPORTIONS AND TORCH LOCATIONS.',
    propsAndAtmosphere: 'Flickering wall torches, Roman bronze standard, discarded gladius on stone floor',
    negativePromptEn: 'no modern asphalt, no cars, no casual indoor furniture, no shifting pillars',
    previewEmoji: '🏛️'
  }
];

export const MINISERIES_TEMPLATES_FE: MiniserieTemplate[] = [
  {
    id: 'miniserie_lagrima_3am',
    seriesTitle: 'El Secreto de las 3:00 AM',
    logline: 'Una abuelita ora en silencio por un diagnóstico terminal sin saber que su nieto y un visitante celestial están a punto de cambiar la historia.',
    category: 'misterio_3am',
    categoryLabel: 'Misterio & Milagro en la Madrugada',
    totalPartsPlanned: 3,
    bannerHook: '🔴 LO QUE OCURRIÓ EN ESTA COCINA A LAS 3:00 AM • PARTE 1',
    primaryCharacterIds: ['abuelita_esperanza', 'mateo_nino_fe', 'jesus_cartoon_3d'],
    episodes: [
      {
        episodeNumber: 1,
        episodeTitle: 'Parte 1: El Llanto en la Oscuridad',
        hook: 'Eran exactamente las 3:15 de la madrugada cuando Mateo despertó por un susurro que venía de la cocina. Lo que vio bajo la luz tenue de la vela lo dejó helado.',
        conflict: 'Abuelita Esperanza sostiene un sobre médico con lágrimas en los ojos, rogándole a Dios que no deje a Mateo desamparado.',
        escalation: 'El reloj marca las 3:17 AM. De repente, la vela parpadea tres veces y una sombra tibia entra por la ventana cerrada.',
        cliffhanger: 'Cuando Mateo dio un paso para abrazarla, una mano luminosa se posó sobre el hombro de la abuelita. Pero no era ningún familiar... ¿Quién era el visitante de las 3 AM? Toca el botón de Seguir para ver la PARTE 2 mañana.',
        scenes: [
          {
            sceneNumber: 1,
            durationSec: 10,
            characterId: 'mateo_nino_fe',
            secondaryCharacterId: 'abuelita_esperanza',
            charactersInShot: ['mateo_nino_fe', 'abuelita_esperanza'],
            interactionType: 'dos_personajes_frente_a_frente',
            timeframe: '00:00 - 00:10',
            action: 'Mateo en pijama camina descalzo por el pasillo oscuro y observa desde el marco de la puerta a su abuelita llorando en la mesa con una vela; ella se seca una lágrima al notar su presencia.',
            dialogueExchange: [
              {
                speakerName: 'Mateo',
                speakerId: 'mateo_nino_fe',
                dialogueSpanish: '¿Abuelita?... ¿Por qué lloras a oscuras tan tarde?',
                emotionalTone: 'Susurro inocente lleno de ternura y preocupación infantil'
              },
              {
                speakerName: 'Abuelita Esperanza',
                speakerId: 'abuelita_esperanza',
                dialogueSpanish: 'Ven, mi niño... No te asustes, solo estoy hablando con Dios.',
                emotionalTone: 'Voz temblorosa pero reconfortante intentando disimular el dolor'
              }
            ],
            narration: 'Eran las 3:15 de la madrugada, [PAUSA] cuando un susurro quebrado rompió el silencio de la casa.',
            onScreenText: '3:15 AM · El Llanto Oculto',
            secondaryLabel: '🔴 NO PASES ESTE RELATO',
            imageToVideoPrompt: 'Clip cinemático de 10 segundos en formato vertical 9:16 estilo animación Pixar 3D: en primer plano Mateo (8 años, pijama azul) asomado a la puerta y al fondo la abuelita Esperanza sentada a la mesa rústica con una vela encendida. Diálogo fluido en español latino: [00:00-00:05] Mateo susurra: "¿Abuelita?... ¿Por qué lloras a oscuras tan tarde?". [00:05-00:09] Abuelita responde tiernamente: "Ven, mi niño... No te asustes, solo estoy hablando con Dios". [00:09-00:10] Mateo camina hacia ella. Iluminación cálida de vela, sombras nocturnas y sincronización labial fluida para audio en español.',
            englishPromptWithSpanishDialogue: '10-second continuous cinematic video clip in vertical 9:16 (Pixar 3D animated style). Slow fluid pacing calibrated for 10 seconds with natural back-and-forth character dialogue in Latin American Spanish: [00:00-00:05] In the foreground doorway, 8yo boy Mateo in cozy navy pajamas steps forward with wide worried eyes and whispers: "¿Abuelita?... ¿Por qué lloras a oscuras tan tarde?". [00:05-00:09] At the candlelit wooden table in background, grandmother Esperanza wipes a tear with her lavender knit shawl, turning with maternal love to reply: "Ven, mi niño... No te asustes, solo estoy hablando con Dios". [00:09-00:10] Mateo steps into the kitchen as amber candlelight catches his face. Expressive lip-sync for 10s Spanish audio, soft camera push-in, 8K Octane render.',
            sfx: 'Tic tac de reloj antiguo resonando, crujido sutil de madera en el piso (4s), suspiro reconfortante (-10dB)',
            bgMusicMood: 'Suspenso cinematográfico íntimo con violonchelo melancólico y piano suave (-22dB)'
          },
          {
            sceneNumber: 2,
            durationSec: 10,
            characterId: 'abuelita_esperanza',
            secondaryCharacterId: 'mateo_nino_fe',
            charactersInShot: ['abuelita_esperanza', 'mateo_nino_fe'],
            interactionType: 'abrazo_consuelo',
            timeframe: '00:10 - 00:20',
            action: 'Mateo llega a la mesa y abraza a la abuelita por el cuello; ella esconde apresurada el sobre médico mientras le acaricia la cabeza con ternura y dolor contenido.',
            dialogueExchange: [
              {
                speakerName: 'Abuelita Esperanza',
                speakerId: 'abuelita_esperanza',
                dialogueSpanish: 'Nada, mi niño hermoso... Solo estaba dándole gracias a Dios por tenerte.',
                emotionalTone: 'Voz quebrada por el amor disimulando su llanto'
              },
              {
                speakerName: 'Mateo',
                speakerId: 'mateo_nino_fe',
                dialogueSpanish: 'Mentira, abuelita. Tienes ese sobre blanco del hospital y sé que estás enferma.',
                emotionalTone: 'Mirada fija a sus ojos con sinceridad inocente y lágrimas incipientes'
              }
            ],
            narration: 'La abuelita intentó secarse las lágrimas, [PAUSA] pero los niños tienen ojos que ven directo al corazón.',
            onScreenText: 'El Sobre del Hospital',
            secondaryLabel: 'El Secreto de la Abuela',
            imageToVideoPrompt: 'Clip cinemático de 10 segundos en vertical 9:16 de interacción profunda: Mateo abraza el cuello de su abuelita Esperanza mientras ella intenta ocultar con dedos arrugados el sobre médico doblado. Diálogo fluido en español: [00:00-00:04] Abuelita: "Nada, mi niño hermoso... Solo estaba dándole gracias a Dios por tenerte". [00:05-00:09] Mateo responde con mirada triste: "Mentira, abuelita. Tienes ese sobre blanco del hospital y sé que estás enferma". [00:09-00:10] La abuela lo estrecha contra su pecho. Renderizado 3D de alta gama con iluminación suave.',
            englishPromptWithSpanishDialogue: '10-second continuous cinematic video clip in vertical 9:16 (Pixar 3D animation). Intimate two-shot: Young boy Mateo wrapping his arms around the neck of grandmother Esperanza as she tries to hide an official white hospital envelope with trembling wrinkled hands. Fluid dialogue in Latin American Spanish: [00:00-00:04] Grandmother speaks with trembling affection: "Nada, mi niño hermoso... Solo estaba dándole gracias a Dios por tenerte". [00:05-00:09] Mateo pulls back slightly, looking into her eyes: "Mentira, abuelita. Tienes ese sobre blanco del hospital y sé que estás enferma". [00:09-00:10] Grandmother pulls him closer, resting her cheek on his hair with tears glistening. Realistic 10s lip-sync, gentle handheld camera drift.',
            sfx: 'Suspiro maternal entrecortado, roce de tela suave del chal de lana, sollozo amortiguado (-10dB)',
            bgMusicMood: 'Acorde de piano emotivo y nostálgico que crece con ternura pastoral (-20dB)'
          },
          {
            sceneNumber: 3,
            durationSec: 10,
            characterId: 'abuelita_esperanza',
            secondaryCharacterId: 'mateo_nino_fe',
            charactersInShot: ['abuelita_esperanza', 'mateo_nino_fe'],
            interactionType: 'plano_conjunto_familiar',
            timeframe: '00:20 - 00:30',
            action: 'Abuelita y nieto abren juntos la vieja Biblia sobre la mesa; Mateo pone sus manitas sobre las manos arrugadas de su abuela encima del Salmo 91 y ambos comienzan a orar.',
            dialogueExchange: [
              {
                speakerName: 'Mateo',
                speakerId: 'mateo_nino_fe',
                dialogueSpanish: 'Vamos a orar juntos, abuelita. La Biblia dice que Dios nunca nos va a dejar solos.',
                emotionalTone: 'Firmeza y fe pura de niño sin una pizca de duda'
              },
              {
                speakerName: 'Abuelita Esperanza',
                speakerId: 'abuelita_esperanza',
                dialogueSpanish: 'Amén, hijito mío... El que habita al abrigo del Altísimo morará bajo su sombra.',
                emotionalTone: 'Devoción quebrada que se enciende de esperanza santa'
              }
            ],
            narration: 'Juntaron sus manos sobre el Salmo 91. [PAUSA] Y en ese instante, el reloj de la pared se detuvo por completo.',
            onScreenText: 'Salmo 91 · El Clamor',
            secondaryLabel: 'La Oración en la Mesa',
            imageToVideoPrompt: 'Clip cinemático de 10 segundos en vertical 9:16: Mateo y la abuelita Esperanza inclinados sobre la Biblia abierta en la mesa rústica con sus manos entrelazadas sobre el Salmo 91. Diálogo fluido en español: [00:00-00:04] Mateo con ojos brillantes: "Vamos a orar juntos, abuelita. La Biblia dice que Dios nunca nos va a dejar solos". [00:05-00:09] Abuelita orando con ojos cerrados: "Amén, hijito mío... El que habita al abrigo del Altísimo morará bajo su sombra". [00:09-00:10] Un haz dorado etéreo empieza a emanar de las páginas bíblicas.',
            englishPromptWithSpanishDialogue: '10-second continuous cinematic shot in vertical 9:16 (Pixar 3D style). Pacing calibrated for 10s: Grandmother Esperanza and boy Mateo joined hands atop an open vintage leather Bible on the rustic kitchen table. Fluid dialogue exchange in Latin American Spanish: [00:00-00:04] Character Mateo proclaims with pure faith: "Vamos a orar juntos, abuelita. La Biblia dice que Dios nunca nos va a dejar solos". [00:05-00:09] Grandmother prays with closed eyes, tears streaming: "Amén, hijito mío... El que habita al abrigo del Altísimo morará bajo su sombra". [00:09-00:10] Bible pages softly illuminate with mystical golden light particles. Paced lip-sync for Spanish audio, warm cinematic tones.',
            sfx: 'Paso de hojas de papel antiguo, murmullo suave de oración al unísono, silencio solemne (-12dB)',
            bgMusicMood: 'Pad de cuerdas celestiales en 432 Hz que infunde reverencia y misterio divino (-18dB)'
          },
          {
            sceneNumber: 4,
            durationSec: 10,
            characterId: 'jesus_cartoon_3d',
            secondaryCharacterId: 'abuelita_esperanza',
            charactersInShot: ['jesus_cartoon_3d', 'abuelita_esperanza', 'mateo_nino_fe'],
            interactionType: 'encuentro_con_jesus',
            timeframe: '00:30 - 00:40',
            action: 'Jesús animado 3D de rostro radiante se materializa junto a ellos con manto azul cielo; posa con infinita ternura su mano sobre el hombro de la abuelita mientras le sonríe con paz a Mateo.',
            dialogueExchange: [
              {
                speakerName: 'Maestro Jesús',
                speakerId: 'jesus_cartoon_3d',
                dialogueSpanish: 'Esperanza, he contado cada una de tus lágrimas en la noche. No temas.',
                emotionalTone: 'Voz divina cálida, reconfortante, de autoridad y paz sobrenatural'
              },
              {
                speakerName: 'Abuelita Esperanza',
                speakerId: 'abuelita_esperanza',
                dialogueSpanish: '¡Señor mío!... ¿De verdad estás aquí en mi humilde cocina?...',
                emotionalTone: 'Susurro reverente de asombro y adoración desbordante'
              }
            ],
            narration: 'Una presencia de gloria llenó la habitación. [PAUSA] El Maestro en persona estaba de pie en esa humilde cocina.',
            onScreenText: 'El Visitante de las 3:00 AM',
            secondaryLabel: 'Jesús se Manifiesta',
            imageToVideoPrompt: 'Clip cinemático de 10 segundos en vertical 9:16 con tres personajes en cuadro: Jesús animado 3D (33 años, túnica de lino blanco y manto azul cielo) de pie entre la abuelita y Mateo. Diálogo fluido en español: [00:00-00:05] Jesús con sonrisa divina y mano en el hombro de la anciana: "Esperanza, he contado cada una de tus lágrimas en la noche. No temas". [00:05-00:09] Abuelita levanta la mirada conmovida: "¡Señor mío!... ¿De verdad estás aquí en mi humilde cocina?...". [00:09-00:10] Mateo sonríe con ojos deslumbrados ante la luz celestial dorada.',
            englishPromptWithSpanishDialogue: '10-second continuous cinematic scene in vertical 9:16 with THREE characters (Pixar 3D style): Jesus Christ (radiant kind hazel eyes, shoulder-length brown wavy hair, white tunic and sky-blue sash) stands majestically between sitting grandmother Esperanza and young boy Mateo. Fluid Spanish dialogue: [00:00-00:05] Jesus places his glowing right hand upon the shoulder of the grandmother and speaks in warm Latin American Spanish: "Esperanza, he contado cada una de tus lágrimas en la noche. No temas". [00:05-00:09] Grandmother looks up with reverent awe: "¡Señor mío!... ¿De verdad estás aquí en mi humilde cocina?...". [00:09-00:10] Jesus turns his smile to Mateo, blessing them with golden volumetric light. Expressive lip-sync calibrated for 10s audio, 8K Octane.',
            sfx: 'Campanada suave de cristal etéreo, brisa tibia de paz celestial, suspiro sagrado (-10dB)',
            bgMusicMood: 'Crescendo cinematográfico de gloria y milagro, cuerdas y coro angelical (-16dB)'
          },
          {
            sceneNumber: 5,
            durationSec: 10,
            characterId: 'mateo_nino_fe',
            secondaryCharacterId: 'jesus_cartoon_3d',
            charactersInShot: ['mateo_nino_fe', 'jesus_cartoon_3d', 'abuelita_esperanza'],
            interactionType: 'reaccion_asombro',
            timeframe: '00:40 - 00:50',
            action: 'Mateo señala la mesa donde el dedo de Jesús toca el sobre médico; las letras negras del diagnóstico impreso se transforman en letras doradas brillantes que borran la enfermedad.',
            dialogueExchange: [
              {
                speakerName: 'Mateo',
                speakerId: 'mateo_nino_fe',
                dialogueSpanish: '¡Abuelita, mira el sobre!... ¡El dedo de Jesús está escribiendo en oro sobre las letras!',
                emotionalTone: 'Grito de asombro absoluto y júbilo infantil'
              },
              {
                speakerName: 'Abuelita Esperanza',
                speakerId: 'abuelita_esperanza',
                dialogueSpanish: '¡Dios mío!... ¡El diagnóstico de muerte se convirtió en vida eterna!',
                emotionalTone: 'Exclamación de fe y lágrimas de agradecimiento'
              }
            ],
            narration: 'Lo que el Maestro escribió en ese sobre médico... [PAUSA] dejó a los doctores sin palabras a la mañana siguiente.',
            onScreenText: 'El Sello de Oro',
            secondaryLabel: 'CONTINÚA EN PARTE 2',
            imageToVideoPrompt: 'Clip cinemático de 10 segundos en vertical 9:16 de clímax y gancho: Mateo señala el sobre médico en la mesa mientras el dedo resplandeciente de Jesús dibuja una cruz dorada que transforma las letras en luz brillante. Diálogo fluido en español: [00:00-00:04] Mateo: "¡Abuelita, mira el sobre!... ¡El dedo de Jesús está escribiendo en oro sobre las letras!". [00:05-00:08] Abuelita: "¡Dios mío!... ¡El diagnóstico de muerte se convirtió en vida eterna!". [00:08-00:10] Destello de partículas doradas y aparece en pantalla "PARTE 2 MAÑANA 7:00 PM".',
            englishPromptWithSpanishDialogue: '10-second continuous cinematic cliffhanger shot in vertical 9:16 (Pixar 3D animation): Dynamic reaction as young boy Mateo points in astonishment at the medical envelope on the table. A glowing finger of Jesus traces across the dark diagnosis text, turning every letter into radiant liquid gold. Fluid Spanish dialogue: [00:00-00:04] Mateo exclaims in Latin American Spanish: "¡Abuelita, mira el sobre!... ¡El dedo de Jesús está escribiendo en oro sobre las letras!". [00:05-00:08] Grandmother gasps raising hands: "¡Dios mío!... ¡El diagnóstico de muerte se convirtió en vida eterna!". [00:08-00:10] Golden light swirl effect, closing title appears: "PARTE 2 MAÑANA 7:00 PM". 10s synced lip-sync, high drama.',
            sfx: 'Destello mágico de partículas doradas, latido grave orquestal con eco prolongado, campana triunfal (-8dB)',
            bgMusicMood: 'Acorde dramático de suspenso y triunfo que se corta en seco con reverberación'
          }
        ],
        socialPackage: {
          youtubeTitle: '🔴 Lo que ocurrió en esta cocina a las 3:00 AM cambió todo (Parte 1) #MiniserieDeFe',
          facebookTitle: 'Eran las 3:15 AM cuando su abuela lloraba en silencio... lo que pasó después te hará llorar de fe (Parte 1)',
          caption: '¿Has llorado alguna vez en silencio en la madrugada pensando que nadie te ve? Esta miniserie de fe te recordará que en tus momentos más oscuros, el cielo está más cerca de lo que imaginas.\n\n👉 COMENTA "PARTE 2" para notificarte cuando subamos el desenlace.\n👉 COMPARTE con alguien que necesite un milagro hoy.',
          hashtags: ['#MiniserieDeFe', '#ElSecretoDeLas3AM', '#DiosTeVe', '#MilagrosReales', '#JesusAnimado', '#FeYEsperanza', '#HistoriasDeFe'],
          pinnedComment: '🙏 ¿Alguna vez sentiste a Dios en una madrugada difícil? Escribe "PARTE 2" en los comentarios y activa la campanita para que no te pierdas el desenlace.'
        }
      },
      {
        episodeNumber: 2,
        episodeTitle: 'Parte 2: Las Letras de Oro en el Sobre',
        hook: 'El visitante de las 3 AM no pronunció una sola queja. Solo rozó el sobre médico con su dedo... y a las 8:00 AM el médico principal de la clínica llegó corriendo a la casa.',
        conflict: 'El doctor Roberto sostiene las nuevas radiografías con las manos temblorosas frente a la abuelita y a Mateo.',
        escalation: 'Los resultados de laboratorio repetidos tres veces indican que el tumor de 7 centímetros desapareció sin dejar cicatriz.',
        cliffhanger: 'El doctor miró fijamente a la abuelita y le preguntó: "¿Qué hicieron anoche? Porque en la cámara de seguridad de mi consultorio a las 3:15 AM pasó algo inexplicable". Mañana en la PARTE 3 (FINAL).',
        scenes: [
          {
            sceneNumber: 1,
            durationSec: 10,
            characterId: 'abuelita_esperanza',
            secondaryCharacterId: 'mateo_nino_fe',
            charactersInShot: ['abuelita_esperanza', 'mateo_nino_fe'],
            interactionType: 'dos_personajes_frente_a_frente',
            timeframe: '00:00 - 00:10',
            action: 'La mañana siguiente, la abuelita sirve el desayuno en la cocina soleada con una sonrisa radiante y vitalidad renovada; Mateo la abraza por la cintura saltando de alegría.',
            dialogueExchange: [
              {
                speakerName: 'Abuelita Esperanza',
                speakerId: 'abuelita_esperanza',
                dialogueSpanish: '¡Mateo, mira cómo me muevo!... ¡No me duele nada en el pecho, el dolor se fue por completo!',
                emotionalTone: 'Voz limpia, llena de salud renacida y lágrimas de alegría'
              },
              {
                speakerName: 'Mateo',
                speakerId: 'mateo_nino_fe',
                dialogueSpanish: '¡Te lo dije, abuelita! ¡Jesús estuvo aquí con nosotros anoche y te sanó!',
                emotionalTone: 'Júbilo saltando con su taza de leche'
              }
            ],
            narration: 'A la mañana siguiente, [PAUSA] la abuelita se levantó sin dolor por primera vez en dos años.',
            onScreenText: '8:00 AM · El Amanecer del Milagro',
            secondaryLabel: '🔴 LA RESPUESTA DE DIOS',
            imageToVideoPrompt: 'Clip cinemático de 10 segundos en vertical 9:16 de la abuelita Esperanza y Mateo en la cocina iluminada por el sol matutino. Diálogo fluido en español: [00:00-00:05] Abuelita sonríe con vitalidad: "¡Mateo, mira cómo me muevo!... ¡No me duele nada en el pecho, el dolor se fue por completo!". [00:05-00:08] Mateo salta abrazándola: "¡Te lo dije, abuelita! ¡Jesús estuvo aquí con nosotros anoche y te sanó!". [00:08-00:10] Ambos ríen con rostros radiantes bajo los rayos de luz.',
            englishPromptWithSpanishDialogue: '10-second continuous cinematic video clip in vertical 9:16 (Pixar 3D style): Sunlit morning kitchen scene with grandmother Esperanza and grandson Mateo. The grandmother looks completely healthy and energized, preparing breakfast with a joyful smile. Dialogue in Latin American Spanish: [00:00-00:05] Esperanza exclaims with tears of gratitude: "¡Mateo, mira cómo me muevo!... ¡No me duele nada en el pecho, el dolor se fue por completo!". [00:05-00:08] Mateo jumps hugging her waist: "¡Te lo dije, abuelita! ¡Jesús estuvo aquí con nosotros anoche y te sanó!". [00:08-00:10] Warm morning light streams across their happy faces. 10s synced Spanish lip-sync, lively natural pacing.',
            sfx: 'Canto de pajarillos matutinos, sonido alegre de vajilla y risas infantiles (-10dB)',
            bgMusicMood: 'Música acústica esperanzadora con guitarra suave y cuerdas cálidas (-20dB)'
          },
          {
            sceneNumber: 2,
            durationSec: 10,
            characterId: 'abuelita_esperanza',
            secondaryCharacterId: 'mateo_nino_fe',
            charactersInShot: ['abuelita_esperanza', 'mateo_nino_fe'],
            interactionType: 'dos_personajes_frente_a_frente',
            timeframe: '00:10 - 00:20',
            action: 'Tres golpes fuertes en la puerta interrumpen la alegría; entra el doctor Roberto con bata médica blanca y una carpeta azul bajo el brazo, pálido y con respiración agitada.',
            dialogueExchange: [
              {
                speakerName: 'Mateo',
                speakerId: 'mateo_nino_fe',
                dialogueSpanish: 'Abuelita, es el doctor del hospital... viene corriendo con la cara blanca.',
                emotionalTone: 'Voz baja, curiosa y llena de expectación'
              },
              {
                speakerName: 'Abuelita Esperanza',
                speakerId: 'abuelita_esperanza',
                dialogueSpanish: 'Pasa, doctor Roberto... No se preocupe, aquí reina la paz de Dios.',
                emotionalTone: 'Tranquilidad serena y acogedora'
              }
            ],
            narration: 'De pronto, unos golpes desesperados en la puerta cortaron la alegría. [PAUSA] Era el doctor del hospital.',
            onScreenText: 'Llaman a la Puerta',
            secondaryLabel: 'Llega el Médico',
            imageToVideoPrompt: 'Clip cinemático de 10 segundos en vertical 9:16: La puerta rústica se abre revelando al médico Roberto agitado con bata blanca y carpeta clínica. Diálogo fluido en español: [00:00-00:04] Mateo susurra asombrado: "Abuelita, es el doctor del hospital... viene corriendo con la cara blanca". [00:05-00:09] Abuelita lo recibe con una sonrisa serena: "Pasa, doctor Roberto... No se preocupe, aquí reina la paz de Dios". [00:09-00:10] El doctor da un paso adentro temblando.',
            englishPromptWithSpanishDialogue: '10-second continuous cinematic entrance shot in vertical 9:16 (Pixar 3D style): The rustic wooden door swings open revealing a breathless doctor in a white coat holding a medical file against his chest, eyes wide with perplexity. Fluid dialogue in Latin American Spanish: [00:00-00:04] Boy Mateo whispers to his grandmother: "Abuelita, es el doctor del hospital... viene corriendo con la cara blanca". [00:05-00:09] Grandmother Esperanza smiles calmly from the table: "Pasa, doctor Roberto... No se preocupe, aquí reina la paz de Dios". [00:09-00:10] The doctor steps inside with shaking hands. Realistic 10s timing, suspenseful atmosphere.',
            sfx: 'Tres golpes secos y urgentes en madera maciza, respiración jadeante del doctor (-8dB)',
            bgMusicMood: 'Cambio súbito a intriga y tensión rítmica con piano staccato (-18dB)'
          },
          {
            sceneNumber: 3,
            durationSec: 10,
            characterId: 'abuelita_esperanza',
            secondaryCharacterId: 'mateo_nino_fe',
            charactersInShot: ['abuelita_esperanza', 'mateo_nino_fe'],
            interactionType: 'dos_personajes_frente_a_frente',
            timeframe: '00:20 - 00:30',
            action: 'El doctor coloca la placa de rayos X a contra luz de la ventana frente a ellos; la silueta de los pulmones se ve completamente limpia, nítida y sin rastro alguno de tumor.',
            dialogueExchange: [
              {
                speakerName: 'Abuelita Esperanza',
                speakerId: 'abuelita_esperanza',
                dialogueSpanish: 'Doctor Roberto, díganos sin miedo... ¿qué dicen los nuevos resultados?',
                emotionalTone: 'Calma serena y confiada'
              },
              {
                speakerName: 'Doctor Roberto',
                speakerId: 'doctor_roberto',
                dialogueSpanish: 'Señora Esperanza... repetí los exámenes tres veces. ¡El tumor desapareció por completo!',
                emotionalTone: 'Voz temblorosa de médico incrédulo al borde del llanto'
              }
            ],
            narration: '"Señora Esperanza...", dijo el médico con la voz quebrada. [PAUSA] "Repetí los análisis tres veces porque creí que las máquinas fallaban".',
            onScreenText: '"Las Máquinas no Mienten"',
            secondaryLabel: 'El Examen Imposible',
            imageToVideoPrompt: 'Clip cinemático de 10 segundos en vertical 9:16 con tres personajes: El doctor sostiene la placa radiográfica contra la luz matutina mientras la abuelita y Mateo observan. Diálogo fluido en español: [00:00-00:04] Abuelita: "Doctor Roberto, díganos sin miedo... ¿qué dicen los nuevos resultados?". [00:05-00:09] Doctor asombrado: "Señora Esperanza... repetí los exámenes tres veces. ¡El tumor desapareció por completo!". [00:09-00:10] Mateo sonríe con gozo mirando la placa.',
            englishPromptWithSpanishDialogue: '10-second continuous cinematic shot in vertical 9:16 (Pixar 3D animation): The doctor holds a chest X-ray against the sunny window for Grandma Esperanza and young Mateo. The scan reveals crystal-clear, healthy lungs. Dialogue in Latin American Spanish: [00:00-00:04] Grandmother asks with peaceful confidence: "Doctor Roberto, díganos sin miedo... ¿qué dicen los nuevos resultados?". [00:05-00:09] The doctor stammers with eyes wide in disbelief: "Señora Esperanza... repetí los exámenes tres veces. ¡El tumor desapareció por completo!". [00:09-00:10] Little Mateo leaps with joy. Calibrated 10s lip-sync, realistic textures.',
            sfx: 'Despliegue crujiente de placa de acetato radiológico, murmullo perplejo del médico (-10dB)',
            bgMusicMood: 'Nota sostenida de violín con arpegio emotivo que presagia el milagro (-18dB)'
          },
          {
            sceneNumber: 4,
            durationSec: 10,
            characterId: 'mateo_nino_fe',
            secondaryCharacterId: 'abuelita_esperanza',
            charactersInShot: ['mateo_nino_fe', 'abuelita_esperanza'],
            interactionType: 'abrazo_consuelo',
            timeframe: '00:30 - 00:40',
            action: 'El doctor cae sentado en la silla de madera sin poder sostenerse; Mateo le entrega el sobre que Jesús tocó a las 3 AM con las letras doradas.',
            dialogueExchange: [
              {
                speakerName: 'Mateo',
                speakerId: 'mateo_nino_fe',
                dialogueSpanish: '¡Mire el sobre, doctor! ¡Anoche el Médico de médicos lo firmó con letras de oro!',
                emotionalTone: 'Ternura, inocencia y certeza absoluta'
              },
              {
                speakerName: 'Doctor Roberto',
                speakerId: 'doctor_roberto',
                dialogueSpanish: 'Llevo treinta años ejerciendo la medicina... y esto desafía toda ley biológica.',
                emotionalTone: 'Susurro de reverencia profunda'
              }
            ],
            narration: '"Científicamente usted debería estar en terapia intensiva", confesó el doctor. [PAUSA] "Pero sus pulmones son los de una mujer de treinta años".',
            onScreenText: '"Sus Pulmones son Nuevos"',
            secondaryLabel: 'Confirmación Médica',
            imageToVideoPrompt: 'Clip cinemático de 10 segundos en vertical 9:16: Mateo le entrega el sobre blanco con letras doradas al doctor atónito en la mesa. La abuelita levanta sus manos al cielo llorando de agradecimiento. Diálogo fluido en español: [00:00-00:04] Mateo: "¡Mire el sobre, doctor! ¡Anoche el Médico de médicos lo firmó con letras de oro!". [00:05-00:09] Doctor tocando el papel: "Llevo treinta años ejerciendo la medicina... y esto desafía toda ley biológica". [00:09-00:10] Destello de luz dorada sobre la mesa.',
            englishPromptWithSpanishDialogue: '10-second continuous cinematic shot in vertical 9:16: Little Mateo hands the golden-glowing hospital envelope to the stunned physician seated at the wooden table. Grandma Esperanza raises tear-filled eyes toward heaven. Dialogue in Latin American Spanish: [00:00-00:04] Mateo proclaims: "¡Mire el sobre, doctor! ¡Anoche el Médico de médicos lo firmó con letras de oro!". [00:05-00:09] Doctor inspects the golden script in shock: "Llevo treinta años ejerciendo la medicina... y esto desafía toda ley biológica". [00:09-00:10] Soft golden lens flare on the envelope. 10s synced lip-sync.',
            sfx: 'Sollozo emocionado de la abuela, suspiro hondo del doctor impresionado (-10dB)',
            bgMusicMood: 'Melodía triunfante de piano y violonchelo que llena el pecho de emoción sagrada (-16dB)'
          },
          {
            sceneNumber: 5,
            durationSec: 10,
            characterId: 'abuelita_esperanza',
            secondaryCharacterId: 'mateo_nino_fe',
            charactersInShot: ['abuelita_esperanza', 'mateo_nino_fe'],
            interactionType: 'reaccion_asombro',
            timeframe: '00:40 - 00:50',
            action: 'El doctor saca su teléfono con las manos temblorosas y les muestra la pantalla con una grabación de seguridad que los deja sin respiración.',
            dialogueExchange: [
              {
                speakerName: 'Abuelita Esperanza',
                speakerId: 'abuelita_esperanza',
                dialogueSpanish: '¿Por qué tiemblan sus manos, doctor?... ¿Qué tiene en su teléfono?',
                emotionalTone: 'Suspenso e intriga total'
              },
              {
                speakerName: 'Doctor Roberto',
                speakerId: 'doctor_roberto',
                dialogueSpanish: 'Miren la cámara del pasillo a las 3:15 AM... Una figura luminosa de manto azul tocó su expediente...',
                emotionalTone: 'Voz quebrada por el escalofrío sagrado'
              }
            ],
            narration: 'Pero el doctor no había terminado. [PAUSA] Sacó su teléfono temblando y dijo: "A las 3:15 AM, la cámara de mi oficina grabó esto...".',
            onScreenText: 'La Grabación de las 3:15 AM',
            secondaryLabel: 'CONTINÚA EN PARTE 3 (FINAL)',
            imageToVideoPrompt: 'Clip cinemático de 10 segundos en vertical 9:16 de clímax y suspense: El doctor gira la pantalla de su smartphone hacia la abuelita y Mateo. En el video se ve una silueta celestial con manto azul caminando por el hospital vacío. Diálogo fluido en español: [00:00-00:04] Abuelita: "¿Por qué tiemblan sus manos, doctor?... ¿Qué tiene en su teléfono?". [00:05-00:08] Doctor: "Miren la cámara del pasillo a las 3:15 AM... Una figura luminosa tocó su expediente...". [00:08-00:10] Mateo jadea de asombro y aparece "GRAN FINAL PARTE 3 MAÑANA 7:00 PM".',
            englishPromptWithSpanishDialogue: '10-second continuous cinematic cliffhanger in vertical 9:16 (Pixar 3D style): The doctor turns his glowing smartphone screen toward Grandma Esperanza and Mateo. On the surveillance video playback, an ethereal radiant figure in a blue mantle walks through the dark hospital corridor. Dialogue in Latin American Spanish: [00:00-00:04] Grandmother asks in suspense: "¿Por qué tiemblan sus manos, doctor?... ¿Qué tiene en su teléfono?". [00:05-00:08] Doctor answers with trembling voice: "Miren la cámara del pasillo a las 3:15 AM... Una figura luminosa de manto azul tocó su expediente...". [00:08-00:10] Mateo gasps with wide eyes. Dramatic text: "GRAN FINAL PARTE 3 MAÑANA 7:00 PM".',
            sfx: 'Zumbido eléctrico sutil de pantalla de teléfono, acorde grave de misterio absoluto (-8dB)',
            bgMusicMood: 'Corte súbito de suspenso máximo que te obliga a querer ver el final'
          }
        ],
        socialPackage: {
          youtubeTitle: '🔴 El doctor no podía creer lo que vio a la mañana siguiente (Parte 2) #MiniserieDeFe',
          facebookTitle: 'Los médicos dijeron que no había remedio... pero a las 3 AM alguien firmó el sobre (Parte 2)',
          caption: 'Cuando el hombre dice "no hay nada que hacer", Dios se levanta del trono y dice "apenas voy a empezar". Esta historia te devolverá la fe en los milagros.\n\n👉 COMENTA "PARTE 3" para ver el desenlace mañana.\n👉 ETIQUETA a quien esté esperando un diagnóstico hoy.',
          hashtags: ['#MiniserieDeFe', '#Parte2', '#MilagroMedico', '#DiosEsFiel', '#JesusSana', '#FeEnDios'],
          pinnedComment: 'Escribe "PARTE 3" para ser el primero en ver la grabación de la cámara de seguridad en el gran final.'
        }
      },
      {
        episodeNumber: 3,
        episodeTitle: 'Parte 3: El Gran Abrazo & La Revelación',
        hook: 'El video de la cámara de seguridad mostraba a un hombre de manto azul entrando a la sala de archivos médicos a las 3:15 AM. Pero cuando los guardias corrieron a buscarlo... solo quedó un aroma a lirios del campo.',
        conflict: 'El médico, un hombre de ciencia ateo, cae de rodillas en la cocina de la humilde abuelita pidiendo que oren por él.',
        escalation: 'Toda la familia se reúne en la mesa: el hijo pródigo que estaba alejado llama por teléfono en ese instante conmovido por el Espíritu Santo.',
        cliffhanger: 'Jesús no solo sanó el cuerpo de la abuela; salvó y unió a tres generaciones en una sola madrugada. Si crees que Dios todavía hace milagros hoy, deja tu Amén y comparte esta serie.',
        scenes: [
          {
            sceneNumber: 1,
            durationSec: 10,
            characterId: 'abuelita_esperanza',
            secondaryCharacterId: 'mateo_nino_fe',
            charactersInShot: ['abuelita_esperanza', 'mateo_nino_fe'],
            interactionType: 'dos_personajes_frente_a_frente',
            timeframe: '00:00 - 00:10',
            action: 'La abuelita y Mateo miran el video en el teléfono del doctor con lágrimas de reverencia; la figura luminosa del video levanta la mano bendiciendo la ficha médica.',
            dialogueExchange: [
              {
                speakerName: 'Mateo',
                speakerId: 'mateo_nino_fe',
                dialogueSpanish: '¡Es Él, doctor! ¡Es Jesús! ¡Estuvo en el hospital y luego vino a nuestra casa!',
                emotionalTone: 'Certeza infantil incontestable y jubilosa'
              },
              {
                speakerName: 'Doctor Roberto',
                speakerId: 'doctor_roberto',
                dialogueSpanish: 'Los guardias corrieron a buscarlo... pero solo quedó un aroma a lirios y una paz infinita.',
                emotionalTone: 'Asombro reverente que desarma el orgullo'
              }
            ],
            narration: 'En la pantalla de seguridad del hospital, [PAUSA] una figura celestial tocaba cada expediente de los enfermos.',
            onScreenText: 'La Prueba que Nadie Esperaba',
            secondaryLabel: '🔴 CAPÍTULO FINAL',
            imageToVideoPrompt: 'Clip cinemático de 10 segundos en vertical 9:16: Mateo, la abuelita y el doctor conmovidos viendo el video en el teléfono. Diálogo fluido en español: [00:00-00:04] Mateo señalando la pantalla: "¡Es Él, doctor! ¡Es Jesús! ¡Estuvo en el hospital y luego vino a nuestra casa!". [00:05-00:09] Doctor con ojos llorosos: "Los guardias corrieron a buscarlo... pero solo quedó un aroma a lirios y una paz infinita". [00:09-00:10] La abuela aprieta la mano de su nieto conmovida.',
            englishPromptWithSpanishDialogue: '10-second continuous cinematic shot in vertical 9:16 (Pixar 3D style): Three characters clustered around the glowing smartphone screen. The ethereal reflection of the image of Jesus shines on their faces. Dialogue in Latin American Spanish: [00:00-00:04] Little Mateo points excitedly: "¡Es Él, doctor! ¡Es Jesús! ¡Estuvo en el hospital y luego vino a nuestra casa!". [00:05-00:09] The doctor whispers in awe: "Los guardias corrieron a buscarlo... pero solo quedó un aroma a lirios y una paz infinita". [00:09-00:10] Grandmother touches the screen with tears of holy love. 10s synced lip-sync.',
            sfx: 'Respiración contenida y sollozo de emoción compartida, suave brisa (-10dB)',
            bgMusicMood: 'Melodía solemne de piano y violines celestiales que llena de paz (-18dB)'
          },
          {
            sceneNumber: 2,
            durationSec: 10,
            characterId: 'abuelita_esperanza',
            secondaryCharacterId: 'mateo_nino_fe',
            charactersInShot: ['abuelita_esperanza', 'mateo_nino_fe'],
            interactionType: 'confrontacion_redencion',
            timeframe: '00:10 - 00:20',
            action: 'El doctor Roberto cae de rodillas sobre el piso de madera de la cocina entre lágrimas de arrepentimiento; la abuelita y Mateo le ponen con ternura las manos en la cabeza orando por él.',
            dialogueExchange: [
              {
                speakerName: 'Doctor Roberto',
                speakerId: 'doctor_roberto',
                dialogueSpanish: 'Señora Esperanza... he sido un hombre orgulloso y ateo toda mi vida. Por favor, oren por mí.',
                emotionalTone: 'Llanto quebrado de hombre que se rinde a Dios'
              },
              {
                speakerName: 'Abuelita Esperanza',
                speakerId: 'abuelita_esperanza',
                dialogueSpanish: 'Hijo amado, el Señor no solo sanó mi cuerpo... Hoy vino a rescatar tu corazón para siempre.',
                emotionalTone: 'Amor pastoral maternal y reconciliación'
              }
            ],
            narration: 'El médico que no creía en Dios [PAUSA] cayó de rodillas en esa cocina pidiendo perdón por tantos años de orgullo.',
            onScreenText: 'Un Médico de Rodillas',
            secondaryLabel: 'De la Ciencia a la Fe',
            imageToVideoPrompt: 'Clip cinemático de 10 segundos en vertical 9:16: El doctor con bata médica de rodillas en el piso de madera llorando, mientras la abuelita Esperanza y Mateo le imponen las manos con amor. Diálogo fluido en español: [00:00-00:04] Doctor: "Señora Esperanza... he sido un hombre orgulloso y ateo toda mi vida. Por favor, oren por mí". [00:05-00:09] Abuelita: "Hijo amado, el Señor no solo sanó mi cuerpo... Hoy vino a rescatar tu corazón para siempre". [00:09-00:10] Haz de luz celestial cayendo sobre el médico.',
            englishPromptWithSpanishDialogue: '10-second continuous cinematic redemption scene in vertical 9:16 (Pixar 3D style): The proud medical doctor weeping on his knees upon the wooden floor. Grandmother Esperanza and young Mateo place loving hands upon his head. Dialogue in Latin American Spanish: [00:00-00:04] Doctor weeps: "Señora Esperanza... he sido un hombre orgulloso y ateo toda mi vida. Por favor, oren por mí". [00:05-00:09] Grandmother speaks with divine grace: "Hijo amado, el Señor no solo sanó mi cuerpo... Hoy vino a rescatar tu corazón para siempre". [00:09-00:10] Golden heavenly light washes over him. 10s synced lip-sync.',
            sfx: 'Llanto liberador de hombre adulto, crujido de rodillas al tocar el piso, suspiro de paz (-8dB)',
            bgMusicMood: 'Cuerdas orquestales épicas de redención y gracia infinita (-16dB)'
          },
          {
            sceneNumber: 3,
            durationSec: 10,
            characterId: 'jesus_cartoon_3d',
            secondaryCharacterId: 'mateo_nino_fe',
            charactersInShot: ['jesus_cartoon_3d', 'mateo_nino_fe', 'abuelita_esperanza'],
            interactionType: 'encuentro_con_jesus',
            timeframe: '00:20 - 00:30',
            action: 'El Maestro Jesús aparece en el umbral bañado de luz dorada contemplando a la familia en oración; levanta su mano derecha soltando bendición y paz sobre el hogar.',
            dialogueExchange: [
              {
                speakerName: 'Maestro Jesús',
                speakerId: 'jesus_cartoon_3d',
                dialogueSpanish: 'Hoy ha venido la salvación a esta casa. Vete en paz, tus pecados te son perdonados.',
                emotionalTone: 'Voz celestial llena de gloria, ternura y majestad'
              },
              {
                speakerName: 'Doctor Roberto',
                speakerId: 'doctor_roberto',
                dialogueSpanish: '¡Creo, Señor!... ¡Ayuda mi incredulidad y hazme un instrumento de tu amor!',
                emotionalTone: 'Clamor de adoración pura'
              }
            ],
            narration: '"Hoy ha llegado la salvación a esta casa", susurró la presencia del Maestro.',
            onScreenText: '"Salvación a Esta Casa"',
            secondaryLabel: 'Lucas 19:9',
            imageToVideoPrompt: 'Clip cinemático de 10 segundos en vertical 9:16: Jesús animado 3D en el umbral sonriendo con misericordia infinita hacia la familia y el médico orando. Diálogo fluido en español: [00:00-00:05] Jesús con mano alzada: "Hoy ha venido la salvación a esta casa. Vete en paz, tus pecados te son perdonados". [00:05-00:09] Doctor de rodillas responde con manos al cielo: "¡Creo, Señor!... ¡Ayuda mi incredulidad y hazme un instrumento de tu amor!". [00:09-00:10] Partículas doradas flotando en el aire.',
            englishPromptWithSpanishDialogue: '10-second continuous cinematic shot in vertical 9:16: Jesus Christ in 3D Pixar animation stands at the luminous threshold, gazing upon the kneeling doctor and family with boundless divine love. Dialogue in Latin American Spanish: [00:00-00:05] Jesus raises his hand in blessing: "Hoy ha venido la salvación a esta casa. Vete en paz, tus pecados te son perdonados". [00:05-00:09] Kneeling doctor cries out in joy: "¡Creo, Señor!... ¡Ayuda mi incredulidad y hazme un instrumento de tu amor!". [00:09-00:10] Sparkling golden dust falls gently through the sunny room. 10s synced lip-sync.',
            sfx: 'Viento suave celestial, campanilla de cristal con reverberación gloriosa (-10dB)',
            bgMusicMood: 'Coro angelical celestial en crescendo glorioso (-14dB)'
          },
          {
            sceneNumber: 4,
            durationSec: 10,
            characterId: 'mateo_nino_fe',
            secondaryCharacterId: 'abuelita_esperanza',
            charactersInShot: ['mateo_nino_fe', 'abuelita_esperanza'],
            interactionType: 'abrazo_consuelo',
            timeframe: '00:30 - 00:40',
            action: 'Suena el teléfono de la casa con timbre fuerte; Mateo corre a contestar y escucha la voz de su padre pidiendo perdón después de 5 años de distancia.',
            dialogueExchange: [
              {
                speakerName: 'Mateo',
                speakerId: 'mateo_nino_fe',
                dialogueSpanish: '¡Abuelita!... ¡El teléfono está sonando!... ¡Es la voz de papá pidiendo volver a casa!',
                emotionalTone: 'Grito de victoria y llanto de gozo supremo'
              },
              {
                speakerName: 'Abuelita Esperanza',
                speakerId: 'abuelita_esperanza',
                dialogueSpanish: '¡Hijo mío!... ¡Dios escuchó las oraciones de tantas madrugadas! ¡Vuelve, tu casa te espera!',
                emotionalTone: 'Lágrimas santas de restauración familiar'
              }
            ],
            narration: 'Y como si el milagro fuera poco, [PAUSA] sonó el teléfono con la voz que llevaban 5 años esperando escuchar.',
            onScreenText: 'La Familia Restaurada',
            secondaryLabel: 'El Milagro Completo',
            imageToVideoPrompt: 'Clip cinemático de 10 segundos en vertical 9:16: Mateo sosteniendo el auricular de un teléfono vintage gritando de júbilo mientras la abuelita Esperanza lo abraza llorando de alegría. Diálogo fluido en español: [00:00-00:04] Mateo: "¡Abuelita!... ¡El teléfono está sonando!... ¡Es la voz de papá pidiendo volver a casa!". [00:05-00:09] Abuelita: "¡Hijo mío!... ¡Dios escuchó las oraciones de tantas madrugadas! ¡Vuelve, tu casa te espera!". [00:09-00:10] Rayos de sol dorados bañan sus sonrisas.',
            englishPromptWithSpanishDialogue: '10-second continuous cinematic shot in vertical 9:16 (Pixar 3D style): Little Mateo holding an antique telephone receiver to his ear, screaming in triumphant joy as grandmother Esperanza wraps her arms around him weeping happy tears. Dialogue in Latin American Spanish: [00:00-00:04] Mateo shouts: "¡Abuelita!... ¡El teléfono está sonando!... ¡Es la voz de papá pidiendo volver a casa!". [00:05-00:09] Grandmother speaks into receiver: "¡Hijo mío!... ¡Dios escuchó las oraciones de tantas madrugadas! ¡Vuelve, tu casa te espera!". [00:09-00:10] Sunbeams illuminating their tear-streaked smiling faces. 10s synced lip-sync.',
            sfx: 'Timbre clásico de teléfono de campana, grito de alegría de niño, sollozo de felicidad (-10dB)',
            bgMusicMood: 'Cuerdas orquestales y piano brillante de celebración y victoria de fe (-16dB)'
          },
          {
            sceneNumber: 5,
            durationSec: 10,
            characterId: 'jesus_cartoon_3d',
            secondaryCharacterId: 'mateo_nino_fe',
            charactersInShot: ['jesus_cartoon_3d', 'abuelita_esperanza', 'mateo_nino_fe'],
            interactionType: 'plano_conjunto_familiar',
            timeframe: '00:40 - 00:50',
            action: 'Plano final glorioso: Toda la familia unida a la mesa al atardecer tomados de las manos orando, con Jesús bendiciéndolos desde atrás con una sonrisa radiante.',
            dialogueExchange: [
              {
                speakerName: 'Maestro Jesús',
                speakerId: 'jesus_cartoon_3d',
                dialogueSpanish: 'He aquí, yo estoy con vosotros todos los días hasta el fin del mundo. Nada os faltará.',
                emotionalTone: 'Promesa viva que llena de paz y fortaleza'
              },
              {
                speakerName: 'Mateo y Abuelita',
                speakerId: 'mateo_nino_fe',
                dialogueSpanish: '¡Amén, Señor Jesús!... ¡Bendecimos a cada familia que ve este testimonio hoy!',
                emotionalTone: 'Coro familiar de gratitud y bendición'
              }
            ],
            narration: 'Nunca dudes del poder de una oración a las 3 AM. [PAUSA] Si crees que Dios puede restaurar tu casa hoy, escribe tu "AMÉN" en los comentarios.',
            onScreenText: 'Escribe tu "AMÉN" en los Comentarios',
            secondaryLabel: 'COMPARTE ESTA MINISERIE',
            imageToVideoPrompt: 'Clip cinemático de 10 segundos en vertical 9:16: Plano final de bendición familiar al atardecer cálido con Jesús extendiendo sus manos protectoras sobre la mesa. Diálogo fluido en español: [00:00-00:05] Jesús con voz majestuosa: "He aquí, yo estoy con vosotros todos los días hasta el fin del mundo. Nada os faltará". [00:05-00:08] Mateo y la abuelita: "¡Amén, Señor Jesús!... ¡Bendecimos a cada familia que ve este testimonio hoy!". [00:08-00:10] Letras doradas: "ESCRIBE TU AMÉN Y COMPARTE".',
            englishPromptWithSpanishDialogue: '10-second continuous cinematic grand finale shot in vertical 9:16 (Pixar 3D style): The united family holding hands around the dinner table at golden sunset, heads bowed in prayer. Standing behind them, Jesus Christ radiates heavenly light with outstretched hands. Dialogue in Latin American Spanish: [00:00-00:05] Jesus speaks with gentle majesty: "He aquí, yo estoy con vosotros todos los días hasta el fin del mundo. Nada os faltará". [00:05-00:08] Family replies in unison: "¡Amén, Señor Jesús!... ¡Bendecimos a cada familia que ve este testimonio hoy!". [00:08-00:10] Golden title appears: "ESCRIBE TU AMÉN Y COMPARTE ESTA MINISERIE". 10s synced lip-sync.',
            sfx: 'Acorde celestial final de campanas y pad suave que se disuelve en paz (-10dB)',
            bgMusicMood: 'Himno triunfante de victoria sagrada en piano, cuerdas y coro celestial'
          }
        ],
        socialPackage: {
          youtubeTitle: '🔴 El desenlace de las 3:00 AM que conmovió a millones (Gran Final) #MiniserieDeFe',
          facebookTitle: 'Los médicos no lo entendieron, pero toda su familia fue transformada (Gran Final)',
          caption: 'Nunca subestimes una lágrima derramada en la madrugada. Dios no solo sana tus heridas físicas, restaura tu hogar completo.\n\n🙏 Si crees en el poder de la oración, escribe tu "AMÉN" y COMPARTE esta miniserie para bendecir a otros.',
          hashtags: ['#MiniserieDeFe', '#GranFinal', '#MilagroCompleto', '#DiosRestaura', '#JesusEsReal', '#AmorDeDios'],
          pinnedComment: 'Deja tu petición en los comentarios para orar por tu familia hoy. ¡Escribe AMÉN si viste toda la miniserie!'
        }
      }
    ]
  },
  {
    id: 'miniserie_soldado_espada',
    seriesTitle: 'El Soldado que Soltó su Espada',
    logline: 'Un centurión implacable recibe la orden de desalojar a una familia humilde, pero un encuentro de miradas con el Maestro quiebra su corazón de piedra.',
    category: 'prueba_fe',
    categoryLabel: 'Redención de Corazones Duros',
    totalPartsPlanned: 2,
    bannerHook: '🔴 EL SOLDADO MÁS TEMIDO DE ROMA CAYÓ DE RODILLAS • PARTE 1',
    primaryCharacterIds: ['marcus_centurion', 'sara_madre_fe', 'jesus_cartoon_3d'],
    episodes: [
      {
        episodeNumber: 1,
        episodeTitle: 'Parte 1: La Orden del Amanecer',
        hook: 'Marcus tenía órdenes de derribar la casa al alba. Pero antes de desenvainar su espada frente a la madre y sus hijos, una figura con manto azul se paró en medio.',
        conflict: 'Marcus nunca había recibido una negativa de nadie en toda la provincia de Judea.',
        escalation: 'El soldado desenvaina su hoja de bronce templado. El Maestro no retrocede ni un paso.',
        cliffhanger: 'Cuando Marcus levantó la espada para apartarlo, Jesús no se defendió. Solo lo miró y le dijo el nombre de su hija enferma en Roma... ¿Cómo sabía su mayor dolor secreto? Descúbrelo en la PARTE 2.',
        scenes: [
          {
            sceneNumber: 1,
            durationSec: 10,
            characterId: 'marcus_centurion',
            secondaryCharacterId: 'sara_madre_fe',
            charactersInShot: ['marcus_centurion', 'sara_madre_fe'],
            interactionType: 'confrontacion_redencion',
            timeframe: '00:00 - 00:10',
            action: 'Marcus avanza con su capa roja marchando hacia la humilde choza de Sara; Sara se interpone en la puerta de madera protegiendo a sus dos pequeños con angustia.',
            dialogueExchange: [
              {
                speakerName: 'Centurión Marcus',
                speakerId: 'marcus_centurion',
                dialogueSpanish: '¡Abran paso en nombre de Roma! Tengo órdenes de confiscar esta casa al amanecer.',
                emotionalTone: 'Voz marcial, dura y autoritaria de comandante implacable'
              },
              {
                speakerName: 'Sara',
                speakerId: 'sara_madre_fe',
                dialogueSpanish: '¡Piedad, centurión! ¡Mis hijos pequeños no tienen otro refugio ni pan que comer!',
                emotionalTone: 'Súplica maternal desgarradora con voz temblorosa'
              }
            ],
            narration: 'Marcus no conocía la piedad. [PAUSA] Sus órdenes eran desalojar a la familia antes de que saliera el sol.',
            onScreenText: 'La Orden Inquebrantable',
            secondaryLabel: '🔴 JUDEA, SIGLO I',
            imageToVideoPrompt: 'Clip cinemático de 10 segundos en vertical 9:16 de confrontación dramática estilo Pixar 3D: Marcus (armadura romana de bronce y capa carmesí) marcha hacia la puerta rústica donde Sara abraza a sus hijos temblorosos. Diálogo fluido en español: [00:00-00:04] Marcus con voz de mando: "¡Abran paso en nombre de Roma! Tengo órdenes de confiscar esta casa al amanecer". [00:05-00:09] Sara suplicando de pie: "¡Piedad, centurión! ¡Mis hijos pequeños no tienen otro refugio ni pan que comer!". [00:09-00:10] Marcus frunce el ceño con dureza militar.',
            englishPromptWithSpanishDialogue: '10-second continuous cinematic confrontation shot in vertical 9:16 (Pixar 3D style): Roman Centurion Marcus (polished bronze armor, red cape, stern bearded jaw) marches toward mother Sara who shields her two frightened children in the doorway. Dialogue in Latin American Spanish: [00:00-00:04] Marcus bellows authoritatively: "¡Abran paso en nombre de Roma! Tengo órdenes de confiscar esta casa al amanecer". [00:05-00:09] Sara begs with tear-filled eyes: "¡Piedad, centurión! ¡Mis hijos pequeños no tienen otro refugio ni pan que comer!". [00:09-00:10] Marcus pauses with hardened glare. 10s synced lip-sync, dramatic morning light.',
            sfx: 'Pisar pesado de sandalias con clavos romanos sobre tierra, tintineo de bronce (-8dB)',
            bgMusicMood: 'Tambores marciales romanos con metales graves de tensión épica (-18dB)'
          },
          {
            sceneNumber: 2,
            durationSec: 10,
            characterId: 'sara_madre_fe',
            secondaryCharacterId: 'marcus_centurion',
            charactersInShot: ['sara_madre_fe', 'marcus_centurion'],
            interactionType: 'dos_personajes_frente_a_frente',
            timeframe: '00:10 - 00:20',
            action: 'Sara cae de rodillas al polvo tocando el borde de la capa carmesí de Marcus con lágrimas vivas, implorando clemencia por sus hijos.',
            dialogueExchange: [
              {
                speakerName: 'Sara',
                speakerId: 'sara_madre_fe',
                dialogueSpanish: '¡Por favor, se lo ruego por sus propios hijos!... ¡Tenga misericordia de esta madre viuda!',
                emotionalTone: 'Clamor desgarrador de madre humillada ante el poder'
              },
              {
                speakerName: 'Centurión Marcus',
                speakerId: 'marcus_centurion',
                dialogueSpanish: 'Roma no conoce la misericordia, mujer. La ley militar se ejecuta sin debilidades.',
                emotionalTone: 'Frialdad implacable de guerrero'
              }
            ],
            narration: 'Sara rogó por sus hijos de rodillas en el polvo. [PAUSA] Pero el corazón del centurión parecía de piedra templada.',
            onScreenText: '"Mis Hijos no Tienen Dónde Dormir"',
            secondaryLabel: 'La Súplica de Sara',
            imageToVideoPrompt: 'Clip cinemático de 10 segundos en vertical 9:16: Sara de rodillas en el sendero polvoriento sosteniendo la capa de Marcus implorando clemencia. Diálogo fluido en español: [00:00-00:04] Sara: "¡Por favor, se lo ruego por sus propios hijos!... ¡Tenga misericordia de esta madre viuda!". [00:05-00:09] Marcus mirando hacia abajo con ceño severo: "Roma no conoce la misericordia, mujer. La ley militar se ejecuta sin debilidades". [00:09-00:10] Sara baja la cabeza sollozando en el polvo.',
            englishPromptWithSpanishDialogue: '10-second continuous cinematic shot in vertical 9:16 (Pixar 3D style): Mother Sara on her knees in the dust, clutching the hem of the crimson cape of Centurion Marcus. Dialogue in Latin American Spanish: [00:00-00:04] Sara cries desperately: "¡Por favor, se lo ruego por sus propios hijos!... ¡Tenga misericordia de esta madre viuda!". [00:05-00:09] Marcus looks down with cold military stoicism: "Roma no conoce la misericordia, mujer. La ley militar se ejecuta sin debilidades". [00:09-00:10] Sara weeps as dust swirls around her hands. 10s synced lip-sync.',
            sfx: 'Llanto tembloroso de la madre, fricción de cuero militar y tela, viento árido (-10dB)',
            bgMusicMood: 'Violonchelo solitario desgarrador expresando la impotencia humana (-20dB)'
          },
          {
            sceneNumber: 3,
            durationSec: 10,
            characterId: 'marcus_centurion',
            secondaryCharacterId: 'jesus_cartoon_3d',
            charactersInShot: ['marcus_centurion', 'jesus_cartoon_3d'],
            interactionType: 'dos_personajes_frente_a_frente',
            timeframe: '00:20 - 00:30',
            action: 'Marcus desenvaina su espada gladius de bronce; al dar un paso adelante, Jesús aparece con paso sereno y se interpone cara a cara a un metro de distancia mirándolo a los ojos sin temor.',
            dialogueExchange: [
              {
                speakerName: 'Centurión Marcus',
                speakerId: 'marcus_centurion',
                dialogueSpanish: '¡Apártate de mi camino, galileo!... ¡Nadie se interpone entre mi espada y el César!',
                emotionalTone: 'Amenaza agresiva con espada en alto'
              },
              {
                speakerName: 'Maestro Jesús',
                speakerId: 'jesus_cartoon_3d',
                dialogueSpanish: 'La paz sea contigo, Marcus. No he venido con espada, sino a sanar tu corazón.',
                emotionalTone: 'Serenidad absoluta y mirada de compasión infinita'
              }
            ],
            narration: 'Marcus desenvainó su acero templado. [PAUSA] Pero un hombre de túnica blanca y manto azul se paró en medio sin armas.',
            onScreenText: 'El Hombre sin Armas',
            secondaryLabel: 'Jesús se Interpone',
            imageToVideoPrompt: 'Clip cinemático de 10 segundos en vertical 9:16 de confrontación cara a cara: Marcus con la espada romana alzada frente a Jesús animado 3D (33 años, túnica blanca, manto azul cielo). Diálogo fluido en español: [00:00-00:04] Marcus con furia: "¡Apártate de mi camino, galileo!... ¡Nadie se interpone entre mi espada y el César!". [00:05-00:09] Jesús lo mira con amor y calma sobrenatural: "La paz sea contigo, Marcus. No he venido con espada, sino a sanar tu corazón". [00:09-00:10] La punta de la espada gladius comienza a vacilar.',
            englishPromptWithSpanishDialogue: '10-second continuous cinematic standoff shot in vertical 9:16 (Pixar 3D style): Centurion Marcus gripping his drawn bronze gladius sword, confronting Jesus Christ standing calmly three feet away in off-white linen and sky-blue mantle. Dialogue in Latin American Spanish: [00:00-00:04] Marcus shouts menacingly: "¡Apártate de mi camino, galileo!... ¡Nadie se interpone entre mi espada y el César!". [00:05-00:09] Jesus looks straight into his furious eyes with boundless serene love: "La paz sea contigo, Marcus. No he venido con espada, sino a sanar tu corazón". [00:09-00:10] The hardened expression of Marcus begins to crack. 10s synced lip-sync.',
            sfx: 'Destello agudo y fricción de espada desenvainada, latido de suspenso, respiración contenida (-8dB)',
            bgMusicMood: 'Choque musical de percusión marcial con coros sacros en confrontación (-16dB)'
          },
          {
            sceneNumber: 4,
            durationSec: 10,
            characterId: 'jesus_cartoon_3d',
            secondaryCharacterId: 'marcus_centurion',
            charactersInShot: ['jesus_cartoon_3d', 'marcus_centurion'],
            interactionType: 'encuentro_con_jesus',
            timeframe: '00:30 - 00:40',
            action: 'Jesús da un paso adelante y aproxima su mano al pecho de Marcus; pronuncia en un susurro divino el nombre secreto de la hija moribunda del centurión en Roma.',
            dialogueExchange: [
              {
                speakerName: 'Maestro Jesús',
                speakerId: 'jesus_cartoon_3d',
                dialogueSpanish: 'Marcus... sé por qué tienes los ojos enrojecidos. Tu pequeña Claudia en Roma ya no tiene fiebre.',
                emotionalTone: 'Susurro divino cargado de amor, revelación sobrenatural y ternura'
              },
              {
                speakerName: 'Centurión Marcus',
                speakerId: 'marcus_centurion',
                dialogueSpanish: '¿Cómo... cómo sabes el nombre de mi hija?... Si jamás se lo he dicho a nadie...',
                emotionalTone: 'Voz rota por el choque emocional más grande de su vida'
              }
            ],
            narration: 'El Maestro no retrocedió. [PAUSA] Solo lo miró con amor y le susurró el nombre de su hija moribunda en Roma.',
            onScreenText: '"Tu Pequeña Claudia en Roma ya no Tiene Fiebre"',
            secondaryLabel: 'El Secreto del Centurión',
            imageToVideoPrompt: 'Clip cinemático de 10 segundos en vertical 9:16: Primer plano compartido entre Jesús y Marcus. Jesús coloca su mano cerca del corazón acorazado del centurión. Diálogo fluido en español: [00:00-00:05] Jesús: "Marcus... sé por qué tienes los ojos enrojecidos. Tu pequeña Claudia en Roma ya no tiene fiebre". [00:05-00:09] Marcus tiembla soltando aire: "¿Cómo... cómo sabes el nombre de mi hija?... Si jamás se lo he dicho a nadie...". [00:09-00:10] La espada empieza a resbalar de sus dedos.',
            englishPromptWithSpanishDialogue: '10-second continuous cinematic two-shot in vertical 9:16 (Pixar 3D style): Jesus extends his luminous right hand toward the chest armor of Centurion Marcus, gazing into his soul. Dialogue in Latin American Spanish: [00:00-00:05] Jesus speaks in tender divine revelation: "Marcus... sé por qué tienes los ojos enrojecidos. Tu pequeña Claudia en Roma ya no tiene fiebre". [00:05-00:09] Marcus stutters in sheer bewilderment, tears welling up: "¿Cómo... cómo sabes el nombre de mi hija?... Si jamás se lo he dicho a nadie...". [00:09-00:10] The heavy gladius sword begins slipping from his grip. 10s synced lip-sync.',
            sfx: 'Campanilla de cristal divina que silencia los tambores de guerra, respiración entrecortada del centurión (-10dB)',
            bgMusicMood: 'Transición sublime de tambores de guerra a melodía de cuerdas sacras y piano etéreo (-16dB)'
          },
          {
            sceneNumber: 5,
            durationSec: 10,
            characterId: 'marcus_centurion',
            secondaryCharacterId: 'jesus_cartoon_3d',
            charactersInShot: ['marcus_centurion', 'jesus_cartoon_3d', 'sara_madre_fe'],
            interactionType: 'confrontacion_redencion',
            timeframe: '00:40 - 00:50',
            action: 'La espada gladius cae al suelo de tierra con estruendo; Marcus cae de rodillas con la capa carmesí en el polvo y las manos en la cara, llorando como un niño quebrantado.',
            dialogueExchange: [
              {
                speakerName: 'Centurión Marcus',
                speakerId: 'marcus_centurion',
                dialogueSpanish: '¡Perdóname!... ¿Quién eres tú, hombre de Dios?... ¡Dime si mi niña vivirá!',
                emotionalTone: 'Sollozo quebrado de guerrero de élite completamente rendido'
              },
              {
                speakerName: 'Maestro Jesús',
                speakerId: 'jesus_cartoon_3d',
                dialogueSpanish: 'Tu hija vive, Marcus. Tu fe la ha salvado hoy.',
                emotionalTone: 'Paz soberana y promesa reconfortante'
              }
            ],
            narration: 'La espada cayó pesadamente en la tierra. [PAUSA] Pero lo que el centurión hizo a continuación cambiaría la historia de Judea.',
            onScreenText: 'La Espada en el Polvo',
            secondaryLabel: 'CONTINÚA EN PARTE 2',
            imageToVideoPrompt: 'Clip cinemático de 10 segundos en vertical 9:16: La espada romana gladius cae rebotando en el polvo mientras Marcus cae de rodillas ante Jesús con la capa roja en la tierra. Diálogo fluido en español: [00:00-00:05] Marcus llorando: "¡Perdóname!... ¿Quién eres tú, hombre de Dios?... ¡Dime si mi niña vivirá!". [00:05-00:08] Jesús sonríe bendiciéndolo: "Tu hija vive, Marcus. Tu fe la ha salvado hoy". [00:08-00:10] Aparece en pantalla "PARTE 2 MAÑANA 7:00 PM".',
            englishPromptWithSpanishDialogue: '10-second continuous cinematic climax in vertical 9:16 (Pixar 3D style): The bronze Roman sword clatters heavily into the dusty path. Centurion Marcus falls to his knees, his crimson cape spreading on the ground as he weeps with bowed head before Jesus. Dialogue in Latin American Spanish: [00:00-00:05] Marcus weeps brokenly: "¡Perdóname!... ¿Quién eres tú, hombre de Dios?... ¡Dime si mi niña vivirá!". [00:05-00:08] Jesus looks down with divine compassion: "Tu hija vive, Marcus. Tu fe la ha salvado hoy". [00:08-00:10] Dramatic title flashes: "PARTE 2 MAÑANA 7:00 PM". 10s synced lip-sync.',
            sfx: 'Espada de bronce rebotando pesadamente en la tierra, sollozo quebrado de guerrero, viento en el valle (-8dB)',
            bgMusicMood: 'Acorde épico de redención que deja resonando una nota de victoria celestial y suspenso'
          }
        ],
        socialPackage: {
          youtubeTitle: '🔴 El centurión más temido de Roma soltó su espada al escuchar esto (Parte 1) #MiniserieDeFe',
          facebookTitle: 'Iba a destruir la casa al amanecer... pero lo que le susurraron al oído lo hizo llorar como un niño (Parte 1)',
          caption: 'No hay corazón tan duro que el amor de Jesús no pueda quebrar. Si crees que alguien en tu familia está lejos de Dios, no dejes de orar.\n\n🔔 SUSCRÍBETE / SIGUE LA PÁGINA para ver la PARTE 2 mañana a las 7:00 PM.',
          hashtags: ['#MiniserieDeFe', '#ElCenturion', '#PoderDeDios', '#Transformacion', '#JesusTeAma'],
          pinnedComment: 'Comparte este video si conoces a alguien que necesita ver que Dios cambia hasta el corazón más duro. ¡Comenta PARTE 2!'
        }
      },
      {
        episodeNumber: 2,
        episodeTitle: 'Parte 2: La Hija Sanada y la Caída de Rodillas',
        hook: 'El centurión más temido de Roma estaba de rodillas en el polvo. Pero cuando un mensajero a caballo llegó al galope con una carta de Roma... el campamento entero se quedó mudo.',
        conflict: 'El mensajero imperial entrega el sello con la fecha y hora exacta de la sanidad de la pequeña Claudia.',
        escalation: 'Marcus saca de su bolsa de cuero las monedas de oro que le pagaron por destruir la aldea y se las entrega a Sara para alimentar a sus hijos.',
        cliffhanger: 'Marcus se quitó el casco de guerra y declaró ante sus soldados: "Verdaderamente, este es el Hijo de Dios". Si crees que Dios puede tocar el corazón de quien más te persigue, deja tu Amén.',
        scenes: [
          {
            sceneNumber: 1,
            durationSec: 10,
            characterId: 'marcus_centurion',
            secondaryCharacterId: 'jesus_cartoon_3d',
            charactersInShot: ['marcus_centurion', 'jesus_cartoon_3d'],
            interactionType: 'encuentro_con_jesus',
            timeframe: '00:00 - 00:10',
            action: 'Jesús se inclina hacia Marcus en el polvo, le extiende su mano y lo levanta con dignidad y afecto fraternal.',
            dialogueExchange: [
              {
                speakerName: 'Maestro Jesús',
                speakerId: 'jesus_cartoon_3d',
                dialogueSpanish: 'Levántate, Marcus. Tu fe ha alcanzado el trono de la gracia.',
                emotionalTone: 'Ternura infinita levantando al que estaba caído'
              },
              {
                speakerName: 'Centurión Marcus',
                speakerId: 'marcus_centurion',
                dialogueSpanish: 'Señor... no soy digno de que un hombre santo como tú me tienda la mano...',
                emotionalTone: 'Humildad profunda de militar quebrado'
              }
            ],
            narration: 'Jesús no humilló al soldado. [PAUSA] Le tendió su mano y lo levantó del polvo como a un hermano.',
            onScreenText: '"No soy Digno de que Entres en mi Casa"',
            secondaryLabel: '🔴 CAPÍTULO FINAL',
            imageToVideoPrompt: 'Clip cinemático de 10 segundos en vertical 9:16: Jesús animado 3D extendiendo su mano suave a Marcus de rodillas y levantándolo del polvo. Diálogo fluido en español: [00:00-00:04] Jesús con mirada fraternal: "Levántate, Marcus. Tu fe ha alcanzado el trono de la gracia". [00:05-00:09] Marcus con lágrimas de gratitud: "Señor... no soy digno de que un hombre santo como tú me tienda la mano...". [00:09-00:10] Marcus se pone de pie conmovido en la luz dorada.',
            englishPromptWithSpanishDialogue: '10-second continuous cinematic scene in vertical 9:16 (Pixar 3D style): Jesus Christ extends his hand and tenderly lifts the weeping Roman Centurion from the dusty path. Dialogue in Latin American Spanish: [00:00-00:04] Jesus speaks with gentle majesty: "Levántate, Marcus. Tu fe ha alcanzado el trono de la gracia". [00:05-00:09] Marcus rises slowly, eyes shining with reverence: "Señor... no soy digno de que un hombre santo como tú me tienda la mano...". [00:09-00:10] Warm golden sunbeams wrap both figures. 10s synced lip-sync.',
            sfx: 'Respiración de alivio, roce de armadura y manto de lino (-10dB)',
            bgMusicMood: 'Cuerdas orquestales y violonchelo noble en tono de gracia y reconciliación (-18dB)'
          },
          {
            sceneNumber: 2,
            durationSec: 10,
            characterId: 'marcus_centurion',
            secondaryCharacterId: 'sara_madre_fe',
            charactersInShot: ['marcus_centurion', 'sara_madre_fe'],
            interactionType: 'dos_personajes_frente_a_frente',
            timeframe: '00:10 - 00:20',
            action: 'Se escucha el galope acelerado de un corcel; un mensajero imperial desmonta y le entrega a Marcus un pergamino sellado con cera roja.',
            dialogueExchange: [
              {
                speakerName: 'Centurión Marcus',
                speakerId: 'marcus_centurion',
                dialogueSpanish: '¡Habla, jinete imperial! ¿Qué noticias traes de mi casa en Roma?',
                emotionalTone: 'Voz temblorosa de padre desesperado por noticias'
              },
              {
                speakerName: 'Mensajero Romano',
                speakerId: 'mensajero_romano',
                dialogueSpanish: '¡Centurión! Su esposa envía este despacho sellado al amanecer... ¡Es un milagro!',
                emotionalTone: 'Agitación y júbilo del emisario'
              }
            ],
            narration: 'En ese momento, el galope de un caballo sacudió el sendero. [PAUSA] Era el mensajero de Roma.',
            onScreenText: 'El Mensajero de Roma',
            secondaryLabel: 'Noticias Inesperadas',
            imageToVideoPrompt: 'Clip cinemático de 10 segundos en vertical 9:16: Un mensajero romano a caballo frena en seco levantando polvo y desmonta corriendo hacia Marcus con un pergamino sellado. Diálogo fluido en español: [00:00-00:04] Marcus: "¡Habla, jinete imperial! ¿Qué noticias traes de mi casa en Roma?". [00:05-00:09] Mensajero jadeando: "¡Centurión! Su esposa envía este despacho sellado al amanecer... ¡Es un milagro!". [00:09-00:10] Sara y sus hijos observan con expectación.',
            englishPromptWithSpanishDialogue: '10-second continuous dynamic arrival shot in vertical 9:16 (Pixar 3D style): A sweaty Roman cavalry messenger rapidly dismounts from a galloping horse, rushing forward with a wax-sealed parchment scroll for Centurion Marcus. Dialogue in Latin American Spanish: [00:00-00:04] Marcus demands anxiously: "¡Habla, jinete imperial! ¿Qué noticias traes de mi casa en Roma?". [00:05-00:09] The messenger pants excitedly: "¡Centurión! Su esposa envía este despacho sellado al amanecer... ¡Es un milagro!". [00:09-00:10] Sara watches with suspended breath. 10s synced lip-sync.',
            sfx: 'Galope acelerado de caballo que frena en seco, resoplido del animal y pasos rápidos (-8dB)',
            bgMusicMood: 'Redoble dramático de timbales que se abre a una nota de triunfo (-16dB)'
          },
          {
            sceneNumber: 3,
            durationSec: 10,
            characterId: 'marcus_centurion',
            secondaryCharacterId: 'sara_madre_fe',
            charactersInShot: ['marcus_centurion', 'sara_madre_fe'],
            interactionType: 'dos_personajes_frente_a_frente',
            timeframe: '00:20 - 00:30',
            action: 'Marcus rompe el sello de cera y lee el pergamino; sus ojos se abren con asombro supremo y prorrumpe en un grito de victoria hacia el cielo.',
            dialogueExchange: [
              {
                speakerName: 'Centurión Marcus',
                speakerId: 'marcus_centurion',
                dialogueSpanish: '¡Claudia se levantó de la cama!... ¡La fiebre la dejó a la misma hora en que te vi, Maestro!',
                emotionalTone: 'Grito de júbilo supremo de padre victorioso'
              },
              {
                speakerName: 'Sara',
                speakerId: 'sara_madre_fe',
                dialogueSpanish: '¡Bendito sea el Dios viviente que no abandona el clamor de un padre!',
                emotionalTone: 'Lágrimas santas de empatía y alegría'
              }
            ],
            narration: 'La carta decía: "A las 6:00 AM, la niña despertó pidiendo pan. Los médicos no lo explican".',
            onScreenText: '"La Niña Despertó Pidiendo Pan"',
            secondaryLabel: 'El Milagro en Roma',
            imageToVideoPrompt: 'Clip cinemático de 10 segundos en vertical 9:16: Marcus leyendo el pergamino imperial con lágrimas de inmenso gozo y gritando hacia el cielo. Sara se tapa la boca conmovida. Diálogo fluido en español: [00:00-00:05] Marcus con el pergamino en alto: "¡Claudia se levantó de la cama!... ¡La fiebre la dejó a la misma hora en que te vi, Maestro!". [00:05-00:09] Sara sonríe con lágrimas: "¡Bendito sea el Dios viviente que no abandona el clamor de un padre!". [00:09-00:10] La luz dorada del sol ilumina las lágrimas del soldado.',
            englishPromptWithSpanishDialogue: '10-second continuous cinematic shot in vertical 9:16 (Pixar 3D style): Centurion Marcus gripping the parchment with trembling hands, shouting toward the morning heavens in pure ecstatic joy. Mother Sara weeps sympathetic tears. Dialogue in Latin American Spanish: [00:00-00:05] Marcus shouts triumphantly: "¡Claudia se levantó de la cama!... ¡La fiebre la dejó a la misma hora en que te vi, Maestro!". [00:05-00:09] Sara joins in praise: "¡Bendito sea el Dios viviente que no abandona el clamor de un padre!". [00:09-00:10] Morning sun highlights his joyful tears. 10s synced lip-sync.',
            sfx: 'Ruptura de sello de cera, grito de júbilo de hombre rudo, viento matutino (-8dB)',
            bgMusicMood: 'Crescendo glorioso de trompetas heroicas combinadas con coro sacro celestial (-16dB)'
          },
          {
            sceneNumber: 4,
            durationSec: 10,
            characterId: 'marcus_centurion',
            secondaryCharacterId: 'sara_madre_fe',
            charactersInShot: ['marcus_centurion', 'sara_madre_fe'],
            interactionType: 'dos_personajes_frente_a_frente',
            timeframe: '00:30 - 00:40',
            action: 'Marcus se acerca a Sara, desata su bolsa pesada de denarios de oro del cinto y se la entrega con reverencia en las manos para el sustento de sus hijos.',
            dialogueExchange: [
              {
                speakerName: 'Centurión Marcus',
                speakerId: 'marcus_centurion',
                dialogueSpanish: 'Perdóname, hermana... Esta casa no se tocará jamás. Que este oro bendiga a tus hijos.',
                emotionalTone: 'Voz humilde, generosa y fraternal de corazón transformado'
              },
              {
                speakerName: 'Sara',
                speakerId: 'sara_madre_fe',
                dialogueSpanish: 'Que el Dios de Israel te bendiga a ti y a tu casa en Roma, centurión. Vete en paz.',
                emotionalTone: 'Gratitud maternal pura y bendición santa'
              }
            ],
            narration: 'El centurión le entregó su bolsa de oro a la viuda. [PAUSA] El perseguidor se convirtió en el mayor protector de la aldea.',
            onScreenText: 'El Perseguidor Ahora Protege',
            secondaryLabel: 'Corazones Transformados',
            imageToVideoPrompt: 'Clip cinemático de 10 segundos en vertical 9:16: Marcus colocando su pesada bolsa de denarios de oro en las manos de Sara frente a la choza. Los niños sonríen aliviados. Diálogo fluido en español: [00:00-00:05] Marcus: "Perdóname, hermana... Esta casa no se tocará jamás. Que este oro bendiga a tus hijos". [00:05-00:09] Sara responde con dulzura: "Que el Dios de Israel te bendiga a ti y a tu casa en Roma, centurión. Vete en paz". [00:09-00:10] Los niños abrazan a su madre sonriendo.',
            englishPromptWithSpanishDialogue: '10-second continuous cinematic scene in vertical 9:16 (Pixar 3D style): Roman Centurion Marcus placing his heavy leather pouch of gold denarii into the working hands of mother Sara. Her children look on with joyful relief. Dialogue in Latin American Spanish: [00:00-00:05] Marcus speaks with genuine humility: "Perdóname, hermana... Esta casa no se tocará jamás. Que este oro bendiga a tus hijos". [00:05-00:09] Sara blesses him tenderly: "Que el Dios de Israel te bendiga a ti y a tu casa en Roma, centurión. Vete en paz". [00:09-00:10] Children hug their mother tightly. 10s synced lip-sync.',
            sfx: 'Tintineo suave de monedas de oro en bolsa de cuero, risas infantiles de alivio (-10dB)',
            bgMusicMood: 'Melodía triunfante de guitarra y cuerdas llenas de ternura y paz (-18dB)'
          },
          {
            sceneNumber: 5,
            durationSec: 10,
            characterId: 'marcus_centurion',
            secondaryCharacterId: 'jesus_cartoon_3d',
            charactersInShot: ['marcus_centurion', 'jesus_cartoon_3d', 'sara_madre_fe'],
            interactionType: 'plano_conjunto_familiar',
            timeframe: '00:40 - 00:50',
            action: 'Plano final épico: Marcus se quita el casco de bronce romano, alza la mirada al cielo resplandeciente y proclama su fe ante sus tropas, con Jesús a lo lejos bendiciendo el sendero.',
            dialogueExchange: [
              {
                speakerName: 'Centurión Marcus',
                speakerId: 'marcus_centurion',
                dialogueSpanish: '¡Soldados de Roma! ¡Depongan las armas!... ¡Verdaderamente, este Hombre es el Hijo de Dios!',
                emotionalTone: 'Proclamación gloriosa, valiente y triunfante ante todo el valle'
              },
              {
                speakerName: 'Maestro Jesús',
                speakerId: 'jesus_cartoon_3d',
                dialogueSpanish: 'Bienaventurados los que sin ver creyeron. La paz sea con vosotros.',
                emotionalTone: 'Bendición soberana que resuena con gloria eterna'
              }
            ],
            narration: 'Si Dios pudo doblar las rodillas del soldado más temido de Roma, [PAUSA] también puede tocar a ese familiar por quien tanto has orado. Escribe "AMÉN".',
            onScreenText: 'Escribe tu "AMÉN" por tu Familia',
            secondaryLabel: 'COMPARTE ESTA VICTORIA',
            imageToVideoPrompt: 'Clip cinemático de 10 segundos en vertical 9:16: Marcus de pie en la colina con el casco de bronce en la mano proclamando su fe hacia el valle amanecido. A lo lejos Jesús sonríe bendiciendo el camino. Diálogo fluido en español: [00:00-00:05] Marcus con voz potente: "¡Soldados de Roma! ¡Depongan las armas!... ¡Verdaderamente, este Hombre es el Hijo de Dios!". [00:05-00:08] Jesús bendice con sus manos: "Bienaventurados los que sin ver creyeron. La paz sea con vosotros". [00:08-00:10] Texto en pantalla: "ESCRIBE TU AMÉN POR TU FAMILIA".',
            englishPromptWithSpanishDialogue: '10-second continuous cinematic epic finale in vertical 9:16 (Pixar 3D style): Centurion Marcus holding his bronze helmet at his side on a scenic cliff overlooking the Judean valley at dawn, proclaiming his faith. In the soft golden distance, Jesus Christ smiles with open arms. Dialogue in Latin American Spanish: [00:00-00:05] Marcus shouts with absolute conviction: "¡Soldados de Roma! ¡Depongan las armas!... ¡Verdaderamente, este Hombre es el Hijo de Dios!". [00:05-00:08] Jesus radiates peaceful light: "Bienaventurados los que sin ver creyeron. La paz sea con vosotros". [00:08-00:10] Golden title card appears: "ESCRIBE TU AMÉN POR TU FAMILIA". 10s synced lip-sync.',
            sfx: 'Acorde épico de campana de bronce, viento majestuoso sobre el valle (-8dB)',
            bgMusicMood: 'Himno celestial orquestal en crescendo apoteósico'
          }
        ],
        socialPackage: {
          youtubeTitle: '🔴 El centurión que arrojó su espada y proclamó al Rey de Reyes (Parte 2) #MiniserieDeFe',
          facebookTitle: 'Los soldados esperaban ver sangre, pero vieron al comandante llorar de rodillas (Parte 2)',
          caption: 'No hay corazón tan duro que Dios no pueda tocar. Aquel que hoy te persigue puede ser mañana el mayor testimonio de la gracia de Cristo.\n\n👉 ESCRIBE "AMÉN" si estás creyendo por la salvación de tu familia.\n👉 COMPARTE esta historia con quien necesite esperanza hoy.',
          hashtags: ['#MiniserieDeFe', '#Parte2Final', '#CenturionRomano', '#PoderDeDios', '#JesusEsRey', '#FeInquebrantable'],
          pinnedComment: 'Escribe el nombre de ese ser querido por quien estás orando para que Dios transforme su corazón hoy.'
        }
      }
    ]
  },
  {
    id: 'miniserie_ultima_moneda_sara',
    seriesTitle: 'La Última Moneda de Sara',
    logline: 'Una madre viuda tiene que pagar la renta antes de las 6:00 PM o sus hijos serán llevados. Una vasija vacía y un acto de fe ciega desatan el milagro.',
    category: 'milagro_familiar',
    categoryLabel: 'Provisión Sobrenatural & Milagros Financieros',
    totalPartsPlanned: 2,
    bannerHook: '🔴 A LAS 6:00 PM IBAN A QUITARLE A SUS HIJOS • PARTE 1',
    primaryCharacterIds: ['sara_madre_fe', 'mateo_nino_fe', 'jesus_cartoon_3d'],
    episodes: [
      {
        episodeNumber: 1,
        episodeTitle: 'Parte 1: El Frasco Vacío',
        hook: 'Eran las 4:30 de la tarde. El cobrador le dio exactamente 90 minutos para entregar 50 monedas o sus hijos pasarían la noche en custodia.',
        conflict: 'Sara revisa la alacena y solo encuentra una sola moneda de cobre y una vasija de barro con una cucharada de aceite.',
        escalation: 'Su hijo pequeño Mateo la toma de la mano y le dice: "Mamá, la Biblia dice que Dios llena las vasijas vacías... vamos a pedirle vasijas a todos los vecinos".',
        cliffhanger: 'Cuando comenzaron a pedir prestadas todas las ollas de la cuadra, la gente se burló de ellos. Pero a las 5:45 PM, Sara inclinó la vasija casi vacía... y lo que brotó los dejó sin habla. Descubre el milagro en la PARTE 2.',
        scenes: [
          {
            sceneNumber: 1,
            durationSec: 10,
            characterId: 'sara_madre_fe',
            secondaryCharacterId: 'mateo_nino_fe',
            charactersInShot: ['sara_madre_fe', 'mateo_nino_fe'],
            interactionType: 'dos_personajes_frente_a_frente',
            timeframe: '00:00 - 00:10',
            action: 'Sara sentada a la mesa rústica llorando con la cabeza entre las manos; en la mesa hay una sola moneda de cobre y una pequeña jarrita vacía. Mateo la abraza por la espalda consolándola.',
            dialogueExchange: [
              {
                speakerName: 'Sara',
                speakerId: 'sara_madre_fe',
                dialogueSpanish: 'Dios mío... solo nos queda una moneda de cobre y en una hora vienen por mis hijos...',
                emotionalTone: 'Llanto de angustia maternal que quiebra el corazón'
              },
              {
                speakerName: 'Mateo',
                speakerId: 'mateo_nino_fe',
                dialogueSpanish: 'Mamá, no llores... Dios me dijo en sueños que Él nunca nos va a desamparar.',
                emotionalTone: 'Dulzura inocente y firmeza infantil'
              }
            ],
            narration: 'Eran las 4:30 de la tarde. [PAUSA] Solo quedaba una moneda de cobre sobre la mesa.',
            onScreenText: '4:30 PM · La Última Moneda',
            secondaryLabel: '🔴 CUENTA REGRESIVA',
            imageToVideoPrompt: 'Clip cinemático de 10 segundos en vertical 9:16: Sara llora en la mesa de madera mientras Mateo la abraza consolándola. Sobre la mesa reposa una solitaria moneda de cobre y una vasija vacía. Diálogo fluido en español: [00:00-00:04] Sara con lágrimas: "Dios mío... solo nos queda una moneda de cobre y en una hora vienen por mis hijos...". [00:05-00:09] Mateo abrazándola con ternura: "Mamá, no llores... Dios me dijo en sueños que Él nunca nos va a desamparar". [00:09-00:10] Sara acaricia las manos de Mateo con mirada conmovida.',
            englishPromptWithSpanishDialogue: '10-second continuous cinematic shot in vertical 9:16 (Pixar 3D style): Young mother Sara weeping with head in her hands at a rustic wooden table. Beside her, 8yo boy Mateo hugs her shoulders in tender solace. On the table sits a single copper coin and an empty clay jar. Dialogue in Latin American Spanish: [00:00-00:04] Sara weeps: "Dios mío... solo nos queda una moneda de cobre y en una hora vienen por mis hijos...". [00:05-00:09] Mateo comforts her softly: "Mamá, no llores... Dios me dijo en sueños que Él nunca nos va a desamparar". [00:09-00:10] Sara caresses his hands gratefully. 10s synced lip-sync.',
            sfx: 'Tic tac acelerado de reloj, sollozo ahogado de madre, brisa de angustia (-10dB)',
            bgMusicMood: 'Violonchelo melancólico con notas de piano desgarrador (-20dB)'
          },
          {
            sceneNumber: 2,
            durationSec: 10,
            characterId: 'mateo_nino_fe',
            secondaryCharacterId: 'sara_madre_fe',
            charactersInShot: ['mateo_nino_fe', 'sara_madre_fe'],
            interactionType: 'dos_personajes_frente_a_frente',
            timeframe: '00:10 - 00:20',
            action: 'Mateo toma el rostro de su madre entre sus dos manitas y le seca las lágrimas con los pulgares, mirándola con una sonrisa radiante de fe.',
            dialogueExchange: [
              {
                speakerName: 'Mateo',
                speakerId: 'mateo_nino_fe',
                dialogueSpanish: 'Mamá, ¿te acuerdas de la historia de la viuda? Dios llenó todas las vasijas vacías cuando no quedaba nada.',
                emotionalTone: 'Entusiasmo puro y convicción de fe'
              },
              {
                speakerName: 'Sara',
                speakerId: 'sara_madre_fe',
                dialogueSpanish: 'Pero hijito... nuestra jarrita de aceite solo tiene unas cuantas gotas en el fondo...',
                emotionalTone: 'Voz temblorosa de madre abrumada'
              }
            ],
            narration: 'Pero los niños no calculan con las limitaciones humanas; [PAUSA] calculan con el tamaño del Dios vivo.',
            onScreenText: '"Dios no Necesita Mucho"',
            secondaryLabel: 'La Fe de un Niño',
            imageToVideoPrompt: 'Clip cinemático de 10 segundos en vertical 9:16: Mateo secando con sus pulgares las lágrimas de Sara, sonriéndole con esperanza radiante. Diálogo fluido en español: [00:00-00:05] Mateo: "Mamá, ¿te acuerdas de la historia de la viuda? Dios llenó todas las vasijas vacías cuando no quedaba nada". [00:05-00:09] Sara mirando la jarrita: "Pero hijito... nuestra jarrita de aceite solo tiene unas cuantas gotas en el fondo...". [00:09-00:10] Mateo toma la mano de su madre con decisión.',
            englishPromptWithSpanishDialogue: '10-second continuous cinematic shot in vertical 9:16 (Pixar 3D style): Little boy Mateo wiping the wet cheeks of his mother Sara with his thumbs, smiling with vibrant faith. Dialogue in Latin American Spanish: [00:00-00:05] Mateo speaks eagerly: "Mamá, ¿te acuerdas de la historia de la viuda? Dios llenó todas las vasijas vacías cuando no quedaba nada". [00:05-00:09] Sara responds with trembling lips: "Pero hijito... nuestra jarrita de aceite solo tiene unas cuantas gotas en el fondo...". [00:09-00:10] Mateo holds her hand firmly. 10s synced lip-sync.',
            sfx: 'Suspiro de amor maternal, brisa suave que entra por la ventana (-12dB)',
            bgMusicMood: 'Acorde de piano luminoso que comienza a disipar la tristeza (-18dB)'
          },
          {
            sceneNumber: 3,
            durationSec: 10,
            characterId: 'mateo_nino_fe',
            secondaryCharacterId: 'sara_madre_fe',
            charactersInShot: ['mateo_nino_fe', 'sara_madre_fe'],
            interactionType: 'dos_personajes_frente_a_frente',
            timeframe: '00:20 - 00:30',
            action: 'Mateo entra corriendo por la puerta cargando un montón de vasijas y ollas de barro prestadas de los vecinos, colocándolas apiladas en la mesa con alegría desbordante.',
            dialogueExchange: [
              {
                speakerName: 'Mateo',
                speakerId: 'mateo_nino_fe',
                dialogueSpanish: '¡Mamá, mira! ¡Doña Carmen y don José nos prestaron todas las vasijas y ollas que tenían!',
                emotionalTone: 'Entusiasmo puro y agitación alegre'
              },
              {
                speakerName: 'Sara',
                speakerId: 'sara_madre_fe',
                dialogueSpanish: '¡Hijo, son demasiadas vasijas!... ¿De verdad crees que Dios las va a llenar todas?',
                emotionalTone: 'Asombro que comienza a creer en lo imposible'
              }
            ],
            narration: 'Mateo corrió con los vecinos y trajo cada vasija vacía que encontró.',
            onScreenText: 'Pidan Vasijas Prestadas',
            secondaryLabel: '2 Reyes 4',
            imageToVideoPrompt: 'Clip cinemático de 10 segundos en vertical 9:16: Mateo entrando apresurado a la cocina cargando ollas y vasijas de cerámica de todos los tamaños, acomodándolas en la mesa rústica. Diálogo fluido en español: [00:00-00:05] Mateo jadeando contento: "¡Mamá, mira! ¡Doña Carmen y don José nos prestaron todas las vasijas y ollas que tenían!". [00:05-00:09] Sara con las manos en el pecho: "¡Hijo, son demasiadas vasijas!... ¿De verdad crees que Dios las va a llenar todas?". [00:09-00:10] Mateo asiente con una sonrisa victoriosa.',
            englishPromptWithSpanishDialogue: '10-second continuous cinematic shot in vertical 9:16 (Pixar 3D style): Little boy Mateo running into the rustic kitchen carrying an armful of assorted ceramic and clay pots borrowed from neighbors, stacking them on the table. Dialogue in Latin American Spanish: [00:00-00:05] Mateo announces joyfully: "¡Mamá, mira! ¡Doña Carmen y don José nos prestaron todas las vasijas y ollas que tenían!". [00:05-00:09] Sara gasps with hands on chest: "¡Hijo, son demasiadas vasijas!... ¿De verdad crees que Dios las va a llenar todas?". [00:09-00:10] Mateo nods with determined faith. 10s synced lip-sync.',
            sfx: 'Pasos rápidos corriendo, tintineo de barro y cerámica al posarse en la mesa (-10dB)',
            bgMusicMood: 'Ritmo esperanzador y dinámico con guitarra acústica y cuerdas ligeras (-18dB)'
          },
          {
            sceneNumber: 4,
            durationSec: 10,
            characterId: 'sara_madre_fe',
            secondaryCharacterId: 'jesus_cartoon_3d',
            charactersInShot: ['sara_madre_fe', 'mateo_nino_fe', 'jesus_cartoon_3d'],
            interactionType: 'encuentro_con_jesus',
            timeframe: '00:30 - 00:40',
            action: 'Sara y Mateo inclinan la pequeña jarrita casi vacía sobre una vasija gigante; la mano luminosa de Jesús se posa sobre la de Sara y de la jarrita brota un río abundante de aceite dorado resplandeciente.',
            dialogueExchange: [
              {
                speakerName: 'Sara',
                speakerId: 'sara_madre_fe',
                dialogueSpanish: 'Señor Jesús, en tu santo nombre inclino esta última jarrita... ¡Hágase tu milagro!',
                emotionalTone: 'Oración de fe temblorosa pero decidida'
              },
              {
                speakerName: 'Mateo',
                speakerId: 'mateo_nino_fe',
                dialogueSpanish: '¡Mira, mamá!... ¡El chorro de aceite dorado no se detiene!... ¡Ya llenó la primera olla!',
                emotionalTone: 'Grito de éxtasis milagroso'
              }
            ],
            narration: 'Cerraron la puerta. [PAUSA] Y cuando Sara inclinó la pequeña jarrita, un milagro empezó a correr como río.',
            onScreenText: 'El Aceite que no se Acaba',
            secondaryLabel: 'El Milagro de las 5:45 PM',
            imageToVideoPrompt: 'Clip cinemático de 10 segundos en vertical 9:16: Sara y Mateo inclinando la jarrita pequeña sobre una vasija grande, con la mano celestial de Jesús guiando la muñeca de Sara. De la vasija brota un chorro dorado continuo que llena las ollas una tras otra. Diálogo fluido en español: [00:00-00:05] Sara orando con ojos devotos: "Señor Jesús, en tu santo nombre inclino esta última jarrita... ¡Hágase tu milagro!". [00:05-00:09] Mateo saltando deslumbrado: "¡Mira, mamá!... ¡El chorro de aceite dorado no se detiene!... ¡Ya llenó la primera olla!". [00:09-00:10] La luz dorada del aceite baña toda la cocina.',
            englishPromptWithSpanishDialogue: '10-second continuous miraculous shot in vertical 9:16 (Pixar 3D style): Mother Sara and young Mateo tilting the tiny clay jar over a huge clay vessel. A radiant celestial hand of Jesus gently rests over the wrist of Sara. An impossible, shimmering stream of golden liquid oil flows continuously, filling the vessels to overflowing. Dialogue in Latin American Spanish: [00:00-00:05] Sara prays devoutly: "Señor Jesús, en tu santo nombre inclino esta última jarrita... ¡Hágase tu milagro!". [00:05-00:09] Mateo gasps in pure wonder: "¡Mira, mamá!... ¡El chorro de aceite dorado no se detiene!... ¡Ya llenó la primera olla!". [00:09-00:10] Warm golden glow illuminates the kitchen. 10s synced lip-sync.',
            sfx: 'Sonido continuo de líquido espeso y abundante vertiéndose en la vasija, campana celestial (-10dB)',
            bgMusicMood: 'Crescendo épico de asombro y milagro divino en coro y cuerdas (-16dB)'
          },
          {
            sceneNumber: 5,
            durationSec: 10,
            characterId: 'sara_madre_fe',
            secondaryCharacterId: 'mateo_nino_fe',
            charactersInShot: ['sara_madre_fe', 'mateo_nino_fe'],
            interactionType: 'reaccion_asombro',
            timeframe: '00:40 - 00:50',
            action: 'Todas las vasijas de la cocina están repletas de aceite de oliva dorado hasta el borde; dan las 5:59 PM y tres golpes violentos retumban en la puerta.',
            dialogueExchange: [
              {
                speakerName: 'Mateo',
                speakerId: 'mateo_nino_fe',
                dialogueSpanish: '¡Mamá!... ¡Son las 5:59 PM y el cobrador está golpeando la puerta con furia!',
                emotionalTone: 'Tensión máxima pero con sonrisa de victoria segura'
              },
              {
                speakerName: 'Sara',
                speakerId: 'sara_madre_fe',
                dialogueSpanish: 'No temas, mi niño... Abre la puerta con calma, porque el Señor ya preparó la mesa.',
                emotionalTone: 'Paz inquebrantable y serenidad absoluta'
              }
            ],
            narration: 'Eran las 5:59 PM. [PAUSA] El cobrador golpeó la puerta... pero lo que encontró adentro lo dejó helado.',
            onScreenText: '5:59 PM · Tocan a la Puerta',
            secondaryLabel: 'CONTINÚA EN PARTE 2 (FINAL)',
            imageToVideoPrompt: 'Clip cinemático de 10 segundos en vertical 9:16 de clímax y suspense: La cocina repleta de vasijas llenas de aceite resplandeciente. De pronto tres golpes fuertes sacuden la puerta. Diálogo fluido en español: [00:00-00:04] Mateo con ojos muy abiertos: "¡Mamá!... ¡Son las 5:59 PM y el cobrador está golpeando la puerta con furia!". [00:05-00:08] Sara toma su mano con paz celestial: "No temas, mi niño... Abre la puerta con calma, porque el Señor ya preparó la mesa". [00:08-00:10] La puerta vibra por los golpes y aparece "PARTE 2 MAÑANA 7:00 PM".',
            englishPromptWithSpanishDialogue: '10-second continuous cliffhanger shot in vertical 9:16 (Pixar 3D style): The entire rustic kitchen table and floor filled with overflowing ceramic vessels of glowing golden oil. Three heavy threatening knocks slam onto the wooden door. Dialogue in Latin American Spanish: [00:00-00:04] Mateo turns to the door with wide eyes: "¡Mamá!... ¡Son las 5:59 PM y el cobrador está golpeando la puerta con furia!". [00:05-00:08] Sara smiles with supreme unshakeable peace: "No temas, mi niño... Abre la puerta con calma, porque el Señor ya preparó la mesa". [00:08-00:10] Dramatic text appears: "PARTE 2 MAÑANA 7:00 PM". 10s synced lip-sync.',
            sfx: 'Golpes secos y duros en la puerta, latido grave de suspenso orquestal (-8dB)',
            bgMusicMood: 'Corte súbito de suspenso épico que te deja con la boca abierta'
          }
        ],
        socialPackage: {
          youtubeTitle: '🔴 Tenía una sola moneda y 60 minutos para salvar a sus hijos (Parte 1) #MiniserieDeFe',
          facebookTitle: 'Iban a quitárselos a las 6:00 PM... pero lo que pasó a las 5:45 PM fue un milagro de Dios (Parte 1)',
          caption: '¿Estás pasando por una crisis económica y sientes que no hay salida? Recuerda: cuando se acaban tus recursos, empiezan los recursos del cielo.\n\n👉 COMENTA "PARTE 2" para notificarte el gran final.\n👉 COMPARTE con quien necesite provisión hoy.',
          hashtags: ['#MiniserieDeFe', '#MilagroFinanciero', '#DiosProvee', '#FeInquebrantable', '#ProvidenciaDivina'],
          pinnedComment: 'Escribe "PARTE 2" para que no te pierdas el desenlace del milagro de las vasijas de Sara y Mateo.'
        }
      },
      {
        episodeNumber: 2,
        episodeTitle: 'Parte 2: La Casa Llena de Bendición',
        hook: 'El cobrador entró con los papeles de embargo listos. Pero cuando abrió la puerta y vio la cocina inundada de vasijas de aceite puro de primera calidad... su expresión cambió para siempre.',
        conflict: 'El cobrador no solo no se llevó a los niños, sino que compró todo el aceite en el acto para el mercado de la ciudad.',
        escalation: 'Sara no solo pagó la deuda completa; le sobró dinero para asegurar la comida y los estudios de sus hijos por cinco años.',
        cliffhanger: 'Dios no solo te saca del hoyo, te sienta a la mesa del banquete. Si crees que Dios suplirá para tu casa conforme a sus riquezas en gloria, escribe tu Amén y comparte esta serie.',
        scenes: [
          {
            sceneNumber: 1,
            durationSec: 10,
            characterId: 'sara_madre_fe',
            secondaryCharacterId: 'mateo_nino_fe',
            charactersInShot: ['sara_madre_fe', 'mateo_nino_fe'],
            interactionType: 'dos_personajes_frente_a_frente',
            timeframe: '00:00 - 00:10',
            action: 'Sara abre la puerta con dignidad y calma soberana; el cobrador entra arrogante con el pergamino de embargo, pero se detiene en seco al oler el aroma a olivo puro y ver las decenas de vasijas.',
            dialogueExchange: [
              {
                speakerName: 'Sara',
                speakerId: 'sara_madre_fe',
                dialogueSpanish: 'Pase adelante, señor cobrador. Mi Dios acaba de pagar hasta el último centavo de la deuda.',
                emotionalTone: 'Paz inquebrantable, voz serena y victoriosa'
              },
              {
                speakerName: 'Cobrador de Deudas',
                speakerId: 'cobrador_deudas',
                dialogueSpanish: '¡Por todos los cielos!... ¿De dónde sacó una viuda tantas vasijas de aceite de oliva puro?',
                emotionalTone: 'Perplejidad absoluta y ojos desorbitados'
              }
            ],
            narration: 'A las 6:00 en punto, el cobrador empujó la puerta. [PAUSA] Venía a destruir, pero Dios ya había preparado la mesa.',
            onScreenText: '6:00 PM · La Deuda Cancelada',
            secondaryLabel: '🔴 CAPÍTULO FINAL',
            imageToVideoPrompt: 'Clip cinemático de 10 segundos en vertical 9:16: Sara abre la puerta con dignidad ante el cobrador con ropas ricas y pergamino de desalojo. El cobrador se queda pasmado viendo las vasijas de aceite dorado rebosantes. Diálogo fluido en español: [00:00-00:05] Sara con serenidad: "Pase adelante, señor cobrador. Mi Dios acaba de pagar hasta el último centavo de la deuda". [00:05-00:09] Cobrador atónito: "¡Por todos los cielos!... ¿De dónde sacó una viuda tantas vasijas de aceite de oliva puro?". [00:09-00:10] Mateo sonríe pícaramente al lado de su madre.',
            englishPromptWithSpanishDialogue: '10-second continuous cinematic shot in vertical 9:16 (Pixar 3D style): Mother Sara calmly opens the wooden door before the haughty debt collector holding an eviction scroll. The collector freezes in utter disbelief, mesmerized by dozens of glowing jars of fragrant golden oil. Dialogue in Latin American Spanish: [00:00-00:05] Sara greets him with calm victory: "Pase adelante, señor cobrador. Mi Dios acaba de pagar hasta el último centavo de la deuda". [00:05-00:09] Debt collector stammers in amazement: "¡Por todos los cielos!... ¿De dónde sacó una viuda tantas vasijas de aceite de oliva puro?". [00:09-00:10] Little Mateo smirks playfully beside his mother. 10s synced lip-sync.',
            sfx: 'Crujido de puerta abriéndose, suspiro atónito del cobrador, aroma de olivo imaginario (-10dB)',
            bgMusicMood: 'Acorde noble de piano y cuerdas que refleja victoria de la fe (-18dB)'
          },
          {
            sceneNumber: 2,
            durationSec: 10,
            characterId: 'sara_madre_fe',
            secondaryCharacterId: 'mateo_nino_fe',
            charactersInShot: ['sara_madre_fe', 'mateo_nino_fe'],
            interactionType: 'dos_personajes_frente_a_frente',
            timeframe: '00:10 - 00:20',
            action: 'El cobrador sumerge un dedo en el aceite dorado y lo prueba maravillado; rasga en dos el pergamino de embargo frente a ellos.',
            dialogueExchange: [
              {
                speakerName: 'Mateo',
                speakerId: 'mateo_nino_fe',
                dialogueSpanish: '¡El mejor aceite de la provincia, señor! ¡Dios no hace milagros a medias!',
                emotionalTone: 'Risas traviesas de niño triunfante'
              },
              {
                speakerName: 'Cobrador de Deudas',
                speakerId: 'cobrador_deudas',
                dialogueSpanish: 'Es el aceite más puro que he visto en mi vida... Rompo la orden de desalojo en este instante.',
                emotionalTone: 'Admiración profunda y alivio sincero'
              }
            ],
            narration: '"Este es el aceite de oliva más puro que he visto en mi vida", [PAUSA] dijo el cobrador, rompiendo la orden de desalojo.',
            onScreenText: 'El Papel de Embargo Roto',
            secondaryLabel: 'La Deuda se Rompe',
            imageToVideoPrompt: 'Clip cinemático de 10 segundos en vertical 9:16: El cobrador rasga el pergamino de desalojo en dos pedazos frente a Sara y Mateo. Diálogo fluido en español: [00:00-00:04] Mateo riendo: "¡El mejor aceite de la provincia, señor! ¡Dios no hace milagros a medias!". [00:05-00:09] Cobrador rasgando el papel: "Es el aceite más puro que he visto en mi vida... Rompo la orden de desalojo en este instante". [00:09-00:10] Los trozos de pergamino caen al suelo de madera.',
            englishPromptWithSpanishDialogue: '10-second continuous cinematic shot in vertical 9:16 (Pixar 3D style): The debt collector tests a droplet of golden oil on his tongue, his harsh eyes widening into delight. He vigorously tears the eviction scroll into two pieces before Sara and Mateo. Dialogue in Latin American Spanish: [00:00-00:04] Mateo giggles proudly: "¡El mejor aceite de la provincia, señor! ¡Dios no hace milagros a medias!". [00:05-00:09] Collector smiles tearing the document: "Es el aceite más puro que he visto en mi vida... Rompo la orden de desalojo en este instante". [00:09-00:10] Torn parchment pieces flutter to the floor. 10s synced lip-sync.',
            sfx: 'Rasgado nítido de pergamino en dos pedazos, risa jubilosa de niño, tintineo (-8dB)',
            bgMusicMood: 'Música festiva acústica con guitarra rítmica y violín alegre (-18dB)'
          },
          {
            sceneNumber: 3,
            durationSec: 10,
            characterId: 'sara_madre_fe',
            secondaryCharacterId: 'mateo_nino_fe',
            charactersInShot: ['sara_madre_fe', 'mateo_nino_fe'],
            interactionType: 'dos_personajes_frente_a_frente',
            timeframe: '00:20 - 00:30',
            action: 'El cobrador saca una pesada bolsa de monedas de plata pura y se la entrega a Sara en la mesa para comprar todo el cargamento de aceite.',
            dialogueExchange: [
              {
                speakerName: 'Cobrador de Deudas',
                speakerId: 'cobrador_deudas',
                dialogueSpanish: 'Te compro todo el cargamento por cincuenta monedas de plata. Tienes para vivir en paz por años.',
                emotionalTone: 'Negocio justo y respeto renovado'
              },
              {
                speakerName: 'Sara',
                speakerId: 'sara_madre_fe',
                dialogueSpanish: '¡Gracias, Señor mío!... De una sola monedita hiciste sobreabundancia para toda la vida.',
                emotionalTone: 'Lágrimas santas de gratitud desbordada y llanto de gozo'
              }
            ],
            narration: 'El cobrador compró todo el aceite en el acto. [PAUSA] Sara no solo pagó la deuda; le sobró para vivir con sus hijos con holgura.',
            onScreenText: 'Provisión para Toda la Vida',
            secondaryLabel: 'Filipenses 4:19',
            imageToVideoPrompt: 'Clip cinemático de 10 segundos en vertical 9:16: Sara recibe la bolsa pesada de monedas de plata sobre la mesa y besa la frente de su hijo Mateo con lágrimas de felicidad pura. Diálogo fluido en español: [00:00-00:05] Cobrador entregando las monedas: "Te compro todo el cargamento por cincuenta monedas de plata. Tienes para vivir en paz por años". [00:05-00:09] Sara besando a su hijo: "¡Gracias, Señor mío!... De una sola monedita hiciste sobreabundancia para toda la vida". [00:09-00:10] Resplandor cálido del atardecer.',
            englishPromptWithSpanishDialogue: '10-second continuous cinematic shot in vertical 9:16 (Pixar 3D style): The debt collector places a heavy linen pouch of silver coins onto the table. Sara clutches the coins and lovingly kisses little Mateo on the forehead with tears of boundless relief. Dialogue in Latin American Spanish: [00:00-00:05] Collector speaks respectfully: "Te compro todo el cargamento por cincuenta monedas de plata. Tienes para vivir en paz por años". [00:05-00:09] Sara weeps tears of holy joy: "¡Gracias, Señor mío!... De una sola monedita hiciste sobreabundancia para toda la vida". [00:09-00:10] Warm sunset light floods the room. 10s synced lip-sync.',
            sfx: 'Tintineo alegre de monedas de plata en bolsa de lino, sollozo de gozo maternal (-10dB)',
            bgMusicMood: 'Cuerdas orquestales y coros cálidos de bendición sobreabundante (-16dB)'
          },
          {
            sceneNumber: 4,
            durationSec: 10,
            characterId: 'jesus_cartoon_3d',
            secondaryCharacterId: 'mateo_nino_fe',
            charactersInShot: ['jesus_cartoon_3d', 'sara_madre_fe', 'mateo_nino_fe'],
            interactionType: 'encuentro_con_jesus',
            timeframe: '00:30 - 00:40',
            action: 'Sara y Mateo salen a la calle a devolver las vasijas a sus vecinos; en cada vasija devuelta colocan una moneda de plata como regalo de bendición para ellos.',
            dialogueExchange: [
              {
                speakerName: 'Mateo',
                speakerId: 'mateo_nino_fe',
                dialogueSpanish: '¡Doña Carmen! ¡Aquí tiene su vasija de vuelta y dos monedas de plata de bendición para su casa!',
                emotionalTone: 'Generosidad desbordante y risas alegres'
              },
              {
                speakerName: 'Vecina Carmen',
                speakerId: 'vecina_carmen',
                dialogueSpanish: '¡Que Dios los colme de gracia!... ¡La fe de este hogar iluminó a toda la aldea hoy!',
                emotionalTone: 'Abrazo emocionado y bendición recíproca'
              }
            ],
            narration: 'Y Sara hizo algo más: [PAUSA] devolvió cada vasija a sus vecinos con una moneda de plata adentro, bendiciendo a toda la aldea.',
            onScreenText: 'La Bendición que se Multiplica',
            secondaryLabel: 'Generosidad de Fe',
            imageToVideoPrompt: 'Clip cinemático de 10 segundos en vertical 9:16: Mateo y Sara en la calle empedrada al atardecer devolviendo vasijas a los vecinos ancianos sonrientes y entregándoles monedas de plata. Diálogo fluido en español: [00:00-00:04] Mateo sonriendo: "¡Doña Carmen! ¡Aquí tiene su vasija de vuelta y dos monedas de plata de bendición para su casa!". [00:05-00:09] Vecina anciana conmovida: "¡Que Dios los colme de gracia!... ¡La fe de este hogar iluminó a toda la aldea hoy!". [00:09-00:10] A lo lejos la silueta dorada de Jesús sonríe complacida.',
            englishPromptWithSpanishDialogue: '10-second continuous cinematic community scene in vertical 9:16 (Pixar 3D style): Mother Sara and little Mateo walking along the cobblestone village street at golden sunset, returning clean clay pots to smiling elderly neighbors with silver coins tucked inside. Dialogue in Latin American Spanish: [00:00-00:04] Mateo presents a pot happily: "¡Doña Carmen! ¡Aquí tiene su vasija de vuelta y dos monedas de plata de bendición para su casa!". [00:05-00:09] The elderly neighbor woman embraces them: "¡Que Dios los colme de gracia!... ¡La fe de este hogar iluminó a toda la aldea hoy!". [00:09-00:10] The silhouette of Jesus watches from the hill with a proud smile. 10s synced lip-sync.',
            sfx: 'Risas de vecinos, bendiciones mutuas y murmullo alegre de aldea (-10dB)',
            bgMusicMood: 'Música festiva y conmovedora en crescendo de alabanza (-16dB)'
          },
          {
            sceneNumber: 5,
            durationSec: 10,
            characterId: 'jesus_cartoon_3d',
            secondaryCharacterId: 'sara_madre_fe',
            charactersInShot: ['jesus_cartoon_3d', 'sara_madre_fe', 'mateo_nino_fe'],
            interactionType: 'plano_conjunto_familiar',
            timeframe: '00:40 - 00:50',
            action: 'Plano final glorioso: Sara y Mateo sentados en el porche al atardecer bajo un cielo púrpura y dorado, con Jesús extendiendo sus manos sobre ellos en bendición eterna.',
            dialogueExchange: [
              {
                speakerName: 'Maestro Jesús',
                speakerId: 'jesus_cartoon_3d',
                dialogueSpanish: 'Mi Dios suplirá todo lo que os falta conforme a sus riquezas en gloria. Confiad en mí.',
                emotionalTone: 'Promesa viva que consuela al necesitado'
              },
              {
                speakerName: 'Sara y Mateo',
                speakerId: 'sara_madre_fe',
                dialogueSpanish: '¡Creemos en ti, Señor!... ¡Escribe DIOS PROVEERÁ si tú también lo crees hoy!',
                emotionalTone: 'Proclamación familiar jubilosa'
              }
            ],
            narration: 'Si estás esperando una puerta abierta en tu economía, [PAUSA] Dios no ha terminado contigo. Escribe "DIOS PROVEERÁ" y comparte esta serie.',
            onScreenText: 'Escribe "DIOS PROVEERÁ" en los Comentarios',
            secondaryLabel: 'COMPARTE ESTE MILAGRO',
            imageToVideoPrompt: 'Clip cinemático de 10 segundos en vertical 9:16: Sara y Mateo abrazados en el porche frente a un cielo crepuscular púrpura y dorado, con Jesús extendiendo sus manos en bendición. Diálogo fluido en español: [00:00-00:05] Jesús con voz tierna y majestuosa: "Mi Dios suplirá todo lo que os falta conforme a sus riquezas en gloria. Confiad en mí". [00:05-00:08] Sara y Mateo: "¡Creemos en ti, Señor!... ¡Escribe DIOS PROVEERÁ si tú también lo crees hoy!". [00:08-00:10] Texto en pantalla: "ESCRIBE DIOS PROVEERÁ Y COMPARTE".',
            englishPromptWithSpanishDialogue: '10-second continuous cinematic grand finale shot in vertical 9:16 (Pixar 3D style): Mother Sara and little boy Mateo resting peacefully on their porch against a majestic purple and gold twilight sky. A celestial vision of Jesus Christ extends gentle hands of blessing from above. Dialogue in Latin American Spanish: [00:00-00:05] Jesus speaks in warm celestial comfort: "Mi Dios suplirá todo lo que os falta conforme a sus riquezas en gloria. Confiad en mí". [00:05-00:08] Sara and Mateo smile to camera: "¡Creemos en ti, Señor!... ¡Escribe DIOS PROVEERÁ si tú también lo crees hoy!". [00:08-00:10] Title card appears: "ESCRIBE DIOS PROVEERÁ Y COMPARTE". 10s synced lip-sync.',
            sfx: 'Campanadas doradas suaves y brisa de atardecer pacífica (-10dB)',
            bgMusicMood: 'Melodía triunfante y sublime en piano de cola y cuerdas angelicales'
          }
        ],
        socialPackage: {
          youtubeTitle: '🔴 Cuando solo quedaba una moneda de cobre... ocurrió esto (Gran Final) #MiniserieDeFe',
          facebookTitle: 'El cobrador venía a quitarle a sus hijos, pero salió comprando todo el aceite (Gran Final)',
          caption: '¿Crees que Dios puede hacer un milagro en tu economía esta semana? La historia de Sara y Mateo nos demuestra que la fe de un niño y la perseverancia de una madre mueven el trono de la gracia.\n\n👉 COMENTA "DIOS PROVEERÁ" si estás creyendo por un milagro hoy.\n👉 COMPARTE esta bendición con alguien que esté pasando por escasez.',
          hashtags: ['#MiniserieDeFe', '#GranFinal', '#DiosProveerá', '#MilagroEconomico', '#FeDeUnNiño', '#JesusProvee'],
          pinnedComment: 'Escribe tu petición de trabajo o provisión aquí abajo. ¡Vamos a orar juntos por tu milagro económico!'
        }
      }
    ]
  }
];

export function getFullSeriesById(seriesId: string): MiniserieTemplate | undefined {
  return MINISERIES_TEMPLATES_FE.find(s => s.id === seriesId);
}
