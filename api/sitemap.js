const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYEU8Khk3R5I879v3FcXPqhq0aCXa2ZWM1BwwJOyUitx2Boak_AFTOkwvB8qQrKIeU55NM4htFjHbI/pub?gid=0&single=true&output=csv";

function makeSlug(name, suburb) {
  return (name + "-" + suburb)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "");
}

function parseCSV(text) {
  const lines = text.split("\n").filter(line => line.trim());
  if (lines.length < 2) return [];
  
  const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
  const nameIdx = headers.indexOf("name");
  const suburbIdx = headers.indexOf("suburb");
  const cityIdx = headers.indexOf("city");
  const scoreIdx = headers.indexOf("score");
  
  if (nameIdx === -1 || suburbIdx === -1) return [];
  
  return lines.slice(1).map(line => {
    const parts = line.split(",").map(p => p.trim());
    return {
      name: parts[nameIdx] || "",
      suburb: parts[suburbIdx] || "",
      city: parts[cityIdx] || "",
      score: parseFloat(parts[scoreIdx]) || 0
    };
  }).filter(cafe => cafe.name && cafe.suburb);
}

// STATIC PAGES — all key landing pages
const STATIC_PAGES = [
  // Homepage & main
  { url: "https://koffeereview.com.au/", priority: "1.0", changefreq: "daily" },
  
  // Best Coffee by City
  { url: "https://koffeereview.com.au/best-coffee-brisbane", priority: "0.95", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/best-coffee-gold-coast", priority: "0.85", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/best-coffee-sunshine-coast", priority: "0.80", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/best-coffee-melbourne", priority: "0.80", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/best-coffee-moreton-bay", priority: "0.75", changefreq: "weekly" },
  
  // Best Latte
  { url: "https://koffeereview.com.au/best-latte-brisbane", priority: "0.90", changefreq: "weekly" },
  
  // Hidden Gems
  { url: "https://koffeereview.com.au/hidden-gem-cafes-brisbane", priority: "0.90", changefreq: "weekly" },
  
  // Avoid / Worst
  { url: "https://koffeereview.com.au/brisbane-cafes-to-avoid", priority: "0.85", changefreq: "weekly" },
  { url: "https://koffeereview.com.au/worst-cafes-by-suburb", priority: "0.80", changefreq: "weekly" },
  
  // Leaderboard
  { url: "https://koffeereview.com.au/leaderboard", priority: "0.85", changefreq: "daily" },
  
  // Info pages
  { url: "https://koffeereview.com.au/how-we-score", priority: "0.70", changefreq: "monthly" },
  { url: "https://koffeereview.com.au/about", priority: "0.70", changefreq: "monthly" },
  { url: "https://koffeereview.com.au/disclosure", priority: "0.60", changefreq: "monthly" }
];

export default async function handler(req, res) {
  try {
    // FETCH with 10s timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(SHEET_URL, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Sheet fetch failed: ${response.status}`);
    }
    
    const text = await response.text();
    const cafes = parseCSV(text);
    const today = new Date().toISOString().split("T")[0];
    
    // BUILD SITEMAP
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    // 1. STATIC PAGES
    STATIC_PAGES.forEach(page => {
      xml += `  <url>\n`;
      xml += `    <loc>${page.url}</loc>\n`;
      xml += `    <lastmod>${today}</lastmod>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += `  </url>\n`;
    });
    
    // 2. INDIVIDUAL CAFÉ REVIEW PAGES
    cafes.forEach(cafe => {
      const slug = makeSlug(cafe.name, cafe.suburb);
      xml += `  <url>\n`;
      xml += `    <loc>https://koffeereview.com.au/review/${slug}</loc>\n`;
      xml += `    <lastmod>${today}</lastmod>\n`;
      xml += `    <changefreq>monthly</changefreq>\n`;
      xml += `    <priority>${cafe.score >= 7.5 ? "0.7" : "0.6"}</priority>\n`;
      xml += `  </url>\n`;
    });
    
    // 3. DYNAMIC SUBURB PAGES
    const suburbs = [...new Set(cafes.map(c => c.suburb))].filter(Boolean);
    suburbs.forEach(suburb => {
      const slug = makeSlug(suburb, "");
      xml += `  <url>\n`;
      xml += `    <loc>https://koffeereview.com.au/suburb/${slug}</loc>\n`;
      xml += `    <lastmod>${today}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.75</priority>\n`;
      xml += `  </url>\n`;
    });
    
    // 4. DYNAMIC CITY PAGES
    const cities = [...new Set(cafes.map(c => c.city))].filter(Boolean);
    cities.forEach(city => {
      const slug = makeSlug(city, "");
      xml += `  <url>\n`;
      xml += `    <loc>https://koffeereview.com.au/city/${slug}</loc>\n`;
      xml += `    <lastmod>${today}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.70</priority>\n`;
      xml += `  </url>\n`;
    });
    
    xml += "</urlset>";
    
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    res.status(200).send(xml);
    
  } catch (error) {
    console.error("Sitemap error:", error.message);
    
    // FALLBACK SITEMAP — at least return static pages + error info
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    const today = new Date().toISOString().split("T")[0];
    STATIC_PAGES.forEach(page => {
      xml += `  <url>\n    <loc>${page.url}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${page.changefreq}</changefreq>\n    <priority>${page.priority}</priority>\n  </url>\n`;
    });
    
    xml += "</urlset>";
    
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, s-maxage=600, stale-while-revalidate=3600");
    res.status(200).send(xml); // Return 200 with static pages, not 500
  }
}
