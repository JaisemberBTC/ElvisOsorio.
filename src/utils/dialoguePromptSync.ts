export interface DialogueTurnLike {
  speakerName: string;
  speakerId?: string;
  dialogueSpanish: string;
  timeWindow?: string;
  allocatedSeconds?: number;
}

export function buildCanonicalDialogueBlock(dialogueTurns: DialogueTurnLike[]): string {
  if (!Array.isArray(dialogueTurns) || dialogueTurns.length === 0) return '';
  return dialogueTurns
    .map(t => `${t.speakerName}: "${t.dialogueSpanish}"`)
    .join(' | ');
}

export function syncScenePromptWithExactDialogue(
  basePrompt: string,
  dialogueTurns: DialogueTurnLike[]
): string {
  const dialogueBlock = buildCanonicalDialogueBlock(dialogueTurns);
  if (!dialogueBlock) return basePrompt;
  return `${basePrompt} [Dialogue in Spanish: ${dialogueBlock}]`;
}

export function stripAllDialogueFromPrompt(prompt: string): string {
  if (!prompt) return '';
  return prompt
    .replace(/\[Dialogue in Spanish:[^\]]*\]/gi, '')
    .replace(/Dialogue in Spanish:[^,\.]*/gi, '')
    .trim();
}
