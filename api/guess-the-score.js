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

    // Shuffle and pick 10
    var shuffled=cafes.sort(function(){return Math.random()-0.5;}).slice(0,20);
    var data=JSON.stringify(shuffled);
    var year=new Date().getFullYear();
    var total=cafes.length;

    var html='<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
    +'<title>Guess the Score | Coffee Game | Koffee Review</title>'
    +'<meta name="description" content="Can you guess how we scored these cafes? Read the tasting notes, guess the score. '+total+'+ cafes in our database.">'
    +'<link rel="canonical" href="https://koffeereview.com.au/guess-the-score">'
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
    +'.game-card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:20px;padding:28px;margin-top:24px;text-align:center}'
    +'.cafe-name{font-family:Bebas Neue,sans-serif;font-size:28px;color:#fff;letter-spacing:1px;margin-bottom:4px}'
    +'.cafe-loc{font-size:13px;color:rgba(255,255,255,0.4);margin-bottom:20px}'
    +'.notes{font-size:14px;color:rgba(255,255,255,0.55);font-style:italic;line-height:1.7;padding:16px;background:rgba(255,255,255,0.02);border-radius:12px;border:1px solid rgba(255,255,255,0.05);margin-bottom:24px;text-align:left}'
    +'.slider-wrap{margin-bottom:16px}'
    +'.slider-val{font-family:Bebas Neue,sans-serif;font-size:52px;color:#E6C073;line-height:1}'
    +'.slider-sub{font-size:12px;color:rgba(255,255,255,0.3);margin-bottom:12px}'
    +'input[type=range]{width:100%;height:8px;border-radius:4px;background:rgba(255,255,255,0.08);outline:none;-webkit-appearance:none;margin:12px 0}'
    +'input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:28px;height:28px;border-radius:50%;background:#E6C073;cursor:pointer;border:3px solid #0a0a0c}'
    +'.guess-btn{width:100%;padding:16px;border-radius:14px;background:linear-gradient(135deg,#c8a96e,#E6C073);border:none;color:#0a0a0c;font-size:15px;font-weight:700;cursor:pointer;font-family:DM Sans,sans-serif;letter-spacing:1px}'
    +'.guess-btn:hover{opacity:0.9}'
    +'.guess-btn:disabled{opacity:0.4;cursor:default}'
    +'.result{display:none;text-align:center;margin-top:16px}'
    +'.result-score{font-family:Bebas Neue,sans-serif;font-size:64px;line-height:1}'
    +'.result-diff{font-size:14px;margin-top:4px}'
    +'.result-link{display:inline-block;margin-top:12px;color:#E6C073;text-decoration:none;font-size:13px}'
    +'.progress{display:flex;gap:6px;justify-content:center;margin-top:20px}'
    +'.dot{width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,0.08)}'
    +'.dot.correct{background:#4ade80}'
    +'.dot.wrong{background:#f87171}'
    +'.dot.current{background:#E6C073}'
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
    +'<div style="text-align:center;padding:24px 0 0"><div style="font-size:10px;letter-spacing:3px;color:rgba(230,192,115,0.5);margin-bottom:6px">COFFEE GAME</div><h1 style="font-family:Bebas Neue,sans-serif;font-size:clamp(28px,8vw,40px);letter-spacing:2px;color:#fff">Guess the Score</h1><p style="font-size:13px;color:rgba(255,255,255,0.4);margin-top:6px">Read the tasting notes. Guess our score. 10 rounds.</p></div>'
    +'<div id="game-area"><div class="game-card"><div class="cafe-name" id="gName"></div><div class="cafe-loc" id="gLoc"></div><div class="notes" id="gNotes"></div><div class="slider-wrap"><div class="slider-val" id="gVal">5.0</div><div class="slider-sub">YOUR GUESS</div><input type="range" id="gSlider" min="1" max="10" step="0.1" value="5.0" oninput="updateSlider()"></div><button class="guess-btn" id="gBtn" onclick="submitGuess()">LOCK IN GUESS</button><div class="result" id="gResult"><div class="result-score" id="rScore"></div><div class="result-diff" id="rDiff"></div><a class="result-link" id="rLink" href="#">View full review &rarr;</a><button class="guess-btn" style="margin-top:16px" id="nextBtn" onclick="nextRound()">NEXT CAFE &rarr;</button></div></div><div class="progress" id="dots"></div></div>'
    +'<div class="final" id="final"><div style="font-size:10px;letter-spacing:3px;color:rgba(230,192,115,0.5);margin-bottom:12px">YOUR RESULT</div><div class="final-score" id="fScore"></div><div class="final-sub" id="fSub"></div><div class="final-msg" id="fMsg"></div><button class="share-btn" onclick="shareResult()">SHARE RESULT</button><br><a href="/guess-the-score" class="play-again">Play Again &rarr;</a><br><a href="/score-battle" class="play-again" style="margin-top:8px">Try Score Battle &rarr;</a></div>'
    +'<footer class="ft"><a href="/explore">Explore</a><a href="/leaderboard">Leaderboard</a><a href="/blog">Blog</a></footer></div>'
    +'<script>'
    +'var AC='+data+';var round=0;var maxR=10;var score=0;var results=[];'
    +'function gc(s){if(s>=9.1)return"#ffffff";if(s>=8.1)return"#4ade80";if(s>=7.5)return"#2dd4bf";if(s>=7.1)return"#2dd4bf";if(s>=6.5)return"#facc15";if(s>=6.1)return"#facc15";if(s>=5.5)return"#fb923c";if(s>=5.1)return"#fb923c";return"#f87171";}'
    +'function updateSlider(){var v=document.getElementById("gSlider").value;document.getElementById("gVal").textContent=parseFloat(v).toFixed(1);}'
    +'function loadRound(){if(round>=maxR||round>=AC.length){showFinal();return;}var c=AC[round];document.getElementById("gName").textContent=c.n;document.getElementById("gLoc").textContent=c.s+", "+c.c;document.getElementById("gNotes").textContent=c.nt;document.getElementById("gSlider").value=5;document.getElementById("gVal").textContent="5.0";document.getElementById("gResult").style.display="none";document.getElementById("gBtn").style.display="block";document.getElementById("gBtn").disabled=false;renderDots();}'
    +'function submitGuess(){var c=AC[round];var guess=parseFloat(document.getElementById("gSlider").value);var real=c.sc;var diff=Math.abs(guess-real);var correct=diff<=0.5;if(correct)score++;results.push(correct);var col=gc(real);document.getElementById("rScore").textContent=real.toFixed(1);document.getElementById("rScore").style.color=col;document.getElementById("rDiff").textContent=correct?"Nailed it! Within 0.5 points":"You guessed "+guess.toFixed(1)+" — off by "+diff.toFixed(1);document.getElementById("rDiff").style.color=correct?"#4ade80":"#f87171";document.getElementById("rLink").href="/review/"+c.sl;document.getElementById("gResult").style.display="block";document.getElementById("gBtn").style.display="none";renderDots();if(navigator.vibrate)navigator.vibrate(correct?[40,20,40]:20);}'
    +'function nextRound(){round++;loadRound();}'
    +'function renderDots(){var d="";for(var i=0;i<Math.min(maxR,AC.length);i++){var cls="dot";if(i<results.length)cls+=" "+(results[i]?"correct":"wrong");else if(i===round)cls+=" current";d+="<div class=\\""+cls+"\\"></div>";}document.getElementById("dots").innerHTML=d;}'
    +'function showFinal(){document.getElementById("game-area").style.display="none";document.getElementById("final").style.display="block";var total=Math.min(maxR,AC.length);document.getElementById("fScore").textContent=score+"/"+total;document.getElementById("fSub").textContent="You matched "+score+" out of "+total+" scores within 0.5 points";var pct=score/total*100;var msg=pct>=80?"Coffee Expert! You know your stuff.":pct>=60?"Solid palate. You can taste quality.":pct>=40?"Not bad. Keep tasting.":"Keep practising! Try visiting some 7.5+ cafes.";document.getElementById("fMsg").textContent=msg;}'
    +'function shareResult(){var total=Math.min(maxR,AC.length);var txt="I matched "+score+"/"+total+" Koffee Review scores! Can you beat me? koffeereview.com.au/guess-the-score";if(navigator.share){navigator.share({text:txt}).catch(function(){});}else if(navigator.clipboard){navigator.clipboard.writeText(txt);alert("Copied to clipboard!");}}'
    +'loadRound();'
    +'<\/script></body></html>';

    res.setHeader("Content-Type","text/html; charset=utf-8");
    res.setHeader("Cache-Control","public, s-maxage=60, stale-while-revalidate=300");
    res.status(200).send(html);
  }catch(e){res.status(500).send("Error");}
}
