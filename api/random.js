const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYEU8Khk3R5I879v3FcXPqhq0aCXa2ZWM1BwwJOyUitx2Boak_AFTOkwvB8qQrKIeU55NM4htFjHbI/pub?gid=0&single=true&output=csv";

function esc(s){return(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
function makeSlug(n,s){return(n+"-"+s).toLowerCase().replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-");}
function splitCSV(line){var r=[],c="",q=false;for(var i=0;i<line.length;i++){var ch=line[i];if(ch==='"')q=!q;else if(ch===","&&!q){r.push(c.trim());c="";}else c+=ch;}r.push(c.trim());return r;}
function gc(s){if(s>=9)return"#ffffff";if(s>=8)return"#4ade80";if(s>=7)return"#2dd4bf";if(s>=6)return"#facc15";if(s>=5)return"#fb923c";return"#f87171";}
function gv(s){if(s>=9.1)return"ELITE";if(s>=8.1)return"GREAT";if(s>=7.5)return"MUST VISIT";if(s>=7.1)return"SOLID";if(s>=6.5)return"DECENT";if(s>=5.1)return"JUST OKAY";return"AVOID";}

function parseCSV(text){
  var lines=text.split("\n").filter(function(l){return l.trim();});
  if(lines.length<2)return[];
  var h=splitCSV(lines[0]).map(function(x){return x.trim().toLowerCase();});
  var ni=h.indexOf("name"),si=h.indexOf("suburb"),ci=h.indexOf("city"),sci=h.indexOf("score"),pi=h.indexOf("price"),noi=h.indexOf("notes");
  if(ni===-1||si===-1)return[];
  var out=[];
  for(var i=1;i<lines.length;i++){try{var p=splitCSV(lines[i]);var n=(p[ni]||"").trim();if(!n)continue;var sc=parseFloat(p[sci])||0;if(sc<=0)continue;
  var city=(p[ci]||"").trim().toLowerCase();if(["barcelona","catalonia","spain"].indexOf(city)!==-1)continue;
  out.push({name:n,suburb:(p[si]||"").trim(),city:(p[ci]||"").trim(),score:sc,price:(p[pi]||"$$$").trim(),notes:(p[noi]||"").trim()});}catch(e){}}
  return out;
}

export default async function handler(req,res){
  try{
    var response=await fetch(SHEET_URL);var text=await response.text();var cafes=parseCSV(text);
    cafes.sort(function(a,b){return b.score-a.score;});
    var cities=[...new Set(cafes.map(function(c){return c.city;}))].filter(Boolean).sort();
    var suburbs=[...new Set(cafes.map(function(c){return c.suburb;}))].filter(Boolean).sort();

    var cafeData=JSON.stringify(cafes.map(function(c){return{n:esc(c.name),s:esc(c.suburb),c:esc(c.city),sc:c.score,p:esc(c.price),nt:esc((c.notes||"").substring(0,100)),sl:makeSlug(c.name,c.suburb)};})).replace(/</g,"\\u003c");

    var cityOpts=cities.map(function(c){return'<option value="'+esc(c)+'">'+esc(c)+'</option>';}).join("");

    var title="Random Cafe Picker | Spin the Wheel | Koffee Review";
    var desc="Can't decide where to get coffee? Spin the wheel and let fate pick your next cafe from "+cafes.length+"+ reviewed across Australia.";

    var html=`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${desc}">
  <link rel="canonical" href="https://koffeereview.com.au/random">
  <meta property="og:title" content="${title}"><meta property="og:description" content="${desc}">
  <meta property="og:url" content="https://koffeereview.com.au/random"><meta property="og:image" content="https://koffeereview.com.au/logo.webp">
  <link rel="icon" href="/logo.webp">
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"WebPage","name":"${title}","description":"${desc}","url":"https://koffeereview.com.au/random"}<\/script>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{background:#0d0d0f;color:#d4d4d4;font-family:'DM Sans',sans-serif;min-height:100vh;-webkit-font-smoothing:antialiased;overflow-x:hidden}
    .c{max-width:520px;margin:0 auto;padding:0 20px}
    nav{display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid rgba(230,192,115,0.08)}.nav-logo{display:flex;align-items:center;gap:10px;text-decoration:none}.nav-logo img{width:34px;height:34px;border-radius:50%;border:1.5px solid rgba(230,192,115,0.25)}.nav-logo span{font-family:'Bebas Neue',sans-serif;font-size:15px;letter-spacing:3px;color:#E6C073}.nav-links{display:flex;gap:14px}.nav-links a{font-size:12px;color:rgba(255,255,255,0.45);text-decoration:none}.nav-links a:hover{color:#E6C073}
    .hero{text-align:center;padding:28px 0 16px}
    h1{font-family:'Bebas Neue',sans-serif;font-size:clamp(28px,7vw,42px);letter-spacing:3px;color:#fff;margin-bottom:6px}
    .hero-sub{font-size:13px;color:rgba(255,255,255,0.45);line-height:1.6}
    .gold-line{height:1px;background:linear-gradient(90deg,transparent,rgba(230,192,115,0.3),transparent);margin:14px 0}
    .filters{display:flex;gap:8px;justify-content:center;margin:16px 0;flex-wrap:wrap}
    select{background:#1a1a1e;border:1px solid rgba(255,255,255,0.12);color:#fff;padding:8px 14px;border-radius:22px;font-size:12px;cursor:pointer;font-family:'DM Sans',sans-serif;outline:none;-webkit-appearance:none;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23999'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;padding-right:30px}select option{background:#1a1a1e;color:#fff}
    .score-pill{display:flex;gap:6px;justify-content:center;margin:8px 0}
    .sp{padding:6px 14px;border-radius:22px;border:1px solid rgba(255,255,255,0.08);background:transparent;color:rgba(255,255,255,0.45);font-size:11px;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all 0.2s}.sp:hover{border-color:rgba(230,192,115,0.25);color:#E6C073}.sp.on{background:linear-gradient(135deg,rgba(230,192,115,0.15),rgba(230,192,115,0.05));border-color:rgba(230,192,115,0.3);color:#E6C073}

    /* WHEEL */
    .wheel-wrap{position:relative;width:280px;height:280px;margin:24px auto}
    .wheel-outer{width:280px;height:280px;border-radius:50%;border:3px solid rgba(230,192,115,0.2);position:relative;overflow:hidden;background:#111113}
    .wheel-inner{width:100%;height:100%;position:absolute;top:0;left:0;transition:transform 4s cubic-bezier(0.17,0.67,0.12,0.99)}
    .wheel-center{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:70px;height:70px;border-radius:50%;background:linear-gradient(135deg,#c8a96e,#f5e6c8);display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:10;box-shadow:0 4px 20px rgba(230,192,115,0.3);transition:transform 0.15s}
    .wheel-center:hover{transform:translate(-50%,-50%) scale(1.05)}
    .wheel-center:active{transform:translate(-50%,-50%) scale(0.95)}
    .wheel-text{font-family:'Bebas Neue',sans-serif;font-size:14px;letter-spacing:2px;color:#0d0d0f;text-align:center;line-height:1.2}
    .wheel-pointer{position:absolute;top:-8px;left:50%;transform:translateX(-50%);width:0;height:0;border-left:10px solid transparent;border-right:10px solid transparent;border-top:16px solid #E6C073;z-index:5;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.5))}
    .wheel-glow{position:absolute;top:0;left:0;width:100%;height:100%;border-radius:50%;box-shadow:0 0 0 0 rgba(230,192,115,0);transition:box-shadow 0.3s}
    .wheel-glow.spinning{box-shadow:0 0 40px 8px rgba(230,192,115,0.15)}

    /* RESULT */
    .result{margin:20px 0;opacity:0;transform:translateY(10px);transition:all 0.4s ease}
    .result.show{opacity:1;transform:translateY(0)}
    .result-card{background:linear-gradient(135deg,rgba(230,192,115,0.06),rgba(230,192,115,0.02));border:1px solid rgba(230,192,115,0.25);border-radius:16px;padding:24px;text-align:center}
    .result-label{font-size:10px;letter-spacing:4px;color:#E6C073;margin-bottom:12px;font-weight:700}
    .result-score{font-family:'Bebas Neue',sans-serif;font-size:52px;line-height:1}
    .result-name{font-size:18px;font-weight:700;color:#fff;margin-top:8px}
    .result-loc{font-size:13px;color:rgba(255,255,255,0.45);margin-top:4px}
    .result-verdict{display:inline-block;padding:4px 12px;border-radius:6px;font-size:10px;font-weight:700;letter-spacing:2px;color:#000;margin-top:10px}
    .result-notes{font-size:13px;color:rgba(255,255,255,0.5);font-style:italic;margin-top:12px;line-height:1.6;text-align:left;border-left:2px solid;padding-left:14px}
    .result-btns{display:flex;gap:8px;justify-content:center;margin-top:16px}
    .rb{padding:10px 20px;border-radius:10px;font-size:12px;font-weight:700;text-decoration:none;font-family:'DM Sans',sans-serif;cursor:pointer;border:none;transition:all 0.15s}
    .rb-gold{background:linear-gradient(135deg,#c8a96e,#f5e6c8);color:#0a0a0a}
    .rb-ghost{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.6)}
    .rb-ghost:hover{border-color:rgba(230,192,115,0.3);color:#E6C073}

    .counter{text-align:center;margin:12px 0;font-size:12px;color:rgba(255,255,255,0.3)}
    .ft{margin-top:32px;padding:20px 0;border-top:1px solid rgba(255,255,255,0.04);text-align:center}.ft a{color:rgba(255,255,255,0.5);text-decoration:none;font-size:11px}.ft a:hover{color:#E6C073}
    @media(max-width:380px){.wheel-wrap{width:240px;height:240px}.wheel-outer{width:240px;height:240px}.wheel-center{width:60px;height:60px}}
  </style>
</head>
<body>
  <div class="c">
    <nav>
      <a href="/" class="nav-logo"><img src="/logo.webp" alt="KR"><span>KOFFEE REVIEW</span></a>
      <div class="nav-links"><a href="/map">Map</a><a href="/leaderboard">Top 10</a><a href="/blog">Blog</a></div>
    </nav>

    <div class="hero">
      <h1>SPIN FOR COFFEE</h1>
      <p class="hero-sub">Can't decide? Let the wheel pick your next cafe from ${cafes.length}+ reviewed.</p>
    </div>
    <div class="gold-line"></div>

    <div class="filters">
      <select id="cityFilter" onchange="applyFilters()">
        <option value="all">All Cities</option>
        ${cityOpts}
      </select>
      <select id="scoreFilter" onchange="applyFilters()">
        <option value="0">Any Score</option>
        <option value="7.5">7.5+ Must Visit</option>
        <option value="7">7.0+ Solid</option>
        <option value="6">6.0+ Decent</option>
      </select>
    </div>
    <div class="counter" id="counter"></div>

    <div class="wheel-wrap">
      <div class="wheel-pointer"></div>
      <div class="wheel-glow" id="wheelGlow"></div>
      <div class="wheel-outer">
        <canvas id="wheelCanvas" width="280" height="280"></canvas>
      </div>
      <div class="wheel-center" id="spinBtn" onclick="spin()">
        <div class="wheel-text">SPIN</div>
      </div>
    </div>

    <div class="result" id="result">
      <div class="result-card">
        <div class="result-label">YOUR PICK</div>
        <div class="result-score" id="rScore"></div>
        <div class="result-name" id="rName"></div>
        <div class="result-loc" id="rLoc"></div>
        <div class="result-verdict" id="rVerdict"></div>
        <div class="result-notes" id="rNotes"></div>
        <div class="result-btns">
          <a class="rb rb-gold" id="rLink" href="#">View Full Review</a>
          <button class="rb rb-ghost" onclick="spin()">Spin Again</button>
        </div>
      </div>
    </div>

    <footer class="ft">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:10px;letter-spacing:4px;color:rgba(230,192,115,0.5);margin-bottom:8px">EXPLORE</div>
      <a href="/">Reviews</a> &middot; <a href="/map">Heat Map</a> &middot; <a href="/compare">Compare</a> &middot; <a href="/blog">Blog</a>
    </footer>
  </div>

  <script>
    var AC=${cafeData};
    var filtered=AC.slice();
    var spinning=false;
    var currentRotation=0;
    var COLORS=["#E6C073","#c8a96e","#2dd4bf","#4ade80","#facc15","#fb923c","#f87171","#a78bfa","#60a5fa","#f472b6","#34d399","#fbbf24"];

    function gc(s){if(s>=9)return"#ffffff";if(s>=8)return"#4ade80";if(s>=7)return"#2dd4bf";if(s>=6)return"#facc15";if(s>=5)return"#fb923c";return"#f87171";}
    function gv(s){if(s>=9.1)return"ELITE";if(s>=8.1)return"GREAT";if(s>=7.5)return"MUST VISIT";if(s>=7.1)return"SOLID";if(s>=6.5)return"DECENT";if(s>=5.1)return"JUST OKAY";return"AVOID";}

    function applyFilters(){
      var city=document.getElementById("cityFilter").value;
      var minScore=parseFloat(document.getElementById("scoreFilter").value)||0;
      filtered=AC.filter(function(c){
        if(city!=="all"&&c.c!==city)return false;
        if(c.sc<minScore)return false;
        return true;
      });
      document.getElementById("counter").textContent=filtered.length+" cafes in the wheel";
      document.getElementById("result").classList.remove("show");
      drawWheel();
    }

    function drawWheel(){
      var canvas=document.getElementById("wheelCanvas");
      var ctx=canvas.getContext("2d");
      var size=canvas.width;
      var cx=size/2,cy=size/2,r=size/2-4;
      ctx.clearRect(0,0,size,size);

      var display=filtered.length>12?12:filtered.length;
      if(display===0){
        ctx.fillStyle="#1a1a1e";ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fill();
        ctx.fillStyle="rgba(255,255,255,0.3)";ctx.font="13px 'DM Sans',sans-serif";ctx.textAlign="center";ctx.fillText("No cafes match",cx,cy);
        return;
      }
      var slice=Math.PI*2/display;
      var sample=filtered.length>12?filtered.sort(function(){return 0.5-Math.random();}).slice(0,12):filtered;

      for(var i=0;i<display;i++){
        var startAngle=i*slice-Math.PI/2;
        var endAngle=startAngle+slice;
        ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,r,startAngle,endAngle);ctx.closePath();
        ctx.fillStyle=COLORS[i%COLORS.length];ctx.globalAlpha=0.25;ctx.fill();ctx.globalAlpha=1;
        ctx.strokeStyle="rgba(13,13,15,0.8)";ctx.lineWidth=1.5;ctx.stroke();

        // Text
        ctx.save();ctx.translate(cx,cy);ctx.rotate(startAngle+slice/2);
        ctx.fillStyle="#fff";ctx.font="bold 9px 'DM Sans',sans-serif";ctx.textAlign="right";
        var label=sample[i]?sample[i].n:"";if(label.length>14)label=label.substring(0,13)+"..";
        ctx.fillText(label,r-10,3);
        ctx.restore();
      }
    }

    function spin(){
      if(spinning||filtered.length===0)return;
      spinning=true;
      document.getElementById("result").classList.remove("show");
      document.getElementById("wheelGlow").classList.add("spinning");

      // Pick random cafe from filtered
      var idx=Math.floor(Math.random()*filtered.length);
      var pick=filtered[idx];

      // Spin the canvas
      var canvas=document.getElementById("wheelCanvas");
      var extraSpins=5+Math.floor(Math.random()*3);
      var targetAngle=extraSpins*360+Math.floor(Math.random()*360);
      currentRotation+=targetAngle;
      canvas.style.transition="transform 4s cubic-bezier(0.17,0.67,0.12,0.99)";
      canvas.style.transform="rotate("+currentRotation+"deg)";

      // Haptic
      if(navigator.vibrate)navigator.vibrate([20,30,20,30,20]);

      setTimeout(function(){
        spinning=false;
        document.getElementById("wheelGlow").classList.remove("spinning");

        // Show result
        var col=gc(pick.sc);
        document.getElementById("rScore").textContent=pick.sc.toFixed(1);
        document.getElementById("rScore").style.color=col;
        document.getElementById("rName").textContent=pick.n;
        document.getElementById("rLoc").textContent=pick.s+", "+pick.c+(pick.p?" \\u00b7 "+pick.p:"");
        document.getElementById("rVerdict").textContent=gv(pick.sc);
        document.getElementById("rVerdict").style.background=col;
        if(pick.nt){
          document.getElementById("rNotes").textContent=pick.nt+(pick.nt.length>=100?"...":"");
          document.getElementById("rNotes").style.borderColor=col;
          document.getElementById("rNotes").style.display="block";
        }else{
          document.getElementById("rNotes").style.display="none";
        }
        document.getElementById("rLink").href="/review/"+pick.sl;
        document.getElementById("result").classList.add("show");

        if(navigator.vibrate)navigator.vibrate([40,20,40]);
      },4200);
    }

    applyFilters();
  <\/script>
</body>
</html>`;

    res.setHeader("Content-Type","text/html; charset=utf-8");
    res.setHeader("Cache-Control","public, s-maxage=3600, stale-while-revalidate=86400");
    res.status(200).send(html);
  }catch(e){
    res.status(500).send("Error");
  }
}
