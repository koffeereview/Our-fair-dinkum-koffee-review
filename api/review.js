const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYEU8Khk3R5I879v3FcXPqhq0aCXa2ZWM1BwwJOyUitx2Boak_AFTOkwvB8qQrKIeU55NM4htFjHbI/pub?gid=0&single=true&output=csv";
const SPAIN_CITIES = ["barcelona", "catalonia", "spain"];

function makeSlug(name, suburb) {
  return (name + "-" + suburb)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function splitCSVLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;
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
  }).filter(function(c) { return c.name && c.score > 0; });
}

function getScoreColor(score) {
  if (score >= 9.0) return "#ffffff";
  if (score >= 8.0) return "#4ade80";
  if (score >= 7.0) return "#2dd4bf";
  if (score >= 6.0) return "#facc15";
  if (score >= 5.0) return "#fb923c";
  return "#f87171";
}

function getScoreLabel(score) {
  if (score >= 9.1) return "Elite / Anytime Coffee";
  if (score >= 8.1) return "Great Coffee";
  if (score >= 7.5) return "Loved";
  if (score >= 7.1) return "Solid";
  if (score >= 6.5) return "Decent";
  if (score >= 6.1) return "Take or Leave";
  if (score >= 5.5) return "Average";
  if (score >= 5.1) return "Just Okay";
  if (score >= 4.1) return "Not For Us";
  return "Avoid";
}

function getMapsUrl(cafe) {
  return "https://www.google.com/maps/search/" + encodeURIComponent(cafe.name + " " + cafe.suburb + " " + cafe.city);
}

function renderHTML(cafe, allCafes) {
  const color = getScoreColor(cafe.score);
  const verdict = cafe.verdict || getScoreLabel(cafe.score);
  const slug = makeSlug(cafe.name, cafe.suburb);
  const title = cafe.name + " Coffee Review (" + cafe.score + "/10) — " + cafe.suburb + " | Koffee Review";
  const desc = "Honest coffee review of " + cafe.name + " in " + cafe.suburb + ", " + cafe.city + ". Rated " + cafe.score + "/10 by Koffee Review. " + (cafe.notes ? cafe.notes.substring(0, 120) + "..." : "");
  const canonicalUrl = "https://koffeereview.com.au/review/" + slug;
  const circumference = 276;
  const offset = circumference - (cafe.score / 10) * circumference;
  const citySlugMap = { "brisbane": "brisbane", "gold coast": "gold-coast", "moreton bay": "moreton-bay", "sunshine coast": "sunshine-coast", "ipswich": "ipswich", "melbourne": "melbourne", "sydney": "sydney", "logan": "logan", "redland": "redland" };
  const suburbSlugMap = { "cbd": "cbd-brisbane", "newstead": "newstead-brisbane", "chermside": "chermside-brisbane", "fortitude valley": "fortitude-valley-brisbane", "west end": "west-end-brisbane", "south brisbane": "south-brisbane-brisbane", "paddington": "paddington-brisbane", "hamilton": "hamilton-brisbane", "woolloongabba": "woolloongabba-brisbane", "upper mount gravatt": "upper-mount-gravatt-brisbane", "burleigh heads": "burleigh-heads-gold-coast" };

  // Calculate top 10 dynamically from sheet — Australian cafes only
  const top10Slugs = allCafes
    .filter(function(c) { return !SPAIN_CITIES.includes((c.city || "").toLowerCase()); })
    .sort(function(a, b) { return b.score - a.score; })
    .slice(0, 10)
    .map(function(c) { return makeSlug(c.name, c.suburb); });
  const isTop10 = top10Slugs.includes(slug);
  const citySlug = citySlugMap[(cafe.city || "").toLowerCase()];
  const suburbSlug = suburbSlugMap[(cafe.suburb || "").toLowerCase()];
  const brisbaneLink = cafe.city.toLowerCase().includes("brisbane") ? '<a class="internal-link" href="/best-coffee-brisbane">Best Coffee in Brisbane <span>→</span></a>' : "";
  const suburbLink = suburbSlug ? `<a class="internal-link" href="/suburb/${suburbSlug}">Best Coffee in ${cafe.suburb} <span>→</span></a>` : "";
  const cityLink = citySlug ? `<a class="internal-link" href="/city/${citySlug}">All ${cafe.city} Cafés <span>→</span></a>` : "";

  // Better Picks Nearby — only for cafes scoring below 7.5
  function getDistKm(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  }

  let betterPicksHTML = "";
  if (cafe.score < 7.5 && cafe.lat && cafe.lng && Math.abs(cafe.lat) > 1) {
    const higherScored = allCafes
      .filter(function(c) {
        return c.name !== cafe.name &&
               c.score > cafe.score &&
               c.score >= 6.0 &&
               !SPAIN_CITIES.includes((c.city || "").toLowerCase()) &&
               c.lat && c.lng && Math.abs(c.lat) > 1;
      })
      .map(function(c) {
        c._dist = getDistKm(cafe.lat, cafe.lng, c.lat, c.lng);
        return c;
      });

    // Same suburb first, then nearest
    const sameSuburb = higherScored
      .filter(function(c) { return c.suburb.toLowerCase() === cafe.suburb.toLowerCase(); })
      .sort(function(a, b) { return b.score - a.score; })
      .slice(0, 3);

    const needed = 3 - sameSuburb.length;
    const sameSuburbNames = sameSuburb.map(function(c) { return c.name; });
    const nearby = higherScored
      .filter(function(c) { return !sameSuburbNames.includes(c.name); })
      .sort(function(a, b) { return a._dist - b._dist; })
      .slice(0, 3 - sameSuburb.length);

    const picks = [...sameSuburb, ...nearby].slice(0, 3);

    if (picks.length > 0) {
      const pickCards = picks.map(function(c) {
        const col = getScoreColor(c.score);
        const s = makeSlug(c.name, c.suburb);
        const distText = c._dist < 1 ? (c._dist * 1000).toFixed(0) + "m away" : c._dist.toFixed(1) + "km away";
        return `<a href="/review/${s}" class="better-pick-card">
          <div class="better-pick-score" style="color:${col};">${c.score.toFixed(1)}</div>
          <div class="better-pick-info">
            <div class="better-pick-name">${c.name}</div>
            <div class="better-pick-sub">${c.suburb}</div>
            <div class="better-pick-dist">📍 ${distText}</div>
          </div>
          <div class="better-pick-arrow">→</div>
        </a>`;
      }).join("");

      betterPicksHTML = `
      <div class="better-picks">
        <div class="better-picks-title">BETTER PICKS NEARBY</div>
        <div class="better-picks-sub">This café scored ${cafe.score.toFixed(1)}. These reviewed cafés scored higher and are close by.</div>
        ${pickCards}
      </div>
      <hr class="divider" />`;
    }
  }

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
  <meta property="og:type" content="article" />
  <link rel="canonical" href="${canonicalUrl}" />
  <script type="application/ld+json">
  [
    {
      "@context": "https://schema.org",
      "@type": "Review",
      "name": "${cafe.name} Coffee Review",
      "author": {
        "@type": "Organization",
        "name": "Our Fair Dinkum Koffee Review",
        "url": "https://koffeereview.com.au",
        "logo": "https://koffeereview.com.au/logo.jpg"
      },
      "itemReviewed": {
        "@type": "CafeOrCoffeeShop",
        "name": "${cafe.name}",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "${cafe.suburb}",
          "addressLocality": "${cafe.suburb}",
          "addressRegion": "${cafe.city}",
          "addressCountry": "AU"
        }${cafe.lat && cafe.lng && Math.abs(cafe.lat) > 1 ? `,
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "${cafe.lat}",
          "longitude": "${cafe.lng}"
        }` : ""}
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "${cafe.score}",
        "bestRating": "10",
        "worstRating": "0"
      },
      "reviewBody": "${(cafe.notes || "").replace(/"/g, "'")}",
      "url": "${canonicalUrl}"
    },
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "${cafe.name}",
      "@id": "${canonicalUrl}",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "${cafe.suburb}",
        "addressRegion": "${cafe.city}",
        "addressCountry": "AU"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "${cafe.score}",
        "bestRating": "10",
        "worstRating": "0",
        "reviewCount": "1"
      },
      "servesCuisine": "Coffee"${cafe.lat && cafe.lng && Math.abs(cafe.lat) > 1 ? `,
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "${cafe.lat}",
        "longitude": "${cafe.lng}"
      }` : ""}
    }
  ]
  </script>
  <script type="application/ld+json">{
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Koffee Review", "item": "https://koffeereview.com.au" },
      { "@type": "ListItem", "position": 2, "name": "Best Coffee ${cafe.city}", "item": "https://koffeereview.com.au/city/${citySlug || cafe.city.toLowerCase().replace(/\\s+/g, '-')}" },
      { "@type": "ListItem", "position": 3, "name": "${cafe.name}", "item": "${canonicalUrl}" }
    ]
  }</script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css" />
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #0a0a0a; color: #fff; font-family: 'DM Sans', sans-serif; min-height: 100vh; }
    nav { display: flex; align-items: center; justify-content: space-between; padding: 16px 24px; border-bottom: 1px solid rgba(255,255,255,0.06); }
    .nav-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
    .nav-logo img { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; }
    .nav-logo span { font-family: 'Bebas Neue', sans-serif; font-size: 16px; letter-spacing: 2px; background: linear-gradient(135deg, #f5e6c8, #c8a96e); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .nav-back { font-size: 13px; color: rgba(255,255,255,0.5); text-decoration: none; }
    .hero { max-width: 720px; margin: 0 auto; padding: 40px 24px 24px; }
    .hero-tag { display: inline-block; padding: 4px 14px; border-radius: 20px; font-size: 11px; font-weight: 700; letter-spacing: 2px; background: rgba(197,157,80,0.1); color: #c8a96e; border: 1px solid rgba(197,157,80,0.3); margin-bottom: 16px; }
    h1 { font-family: 'Bebas Neue', sans-serif; font-size: clamp(28px, 5vw, 48px); letter-spacing: 2px; line-height: 1.1; color: #f5e6c8; margin-bottom: 8px; }
    .hero-location { font-size: 14px; color: rgba(255,255,255,0.4); letter-spacing: 1px; }
    .score-section { max-width: 720px; margin: 0 auto; padding: 24px; }
    .score-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 28px; display: flex; align-items: center; gap: 28px; flex-wrap: wrap; }
    .score-ring-wrap { position: relative; width: 110px; height: 110px; flex-shrink: 0; }
    .score-ring-wrap svg { transform: rotate(-90deg); }
    .score-ring-inner { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
    .score-number { font-family: 'Bebas Neue', sans-serif; font-size: 32px; line-height: 1; color: ${color}; }
    .score-denom { font-size: 11px; color: rgba(255,255,255,0.3); }
    .score-details { flex: 1; }
    .verdict-badge { display: inline-block; padding: 6px 18px; border-radius: 20px; font-size: 12px; font-weight: 700; letter-spacing: 2px; margin-bottom: 12px; background: ${color}22; color: ${color}; border: 1px solid ${color}55; }
    .score-bar-wrap { display: flex; align-items: center; gap: 10px; margin-top: 8px; }
    .score-bar { flex: 1; height: 5px; border-radius: 5px; background: rgba(255,255,255,0.08); overflow: hidden; }
    .score-bar-fill { height: 100%; border-radius: 5px; width: ${cafe.score * 10}%; background: ${color}; }
    .method-note { font-size: 12px; color: rgba(255,255,255,0.3); margin-top: 12px; font-style: italic; }
    .content { max-width: 720px; margin: 0 auto; padding: 0 24px; }
    .section { margin-bottom: 28px; }
    .section h2 { font-family: 'Bebas Neue', sans-serif; font-size: 18px; letter-spacing: 2px; color: rgba(197,157,80,0.8); margin-bottom: 12px; }
    .notes-box { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 20px; font-size: 15px; color: rgba(255,255,255,0.7); line-height: 1.8; font-style: italic; }
    .action-btns { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 28px; }
    .btn { flex: 1; min-width: 100px; padding: 12px; border-radius: 12px; font-size: 13px; font-weight: 600; text-align: center; text-decoration: none; cursor: pointer; border: none; font-family: 'DM Sans', sans-serif; }
    .btn-maps { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: #fff; }
    .btn-review { background: rgba(197,157,80,0.15); border: 1px solid rgba(197,157,80,0.3); color: #c8a96e; }
    .btn-share { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: #fff; cursor: pointer; }
    #map { height: 280px; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.08); margin-bottom: 28px; }
    .divider { border: none; border-top: 1px solid rgba(255,255,255,0.06); margin: 28px 0; }
    .internal-links { display: flex; flex-direction: column; gap: 10px; margin-bottom: 40px; }
    .internal-link { display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.07); background: rgba(255,255,255,0.03); text-decoration: none; color: rgba(255,255,255,0.6); font-size: 13px; }
    .internal-link span { color: rgba(255,255,255,0.2); }
    .better-picks { margin-bottom: 28px; }
    .better-picks-title { font-family: 'Bebas Neue', sans-serif; font-size: 16px; letter-spacing: 2px; color: rgba(197,157,80,0.8); margin-bottom: 6px; }
    .better-picks-sub { font-size: 12px; color: rgba(255,255,255,0.3); margin-bottom: 14px; }
    .better-pick-card { display: flex; align-items: center; gap: 14px; padding: 14px 18px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.07); background: rgba(255,255,255,0.03); text-decoration: none; color: inherit; margin-bottom: 8px; transition: border 0.2s; }
    .better-pick-card:hover { border-color: rgba(197,157,80,0.3); }
    .better-pick-score { font-family: 'Bebas Neue', sans-serif; font-size: 22px; min-width: 44px; text-align: center; line-height: 1; }
    .better-pick-info { flex: 1; }
    .better-pick-name { font-weight: 600; font-size: 14px; color: #fff; }
    .better-pick-sub { font-size: 12px; color: rgba(255,255,255,0.4); margin-top: 2px; }
    .better-pick-dist { font-size: 11px; color: rgba(197,157,80,0.6); margin-top: 2px; }
    .better-pick-arrow { font-size: 14px; color: rgba(255,255,255,0.2); }
    #share-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.92); z-index: 400; flex-direction: column; align-items: center; justify-content: center; padding: 24px; }
    #share-overlay.visible { display: flex; }
    #share-overlay img { max-width: min(320px, 90vw); border-radius: 24px; }
    .share-overlay-btns { display: flex; gap: 10px; margin-top: 24px; }
    .share-overlay-btn { padding: 11px 20px; border-radius: 12px; font-size: 13px; cursor: pointer; font-family: 'DM Sans', sans-serif; font-weight: 600; border: none; }
  </style>
</head>
<body>

  <nav>
    <a href="https://koffeereview.com.au" class="nav-logo">
      <img src="/logo.jpg" alt="Koffee Review" />
      <span>KOFFEE REVIEW</span>
    </a>
    <a href="https://koffeereview.com.au" class="nav-back" id="nav-back">← Back</a>
  </nav>

  <div class="hero">
    <div class="hero-tag">${cafe.city.toUpperCase()} · CAFÉ REVIEW</div>
    ${isTop10 ? `<div style="display:inline-flex;align-items:center;gap:6px;background:rgba(255,215,0,0.1);border:1px solid rgba(255,215,0,0.3);border-radius:20px;padding:4px 14px;font-size:11px;font-weight:700;letter-spacing:2px;color:#FFD700;margin-bottom:10px;">🏆 AUSTRALIA TOP 10</div>` : ""}
    <h1>${cafe.name} — ${cafe.suburb}</h1>
    <div class="hero-location">${cafe.suburb}, ${cafe.city}${cafe.price ? " · " + cafe.price : ""}</div>
  </div>

  <div class="score-section">
    <div class="score-card">
      <div class="score-ring-wrap">
        <svg width="110" height="110">
          <circle cx="55" cy="55" r="44" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="7"/>
          <circle id="score-ring" cx="55" cy="55" r="44" fill="none" stroke="${color}" stroke-width="7" stroke-dasharray="${circumference}" stroke-dashoffset="${circumference}" stroke-linecap="round"/>
        </svg>
        <div class="score-ring-inner">
          <span class="score-number">${cafe.score}</span>
          <span class="score-denom">/10</span>
        </div>
      </div>
      <div class="score-details">
        <div class="verdict-badge">${verdict.toUpperCase()}</div>
        <div style="font-size:13px; color:rgba(255,255,255,0.5); margin-bottom:8px;">${getScoreLabel(cafe.score)}</div>
        <div class="score-bar-wrap">
          <div class="score-bar"><div class="score-bar-fill"></div></div>
        </div>
        <div class="method-note">One Latte · One Double Shot Espresso · Every time</div>
      </div>
    </div>
  </div>

  <div class="content">
    <div class="section">
      <h2>OUR NOTES</h2>
      <div class="notes-box">${cafe.notes || "No notes available."}</div>
    </div>

    <div class="action-btns">
      <a class="btn btn-maps" href="${getMapsUrl(cafe)}" target="_blank">📍 Maps</a>
      ${cafe.link ? `<a class="btn btn-review" href="${cafe.link}" target="_blank">▶ Our Review</a>` : ""}
      <button class="btn btn-share" onclick="generateShareCard()">Share Card</button>
    </div>

    <div class="section">
      <h2>FIND US</h2>
      ${(cafe.lat && cafe.lng && Math.abs(cafe.lat) > 1 && Math.abs(cafe.lng) > 1) ? `<div id="map"></div>` : `<a href="${getMapsUrl(cafe)}" target="_blank" style="display:flex;align-items:center;justify-content:center;height:120px;border-radius:16px;border:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.03);color:#c8a96e;text-decoration:none;font-size:14px;font-weight:600;">📍 Open in Google Maps →</a>`}
    </div>

    <hr class="divider" />

    <!-- Recently Viewed -->
    <div id="recently-viewed" style="display:none;margin-bottom:28px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:16px;letter-spacing:2px;color:rgba(197,157,80,0.8);margin-bottom:12px;">RECENTLY VIEWED</div>
      <div id="recently-viewed-cards" style="display:flex;gap:8px;flex-wrap:wrap;"></div>
    </div>

    ${betterPicksHTML}

    <div class="internal-links">
      ${suburbLink}
      ${brisbaneLink}
      ${cityLink}
      <a class="internal-link" href="/leaderboard">Australia's Top 10 Cafés <span>→</span></a>
      <a class="internal-link" href="https://koffeereview.com.au">Browse All Reviews <span>→</span></a>
    </div>
  </div>

  <div id="share-overlay">
    <div style="font-size:12px; color:rgba(255,255,255,0.4); margin-bottom:16px; letter-spacing:1px;">YOUR SCORE CARD</div>
    <img id="share-card-img" src="" alt="Score Card" />
    <div class="share-overlay-btns">
      <button class="share-overlay-btn" onclick="saveCard()" style="background:rgba(197,157,80,0.15);border:1px solid rgba(197,157,80,0.3);color:#c8a96e;">↓ Save</button>
      <button class="share-overlay-btn" onclick="shareCard()" style="background:rgba(197,157,80,0.15);border:1px solid rgba(197,157,80,0.3);color:#c8a96e;">↑ Share</button>
      <button class="share-overlay-btn" onclick="document.getElementById('share-overlay').classList.remove('visible')" style="background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);color:rgba(255,255,255,0.6);">Close</button>
    </div>
  </div>

  ${(cafe.lat && cafe.lng && Math.abs(cafe.lat) > 1 && Math.abs(cafe.lng) > 1) ? `<script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"></script>` : ""}
  <script>
    const cafe = ${JSON.stringify({ name: cafe.name, suburb: cafe.suburb, city: cafe.city, score: cafe.score, verdict: cafe.verdict, lat: cafe.lat, lng: cafe.lng, link: cafe.link })};
    let shareCardDataUrl = null;

    // Smart back button
    const backBtn = document.getElementById("nav-back");
    if (document.referrer && document.referrer.includes("koffeereview.com.au")) {
      backBtn.href = document.referrer;
      const ref = document.referrer;
      if (ref.includes("/city/brisbane")) backBtn.textContent = "← Brisbane";
      else if (ref.includes("/city/gold-coast")) backBtn.textContent = "← Gold Coast";
      else if (ref.includes("/city/moreton-bay")) backBtn.textContent = "← Moreton Bay";
      else if (ref.includes("/city/sunshine-coast")) backBtn.textContent = "← Sunshine Coast";
      else if (ref.includes("/city/ipswich")) backBtn.textContent = "← Ipswich";
      else if (ref.includes("/city/melbourne")) backBtn.textContent = "← Melbourne";
      else if (ref.includes("/city/sydney")) backBtn.textContent = "← Sydney";
      else if (ref.includes("/suburb/")) backBtn.textContent = "← " + "${cafe.suburb}";
      else if (ref.includes("/best-coffee-brisbane")) backBtn.textContent = "← Brisbane Guide";
      else if (ref.includes("/brisbane-cafes-to-avoid")) backBtn.textContent = "← Cafés to Avoid";
      else if (ref.includes("/leaderboard")) backBtn.textContent = "← Leaderboard";
      else backBtn.textContent = "← Back";
    }

    // Recently Viewed — save current cafe to localStorage
    try {
      const current = {
        name: "${cafe.name}",
        suburb: "${cafe.suburb}",
        score: ${cafe.score},
        slug: "${slug}",
        color: "${color}"
      };
      let viewed = JSON.parse(localStorage.getItem("kr_viewed") || "[]");
      viewed = viewed.filter(function(c) { return c.slug !== current.slug; });
      viewed.unshift(current);
      viewed = viewed.slice(0, 6);
      localStorage.setItem("kr_viewed", JSON.stringify(viewed));

      // Show recently viewed (excluding current)
      const others = viewed.filter(function(c) { return c.slug !== current.slug; }).slice(0, 3);
      if (others.length > 0) {
        const container = document.getElementById("recently-viewed");
        if (container) {
          container.style.display = "block";
          document.getElementById("recently-viewed-cards").innerHTML = others.map(function(c) {
            return '<a href="/review/' + c.slug + '" style="display:flex;align-items:center;gap:12px;padding:12px 16px;border-radius:12px;border:1px solid rgba(255,255,255,0.07);background:rgba(255,255,255,0.03);text-decoration:none;color:inherit;flex:1;min-width:140px;">' +
              '<span style="font-family:Bebas Neue,sans-serif;font-size:20px;color:' + c.color + ';min-width:40px;">' + c.score.toFixed(1) + '</span>' +
              '<div><div style="font-size:13px;font-weight:600;color:#fff;">' + c.name + '</div>' +
              '<div style="font-size:11px;color:rgba(255,255,255,0.4);">' + c.suburb + '</div></div>' +
              '</a>';
          }).join("");
        }
      }
    } catch(e) {}

    ${(cafe.lat && cafe.lng && Math.abs(cafe.lat) > 1 && Math.abs(cafe.lng) > 1) ? `
    // SCORE RING ANIMATION
    document.addEventListener("DOMContentLoaded", function() {
      const ring = document.getElementById("score-ring");
      if (ring) {
        ring.style.strokeDashoffset = "276";
        ring.style.transition = "stroke-dashoffset 0.9s cubic-bezier(0.4, 0, 0.2, 1)";
        setTimeout(function() {
          ring.style.strokeDashoffset = "${offset}";
        }, 200);
      }

      // HAPTIC FEEDBACK
      const score = ${cafe.score};
      if (navigator.vibrate) {
        if (score >= 8.0) navigator.vibrate([40, 20, 40]);
        else if (score >= 7.5) navigator.vibrate(40);
        else if (score < 4.0) navigator.vibrate([30, 10, 30, 10, 30]);
        else navigator.vibrate(20);
      }
    });

    // SMOOTH TRANSITION on links — fade out before navigating
    document.addEventListener("click", function(e) {
      const link = e.target.closest("a");
      if (!link) return;
      if (!link.href) return;
      if (link.target) return;
      if (link.href.startsWith("mailto")) return;
      if (link.href.startsWith("tel")) return;
      if (link.href.includes("#")) return;
      if (link.onclick) return;
      if (link.getAttribute("onclick")) return;
    });

    window.addEventListener('load', function() {
      setTimeout(function() {
        const color = "${color}";
        const map = L.map("map").setView([${cafe.lat}, ${cafe.lng}], 15);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "" }).addTo(map);
        const icon = L.divIcon({
          html: '<div style="background:#0a0a0a;border:2px solid ' + color + ';border-radius:50%;width:40px;height:40px;display:flex;align-items:center;justify-content:center;overflow:hidden;"><img src="/logo.jpg" style="width:36px;height:36px;border-radius:50%;object-fit:cover;" /></div><div style="background:' + color + ';color:#000;border-radius:8px;font-size:10px;font-weight:700;text-align:center;margin-top:2px;padding:1px 5px;">${cafe.score}</div>',
          className: "", iconSize: [40, 55], iconAnchor: [20, 55]
        });
        L.marker([${cafe.lat}, ${cafe.lng}], { icon: icon }).addTo(map);
      }, 300);
    });` : ""}

    function generateShareCard() {
      const color = "${color}";
      function doGenerate() {
        const card = document.createElement("div");
        card.style.cssText = "position:fixed;top:-9999px;left:-9999px;background:#0a0a0a;border-radius:24px;padding:32px 28px;display:flex;flex-direction:column;align-items:center;gap:16px;border:2px solid " + color + "55;width:320px;font-family:sans-serif;";
        function toTitleCase(str) {
          return (str || "").replace(/\w\S*/g, function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
          });
        }
        const suburbDisplay = toTitleCase("${cafe.suburb}");
        const noteText = "${cafe.notes ? cafe.notes.substring(0, 80).replace(/"/g, '&quot;') : ""}";
        card.innerHTML = '<div style="display:flex;align-items:center;gap:10px;width:100%;"><img src="/logo.jpg" crossorigin="anonymous" style="width:40px;height:40px;border-radius:50%;object-fit:cover;" /><div><div style="font-size:11px;letter-spacing:3px;color:#c8a96e;font-weight:700;">KOFFEE REVIEW</div><div style="font-size:10px;color:rgba(255,255,255,0.6);">koffeereview.com.au</div></div></div><div style="position:relative;width:110px;height:110px;"><svg width="110" height="110" style="transform:rotate(-90deg);"><circle cx="55" cy="55" r="44" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="7"/><circle cx="55" cy="55" r="44" fill="none" stroke="${color}" stroke-width="7" stroke-dasharray="276" stroke-dashoffset="${offset}" stroke-linecap="round"/></svg><div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;"><span style="font-size:30px;font-weight:700;color:${color};line-height:1;">${cafe.score}</span><span style="font-size:11px;color:rgba(255,255,255,0.3);">/10</span></div></div><div style="text-align:center;"><div style="font-size:20px;font-weight:700;color:#fff;margin-bottom:4px;">${cafe.name}</div><div style="font-size:13px;color:rgba(255,255,255,0.4);margin-bottom:' + (noteText ? '8px' : '0') + ';">' + suburbDisplay + ', ${cafe.city}</div>' + (noteText ? '<div style="font-size:12px;color:rgba(255,255,255,0.55);font-style:italic;line-height:1.6;padding:0 8px;">' + noteText + '</div>' : '') + '</div><div style="padding:8px 24px;border-radius:20px;background:${color};font-size:12px;font-weight:700;letter-spacing:3px;color:#000;">${verdict.toUpperCase()}</div><div style="font-size:11px;color:rgba(255,255,255,0.25);letter-spacing:2px;margin-top:4px;">ONE LATTE · ONE DOUBLE SHOT</div>';
        document.body.appendChild(card);
        window.html2canvas(card, { backgroundColor: "#0a0a0a", scale: 3, useCORS: true }).then(function(canvas) {
          document.body.removeChild(card);
          shareCardDataUrl = canvas.toDataURL("image/png");
          document.getElementById("share-card-img").src = shareCardDataUrl;
          document.getElementById("share-overlay").classList.add("visible");
        });
      }
      if (window.html2canvas) { doGenerate(); }
      else {
        const s = document.createElement("script");
        s.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
        s.onload = doGenerate;
        document.head.appendChild(s);
      }
    }

    function saveCard() {
      const link = document.createElement("a");
      link.download = "koffee-review-score-card.png";
      link.href = shareCardDataUrl;
      link.click();
    }

    function shareCard() {
      if (navigator.share && shareCardDataUrl) {
        fetch(shareCardDataUrl).then(function(r) { return r.blob(); }).then(function(blob) {
          const file = new File([blob], "koffee-review.png", { type: "image/png" });
          navigator.share({ files: [file], title: "Koffee Review Score Card" }).catch(function() {});
        });
      } else { saveCard(); }
    }
  </script>
</body>
</html>`;
}

export default async function handler(req, res) {
  try {
    const slug = req.query.slug;

    if (!slug) {
      res.status(404).send("Not found");
      return;
    }

    const response = await fetch(SHEET_URL);
    const text = await response.text();
    const cafes = parseCSV(text);

    const cafe = cafes.find(function(c) {
      return makeSlug(c.name, c.suburb) === slug;
    });

    if (!cafe) {
      res.status(404).send(`<!DOCTYPE html><html><head><title>Café Not Found | Koffee Review</title></head><body style="background:#0a0a0a;color:#fff;font-family:sans-serif;text-align:center;padding:80px 24px;"><h1 style="color:#c8a96e;">Café Not Found</h1><p style="color:rgba(255,255,255,0.4);margin:16px 0;">We couldn't find this café in our database.</p><a href="https://koffeereview.com.au" style="color:#c8a96e;">← Browse all reviews</a></body></html>`);
      return;
    }

    res.setHeader("Content-Type", "text/html");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.status(200).send(renderHTML(cafe, cafes));
  } catch (error) {
    res.status(500).send("Error loading café");
  }
}
