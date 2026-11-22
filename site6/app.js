(() => {
  // Dates of the last day of the twelfth lunar month (Chinese New Year's Eve / 除夕)
  const LUNAR_NEW_YEARS_EVE_TABLE = {
    2025: [1, 28],
    2026: [2, 16],
    2027: [2, 5],
    2028: [1, 25],
    2029: [2, 12],
    2030: [2, 2],
    2031: [1, 22],
    2032: [2, 10],
    2033: [1, 30],
    2034: [2, 18],
    2035: [2, 7],
  };

  const STEMS_ZH = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  const BRANCHES_ZH = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  const ELEMENTS_EN = ['Wood', 'Wood', 'Fire', 'Fire', 'Earth', 'Earth', 'Metal', 'Metal', 'Water', 'Water'];
  const ANIMALS_EN = [
    'Rat',
    'Ox',
    'Tiger',
    'Rabbit',
    'Dragon',
    'Snake',
    'Horse',
    'Goat',
    'Monkey',
    'Rooster',
    'Dog',
    'Pig',
  ];

  function findLunarNewYearDate(year) {
    if (LUNAR_NEW_YEARS_EVE_TABLE[year]) {
      const [month, day] = LUNAR_NEW_YEARS_EVE_TABLE[year];
      return new Date(year, month - 1, day, 0, 0, 0, 0);
    }

    // Fallback via Intl Chinese calendar: locate the last day of the twelfth lunar month (除夕)
    try {
      const fmt = new Intl.DateTimeFormat('en-u-ca-chinese', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      });
      let prevDate = null;
      let prevMonth = null;
      for (let m = 0; m < 2; m++) {
        for (let d = 1; d <= 31; d++) {
          const dt = new Date(year, m, d, 12, 0, 0);
          if (dt.getMonth() !== m) continue;
          const parts = fmt.formatToParts(dt);
          const mp = parts.find((p) => p.type === 'month')?.value;
          const dp = parts.find((p) => p.type === 'day')?.value;
          if (mp === '1' && dp === '1' && prevMonth === '12' && prevDate) {
            return new Date(
              prevDate.getFullYear(),
              prevDate.getMonth(),
              prevDate.getDate(),
              0,
              0,
              0,
              0
            );
          }
          prevDate = dt;
          prevMonth = mp;
        }
      }
    } catch {
      // Fallback if Intl chinese calendar is unavailable
    }
    return new Date(year, 0, 31, 0, 0, 0, 0);
  }

  function getZodiacMeta(year) {
    const stemIdx = ((year - 4) % 10 + 10) % 10;
    const branchIdx = ((year - 4) % 12 + 12) % 12;
    return {
      hanzi: `${STEMS_ZH[stemIdx]}${BRANCHES_ZH[branchIdx]}年`,
      english: `Year of the ${ELEMENTS_EN[stemIdx]} ${ANIMALS_EN[branchIdx]}`,
    };
  }

  function getTargetEvent(mode) {
    const now = new Date();
    if (mode === 'gregorian') {
      const targetYear = now.getFullYear() + 1;
      const targetDate = new Date(targetYear, 0, 1, 0, 0, 0, 0);
      return {
        mode,
        year: targetYear,
        date: targetDate,
        hanzi: '元旦迎新',
        subtitle: 'Gregorian New Year',
      };
    }

    let targetYear = now.getFullYear();
    let targetDate = findLunarNewYearDate(targetYear);
    if (now.getTime() >= targetDate.getTime() + 86400000) {
      targetYear += 1;
      targetDate = findLunarNewYearDate(targetYear);
    }
    const zodiac = getZodiacMeta(targetYear);
    return {
      mode: 'lunar',
      year: targetYear,
      date: targetDate,
      hanzi: zodiac.hanzi,
      subtitle: zodiac.english,
    };
  }

  // Initialize Canvas Engines
  const stageCanvas = document.getElementById('stage-canvas');
  const audio = new window.CelestialAudio();
  const fireworks = new window.PyrotechnicsEngine(audio);
  const scene = new window.CelestialScene(stageCanvas, fireworks);
  scene.start();

  // DOM Elements
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');
  const yearDisplayEl = document.getElementById('new-year');
  const zodiacHanziEl = document.getElementById('zodiac-hanzi');
  const zodiacEnEl = document.getElementById('zodiac-en');
  const targetDateLabelEl = document.getElementById('target-date-label');
  const celebrationBannerEl = document.getElementById('celebration-banner');
  const liveAnnouncerEl = document.getElementById('live-announcer');

  const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));
  const finaleBtn = document.getElementById('finale-btn');
  const finaleBtnLabel = document.getElementById('finale-btn-label');
  const motionToggleBtn = document.getElementById('motion-toggle-btn');
  const motionBtnLabel = document.getElementById('motion-btn-label');
  const motionPauseIcon = document.getElementById('motion-icon-pause');
  const motionPlayIcon = document.getElementById('motion-icon-play');

  const audioMenuBtn = document.getElementById('audio-menu-btn');
  const audioPopover = document.getElementById('audio-popover');
  const sfxToggle = document.getElementById('sfx-toggle');
  const musicToggle = document.getElementById('music-toggle');
  const volumeSlider = document.getElementById('audio-volume-slider');

  const openWishBtn = document.getElementById('open-wish-btn');
  const wishDialog = document.getElementById('wish-dialog');
  const wishForm = document.getElementById('wish-form');
  const wishInput = document.getElementById('wish-input');

  let currentMode = 'lunar';
  let currentTarget = getTargetEvent(currentMode);
  let finalePreviewActive = false;
  let lastValues = { days: '', hours: '', minutes: '', seconds: '' };

  function announce(msg) {
    if (!liveAnnouncerEl) return;
    liveAnnouncerEl.textContent = '';
    requestAnimationFrame(() => {
      liveAnnouncerEl.textContent = msg;
    });
  }

  function applyTargetMeta(target) {
    yearDisplayEl.textContent = String(target.year);
    zodiacHanziEl.textContent = target.hanzi;
    zodiacEnEl.textContent = target.subtitle;

    const formatted = target.date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    targetDateLabelEl.textContent =
      target.mode === 'lunar'
        ? `Counting down to ${formatted} · 00:00 (Eve)`
        : `Counting down to ${formatted} · 00:00`;
  }

  function setDigit(el, key, value) {
    const str = String(value).padStart(2, '0');
    if (lastValues[key] === str) return;
    lastValues[key] = str;
    el.textContent = str;
    el.classList.remove('is-ticking');
    void el.offsetWidth;
    el.classList.add('is-ticking');
  }

  function updateCountdown() {
    const nowMs = Date.now();
    const diff = currentTarget.date.getTime() - nowMs;

    if (diff <= 0) {
      setDigit(daysEl, 'days', 0);
      setDigit(hoursEl, 'hours', 0);
      setDigit(minutesEl, 'minutes', 0);
      setDigit(secondsEl, 'seconds', 0);
      celebrationBannerEl.hidden = false;
      if (!finalePreviewActive) {
        fireworks.setFinaleMode(true);
      }
      return;
    }

    const totalSec = Math.floor(diff / 1000);
    const days = Math.floor(totalSec / 86400);
    const hours = Math.floor((totalSec % 86400) / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;

    setDigit(daysEl, 'days', days);
    setDigit(hoursEl, 'hours', hours);
    setDigit(minutesEl, 'minutes', minutes);
    setDigit(secondsEl, 'seconds', seconds);

    if (!finalePreviewActive) {
      celebrationBannerEl.hidden = true;
    }
  }

  applyTargetMeta(currentTarget);
  updateCountdown();
  setInterval(updateCountdown, 250);

  // Mode Switcher
  modeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const nextMode = btn.dataset.mode;
      if (!nextMode || nextMode === currentMode) return;
      currentMode = nextMode;
      modeButtons.forEach((b) => {
        const active = b.dataset.mode === currentMode;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-pressed', String(active));
      });
      currentTarget = getTargetEvent(currentMode);
      applyTargetMeta(currentTarget);
      updateCountdown();
      announce(`Switched countdown to ${currentTarget.subtitle}, ${currentTarget.year}`);
    });
  });

  // Resize & Pointer Parallax & Click-to-Launch
  window.addEventListener('resize', () => scene.resize());

  window.addEventListener('pointermove', (e) => {
    const nx = (e.clientX / Math.max(1, window.innerWidth)) * 2 - 1;
    const ny = (e.clientY / Math.max(1, window.innerHeight)) * 2 - 1;
    scene.setPointerNormalized(nx, ny);
  });

  stageCanvas.addEventListener('pointerdown', (e) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    if (scene.paused) {
      scene.setPaused(false);
      syncPauseButton(false);
    }
    fireworks.launchRocket(e.clientX, e.clientY, { forceBig: true });
  });

  // Finale Preview Toggle
  finaleBtn.addEventListener('click', () => {
    finalePreviewActive = !finalePreviewActive;
    finaleBtn.setAttribute('aria-pressed', String(finalePreviewActive));
    finaleBtnLabel.textContent = finalePreviewActive ? 'Exit Finale' : 'Finale Preview';
    celebrationBannerEl.hidden = !finalePreviewActive;
    fireworks.setFinaleMode(finalePreviewActive);
    if (finalePreviewActive && scene.paused) {
      scene.setPaused(false);
      syncPauseButton(false);
    }
    announce(finalePreviewActive ? 'Celebration finale started' : 'Returned to live countdown');
  });

  // WCAG 2.2.2 Pause / Resume Motion Control
  function syncPauseButton(paused) {
    motionBtnLabel.textContent = paused ? 'Resume Sky' : 'Pause Sky';
    if (paused) {
      motionPauseIcon.setAttribute('hidden', '');
      motionPlayIcon.removeAttribute('hidden');
    } else {
      motionPauseIcon.removeAttribute('hidden');
      motionPlayIcon.setAttribute('hidden', '');
    }
  }

  motionToggleBtn.addEventListener('click', () => {
    const nextPaused = !scene.paused;
    scene.setPaused(nextPaused);
    syncPauseButton(nextPaused);
    announce(nextPaused ? 'Sky animations paused' : 'Sky animations resumed');
  });

  // Respect live OS reduced-motion preference changes
  const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)');
  motionMq.addEventListener('change', (e) => {
    scene.setReducedMotion(e.matches);
  });

  // Audio Controls
  if (audioPopover) {
    audioPopover.addEventListener('toggle', (e) => {
      audioMenuBtn.setAttribute('aria-expanded', String(e.newState === 'open'));
    });
  }

  sfxToggle.addEventListener('click', () => {
    const next = sfxToggle.getAttribute('aria-pressed') !== 'true';
    sfxToggle.setAttribute('aria-pressed', String(next));
    sfxToggle.textContent = next ? 'On' : 'Off';
    audio.setSfxEnabled(next);
  });

  musicToggle.addEventListener('click', async () => {
    const wantOn = musicToggle.getAttribute('aria-pressed') !== 'true';
    const isPlaying = await audio.setMusicEnabled(wantOn);
    musicToggle.setAttribute('aria-pressed', String(isPlaying));
    musicToggle.textContent = isPlaying ? 'On' : 'Off';
  });

  volumeSlider.addEventListener('input', (e) => {
    audio.setVolume(Number(e.target.value) / 100);
  });

  // Cross-browser Top-Layer Exit Transition Helpers (per modern-web-guidance)
  let supportsDisplayTransition;
  function canTransitionDisplay() {
    if (supportsDisplayTransition !== undefined) return supportsDisplayTransition;
    if (!window.CSS?.supports?.('transition-behavior', 'allow-discrete') || !document.body) {
      return false;
    }
    const probe = document.createElement('div');
    probe.style.cssText = 'transition: display 1s allow-discrete !important; display: block;';
    document.body.appendChild(probe);
    getComputedStyle(probe).display;
    probe.style.display = 'none';
    supportsDisplayTransition = getComputedStyle(probe).display === 'block';
    probe.remove();
    return supportsDisplayTransition;
  }

  function supportsTopLayerExit() {
    return window.CSS?.supports?.('overlay', 'auto') && canTransitionDisplay();
  }

  async function closeTopLayer(element, returnVal = '') {
    if (!supportsTopLayerExit()) {
      element.setAttribute('data-closing', '');
      const animations = element.getAnimations({ subtree: true });
      if (animations.length > 0) {
        await Promise.race([
          Promise.allSettled(animations.map((a) => a.finished)),
          new Promise((r) => setTimeout(r, 1200)),
        ]);
      }
      if (!element.hasAttribute('data-closing')) return;
      element.removeAttribute('data-closing');
    }
    element.close(returnVal);
  }

  // Fallback for browsers without <dialog closedby="any">
  if (wishDialog && !('closedBy' in HTMLDialogElement.prototype)) {
    const outside = (e) => {
      const r = wishDialog.getBoundingClientRect();
      return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
    };
    let pressedOutside = false;
    wishDialog.addEventListener('pointerdown', (e) => {
      pressedOutside = outside(e);
    });
    wishDialog.addEventListener('pointerup', (e) => {
      if (pressedOutside && outside(e)) closeTopLayer(wishDialog, 'cancel');
    });
  }

  openWishBtn.addEventListener('click', () => {
    wishDialog.showModal();
  });

  wishDialog.addEventListener('cancel', (e) => {
    e.preventDefault();
    closeTopLayer(wishDialog, 'cancel');
  });

  wishForm.addEventListener('submit', (e) => {
    const submitter = e.submitter;
    const actionVal = submitter ? submitter.value : 'cancel';
    e.preventDefault();

    if (actionVal === 'release') {
      const wishText = (wishInput.value || '').trim() || 'Peace & Bright Horizons';
      const selectedColor =
        wishForm.querySelector('input[name="lanternColor"]:checked')?.value || 'gold';
      closeTopLayer(wishDialog, 'release').then(() => {
        if (scene.paused) {
          scene.setPaused(false);
          syncPauseButton(false);
        }
        scene.releaseWishLantern(wishText, selectedColor);
        audio.playLanternChime();
        saveWish(wishText, selectedColor);
        wishInput.value = '';
        announce(`Released sky lantern with wish: ${wishText}`);
      });
    } else {
      closeTopLayer(wishDialog, 'cancel');
    }
  });

  wishDialog.addEventListener('close', () => {
    wishDialog.returnValue = '';
  });

  // Restore up to 2 recent user wishes gently on startup
  function saveWish(text, color) {
    try {
      const existing = JSON.parse(localStorage.getItem('cny_wish_lanterns') || '[]');
      existing.unshift({ text, color });
      localStorage.setItem('cny_wish_lanterns', JSON.stringify(existing.slice(0, 3)));
    } catch {
      // Ignore storage quota / private mode issues
    }
  }

  try {
    const saved = JSON.parse(localStorage.getItem('cny_wish_lanterns') || '[]');
    saved.slice(0, 2).forEach((item, idx) => {
      setTimeout(() => {
        if (!scene.paused) {
          scene.releaseWishLantern(item.text, item.color);
        }
      }, 1600 + idx * 2400);
    });
  } catch {
    // Ignore parse errors
  }

  // Opening celebratory firework after initial render settles
  setTimeout(() => {
    if (!scene.paused) {
      fireworks.launchRocket(window.innerWidth * 0.28, window.innerHeight * 0.22, {
        shellType: 'chrysanthemum',
        forceBig: true,
      });
    }
  }, 550);
})();
