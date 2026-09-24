/**
 * Niche Melody & Sound Branding Engine (Web Audio API)
 * Generates unique, high-retention melodic background soundtracks for each educational & narrative niche.
 * 100% client-side, zero external assets, instant playback, zero buffering, zero quota consumption.
 */

export interface NicheMelodySpec {
  id: string;
  nicheId: string;
  nicheName: string;
  title: string;
  subgenre: string;
  bpm: number;
  musicalKey: string;
  moodDescription: string;
  instruments: string[];
  viralSoundPrompt: string;
  viralAudioTags: string[];
  colorGradient: string;
  icon: string;
  synthConfig: {
    baseNote: number; // MIDI base note (e.g. 50 = D3)
    scale: number[]; // semitone intervals
    chords: number[][]; // chord progressions (MIDI notes)
    leadPattern: number[]; // sequence indices
    bassPattern: number[]; // bass notes
    leadWaveform: OscillatorType;
    padWaveform: OscillatorType;
    bassWaveform: OscillatorType;
    filterCutoff: number; // Hz
    resonance: number;
    drumType: 'lofi_tick' | 'tech_pulse' | 'clock_tick' | 'deep_sub' | 'cosmic_sparkle' | 'epic_thump' | 'worship_chime';
  };
}

// Complete Catalog of Unique Niche Melodies
export const NICHE_MELODIES: Record<string, NicheMelodySpec> = {
  ventas_negocios: {
    id: 'melodia_ventas_negocios',
    nicheId: 'ventas_negocios',
    nicheName: 'Ventas y Negocios de Alto Rendimiento',
    title: "The Closer's Groove",
    subgenre: 'Lo-Fi Synthwave & Neo-Soul Ambition',
    bpm: 124,
    musicalKey: 'Re menor (D minor)',
    moodDescription: 'Groove seguro, confiado, magnético y de alto estatus. Transmite éxito ejecutivo y determinación.',
    instruments: ['Rhodes Electric Piano', 'Slap Bass Sintetizado', 'Hi-Hat Lo-Fi Suave', 'Pad Caliente 80s'],
    viralSoundPrompt: 'Upbeat modern business Lo-Fi beat, 124 BPM, soulful Rhodes piano chords in D minor, punchy sidechained bassline, crisp snapping vinyl drums, confident ambitious mood, ideal for viral sales TikTok shorts.',
    viralAudioTags: ['#SalesBeat', '#BusinessMotivation', '#FocusGroove', '#CloserEnergy', '#MoneyMindset'],
    colorGradient: 'from-amber-500 to-orange-600',
    icon: '💼',
    synthConfig: {
      baseNote: 50, // D3
      scale: [0, 2, 3, 5, 7, 8, 10], // Natural minor
      chords: [
        [50, 53, 57, 60], // Dm7
        [46, 50, 53, 57], // Bbmaj7
        [48, 52, 55, 58], // C7
        [45, 48, 52, 55]  // Am7
      ],
      leadPattern: [60, 62, 65, 62, 60, 57, 58, 60],
      bassPattern: [38, 34, 36, 33],
      leadWaveform: 'triangle',
      padWaveform: 'sine',
      bassWaveform: 'sawtooth',
      filterCutoff: 1400,
      resonance: 2.5,
      drumType: 'lofi_tick'
    }
  },
  finanzas_dinero: {
    id: 'melodia_finanzas_dinero',
    nicheId: 'finanzas_dinero',
    nicheName: 'Finanzas Inteligentes y Dinero',
    title: 'Wealth Cadence & Gold Chimes',
    subgenre: 'Minimal Tech-Piano & Crystalline Prosperity',
    bpm: 120,
    musicalKey: 'La menor / Do mayor (Am/C)',
    moodDescription: 'Inteligente, triunfante, matemático y cristalino. La campana dorada subraya crecimiento de capital.',
    instruments: ['Piano de Cola Acústico', 'Campana de Cristal 880Hz', 'Sub-Bajo Trombón Sintético', 'Arpegio Diamante'],
    viralSoundPrompt: 'Crisp financial tech-piano soundtrack, 120 BPM in A minor, subtle luxury bell chime every 4 bars, ascending victorious bassline, pristine corporate clarity, high-retention audio for investment shorts.',
    viralAudioTags: ['#FinanceAudio', '#SmartMoney', '#CryptoBeat', '#InvestingShorts', '#WealthGrowth'],
    colorGradient: 'from-emerald-500 to-teal-600',
    icon: '💰',
    synthConfig: {
      baseNote: 45, // A2
      scale: [0, 2, 3, 5, 7, 8, 10],
      chords: [
        [57, 60, 64, 69], // Am9
        [53, 57, 60, 65], // Fmaj7
        [55, 59, 62, 67], // G9
        [52, 55, 59, 64]  // Em7
      ],
      leadPattern: [69, 72, 76, 72, 69, 67, 65, 67],
      bassPattern: [33, 29, 31, 28],
      leadWaveform: 'sine',
      padWaveform: 'triangle',
      bassWaveform: 'triangle',
      filterCutoff: 2100,
      resonance: 4.0,
      drumType: 'tech_pulse'
    }
  },
  productividad_habitos: {
    id: 'melodia_productividad_habitos',
    nicheId: 'productividad_habitos',
    nicheName: 'Productividad y Hábitos Atómicos',
    title: 'Atomic Clockwork 128',
    subgenre: 'Clockwork Minimal Electro & Dopamine Pulse',
    bpm: 128,
    musicalKey: 'Mi menor (E minor)',
    moodDescription: 'Ritmo implacable, cero procrastinación, tick-tock de alta precisión y energía de enfoque profundo.',
    instruments: ['Percusión de Reloj Mecánico', 'Bajo Analógico Cuadrado', 'Sintetizador Arpegiado Corto', 'Pulso Electro'],
    viralSoundPrompt: 'Fast-paced productivity beat with mechanical clock-ticking texture, 128 BPM, driving electro-minimal bassline, tight arpeggiated synth stabs in E minor, hyper-focus study and habits audio.',
    viralAudioTags: ['#PomodoroBeat', '#FocusMusic', '#ProductivityHacks', '#AtomicHabits', '#DeepWorkAudio'],
    colorGradient: 'from-blue-500 to-indigo-600',
    icon: '⚡',
    synthConfig: {
      baseNote: 40, // E2
      scale: [0, 2, 3, 5, 7, 8, 10],
      chords: [
        [52, 55, 59, 64], // Em
        [48, 52, 55, 60], // C
        [50, 54, 57, 62], // D
        [47, 50, 54, 59]  // Bm
      ],
      leadPattern: [64, 67, 71, 67, 64, 67, 71, 74],
      bassPattern: [28, 24, 26, 23],
      leadWaveform: 'square',
      padWaveform: 'sawtooth',
      bassWaveform: 'sawtooth',
      filterCutoff: 1800,
      resonance: 3.2,
      drumType: 'clock_tick'
    }
  },
  psicologia_mente: {
    id: 'melodia_psicologia_mente',
    nicheId: 'psicologia_mente',
    nicheName: 'Psicología Humana y Sesgos Mentales',
    title: 'Subconscious Revelation',
    subgenre: 'Cinematic Dark Ambient & Binaural Mystery',
    bpm: 116,
    musicalKey: 'Do menor (C minor)',
    moodDescription: 'Misterioso, penetrante, intrigante. Despierta curiosidad inmediata por secretos ocultos de la mente.',
    instruments: ['Pad de Cristal Tibetano', 'Sub-Bajo Cinematográfico 40Hz', 'Marimba de Vidrio', 'Cuerdas de Suspenso'],
    viralSoundPrompt: 'Dark psychological curiosity soundtrack, 116 BPM, hypnotic glass marimba arpeggio in C minor, deep sub-bass drone, tension riser swells, cinematic mystery tone for dark psychology reels.',
    viralAudioTags: ['#DarkPsychology', '#MindHacks', '#PsychologyFacts', '#SuspenseSound', '#MysteryShorts'],
    colorGradient: 'from-purple-500 to-pink-600',
    icon: '🧠',
    synthConfig: {
      baseNote: 48, // C3
      scale: [0, 2, 3, 5, 7, 8, 11], // Harmonic minor
      chords: [
        [48, 51, 55, 58], // Cm7
        [44, 48, 51, 55], // Abmaj7
        [41, 44, 48, 51], // Fm7
        [43, 47, 50, 53]  // G7
      ],
      leadPattern: [63, 62, 60, 59, 60, 63, 67, 65],
      bassPattern: [36, 32, 29, 31],
      leadWaveform: 'sine',
      padWaveform: 'sawtooth',
      bassWaveform: 'sine',
      filterCutoff: 950,
      resonance: 5.0,
      drumType: 'deep_sub'
    }
  },
  ciencia_curiosidades: {
    id: 'melodia_ciencia_curiosidades',
    nicheId: 'ciencia_curiosidades',
    nicheName: 'Ciencia Asombrosa y Curiosidades',
    title: 'Quantum Cosmic Wonder',
    subgenre: 'Space Synthwave & Shimmering Quantum Arpeggios',
    bpm: 122,
    musicalKey: 'Fa mayor / Re menor (F/Dm)',
    moodDescription: 'Asombro puro, dimensión espacial, ondas luminosas y emoción ante el descubrimiento del universo.',
    instruments: ['Sintetizador Estelar Shimmer', 'Pulso Cósmico Senoidal', 'Campanadas Estelares', 'Pad Espacial Atmosférico'],
    viralSoundPrompt: 'Sci-fi discovery ambient soundtrack, 122 BPM, shimmering space synth arpeggios, cosmic sine pads, quantum heartbeat pulse, awe-inspiring science mystery background music for educational shorts.',
    viralAudioTags: ['#ScienceAudio', '#CosmicCuriosity', '#QuantumSound', '#SpaceMysteries', '#DidYouKnow'],
    colorGradient: 'from-cyan-500 to-blue-600',
    icon: '🔬',
    synthConfig: {
      baseNote: 53, // F3
      scale: [0, 2, 4, 5, 7, 9, 10], // Lydian / Major
      chords: [
        [53, 57, 60, 64], // Fmaj7
        [50, 53, 57, 60], // Dm7
        [46, 50, 53, 57], // Bbmaj7
        [48, 52, 55, 60]  // C
      ],
      leadPattern: [69, 72, 76, 77, 76, 72, 69, 65],
      bassPattern: [41, 38, 34, 36],
      leadWaveform: 'triangle',
      padWaveform: 'sine',
      bassWaveform: 'triangle',
      filterCutoff: 2400,
      resonance: 3.5,
      drumType: 'cosmic_sparkle'
    }
  },
  tecnologia_ia: {
    id: 'melodia_tecnologia_ia',
    nicheId: 'tecnologia_ia',
    nicheName: 'Tecnología e Inteligencia Artificial',
    title: 'Cyber Matrix Flow',
    subgenre: 'Cyberpunk Future Glitch & High-Tech Bass',
    bpm: 130,
    musicalKey: 'Fa sostenido menor (F# minor)',
    moodDescription: 'Vanguardia digital, pulso computacional, algoritmos en acción y velocidad de procesamiento futurista.',
    instruments: ['Sintetizador Sawtooth Pluck', 'Bajo Cyberpunk Phat', 'Glitch Digital Sincopado', 'Vocoder Armónico'],
    viralSoundPrompt: 'Cyberpunk high-tech synthwave, 130 BPM, rhythmic digital glitch stabs, deep future bass in F# minor, neon cybernetic arpeggios, cutting-edge AI and coding tutorial background track.',
    viralAudioTags: ['#TechAudio', '#AIBeat', '#CyberpunkFlow', '#FutureTech', '#CodingMusic'],
    colorGradient: 'from-indigo-500 to-violet-600',
    icon: '🤖',
    synthConfig: {
      baseNote: 42, // F#2
      scale: [0, 2, 3, 5, 7, 8, 10],
      chords: [
        [54, 57, 61, 66], // F#m
        [50, 54, 57, 62], // D
        [52, 56, 59, 64], // E
        [49, 52, 56, 61]  // C#m
      ],
      leadPattern: [66, 69, 73, 69, 73, 76, 73, 69],
      bassPattern: [30, 26, 28, 25],
      leadWaveform: 'sawtooth',
      padWaveform: 'square',
      bassWaveform: 'sawtooth',
      filterCutoff: 2800,
      resonance: 4.8,
      drumType: 'tech_pulse'
    }
  },
  historia_cultura: {
    id: 'melodia_historia_cultura',
    nicheId: 'historia_cultura',
    nicheName: 'Historia y Cultura Express',
    title: 'Chronicles of Empires',
    subgenre: 'Cinematic Historical Drama & Orchestral War Drums',
    bpm: 118,
    musicalKey: 'Sol menor (G minor)',
    moodDescription: 'Épico, solemne, dramático e histórico. Rememora grandes batallas, emperadores y secretos ancestrales.',
    instruments: ['Timbales Orquestales de Guerra', 'Cuerdas Dramáticas Spiccato', 'Vientos Ancestrales', 'Gong de Bronce'],
    viralSoundPrompt: 'Epic cinematic history documentary soundtrack, 118 BPM, powerful orchestral war drums in G minor, dramatic tension strings crescendo, ancient brass horns, gripping history storytelling audio.',
    viralAudioTags: ['#HistoryShorts', '#EpicChronicle', '#AncientEmpires', '#DocumentaryMusic', '#HistoryFacts'],
    colorGradient: 'from-amber-600 to-yellow-600',
    icon: '📚',
    synthConfig: {
      baseNote: 43, // G2
      scale: [0, 2, 3, 5, 7, 8, 10],
      chords: [
        [55, 58, 62, 67], // Gm
        [51, 55, 58, 63], // Eb
        [46, 50, 53, 58], // Bb
        [48, 53, 57, 60]  // F
      ],
      leadPattern: [67, 70, 74, 70, 67, 65, 63, 65],
      bassPattern: [31, 27, 22, 24],
      leadWaveform: 'sawtooth',
      padWaveform: 'sawtooth',
      bassWaveform: 'triangle',
      filterCutoff: 1200,
      resonance: 2.0,
      drumType: 'epic_thump'
    }
  },
  salud_bienestar: {
    id: 'melodia_salud_bienestar',
    nicheId: 'salud_bienestar',
    nicheName: 'Salud y Bienestar Rápido',
    title: 'Vital Resonance 432Hz',
    subgenre: 'Organic Chillwave & Healing Breathing Flow',
    bpm: 112,
    musicalKey: 'Sol mayor (G major)',
    moodDescription: 'Revitalizante, orgánico, oxigenante y anti-estrés. Armonizado a frecuencias naturales de bienestar.',
    instruments: ['Piano Orgánico Cálido', 'Ondas Senoidales Alfa 432Hz', 'Bajo Acústico Redondo', 'Sonidos de Viento y Agua'],
    viralSoundPrompt: '432Hz healing wellness lo-fi chillwave, 112 BPM, warm organic acoustic piano in G major, deep breathing cycle rhythm, calm vital energy for health hacks and biohacking shorts.',
    viralAudioTags: ['#WellnessAudio', '#432HzHealing', '#HealthHacks', '#VitalEnergy', '#BiohackingShorts'],
    colorGradient: 'from-emerald-400 to-teal-500',
    icon: '🌿',
    synthConfig: {
      baseNote: 43,
      scale: [0, 2, 4, 5, 7, 9, 11],
      chords: [
        [55, 59, 62, 67], // G
        [52, 55, 59, 64], // Em
        [48, 52, 55, 60], // C
        [50, 54, 57, 62]  // D
      ],
      leadPattern: [67, 71, 74, 71, 67, 64, 62, 64],
      bassPattern: [31, 28, 24, 26],
      leadWaveform: 'sine',
      padWaveform: 'triangle',
      bassWaveform: 'sine',
      filterCutoff: 1100,
      resonance: 1.8,
      drumType: 'lofi_tick'
    }
  },
  fe_espiritualidad: {
    id: 'melodia_fe_espiritualidad',
    nicheId: 'fe_espiritualidad',
    nicheName: 'Miniserie de Fe, Oración y Milagros',
    title: 'Divine Grace & Restoration 432Hz',
    subgenre: 'Worship Cinematic Ambient & Celestial Sacred Strings',
    bpm: 108,
    musicalKey: 'Re mayor (D major / 432Hz)',
    moodDescription: 'Sobrenatural, conmovedor, tierno y glorioso. Acompaña teofanías de Jesús, quebranto y lágrimas de fe.',
    instruments: ['Piano de Cola Reverberante 432Hz', 'Cuerdas Celestes Cinemáticas', 'Arpa Sagrada', 'Campana Ecos de Gloria'],
    viralSoundPrompt: 'Cinematic sacred worship ambient in 432Hz tuning, 108 BPM, emotional weeping piano and swelling celestial strings in D major, peaceful divine tears and miracle atmosphere for Christian serial miniseries.',
    viralAudioTags: ['#WorshipPiano', '#432Hz', '#MiniserieDeFe', '#JesusEsReal', '#MilagroDeDios'],
    colorGradient: 'from-amber-400 to-yellow-600',
    icon: '✝️',
    synthConfig: {
      baseNote: 50, // D3
      scale: [0, 2, 4, 5, 7, 9, 11], // Major
      chords: [
        [50, 54, 57, 62], // D
        [43, 47, 50, 55], // G
        [47, 50, 54, 59], // Bm
        [45, 49, 52, 57]  // A
      ],
      leadPattern: [62, 66, 69, 74, 71, 69, 66, 62],
      bassPattern: [38, 31, 35, 33],
      leadWaveform: 'triangle',
      padWaveform: 'sine',
      bassWaveform: 'triangle',
      filterCutoff: 1300,
      resonance: 2.2,
      drumType: 'worship_chime'
    }
  }
};

// Aliases for quick lookup
export function getMelodyForNiche(nicheKey: string): NicheMelodySpec {
  const clean = (nicheKey || '').toLowerCase().trim();
  if (NICHE_MELODIES[clean]) return NICHE_MELODIES[clean];
  if (clean.includes('venta') || clean.includes('negocio')) return NICHE_MELODIES.ventas_negocios;
  if (clean.includes('finanza') || clean.includes('dinero')) return NICHE_MELODIES.finanzas_dinero;
  if (clean.includes('productiv') || clean.includes('habito')) return NICHE_MELODIES.productividad_habitos;
  if (clean.includes('psicolog') || clean.includes('mente')) return NICHE_MELODIES.psicologia_mente;
  if (clean.includes('ciencia') || clean.includes('curiosidad')) return NICHE_MELODIES.ciencia_curiosidades;
  if (clean.includes('tecno') || clean.includes('ia') || clean.includes('inteligencia')) return NICHE_MELODIES.tecnologia_ia;
  if (clean.includes('historia') || clean.includes('cultura')) return NICHE_MELODIES.historia_cultura;
  if (clean.includes('salud') || clean.includes('bienestar')) return NICHE_MELODIES.salud_bienestar;
  if (clean.includes('fe') || clean.includes('jesus') || clean.includes('cristo') || clean.includes('oracion') || clean.includes('milagro')) return NICHE_MELODIES.fe_espiritualidad;
  return NICHE_MELODIES.ventas_negocios;
}

// Convert MIDI note number to Frequency in Hz (A4 = 440Hz, or 432Hz for spiritual)
function midiToFreq(midiNote: number, baseA4 = 440): number {
  return baseA4 * Math.pow(2, (midiNote - 69) / 12);
}

// Global Synthesizer State
class WebAudioNicheSynthesizer {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private activeNicheId: string | null = null;
  private masterGain: GainNode | null = null;
  private currentVolume = 0.25; // Default safe background mix volume (-12dB)
  private loopIntervalId: any = null;
  private activeOscillators: OscillatorNode[] = [];

  private initContext(): AudioContext {
    if (!this.ctx || this.ctx.state === 'closed') {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtxClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public playNiche(nicheKey: string, volume = 0.25): boolean {
    try {
      this.stop();
      const spec = getMelodyForNiche(nicheKey);
      const ctx = this.initContext();
      this.currentVolume = Math.max(0.01, Math.min(1.0, volume));

      // Master Gain Node
      this.masterGain = ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.currentVolume, ctx.currentTime);
      this.masterGain.connect(ctx.destination);

      // Lowpass Filter for warm studio mastering
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(spec.synthConfig.filterCutoff, ctx.currentTime);
      filter.Q.setValueAtTime(spec.synthConfig.resonance, ctx.currentTime);
      filter.connect(this.masterGain);

      this.isPlaying = true;
      this.activeNicheId = spec.nicheId;

      const baseA4 = spec.nicheId === 'fe_espiritualidad' ? 432 : 440;
      const beatDurationSec = 60 / spec.bpm;
      const barDurationSec = beatDurationSec * 4;
      const chords = spec.synthConfig.chords;
      const leadNotes = spec.synthConfig.leadPattern;
      const bassNotes = spec.synthConfig.bassPattern;

      let currentBar = 0;
      let stepIndex = 0;

      const scheduleLoopCycle = () => {
        if (!this.isPlaying || !this.ctx || this.ctx.state === 'closed') return;
        const now = this.ctx.currentTime;

        // 1. Play Pad / Chord of current bar
        const chordNotes = chords[currentBar % chords.length];
        chordNotes.forEach((midi, idx) => {
          const osc = ctx.createOscillator();
          const chordGain = ctx.createGain();
          osc.type = spec.synthConfig.padWaveform;
          osc.frequency.setValueAtTime(midiToFreq(midi, baseA4), now);

          // Gentle ADSR envelope for pad
          chordGain.gain.setValueAtTime(0.001, now);
          chordGain.gain.exponentialRampToValueAtTime(0.06 / (idx + 1), now + 0.3);
          chordGain.gain.exponentialRampToValueAtTime(0.04 / (idx + 1), now + barDurationSec - 0.2);
          chordGain.gain.exponentialRampToValueAtTime(0.0001, now + barDurationSec);

          osc.connect(chordGain);
          chordGain.connect(filter);
          osc.start(now);
          osc.stop(now + barDurationSec);
          this.activeOscillators.push(osc);
        });

        // 2. Play Bass note
        const bassMidi = bassNotes[currentBar % bassNotes.length];
        const bassOsc = ctx.createOscillator();
        const bassGain = ctx.createGain();
        bassOsc.type = spec.synthConfig.bassWaveform;
        bassOsc.frequency.setValueAtTime(midiToFreq(bassMidi, baseA4), now);

        bassGain.gain.setValueAtTime(0.001, now);
        bassGain.gain.exponentialRampToValueAtTime(0.12, now + 0.05);
        bassGain.gain.exponentialRampToValueAtTime(0.08, now + barDurationSec * 0.8);
        bassGain.gain.exponentialRampToValueAtTime(0.0001, now + barDurationSec);

        bassOsc.connect(bassGain);
        bassGain.connect(filter);
        bassOsc.start(now);
        bassOsc.stop(now + barDurationSec);
        this.activeOscillators.push(bassOsc);

        // 3. Play Arpeggiated Lead Melody (4 notes per bar)
        for (let i = 0; i < 4; i++) {
          const noteTime = now + (i * beatDurationSec);
          const leadMidi = leadNotes[(stepIndex + i) % leadNotes.length];
          const leadOsc = ctx.createOscillator();
          const leadGain = ctx.createGain();

          leadOsc.type = spec.synthConfig.leadWaveform;
          leadOsc.frequency.setValueAtTime(midiToFreq(leadMidi, baseA4), noteTime);

          leadGain.gain.setValueAtTime(0.001, noteTime);
          leadGain.gain.exponentialRampToValueAtTime(0.08, noteTime + 0.04);
          leadGain.gain.exponentialRampToValueAtTime(0.0001, noteTime + beatDurationSec * 0.85);

          leadOsc.connect(leadGain);
          leadGain.connect(filter);
          leadOsc.start(noteTime);
          leadOsc.stop(noteTime + beatDurationSec);
          this.activeOscillators.push(leadOsc);

          // 4. Subtle percussive tick/groove
          this.triggerPercussion(ctx, filter, noteTime, spec.synthConfig.drumType, i === 0);
        }

        currentBar++;
        stepIndex = (stepIndex + 4) % leadNotes.length;
      };

      // Schedule immediately
      scheduleLoopCycle();
      // Repeat per bar
      this.loopIntervalId = setInterval(scheduleLoopCycle, barDurationSec * 1000);
      return true;
    } catch (err) {
      console.warn('[NicheMelodyEngine] Could not start audio context:', err);
      return false;
    }
  }

  private triggerPercussion(
    ctx: AudioContext,
    destination: AudioNode,
    time: number,
    drumType: string,
    isDownbeat: boolean
  ) {
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (drumType === 'clock_tick') {
        // High click like a clock or stopwatch
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(isDownbeat ? 1800 : 1200, time);
        gain.gain.setValueAtTime(0.04, time);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.03);
      } else if (drumType === 'tech_pulse') {
        // Digital pop
        osc.type = 'square';
        osc.frequency.setValueAtTime(isDownbeat ? 240 : 480, time);
        gain.gain.setValueAtTime(0.03, time);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.04);
      } else if (drumType === 'worship_chime') {
        // Crystalline golden chime on downbeat
        if (isDownbeat) {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(1760, time); // A6
          gain.gain.setValueAtTime(0.05, time);
          gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.9);
        } else {
          return;
        }
      } else if (drumType === 'epic_thump') {
        // Low cinematic timpani thump
        if (isDownbeat) {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(80, time);
          osc.frequency.exponentialRampToValueAtTime(35, time + 0.25);
          gain.gain.setValueAtTime(0.15, time);
          gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.35);
        } else {
          return;
        }
      } else {
        // Standard gentle lo-fi tick / hi-hat
        osc.type = 'sine';
        osc.frequency.setValueAtTime(isDownbeat ? 120 : 600, time);
        gain.gain.setValueAtTime(isDownbeat ? 0.06 : 0.02, time);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.05);
      }

      osc.connect(gain);
      gain.connect(destination);
      osc.start(time);
      osc.stop(time + 0.5);
      this.activeOscillators.push(osc);
    } catch {
      // Ignore audio timing glitches
    }
  }

  public setVolume(vol: number) {
    this.currentVolume = Math.max(0, Math.min(1.0, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.currentVolume, this.ctx.currentTime);
    }
  }

  public setMuted(muted: boolean) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : this.currentVolume, this.ctx.currentTime);
    }
  }

  public pause() {
    this.stop();
  }

  public stop() {
    this.isPlaying = false;
    this.activeNicheId = null;

    if (this.loopIntervalId) {
      clearInterval(this.loopIntervalId);
      this.loopIntervalId = null;
    }

    try {
      this.activeOscillators.forEach(osc => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {
          // already stopped
        }
      });
      this.activeOscillators = [];

      if (this.masterGain) {
        this.masterGain.disconnect();
        this.masterGain = null;
      }
    } catch {
      // Ignore cleanup error
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getActiveNicheId(): string | null {
    return this.activeNicheId;
  }

  public getVolume(): number {
    return this.currentVolume;
  }
}

// Global Singleton Instance
export const nicheMelodyEngine = new WebAudioNicheSynthesizer();
