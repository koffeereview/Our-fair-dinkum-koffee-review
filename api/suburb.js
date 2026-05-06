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
  const verdictIdx = headers.indexOf("verdict");
  const priceIdx = headers.indexOf("price");
  const notesIdx = headers.indexOf("notes");
  
  if (nameIdx === -1 || suburbIdx === -1) return [];
  
  return lines.slice(1).map(line => {
    const parts = line.split(",").map(p => p.trim());
    return {
      name: parts[nameIdx] || "",
      suburb: parts[suburbIdx] || "",
      city: parts[cityIdx] || "",
      score: parseFloat(parts[scoreIdx]) || 0,
      verdict: parts[verdictIdx] || "",
      price: parts[priceIdx] || "$$$",
      notes: parts[notesIdx] || ""
    };
  }).filter(cafe => cafe.name && cafe.suburb);
}

export default async function handler(req, res) {
  try {
    const { suburb } = req.query;
    
    if (!suburb) {
      return res.status(400).json({ error: "Suburb parameter required" });
    }
    
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
    
    // FILTER by suburb (case-insensitive, slug-safe)
    const suburbSlug = suburb.toLowerCase().replace(/-/g, " ");
    const filtered = cafes.filter(cafe => 
      cafe.suburb.toLowerCase() === suburbSlug
    );
    
    if (filtered.length === 0) {
      return res.status(404).json({ 
        error: "Suburb not found", 
        suburb: suburb,
        availableSuburbs: [...new Set(cafes.map(c => c.suburb))].sort()
      });
    }
    
    // SORT by score descending
    filtered.sort((a, b) => b.score - a.score);
    
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    res.status(200).json({
      suburb: filtered[0].suburb,
      count: filtered.length,
      cafes: filtered
    });
    
  } catch (error) {
    console.error("Suburb API error:", error.message);
    
    res.setHeader("Cache-Control", "public, s-maxage=60");
    res.status(500).json({ 
      error: "Internal server error", 
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
