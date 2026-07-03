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
    var notes=(p[noi]||"").trim();if(!notes||notes.length<20)continue;
    cafes.push({n:n,s:(p[si]||"").trim(),c:city,sc:sc,nt:notes.substring(0,120),sl:makeSlug(n,(p[si]||"").trim())});}catch(e){}}
    var shuffled=cafes.sort(function(){return Math.random()-0.5;}).slice(0,20);
    var data=JSON.stringify(shuffled);

    var html='<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
    +'<title>Guess the Score | Coffee Game | Koffee Review</title>'
    +'<meta name="description" content="Can you guess how we scored these cafes? Read the tasting notes, guess the score.">'
    +'<link rel="canonical" href="https://koffeereview.com.au/guess-the-score"><link rel="icon" href="/logo.webp">'
    +'<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">'
    +'<style>'
    +'*{margin:0;padding:0;box-sizing:border-box}'
    +'body{background:#111827;color:#e2e8f0;font-family:DM Sans,sans-serif;min-height:100vh;-webkit-font-smoothing:antialiased}'
    +'.c{max-width:520px;margin:0 auto;padding:0 20px 60px}'
    +'.nav{display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid rgba(255,255,255,0.08)}'
    +'.nav-logo{display:flex;align-items:center;gap:10px;text-decoration:none}.nav-logo img{width:34px;height:34px;border-radius:50%}.nav-logo span{font-family:Bebas Neue,sans-serif;font-size:15px;letter-spacing:3px;color:#E6C073}'
    +'.game-card{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:20px;padding:28px;margin-top:24px;text-align:center}'
    +'.round-badge{display:inline-block;padding:4px 14px;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:2px;background:rgba(230,192,115,0.1);color:#E6C073;border:1px solid rgba(230,192,115,0.2);margin-bottom:16px}'
    +'.cafe-name{font-family:Bebas Neue,sans-serif;font-size:30px;color:#fff;letter-spacing:1px;margin-bottom:4px}'
    +'.cafe-loc{font-size:14px;color:rgba(255,255,255,0.5);margin-bottom:20px}'
    +'.notes{font-size:15px;color:rgba(255,255,255,0.7);font-style:italic;line-height:1.7;padding:18px;background:rgba(255,255,255,0.04);border-radius:14px;border:1px solid rgba(255,255,255,0.08);margin-bottom:24px;text-align:left}'
    +'.slider-val{font-family:Bebas Neue,sans-serif;font-size:56px;color:#E6C073;line-height:1}'
    +'.slider-sub{font-size:13px;color:rgba(255,255,255,0.4);margin-bottom:12px;letter-spacing:2px}'
    +'input[type=range]{width:100%;height:10px;border-radius:5px;background:rgba(255,255,255,0.1);outline:none;-webkit-appearance:none;margin:14px 0}'
    +'input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#c8a96e,#E6C073);cursor:pointer;border:3px solid #111827;box-shadow:0 0 10px rgba(230,192,115,0.3)}'
    +'.guess-btn{width:100%;padding:18px;border-radius:14px;background:linear-gradient(135deg,#c8a96e,#E6C073);border:none;color:#111827;font-size:16px;font-weight:700;cursor:pointer;font-family:DM Sans,sans-serif;letter-spacing:1px;transition:transform 0.1s}'
    +'.guess-btn:hover{transform:scale(1.02)}.guess-btn:active{transform:scale(0.98)}'
    +'.result{display:none;text-align:center;margin-top:20px}'
    +'.result-emoji{font-size:48px;margin-bottom:8px}'
    +'.result-score{font-family:Bebas Neue,sans-serif;font-size:68px;line-height:1}'
    +'.result-msg{font-size:16px;font-weight:600;margin-top:8px}'
    +'.result-diff{font-size:14px;color:rgba(255,255,255,0.5);margin-top:4px}'
    +'.result-link{display:inline-block;margin-top:14px;color:#E6C073;text-decoration:none;font-size:13px;border-bottom:1px solid rgba(230,192,115,0.3)}'
    +'.progress{display:flex;gap:6px;justify-content:center;margin-top:24px}'
    +'.dot{width:12px;height:12px;border-radius:50%;background:rgba(255,255,255,0.1);transition:all 0.3s}'
    +'.dot.correct{background:#4ade80;box-shadow:0 0 6px rgba(74,222,128,0.4)}'
    +'.dot.wrong{background:#f87171;box-shadow:0 0 6px rgba(248,113,113,0.4)}'
    +'.dot.current{background:#E6C073;box-shadow:0 0 6px rgba(230,192,115,0.4)}'
    +'.final{display:none;text-align:center;padding:40px 0}'
    +'.final-emoji{font-size:64px;margin-bottom:12px}'
    +'.final-score{font-family:Bebas Neue,sans-serif;font-size:80px;color:#E6C073}'
    +'.final-sub{font-size:16px;color:rgba(255,255,255,0.5);margin-top:8px}'
    +'.final-msg{font-size:22px;font-weight:700;color:#fff;margin-top:16px}'
    +'.share-btn{display:inline-block;margin-top:24px;padding:16px 36px;border-radius:14px;background:linear-gradient(135deg,#c8a96e,#E6C073);color:#111827;font-size:15px;font-weight:700;cursor:pointer;border:none;font-family:DM Sans,sans-serif}'
    +'.play-again{display:inline-block;margin-top:14px;color:#E6C073;text-decoration:none;font-size:14px}'
    +'.ft{margin-top:32px;padding:20px 0;border-top:1px solid rgba(255,255,255,0.06);text-align:center;font-size:11px;color:rgba(255,255,255,0.3)}'
    +'.ft a{color:rgba(255,255,255,0.5);text-decoration:none;margin:0 8px}'
    +'</style></head><body><div class="c">'
    +'<nav class="nav"><a href="/" class="nav-logo"><img src="/logo.webp" alt="KR"><span>KOFFEE REVIEW</span></a></nav>'
    +'<div style="text-align:center;padding:24px 0 0"><div style="font-size:11px;letter-spacing:3px;color:rgba(230,192,115,0.6);margin-bottom:6px">COFFEE GAME</div><h1 style="font-family:Bebas Neue,sans-serif;font-size:clamp(30px,8vw,42px);letter-spacing:2px;color:#fff">Guess the Score</h1><p style="font-size:14px;color:rgba(255,255,255,0.5);margin-top:8px">Read the tasting notes. Guess our score. How well do you know coffee?</p></div>'
    +'<div id="game-area"><div class="game-card"><div class="round-badge" id="roundBadge">ROUND 1 OF 10</div><div class="cafe-name" id="gName"></div><div class="cafe-loc" id="gLoc"></div><div class="notes" id="gNotes"></div><div class="slider-wrap"><div class="slider-val" id="gVal">5.0</div><div class="slider-sub">YOUR GUESS</div><input type="range" id="gSlider" min="1" max="10" step="0.1" value="5.0" oninput="updateSlider()"></div><button class="guess-btn" id="gBtn" onclick="submitGuess()">LOCK IT IN</button><div class="result" id="gResult"><div class="result-emoji" id="rEmoji"></div><div class="result-score" id="rScore"></div><div class="result-msg" id="rMsg"></div><div class="result-diff" id="rDiff"></div><a class="result-link" id="rLink" href="#">See the full review &rarr;</a><button class="guess-btn" style="margin-top:18px" id="nextBtn" onclick="nextRound()">NEXT CAFE &rarr;</button></div></div><div class="progress" id="dots"></div></div>'
    +'<div class="final" id="final"><div class="final-emoji" id="fEmoji"></div><div class="final-score" id="fScore"></div><div class="final-sub" id="fSub"></div><div class="final-msg" id="fMsg"></div><button class="share-btn" onclick="shareResult()">SHARE YOUR SCORE</button><br><a href="/guess-the-score" class="play-again">Play Again</a><br><a href="/score-battle" class="play-again" style="margin-top:6px">Try Score Battle &rarr;</a><br><a href="/explore" class="play-again" style="margin-top:6px">Explore Koffee Review &rarr;</a></div>'
    +'<footer class="ft"><a href="/explore">Explore</a><a href="/leaderboard">Leaderboard</a><a href="/blog">Blog</a></footer></div>'
    +'<script>'
    +'var AC='+data+';var round=0;var maxR=10;var score=0;var results=[];'
    +'var NAILED=["Nailed it!","Spot on!","Are you a barista?","You can taste through text!","Coffee psychic!","Absolutely crushed it.","Your palate is scary good."];'
    +'var CLOSE=["So close!","Almost had it.","Off by a hair.","Not bad at all.","Close enough to count... but we are strict."];'
    +'var FAR=["Yikes.","Did you read the notes?","That coffee is crying right now.","We need to talk about your palate.","Have you tried actually drinking coffee?","Bold guess. Wrong, but bold.","The coffee gods are judging you."];'
    +'var FINAL_GREAT=["Coffee Oracle.","You should be reviewing cafes.","Hire this person.","Palate of the year."];'
    +'var FINAL_GOOD=["Solid coffee instincts.","You know your stuff.","Above average palate.","Not bad at all."];'
    +'var FINAL_MID=["Room for improvement.","Keep tasting.","Your palate needs a warm up.","Try visiting some 7.5+ cafes."];'
    +'var FINAL_BAD=["We are worried about you.","Maybe stick to tea?","Your palate called. It wants a refund.","Have you considered decaf?"];'
    +'function pick(arr){return arr[Math.floor(Math.random()*arr.length)];}'
    +'function gc(s){if(s>=9.1)return"#ffffff";if(s>=8.1)return"#4ade80";if(s>=7.5)return"#2dd4bf";if(s>=7.1)return"#2dd4bf";if(s>=6.5)return"#facc15";if(s>=6.1)return"#facc15";if(s>=5.5)return"#fb923c";if(s>=5.1)return"#fb923c";return"#f87171";}'
    +'function updateSlider(){var v=document.getElementById("gSlider").value;document.getElementById("gVal").textContent=parseFloat(v).toFixed(1);}'
    +'function loadRound(){if(round>=maxR||round>=AC.length){showFinal();return;}var c=AC[round];document.getElementById("roundBadge").textContent="ROUND "+(round+1)+" OF "+Math.min(maxR,AC.length);document.getElementById("gName").textContent=c.n;document.getElementById("gLoc").textContent=c.s+", "+c.c;document.getElementById("gNotes").textContent=c.nt;document.getElementById("gSlider").value=5;document.getElementById("gVal").textContent="5.0";document.getElementById("gResult").style.display="none";document.getElementById("gBtn").style.display="block";renderDots();}'
    +'function submitGuess(){var c=AC[round];var guess=parseFloat(document.getElementById("gSlider").value);var real=c.sc;var diff=Math.abs(guess-real);var correct=diff<=0.5;if(correct)score++;results.push(correct);var col=gc(real);var emoji=correct?"\\ud83c\\udfaf":diff<=1.0?"\\ud83e\\udd14":"\\ud83d\\ude31";var msg=correct?pick(NAILED):diff<=1.0?pick(CLOSE):pick(FAR);document.getElementById("rEmoji").textContent=emoji;document.getElementById("rScore").textContent=real.toFixed(1);document.getElementById("rScore").style.color=col;document.getElementById("rMsg").textContent=msg;document.getElementById("rMsg").style.color=correct?"#4ade80":diff<=1.0?"#facc15":"#f87171";document.getElementById("rDiff").textContent="You guessed "+guess.toFixed(1)+" \\u2014 "+(correct?"within 0.5!":"off by "+diff.toFixed(1));document.getElementById("rLink").href="/review/"+c.sl;document.getElementById("gResult").style.display="block";document.getElementById("gBtn").style.display="none";renderDots();if(navigator.vibrate)navigator.vibrate(correct?[40,20,40]:20);}'
    +'function nextRound(){round++;loadRound();}'
    +'function renderDots(){var d="";for(var i=0;i<Math.min(maxR,AC.length);i++){var cls="dot";if(i<results.length)cls+=" "+(results[i]?"correct":"wrong");else if(i===round)cls+=" current";d+="<div class=\\""+cls+"\\"></div>";}document.getElementById("dots").innerHTML=d;}'
    +'function showFinal(){document.getElementById("game-area").style.display="none";document.getElementById("final").style.display="block";var total=Math.min(maxR,AC.length);var pct=score/total*100;document.getElementById("fScore").textContent=score+"/"+total;document.getElementById("fSub").textContent=score+" matched within 0.5 points";var emoji=pct>=80?"\\ud83c\\udfc6":pct>=60?"\\u2615":pct>=40?"\\ud83e\\udd14":"\\ud83d\\ude2c";var msg=pct>=80?pick(FINAL_GREAT):pct>=60?pick(FINAL_GOOD):pct>=40?pick(FINAL_MID):pick(FINAL_BAD);document.getElementById("fEmoji").textContent=emoji;document.getElementById("fMsg").textContent=msg;}'
    +'function shareResult(){var total=Math.min(maxR,AC.length);var dots=results.map(function(r){return r?"\\ud83d\\udfe2":"\\ud83d\\udd34";}).join("");var txt="Guess the Score \\u2615\\n"+dots+"\\n"+score+"/"+total+" matched\\n\\nCan you beat me? koffeereview.com.au/guess-the-score";if(navigator.share){navigator.share({text:txt}).catch(function(){});}else if(navigator.clipboard){navigator.clipboard.writeText(txt);alert("Copied to clipboard!");}}'
    +'loadRound();'
    +'<\/script></body></html>';

    res.setHeader("Content-Type","text/html; charset=utf-8");
    res.setHeader("Cache-Control","public, s-maxage=60, stale-while-revalidate=300");
    res.status(200).send(html);
  }catch(e){res.status(500).send("Error");}
}
