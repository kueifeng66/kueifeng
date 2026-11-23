(() => {
  // 1900-2100 Astronomical Lunar Info Table (定朔法)
  const LUNAR_INFO = [
    0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
    0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
    0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
    0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
    0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
    0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0,
    0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
    0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6,
    0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
    0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x05ac0, 0x0ab60, 0x096d5, 0x092e0,
    0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
    0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
    0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
    0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,
    0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0,
    0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0,
    0x092e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4,
    0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0,
    0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160,
    0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a4d0, 0x0d150, 0x0f252,
    0x0d520,
  ];

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

  const leapMonth = (y) => LUNAR_INFO[y - 1900] & 0xf;
  const leapDays = (y) => (leapMonth(y) ? ((LUNAR_INFO[y - 1900] & 0x10000) ? 30 : 29) : 0);
  const monthDays = (y, m) =>
    m >= 1 && m <= 12 ? ((LUNAR_INFO[y - 1900] & (0x10000 >> m)) ? 30 : 29) : -1;

  function lYearDays(y) {
    let sum = 348;
    const info = LUNAR_INFO[y - 1900];
    for (let i = 0x8000; i > 0x8; i >>= 1) {
      if (info & i) sum += 1;
    }
    return sum + leapDays(y);
  }

  function solar2lunar(y, m, d) {
    if (y < 1900 || y > 2100) return null;
    let offset = (Date.UTC(y, m - 1, d) - Date.UTC(1900, 0, 31)) / 86400000;
    let temp = 0;
    let i;

    for (i = 1900; i < 2101 && offset > 0; i++) {
      temp = lYearDays(i);
      offset -= temp;
    }
    if (offset < 0) {
      offset += temp;
      i--;
    }

    const lYear = i;
    const leap = leapMonth(lYear);
    let isLeap = false;

    for (i = 1; i < 13 && offset > 0; i++) {
      if (leap > 0 && i === leap + 1 && !isLeap) {
        --i;
        isLeap = true;
        temp = leapDays(lYear);
      } else {
        temp = monthDays(lYear, i);
      }
      if (isLeap && i === leap + 1) isLeap = false;
      offset -= temp;
    }

    if (offset === 0 && leap > 0 && i === leap + 1) {
      if (isLeap) isLeap = false;
      else {
        isLeap = true;
        --i;
      }
    }
    if (offset < 0) {
      offset += temp;
      --i;
    }

    const lMonth = i;
    const lDay = Math.floor(offset + 1);
    const mDays = isLeap ? leapDays(lYear) : monthDays(lYear, lMonth);
    return { lYear, lMonth, lDay, isLeap, isBig: mDays === 30 };
  }

  function isLunarNewYearDay(dateObj) {
    const l = solar2lunar(dateObj.getFullYear(), dateObj.getMonth() + 1, dateObj.getDate());
    return Boolean(l && l.lMonth === 1 && l.lDay === 1 && !l.isLeap);
  }

  function findLunarNewYearDate(year) {
    // Scan Jan and Feb: Lunar New Year's Eve (除夕) is the day before Lunar 1/1
    for (let m = 1; m <= 2; m++) {
      const daysInMonth = new Date(year, m, 0).getDate();
      for (let d = 1; d <= daysInMonth; d++) {
        if (isLunarNewYearDay(new Date(year, m - 1, d + 1))) {
          return new Date(year, m - 1, d, 0, 0, 0, 0);
        }
      }
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
        dedication: 'Kueifeng wishes you a Happy New Year',
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
      dedication: 'Kueifeng wishes you a Happy Chinese New Year',
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
  const dedicationTextEl = document.getElementById('dedication-text');
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
    dedicationTextEl.textContent = target.dedication;

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