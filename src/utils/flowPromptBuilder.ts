type AnyRecord = Record<string, any>;

const value = (input: unknown, fallback = 'No especificado') => {
  const text = typeof input === 'string' ? input.trim() : '';
  return text || fallback;
};

function characterLock(character: AnyRecord): string {
  const id = value(character.id, 'sin-id');
  const name = value(character.name, 'Personaje');
  const age = value(character.apparentAge || character.age, 'edad aparente fijada en la biblia');
  const gender = value(character.gender, 'según la biblia de continuidad');
  const visual = value(
    character.exactModelSheetLockEn || character.fixedIdentityPromptEn || character.modelSheetLockEn ||
      character.fixedIdentityPrompt || character.visualIdentity || character.shortDescription,
    'rostro, piel, cabello y complexión definidos en la biblia maestra'
  );
  const skin = value(character.skin, 'mantener exactamente el tono de piel descrito en la ficha maestra');
  const face = value(character.face, 'mantener exactamente la forma y los rasgos faciales de la ficha maestra');
  const hair = value(character.hair, 'mantener exactamente el cabello descrito en la ficha maestra');
  const build = value(character.build, 'mantener exactamente la complexión descrita en la ficha maestra');
  const wardrobe = value(character.wardrobe || character.clothingStyle || character.lockedWardrobeDesc, 'vestuario inmutable definido en la biblia');
  const accessories = value(character.accessories, 'accesorios inmutables definidos en la biblia');
  const voice = value(character.voice || character.voiceProfile?.tone, 'misma voz y acento definidos para este personaje');
  return [
    `- ID canónico: ${id}; nombre exacto en pantalla y diálogo: ${name}; edad aparente: ${age}; presentación: ${gender}.`,
    `  Ficha maestra de identidad (respetar literalmente, no rediseñar): ${visual}`,
    `  Anclas físicas inmutables — piel: ${skin}; rostro: ${face}; cabello: ${hair}; complexión: ${build}.`,
    `  Vestuario inmutable: ${wardrobe}. Accesorios inmutables: ${accessories}. Voz/acento inmutables: ${voice}.`,
    `  No reemplazar al actor ni cambiar rostro, edad, tono de piel, facciones, cabello, cuerpo, vestuario o accesorios entre clips.`
  ].join('\n');
}

function visibleCharacters(series: AnyRecord, scene: AnyRecord): AnyRecord[] {
  const bible = series.seriesBible || {};
  const characters: AnyRecord[] = Array.isArray(series.characters)
    ? series.characters
    : Array.isArray(bible.characterBible) ? bible.characterBible : [];
  if (!characters.length) return [];

  const ids = new Set<string>();
  const names = new Set<string>();
  const addId = (id: unknown) => { if (typeof id === 'string' && id.trim()) ids.add(id.trim()); };
  const addName = (name: unknown) => { if (typeof name === 'string' && name.trim()) names.add(name.trim().toLocaleLowerCase('es')); };
  (Array.isArray(scene.charactersInShot) ? scene.charactersInShot : []).forEach(addId);
  addId(scene.characterId);
  addId(scene.secondaryCharacterId);
  (Array.isArray(scene.dialogueExchange) ? scene.dialogueExchange : []).forEach((turn: AnyRecord) => {
    addId(turn.speakerId);
    addName(turn.speakerName);
  });

  if (!ids.size && !names.size) return characters;
  const selected = characters.filter((character) =>
    ids.has(String(character.id || '')) || names.has(String(character.name || '').toLocaleLowerCase('es'))
  );
  // If legacy scene IDs do not match the current roster, retain the complete bible rather than omit identity data.
  return selected.length ? selected : characters;
}

function dialogueBlock(scene: AnyRecord): string {
  const turns = Array.isArray(scene.dialogueExchange) ? scene.dialogueExchange : [];
  const lines = turns
    .filter((turn: AnyRecord) => value(turn.dialogueSpanish, '').length > 0)
    .map((turn: AnyRecord, index: number) => {
      const time = value(turn.timeWindow, index === 0 ? '00:00.0–00:04.6' : '00:04.6–00:09.2');
      const tone = value(turn.emotionalTone, 'natural, íntimo y contenido');
      return `${time} — ${value(turn.speakerName, 'Personaje')}: «${turn.dialogueSpanish.trim()}» (actuación: ${tone})`;
    });
  if (lines.length === 0) return 'Sin diálogo en este segmento solo si el silencio está marcado como decisión narrativa intencional.';
  return lines.join('\n');
}

/** Copia textual autónoma de la ficha canónica; no depende de una imagen externa. */
export function buildCharacterIdentityPrompt(series: AnyRecord, character: AnyRecord): string {
  return [
    `BIBLIA TEXTUAL DE IDENTIDAD — ${value(character.id, 'sin-id')} — ${value(character.name, 'Personaje')}`,
    `Serie: «${value(series.seriesTitle, 'Miniserie de fe')}». Usa esta misma descripción, sin reescribirla ni reinterpretarla, en cada segmento donde aparezca el personaje.`,
    characterLock(character),
    'La continuidad se resuelve con estas anclas textuales repetidas en cada prompt; no cambies ni recastees al actor entre clips.'
  ].join('\n\n');
}

/** Construye un prompt autónomo: cada segmento contiene su propia biblia textual y mundo coherente. */
export function buildFlowPrompt(series: AnyRecord, episode: AnyRecord, scene: AnyRecord): string {
  const bible = series.seriesBible || {};
  const world = bible.worldBible || {};
  const audio = bible.audioBible || {};
  const episodeNumber = Number(episode.episodeNumber) || 1;
  const sceneNumber = Number(scene.sceneNumber) || 1;
  const timeframe = value(scene.timeframe, `00:${String((sceneNumber - 1) * 10).padStart(2, '0')}–00:${String(sceneNumber * 10).padStart(2, '0')}`);
  const characters = visibleCharacters(series, scene);
  const characterBible = characters.length
    ? characters.map(characterLock).join('\n')
    : 'La serie no define un reparto legible: no inventar ni sustituir personajes; respetar las identidades textuales previas.';
  const location = value(world.location || series.lockedEnvironmentName || scene.lockedEnvironmentName, 'el mismo entorno establecido para toda la serie');
  const setting = value(world.eraAndArchitecture || world.architecture || series.lockedEnvironmentPromptEn, 'espacio contemporáneo latinoamericano, arquitectura y utilería físicamente plausibles');
  const palette = value(world.palette || world.lightingDesign, 'paleta cinematográfica natural, constante y coherente con la emoción');
  const timeOfDay = value(world.timeOfDay, 'la misma hora narrativa establecida para el capítulo');
  const weather = value(world.weather, 'el mismo clima establecido en la biblia');
  const recurringProps = Array.isArray(world.recurringProps) ? world.recurringProps.join(', ') : value(world.recurringProps, 'los objetos narrativos fijados en la biblia');
  const dialogue = dialogueBlock(scene);
  const speakerNames = Array.isArray(scene.dialogueExchange)
    ? [...new Set(scene.dialogueExchange.map((turn: AnyRecord) => value(turn.speakerName, 'Personaje')))].join(', ')
    : '';
  const voices = speakerNames
    ? `Voces diferenciadas para ${speakerNames}; español latinoamericano natural, dicción clara, respiración y emoción humanas, sincronía labial exacta. Mantener idénticos el timbre, edad vocal y acento de cada personaje en toda la serie.`
    : 'Voz y mezcla según la biblia de audio; no inventar parlamentos.';
  const seriesMusic = value(audio.originalScore || audio.musicIdentity || audio.genre, 'composición instrumental original, creada específicamente para esta serie');
  const sceneMusic = value(scene.bgMusicMood || scene.musicDirection, seriesMusic);
  const audioNotes = value(audio.mixNotes, 'diálogo al frente; música atenuada bajo las voces y sin competir con ellas');
  const subtitles = value(scene.subtitleSuggestion || scene.onScreenText, 'subtítulos breves y legibles añadidos en edición, nunca como texto generado dentro del video');
  const verse = value(bible.bibleReference || series.bibleReference, 'referencia bíblica temática indicada en la tarjeta del capítulo; no inventar citas textuales');
  const camera = value(scene.camera, value(scene.cameraPrompt, 'plano medio cercano con cámara estable y movimiento motivado por la acción'));
  const lens = value(scene.lens, 'lente cinematográfica equivalente a 35 mm; profundidad de campo realista');
  const cameraLanguage = value(world.cameraLanguage, 'misma escala y eje de cámara establecidos para la serie');
  const movement = value(scene.cameraMovement || scene.movement, 'un movimiento de cámara suave, físicamente posible y continuo, sin cortes abruptos');
  const lighting = value(scene.lighting, value(world.lighting, 'fuentes de luz prácticas y físicamente plausibles'));
  const performance = value(scene.performance || scene.actingDirection, 'actuación íntima y contenida; microexpresiones, mirada y pausas verosímiles, sin sobreactuación');
  const sceneEnvironment = value(scene.environment, location);
  const environment = `${sceneEnvironment}. WORLD LOCK: ${location}; ${setting}. Hora constante: ${timeOfDay}. Clima constante: ${weather}. Distribución, mobiliario y utilería idénticos entre clips. Objetos recurrentes: ${recurringProps}.`;
  const sfx = value(scene.sfx, 'ambiente realista y efectos discretos, sincronizados con las acciones visibles');
  const customRestrictions = value(scene.negativePrompt, '');
  const mandatoryRestrictions = 'Sin cambio de actor, face drift, cambio de edad, tono de piel, facciones, cabello, complexión, vestuario, accesorios, duplicación, sustitución o rediseño de personajes; sin personas nuevas que parezcan protagonistas; sin texto generado, subtítulos, logotipos o marcas de agua. No caricatura ni estética 3D. No música comercial ni citas bíblicas inventadas. No prometer milagros garantizados.';

  return [
    `DURACIÓN Y FORMATO\nVideo vertical 9:16, exactamente 10 segundos, segmento ${String(sceneNumber).padStart(2, '0')} de 05 del capítulo ${String(episodeNumber).padStart(2, '0')} («${value(episode.episodeTitle, series.seriesTitle)}»), intervalo ${timeframe}. Live-action hiperrealista y cinematográfico, apariencia de personas reales, 24 fps, audio integrado. Este prompt debe funcionar por sí solo en Flow.`,
    `CONTINUIDAD MAESTRA\nMiniserie: «${value(series.seriesTitle, 'Miniserie de fe')}». Tema: ${value(series.logline || bible.theme, 'fe, oración y esperanza')}. Base bíblica: ${verse}.\n\nIDENTIDAD BLOQUEADA POR TEXTO — REPARTO VISIBLE (${characters.length || 'según la biblia'}):\n${characterBible}\n\nEste prompt contiene la biblia textual completa de cada personaje visible. Repite las mismas anclas de rostro, edad, piel, cabello, complexión, vestuario, accesorios y voz en todos los clips; no recastees ni mezcles rasgos. No se requiere una imagen externa para mantener la continuidad. Conservar el mismo mundo, utilería, paleta y reglas de cámara. La historia es original; no imitar personajes, guiones, música, marca ni estética distintiva de otros creadores.`,
    `ACCIÓN VISIBLE\n${value(scene.action, 'Continuar la acción del capítulo con una decisión o cambio observable desde el primer segundo.')}\nEl primer segundo debe mostrar una anomalía, riesgo, decisión o revelación concreta; introducir una variación emocional o informativa durante el segmento y terminar en el estado necesario para el siguiente segmento. Solo actúan en cámara los personajes nombrados en REPARTO VISIBLE; los demás permanecen fuera de campo.`,
    `ENTORNO\n${environment}`,
    `COMPOSICIÓN, LENTE Y MOVIMIENTO DE CÁMARA\n${camera}. ${lens}. ${movement}. ${cameraLanguage}. Mantener posiciones espaciales y dirección de miradas coherentes con el plano anterior.`,
    `LUZ, COLOR Y TEXTURA\n${lighting}. Mantener la paleta maestra ${palette} y la misma dirección de luz, salvo cambio narrativo explícito. Piel, ojos, cabello, telas y superficies con textura natural; contraste cinematográfico sin filtros plásticos ni brillo sobrenatural genérico.`,
    `ACTUACIÓN\n${performance}. Gestos pequeños, contacto visual motivado y movimientos anatómicamente naturales. No exagerar expresiones ni alterar la edad o el rostro de la ficha textual.`,
    `DIÁLOGO EXACTO EN ESPAÑOL LATINOAMERICANO\nPronunciar literalmente, sin traducir, resumir ni añadir frases:\n${dialogue}${scene.narration ? `\nNarración opcional, solo si cabe de forma natural: «${scene.narration}»` : ''}`,
    `VOZ Y MEZCLA\n${voices} ${audioNotes} El diálogo hablado debe ocupar aproximadamente 9,2 de los 10 segundos (cerca del 90%); respetar las ventanas de tiempo, enlazar los dos turnos con una pausa breve de máximo 0,2 segundos y no dejar silencios deliberados. Ritmo conversacional cercano a 2,1 palabras por segundo: claro y humano, nunca acelerado ni atropellado. Reservar menos de un segundo al final para la respiración o la transición.`,
    `MÚSICA ORIGINAL\n${seriesMusic}. Variación de este segmento: ${sceneMusic}. Composición instrumental inédita, con motivo melódico propio de esta miniserie; ajustar pulso e intensidad al giro dramático y dejar espacio a la voz. Sin letra, sin canciones comerciales y sin imitar obras o artistas existentes. Mezcla sugerida: música entre -18 y -22 dB bajo el diálogo, con entradas y salidas suaves.`,
    `SFX Y AMBIENTE\n${sfx}. Sincronizar cada efecto con una acción visible; conservar continuidad del ambiente sonoro.`,
    `SUBTÍTULOS SUGERIDOS\n${subtitles}. No renderizar texto, carteles ni subtítulos dentro de la imagen generada; agregarlos en edición.`,
    `RESTRICCIONES\n${customRestrictions ? `${customRestrictions}. ` : ''}${mandatoryRestrictions} Mantener tono reverente y humano. Si una frase bíblica no está citada con referencia y traducción verificadas, presentarla como paráfrasis y no atribuirla literalmente a Dios, Jesús o la Biblia.`
  ].join('\n\n');
}
