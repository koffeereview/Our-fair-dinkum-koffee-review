const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYEU8Khk3R5I879v3FcXPqhq0aCXa2ZWM1BwwJOyUitx2Boak_AFTOkwvB8qQrKIeU55NM4htFjHbI/pub?gid=0&single=true&output=csv";

const SPAIN_CITIES = ["barcelona", "catalonia", "spain"];

function makeSlug(name, suburb) {
  return (name + "-" + suburb).toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
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
  }).filter(function(c) { return c.name && c.score > 0 && !SPAIN_CITIES.includes((c.city || "").toLowerCase()); });
}

function getScoreColor(score) {
  if (score >= 4.0) return "#fb923c";
  return "#f87171";
}

export default async function handler(req, res) {
  try {
    const response = await fetch(SHEET_URL);
    const text = await response.text();
    const allCafes = parseCSV(text);

    const avoidCafes = allCafes
      .filter(function(c) { return c.score < 4.0 && c.score > 0 && c.city.toLowerCase().trim() === "brisbane"; })
      .sort(function(a, b) { return a.score - b.score });

    const title = "Brisbane Cafés to Avoid 2026 | Koffee Review";
    const desc = "Honest list of Brisbane cafés rated below 5 out of 10 by Koffee Review. Real scores, no hype. Know before you go and save your money for cafés that actually deliver.";
    const canonicalUrl = "https://koffeereview.com.au/brisbane-cafes-to-avoid";

    const cafeRows = avoidCafes.map(function(cafe) {
      const slug = makeSlug(cafe.name, cafe.suburb);
      return `<a href="/review/${slug}" style="display:flex;align-items:center;gap:16px;background:rgba(255,255,255,0.03);border:1px solid rgba(248,113,113,0.15);border-radius:14px;padding:16px 20px;margin-bottom:8px;text-decoration:none;color:inherit;position:relative;overflow:hidden;">
        <div style="position:absolute;left:0;top:0;bottom:0;width:4px;background:#f87171;border-radius:14px 0 0 14px;"></div>
        <div style="font-family:'Bebas Neue',sans-serif;font-size:24px;color:#f87171;min-width:48px;text-align:center;margin-left:8px;">${cafe.score.toFixed(1)}</div>
        <div style="flex:1;">
          <div style="font-weight:600;font-size:15px;color:#fff;">${cafe.name}</div>
          <div style="font-size:12px;color:rgba(255,255,255,0.4);margin-top:2px;">${cafe.suburb}, ${cafe.city} · ${cafe.price || ""}</div>
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
  <meta property="og:image" content="https://koffeereview.com.au/logo.webp" />
  <meta property="og:url" content="${canonicalUrl}" />
  <link rel="canonical" href="${canonicalUrl}" />
  <link rel="alternate" hreflang="en-AU" href="${canonicalUrl}" />
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"WebPage","name":"${title}","description":"${desc}","url":"${canonicalUrl}","publisher":{"@type":"Organization","name":"Koffee Review","url":"https://koffeereview.com.au","logo":"https://koffeereview.com.au/logo.webp"}}</script>
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Koffee Review","item":"https://koffeereview.com.au"},{"@type":"ListItem","position":2,"name":"Brisbane","item":"https://koffeereview.com.au/city/brisbane"},{"@type":"ListItem","position":3,"name":"Cafes to Avoid","item":"${canonicalUrl}"}]}</script>
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Which Brisbane cafes should I avoid?","acceptedAnswer":{"@type":"Answer","text":"Based on our reviews, ${avoidCafes.length} Brisbane cafes scored below 5.0 out of 10. We recommend checking our full list before visiting."}},{"@type":"Question","name":"How does Koffee Review identify cafes to avoid?","acceptedAnswer":{"@type":"Answer","text":"We order one latte and one double espresso at every cafe. Cafes scoring below 5.0 out of 10 are listed on our avoid page. No exceptions, no sponsorships."}},{"@type":"Question","name":"Are there good cafes near the ones to avoid?","acceptedAnswer":{"@type":"Answer","text":"Yes. Most suburbs with low-scoring cafes also have great options nearby. Check our suburb pages for better alternatives."}}]}</script>
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
    .hero-tag { display:inline-block; padding:4px 14px; border-radius:20px; font-size:11px; font-weight:700; letter-spacing:2px; background:rgba(248,113,113,0.1); color:#f87171; border:1px solid rgba(248,113,113,0.3); margin-bottom:16px; }
    h1 { font-family:'Bebas Neue',sans-serif; font-size:clamp(28px,5vw,48px); letter-spacing:2px; line-height:1.1; color:#f5e6c8; margin-bottom:12px; }
    .hero p { font-size:15px; color:rgba(255,255,255,0.6); line-height:1.8; max-width:600px; }
    .stats { display:flex; gap:12px; padding:0 24px 24px; max-width:800px; margin:0 auto; flex-wrap:wrap; }
    .stat { background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:12px 16px; flex:1; min-width:100px; }
    .stat-num { font-family:'Bebas Neue',sans-serif; font-size:26px; color:#f87171; line-height:1; }
    .stat-label { font-size:11px; color:rgba(255,255,255,0.4); margin-top:2px; }
    .content { max-width:800px; margin:0 auto; padding:0 24px 40px; }
    .section-title { font-family:'Bebas Neue',sans-serif; font-size:18px; letter-spacing:2px; color:rgba(248,113,113,0.7); margin-bottom:16px; }
    .honesty-box { background:rgba(248,113,113,0.06); border:1px solid rgba(248,113,113,0.2); border-radius:14px; padding:20px; margin-bottom:28px; font-size:14px; color:rgba(255,255,255,0.6); line-height:1.8; }
    .footer { border-top:1px solid rgba(255,255,255,0.06); padding:32px 24px; text-align:center; max-width:800px; margin:0 auto; }
    .footer p { font-size:13px; color:rgba(255,255,255,0.3); margin-bottom:16px; line-height:1.7; }
    .links-row { display:flex; gap:10px; justify-content:center; flex-wrap:wrap; margin-top:16px; }
    .link-btn { padding:10px 20px; border-radius:12px; border:1px solid rgba(255,255,255,0.1); color:rgba(255,255,255,0.5); text-decoration:none; font-size:13px; }
    .link-btn-gold { border-color:rgba(197,157,80,0.3); color:#c8a96e; background:rgba(197,157,80,0.08); }
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
    <div class="hero-tag">HONEST WARNING · BRISBANE</div>
    <h1>Cafés to Avoid in Brisbane</h1>
    <p style="font-size:15px;color:rgba(255,255,255,0.6);line-height:1.9;max-width:640px;">Not every coffee in Brisbane is good and honestly, most are not.</p>
    <p style="font-size:15px;color:rgba(255,255,255,0.55);line-height:1.9;max-width:640px;margin-top:12px;">After reviewing hundreds of cafés across Brisbane, one pattern stands out. A lot of places look great on the outside but the coffee just does not hold up once you actually drink it.</p>
    <p style="font-size:15px;color:rgba(255,255,255,0.55);line-height:1.9;max-width:640px;margin-top:12px;">This page highlights the lowest rated cafés based on real Koffee Review scores. Not hype. Not branding. Just how the cup actually drinks. Every score comes from the same two orders every single time — one latte and one double shot espresso.</p>
    <p style="font-size:15px;color:rgba(255,255,255,0.55);line-height:1.9;max-width:640px;margin-top:12px;">Most coffees in Brisbane sit somewhere in the five to six range. Anything below that usually means something is clearly off. If you have ever had a coffee that looked like a seven but drank like a four, this list will make complete sense.</p>
  </div>

  <div class="stats">
    <div class="stat"><div class="stat-num">${avoidCafes.length}</div><div class="stat-label">Cafés to Avoid</div></div>
    <div class="stat"><div class="stat-num">${avoidCafes.length > 0 ? avoidCafes[0].score.toFixed(1) : "N/A"}</div><div class="stat-label">Lowest Score</div></div>
    <div class="stat"><div class="stat-num">${avoidCafes.length > 0 ? avoidCafes[Math.floor(avoidCafes.length/2)].score.toFixed(1) : "N/A"}</div><div class="stat-label">Median Score</div></div>
  </div>

  <div class="content">

    <div class="honesty-box">
      <div style="font-size:13px;font-weight:700;color:#f87171;letter-spacing:2px;margin-bottom:12px;">WHY SOME CAFÉS DON'T HOLD UP</div>
      <p style="font-size:14px;color:rgba(255,255,255,0.6);line-height:1.9;margin-bottom:12px;">From what we have seen across hundreds of Brisbane visits, low scores usually come down to the same recurring issues.</p>
      <div style="display:flex;flex-direction:column;gap:8px;">
        <div style="display:flex;align-items:flex-start;gap:10px;font-size:14px;color:rgba(255,255,255,0.55);line-height:1.7;"><span style="color:#f87171;font-weight:700;flex-shrink:0;">✕</span>Weak coffee that gets masked by milk so you barely taste the espresso underneath</div>
        <div style="display:flex;align-items:flex-start;gap:10px;font-size:14px;color:rgba(255,255,255,0.55);line-height:1.7;"><span style="color:#f87171;font-weight:700;flex-shrink:0;">✕</span>Burnt or bitter extraction that leaves a harsh aftertaste from start to finish</div>
        <div style="display:flex;align-items:flex-start;gap:10px;font-size:14px;color:rgba(255,255,255,0.55);line-height:1.7;"><span style="color:#f87171;font-weight:700;flex-shrink:0;">✕</span>No balance or clean finish — the cup just falls flat and does not linger</div>
        <div style="display:flex;align-items:flex-start;gap:10px;font-size:14px;color:rgba(255,255,255,0.55);line-height:1.7;"><span style="color:#f87171;font-weight:700;flex-shrink:0;">✕</span>Inconsistency between visits — good one day, completely different the next</div>
      </div>
      <p style="font-size:14px;color:rgba(255,255,255,0.4);line-height:1.9;margin-top:12px;">A lot of places in Brisbane put heavy focus on aesthetics and branding. The fit out looks amazing. The cups are great. The vibe is strong. But the actual coffee in the cup does not match any of it.</p>
    </div>

    <div class="section-title">LOWEST RATED CAFÉS IN BRISBANE</div>
    ${cafeRows.length > 0 ? cafeRows : '<p style="color:rgba(255,255,255,0.3);text-align:center;padding:40px;">No Brisbane cafés currently below 5.0</p>'}

    <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:28px;margin-top:32px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:18px;letter-spacing:2px;color:rgba(197,157,80,0.8);margin-bottom:16px;">FINAL THOUGHTS</div>
      <p style="font-size:14px;color:rgba(255,255,255,0.6);line-height:1.9;margin-bottom:12px;">Not every low score means a place is terrible overall. But it does mean the coffee did not deliver on the day we visited. And when we order the same thing every single time, that consistency is the whole point.</p>
      <p style="font-size:14px;color:rgba(255,255,255,0.55);line-height:1.9;margin-bottom:12px;">Brisbane has a genuinely strong coffee scene. There are some world class cups being pulled in this city. But consistency is still hit or miss across the board and the gap between the best and worst is wider than most people realise.</p>
      <p style="font-size:14px;color:rgba(255,255,255,0.55);line-height:1.9;">If you are chasing a safe and reliable cup, it is always better to stick with places that consistently score above 7.0. The difference is noticeable every single time.</p>
    </div>
  </div>

  <div class="footer">
    <p style="font-size:13px;color:rgba(255,255,255,0.3);margin-bottom:16px;line-height:1.7;">All scores based on one latte and one double shot espresso, ordered the same way every time.<br/>
    <a href="/how-we-score.html" style="color:#c8a96e;">Read how we score →</a></p>
    <div class="links-row">
      <a href="/best-coffee-brisbane" class="link-btn link-btn-gold">Best Coffee Brisbane →</a>
      <a href="/city/brisbane" class="link-btn">All Brisbane Cafés</a>
      <a href="/leaderboard" class="link-btn">Top 10 Australia</a>
      <a href="https://koffeereview.com.au" class="link-btn">Browse All Reviews</a>
    </div>
    <div style="margin-top:20px;text-align:center;">
      <div style="font-size:10px;letter-spacing:3px;color:rgba(255,255,255,0.55);font-weight:700;margin-bottom:8px;">EXPLORE</div>
      <div style="display:flex;gap:8px;justify-content:center;flex-wrap:nowrap;">
        <a href="/best-latte-brisbane" style="font-size:11px;color:rgba(255,255,255,0.55);text-decoration:none;white-space:nowrap;">Best Latte</a>
        <span style="color:rgba(255,255,255,0.2);">·</span>
        <a href="/hidden-gem-cafes-brisbane" style="font-size:11px;color:rgba(255,255,255,0.55);text-decoration:none;white-space:nowrap;">Hidden Gems</a>
        <span style="color:rgba(255,255,255,0.2);">·</span>
        <a href="/worst-cafes-by-suburb" style="font-size:11px;color:rgba(255,255,255,0.55);text-decoration:none;white-space:nowrap;">Worst Cafés</a>
        <span style="color:rgba(255,255,255,0.2);">·</span>
        <a href="/blog" style="font-size:11px;color:rgba(255,255,255,0.55);text-decoration:none;white-space:nowrap;">Blog</a>
      </div>
    </div>
  </div>
</body>
</html>`;

    res.setHeader("Content-Type", "text/html");
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    res.status(200).send(html);
  } catch (error) {
    res.status(500).send("Error loading page");
  }
}
