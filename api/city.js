const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYEU8Khk3R5I879v3FcXPqhq0aCXa2ZWM1BwwJOyUitx2Boak_AFTOkwvB8qQrKIeU55NM4htFjHbI/pub?gid=0&single=true&output=csv";

const SPAIN_CITIES = ["barcelona", "catalonia", "spain"];

const CITY_CONFIG = {
  "brisbane": { name: "Brisbane", slug: "brisbane", stateShort: "QLD" },
  "gold-coast": { name: "Gold Coast", slug: "gold-coast", stateShort: "QLD" },
  "moreton-bay": { name: "Moreton Bay", slug: "moreton-bay", stateShort: "QLD" },
  "sunshine-coast": { name: "Sunshine Coast", slug: "sunshine-coast", stateShort: "QLD" },
  "ipswich": { name: "Ipswich", slug: "ipswich", stateShort: "QLD" },
  "melbourne": { name: "Melbourne", slug: "melbourne", stateShort: "VIC" },
  "sydney": { name: "Sydney", slug: "sydney", stateShort: "NSW" },
  "logan": { name: "Logan", slug: "logan", stateShort: "QLD" },
};

function makeSlug(name, suburb) {
  return (name + "-" + suburb).toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
}

function makeCitySlug(city) {
  return city.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
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
    obj.lat = parseFloat(obj.lat) || 0;
    obj.lng = parseFloat(obj.lng) || 0;
    return obj;
  }).filter(function(c) { return c.name && c.score > 0 && !SPAIN_CITIES.includes((c.city || "").toLowerCase()); });
}

function getScoreColor(score) {
  if (score >= 9.0) return "#FFD700";
  if (score >= 8.0) return "#4ade80";
  if (score >= 7.0) return "#2dd4bf";
  if (score >= 6.0) return "#facc15";
  if (score >= 5.0) return "#fb923c";
  return "#f87171";
}

function getMapsUrl(cafe) {
  return "https://www.google.com/maps/search/" + encodeURIComponent(cafe.name + " " + cafe.suburb + " " + cafe.city);
}

function renderCityPage(citySlug, cafes, allCafes) {
  const config = CITY_CONFIG[citySlug];
  if (!config) return null;

  const cityCafes = cafes.filter(function(c) {
    return makeCitySlug(c.city) === citySlug;
  }).sort(function(a, b) { return b.score - a.score; });

  if (cityCafes.length === 0) return null;

  const mustVisit = cityCafes.filter(function(c) { return c.score >= 7.5; }).length;
  const avg = (cityCafes.reduce(function(s, c) { return s + c.score; }, 0) / cityCafes.length).toFixed(1);
  const suburbs = [...new Set(cityCafes.map(function(c) { return c.suburb; }))].length;

  const title = "Best Coffee in " + config.name + " 2026 | Koffee Review";
  const desc = config.name + "'s best cafés reviewed and scored by Koffee Review. " + cityCafes.length + "+ cafés rated. One latte and one double shot espresso every time. Know before you go.";
  const canonicalUrl = "https://koffeereview.com.au/city/" + citySlug;

  const cafeRows = cityCafes.map(function(cafe, i) {
    const color = getScoreColor(cafe.score);
    const slug = makeSlug(cafe.name, cafe.suburb);
    return `<a href="/review/${slug}" style="display:flex;align-items:center;gap:16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:16px 20px;margin-bottom:8px;text-decoration:none;color:inherit;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:24px;color:${color};min-width:48px;text-align:center;">${cafe.score.toFixed(1)}</div>
      <div style="flex:1;">
        <div style="font-weight:600;font-size:15px;color:#fff;">${cafe.name}</div>
        <div style="font-size:12px;color:rgba(255,255,255,0.4);margin-top:2px;">${cafe.suburb} · ${cafe.price || ""}</div>
      </div>
      <div style="padding:4px 12px;border-radius:20px;background:${color}22;color:${color};border:1px solid ${color}55;font-size:10px;font-weight:700;letter-spacing:2px;">${(cafe.verdict || "").toUpperCase()}</div>
    </a>`;
  }).join("");

  return `<!DOCTYPE html>
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
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"WebPage","name":"${title}","description":"${desc}","url":"${canonicalUrl}","publisher":{"@type":"Organization","name":"Koffee Review","url":"https://koffeereview.com.au"}}</script>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { background:#0a0a0a; color:#fff; font-family:'DM Sans',sans-serif; min-height:100vh; }
    nav { display:flex; align-items:center; justify-content:space-between; padding:16px 24px; border-bottom:1px solid rgba(255,255,255,0.06); }
    .nav-logo { display:flex; align-items:center; gap:10px; text-decoration:none; }
    .nav-logo img { width:36px; height:36px; border-radius:50%; object-fit:cover; }
    .nav-logo span { font-family:'Bebas Neue',sans-serif; font-size:16px; letter-spacing:2px; background:linear-gradient(135deg,#f5e6c8,#c8a96e); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
    .nav-back { font-size:13px; color:rgba(255,255,255,0.5); text-decoration:none; }
    .hero { max-width:800px; margin:0 auto; padding:40px 24px 24px; }
    .hero-tag { display:inline-block; padding:4px 14px; border-radius:20px; font-size:11px; font-weight:700; letter-spacing:2px; background:rgba(197,157,80,0.1); color:#c8a96e; border:1px solid rgba(197,157,80,0.3); margin-bottom:16px; }
    h1 { font-family:'Bebas Neue',sans-serif; font-size:clamp(32px,6vw,52px); letter-spacing:2px; line-height:1.1; background:linear-gradient(135deg,#f5e6c8,#c8a96e); -webkit-background-clip:text; -webkit-text-fill-color:transparent; margin-bottom:12px; }
    .hero p { font-size:15px; color:rgba(255,255,255,0.6); line-height:1.8; max-width:600px; }
    .stats { display:flex; gap:12px; padding:0 24px 24px; max-width:800px; margin:0 auto; flex-wrap:wrap; }
    .stat { background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:12px 16px; flex:1; min-width:100px; }
    .stat-num { font-family:'Bebas Neue',sans-serif; font-size:26px; color:#c8a96e; line-height:1; }
    .stat-label { font-size:11px; color:rgba(255,255,255,0.4); margin-top:2px; }
    .content { max-width:800px; margin:0 auto; padding:0 24px 80px; }
    .section-title { font-family:'Bebas Neue',sans-serif; font-size:18px; letter-spacing:2px; color:rgba(197,157,80,0.8); margin-bottom:16px; }
    .footer { border-top:1px solid rgba(255,255,255,0.06); padding:32px 24px; text-align:center; max-width:800px; margin:0 auto; }
    .footer p { font-size:13px; color:rgba(255,255,255,0.3); margin-bottom:16px; line-height:1.7; }
    .browse-btn { display:inline-flex; align-items:center; gap:8px; padding:13px 28px; border-radius:12px; background:linear-gradient(135deg,#c8a96e,#f5e6c8); color:#0a0a0a; font-weight:700; font-size:14px; text-decoration:none; }
    .browse-btn img { width:22px; height:22px; border-radius:50%; object-fit:cover; }
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
    <div class="hero-tag">${config.stateShort} · CITY GUIDE</div>
    <h1>Best Coffee in ${config.name}</h1>
    <p>Every café reviewed with the same two drinks — one latte and one double shot espresso. No sponsorships, no agendas. Just honest scores from ${cityCafes.length}+ ${config.name} cafés.</p>
  </div>

  <div class="stats">
    <div class="stat"><div class="stat-num">${cityCafes.length}</div><div class="stat-label">Cafés Reviewed</div></div>
    <div class="stat"><div class="stat-num">${mustVisit}</div><div class="stat-label">Must Visit (7.5+)</div></div>
    <div class="stat"><div class="stat-num">${avg}</div><div class="stat-label">Avg Score</div></div>
    <div class="stat"><div class="stat-num">${suburbs}</div><div class="stat-label">Suburbs</div></div>
  </div>

  <div class="content">
    <div class="section-title">ALL ${config.name.toUpperCase()} CAFÉS</div>
    ${cafeRows}
  </div>

  <div class="footer">
    <p>All scores based on one latte and one double shot espresso, ordered the same way every time.<br/>
    No café pays for placement. <a href="/how-we-score.html" style="color:#c8a96e;">Read how we score →</a></p>
    <a href="https://koffeereview.com.au" class="browse-btn">
      <img src="/logo.jpg" alt="Koffee Review" />Browse All Reviews
    </a>
  </div>
</body>
</html>`;
}

export default async function handler(req, res) {
  try {
    const citySlug = req.query.city;
    if (!citySlug || !CITY_CONFIG[citySlug]) {
      res.status(404).send("City not found");
      return;
    }
    const response = await fetch(SHEET_URL);
    const text = await response.text();
    const cafes = parseCSV(text);
    const html = renderCityPage(citySlug, cafes, cafes);
    if (!html) { res.status(404).send("No cafés found for this city"); return; }
    res.setHeader("Content-Type", "text/html");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.status(200).send(html);
  } catch (error) {
    res.status(500).send("Error loading city page");
  }
}
