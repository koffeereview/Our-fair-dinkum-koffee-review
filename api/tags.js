const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYEU8Khk3R5I879v3FcXPqhq0aCXa2ZWM1BwwJOyUitx2Boak_AFTOkwvB8qQrKIeU55NM4htFjHbI/pub?gid=0&single=true&output=csv";
const SPAIN = ["barcelona","catalonia","spain"];
function esc(s){return(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
function splitCSV(line){var r=[],c="",q=false;for(var i=0;i<line.length;i++){var ch=line[i];if(ch==='"')q=!q;else if(ch===","&&!q){r.push(c.trim());c="";}else c+=ch;}r.push(c.trim());return r;}
function makeSlug(n,s){return(n+"-"+s).toLowerCase().replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-").trim();}
function tagSlug(t){return(t||"").toLowerCase().trim().replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-");}
function tagDisplay(t){return(t||"").trim().split("-").map(function(w){return w.charAt(0).toUpperCase()+w.slice(1);}).join(" ");}
function gc(s){if(s>=9.1)return"#ffffff";if(s>=8.1)return"#4ade80";if(s>=7.5)return"#2dd4bf";if(s>=7.1)return"#2dd4bf";if(s>=6.5)return"#facc15";if(s>=6.1)return"#facc15";if(s>=5.5)return"#fb923c";if(s>=5.1)return"#fb923c";return"#f87171";}
function gv(s){if(s>=9.1)return"ELITE";if(s>=8.1)return"GREAT";if(s>=7.5)return"MUST VISIT";if(s>=7.1)return"SOLID";if(s>=6.5)return"DECENT";if(s>=6.1)return"TAKE OR LEAVE";if(s>=5.5)return"AVERAGE";if(s>=5.1)return"JUST OKAY";if(s>=4.1)return"NOT FOR US";return"AVOID";}

var TAG_ICONS = {
  "dog-friendly":"Dog Friendly","outdoor-seating":"Outdoor Seating","own-roast":"Own Roast",
  "drive-through":"Drive Through","wifi":"WiFi","waterfront":"Waterfront","kid-friendly":"Kid Friendly",
  "late-night":"Late Night","breakfast":"Breakfast","brunch":"Brunch","vegan":"Vegan Options",
  "gluten-free":"Gluten Free","specialty":"Specialty Coffee","filter":"Filter Coffee",
  "cold-brew":"Cold Brew","pour-over":"Pour Over","single-origin":"Single Origin",
  "parking":"Easy Parking","wheelchair":"Wheelchair Accessible","quiet":"Quiet Workspace",
  "group-friendly":"Group Friendly","takeaway":"Takeaway Focus","dine-in":"Dine In",
  "counter-seating":"Counter Seating","rooftop":"Rooftop","garden":"Garden Setting"
};

var TAG_COLORS = {
  "dog-friendly":"#fb923c","outdoor-seating":"#4ade80","own-roast":"#E6C073",
  "drive-through":"#60a5fa","wifi":"#a78bfa","waterfront":"#38bdf8","kid-friendly":"#f472b6",
  "late-night":"#8b5cf6","breakfast":"#facc15","brunch":"#facc15","vegan":"#4ade80",
  "specialty":"#E6C073","filter":"#2dd4bf","cold-brew":"#38bdf8","single-origin":"#E6C073",
  "parking":"#60a5fa","quiet":"#a78bfa"
};

var CSS = '*{margin:0;padding:0;box-sizing:border-box}body{background:#0a0a0c;color:#e2e8f0;font-family:DM Sans,sans-serif;-webkit-font-smoothing:antialiased}.c{max-width:720px;margin:0 auto;padding:0 20px 60px}.nav{display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid rgba(255,255,255,0.06)}.nav-logo{display:flex;align-items:center;gap:10px;text-decoration:none}.nav-logo img{width:34px;height:34px;border-radius:50%}.nav-logo span{font-family:Bebas Neue,sans-serif;font-size:15px;letter-spacing:3px;color:#E6C073}.nav-links{display:flex;gap:14px}.nav-links a{font-size:12px;color:rgba(255,255,255,0.45);text-decoration:none}.ft{margin-top:32px;padding:20px 0;border-top:1px solid rgba(255,255,255,0.04);text-align:center;font-size:11px;color:rgba(255,255,255,0.3)}.ft a{color:rgba(255,255,255,0.5);text-decoration:none;margin:0 8px}';

export default async function handler(req, res) {
  try {
    var tag = req.query.tag || "";
    var response = await fetch(SHEET_URL);
    var text = await response.text();
    var lines = text.split("\n").filter(function(l) { return l.trim(); });
    var h = splitCSV(lines[0]).map(function(x) { return x.trim().toLowerCase(); });
    var ni = h.indexOf("name"), si = h.indexOf("suburb"), ci = h.indexOf("city"), sci = h.indexOf("score"), noi = h.indexOf("notes"), ti = h.indexOf("tags");
    var cafes = [];
    var tagMap = {};

    for (var i = 1; i < lines.length; i++) {
      try {
        var p = splitCSV(lines[i]);
        var n = (p[ni] || "").trim();
        if (!n) continue;
        var sc = parseFloat(p[sci]) || 0;
        if (sc <= 0) continue;
        var city = (p[ci] || "").trim();
        if (SPAIN.indexOf(city.toLowerCase()) !== -1) continue;
        var tags = ti >= 0 ? (p[ti] || "").split(",").map(function(t) { return t.trim().toLowerCase(); }).filter(function(t) { return t; }) : [];
        var cafe = { n: n, s: (p[si] || "").trim(), c: city, sc: sc, nt: ((p[noi] || "").trim()).substring(0, 80), sl: makeSlug(n, (p[si] || "").trim()), tags: tags };
        cafes.push(cafe);
        tags.forEach(function(t) {
          var ts = tagSlug(t);
          if (!tagMap[ts]) tagMap[ts] = { name: t, cafes: [] };
          tagMap[ts].cafes.push(cafe);
        });
      } catch (e) {}
    }

    var year = new Date().getFullYear();
    var NAV = '<nav class="nav"><a href="/" class="nav-logo"><img src="/logo.webp" alt="KR"><span>KOFFEE REVIEW</span></a><div class="nav-links"><a href="/suburbs">Suburbs</a><a href="/explore">Explore</a></div></nav>';
    var FT = '<footer class="ft"><a href="/explore">Explore</a><a href="/suburbs">Suburbs</a><a href="/leaderboard">Leaderboard</a><a href="/blog">Blog</a></footer>';
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");

    // INDEX PAGE — list all tags
    if (!tag) {
      var allTags = Object.keys(tagMap).sort(function(a, b) {
        return tagMap[b].cafes.length - tagMap[a].cafes.length;
      });
      var totalTagged = cafes.filter(function(c) { return c.tags.length > 0; }).length;

      if (allTags.length === 0) {
        return res.status(200).send('<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Browse by Tag | Koffee Review</title><link rel="icon" href="/logo.webp"><link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"><style>' + CSS + '</style></head><body><div class="c">' + NAV
          + '<div style="padding:28px 0 20px"><div style="font-size:10px;letter-spacing:3px;color:rgba(230,192,115,0.5);margin-bottom:8px">BROWSE BY TAG</div>'
          + '<h1 style="font-family:Bebas Neue,sans-serif;font-size:clamp(28px,7vw,44px);letter-spacing:2px;color:#fff">Cafe Tags</h1>'
          + '<p style="font-size:14px;color:rgba(255,255,255,0.45);margin-top:10px;line-height:1.6">Tags are coming soon. We are adding tags like dog-friendly, outdoor seating, own roast, and more to every cafe in our database.</p>'
          + '<p style="font-size:13px;color:rgba(255,255,255,0.35);margin-top:12px">To get started, add a <strong style="color:#E6C073">tags</strong> column to your Google Sheet. Use comma-separated values like: <span style="color:#E6C073">dog-friendly, outdoor, own-roast</span></p></div>'
          + '<div style="margin-top:20px"><a href="/explore" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:rgba(230,192,115,0.03);border:1px solid rgba(230,192,115,0.12);border-radius:14px;text-decoration:none;color:#E6C073;font-size:13px">Explore Koffee Review &rarr;</a></div>'
          + FT + '</div></body></html>');
      }

      var tagCards = allTags.map(function(ts) {
        var t = tagMap[ts];
        var color = TAG_COLORS[ts] || "#E6C073";
        var display = TAG_ICONS[ts] || tagDisplay(ts);
        var avg = t.cafes.reduce(function(sum, c) { return sum + c.sc; }, 0) / t.cafes.length;
        var avgCol = gc(avg);
        var top = t.cafes.sort(function(a, b) { return b.sc - a.sc; })[0];
        return '<a href="/tag/' + ts + '" style="display:flex;align-items:center;gap:14px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;padding:14px 16px;text-decoration:none;color:inherit;transition:border 0.2s" onmouseover="this.style.borderColor=\'' + color + '40\'" onmouseout="this.style.borderColor=\'rgba(255,255,255,0.06)\'">'
          + '<div style="width:42px;height:42px;border-radius:12px;background:' + color + '15;border:1px solid ' + color + '30;display:flex;align-items:center;justify-content:center;flex-shrink:0"><span style="font-family:Bebas Neue,sans-serif;font-size:16px;color:' + color + '">' + t.cafes.length + '</span></div>'
          + '<div style="flex:1;min-width:0"><div style="font-size:15px;font-weight:600;color:#fff">' + esc(display) + '</div>'
          + '<div style="font-size:11px;color:rgba(255,255,255,0.4);margin-top:2px">Avg: <span style="color:' + avgCol + '">' + avg.toFixed(1) + '</span> &middot; Top: ' + esc(top.n) + ' (' + top.sc.toFixed(1) + ')</div></div>'
          + '<div style="font-size:13px;color:rgba(255,255,255,0.2);flex-shrink:0">&rarr;</div></a>';
      }).join("");

      var stats = '<div style="display:flex;gap:0;margin-bottom:24px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:14px;overflow:hidden">'
        + '<div style="flex:1;text-align:center;padding:14px 8px;border-right:1px solid rgba(255,255,255,0.03)"><div style="font-family:Bebas Neue,sans-serif;font-size:26px;color:#E6C073">' + allTags.length + '</div><div style="font-size:9px;letter-spacing:2px;color:rgba(255,255,255,0.3)">TAGS</div></div>'
        + '<div style="flex:1;text-align:center;padding:14px 8px;border-right:1px solid rgba(255,255,255,0.03)"><div style="font-family:Bebas Neue,sans-serif;font-size:26px;color:#E6C073">' + totalTagged + '</div><div style="font-size:9px;letter-spacing:2px;color:rgba(255,255,255,0.3)">TAGGED CAFES</div></div>'
        + '<div style="flex:1;text-align:center;padding:14px 8px"><div style="font-family:Bebas Neue,sans-serif;font-size:26px;color:#E6C073">600+</div><div style="font-size:9px;letter-spacing:2px;color:rgba(255,255,255,0.3)">TOTAL REVIEWED</div></div></div>';

      return res.status(200).send('<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
        + '<title>Browse Cafes by Tag ' + year + ' | Koffee Review</title>'
        + '<meta name="description" content="Find cafes by what matters to you. Dog friendly, outdoor seating, own roast, WiFi, and more. ' + allTags.length + ' tags across 600+ reviewed cafes.">'
        + '<link rel="canonical" href="https://koffeereview.com.au/tags"><link rel="icon" href="/logo.webp">'
        + '<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">'
        + '<style>' + CSS + '</style></head><body><div class="c">' + NAV
        + '<div style="font-size:12px;color:rgba(255,255,255,0.35);padding:12px 0"><a href="/" style="color:#E6C073;text-decoration:none">Home</a> &middot; Tags</div>'
        + '<div style="padding:16px 0 20px"><div style="font-size:10px;letter-spacing:3px;color:rgba(230,192,115,0.5);margin-bottom:8px">BROWSE BY TAG</div>'
        + '<h1 style="font-family:Bebas Neue,sans-serif;font-size:clamp(28px,7vw,44px);letter-spacing:2px;color:#fff">Find Cafes by What Matters</h1>'
        + '<p style="font-size:14px;color:rgba(255,255,255,0.45);margin-top:10px;line-height:1.6">Dog friendly? Outdoor seating? Own roast? Filter by the things you care about.</p></div>'
        + stats
        + '<div style="display:flex;flex-direction:column;gap:8px">' + tagCards + '</div>'
        + '<div style="margin-top:24px;display:flex;flex-direction:column;gap:8px">'
        + '<a href="/suburbs" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;text-decoration:none;color:rgba(255,255,255,0.5);font-size:13px">Browse by Suburb &rarr;</a>'
        + '<a href="/explore" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:rgba(230,192,115,0.03);border:1px solid rgba(230,192,115,0.12);border-radius:14px;text-decoration:none;color:#E6C073;font-size:13px">Explore &rarr;</a></div>'
        + FT + '</div></body></html>');
    }

    // INDIVIDUAL TAG PAGE
    var tagData = tagMap[tag];
    if (!tagData) {
      return res.status(404).send('<!DOCTYPE html><html><head><title>Tag Not Found</title><meta name="robots" content="noindex"></head><body style="background:#0a0a0c;color:#fff;font-family:sans-serif;text-align:center;padding:60px"><h1 style="color:#E6C073">Tag Not Found</h1><p style="color:rgba(255,255,255,0.4)">No cafes tagged with this yet.</p><a href="/tags" style="color:#E6C073">All Tags &rarr;</a></body></html>');
    }

    var display = TAG_ICONS[tag] || tagDisplay(tag);
    var color = TAG_COLORS[tag] || "#E6C073";
    var sorted = tagData.cafes.sort(function(a, b) { return b.sc - a.sc; });
    var avg = sorted.reduce(function(sum, c) { return sum + c.sc; }, 0) / sorted.length;

    var cafeCards = sorted.map(function(c, i) {
      var col = gc(c.sc);
      var v = gv(c.sc);
      return '<a href="/review/' + c.sl + '" style="display:flex;align-items:center;gap:14px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;padding:14px 18px;text-decoration:none;color:inherit;transition:border 0.2s" onmouseover="this.style.borderColor=\'rgba(230,192,115,0.25)\'" onmouseout="this.style.borderColor=\'rgba(255,255,255,0.06)\'">'
        + '<div style="font-size:12px;color:rgba(255,255,255,0.3);width:22px;text-align:center;flex-shrink:0">' + (i + 1) + '</div>'
        + '<div style="width:48px;height:48px;border-radius:50%;border:2px solid ' + col + ';display:flex;align-items:center;justify-content:center;flex-shrink:0"><span style="font-family:Bebas Neue,sans-serif;font-size:18px;color:' + col + '">' + c.sc.toFixed(1) + '</span></div>'
        + '<div style="flex:1;min-width:0"><div style="font-size:15px;font-weight:600;color:#fff">' + esc(c.n) + '</div>'
        + '<div style="font-size:11px;color:rgba(255,255,255,0.4);margin-top:2px">' + esc(c.s) + ', ' + esc(c.c) + '</div></div>'
        + '<div style="padding:3px 10px;border-radius:20px;font-size:9px;font-weight:700;letter-spacing:1.5px;background:' + col + '18;color:' + col + ';border:1px solid ' + col + '40;flex-shrink:0">' + v + '</div></a>';
    }).join("");

    var tagStats = '<div style="display:flex;gap:0;margin-bottom:24px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:14px;overflow:hidden">'
      + '<div style="flex:1;text-align:center;padding:14px 8px;border-right:1px solid rgba(255,255,255,0.03)"><div style="font-family:Bebas Neue,sans-serif;font-size:26px;color:' + color + '">' + sorted.length + '</div><div style="font-size:9px;letter-spacing:2px;color:rgba(255,255,255,0.3)">CAFES</div></div>'
      + '<div style="flex:1;text-align:center;padding:14px 8px;border-right:1px solid rgba(255,255,255,0.03)"><div style="font-family:Bebas Neue,sans-serif;font-size:26px;color:' + gc(avg) + '">' + avg.toFixed(1) + '</div><div style="font-size:9px;letter-spacing:2px;color:rgba(255,255,255,0.3)">AVG SCORE</div></div>'
      + '<div style="flex:1;text-align:center;padding:14px 8px"><div style="font-family:Bebas Neue,sans-serif;font-size:26px;color:' + gc(sorted[0].sc) + '">' + sorted[0].sc.toFixed(1) + '</div><div style="font-size:9px;letter-spacing:2px;color:rgba(255,255,255,0.3)">TOP SCORE</div></div></div>';

    return res.status(200).send('<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
      + '<title>' + esc(display) + ' Cafes ' + year + ' | Koffee Review</title>'
      + '<meta name="description" content="' + sorted.length + ' ' + esc(display.toLowerCase()) + ' cafes reviewed and ranked. Best: ' + esc(sorted[0].n) + ' (' + sorted[0].sc.toFixed(1) + '/10). All scored with one latte, one double shot.">'
      + '<link rel="canonical" href="https://koffeereview.com.au/tag/' + tag + '"><link rel="icon" href="/logo.webp">'
      + '<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">'
      + '<style>' + CSS + '</style></head><body><div class="c">' + NAV
      + '<div style="font-size:12px;color:rgba(255,255,255,0.35);padding:12px 0"><a href="/" style="color:#E6C073;text-decoration:none">Home</a> &middot; <a href="/tags" style="color:#E6C073;text-decoration:none">Tags</a> &middot; ' + esc(display) + '</div>'
      + '<div style="padding:16px 0 20px">'
      + '<div style="display:inline-block;padding:4px 14px;border-radius:20px;font-size:10px;letter-spacing:2px;font-weight:700;background:' + color + '15;color:' + color + ';border:1px solid ' + color + '40;margin-bottom:12px">' + esc(display.toUpperCase()) + '</div>'
      + '<h1 style="font-family:Bebas Neue,sans-serif;font-size:clamp(26px,6vw,40px);letter-spacing:2px;color:#fff;margin-bottom:8px">' + esc(display) + ' Cafes</h1>'
      + '<p style="font-size:14px;color:rgba(255,255,255,0.45);line-height:1.6">' + sorted.length + ' cafes tagged ' + esc(display.toLowerCase()) + '. Ranked by score. All reviewed with one latte and one double shot espresso.</p></div>'
      + tagStats
      + '<div style="display:flex;flex-direction:column;gap:8px">' + cafeCards + '</div>'
      + '<div style="margin-top:24px;display:flex;flex-direction:column;gap:8px">'
      + '<a href="/tags" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;text-decoration:none;color:rgba(255,255,255,0.5);font-size:13px">All Tags &rarr;</a>'
      + '<a href="/suburbs" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;text-decoration:none;color:rgba(255,255,255,0.5);font-size:13px">Browse by Suburb &rarr;</a>'
      + '<a href="/explore" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:rgba(230,192,115,0.03);border:1px solid rgba(230,192,115,0.12);border-radius:14px;text-decoration:none;color:#E6C073;font-size:13px">Explore &rarr;</a></div>'
      + FT + '</div></body></html>');
  } catch (e) { res.status(500).send("Error: " + (e.message || "unknown")); }
}
