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
    body{background:#0a0a0c;color:#d4d4d4;font-family:'DM Sans',sans-serif;min-height:100vh;-webkit-font-smoothing:antialiased;overflow-x:hidden}
    .c{max-width:520px;margin:0 auto;padding:0 20px}
    nav{display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid rgba(230,192,115,0.08)}.nav-logo{display:flex;align-items:center;gap:10px;text-decoration:none}.nav-logo img{width:34px;height:34px;border-radius:50%;border:1.5px solid rgba(230,192,115,0.25)}.nav-logo span{font-family:'Bebas Neue',sans-serif;font-size:15px;letter-spacing:3px;color:#E6C073}.nav-links{display:flex;gap:14px}.nav-links a{font-size:12px;color:rgba(255,255,255,0.45);text-decoration:none}.nav-links a:hover{color:#E6C073}
    .hero{text-align:center;padding:24px 0 12px}
    h1{font-family:'Bebas Neue',sans-serif;font-size:clamp(32px,8vw,48px);letter-spacing:4px;color:#fff;margin-bottom:4px;line-height:1}
    .hero-sub{font-size:13px;color:rgba(255,255,255,0.4);line-height:1.5}
    .gold-line{height:1px;background:linear-gradient(90deg,transparent,rgba(230,192,115,0.35),transparent);margin:12px 0}
    .filters{display:flex;gap:8px;justify-content:center;margin:14px 0;flex-wrap:wrap}
    select{background:#141416;border:1px solid rgba(255,255,255,0.1);color:#fff;padding:9px 30px 9px 14px;border-radius:24px;font-size:12px;cursor:pointer;font-family:'DM Sans',sans-serif;outline:none;-webkit-appearance:none;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23E6C073'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;transition:border-color 0.2s}select:focus{border-color:rgba(230,192,115,0.4)}select option{background:#141416;color:#fff}
    .counter{text-align:center;font-size:11px;color:rgba(230,192,115,0.5);letter-spacing:1px;margin-bottom:6px}

    /* WHEEL */
    .wheel-stage{position:relative;width:100%;max-width:360px;margin:16px auto;aspect-ratio:1}
    .wheel-pointer{position:absolute;top:-4px;left:50%;transform:translateX(-50%);z-index:20;width:0;height:0;border-left:12px solid transparent;border-right:12px solid transparent;border-top:20px solid #E6C073;filter:drop-shadow(0 3px 8px rgba(230,192,115,0.4))}
    .wheel-ring{position:absolute;top:0;left:0;width:100%;height:100%;border-radius:50%;border:2px solid rgba(230,192,115,0.12);box-shadow:0 0 60px rgba(230,192,115,0.06),inset 0 0 30px rgba(0,0,0,0.5)}
    .wheel-ring.glow{box-shadow:0 0 80px rgba(230,192,115,0.2),0 0 120px rgba(230,192,115,0.08),inset 0 0 30px rgba(0,0,0,0.5);border-color:rgba(230,192,115,0.3);transition:all 0.5s}
    .wheel-canvas-wrap{position:absolute;top:4px;left:4px;right:4px;bottom:4px;border-radius:50%;overflow:hidden}
    #wheelCanvas{width:100%;height:100%;transition:transform 5s cubic-bezier(0.15,0.6,0.1,1)}
    .wheel-hub{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:72px;height:72px;border-radius:50%;background:linear-gradient(145deg,#d4a94c,#f5e6c8,#c8a96e);display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:15;box-shadow:0 4px 24px rgba(230,192,115,0.35),0 0 0 3px rgba(10,10,12,0.8);transition:transform 0.12s}
    .wheel-hub:hover{transform:translate(-50%,-50%) scale(1.06)}
    .wheel-hub:active{transform:translate(-50%,-50%) scale(0.94)}
    .hub-text{font-family:'Bebas Neue',sans-serif;font-size:15px;letter-spacing:3px;color:#0a0a0c;text-align:center;line-height:1;user-select:none}
    .wheel-ticks{position:absolute;top:0;left:0;width:100%;height:100%;border-radius:50%;z-index:5;pointer-events:none}

    /* RESULT */
    .result{margin:20px 0 0;max-height:0;overflow:hidden;opacity:0;transition:all 0.5s ease}
    .result.show{max-height:600px;opacity:1}
    .result-card{background:linear-gradient(145deg,rgba(230,192,115,0.06),rgba(13,13,15,0.9));border:1px solid rgba(230,192,115,0.2);border-radius:18px;padding:28px 24px;text-align:center;position:relative;overflow:hidden}
    .result-card::before{content:"";position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,#E6C073,transparent)}
    .result-label{font-family:'Bebas Neue',sans-serif;font-size:11px;letter-spacing:5px;color:#E6C073;margin-bottom:14px}
    .result-score{font-family:'Bebas Neue',sans-serif;font-size:58px;line-height:1}
    .result-of{font-size:12px;color:rgba(255,255,255,0.3);margin-top:-4px;margin-bottom:8px}
    .result-name{font-size:20px;font-weight:700;color:#fff}
    .result-loc{font-size:13px;color:rgba(255,255,255,0.45);margin-top:4px}
    .result-verdict{display:inline-block;padding:4px 14px;border-radius:6px;font-size:10px;font-weight:700;letter-spacing:2px;color:#000;margin-top:10px}
    .result-notes{font-size:13px;color:rgba(255,255,255,0.5);font-style:italic;margin-top:14px;line-height:1.7;text-align:left;border-left:2px solid;padding-left:16px}
    .result-btns{display:flex;gap:8px;justify-content:center;margin-top:18px}
    .rb{padding:12px 24px;border-radius:10px;font-size:12px;font-weight:700;text-decoration:none;font-family:'DM Sans',sans-serif;cursor:pointer;border:none;transition:all 0.15s;letter-spacing:0.5px}
    .rb-gold{background:linear-gradient(135deg,#c8a96e,#f5e6c8);color:#0a0a0a}
    .rb-gold:hover{box-shadow:0 4px 16px rgba(230,192,115,0.3)}
    .rb-ghost{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.6)}
    .rb-ghost:hover{border-color:rgba(230,192,115,0.3);color:#E6C073}
    .history{margin-top:24px;padding-top:18px;border-top:1px solid rgba(255,255,255,0.04)}.history-title{font-family:'Bebas Neue',sans-serif;font-size:12px;letter-spacing:3px;color:rgba(255,255,255,0.3);margin-bottom:10px;text-align:center}
    .hi{display:flex;align-items:center;gap:10px;padding:8px 12px;border-radius:10px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.04);margin-bottom:4px;text-decoration:none;color:inherit;transition:all 0.15s}.hi:hover{border-color:rgba(230,192,115,0.15)}
    .hi-sc{font-family:'Bebas Neue',sans-serif;font-size:16px;min-width:32px}.hi-nm{font-size:12px;color:rgba(255,255,255,0.6);flex:1}.hi-loc{font-size:10px;color:rgba(255,255,255,0.3)}
    .ft{margin-top:28px;padding:20px 0;border-top:1px solid rgba(255,255,255,0.04);text-align:center}.ft a{color:rgba(255,255,255,0.5);text-decoration:none;font-size:11px}.ft a:hover{color:#E6C073}
    .wheel-hub{width:60px;height:60px}.hub-text{font-size:13px}}
      @media(max-width:480px){body{overflow-x:hidden}.c{padding:0 14px!important;max-width:100vw}nav{padding:12px 0!important}.nav-links{gap:10px}.nav-links a{font-size:10px!important}.nav-logo span{font-size:14px!important}.nav-logo img{width:30px!important;height:30px!important}h1{font-size:clamp(28px,7vw,36px)!important}.hero-sub{font-size:12px!important}.filters{gap:6px!important}select{font-size:11px!important;padding:7px 28px 7px 12px!important}.wheel-stage{max-width:300px!important}.wheel-hub{width:60px!important;height:60px!important}.hub-text{font-size:13px!important}.result-score{font-size:44px!important}.result-name{font-size:16px!important}.result-notes{font-size:12px!important;padding-left:12px!important}.result-btns{flex-direction:column!important;gap:6px!important}.rb{width:100%!important;text-align:center!important}.hi{padding:6px 10px!important}.hi-sc{font-size:14px!important}img{max-width:100%!important;height:auto!important}}
  </style>
</head>
<body>
  <div class="c">
    <nav>
      <a href="/" class="nav-logo"><img src="/logo.webp" alt="KR"><span>KOFFEE REVIEW</span></a>
      <div class="nav-links"><a href="/new">New</a><a href="/map">Map</a><a href="/blog">Blog</a></div>
    </nav>

    <div class="hero">
      <h1>SPIN FOR COFFEE</h1>
      <p class="hero-sub">Can't decide? Let fate pick from ${cafes.length}+ reviewed cafes.</p>
    </div>
    <div class="gold-line"></div>

    <div class="filters">
      <select id="cityFilter" onchange="cityChanged()">
        <option value="all">All Cities</option>
        ${cityOpts}
      </select>
      <select id="suburbFilter" onchange="applyFilters()" style="display:none">
        <option value="all">All Suburbs</option>
      </select>
      <select id="scoreFilter" onchange="applyFilters()">
        <option value="0">Any Score</option>
        <option value="7.5">7.5+ Must Visit</option>
        <option value="7">7.0+ Solid</option>
        <option value="6">6.0+ Decent</option>
      </select>
    </div>
    <div class="counter" id="counter"></div>

    <div class="wheel-stage" id="wheelStage">
      <div class="wheel-pointer"></div>
      <div class="wheel-ring" id="wheelRing"></div>
      <div class="wheel-canvas-wrap">
        <canvas id="wheelCanvas" width="700" height="700"></canvas>
      </div>
      <div class="wheel-hub" id="spinBtn" onclick="spin()">
        <div class="hub-text">SPIN</div>
      </div>
    </div>

    <div class="result" id="result">
      <div class="result-card">
        <div class="result-label">FATE HAS CHOSEN</div>
        <div class="result-score" id="rScore"></div>
        <div class="result-of">out of 10</div>
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

    <div class="history" id="history" style="display:none">
      <div class="history-title">YOUR SPINS</div>
      <div id="historyList"></div>
    </div>

    <footer class="ft">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:10px;letter-spacing:4px;color:rgba(230,192,115,0.5);margin-bottom:8px">EXPLORE</div>
      <a href="/">Reviews</a> &middot; <a href="/new">New</a> &middot; <a href="/map">Heat Map</a> &middot; <a href="/compare">Compare</a> &middot; <a href="/leaderboard">Leaderboard</a>
    </footer>
  </div>

  <script>
    var AC=${cafeData};
    var filtered=AC.slice();
    var spinning=false;
    var currentRotation=0;
    var spinHistory=[];
    var wheelSlices=[];

    // Rich colour palette
    var COLS=["#E6C073","#c8a96e","#4ade80","#2dd4bf","#facc15","#fb923c","#a78bfa","#60a5fa","#f472b6","#34d399","#fbbf24","#f87171","#818cf8","#22d3ee","#e879f9","#38bdf8","#a3e635","#fb7185","#c084fc","#67e8f9","#d4a94c","#86efac","#fdba74","#93c5fd","#f0abfc"];

    function gc(s){if(s>=9)return"#ffffff";if(s>=8)return"#4ade80";if(s>=7)return"#2dd4bf";if(s>=6)return"#facc15";if(s>=5)return"#fb923c";return"#f87171";}
    function gv(s){if(s>=9.1)return"ELITE";if(s>=8.1)return"GREAT";if(s>=7.5)return"MUST VISIT";if(s>=7.1)return"SOLID";if(s>=6.5)return"DECENT";if(s>=5.1)return"JUST OKAY";return"AVOID";}

    function shuffle(arr){var a=arr.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t;}return a;}

    function cityChanged(){
      var city=document.getElementById("cityFilter").value;
      var subSelect=document.getElementById("suburbFilter");
      if(city==="all"){
        subSelect.style.display="none";
        subSelect.value="all";
      }else{
        // Get suburbs for this city
        var subs=[];AC.forEach(function(c){if(c.c===city&&subs.indexOf(c.s)===-1)subs.push(c.s);});
        subs.sort();
        var opts='<option value="all">All Suburbs</option>';
        subs.forEach(function(s){opts+='<option value="'+s+'">'+s+'</option>';});
        subSelect.innerHTML=opts;
        subSelect.style.display="inline-block";
      }
      applyFilters();
    }

    function applyFilters(){
      var city=document.getElementById("cityFilter").value;
      var suburb=document.getElementById("suburbFilter").value;
      var minScore=parseFloat(document.getElementById("scoreFilter").value)||0;
      filtered=AC.filter(function(c){
        if(city!=="all"&&c.c!==city)return false;
        if(suburb!=="all"&&c.s!==suburb)return false;
        if(c.sc<minScore)return false;
        return true;
      });
      document.getElementById("counter").textContent=filtered.length+" cafes in the wheel";
      document.getElementById("result").classList.remove("show");

      // Auto-declare winner if only 1 cafe
      if(filtered.length===1){
        var solo=filtered[0];var col=gc(solo.sc);
        document.getElementById("rScore").textContent=solo.sc.toFixed(1);
        document.getElementById("rScore").style.color=col;
        document.getElementById("rName").textContent=solo.n;
        document.getElementById("rLoc").textContent=solo.s+", "+solo.c+(solo.p?" \\u00b7 "+solo.p:"");
        document.getElementById("rVerdict").textContent=gv(solo.sc);
        document.getElementById("rVerdict").style.background=col;
        document.getElementById("result").querySelector(".result-label").textContent="ONLY ONE CAFE HERE";
        if(solo.nt&&solo.nt.length>5){document.getElementById("rNotes").textContent=solo.nt;document.getElementById("rNotes").style.borderColor=col;document.getElementById("rNotes").style.display="block";}else{document.getElementById("rNotes").style.display="none";}
        document.getElementById("rLink").href="/review/"+solo.sl;
        document.getElementById("result").classList.add("show");
        document.getElementById("counter").textContent="Only 1 cafe matches your filters";
        // Hide spin button
        document.getElementById("spinBtn").style.opacity="0.3";document.getElementById("spinBtn").style.pointerEvents="none";
      }else{
        document.getElementById("result").querySelector(".result-label").textContent="FATE HAS CHOSEN";
        document.getElementById("spinBtn").style.opacity="1";document.getElementById("spinBtn").style.pointerEvents="auto";
      }
      drawWheel();
    }

    function drawWheel(){
      var canvas=document.getElementById("wheelCanvas");
      var ctx=canvas.getContext("2d");
      var size=canvas.width;
      var cx=size/2,cy=size/2,r=size/2-6;
      ctx.clearRect(0,0,size,size);

      if(filtered.length===0){
        ctx.fillStyle="#141416";ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fill();
        ctx.fillStyle="rgba(255,255,255,0.3)";ctx.font="18px 'DM Sans',sans-serif";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText("No cafes match",cx,cy);
        wheelSlices=[];return;
      }

      if(filtered.length===1){
        // Single cafe — show it as the whole wheel
        var col=gc(filtered[0].sc);
        ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fillStyle=col;ctx.globalAlpha=0.12;ctx.fill();ctx.globalAlpha=1;
        ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.strokeStyle=col;ctx.lineWidth=3;ctx.globalAlpha=0.4;ctx.stroke();ctx.globalAlpha=1;
        ctx.fillStyle="#fff";ctx.font="bold 14px 'DM Sans',sans-serif";ctx.textAlign="center";ctx.textBaseline="middle";
        ctx.fillText(filtered[0].n,cx,cy-10);
        ctx.fillStyle=col;ctx.font="bold 24px 'Bebas Neue',Georgia,serif";ctx.fillText(filtered[0].sc.toFixed(1),cx,cy+20);
        wheelSlices=filtered;return;
      }

      // Show ALL cafes on the wheel (or up to 60 for readability)
      var maxSlices=Math.min(filtered.length,60);
      var sample=filtered.length<=60?filtered.slice():shuffle(filtered).slice(0,60);
      wheelSlices=sample;
      var sliceAngle=Math.PI*2/maxSlices;

      for(var i=0;i<maxSlices;i++){
        var startAngle=i*sliceAngle-Math.PI/2;
        var endAngle=startAngle+sliceAngle;
        var col=COLS[i%COLS.length];

        // Slice fill
        ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,r,startAngle,endAngle);ctx.closePath();
        ctx.fillStyle=col;ctx.globalAlpha=0.18;ctx.fill();ctx.globalAlpha=1;

        // Slice border
        ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(startAngle)*r,cy+Math.sin(startAngle)*r);
        ctx.strokeStyle="rgba(10,10,12,0.6)";ctx.lineWidth=1;ctx.stroke();

        // Outer rim highlight
        ctx.beginPath();ctx.arc(cx,cy,r,startAngle,endAngle);
        ctx.strokeStyle=col;ctx.globalAlpha=0.3;ctx.lineWidth=3;ctx.stroke();ctx.globalAlpha=1;

        // Text
        ctx.save();ctx.translate(cx,cy);ctx.rotate(startAngle+sliceAngle/2);
        var label=sample[i]?sample[i].n:"";
        var maxLen=maxSlices>30?10:maxSlices>20?13:16;
        if(label.length>maxLen)label=label.substring(0,maxLen-1)+"..";
        var fontSize=maxSlices>40?8:maxSlices>25?9:maxSlices>15?10:11;
        ctx.fillStyle="#fff";ctx.font="600 "+fontSize+"px 'DM Sans',sans-serif";ctx.textAlign="right";ctx.textBaseline="middle";
        ctx.fillText(label,r-14,0);

        // Score dot
        if(sample[i]){
          var sc=sample[i].sc;
          var dotCol=gc(sc);
          ctx.beginPath();ctx.arc(r-8,0,3,0,Math.PI*2);ctx.fillStyle=dotCol;ctx.globalAlpha=0.7;ctx.fill();ctx.globalAlpha=1;
        }
        ctx.restore();
      }

      // Inner shadow ring
      var grad=ctx.createRadialGradient(cx,cy,r*0.7,cx,cy,r);
      grad.addColorStop(0,"rgba(10,10,12,0)");
      grad.addColorStop(0.85,"rgba(10,10,12,0)");
      grad.addColorStop(1,"rgba(10,10,12,0.3)");
      ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fillStyle=grad;ctx.fill();

      // Outer rim
      ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);
      ctx.strokeStyle="rgba(230,192,115,0.15)";ctx.lineWidth=2;ctx.stroke();
    }

    function spin(){
      if(spinning||filtered.length<2)return;
      spinning=true;
      document.getElementById("result").classList.remove("show");
      document.getElementById("wheelRing").classList.add("glow");
      document.getElementById("spinBtn").style.pointerEvents="none";

      // Pick random cafe from ALL filtered (not just visible slices)
      var idx=Math.floor(Math.random()*filtered.length);
      var pick=filtered[idx];

      // Calculate which slice to land on
      var sliceIdx=wheelSlices.findIndex(function(c){return c.n===pick.n&&c.s===pick.s;});
      if(sliceIdx===-1){
        // If pick isn't on the visible wheel, replace a random slice with it
        sliceIdx=Math.floor(Math.random()*wheelSlices.length);
      }

      // Target: land the pointer on that slice
      var sliceAngle=360/wheelSlices.length;
      var targetSliceCenter=sliceIdx*sliceAngle+sliceAngle/2;
      // Pointer is at top (0 deg), wheel rotates clockwise
      // We need the slice to end up at the top, so rotation = 360 - targetSliceCenter
      var baseAngle=360-targetSliceCenter;
      var extraSpins=6+Math.floor(Math.random()*4); // 6-9 full spins
      var jitter=(Math.random()-0.5)*sliceAngle*0.6; // random offset within slice
      var targetAngle=extraSpins*360+baseAngle+jitter;

      var canvas=document.getElementById("wheelCanvas");
      currentRotation+=targetAngle;
      canvas.style.transition="transform 5s cubic-bezier(0.15,0.6,0.1,1)";
      canvas.style.transform="rotate("+currentRotation+"deg)";

      // Tick sound simulation via haptic
      if(navigator.vibrate){
        var ticks=[];for(var t=0;t<30;t++){ticks.push(10);ticks.push(50+t*8);}
        navigator.vibrate(ticks);
      }

      setTimeout(function(){
        spinning=false;
        document.getElementById("wheelRing").classList.remove("glow");
        document.getElementById("spinBtn").style.pointerEvents="auto";

        var col=gc(pick.sc);
        document.getElementById("rScore").textContent=pick.sc.toFixed(1);
        document.getElementById("rScore").style.color=col;
        document.getElementById("rName").textContent=pick.n;
        document.getElementById("rLoc").textContent=pick.s+", "+pick.c+(pick.p?" \\u00b7 "+pick.p:"");
        document.getElementById("rVerdict").textContent=gv(pick.sc);
        document.getElementById("rVerdict").style.background=col;
        if(pick.nt&&pick.nt.length>5){
          document.getElementById("rNotes").textContent=pick.nt+(pick.nt.length>=100?"...":"");
          document.getElementById("rNotes").style.borderColor=col;
          document.getElementById("rNotes").style.display="block";
        }else{
          document.getElementById("rNotes").style.display="none";
        }
        document.getElementById("rLink").href="/review/"+pick.sl;
        document.getElementById("result").classList.add("show");

        // Add to history
        spinHistory.unshift(pick);
        if(spinHistory.length>5)spinHistory=spinHistory.slice(0,5);
        renderHistory();

        if(navigator.vibrate)navigator.vibrate([50,30,50]);
      },5300);
    }

    function renderHistory(){
      if(spinHistory.length===0)return;
      document.getElementById("history").style.display="block";
      var h="";spinHistory.forEach(function(c){
        var col=gc(c.sc);
        h+='<a href="/review/'+c.sl+'" class="hi"><div class="hi-sc" style="color:'+col+'">'+c.sc.toFixed(1)+'</div><div class="hi-nm">'+c.n+'</div><div class="hi-loc">'+c.s+'</div></a>';
      });
      document.getElementById("historyList").innerHTML=h;
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
