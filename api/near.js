// COFFEE NEAR LANDMARK — server-rendered pages for "coffee near [landmark]"
// /api/near?landmark=south-bank → finds closest cafes to South Bank using geo distance
// Targets high-intent searches like "coffee near South Bank", "cafes near Queen Street Mall"

const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYEU8Khk3R5I879v3FcXPqhq0aCXa2ZWM1BwwJOyUitx2Boak_AFTOkwvB8qQrKIeU55NM4htFjHbI/pub?gid=0&single=true&output=csv";

const LANDMARKS = {
  "south-bank": { name: "South Bank", lat: -27.4805, lng: 153.0234, city: "Brisbane" },
  "queen-street-mall": { name: "Queen Street Mall", lat: -27.4698, lng: 153.0251, city: "Brisbane" },
  "brisbane-airport": { name: "Brisbane Airport", lat: -27.3842, lng: 153.1175, city: "Brisbane" },
  "suncorp-stadium": { name: "Suncorp Stadium", lat: -27.4648, lng: 153.0095, city: "Brisbane" },
  "brisbane-cbd": { name: "Brisbane CBD", lat: -27.4698, lng: 153.0251, city: "Brisbane" },
  "west-village": { name: "West Village", lat: -27.4850, lng: 153.0065, city: "Brisbane" },
  "eat-street": { name: "Eat Street Northshore", lat: -27.4330, lng: 153.0702, city: "Brisbane" },
  "the-gabba": { name: "The Gabba", lat: -27.4858, lng: 153.0381, city: "Brisbane" },
  "fortitude-valley": { name: "Fortitude Valley", lat: -27.4560, lng: 153.0355, city: "Brisbane" },
  "new-farm-park": { name: "New Farm Park", lat: -27.4681, lng: 153.0489, city: "Brisbane" },
  "mt-coot-tha": { name: "Mt Coot-tha", lat: -27.4789, lng: 152.9577, city: "Brisbane" },
  "kangaroo-point": { name: "Kangaroo Point Cliffs", lat: -27.4790, lng: 153.0335, city: "Brisbane" },
  "uq-st-lucia": { name: "University of Queensland", lat: -27.4975, lng: 153.0137, city: "Brisbane" },
  "qut-gardens-point": { name: "QUT Gardens Point", lat: -27.4770, lng: 153.0283, city: "Brisbane" },
  "roma-street": { name: "Roma Street Parkland", lat: -27.4622, lng: 153.0148, city: "Brisbane" },
  "howard-smith-wharves": { name: "Howard Smith Wharves", lat: -27.4615, lng: 153.0335, city: "Brisbane" },
  "james-street": { name: "James Street", lat: -27.4539, lng: 153.0405, city: "Brisbane" },
  "pacific-fair": { name: "Pacific Fair", lat: -28.0373, lng: 153.4306, city: "Gold Coast" },
  "surfers-paradise": { name: "Surfers Paradise", lat: -28.0027, lng: 153.4300, city: "Gold Coast" },
  "burleigh-beach": { name: "Burleigh Beach", lat: -28.0883, lng: 153.4528, city: "Gold Coast" }
};

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

function escapeHtml(str) {
  return (str || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function getScoreColor(score) {
  if (score >= 9) return "#ffffff";
  if (score >= 8) return "#4ade80";
  if (score >= 7) return "#2dd4bf";
  if (score >= 6) return "#facc15";
  if (score >= 5) return "#fb923c";
  return "#f87171";
}

function getVerdict(score) {
  if (score >= 9) return "ELITE";
  if (score >= 8) return "GREAT";
  if (score >= 7) return "SOLID";
  if (score >= 6) return "DECENT";
  if (score >= 5) return "JUST OKAY";
  return "AVOID";
}

function makeSlug(name, suburb) {
  return (name + "-" + suburb).toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
}

function haversine(lat1, lng1, lat2, lng2) {
  var R = 6371;
  var dLat = (lat2 - lat1) * Math.PI / 180;
  var dLng = (lng2 - lng1) * Math.PI / 180;
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function parseCSV(text) {
  var lines = text.split("\n").filter(function(l) { return l && l.trim(); });
  if (lines.length < 2) return [];
  var headers = splitCSVLine(lines[0]).map(function(h) { return h.trim().toLowerCase(); });
  var idx = { name: headers.indexOf("name"), suburb: headers.indexOf("suburb"), city: headers.indexOf("city"), score: headers.indexOf("score"), price: headers.indexOf("price"), notes: headers.indexOf("notes"), lat: headers.indexOf("lat"), lng: headers.indexOf("lng") };
  if (idx.name === -1 || idx.suburb === -1) return [];
  var out = [];
  for (var i = 1; i < lines.length; i++) {
    try {
      var p = splitCSVLine(lines[i]);
      var name = p[idx.name] || "";
      var suburb = p[idx.suburb] || "";
      if (!name || !suburb) continue;
      out.push({ name: name, suburb: suburb, city: p[idx.city] || "", score: parseFloat(p[idx.score]) || 0, price: p[idx.price] || "$$$", notes: p[idx.notes] || "", lat: parseFloat(p[idx.lat]) || 0, lng: parseFloat(p[idx.lng]) || 0 });
    } catch (e) {}
  }
  return out;
}

export default async function handler(req, res) {
  try {
    var landmark = req.query.landmark || "";
    
    if (!landmark || !LANDMARKS[landmark]) {
      var brisCards = Object.keys(LANDMARKS).filter(function(k){return LANDMARKS[k].city==="Brisbane";}).map(function(k) {
        return '<a href="/coffee-near/' + k + '" class="lc"><div class="lc-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z" stroke="#E6C073" stroke-width="1.8"/><circle cx="12" cy="10" r="3" fill="#E6C073"/></svg></div><div class="lc-name">' + LANDMARKS[k].name + '</div><div class="lc-arrow">&#8594;</div></a>';
      }).join("");
      var gcCards = Object.keys(LANDMARKS).filter(function(k){return LANDMARKS[k].city==="Gold Coast";}).map(function(k) {
        return '<a href="/coffee-near/' + k + '" class="lc"><div class="lc-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z" stroke="#2dd4bf" stroke-width="1.8"/><circle cx="12" cy="10" r="3" fill="#2dd4bf"/></svg></div><div class="lc-name">' + LANDMARKS[k].name + '</div><div class="lc-arrow">&#8594;</div></a>';
      }).join("");
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
      return res.status(landmark ? 404 : 200).send('<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Coffee Near Landmarks | Brisbane & Gold Coast | Koffee Review</title><meta name="description" content="Find the best reviewed cafes near 20 popular Brisbane and Gold Coast landmarks. Stadiums, universities, beaches, parks and more."><link rel="canonical" href="https://koffeereview.com.au/coffee-near"><link rel="icon" href="/logo.webp"><link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:"DM Sans",sans-serif;background:#0a0a0c;color:#d4d4d4;min-height:100vh;-webkit-font-smoothing:antialiased}.c{max-width:600px;margin:0 auto;padding:0 20px 40px}.header{display:flex;align-items:center;justify-content:center;padding:18px 0;border-bottom:1px solid rgba(230,192,115,0.06)}.header a{display:flex;align-items:center;gap:10px;text-decoration:none}.header img{width:36px;height:36px;border-radius:50%;border:1.5px solid rgba(230,192,115,0.25)}.header span{font-family:"Bebas Neue",sans-serif;font-size:16px;letter-spacing:4px;color:#E6C073}.hero{text-align:center;padding:28px 0 14px}h1{font-family:"Bebas Neue",sans-serif;font-size:clamp(28px,7vw,42px);letter-spacing:4px;color:#fff;margin-bottom:6px;line-height:1}.hero-sub{font-size:13px;color:rgba(255,255,255,0.4);line-height:1.6}.gold-line{height:1px;background:linear-gradient(90deg,transparent,rgba(230,192,115,0.35),transparent);margin:14px 0}.city-label{font-family:"Bebas Neue",sans-serif;font-size:12px;letter-spacing:4px;color:rgba(255,255,255,0.25);margin:20px 0 10px 2px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.lc{display:flex;align-items:center;gap:10px;padding:14px 16px;background:rgba(255,255,255,0.018);border:1px solid rgba(255,255,255,0.045);border-radius:12px;text-decoration:none;color:inherit;transition:all 0.18s}.lc:hover{border-color:rgba(230,192,115,0.22);background:rgba(255,255,255,0.04);transform:translateY(-1px)}.lc-icon{flex-shrink:0}.lc-name{font-size:13px;font-weight:600;color:#fff;flex:1}.lc-arrow{font-size:13px;color:rgba(230,192,115,0.4);flex-shrink:0}.ft{margin-top:32px;text-align:center}.ft a{font-size:11px;color:rgba(255,255,255,0.4);text-decoration:none}.ft a:hover{color:#E6C073}@media(max-width:480px){.grid{grid-template-columns:1fr}}</style></head><body><div class="c"><div class="header"><a href="/"><img src="/logo.webp" alt="Koffee Review"><span>KOFFEE REVIEW</span></a></div><div class="hero"><h1>COFFEE NEAR LANDMARKS</h1><p class="hero-sub">Find the best reviewed cafes near popular spots across Brisbane and Gold Coast.</p></div><div class="gold-line"></div><div class="city-label">BRISBANE</div><div class="grid">' + brisCards + '</div><div class="city-label">GOLD COAST</div><div class="grid">' + gcCards + '</div><div class="ft"><a href="/explore">Back to Explore</a></div></div></body></html>');
    }
    
    var lm = LANDMARKS[landmark];
    var controller = new AbortController();
    var timeoutId = setTimeout(function() { controller.abort(); }, 10000);
    var response = await fetch(SHEET_URL, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!response.ok) throw new Error("Sheet fetch failed");
    
    var text = await response.text();
    var cafes = parseCSV(text);
    
    // Find cafes with geo data, calculate distance, sort by distance
    var nearby = cafes.filter(function(c) { return c.lat && c.lng && Math.abs(c.lat) > 1; })
      .map(function(c) { c._dist = haversine(lm.lat, lm.lng, c.lat, c.lng); return c; })
      .sort(function(a, b) { return a._dist - b._dist; })
      .slice(0, 15);
    
    if (nearby.length === 0) throw new Error("No cafes with geo data found");
    
    // Best by score (for FAQ) vs nearest by distance (for list)
    var bestNearby = nearby.slice().sort(function(a, b) { return b.score - a.score; })[0];
    
    var title = "Best Coffee Near " + lm.name + " 2026 | Koffee Review";
    var desc = "Top " + nearby.length + " cafes near " + lm.name + ", " + lm.city + " ranked by score. Honest reviews by Koffee Review.";
    var canonical = "https://koffeereview.com.au/coffee-near/" + landmark;
    
    var breadcrumbSchema = JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Koffee Review","item":"https://koffeereview.com.au"},{"@type":"ListItem","position":2,"name":lm.city,"item":"https://koffeereview.com.au/city/" + lm.city.toLowerCase().replace(/\s+/g, "-")},{"@type":"ListItem","position":3,"name":"Coffee Near " + lm.name,"item":canonical}]});
    
    var faqSchema = JSON.stringify({"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
      {"@type":"Question","name":"Where is the best coffee near " + lm.name + "?","acceptedAnswer":{"@type":"Answer","text":"The highest-rated cafe near " + lm.name + " is " + bestNearby.name + " in " + bestNearby.suburb + " (" + bestNearby.score + "/10), about " + bestNearby._dist.toFixed(1) + " km away."}},
      {"@type":"Question","name":"How many cafes are near " + lm.name + "?","acceptedAnswer":{"@type":"Answer","text":"We found " + nearby.length + " reviewed cafes within walking or short driving distance of " + lm.name + ", " + lm.city + "."}},
      {"@type":"Question","name":"How does Koffee Review rate cafes?","acceptedAnswer":{"@type":"Answer","text":"We order one latte and one double espresso at every cafe. Same order, same size, every time. No sponsorships, no freebies."}}
    ]});
    
    var cafeCards = nearby.map(function(c) {
      var col = getScoreColor(c.score);
      return '<a href="/review/' + makeSlug(c.name, c.suburb) + '" style="display:flex;align-items:center;gap:14px;padding:16px;background:rgba(255,255,255,0.03);border:1px solid ' + col + '22;border-radius:14px;text-decoration:none;color:inherit;margin-bottom:10px;transition:all 0.2s"><div style="width:54px;height:54px;border-radius:50%;border:2px solid ' + col + ';display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:700;color:' + col + ';flex-shrink:0">' + c.score.toFixed(1) + '</div><div style="flex:1;min-width:0"><div style="font-weight:600;font-size:15px;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + escapeHtml(c.name) + '</div><div style="font-size:12px;color:' + col + ';opacity:0.7;margin-top:2px">' + escapeHtml(c.suburb) + ', ' + escapeHtml(c.city) + ' · ' + escapeHtml(c.price) + '</div><div style="display:inline-block;padding:2px 8px;border-radius:6px;font-size:9px;font-weight:700;letter-spacing:1.5px;margin-top:4px;color:' + col + ';border:1px solid ' + col + '">' + getVerdict(c.score) + '</div></div><div style="font-size:12px;color:rgba(255,255,255,0.4);flex-shrink:0;text-align:right"><div style="font-weight:600">' + c._dist.toFixed(1) + '</div><div style="font-size:10px">km</div></div></a>';
    }).join("");
    
    // Other landmarks for internal linking
    var otherLandmarks = Object.keys(LANDMARKS).filter(function(k) { return k !== landmark && LANDMARKS[k].city === lm.city; }).slice(0, 6).map(function(k) {
      return '<a href="/coffee-near/' + k + '" style="padding:10px 14px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:10px;color:#E6C073;text-decoration:none;font-size:13px">' + LANDMARKS[k].name + '</a>';
    }).join("");
    
    var html = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + escapeHtml(title) + '</title><meta name="description" content="' + escapeHtml(desc) + '"><link rel="canonical" href="' + canonical + '"><meta name="robots" content="index,follow"><link rel="alternate" hreflang="en-AU" href="' + canonical + '"><meta property="og:title" content="' + escapeHtml(title) + '"><meta property="og:description" content="' + escapeHtml(desc) + '"><meta property="og:url" content="' + canonical + '"><meta property="og:image" content="https://koffeereview.com.au/logo.webp"><meta name="twitter:card" content="summary_large_image"><script type="application/ld+json">' + breadcrumbSchema + '</script><script type="application/ld+json">' + faqSchema + '</script><link rel="icon" href="/logo.webp" type="image/webp"><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:"DM Sans",-apple-system,sans-serif;background:#000;color:#fff;line-height:1.6;padding:0 0 60px}.c{max-width:800px;margin:0 auto;padding:0 24px}.bc{padding:16px 0;font-size:12px;color:rgba(255,255,255,0.5)}.bc a{color:#E6C073;text-decoration:none}.hero{padding:24px 0 32px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.06)}.st{font-size:14px;letter-spacing:3px;color:rgba(255,255,255,0.6);margin-bottom:16px;padding-bottom:8px;border-bottom:1px solid rgba(255,255,255,0.08)}footer{margin-top:48px;padding-top:24px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;font-size:11px;color:rgba(255,255,255,0.5)}footer a{color:rgba(255,255,255,0.55);text-decoration:none;margin:0 8px}details{margin-bottom:8px;border:1px solid rgba(255,255,255,0.08);border-radius:10px;overflow:hidden}details[open]{border-color:rgba(230,192,115,0.25)}summary{padding:14px 16px;font-size:14px;font-weight:600;color:#fff;cursor:pointer;list-style:none}summary::-webkit-details-marker{display:none}summary::after{content:"＋";color:#E6C073;font-size:16px;float:right}details[open] summary::after{content:"－"}details p{padding:0 16px 14px;font-size:13px;color:rgba(255,255,255,0.6);line-height:1.6}</style></head><body><div class="c"><nav class="bc"><a href="/">Home</a> · <a href="/city/' + lm.city.toLowerCase().replace(/\s+/g, "-") + '">' + lm.city + '</a> · <span>Near ' + lm.name + '</span></nav><header class="hero"><a href="/" style="display:inline-flex;align-items:center;gap:10px;text-decoration:none;margin-bottom:24px"><img src="/logo.webp" alt="Koffee Review" style="width:40px;height:40px;border-radius:50%"><span style="font-size:14px;letter-spacing:3px;color:#E6C073;font-weight:700">KOFFEE REVIEW</span></a><div style="color:#E6C073;font-size:14px;letter-spacing:2px;font-weight:600;margin-bottom:16px">' + lm.city.toUpperCase() + '</div><h1 style="font-size:36px;letter-spacing:1px;line-height:1;margin-bottom:8px">Best Coffee Near ' + lm.name + '</h1><p style="color:rgba(255,255,255,0.6);font-size:14px;margin-top:8px">' + nearby.length + ' cafés ranked by distance · Updated May 2026</p></header><section style="margin-top:32px"><h2 class="st">NEAREST CAFÉS · RANKED BY DISTANCE</h2>' + cafeCards + '</section>';
    
    // FAQ section
    html += '<section style="margin-top:48px;padding-top:32px;border-top:1px solid rgba(255,255,255,0.08)"><h2 class="st">FREQUENTLY ASKED</h2><details><summary>Where is the best coffee near ' + lm.name + '?</summary><p>The highest-rated cafe near ' + lm.name + ' is ' + escapeHtml(bestNearby.name) + ' in ' + escapeHtml(bestNearby.suburb) + ' (' + bestNearby.score + '/10), about ' + bestNearby._dist.toFixed(1) + ' km away.</p></details><details><summary>How many cafes are near ' + lm.name + '?</summary><p>We found ' + nearby.length + ' reviewed cafes within driving distance of ' + lm.name + ', ' + lm.city + '.</p></details><details><summary>How does Koffee Review rate cafes?</summary><p>We order one latte and one double espresso at every cafe. Same order, same size, every time. No sponsorships, no freebies.</p></details></section>';
    
    // Other landmarks
    if (otherLandmarks) {
      html += '<section style="margin-top:48px;padding-top:32px;border-top:1px solid rgba(255,255,255,0.08)"><h2 class="st">COFFEE NEAR OTHER SPOTS</h2><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:10px">' + otherLandmarks + '</div></section>';
    }
    
    // Footer
    html += '<footer><p style="font-size:11px;color:rgba(255,255,255,0.3);margin-bottom:12px;letter-spacing:1px">Last updated May 2026</p><p>© 2026 Our Fair Dinkum Koffee Review · koffeereview.com.au</p><div style="margin-top:10px"><a href="/about">About</a> · <a href="/disclosure">Disclosure</a> · <a href="/how-we-score">How We Score</a></div><div style="margin-top:14px"><div style="font-size:10px;letter-spacing:3px;color:rgba(255,255,255,0.55);font-weight:700;margin-bottom:8px">EXPLORE</div><div style="display:flex;gap:8px;justify-content:center"><a href="/best-latte-brisbane" style="font-size:11px;color:rgba(255,255,255,0.55);text-decoration:none">Best Latte</a><span style="color:rgba(255,255,255,0.2)">·</span><a href="/hidden-gem-cafes-brisbane" style="font-size:11px;color:rgba(255,255,255,0.55);text-decoration:none">Hidden Gems</a><span style="color:rgba(255,255,255,0.2)">·</span><a href="/worst-cafes-by-suburb" style="font-size:11px;color:rgba(255,255,255,0.55);text-decoration:none">Worst Cafés</a><span style=\"color:rgba(255,255,255,0.2)\">·</span><a href=\"/blog\" style=\"font-size:11px;color:rgba(255,255,255,0.55);text-decoration:none\">Blog</a></div></div></footer></div></body></html>';
    
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    res.status(200).send(html);
    
  } catch (error) {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(500).send('<!DOCTYPE html><html><head><title>Error</title></head><body style="background:#000;color:#fff;text-align:center;padding:60px;font-family:sans-serif"><h1>Something went wrong</h1><p><a href="/" style="color:#E6C073">← Back</a></p></body></html>');
  }
}
