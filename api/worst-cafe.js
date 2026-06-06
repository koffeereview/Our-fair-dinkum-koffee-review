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

function makeSlug(name, suburb) {
  return (name + "-" + suburb).toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
}

function suburbSlug(suburb, city) {
  return (suburb + "-" + city).toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
}

export default async function handler(req, res) {
  try {
    const response = await fetch(SHEET_URL);
    const text = await response.text();
    const cafes = parseCSV(text);

    // Get worst cafe per suburb (below 4.0 only)
    const avoidCafes = cafes.filter(function(c) {
      return c.score < 4.0 && !SPAIN_CITIES.includes((c.city || "").toLowerCase());
    });

    // Group by suburb and get lowest scored
    const worstBySuburb = {};
    avoidCafes.forEach(function(c) {
      const key = (c.suburb + "-" + c.city).toLowerCase().trim();
      if (!worstBySuburb[key] || c.score < worstBySuburb[key].score) {
        worstBySuburb[key] = c;
      }
    });

    const worstList = Object.values(worstBySuburb).sort(function(a, b) { return a.score - b.score; });

    // Check if requesting a specific suburb page
    const suburbKey = req.query.suburb || "";

    if (suburbKey) {
      // Individual suburb worst cafe page
      const cafe = worstList.find(function(c) {
        return suburbSlug(c.suburb, c.city) === suburbKey ||
               suburbSlug(c.suburb, "") === suburbKey;
      });

      if (!cafe) {
        res.status(404).send("Not found");
        return;
      }

      const slug = makeSlug(cafe.name, cafe.suburb);
      const title = "Worst Caf\u00e9 in " + cafe.suburb + " — " + cafe.name + " (" + cafe.score + "/10) | Koffee Review";
      const desc = cafe.name + " in " + cafe.suburb + " scored " + cafe.score + "/10 — the lowest rated caf\u00e9 in the area. Reviewed by Koffee Review. Know before you go.";
      const canonicalUrl = "https://koffeereview.com.au/worst-cafe-" + suburbKey;

      const breadcrumbSchema = JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Koffee Review","item":"https://koffeereview.com.au"},{"@type":"ListItem","position":2,"name":"Brisbane","item":"https://koffeereview.com.au/city/brisbane"},{"@type":"ListItem","position":3,"name":"Worst Cafes by Suburb","item":"https://koffeereview.com.au/worst-cafes-by-suburb"}]});
    const schema = JSON.stringify({"@context":"https://schema.org","@type":"Review","name":title,"description":desc,"url":canonicalUrl,"itemReviewed":{"@type":"FoodEstablishment","name":cafe.name,"address":{"@type":"PostalAddress","addressLocality":cafe.suburb,"addressRegion":cafe.city,"addressCountry":"AU"}},"reviewRating":{"@type":"Rating","ratingValue":cafe.score,"bestRating":"10","worstRating":"0"},"author":{"@type":"Organization","name":"Koffee Review"}});

      const html = "<!DOCTYPE html><html lang=\"en\"><head>" +
        "<meta charset=\"UTF-8\" /><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />" +
        "<title>" + title + "</title>" +
        "<meta name=\"description\" content=\"" + desc + "\" />" +
        "<meta property=\"og:title\" content=\"" + title + "\" />" +
        "<meta property=\"og:description\" content=\"" + desc + "\" />" +
        "<meta property=\"og:image\" content=\"https://koffeereview.com.au/logo.webp\" />" +
        "<link rel=\"alternate\" hreflang=\"en-AU\" href=\"" + canonicalUrl + "\" />" +
      "<link rel=\"canonical\" href=\"" + canonicalUrl + "\" />" +
        "<script type=\"application/ld+json\">" + breadcrumbSchema + "<\/script>" +
      "<script type=\"application/ld+json\">" + schema + "<\/script>" +
        "<link href=\"https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap\" rel=\"stylesheet\" />" +
        "<style>* { margin:0; padding:0; box-sizing:border-box; } body { background:#0a0a0a; color:#fff; font-family:'DM Sans',sans-serif; min-height:100vh; } nav { display:flex; align-items:center; justify-content:space-between; padding:16px 24px; border-bottom:1px solid rgba(255,255,255,0.06); } .nav-logo { display:flex; align-items:center; gap:10px; text-decoration:none; } .nav-logo img { width:36px; height:36px; border-radius:50%; object-fit:cover; } .nav-logo span { font-family:'Bebas Neue',sans-serif; font-size:16px; letter-spacing:2px; background:linear-gradient(135deg,#f5e6c8,#c8a96e); -webkit-background-clip:text; -webkit-text-fill-color:transparent; } .nav-back { font-size:13px; color:rgba(255,255,255,0.5); text-decoration:none; } .hero { max-width:800px; margin:0 auto; padding:48px 24px 32px; } .score-big { font-family:'Bebas Neue',sans-serif; font-size:80px; color:#f87171; line-height:1; margin-bottom:8px; } h1 { font-family:'Bebas Neue',sans-serif; font-size:clamp(28px,5vw,44px); letter-spacing:2px; line-height:1.1; color:#f87171; margin-bottom:12px; } .hero p { font-size:15px; color:rgba(255,255,255,0.6); line-height:1.8; max-width:600px; margin-bottom:12px; } .notes-box { background:rgba(248,113,113,0.06); border:1px solid rgba(248,113,113,0.2); border-radius:14px; padding:20px 24px; margin:24px 0; } .notes-box p { font-size:15px; color:rgba(255,255,255,0.7); font-style:italic; line-height:1.8; } .content { max-width:800px; margin:0 auto; padding:0 24px 80px; } .footer { border-top:1px solid rgba(255,255,255,0.06); padding:32px 24px; text-align:center; max-width:800px; margin:0 auto; } .footer p { font-size:13px; color:rgba(255,255,255,0.3); margin-bottom:16px; } .browse-btn { display:inline-flex; align-items:center; gap:8px; padding:13px 28px; border-radius:12px; background:linear-gradient(135deg,#c8a96e,#f5e6c8); color:#0a0a0a; font-weight:700; font-size:14px; text-decoration:none; } .browse-btn img { width:22px; height:22px; border-radius:50%; object-fit:cover; }    @media(max-width:480px){body{overflow-x:hidden}div[style*="max-width"]{padding-left:14px!important;padding-right:14px!important;max-width:100vw!important}h1{font-size:clamp(24px,7vw,34px)!important}img{max-width:100%!important;height:auto!important}a[style*="display:flex"]{padding:12px 14px!important;gap:10px!important}}
  </style>" +
        "</head><body>" +
        "<nav><a href=\"https://koffeereview.com.au\" class=\"nav-logo\"><img src=\"/logo.webp\" alt=\"Koffee Review\" /><span>KOFFEE REVIEW</span></a><a href=\"https://koffeereview.com.au\" class=\"nav-back\">\u2190 All Reviews</a></nav>" +
        "<div class=\"hero\">" +
        "<div style=\"font-size:11px;letter-spacing:2px;color:rgba(248,113,113,0.6);margin-bottom:12px;\">WORST CAF\u00c9 IN " + cafe.suburb.toUpperCase() + "</div>" +
        "<div class=\"score-big\">" + cafe.score.toFixed(1) + "</div>" +
        "<h1>" + cafe.name + "</h1>" +
        "<p>" + cafe.suburb + ", " + cafe.city + (cafe.price ? " \u00b7 " + cafe.price : "") + "</p>" +
        "<div class=\"notes-box\"><p>\u201c" + (cafe.notes || "No notes available.") + "\u201d</p></div>" +
        "<p style=\"font-size:13px;color:rgba(255,255,255,0.4);\">Reviewed by Koffee Review. One latte and one double shot espresso, ordered the same way every time.</p>" +
        "</div>" +
        "<div class=\"content\">" +
        "<a href=\"/review/" + slug + "\" style=\"display:flex;align-items:center;justify-content:space-between;padding:16px 20px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:14px;text-decoration:none;color:#c8a96e;font-size:14px;font-weight:600;margin-bottom:16px;\">Read the full review \u2192</a>" +
        "<a href=\"/brisbane-cafes-to-avoid\" style=\"display:flex;align-items:center;justify-content:space-between;padding:16px 20px;background:rgba(248,113,113,0.05);border:1px solid rgba(248,113,113,0.15);border-radius:14px;text-decoration:none;color:#f87171;font-size:14px;font-weight:600;margin-bottom:16px;\">See all Brisbane caf\u00e9s to avoid \u2192</a>" +
        "</div>" +
        "<div class=\"footer\"><p>Know before you go. <a href=\"/how-we-score\" style=\"color:#c8a96e;\">How we score \u2192</a></p>" +
        "<a href=\"https://koffeereview.com.au\" class=\"browse-btn\"><img src=\"/logo.webp\" alt=\"Koffee Review\" />Browse All Reviews</a>" +
        "</div></body></html>";

      res.setHeader("Content-Type", "text/html");
      res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
      res.status(200).send(html);
      return;
    }

    // Main worst cafes index page
    const title = "Worst Caf\u00e9s by Suburb in Brisbane | Koffee Review";
    const desc = "The lowest rated caf\u00e9 from each Brisbane suburb — reviewed and scored by Koffee Review. Avoid these before you visit.";
    const canonicalUrl = "https://koffeereview.com.au/worst-cafes-by-suburb";

    const schema = JSON.stringify({"@context":"https://schema.org","@type":"CollectionPage","name":title,"description":desc,"url":canonicalUrl,"publisher":{"@type":"Organization","name":"Koffee Review","url":"https://koffeereview.com.au"}});

    const rows = worstList.map(function(cafe) {
      const sSlug = suburbSlug(cafe.suburb, cafe.city);
      const cSlug = makeSlug(cafe.name, cafe.suburb);
      return "<a href=\"/worst-cafe-" + sSlug + "\" style=\"display:flex;align-items:center;gap:16px;background:rgba(255,255,255,0.03);border:1px solid rgba(248,113,113,0.15);border-radius:14px;padding:16px 20px;margin-bottom:8px;text-decoration:none;color:inherit;position:relative;overflow:hidden;\">" +
        "<div style=\"position:absolute;left:0;top:0;bottom:0;width:4px;background:#f87171;border-radius:14px 0 0 14px;\"></div>" +
        "<div style=\"font-family:'Bebas Neue',sans-serif;font-size:24px;color:#f87171;min-width:48px;text-align:center;margin-left:8px;\">" + cafe.score.toFixed(1) + "</div>" +
        "<div style=\"flex:1;\">" +
          "<div style=\"font-weight:600;font-size:15px;color:#fff;\">" + cafe.name + "</div>" +
          "<div style=\"font-size:12px;color:rgba(255,255,255,0.4);margin-top:2px;\">Worst in " + cafe.suburb + " \u00b7 " + cafe.city + "</div>" +
        "</div>" +
        "<div style=\"font-size:12px;color:rgba(248,113,113,0.5);\">See \u2192</div>" +
        "</a>";
    }).join("");

    const html = "<!DOCTYPE html><html lang=\"en\"><head>" +
      "<meta charset=\"UTF-8\" /><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />" +
      "<title>" + title + "</title>" +
      "<meta name=\"description\" content=\"" + desc + "\" />" +
      "<link rel=\"alternate\" hreflang=\"en-AU\" href=\"" + canonicalUrl + "\" />" +
      "<link rel=\"canonical\" href=\"" + canonicalUrl + "\" />" +
      "<script type=\"application/ld+json\">" + schema + "<\/script>" +
      "<link href=\"https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap\" rel=\"stylesheet\" />" +
      "<style>* { margin:0; padding:0; box-sizing:border-box; } body { background:#0a0a0a; color:#fff; font-family:'DM Sans',sans-serif; min-height:100vh; } nav { display:flex; align-items:center; justify-content:space-between; padding:16px 24px; border-bottom:1px solid rgba(255,255,255,0.06); } .nav-logo { display:flex; align-items:center; gap:10px; text-decoration:none; } .nav-logo img { width:36px; height:36px; border-radius:50%; object-fit:cover; } .nav-logo span { font-family:'Bebas Neue',sans-serif; font-size:16px; letter-spacing:2px; background:linear-gradient(135deg,#f5e6c8,#c8a96e); -webkit-background-clip:text; -webkit-text-fill-color:transparent; } .nav-back { font-size:13px; color:rgba(255,255,255,0.5); text-decoration:none; } .hero { max-width:800px; margin:0 auto; padding:48px 24px 32px; } .hero-tag { display:inline-block; padding:4px 14px; border-radius:20px; font-size:11px; font-weight:700; letter-spacing:2px; background:rgba(248,113,113,0.1); color:#f87171; border:1px solid rgba(248,113,113,0.3); margin-bottom:16px; } h1 { font-family:'Bebas Neue',sans-serif; font-size:clamp(32px,6vw,52px); letter-spacing:2px; line-height:1.1; color:#f87171; margin-bottom:12px; } .hero p { font-size:15px; color:rgba(255,255,255,0.6); line-height:1.8; max-width:600px; } .content { max-width:800px; margin:0 auto; padding:0 24px 80px; } .section-title { font-family:'Bebas Neue',sans-serif; font-size:20px; letter-spacing:2px; color:#f5e6c8; margin-bottom:16px; margin-top:32px; } .footer { border-top:1px solid rgba(255,255,255,0.06); padding:32px 24px; text-align:center; max-width:800px; margin:0 auto; } .footer p { font-size:13px; color:rgba(255,255,255,0.3); margin-bottom:16px; } .browse-btn { display:inline-flex; align-items:center; gap:8px; padding:13px 28px; border-radius:12px; background:linear-gradient(135deg,#c8a96e,#f5e6c8); color:#0a0a0a; font-weight:700; font-size:14px; text-decoration:none; } .browse-btn img { width:22px; height:22px; border-radius:50%; object-fit:cover; }    @media(max-width:480px){body{overflow-x:hidden}div[style*="max-width"]{padding-left:14px!important;padding-right:14px!important;max-width:100vw!important}h1{font-size:clamp(24px,7vw,34px)!important}img{max-width:100%!important;height:auto!important}a[style*="display:flex"]{padding:12px 14px!important;gap:10px!important}}
  </style>" +
      "</head><body>" +
      "<nav><a href=\"https://koffeereview.com.au\" class=\"nav-logo\"><img src=\"/logo.webp\" alt=\"Koffee Review\" /><span>KOFFEE REVIEW</span></a><a href=\"https://koffeereview.com.au\" class=\"nav-back\">\u2190 All Reviews</a></nav>" +
      "<div class=\"hero\"><div class=\"hero-tag\">BRISBANE \u00b7 AVOID LIST</div><h1>Worst Caf\u00e9s by Suburb</h1>" +
      "<p>The lowest scored caf\u00e9 from each suburb we\u2019ve reviewed. These all scored below 4.0 \u2014 the Koffee Review avoid threshold. Know before you go.</p></div>" +
      "<div class=\"content\"><div class=\"section-title\">ONE SUBURB. ONE VERDICT. AVOID.</div>" + rows + "</div>" +
      "<div class=\"footer\"><p>All scores below 4.0. One latte and one double shot espresso, every visit.<br/><a href=\"/brisbane-cafes-to-avoid\" style=\"color:#f87171;\">See all Brisbane caf\u00e9s to avoid \u2192</a></p>" +
      "<a href=\"https://koffeereview.com.au\" class=\"browse-btn\"><img src=\"/logo.webp\" alt=\"Koffee Review\" />Browse All Reviews</a>" +
      "</div></body></html>";

    res.setHeader("Content-Type", "text/html");
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    res.status(200).send(html);
  } catch (error) {
    res.status(500).send("Error: " + error.message);
  }
}
