const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYEU8Khk3R5I879v3FcXPqhq0aCXa2ZWM1BwwJOyUitx2Boak_AFTOkwvB8qQrKIeU55NM4htFjHbI/pub?gid=0&single=true&output=csv";
const SPAIN_CITIES = ["barcelona", "catalonia", "spain"];
const OBVIOUS_SUBURBS = ["cbd", "newstead", "fortitude valley", "south brisbane", "west end", "paddington", "hamilton", "woolloongabba"];

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

export default async function handler(req, res) {
  try {
    const response = await fetch(SHEET_URL);
    const text = await response.text();
    const cafes = parseCSV(text);

    const gems = cafes
      .filter(function(c) {
        return (c.city || "").toLowerCase().trim() === "brisbane" &&
               c.score >= 7.1 &&
               !OBVIOUS_SUBURBS.includes((c.suburb || "").toLowerCase().trim());
      })
      .sort(function(a, b) { return b.score - a.score; });

    const title = "Hidden Gem Caf\u00e9s Brisbane 2026 | Koffee Review";
    const desc = "The best hidden gem caf\u00e9s in Brisbane — great coffee in suburbs nobody talks about. " + gems.length + " caf\u00e9s scoring 7.1+ outside the obvious spots. Reviewed by Koffee Review.";
    const canonicalUrl = "https://koffeereview.com.au/hidden-gem-cafes-brisbane";

    const schema1 = JSON.stringify({"@context":"https://schema.org","@type":"CollectionPage","name":title,"description":desc,"url":canonicalUrl,"publisher":{"@type":"Organization","name":"Koffee Review","url":"https://koffeereview.com.au","logo":"https://koffeereview.com.au/logo.webp"}});
    const schema2 = JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Koffee Review","item":"https://koffeereview.com.au"},{"@type":"ListItem","position":2,"name":"Best Coffee Brisbane","item":"https://koffeereview.com.au/best-coffee-brisbane"},{"@type":"ListItem","position":3,"name":"Hidden Gem Cafes Brisbane","item":canonicalUrl}]});
    const faqData = [
      { q: "What are hidden gem cafes in Brisbane?", a: "Hidden gems are cafes that score well in our reviews but are not widely known. We identify them based on high scores (7.0+) in lesser-known suburbs or quieter locations across Brisbane." },
      { q: "How many hidden gem cafes are there in Brisbane?", a: "We have identified " + gems.length + " hidden gem cafes in Brisbane, all scoring 7.0 or above in our blind reviews." },
      { q: "How does Koffee Review find hidden gems?", a: "We order one latte and one double espresso at every cafe we visit. Hidden gems are cafes that score well but fly under the radar — no hype, no queues, just great coffee." }
    ];
    const schema3 = JSON.stringify({"@context":"https://schema.org","@type":"FAQPage","mainEntity":faqData.map(function(f){return{"@type":"Question","name":f.q,"acceptedAnswer":{"@type":"Answer","text":f.a}}})});

    const rows = gems.map(function(cafe) {
      const color = getScoreColor(cafe.score);
      const slug = makeSlug(cafe.name, cafe.suburb);
      const verdict = cafe.verdict || getVerdict(cafe.score);
      const noteText = cafe.notes ? cafe.notes.substring(0, 80) + (cafe.notes.length > 80 ? "..." : "") : "";
      return "<a href=\"/review/" + slug + "\" style=\"display:flex;align-items:center;gap:16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:16px 20px;margin-bottom:8px;text-decoration:none;color:inherit;position:relative;overflow:hidden;\">" +
        "<div style=\"position:absolute;left:0;top:0;bottom:0;width:4px;background:" + color + ";border-radius:14px 0 0 14px;\"></div>" +
        "<div style=\"font-family:'Bebas Neue',sans-serif;font-size:24px;color:" + color + ";min-width:48px;text-align:center;margin-left:8px;\">" + cafe.score.toFixed(1) + "</div>" +
        "<div style=\"flex:1;\">" +
          "<div style=\"font-weight:600;font-size:15px;color:#fff;\">" + cafe.name + "</div>" +
          "<div style=\"font-size:12px;color:rgba(255,255,255,0.4);margin-top:2px;\">" + cafe.suburb + " \u00b7 " + (cafe.price || "") + "</div>" +
          (noteText ? "<div style=\"font-size:12px;color:rgba(255,255,255,0.45);margin-top:4px;font-style:italic;\">" + noteText + "</div>" : "") +
        "</div>" +
        "<div style=\"padding:4px 12px;border-radius:20px;background:" + color + ";color:#000;font-size:10px;font-weight:700;letter-spacing:2px;flex-shrink:0;\">" + verdict.toUpperCase() + "</div>" +
        "</a>";
    }).join("");

    const html = "<!DOCTYPE html><html lang=\"en\"><head>" +
      "<meta charset=\"UTF-8\" />" +
      "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />" +
      "<title>" + title + "</title>" +
      "<meta name=\"description\" content=\"" + desc + "\" />" +
      "<meta property=\"og:title\" content=\"" + title + "\" />" +
      "<meta property=\"og:description\" content=\"" + desc + "\" />" +
      "<meta property=\"og:image\" content=\"https://koffeereview.com.au/logo.webp\" />" +
      "<meta property=\"og:url\" content=\"" + canonicalUrl + "\" />" +
      "<link rel=\"alternate\" hreflang=\"en-AU\" href=\"" + canonicalUrl + "\" />" +
      "<link rel=\"canonical\" href=\"" + canonicalUrl + "\" />" +
      "<script type=\"application/ld+json\">" + schema1 + "<\/script>" +
      "<script type=\"application/ld+json\">" + schema2 + "<\/script>" +
      "<script type=\"application/ld+json\">" + schema3 + "<\/script>" +
      "<link href=\"https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap\" rel=\"stylesheet\" />" +
      "<style>* { margin:0; padding:0; box-sizing:border-box; } body { background:#0a0a0a; color:#fff; font-family:'DM Sans',sans-serif; min-height:100vh; } nav { display:flex; align-items:center; justify-content:space-between; padding:16px 24px; border-bottom:1px solid rgba(255,255,255,0.06); } .nav-logo { display:flex; align-items:center; gap:10px; text-decoration:none; } .nav-logo img { width:36px; height:36px; border-radius:50%; object-fit:cover; } .nav-logo span { font-family:'Bebas Neue',sans-serif; font-size:16px; letter-spacing:2px; background:linear-gradient(135deg,#f5e6c8,#c8a96e); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }  .hero { max-width:800px; margin:0 auto; padding:48px 24px 32px; } .hero-tag { display:inline-block; padding:4px 14px; border-radius:20px; font-size:11px; font-weight:700; letter-spacing:2px; background:rgba(197,157,80,0.1); color:#c8a96e; border:1px solid rgba(197,157,80,0.3); margin-bottom:16px; } h1 { font-family:'Bebas Neue',sans-serif; font-size:clamp(32px,6vw,52px); letter-spacing:2px; line-height:1.1; background:linear-gradient(135deg,#f5e6c8,#c8a96e); -webkit-background-clip:text; -webkit-text-fill-color:transparent; margin-bottom:12px; } .hero p { font-size:15px; color:rgba(255,255,255,0.6); line-height:1.8; max-width:600px; } .content { max-width:800px; margin:0 auto; padding:0 24px 80px; } .section-title { font-family:'Bebas Neue',sans-serif; font-size:20px; letter-spacing:2px; color:#f5e6c8; margin-bottom:16px; margin-top:32px; } .footer { border-top:1px solid rgba(255,255,255,0.06); padding:32px 24px; text-align:center; max-width:800px; margin:0 auto; } .footer p { font-size:13px; color:rgba(255,255,255,0.3); margin-bottom:16px; line-height:1.7; } .browse-btn { display:inline-flex; align-items:center; gap:8px; padding:13px 28px; border-radius:12px; background:linear-gradient(135deg,#c8a96e,#f5e6c8); color:#0a0a0a; font-weight:700; font-size:14px; text-decoration:none; } .browse-btn img { width:22px; height:22px; border-radius:50%; object-fit:cover; }    @media(max-width:480px){body{overflow-x:hidden}div[style*="max-width"]{padding-left:14px!important;padding-right:14px!important;max-width:100vw!important}h1{font-size:clamp(24px,7vw,34px)!important}img{max-width:100%!important;height:auto!important}a[style*="display:flex"]{padding:12px 14px!important;gap:10px!important}}
  </style>" +
      "<link rel=\"icon\" href=\"/logo.webp\">" +
      "</head><body>" +
      "<nav><a href=\"https://koffeereview.com.au\" class=\"nav-logo\"><img src=\"/logo.webp\" alt=\"Koffee Review\" /><span>KOFFEE REVIEW</span></a><div style=\"display:flex;gap:14px;align-items:center;\"><a href=\"/city/brisbane\" style=\"font-size:12px;color:rgba(255,255,255,0.5);text-decoration:none;\">Brisbane</a><a href=\"/city/gold-coast\" style=\"font-size:12px;color:rgba(255,255,255,0.5);text-decoration:none;\">Gold Coast</a><a href=\"/leaderboard\" style=\"font-size:12px;color:rgba(255,255,255,0.5);text-decoration:none;\">Leaderboard</a><a href=\"/blog\" style=\"font-size:12px;color:rgba(255,255,255,0.5);text-decoration:none;\">Blog</a></div></nav>" +
      "<div class=\"hero\"><div class=\"hero-tag\">BRISBANE \u00b7 HIDDEN GEMS</div><h1>Hidden Gem Caf\u00e9s in Brisbane</h1>" +
      "<p>Everyone knows the CBD spots. These are the caf\u00e9s scoring 7.1 and above in suburbs that don\u2019t get talked about. Great coffee, no hype, no queue. " + gems.length + " Brisbane hidden gems reviewed by Koffee Review.</p></div>" +
      "<div class=\"content\">" +
      "<div class=\"section-title\">GREAT COFFEE OFF THE BEATEN TRACK</div>" +
      rows +
      "</div>" +
      "<div class=\"footer\"><p>All caf\u00e9s scored 7.1 or above. One latte and one double shot espresso, every visit.<br/><a href=\"/how-we-score\" style=\"color:#c8a96e;\">Read how we score \u2192</a></p>" +
      "<a href=\"/best-coffee-brisbane\" class=\"browse-btn\"><img src=\"/logo.webp\" alt=\"Koffee Review\" />See All Brisbane Caf\u00e9s</a>" +
      "<div style=\"display:flex;gap:14px;justify-content:center;flex-wrap:wrap;margin-top:16px;\"><a href=\"/best-coffee-brisbane\" style=\"font-size:12px;color:rgba(255,255,255,0.4);text-decoration:none;\">Best Coffee Brisbane</a><a href=\"/best-latte-brisbane\" style=\"font-size:12px;color:rgba(255,255,255,0.4);text-decoration:none;\">Best Latte Brisbane</a><a href=\"/leaderboard\" style=\"font-size:12px;color:rgba(255,255,255,0.4);text-decoration:none;\">Top 10 Australia</a><a href=\"/brisbane-cafes-to-avoid\" style=\"font-size:12px;color:rgba(255,255,255,0.4);text-decoration:none;\">Caf\u00e9s to Avoid</a></div>" +
      "<div style=\"margin-top:24px;border-top:1px solid rgba(255,255,255,0.06);padding-top:24px;text-align:left;max-width:600px;margin-left:auto;margin-right:auto;\"><div style=\"font-family:'Bebas Neue',sans-serif;font-size:14px;letter-spacing:3px;color:rgba(255,255,255,0.6);margin-bottom:12px;\">FREQUENTLY ASKED</div>" + faqData.map(function(f) { return "<details style=\"margin-bottom:8px;border:1px solid rgba(255,255,255,0.08);border-radius:10px;overflow:hidden;\"><summary style=\"padding:14px 16px;font-size:14px;font-weight:600;color:#fff;cursor:pointer;list-style:none;\">" + f.q + "</summary><p style=\"padding:0 16px 14px;font-size:13px;color:rgba(255,255,255,0.6);line-height:1.6;\">" + f.a + "</p></details>"; }).join("") + "</div><div style=\"margin-top:20px;text-align:center;\"><div style=\"font-size:10px;letter-spacing:3px;color:rgba(255,255,255,0.55);font-weight:700;margin-bottom:8px;\">EXPLORE</div><div style=\"display:flex;gap:8px;justify-content:center;flex-wrap:nowrap;\"><a href=\"/best-latte-brisbane\" style=\"font-size:11px;color:rgba(255,255,255,0.55);text-decoration:none;white-space:nowrap;\">Best Latte</a><span style=\"color:rgba(255,255,255,0.2);\">·</span><a href=\"/hidden-gem-cafes-brisbane\" style=\"font-size:11px;color:rgba(255,255,255,0.55);text-decoration:none;white-space:nowrap;\">Hidden Gems</a><span style=\"color:rgba(255,255,255,0.2);\">·</span><a href=\"/worst-cafes-by-suburb\" style=\"font-size:11px;color:rgba(255,255,255,0.55);text-decoration:none;white-space:nowrap;\">Worst Cafes</a></div></div></div></body></html>";

    res.setHeader("Content-Type", "text/html");
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    res.status(200).send(html);
  } catch (error) {
    res.status(500).send("Error: " + error.message);
  }
}
