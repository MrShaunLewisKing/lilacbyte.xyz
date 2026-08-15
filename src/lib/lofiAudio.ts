// Subtle aesthetic procedural lo-fi ambient audio player

class LofiAudioPlayer {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private timer: ReturnType<typeof setInterval> | null = null;
  private gainNode: GainNode | null = null;

  private init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(0.12, this.ctx.currentTime);
      this.gainNode.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playNote(freq: number) {
    try {
      this.init();
      if (!this.ctx || !this.gainNode) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      noteGain.gain.setValueAtTime(0, now);
      noteGain.gain.linearRampToValueAtTime(0.15, now + 0.05);
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc.connect(noteGain);
      noteGain.connect(this.gainNode);

      osc.start(now);
      osc.stop(now + 1.2);
    } catch {}
  }

  public toggle(): boolean {
    this.isPlaying = !this.isPlaying;
    if (this.isPlaying) {
      this.init();
      const scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25]; // C major pentatonic
      this.playNote(329.63);
      this.timer = setInterval(() => {
        const note = scale[Math.floor(Math.random() * scale.length)];
        this.playNote(note);
      }, 1800);
    } else {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    }
    return this.isPlaying;
  }

  public getStatus(): boolean {
    return this.isPlaying;
  }
}

export const lofiAudio = new LofiAudioPlayer();
