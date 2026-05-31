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
    var suburbCount={};cafes.forEach(function(c){if(c.suburb){var k=c.suburb;suburbCount[k]=(suburbCount[k]||0)+1;}});
    var topSuburbs=Object.keys(suburbCount).filter(function(s){return suburbCount[s]>=3;}).sort(function(a,b){return suburbCount[b]-suburbCount[a];}).slice(0,12);
    var mustVisit=cafes.filter(function(c){return c.score>=7.5;}).length;
    var avgScore=(cafes.reduce(function(s,c){return s+c.score;},0)/cafes.length).toFixed(1);

    var title="Explore Koffee Review | Every Page, Tool & Guide | "+total+"+ Cafes Reviewed";
    var desc="Your complete guide to everything on Koffee Review. Browse "+total+"+ cafe reviews, city guides, suburb rankings, tools, and more. One latte. One double shot. Every time.";

    // Build city cards
    function cityCard(name,count,slug,accent){
      return'<a href="/city/'+slug+'" class="card" style="border-left:3px solid '+accent+'"><div class="card-top"><div class="card-title">'+esc(name)+'</div><span class="card-arrow" style="color:'+accent+'">&#8594;</span></div><div class="card-sub">'+count+' cafes reviewed</div></a>';
    }
    function bestCard(name,slug,accent){
      return'<a href="/best-coffee-'+slug+'" class="card" style="border-left:3px solid '+accent+'"><div class="card-top"><div class="card-title">Best Coffee in '+esc(name)+'</div><span class="card-arrow" style="color:'+accent+'">&#8594;</span></div><div class="card-sub">Ranked by score</div></a>';
    }
    function pageCard(title,sub,url,accent){
      return'<a href="'+url+'" class="card" style="border-left:3px solid '+accent+'"><div class="card-top"><div class="card-title">'+title+'</div><span class="card-arrow" style="color:'+accent+'">&#8594;</span></div><div class="card-sub">'+sub+'</div></a>';
    }
    function suburbCard(name,count){
      var slug=name.toLowerCase().replace(/[^a-z0-9\s-]/g,"").replace(/\\s+/g,"-");
      var citySlug=(cafes.find(function(c){return c.suburb===name;})||{}).city||"brisbane";
      citySlug=citySlug.toLowerCase().replace(/\\s+/g,"-");
      return'<a href="/suburb/'+slug+'-'+citySlug+'" class="card-sm"><div class="card-sm-name">'+esc(name)+'</div><div class="card-sm-count">'+count+' cafes</div></a>';
    }

    // City cards
    var cityCards=cities.slice(0,8).map(function(c){
      var slug=c.toLowerCase().replace(/[^a-z0-9\s-]/g,"").replace(/\\s+/g,"-");
      var accent=cityCount[c]>=50?"#4ade80":cityCount[c]>=20?"#2dd4bf":cityCount[c]>=10?"#facc15":"#fb923c";
      return cityCard(c,cityCount[c],slug,accent);
    }).join("");

    // Best coffee cards
    var bestCards=cities.slice(0,6).map(function(c){
      var slug=c.toLowerCase().replace(/[^a-z0-9\s-]/g,"").replace(/\\s+/g,"-");
      return bestCard(c,slug,"#E6C073");
    }).join("");

    // Suburb cards
    var subCards=topSuburbs.map(function(s){return suburbCard(s,suburbCount[s]);}).join("");

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
    .c{max-width:800px;margin:0 auto;padding:0 20px 60px}
    nav{display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid rgba(230,192,115,0.08)}.nav-logo{display:flex;align-items:center;gap:10px;text-decoration:none}.nav-logo img{width:34px;height:34px;border-radius:50%;border:1.5px solid rgba(230,192,115,0.25)}.nav-logo span{font-family:'Bebas Neue',sans-serif;font-size:15px;letter-spacing:3px;color:#E6C073}.nav-links{display:flex;gap:14px}.nav-links a{font-size:12px;color:rgba(255,255,255,0.45);text-decoration:none}.nav-links a:hover{color:#E6C073}
    .hero{text-align:center;padding:32px 0 16px}
    h1{font-family:'Bebas Neue',sans-serif;font-size:clamp(34px,8vw,52px);letter-spacing:4px;color:#fff;margin-bottom:6px;line-height:1}
    .hero-sub{font-size:13px;color:rgba(255,255,255,0.4);line-height:1.6;max-width:480px;margin:0 auto}
    .gold-line{height:1px;background:linear-gradient(90deg,transparent,rgba(230,192,115,0.35),transparent);margin:14px 0}
    .stats{display:flex;gap:0;margin:0 auto 20px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05);border-radius:14px;overflow:hidden}.stat{flex:1;text-align:center;padding:14px 8px;border-right:1px solid rgba(255,255,255,0.03)}.stat:last-child{border:none}.stat-n{font-family:'Bebas Neue',sans-serif;font-size:26px;color:#E6C073;line-height:1}.stat-l{font-size:9px;letter-spacing:2px;color:rgba(255,255,255,0.3);margin-top:2px}

    /* Section headers */
    .section{margin-top:32px}.section:first-of-type{margin-top:16px}
    .section-head{display:flex;align-items:center;gap:12px;margin-bottom:14px}
    .section-icon{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}
    .section-label{font-family:'Bebas Neue',sans-serif;font-size:16px;letter-spacing:4px;color:#fff}
    .section-desc{font-size:11px;color:rgba(255,255,255,0.35);margin-top:2px}
    .divider{height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.04),transparent);margin:28px 0}

    /* Cards */
    .card-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
    .card{display:block;padding:14px 16px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05);border-radius:12px;text-decoration:none;color:inherit;transition:all 0.15s;position:relative;overflow:hidden}
    .card:hover{border-color:rgba(230,192,115,0.2);background:rgba(255,255,255,0.04);transform:translateY(-1px)}
    .card-top{display:flex;align-items:center;justify-content:space-between}
    .card-title{font-size:13px;font-weight:600;color:#fff;line-height:1.3}
    .card-arrow{font-size:14px;flex-shrink:0;margin-left:8px;opacity:0.6}
    .card-sub{font-size:10px;color:rgba(255,255,255,0.35);margin-top:3px}

    /* Featured cards — taller, more prominent */
    .featured-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
    .featured{display:block;padding:18px 20px;border-radius:14px;text-decoration:none;color:inherit;transition:all 0.2s;position:relative;overflow:hidden}
    .featured:hover{transform:translateY(-2px)}
    .featured-icon{font-size:24px;margin-bottom:8px}
    .featured-title{font-size:15px;font-weight:700;color:#fff;margin-bottom:3px}
    .featured-sub{font-size:11px;line-height:1.5}
    .featured-arrow{position:absolute;bottom:14px;right:16px;font-size:14px;opacity:0.5}

    /* Small suburb cards */
    .sm-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:6px}
    .card-sm{display:block;padding:10px 12px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.04);border-radius:10px;text-decoration:none;color:inherit;transition:all 0.15s}
    .card-sm:hover{border-color:rgba(230,192,115,0.2);background:rgba(255,255,255,0.04)}
    .card-sm-name{font-size:12px;font-weight:600;color:rgba(255,255,255,0.8)}
    .card-sm-count{font-size:9px;color:rgba(255,255,255,0.3);margin-top:2px}

    .ft{margin-top:36px;padding:20px 0;border-top:1px solid rgba(255,255,255,0.04);text-align:center}.ft p{font-size:12px;color:rgba(255,255,255,0.3);margin-bottom:10px}.ft a{color:rgba(255,255,255,0.5);text-decoration:none;font-size:11px}.ft a:hover{color:#E6C073}

    @media(max-width:480px){.card-grid,.featured-grid{grid-template-columns:1fr}.stats{flex-wrap:wrap}.stat{min-width:45%}}
  </style>
</head>
<body>
  <div class="c">
    <nav>
      <a href="/" class="nav-logo"><img src="/logo.webp" alt="KR"><span>KOFFEE REVIEW</span></a>
      <div class="nav-links"><a href="/random">Spin</a><a href="/new">New</a><a href="/blog">Blog</a></div>
    </nav>

    <div class="hero">
      <h1>EXPLORE</h1>
      <p class="hero-sub">Everything we have built. ${total}+ cafes reviewed across ${cities.length} cities. One latte, one double shot, every time.</p>
    </div>
    <div class="gold-line"></div>

    <div class="stats">
      <div class="stat"><div class="stat-n">${total}+</div><div class="stat-l">REVIEWED</div></div>
      <div class="stat"><div class="stat-n">${mustVisit}</div><div class="stat-l">MUST VISIT</div></div>
      <div class="stat"><div class="stat-n">${cities.length}</div><div class="stat-l">CITIES</div></div>
      <div class="stat"><div class="stat-n">${avgScore}</div><div class="stat-l">AVG SCORE</div></div>
    </div>

    <!-- ═══ SEARCH A COFFEE ═══ -->
    <div class="section">
      <div class="section-head">
        <div class="section-icon" style="background:rgba(230,192,115,0.08);border:1px solid rgba(230,192,115,0.15)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="#E6C073" stroke-width="2"/><path d="M21 21l-4.35-4.35" stroke="#E6C073" stroke-width="2" stroke-linecap="round"/></svg>
        </div>
        <div>
          <div class="section-label">SEARCH A COFFEE</div>
          <div class="section-desc">Find the best cafes by city, suburb, or category</div>
        </div>
      </div>

      <div class="featured-grid" style="margin-bottom:10px">
        <a href="/leaderboard" class="featured" style="background:linear-gradient(135deg,rgba(230,192,115,0.08),rgba(230,192,115,0.02));border:1px solid rgba(230,192,115,0.2)">
          <div class="featured-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#E6C073"/></svg>
          </div>
          <div class="featured-title">Leaderboard</div>
          <div class="featured-sub" style="color:rgba(230,192,115,0.6)">Australia's top 10 ranked cafes</div>
          <span class="featured-arrow" style="color:#E6C073">&#8594;</span>
        </a>
        <a href="/hidden-gem-cafes-brisbane" class="featured" style="background:linear-gradient(135deg,rgba(45,212,191,0.08),rgba(45,212,191,0.02));border:1px solid rgba(45,212,191,0.2)">
          <div class="featured-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2L15 9H22L16.5 13.5L18.5 21L12 16.5L5.5 21L7.5 13.5L2 9H9L12 2Z" stroke="#2dd4bf" stroke-width="1.5" fill="none"/><circle cx="12" cy="12" r="3" fill="#2dd4bf"/></svg>
          </div>
          <div class="featured-title">Hidden Gems</div>
          <div class="featured-sub" style="color:rgba(45,212,191,0.6)">Underrated cafes worth the trip</div>
          <span class="featured-arrow" style="color:#2dd4bf">&#8594;</span>
        </a>
      </div>

      <div class="card-grid" style="margin-bottom:10px">
        ${bestCards}
      </div>

      <div class="card-grid" style="margin-bottom:10px">
        ${pageCard("Best Latte in Brisbane","Latte specific rankings","/best-latte-brisbane","#E6C073")}
        ${pageCard("Cafes to Avoid","Below 5.0, save your money","/brisbane-cafes-to-avoid","#f87171")}
        ${pageCard("Worst by Suburb","Lowest scored per suburb","/worst-cafes-by-suburb","#f87171")}
        ${pageCard("New This Month","Latest reviews, updated weekly","/new","#4ade80")}
      </div>

      <!-- Cities -->
      <div style="font-family:'Bebas Neue',sans-serif;font-size:11px;letter-spacing:3px;color:rgba(255,255,255,0.3);margin:16px 0 8px 2px">BROWSE BY CITY</div>
      <div class="card-grid" style="margin-bottom:10px">
        ${cityCards}
      </div>

      <!-- Suburbs -->
      <div style="font-family:'Bebas Neue',sans-serif;font-size:11px;letter-spacing:3px;color:rgba(255,255,255,0.3);margin:16px 0 8px 2px">POPULAR SUBURBS</div>
      <div class="sm-grid">
        ${subCards}
      </div>
    </div>

    <div class="divider"></div>

    <!-- ═══ RESEARCH ═══ -->
    <div class="section">
      <div class="section-head">
        <div class="section-icon" style="background:rgba(96,165,250,0.08);border:1px solid rgba(96,165,250,0.15)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" stroke="#60a5fa" stroke-width="2"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" stroke="#60a5fa" stroke-width="2"/></svg>
        </div>
        <div>
          <div class="section-label">RESEARCH</div>
          <div class="section-desc">Tools, data, and guides to find better coffee</div>
        </div>
      </div>

      <div class="featured-grid" style="margin-bottom:10px">
        <a href="/map" class="featured" style="background:linear-gradient(135deg,rgba(230,192,115,0.06),rgba(230,192,115,0.01));border:1px solid rgba(230,192,115,0.15)">
          <div class="featured-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z" stroke="#E6C073" stroke-width="1.8"/><circle cx="12" cy="10" r="3" fill="#E6C073"/></svg>
          </div>
          <div class="featured-title">Coffee Heat Map</div>
          <div class="featured-sub" style="color:rgba(230,192,115,0.6)">Score density across suburbs</div>
          <span class="featured-arrow" style="color:#E6C073">&#8594;</span>
        </a>
        <a href="/compare" class="featured" style="background:linear-gradient(135deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01));border:1px solid rgba(255,255,255,0.08)">
          <div class="featured-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 3V21" stroke="rgba(255,255,255,0.6)" stroke-width="1.8" stroke-linecap="round"/><path d="M5 7L12 3L19 7" stroke="rgba(255,255,255,0.6)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 7L2 15H8L5 7Z" stroke="rgba(255,255,255,0.6)" stroke-width="1.5" stroke-linejoin="round"/><path d="M19 7L16 15H22L19 7Z" stroke="rgba(255,255,255,0.6)" stroke-width="1.5" stroke-linejoin="round"/></svg>
          </div>
          <div class="featured-title">Compare Cafes</div>
          <div class="featured-sub" style="color:rgba(255,255,255,0.4)">Head to head score breakdown</div>
          <span class="featured-arrow" style="color:rgba(255,255,255,0.4)">&#8594;</span>
        </a>
      </div>

      <div class="card-grid">
        ${pageCard("Blog","Guides, lists, and deep dives","/blog","#60a5fa")}
        ${pageCard("How We Score","Our method and scoring system","/how-we-score","#E6C073")}
        ${pageCard("Coffee Near Landmarks","Best cafes near 20 locations","/coffee-near/south-bank","#2dd4bf")}
        ${pageCard("Our Story","Why we started reviewing","/","#E6C073")}
      </div>
    </div>

    <div class="divider"></div>

    <!-- ═══ FUN ═══ -->
    <div class="section">
      <div class="section-head">
        <div class="section-icon" style="background:rgba(244,114,182,0.08);border:1px solid rgba(244,114,182,0.15)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#f472b6" stroke-width="2"/><path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="#f472b6" stroke-width="2" stroke-linecap="round"/><circle cx="9" cy="10" r="1" fill="#f472b6"/><circle cx="15" cy="10" r="1" fill="#f472b6"/></svg>
        </div>
        <div>
          <div class="section-label">FUN</div>
          <div class="section-desc">Interactive tools to discover coffee</div>
        </div>
      </div>

      <a href="/random" class="featured" style="background:linear-gradient(135deg,rgba(244,114,182,0.06),rgba(167,139,250,0.04));border:1px solid rgba(244,114,182,0.2);display:block;margin-bottom:10px">
        <div style="display:flex;align-items:center;gap:16px">
          <div style="width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,rgba(244,114,182,0.15),rgba(167,139,250,0.1));border:1px solid rgba(244,114,182,0.2);display:flex;align-items:center;justify-content:center;flex-shrink:0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#f472b6" stroke-width="1.5"/><path d="M12 2L12 12L18 6" stroke="#f472b6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="3" fill="#f472b6" fill-opacity="0.3"/></svg>
          </div>
          <div>
            <div class="featured-title">Spin for Coffee</div>
            <div class="featured-sub" style="color:rgba(244,114,182,0.7)">Can't decide? Spin the wheel and let fate pick your next cafe. Filter by city, suburb, or score.</div>
          </div>
        </div>
        <span class="featured-arrow" style="color:#f472b6">&#8594;</span>
      </a>
    </div>

    <div class="divider"></div>

    <!-- ═══ CONNECT ═══ -->
    <div class="section">
      <div class="section-head">
        <div class="section-icon" style="background:rgba(230,192,115,0.08);border:1px solid rgba(230,192,115,0.15)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" stroke="#E6C073" stroke-width="1.5"/><rect x="2" y="9" width="4" height="12" stroke="#E6C073" stroke-width="1.5"/><circle cx="4" cy="4" r="2" stroke="#E6C073" stroke-width="1.5"/></svg>
        </div>
        <div>
          <div class="section-label">CONNECT</div>
          <div class="section-desc">Follow us for daily reviews and content</div>
        </div>
      </div>

      <div class="card-grid">
        <a href="https://www.instagram.com/koffeereview" target="_blank" rel="noreferrer" class="card" style="border-left:3px solid #e879f9">
          <div class="card-top"><div class="card-title">Instagram</div><span class="card-arrow" style="color:#e879f9">&#8594;</span></div>
          <div class="card-sub">@koffeereview</div>
        </a>
        <a href="https://www.tiktok.com/@koffeereview" target="_blank" rel="noreferrer" class="card" style="border-left:3px solid #22d3ee">
          <div class="card-top"><div class="card-title">TikTok</div><span class="card-arrow" style="color:#22d3ee">&#8594;</span></div>
          <div class="card-sub">@koffeereview</div>
        </a>
        <a href="https://www.youtube.com/@koffeereview" target="_blank" rel="noreferrer" class="card" style="border-left:3px solid #f87171">
          <div class="card-top"><div class="card-title">YouTube</div><span class="card-arrow" style="color:#f87171">&#8594;</span></div>
          <div class="card-sub">@koffeereview</div>
        </a>
        <a href="https://linktr.ee/koffeereview" target="_blank" rel="noreferrer" class="card" style="border-left:3px solid #4ade80">
          <div class="card-top"><div class="card-title">Linktree</div><span class="card-arrow" style="color:#4ade80">&#8594;</span></div>
          <div class="card-sub">All links in one place</div>
        </a>
      </div>
    </div>

    <footer class="ft">
      <p style="font-size:13px;color:rgba(255,255,255,0.5);margin-bottom:6px">One latte. One double shot. Every time.</p>
      <p>&copy; 2026 Our Fair Dinkum Koffee Review</p>
      <div style="margin-top:12px"><a href="/">Home</a> &middot; <a href="/leaderboard">Leaderboard</a> &middot; <a href="/map">Map</a> &middot; <a href="/blog">Blog</a></div>
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
