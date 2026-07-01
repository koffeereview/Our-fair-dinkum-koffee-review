const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYEU8Khk3R5I879v3FcXPqhq0aCXa2ZWM1BwwJOyUitx2Boak_AFTOkwvB8qQrKIeU55NM4htFjHbI/pub?gid=0&single=true&output=csv";
const SPAIN = ["barcelona","catalonia","spain"];
function esc(s){return(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
function splitCSV(line){var r=[],c="",q=false;for(var i=0;i<line.length;i++){var ch=line[i];if(ch==='"')q=!q;else if(ch===","&&!q){r.push(c.trim());c="";}else c+=ch;}r.push(c.trim());return r;}
function makeSlug(n,s){return(n+"-"+s).toLowerCase().replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-").trim();}
function roasterSlug(n){return(n||"").toLowerCase().replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-").trim();}
function gc(s){if(s>=9.1)return"#ffffff";if(s>=8.1)return"#4ade80";if(s>=7.5)return"#2dd4bf";if(s>=7.1)return"#2dd4bf";if(s>=6.5)return"#facc15";if(s>=6.1)return"#facc15";if(s>=5.5)return"#fb923c";if(s>=5.1)return"#fb923c";return"#f87171";}
function gv(s){if(s>=9.1)return"ELITE";if(s>=8.1)return"GREAT";if(s>=7.5)return"MUST VISIT";if(s>=7.1)return"SOLID";if(s>=6.5)return"DECENT";if(s>=6.1)return"TAKE OR LEAVE";if(s>=5.5)return"AVERAGE";if(s>=5.1)return"JUST OKAY";if(s>=4.1)return"NOT FOR US";return"AVOID";}
function toTitle(s){return s.replace(/\w\S*/g,function(t){return t.charAt(0).toUpperCase()+t.substr(1).toLowerCase();});}
function styles(){return'*{margin:0;padding:0;box-sizing:border-box}body{background:#0a0a0c;color:#fff;font-family:DM Sans,sans-serif;-webkit-font-smoothing:antialiased}.c{max-width:720px;margin:0 auto;padding:0 20px 60px}.nav{display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid rgba(255,255,255,0.06)}.nav-logo{display:flex;align-items:center;gap:10px;text-decoration:none}.nav-logo img{width:34px;height:34px;border-radius:50%}.nav-logo span{font-family:Bebas Neue,sans-serif;font-size:15px;letter-spacing:3px;color:#E6C073}.nav-links{display:flex;gap:14px}.nav-links a{font-size:12px;color:rgba(255,255,255,0.45);text-decoration:none}.stats{display:flex;gap:0;margin:0 auto 20px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05);border-radius:14px;overflow:hidden}.stat{flex:1;text-align:center;padding:14px 8px;border-right:1px solid rgba(255,255,255,0.03)}.stat:last-child{border:none}.stat-n{font-family:Bebas Neue,sans-serif;font-size:26px;color:#E6C073;line-height:1}.stat-l{font-size:9px;letter-spacing:2px;color:rgba(255,255,255,0.3);margin-top:2px}.ft{margin-top:32px;padding:20px 0;border-top:1px solid rgba(255,255,255,0.04);text-align:center;font-size:11px;color:rgba(255,255,255,0.3)}.ft a{color:rgba(255,255,255,0.5);text-decoration:none;margin:0 8px}.rc{display:block;padding:16px 18px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;margin-bottom:8px;text-decoration:none;color:inherit;transition:border 0.15s}.rc:hover{border-color:rgba(230,192,115,0.25)}';}
function navHtml(){return'<nav class="nav"><a href="/" class="nav-logo"><img src="/logo.webp" alt="KR"><span>KOFFEE REVIEW</span></a><div class="nav-links"><a href="/explore">Explore</a><a href="/leaderboard">Leaderboard</a><a href="/blog">Blog</a></div></nav>';}
function footerHtml(y){return'<footer class="ft"><p>&copy; '+y+' Our Fair Dinkum Koffee Review</p><div style="margin-top:10px"><a href="/leaderboard">Leaderboard</a><a href="/explore">Explore</a><a href="/blog">Blog</a><a href="/how-we-score">How We Score</a></div></footer>';}

function parseAll(text){
  var lines=text.split("\n").filter(function(l){return l.trim();});if(lines.length<2)return[];
  var h=splitCSV(lines[0]).map(function(x){return x.trim().toLowerCase();});
  var ni=h.indexOf("name"),si=h.indexOf("suburb"),ci=h.indexOf("city"),sci=h.indexOf("score"),noi=h.indexOf("notes"),ri=h.indexOf("roaster"),pi=h.indexOf("price");
  var out=[];
  for(var i=1;i<lines.length;i++){try{var p=splitCSV(lines[i]);var n=(p[ni]||"").trim();if(!n)continue;var sc=parseFloat(p[sci])||0;if(sc<=0)continue;
  var city=(p[ci]||"").trim();if(SPAIN.indexOf(city.toLowerCase())!==-1)continue;
  var roaster=(ri!==-1?(p[ri]||""):"").trim();
  out.push({name:n,suburb:(p[si]||"").trim(),city:city,score:sc,notes:(p[noi]||"").trim(),price:(p[pi]||"").trim(),roaster:roaster});}catch(e){}}
  return out;
}

function roasterCard(r,cityLabel){
  var mv=r.cafes.filter(function(c){return c.score>=7.5;}).length;
  var mvBadge=mv>0?'<span style="font-size:9px;letter-spacing:1.5px;background:rgba(45,212,191,0.08);color:#2dd4bf;border:1px solid rgba(45,212,191,0.2);border-radius:4px;padding:2px 8px;font-weight:700;margin-left:6px">'+mv+' MUST VISIT</span>':'';
  var label=cityLabel?r.count+' '+esc(cityLabel)+' cafes':r.count+' cafes tagged';
  return'<a href="/roaster/'+r.slug+'" class="rc"><div style="display:flex;align-items:center;justify-content:space-between"><div><div style="font-size:15px;font-weight:600;color:#fff;display:flex;align-items:center">'+esc(r.name)+mvBadge+'</div><div style="font-size:12px;color:rgba(255,255,255,0.35);margin-top:4px">'+label+' &middot; avg '+r.avg.toFixed(1)+'/10 &middot; top '+r.top.toFixed(1)+'/10</div></div><div style="font-family:Bebas Neue,sans-serif;font-size:28px;color:#E6C073">'+r.count+'</div></div></a>';
}

function cafeCard(c,i){
  var col=gc(c.score);var v=gv(c.score);var slug=makeSlug(c.name,c.suburb);
  var notes=c.notes?esc(c.notes.substring(0,70))+(c.notes.length>70?"...":""):"";
  return'<a href="/review/'+slug+'" style="display:flex;align-items:center;gap:14px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;padding:14px 18px;margin-bottom:8px;text-decoration:none;color:inherit"><div style="font-size:12px;color:rgba(255,255,255,0.25);width:22px;text-align:center;flex-shrink:0">'+(i+1)+'</div><div style="width:44px;height:44px;border-radius:50%;border:2px solid '+col+';display:flex;align-items:center;justify-content:center;flex-shrink:0"><span style="font-family:Bebas Neue,sans-serif;font-size:18px;color:'+col+'">'+c.score.toFixed(1)+'</span></div><div style="flex:1;min-width:0"><div style="font-size:14px;font-weight:600;color:#fff">'+esc(c.name)+'</div><div style="font-size:11px;color:rgba(255,255,255,0.35)">'+esc(c.suburb)+', '+esc(c.city)+'</div>'+(notes?'<div style="font-size:11px;color:rgba(255,255,255,0.25);font-style:italic;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:260px">'+notes+'</div>':'')+'</div><div style="padding:3px 10px;border-radius:20px;font-size:9px;font-weight:700;letter-spacing:1.5px;background:'+col+'18;color:'+col+';border:1px solid '+col+'40;flex-shrink:0;white-space:nowrap">'+v+'</div></a>';
}

export default async function handler(req,res){
  try{
    var slug=req.query.slug||"";
    var cityParam=req.query.city||"";
    var response=await fetch(SHEET_URL);
    var text=await response.text();
    var cafes=parseAll(text);
    var year=new Date().getFullYear();

    // Group by roaster
    var roasterMap={};
    cafes.forEach(function(c){
      if(!c.roaster)return;
      var s=roasterSlug(c.roaster);
      if(!s)return;
      if(!roasterMap[s])roasterMap[s]={name:c.roaster,slug:s,cafes:[],count:0,avg:0,top:0};
      roasterMap[s].cafes.push(c);
      roasterMap[s].count++;
      if(c.score>roasterMap[s].top)roasterMap[s].top=c.score;
    });
    Object.values(roasterMap).forEach(function(r){
      r.avg=r.cafes.reduce(function(s,c){return s+c.score;},0)/r.count;
    });
    var allRoasters=Object.values(roasterMap).sort(function(a,b){return b.count-a.count||b.avg-a.avg;});

    res.setHeader("Content-Type","text/html; charset=utf-8");
    res.setHeader("Cache-Control","public, s-maxage=3600, stale-while-revalidate=86400");

    // ═══ CITY ROASTERS PAGE ═══
    if(cityParam){
      var cityLower=cityParam.replace(/-/g," ");
      var cityName=toTitle(cityLower);
      var citySlug=cityParam.toLowerCase().replace(/\s+/g,"-");

      var cityRoasters=[];
      Object.values(roasterMap).forEach(function(r){
        var cc=r.cafes.filter(function(c){return c.city.toLowerCase()===cityLower;});
        if(cc.length>0){
          cityRoasters.push({name:r.name,slug:r.slug,cafes:cc,count:cc.length,
            avg:cc.reduce(function(s,c){return s+c.score;},0)/cc.length,
            top:cc.reduce(function(mx,c){return c.score>mx?c.score:mx;},0)});
        }
      });
      cityRoasters.sort(function(a,b){return b.count-a.count||b.avg-a.avg;});
      var totalCity=cityRoasters.reduce(function(s,r){return s+r.count;},0);

      var cards=cityRoasters.map(function(r){return roasterCard(r,cityName);}).join("");
      if(!cards)cards='<p style="color:rgba(255,255,255,0.4);text-align:center;padding:40px 0">No roaster data for '+esc(cityName)+' yet. Fill in the roaster column in your Google Sheet.</p>';

      var otherCities={};cafes.forEach(function(c){if(c.roaster&&c.city&&c.city.toLowerCase()!==cityLower)otherCities[c.city]=true;});
      var otherLinks=Object.keys(otherCities).sort().map(function(c){
        var s=c.toLowerCase().replace(/\s+/g,"-");
        return'<a href="/'+s+'-coffee-roasters" style="display:inline-block;padding:8px 14px;border-radius:10px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);color:rgba(255,255,255,0.5);font-size:12px;text-decoration:none;margin:0 4px 4px 0">'+esc(c)+'</a>';
      }).join("");

      var h='<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
        +'<title>Coffee Roasters in '+esc(cityName)+' '+year+' | Koffee Review</title>'
        +'<meta name="description" content="'+esc(cityRoasters.length+' roasters supply beans to '+totalCity+' cafes in '+cityName)+'">'
        +'<link rel="canonical" href="https://koffeereview.com.au/'+citySlug+'-coffee-roasters">'
        +'<link rel="icon" href="/logo.webp">'
        +'<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">'
        +'<style>'+styles()+'</style></head><body><div class="c">'+navHtml()
        +'<div style="font-size:12px;color:rgba(255,255,255,0.35);padding:12px 0"><a href="/" style="color:#E6C073;text-decoration:none">Home</a> &middot; <a href="/roaster" style="color:#E6C073;text-decoration:none">Roasters</a> &middot; '+esc(cityName)+'</div>'
        +'<div style="padding:16px 0 16px">'
        +'<div style="font-size:10px;letter-spacing:3px;color:rgba(230,192,115,0.5);margin-bottom:8px">'+esc(cityName.toUpperCase())+' COFFEE ROASTERS '+year+'</div>'
        +'<h1 style="font-family:Bebas Neue,sans-serif;font-size:clamp(26px,6vw,40px);letter-spacing:2px;color:#fff;margin-bottom:10px">Coffee Roasters in '+esc(cityName)+'</h1>'
        +'<p style="font-size:14px;color:rgba(255,255,255,0.45);line-height:1.6">'+cityRoasters.length+' roasters supply beans to '+totalCity+' cafes across '+esc(cityName)+'. We track which roaster each cafe uses and score the coffee the same way every time.</p></div>'
        +'<div class="stats"><div class="stat"><div class="stat-n">'+cityRoasters.length+'</div><div class="stat-l">ROASTERS</div></div><div class="stat"><div class="stat-n">'+totalCity+'</div><div class="stat-l">CAFES TAGGED</div></div></div>'
        +cards
        +(otherLinks?'<div style="margin-top:24px"><div style="font-family:Bebas Neue,sans-serif;font-size:12px;letter-spacing:3px;color:rgba(255,255,255,0.25);margin-bottom:10px">ROASTERS IN OTHER CITIES</div><div style="display:flex;flex-wrap:wrap">'+otherLinks+'</div></div>':'')
        +'<div style="margin-top:24px;display:flex;flex-direction:column;gap:8px">'
        +'<a href="/roaster" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;text-decoration:none;color:rgba(255,255,255,0.5);font-size:13px">All Australian Roasters &rarr;</a>'
        +'<a href="/best-coffee-'+citySlug+'" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:rgba(230,192,115,0.03);border:1px solid rgba(230,192,115,0.12);border-radius:14px;text-decoration:none;color:#E6C073;font-size:13px">Best Coffee '+esc(cityName)+' &rarr;</a>'
        +'<a href="/explore" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;text-decoration:none;color:rgba(255,255,255,0.5);font-size:13px">Explore &rarr;</a></div>'
        +footerHtml(year)+'</div></body></html>';
      return res.status(200).send(h);
    }

    // ═══ INDEX PAGE ═══
    if(!slug){
      var totalTagged=allRoasters.reduce(function(s,r){return s+r.count;},0);
      var indexCards=allRoasters.map(function(r){return roasterCard(r,null);}).join("");
      var schema=JSON.stringify({"@context":"https://schema.org","@type":"CollectionPage","name":"Australian Coffee Roasters Directory","url":"https://koffeereview.com.au/roaster","mainEntity":{"@type":"ItemList","numberOfItems":allRoasters.length,"itemListElement":allRoasters.map(function(r,i){return{"@type":"ListItem","position":i+1,"item":{"@type":"Organization","name":r.name,"url":"https://koffeereview.com.au/roaster/"+r.slug}};})}});
      return res.status(200).send('<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Australian Coffee Roasters Directory '+year+' | Koffee Review</title><meta name="description" content="Every roaster behind the cafes we review. '+allRoasters.length+' roasters, '+totalTagged+' cafes tagged."><link rel="canonical" href="https://koffeereview.com.au/roaster"><link rel="icon" href="/logo.webp"><link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet"><script type="application/ld+json">'+schema+'<\/script><style>'+styles()+'</style></head><body><div class="c">'+navHtml()+'<div style="padding:28px 0 16px"><div style="font-size:10px;letter-spacing:3px;color:rgba(230,192,115,0.5);margin-bottom:8px">ROASTER DIRECTORY '+year+'</div><h1 style="font-family:Bebas Neue,sans-serif;font-size:clamp(28px,7vw,44px);letter-spacing:2px;color:#fff;margin-bottom:8px">Australian Coffee Roasters</h1><p style="font-size:14px;color:rgba(255,255,255,0.45);line-height:1.6">Every roaster behind the cafes we review. Click any roaster to see every cafe pouring their beans, ranked by score.</p></div><div class="stats"><div class="stat"><div class="stat-n">'+allRoasters.length+'</div><div class="stat-l">ROASTERS</div></div><div class="stat"><div class="stat-n">'+totalTagged+'</div><div class="stat-l">CAFES TAGGED</div></div></div>'+indexCards+'<div style="margin-top:28px;display:flex;flex-direction:column;gap:8px"><a href="/must-visit-cafes" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:rgba(230,192,115,0.03);border:1px solid rgba(230,192,115,0.12);border-radius:14px;text-decoration:none;color:#E6C073;font-size:13px">Must Visit Cafes (7.5+) &rarr;</a><a href="/explore" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;text-decoration:none;color:rgba(255,255,255,0.5);font-size:13px">Explore Koffee Review &rarr;</a></div>'+footerHtml(year)+'</div></body></html>');
    }

    // ═══ INDIVIDUAL ROASTER PAGE ═══
    var roaster=roasterMap[slug];
    if(!roaster){
      return res.status(404).send('<!DOCTYPE html><html><head><title>Roaster Not Found</title><meta name="robots" content="noindex"></head><body style="background:#0a0a0c;color:#fff;font-family:sans-serif;text-align:center;padding:60px"><h1 style="color:#E6C073">Roaster Not Found</h1><a href="/roaster" style="color:#E6C073">&larr; All Roasters</a></body></html>');
    }
    var sorted=roaster.cafes.sort(function(a,b){return b.score-a.score;});
    var top=sorted[0];
    var mv=sorted.filter(function(c){return c.score>=7.5;}).length;
    var cities={};var suburbs={};sorted.forEach(function(c){cities[c.city]=true;suburbs[c.suburb]=true;});
    var cityCount=Object.keys(cities).length;var suburbCount=Object.keys(suburbs).length;
    var rCards=sorted.map(function(c,i){return cafeCard(c,i);}).join("");
    var otherRoasters=allRoasters.filter(function(o){return o.slug!==roaster.slug;}).slice(0,8).map(function(o){
      return'<a href="/roaster/'+o.slug+'" style="display:inline-block;padding:8px 14px;border-radius:10px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);color:rgba(255,255,255,0.5);font-size:12px;text-decoration:none;margin:0 4px 4px 0">'+esc(o.name)+' ('+o.count+')</a>';
    }).join("");
    var rTitle="Cafes Pouring "+roaster.name+" in Australia "+year+" | "+roaster.count+" Cafes | Koffee Review";
    var rDesc=roaster.count+" cafes across "+cityCount+" cities serve "+roaster.name+" beans. Top: "+esc(top.name)+" ("+top.score.toFixed(1)+"/10). Average: "+roaster.avg.toFixed(1)+"/10.";
    var rCanonical="https://koffeereview.com.au/roaster/"+roaster.slug;
    var rSchema=JSON.stringify({"@context":"https://schema.org","@type":"CollectionPage","name":"Cafes Pouring "+roaster.name,"url":rCanonical,"mainEntity":{"@type":"Organization","name":roaster.name},"breadcrumb":{"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Koffee Review","item":"https://koffeereview.com.au"},{"@type":"ListItem","position":2,"name":"Roasters","item":"https://koffeereview.com.au/roaster"},{"@type":"ListItem","position":3,"name":roaster.name,"item":rCanonical}]}});
    return res.status(200).send('<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+rTitle+'</title><meta name="description" content="'+esc(rDesc)+'"><link rel="canonical" href="'+rCanonical+'"><link rel="icon" href="/logo.webp"><link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet"><script type="application/ld+json">'+rSchema+'<\/script><style>'+styles()+'</style></head><body><div class="c">'+navHtml()+'<div style="font-size:12px;color:rgba(255,255,255,0.35);padding:12px 0"><a href="/" style="color:#E6C073;text-decoration:none">Home</a> &middot; <a href="/roaster" style="color:#E6C073;text-decoration:none">Roasters</a> &middot; '+esc(roaster.name)+'</div><div style="padding:16px 0 16px"><div style="font-size:10px;letter-spacing:3px;color:rgba(230,192,115,0.5);margin-bottom:8px">ROASTER &middot; '+roaster.count+' CAFES</div><h1 style="font-family:Bebas Neue,sans-serif;font-size:clamp(26px,6vw,40px);letter-spacing:2px;color:#fff;margin-bottom:10px">Cafes Pouring '+esc(roaster.name)+'</h1><p style="font-size:14px;color:rgba(255,255,255,0.45);line-height:1.6">'+roaster.count+' cafes across '+cityCount+' '+(cityCount===1?'city':'cities')+' and '+suburbCount+' suburbs serve '+esc(roaster.name)+' beans. Average score: '+roaster.avg.toFixed(1)+'/10. '+mv+' '+(mv===1?'cafe has':'cafes have')+' earned our Must Visit rating.</p></div><div class="stats"><div class="stat"><div class="stat-n">'+roaster.count+'</div><div class="stat-l">CAFES</div></div><div class="stat"><div class="stat-n">'+roaster.avg.toFixed(1)+'</div><div class="stat-l">AVG SCORE</div></div><div class="stat"><div class="stat-n">'+roaster.top.toFixed(1)+'</div><div class="stat-l">TOP SCORE</div></div><div class="stat"><div class="stat-n">'+mv+'</div><div class="stat-l">MUST VISIT</div></div></div><div style="font-family:Bebas Neue,sans-serif;font-size:12px;letter-spacing:3px;color:rgba(255,255,255,0.25);margin-bottom:10px">ALL CAFES, RANKED</div>'+rCards+'<div style="margin-top:24px"><div style="font-family:Bebas Neue,sans-serif;font-size:12px;letter-spacing:3px;color:rgba(255,255,255,0.25);margin-bottom:10px">OTHER ROASTERS</div><div style="display:flex;flex-wrap:wrap">'+otherRoasters+'</div></div><div style="margin-top:24px;display:flex;flex-direction:column;gap:8px"><a href="/roaster" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;text-decoration:none;color:rgba(255,255,255,0.5);font-size:13px">All Roasters &rarr;</a><a href="/must-visit-cafes" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:rgba(230,192,115,0.03);border:1px solid rgba(230,192,115,0.12);border-radius:14px;text-decoration:none;color:#E6C073;font-size:13px">Must Visit Cafes &rarr;</a><a href="/explore" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;text-decoration:none;color:rgba(255,255,255,0.5);font-size:13px">Explore &rarr;</a></div>'+footerHtml(year)+'</div></body></html>');
  }catch(e){
    res.setHeader("Content-Type","text/html");
    res.status(500).send('<!DOCTYPE html><html><head><title>Error</title></head><body style="background:#0a0a0c;color:#fff;font-family:sans-serif;text-align:center;padding:60px"><h1 style="color:#E6C073">Something went wrong</h1><p style="color:rgba(255,255,255,0.4)">'+esc(e.message||"Unknown error")+'</p><a href="/roaster" style="color:#E6C073">&larr; All Roasters</a></body></html>');
  }
}
