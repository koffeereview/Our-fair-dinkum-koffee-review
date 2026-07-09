export default async function handler(req, res) {
  try {
    var type = req.query.type || "default";
    var title = (req.query.title || "Koffee Review").substring(0, 60);
    var subtitle = (req.query.subtitle || "").substring(0, 80);
    var score = req.query.score || "";
    var verdict = req.query.verdict || "";
    var accent = req.query.accent || "#E6C073";
    var count = req.query.count || "";
    var year = new Date().getFullYear();

    // Score color
    var sc = parseFloat(score) || 0;
    var scoreCol = "#E6C073";
    if (sc >= 9.1) scoreCol = "#ffffff";
    else if (sc >= 8.1) scoreCol = "#4ade80";
    else if (sc >= 7.5) scoreCol = "#2dd4bf";
    else if (sc >= 6.5) scoreCol = "#facc15";
    else if (sc >= 5.5) scoreCol = "#fb923c";
    else if (sc > 0) scoreCol = "#f87171";

    // Word wrap title
    var words = title.split(" ");
    var lines = [];
    var current = "";
    words.forEach(function(w) {
      if ((current + " " + w).length > 22 && current) { lines.push(current); current = w; }
      else { current = current ? current + " " + w : w; }
    });
    if (current) lines.push(current);
    lines = lines.slice(0, 3);

    var titleSVG = lines.map(function(line, i) {
      return '<text x="60" y="' + (220 + i * 65) + '" font-family="sans-serif" font-weight="800" font-size="52" fill="white" letter-spacing="1">' + esc(line) + '</text>';
    }).join("");

    // Score circle (if score provided)
    var scoreCircle = "";
    if (score) {
      scoreCircle = '<circle cx="1060" cy="180" r="80" fill="none" stroke="' + scoreCol + '" stroke-width="4" opacity="0.3"/>'
        + '<circle cx="1060" cy="180" r="60" fill="none" stroke="' + scoreCol + '" stroke-width="3" opacity="0.5"/>'
        + '<text x="1060" y="175" font-family="sans-serif" font-weight="800" font-size="56" fill="' + scoreCol + '" text-anchor="middle" dominant-baseline="middle">' + esc(score) + '</text>'
        + '<text x="1060" y="215" font-family="sans-serif" font-size="16" fill="' + scoreCol + '" text-anchor="middle" opacity="0.6">/10</text>';
      if (verdict) {
        scoreCircle += '<rect x="1005" y="260" width="110" height="24" rx="12" fill="' + scoreCol + '" opacity="0.15"/>'
          + '<text x="1060" y="277" font-family="sans-serif" font-weight="700" font-size="10" fill="' + scoreCol + '" text-anchor="middle" letter-spacing="1.5">' + esc(verdict) + '</text>';
      }
    }

    // Badge (type label)
    var badgeText = type === "blog" ? "BLOG" : type === "city" ? "CITY GUIDE" : type === "suburb" ? "SUBURB" : type === "game" ? "GAME" : type === "roaster" ? "ROASTER" : type === "compare" ? "COMPARISON" : type === "landmark" ? "COFFEE NEAR" : "";
    var badgeSVG = badgeText ? '<rect x="60" y="60" width="' + (badgeText.length * 11 + 24) + '" height="28" rx="14" fill="' + accent + '" opacity="0.15"/><text x="' + (60 + 12) + '" y="79" font-family="sans-serif" font-weight="700" font-size="11" fill="' + accent + '" letter-spacing="2">' + badgeText + '</text>' : '';

    // Subtitle
    var subtitleSVG = subtitle ? '<text x="60" y="' + (220 + lines.length * 65 + 10) + '" font-family="sans-serif" font-size="20" fill="white" opacity="0.45">' + esc(subtitle) + '</text>' : '';

    // Count badge
    var countSVG = count ? '<rect x="60" y="' + (220 + lines.length * 65 + (subtitle ? 40 : 10)) + '" width="' + (count.length * 9 + 24) + '" height="26" rx="13" fill="' + accent + '" opacity="0.1"/><text x="' + (60 + 12) + '" y="' + (220 + lines.length * 65 + (subtitle ? 57 : 27)) + '" font-family="sans-serif" font-weight="600" font-size="12" fill="' + accent + '">' + esc(count) + '</text>' : '';

    var svg = '<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">'
      + '<defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0a0a0c"/><stop offset="100%" stop-color="#111827"/></linearGradient></defs>'
      + '<rect width="1200" height="630" fill="url(#bg)"/>'
      // Top accent line
      + '<rect x="0" y="0" width="1200" height="4" fill="' + accent + '"/>'
      // Left accent line
      + '<rect x="0" y="0" width="3" height="630" fill="' + accent + '" opacity="0.4"/>'
      // Brand
      + '<text x="1070" y="48" font-family="sans-serif" font-weight="700" font-size="14" fill="' + accent + '" text-anchor="end" letter-spacing="3" opacity="0.6">KOFFEE REVIEW</text>'
      // Badge
      + badgeSVG
      // Title
      + titleSVG
      // Subtitle
      + subtitleSVG
      // Count
      + countSVG
      // Score circle
      + scoreCircle
      // Bottom bar
      + '<text x="60" y="580" font-family="sans-serif" font-size="15" fill="white" opacity="0.25">One Latte. One Double Shot. Every Time.</text>'
      + '<text x="60" y="605" font-family="sans-serif" font-size="14" fill="' + accent + '" opacity="0.4">koffeereview.com.au</text>'
      + '</svg>';

    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=604800");
    res.status(200).send(svg);
  } catch (e) {
    res.status(500).send("Error");
  }
}

function esc(s) { return (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
