// Audio Synthesis & Voice Engine for Fe & Oración AI

class AmbientAudioEngine {
  private audioCtx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private activeNodes: (AudioNode | number)[] = [];
  private currentTrack: string = 'off';
  private volume: number = 0.35;

  private initContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioContextClass();
      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.audioCtx.currentTime);
      this.masterGain.connect(this.audioCtx.destination);
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.audioCtx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.audioCtx.currentTime);
    }
  }

  public stop() {
    this.currentTrack = 'off';
    this.activeNodes.forEach(node => {
      try {
        if (typeof node === 'number') {
          clearInterval(node);
        } else if ('stop' in node && typeof (node as any).stop === 'function') {
          (node as any).stop();
        } else if ('disconnect' in node && typeof (node as any).disconnect === 'function') {
          (node as any).disconnect();
        }
      } catch (e) {
        // ignore
      }
    });
    this.activeNodes = [];
  }

  public playTrack(track: 'sanctuary' | 'harp' | 'rain' | 'bells' | 'wind' | 'off') {
    this.stop();
    if (track === 'off') return;

    this.initContext();
    if (!this.audioCtx || !this.masterGain) return;

    this.currentTrack = track;
    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    switch (track) {
      case 'sanctuary': {
        const frequencies = [216, 324, 432, 540, 648];
        frequencies.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const filter = ctx.createBiquadFilter();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);
          osc.detune.setValueAtTime((idx - 2) * 4, now);

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(800, now);

          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.12 / frequencies.length, now + 3);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(this.masterGain!);

          osc.start();
          this.activeNodes.push(osc, gain, filter);
        });
        break;
      }

      case 'harp': {
        const scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];
        const timer = window.setInterval(() => {
          if (!this.audioCtx || !this.masterGain) return;
          const note = scale[Math.floor(Math.random() * scale.length)];
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(note, this.audioCtx.currentTime);

          gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 2.5);

          osc.connect(gain);
          gain.connect(this.masterGain);

          osc.start();
          osc.stop(this.audioCtx.currentTime + 2.6);
        }, 900);
        this.activeNodes.push(timer);
        break;
      }

      case 'rain': {
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.06;
          b6 = white * 0.115926;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1000, now);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.15, now);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        noise.start();
        this.activeNodes.push(noise, gain, filter);
        break;
      }

      case 'bells': {
        const bellFreqs = [261.63, 329.63, 392.00]; // Warm low acoustic octaves C4, E4, G4 (no high beeps)
        const timer = window.setInterval(() => {
          if (!this.audioCtx || !this.masterGain) return;
          const freq = bellFreqs[Math.floor(Math.random() * bellFreqs.length)];
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          const filter = this.audioCtx.createBiquadFilter();

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(450, this.audioCtx.currentTime);

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

          gain.gain.setValueAtTime(0.02, this.audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 3.0);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(this.masterGain);

          osc.start();
          osc.stop(this.audioCtx.currentTime + 3.1);
        }, 3200);
        this.activeNodes.push(timer);
        break;
      }

      case 'wind': {
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * 0.08;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(400, now);
        filter.Q.setValueAtTime(3.0, now);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.2, now);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        noise.start();
        this.activeNodes.push(noise, gain, filter);
        break;
      }
    }
  }
}

export const ambientSound = new AmbientAudioEngine();

export interface FormattedSpokenScript {
  fullScript: string;
  phrases: string[];
}

export class DevotionalReader {
  private static currentUtterance: SpeechSynthesisUtterance | null = null;

  public static formatJesusSpokenScript(data: {
    devotionalTitle?: string;
    verseReference?: string;
    verseText?: string;
    reflectionText?: string;
    guidedPrayer?: string;
    thoughtOfTheDay?: string;
  }): FormattedSpokenScript {
    const parts: string[] = [];
    if (data.devotionalTitle) parts.push(`Palabra de hoy: ${data.devotionalTitle}.`);
    if (data.verseReference && data.verseText) parts.push(`Escucha lo que dice mi palabra en ${data.verseReference}: "${data.verseText}"`);
    if (data.reflectionText) parts.push(data.reflectionText);
    if (data.guidedPrayer) parts.push(`Oremos juntos: ${data.guidedPrayer}`);
    if (data.thoughtOfTheDay) parts.push(`Recuerda en tu corazón hoy: ${data.thoughtOfTheDay}`);

    const fullScript = parts.join('\n\n');
    return {
      fullScript,
      phrases: parts
    };
  }

  public static stop() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.currentUtterance = null;
  }

  public static speak(
    text: string,
    options?: {
      onEnd?: () => void;
      rate?: number;
      pitch?: number;
      lang?: string;
      voiceMode?: string;
      withChurchAmbience?: boolean;
      onBoundary?: (charIndex: number) => void;
    }
  ) {
    this.stop();
    if (!('speechSynthesis' in window) || !text) {
      options?.onEnd?.();
      return;
    }

    const cleanText = text.replace(/[*#_`]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = options?.lang || 'es-ES';
    utterance.rate = options?.rate || 0.92;
    utterance.pitch = options?.pitch || 0.95;

    const voices = window.speechSynthesis.getVoices();
    const esVoice = voices.find(v => v.lang.startsWith('es') && (v.name.includes('Natural') || v.name.includes('Pablo') || v.name.includes('Jorge') || v.name.includes('Google')))
      || voices.find(v => v.lang.startsWith('es'));

    if (esVoice) {
      utterance.voice = esVoice;
    }

    utterance.onend = () => {
      this.currentUtterance = null;
      options?.onEnd?.();
    };

    utterance.onerror = () => {
      this.currentUtterance = null;
      options?.onEnd?.();
    };

    if (options?.onBoundary) {
      utterance.onboundary = (e) => {
        options.onBoundary?.(e.charIndex);
      };
    }

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }
}

class WorshipSongEngine {
  private isPlaying = false;
  private intervalId: number | null = null;

  public stop() {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    DevotionalReader.stop();
  }

  public playWorshipSong(options: {
    lyrics?: string;
    withVocals?: boolean;
    arrangementStyle?: string;
    singerStyle?: string;
    bpm?: number;
    onBeat?: (beatNumber: number, sectionName: string) => void;
    onEnd?: () => void;
  }) {
    this.stop();
    this.isPlaying = true;

    const bpm = options.bpm || 68;
    const intervalMs = (60 / bpm) * 1000;
    let beat = 1;

    const sections = ['Intro', 'Verso 1', 'Pre-Coro', 'Coro', 'Verso 2', 'Coro de Gloria', 'Outro Celestial'];
    let sectionIdx = 0;

    ambientSound.playTrack('harp');

    if (options.withVocals && options.lyrics) {
      DevotionalReader.speak(options.lyrics, {
        rate: 0.85,
        pitch: 1.0,
        onEnd: () => {
          this.stop();
          options.onEnd?.();
        }
      });
    }

    this.intervalId = window.setInterval(() => {
      if (!this.isPlaying) return;

      const currentSection = sections[sectionIdx];
      options.onBeat?.(beat, currentSection);

      beat++;
      if (beat > 4) {
        beat = 1;
        if (Math.random() > 0.65 && sectionIdx < sections.length - 1) {
          sectionIdx++;
        }
      }
    }, intervalMs);
  }
}

export const worshipSongEngine = new WorshipSongEngine();
