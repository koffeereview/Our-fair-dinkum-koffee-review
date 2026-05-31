const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYEU8Khk3R5I879v3FcXPqhq0aCXa2ZWM1BwwJOyUitx2Boak_AFTOkwvB8qQrKIeU55NM4htFjHbI/pub?gid=0&single=true&output=csv";

function splitCSV(line){var r=[],c="",q=false;for(var i=0;i<line.length;i++){var ch=line[i];if(ch==='"')q=!q;else if(ch===","&&!q){r.push(c.trim());c="";}else c+=ch;}r.push(c.trim());return r;}
function esc(s){return(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}

function parseCSV(text){
  var lines=text.split("\n").filter(function(l){return l.trim();});
  if(lines.length<2)return[];
  var h=splitCSV(lines[0]).map(function(x){return x.trim().toLowerCase();});
  var ni=h.indexOf("name"),si=h.indexOf("suburb"),ci=h.indexOf("city"),sci=h.indexOf("score");
  if(ni===-1||si===-1)return[];
  var out=[];
  for(var i=1;i<lines.length;i++){try{var p=splitCSV(lines[i]);var n=(p[ni]||"").trim();if(!n)continue;var sc=parseFloat(p[sci])||0;if(sc<=0)continue;
  var city=(p[ci]||"").trim();if(["barcelona","catalonia","spain"].indexOf(city.toLowerCase())!==-1)continue;
  out.push({name:n,suburb:(p[si]||"").trim(),city:city,score:sc});}catch(e){}}
  return out;
}

export default async function handler(req,res){
  try{
    var response=await fetch(SHEET_URL);var text=await response.text();var cafes=parseCSV(text);
    var total=cafes.length;
    var cityCount={};cafes.forEach(function(c){if(c.city)cityCount[c.city]=(cityCount[c.city]||0)+1;});
    var cities=Object.keys(cityCount).sort(function(a,b){return cityCount[b]-cityCount[a];});
    var suburbCount={};cafes.forEach(function(c){if(c.suburb){suburbCount[c.suburb]=(suburbCount[c.suburb]||0)+1;}});
    var topSuburbs=Object.keys(suburbCount).filter(function(s){return suburbCount[s]>=3;}).sort(function(a,b){return suburbCount[b]-suburbCount[a];}).slice(0,12);
    var mustVisit=cafes.filter(function(c){return c.score>=7.5;}).length;
    var avgScore=(cafes.reduce(function(s,c){return s+c.score;},0)/cafes.length).toFixed(1);

    var title="Explore Koffee Review | "+total+"+ Cafes Reviewed Across Australia";
    var desc="Your complete guide to Koffee Review. Browse "+total+"+ cafe reviews, city guides, suburb rankings, interactive tools, and more.";

    function makeSlug(s){return s.toLowerCase().replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-");}

    function cityCard(name,count,slug,accent){
      return'<a href="/city/'+slug+'" class="card" style="border-left:3px solid '+accent+'"><div class="card-top"><div class="card-title">'+esc(name)+'</div><span class="card-count" style="color:'+accent+'">'+count+'</span></div><div class="card-sub">cafes reviewed</div></a>';
    }
    function bestCard(name,slug){
      return'<a href="/best-coffee-'+slug+'" class="card" style="border-left:3px solid #E6C073"><div class="card-top"><div class="card-title" style="color:#E6C073">Best Coffee '+esc(name)+'</div><span class="card-arrow" style="color:#E6C073">&#8594;</span></div><div class="card-sub">Ranked by score</div></a>';
    }
    function pageCard(t,sub,url,accent){
      return'<a href="'+url+'" class="card" style="border-left:3px solid '+accent+'"><div class="card-top"><div class="card-title">'+t+'</div><span class="card-arrow" style="color:'+accent+'">&#8594;</span></div><div class="card-sub">'+sub+'</div></a>';
    }
    function suburbCard(name,count){
      var slug=makeSlug(name);
      var cityName=(cafes.find(function(c){return c.suburb===name;})||{}).city||"Brisbane";
      var citySlug=makeSlug(cityName);
      return'<a href="/suburb/'+slug+'-'+citySlug+'" class="card-sm"><div class="card-sm-name">'+esc(name)+'</div><div class="card-sm-count">'+count+' cafes</div></a>';
    }
    function landmarkCard(name,slug){
      return'<a href="/coffee-near/'+slug+'" class="card-sm" style="border-left:2px solid rgba(45,212,191,0.3)"><div class="card-sm-name" style="color:#2dd4bf">'+name+'</div><div class="card-sm-count">Nearest cafes</div></a>';
    }

    var cityCards=cities.slice(0,10).map(function(c){
      var slug=makeSlug(c);
      var accent=cityCount[c]>=50?"#4ade80":cityCount[c]>=20?"#2dd4bf":cityCount[c]>=10?"#facc15":"#fb923c";
      return cityCard(c,cityCount[c],slug,accent);
    }).join("");

    var bestCards=cities.slice(0,6).map(function(c){return bestCard(c,makeSlug(c));}).join("");
    var subCards=topSuburbs.map(function(s){return suburbCard(s,suburbCount[s]);}).join("");

    var landmarks=[
      ["South Bank","south-bank"],["Queen Street Mall","queen-street-mall"],["Brisbane CBD","brisbane-cbd"],
      ["Suncorp Stadium","suncorp-stadium"],["The Gabba","the-gabba"],["Fortitude Valley","fortitude-valley"],
      ["Howard Smith Wharves","howard-smith-wharves"],["James Street","james-street"],["New Farm Park","new-farm-park"],
      ["UQ St Lucia","uq-st-lucia"],["QUT Gardens Point","qut-gardens-point"],["Roma Street","roma-street"],
      ["West Village","west-village"],["Eat Street","eat-street"],["Mt Coot-tha","mt-coot-tha"],
      ["Kangaroo Point","kangaroo-point"],["Brisbane Airport","brisbane-airport"],
      ["Surfers Paradise","surfers-paradise"],["Pacific Fair","pacific-fair"],["Burleigh Beach","burleigh-beach"]
    ];
    var landmarkCards=landmarks.map(function(l){return landmarkCard(l[0],l[1]);}).join("");

    var html=`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${desc}">
  <link rel="canonical" href="https://koffeereview.com.au/explore">
  <meta property="og:title" content="${title}"><meta property="og:description" content="${desc}">
  <meta property="og:url" content="https://koffeereview.com.au/explore"><meta property="og:image" content="https://koffeereview.com.au/logo.webp">
  <link rel="icon" href="/logo.webp">
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"CollectionPage","name":"Explore Koffee Review","description":"${desc}","url":"https://koffeereview.com.au/explore","publisher":{"@type":"Organization","name":"Koffee Review"}}<\/script>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{background:#0a0a0c;color:#d4d4d4;font-family:'DM Sans',sans-serif;min-height:100vh;-webkit-font-smoothing:antialiased}
    .c{max-width:800px;margin:0 auto;padding:0 20px 40px}

    /* Header — logo only, no nav links */
    .header{display:flex;align-items:center;justify-content:center;padding:18px 0;border-bottom:1px solid rgba(230,192,115,0.06)}
    .header a{display:flex;align-items:center;gap:10px;text-decoration:none}
    .header img{width:36px;height:36px;border-radius:50%;border:1.5px solid rgba(230,192,115,0.25)}
    .header span{font-family:'Bebas Neue',sans-serif;font-size:16px;letter-spacing:4px;color:#E6C073}

    .hero{text-align:center;padding:28px 0 14px}
    h1{font-family:'Bebas Neue',sans-serif;font-size:clamp(36px,9vw,56px);letter-spacing:5px;color:#fff;margin-bottom:6px;line-height:1}
    .hero-tag{display:inline-block;padding:4px 16px;border-radius:20px;font-size:9px;font-weight:700;letter-spacing:3px;color:#E6C073;border:1px solid rgba(230,192,115,0.2);background:rgba(230,192,115,0.06);margin-bottom:14px}
    .hero-sub{font-size:13px;color:rgba(255,255,255,0.4);line-height:1.6;max-width:440px;margin:0 auto}
    .gold-line{height:1px;background:linear-gradient(90deg,transparent,rgba(230,192,115,0.35),transparent);margin:14px 0}

    .stats{display:flex;gap:0;margin:0 auto 24px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05);border-radius:14px;overflow:hidden}
    .stat{flex:1;text-align:center;padding:16px 8px;border-right:1px solid rgba(255,255,255,0.03)}.stat:last-child{border:none}
    .stat-n{font-family:'Bebas Neue',sans-serif;font-size:28px;color:#E6C073;line-height:1}
    .stat-l{font-size:8px;letter-spacing:2.5px;color:rgba(255,255,255,0.25);margin-top:3px;font-weight:600}

    /* Section headers */
    .section{margin-top:28px}
    .sh{display:flex;align-items:center;gap:14px;margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid rgba(255,255,255,0.03)}
    .sh-icon{width:40px;height:40px;border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
    .sh-label{font-family:'Bebas Neue',sans-serif;font-size:18px;letter-spacing:4px;color:#fff}
    .sh-desc{font-size:11px;color:rgba(255,255,255,0.3);margin-top:3px;letter-spacing:0.3px}

    /* Cards — 2 columns */
    .g2{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px}
    .card{display:block;padding:14px 16px;background:rgba(255,255,255,0.018);border:1px solid rgba(255,255,255,0.045);border-radius:12px;text-decoration:none;color:inherit;transition:all 0.18s;overflow:hidden}
    .card:hover{border-color:rgba(230,192,115,0.22);background:rgba(255,255,255,0.04);transform:translateY(-1px)}
    .card-top{display:flex;align-items:center;justify-content:space-between}
    .card-title{font-size:13px;font-weight:600;color:#fff;line-height:1.3}
    .card-arrow{font-size:13px;flex-shrink:0;margin-left:6px;opacity:0.5}
    .card-count{font-family:'Bebas Neue',sans-serif;font-size:18px;flex-shrink:0;margin-left:8px}
    .card-sub{font-size:10px;color:rgba(255,255,255,0.3);margin-top:3px}

    /* Featured hero cards */
    .fg{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px}
    .fc{display:block;padding:20px;border-radius:14px;text-decoration:none;color:inherit;transition:all 0.2s;position:relative;overflow:hidden}
    .fc:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,0.3)}
    .fc-icon{margin-bottom:10px}
    .fc-title{font-size:16px;font-weight:700;color:#fff;margin-bottom:4px}
    .fc-sub{font-size:11px;line-height:1.5}
    .fc-arrow{position:absolute;bottom:16px;right:18px;font-size:14px;opacity:0.4}

    /* Small cards — suburbs/landmarks */
    .g3{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:6px;margin-bottom:8px}
    .card-sm{display:block;padding:10px 12px;background:rgba(255,255,255,0.015);border:1px solid rgba(255,255,255,0.04);border-radius:10px;text-decoration:none;color:inherit;transition:all 0.15s}
    .card-sm:hover{border-color:rgba(230,192,115,0.2);background:rgba(255,255,255,0.04)}
    .card-sm-name{font-size:12px;font-weight:600;color:rgba(255,255,255,0.75)}
    .card-sm-count{font-size:9px;color:rgba(255,255,255,0.25);margin-top:2px}

    /* Sub label */
    .sub-label{font-family:'Bebas Neue',sans-serif;font-size:10px;letter-spacing:3px;color:rgba(255,255,255,0.2);margin:18px 0 8px 2px;font-weight:600}

    /* Divider */
    .divider{height:1px;background:linear-gradient(90deg,transparent,rgba(230,192,115,0.08),transparent);margin:32px 0}

    /* Wide card */
    .wide{display:flex;align-items:center;gap:16px;padding:20px;border-radius:14px;text-decoration:none;color:inherit;transition:all 0.2s;margin-bottom:10px;position:relative}
    .wide:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,0.3)}
    .wide-icon{width:52px;height:52px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0}
    .wide-title{font-size:16px;font-weight:700;color:#fff;margin-bottom:2px}
    .wide-sub{font-size:12px;line-height:1.5}

    /* Footer — minimal */
    .ft{margin-top:36px;text-align:center;padding:16px 0}
    .ft-copy{font-size:10px;color:rgba(255,255,255,0.2);letter-spacing:0.5px}

    @media(max-width:480px){.g2,.fg{grid-template-columns:1fr}.stats{flex-wrap:wrap}.stat{min-width:45%}}
  </style>
</head>
<body>
  <div class="c">
    <!-- Header — logo only, centred -->
    <div class="header"><a href="/"><img src="/logo.webp" alt="Koffee Review"><span>KOFFEE REVIEW</span></a></div>

    <div class="hero">
      <div class="hero-tag">${total}+ CAFES REVIEWED</div>
      <h1>EXPLORE</h1>
      <p class="hero-sub">${total}+ cafes reviewed across ${cities.length} cities. One latte, one double shot, every time.</p>
    </div>
    <div class="gold-line"></div>

    <div class="stats">
      <div class="stat"><div class="stat-n">${total}</div><div class="stat-l">REVIEWED</div></div>
      <div class="stat"><div class="stat-n">${mustVisit}</div><div class="stat-l">MUST VISIT</div></div>
      <div class="stat"><div class="stat-n">${cities.length}</div><div class="stat-l">CITIES</div></div>
      <div class="stat"><div class="stat-n">${avgScore}</div><div class="stat-l">AVG SCORE</div></div>
    </div>

    <!-- ═══ SEARCH A COFFEE ═══ -->
    <div class="section">
      <div class="sh">
        <div class="sh-icon" style="background:rgba(230,192,115,0.06);border:1px solid rgba(230,192,115,0.12)">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="#E6C073" stroke-width="2"/><path d="M21 21l-4.35-4.35" stroke="#E6C073" stroke-width="2" stroke-linecap="round"/></svg>
        </div>
        <div><div class="sh-label">SEARCH A COFFEE</div><div class="sh-desc">Find the best cafes by city, suburb, or category</div></div>
      </div>

      <div class="fg">
        <a href="/leaderboard" class="fc" style="background:linear-gradient(145deg,rgba(230,192,115,0.1),rgba(230,192,115,0.02));border:1px solid rgba(230,192,115,0.2)">
          <div class="fc-icon"><svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#E6C073"/></svg></div>
          <div class="fc-title">Leaderboard</div>
          <div class="fc-sub" style="color:rgba(230,192,115,0.55)">Australia's top ranked cafes</div>
          <span class="fc-arrow" style="color:#E6C073">&#8594;</span>
        </a>
        <a href="/hidden-gem-cafes-brisbane" class="fc" style="background:linear-gradient(145deg,rgba(45,212,191,0.1),rgba(45,212,191,0.02));border:1px solid rgba(45,212,191,0.2)">
          <div class="fc-icon"><svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M12 2L15 9H22L16.5 13.5L18.5 21L12 16.5L5.5 21L7.5 13.5L2 9H9L12 2Z" stroke="#2dd4bf" stroke-width="1.5" fill="none"/><circle cx="12" cy="12" r="3" fill="#2dd4bf"/></svg></div>
          <div class="fc-title">Hidden Gems</div>
          <div class="fc-sub" style="color:rgba(45,212,191,0.55)">Underrated cafes worth the trip</div>
          <span class="fc-arrow" style="color:#2dd4bf">&#8594;</span>
        </a>
      </div>

      <div class="g2">
        ${bestCards}
      </div>
      <div class="g2">
        ${pageCard("Best Latte Brisbane","Latte specific rankings","/best-latte-brisbane","#E6C073")}
        ${pageCard("Cafes to Avoid","Save your money","/brisbane-cafes-to-avoid","#f87171")}
        ${pageCard("Worst by Suburb","Lowest scored per suburb","/worst-cafes-by-suburb","#f87171")}
        ${pageCard("New This Month","Latest reviews weekly","/new","#4ade80")}
      </div>

      <div class="sub-label">BROWSE BY CITY</div>
      <div class="g2">${cityCards}</div>

      <div class="sub-label">POPULAR SUBURBS</div>
      <div class="g3">${subCards}</div>
    </div>

    <div class="divider"></div>

    <!-- ═══ RESEARCH ═══ -->
    <div class="section">
      <div class="sh">
        <div class="sh-icon" style="background:rgba(96,165,250,0.06);border:1px solid rgba(96,165,250,0.12)">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" stroke="#60a5fa" stroke-width="2"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" stroke="#60a5fa" stroke-width="2"/></svg>
        </div>
        <div><div class="sh-label">RESEARCH</div><div class="sh-desc">Tools, data, and guides to find better coffee</div></div>
      </div>

      <div class="fg">
        <a href="/map" class="fc" style="background:linear-gradient(145deg,rgba(230,192,115,0.08),rgba(230,192,115,0.01));border:1px solid rgba(230,192,115,0.15)">
          <div class="fc-icon"><svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z" stroke="#E6C073" stroke-width="1.8"/><circle cx="12" cy="10" r="3" fill="#E6C073"/></svg></div>
          <div class="fc-title">Coffee Heat Map</div>
          <div class="fc-sub" style="color:rgba(230,192,115,0.55)">Score density across suburbs</div>
          <span class="fc-arrow" style="color:#E6C073">&#8594;</span>
        </a>
        <a href="/compare" class="fc" style="background:linear-gradient(145deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01));border:1px solid rgba(255,255,255,0.07)">
          <div class="fc-icon"><svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M12 3V21" stroke="rgba(255,255,255,0.55)" stroke-width="1.8" stroke-linecap="round"/><path d="M5 7L12 3L19 7" stroke="rgba(255,255,255,0.55)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 7L2 15H8L5 7Z" stroke="rgba(255,255,255,0.55)" stroke-width="1.5" stroke-linejoin="round"/><path d="M19 7L16 15H22L19 7Z" stroke="rgba(255,255,255,0.55)" stroke-width="1.5" stroke-linejoin="round"/></svg></div>
          <div class="fc-title">Compare Cafes</div>
          <div class="fc-sub" style="color:rgba(255,255,255,0.35)">Head to head score breakdown</div>
          <span class="fc-arrow" style="color:rgba(255,255,255,0.3)">&#8594;</span>
        </a>
      </div>

      <div class="g2">
        ${pageCard("Blog","Guides, lists, deep dives","/blog","#60a5fa")}
        ${pageCard("How We Score","Our method and scoring system","/how-we-score","#E6C073")}
      </div>

      <div class="sub-label">COFFEE NEAR LANDMARKS</div>
      <div class="g3">${landmarkCards}</div>
    </div>

    <div class="divider"></div>

    <!-- ═══ FUN ═══ -->
    <div class="section">
      <div class="sh">
        <div class="sh-icon" style="background:rgba(244,114,182,0.06);border:1px solid rgba(244,114,182,0.12)">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#f472b6" stroke-width="2"/><path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="#f472b6" stroke-width="2" stroke-linecap="round"/><circle cx="9" cy="10" r="1" fill="#f472b6"/><circle cx="15" cy="10" r="1" fill="#f472b6"/></svg>
        </div>
        <div><div class="sh-label">FUN</div><div class="sh-desc">Interactive tools to discover your next coffee</div></div>
      </div>

      <a href="/random" class="wide" style="background:linear-gradient(145deg,rgba(244,114,182,0.07),rgba(167,139,250,0.04));border:1px solid rgba(244,114,182,0.18)">
        <div class="wide-icon" style="background:linear-gradient(135deg,rgba(244,114,182,0.12),rgba(167,139,250,0.08));border:1px solid rgba(244,114,182,0.2)">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#f472b6" stroke-width="1.5"/><path d="M12 2L12 12L18 6" stroke="#f472b6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="3" fill="#f472b6" fill-opacity="0.3"/></svg>
        </div>
        <div>
          <div class="wide-title">Spin for Coffee</div>
          <div class="wide-sub" style="color:rgba(244,114,182,0.6)">Can't decide? Spin the wheel and let fate pick. Filter by city, suburb, or score.</div>
        </div>
      </a>
    </div>

    <div class="divider"></div>

    <!-- ═══ CONNECT ═══ -->
    <div class="section">
      <div class="sh">
        <div class="sh-icon" style="background:rgba(230,192,115,0.06);border:1px solid rgba(230,192,115,0.12)">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" stroke="#E6C073" stroke-width="1.5" stroke-linejoin="round"/></svg>
        </div>
        <div><div class="sh-label">CONNECT</div><div class="sh-desc">Follow us across platforms</div></div>
      </div>

      <div class="g2">
        <a href="https://www.instagram.com/koffeereview" target="_blank" rel="noreferrer" class="card" style="border-left:3px solid #e879f9"><div class="card-top"><div class="card-title">Instagram</div><span class="card-arrow" style="color:#e879f9">&#8594;</span></div><div class="card-sub">@koffeereview</div></a>
        <a href="https://www.tiktok.com/@koffeereview" target="_blank" rel="noreferrer" class="card" style="border-left:3px solid #22d3ee"><div class="card-top"><div class="card-title">TikTok</div><span class="card-arrow" style="color:#22d3ee">&#8594;</span></div><div class="card-sub">@koffeereview</div></a>
        <a href="https://www.youtube.com/@koffeereview" target="_blank" rel="noreferrer" class="card" style="border-left:3px solid #f87171"><div class="card-top"><div class="card-title">YouTube</div><span class="card-arrow" style="color:#f87171">&#8594;</span></div><div class="card-sub">@koffeereview</div></a>
        <a href="https://linktr.ee/koffeereview" target="_blank" rel="noreferrer" class="card" style="border-left:3px solid #4ade80"><div class="card-top"><div class="card-title">Linktree</div><span class="card-arrow" style="color:#4ade80">&#8594;</span></div><div class="card-sub">All links in one place</div></a>
      </div>
    </div>

    <!-- Footer — minimal -->
    <div class="ft">
      <div class="ft-copy">&copy; 2026 Our Fair Dinkum Koffee Review</div>
    </div>
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
