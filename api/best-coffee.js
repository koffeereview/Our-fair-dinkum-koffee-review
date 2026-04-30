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
    obj.lat = parseFloat(obj.lat) || 0;
    obj.lng = parseFloat(obj.lng) || 0;
    return obj;
  }).filter(function(c) {
    return c.name && c.score > 0 && !SPAIN_CITIES.includes((c.city || "").toLowerCase());
  });
}

function getScoreColor(score) {
  if (score >= 9.0) return "#ffffff";
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

function renderCityPage(cityName, citySlug, stateShort, cafes, canonicalUrl) {
  const cityCafes = cafes.filter(function(c) {
    return (c.city || "").toLowerCase().trim() === cityName.toLowerCase();
  }).sort(function(a, b) { return b.score - a.score; });

  const mustVisit = cityCafes.filter(function(c) { return c.score >= 7.5; }).length;
  const avg = cityCafes.length > 0 ? (cityCafes.reduce(function(s, c) { return s + c.score; }, 0) / cityCafes.length).toFixed(1) : "0";
  const suburbs = [...new Set(cityCafes.map(function(c) { return c.suburb; }))].length;
  const suburbList = [...new Set(cityCafes.map(function(c) { return c.suburb; }))].sort();

  const title = "Best Coffee in " + cityName + " 2026 | Koffee Review";
  const desc = "The definitive guide to the best coffee in " + cityName + ". " + cityCafes.length + "+ cafés reviewed and scored by Koffee Review. One latte, one double shot espresso, one honest score. Know before you go.";

  const suburbOptions = suburbList.map(function(s) {
    return `<option value="${s}">${s}</option>`;
  }).join("");

  const cafeRows = cityCafes.map(function(cafe) {
    const color = getScoreColor(cafe.score);
    const slug = makeSlug(cafe.name, cafe.suburb);
    const noteText = cafe.notes ? cafe.notes.substring(0, 70) + (cafe.notes.length > 70 ? "..." : "") : "";
    return `<a href="/review/${slug}" class="cafe-card" data-lat="${cafe.lat || ""}" data-lng="${cafe.lng || ""}" data-suburb="${cafe.suburb}" data-name="${cafe.name}" data-score="${cafe.score}" style="position:relative;overflow:hidden;">
      <div style="position:absolute;left:0;top:0;bottom:0;width:4px;background:${color};border-radius:14px 0 0 14px;"></div>
      <div class="cafe-score" style="color:${color};margin-left:8px;">${cafe.score.toFixed(1)}</div>
      <div class="cafe-info">
        <div class="cafe-name">${cafe.name}</div>
        <div class="cafe-suburb">${cafe.suburb} · ${cafe.price || ""}</div>
        <div class="cafe-distance"></div>
        ${noteText ? `<div style="font-size:12px;color:rgba(255,255,255,0.45);margin-top:4px;font-style:italic;">${noteText}</div>` : ""}
      </div>
      <div class="cafe-verdict" style="background:${color};color:#000;border:none;">${(cafe.verdict || getVerdict(cafe.score)).toUpperCase()}</div>
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
  <meta property="og:image" content="https://koffeereview.com.au/logo.webp" />
  <meta property="og:url" content="${canonicalUrl}" />
  <link rel="canonical" href="${canonicalUrl}" />
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"CollectionPage","name":"${title}","description":"${desc}","url":"${canonicalUrl}","publisher":{"@type":"Organization","name":"Koffee Review","url":"https://koffeereview.com.au","logo":"https://koffeereview.com.au/logo.webp"},"about":{"@type":"City","name":"${cityName}","addressCountry":"AU"}}</script>
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Koffee Review","item":"https://koffeereview.com.au"},{"@type":"ListItem","position":2,"name":"Best Coffee ${cityName}","item":"${canonicalUrl}"}]}</script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css" />
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { background:#0a0a0a; color:#fff; font-family:'DM Sans',sans-serif; min-height:100vh; }
    nav { display:flex; align-items:center; justify-content:space-between; padding:16px 24px; border-bottom:1px solid rgba(255,255,255,0.06); }
    .nav-logo { display:flex; align-items:center; gap:10px; text-decoration:none; }
    .nav-logo img { width:36px; height:36px; border-radius:50%; object-fit:cover; }
    .nav-logo span { font-family:'Bebas Neue',sans-serif; font-size:16px; letter-spacing:2px; background:linear-gradient(135deg,#f5e6c8,#c8a96e); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
    .nav-back { font-size:13px; color:rgba(255,255,255,0.5); text-decoration:none; }
    .hero { padding:48px 24px 32px; max-width:800px; margin:0 auto; }
    .hero-tag { display:inline-block; padding:4px 14px; border-radius:20px; font-size:11px; font-weight:700; letter-spacing:2px; background:rgba(197,157,80,0.1); color:#c8a96e; border:1px solid rgba(197,157,80,0.3); margin-bottom:16px; }
    h1 { font-family:'Bebas Neue',sans-serif; font-size:clamp(32px,6vw,56px); letter-spacing:2px; line-height:1.1; background:linear-gradient(135deg,#f5e6c8,#c8a96e); -webkit-background-clip:text; -webkit-text-fill-color:transparent; margin-bottom:12px; }
    .hero p { font-size:15px; color:rgba(255,255,255,0.6); line-height:1.8; max-width:600px; }
    .stats { display:flex; gap:16px; padding:0 24px 24px; max-width:800px; margin:0 auto; flex-wrap:wrap; }
    .stat { background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:14px 20px; flex:1; min-width:100px; }
    .stat-num { font-family:'Bebas Neue',sans-serif; font-size:28px; color:#c8a96e; line-height:1; }
    .stat-label { font-size:11px; color:rgba(255,255,255,0.4); margin-top:2px; }
    .map-section { max-width:800px; margin:0 auto; padding:0 24px 32px; }
    .map-section h2 { font-family:'Bebas Neue',sans-serif; font-size:20px; letter-spacing:2px; color:#f5e6c8; margin-bottom:12px; }
    #map { height:400px; border-radius:16px; overflow:hidden; border:1px solid rgba(255,255,255,0.08); }
    .cafe-list { max-width:800px; margin:0 auto; padding:0 24px 80px; }
    .filter-row { display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:16px; flex-wrap:wrap; }
    .section-title { font-family:'Bebas Neue',sans-serif; font-size:20px; letter-spacing:2px; color:#f5e6c8; }
    .filter-controls { display:flex; gap:8px; align-items:center; flex-wrap:wrap; }
    select { background:#1a1a1a; border:1px solid rgba(255,255,255,0.12); color:#fff; padding:8px 14px; border-radius:20px; font-size:13px; cursor:pointer; font-family:'DM Sans',sans-serif; outline:none; }
    .sort-btn { padding:7px 16px; border-radius:20px; font-size:12px; font-weight:500; cursor:pointer; border:1px solid rgba(255,255,255,0.15); background:transparent; color:rgba(255,255,255,0.5); font-family:'DM Sans',sans-serif; }
    .sort-btn.active { border-color:rgba(197,157,80,0.5); background:rgba(197,157,80,0.15); color:#c8a96e; }
    .near-me-btn { padding:7px 16px; border-radius:20px; font-size:12px; cursor:pointer; border:1px solid rgba(255,255,255,0.15); background:transparent; color:rgba(255,255,255,0.5); font-family:'DM Sans',sans-serif; white-space:nowrap; }
    .near-me-active { border-color:rgba(197,157,80,0.5); background:rgba(197,157,80,0.15); color:#c8a96e; }
    .near-me-banner { display:none; background:rgba(197,157,80,0.08); border:1px solid rgba(197,157,80,0.2); border-radius:12px; padding:10px 16px; margin-bottom:16px; font-size:13px; color:#c8a96e; }
    .cafe-card { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); border-radius:14px; padding:16px 20px; margin-bottom:8px; display:flex; align-items:center; gap:16px; text-decoration:none; color:inherit; transition:border 0.2s; }
    .cafe-card:hover { border-color:rgba(197,157,80,0.3); }
    .cafe-score { font-family:'Bebas Neue',sans-serif; font-size:24px; min-width:48px; text-align:center; line-height:1; }
    .cafe-info { flex:1; }
    .cafe-name { font-weight:600; font-size:15px; color:#fff; margin-bottom:2px; }
    .cafe-suburb { font-size:12px; color:rgba(255,255,255,0.4); }
    .cafe-distance { font-size:11px; color:rgba(197,157,80,0.6); margin-top:2px; }
    .cafe-verdict { font-size:10px; font-weight:700; letter-spacing:2px; padding:3px 10px; border-radius:20px; }
    .footer { border-top:1px solid rgba(255,255,255,0.06); padding:32px 24px; text-align:center; max-width:800px; margin:0 auto; }
    .footer p { font-size:13px; color:rgba(255,255,255,0.3); margin-bottom:16px; line-height:1.7; }
    .browse-btn { display:inline-flex; align-items:center; gap:8px; padding:13px 28px; border-radius:12px; background:linear-gradient(135deg,#c8a96e,#f5e6c8); color:#0a0a0a; font-weight:700; font-size:14px; text-decoration:none; }
    .browse-btn img { width:22px; height:22px; border-radius:50%; object-fit:cover; }
    .footer-links { display:flex; gap:14px; justify-content:center; flex-wrap:wrap; margin-top:16px; }
    .footer-links a { font-size:12px; color:rgba(255,255,255,0.4); text-decoration:none; }
    .footer-links a:hover { color:#c8a96e; }
  </style>
</head>
<body>
  <nav>
    <a href="https://koffeereview.com.au" class="nav-logo">
      <img src="/logo.webp" alt="Koffee Review" />
      <span>KOFFEE REVIEW</span>
    </a>
    <a href="https://koffeereview.com.au" class="nav-back">← All Reviews</a>
  </nav>

  <div class="hero">
    <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:16px;">
      <div class="hero-tag">${stateShort} · CITY GUIDE</div>
      <button onclick="if(navigator.share){navigator.share({title:'${title}',url:window.location.href})}else{navigator.clipboard.writeText(window.location.href);alert('Link copied!')}" style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);color:rgba(255,255,255,0.6);padding:6px 16px;border-radius:20px;font-size:12px;cursor:pointer;font-family:'DM Sans',sans-serif;">↑ Share this guide</button>
    </div>
    <h1>Best Coffee in ${cityName}</h1>
    <p>Every café reviewed with the same two drinks — one latte and one double shot espresso. No sponsorships, no agendas. Just honest scores from ${cityCafes.length}+ ${cityName} cafés.</p>
  </div>

  <div class="stats">
    <div class="stat"><div class="stat-num">${cityCafes.length}</div><div class="stat-label">Cafés Reviewed</div></div>
    <div class="stat"><div class="stat-num">${mustVisit}</div><div class="stat-label">Must Visit (7.5+)</div></div>
    <div class="stat"><div class="stat-num">${avg}</div><div class="stat-label">Avg Score</div></div>
    <div class="stat"><div class="stat-num">${suburbs}</div><div class="stat-label">Suburbs</div></div>
  </div>

  <div class="map-section">
    <h2>Find Coffee Near You</h2>
    <div id="map"></div>
  </div>

  <div class="cafe-list">
    <div class="filter-row">
      <div class="section-title">ALL ${cityName.toUpperCase()} CAFÉS</div>
      <div class="filter-controls">
        <button class="sort-btn active" onclick="sortList('score',this)">High Score</button>
        <button class="sort-btn" onclick="sortList('name',this)">A to Z</button>
        <select id="suburb-filter" onchange="filterBySuburb(this.value)">
          <option value="all">All Suburbs</option>
          ${suburbOptions}
        </select>
        <button class="near-me-btn" id="near-me-btn" onclick="handleNearMe()">📍 Near Me</button>
      </div>
    </div>
    <div class="near-me-banner" id="near-me-banner">📍 Showing cafés closest to your location</div>
    <div id="cafe-list-content">${cafeRows}</div>
  </div>

  <div class="footer">
    <p>All scores based on one latte and one double shot espresso, ordered the same way every time.<br/>
    No café pays for placement. <a href="/how-we-score.html" style="color:#c8a96e;">Read how we score →</a><br/><br/>
    <a href="/brisbane-cafes-to-avoid" style="color:#f87171;font-size:13px;">${cityName === "Brisbane" ? "See cafés to avoid in Brisbane →" : ""}</a></p>
    <a href="https://koffeereview.com.au" class="browse-btn">
      <img src="/logo.webp" alt="Koffee Review" />Browse All Reviews
    </a>
    <div class="footer-links">
      <a href="/about">About</a>
      <a href="/how-we-score.html">How We Score</a>
      <a href="/disclosure">Disclosure</a>
      <a href="/leaderboard">Top 10 Australia</a>
      <a href="/best-coffee-brisbane">Best Coffee Brisbane</a>
      <a href="/best-coffee-gold-coast">Best Coffee Gold Coast</a>
    </div>
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"></script>
  <script>
    // Init map
    const validCafes = Array.from(document.querySelectorAll(".cafe-card")).filter(function(c) {
      return parseFloat(c.dataset.lat) && Math.abs(parseFloat(c.dataset.lat)) > 1;
    });
    if (validCafes.length > 0) {
      const lats = validCafes.map(function(c) { return parseFloat(c.dataset.lat); });
      const lngs = validCafes.map(function(c) { return parseFloat(c.dataset.lng); });
      const avgLat = lats.reduce(function(a,b){return a+b;},0)/lats.length;
      const avgLng = lngs.reduce(function(a,b){return a+b;},0)/lngs.length;
      setTimeout(function() {
        const map = L.map("map").setView([avgLat, avgLng], 11);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {attribution:""}).addTo(map);
        validCafes.forEach(function(card) {
          const lat = parseFloat(card.dataset.lat);
          const lng = parseFloat(card.dataset.lng);
          const score = parseFloat(card.dataset.score);
          const name = card.dataset.name;
          const colors = {"9":"#FFD700","8":"#4ade80","7":"#2dd4bf","6":"#facc15","5":"#fb923c"};
          const color = score >= 9 ? colors["9"] : score >= 8 ? colors["8"] : score >= 7 ? colors["7"] : score >= 6 ? colors["6"] : score >= 5 ? colors["5"] : "#f87171";
          const icon = L.divIcon({
            html: '<div style="background:#0a0a0a;border:2px solid ' + color + ';border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;overflow:hidden;"><img src="/logo.webp" style="width:32px;height:32px;border-radius:50%;object-fit:cover;"/></div><div style="background:' + color + ';color:#000;border-radius:8px;font-size:9px;font-weight:700;text-align:center;margin-top:2px;padding:1px 4px;">' + score.toFixed(1) + '</div>',
            className:"", iconSize:[36,50], iconAnchor:[18,50]
          });
          L.marker([lat, lng], {icon:icon}).addTo(map).bindPopup("<strong>" + name + "</strong><br/>" + score.toFixed(1) + "/10");
        });
      }, 300);
    }

    // Sort
    let currentSort = "score";
    function sortList(sort, btn) {
      currentSort = sort;
      document.querySelectorAll(".sort-btn").forEach(function(b) { b.classList.remove("active"); });
      btn.classList.add("active");
      document.getElementById("suburb-filter").value = "all";
      document.getElementById("near-me-btn").className = "near-me-btn";
      document.getElementById("near-me-banner").style.display = "none";
      const cards = Array.from(document.querySelectorAll(".cafe-card"));
      cards.sort(function(a, b) {
        if (sort === "score") return parseFloat(b.dataset.score) - parseFloat(a.dataset.score);
        return a.dataset.name.localeCompare(b.dataset.name);
      });
      const list = document.getElementById("cafe-list-content");
      cards.forEach(function(c) { c.style.display = "flex"; list.appendChild(c); });
    }

    // Filter by suburb
    function filterBySuburb(suburb) {
      document.getElementById("near-me-btn").className = "near-me-btn";
      document.getElementById("near-me-banner").style.display = "none";
      document.querySelectorAll(".sort-btn").forEach(function(b) { b.classList.remove("active"); });
      document.querySelectorAll(".cafe-card").forEach(function(card) {
        if (suburb === "all") { card.style.display = "flex"; return; }
        card.style.display = card.dataset.suburb === suburb ? "flex" : "none";
      });
    }

    // Near Me
    function getDistKm(lat1, lng1, lat2, lng2) {
      const R = 6371;
      const dLat = (lat2-lat1)*Math.PI/180;
      const dLng = (lng2-lng1)*Math.PI/180;
      const a = Math.sin(dLat/2)*Math.sin(dLat/2)+Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)*Math.sin(dLng/2);
      return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
    }

    function handleNearMe() {
      const btn = document.getElementById("near-me-btn");
      if (!navigator.geolocation) { alert("Location not supported."); return; }
      btn.textContent = "📍 Locating...";
      navigator.geolocation.getCurrentPosition(function(pos) {
        const uLat = pos.coords.latitude;
        const uLng = pos.coords.longitude;
        const cards = Array.from(document.querySelectorAll(".cafe-card"));
        const withDist = cards.map(function(card) {
          const lat = parseFloat(card.dataset.lat||"0");
          const lng = parseFloat(card.dataset.lng||"0");
          const dist = (lat && Math.abs(lat)>1) ? getDistKm(uLat,uLng,lat,lng) : 9999;
          return {card:card, dist:dist};
        });
        withDist.sort(function(a,b){return a.dist-b.dist;});
        const list = document.getElementById("cafe-list-content");
        withDist.forEach(function(item) {
          item.card.style.display = "flex";
          const distEl = item.card.querySelector(".cafe-distance");
          if (distEl) distEl.textContent = item.dist < 9999 ? (item.dist<1?(item.dist*1000).toFixed(0)+"m":item.dist.toFixed(1)+"km")+" away" : "";
          list.appendChild(item.card);
        });
        btn.textContent = "📍 Near Me ✓";
        btn.classList.add("near-me-active");
        document.getElementById("near-me-banner").style.display = "block";
        document.getElementById("suburb-filter").value = "all";
        document.querySelectorAll(".sort-btn").forEach(function(b){b.classList.remove("active");});
      }, function() {
        btn.textContent = "📍 Near Me";
        alert("Could not get your location. Please allow location access.");
      });
    }
  </script>
</body>
</html>`;
}

export default async function handler(req, res) {
  try {
    const path = req.url || "";
    let cityName = "Brisbane";
    let citySlug = "best-coffee-brisbane";
    let stateShort = "QLD";
    let canonicalUrl = "https://koffeereview.com.au/best-coffee-brisbane";

    if (path.includes("gold-coast")) {
      cityName = "Gold Coast"; citySlug = "best-coffee-gold-coast";
      canonicalUrl = "https://koffeereview.com.au/best-coffee-gold-coast";
    } else if (path.includes("sunshine-coast")) {
      cityName = "Sunshine Coast"; citySlug = "best-coffee-sunshine-coast";
      canonicalUrl = "https://koffeereview.com.au/best-coffee-sunshine-coast";
    } else if (path.includes("melbourne")) {
      cityName = "Melbourne"; citySlug = "best-coffee-melbourne";
      stateShort = "VIC";
      canonicalUrl = "https://koffeereview.com.au/best-coffee-melbourne";
    } else if (path.includes("moreton-bay")) {
      cityName = "Moreton Bay"; citySlug = "best-coffee-moreton-bay";
      canonicalUrl = "https://koffeereview.com.au/best-coffee-moreton-bay";
    }

    const response = await fetch(SHEET_URL);
    const text = await response.text();
    const cafes = parseCSV(text);
    const html = renderCityPage(cityName, citySlug, stateShort, cafes, canonicalUrl);

    res.setHeader("Content-Type", "text/html");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.status(200).send(html);
  } catch (error) {
    res.status(500).send("Error loading page: " + error.message);
  }
}
