/**
 * script.js — Weather Explorer Application Controller
 * Connects OpenWeatherMap + Nominatim geocoding, collapsible bookmark drawer,
 * and EarthGlobe orbital-to-street-level camera engine.
 */

(function () {
  'use strict';

  const API_KEY = '35af5c01f0d331eb99f5a42b0259c663';

  /**
   * Curated destinations (preserving all 29 original cities with region metadata & coords)
   */
  const CURATED_CITIES = [
    // Asia
    { name: 'Taipei', country: 'TW', region: 'asia', lat: 25.0339, lon: 121.5645 },
	{ name: 'Taoyuan Airport', country: 'TW', region: 'asia', lat: 25.0777, lon: 121.2330 },
    { name: 'Beijing', country: 'CN', region: 'asia', lat: 39.9087, lon: 116.3975 },
    { name: 'Tokyo', country: 'JP', region: 'asia', lat: 35.6812, lon: 139.7671 },
    { name: 'Shanghai', country: 'CN', region: 'asia', lat: 31.2397, lon: 121.4998 },
    { name: 'Hong Kong', country: 'HK', region: 'asia', lat: 22.2855, lon: 114.1577 },
    { name: 'Seoul', country: 'KR', region: 'asia', lat: 37.5663, lon: 126.9779 },
    { name: 'Bangkok', country: 'TH', region: 'asia', lat: 13.7463, lon: 100.5347 },
    { name: 'Singapore', country: 'SG', region: 'asia', lat: 1.2834, lon: 103.8607 },
    { name: 'Dubai', country: 'AE', region: 'asia', lat: 25.1972, lon: 55.2744 },

    // Europe
    { name: 'London', country: 'GB', region: 'europe', lat: 51.5007, lon: -0.1246 },
    { name: 'Paris', country: 'FR', region: 'europe', lat: 48.8584, lon: 2.2945 },
    { name: 'Berlin', country: 'DE', region: 'europe', lat: 52.5163, lon: 13.3777 },
    { name: 'Rome', country: 'IT', region: 'europe', lat: 41.8902, lon: 12.4922 },
    { name: 'Amsterdam', country: 'NL', region: 'europe', lat: 52.3731, lon: 4.8926 },
    { name: 'Vienna', country: 'AT', region: 'europe', lat: 48.2085, lon: 16.3731 },
    { name: 'Zurich', country: 'CH', region: 'europe', lat: 47.3717, lon: 8.5422 },
    { name: 'Prague', country: 'CZ', region: 'europe', lat: 50.0875, lon: 14.4213 },
    { name: 'Athens', country: 'GR', region: 'europe', lat: 37.9715, lon: 23.7257 },

    // Americas
    { name: 'New York', country: 'US', region: 'americas', lat: 40.7484, lon: -73.9857 },
    { name: 'Los Angeles', country: 'US', region: 'americas', lat: 34.0505, lon: -118.2551 },
    { name: 'Chicago', country: 'US', region: 'americas', lat: 41.8827, lon: -87.6233 },
    { name: 'Toronto', country: 'CA', region: 'americas', lat: 43.6426, lon: -79.3871 },
    { name: 'Vancouver', country: 'CA', region: 'americas', lat: 49.2888, lon: -123.1111 },
    { name: 'Mexico City', country: 'MX', region: 'americas', lat: 19.4326, lon: -99.1332 },
    { name: 'Miami', country: 'US', region: 'americas', lat: 25.7663, lon: -80.1918 },
    { name: 'Las Vegas', country: 'US', region: 'americas', lat: 36.1147, lon: -115.1728 },
    { name: 'San Francisco', country: 'US', region: 'americas', lat: 37.7952, lon: -122.4028 },

    // Oceania & Africa
    { name: 'Sydney', country: 'AU', region: 'global', lat: -33.8568, lon: 151.2153 },
    { name: 'Melbourne', country: 'AU', region: 'global', lat: -37.8179, lon: 144.9691 },
    { name: 'Cape Town', country: 'ZA', region: 'global', lat: -33.9036, lon: 18.4205 }
  ];

  // App State
  const state = {
    unit: 'C', // 'C' | 'F'
    region: 'all',
    isCollapsed: false,
    activeCityName: '',
    currentWeather: null,
    forecastList: [],
    suggestions: [],
    highlightedIdx: -1,
    suggestTimer: null,
    requestSeq: 0
  };

  // DOM References
  const dom = {
    appShell: document.getElementById('appShell'),
    explorerPanel: document.getElementById('explorerPanel'),
    bookmarkTab: document.getElementById('bookmarkTab'),
    bookmarkIcon: document.getElementById('bookmarkIcon'),
    bookmarkTemp: document.getElementById('bookmarkTemp'),
    bookmarkLabel: document.getElementById('bookmarkLabel'),
    collapsePanelBtn: document.getElementById('collapsePanelBtn'),

    floatingWeatherPill: document.getElementById('floatingWeatherPill'),
    fwpIcon: document.getElementById('fwpIcon'),
    fwpCity: document.getElementById('fwpCity'),
    fwpTemp: document.getElementById('fwpTemp'),
    fwpSub: document.getElementById('fwpSub'),

    searchForm: document.getElementById('searchForm'),
    cityInput: document.getElementById('cityInput'),
    clearSearchBtn: document.getElementById('clearSearchBtn'),
    searchSuggestions: document.getElementById('searchSuggestions'),
    searchStatus: document.getElementById('searchStatus'),

    welcomeEmpty: document.getElementById('welcomeEmpty'),
    weatherCard: document.getElementById('weatherCard'),
    cityName: document.getElementById('cityName'),
    countryCode: document.getElementById('countryCode'),
    localTime: document.getElementById('localTime'),
    description: document.getElementById('description'),
    weatherHeroIcon: document.getElementById('weatherHeroIcon'),
    temperature: document.getElementById('temperature'),
    metricFeels: document.getElementById('metricFeels'),
    metricHumidity: document.getElementById('metricHumidity'),
    metricWind: document.getElementById('metricWind'),
    metricVisibility: document.getElementById('metricVisibility'),
    cardStreetZoomBtn: document.getElementById('cardStreetZoomBtn'),
    cardOrbitBtn: document.getElementById('cardOrbitBtn'),

    forecastSection: document.getElementById('forecastSection'),
    forecast: document.getElementById('forecast'),

    quickCities: document.getElementById('quickCities'),
    cityCountMeta: document.getElementById('cityCountMeta'),
    regionTabs: document.querySelectorAll('.region-tab'),

    unitC: document.getElementById('unitC'),
    unitF: document.getElementById('unitF'),

    mapModeBtns: document.querySelectorAll('[data-map-mode]'),
    toggleBuildingsBtn: document.getElementById('toggleBuildingsBtn'),
    toggleLabelsBtn: document.getElementById('toggleLabelsBtn'),

    zoomInBtn: document.getElementById('zoomInBtn'),
    zoomOutBtn: document.getElementById('zoomOutBtn'),
    streetDiveBtn: document.getElementById('streetDiveBtn'),
    tiltToggleBtn: document.getElementById('tiltToggleBtn'),
    tiltBadge: document.getElementById('tiltBadge'),
    compassBtn: document.getElementById('compassBtn'),
    compassNeedle: document.getElementById('compassNeedle'),
    spaceViewBtn: document.getElementById('spaceViewBtn'),
    spinToggleBtn: document.getElementById('spinToggleBtn'),
    spinIconPause: document.getElementById('spinIconPause'),
    spinIconPlay: document.getElementById('spinIconPlay'),

    tierBtns: document.querySelectorAll('.tier-btn'),
    hudAltitude: document.getElementById('hudAltitude'),
    hudCoords: document.getElementById('hudCoords'),
    exploreHint: document.getElementById('exploreHint')
  };

  /* ==========================================================================
     Crisp Custom Vector Weather Icons (Zero Platform Emojis)
     ========================================================================== */

  function getWeatherSvg(code, isNight = false) {
    const id = Number(code) || 800;

    // Thunderstorm (200-299)
    if (id >= 200 && id < 300) {
      return `<svg viewBox="0 0 48 48" fill="none">
        <path d="M13 31h21a8 8 0 0 0 1.4-15.88A11 11 0 0 0 14.3 12.6 8.5 8.5 0 0 0 13 31Z" fill="url(#clStorm)" stroke="#cbd5e1" stroke-width="1.4"/>
        <path d="M25.5 27 20 36h5.5l-2 8.5L32 34h-5.5l2-7Z" fill="#fbbf24"/>
        <defs><linearGradient id="clStorm" x1="10" y1="8" x2="38" y2="32" gradientUnits="userSpaceOnUse"><stop stop-color="#94a3b8"/><stop offset="1" stop-color="#475569"/></linearGradient></defs>
      </svg>`;
    }

    // Drizzle / Rain (300-599)
    if (id >= 300 && id < 600) {
      return `<svg viewBox="0 0 48 48" fill="none">
        <path d="M13 30h21a8 8 0 0 0 1.4-15.88A11 11 0 0 0 14.3 11.6 8.5 8.5 0 0 0 13 30Z" fill="url(#clRain)" stroke="#bae6fd" stroke-width="1.3"/>
        <path d="M17 34.5 15 40M24 34.5 22 41.5M31 34.5 29 40" stroke="#38bdf8" stroke-width="2.4" stroke-linecap="round"/>
        <defs><linearGradient id="clRain" x1="10" y1="8" x2="36" y2="30" gradientUnits="userSpaceOnUse"><stop stop-color="#e2e8f0"/><stop offset="1" stop-color="#64748b"/></linearGradient></defs>
      </svg>`;
    }

    // Snow (600-699)
    if (id >= 600 && id < 700) {
      return `<svg viewBox="0 0 48 48" fill="none">
        <path d="M13 29h21a8 8 0 0 0 1.4-15.88A11 11 0 0 0 14.3 10.6 8.5 8.5 0 0 0 13 29Z" fill="#e2e8f0" stroke="#ffffff" stroke-width="1.3"/>
        <circle cx="17" cy="35.5" r="2" fill="#bae6fd"/>
        <circle cx="24" cy="39" r="2" fill="#e0f2fe"/>
        <circle cx="31" cy="35.5" r="2" fill="#bae6fd"/>
      </svg>`;
    }

    // Mist / Fog / Atmosphere (700-799)
    if (id >= 700 && id < 800) {
      return `<svg viewBox="0 0 48 48" fill="none">
        <path d="M10 19h28M7 26h34M12 33h24" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
        <path d="M15 12h18" stroke="#cbd5e1" stroke-width="2.5" stroke-linecap="round" opacity="0.7"/>
      </svg>`;
    }

    // Clear (800)
    if (id === 800) {
      if (isNight) {
        return `<svg viewBox="0 0 48 48" fill="none">
          <path d="M31.8 29.8A12.5 12.5 0 0 1 18.2 12a12.5 12.5 0 1 0 17.8 16.2 12.3 12.3 0 0 1-4.2 1.6Z" fill="url(#moonG)" stroke="#e0f2fe" stroke-width="1.3"/>
          <circle cx="34" cy="14" r="1.7" fill="#fde68a"/>
          <circle cx="38" cy="20" r="1.1" fill="#bae6fd"/>
          <defs><linearGradient id="moonG" x1="12" y1="12" x2="36" y2="36" gradientUnits="userSpaceOnUse"><stop stop-color="#e0f2fe"/><stop offset="1" stop-color="#818cf8"/></linearGradient></defs>
        </svg>`;
      }
      return `<svg viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="9.5" fill="url(#sunG)"/>
        <path d="M24 6v4.5M24 37.5V42M6 24h4.5M37.5 24H42M11.3 11.3l3.2 3.2M33.5 33.5l3.2 3.2M36.7 11.3l-3.2 3.2M14.5 33.5l-3.2 3.2" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round"/>
        <defs><radialGradient id="sunG" cx="0.35" cy="0.35" r="0.75"><stop stop-color="#fef08a"/><stop offset="1" stop-color="#f59e0b"/></radialGradient></defs>
      </svg>`;
    }

    // Partly Cloudy (801-802)
    if (id === 801 || id === 802) {
      return `<svg viewBox="0 0 48 48" fill="none">
        <circle cx="30" cy="17" r="7.5" fill="${isNight ? '#818cf8' : '#fbbf24'}"/>
        <path d="M12.5 35h20a7.5 7.5 0 0 0 1.2-14.9A10 10 0 0 0 14.5 18 7.8 7.8 0 0 0 12.5 35Z" fill="url(#clPart)" stroke="#ffffff" stroke-opacity="0.65" stroke-width="1.2"/>
        <defs><linearGradient id="clPart" x1="10" y1="14" x2="36" y2="36" gradientUnits="userSpaceOnUse"><stop stop-color="#f8fafc"/><stop offset="1" stop-color="#94a3b8"/></linearGradient></defs>
      </svg>`;
    }

    // Overcast / Cloudy (803-804)
    return `<svg viewBox="0 0 48 48" fill="none">
      <path d="M13 34h21.5a8 8 0 0 0 1.4-15.88A11 11 0 0 0 14.8 15.6 8.5 8.5 0 0 0 13 34Z" fill="url(#clFull)" stroke="#e2e8f0" stroke-opacity="0.6" stroke-width="1.3"/>
      <defs><linearGradient id="clFull" x1="10" y1="12" x2="36" y2="34" gradientUnits="userSpaceOnUse"><stop stop-color="#e2e8f0"/><stop offset="1" stop-color="#64748b"/></linearGradient></defs>
    </svg>`;
  }

  function getWeatherMood(code, tempC) {
    const id = Number(code) || 800;
    if (id >= 200 && id < 300) return 'storm';
    if (id >= 300 && id < 600) return 'rain';
    if (id >= 600 && id < 700) return 'snow';
    if (id === 800) return tempC >= 28 ? 'warm' : 'clear';
    return 'clouds';
  }

  /* ==========================================================================
     Formatting Helpers
     ========================================================================== */

  function formatTemp(tempC) {
    if (tempC === null || tempC === undefined || Number.isNaN(tempC)) return '—';
    const val = state.unit === 'F' ? (tempC * 9) / 5 + 32 : tempC;
    return `${Math.round(val)}°${state.unit}`;
  }

  function formatShortTemp(tempC) {
    if (tempC === null || tempC === undefined || Number.isNaN(tempC)) return '';
    const val = state.unit === 'F' ? (tempC * 9) / 5 + 32 : tempC;
    return `${Math.round(val)}°`;
  }

  function formatAltitude(meters) {
    if (meters >= 100000) {
      return `${Math.round(meters / 1000).toLocaleString()} km`;
    }
    if (meters >= 10000) {
      return `${(meters / 1000).toFixed(0)} km`;
    }
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(1)} km`;
    }
    return `${Math.round(meters)} m`;
  }

  function formatCoords(lat, lon) {
    const latDir = lat >= 0 ? 'N' : 'S';
    const lonDir = lon >= 0 ? 'E' : 'W';
    return `${Math.abs(lat).toFixed(2)}° ${latDir}, ${Math.abs(lon).toFixed(2)}° ${lonDir}`;
  }

  function formatLocalTime(timezoneOffsetSec) {
    if (typeof timezoneOffsetSec !== 'number') return '';
    const nowUtcMs = Date.now() + new Date().getTimezoneOffset() * 60000;
    const localDate = new Date(nowUtcMs + timezoneOffsetSec * 1000);
    const weekday = localDate.toLocaleDateString('en-US', { weekday: 'short' });
    const timeStr = localDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    return `Local time · ${weekday} ${timeStr}`;
  }

  function setStatus(message, isError = false) {
    if (!message) {
      dom.searchStatus.classList.add('is-hidden');
      dom.searchStatus.classList.remove('is-error');
      dom.searchStatus.textContent = '';
      return;
    }
    dom.searchStatus.textContent = message;
    dom.searchStatus.classList.toggle('is-error', isError);
    dom.searchStatus.classList.remove('is-hidden');
  }

  /* ==========================================================================
     Panel Collapse / Expand <-> Bookmark Tab Sync
     ========================================================================== */

  function getExpandedPanelPadding() {
    if (window.innerWidth <= 640) return 0;
    const width = dom.explorerPanel ? dom.explorerPanel.offsetWidth : 440;
    return Math.min(width, Math.floor(window.innerWidth * 0.48));
  }

  function setPanelCollapsed(collapsed, animate = true) {
    state.isCollapsed = Boolean(collapsed);
    dom.appShell.classList.toggle('is-collapsed', state.isCollapsed);
    dom.bookmarkTab.setAttribute('aria-expanded', String(!state.isCollapsed));
    dom.explorerPanel.setAttribute('aria-hidden', String(state.isCollapsed));

    // Smoothly shift the globe's visual center to fill almost the entire viewport!
    if (globe) {
      const targetPadding = state.isCollapsed ? 0 : getExpandedPanelPadding();
      globe.setPanelPadding(targetPadding, animate);
    }

    if (state.isCollapsed) {
      hideSuggestions();
    }
  }

  /* ==========================================================================
     Initialize 3D Earth Globe
     ========================================================================== */

  const globe = new window.EarthGlobe({
    containerId: 'globe',
    starfieldId: 'starfield',
    initialPaddingLeft: getExpandedPanelPadding(),

    onTelemetry({ lat, lon, pitch, bearing, altitudeMeters, tier }) {
      dom.hudAltitude.textContent = formatAltitude(altitudeMeters);
      dom.hudCoords.textContent = formatCoords(lat, lon);
      dom.compassNeedle.style.transform = `rotate(${-bearing}deg)`;
      dom.tiltBadge.textContent = pitch > 18 ? '3D' : '2D';
      dom.tiltToggleBtn.classList.toggle('is-active', pitch > 18);

      dom.tierBtns.forEach((btn) => {
        btn.classList.toggle('is-active', btn.dataset.tier === tier);
      });
    },

    onMapClick(lat, lon) {
      // Clicking anywhere on Earth inspects local weather at that point
      exploreCoordinates({
        lat,
        lon,
        label: null,
        targetZoom: Math.max(globe.map.getZoom(), 11.5),
        collapsePanel: true
      });
    },

    onMarkerClick(loc) {
      if (!loc) return;
      globe.diveToStreetLevel(loc.lat, loc.lng);
    },

    onSpinChange(spinning) {
      dom.spinIconPause.classList.toggle('is-hidden', !spinning);
      dom.spinIconPlay.classList.toggle('is-hidden', spinning);
      dom.spinToggleBtn.setAttribute(
        'aria-label',
        spinning ? 'Pause Earth rotation' : 'Resume Earth rotation'
      );
      dom.spinToggleBtn.setAttribute(
        'title',
        spinning ? 'Pause Earth rotation' : 'Resume Earth rotation'
      );
    },

    onBuildingsChange(visible) {
      dom.toggleBuildingsBtn.classList.toggle('is-active', visible);
      dom.toggleBuildingsBtn.setAttribute('aria-pressed', String(visible));
    },

    onUserInteract() {
      dom.exploreHint.classList.add('is-dismissed');
    }
  });

  /* ==========================================================================
     Geocoding & Weather Data Fetching
     ========================================================================== */

  async function geocodeQuery(query) {
    const cleaned = query.trim();

    // 1. Check exact match in curated cities first for instant responsiveness
    const curatedHit = CURATED_CITIES.find(
      (c) => c.name.toLowerCase() === cleaned.toLowerCase()
    );
    if (curatedHit) {
      return {
        lat: curatedHit.lat,
        lon: curatedHit.lon,
        label: curatedHit.name,
        country: curatedHit.country,
        isLandmark: false
      };
    }

    // 2. Try OpenWeatherMap Direct Geocoding (fast & reliable for cities)
    try {
      const owmRes = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cleaned)}&limit=1&appid=${API_KEY}`
      );
      if (owmRes.ok) {
        const owmData = await owmRes.json();
        if (Array.isArray(owmData) && owmData.length > 0) {
          return {
            lat: owmData[0].lat,
            lon: owmData[0].lon,
            label: owmData[0].name,
            country: owmData[0].country || '',
            isLandmark: false
          };
        }
      }
    } catch (_) {}

    // 3. Fallback to OpenStreetMap Nominatim (supports landmarks, streets, POIs!)
    try {
      const nomRes = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cleaned)}&format=json&limit=1&addressdetails=1`,
        { headers: { Accept: 'application/json' } }
      );
      if (nomRes.ok) {
        const nomData = await nomRes.json();
        if (Array.isArray(nomData) && nomData.length > 0) {
          const item = nomData[0];
          const primaryName =
            item.name ||
            (item.display_name ? item.display_name.split(',')[0].trim() : cleaned);
          const isDetailed = ['building', 'tourism', 'amenity', 'highway', 'road', 'leisure', 'historic', 'railway'].includes(
            item.class
          );
          return {
            lat: parseFloat(item.lat),
            lon: parseFloat(item.lon),
            label: primaryName,
            country:
              item.address && item.address.country_code
                ? item.address.country_code.toUpperCase()
                : '',
            isLandmark: isDetailed
          };
        }
      }
    } catch (_) {}

    return null;
  }

  async function fetchAutocompleteSuggestions(query) {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];

    // Instant curated city matches
    const localMatches = CURATED_CITIES.filter((c) =>
      c.name.toLowerCase().includes(q)
    )
      .slice(0, 4)
      .map((c) => ({
        title: c.name,
        subtitle: `${c.country} · Curated City`,
        type: 'City',
        lat: c.lat,
        lon: c.lon,
        country: c.country,
        isLandmark: false
      }));

    // Remote suggestions from OpenWeatherMap + Nominatim for streets/landmarks
    let remoteMatches = [];
    try {
      const [owmResp, nomResp] = await Promise.allSettled([
        fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=4&appid=${API_KEY}`
        ).then((r) => (r.ok ? r.json() : [])),
        fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=4&addressdetails=1`,
          { headers: { Accept: 'application/json' } }
        ).then((r) => (r.ok ? r.json() : []))
      ]);

      if (owmResp.status === 'fulfilled' && Array.isArray(owmResp.value)) {
        owmResp.value.forEach((item) => {
          remoteMatches.push({
            title: item.name,
            subtitle: [item.state, item.country].filter(Boolean).join(', '),
            type: 'City',
            lat: item.lat,
            lon: item.lon,
            country: item.country || '',
            isLandmark: false
          });
        });
      }

      if (nomResp.status === 'fulfilled' && Array.isArray(nomResp.value)) {
        nomResp.value.forEach((item) => {
          const title = item.name || item.display_name.split(',')[0].trim();
          const rest = item.display_name
            .split(',')
            .slice(1, 3)
            .map((s) => s.trim())
            .join(', ');
          const isLandmark = ['building', 'tourism', 'amenity', 'highway', 'road', 'leisure', 'historic'].includes(
            item.class
          );
          remoteMatches.push({
            title,
            subtitle: rest || item.type || 'Location',
            type: isLandmark ? 'Street / POI' : 'Place',
            lat: parseFloat(item.lat),
            lon: parseFloat(item.lon),
            country:
              item.address && item.address.country_code
                ? item.address.country_code.toUpperCase()
                : '',
            isLandmark
          });
        });
      }
    } catch (_) {}

    // Deduplicate nearby/same-title items
    const combined = [...localMatches, ...remoteMatches];
    const deduped = [];
    combined.forEach((item) => {
      const exists = deduped.some(
        (d) =>
          d.title.toLowerCase() === item.title.toLowerCase() &&
          Math.abs(d.lat - item.lat) < 0.25 &&
          Math.abs(d.lon - item.lon) < 0.25
      );
      if (!exists) deduped.push(item);
    });

    return deduped.slice(0, 6);
  }

  /**
   * Core exploration flow: collapses panel into bookmark tab, flies globe, loads weather!
   */
  async function exploreCoordinates({ lat, lon, label, country, isLandmark, targetZoom, collapsePanel = true }) {
    const seq = ++state.requestSeq;
    setStatus('');

    const displayLabel = label || `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;
    state.activeCityName = displayLabel;
    updateActiveCityPill(displayLabel);

    // 1. Immediately collapse left panel into the bookmark tab so globe expands full-screen!
    if (collapsePanel) {
      setPanelCollapsed(true, true);
    }

    // 2. Place marker & initiate cinematic Google Earth flight immediately
    globe.setLocationMarker(lat, lon, displayLabel, '…');
    const zoomToUse =
      targetZoom !== undefined ? targetZoom : isLandmark ? 17.6 : 13.8;
    globe.flyToLocation(lat, lon, {
      zoom: zoomToUse,
      pitch: zoomToUse >= 15.5 ? 62 : 46,
      paddingLeft: collapsePanel ? 0 : getExpandedPanelPadding()
    });

    // Update bookmark label right away for instant feedback
    dom.bookmarkLabel.textContent = displayLabel.toUpperCase();

    // 3. Fetch live Current Weather + 5-Day Forecast by coordinates
    try {
      const [weatherRes, forecastRes] = await Promise.all([
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        ),
        fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        )
      ]);

      if (seq !== state.requestSeq) return; // Ignore stale responses

      if (!weatherRes.ok) throw new Error('Weather unavailable');
      const weatherData = await weatherRes.json();
      const forecastData = forecastRes.ok ? await forecastRes.json() : null;

      // Prefer user's searched landmark/city label if provided, else reverse-geocoded name
      const finalName = label || weatherData.name || 'Selected Location';
      const finalCountry = country || (weatherData.sys && weatherData.sys.country) || '';

      state.activeCityName = finalName;
      state.currentWeather = {
        name: finalName,
        country: finalCountry,
        lat,
        lon,
        tempC: weatherData.main.temp,
        feelsLikeC: weatherData.main.feels_like,
        humidity: weatherData.main.humidity,
        windMs: weatherData.wind ? weatherData.wind.speed : 0,
        visibilityM: weatherData.visibility || 10000,
        description: weatherData.weather[0].description,
        main: weatherData.weather[0].main,
        code: weatherData.weather[0].id,
        iconCode: weatherData.weather[0].icon || '01d',
        timezone: weatherData.timezone
      };

      // Extract 5 midday forecast slots
      state.forecastList = [];
      if (forecastData && Array.isArray(forecastData.list)) {
        const midday = forecastData.list.filter((item) =>
          item.dt_txt.includes('12:00:00')
        );
        const picks = midday.length >= 5 ? midday.slice(0, 5) : forecastData.list.filter((_, i) => i % 8 === 0).slice(0, 5);
        state.forecastList = picks.map((d) => ({
          date: new Date(d.dt * 1000),
          tempC: d.main.temp,
          main: d.weather[0].main,
          code: d.weather[0].id,
          isNight: false
        }));
      }

      renderWeatherUI();
      updateActiveCityPill(finalName);
    } catch (err) {
      if (seq !== state.requestSeq) return;
      setStatus('Could not load live weather for this spot — globe view is still active.', true);
      globe.updateMarkerTemp('');
    }
  }

  async function searchByText(query) {
    const trimmed = query.trim();
    if (!trimmed) {
      setStatus('Enter a city, landmark, or street name to explore.', true);
      dom.cityInput.focus();
      return;
    }

    hideSuggestions();
    setStatus(`Locating "${trimmed}"...`);

    const geo = await geocodeQuery(trimmed);
    if (!geo) {
      setStatus(`No location found for "${trimmed}". Try a city or landmark name.`, true);
      return;
    }

    dom.cityInput.value = geo.label;
    dom.clearSearchBtn.classList.remove('is-hidden');

    await exploreCoordinates({
      lat: geo.lat,
      lon: geo.lon,
      label: geo.label,
      country: geo.country,
      isLandmark: geo.isLandmark,
      collapsePanel: true
    });
  }

  /* ==========================================================================
     Render UI Components
     ========================================================================== */

  function renderWeatherUI() {
    const w = state.currentWeather;
    if (!w) return;

    const isNight = w.iconCode.endsWith('n');
    const svg = getWeatherSvg(w.code, isNight);
    const mood = getWeatherMood(w.code, w.tempC);
    document.body.setAttribute('data-weather-mood', mood);

    // Panel hero weather card
    dom.welcomeEmpty.classList.add('is-hidden');
    dom.weatherCard.classList.remove('is-hidden');
    dom.cityName.textContent = w.name;
    dom.countryCode.textContent = w.country;
    dom.localTime.textContent = formatLocalTime(w.timezone);
    dom.description.textContent = w.description;
    dom.weatherHeroIcon.innerHTML = svg;
    dom.temperature.textContent = formatTemp(w.tempC);

    dom.metricFeels.textContent = formatTemp(w.feelsLikeC);
    dom.metricHumidity.textContent = `${w.humidity}%`;
    dom.metricWind.textContent = `${Math.round(w.windMs * 3.6)} km/h`;
    dom.metricVisibility.textContent = `${(w.visibilityM / 1000).toFixed(1)} km`;

    // Bookmark tab live summary
    dom.bookmarkIcon.innerHTML = svg;
    dom.bookmarkTemp.textContent = formatShortTemp(w.tempC);
    dom.bookmarkLabel.textContent = w.name.toUpperCase();

    // Compact top-left floating pill (visible while collapsed)
    const prettyDesc =
      w.description.charAt(0).toUpperCase() + w.description.slice(1);
    dom.floatingWeatherPill.classList.remove('is-hidden');
    dom.fwpIcon.innerHTML = svg;
    dom.fwpCity.textContent = w.name;
    dom.fwpTemp.textContent = formatTemp(w.tempC);
    dom.fwpSub.textContent = `${prettyDesc} · Click for forecast`;

    // Globe marker label
    globe.setLocationMarker(w.lat, w.lon, w.name, formatTemp(w.tempC));

    // 5-Day forecast strip
    if (state.forecastList.length > 0) {
      dom.forecastSection.classList.remove('is-hidden');
      dom.forecast.innerHTML = '';

      state.forecastList.forEach((day) => {
        const card = document.createElement('div');
        card.className = 'forecast-item';

        const dayLabel = day.date.toLocaleDateString('en-US', { weekday: 'short' });
        card.innerHTML = `
          <span class="forecast-day">${dayLabel}</span>
          <span class="forecast-icon" aria-hidden="true">${getWeatherSvg(day.code, day.isNight)}</span>
          <span class="forecast-temp">${formatShortTemp(day.tempC)}</span>
          <span class="forecast-cond">${day.main}</span>
        `;
        dom.forecast.appendChild(card);
      });
    }
  }

  function renderQuickCities() {
    const filtered =
      state.region === 'all'
        ? CURATED_CITIES
        : CURATED_CITIES.filter((c) => c.region === state.region);

    dom.cityCountMeta.textContent = `${filtered.length} ${filtered.length === 1 ? 'city' : 'cities'}`;
    dom.quickCities.innerHTML = '';

    filtered.forEach((city) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'city-pill';
      btn.dataset.region = city.region;
      btn.dataset.cityName = city.name.toLowerCase();
      if (state.activeCityName.toLowerCase() === city.name.toLowerCase()) {
        btn.classList.add('is-active');
      }
      btn.innerHTML = `<span class="city-pill-dot" aria-hidden="true"></span><span>${city.name}</span><span class="city-pill-cc">${city.country}</span>`;
      btn.addEventListener('click', () => {
        dom.cityInput.value = city.name;
        dom.clearSearchBtn.classList.remove('is-hidden');
        exploreCoordinates({
          lat: city.lat,
          lon: city.lon,
          label: city.name,
          country: city.country,
          isLandmark: false,
          collapsePanel: true
        });
      });
      dom.quickCities.appendChild(btn);
    });
  }

  function updateActiveCityPill(cityName) {
    const target = (cityName || '').toLowerCase();
    dom.quickCities.querySelectorAll('.city-pill').forEach((pill) => {
      pill.classList.toggle('is-active', pill.dataset.cityName === target);
    });
  }

  /* ==========================================================================
     Autocomplete Suggestions UI
     ========================================================================== */

  function renderSuggestions(items) {
    state.suggestions = items;
    state.highlightedIdx = -1;

    if (!items.length) {
      hideSuggestions();
      return;
    }

    dom.searchSuggestions.innerHTML = '';
    items.forEach((item, idx) => {
      const li = document.createElement('li');
      li.className = 'suggestion-item';
      li.role = 'option';
      li.innerHTML = `
        <span class="suggestion-main">
          <span class="suggestion-title"></span>
          <span class="suggestion-sub"></span>
        </span>
        <span class="suggestion-type"></span>
      `;
      li.querySelector('.suggestion-title').textContent = item.title;
      li.querySelector('.suggestion-sub').textContent = item.subtitle;
      li.querySelector('.suggestion-type').textContent = item.type;

      li.addEventListener('mousedown', (evt) => {
        evt.preventDefault();
        selectSuggestion(idx);
      });
      dom.searchSuggestions.appendChild(li);
    });

    dom.searchSuggestions.classList.remove('is-hidden');
    dom.cityInput.setAttribute('aria-expanded', 'true');
  }

  function hideSuggestions() {
    dom.searchSuggestions.classList.add('is-hidden');
    dom.cityInput.setAttribute('aria-expanded', 'false');
    state.highlightedIdx = -1;
  }

  function selectSuggestion(idx) {
    const item = state.suggestions[idx];
    if (!item) return;

    dom.cityInput.value = item.title;
    dom.clearSearchBtn.classList.remove('is-hidden');
    hideSuggestions();

    exploreCoordinates({
      lat: item.lat,
      lon: item.lon,
      label: item.title,
      country: item.country,
      isLandmark: item.isLandmark,
      collapsePanel: true
    });
  }

  function updateHighlightedSuggestion() {
    const items = dom.searchSuggestions.querySelectorAll('.suggestion-item');
    items.forEach((el, i) => {
      el.classList.toggle('is-highlighted', i === state.highlightedIdx);
    });
  }

  /* ==========================================================================
     Event Listeners
     ========================================================================== */

  // Search form submit -> collapses panel & flies to location
  dom.searchForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    if (state.highlightedIdx >= 0 && state.suggestions[state.highlightedIdx]) {
      selectSuggestion(state.highlightedIdx);
    } else {
      searchByText(dom.cityInput.value);
    }
  });

  // Live autocomplete typing
  dom.cityInput.addEventListener('input', () => {
    const val = dom.cityInput.value;
    dom.clearSearchBtn.classList.toggle('is-hidden', val.length === 0);
    setStatus('');

    clearTimeout(state.suggestTimer);
    if (val.trim().length < 2) {
      hideSuggestions();
      return;
    }

    state.suggestTimer = setTimeout(async () => {
      const items = await fetchAutocompleteSuggestions(val);
      if (dom.cityInput.value.trim() === val.trim() && !state.isCollapsed) {
        renderSuggestions(items);
      }
    }, 240);
  });

  // Keyboard navigation in autocomplete
  dom.cityInput.addEventListener('keydown', (evt) => {
    if (dom.searchSuggestions.classList.contains('is-hidden')) return;
    if (evt.key === 'ArrowDown') {
      evt.preventDefault();
      state.highlightedIdx = Math.min(
        state.suggestions.length - 1,
        state.highlightedIdx + 1
      );
      updateHighlightedSuggestion();
    } else if (evt.key === 'ArrowUp') {
      evt.preventDefault();
      state.highlightedIdx = Math.max(-1, state.highlightedIdx - 1);
      updateHighlightedSuggestion();
    } else if (evt.key === 'Escape') {
      hideSuggestions();
    }
  });

  dom.cityInput.addEventListener('blur', () => {
    setTimeout(hideSuggestions, 150);
  });

  dom.clearSearchBtn.addEventListener('click', () => {
    dom.cityInput.value = '';
    dom.clearSearchBtn.classList.add('is-hidden');
    hideSuggestions();
    setStatus('');
    dom.cityInput.focus();
  });

  // Panel collapse & bookmark expand controls
  dom.collapsePanelBtn.addEventListener('click', () => {
    setPanelCollapsed(true, true);
  });

  dom.bookmarkTab.addEventListener('click', () => {
    setPanelCollapsed(false, true);
  });

  dom.floatingWeatherPill.addEventListener('click', () => {
    setPanelCollapsed(false, true);
  });

  document.addEventListener('keydown', (evt) => {
    if (
      evt.key === 'Escape' &&
      !state.isCollapsed &&
      state.currentWeather &&
      document.activeElement !== dom.cityInput
    ) {
      setPanelCollapsed(true, true);
    }
  });

  // Temperature unit toggle (°C / °F)
  function setUnit(unit) {
    if (state.unit === unit) return;
    state.unit = unit;
    dom.unitC.classList.toggle('is-active', unit === 'C');
    dom.unitC.setAttribute('aria-pressed', String(unit === 'C'));
    dom.unitF.classList.toggle('is-active', unit === 'F');
    dom.unitF.setAttribute('aria-pressed', String(unit === 'F'));
    renderWeatherUI();
  }

  dom.unitC.addEventListener('click', () => setUnit('C'));
  dom.unitF.addEventListener('click', () => setUnit('F'));

  // Region filter tabs
  dom.regionTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      state.region = tab.dataset.region;
      dom.regionTabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', String(active));
      });
      renderQuickCities();
    });
  });

  // Weather card street/orbit quick actions
  dom.cardStreetZoomBtn.addEventListener('click', () => {
    setPanelCollapsed(true, true);
    globe.diveToStreetLevel();
  });

  dom.cardOrbitBtn.addEventListener('click', () => {
    setPanelCollapsed(true, true);
    globe.flyToSpace();
  });

  // Map mode segmented control (Satellite / 3D Street / Night)
  dom.mapModeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.mapMode;
      dom.mapModeBtns.forEach((b) => {
        const active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-pressed', String(active));
      });
      globe.setMapMode(mode);
    });
  });

  // 3D Buildings & Labels toggles
  dom.toggleBuildingsBtn.addEventListener('click', () => {
    const next = !dom.toggleBuildingsBtn.classList.contains('is-active');
    dom.toggleBuildingsBtn.classList.toggle('is-active', next);
    dom.toggleBuildingsBtn.setAttribute('aria-pressed', String(next));
    globe.setBuildingsVisible(next);
  });

  dom.toggleLabelsBtn.addEventListener('click', () => {
    const next = !dom.toggleLabelsBtn.classList.contains('is-active');
    dom.toggleLabelsBtn.classList.toggle('is-active', next);
    dom.toggleLabelsBtn.setAttribute('aria-pressed', String(next));
    globe.setLabelsVisible(next);
  });

  // Right camera controls
  dom.zoomInBtn.addEventListener('click', () => globe.zoomIn());
  dom.zoomOutBtn.addEventListener('click', () => globe.zoomOut());
  dom.streetDiveBtn.addEventListener('click', () => {
    if (!state.isCollapsed) setPanelCollapsed(true, true);
    globe.diveToStreetLevel();
  });
  dom.tiltToggleBtn.addEventListener('click', () => globe.toggleTilt());
  dom.compassBtn.addEventListener('click', () => globe.resetNorth());
  dom.spaceViewBtn.addEventListener('click', () => globe.flyToSpace());
  dom.spinToggleBtn.addEventListener('click', () => globe.toggleAutoRotate());

  // Altitude tier scrubber (Orbit / Region / City / Street)
  dom.tierBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (!state.isCollapsed && btn.dataset.tier !== 'space') {
        setPanelCollapsed(true, true);
      }
      globe.setAltitudeTier(btn.dataset.tier);
    });
  });

  // Keep globe padding synced on viewport resize
  window.addEventListener('resize', () => {
    if (!state.isCollapsed) {
      globe.setPanelPadding(getExpandedPanelPadding(), false);
    }
  });

  // Initial render
  renderQuickCities();
})();
