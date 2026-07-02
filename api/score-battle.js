const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYEU8Khk3R5I879v3FcXPqhq0aCXa2ZWM1BwwJOyUitx2Boak_AFTOkwvB8qQrKIeU55NM4htFjHbI/pub?gid=0&single=true&output=csv";
const SPAIN = ["barcelona","catalonia","spain"];
function esc(s){return(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
function splitCSV(line){var r=[],c="",q=false;for(var i=0;i<line.length;i++){var ch=line[i];if(ch==='"')q=!q;else if(ch===","&&!q){r.push(c.trim());c="";}else c+=ch;}r.push(c.trim());return r;}
function makeSlug(n,s){return(n+"-"+s).toLowerCase().replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-").trim();}

export default async function handler(req,res){
  try{
    var response=await fetch(SHEET_URL);var text=await response.text();
    var lines=text.split("\n").filter(function(l){return l.trim();});
    var h=splitCSV(lines[0]).map(function(x){return x.trim().toLowerCase();});
    var ni=h.indexOf("name"),si=h.indexOf("suburb"),ci=h.indexOf("city"),sci=h.indexOf("score"),noi=h.indexOf("notes");
    var cafes=[];
    for(var i=1;i<lines.length;i++){try{var p=splitCSV(lines[i]);var n=(p[ni]||"").trim();if(!n)continue;var sc=parseFloat(p[sci])||0;if(sc<=0)continue;
    var city=(p[ci]||"").trim();if(SPAIN.indexOf(city.toLowerCase())!==-1)continue;
    cafes.push({n:n,s:(p[si]||"").trim(),c:city,sc:sc,nt:((p[noi]||"").trim()).substring(0,80),sl:makeSlug(n,(p[si]||"").trim())});}catch(e){}}

    // Create pairs with meaningful score differences (at least 0.3 apart)
    var shuffled=cafes.sort(function(){return Math.random()-0.5;});
    var pairs=[];
    for(var i=0;i<shuffled.length-1&&pairs.length<20;i+=2){
      if(Math.abs(shuffled[i].sc-shuffled[i+1].sc)>=0.2){
        pairs.push([shuffled[i],shuffled[i+1]]);
      }
    }
    var data=JSON.stringify(pairs);
    var year=new Date().getFullYear();

    var html='<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
    +'<title>Score Battle | Which Cafe Scored Higher? | Koffee Review</title>'
    +'<meta name="description" content="Two cafes. One scored higher. Can you guess which? Test your coffee instincts against our data.">'
    +'<link rel="canonical" href="https://koffeereview.com.au/score-battle">'
    +'<link rel="icon" href="/logo.webp">'
    +'<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">'
    +'<style>'
    +'*{margin:0;padding:0;box-sizing:border-box}'
    +'body{background:#0a0a0c;color:#fff;font-family:DM Sans,sans-serif;min-height:100vh;-webkit-font-smoothing:antialiased}'
    +'.c{max-width:520px;margin:0 auto;padding:0 20px 60px}'
    +'.nav{display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid rgba(255,255,255,0.06)}'
    +'.nav-logo{display:flex;align-items:center;gap:10px;text-decoration:none}'
    +'.nav-logo img{width:34px;height:34px;border-radius:50%}'
    +'.nav-logo span{font-family:Bebas Neue,sans-serif;font-size:15px;letter-spacing:3px;color:#E6C073}'
    +'.streak-bar{text-align:center;padding:16px 0}'
    +'.streak-num{font-family:Bebas Neue,sans-serif;font-size:48px;color:#E6C073;line-height:1}'
    +'.streak-label{font-size:11px;letter-spacing:3px;color:rgba(255,255,255,0.3)}'
    +'.vs-text{font-family:Bebas Neue,sans-serif;font-size:20px;color:rgba(230,192,115,0.3);text-align:center;padding:8px 0;letter-spacing:4px}'
    +'.battle-card{padding:20px;background:rgba(255,255,255,0.03);border:2px solid rgba(255,255,255,0.06);border-radius:16px;cursor:pointer;transition:all 0.2s;text-align:center;margin-bottom:8px}'
    +'.battle-card:hover{border-color:rgba(230,192,115,0.3);background:rgba(255,255,255,0.05)}'
    +'.battle-card:active{transform:scale(0.98)}'
    +'.battle-card.winner{border-color:#4ade80;background:rgba(74,222,128,0.05)}'
    +'.battle-card.loser{border-color:#f87171;background:rgba(248,113,113,0.03);opacity:0.6}'
    +'.battle-card.picked{border-color:#E6C073}'
    +'.b-name{font-family:Bebas Neue,sans-serif;font-size:22px;color:#fff;letter-spacing:1px;margin-bottom:4px}'
    +'.b-loc{font-size:12px;color:rgba(255,255,255,0.35);margin-bottom:10px}'
    +'.b-notes{font-size:12px;color:rgba(255,255,255,0.4);font-style:italic;line-height:1.5;padding:10px;background:rgba(255,255,255,0.02);border-radius:8px}'
    +'.b-score{font-family:Bebas Neue,sans-serif;font-size:44px;line-height:1;margin-top:12px;display:none}'
    +'.b-verdict{font-size:10px;letter-spacing:2px;font-weight:700;margin-top:4px;display:none}'
    +'.b-link{display:none;margin-top:8px;font-size:12px;color:#E6C073;text-decoration:none}'
    +'.next-btn{display:none;width:100%;padding:16px;border-radius:14px;background:linear-gradient(135deg,#c8a96e,#E6C073);border:none;color:#0a0a0c;font-size:15px;font-weight:700;cursor:pointer;font-family:DM Sans,sans-serif;letter-spacing:1px;margin-top:12px}'
    +'.tap-hint{text-align:center;font-size:12px;color:rgba(255,255,255,0.25);margin-top:12px;letter-spacing:1px}'
    +'.final{display:none;text-align:center;padding:40px 0}'
    +'.final-score{font-family:Bebas Neue,sans-serif;font-size:72px;color:#E6C073}'
    +'.final-sub{font-size:16px;color:rgba(255,255,255,0.5);margin-top:8px}'
    +'.final-msg{font-size:20px;font-weight:600;color:#fff;margin-top:16px}'
    +'.share-btn{display:inline-block;margin-top:20px;padding:14px 32px;border-radius:14px;background:linear-gradient(135deg,#c8a96e,#E6C073);color:#0a0a0c;font-size:14px;font-weight:700;cursor:pointer;border:none;font-family:DM Sans,sans-serif}'
    +'.play-again{display:inline-block;margin-top:12px;color:#E6C073;text-decoration:none;font-size:14px}'
    +'.ft{margin-top:32px;padding:20px 0;border-top:1px solid rgba(255,255,255,0.04);text-align:center;font-size:11px;color:rgba(255,255,255,0.3)}'
    +'.ft a{color:rgba(255,255,255,0.5);text-decoration:none;margin:0 8px}'
    +'</style></head><body><div class="c">'
    +'<nav class="nav"><a href="/" class="nav-logo"><img src="/logo.webp" alt="KR"><span>KOFFEE REVIEW</span></a></nav>'
    +'<div style="text-align:center;padding:20px 0 0"><div style="font-size:10px;letter-spacing:3px;color:rgba(230,192,115,0.5);margin-bottom:6px">COFFEE GAME</div><h1 style="font-family:Bebas Neue,sans-serif;font-size:clamp(28px,8vw,38px);letter-spacing:2px;color:#fff">Score Battle</h1><p style="font-size:13px;color:rgba(255,255,255,0.4);margin-top:6px">Which cafe scored higher? Tap to choose.</p></div>'
    +'<div id="game-area">'
    +'<div class="streak-bar"><div class="streak-num" id="streakNum">0</div><div class="streak-label">STREAK</div></div>'
    +'<div class="battle-card" id="cardA" onclick="pick(0)"><div class="b-name" id="nameA"></div><div class="b-loc" id="locA"></div><div class="b-notes" id="notesA"></div><div class="b-score" id="scoreA"></div><div class="b-verdict" id="verdictA"></div><a class="b-link" id="linkA" href="#">View review &rarr;</a></div>'
    +'<div class="vs-text">VS</div>'
    +'<div class="battle-card" id="cardB" onclick="pick(1)"><div class="b-name" id="nameB"></div><div class="b-loc" id="locB"></div><div class="b-notes" id="notesB"></div><div class="b-score" id="scoreB"></div><div class="b-verdict" id="verdictB"></div><a class="b-link" id="linkB" href="#">View review &rarr;</a></div>'
    +'<div class="tap-hint" id="hint">TAP THE CAFE YOU THINK SCORED HIGHER</div>'
    +'<button class="next-btn" id="nextBtn" onclick="nextRound()">NEXT BATTLE &rarr;</button>'
    +'</div>'
    +'<div class="final" id="final"><div style="font-size:10px;letter-spacing:3px;color:rgba(230,192,115,0.5);margin-bottom:12px">GAME OVER</div><div class="final-score" id="fScore"></div><div class="final-sub" id="fSub"></div><div class="final-msg" id="fMsg"></div><div style="font-size:13px;color:rgba(255,255,255,0.35);margin-top:8px" id="fBest"></div><button class="share-btn" onclick="shareResult()">SHARE RESULT</button><br><a href="/score-battle" class="play-again">Play Again &rarr;</a><br><a href="/guess-the-score" class="play-again" style="margin-top:8px">Try Guess the Score &rarr;</a></div>'
    +'<footer class="ft"><a href="/explore">Explore</a><a href="/leaderboard">Leaderboard</a><a href="/blog">Blog</a></footer></div>'
    +'<script>'
    +'var P='+data+';var round=0;var streak=0;var best=0;var totalCorrect=0;var totalPlayed=0;var locked=false;'
    +'function gc(s){if(s>=9.1)return"#ffffff";if(s>=8.1)return"#4ade80";if(s>=7.5)return"#2dd4bf";if(s>=7.1)return"#2dd4bf";if(s>=6.5)return"#facc15";if(s>=6.1)return"#facc15";if(s>=5.5)return"#fb923c";if(s>=5.1)return"#fb923c";return"#f87171";}'
    +'function gv(s){if(s>=9.1)return"ELITE";if(s>=8.1)return"GREAT";if(s>=7.5)return"MUST VISIT";if(s>=7.1)return"SOLID";if(s>=6.5)return"DECENT";if(s>=6.1)return"TAKE OR LEAVE";if(s>=5.5)return"AVERAGE";if(s>=5.1)return"JUST OKAY";if(s>=4.1)return"NOT FOR US";return"AVOID";}'
    +'function loadRound(){if(round>=P.length){showFinal();return;}locked=false;var a=P[round][0],b=P[round][1];document.getElementById("nameA").textContent=a.n;document.getElementById("locA").textContent=a.s+", "+a.c;document.getElementById("notesA").textContent=a.nt||"";document.getElementById("nameB").textContent=b.n;document.getElementById("locB").textContent=b.s+", "+b.c;document.getElementById("notesB").textContent=b.nt||"";["scoreA","scoreB","verdictA","verdictB","linkA","linkB"].forEach(function(id){document.getElementById(id).style.display="none";});document.getElementById("cardA").className="battle-card";document.getElementById("cardB").className="battle-card";document.getElementById("nextBtn").style.display="none";document.getElementById("hint").style.display="block";}'
    +'function pick(idx){if(locked)return;locked=true;totalPlayed++;var a=P[round][0],b=P[round][1];var winner=a.sc>=b.sc?0:1;var correct=idx===winner;if(correct){streak++;totalCorrect++;if(streak>best)best=streak;}else{streak=0;}document.getElementById("streakNum").textContent=streak;document.getElementById("streakNum").style.color=correct?"#4ade80":"#f87171";setTimeout(function(){document.getElementById("streakNum").style.color="#E6C073";},600);var colA=gc(a.sc),colB=gc(b.sc);document.getElementById("scoreA").textContent=a.sc.toFixed(1);document.getElementById("scoreA").style.color=colA;document.getElementById("scoreA").style.display="block";document.getElementById("verdictA").textContent=gv(a.sc);document.getElementById("verdictA").style.color=colA;document.getElementById("verdictA").style.display="block";document.getElementById("linkA").href="/review/"+a.sl;document.getElementById("linkA").style.display="inline-block";document.getElementById("scoreB").textContent=b.sc.toFixed(1);document.getElementById("scoreB").style.color=colB;document.getElementById("scoreB").style.display="block";document.getElementById("verdictB").textContent=gv(b.sc);document.getElementById("verdictB").style.color=colB;document.getElementById("verdictB").style.display="block";document.getElementById("linkB").href="/review/"+b.sl;document.getElementById("linkB").style.display="inline-block";document.getElementById("cardA").className="battle-card "+(a.sc>=b.sc?"winner":"loser");document.getElementById("cardB").className="battle-card "+(b.sc>=a.sc?"winner":"loser");document.getElementById("hint").style.display="none";document.getElementById("nextBtn").style.display="block";if(navigator.vibrate)navigator.vibrate(correct?[40,20,40]:20);}'
    +'function nextRound(){round++;loadRound();}'
    +'function showFinal(){document.getElementById("game-area").style.display="none";document.getElementById("final").style.display="block";document.getElementById("fScore").textContent=totalCorrect+"/"+totalPlayed;document.getElementById("fSub").textContent=totalCorrect+" correct out of "+totalPlayed+" battles";document.getElementById("fBest").textContent="Best streak: "+best;var pct=totalCorrect/totalPlayed*100;var msg=pct>=80?"Coffee Oracle! You can taste through text.":pct>=60?"Sharp palate. You read notes well.":pct>=40?"Not bad. Keep exploring.":"Tough matchups! Try visiting some reviews.";document.getElementById("fMsg").textContent=msg;}'
    +'function shareResult(){var txt="I got "+totalCorrect+"/"+totalPlayed+" in Koffee Review Score Battle with a "+best+" streak! koffeereview.com.au/score-battle";if(navigator.share){navigator.share({text:txt}).catch(function(){});}else if(navigator.clipboard){navigator.clipboard.writeText(txt);alert("Copied to clipboard!");}}'
    +'loadRound();'
    +'<\/script></body></html>';

    res.setHeader("Content-Type","text/html; charset=utf-8");
    res.setHeader("Cache-Control","public, s-maxage=60, stale-while-revalidate=300");
    res.status(200).send(html);
  }catch(e){res.status(500).send("Error");}
}
