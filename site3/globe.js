/**
 * globe.js — Interactive 3D Earth Engine (Space Orbit -> Street Level)
 * Powered by MapLibre GL JS v5 Globe Projection + Procedural Deep-Space Starfield
 * Unified zero-reload multi-mode engine: Satellite | 3D Street | Night
 */

(function (global) {
  'use strict';

  const ESRI_SATELLITE_TILES =
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
  const ESRI_STREET_TILES =
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}';
  const ESRI_DARK_BASE_TILES =
    'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}';
  const ESRI_DARK_REF_TILES =
    'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}';
  const ESRI_TRANSPORT_TILES =
    'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}';
  const ESRI_LABELS_TILES =
    'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}';
  const OPENFREEMAP_VECTOR_URL = 'https://tiles.openfreemap.org/planet';

  const prefersReducedMotion = () =>
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function buildSkySpec(mode) {
    if (mode === 'night') {
      return {
        'sky-color': '#061229',
        'sky-horizon-blend': 0.55,
        'horizon-color': '#1d4480',
        'atmosphere-blend': [
          'interpolate',
          ['linear'],
          ['zoom'],
          0,
          0.9,
          5,
          0.82,
          7.5,
          0.25,
          12,
          0.08
        ]
      };
    }

    if (mode === 'street') {
      return {
        'sky-color': '#1d6ce0',
        'sky-horizon-blend': 0.48,
        'horizon-color': '#bae6fd',
        'atmosphere-blend': [
          'interpolate',
          ['linear'],
          ['zoom'],
          0,
          0.92,
          5,
          0.84,
          7.5,
          0.22,
          12,
          0.06
        ]
      };
    }

    return {
      'sky-color': '#0d47a1',
      'sky-horizon-blend': 0.5,
      'horizon-color': '#6ec6ff',
      'atmosphere-blend': [
        'interpolate',
        ['linear'],
        ['zoom'],
        0,
        0.94,
        5,
        0.88,
        7.5,
        0.26,
        12,
        0.1
      ]
    };
  }

  function buildLightSpec(mode) {
    if (mode === 'night') {
      return {
        anchor: 'viewport',
        color: '#bae6fd',
        intensity: 0.56,
        position: [1.35, 195, 55]
      };
    }
    if (mode === 'street') {
      return {
        anchor: 'viewport',
        color: '#fff9f0',
        intensity: 0.46,
        position: [1.3, 200, 52]
      };
    }
    return {
      anchor: 'viewport',
      color: '#fff8ed',
      intensity: 0.42,
      position: [1.35, 195, 55]
    };
  }

  function buildBuildingColor(mode) {
    if (mode === 'night') {
      return [
        'interpolate',
        ['linear'],
        ['coalesce', ['get', 'render_height'], 10],
        0,
        '#162544',
        25,
        '#1e3a6d',
        65,
        '#0c6482',
        130,
        '#22a7db',
        220,
        '#bae6fd'
      ];
    }

    if (mode === 'street') {
      return [
        'interpolate',
        ['linear'],
        ['coalesce', ['get', 'render_height'], 10],
        0,
        '#e8e2d8',
        30,
        '#dbe2ec',
        85,
        '#bcd2e8',
        180,
        '#8db6df'
      ];
    }

    // Satellite 3D overlay
    return [
      'interpolate',
      ['linear'],
      ['coalesce', ['get', 'render_height'], 10],
      0,
      '#d8dee9',
      35,
      '#e5e9f0',
      90,
      '#c9dff2',
      180,
      '#93c5fd'
    ];
  }

  function buildBuildingOpacity(mode) {
    if (mode === 'night') return 0.9;
    if (mode === 'street') return 0.88;
    return 0.72;
  }

  /**
   * Unified MapLibre v5 Globe style supporting instant zero-reload mode switching
   */
  function buildUnifiedStyle(mode, showBuildings, showLabels) {
    const isSat = mode === 'satellite';
    const isStreet = mode === 'street';
    const isNight = mode === 'night';

    return {
      version: 8,
      projection: { type: 'globe' },
      sky: buildSkySpec(mode),
      light: buildLightSpec(mode),
      sources: {
        'esri-satellite': {
          type: 'raster',
          tiles: [ESRI_SATELLITE_TILES],
          tileSize: 256,
          maxzoom: 19,
          attribution: 'Imagery &copy; Esri, Maxar, Earthstar Geographics'
        },
        'esri-street': {
          type: 'raster',
          tiles: [ESRI_STREET_TILES],
          tileSize: 256,
          maxzoom: 19,
          attribution: 'Streets &copy; Esri, HERE, Garmin, OpenStreetMap'
        },
        'esri-dark-base': {
          type: 'raster',
          tiles: [ESRI_DARK_BASE_TILES],
          tileSize: 256,
          maxzoom: 16,
          attribution: 'Dark Canvas &copy; Esri, HERE, OpenStreetMap'
        },
        'esri-dark-ref': {
          type: 'raster',
          tiles: [ESRI_DARK_REF_TILES],
          tileSize: 256,
          maxzoom: 16
        },
        'esri-transport': {
          type: 'raster',
          tiles: [ESRI_TRANSPORT_TILES],
          tileSize: 256,
          maxzoom: 19
        },
        'esri-labels': {
          type: 'raster',
          tiles: [ESRI_LABELS_TILES],
          tileSize: 256,
          maxzoom: 19
        },
        openfreemap: {
          type: 'vector',
          url: OPENFREEMAP_VECTOR_URL
        }
      },
      layers: [
        // 1. Base imagery layers (one visible per mode)
        {
          id: 'satellite-layer',
          type: 'raster',
          source: 'esri-satellite',
          layout: { visibility: isSat ? 'visible' : 'none' },
          paint: {
            'raster-saturation': 0.2,
            'raster-contrast': 0.08,
            'raster-brightness-min': 0.01,
            'raster-brightness-max': 0.96,
            'raster-fade-duration': 220
          }
        },
        {
          id: 'street-layer',
          type: 'raster',
          source: 'esri-street',
          layout: { visibility: isStreet ? 'visible' : 'none' },
          paint: {
            'raster-saturation': 0.08,
            'raster-contrast': 0.05,
            'raster-fade-duration': 220
          }
        },
        {
          id: 'night-layer',
          type: 'raster',
          source: 'esri-dark-base',
          layout: { visibility: isNight ? 'visible' : 'none' },
          paint: {
            'raster-brightness-min': 0.02,
            'raster-brightness-max': 0.72,
            'raster-contrast': 0.18,
            'raster-saturation': -0.2,
            'raster-fade-duration': 220
          }
        },

        // 2. Luminous nocturnal vector roads & rail lines in Night mode
        {
          id: 'night-roads-minor',
          type: 'line',
          source: 'openfreemap',
          'source-layer': 'transportation',
          minzoom: 12.5,
          filter: ['in', ['get', 'class'], ['literal', ['minor', 'service', 'tertiary', 'track']]],
          layout: {
            visibility: isNight ? 'visible' : 'none',
            'line-cap': 'round',
            'line-join': 'round'
          },
          paint: {
            'line-color': '#2b528c',
            'line-width': ['interpolate', ['linear'], ['zoom'], 12.5, 0.6, 17, 2.4],
            'line-opacity': 0.72
          }
        },
        {
          id: 'night-roads-major',
          type: 'line',
          source: 'openfreemap',
          'source-layer': 'transportation',
          minzoom: 10,
          filter: ['in', ['get', 'class'], ['literal', ['motorway', 'trunk', 'primary', 'secondary']]],
          layout: {
            visibility: isNight ? 'visible' : 'none',
            'line-cap': 'round',
            'line-join': 'round'
          },
          paint: {
            'line-color': [
              'match',
              ['get', 'class'],
              'motorway',
              '#fbbf24',
              'trunk',
              '#38bdf8',
              '#60a5fa'
            ],
            'line-width': ['interpolate', ['linear'], ['zoom'], 10, 1.0, 17, 4.2],
            'line-opacity': 0.85
          }
        },
        {
          id: 'night-rail',
          type: 'line',
          source: 'openfreemap',
          'source-layer': 'transportation',
          minzoom: 12,
          filter: ['==', ['get', 'class'], 'rail'],
          layout: { visibility: isNight ? 'visible' : 'none' },
          paint: {
            'line-color': '#818cf8',
            'line-width': ['interpolate', ['linear'], ['zoom'], 12, 0.7, 17, 2.0],
            'line-opacity': 0.68
          }
        },

        // 3. Satellite hybrid transportation & place labels
        {
          id: 'transport-layer',
          type: 'raster',
          source: 'esri-transport',
          minzoom: 10.5,
          layout: { visibility: isSat && showLabels ? 'visible' : 'none' },
          paint: {
            'raster-opacity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              10.5,
              0,
              13.5,
              0.6,
              16.5,
              0.82
            ],
            'raster-fade-duration': 180
          }
        },
        {
          id: 'labels-layer',
          type: 'raster',
          source: 'esri-labels',
          minzoom: 2,
          layout: { visibility: isSat && showLabels ? 'visible' : 'none' },
          paint: {
            'raster-opacity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              2,
              0.72,
              6,
              0.92,
              15,
              0.96
            ],
            'raster-fade-duration': 180
          }
        },
        {
          id: 'night-labels-layer',
          type: 'raster',
          source: 'esri-dark-ref',
          minzoom: 2,
          layout: { visibility: isNight && showLabels ? 'visible' : 'none' },
          paint: {
            'raster-opacity': 0.88,
            'raster-fade-duration': 180
          }
        },

        // 4. 3D Extruded Architectural Buildings (all modes, rises smoothly at street zoom!)
        {
          id: 'buildings-3d',
          type: 'fill-extrusion',
          source: 'openfreemap',
          'source-layer': 'building',
          minzoom: 14,
          filter: ['!', ['has', 'hide_3d']],
          layout: { visibility: showBuildings ? 'visible' : 'none' },
          paint: {
            'fill-extrusion-color': buildBuildingColor(mode),
            'fill-extrusion-height': [
              'interpolate',
              ['linear'],
              ['zoom'],
              14,
              0,
              14.8,
              ['coalesce', ['get', 'render_height'], 10]
            ],
            'fill-extrusion-base': [
              'interpolate',
              ['linear'],
              ['zoom'],
              14,
              0,
              14.8,
              ['coalesce', ['get', 'render_min_height'], 0]
            ],
            'fill-extrusion-opacity': buildBuildingOpacity(mode),
            'fill-extrusion-vertical-gradient': true
          }
        }
      ]
    };
  }

  /**
   * Procedural Starfield + subtle cosmic nebula behind the transparent 3D Globe
   */
  class StarfieldRenderer {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.stars = [];
      this.width = 0;
      this.height = 0;
      this.offsetX = 0;
      this.offsetY = 0;
      this.opacity = 1;
      this.rafId = null;
      this.initStars();
      this.resize();
      window.addEventListener('resize', () => this.resize());
    }

    initStars() {
      const palette = ['#ffffff', '#e0f2fe', '#bae6fd', '#fde68a', '#c7d2fe', '#a5f3fc'];
      this.stars = [];
      for (let i = 0; i < 320; i++) {
        const depth = Math.random();
        this.stars.push({
          x: Math.random(),
          y: Math.random(),
          radius: 0.4 + depth * 1.45,
          baseAlpha: 0.22 + depth * 0.68,
          phase: Math.random() * Math.PI * 2,
          speed: 0.35 + Math.random() * 1.35,
          parallax: 0.14 + depth * 0.56,
          color: palette[Math.floor(Math.random() * palette.length)],
          glow: depth > 0.85
        });
      }
    }

    resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.canvas.width = Math.floor(this.width * dpr);
      this.canvas.height = Math.floor(this.height * dpr);
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.draw(performance.now());
    }

    setCameraSync(lng, lat, zoom) {
      this.offsetX = lng * 1.8;
      this.offsetY = lat * 1.4;
      if (zoom <= 5.2) {
        this.opacity = 1;
      } else if (zoom >= 9.0) {
        this.opacity = 0;
      } else {
        this.opacity = 1 - (zoom - 5.2) / 3.8;
      }
    }

    draw(time) {
      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.width, this.height);
      if (this.opacity <= 0.01) return;

      const t = prefersReducedMotion() ? 0 : time * 0.001;
      const w = this.width;
      const h = this.height;

      // Subtle atmospheric deep-space nebula glow
      const neb = ctx.createRadialGradient(
        w * 0.62,
        h * 0.48,
        w * 0.04,
        w * 0.62,
        h * 0.48,
        w * 0.48
      );
      neb.addColorStop(0, `rgba(28, 100, 210, ${0.14 * this.opacity})`);
      neb.addColorStop(0.55, `rgba(17, 36, 86, ${0.07 * this.opacity})`);
      neb.addColorStop(1, 'rgba(3, 7, 18, 0)');
      ctx.fillStyle = neb;
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < this.stars.length; i++) {
        const s = this.stars[i];
        const sx = (((s.x * w - this.offsetX * s.parallax) % w) + w) % w;
        const sy = (((s.y * h + this.offsetY * s.parallax) % h) + h) % h;
        const twinkle = 0.74 + 0.26 * Math.sin(t * s.speed + s.phase);
        const alpha = s.baseAlpha * twinkle * this.opacity;

        ctx.globalAlpha = alpha;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(sx, sy, s.radius, 0, Math.PI * 2);
        ctx.fill();

        if (s.glow && alpha > 0.35) {
          ctx.globalAlpha = alpha * 0.24;
          ctx.beginPath();
          ctx.arc(sx, sy, s.radius * 3.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    }

    start() {
      const loop = (time) => {
        this.draw(time);
        this.rafId = requestAnimationFrame(loop);
      };
      this.rafId = requestAnimationFrame(loop);
    }
  }

  /**
   * Main EarthGlobe Controller
   */
  class EarthGlobe {
    constructor(options) {
      this.containerId = options.containerId || 'globe';
      this.starfieldCanvas = document.getElementById(options.starfieldId || 'starfield');
      this.onTelemetry = options.onTelemetry || (() => {});
      this.onMapClick = options.onMapClick || (() => {});
      this.onMarkerClick = options.onMarkerClick || (() => {});
      this.onSpinChange = options.onSpinChange || (() => {});
      this.onBuildingsChange = options.onBuildingsChange || (() => {});
      this.onUserInteract = options.onUserInteract || (() => {});

      this.mode = 'satellite'; // 'satellite' | 'street' | 'night'
      this.showBuildings = false;
      this.showLabels = true;
      this.isAutoRotating = !prefersReducedMotion();
      this.isFlying = false;
      this.activeLocation = null;
      this.activeMarker = null;
      this.markerElements = null;
      this.spinRafId = null;
      this.lastFrameTime = 0;
      this.currentPaddingLeft = options.initialPaddingLeft || 0;

      if (this.starfieldCanvas) {
        this.starfield = new StarfieldRenderer(this.starfieldCanvas);
        this.starfield.start();
      }

      this.initMap();
    }

    initMap() {
      this.map = new maplibregl.Map({
        container: this.containerId,
        style: buildUnifiedStyle(this.mode, this.showBuildings, this.showLabels),
        center: [121.56, 25.03],
        zoom: 2.18,
        minZoom: 1.25,
        maxZoom: 20,
        maxPitch: 75,
        pitch: 0,
        bearing: 0,
        antialias: true,
        attributionControl: false
      });

      this.map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-left');

      this.map.on('load', () => {
        if (this.currentPaddingLeft > 0) {
          this.map.jumpTo({
            padding: { left: this.currentPaddingLeft, top: 0, right: 0, bottom: 0 }
          });
        }
        this.emitTelemetry();
        this.startSpinLoop();
        this.onSpinChange(this.isAutoRotating);
        this.onBuildingsChange(this.showBuildings);
      });

      const stopOnInteract = (evt) => {
        if (evt && evt.originalEvent) {
          if (this.isAutoRotating) {
            this.setAutoRotate(false);
          }
          this.onUserInteract();
        }
      };

      this.map.on('dragstart', stopOnInteract);
      this.map.on('zoomstart', stopOnInteract);
      this.map.on('pitchstart', stopOnInteract);
      this.map.on('rotatestart', stopOnInteract);

      this.map.on('move', () => {
        this.emitTelemetry();
      });

      // Smooth Google Earth auto-tilt when scrolling down into street level
      this.map.on('wheel', () => {
        if (this.isFlying) return;
        const z = this.map.getZoom();
        const currentPitch = this.map.getPitch();
        if (z > 13.8 && currentPitch < 56) {
          const targetPitch = Math.min(58, ((z - 13.8) / 4.0) * 58);
          if (targetPitch > currentPitch + 1.5) {
            this.map.setPitch(currentPitch + (targetPitch - currentPitch) * 0.28);
          }
        } else if (z < 9.5 && currentPitch > 2) {
          this.map.setPitch(Math.max(0, currentPitch * 0.85));
        }
      });

      this.map.on('click', (e) => {
        if (e.originalEvent && e.originalEvent.target.closest('.earth-pin-wrapper')) {
          return;
        }
        if (this.isAutoRotating) {
          this.setAutoRotate(false);
        }
        this.onMapClick(e.lngLat.lat, e.lngLat.lng);
      });
    }

    startSpinLoop() {
      const tick = (now) => {
        if (!this.lastFrameTime) this.lastFrameTime = now;
        const dt = Math.min((now - this.lastFrameTime) / 1000, 0.1);
        this.lastFrameTime = now;

        if (
          this.isAutoRotating &&
          !this.isFlying &&
          this.map &&
          this.map.getZoom() < 4.5
        ) {
          const center = this.map.getCenter();
          const degPerSec = 5.0;
          center.lng = ((center.lng + degPerSec * dt + 180) % 360) - 180;
          this.map.jumpTo({ center });
        }

        this.spinRafId = requestAnimationFrame(tick);
      };
      this.spinRafId = requestAnimationFrame(tick);
    }

    setAutoRotate(enabled) {
      this.isAutoRotating = Boolean(enabled);
      this.onSpinChange(this.isAutoRotating);
    }

    toggleAutoRotate() {
      if (!this.isAutoRotating && this.map.getZoom() >= 4.5) {
        this.flyToSpace();
      }
      this.setAutoRotate(!this.isAutoRotating);
    }

    setPanelPadding(leftPx, animate = true) {
      this.currentPaddingLeft = leftPx;
      if (!this.map) return;

      const padding = { left: leftPx, top: 0, right: 0, bottom: 0 };
      if (!animate || prefersReducedMotion()) {
        this.map.jumpTo({ padding });
      } else {
        this.map.easeTo({
          padding,
          duration: 520,
          easing: (t) => 1 - Math.pow(1 - t, 3)
        });
      }
    }

    flyToLocation(lat, lon, opts = {}) {
      if (!this.map) return;

      this.setAutoRotate(false);
      this.isFlying = true;

      const targetZoom = opts.zoom !== undefined ? opts.zoom : 14.0;
      const targetPitch =
        opts.pitch !== undefined
          ? opts.pitch
          : targetZoom >= 15.5
          ? 60
          : targetZoom >= 12
          ? 45
          : 0;
      const targetBearing = opts.bearing !== undefined ? opts.bearing : -14;
      const paddingLeft =
        opts.paddingLeft !== undefined ? opts.paddingLeft : this.currentPaddingLeft;
      this.currentPaddingLeft = paddingLeft;

      const reduced = prefersReducedMotion();

      this.map.flyTo({
        center: [lon, lat],
        zoom: targetZoom,
        pitch: targetPitch,
        bearing: targetBearing,
        padding: { left: paddingLeft, top: 0, right: 0, bottom: 0 },
        speed: reduced ? 4 : opts.speed || 1.25,
        curve: opts.curve || 1.55,
        essential: true
      });

      this.map.once('moveend', () => {
        this.isFlying = false;
      });
    }

    diveToStreetLevel(lat, lon) {
      const targetLat =
        lat !== undefined
          ? lat
          : this.activeLocation
          ? this.activeLocation.lat
          : this.map.getCenter().lat;
      const targetLon =
        lon !== undefined
          ? lon
          : this.activeLocation
          ? this.activeLocation.lng
          : this.map.getCenter().lng;

      this.flyToLocation(targetLat, targetLon, {
        zoom: 16.6,
        pitch: 58,
        bearing: -18,
        speed: 1.4,
        curve: 1.35
      });
    }

    setAltitudeTier(tier) {
      const center = this.activeLocation
        ? [this.activeLocation.lng, this.activeLocation.lat]
        : [this.map.getCenter().lng, this.map.getCenter().lat];

      const presets = {
        space: { zoom: 2.15, pitch: 0, bearing: 0 },
        region: { zoom: 7.4, pitch: 18, bearing: 0 },
        city: { zoom: 13.8, pitch: 46, bearing: -14 },
        street: { zoom: 16.6, pitch: 58, bearing: -18 }
      };

      const preset = presets[tier];
      if (!preset) return;

      this.setAutoRotate(false);
      this.isFlying = true;
      this.map.flyTo({
        center,
        zoom: preset.zoom,
        pitch: preset.pitch,
        bearing: preset.bearing,
        padding: { left: this.currentPaddingLeft, top: 0, right: 0, bottom: 0 },
        speed: prefersReducedMotion() ? 4 : 1.4,
        curve: 1.4,
        essential: true
      });
      this.map.once('moveend', () => {
        this.isFlying = false;
      });
    }

    flyToSpace() {
      this.setAltitudeTier('space');
    }

    zoomIn() {
      const nextZoom = Math.min(20, this.map.getZoom() + 1.6);
      const nextPitch =
        nextZoom >= 15.5 ? Math.max(this.map.getPitch(), 56) : this.map.getPitch();
      this.map.easeTo({
        zoom: nextZoom,
        pitch: nextPitch,
        duration: prefersReducedMotion() ? 100 : 380
      });
    }

    zoomOut() {
      const nextZoom = Math.max(1.25, this.map.getZoom() - 1.6);
      const nextPitch = nextZoom <= 9 ? 0 : this.map.getPitch();
      this.map.easeTo({
        zoom: nextZoom,
        pitch: nextPitch,
        duration: prefersReducedMotion() ? 100 : 380
      });
    }

    toggleTilt() {
      const currentPitch = this.map.getPitch();
      const targetPitch = currentPitch > 20 ? 0 : 60;
      this.map.easeTo({
        pitch: targetPitch,
        duration: prefersReducedMotion() ? 100 : 480
      });
      return targetPitch > 0;
    }

    resetNorth() {
      this.map.easeTo({
        bearing: 0,
        pitch: this.map.getZoom() > 14 ? 50 : 0,
        duration: prefersReducedMotion() ? 100 : 450
      });
    }

    /**
     * Instant zero-reload switching between Satellite, 3D Street, and Night modes!
     */
    setMapMode(mode) {
      if (this.mode === mode) return;
      this.mode = mode;

      this.showBuildings = mode !== 'satellite';
      this.onBuildingsChange(this.showBuildings);

      const isSat = mode === 'satellite';
      const isStreet = mode === 'street';
      const isNight = mode === 'night';

      const setVis = (id, visible) => {
        if (this.map.getLayer(id)) {
          this.map.setLayoutProperty(id, 'visibility', visible ? 'visible' : 'none');
        }
      };

      setVis('satellite-layer', isSat);
      setVis('street-layer', isStreet);
      setVis('night-layer', isNight);

      setVis('night-roads-minor', isNight);
      setVis('night-roads-major', isNight);
      setVis('night-rail', isNight);

      setVis('transport-layer', isSat && this.showLabels);
      setVis('labels-layer', isSat && this.showLabels);
      setVis('night-labels-layer', isNight && this.showLabels);

      setVis('buildings-3d', this.showBuildings);
      if (this.map.getLayer('buildings-3d')) {
        this.map.setPaintProperty('buildings-3d', 'fill-extrusion-color', buildBuildingColor(mode));
        this.map.setPaintProperty('buildings-3d', 'fill-extrusion-opacity', buildBuildingOpacity(mode));
      }

      this.map.setSky(buildSkySpec(mode));
      this.map.setLight(buildLightSpec(mode));
    }

    setBuildingsVisible(visible) {
      this.showBuildings = Boolean(visible);
      if (this.map.getLayer('buildings-3d')) {
        this.map.setLayoutProperty(
          'buildings-3d',
          'visibility',
          this.showBuildings ? 'visible' : 'none'
        );
      }
      this.onBuildingsChange(this.showBuildings);
    }

    setLabelsVisible(visible) {
      this.showLabels = Boolean(visible);
      const isSat = this.mode === 'satellite';
      const isNight = this.mode === 'night';
      if (this.map.getLayer('transport-layer')) {
        this.map.setLayoutProperty('transport-layer', 'visibility', isSat && this.showLabels ? 'visible' : 'none');
      }
      if (this.map.getLayer('labels-layer')) {
        this.map.setLayoutProperty('labels-layer', 'visibility', isSat && this.showLabels ? 'visible' : 'none');
      }
      if (this.map.getLayer('night-labels-layer')) {
        this.map.setLayoutProperty('night-labels-layer', 'visibility', isNight && this.showLabels ? 'visible' : 'none');
      }
    }

    setLocationMarker(lat, lon, label, tempText) {
      this.activeLocation = { lat, lng: lon, label, tempText };

      if (!this.activeMarker) {
        const wrapper = document.createElement('div');
        wrapper.className = 'earth-pin-wrapper';
        wrapper.title = 'Click to dive to street level';

        const pill = document.createElement('div');
        pill.className = 'earth-pin-label';

        const citySpan = document.createElement('span');
        citySpan.className = 'earth-pin-city';

        const tempSpan = document.createElement('span');
        tempSpan.className = 'earth-pin-temp';

        pill.appendChild(citySpan);
        pill.appendChild(tempSpan);

        const stem = document.createElement('span');
        stem.className = 'earth-pin-stem';

        const beacon = document.createElement('div');
        beacon.className = 'earth-pin-beacon';
        beacon.innerHTML = `
          <span class="earth-pin-ring"></span>
          <span class="earth-pin-ring earth-pin-ring--delayed"></span>
          <span class="earth-pin-core"></span>
        `;

        wrapper.appendChild(pill);
        wrapper.appendChild(stem);
        wrapper.appendChild(beacon);

        wrapper.addEventListener('click', (evt) => {
          evt.stopPropagation();
          this.onMarkerClick(this.activeLocation);
        });

        this.markerElements = { citySpan, tempSpan };
        this.activeMarker = new maplibregl.Marker({
          element: wrapper,
          anchor: 'bottom'
        })
          .setLngLat([lon, lat])
          .addTo(this.map);
      } else {
        this.activeMarker.setLngLat([lon, lat]);
      }

      if (this.markerElements) {
        this.markerElements.citySpan.textContent = label || '';
        this.markerElements.tempSpan.textContent = tempText || '';
      }
    }

    updateMarkerTemp(tempText) {
      if (this.activeLocation) {
        this.activeLocation.tempText = tempText;
      }
      if (this.markerElements) {
        this.markerElements.tempSpan.textContent = tempText || '';
      }
    }

    computeAltitudeMeters(zoom, lat, pitch) {
      const latRad = (Math.max(-85, Math.min(85, lat)) * Math.PI) / 180;
      const metersPerPixel = (156543.03392 * Math.cos(latRad)) / Math.pow(2, zoom);
      const viewportH = this.map.getContainer().clientHeight || window.innerHeight;
      const fovRad = (45 * Math.PI) / 180;
      const rawAlt = ((metersPerPixel * viewportH) / 2) / Math.tan(fovRad / 2);
      const pitchFactor = Math.max(0.35, Math.cos((pitch * Math.PI) / 180));
      return Math.max(25, rawAlt * pitchFactor);
    }

    getAltitudeTier(zoom) {
      if (zoom < 5.2) return 'space';
      if (zoom < 10.5) return 'region';
      if (zoom < 15.2) return 'city';
      return 'street';
    }

    emitTelemetry() {
      if (!this.map) return;
      const center = this.map.getCenter();
      const zoom = this.map.getZoom();
      const pitch = this.map.getPitch();
      const bearing = this.map.getBearing();
      const altitudeMeters = this.computeAltitudeMeters(zoom, center.lat, pitch);
      const tier = this.getAltitudeTier(zoom);

      if (this.starfield) {
        this.starfield.setCameraSync(center.lng, center.lat, zoom);
      }

      this.onTelemetry({
        lat: center.lat,
        lon: center.lng,
        zoom,
        pitch,
        bearing,
        altitudeMeters,
        tier
      });
    }
  }

  global.EarthGlobe = EarthGlobe;
})(window);
