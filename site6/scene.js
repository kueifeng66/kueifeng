/**
 * Multi-Layered Celestial Observatory & Taipei Skyline Scene Renderer
 * Depth stack:
 *  BG:  Deep skybox, Milky Way band, distant ringed planet, luminous moon, twinkling starfield, nebula clouds
 *  FMG: Mountain ridges, atmospheric mist, volumetric searchlights
 *  MG:  Architectural Taipei 101 skyline, city glow, Pingxi sky lanterns, artisan fireworks
 *  FG:  Real-time rippled river reflection, riverside balustrade silhouette, fast foreground bokeh embers
 */
class CelestialScene {
  constructor(canvas, fireworksEngine) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.fireworks = fireworksEngine;

    this.dpr = 1;
    this.width = 1280;
    this.height = 720;
    this.horizonY = 590;

    this.paused = false;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.time = 0;
    this.lastFrameTime = performance.now();

    // Pointer parallax state (smoothly damped)
    this.pointerTargetX = 0;
    this.pointerTargetY = 0;
    this.pointerX = 0;
    this.pointerY = 0;

    // Offscreen caches
    this.skyCache = document.createElement('canvas');
    this.nebulaCache = document.createElement('canvas');
    this.skylineCache = document.createElement('canvas');
    this.moonCache = document.createElement('canvas');
    this.rooftopBeacons = [];

    // Dynamic entities
    this.stars = [];
    this.meteors = [];
    this.meteorTimer = 4.5;
    this.lanterns = [];
    this.wishLanterns = [];
    this.foregroundEmbers = [];
    this.beams = [];

    this.initEntities();
    this.resize();
  }

  initEntities() {
    // 1. Multi-tier stars
    this.stars = [];
    for (let i = 0; i < 270; i++) {
      const tier = i < 34 ? 2 : i < 110 ? 1 : 0;
      const hues = [215, 225, 42, 35, 195, 0];
      const hue = hues[Math.floor(Math.random() * hues.length)];
      this.stars.push({
        nx: Math.random(),
        ny: Math.random() * 0.78,
        radius: tier === 2 ? 1.55 + Math.random() * 1.0 : tier === 1 ? 0.95 + Math.random() * 0.6 : 0.45 + Math.random() * 0.5,
        baseAlpha: tier === 2 ? 0.85 : tier === 1 ? 0.58 : 0.36,
        twinkleSpeed: 0.8 + Math.random() * 2.4,
        phase: Math.random() * Math.PI * 2,
        hue,
        sat: hue === 0 ? 0 : 48,
        hasSpikes: tier === 2 && Math.random() < 0.65,
      });
    }

    // 2. Volumetric celebration searchlights
    this.beams = [
      { nx: 0.22, baseAngle: -0.26, sweep: 0.22, speed: 0.34, phase: 0.2, width: 0.085, hue: 40, alpha: 0.075 },
      { nx: 0.42, baseAngle: 0.14, sweep: 0.25, speed: 0.27, phase: 1.9, width: 0.1, hue: 205, alpha: 0.065 },
      { nx: 0.64, baseAngle: -0.18, sweep: 0.2, speed: 0.41, phase: 3.1, width: 0.08, hue: 38, alpha: 0.08 },
      { nx: 0.79, baseAngle: 0.04, sweep: 0.16, speed: 0.29, phase: 4.5, width: 0.11, hue: 185, alpha: 0.07 },
      { nx: 0.9, baseAngle: -0.22, sweep: 0.19, speed: 0.36, phase: 5.4, width: 0.075, hue: 14, alpha: 0.06 },
    ];

    // 3. Ambient Pingxi sky lanterns across 3 depth planes
    this.lanterns = [];
    for (let i = 0; i < 24; i++) {
      const depth = i < 10 ? 0.35 : i < 19 ? 0.68 : 1.0;
      this.lanterns.push(this.createLantern(depth, true));
    }

    // 4. Fast foreground wind-carried golden embers & soft bokeh
    this.foregroundEmbers = [];
    for (let i = 0; i < 46; i++) {
      this.foregroundEmbers.push(this.createEmber(true));
    }
  }

  createLantern(depth, randomY = false) {
    const tints = [
      { core: '#fff3c9', mid: '#f8a346', outer: '#d64527', glow: 'rgba(248, 148, 56, 0.32)' },
      { core: '#ffe8c2', mid: '#ef5f3f', outer: '#a8221a', glow: 'rgba(239, 91, 68, 0.28)' },
      { core: '#fff7d6', mid: '#f2c464', outer: '#c77a24', glow: 'rgba(242, 196, 100, 0.3)' },
    ];
    const tint = tints[Math.floor(Math.random() * tints.length)];
    return {
      nx: Math.random(),
      y: randomY ? Math.random() * 0.78 : 0.8 + Math.random() * 0.08,
      depth,
      speedY: (0.011 + Math.random() * 0.014) * (0.65 + depth * 0.55),
      driftX: (0.004 + Math.random() * 0.006) * (0.5 + depth * 0.5),
      swayAmp: 0.004 + Math.random() * 0.006,
      swayFreq: 0.6 + Math.random() * 0.8,
      phase: Math.random() * Math.PI * 2,
      tint,
    };
  }

  createEmber(randomX = false) {
    const isBokeh = Math.random() < 0.28;
    return {
      x: randomX ? Math.random() * this.width : -30 - Math.random() * 80,
      y: this.height * (0.58 + Math.random() * 0.42),
      vx: (isBokeh ? 75 : 42) + Math.random() * 68,
      vy: -14 - Math.random() * 28,
      radius: isBokeh ? 4.5 + Math.random() * 7.5 : 1.1 + Math.random() * 1.9,
      alpha: isBokeh ? 0.14 + Math.random() * 0.18 : 0.45 + Math.random() * 0.45,
      hue: Math.random() < 0.72 ? 38 + Math.random() * 12 : 12 + Math.random() * 12,
      phase: Math.random() * Math.PI * 2,
      isBokeh,
    };
  }

  releaseWishLantern(text, colorKey = 'gold') {
    const palettes = {
      gold: { core: '#fff6d1', mid: '#f5be58', outer: '#c4751b', glow: 'rgba(245, 190, 88, 0.48)' },
      vermilion: { core: '#ffe6d4', mid: '#f25d42', outer: '#a8221a', glow: 'rgba(242, 93, 66, 0.46)' },
      jade: { core: '#e2fff8', mid: '#5fd6c1', outer: '#1d7a6e', glow: 'rgba(95, 214, 193, 0.44)' },
    };
    const tint = palettes[colorKey] || palettes.gold;
    // Route along open left or right sky corridors so wish tags stay clear of the countdown cards
    const useLeftChannel = this.wishLanterns.length % 2 === 0;
    const startNx = useLeftChannel
      ? 0.11 + Math.random() * 0.08
      : 0.82 + Math.random() * 0.07;
    this.wishLanterns.push({
      nx: startNx,
      y: 0.81,
      depth: 1.28,
      speedY: 0.028,
      driftX: useLeftChannel ? 0.0025 : -0.0025,
      swayAmp: 0.005,
      swayFreq: 0.85,
      phase: Math.random() * Math.PI * 2,
      tint,
      text: (text || '').trim(),
      age: 0,
    });

    // Launch a celebratory gold burst in the open sky above it
    if (this.fireworks) {
      setTimeout(() => {
        this.fireworks.launchRocket(this.width * startNx, this.height * 0.22, {
          shellType: 'blossom',
          forceBig: true,
        });
      }, 420);
    }
  }

  setPaused(paused) {
    this.paused = Boolean(paused);
    if (!this.paused) {
      this.lastFrameTime = performance.now();
    }
  }

  setReducedMotion(reduced) {
    this.reducedMotion = Boolean(reduced);
  }

  setPointerNormalized(nx, ny) {
    if (this.reducedMotion) return;
    this.pointerTargetX = Math.max(-1, Math.min(1, nx));
    this.pointerTargetY = Math.max(-1, Math.min(1, ny));
  }

  resize() {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.horizonY = Math.round(this.height * 0.835);

    this.canvas.width = Math.round(this.width * this.dpr);
    this.canvas.height = Math.round(this.height * this.dpr);

    this.fireworks.resize(this.width, this.height, this.horizonY);

    this.buildSkyCache();
    this.buildNebulaCache();
    this.buildMoonCache();
    this.buildSkylineCache();
  }

  buildSkyCache() {
    const w = Math.max(1, Math.round(this.width * this.dpr));
    const h = Math.max(1, Math.round(this.height * this.dpr));
    this.skyCache.width = w;
    this.skyCache.height = h;
    const ctx = this.skyCache.getContext('2d');
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    // 1. Deep nocturnal celestial gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, this.horizonY);
    skyGrad.addColorStop(0, '#02040d');
    skyGrad.addColorStop(0.32, '#060c22');
    skyGrad.addColorStop(0.65, '#0d1638');
    skyGrad.addColorStop(0.88, '#1a1939');
    skyGrad.addColorStop(1, '#312035');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, this.width, this.height);

    // 2. Warm Taipei basin horizon atmospheric glow
    const horizonGlow = ctx.createRadialGradient(
      this.width * 0.62,
      this.horizonY,
      10,
      this.width * 0.62,
      this.horizonY,
      this.width * 0.75
    );
    horizonGlow.addColorStop(0, 'rgba(232, 128, 72, 0.22)');
    horizonGlow.addColorStop(0.45, 'rgba(130, 68, 92, 0.1)');
    horizonGlow.addColorStop(1, 'rgba(10, 14, 34, 0)');
    ctx.fillStyle = horizonGlow;
    ctx.fillRect(0, 0, this.width, this.horizonY);

    // 3. Diagonal Milky Way cosmic dust band
    ctx.save();
    ctx.translate(this.width * 0.5, this.height * 0.34);
    ctx.rotate(-0.42);
    for (let i = -5; i <= 5; i++) {
      const rx = i * (this.width * 0.09);
      const ry = Math.sin(i * 0.7) * 28;
      const rad = this.width * (0.14 + (i % 2 === 0 ? 0.04 : 0));
      const mw = ctx.createRadialGradient(rx, ry, 0, rx, ry, rad);
      mw.addColorStop(0, 'rgba(128, 152, 224, 0.055)');
      mw.addColorStop(0.5, 'rgba(84, 108, 178, 0.028)');
      mw.addColorStop(1, 'rgba(10, 16, 40, 0)');
      ctx.fillStyle = mw;
      ctx.beginPath();
      ctx.arc(rx, ry, rad, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  buildNebulaCache() {
    const w = Math.max(1, Math.round(this.width * 1.15));
    const h = Math.max(1, Math.round(this.horizonY * 0.92));
    this.nebulaCache.width = w;
    this.nebulaCache.height = h;
    const ctx = this.nebulaCache.getContext('2d');
    ctx.clearRect(0, 0, w, h);

    // Rich filamentous cosmic nebula clouds along the Milky Way ribbon
    const filaments = [
      { x: 0.22, y: 0.32, rx: 0.28, ry: 0.14, rot: -0.38, c1: 'rgba(66, 122, 218, 0.16)', c2: 'rgba(24, 48, 118, 0)' },
      { x: 0.42, y: 0.24, rx: 0.3, ry: 0.13, rot: -0.35, c1: 'rgba(72, 188, 178, 0.11)', c2: 'rgba(20, 74, 86, 0)' },
      { x: 0.65, y: 0.28, rx: 0.32, ry: 0.16, rot: -0.42, c1: 'rgba(182, 86, 128, 0.13)', c2: 'rgba(64, 24, 58, 0)' },
      { x: 0.56, y: 0.45, rx: 0.28, ry: 0.14, rot: -0.25, c1: 'rgba(226, 148, 86, 0.09)', c2: 'rgba(84, 42, 28, 0)' },
      { x: 0.15, y: 0.54, rx: 0.24, ry: 0.15, rot: -0.2, c1: 'rgba(74, 96, 194, 0.12)', c2: 'rgba(18, 28, 72, 0)' },
      { x: 0.84, y: 0.38, rx: 0.22, ry: 0.14, rot: -0.4, c1: 'rgba(136, 92, 186, 0.1)', c2: 'rgba(42, 24, 78, 0)' },
    ];

    for (const fl of filaments) {
      for (let sub = 0; sub < 6; sub++) {
        ctx.save();
        const ox = fl.x * w + Math.sin(sub * 1.9 + fl.x * 12) * w * 0.055;
        const oy = fl.y * h + Math.cos(sub * 2.3 + fl.y * 9) * h * 0.07;
        ctx.translate(ox, oy);
        ctx.rotate(fl.rot + (sub - 2.5) * 0.09);
        ctx.scale(1, (fl.ry / fl.rx) * (0.85 + (sub % 3) * 0.18));
        const rad = fl.rx * w * (0.55 + sub * 0.08);
        const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rad);
        g.addColorStop(0, fl.c1);
        g.addColorStop(0.55, fl.c1.replace(/0\.\d+\)/, '0.035)'));
        g.addColorStop(1, fl.c2);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(0, 0, rad, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // Subtle unresolved Milky Way starlight dust speckles
    for (let i = 0; i < 320; i++) {
      const t = i / 320;
      const spread = (Math.sin(i * 73.1) * 0.5 + Math.cos(i * 19.7) * 0.5) * h * 0.24;
      const sx = w * (0.06 + t * 0.88) + Math.sin(i * 12.3) * 24;
      const sy = h * (0.72 - t * 0.56) + spread;
      const r = 0.4 + Math.abs(Math.sin(i * 41.9)) * 0.9;
      ctx.fillStyle = `rgba(220, 232, 255, ${0.12 + Math.abs(Math.cos(i * 17.3)) * 0.24})`;
      ctx.beginPath();
      ctx.arc(sx, sy, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  buildMoonCache() {
    const moonR = Math.max(22, Math.min(38, this.width * 0.026));
    const size = Math.ceil(moonR * 2.4);
    const pad = size / 2;
    this.moonCache.width = Math.round(size * this.dpr);
    this.moonCache.height = Math.round(size * this.dpr);
    this.moonRadius = moonR;

    const ctx = this.moonCache.getContext('2d');
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    ctx.save();
    ctx.beginPath();
    ctx.arc(pad, pad, moonR, 0, Math.PI * 2);
    ctx.clip();

    // Base sunlit lunar sphere gradient
    const discGrad = ctx.createRadialGradient(
      pad - moonR * 0.36,
      pad - moonR * 0.34,
      moonR * 0.08,
      pad + moonR * 0.12,
      pad + moonR * 0.12,
      moonR * 1.2
    );
    discGrad.addColorStop(0, '#fffdf3');
    discGrad.addColorStop(0.45, '#f6e7c8');
    discGrad.addColorStop(0.78, '#c9c2b8');
    discGrad.addColorStop(1, '#7582a2');
    ctx.fillStyle = discGrad;
    ctx.fillRect(pad - moonR, pad - moonR, moonR * 2, moonR * 2);

    // Organic lunar maria (soft overlapping irregular basalt plains)
    const maria = [
      [-0.22, -0.28, 0.34, 0.22, -0.4],
      [0.14, -0.18, 0.38, 0.28, 0.3],
      [0.24, 0.16, 0.28, 0.2, 0.6],
      [-0.32, 0.18, 0.26, 0.32, -0.2],
      [-0.04, 0.02, 0.22, 0.16, 0.15],
    ];
    for (const [mx, my, rx, ry, rot] of maria) {
      ctx.save();
      ctx.translate(pad + mx * moonR, pad + my * moonR);
      ctx.rotate(rot);
      const mg = ctx.createRadialGradient(0, 0, 0, 0, 0, rx * moonR);
      mg.addColorStop(0, 'rgba(104, 114, 138, 0.28)');
      mg.addColorStop(0.65, 'rgba(116, 126, 148, 0.14)');
      mg.addColorStop(1, 'rgba(116, 126, 148, 0)');
      ctx.fillStyle = mg;
      ctx.scale(1, ry / rx);
      ctx.beginPath();
      ctx.arc(0, 0, rx * moonR, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Fine craters with directional sunlit rims & shadow bowls
    const craters = [
      [-0.38, -0.08, 0.1],
      [0.08, -0.44, 0.08],
      [0.34, -0.02, 0.11],
      [-0.12, 0.44, 0.12],
      [0.18, 0.32, 0.075],
      [-0.44, 0.34, 0.065],
    ];
    for (const [cx, cy, cr] of craters) {
      const px = pad + cx * moonR;
      const py = pad + cy * moonR;
      const r = cr * moonR;
      // Inner shadow
      ctx.fillStyle = 'rgba(84, 92, 116, 0.22)';
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fill();
      // Sunlit lower-right rim catchlight
      ctx.strokeStyle = 'rgba(255, 250, 232, 0.32)';
      ctx.lineWidth = 0.85;
      ctx.beginPath();
      ctx.arc(px, py, r, -0.2, Math.PI * 0.8);
      ctx.stroke();
    }

    // Subtle soft atmospheric limb darkening on bottom-right terminator
    const term = ctx.createRadialGradient(
      pad - moonR * 0.42,
      pad - moonR * 0.42,
      moonR * 0.5,
      pad,
      pad,
      moonR * 1.05
    );
    term.addColorStop(0, 'rgba(255, 255, 255, 0)');
    term.addColorStop(0.82, 'rgba(18, 28, 58, 0.12)');
    term.addColorStop(1, 'rgba(12, 20, 48, 0.38)');
    ctx.fillStyle = term;
    ctx.fillRect(pad - moonR, pad - moonR, moonR * 2, moonR * 2);
    ctx.restore();
  }

  buildSkylineCache() {
    const w = Math.max(1, Math.round(this.width * this.dpr));
    const h = Math.max(1, Math.round(this.height * this.dpr));
    this.skylineCache.width = w;
    this.skylineCache.height = h;
    const ctx = this.skylineCache.getContext('2d');
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    const hy = this.horizonY;
    const isCompact = this.width < 720;

    // 1. Far mountain ridge (Yangmingshan / Xiangshan silhouette)
    ctx.fillStyle = '#0a1026';
    ctx.beginPath();
    ctx.moveTo(-40, hy);
    const farPts = [
      [0, 0.12], [0.08, 0.16], [0.18, 0.11], [0.29, 0.18], [0.41, 0.13],
      [0.54, 0.19], [0.68, 0.12], [0.81, 0.17], [0.92, 0.13], [1.04, 0.15],
    ];
    for (const [px, py] of farPts) {
      ctx.lineTo(this.width * px, hy - this.height * py * 0.55);
    }
    ctx.lineTo(this.width + 40, hy);
    ctx.closePath();
    ctx.fill();

    // 2. Nearer dark ridge
    ctx.fillStyle = '#070b1a';
    ctx.beginPath();
    ctx.moveTo(-40, hy);
    const nearPts = [
      [0, 0.08], [0.12, 0.11], [0.24, 0.07], [0.36, 0.1], [0.5, 0.065],
      [0.64, 0.095], [0.76, 0.075], [0.88, 0.11], [1.04, 0.08],
    ];
    for (const [px, py] of nearPts) {
      ctx.lineTo(this.width * px, hy - this.height * py * 0.42);
    }
    ctx.lineTo(this.width + 40, hy);
    ctx.closePath();
    ctx.fill();

    // 3. Far hazy background skyline layer for depth separation
    const farTowers = [
      { x: 0.01, w: 0.04, h: 0.09 },
      { x: 0.06, w: 0.045, h: 0.12 },
      { x: 0.16, w: 0.036, h: 0.105 },
      { x: 0.27, w: 0.038, h: 0.085 },
      { x: 0.43, w: 0.032, h: 0.06 },
      { x: 0.52, w: 0.035, h: 0.075 },
      { x: 0.72, w: 0.042, h: 0.125 },
      { x: 0.84, w: 0.038, h: 0.135 },
      { x: 0.91, w: 0.044, h: 0.105 },
    ];
    for (const ft of farTowers) {
      const fx = this.width * ft.x;
      const fw = Math.max(14, this.width * ft.w);
      const fh = this.height * ft.h * (isCompact ? 0.78 : 1.0);
      ctx.fillStyle = 'rgba(17, 25, 52, 0.72)';
      ctx.fillRect(fx, hy - fh, fw, fh);
    }

    // 4. Midground architectural towers with varied crowns, antennas & curtain-wall shimmer
    this.rooftopBeacons = [];
    const buildings = [
      { x: 0.025, w: 0.042, h: 0.115, style: 'stepped' },
      { x: 0.075, w: 0.036, h: 0.15, style: 'spire' },
      { x: 0.12, w: 0.046, h: 0.095, style: 'flat' },
      { x: 0.175, w: 0.034, h: 0.13, style: 'sloped' },
      { x: 0.225, w: 0.042, h: 0.082, style: 'flat' },
      { x: 0.305, w: 0.03, h: 0.09, style: 'stepped' },
      { x: 0.365, w: 0.036, h: 0.07, style: 'flat' },
      { x: 0.56, w: 0.034, h: 0.078, style: 'sloped' },
      { x: 0.618, w: 0.042, h: 0.115, style: 'stepped' },
      { x: 0.675, w: 0.038, h: 0.162, style: 'spire' }, // Nanshan-inspired tower left of 101
      { x: 0.875, w: 0.048, h: 0.178, style: 'bevel' }, // Sleek beveled tower right of 101
      { x: 0.932, w: 0.04, h: 0.122, style: 'stepped' },
      { x: 0.978, w: 0.034, h: 0.088, style: 'flat' },
    ];

    for (const b of buildings) {
      const bx = this.width * b.x;
      const bw = Math.max(16, this.width * b.w);
      const bh = this.height * b.h * (isCompact ? 0.8 : 1.0);
      const by = hy - bh;

      const bGrad = ctx.createLinearGradient(bx, by, bx + bw, hy);
      bGrad.addColorStop(0, '#141f42');
      bGrad.addColorStop(0.6, '#0b1229');
      bGrad.addColorStop(1, '#050814');
      ctx.fillStyle = bGrad;

      if (b.style === 'bevel') {
        ctx.beginPath();
        ctx.moveTo(bx, hy);
        ctx.lineTo(bx + bw * 0.14, by + bh * 0.09);
        ctx.lineTo(bx + bw, by);
        ctx.lineTo(bx + bw, hy);
        ctx.closePath();
        ctx.fill();
        // Diagonal glass edge reflection
        ctx.strokeStyle = 'rgba(130, 198, 255, 0.25)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(bx + bw * 0.14, by + bh * 0.09);
        ctx.lineTo(bx + bw, by);
        ctx.stroke();
      } else if (b.style === 'sloped') {
        ctx.beginPath();
        ctx.moveTo(bx, hy);
        ctx.lineTo(bx, by);
        ctx.lineTo(bx + bw, by + bh * 0.12);
        ctx.lineTo(bx + bw, hy);
        ctx.closePath();
        ctx.fill();
      } else if (b.style === 'stepped') {
        ctx.fillRect(bx, by + bh * 0.08, bw, bh * 0.92);
        ctx.fillRect(bx + bw * 0.18, by, bw * 0.64, bh * 0.09);
        ctx.fillStyle = 'rgba(255, 214, 148, 0.38)';
        ctx.fillRect(bx + bw * 0.22, by + 2, bw * 0.56, 2);
      } else {
        ctx.fillRect(bx, by, bw, bh);
      }

      if (b.style === 'spire') {
        const ax = bx + bw * 0.5;
        ctx.strokeStyle = 'rgba(155, 200, 255, 0.35)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(ax, by);
        ctx.lineTo(ax, by - 16);
        ctx.stroke();
        this.rooftopBeacons.push({ x: ax, y: by - 16, phase: b.x * 18 });
      }

      // Varied lit office bands & organic curtain-wall lights
      const floorH = 6;
      const floors = Math.max(4, Math.floor((bh - 16) / floorH));
      for (let f = 1; f < floors; f++) {
        const fy = by + 10 + f * floorH;
        const rowSeed = Math.sin((bx + f * 17) * 19.31);
        if (rowSeed > 0.66) {
          // Warm horizontal office strip
          ctx.fillStyle = 'rgba(255, 218, 150, 0.24)';
          ctx.fillRect(bx + 3, fy, bw - 6, 1.8);
        } else {
          const cols = Math.max(2, Math.floor((bw - 6) / 6));
          for (let c = 0; c < cols; c++) {
            const cellSeed = Math.sin((bx + c * 13) * 12.9898 + (fy + f * 7) * 78.233);
            if (cellSeed > 0.42) {
              ctx.fillStyle =
                cellSeed > 0.82 ? 'rgba(255, 224, 158, 0.62)' : 'rgba(128, 188, 248, 0.28)';
              ctx.fillRect(bx + 4 + c * ((bw - 8) / cols), fy, 2.6, 2.2);
            }
          }
        }
      }
    }

    // 5. City base light carpet & subtle horizon haze
    const carpetGrad = ctx.createLinearGradient(0, hy - 28, 0, hy);
    carpetGrad.addColorStop(0, 'rgba(255, 184, 102, 0)');
    carpetGrad.addColorStop(1, 'rgba(255, 178, 92, 0.26)');
    ctx.fillStyle = carpetGrad;
    ctx.fillRect(0, hy - 28, this.width, 28);

    // 6. Iconic Taipei 101 Architectural Silhouette & Festive Lighting
    const towerX = this.width * (isCompact ? 0.78 : 0.79);
    const towerH = Math.min(this.height * 0.5, isCompact ? 290 : 375);
    const baseW = Math.max(28, Math.min(54, this.width * 0.04));
    this.drawTaipei101(ctx, towerX, hy, baseW, towerH);
  }

  drawTaipei101(ctx, cx, hy, baseW, totalH) {
    const pedestalH = totalH * 0.17;
    const segments = 8;
    const segAreaH = totalH * 0.56;
    const segH = segAreaH / segments;
    const spireBaseY = hy - pedestalH - segAreaH;
    const spireTopY = hy - totalH;

    // Pedestal base (tapered trapezoid)
    const pedGrad = ctx.createLinearGradient(cx - baseW, hy - pedestalH, cx + baseW, hy);
    pedGrad.addColorStop(0, '#18244a');
    pedGrad.addColorStop(0.5, '#101833');
    pedGrad.addColorStop(1, '#080c1c');
    ctx.fillStyle = pedGrad;
    ctx.beginPath();
    ctx.moveTo(cx - baseW * 0.72, hy);
    ctx.lineTo(cx - baseW * 0.5, hy - pedestalH);
    ctx.lineTo(cx + baseW * 0.5, hy - pedestalH);
    ctx.lineTo(cx + baseW * 0.72, hy);
    ctx.closePath();
    ctx.fill();

    // 8 Flared Pagoda/Bamboo Tiers
    for (let i = 0; i < segments; i++) {
      const yBottom = hy - pedestalH - i * segH;
      const yTop = yBottom - segH;
      const wBot = baseW * 0.44;
      const wTop = baseW * 0.55;

      const tGrad = ctx.createLinearGradient(cx - wTop, yTop, cx + wTop, yBottom);
      tGrad.addColorStop(0, '#22386b');
      tGrad.addColorStop(0.45, '#132042');
      tGrad.addColorStop(1, '#091026');

      ctx.fillStyle = tGrad;
      ctx.beginPath();
      ctx.moveTo(cx - wBot, yBottom);
      ctx.lineTo(cx - wTop, yTop);
      ctx.lineTo(cx + wTop, yTop);
      ctx.lineTo(cx + wBot, yBottom);
      ctx.closePath();
      ctx.fill();

      // Architectural rim highlight + tier cornice glow
      ctx.strokeStyle = i % 2 === 0 ? 'rgba(255, 214, 140, 0.45)' : 'rgba(130, 214, 255, 0.42)';
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.moveTo(cx - wTop, yTop + 1);
      ctx.lineTo(cx + wTop, yTop + 1);
      ctx.stroke();

      // Vertical spine edge accent lights
      ctx.strokeStyle = 'rgba(148, 222, 255, 0.22)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx - wBot, yBottom);
      ctx.lineTo(cx - wTop, yTop);
      ctx.stroke();

      // Subtle warm golden ruyi medallion at each segment center
      ctx.fillStyle = 'rgba(255, 216, 134, 0.65)';
      ctx.beginPath();
      ctx.arc(cx, yTop + segH * 0.55, Math.max(1.7, baseW * 0.06), 0, Math.PI * 2);
      ctx.fill();

      // Soft side architectural floodlights
      const flood = ctx.createRadialGradient(cx, yTop + 2, 1, cx, yTop + 2, wTop * 1.45);
      flood.addColorStop(0, i % 2 === 0 ? 'rgba(255, 206, 128, 0.16)' : 'rgba(148, 224, 255, 0.18)');
      flood.addColorStop(1, 'rgba(148, 224, 255, 0)');
      ctx.fillStyle = flood;
      ctx.fillRect(cx - wTop * 1.35, yTop - 4, wTop * 2.7, segH * 0.85);
    }

    // Observation crown & stepped pinnacle
    const crownH = totalH * 0.08;
    ctx.fillStyle = '#182b57';
    ctx.fillRect(cx - baseW * 0.3, spireBaseY - crownH, baseW * 0.6, crownH);
    ctx.fillStyle = 'rgba(140, 226, 255, 0.68)';
    ctx.fillRect(cx - baseW * 0.28, spireBaseY - crownH * 0.65, baseW * 0.56, 2.5);

    // Tall illuminated spire mast
    const mastGrad = ctx.createLinearGradient(cx, spireBaseY - crownH, cx, spireTopY);
    mastGrad.addColorStop(0, '#36589e');
    mastGrad.addColorStop(0.7, '#8ad5ff');
    mastGrad.addColorStop(1, '#fff3cf');
    ctx.strokeStyle = mastGrad;
    ctx.lineWidth = Math.max(2, baseW * 0.09);
    ctx.beginPath();
    ctx.moveTo(cx, spireBaseY - crownH);
    ctx.lineTo(cx, spireTopY);
    ctx.stroke();

    // Store spire tip position for pulsing beacon animation
    this.spireTip = { x: cx, y: spireTopY };
  }

  drawCelestialBodies(ctx, px, py) {
    // 1. Distant Ringed Planet (upper-center-left, opaque night hemisphere occluding stars)
    const plX = this.width * 0.34 + px * 0.04;
    const plY = this.height * 0.14 + py * 0.04;
    const plR = Math.max(11, Math.min(19, this.width * 0.014));

    ctx.save();
    ctx.translate(plX, plY);

    // Back half of tilted icy rings (with subtle Cassini division)
    ctx.save();
    ctx.rotate(-0.32);
    ctx.beginPath();
    ctx.ellipse(0, 0, plR * 2.5, plR * 0.56, 0, Math.PI, Math.PI * 2);
    ctx.strokeStyle = 'rgba(202, 214, 246, 0.2)';
    ctx.lineWidth = 2.6;
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(0, 0, plR * 1.92, plR * 0.42, 0, Math.PI, Math.PI * 2);
    ctx.strokeStyle = 'rgba(244, 224, 188, 0.14)';
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.restore();

    // Opaque night-side planet body + sunlit crescent atmosphere rim
    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, plR, 0, Math.PI * 2);
    ctx.clip();

    ctx.fillStyle = '#070b1d';
    ctx.fillRect(-plR, -plR, plR * 2, plR * 2);

    const plGrad = ctx.createRadialGradient(-plR * 0.55, -plR * 0.48, plR * 0.08, 0, 0, plR * 1.15);
    plGrad.addColorStop(0, 'rgba(235, 242, 255, 0.65)');
    plGrad.addColorStop(0.45, 'rgba(128, 152, 206, 0.34)');
    plGrad.addColorStop(0.8, 'rgba(32, 46, 86, 0.16)');
    plGrad.addColorStop(1, 'rgba(7, 11, 29, 0)');
    ctx.fillStyle = plGrad;
    ctx.fillRect(-plR, -plR, plR * 2, plR * 2);
    ctx.restore();

    // Front half of planet rings
    ctx.save();
    ctx.rotate(-0.32);
    ctx.beginPath();
    ctx.ellipse(0, 0, plR * 2.5, plR * 0.56, 0, 0, Math.PI);
    ctx.strokeStyle = 'rgba(226, 236, 255, 0.32)';
    ctx.lineWidth = 2.6;
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(0, 0, plR * 1.92, plR * 0.42, 0, 0, Math.PI);
    ctx.strokeStyle = 'rgba(248, 226, 186, 0.22)';
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.restore();
    ctx.restore();

    // 2. Luminous Full/Gibbous Moon with Corona Halo & Cached Maria/Crater Surface (upper-left)
    const moonX = this.width * 0.16 + px * 0.045;
    const moonY = this.height * 0.19 + py * 0.045;
    const moonR = this.moonRadius || Math.max(22, Math.min(38, this.width * 0.026));

    // Wide atmospheric corona
    const corona = ctx.createRadialGradient(moonX, moonY, moonR * 0.65, moonX, moonY, moonR * 5.6);
    corona.addColorStop(0, 'rgba(255, 242, 210, 0.3)');
    corona.addColorStop(0.28, 'rgba(186, 208, 255, 0.12)');
    corona.addColorStop(0.62, 'rgba(92, 128, 204, 0.035)');
    corona.addColorStop(1, 'rgba(10, 18, 42, 0)');
    ctx.fillStyle = corona;
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonR * 5.6, 0, Math.PI * 2);
    ctx.fill();

    const size = Math.ceil(moonR * 2.4);
    ctx.drawImage(this.moonCache, moonX - size / 2, moonY - size / 2, size, size);
  }

  drawStarsAndMeteors(ctx, px, py) {
    // Twinkling stars
    for (let i = 0; i < this.stars.length; i++) {
      const s = this.stars[i];
      const depth = s.radius > 1.4 ? 0.075 : 0.038;
      const sx = s.nx * this.width + px * depth;
      const sy = s.ny * this.horizonY + py * depth;
      const twinkle = this.reducedMotion
        ? 0.85
        : 0.62 + 0.38 * Math.sin(this.time * s.twinkleSpeed + s.phase);
      const alpha = s.baseAlpha * twinkle;

      ctx.fillStyle = `hsla(${s.hue}, ${s.sat}%, 92%, ${alpha})`;
      ctx.beginPath();
      ctx.arc(sx, sy, s.radius, 0, Math.PI * 2);
      ctx.fill();

      if (s.hasSpikes) {
        const len = s.radius * 4.2 * twinkle;
        ctx.strokeStyle = `hsla(${s.hue}, ${s.sat}%, 95%, ${alpha * 0.52})`;
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.moveTo(sx - len, sy);
        ctx.lineTo(sx + len, sy);
        ctx.moveTo(sx, sy - len);
        ctx.lineTo(sx, sy + len);
        ctx.stroke();
      }
    }

    // Shooting stars
    for (let i = 0; i < this.meteors.length; i++) {
      const m = this.meteors[i];
      const tailX = m.x - m.vx * 0.16;
      const tailY = m.y - m.vy * 0.16;
      const grad = ctx.createLinearGradient(tailX, tailY, m.x, m.y);
      grad.addColorStop(0, 'rgba(255, 244, 214, 0)');
      grad.addColorStop(1, `rgba(255, 248, 224, ${m.alpha})`);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(m.x, m.y);
      ctx.stroke();
    }
  }

  drawVolumetricBeams(ctx, px) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const boost = this.fireworks.finaleMode ? 1.5 : 1.0;

    for (let i = 0; i < this.beams.length; i++) {
      const b = this.beams[i];
      const originX = b.nx * this.width + px * 0.18;
      const originY = this.horizonY + 12;
      const angle =
        b.baseAngle +
        (this.reducedMotion ? 0 : Math.sin(this.time * b.speed * boost + b.phase) * b.sweep);
      const len = this.horizonY * 1.15;
      const halfSpread = this.width * b.width;

      // Soft transverse Gaussian falloff: draw 3 nested cones from wide faint haze to narrow core
      const layers = [
        { spreadScale: 1.45, alphaScale: 0.28 },
        { spreadScale: 0.95, alphaScale: 0.42 },
        { spreadScale: 0.45, alphaScale: 0.5 },
      ];
      for (const layer of layers) {
        const s = halfSpread * layer.spreadScale;
        const tipX = originX + Math.sin(angle) * len;
        const tipY = originY - Math.cos(angle) * len;

        const grad = ctx.createLinearGradient(originX, originY, tipX, tipY);
        grad.addColorStop(0, `hsla(${b.hue}, 82%, 74%, ${b.alpha * boost * layer.alphaScale})`);
        grad.addColorStop(0.45, `hsla(${b.hue}, 76%, 64%, ${b.alpha * 0.38 * boost * layer.alphaScale})`);
        grad.addColorStop(1, `hsla(${b.hue}, 76%, 60%, 0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(originX - 4, originY);
        ctx.lineTo(tipX - s, tipY);
        ctx.lineTo(tipX + s, tipY);
        ctx.lineTo(originX + 4, originY);
        ctx.closePath();
        ctx.fill();
      }
    }
    ctx.restore();
  }

  drawSkyLantern(ctx, lantern, px, py) {
    const sway = this.reducedMotion
      ? 0
      : Math.sin(this.time * lantern.swayFreq + lantern.phase) * lantern.swayAmp;
    const x = (lantern.nx + sway) * this.width + px * (0.22 * lantern.depth);
    const y = lantern.y * this.horizonY + py * (0.18 * lantern.depth);

    const scale = 0.45 + lantern.depth * 0.85;
    const w = 16 * scale;
    const h = 23 * scale;
    const flicker = this.reducedMotion
      ? 1
      : 0.92 + 0.08 * Math.sin(this.time * 9 + lantern.phase);

    ctx.save();
    ctx.translate(x, y);

    // Outer warm atmospheric glow
    const glowR = h * 2.1 * flicker;
    const halo = ctx.createRadialGradient(0, h * 0.15, 1, 0, h * 0.15, glowR);
    halo.addColorStop(0, lantern.tint.glow);
    halo.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(0, h * 0.15, glowR, 0, Math.PI * 2);
    ctx.fill();

    // Lantern paper body (tapered traditional Pingxi silhouette)
    const bodyGrad = ctx.createLinearGradient(0, -h * 0.55, 0, h * 0.48);
    bodyGrad.addColorStop(0, lantern.tint.outer);
    bodyGrad.addColorStop(0.55, lantern.tint.mid);
    bodyGrad.addColorStop(1, lantern.tint.core);

    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.moveTo(0, -h * 0.58);
    ctx.quadraticCurveTo(w * 0.65, -h * 0.35, w * 0.42, h * 0.45);
    ctx.lineTo(-w * 0.42, h * 0.45);
    ctx.quadraticCurveTo(-w * 0.65, -h * 0.35, 0, -h * 0.58);
    ctx.closePath();
    ctx.fill();

    // Inner bright flame core
    ctx.fillStyle = `rgba(255, 250, 224, ${0.9 * flicker})`;
    ctx.beginPath();
    ctx.ellipse(0, h * 0.33, w * 0.18, h * 0.11, 0, 0, Math.PI * 2);
    ctx.fill();

    // Wish text tag if this is a user-released Wish Lantern
    if (lantern.text) {
      const fadeAlpha = Math.max(0, Math.min(1, 1 - lantern.age / 22));
      if (fadeAlpha > 0.04) {
        ctx.font = '600 12px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        const metrics = ctx.measureText(lantern.text);
        const padX = 10;
        const boxW = metrics.width + padX * 2;
        const boxY = h * 0.72;
        const minBoxCenterX = boxW / 2 + 10 - x;
        const maxBoxCenterX = this.width - boxW / 2 - 10 - x;
        const tagOffsetX = Math.max(minBoxCenterX, Math.min(maxBoxCenterX, 0));

        ctx.fillStyle = `rgba(7, 11, 28, ${0.72 * fadeAlpha})`;
        ctx.strokeStyle = `rgba(255, 226, 156, ${0.55 * fadeAlpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(tagOffsetX - boxW / 2, boxY, boxW, 22, 11);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = `rgba(255, 244, 214, ${fadeAlpha})`;
        ctx.fillText(lantern.text, tagOffsetX, boxY + 15);
      }
    }

    ctx.restore();
  }

  drawRiverReflection(ctx, px) {
    const hy = this.horizonY;
    const waterH = this.height - hy;
    if (waterH <= 4) return;

    ctx.save();
    ctx.beginPath();
    ctx.rect(0, hy, this.width, waterH);
    ctx.clip();

    // Dark river base gradient
    const waterBase = ctx.createLinearGradient(0, hy, 0, this.height);
    waterBase.addColorStop(0, '#091026');
    waterBase.addColorStop(0.55, '#050918');
    waterBase.addColorStop(1, '#02040d');
    ctx.fillStyle = waterBase;
    ctx.fillRect(0, hy, this.width, waterH);

    // Sample & mirror upper scene in rippled horizontal strips
    const slices = 26;
    const sliceDstH = waterH / slices;
    const srcSpan = Math.min(hy - 4, waterH * 2.2);

    ctx.globalAlpha = 0.42;
    for (let i = 0; i < slices; i++) {
      const progress = i / slices;
      const dstY = hy + i * sliceDstH;
      const srcY = Math.max(0, (hy - progress * srcSpan) * this.dpr);
      const srcH = Math.max(2, (srcSpan / slices) * this.dpr);

      const waveShift = this.reducedMotion
        ? 0
        : Math.sin(this.time * 2.4 + i * 0.65) * (2.2 + progress * 6.5);

      ctx.drawImage(
        this.canvas,
        0,
        srcY,
        this.canvas.width,
        srcH,
        waveShift,
        dstY,
        this.width,
        sliceDstH + 1
      );
    }

    // Dark Fresnel water overlay + shimmering moonlight path
    ctx.globalAlpha = 1;
    const fresnel = ctx.createLinearGradient(0, hy, 0, this.height);
    fresnel.addColorStop(0, 'rgba(8, 13, 30, 0.28)');
    fresnel.addColorStop(0.6, 'rgba(4, 7, 18, 0.62)');
    fresnel.addColorStop(1, 'rgba(2, 4, 12, 0.88)');
    ctx.fillStyle = fresnel;
    ctx.fillRect(0, hy, this.width, waterH);

    // Subtle specular moonlight ripples
    const moonWaterX = this.width * 0.16 + px * 0.045;
    for (let r = 0; r < 10; r++) {
      const ry = hy + 6 + r * (waterH / 11);
      const rw = (14 + r * 4) * (0.8 + 0.25 * Math.sin(this.time * 2 + r));
      const rx = moonWaterX + Math.sin(this.time * 1.7 + r * 1.3) * 8;
      ctx.fillStyle = `rgba(255, 240, 200, ${0.14 - r * 0.011})`;
      ctx.fillRect(rx - rw / 2, ry, rw, 1.4);
    }

    // Horizon shoreline rim line
    const shoreGlow = ctx.createLinearGradient(0, hy, this.width, hy);
    shoreGlow.addColorStop(0, 'rgba(255, 190, 120, 0.08)');
    shoreGlow.addColorStop(0.65, 'rgba(255, 186, 110, 0.28)');
    shoreGlow.addColorStop(1, 'rgba(130, 195, 255, 0.14)');
    ctx.fillStyle = shoreGlow;
    ctx.fillRect(0, hy - 1, this.width, 2);

    ctx.restore();
  }

  drawForegroundFrame(ctx, px) {
    const h = this.height;
    const w = this.width;
    const sway = this.reducedMotion ? 0 : Math.sin(this.time * 1.3) * 5;

    ctx.save();
    // 1. Foreground Riverside Observatory Stone Balustrade & Lantern Posts
    const drawCornerTerrace = (isRight) => {
      const dir = isRight ? -1 : 1;
      const edgeX = isRight ? w + 16 : -16;
      const postX = (isRight ? w - Math.min(130, w * 0.12) : Math.min(130, w * 0.12)) + px * 0.45;
      const endX = (isRight ? w - Math.min(260, w * 0.24) : Math.min(260, w * 0.24)) + px * 0.45;
      const railY = h * 0.928;

      // Stone terrace coping & angled promenade silhouette
      ctx.fillStyle = '#03050d';
      ctx.beginPath();
      ctx.moveTo(edgeX, h + 10);
      ctx.lineTo(edgeX, railY - 8);
      ctx.lineTo(postX, railY - 4);
      ctx.lineTo(endX, h + 10);
      ctx.closePath();
      ctx.fill();

      // Balustrade rail highlight
      ctx.strokeStyle = 'rgba(234, 185, 99, 0.18)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(edgeX, railY - 8);
      ctx.lineTo(postX, railY - 4);
      ctx.stroke();

      // Ornamental stone lantern pillar
      const postW = 14;
      const postTop = railY - 34;
      ctx.fillStyle = '#050814';
      ctx.fillRect(postX - postW / 2, postTop, postW, 34);
      // Pagoda lantern cap
      ctx.beginPath();
      ctx.moveTo(postX - 11, postTop + 2);
      ctx.lineTo(postX, postTop - 8);
      ctx.lineTo(postX + 11, postTop + 2);
      ctx.closePath();
      ctx.fill();

      // Warm glowing lantern window inside pillar
      const lampY = postTop + 9;
      const lampGlow = ctx.createRadialGradient(postX, lampY, 1, postX, lampY, 44);
      lampGlow.addColorStop(0, 'rgba(255, 224, 150, 0.42)');
      lampGlow.addColorStop(0.45, 'rgba(239, 132, 68, 0.12)');
      lampGlow.addColorStop(1, 'rgba(239, 132, 68, 0)');
      ctx.fillStyle = lampGlow;
      ctx.beginPath();
      ctx.arc(postX, lampY, 44, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(255, 232, 174, 0.88)';
      ctx.fillRect(postX - 3, lampY - 4, 6, 8);

      // Gentle swaying lakeside reed/pine silhouette tufts
      ctx.strokeStyle = '#02040a';
      ctx.lineWidth = 2.1;
      for (let b = 0; b < 5; b++) {
        const bx = edgeX + dir * (18 + b * 24) + px * 0.48;
        const bh = 28 + (b % 3) * 16;
        ctx.beginPath();
        ctx.moveTo(bx, h + 4);
        ctx.quadraticCurveTo(bx + dir * 8 + sway * 0.5, h - bh * 0.55, bx + dir * 16 + sway, h - bh);
        ctx.stroke();
      }
    };

    if (w >= 540) {
      drawCornerTerrace(false);
      drawCornerTerrace(true);
    }

    // 2. Fast foreground wind-carried embers & out-of-focus bokeh sparks
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < this.foregroundEmbers.length; i++) {
      const e = this.foregroundEmbers[i];
      const ex = e.x + px * 0.52;
      const ey = e.y;
      const flicker = this.reducedMotion ? 1 : 0.72 + 0.28 * Math.sin(this.time * 5 + e.phase);
      const a = e.alpha * flicker;

      if (e.isBokeh) {
        const g = ctx.createRadialGradient(ex, ey, 0, ex, ey, e.radius * 1.3);
        g.addColorStop(0, `hsla(${e.hue}, 96%, 74%, ${a})`);
        g.addColorStop(0.5, `hsla(${e.hue}, 92%, 58%, ${a * 0.42})`);
        g.addColorStop(1, `hsla(${e.hue}, 90%, 50%, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(ex, ey, e.radius * 1.3, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Slight motion-streak spark for clear sense of wind & speed
        ctx.strokeStyle = `hsla(${e.hue}, 100%, 78%, ${a * 0.75})`;
        ctx.lineWidth = e.radius;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(ex - e.vx * 0.035, ey - e.vy * 0.035);
        ctx.lineTo(ex, ey);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  update(dt) {
    // Smooth pointer parallax damping
    const lerp = Math.min(1, dt * 5.5);
    this.pointerX += (this.pointerTargetX - this.pointerX) * lerp;
    this.pointerY += (this.pointerTargetY - this.pointerY) * lerp;

    if (this.paused) return;

    const motionScale = this.reducedMotion ? 0.18 : 1.0;
    this.time += dt * motionScale;

    // Meteors
    this.meteorTimer -= dt * motionScale;
    if (this.meteorTimer <= 0) {
      this.meteorTimer = 7 + Math.random() * 9;
      this.meteors.push({
        x: this.width * (0.15 + Math.random() * 0.65),
        y: this.height * (0.04 + Math.random() * 0.18),
        vx: 420 + Math.random() * 220,
        vy: 155 + Math.random() * 95,
        alpha: 0.9,
      });
    }
    for (let i = this.meteors.length - 1; i >= 0; i--) {
      const m = this.meteors[i];
      m.x += m.vx * dt;
      m.y += m.vy * dt;
      m.alpha -= 1.05 * dt;
      if (m.alpha <= 0) this.meteors.splice(i, 1);
    }

    // Ambient lanterns
    for (let i = 0; i < this.lanterns.length; i++) {
      const l = this.lanterns[i];
      l.y -= l.speedY * dt * motionScale;
      l.nx += l.driftX * dt * motionScale;
      if (l.y < -0.08 || l.nx > 1.08) {
        this.lanterns[i] = this.createLantern(l.depth, false);
      }
    }

    // Wish lanterns
    for (let i = this.wishLanterns.length - 1; i >= 0; i--) {
      const wl = this.wishLanterns[i];
      wl.age += dt;
      wl.y -= wl.speedY * dt * motionScale;
      wl.nx += wl.driftX * dt * motionScale;
      if (wl.y < -0.14) {
        this.wishLanterns.splice(i, 1);
      }
    }

    // Foreground embers
    for (let i = 0; i < this.foregroundEmbers.length; i++) {
      const e = this.foregroundEmbers[i];
      e.x += e.vx * dt * motionScale;
      e.y += e.vy * dt * motionScale;
      if (e.x > this.width + 60 || e.y < this.height * 0.35) {
        this.foregroundEmbers[i] = this.createEmber(false);
      }
    }

    // Fireworks
    this.fireworks.update(dt, this.reducedMotion);
  }

  render() {
    const ctx = this.ctx;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    const px = this.pointerX * 26;
    const py = this.pointerY * 14;

    // 1. Deep Skybox & Milky Way
    ctx.drawImage(this.skyCache, 0, 0, this.width, this.height);

    // 2. Distant Planet & Luminous Moon
    this.drawCelestialBodies(ctx, px, py);

    // 3. Stars & Shooting Stars
    this.drawStarsAndMeteors(ctx, px, py);

    // 4. Drifting Nebula Clouds + Firework Atmospheric Scatter
    const nebDriftX = this.reducedMotion ? 0 : Math.sin(this.time * 0.08) * 24;
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.drawImage(
      this.nebulaCache,
      -this.width * 0.07 + nebDriftX + px * 0.08,
      py * 0.08,
      this.width * 1.15,
      this.horizonY * 0.9
    );
    ctx.restore();

    // 5. Volumetric Searchlight Beams
    this.drawVolumetricBeams(ctx, px);

    // 6. Far Sky Lanterns (behind skyline)
    for (let i = 0; i < this.lanterns.length; i++) {
      if (this.lanterns[i].depth < 0.5) {
        this.drawSkyLantern(ctx, this.lanterns[i], px, py);
      }
    }

    // 7. Mountain Ridges & Taipei 101 Skyline
    ctx.drawImage(this.skylineCache, px * 0.16, py * 0.08, this.width, this.height);

    // Pulsing aviation beacon & dynamic firework rim glow on Taipei 101 spire
    if (this.spireTip) {
      const tipX = this.spireTip.x + px * 0.16;
      const tipY = this.spireTip.y + py * 0.08;
      const pulse = 0.5 + 0.5 * Math.sin(this.time * 3.1);
      const beacon = ctx.createRadialGradient(tipX, tipY, 0, tipX, tipY, 18);
      beacon.addColorStop(0, `rgba(255, 118, 94, ${0.45 + pulse * 0.5})`);
      beacon.addColorStop(0.4, `rgba(255, 92, 68, ${0.18 + pulse * 0.2})`);
      beacon.addColorStop(1, 'rgba(255, 68, 48, 0)');
      ctx.fillStyle = beacon;
      ctx.beginPath();
      ctx.arc(tipX, tipY, 18, 0, Math.PI * 2);
      ctx.fill();
    }

    // Pulsing rooftop aviation beacons on secondary towers
    for (let i = 0; i < this.rooftopBeacons.length; i++) {
      const rb = this.rooftopBeacons[i];
      const pulse = 0.35 + 0.65 * Math.max(0, Math.sin(this.time * 2.4 + rb.phase));
      ctx.fillStyle = `rgba(255, 92, 76, ${pulse})`;
      ctx.beginPath();
      ctx.arc(rb.x + px * 0.16, rb.y + py * 0.08, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Firework sky-glow lighting up skyline rim & horizon mist
    if (this.fireworks.flashes.length > 0) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < this.fireworks.flashes.length; i++) {
        const f = this.fireworks.flashes[i];
        const hGlow = ctx.createRadialGradient(
          f.x,
          this.horizonY,
          10,
          f.x,
          this.horizonY,
          f.radius * 1.1
        );
        hGlow.addColorStop(0, `hsla(${f.hue}, 95%, 65%, ${f.alpha * 0.16})`);
        hGlow.addColorStop(1, `hsla(${f.hue}, 90%, 50%, 0)`);
        ctx.fillStyle = hGlow;
        ctx.fillRect(0, this.horizonY - f.radius, this.width, f.radius + 10);
      }
      ctx.restore();
    }

    // 8. Mid & Near Pingxi Sky Lanterns
    for (let i = 0; i < this.lanterns.length; i++) {
      if (this.lanterns[i].depth >= 0.5) {
        this.drawSkyLantern(ctx, this.lanterns[i], px, py);
      }
    }

    // 9. Artisan Fireworks Layer
    this.fireworks.render(ctx);

    // 10. User-Released Wish Lanterns (foreground-midground priority)
    for (let i = 0; i < this.wishLanterns.length; i++) {
      this.drawSkyLantern(ctx, this.wishLanterns[i], px, py);
    }

    // 11. Real-time Rippled River Reflection Plane (mirrors sky, skyline, lanterns & fireworks!)
    this.drawRiverReflection(ctx, px);

    // 12. Foreground Observatory Parapet & Fast Wind-Carried Sparks
    this.drawForegroundFrame(ctx, px);
  }

  start() {
    const tick = (now) => {
      const dt = Math.min(0.06, Math.max(0.001, (now - this.lastFrameTime) / 1000));
      this.lastFrameTime = now;
      this.update(dt);
      this.render();
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
}

window.CelestialScene = CelestialScene;
