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

// Speech Synthesis Reader - Calibrated for the Solemn, Loving & Engaging Voice of Jesus with Church Sanctuary Ambience
export class DevotionalReader {
  private static synth: SpeechSynthesis | null = typeof window !== 'undefined' ? window.speechSynthesis : null;
  private static utterance: SpeechSynthesisUtterance | null = null;
  private static isSpeakingState = false;
  private static bgAudioContext: AudioContext | null = null;
  private static bgNodes: (AudioNode | number)[] = [];
  private static onPhraseHighlightCallback: ((phraseIndex: number, phraseText: string) => void) | null = null;

  // Format a coherent, deeply captivating first-person spoken message from Jesus
  public static formatJesusSpokenScript(devotional: {
    devotionalTitle: string;
    verseReference: string;
    verseText: string;
    reflectionText: string;
    guidedPrayer: string;
    thoughtOfTheDay?: string;
  }): { fullScript: string; phrases: string[] } {
    const cleanTitle = devotional.devotionalTitle.replace(/[#*]/g, '').trim();
    const cleanVerse = devotional.verseText.replace(/[#*"]/g, '').trim();
    const cleanRef = devotional.verseReference.replace(/[#*]/g, '').trim();
    const cleanPrayer = devotional.guidedPrayer.replace(/[#*"]/g, '').trim();
    const cleanThought = devotional.thoughtOfTheDay ? devotional.thoughtOfTheDay.replace(/[#*"]/g, '').trim() : '';

    // Take the most touching reflection sentences
    const reflectionSentences = devotional.reflectionText
      .replace(/[#*]/g, '')
      .split(/(?<=[.?!])\s+/)
      .filter(s => s.trim().length > 10)
      .slice(0, 3)
      .join(' ');

    const phrases = [
      `Hijo mío... [pausa] Sé que hoy necesitas paz en tu corazón. Detén por un instante el ruido de este día y escucha con amor lo que quiero decirte.`,
      `En mi Santa Palabra, hoy te recuerdo en ${cleanRef}: "${cleanVerse}".`,
      `Guarda esta promesa en lo más profundo de tu alma. ${reflectionSentences}`,
      `No estás solo, ni en la prueba ni en la incertidumbre. Mis brazos siguen abiertos para sostenerte, sanarte y renovar tus fuerzas.`,
      `Descansa hoy bajo el amparo de mi gracia y oremos juntos: "${cleanPrayer}"`,
      cleanThought ? `Recuerda siempre esto: "${cleanThought}".` : `Ve en paz... Mi bendición y mi presencia caminan contigo cada día. Amén.`
    ];

    const fullScript = phrases.join('\n\n');
    return { fullScript, phrases };
  }

  private static startChurchAmbience(volume = 0.08) {
    try {
      if (!this.bgAudioContext) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        this.bgAudioContext = new AudioCtx();
      }
      if (this.bgAudioContext.state === 'suspended') {
        this.bgAudioContext.resume();
      }

      // Warm church sanctuary pad (432Hz harmonic series: C, E, G, B, D)
      const masterGain = this.bgAudioContext.createGain();
      masterGain.gain.setValueAtTime(volume, this.bgAudioContext.currentTime);
      masterGain.connect(this.bgAudioContext.destination);

      const notes = [130.81, 164.81, 196.00, 246.94, 293.66]; // C3, E3, G3, B3, D4
      notes.forEach((freq, idx) => {
        const osc = this.bgAudioContext!.createOscillator();
        const gain = this.bgAudioContext!.createGain();
        const filter = this.bgAudioContext!.createBiquadFilter();

        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, this.bgAudioContext!.currentTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(360 + idx * 50, this.bgAudioContext!.currentTime);

        gain.gain.setValueAtTime(0.025 / (idx + 1), this.bgAudioContext!.currentTime);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);

        osc.start();
        this.bgNodes.push(osc, gain, filter);
      });

      this.bgNodes.push(masterGain);
    } catch {
      // Audio context restriction
    }
  }

  private static stopChurchAmbience() {
    this.bgNodes.forEach(node => {
      if (typeof node !== 'number') {
        try {
          if ('stop' in node && typeof (node as any).stop === 'function') {
            (node as any).stop();
          }
          node.disconnect();
        } catch {
          // ignore
        }
      }
    });
    this.bgNodes = [];
  }

  public static speak(
    text: string,
    options?: {
      rate?: number;
      pitch?: number;
      voiceMode?: 'jesus' | 'solemn' | 'peace' | 'church';
      withChurchAmbience?: boolean;
      onEnd?: () => void;
      onBoundary?: (charIndex: number) => void;
      onPhraseIndex?: (index: number) => void;
    }
  ) {
    if (!this.synth) return;
    this.stop();

    if (options?.withChurchAmbience !== false) {
      this.startChurchAmbience(0.07);
    }

    // Clean brackets or directorial tags and create gentle pauses
    const cleanText = text
      .replace(/\[pausa.*?\]/gi, ' ... ')
      .replace(/\[.*?\]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    this.utterance = new SpeechSynthesisUtterance(cleanText);
    this.utterance.lang = 'es-ES';

    // Voice profiles: Slower, deeper, authoritative, loving & soothing
    if (options?.voiceMode === 'jesus' || options?.voiceMode === 'church') {
      this.utterance.rate = options.rate || 0.72; // Warm, loving paternal pace
      this.utterance.pitch = options.pitch || 0.86; // Resonant soothing tone
    } else if (options?.voiceMode === 'peace') {
      this.utterance.rate = options.rate || 0.69;
      this.utterance.pitch = options.pitch || 0.84;
    } else {
      this.utterance.rate = options?.rate || 0.75;
      this.utterance.pitch = options?.pitch || 0.88;
    }

    // Pick the most natural, rich Spanish voice available
    const voices = this.synth.getVoices();
    const esVoice = voices.find(v => 
      v.lang.startsWith('es') && (
        v.name.includes('Jorge') || 
        v.name.includes('Diego') || 
        v.name.includes('Alvaro') || 
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
      this.stopChurchAmbience();
      if (options?.onEnd) options.onEnd();
    };

    this.utterance.onerror = () => {
      this.isSpeakingState = false;
      this.stopChurchAmbience();
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
    this.stopChurchAmbience();
  }

  public static isSpeaking(): boolean {
    return this.isSpeakingState;
  }
}

// 🎼 SACRED CONTEMPORARY CHRISTIAN WORSHIP & POP PRAISE SYNTHESIZER
// Real full-band rhythm groove: Drums (Kick, Snare, Hi-Hats, Cymbal), Bass, Acoustic Guitar, Piano & 432Hz Sanctuary Strings
export class WorshipSongSynthesizer {
  private ctx: AudioContext | null = null;
  private isPlayingState = false;
  private activeNodes: (AudioNode | number)[] = [];
  private loopInterval: number | null = null;
  private currentProgress = 0;
  private currentSectionIndex = 0;
  private onProgressCallback: ((sec: number) => void) | null = null;
  private onBeatCallback: ((beatNumber: number, sectionName: string) => void) | null = null;
  private onEndCallback: (() => void) | null = null;
  private singerSynth: SpeechSynthesis | null = typeof window !== 'undefined' ? window.speechSynthesis : null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  // Sound generator buffers
  private noiseBuffer: AudioBuffer | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (!this.noiseBuffer && this.ctx) {
      this.noiseBuffer = this.createNoiseBuffer();
    }
  }

  private createNoiseBuffer(): AudioBuffer {
    const bufferSize = this.ctx!.sampleRate * 2;
    const buffer = this.ctx!.createBuffer(1, bufferSize, this.ctx!.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  // --- 1. DRUM KIT INSTRUMENTS ---
  // Sub Kick Drum (Punchy 150Hz -> 42Hz Boom)
  private playKick(time: number, gainNode: GainNode, velocity = 0.8) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.frequency.setValueAtTime(145, time);
    osc.frequency.exponentialRampToValueAtTime(42, time + 0.12);

    gain.gain.setValueAtTime(0.001, time);
    gain.gain.linearRampToValueAtTime(0.38 * velocity, time + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.35);

    osc.connect(gain);
    gain.connect(gainNode);

    osc.start(time);
    osc.stop(time + 0.36);
    this.activeNodes.push(osc, gain);
  }

  // Acoustic Snare & Rimshot (Crisp Body + Noise Reverb)
  private playSnare(time: number, gainNode: GainNode, isRim = false, velocity = 0.75) {
    if (!this.ctx || !this.noiseBuffer) return;

    // Body tone
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(isRim ? 240 : 185, time);
    osc.frequency.exponentialRampToValueAtTime(110, time + 0.08);

    oscGain.gain.setValueAtTime(0.22 * velocity, time);
    oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.14);

    osc.connect(oscGain);
    oscGain.connect(gainNode);
    osc.start(time);
    osc.stop(time + 0.15);

    // Snare wires (Bandpassed noise)
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.noiseBuffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(isRim ? 2200 : 1400, time);
    filter.Q.setValueAtTime(1.8, time);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.25 * velocity, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, time + (isRim ? 0.12 : 0.22));

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(gainNode);

    noise.start(time);
    noise.stop(time + 0.25);
    this.activeNodes.push(osc, oscGain, noise, filter, noiseGain);
  }

  // Acoustic Hi-Hat (Closed / Open Shimmer)
  private playHiHat(time: number, gainNode: GainNode, isOpen = false, velocity = 0.5) {
    if (!this.ctx || !this.noiseBuffer) return;
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(7500, time);

    const gain = this.ctx.createGain();
    const duration = isOpen ? 0.28 : 0.045;
    gain.gain.setValueAtTime(0.12 * velocity, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(gainNode);

    noise.start(time);
    noise.stop(time + duration + 0.01);
    this.activeNodes.push(noise, filter, gain);
  }

  // Crash Cymbal for worship clímax transitions
  private playCrash(time: number, gainNode: GainNode, velocity = 0.7) {
    if (!this.ctx || !this.noiseBuffer) return;
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(5200, time);
    filter.Q.setValueAtTime(0.9, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.22 * velocity, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 2.2);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(gainNode);

    noise.start(time);
    noise.stop(time + 2.3);
    this.activeNodes.push(noise, filter, gain);
  }

  // --- 2. BASS GUITAR OF WORSHIP ---
  private playBass(freq: number, time: number, duration: number, gainNode: GainNode, velocity = 0.8) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const subOsc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    subOsc.type = 'sine';

    // Drop to deep bass octave (E1-G2)
    const baseFreq = freq / 2;
    osc.frequency.setValueAtTime(baseFreq, time);
    subOsc.frequency.setValueAtTime(baseFreq, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, time);
    filter.frequency.exponentialRampToValueAtTime(140, time + 0.25);

    gain.gain.setValueAtTime(0.001, time);
    gain.gain.linearRampToValueAtTime(0.22 * velocity, time + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(filter);
    subOsc.connect(filter);
    filter.connect(gain);
    gain.connect(gainNode);

    osc.start(time);
    subOsc.start(time);
    osc.stop(time + duration + 0.02);
    subOsc.stop(time + duration + 0.02);
    this.activeNodes.push(osc, subOsc, filter, gain);
  }

  // --- 3. ACOUSTIC GUITAR & PIANO HARMONICS ---
  private playGuitarStrum(notes: number[], time: number, duration: number, gainNode: GainNode) {
    if (!this.ctx) return;
    notes.forEach((freq, idx) => {
      const noteTime = time + idx * 0.025; // strumming delay
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const filter = this.ctx!.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq * 2, noteTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2200, noteTime);
      filter.frequency.exponentialRampToValueAtTime(600, noteTime + 0.8);

      gain.gain.setValueAtTime(0.001, noteTime);
      gain.gain.linearRampToValueAtTime(0.08 / (idx + 1), noteTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(gainNode);

      osc.start(noteTime);
      osc.stop(noteTime + duration + 0.05);
      this.activeNodes.push(osc, filter, gain);
    });
  }

  // Ambient Celestial Piano Arpeggio
  private playPianoNote(freq: number, time: number, duration: number, gainNode: GainNode) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq * 2, time);

    gain.gain.setValueAtTime(0.001, time);
    gain.gain.linearRampToValueAtTime(0.09, time + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(gain);
    gain.connect(gainNode);

    osc.start(time);
    osc.stop(time + duration + 0.05);
    this.activeNodes.push(osc, gain);
  }

  // --- 4. SANCTUARY CELESTIAL STRINGS & 432 Hz PAD ---
  private playSanctuaryPad(notes: number[], time: number, duration: number, gainNode: GainNode) {
    if (!this.ctx) return;
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const filter = this.ctx!.createBiquadFilter();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, time);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450 + idx * 80, time);

      gain.gain.setValueAtTime(0.001, time);
      gain.gain.linearRampToValueAtTime(0.035 / (idx + 1), time + 0.5);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(gainNode);

      osc.start(time);
      osc.stop(time + duration + 0.1);
      this.activeNodes.push(osc, gain, filter);
    });
  }

  public isPlaying(): boolean {
    return this.isPlayingState;
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
          // ignore
        }
      }
    });
    this.activeNodes = [];

    if (this.loopInterval) {
      window.clearInterval(this.loopInterval);
      this.loopInterval = null;
    }

    if (this.singerSynth) {
      this.singerSynth.cancel();
    }

    this.isPlayingState = false;
    this.currentProgress = 0;
    this.currentSectionIndex = 0;
  }

  // --- 5. SINGING SINGER ENGINE (SALMISTA DAVID / VOZ DE ADORADOR) ---
  private singLyricsWithSalmistaVoice(
    lyricsText: string,
    singerStyle: 'salmista-principal' | 'adoracion-intima' | 'clamor-gloria' = 'salmista-principal',
    onSectionSing?: (section: string) => void
  ) {
    if (!this.singerSynth) return;
    this.singerSynth.cancel();

    // Clean lyrics into musical vocal phrases
    const cleanLyrics = lyricsText
      .replace(/\[Verso \d+\]/gi, '...')
      .replace(/\[Pre-Coro\]/gi, '...')
      .replace(/\[Coro.*?\]/gi, '...')
      .replace(/\[Puente.*?\]/gi, '...')
      .replace(/\[Outro.*?\]/gi, '...')
      .replace(/\n+/g, ' ... ')
      .trim();

    this.currentUtterance = new SpeechSynthesisUtterance(cleanLyrics);
    this.currentUtterance.lang = 'es-ES';

    // Salmista Singer Vocal Profile: Melodic pacing, emotional pitch inflection
    if (singerStyle === 'salmista-principal') {
      this.currentUtterance.rate = 0.74; // Melodic worship cadence
      this.currentUtterance.pitch = 0.95; // Warm, passionate tenor worship register
    } else if (singerStyle === 'adoracion-intima') {
      this.currentUtterance.rate = 0.70;
      this.currentUtterance.pitch = 0.88;
    } else {
      this.currentUtterance.rate = 0.78;
      this.currentUtterance.pitch = 1.05;
    }

    // Pick top natural Spanish vocal persona for the worship singer
    const voices = this.singerSynth.getVoices();
    const worshipSingerVoice = voices.find(v =>
      v.lang.startsWith('es') && (
        v.name.includes('Diego') || 
        v.name.includes('Jorge') || 
        v.name.includes('Alvaro') || 
        v.name.includes('Natural') || 
        v.name.includes('Google') || 
        v.name.includes('Castilian')
      )
    ) || voices.find(v => v.lang.startsWith('es'));

    if (worshipSingerVoice) {
      this.currentUtterance.voice = worshipSingerVoice;
    }

    this.singerSynth.speak(this.currentUtterance);
  }

  // --- 6. MAIN PLAY FUNCTION WITH WORSHIP GROOVE ---
  public playWorshipSong(options?: {
    lyrics?: string;
    withVocals?: boolean;
    arrangementStyle?: 'balada-pop' | 'acustico-intimo' | 'pop-worship-gloria' | 'santuario-432hz';
    singerStyle?: 'salmista-principal' | 'adoracion-intima' | 'clamor-gloria';
    bpm?: number;
    onProgress?: (sec: number) => void;
    onBeat?: (beatNumber: number, sectionName: string) => void;
    onEnd?: () => void;
  }) {
    this.initContext();
    this.stop();
    this.isPlayingState = true;
    this.onProgressCallback = options?.onProgress || null;
    this.onBeatCallback = options?.onBeat || null;
    this.onEndCallback = options?.onEnd || null;

    if (!this.ctx) return;

    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(0.42, this.ctx.currentTime);
    masterGain.connect(this.ctx.destination);
    this.activeNodes.push(masterGain);

    // Chords in Sol Mayor (G Worship): G (G-B-D), D/F# (F#-A-D), Em7 (E-G-B-D), Cadd9 (C-E-G-D)
    const chordProgression = [
      { name: 'G', notes: [196.00, 246.94, 293.66, 392.00], bassNote: 196.00 },
      { name: 'D/F#', notes: [185.00, 220.00, 293.66, 370.00], bassNote: 185.00 },
      { name: 'Em7', notes: [164.81, 196.00, 246.94, 329.63], bassNote: 164.81 },
      { name: 'Cadd9', notes: [130.81, 196.00, 261.63, 329.63], bassNote: 130.81 },
    ];

    const bpm = options?.bpm || 72; // Contemporary 72 BPM worship tempo
    const beatDuration = 60 / bpm; // ~0.833s per quarter note
    const barDuration = beatDuration * 4; // ~3.33s per measure

    let currentBar = 0;
    const sectionNames = ['Intro', 'Verso 1', 'Pre-Coro', 'Coro de Adoración', 'Verso 2', 'Puente de Clímax', 'Coro Final', 'Outro de Paz'];

    const playWorshipBar = () => {
      if (!this.ctx || !this.isPlayingState) return;
      const currentChord = chordProgression[currentBar % chordProgression.length];
      const sectionName = sectionNames[Math.floor((currentBar / 2) % sectionNames.length)];
      const isChorusOrBridge = sectionName.includes('Coro') || sectionName.includes('Puente');
      const isIntroOrOutro = sectionName.includes('Intro') || sectionName.includes('Outro');

      const now = this.ctx.currentTime;

      // Notify UI beat and section
      if (this.onBeatCallback) {
        this.onBeatCallback(currentBar % 4 + 1, sectionName);
      }

      // 1. Strings & Pad (continuous holy atmosphere)
      this.playSanctuaryPad(currentChord.notes, now, barDuration + 0.4, masterGain);

      // 2. Piano Arpeggio (every beat)
      currentChord.notes.forEach((freq, idx) => {
        this.playPianoNote(freq, now + idx * beatDuration, beatDuration * 1.5, masterGain);
      });

      // 3. Acoustic Guitar Strumming (on beats 1, 2.5, 3, 4.5)
      this.playGuitarStrum(currentChord.notes, now, barDuration * 0.9, masterGain);
      this.playGuitarStrum(currentChord.notes, now + beatDuration * 2, barDuration * 0.9, masterGain);

      // 4. Bass Guitar (Locks with kick on beats 1 and 3)
      this.playBass(currentChord.bassNote, now, beatDuration * 1.8, masterGain, isChorusOrBridge ? 0.9 : 0.65);
      this.playBass(currentChord.bassNote, now + beatDuration * 2, beatDuration * 1.8, masterGain, isChorusOrBridge ? 0.9 : 0.65);

      // 5. Full-Band Drums (Kick, Snare, Hi-Hats, Crash)
      if (!isIntroOrOutro) {
        // Kick on beats 1, 2.5 (ghost syncopation), 3
        this.playKick(now, masterGain, isChorusOrBridge ? 1.0 : 0.8);
        this.playKick(now + beatDuration * 1.5, masterGain, 0.5); // syncopated ghost kick
        this.playKick(now + beatDuration * 2, masterGain, isChorusOrBridge ? 0.95 : 0.75);

        // Snare Rim / Snare on beats 2 and 4
        this.playSnare(now + beatDuration, masterGain, !isChorusOrBridge, isChorusOrBridge ? 0.9 : 0.65);
        this.playSnare(now + beatDuration * 3, masterGain, false, isChorusOrBridge ? 0.95 : 0.7);

        // 8th-note Hi-Hats groove (beats 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5)
        for (let b = 0; b < 8; b++) {
          const hatTime = now + b * (beatDuration / 2);
          const isOpen = b === 6; // open hat before beat 4
          this.playHiHat(hatTime, masterGain, isOpen, b % 2 === 0 ? 0.6 : 0.35);
        }

        // Crash cymbal at the start of Chorus / Bridge
        if (currentBar % 8 === 0 && isChorusOrBridge) {
          this.playCrash(now, masterGain, 0.85);
        }
      } else {
        // Soft shaker in intro/outro
        this.playHiHat(now, masterGain, false, 0.3);
        this.playHiHat(now + beatDuration * 2, masterGain, false, 0.3);
      }

      currentBar++;
    };

    // Trigger first bar immediately
    playWorshipBar();
    const interval = window.setInterval(() => {
      playWorshipBar();
      this.currentProgress += barDuration;
      if (this.onProgressCallback) {
        this.onProgressCallback(Math.round(this.currentProgress));
      }
    }, barDuration * 1000);

    this.activeNodes.push(interval);
    this.loopInterval = interval;

    // Trigger Salmista Singer Vocals if enabled
    if (options?.withVocals && options.lyrics) {
      this.singLyricsWithSalmistaVoice(
        options.lyrics,
        options.singerStyle || 'salmista-principal'
      );
    }
  }
}

export const worshipSongEngine = new WorshipSongSynthesizer();

