export async function generateSpiritualAudio(
  text: string,
  voicePreset: string = 'reverent'
): Promise<Blob | null> {
  console.info(`[Audio Export] Generating spiritual audio for: "${text.slice(0, 30)}..." voice: ${voicePreset}`);
  return null;
}

export async function generateAndDownloadAudio(
  text: string,
  filename: string = 'audio-oracion.mp3'
): Promise<void> {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  }
}
