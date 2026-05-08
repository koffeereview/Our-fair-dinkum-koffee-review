// FULL SITEMAP — proper CSV parsing + XML escaping + cannot 500

const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYEU8Khk3R5I879v3FcXPqhq0aCXa2ZWM1BwwJOyUitx2Boak_AFTOkwvB8qQrKIeU55NM4htFjHbI/pub?gid=0&single=true&output=csv";

const STATIC_PAGES = [
  { url: "https://koffeereview.com.au/", priority: "1.0", changefreq: "daily" },
  { url: "https://koffeereview.com.au/best-coffee-brisbane", priority: "0.95", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/best-coffee-gold-coast", priority: "0.85", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/best-coffee-sunshine-coast", priority: "0.80", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/best-coffee-melbourne", priority: "0.80", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/best-coffee-moreton-bay", priority: "0.75", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/best-latte-brisbane", priority: "0.90", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/hidden-gem-cafes-brisbane", priority: "0.90", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/brisbane-cafes-to-avoid", priority: "0.85", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/worst-cafes-by-suburb", priority: "0.80", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/leaderboard", priority: "0.85", changefreq: "daily" },
  { url: "https://koffeereview.com.au/how-we-score", priority: "0.70", changefreq: "monthly" },
  { url: "https://koffeereview.com.au/about", priority: "0.70", changefreq: "monthly" },
  { url: "https://koffeereview.com.au/disclosure", priority: "0.60", changefreq: "monthly" }
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

function safeSlug(str) {
  return String(str || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function buildStaticXML() {
  const today = new Date().toISOString().split("T")[0];
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  for (let i = 0; i < STATIC_PAGES.length; i++) {
    const page = STATIC_PAGES[i];
    xml += '  <url>\n';
    xml += '    <loc>' + escapeXML(page.url) + '</loc>\n';
    xml += '    <lastmod>' + today + '</lastmod>\n';
    xml += '    <changefreq>' + page.changefreq + '</changefreq>\n';
    xml += '    <priority>' + page.priority + '</priority>\n';
    xml += '  </url>\n';
  }
  xml += '</urlset>';
  return xml;
}

function safeParse(text) {
  try {
    const lines = String(text || "").split("\n").filter(function(l) { return l && l.trim(); });
    if (lines.length < 2) return [];
    const headers = splitCSVLine(lines[0]).map(function(h) { return String(h || "").trim().toLowerCase(); });
    const nameIdx = headers.indexOf("name");
    const suburbIdx = headers.indexOf("suburb");
    const cityIdx = headers.indexOf("city");
    const scoreIdx = headers.indexOf("score");
    if (nameIdx === -1 || suburbIdx === -1) return [];
    const out = [];
    for (let i = 1; i < lines.length; i++) {
      try {
        const parts = splitCSVLine(lines[i]);
        const name = parts[nameIdx] || "";
        const suburb = parts[suburbIdx] || "";
        if (!name || !suburb) continue;
        out.push({
          name: name,
          suburb: suburb,
          city: parts[cityIdx] || "",
          score: parseFloat(parts[scoreIdx]) || 0
        });
      } catch (e) {}
    }
    return out;
  } catch (e) { return []; }
}

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=600, stale-while-revalidate=3600");

  let fallbackXML;
  try { fallbackXML = buildStaticXML(); }
  catch (e) {
    fallbackXML = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>https://koffeereview.com.au/</loc><priority>1.0</priority></url>\n</urlset>';
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(function() { controller.abort(); }, 8000);
    const response = await fetch(SHEET_URL, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) return res.status(200).send(fallbackXML);

    const text = await response.text();
    const cafes = safeParse(text);

    if (!cafes || cafes.length === 0) return res.status(200).send(fallbackXML);

    const today = new Date().toISOString().split("T")[0];
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    for (let i = 0; i < STATIC_PAGES.length; i++) {
      const page = STATIC_PAGES[i];
      xml += '  <url>\n';
      xml += '    <loc>' + escapeXML(page.url) + '</loc>\n';
      xml += '    <lastmod>' + today + '</lastmod>\n';
      xml += '    <changefreq>' + page.changefreq + '</changefreq>\n';
      xml += '    <priority>' + page.priority + '</priority>\n';
      xml += '  </url>\n';
    }

    for (let i = 0; i < cafes.length; i++) {
      try {
        const cafe = cafes[i];
        const slug = safeSlug(cafe.name + "-" + cafe.suburb);
        if (!slug) continue;
        xml += '  <url>\n';
        xml += '    <loc>' + escapeXML('https://koffeereview.com.au/review/' + slug) + '</loc>\n';
        xml += '    <lastmod>' + today + '</lastmod>\n';
        xml += '    <changefreq>monthly</changefreq>\n';
        xml += '    <priority>' + (cafe.score >= 7.5 ? "0.7" : "0.6") + '</priority>\n';
        xml += '  </url>\n';
      } catch (e) {}
    }

    try {
      var suburbCount = {};
      var suburbCity = {};
      for (let i = 0; i < cafes.length; i++) {
        var sub = cafes[i].suburb;
        var cit = cafes[i].city;
        if (!sub) continue;
        var key = sub.toLowerCase();
        suburbCount[key] = (suburbCount[key] || 0) + 1;
        if (!suburbCity[key]) suburbCity[key] = { suburb: sub, city: cit };
      }
      var suburbKeys = Object.keys(suburbCount);
      for (let i = 0; i < suburbKeys.length; i++) {
        try {
          if (suburbCount[suburbKeys[i]] < 3) continue;
          var info = suburbCity[suburbKeys[i]];
          var slug = safeSlug(info.suburb + "-" + info.city);
          if (!slug) continue;
          xml += '  <url>\n';
          xml += '    <loc>' + escapeXML('https://koffeereview.com.au/suburb/' + slug) + '</loc>\n';
          xml += '    <lastmod>' + today + '</lastmod>\n';
          xml += '    <changefreq>weekly</changefreq>\n';
          xml += '    <priority>0.75</priority>\n';
          xml += '  </url>\n';
        } catch (e) {}
      }
    } catch (e) {}

    try {
      const citySet = {};
      for (let i = 0; i < cafes.length; i++) {
        const c = cafes[i].city;
        if (c) citySet[c.toLowerCase()] = c;
      }
      const cities = Object.keys(citySet);
      for (let i = 0; i < cities.length; i++) {
        try {
          const slug = safeSlug(citySet[cities[i]]);
          if (!slug) continue;
          xml += '  <url>\n';
          xml += '    <loc>' + escapeXML('https://koffeereview.com.au/city/' + slug) + '</loc>\n';
          xml += '    <lastmod>' + today + '</lastmod>\n';
          xml += '    <changefreq>weekly</changefreq>\n';
          xml += '    <priority>0.70</priority>\n';
          xml += '  </url>\n';
        } catch (e) {}
      }
    } catch (e) {}

    xml += '</urlset>';

    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    return res.status(200).send(xml);

  } catch (error) {
    return res.status(200).send(fallbackXML);
  }
}
