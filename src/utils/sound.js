// Web Audio API Sound Synthesizer (Zero external audio files, 100% offline, zero latency)

class SoundFX {
  constructor() {
    this.ctx = null;
    this.muted = localStorage.getItem('hmx_muted') === 'true';
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  isMuted() {
    return this.muted;
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem('hmx_muted', this.muted);
    return this.muted;
  }

  // Simple, pleasant, tactile click (like a subtle iOS / mechanical haptic pop)
  playClick() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const now = this.ctx.currentTime;
      // High-to-low crisp click
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.035);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  // Pleasant dual-tone chime when publishing a book or logging in
  playSuccess() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const now = this.ctx.currentTime;
      
      [
        { freq: 523.25, time: 0 },    // C5
        { freq: 659.25, time: 0.08 }, // E5
        { freq: 783.99, time: 0.16 }  // G5
      ].forEach(({ freq, time }) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + time);

        gain.gain.setValueAtTime(0.06, now + time);
        gain.gain.exponentialRampToValueAtTime(0.001, now + time + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + time);
        osc.stop(now + time + 0.28);
      });
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }
}

export const sound = new SoundFX();
