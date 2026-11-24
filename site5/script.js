/**
 * Atelier Chronos — Master Horological Countdown Timers
 * Redesigned with the 3D Cylinder Drum Wheel Picker & Crafted Walnut/Brass Aesthetic from ref/
 */

const timersContainer = document.getElementById("timers-container");
const originalTitle = document.title;
let titleBlinkInterval = null;
const allTimers = [];

const clamp = (val, min, max) => Math.max(min, Math.min(max, val));
const mod = (n, m) => ((n % m) + m) % m;

const WEEKDAY_LABELS = {
  0: "(日)",
  1: "(一)",
  2: "(二)",
  3: "(三)",
  4: "(四)",
  5: "(五)",
  6: "(六)",
};

const CURATED_TIMER_TITLES = [
  "Master Tourbillon",
  "Espresso Extraction",
  "Pomodoro Focus",
  "Astrolabe Calibration",
  "Tea Steep Infusion",
  "Darkroom Exposure",
  "Studio Sprint",
  "Chronograph Interval",
  "Observatory Transit",
  "Mainspring Wind",
  "Tempered Brass Anneal",
  "Escapement Beat Test",
];

const studioState = {
  audioMuted: false,
  activeFilter: "all",
  searchQuery: "",
  lastTrailTime: 0,
  fireworksInstance: null,
  fireworksTimeout: null,
};

// ============================================================================
// 1. UNIFIED 3D CYLINDER WHEEL PICKER ENGINE (Adapted from ref/script.js)
// ============================================================================

class CylinderWheelColumn {
  constructor({
    container,
    wheelEl,
    items,
    itemClass = "ios-picker-item",
    itemHeight = 28,
    cylinderRadius = 54,
    angleStep = 25,
    maxVisibleDelta = 2.35,
    circularWrap = true,
    onChange,
  }) {
    this.container = container;
    this.wheelEl = wheelEl;
    this.items = items; // [{ value, label, html }]
    this.itemClass = itemClass;
    this.itemHeight = itemHeight;
    this.cylinderRadius = cylinderRadius;
    this.angleStep = angleStep;
    this.maxVisibleDelta = maxVisibleDelta;
    this.circularWrap = circularWrap;
    this.onChange = onChange;

    this.currentIndex = 0;
    this.floatIndex = 0;
    this.isDragging = false;
    this.startY = 0;
    this.startFloatIndex = 0;
    this.lastY = 0;
    this.lastTime = 0;
    this.velocity = 0;
    this.dragDistance = 0;
    this.animId = null;
    this.wheelTimer = null;
    this.visibleIndices = new Set();

    this.render();
    this.bindEvents();
  }

  render() {
    this.wheelEl.innerHTML = "";
    const frag = document.createDocumentFragment();
    this.domItems = this.items.map((item, idx) => {
      const div = document.createElement("div");
      div.className = this.itemClass;
      if (item.html) {
        div.innerHTML = item.html;
      } else {
        div.textContent = item.label;
      }
      div.dataset.index = String(idx);
      div.dataset.value = String(item.value);
      div.style.display = "none";
      frag.appendChild(div);
      return div;
    });
    this.wheelEl.appendChild(frag);
  }

  updateVisuals(fIndex) {
    const len = this.items.length;
    if (len === 0) return;

    this.floatIndex = fIndex;
    const centerInt = Math.round(fIndex);
    const frac = fIndex - centerInt;
    const normalizedNearest = this.circularWrap
      ? mod(centerInt, len)
      : clamp(centerInt, 0, len - 1);

    if (normalizedNearest !== this.currentIndex) {
      this.currentIndex = normalizedNearest;
      if (navigator.vibrate && navigator.userActivation?.hasBeenActive) {
        try {
          navigator.vibrate(4);
        } catch (_) {}
      }
    }

    const maxStep = Math.ceil(this.maxVisibleDelta);
    const nextVisible = new Set();
    const rad = Math.PI / 180;

    for (let k = -maxStep; k <= maxStep; k++) {
      const delta = k - frac;
      if (Math.abs(delta) > this.maxVisibleDelta) continue;

      let itemIdx = centerInt + k;
      if (this.circularWrap) {
        itemIdx = mod(itemIdx, len);
      } else if (itemIdx < 0 || itemIdx >= len) {
        continue;
      }

      nextVisible.add(itemIdx);
      const dom = this.domItems[itemIdx];
      if (!this.visibleIndices.has(itemIdx)) {
        dom.style.display = "flex";
      }

      const thetaDeg = delta * this.angleStep;
      const thetaRad = thetaDeg * rad;
      const y = this.cylinderRadius * Math.sin(thetaRad);
      const z = this.cylinderRadius * (Math.cos(thetaRad) - 1);
      const opacity = Math.max(0.16, Math.pow(Math.cos(thetaRad), 2.3));
      const scale = 1 - (1 - Math.cos(thetaRad)) * 0.44;

      dom.style.transform = `translate3d(0, ${y.toFixed(2)}px, ${z.toFixed(2)}px) rotateX(${(-thetaDeg).toFixed(2)}deg) scale(${scale.toFixed(3)})`;
      dom.style.opacity = opacity.toFixed(3);
      dom.classList.toggle("active", Math.abs(delta) < 0.35);
    }

    for (const oldIdx of this.visibleIndices) {
      if (!nextVisible.has(oldIdx)) {
        const dom = this.domItems[oldIdx];
        dom.style.display = "none";
        dom.classList.remove("active");
      }
    }
    this.visibleIndices = nextVisible;

    const active = this.items[this.currentIndex];
    if (active) {
      this.container.setAttribute("aria-valuenow", String(active.value));
      this.container.setAttribute("aria-valuetext", active.label);
    }
  }

  snapTo(targetIdx, duration = 220, forceNotify = false) {
    if (this.animId) cancelAnimationFrame(this.animId);
    const len = this.items.length;
    const startF = this.floatIndex;

    let finalIdx;
    let change;
    if (this.circularWrap) {
      finalIdx = mod(Math.round(targetIdx), len);
      const currentMod = mod(startF, len);
      change = finalIdx - currentMod;
      if (change > len / 2) change -= len;
      else if (change < -len / 2) change += len;
    } else {
      finalIdx = clamp(Math.round(targetIdx), 0, len - 1);
      change = finalIdx - startF;
    }

    if (Math.abs(change) < 0.001) {
      this.updateVisuals(finalIdx);
      this.floatIndex = finalIdx;
      this.currentIndex = finalIdx;
      this.onChange?.(this.items[finalIdx], forceNotify);
      return;
    }

    const startTime = performance.now();
    const step = (ts) => {
      const t = Math.min(1, (ts - startTime) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      this.updateVisuals(startF + change * eased);

      if (t < 1) {
        this.animId = requestAnimationFrame(step);
      } else {
        this.updateVisuals(finalIdx);
        this.floatIndex = finalIdx;
        this.currentIndex = finalIdx;
        this.onChange?.(this.items[finalIdx], forceNotify);
      }
    };

    this.animId = requestAnimationFrame(step);
  }

  setImmediate(idx, notify = false) {
    if (this.animId) cancelAnimationFrame(this.animId);
    const len = this.items.length;
    idx = this.circularWrap ? mod(idx, len) : clamp(idx, 0, len - 1);
    this.updateVisuals(idx);
    this.floatIndex = idx;
    this.currentIndex = idx;
    if (notify) this.onChange?.(this.items[idx], true);
  }

  bindEvents() {
    const getClientY = (e) => e.clientY ?? e.touches?.[0]?.clientY ?? 0;

    const onPointerMove = (e) => {
      if (!this.isDragging) return;
      const clientY = getClientY(e);
      this.dragDistance += Math.abs(clientY - this.lastY);

      let candidate =
        this.startFloatIndex + -(clientY - this.startY) / this.itemHeight;
      const max = this.items.length - 1;
      if (!this.circularWrap) {
        if (candidate < 0) candidate *= 0.25;
        else if (candidate > max) candidate = max + (candidate - max) * 0.25;
      }

      const ts = performance.now();
      const dt = ts - this.lastTime;
      if (dt > 10) {
        this.velocity =
          -(clientY - this.lastY) / this.itemHeight / (dt / 16.67);
        this.lastY = clientY;
        this.lastTime = ts;
      }
      this.updateVisuals(candidate);
    };

    const onPointerUp = (e) => {
      if (!this.isDragging) return;
      this.isDragging = false;
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);

      const len = this.items.length;
      const max = len - 1;
      if (this.dragDistance < 5) {
        const itemEl = e.target.closest("[data-index]");
        if (itemEl) {
          this.snapTo(parseInt(itemEl.dataset.index, 10), 220, true);
          return;
        }
      }

      if (!this.circularWrap) {
        if (this.floatIndex < 0) return this.snapTo(0, 200);
        if (this.floatIndex > max) return this.snapTo(max, 200);
      }

      if (Math.abs(this.velocity) > 0.08) {
        let currentF = this.floatIndex;
        let v = this.velocity;
        const momentumStep = () => {
          v *= 0.92;
          currentF += v;
          const outOfBounds =
            !this.circularWrap && (currentF < -0.5 || currentF > max + 0.5);
          if (outOfBounds || Math.abs(v) < 0.02) {
            const target = this.circularWrap
              ? mod(Math.round(currentF), len)
              : Math.round(clamp(currentF, 0, max));
            this.snapTo(target, 200);
          } else {
            this.updateVisuals(currentF);
            this.animId = requestAnimationFrame(momentumStep);
          }
        };
        this.animId = requestAnimationFrame(momentumStep);
      } else {
        const target = this.circularWrap
          ? mod(Math.round(this.floatIndex), len)
          : Math.round(clamp(this.floatIndex, 0, max));
        this.snapTo(target, 180);
      }
    };

    this.container.addEventListener("pointerdown", (e) => {
      if (this.animId) cancelAnimationFrame(this.animId);
      this.isDragging = true;
      const clientY = getClientY(e);
      this.startY = this.lastY = clientY;
      this.startFloatIndex = this.floatIndex;
      this.lastTime = performance.now();
      this.velocity = 0;
      this.dragDistance = 0;

      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
      window.addEventListener("pointercancel", onPointerUp);
      if (e.pointerId && this.container.setPointerCapture) {
        try {
          this.container.setPointerCapture(e.pointerId);
        } catch (_) {}
      }
    });

    this.container.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();
        if (this.animId) cancelAnimationFrame(this.animId);
        const len = this.items.length;
        const rawCandidate =
          this.floatIndex + (e.deltaY / this.itemHeight) * 0.6;
        const candidate = this.circularWrap
          ? rawCandidate
          : clamp(rawCandidate, 0, len - 1);
        this.updateVisuals(candidate);
        clearTimeout(this.wheelTimer);
        this.wheelTimer = setTimeout(() => {
          const target = this.circularWrap
            ? mod(Math.round(this.floatIndex), len)
            : Math.round(this.floatIndex);
          this.snapTo(target, 160);
        }, 100);
      },
      { passive: false }
    );

    this.container.addEventListener("keydown", (e) => {
      const stepMap = {
        ArrowUp: -1,
        ArrowDown: 1,
        PageUp: -5,
        PageDown: 5,
        Home: -this.currentIndex,
        End: this.items.length - 1 - this.currentIndex,
      };
      if (e.key in stepMap) {
        e.preventDefault();
        this.snapTo(this.currentIndex + stepMap[e.key], 180);
      }
    });
  }
}

// Shared static option lists for Hours (00..23), Minutes (00..59), Seconds (00..59)
const HOURS_ITEMS = Array.from({ length: 24 }, (_, i) => {
  const pad = String(i).padStart(2, "0");
  return {
    value: i,
    label: `${pad}時`,
    html: `<span>${pad}</span><span class="unit-suffix">時</span>`,
  };
});

const MINUTES_ITEMS = Array.from({ length: 60 }, (_, i) => {
  const pad = String(i).padStart(2, "0");
  return {
    value: i,
    label: `${pad}分`,
    html: `<span>${pad}</span><span class="unit-suffix">分</span>`,
  };
});

const SECONDS_ITEMS = Array.from({ length: 60 }, (_, i) => {
  const pad = String(i).padStart(2, "0");
  return {
    value: i,
    label: `${pad}秒`,
    html: `<span>${pad}</span><span class="unit-suffix">秒</span>`,
  };
});

// ============================================================================
// 2. COUNTDOWN TIMER MODULE (With 3D Drum Wheel Picker & Horological Gauge)
// ============================================================================

class CountdownTimer {
  constructor(index) {
    this.index = index;
    this.timer = null;
    this.initialDuration = 0;
    this.duration = 0;
    this.endTime = 0;
    this.isRunning = false;
    this.hasStartedBefore = false;
    this.isExpired = false;
    this.syncingWheel = false;

    this.createElements();
    this.populatePickers();
    this.initWheelPicker();
    this.attachEvents();
    this.updateTargetSummary();
  }

  createElements() {
    const wrapper = document.createElement("div");
    wrapper.className = "timer";
    wrapper.dataset.timerIndex = String(this.index);

    const numStr = String(this.index + 1).padStart(2, "0");
    const defaultTitle =
      CURATED_TIMER_TITLES[this.index] || `Chronometer #${numStr}`;

    wrapper.innerHTML = `
      <span class="brass-rivet tl" aria-hidden="true"></span>
      <span class="brass-rivet tr" aria-hidden="true"></span>
      <span class="brass-rivet bl" aria-hidden="true"></span>
      <span class="brass-rivet br" aria-hidden="true"></span>

      <div class="timer-header">
        <div class="timer-id-group">
          <span class="timer-badge">#${numStr}</span>
          <input type="text" class="timer-title-input" value="${defaultTitle}" aria-label="Timer ${this.index + 1} label" />
        </div>
        <div class="timer-status-pill">
          <span class="status-jewel"></span>
          <span class="status-text">STANDBY</span>
        </div>
      </div>

      <div class="picker">
        <div class="drum-column-headers" aria-hidden="true">
          <span class="drum-col-title">Hours • 時</span>
          <span class="drum-col-title">Minutes • 分</span>
          <span class="drum-col-title">Seconds • 秒</span>
        </div>

        <div class="ios-wheel-picker" aria-label="Timer ${this.index + 1} 3D Drum Picker">
          <div class="ios-picker-highlight"></div>
          <div class="ios-picker-column hours-col" data-type="hours" tabindex="0" role="spinbutton" aria-label="Select Hours" aria-valuemin="0" aria-valuemax="23" aria-valuenow="0">
            <div class="ios-picker-wheel"></div>
          </div>
          <div class="ios-picker-separator"></div>
          <div class="ios-picker-column minutes-col" data-type="minutes" tabindex="0" role="spinbutton" aria-label="Select Minutes" aria-valuemin="0" aria-valuemax="59" aria-valuenow="0">
            <div class="ios-picker-wheel"></div>
          </div>
          <div class="ios-picker-separator"></div>
          <div class="ios-picker-column seconds-col" data-type="seconds" tabindex="0" role="spinbutton" aria-label="Select Seconds" aria-valuemin="0" aria-valuemax="59" aria-valuenow="0">
            <div class="ios-picker-wheel"></div>
          </div>
        </div>

        <div class="month-nav-row" aria-label="Quick Time Presets">
          <button type="button" class="month-nav-btn preset-btn" data-add-sec="30" title="Add 30 Seconds">+30s</button>
          <button type="button" class="month-nav-btn preset-btn" data-add-sec="60" title="Add 1 Minute">+1m</button>
          <button type="button" class="month-nav-btn today-btn preset-btn" data-add-sec="300" title="Add 5 Minutes">+5m</button>
          <button type="button" class="month-nav-btn preset-btn" data-add-sec="900" title="Add 15 Minutes">+15m</button>
          <button type="button" class="month-nav-btn preset-clear-btn" title="Zero Drum Picker">00:00</button>
        </div>

        <!-- Hidden select elements to maintain full API / DOM backwards compatibility -->
        <select class="hoursSelect sr-only" aria-label="Hours" tabindex="-1"></select>
        <select class="minutesSelect sr-only" aria-label="Minutes" tabindex="-1"></select>
        <select class="secondsSelect sr-only" aria-label="Seconds" tabindex="-1"></select>
      </div>

      <div class="chronometer-readout-panel">
        <div class="readout-top-bar">
          <span class="target-summary">SET: <strong class="target-duration-text">00h 00m 00s</strong></span>
          <span class="progress-pct">0%</span>
        </div>

        <div class="display-row">
          <div class="radial-gauge" aria-hidden="true">
            <svg viewBox="0 0 44 44">
              <circle class="gauge-track" cx="22" cy="22" r="18"></circle>
              <circle class="gauge-Ticks" cx="22" cy="22" r="18"></circle>
              <circle class="gauge-fill" cx="22" cy="22" r="18"></circle>
            </svg>
            <span class="gauge-center-dot"></span>
          </div>

          <div class="display-stack">
            <div class="display">00:00:00:00</div>
            <div class="display-unit-sublabels" aria-hidden="true">
              <span>HRS</span>
              <span>MIN</span>
              <span>SEC</span>
              <span>CS</span>
            </div>
          </div>
        </div>

        <div class="chronometer-progress-track" aria-hidden="true">
          <div class="chronometer-progress-bar"></div>
        </div>
      </div>

      <div class="controls">
        <button class="startBtn">▶ Start</button>
        <button class="stopBtn">⏸ Stop</button>
        <button class="resetBtn">↺ Reset</button>
      </div>
    `;

    this.wrapper = wrapper;
    this.titleInput = wrapper.querySelector(".timer-title-input");
    this.statusTextEl = wrapper.querySelector(".status-text");
    this.hoursSelect = wrapper.querySelector(".hoursSelect");
    this.minutesSelect = wrapper.querySelector(".minutesSelect");
    this.secondsSelect = wrapper.querySelector(".secondsSelect");
    this.hoursColEl = wrapper.querySelector(".hours-col");
    this.minutesColEl = wrapper.querySelector(".minutes-col");
    this.secondsColEl = wrapper.querySelector(".seconds-col");
    this.display = wrapper.querySelector(".display");
    this.targetTextEl = wrapper.querySelector(".target-duration-text");
    this.progressPctEl = wrapper.querySelector(".progress-pct");
    this.progressBarEl = wrapper.querySelector(".chronometer-progress-bar");
    this.gaugeFillEl = wrapper.querySelector(".gauge-fill");
    this.startBtn = wrapper.querySelector(".startBtn");
    this.stopBtn = wrapper.querySelector(".stopBtn");
    this.resetBtn = wrapper.querySelector(".resetBtn");

    timersContainer.appendChild(wrapper);
  }

  populatePickers() {
    this.populateSelect(this.hoursSelect, 23);
    this.populateSelect(this.minutesSelect, 59);
    this.populateSelect(this.secondsSelect, 59);
  }

  populateSelect(select, max) {
    const frag = document.createDocumentFragment();
    for (let i = 0; i <= max; i++) {
      const option = document.createElement("option");
      option.value = i;
      option.textContent = String(i).padStart(2, "0");
      frag.appendChild(option);
    }
    select.appendChild(frag);
  }

  initWheelPicker() {
    const onWheelValueChange = () => {
      if (this.syncingWheel) return;
      const h = HOURS_ITEMS[this.hoursWheel.currentIndex]?.value ?? 0;
      const m = MINUTES_ITEMS[this.minutesWheel.currentIndex]?.value ?? 0;
      const s = SECONDS_ITEMS[this.secondsWheel.currentIndex]?.value ?? 0;

      this.hoursSelect.value = String(h);
      this.minutesSelect.value = String(m);
      this.secondsSelect.value = String(s);

      if (!this.isRunning) {
        this.hasStartedBefore = false;
      }
      this.updateTargetSummary();
      updateStudioTelemetry();
    };

    this.hoursWheel = new CylinderWheelColumn({
      container: this.hoursColEl,
      wheelEl: this.hoursColEl.querySelector(".ios-picker-wheel"),
      items: HOURS_ITEMS,
      onChange: onWheelValueChange,
    });

    this.minutesWheel = new CylinderWheelColumn({
      container: this.minutesColEl,
      wheelEl: this.minutesColEl.querySelector(".ios-picker-wheel"),
      items: MINUTES_ITEMS,
      onChange: onWheelValueChange,
    });

    this.secondsWheel = new CylinderWheelColumn({
      container: this.secondsColEl,
      wheelEl: this.secondsColEl.querySelector(".ios-picker-wheel"),
      items: SECONDS_ITEMS,
      onChange: onWheelValueChange,
    });

    this.hoursWheel.setImmediate(0, false);
    this.minutesWheel.setImmediate(0, false);
    this.secondsWheel.setImmediate(0, false);
  }

  setPickerTime(h, m, s, animate = true) {
    h = clamp(parseInt(h, 10) || 0, 0, 23);
    m = clamp(parseInt(m, 10) || 0, 0, 59);
    s = clamp(parseInt(s, 10) || 0, 0, 59);

    this.hoursSelect.value = String(h);
    this.minutesSelect.value = String(m);
    this.secondsSelect.value = String(s);

    this.syncingWheel = true;
    if (animate) {
      this.hoursWheel.snapTo(h, 240, false);
      this.minutesWheel.snapTo(m, 240, false);
      this.secondsWheel.snapTo(s, 240, false);
    } else {
      this.hoursWheel.setImmediate(h, false);
      this.minutesWheel.setImmediate(m, false);
      this.secondsWheel.setImmediate(s, false);
    }
    this.syncingWheel = false;

    if (!this.isRunning) {
      this.hasStartedBefore = false;
    }
    this.updateTargetSummary();
    updateStudioTelemetry();
  }

  getConfiguredSeconds() {
    const h = parseInt(this.hoursSelect.value, 10) || 0;
    const m = parseInt(this.minutesSelect.value, 10) || 0;
    const s = parseInt(this.secondsSelect.value, 10) || 0;
    return h * 3600 + m * 60 + s;
  }

  updateTargetSummary() {
    const h = String(parseInt(this.hoursSelect.value, 10) || 0).padStart(2, "0");
    const m = String(parseInt(this.minutesSelect.value, 10) || 0).padStart(2, "0");
    const s = String(parseInt(this.secondsSelect.value, 10) || 0).padStart(2, "0");
    if (this.targetTextEl) {
      this.targetTextEl.textContent = `${h}h ${m}m ${s}s`;
    }
    if (!this.isRunning && !this.isExpired) {
      const configuredSec = this.getConfiguredSeconds();
      this.updateProgressVisuals(configuredSec > 0 ? 1 : 0);
      if (this.progressPctEl) {
        this.progressPctEl.textContent = configuredSec > 0 ? "READY" : "0%";
      }
    }
  }

  updateProgressVisuals(ratio) {
    const clamped = clamp(ratio, 0, 1);
    const pct = Math.round(clamped * 100);
    if (this.progressPctEl) {
      this.progressPctEl.textContent = `${pct}%`;
    }
    if (this.progressBarEl) {
      this.progressBarEl.style.width = `${(clamped * 100).toFixed(1)}%`;
    }
    if (this.gaugeFillEl) {
      const circumference = 113.1;
      const offset = circumference * (1 - clamped);
      this.gaugeFillEl.style.strokeDashoffset = offset.toFixed(2);
    }
  }

  setStatusState(mode) {
    this.wrapper.classList.remove("is-running", "is-paused", "expired");
    if (mode === "running") {
      this.wrapper.classList.add("is-running");
      if (this.statusTextEl) this.statusTextEl.textContent = "RUNNING";
    } else if (mode === "paused") {
      this.wrapper.classList.add("is-paused");
      if (this.statusTextEl) this.statusTextEl.textContent = "PAUSED";
    } else if (mode === "expired") {
      this.wrapper.classList.add("expired");
      if (this.statusTextEl) this.statusTextEl.textContent = "TIME UP";
    } else {
      if (this.statusTextEl) this.statusTextEl.textContent = "STANDBY";
    }
  }

  attachEvents() {
    this.startBtn.addEventListener("click", () => this.start());
    this.stopBtn.addEventListener("click", () => this.stop());
    this.resetBtn.addEventListener("click", () => this.reset());

    // Keep 3D wheels synced if hidden <select> elements are changed programmatically
    const onSelectChange = () => {
      this.setPickerTime(
        this.hoursSelect.value,
        this.minutesSelect.value,
        this.secondsSelect.value,
        true
      );
    };
    this.hoursSelect.addEventListener("change", onSelectChange);
    this.minutesSelect.addEventListener("change", onSelectChange);
    this.secondsSelect.addEventListener("change", onSelectChange);

    // Quick Preset buttons (+30s, +1m, +5m, +15m, Clear)
    this.wrapper.querySelectorAll(".preset-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const addSec = parseInt(btn.dataset.addSec, 10) || 0;
        const total = clamp(
          this.getConfiguredSeconds() + addSec,
          0,
          23 * 3600 + 59 * 60 + 59
        );
        const h = Math.floor(total / 3600);
        const m = Math.floor((total % 3600) / 60);
        const s = total % 60;
        this.setPickerTime(h, m, s, true);
      });
    });

    const clearBtn = this.wrapper.querySelector(".preset-clear-btn");
    clearBtn?.addEventListener("click", () => {
      this.setPickerTime(0, 0, 0, true);
    });

    this.titleInput?.addEventListener("input", () => {
      applyFilterAndSearch();
    });
  }

  start() {
    if (this.isRunning) return;

    const h = parseInt(this.hoursSelect.value, 10) || 0;
    const m = parseInt(this.minutesSelect.value, 10) || 0;
    const s = parseInt(this.secondsSelect.value, 10) || 0;

    // ⏱️ If first start, calculate full duration from pickers
    if (!this.hasStartedBefore || this.duration <= 0) {
      this.initialDuration = (h * 3600 + m * 60 + s) * 1000;
      this.duration = this.initialDuration;

      if (this.duration <= 0) {
        alert(`Timer ${this.index + 1}: Please set a time`);
        return;
      }

      this.hasStartedBefore = true;
    }

    this.isExpired = false;
    this.wrapper.classList.remove("blink-border");
    stopTitleBlinkIfNoneExpired();

    // 🕒 Set new endTime and start interval
    this.endTime = Date.now() + this.duration;
    this.timer = setInterval(() => this.update(), 10);
    this.isRunning = true;
    this.setStatusState("running");
    updateStudioTelemetry();
  }

  stop() {
    const wasRunning = this.isRunning;
    if (wasRunning) {
      clearInterval(this.timer);
      this.duration = Math.max(0, this.endTime - Date.now()); // Save remaining
      this.isRunning = false;
      this.setStatusState("paused");
    }

    this.isExpired = false;
    this.wrapper.classList.remove("blink-border", "expired");
    silenceAlarmAudio();
    stopTitleBlink();
    updateStudioTelemetry();
  }

  reset() {
    clearInterval(this.timer);
    this.isRunning = false;
    this.hasStartedBefore = false;
    this.isExpired = false;
    this.duration = 0;
    this.display.textContent = "00:00:00:00";
    this.updateProgressVisuals(0);
    this.setStatusState("standby");

    silenceAlarmAudio();
    this.wrapper.classList.remove("blink-border", "expired");
    stopTitleBlink();
    updateStudioTelemetry();
  }

  update() {
    const remaining = this.endTime - Date.now();
    if (remaining <= 0) {
      clearInterval(this.timer);
      this.display.textContent = "00:00:00:00";
      this.isRunning = false;
      this.duration = 0;
      this.isExpired = true;
      this.updateProgressVisuals(1);
      this.setStatusState("expired");

      const alarm = document.getElementById("alarmSound");
      if (alarm && !studioState.audioMuted) {
        alarm.play().catch(() => {});
      }
      if (navigator.vibrate) {
        try {
          navigator.vibrate([300, 100, 300]);
        } catch (_) {}
      }

      this.wrapper.classList.add("blink-border");
      startTitleBlink(this.index);
      triggerCelebrationFireworks();
      updateStudioTelemetry();
      return;
    }

    if (this.initialDuration > 0) {
      this.updateProgressVisuals(remaining / this.initialDuration);
    }

    let hours = Math.floor(remaining / (1000 * 60 * 60));
    let minutes = Math.floor((remaining / (1000 * 60)) % 60);
    let seconds = Math.floor((remaining / 1000) % 60);
    let milliseconds = Math.floor((remaining % 1000) / 10);

    hours = String(hours).padStart(2, "0");
    minutes = String(minutes).padStart(2, "0");
    seconds = String(seconds).padStart(2, "0");
    milliseconds = String(milliseconds).padStart(2, "0");

    this.display.textContent = `${hours}:${minutes}:${seconds}:${milliseconds}`;
  }
}

// ============================================================================
// 3. ALARM, TITLE BLINK & CELEBRATION FIREWORKS
// ============================================================================

function silenceAlarmAudio() {
  const alarm = document.getElementById("alarmSound");
  if (alarm) {
    alarm.pause();
    alarm.currentTime = 0;
  }
  const silenceBtn = document.getElementById("silenceAlarmBtn");
  if (silenceBtn) silenceBtn.hidden = true;
}

function stopTitleBlinkIfNoneExpired() {
  const anyExpired = allTimers.some((t) => t.isExpired);
  if (!anyExpired) {
    stopTitleBlink();
  }
}

function startTitleBlink(timerNo) {
  const silenceBtn = document.getElementById("silenceAlarmBtn");
  if (silenceBtn) silenceBtn.hidden = false;

  if (titleBlinkInterval) return;

  let showAlert = true;
  titleBlinkInterval = setInterval(() => {
    document.title = showAlert
      ? `🔴 TIMER ${timerNo + 1} TIME UP!`
      : originalTitle;
    showAlert = !showAlert;
  }, 1000);
}

function stopTitleBlink() {
  clearInterval(titleBlinkInterval);
  titleBlinkInterval = null;
  document.title = originalTitle;
}

function triggerCelebrationFireworks() {
  const container = document.getElementById("fireworksContainer");
  if (!container || typeof window.Fireworks !== "function") return;

  if (!studioState.fireworksInstance) {
    studioState.fireworksInstance = new window.Fireworks(container, {
      hue: { min: 25, max: 52 },
      speed: 3,
      acceleration: 1.03,
      friction: 0.97,
      gravity: 1.5,
      particles: 90,
      trace: 3,
      explosion: 6,
      autoresize: true,
      brightness: { min: 55, max: 88, decay: { min: 0.015, max: 0.03 } },
    });
  }

  studioState.fireworksInstance.start();
  clearTimeout(studioState.fireworksTimeout);
  studioState.fireworksTimeout = setTimeout(() => {
    studioState.fireworksInstance?.stop();
  }, 6500);
}

// ============================================================================
// 4. STUDIO TELEMETRY, FILTERING, MASTER CLOCK & STAGE LIGHTING
// ============================================================================

function Zellercongruence(d, m, y) {
  if (m < 3) {
    m += 12;
    y -= 1;
  }
  const k = y % 100;
  const j = Math.floor(y / 100);
  const h =
    (d +
      Math.floor((13 * (m + 1)) / 5) +
      k +
      Math.floor(k / 4) +
      Math.floor(j / 4) +
      5 * j) %
    7;
  return (h + 6) % 7;
}

function updateMasterReferenceClock() {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  const d = now.getDate();

  const yearEl = document.getElementById("refYear");
  const dateEl = document.getElementById("refDate");
  const weekEl = document.getElementById("refWeekday");
  const clockEl = document.getElementById("refClock");

  if (yearEl) yearEl.textContent = `${y} 年`;
  if (dateEl) dateEl.textContent = `${m}月 ${d}日`;
  if (weekEl) weekEl.textContent = WEEKDAY_LABELS[Zellercongruence(d, m, y)] || "(日)";
  if (clockEl) {
    clockEl.textContent = now.toLocaleTimeString("en-GB", { hour12: false });
  }
}

function updateStudioTelemetry() {
  let runningCount = 0;
  let expiredCount = 0;
  let configuredCount = 0;

  for (const t of allTimers) {
    if (t.isRunning) runningCount++;
    if (t.isExpired || t.wrapper.classList.contains("blink-border")) expiredCount++;
    if (t.isRunning || t.getConfiguredSeconds() > 0 || t.duration > 0) {
      configuredCount++;
    }
  }

  const runEl = document.getElementById("runningCountVal");
  const alertEl = document.getElementById("alertCountVal");
  const totalEl = document.getElementById("totalCountVal");
  if (runEl) runEl.textContent = String(runningCount);
  if (alertEl) alertEl.textContent = String(expiredCount);
  if (totalEl) totalEl.textContent = String(allTimers.length);

  const bAll = document.getElementById("badgeAll");
  const bRun = document.getElementById("badgeRunning");
  const bCfg = document.getElementById("badgeConfigured");
  const bExp = document.getElementById("badgeExpired");
  if (bAll) bAll.textContent = String(allTimers.length);
  if (bRun) bRun.textContent = String(runningCount);
  if (bCfg) bCfg.textContent = String(configuredCount);
  if (bExp) bExp.textContent = String(expiredCount);

  const silenceBtn = document.getElementById("silenceAlarmBtn");
  if (silenceBtn) silenceBtn.hidden = expiredCount === 0;

  applyFilterAndSearch();
}

function applyFilterAndSearch() {
  const filter = studioState.activeFilter;
  const q = studioState.searchQuery.trim().toLowerCase();

  for (const t of allTimers) {
    let matchesFilter = true;
    if (filter === "running") {
      matchesFilter = t.isRunning;
    } else if (filter === "configured") {
      matchesFilter =
        t.isRunning || t.getConfiguredSeconds() > 0 || t.duration > 0;
    } else if (filter === "expired") {
      matchesFilter =
        t.isExpired || t.wrapper.classList.contains("blink-border");
    }

    let matchesQuery = true;
    if (q) {
      const idStr = `#${t.index + 1}`;
      const padIdStr = `#${String(t.index + 1).padStart(2, "0")}`;
      const numOnly = String(t.index + 1);
      const label = (t.titleInput?.value || "").toLowerCase();
      matchesQuery =
        idStr.includes(q) ||
        padIdStr.includes(q) ||
        numOnly === q ||
        label.includes(q);
    }

    t.wrapper.style.display = matchesFilter && matchesQuery ? "" : "none";
  }
}

function initStudioControls() {
  // Filter pills
  document.querySelectorAll(".filter-pill").forEach((pill) => {
    pill.addEventListener("click", () => {
      document.querySelectorAll(".filter-pill").forEach((p) => {
        p.classList.remove("active");
        p.setAttribute("aria-selected", "false");
      });
      pill.classList.add("active");
      pill.setAttribute("aria-selected", "true");
      studioState.activeFilter = pill.dataset.filter || "all";
      applyFilterAndSearch();
    });
  });

  // Search box
  const searchInput = document.getElementById("timerSearchInput");
  searchInput?.addEventListener("input", (e) => {
    studioState.searchQuery = e.target.value || "";
    applyFilterAndSearch();
  });

  // Ambient Stage Lighting Controller (adapted from ref/script.js initStageLighting)
  const lightSlider = document.getElementById("lightSlider");
  const uiVal = document.getElementById("val");
  let intensity =
    parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--light-intensity"
      )
    ) || 0.65;

  const setIntensity = (v) => {
    intensity = clamp(v, 0.1, 1);
    document.documentElement.style.setProperty(
      "--light-intensity",
      intensity.toFixed(3)
    );
    if (uiVal) uiVal.textContent = intensity.toFixed(2);
    if (lightSlider) lightSlider.value = String(intensity);
  };

  setIntensity(intensity);

  lightSlider?.addEventListener("input", (e) => {
    setIntensity(parseFloat(e.target.value));
  });

  window.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT") return;
    if (e.key === "+" || e.key === "=") setIntensity(intensity + 0.05);
    else if (e.key === "-" || e.key === "_") setIntensity(intensity - 0.05);
  });

  // Sound toggle & Silence button
  const soundToggleBtn = document.getElementById("soundToggleBtn");
  const soundIcon = document.getElementById("soundIcon");
  const soundLabel = document.getElementById("soundLabel");

  soundToggleBtn?.addEventListener("click", () => {
    studioState.audioMuted = !studioState.audioMuted;
    if (soundIcon) soundIcon.textContent = studioState.audioMuted ? "🔕" : "🔔";
    if (soundLabel) {
      soundLabel.textContent = studioState.audioMuted ? "Muted" : "Audio On";
    }
    if (studioState.audioMuted) silenceAlarmAudio();
  });

  document.getElementById("silenceAlarmBtn")?.addEventListener("click", () => {
    silenceAlarmAudio();
    allTimers.forEach((t) => {
      if (t.isExpired) {
        t.isExpired = false;
        t.wrapper.classList.remove("blink-border", "expired");
        t.setStatusState("standby");
      }
    });
    stopTitleBlink();
    updateStudioTelemetry();
  });

  // Batch Controls
  document.getElementById("demoShowcaseBtn")?.addEventListener("click", () => {
    const presets = [
      { idx: 0, h: 0, m: 1, s: 30, run: true },
      { idx: 1, h: 0, m: 5, s: 0, run: true },
      { idx: 2, h: 0, m: 25, s: 0, run: false },
      { idx: 3, h: 1, m: 15, s: 45, run: true },
      { idx: 4, h: 0, m: 3, s: 15, run: false },
      { idx: 5, h: 2, m: 0, s: 0, run: false },
    ];
    presets.forEach(({ idx, h, m, s, run }) => {
      const timer = allTimers[idx];
      if (!timer) return;
      timer.reset();
      timer.setPickerTime(h, m, s, true);
      if (run) timer.start();
    });
    updateStudioTelemetry();
  });

  document.getElementById("pauseAllBtn")?.addEventListener("click", () => {
    allTimers.forEach((t) => {
      if (t.isRunning) t.stop();
    });
    updateStudioTelemetry();
  });

  document.getElementById("resetAllBtn")?.addEventListener("click", () => {
    allTimers.forEach((t) => t.reset());
    updateStudioTelemetry();
  });

  // Golden Spark Cursor Trail (adapted from ref/script.js)
  document.addEventListener("mousemove", (e) => {
    const cur = performance.now();
    if (cur - studioState.lastTrailTime < 45) return;
    studioState.lastTrailTime = cur;

    const trail = document.createElement("div");
    trail.className = "trail";
    trail.style.left = `${e.pageX}px`;
    trail.style.top = `${e.pageY}px`;
    document.body.appendChild(trail);
    setTimeout(() => trail.remove(), 550);
  });
}

// ============================================================================
// 5. BACKGROUND HOROLOGICAL ASTROLABE & CLOCKWORK ESCAPEMENT CANVAS
// ============================================================================

function initClockworkBackgroundCanvas() {
  const canvas = document.getElementById("clockworkCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const motes = Array.from({ length: 45 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: 0.9 + Math.random() * 2.3,
    vx: (Math.random() - 0.5) * 0.25,
    vy: -0.15 - Math.random() * 0.35,
    alpha: 0.25 + Math.random() * 0.55,
  }));

  function drawGear(cx, cy, outerR, innerR, teeth, angle, color, lineWidth = 1.4) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;

    const step = (Math.PI * 2) / teeth;
    ctx.beginPath();
    for (let i = 0; i < teeth; i++) {
      const a0 = i * step;
      const a1 = a0 + step * 0.25;
      const a2 = a0 + step * 0.5;
      const a3 = a0 + step * 0.75;
      ctx.lineTo(Math.cos(a0) * innerR, Math.sin(a0) * innerR);
      ctx.lineTo(Math.cos(a1) * outerR, Math.sin(a1) * outerR);
      ctx.lineTo(Math.cos(a2) * outerR, Math.sin(a2) * outerR);
      ctx.lineTo(Math.cos(a3) * innerR, Math.sin(a3) * innerR);
    }
    ctx.closePath();
    ctx.stroke();

    // Inner rim & spokes
    ctx.beginPath();
    ctx.arc(0, 0, innerR * 0.78, 0, Math.PI * 2);
    ctx.stroke();

    const spokes = 6;
    for (let s = 0; s < spokes; s++) {
      const sa = (s * Math.PI * 2) / spokes;
      ctx.beginPath();
      ctx.moveTo(Math.cos(sa) * (innerR * 0.2), Math.sin(sa) * (innerR * 0.2));
      ctx.lineTo(Math.cos(sa) * (innerR * 0.78), Math.sin(sa) * (innerR * 0.78));
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(0, 0, innerR * 0.2, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  let tickAngle = 0;
  function renderFrame() {
    ctx.clearRect(0, 0, width, height);

    const anyRunning = allTimers.some((t) => t.isRunning);
    tickAngle += anyRunning ? 0.0045 : 0.0014;

    // Left, Top-Center & Right background horological escapement gears
    drawGear(
      width * 0.08,
      height * 0.24,
      210,
      192,
      36,
      tickAngle,
      "rgba(235, 182, 95, 0.22)",
      1.5
    );
    drawGear(
      width * 0.08 + 260,
      height * 0.24 + 125,
      115,
      102,
      20,
      -tickAngle * 1.8,
      "rgba(245, 200, 120, 0.18)",
      1.3
    );
    drawGear(
      width * 0.92,
      height * 0.68,
      245,
      225,
      44,
      -tickAngle * 0.75,
      "rgba(235, 182, 95, 0.22)",
      1.5
    );

    // Floating warm golden dust motes in the spotlight
    for (const m of motes) {
      m.x += m.vx;
      m.y += m.vy;
      if (m.y < -10) {
        m.y = height + 10;
        m.x = Math.random() * width;
      }
      if (m.x < -10) m.x = width + 10;
      if (m.x > width + 10) m.x = -10;

      ctx.beginPath();
      ctx.fillStyle = `rgba(255, 224, 152, ${m.alpha})`;
      ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(renderFrame);
  }

  requestAnimationFrame(renderFrame);
}

function initNoTextSelection() {
  document.addEventListener("selectstart", (e) => {
    e.preventDefault();
  });

  document.addEventListener("selectionchange", () => {
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed) {
      selection.removeAllRanges();
    }
  });
}

// ============================================================================
// 6. BOOTSTRAP 100 CHRONOMETER MODULES
// ============================================================================

window.addEventListener("DOMContentLoaded", () => {
  initNoTextSelection();
  updateMasterReferenceClock();
  setInterval(updateMasterReferenceClock, 1000);

  for (let i = 0; i < 201; i++) {
    allTimers.push(new CountdownTimer(i));
  }

  // URL hash or query param support for visual verification of active states
  const params = new URLSearchParams(window.location.search);

  initStudioControls();
  initClockworkBackgroundCanvas();
  updateStudioTelemetry();

  if (params.get("demo") === "1") {
    document.getElementById("demoShowcaseBtn")?.click();
  } else if (params.get("demo") === "expired") {
    document.getElementById("demoShowcaseBtn")?.click();
    const t0 = allTimers[0];
    if (t0) {
      t0.endTime = Date.now() - 50;
      t0.update();
    }
  }
});
