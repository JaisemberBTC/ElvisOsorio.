type AnyRecord = Record<string, any>;

const value = (input: unknown, fallback = 'Not specified') => {
  const text = typeof input === 'string' ? input.trim() : '';
  return text || fallback;
};

function characterLock(character: AnyRecord): string {
  const id = value(character.id, 'no-id');
  const name = value(character.name, 'Character');
  const age = value(character.promptAgeEn || character.apparentAge || character.age, 'fixed in the master character bible');
  const gender = value(character.promptGenderEn || character.gender, 'as defined in the master character bible');
  const visual = value(
    character.exactModelSheetLockEn || character.fixedIdentityPromptEn || character.modelSheetLockEn ||
      character.fixedIdentityPrompt || character.visualIdentity || character.shortDescription,
    'use the exact face, skin, hair, and build already defined in the master character bible'
  );
  const skin = value(character.promptSkinEn || character.skin, 'keep the exact skin tone defined in the master character bible');
  const face = value(character.promptFaceEn || character.face, 'keep the exact facial features defined in the master character bible');
  const hair = value(character.promptHairEn || character.hair, 'keep the exact hairstyle defined in the master character bible');
  const build = value(character.promptBuildEn || character.build, 'keep the exact body type defined in the master character bible');
  const wardrobe = value(character.promptWardrobeEn || character.wardrobe || character.clothingStyle || character.lockedWardrobeDesc, 'the fixed wardrobe defined in the master character bible');
  const accessories = value(character.promptAccessoriesEn || character.accessories, 'the fixed accessories defined in the master character bible');
  const voice = value(character.promptVoiceEn || character.voice || character.voiceProfile?.tone, 'the same voice and accent defined in the master character bible');
  return [
    `- Canonical character ID: ${id}; exact on-screen and spoken name: ${name}; apparent age: ${age}; gender presentation: ${gender}.`,
    `  Master identity anchor (preserve exactly; do not redesign): ${visual}`,
    `  Immutable physical anchors — skin: ${skin}; face: ${face}; hair: ${hair}; build: ${build}.`,
    `  Fixed wardrobe: ${wardrobe}. Fixed accessories: ${accessories}. Fixed voice/accent: ${voice}.`,
    '  Never recast or alter the actor, face, age, skin tone, facial features, hair, body, wardrobe, accessories, voice, or accent between clips.'
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
  const addName = (name: unknown) => { if (typeof name === 'string' && name.trim()) names.add(name.trim().toLocaleLowerCase('en')); };
  (Array.isArray(scene.charactersInShot) ? scene.charactersInShot : []).forEach(addId);
  addId(scene.characterId);
  addId(scene.secondaryCharacterId);
  (Array.isArray(scene.dialogueExchange) ? scene.dialogueExchange : []).forEach((turn: AnyRecord) => {
    addId(turn.speakerId);
    addName(turn.speakerName);
  });

  if (!ids.size && !names.size) return characters;
  const selected = characters.filter((character) =>
    ids.has(String(character.id || '')) || names.has(String(character.name || '').toLocaleLowerCase('en'))
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
      const tone = value(turn.emotionalTone, 'natural, intimate, and restrained');
      return `${time} — ${value(turn.speakerName, 'Character')}: “${turn.dialogueSpanish.trim()}” (performance: ${tone})`;
    });
  if (lines.length === 0) return 'No dialogue, only when silence is an intentional narrative choice.';
  return lines.join('\n');
}

/** A self-contained, text-only identity sheet that can be pasted into a video model. */
export function buildCharacterIdentityPrompt(series: AnyRecord, character: AnyRecord): string {
  return [
    `TEXT IDENTITY BIBLE — ${value(character.id, 'no-id')} — ${value(character.name, 'Character')}`,
    `Series: “${value(series.seriesTitle, 'Faith miniseries')}”. Reuse this same description verbatim in every segment where this character appears.`,
    characterLock(character),
    'Text-based continuity is sufficient; repeat these same identity anchors in every prompt. Never recast or reinterpret the actor.'
  ].join('\n\n');
}

/** Builds a standalone Flow prompt with the complete identity and world bible for this clip. */
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
    : 'No readable cast is defined. Do not invent or replace characters; preserve the previously established text identities.';
  const location = value(world.location || series.lockedEnvironmentName || scene.lockedEnvironmentName, 'the same location established for the entire series');
  const setting = value(world.eraAndArchitecture || world.architecture || series.lockedEnvironmentPromptEn, 'a plausible contemporary Latin American setting with realistic architecture and props');
  const palette = value(world.palette || world.lightingDesign, 'a consistent cinematic palette of warm gold, sand, deep blue, earth red, and natural light');
  const timeOfDay = value(world.timeOfDay, 'the same story time established for this episode');
  const weather = value(world.weather, 'the same weather established in the master bible');
  const recurringProps = Array.isArray(world.recurringProps) ? world.recurringProps.join(', ') : value(world.recurringProps, 'the recurring props fixed in the master bible');
  const dialogue = dialogueBlock(scene);
  const speakerNames = Array.isArray(scene.dialogueExchange)
    ? [...new Set(scene.dialogueExchange.map((turn: AnyRecord) => value(turn.speakerName, 'Character')))].join(', ')
    : '';
  const voices = speakerNames
    ? `Distinct voices for ${speakerNames}; natural Latin American Spanish, clear diction, human breathing and emotion, precise lip sync. Keep each character’s timbre, vocal age, and accent identical throughout the series.`
    : 'Use only the voices and mix defined in the audio bible; do not invent spoken lines.';
  const seriesMusic = value(audio.originalScore || audio.musicIdentity || audio.genre, 'an original instrumental score composed specifically for this series');
  const sceneMusic = value(scene.bgMusicMood || scene.musicDirection, seriesMusic);
  const audioNotes = value(audio.mixNotes, 'dialogue forward in the mix; music quiet underneath and never competing with the voices');
  const subtitleText = value(scene.subtitleSuggestion || scene.onScreenText, 'add concise, readable Spanish subtitles in post-production; do not generate them inside the video');
  const verse = value(bible.bibleReference || series.bibleReference, 'the thematic Bible reference supplied for the episode; do not invent a quotation');
  const camera = value(scene.camera, value(scene.cameraPrompt, 'a stable, motivated close medium shot'));
  const lens = value(scene.lens, 'cinematic 35 mm equivalent lens with realistic depth of field');
  const cameraLanguage = value(world.cameraLanguage, 'preserve the series camera axis and visual scale');
  const movement = value(scene.cameraMovement || scene.movement, 'one subtle, physically plausible continuous camera movement');
  const lighting = value(scene.lighting, value(world.lighting, 'practical, physically plausible light sources'));
  const performance = value(scene.performance || scene.actingDirection, 'intimate, restrained acting with believable micro-expressions, eye-lines, and pauses');
  const sceneEnvironment = value(scene.environment, location);
  const environment = `${sceneEnvironment}. WORLD LOCK: ${location}; ${setting}. Consistent time of day: ${timeOfDay}. Weather: ${weather}. Keep room layout, furniture, and props unchanged. Recurring props: ${recurringProps}.`;
  const sfx = value(scene.sfx, 'realistic, subtle ambience and sound effects synchronized to visible actions');
  const customRestrictions = value(scene.negativePrompt, '');
  const mandatoryRestrictions = 'No actor changes, face drift, age, skin tone, facial feature, hair, body, wardrobe, or accessory changes; no duplicate, replacement, or redesigned characters; no new person who reads as a lead. No generated text, subtitles, logos, or watermarks. No cartoon or 3D look. If Jesus appears, portray him respectfully as a realistic human, without exaggerated magical effects. No commercial music, invented Bible quotations, or guaranteed miracles.';
  const hookDirection = sceneNumber === 1
    ? `Opening hook (spoken, in Spanish): “${value(episode.hook, 'Use the exact opening line in the dialogue block.')}”. Keep it faithful to the story and under eight words. Start with its concrete visual or emotional consequence.`
    : 'Continue the story without recap; begin this standalone clip on its next concrete action.';

  return [
    `DURATION & FORMAT\nVertical 9:16 video, exactly 10 seconds; segment ${String(sceneNumber).padStart(2, '0')} of 05 for episode ${String(episodeNumber).padStart(2, '0')} (“${value(episode.episodeTitle, series.seriesTitle)}”), time range ${timeframe}. Photorealistic live-action, 24 fps, integrated audio. This prompt must work independently in Flow. All production instructions are in English; spoken dialogue remains exactly as written in Spanish.`,
    `MASTER CONTINUITY\nMiniseries: “${value(series.seriesTitle, 'Faith miniseries')}”. Story premise: ${value(series.logline || bible.theme, 'faith, prayer, and hope')}. Scripture context (reference only): ${verse}.\n\nLOCKED TEXT IDENTITY — VISIBLE CAST (${characters.length || 'as defined in the bible'}):\n${characterBible}\n\nThis prompt contains the full text identity bible for every visible character. Repeat the same face, age, skin, hair, build, wardrobe, accessories, and voice in every clip. Do not recast or blend identities. No external reference image is required for continuity. Preserve the same world, props, palette, and camera rules. The story is original; do not imitate another creator’s characters, scripts, music, brand, or distinctive visual style.`,
    `VISIBLE ACTION & FIRST-SECOND RETENTION\n${value(scene.action, 'Begin with a clear, observable story action from frame 0.') }\n${hookDirection} The first frame must already show a meaningful action, anomaly, risk, decision, or reveal. The first spoken word must begin within 0.3 seconds; no greeting, silent establishing shot, fade-in, title card, logo, static portrait, or slow introductory zoom. Reveal new visual information every 2–4 seconds through motivated action, gaze, focus, or camera movement. Use a continuous take with no continuity-breaking jump; end in the state required by the next segment. Only the named visible cast acts on camera; all others remain off-screen.`,
    `ENVIRONMENT & WORLD LOCK\n${environment}`,
    `COMPOSITION, LENS & CAMERA MOVEMENT\n${camera}. ${lens}. ${movement}. ${cameraLanguage}. Begin on the meaningful action or a close face in frame 0; make the movement motivated and immediate, then settle. Keep spatial positions and eyelines consistent with the prior segment.`,
    `LIGHTING, COLOR & TEXTURE\n${lighting}. Preserve the master palette: ${palette}, and keep light direction consistent unless the story explicitly changes it. Render natural skin, eyes, hair, fabric, and surfaces; cinematic contrast, no plastic filters or generic supernatural glow.`,
    `ACTING\n${performance}. Use small gestures, motivated eye contact, and anatomically natural movement. Do not exaggerate emotion or alter the identity bible.`,
    `EXACT SPOKEN DIALOGUE — LATIN AMERICAN SPANISH ONLY\nSpeak every line verbatim; do not translate, summarize, or add dialogue:\n${dialogue}${scene.narration ? `\nOptional Spanish narration, only if it fits naturally: “${scene.narration}”` : ''}`,
    `VOICE & MIX\n${voices} ${audioNotes} Follow the exact time windows. Begin the first line at 00:00.0 with no more than a 0.2-second pause between turns. Target natural, clear conversational speech near 2.1 words per second; never rush or sound robotic. Allow a brief breath or transition at the end only if time remains.`,
    `ORIGINAL INTEGRATED MUSIC\n${seriesMusic}. Segment variation: ${sceneMusic}. Use an original instrumental motif unique to this miniseries; adapt pulse and intensity to the dramatic beat while leaving room for dialogue. No lyrics, commercial songs, or imitation of existing artists or compositions. Suggested mix: music 18–22 dB below dialogue, with gentle fades.`,
    `SFX & AMBIENCE\n${sfx}. Synchronize every effect to a visible action and maintain environmental sound continuity.`,
    `POST-PRODUCTION SUBTITLE NOTE\n${subtitleText}. Add complete, large, legible, proofread Spanish subtitles in editing. Any optional on-screen copy must be one short Spanish phrase per scene, added in post. Do not render lettering, signs, or subtitles inside the generated footage.`,
    `RESTRICTIONS\n${customRestrictions ? `${customRestrictions}. ` : ''}${mandatoryRestrictions} Keep a reverent, human tone. If a Bible line is not verified against a named translation, present it as a paraphrase and never attribute invented wording directly to God, Jesus, or Scripture.`
  ].join('\n\n');
}
