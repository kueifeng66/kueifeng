const fs = require('fs');

const diamondBase64 = fs.readFileSync('diamond.jpg').toString('base64');
const diamondDataUri = 'data:image/jpeg;base64,' + diamondBase64;

// Bezel geometry:
// 44 diamonds around circle of radius 196
const BEZEL_COUNT = 44;
const BEZEL_R = 196;
const BEZEL_DIAMOND_SCALE = 0.134; // radius ~ 13.4, diameter ~ 26.8

let bezelDiamondsSvg = '';
let bezelProngsSvg = '';
let bezelSparklesSvg = '';

for (let i = 0; i < BEZEL_COUNT; i++) {
  const angleDeg = (i * 360) / BEZEL_COUNT;
  const angleRad = (angleDeg * Math.PI) / 180;
  const cx = 250 + BEZEL_R * Math.cos(angleRad);
  const cy = 250 + BEZEL_R * Math.sin(angleRad);
  
  // Natural subtle rotation of each diamond around the bezel
  const diamondRot = (angleDeg + (i % 3) * 15).toFixed(1);

  // Recessed circular setting seat beneath each diamond
  bezelDiamondsSvg += `
    <g transform="translate(${cx.toFixed(2)}, ${cy.toFixed(2)})">
      <!-- Gold setting seat collet -->
      <circle cx="0" cy="0" r="14.2" fill="url(#goldBezelCupGrad)" stroke="#744a0e" stroke-width="0.5"/>
      <circle cx="0" cy="0" r="13.2" fill="#121820"/>
      <!-- Authentic Brilliant Cut Diamond -->
      <use href="#authenticDiamond" transform="rotate(${diamondRot}) scale(${BEZEL_DIAMOND_SCALE})"/>
    </g>`;

  // 18k yellow gold setting prongs / beads placed between diamonds (outer and inner rims)
  const midAngleDeg = angleDeg + 360 / (BEZEL_COUNT * 2);
  const midAngleRad = (midAngleDeg * Math.PI) / 180;
  
  const outerProngR = 207.2;
  const innerProngR = 184.8;
  
  const opX = 250 + outerProngR * Math.cos(midAngleRad);
  const opY = 250 + outerProngR * Math.sin(midAngleRad);
  const ipX = 250 + innerProngR * Math.cos(midAngleRad);
  const ipY = 250 + innerProngR * Math.sin(midAngleRad);

  bezelProngsSvg += `
    <circle cx="${opX.toFixed(2)}" cy="${opY.toFixed(2)}" r="2.2" fill="url(#goldProngGrad)" stroke="#684107" stroke-width="0.35"/>
    <circle cx="${ipX.toFixed(2)}" cy="${ipY.toFixed(2)}" r="2.2" fill="url(#goldProngGrad)" stroke="#684107" stroke-width="0.35"/>`;

  // Specular sparkle flare on every 4th diamond with staggered animation delays
  if (i % 4 === 0 || i === 7 || i === 19 || i === 31) {
    const delay = ((i * 0.27) % 3.6).toFixed(2);
    // Slight offset from diamond center to simulate light catching an upper facet
    const sparkleX = cx + (Math.cos(i) * 3.5);
    const sparkleY = cy + (Math.sin(i) * 3.5);
    bezelSparklesSvg += `
      <g transform="translate(${sparkleX.toFixed(2)}, ${sparkleY.toFixed(2)})">
        <g class="diamond-sparkle-glint" style="--delay: ${delay}s;">
          <use href="#diamondSparkleStar" transform="scale(0.65)"/>
        </g>
      </g>`;
  }
}

// Dial hour markers: 1, 2, 4, 5, 6, 7, 8, 9, 10, 11
const DIAL_HOURS = [1, 2, 4, 5, 6, 7, 8, 9, 10, 11];
const DIAL_R = 135;
let dialMarkersSvg = '';
let dialSparklesSvg = '';

DIAL_HOURS.forEach((h, idx) => {
  const angleDeg = h * 30 - 90; // 12 o'clock is -90 deg
  const angleRad = (angleDeg * Math.PI) / 180;
  const cx = 250 + DIAL_R * Math.cos(angleRad);
  const cy = 250 + DIAL_R * Math.sin(angleRad);
  
  const delay = (idx * 0.45).toFixed(2);
  const markerRot = (angleDeg + 45).toFixed(1); // Set square chaton oriented beautifully

  dialMarkersSvg += `
    <!-- Hour ${h} Diamond Marker -->
    <g transform="translate(${cx.toFixed(2)}, ${cy.toFixed(2)})">
      <!-- Soft drop shadow beneath chaton -->
      <rect x="-12.5" y="-12.5" width="25" height="25" rx="2" transform="rotate(45)" fill="rgba(0,0,0,0.35)"/>
      <!-- 18k Yellow Gold Square Chaton Setting Frame -->
      <rect x="-12" y="-12" width="24" height="24" rx="1.8" transform="rotate(45)" fill="url(#goldChatonGrad)" stroke="#744a0e" stroke-width="0.75"/>
      <!-- Recessed Inner Gold Bevel -->
      <rect x="-9.8" y="-9.8" width="19.6" height="19.6" rx="1.2" transform="rotate(45)" fill="url(#goldChatonInnerGrad)"/>
      <!-- Dark Circular Recessed Seat -->
      <circle cx="0" cy="0" r="10.2" fill="#080d14" stroke="#5a3805" stroke-width="0.5"/>
      <!-- Authentic Brilliant Cut Diamond -->
      <use href="#authenticDiamond" transform="scale(0.10)"/>
      <!-- 4 Spherical 18k Yellow Gold Corner Prongs Clamping Diamond -->
      <circle cx="0" cy="-10.2" r="2.1" fill="url(#goldProngGrad)" stroke="#684107" stroke-width="0.4"/>
      <circle cx="0" cy="10.2" r="2.1" fill="url(#goldProngGrad)" stroke="#684107" stroke-width="0.4"/>
      <circle cx="-10.2" cy="0" r="2.1" fill="url(#goldProngGrad)" stroke="#684107" stroke-width="0.4"/>
      <circle cx="10.2" cy="0" r="2.1" fill="url(#goldProngGrad)" stroke="#684107" stroke-width="0.4"/>
      <!-- Small Outer Tritium/Lume Dot just outside marker -->
      <circle cx="${(Math.cos(angleRad) * 16.5).toFixed(2)}" cy="${(Math.sin(angleRad) * 16.5).toFixed(2)}" r="1.3" fill="#fcf9ec" stroke="#b08630" stroke-width="0.35"/>
    </g>`;

  // Sparkle flare on dial diamonds
  dialSparklesSvg += `
    <g transform="translate(${(cx - 2.5).toFixed(2)}, ${(cy - 2.5).toFixed(2)})">
      <g class="diamond-sparkle-glint" style="--delay: ${delay}s;">
        <use href="#diamondSparkleStar" transform="scale(0.72)"/>
      </g>
    </g>`;
});

// Full index.html content
const htmlContent = `<!DOCTYPE html>
<html lang="en">
   <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="styles.css" rel="stylesheet">
    <script type="speculationrules">
        {
          "prerender": [
            {
              "urls": ["/", "/site1/index.html", "/site2/index.html", "/site3/index.html"],
              "eagerness": "eager"
            }
          ]
        }
    </script>
    <script defer src="script.js"></script>
    <title>Rolex Oyster Perpetual Datejust Diamond Edition</title>
   </head>
   <body>
    <div id="clock2"></div>
	
    <div class="clock">
      <!-- Rolex Oyster Perpetual Datejust Diamond Edition SVG Dial -->
      <svg class="rolex-dial-svg" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg" aria-label="Rolex Datejust Diamond Watch">
        <defs>
          <!-- Champagne Sunburst Dial Radial Gradient -->
          <radialGradient id="dialChampagneGrad" cx="48%" cy="47%" r="56%">
            <stop offset="0%" stop-color="#fae7b4"/>
            <stop offset="30%" stop-color="#f2dc9e"/>
            <stop offset="68%" stop-color="#e0bf77"/>
            <stop offset="92%" stop-color="#cca354"/>
            <stop offset="100%" stop-color="#b88f40"/>
          </radialGradient>

          <!-- 18k Yellow Gold Bezel Channel Gradients -->
          <linearGradient id="goldChannelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fae6a6"/>
            <stop offset="25%" stop-color="#e2b453"/>
            <stop offset="50%" stop-color="#fdf0be"/>
            <stop offset="75%" stop-color="#9b6814"/>
            <stop offset="100%" stop-color="#d6a23b"/>
          </linearGradient>

          <radialGradient id="goldBezelCupGrad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stop-color="#fff5cf"/>
            <stop offset="45%" stop-color="#e2b453"/>
            <stop offset="85%" stop-color="#8a5b10"/>
            <stop offset="100%" stop-color="#553404"/>
          </radialGradient>

          <!-- 18k Gold Chaton Setting Gradients -->
          <linearGradient id="goldChatonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fff8d6"/>
            <stop offset="35%" stop-color="#eec366"/>
            <stop offset="70%" stop-color="#b88323"/>
            <stop offset="100%" stop-color="#6e4909"/>
          </linearGradient>

          <linearGradient id="goldChatonInnerGrad" x1="100%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="#fff0b8"/>
            <stop offset="50%" stop-color="#d9a741"/>
            <stop offset="100%" stop-color="#8b5d13"/>
          </linearGradient>

          <!-- 3D Gold Prong Bead Spherical Gradient -->
          <radialGradient id="goldProngGrad" cx="32%" cy="28%" r="68%">
            <stop offset="0%" stop-color="#ffffff"/>
            <stop offset="30%" stop-color="#fff1bc"/>
            <stop offset="65%" stop-color="#dca538"/>
            <stop offset="90%" stop-color="#8b5c11"/>
            <stop offset="100%" stop-color="#462c04"/>
          </radialGradient>

          <!-- Outer Steel / Gold Watch Case Rim -->
          <linearGradient id="steelRimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#f7f9fa"/>
            <stop offset="20%" stop-color="#c4cbd0"/>
            <stop offset="50%" stop-color="#edf1f3"/>
            <stop offset="80%" stop-color="#8c9499"/>
            <stop offset="100%" stop-color="#dbe1e4"/>
          </linearGradient>

          <!-- 18k Gold Coronet Crown Gradient -->
          <linearGradient id="coronetGoldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#fff7d6"/>
            <stop offset="35%" stop-color="#eec76b"/>
            <stop offset="75%" stop-color="#ba8623"/>
            <stop offset="100%" stop-color="#734e0c"/>
          </linearGradient>

          <!-- Date Window Frame Gold Gradient -->
          <linearGradient id="dateFrameGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fff4c2"/>
            <stop offset="40%" stop-color="#e1af49"/>
            <stop offset="80%" stop-color="#9a6513"/>
            <stop offset="100%" stop-color="#5a3706"/>
          </linearGradient>

          <!-- Date Disc Surface Gradient -->
          <linearGradient id="dateDiscGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#ffffff"/>
            <stop offset="70%" stop-color="#fbfaf5"/>
            <stop offset="100%" stop-color="#eceae2"/>
          </linearGradient>

          <!-- Cyclops Lens Reflection Gradient -->
          <linearGradient id="cyclopsGlassGrad" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stop-color="rgba(255,255,255,0.48)"/>
            <stop offset="35%" stop-color="rgba(255,255,255,0.12)"/>
            <stop offset="65%" stop-color="rgba(255,255,255,0.02)"/>
            <stop offset="100%" stop-color="rgba(200,230,255,0.22)"/>
          </linearGradient>

          <!-- Sparkle Flare Gradients & Filter -->
          <radialGradient id="sparkleCoreGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#ffffff"/>
            <stop offset="25%" stop-color="#ffffff"/>
            <stop offset="60%" stop-color="rgba(240, 248, 255, 0.75)"/>
            <stop offset="100%" stop-color="rgba(255, 255, 255, 0)"/>
          </radialGradient>

          <linearGradient id="sparkleRainbowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="rgba(0, 229, 255, 0.8)"/>
            <stop offset="35%" stop-color="rgba(255, 255, 255, 0.95)"/>
            <stop offset="70%" stop-color="rgba(255, 64, 129, 0.85)"/>
            <stop offset="100%" stop-color="rgba(255, 215, 64, 0.75)"/>
          </linearGradient>

          <filter id="sparkleGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.8" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          <!-- ================= REAL DIAMOND ASSET DEFINITION ================= -->
          <!-- Circular clip matching exact girdle of the authentic round brilliant cut diamond -->
          <clipPath id="diamondUnitClip">
            <circle cx="0" cy="0" r="100"/>
          </clipPath>

          <!-- Authentic Diamond Master Symbol (from user attachment) -->
          <g id="authenticDiamond">
            <!-- Deep obsidian pavilion backing -->
            <circle cx="0" cy="0" r="100" fill="#060c14"/>
            <!-- Clipped authentic photograph of round brilliant cut diamond -->
            <g clip-path="url(#diamondUnitClip)">
              <image href="${diamondDataUri}" x="-116.07" y="-117.86" width="232.14" height="234.82" preserveAspectRatio="none"/>
            </g>
            <!-- Razor crystal edge facet & girdle highlights -->
            <circle cx="0" cy="0" r="99.5" fill="none" stroke="rgba(255, 255, 255, 0.65)" stroke-width="1.6"/>
            <circle cx="0" cy="0" r="98" fill="none" stroke="rgba(195, 230, 255, 0.35)" stroke-width="1.2"/>
          </g>

          <!-- Diamond Optical Sparkle Star -->
          <g id="diamondSparkleStar" filter="url(#sparkleGlow)">
            <!-- Diamond light diffraction primary spikes -->
            <path d="M 0 -17 Q 0.5 0 17 0 Q 0.5 0 0 17 Q -0.5 0 -17 0 Q -0.5 0 0 -17 Z" fill="url(#sparkleCoreGrad)"/>
            <!-- Diagonal spectral prismatic flare -->
            <path d="M -9 -9 Q 0 0 9 9 Q 0 0 -9 9 Q 0 0 9 -9 Z" fill="url(#sparkleRainbowGrad)" opacity="0.75"/>
            <!-- Central blinding white light burst -->
            <circle cx="0" cy="0" r="2.8" fill="#ffffff"/>
            <circle cx="0" cy="0" r="1.4" fill="#ffffff"/>
          </g>
        </defs>

        <!-- ================= LAYER 1: OUTER WATCH CASE ================= -->
        <!-- Stainless Steel Outer Case Rim -->
        <circle cx="250" cy="250" r="236" fill="url(#steelRimGrad)" stroke="#667279" stroke-width="1.5"/>
        <circle cx="250" cy="250" r="224" fill="#242b30"/>
        
        <!-- 18k Yellow Gold Bezel Outer Edge -->
        <circle cx="250" cy="250" r="222" fill="url(#goldChannelGrad)" stroke="#7d520e" stroke-width="0.8"/>
        <!-- Beaded / Milgrain Outer Ring Edge -->
        <circle cx="250" cy="250" r="211.5" fill="none" stroke="#7a4e0c" stroke-width="1.2" stroke-dasharray="1.2, 1.8"/>

        <!-- ================= LAYER 2: 44 AUTHENTIC DIAMOND BEZEL ================= -->
        <!-- Polished 18k Yellow Gold Diamond Channel Track -->
        <circle cx="250" cy="250" r="196" fill="none" stroke="url(#goldChannelGrad)" stroke-width="31"/>
        <circle cx="250" cy="250" r="196" fill="none" stroke="#523204" stroke-width="29" opacity="0.25"/>

        <!-- 44 Genuine Round Brilliant Cut Diamonds on Bezel -->
        <g id="bezel-diamonds-group">
          ${bezelDiamondsSvg}
        </g>

        <!-- 18k Yellow Gold Prongs & Bead Setting -->
        <g id="bezel-prongs-group">
          ${bezelProngsSvg}
        </g>

        <!-- Dynamic Diamond Scintillation Sparkles on Bezel -->
        <g id="bezel-sparkles-group">
          ${bezelSparklesSvg}
        </g>

        <!-- Inner Bezel Gold Border Rim & Crystal Retaining Ring -->
        <circle cx="250" cy="250" r="180.5" fill="none" stroke="#784d0b" stroke-width="1.5"/>
        <circle cx="250" cy="250" r="179" fill="none" stroke="url(#goldChannelGrad)" stroke-width="1.5"/>
        <circle cx="250" cy="250" r="177.5" fill="none" stroke="#2a1b04" stroke-width="1"/>

        <!-- ================= LAYER 3: CHAMPAGNE SUNBURST DIAL ================= -->
        <circle cx="250" cy="250" r="176.5" fill="url(#dialChampagneGrad)"/>

        <!-- Subtle Radial Sunburst Texture Rays -->
        <circle cx="250" cy="250" r="176.5" fill="none" stroke="rgba(255, 245, 215, 0.15)" stroke-width="2" stroke-dasharray="0.6, 2.5"/>

        <!-- Outer Minute Track: 60 Refined Ticks and Accents -->
        <g id="dial-minute-track" stroke="#593b08" stroke-width="0.85" opacity="0.8">
          ${Array.from({ length: 60 }).map((_, i) => {
            if (i % 5 === 0) {
              // 5-minute bolder markers
              const a = (i * 6 * Math.PI) / 180;
              const x1 = 250 + 172 * Math.cos(a);
              const y1 = 250 + 172 * Math.sin(a);
              const x2 = 250 + 165 * Math.cos(a);
              const y2 = 250 + 165 * Math.sin(a);
              return `<line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}" stroke-width="1.4"/>`;
            } else {
              // 1-minute fine markers
              const a = (i * 6 * Math.PI) / 180;
              const x1 = 250 + 172 * Math.cos(a);
              const y1 = 250 + 172 * Math.sin(a);
              const x2 = 250 + 168 * Math.cos(a);
              const y2 = 250 + 168 * Math.sin(a);
              return `<line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}" stroke-width="0.7"/>`;
            }
          }).join('')}
        </g>

        <!-- ================= LAYER 4: 10 AUTHENTIC DIAMOND HOUR MARKERS ================= -->
        <g id="dial-diamond-markers">
          ${dialMarkersSvg}
        </g>

        <!-- Dial Scintillation Sparkle Twinkles -->
        <g id="dial-sparkles-group">
          ${dialSparklesSvg}
        </g>

        <!-- ================= LAYER 5: 12 O'CLOCK 18K ROLEX CORONET ================= -->
        <g id="rolex-coronet" transform="translate(250, 118)">
          <!-- Coronet Soft Drop Shadow -->
          <g opacity="0.35" transform="translate(0, 1.2)">
            <ellipse cx="0" cy="17" rx="8" ry="2.2" fill="#2d1d05"/>
            <polygon points="-7.5,15 -14.5,1.5 -8.5,7 0,-2 8.5,7 14.5,1.5 7.5,15" fill="#2d1d05"/>
            <circle cx="-14.5" cy="1" r="1.8" fill="#2d1d05"/>
            <circle cx="-7.5" cy="6" r="1.8" fill="#2d1d05"/>
            <circle cx="0" cy="-2.5" r="2.1" fill="#2d1d05"/>
            <circle cx="7.5" cy="6" r="1.8" fill="#2d1d05"/>
            <circle cx="14.5" cy="1" r="1.8" fill="#2d1d05"/>
          </g>
          <!-- 18k Yellow Gold 5-Prong Coronet Crown Body -->
          <ellipse cx="0" cy="17" rx="8.5" ry="2.3" fill="url(#coronetGoldGrad)" stroke="#684307" stroke-width="0.5"/>
          <polygon points="-8,15.5 -15.5,1 -9,7.5 0,-1.5 9,7.5 15.5,1 8,15.5" fill="url(#coronetGoldGrad)" stroke="#684307" stroke-width="0.5"/>
          <!-- 5 Iconic Golden Spheres atop Coronet points -->
          <circle cx="-15.5" cy="1" r="2.0" fill="url(#goldProngGrad)" stroke="#684307" stroke-width="0.4"/>
          <circle cx="-8.2" cy="6.5" r="1.9" fill="url(#goldProngGrad)" stroke="#684307" stroke-width="0.4"/>
          <circle cx="0" cy="-2" r="2.3" fill="url(#goldProngGrad)" stroke="#684307" stroke-width="0.45"/>
          <circle cx="8.2" cy="6.5" r="1.9" fill="url(#goldProngGrad)" stroke="#684307" stroke-width="0.4"/>
          <circle cx="15.5" cy="1" r="2.0" fill="url(#goldProngGrad)" stroke="#684307" stroke-width="0.4"/>
        </g>

        <!-- ================= LAYER 6: 3 O'CLOCK DATEJUST APERTURE & CYCLOPS ================= -->
        <!-- Date Window at 3 o'clock: center at x=382, y=250 -->
        <g id="date-aperture-group" transform="translate(382, 250)">
          <!-- Recessed Window Depth Shadow -->
          <rect x="-24" y="-19" width="48" height="38" rx="3.5" fill="rgba(0,0,0,0.4)"/>
          
          <!-- 18k Yellow Gold Outer Step Bevel Frame -->
          <rect x="-23" y="-18" width="46" height="36" rx="3" fill="url(#dateFrameGoldGrad)" stroke="#6a4409" stroke-width="0.75"/>
          
          <!-- Inner Recessed Step Wall -->
          <rect x="-19.5" y="-14.5" width="39" height="29" rx="1.5" fill="#5c3b06"/>
          
          <!-- Date Wheel White Surface Aperture -->
          <rect x="-18" y="-13" width="36" height="26" rx="1" fill="url(#dateDiscGrad)"/>
          
          <!-- Live Date Number Text from script.js -->
          <text id="date-display"
                x="0"
                y="6.5"
                text-anchor="middle"
                fill="#0d0e10"
                font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
                font-size="20.5"
                font-weight="700"
                letter-spacing="-0.5">28</text>

          <!-- Rolex Cyclops Magnifier Lens with Beveled Edge & Glass Reflections -->
          <rect x="-26" y="-21" width="52" height="42" rx="7.5" fill="url(#cyclopsGlassGrad)" stroke="rgba(255,255,255,0.7)" stroke-width="0.85"/>
          <!-- Subtle Curved Magnifier Specular Sheen -->
          <path d="M -23 -17 Q 0 -22 23 -17" fill="none" stroke="rgba(255, 255, 255, 0.85)" stroke-width="0.9"/>
          <path d="M -22 17 Q 0 21 22 17" fill="none" stroke="rgba(0, 0, 0, 0.22)" stroke-width="0.8"/>
        </g>

        <!-- ================= LAYER 7: DIAL TEXT INSCRIPTIONS ================= -->
        <g id="dial-typography" text-anchor="middle">
          <!-- Upper Text: ROLEX -->
          <text x="250" y="152"
                fill="#005030"
                font-family="'Times New Roman', Times, 'Cinzel', 'Playfair Display', Georgia, serif"
                font-size="21.5"
                font-weight="700"
                letter-spacing="3.2">ROLEX</text>
          
          <!-- OYSTER PERPETUAL -->
          <text x="250" y="167"
                fill="#2b1c04"
                font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif"
                font-size="8.8"
                font-weight="600"
                letter-spacing="2.2">OYSTER PERPETUAL</text>

          <!-- DATEJUST -->
          <text x="250" y="180"
                fill="#2b1c04"
                font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif"
                font-size="10.8"
                font-weight="700"
                letter-spacing="2.6">DATEJUST</text>

          <!-- Lower Text: SUPERLATIVE CHRONOMETER -->
          <text x="250" y="324"
                fill="#2b1c04"
                font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif"
                font-size="7.4"
                font-weight="600"
                letter-spacing="1.5">SUPERLATIVE CHRONOMETER</text>
          
          <!-- OFFICIALLY CERTIFIED -->
          <text x="250" y="337"
                fill="#2b1c04"
                font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif"
                font-size="7.4"
                font-weight="600"
                letter-spacing="1.5">OFFICIALLY CERTIFIED</text>

          <!-- Bottom: T SWISS MADE T -->
          <g transform="translate(250, 412)">
            <text x="-48" y="0"
                  fill="#543906"
                  font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif"
                  font-size="6.2"
                  font-weight="600"
                  letter-spacing="1.0">T SWISS</text>
            <text x="48" y="0"
                  fill="#543906"
                  font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif"
                  font-size="6.2"
                  font-weight="600"
                  letter-spacing="1.0">MADE T</text>
          </g>
        </g>
      </svg>

      <!-- ================= ROTATING HANDS ================= -->
      <!-- Hour Hand -->
      <div class="hand hour" hour-hand>
        <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
          <g>
            <!-- Left & Right 3D Faceted Gold Blade -->
            <polygon points="243.6,282 250,282 250,140 244.4,140" fill="#e5bc5d" stroke="#7d520e" stroke-width="0.35"/>
            <polygon points="250,282 256.4,282 255.6,140 250,140" fill="#b38020" stroke="#7d520e" stroke-width="0.35"/>
            <!-- Circular Gold Center Collar -->
            <circle cx="250" cy="250" r="12.8" fill="#cfa03d" stroke="#7d520e" stroke-width="0.5"/>
            <!-- White Luminescent Insert in Outer Half of Hour Hand -->
            <rect x="247.3" y="146.5" width="5.4" height="58" fill="#efede6" stroke="#8f6319" stroke-width="0.45"/>
          </g>
        </svg>
      </div>

      <!-- Minute Hand -->
      <div class="hand minute" min-hand>
        <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="centerPinGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stop-color="#ffffff"/>
              <stop offset="55%" stop-color="#cfd4d6"/>
              <stop offset="100%" stop-color="#585d60"/>
            </radialGradient>
          </defs>
          <g>
            <!-- Left & Right 3D Faceted Gold Blade -->
            <polygon points="244.4,288 250,288 250,91 245.4,91" fill="#ecc466" stroke="#7d520e" stroke-width="0.35"/>
            <polygon points="250,288 255.6,288 254.6,91 250,91" fill="#b88424" stroke="#7d520e" stroke-width="0.35"/>
            <!-- Circular Gold Center Boss -->
            <circle cx="250" cy="250" r="11.6" fill="#d6a744" stroke="#7d520e" stroke-width="0.5"/>
            <!-- White Luminescent Insert in Outer Half of Minute Hand -->
            <rect x="247.6" y="98" width="4.8" height="96" fill="#efede6" stroke="#8f6319" stroke-width="0.45"/>
          </g>
        </svg>
      </div>

      <!-- Continuously Sweeping Rolex Second Hand -->
      <div class="hand second" sec-hand>
        <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="secHandGoldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#f7dd8c"/>
              <stop offset="50%" stop-color="#d4a038"/>
              <stop offset="100%" stop-color="#946210"/>
            </linearGradient>
            <radialGradient id="secCapGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stop-color="#fff3c4"/>
              <stop offset="55%" stop-color="#d8a642"/>
              <stop offset="100%" stop-color="#7d500a"/>
            </radialGradient>
            <radialGradient id="secPinGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stop-color="#ffffff"/>
              <stop offset="55%" stop-color="#cfd4d6"/>
              <stop offset="100%" stop-color="#585d60"/>
            </radialGradient>
          </defs>
          <g>
            <!-- Counterweight Tail -->
            <polygon points="248.6,250 251.4,250 252.2,288 250,296 247.8,288" fill="url(#secHandGoldGrad)" stroke="#7a4e0b" stroke-width="0.3"/>
            <!-- Slender Tapered Sweeping Needle -->
            <polygon points="248.8,250 251.2,250 250.45,80 249.55,80" fill="url(#secHandGoldGrad)" stroke="#7a4e0b" stroke-width="0.25"/>
            <!-- Gold Center Cap -->
            <circle cx="250" cy="250" r="6.2" fill="url(#secCapGrad)" stroke="#6e4508" stroke-width="0.45"/>
            <!-- Center Silver Pivot Pin -->
            <circle cx="250" cy="250" r="2.4" fill="url(#secPinGrad)" stroke="#4a3208" stroke-width="0.35"/>
          </g>
        </svg>
      </div>
    </div>
   </body>
</html>
`;

fs.writeFileSync('index.html', htmlContent, 'utf8');
console.log('Successfully wrote index.html! File size:', htmlContent.length);
