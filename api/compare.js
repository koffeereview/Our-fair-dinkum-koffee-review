const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYEU8Khk3R5I879v3FcXPqhq0aCXa2ZWM1BwwJOyUitx2Boak_AFTOkwvB8qQrKIeU55NM4htFjHbI/pub?gid=0&single=true&output=csv";

function esc(s){return(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
function makeSlug(n,s){return(n+"-"+s).toLowerCase().replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-");}
function splitCSV(line){var r=[],c="",q=false;for(var i=0;i<line.length;i++){var ch=line[i];if(ch==='"')q=!q;else if(ch===","&&!q){r.push(c.trim());c="";}else c+=ch;}r.push(c.trim());return r;}
function getColor(s){if(s>=9)return"#ffffff";if(s>=8)return"#4ade80";if(s>=7)return"#2dd4bf";if(s>=6)return"#facc15";if(s>=5)return"#fb923c";return"#f87171";}
function getVerdict(s){if(s>=9)return"ELITE";if(s>=8)return"GREAT";if(s>=7.5)return"MUST VISIT";if(s>=7)return"SOLID";if(s>=6)return"DECENT";if(s>=5)return"JUST OKAY";return"AVOID";}
function haversine(lat1,lng1,lat2,lng2){var R=6371,dLat=(lat2-lat1)*Math.PI/180,dLng=(lng2-lng1)*Math.PI/180;var a=Math.sin(dLat/2)*Math.sin(dLat/2)+Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)*Math.sin(dLng/2);return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));}

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

function styles(){
  return '<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Georgia,serif;background:#000;color:#E8E8E8;line-height:1.6}.c{max-width:800px;margin:0 auto;padding:0 24px 60px}.nav{display:flex;align-items:center;justify-content:space-between;padding:16px 0;border-bottom:1px solid rgba(255,255,255,0.06)}.nav-logo{display:flex;align-items:center;gap:10px;text-decoration:none}.nav-logo img{width:32px;height:32px;border-radius:50%}.nav-logo span{font-size:11px;letter-spacing:3px;color:#E6C073;font-weight:600}.nav-links{display:flex;gap:16px}.nav-links a{font-size:12px;color:rgba(255,255,255,0.55);text-decoration:none}.bc{padding:12px 0;font-size:12px;color:rgba(255,255,255,0.5)}.bc a{color:#E6C073;text-decoration:none}.hero{text-align:center;padding:32px 0 24px}.hero h1{font-size:32px;line-height:1.1;margin-bottom:8px;color:#fff}.hero p{color:rgba(255,255,255,0.6);font-size:15px}.si{width:100%;padding:12px 16px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:12px;color:#fff;font-size:14px;font-family:inherit;outline:none}.si:focus{border-color:rgba(230,192,115,0.4)}.rl{max-height:240px;overflow-y:auto;border:1px solid rgba(255,255,255,0.08);border-radius:12px;margin-top:4px;display:none}.ri{padding:10px 14px;cursor:pointer;border-bottom:1px solid rgba(255,255,255,0.04);display:flex;align-items:center;gap:10px}.ri:hover{background:rgba(230,192,115,0.06)}.vs{display:flex;gap:0;margin:32px 0;border-radius:20px;overflow:hidden;border:1px solid rgba(255,255,255,0.08)}.vc{flex:1;padding:28px 20px;text-align:center;background:rgba(255,255,255,0.02)}.vc.w{background:rgba(230,192,115,0.04)}.vd{width:1px;background:rgba(255,255,255,0.06);display:flex;align-items:center;justify-content:center;position:relative}.vb{position:absolute;width:40px;height:40px;border-radius:50%;background:#0a0a0a;border:1px solid rgba(255,255,255,0.12);display:flex;align-items:center;justify-content:center;font-size:12px;color:rgba(255,255,255,0.4);font-weight:700}.ring{position:relative;width:120px;height:120px;margin:0 auto 12px}.ring svg{transform:rotate(-90deg)}.rn{position:absolute;top:50%;left:50%;transform:translate(-50%,-55%);font-size:38px;font-weight:700;line-height:1}.rs{position:absolute;top:62%;left:50%;transform:translateX(-50%);font-size:12px;color:rgba(255,255,255,0.3)}.vp{display:inline-block;padding:5px 18px;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:2.5px;margin-bottom:16px}.rb{margin:24px 0;padding:20px 24px;background:rgba(230,192,115,0.04);border:1px solid rgba(230,192,115,0.2);border-radius:16px;text-align:center}.rw{font-size:18px;font-weight:700;color:#E6C073;margin-bottom:4px}.rd{font-size:13px;color:rgba(255,255,255,0.5)}.cl{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:24px 0}.ca{padding:12px;background:rgba(255,255,255,0.03);border:1px solid rgba(230,192,115,0.15);border-radius:10px;color:#E6C073;text-decoration:none;font-size:13px;text-align:center}.ca:hover{border-color:rgba(230,192,115,0.4)}.sb{padding:8px 20px;border-radius:20px;border:1px solid rgba(230,192,115,0.3);background:transparent;color:#E6C073;font-size:12px;cursor:pointer;font-family:inherit}.sb:hover{background:#E6C073;color:#000}.ft{margin-top:48px;padding-top:24px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;font-size:11px;color:rgba(255,255,255,0.45)}.ft a{color:rgba(255,255,255,0.6);text-decoration:none;margin:0 8px}@media(max-width:480px){.vs{flex-direction:column}.vd{width:100%;height:1px}.hero h1{font-size:24px}.cl{grid-template-columns:1fr}}</style>';
}

function renderSearch(cafes){
  // Build cafe data as JSON for client-side search
  var data = cafes.map(function(c){return{n:c.name,s:c.suburb,c:c.city,sc:c.score,sl:makeSlug(c.name,c.suburb)};});
  var dataJSON = JSON.stringify(data).replace(/</g,"\\u003c");

  return '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Compare Two Cafes | Koffee Review</title><meta name="description" content="Compare any two cafes side by side. Scores, verdicts, tasting notes. Data from 600+ blind reviews."><link rel="canonical" href="https://koffeereview.com.au/compare"><link rel="icon" href="/logo.webp">' + styles() + '</head><body><div class="c"><nav class="nav"><a href="/" class="nav-logo"><img src="/logo.webp" alt="KR"><span>KOFFEE REVIEW</span></a><div class="nav-links"><a href="/blog">Blog</a><a href="/leaderboard">Leaderboard</a></div></nav><div class="bc"><a href="/">Home</a> &middot; <span>Compare</span></div><header class="hero"><h1>Compare Two Caf\u00e9s</h1><p>Pick any two from our 600+ reviews. See who wins.</p></header>'
  +'<div style="display:flex;gap:12px;margin:24px 0;flex-wrap:wrap">'
  +'<div style="flex:1;min-width:200px"><div style="font-size:10px;letter-spacing:3px;color:#E6C073;font-weight:700;margin-bottom:8px">CAF\u00c9 A</div><input class="si" id="sA" placeholder="Search cafe name..." oninput="fl(\'A\')"><div class="rl" id="rA"></div></div>'
  +'<div style="flex:1;min-width:200px"><div style="font-size:10px;letter-spacing:3px;color:#E6C073;font-weight:700;margin-bottom:8px">CAF\u00c9 B</div><input class="si" id="sB" placeholder="Search cafe name..." oninput="fl(\'B\')"><div class="rl" id="rB"></div></div>'
  +'</div>'
  +'<div id="goBtn" style="text-align:center;margin:24px 0;display:none"><button class="sb" style="padding:12px 32px;font-size:14px;font-weight:700" onclick="go()">Compare Now &rarr;</button></div>'
  +'<footer class="ft"><p>&copy; 2026 Our Fair Dinkum Koffee Review</p><div style="margin-top:10px"><a href="/">All Reviews</a> &middot; <a href="/leaderboard">Leaderboard</a> &middot; <a href="/blog">Blog</a></div></footer>'
  +'</div><script>'
  +'var D=' + dataJSON + ';var selA=null,selB=null;'
  +'function gc(s){if(s>=9)return"#ffffff";if(s>=8)return"#4ade80";if(s>=7)return"#2dd4bf";if(s>=6)return"#facc15";if(s>=5)return"#fb923c";return"#f87171";}'
  +'function fl(side){var inp=document.getElementById("s"+side).value.toLowerCase();var div=document.getElementById("r"+side);if(inp.length<2){div.style.display="none";return;}var m=D.filter(function(c){return c.n.toLowerCase().indexOf(inp)>-1||c.s.toLowerCase().indexOf(inp)>-1;}).slice(0,8);if(m.length===0){div.style.display="none";return;}div.innerHTML=m.map(function(c){var col=gc(c.sc);return\'<div class="ri" onclick="sel(\\\'\'+side+\'\\\',\\\'\'+c.sl+\'\\\')"><span style="font-size:16px;font-weight:700;min-width:32px;text-align:center;color:\'+col+\'">\'+ c.sc.toFixed(1)+\'</span><div><div style="font-size:13px;color:#fff">\'+c.n+\'</div><div style="font-size:11px;color:rgba(255,255,255,0.4)">\'+c.s+", "+c.c+\'</div></div></div>\';}).join("");div.style.display="block";}'
  +'function sel(side,slug){var c=D.find(function(x){return x.sl===slug;});if(!c)return;if(side==="A"){selA=c;document.getElementById("sA").value=c.n;}else{selB=c;document.getElementById("sB").value=c.n;}document.getElementById("r"+side).style.display="none";if(selA&&selB)document.getElementById("goBtn").style.display="block";}'
  +'function go(){if(!selA||!selB)return;window.location.href="/compare?a="+selA.sl+"&b="+selB.sl;}'
  +'</script></body></html>';
}

function renderComparison(cafeA, cafeB){
  var colA=getColor(cafeA.score),colB=getColor(cafeB.score);
  var vA=getVerdict(cafeA.score),vB=getVerdict(cafeB.score);
  var diff=Math.abs(cafeA.score-cafeB.score).toFixed(1);
  var winner=cafeA.score>cafeB.score?cafeA:cafeB.score>cafeA.score?cafeB:null;
  var r=48,cA=2*Math.PI*r,oA=cA-(cafeA.score/10)*cA,cB=2*Math.PI*r,oB=cB-(cafeB.score/10)*cB;
  var dist="";
  if(cafeA.lat&&cafeB.lat&&Math.abs(cafeA.lat)>1&&Math.abs(cafeB.lat)>1){dist=haversine(cafeA.lat,cafeA.lng,cafeB.lat,cafeB.lng).toFixed(1)+" km apart";}
  var sameSub=cafeA.suburb.toLowerCase()===cafeB.suburb.toLowerCase();
  var slugA=makeSlug(cafeA.name,cafeA.suburb),slugB=makeSlug(cafeB.name,cafeB.suburb);
  var nA=cafeA.notes?(cafeA.notes.length>100?cafeA.notes.substring(0,100)+"...":cafeA.notes):"";
  var nB=cafeB.notes?(cafeB.notes.length>100?cafeB.notes.substring(0,100)+"...":cafeB.notes):"";
  var title=esc(cafeA.name)+" vs "+esc(cafeB.name)+" | Koffee Review";
  var desc="Compare "+esc(cafeA.name)+" ("+cafeA.score+"/10) vs "+esc(cafeB.name)+" ("+cafeB.score+"/10). "+(winner?esc(winner.name)+" wins by "+diff+" points.":"Dead heat.");
  var url="https://koffeereview.com.au/compare?a="+slugA+"&b="+slugB;

  function ring(score,color,offset,circ){
    return '<div class="ring"><svg width="120" height="120" viewBox="0 0 120 120"><circle cx="60" cy="60" r="'+r+'" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="4"/><circle cx="60" cy="60" r="'+r+'" fill="none" stroke="'+color+'" stroke-width="4" stroke-dasharray="'+circ.toFixed(1)+'" stroke-dashoffset="'+offset.toFixed(1)+'" stroke-linecap="round"/></svg><div class="rn" style="color:'+color+'">'+score.toFixed(1)+'</div><div class="rs">/10</div></div>';
  }

  function card(cafe,col,verdict,notes,isWinner,scoreRing){
    return '<div class="vc'+(isWinner?' w':'')+'">'
    +(isWinner?'<div style="font-size:10px;letter-spacing:3px;color:#E6C073;font-weight:700;margin-bottom:12px">\u2605 WINNER</div>':'')
    +'<div style="font-size:18px;font-weight:700;color:#fff;margin-bottom:4px">'+esc(cafe.name)+'</div>'
    +'<div style="font-size:12px;color:rgba(255,255,255,0.5);margin-bottom:20px">'+esc(cafe.suburb)+', '+esc(cafe.city)+'</div>'
    +scoreRing
    +'<div class="vp" style="background:'+col+';color:#000">'+verdict+'</div>'
    +(notes?'<div style="font-size:13px;color:rgba(255,255,255,0.6);font-style:italic;line-height:1.6;padding:0 8px">&ldquo;'+esc(notes)+'&rdquo;</div>':'')
    +'<div style="font-size:12px;color:rgba(255,255,255,0.4);margin-top:12px">'+esc(cafe.price)+'</div>'
    +'</div>';
  }

  return '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+title+'</title><meta name="description" content="'+esc(desc)+'"><link rel="canonical" href="'+url+'"><meta property="og:title" content="'+title+'"><meta property="og:description" content="'+esc(desc)+'"><meta property="og:url" content="'+url+'"><meta property="og:image" content="https://koffeereview.com.au/logo.webp"><link rel="icon" href="/logo.webp">' + styles() + '</head><body><div class="c">'
  +'<nav class="nav"><a href="/" class="nav-logo"><img src="/logo.webp" alt="KR"><span>KOFFEE REVIEW</span></a><div class="nav-links"><a href="/compare">New Compare</a><a href="/leaderboard">Leaderboard</a></div></nav>'
  +'<div class="bc"><a href="/">Home</a> &middot; <a href="/compare">Compare</a> &middot; <span>'+esc(cafeA.name)+' vs '+esc(cafeB.name)+'</span></div>'
  +'<div class="vs">'
  +card(cafeA,colA,vA,nA,winner&&winner.name===cafeA.name,ring(cafeA.score,colA,oA,cA))
  +'<div class="vd"><div class="vb">VS</div></div>'
  +card(cafeB,colB,vB,nB,winner&&winner.name===cafeB.name,ring(cafeB.score,colB,oB,cB))
  +'</div>'
  +'<div class="rb">'
  +(winner?'<div class="rw">\u2615 '+esc(winner.name)+' wins by '+diff+' points</div>':'<div class="rw">\u2615 Dead heat &mdash; both scored '+cafeA.score.toFixed(1)+'</div>')
  +'<div class="rd">'+(sameSub?'\uD83D\uDCCD Both in '+esc(cafeA.suburb)+(dist?' &middot; '+dist:''):'')
  +(!sameSub&&dist?'\uD83D\uDCCD '+dist:'')+'</div></div>'
  +'<div style="display:flex;gap:8px;justify-content:center;margin:16px 0">'
  +'<button class="sb" onclick="if(navigator.share){navigator.share({title:document.title,url:window.location.href})}else{navigator.clipboard.writeText(window.location.href);this.textContent=\'Copied!\';var b=this;setTimeout(function(){b.textContent=\'Share\'},2000)}">Share</button>'
  +'<a href="/compare" class="sb" style="text-decoration:none">New Comparison</a></div>'
  +'<div class="cl">'
  +'<a href="/review/'+slugA+'" class="ca">'+esc(cafeA.name)+' Review &rarr;</a>'
  +'<a href="/review/'+slugB+'" class="ca">'+esc(cafeB.name)+' Review &rarr;</a>'
  +(sameSub?'<a href="/suburb/'+makeSlug(cafeA.suburb,cafeA.city)+'" class="ca" style="grid-column:span 2">All '+esc(cafeA.suburb)+' Cafes &rarr;</a>':'')
  +'</div>'
  +'<footer class="ft"><p style="font-size:10px;color:rgba(255,255,255,0.3);margin-bottom:8px;letter-spacing:1px">Last updated May 2026</p><p>&copy; 2026 Our Fair Dinkum Koffee Review</p><div style="margin-top:10px"><a href="/">All Reviews</a> &middot; <a href="/leaderboard">Leaderboard</a> &middot; <a href="/blog">Blog</a></div></footer>'
  +'</div></body></html>';
}

export default async function handler(req,res){
  try{
    var controller=new AbortController();var tid=setTimeout(function(){controller.abort();},10000);
    var response=await fetch(SHEET_URL,{signal:controller.signal});clearTimeout(tid);
    if(!response.ok)throw new Error("Sheet fetch failed");
    var text=await response.text();var cafes=parseCSV(text);
    var a=(req.query.a||"").replace(/-+/g,"-");var b=(req.query.b||"").replace(/-+/g,"-");

    res.setHeader("Content-Type","text/html; charset=utf-8");
    res.setHeader("Cache-Control","public, s-maxage=3600, stale-while-revalidate=86400");

    if(!a||!b){cafes.sort(function(x,y){return y.score-x.score;});return res.status(200).send(renderSearch(cafes));}

    var cafeA=cafes.find(function(c){return makeSlug(c.name,c.suburb)===a;});
    var cafeB=cafes.find(function(c){return makeSlug(c.name,c.suburb)===b;});
    if(!cafeA||!cafeB)return res.status(404).send('<!DOCTYPE html><html><head><title>Not Found</title></head><body style="background:#000;color:#fff;font-family:sans-serif;text-align:center;padding:60px"><h1 style="color:#E6C073">Cafe not found</h1><a href="/compare" style="color:#E6C073">&larr; Try Again</a></body></html>');

    return res.status(200).send(renderComparison(cafeA,cafeB));
  }catch(e){
    res.setHeader("Content-Type","text/html; charset=utf-8");
    res.status(500).send('<!DOCTYPE html><html><head><title>Error</title></head><body style="background:#000;color:#fff;font-family:sans-serif;text-align:center;padding:60px"><h1>Something went wrong</h1><a href="/" style="color:#E6C073">&larr; Back</a></body></html>');
  }
}
