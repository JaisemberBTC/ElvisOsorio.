/**
 * dialoguePromptSync.ts
 * Ensures 100% strict synchronization between the character dialogue exchange
 * and the video generation prompts for Kling, Runway, Hailuo, Sora, Luma, and Veo.
 * Prevents truncating, summarizing, or mismatching spoken Spanish lines.
 */

import { calibrateAndPaceDialogue, countWordsSpanish } from './miniseriesDomain.ts';

export interface DialogueExchangeTurn {
  speakerName: string;
  speakerId?: string;
  dialogueSpanish: string;
  emotionalTone?: string;
  voicePresetName?: string;
  timeWindow?: string;
  allocatedSeconds?: number;
  wordCount?: number;
  wordsPerSecond?: number;
  pacingStatus?: 'perfecto' | 'óptimo' | 'ajustado';
}

/**
 * Builds the canonical continuous Spanish dialogue block for video generation prompts.
 * Guarantees that speech cadence does not exceed physical speaking limits in 10s:
 * - Natural conversational Spanish: ~1.8 to 2.2 words per second.
 * - 10-second scene: Max 18 to 22 words TOTAL across all characters.
 * - Turn-based distribution: 2s (4-5 words), 3s (5-7 words), 4s (7-9 words), 5s (9-11 words).
 */
export function buildCanonicalDialogueBlock(
  dialogueExchange: DialogueExchangeTurn[],
  durationSec: number = 10
): string {
  if (!dialogueExchange || dialogueExchange.length === 0) {
    return '';
  }

  const duration = durationSec || 10;
  // Automatically calibrate and pace dialogue to guarantee realistic speech limits
  const calibratedTurns = calibrateAndPaceDialogue(dialogueExchange, duration);

  const lines = calibratedTurns.map((turn: any) => {
    let timeTag = '';
    if (turn.timeWindow) {
      // Convert '00:00 - 00:03' to '[00:00-00:03]'
      timeTag = `[${turn.timeWindow.replace(/\s+/g, '')}]`;
    } else {
      timeTag = `[00:00-00:${String(duration - 1).padStart(2, '0')}]`;
    }

    const speaker = (turn.speakerName || 'Personaje').trim();
    // Clean outer quotes if already present to prevent double quotes
    const cleanDialogue = (turn.dialogueSpanish || '')
      .trim()
      .replace(/^["'“«]+/, '')
      .replace(/["'”»]+$/, '')
      .trim();

    const wCount = turn.wordCount || countWordsSpanish(cleanDialogue);
    const sec = turn.allocatedSeconds || 3;

    return `${timeTag} ${speaker} (${sec}s, ${wCount} words): "${cleanDialogue}"`;
  }).join(' ');

  return `[CONTINUOUS SPANISH DIALOGUE & EXACT LIP-SYNC ${duration}s - NATURAL CADENCE ~2.0 words/sec (ZERO DEAD SILENCE)]: The 3D characters speak fluent Latin American Spanish with realistic pacing without rushing or silence. Total speech strictly budgeted for ${duration}s: ${lines}. Exact mouth articulation, viseme phonemes, realistic facial expression, charismatic gestures, 9:16 vertical 8k animation.`;
}

/**
 * Strips any older, truncated, or summarized dialogue lines from a prompt text.
 */
export function stripAllDialogueFromPrompt(promptText: string): string {
  if (!promptText) return '';

  let s = promptText;

  // 1. Strip trailing AI engine parameters if already present in base prompt
  s = s.replace(/\s*--duration\s+\d+s.*$/i, '').trim();
  s = s.replace(/\s*\[(?:Runway|Luma|Sora|Google Veo|Hailuo|Kling).*?\]/gi, '').trim();

  // 2. Remove explicit [CONTINUOUS SPANISH DIALOGUE...] blocks
  s = s.replace(/\n*\[CONTINUOUS SPANISH DIALOGUE[\s\S]*?(?=(?:\[(?:NEGATIVE|LOCKED|EXACT)|--duration|\[Runway|\[Luma|\[Sora|\[Google Veo|$))/gi, '');

  // 3. Remove "The 3D characters speak fluent Latin American Spanish..."
  s = s.replace(/The 3D characters speak fluent Latin American Spanish[\s\S]*?(?=(?:\[(?:NEGATIVE|LOCKED|EXACT)|--duration|\[Runway|\[Luma|\[Sora|\[Google Veo|\.\s+[A-Z]|$))/gi, '');

  // 4. Remove "The character looks directly into camera speaking fluently..."
  s = s.replace(/The character looks directly into camera speaking fluently[\s\S]*?(?=(?:\[(?:NEGATIVE|LOCKED|EXACT)|--duration|\[Runway|\[Luma|\[Sora|\[Google Veo|\.\s+[A-Z]|$))/gi, '');

  // 5. Remove dialogue sections: match any lead-in mentioning dialogue/speech/lip-sync followed by quote turns
  s = s.replace(/(?:[.\s]|^)(?:Non-stop|Full \d+s|Fluid|Continuous)?[^.:\n]*?(?:Spanish|español|Latin American)[^.:\n]*?(?:dialogue|diálogo|lip-sync|speech|voice|hablado)[^:]*:\s*(?:\[\d{2}:\d{2}-\d{2}:\d{2}\][^".\n]+["'“«][^"'”»]+["'”»]\s*\.?\s*)+/gi, '. ');

  // 6. Also catch standalone turn sequences: [00:00-00:05] Speaker: "..."
  s = s.replace(/(?:\[\d{2}:\d{2}-\d{2}:\d{2}\]\s*[^:"]+:\s*["'“«][^"'”»]+["'”»]\s*\.?\s*)+/gi, '');

  // 7. Remove generic "Diálogo de 10 segundos en español..."
  s = s.replace(/Diálogo de \d+ segundos en español[^:\n]*:\s*["'“«][^"'”»]*["'”»]/gi, '');

  // 8. Remove any trailing or orphaned timestamp like [00:09-00:10] before visual descriptions
  s = s.replace(/\[\d{2}:\d{2}-\d{2}:\d{2}\]\s*/g, '');

  // 9. Clean double dots and excess whitespace
  s = s.replace(/\.\s*\./g, '.').replace(/\s{2,}/g, ' ').trim();

  return s;
}

/**
 * Synchronizes any video prompt with the exact dialogue from dialogueExchange.
 * Strips any older, truncated, or summarized dialogue lines (e.g. "Dialogue: Mateo: ¡Vete! No tengo nada. Jesús: Mateo, levántate.")
 * and guarantees that the exact spoken lines from dialogueExchange are present verbatim.
 */
export function syncScenePromptWithExactDialogue(
  promptText: string,
  dialogueExchange: DialogueExchangeTurn[],
  durationSec: number = 10
): string {
  if (!dialogueExchange || dialogueExchange.length === 0) {
    return promptText || '';
  }

  const exactDialogueBlock = buildCanonicalDialogueBlock(dialogueExchange, durationSec);
  if (!promptText || promptText.trim().length === 0) {
    return exactDialogueBlock;
  }

  const stripped = stripAllDialogueFromPrompt(promptText);

  // Check where to insert the exact dialogue block
  let result = '';
  if (stripped.includes('[NEGATIVE CONTINUITY PROMPT:')) {
    result = stripped.replace('[NEGATIVE CONTINUITY PROMPT:', `${exactDialogueBlock}\n[NEGATIVE CONTINUITY PROMPT:`);
  } else if (stripped.includes('[NEGATIVE PROMPT:')) {
    result = stripped.replace('[NEGATIVE PROMPT:', `${exactDialogueBlock}\n[NEGATIVE PROMPT:`);
  } else {
    result = `${stripped}\n${exactDialogueBlock}`;
  }

  // Normalize excessive whitespace
  return result.replace(/\n{3,}/g, '\n\n').trim();
}
