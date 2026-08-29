// Audio generation utilities for video recording & live playback
// Generates speech / voice harmonics + 432Hz sanctuary background pad + sacred chimes

export interface SceneAudioTiming {
  sceneIdx: number;
  durationSec: number;
  narrationText: string;
}

/**
 * Creates rich multi-layered sacred audio for video recording:
 * 1. Warm 432Hz harmonic spiritual drone chord (C# / F# / A# celestial triad)
 * 2. Dynamic acoustic harp / sacred bell arpeggios on scene changes
 * 3. Warm baritone vocal intonation chants simulating the deep loving voice of Jesus
 * 4. Master compressor and limiter ensuring loud, crystal-clear audio in exported video
 */
export function buildSacredVideoAudioGraph(
  audioCtx: AudioContext,
  destinationNode: MediaStreamAudioDestinationNode,
  totalDurationSec: number,
  scenes: SceneAudioTiming[]
): { stop: () => void } {
  // Master Compressor to prevent clipping and ensure loud, punchy audio
  const compressor = audioCtx.createDynamicsCompressor();
  compressor.threshold.setValueAtTime(-18, audioCtx.currentTime);
  compressor.knee.setValueAtTime(12, audioCtx.currentTime);
  compressor.ratio.setValueAtTime(4, audioCtx.currentTime);
  compressor.attack.setValueAtTime(0.003, audioCtx.currentTime);
  compressor.release.setValueAtTime(0.25, audioCtx.currentTime);

  const masterGain = audioCtx.createGain();
  masterGain.gain.setValueAtTime(0.75, audioCtx.currentTime);

  compressor.connect(masterGain);
  masterGain.connect(destinationNode);

  // Also connect to destination for local monitoring during export
  try {
    masterGain.connect(audioCtx.destination);
  } catch (e) {
    // Ignore destination connection error if already connected or sandboxed
  }

  const activeNodes: (AudioNode | number)[] = [];

  // --- 1. Warm 432Hz Sacred Sanctuary Pad (Peaceful Harmonic Chords) ---
  // Pure harmonic frequencies based on 432Hz tuning: 108Hz (deep bass), 216Hz, 324Hz, 432Hz, 540Hz, 648Hz
  const padFreqs = [108, 216, 324, 432, 540, 648];
  padFreqs.forEach((freq, idx) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    // Subtle pitch vibrato/drift for celestial living sound
    const lfo = audioCtx.createOscillator();
    const lfoGain = audioCtx.createGain();
    lfo.frequency.setValueAtTime(0.12 + idx * 0.04, audioCtx.currentTime);
    lfoGain.gain.setValueAtTime(2.2, audioCtx.currentTime);
    lfo.connect(osc.frequency);
    lfo.start();
    activeNodes.push(lfo, lfoGain);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(420 + idx * 85, audioCtx.currentTime);

    // Fade-in envelope
    gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.12 / (idx + 1.2), audioCtx.currentTime + 1.5);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(compressor);

    osc.start();
    activeNodes.push(osc, gain, filter);
  });

  // --- 2. Sacred Chimes & Crystal Bell Arpeggios at Scene Entrances ---
  let sceneTimeOffset = 0;
  scenes.forEach((scene, sIdx) => {
    const triggerTime = audioCtx.currentTime + sceneTimeOffset;
    const chimeFreqs = [523.25, 659.25, 783.99, 1046.5, 1318.5]; // C5, E5, G5, C6, E6 (Major celestial harmony)

    chimeFreqs.forEach((freq, cIdx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';

      const noteTime = triggerTime + cIdx * 0.14;
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.0001, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.15, noteTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 3.2);

      osc.connect(gain);
      gain.connect(compressor);

      try {
        osc.start(noteTime);
        osc.stop(noteTime + 3.4);
        activeNodes.push(osc, gain);
      } catch (e) {
        // ignore timing bounds
      }
    });

    // --- 3. Solemn Spoken Formant Tone of Jesus (Voice of Christ Chanting/Speaking) ---
    // Simulate vocal pitch variations across the narration words
    const words = scene.narrationText ? scene.narrationText.split(/\s+/) : ['Hijo', 'mío', 'recibe', 'mi', 'paz'];
    const wordDuration = Math.min(0.6, (scene.durationSec - 1.5) / Math.max(1, words.length));
    
    words.slice(0, 18).forEach((_, wIdx) => {
      const voiceTime = triggerTime + 1.0 + wIdx * wordDuration;
      if (voiceTime > triggerTime + scene.durationSec - 0.5) return;

      const vocalOsc = audioCtx.createOscillator();
      const vocalGain = audioCtx.createGain();
      const f1 = audioCtx.createBiquadFilter();
      const f2 = audioCtx.createBiquadFilter();

      vocalOsc.type = 'sawtooth';
      // Warm Baritone pitch 105Hz - 118Hz (A2 - Bb2)
      const basePitch = 108 + Math.sin(wIdx * 1.3) * 6;
      vocalOsc.frequency.setValueAtTime(basePitch, voiceTime);

      // Formants for warm human vowel sounds (A / O / U)
      f1.type = 'bandpass';
      f1.frequency.setValueAtTime(520 + (wIdx % 3) * 80, voiceTime);
      f1.Q.setValueAtTime(4.5, voiceTime);

      f2.type = 'bandpass';
      f2.frequency.setValueAtTime(1020 + (wIdx % 2) * 150, voiceTime);
      f2.Q.setValueAtTime(3.8, voiceTime);

      // Syllable volume envelope
      vocalGain.gain.setValueAtTime(0.0001, voiceTime);
      vocalGain.gain.exponentialRampToValueAtTime(0.09, voiceTime + 0.06);
      vocalGain.gain.exponentialRampToValueAtTime(0.0001, voiceTime + wordDuration * 0.95);

      vocalOsc.connect(f1);
      vocalOsc.connect(f2);
      f1.connect(vocalGain);
      f2.connect(vocalGain);
      vocalGain.connect(compressor);

      try {
        vocalOsc.start(voiceTime);
        vocalOsc.stop(voiceTime + wordDuration);
        activeNodes.push(vocalOsc, vocalGain, f1, f2);
      } catch (e) {}
    });

    sceneTimeOffset += scene.durationSec;
  });

  return {
    stop: () => {
      activeNodes.forEach((node) => {
        if (typeof node === 'number') {
          window.clearInterval(node);
        } else {
          try {
            if ('stop' in node && typeof (node as any).stop === 'function') {
              (node as any).stop();
            }
            node.disconnect();
          } catch (e) {}
        }
      });
      try {
        masterGain.disconnect();
        compressor.disconnect();
      } catch (e) {}
    }
  };
}
