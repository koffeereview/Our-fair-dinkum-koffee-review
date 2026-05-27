const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYEU8Khk3R5I879v3FcXPqhq0aCXa2ZWM1BwwJOyUitx2Boak_AFTOkwvB8qQrKIeU55NM4htFjHbI/pub?gid=0&single=true&output=csv";

function makeSlug(n,s){return(n+"-"+s).toLowerCase().replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-").trim();}
function suburbToSlug(s){return String(s||"").toLowerCase().trim().replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-");}
function toTitleCase(s){return(s||"").split(" ").map(function(w){return w.charAt(0).toUpperCase()+w.slice(1).toLowerCase();}).join(" ");}
function esc(s){return(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");}
function getScoreColor(s){if(s>=9)return"#ffffff";if(s>=8)return"#4ade80";if(s>=7)return"#2dd4bf";if(s>=6)return"#facc15";if(s>=5)return"#fb923c";return"#f87171";}
function getVerdict(s){if(s>=9.1)return"ELITE";if(s>=8.1)return"GREAT";if(s>=7.5)return"MUST VISIT";if(s>=7.1)return"SOLID";if(s>=6.5)return"DECENT";if(s>=5.5)return"AVERAGE";if(s>=5.1)return"JUST OKAY";return"AVOID";}

function splitCSVLine(line){const r=[];let c="",q=false;for(let i=0;i<line.length;i++){const ch=line[i];if(ch==='"')q=!q;else if(ch===","&&!q){r.push(c.trim());c="";}else c+=ch;}r.push(c.trim());return r;}
function parseCSV(text){const lines=text.split("\n").filter(function(l){return l.trim();});if(lines.length<2)return[];const h=splitCSVLine(lines[0]).map(function(x){return x.trim().toLowerCase();});const ni=h.indexOf("name"),si=h.indexOf("suburb"),ci=h.indexOf("city"),sci=h.indexOf("score"),pi=h.indexOf("price"),noi=h.indexOf("notes"),lai=h.indexOf("lat"),lni=h.indexOf("lng");if(ni===-1||si===-1)return[];return lines.slice(1).map(function(line){const p=splitCSVLine(line);return{name:p[ni]||"",suburb:p[si]||"",city:p[ci]||"",score:parseFloat(p[sci])||0,price:p[pi]||"$$$",notes:p[noi]||"",lat:parseFloat(p[lai])||0,lng:parseFloat(p[lni])||0};}).filter(function(c){return c.name&&c.suburb;});}

export default async function handler(req, res) {
  try {
    const { suburb } = req.query;
    if (!suburb) { return res.status(400).send("Suburb parameter required"); }

    const controller = new AbortController();
    const tid = setTimeout(function(){controller.abort();}, 10000);
    const response = await fetch(SHEET_URL, { signal: controller.signal });
    clearTimeout(tid);
    if (!response.ok) throw new Error("Sheet fetch failed");
    const text = await response.text();
    const cafes = parseCSV(text);

    // BRUTE-FORCE MATCHING
    const slugNorm = suburb.toLowerCase().replace(/[^a-z0-9]/g, "");
    let filtered = cafes.filter(function(c) {
      var subOnly = (c.suburb||"").toLowerCase().replace(/[^a-z0-9]/g, "");
      if (subOnly === slugNorm) return true;
      var subCity = subOnly + ((c.city||"").toLowerCase().replace(/[^a-z0-9]/g, ""));
      if (subCity === slugNorm) return true;
      return false;
    });

    if (filtered.length === 0) {
      var allSuburbs = [...new Set(cafes.map(function(c){return c.suburb;}))].sort();
      var suggestionList = allSuburbs.slice(0,20).map(function(s){
        var cafeInSub = cafes.find(function(c){return c.suburb===s;});
        var cityPart = cafeInSub&&cafeInSub.city ? "-"+suburbToSlug(cafeInSub.city):"";
        return '<a href="/suburb/'+suburbToSlug(s)+cityPart+'" style="color:#E6C073;text-decoration:none;display:inline-block;padding:6px 12px;border:1px solid rgba(230,192,115,0.3);border-radius:20px;margin:4px">'+esc(s)+'</a>';
      }).join("");
      res.setHeader("Content-Type","text/html; charset=utf-8");
      return res.status(404).send('<!DOCTYPE html><html><head><title>Suburb Not Found</title><meta name="robots" content="noindex"><link rel="icon" href="/logo.webp"></head><body style="font-family:sans-serif;background:#0d0d0f;color:#fff;text-align:center;padding:60px 24px;max-width:800px;margin:0 auto"><h1 style="color:#E6C073">Suburb not found</h1><p style="color:rgba(255,255,255,0.5);margin:20px 0">Try one of these:</p><div style="margin-top:16px">'+suggestionList+'</div><p style="margin-top:32px"><a href="/" style="color:#E6C073">Back to Koffee Review</a></p></body></html>');
    }

    filtered.sort(function(a,b){return b.score-a.score;});
    const suburbName = toTitleCase(filtered[0].suburb);
    const cityName = toTitleCase(filtered[0].city || "Brisbane");
    const cityLower = cityName.toLowerCase().replace(/\s+/g, "-");
    const topCafe = filtered[0];
    const avgScore = (filtered.reduce(function(s,c){return s+c.score;},0)/filtered.length).toFixed(1);
    const mustVisit = filtered.filter(function(c){return c.score>=7.5;}).length;
    const canonical = "https://koffeereview.com.au/suburb/"+suburbToSlug(filtered[0].suburb)+"-"+cityLower;

    const title = "Best Coffee in "+suburbName+", "+cityName+" 2026 ("+filtered.length+" Reviewed) | Koffee Review";
    const desc = "Honest reviews of "+filtered.length+" cafes in "+suburbName+", "+cityName+". Top pick: "+topCafe.name+" ("+topCafe.score+"/10). Same order every time.";

    // Schemas
    const breadcrumbSchema = {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Koffee Review","item":"https://koffeereview.com.au"},{"@type":"ListItem","position":2,"name":cityName,"item":"https://koffeereview.com.au/city/"+cityLower},{"@type":"ListItem","position":3,"name":suburbName,"item":canonical}]};
    const itemListSchema = {"@context":"https://schema.org","@type":"ItemList","name":"Best Cafes in "+suburbName,"numberOfItems":filtered.length,"itemListElement":filtered.slice(0,20).map(function(c,i){return{"@type":"ListItem","position":i+1,"item":{"@type":"CafeOrCoffeeShop","name":c.name,"url":"https://koffeereview.com.au/review/"+makeSlug(c.name,c.suburb),"address":{"@type":"PostalAddress","addressLocality":suburbName,"addressCountry":"AU"},"aggregateRating":{"@type":"AggregateRating","ratingValue":c.score.toString(),"bestRating":"10","reviewCount":"1"}}};})};

    const faqs = [
      {q:"What is the best cafe in "+suburbName+"?", a:"Based on our reviews, "+topCafe.name+" is the top-rated cafe in "+suburbName+" with a score of "+topCafe.score+"/10."+(topCafe.notes?" Our take: "+topCafe.notes.substring(0,100)+(topCafe.notes.length>100?"...":""):"")},
      {q:"How many cafes are reviewed in "+suburbName+"?", a:"We have reviewed "+filtered.length+" cafes in "+suburbName+", "+cityName+". The average score is "+avgScore+"/10."+(mustVisit>0?" "+mustVisit+" are rated Must Visit (7.5+).":"")},
      {q:"What is the average coffee score in "+suburbName+"?", a:"The average across "+filtered.length+" cafes is "+avgScore+"/10. Scores range from "+filtered[filtered.length-1].score+"/10 to "+topCafe.score+"/10."},
      {q:"How does Koffee Review rate cafes?", a:"We order the same thing at every cafe. One latte and one double espresso. We score on taste, consistency, and value. No sponsorships."}
    ];
    const faqSchema = {"@context":"https://schema.org","@type":"FAQPage","mainEntity":faqs.map(function(f){return{"@type":"Question","name":f.q,"acceptedAnswer":{"@type":"Answer","text":f.a}};})};

    // Cafe data for JS pagination
    const cafeData = JSON.stringify(filtered.map(function(c){return{n:esc(c.name),s:esc(c.suburb),sc:c.score,sl:makeSlug(c.name,c.suburb),p:esc(c.price),nt:esc((c.notes||"").substring(0,70)),v:esc(getVerdict(c.score))};})).replace(/</g,"\\u003c");

    // Nearby suburbs
    const nearbySuburbs = [...new Set(cafes.filter(function(c){return c.city.toLowerCase()===filtered[0].city.toLowerCase()&&c.suburb.toLowerCase()!==filtered[0].suburb.toLowerCase();}).map(function(c){return c.suburb;}))].slice(0,8);
    const nearbyCards = nearbySuburbs.map(function(s){
      const subCafes = cafes.filter(function(c){return c.suburb===s;});
      const topSc = Math.max(...subCafes.map(function(c){return c.score;}));
      return '<a href="/suburb/'+suburbToSlug(s)+'-'+cityLower+'" class="nb-card"><div class="nb-name">'+esc(s)+'</div><div class="nb-meta">'+subCafes.length+' cafes</div></a>';
    }).join("");

    // Noscript
    const noscript = filtered.slice(0,50).map(function(c){return'<a href="/review/'+makeSlug(c.name,c.suburb)+'" style="display:block;padding:4px 0;color:#2dd4bf;font-size:13px;text-decoration:none">'+c.score.toFixed(1)+' '+esc(c.name)+'</a>';}).join("");

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}">
  <link rel="canonical" href="${canonical}"><link rel="alternate" hreflang="en-AU" href="${canonical}">
  <meta name="robots" content="index, follow">
  <meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}">
  <meta property="og:url" content="${canonical}"><meta property="og:image" content="https://koffeereview.com.au/logo.webp">
  <link rel="icon" href="/logo.webp">
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}<\/script>
  <script type="application/ld+json">${JSON.stringify(itemListSchema)}<\/script>
  <script type="application/ld+json">${JSON.stringify(faqSchema)}<\/script>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{background:#0d0d0f;color:#d4d4d4;font-family:'DM Sans',sans-serif;min-height:100vh;-webkit-font-smoothing:antialiased}
    .c{max-width:800px;margin:0 auto;padding:0 20px}
    nav{display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid rgba(230,192,115,0.08)}.nav-logo{display:flex;align-items:center;gap:10px;text-decoration:none}.nav-logo img{width:34px;height:34px;border-radius:50%;border:1.5px solid rgba(230,192,115,0.25)}.nav-logo span{font-family:'Bebas Neue',sans-serif;font-size:15px;letter-spacing:3px;color:#E6C073}.nav-links{display:flex;gap:14px}.nav-links a{font-size:12px;color:rgba(255,255,255,0.45);text-decoration:none}.nav-links a:hover{color:#E6C073}
    .bc{font-size:12px;color:rgba(255,255,255,0.4);padding:12px 0}.bc a{color:#E6C073;text-decoration:none}.bc a:hover{text-decoration:underline}
    .hero{padding:28px 0 20px;text-align:center}.hero-tag{display:inline-block;padding:5px 16px;border-radius:24px;font-size:10px;font-weight:700;letter-spacing:3px;background:rgba(230,192,115,0.08);color:#E6C073;border:1px solid rgba(230,192,115,0.2);margin-bottom:14px}
    h1{font-family:'Bebas Neue',sans-serif;font-size:clamp(30px,7vw,48px);letter-spacing:3px;line-height:1.05;color:#fff;margin-bottom:8px}
    .hero-sub{font-size:14px;color:rgba(255,255,255,0.5);line-height:1.7;max-width:540px;margin:0 auto}
    .gold-line{height:1px;background:linear-gradient(90deg,transparent,rgba(230,192,115,0.3),transparent);margin:14px 0}
    .stats{display:flex;gap:0;margin:0 auto 14px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;overflow:hidden}.stat{flex:1;text-align:center;padding:14px 8px;border-right:1px solid rgba(255,255,255,0.04)}.stat:last-child{border:none}.stat-n{font-family:'Bebas Neue',sans-serif;font-size:26px;color:#E6C073;line-height:1}.stat-l{font-size:9px;letter-spacing:2px;color:rgba(255,255,255,0.35);margin-top:2px}
    .top-pick{background:linear-gradient(135deg,rgba(230,192,115,0.08),rgba(230,192,115,0.02));border:1px solid rgba(230,192,115,0.2);border-radius:14px;padding:18px 20px;margin:16px 0;text-align:left;text-decoration:none;display:block;color:inherit;transition:all 0.15s}.top-pick:hover{border-color:rgba(230,192,115,0.4)}.tp-label{font-size:10px;letter-spacing:3px;color:#E6C073;font-weight:700;margin-bottom:6px}.tp-row{display:flex;align-items:center;gap:14px}.tp-sc{font-family:'Bebas Neue',sans-serif;font-size:36px;line-height:1}.tp-nm{font-size:16px;font-weight:600;color:#fff}.tp-meta{font-size:12px;color:rgba(255,255,255,0.45);margin-top:3px}.tp-notes{font-size:13px;color:rgba(255,255,255,0.5);font-style:italic;margin-top:10px;line-height:1.6}
    .section-title{font-family:'Bebas Neue',sans-serif;font-size:14px;letter-spacing:3px;color:rgba(255,255,255,0.4);margin-bottom:12px}
    .cc{display:flex;align-items:center;gap:14px;padding:14px 18px;border-radius:14px;border:1px solid rgba(255,255,255,0.05);background:rgba(255,255,255,0.02);margin-bottom:6px;text-decoration:none;color:inherit;transition:all 0.15s;position:relative;overflow:hidden}.cc:hover{border-color:rgba(230,192,115,0.2);background:rgba(255,255,255,0.035);transform:translateX(2px)}
    .cc-bar{position:absolute;left:0;top:0;bottom:0;width:3px;border-radius:14px 0 0 14px}
    .cc-sc{font-family:'Bebas Neue',sans-serif;font-size:22px;min-width:44px;text-align:center;margin-left:6px}
    .cc-info{flex:1;min-width:0}.cc-nm{font-size:14px;font-weight:600;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.cc-loc{font-size:11px;color:rgba(255,255,255,0.4);margin-top:2px}.cc-nt{font-size:12px;color:rgba(255,255,255,0.4);margin-top:3px;font-style:italic}
    .cc-vd{padding:3px 10px;border-radius:20px;font-size:9px;font-weight:700;letter-spacing:1.5px;color:#000;flex-shrink:0}
    .lm-btn{width:100%;padding:14px;border-radius:12px;border:1px solid rgba(230,192,115,0.15);background:rgba(230,192,115,0.03);color:#E6C073;font-size:13px;font-weight:600;cursor:pointer;font-family:'DM Sans',sans-serif;letter-spacing:1px;margin-top:8px;transition:all 0.2s}.lm-btn:hover{background:rgba(230,192,115,0.08);border-color:rgba(230,192,115,0.3)}
    .count-label{font-size:12px;color:rgba(255,255,255,0.3);text-align:center;margin-top:8px}
    .nb-section{margin-top:32px;padding-top:24px;border-top:1px solid rgba(255,255,255,0.04)}.nb-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:8px;margin-top:12px}
    .nb-card{display:block;padding:14px 16px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:12px;text-decoration:none;color:inherit;transition:all 0.15s}.nb-card:hover{border-color:rgba(230,192,115,0.2);background:rgba(255,255,255,0.04)}.nb-name{font-weight:600;font-size:13px;color:#fff;margin-bottom:2px}.nb-meta{font-size:11px;color:rgba(255,255,255,0.4)}
    .related{margin-top:24px}.related-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:8px;margin-top:10px}.rl{padding:12px 14px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:10px;color:#E6C073;text-decoration:none;font-size:12px;transition:all 0.15s}.rl:hover{background:rgba(230,192,115,0.06);border-color:rgba(230,192,115,0.2)}
    .faq{margin-top:28px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.04)}.fi{margin-bottom:6px;border:1px solid rgba(255,255,255,0.06);border-radius:10px;overflow:hidden}.fi[open]{border-color:rgba(230,192,115,0.2)}.fq{padding:12px 14px;font-size:13px;font-weight:600;color:#fff;cursor:pointer;list-style:none}.fq::-webkit-details-marker{display:none}.fq::after{content:"+";color:#E6C073;font-size:14px;float:right}.fi[open] .fq::after{content:"-"}.fa{padding:0 14px 12px;font-size:13px;color:rgba(255,255,255,0.55);line-height:1.7}
    .ft{margin-top:36px;padding:24px 0;border-top:1px solid rgba(255,255,255,0.04);text-align:center}.ft p{font-size:12px;color:rgba(255,255,255,0.3);line-height:1.7;margin-bottom:10px}.ft a{color:rgba(255,255,255,0.5);text-decoration:none;font-size:11px}.ft a:hover{color:#E6C073}
  </style>
</head>
<body>
  <div class="c">
    <nav>
      <a href="/" class="nav-logo"><img src="/logo.webp" alt="KR"><span>KOFFEE REVIEW</span></a>
      <div class="nav-links"><a href="/city/${cityLower}">${cityName}</a><a href="/map">Map</a><a href="/blog">Blog</a></div>
    </nav>
    <div class="bc"><a href="/">Home</a> &middot; <a href="/city/${cityLower}">${cityName}</a> &middot; ${suburbName}</div>

    <header class="hero">
      <div class="hero-tag">${cityName.toUpperCase()} &middot; SUBURB GUIDE</div>
      <h1>Best Coffee in ${suburbName}</h1>
      <p class="hero-sub">${filtered.length} cafes reviewed in ${suburbName}, ${cityName}. Same order every time. No sponsorships.</p>
    </header>
    <div class="gold-line"></div>

    <div class="stats">
      <div class="stat"><div class="stat-n">${filtered.length}</div><div class="stat-l">REVIEWED</div></div>
      <div class="stat"><div class="stat-n" style="color:${mustVisit>=3?"#4ade80":"#E6C073"}">${mustVisit}</div><div class="stat-l">MUST VISIT</div></div>
      <div class="stat"><div class="stat-n" style="color:${getScoreColor(parseFloat(avgScore))}">${avgScore}</div><div class="stat-l">AVG SCORE</div></div>
      <div class="stat"><div class="stat-n" style="color:${getScoreColor(topCafe.score)}">${topCafe.score.toFixed(1)}</div><div class="stat-l">HIGHEST</div></div>
    </div>

    ${topCafe.score >= 7 ? `
    <a href="/review/${makeSlug(topCafe.name,topCafe.suburb)}" class="top-pick">
      <div class="tp-label">TOP PICK IN ${suburbName.toUpperCase()}</div>
      <div class="tp-row">
        <div class="tp-sc" style="color:${getScoreColor(topCafe.score)}">${topCafe.score.toFixed(1)}</div>
        <div><div class="tp-nm">${esc(topCafe.name)}</div><div class="tp-meta">${esc(topCafe.price)} &middot; ${getVerdict(topCafe.score)}</div></div>
      </div>
      ${topCafe.notes ? '<div class="tp-notes">'+esc(topCafe.notes.substring(0,120))+(topCafe.notes.length>120?"...":"")+'</div>' : ''}
    </a>` : ''}

    <p style="font-size:11px;color:rgba(255,255,255,0.25);text-align:center;margin-bottom:16px">Last updated May 2026</p>

    <div class="section-title">ALL ${filtered.length} CAFES &middot; RANKED</div>
    <div id="cl"></div>
    <button class="lm-btn" id="lmBtn" onclick="loadMore()" style="display:none">LOAD MORE</button>
    <div class="count-label" id="countLabel"></div>

    <noscript>${noscript}</noscript>

    ${nearbyCards ? '<div class="nb-section"><div class="section-title">MORE '+cityName.toUpperCase()+' SUBURBS</div><div class="nb-grid">'+nearbyCards+'</div></div>' : ''}

    <div class="related">
      <div class="section-title">EXPLORE MORE</div>
      <div class="related-grid">
        <a href="/best-coffee-${cityLower}" class="rl">Best Coffee in ${cityName} &rarr;</a>
        <a href="/leaderboard" class="rl">Full Leaderboard &rarr;</a>
        <a href="/map" class="rl">Coffee Heat Map &rarr;</a>
        <a href="/compare" class="rl">Compare Cafes &rarr;</a>
        <a href="/blog" class="rl">Blog &rarr;</a>
      </div>
    </div>

    <section class="faq">
      <div class="section-title">FREQUENTLY ASKED</div>
      ${faqs.map(function(f){return'<details class="fi"><summary class="fq">'+esc(f.q)+'</summary><p class="fa">'+esc(f.a)+'</p></details>';}).join("")}
    </section>

    <footer class="ft">
      <p>All scores based on one latte and one double shot espresso. <a href="/how-we-score" style="color:#E6C073">How we score &rarr;</a></p>
      <div style="margin-top:12px"><div style="font-family:'Bebas Neue',sans-serif;font-size:10px;letter-spacing:4px;color:rgba(230,192,115,0.5);margin-bottom:8px">EXPLORE</div><a href="/leaderboard">Leaderboard</a> &middot; <a href="/map">Heat Map</a> &middot; <a href="/compare">Compare</a> &middot; <a href="/blog">Blog</a></div>
    </footer>
  </div>

  <script>
    var AC=${cafeData};var page=0;var PP=10;
    function gc(s){if(s>=9)return"#ffffff";if(s>=8)return"#4ade80";if(s>=7)return"#2dd4bf";if(s>=6)return"#facc15";if(s>=5)return"#fb923c";return"#f87171";}
    function render(){
      var show=AC.slice(0,(page+1)*PP);
      var h="";show.forEach(function(c){var col=gc(c.sc);
        h+='<a href="/review/'+c.sl+'" class="cc"><div class="cc-bar" style="background:'+col+'"></div><div class="cc-sc" style="color:'+col+'">'+c.sc.toFixed(1)+'</div><div class="cc-info"><div class="cc-nm">'+c.n+'</div><div class="cc-loc">'+c.s+(c.p?' \\u00b7 '+c.p:'')+'</div>'+(c.nt?'<div class="cc-nt">'+c.nt+(c.nt.length>=70?'...':'')+'</div>':'')+'</div><div class="cc-vd" style="background:'+col+'">'+c.v+'</div></a>';
      });
      document.getElementById("cl").innerHTML=h;
      document.getElementById("countLabel").textContent="Showing "+show.length+" of "+AC.length+" cafes";
      var btn=document.getElementById("lmBtn");
      if(show.length<AC.length){btn.style.display="block";btn.textContent="LOAD "+Math.min(PP,AC.length-show.length)+" MORE \\u00b7 "+show.length+" of "+AC.length+" shown";}else btn.style.display="none";
    }
    function loadMore(){page++;render();}
    render();
  <\/script>
</body>
</html>`;

    res.setHeader("Content-Type","text/html; charset=utf-8");
    res.setHeader("Cache-Control","public, s-maxage=3600, stale-while-revalidate=86400");
    res.status(200).send(html);
  } catch (error) {
    res.setHeader("Content-Type","text/html; charset=utf-8");
    res.status(500).send('<!DOCTYPE html><html><head><title>Error</title><link rel="icon" href="/logo.webp"></head><body style="font-family:sans-serif;background:#0d0d0f;color:#fff;text-align:center;padding:60px"><h1>Something went wrong</h1><a href="/" style="color:#E6C073">Back to Koffee Review</a></body></html>');
  }
}
