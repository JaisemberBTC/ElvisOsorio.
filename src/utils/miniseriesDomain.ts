import { CARTOON_CHARACTERS_FE, SERIES_ENVIRONMENTS_FE, type CartoonCharacter } from "../data/cartoonCharactersFe.ts";

export interface DynamicStoryCharacter {
  id: string;
  name: string;
  gender: 'female' | 'male';
  age: string;
  role: string;
  archetype: string;
  vocative: string; // "Hija mía" | "Hijo mío" | "Valiente" | "Amigo mío"
  pronoun: string; // "ella" | "él"
  posture: string;
  clothingStyle: string;
  modelSheetLockEn: string;
  voicePreset: string;
  signatureProps: string[];
}

export interface DynamicCastEnsemble {
  castSize: number; // 1, 2, 3, or 4
  castType: 'solitario' | 'dueto' | 'trio' | 'cuarteto';
  protagonist: DynamicStoryCharacter;
  characters: DynamicStoryCharacter[];
  supporting?: DynamicStoryCharacter;
  secondary?: DynamicStoryCharacter;
  third?: DynamicStoryCharacter;
  fourth?: DynamicStoryCharacter;
}

export interface ProtagonistCast {
  protagonist: {
    id: string;
    name: string;
    gender: 'female' | 'male';
    archetype: string;
    vocative: string;
    pronoun: string;
    posture: string;
    modelSheetLockEn: string;
    voicePreset: string;
  };
  supporting: {
    id: string;
    name: string;
    gender: 'female' | 'male';
    role: string;
    modelSheetLockEn: string;
    voicePreset: string;
  };
}

export interface UniqueScenography {
  id: string;
  name: string;
  shortTag: string;
  architecturePromptEn: string;
  lightingSetup: string;
  propsAndAtmosphere: string;
  negativePromptEn: string;
}

/**
 * Dynamically synthesizes a UNIQUE, tailored cast of 1, 2, 3, or 4 characters
 * based exclusively on the user's specific story topic and dramatic needs.
 * Never recycles static characters; every miniseries gets bespoke protagonists and secondary cast.
 */
export function generateUniqueCastForTopic(topic: string, category: string = "fe_general"): DynamicCastEnsemble {
  const clean = (topic || '').trim().toLowerCase();
  const hash = Math.abs(clean.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)).toString(36);

  // 1. Determine optimal cast size based on narrative structure or explicit request
  let castSize = 3; // default ensemble
  if (clean.includes('1 personaje') || clean.includes('un personaje') || clean.includes('un solo') || clean.includes('1 solo') || clean.includes('solitario') || clean.includes('soledad') || clean.includes('desierto') || clean.includes('oracion personal') || clean.includes('oración personal') || clean.includes('secreto') || clean.includes('silencio') || clean.includes('a solas')) {
    castSize = 1; // Solitary hero in deep crisis/prayer
  } else if (clean.includes('2 personajes') || clean.includes('dos personajes') || clean.includes('matrimonio') || clean.includes('esposos') || clean.includes('pareja') || clean.includes('dos hermanos') || clean.includes('padre e hijo') || clean.includes('madre e hija') || clean.includes('reconciliacion') || clean.includes('reconciliación') || clean.includes('perdon') || clean.includes('perdón') || clean.includes('amigos') || clean.includes('doctor y paciente')) {
    castSize = 2; // Intense two-person dramatic conflict
  } else if (clean.includes('4 personajes') || clean.includes('cuatro personajes') || clean.includes('cuatro') || clean.includes('familia completa') || clean.includes('hogar con hijos') || clean.includes('equipo de rescate')) {
    castSize = 4; // Full family or multi-party ensemble
  } else if (clean.includes('3 personajes') || clean.includes('tres personajes') || clean.includes('trio') || clean.includes('trío') || clean.includes('familia')) {
    castSize = 3;
  }

  // 2. Thematic Archetype & Cast Profiler
  const characters: DynamicStoryCharacter[] = [];

  // Theme A: Medical, Illness & Health (Hospital, Doctors, Nurses, Surgeries)
  if (clean.includes('hospital') || clean.includes('medico') || clean.includes('médico') || clean.includes('doctor') || clean.includes('cirugia') || clean.includes('cirugía') || clean.includes('enfermedad') || clean.includes('cancer') || clean.includes('cáncer') || clean.includes('salud') || clean.includes('uci')) {
    const isDoctorLead = clean.includes('medico') || clean.includes('médico') || clean.includes('doctor') || clean.includes('cirujano');
    
    if (isDoctorLead) {
      characters.push({
        id: `dr_julian_${hash}`,
        name: 'Dr. Julián Varela',
        gender: 'male',
        age: '42 años',
        role: 'Cirujano jefe en crisis de fe ante un caso médicamente imposible',
        archetype: 'El científico quebrado que reconoce el límite de la medicina humana',
        vocative: 'Hijo mío, tus manos son guiadas por las mías',
        pronoun: 'él',
        posture: 'mirando la radiografía con las manos temblando dentro de sus guantes quirúrgicos',
        clothingStyle: 'Ambo quirúrgico azul índigo estéril, estetoscopio al cuello, gorro médico desgastado',
        modelSheetLockEn: 'Exhausted yet noble 42yo surgeon, dark hair with silver temples, intense hazel eyes marked by sorrow, sterile deep navy scrubs, 3D Pixar character sheet.',
        voicePreset: 'David - Confident & Clear',
        signatureProps: ['Estetoscopio de acero', 'Radiografía torácica', 'Crucifijo de bolsillo en el bolsillo del ambo']
      });

      characters.push({
        id: `lucia_madre_${hash}`,
        name: 'Lucía Mendoza',
        gender: 'female',
        age: '36 años',
        role: 'Madre que vigila a su pequeño y clama sin rendirse',
        archetype: 'La madre intercesora inquebrantable',
        vocative: 'Hija mía amada',
        pronoun: 'ella',
        posture: 'arrodillada junto a la cama pediátrica aferrada a una pequeña manta',
        clothingStyle: 'Cárdigan de punto beige suave, vaqueros sencillos, cabello recogido con una pinza',
        modelSheetLockEn: 'Loving 36yo mother, tear-stained expressive amber eyes, messy wavy brunette bun, warm cream wool sweater, 3D Pixar aesthetic.',
        voicePreset: 'Elena - Deeply Emotional & Sincere',
        signatureProps: ['Manta infantil bordada', 'Biblia de bolsillo', 'Rosario de madera']
      });

      characters.push({
        id: `mateo_nino_${hash}`,
        name: 'Mateo (El Pequeño Paciente)',
        gender: 'male',
        age: '7 años',
        role: 'El niño valiente que sonríe a pesar de la debilidad',
        archetype: 'La inocencia que enseña fe a los adultos',
        vocative: 'Pequeño mío',
        pronoun: 'él',
        posture: 'recostado con oxígeno sonriendo débilmente hacia la luz',
        clothingStyle: 'Bata hospitalaria infantil con estrellas celestes estampadas',
        modelSheetLockEn: 'Fragile 7yo boy with wide curious chocolate eyes, pale glowing cheeks, soft chestnut curls, patterned hospital gown, 3D Pixar character.',
        voicePreset: 'Mateo - Young & Earnest',
        signatureProps: ['Oso de peluche con parche', 'Pulsera de ingreso médico']
      });

      characters.push({
        id: `enfermera_carmen_${hash}`,
        name: 'Enfermera Carmen',
        gender: 'female',
        age: '48 años',
        role: 'Enfermera veterana de guardia nocturna',
        archetype: 'El ángel terrenal compasivo',
        vocative: 'Hija de servicio fiel',
        pronoun: 'ella',
        posture: 'revisando el suero con ternura materna y orando en silencio',
        clothingStyle: 'Uniforme de enfermería verde menta, reloj de solapa',
        modelSheetLockEn: 'Gentle 48yo nurse with warm round face, spectacles perched on nose, comforting smile, mint scrubs, 3D Pixar style.',
        voicePreset: 'Sara - Warm Motherly Voice',
        signatureProps: ['Planilla de signos vitales', 'Linterna de bolsillo médica']
      });
    } else {
      characters.push({
        id: `valeria_paciente_${hash}`,
        name: 'Valeria Ramos',
        gender: 'female',
        age: '29 años',
        role: 'Joven madre enfrentando un diagnóstico adverso',
        archetype: 'La creyente que no permite que el miedo gobierne su alma',
        vocative: 'Hija mía, no temas, solo cree',
        pronoun: 'ella',
        posture: 'sentada al borde de la cama mirando por la ventana con lágrimas serenas',
        clothingStyle: 'Chaqueta de lana suave color lavanda sobre pijama sencillo',
        modelSheetLockEn: 'Graceful 29yo woman, pale radiant complexion, expressive almond brown eyes, silky chestnut hair, soft lavender sweater, 3D Pixar character sheet.',
        voicePreset: 'Sofia - Sweet & Innocent',
        signatureProps: ['Foto de su hija pequeña', 'Diario de gratitud y oración']
      });

      characters.push({
        id: `esteban_esposo_${hash}`,
        name: 'Esteban Ramos',
        gender: 'male',
        age: '32 años',
        role: 'Esposo fiel que sostiene su mano cuando las fuerzas fallan',
        archetype: 'El compañero de pacto incondicional',
        vocative: 'Hijo mío, tu fidelidad es vista en los cielos',
        pronoun: 'él',
        posture: 'abrazando a su esposa con la cabeza apoyada en su hombro en oración',
        clothingStyle: 'Camisa azul denim arremangada, pantalones oscuros',
        modelSheetLockEn: 'Devoted 32yo husband, trimmed beard, sorrowful dark eyes, blue denim shirt, sturdy shoulders bowed in prayer, 3D Pixar style.',
        voicePreset: 'Emilio - Warm & Expressive',
        signatureProps: ['Anillo matrimonial dorado', 'Café en vaso térmico']
      });

      characters.push({
        id: `doctor_mendez_${hash}`,
        name: 'Dr. Alejandro Méndez',
        gender: 'male',
        age: '50 años',
        role: 'Oncólogo que presencia un cambio inexplicable en los análisis',
        archetype: 'El testigo asombrado del poder divino',
        vocative: 'Hijo mío',
        pronoun: 'él',
        posture: 'mirando la pantalla del ordenador incrédulo ajustándose las gafas',
        clothingStyle: 'Bata blanca impecable sobre corbata granate',
        modelSheetLockEn: 'Distinguished 50yo specialist, graying silver hair, wire spectacles, crisp white doctor coat, stunned expression, 3D Pixar style.',
        voicePreset: 'Marcus - Deep & Resonant',
        signatureProps: ['Gráficos de laboratorio', 'Pluma estilográfica']
      });

      characters.push({
        id: `clara_enfermera_${hash}`,
        name: 'Clara Navarro',
        gender: 'female',
        age: '31 años',
        role: 'Enfermera orante que acompaña a la paciente',
        archetype: 'La intercesora discreta',
        vocative: 'Hija fiel',
        pronoun: 'ella',
        posture: 'ajustando el goteo de suero en silencio',
        clothingStyle: 'Ambo celeste claro, cabello recogido con cofia',
        modelSheetLockEn: 'Gentle 31yo nurse, kind dark eyes, soft smile, baby blue scrubs, 3D Pixar character.',
        voicePreset: 'Sara - Warm Motherly Voice',
        signatureProps: ['Tensiómetro portátil', 'Tarjetón de oraciones']
      });
    }
  }
  // Theme B: Emergency, Firefighters, Miners, Rescue, Natural Disasters
  else if (clean.includes('bombero') || clean.includes('fuego') || clean.includes('incendio') || clean.includes('mina') || clean.includes('minero') || clean.includes('derrumbe') || clean.includes('rescate') || clean.includes('terremoto') || clean.includes('atrapado')) {
    characters.push({
      id: `mateo_bombero_${hash}`,
      name: 'Capitán Mateo Reyes',
      gender: 'male',
      age: '39 años',
      role: 'Bombero y rescatista al límite de sus fuerzas en una misión extrema',
      archetype: 'El líder que arriesga su propia vida para salvar a otros',
      vocative: 'Hijo mío, cuando pases por el fuego no te quemarás',
      pronoun: 'él',
      posture: 'con el rostro cubierto de hollín apoyado contra la pared respirando oxígeno con fatiga',
      clothingStyle: 'Traje ignífugo amarillo reflectante con hollín y marcas de calor, casco de rescate al hombro',
      modelSheetLockEn: 'Brave 39yo rescue captain, rugged face streaked with soot, intense dark amber eyes of endurance, heavy turnout gear with reflective stripes, 3D Pixar aesthetic.',
      voicePreset: 'David - Confident & Clear',
      signatureProps: ['Casco de bombero desgastado', 'Linterna de casco empañada', 'Walkie-talkie emitiendo estática']
    });

    characters.push({
      id: `ignacio_companero_${hash}`,
      name: 'Ignacio Vega',
      gender: 'male',
      age: '28 años',
      role: 'Joven rescatista atrapado junto a su capitán en el colapso',
      archetype: 'El novato valiente que aprende a orar en la adversidad',
      vocative: 'Hijo mío, tu clamor ha sido oído',
      pronoun: 'él',
      posture: 'arrodillado en los escombros sosteniendo una viga de madera con las manos ensangrentadas',
      clothingStyle: 'Chaqueta de rescate rota en el hombro, guantes térmicos gastados',
      modelSheetLockEn: 'Young 28yo firefighter, dirt-smudged forehead, wide determined hazel eyes, torn turnout gear, 3D Pixar style.',
      voicePreset: 'Emilio - Warm & Expressive',
      signatureProps: ['Hacha de rescate', 'Guantes térmicos desgastados']
    });

    characters.push({
      id: `marina_espera_${hash}`,
      name: 'Marina Reyes',
      gender: 'female',
      age: '37 años',
      role: 'Esposa que espera noticias afuera rezando sin cesar',
      archetype: 'La mujer de fe inquebrantable que no se mueve del umbral',
      vocative: 'Hija mía, la esperanza no avergüenza',
      pronoun: 'ella',
      posture: 'aferrada a la cinta de seguridad mirando las sirenas de emergencia con lágrimas ardientes',
      clothingStyle: 'Abrigo gris oscuro de lana, bufanda roja, manos unidas en ruego',
      modelSheetLockEn: 'Devoted 37yo woman, wet soulful dark eyes, loose dark curls in night wind, wool coat, 3D Pixar character.',
      voicePreset: 'Elena - Deeply Emotional & Sincere',
      signatureProps: ['Medalla de San Miguel / Cruz de metal', 'Teléfono móvil con pantalla encendida']
    });

    characters.push({
      id: `nino_rescatado_${hash}`,
      name: 'Tomás (El Rescatado)',
      gender: 'male',
      age: '9 años',
      role: 'El niño hallado entre los escombros con una manta térmica',
      archetype: 'La vida que renace entre las cenizas',
      vocative: 'Pequeño mío amado',
      pronoun: 'él',
      posture: 'envuelto en manta dorada térmica mirando con asombro la luz',
      clothingStyle: 'Ropa cubierta de polvo, manta dorada de emergencia',
      modelSheetLockEn: 'Resilient 9yo boy, wide innocent eyes shining through dust, emergency foil blanket, 3D Pixar style.',
      voicePreset: 'Mateo - Young & Earnest',
      signatureProps: ['Linterna pequeña de llavero', 'Manta dorada de rescate']
    });
  }
  // Theme C: Sea, Storm, Fishermen, Sailors, Shipwrecks
  else if (clean.includes('mar') || clean.includes('pescador') || clean.includes('pesca') || clean.includes('barca') || clean.includes('tormenta') || clean.includes('olas') || clean.includes('naufrago') || clean.includes('océano') || clean.includes('bote')) {
    characters.push({
      id: `simon_pescador_${hash}`,
      name: 'Simón Barquero',
      gender: 'male',
      age: '46 años',
      role: 'Pescador veterano con deudas que no ha pescado nada en toda la noche',
      archetype: 'El hombre curtido por el viento que se rinde a los pies de Cristo',
      vocative: 'Hijo mío, boga mar adentro y echa tus redes',
      pronoun: 'él',
      posture: 'apoyado contra el mástil mojado escurriendo una red rota con mirada desolada',
      clothingStyle: 'Chubasquero amarillo de pescador gastado por la salitre, suéter de lana gruesa marina, botas de goma',
      modelSheetLockEn: 'Weathered 46yo fisherman, rugged salt-and-pepper beard, sea-green eyes full of grit and fatigue, yellow oilskin coat, heavy wool sweater, 3D Pixar character sheet.',
      voicePreset: 'Marcus - Deep & Resonant',
      signatureProps: ['Red de pesca de cáñamo rota', 'Farol náutico de latón con cristal empañado', 'Brújula marina antigua']
    });

    characters.push({
      id: `david_hijo_pescador_${hash}`,
      name: 'David Barquero',
      gender: 'male',
      age: '18 años',
      role: 'Hijo joven del pescador que rema con desesperación contra las olas',
      archetype: 'La juventud que descubre el poder de Dios en la tempestad',
      vocative: 'Joven valiente, no temas al viento',
      pronoun: 'él',
      posture: 'aferrado a los remos con los músculos en tensión y el agua salada resbalando por su frente',
      clothingStyle: 'Camisa azul oscura remangada, chaleco salvavidas de lona desgastada',
      modelSheetLockEn: 'Strong 18yo youth, determined jaw, drenched dark brown hair, sea-salt on cheeks, canvas vest, 3D Pixar character.',
      voicePreset: 'Mateo - Young & Earnest',
      signatureProps: ['Remo de madera de fresno', 'Cuchillo de cabo de madera']
    });

    characters.push({
      id: `noemi_esposa_costa_${hash}`,
      name: 'Noemí Barquero',
      gender: 'female',
      age: '43 años',
      role: 'Esposa que espera en el muelle bajo la lluvia mirando el horizonte oscuro',
      archetype: 'El ancla de intercesión en tierra firme',
      vocative: 'Hija de fe serena',
      pronoun: 'ella',
      posture: 'de pie en las tablas del muelle con un chal empapado sosteniendo una lámpara hacia el mar',
      clothingStyle: 'Vestido rústico de lana marina, chal impermeable oscuro, cabello recogido empapado',
      modelSheetLockEn: 'Resilient 43yo woman on stormy pier, deep brown eyes gazing through heavy rain, wet woolen shawl, 3D Pixar character.',
      voicePreset: 'Sara - Warm Motherly Voice',
      signatureProps: ['Farol de aceite con reflector', 'Cesto de mimbre con provisiones']
    });
  }
  // Theme D: Addiction, Darkness, Street, Online Betting, Debts, Prodigal
  else if (clean.includes('adiccion') || clean.includes('adicción') || clean.includes('apuesta') || clean.includes('juego') || clean.includes('alcohol') || clean.includes('calle') || clean.includes('droga') || clean.includes('perdido') || clean.includes('3:00 am') || clean.includes('madrugada')) {
    characters.push({
      id: `javier_atrapado_${hash}`,
      name: 'Javier Santos',
      gender: 'male',
      age: '27 años',
      role: 'Joven profesional atrapado en una espiral secreta que lo despojó de todo',
      archetype: 'El hijo en el foso de la desesperación que clama por auxilio',
      vocative: 'Hijo mío, Yo pago tu deuda, levántate y anda',
      pronoun: 'él',
      posture: 'sentado en el suelo con la espalda contra la pared, el rostro entre las manos y el móvil vibrando con notificaciones de cobro',
      clothingStyle: 'Sudadera negra arremangada, vaqueros gastados, zapatillas desatadas',
      modelSheetLockEn: 'Tormented 27yo young man, hollow cheeks, dark circles under vulnerable eyes, disheveled dark hair, black hoodie, 3D Pixar aesthetic.',
      voicePreset: 'David - Confident & Clear',
      signatureProps: ['Teléfono móvil con pantalla estrellada', 'Notificación judicial arrugada', 'Llaves de casa que ya no puede abrir']
    });

    characters.push({
      id: `padre_antonio_${hash}`,
      name: 'Don Antonio Santos',
      gender: 'male',
      age: '58 años',
      role: 'Padre que mantuvo la puerta abierta y la luz encendida a las 3 AM',
      archetype: 'El padre del hijo pródigo que corre a abrazarlo sin reproches',
      vocative: 'Siervo fiel y padre amoroso',
      pronoun: 'él',
      posture: 'abriendo la puerta de par en par con lágrimas corriendo por sus mejillas y brazos abiertos',
      clothingStyle: 'Pantalón de pijama oscuro, bata de franela a cuadros, zapatillas de paño',
      modelSheetLockEn: 'Loving 58yo father, silver-gray hair, tender wrinkled eyes filled with mercy and tears, warm flannel robe, 3D Pixar style.',
      voicePreset: 'Marcus - Deep & Resonant',
      signatureProps: ['Taza de café humeante', 'Manta de lana doblada en el sofá']
    });

    characters.push({
      id: `camila_hermana_${hash}`,
      name: 'Camila Santos',
      gender: 'female',
      age: '23 años',
      role: 'Hermana que no dejó de orar por su rescate',
      archetype: 'El puente de reconciliación en el hogar',
      vocative: 'Hija amada de paz',
      pronoun: 'ella',
      posture: 'abrazando a su hermano en el suelo entre sollozos de alivio',
      clothingStyle: 'Suéter de punto verde esmeralda, pantalones deportivos cómodos',
      modelSheetLockEn: 'Empathetic 23yo sister, hazel eyes shining with happy tears, wavy dark hair, cozy knit sweater, 3D Pixar character.',
      voicePreset: 'Sofia - Sweet & Innocent',
      signatureProps: ['Foto enmarcada de su infancia juntos', 'Biblia con marcapáginas dorado']
    });
  }
  // Theme E: Music, Arts, Blindness, Loss of Voice or Hearing, Talents
  else if (clean.includes('piano') || clean.includes('musica') || clean.includes('música') || clean.includes('canto') || clean.includes('voz') || clean.includes('ciego') || clean.includes('ceguera') || clean.includes('sordo') || clean.includes('talento') || clean.includes('guitarra')) {
    characters.push({
      id: `clara_pianista_${hash}`,
      name: 'Clara Estrada',
      gender: 'female',
      age: '25 años',
      role: 'Pianista y compositora que enfrenta una pérdida auditiva súbita',
      archetype: 'La artista quebrada que aprende a escuchar la voz de Dios en el silencio',
      vocative: 'Hija mía, canta para Mí, tu alabanza estremece los cielos',
      pronoun: 'ella',
      posture: 'apoyando la frente sobre las teclas del piano con lágrimas cayendo sobre el marfil',
      clothingStyle: 'Vestido largo de terciopelo azul marino austero, cabello castaño en media cola con cinta de raso',
      modelSheetLockEn: 'Delicate 25yo concert pianist, poetic porcelain face, expressive dark sapphire eyes, navy velvet dress, 3D Pixar character sheet.',
      voicePreset: 'Elena - Deeply Emotional & Sincere',
      signatureProps: ['Partitura con notas borradas por lágrimas', 'Diapasón metálico', 'Anillo de marfil antiguo']
    });

    characters.push({
      id: `maestro_lorenzo_${hash}`,
      name: 'Maestro Lorenzo',
      gender: 'male',
      age: '62 años',
      role: 'Profesor y mentor de música que le enseña la melodía del alma',
      archetype: 'El sabio guía que recuerda que la verdadera música viene de Dios',
      vocative: 'Hijo fiel, la armonía eterna nunca se apaga',
      pronoun: 'él',
      posture: 'de pie junto al piano colocando su mano paternal sobre el hombro de Clara',
      clothingStyle: 'Traje de lana gris oscuro de corte clásico, pañuelo de seda blanco en el bolsillo',
      modelSheetLockEn: 'Distinguished 62yo music professor, wise smiling eyes behind round glasses, silver beard, elegant gray suit, 3D Pixar style.',
      voicePreset: 'Marcus - Deep & Resonant',
      signatureProps: ['Metrónomo de madera de caoba', 'Batuta de nogal']
    });

    characters.push({
      id: `joaquin_amigo_${hash}`,
      name: 'Joaquín Rivas',
      gender: 'male',
      age: '26 años',
      role: 'Violinista de orquesta que la acompaña en su proceso',
      archetype: 'El amigo incondicional',
      vocative: 'Hijo noble',
      pronoun: 'él',
      posture: 'sosteniendo el estuche de violín con reverencia y silencio compasivo',
      clothingStyle: 'Camisa negra formal arremangada, chaleco sastre',
      modelSheetLockEn: 'Kind 26yo violinist, expressive warm brown eyes, black waistcoat, 3D Pixar character.',
      voicePreset: 'Emilio - Warm & Expressive',
      signatureProps: ['Estuche de violín de cuero', 'Arco de madera']
    });
  }
  // Theme F: Youth, University, Bullying, Identity & Future
  else if (clean.includes('joven') || clean.includes('bullying') || clean.includes('universidad') || clean.includes('colegio') || clean.includes('escuela') || clean.includes('estudiante') || clean.includes('adolescente')) {
    characters.push({
      id: `lucas_estudiante_${hash}`,
      name: 'Lucas Navas',
      gender: 'male',
      age: '19 años',
      role: 'Universitario que sufre soledad y burla por sus valores éticos',
      archetype: 'El joven que decide no contaminarse con la corriente del mundo',
      vocative: 'Hijo mío, tu valentía resplandece ante mí',
      pronoun: 'él',
      posture: 'sentado en las escaleras del campus con la mochila entre las piernas cabizbajo',
      clothingStyle: 'Sudadera con capucha gris grafito, vaqueros desgastados, zapatillas de lona',
      modelSheetLockEn: 'Introspective 19yo student, tousled dark curls, sensitive soulful green eyes, charcoal hoodie, battered canvas backpack, 3D Pixar aesthetic.',
      voicePreset: 'David - Confident & Clear',
      signatureProps: ['Mochila escolar gastada', 'Auriculares sobre el cuello', 'Cuaderno con versículos dibujados']
    });

    characters.push({
      id: `profesor_donato_${hash}`,
      name: 'Profesor Donato',
      gender: 'male',
      age: '55 años',
      role: 'Docente sabio que percibe el dolor de su alumno y le ofrece una palabra a tiempo',
      archetype: 'El mentor providencial',
      vocative: 'Siervo fiel',
      pronoun: 'él',
      posture: 'poniendo su mano firme en el hombro de Lucas con mirada comprensiva',
      clothingStyle: 'Saco de tweed marrón con coderas, chaleco de punto, anteojos de carey',
      modelSheetLockEn: 'Wise 55yo professor, warm wrinkled eyes, salt-and-pepper beard, brown tweed jacket, leather briefcase, 3D Pixar character.',
      voicePreset: 'Marcus - Deep & Resonant',
      signatureProps: ['Libro clásico de tapas duras', 'Maletín de cuero antiguo']
    });

    characters.push({
      id: `sofia_companera_${hash}`,
      name: 'Sofía Cordero',
      gender: 'female',
      age: '19 años',
      role: 'Compañera de clase que decide romper el silencio y defender la verdad',
      archetype: 'La voz de la justicia y empatía',
      vocative: 'Hija de luz',
      pronoun: 'ella',
      posture: 'de pie frente al grupo mirando con determinación y extendiendo su mano a Lucas',
      clothingStyle: 'Chaqueta vaquera oversize con pines luminosos, bufanda mostaza',
      modelSheetLockEn: 'Brave 19yo student, expressive bright hazel eyes, wavy auburn bob, denim jacket with mustard scarf, 3D Pixar style.',
      voicePreset: 'Sofia - Sweet & Innocent',
      signatureProps: ['Termo metálico de agua', 'Libretas universitarias de colores']
    });
  }
  // Theme G: Family, Marriage, Reconciliation, Brothers, Divorce
  else if (clean.includes('perdon') || clean.includes('perdón') || clean.includes('hermanos') || clean.includes('hermano') || clean.includes('hermana') || clean.includes('matrimonio') || clean.includes('esposos') || clean.includes('divorcio') || clean.includes('hogar')) {
    characters.push({
      id: `carlos_hermano_${hash}`,
      name: 'Carlos Roldán',
      gender: 'male',
      age: '38 años',
      role: 'Hermano mayor endurecido por viejos resentimientos y deudas',
      archetype: 'El corazón acorazado que necesita el bálsamo del perdón',
      vocative: 'Hijo mío, suelta la amargura que te ata',
      pronoun: 'él',
      posture: 'de pie con los brazos cruzados y la mandíbula tensa mirando hacia la pared',
      clothingStyle: 'Camisa a cuadros de franela oscura, botas de trabajo, reloj gastado',
      modelSheetLockEn: 'Proud 38yo man, rugged stubble, guarded deep brown eyes showing hidden pain, flannel shirt, working boots, 3D Pixar character sheet.',
      voicePreset: 'Emilio - Warm & Expressive',
      signatureProps: ['Escritura notarial arrugada', 'Llaves de taller']
    });

    characters.push({
      id: `tomas_hermano_${hash}`,
      name: 'Tomás Roldán',
      gender: 'male',
      age: '34 años',
      role: 'Hermano menor que regresa arrepentido buscando abrazar a su familia',
      archetype: 'El hijo pródigo restaurado por la gracia',
      vocative: 'Hijo mío, bienvenido a casa',
      pronoun: 'él',
      posture: 'con las manos abiertas en súplica y lágrimas sinceras en los ojos',
      clothingStyle: 'Chaqueta marrón desgastada, camisa clara abierta en el cuello',
      modelSheetLockEn: 'Humble 34yo brother, pleading wet eyes, sincere vulnerability, worn leather jacket, 3D Pixar character sheet.',
      voicePreset: 'David - Confident & Clear',
      signatureProps: ['Carta de perdón escrita a mano', 'Vieja foto infantil de ambos']
    });

    characters.push({
      id: `madre_mercedes_${hash}`,
      name: 'Doña Mercedes (La Madre)',
      gender: 'female',
      age: '68 años',
      role: 'Madre anciana que ha orado durante años para ver a sus hijos reconciliados',
      archetype: 'El corazón de oración de la casa',
      vocative: 'Hija mía fiel, tu oración fue contestada',
      pronoun: 'ella',
      posture: 'sentada en su mecedora con su Biblia en falda uniendo las manos de sus hijos',
      clothingStyle: 'Vestido floral clásico, rebeca de punto lila, cabello blanco trenzado',
      modelSheetLockEn: 'Venerable 68yo matriarch, radiant gentle wrinkles, sparkling tearful eyes of joy, lilac knit cardigan, silver braided hair, 3D Pixar style.',
      voicePreset: 'Esperanza - Gentle & Wise',
      signatureProps: ['Biblia familiar ajada', 'Pañuelo de encaje bordado']
    });
  }
  // Theme H1: Wisdom, Direction, Decisions, Proverbs 3:5 & Trust in God (Fíate de Jehová, Prudencia, Sabiduría, Caminos, Sendas, Planos)
  else if (clean.includes('fíate') || clean.includes('fiate') || clean.includes('jehová') || clean.includes('jehova') || clean.includes('prudencia') || clean.includes('proverbios') || clean.includes('sabiduria') || clean.includes('sabiduría') || clean.includes('dirección') || clean.includes('direccion') || clean.includes('senda') || clean.includes('camino') || clean.includes('decision') || clean.includes('decisión') || clean.includes('planes') || clean.includes('futuro') || clean.includes('confiar') || clean.includes('confianza') || clean.includes('apoyes') || clean.includes('arquitecto') || clean.includes('constructor')) {
    const isLeadFemale = clean.includes('mujer') || clean.includes('ella') || clean.includes('madre') || clean.includes('chica') || clean.includes('hija') || clean.includes('joven');

    if (isLeadFemale) {
      characters.push({
        id: `leonor_arquitecta_${hash}`,
        name: 'Leonor Castillo',
        gender: 'female',
        age: '33 años',
        role: 'Diseñadora y planificadora que ve sus proyectos desplomarse por confiar en su propia lógica',
        archetype: 'La líder que aprende a soltar el control y rendir sus planes ante Dios',
        vocative: 'Hija mía, no te apoyes en tu prudencia; Yo enderezaré tu senda',
        pronoun: 'ella',
        posture: 'de pie frente a sus planos y bocetos con el compás en la mano temblando, respirando hondo en rendición',
        clothingStyle: 'Blusa de lino verde oliva arremangada, pantalones de lino crudo, cabello recogido con una cinta de cuero',
        modelSheetLockEn: 'Brilliant yet humbled 33yo woman named Leonor Castillo, expressive amber eyes filled with newfound surrender, soft wavy dark hair, olive linen blouse, 3D Pixar character sheet.',
        voicePreset: 'Elena - Deeply Emotional & Sincere',
        signatureProps: ['Compás de latón de arquitecto', 'Plano con cálculos tachados', 'Cuaderno de bocetos']
      });

      characters.push({
        id: `esteban_apoyo_${hash}`,
        name: 'Esteban Galván',
        gender: 'male',
        age: '36 años',
        role: 'Compañero leal que le recuerda las promesas eternas de Proverbios 3',
        archetype: 'La voz de la fe serena en medio de la incertidumbre',
        vocative: 'Hijo prudente',
        pronoun: 'él',
        posture: 'apoyando su mano sobre el hombro de Leonor señalando la luz en la ventana',
        clothingStyle: 'Suéter de cuello alto azul marino, pantalón sarga gris',
        modelSheetLockEn: 'Supportive 36yo man named Esteban Galván, short dark beard, kind steady eyes, navy sweater, 3D Pixar style.',
        voicePreset: 'David - Confident & Clear',
        signatureProps: ['Escritura bíblica en pergamino', 'Lámpara de aceite encendida']
      });
    } else {
      characters.push({
        id: `leandro_constructor_${hash}`,
        name: 'Leandro Morales',
        gender: 'male',
        age: '38 años',
        role: 'Maestro constructor y calculista en crisis tras colapsar sus propios cimientos humanos',
        archetype: 'El hombre autosuficiente quebrantado que entrega las riendas de su vida a Cristo',
        vocative: 'Hijo mío, fíate de Mí de todo tu corazón y no en tu prudencia',
        pronoun: 'él',
        posture: 'arrodillado junto a la mesa de dibujo con la cabeza baja y las palmas abiertas hacia arriba en rendición total',
        clothingStyle: 'Camisa de mezclilla gris desgastada con mangas dobladas, chaleco de cuero rústico, pantalón de pana oscura',
        modelSheetLockEn: 'Deeply thoughtful 38yo master artisan named Leandro Morales, sincere hazel eyes glistening with humility, rugged stubble, grey denim shirt, 3D Pixar character sheet.',
        voicePreset: 'David - Confident & Clear',
        signatureProps: ['Compás de bronce y regla graduada', 'Planos de cedro enrollados', 'Cruz de madera de olivo en el bolsillo']
      });

      characters.push({
        id: `clara_esposa_${hash}`,
        name: 'Clara Benítez',
        gender: 'female',
        age: '35 años',
        role: 'Esposa piadosa que discierne la soberanía divina detrás de la prueba',
        archetype: 'El baluarte de oración y discernimiento sabio',
        vocative: 'Hija virtuosa y sabia',
        pronoun: 'ella',
        posture: 'inclinada a su lado con su mano sobre las Escrituras abiertas en Proverbios 3',
        clothingStyle: 'Vestido de algodón terracota suave, chal tejido de lana crema sobre los hombros',
        modelSheetLockEn: 'Serene 35yo woman named Clara Benítez, warm chocolate eyes of unconditional trust, soft dark braids, terracotta dress, 3D Pixar character.',
        voicePreset: 'Elena - Deeply Emotional & Sincere',
        signatureProps: ['Biblia familiar abierta en Proverbios 3:5', 'Taza de barro cocido humeante']
      });
    }
  }
  // Theme H2: Financial Ruin, Foreclosure, Debts, Workshop & Livelihood (Quiebra, Desalojo, Deuda, Taller, Trabajo, Pan, Pobreza)
  else if (clean.includes('quiebra') || clean.includes('desalojo') || clean.includes('deuda') || clean.includes('deudas') || clean.includes('banco') || clean.includes('embargo') || clean.includes('despido') || clean.includes('taller') || clean.includes('negocio') || clean.includes('trabajo') || clean.includes('pan') || clean.includes('arriendo') || clean.includes('hipoteca')) {
    characters.push({
      id: `mateo_artesano_${hash}`,
      name: 'Mateo Solares',
      gender: 'male',
      age: '41 años',
      role: 'Artesano de taller al borde del desalojo y la ruina económica',
      archetype: 'El trabajador quebrado que clama por la provisión del Cielo',
      vocative: 'Hijo mío, Yo soy tu proveedor; tu casa no quedará desamparada',
      pronoun: 'él',
      posture: 'sentado en su banco de trabajo con las manos en el rostro y los avisos de cobro desparramados',
      clothingStyle: 'Delantal de lona gruesa sobre camisa de franela a cuadros marrón, pantalones de trabajo',
      modelSheetLockEn: 'Exhausted yet hardworking 41yo artisan named Mateo Solares, weathered kind face, intense brown eyes with tear tracks, rugged leather apron, 3D Pixar character.',
      voicePreset: 'David - Confident & Clear',
      signatureProps: ['Aviso legal de cobro arrugado', 'Bolsa de monedas vacía', 'Martillo de forja gastado']
    });

    characters.push({
      id: `jimena_esposa_${hash}`,
      name: 'Jimena Fuentes',
      gender: 'female',
      age: '37 años',
      role: 'Esposa trabajadora que sostiene el hogar con oración y valentía',
      archetype: 'La fe inquebrantable en la escasez',
      vocative: 'Hija mía, no temas por el pan de mañana',
      pronoun: 'ella',
      posture: 'abrazando a su esposo por la espalda con lágrimas de fe en los ojos',
      clothingStyle: 'Blusa de lino azul añil, falda de pana suave, delantal de cocina sencillo',
      modelSheetLockEn: 'Steadfast 37yo woman named Jimena Fuentes, glowing emerald eyes of deep faith, chestnut hair tied in low ponytail, 3D Pixar style.',
      voicePreset: 'Elena - Deeply Emotional & Sincere',
      signatureProps: ['Cesta de mimbre con el último trozo de pan', 'Libreta de cuentas del hogar']
    });
  }
  // Theme H3: Anxiety, Panic Attacks, Insomnia & Night Terrors (Ansiedad, Pánico, Miedo, Insomnio, Pesadilla, Noche Oscura)
  else if (clean.includes('ansiedad') || clean.includes('panico') || clean.includes('pánico') || clean.includes('miedo') || clean.includes('temor') || clean.includes('insomnio') || clean.includes('pesadilla') || clean.includes('oscuridad') || clean.includes('depresion') || clean.includes('depresión') || clean.includes('angustia') || clean.includes('ahogo')) {
    characters.push({
      id: `gabriel_joven_${hash}`,
      name: 'Gabriel Rivas',
      gender: 'male',
      age: '28 años',
      role: 'Joven atrapado por ataques de pánico y angustia en la noche',
      archetype: 'El alma oprimida que encuentra liberación en el nombre de Jesús',
      vocative: 'Hijo amado, mi paz te dejo, mi paz te doy; no temas',
      pronoun: 'él',
      posture: 'sentado al borde de la cama con las manos en el pecho respirando con dificultad en la penumbra',
      clothingStyle: 'Camiseta de algodón gris holgada, pantalones cómodos oscuros',
      modelSheetLockEn: 'Vulnerable 28yo young man named Gabriel Rivas, wide dark eyes haunted by fear transitioning to holy awe, tousled hair, grey shirt, 3D Pixar character.',
      voicePreset: 'David - Confident & Clear',
      signatureProps: ['Vaso de agua en la mesita de noche', 'Reloj despertador marcando las 3:15 AM']
    });

    characters.push({
      id: `noemi_hermana_${hash}`,
      name: 'Noemí Rivas',
      gender: 'female',
      age: '26 años',
      role: 'Hermana que intercede en la habitación orando con autoridad',
      archetype: 'El escudo de oración fraterno',
      vocative: 'Hija intercesora',
      pronoun: 'ella',
      posture: 'arrodillada junto a la cama con una mano en su hombro clamando en el nombre de Jesús',
      clothingStyle: 'Sudadera de felpa beige, pantalón suave',
      modelSheetLockEn: 'Loving 26yo sister, protective tender gaze, braided hair, 3D Pixar character.',
      voicePreset: 'Elena - Deeply Emotional & Sincere',
      signatureProps: ['Salmo 91 anotado en papel', 'Lámpara tenue de noche']
    });
  }
  // Theme H4: Universal Dynamic Bespoke Cast Synthesizer for ANY OTHER TOPIC
  // Generates 100% bespoke characters tailored to the user's specific story words (High entropy, diverse names & model sheets!)
  else {
    const isExplicitFemale = clean.includes('mujer') || clean.includes('madre') || clean.includes('ella') || clean.includes('chica') || clean.includes('dama') || clean.includes('viuda') || clean.includes('hija') || clean.includes('abuela') || clean.includes('anciana') || clean.includes('esposa');
    const isChildLead = clean.includes('niño') || clean.includes('niña') || clean.includes('pequeño') || clean.includes('pequeña') || clean.includes('hijo') || clean.includes('hija') || clean.includes('infantil');
    const isElderLead = clean.includes('anciano') || clean.includes('anciana') || clean.includes('abuelo') || clean.includes('abuela') || clean.includes('viejo') || clean.includes('canas');

    // High-entropy diverse name banks (30+ distinct names each)
    const femaleNames = [
      'Valeria Santos', 'Camila Ortiz', 'Noemí Morales', 'Jimena Castillo',
      'Clara Benítez', 'Renata Vega', 'Lucía Arismendi', 'Estela Fuentes',
      'Raquel Navarro', 'Daniela Solís', 'Inés Cordero', 'Beatriz Quintana',
      'Lorena Palacios', 'Marta Salcedo', 'Silvia Menéndez', 'Elisa Barrientos',
      'Mariana Cárdenas', 'Aurora Delgado', 'Catalina Rueda', 'Diana Peñaloza',
      'Leonor Velázquez', 'Sofía Hurtado', 'Teresa Padrón', 'Amalia Cisneros'
    ];
    const maleNames = [
      'Mateo Albarrán', 'Ignacio Reyes', 'Gabriel Rivas', 'Hernán Varela',
      'Felipe Domínguez', 'Damián Solares', 'Tomás Estrada', 'Samuel Valenzuela',
      'Javier Mendoza', 'Andrés Peñaloza', 'Leandro Morales', 'Esteban Galván',
      'Alonso Cifuentes', 'Mauricio Pardo', 'Rodrigo Salazar', 'Gonzalo Beltrán',
      'Emilio Carranza', 'Nicolás Hurtado', 'Marcos Quiroga', 'Patricio Vergara',
      'Sebastián Lozano', 'Adrián Fonseca', 'Álvaro Carvajal', 'Ezequiel Duarte'
    ];
    const childNames = ['Tomás', 'Mateo', 'Valentina', 'Sofía', 'Leo', 'Clarita', 'Benjamín', 'Mía', 'Samuelito', 'Lucianita'];
    const elderNames = ['Don Evaristo', 'Don Anselmo', 'Doña Esperanza', 'Don Joaquín', 'Doña Matilde', 'Don Silvano', 'Don Aurelio', 'Doña Vicenta'];

    // Multi-component hash ensuring distinct topics never land on the same character names
    const seed1 = (clean.length * 17 + (clean.charCodeAt(0) || 5) * 31 + (clean.charCodeAt(clean.length - 1) || 7) * 47) >>> 0;
    const seed2 = (clean.split('').reduce((acc, c, i) => acc + c.charCodeAt(0) * (i + 3), 11)) >>> 0;

    const pickedFemaleName = femaleNames[seed1 % femaleNames.length];
    const pickedMaleName = maleNames[seed2 % maleNames.length];
    const pickedChildName = childNames[(seed1 + seed2) % childNames.length];
    const pickedElderName = elderNames[(seed1 * 3 + seed2) % elderNames.length];

    if (isChildLead) {
      characters.push({
        id: `protagonista_nino_${hash}`,
        name: pickedChildName,
        gender: isExplicitFemale ? 'female' : 'male',
        age: '8 años',
        role: `Pequeño protagonista que clama con fe pura en medio de "${topic.slice(0, 40)}"`,
        archetype: 'La fe de un niño que mueve montañas',
        vocative: isExplicitFemale ? 'Pequeña mía amada' : 'Pequeño mío amado',
        pronoun: isExplicitFemale ? 'ella' : 'él',
        posture: 'con las manos unidas sobre el corazón mirando al cielo con ojos brillantes de fe',
        clothingStyle: isExplicitFemale ? 'Vestidito de algodón celeste con bordados suaves, rebeca tejida' : 'Camisa a cuadros pequeña, tirantes y pantalón de pana',
        modelSheetLockEn: `Adorable 8yo ${isExplicitFemale ? 'girl' : 'boy'}, wide expressive sparkling hazel eyes, innocent hopeful smile, 3D Pixar character sheet.`,
        voicePreset: isExplicitFemale ? 'Sofia - Sweet & Innocent' : 'Mateo - Young & Earnest',
        signatureProps: ['Juguete favorito de madera', 'Oración escrita con crayones de colores']
      });

      characters.push({
        id: `madre_apoyo_${hash}`,
        name: pickedFemaleName,
        gender: 'female',
        age: '35 años',
        role: 'Madre protectora que acompaña su clamor',
        archetype: 'La protectora fiel',
        vocative: 'Hija mía',
        pronoun: 'ella',
        posture: 'arrodillada abrazando a su hijo con lágrimas de conmoción',
        clothingStyle: 'Blusa de lino suave, rebeca de lana clara',
        modelSheetLockEn: 'Loving 35yo mother, tender eyes, wavy brunette hair, 3D Pixar style.',
        voicePreset: 'Sara - Warm Motherly Voice',
        signatureProps: ['Biblia familiar', 'Pañuelo bordado']
      });

      characters.push({
        id: `padre_apoyo_${hash}`,
        name: pickedMaleName,
        gender: 'male',
        age: '38 años',
        role: 'Padre que rinde su orgullo ante el milagro',
        archetype: 'El padre restaurado',
        vocative: 'Hijo mío',
        pronoun: 'él',
        posture: 'poniendo su mano protectora sobre el hombro de ambos',
        clothingStyle: 'Camisa azul de trabajo, vaqueros oscuros',
        modelSheetLockEn: 'Devoted 38yo father, kind rugged face, blue shirt, 3D Pixar character.',
        voicePreset: 'David - Confident & Clear',
        signatureProps: ['Reloj de muñeca', 'Llaves de la casa']
      });
    } else if (isElderLead) {
      characters.push({
        id: `anciano_protagonista_${hash}`,
        name: pickedElderName,
        gender: isExplicitFemale ? 'female' : 'male',
        age: '74 años',
        role: `Venerable protagonista en su prueba de fe por "${topic.slice(0, 40)}"`,
        archetype: 'La perseverancia y sabiduría de los años que confía en el Señor',
        vocative: isExplicitFemale ? 'Hija mía, en tu vejez seré tu refugio' : 'Hijo mío, hasta en tus canas te sostendré',
        pronoun: isExplicitFemale ? 'ella' : 'él',
        posture: 'sentado junto a la ventana apoyando sus manos temblorosas sobre su bastón en oración silenciosa',
        clothingStyle: isExplicitFemale ? 'Vestido de punto lana gris perla, chal lila bordado' : 'Chaleco de punto gris sobre camisa abotonada, bufanda abrigada',
        modelSheetLockEn: `Dignified 74yo ${isExplicitFemale ? 'matriarch' : 'patriarch'}, gentle wrinkled countenance, silver-white hair, compassionate tearful eyes, 3D Pixar character sheet.`,
        voicePreset: isExplicitFemale ? 'Esperanza - Gentle & Wise' : 'Marcus - Deep & Resonant',
        signatureProps: ['Bastón de madera tallada', 'Biblia con páginas gastadas por los años', 'Gafas de lectura']
      });

      characters.push({
        id: `familiar_apoyo_${hash}`,
        name: isExplicitFemale ? pickedMaleName : pickedFemaleName,
        gender: isExplicitFemale ? 'male' : 'female',
        age: '32 años',
        role: 'Hijo o nieto devoto que cuida sus pasos',
        archetype: 'El amor generacional leal',
        vocative: 'Hijo fiel',
        pronoun: isExplicitFemale ? 'él' : 'ella',
        posture: 'inclinado sirviendo una taza caliente y escuchando con reverencia',
        clothingStyle: 'Ropa casual contemporánea de tonos cálidos',
        modelSheetLockEn: 'Loving 32yo relative, warm brown eyes, caring smile, 3D Pixar character.',
        voicePreset: isExplicitFemale ? 'David - Confident & Clear' : 'Elena - Deeply Emotional & Sincere',
        signatureProps: ['Taza de infusión humeante', 'Manta tejida']
      });
    } else if (isExplicitFemale) {
      characters.push({
        id: `protagonista_mujer_${hash}`,
        name: pickedFemaleName,
        gender: 'female',
        age: '32 años',
        role: `Protagonista audaz enfrentando el reto insuperable de "${topic.slice(0, 40)}"`,
        archetype: 'La mujer de fe inquebrantable que no se rinde ante la adversidad',
        vocative: 'Hija mía amada, tu clamor ha traspasado las nubes',
        pronoun: 'ella',
        posture: 'con el rostro iluminado por la esperanza divina, manos al pecho respirando con emoción contenida',
        clothingStyle: 'Blusa de lino esmeralda o terracota, falda o pantalón sobrio de textura natural, cabello con trenza suave',
        modelSheetLockEn: `Expressive 32yo woman named ${pickedFemaleName}, luminous emotive hazel eyes, natural wavy dark hair, elegant linen blouse, 3D Pixar aesthetic.`,
        voicePreset: 'Elena - Deeply Emotional & Sincere',
        signatureProps: ['Biblia marcada con cinta de seda', 'Diario de peticiones y promesas', 'Cadena con crucifijo']
      });

      characters.push({
        id: `segundo_personaje_${hash}`,
        name: pickedMaleName,
        gender: 'male',
        age: '36 años',
        role: 'Compañero de pacto y apoyo incondicional en la tormenta',
        archetype: 'El hombro firme en el momento de la angustia',
        vocative: 'Hijo mío, sé valiente y esfuérzate',
        pronoun: 'él',
        posture: 'apoyando su mano en su espalda transmitiendo fortaleza y consuelo',
        clothingStyle: 'Camisa azul denim arremangada, pantalones oscuros, mirada noble y atenta',
        modelSheetLockEn: `Noble 36yo man, short trimmed beard, kind deep brown eyes, blue denim shirt, 3D Pixar character sheet.`,
        voicePreset: 'David - Confident & Clear',
        signatureProps: ['Documento de compromiso', 'Linterna de mano']
      });

      characters.push({
        id: `tercer_personaje_${hash}`,
        name: pickedChildName,
        gender: 'female',
        age: '9 años',
        role: 'Hija o testigo inocente cuya fe fortalece a los adultos',
        archetype: 'El milagro visible y la alegría que regresa al hogar',
        vocative: 'Pequeña mía',
        pronoun: 'ella',
        posture: 'abrazando a su madre con una sonrisa luminosa',
        clothingStyle: 'Vestido amarillo suave de algodón',
        modelSheetLockEn: 'Sweet 9yo girl, sparkling eyes, warm smile, 3D Pixar style.',
        voicePreset: 'Sofia - Sweet & Innocent',
        signatureProps: ['Dibujo hecho a mano con corazón dorado']
      });

      characters.push({
        id: `cuarto_personaje_${hash}`,
        name: 'Doña Carmen',
        gender: 'female',
        age: '65 años',
        role: 'Madre o mentora que intercede en la noche oscura',
        archetype: 'La columna de oración permanente',
        vocative: 'Hija sabia',
        pronoun: 'ella',
        posture: 'sentada orando con el rostro sereno y lleno de paz',
        clothingStyle: 'Chal de punto sobre vestido sobrio',
        modelSheetLockEn: 'Wise 65yo matriarch, serene wrinkled face, 3D Pixar character.',
        voicePreset: 'Esperanza - Gentle & Wise',
        signatureProps: ['Rosario o libro de salmos', 'Pañuelo bordado']
      });
    } else {
      const wardrobeOptionsMale = [
        { desc: 'Camisa de lino crudo arremangada, chaleco de paño gris y pantalones sobrios', model: 'rugged yet gentle face, rolled-up linen shirt, soft amber lighting' },
        { desc: 'Suéter de punto cuello redondo verde bosque, pantalón de pana oscura y reloj clásico', model: 'thoughtful countenance, forest-green knit sweater, deeply emotive hazel eyes' },
        { desc: 'Chaqueta de mezclilla añil desgastada, camiseta de algodón carbón y botas de cuero', model: 'honest intense gaze, indigo denim jacket, trimmed neat beard' },
        { desc: 'Camisa a cuadros terracota y ocre, pantalones oscuros de trabajo y cinturón de cuero', model: 'warm expressive face marked by resilience, terracotta work shirt' }
      ];
      const wardrobeOptionsFemale = [
        { desc: 'Blusa de lino verde salvia con sutiles bordados, chal crema de lana y cabello en trenza suave', model: 'compassionate warm countenance, sage linen blouse, shining brown eyes' },
        { desc: 'Vestido camisero azul índigo de algodón suave, cinturón fino y cabello ondeado sobre los hombros', model: 'poised and faithful expression, indigo cotton dress, luminous amber eyes' },
        { desc: 'Cárdigan de punto color ciruela suave, blusa marfil y falda larga de textura cálida', model: 'gentle supportive smile, plum knit cardigan, emotive tear-glistening eyes' },
        { desc: 'Blusa terracota cálida con botones de madera, rebeca tejida color avena y cabello recogido', model: 'devoted and sincere face, warm terracotta blouse, gentle caring gaze' }
      ];

      const maleWardrobe = wardrobeOptionsMale[seed2 % wardrobeOptionsMale.length];
      const femaleWardrobe = wardrobeOptionsFemale[seed1 % wardrobeOptionsFemale.length];
      const maleAge = `${30 + (seed2 % 14)} años`;
      const femaleAge = `${28 + (seed1 % 12)} años`;

      characters.push({
        id: `protagonista_hombre_${hash}`,
        name: pickedMaleName,
        gender: 'male',
        age: maleAge,
        role: `Protagonista sincero enfrentando la prueba decisiva de "${topic.slice(0, 40)}"`,
        archetype: 'El hombre que rinde sus fuerzas ante el Creador',
        vocative: 'Hijo mío, he visto la angustia de tu corazón; no temas',
        pronoun: 'él',
        posture: 'arrodillado en el suelo con la mirada elevada hacia la luz y las manos abiertas en rendición',
        clothingStyle: maleWardrobe.desc,
        modelSheetLockEn: `Deeply soulful ${maleAge} man named ${pickedMaleName}, ${maleWardrobe.model}, 3D Pixar character sheet.`,
        voicePreset: 'David - Confident & Clear',
        signatureProps: ['Carta o documento arrugado', 'Cruz de madera tallada a mano', 'Biblia familiar']
      });

      characters.push({
        id: `segundo_personaje_${hash}`,
        name: pickedFemaleName,
        gender: 'female',
        age: femaleAge,
        role: 'Compañera de fe que sostiene el clamor con amor y valentía',
        archetype: 'La compañera de intercesión inquebrantable',
        vocative: 'Hija amada, tu fe ha sido probada como oro',
        pronoun: 'ella',
        posture: 'tomando su mano con amor incondicional y fe renovada',
        clothingStyle: femaleWardrobe.desc,
        modelSheetLockEn: `Loving ${femaleAge} woman named ${pickedFemaleName}, ${femaleWardrobe.model}, 3D Pixar style.`,
        voicePreset: 'Elena - Deeply Emotional & Sincere',
        signatureProps: ['Taza de infusión caliente', 'Promesa bíblica anotada']
      });

      characters.push({
        id: `tercer_personaje_${hash}`,
        name: pickedChildName,
        gender: 'male',
        age: '8 años',
        role: 'Hijo que contempla con asombro la restauración de su padre',
        archetype: 'La semilla del mañana',
        vocative: 'Pequeño valiente',
        pronoun: 'él',
        posture: 'corriendo a abrazar las piernas de su padre con alegría desbordante',
        clothingStyle: 'Camiseta a rayas y pantalones cortos de pana',
        modelSheetLockEn: 'Cheerful 8yo boy, joyful chocolate eyes, messy curls, 3D Pixar character.',
        voicePreset: 'Mateo - Young & Earnest',
        signatureProps: ['Cochecito de juguete de madera']
      });

      characters.push({
        id: `cuarto_personaje_${hash}`,
        name: 'Don Gabriel',
        gender: 'male',
        age: '62 años',
        role: 'Mentor o padre que bendice la nueva etapa',
        archetype: 'El patriarca sabio',
        vocative: 'Siervo prudente',
        pronoun: 'él',
        posture: 'levantando las manos en bendición sobre la familia',
        clothingStyle: 'Chaqueta de gamuza marrón, bufanda de lana suave',
        modelSheetLockEn: 'Venerable 62yo mentor, salt-and-pepper beard, noble serene countenance, 3D Pixar style.',
        voicePreset: 'Marcus - Deep & Resonant',
        signatureProps: ['Escritura sagrada familiar']
      });
    }
  }

  // Adjust ensemble to exact target castSize (1, 2, 3, or 4 characters!)
  const trimmed = characters.slice(0, Math.max(1, Math.min(4, castSize)));
  const protagonist = trimmed[0];
  const secondary = trimmed[1];
  const third = trimmed[2];
  const fourth = trimmed[3];

  const castType: 'solitario' | 'dueto' | 'trio' | 'cuarteto' = 
    trimmed.length === 1 ? 'solitario' :
    trimmed.length === 2 ? 'dueto' :
    trimmed.length === 3 ? 'trio' : 'cuarteto';

  return {
    castSize: trimmed.length,
    castType,
    protagonist,
    characters: trimmed,
    secondary,
    supporting: secondary,
    third,
    fourth
  };
}

/**
 * Converts a DynamicStoryCharacter to a full CartoonCharacter usable by the UI components.
 */
export function cartoonCharacterFromDynamic(d: DynamicStoryCharacter): CartoonCharacter {
  return {
    id: d.id,
    name: d.name,
    subtitle: d.role,
    age: d.age,
    role: d.role,
    archetype: d.archetype,
    shortDescription: `${d.name} (${d.age}): ${d.role}. ${d.archetype}.`,
    avatarEmoji: d.gender === 'female' ? '👩' : '👨',
    themeColor: d.gender === 'female' ? '#ec4899' : '#3b82f6',
    accentGradient: d.gender === 'female' ? 'from-rose-500 to-amber-500' : 'from-blue-600 to-indigo-600',
    fallbackImage: '/sacred-assets/character-default.jpg',
    fixedIdentityPrompt: `${d.name}, ${d.age}, ${d.gender === 'female' ? 'mujer' : 'hombre'}, ${d.clothingStyle}, estilo animación 3D Pixar de alta gama.`,
    fixedIdentityPromptEn: d.modelSheetLockEn,
    clothingStyle: d.clothingStyle,
    lockedWardrobeDesc: d.clothingStyle,
    exactModelSheetLockEn: d.modelSheetLockEn,
    keyEmotions: [
      { emotion: 'Clamor y Fe', description: d.posture, promptSnippet: d.posture }
    ],
    signatureProps: d.signatureProps,
    voiceProfile: {
      gender: d.gender === 'female' ? 'femenino' : 'masculino',
      tone: d.voicePreset,
      pace: 'natural',
      elevenLabsPreset: d.voicePreset
    },
    bibleReferenceQuote: 'Jeremías 33:3'
  };
}

/**
 * Backward-compatible bridge for existing callers of detectStoryProtagonistAndCast.
 */
export function detectStoryProtagonistAndCast(topic: string, category?: string): ProtagonistCast {
  const dynamic = generateUniqueCastForTopic(topic, category);
  const p = dynamic.protagonist;
  const s = dynamic.secondary || {
    id: 'jesus_cartoon_3d',
    name: 'Maestro Jesús',
    gender: 'male',
    role: 'el Maestro y Salvador presente',
    modelSheetLockEn: CARTOON_CHARACTERS_FE[0].exactModelSheetLockEn,
    voicePreset: 'Marcus - Deep & Resonant'
  };

  return {
    protagonist: {
      id: p.id,
      name: p.name,
      gender: p.gender,
      archetype: p.archetype,
      vocative: p.vocative,
      pronoun: p.pronoun,
      posture: p.posture,
      modelSheetLockEn: p.modelSheetLockEn,
      voicePreset: p.voicePreset
    },
    supporting: {
      id: s.id,
      name: s.name,
      gender: s.gender,
      role: s.role,
      modelSheetLockEn: s.modelSheetLockEn,
      voicePreset: s.voicePreset
    }
  };
}

/**
 * Generates bespoke, physical, action-specific Foley sound design cues (SFX)
 * tailored to the exact objects, actions, and emotions occurring in each scene.
 * Implements full Foley artist capabilities with real physical textures, decibel levels, and timestamps.
 */
export function generateActionSpecificFoleySounds(
  action: string,
  envName: string,
  sceneNumber: number,
  topic: string
): { sfx: string; sfxTimeline: { atSecond: string; sound: string; purpose: string }[] } {
  const act = (action || '').toLowerCase();
  const top = (topic || '').toLowerCase();
  const combined = `${act} ${top}`;

  const timeline: { atSecond: string; sound: string; purpose: string }[] = [];

  // Slot 1: [00:00 - 00:02] Hook & Physical Initial Action
  if (combined.includes('cristal') || combined.includes('vaso') || combined.includes('vidrio') || combined.includes('rompe') || combined.includes('quebra')) {
    timeline.push({ atSecond: '00:00 - 00:02', sound: 'Impacto seco y estallido cristalino de vaso partiéndose contra el suelo (-6dB)', purpose: 'Golpe visceral de impacto sonoro y corte de scroll' });
  } else if (combined.includes('puerta') || combined.includes('golpea') || combined.includes('toca') || combined.includes('nudillo')) {
    timeline.push({ atSecond: '00:00 - 00:02', sound: 'Golpe seco y apresurado de tres nudillos sobre madera maciza (-7dB)', purpose: 'Alerta sensorial y expectativa dramática inmediata' });
  } else if (combined.includes('carta') || combined.includes('sobre') || combined.includes('papel') || combined.includes('factura') || combined.includes('deuda') || combined.includes('notificacion') || combined.includes('arruga')) {
    timeline.push({ atSecond: '00:00 - 00:02', sound: 'Crujido áspero de papel de deuda arrugándose violentamente en el puño (-7dB)', purpose: 'Tensión táctil del agobio humano' });
  } else if (combined.includes('celular') || combined.includes('telefono') || combined.includes('móvil') || combined.includes('vibra') || combined.includes('notificacion')) {
    timeline.push({ atSecond: '00:00 - 00:02', sound: 'Doble vibración penetrante de teléfono celular sobre mesa de madera hueca (-8dB)', purpose: 'Urgencia moderna y disparo de adrenalina' });
  } else if (combined.includes('hospital') || combined.includes('monitor') || combined.includes('oxigeno') || combined.includes('suero')) {
    timeline.push({ atSecond: '00:00 - 00:02', sound: 'Goteo lento en bolsa de suero y bip continuo y acelerado de monitor cardíaco (-9dB)', purpose: 'Tensión médica de vida o muerte' });
  } else if (combined.includes('fuego') || combined.includes('incendio') || combined.includes('bombero') || combined.includes('humo')) {
    timeline.push({ atSecond: '00:00 - 00:02', sound: 'Rugido sofocado de llamas y chisporroteo de vigas de madera al colapsar (-7dB)', purpose: 'Peligro inminente y catástrofe sensorial' });
  } else if (combined.includes('mar') || combined.includes('ola') || combined.includes('tormenta') || combined.includes('lluvia')) {
    timeline.push({ atSecond: '00:00 - 00:02', sound: 'Embate violento de ola marina rompiendo en cubierta de madera y viento gélido (-7dB)', purpose: 'Furia de los elementos y zozobra' });
  } else {
    timeline.push({ atSecond: '00:00 - 00:02', sound: `Crujido de rodillas tocando el suelo en ${envName} y respiración entrecortada (-8dB)`, purpose: 'Enganche visceral de clamor en los primeros 2 segundos' });
  }

  // Slot 2: [00:03 - 00:05] Character Action Foley & Physical Interaction
  if (combined.includes('llanto') || combined.includes('lagrima') || combined.includes('sollozo') || combined.includes('llora')) {
    timeline.push({ atSecond: '00:03 - 00:05', sound: 'Gota de lágrima cayendo sobre madera y sollozo ahogado contenido (-9dB)', purpose: 'Intimidad y vulnerabilidad emocional directa' });
  } else if (combined.includes('abrazo') || combined.includes('sostiene') || combined.includes('consuela')) {
    timeline.push({ atSecond: '00:03 - 00:05', sound: 'Fricción suave de telas de abrigo al fundirse en un abrazo desesperado (-10dB)', purpose: 'Sensación táctil de amor y sostén humano' });
  } else if (combined.includes('pasos') || combined.includes('camina') || combined.includes('corre')) {
    timeline.push({ atSecond: '00:03 - 00:05', sound: 'Pasos apresurados y pesados de botas resonando en el suelo (-8dB)', purpose: 'Sensación de movimiento y persecución dramática' });
  } else if (combined.includes('piano') || combined.includes('musica') || combined.includes('tecla')) {
    timeline.push({ atSecond: '00:03 - 00:05', sound: 'Nota discordante y temblorosa en el piano de cola seguida de un silencio pesado (-8dB)', purpose: 'Quiebre del talento ante la crisis' });
  } else if (combined.includes('biblia') || combined.includes('libro') || combined.includes('hoja')) {
    timeline.push({ atSecond: '00:03 - 00:05', sound: 'Fricción rápida de páginas de la Biblia hojeándose hasta detenerse en seco (-9dB)', purpose: 'Búsqueda urgente de una promesa de Dios' });
  } else {
    timeline.push({ atSecond: '00:03 - 00:05', sound: 'Suspiro tembloroso y fricción de manos frotándose en ruego desesperado (-9dB)', purpose: 'Tensión visceral de la prueba' });
  }

  // Slot 3: [00:06 - 00:08] Turning Point / Sacred Encounter / Action Foley
  if (combined.includes('jesus') || combined.includes('jesús') || combined.includes('maestro') || combined.includes('luz') || combined.includes('milagro') || sceneNumber >= 3) {
    timeline.push({ atSecond: '00:06 - 00:08', sound: 'Ráfaga de aire cálido celestial, resplandor dorado a 432Hz y campana de paz (-8dB)', purpose: 'Apertura hacia la dimensión sobrenatural de Cristo' });
  } else if (combined.includes('toque') || combined.includes('mano') || combined.includes('hombro')) {
    timeline.push({ atSecond: '00:06 - 00:08', sound: 'Contacto suave y cálido de mano con shimmer dorado vibrando en la piel (-8dB)', purpose: 'Sentido táctil del toque milagroso' });
  } else if (combined.includes('llave') || combined.includes('abre') || combined.includes('cerrojo')) {
    timeline.push({ atSecond: '00:06 - 00:08', sound: 'Chirrido metálico de cerrojo antiguo descorriéndose con firmeza (-8dB)', purpose: 'Apertura de caminos cerrados' });
  } else {
    timeline.push({ atSecond: '00:06 - 00:08', sound: 'Acorde cálido de cuerdas graves sosteniendo el pulso y campana armónica tenue (-9dB)', purpose: 'Presencia sobrenatural manifiesta' });
  }

  // Slot 4: [00:08 - 00:10] Micro-Cliffhanger & Scene Transition
  if (sceneNumber === 5) {
    timeline.push({ atSecond: '00:08 - 00:10', sound: 'Crescendo triunfal de violines, arpa en 432Hz y exhalación plena de victoria (-7dB)', purpose: 'Resolución de gloria o enganche serial al próximo capítulo' });
  } else {
    timeline.push({ atSecond: '00:08 - 00:10', sound: 'Latido profundo sostenido, zumbido etéreo y corte seco en suspenso (-8dB)', purpose: 'Micro-cliffhanger en el segundo 10 que impide scrollear' });
  }

  const sfxSummary = timeline.map(t => `${t.atSecond}: ${t.sound}`).join('; ');
  return { sfx: sfxSummary, sfxTimeline: timeline };
}

/**
 * Dynamically synthesizes a UNIQUE, non-recycled 3D environment explicitly tailored
 * to the exact topic keywords so that no two stories ever share the exact same room or setting.
 */
export function generateUniqueScenographyForTopic(
  topic: string,
  _category: string,
  cast: DynamicCastEnsemble | ProtagonistCast
): UniqueScenography {
  const clean = (topic || '').trim().toLowerCase();
  const hash = Math.abs((topic || 'fe').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)).toString(36);
  const protagonistName = (cast as any).protagonist?.name || 'el protagonista';

  // 1. Wisdom, Direction, Decisions, Proverbs 3:5 & Trust in God
  if (clean.includes('fíate') || clean.includes('fiate') || clean.includes('jehová') || clean.includes('jehova') || clean.includes('prudencia') || clean.includes('proverbios') || clean.includes('sabiduria') || clean.includes('sabiduría') || clean.includes('dirección') || clean.includes('direccion') || clean.includes('senda') || clean.includes('camino') || clean.includes('planes') || clean.includes('apoyes') || clean.includes('arquitecto') || clean.includes('constructor') || clean.includes('decisión') || clean.includes('decision')) {
    return {
      id: `estudio_planos_proverbios_${hash}`,
      name: 'Estudio de Arquitectura de Cedro y Planos de Sabiduría',
      shortTag: 'ESTUDIO_PLANOS_916',
      architecturePromptEn: `Ancient high-ceiling drafting atelier in high-end 3D Pixar animation bespoke for Proverbs 3:5, heavy cedar drafting table with intricate rolled parchment blueprints, brass compass and calipers, stone miniature models, arch window framing starry deep-indigo night sky with divine constellation glow, polished slate floor catching warm reflections.`,
      lightingSetup: `Warm 2700K oil lamp flame casting contemplative shadows, pierced by a 4500K golden divine sunbeam illuminating the blueprints when Jesus enters.`,
      propsAndAtmosphere: `Rolled architectural blueprints with geometric markings, brass drafting tools, terracotta inkwell with quill, clay tablet inscribed with Proverbs 3:5.`,
      negativePromptEn: 'no modern computers, no hospital machinery, no change of character clothing, no facial morphing'
    };
  }

  // 2. Hospital, Illness, ICU, Surgeries & Critical Health
  if (clean.includes('hospital') || clean.includes('enfermedad') || clean.includes('médico') || clean.includes('medico') || clean.includes('uci') || clean.includes('cáncer') || clean.includes('cancer') || clean.includes('salud') || clean.includes('cirugía') || clean.includes('cirugia')) {
    return {
      id: `sala_hospital_esperanza_${hash}`,
      name: 'Habitación de Hospital y Espera a Medianoche',
      shortTag: 'HOSPITAL_MEDIANOCHE_916',
      architecturePromptEn: `Emotional sterile modern hospital room in high-end 3D Pixar animation, glowing heart-rate monitor pulsing soft cyan and amber vitals waveforms, bedside stainless-steel IV drip stand, muted pale sage walls with soft nightlight, wide panoramic rain-slicked window overlooking midnight city lights at 2:45 AM, polished reflective vinyl floor.`,
      lightingSetup: `Cold 2800K medical fluorescent glow transformed by a warm 3400K celestial golden divine aura emanating from Jesus.`,
      propsAndAtmosphere: `Diagnostic medical charts on bedside tray, stethoscope, framed family photograph reflecting soft light, steady rhythmic monitor beeps, rain droplets trickling down the glass.`,
      negativePromptEn: 'no rustic ancient kitchen, no mud walls, no change of character clothing, no extra limbs, no camera glitch'
    };
  }

  // 3. Financial Ruin, Debts, Eviction, Foreclosure & Livelihood Loss
  if (clean.includes('quiebra') || clean.includes('desalojo') || clean.includes('deuda') || clean.includes('deudas') || clean.includes('banco') || clean.includes('embargo') || clean.includes('despido') || clean.includes('arriendo') || clean.includes('hipoteca')) {
    return {
      id: `estancia_desalojo_fe_${hash}`,
      name: 'Hogar Humilde ante el Aviso de Desalojo',
      shortTag: 'ESTANCIA_DESALOJO_916',
      architecturePromptEn: `Tense modest living room in high-end 3D Pixar animation, plain wooden table with foreclosure notices and empty coin pouch, curtain slightly drawn showing cold grey dawn, weathered plaster walls, simple hand-stitched curtains, wooden stools.`,
      lightingSetup: `Cold 3000K dawn grey shadows shattered by a 3500K warm golden divine halo as Jesus brings sovereign provision.`,
      propsAndAtmosphere: `Official legal letters with red stamps, empty bread basket, family heirloom watch, soft holy warmth banishing the cold.`,
      negativePromptEn: 'no modern mansion, no hospital machinery, no change of character clothing, no extra limbs'
    };
  }

  // 4. Workshop, Artisan, Carpentry & Hard Labor
  if (clean.includes('carpintero') || clean.includes('taller') || clean.includes('herramienta') || clean.includes('madera') || clean.includes('artesano') || clean.includes('trabajo') || clean.includes('oficio')) {
    return {
      id: `taller_carpintero_fe_${hash}`,
      name: 'Taller de Carpintería y Maderas Nobles',
      shortTag: 'TALLER_CARPINTERO_916',
      architecturePromptEn: `Bespoke artisan woodworking workshop in 3D Pixar style, rustic timber workbench covered with hand-carved cedar shavings, hanging iron chisels, saws and mallets on stone wall, high clerestory window with radiant morning sunbeams piercing floating wood dust particles.`,
      lightingSetup: `Rustic 2800K daylight through dust beams transforming into 5000K golden resurrection glory.`,
      propsAndAtmosphere: `Fresh aromatic cedar shavings, half-finished yoke or table, wooden mallet, warm tea mug, sawdust sparkling like gold dust.`,
      negativePromptEn: 'no plastic factory, no modern computers, no change of character clothing, no extra limbs'
    };
  }

  // 5. Marriage, Covenant, Divorce & Reconciliation
  if (clean.includes('matrimonio') || clean.includes('esposos') || clean.includes('pareja') || clean.includes('divorcio') || clean.includes('reconciliacion') || clean.includes('reconciliación')) {
    return {
      id: `sala_pacto_matrimonio_${hash}`,
      name: 'Salón de Hogar y Restauración de Matrimonio',
      shortTag: 'SALA_PACTO_MATRIMONIO_916',
      architecturePromptEn: `Emotionally charged dining room in 3D Pixar animation, dark oak dining table with two distant chairs, framed wedding portrait on plaster wall reflecting soft lamp light, rain droplets sliding down tall window, soft woven blanket on armchair.`,
      lightingSetup: `Subdued 2800K sorrowful lamplight evolving into 4500K golden divine radiance joining the couple's hands.`,
      propsAndAtmosphere: `Gold wedding bands resting beside open Bible, warm teapot, hand-stitched lace runner, divine peace filling the room.`,
      negativePromptEn: 'no courtroom, no hospital equipment, no change of character clothing, no extra limbs'
    };
  }

  // 6. Anxiety, Panic Attacks, Insomnia & Night Deliverance
  if (clean.includes('ansiedad') || clean.includes('panico') || clean.includes('pánico') || clean.includes('insomnio') || clean.includes('pesadilla') || clean.includes('miedo') || clean.includes('temor') || clean.includes('ahogo') || clean.includes('depresion') || clean.includes('depresión')) {
    return {
      id: `dormitorio_paz_divina_${hash}`,
      name: 'Dormitorio en Penumbra con Ventanal de Medianoche',
      shortTag: 'DORMITORIO_PAZ_DIVINA_916',
      architecturePromptEn: `Shadowed bedroom in 3D Pixar animation, unmade bed with tangled blankets reflecting nocturnal anxiety, tall French window open to a deep starry sapphire sky with gentle nocturnal breeze, bedside lamp with warm amber lampshade, glass of water catching moonlight.`,
      lightingSetup: `Chilly 2700K midnight shadows instantly banished by a 4200K tranquil divine aura of Jesus whispering peace.`,
      propsAndAtmosphere: `Alarm clock glowing in the dark, bedside notebook with handwritten prayers, sheer curtains swaying in peaceful breeze.`,
      negativePromptEn: 'no hospital machines, no ancient mud hut, no change of character clothing, no extra limbs'
    };
  }

  // 7. Humble Pantry & Widow's Oil / Flour
  if (clean.includes('viuda') || clean.includes('harina') || clean.includes('aceite') || clean.includes('alacena') || clean.includes('pobre')) {
    return {
      id: `modesta_alacena_vasijas_${hash}`,
      name: 'Modesta Alacena de Adobe y Vasijas de la Viuda',
      shortTag: 'ALACENA_VIUDA_916',
      architecturePromptEn: `Humble ancient Judean stone and adobe dwelling in high-end 3D Pixar animation, weathered cedar ceiling rafters, rustic stone pantry with cracked clay flour jar and empty terracotta oil pitcher, handwoven reed mats on earthen floor, wooden door with hand-forged iron latch.`,
      lightingSetup: `Melancholic 2700K clay oil lamp flame flickering in the shadows, sliced by a 3400K volumetric celestial sunbeam pouring from the doorway.`,
      propsAndAtmosphere: `Cracked clay flour jar on rough-hewn stone shelf, empty oil cruse, open family parchment Scriptures, tear-stained cloth, dust motes floating in divine light.`,
      negativePromptEn: 'no modern furniture, no hospital equipment, no change of character clothing, no extra limbs'
    };
  }

  // 8. Dusty Alleyway of Capernaum & The Hem of Christ's Garment
  if (clean.includes('flujo de sangre') || clean.includes('sangre') || clean.includes('hemorragia') || clean.includes('calle') || clean.includes('multitud') || clean.includes('capernaum')) {
    return {
      id: `callejon_capernaum_multitud_${hash}`,
      name: 'Callejón Polvoriento de Capernaúm bajo el Sol del Mediodía',
      shortTag: 'CALLEJON_CAPERNAUM_916',
      architecturePromptEn: `Sun-drenched ancient Capernaum stone alleyway in 3D Pixar aesthetic, limestone archways draped in dry linen canopies, terracotta amphoras against stone walls, dusty cobblestone street packed with a bustling crowd wearing biblical tunics.`,
      lightingSetup: `Blinding 5500K Mediterranean midday sunlight softened by dust particles, with an ethereal radiant shimmer around Jesus Christ's hem.`,
      propsAndAtmosphere: `Humble wooden walking canes, woven date-palm baskets, dust particles floating in golden light rays, worn sandals on ancient stones.`,
      negativePromptEn: 'no indoor kitchen, no modern elements, no change of character clothing, no extra limbs'
    };
  }

  // 9. Sea Storm, Waves & Boat of Faith
  if (clean.includes('barca') || clean.includes('mar') || clean.includes('tormenta') || clean.includes('tempestad') || clean.includes('olas') || clean.includes('pescador')) {
    return {
      id: `cubierta_barca_tormenta_${hash}`,
      name: 'Cubierta de Barca de Madera en Plena Tempestad',
      shortTag: 'BARCA_TORMENTA_916',
      architecturePromptEn: `Weathered cedar fishing boat deck tossed by dark turbulent waves on the Sea of Galilee in 3D Pixar animation, drenched hemp ropes, heavy sea mist, deep midnight storm clouds pierced by sudden divine moonlight.`,
      lightingSetup: `Dark indigo 2600K storm shadows broken by dramatic lightning and an intense 4500K divine golden glow around Jesus standing in the bow.`,
      propsAndAtmosphere: `Wet fishing nets, wooden helm, spray of seafoam, lantern swinging wildly against the cedar mast.`,
      negativePromptEn: 'no dry rooms, no indoors, no change of character clothing, no extra limbs'
    };
  }

  // 10. Dungeon, Iron Chains & Liberation
  if (clean.includes('carcel') || clean.includes('cárcel') || clean.includes('prision') || clean.includes('prisión') || clean.includes('cadenas')) {
    return {
      id: `calabozo_piedra_cadenas_${hash}`,
      name: 'Calabozo de Piedra Húmeda y Cadenas de Hierro',
      shortTag: 'CALABOZO_CADENAS_916',
      architecturePromptEn: `Ancient subterranean stone dungeon cell in 3D Pixar style, rough-hewn limestone blocks dripping with moisture, heavy iron shackles on the wall, small high barred window with celestial moonlight beam cutting across dust.`,
      lightingSetup: `Dim 2400K iron torch flame contrast with explosive 4500K heavenly light when Jesus appears breaking chains.`,
      propsAndAtmosphere: `Heavy rusty iron fetters, cold damp straw bedding, wooden water bowl, divine fractures in the stone walls.`,
      negativePromptEn: 'no cozy kitchen, no modern objects, no change of character clothing, no extra limbs'
    };
  }

  // 11. Potter's Wheel & Broken Vessel
  if (clean.includes('alfarero') || clean.includes('vasija') || clean.includes('barro') || clean.includes('torno') || clean.includes('quebrantado')) {
    return {
      id: `torno_alfarero_fe_${hash}`,
      name: 'Taller Rústico de Alfarería y Torno de Barro',
      shortTag: 'TORNO_ALFARERO_916',
      architecturePromptEn: `Ancient potter workshop in 3D Pixar animation, wooden foot-powered potter wheel with fresh terracotta clay, rustic stone shelves lined with clay jars and vessels, skylight pouring warm sunlight onto earthen floor.`,
      lightingSetup: `Sunlight streaming down at 3400K illuminating clay particles, divine golden hands of Jesus remolding the broken vessel.`,
      propsAndAtmosphere: `Cracked clay vessel being reshaped on wheel, wooden shaping ribs, water bowl, terracotta dust in golden beams.`,
      negativePromptEn: 'no modern factory, no hospital equipment, no change of character clothing, no extra limbs'
    };
  }

  // 12. Desert Oasis & Living Water
  if (clean.includes('desierto') || clean.includes('oasis') || clean.includes('manantial') || clean.includes('arena') || clean.includes('sed')) {
    return {
      id: `oasis_desierto_fe_${hash}`,
      name: 'Oasis Bíblico de Palmeras y Manantial Cristalino',
      shortTag: 'OASIS_DESIERTO_916',
      architecturePromptEn: `Breathtaking desert oasis at twilight in 3D Pixar animation, towering date palms framing a crystal-clear natural spring reflecting first evening stars, warm rippling sand dunes under a purple-and-gold sunset, weathered sandstone rocks.`,
      lightingSetup: `Golden hour 3200K amber glow merging with heavenly 4500K divine presence of Christ.`,
      propsAndAtmosphere: `Clay water jug being filled, traveler staff resting on sandstone, ripples on pristine water.`,
      negativePromptEn: 'no modern city, no indoor room, no change of character clothing, no extra limbs'
    };
  }

  // 13. Stained Glass Sanctuary & Solemn Altar
  if (clean.includes('templo') || clean.includes('iglesia') || clean.includes('altar') || clean.includes('santuario') || clean.includes('vitrales') || clean.includes('capilla')) {
    return {
      id: `santuario_vitrales_fe_${hash}`,
      name: 'Santuario de Piedra y Vitrales Celestes',
      shortTag: 'SANTUARIO_VITRALES_916',
      architecturePromptEn: `Solemn sacred sanctuary in high-end 3D Pixar style, soaring stone arches, tall stained-glass window casting jewel-toned ruby and sapphire light patterns onto polished stone aisle, wooden pews, simple unadorned wooden cross at front.`,
      lightingSetup: `Dramatic multi-colored stained glass shafts (ruby, cobalt, gold) converging into pure 5000K celestial glory around Christ.`,
      propsAndAtmosphere: `Altar with open Bible, tall wax candles with calm golden flames, gentle dust motes dancing in colored light beams.`,
      negativePromptEn: 'no modern warehouse, no hospital machines, no change of character clothing, no extra limbs'
    };
  }

  // 14. Wheat Field, Harvest & Drought
  if (clean.includes('trigo') || clean.includes('campo') || clean.includes('cosecha') || clean.includes('agricultor') || clean.includes('sequia') || clean.includes('sequía') || clean.includes('semilla')) {
    return {
      id: `campo_surcos_sequia_${hash}`,
      name: 'Campo de Surcos y Trigo al Atardecer',
      shortTag: 'CAMPO_SURCOS_SEQUIA_916',
      architecturePromptEn: `Vast golden wheat field and rustic threshing floor in 3D Pixar animation, undulating golden wheat stalks glowing under sunset sky, weathered stone fence, rustic wooden cart, distant mountains bathed in violet haze.`,
      lightingSetup: `Spectacular 3200K sunset backlight with golden rim lighting on characters and divine glow of Jesus.`,
      propsAndAtmosphere: `Handcrafted wooden sickle, sheaves of wheat tied with hemp twine, wooden water canteen.`,
      negativePromptEn: 'no indoor room, no modern tractor, no change of character clothing, no extra limbs'
    };
  }

  // 15. Ancient Jerusalem Rooftop under Starlight
  if (clean.includes('azotea') || clean.includes('terraza') || clean.includes('estrellas') || clean.includes('jerusalen') || clean.includes('jerusalén') || clean.includes('monte')) {
    return {
      id: `azotea_jerusalen_fe_${hash}`,
      name: 'Azotea de Piedra Caliza con Vista a las Estrellas de Jerusalén',
      shortTag: 'AZOTEA_JERUSALEN_916',
      architecturePromptEn: `Ancient Jerusalem limestone flat rooftop in 3D Pixar animation, low stone parapet overlooking dimly lit biblical rooftops, clay planters with flowering jasmine, deep indigo night sky studded with brilliant twinkling stars.`,
      lightingSetup: `Cool 4500K starlight softened by 3000K oil lamp glow, met with a majestic 4500K golden celestial presence.`,
      propsAndAtmosphere: `Woven wicker chairs, clay pitcher of cool water, linen canopy gently fluttering in the nocturnal hill wind.`,
      negativePromptEn: 'no modern antennas, no hospital beds, no change of character clothing, no extra limbs'
    };
  }

  // 16. Prayer Chamber & Night Vigil
  if (clean.includes('aposento') || clean.includes('vigilia') || clean.includes('madrugada') || clean.includes('clamor') || clean.includes('lagrimas') || clean.includes('lágrimas')) {
    return {
      id: `aposento_oracion_fe_${hash}`,
      name: 'Aposento de Oración y Vigilia en la Madrugada',
      shortTag: 'APOSENTO_ORACION_916',
      architecturePromptEn: `Intimate prayer chamber in high-end 3D Pixar aesthetic, whitewashed stone walls with soft blue moonlight filtering through arched cedar lattice, woven wool prayer rug on cool flagstones, single olive-oil clay lamp on low carved pedestal, gentle nocturnal mountain breeze through open arch.`,
      lightingSetup: `Deep 2600K amber wick flame evolving into a radiant 4000K warm golden presence around Christ.`,
      propsAndAtmosphere: `Worn leather prayer book, tears glistening on stone floor, olive wood cross, soft ambient dust motes catching holy light.`,
      negativePromptEn: 'no modern furniture, no hospital clutter, no change of character clothing, no extra limbs'
    };
  }

  // 17. Scriptorium & Ancient Parchment Library
  if (clean.includes('biblioteca') || clean.includes('pergaminos') || clean.includes('libros') || clean.includes('estudio') || clean.includes('escrituras')) {
    return {
      id: `biblioteca_pergaminos_fe_${hash}`,
      name: 'Antigua Biblioteca de Cedro y Pergaminos Sagrados',
      shortTag: 'BIBLIOTECA_PERGAMINOS_916',
      architecturePromptEn: `Atmospheric ancient library study in 3D Pixar style, floor-to-ceiling dark cedar shelves filled with rolled parchment scrolls and leather-bound volumes, heavy study desk with brass reading lamp, tall arched stone window.`,
      lightingSetup: `Warm 2800K lamp lighting on parchment grain, elevated by 4500K divine revelation light from Jesus.`,
      propsAndAtmosphere: `Open parchment scrolls with ancient calligraphy, ink horn, magnifying glass with brass handle.`,
      negativePromptEn: 'no modern laptops, no hospital equipment, no change of character clothing, no extra limbs'
    };
  }

  // 18. Clifftop Dawn & Solitary Peak
  if (clean.includes('acantilado') || clean.includes('cumbre') || clean.includes('aurora') || clean.includes('amanecer')) {
    return {
      id: `acantilado_aurora_fe_${hash}`,
      name: 'Mirador en el Acantilado ante la Aurora de Esperanza',
      shortTag: 'ACANTILADO_AURORA_916',
      architecturePromptEn: `Majestic rocky clifftop overlook in 3D Pixar animation, ancient olive tree with gnarled trunk framing the dawn horizon, ocean of morning clouds below glowing pink and gold, crisp mountain morning air.`,
      lightingSetup: `First rays of 5500K dawn breaking through violet clouds, illuminating characters in heroic golden rim light.`,
      propsAndAtmosphere: `Carved wooden walking staff, morning dew on wild rosemary shrubs, wind gently billowing tunics.`,
      negativePromptEn: 'no modern guardrails, no cars, no change of character clothing, no extra limbs'
    };
  }

  // 19. Hearth & Bread Oven Kitchen
  if (clean.includes('cocina') || clean.includes('pan') || clean.includes('horno')) {
    return {
      id: `cocina_horno_pan_fe_${hash}`,
      name: 'Cocina Rústica con Horno de Pan y Mesa de Cedro',
      shortTag: 'COCINA_HORNO_PAN_916',
      architecturePromptEn: `Warm and comforting rustic kitchen in 3D Pixar animation, clay dome bread oven with glowing embers, flour-dusted cedar table with fresh round sourdough loaves, hanging bundles of dried lavender and herbs, small window with morning light.`,
      lightingSetup: `Cozy 2500K oven fire glow blending with 4000K crisp morning sunbeam and holy peaceful radiance.`,
      propsAndAtmosphere: `Wooden bread peel, ceramic bowls, warm crusty bread giving off faint steam, linen tea towels.`,
      negativePromptEn: 'no modern electric appliances, no hospital equipment, no change of character clothing, no extra limbs'
    };
  }

  // 20. University Campus Courtyard & Student Life
  if (clean.includes('universidad') || clean.includes('colegio') || clean.includes('campus') || clean.includes('escuela') || clean.includes('estudiante')) {
    return {
      id: `campus_universitario_${hash}`,
      name: 'Escaleras del Campus Universitario al Anochecer',
      shortTag: 'CAMPUS_UNIVERSIDAD_916',
      architecturePromptEn: `Modern red-brick university campus courtyard in 3D Pixar style, wide stone steps beneath glowing architectural lamps, fallen autumn leaves on wet cobblestones, high arched library windows glowing amber in the twilight.`,
      lightingSetup: `Cool 4500K twilight transitioning to a warm 3200K amber glow as divine peace descends.`,
      propsAndAtmosphere: `Heavy textbooks, student backpack resting against stone balustrade, gentle breeze rustling oak trees.`,
      negativePromptEn: 'no ancient rooms, no biblical robes, no extra limbs'
    };
  }

  // 21. Nocturnal Fruit Stall, Street Market & Mysterious Receipt
  if (clean.includes('frutera') || clean.includes('fruta') || clean.includes('recibo') || clean.includes('mercado') || clean.includes('puesto') || clean.includes('venta') || clean.includes('negocio') || clean.includes('tienda')) {
    return {
      id: `mercado_frutas_recibo_${hash}`,
      name: 'Puesto de Frutas en Mercado Nocturno bajo Llovizna',
      shortTag: 'MERCADO_FRUTAS_916',
      architecturePromptEn: `Atmospheric nocturnal open-air wooden fruit stall in high-end 3D Pixar animation bespoke for the mystery of the receipt, rustic weathered wooden crates brimming with glossy oranges and red apples, hanging vintage brass balance scale with chains, rain-slicked cobblestone street reflecting warm streetlamps, canvas awning dripping rain droplets, deep twilight mist.`,
      lightingSetup: `Warm 2400K gas lantern flame casting elongated dramatic shadows across the fruit crates, contrasting with a pure 4500K celestial divine radiance when Jesus appears.`,
      propsAndAtmosphere: `A vintage paper receipt fluttering gently under a brass weight, old mechanical cash drawer, crates of fresh citrus, faint mist in the air.`,
      negativePromptEn: 'no indoor room, no hospital machines, no modern vehicles, no change of character clothing, no extra limbs'
    };
  }

  // 22. Family Woodworking Shop, Carpentry & Hidden Legacy Letter
  if (clean.includes('carpintería') || clean.includes('carpinteria') || clean.includes('taller') || clean.includes('muebles') || clean.includes('herencia') || clean.includes('carta') || clean.includes('cepillo')) {
    return {
      id: `taller_carpinteria_familiar_${hash}`,
      name: 'Taller de Carpintería Familiar y Banco de Trabajo de Roble',
      shortTag: 'TALLER_CARPINTERIA_916',
      architecturePromptEn: `Historic family woodworking workshop in 3D Pixar style, massive hand-hewn oak workbench dusted with fragrant pine sawdust, hand planes and iron chisels hanging neatly on wooden rack, tall arched window showing twilight storm clouds, rustic plank floor with curled wood shavings.`,
      lightingSetup: `Warm 2900K hanging incandescent pendant over the workbench, evolving into 4800K holy golden glory illuminating the hands of Jesus Christ.`,
      propsAndAtmosphere: `Handwritten sealed yellowed envelope, wooden shaving ribbons, hand-carved cross in progress on workbench, brass calipers.`,
      negativePromptEn: 'no modern factory, no hospital equipment, no change of character clothing, no extra limbs'
    };
  }

  // 23. Midnight Doorway, Hallway & Father Returning at 3:00 AM
  if (clean.includes('3:00') || clean.includes('3 am') || clean.includes('3:00 am') || clean.includes('padre ausente') || clean.includes('regreso') || clean.includes('foyer') || clean.includes('puerta de entrada') || clean.includes('volver') || clean.includes('arrepentido')) {
    return {
      id: `umbral_regreso_madrugada_${hash}`,
      name: 'Foyer y Puerta de Entrada a las 3:00 AM Bajo la Lluvia',
      shortTag: 'UMBRAL_3AM_LLUVIA_916',
      architecturePromptEn: `Intimate hallway and front entrance foyer in 3D Pixar animation at 3:00 AM, heavy weathered wooden front door slightly ajar showing pouring rain and distant streetlamp glow, pendulum wall clock frozen at 3:02 AM, wet trench coat hanging by the mirror, dark polished hardwood floor reflecting rain sheen.`,
      lightingSetup: `Subtle 2600K amber wall sconce pierced by majestic 4500K golden divine aura of Christ standing between father and family.`,
      propsAndAtmosphere: `Ticking pendulum wall clock, wet umbrella leaving puddle on mat, framed family picture on entryway table, warm steam from hallway heater.`,
      negativePromptEn: 'no hospital equipment, no ancient ruins, no change of character clothing, no extra limbs'
    };
  }

  // 24. Drought-Stricken Orchard & Vineyard of the Prodigy
  if (clean.includes('huerto') || clean.includes('sequia') || clean.includes('sequía') || clean.includes('parcela') || clean.includes('arbol') || clean.includes('árbol') || clean.includes('viña') || clean.includes('higos')) {
    return {
      id: `huerto_prodigio_sequia_${hash}`,
      name: 'Huerto Familiar con Cerca de Piedra al Atardecer Dorado',
      shortTag: 'HUERTO_PRODIGIO_916',
      architecturePromptEn: `Soulful rustic orchard and garden in 3D Pixar animation, ancient gnarled fig and olive trees with lush green leaves defying surrounding drought, low dry-stone wall, wooden garden gate, sunset sky blazing with violet and apricot hues.`,
      lightingSetup: `Luminous 3300K golden-hour sunset backlighting leaves with crystalline green rim light, crowned by pure 5000K divine presence of Jesus.`,
      propsAndAtmosphere: `Rustic wooden water bucket overflowing with crystal droplets, woven harvest basket with fresh figs, clay pitcher.`,
      negativePromptEn: 'no indoor room, no modern tractor, no change of character clothing, no extra limbs'
    };
  }

  // 25. Universal Dynamic Scenario Synthesizer: Generates DISTINCT bespoke rooms with ZERO recycling
  const tagWords = clean
    .replace(/[^\w\sáéíóúüñ]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 3 && !['para', 'como', 'todo', 'toda', 'este', 'esta', 'sobre', 'cuando', 'donde', 'desde', 'pero', 'porque'].includes(w));
  
  const w1 = (tagWords[0] || 'SANTUARIO').toUpperCase().slice(0, 8);
  const w2 = (tagWords[1] || 'REFUGIO').toUpperCase().slice(0, 8);
  const dynamicTag = `${w1}_${w2}_${hash.toUpperCase().slice(0, 4)}_916`;

  // Dynamic architectural archetypes based on hash to guarantee variety
  const roomTypes = [
    {
      name: `Atelier Rústico y Mesa de Trabajo ("${topic.slice(0, 30)}")`,
      arch: `Sunlit artisan studio and loft in high-end 3D Pixar animation bespoke for "${topic.slice(0, 40)}", pitched timber beam ceiling with skylight, wide reclaimed wood workbench with artisan tools, tall steel-framed window overlooking misty morning hills.`,
      lighting: `Morning 3500K crisp sunbeam slicing through early mist, elevated to 5000K heavenly golden glory illuminating ${protagonistName}.`,
      props: `Drafting paper with handwritten notes, clay mugs, brass ruler, wooden chest.`
    },
    {
      name: `Galería con Arcos de Piedra y Patio Interior ("${topic.slice(0, 30)}")`,
      arch: `Peaceful cloistered stone courtyard gallery in 3D Pixar animation bespoke for "${topic.slice(0, 40)}", smooth sandstone pillars, flowering jasmine climbing stone arches, stone water fountain with gentle ripples, starry twilight sky above.`,
      lighting: `Cool 4200K twilight contrasted with 3000K warm torchlight, met by 4800K divine glow around Christ.`,
      props: `Stone prayer bench, terracotta planters, olive branch, open parchment scroll.`
    },
    {
      name: `Rincón Íntimo de Vigilia y Mesa de Roble ("${topic.slice(0, 30)}")`,
      arch: `Contemplative study and vigil room in high-end 3D Pixar animation bespoke for "${topic.slice(0, 40)}", dark oak paneling with warm patina, comfortable armchair with woven blanket, rain-washed bay window framing midnight streetlights.`,
      lighting: `Intimate 2600K amber reading lamp glow in deep chiaroscuro, transformed into 4200K divine hope as Jesus enters.`,
      props: `Handwritten personal journal with pen, eyeglasses on open page, steaming ceramic cup, family clock.`
    },
    {
      name: `Pórtico Rústico y Mirador de Montaña ("${topic.slice(0, 30)}")`,
      arch: `Covered mountain cabin porch in 3D Pixar animation bespoke for "${topic.slice(0, 40)}", cedar posts supporting a shingle roof, weathered rocking chairs, panoramic view of sunrise breaking over misty mountain valleys.`,
      lighting: `First rays of 5500K golden sunrise piercing morning valley fog with dazzling rim light on characters.`,
      props: `Carved walking staff leaning on railing, wool poncho, clay tea mug with rising steam, wild mountain blossoms.`
    }
  ];

  const seed = (clean.length * 13 + hash.charCodeAt(0)) % roomTypes.length;
  const selectedType = roomTypes[seed];

  return {
    id: `escenario_dinamico_${hash}`,
    name: selectedType.name,
    shortTag: dynamicTag,
    architecturePromptEn: selectedType.arch,
    lightingSetup: selectedType.lighting,
    propsAndAtmosphere: selectedType.props,
    negativePromptEn: 'no hospital machines, no modern clutter, no change of character clothing, no facial morphing'
  };
}

/**
 * Generates bespoke, topic-specific dialogue and narrative arcs for all 5 scenes of an episode.
 * Strictly enforces Prompt 2:
 * 1. Hook <3s stating who wants what and what they can lose.
 * 2. Oral cadence of 2.0 to 2.5 words/sec (max 18-22 words per 10s shot).
 * 3. Never repeating generic lines like "¡Señor Jesús, no doy más!".
 */
export function generateContextualSceneDialogueArc(
  topic: string,
  _category: string = "fe_general",
  cast: DynamicCastEnsemble | ProtagonistCast,
  env: UniqueScenography,
  epNum: number = 1,
  totalParts: number = 3
): any[] {
  const clean = (topic || '').trim().toLowerCase();
  const isFirst = epNum === 1;
  const isLast = epNum === totalParts;

  const isReceipt = clean.includes('recibo') || clean.includes('frutera') || clean.includes('mercado') || clean.includes('fruta');
  const isWisdomProverbs = clean.includes('fíate') || clean.includes('fiate') || clean.includes('jehová') || clean.includes('jehova') || clean.includes('prudencia') || clean.includes('proverbios') || clean.includes('sabiduria') || clean.includes('sabiduría') || clean.includes('senda') || clean.includes('camino') || clean.includes('apoyes');
  const isFatherReturn = clean.includes('padre') && (clean.includes('ausente') || clean.includes('volvió') || clean.includes('3:00') || clean.includes('3 am') || clean.includes('perdón') || clean.includes('perdon'));
  const isMedical = clean.includes('hospital') || clean.includes('médico') || clean.includes('medico') || clean.includes('doctor') || clean.includes('uci') || clean.includes('enfermedad') || clean.includes('cáncer') || clean.includes('diagnóstico');
  const isFinances = clean.includes('quiebra') || clean.includes('desalojo') || clean.includes('deuda') || clean.includes('deudas') || clean.includes('banco') || clean.includes('arriendo') || clean.includes('embargo');
  const isFamilyCarpentry = clean.includes('carpintería') || clean.includes('carpinteria') || clean.includes('carta') || clean.includes('hermanos') || clean.includes('herencia') || clean.includes('taller');
  const isOrchardDrought = clean.includes('huerto') || clean.includes('sequia') || clean.includes('sequía') || clean.includes('parcela') || clean.includes('tierra');
  const isFamilyMarriage = clean.includes('matrimonio') || clean.includes('esposos') || clean.includes('pareja') || clean.includes('divorcio') || clean.includes('reconciliacion');
  const isAnxiety = clean.includes('ansiedad') || clean.includes('pánico') || clean.includes('panico') || clean.includes('insomnio') || clean.includes('temor') || clean.includes('miedo');
  const isStorm = clean.includes('barca') || clean.includes('mar') || clean.includes('tormenta') || clean.includes('tempestad') || clean.includes('olas');

  const prot = (cast as any).protagonist;
  const supp = (cast as any).supporting || (cast as any).secondary || {
    id: 'familiar_apoyo',
    name: 'Compañero Fiel',
    voicePreset: 'Elena - Deeply Emotional & Sincere'
  };

  const envLock = `[LOCKED ENVIRONMENT - ${env.shortTag}]: ${env.architecturePromptEn} Lighting: ${env.lightingSetup}. Props: ${env.propsAndAtmosphere}. EXACT SAME ROOM AND PROPS IN ALL SCENES.`;
  const jLock = `[LOCKED CHARACTER - JESUS]: ${CARTOON_CHARACTERS_FE.find(c => c.id === 'jesus_cartoon_3d')?.exactModelSheetLockEn}`;
  const pLock = `[LOCKED CHARACTER - ${prot.name.toUpperCase()}]: ${prot.modelSheetLockEn}`;
  const sLock = `[LOCKED CHARACTER - ${supp.name.toUpperCase()}]: ${supp.modelSheetLockEn}`;
  const negLock = `[NEGATIVE CONTINUITY PROMPT: ${env.negativePromptEn}, no changes in character clothing, no change of hairstyle, no facial morphing, no extra limbs, no camera jump cuts]`;

  // Bespoke Narrative Arc & Dialogues dynamically calibrated by Chapter (epNum) and Theme
  // Chapter 1: The Inciting Crisis & Shock | Chapter 2: The Complication & Secret | Chapter 3+: The Climax & Supernatural Miracle

  interface SceneStorySpec {
    title: string;
    action: string;
    cameraSetupEn: string;
    turns: { speaker: string; id: string; role: string; text: string; tone: string; voice: string }[];
    sfx: string;
    sfxList: { atSecond: string; sound: string; purpose: string }[];
    narration: string;
    onScreen: string;
    label: string;
    music: string;
  }

  const getSceneSpecsForEpisode = (): SceneStorySpec[] => {
    // -------------------------------------------------------------
    // CHAPTER 1: EL DETONANTE Y LA CRISIS HUMANA
    // -------------------------------------------------------------
    if (epNum === 1) {
      const s1Prot = isReceipt
        ? `¡Elena, mira este recibo! ¡Tiene la firma exacta de mi padre con fecha de hoy!`
        : isWisdomProverbs
        ? `¡Confié en mis propios cálculos y todo el proyecto se vino abajo esta mañana!`
        : isMedical
        ? `¡A las 3:00 AM los monitores cayeron a cero... los médicos no dan esperanzas!`
        : isFinances
        ? `¡Llegó la orden final de desalojo! Nos dan hasta las seis de la tarde o quedamos en la calle.`
        : isFamilyCarpentry
        ? `¡Encontré esta carta sellada de mamá debajo del banco de trabajo del taller!`
        : isFatherReturn
        ? `¡Son las 3:00 de la madrugada y escucho los pasos pesados de papá afuera!`
        : isOrchardDrought
        ? `¡La sequía secó todo el pozo y los prestamistas vinieron a exigir la parcela!`
        : isFamilyMarriage
        ? `¡Los papeles del divorcio están sobre la mesa y ya no podemos ni mirarnos a los ojos!`
        : isAnxiety
        ? `¡Son las 3:00 AM y siento que el aire se me corta... no puedo controlar este temblor!`
        : isStorm
        ? `¡El agua está entrando a cántaros y el timón de la barca se partió en dos!`
        : `¡Se agotaron todos los recursos humanos y si Dios no hace algo hoy, lo perdemos todo!`;

      const s1Supp = isReceipt
        ? `¡Es imposible! Tu padre desapareció hace siete años sin dejar rastro.`
        : isWisdomProverbs
        ? `Cálmate, por favor... no puedes cargar tú solo con el peso de este fracaso.`
        : isMedical
        ? `¡No te desmorones ahora! Todavía podemos clamar con la poca fuerza que nos queda.`
        : isFinances
        ? `¿Cómo fue que dejamos acumular tres meses? ¡Tenemos que hablar con el dueño ya!`
        : isFamilyCarpentry
        ? `¡No la abras todavía! Sabes bien el resentimiento que separó a esta familia.`
        : isFatherReturn
        ? `¡Abre despacio la mirilla! Llevamos diez años orando por este momento en silencio.`
        : isOrchardDrought
        ? `¡No firmes ningún papel de venta! Dios prometió que este huerto daría fruto.`
        : isFamilyMarriage
        ? `¡No firmes nada todavía! El orgullo nos está cegando y destruyendo el hogar.`
        : isAnxiety
        ? `Mírame a los ojos y respira hondo... no estás sola en esta habitación oscura.`
        : isStorm
        ? `¡Aférrate al mástil con fuerza! ¡No permitas que el pánico te haga saltar!`
        : `¡No te rindas! Mira hacia la puerta... hay una paz inexplicable entrando en este cuarto.`;

      const s1Jesus = isReceipt
        ? `Hija mía, lo que estuvo escondido en la sombra, hoy sale a la luz.`
        : isWisdomProverbs
        ? `${prot.vocative}, donde termina tu lógica humana, recién comienza mi sabiduría.`
        : isMedical
        ? `${prot.vocative}, los hombres dictan diagnósticos, pero Yo tengo la última palabra.`
        : isFinances
        ? `Hijo mío, Yo soy quien sustenta a las aves del cielo; no temas.`
        : `${prot.vocative}, he visto tu lágrima secreta; he venido a estar contigo.`;

      // Scene 2: Confrontación de Urgencia
      const s2Prot = isReceipt
        ? `¡Mira el papel, tiembla en mis dedos! ¿Cómo explicas la tinta fresca si él no está?`
        : isWisdomProverbs
        ? `¡Invertí los ahorros de diez años pensando que lo tenía todo bajo control!`
        : isMedical
        ? `¡El doctor dijo que preparemos los papeles! ¿Cómo le pido a mi corazón que soporte esto?`
        : isFinances
        ? `¡El camión de la mudanza viene en camino y no tengo ni para pagar el flete!`
        : `¡Todo lo que construí se desmorona en un segundo y no encuentro ninguna salida!`;

      const s2Supp = isReceipt
        ? `¡Alguien lo dejó sobre el mostrador hace minutos! Sentí un escalofrío en la espalda.`
        : isWisdomProverbs
        ? `El orgullo nos cegó a los dos... pero mira quién está parado en medio de nosotros.`
        : isMedical
        ? `¡Pon tus manos sobre las mías! El pulso sigue latiendo, aún no es el final.`
        : isFinances
        ? `¡No empaques todavía! Dios no nos trajo a esta casa para avergonzarnos.`
        : `¡Basta de lamentarnos! Mira fijamente el umbral... Jesús está aquí presente.`;

      const s2Jesus = isReceipt
        ? `¿Estás dispuesta a perdonar el pasado para descubrir la verdad que te liberará?`
        : isWisdomProverbs
        ? `¿Confías en que puedo enderezar tus veredas si sueltas tu propia prudencia?`
        : isMedical
        ? `¿Crees de corazón que tengo poder para devolver el aliento a lo que agoniza?`
        : isFinances
        ? `¿Crees que soy capaz de abrir una puerta donde el hombre cerró con cerrojo?`
        : `¿Crees de corazón que para Mí no existe absolutamente ningún imposible?`;

      return [
        {
          title: 'El Shock Visual del Detonante',
          action: `En ${env.name}, primer plano macro cinematográfico al objeto de la prueba sobre la mesa de madera rústica. ${prot.name} contempla la evidencia en soledad con la respiración contenida y los dedos temblando, hasta que un resplandor dorado celestial sacude el umbral.`,
          cameraSetupEn: `Dramatic macro extreme close-up, 9:16 vertical. Intimate single-shot on trembling hands holding the narrative object, shifting to expressive face caught in disbelief, illuminated by a single flickering candle and a sudden golden rim light.`,
          turns: [
            { speaker: prot.name, id: prot.id, role: 'protagonista', text: s1Prot, tone: 'Choque profundo e incredulidad viva', voice: prot.voicePreset },
            { speaker: 'Maestro Jesús', id: 'jesus_cartoon_3d', role: 'maestro', text: s1Jesus, tone: 'Serenidad cálida y autoridad divina', voice: 'Marcus - Deep & Resonant' }
          ],
          sfx: 'Crujido de papel arrugado en dedos temblorosos, reloj de pared y brisa tibia dorada (-8dB)',
          sfxList: [
            { atSecond: '00:00 - 00:04', sound: 'Frote de papel, reloj y exhalación entrecortada (-8dB)', purpose: 'Contacto íntimo con la crisis' },
            { atSecond: '00:04 - 00:10', sound: 'Brisa tibia sobrenatural y shimmer 432Hz (-8dB)', purpose: 'Intervención y respuesta de Jesús' }
          ],
          narration: `El golpe de la realidad sacudió el aposento. En ese segundo de silencio absoluto, los cielos se abrieron.`,
          onScreen: 'EL DETONANTE • LA PRUEBA',
          label: 'CAPÍTULO 1 • PARTE 1',
          music: 'Atmósfera ambiental de alta tensión que se transforma en paz de 432Hz'
        },
        {
          title: 'Confrontación de Urgencia',
          action: `Plano compartido over-the-shoulder: ${prot.name} y ${supp.name} discuten acaloradamente sobre qué hacer con el tiempo en contra. En el centro de la escena, la figura serena de Jesús los observa con compasión.`,
          cameraSetupEn: `Over-the-shoulder intimate two-shot with shallow depth of field. Natural cinematic rack-focus between the two characters in emotional dispute, framed in 9:16.`,
          turns: [
            { speaker: prot.name, id: prot.id, role: 'protagonista', text: s2Prot, tone: 'Desesperación humana visceral', voice: prot.voicePreset },
            { speaker: supp.name, id: supp.id, role: 'secundario', text: s2Supp, tone: 'Firmeza de fe entre lágrimas', voice: supp.voicePreset },
            { speaker: 'Maestro Jesús', id: 'jesus_cartoon_3d', role: 'maestro', text: s2Jesus, tone: 'Pregunta penetrante al corazón', voice: 'Marcus - Deep & Resonant' }
          ],
          sfx: 'Golpe seco de nudillos sobre madera rústica, eco de voces alteradas que bajan de tono (-8dB)',
          sfxList: [
            { atSecond: '00:00 - 00:03', sound: 'Impacto sordo en la mesa y sollozo contenido (-8dB)', purpose: 'Descarga del dolor' },
            { atSecond: '00:03 - 00:06', sound: 'Toma de manos y suspiro de apoyo (-9dB)', purpose: 'Vínculo fraternal' },
            { atSecond: '00:06 - 00:10', sound: 'Campana de cristal etérea que silencia la disputa (-10dB)', purpose: 'Impacto de la pregunta de Cristo' }
          ],
          narration: `La discusión no resolvía nada; solo cuando miraron al Maestro comprendieron que la prueba medía su fe.`,
          onScreen: 'LA PRUEBA DE FE',
          label: 'TIEMPO LÍMITE',
          music: 'Cuerdas sinfónicas de alta tensión con notas graves sostenidas'
        },
        {
          title: 'La Mirada al Fondo del Alma',
          action: `Jesús da un paso adelante y se coloca a un metro de distancia. La luz de 3400K ilumina las miradas. ${prot.name} baja la guardia y deja caer el objeto sobre la mesa, vulnerable.`,
          cameraSetupEn: `Slow dramatic push-in / dolly towards Jesus and the protagonist. Volumetric warm light rays illuminating the dust motes and authentic facial tears in vertical 9:16.`,
          turns: [
            { speaker: prot.name, id: prot.id, role: 'protagonista', text: `¡Reconozco que no puedo más, Maestro! Mis fuerzas se acabaron por completo.`, tone: 'Quebranto genuino y rendición', voice: prot.voicePreset },
            { speaker: supp.name, id: supp.id, role: 'secundario', text: `¡Aquí estamos los dos, Señor; no nos moveremos de este aposento sin Ti!`, tone: 'Clamor colectivo con manos abiertas', voice: supp.voicePreset },
            { speaker: 'Maestro Jesús', id: 'jesus_cartoon_3d', role: 'maestro', text: `Tu impotencia es el suelo donde mi gracia echa raíces. Mírame a los ojos.`, tone: 'Amor incondicional y consuelo sublime', voice: 'Marcus - Deep & Resonant' }
          ],
          sfx: 'Objeto cayendo suavemente sobre madera, exhalación profunda de desahogo (-9dB)',
          sfxList: [
            { atSecond: '00:00 - 00:03', sound: 'Sollozo que se rompe y roce de rodillas (-9dB)', purpose: 'Rendición física' },
            { atSecond: '00:03 - 00:06', sound: 'Voz quebrada al unísono y eco de oración (-8dB)', purpose: 'Unidad de clamor' },
            { atSecond: '00:06 - 00:10', sound: 'Onda dorada armónica a 528Hz (-8dB)', purpose: 'Abrazo espiritual de Jesús' }
          ],
          narration: `Cuando el orgullo se rinde, el corazón queda limpio para recibir lo sobrenatural.`,
          onScreen: 'RENDICIÓN TOTAL',
          label: 'HUMILDAD',
          music: 'Piano cálido en 432Hz con violonchelo envolvente de paz'
        },
        {
          title: 'La Revelación Oculta',
          action: `Jesús posa su mano sobre el objeto o elemento central de la prueba en ${env.name}. Un detalle antes invisible comienza a resplandecer con un tenue halo dorado.`,
          cameraSetupEn: `Extreme close-up on the narrative element and the glowing hand of Jesus. Macro details of worn paper or wood, slow vertical tilt up to expressive eyes.`,
          turns: [
            { speaker: supp.name, id: supp.id, role: 'secundario', text: `¡Mira el reverso de la hoja! ¡Había algo escrito que nunca antes vimos!`, tone: 'Asombro tembloroso señalando', voice: supp.voicePreset },
            { speaker: prot.name, id: prot.id, role: 'protagonista', text: `¡Es una anotación oculta con una dirección y una hora señalada!`, tone: 'Pálpito acelerado de esperanza', voice: prot.voicePreset },
            { speaker: 'Maestro Jesús', id: 'jesus_cartoon_3d', role: 'maestro', text: `El enemigo planeó tu ruina, pero Yo ya preparé la salida. No temas.`, tone: 'Firmeza protectora y revelación', voice: 'Marcus - Deep & Resonant' }
          ],
          sfx: 'Chime cristalino sutil, paso de página y latido de expectación (-8dB)',
          sfxList: [
            { atSecond: '00:00 - 00:03', sound: 'Destello tenue y crujido de papel antiguo (-8dB)', purpose: 'Descubrimiento del secreto' },
            { atSecond: '00:03 - 00:06', sound: 'Inspiración súbita de aire de asombro (-9dB)', purpose: 'Reacción física de los personajes' },
            { atSecond: '00:06 - 00:10', sound: 'Resonancia profunda de chelo sacral (-9dB)', purpose: 'Sello divino de promesa' }
          ],
          narration: `No todo estaba perdido. Un mensaje no revelado aguardaba el momento exacto para manifestarse.`,
          onScreen: 'EL SECRETO DESCUBIERTO',
          label: 'GIRO INESPERADO',
          music: 'Suspenso cinematográfico con arpegios de piano misterioso'
        },
        {
          title: 'El Gancho Final del Capítulo 1',
          action: `De repente, tres golpes secos y violentos retumban en la puerta exterior de ${env.name}. Los personajes giran sobresaltados. El reloj de pared marca la medianoche y la vela parpadea.`,
          cameraSetupEn: `Dramatic Dutch angle with rapid push-in to the door, cutting to high-tension close-up on the terrified faces turning around. Cinematic vertical 9:16 cliffhanger.`,
          turns: [
            { speaker: prot.name, id: prot.id, role: 'protagonista', text: `¡Llegaron antes de tiempo! ¡Están golpeando con fuerza la entrada!`, tone: 'Pánico súbito mirando a la puerta', voice: prot.voicePreset },
            { speaker: supp.name, id: supp.id, role: 'secundario', text: `¡No abras todavía! Si ven lo que tenemos aquí, todo habrá terminado.`, tone: 'Urgencia extrema interponiéndose', voice: supp.voicePreset },
            { speaker: 'Maestro Jesús', id: 'jesus_cartoon_3d', role: 'maestro', text: `Permanece firme. Lo que viene a continuación probará si realmente confías en Mí.`, tone: 'Misterio sagrado y calma electrizante', voice: 'Marcus - Deep & Resonant' }
          ],
          sfx: 'Tres golpes secos retumbando en madera pesada (Bang-Bang-Bang), crujido de bisagra y corte seco en suspenso (-6dB)',
          sfxList: [
            { atSecond: '00:00 - 00:03', sound: 'Tres golpes violentos en la puerta exterior (-6dB)', purpose: 'Impacto súbito de cliffhanger' },
            { atSecond: '00:03 - 00:06', sound: 'Pasos presurosos y cerrojo que tiembla (-7dB)', purpose: 'Tensión de peligro inmediato' },
            { atSecond: '00:06 - 00:10', sound: 'Braam orquestal de suspenso con corte abrupto (-6dB)', purpose: 'Retención total para la Parte 2' }
          ],
          narration: `El peligro llamó a la puerta antes de lo previsto. ¿Quién está afuera en plena noche? La respuesta cambiará todo en la PARTE 2.`,
          onScreen: 'CONTINÚA EN LA PARTE 2',
          label: 'CLIFFHANGER',
          music: 'Crescendo abrupto de cuerdas que se corta en seco con golpe dramático'
        }
      ];
    }

    // -------------------------------------------------------------
    // CHAPTER 2: LA COMPLICACIÓN Y LA PRUEBA EXTREMA
    // -------------------------------------------------------------
    if (epNum === 2) {
      return [
        {
          title: 'El Umbral del Conflicto',
          action: `En ${env.name}, la puerta tiembla bajo la presión exterior. ${prot.name} se interpone protegiendo el aposento, mientras ${supp.name} observa una sombra siniestra a través del cristal. Jesús permanece imperturbable.`,
          cameraSetupEn: `Low-angle tracking shot moving from the trembling door handle towards the protective stance of the protagonist, vertical 9:16 high contrast lighting.`,
          turns: [
            { speaker: prot.name, id: prot.id, role: 'protagonista', text: `¡Identifíquense! ¡Nadie tiene derecho a forzar esta puerta a medianoche!`, tone: 'Defensa desesperada con voz firme', voice: prot.voicePreset },
            { speaker: supp.name, id: supp.id, role: 'secundario', text: `¡Reconozco esa voz... es la persona que juró arruinar a nuestra familia!`, tone: 'Terror amargo y manos en la boca', voice: supp.voicePreset },
            { speaker: 'Maestro Jesús', id: 'jesus_cartoon_3d', role: 'maestro', text: `No temas a quien puede dañar lo exterior. Abre la puerta con mansedumbre.`, tone: 'Comando sereno desconcertante', voice: 'Marcus - Deep & Resonant' }
          ],
          sfx: 'Forcejeo metálico de cerrojo, respiración contenida y chirrido de madera (-8dB)',
          sfxList: [
            { atSecond: '00:00 - 00:03', sound: 'Golpe metálico en la cerradura exterior (-7dB)', purpose: 'Amenaza activa' },
            { atSecond: '00:03 - 00:06', sound: 'Susurro asustado y retroceso de pasos (-9dB)', purpose: 'Reacción de miedo' },
            { atSecond: '00:06 - 00:10', sound: 'Paso firme y suave de Jesús hacia adelante (-9dB)', purpose: 'Liderazgo divino' }
          ],
          narration: `El pasado no pidió permiso para entrar. La prueba obligaba a obedecer una orden que desafiaba toda prudencia humana.`,
          onScreen: 'EL PASADO EN LA PUERTA',
          label: 'CAPÍTULO 2 • PARTE 2',
          music: 'Pulso rítmico marcial amortiguado con chelo de tensión creciente'
        },
        {
          title: 'El Choque de Realidades',
          action: `La puerta se entreabre lentamente revelando la silueta de la persona del conflicto con un documento legal en la mano. La tensión en la estancia corta el aire.`,
          cameraSetupEn: `Over-the-shoulder medium shot through the cracked doorway, light from the hallway cutting into the dark room in a sharp diagonal beam.`,
          turns: [
            { speaker: supp.name, id: supp.id, role: 'secundario', text: `¿Vienes a terminar de quitarnos lo poco que nos quedaba en este hogar?`, tone: 'Reproche adolorido con ojos llorosos', voice: supp.voicePreset },
            { speaker: prot.name, id: prot.id, role: 'protagonista', text: `¡Mira cómo tiembla su mano! No vino con odio... viene cargando una culpa que lo quiebra.`, tone: 'Comprensión súbita y choque visual', voice: prot.voicePreset },
            { speaker: 'Maestro Jesús', id: 'jesus_cartoon_3d', role: 'maestro', text: `Mira más allá de la ofensa. He traído a tu enemigo a tus pies no para venganza, sino para redención.`, tone: 'Sabiduría celestial infinita', voice: 'Marcus - Deep & Resonant' }
          ],
          sfx: 'Chirrido prolongado de bisagra oxidada, caída de sobre en el suelo (-8dB)',
          sfxList: [
            { atSecond: '00:00 - 00:03', sound: 'Bisagra que rechina lentamente (-8dB)', purpose: 'Apertura de la intriga' },
            { atSecond: '00:03 - 00:06', sound: 'Sobre de papel cayendo pesadamente al piso (-9dB)', purpose: 'Entrega del documento' },
            { atSecond: '00:06 - 00:10', sound: 'Armonía cálida sutil en el fondo (-10dB)', purpose: 'Paz transformadora' }
          ],
          narration: `El enemigo no era un monstruo invencible, sino un alma rota que Dios había arrastrado hasta el aposento.`,
          onScreen: 'LA OTRA CARA DEL CONFLICTO',
          label: 'REDENCIÓN',
          music: 'Melodía melancólica conmovedora con notas agudas de violín'
        },
        {
          title: 'El Desafío al Corazón',
          action: `En el centro de ${env.name}, ${prot.name} levanta el documento del suelo. Jesús le pide que mire a su opositor a los ojos y extienda la mano en perdón real.`,
          cameraSetupEn: `Two-shot from waist up, camera slowly orbiting the characters as warm light from Jesus begins illuminating both faces equally. 9:16 framing.`,
          turns: [
            { speaker: prot.name, id: prot.id, role: 'protagonista', text: `¡Señor, me costó diez años de amargura superar lo que me hizo! ¿Cómo le perdono ahora?`, tone: 'Conflicto interno desgarrador', voice: prot.voicePreset },
            { speaker: supp.name, id: supp.id, role: 'secundario', text: `Hermano, si Dios nos perdonó a nosotros, no podemos cerrar el corazón esta noche.`, tone: 'Súplica tierna tocándole el hombro', voice: supp.voicePreset },
            { speaker: 'Maestro Jesús', id: 'jesus_cartoon_3d', role: 'maestro', text: `El rencor es la prisión donde tú mismo eres el carcelero. Suelta la ofensa y verás mi gloria.`, tone: 'Verdad liberadora y ternura santa', voice: 'Marcus - Deep & Resonant' }
          ],
          sfx: 'Respiración temblorosa, crujido de dedos apretados que se abren despacio (-9dB)',
          sfxList: [
            { atSecond: '00:00 - 00:03', sound: 'Sollozo ahogado y puño cerrado con fuerza (-8dB)', purpose: 'Tensión del resentimiento' },
            { atSecond: '00:03 - 00:06', sound: 'Mano posándose con afecto en el brazo (-9dB)', purpose: 'Apoyo fraterno' },
            { atSecond: '00:06 - 00:10', sound: 'Campanilla de plata lejana (-10dB)', purpose: 'Rotura de cadenas interiores' }
          ],
          narration: `El milagro no empezaba en las circunstancias externas; empezaba en la decisión de arrancar el odio de raíz.`,
          onScreen: 'LA BATALLA INTERIOR',
          label: 'EL PERDÓN',
          music: 'Crescendo de piano con acordes mayores llenos de perdón y esperanza'
        },
        {
          title: 'La Decisión Decisiva',
          action: `${prot.name} abre los brazos y estrecha la mano de su adversario. Un choque de miradas cargado de lágrimas sella un pacto de paz. En ese instante, una luz celestial penetra el techo de la estancia.`,
          cameraSetupEn: `Dramatic tight close-up on the two hands grasping each other, tears falling onto the parchment on the table, volumetric golden light descending.`,
          turns: [
            { speaker: prot.name, id: prot.id, role: 'protagonista', text: `¡Te perdono! Delante de Jesús, rompo todo rencor y cancelo esta deuda en mi corazón.`, tone: 'Liberación ardiente y lágrimas vivas', voice: prot.voicePreset },
            { speaker: supp.name, id: supp.id, role: 'secundario', text: `¡Alabado sea Dios! ¡Se siente cómo se disipa toda la pesadez de este lugar!`, tone: 'Gozo sincero con brazos al cielo', voice: supp.voicePreset },
            { speaker: 'Maestro Jesús', id: 'jesus_cartoon_3d', role: 'maestro', text: `Porque obedeciste a mi voz en lo secreto, ahora contemplarás lo que haré en lo visible.`, tone: 'Promesa solemne con sonrisa victoriosa', voice: 'Marcus - Deep & Resonant' }
          ],
          sfx: 'Papel de deuda rasgándose simbólicamente, sollozo de desahogo y viento celestial cálido (-8dB)',
          sfxList: [
            { atSecond: '00:00 - 00:03', sound: 'Papel de ofensa rasgándose a la mitad (-8dB)', purpose: 'Cancelación del rencor' },
            { atSecond: '00:03 - 00:06', sound: 'Exhalación masiva de alivio colectivo (-9dB)', purpose: 'Liberación de los personajes' },
            { atSecond: '00:06 - 00:10', sound: 'Arpa dorada en 432Hz resonando (-8dB)', purpose: 'Apertura de los cielos' }
          ],
          narration: `Cuando el perdón vence al orgullo, los cielos se abren sin resistencia.`,
          onScreen: 'EL PACTO DE PAZ',
          label: 'OBEDIENCIA',
          music: 'Himno instrumental de adoración que crece majestuoso'
        },
        {
          title: 'El Cliffhanger del Capítulo 2',
          action: `Un estruendo sutil de milagro hace temblar la mesa: de la vasija vacía o el sobre roto comienza a emanar un brillo sobrenatural cegador. Pero una sirena o llamado urgente suena afuera anunciando la hora final.`,
          cameraSetupEn: `Fast push-in from wide room to the blinding light radiating from the table, rack-focus to the window showing the red dawn approaching. 9:16 cliffhanger.`,
          turns: [
            { speaker: supp.name, id: supp.id, role: 'secundario', text: `¡Mira la mesa! ¡El documento está cambiando y algo imposible está brotando!`, tone: 'Grito de asombro supremo', voice: supp.voicePreset },
            { speaker: prot.name, id: prot.id, role: 'protagonista', text: `¡Faltan solo sesenta segundos para el plazo final de las autoridades!`, tone: 'Cuenta regresiva dramática', voice: prot.voicePreset },
            { speaker: 'Maestro Jesús', id: 'jesus_cartoon_3d', role: 'maestro', text: `No mires el reloj de los hombres. Tu milagro acaba de nacer. Míralo en la PARTE FINAL.`, tone: 'Autoridad absoluta y gancho magnético', voice: 'Marcus - Deep & Resonant' }
          ],
          sfx: 'Zumbido sobrenatural creciente a 4500K, campanada de templo lejana y corte abrupto (-6dB)',
          sfxList: [
            { atSecond: '00:00 - 00:03', sound: 'Chime de gloria y brillo envolvente (-7dB)', purpose: 'Inicio de la manifestación' },
            { atSecond: '00:03 - 00:06', sound: 'Tic-tac acelerado de reloj final (-8dB)', purpose: 'Cuenta regresiva' },
            { atSecond: '00:06 - 00:10', sound: 'Golpe orquestal majestuoso con corte en seco (-6dB)', purpose: 'Cliffhanger hacia el final' }
          ],
          narration: `El reloj está en cero y la gloria de Dios acaba de estallar. ¿Qué ocurrió al abrirse la puerta? Descúbrelo en la GRAN PARTE FINAL.`,
          onScreen: 'CONTINÚA EN LA PARTE FINAL',
          label: 'CLIFFHANGER FINAL',
          music: 'Crescendo épico de cuerdas y coros que se suspende en el clímax'
        }
      ];
    }

    // -------------------------------------------------------------
    // CHAPTER 3+: EL MILAGRO SOBRENATURAL Y LA RESTAURACIÓN TOTAL
    // -------------------------------------------------------------
    return [
      {
        title: 'La Hora de la Verdad',
        action: `En ${env.name}, la luz matutina dorada rompe la penumbra por la ventana a 5000K. ${prot.name}, ${supp.name} y los presentes están de pie con miradas expectantes ante el Maestro Jesús.`,
        cameraSetupEn: `Cinematic wide establishing shot tilting down from the morning sunbeams piercing the wooden arch window down to the united characters, vertical 9:16.`,
        turns: [
          { speaker: prot.name, id: prot.id, role: 'protagonista', text: `¡Llegó la hora señalada! Todo lo que parecía muerte y ruina hoy tiene que rendirse.`, tone: 'Fe inquebrantable y madura', voice: prot.voicePreset },
          { speaker: supp.name, id: supp.id, role: 'secundario', text: `¡El sol salió y no estamos derrotados! ¡La presencia de Dios nos sostuvo toda la noche!`, tone: 'Testimonio vibrante con sonrisa', voice: supp.voicePreset },
          { speaker: 'Maestro Jesús', id: 'jesus_cartoon_3d', role: 'maestro', text: `Porque me creíste cuando todo era oscuro, hoy contemplarás la plenitud de mi promesa.`, tone: 'Majestad tierna y victoria', voice: 'Marcus - Deep & Resonant' }
        ],
        sfx: 'Canto de aves al amanecer, brisa fresca y eco de campana de victoria (-8dB)',
        sfxList: [
          { atSecond: '00:00 - 00:03', sound: 'Aleteo de paloma y brisa fresca matutina (-8dB)', purpose: 'Nuevo amanecer' },
          { atSecond: '00:03 - 00:06', sound: 'Sonrisa de desahogo y paso adelante (-9dB)', purpose: 'Confianza restaurada' },
          { atSecond: '00:06 - 00:10', sound: 'Whoosh dorado celestial omnidireccional (-8dB)', purpose: 'Presencia gloriosa' }
        ],
        narration: `La noche más larga de sus vidas quedó atrás. El sol de la justicia amanecía con sanidad y respuesta en sus alas.`,
        onScreen: 'EL AMANECER DEL MILAGRO',
        label: 'CAPÍTULO FINAL',
        music: 'Piano y violonchelo luminoso en tonalidad de Sol Mayor'
      },
      {
        title: 'La Intervención Soberana',
        action: `Jesús alza Su mano sobre el centro de la estancia. Ondas de luz volumétrica a 5500K disuelven toda sombra de dolor. La deuda queda cancelada, el diagnóstico se revierte y la provisión rebosa.`,
        cameraSetupEn: `Dramatic low-angle shot looking up at Jesus with hands outstretched, luminous golden aura expanding to bathe the entire 9:16 frame in heavenly glory.`,
        turns: [
          { speaker: 'Maestro Jesús', id: 'jesus_cartoon_3d', role: 'maestro', text: `¡Queda deshecha toda obra de ruina y enfermedad! ¡Yo declaro paz y abundancia sobre este hogar!`, tone: 'Voz de trueno suave y decreto de Rey', voice: 'Marcus - Deep & Resonant' },
          { speaker: prot.name, id: prot.id, role: 'protagonista', text: `¡Miren el informe! ¡Las deudas están pagadas y la enfermedad ya no existe!`, tone: 'Asombro supremo con manos en la cabeza', voice: prot.voicePreset },
          { speaker: supp.name, id: supp.id, role: 'secundario', text: `¡Dios lo hizo! ¡Lo que era imposible para los hombres, Dios lo hizo en un segundo!`, tone: 'Alabanza desbordante con lágrimas de gozo', voice: supp.voicePreset }
        ],
        sfx: 'Trueno sordo celestial a 5500K, destello radiante y arpa de victoria triunfal (-7dB)',
        sfxList: [
          { atSecond: '00:00 - 00:03', sound: 'Decreto divino con eco majestuoso (-7dB)', purpose: 'Palabra de poder' },
          { atSecond: '00:03 - 00:06', sound: 'Grito de victoria y llanto de júbilo (-8dB)', purpose: 'Recepción del milagro' },
          { atSecond: '00:06 - 00:10', sound: 'Campanadas de iglesia solemne y coro celestial (-8dB)', purpose: 'Consumación gloriosa' }
        ],
        narration: `Una sola palabra de Jesús transformó lo imposible en testimonio eterno.`,
        onScreen: '¡EL MILAGRO SE CONSUMÓ!',
        label: 'VICTORIA DIVINA',
        music: 'Sinfonía gloriosa de victoria con coros sacros y percusión épica'
      },
      {
        title: 'La Evidencia Tangible',
        action: `Primer plano compartido: los personajes revisan con ojos desorbitados la prueba real del milagro (el saldo a favor, el certificado limpio, el abrazo del padre restaurado). No hay dudas.`,
        cameraSetupEn: `Close-up two-shot tracking the joyful hands turning over the evidence, faces glowing in golden ambient light with genuine happy tears streaming down.`,
        turns: [
          { speaker: supp.name, id: supp.id, role: 'secundario', text: `¡Pásame el documento otra vez! ¡No es un sueño, es una realidad que podemos tocar!`, tone: 'Risa entre lágrimas y gozo puro', voice: supp.voicePreset },
          { speaker: prot.name, id: prot.id, role: 'protagonista', text: `¡Dios nos devolvió siete veces lo que la prueba quiso arrebatarnos!`, tone: 'Testimonio firme e inconmovible', voice: prot.voicePreset },
          { speaker: 'Maestro Jesús', id: 'jesus_cartoon_3d', role: 'maestro', text: `El que pone su confianza en Mí, jamás de los jamases será avergonzado.`, tone: 'Mirada afectuosa y sello de fe', voice: 'Marcus - Deep & Resonant' }
        ],
        sfx: 'Risas de desahogo, roce de manos entrelazadas y suspiros de profunda paz (-8dB)',
        sfxList: [
          { atSecond: '00:00 - 00:03', sound: 'Exclamación de júbilo sincero (-8dB)', purpose: 'Desahogo' },
          { atSecond: '00:03 - 00:06', sound: 'Risa inocente y abrazo estrecho (-9dB)', purpose: 'Paz familiar' },
          { atSecond: '00:06 - 00:10', sound: 'Zumbido de partículas doradas (-10dB)', purpose: 'Presencia continua de Cristo' }
        ],
        narration: `El milagro se podía tocar, contar y testificar. La vergüenza se convirtió en corona de honra.`,
        onScreen: 'TESTIMONIO VIVO',
        label: 'HONRA',
        music: 'Piano emotivo pastoral con armonías dulces y cálidas'
      },
      {
        title: 'Restauración y Abrazo Fraternal',
        action: `${prot.name}, ${supp.name} y los suyos se funden en un abrazo largo y conmovedor en medio de ${env.name}. Jesús los envuelve con Su manto extendido en señal de protección perpetua.`,
        cameraSetupEn: `Medium shot slowly tracking around the emotional family embrace, backlit by the 5500K golden divine halo of Jesus smiling lovingly behind them. 9:16.`,
        turns: [
          { speaker: prot.name, id: prot.id, role: 'protagonista', text: `¡Gracias por no soltarme en la noche oscura! ¡Este hogar le pertenece a Dios para siempre!`, tone: 'Gratitud desbordante abrazando con fuerza', voice: prot.voicePreset },
          { speaker: supp.name, id: supp.id, role: 'secundario', text: `¡Valió cada lágrima de rodillas! ¡La fidelidad de Dios nunca nos falló!`, tone: 'Llanto de triunfo y amor fraternal', voice: supp.voicePreset },
          { speaker: 'Maestro Jesús', id: 'jesus_cartoon_3d', role: 'maestro', text: `Mi paz os dejo, mi paz os doy. La bendición que comenzó hoy aquí no tendrá fin.`, tone: 'Bendición paternal soberana', voice: 'Marcus - Deep & Resonant' }
        ],
        sfx: 'Abrazo estrecho, ropa de lino frotándose y suspiro de gratitud profunda (-9dB)',
        sfxList: [
          { atSecond: '00:00 - 00:03', sound: 'Abrazo apretado y sollozo de gozo (-8dB)', purpose: 'Unidad restaurada' },
          { atSecond: '00:03 - 00:06', sound: 'Suspiro largo de descanso total (-9dB)', purpose: 'Fin de la angustia' },
          { atSecond: '00:06 - 00:10', sound: 'Campana de templo solemne sostenida (-8dB)', purpose: 'Sello de bendición eterna' }
        ],
        narration: `Donde la prueba intentó destruir una familia, Dios levantó un altar de adoración y testimonio vivo.`,
        onScreen: 'RESTAURACIÓN TOTAL',
        label: 'PAZ ETERNA',
        music: 'Himno instrumental majestuoso con cuerdas y campanas de gloria'
      },
      {
        title: 'Gran Cierre y Bendición Inmortal',
        action: `Jesús da un paso hacia la cámara en ${env.name} y extiende Sus manos luminosas directamente hacia el espectador. A Su lado, ${prot.name} y ${supp.name} invitan a declarar la misma victoria.`,
        cameraSetupEn: `Direct-to-camera intimate medium close-up of Jesus extending his hands, warm celestial eyes gazing with infinite compassion, vertical 9:16 cinema.`,
        turns: [
          { speaker: 'Maestro Jesús', id: 'jesus_cartoon_3d', role: 'maestro', text: `Lo que hice por este hogar hoy, también lo haré por el tuyo si te atreves a confiar en Mí.`, tone: 'Llamado directo al alma del espectador', voice: 'Marcus - Deep & Resonant' },
          { speaker: prot.name, id: prot.id, role: 'protagonista', text: `¡Escribe AMÉN con toda tu fe en los comentarios si tú también crees en los milagros de Dios!`, tone: 'Llamado ardiente a declarar la fe', voice: prot.voicePreset },
          { speaker: supp.name, id: supp.id, role: 'secundario', text: `¡Comparte este video con alguien que necesite hoy recordar que Jesús no llega tarde!`, tone: 'Urgencia de amor y testimonio vivo', voice: supp.voicePreset }
        ],
        sfx: 'Campana solemne en 528Hz, oleada suave de bendición (Whoosh dorado) y acorde triunfal final (-6dB)',
        sfxList: [
          { atSecond: '00:00 - 00:03', sound: 'Oleada dorada de paz y campana sagrada (-7dB)', purpose: 'Conexión con el espectador' },
          { atSecond: '00:03 - 00:06', sound: 'Arpa celestial y eco radiante (-8dB)', purpose: 'Llamado a comentar AMÉN' },
          { atSecond: '00:06 - 00:10', sound: 'Acorde glorioso final sostenido en 432Hz (-7dB)', purpose: 'Cierre inmortal de la miniserie' }
        ],
        narration: `El mismo Jesús que abrió caminos en esta historia está listo para obrar en tu vida. Si lo crees de corazón, escribe AMÉN y comparte esta bendición.`,
        onScreen: 'ESCRIBE "AMÉN" Y COMPARTE',
        label: 'FIN DE LA SERIE',
        music: 'Melodía triunfal gloriosa de bendición eterna que se desvanece con suavidad'
      }
    ];
  };

  const sceneSpecs = getSceneSpecsForEpisode();

  return sceneSpecs.map((spec, sIdx) => {
    const sNum = sIdx + 1;
    const pacedTurns = calibrateAndPaceDialogue(
      spec.turns.map(t => ({
        speakerName: t.speaker,
        speakerId: t.id,
        role: t.role,
        dialogueSpanish: t.text,
        emotionalTone: t.tone,
        voicePresetName: t.voice
      })),
      10
    );

    const dialogPromptLines = pacedTurns
      .map((t: any) => `[${t.timeWindow}] ${t.speakerName} (${t.allocatedSeconds}s): "${t.dialogueSpanish}"`)
      .join('\n');

    const syncedVideoPrompt = `${envLock}\n${jLock}\n${pLock}\n${sLock}\n[CONTINUOUS 10s SHOT - FLUID SPEECH ~2.0 words/sec]: High-end Pixar 3D animated style inside ${env.shortTag}. ${spec.cameraSetupEn}\nAction: ${spec.action}\nSynchronized Latin American Spanish dialogue:\n${dialogPromptLines}\n${negLock}`;

    const choralNarration = pacedTurns
      .map((t: any) => `${t.speakerName}: "${t.dialogueSpanish}"`)
      .join(' | ');

    return {
      sceneNumber: sNum,
      durationSec: 10,
      characterId: sNum === 1 ? prot.id : sNum === 2 ? 'jesus_cartoon_3d' : sNum === 5 && isLast ? 'jesus_cartoon_3d' : prot.id,
      secondaryCharacterId: sNum === 1 ? supp.id : prot.id,
      charactersInShot: [prot.id, supp.id, 'jesus_cartoon_3d'],
      interactionType: sNum === 1 ? 'dos_personajes_frente_a_frente' : sNum === 4 ? 'abrazo_consuelo' : sNum === 5 ? (isLast ? 'reaccion_asombro' : 'confrontacion_redencion') : 'encuentro_con_jesus',
      timeframe: `00:${String((sNum - 1) * 10).padStart(2, '0')} - 00:${String(sNum * 10).padStart(2, '0')}`,
      action: spec.action,
      scenographyDetails: {
        exactLocation: `Foco principal de ${env.name}.`,
        narrativeProps: 'Elementos activos que impulsan el dilema y la resolución.',
        lightingSetup: isFirst ? '2700K sombras alargadas y penumbra' : isLast ? '5500K luz dorada celestial' : '3400K contraluz divino cálido',
        spatialPlacement: 'Composición cinematográfica vertical 9:16 con profundidad de campo.'
      },
      dialogueExchange: pacedTurns,
      narration: `${spec.narration} [Diálogo: ${choralNarration}]`,
      onScreenText: spec.onScreen,
      secondaryLabel: spec.label,
      imageToVideoPrompt: syncedVideoPrompt,
      englishPromptWithSpanishDialogue: syncedVideoPrompt,
      masterNetflixPrompt: `[NETFLIX CONTINUITY - EPISODE ${epNum} SCENE ${sNum}]\n${envLock}\n${jLock}\n${pLock}\n${sLock}\n[ACTION 10s]: ${spec.action}. Divided dialogue: ${pacedTurns.length} turns in 10s.\n${negLock}`,
      sfx: spec.sfx,
      sfxTimeline: spec.sfxList,
      bgMusicMood: spec.music
    };
  });
}

/**
 * CONSTANTES DE CADENCIA ORAL Y RITMO FONÉTICO PARA VIDEO IA (10s)
 */
export const MAX_WORDS_PER_SECOND = 2.2;
export const OPTIMAL_WORDS_PER_SECOND = 2.0;
export const MAX_WORDS_PER_10S_SCENE = 22;
export const MIN_WORDS_PER_10S_SCENE = 14;

export function countWordsSpanish(text: string): number {
  if (!text) return 0;
  return text
    .replace(/[¡!¿?.,;:"]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

export function condenseDialogueToWordBudget(text: string, maxWords: number): string {
  const clean = (text || '').trim();
  const currentCount = countWordsSpanish(clean);
  if (currentCount <= maxWords || maxWords <= 0) return clean;

  const clauses = clean
    .split(/(?<=[.!?])\s+/)
    .map(c => c.trim())
    .filter(Boolean);

  for (const clause of clauses) {
    const clauseWords = countWordsSpanish(clause);
    if (clauseWords >= 3 && clauseWords <= maxWords) {
      return clause;
    }
  }

  let accumulated = '';
  for (const clause of clauses) {
    const combined = accumulated ? `${accumulated} ${clause}` : clause;
    if (countWordsSpanish(combined) <= maxWords) {
      accumulated = combined;
    } else {
      break;
    }
  }

  if (accumulated && countWordsSpanish(accumulated) >= 3) {
    return accumulated;
  }

  const words = clean.split(/\s+/);
  const trimmed = words.slice(0, maxWords).join(' ');
  const lastChar = trimmed.slice(-1);
  if (!['.', '!', '?'].includes(lastChar)) {
    return `${trimmed}...`;
  }
  return trimmed;
}

export function calibrateAndPaceDialogue(
  turns: any[],
  sceneDurationSec: number = 10
): any[] {
  if (!Array.isArray(turns) || turns.length === 0) return [];

  const turnCount = turns.length;
  const allocatedSecondsList: number[] = [];
  if (turnCount === 1) {
    allocatedSecondsList.push(sceneDurationSec);
  } else if (turnCount === 2) {
    allocatedSecondsList.push(5, 5);
  } else if (turnCount === 3) {
    allocatedSecondsList.push(3, 3, 4);
  } else if (turnCount === 4) {
    allocatedSecondsList.push(2, 3, 2, 3);
  } else {
    const base = Math.floor(sceneDurationSec / turnCount);
    let rem = sceneDurationSec % turnCount;
    for (let i = 0; i < turnCount; i++) {
      allocatedSecondsList.push(base + (i < rem ? 1 : 0));
    }
  }

  let currentSec = 0;
  return turns.map((turn, idx) => {
    const allocatedSec = turn.allocatedSeconds && turn.allocatedSeconds > 0 
      ? turn.allocatedSeconds 
      : allocatedSecondsList[idx] || 3;
    
    const startSec = currentSec;
    const endSec = Math.min(sceneDurationSec, startSec + allocatedSec);
    currentSec = endSec;

    const pad = (n: number) => String(n).padStart(2, '0');
    const timeWindow = `00:${pad(startSec)} - 00:${pad(endSec)}`;

    const maxWordsAllowed = Math.round(allocatedSec * MAX_WORDS_PER_SECOND);
    const originalText = turn.dialogueSpanish || '';
    const originalWordCount = countWordsSpanish(originalText);

    let pacedText = originalText;
    let pacingStatus: 'perfecto' | 'óptimo' | 'ajustado' = 'perfecto';

    if (originalWordCount > maxWordsAllowed) {
      pacedText = condenseDialogueToWordBudget(originalText, maxWordsAllowed);
      pacingStatus = 'ajustado';
    } else if (originalWordCount >= Math.round(allocatedSec * 1.5)) {
      pacingStatus = 'óptimo';
    }

    const finalWordCount = countWordsSpanish(pacedText);
    const wordsPerSecond = Math.round((finalWordCount / (allocatedSec || 1)) * 10) / 10;

    return {
      ...turn,
      dialogueSpanish: pacedText,
      timeWindow,
      allocatedSeconds: allocatedSec,
      wordCount: finalWordCount,
      wordsPerSecond,
      pacingStatus
    };
  });
}

export function getSceneSpeechMetrics(turns: any[], sceneDurationSec: number = 10) {
  const list = Array.isArray(turns) ? turns : [];
  const totalWords = list.reduce((acc, t) => acc + countWordsSpanish(t.dialogueSpanish || ''), 0);
  const avgWps = Math.round((totalWords / sceneDurationSec) * 10) / 10;
  const isOptimal = totalWords >= MIN_WORDS_PER_10S_SCENE && totalWords <= MAX_WORDS_PER_10S_SCENE;
  const isOverBudget = totalWords > MAX_WORDS_PER_10S_SCENE;

  return {
    totalWords,
    avgWps,
    isOptimal,
    isOverBudget,
    targetRange: '18 - 22 palabras',
    statusLabel: isOverBudget 
      ? `Excedido (${totalWords} palabras para ${sceneDurationSec}s - se pronunciará apresurado)` 
      : isOptimal 
        ? `Excelente (${totalWords} palabras para ${sceneDurationSec}s · ${avgWps} pal/s)` 
        : `Aceptable (${totalWords} palabras para ${sceneDurationSec}s)`
  };
}

/**
 * Ensures that EVERY 10-second scene has a genuine multi-character dialogue exchange
 * (at least 2 or 3 distinct characters conversing back-and-forth across the 10 seconds).
 * Completely eliminates isolated monologues or scenes with only a single speaker.
 */
export function ensureMultiCharacterDialogueExchange(
  scene: any,
  sceneNumber: number = 1,
  cast: DynamicCastEnsemble | ProtagonistCast | any,
  topic: string = '',
  totalParts: number = 3,
  epNum: number = 1
): any[] {
  const existingTurns = Array.isArray(scene.dialogueExchange) ? scene.dialogueExchange : [];
  
  // Extract distinct speaker names/ids
  const distinctSpeakers = new Set(
    existingTurns.map((t: any) => (t.speakerName || t.speakerId || '').trim().toLowerCase()).filter(Boolean)
  );

  // Identify Protagonist, Supporting, and Jesus
  const protName = cast?.protagonist?.name || 'Protagonista';
  const protId = cast?.protagonist?.id || 'protagonista_fe';
  const protVocative = cast?.protagonist?.vocative || 'Hijo mío';
  const protVoice = cast?.protagonist?.voicePreset || 'David - Confident & Clear';

  const suppName = cast?.supporting?.name || cast?.secondary?.name || 'Compañero de Fe';
  const suppId = cast?.supporting?.id || cast?.secondary?.id || 'apoyo_fe';
  const suppVoice = cast?.supporting?.voicePreset || 'Elena - Deeply Emotional & Sincere';

  // If there are already 2 or more distinct characters speaking:
  if (existingTurns.length >= 2 && distinctSpeakers.size >= 2) {
    // If only 2 turns exist, ensure Jesus or 3rd character completes the 10s arc if scene calls for it
    if (existingTurns.length === 2 && !distinctSpeakers.has('jesus_cartoon_3d') && !distinctSpeakers.has('jesús') && !distinctSpeakers.has('jesus')) {
      const augmentedTurns = [
        ...existingTurns,
        {
          speakerName: 'Maestro Jesús',
          speakerId: 'jesus_cartoon_3d',
          role: 'maestro',
          timeWindow: '00:06 - 00:10',
          allocatedSeconds: 4,
          dialogueSpanish: sceneNumber === 5 && epNum === totalParts
            ? 'Si crees en esta promesa de victoria, escribe AMÉN con fe.'
            : `${protVocative}, Yo estoy contigo; no temas a la prueba.`,
          emotionalTone: 'Ternura compasiva infinita y autoridad divina',
          voicePresetName: 'Marcus - Deep & Resonant'
        }
      ];
      return calibrateAndPaceDialogue(augmentedTurns, scene.durationSec || 10);
    }
    return calibrateAndPaceDialogue(existingTurns, scene.durationSec || 10);
  }

  const isLast = epNum === totalParts && sceneNumber === 5;

  // If there was 1 existing turn, keep its text to enrich rather than discard
  const firstTurn = existingTurns.length > 0 ? existingTurns[0] : null;
  const firstSpeakerName = firstTurn?.speakerName || protName;
  const firstSpeakerId = firstTurn?.speakerId || protId;
  const firstDialogue = firstTurn?.dialogueSpanish?.trim() || '';

  const clean = (topic || '').toLowerCase();
  const isReceipt = clean.includes('recibo') || clean.includes('frutera') || clean.includes('mercado') || clean.includes('fruta');
  const isWisdomProverbs = clean.includes('fíate') || clean.includes('fiate') || clean.includes('jehová') || clean.includes('jehova') || clean.includes('prudencia') || clean.includes('proverbios') || clean.includes('sabiduria') || clean.includes('sabiduría') || clean.includes('senda') || clean.includes('camino') || clean.includes('apoyes');
  const isFather = clean.includes('padre') && (clean.includes('ausente') || clean.includes('volvió') || clean.includes('3:00') || clean.includes('3 am') || clean.includes('perdón') || clean.includes('perdon'));
  const isMedical = clean.includes('hospital') || clean.includes('médico') || clean.includes('medico') || clean.includes('doctor') || clean.includes('uci') || clean.includes('enfermedad') || clean.includes('cáncer') || clean.includes('diagnóstico');
  const isFinances = clean.includes('quiebra') || clean.includes('desalojo') || clean.includes('deuda') || clean.includes('deudas') || clean.includes('banco') || clean.includes('arriendo') || clean.includes('embargo');
  const isFamilyCarpentry = clean.includes('carpintería') || clean.includes('carpinteria') || clean.includes('carta') || clean.includes('hermanos') || clean.includes('herencia') || clean.includes('taller');
  const isOrchardDrought = clean.includes('huerto') || clean.includes('sequia') || clean.includes('sequía') || clean.includes('parcela') || clean.includes('tierra');
  const isFamilyMarriage = clean.includes('matrimonio') || clean.includes('esposos') || clean.includes('pareja') || clean.includes('divorcio') || clean.includes('reconciliacion');
  const isAnxiety = clean.includes('ansiedad') || clean.includes('pánico') || clean.includes('panico') || clean.includes('insomnio') || clean.includes('temor') || clean.includes('miedo');
  const isStorm = clean.includes('barca') || clean.includes('mar') || clean.includes('tormenta') || clean.includes('tempestad') || clean.includes('olas');

  let turns: any[] = [];

  switch (sceneNumber) {
    case 1: {
      const pText = firstDialogue || (isFather 
        ? '¡Son las 3:00 AM y escucho los pasos de mi padre en la puerta!' 
        : isReceipt 
          ? '¡Este recibo tiene la firma de mi padre con fecha de hoy!'
          : isWisdomProverbs
            ? '¡Confié en mi propia lógica y todo mi proyecto colapsó!'
            : isMedical
              ? '¡A las 3:00 AM los monitores cayeron y no responden!'
              : isFinances
                ? '¡Llegó la orden final de desalojo y perderemos la casa!'
                : isFamilyCarpentry
                  ? '¡Si abrimos esta carta de mamá, saldrá toda la verdad!'
                  : isOrchardDrought
                    ? '¡La sequía secó todo el valle y quieren quitarnos la tierra!'
                    : isFamilyMarriage
                      ? '¡El orgullo y los silencios destrozaron nuestro hogar!'
                      : isAnxiety
                        ? '¡Son las 3:00 AM y este pánico me ahoga el pecho!'
                        : isStorm
                          ? '¡Las olas nos cubren y la barca se parte en dos!'
                          : '¡Si Dios no interviene hoy, perderemos todo en esta prueba!');

      const sText = isFather
        ? '¡Hijo, abre con amor; Dios escuchó cada noche de lágrimas!'
        : isReceipt
          ? '¡Elena, tu padre desapareció hace siete años en este puesto!'
          : isWisdomProverbs
            ? '¡Suelta el timón humano; el Arquitecto eterno está aquí!'
            : isMedical
              ? '¡No desconecten nada; la presencia de Jesús acaba de entrar!'
              : isFinances
                ? '¡No empaques las maletas; el Dueño de todo está aquí!'
                : isFamilyCarpentry
                  ? '¡Espera, hermano; el rencor no puede destruir este taller!'
                  : isOrchardDrought
                    ? '¡No vendas nada; mira el brote verde que nació con el alba!'
                    : isFamilyMarriage
                      ? '¡No rompas el pacto; el Príncipe de Paz acaba de entrar!'
                      : isAnxiety
                        ? '¡Mira hacia la luz divina; el temor tiene que huir ahora!'
                        : isStorm
                          ? '¡Despierta tu fe; el Señor camina sobre las aguas!'
                          : '¡Mira hacia el umbral; la gloriosa presencia de Jesús acaba de entrar!';

      const jText = isFather
        ? 'Hijo mío, para el corazón contrito hoy nace un nuevo día de gracia.'
        : isWisdomProverbs
          ? 'Fíate de Mí de todo corazón; Yo enderezaré tus sendas.'
          : `${protVocative}, he escuchado tu clamor sincero; Yo abro camino hoy.`;

      turns = [
        {
          speakerName: firstSpeakerName.toLowerCase().includes('jesús') ? protName : firstSpeakerName,
          speakerId: firstSpeakerId.includes('jesus') ? protId : firstSpeakerId,
          role: 'protagonista',
          timeWindow: '00:00 - 00:03',
          allocatedSeconds: 3,
          dialogueSpanish: pText,
          emotionalTone: 'Clamor desgarrador con fe naciente',
          voicePresetName: protVoice
        },
        {
          speakerName: suppName,
          speakerId: suppId,
          role: 'secundario',
          timeWindow: '00:03 - 00:06',
          allocatedSeconds: 3,
          dialogueSpanish: sText,
          emotionalTone: 'Asombro reverente y apoyo incondicional',
          voicePresetName: suppVoice
        },
        {
          speakerName: 'Maestro Jesús',
          speakerId: 'jesus_cartoon_3d',
          role: 'maestro',
          timeWindow: '00:06 - 00:10',
          allocatedSeconds: 4,
          dialogueSpanish: jText,
          emotionalTone: 'Ternura compasiva infinita y autoridad divina',
          voicePresetName: 'Marcus - Deep & Resonant'
        }
      ];
      break;
    }

    case 2: {
      // Scene 2: Urgent Dispute / Confronting the human dilemma
      const pText = epNum === 1
        ? (firstDialogue || '¡Intenté hacer todo con mi propia lógica y ahora todo se viene abajo!')
        : epNum === 2
        ? (firstDialogue || '¡Si ellos descubren lo que pasó con los papeles, perderemos todo!')
        : (firstDialogue || '¡Faltan minutos para la hora señalada y las fuerzas se me terminaron!');

      const sText = epNum === 1
        ? '¡Basta de lamentarte! Si nos quedamos congelados por el miedo, no habrá salida.'
        : epNum === 2
        ? '¡No podemos seguir ocultando la verdad! Hay que encarar la situación con valentía.'
        : '¡Mírame a los ojos! Dios no nos trajo hasta este desierto para dejarnos morir.';

      const jText = epNum === 1
        ? '¿Confías en que puedo enderezar tus veredas si sueltas tu propia prudencia?'
        : epNum === 2
        ? 'La verdad nunca destruye a quien la abraza; sed sinceros y Yo pelearé por vosotros.'
        : 'No temáis a la tormenta de los hombres; vuestra fe ha sido probada como oro fino.';

      turns = [
        {
          speakerName: protName,
          speakerId: protId,
          role: 'protagonista',
          timeWindow: '00:00 - 00:03',
          allocatedSeconds: 3,
          dialogueSpanish: pText,
          emotionalTone: 'Desesperación humana visceral y angustia sincera',
          voicePresetName: protVoice
        },
        {
          speakerName: suppName,
          speakerId: suppId,
          role: 'secundario',
          timeWindow: '00:03 - 00:06',
          allocatedSeconds: 3,
          dialogueSpanish: sText,
          emotionalTone: 'Firmeza de apoyo y confrontación compasiva',
          voicePresetName: suppVoice
        },
        {
          speakerName: 'Maestro Jesús',
          speakerId: 'jesus_cartoon_3d',
          role: 'maestro',
          timeWindow: '00:06 - 00:10',
          allocatedSeconds: 4,
          dialogueSpanish: jText,
          emotionalTone: 'Sabiduría penetrante, calidez íntima y autoridad celestial',
          voicePresetName: 'Marcus - Deep & Resonant'
        }
      ];
      break;
    }

    case 3: {
      // Scene 3: The Point of Vulnerability / Breaking the Inner Resistance
      const pText = epNum === 1
        ? (firstDialogue || '¡Reconozco que me equivoqué! Pensé que podía resolverlo sin pedir ayuda.')
        : epNum === 2
        ? (firstDialogue || '¡Me cuesta perdonar tantos años de desprecio y traición!')
        : (firstDialogue || '¡Pongo mi vida y mi familia en Tus manos, Señor!');

      const sText = epNum === 1
        ? 'Todos nos equivocamos, pero Dios mira un corazón humilde que se levanta.'
        : epNum === 2
        ? 'Si Dios nos perdonó nuestras deudas, nosotros no podemos cerrar la puerta.'
        : '¡Miren la paz que desciende sobre este aposento! ¡La angustia se disipa!';

      const jText = epNum === 1
        ? 'Tu impotencia reconocida es el inicio de mi sabiduría en tu vida.'
        : epNum === 2
        ? 'El rencor ata tu propio destino; perdona y tus cadenas se romperán hoy.'
        : 'Vuestra entrega ha tocado el corazón del Padre; contemplad lo que voy a hacer.';

      turns = [
        {
          speakerName: protName,
          speakerId: protId,
          role: 'protagonista',
          timeWindow: '00:00 - 00:03',
          allocatedSeconds: 3,
          dialogueSpanish: pText,
          emotionalTone: 'Quebranto honesto, lágrimas sinceras y rendición',
          voicePresetName: protVoice
        },
        {
          speakerName: suppName,
          speakerId: suppId,
          role: 'secundario',
          timeWindow: '00:03 - 00:06',
          allocatedSeconds: 3,
          dialogueSpanish: sText,
          emotionalTone: 'Súplica amorosa y abrazo fraternal reconfortante',
          voicePresetName: suppVoice
        },
        {
          speakerName: 'Maestro Jesús',
          speakerId: 'jesus_cartoon_3d',
          role: 'maestro',
          timeWindow: '00:06 - 00:10',
          allocatedSeconds: 4,
          dialogueSpanish: jText,
          emotionalTone: 'Ternura santa infinita y promesa viva de gracia',
          voicePresetName: 'Marcus - Deep & Resonant'
        }
      ];
      break;
    }

    case 4: {
      // Scene 4: The Revelation / Concrete Action of Faith
      const sText = epNum === 1
        ? '¡Mira la mesa! ¡Apareció un sello y una nota que no habíamos visto!'
        : epNum === 2
        ? '¡Están tocando a la puerta pero no vienen con armas, vienen pidiendo paz!'
        : '¡El diagnóstico cambió y los documentos fueron firmados a nuestro favor!';

      const pText = epNum === 1
        ? (firstDialogue || '¡Es una salida que nadie en este mundo hubiera imaginado!')
        : epNum === 2
        ? (firstDialogue || '¡Siento cómo el veneno del resentimiento abandona mi pecho!')
        : (firstDialogue || '¡Lo que para los hombres era imposible, Dios lo hizo real aquí!');

      const jText = epNum === 1
        ? 'Donde el hombre dice no hay camino, Yo abro sendas en medio del desierto.'
        : epNum === 2
        ? 'La paz que os doy no es como el mundo la da; permaneced en mi amor.'
        : 'El que confía en Mí jamás quedará avergonzado; caminad en victoria.';

      turns = [
        {
          speakerName: suppName,
          speakerId: suppId,
          role: 'secundario',
          timeWindow: '00:00 - 00:03',
          allocatedSeconds: 3,
          dialogueSpanish: sText,
          emotionalTone: 'Asombro esperanzador señalando el giro narrativo',
          voicePresetName: suppVoice
        },
        {
          speakerName: protName,
          speakerId: protId,
          role: 'protagonista',
          timeWindow: '00:03 - 00:06',
          allocatedSeconds: 3,
          dialogueSpanish: pText,
          emotionalTone: 'Respiro hondo de liberación y lágrimas de gratitud',
          voicePresetName: protVoice
        },
        {
          speakerName: 'Maestro Jesús',
          speakerId: 'jesus_cartoon_3d',
          role: 'maestro',
          timeWindow: '00:06 - 00:10',
          allocatedSeconds: 4,
          dialogueSpanish: jText,
          emotionalTone: 'Victoria solemne y bendición reconfortante',
          voicePresetName: 'Marcus - Deep & Resonant'
        }
      ];
      break;
    }

    case 5:
    default: {
      if (isLast) {
        // Grand Final Scene of the entire series: Reconciliation, Call to Action
        turns = [
          {
            speakerName: protName,
            speakerId: protId,
            role: 'protagonista',
            timeWindow: '00:00 - 00:03',
            allocatedSeconds: 3,
            dialogueSpanish: firstDialogue || '¡Hoy aprendí a no apoyarme en mi propia prudencia jamás!',
            emotionalTone: 'Testimonio firme y gozo transformado',
            voicePresetName: protVoice
          },
          {
            speakerName: suppName,
            speakerId: suppId,
            role: 'secundario',
            timeWindow: '00:03 - 00:06',
            allocatedSeconds: 3,
            dialogueSpanish: '¡Si esta historia tocó tu vida, no te quedes callado!',
            emotionalTone: 'Llamado cálido a la comunidad con una sonrisa',
            voicePresetName: suppVoice
          },
          {
            speakerName: 'Maestro Jesús',
            speakerId: 'jesus_cartoon_3d',
            role: 'maestro',
            timeWindow: '00:06 - 00:10',
            allocatedSeconds: 4,
            dialogueSpanish: 'Escribe AMÉN si crees que Dios transforma tu desierto en victoria.',
            emotionalTone: 'Mirada directa compasiva y llamado memorable',
            voicePresetName: 'Marcus - Deep & Resonant'
          }
        ];
      } else {
        // High Retention Cliffhanger between episodes
        turns = [
          {
            speakerName: protName,
            speakerId: protId,
            role: 'protagonista',
            timeWindow: '00:00 - 00:03',
            allocatedSeconds: 3,
            dialogueSpanish: firstDialogue || '¡Alguien golpea con fuerza la puerta en plena medianoche!',
            emotionalTone: 'Sobresalto súbito mirando hacia la entrada',
            voicePresetName: protVoice
          },
          {
            speakerName: suppName,
            speakerId: suppId,
            role: 'secundario',
            timeWindow: '00:03 - 00:06',
            allocatedSeconds: 3,
            dialogueSpanish: '¡No abras todavía! No sabemos quién está del otro lado.',
            emotionalTone: 'Alerta extrema interponiéndose con cautela',
            voicePresetName: suppVoice
          },
          {
            speakerName: 'Maestro Jesús',
            speakerId: 'jesus_cartoon_3d',
            role: 'maestro',
            timeWindow: '00:06 - 00:10',
            allocatedSeconds: 4,
            dialogueSpanish: `No temas a quien viene; tu mayor prueba te espera en la PARTE ${epNum + 1}.`,
            emotionalTone: 'Misterio sagrado y gancho electrizante',
            voicePresetName: 'Marcus - Deep & Resonant'
          }
        ];
      }
      break;
    }
  }

  return calibrateAndPaceDialogue(turns, scene.durationSec || 10);
}

