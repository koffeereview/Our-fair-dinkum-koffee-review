const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYEU8Khk3R5I879v3FcXPqhq0aCXa2ZWM1BwwJOyUitx2Boak_AFTOkwvB8qQrKIeU55NM4htFjHbI/pub?gid=0&single=true&output=csv";
const SPAIN = ["barcelona","catalonia","spain"];
function esc(s){return(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
function splitCSV(line){var r=[],c="",q=false;for(var i=0;i<line.length;i++){var ch=line[i];if(ch==='"')q=!q;else if(ch===","&&!q){r.push(c.trim());c="";}else c+=ch;}r.push(c.trim());return r;}
function makeSlug(n,s){return(n+"-"+s).toLowerCase().replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-").trim();}
function gc(s){if(s>=9.1)return"#ffffff";if(s>=8.1)return"#4ade80";if(s>=7.5)return"#2dd4bf";if(s>=7.1)return"#2dd4bf";if(s>=6.5)return"#facc15";if(s>=6.1)return"#facc15";if(s>=5.5)return"#fb923c";if(s>=5.1)return"#fb923c";return"#f87171";}
function gv(s){if(s>=9.1)return"ELITE";if(s>=8.1)return"GREAT";if(s>=7.5)return"MUST VISIT";if(s>=7.1)return"SOLID";if(s>=6.5)return"DECENT";if(s>=6.1)return"TAKE OR LEAVE";if(s>=5.5)return"AVERAGE";if(s>=5.1)return"JUST OKAY";if(s>=4.1)return"NOT FOR US";return"AVOID";}
function toTitle(s){return s.replace(/\w\S*/g,function(t){return t.charAt(0).toUpperCase()+t.substr(1).toLowerCase();});}
function extractPrice(p){var s=(p||"").trim();if(!s)return 0;var count=(s.match(/\$/g)||[]).length;return count||0;}
function priceLabel(p){if(p===1)return"$";if(p===2)return"$$";if(p===3)return"$$$";return"$$$$";}
function priceDesc(p){if(p===1)return"Budget";if(p===2)return"Standard";if(p===3)return"Premium";return"Expensive";}

export default async function handler(req,res){
  try{
    var cityParam=(req.query.city||"brisbane").toLowerCase().replace(/-/g," ");
    var isNational=cityParam==="all";
    var response=await fetch(SHEET_URL);var text=await response.text();
    var lines=text.split("\n").filter(function(l){return l.trim();});
    var h=splitCSV(lines[0]).map(function(x){return x.trim().toLowerCase();});
    var ni=h.indexOf("name"),si=h.indexOf("suburb"),ci=h.indexOf("city"),sci=h.indexOf("score"),noi=h.indexOf("notes"),pi=h.indexOf("price");
    var cafes=[];
    for(var i=1;i<lines.length;i++){try{var p=splitCSV(lines[i]);var n=(p[ni]||"").trim();if(!n)continue;var sc=parseFloat(p[sci])||0;if(sc<=0)continue;
    var city=(p[ci]||"").trim();if(SPAIN.indexOf(city.toLowerCase())!==-1)continue;
    if(!isNational&&city.toLowerCase()!==cityParam)continue;
    var price=extractPrice(p[pi]||"");if(price<=0)continue;
    var valueScore=sc/price;
    cafes.push({name:n,suburb:(p[si]||"").trim(),city:city,score:sc,notes:(p[noi]||"").trim(),price:price,priceStr:priceLabel(price),value:valueScore});}catch(e){}}

    // Sort by value score (highest score per dollar first), then by score
    var sorted=cafes.sort(function(a,b){return b.value-a.value||b.score-a.score;});
    var total=cafes.length;
    var cityDisplay=isNational?"Australia":toTitle(cityParam);
    var citySlug=isNational?"australia":cityParam.replace(/\s+/g,"-");
    var year=new Date().getFullYear();

    if(total===0){
      res.setHeader("Content-Type","text/html");
      return res.status(404).send('<!DOCTYPE html><html><head><title>Not Found</title><meta name="robots" content="noindex"></head><body style="background:#0a0a0c;color:#fff;font-family:sans-serif;text-align:center;padding:60px"><h1 style="color:#E6C073">No value data for '+esc(cityDisplay)+'</h1><p style="color:rgba(255,255,255,0.4)">We need price data to rank by value.</p><a href="/explore" style="color:#E6C073">Explore &rarr;</a></body></html>');
    }

    var top=sorted[0];
    var mustVisit=cafes.filter(function(c){return c.score>=7.5;}).length;

    var title="Best Value Coffee in "+cityDisplay+" "+year+" | Quality vs Price Ranked | Koffee Review";
    var desc="Every cafe in "+cityDisplay+" ranked by score per price tier. "+total+" cafes with price data. Best value: "+esc(top.name)+" ("+top.score.toFixed(1)+"/10 at "+top.priceStr+"). High scores, low prices.";
    var canonical="https://koffeereview.com.au/best-value-"+citySlug;

    var cafeData=JSON.stringify(sorted.map(function(c){return{n:c.name,s:c.suburb,c:c.city,sc:c.score,p:c.price,ps:c.priceStr,v:c.value,nt:(c.notes||"").substring(0,60)};}));

    var noscriptCards=sorted.slice(0,20).map(function(c,i){
      var col=gc(c.score);var slug=makeSlug(c.name,c.suburb);
      return'<a href="/review/'+slug+'" style="display:block;padding:10px;margin-bottom:4px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:8px;text-decoration:none;color:#fff;font-size:13px">'+(i+1)+'. '+esc(c.name)+' ('+esc(c.suburb)+') — <span style="color:'+col+'">'+c.score.toFixed(1)+'/10</span> '+c.priceStr+'</a>';
    }).join("");

    var faqSchema=JSON.stringify({"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
      {"@type":"Question","name":"Where is the best value coffee in "+cityDisplay+"?","acceptedAnswer":{"@type":"Answer","text":"Based on "+total+" cafes with price data, "+top.name+" in "+top.suburb+" offers the best value in "+cityDisplay+" with a score of "+top.score.toFixed(1)+"/10 at "+top.priceStr+" pricing. We calculate value by dividing the quality score by the price tier."}},
      {"@type":"Question","name":"Can you get good cheap coffee in "+cityDisplay+"?","acceptedAnswer":{"@type":"Answer","text":"Yes. "+mustVisit+" cafes in "+cityDisplay+" score 7.5+ (Must Visit). Many of these are in the "+priceLabel(1)+" price tier. Good coffee does not always mean expensive coffee."}}
    ]});

    var html='<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
    +'<title>'+title+'</title><meta name="description" content="'+desc+'">'
    +'<link rel="canonical" href="'+canonical+'"><link rel="icon" href="/logo.webp">'
    +'<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">'
    +'<script type="application/ld+json">'+faqSchema+'<\/script>'
    +'<style>*{margin:0;padding:0;box-sizing:border-box}body{background:#0a0a0c;color:#fff;font-family:DM Sans,sans-serif;-webkit-font-smoothing:antialiased}.c{max-width:720px;margin:0 auto;padding:0 20px 60px}.nav{display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid rgba(255,255,255,0.06)}.nav-logo{display:flex;align-items:center;gap:10px;text-decoration:none}.nav-logo img{width:34px;height:34px;border-radius:50%}.nav-logo span{font-family:Bebas Neue,sans-serif;font-size:15px;letter-spacing:3px;color:#E6C073}.nav-links{display:flex;gap:14px}.nav-links a{font-size:12px;color:rgba(255,255,255,0.45);text-decoration:none}.stats{display:flex;gap:0;margin:0 auto 20px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05);border-radius:14px;overflow:hidden}.stat{flex:1;text-align:center;padding:14px 8px;border-right:1px solid rgba(255,255,255,0.03)}.stat:last-child{border:none}.stat-n{font-family:Bebas Neue,sans-serif;font-size:26px;color:#E6C073;line-height:1}.stat-l{font-size:9px;letter-spacing:2px;color:rgba(255,255,255,0.3);margin-top:2px}.lm-btn{width:100%;padding:14px;border-radius:12px;background:rgba(230,192,115,0.06);border:1px solid rgba(230,192,115,0.15);color:#E6C073;font-size:13px;font-weight:600;cursor:pointer;font-family:DM Sans,sans-serif;margin-bottom:16px;display:none}.ft{margin-top:32px;padding:20px 0;border-top:1px solid rgba(255,255,255,0.04);text-align:center;font-size:11px;color:rgba(255,255,255,0.3)}.ft a{color:rgba(255,255,255,0.5);text-decoration:none;margin:0 8px}</style>'
    +'</head><body><div class="c">'
    +'<nav class="nav"><a href="/" class="nav-logo"><img src="/logo.webp" alt="KR"><span>KOFFEE REVIEW</span></a><div class="nav-links">'+(isNational?'<a href="/leaderboard">Leaderboard</a>':'<a href="/city/'+citySlug+'">'+esc(cityDisplay)+'</a>')+'<a href="/explore">Explore</a><a href="/blog">Blog</a></div></nav>'
    +'<div style="padding:28px 0 16px"><div style="font-size:10px;letter-spacing:3px;color:rgba(230,192,115,0.5);margin-bottom:8px">'+esc(cityDisplay.toUpperCase())+' &middot; VALUE RANKINGS &middot; '+year+'</div>'
    +'<h1 style="font-family:Bebas Neue,sans-serif;font-size:clamp(28px,7vw,42px);letter-spacing:2px;color:#fff;margin-bottom:8px">Best Value Coffee in '+esc(cityDisplay)+'</h1>'
    +'<p style="font-size:14px;color:rgba(255,255,255,0.45);line-height:1.6">'+total+' cafes ranked by quality per dollar. Score divided by price. The best coffee for your money. Not the cheapest. Not the highest scored. The best balance of both.</p></div>'
    +'<div class="stats"><div class="stat"><div class="stat-n">'+total+'</div><div class="stat-l">WITH PRICE DATA</div></div><div class="stat"><div class="stat-n">'+top.score.toFixed(1)+'</div><div class="stat-l">BEST VALUE SCORE</div></div><div class="stat"><div class="stat-n">'+top.priceStr+'</div><div class="stat-l">AT PRICE</div></div><div class="stat"><div class="stat-n">'+mustVisit+'</div><div class="stat-l">MUST VISIT</div></div></div>'
    +'<div id="cl"></div><div id="countLabel" style="text-align:center;font-size:12px;color:rgba(255,255,255,0.3);margin:8px 0"></div>'
    +'<button class="lm-btn" id="lmBtn" onclick="loadMore()">LOAD MORE</button>'
    +'<noscript>'+noscriptCards+'</noscript>'
    +'<div style="margin-top:28px;display:flex;flex-direction:column;gap:8px">'
    +'<a href="/best-coffee-'+citySlug+'" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;text-decoration:none;color:rgba(255,255,255,0.5);font-size:13px">Best Coffee '+esc(cityDisplay)+' &rarr;</a>'
    +'<a href="/best-latte-'+citySlug+'" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;text-decoration:none;color:rgba(255,255,255,0.5);font-size:13px">Best Latte '+esc(cityDisplay)+' &rarr;</a>'
    +'<a href="/must-visit-cafes" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:rgba(230,192,115,0.03);border:1px solid rgba(230,192,115,0.12);border-radius:14px;text-decoration:none;color:#E6C073;font-size:13px">Must Visit Cafes (7.5+) &rarr;</a>'
    +'<a href="/explore" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;text-decoration:none;color:rgba(255,255,255,0.5);font-size:13px">Explore &rarr;</a></div>'
    +'<footer class="ft"><p>&copy; '+year+' Our Fair Dinkum Koffee Review</p><div style="margin-top:10px"><a href="/leaderboard">Leaderboard</a><a href="/explore">Explore</a><a href="/blog">Blog</a></div></footer></div>'
    +'<script>var AC='+cafeData+';var page=0;var PP=10;function gc(s){if(s>=9.1)return"#ffffff";if(s>=8.1)return"#4ade80";if(s>=7.5)return"#2dd4bf";if(s>=7.1)return"#2dd4bf";if(s>=6.5)return"#facc15";if(s>=6.1)return"#facc15";if(s>=5.5)return"#fb923c";if(s>=5.1)return"#fb923c";return"#f87171";}function gv(s){if(s>=9.1)return"ELITE";if(s>=8.1)return"GREAT";if(s>=7.5)return"MUST VISIT";if(s>=7.1)return"SOLID";if(s>=6.5)return"DECENT";if(s>=6.1)return"TAKE OR LEAVE";if(s>=5.5)return"AVERAGE";if(s>=5.1)return"JUST OKAY";if(s>=4.1)return"NOT FOR US";return"AVOID";}function ms(n,s){return(n+"-"+s).toLowerCase().replace(/[^a-z0-9\\s-]/g,"").replace(/\\s+/g,"-").replace(/-+/g,"-").trim();}function render(){var show=AC.slice(0,(page+1)*PP);var h="";show.forEach(function(c,i){var col=gc(c.sc);var v=gv(c.sc);var slug=ms(c.n,c.s);h+=\'<a href="/review/\'+slug+\'" style="display:flex;align-items:center;gap:14px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;padding:14px 18px;margin-bottom:8px;text-decoration:none;color:inherit"><div style="font-size:12px;color:rgba(255,255,255,0.25);width:22px;text-align:center;flex-shrink:0">\'+(i+1)+\'</div><div style="width:44px;height:44px;border-radius:50%;border:2px solid \'+col+\';display:flex;align-items:center;justify-content:center;flex-shrink:0"><span style="font-family:Bebas Neue,sans-serif;font-size:18px;color:\'+col+\'">\'+c.sc.toFixed(1)+\'</span></div><div style="flex:1;min-width:0"><div style="font-size:14px;font-weight:600;color:#fff">\'+c.n+\'</div><div style="font-size:11px;color:rgba(255,255,255,0.35)">\'+c.s+(c.c?", "+c.c:"")+\' &middot; \'+c.ps+\'</div></div><div style="text-align:center;flex-shrink:0"><div style="padding:3px 10px;border-radius:20px;font-size:9px;font-weight:700;letter-spacing:1px;background:rgba(74,222,128,0.08);color:#4ade80;border:1px solid rgba(74,222,128,0.2)">VALUE</div><div style="font-size:10px;color:rgba(255,255,255,0.3);margin-top:2px">\'+c.v.toFixed(1)+\' pts/\'+c.ps+\'</div></div></a>\';});document.getElementById("cl").innerHTML=h;if(AC.length<=PP){document.getElementById("countLabel").textContent="";document.getElementById("lmBtn").style.display="none";}else{document.getElementById("countLabel").textContent="Showing "+show.length+" of "+AC.length;var btn=document.getElementById("lmBtn");if(show.length<AC.length){btn.style.display="block";btn.textContent="LOAD "+Math.min(PP,AC.length-show.length)+" MORE";}else btn.style.display="none";}}function loadMore(){page++;render();}render();<\/script></body></html>';

    res.setHeader("Content-Type","text/html; charset=utf-8");
    res.setHeader("Cache-Control","public, s-maxage=3600, stale-while-revalidate=86400");
    res.status(200).send(html);
  }catch(e){res.status(500).send("Error");}
}
