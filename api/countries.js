const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYEU8Khk3R5I879v3FcXPqhq0aCXa2ZWM1BwwJOyUitx2Boak_AFTOkwvB8qQrKIeU55NM4htFjHbI/pub?gid=0&single=true&output=csv";

// Map sheet city values to country
var COUNTRY_MAP = {
  "barcelona": "Spain",
  "catalonia": "Spain",
  "spain": "Spain"
};
// Add more as you travel: "tokyo": "Japan", "london": "England", etc.

function esc(s){return(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
function splitCSV(line){var r=[],c="",q=false;for(var i=0;i<line.length;i++){var ch=line[i];if(ch==='"')q=!q;else if(ch===","&&!q){r.push(c.trim());c="";}else c+=ch;}r.push(c.trim());return r;}
function makeSlug(n,s){return(n+"-"+s).toLowerCase().replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-").trim();}
function countrySlug(n){return(n||"").toLowerCase().replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").trim();}
function gc(s){if(s>=9.1)return"#ffffff";if(s>=8.1)return"#4ade80";if(s>=7.5)return"#2dd4bf";if(s>=7.1)return"#2dd4bf";if(s>=6.5)return"#facc15";if(s>=6.1)return"#facc15";if(s>=5.5)return"#fb923c";if(s>=5.1)return"#fb923c";return"#f87171";}
function gv(s){if(s>=9.1)return"ELITE";if(s>=8.1)return"GREAT";if(s>=7.5)return"MUST VISIT";if(s>=7.1)return"SOLID";if(s>=6.5)return"DECENT";if(s>=6.1)return"TAKE OR LEAVE";if(s>=5.5)return"AVERAGE";if(s>=5.1)return"JUST OKAY";if(s>=4.1)return"NOT FOR US";return"AVOID";}

function css(){return'*{margin:0;padding:0;box-sizing:border-box}body{background:#0a0a0c;color:#fff;font-family:DM Sans,sans-serif;-webkit-font-smoothing:antialiased}.c{max-width:720px;margin:0 auto;padding:0 20px 60px}.nav{display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid rgba(255,255,255,0.06)}.nav-logo{display:flex;align-items:center;gap:10px;text-decoration:none}.nav-logo img{width:34px;height:34px;border-radius:50%}.nav-logo span{font-family:Bebas Neue,sans-serif;font-size:15px;letter-spacing:3px;color:#E6C073}.nav-links{display:flex;gap:14px}.nav-links a{font-size:12px;color:rgba(255,255,255,0.45);text-decoration:none}.stats{display:flex;gap:0;margin:0 auto 20px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05);border-radius:14px;overflow:hidden}.stat{flex:1;text-align:center;padding:14px 8px;border-right:1px solid rgba(255,255,255,0.03)}.stat:last-child{border:none}.stat-n{font-family:Bebas Neue,sans-serif;font-size:26px;color:#E6C073;line-height:1}.stat-l{font-size:9px;letter-spacing:2px;color:rgba(255,255,255,0.3);margin-top:2px}.ft{margin-top:32px;padding:20px 0;border-top:1px solid rgba(255,255,255,0.04);text-align:center;font-size:11px;color:rgba(255,255,255,0.3)}.ft a{color:rgba(255,255,255,0.5);text-decoration:none;margin:0 8px}';}

function nav(){return'<nav class="nav"><a href="/" class="nav-logo"><img src="/logo.webp" alt="KR"><span>KOFFEE REVIEW</span></a><div class="nav-links"><a href="/explore">Explore</a><a href="/leaderboard">Leaderboard</a><a href="/blog">Blog</a></div></nav>';}
function footer(year){return'<footer class="ft"><p>&copy; '+year+' Our Fair Dinkum Koffee Review</p><div style="margin-top:10px"><a href="/leaderboard">Leaderboard</a><a href="/explore">Explore</a><a href="/blog">Blog</a></div></footer>';}

export default async function handler(req,res){
  try{
    var slug=req.query.country||"";
    var response=await fetch(SHEET_URL);
    var text=await response.text();
    var lines=text.split("\n").filter(function(l){return l.trim();});
    var h=splitCSV(lines[0]).map(function(x){return x.trim().toLowerCase();});
    var ni=h.indexOf("name"),si=h.indexOf("suburb"),ci=h.indexOf("city"),sci=h.indexOf("score"),noi=h.indexOf("notes"),pi=h.indexOf("price");

    // Parse only international cafes
    var intlCafes=[];
    for(var i=1;i<lines.length;i++){
      try{
        var p=splitCSV(lines[i]);
        var n=(p[ni]||"").trim();if(!n)continue;
        var sc=parseFloat(p[sci])||0;if(sc<=0)continue;
        var city=(p[ci]||"").trim();
        var country=COUNTRY_MAP[city.toLowerCase()];
        if(!country)continue;
        intlCafes.push({name:n,suburb:(p[si]||"").trim(),city:city,score:sc,notes:(p[noi]||"").trim(),price:(p[pi]||"").trim(),country:country});
      }catch(e){}
    }

    // Group by country
    var countryMap={};
    intlCafes.forEach(function(c){
      if(!countryMap[c.country])countryMap[c.country]={name:c.country,slug:countrySlug(c.country),cafes:[],cities:{}};
      countryMap[c.country].cafes.push(c);
      countryMap[c.country].cities[c.city]=true;
    });

    var year=new Date().getFullYear();
    var totalIntl=intlCafes.length;

    res.setHeader("Content-Type","text/html; charset=utf-8");
    res.setHeader("Cache-Control","public, s-maxage=3600, stale-while-revalidate=86400");

    // ═══ INDEX PAGE — /countries ═══
    if(!slug){
      var countries=Object.values(countryMap).sort(function(a,b){return b.cafes.length-a.cafes.length;});

      if(countries.length===0){
        return res.status(200).send('<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>International Reviews | Koffee Review</title><link rel="icon" href="/logo.webp"><link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet"><style>'+css()+'</style></head><body><div class="c">'+nav()+'<div style="padding:60px 0;text-align:center"><h1 style="font-family:Bebas Neue,sans-serif;font-size:32px;color:#E6C073;margin-bottom:12px">Coming Soon</h1><p style="color:rgba(255,255,255,0.5)">International reviews are being added.</p><a href="/explore" style="display:inline-block;margin-top:20px;color:#E6C073;text-decoration:none">&larr; Explore</a></div>'+footer(year)+'</div></body></html>');
      }

      var countryCards=countries.map(function(c){
        var avg=(c.cafes.reduce(function(s,cf){return s+cf.score;},0)/c.cafes.length).toFixed(1);
        var mv=c.cafes.filter(function(cf){return cf.score>=7.5;}).length;
        var cityCount=Object.keys(c.cities).length;
        var cityNames=Object.keys(c.cities).join(", ");
        return'<a href="/countries/'+c.slug+'" style="display:block;padding:20px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;margin-bottom:10px;text-decoration:none;color:inherit;transition:border 0.15s"><div style="display:flex;align-items:center;justify-content:space-between"><div><div style="font-size:18px;font-weight:600;color:#fff">'+esc(c.name)+'</div><div style="font-size:12px;color:rgba(255,255,255,0.35);margin-top:4px">'+esc(cityNames)+' &middot; '+c.cafes.length+' cafes reviewed &middot; avg '+avg+'/10</div>'+(mv>0?'<div style="font-size:10px;color:#2dd4bf;margin-top:4px;letter-spacing:1px;font-weight:700">'+mv+' MUST VISIT</div>':'')+'</div><div style="font-family:Bebas Neue,sans-serif;font-size:36px;color:#E6C073">'+c.cafes.length+'</div></div></a>';
      }).join("");

      return res.status(200).send('<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>International Coffee Reviews '+year+' | Koffee Review</title><meta name="description" content="We took our review system overseas. '+totalIntl+' cafes reviewed internationally. Same order, same scoring. One latte, one double shot espresso."><link rel="canonical" href="https://koffeereview.com.au/countries"><link rel="icon" href="/logo.webp"><link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet"><style>'+css()+'</style></head><body><div class="c">'+nav()+'<div style="font-size:12px;color:rgba(255,255,255,0.35);padding:12px 0"><a href="/" style="color:#E6C073;text-decoration:none">Home</a> &middot; <a href="/explore" style="color:#E6C073;text-decoration:none">Explore</a> &middot; International</div><div style="padding:16px 0 20px"><div style="font-size:10px;letter-spacing:3px;color:rgba(230,192,115,0.5);margin-bottom:8px">INTERNATIONAL &middot; '+year+'</div><h1 style="font-family:Bebas Neue,sans-serif;font-size:clamp(28px,7vw,42px);letter-spacing:2px;color:#fff;margin-bottom:10px">Coffee Beyond Australia</h1><p style="font-size:14px;color:rgba(255,255,255,0.45);line-height:1.7">We took our review system overseas. Same order every time. One latte, one double shot espresso. A 7.5 in Barcelona means the same as a 7.5 in Brisbane. No methodology changes. No country bias. Just the coffee.</p></div><div style="font-family:Bebas Neue,sans-serif;font-size:12px;letter-spacing:3px;color:rgba(255,255,255,0.25);margin-bottom:10px">COUNTRIES REVIEWED</div>'+countryCards+'<div style="margin-top:28px;display:flex;flex-direction:column;gap:8px"><a href="/city/brisbane" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;text-decoration:none;color:rgba(255,255,255,0.5);font-size:13px">Back to Australian Reviews &rarr;</a><a href="/explore" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;text-decoration:none;color:rgba(255,255,255,0.5);font-size:13px">Explore Koffee Review &rarr;</a></div>'+footer(year)+'</div></body></html>');
    }

    // ═══ COUNTRY PAGE — /countries/spain ═══
    var country=null;
    Object.values(countryMap).forEach(function(c){if(c.slug===slug)country=c;});

    if(!country){
      return res.status(404).send('<!DOCTYPE html><html><head><title>Not Found</title><meta name="robots" content="noindex"></head><body style="background:#0a0a0c;color:#fff;font-family:sans-serif;text-align:center;padding:60px"><h1 style="color:#E6C073">Country Not Found</h1><a href="/countries" style="color:#E6C073">&larr; All Countries</a></body></html>');
    }

    var sorted=country.cafes.sort(function(a,b){return b.score-a.score;});
    var total=sorted.length;
    var mv=sorted.filter(function(c){return c.score>=7.5;}).length;
    var avg=(sorted.reduce(function(s,c){return s+c.score;},0)/total).toFixed(1);
    var top=sorted[0];
    var cityCount=Object.keys(country.cities).length;
    var cityNames=Object.keys(country.cities).join(", ");

    var cards=sorted.map(function(c,i){
      var col=gc(c.score);var v=gv(c.score);var sl=makeSlug(c.name,c.suburb);
      var notes=c.notes?esc(c.notes.substring(0,70))+(c.notes.length>70?"...":""):"";
      return'<a href="/review/'+sl+'" style="display:flex;align-items:center;gap:14px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;padding:14px 18px;margin-bottom:8px;text-decoration:none;color:inherit"><div style="font-size:12px;color:rgba(255,255,255,0.25);width:22px;text-align:center;flex-shrink:0">'+(i+1)+'</div><div style="width:44px;height:44px;border-radius:50%;border:2px solid '+col+';display:flex;align-items:center;justify-content:center;flex-shrink:0"><span style="font-family:Bebas Neue,sans-serif;font-size:18px;color:'+col+'">'+c.score.toFixed(1)+'</span></div><div style="flex:1;min-width:0"><div style="font-size:14px;font-weight:600;color:#fff">'+esc(c.name)+'</div><div style="font-size:11px;color:rgba(255,255,255,0.35)">'+esc(c.suburb)+', '+esc(c.city)+'</div>'+(notes?'<div style="font-size:11px;color:rgba(255,255,255,0.25);font-style:italic;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:260px">'+notes+'</div>':'')+'</div><div style="padding:3px 10px;border-radius:20px;font-size:9px;font-weight:700;letter-spacing:1.5px;background:'+col+'18;color:'+col+';border:1px solid '+col+'40;flex-shrink:0;white-space:nowrap">'+v+'</div></a>';
    }).join("");

    return res.status(200).send('<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Best Coffee in '+esc(country.name)+' '+year+' | '+total+' Cafes Reviewed | Koffee Review</title><meta name="description" content="'+total+' cafes reviewed in '+esc(country.name)+' with the same methodology: one latte, one double shot espresso. Top pick: '+esc(top.name)+' ('+top.score.toFixed(1)+'/10)."><link rel="canonical" href="https://koffeereview.com.au/countries/'+country.slug+'"><link rel="icon" href="/logo.webp"><link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet"><style>'+css()+'</style></head><body><div class="c">'+nav()+'<div style="font-size:12px;color:rgba(255,255,255,0.35);padding:12px 0"><a href="/" style="color:#E6C073;text-decoration:none">Home</a> &middot; <a href="/countries" style="color:#E6C073;text-decoration:none">International</a> &middot; '+esc(country.name)+'</div><div style="padding:16px 0 16px"><div style="font-size:10px;letter-spacing:3px;color:rgba(230,192,115,0.5);margin-bottom:8px">'+esc(country.name).toUpperCase()+' &middot; '+total+' CAFES</div><h1 style="font-family:Bebas Neue,sans-serif;font-size:clamp(26px,6vw,40px);letter-spacing:2px;color:#fff;margin-bottom:10px">Coffee in '+esc(country.name)+'</h1><p style="font-size:14px;color:rgba(255,255,255,0.45);line-height:1.6">'+total+' cafes across '+esc(cityNames)+' reviewed with the same order we use everywhere. One latte, one double shot espresso. Same scoring. Different continent.</p></div><div class="stats"><div class="stat"><div class="stat-n">'+total+'</div><div class="stat-l">REVIEWED</div></div><div class="stat"><div class="stat-n">'+mv+'</div><div class="stat-l">MUST VISIT</div></div><div class="stat"><div class="stat-n">'+avg+'</div><div class="stat-l">AVG SCORE</div></div><div class="stat"><div class="stat-n">'+top.score.toFixed(1)+'</div><div class="stat-l">TOP SCORE</div></div></div>'+cards+'<div style="margin-top:28px;display:flex;flex-direction:column;gap:8px"><a href="/countries" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;text-decoration:none;color:rgba(255,255,255,0.5);font-size:13px">&larr; All Countries</a><a href="/must-visit-cafes" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:rgba(230,192,115,0.03);border:1px solid rgba(230,192,115,0.12);border-radius:14px;text-decoration:none;color:#E6C073;font-size:13px">Must Visit Cafes &rarr;</a><a href="/explore" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;text-decoration:none;color:rgba(255,255,255,0.5);font-size:13px">Explore &rarr;</a></div>'+footer(year)+'</div></body></html>');
  }catch(e){
    res.setHeader("Content-Type","text/html");
    res.status(500).send('<!DOCTYPE html><html><head><title>Error</title></head><body style="background:#0a0a0c;color:#fff;font-family:sans-serif;text-align:center;padding:60px"><h1 style="color:#E6C073">Something went wrong</h1><a href="/explore" style="color:#E6C073">&larr; Explore</a></body></html>');
  }
}
