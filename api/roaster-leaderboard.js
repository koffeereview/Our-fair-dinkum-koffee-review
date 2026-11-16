// ROASTER LEADERBOARD — server-rendered page ranking coffee roasters by cafe performance
// /api/roaster-leaderboard → roaster rankings by avg score, cafe count, and consistency
// Targets: "best coffee roasters Brisbane", "Merlo vs Coffee Supreme", "Australian coffee roasters ranked"

const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYEU8Khk3R5I879v3FcXPqhq0aCXa2ZWM1BwwJOyUitx2Boak_AFTOkwvB8qQrKIeU55NM4htFjHbI/pub?gid=0&single=true&output=csv";

function esc(s){return(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
function makeSlug(n,s){return(n+"-"+s).toLowerCase().replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-");}
function splitCSV(line){var r=[],c="",q=false;for(var i=0;i<line.length;i++){var ch=line[i];if(ch==='"')q=!q;else if(ch===","&&!q){r.push(c.trim());c="";}else c+=ch;}r.push(c.trim());return r;}
function getColor(s){if(s>=9)return"#ffffff";if(s>=8)return"#4ade80";if(s>=7.5)return"#2dd4bf";if(s>=7)return"#2dd4bf";if(s>=6.5)return"#facc15";if(s>=6)return"#facc15";if(s>=5.5)return"#fb923c";if(s>=5)return"#fb923c";return"#f87171";}
function getVerdict(s){if(s>=9.1)return"ELITE";if(s>=8.1)return"GREAT";if(s>=7.5)return"MUST VISIT";if(s>=7.1)return"SOLID";if(s>=6.5)return"DECENT";if(s>=6.1)return"TAKE OR LEAVE";if(s>=5.5)return"AVERAGE";if(s>=5.1)return"JUST OKAY";if(s>=4.1)return"NOT FOR US";return"AVOID";}
function getMedal(i){if(i===0)return'<span style="font-size:18px">🥇</span>';if(i===1)return'<span style="font-size:18px">🥈</span>';if(i===2)return'<span style="font-size:18px">🥉</span>';return'<span style="font-family:Bebas Neue,sans-serif;font-size:16px;color:rgba(255,255,255,0.3);min-width:28px;display:inline-block;text-align:center">'+(i+1)+'</span>';}

function parseCSV(text){
  var lines=text.split("\n").filter(function(l){return l&&l.trim();});
  if(lines.length<2)return[];
  var h=splitCSV(lines[0]).map(function(x){return x.trim().toLowerCase();});
  var idx={name:h.indexOf("name"),suburb:h.indexOf("suburb"),city:h.indexOf("city"),score:h.indexOf("score"),price:h.indexOf("price"),roaster:h.indexOf("roaster")};
  if(idx.name===-1||idx.suburb===-1)return[];
  var out=[];
  for(var i=1;i<lines.length;i++){try{var p=splitCSV(lines[i]);var n=p[idx.name]||"";var s=p[idx.suburb]||"";if(!n||!s)continue;var sc=parseFloat(p[idx.score])||0;if(sc<=0)continue;
  out.push({name:n,suburb:s,city:p[idx.city]||"",score:sc,price:p[idx.price]||"$$",roaster:(p[idx.roaster]||"").trim()});}catch(e){}}
  return out;
}

export default async function handler(req,res){
  try{
    var controller=new AbortController();var tid=setTimeout(function(){controller.abort();},10000);
    var response=await fetch(SHEET_URL,{signal:controller.signal});clearTimeout(tid);
    if(!response.ok)throw new Error("fail");
    var text=await response.text();var allCafes=parseCSV(text);

    // Build roaster map
    var roasterMap={};
    allCafes.forEach(function(c){
      if(!c.roaster)return;
      if(!roasterMap[c.roaster])roasterMap[c.roaster]={name:c.roaster,total:0,count:0,cafes:[],cities:{}};
      roasterMap[c.roaster].total+=c.score;
      roasterMap[c.roaster].count++;
      roasterMap[c.roaster].cafes.push({name:c.name,suburb:c.suburb,city:c.city,score:c.score,price:c.price,slug:makeSlug(c.name,c.suburb)});
      roasterMap[c.roaster].cities[c.city]=(roasterMap[c.roaster].cities[c.city]||0)+1;
    });

    // Calculate stats
    var allRoasters=Object.values(roasterMap).map(function(r){
      r.avg=r.total/r.count;
      r.best=Math.max.apply(null,r.cafes.map(function(c){return c.score;}));
      r.worst=Math.min.apply(null,r.cafes.map(function(c){return c.score;}));
      r.cafes.sort(function(a,b){return b.score-a.score;});
      r.topCity=Object.keys(r.cities).sort(function(a,b){return r.cities[b]-r.cities[a];})[0]||"";
      r.slug=r.name.toLowerCase().replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-");
      return r;
    });

    // Multi-cafe roasters (2+) sorted by avg — the main leaderboard
    var multiRoasters=allRoasters.filter(function(r){return r.count>=2;}).sort(function(a,b){return b.avg-a.avg;});
    // Single-cafe roasters sorted by score
    var singleRoasters=allRoasters.filter(function(r){return r.count===1;}).sort(function(a,b){return b.avg-a.avg;});
    // All roasters sorted by cafe count
    var byVolume=allRoasters.filter(function(r){return r.count>=2;}).sort(function(a,b){return b.count-a.count||b.avg-a.avg;});

    var totalCafes=allCafes.length;
    var withRoaster=allCafes.filter(function(c){return c.roaster;}).length;
    var uniqueRoasters=allRoasters.length;
    var topRoaster=multiRoasters[0];

    var title="Best Coffee Roasters in Australia 2026 | "+uniqueRoasters+" Roasters Ranked | Koffee Review";
    var desc="Which coffee roaster makes the best cafes? We ranked "+uniqueRoasters+" roasters across "+withRoaster+" cafes by average score. See who's winning and who's wasting good beans.";
    var canonical="https://koffeereview.com.au/roaster-leaderboard";

    var schemas='<script type="application/ld+json">'+JSON.stringify({"@context":"https://schema.org","@type":"WebPage","name":"Best Coffee Roasters in Australia","description":desc,"url":canonical,"publisher":{"@type":"Organization","name":"Koffee Review"}})+'<\/script>'
    +'<script type="application/ld+json">'+JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Koffee Review","item":"https://koffeereview.com.au"},{"@type":"ListItem","position":2,"name":"Roaster Leaderboard","item":canonical}]})+'<\/script>'
    +'<script type="application/ld+json">'+JSON.stringify({"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
      {"@type":"Question","name":"Which coffee roaster has the highest average score?","acceptedAnswer":{"@type":"Answer","text":topRoaster.name+" leads with a "+topRoaster.avg.toFixed(1)+" average across "+topRoaster.count+" cafes."}},
      {"@type":"Question","name":"How many coffee roasters has Koffee Review tracked?","acceptedAnswer":{"@type":"Answer","text":"We've identified "+uniqueRoasters+" different roasters across "+withRoaster+" of our "+totalCafes+"+ reviewed cafes."}},
      {"@type":"Question","name":"Which roaster supplies the most cafes?","acceptedAnswer":{"@type":"Answer","text":byVolume[0].name+" appears in "+byVolume[0].count+" of our reviewed cafes, averaging "+byVolume[0].avg.toFixed(1)+"/10."}},
      {"@type":"Question","name":"Does the roaster matter for coffee quality?","acceptedAnswer":{"@type":"Answer","text":"Beans matter, but execution matters more. Some roasters average 7+ across multiple cafes while others with great beans average under 5 — the barista makes the difference."}}
    ]})+'<\/script>';

    // Build roaster cards
    function buildRoasterCard(r,i,showRank){
      var col=getColor(r.avg);
      var verdict=getVerdict(r.avg);
      var rank=showRank?getMedal(i):'';
      var consistency=r.best-r.worst;
      var consLabel=consistency<=1?"Very Consistent":consistency<=2?"Consistent":consistency<=3?"Mixed":"Inconsistent";
      var consColor=consistency<=1?"#4ade80":consistency<=2?"#2dd4bf":consistency<=3?"#facc15":"#f87171";

      var cafeList=r.cafes.slice(0,5).map(function(c){
        var cc=getColor(c.score);
        return'<a href="/review/'+c.slug+'" style="display:flex;align-items:center;gap:8px;padding:6px 0;text-decoration:none;color:inherit;border-bottom:1px solid rgba(255,255,255,0.03)">'
          +'<span style="font-family:Bebas Neue,sans-serif;font-size:16px;color:'+cc+';min-width:32px">'+c.score.toFixed(1)+'</span>'
          +'<span style="font-size:12px;color:#fff;flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(c.name)+'</span>'
          +'<span style="font-size:11px;color:rgba(255,255,255,0.35)">'+esc(c.suburb)+'</span>'
          +'</a>';
      }).join("");
      var moreCount=r.cafes.length-5;
      if(moreCount>0)cafeList+='<div style="font-size:11px;color:rgba(255,255,255,0.3);padding:4px 0">+'+moreCount+' more</div>';

      return'<div id="'+r.slug+'" class="rc" style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;padding:18px 20px;transition:all 0.2s">'
        +'<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">'
        +'<div style="display:flex;align-items:center;gap:10px">'+rank+'<div><div style="font-size:15px;font-weight:700;color:#fff">'+esc(r.name)+'</div>'
        +'<div style="font-size:11px;color:rgba(255,255,255,0.4);margin-top:1px">'+r.count+' cafe'+(r.count>1?'s':'')+' · '+esc(r.topCity)+'</div></div></div>'
        +'<div style="text-align:right"><div style="font-family:Bebas Neue,sans-serif;font-size:32px;color:'+col+';line-height:1">'+r.avg.toFixed(1)+'</div>'
        +'<div style="font-size:9px;letter-spacing:1.5px;color:'+col+';opacity:0.8">'+verdict+'</div></div></div>'

        // Score bar
        +'<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">'
        +'<div style="height:4px;flex:1;border-radius:2px;background:rgba(255,255,255,0.06);overflow:hidden"><div style="height:100%;width:'+(r.avg*10)+'%;background:'+col+';border-radius:2px"></div></div>'
        +'</div>'

        // Stats row
        +'<div style="display:flex;gap:12px;margin-bottom:12px;flex-wrap:wrap">'
        +'<div style="font-size:11px;color:rgba(255,255,255,0.45)">Best: <span style="color:'+getColor(r.best)+'">'+r.best.toFixed(1)+'</span></div>'
        +'<div style="font-size:11px;color:rgba(255,255,255,0.45)">Worst: <span style="color:'+getColor(r.worst)+'">'+r.worst.toFixed(1)+'</span></div>'
        +'<div style="font-size:11px;color:rgba(255,255,255,0.45)">Range: <span style="color:'+consColor+'">'+consistency.toFixed(1)+' · '+consLabel+'</span></div>'
        +'</div>'

        // Cafe list
        +'<div style="border-top:1px solid rgba(255,255,255,0.04);padding-top:8px">'+cafeList+'</div>'
        +'</div>';
    }

    // Top 10 cards
    var top10Cards=multiRoasters.slice(0,10).map(function(r,i){return buildRoasterCard(r,i,true);}).join("");

    // Rest of multi-cafe roasters as compact rows
    var restRows=multiRoasters.slice(10).map(function(r,i){
      var col=getColor(r.avg);
      return'<a href="#'+r.slug+'" onclick="document.getElementById(\''+r.slug+'-exp\').style.display=document.getElementById(\''+r.slug+'-exp\').style.display===\'block\'?\'none\':\'block\';return false;" style="display:block;text-decoration:none;color:inherit;padding:10px 14px;border-radius:10px;border:1px solid rgba(255,255,255,0.04);background:rgba(255,255,255,0.02);margin-bottom:4px;transition:all 0.15s" onmouseover="this.style.borderColor=\'rgba(230,192,115,0.15)\'" onmouseout="this.style.borderColor=\'rgba(255,255,255,0.04)\'">'
        +'<div style="display:flex;align-items:center;justify-content:space-between">'
        +'<div style="display:flex;align-items:center;gap:8px"><span style="font-family:Bebas Neue,sans-serif;font-size:14px;color:rgba(255,255,255,0.3);min-width:24px">'+(i+11)+'</span>'
        +'<span style="font-size:13px;font-weight:600;color:#fff">'+esc(r.name)+'</span>'
        +'<span style="font-size:11px;color:rgba(255,255,255,0.35)">'+r.count+' cafes</span></div>'
        +'<span style="font-family:Bebas Neue,sans-serif;font-size:20px;color:'+col+'">'+r.avg.toFixed(1)+'</span></div>'
        +'<div id="'+r.slug+'-exp" style="display:none;margin-top:8px;padding-top:8px;border-top:1px solid rgba(255,255,255,0.04)">'
        +r.cafes.map(function(c){var cc=getColor(c.score);return'<a href="/review/'+c.slug+'" style="display:flex;align-items:center;gap:8px;padding:4px 0 4px 32px;text-decoration:none;color:inherit"><span style="font-family:Bebas Neue,sans-serif;font-size:14px;color:'+cc+';min-width:28px">'+c.score.toFixed(1)+'</span><span style="font-size:12px;color:rgba(255,255,255,0.6)">'+esc(c.name)+' — '+esc(c.suburb)+'</span></a>';}).join("")
        +'</div></a>';
    }).join("");

    // Volume leaderboard (top 10 by count)
    var volumeCards=byVolume.slice(0,10).map(function(r,i){
      var col=getColor(r.avg);
      return'<div style="display:flex;align-items:center;gap:12px;padding:10px 14px;border-radius:10px;border:1px solid rgba(255,255,255,0.04);background:rgba(255,255,255,0.02);margin-bottom:4px">'
        +'<span style="font-family:Bebas Neue,sans-serif;font-size:28px;color:#E6C073;min-width:32px">'+r.count+'</span>'
        +'<div style="flex:1"><div style="font-size:13px;font-weight:600;color:#fff">'+esc(r.name)+'</div>'
        +'<div style="font-size:11px;color:rgba(255,255,255,0.4)">'+esc(r.topCity)+'</div></div>'
        +'<span style="font-family:Bebas Neue,sans-serif;font-size:20px;color:'+col+'">'+r.avg.toFixed(1)+'</span></div>';
    }).join("");

    // Single-cafe roasters (top scorers)
    var singleCards=singleRoasters.slice(0,15).map(function(r){
      var c=r.cafes[0];var col=getColor(c.score);
      return'<a href="/review/'+c.slug+'" style="display:flex;align-items:center;gap:10px;padding:8px 14px;border-radius:10px;border:1px solid rgba(255,255,255,0.04);background:rgba(255,255,255,0.02);margin-bottom:4px;text-decoration:none;color:inherit;transition:all 0.15s" onmouseover="this.style.borderColor=\'rgba(230,192,115,0.15)\'" onmouseout="this.style.borderColor=\'rgba(255,255,255,0.04)\'">'
        +'<span style="font-family:Bebas Neue,sans-serif;font-size:20px;color:'+col+';min-width:32px">'+c.score.toFixed(1)+'</span>'
        +'<div style="flex:1;min-width:0"><div style="font-size:13px;font-weight:600;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(r.name)+'</div>'
        +'<div style="font-size:11px;color:rgba(255,255,255,0.4);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">at '+esc(c.name)+' · '+esc(c.suburb)+'</div></div></a>';
    }).join("");

    // Noscript fallback
    var noscriptList=multiRoasters.map(function(r){return'<div style="padding:4px 0;font-size:13px;color:#2dd4bf">'+r.avg.toFixed(1)+' — '+esc(r.name)+' ('+r.count+' cafes)</div>';}).join("");

    var html='<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+esc(title)+'</title><meta name="description" content="'+esc(desc)+'"><link rel="canonical" href="'+canonical+'"><link rel="alternate" hreflang="en-AU" href="'+canonical+'"><meta property="og:title" content="'+esc(title)+'"><meta property="og:description" content="'+esc(desc)+'"><meta property="og:url" content="'+canonical+'"><meta property="og:image" content="https://koffeereview.com.au/og-roasters.png"><link rel="icon" href="/logo.webp">'+schemas
    +'<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">'
    +'<style>'
    +'*{margin:0;padding:0;box-sizing:border-box}'
    +'body{font-family:"DM Sans",sans-serif;background:#0d0d0f;color:#d4d4d4;line-height:1.6}'
    +'.c{max-width:720px;margin:0 auto;padding:0 20px 60px}'
    +'.nav{display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid rgba(230,192,115,0.08)}.nav-logo{display:flex;align-items:center;gap:10px;text-decoration:none}.nav-logo img{width:34px;height:34px;border-radius:50%;border:1.5px solid rgba(230,192,115,0.25)}.nav-logo span{font-family:"Bebas Neue",sans-serif;font-size:15px;letter-spacing:3px;color:#E6C073}.nav-links{display:flex;gap:14px}.nav-links a{font-size:12px;color:rgba(255,255,255,0.45);text-decoration:none}.nav-links a:hover{color:#E6C073}'
    +'.hero{text-align:center;padding:32px 0 12px}.hero h1{font-family:"Bebas Neue",sans-serif;font-size:36px;letter-spacing:3px;color:#fff;margin-bottom:4px}.hero-sub{color:rgba(255,255,255,0.5);font-size:13px;letter-spacing:0.5px}'
    +'.gold-line{height:1px;background:linear-gradient(90deg,transparent,rgba(230,192,115,0.3),transparent);margin:16px 0}'
    +'.stats{display:flex;justify-content:center;gap:0;margin:0 auto 16px;max-width:480px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;overflow:hidden}.stat{flex:1;text-align:center;padding:14px 8px;border-right:1px solid rgba(255,255,255,0.04)}.stat:last-child{border:none}.stat-n{font-family:"Bebas Neue",sans-serif;font-size:28px;color:#E6C073;line-height:1}.stat-l{font-size:9px;letter-spacing:2px;color:rgba(255,255,255,0.35);margin-top:2px}'
    +'.section-title{font-family:"Bebas Neue",sans-serif;font-size:15px;letter-spacing:3px;color:rgba(255,255,255,0.45);margin:28px 0 14px}'
    +'.section-sub{font-size:12px;color:rgba(255,255,255,0.35);margin:-8px 0 14px}'
    +'.filter-row{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px}.fb{padding:6px 14px;border-radius:22px;border:1px solid rgba(255,255,255,0.06);background:transparent;color:rgba(255,255,255,0.45);font-size:11px;cursor:pointer;font-family:inherit;transition:all 0.2s;font-weight:500}.fb:hover{border-color:rgba(230,192,115,0.25);color:#E6C073}.fb.on{background:linear-gradient(135deg,rgba(230,192,115,0.15),rgba(230,192,115,0.05));border-color:rgba(230,192,115,0.3);color:#E6C073}'
    +'.rc{margin-bottom:10px}'
    +'.faq{margin-top:28px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.04)}.faq-t{font-family:"Bebas Neue",sans-serif;font-size:14px;letter-spacing:4px;color:#E6C073;margin-bottom:12px}.fi{margin-bottom:6px;border:1px solid rgba(255,255,255,0.06);border-radius:10px;overflow:hidden}.fi[open]{border-color:rgba(230,192,115,0.2)}.fq{padding:12px 14px;font-size:13px;font-weight:600;color:#fff;cursor:pointer;list-style:none}.fq::-webkit-details-marker{display:none}.fq::after{content:"+";color:#E6C073;font-size:14px;float:right}.fi[open] .fq::after{content:"-"}.fa{padding:0 14px 12px;font-size:13px;color:rgba(255,255,255,0.55);line-height:1.7}'
    +'.ft{margin-top:36px;padding-top:18px;border-top:1px solid rgba(255,255,255,0.04);text-align:center;font-size:11px;color:rgba(255,255,255,0.35)}.ft a{color:rgba(255,255,255,0.5);text-decoration:none;margin:0 8px}'
    +'.intro{font-size:13px;color:rgba(255,255,255,0.55);line-height:1.8;margin-bottom:20px;max-width:600px}'
    +'@media(max-width:600px){.hero h1{font-size:26px}.stats{max-width:100%;flex-wrap:wrap}.stat{min-width:33%}}'
    +'</style></head><body><div class="c">'

    // Nav
    +'<nav class="nav"><a href="/" class="nav-logo"><img src="/logo.webp" alt="KR"><span>KOFFEE REVIEW</span></a><div class="nav-links"><a href="/map">Map</a><a href="/compare">Compare</a><a href="/blog">Blog</a><a href="/leaderboard">Leaderboard</a></div></nav>'

    // Hero
    +'<header class="hero"><h1>ROASTER LEADERBOARD</h1><p class="hero-sub">'+uniqueRoasters+' roasters ranked by cafe performance across '+withRoaster+' reviews &middot; 2026</p></header>'
    +'<div class="gold-line"></div>'

    // Stats
    +'<div class="stats">'
    +'<div class="stat"><div class="stat-n">'+uniqueRoasters+'</div><div class="stat-l">ROASTERS</div></div>'
    +'<div class="stat"><div class="stat-n">'+withRoaster+'</div><div class="stat-l">CAFES TRACKED</div></div>'
    +'<div class="stat"><div class="stat-n">'+topRoaster.avg.toFixed(1)+'</div><div class="stat-l">TOP AVG</div></div>'
    +'<div class="stat"><div class="stat-n">'+byVolume[0].count+'</div><div class="stat-l">MOST CAFES</div></div>'
    +'</div>'

    // Intro
    +'<p class="intro">Which roaster makes the best cafes? We tracked every roaster across '+withRoaster+' reviewed cafes to find out. Roasters are ranked by the average score of all cafes using their beans — because great beans only count if they\'re pulled right.</p>'

    // Filter buttons
    +'<div class="filter-row">'
    +'<button class="fb on" onclick="showTab(\'quality\')">By Quality</button>'
    +'<button class="fb" onclick="showTab(\'volume\')">By Volume</button>'
    +'<button class="fb" onclick="showTab(\'single\')">One-Cafe Roasters</button>'
    +'</div>'

    // Tab: Quality (default)
    +'<div id="tab-quality">'
    +'<div class="section-title">TOP 10 ROASTERS BY AVERAGE SCORE</div>'
    +'<div class="section-sub">Minimum 2 cafes reviewed</div>'
    +top10Cards

    // Rest of multi-cafe roasters
    +(multiRoasters.length>10?'<div class="section-title" style="margin-top:24px">ALL OTHER RANKED ROASTERS</div>'+restRows:'')
    +'</div>'

    // Tab: Volume
    +'<div id="tab-volume" style="display:none">'
    +'<div class="section-title">MOST POPULAR ROASTERS</div>'
    +'<div class="section-sub">Ranked by number of cafes using their beans</div>'
    +volumeCards
    +'</div>'

    // Tab: Single cafe
    +'<div id="tab-single" style="display:none">'
    +'<div class="section-title">TOP SINGLE-CAFE ROASTERS</div>'
    +'<div class="section-sub">Only appeared in one reviewed cafe — watch this space</div>'
    +singleCards
    +'</div>'

    // FAQ
    +'<div class="faq"><div class="faq-t">FAQ</div>'
    +'<details class="fi"><summary class="fq">Which coffee roaster has the highest average score?</summary><div class="fa">'+esc(topRoaster.name)+' leads with a '+topRoaster.avg.toFixed(1)+' average across '+topRoaster.count+' cafes. Only roasters with 2+ reviewed cafes are ranked.</div></details>'
    +'<details class="fi"><summary class="fq">Does the roaster really matter?</summary><div class="fa">Beans set the ceiling, but the barista decides where the cup lands. Some roasters average 7+ across multiple cafes while others with medal-winning beans average under 5. The roaster gives you potential — execution gives you the cup.</div></details>'
    +'<details class="fi"><summary class="fq">How is consistency measured?</summary><div class="fa">We calculate the range between a roaster\'s best and worst cafe score. A range under 1.0 is "Very Consistent," 1-2 is "Consistent," 2-3 is "Mixed," and above 3 is "Inconsistent." A tight range means the roaster\'s cafes deliver a similar experience.</div></details>'
    +'<details class="fi"><summary class="fq">Why are some roasters not ranked?</summary><div class="fa">Roasters need at least 2 reviewed cafes to appear in the main leaderboard. Single-cafe roasters are listed separately — as we review more cafes, they\'ll move into the ranked table.</div></details>'
    +'</div>'

    // Footer
    +'<footer class="ft"><a href="/">Home</a><a href="/map">Map</a><a href="/compare">Compare</a><a href="/blog">Blog</a><a href="/leaderboard">Leaderboard</a><div style="margin-top:8px">&copy; 2026 Koffee Review &middot; koffeereview.com.au</div></footer>'

    // Noscript
    +'<noscript><div style="padding:20px">'+noscriptList+'</div></noscript>'

    // Tab switching script
    +'<script>'
    +'function showTab(t){'
    +'document.getElementById("tab-quality").style.display=t==="quality"?"block":"none";'
    +'document.getElementById("tab-volume").style.display=t==="volume"?"block":"none";'
    +'document.getElementById("tab-single").style.display=t==="single"?"block":"none";'
    +'var btns=document.querySelectorAll(".fb");btns.forEach(function(b){b.classList.remove("on");});'
    +'event.target.classList.add("on");'
    +'}'
    +'<\/script>'

    +'</div></body></html>';

    res.setHeader("Content-Type","text/html; charset=utf-8");
    res.setHeader("Cache-Control","s-maxage=3600,stale-while-revalidate=86400");
    res.status(200).send(html);
  }catch(e){
    res.status(500).send("Error loading roasters: "+e.message);
  }
}
