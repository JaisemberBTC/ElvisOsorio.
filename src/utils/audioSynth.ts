// Web Audio API ambient sound generator & Web Speech API reader

class AmbientSoundEngine {
  private ctx: AudioContext | null = null;
  private currentTrack: string = 'off';
  private masterGain: GainNode | null = null;
  private activeNodes: (AudioNode | number)[] = [];
  private isRunning: boolean = false;
  private volume: number = 0.35;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public stop() {
    this.activeNodes.forEach(node => {
      if (typeof node === 'number') {
        window.clearInterval(node);
      } else {
        try {
          if ('stop' in node && typeof (node as any).stop === 'function') {
            (node as any).stop();
          }
          node.disconnect();
        } catch {
          // ignore cleanup errors
        }
      }
    });
    this.activeNodes = [];
    this.currentTrack = 'off';
    this.isRunning = false;
  }

  public playTrack(track: 'harp' | 'rain' | 'bells' | 'wind' | 'sanctuary') {
    this.initContext();
    this.stop();
    this.currentTrack = track;
    this.isRunning = true;

    if (!this.ctx || !this.masterGain) return;

    switch (track) {
      case 'sanctuary':
        this.playSanctuaryPad();
        break;
      case 'harp':
        this.playCelestialHarp();
        break;
      case 'rain':
        this.playGentleRain();
        break;
      case 'bells':
        this.playTempleBells();
        break;
      case 'wind':
        this.playMountainBreeze();
        break;
    }
  }

  private playSanctuaryPad() {
    if (!this.ctx || !this.masterGain) return;
    // Warm spiritual chords (F, A, C, E, G gentle sine chord with lfo)
    const baseFreqs = [174.61, 220.0, 261.63, 329.63, 392.0]; // F3, A3, C4, E4, G4
    baseFreqs.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const filter = this.ctx!.createBiquadFilter();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime);

      // Lowpass for warm pad
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450 + idx * 80, this.ctx!.currentTime);

      // Gentle pulsating volume
      gain.gain.setValueAtTime(0.04 / (idx + 1), this.ctx!.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain!);

      osc.start();
      this.activeNodes.push(osc, gain, filter);
    });
  }

  private playCelestialHarp() {
    if (!this.ctx || !this.masterGain) return;

    // Arpeggio notes in Pentatonic Major scale (C, D, E, G, A, C5, D5, E5)
    const notes = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25];
    
    // Background soft pad
    const padOsc = this.ctx.createOscillator();
    const padGain = this.ctx.createGain();
    padOsc.type = 'sine';
    padOsc.frequency.setValueAtTime(130.81, this.ctx.currentTime); // C3
    padGain.gain.setValueAtTime(0.03, this.ctx.currentTime);
    padOsc.connect(padGain);
    padGain.connect(this.masterGain);
    padOsc.start();
    this.activeNodes.push(padOsc, padGain);

    // Arpeggio interval
    const interval = window.setInterval(() => {
      if (!this.ctx || !this.masterGain) return;
      const randomNote = notes[Math.floor(Math.random() * notes.length)];
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(randomNote, this.ctx.currentTime);

      const now = this.ctx.currentTime;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.08, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 2.6);
    }, 700);

    this.activeNodes.push(interval);
  }

  private playGentleRain() {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    // Pink noise generation
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    whiteNoise.start();
    this.activeNodes.push(whiteNoise, filter, gain);
  }

  private playTempleBells() {
    if (!this.ctx || !this.masterGain) return;

    const bellFrequencies = [528, 432, 639, 741, 852]; // Solfeggio sacred frequencies
    const interval = window.setInterval(() => {
      if (!this.ctx || !this.masterGain) return;
      const freq = bellFrequencies[Math.floor(Math.random() * bellFrequencies.length)];
      const now = this.ctx.currentTime;

      // Primary chime
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.1, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);

      // Overtones
      const oscOvertone = this.ctx.createOscillator();
      const gainOvertone = this.ctx.createGain();
      oscOvertone.type = 'sine';
      oscOvertone.frequency.setValueAtTime(freq * 2.76, now);
      gainOvertone.gain.setValueAtTime(0.03, now);
      gainOvertone.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

      osc.connect(gain);
      oscOvertone.connect(gainOvertone);
      gain.connect(this.masterGain);
      gainOvertone.connect(this.masterGain);

      osc.start(now);
      oscOvertone.start(now);
      osc.stop(now + 4.6);
      oscOvertone.stop(now + 2.6);
    }, 2800);

    this.activeNodes.push(interval);
  }

  private playMountainBreeze() {
    if (!this.ctx || !this.masterGain) return;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    const gain2 = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(110, this.ctx.currentTime); // A2
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(164.81, this.ctx.currentTime); // E3

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(220, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.5, this.ctx.currentTime);

    gain1.gain.setValueAtTime(0.04, this.ctx.currentTime);
    gain2.gain.setValueAtTime(0.02, this.ctx.currentTime);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain1);
    gain1.connect(this.masterGain);

    osc1.start();
    osc2.start();

    this.activeNodes.push(osc1, osc2, filter, gain1, gain2);
  }

  public getCurrentTrack(): string {
    return this.currentTrack;
  }
}

export const ambientSound = new AmbientSoundEngine();

// Speech Synthesis Reader - Calibrated for the Solemn & Loving Voice of Jesus
export class DevotionalReader {
  private static synth: SpeechSynthesis | null = typeof window !== 'undefined' ? window.speechSynthesis : null;
  private static utterance: SpeechSynthesisUtterance | null = null;
  private static isSpeakingState = false;

  public static speak(
    text: string,
    options?: {
      rate?: number;
      pitch?: number;
      voiceMode?: 'jesus' | 'solemn' | 'peace';
      onEnd?: () => void;
      onBoundary?: (charIndex: number) => void;
    }
  ) {
    if (!this.synth) return;
    this.stop();

    // Clean brackets or directorial tags and create gentle pauses
    const cleanText = text
      .replace(/\[pausa.*?\]/gi, ' ... ')
      .replace(/\[.*?\]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    this.utterance = new SpeechSynthesisUtterance(cleanText);
    this.utterance.lang = 'es-ES';

    // Voice profiles: Slower, deeper, soothing, solemn
    if (options?.voiceMode === 'jesus') {
      this.utterance.rate = options.rate || 0.74; // Slow, calm, loving fatherly pace
      this.utterance.pitch = options.pitch || 0.88; // Deeper resonant tone
    } else if (options?.voiceMode === 'peace') {
      this.utterance.rate = options.rate || 0.70; // Ultra meditative pace
      this.utterance.pitch = options.pitch || 0.84;
    } else {
      this.utterance.rate = options?.rate || 0.76;
      this.utterance.pitch = options?.pitch || 0.90;
    }

    // Pick best natural Spanish voice
    const voices = this.synth.getVoices();
    const esVoice = voices.find(v => 
      v.lang.startsWith('es') && (
        v.name.includes('Jorge') || 
        v.name.includes('Alvaro') || 
        v.name.includes('Diego') || 
        v.name.includes('Natural') || 
        v.name.includes('Google') || 
        v.name.includes('Castilian')
      )
    ) || voices.find(v => v.lang.startsWith('es'));

    if (esVoice) {
      this.utterance.voice = esVoice;
    }

    this.utterance.onend = () => {
      this.isSpeakingState = false;
      if (options?.onEnd) options.onEnd();
    };

    this.utterance.onerror = () => {
      this.isSpeakingState = false;
      if (options?.onEnd) options.onEnd();
    };

    if (options?.onBoundary) {
      this.utterance.onboundary = (e) => {
        options.onBoundary!(e.charIndex);
      };
    }

    this.isSpeakingState = true;
    this.synth.speak(this.utterance);
  }

  public static stop() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeakingState = false;
    }
  }

  public static isSpeaking(): boolean {
    return this.isSpeakingState;
  }
}
