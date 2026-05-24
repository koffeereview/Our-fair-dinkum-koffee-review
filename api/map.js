// COFFEE MAP OF AUSTRALIA — Premium design, interactive Leaflet map
// /api/map → full map page with paginated cafe list

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
    if(!response.ok)throw new Error("fail");
    var text=await response.text();var allCafes=parseCSV(text);
    var cafes=allCafes.filter(function(c){return c.lat&&c.lng&&Math.abs(c.lat)>1;});
    cafes.sort(function(a,b){return b.score-a.score;});
    allCafes.sort(function(a,b){return b.score-a.score;});
    var total=allCafes.length,mapped=cafes.length;
    var cities={};allCafes.forEach(function(c){if(c.city)cities[c.city]=(cities[c.city]||0)+1;});
    var cityList=Object.keys(cities).sort(function(a,b){return cities[b]-cities[a];});
    var mapData=JSON.stringify(cafes.map(function(c){return{n:c.name,s:c.suburb,c:c.city,sc:c.score,la:c.lat,ln:c.lng,sl:makeSlug(c.name,c.suburb),p:c.price};})).replace(/</g,"\\u003c");

    // Build SEO cafe list data as JSON for client-side pagination
    var listData=JSON.stringify(allCafes.map(function(c){return{n:c.name,s:c.suburb,c:c.city,sc:c.score,sl:makeSlug(c.name,c.suburb),p:c.price};})).replace(/</g,"\\u003c");

    var title="Coffee Map of Australia 2026 | "+total+"+ Cafes | Koffee Review";
    var desc="Interactive map of "+total+"+ reviewed cafes across Australia. Colour-coded by score tier. Brisbane, Gold Coast, Melbourne and more.";
    var canonical="https://koffeereview.com.au/map";

    var schemas='<script type="application/ld+json">'+JSON.stringify({"@context":"https://schema.org","@type":"WebPage","name":"Coffee Map of Australia","description":desc,"url":canonical,"publisher":{"@type":"Organization","name":"Koffee Review"}})+'<\/script>'
    +'<script type="application/ld+json">'+JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Koffee Review","item":"https://koffeereview.com.au"},{"@type":"ListItem","position":2,"name":"Coffee Map","item":canonical}]})+'<\/script>'
    +'<script type="application/ld+json">'+JSON.stringify({"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"How many cafes are on the Koffee Review map?","acceptedAnswer":{"@type":"Answer","text":mapped+" cafes mapped out of "+total+"+ reviewed across Australia."}},{"@type":"Question","name":"What do the map colours mean?","acceptedAnswer":{"@type":"Answer","text":"Green=8.0+ Great. Teal=7.0+ Solid. Yellow=6.0+ Decent. Orange=5.0+ Okay. Red=below 5.0 Avoid."}},{"@type":"Question","name":"Which cities does Koffee Review cover?","acceptedAnswer":{"@type":"Answer","text":cityList.join(", ")+". Brisbane has the most coverage."}}]})+'<\/script>';

    // SEO noscript list — first 50 cafes visible without JS for Google
    var noscriptList=allCafes.slice(0,50).map(function(c){
      var col=getColor(c.score);
      return '<a href="/review/'+makeSlug(c.name,c.suburb)+'" style="display:block;padding:6px 0;color:'+col+';text-decoration:none;font-size:13px">'+c.score.toFixed(1)+' — '+esc(c.name)+' — '+esc(c.suburb)+', '+esc(c.city)+'</a>';
    }).join("");

    var html='<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+esc(title)+'</title><meta name="description" content="'+esc(desc)+'"><link rel="canonical" href="'+canonical+'"><link rel="alternate" hreflang="en-AU" href="'+canonical+'"><meta property="og:title" content="'+esc(title)+'"><meta property="og:description" content="'+esc(desc)+'"><meta property="og:url" content="'+canonical+'"><meta property="og:image" content="https://koffeereview.com.au/logo.webp"><link rel="icon" href="/logo.webp">'+schemas
    +'<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"/>'
    +'<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">'
    +'<style>'
    +'*{margin:0;padding:0;box-sizing:border-box}'
    +'body{font-family:"DM Sans",sans-serif;background:#060606;color:#E8E8E8;line-height:1.6;-webkit-font-smoothing:antialiased}'
    +'.c{max-width:1000px;margin:0 auto;padding:0 20px 60px}'

    // Nav
    +'.nav{display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid rgba(230,192,115,0.1)}'
    +'.nav-logo{display:flex;align-items:center;gap:10px;text-decoration:none}'
    +'.nav-logo img{width:34px;height:34px;border-radius:50%;border:1.5px solid rgba(230,192,115,0.3)}'
    +'.nav-logo span{font-family:"Bebas Neue",sans-serif;font-size:14px;letter-spacing:3px;color:#E6C073}'
    +'.nav-links{display:flex;gap:16px}'
    +'.nav-links a{font-size:12px;color:rgba(255,255,255,0.5);text-decoration:none;transition:color 0.2s}'
    +'.nav-links a:hover{color:#E6C073}'

    // Hero
    +'.hero{text-align:center;padding:36px 0 20px;position:relative}'
    +'.hero::before{content:"";position:absolute;top:0;left:50%;transform:translateX(-50%);width:120px;height:2px;background:linear-gradient(90deg,transparent,#E6C073,transparent)}'
    +'.hero h1{font-family:"Bebas Neue",sans-serif;font-size:42px;letter-spacing:2px;color:#fff;margin-bottom:6px}'
    +'.hero-sub{color:rgba(255,255,255,0.55);font-size:14px;letter-spacing:0.5px}'

    // Stats row
    +'.stats{display:flex;gap:0;justify-content:center;margin:20px auto;max-width:400px;border:1px solid rgba(230,192,115,0.12);border-radius:14px;overflow:hidden}'
    +'.stat{flex:1;text-align:center;padding:16px 12px;border-right:1px solid rgba(230,192,115,0.08)}'
    +'.stat:last-child{border-right:none}'
    +'.stat-n{font-family:"Bebas Neue",sans-serif;font-size:30px;color:#E6C073;line-height:1}'
    +'.stat-l{font-size:9px;letter-spacing:2.5px;color:rgba(255,255,255,0.4);margin-top:4px}'

    // Legend
    +'.legend{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;margin:14px 0;padding:10px 16px;background:rgba(255,255,255,0.02);border-radius:10px}'
    +'.leg{display:flex;align-items:center;gap:5px;font-size:11px;color:rgba(255,255,255,0.55)}'
    +'.dot{width:10px;height:10px;border-radius:50%;box-shadow:0 0 6px currentColor}'

    // Filters
    +'.filters{display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin:14px 0}'
    +'.fb{padding:7px 16px;border-radius:24px;border:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.03);color:rgba(255,255,255,0.55);font-size:12px;cursor:pointer;font-family:inherit;transition:all 0.2s;font-weight:500}'
    +'.fb:hover{border-color:rgba(230,192,115,0.3);color:#E6C073}'
    +'.fb.active{background:linear-gradient(135deg,#C9A84C,#E6C073);color:#000;border-color:#E6C073;font-weight:600}'

    // Map
    +'.map-wrap{border-radius:18px;overflow:hidden;border:1px solid rgba(230,192,115,0.15);margin:16px 0;box-shadow:0 8px 32px rgba(0,0,0,0.4)}'
    +'#map{height:520px;width:100%;background:#0a0a0a}'

    // Cafe list section
    +'.list-section{margin-top:32px;padding-top:24px;border-top:1px solid rgba(230,192,115,0.08)}'
    +'.list-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}'
    +'.list-title{font-family:"Bebas Neue",sans-serif;font-size:16px;letter-spacing:3px;color:rgba(255,255,255,0.5)}'
    +'.list-count{font-size:12px;color:rgba(230,192,115,0.6)}'

    // City tabs for list
    +'.city-tabs{display:flex;gap:6px;margin-bottom:16px;overflow-x:auto;padding-bottom:4px}'
    +'.ct{padding:5px 14px;border-radius:20px;border:1px solid rgba(255,255,255,0.06);background:transparent;color:rgba(255,255,255,0.45);font-size:11px;cursor:pointer;font-family:inherit;white-space:nowrap;transition:all 0.15s}'
    +'.ct:hover{color:#E6C073;border-color:rgba(230,192,115,0.2)}'
    +'.ct.act{background:rgba(230,192,115,0.1);color:#E6C073;border-color:rgba(230,192,115,0.3)}'

    // Cafe cards
    +'.cafe-card{display:flex;align-items:center;gap:14px;padding:14px 16px;border-radius:12px;border:1px solid rgba(255,255,255,0.05);background:rgba(255,255,255,0.02);margin-bottom:8px;text-decoration:none;color:inherit;transition:all 0.2s}'
    +'.cafe-card:hover{border-color:rgba(230,192,115,0.2);background:rgba(255,255,255,0.04);transform:translateX(2px)}'
    +'.cc-score{font-family:"Bebas Neue",sans-serif;font-size:22px;min-width:44px;height:44px;border-radius:50%;border:2px solid;display:flex;align-items:center;justify-content:center;flex-shrink:0}'
    +'.cc-info{flex:1;min-width:0}'
    +'.cc-name{font-size:14px;font-weight:600;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'
    +'.cc-loc{font-size:11px;margin-top:2px;opacity:0.6}'
    +'.cc-verdict{display:inline-block;padding:2px 7px;border-radius:5px;font-size:9px;font-weight:700;letter-spacing:1.5px;margin-top:3px;border:1px solid}'
    +'.cc-price{font-size:11px;color:rgba(255,255,255,0.3);flex-shrink:0}'

    // Load more
    +'.load-more{width:100%;padding:14px;border-radius:12px;border:1px solid rgba(230,192,115,0.2);background:rgba(230,192,115,0.04);color:#E6C073;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;letter-spacing:1px;margin-top:8px;transition:all 0.2s}'
    +'.load-more:hover{background:rgba(230,192,115,0.1);border-color:rgba(230,192,115,0.4)}'

    // FAQ
    +'.faq{margin-top:32px;padding-top:24px;border-top:1px solid rgba(230,192,115,0.08)}'
    +'.faq-title{font-family:"Bebas Neue",sans-serif;font-size:14px;letter-spacing:4px;color:#E6C073;margin-bottom:14px}'
    +'.fi{margin-bottom:8px;border:1px solid rgba(255,255,255,0.08);border-radius:10px;overflow:hidden}.fi[open]{border-color:rgba(230,192,115,0.25)}'
    +'.fq{padding:14px 16px;font-size:14px;font-weight:600;color:#fff;cursor:pointer;list-style:none}.fq::-webkit-details-marker{display:none}.fq::after{content:"+";color:#E6C073;font-size:16px;float:right}.fi[open] .fq::after{content:"-"}'
    +'.fa{padding:0 16px 14px;font-size:13px;color:rgba(255,255,255,0.6);line-height:1.7}'

    // Footer
    +'.ft{margin-top:40px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;font-size:11px;color:rgba(255,255,255,0.4)}'
    +'.ft a{color:rgba(255,255,255,0.55);text-decoration:none;margin:0 8px}'

    +'@media(max-width:480px){#map{height:360px}.hero h1{font-size:30px}.stats{flex-direction:row}.stat{padding:12px 8px}.stat-n{font-size:24px}}'
    +'</style></head><body><div class="c">'

    // Nav
    +'<nav class="nav"><a href="/" class="nav-logo"><img src="/logo.webp" alt="KR"><span>KOFFEE REVIEW</span></a><div class="nav-links"><a href="/compare">Compare</a><a href="/blog">Blog</a><a href="/leaderboard">Leaderboard</a></div></nav>'

    // Hero
    +'<header class="hero"><h1>COFFEE MAP OF AUSTRALIA</h1><p class="hero-sub">'+total+'+ cafes reviewed &middot; colour-coded by score &middot; updated May 2026</p></header>'

    // Stats
    +'<div class="stats"><div class="stat"><div class="stat-n">'+total+'+</div><div class="stat-l">REVIEWED</div></div><div class="stat"><div class="stat-n">'+mapped+'</div><div class="stat-l">MAPPED</div></div><div class="stat"><div class="stat-n">'+cityList.length+'</div><div class="stat-l">CITIES</div></div></div>'

    // Legend
    +'<div class="legend"><div class="leg"><div class="dot" style="color:#4ade80;background:#4ade80"></div>8.0+ Great</div><div class="leg"><div class="dot" style="color:#2dd4bf;background:#2dd4bf"></div>7.0+ Solid</div><div class="leg"><div class="dot" style="color:#facc15;background:#facc15"></div>6.0+ Decent</div><div class="leg"><div class="dot" style="color:#fb923c;background:#fb923c"></div>5.0+ Okay</div><div class="leg"><div class="dot" style="color:#f87171;background:#f87171"></div>&lt;5 Avoid</div></div>'

    // Map filters
    +'<div class="filters"><button class="fb active" onclick="fm(null,this)">All Cities</button>'
    +cityList.slice(0,6).map(function(c){return'<button class="fb" onclick="fm(\''+esc(c)+'\',this)">'+esc(c)+'</button>';}).join("")
    +'<button class="fb" onclick="fm(\'must\',this)">\u2605 Must Visit Only</button></div>'

    // Map
    +'<div class="map-wrap"><div id="map"></div></div>'

    // Cafe list section with pagination
    +'<section class="list-section">'
    +'<div class="list-header"><div class="list-title">ALL CAFES BY SCORE</div><div class="list-count" id="listCount"></div></div>'
    +'<div class="city-tabs" id="cityTabs"><button class="ct act" onclick="fc(null,this)">All</button>'
    +cityList.map(function(c){return'<button class="ct" onclick="fc(\''+esc(c)+'\',this)">'+esc(c)+' ('+cities[c]+')</button>';}).join("")
    +'</div>'
    +'<div id="cafeList"></div>'
    +'<button class="load-more" id="loadMore" onclick="loadMore()" style="display:none">LOAD MORE</button>'
    +'</section>'

    // SEO noscript fallback
    +'<noscript><section style="margin-top:24px">'+noscriptList+'</section></noscript>'

    // FAQ
    +'<section class="faq"><div class="faq-title">FREQUENTLY ASKED</div>'
    +'<details class="fi"><summary class="fq">How many cafes are on the map?</summary><p class="fa">'+mapped+' cafes with GPS coordinates out of '+total+'+ total reviewed across Australia.</p></details>'
    +'<details class="fi"><summary class="fq">What do the colours mean?</summary><p class="fa">Green = 8.0+ (Great/Elite). Teal = 7.0-7.9 (Solid/Must Visit). Yellow = 6.0-6.9 (Decent). Orange = 5.0-5.9. Red = below 5.0 (Avoid).</p></details>'
    +'<details class="fi"><summary class="fq">Which cities are covered?</summary><p class="fa">'+cityList.join(", ")+'. Brisbane has the most coverage with 160+ cafes.</p></details>'
    +'</section>'

    // Footer
    +'<footer class="ft"><p style="font-size:10px;color:rgba(255,255,255,0.3);margin-bottom:6px;letter-spacing:1px">Last updated May 2026</p><p>&copy; 2026 Our Fair Dinkum Koffee Review</p><div style="margin-top:8px"><a href="/">Reviews</a> &middot; <a href="/compare">Compare</a> &middot; <a href="/blog">Blog</a> &middot; <a href="/leaderboard">Leaderboard</a></div></footer>'

    +'</div>'

    // Scripts
    +'<script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"><\/script>'
    +'<script>'
    +'var MC='+mapData+';'
    +'var LC='+listData+';'
    +'var map=L.map("map",{zoomControl:true,scrollWheelZoom:true}).setView([-27.47,153.02],11);'
    +'L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",{maxZoom:19,attribution:"Koffee Review"}).addTo(map);'
    +'var markers=[];'
    +'function gc(s){if(s>=9)return"#ffffff";if(s>=8)return"#4ade80";if(s>=7)return"#2dd4bf";if(s>=6)return"#facc15";if(s>=5)return"#fb923c";return"#f87171";}'
    +'function gv(s){if(s>=9)return"ELITE";if(s>=8)return"GREAT";if(s>=7.5)return"MUST VISIT";if(s>=7)return"SOLID";if(s>=6)return"DECENT";if(s>=5)return"JUST OKAY";return"AVOID";}'
    +'function addPins(list){'
    +'markers.forEach(function(m){map.removeLayer(m);});markers=[];'
    +'list.forEach(function(c){'
    +'var col=gc(c.sc);'
    +'var sz=c.sc>=8?16:c.sc>=7?13:11;'
    +'var icon=L.divIcon({className:"",html:\'<div style="width:\'+sz+\'px;height:\'+sz+\'px;border-radius:50%;background:\'+col+\';border:2px solid rgba(0,0,0,0.5);box-shadow:0 0 8px \'+col+\'55;transition:transform 0.2s" onmouseover="this.style.transform=\\\'scale(1.4)\\\'" onmouseout="this.style.transform=\\\'scale(1)\\\'"></div>\',iconSize:[sz,sz],iconAnchor:[sz/2,sz/2]});'
    +'var m=L.marker([c.la,c.ln],{icon:icon}).addTo(map);'
    +'m.bindPopup(\'<div style="font-family:DM Sans,sans-serif;min-width:180px;padding:4px"><div style="font-size:15px;font-weight:700">\'+c.n+\'</div><div style="font-size:11px;color:#888;margin:3px 0">\'+c.s+", "+c.c+" &middot; "+c.p+\'</div><div style="display:flex;align-items:center;gap:8px;margin:10px 0"><div style="font-family:Bebas Neue,sans-serif;font-size:28px;color:\'+col+\'">\'+c.sc.toFixed(1)+\'</div><div style="font-size:10px;color:#aaa">/10<br>\'+gv(c.sc)+\'</div></div><a href="/review/\'+c.sl+\'" style="display:block;padding:6px 12px;background:\'+col+\';color:#000;text-align:center;border-radius:8px;font-size:11px;font-weight:600;text-decoration:none;margin-top:4px">View Review &rarr;</a></div>\',{className:"kr-popup"});'
    +'markers.push(m);});'
    +'if(list.length>0){var g=L.featureGroup(markers);map.fitBounds(g.getBounds().pad(0.1));}}'
    +'addPins(MC);'

    // Map filter
    +'function fm(f,btn){'
    +'document.querySelectorAll(".fb").forEach(function(b){b.classList.remove("active");});'
    +'if(btn)btn.classList.add("active");'
    +'if(!f){addPins(MC);return;}'
    +'if(f==="must"){addPins(MC.filter(function(c){return c.sc>=7.5;}));return;}'
    +'addPins(MC.filter(function(c){return c.c===f;}));}'

    // List pagination
    +'var listCity=null;var listPage=0;var PER_PAGE=10;'
    +'function getFiltered(){return listCity?LC.filter(function(c){return c.c===listCity;}):LC;}'
    +'function renderList(){'
    +'var filtered=getFiltered();var show=filtered.slice(0,(listPage+1)*PER_PAGE);'
    +'var html="";'
    +'show.forEach(function(c){'
    +'var col=gc(c.sc);'
    +'html+=\'<a href="/review/\'+c.sl+\'" class="cafe-card"><div class="cc-score" style="color:\'+col+\';border-color:\'+col+\'">\'+c.sc.toFixed(1)+\'</div><div class="cc-info"><div class="cc-name">\'+c.n+\'</div><div class="cc-loc" style="color:\'+col+\'">\'+c.s+", "+c.c+\'</div><div class="cc-verdict" style="color:\'+col+\';border-color:\'+col+\'">\'+gv(c.sc)+\'</div></div><div class="cc-price">\'+c.p+\'</div></a>\';'
    +'});'
    +'document.getElementById("cafeList").innerHTML=html;'
    +'document.getElementById("listCount").textContent=show.length+" of "+filtered.length+" cafes";'
    +'var btn=document.getElementById("loadMore");'
    +'if(show.length<filtered.length){btn.style.display="block";btn.textContent="LOAD "+Math.min(PER_PAGE,filtered.length-show.length)+" MORE CAFES";}else{btn.style.display="none";}}'
    +'function loadMore(){listPage++;renderList();}'
    +'function fc(city,btn){document.querySelectorAll(".ct").forEach(function(b){b.classList.remove("act");});if(btn)btn.classList.add("act");listCity=city;listPage=0;renderList();}'
    +'renderList();'
    +'<\/script></body></html>';

    res.setHeader("Content-Type","text/html; charset=utf-8");
    res.setHeader("Cache-Control","public, s-maxage=3600, stale-while-revalidate=86400");
    return res.status(200).send(html);
  }catch(e){
    res.setHeader("Content-Type","text/html; charset=utf-8");
    res.status(500).send('<!DOCTYPE html><html><head><title>Error</title></head><body style="background:#000;color:#fff;font-family:sans-serif;text-align:center;padding:60px"><h1>Something went wrong</h1><a href="/" style="color:#E6C073">&larr; Back</a></body></html>');
  }
}
