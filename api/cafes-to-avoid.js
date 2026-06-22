const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYEU8Khk3R5I879v3FcXPqhq0aCXa2ZWM1BwwJOyUitx2Boak_AFTOkwvB8qQrKIeU55NM4htFjHbI/pub?gid=0&single=true&output=csv";
const SPAIN = ["barcelona","catalonia","spain"];
function esc(s){return(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
function splitCSV(line){var r=[],c="",q=false;for(var i=0;i<line.length;i++){var ch=line[i];if(ch==='"')q=!q;else if(ch===","&&!q){r.push(c.trim());c="";}else c+=ch;}r.push(c.trim());return r;}
function makeSlug(n,s){return(n+"-"+s).toLowerCase().replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-").trim();}
function gc(s){if(s>=5.1)return"#fb923c";if(s>=4.1)return"#f87171";return"#ef4444";}
function gv(s){if(s>=5.1)return"JUST OKAY";if(s>=4.1)return"NOT FOR US";return"AVOID";}
function toTitle(s){return s.replace(/\w\S*/g,function(t){return t.charAt(0).toUpperCase()+t.substr(1).toLowerCase();});}

export default async function handler(req,res){
  try{
    var cityParam=(req.query.city||"").toLowerCase().replace(/-/g," ");
    if(!cityParam){return res.status(404).send("Not found");}
    var response=await fetch(SHEET_URL);var text=await response.text();
    var lines=text.split("\n").filter(function(l){return l.trim();});
    var h=splitCSV(lines[0]).map(function(x){return x.trim().toLowerCase();});
    var ni=h.indexOf("name"),si=h.indexOf("suburb"),ci=h.indexOf("city"),sci=h.indexOf("score"),noi=h.indexOf("notes");
    var cafes=[];
    for(var i=1;i<lines.length;i++){try{var p=splitCSV(lines[i]);var n=(p[ni]||"").trim();if(!n)continue;var sc=parseFloat(p[sci])||0;if(sc<=0||sc>=5.5)continue;
    var city=(p[ci]||"").trim();if(SPAIN.indexOf(city.toLowerCase())!==-1)continue;
    if(city.toLowerCase()!==cityParam)continue;
    cafes.push({name:n,suburb:(p[si]||"").trim(),city:city,score:sc,notes:(p[noi]||"").trim()});}catch(e){}}

    var sorted=cafes.sort(function(a,b){return a.score-b.score;});
    var total=cafes.length;
    var cityDisplay=toTitle(cityParam);
    var citySlug=cityParam.replace(/\s+/g,"-");
    var year=new Date().getFullYear();

    if(total===0){
      res.setHeader("Content-Type","text/html");
      return res.status(200).send('<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Cafes to Avoid in '+esc(cityDisplay)+' | Koffee Review</title><link rel="icon" href="/logo.webp"><link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet"><style>*{margin:0;padding:0;box-sizing:border-box}body{background:#0a0a0c;color:#fff;font-family:DM Sans,sans-serif}.c{max-width:720px;margin:0 auto;padding:40px 20px;text-align:center}</style></head><body><div class="c"><h1 style="font-family:Bebas Neue,sans-serif;font-size:32px;color:#4ade80;margin-bottom:12px">No Cafes to Avoid</h1><p style="color:rgba(255,255,255,0.5);font-size:14px">Every cafe we have reviewed in '+esc(cityDisplay)+' scored above 5.5. That is a good thing.</p><a href="/best-coffee-'+citySlug+'" style="display:inline-block;margin-top:20px;color:#E6C073;text-decoration:none">Best Coffee in '+esc(cityDisplay)+' &rarr;</a></div></body></html>');
    }

    var title="Cafes to Avoid in "+cityDisplay+" "+year+" | "+total+" Below 5.5 | Koffee Review";
    var desc="We tested every cafe in "+cityDisplay+" with one latte and one double shot espresso. "+total+" scored below 5.5. Here is where NOT to go, and why.";
    var canonical="https://koffeereview.com.au/"+citySlug+"-cafes-to-avoid";

    var cards=sorted.map(function(c,i){
      var col=gc(c.score);var v=gv(c.score);var slug=makeSlug(c.name,c.suburb);
      var notes=c.notes?esc(c.notes.substring(0,80))+(c.notes.length>80?"...":""):"";
      return'<a href="/review/'+slug+'" style="display:flex;align-items:center;gap:14px;background:rgba(248,113,113,0.03);border:1px solid rgba(248,113,113,0.1);border-radius:14px;padding:14px 18px;margin-bottom:8px;text-decoration:none;color:inherit"><div style="font-size:12px;color:rgba(255,255,255,0.25);width:22px;text-align:center;flex-shrink:0">'+(i+1)+'</div><div style="width:44px;height:44px;border-radius:50%;border:2px solid '+col+';display:flex;align-items:center;justify-content:center;flex-shrink:0"><span style="font-family:Bebas Neue,sans-serif;font-size:18px;color:'+col+'">'+c.score.toFixed(1)+'</span></div><div style="flex:1;min-width:0"><div style="font-size:14px;font-weight:600;color:#fff">'+esc(c.name)+'</div><div style="font-size:11px;color:rgba(255,255,255,0.35)">'+esc(c.suburb)+', '+esc(c.city)+'</div>'+(notes?'<div style="font-size:11px;color:rgba(248,113,113,0.5);font-style:italic;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:260px">'+notes+'</div>':'')+'</div><div style="padding:3px 10px;border-radius:20px;font-size:9px;font-weight:700;letter-spacing:1.5px;background:rgba(248,113,113,0.1);color:#f87171;border:1px solid rgba(248,113,113,0.25);flex-shrink:0;white-space:nowrap">'+v+'</div></a>';
    }).join("");

    var faqSchema=JSON.stringify({"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
      {"@type":"Question","name":"Which cafes should you avoid in "+cityDisplay+"?","acceptedAnswer":{"@type":"Answer","text":total+" cafes in "+cityDisplay+" scored below 5.5 out of 10 in our review system. We order one latte and one double shot espresso at every cafe. These cafes failed on extraction quality, milk technique, or bean freshness."}},
      {"@type":"Question","name":"Why does Koffee Review publish cafes to avoid?","acceptedAnswer":{"@type":"Answer","text":"Knowing where NOT to go is as valuable as knowing where to go. If you are in a suburb with four cafes and one scored 4.2, you want to know before you waste $6 and 20 minutes. We publish all scores, good and bad, because honest data helps everyone."}}
    ]});

    // Other cities with avoid cafes
    var allCafes=[];
    for(var j=1;j<lines.length;j++){try{var pp=splitCSV(lines[j]);var nn=(pp[ni]||"").trim();if(!nn)continue;var ssc=parseFloat(pp[sci])||0;if(ssc<=0||ssc>=5.5)continue;var cc=(pp[ci]||"").trim();if(SPAIN.indexOf(cc.toLowerCase())!==-1||cc.toLowerCase()===cityParam)continue;allCafes.push({city:cc});}catch(e){}}
    var otherCityMap={};allCafes.forEach(function(c){otherCityMap[c.city]=(otherCityMap[c.city]||0)+1;});
    var otherLinks=Object.keys(otherCityMap).sort(function(a,b){return otherCityMap[b]-otherCityMap[a];}).map(function(c){
      var s=c.toLowerCase().replace(/\s+/g,"-");
      return'<a href="/'+s+'-cafes-to-avoid" style="display:inline-block;padding:8px 14px;border-radius:10px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);color:rgba(255,255,255,0.5);font-size:12px;text-decoration:none;margin:0 4px 4px 0">'+esc(c)+' ('+otherCityMap[c]+')</a>';
    }).join("");

    var html='<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
    +'<title>'+title+'</title><meta name="description" content="'+desc+'">'
    +'<link rel="canonical" href="'+canonical+'"><link rel="icon" href="/logo.webp">'
    +'<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">'
    +'<script type="application/ld+json">'+faqSchema+'<\/script>'
    +'<style>*{margin:0;padding:0;box-sizing:border-box}body{background:#0a0a0c;color:#fff;font-family:DM Sans,sans-serif;-webkit-font-smoothing:antialiased}.c{max-width:720px;margin:0 auto;padding:0 20px 60px}.nav{display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid rgba(255,255,255,0.06)}.nav-logo{display:flex;align-items:center;gap:10px;text-decoration:none}.nav-logo img{width:34px;height:34px;border-radius:50%}.nav-logo span{font-family:Bebas Neue,sans-serif;font-size:15px;letter-spacing:3px;color:#E6C073}.nav-links{display:flex;gap:14px}.nav-links a{font-size:12px;color:rgba(255,255,255,0.45);text-decoration:none}.ft{margin-top:32px;padding:20px 0;border-top:1px solid rgba(255,255,255,0.04);text-align:center;font-size:11px;color:rgba(255,255,255,0.3)}.ft a{color:rgba(255,255,255,0.5);text-decoration:none;margin:0 8px}</style>'
    +'</head><body><div class="c">'
    +'<nav class="nav"><a href="/" class="nav-logo"><img src="/logo.webp" alt="KR"><span>KOFFEE REVIEW</span></a><div class="nav-links"><a href="/city/'+citySlug+'">'+esc(cityDisplay)+'</a><a href="/explore">Explore</a><a href="/blog">Blog</a></div></nav>'
    +'<div style="padding:28px 0 16px"><div style="font-size:10px;letter-spacing:3px;color:rgba(248,113,113,0.5);margin-bottom:8px">'+esc(cityDisplay.toUpperCase())+' &middot; CAFES TO AVOID &middot; '+year+'</div>'
    +'<h1 style="font-family:Bebas Neue,sans-serif;font-size:clamp(26px,6vw,40px);letter-spacing:2px;color:#fff;margin-bottom:8px">Cafes to Avoid in '+esc(cityDisplay)+'</h1>'
    +'<p style="font-size:14px;color:rgba(255,255,255,0.45);line-height:1.6">'+total+' cafes in '+esc(cityDisplay)+' scored below 5.5 in our system. We tested every one with the same order: one latte, one double shot espresso. These cafes missed on quality. Here is where NOT to go.</p></div>'
    +cards
    +(otherLinks?'<div style="margin-top:24px"><div style="font-family:Bebas Neue,sans-serif;font-size:12px;letter-spacing:3px;color:rgba(255,255,255,0.25);margin-bottom:10px">AVOID IN OTHER CITIES</div><div style="display:flex;flex-wrap:wrap">'+otherLinks+'</div></div>':'')
    +'<div style="margin-top:24px;display:flex;flex-direction:column;gap:8px">'
    +'<a href="/best-coffee-'+citySlug+'" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:rgba(230,192,115,0.03);border:1px solid rgba(230,192,115,0.12);border-radius:14px;text-decoration:none;color:#E6C073;font-size:13px">Best Coffee in '+esc(cityDisplay)+' instead &rarr;</a>'
    +'<a href="/must-visit-cafes" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;text-decoration:none;color:rgba(255,255,255,0.5);font-size:13px">Must Visit Cafes &rarr;</a>'
    +'<a href="/explore" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;text-decoration:none;color:rgba(255,255,255,0.5);font-size:13px">Explore &rarr;</a></div>'
    +'<footer class="ft"><p>&copy; '+year+' Our Fair Dinkum Koffee Review</p><div style="margin-top:10px"><a href="/leaderboard">Leaderboard</a><a href="/explore">Explore</a><a href="/blog">Blog</a></div></footer></div></body></html>';

    res.setHeader("Content-Type","text/html; charset=utf-8");
    res.setHeader("Cache-Control","public, s-maxage=3600, stale-while-revalidate=86400");
    res.status(200).send(html);
  }catch(e){res.status(500).send("Error");}
}
