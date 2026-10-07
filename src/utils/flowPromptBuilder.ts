type AnyRecord = Record<string, any>;

const value = (input: unknown, fallback = 'No especificado') => {
  const text = typeof input === 'string' ? input.trim() : '';
  return text || fallback;
};

function characterLock(character: AnyRecord): string {
  const name = value(character.name, 'Personaje');
  const age = value(character.apparentAge || character.age, 'edad adulta definida en la biblia');
  const visual = value(
    character.visualIdentity || character.exactModelSheetLockEn || character.fixedIdentityPrompt,
    character.shortDescription || 'rostro, cabello, piel y complexión natural definidos en la biblia de continuidad'
  );
  const wardrobe = value(character.wardrobe || character.clothingStyle || character.lockedWardrobeDesc, 'vestuario fijo definido en la biblia');
  const accessories = value(character.accessories, 'conservar los accesorios establecidos en la biblia');
  return `- ${name} (${age}): ${visual}. Vestuario inmutable: ${wardrobe}. Accesorios inmutables: ${accessories}. No cambiar su identidad entre planos.`;
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

/** Construye un prompt autónomo: Flow no necesita contexto externo para generar el segmento. */
export function buildFlowPrompt(series: AnyRecord, episode: AnyRecord, scene: AnyRecord): string {
  const bible = series.seriesBible || {};
  const world = bible.worldBible || {};
  const audio = bible.audioBible || {};
  const episodeNumber = Number(episode.episodeNumber) || 1;
  const sceneNumber = Number(scene.sceneNumber) || 1;
  const timeframe = value(scene.timeframe, `00:${String((sceneNumber - 1) * 10).padStart(2, '0')}–00:${String(sceneNumber * 10).padStart(2, '0')}`);
  const characters = Array.isArray(series.characters) ? series.characters : [];
  const characterBible = characters.length
    ? characters.map(characterLock).join('\n')
    : 'Conservar exactamente los personajes descritos en los segmentos anteriores; no añadir protagonistas nuevos.';
  const location = value(world.location || series.lockedEnvironmentName || scene.lockedEnvironmentName, 'el mismo entorno establecido para toda la serie');
  const setting = value(world.eraAndArchitecture || world.architecture || series.lockedEnvironmentPromptEn, 'espacio contemporáneo latinoamericano, arquitectura y utilería físicamente plausibles');
  const palette = value(world.palette || world.lightingDesign, 'paleta cinematográfica natural, constante y coherente con la emoción');
  const recurringProps = Array.isArray(world.recurringProps) ? world.recurringProps.join(', ') : value(world.recurringProps, 'los objetos narrativos fijados en la biblia');
  const dialogue = dialogueBlock(scene);
  const speakerNames = Array.isArray(scene.dialogueExchange)
    ? [...new Set(scene.dialogueExchange.map((turn: AnyRecord) => value(turn.speakerName, 'Personaje')))].join(', ')
    : '';
  const voices = speakerNames
    ? `Voces diferenciadas para ${speakerNames}; español latinoamericano natural, dicción clara, respiración y emoción humanas, sincronía labial exacta. Mantener el mismo timbre y acento de cada personaje en toda la serie.`
    : 'Voz y mezcla según la biblia de audio; no inventar parlamentos.';
  const seriesMusic = value(audio.originalScore || audio.musicIdentity || audio.genre, 'composición instrumental original, creada específicamente para esta serie');
  const sceneMusic = value(scene.bgMusicMood || scene.musicDirection, seriesMusic);
  const audioNotes = value(audio.mixNotes, 'diálogo al frente; música atenuada bajo las voces y sin competir con ellas');
  const subtitles = value(scene.subtitleSuggestion || scene.onScreenText, 'subtítulos breves y legibles añadidos en edición, nunca como texto generado dentro del video');
  const verse = value(bible.bibleReference || series.bibleReference, 'referencia bíblica temática indicada en la tarjeta del capítulo; no inventar citas textuales');
  const camera = value(scene.camera, value(scene.cameraPrompt, 'plano medio cercano con cámara estable y movimiento motivado por la acción'));
  const lens = value(scene.lens, 'lente cinematográfica equivalente a 35 mm; profundidad de campo realista');
  const movement = value(scene.cameraMovement || scene.movement, 'un movimiento de cámara suave, físicamente posible y continuo, sin cortes abruptos');
  const lighting = value(scene.lighting, value(world.lighting, `${palette}; fuentes de luz prácticas y físicamente plausibles`));
  const performance = value(scene.performance || scene.actingDirection, 'actuación íntima y contenida; microexpresiones, mirada y pausas verosímiles, sin sobreactuación');
  const environment = value(scene.environment, `${location}. ${setting}. Hora y clima constantes según la biblia. Elementos recurrentes: ${recurringProps}.`);
  const sfx = value(scene.sfx, 'ambiente realista y efectos discretos, sincronizados con las acciones visibles');
  const restrictions = value(scene.negativePrompt, 'sin caricatura, animación, estética 3D, rostros que cambian, vestuario que cambia, manos deformes, extremidades extra, duplicación de personas, texto ilegible, logotipos, marcas de agua, música comercial ni citas bíblicas inventadas. No prometer milagros garantizados.');

  return [
    `DURACIÓN Y FORMATO\nVideo vertical 9:16, exactamente 10 segundos, segmento ${String(sceneNumber).padStart(2, '0')} de 05 del capítulo ${String(episodeNumber).padStart(2, '0')} («${value(episode.episodeTitle, series.seriesTitle)}»), intervalo ${timeframe}. Live-action hiperrealista y cinematográfico, apariencia de personas reales, 24 fps, audio integrado. Este prompt debe funcionar por sí solo en Flow.`,
    `CONTINUIDAD MAESTRA\nMiniserie: «${value(series.seriesTitle, 'Miniserie de fe')}». Tema: ${value(series.logline || series.seriesBible?.theme, 'fe, oración y esperanza')}. Base bíblica: ${verse}. Conservar exactamente en todos los planos la identidad, edad aparente, rostro, piel, cabello, complexión, vestuario, accesorios, voz y acento definidos aquí:\n${characterBible}\nConservar el mismo mundo, utilería, paleta y reglas de cámara. La historia es original; no imitar personajes, guiones, música, marca ni estética distintiva de otros creadores.`,
    `ACCIÓN VISIBLE\n${value(scene.action, 'Continuar la acción del capítulo con una decisión o cambio observable desde el primer segundo.')}\nEl primer segundo debe mostrar una anomalía, riesgo, decisión o revelación concreta; introducir una variación emocional o informativa durante el segmento y terminar en el estado necesario para el siguiente segmento.`,
    `ENTORNO\n${environment}`,
    `COMPOSICIÓN, LENTE Y MOVIMIENTO DE CÁMARA\n${camera}. ${lens}. ${movement}. Mantener posiciones espaciales y dirección de miradas coherentes con el plano anterior.`,
    `LUZ, COLOR Y TEXTURA\n${lighting}. Piel, ojos, cabello, telas y superficies con textura natural; contraste cinematográfico sin filtros plásticos ni brillo sobrenatural genérico.`,
    `ACTUACIÓN\n${performance}. Gestos pequeños, contacto visual motivado y movimientos anatómicamente naturales.`,
    `DIÁLOGO EXACTO EN ESPAÑOL LATINOAMERICANO\nPronunciar literalmente, sin traducir, resumir ni añadir frases:\n${dialogue}${scene.narration ? `\nNarración opcional, solo si cabe de forma natural: «${scene.narration}»` : ''}`,
    `VOZ Y MEZCLA\n${voices} ${audioNotes} El diálogo hablado debe ocupar aproximadamente 9,2 de los 10 segundos (cerca del 90%); respetar las ventanas de tiempo, enlazar los dos turnos con una pausa breve de máximo 0,2 segundos y no dejar silencios deliberados. Ritmo conversacional cercano a 2,1 palabras por segundo: claro y humano, nunca acelerado ni atropellado. Reservar menos de un segundo al final para la respiración o la transición.`,
    `MÚSICA ORIGINAL\n${seriesMusic}. Variación de este segmento: ${sceneMusic}. Composición instrumental inédita, con motivo melódico propio de esta miniserie; ajustar pulso e intensidad al giro dramático y dejar espacio a la voz. Sin letra, sin canciones comerciales y sin imitar obras o artistas existentes. Mezcla sugerida: música entre -18 y -22 dB bajo el diálogo, con entradas y salidas suaves.`,
    `SFX Y AMBIENTE\n${sfx}. Sincronizar cada efecto con una acción visible; conservar continuidad del ambiente sonoro.`,
    `SUBTÍTULOS SUGERIDOS\n${subtitles}. No renderizar texto, carteles ni subtítulos dentro de la imagen generada; agregarlos en edición.`,
    `RESTRICCIONES\n${restrictions} Mantener tono reverente y humano. Si una frase bíblica no está citada con referencia y traducción verificadas, presentarla como paráfrasis y no atribuirla literalmente a Dios, Jesús o la Biblia.`
  ].join('\n\n');
}
