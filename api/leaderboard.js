const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYEU8Khk3R5I879v3FcXPqhq0aCXa2ZWM1BwwJOyUitx2Boak_AFTOkwvB8qQrKIeU55NM4htFjHbI/pub?gid=0&single=true&output=csv";
const SPAIN_CITIES = ["barcelona", "catalonia", "spain"];

function splitCSVLine(line) {
  const result = []; let current = ""; let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') { inQuotes = !inQuotes; }
    else if (char === "," && !inQuotes) { result.push(current.trim()); current = ""; }
    else { current += char; }
  }
  result.push(current.trim());
  return result;
}

function parseCSV(text) {
  const lines = text.trim().split("\n");
  const headers = splitCSVLine(lines[0]);
  return lines.slice(1).map(function(line) {
    const values = splitCSVLine(line);
    const obj = {};
    headers.forEach(function(h, i) { obj[h] = values[i] || ""; });
    obj.score = parseFloat(obj.score) || 0;
    return obj;
  }).filter(function(c) {
    return c.name && c.score > 0 && !SPAIN_CITIES.includes((c.city || "").toLowerCase());
  });
}

function getScoreColor(score) {
  if (score >= 9.0) return "#FFD700";
  if (score >= 8.0) return "#4ade80";
  if (score >= 7.0) return "#2dd4bf";
  if (score >= 6.0) return "#facc15";
  if (score >= 5.0) return "#fb923c";
  return "#f87171";
}

function getVerdict(score) {
  if (score >= 9.1) return "ELITE";
  if (score >= 8.1) return "GREAT";
  if (score >= 7.5) return "LOVED";
  if (score >= 7.1) return "SOLID";
  if (score >= 6.5) return "DECENT";
  if (score >= 6.1) return "TAKE OR LEAVE";
  if (score >= 5.5) return "AVERAGE";
  if (score >= 5.1) return "JUST OKAY";
  if (score >= 4.1) return "NOT FOR US";
  return "AVOID";
}

function makeSlug(name, suburb) {
  return (name + "-" + suburb).toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
}

export default async function handler(req, res) {
  try {
    const response = await fetch(SHEET_URL);
    const text = await response.text();
    const cafes = parseCSV(text);

    const top10 = cafes
      .sort(function(a, b) { return b.score - a.score; })
      .slice(0, 10);

    const title = "Top 10 Cafés in Australia | Koffee Review";
    const desc = "Australia's highest rated cafés reviewed by Koffee Review. One latte and one double shot espresso every time. No sponsorships. Just honest scores.";
    const canonicalUrl = "https://koffeereview.com.au/leaderboard";

    // Podium — #2 left, #1 centre, #3 right
    const p1 = top10[0]; const p2 = top10[1]; const p3 = top10[2];

    function podiumBlock(cafe, rank, height, bgColor, borderColor, scoreColor, emoji, textColor) {
      const slug = makeSlug(cafe.name, cafe.suburb);
      const verdict = cafe.verdict || getVerdict(cafe.score);
      return `
        <a href="/review/${slug}" style="flex:1;text-align:center;text-decoration:none;color:inherit;">
          <div style="font-size:24px;margin-bottom:8px;">${emoji}</div>
          <div style="height:${height}px;background:${bgColor};border:1px solid ${borderColor};border-radius:8px 8px 0 0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;">
            <div style="font-family:'Bebas Neue',sans-serif;font-size:24px;color:${scoreColor};line-height:1;">${cafe.score.toFixed(1)}</div>
            <div style="font-size:8px;letter-spacing:2px;color:${scoreColor};opacity:0.7;">${verdict.toUpperCase()}</div>
          </div>
          <div style="padding:12px 8px;background:${bgColor.replace('0.25','0.08').replace('0.1','0.04')};border:1px solid ${borderColor};border-top:none;border-radius:0 0 8px 8px;">
            <div style="font-size:13px;font-weight:600;color:${textColor};margin-bottom:2px;">${cafe.name}</div>
            <div style="font-size:10px;color:rgba(255,255,255,0.35);">${cafe.suburb} · ${cafe.city}</div>
          </div>
        </a>`;
    }

    // Ranked rows #4-10
    const rankedRows = top10.slice(3).map(function(cafe, i) {
      const rank = i + 4;
      const color = getScoreColor(cafe.score);
      const slug = makeSlug(cafe.name, cafe.suburb);
      const verdict = cafe.verdict || getVerdict(cafe.score);
      return `<a href="/review/${slug}" style="display:flex;align-items:center;gap:12px;padding:14px 18px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:12px;text-decoration:none;color:inherit;position:relative;overflow:hidden;transition:border 0.2s;">
        <div style="position:absolute;left:0;top:0;bottom:0;width:3px;background:${color};border-radius:12px 0 0 12px;"></div>
        <div style="font-family:'Bebas Neue',sans-serif;font-size:20px;color:rgba(255,255,255,0.15);min-width:24px;text-align:center;margin-left:6px;">${rank}</div>
        <div style="flex:1;">
          <div style="font-weight:600;font-size:14px;color:#fff;">${cafe.name}</div>
          <div style="font-size:11px;color:rgba(255,255,255,0.35);margin-top:2px;">${cafe.suburb} · ${cafe.city}</div>
        </div>
        <div style="text-align:right;">
          <div style="font-family:'Bebas Neue',sans-serif;font-size:22px;color:${color};line-height:1;">${cafe.score.toFixed(1)}</div>
          <div style="font-size:9px;letter-spacing:1px;color:${color};opacity:0.7;">${verdict.toUpperCase()}</div>
        </div>
      </a>`;
    }).join("");

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <meta name="description" content="${desc}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${desc}" />
  <meta property="og:image" content="https://koffeereview.com.au/logo.jpg" />
  <meta property="og:url" content="${canonicalUrl}" />
  <link rel="canonical" href="${canonicalUrl}" />
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"ItemList","name":"${title}","description":"${desc}","url":"${canonicalUrl}","numberOfItems":10,"itemListElement":[${top10.map(function(c,i){return '{"@type":"ListItem","position":'+(i+1)+',"name":"'+c.name+'","url":"https://koffeereview.com.au/review/'+makeSlug(c.name,c.suburb)+'"}';}).join(",")}]}</script>
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Koffee Review","item":"https://koffeereview.com.au"},{"@type":"ListItem","position":2,"name":"Top 10 Cafés Australia","item":"${canonicalUrl}"}]}</script>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { background:#0a0a0a; color:#fff; font-family:'DM Sans',sans-serif; min-height:100vh; }
    nav { display:flex; align-items:center; justify-content:space-between; padding:16px 24px; border-bottom:1px solid rgba(255,255,255,0.06); }
    .nav-logo { display:flex; align-items:center; gap:10px; text-decoration:none; }
    .nav-logo img { width:36px; height:36px; border-radius:50%; object-fit:cover; }
    .nav-logo span { font-family:'Bebas Neue',sans-serif; font-size:16px; letter-spacing:2px; background:linear-gradient(135deg,#f5e6c8,#c8a96e); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
    .nav-back { font-size:13px; color:rgba(255,255,255,0.5); text-decoration:none; }
    .hero { max-width:680px; margin:0 auto; padding:48px 24px 32px; text-align:center; }
    .eyebrow { font-size:10px; letter-spacing:3px; color:rgba(197,157,80,0.5); margin-bottom:14px; }
    h1 { font-family:'Bebas Neue',sans-serif; font-size:clamp(36px,6vw,52px); letter-spacing:2px; background:linear-gradient(135deg,#f5e6c8,#c8a96e); -webkit-background-clip:text; -webkit-text-fill-color:transparent; margin-bottom:10px; }
    .subtitle { font-size:14px; color:rgba(255,255,255,0.35); font-style:italic; }
    .podium { display:flex; align-items:flex-end; justify-content:center; gap:10px; max-width:560px; margin:0 auto 32px; padding:0 24px; }
    .ranked { max-width:680px; margin:0 auto; padding:0 24px; display:flex; flex-direction:column; gap:8px; margin-bottom:48px; }
    .footer { border-top:1px solid rgba(255,255,255,0.1); padding:32px 24px; text-align:center; max-width:680px; margin:0 auto; }
    .footer p { font-size:14px; color:rgba(255,255,255,0.5); margin-bottom:20px; line-height:1.8; }
    .footer-quote { font-size:13px; color:rgba(255,255,255,0.3); font-style:italic; border-top:1px solid rgba(255,255,255,0.08); padding-top:20px; margin-top:4px; }
    .browse-btn { display:inline-flex; align-items:center; gap:8px; padding:13px 28px; border-radius:12px; background:linear-gradient(135deg,#c8a96e,#f5e6c8); color:#0a0a0a; font-weight:700; font-size:14px; text-decoration:none; margin-bottom:24px; }
    .browse-btn img { width:22px; height:22px; border-radius:50%; object-fit:cover; }
    .footer-links { display:flex; gap:14px; justify-content:center; flex-wrap:wrap; margin-top:20px; }
    .footer-links a { font-size:12px; color:rgba(255,255,255,0.4); text-decoration:none; }
    .footer-links a:hover { color:#c8a96e; }
  </style>
</head>
<body>
  <nav>
    <a href="https://koffeereview.com.au" class="nav-logo">
      <img src="/logo.jpg" alt="Koffee Review" />
      <span>KOFFEE REVIEW</span>
    </a>
    <a href="https://koffeereview.com.au" class="nav-back">← All Reviews</a>
  </nav>

  <div class="hero">
    <div class="eyebrow">KOFFEE REVIEW · 600+ CAFÉS · ONE SYSTEM</div>
    <h1>Australia's Top 10 Cafés</h1>
    <p class="subtitle">One latte. One espresso. One honest score.</p>
  </div>

  <div class="podium">
    ${podiumBlock(p2, 2, 58, "rgba(255,255,255,0.08)", "rgba(255,255,255,0.18)", "rgba(255,255,255,0.8)", "🥈", "rgba(255,255,255,0.8)")}
    ${podiumBlock(p1, 1, 82, "rgba(197,157,80,0.25)", "rgba(197,157,80,0.5)", "#c8a96e", "🥇", "#f5e6c8")}
    ${podiumBlock(p3, 3, 44, "rgba(251,146,60,0.1)", "rgba(251,146,60,0.3)", "rgba(251,146,60,0.8)", "🥉", "rgba(255,255,255,0.7)")}
  </div>

  <div class="ranked">
    ${rankedRows}
  </div>

  <div class="footer">
    <a href="https://koffeereview.com.au" class="browse-btn">
      <img src="/logo.jpg" alt="Koffee Review" />Browse All Reviews
    </a>
    <p>No café pays for placement. No score is negotiated.<br/>The coffee earns it or it doesn't.</p>
    <div class="footer-quote">"600+ cups in. Still chasing that perfect 10."</div>
    <div class="footer-links">
      <a href="/about">About</a>
      <a href="/how-we-score.html">How We Score</a>
      <a href="/disclosure">Disclosure</a>
      <a href="/best-coffee-brisbane">Best Coffee Brisbane</a>
      <a href="/best-coffee-gold-coast">Best Coffee Gold Coast</a>
      <a href="/brisbane-cafes-to-avoid">Cafés to Avoid</a>
    </div>
  </div>
</body>
</html>`;

    res.setHeader("Content-Type", "text/html");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.status(200).send(html);
  } catch (error) {
    res.status(500).send("Error loading leaderboard: " + error.message);
  }
}

function splitCSVLine(line) {
  const result = []; let current = ""; let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') { inQuotes = !inQuotes; }
    else if (char === "," && !inQuotes) { result.push(current.trim()); current = ""; }
    else { current += char; }
  }
  result.push(current.trim());
  return result;
}

function parseCSV(text) {
  const lines = text.trim().split("\n");
  const headers = splitCSVLine(lines[0]);
  return lines.slice(1).map(function(line) {
    const values = splitCSVLine(line);
    const obj = {};
    headers.forEach(function(h, i) { obj[h] = values[i] || ""; });
    obj.score = parseFloat(obj.score) || 0;
    return obj;
  }).filter(function(c) {
    return c.name && c.score > 0 && !SPAIN_CITIES.includes((c.city || "").toLowerCase());
  });
}

function getScoreColor(score) {
  if (score >= 9.0) return "#FFD700";
  if (score >= 8.0) return "#4ade80";
  if (score >= 7.0) return "#2dd4bf";
  if (score >= 6.0) return "#facc15";
  if (score >= 5.0) return "#fb923c";
  return "#f87171";
}

function getVerdict(score) {
  if (score >= 9.1) return "ELITE";
  if (score >= 8.1) return "GREAT";
  if (score >= 7.5) return "LOVED";
  if (score >= 7.1) return "SOLID";
  if (score >= 6.5) return "DECENT";
  if (score >= 6.1) return "TAKE OR LEAVE";
  if (score >= 5.5) return "AVERAGE";
  if (score >= 5.1) return "JUST OKAY";
  if (score >= 4.1) return "NOT FOR US";
  return "AVOID";
}

function makeSlug(name, suburb) {
  return (name + "-" + suburb).toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
}

export default async function handler(req, res) {
  try {
    const response = await fetch(SHEET_URL);
    const text = await response.text();
    const cafes = parseCSV(text);

    const top10 = cafes
      .sort(function(a, b) { return b.score - a.score; })
      .slice(0, 10);

    const title = "Top 10 Cafés in Australia | Koffee Review";
    const desc = "Australia's highest rated cafés reviewed by Koffee Review. One latte and one double shot espresso every time. No sponsorships. Just honest scores.";
    const canonicalUrl = "https://koffeereview.com.au/leaderboard";

    const rows = top10.map(function(cafe, i) {
      const rank = i + 1;
      const color = getScoreColor(cafe.score);
      const slug = makeSlug(cafe.name, cafe.suburb);
      const trophy = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : "🏆";
      const rankStyle = rank <= 3 ? `background:${color}11;border-color:${color}44;` : "";
      return `<a href="/review/${slug}" style="display:flex;align-items:center;gap:16px;padding:18px 20px;border-radius:14px;border:1px solid rgba(255,255,255,0.07);background:rgba(255,255,255,0.03);${rankStyle}text-decoration:none;color:inherit;margin-bottom:10px;transition:border 0.2s;">
        <div style="font-family:'Bebas Neue',sans-serif;font-size:28px;color:rgba(255,255,255,0.15);min-width:32px;text-align:center;">${rank}</div>
        <div style="font-size:18px;min-width:24px;">${trophy}</div>
        <div style="flex:1;">
          <div style="font-weight:600;font-size:16px;color:#fff;margin-bottom:3px;">${cafe.name}</div>
          <div style="font-size:12px;color:rgba(255,255,255,0.4);">${cafe.suburb} · ${cafe.city}</div>
        </div>
        <div style="text-align:right;">
          <div style="font-family:'Bebas Neue',sans-serif;font-size:28px;color:${color};line-height:1;">${cafe.score.toFixed(1)}</div>
          <div style="font-size:10px;font-weight:700;letter-spacing:2px;color:${color};margin-top:2px;">${getVerdict(cafe.score)}</div>
        </div>
      </a>`;
    }).join("");

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <meta name="description" content="${desc}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${desc}" />
  <meta property="og:image" content="https://koffeereview.com.au/logo.jpg" />
  <meta property="og:url" content="${canonicalUrl}" />
  <link rel="canonical" href="${canonicalUrl}" />
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"ItemList","name":"${title}","description":"${desc}","url":"${canonicalUrl}","numberOfItems":10,"itemListElement":[${top10.map(function(c, i) { return '{"@type":"ListItem","position":' + (i+1) + ',"name":"' + c.name + '","url":"https://koffeereview.com.au/review/' + makeSlug(c.name, c.suburb) + '"}'; }).join(",")}]}</script>
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Koffee Review","item":"https://koffeereview.com.au"},{"@type":"ListItem","position":2,"name":"Top 10 Cafés Australia","item":"${canonicalUrl}"}]}</script>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { background:#0a0a0a; color:#fff; font-family:'DM Sans',sans-serif; min-height:100vh; }
    nav { display:flex; align-items:center; justify-content:space-between; padding:16px 24px; border-bottom:1px solid rgba(255,255,255,0.06); }
    .nav-logo { display:flex; align-items:center; gap:10px; text-decoration:none; }
    .nav-logo img { width:36px; height:36px; border-radius:50%; object-fit:cover; }
    .nav-logo span { font-family:'Bebas Neue',sans-serif; font-size:16px; letter-spacing:2px; background:linear-gradient(135deg,#f5e6c8,#c8a96e); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
    .nav-back { font-size:13px; color:rgba(255,255,255,0.5); text-decoration:none; }
    .nav-back:hover { color:#c8a96e; }
    .hero { max-width:760px; margin:0 auto; padding:48px 24px 32px; text-align:center; }
    .hero-tag { display:inline-block; padding:4px 14px; border-radius:20px; font-size:11px; font-weight:700; letter-spacing:2px; background:rgba(255,215,0,0.1); color:#FFD700; border:1px solid rgba(255,215,0,0.3); margin-bottom:16px; }
    .hero h1 { font-family:'Bebas Neue',sans-serif; font-size:clamp(32px,6vw,52px); letter-spacing:2px; line-height:1.1; background:linear-gradient(135deg,#f5e6c8,#c8a96e); -webkit-background-clip:text; -webkit-text-fill-color:transparent; margin-bottom:12px; }
    .hero p { font-size:15px; color:rgba(255,255,255,0.5); line-height:1.9; max-width:520px; margin:0 auto; }
    .content { max-width:760px; margin:0 auto; padding:0 24px 80px; }
    .section-title { font-family:'Bebas Neue',sans-serif; font-size:13px; letter-spacing:3px; color:rgba(197,157,80,0.6); margin-bottom:20px; text-align:center; }
    .footer { border-top:1px solid rgba(255,255,255,0.06); padding:32px 24px; text-align:center; max-width:760px; margin:0 auto; }
    .footer p { font-size:13px; color:rgba(255,255,255,0.3); margin-bottom:16px; line-height:1.7; }
    .browse-btn { display:inline-flex; align-items:center; gap:8px; padding:13px 28px; border-radius:12px; background:linear-gradient(135deg,#c8a96e,#f5e6c8); color:#0a0a0a; font-weight:700; font-size:14px; text-decoration:none; }
    .browse-btn img { width:22px; height:22px; border-radius:50%; object-fit:cover; }
    .footer-links { display:flex; gap:14px; justify-content:center; flex-wrap:wrap; margin-top:20px; }
    .footer-links a { font-size:12px; color:rgba(255,255,255,0.4); text-decoration:none; }
    .footer-links a:hover { color:#c8a96e; }
  </style>
</head>
<body>
  <nav>
    <a href="https://koffeereview.com.au" class="nav-logo">
      <img src="/logo.jpg" alt="Koffee Review" />
      <span>KOFFEE REVIEW</span>
    </a>
    <a href="https://koffeereview.com.au" class="nav-back">← All Reviews</a>
  </nav>

  <div class="hero">
    <div class="hero-tag">🏆 THE DEFINITIVE RANKING</div>
    <h1>Australia's Top 10 Cafés</h1>
    <p>Every café reviewed with the same two drinks. One latte. One double shot espresso. One score out of 10. These are the ones that earned it.</p>
  </div>

  <div class="content">
    <div class="section-title">KOFFEE REVIEW · 600+ CAFÉS · ONE SYSTEM</div>
    ${rows}
  </div>

  <div class="footer">
    <p>Scores based on one latte and one double shot espresso, ordered the same way every time.<br/>
    No café pays for placement. No score is negotiated. The coffee earns it or it does not.<br/><br/>
    <em style="color:rgba(255,255,255,0.2);">"600+ cups in. Still chasing that perfect 10."</em></p>
    <a href="/best-coffee-brisbane.html" style="display:inline-block;margin-bottom:16px;font-size:13px;color:#c8a96e;text-decoration:none;">Looking for the best coffee in Brisbane? See our full Brisbane guide →</a><br/>
    <a href="https://koffeereview.com.au" class="browse-btn">
      <img src="/logo.jpg" alt="Koffee Review" />Browse All Café Reviews
    </a>
    <div class="footer-links">
      <a href="/about">About</a>
      <a href="/how-we-score.html">How We Score</a>
      <a href="/disclosure">Disclosure</a>
      <a href="/privacy">Privacy</a>
      <a href="/best-coffee-brisbane.html">Best Coffee Brisbane</a>
      <a href="/best-coffee-gold-coast.html">Best Coffee Gold Coast</a>
      <a href="/brisbane-cafes-to-avoid">Cafés to Avoid</a>
    </div>
  </div>
</body>
</html>`;

    res.setHeader("Content-Type", "text/html");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.status(200).send(html);
  } catch (error) {
    res.status(500).send("Error loading leaderboard");
  }
}
