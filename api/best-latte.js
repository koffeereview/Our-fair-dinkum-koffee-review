const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYEU8Khk3R5I879v3FcXPqhq0aCXa2ZWM1BwwJOyUitx2Boak_AFTOkwvB8qQrKIeU55NM4htFjHbI/pub?gid=0&single=true&output=csv";
const SPAIN = ["barcelona","catalonia","spain"];
function esc(s){return(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
function splitCSV(line){var r=[],c="",q=false;for(var i=0;i<line.length;i++){var ch=line[i];if(ch==='"')q=!q;else if(ch===","&&!q){r.push(c.trim());c="";}else c+=ch;}r.push(c.trim());return r;}
function makeSlug(n,s){return(n+"-"+s).toLowerCase().replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-").trim();}
function gc(s){if(s>=9.1)return"#ffffff";if(s>=8.1)return"#4ade80";if(s>=7.5)return"#2dd4bf";if(s>=7.1)return"#2dd4bf";if(s>=6.5)return"#facc15";if(s>=6.1)return"#facc15";if(s>=5.5)return"#fb923c";if(s>=5.1)return"#fb923c";return"#f87171";}
function gv(s){if(s>=9.1)return"ELITE";if(s>=8.1)return"GREAT";if(s>=7.5)return"MUST VISIT";if(s>=7.1)return"SOLID";if(s>=6.5)return"DECENT";if(s>=6.1)return"TAKE OR LEAVE";if(s>=5.5)return"AVERAGE";if(s>=5.1)return"JUST OKAY";if(s>=4.1)return"NOT FOR US";return"AVOID";}
function toTitle(s){return s.replace(/\w\S*/g,function(t){return t.charAt(0).toUpperCase()+t.substr(1).toLowerCase();});}

export default async function handler(req,res){
  try{
    var cityParam=(req.query.city||"brisbane").toLowerCase().replace(/-/g," ");
    var response=await fetch(SHEET_URL);var text=await response.text();
    var lines=text.split("\n").filter(function(l){return l.trim();});
    var h=splitCSV(lines[0]).map(function(x){return x.trim().toLowerCase();});
    var ni=h.indexOf("name"),si=h.indexOf("suburb"),ci=h.indexOf("city"),sci=h.indexOf("score"),noi=h.indexOf("notes"),pi=h.indexOf("price");
    var cafes=[];
    for(var i=1;i<lines.length;i++){try{var p=splitCSV(lines[i]);var n=(p[ni]||"").trim();if(!n)continue;var sc=parseFloat(p[sci])||0;if(sc<=0)continue;
    var city=(p[ci]||"").trim();if(SPAIN.indexOf(city.toLowerCase())!==-1)continue;
    if(city.toLowerCase()!==cityParam)continue;
    cafes.push({name:n,suburb:(p[si]||"").trim(),city:city,score:sc,notes:(p[noi]||"").trim(),price:(p[pi]||"").trim()});}catch(e){}}

    var cityDisplay=toTitle(cityParam);
    var citySlug=cityParam.replace(/\s+/g,"-");
    var sorted=cafes.sort(function(a,b){return b.score-a.score;});
    var total=cafes.length;
    var top=sorted[0];
    var mustVisit=cafes.filter(function(c){return c.score>=7.5;}).length;
    var avg=total>0?(cafes.reduce(function(s,c){return s+c.score;},0)/total).toFixed(1):"0";

    if(total===0){
      res.setHeader("Content-Type","text/html");
      return res.status(404).send('<!DOCTYPE html><html><head><title>Not Found</title><meta name="robots" content="noindex"></head><body style="background:#0a0a0c;color:#fff;font-family:sans-serif;text-align:center;padding:60px"><h1 style="color:#E6C073">No latte reviews in '+esc(cityDisplay)+' yet</h1><p style="color:rgba(255,255,255,0.4)">We are working on it.</p><a href="/explore" style="color:#E6C073">Explore reviews &rarr;</a></body></html>');
    }

    var title="Best Latte in "+cityDisplay+" "+new Date().getFullYear()+" | "+total+" Cafes Ranked | Koffee Review";
    var desc="Every latte in "+cityDisplay+" ranked. "+total+" cafes tested with one latte every time. Top pick: "+esc(top.name)+" ("+top.score.toFixed(1)+"/10). No sponsorships.";
    var canonical="https://koffeereview.com.au/best-latte-"+citySlug;

    var cards=sorted.map(function(c,i){
      var col=gc(c.score);var verdict=gv(c.score);var slug=makeSlug(c.name,c.suburb);
      var notes=c.notes?esc(c.notes.substring(0,80))+(c.notes.length>80?"...":""):"";
      return'<a href="/review/'+slug+'" style="display:flex;align-items:center;gap:14px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;padding:14px 18px;margin-bottom:8px;text-decoration:none;color:inherit"><div style="font-size:12px;color:rgba(255,255,255,0.25);width:22px;text-align:center;flex-shrink:0">'+(i+1)+'</div><div style="width:44px;height:44px;border-radius:50%;border:2px solid '+col+';display:flex;align-items:center;justify-content:center;flex-shrink:0"><span style="font-family:Bebas Neue,sans-serif;font-size:18px;color:'+col+'">'+c.score.toFixed(1)+'</span></div><div style="flex:1;min-width:0"><div style="font-size:14px;font-weight:600;color:#fff">'+esc(c.name)+'</div><div style="font-size:11px;color:rgba(255,255,255,0.35)">'+esc(c.suburb)+(c.price?" &middot; "+esc(c.price):"")+'</div>'+(notes?'<div style="font-size:11px;color:rgba(255,255,255,0.25);font-style:italic;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:280px">'+notes+'</div>':'')+'</div><div style="padding:3px 10px;border-radius:20px;font-size:9px;font-weight:700;letter-spacing:1.5px;background:'+col+'18;color:'+col+';border:1px solid '+col+'40;flex-shrink:0;white-space:nowrap">'+verdict+'</div></a>';
    }).join("");

    // Other cities with data for cross-linking
    var allLines=text.split("\n").filter(function(l){return l.trim();});
    var allCityMap={};
    for(var j=1;j<allLines.length;j++){try{var pp=splitCSV(allLines[j]);var cc=(pp[ci]||"").trim();if(!cc||SPAIN.indexOf(cc.toLowerCase())!==-1)continue;allCityMap[cc]=(allCityMap[cc]||0)+1;}catch(e){}}
    var otherCities=Object.keys(allCityMap).filter(function(c){return c.toLowerCase()!==cityParam;}).sort(function(a,b){return allCityMap[b]-allCityMap[a];}).slice(0,8);
    var cityLinks=otherCities.map(function(c){
      var s=c.toLowerCase().replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-");
      return'<a href="/best-latte-'+s+'" style="display:inline-block;padding:8px 16px;border-radius:10px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);color:rgba(255,255,255,0.5);font-size:12px;text-decoration:none;margin:0 6px 6px 0">'+esc(c)+' ('+allCityMap[c]+')</a>';
    }).join("");

    var html='<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+title+'</title><meta name="description" content="'+desc+'"><link rel="canonical" href="'+canonical+'"><meta property="og:title" content="'+title+'"><meta property="og:description" content="'+desc+'"><meta property="og:url" content="'+canonical+'"><meta property="og:image" content="https://koffeereview.com.au/logo.webp"><link rel="icon" href="/logo.webp"><link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet"><script type="application/ld+json">{"@context":"https://schema.org","@type":"ItemList","name":"Best Latte in '+esc(cityDisplay)+'","numberOfItems":'+total+',"itemListElement":'+JSON.stringify(sorted.slice(0,20).map(function(c,i){return{"@type":"ListItem","position":i+1,"item":{"@type":"CafeOrCoffeeShop","name":c.name,"address":{"@type":"PostalAddress","addressLocality":c.suburb,"addressRegion":c.city,"addressCountry":"AU"},"aggregateRating":{"@type":"AggregateRating","ratingValue":c.score,"bestRating":10,"worstRating":0,"reviewCount":1}}};}))+'}<\/script><script type="application/ld+json">{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"What is the best latte in '+esc(cityDisplay)+'?","acceptedAnswer":{"@type":"Answer","text":"Based on '+total+' reviews, '+esc(top.name)+' in '+esc(top.suburb)+' has the best latte in '+esc(cityDisplay)+' with a score of '+top.score.toFixed(1)+'/10."}},{"@type":"Question","name":"How many cafes serve good lattes in '+esc(cityDisplay)+'?","acceptedAnswer":{"@type":"Answer","text":"'+mustVisit+' cafes in '+esc(cityDisplay)+' score 7.5+ (Must Visit tier) out of '+total+' tested. Average score is '+avg+'/10."}}]}<\/script><style>*{margin:0;padding:0;box-sizing:border-box}body{background:#0a0a0c;color:#fff;font-family:"DM Sans",sans-serif;min-height:100vh;-webkit-font-smoothing:antialiased}.c{max-width:720px;margin:0 auto;padding:0 20px 60px}.nav{display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid rgba(255,255,255,0.06)}.nav-logo{display:flex;align-items:center;gap:10px;text-decoration:none}.nav-logo img{width:34px;height:34px;border-radius:50%}.nav-logo span{font-family:"Bebas Neue",sans-serif;font-size:15px;letter-spacing:3px;color:#E6C073}.nav-links{display:flex;gap:14px}.nav-links a{font-size:12px;color:rgba(255,255,255,0.45);text-decoration:none}.nav-links a:hover{color:#E6C073}.stats{display:flex;gap:0;margin:0 auto 20px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05);border-radius:14px;overflow:hidden}.stat{flex:1;text-align:center;padding:14px 8px;border-right:1px solid rgba(255,255,255,0.03)}.stat:last-child{border:none}.stat-n{font-family:"Bebas Neue",sans-serif;font-size:26px;color:#E6C073;line-height:1}.stat-l{font-size:9px;letter-spacing:2px;color:rgba(255,255,255,0.3);margin-top:2px}.ft{margin-top:32px;padding:20px 0;border-top:1px solid rgba(255,255,255,0.04);text-align:center;font-size:11px;color:rgba(255,255,255,0.3)}.ft a{color:rgba(255,255,255,0.5);text-decoration:none;margin:0 8px}.ft a:hover{color:#E6C073}</style></head><body><div class="c"><nav class="nav"><a href="/" class="nav-logo"><img src="/logo.webp" alt="KR"><span>KOFFEE REVIEW</span></a><div class="nav-links"><a href="/city/'+citySlug+'">'+esc(cityDisplay)+'</a><a href="/explore">Explore</a><a href="/blog">Blog</a></div></nav><div style="padding:28px 0 16px"><div style="font-size:10px;letter-spacing:3px;color:rgba(230,192,115,0.5);margin-bottom:8px">'+esc(cityDisplay.toUpperCase())+' &middot; LATTE RANKINGS &middot; '+new Date().getFullYear()+'</div><h1 style="font-family:Bebas Neue,sans-serif;font-size:clamp(28px,7vw,42px);letter-spacing:2px;color:#fff;margin-bottom:8px">Best Latte in '+esc(cityDisplay)+'</h1><p style="font-size:14px;color:rgba(255,255,255,0.45);line-height:1.6">'+total+' cafes tested with one latte every time. Same size, same order. Ranked by milk technique, espresso balance, and overall taste.</p></div><div class="stats"><div class="stat"><div class="stat-n">'+total+'</div><div class="stat-l">TESTED</div></div><div class="stat"><div class="stat-n">'+mustVisit+'</div><div class="stat-l">MUST VISIT</div></div><div class="stat"><div class="stat-n">'+avg+'</div><div class="stat-l">AVG SCORE</div></div><div class="stat"><div class="stat-n">'+top.score.toFixed(1)+'</div><div class="stat-l">TOP SCORE</div></div></div>'+cards;

    // Other cities
    if(cityLinks){
      html+='<div style="margin-top:28px"><div style="font-family:Bebas Neue,sans-serif;font-size:12px;letter-spacing:3px;color:rgba(255,255,255,0.25);margin-bottom:10px">BEST LATTE IN OTHER CITIES</div>'+cityLinks+'</div>';
    }

    html+='<div style="margin-top:28px"><div style="font-family:Bebas Neue,sans-serif;font-size:12px;letter-spacing:3px;color:rgba(255,255,255,0.25);margin-bottom:10px">EXPLORE MORE</div><div style="display:flex;flex-direction:column;gap:8px"><a href="/city/'+citySlug+'" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;text-decoration:none;color:rgba(255,255,255,0.5);font-size:13px">All '+esc(cityDisplay)+' Cafes <span style="color:rgba(255,255,255,0.2)">&rarr;</span></a><a href="/must-visit-cafes" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:rgba(230,192,115,0.03);border:1px solid rgba(230,192,115,0.12);border-radius:14px;text-decoration:none;color:#E6C073;font-size:13px">All Must Visit Cafes (7.5+) <span style="color:rgba(230,192,115,0.4)">&rarr;</span></a><a href="/leaderboard" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;text-decoration:none;color:rgba(255,255,255,0.5);font-size:13px">National Leaderboard <span style="color:rgba(255,255,255,0.2)">&rarr;</span></a><a href="/explore" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;text-decoration:none;color:rgba(255,255,255,0.5);font-size:13px">Explore Koffee Review <span style="color:rgba(255,255,255,0.2)">&rarr;</span></a></div></div><footer class="ft"><p>&copy; '+new Date().getFullYear()+' Our Fair Dinkum Koffee Review</p><div style="margin-top:10px"><a href="/leaderboard">Leaderboard</a><a href="/explore">Explore</a><a href="/blog">Blog</a><a href="/how-we-score">How We Score</a></div></footer></div></body></html>';

    res.setHeader("Content-Type","text/html; charset=utf-8");
    res.setHeader("Cache-Control","public, s-maxage=3600, stale-while-revalidate=86400");
    res.status(200).send(html);
  }catch(e){res.status(500).send("Error");}
}
