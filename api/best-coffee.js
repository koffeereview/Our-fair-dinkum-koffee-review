const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYEU8Khk3R5I879v3FcXPqhq0aCXa2ZWM1BwwJOyUitx2Boak_AFTOkwvB8qQrKIeU55NM4htFjHbI/pub?gid=0&single=true&output=csv";
const SPAIN_CITIES = ["barcelona","catalonia","spain"];

function splitCSVLine(line){const r=[];let c="",q=false;for(let i=0;i<line.length;i++){const ch=line[i];if(ch==='"')q=!q;else if(ch===","&&!q){r.push(c.trim());c="";}else c+=ch;}r.push(c.trim());return r;}
function parseCSV(text){const lines=text.trim().split("\n");const h=splitCSVLine(lines[0]);return lines.slice(1).map(function(line){const v=splitCSVLine(line);const o={};h.forEach(function(k,i){o[k]=v[i]||"";});o.score=parseFloat(o.score)||0;o.lat=parseFloat(o.lat)||0;o.lng=parseFloat(o.lng)||0;return o;}).filter(function(c){return c.name&&c.score>0&&!SPAIN_CITIES.includes((c.city||"").toLowerCase());});}
function getScoreColor(s){if(s>=9)return"#ffffff";if(s>=8)return"#4ade80";if(s>=7)return"#2dd4bf";if(s>=6)return"#facc15";if(s>=5)return"#fb923c";return"#f87171";}
function getVerdict(s){if(s>=9.1)return"ELITE";if(s>=8.1)return"GREAT";if(s>=7.5)return"MUST VISIT";if(s>=7.1)return"SOLID";if(s>=6.5)return"DECENT";if(s>=5.5)return"AVERAGE";if(s>=5.1)return"JUST OKAY";return"AVOID";}
function makeSlug(n,s){return(n+"-"+s).toLowerCase().replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-").trim();}
function esc(s){return(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}

function renderCityPage(cityName, citySlug, stateShort, cafes, canonicalUrl) {
  const cityCafes = cafes.filter(function(c){return(c.city||"").toLowerCase().trim()===cityName.toLowerCase();}).sort(function(a,b){return b.score-a.score;});
  const mustVisit = cityCafes.filter(function(c){return c.score>=7.5;}).length;
  const avg = cityCafes.length>0?(cityCafes.reduce(function(s,c){return s+c.score;},0)/cityCafes.length).toFixed(1):"0";
  const suburbs = [...new Set(cityCafes.map(function(c){return c.suburb;}))].length;
  const suburbList = [...new Set(cityCafes.map(function(c){return c.suburb;}))].sort();
  const topCafe = cityCafes[0];

  const title = "Best Coffee in "+cityName+" 2026 | "+cityCafes.length+"+ Cafés Ranked | Koffee Review";
  const desc = "The definitive guide to "+cityName+"'s best coffee. "+cityCafes.length+"+ cafés reviewed with one latte and one double shot espresso. No sponsorships. Know before you go.";

  const suburbOptions = suburbList.map(function(s){return'<option value="'+esc(s)+'">'+esc(s)+'</option>';}).join("");

  const cafeData = JSON.stringify(cityCafes.map(function(c){return{n:esc(c.name),s:esc(c.suburb),sc:c.score,sl:makeSlug(c.name,c.suburb),p:esc(c.price||""),nt:esc((c.notes||"").substring(0,70)),v:esc((c.verdict||getVerdict(c.score)).toUpperCase()),la:c.lat,ln:c.lng};})).replace(/</g,"\\u003c");

  const noscript = cityCafes.slice(0,50).map(function(c){return'<a href="/review/'+makeSlug(c.name,c.suburb)+'" style="display:block;padding:4px 0;color:#2dd4bf;font-size:13px;text-decoration:none">'+c.score.toFixed(1)+' '+esc(c.name)+' — '+esc(c.suburb)+'</a>';}).join("");

  // Top 3 highlight cards
  const top3 = cityCafes.slice(0,3);
  const top3Html = top3.map(function(c,i){
    const col = getScoreColor(c.score);
    const slug = makeSlug(c.name,c.suburb);
    const medal = i===0?'🥇':i===1?'🥈':'🥉';
    return '<a href="/review/'+slug+'" class="top-card" style="border-color:'+col+'22"><div class="top-medal">'+medal+'</div><div class="top-sc" style="color:'+col+'">'+c.score.toFixed(1)+'</div><div class="top-nm">'+esc(c.name)+'</div><div class="top-loc">'+esc(c.suburb)+'</div></a>';
  }).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${desc}">
  <meta property="og:title" content="${title}"><meta property="og:description" content="${desc}">
  <meta property="og:image" content="https://koffeereview.com.au/logo.webp"><meta property="og:url" content="${canonicalUrl}">
  <link rel="canonical" href="${canonicalUrl}"><link rel="alternate" hreflang="en-AU" href="${canonicalUrl}">
  <link rel="icon" href="/logo.webp">
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"CollectionPage","name":"${title}","description":"${desc}","url":"${canonicalUrl}","publisher":{"@type":"Organization","name":"Koffee Review","url":"https://koffeereview.com.au"}}</script>
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Koffee Review","item":"https://koffeereview.com.au"},{"@type":"ListItem","position":2,"name":"Best Coffee ${cityName}","item":"${canonicalUrl}"}]}</script>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{background:#0d0d0f;color:#d4d4d4;font-family:'DM Sans',sans-serif;min-height:100vh;-webkit-font-smoothing:antialiased}
    .c{max-width:800px;margin:0 auto;padding:0 20px}
    nav{display:flex;align-items:center;justify-content:space-between;padding:14px 20px;border-bottom:1px solid rgba(230,192,115,0.08)}.nav-logo{display:flex;align-items:center;gap:10px;text-decoration:none}.nav-logo img{width:34px;height:34px;border-radius:50%;border:1.5px solid rgba(230,192,115,0.25)}.nav-logo span{font-family:'Bebas Neue',sans-serif;font-size:15px;letter-spacing:3px;color:#E6C073}.nav-links{display:flex;gap:14px}.nav-links a{font-size:12px;color:rgba(255,255,255,0.45);text-decoration:none}.nav-links a:hover{color:#E6C073}
    .hero{padding:36px 0 20px;text-align:center}.hero-tag{display:inline-block;padding:5px 16px;border-radius:24px;font-size:10px;font-weight:700;letter-spacing:3px;background:rgba(230,192,115,0.08);color:#E6C073;border:1px solid rgba(230,192,115,0.2);margin-bottom:14px}
    h1{font-family:'Bebas Neue',sans-serif;font-size:clamp(30px,7vw,50px);letter-spacing:3px;line-height:1.05;color:#fff;margin-bottom:10px}
    .hero-sub{font-size:14px;color:rgba(255,255,255,0.5);line-height:1.7;max-width:540px;margin:0 auto}
    .gold-line{height:1px;background:linear-gradient(90deg,transparent,rgba(230,192,115,0.3),transparent);margin:16px 0}
    .stats{display:flex;gap:0;margin:0 auto 16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;overflow:hidden}.stat{flex:1;text-align:center;padding:14px 8px;border-right:1px solid rgba(255,255,255,0.04)}.stat:last-child{border:none}.stat-n{font-family:'Bebas Neue',sans-serif;font-size:26px;color:#E6C073;line-height:1}.stat-l{font-size:9px;letter-spacing:2px;color:rgba(255,255,255,0.35);margin-top:2px}
    .top3{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:16px 0 24px}
    .top-card{display:flex;flex-direction:column;align-items:center;padding:16px 10px;border-radius:14px;border:1px solid rgba(255,255,255,0.06);background:rgba(255,255,255,0.02);text-decoration:none;color:inherit;transition:all 0.15s;text-align:center}.top-card:hover{border-color:rgba(230,192,115,0.25);transform:translateY(-2px)}
    .top-medal{font-size:20px;margin-bottom:4px}.top-sc{font-family:'Bebas Neue',sans-serif;font-size:28px;line-height:1}.top-nm{font-size:12px;font-weight:600;color:#fff;margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}.top-loc{font-size:10px;color:rgba(255,255,255,0.35);margin-top:2px}
    .filter-bar{display:flex;align-items:center;gap:8px;margin-bottom:14px;flex-wrap:wrap;justify-content:space-between}.section-title{font-family:'Bebas Neue',sans-serif;font-size:14px;letter-spacing:3px;color:rgba(255,255,255,0.4)}
    select{background:#1a1a1e;border:1px solid rgba(255,255,255,0.12);color:#fff;padding:8px 14px;border-radius:22px;font-size:12px;cursor:pointer;font-family:'DM Sans',sans-serif;outline:none;-webkit-appearance:none;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23999'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;padding-right:30px}select option{background:#1a1a1e;color:#fff;padding:8px}
    .near-btn{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);color:rgba(255,255,255,0.5);padding:8px 16px;border-radius:22px;font-size:12px;cursor:pointer;font-family:'DM Sans',sans-serif;white-space:nowrap;transition:all 0.2s}.near-btn:hover{border-color:rgba(230,192,115,0.3);color:#E6C073}
    .near-banner{display:none;background:rgba(230,192,115,0.06);border:1px solid rgba(230,192,115,0.15);border-radius:12px;padding:10px 16px;margin-bottom:14px;font-size:12px;color:#E6C073}
    .cc{display:flex;align-items:center;gap:14px;padding:14px 18px;border-radius:14px;border:1px solid rgba(255,255,255,0.05);background:rgba(255,255,255,0.02);margin-bottom:6px;text-decoration:none;color:inherit;transition:all 0.15s;position:relative;overflow:hidden}.cc:hover{border-color:rgba(230,192,115,0.2);background:rgba(255,255,255,0.035);transform:translateX(2px)}
    .cc-bar{position:absolute;left:0;top:0;bottom:0;width:3px;border-radius:14px 0 0 14px}
    .cc-sc{font-family:'Bebas Neue',sans-serif;font-size:22px;min-width:44px;text-align:center;margin-left:6px}
    .cc-info{flex:1;min-width:0}.cc-nm{font-size:14px;font-weight:600;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.cc-loc{font-size:11px;color:rgba(255,255,255,0.4);margin-top:2px}.cc-dist{font-size:11px;color:rgba(230,192,115,0.6);margin-top:2px}.cc-nt{font-size:12px;color:rgba(255,255,255,0.4);margin-top:3px;font-style:italic}
    .cc-vd{padding:3px 10px;border-radius:20px;font-size:9px;font-weight:700;letter-spacing:1.5px;color:#000;flex-shrink:0}
    .lm-btn{width:100%;padding:14px;border-radius:12px;border:1px solid rgba(230,192,115,0.15);background:rgba(230,192,115,0.03);color:#E6C073;font-size:13px;font-weight:600;cursor:pointer;font-family:'DM Sans',sans-serif;letter-spacing:1px;margin-top:8px;transition:all 0.2s}.lm-btn:hover{background:rgba(230,192,115,0.08);border-color:rgba(230,192,115,0.3)}
    .count-label{font-size:12px;color:rgba(255,255,255,0.3);text-align:center;margin-top:8px}
    .ft{margin-top:36px;padding:24px 0;border-top:1px solid rgba(255,255,255,0.04);text-align:center}.ft p{font-size:12px;color:rgba(255,255,255,0.3);line-height:1.7;margin-bottom:12px}.ft a{color:rgba(255,255,255,0.5);text-decoration:none;font-size:11px}.ft a:hover{color:#E6C073}
    .browse-btn{display:inline-flex;align-items:center;gap:8px;padding:12px 24px;border-radius:12px;background:linear-gradient(135deg,#c8a96e,#f5e6c8);color:#0a0a0a;font-weight:700;font-size:13px;text-decoration:none;margin-bottom:16px}.browse-btn img{width:20px;height:20px;border-radius:50%}
    .avoid-link{display:inline-flex;align-items:center;gap:6px;padding:10px 18px;border-radius:12px;border:1px solid rgba(248,113,113,0.25);background:rgba(248,113,113,0.05);color:#f87171;text-decoration:none;font-size:12px;font-weight:600;margin-bottom:16px}
    @media(max-width:480px){.top3{grid-template-columns:1fr 1fr 1fr;gap:6px}.top-card{padding:12px 6px}.top-sc{font-size:24px}.top-nm{font-size:11px}.stats{flex-wrap:wrap}.stat{min-width:45%}}
  </style>
</head>
<body>
  <div class="c">
    <nav>
      <a href="/" class="nav-logo"><img src="/logo.webp" alt="KR"><span>KOFFEE REVIEW</span></a>
      <div class="nav-links"><a href="/leaderboard">Leaderboard</a><a href="/map">Map</a><a href="/blog">Blog</a></div>
    </nav>

    <div class="hero">
      <div class="hero-tag">${stateShort} · RANKED GUIDE</div>
      <h1>Best Coffee in ${cityName}</h1>
      <p class="hero-sub">The definitive guide. ${cityCafes.length}+ cafés reviewed with one latte and one double shot espresso. No sponsorships, no agendas.</p>
    </div>
    <div class="gold-line"></div>

    <div class="stats">
      <div class="stat"><div class="stat-n">${cityCafes.length}</div><div class="stat-l">RANKED</div></div>
      <div class="stat"><div class="stat-n" style="color:${mustVisit>=5?"#4ade80":"#E6C073"}">${mustVisit}</div><div class="stat-l">MUST VISIT</div></div>
      <div class="stat"><div class="stat-n" style="color:${parseFloat(avg)>=7?"#4ade80":"#facc15"}">${avg}</div><div class="stat-l">AVG SCORE</div></div>
      <div class="stat"><div class="stat-n">${suburbs}</div><div class="stat-l">SUBURBS</div></div>
    </div>

    <div class="top3">${top3Html}</div>
    <p style="font-size:11px;color:rgba(255,255,255,0.25);text-align:center;margin-bottom:20px">Last updated May 2026</p>

    <div class="filter-bar">
      <div class="section-title">ALL ${cityName.toUpperCase()} CAFÉS</div>
      <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">
        <select id="sf" onchange="filterSuburb(this.value)"><option value="all">All Suburbs</option>${suburbOptions}</select>
        <button class="near-btn" id="nb" onclick="nearMe()"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" style="vertical-align:-1px;margin-right:4px"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="10" r="3" stroke="currentColor" stroke-width="2"/></svg>Near Me</button>
      </div>
    </div>
    <div class="near-banner" id="nbanner">Showing cafes closest to you</div>

    <div id="cl"></div>
    <button class="lm-btn" id="lmBtn" onclick="loadMore()" style="display:none">LOAD MORE</button>
    <div class="count-label" id="countLabel"></div>

    <noscript>${noscript}</noscript>

    ${citySlug==="brisbane" ? '<div style="text-align:center;margin-top:24px"><a href="/brisbane-cafes-to-avoid" class="avoid-link">⚠ Cafés to Avoid in Brisbane →</a></div>' : ''}

    <div class="ft">
      <p>All scores based on one latte and one double shot espresso. No café pays for placement. <a href="/how-we-score" style="color:#E6C073">How we score →</a></p>
      <a href="/" class="browse-btn"><img src="/logo.webp" alt="KR">Browse All Reviews</a>
      <div style="margin-top:16px"><div style="font-family:'Bebas Neue',sans-serif;font-size:10px;letter-spacing:4px;color:rgba(230,192,115,0.5);margin-bottom:8px">EXPLORE</div><a href="/leaderboard">Leaderboard</a> · <a href="/map">Heat Map</a> · <a href="/compare">Compare</a> · <a href="/blog">Blog</a></div>
    </div>
  </div>

  <script>
    var AC=${cafeData};var page=0;var PP=10;var filtered=AC;var nearMode=false;
    function gc(s){if(s>=9)return"#ffffff";if(s>=8)return"#4ade80";if(s>=7)return"#2dd4bf";if(s>=6)return"#facc15";if(s>=5)return"#fb923c";return"#f87171";}
    function render(){
      var show=filtered.slice(0,(page+1)*PP);
      var h="";show.forEach(function(c){var col=gc(c.sc);
        h+='<a href="/review/'+c.sl+'" class="cc"><div class="cc-bar" style="background:'+col+'"></div><div class="cc-sc" style="color:'+col+'">'+c.sc.toFixed(1)+'</div><div class="cc-info"><div class="cc-nm">'+c.n+'</div><div class="cc-loc">'+c.s+(c.p?' · '+c.p:'')+'</div>'+(c._dist?'<div class="cc-dist">'+c._dist+'</div>':'')+(c.nt?'<div class="cc-nt">'+c.nt+(c.nt.length>=70?'...':'')+'</div>':'')+'</div><div class="cc-vd" style="background:'+col+'">'+c.v+'</div></a>';
      });
      document.getElementById("cl").innerHTML=h;
      document.getElementById("countLabel").textContent="Showing "+show.length+" of "+filtered.length+" cafés";
      var btn=document.getElementById("lmBtn");
      if(show.length<filtered.length){btn.style.display="block";btn.textContent="LOAD "+Math.min(PP,filtered.length-show.length)+" MORE · "+show.length+" of "+filtered.length+" shown";}else btn.style.display="none";
    }
    function loadMore(){page++;render();}
    function filterSuburb(v){page=0;nearMode=false;document.getElementById("nbanner").style.display="none";
      if(v==="all")filtered=AC;else filtered=AC.filter(function(c){return c.s===v;});render();}
    function distKm(a,b,c,d){var R=6371;var x=(c-a)*Math.PI/180;var y=(d-b)*Math.PI/180;var z=Math.sin(x/2)*Math.sin(x/2)+Math.cos(a*Math.PI/180)*Math.cos(c*Math.PI/180)*Math.sin(y/2)*Math.sin(y/2);return R*2*Math.atan2(Math.sqrt(z),Math.sqrt(1-z));}
    function nearMe(){if(!navigator.geolocation){document.getElementById("nb").textContent="Near Me";return;}
      document.getElementById("nb").textContent="Locating...";document.getElementById("nb").style.opacity="0.5";
      navigator.geolocation.getCurrentPosition(function(p){
        var la=p.coords.latitude,ln=p.coords.longitude;
        var withCoords=AC.filter(function(c){return c.la&&c.ln&&Math.abs(c.la)>1;});
        if(withCoords.length===0){document.getElementById("nb").textContent="No GPS Data";document.getElementById("nb").style.opacity="1";return;}
        filtered=withCoords.map(function(c){var d=distKm(la,ln,c.la,c.ln);return Object.assign({},c,{_dist:(d<1?(d*1000).toFixed(0)+"m":d.toFixed(1)+"km")+" away",_distN:d});}).sort(function(a,b){return a._distN-b._distN;});
        page=0;nearMode=true;document.getElementById("sf").value="all";
        document.getElementById("nb").textContent="Nearest \\u2713";document.getElementById("nb").style.borderColor="rgba(230,192,115,0.4)";document.getElementById("nb").style.color="#E6C073";document.getElementById("nb").style.opacity="1";
        document.getElementById("nbanner").style.display="block";document.getElementById("nbanner").textContent="Showing "+filtered.length+" cafes nearest to you";render();
      },function(err){document.getElementById("nb").textContent="Near Me";document.getElementById("nb").style.opacity="1";
        if(err.code===1)alert("Location access denied. Allow location in browser settings.");
        else alert("Could not get location. Try again.");
      },{enableHighAccuracy:false,timeout:10000,maximumAge:60000});
    }
    function resetNear(){nearMode=false;filtered=AC;page=0;document.getElementById("sf").value="all";document.getElementById("nb").textContent="Near Me";document.getElementById("nb").style.borderColor="";document.getElementById("nb").style.color="";document.getElementById("nbanner").style.display="none";render();}
    render();
  <\/script>
</body>
</html>`;
}

export default async function handler(req, res) {
  try {
    const slug = req.url.split("/").filter(Boolean).pop().replace("best-coffee-","").replace(".html","");
    const CITIES = {
      "brisbane":{ name:"Brisbane",slug:"brisbane",state:"QLD" },
      "gold-coast":{ name:"Gold Coast",slug:"gold-coast",state:"QLD" },
      "sunshine-coast":{ name:"Sunshine Coast",slug:"sunshine-coast",state:"QLD" },
      "melbourne":{ name:"Melbourne",slug:"melbourne",state:"VIC" },
      "sydney":{ name:"Sydney",slug:"sydney",state:"NSW" },
      "ipswich":{ name:"Ipswich",slug:"ipswich",state:"QLD" },
      "moreton-bay":{ name:"Moreton Bay",slug:"moreton-bay",state:"QLD" },
      "logan":{ name:"Logan",slug:"logan",state:"QLD" },
      "redland":{ name:"Redland",slug:"redland",state:"QLD" },
    };
    const city = CITIES[slug];
    if (!city) { res.status(404).send("City not found"); return; }
    const response = await fetch(SHEET_URL);
    const text = await response.text();
    const cafes = parseCSV(text);
    const canonicalUrl = "https://koffeereview.com.au/best-coffee-" + city.slug;
    const html = renderCityPage(city.name, city.slug, city.state, cafes, canonicalUrl);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    res.status(200).send(html);
  } catch (e) {
    res.status(500).send("Error loading page");
  }
}
