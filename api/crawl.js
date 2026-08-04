const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYEU8Khk3R5I879v3FcXPqhq0aCXa2ZWM1BwwJOyUitx2Boak_AFTOkwvB8qQrKIeU55NM4htFjHbI/pub?gid=0&single=true&output=csv";
const SPAIN = ["barcelona","catalonia","spain"];
function esc(s){return(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
function splitCSV(line){var r=[],c="",q=false;for(var i=0;i<line.length;i++){var ch=line[i];if(ch==='"')q=!q;else if(ch===","&&!q){r.push(c.trim());c="";}else c+=ch;}r.push(c.trim());return r;}
function makeSlug(n,s){return(n+"-"+s).toLowerCase().replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-").trim();}
function subSlug(s){return(s||"").toLowerCase().replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-").trim();}
function gc(s){if(s>=9.1)return"#ffffff";if(s>=8.1)return"#4ade80";if(s>=7.5)return"#2dd4bf";if(s>=7.1)return"#2dd4bf";if(s>=6.5)return"#facc15";if(s>=6.1)return"#facc15";if(s>=5.5)return"#fb923c";if(s>=5.1)return"#fb923c";return"#f87171";}
function gv(s){if(s>=9.1)return"ELITE";if(s>=8.1)return"GREAT";if(s>=7.5)return"MUST VISIT";if(s>=7.1)return"SOLID";if(s>=6.5)return"DECENT";if(s>=6.1)return"TAKE OR LEAVE";if(s>=5.5)return"AVERAGE";if(s>=5.1)return"JUST OKAY";if(s>=4.1)return"NOT FOR US";return"AVOID";}
function hav(a,b){var R=6371;var dLat=(b.lat-a.lat)*Math.PI/180;var dLon=(b.lng-a.lng)*Math.PI/180;var x=Math.sin(dLat/2)*Math.sin(dLat/2)+Math.cos(a.lat*Math.PI/180)*Math.cos(b.lat*Math.PI/180)*Math.sin(dLon/2)*Math.sin(dLon/2);return R*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x));}
function titleCase(s){return(s||"").replace(/\w\S*/g,function(t){return t.charAt(0).toUpperCase()+t.substr(1).toLowerCase();});}

var CSS='*{margin:0;padding:0;box-sizing:border-box}body{background:#0a0a0c;color:#e2e8f0;font-family:DM Sans,sans-serif;-webkit-font-smoothing:antialiased}.c{max-width:620px;margin:0 auto;padding:0 20px 60px}.nav{display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid rgba(255,255,255,0.06)}.nav-logo{display:flex;align-items:center;gap:10px;text-decoration:none}.nav-logo img{width:34px;height:34px;border-radius:50%}.nav-logo span{font-family:Bebas Neue,sans-serif;font-size:15px;letter-spacing:3px;color:#E6C073}.nav-links{display:flex;gap:14px}.nav-links a{font-size:12px;color:rgba(255,255,255,0.45);text-decoration:none}.ft{margin-top:32px;padding:20px 0;border-top:1px solid rgba(255,255,255,0.04);text-align:center;font-size:11px;color:rgba(255,255,255,0.3)}.ft a{color:rgba(255,255,255,0.5);text-decoration:none;margin:0 8px}';

export default async function handler(req,res){
  try{
    var crawl=req.query.crawl||"";
    var response=await fetch(SHEET_URL);var text=await response.text();
    var lines=text.split("\n").filter(function(l){return l.trim();});
    var h=splitCSV(lines[0]).map(function(x){return x.trim().toLowerCase();});
    var ni=h.indexOf("name"),si=h.indexOf("suburb"),ci=h.indexOf("city"),sci=h.indexOf("score"),noi=h.indexOf("notes"),lati=h.indexOf("lat"),lngi=h.indexOf("lng"),pri=h.indexOf("price");
    var cafes=[];
    for(var i=1;i<lines.length;i++){try{var p=splitCSV(lines[i]);var n=(p[ni]||"").trim();if(!n)continue;var sc=parseFloat(p[sci])||0;if(sc<=0)continue;
    var city=(p[ci]||"").trim();if(SPAIN.indexOf(city.toLowerCase())!==-1)continue;
    var lat=parseFloat(p[lati])||0;var lng=parseFloat(p[lngi])||0;
    cafes.push({n:n,s:(p[si]||"").trim(),c:city,sc:sc,nt:((p[noi]||"").trim()).substring(0,80),sl:makeSlug(n,(p[si]||"").trim()),lat:lat,lng:lng,pr:(p[pri]||"$$").trim()});}catch(e){}}

    // Build suburb groups with 3+ cafes that have lat/lng
    var subMap={};
    cafes.forEach(function(c){
      if(!c.lat||!c.lng||Math.abs(c.lat)<1)return;
      var key=c.s.toLowerCase();
      if(!subMap[key])subMap[key]={name:c.s,city:c.c,cafes:[]};
      subMap[key].cafes.push(c);
    });

    var year=new Date().getFullYear();
    var NAV='<nav class="nav"><a href="/" class="nav-logo"><img src="/logo.webp" alt="KR"><span>KOFFEE REVIEW</span></a><div class="nav-links"><a href="/suburbs">Suburbs</a><a href="/explore">Explore</a></div></nav>';
    var FT='<footer class="ft"><a href="/explore">Explore</a><a href="/suburbs">Suburbs</a><a href="/leaderboard">Leaderboard</a></footer>';
    res.setHeader("Content-Type","text/html; charset=utf-8");
    res.setHeader("Cache-Control","public, s-maxage=3600, stale-while-revalidate=86400");

    // INDEX PAGE
    if(!crawl){
      var available=Object.keys(subMap).filter(function(k){return subMap[k].cafes.length>=3;}).map(function(k){
        var d=subMap[k];
        var sorted=d.cafes.sort(function(a,b){return b.sc-a.sc;});
        var avg=sorted.reduce(function(sum,c){return sum+c.sc;},0)/sorted.length;
        return{slug:subSlug(d.name),name:d.name,city:d.city,count:sorted.length,avg:avg,top:sorted[0].sc,topName:sorted[0].n};
      }).sort(function(a,b){return b.avg-a.avg;});

      var cards=available.map(function(s){
        var col=gc(s.avg);
        return'<a href="/crawl/'+s.slug+'" style="display:flex;align-items:center;gap:14px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;padding:16px 18px;text-decoration:none;color:inherit;transition:border 0.2s" onmouseover="this.style.borderColor=\'rgba(74,222,128,0.3)\'" onmouseout="this.style.borderColor=\'rgba(255,255,255,0.06)\'">'
          +'<div style="width:48px;height:48px;border-radius:14px;background:rgba(74,222,128,0.08);border:1px solid rgba(74,222,128,0.2);display:flex;align-items:center;justify-content:center;flex-shrink:0"><span style="font-family:Bebas Neue,sans-serif;font-size:18px;color:#4ade80">'+s.count+'</span></div>'
          +'<div style="flex:1;min-width:0"><div style="font-size:15px;font-weight:600;color:#fff">'+esc(s.name)+' Coffee Crawl</div>'
          +'<div style="font-size:11px;color:rgba(255,255,255,0.4);margin-top:2px">'+s.count+' stops &middot; Avg: <span style="color:'+col+'">'+s.avg.toFixed(1)+'</span> &middot; Top: '+s.top.toFixed(1)+'</div></div>'
          +'<div style="font-size:13px;color:rgba(255,255,255,0.2);flex-shrink:0">&rarr;</div></a>';
      }).join("");

      return res.status(200).send('<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Coffee Crawls '+year+' | Walking Routes | Koffee Review</title><meta name="description" content="'+available.length+' coffee crawl routes across Brisbane and Gold Coast. Walk between top cafes, see the scores, plan your morning."><link rel="canonical" href="https://koffeereview.com.au/crawl"><link rel="icon" href="/logo.webp"><link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"><style>'+CSS+'</style></head><body><div class="c">'+NAV
        +'<div style="padding:28px 0 20px"><div style="font-size:10px;letter-spacing:3px;color:rgba(74,222,128,0.6);margin-bottom:8px">COFFEE CRAWLS</div><h1 style="font-family:Bebas Neue,sans-serif;font-size:clamp(28px,7vw,44px);letter-spacing:2px;color:#fff">Walking Coffee Routes</h1><p style="font-size:14px;color:rgba(255,255,255,0.45);margin-top:10px;line-height:1.6">Pick a suburb. Hit every reviewed cafe on foot. Scores, distances, and estimated time included.</p></div>'
        +'<div style="display:flex;flex-direction:column;gap:8px">'+cards+'</div>'
        +'<div style="margin-top:24px;display:flex;flex-direction:column;gap:8px"><a href="/suburbs" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;text-decoration:none;color:rgba(255,255,255,0.5);font-size:13px">Browse by Suburb &rarr;</a><a href="/explore" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:rgba(230,192,115,0.03);border:1px solid rgba(230,192,115,0.12);border-radius:14px;text-decoration:none;color:#E6C073;font-size:13px">Explore &rarr;</a></div>'
        +FT+'</div></body></html>');
    }

    // INDIVIDUAL CRAWL PAGE
    var match=Object.keys(subMap).find(function(k){return subSlug(subMap[k].name)===crawl&&subMap[k].cafes.length>=3;});
    if(!match)return res.status(404).send('<!DOCTYPE html><html><head><title>Not Found</title><meta name="robots" content="noindex"></head><body style="background:#0a0a0c;color:#fff;font-family:sans-serif;text-align:center;padding:60px"><h1 style="color:#E6C073">Crawl Not Found</h1><a href="/crawl" style="color:#E6C073">All Crawls &rarr;</a></body></html>');

    var sub=subMap[match];
    var sorted=sub.cafes.sort(function(a,b){return b.sc-a.sc;}).slice(0,5);

    // Calculate walking distances between stops (sorted by score, not optimised for walking - but close enough for same suburb)
    var totalDist=0;
    var totalCost=0;
    sorted.forEach(function(c,i){
      var tiers={"$":5,"$$":6,"$$$":7};
      totalCost+=(tiers[c.pr]||6);
      if(i>0)totalDist+=hav(sorted[i-1],sorted[i]);
    });
    var walkMins=Math.round(totalDist/0.08); // ~5km/h walking = 0.083km/min

    var stops=sorted.map(function(c,i){
      var col=gc(c.sc);var v=gv(c.sc);
      var distText="";
      if(i>0){var d=hav(sorted[i-1],c);distText=d<1?(d*1000).toFixed(0)+"m walk":d.toFixed(1)+"km walk";}
      return(i>0?'<div style="text-align:center;padding:8px 0;color:rgba(255,255,255,0.2);font-size:11px;letter-spacing:1px">&darr; '+distText+' &darr;</div>':'')
        +'<a href="/review/'+c.sl+'" style="display:flex;align-items:center;gap:14px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:18px;text-decoration:none;color:inherit;transition:border 0.2s" onmouseover="this.style.borderColor=\'rgba(74,222,128,0.3)\'" onmouseout="this.style.borderColor=\'rgba(255,255,255,0.06)\'">'
        +'<div style="width:36px;height:36px;border-radius:50%;background:rgba(74,222,128,0.1);border:1px solid rgba(74,222,128,0.25);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-family:Bebas Neue,sans-serif;font-size:16px;color:#4ade80">'+(i+1)+'</div>'
        +'<div style="width:48px;height:48px;border-radius:50%;border:2px solid '+col+';display:flex;align-items:center;justify-content:center;flex-shrink:0"><span style="font-family:Bebas Neue,sans-serif;font-size:18px;color:'+col+'">'+c.sc.toFixed(1)+'</span></div>'
        +'<div style="flex:1;min-width:0"><div style="font-size:15px;font-weight:600;color:#fff">'+esc(c.n)+'</div>'
        +'<div style="font-size:11px;color:rgba(255,255,255,0.4);margin-top:2px">'+esc(c.s)+(c.nt?' &middot; '+esc(c.nt.substring(0,40))+'...':'')+'</div></div>'
        +'<div style="padding:3px 10px;border-radius:20px;font-size:9px;font-weight:700;letter-spacing:1.5px;background:'+col+'18;color:'+col+';border:1px solid '+col+'40;flex-shrink:0">'+v+'</div></a>';
    }).join("");

    var subName=titleCase(sub.name);
    return res.status(200).send('<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+esc(subName)+' Coffee Crawl '+year+' | Koffee Review</title><meta name="description" content="Walk between '+sorted.length+' reviewed cafes in '+esc(subName)+'. '+walkMins+' min walk, $'+totalCost+' total spend. Scores and distances included."><link rel="canonical" href="https://koffeereview.com.au/crawl/'+crawl+'"><link rel="icon" href="/logo.webp"><link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"><style>'+CSS+'</style></head><body><div class="c">'+NAV
      +'<div style="font-size:12px;color:rgba(255,255,255,0.35);padding:12px 0"><a href="/" style="color:#E6C073;text-decoration:none">Home</a> &middot; <a href="/crawl" style="color:#E6C073;text-decoration:none">Crawls</a> &middot; '+esc(subName)+'</div>'
      +'<div style="padding:16px 0 20px"><div style="display:inline-block;padding:4px 14px;border-radius:20px;font-size:10px;letter-spacing:2px;font-weight:700;background:rgba(74,222,128,0.1);color:#4ade80;border:1px solid rgba(74,222,128,0.25);margin-bottom:12px">COFFEE CRAWL</div>'
      +'<h1 style="font-family:Bebas Neue,sans-serif;font-size:clamp(26px,6vw,40px);letter-spacing:2px;color:#fff;margin-bottom:8px">'+esc(subName)+' Coffee Crawl</h1>'
      +'<p style="font-size:14px;color:rgba(255,255,255,0.45);line-height:1.6">'+sorted.length+' cafes. Walk between them. Score every cup.</p></div>'
      +'<div style="display:flex;gap:0;margin-bottom:24px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:14px;overflow:hidden">'
      +'<div style="flex:1;text-align:center;padding:14px 8px;border-right:1px solid rgba(255,255,255,0.03)"><div style="font-family:Bebas Neue,sans-serif;font-size:26px;color:#4ade80">'+sorted.length+'</div><div style="font-size:9px;letter-spacing:2px;color:rgba(255,255,255,0.3)">STOPS</div></div>'
      +'<div style="flex:1;text-align:center;padding:14px 8px;border-right:1px solid rgba(255,255,255,0.03)"><div style="font-family:Bebas Neue,sans-serif;font-size:26px;color:#4ade80">'+walkMins+'</div><div style="font-size:9px;letter-spacing:2px;color:rgba(255,255,255,0.3)">MIN WALK</div></div>'
      +'<div style="flex:1;text-align:center;padding:14px 8px"><div style="font-family:Bebas Neue,sans-serif;font-size:26px;color:#E6C073">$'+totalCost+'</div><div style="font-size:9px;letter-spacing:2px;color:rgba(255,255,255,0.3)">TOTAL SPEND</div></div></div>'
      +stops
      +'<div style="margin-top:24px;padding:18px;background:rgba(74,222,128,0.04);border:1px solid rgba(74,222,128,0.15);border-radius:14px;text-align:center"><div style="font-size:13px;color:rgba(255,255,255,0.5);line-height:1.6">Share this crawl with a friend. Hit every stop. Compare your notes to ours.</div><button onclick="shareCrawl()" style="margin-top:12px;padding:12px 28px;border-radius:12px;background:linear-gradient(135deg,#22c55e,#4ade80);border:none;color:#000;font-size:13px;font-weight:700;cursor:pointer;font-family:DM Sans,sans-serif">Share This Crawl</button></div>'
      +'<div style="margin-top:20px;display:flex;flex-direction:column;gap:8px"><a href="/crawl" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;text-decoration:none;color:rgba(255,255,255,0.5);font-size:13px">All Coffee Crawls &rarr;</a><a href="/suburbs" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;text-decoration:none;color:rgba(255,255,255,0.5);font-size:13px">Browse by Suburb &rarr;</a><a href="/explore" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:rgba(230,192,115,0.03);border:1px solid rgba(230,192,115,0.12);border-radius:14px;text-decoration:none;color:#E6C073;font-size:13px">Explore &rarr;</a></div>'
      +'<script>function shareCrawl(){var txt="'+esc(subName)+' Coffee Crawl\\n'+sorted.length+' cafes, '+walkMins+' min walk, $'+totalCost+' total\\n\\nkoffeereview.com.au/crawl/'+crawl+'";if(navigator.share){navigator.share({text:txt}).catch(function(){});}else if(navigator.clipboard){navigator.clipboard.writeText(txt);alert("Copied!");}}<\/script>'
      +FT+'</div></body></html>');
  }catch(e){res.status(500).send("Error: "+(e.message||"unknown"));}
}
