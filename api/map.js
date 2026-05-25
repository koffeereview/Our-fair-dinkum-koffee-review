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

    // Top suburbs by avg score
    var subMap={};cafes.forEach(function(c){if(!subMap[c.suburb])subMap[c.suburb]={total:0,count:0};subMap[c.suburb].total+=c.score;subMap[c.suburb].count++;});
    var hotZones=Object.keys(subMap).filter(function(s){return subMap[s].count>=3;}).map(function(s){return{name:s,count:subMap[s].count,avg:(subMap[s].total/subMap[s].count).toFixed(1)};}).sort(function(a,b){return b.avg-a.avg;}).slice(0,6);

    var mapData=JSON.stringify(cafes.map(function(c){return{n:c.name,s:c.suburb,c:c.city,sc:c.score,la:c.lat,ln:c.lng,sl:makeSlug(c.name,c.suburb),p:c.price};})).replace(/</g,"\\u003c");
    var listData=JSON.stringify(allCafes.map(function(c){return{n:c.name,s:c.suburb,c:c.city,sc:c.score,sl:makeSlug(c.name,c.suburb),p:c.price};})).replace(/</g,"\\u003c");

    var title="Coffee Map of Australia 2026 | "+total+"+ Cafes | Koffee Review";
    var desc="Interactive heat map of "+total+"+ reviewed cafes. See where the best coffee is concentrated across Brisbane, Gold Coast, Melbourne.";
    var canonical="https://koffeereview.com.au/map";

    var schemas='<script type="application/ld+json">'+JSON.stringify({"@context":"https://schema.org","@type":"WebPage","name":"Coffee Map of Australia","description":desc,"url":canonical,"publisher":{"@type":"Organization","name":"Koffee Review"}})+'<\/script>'
    +'<script type="application/ld+json">'+JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Koffee Review","item":"https://koffeereview.com.au"},{"@type":"ListItem","position":2,"name":"Coffee Map","item":canonical}]})+'<\/script>'
    +'<script type="application/ld+json">'+JSON.stringify({"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"How many cafes are on the map?","acceptedAnswer":{"@type":"Answer","text":mapped+" mapped out of "+total+"+ reviewed."}},{"@type":"Question","name":"What do the heat map colours mean?","acceptedAnswer":{"@type":"Answer","text":"Brighter green zones have clusters of high-scoring cafes. Dimmer areas have lower scores or fewer reviews."}},{"@type":"Question","name":"Which cities are covered?","acceptedAnswer":{"@type":"Answer","text":cityList.join(", ")+". Brisbane has the most coverage."}}]})+'<\/script>';

    var noscriptList=allCafes.slice(0,50).map(function(c){return'<a href="/review/'+makeSlug(c.name,c.suburb)+'" style="display:block;padding:4px 0;color:#2dd4bf;text-decoration:none;font-size:13px">'+c.score.toFixed(1)+' '+esc(c.name)+' '+esc(c.suburb)+'</a>';}).join("");

    var hotZoneCards=hotZones.map(function(z){
      var col=parseFloat(z.avg)>=7.5?"#4ade80":parseFloat(z.avg)>=7?"#2dd4bf":"#facc15";
      return'<div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:14px 16px;transition:all 0.2s;cursor:pointer" onclick="fm(\''+esc(z.name)+'\',null)"><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px"><span style="font-size:14px;font-weight:600;color:#fff">'+esc(z.name)+'</span><span style="font-family:Bebas Neue,sans-serif;font-size:20px;color:'+col+'">'+z.avg+'</span></div><div style="display:flex;align-items:center;gap:6px"><div style="height:3px;flex:1;border-radius:2px;background:rgba(255,255,255,0.06);overflow:hidden"><div style="height:100%;width:'+(parseFloat(z.avg)*10)+'%;background:'+col+';border-radius:2px"></div></div><span style="font-size:11px;color:rgba(255,255,255,0.4)">'+z.count+' cafes</span></div></div>';
    }).join("");

    var html='<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+esc(title)+'</title><meta name="description" content="'+esc(desc)+'"><link rel="canonical" href="'+canonical+'"><link rel="alternate" hreflang="en-AU" href="'+canonical+'"><meta property="og:title" content="'+esc(title)+'"><meta property="og:description" content="'+esc(desc)+'"><meta property="og:url" content="'+canonical+'"><meta property="og:image" content="https://koffeereview.com.au/logo.webp"><link rel="icon" href="/logo.webp">'+schemas
    +'<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"/>'
    +'<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">'
    +'<style>'
    +'*{margin:0;padding:0;box-sizing:border-box}'
    +'body{font-family:"DM Sans",sans-serif;background:#0d0d0f;color:#d4d4d4;line-height:1.6}'
    +'.c{max-width:960px;margin:0 auto;padding:0 20px 60px}'
    +'.nav{display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid rgba(230,192,115,0.08)}.nav-logo{display:flex;align-items:center;gap:10px;text-decoration:none}.nav-logo img{width:34px;height:34px;border-radius:50%;border:1.5px solid rgba(230,192,115,0.25)}.nav-logo span{font-family:"Bebas Neue",sans-serif;font-size:15px;letter-spacing:3px;color:#E6C073}.nav-links{display:flex;gap:14px}.nav-links a{font-size:12px;color:rgba(255,255,255,0.45);text-decoration:none}.nav-links a:hover{color:#E6C073}'
    +'.hero{text-align:center;padding:32px 0 12px}.hero h1{font-family:"Bebas Neue",sans-serif;font-size:38px;letter-spacing:3px;color:#fff;margin-bottom:4px}.hero-sub{color:rgba(255,255,255,0.5);font-size:13px;letter-spacing:0.5px}'
    +'.gold-line{height:1px;background:linear-gradient(90deg,transparent,rgba(230,192,115,0.3),transparent);margin:16px 0}'
    +'.stats{display:flex;justify-content:center;gap:0;margin:0 auto 16px;max-width:380px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;overflow:hidden}.stat{flex:1;text-align:center;padding:14px 8px;border-right:1px solid rgba(255,255,255,0.04)}.stat:last-child{border:none}.stat-n{font-family:"Bebas Neue",sans-serif;font-size:28px;color:#E6C073;line-height:1}.stat-l{font-size:9px;letter-spacing:2px;color:rgba(255,255,255,0.35);margin-top:2px}'
    +'.legend{display:flex;gap:12px;justify-content:center;margin:12px 0;flex-wrap:wrap}.leg{display:flex;align-items:center;gap:4px;font-size:11px;color:rgba(255,255,255,0.5)}.dot{width:10px;height:10px;border-radius:50%}'
    +'.mode-toggle{display:flex;justify-content:center;gap:6px;margin:12px 0}.mt{padding:7px 16px;border-radius:24px;border:1px solid rgba(255,255,255,0.06);background:transparent;color:rgba(255,255,255,0.45);font-size:12px;cursor:pointer;font-family:inherit;transition:all 0.2s}.mt:hover{border-color:rgba(230,192,115,0.2);color:#E6C073}.mt.on{background:linear-gradient(135deg,rgba(230,192,115,0.15),rgba(230,192,115,0.05));border-color:rgba(230,192,115,0.3);color:#E6C073}'
    +'.filters{display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin:10px 0}.fb{padding:6px 14px;border-radius:22px;border:1px solid rgba(255,255,255,0.06);background:transparent;color:rgba(255,255,255,0.45);font-size:11px;cursor:pointer;font-family:inherit;transition:all 0.2s;font-weight:500}.fb:hover{border-color:rgba(230,192,115,0.25);color:#E6C073}.fb.active{background:linear-gradient(135deg,#C9A84C,#E6C073);color:#000;border-color:#E6C073;font-weight:600}'
    +'.map-wrap{border-radius:16px;overflow:hidden;border:1px solid rgba(230,192,115,0.1);margin:14px 0;box-shadow:0 12px 40px rgba(0,0,0,0.4)}#map{height:480px;width:100%;background:#0d1117}'
    +'.hz-title{font-family:"Bebas Neue",sans-serif;font-size:15px;letter-spacing:3px;color:rgba(255,255,255,0.45);margin:24px 0 12px}'
    +'.hz-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}'
    +'.list-section{margin-top:28px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.04)}.list-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}.list-title{font-family:"Bebas Neue",sans-serif;font-size:14px;letter-spacing:3px;color:rgba(255,255,255,0.4)}.list-count{font-size:12px;color:rgba(230,192,115,0.5)}'
    +'.ct-row{display:flex;gap:5px;margin-bottom:12px;overflow-x:auto;padding-bottom:2px}.ct{padding:5px 12px;border-radius:18px;border:1px solid rgba(255,255,255,0.05);background:transparent;color:rgba(255,255,255,0.4);font-size:11px;cursor:pointer;font-family:inherit;white-space:nowrap;transition:all 0.15s}.ct:hover{color:#E6C073}.ct.act{background:rgba(230,192,115,0.08);color:#E6C073;border-color:rgba(230,192,115,0.2)}'
    +'.cc{display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:12px;border:1px solid rgba(255,255,255,0.04);background:rgba(255,255,255,0.02);margin-bottom:6px;text-decoration:none;color:inherit;transition:all 0.15s}.cc:hover{border-color:rgba(230,192,115,0.15);background:rgba(255,255,255,0.035);transform:translateX(2px)}'
    +'.cc-sc{font-family:"Bebas Neue",sans-serif;font-size:20px;min-width:40px;height:40px;border-radius:50%;border:2px solid;display:flex;align-items:center;justify-content:center;flex-shrink:0}.cc-info{flex:1;min-width:0}.cc-nm{font-size:13px;font-weight:600;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.cc-loc{font-size:11px;margin-top:1px;opacity:0.5}.cc-vd{display:inline-block;padding:1px 6px;border-radius:4px;font-size:8px;font-weight:700;letter-spacing:1.5px;margin-top:2px;border:1px solid;opacity:0.8}.cc-pr{font-size:11px;color:rgba(255,255,255,0.25);flex-shrink:0}'
    +'.lm{width:100%;padding:12px;border-radius:10px;border:1px solid rgba(230,192,115,0.15);background:rgba(230,192,115,0.03);color:#E6C073;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;letter-spacing:1px;margin-top:6px;transition:all 0.2s}.lm:hover{background:rgba(230,192,115,0.08);border-color:rgba(230,192,115,0.3)}'
    +'.faq{margin-top:28px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.04)}.faq-t{font-family:"Bebas Neue",sans-serif;font-size:14px;letter-spacing:4px;color:#E6C073;margin-bottom:12px}.fi{margin-bottom:6px;border:1px solid rgba(255,255,255,0.06);border-radius:10px;overflow:hidden}.fi[open]{border-color:rgba(230,192,115,0.2)}.fq{padding:12px 14px;font-size:13px;font-weight:600;color:#fff;cursor:pointer;list-style:none}.fq::-webkit-details-marker{display:none}.fq::after{content:"+";color:#E6C073;font-size:14px;float:right}.fi[open] .fq::after{content:"-"}.fa{padding:0 14px 12px;font-size:13px;color:rgba(255,255,255,0.55);line-height:1.7}'
    +'.ft{margin-top:36px;padding-top:18px;border-top:1px solid rgba(255,255,255,0.04);text-align:center;font-size:11px;color:rgba(255,255,255,0.35)}.ft a{color:rgba(255,255,255,0.5);text-decoration:none;margin:0 8px}'
    +'.leaflet-popup-content-wrapper{background:#1a1a1e!important;border:1px solid rgba(230,192,115,0.2)!important;border-radius:12px!important;box-shadow:0 8px 24px rgba(0,0,0,0.5)!important}.leaflet-popup-content{margin:12px 14px!important;color:#fff!important;font-family:"DM Sans",sans-serif!important}.leaflet-popup-tip{background:#1a1a1e!important}'
    +'@media(max-width:480px){#map{height:340px}.hero h1{font-size:28px}.hz-grid{grid-template-columns:1fr}.stats{max-width:100%}}'
    +'</style></head><body><div class="c">'

    +'<nav class="nav"><a href="/" class="nav-logo"><img src="/logo.webp" alt="KR"><span>KOFFEE REVIEW</span></a><div class="nav-links"><a href="/compare">Compare</a><a href="/blog">Blog</a><a href="/leaderboard">Leaderboard</a></div></nav>'

    +'<header class="hero"><h1>COFFEE HEAT MAP</h1><p class="hero-sub">'+total+'+ cafes reviewed &middot; colour-coded by quality &middot; updated 2026</p></header>'
    +'<div class="gold-line"></div>'

    +'<div class="stats"><div class="stat"><div class="stat-n">'+total+'+</div><div class="stat-l">REVIEWED</div></div><div class="stat"><div class="stat-n">'+mapped+'</div><div class="stat-l">MAPPED</div></div><div class="stat"><div class="stat-n">'+cityList.length+'</div><div class="stat-l">CITIES</div></div></div>'

    +'<div class="legend"><div class="leg"><div class="dot" style="background:#4ade80;box-shadow:0 0 6px #4ade8066"></div>8.0+ Great</div><div class="leg"><div class="dot" style="background:#2dd4bf;box-shadow:0 0 6px #2dd4bf66"></div>7.0+ Solid</div><div class="leg"><div class="dot" style="background:#facc15;box-shadow:0 0 6px #facc1566"></div>6.0+ Decent</div><div class="leg"><div class="dot" style="background:#fb923c;box-shadow:0 0 6px #fb923c66"></div>5.0+</div><div class="leg"><div class="dot" style="background:#f87171;box-shadow:0 0 6px #f8717166"></div>&lt;5</div></div>'

    +'<div class="mode-toggle"><button class="mt on" id="modeHeat" onclick="toggleMode(\'heat\')">Heat Map</button><button class="mt" id="modePins" onclick="toggleMode(\'pins\')">Pin Map</button></div>'

    +'<div class="filters"><button class="fb active" onclick="fm(null,this)">All</button>'
    +cityList.slice(0,6).map(function(c){return'<button class="fb" onclick="fm(\''+esc(c)+'\',this)">'+esc(c)+'</button>';}).join("")
    +'<button class="fb" onclick="fm(\'must\',this)">\u2605 7.5+</button></div>'

    +'<div class="map-wrap"><div id="map"></div></div>'

    +'<div class="hz-title">HOTTEST COFFEE ZONES</div>'
    +'<div class="hz-grid">'+hotZoneCards+'</div>'

    +'<section class="list-section"><div class="list-header"><div class="list-title">ALL CAFES</div><div class="list-count" id="lc"></div></div>'
    +'<div class="ct-row" id="ctRow"><button class="ct act" onclick="fc(null,this)">All</button>'
    +cityList.map(function(c){return'<button class="ct" onclick="fc(\''+esc(c)+'\',this)">'+esc(c)+' ('+cities[c]+')</button>';}).join("")
    +'</div><div id="cl"></div><button class="lm" id="lmBtn" onclick="lm()" style="display:none">LOAD MORE</button></section>'

    +'<noscript>'+noscriptList+'</noscript>'

    +'<section class="faq"><div class="faq-t">FREQUENTLY ASKED</div>'
    +'<details class="fi"><summary class="fq">How does the heat map work?</summary><p class="fa">Brighter, more intense zones indicate clusters of high-scoring cafes. The heat intensity is weighted by score — an 8.5 cafe generates more heat than a 6.0. Green zones are where the best coffee is concentrated.</p></details>'
    +'<details class="fi"><summary class="fq">How many cafes are mapped?</summary><p class="fa">'+mapped+' cafes with GPS coordinates out of '+total+'+ total reviewed across Australia.</p></details>'
    +'<details class="fi"><summary class="fq">What do the colours mean?</summary><p class="fa">Green = 8.0+ (Great/Elite). Teal = 7.0+ (Solid/Must Visit). Yellow = 6.0+ (Decent). Orange = 5.0+. Red = below 5.0 (Avoid).</p></details>'
    +'<details class="fi"><summary class="fq">Can I switch between heat map and pins?</summary><p class="fa">Yes. Use the toggle above the map to switch between Heat Map view (shows quality density) and Pin Map view (shows individual cafes). Both are filterable by city and score.</p></details>'
    +'</section>'

    +'<footer class="ft"><p style="font-size:10px;color:rgba(255,255,255,0.25);margin-bottom:6px;letter-spacing:1px">Last updated May 2026</p><p>&copy; 2026 Our Fair Dinkum Koffee Review</p><div style="margin-top:8px"><a href="/">Reviews</a> &middot; <a href="/compare">Compare</a> &middot; <a href="/blog">Blog</a> &middot; <a href="/leaderboard">Leaderboard</a></div></footer>'

    +'</div>'

    +'<script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"><\/script>'
    +'<script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet.heat/0.2.0/leaflet-heat.js"><\/script>'
    +'<script>'
    +'var MC='+mapData+';var LC='+listData+';'
    +'var map=L.map("map",{zoomControl:true,scrollWheelZoom:true}).setView([-27.47,153.02],11);'
    +'L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",{maxZoom:19,attribution:"Koffee Review"}).addTo(map);'
    +'var markers=[];var heatLayer=null;var mode="heat";'
    +'function gc(s){if(s>=9)return"#ffffff";if(s>=8)return"#4ade80";if(s>=7)return"#2dd4bf";if(s>=6)return"#facc15";if(s>=5)return"#fb923c";return"#f87171";}'
    +'function gv(s){if(s>=9)return"ELITE";if(s>=8)return"GREAT";if(s>=7.5)return"MUST VISIT";if(s>=7)return"SOLID";if(s>=6)return"DECENT";if(s>=5)return"JUST OKAY";return"AVOID";}'

    // Add heat layer
    +'function addHeat(list){'
    +'if(heatLayer){map.removeLayer(heatLayer);heatLayer=null;}'
    +'markers.forEach(function(m){map.removeLayer(m);});markers=[];'
    +'var pts=list.map(function(c){return[c.la,c.ln,c.sc/10];});'
    +'heatLayer=L.heatLayer(pts,{radius:30,blur:20,maxZoom:15,max:1.0,gradient:{0.2:"#f87171",0.4:"#fb923c",0.5:"#facc15",0.7:"#2dd4bf",0.85:"#4ade80",1.0:"#ffffff"}}).addTo(map);'
    +'if(list.length>0){var b=L.latLngBounds(list.map(function(c){return[c.la,c.ln];}));map.fitBounds(b.pad(0.1));}}'

    // Add pin markers
    +'function addPins(list){'
    +'if(heatLayer){map.removeLayer(heatLayer);heatLayer=null;}'
    +'markers.forEach(function(m){map.removeLayer(m);});markers=[];'
    +'list.forEach(function(c){'
    +'var col=gc(c.sc);var sz=c.sc>=8?15:c.sc>=7?12:10;'
    +'var icon=L.divIcon({className:"",html:\'<div style="width:\'+sz+\'px;height:\'+sz+\'px;border-radius:50%;background:\'+col+\';border:2px solid rgba(0,0,0,0.4);box-shadow:0 0 8px \'+col+\'55;transition:transform 0.2s;cursor:pointer" onmouseover="this.style.transform=\\\'scale(1.5)\\\'" onmouseout="this.style.transform=\\\'scale(1)\\\'"></div>\',iconSize:[sz,sz],iconAnchor:[sz/2,sz/2]});'
    +'var m=L.marker([c.la,c.ln],{icon:icon}).addTo(map);'
    +'m.bindPopup(\'<div style="min-width:170px"><div style="font-size:15px;font-weight:600">\'+c.n+\'</div><div style="font-size:11px;color:rgba(255,255,255,0.5);margin:3px 0">\'+c.s+", "+c.c+" &middot; "+c.p+\'</div><div style="display:flex;align-items:center;gap:8px;margin:10px 0"><div style="font-family:Bebas Neue,sans-serif;font-size:28px;color:\'+col+\'">\'+c.sc.toFixed(1)+\'</div><div style="font-size:10px;color:rgba(255,255,255,0.4)">/10<br>\'+gv(c.sc)+\'</div></div><a href="/review/\'+c.sl+\'" style="display:block;padding:7px 12px;background:\'+col+\';color:#000;text-align:center;border-radius:8px;font-size:11px;font-weight:600;text-decoration:none">View Review</a></div>\');'
    +'markers.push(m);});'
    +'if(list.length>0){var g=L.featureGroup(markers);map.fitBounds(g.getBounds().pad(0.1));}}'

    // Toggle heat/pins
    +'function toggleMode(m){mode=m;document.getElementById("modeHeat").className="mt"+(m==="heat"?" on":"");document.getElementById("modePins").className="mt"+(m==="pins"?" on":"");applyFilter();}'

    // Current filter state
    +'var curFilter=null;'
    +'function applyFilter(){'
    +'var list=MC;'
    +'if(curFilter==="must")list=MC.filter(function(c){return c.sc>=7.5;});'
    +'else if(curFilter)list=MC.filter(function(c){return c.c===curFilter||c.s===curFilter;});'
    +'if(mode==="heat")addHeat(list);else addPins(list);}'

    +'function fm(f,btn){curFilter=f;document.querySelectorAll(".fb").forEach(function(b){b.classList.remove("active");});if(btn)btn.classList.add("active");applyFilter();}'

    // Init
    +'addHeat(MC);'

    // List pagination
    +'var listCity=null;var listPage=0;var PP=10;'
    +'function gf(){return listCity?LC.filter(function(c){return c.c===listCity;}):LC;}'
    +'function rl(){'
    +'var f=gf();var s=f.slice(0,(listPage+1)*PP);var h="";'
    +'s.forEach(function(c){var col=gc(c.sc);h+=\'<a href="/review/\'+c.sl+\'" class="cc"><div class="cc-sc" style="color:\'+col+\';border-color:\'+col+\'">\'+c.sc.toFixed(1)+\'</div><div class="cc-info"><div class="cc-nm">\'+c.n+\'</div><div class="cc-loc" style="color:\'+col+\'">\'+c.s+", "+c.c+\'</div><div class="cc-vd" style="color:\'+col+\';border-color:\'+col+\'">\'+gv(c.sc)+\'</div></div><div class="cc-pr">\'+c.p+\'</div></a>\';});'
    +'document.getElementById("cl").innerHTML=h;document.getElementById("lc").textContent=s.length+" of "+f.length;'
    +'var b=document.getElementById("lmBtn");if(s.length<f.length){b.style.display="block";b.textContent="LOAD "+Math.min(PP,f.length-s.length)+" MORE";}else b.style.display="none";}'
    +'function lm(){listPage++;rl();}'
    +'function fc(c,btn){document.querySelectorAll(".ct").forEach(function(b){b.classList.remove("act");});if(btn)btn.classList.add("act");listCity=c;listPage=0;rl();}'
    +'rl();'
    +'<\/script></body></html>';

    res.setHeader("Content-Type","text/html; charset=utf-8");
    res.setHeader("Cache-Control","public, s-maxage=3600, stale-while-revalidate=86400");
    return res.status(200).send(html);
  }catch(e){
    res.setHeader("Content-Type","text/html; charset=utf-8");
    res.status(500).send('<!DOCTYPE html><html><head><title>Error</title></head><body style="background:#0d0d0f;color:#fff;font-family:sans-serif;text-align:center;padding:60px"><h1>Something went wrong</h1><a href="/" style="color:#E6C073">&larr; Back</a></body></html>');
  }
}
