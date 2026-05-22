// BADGE EMBED PAGE — Cafe owners visit this to grab their badge + embed code
// /api/embed?slug=hope-anchor-paddington
// Shows badge previews (dark, light, minimal) + copy-paste HTML embed code

const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYEU8Khk3R5I879v3FcXPqhq0aCXa2ZWM1BwwJOyUitx2Boak_AFTOkwvB8qQrKIeU55NM4htFjHbI/pub?gid=0&single=true&output=csv";

function splitCSVLine(line) {
  var result = [];
  var current = "";
  var inQuotes = false;
  for (var i = 0; i < line.length; i++) {
    var char = line[i];
    if (char === '"') { inQuotes = !inQuotes; }
    else if (char === "," && !inQuotes) { result.push(current.trim()); current = ""; }
    else { current += char; }
  }
  result.push(current.trim());
  return result;
}

function makeSlug(name, suburb) {
  return (name + "-" + suburb).toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
}

function escapeHtml(str) {
  return (str || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function parseCSV(text) {
  var lines = text.split("\n").filter(function(l) { return l && l.trim(); });
  if (lines.length < 2) return [];
  var headers = splitCSVLine(lines[0]).map(function(h) { return h.trim().toLowerCase(); });
  var idx = { name: headers.indexOf("name"), suburb: headers.indexOf("suburb"), city: headers.indexOf("city"), score: headers.indexOf("score") };
  if (idx.name === -1 || idx.suburb === -1) return [];
  var out = [];
  for (var i = 1; i < lines.length; i++) {
    try {
      var p = splitCSVLine(lines[i]);
      var name = p[idx.name] || "";
      var suburb = p[idx.suburb] || "";
      if (!name || !suburb) continue;
      out.push({ name: name, suburb: suburb, city: p[idx.city] || "", score: parseFloat(p[idx.score]) || 0 });
    } catch (e) {}
  }
  return out;
}

export default async function handler(req, res) {
  try {
    var slug = (req.query.slug || "").replace(/-+/g, "-");
    
    if (!slug) {
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      return res.status(400).send('<!DOCTYPE html><html><head><title>Badge - Koffee Review</title></head><body style="background:#000;color:#fff;font-family:sans-serif;text-align:center;padding:60px"><h1 style="color:#E6C073">Badge Generator</h1><p>Use /embed/[cafe-slug] to get your badge</p><a href="/" style="color:#E6C073">← Back</a></body></html>');
    }

    var controller = new AbortController();
    var timeoutId = setTimeout(function() { controller.abort(); }, 10000);
    var response = await fetch(SHEET_URL, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!response.ok) throw new Error("Sheet fetch failed");

    var text = await response.text();
    var cafes = parseCSV(text);
    
    var cafe = cafes.find(function(c) { return makeSlug(c.name, c.suburb) === slug; });
    
    if (!cafe) {
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      return res.status(404).send('<!DOCTYPE html><html><head><title>Not Found</title></head><body style="background:#000;color:#fff;font-family:sans-serif;text-align:center;padding:60px"><h1 style="color:#E6C073">Cafe not found</h1><a href="/" style="color:#E6C073">← Back</a></body></html>');
    }
    
    if (cafe.score < 7.5) {
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      return res.status(200).send('<!DOCTYPE html><html><head><title>Badge Not Available</title></head><body style="background:#000;color:#fff;font-family:sans-serif;text-align:center;padding:60px;max-width:600px;margin:0 auto"><h1 style="color:#E6C073">Badge Not Available</h1><p style="color:rgba(255,255,255,0.6);margin:16px 0">Badges are available for cafes scoring 7.5 or above.</p><p style="color:rgba(255,255,255,0.4)">' + escapeHtml(cafe.name) + ' currently scores ' + cafe.score + '/10.</p><a href="/review/' + slug + '" style="color:#E6C073;display:inline-block;margin-top:24px">← View Review</a></body></html>');
    }

    var badgeParams = "name=" + encodeURIComponent(cafe.name) + "&score=" + cafe.score.toFixed(1) + "&suburb=" + encodeURIComponent(cafe.suburb) + "&slug=" + encodeURIComponent(slug);
    var badgeDarkUrl = "/api/badge?" + badgeParams + "&style=dark";
    var badgeLightUrl = "/api/badge?" + badgeParams + "&style=light";
    var badgeMinimalUrl = "/api/badge?" + badgeParams + "&style=minimal";
    var reviewUrl = "https://koffeereview.com.au/review/" + slug;
    
    var embedDark = '<a href="' + reviewUrl + '" target="_blank" rel="noopener"><img src="https://koffeereview.com.au/api/badge?' + badgeParams + '&style=dark" alt="' + escapeHtml(cafe.name) + ' rated ' + cafe.score.toFixed(1) + ' by Koffee Review" width="280" /></a>';
    var embedLight = '<a href="' + reviewUrl + '" target="_blank" rel="noopener"><img src="https://koffeereview.com.au/api/badge?' + badgeParams + '&style=light" alt="' + escapeHtml(cafe.name) + ' rated ' + cafe.score.toFixed(1) + ' by Koffee Review" width="280" /></a>';
    var embedMinimal = '<a href="' + reviewUrl + '" target="_blank" rel="noopener"><img src="https://koffeereview.com.au/api/badge?' + badgeParams + '&style=minimal" alt="Rated ' + cafe.score.toFixed(1) + ' by Koffee Review" width="200" /></a>';
    
    var html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(cafe.name)} Badge — Koffee Review</title>
  <meta name="robots" content="noindex">
  <link rel="icon" href="/logo.webp" type="image/webp">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Georgia, 'Times New Roman', serif; background: #000; color: #fff; min-height: 100vh; }
    .container { max-width: 800px; margin: 0 auto; padding: 40px 24px 80px; }
    
    .header { text-align: center; margin-bottom: 48px; }
    .header img { width: 48px; height: 48px; border-radius: 50%; margin-bottom: 16px; }
    .header h1 { font-size: 28px; margin-bottom: 8px; }
    .header p { color: rgba(255,255,255,0.5); font-size: 15px; }
    .score-hero { color: #E6C073; font-size: 48px; font-weight: 700; margin: 16px 0 4px; }
    .score-label { color: rgba(255,255,255,0.3); font-size: 14px; letter-spacing: 4px; }
    
    .gold-line { height: 1px; background: linear-gradient(90deg, transparent, #E6C073, transparent); margin: 40px 0; opacity: 0.3; }
    
    .section { margin-bottom: 48px; }
    .section-title { font-size: 12px; letter-spacing: 4px; color: #E6C073; margin-bottom: 24px; font-weight: 600; }
    
    .badge-row { display: flex; gap: 24px; justify-content: center; flex-wrap: wrap; margin-bottom: 32px; }
    .badge-option { text-align: center; cursor: pointer; opacity: 0.7; transition: opacity 0.2s; }
    .badge-option:hover, .badge-option.active { opacity: 1; }
    .badge-label { font-size: 11px; color: rgba(255,255,255,0.4); margin-top: 8px; letter-spacing: 2px; }
    
    .embed-box { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 20px; position: relative; margin-bottom: 16px; }
    .embed-code { font-family: 'Courier New', monospace; font-size: 12px; color: rgba(255,255,255,0.6); word-break: break-all; line-height: 1.6; white-space: pre-wrap; }
    .copy-btn { position: absolute; top: 12px; right: 12px; padding: 6px 16px; border-radius: 20px; border: 1px solid #E6C073; background: transparent; color: #E6C073; font-size: 11px; cursor: pointer; font-family: Georgia, serif; letter-spacing: 1px; transition: all 0.2s; }
    .copy-btn:hover { background: #E6C073; color: #000; }
    
    .preview { display: flex; justify-content: center; padding: 40px; border-radius: 16px; margin-bottom: 24px; }
    .preview-dark { background: #0a0a0a; border: 1px solid rgba(255,255,255,0.06); }
    .preview-light { background: #f5f5f0; border: 1px solid rgba(0,0,0,0.1); }
    
    .steps { counter-reset: step; }
    .step { counter-increment: step; display: flex; gap: 16px; margin-bottom: 20px; align-items: flex-start; }
    .step::before { content: counter(step); width: 28px; height: 28px; border-radius: 50%; background: rgba(230,192,115,0.1); border: 1px solid rgba(230,192,115,0.3); display: flex; align-items: center; justify-content: center; font-size: 12px; color: #E6C073; flex-shrink: 0; }
    .step-text { font-size: 14px; color: rgba(255,255,255,0.6); line-height: 1.6; }
    .step-text strong { color: #fff; }
    
    .back-link { display: inline-flex; align-items: center; gap: 8px; color: #E6C073; text-decoration: none; font-size: 14px; margin-top: 32px; }
    .back-link:hover { text-decoration: underline; }
    
    footer { text-align: center; padding-top: 32px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 11px; color: rgba(255,255,255,0.3); }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="/logo.webp" alt="Koffee Review">
      <h1>${escapeHtml(cafe.name)}</h1>
      <p>${escapeHtml(cafe.suburb)}, ${escapeHtml(cafe.city)}</p>
      <div class="score-hero">${cafe.score.toFixed(1)}</div>
      <div class="score-label">OUT OF 10</div>
    </div>

    <div class="gold-line"></div>

    <div class="section">
      <div class="section-title">YOUR BADGE</div>
      <p style="color:rgba(255,255,255,0.5);font-size:14px;margin-bottom:24px;">
        Congratulations — ${escapeHtml(cafe.name)} qualifies for a Koffee Review badge.
        Display it on your website to show customers your independently verified score.
      </p>

      <!-- Dark Badge -->
      <div class="section-title" style="margin-top:32px;">DARK BADGE</div>
      <p style="color:rgba(255,255,255,0.4);font-size:12px;margin-bottom:16px;">Best for light-coloured websites</p>
      <div class="preview preview-light">
        <img src="${badgeDarkUrl}" alt="Dark badge" width="280">
      </div>
      <div class="embed-box">
        <button class="copy-btn" onclick="navigator.clipboard.writeText(document.getElementById('code-dark').textContent);this.textContent='Copied!';setTimeout(()=>this.textContent='Copy',2000)">Copy</button>
        <div class="embed-code" id="code-dark">${escapeHtml(embedDark)}</div>
      </div>

      <!-- Light Badge -->
      <div class="section-title" style="margin-top:40px;">LIGHT BADGE</div>
      <p style="color:rgba(255,255,255,0.4);font-size:12px;margin-bottom:16px;">Best for dark-coloured websites</p>
      <div class="preview preview-dark">
        <img src="${badgeLightUrl}" alt="Light badge" width="280">
      </div>
      <div class="embed-box">
        <button class="copy-btn" onclick="navigator.clipboard.writeText(document.getElementById('code-light').textContent);this.textContent='Copied!';setTimeout(()=>this.textContent='Copy',2000)">Copy</button>
        <div class="embed-code" id="code-light">${escapeHtml(embedLight)}</div>
      </div>

      <!-- Minimal Badge -->
      <div class="section-title" style="margin-top:40px;">MINIMAL BADGE</div>
      <p style="color:rgba(255,255,255,0.4);font-size:12px;margin-bottom:16px;">Inline — perfect for footers or sidebars</p>
      <div class="preview preview-dark">
        <img src="${badgeMinimalUrl}" alt="Minimal badge" width="200">
      </div>
      <div class="embed-box">
        <button class="copy-btn" onclick="navigator.clipboard.writeText(document.getElementById('code-minimal').textContent);this.textContent='Copied!';setTimeout(()=>this.textContent='Copy',2000)">Copy</button>
        <div class="embed-code" id="code-minimal">${escapeHtml(embedMinimal)}</div>
      </div>
    </div>

    <div class="gold-line"></div>

    <div class="section">
      <div class="section-title">HOW TO ADD YOUR BADGE</div>
      <div class="steps">
        <div class="step"><div class="step-text"><strong>Choose your style</strong> — dark for light websites, light for dark websites, minimal for footers.</div></div>
        <div class="step"><div class="step-text"><strong>Copy the embed code</strong> — click the Copy button above.</div></div>
        <div class="step"><div class="step-text"><strong>Paste into your website</strong> — add it to your homepage, about page, or footer HTML.</div></div>
        <div class="step"><div class="step-text"><strong>That's it</strong> — the badge links to your review and updates automatically when your score changes.</div></div>
      </div>
    </div>

    <a href="/review/${slug}" class="back-link">← View Full Review</a>

    <footer>
      <p style="margin-bottom:8px;">© 2026 Our Fair Dinkum Koffee Review</p>
      <p>Badges are free to display. No sponsorship, no payment — just honest scores.</p>
    </footer>
  </div>
</body>
</html>`;

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    res.status(200).send(html);

  } catch (error) {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(500).send('<!DOCTYPE html><html><head><title>Error</title></head><body style="background:#000;color:#fff;text-align:center;padding:60px;font-family:sans-serif"><h1>Something went wrong</h1><a href="/" style="color:#E6C073">← Back</a></body></html>');
  }
}
