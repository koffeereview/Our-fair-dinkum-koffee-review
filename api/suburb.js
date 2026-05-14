const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYEU8Khk3R5I879v3FcXPqhq0aCXa2ZWM1BwwJOyUitx2Boak_AFTOkwvB8qQrKIeU55NM4htFjHbI/pub?gid=0&single=true&output=csv";

function makeSlug(name, suburb) {
  return (name + "-" + suburb)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function suburbToSlug(suburb) {
  return String(suburb || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function toTitleCase(str) {
  return (str || "").split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
}

function escapeHtml(str) {
  return (str || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
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

// PROPER CSV PARSER — handles quoted commas
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
  const lines = text.split("\n").filter(line => line.trim());
  if (lines.length < 2) return [];
  
  const headers = splitCSVLine(lines[0]).map(h => h.trim().toLowerCase());
  const nameIdx = headers.indexOf("name");
  const suburbIdx = headers.indexOf("suburb");
  const cityIdx = headers.indexOf("city");
  const scoreIdx = headers.indexOf("score");
  const priceIdx = headers.indexOf("price");
  const notesIdx = headers.indexOf("notes");
  
  if (nameIdx === -1 || suburbIdx === -1) return [];
  
  return lines.slice(1).map(line => {
    const parts = splitCSVLine(line);
    return {
      name: parts[nameIdx] || "",
      suburb: parts[suburbIdx] || "",
      city: parts[cityIdx] || "",
      score: parseFloat(parts[scoreIdx]) || 0,
      price: parts[priceIdx] || "$$$",
      notes: parts[notesIdx] || ""
    };
  }).filter(cafe => cafe.name && cafe.suburb);
}

export default async function handler(req, res) {
  try {
    const { suburb } = req.query;
    
    if (!suburb) {
      return res.status(400).send("Suburb parameter required");
    }
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    const response = await fetch(SHEET_URL, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    if (!response.ok) throw new Error(`Sheet fetch failed: ${response.status}`);
    
    const text = await response.text();
    const cafes = parseCSV(text);
    
    // BRUTE-FORCE MATCHING — strip everything except letters/numbers and compare
    const slugNorm = suburb.toLowerCase().replace(/[^a-z0-9]/g, "");
    
    let filtered = cafes.filter(function(c) {
      var subOnly = (c.suburb || "").toLowerCase().replace(/[^a-z0-9]/g, "");
      if (subOnly === slugNorm) return true;
      var subCity = subOnly + ((c.city || "").toLowerCase().replace(/[^a-z0-9]/g, ""));
      if (subCity === slugNorm) return true;
      return false;
    });
    
    if (filtered.length === 0) {
      var allSuburbs = [...new Set(cafes.map(function(c) { return c.suburb; }))].sort();
      var suggestionList = allSuburbs.slice(0, 20).map(function(s) {
        var cafeInSub = cafes.find(function(c) { return c.suburb === s; });
        var cityPart = cafeInSub && cafeInSub.city ? "-" + suburbToSlug(cafeInSub.city) : "";
        return '<a href="/suburb/' + suburbToSlug(s) + cityPart + '" style="color:#E6C073;text-decoration:none;display:inline-block;padding:6px 12px;border:1px solid rgba(230,192,115,0.3);border-radius:20px;margin:4px">' + escapeHtml(s) + '</a>';
      }).join("");
      
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      return res.status(404).send('<!DOCTYPE html><html><head><title>Suburb Not Found - Koffee Review</title><meta name="robots" content="noindex"></head><body style="font-family:sans-serif;background:#000;color:#fff;text-align:center;padding:60px 24px;max-width:800px;margin:0 auto"><h1 style="color:#E6C073">Suburb not found</h1><p style="color:rgba(255,255,255,0.6);margin:16px 0">Searched: ' + escapeHtml(suburb) + ' (norm: ' + slugNorm + ')</p><p style="margin-top:32px;color:rgba(255,255,255,0.5);font-size:14px">Try one of these:</p><div style="margin-top:16px">' + suggestionList + '</div><p style="margin-top:32px"><a href="/" style="color:#E6C073">&larr; Back to Koffee Review</a></p></body></html>');
    }
    
    filtered.sort((a, b) => b.score - a.score);
    
    const suburbName = toTitleCase(filtered[0].suburb);
    const cityName = toTitleCase(filtered[0].city || "Brisbane");
    const cityLower = cityName.toLowerCase().replace(/\s+/g, "-");
    const suburbSlug = suburbToSlug(filtered[0].suburb);
    const topCafe = filtered[0];
    const avgScore = (filtered.reduce((sum, c) => sum + c.score, 0) / filtered.length).toFixed(1);
    
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://koffeereview.com.au/" },
        { "@type": "ListItem", "position": 2, "name": cityName, "item": `https://koffeereview.com.au/city/${cityLower}` },
        { "@type": "ListItem", "position": 3, "name": suburbName, "item": `https://koffeereview.com.au/suburb/${suburbSlug}` }
      ]
    };
    
    const itemListSchema = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": `Best Cafés in ${suburbName}`,
      "description": `${filtered.length} cafés reviewed in ${suburbName}, ${cityName} by Our Fair Dinkum Koffee Review`,
      "numberOfItems": filtered.length,
      "itemListElement": filtered.slice(0, 20).map((cafe, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "item": {
          "@type": ["LocalBusiness", "CafeOrCoffeeShop"],
          "name": cafe.name,
          "url": `https://koffeereview.com.au/review/${makeSlug(cafe.name, cafe.suburb)}`,
          "address": {
            "@type": "PostalAddress",
            "addressLocality": suburbName,
            "addressRegion": cityName === "Brisbane" || cityName === "Gold Coast" || cityName === "Sunshine Coast" ? "QLD" : "VIC",
            "addressCountry": "AU"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": cafe.score.toString(),
            "bestRating": "10",
            "worstRating": "0",
            "reviewCount": "1"
          },
          "priceRange": cafe.price
        }
      }))
    };
    
    const title = `Best Cafés in ${suburbName}, ${cityName} 2026 (${filtered.length} Reviewed) | Koffee Review`;
    const description = `Honest reviews of ${filtered.length} cafés in ${suburbName}, ${cityName}. Top pick: ${topCafe.name} (${topCafe.score}/10). Same order every time — one latte, one double espresso.`;
    const canonical = `https://koffeereview.com.au/suburb/${suburbSlug}`;
    
    // FAQ SCHEMA + DATA
    const mustVisit = filtered.filter(c => c.score >= 7.5).length;
    const avoidCount = filtered.filter(c => c.score < 5).length;
    const priceRange = filtered.map(c => c.price).filter(Boolean);
    const mostCommonPrice = priceRange.length > 0 ? priceRange.sort((a,b) => priceRange.filter(v => v===a).length - priceRange.filter(v => v===b).length).pop() : "$$$";
    
    const faqs = [
      {
        q: `What is the best café in ${suburbName}, ${cityName}?`,
        a: `Based on our reviews, ${topCafe.name} is the top-rated café in ${suburbName} with a score of ${topCafe.score}/10.${topCafe.notes ? ' Our take: "' + topCafe.notes.substring(0, 100) + (topCafe.notes.length > 100 ? '...' : '') + '"' : ''}`
      },
      {
        q: `How many cafés have been reviewed in ${suburbName}?`,
        a: `We have reviewed ${filtered.length} cafés in ${suburbName}, ${cityName}. The average score is ${avgScore}/10.${mustVisit > 0 ? ` ${mustVisit} of these are rated Must Visit (7.5+).` : ''}`
      },
      {
        q: `What is the average coffee score in ${suburbName}?`,
        a: `The average score across ${filtered.length} cafés in ${suburbName} is ${avgScore}/10. Scores range from ${filtered[filtered.length-1].score}/10 to ${topCafe.score}/10.`
      },
      {
        q: `Are there any cafés to avoid in ${suburbName}?`,
        a: avoidCount > 0 ? `Yes, ${avoidCount} café${avoidCount > 1 ? 's' : ''} in ${suburbName} scored below 5.0/10 in our reviews. Check the full list above for details.` : `No — all ${filtered.length} cafés in ${suburbName} scored 5.0 or above in our reviews.`
      },
      {
        q: `How does Koffee Review rate cafés in ${suburbName}?`,
        a: `We order the same thing at every café — one latte and one double espresso. We score on taste, consistency, and value. No freebies, no sponsorships, no exceptions.`
      }
    ];
    
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(f => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": { "@type": "Answer", "text": f.a }
      }))
    };
    
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="canonical" href="${canonical}">
  <meta name="robots" content="index, follow">
  
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:type" content="website">
  <meta property="og:image" content="https://koffeereview.com.au/logo.webp">
  <meta property="og:site_name" content="Our Fair Dinkum Koffee Review">
  
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="https://koffeereview.com.au/logo.webp">
  
  <link rel="icon" href="/logo.webp" type="image/webp">
  
  <script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>
  <script type="application/ld+json">${JSON.stringify(itemListSchema)}</script>
  <script type="application/ld+json">${JSON.stringify(faqSchema)}</script>
  
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:'DM Sans',-apple-system,BlinkMacSystemFont,sans-serif;background:#000;color:#fff;line-height:1.6;padding:0 0 60px}
    .container{max-width:800px;margin:0 auto;padding:0 24px}
    .breadcrumbs{padding:16px 0;font-size:12px;color:rgba(255,255,255,0.5)}
    .breadcrumbs a{color:#E6C073;text-decoration:none}
    .breadcrumbs a:hover{text-decoration:underline}
    .hero{padding:24px 0 32px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.06)}
    .logo{display:inline-flex;align-items:center;gap:10px;margin-bottom:24px}
    .logo img{width:40px;height:40px;border-radius:50%}
    .logo-text{font-family:'Bebas Neue',sans-serif;font-size:14px;letter-spacing:3px;color:#E6C073}
    h1{font-family:'Bebas Neue',Impact,sans-serif;font-size:40px;letter-spacing:1px;margin-bottom:8px;line-height:1}
    .city-tag{color:#E6C073;font-size:14px;letter-spacing:2px;font-weight:600;margin-bottom:16px}
    .stats{display:flex;justify-content:center;gap:24px;margin-top:16px;flex-wrap:wrap}
    .stat{text-align:center}
    .stat-num{font-family:'Bebas Neue',sans-serif;font-size:28px;color:#E6C073}
    .stat-label{font-size:10px;letter-spacing:2px;color:rgba(255,255,255,0.5);margin-top:2px}
    .top-pick{background:linear-gradient(135deg,rgba(230,192,115,0.1),rgba(230,192,115,0.03));border:1px solid rgba(230,192,115,0.3);border-radius:16px;padding:20px;margin-top:24px;text-align:left}
    .top-label{font-size:10px;letter-spacing:3px;color:#E6C073;font-weight:700;margin-bottom:8px}
    .top-pick h2{font-size:20px;margin-bottom:4px}
    .top-pick a{color:#fff;text-decoration:none}
    .top-pick a:hover{color:#E6C073}
    .top-meta{font-size:13px;color:rgba(255,255,255,0.5);margin-top:4px}
    .cafes{margin-top:32px}
    .section-title{font-family:'Bebas Neue',sans-serif;font-size:14px;letter-spacing:3px;color:rgba(255,255,255,0.6);margin-bottom:16px;padding-bottom:8px;border-bottom:1px solid rgba(255,255,255,0.08)}
    .cafe-card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:16px;margin-bottom:10px;display:flex;align-items:center;gap:14px;transition:all 0.2s;text-decoration:none;color:inherit}
    .cafe-card:hover{border-color:rgba(230,192,115,0.3);background:rgba(255,255,255,0.05)}
    .score-circle{width:54px;height:54px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Bebas Neue',sans-serif;font-size:20px;flex-shrink:0;border:2px solid currentColor}
    .cafe-info{flex:1;min-width:0}
    .cafe-name{font-weight:600;font-size:15px;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .cafe-loc{font-size:11px;margin-top:2px;opacity:0.7}
    .verdict-pill{display:inline-block;padding:2px 8px;border-radius:6px;font-size:9px;font-weight:700;letter-spacing:1.5px;margin-top:4px;border:1px solid currentColor}
    .related{margin-top:48px;padding-top:32px;border-top:1px solid rgba(255,255,255,0.08)}
    .related-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;margin-top:12px}
    .related-link{padding:12px 14px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:10px;color:#E6C073;text-decoration:none;font-size:13px;transition:all 0.2s}
    .related-link:hover{background:rgba(230,192,115,0.08);border-color:rgba(230,192,115,0.3)}
    footer{margin-top:48px;padding-top:24px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;font-size:11px;color:rgba(255,255,255,0.5)}
    footer a{color:rgba(255,255,255,0.55);text-decoration:none;margin:0 8px}
    footer a:hover{color:#E6C073}
    .explore{margin-top:14px}
    .explore-label{font-size:10px;letter-spacing:3px;color:rgba(255,255,255,0.55);font-weight:700;margin-bottom:8px}
    .faq-section{margin-top:48px;padding-top:32px;border-top:1px solid rgba(255,255,255,0.08)}
    .faq-item{margin-bottom:8px;border:1px solid rgba(255,255,255,0.08);border-radius:10px;overflow:hidden}
    .faq-item[open]{border-color:rgba(230,192,115,0.25)}
    .faq-q{padding:14px 16px;font-size:14px;font-weight:600;color:#fff;cursor:pointer;list-style:none;display:flex;align-items:center;justify-content:space-between}
    .faq-q::-webkit-details-marker{display:none}
    .faq-q::after{content:'＋';color:#E6C073;font-size:16px;flex-shrink:0;margin-left:12px}
    .faq-item[open] .faq-q::after{content:'－'}
    .faq-a{padding:0 16px 14px;font-size:13px;color:rgba(255,255,255,0.6);line-height:1.6}
  </style>
</head>
<body>
  <div class="container">
    <nav class="breadcrumbs">
      <a href="/">Home</a> · <a href="/city/${cityLower}">${cityName}</a> · <span>${suburbName}</span>
    </nav>
    
    <header class="hero">
      <a href="/" class="logo" style="text-decoration:none">
        <img src="/logo.webp" alt="Koffee Review">
        <span class="logo-text">KOFFEE REVIEW</span>
      </a>
      <div class="city-tag">${cityName.toUpperCase()}</div>
      <h1>Best Cafés in ${suburbName}</h1>
      <p style="color:rgba(255,255,255,0.6);font-size:14px;margin-top:8px">Honest reviews. Same order every time.</p>
      
      <div class="stats">
        <div class="stat">
          <div class="stat-num">${filtered.length}</div>
          <div class="stat-label">REVIEWED</div>
        </div>
        <div class="stat">
          <div class="stat-num" style="color:${getScoreColor(parseFloat(avgScore))}">${avgScore}</div>
          <div class="stat-label">AVG SCORE</div>
        </div>
        <div class="stat">
          <div class="stat-num" style="color:${getScoreColor(topCafe.score)}">${topCafe.score}</div>
          <div class="stat-label">HIGHEST</div>
        </div>
      </div>
      
      ${topCafe.score >= 7 ? `
      <div class="top-pick">
        <div class="top-label">⭐ TOP PICK IN ${suburbName.toUpperCase()}</div>
        <a href="/review/${makeSlug(topCafe.name, topCafe.suburb)}">
          <h2>${escapeHtml(topCafe.name)}</h2>
        </a>
        <div class="top-meta">${topCafe.score}/10 · ${escapeHtml(topCafe.price)} · ${escapeHtml(getVerdict(topCafe.score))}</div>
        ${topCafe.notes ? `<p style="font-size:13px;color:rgba(255,255,255,0.7);margin-top:10px;font-style:italic">"${escapeHtml(topCafe.notes.substring(0, 140))}${topCafe.notes.length > 140 ? '...' : ''}"</p>` : ''}
      </div>
      ` : ''}
    </header>
    
    <section class="cafes">
      <h2 class="section-title">ALL ${filtered.length} CAFÉS · RANKED</h2>
      ${filtered.map(cafe => {
        const color = getScoreColor(cafe.score);
        return `
        <a href="/review/${makeSlug(cafe.name, cafe.suburb)}" class="cafe-card">
          <div class="score-circle" style="color:${color}">${cafe.score}</div>
          <div class="cafe-info">
            <div class="cafe-name">${escapeHtml(cafe.name)}</div>
            <div class="cafe-loc" style="color:${color}">${escapeHtml(suburbName)}, ${escapeHtml(cityName)} · ${escapeHtml(cafe.price)}</div>
            <div class="verdict-pill" style="color:${color}">${getVerdict(cafe.score)}</div>
          </div>
        </a>`;
      }).join('')}
    </section>
    
    <section class="related">
      <h2 class="section-title">EXPLORE MORE</h2>
      <div class="related-grid">
        <a href="/best-coffee-${cityLower}" class="related-link">→ Best Coffee in ${cityName}</a>
        <a href="/best-latte-brisbane" class="related-link">→ Best Latte in Brisbane</a>
        <a href="/hidden-gem-cafes-brisbane" class="related-link">→ Hidden Gem Cafés</a>
        <a href="/leaderboard" class="related-link">→ Full Leaderboard</a>
        <a href="/brisbane-cafes-to-avoid" class="related-link">→ Cafés to Avoid</a>
        <a href="/" class="related-link">→ All ${cafes.length} Reviews</a>
      </div>
    </section>
    
    <section class="faq-section">
      <h2 class="section-title">FREQUENTLY ASKED</h2>
      ${faqs.map(f => `
      <details class="faq-item">
        <summary class="faq-q">${escapeHtml(f.q)}</summary>
        <p class="faq-a">${escapeHtml(f.a)}</p>
      </details>`).join('')}
    </section>
    
    <footer>
      <p style="font-size:11px;color:rgba(255,255,255,0.3);margin-bottom:12px;letter-spacing:1px;">Last updated May 2026</p>
      <p>© 2026 Our Fair Dinkum Koffee Review · koffeereview.com.au</p>
      <div style="margin-top:10px">
        <a href="/about">About</a> · <a href="/disclosure">Disclosure</a> · <a href="/how-we-score">How We Score</a> · <a href="/privacy">Privacy</a>
      </div>
      <div class="explore">
        <div class="explore-label">EXPLORE</div>
        <a href="/best-latte-brisbane">Best Latte Brisbane</a> · <a href="/hidden-gem-cafes-brisbane">Hidden Gems</a> · <a href="/worst-cafes-by-suburb">Worst Cafés</a>
      </div>
    </footer>
  </div>
</body>
</html>`;
    
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    res.status(200).send(html);
    
  } catch (error) {
    console.error("Suburb page error:", error.message);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(500).send(`<!DOCTYPE html><html><head><title>Error - Koffee Review</title></head><body style="font-family:sans-serif;background:#000;color:#fff;text-align:center;padding:60px"><h1>Something went wrong</h1><p style="color:rgba(255,255,255,0.5);font-size:13px">${escapeHtml(error.message || '')}</p><p><a href="/" style="color:#E6C073">← Back to Koffee Review</a></p></body></html>`);
  }
}
