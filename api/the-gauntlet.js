const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYEU8Khk3R5I879v3FcXPqhq0aCXa2ZWM1BwwJOyUitx2Boak_AFTOkwvB8qQrKIeU55NM4htFjHbI/pub?gid=0&single=true&output=csv";
const SPAIN = ["barcelona","catalonia","spain"];
function esc(s){return(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
function splitCSV(line){var r=[],c="",q=false;for(var i=0;i<line.length;i++){var ch=line[i];if(ch==='"')q=!q;else if(ch===","&&!q){r.push(c.trim());c="";}else c+=ch;}r.push(c.trim());return r;}
function makeSlug(n,s){return(n+"-"+s).toLowerCase().replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-").trim();}
function gc(s){if(s>=7.5)return"#4ade80";if(s>=6.0)return"#facc15";return"#f87171";}

export default async function handler(req,res){
  try{
    var response=await fetch(SHEET_URL);var text=await response.text();
    var lines=text.split("\n").filter(function(l){return l.trim();});
    var h=splitCSV(lines[0]).map(function(x){return x.trim().toLowerCase();});
    var ni=h.indexOf("name"),si=h.indexOf("suburb"),ci=h.indexOf("city"),sci=h.indexOf("score"),noi=h.indexOf("notes");
    var cafes=[];
    for(var i=1;i<lines.length;i++){try{var p=splitCSV(lines[i]);var n=(p[ni]||"").trim();if(!n)continue;var sc=parseFloat(p[sci])||0;if(sc<=0)continue;
    var city=(p[ci]||"").trim();if(SPAIN.indexOf(city.toLowerCase())!==-1)continue;
    var notes=(p[noi]||"").trim();if(!notes||notes.length<15)continue;
    cafes.push({n:n,s:(p[si]||"").trim(),c:city,sc:sc,nt:notes.substring(0,100),sl:makeSlug(n,(p[si]||"").trim())});}catch(e){}}
    var shuffled=cafes.sort(function(){return Math.random()-0.5;}).slice(0,20);
    var data=JSON.stringify(shuffled);

    var html='<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
    +'<title>The Gauntlet | Speed Coffee Game | Koffee Review</title>'
    +'<meta name="description" content="20 cafes. 60 seconds. Is it VISIT or SKIP? Read the notes, decide fast. How many can you get right?">'
    +'<link rel="canonical" href="https://koffeereview.com.au/the-gauntlet"><link rel="icon" href="/logo.webp">'
    +'<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">'
    +'<style>'
    +'*{margin:0;padding:0;box-sizing:border-box}'
    +'body{background:#0a0a0c;color:#e2e8f0;font-family:DM Sans,sans-serif;min-height:100vh;-webkit-font-smoothing:antialiased}'
    +'.c{max-width:520px;margin:0 auto;padding:0 20px 60px}'
    +'.nav{display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid rgba(255,255,255,0.06)}'
    +'.nav-logo{display:flex;align-items:center;gap:10px;text-decoration:none}.nav-logo img{width:34px;height:34px;border-radius:50%}.nav-logo span{font-family:Bebas Neue,sans-serif;font-size:15px;letter-spacing:3px;color:#E6C073}'
    +'.timer-bar{height:6px;background:rgba(255,255,255,0.06);border-radius:3px;margin:20px 0 8px;overflow:hidden}'
    +'.timer-fill{height:100%;background:linear-gradient(90deg,#f87171,#facc15,#4ade80);border-radius:3px;transition:width 0.1s linear}'
    +'.hud{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}'
    +'.hud-item{text-align:center}.hud-n{font-family:Bebas Neue,sans-serif;font-size:32px;color:#E6C073}.hud-l{font-size:10px;letter-spacing:2px;color:rgba(255,255,255,0.3)}'
    +'.card{background:rgba(255,255,255,0.04);border:2px solid rgba(255,255,255,0.08);border-radius:20px;padding:28px;text-align:center;transition:all 0.3s}'
    +'.card.flash-green{border-color:#4ade80;background:rgba(74,222,128,0.08)}'
    +'.card.flash-red{border-color:#f87171;background:rgba(248,113,113,0.06)}'
    +'.cafe-name{font-family:Bebas Neue,sans-serif;font-size:26px;color:#fff;letter-spacing:1px;margin-bottom:4px}'
    +'.cafe-loc{font-size:13px;color:rgba(255,255,255,0.4);margin-bottom:16px}'
    +'.notes{font-size:14px;color:rgba(255,255,255,0.6);font-style:italic;line-height:1.7;padding:16px;background:rgba(255,255,255,0.03);border-radius:14px;border:1px solid rgba(255,255,255,0.06);margin-bottom:20px;text-align:left}'
    +'.feedback{font-size:15px;font-weight:600;min-height:24px;margin-bottom:12px}'
    +'.btn-row{display:grid;grid-template-columns:1fr 1fr;gap:10px}'
    +'.skip-btn{padding:18px;border-radius:14px;background:rgba(248,113,113,0.08);border:2px solid rgba(248,113,113,0.25);color:#f87171;font-size:16px;font-weight:700;cursor:pointer;font-family:DM Sans,sans-serif;transition:all 0.1s}'
    +'.skip-btn:hover{background:rgba(248,113,113,0.15)}.skip-btn:active{transform:scale(0.97)}'
    +'.visit-btn{padding:18px;border-radius:14px;background:rgba(74,222,128,0.08);border:2px solid rgba(74,222,128,0.25);color:#4ade80;font-size:16px;font-weight:700;cursor:pointer;font-family:DM Sans,sans-serif;transition:all 0.1s}'
    +'.visit-btn:hover{background:rgba(74,222,128,0.15)}.visit-btn:active{transform:scale(0.97)}'
    +'.start-card{text-align:center;padding:40px 20px}'
    +'.start-btn{padding:18px 48px;border-radius:14px;background:linear-gradient(135deg,#dc2626,#f87171);border:none;color:#fff;font-size:18px;font-weight:700;cursor:pointer;font-family:Bebas Neue,sans-serif;letter-spacing:3px;margin-top:20px}'
    +'.final{display:none;text-align:center;padding:40px 0}'
    +'.final-score{font-family:Bebas Neue,sans-serif;font-size:80px;color:#E6C073}'
    +'.final-msg{font-size:22px;font-weight:700;color:#fff;margin-top:16px}'
    +'.share-btn{display:inline-block;margin-top:24px;padding:16px 36px;border-radius:14px;background:linear-gradient(135deg,#dc2626,#f87171);color:#fff;font-size:15px;font-weight:700;cursor:pointer;border:none;font-family:DM Sans,sans-serif}'
    +'.play-again{display:inline-block;margin-top:14px;color:#f87171;text-decoration:none;font-size:14px}'
    +'.ft{margin-top:32px;padding:20px 0;border-top:1px solid rgba(255,255,255,0.04);text-align:center;font-size:11px;color:rgba(255,255,255,0.3)}.ft a{color:rgba(255,255,255,0.5);text-decoration:none;margin:0 8px}'
    +'</style></head><body><div class="c">'
    +'<nav class="nav"><a href="/" class="nav-logo"><img src="/logo.webp" alt="KR"><span>KOFFEE REVIEW</span></a></nav>'
    +'<div style="text-align:center;padding:20px 0 0"><div style="font-size:11px;letter-spacing:3px;color:rgba(248,113,113,0.6);margin-bottom:6px">COFFEE GAME</div><h1 style="font-family:Bebas Neue,sans-serif;font-size:clamp(30px,8vw,42px);letter-spacing:2px;color:#fff">The Gauntlet</h1></div>'
    +'<div id="startScreen" class="start-card"><p style="font-size:16px;color:rgba(255,255,255,0.6);line-height:1.7;margin-bottom:8px">20 cafes. 60 seconds.</p><p style="font-size:14px;color:rgba(255,255,255,0.4);line-height:1.6">Read the tasting notes. Decide: would you VISIT (7.0+) or SKIP (below 7.0)?</p><p style="font-size:13px;color:rgba(255,255,255,0.3);margin-top:12px">Speed matters. Clock is ticking.</p><button class="start-btn" onclick="startGame()">START THE GAUNTLET</button></div>'
    +'<div id="gameArea" style="display:none"><div class="timer-bar"><div class="timer-fill" id="timerFill" style="width:100%"></div></div><div class="hud"><div class="hud-item"><div class="hud-n" id="hTime">60</div><div class="hud-l">SECONDS</div></div><div class="hud-item"><div class="hud-n" id="hRound">1/20</div><div class="hud-l">CAFE</div></div><div class="hud-item"><div class="hud-n" id="hScore">0</div><div class="hud-l">CORRECT</div></div></div><div class="card" id="gCard"><div class="cafe-name" id="gName"></div><div class="cafe-loc" id="gLoc"></div><div class="notes" id="gNotes"></div><div class="feedback" id="gFb"></div><div class="btn-row"><button class="skip-btn" onclick="answer(false)">SKIP IT</button><button class="visit-btn" onclick="answer(true)">VISIT</button></div></div></div>'
    +'<div class="final" id="final"><div style="font-size:48px;margin-bottom:12px" id="fEmoji"></div><div class="final-score" id="fScore"></div><div style="font-size:16px;color:rgba(255,255,255,0.5);margin-top:8px" id="fSub"></div><div class="final-msg" id="fMsg"></div><div style="font-size:13px;color:rgba(255,255,255,0.35);margin-top:8px" id="fTime"></div><button class="share-btn" onclick="shareResult()">SHARE YOUR SCORE</button><br><a href="/the-gauntlet" class="play-again">Run It Again</a><br><a href="/guess-the-suburb" class="play-again" style="margin-top:6px;color:#a78bfa">Try Guess the Suburb</a><br><a href="/guess-the-score" class="play-again" style="margin-top:6px;color:#E6C073">Try Guess the Score</a></div>'
    +'<footer class="ft"><a href="/explore">Explore</a><a href="/leaderboard">Leaderboard</a><a href="/blog">Blog</a></footer></div>'
    +'<script>'
    +'var AC='+data+';var round=0;var score=0;var total=AC.length;var locked=false;var timer=null;var timeLeft=60;var started=false;'
    +'var RIGHT=["Correct!","Nailed it!","Good instinct.","Your palate knows.","Sharp.","Easy read.","Coffee sense."];'
    +'var WRONG_V=["Nope. That was a skip.","You would regret that visit.","Your standards need work.","Save your $6.","The notes warned you."];'
    +'var WRONG_S=["Wrong! That was a gem.","You just skipped a good one.","The notes were screaming VISIT.","Missed opportunity.","That cafe deserved better."];'
    +'var FGREAT=["Gauntlet survived. Respect.","Speed AND accuracy. Rare.","You can taste through time pressure."];'
    +'var FGOOD=["Solid run. Not bad under pressure.","Your instincts are decent.","Better than most."];'
    +'var FMID=["The gauntlet won this round.","Pressure got to you.","Maybe read the notes slower... oh wait."];'
    +'var FBAD=["The gauntlet destroyed you.","Your palate panicked.","Maybe try without the timer first.","Brutal. Try again."];'
    +'function pick(a){return a[Math.floor(Math.random()*a.length)];}'
    +'function startGame(){document.getElementById("startScreen").style.display="none";document.getElementById("gameArea").style.display="block";loadRound();timer=setInterval(tick,100);}'
    +'function tick(){timeLeft-=0.1;if(timeLeft<=0){timeLeft=0;clearInterval(timer);showFinal();}document.getElementById("hTime").textContent=Math.ceil(timeLeft);document.getElementById("timerFill").style.width=(timeLeft/60*100)+"%";if(timeLeft<10)document.getElementById("hTime").style.color="#f87171";else if(timeLeft<20)document.getElementById("hTime").style.color="#facc15";}'
    +'function loadRound(){if(round>=total){clearInterval(timer);showFinal();return;}locked=false;var c=AC[round];document.getElementById("gName").textContent=c.n;document.getElementById("gLoc").textContent=c.s+", "+c.c;document.getElementById("gNotes").textContent=c.nt;document.getElementById("gFb").textContent="";document.getElementById("gCard").className="card";document.getElementById("hRound").textContent=(round+1)+"/"+total;}'
    +'function answer(isVisit){if(locked||timeLeft<=0)return;locked=true;var c=AC[round];var isGood=c.sc>=7.0;var correct=(isVisit&&isGood)||(!isVisit&&!isGood);if(correct)score++;document.getElementById("hScore").textContent=score;document.getElementById("gCard").className="card "+(correct?"flash-green":"flash-red");var fb="";if(correct){fb=pick(RIGHT)+" ("+c.sc.toFixed(1)+")";}else if(isVisit&&!isGood){fb=pick(WRONG_V)+" ("+c.sc.toFixed(1)+")";}else{fb=pick(WRONG_S)+" ("+c.sc.toFixed(1)+")";}document.getElementById("gFb").textContent=fb;document.getElementById("gFb").style.color=correct?"#4ade80":"#f87171";if(navigator.vibrate)navigator.vibrate(correct?[30]:20);setTimeout(function(){round++;loadRound();},800);}'
    +'function showFinal(){document.getElementById("gameArea").style.display="none";document.getElementById("final").style.display="block";var answered=round;var pct=answered>0?score/answered*100:0;document.getElementById("fScore").textContent=score+"/"+answered;document.getElementById("fSub").textContent=score+" correct out of "+answered+" answered";document.getElementById("fTime").textContent=answered>=total?"Finished all "+total+"!":"Time ran out at cafe "+(round+1);var emoji=pct>=80?"\\ud83d\\udd25":pct>=60?"\\u26a1":pct>=40?"\\ud83d\\ude13":"\\ud83d\\udca5";var msg=pct>=80?pick(FGREAT):pct>=60?pick(FGOOD):pct>=40?pick(FMID):pick(FBAD);document.getElementById("fEmoji").textContent=emoji;document.getElementById("fMsg").textContent=msg;}'
    +'function shareResult(){var answered=round;var txt="The Gauntlet\\n"+score+"/"+answered+" correct"+(answered>=total?" (finished all "+total+"!)":"")+"\\n\\nCan you survive? koffeereview.com.au/the-gauntlet";if(navigator.share){navigator.share({text:txt}).catch(function(){});}else if(navigator.clipboard){navigator.clipboard.writeText(txt);alert("Copied!");}}'
    +'<\/script></body></html>';

    res.setHeader("Content-Type","text/html; charset=utf-8");
    res.setHeader("Cache-Control","public, s-maxage=60, stale-while-revalidate=300");
    res.status(200).send(html);
  }catch(e){res.status(500).send("Error");}
}
