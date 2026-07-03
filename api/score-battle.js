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
    var shuffled=cafes.sort(function(){return Math.random()-0.5;});
    var pairs=[];
    for(var i=0;i<shuffled.length-1&&pairs.length<20;i+=2){
      if(Math.abs(shuffled[i].sc-shuffled[i+1].sc)>=0.2){pairs.push([shuffled[i],shuffled[i+1]]);}
    }
    var data=JSON.stringify(pairs);

    var html='<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
    +'<title>Score Battle | Which Cafe Scored Higher? | Koffee Review</title>'
    +'<meta name="description" content="Two cafes. One scored higher. Can you guess which? Test your coffee instincts.">'
    +'<link rel="canonical" href="https://koffeereview.com.au/score-battle"><link rel="icon" href="/logo.webp">'
    +'<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">'
    +'<style>'
    +'*{margin:0;padding:0;box-sizing:border-box}'
    +'body{background:#111827;color:#e2e8f0;font-family:DM Sans,sans-serif;min-height:100vh;-webkit-font-smoothing:antialiased}'
    +'.c{max-width:520px;margin:0 auto;padding:0 20px 60px}'
    +'.nav{display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid rgba(255,255,255,0.08)}'
    +'.nav-logo{display:flex;align-items:center;gap:10px;text-decoration:none}.nav-logo img{width:34px;height:34px;border-radius:50%}.nav-logo span{font-family:Bebas Neue,sans-serif;font-size:15px;letter-spacing:3px;color:#E6C073}'
    +'.streak-bar{text-align:center;padding:20px 0}'
    +'.streak-num{font-family:Bebas Neue,sans-serif;font-size:56px;color:#E6C073;line-height:1;transition:color 0.3s}'
    +'.streak-label{font-size:12px;letter-spacing:3px;color:rgba(255,255,255,0.4);margin-top:4px}'
    +'.streak-msg{font-size:13px;color:rgba(255,255,255,0.5);margin-top:4px;min-height:20px}'
    +'.vs-text{font-family:Bebas Neue,sans-serif;font-size:22px;color:rgba(230,192,115,0.4);text-align:center;padding:8px 0;letter-spacing:6px}'
    +'.battle-card{padding:22px;background:rgba(255,255,255,0.05);border:2px solid rgba(255,255,255,0.1);border-radius:18px;cursor:pointer;transition:all 0.2s;text-align:center;margin-bottom:8px}'
    +'.battle-card:hover{border-color:rgba(230,192,115,0.3);background:rgba(255,255,255,0.07)}'
    +'.battle-card:active{transform:scale(0.97)}'
    +'.battle-card.winner{border-color:#4ade80;background:rgba(74,222,128,0.08)}'
    +'.battle-card.loser{border-color:#f87171;background:rgba(248,113,113,0.04);opacity:0.5}'
    +'.b-name{font-family:Bebas Neue,sans-serif;font-size:24px;color:#fff;letter-spacing:1px;margin-bottom:4px}'
    +'.b-loc{font-size:13px;color:rgba(255,255,255,0.45);margin-bottom:12px}'
    +'.b-notes{font-size:13px;color:rgba(255,255,255,0.5);font-style:italic;line-height:1.6;padding:12px;background:rgba(255,255,255,0.03);border-radius:10px}'
    +'.b-score{font-family:Bebas Neue,sans-serif;font-size:48px;line-height:1;margin-top:14px;display:none}'
    +'.b-verdict{font-size:11px;letter-spacing:2px;font-weight:700;margin-top:4px;display:none}'
    +'.b-link{display:none;margin-top:10px;font-size:12px;color:#E6C073;text-decoration:none;border-bottom:1px solid rgba(230,192,115,0.3)}'
    +'.next-btn{display:none;width:100%;padding:18px;border-radius:14px;background:linear-gradient(135deg,#c8a96e,#E6C073);border:none;color:#111827;font-size:16px;font-weight:700;cursor:pointer;font-family:DM Sans,sans-serif;letter-spacing:1px;margin-top:14px}'
    +'.tap-hint{text-align:center;font-size:13px;color:rgba(255,255,255,0.35);margin-top:14px;letter-spacing:1px}'
    +'.final{display:none;text-align:center;padding:40px 0}'
    +'.final-emoji{font-size:64px;margin-bottom:12px}'
    +'.final-score{font-family:Bebas Neue,sans-serif;font-size:80px;color:#E6C073}'
    +'.final-sub{font-size:16px;color:rgba(255,255,255,0.5);margin-top:8px}'
    +'.final-msg{font-size:22px;font-weight:700;color:#fff;margin-top:16px}'
    +'.final-best{font-size:14px;color:rgba(255,255,255,0.4);margin-top:8px}'
    +'.share-btn{display:inline-block;margin-top:24px;padding:16px 36px;border-radius:14px;background:linear-gradient(135deg,#c8a96e,#E6C073);color:#111827;font-size:15px;font-weight:700;cursor:pointer;border:none;font-family:DM Sans,sans-serif}'
    +'.play-again{display:inline-block;margin-top:14px;color:#E6C073;text-decoration:none;font-size:14px}'
    +'.ft{margin-top:32px;padding:20px 0;border-top:1px solid rgba(255,255,255,0.06);text-align:center;font-size:11px;color:rgba(255,255,255,0.3)}.ft a{color:rgba(255,255,255,0.5);text-decoration:none;margin:0 8px}'
    +'</style></head><body><div class="c">'
    +'<nav class="nav"><a href="/" class="nav-logo"><img src="/logo.webp" alt="KR"><span>KOFFEE REVIEW</span></a></nav>'
    +'<div style="text-align:center;padding:20px 0 0"><div style="font-size:11px;letter-spacing:3px;color:rgba(230,192,115,0.6);margin-bottom:6px">COFFEE GAME</div><h1 style="font-family:Bebas Neue,sans-serif;font-size:clamp(30px,8vw,40px);letter-spacing:2px;color:#fff">Score Battle</h1><p style="font-size:14px;color:rgba(255,255,255,0.5);margin-top:8px">Which cafe scored higher? Tap to choose. Build a streak.</p></div>'
    +'<div id="game-area"><div class="streak-bar"><div class="streak-num" id="streakNum">0</div><div class="streak-label">STREAK</div><div class="streak-msg" id="streakMsg"></div></div>'
    +'<div class="battle-card" id="cardA" onclick="pick(0)"><div class="b-name" id="nameA"></div><div class="b-loc" id="locA"></div><div class="b-notes" id="notesA"></div><div class="b-score" id="scoreA"></div><div class="b-verdict" id="verdictA"></div><a class="b-link" id="linkA" href="#">View review &rarr;</a></div>'
    +'<div class="vs-text">VS</div>'
    +'<div class="battle-card" id="cardB" onclick="pick(1)"><div class="b-name" id="nameB"></div><div class="b-loc" id="locB"></div><div class="b-notes" id="notesB"></div><div class="b-score" id="scoreB"></div><div class="b-verdict" id="verdictB"></div><a class="b-link" id="linkB" href="#">View review &rarr;</a></div>'
    +'<div class="tap-hint" id="hint">TAP THE CAFE YOU THINK SCORED HIGHER</div>'
    +'<button class="next-btn" id="nextBtn" onclick="nextRound()">NEXT BATTLE &rarr;</button></div>'
    +'<div class="final" id="final"><div class="final-emoji" id="fEmoji"></div><div class="final-score" id="fScore"></div><div class="final-sub" id="fSub"></div><div class="final-msg" id="fMsg"></div><div class="final-best" id="fBest"></div><button class="share-btn" onclick="shareResult()">SHARE YOUR SCORE</button><br><a href="/score-battle" class="play-again">Play Again</a><br><a href="/guess-the-score" class="play-again" style="margin-top:6px">Try Guess the Score &rarr;</a><br><a href="/explore" class="play-again" style="margin-top:6px">Explore Koffee Review &rarr;</a></div>'
    +'<footer class="ft"><a href="/explore">Explore</a><a href="/leaderboard">Leaderboard</a><a href="/blog">Blog</a></footer></div>'
    +'<script>'
    +'var P='+data+';var round=0;var streak=0;var best=0;var totalCorrect=0;var totalPlayed=0;var locked=false;'
    +'var STREAK_MSGS=["","Not bad.","Getting warmer.","On a roll.","Coffee instincts kicking in.","This person knows coffee.","Unstoppable.","Are you a roaster?","Legend.","Ok this is scary now.","GOAT status."];'
    +'var CORRECT_MSGS=["Correct!","Got it!","Easy money.","Your palate speaks.","Too easy?","You just know.","No hesitation needed."];'
    +'var WRONG_MSGS=["Nope!","Fooled ya.","The notes lied to you.","That one was sneaky.","Plot twist!","The underdog won.","Coffee is full of surprises."];'
    +'var FINAL_GREAT=["Coffee Oracle. Bow down.","You should judge competitions.","Scary good. We are hiring."];'
    +'var FINAL_GOOD=["Sharp instincts. Well played.","Above average palate confirmed.","You read notes like a barista."];'
    +'var FINAL_MID=["Decent effort. Keep exploring.","Middle of the pack. Room to grow.","Not bad, not great. Like a 6.5 cafe."];'
    +'var FINAL_BAD=["Rough day at the office.","Maybe try tasting in person?","Your palate needs a holiday.","At least you are honest."];'
    +'function pick2(arr){return arr[Math.floor(Math.random()*arr.length)];}'
    +'function gc(s){if(s>=9.1)return"#ffffff";if(s>=8.1)return"#4ade80";if(s>=7.5)return"#2dd4bf";if(s>=7.1)return"#2dd4bf";if(s>=6.5)return"#facc15";if(s>=6.1)return"#facc15";if(s>=5.5)return"#fb923c";if(s>=5.1)return"#fb923c";return"#f87171";}'
    +'function gv(s){if(s>=9.1)return"ELITE";if(s>=8.1)return"GREAT";if(s>=7.5)return"MUST VISIT";if(s>=7.1)return"SOLID";if(s>=6.5)return"DECENT";if(s>=6.1)return"TAKE OR LEAVE";if(s>=5.5)return"AVERAGE";if(s>=5.1)return"JUST OKAY";if(s>=4.1)return"NOT FOR US";return"AVOID";}'
    +'function loadRound(){if(round>=P.length){showFinal();return;}locked=false;var a=P[round][0],b=P[round][1];document.getElementById("nameA").textContent=a.n;document.getElementById("locA").textContent=a.s+", "+a.c;document.getElementById("notesA").textContent=a.nt||"No notes";document.getElementById("nameB").textContent=b.n;document.getElementById("locB").textContent=b.s+", "+b.c;document.getElementById("notesB").textContent=b.nt||"No notes";["scoreA","scoreB","verdictA","verdictB","linkA","linkB"].forEach(function(id){document.getElementById(id).style.display="none";});document.getElementById("cardA").className="battle-card";document.getElementById("cardB").className="battle-card";document.getElementById("nextBtn").style.display="none";document.getElementById("hint").style.display="block";}'
    +'function pick(idx){if(locked)return;locked=true;totalPlayed++;var a=P[round][0],b=P[round][1];var winner=a.sc>=b.sc?0:1;var correct=idx===winner;if(correct){streak++;totalCorrect++;if(streak>best)best=streak;}else{streak=0;}document.getElementById("streakNum").textContent=streak;document.getElementById("streakNum").style.color=correct?"#4ade80":"#f87171";document.getElementById("streakMsg").textContent=correct?pick2(CORRECT_MSGS):pick2(WRONG_MSGS);document.getElementById("streakMsg").style.color=correct?"rgba(74,222,128,0.7)":"rgba(248,113,113,0.7)";setTimeout(function(){document.getElementById("streakNum").style.color="#E6C073";var si=Math.min(streak,STREAK_MSGS.length-1);document.getElementById("streakMsg").textContent=STREAK_MSGS[si];document.getElementById("streakMsg").style.color="rgba(255,255,255,0.4)";},1200);var colA=gc(a.sc),colB=gc(b.sc);document.getElementById("scoreA").textContent=a.sc.toFixed(1);document.getElementById("scoreA").style.color=colA;document.getElementById("scoreA").style.display="block";document.getElementById("verdictA").textContent=gv(a.sc);document.getElementById("verdictA").style.color=colA;document.getElementById("verdictA").style.display="block";document.getElementById("linkA").href="/review/"+a.sl;document.getElementById("linkA").style.display="inline-block";document.getElementById("scoreB").textContent=b.sc.toFixed(1);document.getElementById("scoreB").style.color=colB;document.getElementById("scoreB").style.display="block";document.getElementById("verdictB").textContent=gv(b.sc);document.getElementById("verdictB").style.color=colB;document.getElementById("verdictB").style.display="block";document.getElementById("linkB").href="/review/"+b.sl;document.getElementById("linkB").style.display="inline-block";document.getElementById("cardA").className="battle-card "+(a.sc>=b.sc?"winner":"loser");document.getElementById("cardB").className="battle-card "+(b.sc>=a.sc?"winner":"loser");document.getElementById("hint").style.display="none";document.getElementById("nextBtn").style.display="block";if(navigator.vibrate)navigator.vibrate(correct?[40,20,40]:20);}'
    +'function nextRound(){round++;loadRound();}'
    +'function showFinal(){document.getElementById("game-area").style.display="none";document.getElementById("final").style.display="block";document.getElementById("fScore").textContent=totalCorrect+"/"+totalPlayed;document.getElementById("fSub").textContent=totalCorrect+" correct out of "+totalPlayed+" battles";document.getElementById("fBest").textContent="Best streak: "+best+" in a row";var pct=totalCorrect/totalPlayed*100;var emoji=pct>=80?"\\ud83c\\udfc6":pct>=60?"\\u2615":pct>=40?"\\ud83e\\udd14":"\\ud83d\\ude2c";var msg=pct>=80?pick2(FINAL_GREAT):pct>=60?pick2(FINAL_GOOD):pct>=40?pick2(FINAL_MID):pick2(FINAL_BAD);document.getElementById("fEmoji").textContent=emoji;document.getElementById("fMsg").textContent=msg;}'
    +'function shareResult(){var txt="Score Battle \\u2615\\n"+totalCorrect+"/"+totalPlayed+" correct | "+best+" best streak\\n\\nCan you beat me? koffeereview.com.au/score-battle";if(navigator.share){navigator.share({text:txt}).catch(function(){});}else if(navigator.clipboard){navigator.clipboard.writeText(txt);alert("Copied to clipboard!");}}'
    +'loadRound();'
    +'<\/script></body></html>';

    res.setHeader("Content-Type","text/html; charset=utf-8");
    res.setHeader("Cache-Control","public, s-maxage=60, stale-while-revalidate=300");
    res.status(200).send(html);
  }catch(e){res.status(500).send("Error");}
}
