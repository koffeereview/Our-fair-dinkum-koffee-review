const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYEU8Khk3R5I879v3FcXPqhq0aCXa2ZWM1BwwJOyUitx2Boak_AFTOkwvB8qQrKIeU55NM4htFjHbI/pub?gid=0&single=true&output=csv";
const SPAIN = ["barcelona","catalonia","spain"];
function esc(s){return(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
function splitCSV(line){var r=[],c="",q=false;for(var i=0;i<line.length;i++){var ch=line[i];if(ch==='"')q=!q;else if(ch===","&&!q){r.push(c.trim());c="";}else c+=ch;}r.push(c.trim());return r;}
function makeSlug(n,s){return(n+"-"+s).toLowerCase().replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-").trim();}
function gc(s){if(s>=9.1)return"#ffffff";if(s>=8.1)return"#4ade80";if(s>=7.5)return"#2dd4bf";if(s>=7.1)return"#2dd4bf";if(s>=6.5)return"#facc15";if(s>=6.1)return"#facc15";if(s>=5.5)return"#fb923c";if(s>=5.1)return"#fb923c";return"#f87171";}
function gv(s){if(s>=9.1)return"ELITE";if(s>=8.1)return"GREAT";if(s>=7.5)return"MUST VISIT";if(s>=7.1)return"SOLID";if(s>=6.5)return"DECENT";if(s>=6.1)return"TAKE OR LEAVE";if(s>=5.5)return"AVERAGE";if(s>=5.1)return"JUST OKAY";if(s>=4.1)return"NOT FOR US";return"AVOID";}
function dist(a,b){var R=6371;var dLat=(b.lat-a.lat)*Math.PI/180;var dLon=(b.lng-a.lng)*Math.PI/180;var x=Math.sin(dLat/2)*Math.sin(dLat/2)+Math.cos(a.lat*Math.PI/180)*Math.cos(b.lat*Math.PI/180)*Math.sin(dLon/2)*Math.sin(dLon/2);return R*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x));}

function narrative(a,b){
  var diff=Math.abs(a.sc-b.sc);var winner=a.sc>=b.sc?a:b;var loser=a.sc>=b.sc?b:a;
  if(diff>=2.0)return esc(winner.n)+" dominates this comparison with a "+diff.toFixed(1)+" point lead. It is not close. "+esc(winner.n)+" delivers a significantly better cup across the board.";
  if(diff>=1.0)return esc(winner.n)+" takes a clear lead with "+winner.sc.toFixed(1)+"/10 versus "+loser.sc.toFixed(1)+"/10. A "+diff.toFixed(1)+" point gap means a noticeable difference in the cup.";
  if(diff>=0.5)return "Close battle. "+esc(winner.n)+" edges ahead at "+winner.sc.toFixed(1)+"/10 versus "+loser.sc.toFixed(1)+"/10. The difference is real but subtle.";
  return "Nearly identical scores. "+esc(a.n)+" ("+a.sc.toFixed(1)+") and "+esc(b.n)+" ("+b.sc.toFixed(1)+") are within "+diff.toFixed(1)+" points. Both are solid options.";
}

export default async function handler(req,res){
  try{
    var slug=req.query.slug||"";
    var response=await fetch(SHEET_URL);var text=await response.text();
    var lines=text.split("\n").filter(function(l){return l.trim();});
    var h=splitCSV(lines[0]).map(function(x){return x.trim().toLowerCase();});
    var ni=h.indexOf("name"),si=h.indexOf("suburb"),ci=h.indexOf("city"),sci=h.indexOf("score"),noi=h.indexOf("notes"),lati=h.indexOf("lat"),lngi=h.indexOf("lng");
    var cafes=[];
    for(var i=1;i<lines.length;i++){try{var p=splitCSV(lines[i]);var n=(p[ni]||"").trim();if(!n)continue;var sc=parseFloat(p[sci])||0;if(sc<=0)continue;
    var city=(p[ci]||"").trim();if(SPAIN.indexOf(city.toLowerCase())!==-1)continue;
    var lat=parseFloat(p[lati])||0;var lng=parseFloat(p[lngi])||0;
    cafes.push({n:n,s:(p[si]||"").trim(),c:city,sc:sc,nt:((p[noi]||"").trim()).substring(0,100),sl:makeSlug(n,(p[si]||"").trim()),lat:lat,lng:lng});}catch(e){}}

    var year=new Date().getFullYear();
    res.setHeader("Content-Type","text/html; charset=utf-8");
    res.setHeader("Cache-Control","public, s-maxage=3600, stale-while-revalidate=86400");

    // Find both cafes from the slug
    if(!slug||slug.indexOf("-vs-")===-1){
      return res.status(404).send('<!DOCTYPE html><html><head><title>Not Found</title><meta name="robots" content="noindex"></head><body style="background:#111827;color:#fff;font-family:sans-serif;text-align:center;padding:60px"><h1 style="color:#E6C073">Comparison Not Found</h1><a href="/explore" style="color:#E6C073">&larr; Explore</a></body></html>');
    }

    // Try to match cafes by slug
    var cafeA=null,cafeB=null;
    for(var i=0;i<cafes.length;i++){
      for(var j=i+1;j<cafes.length;j++){
        var pair=[cafes[i].sl,cafes[j].sl].sort();
        var testSlug=pair[0]+"-vs-"+pair[1];
        if(testSlug===slug){cafeA=cafes[i];cafeB=cafes[j];break;}
      }
      if(cafeA)break;
    }

    if(!cafeA||!cafeB){
      return res.status(404).send('<!DOCTYPE html><html><head><title>Not Found</title><meta name="robots" content="noindex"></head><body style="background:#111827;color:#fff;font-family:sans-serif;text-align:center;padding:60px"><h1 style="color:#E6C073">Cafes Not Found</h1><p style="color:rgba(255,255,255,0.4)">One or both cafes could not be matched.</p><a href="/explore" style="color:#E6C073">&larr; Explore</a></body></html>');
    }

    var winner=cafeA.sc>=cafeB.sc?cafeA:cafeB;
    var loser=cafeA.sc>=cafeB.sc?cafeB:cafeA;
    var diff=Math.abs(cafeA.sc-cafeB.sc);
    var colA=gc(cafeA.sc),colB=gc(cafeB.sc);
    var vA=gv(cafeA.sc),vB=gv(cafeB.sc);
    var sameSub=cafeA.s.toLowerCase()===cafeB.s.toLowerCase();
    var distance=(cafeA.lat&&cafeB.lat)?dist(cafeA,cafeB).toFixed(1):"";
    var story=narrative(cafeA,cafeB);

    var title=esc(cafeA.n)+" vs "+esc(cafeB.n)+" | Coffee Comparison | Koffee Review";
    var desc="We reviewed both "+esc(cafeA.n)+" ("+cafeA.sc.toFixed(1)+"/10) and "+esc(cafeB.n)+" ("+cafeB.sc.toFixed(1)+"/10) with the same order. One latte, one double shot. Here is the comparison.";
    var canonical="https://koffeereview.com.au/vs/"+slug;

    var html='<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
    +'<title>'+title+'</title><meta name="description" content="'+esc(desc)+'">'
    +'<link rel="canonical" href="'+canonical+'"><link rel="icon" href="/logo.webp">'
    +'<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">'
    +'<style>*{margin:0;padding:0;box-sizing:border-box}body{background:#111827;color:#e2e8f0;font-family:DM Sans,sans-serif;-webkit-font-smoothing:antialiased}.c{max-width:620px;margin:0 auto;padding:0 20px 60px}.nav{display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid rgba(255,255,255,0.08)}.nav-logo{display:flex;align-items:center;gap:10px;text-decoration:none}.nav-logo img{width:34px;height:34px;border-radius:50%}.nav-logo span{font-family:Bebas Neue,sans-serif;font-size:15px;letter-spacing:3px;color:#E6C073}.nav-links{display:flex;gap:14px}.nav-links a{font-size:12px;color:rgba(255,255,255,0.45);text-decoration:none}.vs-grid{display:grid;grid-template-columns:1fr auto 1fr;gap:12px;align-items:center;margin:24px 0}.vs-card{text-align:center;padding:24px 16px;background:rgba(255,255,255,0.04);border:2px solid rgba(255,255,255,0.08);border-radius:18px}.vs-card.winner{border-color:rgba(74,222,128,0.3);background:rgba(74,222,128,0.04)}.vs-txt{font-family:Bebas Neue,sans-serif;font-size:24px;color:rgba(230,192,115,0.3);letter-spacing:4px}.cat-row{display:flex;justify-content:space-between;align-items:center;padding:14px 0;border-bottom:1px solid rgba(255,255,255,0.04)}.cat-label{font-size:13px;color:rgba(255,255,255,0.5);flex:1;text-align:center}.cat-val{font-family:Bebas Neue,sans-serif;font-size:20px;width:80px;text-align:center}.ft{margin-top:32px;padding:20px 0;border-top:1px solid rgba(255,255,255,0.06);text-align:center;font-size:11px;color:rgba(255,255,255,0.3)}.ft a{color:rgba(255,255,255,0.5);text-decoration:none;margin:0 8px}</style>'
    +'</head><body><div class="c"><nav class="nav"><a href="/" class="nav-logo"><img src="/logo.webp" alt="KR"><span>KOFFEE REVIEW</span></a><div class="nav-links"><a href="/compare">Compare</a><a href="/explore">Explore</a></div></nav>'
    +'<div style="text-align:center;padding:24px 0"><div style="font-size:10px;letter-spacing:3px;color:rgba(230,192,115,0.5);margin-bottom:8px">CAFE COMPARISON</div><h1 style="font-family:Bebas Neue,sans-serif;font-size:clamp(22px,5vw,32px);letter-spacing:1px;color:#fff">'+esc(cafeA.n)+' vs '+esc(cafeB.n)+'</h1><p style="font-size:13px;color:rgba(255,255,255,0.4);margin-top:6px">'+(sameSub?'Same suburb: '+esc(cafeA.s):''+esc(cafeA.s)+' vs '+esc(cafeB.s))+(distance?' &middot; '+distance+'km apart':'')+'</p></div>'
    // Score cards
    +'<div class="vs-grid"><div class="vs-card'+(cafeA.sc>=cafeB.sc?" winner":"")+'"><div style="font-family:Bebas Neue,sans-serif;font-size:48px;color:'+colA+'">'+cafeA.sc.toFixed(1)+'</div><div style="font-size:10px;color:rgba(255,255,255,0.3);margin-bottom:8px">/10</div><div style="font-size:15px;font-weight:600;color:#fff;margin-bottom:4px">'+esc(cafeA.n)+'</div><div style="font-size:11px;color:rgba(255,255,255,0.4)">'+esc(cafeA.s)+', '+esc(cafeA.c)+'</div><div style="display:inline-block;margin-top:10px;padding:4px 12px;border-radius:20px;font-size:9px;font-weight:700;letter-spacing:1.5px;background:'+colA+'18;color:'+colA+';border:1px solid '+colA+'40">'+vA+'</div></div>'
    +'<div class="vs-txt">VS</div>'
    +'<div class="vs-card'+(cafeB.sc>=cafeA.sc?" winner":"")+'"><div style="font-family:Bebas Neue,sans-serif;font-size:48px;color:'+colB+'">'+cafeB.sc.toFixed(1)+'</div><div style="font-size:10px;color:rgba(255,255,255,0.3);margin-bottom:8px">/10</div><div style="font-size:15px;font-weight:600;color:#fff;margin-bottom:4px">'+esc(cafeB.n)+'</div><div style="font-size:11px;color:rgba(255,255,255,0.4)">'+esc(cafeB.s)+', '+esc(cafeB.c)+'</div><div style="display:inline-block;margin-top:10px;padding:4px 12px;border-radius:20px;font-size:9px;font-weight:700;letter-spacing:1.5px;background:'+colB+'18;color:'+colB+';border:1px solid '+colB+'40">'+vB+'</div></div></div>'
    // Narrative
    +'<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;padding:18px;margin:16px 0"><p style="font-size:14px;color:rgba(255,255,255,0.65);line-height:1.7">'+story+'</p></div>'
    // Tasting notes comparison
    +(cafeA.nt||cafeB.nt?'<div style="margin:16px 0"><div style="font-family:Bebas Neue,sans-serif;font-size:12px;letter-spacing:3px;color:rgba(255,255,255,0.25);margin-bottom:10px">TASTING NOTES</div>'+(cafeA.nt?'<div style="padding:12px;background:rgba(255,255,255,0.02);border-radius:10px;margin-bottom:8px"><div style="font-size:12px;font-weight:600;color:'+colA+';margin-bottom:4px">'+esc(cafeA.n)+'</div><p style="font-size:13px;color:rgba(255,255,255,0.5);font-style:italic">'+esc(cafeA.nt)+'</p></div>':'')+(cafeB.nt?'<div style="padding:12px;background:rgba(255,255,255,0.02);border-radius:10px"><div style="font-size:12px;font-weight:600;color:'+colB+';margin-bottom:4px">'+esc(cafeB.n)+'</div><p style="font-size:13px;color:rgba(255,255,255,0.5);font-style:italic">'+esc(cafeB.nt)+'</p></div>':'')+'</div>':'')
    // Verdict
    +'<div style="text-align:center;padding:20px 0;border-top:1px solid rgba(255,255,255,0.04);margin-top:16px"><div style="font-family:Bebas Neue,sans-serif;font-size:12px;letter-spacing:3px;color:rgba(255,255,255,0.25);margin-bottom:10px">THE VERDICT</div><div style="font-size:16px;font-weight:600;color:#fff">'+esc(winner.n)+'</div><div style="font-size:13px;color:rgba(255,255,255,0.4);margin-top:4px">wins by '+diff.toFixed(1)+' points</div></div>'
    // Links
    +'<div style="margin-top:20px;display:flex;flex-direction:column;gap:8px">'
    +'<a href="/review/'+cafeA.sl+'" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:14px;text-decoration:none;color:#fff;font-size:13px">'+esc(cafeA.n)+' full review <span style="color:'+colA+'">'+cafeA.sc.toFixed(1)+'</span></a>'
    +'<a href="/review/'+cafeB.sl+'" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:14px;text-decoration:none;color:#fff;font-size:13px">'+esc(cafeB.n)+' full review <span style="color:'+colB+'">'+cafeB.sc.toFixed(1)+'</span></a>'
    +'<a href="/compare" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:rgba(230,192,115,0.03);border:1px solid rgba(230,192,115,0.12);border-radius:14px;text-decoration:none;color:#E6C073;font-size:13px">Compare any two cafes &rarr;</a>'
    +'<a href="/explore" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:14px;text-decoration:none;color:rgba(255,255,255,0.5);font-size:13px">Explore &rarr;</a></div>'
    +'<footer class="ft"><a href="/leaderboard">Leaderboard</a><a href="/explore">Explore</a><a href="/blog">Blog</a></footer></div></body></html>';

    res.status(200).send(html);
  }catch(e){res.status(500).send("Error: "+e.message);}
}
