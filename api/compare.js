// COMPARE TWO CAFÉS — Side-by-side comparison tool
// /api/compare → search/select page
// /api/compare?a=hope-anchor-paddington&b=cafe-latte-paddington → comparison

const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYEU8Khk3R5I879v3FcXPqhq0aCXa2ZWM1BwwJOyUitx2Boak_AFTOkwvB8qQrKIeU55NM4htFjHbI/pub?gid=0&single=true&output=csv";

function esc(s) { return (s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
function makeSlug(n,s) { return (n+"-"+s).toLowerCase().replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-"); }
function splitCSV(line) { var r=[],c="",q=false; for(var i=0;i<line.length;i++){var ch=line[i];if(ch==='"')q=!q;else if(ch===","&&!q){r.push(c.trim());c="";}else c+=ch;} r.push(c.trim()); return r; }

function getColor(s) {
  if(s>=9)return"#ffffff";if(s>=8)return"#4ade80";if(s>=7)return"#2dd4bf";
  if(s>=6)return"#facc15";if(s>=5)return"#fb923c";return"#f87171";
}
function getVerdict(s) {
  if(s>=9)return"ELITE";if(s>=8)return"GREAT";if(s>=7.5)return"MUST VISIT";
  if(s>=7)return"SOLID";if(s>=6)return"DECENT";if(s>=5)return"JUST OKAY";return"AVOID";
}
function haversine(lat1,lng1,lat2,lng2) {
  var R=6371,dLat=(lat2-lat1)*Math.PI/180,dLng=(lng2-lng1)*Math.PI/180;
  var a=Math.sin(dLat/2)*Math.sin(dLat/2)+Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)*Math.sin(dLng/2);
  return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
}

function parseCSV(text) {
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

function css() {
  return '*{margin:0;padding:0;box-sizing:border-box}body{font-family:Georgia,"Times New Roman",serif;background:#000;color:#E8E8E8;line-height:1.6;-webkit-font-smoothing:antialiased}.c{max-width:800px;margin:0 auto;padding:0 24px 60px}'
  +'.nav{display:flex;align-items:center;justify-content:space-between;padding:16px 0;border-bottom:1px solid rgba(255,255,255,0.06)}.nav-logo{display:flex;align-items:center;gap:10px;text-decoration:none}.nav-logo img{width:32px;height:32px;border-radius:50%}.nav-logo span{font-size:11px;letter-spacing:3px;color:#E6C073;font-weight:600}.nav-links{display:flex;gap:16px}.nav-links a{font-size:12px;color:rgba(255,255,255,0.55);text-decoration:none}'
  +'.bc{padding:12px 0;font-size:12px;color:rgba(255,255,255,0.5)}.bc a{color:#E6C073;text-decoration:none}'
  +'.hero{text-align:center;padding:32px 0 24px}.hero h1{font-size:32px;line-height:1.1;margin-bottom:8px;color:#fff}.hero p{color:rgba(255,255,255,0.6);font-size:15px}'
  // Search
  +'.search-row{display:flex;gap:12px;margin:24px 0;flex-wrap:wrap}.search-box{flex:1;min-width:200px}.search-box label{display:block;font-size:10px;letter-spacing:3px;color:#E6C073;font-weight:700;margin-bottom:8px}'
  +'.search-input{width:100%;padding:12px 16px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:12px;color:#fff;font-size:14px;font-family:inherit;outline:none}'
  +'.search-input:focus{border-color:rgba(230,192,115,0.4)}'
  +'.results{max-height:240px;overflow-y:auto;border:1px solid rgba(255,255,255,0.08);border-radius:12px;margin-top:4px}'
  +'.result-item{padding:10px 14px;cursor:pointer;border-bottom:1px solid rgba(255,255,255,0.04);display:flex;align-items:center;gap:10px;transition:background 0.15s}'
  +'.result-item:hover{background:rgba(230,192,115,0.06)}'
  +'.result-score{font-size:16px;font-weight:700;min-width:32px;text-align:center}'
  +'.result-name{font-size:13px;color:#fff}.result-sub{font-size:11px;color:rgba(255,255,255,0.4)}'
  // Comparison
  +'.vs{display:flex;gap:0;margin:32px 0;border-radius:20px;overflow:hidden;border:1px solid rgba(255,255,255,0.08)}'
  +'.vs-card{flex:1;padding:28px 20px;text-align:center;position:relative;background:rgba(255,255,255,0.02)}'
  +'.vs-card.winner{background:rgba(230,192,115,0.04);border-color:rgba(230,192,115,0.2)}'
  +'.vs-divider{width:1px;background:rgba(255,255,255,0.06);position:relative;display:flex;align-items:center;justify-content:center}'
  +'.vs-badge{position:absolute;width:40px;height:40px;border-radius:50%;background:#0a0a0a;border:1px solid rgba(255,255,255,0.12);display:flex;align-items:center;justify-content:center;font-size:12px;color:rgba(255,255,255,0.4);font-weight:700;z-index:2}'
  +'.vs-name{font-size:18px;font-weight:700;color:#fff;margin-bottom:4px}'
  +'.vs-loc{font-size:12px;color:rgba(255,255,255,0.5);margin-bottom:20px}'
  // Score ring
  +'.ring{position:relative;width:120px;height:120px;margin:0 auto 12px}'
  +'.ring svg{transform:rotate(-90deg)}'
  +'.ring-num{position:absolute;top:50%;left:50%;transform:translate(-50%,-55%);font-size:38px;font-weight:700;line-height:1}'
  +'.ring-sub{position:absolute;top:62%;left:50%;transform:translateX(-50%);font-size:12px;color:rgba(255,255,255,0.3)}'
  +'.verdict{display:inline-block;padding:5px 18px;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:2.5px;margin-bottom:16px}'
  +'.vs-notes{font-size:13px;color:rgba(255,255,255,0.6);font-style:italic;line-height:1.6;padding:0 8px}'
  +'.vs-price{font-size:12px;color:rgba(255,255,255,0.4);margin-top:12px}'
  // Result bar
  +'.result-bar{margin:24px 0;padding:20px 24px;background:rgba(230,192,115,0.04);border:1px solid rgba(230,192,115,0.2);border-radius:16px;text-align:center}'
  +'.result-winner{font-size:18px;font-weight:700;color:#E6C073;margin-bottom:4px}'
  +'.result-detail{font-size:13px;color:rgba(255,255,255,0.5)}'
  // Links
  +'.compare-links{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:24px 0}'
  +'.cl-link{padding:12px;background:rgba(255,255,255,0.03);border:1px solid rgba(230,192,115,0.15);border-radius:10px;color:#E6C073;text-decoration:none;font-size:13px;text-align:center;transition:all 0.2s}'
  +'.cl-link:hover{border-color:rgba(230,192,115,0.4);background:rgba(230,192,115,0.06)}'
  // Share
  +'.share-row{display:flex;gap:8px;justify-content:center;margin:16px 0}'
  +'.share-btn{padding:8px 20px;border-radius:20px;border:1px solid rgba(230,192,115,0.3);background:transparent;color:#E6C073;font-size:12px;cursor:pointer;font-family:inherit;transition:all 0.2s}'
  +'.share-btn:hover{background:#E6C073;color:#000}'
  // Footer
  +'.ft{margin-top:48px;padding-top:24px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;font-size:11px;color:rgba(255,255,255,0.45)}.ft a{color:rgba(255,255,255,0.6);text-decoration:none;margin:0 8px}'
  +'@media(max-width:480px){.vs{flex-direction:column}.vs-divider{width:100%;height:1px}.vs-badge{top:-20px;left:50%;transform:translateX(-50%)}.hero h1{font-size:24px}.compare-links{grid-template-columns:1fr}}';
}

function renderSearch(cafes) {
  var cafeJSON = JSON.stringify(cafes.map(function(c){return{name:c.name,suburb:c.suburb,city:c.city,score:c.score,slug:makeSlug(c.name,c.suburb)};}));

  return '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
  +'<title>Compare Two Cafes | Koffee Review</title>'
  +'<meta name="description" content="Compare any two cafes side by side. See scores, verdicts, tasting notes, and which one wins. Data from 600+ blind reviews.">'
  +'<link rel="canonical" href="https://koffeereview.com.au/compare">'
  +'<link rel="alternate" hreflang="en-AU" href="https://koffeereview.com.au/compare">'
  +'<link rel="icon" href="/logo.webp">'
  +'<style>'+css()+'</style>'
  +'</head><body><div class="c">'
  +'<nav class="nav"><a href="/" class="nav-logo"><img src="/logo.webp" alt="Koffee Review"><span>KOFFEE REVIEW</span></a><div class="nav-links"><a href="/blog">Blog</a><a href="/leaderboard">Leaderboard</a></div></nav>'
  +'<div class="bc"><a href="/">Home</a> &middot; <span>Compare</span></div>'
  +'<header class="hero"><h1>Compare Two Caf\u00e9s</h1><p>Pick any two cafes from our 600+ reviews and see them head to head.</p></header>'
  +'<div class="search-row">'
  +'<div class="search-box"><label>CAF\u00c9 A</label><input class="search-input" id="searchA" placeholder="Search cafe name..." oninput="filterList(\'A\')"><div class="results" id="resultsA" style="display:none"></div></div>'
  +'<div class="search-box"><label>CAF\u00c9 B</label><input class="search-input" id="searchB" placeholder="Search cafe name..." oninput="filterList(\'B\')"><div class="results" id="resultsB" style="display:none"></div></div>'
  +'</div>'
  +'<div id="compareBtn" style="text-align:center;margin:24px 0;display:none"><button onclick="goCompare()" class="share-btn" style="padding:12px 32px;font-size:14px;font-weight:700">Compare Now &rarr;</button></div>'
  +'<div style="text-align:center;margin:32px 0"><p style="color:rgba(255,255,255,0.3);font-size:13px">Or try a popular comparison:</p><div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-top:12px">'
  +'<a href="/compare?a='+makeSlug(cafes[0].name,cafes[0].suburb)+'&b='+makeSlug(cafes[1].name,cafes[1].suburb)+'" class="cl-link" style="font-size:12px">'+esc(cafes[0].name)+' vs '+esc(cafes[1].name)+'</a>'
  +'</div></div>'
  +'<footer class="ft"><p>&copy; 2026 Our Fair Dinkum Koffee Review</p><div style="margin-top:10px"><a href="/about">About</a> &middot; <a href="/leaderboard">Leaderboard</a> &middot; <a href="/blog">Blog</a></div></footer>'
  +'</div>'
  +'<script>'
  +'var cafes='+cafeJSON+';'
  +'var selA=null,selB=null;'
  +'function filterList(side){'
  +'var input=document.getElementById("search"+side).value.toLowerCase();'
  +'var div=document.getElementById("results"+side);'
  +'if(input.length<2){div.style.display="none";return;}'
  +'var matches=cafes.filter(function(c){return c.name.toLowerCase().indexOf(input)>-1||c.suburb.toLowerCase().indexOf(input)>-1;}).slice(0,8);'
  +'if(matches.length===0){div.style.display="none";return;}'
  +'div.innerHTML=matches.map(function(c){var col=c.score>=9?"#ffffff":c.score>=8?"#4ade80":c.score>=7?"#2dd4bf":c.score>=6?"#facc15":c.score>=5?"#fb923c":"#f87171";'
  +'return "<div class=\\"result-item\\" onclick=\\"selectCafe(\'"+side+"\',\'"+c.slug.replace(/\'/g,"")+"\\')\\"><span class=\\"result-score\\" style=\\"color:"+col+"\\">"+c.score.toFixed(1)+"</span><div><div class=\\"result-name\\">"+c.name+"</div><div class=\\"result-sub\\">"+c.suburb+", "+c.city+"</div></div></div>";}).join("");'
  +'div.style.display="block";}'
  +'function selectCafe(side,slug){'
  +'var cafe=cafes.find(function(c){return c.slug===slug;});'
  +'if(!cafe)return;'
  +'if(side==="A"){selA=cafe;document.getElementById("searchA").value=cafe.name;document.getElementById("resultsA").style.display="none";}'
  +'else{selB=cafe;document.getElementById("searchB").value=cafe.name;document.getElementById("resultsB").style.display="none";}'
  +'if(selA&&selB)document.getElementById("compareBtn").style.display="block";}'
  +'function goCompare(){'
  +'if(!selA||!selB)return;'
  +'window.location.href="/compare?a="+selA.slug+"&b="+selB.slug;}'
  +'</script>'
  +'</body></html>';
}

function renderComparison(cafeA, cafeB, allCafes) {
  var colA = getColor(cafeA.score), colB = getColor(cafeB.score);
  var verdA = getVerdict(cafeA.score), verdB = getVerdict(cafeB.score);
  var diff = Math.abs(cafeA.score - cafeB.score).toFixed(1);
  var winner = cafeA.score > cafeB.score ? cafeA : cafeB.score > cafeA.score ? cafeB : null;
  var winnerName = winner ? winner.name : null;
  var rA=48, circA=2*Math.PI*rA, offA=circA-(cafeA.score/10)*circA;
  var rB=48, circB=2*Math.PI*rB, offB=circB-(cafeB.score/10)*circB;

  var distance = "";
  if (cafeA.lat && cafeB.lat && Math.abs(cafeA.lat) > 1 && Math.abs(cafeB.lat) > 1) {
    var km = haversine(cafeA.lat, cafeA.lng, cafeB.lat, cafeB.lng);
    distance = km.toFixed(1) + " km apart";
  }
  var sameSuburb = cafeA.suburb.toLowerCase() === cafeB.suburb.toLowerCase();
  var slugA = makeSlug(cafeA.name, cafeA.suburb), slugB = makeSlug(cafeB.name, cafeB.suburb);
  var shareUrl = "https://koffeereview.com.au/compare?a=" + slugA + "&b=" + slugB;
  var notesA = cafeA.notes ? (cafeA.notes.length > 100 ? cafeA.notes.substring(0,100)+"..." : cafeA.notes) : "";
  var notesB = cafeB.notes ? (cafeB.notes.length > 100 ? cafeB.notes.substring(0,100)+"..." : cafeB.notes) : "";

  var title = esc(cafeA.name) + " vs " + esc(cafeB.name) + " | Koffee Review";
  var desc = "Compare " + esc(cafeA.name) + " (" + cafeA.score + "/10) vs " + esc(cafeB.name) + " (" + cafeB.score + "/10). " + (winner ? esc(winner.name) + " wins by " + diff + " points." : "Dead heat.");

  var schema = JSON.stringify({"@context":"https://schema.org","@type":"WebPage","name":cafeA.name+" vs "+cafeB.name,"description":desc,"url":shareUrl});

  return '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
  +'<title>'+title+'</title>'
  +'<meta name="description" content="'+esc(desc)+'">'
  +'<link rel="canonical" href="'+shareUrl+'">'
  +'<link rel="alternate" hreflang="en-AU" href="'+shareUrl+'">'
  +'<meta property="og:title" content="'+title+'">'
  +'<meta property="og:description" content="'+esc(desc)+'">'
  +'<meta property="og:url" content="'+shareUrl+'">'
  +'<meta property="og:image" content="https://koffeereview.com.au/logo.webp">'
  +'<meta name="twitter:card" content="summary_large_image">'
  +'<link rel="icon" href="/logo.webp">'
  +'<script type="application/ld+json">'+schema+'</script>'
  +'<style>'+css()+'</style>'
  +'</head><body><div class="c">'
  +'<nav class="nav"><a href="/" class="nav-logo"><img src="/logo.webp" alt="Koffee Review"><span>KOFFEE REVIEW</span></a><div class="nav-links"><a href="/compare">New Compare</a><a href="/leaderboard">Leaderboard</a></div></nav>'
  +'<div class="bc"><a href="/">Home</a> &middot; <a href="/compare">Compare</a> &middot; <span>'+esc(cafeA.name)+' vs '+esc(cafeB.name)+'</span></div>'

  // VS Cards
  +'<div class="vs">'
  // Cafe A
  +'<div class="vs-card'+(winner&&winner.name===cafeA.name?' winner':'')+'">'
  +(winner&&winner.name===cafeA.name?'<div style="font-size:10px;letter-spacing:3px;color:#E6C073;font-weight:700;margin-bottom:12px">\u2605 WINNER</div>':'')
  +'<div class="vs-name">'+esc(cafeA.name)+'</div>'
  +'<div class="vs-loc">'+esc(cafeA.suburb)+', '+esc(cafeA.city)+'</div>'
  +'<div class="ring"><svg width="120" height="120" viewBox="0 0 120 120"><circle cx="60" cy="60" r="'+rA+'" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="4"/><circle cx="60" cy="60" r="'+rA+'" fill="none" stroke="'+colA+'" stroke-width="4" stroke-dasharray="'+circA.toFixed(1)+'" stroke-dashoffset="'+offA.toFixed(1)+'" stroke-linecap="round"/></svg><div class="ring-num" style="color:'+colA+'">'+cafeA.score.toFixed(1)+'</div><div class="ring-sub">/10</div></div>'
  +'<div class="verdict" style="background:'+colA+';color:#000">'+verdA+'</div>'
  +(notesA?'<div class="vs-notes">&ldquo;'+esc(notesA)+'&rdquo;</div>':'')
  +'<div class="vs-price">'+esc(cafeA.price)+'</div>'
  +'</div>'

  // Divider with VS
  +'<div class="vs-divider"><div class="vs-badge">VS</div></div>'

  // Cafe B
  +'<div class="vs-card'+(winner&&winner.name===cafeB.name?' winner':'')+'">'
  +(winner&&winner.name===cafeB.name?'<div style="font-size:10px;letter-spacing:3px;color:#E6C073;font-weight:700;margin-bottom:12px">\u2605 WINNER</div>':'')
  +'<div class="vs-name">'+esc(cafeB.name)+'</div>'
  +'<div class="vs-loc">'+esc(cafeB.suburb)+', '+esc(cafeB.city)+'</div>'
  +'<div class="ring"><svg width="120" height="120" viewBox="0 0 120 120"><circle cx="60" cy="60" r="'+rB+'" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="4"/><circle cx="60" cy="60" r="'+rB+'" fill="none" stroke="'+colB+'" stroke-width="4" stroke-dasharray="'+circB.toFixed(1)+'" stroke-dashoffset="'+offB.toFixed(1)+'" stroke-linecap="round"/></svg><div class="ring-num" style="color:'+colB+'">'+cafeB.score.toFixed(1)+'</div><div class="ring-sub">/10</div></div>'
  +'<div class="verdict" style="background:'+colB+';color:#000">'+verdB+'</div>'
  +(notesB?'<div class="vs-notes">&ldquo;'+esc(notesB)+'&rdquo;</div>':'')
  +'<div class="vs-price">'+esc(cafeB.price)+'</div>'
  +'</div>'
  +'</div>'

  // Result bar
  +'<div class="result-bar">'
  +(winner
    ?'<div class="result-winner">\u2615 '+esc(winner.name)+' wins by '+diff+' points</div>'
    :'<div class="result-winner">\u2615 Dead heat — both scored '+cafeA.score.toFixed(1)+'</div>')
  +'<div class="result-detail">'
  +(sameSuburb?'\uD83D\uDCCD Both in '+esc(cafeA.suburb)+(distance?' &middot; '+distance:''):'')
  +(!sameSuburb&&distance?'\uD83D\uDCCD '+distance:'')
  +'</div>'
  +'</div>'

  // Share
  +'<div class="share-row">'
  +'<button class="share-btn" onclick="if(navigator.share){navigator.share({title:\''+esc(cafeA.name)+' vs '+esc(cafeB.name)+'\',url:window.location.href})}else{navigator.clipboard.writeText(window.location.href);this.textContent=\'Copied!\';var b=this;setTimeout(function(){b.textContent=\'Share\'},2000)}">Share</button>'
  +'<a href="/compare" class="share-btn" style="text-decoration:none">New Comparison</a>'
  +'</div>'

  // Links
  +'<div class="compare-links">'
  +'<a href="/review/'+slugA+'" class="cl-link">'+esc(cafeA.name)+' Full Review &rarr;</a>'
  +'<a href="/review/'+slugB+'" class="cl-link">'+esc(cafeB.name)+' Full Review &rarr;</a>'
  +(sameSuburb?'<a href="/suburb/'+makeSlug(cafeA.suburb,cafeA.city)+'" class="cl-link" style="grid-column:span 2">All '+esc(cafeA.suburb)+' Cafes &rarr;</a>':'')
  +'</div>'

  // Footer
  +'<footer class="ft"><p style="font-size:10px;color:rgba(255,255,255,0.3);margin-bottom:8px;letter-spacing:1px">Last updated May 2026</p><p>&copy; 2026 Our Fair Dinkum Koffee Review</p><div style="margin-top:10px"><a href="/about">About</a> &middot; <a href="/leaderboard">Leaderboard</a> &middot; <a href="/blog">Blog</a></div></footer>'
  +'</div></body></html>';
}

export default async function handler(req, res) {
  try {
    var controller = new AbortController();
    var tid = setTimeout(function(){controller.abort();},10000);
    var response = await fetch(SHEET_URL, {signal:controller.signal});
    clearTimeout(tid);
    if(!response.ok) throw new Error("Sheet fetch failed");
    var text = await response.text();
    var cafes = parseCSV(text);

    var a = (req.query.a||"").replace(/-+/g,"-");
    var b = (req.query.b||"").replace(/-+/g,"-");

    if(!a||!b) {
      // Sort by score descending for popular comparisons
      cafes.sort(function(x,y){return y.score-x.score;});
      res.setHeader("Content-Type","text/html; charset=utf-8");
      res.setHeader("Cache-Control","public, s-maxage=3600, stale-while-revalidate=86400");
      return res.status(200).send(renderSearch(cafes));
    }

    var cafeA = cafes.find(function(c){return makeSlug(c.name,c.suburb)===a;});
    var cafeB = cafes.find(function(c){return makeSlug(c.name,c.suburb)===b;});

    if(!cafeA||!cafeB) {
      res.setHeader("Content-Type","text/html; charset=utf-8");
      return res.status(404).send('<!DOCTYPE html><html><head><title>Not Found</title></head><body style="background:#000;color:#fff;font-family:sans-serif;text-align:center;padding:60px"><h1 style="color:#E6C073">Cafe not found</h1><p style="color:rgba(255,255,255,0.5)">One or both cafes could not be found.</p><a href="/compare" style="color:#E6C073">&larr; Try Again</a></body></html>');
    }

    res.setHeader("Content-Type","text/html; charset=utf-8");
    res.setHeader("Cache-Control","public, s-maxage=3600, stale-while-revalidate=86400");
    return res.status(200).send(renderComparison(cafeA, cafeB, cafes));

  } catch(error) {
    res.setHeader("Content-Type","text/html; charset=utf-8");
    res.status(500).send('<!DOCTYPE html><html><head><title>Error</title></head><body style="background:#000;color:#fff;font-family:sans-serif;text-align:center;padding:60px"><h1>Something went wrong</h1><a href="/" style="color:#E6C073">&larr; Back</a></body></html>');
  }
}
