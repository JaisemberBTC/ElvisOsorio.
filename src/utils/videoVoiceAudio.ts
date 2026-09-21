// Audio generation and routing utilities for video recording & live playback
// Clean audio routing without synthetic beeps or high-pitched frequency whistles

export interface SceneAudioTiming {
  sceneIdx: number;
  durationSec: number;
  narrationText: string;
}

/**
 * Builds a clean, warm background audio graph.
 * All high-pitched beeps, chimes, and buzzing sawtooth oscillators are removed
 * to ensure 100% crystal-clear voice and peaceful sound.
 */
export function buildSacredVideoAudioGraph(
  audioCtx: AudioContext,
  destinationNode: MediaStreamAudioDestinationNode,
  totalDurationSec: number,
  scenes: SceneAudioTiming[],
  options?: {
    enableAmbientWarmth?: boolean;
    ambientVolume?: number;
  }
): { stop: () => void } {
  // Master Compressor to prevent clipping and ensure clean master audio
  const compressor = audioCtx.createDynamicsCompressor();
  compressor.threshold.setValueAtTime(-16, audioCtx.currentTime);
  compressor.knee.setValueAtTime(10, audioCtx.currentTime);
  compressor.ratio.setValueAtTime(3, audioCtx.currentTime);
  compressor.attack.setValueAtTime(0.005, audioCtx.currentTime);
  compressor.release.setValueAtTime(0.2, audioCtx.currentTime);

  const masterGain = audioCtx.createGain();
  masterGain.gain.setValueAtTime(0.8, audioCtx.currentTime);

  compressor.connect(masterGain);
  masterGain.connect(destinationNode);

  const activeNodes: (AudioNode | number)[] = [];

  // If ambient warmth is requested and not muted:
  // Only use very soft, low-pass filtered warm sub drone (NO beeps, NO chimes, NO high pitches)
  if (options?.enableAmbientWarmth) {
    const ambientGain = audioCtx.createGain();
    ambientGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
    ambientGain.gain.exponentialRampToValueAtTime(
      Math.min(0.06, Math.max(0.005, options.ambientVolume || 0.03)),
      audioCtx.currentTime + 1.2
    );

    const lowpass = audioCtx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(120, audioCtx.currentTime); // strictly below 120Hz, zero beeps/high whistles
    lowpass.Q.setValueAtTime(0.7, audioCtx.currentTime);

    // Warm pure fundamental 54Hz & 108Hz (deep sub-bass warmth)
    const baseOsc = audioCtx.createOscillator();
    baseOsc.type = 'sine';
    baseOsc.frequency.setValueAtTime(54, audioCtx.currentTime);

    baseOsc.connect(lowpass);
    lowpass.connect(ambientGain);
    ambientGain.connect(compressor);

    try {
      baseOsc.start();
      baseOsc.stop(audioCtx.currentTime + totalDurationSec + 1);
      activeNodes.push(baseOsc, lowpass, ambientGain);
    } catch (e) {}
  }

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
