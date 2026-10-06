import { GoogleGenAI } from "@google/genai";

// 6 RADICAL, NON-CONVERSATION OPENING ARCHETYPES (ZERO COUPLE CHATS IN SCENE 1)
const OPENING_FORMATS = [
  {
    id: "objeto_misterioso_shock",
    name: "El Objeto Oculto / Documento Shock",
    selectIf: (topic) => topic.includes("recibo") || topic.includes("carta") || topic.includes("herencia") || topic.includes("deuda") || topic.includes("firma") || topic.includes("documento"),
    generateHook: (topic, pName) => `Nadie en el banco entendía por qué este recibo de embargo apareció con una firma que no era humana.`,
    scene1: {
      action: (pName, envName) => `Primer plano macro en 9:16 a una carta con bordes desgastados sobre la mesa de madera en ${envName}. Las manos de ${pName} tiemblan al rozar la tinta fresca mientras una sola vela titila. Cero diálogos cotidianos: la tensión se corta en el aire.`,
      cameraPromptEn: (pName, envName) => `Cinematic macro shot, 9:16 vertical ratio, 3D Pixar style. Extreme close-up of weathered parchment letter on rustic timber table, trembling fingers of ${pName} tracing ancient glowing ink, single flickering candle, volumetric dust motes floating in dark intimate room.`,
      dialogueExchange: (pName) => [
        {
          speakerName: pName,
          speakerId: "protagonista_fe",
          timeWindow: "00:01 - 00:05",
          allocatedSeconds: 4,
          dialogueSpanish: "Dios mío... ¿por qué este documento tiene la firma de alguien que ya no está aquí?",
          emotionalTone: "asombro tembloroso y voz entrecortada",
          voicePresetName: "hombre_angustia_esperanza"
        },
        {
          speakerName: "Voz en la Puerta",
          speakerId: "figura_misteriosa",
          timeWindow: "00:05 - 00:10",
          allocatedSeconds: 5,
          dialogueSpanish: "Abre la puerta. Lo que estuvo oculto por diez años, hoy sale a la luz.",
          emotionalTone: "autoridad serena y susurro sagrado",
          voicePresetName: "jesus_calido_reverente"
        }
      ],
      sfx: "Tic-tac sordo de reloj de pared, roce de papel viejo y golpe firme en la puerta de madera.",
      narration: "Hay secretos que los hombres sellaron en la oscuridad, pero una orden celestial rompe todo cerrojo humano.",
      onScreenText: "LO QUE ESTUVO OCULTO SALE A LA LUZ"
    }
  },
  {
    id: "accion_in_media_res_tormenta",
    name: "Acción en Crisis / In Media Res",
    selectIf: (topic) => topic.includes("lluvia") || topic.includes("tormenta") || topic.includes("barca") || topic.includes("huye") || topic.includes("correr") || topic.includes("rescate") || topic.includes("desesperada"),
    generateHook: (topic, pName) => `Corrió tres kilómetros bajo la lluvia sin zapatos buscando una puerta abierta. Lo que encontró al empujar el madero desafió toda lógica.`,
    scene1: {
      action: (pName, envName) => `${pName} empuja con el hombro una pesada puerta de roble de una capilla en ${envName}. Cae de rodillas sobre las baldosas de piedra empapado por una tormenta torrencial, con la respiración entrecortada y la mirada clavada en el altar.`,
      cameraPromptEn: (pName, envName) => `Action in media res, 9:16 vertical 3D Pixar render. ${pName} bursting through heavy oak door drenched in rain, falling to knees on ancient stone tiles, dramatic lightning flash casting long shadows, intense volumetric raindrops catching ambient moonlight.`,
      dialogueExchange: (pName) => [
        {
          speakerName: pName,
          speakerId: "protagonista_fe",
          timeWindow: "00:01 - 00:05",
          allocatedSeconds: 4,
          dialogueSpanish: "¡Si eres real... si de verdad escuchas a los que no tienen nada, no me dejes morir aquí!",
          emotionalTone: "clamor desesperado al límite de las fuerzas",
          voicePresetName: "joven_angustiado"
        },
        {
          speakerName: "Jesús",
          speakerId: "jesus_cartoon_3d",
          timeWindow: "00:05 - 00:10",
          allocatedSeconds: 5,
          dialogueSpanish: "Hijo mío... deja de correr. Yo estuve esperándote toda la noche.",
          emotionalTone: "paz sobrenatural que apaga el viento",
          voicePresetName: "jesus_calido_reverente"
        }
      ],
      sfx: "Trueno distante, lluvia golpeando el vitral y silencio súbito al entrar la voz divina.",
      narration: "Cuando las fuerzas del hombre se agotan en medio de la tormenta, la misericordia de Dios sale a su encuentro.",
      onScreenText: "DEJA DE CORRER: ÉL ESTÁ AQUÍ"
    }
  },
  {
    id: "inocencia_infantil",
    name: "La Inocencia que Desarma al Adulto",
    selectIf: (topic) => topic.includes("niño") || topic.includes("hijo") || topic.includes("pequeño") || topic.includes("casa") || topic.includes("maletas") || topic.includes("desalojo"),
    generateHook: (topic, pName) => `'Papá, guarda las maletas, el hombre de blanco ya está aquí en la sala.' Tenían 3 horas para el desalojo y este niño de 6 años detuvo todo.`,
    scene1: {
      action: (pName, envName) => `En el suelo de ${envName}, un niño de 6 años dibuja con tiza una silueta de luz blanca mientras al fondo se ven las cajas y maletas apiladas. El pequeño sonríe con inocencia mirando hacia el pasillo vacío.`,
      cameraPromptEn: (pName, envName) => `Warm low-angle camera, 9:16 vertical 3D Pixar style. 6yo boy drawing glowing chalk figure on wooden floor, packed cardboard boxes in blurred background, boy looking up with bright joyful eyes towards an empty hallway bathed in golden rim light.`,
      dialogueExchange: (pName) => [
        {
          speakerName: "Mateo (El Niño)",
          speakerId: "mateo_nino_fe",
          timeWindow: "00:01 - 00:05",
          allocatedSeconds: 4,
          dialogueSpanish: "Papá... deja de empacar las maletas. El hombre de blanco me dijo que hoy nadie se va de esta casa.",
          emotionalTone: "inocencia pura y alegría sin dudar",
          voicePresetName: "mateo_nino_paz"
        },
        {
          speakerName: pName,
          speakerId: "protagonista_fe",
          timeWindow: "00:05 - 00:10",
          allocatedSeconds: 5,
          dialogueSpanish: "Hijo... ¿con quién estás hablando? En ese pasillo no hay nadie...",
          emotionalTone: "desconcierto, llanto contenido y llaves cayendo al piso",
          voicePresetName: "hombre_angustia_esperanza"
        }
      ],
      sfx: "Trazo de tiza en madera, llaves metálicas cayendo al piso y campanada dorada celestial.",
      narration: "Dios no necesita ejércitos para detener una crisis: a veces usa la fe pura de un niño para avergonzar al temor.",
      onScreenText: "LA FE DE UN NIÑO DETUVO EL DESALOJO"
    }
  },
  {
    id: "shock_clinico_monitor",
    name: "El Shock Clínico / Silencio de Monitor",
    selectIf: (topic) => topic.includes("hospital") || topic.includes("médico") || topic.includes("medico") || topic.includes("doctor") || topic.includes("uci") || topic.includes("cáncer") || topic.includes("salud") || topic.includes("cirugía"),
    generateHook: (topic, pName) => `El monitor cardíaco marcó cero a las 3:17 AM. Los médicos bajaron los brazos... pero un suspiro en la penumbra detuvo la sala.`,
    scene1: {
      action: (pName, envName) => `Sala de urgencias en ${envName} bajo una luz fría azulada. El monitor cardíaco dibuja una línea horizontal continua con un pitido estridente. ${pName} baja los guantes y cierra los ojos derrotado frente a la camilla.`,
      cameraPromptEn: (pName, envName) => `High-stakes medical drama, 9:16 vertical 3D Pixar render. Flatline monitor glowing stark green in dark sterile hospital room, exhausted surgeon ${pName} dropping surgical clamps in defeat, subtle warm golden beam descending onto patient bed.`,
      dialogueExchange: (pName) => [
        {
          speakerName: pName,
          speakerId: "protagonista_fe",
          timeWindow: "00:01 - 00:04",
          allocatedSeconds: 3,
          dialogueSpanish: "Hora del fallecimiento: 3:17 AM... la medicina ya no puede hacer nada.",
          emotionalTone: "derrota profunda y voz quebrada",
          voicePresetName: "hombre_maduro_grave"
        },
        {
          speakerName: "Enfermera",
          speakerId: "companero_fe",
          timeWindow: "00:04 - 00:10",
          allocatedSeconds: 6,
          dialogueSpanish: "¡Doctor, mire la pantalla! ¡El corazón volvió a latir... el pulso se disparó a 75!",
          emotionalTone: "asombro desbordante y grito ahogado",
          voicePresetName: "mujer_fe_emotiva"
        }
      ],
      sfx: "Pitido continuo de asistolia interrumpido por tres latidos rítmicos acelerados [BIP... BIP... BIP].",
      narration: "Donde la ciencia extiende el certificado de muerte, Jesucristo se presenta como la Resurrección y la Vida.",
      onScreenText: "CUANDO LA CIENCIA DIJO NO, ÉL DIJO SÍ"
    }
  },
  {
    id: "dilema_moral_provocador",
    name: "El Dilema Moral / Pregunta Frontal",
    selectIf: (topic) => topic.includes("dinero") || topic.includes("soborno") || topic.includes("prueba") || topic.includes("fe") || topic.includes("dólares") || topic.includes("millón") || topic.includes("contrato"),
    generateHook: (topic, pName) => `¿Aceptarías un millón de dólares si la condición fuera no volver a orar nunca más? Esta mujer dijo que no... y lo que pasó 24 horas después desafió toda lógica.`,
    scene1: {
      action: (pName, envName) => `Contrapicado dramático cinematográfico en ${envName}. Sobre la mesa rústica hay una Biblia gastada de un lado y un fajo de dinero del otro. ${pName} empuja el dinero lejos con mano firme y mirada de fuego.`,
      cameraPromptEn: (pName, envName) => `Dramatic low-angle shot, 9:16 vertical 3D Pixar style. Close-up on wooden table with worn leather Bible opposing a stack of money documents, resolute hand of ${pName} pushing the money away into shadows, warm amber rim lighting highlighting unwavering conviction.`,
      dialogueExchange: (pName) => [
        {
          speakerName: pName,
          speakerId: "protagonista_fe",
          timeWindow: "00:01 - 00:05",
          allocatedSeconds: 4,
          dialogueSpanish: "Pongan el precio que quieran sobre esta mesa. Mi alma y mi familia ya fueron compradas a precio de sangre.",
          emotionalTone: "convicción inquebrantable y autoridad santa",
          voicePresetName: "mujer_intercesora_firme"
        },
        {
          speakerName: "Prestamista",
          speakerId: "companero_fe",
          timeWindow: "00:05 - 00:10",
          allocatedSeconds: 5,
          dialogueSpanish: "Si rechazas esto, mañana a las 8 AM estarás en la calle... ¿tu Dios vendrá a pagar tu deuda?",
          emotionalTone: "desafío cínico y amenaza fría",
          voicePresetName: "hombre_arrepentido_profundo"
        }
      ],
      sfx: "Monedas tintineando en la madera, suspiro profundo y portazo distante.",
      narration: "El enemigo siempre ofrece atajos de oro, pero la fe prefiere esperar en el Dios que nunca avergüenza a los suyos.",
      onScreenText: "MI FE NO TIENE PRECIO"
    }
  },
  {
    id: "teofania_camino_solitario",
    name: "Teofanía en el Camino Solitario",
    selectIf: () => true, // default universal fallback
    generateHook: (topic, pName) => `Iba caminando solo por la carretera a las 4:00 AM pensando en no volver a casa... hasta que una figura con túnica y luz celestial caminó a su lado.`,
    scene1: {
      action: (pName, envName) => `Sendero de tierra al amanecer en ${envName} envuelto en neblina azulada y fría. ${pName} camina solo, arrastrando los pies con la mirada fija en las piedras del suelo. Al lado, una silueta de túnica blanca camina a su mismo paso.`,
      cameraPromptEn: (pName, envName) => `Atmospheric dawn landscape, 9:16 vertical 3D Pixar rendering. Solitary wanderer ${pName} walking down a misty dirt road with head bowed, a glowing figure in white linen robe and sky-blue mantle walking quietly alongside him in the soft golden morning haze.`,
      dialogueExchange: (pName) => [
        {
          speakerName: pName,
          speakerId: "protagonista_fe",
          timeWindow: "00:01 - 00:05",
          allocatedSeconds: 4,
          dialogueSpanish: "Siga su camino, amigo... hoy no tengo nada que darle a nadie. Lo he perdido todo.",
          emotionalTone: "derrota amarga y susurro cansado",
          voicePresetName: "joven_angustiado"
        },
        {
          speakerName: "Jesús",
          speakerId: "jesus_cartoon_3d",
          timeWindow: "00:05 - 00:10",
          allocatedSeconds: 5,
          dialogueSpanish: "No vengo a pedirte nada. Vengo a devolverte todo lo que el enemigo te robó en el camino.",
          emotionalTone: "ternura soberana y amor infinito",
          voicePresetName: "jesus_calido_reverente"
        }
      ],
      sfx: "Pisadas solitarias sobre grava fría, viento matutino y resonancia dorada 432Hz.",
      narration: "A veces pensamos que estamos huyendo solos, sin darnos cuenta de que el Salvador camina a nuestro lado paso a paso.",
      onScreenText: "NO ESTÁS SOLO EN EL CAMINO"
    }
  }
];

function pickOpeningFormat(topic = "") {
  const clean = topic.toLowerCase();
  for (const fmt of OPENING_FORMATS) {
    if (fmt.id !== "teofania_camino_solitario" && fmt.selectIf(clean)) {
      return fmt;
    }
  }
  // Rotate based on hash if no direct keyword
  const hash = Math.abs(clean.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0));
  return OPENING_FORMATS[hash % OPENING_FORMATS.length];
}

// Diverse, non-repetitive character archetypes
const CHARACTER_NAMES_POOL = [
  { name: "Dr. Julián Varela", role: "Cirujano jefe en crisis", gender: "male", age: "42 años", voice: "hombre_maduro_grave" },
  { name: "Sara Mendoza", role: "Madre intercesora", gender: "female", age: "36 años", voice: "mujer_fe_emotiva" },
  { name: "Lucas Herrera", role: "Joven universitario", gender: "male", age: "21 años", voice: "joven_angustiado" },
  { name: "Abuelita Esperanza", role: "Anciana de oración", gender: "female", age: "69 años", voice: "anciana_sabia_amorosa" },
  { name: "Marcos Villalba", role: "Padre arrepentido", gender: "male", age: "48 años", voice: "hombre_arrepentido_profundo" },
  { name: "Valeria Santillán", role: "Esposa de fe firme", gender: "female", age: "34 años", voice: "mujer_intercesora_firme" },
  { name: "Mateo Silva", role: "Comerciante en quiebra", gender: "male", age: "39 años", voice: "hombre_angustia_esperanza" },
  { name: "Raquel Benítez", role: "Líder comunitaria", gender: "female", age: "33 años", voice: "mujer_fe_serena" }
];

export function buildFallbackMiniseries(
  topic = "El milagro que nadie esperaba",
  totalParts = 3,
  category = "milagro_familiar",
  lockedEnvironmentId,
  options = {}
) {
  const cleanTopic = String(topic || "El milagro que nadie esperaba").trim();
  const partsCount = Math.max(2, Math.min(4, Number(totalParts) || 3));
  const seriesId = `miniserie_${Date.now()}`;

  const openingFormat = pickOpeningFormat(cleanTopic);

  // Pick protagonist
  const hash = Math.abs(cleanTopic.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0));
  const defaultChar = CHARACTER_NAMES_POOL[hash % CHARACTER_NAMES_POOL.length];
  const protagonistName = options.customCharacters
    ? options.customCharacters.split(",")[0].trim()
    : defaultChar.name;
  const companionName = options.customCharacters && options.customCharacters.includes(",")
    ? options.customCharacters.split(",")[1].trim()
    : CHARACTER_NAMES_POOL[(hash + 1) % CHARACTER_NAMES_POOL.length].name;

  const jesusChar = {
    id: "jesus_cartoon_3d",
    name: "Jesús de Nazaret",
    role: "Maestro, Salvador y Sanador Divino",
    gender: "male",
    age: "33 años",
    avatarUrl: "/sacred-assets/icon-192.png",
    description: "Túnica de lino blanco crudo impecable, manto azul sereno, ojos compasivos que irradian paz infinita, resplandor dorado suave (3400K).",
    voicePreset: "jesus_calido_reverente"
  };

  const uiCharacters = [
    jesusChar,
    {
      id: "protagonista_fe",
      name: protagonistName,
      role: defaultChar.role,
      gender: defaultChar.gender,
      age: defaultChar.age,
      avatarUrl: "/sacred-assets/icon-192.png",
      description: "Personaje expresivo con vestimenta cuidada y mirada que refleja la intensidad de la prueba y el renacer de la fe.",
      voicePreset: defaultChar.voice
    },
    {
      id: "companero_fe",
      name: companionName,
      role: "Personaje de apoyo y testimonio",
      gender: "female",
      age: "35 años",
      avatarUrl: "/sacred-assets/icon-192.png",
      description: "Acompañante fiel que presencia el milagro y testifica de la gloria de Dios.",
      voicePreset: "mujer_fe_emotiva"
    }
  ];

  const env = {
    id: lockedEnvironmentId || (openingFormat.id === "shock_clinico_monitor" ? "sala_hospital_noche_916" : openingFormat.id === "accion_in_media_res_tormenta" ? "ermita_lluvia_916" : "aposento_fe_916"),
    name: openingFormat.id === "shock_clinico_monitor" ? "Sala de Urgencias a Medianoche" : openingFormat.id === "accion_in_media_res_tormenta" ? "Ermita Rústica bajo la Lluvia" : "Aposento Familiar de Clamor",
    shortTag: "SANTUARIO_916",
    architecturePromptEn: "Atmospheric 3D Pixar sacred setting with warm rustic timber, arched stone window overlooking starlit hills, glowing candlelight.",
    lightingSetup: "Dramatic cold shadow 2800K shifting to warm divine glory 3400K-5500K with volumetric light rays.",
    propsAndAtmosphere: "Open wooden Bible, rustic clay cup, flickering candle, worn family prayer table.",
    negativePromptEn: "no distortion, no extra limbs, no cartoonish disproportions, no facial morphing"
  };

  const episodes = Array.from({ length: partsCount }).map((_, epIdx) => {
    const epNum = epIdx + 1;
    const isFirst = epNum === 1;
    const isLast = epNum === partsCount;

    let epTitle = `Capítulo ${epNum}: El Detonante Inesperado`;
    if (epNum === 2) epTitle = `Capítulo ${epNum}: El Giro Sobrenatural`;
    if (epNum === 3) epTitle = isLast ? `Capítulo ${epNum}: El Milagro y la Gloria de Dios` : `Capítulo ${epNum}: La Batalla de Fe`;
    if (epNum === 4) epTitle = `Capítulo ${epNum}: Restauración Total`;

    // Dynamic hooks per episode that are completely different
    let episodeHook = "";
    if (isFirst) {
      episodeHook = openingFormat.generateHook(cleanTopic, protagonistName);
    } else if (epNum === 2) {
      episodeHook = `Cuando pensaban que todo había terminado, un detalle inesperado en la habitación los dejó sin respiración. Jesús no había terminado aún.`;
    } else if (epNum === 3) {
      episodeHook = isLast
        ? `Faltaban solo segundos antes de que venciera el plazo. Lo que la ciencia y la lógica jamás podrán explicar, ocurrió en un instante.`
        : `La prueba subió a su punto máximo: o se rendían al miedo, o creían a la promesa que Jesús les hizo a las 3:00 AM.`;
    } else {
      episodeHook = `Hoy este testimonio de fe le da la vuelta al mundo para recordarte que Dios jamás llega tarde a tu situación.`;
    }

    // Build Scene 1 strictly from the selected OPENING FORMAT (ZERO couple chats)
    const scene1Data = isFirst
      ? {
          sceneNumber: 1,
          durationSec: 10,
          characterId: "protagonista_fe",
          charactersInShot: ["protagonista_fe"],
          interactionType: "confrontacion_redencion",
          timeframe: "00:00 - 00:10",
          action: openingFormat.scene1.action(protagonistName, env.name),
          dialogueExchange: openingFormat.scene1.dialogueExchange(protagonistName),
          narration: openingFormat.scene1.narration,
          onScreenText: openingFormat.scene1.onScreenText,
          secondaryLabel: "00:00 - 00:10 (Impacto Visual Inicial)",
          imageToVideoPrompt: openingFormat.scene1.cameraPromptEn(protagonistName, env.name),
          englishPromptWithSpanishDialogue: `High-end 3D Pixar style, 9:16 vertical. Opening shot. Dialogue in Spanish: "${openingFormat.scene1.dialogueExchange(protagonistName).map(d => `${d.speakerName}: ${d.dialogueSpanish}`).join(' ')}"`,
          sfx: openingFormat.scene1.sfx,
          bgMusicMood: "Atmósfera ambiental cinematográfica tensa y reverente en 432Hz (-18dB)"
        }
      : {
          sceneNumber: 1,
          durationSec: 10,
          characterId: "protagonista_fe",
          secondaryCharacterId: "jesus_cartoon_3d",
          charactersInShot: ["protagonista_fe", "jesus_cartoon_3d"],
          interactionType: "encuentro_con_jesus",
          timeframe: "00:00 - 00:10",
          action: `${protagonistName} contempla el lugar donde Jesús se manifestó en el capítulo anterior, sintiendo una paz que desafía toda lógica humana.`,
          dialogueExchange: [
            {
              speakerName: protagonistName,
              speakerId: "protagonista_fe",
              timeWindow: "00:01 - 00:05",
              allocatedSeconds: 4,
              dialogueSpanish: "Señor, sigo sin entender cómo hiciste lo imposible... pero hoy creo más que nunca.",
              emotionalTone: "gratitud profunda y asombro",
              voicePresetName: defaultChar.voice
            },
            {
              speakerName: "Jesús",
              speakerId: "jesus_cartoon_3d",
              timeWindow: "00:05 - 00:10",
              allocatedSeconds: 5,
              dialogueSpanish: "Aún mayores cosas verás si permaneces en Mi palabra. No temas.",
              emotionalTone: "paz y promesa soberana",
              voicePresetName: "jesus_calido_reverente"
            }
          ],
          narration: `La presencia de Dios no fue una casualidad pasajera: fue el inicio de una transformación eterna.`,
          onScreenText: `LA PROMESA SIGUE VIVA`,
          secondaryLabel: "00:00 - 00:10 (10s)",
          imageToVideoPrompt: `High-end 3D Pixar vertical 9:16. ${protagonistName} looking with awe at golden light remaining in room, subtle divine halo, warm morning glow.`,
          englishPromptWithSpanishDialogue: `High-end 3D Pixar vertical. [CONTINUOUS 10s SHOT]: Dialogue in Spanish: "${protagonistName}: Señor, sigo sin entender... pero creo. Jesus: Aún mayores cosas verás si permaneces en Mi palabra."`,
          sfx: "Resonancia celestial tibia y suspiro de gratitud.",
          bgMusicMood: "Cuerdas orquestales suaves en 432Hz."
        };

    const scenes = [
      scene1Data,
      {
        sceneNumber: 2,
        durationSec: 10,
        characterId: "jesus_cartoon_3d",
        secondaryCharacterId: "protagonista_fe",
        charactersInShot: ["protagonista_fe", "jesus_cartoon_3d"],
        interactionType: "encuentro_con_jesus",
        timeframe: "00:10 - 00:20",
        action: `Un resplandor dorado penetra en ${env.name}. Jesús de Nazaret se hace visible en el umbral con mirada compasiva. Su presencia disipa toda tiniebla en el recinto.`,
        dialogueExchange: [
          {
            speakerName: "Jesús",
            speakerId: "jesus_cartoon_3d",
            timeWindow: "00:11 - 00:16",
            allocatedSeconds: 5,
            dialogueSpanish: "Paz a vosotros. He visto cada lágrima que derramaste en secreto.",
            emotionalTone: "autoridad celestial compasiva y ternura infinita",
            voicePresetName: "jesus_calido_reverente"
          },
          {
            speakerName: protagonistName,
            speakerId: "protagonista_fe",
            timeWindow: "00:16 - 00:20",
            allocatedSeconds: 4,
            dialogueSpanish: "¡Maestro!... Creí que estabas lejos, pero siempre estuviste aquí.",
            emotionalTone: "alivio desbordante y caída de rodillas",
            voicePresetName: defaultChar.voice
          }
        ],
        narration: `La presencia de Jesucristo entra en el momento más oscuro para transformar el lamento en danza.`,
        onScreenText: `JESÚS ENTRA AL CUARTO`,
        secondaryLabel: "00:10 - 00:20 (10s)",
        imageToVideoPrompt: `High-end 3D Pixar style, 9:16 vertical. Jesus of Nazareth entering warmly with soft golden volumetric rim light (3400K), wearing pristine ivory-white robe and sky-blue mantle, extending hand towards ${protagonistName}.`,
        englishPromptWithSpanishDialogue: `High-end 3D Pixar vertical. [CONTINUOUS 10s SHOT]: Jesus enters room. Dialogue in Spanish: "Jesus: Paz a vosotros. He visto cada lágrima. ${protagonistName}: ¡Maestro!... Creí que estabas lejos, pero siempre estuviste aquí."`,
        sfx: "Campanada celestial cristalina y suave resonancia sagrada.",
        bgMusicMood: "Entrada de cuerdas orquestales celestiales y arpa cálida."
      },
      {
        sceneNumber: 3,
        durationSec: 10,
        characterId: "protagonista_fe",
        secondaryCharacterId: "jesus_cartoon_3d",
        charactersInShot: ["protagonista_fe", "jesus_cartoon_3d"],
        interactionType: "dos_personajes_frente_a_frente",
        timeframe: "00:20 - 00:30",
        action: `${protagonistName} desahoga su dolor a los pies del Salvador. Jesús se inclina con ternura paternal y coloca Su mano sobre su hombro.`,
        dialogueExchange: [
          {
            speakerName: protagonistName,
            speakerId: "protagonista_fe",
            timeWindow: "00:21 - 00:25",
            allocatedSeconds: 4,
            dialogueSpanish: "Señor... la prueba fue demasiado pesada. ¿Por qué tardaste tanto?",
            emotionalTone: "desahogo sincero y llanto de alivio",
            voicePresetName: defaultChar.voice
          },
          {
            speakerName: "Jesús",
            speakerId: "jesus_cartoon_3d",
            timeWindow: "00:25 - 00:30",
            allocatedSeconds: 5,
            dialogueSpanish: "No tardé: Mi tiempo es perfecto. Lo que parecía tu final es Mi nuevo comienzo.",
            emotionalTone: "poder divino consolador",
            voicePresetName: "jesus_calido_reverente"
          }
        ],
        narration: `El contacto con el Salvador renueva las fuerzas y devuelve la esperanza que el mundo arrebató.`,
        onScreenText: `"MI TIEMPO ES PERFECTO"`,
        secondaryLabel: "00:20 - 00:30 (10s)",
        imageToVideoPrompt: `High-end 3D Pixar style, 9:16 vertical. Jesus intimately comforting kneeling protagonist ${protagonistName}, hand resting gently on shoulder, radiant warm amber backlight, photorealistic fabric textures.`,
        englishPromptWithSpanishDialogue: `High-end 3D Pixar style, 9:16 vertical. Two-character dialogue shot. Dialogue in Spanish: "${protagonistName}: Señor... ¿Por qué tardaste tanto? Jesus: No tardé: Mi tiempo es perfecto. Lo que parecía tu final es Mi nuevo comienzo."`,
        sfx: "Resplandor celestial cálido, roce suave de túnica de lino.",
        bgMusicMood: "Crescendo emotivo de violonchelo y piano en 432Hz."
      },
      {
        sceneNumber: 4,
        durationSec: 10,
        characterId: "jesus_cartoon_3d",
        secondaryCharacterId: "companero_fe",
        charactersInShot: ["protagonista_fe", "companero_fe", "jesus_cartoon_3d"],
        interactionType: "abrazo_consuelo",
        timeframe: "00:30 - 00:40",
        action: `Jesús alza Su mano derecha bendiciendo todo el espacio. La atmósfera se llena de partículas de luz divina que restauran el recinto.`,
        dialogueExchange: [
          {
            speakerName: "Jesús",
            speakerId: "jesus_cartoon_3d",
            timeWindow: "00:31 - 00:36",
            allocatedSeconds: 5,
            dialogueSpanish: "Declaro sanidad, provisión y paz sobrenatural sobre tu vida desde este momento.",
            emotionalTone: "decreto soberano de victoria",
            voicePresetName: "jesus_calido_reverente"
          },
          {
            speakerName: companionName,
            speakerId: "companero_fe",
            timeWindow: "00:36 - 00:40",
            allocatedSeconds: 4,
            dialogueSpanish: "¡El Señor ha hecho maravillas! ¡Bendito sea Su santo nombre!",
            emotionalTone: "alabanza y asombro gozoso",
            voicePresetName: "mujer_fe_emotiva"
          }
        ],
        narration: `Una sola palabra pronunciada por Jesús revierte decretos humanos y abre puertas donde no había camino.`,
        onScreenText: `RESTAURACIÓN TOTAL HOY`,
        secondaryLabel: "00:30 - 00:40 (10s)",
        imageToVideoPrompt: `High-end 3D Pixar vertical 9:16. Jesus raising His hand in sovereign blessing, glowing celestial golden particles floating in room, family characters embracing in pure joy and relief.`,
        englishPromptWithSpanishDialogue: `High-end 3D Pixar vertical. [CONTINUOUS 10s SHOT]: Jesus decrees blessing. Dialogue in Spanish: "Jesus: Declaro sanidad, provisión y paz sobrenatural sobre tu vida. ${companionName}: ¡El Señor ha hecho maravillas!"`,
        sfx: "Campanillas doradas celestiales y exhalación de profundo alivio.",
        bgMusicMood: "Crescendo orquestal glorioso con violines y piano."
      },
      {
        sceneNumber: 5,
        durationSec: 10,
        characterId: "protagonista_fe",
        secondaryCharacterId: "jesus_cartoon_3d",
        charactersInShot: ["protagonista_fe", "companero_fe", "jesus_cartoon_3d"],
        interactionType: "plano_conjunto_familiar",
        timeframe: "00:40 - 00:50",
        action: `Plano final en contrapicado cinematográfico: ${protagonistName} sonríe con lágrimas de gratitud, mientras Jesús mira con amor paternal hacia el espectador bendiciéndolo.`,
        dialogueExchange: [
          {
            speakerName: protagonistName,
            speakerId: "protagonista_fe",
            timeWindow: "00:41 - 00:45",
            allocatedSeconds: 4,
            dialogueSpanish: "¡Para Dios nada es imposible! ¡Hoy mi casa declara Su gloria!",
            emotionalTone: "testimonio triunfante y gozo desbordante",
            voicePresetName: defaultChar.voice
          },
          {
            speakerName: "Jesús",
            speakerId: "jesus_cartoon_3d",
            timeWindow: "00:45 - 00:50",
            allocatedSeconds: 5,
            dialogueSpanish: "No temas más: Yo estoy contigo todos los días hasta el fin del mundo.",
            emotionalTone: "promesa eterna de amor y seguridad",
            voicePresetName: "jesus_calido_reverente"
          }
        ],
        narration: `Si hoy necesitas un milagro en tu familia, en tu salud o en tus finanzas, declara con fe: Jesús está conmigo.`,
        onScreenText: `DECLARA "AMÉN" SI CREES EN SU PODER 🙏`,
        secondaryLabel: "00:40 - 00:50 (10s)",
        imageToVideoPrompt: `High-end 3D Pixar style, 9:16 vertical. Grand finale closing shot. Warm golden light (5500K), Jesus smiling gently towards camera with raised hand of blessing, family characters beside Him in pure gratitude. Highest production value 3D render.`,
        englishPromptWithSpanishDialogue: `High-end 3D Pixar style, 9:16 vertical closing shot. Dialogue in Spanish: "${protagonistName}: ¡Para Dios nada es imposible! Jesus: No temas más: Yo estoy contigo todos los días."`,
        sfx: "Acorde final sostenido en 432Hz con reverberación celestial.",
        bgMusicMood: "Final triunfal, emotivo y lleno de paz divina celestial."
      }
    ];

    return {
      episodeNumber: epNum,
      episodeTitle: epTitle,
      hook: episodeHook,
      conflict: `La crisis de "${cleanTopic}" pone a prueba la fe hasta el límite humano.`,
      escalation: `La tensión sube hasta que la intervención divina cambia el rumbo del destino.`,
      cliffhanger: isLast
        ? `El milagro se consumó. Dios restauró lo que el enemigo quiso destruir. Deja tu AMÉN si crees en el poder de Jesús hoy.`
        : `Cuando pensaban que todo había terminado, el Maestro les reveló algo que cambiaría sus vidas... ¿Qué pasará? Descúbrelo en la PARTE ${epNum + 1}.`,
      lockedEnvironmentId: env.id,
      lockedEnvironmentName: env.name,
      lockedEnvironmentPromptEn: env.architecturePromptEn,
      scenographyStage: {
        stageName: isFirst ? 'Impacto Visual y Clamor Inicial' : isLast ? 'Luz Divina Plena & Restauración Total' : 'La Luz Rompe la Oscuridad',
        environmentState: `En ${env.name}, la gloria matutina y celestial inunda cada rincón a 5500K. Los objetos y el espacio irradian paz divina y restauración eterna.`,
        lightingState: isFirst ? '2700K sombras alargadas y penumbra dramática' : isLast ? '5500K luz dorada celestial omnidireccional y partículas de gloria' : '3400K contraluz divino cálido alrededor de Jesús',
        objectsState: isFirst ? 'Escrituras cerradas, vela temblorosa' : isLast ? 'Biblia abierta resplandeciendo, vasijas u objetos rebosantes de bendición' : 'Vela reavivada con llama firme y dorada'
      },
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
        ]
      }
    };
  });

  return {
    id: seriesId,
    seriesTitle: cleanTopic.slice(0, 50),
    logline: `Miniserie de fe serializada (${partsCount} capítulos): ${cleanTopic}. Formato de inicio disruptivo (${openingFormat.name}), sin conversaciones rutinarias de pareja, con Jesucristo activo y planos continuos de 10s.`,
    category,
    categoryLabel: "Milagro & Intervención de Jesús",
    totalPartsPlanned: partsCount,
    bannerHook: `🔴 LO QUE JESÚS HIZO CUANDO PARECÍA EL FINAL • ${cleanTopic.toUpperCase().slice(0, 30)}`,
    primaryCharacterIds: ["jesus_cartoon_3d", "protagonista_fe", "companero_fe"],
    characters: uiCharacters,
    castCount: 3,
    lockedEnvironmentId: env.id,
    lockedEnvironmentName: env.name,
    lockedEnvironmentPromptEn: env.architecturePromptEn,
    episodes
  };
}

export async function generateMiniseriesWithGemini(ai, options = {}) {
  try {
    const base = buildFallbackMiniseries(
      options.topic,
      options.totalParts || 3,
      options.category || "milagro_familiar",
      options.lockedEnvironmentId,
      options
    );

    if (!ai) return base;

    const partsCount = base.totalPartsPlanned || 3;
    const prompt = `Actúa como director cinematográfico cristiano y creador élite de TikTok / Reels / Shorts verticales (9:16 estilo Pixar 3D).
Tema solicitado: "${options.topic || 'Milagro de Jesús'}"
Número de Capítulos: ${partsCount}
Categoría: ${options.category || 'fe'}
Tono: ${options.tone || 'emotivo, reverente y de alto impacto'}

REGLAS DE ORO DE INNOVACIÓN:
1. PROHIBIDO TOTALMENTE INICIAR CON UNA PAREJA CONVERSANDO:
   - NO queremos dos personas sentadas o paradas diciendo "se nos acabó el tiempo" o "no te rindas".
   - El inicio del video (Escena 1, 0 a 10s) DEBE ser una de estas opciones disruptivas:
     a) SHOCK DEL OBJETO: Plano macro a un documento sellado, una carta quemada, un recibo inexplicable o una llave, con una persona sola ante el misterio.
     b) ACCIÓN IN MEDIA RES: Alguien corriendo empapado bajo la lluvia empujando las puertas de un templo buscando refugio.
     c) LA INOCENCIA DE UN NIÑO: Un niño de 6 años dibujando con tiza algo invisible que deja sin palabras a los adultos.
     d) SHOCK CLÍNICO: Monitor en cero pitando continuo y el médico rindiéndose antes de que ocurra el milagro.
     e) DILEMA MORAL: Poner un millón de dólares o un contrato sobre la mesa y empujarlo con desprecio diciendo "mi fe no se vende".
     f) TEOFANÍA EN EL CAMINO: Jesús caminando en silencio junto a un hombre derrotado en una carretera desierta al amanecer.

2. HOOKS DE INICIO COMPLETAMENTE DIFERENTES PARA CADA CAPÍTULO:
   - Prohibido empezar con "Nadie imaginaba..." o "A la mañana siguiente...".
   - Cada gancho debe ser una frase única de 0 a 3 segundos que congele el pulgar del usuario.

Genera un JSON con esta estructura exacta:
{
  "seriesTitle": "Título impactante para la miniserie",
  "logline": "Sinopsis dramática de la historia",
  "bannerHook": "🔴 GANCHO SUPERIOR IMPACTANTE EN MAYÚSCULAS",
  "protagonistName": "Nombre del personaje principal",
  "protagonistRole": "Rol del personaje principal",
  "companionName": "Nombre del segundo personaje",
  "episodes": [
    {
      "episodeNumber": 1,
      "episodeTitle": "Título del capítulo",
      "hook": "Gancho hablado disruptivo de 0-3 segundos (NUNCA un cliché)",
      "cliffhanger": "Gancho de cierre",
      "sceneDialogues": [
        {
          "sceneNumber": 1,
          "turn1Speaker": "Nombre del que habla",
          "turn1Text": "Frase de impacto dramático (0-5s)",
          "turn2Speaker": "Nombre del segundo personaje o Jesús",
          "turn2Text": "Respuesta inesperada (5-10s)"
        },
        {
          "sceneNumber": 2,
          "turn1Speaker": "Jesús",
          "turn1Text": "Palabra de paz (0-5s)",
          "turn2Speaker": "Nombre del personaje",
          "turn2Text": "Reacción viva (5-10s)"
        },
        {
          "sceneNumber": 3,
          "turn1Speaker": "Nombre del protagonista",
          "turn1Text": "Desahogo sincero (0-5s)",
          "turn2Speaker": "Jesús",
          "turn2Text": "Promesa sobrenatural (5-10s)"
        },
        {
          "sceneNumber": 4,
          "turn1Speaker": "Jesús",
          "turn1Text": "Decreto de bendición (0-5s)",
          "turn2Speaker": "Nombre del personaje",
          "turn2Text": "Alabanza y gozo (5-10s)"
        },
        {
          "sceneNumber": 5,
          "turn1Speaker": "Nombre del protagonista",
          "turn1Text": "Testimonio triunfante (0-5s)",
          "turn2Speaker": "Jesús",
          "turn2Text": "Bendición final al espectador (5-10s)"
        }
      ]
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    if (response?.text) {
      try {
        const parsed = JSON.parse(response.text);
        if (parsed.seriesTitle) base.seriesTitle = parsed.seriesTitle;
        if (parsed.logline) base.logline = parsed.logline;
        if (parsed.bannerHook) base.bannerHook = parsed.bannerHook;

        if (parsed.protagonistName && base.characters?.[1]) {
          base.characters[1].name = parsed.protagonistName;
          if (parsed.protagonistRole) base.characters[1].role = parsed.protagonistRole;
        }
        if (parsed.companionName && base.characters?.[2]) {
          base.characters[2].name = parsed.companionName;
        }

        if (Array.isArray(parsed.episodes)) {
          parsed.episodes.forEach((ep) => {
            const targetEp = base.episodes.find(e => e.episodeNumber === ep.episodeNumber);
            if (targetEp) {
              if (ep.episodeTitle) targetEp.episodeTitle = ep.episodeTitle;
              if (ep.hook) targetEp.hook = ep.hook;
              if (ep.cliffhanger) targetEp.cliffhanger = ep.cliffhanger;

              if (Array.isArray(ep.sceneDialogues)) {
                ep.sceneDialogues.forEach((sd) => {
                  const targetScene = targetEp.scenes.find(s => s.sceneNumber === sd.sceneNumber);
                  if (targetScene && sd.turn1Text && sd.turn2Text) {
                    targetScene.dialogueExchange = [
                      {
                        speakerName: sd.turn1Speaker || base.characters[1].name,
                        speakerId: sd.turn1Speaker === "Jesús" ? "jesus_cartoon_3d" : "protagonista_fe",
                        timeWindow: "00:01 - 00:05",
                        allocatedSeconds: 4,
                        dialogueSpanish: sd.turn1Text,
                        emotionalTone: "emotivo y profundo",
                        voicePresetName: base.characters[1].voicePreset
                      },
                      {
                        speakerName: sd.turn2Speaker || "Jesús",
                        speakerId: sd.turn2Speaker === "Jesús" ? "jesus_cartoon_3d" : "companero_fe",
                        timeWindow: "00:05 - 00:10",
                        allocatedSeconds: 5,
                        dialogueSpanish: sd.turn2Text,
                        emotionalTone: sd.turn2Speaker === "Jesús" ? "autoridad divina y paz" : "fe y consuelo",
                        voicePresetName: sd.turn2Speaker === "Jesús" ? "jesus_calido_reverente" : base.characters[2].voicePreset
                      }
                    ];
                  }
                });
              }
            }
          });
        }
      } catch (parseErr) {
        console.warn("[generateMiniseriesWithGemini JSON parse fallback]:", parseErr?.message || parseErr);
      }
    }

    return base;
  } catch (err) {
    console.warn("[generateMiniseriesWithGemini fallback to procedural]:", err?.message || err);
    return buildFallbackMiniseries(
      options.topic,
      options.totalParts || 3,
      options.category,
      options.lockedEnvironmentId,
      options
    );
  }
}
