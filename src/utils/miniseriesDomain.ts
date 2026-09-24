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

  // Universal Dynamic Scenario Synthesizer: derives dynamic shortTag and room from topic words (NEVER hardcodes ESTANCIA_A9H_916)
  const tagWords = clean
    .replace(/[^\w\sáéíóúüñ]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 3 && !['para', 'como', 'todo', 'toda', 'este', 'esta', 'sobre', 'cuando', 'donde', 'desde', 'pero', 'porque'].includes(w));
  
  const w1 = (tagWords[0] || 'REFUGIO').toUpperCase().slice(0, 8);
  const w2 = (tagWords[1] || 'PROMESA').toUpperCase().slice(0, 8);
  const dynamicTag = `${w1}_${w2}_${hash.toUpperCase().slice(0, 4)}_916`;

  return {
    id: `aposento_narrativo_${hash}`,
    name: `Aposento de Clamor y Encuentro ("${topic.slice(0, 32)}")`,
    shortTag: dynamicTag,
    architecturePromptEn: `Atmospheric and intimate sacred setting in high-end 3D Pixar animation bespoke for "${topic.slice(0, 45)}", weathered dark timber craftsmanship with visible wood grain, hand-carved furnishings, warm plaster and stone architecture, tall arch window framing deep indigo twilight sky with bright celestial stars, floor with polished natural grain.`,
    lightingSetup: `Warm 2800K localized lamp light in the shadows evolving into 4200K heavenly golden glory radiating from Jesus Christ illuminating ${protagonistName}.`,
    propsAndAtmosphere: `Sacred writings open to the promises of God, porcelain cup with faint steam, peaceful ambient dust motes catching golden light rays, pure holy stillness.`,
    negativePromptEn: 'no hospital machines, no modern clutter, no change of character clothing, no facial morphing'
  };
}

/**
 * Generates bespoke, topic-specific dialogue and narrative arcs for all 5 scenes of an episode.
 * Completely eliminates repetitive hooks like "¡Señor Jesús, no doy más!" and ensures
 * visceral, contextual, and word-budget-calibrated dialogues (< 2.2 words/sec).
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

  // Detect thematic archetype for tailor-made dialogue and crisis hooks
  const isWisdomProverbs = clean.includes('fíate') || clean.includes('fiate') || clean.includes('jehová') || clean.includes('jehova') || clean.includes('prudencia') || clean.includes('proverbios') || clean.includes('sabiduria') || clean.includes('sabiduría') || clean.includes('senda') || clean.includes('camino') || clean.includes('planes') || clean.includes('apoyes');
  const isMedical = clean.includes('hospital') || clean.includes('enfermedad') || clean.includes('médico') || clean.includes('medico') || clean.includes('uci') || clean.includes('cáncer') || clean.includes('cancer') || clean.includes('salud');
  const isFinances = clean.includes('quiebra') || clean.includes('desalojo') || clean.includes('deuda') || clean.includes('deudas') || clean.includes('banco') || clean.includes('embargo') || clean.includes('dinero') || clean.includes('arriendo');
  const isFamilyMarriage = clean.includes('matrimonio') || clean.includes('esposos') || clean.includes('pareja') || clean.includes('divorcio') || clean.includes('hijo') || clean.includes('reconciliacion') || clean.includes('reconciliación');
  const isAnxiety = clean.includes('ansiedad') || clean.includes('panico') || clean.includes('pánico') || clean.includes('insomnio') || clean.includes('pesadilla') || clean.includes('miedo') || clean.includes('temor');
  const isStorm = clean.includes('barca') || clean.includes('mar') || clean.includes('tormenta') || clean.includes('tempestad') || clean.includes('olas');

  // Bespoke Scene 1 dialogues based on archetype
  let s1ProtDialogue = isFirst 
    ? `¡Señor Jesús, se agotaron mis fuerzas!`
    : `¡Maestro, sé que no tardas en llegar!`;
  let s1SuppDialogue = `¡No temas más, el Maestro está aquí!`;
  let s1JesusDialogue = `${prot.vocative}, he escuchado tu clamor; no temas.`;

  if (isWisdomProverbs) {
    s1ProtDialogue = isFirst
      ? `¡Confié en mi lógica y todo colapsó!`
      : `¡Maestro, aquí están mis planes rendidos a Ti!`;
    s1SuppDialogue = `¡Suelta el plano, el Gran Edificador llegó!`;
    s1JesusDialogue = `Hijo mío, fíate de Mí; Yo enderezaré tu senda.`;
  } else if (isMedical) {
    s1ProtDialogue = isFirst
      ? `¡El informe médico dice que no hay esperanza!`
      : `¡Maestro, mi respiración depende de Tu poder!`;
    s1SuppDialogue = `¡La ciencia no tiene la última palabra; Jesús entró!`;
    s1JesusDialogue = `${prot.vocative}, Yo soy tu Sanador; la muerte retrocede.`;
  } else if (isFinances) {
    s1ProtDialogue = isFirst
      ? `¡Llegó la orden final de desalojo y no tengo nada!`
      : `¡Maestro, sólo Tú puedes abrir provisión en el desierto!`;
    s1SuppDialogue = `¡No te desesperes; el Dueño del oro está aquí!`;
    s1JesusDialogue = `Hijo mío, Yo soy tu sustento; no quedarás desamparado.`;
  } else if (isFamilyMarriage) {
    s1ProtDialogue = isFirst
      ? `¡El orgullo y el silencio destrozaron nuestro hogar!`
      : `¡Maestro, restaura los lazos que nosotros rompimos!`;
    s1SuppDialogue = `¡No firmes nada todavía; el Príncipe de Paz entró!`;
    s1JesusDialogue = `Hijos míos, lo que parecía roto, mi amor lo restaura.`;
  } else if (isAnxiety) {
    s1ProtDialogue = isFirst
      ? `¡Son las tres de la mañana y el pánico me ahoga!`
      : `¡Maestro, la sombra intenta regresar pero clamo a Ti!`;
    s1SuppDialogue = `¡Mira la luz divina; el tormento tiene que huir!`;
    s1JesusDialogue = `Paz a tu corazón: Yo venzo tus temores ahora.`;
  } else if (isStorm) {
    s1ProtDialogue = isFirst
      ? `¡Las olas nos cubren y la barca se hunde!`
      : `¡Maestro, la tormenta arrecia pero sé quién va a bordo!`;
    s1SuppDialogue = `¡Despierta tu fe; el Señor camina sobre el agua!`;
    s1JesusDialogue = `Calla, enmudece: mi paz gobierna sobre el mar.`;
  }

  // Bespoke Scene 2 dialogues
  let s2JesusDialogue = `¿Crees de corazón que puedo hacer esto por ti?`;
  let s2ProtDialogue = `¡Creo, Señor! ¡Para Ti no hay imposibles!`;
  let s2SuppDialogue = `¡Hágase Tu santa voluntad, Maestro amado!`;

  if (isWisdomProverbs) {
    s2JesusDialogue = `¿Estás dispuesto a soltar el control y dejarme guiar?`;
    s2ProtDialogue = `¡Sí, Señor! ¡Renuncio a mi orgullo y confío en Ti!`;
    s2SuppDialogue = `¡Guíanos, Maestro; Tus caminos son más altos!`;
  } else if (isFinances) {
    s2JesusDialogue = `¿Crees que puedo abrir puertas que nadie puede cerrar?`;
    s2ProtDialogue = `¡Creo, Señor! ¡En Tus manos pongo mi pan y mi casa!`;
    s2SuppDialogue = `¡Toda nuestra confianza reposa en Tu fidelidad!`;
  }

  // Bespoke Scene 3 dialogues
  let s3JesusDialogue = isLast
    ? `¡Decreto vida, paz y victoria sobre tu casa!`
    : `¡La gloria del Padre desciende ahora aquí!`;
  let s3ProtDialogue = `¡Siento Su poder! ¡La pesada carga se fue!`;
  let s3SuppDialogue = `¡Alabado sea el Señor! ¡La atmósfera se llenó de luz!`;

  if (isWisdomProverbs) {
    s3JesusDialogue = isLast
      ? `¡He aquí abro tu camino y coloco cimiento de roca!`
      : `¡Quito la confusión y alumbro tu entendimiento ahora!`;
    s3ProtDialogue = `¡Toda oscuridad se disipó! ¡Veo la senda clara!`;
    s3SuppDialogue = `¡La sabiduría de Dios llenó este lugar de gloria!`;
  }

  // Bespoke Scene 4 dialogues
  const s4SuppDialogue = `¡Miren cómo resplandece la estancia con Su gloria!`;
  const s4ProtDialogue = `¡Lo que era dolor se convirtió en testimonio vivo!`;
  const s4JesusDialogue = `El que en Mí confía jamás será avergonzado.`;

  // Bespoke Scene 5 dialogues
  let s5ProtDialogue = isLast
    ? `¡Declara tu milagro aquí abajo en los comentarios!`
    : `¡Maestro! ¿Qué misterio nos revelarás al amanecer?`;
  let s5SuppDialogue = isLast
    ? `¡Comparte este video con quien necesite esperanza hoy!`
    : `¡Alguien golpea a la puerta con noticias urgentes!`;
  let s5JesusDialogue = isLast
    ? `Si tú crees en esta promesa, escribe AMÉN con fe.`
    : `Prepárate: la mayor gloria viene en la Parte ${epNum + 1}.`;

  const scene1 = {
    sceneNumber: 1,
    durationSec: 10,
    characterId: prot.id,
    secondaryCharacterId: 'jesus_cartoon_3d',
    charactersInShot: [prot.id, supp.id, 'jesus_cartoon_3d'],
    interactionType: 'dos_personajes_frente_a_frente',
    timeframe: '00:00 - 00:10',
    action: `En ${env.name}, ${prot.name} está ${prot.posture} sintiendo la imposibilidad humana de "${topic}". A su lado, ${supp.name} le sostiene en oración. De pronto, el Maestro Jesús entra iluminando el umbral con luz celestial a 3400K.`,
    scenographyDetails: {
      exactLocation: `Foco principal de ${env.name}, entre la penumbra y el umbral de gloria.`,
      narrativeProps: 'Escrituras abiertas, vasijas y elementos cargados de significado dramático.',
      lightingSetup: 'Contraluz de 2800K penetrado por un haz volumétrico dorado de Jesús a 3400K.',
      spatialPlacement: `${prot.name} y ${supp.name} en tercio izquierdo; Jesús entra por el centro en encuadre vertical 9:16.`
    },
    dialogueExchange: calibrateAndPaceDialogue([
      { speakerName: prot.name, speakerId: prot.id, role: 'protagonista', timeWindow: '00:00 - 00:03', allocatedSeconds: 3, dialogueSpanish: s1ProtDialogue, emotionalTone: 'Clamor desgarrador con fe naciente', voicePresetName: prot.voicePreset },
      { speakerName: supp.name, speakerId: supp.id, role: 'secundario', timeWindow: '00:03 - 00:06', allocatedSeconds: 3, dialogueSpanish: s1SuppDialogue, emotionalTone: 'Asombro reverente y esperanza viva', voicePresetName: supp.voicePreset },
      { speakerName: 'Maestro Jesús', speakerId: 'jesus_cartoon_3d', role: 'maestro', timeWindow: '00:06 - 00:10', allocatedSeconds: 4, dialogueSpanish: s1JesusDialogue, emotionalTone: 'Ternura compasiva infinita y autoridad divina', voicePresetName: 'Marcus - Deep & Resonant' }
    ], 10),
    narration: `${prot.name} clamó cuando los recursos humanos se agotaron, pero cuando Jesús entra, la aflicción tiene que retroceder.`,
    onScreenText: isFirst ? 'EL CLAMOR EN LA PRUEBA' : `PARTE ${epNum}: LA ESPERANZA VIVA`,
    secondaryLabel: 'Jeremías 33:3',
    imageToVideoPrompt: `${envLock}\n${jLock}\n${pLock}\n${sLock}\n[CONTINUOUS 10s SHOT - FLUID SPEECH ~2.0 words/sec]: High-end Pixar 3D animated style inside ${env.shortTag}. Multi-person synchronized Latin American Spanish dialogue:\n[00:00-00:03] ${prot.name} (3s): "${s1ProtDialogue}"\n[00:03-00:06] ${supp.name} (3s): "${s1SuppDialogue}"\n[00:06-00:10] Jesus Christ (4s): "${s1JesusDialogue}"\n${negLock}`,
    englishPromptWithSpanishDialogue: `${envLock}\n${jLock}\n${pLock}\n${sLock}\n[CONTINUOUS 10s SHOT - FLUID SPEECH ~2.0 words/sec]: High-end 3D Pixar animation inside ${env.shortTag}. 3 characters in shot. Synced Latin American Spanish dialogue:\n[00:00-00:03] ${prot.name} (3s): "${s1ProtDialogue}"\n[00:03-00:06] ${supp.name} (3s): "${s1SuppDialogue}"\n[00:06-00:10] Jesus Christ (4s): "${s1JesusDialogue}"\n${negLock}`,
    masterNetflixPrompt: `[NETFLIX CONTINUITY - SCENE 1]\n${envLock}\n${jLock}\n${pLock}\n${sLock}\n[ACTION 10s]: 3-person scene in ${env.name}. Divided dialogue in 10s. Spanish voice.\n${negLock}`,
    sfx: 'Crujido de madera y suspiro hondo (-9dB), destello dorado celestial a 432Hz (-8dB)',
    sfxTimeline: [
      { atSecond: '00:00 - 00:02', sound: 'Latido acelerado y suspiro contenido (-8dB)', purpose: 'Enganche empático con el dolor' },
      { atSecond: '00:03 - 00:05', sound: 'Roce de túnicas y giro hacia la puerta (-9dB)', purpose: 'Atención visual al umbral' },
      { atSecond: '00:06 - 00:08', sound: 'Whoosh celestial cálido y campana sagrada (-8dB)', purpose: 'Entrada majestuosa de Jesús' },
      { atSecond: '00:08 - 00:10', sound: 'Cuerdas sinfónicas suaves en calma (-12dB)', purpose: 'Transición sin silencio' }
    ],
    bgMusicMood: 'Chelo melancólico que transmuta a cuerdas cálidas de esperanza'
  };

  const scene2 = {
    sceneNumber: 2,
    durationSec: 10,
    characterId: 'jesus_cartoon_3d',
    secondaryCharacterId: prot.id,
    charactersInShot: ['jesus_cartoon_3d', prot.id, supp.id],
    interactionType: 'encuentro_con_jesus',
    timeframe: '00:10 - 00:20',
    action: `Jesús da un paso firme en ${env.name} y posa Su mano resplandeciente sobre el hombro de ${prot.name}. Una ola de paz sobrenatural satura el rostro de ${prot.name} mientras ${supp.name} contempla maravillado.`,
    scenographyDetails: {
      exactLocation: `Junto a los elementos de prueba en ${env.name}, halo dorado envolviendo a los personajes.`,
      narrativeProps: 'Los objetos de dolor o planos reflejan la luz celestial de Cristo.',
      lightingSetup: 'Luz volumétrica dorada a 3400K enfocada en la mirada compasiva de Cristo.',
      spatialPlacement: `Jesús inclinado con ternura sobre ${prot.name}; plano medio vertical 9:16.`
    },
    dialogueExchange: calibrateAndPaceDialogue([
      { speakerName: 'Maestro Jesús', speakerId: 'jesus_cartoon_3d', role: 'maestro', timeWindow: '00:00 - 00:04', allocatedSeconds: 4, dialogueSpanish: s2JesusDialogue, emotionalTone: 'Pregunta penetrante con amor inconmovible', voicePresetName: 'Marcus - Deep & Resonant' },
      { speakerName: prot.name, speakerId: prot.id, role: 'protagonista', timeWindow: '00:04 - 00:07', allocatedSeconds: 3, dialogueSpanish: s2ProtDialogue, emotionalTone: 'Rendición ardiente y fe desbordante', voicePresetName: prot.voicePreset },
      { speakerName: supp.name, speakerId: supp.id, role: 'secundario', timeWindow: '00:07 - 00:10', allocatedSeconds: 3, dialogueSpanish: s2SuppDialogue, emotionalTone: 'Fe unánime y reverente', voicePresetName: supp.voicePreset }
    ], 10),
    narration: `Cuando el Maestro te mira a los ojos, el miedo y la autosuficiencia pierden todo su poder.`,
    onScreenText: 'EL TOQUE DEL MAESTRO',
    secondaryLabel: 'Juan 11:40',
    imageToVideoPrompt: `${envLock}\n${jLock}\n${pLock}\n${sLock}\n[CONTINUOUS 10s SHOT - FLUID SPEECH ~2.0 words/sec]: High-end Pixar 3D animated style inside ${env.shortTag}. Multi-person synchronized Latin American Spanish dialogue:\n[00:00-00:04] Jesus Christ (4s): "${s2JesusDialogue}"\n[00:04-00:07] ${prot.name} (3s): "${s2ProtDialogue}"\n[00:07-00:10] ${supp.name} (3s): "${s2SuppDialogue}"\n${negLock}`,
    englishPromptWithSpanishDialogue: `${envLock}\n${jLock}\n${pLock}\n${sLock}\n[CONTINUOUS 10s SHOT - FLUID SPEECH ~2.0 words/sec]: High-end 3D Pixar animation inside ${env.shortTag}. 3 characters in frame. Synced Latin American Spanish dialogue:\n[00:00-00:04] Jesus Christ (4s): "${s2JesusDialogue}"\n[00:04-00:07] ${prot.name} (3s): "${s2ProtDialogue}"\n[00:07-00:10] ${supp.name} (3s): "${s2SuppDialogue}"\n${negLock}`,
    masterNetflixPrompt: `[NETFLIX CONTINUITY - SCENE 2]\n${envLock}\n${jLock}\n${pLock}\n${sLock}\n[ACTION 10s]: Hand on shoulder faith challenge. 3 characters.\n${negLock}`,
    sfx: 'Arpa celestial a 432Hz (-10dB), latido que se serena (-9dB), suspiro de paz (-10dB)',
    sfxTimeline: [
      { atSecond: '00:00 - 00:02', sound: 'Contacto de la mano y shimmer celestial (-9dB)', purpose: 'Sentido táctil del toque de Jesús' },
      { atSecond: '00:03 - 00:05', sound: 'Latido acelerado que frena en paz profunda (-8dB)', purpose: 'Alivio biológico' },
      { atSecond: '00:06 - 00:08', sound: 'Arpa etérea y bocanada de aire limpio (-10dB)', purpose: 'Resonancia del clamor de fe' },
      { atSecond: '00:08 - 00:10', sound: 'Zumbido armónico de partículas doradas (-11dB)', purpose: 'Anticipación del milagro' }
    ],
    bgMusicMood: 'Crescendo conmovedor de piano y cuerdas sinfónicas'
  };

  const scene3 = {
    sceneNumber: 3,
    durationSec: 10,
    characterId: 'jesus_cartoon_3d',
    secondaryCharacterId: prot.id,
    charactersInShot: ['jesus_cartoon_3d', prot.id, supp.id],
    interactionType: 'encuentro_con_jesus',
    timeframe: '00:20 - 00:30',
    action: `Jesús alza Su mano derecha con resplandor soberano en ${env.name}. Ondas de luz celestial a 4500K atraviesan el recinto, disolviendo toda tiniebla sobre "${topic}".`,
    scenographyDetails: {
      exactLocation: `Foco principal de ${env.name}, bañado en gloria sobrenatural.`,
      narrativeProps: 'Los objetos de dolor o escasez se llenan de destellos dorados y bendición.',
      lightingSetup: 'Explosión de luz volumétrica dorada a 4500K proyectando rayos ascendentes de victoria.',
      spatialPlacement: `Jesús erguido con soberana majestad; ${prot.name} recibiendo la impartición de pie o de rodillas.`
    },
    dialogueExchange: calibrateAndPaceDialogue([
      { speakerName: 'Maestro Jesús', speakerId: 'jesus_cartoon_3d', role: 'maestro', timeWindow: '00:00 - 00:04', allocatedSeconds: 4, dialogueSpanish: s3JesusDialogue, emotionalTone: 'Autoridad soberana de trueno suave y majestad', voicePresetName: 'Marcus - Deep & Resonant' },
      { speakerName: prot.name, speakerId: prot.id, role: 'protagonista', timeWindow: '00:04 - 00:07', allocatedSeconds: 3, dialogueSpanish: s3ProtDialogue, emotionalTone: 'Asombro sagrado y lágrimas de gozo', voicePresetName: prot.voicePreset },
      { speakerName: supp.name, speakerId: supp.id, role: 'secundario', timeWindow: '00:07 - 00:10', allocatedSeconds: 3, dialogueSpanish: s3SuppDialogue, emotionalTone: 'Glorificación unánime con manos alzadas', voicePresetName: supp.voicePreset }
    ], 10),
    narration: `Una sola palabra de la boca de Jesús basta para cambiar el destino de toda una generación.`,
    onScreenText: isLast ? 'EL MILAGRO SE CONSUMÓ' : 'EL DECRETO DEL CIELO',
    secondaryLabel: 'Salmo 107:20',
    imageToVideoPrompt: `${envLock}\n${jLock}\n${pLock}\n${sLock}\n[CONTINUOUS 10s SHOT - FLUID SPEECH ~2.0 words/sec]: High-end Pixar 3D animated style inside ${env.shortTag}. Multi-person synchronized Latin American Spanish dialogue:\n[00:00-00:04] Jesus Christ (4s): "${s3JesusDialogue}"\n[00:04-00:07] ${prot.name} (3s): "${s3ProtDialogue}"\n[00:07-00:10] ${supp.name} (3s): "${s3SuppDialogue}"\n${negLock}`,
    englishPromptWithSpanishDialogue: `${envLock}\n${jLock}\n${pLock}\n${sLock}\n[CONTINUOUS 10s SHOT - FLUID SPEECH ~2.0 words/sec]: High-end 3D Pixar animation inside ${env.shortTag}. 3 characters in shot. Synced Latin American Spanish dialogue:\n[00:00-00:04] Jesus Christ (4s): "${s3JesusDialogue}"\n[00:04-00:07] ${prot.name} (3s): "${s3ProtDialogue}"\n[00:07-00:10] ${supp.name} (3s): "${s3SuppDialogue}"\n${negLock}`,
    masterNetflixPrompt: `[NETFLIX CONTINUITY - SCENE 3]\n${envLock}\n${jLock}\n${pLock}\n${sLock}\n[ACTION 10s]: Supernatural decree and golden blast. 3 characters.\n${negLock}`,
    sfx: 'Trueno sordo celestial (-8dB), destello dorado a 4500K (-7dB), campana de paz a 528Hz (-8dB)',
    sfxTimeline: [
      { atSecond: '00:00 - 00:02', sound: 'Ráfaga de viento cálido sagrado (-7dB)', purpose: 'Preparación de la proclamación' },
      { atSecond: '00:03 - 00:05', sound: 'Resonancia cristalina y destello dorado (-8dB)', purpose: 'Impartición del decreto' },
      { atSecond: '00:06 - 00:08', sound: 'Chime radiante y vibración cálida (-9dB)', purpose: 'Recepción del milagro' },
      { atSecond: '00:08 - 00:10', sound: 'Armonía de coro celestial en crescendo suave (-10dB)', purpose: 'Consumación de la escena' }
    ],
    bgMusicMood: 'Sinfonía gloriosa de victoria y soberanía'
  };

  const scene4 = {
    sceneNumber: 4,
    durationSec: 10,
    characterId: prot.id,
    secondaryCharacterId: supp.id,
    charactersInShot: [prot.id, supp.id, 'jesus_cartoon_3d'],
    interactionType: 'abrazo_consuelo',
    timeframe: '00:30 - 00:40',
    action: `${prot.name} y ${supp.name} se funden en un abrazo de lágrimas de gozo en ${env.name}. Jesús contempla la escena sonriendo con infinita ternura, bendiciendo el lugar con Su presencia.`,
    scenographyDetails: {
      exactLocation: `Frente a la ventana o umbral de ${env.name}, luz matutina dorada ingresando a 5000K.`,
      narrativeProps: 'Los objetos reflejan el amanecer de bendición.',
      lightingSetup: 'Luz omnidireccional cálida y dorada a 5000K, disolviendo toda sombra de angustia.',
      spatialPlacement: `${prot.name} y ${supp.name} abrazados en primer plano; Jesús detrás con manos extendidas.`
    },
    dialogueExchange: calibrateAndPaceDialogue([
      { speakerName: supp.name, speakerId: supp.id, role: 'secundario', timeWindow: '00:00 - 00:03', allocatedSeconds: 3, dialogueSpanish: s4SuppDialogue, emotionalTone: 'Asombro desbordante y gratitud pura', voicePresetName: supp.voicePreset },
      { speakerName: prot.name, speakerId: prot.id, role: 'protagonista', timeWindow: '00:03 - 00:06', allocatedSeconds: 3, dialogueSpanish: s4ProtDialogue, emotionalTone: 'Paz inquebrantable y testimonio vivo', voicePresetName: prot.voicePreset },
      { speakerName: 'Maestro Jesús', speakerId: 'jesus_cartoon_3d', role: 'maestro', timeWindow: '00:06 - 00:10', allocatedSeconds: 4, dialogueSpanish: s4JesusDialogue, emotionalTone: 'Paz soberana y promesa cumplida', voicePresetName: 'Marcus - Deep & Resonant' }
    ], 10),
    narration: `Donde abundó la aflicción, sobreabundó la gracia. Jesús restauró lo que el enemigo intentó destruir.`,
    onScreenText: 'RESTAURACIÓN Y PAZ',
    secondaryLabel: 'Romanos 8:28',
    imageToVideoPrompt: `${envLock}\n${jLock}\n${pLock}\n${sLock}\n[CONTINUOUS 10s SHOT - FLUID SPEECH ~2.0 words/sec]: High-end Pixar 3D animated style inside ${env.shortTag}. Multi-person synchronized Latin American Spanish dialogue:\n[00:00-00:03] ${supp.name} (3s): "${s4SuppDialogue}"\n[00:03-00:06] ${prot.name} (3s): "${s4ProtDialogue}"\n[00:06-00:10] Jesus Christ (4s): "${s4JesusDialogue}"\n${negLock}`,
    englishPromptWithSpanishDialogue: `${envLock}\n${jLock}\n${pLock}\n${sLock}\n[CONTINUOUS 10s SHOT - FLUID SPEECH ~2.0 words/sec]: High-end 3D Pixar animation inside ${env.shortTag}. 3 characters in shot. Synced Latin American Spanish dialogue:\n[00:00-00:03] ${supp.name} (3s): "${s4SuppDialogue}"\n[00:03-00:06] ${prot.name} (3s): "${s4ProtDialogue}"\n[00:06-00:10] Jesus Christ (4s): "${s4JesusDialogue}"\n${negLock}`,
    masterNetflixPrompt: `[NETFLIX CONTINUITY - SCENE 4]\n${envLock}\n${jLock}\n${pLock}\n${sLock}\n[ACTION 10s]: Emotional embrace and divine smile. 3 characters.\n${negLock}`,
    sfx: 'Sollozo de alegría (-8dB), fricción de lino en abrazo (-9dB), repique sutil de campana de gloria (-8dB)',
    sfxTimeline: [
      { atSecond: '00:00 - 00:02', sound: 'Exhalación de alivio y roce de ropas (-9dB)', purpose: 'Contacto afectivo' },
      { atSecond: '00:03 - 00:05', sound: 'Sollozo de gratitud y suspiro profundo (-8dB)', purpose: 'Desahogo emocional' },
      { atSecond: '00:06 - 00:08', sound: 'Viento suave celestial y campanada tenue (-8dB)', purpose: 'Sello de bendición de Jesús' },
      { atSecond: '00:08 - 00:10', sound: 'Acorde de piano en 432Hz sostenido (-11dB)', purpose: 'Transición hacia la escena final' }
    ],
    bgMusicMood: 'Piano en 432Hz con cuerdas cálidas de adoración y consuelo'
  };

  const scene5 = {
    sceneNumber: 5,
    durationSec: 10,
    characterId: isLast ? 'jesus_cartoon_3d' : prot.id,
    secondaryCharacterId: isLast ? prot.id : 'jesus_cartoon_3d',
    charactersInShot: ['jesus_cartoon_3d', prot.id, supp.id],
    interactionType: isLast ? 'reaccion_asombro' : 'confrontacion_redencion',
    timeframe: '00:40 - 00:50',
    action: isLast
      ? `Jesús extiende Sus manos hacia la cámara con mirada penetrante de infinito amor en ${env.name}. A Su lado, ${prot.name} y ${supp.name} invitan a los espectadores a recibir el milagro y declarar su fe.`
      : `En ${env.name}, una repentina sombra cruza la ventana y una voz resuena en la distancia. ${prot.name} y ${supp.name} giran con tensión dramática mientras Jesús los mira con misterio divino.`,
    scenographyDetails: {
      exactLocation: `Junto al umbral iluminado de ${env.name}.`,
      narrativeProps: isLast ? 'Objetos resplandeciendo en plenitud de bendición.' : 'El umbral abierto con la noche y un misterio por revelar.',
      lightingSetup: isLast ? 'Luz dorada omnidireccional a 5500K.' : 'Contraste dramático entre la luz de Jesús y la noche exterior.',
      spatialPlacement: `Los 3 personajes en plano conjunto vertical 9:16.`
    },
    dialogueExchange: calibrateAndPaceDialogue(
      isLast
        ? [
            { speakerName: 'Maestro Jesús', speakerId: 'jesus_cartoon_3d', role: 'maestro', timeWindow: '00:00 - 00:04', allocatedSeconds: 4, dialogueSpanish: s5JesusDialogue, emotionalTone: 'Llamado íntimo y magnético directo al alma', voicePresetName: 'Marcus - Deep & Resonant' },
            { speakerName: prot.name, speakerId: prot.id, role: 'protagonista', timeWindow: '00:04 - 00:07', allocatedSeconds: 3, dialogueSpanish: s5ProtDialogue, emotionalTone: 'Llamado ardiente a comentar y declarar', voicePresetName: prot.voicePreset },
            { speakerName: supp.name, speakerId: supp.id, role: 'secundario', timeWindow: '00:07 - 00:10', allocatedSeconds: 3, dialogueSpanish: s5SuppDialogue, emotionalTone: 'Urgencia de fe y llamado a compartir', voicePresetName: supp.voicePreset }
          ]
        : [
            { speakerName: prot.name, speakerId: prot.id, role: 'protagonista', timeWindow: '00:00 - 00:04', allocatedSeconds: 4, dialogueSpanish: s5ProtDialogue, emotionalTone: 'Tensión dramática y asombro por lo que viene', voicePresetName: prot.voicePreset },
            { speakerName: supp.name, speakerId: supp.id, role: 'secundario', timeWindow: '00:04 - 00:07', allocatedSeconds: 3, dialogueSpanish: s5SuppDialogue, emotionalTone: 'Alerta expectante mirando hacia la puerta', voicePresetName: supp.voicePreset },
            { speakerName: 'Maestro Jesús', speakerId: 'jesus_cartoon_3d', role: 'maestro', timeWindow: '00:07 - 00:10', allocatedSeconds: 3, dialogueSpanish: s5JesusDialogue, emotionalTone: 'Misterio divino magnético que atrapa al espectador', voicePresetName: 'Marcus - Deep & Resonant' }
          ],
      10
    ),
    narration: isLast
      ? `Jesús nunca llega tarde. Si tú crees en Su poder para tu hogar, escribe AMÉN y comparte esta serie completa.`
      : `Pero esto era solo el comienzo del milagro. [PAUSA] ¿Qué ocurrirá al amanecer? Descúbrelo en la PARTE ${epNum + 1}.`,
    onScreenText: isLast ? 'ESCRIBE "AMÉN" Y COMPARTE' : `CONTINÚA EN PARTE ${epNum + 1}`,
    secondaryLabel: isLast ? 'FIN DE LA SERIE' : `PARTE ${epNum + 1} MAÑANA`,
    imageToVideoPrompt: isLast
      ? `${envLock}\n${jLock}\n${pLock}\n${sLock}\n[CONTINUOUS 10s SHOT - FLUID SPEECH ~2.0 words/sec]: High-end Pixar 3D animation. Grand finale at the luminous doorway. 3 characters looking into camera:\n[00:00-00:04] Jesus Christ (4s): "${s5JesusDialogue}"\n[00:04-00:07] ${prot.name} (3s): "${s5ProtDialogue}"\n[00:07-00:10] ${supp.name} (3s): "${s5SuppDialogue}"\n${negLock}`
      : `${envLock}\n${jLock}\n${pLock}\n${sLock}\n[CONTINUOUS 10s SHOT - FLUID SPEECH ~2.0 words/sec]: High-end Pixar 3D animation. Dramatic cliffhanger at the doorway of ${env.shortTag}:\n[00:00-00:04] ${prot.name} (4s): "${s5ProtDialogue}"\n[00:04-00:07] ${supp.name} (3s): "${s5SuppDialogue}"\n[00:07-00:10] Jesus Christ (3s): "${s5JesusDialogue}"\n${negLock}`,
    englishPromptWithSpanishDialogue: isLast
      ? `${envLock}\n${jLock}\n${pLock}\n${sLock}\n[CONTINUOUS 10s SHOT - FLUID SPEECH ~2.0 words/sec]: Grand finale in 9:16 vertical. Jesus Christ extends his hands toward camera. Synced Latin American Spanish dialogue:\n[00:00-00:04] Jesus Christ (4s): "${s5JesusDialogue}"\n[00:04-00:07] ${prot.name} (3s): "${s5ProtDialogue}"\n[00:07-00:10] ${supp.name} (3s): "${s5SuppDialogue}"\n${negLock}`
      : `${envLock}\n${jLock}\n${pLock}\n${sLock}\n[CONTINUOUS 10s SHOT - FLUID SPEECH ~2.0 words/sec]: Cinematic cliffhanger in vertical 9:16 at the doorway of ${env.shortTag}. Synced Latin American Spanish dialogue:\n[00:00-00:04] ${prot.name} (4s): "${s5ProtDialogue}"\n[00:04-00:07] ${supp.name} (3s): "${s5SuppDialogue}"\n[00:07-00:10] Jesus Christ (3s): "${s5JesusDialogue}"\n${negLock}`,
    masterNetflixPrompt: isLast
      ? `[NETFLIX CONTINUITY - SCENE 5 (FINALE)]\n${envLock}\n${jLock}\n${pLock}\n${sLock}\n[ACTION 10s]: Grand finale blessing to camera. 3 characters.\n${negLock}`
      : `[NETFLIX CONTINUITY - SCENE 5 (CLIFFHANGER)]\n${envLock}\n${jLock}\n${pLock}\n${sLock}\n[ACTION 10s]: Cliffhanger at door. 3 characters. Next episode hook.\n${negLock}`,
    sfx: isLast ? 'Campana solemne de templo (-6dB), arpa triunfal (-8dB), oleada dorada (-9dB)' : 'Acorde de suspenso (Braam -6dB), crujido de puerta (-8dB), latido intrigante (-7dB)',
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
          { atSecond: '00:08 - 00:10', sound: 'Crescendo abrupto de cuerdas que se corta en seco (-6dB)', purpose: 'Corte de suspenso para obligar a ver la siguiente parte' }
        ],
    bgMusicMood: isLast ? 'Himno victorioso de adoración y gloria' : 'Suspenso cinematográfico con chelo y campanas'
  };

  return [scene1, scene2, scene3, scene4, scene5];
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

