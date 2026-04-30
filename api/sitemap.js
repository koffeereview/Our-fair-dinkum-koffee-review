const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYEU8Khk3R5I879v3FcXPqhq0aCXa2ZWM1BwwJOyUitx2Boak_AFTOkwvB8qQrKIeU55NM4htFjHbI/pub?gid=0&single=true&output=csv";

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
    return obj;
  }).filter(function(c) { return c.name && c.score > 0; });
}

const STATIC_PAGES = [
  { url: "https://koffeereview.com.au/", priority: "1.0", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/cafes.html", priority: "0.9", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/best-coffee-brisbane.html", priority: "0.9", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/best-coffee-brisbane", priority: "0.9", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/best-coffee-gold-coast.html", priority: "0.9", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/best-coffee-gold-coast", priority: "0.9", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/best-coffee-sunshine-coast", priority: "0.8", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/best-coffee-melbourne", priority: "0.8", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/best-coffee-moreton-bay", priority: "0.7", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/best-latte-brisbane", priority: "0.8", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/hidden-gem-cafes-brisbane", priority: "0.8", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/worst-cafes-by-suburb", priority: "0.7", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/brisbane-cafes-to-avoid", priority: "0.8", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/leaderboard", priority: "0.8", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/leaderboard", priority: "0.8", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/how-we-score.html", priority: "0.7", changefreq: "monthly" },
  { url: "https://koffeereview.com.au/disclosure", priority: "0.6", changefreq: "monthly" },
  { url: "https://koffeereview.com.au/about", priority: "0.7", changefreq: "monthly" },
  { url: "https://koffeereview.com.au/coffee-near-me", priority: "0.8", changefreq: "monthly" },
  { url: "https://koffeereview.com.au/privacy", priority: "0.5", changefreq: "yearly" },
  { url: "https://koffeereview.com.au/city/brisbane", priority: "0.9", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/city/gold-coast", priority: "0.8", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/city/moreton-bay", priority: "0.7", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/city/sunshine-coast", priority: "0.7", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/city/ipswich", priority: "0.7", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/city/melbourne", priority: "0.7", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/city/sydney", priority: "0.7", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/city/logan", priority: "0.7", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/city/redland", priority: "0.6", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/suburb/cbd-brisbane", priority: "0.8", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/suburb/newstead-brisbane", priority: "0.7", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/suburb/chermside-brisbane", priority: "0.7", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/suburb/fortitude-valley-brisbane", priority: "0.7", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/suburb/west-end-brisbane", priority: "0.7", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/suburb/south-brisbane-brisbane", priority: "0.7", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/suburb/paddington-brisbane", priority: "0.7", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/suburb/hamilton-brisbane", priority: "0.7", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/suburb/woolloongabba-brisbane", priority: "0.7", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/suburb/upper-mount-gravatt-brisbane", priority: "0.7", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/suburb/burleigh-heads-gold-coast", priority: "0.7", changefreq: "weekly" },
];

export default async function handler(req, res) {
  try {
    const response = await fetch(SHEET_URL);
    const text = await response.text();
    const cafes = parseCSV(text);
    const today = new Date().toISOString().split("T")[0];

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    STATIC_PAGES.forEach(function(page) {
      xml += `  <url>\n    <loc>${page.url}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${page.changefreq}</changefreq>\n    <priority>${page.priority}</priority>\n  </url>\n`;
    });

    cafes.forEach(function(cafe) {
      const slug = makeSlug(cafe.name, cafe.suburb || "");
      xml += `  <url>\n    <loc>https://koffeereview.com.au/review/${slug}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
    });

    xml += "</urlset>";

    res.setHeader("Content-Type", "application/xml");
    res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate");
    res.status(200).send(xml);
  } catch (error) {
    res.status(500).send("Error generating sitemap");
  }
}
