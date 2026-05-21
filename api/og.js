// DYNAMIC OG IMAGE — SVG-based, zero dependencies
// /api/og?name=Hope+%26+Anchor&score=6.9&suburb=Paddington&city=Brisbane
// Returns an SVG image that social platforms render as the preview card

function getColor(s) {
  if (s >= 9) return '#ffffff';
  if (s >= 8) return '#4ade80';
  if (s >= 7) return '#2dd4bf';
  if (s >= 6) return '#facc15';
  if (s >= 5) return '#fb923c';
  return '#f87171';
}

function getVerdict(s) {
  if (s >= 9) return 'ELITE';
  if (s >= 8) return 'GREAT';
  if (s >= 7) return 'SOLID';
  if (s >= 6) return 'DECENT';
  if (s >= 5) return 'JUST OKAY';
  return 'AVOID';
}

function esc(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export default function handler(req, res) {
  var name = req.query.name || 'Cafe';
  var score = parseFloat(req.query.score) || 0;
  var suburb = req.query.suburb || '';
  var city = req.query.city || 'Brisbane';
  var notes = req.query.notes || '';
  var color = getColor(score);
  var verdict = getVerdict(score);
  var displayName = name.length > 28 ? name.substring(0, 28) + '...' : name;
  var displayNotes = notes.length > 80 ? notes.substring(0, 80) + '...' : notes;

  // Score ring arc
  var radius = 65;
  var circumference = 2 * Math.PI * radius;
  var offset = circumference - (score / 10) * circumference;

  var svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0a0a0a"/>
      <stop offset="50%" stop-color="#111111"/>
      <stop offset="100%" stop-color="#0a0a0a"/>
    </linearGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#E6C073"/>
      <stop offset="100%" stop-color="rgba(230,192,115,0.2)"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- Header — K logo + KOFFEE REVIEW -->
  <circle cx="76" cy="52" r="20" fill="#E6C073"/>
  <text x="76" y="59" font-family="Arial,sans-serif" font-size="22" font-weight="700" fill="#000" text-anchor="middle">K</text>
  <text x="108" y="58" font-family="Arial,sans-serif" font-size="15" font-weight="700" fill="#E6C073" letter-spacing="4">KOFFEE REVIEW</text>
  <text x="1144" y="58" font-family="Arial,sans-serif" font-size="13" fill="rgba(255,255,255,0.35)" text-anchor="end" letter-spacing="2">koffeereview.com.au</text>

  <!-- Gold divider -->
  <rect x="56" y="82" width="1088" height="2" fill="url(#gold)"/>

  <!-- Score ring -->
  <circle cx="200" cy="310" r="${radius}" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="7"/>
  <circle cx="200" cy="310" r="${radius}" fill="none" stroke="${color}" stroke-width="7"
    stroke-dasharray="${circumference}" stroke-dashoffset="${offset}" stroke-linecap="round"
    transform="rotate(-90 200 310)"/>
  <text x="200" y="300" font-family="Arial,sans-serif" font-size="68" font-weight="700" fill="${color}" text-anchor="middle" dominant-baseline="middle">${score.toFixed(1)}</text>
  <text x="200" y="340" font-family="Arial,sans-serif" font-size="18" fill="rgba(255,255,255,0.3)" text-anchor="middle">/10</text>

  <!-- Verdict badge -->
  <rect x="${200 - verdict.length * 7}" y="390" width="${verdict.length * 14 + 36}" height="32" rx="16" fill="${color}"/>
  <text x="200" y="411" font-family="Arial,sans-serif" font-size="13" font-weight="700" fill="#000" text-anchor="middle" letter-spacing="4">${verdict}</text>

  <!-- Cafe name -->
  <text x="340" y="240" font-family="Arial,sans-serif" font-size="48" font-weight="700" fill="#ffffff">${esc(displayName)}</text>

  <!-- Location -->
  <text x="340" y="280" font-family="Arial,sans-serif" font-size="22" fill="rgba(255,255,255,0.5)">${esc(suburb)}${city ? ', ' + esc(city) : ''}</text>

  <!-- Notes quote -->
  ${displayNotes ? `
  <rect x="340" y="310" width="3" height="${Math.min(displayNotes.length * 0.6, 60)}" fill="${color}" rx="1.5"/>
  <text x="356" y="330" font-family="Arial,sans-serif" font-size="17" fill="rgba(255,255,255,0.4)" font-style="italic">
    <tspan x="356" dy="0">"${esc(displayNotes)}"</tspan>
  </text>` : ''}

  <!-- Bottom tagline -->
  <text x="600" y="590" font-family="Arial,sans-serif" font-size="12" fill="rgba(255,255,255,0.2)" text-anchor="middle" letter-spacing="4">ONE LATTE · ONE DOUBLE SHOT · EVERY TIME</text>

  <!-- Subtle border -->
  <rect x="1" y="1" width="1198" height="628" rx="0" fill="none" stroke="rgba(230,192,115,0.15)" stroke-width="2"/>
</svg>`;

  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800');
  res.status(200).send(svg);
}
