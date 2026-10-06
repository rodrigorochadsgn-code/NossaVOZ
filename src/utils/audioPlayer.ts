/**
 * Audio helpers for D'ARCO Northeastern Locutor Studio
 */

export function base64ToBlob(base64: string, mimeType = 'audio/wav'): Blob {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return new Blob([bytes], { type: mimeType });
}

export function downloadWav(base64: string, filename = 'darco-locucao-nordestina.wav') {
  const blob = base64ToBlob(base64, 'audio/wav');
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Background acoustic soundscape generator using Web Audio
// Provides subtle warm studio vintage tone or gentle acoustic cordel arpeggio for radio feel
export class StudioAmbience {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private gainNode: GainNode | null = null;
  private intervalId: number | null = null;

  start(volume = 0.15) {
    if (this.isPlaying) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(volume, this.ctx.currentTime);
      this.gainNode.connect(this.ctx.destination);
      this.isPlaying = true;

      // Gentle folk/cordel guitar arpeggio in D major (D, F#, A, B, E)
      const notes = [146.83, 220.0, 277.18, 293.66, 369.99, 440.0];
      let step = 0;

      this.intervalId = window.setInterval(() => {
        if (!this.ctx || !this.gainNode || !this.isPlaying) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();

        // Warm triangle sound
        osc.type = 'triangle';
        const freq = notes[step % notes.length];
        step = (step + 1) % notes.length;
        osc.frequency.setValueAtTime(freq, now);

        noteGain.gain.setValueAtTime(0.001, now);
        noteGain.gain.exponentialRampToValueAtTime(0.08, now + 0.05);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

        osc.connect(noteGain);
        noteGain.connect(this.gainNode);

        osc.start(now);
        osc.stop(now + 1.3);
      }, 700);
    } catch (e) {
      console.warn('AudioContext not supported or blocked:', e);
    }
  }

  setVolume(vol: number) {
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(Math.max(0, Math.min(1, vol)), this.ctx.currentTime);
    }
  }

  stop() {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.ctx) {
      this.ctx.close().catch(() => {});
      this.ctx = null;
      this.gainNode = null;
    }
  }

  get active() {
    return this.isPlaying;
  }
}
