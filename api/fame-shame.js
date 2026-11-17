// HALL OF FAME vs WALL OF SHAME — the most fun page on koffeereview.com.au
// Visual split-screen: Top 10 glory vs Bottom 10 disaster
// Targets: "best cafes australia", "worst cafes brisbane", "cafe hall of fame"

const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYEU8Khk3R5I879v3FcXPqhq0aCXa2ZWM1BwwJOyUitx2Boak_AFTOkwvB8qQrKIeU55NM4htFjHbI/pub?gid=0&single=true&output=csv";

function esc(s){return(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
function makeSlug(n,s){return(n+"-"+s).toLowerCase().replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-");}
function splitCSV(line){var r=[],c="",q=false;for(var i=0;i<line.length;i++){var ch=line[i];if(ch==='"')q=!q;else if(ch===","&&!q){r.push(c.trim());c="";}else c+=ch;}r.push(c.trim());return r;}

function parseCSV(text){
  var lines=text.split("\n").filter(function(l){return l&&l.trim();});
  if(lines.length<2)return[];
  var h=splitCSV(lines[0]).map(function(x){return x.trim().toLowerCase();});
  var idx={name:h.indexOf("name"),suburb:h.indexOf("suburb"),city:h.indexOf("city"),score:h.indexOf("score"),price:h.indexOf("price"),verdict:h.indexOf("verdict"),notes:h.indexOf("notes")};
  if(idx.name===-1||idx.suburb===-1)return[];
  var out=[];
  for(var i=1;i<lines.length;i++){try{var p=splitCSV(lines[i]);var n=p[idx.name]||"";var s=p[idx.suburb]||"";if(!n||!s)continue;var sc=parseFloat(p[idx.score])||0;if(sc<=0)continue;
  out.push({name:n,suburb:s,city:p[idx.city]||"",score:sc,price:p[idx.price]||"$$",verdict:p[idx.verdict]||"",notes:p[idx.notes]||"",slug:makeSlug(n,s)});}catch(e){}}
  return out;
}

export default async function handler(req,res){
  try{
    var controller=new AbortController();var tid=setTimeout(function(){controller.abort();},10000);
    var response=await fetch(SHEET_URL,{signal:controller.signal});clearTimeout(tid);
    if(!response.ok)throw new Error("fail");
    var text=await response.text();var allCafes=parseCSV(text);

    // Sort and pick top 10 and bottom 10
    var sorted=[].concat(allCafes).sort(function(a,b){return b.score-a.score;});
    var fame=sorted.slice(0,10);
    var shame=sorted.slice(-10).reverse(); // worst first

    var totalCafes=allCafes.length;
    var avgScore=(allCafes.reduce(function(s,c){return s+c.score;},0)/allCafes.length).toFixed(1);

    var title="Hall of Fame vs Wall of Shame | Australia's Best & Worst Cafes | Koffee Review";
    var desc="The 10 best cafes we've ever reviewed vs the 10 worst. Glory and disaster, side by side. "+totalCafes+" cafes ranked.";
    var canonical="https://koffeereview.com.au/fame-shame";

    // Build fame cards with trophy graphics
    function fameCard(c,i){
      var medals=['👑','🥇','🥈','🥉','🏆','🏆','⭐','⭐','⭐','⭐'];
      var medal=medals[i]||'⭐';
      var glow=i===0?'0 0 30px rgba(230,192,115,0.4),0 0 60px rgba(230,192,115,0.15)':'0 0 15px rgba(230,192,115,0.1)';
      var border=i===0?'rgba(230,192,115,0.6)':i<3?'rgba(230,192,115,0.3)':'rgba(230,192,115,0.12)';
      var bg=i===0?'linear-gradient(135deg,rgba(230,192,115,0.12),rgba(230,192,115,0.03))':'rgba(255,255,255,0.02)';
      var noteSnip=c.notes?c.notes.substring(0,60)+(c.notes.length>60?'...':''):'';

      return'<a href="/review/'+c.slug+'" style="display:block;text-decoration:none;color:inherit;border:1px solid '+border+';border-radius:16px;padding:16px 18px;margin-bottom:8px;background:'+bg+';box-shadow:'+glow+';transition:all 0.25s;position:relative;overflow:hidden" onmouseover="this.style.transform=\'translateY(-2px) scale(1.01)\';this.style.boxShadow=\'0 8px 30px rgba(230,192,115,0.2)\'" onmouseout="this.style.transform=\'none\';this.style.boxShadow=\''+glow.replace(/'/g,"\\'")+'\'">'
        // Rank badge
        +'<div style="position:absolute;top:-1px;right:16px;background:linear-gradient(135deg,#E6C073,#c8a96e);color:#0d0d0f;font-family:Bebas Neue,sans-serif;font-size:14px;padding:4px 12px 6px;border-radius:0 0 10px 10px;letter-spacing:2px;box-shadow:0 4px 12px rgba(0,0,0,0.3)">#'+(i+1)+'</div>'
        // Content
        +'<div style="display:flex;align-items:center;gap:14px">'
        +'<div style="font-size:28px;min-width:36px;text-align:center">'+medal+'</div>'
        +'<div style="flex:1;min-width:0">'
        +'<div style="font-size:15px;font-weight:700;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(c.name)+'</div>'
        +'<div style="font-size:11px;color:rgba(255,255,255,0.4);margin-top:2px">'+esc(c.suburb)+', '+esc(c.city)+' · '+esc(c.price)+'</div>'
        +(noteSnip?'<div style="font-size:11px;color:rgba(230,192,115,0.5);margin-top:4px;font-style:italic">"'+esc(noteSnip)+'"</div>':'')
        +'</div>'
        // Score circle
        +'<div style="position:relative;width:56px;height:56px;flex-shrink:0">'
        +'<svg width="56" height="56" style="transform:rotate(-90deg)"><circle cx="28" cy="28" r="22" fill="none" stroke="rgba(230,192,115,0.1)" stroke-width="4"/><circle cx="28" cy="28" r="22" fill="none" stroke="#E6C073" stroke-width="4" stroke-dasharray="'+( 2*Math.PI*22)+'" stroke-dashoffset="'+(2*Math.PI*22-(c.score/10)*2*Math.PI*22)+'" stroke-linecap="round"/></svg>'
        +'<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:Bebas Neue,sans-serif;font-size:20px;color:#E6C073">'+c.score.toFixed(1)+'</div>'
        +'</div>'
        +'</div>'
        +'</a>';
    }

    // Build shame cards with danger graphics
    function shameCard(c,i){
      var skulls=['💀','💀','💀','☠️','☠️','🚫','🚫','⚠️','⚠️','⚠️'];
      var skull=skulls[i]||'⚠️';
      var glow=i===0?'0 0 30px rgba(248,113,113,0.3),0 0 60px rgba(248,113,113,0.1)':'0 0 10px rgba(248,113,113,0.05)';
      var border=i===0?'rgba(248,113,113,0.5)':i<3?'rgba(248,113,113,0.25)':'rgba(248,113,113,0.1)';
      var bg=i===0?'linear-gradient(135deg,rgba(248,113,113,0.1),rgba(248,113,113,0.02))':'rgba(255,255,255,0.02)';
      var noteSnip=c.notes?c.notes.substring(0,60)+(c.notes.length>60?'...':''):'';
      var scoreColor=c.score<3?'#f87171':c.score<4?'#fb923c':'#facc15';

      return'<a href="/review/'+c.slug+'" style="display:block;text-decoration:none;color:inherit;border:1px solid '+border+';border-radius:16px;padding:16px 18px;margin-bottom:8px;background:'+bg+';box-shadow:'+glow+';transition:all 0.25s;position:relative;overflow:hidden" onmouseover="this.style.transform=\'translateY(-2px) scale(1.01)\';this.style.boxShadow=\'0 8px 30px rgba(248,113,113,0.15)\'" onmouseout="this.style.transform=\'none\';this.style.boxShadow=\''+glow.replace(/'/g,"\\'")+'\'">'
        // Rank badge
        +'<div style="position:absolute;top:-1px;right:16px;background:linear-gradient(135deg,#f87171,#dc2626);color:#fff;font-family:Bebas Neue,sans-serif;font-size:14px;padding:4px 12px 6px;border-radius:0 0 10px 10px;letter-spacing:2px;box-shadow:0 4px 12px rgba(0,0,0,0.3)">#'+(i+1)+'</div>'
        // Content
        +'<div style="display:flex;align-items:center;gap:14px">'
        +'<div style="font-size:28px;min-width:36px;text-align:center">'+skull+'</div>'
        +'<div style="flex:1;min-width:0">'
        +'<div style="font-size:15px;font-weight:700;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(c.name)+'</div>'
        +'<div style="font-size:11px;color:rgba(255,255,255,0.4);margin-top:2px">'+esc(c.suburb)+', '+esc(c.city)+' · '+esc(c.price)+'</div>'
        +(noteSnip?'<div style="font-size:11px;color:rgba(248,113,113,0.5);margin-top:4px;font-style:italic">"'+esc(noteSnip)+'"</div>':'')
        +'</div>'
        // Score circle
        +'<div style="position:relative;width:56px;height:56px;flex-shrink:0">'
        +'<svg width="56" height="56" style="transform:rotate(-90deg)"><circle cx="28" cy="28" r="22" fill="none" stroke="rgba(248,113,113,0.1)" stroke-width="4"/><circle cx="28" cy="28" r="22" fill="none" stroke="'+scoreColor+'" stroke-width="4" stroke-dasharray="'+(2*Math.PI*22)+'" stroke-dashoffset="'+(2*Math.PI*22-(c.score/10)*2*Math.PI*22)+'" stroke-linecap="round"/></svg>'
        +'<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:Bebas Neue,sans-serif;font-size:20px;color:'+scoreColor+'">'+c.score.toFixed(1)+'</div>'
        +'</div>'
        +'</div>'
        +'</a>';
    }

    var fameCards=fame.map(function(c,i){return fameCard(c,i);}).join("");
    var shameCards=shame.map(function(c,i){return shameCard(c,i);}).join("");

    // Fun stats for the versus section
    var fameAvg=(fame.reduce(function(s,c){return s+c.score;},0)/fame.length).toFixed(1);
    var shameAvg=(shame.reduce(function(s,c){return s+c.score;},0)/shame.length).toFixed(1);
    var scoreDiff=(parseFloat(fameAvg)-parseFloat(shameAvg)).toFixed(1);
    var fameCities={};fame.forEach(function(c){fameCities[c.city]=(fameCities[c.city]||0)+1;});
    var shameCities={};shame.forEach(function(c){shameCities[c.city]=(shameCities[c.city]||0)+1;});
    var topFameCity=Object.keys(fameCities).sort(function(a,b){return fameCities[b]-fameCities[a];})[0]||"";
    var topShameCity=Object.keys(shameCities).sort(function(a,b){return shameCities[b]-shameCities[a];})[0]||"";

    var schemas='<script type="application/ld+json">'+JSON.stringify({"@context":"https://schema.org","@type":"WebPage","name":"Hall of Fame vs Wall of Shame","description":desc,"url":canonical,"publisher":{"@type":"Organization","name":"Koffee Review"}})+'<\/script>';

    var html='<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+esc(title)+'</title><meta name="description" content="'+esc(desc)+'"><link rel="canonical" href="'+canonical+'"><meta property="og:title" content="'+esc(title)+'"><meta property="og:description" content="'+esc(desc)+'"><meta property="og:url" content="'+canonical+'"><meta property="og:image" content="https://koffeereview.com.au/og-fame-shame.png"><link rel="icon" href="/logo.webp">'+schemas
    +'<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">'
    +'<style>'
    +'*{margin:0;padding:0;box-sizing:border-box}'
    +'body{font-family:"DM Sans",sans-serif;background:#0d0d0f;color:#d4d4d4;line-height:1.6;overflow-x:hidden}'
    +'.c{max-width:800px;margin:0 auto;padding:0 16px 60px}'

    // Nav
    +'.nav{display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid rgba(230,192,115,0.08)}.nav-logo{display:flex;align-items:center;gap:10px;text-decoration:none}.nav-logo img{width:34px;height:34px;border-radius:50%;border:1.5px solid rgba(230,192,115,0.25)}.nav-logo span{font-family:"Bebas Neue",sans-serif;font-size:15px;letter-spacing:3px;color:#E6C073}.nav-links{display:flex;gap:14px}.nav-links a{font-size:12px;color:rgba(255,255,255,0.45);text-decoration:none}.nav-links a:hover{color:#E6C073}'

    // Hero animations
    +'@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}'
    +'@keyframes glowPulse{0%,100%{text-shadow:0 0 20px rgba(230,192,115,0.3)}50%{text-shadow:0 0 40px rgba(230,192,115,0.6),0 0 80px rgba(230,192,115,0.2)}}'
    +'@keyframes shamePulse{0%,100%{text-shadow:0 0 20px rgba(248,113,113,0.3)}50%{text-shadow:0 0 40px rgba(248,113,113,0.6),0 0 80px rgba(248,113,113,0.2)}}'
    +'@keyframes slideLeft{from{opacity:0;transform:translateX(-30px)}to{opacity:1;transform:translateX(0)}}'
    +'@keyframes slideRight{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}}'
    +'@keyframes scaleIn{from{opacity:0;transform:scale(0.8)}to{opacity:1;transform:scale(1)}}'
    +'@keyframes floatEmoji{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}'
    +'@keyframes lightning{0%,100%{opacity:0.3}50%{opacity:1}}'

    // Hero
    +'.hero{text-align:center;padding:36px 0 20px;animation:fadeUp 0.6s ease-out}'
    +'.hero-vs{font-family:"Bebas Neue",sans-serif;font-size:80px;color:rgba(255,255,255,0.08);line-height:1;margin:8px 0;letter-spacing:10px;position:relative}'
    +'.hero-vs::after{content:"⚡";position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:36px;animation:lightning 2s infinite}'

    // Split headers
    +'.split{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:20px}'
    +'.fame-side{animation:slideLeft 0.6s ease-out 0.2s both}'
    +'.shame-side{animation:slideRight 0.6s ease-out 0.2s both}'
    +'.side-header{text-align:center;padding:16px;border-radius:16px;margin-bottom:14px}'
    +'.fame-header{background:linear-gradient(135deg,rgba(230,192,115,0.12),rgba(230,192,115,0.03));border:1px solid rgba(230,192,115,0.2)}'
    +'.shame-header{background:linear-gradient(135deg,rgba(248,113,113,0.12),rgba(248,113,113,0.03));border:1px solid rgba(248,113,113,0.2)}'
    +'.side-emoji{font-size:36px;margin-bottom:4px;display:inline-block;animation:floatEmoji 3s ease-in-out infinite}'
    +'.side-title{font-family:"Bebas Neue",sans-serif;font-size:22px;letter-spacing:4px}'
    +'.fame-title{color:#E6C073;animation:glowPulse 3s infinite}'
    +'.shame-title{color:#f87171;animation:shamePulse 3s infinite}'
    +'.side-sub{font-size:11px;color:rgba(255,255,255,0.35);margin-top:2px}'

    // VS divider
    +'.vs-bar{display:flex;align-items:center;justify-content:center;gap:16px;margin:28px 0;animation:scaleIn 0.5s ease-out 0.4s both}'
    +'.vs-line{flex:1;height:1px}'
    +'.vs-fame-line{background:linear-gradient(90deg,transparent,rgba(230,192,115,0.3))}'
    +'.vs-shame-line{background:linear-gradient(90deg,rgba(248,113,113,0.3),transparent)}'
    +'.vs-badge{font-family:"Bebas Neue",sans-serif;font-size:28px;color:#fff;background:linear-gradient(135deg,rgba(230,192,115,0.2),rgba(248,113,113,0.2));border:1px solid rgba(255,255,255,0.1);border-radius:50%;width:56px;height:56px;display:flex;align-items:center;justify-content:center;letter-spacing:3px}'

    // Stats battle
    +'.battle{display:grid;grid-template-columns:1fr auto 1fr;gap:0;margin:24px 0;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:16px;overflow:hidden;animation:fadeUp 0.5s ease-out 0.6s both}'
    +'.battle-side{padding:20px;text-align:center}'
    +'.battle-mid{width:1px;background:rgba(255,255,255,0.06);display:flex;align-items:center;justify-content:center;position:relative}'
    +'.battle-mid::after{content:"⚡";position:absolute;font-size:16px}'
    +'.battle-num{font-family:"Bebas Neue",sans-serif;font-size:36px;line-height:1}'
    +'.battle-label{font-size:10px;letter-spacing:2px;color:rgba(255,255,255,0.35);margin-top:2px}'

    // Tabs
    +'.tabs{display:flex;gap:6px;justify-content:center;margin:20px 0;flex-wrap:wrap}.tab{padding:8px 20px;border-radius:22px;border:1px solid rgba(255,255,255,0.08);background:transparent;color:rgba(255,255,255,0.5);font-size:12px;cursor:pointer;font-family:inherit;transition:all 0.2s;font-weight:600;letter-spacing:0.5px}.tab:hover{border-color:rgba(255,255,255,0.2);color:#fff}.tab.on-fame{background:linear-gradient(135deg,rgba(230,192,115,0.15),rgba(230,192,115,0.05));border-color:rgba(230,192,115,0.3);color:#E6C073}.tab.on-shame{background:linear-gradient(135deg,rgba(248,113,113,0.15),rgba(248,113,113,0.05));border-color:rgba(248,113,113,0.3);color:#f87171}.tab.on-both{background:linear-gradient(135deg,rgba(230,192,115,0.1),rgba(248,113,113,0.1));border-color:rgba(255,255,255,0.15);color:#fff}'

    // Fun facts
    +'.fun-facts{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:20px;margin:24px 0;animation:fadeUp 0.5s ease-out 0.8s both}'
    +'.ff-title{font-family:"Bebas Neue",sans-serif;font-size:14px;letter-spacing:4px;color:rgba(255,255,255,0.4);margin-bottom:14px;text-align:center}'
    +'.ff-item{display:flex;align-items:center;gap:12px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.03)}.ff-item:last-child{border:none}'
    +'.ff-emoji{font-size:20px;min-width:28px;text-align:center}'
    +'.ff-text{font-size:13px;color:rgba(255,255,255,0.6)}.ff-text span{color:#E6C073;font-weight:700}.ff-text .red{color:#f87171}'

    // Footer
    +'.ft{margin-top:36px;padding-top:18px;border-top:1px solid rgba(255,255,255,0.04);text-align:center;font-size:11px;color:rgba(255,255,255,0.35)}.ft a{color:rgba(255,255,255,0.5);text-decoration:none;margin:0 8px}'

    // Mobile
    +'@media(max-width:640px){.split{grid-template-columns:1fr}.hero-vs{font-size:50px}.battle-num{font-size:28px}}'
    +'</style></head><body><div class="c">'

    // Nav
    +'<nav class="nav"><a href="/" class="nav-logo"><img src="/logo.webp" alt="KR"><span>KOFFEE REVIEW</span></a><div class="nav-links"><a href="/leaderboard">Leaderboard</a><a href="/roaster-leaderboard">Roasters</a><a href="/blog">Blog</a></div></nav>'

    // Hero
    +'<header class="hero">'
    +'<div style="font-size:11px;letter-spacing:4px;color:rgba(255,255,255,0.3);text-transform:uppercase">Based on '+totalCafes+' reviews</div>'
    +'<div class="hero-vs">VS</div>'
    +'<div style="display:flex;align-items:center;justify-content:center;gap:16px;flex-wrap:wrap">'
    +'<span style="font-family:Bebas Neue,sans-serif;font-size:28px;color:#E6C073;letter-spacing:3px;animation:glowPulse 3s infinite">HALL OF FAME</span>'
    +'<span style="font-size:24px">⚔️</span>'
    +'<span style="font-family:Bebas Neue,sans-serif;font-size:28px;color:#f87171;letter-spacing:3px;animation:shamePulse 3s infinite">WALL OF SHAME</span>'
    +'</div>'
    +'<div style="font-size:12px;color:rgba(255,255,255,0.35);margin-top:8px">The best and worst of Australian coffee. No mercy. No filter.</div>'
    +'</header>'

    // Battle Stats Bar
    +'<div class="battle">'
    +'<div class="battle-side"><div class="battle-num" style="color:#E6C073">'+fameAvg+'</div><div class="battle-label">FAME AVG</div></div>'
    +'<div class="battle-mid"></div>'
    +'<div class="battle-side"><div class="battle-num" style="color:#f87171">'+shameAvg+'</div><div class="battle-label">SHAME AVG</div></div>'
    +'</div>'
    +'<div style="text-align:center;margin:8px 0 4px"><span style="font-family:Bebas Neue,sans-serif;font-size:18px;color:rgba(255,255,255,0.5)">'+scoreDiff+' POINTS APART</span></div>'

    // View Tabs
    +'<div class="tabs">'
    +'<button class="tab on-both" id="tab-both" onclick="showView(\'both\')">⚔️ Side by Side</button>'
    +'<button class="tab" id="tab-fame" onclick="showView(\'fame\')">👑 Hall of Fame</button>'
    +'<button class="tab" id="tab-shame" onclick="showView(\'shame\')">💀 Wall of Shame</button>'
    +'</div>'

    // === SIDE BY SIDE VIEW ===
    +'<div id="view-both">'
    +'<div class="split">'
    // Fame column
    +'<div class="fame-side">'
    +'<div class="side-header fame-header"><div class="side-emoji">👑</div><div class="side-title fame-title">HALL OF FAME</div><div class="side-sub">The absolute best</div></div>'
    +fameCards
    +'</div>'
    // Shame column
    +'<div class="shame-side">'
    +'<div class="side-header shame-header"><div class="side-emoji">💀</div><div class="side-title shame-title">WALL OF SHAME</div><div class="side-sub">The absolute worst</div></div>'
    +shameCards
    +'</div>'
    +'</div>'
    +'</div>'

    // === FAME ONLY VIEW ===
    +'<div id="view-fame" style="display:none">'
    +'<div class="side-header fame-header" style="margin-bottom:16px"><div class="side-emoji">👑</div><div class="side-title fame-title">HALL OF FAME</div><div class="side-sub">The 10 best cafes we\'ve ever reviewed</div></div>'
    +'<div style="max-width:560px;margin:0 auto">'+fameCards+'</div>'
    +'</div>'

    // === SHAME ONLY VIEW ===
    +'<div id="view-shame" style="display:none">'
    +'<div class="side-header shame-header" style="margin-bottom:16px"><div class="side-emoji">💀</div><div class="side-title shame-title">WALL OF SHAME</div><div class="side-sub">The 10 worst cafes we\'ve ever reviewed</div></div>'
    +'<div style="max-width:560px;margin:0 auto">'+shameCards+'</div>'
    +'</div>'

    // VS Divider
    +'<div class="vs-bar"><div class="vs-line vs-fame-line"></div><div class="vs-badge">VS</div><div class="vs-line vs-shame-line"></div></div>'

    // Fun Facts
    +'<div class="fun-facts">'
    +'<div class="ff-title">⚡ BATTLE STATS ⚡</div>'
    +'<div class="ff-item"><div class="ff-emoji">📊</div><div class="ff-text">The gap between fame and shame: <span>'+scoreDiff+' points</span></div></div>'
    +'<div class="ff-item"><div class="ff-emoji">🏙️</div><div class="ff-text">Most Hall of Famers from: <span>'+esc(topFameCity)+'</span></div></div>'
    +'<div class="ff-item"><div class="ff-emoji">🚨</div><div class="ff-text">Most Wall of Shamers from: <span class="red">'+esc(topShameCity)+'</span></div></div>'
    +'<div class="ff-item"><div class="ff-emoji">☕</div><div class="ff-text">Average across all '+totalCafes+' cafes: <span>'+avgScore+'</span>/10</div></div>'
    +'<div class="ff-item"><div class="ff-emoji">👑</div><div class="ff-text">The #1 cafe scored <span>'+fame[0].score.toFixed(1)+'</span> — '+esc(fame[0].name)+', '+esc(fame[0].suburb)+'</div></div>'
    +'<div class="ff-item"><div class="ff-emoji">💀</div><div class="ff-text">The #1 worst scored <span class="red">'+shame[0].score.toFixed(1)+'</span> — '+esc(shame[0].name)+', '+esc(shame[0].suburb)+'</div></div>'
    +'<div class="ff-item"><div class="ff-emoji">🎯</div><div class="ff-text">That\'s a <span>'+((fame[0].score/shame[0].score)*100-100).toFixed(0)+'%</span> score difference between best and worst</div></div>'
    +'</div>'

    // CTA
    +'<div style="text-align:center;margin:28px 0;animation:fadeUp 0.5s ease-out 1s both">'
    +'<div style="font-size:13px;color:rgba(255,255,255,0.4);margin-bottom:12px">Think your local deserves to be here?</div>'
    +'<a href="/" style="display:inline-block;padding:12px 32px;border-radius:30px;background:linear-gradient(135deg,rgba(230,192,115,0.2),rgba(230,192,115,0.08));border:1px solid rgba(230,192,115,0.3);color:#E6C073;text-decoration:none;font-size:13px;font-weight:700;letter-spacing:1px;transition:all 0.2s" onmouseover="this.style.background=\'linear-gradient(135deg,rgba(230,192,115,0.3),rgba(230,192,115,0.12))\'" onmouseout="this.style.background=\'linear-gradient(135deg,rgba(230,192,115,0.2),rgba(230,192,115,0.08))\'">SUGGEST A CAFE →</a>'
    +'</div>'

    // Footer
    +'<footer class="ft"><a href="/">Home</a><a href="/leaderboard">Leaderboard</a><a href="/roaster-leaderboard">Roasters</a><a href="/map">Map</a><a href="/blog">Blog</a><div style="margin-top:8px">&copy; 2026 Koffee Review &middot; koffeereview.com.au</div></footer>'

    // Tab switching script
    +'<script>'
    +'function showView(v){'
    +'document.getElementById("view-both").style.display=v==="both"?"block":"none";'
    +'document.getElementById("view-fame").style.display=v==="fame"?"block":"none";'
    +'document.getElementById("view-shame").style.display=v==="shame"?"block":"none";'
    +'document.getElementById("tab-both").className="tab"+(v==="both"?" on-both":"");'
    +'document.getElementById("tab-fame").className="tab"+(v==="fame"?" on-fame":"");'
    +'document.getElementById("tab-shame").className="tab"+(v==="shame"?" on-shame":"");'
    +'}'
    +'<\/script>'

    +'</div></body></html>';

    res.setHeader("Content-Type","text/html; charset=utf-8");
    res.setHeader("Cache-Control","s-maxage=3600,stale-while-revalidate=86400");
    res.status(200).send(html);
  }catch(e){
    res.status(500).send("Error loading fame/shame: "+e.message);
  }
}
