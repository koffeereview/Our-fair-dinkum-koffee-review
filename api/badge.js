// KOFFEE REVIEW BADGE — Premium SVG badge for cafes to embed
// /api/badge?name=Hope+%26+Anchor&score=6.9&suburb=Paddington&slug=hope-anchor-paddington
// /api/badge?name=...&style=dark (dark variant)
// /api/badge?name=...&style=light (light variant for dark cafe websites)
// /api/badge?name=...&style=minimal (small inline badge)

function getColor(s) {
  if (s >= 9) return { main: '#ffffff', glow: 'rgba(255,255,255,0.3)', bg: 'rgba(255,255,255,0.08)' };
  if (s >= 8) return { main: '#4ade80', glow: 'rgba(74,222,128,0.3)', bg: 'rgba(74,222,128,0.08)' };
  if (s >= 7) return { main: '#2dd4bf', glow: 'rgba(45,212,191,0.3)', bg: 'rgba(45,212,191,0.08)' };
  if (s >= 6) return { main: '#facc15', glow: 'rgba(250,204,21,0.3)', bg: 'rgba(250,204,21,0.08)' };
  if (s >= 5) return { main: '#fb923c', glow: 'rgba(251,146,60,0.3)', bg: 'rgba(251,146,60,0.08)' };
  return { main: '#f87171', glow: 'rgba(248,113,113,0.3)', bg: 'rgba(248,113,113,0.08)' };
}

function getVerdict(s) {
  if (s >= 9) return 'ELITE';
  if (s >= 8) return 'GREAT';
  if (s >= 7.5) return 'MUST VISIT';
  if (s >= 7) return 'SOLID';
  if (s >= 6) return 'DECENT';
  if (s >= 5) return 'JUST OKAY';
  return 'AVOID';
}

function esc(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function buildDarkBadge(name, score, suburb, slug) {
  var c = getColor(score);
  var verdict = getVerdict(score);
  var displayName = name.length > 22 ? name.substring(0, 22) + '...' : name;
  var r = 38;
  var circ = 2 * Math.PI * r;
  var off = circ - (score / 10) * circ;

  return `<svg width="280" height="340" viewBox="0 0 280 340" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="cardBg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#111111"/>
      <stop offset="100%" stop-color="#0a0a0a"/>
    </linearGradient>
    <linearGradient id="goldLine" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="transparent"/>
      <stop offset="20%" stop-color="#E6C073"/>
      <stop offset="80%" stop-color="#E6C073"/>
      <stop offset="100%" stop-color="transparent"/>
    </linearGradient>
    <linearGradient id="goldShine" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#F6DDAA"/>
      <stop offset="50%" stop-color="#E6C073"/>
      <stop offset="100%" stop-color="#C49A3C"/>
    </linearGradient>
    <clipPath id="logoClip"><circle cx="36" cy="32" r="13"/></clipPath>
    <radialGradient id="logoGrad" cx="40%" cy="35%">
      <stop offset="0%" stop-color="#F6DDAA"/>
      <stop offset="100%" stop-color="#C49A3C"/>
    </radialGradient>
    <filter id="scoreGlow">
      <feGaussianBlur stdDeviation="4" result="blur"/>
      <feColorMatrix in="blur" type="matrix" values="0 0 0 0 ${parseInt(c.main.slice(1,3),16)/255} 0 0 0 0 ${parseInt(c.main.slice(3,5),16)/255} 0 0 0 0 ${parseInt(c.main.slice(5,7),16)/255} 0 0 0 0.4 0"/>
      <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="goldGlow2">
      <feGaussianBlur stdDeviation="2" result="blur"/>
      <feColorMatrix in="blur" type="matrix" values="0 0 0 0 0.9 0 0 0 0 0.75 0 0 0 0 0.28 0 0 0 0.5 0"/>
      <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <!-- Card background with gold border -->
  <rect width="280" height="340" rx="20" fill="url(#cardBg)"/>
  <rect x="1" y="1" width="278" height="338" rx="19" fill="none" stroke="url(#goldShine)" stroke-width="1.5" opacity="0.4"/>

  <!-- Top gold accent line -->
  <rect x="30" y="0" width="220" height="2" fill="url(#goldLine)" rx="1"/>

  <!-- Header — KOFFEE REVIEW with embedded logo -->
  <clipPath id="logoCircle"><circle cx="36" cy="32" r="13"/></clipPath>
  <circle cx="36" cy="32" r="14" fill="#0a0a0a"/>
  <image href="data:image/webp;base64,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" x="23" y="19" width="26" height="26" clip-path="url(#logoCircle)" preserveAspectRatio="xMidYMid slice"/>
  <circle cx="36" cy="32" r="14" fill="none" stroke="#E6C073" stroke-width="1" opacity="0.5"/>
  <text x="58" y="36" font-family="Georgia,serif" font-size="10" fill="#E6C073" letter-spacing="3" font-weight="600">KOFFEE REVIEW</text>

  <!-- Divider -->
  <rect x="24" y="52" width="232" height="1" fill="url(#goldLine)" opacity="0.3"/>

  <!-- Score ring — centred -->
  <circle cx="140" cy="120" r="${r}" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="4"/>
  <circle cx="140" cy="120" r="${r}" fill="none" stroke="${c.main}" stroke-width="4"
    stroke-dasharray="${circ}" stroke-dashoffset="${off}" stroke-linecap="round"
    transform="rotate(-90 140 120)" filter="url(#scoreGlow)"/>
  <text x="140" y="114" font-family="Georgia,serif" font-size="42" font-weight="700" fill="${c.main}" text-anchor="middle" dominant-baseline="middle" filter="url(#scoreGlow)">${score.toFixed(1)}</text>
  <text x="140" y="142" font-family="Georgia,serif" font-size="11" fill="rgba(255,255,255,0.35)" text-anchor="middle">/10</text>

  <!-- Verdict badge -->
  <rect x="${140 - verdict.length * 5.5 - 14}" y="168" width="${verdict.length * 11 + 28}" height="24" rx="12" fill="${c.main}"/>
  <text x="140" y="184" font-family="Arial,Helvetica,sans-serif" font-size="10" font-weight="700" fill="#0a0a0a" text-anchor="middle" letter-spacing="2.5">${verdict}</text>

  <!-- Café name -->
  <text x="140" y="218" font-family="Georgia,serif" font-size="17" font-weight="700" fill="#ffffff" text-anchor="middle">${esc(displayName)}</text>

  <!-- Location — BRIGHTER -->
  <text x="140" y="238" font-family="Georgia,serif" font-size="11" fill="rgba(255,255,255,0.7)" text-anchor="middle">${esc(suburb)}</text>

  <!-- Bottom gold divider -->
  <rect x="40" y="258" width="200" height="1" fill="url(#goldLine)" opacity="0.25"/>

  <!-- Tagline — BRIGHTER -->
  <text x="140" y="280" font-family="Arial,Helvetica,sans-serif" font-size="7" fill="rgba(255,255,255,0.45)" text-anchor="middle" letter-spacing="2.5">ONE LATTE · ONE DOUBLE SHOT</text>

  <!-- CTA -->
  <rect x="60" y="296" width="160" height="28" rx="14" fill="none" stroke="rgba(230,192,115,0.3)" stroke-width="1"/>
  <text x="140" y="314" font-family="Georgia,serif" font-size="9" fill="#E6C073" text-anchor="middle" letter-spacing="1">Read Full Review →</text>

  <!-- Bottom accent -->
  <rect x="30" y="338" width="220" height="2" fill="url(#goldLine)" rx="1"/>
</svg>`;
}

function buildLightBadge(name, score, suburb, slug) {
  var c = getColor(score);
  var verdict = getVerdict(score);
  var displayName = name.length > 22 ? name.substring(0, 22) + '...' : name;
  var r = 38;
  var circ = 2 * Math.PI * r;
  var off = circ - (score / 10) * circ;
  // Darken score color for light bg
  var darkColor = score >= 9 ? '#1a1a1a' : score >= 8 ? '#166534' : score >= 7 ? '#115e59' : score >= 6 ? '#854d0e' : score >= 5 ? '#9a3412' : '#991b1b';

  return `<svg width="280" height="340" viewBox="0 0 280 340" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="goldLineL" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="transparent"/>
      <stop offset="20%" stop-color="#C49A3C"/>
      <stop offset="80%" stop-color="#C49A3C"/>
      <stop offset="100%" stop-color="transparent"/>
    </linearGradient>
    <clipPath id="logoClipLight"><circle cx="36" cy="32" r="13"/></clipPath>
    <radialGradient id="logoGradL" cx="40%" cy="35%">
      <stop offset="0%" stop-color="#1a1a1a"/>
      <stop offset="100%" stop-color="#333333"/>
    </radialGradient>
  </defs>

  <rect width="280" height="340" rx="20" fill="#faf9f6"/>
  <rect x="1" y="1" width="278" height="338" rx="19" fill="none" stroke="#C49A3C" stroke-width="1.5" opacity="0.3"/>
  <rect x="30" y="0" width="220" height="2" fill="url(#goldLineL)" rx="1"/>

  <clipPath id="logoCircleL"><circle cx="36" cy="32" r="13"/></clipPath>
  <circle cx="36" cy="32" r="14" fill="#faf9f6"/>
  <image href="data:image/webp;base64,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" x="23" y="19" width="26" height="26" clip-path="url(#logoCircleL)" preserveAspectRatio="xMidYMid slice"/>
  <circle cx="36" cy="32" r="14" fill="none" stroke="#C49A3C" stroke-width="1" opacity="0.5"/>
  <text x="58" y="36" font-family="Georgia,serif" font-size="10" fill="#1a1a1a" letter-spacing="3" font-weight="600">KOFFEE REVIEW</text>

  <rect x="24" y="52" width="232" height="1" fill="url(#goldLineL)" opacity="0.3"/>

  <circle cx="140" cy="120" r="${r}" fill="none" stroke="rgba(0,0,0,0.06)" stroke-width="4"/>
  <circle cx="140" cy="120" r="${r}" fill="none" stroke="${darkColor}" stroke-width="4"
    stroke-dasharray="${circ}" stroke-dashoffset="${off}" stroke-linecap="round"
    transform="rotate(-90 140 120)"/>
  <text x="140" y="114" font-family="Georgia,serif" font-size="42" font-weight="700" fill="${darkColor}" text-anchor="middle" dominant-baseline="middle">${score.toFixed(1)}</text>
  <text x="140" y="142" font-family="Georgia,serif" font-size="11" fill="rgba(0,0,0,0.35)" text-anchor="middle">/10</text>

  <rect x="${140 - verdict.length * 5.5 - 14}" y="168" width="${verdict.length * 11 + 28}" height="24" rx="12" fill="${darkColor}"/>
  <text x="140" y="184" font-family="Arial,Helvetica,sans-serif" font-size="10" font-weight="700" fill="#fff" text-anchor="middle" letter-spacing="2.5">${verdict}</text>

  <text x="140" y="218" font-family="Georgia,serif" font-size="17" font-weight="700" fill="#1a1a1a" text-anchor="middle">${esc(displayName)}</text>
  <text x="140" y="238" font-family="Georgia,serif" font-size="11" fill="rgba(0,0,0,0.7)" text-anchor="middle">${esc(suburb)}</text>

  <rect x="40" y="258" width="200" height="1" fill="url(#goldLineL)" opacity="0.25"/>
  <text x="140" y="280" font-family="Arial,Helvetica,sans-serif" font-size="7" fill="rgba(0,0,0,0.45)" text-anchor="middle" letter-spacing="2.5">ONE LATTE · ONE DOUBLE SHOT</text>

  <rect x="60" y="296" width="160" height="28" rx="14" fill="none" stroke="rgba(26,26,26,0.2)" stroke-width="1"/>
  <text x="140" y="314" font-family="Georgia,serif" font-size="9" fill="#1a1a1a" text-anchor="middle" letter-spacing="1">Read Full Review →</text>

  <rect x="30" y="338" width="220" height="2" fill="url(#goldLineL)" rx="1"/>
</svg>`;
}

function buildMinimalBadge(name, score, suburb) {
  var c = getColor(score);
  var verdict = getVerdict(score);

  return `<svg width="200" height="48" viewBox="0 0 200 48" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="48" rx="24" fill="#0a0a0a"/>
  <rect x="0.5" y="0.5" width="199" height="47" rx="23.5" fill="none" stroke="#E6C073" stroke-width="1" opacity="0.3"/>
  <circle cx="28" cy="24" r="16" fill="none" stroke="${c.main}" stroke-width="2"/>
  <text x="28" y="28" font-family="Georgia,serif" font-size="13" font-weight="700" fill="${c.main}" text-anchor="middle">${score.toFixed(1)}</text>
  <text x="54" y="20" font-family="Georgia,serif" font-size="10" fill="#E6C073" letter-spacing="1.5" font-weight="600">KOFFEE REVIEW</text>
  <text x="54" y="34" font-family="Georgia,serif" font-size="8" fill="rgba(255,255,255,0.6)">${verdict}</text>
</svg>`;
}

export default function handler(req, res) {
  var name = req.query.name || 'Cafe';
  var score = parseFloat(req.query.score) || 0;
  var suburb = req.query.suburb || '';
  var slug = req.query.slug || '';
  var style = req.query.style || 'dark';

  var svg;
  if (style === 'light') {
    svg = buildLightBadge(name, score, suburb, slug);
  } else if (style === 'minimal') {
    svg = buildMinimalBadge(name, score, suburb);
  } else {
    svg = buildDarkBadge(name, score, suburb, slug);
  }

  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800');
  res.status(200).send(svg);
}
