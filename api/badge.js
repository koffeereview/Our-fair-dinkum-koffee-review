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

  <!-- Header — KOFFEE REVIEW -->
  <circle cx="36" cy="32" r="12" fill="#E6C073"/>
  <text x="36" y="37" font-family="Georgia,serif" font-size="13" font-weight="700" fill="#0a0a0a" text-anchor="middle">K</text>
  <text x="56" y="36" font-family="Georgia,serif" font-size="10" fill="#E6C073" letter-spacing="3" font-weight="600">KOFFEE REVIEW</text>

  <!-- Divider -->
  <rect x="24" y="52" width="232" height="1" fill="url(#goldLine)" opacity="0.3"/>

  <!-- Score ring — centred -->
  <circle cx="140" cy="120" r="${r}" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="4"/>
  <circle cx="140" cy="120" r="${r}" fill="none" stroke="${c.main}" stroke-width="4"
    stroke-dasharray="${circ}" stroke-dashoffset="${off}" stroke-linecap="round"
    transform="rotate(-90 140 120)" filter="url(#scoreGlow)"/>
  <text x="140" y="114" font-family="Georgia,serif" font-size="42" font-weight="700" fill="${c.main}" text-anchor="middle" dominant-baseline="middle" filter="url(#scoreGlow)">${score.toFixed(1)}</text>
  <text x="140" y="142" font-family="Georgia,serif" font-size="11" fill="rgba(255,255,255,0.25)" text-anchor="middle">/10</text>

  <!-- Verdict badge -->
  <rect x="${140 - verdict.length * 5.5 - 14}" y="168" width="${verdict.length * 11 + 28}" height="24" rx="12" fill="${c.main}"/>
  <text x="140" y="184" font-family="Arial,Helvetica,sans-serif" font-size="10" font-weight="700" fill="#0a0a0a" text-anchor="middle" letter-spacing="2.5">${verdict}</text>

  <!-- Café name -->
  <text x="140" y="218" font-family="Georgia,serif" font-size="17" font-weight="700" fill="#ffffff" text-anchor="middle">${esc(displayName)}</text>

  <!-- Location -->
  <text x="140" y="238" font-family="Georgia,serif" font-size="11" fill="rgba(255,255,255,0.4)" text-anchor="middle">${esc(suburb)}</text>

  <!-- Bottom gold divider -->
  <rect x="40" y="258" width="200" height="1" fill="url(#goldLine)" opacity="0.25"/>

  <!-- Tagline -->
  <text x="140" y="280" font-family="Arial,Helvetica,sans-serif" font-size="7" fill="rgba(255,255,255,0.2)" text-anchor="middle" letter-spacing="2.5">ONE LATTE · ONE DOUBLE SHOT</text>

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
  </defs>

  <rect width="280" height="340" rx="20" fill="#faf9f6"/>
  <rect x="1" y="1" width="278" height="338" rx="19" fill="none" stroke="#C49A3C" stroke-width="1.5" opacity="0.3"/>
  <rect x="30" y="0" width="220" height="2" fill="url(#goldLineL)" rx="1"/>

  <circle cx="36" cy="32" r="12" fill="#1a1a1a"/>
  <text x="36" y="37" font-family="Georgia,serif" font-size="13" font-weight="700" fill="#E6C073" text-anchor="middle">K</text>
  <text x="56" y="36" font-family="Georgia,serif" font-size="10" fill="#1a1a1a" letter-spacing="3" font-weight="600">KOFFEE REVIEW</text>

  <rect x="24" y="52" width="232" height="1" fill="url(#goldLineL)" opacity="0.3"/>

  <circle cx="140" cy="120" r="${r}" fill="none" stroke="rgba(0,0,0,0.06)" stroke-width="4"/>
  <circle cx="140" cy="120" r="${r}" fill="none" stroke="${darkColor}" stroke-width="4"
    stroke-dasharray="${circ}" stroke-dashoffset="${off}" stroke-linecap="round"
    transform="rotate(-90 140 120)"/>
  <text x="140" y="114" font-family="Georgia,serif" font-size="42" font-weight="700" fill="${darkColor}" text-anchor="middle" dominant-baseline="middle">${score.toFixed(1)}</text>
  <text x="140" y="142" font-family="Georgia,serif" font-size="11" fill="rgba(0,0,0,0.25)" text-anchor="middle">/10</text>

  <rect x="${140 - verdict.length * 5.5 - 14}" y="168" width="${verdict.length * 11 + 28}" height="24" rx="12" fill="${darkColor}"/>
  <text x="140" y="184" font-family="Arial,Helvetica,sans-serif" font-size="10" font-weight="700" fill="#fff" text-anchor="middle" letter-spacing="2.5">${verdict}</text>

  <text x="140" y="218" font-family="Georgia,serif" font-size="17" font-weight="700" fill="#1a1a1a" text-anchor="middle">${esc(displayName)}</text>
  <text x="140" y="238" font-family="Georgia,serif" font-size="11" fill="rgba(0,0,0,0.45)" text-anchor="middle">${esc(suburb)}</text>

  <rect x="40" y="258" width="200" height="1" fill="url(#goldLineL)" opacity="0.25"/>
  <text x="140" y="280" font-family="Arial,Helvetica,sans-serif" font-size="7" fill="rgba(0,0,0,0.2)" text-anchor="middle" letter-spacing="2.5">ONE LATTE · ONE DOUBLE SHOT</text>

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
  <text x="54" y="34" font-family="Georgia,serif" font-size="8" fill="rgba(255,255,255,0.4)">${verdict}</text>
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
