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
  "redland": { name: "Redland", slug: "redland", stateShort: "QLD" },
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
  if (score >= 9.0) return "#ffffff";
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

  const mustVisitColor = mustVisit === 0 ? "#f87171" : "#c8a96e";
  const avgColor = parseFloat(avg) < 7.0 ? "#f87171" : "#c8a96e";
  const topCafe = cityCafes[0];
  const contextLine = parseFloat(avg) < 7.0 || mustVisit === 0
    ? `${config.name} has room to improve overall. Best cup found so far: ${topCafe.name} at ${topCafe.score.toFixed(1)}.`
    : mustVisit >= 5
    ? `${config.name} is a strong city for coffee. ${mustVisit} cafés worth going out of your way for.`
    : `${config.name} has solid options. Top pick: ${topCafe.name} at ${topCafe.score.toFixed(1)}.`;

  const cafeRows = cityCafes.map(function(cafe, i) {
    const color = getScoreColor(cafe.score);
    const slug = makeSlug(cafe.name, cafe.suburb);
    const noteText = cafe.notes ? cafe.notes.substring(0, 70) + (cafe.notes.length > 70 ? "..." : "") : "";
    return `<a href="/review/${slug}" class="cafe-row" data-lat="${cafe.lat || ""}" data-lng="${cafe.lng || ""}" data-suburb="${cafe.suburb}" data-name="${cafe.name}" data-score="${cafe.score}" style="display:flex;align-items:center;gap:16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:16px 20px;margin-bottom:8px;text-decoration:none;color:inherit;position:relative;overflow:hidden;">
      <div style="position:absolute;left:0;top:0;bottom:0;width:4px;background:${color};border-radius:14px 0 0 14px;"></div>
      <div style="font-family:'Bebas Neue',sans-serif;font-size:24px;color:${color};min-width:48px;text-align:center;margin-left:8px;">${cafe.score.toFixed(1)}</div>
      <div style="flex:1;">
        <div style="font-weight:600;font-size:15px;color:#fff;">${cafe.name}</div>
        <div class="cafe-suburb" style="font-size:12px;color:rgba(255,255,255,0.4);margin-top:2px;">${cafe.suburb} · ${cafe.price || ""}</div>
        <div class="cafe-distance" style="font-size:11px;color:rgba(197,157,80,0.6);margin-top:2px;"></div>
        ${noteText ? `<div style="font-size:12px;color:rgba(255,255,255,0.45);margin-top:4px;font-style:italic;">${noteText}</div>` : ""}
      </div>
      <div style="padding:4px 12px;border-radius:20px;background:${color};color:#000;font-size:10px;font-weight:700;letter-spacing:2px;flex-shrink:0;">${(cafe.verdict || "").toUpperCase()}</div>
    </a>`;
  }).join("");

  const suburbList = [...new Set(cityCafes.map(function(c) { return c.suburb; }))].sort();
  const suburbOptions = suburbList.map(function(s) {
    return `<option value="${s}">${s}</option>`;
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
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"CollectionPage","name":"${title}","description":"${desc}","url":"${canonicalUrl}","publisher":{"@type":"Organization","name":"Koffee Review","url":"https://koffeereview.com.au","logo":"https://koffeereview.com.au/logo.webp"},"about":{"@type":"City","name":"${config.name}","addressCountry":"AU"}}</script>
  <script type="application/ld+json">{
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Koffee Review", "item": "https://koffeereview.com.au" },
      { "@type": "ListItem", "position": 2, "name": "Best Coffee in ${config.name}", "item": "${canonicalUrl}" }
    ]
  }</script>
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
    .filter-row { display:flex; align-items:center; gap:10px; margin-bottom:16px; flex-wrap:wrap; }
    .section-title { font-family:'Bebas Neue',sans-serif; font-size:18px; letter-spacing:2px; color:rgba(197,157,80,0.8); }
    select { background:#1a1a1a; border:1px solid rgba(255,255,255,0.12); color:#fff; padding:8px 14px; border-radius:20px; font-size:13px; cursor:pointer; font-family:'DM Sans',sans-serif; outline:none; }
    select option { background:#1a1a1a; }
    .cafe-row { display:flex;align-items:center;gap:16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:16px 20px;margin-bottom:8px;text-decoration:none;color:inherit; }
    .cafe-row:hover { border-color:rgba(197,157,80,0.3); }
    .footer { border-top:1px solid rgba(255,255,255,0.06); padding:32px 24px; text-align:center; max-width:800px; margin:0 auto; }
    .footer p { font-size:13px; color:rgba(255,255,255,0.3); margin-bottom:16px; line-height:1.7; }
    .browse-btn { display:inline-flex; align-items:center; gap:8px; padding:13px 28px; border-radius:12px; background:linear-gradient(135deg,#c8a96e,#f5e6c8); color:#0a0a0a; font-weight:700; font-size:14px; text-decoration:none; }
    .browse-btn img { width:22px; height:22px; border-radius:50%; object-fit:cover; }
    .avoid-link { display:inline-flex; align-items:center; gap:6px; margin-top:16px; padding:10px 20px; border-radius:12px; border:1px solid rgba(248,113,113,0.3); background:rgba(248,113,113,0.06); color:#f87171; text-decoration:none; font-size:13px; font-weight:600; }
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
    <div class="hero-tag">${config.stateShort} · CITY GUIDE</div>
    <h1>Best Coffee in ${config.name}</h1>
    <p>Every café reviewed with the same two drinks — one latte and one double shot espresso. No sponsorships, no agendas. Just honest scores from ${cityCafes.length}+ ${config.name} cafés.</p>
  </div>

  <div class="stats">
    <div class="stat"><div class="stat-num" style="color:#c8a96e;">${cityCafes.length}</div><div class="stat-label">Cafés Reviewed</div></div>
    <div class="stat"><div class="stat-num" style="color:${mustVisitColor};">${mustVisit}</div><div class="stat-label">Must Visit (7.5+)</div></div>
    <div class="stat"><div class="stat-num" style="color:${avgColor};">${avg}</div><div class="stat-label">Avg Score</div></div>
    <div class="stat"><div class="stat-num" style="color:#c8a96e;">${suburbs}</div><div class="stat-label">Suburbs</div></div>
  </div>
  <div style="max-width:800px;margin:0 auto;padding:0 24px 20px;font-size:13px;color:rgba(255,255,255,0.4);font-style:italic;">${contextLine}</div>

  <div class="content">
    <div class="filter-row">
      <div class="section-title">ALL ${config.name.toUpperCase()} CAFÉS</div>
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
        <select id="suburb-filter" onchange="filterSuburb(this.value)">
          <option value="all">All Suburbs</option>
          ${suburbOptions}
        </select>
        <button id="near-me-btn" onclick="handleNearMe()" style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);color:rgba(255,255,255,0.6);padding:8px 16px;border-radius:20px;font-size:12px;cursor:pointer;font-family:'DM Sans',sans-serif;white-space:nowrap;">📍 Near Me</button>
      </div>
    </div>
    <div id="near-me-banner" style="display:none;background:rgba(197,157,80,0.08);border:1px solid rgba(197,157,80,0.2);border-radius:12px;padding:10px 16px;margin-bottom:16px;font-size:13px;color:#c8a96e;">
      📍 Showing cafés closest to your location
    </div>
    <div id="cafe-list">
      ${cafeRows}
    </div>
  </div>

  <!-- BROWSE BY SUBURB MODULE -->
  ${(function() {
    const suburbMap = {};
    cityCafes.forEach(function(c) {
      const sub = c.suburb;
      if (!sub) return;
      if (!suburbMap[sub]) suburbMap[sub] = { cafes: [], totalScore: 0 };
      suburbMap[sub].cafes.push(c);
      suburbMap[sub].totalScore += c.score;
    });
    
    const qualifiedSuburbs = Object.keys(suburbMap)
      .filter(function(sub) { return suburbMap[sub].cafes.length >= 3; })
      .map(function(sub) {
        const data = suburbMap[sub];
        const sorted = data.cafes.sort(function(a, b) { return b.score - a.score; });
        const top = sorted[0];
        const avg = (data.totalScore / data.cafes.length).toFixed(1);
        const subSlug = sub.toLowerCase().replace(/[^a-z0-9\\s-]/g, "").replace(/\\s+/g, "-").replace(/-+/g, "-");
        return { name: sub, count: data.cafes.length, avg: parseFloat(avg), topCafe: top.name, topScore: top.score, slug: subSlug };
      })
      .sort(function(a, b) { return b.avg - a.avg || b.count - a.count; });
    
    if (qualifiedSuburbs.length === 0) return "";
    
    const tiles = qualifiedSuburbs.map(function(s) {
      const topColor = s.topScore >= 9 ? "#ffffff" : s.topScore >= 8 ? "#4ade80" : s.topScore >= 7 ? "#2dd4bf" : s.topScore >= 6 ? "#facc15" : s.topScore >= 5 ? "#fb923c" : "#f87171";
      return '<a href="/suburb/' + s.slug + '-' + citySlug + '" style="display:block;padding:16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;text-decoration:none;color:inherit;transition:all 0.2s;" onmouseover="this.style.borderColor=\'rgba(230,192,115,0.3)\';this.style.background=\'rgba(255,255,255,0.05)\'" onmouseout="this.style.borderColor=\'rgba(255,255,255,0.08)\';this.style.background=\'rgba(255,255,255,0.03)\'">' +
        '<div style="font-weight:600;font-size:15px;color:#fff;margin-bottom:4px;">' + s.name + '</div>' +
        '<div style="font-size:12px;color:rgba(255,255,255,0.5);margin-bottom:8px;">' + s.count + ' cafés · avg ' + s.avg + '/10</div>' +
        '<div style="display:flex;align-items:center;justify-content:space-between;">' +
          '<div style="font-size:11px;color:rgba(255,255,255,0.4);">Top: ' + s.topCafe + '</div>' +
          '<div style="font-family:\'Bebas Neue\',sans-serif;font-size:16px;color:' + topColor + ';">' + s.topScore.toFixed(1) + '</div>' +
        '</div>' +
      '</a>';
    }).join("");
    
    return '<div style="max-width:800px;margin:0 auto;padding:32px 24px 0;">' +
      '<div style="font-family:\'Bebas Neue\',sans-serif;font-size:14px;letter-spacing:3px;color:rgba(255,255,255,0.6);margin-bottom:6px;padding-bottom:8px;border-bottom:1px solid rgba(255,255,255,0.08);">BROWSE ' + config.name.toUpperCase() + ' BY SUBURB</div>' +
      '<p style="font-size:13px;color:rgba(255,255,255,0.4);margin-bottom:16px;">Suburbs with 3+ reviewed cafés</p>' +
      '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px;">' + tiles + '</div>' +
    '</div>';
  })()}

  <div class="footer">
    <p>All scores based on one latte and one double shot espresso, ordered the same way every time.<br/>
    No café pays for placement. <a href="/how-we-score.html" style="color:#c8a96e;">Read how we score →</a></p>
    ${citySlug === "brisbane" ? '<a href="/brisbane-cafes-to-avoid" class="avoid-link">⚠ Cafés to Avoid in Brisbane →</a><br/><br/>' : ""}
    <button onclick="if(navigator.share){navigator.share({title:'Best Coffee in ${config.name}',url:window.location.href})}else{navigator.clipboard.writeText(window.location.href);alert('Link copied!')}" style="display:block;font-size:13px;color:rgba(255,255,255,0.4);cursor:pointer;background:none;border:none;font-family:'DM Sans',sans-serif;margin:0 auto 20px;text-decoration:underline;">↑ Share this city guide</button>
    <a href="https://koffeereview.com.au" class="browse-btn">
      <img src="/logo.webp" alt="Koffee Review" />Browse All Reviews
    </a>
    <div style="margin-top:20px;text-align:center;">
      <div style="font-size:10px;letter-spacing:3px;color:rgba(255,255,255,0.55);font-weight:700;margin-bottom:8px;">EXPLORE</div>
      <div style="display:flex;gap:8px;justify-content:center;flex-wrap:nowrap;">
        <a href="/best-latte-brisbane" style="font-size:11px;color:rgba(255,255,255,0.55);text-decoration:none;white-space:nowrap;">Best Latte Brisbane</a>
        <span style="color:rgba(255,255,255,0.2);">·</span>
        <a href="/hidden-gem-cafes-brisbane" style="font-size:11px;color:rgba(255,255,255,0.55);text-decoration:none;white-space:nowrap;">Hidden Gems</a>
        <span style="color:rgba(255,255,255,0.2);">·</span>
        <a href="/worst-cafes-by-suburb" style="font-size:11px;color:rgba(255,255,255,0.55);text-decoration:none;white-space:nowrap;">Worst Cafés</a>
      </div>
    </div>
  </div>

  <script>
    const allRows = document.querySelectorAll("#cafe-list a");

    function filterSuburb(suburb) {
      document.getElementById("near-me-btn").style.background = "rgba(255,255,255,0.06)";
      document.getElementById("near-me-btn").style.color = "rgba(255,255,255,0.6)";
      document.getElementById("near-me-banner").style.display = "none";
      allRows.forEach(function(row) {
        if (suburb === "all") { row.style.display = "flex"; return; }
        const suburbText = row.querySelector(".cafe-suburb");
        if (suburbText && suburbText.textContent.toLowerCase().includes(suburb.toLowerCase())) {
          row.style.display = "flex";
        } else {
          row.style.display = "none";
        }
      });
    }

    function getDistKm(lat1, lng1, lat2, lng2) {
      const R = 6371;
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLng = (lng2 - lng1) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng/2) * Math.sin(dLng/2);
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    }

    function handleNearMe() {
      const btn = document.getElementById("near-me-btn");
      const banner = document.getElementById("near-me-banner");

      if (!navigator.geolocation) {
        alert("Location not supported on this device.");
        return;
      }

      btn.textContent = "📍 Locating...";

      navigator.geolocation.getCurrentPosition(
        function(pos) {
          const userLat = pos.coords.latitude;
          const userLng = pos.coords.longitude;

          // Get lat/lng from data attributes on each row and sort by distance
          const rows = Array.from(allRows);
          const withDist = rows.map(function(row) {
            const lat = parseFloat(row.dataset.lat || "0");
            const lng = parseFloat(row.dataset.lng || "0");
            const dist = (lat && lng && Math.abs(lat) > 1) ? getDistKm(userLat, userLng, lat, lng) : 9999;
            return { row: row, dist: dist };
          });

          withDist.sort(function(a, b) { return a.dist - b.dist; });

          const list = document.getElementById("cafe-list");
          withDist.forEach(function(item) {
            item.row.style.display = "flex";
            list.appendChild(item.row);
            // Add distance label
            const distEl = item.row.querySelector(".cafe-distance");
            if (distEl) {
              distEl.textContent = item.dist < 9999 ? (item.dist < 1 ? (item.dist * 1000).toFixed(0) + "m" : item.dist.toFixed(1) + "km") + " away" : "";
            }
          });

          btn.textContent = "📍 Near Me ✓";
          btn.style.background = "rgba(197,157,80,0.15)";
          btn.style.color = "#c8a96e";
          btn.style.borderColor = "rgba(197,157,80,0.4)";
          banner.style.display = "block";
          document.getElementById("suburb-filter").value = "all";
        },
        function() {
          btn.textContent = "📍 Near Me";
          alert("Could not get your location. Please allow location access and try again.");
        }
      );
    }
  </script>
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
