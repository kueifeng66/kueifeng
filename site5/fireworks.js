/*!
 * fireworks-js 1.3.5 (Refactored & Documented Edition)
 * Original by Vitalij Ryndin (https://crashmax.ru) — https://fireworks.js.org
 * License: MIT
 */

(function (root, factory) {
  if (typeof exports === "object" && typeof module === "object") {
    module.exports = factory();
  } else if (typeof define === "function" && define.amd) {
    define([], factory);
  } else {
    const exportsObj = factory();
    const target = typeof exports === "object" ? exports : root;
    for (const key in exportsObj) {
      target[key] = exportsObj[key];
    }
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // ==========================================================================
  // 1. MATH & COLOR UTILITIES
  // ==========================================================================

  /** Returns a random floating-point number in [min, max). */
  function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
  }

  /** Returns a random integer in [min, max] (inclusive). */
  function randomInt(min, max) {
    return Math.floor(min + Math.random() * (max + 1 - min));
  }

  /** Calculates the Euclidean distance between two 2D points. */
  function getDistance(x1, y1, x2, y2) {
    return Math.hypot(x1 - x2, y1 - y2);
  }

  /** Formats an HSLA color string with 100% saturation. */
  function hsla(hue, lightness, alpha = 1) {
    return `hsla(${hue}, 100%, ${lightness}%, ${alpha})`;
  }

  // ==========================================================================
  // 2. SOUND ENGINE (Web Audio API)
  // ==========================================================================

  /**
   * Manages loading and playing firework explosion sound effects.
   */
  class Sound {
    constructor(options) {
      this._buffer = [];
      this.onInit = true;
      this._audioContext = null;

      this.options = Object.assign(
        {
          enabled: false,
          files: ["explosion0.mp3", "explosion1.mp3", "explosion2.mp3"],
          volume: { min: 4, max: 8 },
        },
        options
      );

      this.init();
    }

    init() {
      if (this.onInit && this.options.enabled) {
        this.onInit = false;
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this._audioContext = new AudioCtx();
          this.load();
        }
      }
    }

    async load() {
      if (!this._audioContext) return;
      for (const file of this.options.files) {
        try {
          const response = await fetch(file);
          const arrayBuffer = await response.arrayBuffer();
          const audioBuffer = await this._audioContext.decodeAudioData(arrayBuffer);
          this._buffer.push(audioBuffer);
        } catch (err) {
          console.warn(`Fireworks Sound: Failed to load "${file}"`, err);
        }
      }
    }

    play() {
      if (this.options.enabled && this._buffer.length && this._audioContext) {
        const source = this._audioContext.createBufferSource();
        const randomBuffer = this._buffer[randomInt(0, this._buffer.length - 1)];
        const gainNode = this._audioContext.createGain();

        source.buffer = randomBuffer;
        gainNode.gain.value = randomFloat(
          this.options.volume.min / 100,
          this.options.volume.max / 100
        );

        gainNode.connect(this._audioContext.destination);
        source.connect(gainNode);
        source.start(0);
      } else {
        this.init();
      }
    }
  }

  // ==========================================================================
  // 3. TRACE CLASS (Ascending Rocket Trail)
  // ==========================================================================

  /**
   * Represents a single firework rocket streaking upward from a launch point
   * (x, y) toward its target detonation point (dx, dy).
   */
  class Trace {
    constructor({ x, y, dx, dy, ctx, hue, speed, traceLength, acceleration }) {
      this._x = x;
      this._y = y;
      this._sx = x; // Launch origin X
      this._sy = y; // Launch origin Y
      this._dx = dx; // Target destination X
      this._dy = dy; // Target destination Y
      this._ctx = ctx;
      this._hue = hue;
      this._speed = speed;
      this._traceLength = traceLength;
      this._acceleration = acceleration;

      this._currentDistance = 0;
      this._totalDistance = getDistance(x, y, dx, dy);
      this._angle = Math.atan2(dy - y, dx - x);
      this._brightness = randomInt(50, 70);

      // Ring buffer of recent [x, y] positions to draw the rocket's tail
      this._coordinates = [];
      for (let i = 0; i < this._traceLength; i++) {
        this._coordinates.push([x, y]);
      }
    }

    /**
     * Advances the rocket by one frame.
     * @param {Function} onExplode - Called with (dx, dy, hue) when the rocket reaches its target.
     */
    update(onExplode) {
      this._coordinates.pop();
      this._coordinates.unshift([this._x, this._y]);

      // Accelerate rocket as it climbs
      this._speed *= this._acceleration;

      const vx = Math.cos(this._angle) * this._speed;
      const vy = Math.sin(this._angle) * this._speed;

      this._currentDistance = getDistance(
        this._sx,
        this._sy,
        this._x + vx,
        this._y + vy
      );

      if (this._currentDistance >= this._totalDistance) {
        onExplode(this._dx, this._dy, this._hue);
      } else {
        this._x += vx;
        this._y += vy;
      }
    }

    /** Renders the ascending rocket trail segment on the canvas. */
    draw() {
      const lastIndex = this._coordinates.length - 1;
      const [tailX, tailY] = this._coordinates[lastIndex];

      this._ctx.beginPath();
      this._ctx.moveTo(tailX, tailY);
      this._ctx.lineTo(this._x, this._y);
      this._ctx.strokeStyle = hsla(this._hue, this._brightness);
      this._ctx.stroke();
    }
  }

  // ==========================================================================
  // 4. EXPLOSION CLASS (Detonation Spark Particle)
  // ==========================================================================

  /**
   * Represents one spark particle emitted outward when a Trace rocket detonates.
   */
  class Explosion {
    constructor({
      x,
      y,
      ctx,
      hue,
      exp,
      gravity,
      friction,
      brightness,
      explosionLength,
    }) {
      this._x = x;
      this._y = y;
      this._exp = exp;
      this._ctx = ctx;
      this._gravity = gravity;
      this._friction = friction;
      this._explosionLength = explosionLength;

      this._alpha = 1;
      this._angle = randomFloat(0, Math.PI * 2);
      this._speed = randomInt(1, 10);
      this._hue = randomInt(hue - 20, hue + 20);
      this._brightness = randomInt(brightness.min, brightness.max);
      this._decay = randomFloat(brightness.decay.min, brightness.decay.max);

      // Ring buffer of recent [x, y] positions to draw the spark streak
      this._coordinates = [];
      for (let i = 0; i < this._explosionLength; i++) {
        this._coordinates.push([x, y]);
      }
    }

    /**
     * Updates particle physics (drag, velocity, gravity, and fade-out).
     * @param {Function} onComplete - Called when the particle has completely faded out.
     */
    update(onComplete) {
      this._coordinates.pop();
      this._coordinates.unshift([this._x, this._y]);

      // Apply air drag, velocity, and downward gravity
      this._speed *= this._friction;
      this._x += Math.cos(this._angle) * this._speed;
      this._y += Math.sin(this._angle) * this._speed + this._gravity;

      // Fade particle alpha
      this._alpha -= this._decay;
      if (this._alpha <= this._decay) {
        onComplete();
      }
    }

    /** Renders the spark particle streak on the canvas. */
    draw() {
      const lastIndex = this._coordinates.length - 1;
      const [tailX, tailY] = this._coordinates[lastIndex];
      const color = hsla(this._hue, this._brightness, this._alpha);

      this._ctx.beginPath();
      if (this._exp) {
        this._ctx.arc(this._x, this._y, randomFloat(0.5, 1.5), 0, Math.PI * 2);
        this._ctx.fill();
      }
      this._ctx.fillStyle = color;
      this._ctx.moveTo(tailX, tailY);
      this._ctx.lineTo(this._x, this._y);
      this._ctx.strokeStyle = color;
      this._ctx.stroke();
    }
  }

  // ==========================================================================
  // 5. FIREWORKS CONTROLLER CLASS
  // ==========================================================================

  /**
   * Main Fireworks canvas controller.
   * Manages the <canvas>, animation loop, rocket spawning, particle bursts, and mouse input.
   */
  class Fireworks {
    constructor(container, options = {}) {
      const {
        autoresize = true,
        boundaries,
        brightness,
        delay,
        hue,
        mouse,
        sound,
        trace = 3,
        speed = 2,
        explosion = 5,
        gravity = 1.5,
        opacity = 0.5,
        particles = 50,
        friction = 0.95,
        rocketsPoint = 50,
        acceleration = 1.05,
      } = options;

      this._tick = 0;
      this._version = "1.3.5";
      this._running = false;
      this._randomRocketsPoint = false;
      this._experimentals = false;
      this._m = false; // True when mouse-triggered firing is active
      this._traces = [];
      this._explosions = [];

      // DOM & Canvas setup
      this._container = container;
      this._canvas = document.createElement("canvas");
      this._ctx = this._canvas.getContext("2d");
      this._container.appendChild(this._canvas);
      this._sound = new Sound(sound);

      // Configuration properties
      this.autoresize = autoresize;
      this.trace = trace;
      this.speed = speed;
      this.explosion = explosion;
      this.gravity = gravity;
      this.opacity = opacity;
      this.particles = particles;
      this.friction = friction;
      this.rocketsPoint = rocketsPoint;
      this.acceleration = acceleration;

      this.hue = Object.assign({ min: 0, max: 360 }, hue);
      this.mouse = Object.assign({ click: false, move: false, max: 1 }, mouse);
      this.delay = Object.assign({ min: 15, max: 30 }, delay);
      this.brightness = Object.assign(
        {
          min: 50,
          max: 80,
          decay: { min: 0.015, max: 0.03 },
        },
        brightness
      );

      this.setSize();
      this.setBoundaries(Object.assign({ visible: false, x: 50, y: 50 }, boundaries));

      // Bind event handlers so they can be cleanly removed in unmount()
      this._onWindowResize = () => this.windowResize();
      this._onMouseDown = (e) => this.mouseDown(e);
      this._onMouseUp = (e) => this.mouseUp(e);
      this._onMouseMove = (e) => this.mouseMove(e);

      if (this.autoresize) {
        window.addEventListener("resize", this._onWindowResize);
      }
      this._canvas.addEventListener("mousedown", this._onMouseDown);
      this._canvas.addEventListener("mouseup", this._onMouseUp);
      this._canvas.addEventListener("mousemove", this._onMouseMove);
    }

    get isRunning() {
      return this._running;
    }

    get version() {
      return this._version;
    }

    /** Starts the fireworks animation loop. */
    start() {
      if (this._running) return;
      this._running = true;
      this.clear();
      this.render();
    }

    /** Stops the fireworks animation loop and clears the canvas. */
    stop() {
      if (!this._running) return;
      this._running = false;
      this.clear();
    }

    /** Toggles pause state without clearing existing particles. */
    pause() {
      this._running = !this._running;
      if (this._running) {
        this.render();
      }
    }

    /** Clears all active rockets, explosion particles, and canvas pixels. */
    clear() {
      if (!this._ctx) return;
      this._traces = [];
      this._explosions = [];
      this._ctx.clearRect(0, 0, this._width, this._height);
    }

    /** Removes window/canvas event listeners. */
    unmount() {
      window.removeEventListener("resize", this._onWindowResize);
      this._canvas.removeEventListener("mousedown", this._onMouseDown);
      this._canvas.removeEventListener("mouseup", this._onMouseUp);
      this._canvas.removeEventListener("mousemove", this._onMouseMove);
    }

    /** Dynamically updates configuration options at runtime. */
    setOptions(options) {
      for (const [key, value] of Object.entries(options)) {
        const hasProp = Object.prototype.hasOwnProperty.call(this, key);
        if (typeof this[key] === "function") {
          throw new Error("You cannot change the methods of the class!");
        }
        if (hasProp) {
          if (typeof this[key] === "object") {
            Object.assign(this[key], value);
          } else {
            this[key] = value;
          }
        }
        if (key === "sound") {
          Object.assign(this._sound.options, value);
        }
      }
    }

    /** Updates the canvas dimensions to match the container or explicit width/height. */
    setSize({
      width = this._container.clientWidth,
      height = this._container.clientHeight,
    } = {}) {
      this._width = width;
      this._height = height;
      this._canvas.width = width;
      this._canvas.height = height;
      this.setBoundaries({ width, height });
    }

    /** Sets the target detonation bounding box. */
    setBoundaries(boundaries) {
      this.boundaries = Object.assign({}, this.boundaries, boundaries);
    }

    // ------------------------------------------------------------------------
    // Mouse & Resize Event Handlers
    // ------------------------------------------------------------------------

    useMouse(event, isActive) {
      if (this.mouse.click || this.mouse.move) {
        this._mx = event.pageX - this._canvas.offsetLeft;
        this._my = event.pageY - this._canvas.offsetTop;
        this._m = isActive;
      }
    }

    windowResize() {
      this.setSize();
    }

    mouseDown(event) {
      this.useMouse(event, this.mouse.click);
    }

    mouseUp(event) {
      this.useMouse(event, false);
    }

    mouseMove(event) {
      this.useMouse(event, this._m);
    }

    // ------------------------------------------------------------------------
    // Main Animation & Particle Lifecycle Loop
    // ------------------------------------------------------------------------

    render() {
      if (!this._ctx || !this._running) return;

      requestAnimationFrame(() => this.render());

      // Fade previous frame slightly using destination-out to create motion trails
      this._ctx.globalCompositeOperation = "destination-out";
      this._ctx.fillStyle = `rgba(0, 0, 0, ${this.opacity})`;
      this._ctx.fillRect(0, 0, this._width, this._height);

      // Use additive blending for glowing firework trails & sparks
      this._ctx.globalCompositeOperation = "lighter";

      this.drawBoundaries();
      this.initTrace();
      this.drawTrace();
      this.drawExplosion();

      this._tick++;
    }

    /** Optional debug visualization of the target boundary rectangle. */
    drawBoundaries() {
      if (!this.boundaries.visible) return;
      this._ctx.beginPath();
      this._ctx.strokeStyle = "red";
      this._ctx.rect(
        this.boundaries.x,
        this.boundaries.y,
        this.boundaries.width - 2 * this.boundaries.x,
        this.boundaries.height * 0.5
      );
      this._ctx.stroke();
    }

    /** Spawns a new ascending rocket (Trace) when the delay timer or mouse trigger fires. */
    initTrace() {
      this._ds = randomInt(this.delay.min, this.delay.max);

      const shouldSpawnByTimer = this._tick > this._ds * 2;
      const shouldSpawnByMouse =
        this._m && this.mouse.max > this._traces.length;

      if (shouldSpawnByTimer || shouldSpawnByMouse) {
        const launchXRatio = this._randomRocketsPoint
          ? randomInt(0, 100)
          : this.rocketsPoint;
        const launchX = (this._width * launchXRatio) / 100;
        const launchY = this._height;

        const useMouseTarget =
          (this._mx && this.mouse.move) || this._m;

        const targetX = useMouseTarget
          ? this._mx
          : randomInt(
              this.boundaries.x,
              this.boundaries.width - 2 * this.boundaries.x
            );
        const targetY = useMouseTarget
          ? this._my
          : randomInt(this.boundaries.y, this.boundaries.height * 0.5);

        this._traces.push(
          new Trace({
            x: launchX,
            y: launchY,
            dx: targetX,
            dy: targetY,
            ctx: this._ctx,
            hue: randomInt(this.hue.min, this.hue.max),
            speed: this.speed,
            acceleration: this.acceleration,
            traceLength: this.trace,
          })
        );

        this._tick = 0;
      }
    }

    /** Updates and draws all active ascending rockets. */
    drawTrace() {
      for (let i = this._traces.length - 1; i >= 0; i--) {
        const trace = this._traces[i];
        trace.draw();
        trace.update((explodeX, explodeY, hue) => {
          this.initExplosion(explodeX, explodeY, hue);
          this._sound.play();
          this._traces.splice(i, 1);
        });
      }
    }

    /** Spawns a burst of Explosion spark particles at (x, y). */
    initExplosion(x, y, hue) {
      for (let i = 0; i < this.particles; i++) {
        this._explosions.push(
          new Explosion({
            x,
            y,
            ctx: this._ctx,
            hue,
            friction: this.friction,
            gravity: this.gravity,
            explosionLength: this.explosion,
            brightness: this.brightness,
            exp: this._experimentals,
          })
        );
      }
    }

    /** Updates and draws all active explosion spark particles. */
    drawExplosion() {
      for (let i = this._explosions.length - 1; i >= 0; i--) {
        const spark = this._explosions[i];
        spark.draw();
        spark.update(() => {
          this._explosions.splice(i, 1);
        });
      }
    }
  }

  return { Fireworks, Trace, Explosion, Sound };
});
