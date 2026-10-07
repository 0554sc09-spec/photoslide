// Ambient BGM sound generator via Web Audio API
// Generates gentle, calming background harmonies for classroom memories

class AmbientSynthesizer {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isRunning: boolean = false;
  private timerId: number | null = null;
  private currentPreset: string = 'none';
  private volume: number = 0.6;
  private isMuted: boolean = false;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume * 0.35, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      const target = this.isMuted ? 0 : this.volume * 0.35;
      this.masterGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.05);
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      const target = this.isMuted ? 0 : this.volume * 0.35;
      this.masterGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.05);
    }
  }

  public playPreset(preset: 'warm_piano' | 'gentle_acoustic' | 'music_box') {
    this.stop();
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    this.isRunning = true;
    this.currentPreset = preset;

    if (preset === 'warm_piano') {
      this.startPianoSequence();
    } else if (preset === 'gentle_acoustic') {
      this.startAcousticSequence();
    } else if (preset === 'music_box') {
      this.startMusicBoxSequence();
    }
  }

  public stop() {
    this.isRunning = false;
    this.currentPreset = 'none';
    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  public isPresetPlaying(): boolean {
    return this.isRunning;
  }

  // Piano-like warm chime sequence
  private startPianoSequence() {
    if (!this.ctx || !this.isRunning) return;

    // F Major Pentatonic / nostalgic school chord progression: F - C - Dm - Bb
    const chords = [
      [349.23, 440.0, 523.25, 698.46], // F4, A4, C5, F5
      [261.63, 329.63, 392.0, 523.25], // C4, E4, G4, C5
      [293.66, 349.23, 440.0, 587.33], // D4, F4, A4, D5
      [233.08, 349.23, 466.16, 587.33], // Bb3, F4, Bb4, D5
    ];

    let chordIdx = 0;
    let step = 0;

    const playNext = () => {
      if (!this.ctx || !this.isRunning) return;

      const currentChord = chords[chordIdx];
      const freq = currentChord[step % currentChord.length];

      this.triggerTone(freq, 2.8, 'sine', 0.25, true);

      // Play soft bass note on downbeat
      if (step === 0) {
        this.triggerTone(freq * 0.5, 3.5, 'triangle', 0.28, false);
      }

      step++;
      if (step >= currentChord.length) {
        step = 0;
        chordIdx = (chordIdx + 1) % chords.length;
      }

      this.timerId = window.setTimeout(playNext, 850);
    };

    playNext();
  }

  // Gentle acoustic guitar style arpeggio
  private startAcousticSequence() {
    if (!this.ctx || !this.isRunning) return;

    // C major gentle chord tones (C - G/B - Am - F)
    const chords = [
      [261.63, 329.63, 392.0, 523.25, 659.25], // C
      [246.94, 293.66, 392.0, 493.88, 587.33], // G/B
      [220.0, 261.63, 329.63, 440.0, 523.25],  // Am
      [174.61, 261.63, 349.23, 440.0, 523.25], // F
    ];

    let chordIdx = 0;
    let noteIdx = 0;

    const playNext = () => {
      if (!this.ctx || !this.isRunning) return;

      const currentChord = chords[chordIdx];
      const freq = currentChord[noteIdx];

      this.triggerTone(freq, 1.8, 'triangle', 0.22, false);

      noteIdx++;
      if (noteIdx >= currentChord.length) {
        noteIdx = 0;
        chordIdx = (chordIdx + 1) % chords.length;
      }

      this.timerId = window.setTimeout(playNext, 620);
    };

    playNext();
  }

  // Sparkling gentle music box tone
  private startMusicBoxSequence() {
    if (!this.ctx || !this.isRunning) return;

    // Canon in D / nostalgic melody notes (D5, A4, B4, F#4, G4, D4, G4, A4)
    const melody = [
      587.33, 440.0, 493.88, 369.99,
      392.0, 293.66, 392.0, 440.0,
      659.25, 587.33, 523.25, 440.0,
      493.88, 440.0, 392.0, 440.0
    ];

    let noteIdx = 0;

    const playNext = () => {
      if (!this.ctx || !this.isRunning) return;

      const freq = melody[noteIdx];
      // Music box: high, pure bell-like sine with short decay
      this.triggerTone(freq * 1.5, 1.2, 'sine', 0.2, true);
      if (noteIdx % 2 === 0) {
        this.triggerTone(freq * 0.75, 1.8, 'sine', 0.12, false);
      }

      noteIdx = (noteIdx + 1) % melody.length;
      this.timerId = window.setTimeout(playNext, 720);
    };

    playNext();
  }

  private triggerTone(
    freq: number,
    duration: number,
    type: OscillatorType,
    velocity: number,
    addHarmonic: boolean
  ) {
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);

      // Smooth attack and decay envelope
      noteGain.gain.setValueAtTime(0.0001, now);
      noteGain.gain.exponentialRampToValueAtTime(velocity, now + 0.04);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(noteGain);
      noteGain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + duration);

      // Add gentle octave shimmer
      if (addHarmonic) {
        const osc2 = this.ctx.createOscillator();
        const noteGain2 = this.ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(freq * 2, now);

        noteGain2.gain.setValueAtTime(0.0001, now);
        noteGain2.gain.exponentialRampToValueAtTime(velocity * 0.3, now + 0.03);
        noteGain2.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.7);

        osc2.connect(noteGain2);
        noteGain2.connect(this.masterGain);

        osc2.start(now);
        osc2.stop(now + duration * 0.7);
      }
    } catch {
      // AudioContext could be closed or error handled gracefully
    }
  }
}

export const ambientSynth = new AmbientSynthesizer();
