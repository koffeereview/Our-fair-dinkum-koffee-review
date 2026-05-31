const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYEU8Khk3R5I879v3FcXPqhq0aCXa2ZWM1BwwJOyUitx2Boak_AFTOkwvB8qQrKIeU55NM4htFjHbI/pub?gid=0&single=true&output=csv";

function esc(s){return(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
function makeSlug(n,s){return(n+"-"+s).toLowerCase().replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-");}
function splitCSV(line){var r=[],c="",q=false;for(var i=0;i<line.length;i++){var ch=line[i];if(ch==='"')q=!q;else if(ch===","&&!q){r.push(c.trim());c="";}else c+=ch;}r.push(c.trim());return r;}
function gc(s){if(s>=9)return"#ffffff";if(s>=8)return"#4ade80";if(s>=7)return"#2dd4bf";if(s>=6)return"#facc15";if(s>=5)return"#fb923c";return"#f87171";}
function gv(s){if(s>=9.1)return"ELITE";if(s>=8.1)return"GREAT";if(s>=7.5)return"MUST VISIT";if(s>=7.1)return"SOLID";if(s>=6.5)return"DECENT";if(s>=5.1)return"JUST OKAY";return"AVOID";}

function parseCSV(text){
  var lines=text.split("\n").filter(function(l){return l.trim();});
  if(lines.length<2)return[];
  var h=splitCSV(lines[0]).map(function(x){return x.trim().toLowerCase();});
  var ni=h.indexOf("name"),si=h.indexOf("suburb"),ci=h.indexOf("city"),sci=h.indexOf("score"),pi=h.indexOf("price"),noi=h.indexOf("notes");
  if(ni===-1||si===-1)return[];
  var out=[];
  for(var i=1;i<lines.length;i++){try{var p=splitCSV(lines[i]);var n=(p[ni]||"").trim();if(!n)continue;var sc=parseFloat(p[sci])||0;if(sc<=0)continue;
  var city=(p[ci]||"").trim().toLowerCase();if(["barcelona","catalonia","spain"].indexOf(city)!==-1)continue;
  out.push({name:n,suburb:(p[si]||"").trim(),city:(p[ci]||"").trim(),score:sc,price:(p[pi]||"$$$").trim(),notes:(p[noi]||"").trim(),row:i});}catch(e){}}
  return out;
}

export default async function handler(req,res){
  try{
    var response=await fetch(SHEET_URL);var text=await response.text();var allCafes=parseCSV(text);

    // Latest reviews = last entries in the sheet (newest at bottom)
    var latest=allCafes.slice(-20).reverse();
    var thisWeek=latest.slice(0,10);
    var older=latest.slice(10);
    var topNew=thisWeek.reduce(function(b,c){return c.score>b.score?c:b;},thisWeek[0]);

    var totalReviewed=allCafes.length;
    var avgNew=(thisWeek.reduce(function(s,c){return s+c.score;},0)/thisWeek.length).toFixed(1);

    var title="New Coffee Reviews This Month | "+thisWeek.length+" Latest | Koffee Review";
    var desc="The latest "+thisWeek.length+" cafe reviews from Koffee Review. See what we scored this month. Updated weekly.";

    function makeCard(c){
      var col=gc(c.score);var verdict=gv(c.score);var slug=makeSlug(c.name,c.suburb);
      return'<a href="/review/'+slug+'" class="cc"><div class="cc-bar" style="background:'+col+'"></div><div class="cc-sc" style="color:'+col+'">'+c.score.toFixed(1)+'</div><div class="cc-info"><div class="cc-nm">'+esc(c.name)+'</div><div class="cc-loc">'+esc(c.suburb)+', '+esc(c.city)+(c.price?' &middot; '+esc(c.price):'')+'</div>'+(c.notes?'<div class="cc-nt">'+esc(c.notes.substring(0,80))+(c.notes.length>80?'...':'')+'</div>':'')+'</div><div class="cc-vd" style="background:'+col+'">'+verdict+'</div></a>';
    }

    var weekCards=thisWeek.map(makeCard).join("");
    var olderCards=older.map(makeCard).join("");
    var topSlug=makeSlug(topNew.name,topNew.suburb);
    var topCol=gc(topNew.score);

    var html=`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${desc}">
  <link rel="canonical" href="https://koffeereview.com.au/new">
  <meta property="og:title" content="${title}"><meta property="og:description" content="${desc}">
  <meta property="og:url" content="https://koffeereview.com.au/new"><meta property="og:image" content="https://koffeereview.com.au/logo.webp">
  <link rel="icon" href="/logo.webp">
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"CollectionPage","name":"${title}","description":"${desc}","url":"https://koffeereview.com.au/new"}<\/script>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{background:#0d0d0f;color:#d4d4d4;font-family:'DM Sans',sans-serif;min-height:100vh;-webkit-font-smoothing:antialiased}
    .c{max-width:800px;margin:0 auto;padding:0 20px}
    nav{display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid rgba(230,192,115,0.08)}.nav-logo{display:flex;align-items:center;gap:10px;text-decoration:none}.nav-logo img{width:34px;height:34px;border-radius:50%;border:1.5px solid rgba(230,192,115,0.25)}.nav-logo span{font-family:'Bebas Neue',sans-serif;font-size:15px;letter-spacing:3px;color:#E6C073}.nav-links{display:flex;gap:14px}.nav-links a{font-size:12px;color:rgba(255,255,255,0.45);text-decoration:none}.nav-links a:hover{color:#E6C073}
    .hero{text-align:center;padding:28px 0 16px}h1{font-family:'Bebas Neue',sans-serif;font-size:clamp(28px,7vw,44px);letter-spacing:3px;color:#fff;margin-bottom:6px}.hero-sub{font-size:13px;color:rgba(255,255,255,0.45);line-height:1.6}.hero-tag{display:inline-block;padding:4px 14px;border-radius:20px;font-size:9px;font-weight:700;letter-spacing:3px;background:rgba(74,222,128,0.1);color:#4ade80;border:1px solid rgba(74,222,128,0.2);margin-bottom:12px}
    .gold-line{height:1px;background:linear-gradient(90deg,transparent,rgba(230,192,115,0.3),transparent);margin:14px 0}
    .stats{display:flex;gap:0;margin:0 auto 16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;overflow:hidden}.stat{flex:1;text-align:center;padding:14px 8px;border-right:1px solid rgba(255,255,255,0.04)}.stat:last-child{border:none}.stat-n{font-family:'Bebas Neue',sans-serif;font-size:26px;color:#E6C073;line-height:1}.stat-l{font-size:9px;letter-spacing:2px;color:rgba(255,255,255,0.35);margin-top:2px}
    .top-pick{background:linear-gradient(135deg,rgba(230,192,115,0.06),rgba(230,192,115,0.02));border:1px solid rgba(230,192,115,0.2);border-radius:14px;padding:18px 20px;margin:16px 0;text-decoration:none;display:block;color:inherit;transition:all 0.15s}.top-pick:hover{border-color:rgba(230,192,115,0.4)}.tp-label{font-size:10px;letter-spacing:3px;color:#E6C073;font-weight:700;margin-bottom:6px}.tp-row{display:flex;align-items:center;gap:14px}.tp-sc{font-family:'Bebas Neue',sans-serif;font-size:36px;line-height:1}.tp-nm{font-size:16px;font-weight:600;color:#fff}.tp-meta{font-size:12px;color:rgba(255,255,255,0.45);margin-top:3px}.tp-notes{font-size:13px;color:rgba(255,255,255,0.5);font-style:italic;margin-top:10px;line-height:1.6}
    .section-title{font-family:'Bebas Neue',sans-serif;font-size:14px;letter-spacing:3px;color:rgba(255,255,255,0.4);margin:20px 0 12px}
    .cc{display:flex;align-items:center;gap:14px;padding:14px 18px;border-radius:14px;border:1px solid rgba(255,255,255,0.05);background:rgba(255,255,255,0.02);margin-bottom:6px;text-decoration:none;color:inherit;transition:all 0.15s;position:relative;overflow:hidden}.cc:hover{border-color:rgba(230,192,115,0.2);background:rgba(255,255,255,0.035);transform:translateX(2px)}
    .cc-bar{position:absolute;left:0;top:0;bottom:0;width:3px;border-radius:14px 0 0 14px}
    .cc-sc{font-family:'Bebas Neue',sans-serif;font-size:22px;min-width:44px;text-align:center;margin-left:6px}
    .cc-info{flex:1;min-width:0}.cc-nm{font-size:14px;font-weight:600;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.cc-loc{font-size:11px;color:rgba(255,255,255,0.4);margin-top:2px}.cc-nt{font-size:12px;color:rgba(255,255,255,0.4);margin-top:3px;font-style:italic}
    .cc-vd{padding:3px 10px;border-radius:20px;font-size:9px;font-weight:700;letter-spacing:1.5px;color:#000;flex-shrink:0}
    .ft{margin-top:32px;padding:20px 0;border-top:1px solid rgba(255,255,255,0.04);text-align:center}.ft a{color:rgba(255,255,255,0.5);text-decoration:none;font-size:11px}.ft a:hover{color:#E6C073}
    @media(max-width:480px){.cc-nm{font-size:13px}}
  </style>
</head>
<body>
  <div class="c">
    <nav>
      <a href="/" class="nav-logo"><img src="/logo.webp" alt="KR"><span>KOFFEE REVIEW</span></a>
      <div class="nav-links"><a href="/random">Spin</a><a href="/map">Map</a><a href="/blog">Blog</a></div>
    </nav>

    <div class="hero">
      <div class="hero-tag">FRESH REVIEWS</div>
      <h1>NEW THIS MONTH</h1>
      <p class="hero-sub">The latest cafes we have reviewed. Updated weekly.</p>
    </div>
    <div class="gold-line"></div>

    <div class="stats">
      <div class="stat"><div class="stat-n">${thisWeek.length}</div><div class="stat-l">LATEST</div></div>
      <div class="stat"><div class="stat-n" style="color:${gc(topNew.score)}">${topNew.score.toFixed(1)}</div><div class="stat-l">HIGHEST</div></div>
      <div class="stat"><div class="stat-n" style="color:${gc(parseFloat(avgNew))}">${avgNew}</div><div class="stat-l">AVG SCORE</div></div>
      <div class="stat"><div class="stat-n">${totalReviewed}+</div><div class="stat-l">TOTAL</div></div>
    </div>

    <a href="/review/${topSlug}" class="top-pick">
      <div class="tp-label">TOP NEW REVIEW</div>
      <div class="tp-row">
        <div class="tp-sc" style="color:${topCol}">${topNew.score.toFixed(1)}</div>
        <div><div class="tp-nm">${esc(topNew.name)}</div><div class="tp-meta">${esc(topNew.suburb)}, ${esc(topNew.city)} &middot; ${esc(topNew.price)}</div></div>
      </div>
      ${topNew.notes ? '<div class="tp-notes">'+esc(topNew.notes.substring(0,120))+(topNew.notes.length>120?'...':'')+'</div>' : ''}
    </a>

    <div class="section-title">LATEST REVIEWS</div>
    ${weekCards}

    ${olderCards ? '<div class="section-title" style="margin-top:28px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.04)">EARLIER THIS MONTH</div>'+olderCards : ''}

    <div style="text-align:center;margin-top:20px">
      <a href="/random" style="display:inline-block;padding:12px 28px;border-radius:10px;background:linear-gradient(135deg,#c8a96e,#f5e6c8);color:#0a0a0a;font-size:12px;font-weight:700;text-decoration:none;letter-spacing:1px">SPIN FOR A RANDOM CAFE</a>
    </div>

    <footer class="ft">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:10px;letter-spacing:4px;color:rgba(230,192,115,0.5);margin-bottom:8px">EXPLORE</div>
      <a href="/">Reviews</a> &middot; <a href="/leaderboard">Leaderboard</a> &middot; <a href="/map">Heat Map</a> &middot; <a href="/compare">Compare</a> &middot; <a href="/blog">Blog</a>
    </footer>
  </div>
</body>
</html>`;

    res.setHeader("Content-Type","text/html; charset=utf-8");
    res.setHeader("Cache-Control","public, s-maxage=3600, stale-while-revalidate=86400");
    res.status(200).send(html);
  }catch(e){
    res.status(500).send("Error");
  }
}
