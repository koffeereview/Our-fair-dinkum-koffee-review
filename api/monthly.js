const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYEU8Khk3R5I879v3FcXPqhq0aCXa2ZWM1BwwJOyUitx2Boak_AFTOkwvB8qQrKIeU55NM4htFjHbI/pub?gid=0&single=true&output=csv";
const SPAIN = ["barcelona","catalonia","spain"];
function esc(s){return(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
function splitCSV(line){var r=[],c="",q=false;for(var i=0;i<line.length;i++){var ch=line[i];if(ch==='"')q=!q;else if(ch===","&&!q){r.push(c.trim());c="";}else c+=ch;}r.push(c.trim());return r;}
function makeSlug(n,s){return(n+"-"+s).toLowerCase().replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-").trim();}
function gc(s){if(s>=9.1)return"#ffffff";if(s>=8.1)return"#4ade80";if(s>=7.5)return"#2dd4bf";if(s>=7.1)return"#2dd4bf";if(s>=6.5)return"#facc15";if(s>=6.1)return"#facc15";if(s>=5.5)return"#fb923c";if(s>=5.1)return"#fb923c";return"#f87171";}
function gv(s){if(s>=9.1)return"ELITE";if(s>=8.1)return"GREAT";if(s>=7.5)return"MUST VISIT";if(s>=7.1)return"SOLID";if(s>=6.5)return"DECENT";if(s>=6.1)return"TAKE OR LEAVE";if(s>=5.5)return"AVERAGE";if(s>=5.1)return"JUST OKAY";if(s>=4.1)return"NOT FOR US";return"AVOID";}
var MONTH_NAMES=["January","February","March","April","May","June","July","August","September","October","November","December"];
var CSS='*{margin:0;padding:0;box-sizing:border-box}body{background:#0a0a0c;color:#e2e8f0;font-family:DM Sans,sans-serif;-webkit-font-smoothing:antialiased}.c{max-width:620px;margin:0 auto;padding:0 20px 60px}.nav{display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid rgba(255,255,255,0.06)}.nav-logo{display:flex;align-items:center;gap:10px;text-decoration:none}.nav-logo img{width:34px;height:34px;border-radius:50%}.nav-logo span{font-family:Bebas Neue,sans-serif;font-size:15px;letter-spacing:3px;color:#E6C073}.nav-links{display:flex;gap:14px}.nav-links a{font-size:12px;color:rgba(255,255,255,0.45);text-decoration:none}.ft{margin-top:32px;padding:20px 0;border-top:1px solid rgba(255,255,255,0.04);text-align:center;font-size:11px;color:rgba(255,255,255,0.3)}.ft a{color:rgba(255,255,255,0.5);text-decoration:none;margin:0 8px}';

export default async function handler(req,res){
  try{
    var month=req.query.month||"";
    var response=await fetch(SHEET_URL);var text=await response.text();
    var lines=text.split("\n").filter(function(l){return l.trim();});
    var h=splitCSV(lines[0]).map(function(x){return x.trim().toLowerCase();});
    var ni=h.indexOf("name"),si=h.indexOf("suburb"),ci=h.indexOf("city"),sci=h.indexOf("score"),noi=h.indexOf("notes"),di=h.indexOf("date_reviewed");
    // Fallback: try "date" column if "date_reviewed" not found
    if(di===-1)di=h.indexOf("date");
    var cafes=[];
    for(var i=1;i<lines.length;i++){try{var p=splitCSV(lines[i]);var n=(p[ni]||"").trim();if(!n)continue;var sc=parseFloat(p[sci])||0;if(sc<=0)continue;
    var city=(p[ci]||"").trim();if(SPAIN.indexOf(city.toLowerCase())!==-1)continue;
    var dateStr=di>=0?(p[di]||"").trim():"";
    cafes.push({n:n,s:(p[si]||"").trim(),c:city,sc:sc,nt:((p[noi]||"").trim()).substring(0,80),sl:makeSlug(n,(p[si]||"").trim()),dt:dateStr});}catch(e){}}

    // Group cafes by month (YYYY-MM)
    var monthMap={};
    cafes.forEach(function(c){
      if(!c.dt)return;
      // Support formats: YYYY-MM-DD, DD/MM/YYYY, D/M/YYYY
      var parts;var ym="";
      if(c.dt.indexOf("-")>-1){parts=c.dt.split("-");if(parts[0].length===4)ym=parts[0]+"-"+parts[1];}
      else if(c.dt.indexOf("/")>-1){parts=c.dt.split("/");if(parts.length===3){var yr=parts[2].length===4?parts[2]:"20"+parts[2];var mn=parts[1].length===1?"0"+parts[1]:parts[1];ym=yr+"-"+mn;}}
      if(!ym||ym.length<7)return;
      if(!monthMap[ym])monthMap[ym]=[];
      monthMap[ym].push(c);
    });

    var year=new Date().getFullYear();
    var NAV='<nav class="nav"><a href="/" class="nav-logo"><img src="/logo.webp" alt="KR"><span>KOFFEE REVIEW</span></a><div class="nav-links"><a href="/explore">Explore</a><a href="/leaderboard">Leaderboard</a></div></nav>';
    var FT='<footer class="ft"><a href="/explore">Explore</a><a href="/leaderboard">Leaderboard</a><a href="/blog">Blog</a></footer>';
    res.setHeader("Content-Type","text/html; charset=utf-8");
    res.setHeader("Cache-Control","public, s-maxage=3600, stale-while-revalidate=86400");

    // INDEX PAGE
    if(!month){
      var allMonths=Object.keys(monthMap).sort().reverse();
      var totalDated=cafes.filter(function(c){return c.dt;}).length;

      if(allMonths.length===0){
        return res.status(200).send('<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Monthly Recaps | Koffee Review</title><link rel="icon" href="/logo.webp"><link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"><style>'+CSS+'</style></head><body><div class="c">'+NAV
          +'<div style="padding:28px 0 20px"><div style="font-size:10px;letter-spacing:3px;color:rgba(230,192,115,0.5);margin-bottom:8px">MONTHLY RECAPS</div><h1 style="font-family:Bebas Neue,sans-serif;font-size:clamp(28px,7vw,44px);letter-spacing:2px;color:#fff">Review Recaps</h1>'
          +'<p style="font-size:14px;color:rgba(255,255,255,0.45);margin-top:10px;line-height:1.6">Monthly recaps are coming soon. To enable them, add a <strong style="color:#E6C073">date_reviewed</strong> column to your Google Sheet with the date you reviewed each cafe (format: YYYY-MM-DD or DD/MM/YYYY).</p></div>'
          +'<a href="/explore" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:rgba(230,192,115,0.03);border:1px solid rgba(230,192,115,0.12);border-radius:14px;text-decoration:none;color:#E6C073;font-size:13px;margin-top:20px">Explore &rarr;</a>'
          +FT+'</div></body></html>');
      }

      var monthCards=allMonths.map(function(ym){
        var parts=ym.split("-");var yr=parseInt(parts[0]);var mn=parseInt(parts[1])-1;
        var monthName=MONTH_NAMES[mn]||"";
        var reviews=monthMap[ym];
        var sorted=reviews.sort(function(a,b){return b.sc-a.sc;});
        var avg=sorted.reduce(function(sum,c){return sum+c.sc;},0)/sorted.length;
        var best=sorted[0];var worst=sorted[sorted.length-1];
        var mustVisit=sorted.filter(function(c){return c.sc>=7.5;}).length;
        var avgCol=gc(avg);
        return'<a href="/monthly/'+ym+'" style="display:block;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:20px;margin-bottom:10px;text-decoration:none;color:inherit;transition:border 0.2s" onmouseover="this.style.borderColor=\'rgba(230,192,115,0.25)\'" onmouseout="this.style.borderColor=\'rgba(255,255,255,0.06)\'">'
          +'<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px"><div style="font-family:Bebas Neue,sans-serif;font-size:22px;color:#fff;letter-spacing:1px">'+monthName+' '+yr+'</div><div style="font-family:Bebas Neue,sans-serif;font-size:28px;color:#E6C073">'+reviews.length+'</div></div>'
          +'<div style="display:flex;gap:16px;font-size:12px;color:rgba(255,255,255,0.4)">'
          +'<span>Avg: <span style="color:'+avgCol+'">'+avg.toFixed(1)+'</span></span>'
          +'<span>Best: <span style="color:'+gc(best.sc)+'">'+best.sc.toFixed(1)+'</span></span>'
          +'<span>Worst: <span style="color:'+gc(worst.sc)+'">'+worst.sc.toFixed(1)+'</span></span>'
          +(mustVisit>0?'<span style="color:#2dd4bf">'+mustVisit+' Must Visit</span>':'')
          +'</div></a>';
      }).join("");

      return res.status(200).send('<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Monthly Recaps '+year+' | Koffee Review</title><meta name="description" content="Every month of cafe reviews, summarised. '+totalDated+' dated reviews across '+allMonths.length+' months. Best, worst, and averages."><link rel="canonical" href="https://koffeereview.com.au/monthly"><link rel="icon" href="/logo.webp"><link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"><style>'+CSS+'</style></head><body><div class="c">'+NAV
        +'<div style="padding:28px 0 20px"><div style="font-size:10px;letter-spacing:3px;color:rgba(230,192,115,0.5);margin-bottom:8px">MONTHLY RECAPS</div><h1 style="font-family:Bebas Neue,sans-serif;font-size:clamp(28px,7vw,44px);letter-spacing:2px;color:#fff">Review Recaps</h1><p style="font-size:14px;color:rgba(255,255,255,0.45);margin-top:10px;line-height:1.6">Every month of reviews, summarised. Best finds, worst disappointments, and the numbers.</p></div>'
        +'<div style="display:flex;gap:0;margin-bottom:24px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:14px;overflow:hidden"><div style="flex:1;text-align:center;padding:14px 8px;border-right:1px solid rgba(255,255,255,0.03)"><div style="font-family:Bebas Neue,sans-serif;font-size:26px;color:#E6C073">'+allMonths.length+'</div><div style="font-size:9px;letter-spacing:2px;color:rgba(255,255,255,0.3)">MONTHS</div></div><div style="flex:1;text-align:center;padding:14px 8px;border-right:1px solid rgba(255,255,255,0.03)"><div style="font-family:Bebas Neue,sans-serif;font-size:26px;color:#E6C073">'+totalDated+'</div><div style="font-size:9px;letter-spacing:2px;color:rgba(255,255,255,0.3)">DATED REVIEWS</div></div><div style="flex:1;text-align:center;padding:14px 8px"><div style="font-family:Bebas Neue,sans-serif;font-size:26px;color:#E6C073">600+</div><div style="font-size:9px;letter-spacing:2px;color:rgba(255,255,255,0.3)">TOTAL</div></div></div>'
        +monthCards
        +'<div style="margin-top:20px"><a href="/explore" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:rgba(230,192,115,0.03);border:1px solid rgba(230,192,115,0.12);border-radius:14px;text-decoration:none;color:#E6C073;font-size:13px">Explore &rarr;</a></div>'
        +FT+'</div></body></html>');
    }

    // INDIVIDUAL MONTH PAGE
    var reviews=monthMap[month];
    if(!reviews||!reviews.length)return res.status(404).send('<!DOCTYPE html><html><head><title>Not Found</title><meta name="robots" content="noindex"></head><body style="background:#0a0a0c;color:#fff;font-family:sans-serif;text-align:center;padding:60px"><h1 style="color:#E6C073">Month Not Found</h1><a href="/monthly" style="color:#E6C073">All Months &rarr;</a></body></html>');

    var parts=month.split("-");var yr=parseInt(parts[0]);var mn=parseInt(parts[1])-1;
    var monthName=MONTH_NAMES[mn]||"";
    var sorted=reviews.sort(function(a,b){return b.sc-a.sc;});
    var avg=sorted.reduce(function(sum,c){return sum+c.sc;},0)/sorted.length;
    var best=sorted[0];var worst=sorted[sorted.length-1];
    var mustVisit=sorted.filter(function(c){return c.sc>=7.5;});
    var avoid=sorted.filter(function(c){return c.sc<5.0;});

    // Summary section
    var summary='<div style="padding:18px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;margin-bottom:20px;font-size:14px;color:rgba(255,255,255,0.55);line-height:1.8">'
      +sorted.length+' cafes reviewed in '+monthName+'. Average score: <span style="color:'+gc(avg)+'">'+avg.toFixed(1)+'</span>. '
      +'Best find: <a href="/review/'+best.sl+'" style="color:#E6C073;text-decoration:none">'+esc(best.n)+'</a> ('+best.sc.toFixed(1)+'). '
      +'Lowest: <a href="/review/'+worst.sl+'" style="color:#E6C073;text-decoration:none">'+esc(worst.n)+'</a> ('+worst.sc.toFixed(1)+').'
      +(mustVisit.length>0?' <span style="color:#2dd4bf">'+mustVisit.length+' cafe'+(mustVisit.length>1?"s":"")+' earned Must Visit.</span>':'')
      +(avoid.length>0?' <span style="color:#f87171">'+avoid.length+' fell below 5.0.</span>':'')
      +'</div>';

    var cards=sorted.map(function(c,i){
      var col=gc(c.sc);var v=gv(c.sc);
      return'<a href="/review/'+c.sl+'" style="display:flex;align-items:center;gap:14px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;padding:14px 18px;margin-bottom:8px;text-decoration:none;color:inherit;transition:border 0.2s" onmouseover="this.style.borderColor=\'rgba(230,192,115,0.25)\'" onmouseout="this.style.borderColor=\'rgba(255,255,255,0.06)\'">'
        +'<div style="font-size:12px;color:rgba(255,255,255,0.3);width:22px;text-align:center;flex-shrink:0">'+(i+1)+'</div>'
        +'<div style="width:48px;height:48px;border-radius:50%;border:2px solid '+col+';display:flex;align-items:center;justify-content:center;flex-shrink:0"><span style="font-family:Bebas Neue,sans-serif;font-size:18px;color:'+col+'">'+c.sc.toFixed(1)+'</span></div>'
        +'<div style="flex:1;min-width:0"><div style="font-size:15px;font-weight:600;color:#fff">'+esc(c.n)+'</div>'
        +'<div style="font-size:11px;color:rgba(255,255,255,0.4);margin-top:2px">'+esc(c.s)+', '+esc(c.c)+'</div></div>'
        +'<div style="padding:3px 10px;border-radius:20px;font-size:9px;font-weight:700;letter-spacing:1.5px;background:'+col+'18;color:'+col+';border:1px solid '+col+'40;flex-shrink:0">'+v+'</div></a>';
    }).join("");

    // Prev/next month navigation
    var allMonths=Object.keys(monthMap).sort();
    var idx=allMonths.indexOf(month);
    var prev=idx>0?allMonths[idx-1]:"";
    var next=idx<allMonths.length-1?allMonths[idx+1]:"";
    var prevNext='<div style="display:flex;gap:8px;margin-top:20px">';
    if(prev){var pp=prev.split("-");prevNext+='<a href="/monthly/'+prev+'" style="flex:1;padding:13px 16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;text-decoration:none;color:rgba(255,255,255,0.5);font-size:13px">&larr; '+MONTH_NAMES[parseInt(pp[1])-1]+' '+pp[0]+'</a>';}
    if(next){var np=next.split("-");prevNext+='<a href="/monthly/'+next+'" style="flex:1;padding:13px 16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;text-decoration:none;color:rgba(255,255,255,0.5);font-size:13px;text-align:right">'+MONTH_NAMES[parseInt(np[1])-1]+' '+np[0]+' &rarr;</a>';}
    prevNext+='</div>';

    return res.status(200).send('<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+monthName+' '+yr+' Recap | Koffee Review</title><meta name="description" content="'+sorted.length+' cafes reviewed in '+monthName+' '+yr+'. Best: '+esc(best.n)+' ('+best.sc.toFixed(1)+'). Average: '+avg.toFixed(1)+'. Full recap with scores."><link rel="canonical" href="https://koffeereview.com.au/monthly/'+month+'"><link rel="icon" href="/logo.webp"><link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"><style>'+CSS+'</style></head><body><div class="c">'+NAV
      +'<div style="font-size:12px;color:rgba(255,255,255,0.35);padding:12px 0"><a href="/" style="color:#E6C073;text-decoration:none">Home</a> &middot; <a href="/monthly" style="color:#E6C073;text-decoration:none">Monthly</a> &middot; '+monthName+' '+yr+'</div>'
      +'<div style="padding:16px 0 20px"><div style="font-size:10px;letter-spacing:3px;color:rgba(230,192,115,0.5);margin-bottom:8px">MONTHLY RECAP</div><h1 style="font-family:Bebas Neue,sans-serif;font-size:clamp(26px,6vw,40px);letter-spacing:2px;color:#fff;margin-bottom:8px">'+monthName+' '+yr+'</h1><p style="font-size:14px;color:rgba(255,255,255,0.45);line-height:1.6">'+sorted.length+' new cafes reviewed. Ranked by score.</p></div>'
      +'<div style="display:flex;gap:0;margin-bottom:20px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:14px;overflow:hidden"><div style="flex:1;text-align:center;padding:14px 8px;border-right:1px solid rgba(255,255,255,0.03)"><div style="font-family:Bebas Neue,sans-serif;font-size:26px;color:#E6C073">'+sorted.length+'</div><div style="font-size:9px;letter-spacing:2px;color:rgba(255,255,255,0.3)">REVIEWED</div></div><div style="flex:1;text-align:center;padding:14px 8px;border-right:1px solid rgba(255,255,255,0.03)"><div style="font-family:Bebas Neue,sans-serif;font-size:26px;color:'+gc(avg)+'">'+avg.toFixed(1)+'</div><div style="font-size:9px;letter-spacing:2px;color:rgba(255,255,255,0.3)">AVG SCORE</div></div><div style="flex:1;text-align:center;padding:14px 8px"><div style="font-family:Bebas Neue,sans-serif;font-size:26px;color:'+gc(best.sc)+'">'+best.sc.toFixed(1)+'</div><div style="font-size:9px;letter-spacing:2px;color:rgba(255,255,255,0.3)">BEST</div></div></div>'
      +summary+cards+prevNext
      +'<div style="margin-top:16px;display:flex;flex-direction:column;gap:8px"><a href="/monthly" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;text-decoration:none;color:rgba(255,255,255,0.5);font-size:13px">All Months &rarr;</a><a href="/explore" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:rgba(230,192,115,0.03);border:1px solid rgba(230,192,115,0.12);border-radius:14px;text-decoration:none;color:#E6C073;font-size:13px">Explore &rarr;</a></div>'
      +FT+'</div></body></html>');
  }catch(e){res.status(500).send("Error: "+(e.message||"unknown"));}
}
