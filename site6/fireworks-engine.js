/**
 * Artisan Pyrotechnics Engine
 * Physics-driven rockets, 6 shell geometries, 3D-tilted rings, illuminated smoke puffs,
 * and dynamic light emitters for environmental sky/skyline/water illumination.
 */
class PyrotechnicsEngine {
  constructor(audio) {
    this.audio = audio;
    this.rockets = [];
    this.sparks = [];
    this.smoke = [];
    this.flashes = [];

    this.width = 1280;
    this.height = 720;
    this.horizonY = 580;

    this.finaleMode = false;
    this.autoTimer = 0.6;
    this.nextSalvoTimer = 0;

    this.palettes = [
      { name: 'Imperial Gold', primary: 42, secondary: 28, sat: 96 },
      { name: 'Vermilion Ember', primary: 10, secondary: 38, sat: 94 },
      { name: 'Celestial Jade', primary: 172, secondary: 44, sat: 88 },
      { name: 'Sapphire Crown', primary: 214, secondary: 45, sat: 92 },
      { name: 'Plum Blossom', primary: 342, secondary: 40, sat: 90 },
    ];
  }

  resize(width, height, horizonY) {
    this.width = width;
    this.height = height;
    this.horizonY = horizonY;
  }

  setFinaleMode(enabled) {
    this.finaleMode = Boolean(enabled);
    if (this.finaleMode) {
      this.launchVolley(4);
    }
  }

  launchVolley(count = 3) {
    for (let i = 0; i < count; i++) {
      const delay = i * 160;
      setTimeout(() => {
        const tx = this.width * (0.14 + Math.random() * 0.72);
        const ty = this.height * (0.13 + Math.random() * 0.34);
        this.launchRocket(tx, ty, { forceBig: i === count - 1 });
      }, delay);
    }
  }

  launchRocket(targetX, targetY, options = {}) {
    const startX =
      options.startX ??
      Math.max(
        this.width * 0.08,
        Math.min(this.width * 0.92, targetX + (Math.random() - 0.5) * this.width * 0.16)
      );
    const startY = this.horizonY + 8;

    const clampedTargetY = Math.max(this.height * 0.08, Math.min(this.horizonY - 90, targetY));
    const dx = targetX - startX;
    const dy = clampedTargetY - startY;
    const dist = Math.hypot(dx, dy);
    const duration = Math.max(0.58, Math.min(1.15, dist / 640));

    const palette =
      options.palette || this.palettes[Math.floor(Math.random() * this.palettes.length)];
    const types = ['chrysanthemum', 'willow', 'ring', 'palm', 'brocade', 'blossom'];
    const shellType =
      options.shellType ||
      (options.forceBig
        ? ['chrysanthemum', 'willow', 'blossom'][Math.floor(Math.random() * 3)]
        : types[Math.floor(Math.random() * types.length)]);

    this.rockets.push({
      x: startX,
      y: startY,
      startX,
      startY,
      targetX,
      targetY: clampedTargetY,
      elapsed: 0,
      duration,
      arcOffset: (Math.random() - 0.5) * 34,
      trail: [],
      palette,
      shellType,
      scale: options.forceBig ? 1.24 : 0.85 + Math.random() * 0.36,
    });

    // Shoreline barge muzzle flash & warm ignition puff
    this.flashes.push({
      x: startX,
      y: this.horizonY - 4,
      hue: 36,
      radius: 42,
      alpha: 0.45,
      ringRadius: 2,
      maxRingRadius: 24,
    });
    this.smoke.push({
      x: startX,
      y: this.horizonY - 6,
      vx: 8,
      vy: -14,
      radius: 16,
      alpha: 0.14,
      hue: 36,
    });

    if (this.audio) {
      const pan = (startX / Math.max(1, this.width)) * 2 - 1;
      this.audio.playLaunch(pan);
    }
  }

  explode(rocket) {
    const { targetX: x, targetY: y, palette, shellType, scale } = rocket;

    // Register environmental light flash
    this.flashes.push({
      x,
      y,
      hue: palette.primary,
      radius: Math.min(this.width, this.height) * (0.42 * scale),
      alpha: 0.92,
      ringRadius: 8,
      maxRingRadius: 115 * scale,
    });

    // Illuminated smoke puffs
    const smokeCount = 5;
    for (let i = 0; i < smokeCount; i++) {
      const ang = Math.random() * Math.PI * 2;
      const rad = Math.random() * 26 * scale;
      this.smoke.push({
        x: x + Math.cos(ang) * rad,
        y: y + Math.sin(ang) * rad,
        vx: 10 + Math.random() * 14,
        vy: -4 - Math.random() * 8,
        radius: (26 + Math.random() * 24) * scale,
        alpha: 0.16,
        hue: palette.primary,
      });
    }

    if (this.audio) {
      const pan = (x / Math.max(1, this.width)) * 2 - 1;
      this.audio.playBurst(scale, pan);
    }

    if (shellType === 'chrysanthemum') {
      this.spawnChrysanthemum(x, y, palette, scale);
    } else if (shellType === 'willow') {
      this.spawnWillow(x, y, palette, scale);
    } else if (shellType === 'ring') {
      this.spawnTiltedRings(x, y, palette, scale);
    } else if (shellType === 'palm') {
      this.spawnPalm(x, y, palette, scale);
    } else if (shellType === 'brocade') {
      this.spawnBrocade(x, y, palette, scale);
    } else {
      this.spawnBlossom(x, y, palette, scale);
    }
  }

  addSpark(cfg) {
    this.sparks.push({
      x: cfg.x,
      y: cfg.y,
      vx: cfg.vx,
      vy: cfg.vy,
      drag: cfg.drag ?? 0.962,
      gravity: cfg.gravity ?? 88,
      hue: cfg.hue,
      sat: cfg.sat ?? 92,
      light: cfg.light ?? 68,
      size: cfg.size ?? 2.0,
      alpha: 1,
      decay: cfg.decay ?? 0.65,
      strobe: cfg.strobe ?? false,
      strobePhase: Math.random() * 12,
      splitAt: cfg.splitAt ?? null,
      age: 0,
      trail: [],
      maxTrail: cfg.maxTrail ?? 7,
      palette: cfg.palette ?? null,
    });
  }

  spawnChrysanthemum(x, y, palette, scale) {
    const count = Math.round(92 * scale);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.12;
      const speed = (130 + Math.random() * 140) * scale;
      const useSecondary = Math.random() < 0.28;
      this.addSpark({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        drag: 0.955,
        gravity: 96,
        hue: (useSecondary ? palette.secondary : palette.primary) + (Math.random() - 0.5) * 14,
        sat: palette.sat,
        light: 66 + Math.random() * 18,
        size: 1.7 + Math.random() * 1.1,
        decay: 0.52 + Math.random() * 0.24,
        maxTrail: 9,
      });
    }
  }

  spawnWillow(x, y, palette, scale) {
    const count = Math.round(74 * scale);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = (85 + Math.random() * 135) * scale;
      this.addSpark({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 22,
        drag: 0.94,
        gravity: 135,
        hue: 38 + (Math.random() - 0.5) * 12,
        sat: 95,
        light: 70 + Math.random() * 16,
        size: 1.9 + Math.random() * 0.9,
        decay: 0.34 + Math.random() * 0.16,
        strobe: Math.random() < 0.45,
        maxTrail: 12,
      });
    }
  }

  spawnTiltedRings(x, y, palette, scale) {
    const tilt = 0.45 + Math.random() * 0.4;
    const rot = (Math.random() - 0.5) * 0.7;
    const cosR = Math.cos(rot);
    const sinR = Math.sin(rot);

    const emitRing = (count, speedBase, hue, trailLen) => {
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2;
        const lx = Math.cos(a) * speedBase;
        const ly = Math.sin(a) * speedBase * tilt;
        const vx = lx * cosR - ly * sinR;
        const vy = lx * sinR + ly * cosR;
        this.addSpark({
          x,
          y,
          vx,
          vy,
          drag: 0.958,
          gravity: 78,
          hue,
          sat: 94,
          light: 70,
          size: 2.1,
          decay: 0.58 + Math.random() * 0.14,
          maxTrail: trailLen,
        });
      }
    };

    emitRing(Math.round(52 * scale), 210 * scale, palette.primary, 8);
    emitRing(Math.round(32 * scale), 122 * scale, palette.secondary, 6);
  }

  spawnPalm(x, y, palette, scale) {
    const arms = 11;
    for (let i = 0; i < arms; i++) {
      const angle = (i / arms) * Math.PI * 2 + (Math.random() - 0.5) * 0.18;
      const speed = (175 + Math.random() * 55) * scale;
      this.addSpark({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 20,
        drag: 0.96,
        gravity: 90,
        hue: palette.primary,
        sat: 95,
        light: 74,
        size: 2.8,
        decay: 0.52,
        maxTrail: 11,
        splitAt: 0.42 + Math.random() * 0.14,
        palette,
      });
    }
  }

  spawnBrocade(x, y, palette, scale) {
    const count = Math.round(88 * scale);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = (70 + Math.random() * 185) * scale;
      this.addSpark({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        drag: 0.952,
        gravity: 102,
        hue: i % 3 === 0 ? palette.secondary : 44,
        sat: 92,
        light: 74,
        size: 1.8 + Math.random() * 1.1,
        decay: 0.46 + Math.random() * 0.2,
        strobe: true,
        maxTrail: 7,
      });
    }
  }

  spawnBlossom(x, y, palette, scale) {
    const petals = 6;
    const count = Math.round(78 * scale);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.08;
      const lobe = 0.72 + 0.36 * Math.cos(petals * angle);
      const speed = (180 + Math.random() * 65) * lobe * scale;
      this.addSpark({
        x: x + Math.cos(angle) * 6,
        y: y + Math.sin(angle) * 6,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        drag: 0.954,
        gravity: 88,
        hue: lobe > 0.88 ? palette.primary : palette.secondary,
        sat: 94,
        light: 62,
        size: 1.75,
        decay: 0.58 + Math.random() * 0.18,
        maxTrail: 9,
      });
    }
    // Delicate inner pistil ring
    for (let j = 0; j < 20; j++) {
      const a = (j / 20) * Math.PI * 2;
      const sp = (68 + Math.random() * 18) * scale;
      this.addSpark({
        x,
        y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp,
        drag: 0.945,
        gravity: 78,
        hue: 44,
        sat: 96,
        light: 68,
        size: 1.5,
        decay: 0.78,
        maxTrail: 5,
      });
    }
  }

  update(dt, reducedMotion = false) {
    const safeDt = Math.min(dt, 0.05);

    // Autonomous choreography
    this.autoTimer -= safeDt;
    if (this.autoTimer <= 0) {
      const interval = this.finaleMode
        ? 0.28 + Math.random() * 0.36
        : reducedMotion
          ? 2.8 + Math.random() * 1.8
          : 1.1 + Math.random() * 1.35;
      this.autoTimer = interval;

      const tx = this.width * (0.12 + Math.random() * 0.76);
      const ty = this.height * (0.11 + Math.random() * 0.36);
      this.launchRocket(tx, ty, { forceBig: this.finaleMode && Math.random() < 0.45 });
    }

    if (this.finaleMode) {
      this.nextSalvoTimer -= safeDt;
      if (this.nextSalvoTimer <= 0) {
        this.nextSalvoTimer = 3.2;
        this.launchVolley(3);
      }
    }

    // Update rockets
    for (let i = this.rockets.length - 1; i >= 0; i--) {
      const r = this.rockets[i];
      r.elapsed += safeDt;
      const t = Math.min(1, r.elapsed / r.duration);
      const easeOut = 1 - Math.pow(1 - t, 2.2);

      const prevX = r.x;
      const prevY = r.y;

      r.x = r.startX + (r.targetX - r.startX) * t + Math.sin(t * Math.PI) * r.arcOffset;
      r.y = r.startY + (r.targetY - r.startY) * easeOut;

      r.trail.push({ x: r.x, y: r.y });
      if (r.trail.length > 12) r.trail.shift();

      // Occasional rocket exhaust ember
      if (Math.random() < 0.65 && this.sparks.length < 1800) {
        this.addSpark({
          x: prevX,
          y: prevY,
          vx: (Math.random() - 0.5) * 28,
          vy: 28 + Math.random() * 34,
          drag: 0.94,
          gravity: 50,
          hue: 38,
          sat: 96,
          light: 72,
          size: 1.2,
          decay: 2.6,
          maxTrail: 3,
        });
      }

      if (t >= 1) {
        this.explode(r);
        this.rockets.splice(i, 1);
      }
    }

    // Update sparks
    const dragPow = safeDt * 60;
    for (let i = this.sparks.length - 1; i >= 0; i--) {
      const s = this.sparks[i];
      s.age += safeDt;
      s.trail.push({ x: s.x, y: s.y });
      if (s.trail.length > s.maxTrail) s.trail.shift();

      const factor = Math.pow(s.drag, dragPow);
      s.vx *= factor;
      s.vy *= factor;
      s.vy += s.gravity * safeDt;
      s.vx += 8 * safeDt; // subtle upper-atmosphere night breeze

      s.x += s.vx * safeDt;
      s.y += s.vy * safeDt;
      s.alpha -= s.decay * safeDt;

      // Crossette / palm sub-burst split
      if (s.splitAt !== null && s.age >= s.splitAt) {
        s.splitAt = null;
        const subHue = s.palette ? s.palette.secondary : s.hue;
        for (let k = 0; k < 7; k++) {
          const a = (k / 7) * Math.PI * 2 + Math.random() * 0.4;
          const sp = 55 + Math.random() * 45;
          this.addSpark({
            x: s.x,
            y: s.y,
            vx: s.vx * 0.3 + Math.cos(a) * sp,
            vy: s.vy * 0.3 + Math.sin(a) * sp,
            drag: 0.94,
            gravity: 110,
            hue: subHue,
            sat: 96,
            light: 76,
            size: 1.5,
            decay: 1.05 + Math.random() * 0.35,
            strobe: true,
            maxTrail: 5,
          });
        }
      }

      if (s.alpha <= 0.02 || s.y > this.horizonY + 28) {
        this.sparks.splice(i, 1);
      }
    }

    // Update smoke
    for (let i = this.smoke.length - 1; i >= 0; i--) {
      const m = this.smoke[i];
      m.x += m.vx * safeDt;
      m.y += m.vy * safeDt;
      m.radius += 14 * safeDt;
      m.alpha -= 0.055 * safeDt;
      if (m.alpha <= 0.005) {
        this.smoke.splice(i, 1);
      }
    }

    // Update flashes
    for (let i = this.flashes.length - 1; i >= 0; i--) {
      const f = this.flashes[i];
      f.alpha -= 1.85 * safeDt;
      f.ringRadius += (f.maxRingRadius - f.ringRadius) * Math.min(1, safeDt * 7.5);
      if (f.alpha <= 0.01) {
        this.flashes.splice(i, 1);
      }
    }
  }

  render(ctx) {
    ctx.save();

    // 1. Illuminated smoke puffs
    for (let i = 0; i < this.smoke.length; i++) {
      const m = this.smoke[i];
      const grad = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.radius);
      grad.addColorStop(0, `hsla(${m.hue}, 55%, 65%, ${m.alpha})`);
      grad.addColorStop(1, `hsla(${m.hue}, 40%, 35%, 0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. Additive pyrotechnics
    ctx.globalCompositeOperation = 'lighter';

    // Burst shockwave & atmospheric bloom
    for (let i = 0; i < this.flashes.length; i++) {
      const f = this.flashes[i];
      const bloom = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.radius);
      bloom.addColorStop(0, `hsla(${f.hue}, 100%, 88%, ${f.alpha * 0.42})`);
      bloom.addColorStop(0.28, `hsla(${f.hue}, 95%, 62%, ${f.alpha * 0.16})`);
      bloom.addColorStop(1, `hsla(${f.hue}, 90%, 50%, 0)`);
      ctx.fillStyle = bloom;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
      ctx.fill();

      // Delicate expanding pressure ring
      if (f.alpha > 0.25) {
        ctx.strokeStyle = `hsla(${f.hue}, 100%, 84%, ${(f.alpha - 0.25) * 0.32})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.ringRadius, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // Rockets
    for (let i = 0; i < this.rockets.length; i++) {
      const r = this.rockets[i];
      if (r.trail.length > 1) {
        for (let t = 1; t < r.trail.length; t++) {
          const p0 = r.trail[t - 1];
          const p1 = r.trail[t];
          const ratio = t / r.trail.length;
          ctx.strokeStyle = `hsla(40, 100%, ${55 + ratio * 35}%, ${ratio * 0.85})`;
          ctx.lineWidth = 1 + ratio * 1.6;
          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.stroke();
        }
      }

      ctx.fillStyle = 'hsla(48, 100%, 92%, 0.95)';
      ctx.beginPath();
      ctx.arc(r.x, r.y, 2.3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Sparks & trails
    for (let i = 0; i < this.sparks.length; i++) {
      const s = this.sparks[i];
      let alpha = s.alpha;
      if (s.strobe) {
        const flicker = Math.sin(s.age * 34 + s.strobePhase);
        alpha *= flicker > 0 ? 1 : 0.22;
      }
      if (alpha <= 0.02) continue;

      if (s.trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(s.trail[0].x, s.trail[0].y);
        for (let t = 1; t < s.trail.length; t++) {
          ctx.lineTo(s.trail[t].x, s.trail[t].y);
        }
        ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = `hsla(${s.hue}, ${s.sat}%, ${s.light}%, ${alpha * 0.65})`;
        ctx.lineWidth = s.size * 0.85;
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      // Bright incandescent core
      ctx.fillStyle = `hsla(${s.hue}, 100%, ${Math.min(96, s.light + 22)}%, ${alpha})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size * 0.9, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

window.PyrotechnicsEngine = PyrotechnicsEngine;
