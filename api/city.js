const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYEU8Khk3R5I879v3FcXPqhq0aCXa2ZWM1BwwJOyUitx2Boak_AFTOkwvB8qQrKIeU55NM4htFjHbI/pub?gid=0&single=true&output=csv";

const SPAIN_CITIES = ["barcelona", "catalonia", "spain"];

const CITY_CONFIG = {
  "brisbane": { name: "Brisbane", slug: "brisbane", stateShort: "QLD" },
  "gold-coast": { name: "Gold Coast", slug: "gold-coast", stateShort: "QLD" },
  "moreton-bay": { name: "Moreton Bay", slug: "moreton-bay", stateShort: "QLD" },
  "sunshine-coast": { name: "Sunshine Coast", slug: "sunshine-coast", stateShort: "QLD" },
  "ipswich": { name: "Ipswich", slug: "ipswich", stateShort: "QLD" },
  "melbourne": { name: "Melbourne", slug: "melbourne", stateShort: "VIC" },
  "sydney": { name: "Sydney", slug: "sydney", stateShort: "NSW" },
  "logan": { name: "Logan", slug: "logan", stateShort: "QLD" },
  "redland": { name: "Redland", slug: "redland", stateShort: "QLD" },
};

function makeSlug(n,s){return(n+"-"+s).toLowerCase().replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-").trim();}
function makeCitySlug(c){return c.toLowerCase().replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-").trim();}
function esc(s){return(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
function splitCSVLine(line){const r=[];let c="",q=false;for(let i=0;i<line.length;i++){const ch=line[i];if(ch==='"')q=!q;else if(ch===","&&!q){r.push(c.trim());c="";}else c+=ch;}r.push(c.trim());return r;}
function parseCSV(text){const lines=text.trim().split("\n");const h=splitCSVLine(lines[0]);return lines.slice(1).map(function(line){const v=splitCSVLine(line);const o={};h.forEach(function(k,i){o[k]=v[i]||"";});o.score=parseFloat(o.score)||0;o.lat=parseFloat(o.lat)||0;o.lng=parseFloat(o.lng)||0;return o;}).filter(function(c){return c.name&&c.score>0&&!SPAIN_CITIES.includes((c.city||"").toLowerCase());});}
function getScoreColor(s){if(s>=9)return"#ffffff";if(s>=8)return"#4ade80";if(s>=7)return"#2dd4bf";if(s>=6)return"#facc15";if(s>=5)return"#fb923c";return"#f87171";}
function getVerdict(s){if(s>=9.1)return"ELITE";if(s>=8.1)return"GREAT";if(s>=7.5)return"MUST VISIT";if(s>=7.1)return"SOLID";if(s>=6.5)return"DECENT";if(s>=5.5)return"AVERAGE";if(s>=5.1)return"JUST OKAY";return"AVOID";}

function renderCityPage(citySlug, cafes) {
  const config = CITY_CONFIG[citySlug];
  if (!config) return null;
  const cityCafes = cafes.filter(function(c){return makeCitySlug(c.city)===citySlug;}).sort(function(a,b){return b.score-a.score;});
  if (cityCafes.length === 0) return null;

  const mustVisit = cityCafes.filter(function(c){return c.score>=7.5;}).length;
  const avg = (cityCafes.reduce(function(s,c){return s+c.score;},0)/cityCafes.length).toFixed(1);
  const suburbs = [...new Set(cityCafes.map(function(c){return c.suburb;}))].length;
  const suburbList = [...new Set(cityCafes.map(function(c){return c.suburb;}))].sort();
  const topCafe = cityCafes[0];

  const title = "Best Coffee in "+config.name+" 2026 | "+cityCafes.length+"+ Cafés | Koffee Review";
  const desc = config.name+"'s best cafés reviewed and scored. "+cityCafes.length+"+ cafés rated with one latte and one double shot espresso. No sponsorships. Know before you go.";
  const canonicalUrl = "https://koffeereview.com.au/city/"+citySlug;

  const contextLine = mustVisit>=5
    ? config.name+" is a strong city for coffee. "+mustVisit+" cafés worth going out of your way for."
    : mustVisit>0
    ? config.name+" has solid options. Top pick: "+topCafe.name+" at "+topCafe.score.toFixed(1)+"."
    : config.name+" has room to improve. Best so far: "+topCafe.name+" at "+topCafe.score.toFixed(1)+".";

  const cafeData = JSON.stringify(cityCafes.map(function(c){return{n:esc(c.name),s:esc(c.suburb),sc:c.score,sl:makeSlug(c.name,c.suburb),p:esc(c.price||""),nt:esc((c.notes||"").substring(0,70)),v:esc((c.verdict||getVerdict(c.score)).toUpperCase()),la:c.lat,ln:c.lng};})).replace(/</g,"\\u003c");

  const suburbOptions = suburbList.map(function(s){return'<option value="'+esc(s)+'">'+esc(s)+'</option>';}).join("");

  // Browse by suburb cards
  const suburbMap = {};
  cityCafes.forEach(function(c){if(!c.suburb)return;if(!suburbMap[c.suburb])suburbMap[c.suburb]={cafes:[],total:0};suburbMap[c.suburb].cafes.push(c);suburbMap[c.suburb].total+=c.score;});
  const hotSuburbs = Object.keys(suburbMap).filter(function(s){return suburbMap[s].cafes.length>=3;}).map(function(s){const d=suburbMap[s];const sorted=d.cafes.sort(function(a,b){return b.score-a.score;});return{name:s,count:d.cafes.length,avg:(d.total/d.cafes.length).toFixed(1),top:sorted[0].name,topSc:sorted[0].score,slug:s.toLowerCase().replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-")};}).sort(function(a,b){return b.avg-a.avg;});

  const suburbCards = hotSuburbs.map(function(s){
    const col = s.topSc>=8?"#4ade80":s.topSc>=7?"#2dd4bf":"#facc15";
    return '<a href="/suburb/'+s.slug+'-'+citySlug+'" class="sub-card"><div class="sub-name">'+esc(s.name)+'</div><div class="sub-meta">'+s.count+' cafés · avg '+s.avg+'</div><div class="sub-row"><span class="sub-top">Top: '+esc(s.top)+'</span><span class="sub-sc" style="color:'+col+'">'+s.topSc.toFixed(1)+'</span></div></a>';
  }).join("");

  // Noscript fallback
  const noscript = cityCafes.slice(0,50).map(function(c){return'<a href="/review/'+makeSlug(c.name,c.suburb)+'" style="display:block;padding:4px 0;color:#2dd4bf;font-size:13px;text-decoration:none">'+c.score.toFixed(1)+' '+esc(c.name)+' — '+esc(c.suburb)+'</a>';}).join("");

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
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Koffee Review","item":"https://koffeereview.com.au"},{"@type":"ListItem","position":2,"name":"Best Coffee ${config.name}","item":"${canonicalUrl}"}]}</script>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{background:#0d0d0f;color:#d4d4d4;font-family:'DM Sans',sans-serif;min-height:100vh;-webkit-font-smoothing:antialiased}
    .c{max-width:800px;margin:0 auto;padding:0 20px}
    nav{display:flex;align-items:center;justify-content:space-between;padding:14px 20px;border-bottom:1px solid rgba(230,192,115,0.08)}.nav-logo{display:flex;align-items:center;gap:10px;text-decoration:none}.nav-logo img{width:34px;height:34px;border-radius:50%;border:1.5px solid rgba(230,192,115,0.25)}.nav-logo span{font-family:'Bebas Neue',sans-serif;font-size:15px;letter-spacing:3px;color:#E6C073}.nav-links{display:flex;gap:14px}.nav-links a{font-size:12px;color:rgba(255,255,255,0.45);text-decoration:none}.nav-links a:hover{color:#E6C073}
    .hero{padding:36px 0 20px;text-align:center}.hero-tag{display:inline-block;padding:5px 16px;border-radius:24px;font-size:10px;font-weight:700;letter-spacing:3px;background:rgba(230,192,115,0.08);color:#E6C073;border:1px solid rgba(230,192,115,0.2);margin-bottom:14px}
    h1{font-family:'Bebas Neue',sans-serif;font-size:clamp(32px,7vw,52px);letter-spacing:3px;line-height:1.05;color:#fff;margin-bottom:10px}
    .hero-sub{font-size:14px;color:rgba(255,255,255,0.5);line-height:1.7;max-width:540px;margin:0 auto}
    .gold-line{height:1px;background:linear-gradient(90deg,transparent,rgba(230,192,115,0.3),transparent);margin:16px 0}
    .stats{display:flex;gap:0;margin:0 auto 16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;overflow:hidden}.stat{flex:1;text-align:center;padding:14px 8px;border-right:1px solid rgba(255,255,255,0.04)}.stat:last-child{border:none}.stat-n{font-family:'Bebas Neue',sans-serif;font-size:26px;color:#E6C073;line-height:1}.stat-l{font-size:9px;letter-spacing:2px;color:rgba(255,255,255,0.35);margin-top:2px}
    .context{font-size:13px;color:rgba(255,255,255,0.4);font-style:italic;text-align:center;margin-bottom:20px}
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
    .sub-section{margin-top:32px;padding-top:24px;border-top:1px solid rgba(255,255,255,0.04)}.sub-title{font-family:'Bebas Neue',sans-serif;font-size:14px;letter-spacing:3px;color:rgba(255,255,255,0.4);margin-bottom:4px}.sub-desc{font-size:12px;color:rgba(255,255,255,0.3);margin-bottom:14px}
    .sub-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:8px}
    .sub-card{display:block;padding:14px 16px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:12px;text-decoration:none;color:inherit;transition:all 0.15s}.sub-card:hover{border-color:rgba(230,192,115,0.2);background:rgba(255,255,255,0.04)}
    .sub-name{font-weight:600;font-size:14px;color:#fff;margin-bottom:3px}.sub-meta{font-size:11px;color:rgba(255,255,255,0.4);margin-bottom:6px}.sub-row{display:flex;align-items:center;justify-content:space-between}.sub-top{font-size:11px;color:rgba(255,255,255,0.35)}.sub-sc{font-family:'Bebas Neue',sans-serif;font-size:16px}
    .ft{margin-top:36px;padding:24px 0;border-top:1px solid rgba(255,255,255,0.04);text-align:center}.ft p{font-size:12px;color:rgba(255,255,255,0.3);line-height:1.7;margin-bottom:12px}.ft a{color:rgba(255,255,255,0.5);text-decoration:none;font-size:11px}.ft a:hover{color:#E6C073}
    .browse-btn{display:inline-flex;align-items:center;gap:8px;padding:12px 24px;border-radius:12px;background:linear-gradient(135deg,#c8a96e,#f5e6c8);color:#0a0a0a;font-weight:700;font-size:13px;text-decoration:none;margin-bottom:16px}.browse-btn img{width:20px;height:20px;border-radius:50%}
    .avoid-link{display:inline-flex;align-items:center;gap:6px;padding:10px 18px;border-radius:12px;border:1px solid rgba(248,113,113,0.25);background:rgba(248,113,113,0.05);color:#f87171;text-decoration:none;font-size:12px;font-weight:600;margin-bottom:16px}
    @media(max-width:480px){.stats{flex-wrap:wrap}.stat{min-width:45%}.cc-nm{font-size:13px}}
  </style>
</head>
<body>
  <div class="c">
    <nav>
      <a href="/" class="nav-logo"><img src="/logo.webp" alt="KR"><span>KOFFEE REVIEW</span></a>
      <div class="nav-links"><a href="/leaderboard">Leaderboard</a><a href="/map">Map</a><a href="/blog">Blog</a></div>
    </nav>

    <div class="hero">
      <div class="hero-tag">${config.stateShort} · CITY GUIDE</div>
      <h1>Best Coffee in ${config.name}</h1>
      <p class="hero-sub">Every café reviewed with the same two drinks — one latte, one double shot espresso. No sponsorships, no agendas. ${cityCafes.length}+ ${config.name} cafés scored.</p>
    </div>
    <div class="gold-line"></div>

    <div class="stats">
      <div class="stat"><div class="stat-n">${cityCafes.length}</div><div class="stat-l">REVIEWED</div></div>
      <div class="stat"><div class="stat-n" style="color:${mustVisit>=5?"#4ade80":"#E6C073"}">${mustVisit}</div><div class="stat-l">MUST VISIT</div></div>
      <div class="stat"><div class="stat-n" style="color:${parseFloat(avg)>=7?"#4ade80":"#facc15"}">${avg}</div><div class="stat-l">AVG SCORE</div></div>
      <div class="stat"><div class="stat-n">${suburbs}</div><div class="stat-l">SUBURBS</div></div>
    </div>
    <p class="context">${contextLine}</p>
    <p style="font-size:11px;color:rgba(255,255,255,0.25);text-align:center;margin-bottom:16px">Last updated May 2026</p>

    <div class="filter-bar">
      <div class="section-title">ALL ${config.name.toUpperCase()} CAFÉS</div>
      <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">
        <select id="sf" onchange="filterSuburb(this.value)">${suburbOptions ? '<option value="all">All Suburbs</option>'+suburbOptions : ''}</select>
        <button class="near-btn" id="nb" onclick="nearMe()">📍 Near Me</button>
      </div>
    </div>
    <div class="near-banner" id="nbanner">📍 Showing cafés closest to you</div>

    <div id="cl"></div>
    <button class="lm-btn" id="lmBtn" onclick="loadMore()" style="display:none">LOAD MORE</button>
    <div class="count-label" id="countLabel"></div>

    <noscript>${noscript}</noscript>

    ${hotSuburbs.length > 0 ? '<div class="sub-section"><div class="sub-title">BROWSE '+config.name.toUpperCase()+' BY SUBURB</div><div class="sub-desc">Suburbs with 3+ reviewed cafés</div><div class="sub-grid">'+suburbCards+'</div></div>' : ''}

    ${citySlug==="brisbane" ? '<div style="text-align:center;margin-top:24px"><a href="/brisbane-cafes-to-avoid" class="avoid-link">⚠ Cafés to Avoid in Brisbane →</a></div>' : ''}

    <div class="ft">
      <p>All scores based on one latte and one double shot espresso, ordered the same way every time. No café pays for placement. <a href="/how-we-score" style="color:#E6C073">How we score →</a></p>
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
    function nearMe(){if(!navigator.geolocation){alert("Location not supported");return;}
      document.getElementById("nb").textContent="📍 Locating...";
      navigator.geolocation.getCurrentPosition(function(p){
        var la=p.coords.latitude,ln=p.coords.longitude;
        filtered=AC.map(function(c){var d=(c.la&&c.ln&&Math.abs(c.la)>1)?distKm(la,ln,c.la,c.ln):9999;return Object.assign({},c,{_dist:d<9999?(d<1?(d*1000).toFixed(0)+"m":d.toFixed(1)+"km")+" away":"",_distN:d});}).sort(function(a,b){return a._distN-b._distN;});
        page=0;nearMode=true;document.getElementById("sf").value="all";
        document.getElementById("nb").textContent="📍 Near Me ✓";document.getElementById("nb").style.borderColor="rgba(230,192,115,0.4)";document.getElementById("nb").style.color="#E6C073";
        document.getElementById("nbanner").style.display="block";render();
      },function(){document.getElementById("nb").textContent="📍 Near Me";alert("Could not get location.");});
    }
    render();
  <\/script>
</body>
</html>`;
}

export default async function handler(req, res) {
  try {
    const citySlug = req.query.city;
    if (!citySlug || !CITY_CONFIG[citySlug]) { res.status(404).send("City not found"); return; }
    const response = await fetch(SHEET_URL);
    const text = await response.text();
    const cafes = parseCSV(text);
    const html = renderCityPage(citySlug, cafes);
    if (!html) { res.status(404).send("No cafés found"); return; }
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    res.status(200).send(html);
  } catch (e) {
    res.status(500).send("Error loading city page");
  }
}
