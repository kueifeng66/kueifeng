/**
 * Procedural Pyrotechnic Acoustics & Festive Music Controller.
 * Audio never autoplays; all synthesis and playback require explicit user activation.
 */
class CelestialAudio {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.noiseBuffer = null;

    this.sfxEnabled = false;
    this.musicEnabled = false;
    this.volume = 0.55;

    this.musicEl = null;
    this.musicFadeRaf = 0;
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.volume;
      this.masterGain.connect(this.ctx.destination);
      this.noiseBuffer = this.createNoiseBuffer(2.0);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  createNoiseBuffer(seconds) {
    const rate = this.ctx.sampleRate;
    const length = Math.floor(rate * seconds);
    const buffer = this.ctx.createBuffer(1, length, rate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  getTargetMusicVolume() {
    return Math.max(0, Math.min(1, this.volume * 0.85));
  }

  fadeMusicVolume(targetVol, durationMs, onDone) {
    if (!this.musicEl) return;
    if (this.musicFadeRaf) {
      cancelAnimationFrame(this.musicFadeRaf);
      this.musicFadeRaf = 0;
    }
    const startVol = this.musicEl.volume;
    const startTime = performance.now();
    const step = (now) => {
      if (!this.musicEl) return;
      const t = Math.min(1, (now - startTime) / Math.max(1, durationMs));
      this.musicEl.volume = Math.max(0, Math.min(1, startVol + (targetVol - startVol) * t));
      if (t < 1) {
        this.musicFadeRaf = requestAnimationFrame(step);
      } else {
        this.musicFadeRaf = 0;
        if (onDone) onDone();
      }
    };
    this.musicFadeRaf = requestAnimationFrame(step);
  }

  setVolume(normValue) {
    this.volume = Math.max(0, Math.min(1, normValue));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.04);
    }
    if (this.musicEl && this.musicEnabled) {
      if (this.musicFadeRaf) {
        cancelAnimationFrame(this.musicFadeRaf);
        this.musicFadeRaf = 0;
      }
      this.musicEl.volume = this.getTargetMusicVolume();
    }
  }

  setSfxEnabled(enabled) {
    this.sfxEnabled = Boolean(enabled);
    if (this.sfxEnabled) {
      this.ensureContext();
    }
  }

  async setMusicEnabled(enabled) {
    this.musicEnabled = Boolean(enabled);

    if (!this.musicEl) {
      // Play natively without createMediaElementSource so file:// origins never mute output
      this.musicEl = new Audio('./background.mp3');
      this.musicEl.loop = true;
      this.musicEl.preload = 'auto';
      this.musicEl.volume = 0;
    }

    if (this.musicEnabled) {
      try {
        await this.musicEl.play();
        this.fadeMusicVolume(this.getTargetMusicVolume(), 500);
        return true;
      } catch {
        this.musicEnabled = false;
        return false;
      }
    } else {
      this.fadeMusicVolume(0, 320, () => {
        if (!this.musicEnabled && this.musicEl) {
          this.musicEl.pause();
        }
      });
      return false;
    }
  }

  playLaunch(pan = 0) {
    if (!this.sfxEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.noiseBuffer) return;

    const now = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 3.6;
    filter.frequency.setValueAtTime(650 + Math.random() * 200, now);
    filter.frequency.exponentialRampToValueAtTime(2200, now + 0.42);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.07, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.48);

    const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    if (panner) {
      panner.pan.value = Math.max(-0.85, Math.min(0.85, pan));
      src.connect(filter).connect(gain).connect(panner).connect(this.masterGain);
    } else {
      src.connect(filter).connect(gain).connect(this.masterGain);
    }

    src.start(now, Math.random() * 0.5, 0.5);
  }

  playBurst(intensity = 1, pan = 0) {
    if (!this.sfxEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.noiseBuffer) return;

    const now = ctx.currentTime;
    const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    const out = panner || this.masterGain;
    if (panner) {
      panner.pan.value = Math.max(-0.85, Math.min(0.85, pan));
      panner.connect(this.masterGain);
    }

    // 1. Sub-bass thump
    const sub = ctx.createOscillator();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(108 + Math.random() * 26, now);
    sub.frequency.exponentialRampToValueAtTime(32, now + 0.45);

    const subGain = ctx.createGain();
    subGain.gain.setValueAtTime(0.28 * intensity, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.52);
    sub.connect(subGain).connect(out);
    sub.start(now);
    sub.stop(now + 0.55);

    // 2. Warm skyline shockwave noise
    const boom = ctx.createBufferSource();
    boom.buffer = this.noiseBuffer;

    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(1450, now);
    lowpass.frequency.exponentialRampToValueAtTime(210, now + 0.85);

    const boomGain = ctx.createGain();
    boomGain.gain.setValueAtTime(0.22 * intensity, now);
    boomGain.gain.exponentialRampToValueAtTime(0.001, now + 0.95);

    boom.connect(lowpass).connect(boomGain).connect(out);
    boom.start(now, Math.random() * 0.4, 1.0);

    // 3. Distant crackle sparkles
    const crackleCount = intensity > 1 ? 5 : 3;
    for (let i = 0; i < crackleCount; i++) {
      const delay = 0.08 + Math.random() * 0.42;
      const pop = ctx.createBufferSource();
      pop.buffer = this.noiseBuffer;
      const hp = ctx.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.value = 2400 + Math.random() * 1400;
      const popGain = ctx.createGain();
      popGain.gain.setValueAtTime(0.001, now + delay);
      popGain.gain.linearRampToValueAtTime(0.045 * intensity, now + delay + 0.01);
      popGain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.09);
      pop.connect(hp).connect(popGain).connect(out);
      pop.start(now + delay, Math.random() * 1.2, 0.11);
    }
  }

  playLanternChime() {
    if (!this.sfxEnabled && !this.musicEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [587.33, 739.99, 880.0, 1174.66]; // D5, F#5, A5, D6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.value = freq;

      const gain = ctx.createGain();
      const start = now + idx * 0.09;
      gain.gain.setValueAtTime(0.001, start);
      gain.gain.linearRampToValueAtTime(0.085, start + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0008, start + 1.35);

      osc.connect(gain).connect(this.masterGain);
      osc.start(start);
      osc.stop(start + 1.4);
    });
  }
}

window.CelestialAudio = CelestialAudio;
