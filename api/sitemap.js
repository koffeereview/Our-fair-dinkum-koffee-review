// SITEMAP ROUTER — serves sitemap index or sub-sitemaps based on query param
// /sitemap.xml → sitemap index pointing to sub-sitemaps
// /sitemap.xml?type=static → static pages
// /sitemap.xml?type=reviews → all cafe reviews
// /sitemap.xml?type=suburbs → all suburb pages (3+ cafes)
// /sitemap.xml?type=cities → all city pages

const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYEU8Khk3R5I879v3FcXPqhq0aCXa2ZWM1BwwJOyUitx2Boak_AFTOkwvB8qQrKIeU55NM4htFjHbI/pub?gid=0&single=true&output=csv";

const STATIC_PAGES = [
  { url: "https://koffeereview.com.au/", priority: "1.0", changefreq: "daily" },
  { url: "https://koffeereview.com.au/best-coffee-brisbane", priority: "0.95", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/best-coffee-gold-coast", priority: "0.85", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/best-coffee-sunshine-coast", priority: "0.80", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/best-coffee-melbourne", priority: "0.80", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/best-coffee-moreton-bay", priority: "0.75", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/best-coffee-sydney", priority: "0.80", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/best-coffee-ipswich", priority: "0.70", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/best-coffee-logan", priority: "0.70", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/best-coffee-redland", priority: "0.65", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/best-latte-brisbane", priority: "0.90", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/hidden-gem-cafes-brisbane", priority: "0.90", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/brisbane-cafes-to-avoid", priority: "0.85", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/worst-cafes-by-suburb", priority: "0.80", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/leaderboard", priority: "0.85", changefreq: "daily" },
  { url: "https://koffeereview.com.au/how-we-score", priority: "0.70", changefreq: "monthly" },
  { url: "https://koffeereview.com.au/about", priority: "0.70", changefreq: "monthly" },
  { url: "https://koffeereview.com.au/disclosure", priority: "0.60", changefreq: "monthly" },
  { url: "https://koffeereview.com.au/blog", priority: "0.80", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/map", priority: "0.80", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/compare", priority: "0.70", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/random", priority: "0.70", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/explore", priority: "0.90", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/about", priority: "0.85", changefreq: "monthly" },
  { url: "https://koffeereview.com.au/new", priority: "0.80", changefreq: "daily" },
  // Coffee near landmark pages
  { url: "https://koffeereview.com.au/coffee-near/south-bank", priority: "0.75", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/coffee-near/queen-street-mall", priority: "0.75", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/coffee-near/brisbane-airport", priority: "0.70", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/coffee-near/suncorp-stadium", priority: "0.70", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/coffee-near/brisbane-cbd", priority: "0.75", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/coffee-near/west-village", priority: "0.65", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/coffee-near/eat-street", priority: "0.65", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/coffee-near/the-gabba", priority: "0.70", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/coffee-near/fortitude-valley", priority: "0.70", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/coffee-near/new-farm-park", priority: "0.65", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/coffee-near/mt-coot-tha", priority: "0.65", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/coffee-near/kangaroo-point", priority: "0.65", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/coffee-near/uq-st-lucia", priority: "0.70", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/coffee-near/qut-gardens-point", priority: "0.65", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/coffee-near/roma-street", priority: "0.65", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/coffee-near/howard-smith-wharves", priority: "0.70", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/coffee-near/james-street", priority: "0.65", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/coffee-near/pacific-fair", priority: "0.65", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/coffee-near/surfers-paradise", priority: "0.70", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/coffee-near/burleigh-beach", priority: "0.65", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/compare", priority: "0.75", changefreq: "monthly" },
  { url: "https://koffeereview.com.au/map", priority: "0.85", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/blog/how-to-find-good-coffee", priority: "0.85", changefreq: "monthly" },
  { url: "https://koffeereview.com.au/coffee-near/south-bank", priority: "0.80", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/coffee-near/queen-street-mall", priority: "0.80", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/coffee-near/brisbane-cbd", priority: "0.80", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/coffee-near/fortitude-valley", priority: "0.75", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/coffee-near/james-street", priority: "0.75", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/coffee-near/howard-smith-wharves", priority: "0.75", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/coffee-near/new-farm-park", priority: "0.75", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/coffee-near/suncorp-stadium", priority: "0.70", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/coffee-near/the-gabba", priority: "0.70", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/coffee-near/uq-st-lucia", priority: "0.70", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/coffee-near/surfers-paradise", priority: "0.70", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/coffee-near/burleigh-beach", priority: "0.70", changefreq: "weekly" }
];

function escapeXML(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

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

function safeSlug(str) {
  return String(str || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function safeParse(text) {
  try {
    var lines = String(text || "").split("\n").filter(function(l) { return l && l.trim(); });
    if (lines.length < 2) return [];
    var headers = splitCSVLine(lines[0]).map(function(h) { return String(h || "").trim().toLowerCase(); });
    var nameIdx = headers.indexOf("name");
    var suburbIdx = headers.indexOf("suburb");
    var cityIdx = headers.indexOf("city");
    var scoreIdx = headers.indexOf("score");
    if (nameIdx === -1 || suburbIdx === -1) return [];
    var out = [];
    for (var i = 1; i < lines.length; i++) {
      try {
        var parts = splitCSVLine(lines[i]);
        var name = parts[nameIdx] || "";
        var suburb = parts[suburbIdx] || "";
        if (!name || !suburb) continue;
        out.push({ name: name, suburb: suburb, city: parts[cityIdx] || "", score: parseFloat(parts[scoreIdx]) || 0 });
      } catch (e) {}
    }
    return out;
  } catch (e) { return []; }
}

function buildUrlEntry(url, lastmod, changefreq, priority) {
  return '  <url>\n    <loc>' + escapeXML(url) + '</loc>\n    <lastmod>' + lastmod + '</lastmod>\n    <changefreq>' + changefreq + '</changefreq>\n    <priority>' + priority + '</priority>\n  </url>\n';
}

async function fetchCafes() {
  var controller = new AbortController();
  var timeoutId = setTimeout(function() { controller.abort(); }, 8000);
  var response = await fetch(SHEET_URL, { signal: controller.signal });
  clearTimeout(timeoutId);
  if (!response.ok) return [];
  var text = await response.text();
  return safeParse(text);
}

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");

  var type = req.query.type || "";
  var today = new Date().toISOString().split("T")[0];

  try {
    // SITEMAP INDEX — no type param
    if (!type) {
      var xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
      xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
      xml += '  <sitemap>\n    <loc>https://koffeereview.com.au/sitemap.xml?type=static</loc>\n    <lastmod>' + today + '</lastmod>\n  </sitemap>\n';
      xml += '  <sitemap>\n    <loc>https://koffeereview.com.au/sitemap.xml?type=reviews</loc>\n    <lastmod>' + today + '</lastmod>\n  </sitemap>\n';
      xml += '  <sitemap>\n    <loc>https://koffeereview.com.au/sitemap.xml?type=suburbs</loc>\n    <lastmod>' + today + '</lastmod>\n  </sitemap>\n';
      xml += '  <sitemap>\n    <loc>https://koffeereview.com.au/sitemap.xml?type=cities</loc>\n    <lastmod>' + today + '</lastmod>\n  </sitemap>\n';
      xml += '</sitemapindex>';
      return res.status(200).send(xml);
    }

    // STATIC PAGES
    if (type === "static") {
      var xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
      xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
      for (var i = 0; i < STATIC_PAGES.length; i++) {
        var page = STATIC_PAGES[i];
        xml += buildUrlEntry(page.url, today, page.changefreq, page.priority);
      }
      xml += '</urlset>';
      return res.status(200).send(xml);
    }

    // Everything else needs cafe data
    var cafes = await fetchCafes();

    // REVIEWS
    if (type === "reviews") {
      var xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
      xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
      for (var i = 0; i < cafes.length; i++) {
        try {
          var cafe = cafes[i];
          var slug = safeSlug(cafe.name + "-" + cafe.suburb);
          if (!slug) continue;
          xml += buildUrlEntry('https://koffeereview.com.au/review/' + slug, today, 'monthly', cafe.score >= 7.5 ? '0.7' : '0.6');
        } catch (e) {}
      }
      xml += '</urlset>';
      return res.status(200).send(xml);
    }

    // SUBURBS (3+ cafes only)
    if (type === "suburbs") {
      var suburbCount = {};
      var suburbCity = {};
      for (var i = 0; i < cafes.length; i++) {
        var sub = cafes[i].suburb;
        var cit = cafes[i].city;
        if (!sub) continue;
        var key = sub.toLowerCase();
        suburbCount[key] = (suburbCount[key] || 0) + 1;
        if (!suburbCity[key]) suburbCity[key] = { suburb: sub, city: cit };
      }
      var xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
      xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
      var suburbKeys = Object.keys(suburbCount);
      for (var i = 0; i < suburbKeys.length; i++) {
        try {
          if (suburbCount[suburbKeys[i]] < 1) continue;
          var info = suburbCity[suburbKeys[i]];
          var slug = safeSlug(info.suburb + "-" + info.city);
          if (!slug) continue;
          xml += buildUrlEntry('https://koffeereview.com.au/suburb/' + slug, today, 'weekly', '0.75');
          // Also add neighbourhood guide page for suburbs with 3+ cafes
          if (suburbCount[suburbKeys[i]] >= 3) {
            var gSlug = safeSlug(info.suburb + "-" + info.city + "-coffee");
            if (gSlug) xml += buildUrlEntry('https://koffeereview.com.au/guide/' + gSlug, today, 'weekly', '0.80');
          }
        } catch (e) {}
      }
      xml += '</urlset>';
      return res.status(200).send(xml);
    }

    // CITIES
    if (type === "cities") {
      var citySet = {};
      for (var i = 0; i < cafes.length; i++) {
        var c = cafes[i].city;
        if (c) citySet[c.toLowerCase()] = c;
      }
      var xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
      xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
      var cityKeys = Object.keys(citySet);
      for (var i = 0; i < cityKeys.length; i++) {
        try {
          var slug = safeSlug(citySet[cityKeys[i]]);
          if (!slug) continue;
          xml += buildUrlEntry('https://koffeereview.com.au/city/' + slug, today, 'weekly', '0.70');
        } catch (e) {}
      }
      xml += '</urlset>';
      return res.status(200).send(xml);
    }

    // Unknown type — return index
    return res.status(200).send('<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <sitemap>\n    <loc>https://koffeereview.com.au/sitemap.xml?type=static</loc>\n  </sitemap>\n</sitemapindex>');

  } catch (error) {
    // Fallback — always return something valid
    var xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    for (var i = 0; i < STATIC_PAGES.length; i++) {
      xml += buildUrlEntry(STATIC_PAGES[i].url, today, STATIC_PAGES[i].changefreq, STATIC_PAGES[i].priority);
    }
    xml += '</urlset>';
    return res.status(200).send(xml);
  }
}
