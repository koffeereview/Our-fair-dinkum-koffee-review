// COFFEE MAP OF AUSTRALIA — Server-rendered with interactive Leaflet map
// /api/map → full map page with all cafes plotted, SEO text list below

const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYEU8Khk3R5I879v3FcXPqhq0aCXa2ZWM1BwwJOyUitx2Boak_AFTOkwvB8qQrKIeU55NM4htFjHbI/pub?gid=0&single=true&output=csv";

function esc(s){return(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
function makeSlug(n,s){return(n+"-"+s).toLowerCase().replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-");}
function splitCSV(line){var r=[],c="",q=false;for(var i=0;i<line.length;i++){var ch=line[i];if(ch==='"')q=!q;else if(ch===","&&!q){r.push(c.trim());c="";}else c+=ch;}r.push(c.trim());return r;}
function getColor(s){if(s>=9)return"#ffffff";if(s>=8)return"#4ade80";if(s>=7)return"#2dd4bf";if(s>=6)return"#facc15";if(s>=5)return"#fb923c";return"#f87171";}
function getVerdict(s){if(s>=9)return"ELITE";if(s>=8)return"GREAT";if(s>=7.5)return"MUST VISIT";if(s>=7)return"SOLID";if(s>=6)return"DECENT";if(s>=5)return"JUST OKAY";return"AVOID";}

function parseCSV(text){
  var lines=text.split("\n").filter(function(l){return l&&l.trim();});
  if(lines.length<2)return[];
  var h=splitCSV(lines[0]).map(function(x){return x.trim().toLowerCase();});
  var idx={name:h.indexOf("name"),suburb:h.indexOf("suburb"),city:h.indexOf("city"),score:h.indexOf("score"),price:h.indexOf("price"),notes:h.indexOf("notes"),lat:h.indexOf("lat"),lng:h.indexOf("lng")};
  if(idx.name===-1||idx.suburb===-1)return[];
  var out=[];
  for(var i=1;i<lines.length;i++){try{var p=splitCSV(lines[i]);var n=p[idx.name]||"";var s=p[idx.suburb]||"";if(!n||!s)continue;
  out.push({name:n,suburb:s,city:p[idx.city]||"",score:parseFloat(p[idx.score])||0,price:p[idx.price]||"$$$",notes:p[idx.notes]||"",lat:parseFloat(p[idx.lat])||0,lng:parseFloat(p[idx.lng])||0});}catch(e){}}
  return out;
}

export default async function handler(req,res){
  try{
    var controller=new AbortController();var tid=setTimeout(function(){controller.abort();},10000);
    var response=await fetch(SHEET_URL,{signal:controller.signal});clearTimeout(tid);
    if(!response.ok)throw new Error("Sheet fetch failed");
    var text=await response.text();
    var allCafes=parseCSV(text);
    var cafes=allCafes.filter(function(c){return c.lat&&c.lng&&Math.abs(c.lat)>1;});
    cafes.sort(function(a,b){return b.score-a.score;});

    var total=allCafes.length;
    var mapped=cafes.length;
    var cities={};
    allCafes.forEach(function(c){if(c.city)cities[c.city]=(cities[c.city]||0)+1;});
    var cityList=Object.keys(cities).sort(function(a,b){return cities[b]-cities[a];});

    // Build cafe JSON for Leaflet (only cafes with geo)
    var mapData=JSON.stringify(cafes.map(function(c){
      return{n:c.name,s:c.suburb,c:c.city,sc:c.score,la:c.lat,ln:c.lng,sl:makeSlug(c.name,c.suburb),p:c.price};
    })).replace(/</g,"\\u003c");

    // SEO text list — all cafes grouped by city
    var seoList="";
    cityList.forEach(function(city){
      var cityCafes=allCafes.filter(function(c){return c.city===city;}).sort(function(a,b){return b.score-a.score;});
      seoList+='<div style="margin-bottom:24px"><h3 style="font-size:14px;letter-spacing:3px;color:#E6C073;margin-bottom:10px">'+esc(city.toUpperCase())+' ('+cityCafes.length+')</h3>';
      cityCafes.forEach(function(c){
        var col=getColor(c.score);
        seoList+='<a href="/review/'+makeSlug(c.name,c.suburb)+'" style="display:flex;align-items:center;gap:10px;padding:8px 12px;border-bottom:1px solid rgba(255,255,255,0.04);text-decoration:none;color:inherit"><span style="font-size:15px;font-weight:700;color:'+col+';min-width:32px;text-align:center">'+c.score.toFixed(1)+'</span><div><span style="font-size:13px;color:#fff">'+esc(c.name)+'</span><span style="font-size:11px;color:rgba(255,255,255,0.4);margin-left:8px">'+esc(c.suburb)+'</span></div></a>';
      });
      seoList+='</div>';
    });

    var title="Coffee Map of Australia 2026 | "+total+"+ Cafes Reviewed | Koffee Review";
    var desc="Interactive map of "+total+"+ reviewed cafes across Australia. Colour-coded by score. Find the best coffee near you in Brisbane, Gold Coast, Melbourne, and more.";
    var canonical="https://koffeereview.com.au/map";

    var schemas='<script type="application/ld+json">'+JSON.stringify({"@context":"https://schema.org","@type":"WebPage","name":"Coffee Map of Australia","description":desc,"url":canonical,"publisher":{"@type":"Organization","name":"Koffee Review","url":"https://koffeereview.com.au"}})+'</script>'
    +'<script type="application/ld+json">'+JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Koffee Review","item":"https://koffeereview.com.au"},{"@type":"ListItem","position":2,"name":"Coffee Map","item":canonical}]})+'</script>'
    +'<script type="application/ld+json">'+JSON.stringify({"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
      {"@type":"Question","name":"How many cafes are on the Koffee Review map?","acceptedAnswer":{"@type":"Answer","text":"Our map shows "+mapped+" cafes with GPS coordinates out of "+total+"+ total reviewed cafes across Australia."}},
      {"@type":"Question","name":"What do the map colours mean?","acceptedAnswer":{"@type":"Answer","text":"Green pins are 8.0+ (Great/Elite). Teal pins are 7.0-7.9 (Solid/Must Visit). Yellow pins are 6.0-6.9 (Decent). Orange pins are 5.0-5.9 (Just Okay). Red pins are below 5.0 (Avoid)."}},
      {"@type":"Question","name":"Which cities does Koffee Review cover?","acceptedAnswer":{"@type":"Answer","text":"We cover "+cityList.join(", ")+" and more. Brisbane has the most comprehensive coverage."}}
    ]})+'</script>';

    var html='<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+esc(title)+'</title><meta name="description" content="'+esc(desc)+'"><link rel="canonical" href="'+canonical+'"><link rel="alternate" hreflang="en-AU" href="'+canonical+'"><meta property="og:title" content="'+esc(title)+'"><meta property="og:description" content="'+esc(desc)+'"><meta property="og:url" content="'+canonical+'"><meta property="og:image" content="https://koffeereview.com.au/logo.webp"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="/logo.webp">'+schemas
    +'<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"/>'
    +'<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Georgia,serif;background:#000;color:#E8E8E8;line-height:1.6}.c{max-width:1000px;margin:0 auto;padding:0 24px 60px}.nav{display:flex;align-items:center;justify-content:space-between;padding:16px 0;border-bottom:1px solid rgba(255,255,255,0.06)}.nav-logo{display:flex;align-items:center;gap:10px;text-decoration:none}.nav-logo img{width:32px;height:32px;border-radius:50%}.nav-logo span{font-size:11px;letter-spacing:3px;color:#E6C073;font-weight:600}.nav-links{display:flex;gap:16px}.nav-links a{font-size:12px;color:rgba(255,255,255,0.55);text-decoration:none}.bc{padding:12px 0;font-size:12px;color:rgba(255,255,255,0.5)}.bc a{color:#E6C073;text-decoration:none}.hero{text-align:center;padding:24px 0 16px}.hero h1{font-size:32px;line-height:1.1;margin-bottom:8px;color:#fff}.hero p{color:rgba(255,255,255,0.6);font-size:14px}'
    +'.filters{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin:16px 0}.fbtn{padding:6px 14px;border-radius:20px;border:1px solid rgba(255,255,255,0.12);background:transparent;color:rgba(255,255,255,0.6);font-size:12px;cursor:pointer;font-family:inherit;transition:all 0.2s}.fbtn:hover,.fbtn.active{background:#E6C073;color:#000;border-color:#E6C073}'
    +'.map-wrap{border-radius:16px;overflow:hidden;border:1px solid rgba(230,192,115,0.2);margin:16px 0}#map{height:500px;width:100%;background:#111}'
    +'.stats{display:flex;gap:24px;justify-content:center;margin:20px 0;flex-wrap:wrap}.stat{text-align:center}.stat-n{font-size:28px;font-weight:700;color:#E6C073}.stat-l{font-size:10px;letter-spacing:2px;color:rgba(255,255,255,0.5)}'
    +'.legend{display:flex;gap:16px;justify-content:center;flex-wrap:wrap;margin:12px 0}.leg{display:flex;align-items:center;gap:4px;font-size:11px;color:rgba(255,255,255,0.6)}.dot{width:10px;height:10px;border-radius:50%}'
    +'.seo-list{margin-top:32px;padding-top:24px;border-top:1px solid rgba(255,255,255,0.06)}.seo-list h2{font-size:14px;letter-spacing:3px;color:rgba(255,255,255,0.6);margin-bottom:16px}'
    +'.faq{margin-top:32px;padding-top:24px;border-top:1px solid rgba(255,255,255,0.06)}.faq h2{font-size:12px;letter-spacing:4px;color:#E6C073;font-weight:700;margin-bottom:16px}.fi{margin-bottom:8px;border:1px solid rgba(255,255,255,0.1);border-radius:10px;overflow:hidden}.fi[open]{border-color:rgba(230,192,115,0.3)}.fq{padding:14px 16px;font-size:15px;font-weight:600;color:#fff;cursor:pointer;list-style:none}.fq::-webkit-details-marker{display:none}.fq::after{content:"+";color:#E6C073;font-size:18px;float:right}.fi[open] .fq::after{content:"-"}.fa{padding:0 16px 14px;font-size:14px;color:rgba(255,255,255,0.65);line-height:1.7}'
    +'.ft{margin-top:48px;padding-top:24px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;font-size:11px;color:rgba(255,255,255,0.45)}.ft a{color:rgba(255,255,255,0.6);text-decoration:none;margin:0 8px}'
    +'@media(max-width:480px){#map{height:380px}.hero h1{font-size:24px}.stats{gap:16px}}</style>'
    +'</head><body><div class="c">'

    // Nav
    +'<nav class="nav"><a href="/" class="nav-logo"><img src="/logo.webp" alt="KR"><span>KOFFEE REVIEW</span></a><div class="nav-links"><a href="/compare">Compare</a><a href="/blog">Blog</a><a href="/leaderboard">Leaderboard</a></div></nav>'
    +'<div class="bc"><a href="/">Home</a> &middot; <span>Coffee Map</span></div>'

    // Hero
    +'<header class="hero"><h1>Coffee Map of Australia</h1><p>'+total+'+ cafes reviewed and mapped. Colour-coded by score. Updated May 2026.</p></header>'

    // Stats
    +'<div class="stats"><div class="stat"><div class="stat-n">'+total+'</div><div class="stat-l">REVIEWED</div></div><div class="stat"><div class="stat-n">'+mapped+'</div><div class="stat-l">MAPPED</div></div><div class="stat"><div class="stat-n">'+cityList.length+'</div><div class="stat-l">CITIES</div></div></div>'

    // Legend
    +'<div class="legend"><div class="leg"><div class="dot" style="background:#4ade80"></div>8.0+ Great</div><div class="leg"><div class="dot" style="background:#2dd4bf"></div>7.0+ Solid</div><div class="leg"><div class="dot" style="background:#facc15"></div>6.0+ Decent</div><div class="leg"><div class="dot" style="background:#fb923c"></div>5.0+ Okay</div><div class="leg"><div class="dot" style="background:#f87171"></div>&lt;5.0 Avoid</div></div>'

    // City filters
    +'<div class="filters"><button class="fbtn active" onclick="filterMap(null,this)">All</button>'
    +cityList.slice(0,6).map(function(c){return'<button class="fbtn" onclick="filterMap(\''+esc(c)+'\',this)">'+esc(c)+'</button>';}).join("")
    +'<button class="fbtn" onclick="filterMap(\'7.5+\',this)">7.5+ Only</button>'
    +'</div>'

    // Map
    +'<div class="map-wrap"><div id="map"></div></div>'

    // SEO list
    +'<section class="seo-list"><h2>ALL '+total+'+ CAFES BY CITY</h2>'+seoList+'</section>'

    // FAQ
    +'<section class="faq"><h2>FREQUENTLY ASKED</h2>'
    +'<details class="fi"><summary class="fq">How many cafes are on the map?</summary><p class="fa">Our map shows '+mapped+' cafes with GPS coordinates out of '+total+'+ total reviewed across Australia.</p></details>'
    +'<details class="fi"><summary class="fq">What do the colours mean?</summary><p class="fa">Green = 8.0+ (Great/Elite). Teal = 7.0-7.9 (Solid/Must Visit). Yellow = 6.0-6.9 (Decent). Orange = 5.0-5.9. Red = below 5.0 (Avoid).</p></details>'
    +'<details class="fi"><summary class="fq">Which cities are covered?</summary><p class="fa">'+cityList.join(", ")+'. Brisbane has the most comprehensive coverage with 160+ cafes reviewed.</p></details>'
    +'</section>'

    // Footer
    +'<footer class="ft"><p style="font-size:10px;color:rgba(255,255,255,0.3);margin-bottom:8px;letter-spacing:1px">Last updated May 2026</p><p>&copy; 2026 Our Fair Dinkum Koffee Review</p><div style="margin-top:10px"><a href="/">All Reviews</a> &middot; <a href="/compare">Compare</a> &middot; <a href="/blog">Blog</a> &middot; <a href="/leaderboard">Leaderboard</a></div></footer>'

    +'</div>'

    // Leaflet JS
    +'<script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"></script>'
    +'<script>'
    +'var cafes='+mapData+';'
    +'var map=L.map("map",{zoomControl:true,scrollWheelZoom:true}).setView([-27.47,153.02],11);'
    +'L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",{maxZoom:19,attribution:"Koffee Review"}).addTo(map);'
    +'var markers=[];var allMarkers=[];'
    +'function gc(s){if(s>=9)return"#ffffff";if(s>=8)return"#4ade80";if(s>=7)return"#2dd4bf";if(s>=6)return"#facc15";if(s>=5)return"#fb923c";return"#f87171";}'
    +'function addMarkers(list){'
    +'markers.forEach(function(m){map.removeLayer(m);});markers=[];'
    +'list.forEach(function(c){'
    +'var col=gc(c.sc);'
    +'var icon=L.divIcon({className:"",html:\'<div style="width:14px;height:14px;border-radius:50%;background:\'+col+\';border:2px solid rgba(0,0,0,0.4);box-shadow:0 0 6px \'+col+\'44"></div>\',iconSize:[14,14],iconAnchor:[7,7]});'
    +'var m=L.marker([c.la,c.ln],{icon:icon}).addTo(map);'
    +'m.bindPopup(\'<div style="font-family:Georgia,serif;min-width:160px"><div style="font-size:16px;font-weight:700">\'+c.n+\'</div><div style="font-size:12px;color:#888;margin:2px 0">\'+c.s+", "+c.c+\'</div><div style="font-size:24px;font-weight:700;color:\'+col+\';margin:8px 0">\'+c.sc.toFixed(1)+\'/10</div><a href="/review/\'+c.sl+\'" style="color:#E6C073;font-size:12px">View Review &rarr;</a></div>\');'
    +'markers.push(m);'
    +'});'
    +'if(list.length>0){var group=L.featureGroup(markers);map.fitBounds(group.getBounds().pad(0.1));}}'
    +'addMarkers(cafes);'
    +'function filterMap(filter,btn){'
    +'document.querySelectorAll(".fbtn").forEach(function(b){b.classList.remove("active");});'
    +'if(btn)btn.classList.add("active");'
    +'if(!filter){addMarkers(cafes);return;}'
    +'if(filter==="7.5+"){addMarkers(cafes.filter(function(c){return c.sc>=7.5;}));return;}'
    +'addMarkers(cafes.filter(function(c){return c.c===filter;}));}'
    +'</script>'
    +'</body></html>';

    res.setHeader("Content-Type","text/html; charset=utf-8");
    res.setHeader("Cache-Control","public, s-maxage=3600, stale-while-revalidate=86400");
    return res.status(200).send(html);

  }catch(e){
    res.setHeader("Content-Type","text/html; charset=utf-8");
    res.status(500).send('<!DOCTYPE html><html><head><title>Error</title></head><body style="background:#000;color:#fff;font-family:sans-serif;text-align:center;padding:60px"><h1>Something went wrong</h1><a href="/" style="color:#E6C073">&larr; Back</a></body></html>');
  }
}
