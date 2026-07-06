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
    var cafes=[];var suburbSet={};
    for(var i=1;i<lines.length;i++){try{var p=splitCSV(lines[i]);var n=(p[ni]||"").trim();if(!n)continue;var sc=parseFloat(p[sci])||0;if(sc<=0)continue;
    var city=(p[ci]||"").trim();if(SPAIN.indexOf(city.toLowerCase())!==-1)continue;
    var sub=(p[si]||"").trim();var notes=(p[noi]||"").trim();if(!notes||notes.length<15||!sub)continue;
    suburbSet[sub]=true;
    cafes.push({n:n,s:sub,c:city,sc:sc,nt:notes.substring(0,120),sl:makeSlug(n,sub)});}catch(e){}}
    var allSuburbs=Object.keys(suburbSet);
    // Build rounds: each has a cafe + 4 suburb options (1 correct, 3 wrong)
    var shuffled=cafes.sort(function(){return Math.random()-0.5;}).slice(0,15);
    var rounds=shuffled.map(function(cafe){
      var correct=cafe.s;
      var wrongs=allSuburbs.filter(function(s){return s!==correct;}).sort(function(){return Math.random()-0.5;}).slice(0,3);
      var options=[correct].concat(wrongs).sort(function(){return Math.random()-0.5;});
      return{n:cafe.n,s:cafe.s,c:cafe.c,sc:cafe.sc,nt:cafe.nt,sl:cafe.sl,opts:options};
    });
    var data=JSON.stringify(rounds);

    var html='<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
    +'<title>Guess the Suburb | Coffee Game | Koffee Review</title>'
    +'<meta name="description" content="Can you guess which suburb this cafe is in from the tasting notes? Test your Brisbane coffee knowledge.">'
    +'<link rel="canonical" href="https://koffeereview.com.au/guess-the-suburb"><link rel="icon" href="/logo.webp">'
    +'<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">'
    +'<style>'
    +'*{margin:0;padding:0;box-sizing:border-box}'
    +'body{background:#0a0a0c;color:#e2e8f0;font-family:DM Sans,sans-serif;min-height:100vh;-webkit-font-smoothing:antialiased}'
    +'.c{max-width:520px;margin:0 auto;padding:0 20px 60px}'
    +'.nav{display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid rgba(255,255,255,0.06)}'
    +'.nav-logo{display:flex;align-items:center;gap:10px;text-decoration:none}.nav-logo img{width:34px;height:34px;border-radius:50%}.nav-logo span{font-family:Bebas Neue,sans-serif;font-size:15px;letter-spacing:3px;color:#E6C073}'
    +'.card{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:20px;padding:28px;margin-top:24px;text-align:center}'
    +'.badge{display:inline-block;padding:4px 14px;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:2px;background:rgba(167,139,250,0.1);color:#a78bfa;border:1px solid rgba(167,139,250,0.2);margin-bottom:16px}'
    +'.cafe-name{font-family:Bebas Neue,sans-serif;font-size:28px;color:#fff;letter-spacing:1px;margin-bottom:6px}'
    +'.cafe-score{font-size:13px;color:rgba(255,255,255,0.4);margin-bottom:18px}'
    +'.notes{font-size:14px;color:rgba(255,255,255,0.65);font-style:italic;line-height:1.7;padding:16px;background:rgba(255,255,255,0.03);border-radius:14px;border:1px solid rgba(255,255,255,0.06);margin-bottom:24px;text-align:left}'
    +'.q-text{font-size:14px;color:rgba(255,255,255,0.5);margin-bottom:16px;letter-spacing:1px}'
    +'.opts{display:grid;grid-template-columns:1fr 1fr;gap:8px}'
    +'.opt-btn{padding:16px;border-radius:14px;background:rgba(255,255,255,0.04);border:2px solid rgba(255,255,255,0.08);color:#fff;font-size:14px;font-weight:600;cursor:pointer;font-family:DM Sans,sans-serif;transition:all 0.15s}'
    +'.opt-btn:hover{border-color:rgba(167,139,250,0.4);background:rgba(167,139,250,0.06)}'
    +'.opt-btn:active{transform:scale(0.97)}'
    +'.opt-btn.correct{border-color:#4ade80;background:rgba(74,222,128,0.1);color:#4ade80}'
    +'.opt-btn.wrong{border-color:#f87171;background:rgba(248,113,113,0.06);color:#f87171;opacity:0.5}'
    +'.opt-btn.actual{border-color:#4ade80;background:rgba(74,222,128,0.1);color:#4ade80}'
    +'.opt-btn:disabled{cursor:default}'
    +'.result-msg{font-size:16px;font-weight:600;margin-top:16px;min-height:24px}'
    +'.next-btn{width:100%;padding:16px;border-radius:14px;background:linear-gradient(135deg,#9333ea,#a78bfa);border:none;color:#fff;font-size:15px;font-weight:700;cursor:pointer;font-family:DM Sans,sans-serif;margin-top:16px;display:none}'
    +'.progress{display:flex;gap:6px;justify-content:center;margin-top:20px}'
    +'.dot{width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,0.08);transition:all 0.3s}'
    +'.dot.correct{background:#4ade80}.dot.wrong{background:#f87171}.dot.current{background:#a78bfa}'
    +'.final{display:none;text-align:center;padding:40px 0}'
    +'.final-score{font-family:Bebas Neue,sans-serif;font-size:80px;color:#a78bfa}'
    +'.final-msg{font-size:22px;font-weight:700;color:#fff;margin-top:16px}'
    +'.share-btn{display:inline-block;margin-top:24px;padding:16px 36px;border-radius:14px;background:linear-gradient(135deg,#9333ea,#a78bfa);color:#fff;font-size:15px;font-weight:700;cursor:pointer;border:none;font-family:DM Sans,sans-serif}'
    +'.play-again{display:inline-block;margin-top:14px;color:#a78bfa;text-decoration:none;font-size:14px}'
    +'.ft{margin-top:32px;padding:20px 0;border-top:1px solid rgba(255,255,255,0.04);text-align:center;font-size:11px;color:rgba(255,255,255,0.3)}.ft a{color:rgba(255,255,255,0.5);text-decoration:none;margin:0 8px}'
    +'</style></head><body><div class="c">'
    +'<nav class="nav"><a href="/" class="nav-logo"><img src="/logo.webp" alt="KR"><span>KOFFEE REVIEW</span></a></nav>'
    +'<div style="text-align:center;padding:24px 0 0"><div style="font-size:11px;letter-spacing:3px;color:rgba(167,139,250,0.6);margin-bottom:6px">COFFEE GAME</div><h1 style="font-family:Bebas Neue,sans-serif;font-size:clamp(30px,8vw,42px);letter-spacing:2px;color:#fff">Guess the Suburb</h1><p style="font-size:14px;color:rgba(255,255,255,0.45);margin-top:8px">Read the cafe name and notes. Pick the right suburb. How well do you know Brisbane coffee?</p></div>'
    +'<div id="gameArea"><div class="card"><div class="badge" id="rBadge">ROUND 1 OF 10</div><div class="cafe-name" id="gName"></div><div class="cafe-score" id="gScore"></div><div class="notes" id="gNotes"></div><div class="q-text">Which suburb is this cafe in?</div><div class="opts" id="gOpts"></div><div class="result-msg" id="rMsg"></div><button class="next-btn" id="nextBtn" onclick="nextRound()">NEXT ROUND</button></div><div class="progress" id="dots"></div></div>'
    +'<div class="final" id="final"><div style="font-size:48px;margin-bottom:12px" id="fEmoji"></div><div class="final-score" id="fScore"></div><div style="font-size:16px;color:rgba(255,255,255,0.5);margin-top:8px" id="fSub"></div><div class="final-msg" id="fMsg"></div><button class="share-btn" onclick="shareResult()">SHARE YOUR SCORE</button><br><a href="/guess-the-suburb" class="play-again">Play Again</a><br><a href="/guess-the-score" class="play-again" style="margin-top:6px;color:#E6C073">Try Guess the Score</a><br><a href="/score-battle" class="play-again" style="margin-top:6px;color:#E6C073">Try Score Battle</a></div>'
    +'<footer class="ft"><a href="/explore">Explore</a><a href="/leaderboard">Leaderboard</a><a href="/blog">Blog</a></footer></div>'
    +'<script>'
    +'var R='+data+';var round=0;var maxR=Math.min(10,R.length);var score=0;var results=[];var locked=false;'
    +'var CORRECT=["Local knowledge!","You know your suburbs.","Nailed it.","Geographic genius.","Coffee cartographer.","Do you live there?","Too easy for you."];'
    +'var WRONG=["Not even close.","The coffee GPS is broken.","Maybe visit more cafes.","Geography is hard.","That suburb wishes.","Confidently incorrect.","The baristas are judging you."];'
    +'var FGREAT=["You ARE the suburb guide.","Google Maps has nothing on you.","Local legend status."];'
    +'var FGOOD=["Solid suburb knowledge.","You get around Brisbane.","Above average navigator."];'
    +'var FMID=["Tourist energy.","Maybe explore more suburbs.","The map app stays on."];'
    +'var FBAD=["Have you been to Brisbane?","GPS required at all times.","The suburbs do not know you either."];'
    +'function pick(a){return a[Math.floor(Math.random()*a.length)];}'
    +'function loadRound(){if(round>=maxR){showFinal();return;}locked=false;var r=R[round];document.getElementById("rBadge").textContent="ROUND "+(round+1)+" OF "+maxR;document.getElementById("gName").textContent=r.n;document.getElementById("gScore").textContent=r.sc.toFixed(1)+"/10 \\u00b7 "+r.c;document.getElementById("gNotes").textContent=r.nt;document.getElementById("rMsg").textContent="";document.getElementById("nextBtn").style.display="none";var h="";r.opts.forEach(function(opt,i){h+="<button class=\\"opt-btn\\" id=\\"opt"+i+"\\" onclick=\\"guess("+i+",\'"+opt.replace(/\'/g,"")+"\')\\">"+ opt+"</button>";});document.getElementById("gOpts").innerHTML=h;renderDots();}'
    +'function guess(i,picked){if(locked)return;locked=true;var r=R[round];var correct=picked===r.s;if(correct)score++;results.push(correct);var btns=document.querySelectorAll(".opt-btn");btns.forEach(function(b){b.disabled=true;var txt=b.textContent;if(txt===r.s)b.className="opt-btn actual";else if(b.id==="opt"+i&&!correct)b.className="opt-btn wrong";else b.className="opt-btn wrong";});document.getElementById("rMsg").textContent=correct?pick(CORRECT):pick(WRONG)+" It was "+r.s+".";document.getElementById("rMsg").style.color=correct?"#4ade80":"#f87171";document.getElementById("nextBtn").style.display="block";renderDots();if(navigator.vibrate)navigator.vibrate(correct?[40,20,40]:20);}'
    +'function nextRound(){round++;loadRound();}'
    +'function renderDots(){var d="";for(var i=0;i<maxR;i++){var cls="dot";if(i<results.length)cls+=" "+(results[i]?"correct":"wrong");else if(i===round)cls+=" current";d+="<div class=\\""+cls+"\\"></div>";}document.getElementById("dots").innerHTML=d;}'
    +'function showFinal(){document.getElementById("gameArea").style.display="none";document.getElementById("final").style.display="block";var pct=score/maxR*100;document.getElementById("fScore").textContent=score+"/"+maxR;document.getElementById("fSub").textContent=score+" suburbs correctly identified";var emoji=pct>=80?"\\ud83c\\udf0f":pct>=60?"\\ud83d\\udccd":pct>=40?"\\ud83e\\udded":"\\ud83d\\ude35";var msg=pct>=80?pick(FGREAT):pct>=60?pick(FGOOD):pct>=40?pick(FMID):pick(FBAD);document.getElementById("fEmoji").textContent=emoji;document.getElementById("fMsg").textContent=msg;}'
    +'function shareResult(){var txt="Guess the Suburb\\n"+score+"/"+maxR+" correct\\n\\nHow well do you know Brisbane coffee? koffeereview.com.au/guess-the-suburb";if(navigator.share){navigator.share({text:txt}).catch(function(){});}else if(navigator.clipboard){navigator.clipboard.writeText(txt);alert("Copied!");}}'
    +'loadRound();'
    +'<\/script></body></html>';

    res.setHeader("Content-Type","text/html; charset=utf-8");
    res.setHeader("Cache-Control","public, s-maxage=60, stale-while-revalidate=300");
    res.status(200).send(html);
  }catch(e){res.status(500).send("Error");}
}
