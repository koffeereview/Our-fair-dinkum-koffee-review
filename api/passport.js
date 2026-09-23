const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYEU8Khk3R5I879v3FcXPqhq0aCXa2ZWM1BwwJOyUitx2Boak_AFTOkwvB8qQrKIeU55NM4htFjHbI/pub?gid=0&single=true&output=csv";
const SPAIN = ["barcelona","catalonia","spain"];
function esc(s){return(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
function splitCSV(line){var r=[],c="",q=false;for(var i=0;i<line.length;i++){var ch=line[i];if(ch==='"')q=!q;else if(ch===","&&!q){r.push(c.trim());c="";}else c+=ch;}r.push(c.trim());return r;}
function makeSlug(n,s){return(n+"-"+s).toLowerCase().replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-").trim();}

var TRAILS = [
  {id:"cbd-crawl",title:"Brisbane CBD Coffee Trail",desc:"Hit the best CBD cafes on foot",cafes:["john-mills-himself-cbd","coffee-anthology-cbd","strauss-cbd"]},
  {id:"woolloongabba",title:"The Gabba Walk",desc:"Woolloongabba\u2019s most consistent strip",cafes:["brown-dog-cafe-woolloongabba","vacancy-coffee-woolloongabba","coffee-mentality-roast-woolloongabba","echo-and-bounce-woolloongabba"]},
  {id:"northside-gems",title:"Northside Gems",desc:"Cafes worth the trip north",cafes:["clubhouse-nundah","embargos-on-chapel-nundah","ant-espresso-nundah"]},
  {id:"gold-coast-day",title:"Gold Coast Day Trip",desc:"Drive the coast, drink the best",cafes:["quest-coffee-roasters-burleigh-heads","silipo-coffee-southport","commune-cafe-burleigh-heads"]},
  {id:"must-visit-10",title:"Must Visit Top 10",desc:"The ten highest scoring cafes in Australia",cafes:["bellissimo-coffee-bulimba","zen-barista-manly","the-twin-west-end","john-mills-himself-cbd","coffee-anthology-cbd","industry-beans-newstead-newstead","bunker-coffee-milton","blackout-paddington-paddington","clubhouse-nundah","embargos-on-chapel-nundah"]},
  {id:"west-end-walk",title:"West End Walk",desc:"Every reviewed cafe in West End",cafes:["the-twin-west-end","nodo-west-village-west-end","veneziano-coffee-roasters-west-end","coffee-boy-west-end"]},
  {id:"kenmore-run",title:"Kenmore Coffee Run",desc:"Brisbane\u2019s quiet scoring leader",cafes:["bru-cru-coffee-kenmore","blackjam-bakers-kenmore","d-and-d-espresso-kenmore"]}
];

export default async function handler(req,res){
  try{
    var response=await fetch(SHEET_URL);var text=await response.text();
    var lines=text.split("\n").filter(function(l){return l.trim();});
    var h=splitCSV(lines[0]).map(function(x){return x.trim().toLowerCase();});
    var ni=h.indexOf("name"),si=h.indexOf("suburb"),ci=h.indexOf("city"),sci=h.indexOf("score");
    var cafes=[];var cafeMap={};
    for(var i=1;i<lines.length;i++){try{var p=splitCSV(lines[i]);var n=(p[ni]||"").trim();if(!n)continue;var sc=parseFloat(p[sci])||0;if(sc<=0)continue;var city=(p[ci]||"").trim();if(SPAIN.indexOf(city.toLowerCase())!==-1)continue;var sl=makeSlug(n,(p[si]||"").trim());
    cafeMap[sl]={n:n,s:(p[si]||"").trim(),c:city,sc:sc};}catch(e){}}
    var mustVisitSlugs=Object.keys(cafeMap).filter(function(k){return cafeMap[k].sc>=7.5;});

    res.setHeader("Content-Type","text/html; charset=utf-8");
    res.setHeader("Cache-Control","no-cache");
    res.status(200).send(`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>My Koffee Passport | Koffee Review</title><meta name="robots" content="noindex"><link rel="icon" href="/logo.webp">
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#060608;color:#f0f0f0;font-family:Inter,sans-serif;-webkit-font-smoothing:antialiased;min-height:100vh}
.c{max-width:580px;margin:0 auto;padding:0 20px 60px}
.nav{display:flex;align-items:center;justify-content:space-between;padding:16px 0;border-bottom:1px solid rgba(255,255,255,0.06)}
.nav-logo{display:flex;align-items:center;gap:10px;text-decoration:none}
.nav-logo img{width:34px;height:34px;border-radius:50%;border:1px solid rgba(230,192,115,0.2)}
.nav-logo span{font-family:Bebas Neue,sans-serif;font-size:16px;letter-spacing:4px;color:#d4af60}
.nav-links a{font-size:12px;color:rgba(255,255,255,0.45);text-decoration:none;margin-left:16px}
.hero{text-align:center;padding:32px 0 20px}
.hero-label{font-size:10px;letter-spacing:4px;color:rgba(212,175,96,0.5);margin-bottom:8px;font-weight:600}
.hero h1{font-family:Bebas Neue,sans-serif;font-size:clamp(32px,8vw,44px);letter-spacing:3px;color:#fff;margin-bottom:4px}
.hero p{font-size:13px;color:rgba(255,255,255,0.4)}
.stats{display:flex;margin:20px 0;border-radius:16px;overflow:hidden;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07)}
.stat{flex:1;text-align:center;padding:16px 8px;cursor:pointer;transition:background 0.15s}
.stat:hover{background:rgba(255,255,255,0.04)}
.stat+.stat{border-left:1px solid rgba(255,255,255,0.05)}
.stat-num{font-family:Bebas Neue,sans-serif;font-size:28px;line-height:1}
.stat-label{font-size:9px;letter-spacing:2px;color:rgba(255,255,255,0.4);margin-top:4px;font-weight:500}
.progress-card{background:linear-gradient(135deg,rgba(212,175,96,0.06),rgba(212,175,96,0.02));border:1px solid rgba(212,175,96,0.15);border-radius:16px;padding:18px 20px;margin-bottom:20px}
.progress-top{display:flex;justify-content:space-between;align-items:center}
.progress-title{font-size:14px;font-weight:700;color:#d4af60}
.progress-count{font-size:13px;color:rgba(255,255,255,0.5);font-weight:500}
.bar{height:8px;background:rgba(255,255,255,0.06);border-radius:4px;overflow:hidden;margin-top:12px}
.bar-fill{height:100%;background:linear-gradient(90deg,#b8922e,#d4af60,#e8cc80);border-radius:4px;transition:width 0.4s ease}
.tabs{display:flex;margin:20px 0 16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:14px;overflow:hidden}
.tab{flex:1;padding:12px;text-align:center;font-size:12px;font-weight:600;cursor:pointer;border:none;background:transparent;color:rgba(255,255,255,0.35);font-family:Inter,sans-serif;transition:all 0.15s;letter-spacing:0.3px}
.tab.active{background:rgba(212,175,96,0.1);color:#d4af60}
.cafe-card{display:flex;align-items:center;gap:14px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:16px;margin-bottom:8px;text-decoration:none;color:inherit;transition:all 0.15s}
.cafe-card:hover{border-color:rgba(212,175,96,0.25);background:rgba(255,255,255,0.06)}
.score-ring{width:44px;height:44px;border-radius:50%;border:2.5px solid;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.score-num{font-family:Bebas Neue,sans-serif;font-size:17px}
.cafe-name{font-size:15px;font-weight:700;color:#ffffff;letter-spacing:0.2px}
.cafe-sub{font-size:12px;color:rgba(255,255,255,0.5);margin-top:2px}
.arrow{font-size:14px;color:rgba(255,255,255,0.2)}
.trail{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:20px;margin-bottom:12px}
.trail-head{display:flex;justify-content:space-between;align-items:center}
.trail-title{font-size:15px;font-weight:700;color:#fff}
.trail-count{font-size:13px;color:rgba(255,255,255,0.4);font-weight:600}
.trail-desc{font-size:12px;color:rgba(255,255,255,0.4);margin-top:4px}
.trail-stop{display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.04)}
.trail-stop:last-child{border-bottom:none}
.check{width:22px;height:22px;border-radius:50%;border:2px solid;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:11px;font-weight:700}
.check-done{border-color:#4ade80;color:#4ade80}
.check-todo{border-color:rgba(255,255,255,0.12);color:transparent}
.trail-name{font-size:13px;font-weight:500;text-decoration:none}
.empty{text-align:center;padding:40px 0;color:rgba(255,255,255,0.3);font-size:14px;line-height:1.8}
.link-card{display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-radius:14px;text-decoration:none;font-size:13px;font-weight:500;margin-bottom:8px;transition:all 0.15s}
.link-gold{background:rgba(212,175,96,0.04);border:1px solid rgba(212,175,96,0.15);color:#d4af60}
.link-gold:hover{background:rgba(212,175,96,0.08)}
.link-white{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);color:rgba(255,255,255,0.55)}
.link-white:hover{background:rgba(255,255,255,0.05)}
.ft{margin-top:32px;padding:20px 0;border-top:1px solid rgba(255,255,255,0.04);text-align:center;font-size:11px;color:rgba(255,255,255,0.25)}
.ft a{color:rgba(255,255,255,0.4);text-decoration:none;margin:0 10px}
</style></head><body><div class="c">
<nav class="nav"><a href="/" class="nav-logo"><img src="/logo.webp" alt="KR"><span>KOFFEE REVIEW</span></a><div class="nav-links"><a href="/find-my-coffee">Find My Coffee</a><a href="/explore">Explore</a></div></nav>
<div class="hero"><div class="hero-label">YOUR JOURNEY</div><h1>Koffee Passport</h1><p>Track. Explore. Return.</p></div>
<div class="stats">
<div class="stat" onclick="showTab(0)"><div class="stat-num" style="color:#d4af60" id="savedCount">0</div><div class="stat-label">WANT TO TRY</div></div>
<div class="stat" onclick="showTab(1)"><div class="stat-num" style="color:#4ade80" id="visitedCount">0</div><div class="stat-label">VISITED</div></div>
<div class="stat" onclick="showTab(2)"><div class="stat-num" style="color:#2dd4bf" id="returnCount">0</div><div class="stat-label">WOULD RETURN</div></div>
</div>
<div class="progress-card"><div class="progress-top"><div class="progress-title">Must Visit Progress</div><div class="progress-count" id="mvProgress">0 / ${mustVisitSlugs.length}</div></div><div class="bar"><div class="bar-fill" id="mvBar" style="width:0%"></div></div></div>
<div class="tabs"><button class="tab active" onclick="showTab(0)">Want to Try</button><button class="tab" onclick="showTab(1)">Visited</button><button class="tab" onclick="showTab(2)">Would Return</button><button class="tab" onclick="showTab(3)">Trails</button></div>
<div id="panel0"></div><div id="panel1" style="display:none"></div><div id="panel2" style="display:none"></div><div id="panel3" style="display:none"></div>
<div style="margin-top:24px">
<a href="/find-my-coffee" class="link-card link-gold">Find My Coffee<span>&rarr;</span></a>
<a href="/quiz" class="link-card link-white">Coffee Personality Quiz<span>&rarr;</span></a>
<a href="/explore" class="link-card link-white">Explore Koffee Review<span>&rarr;</span></a>
</div>
<footer class="ft"><a href="/explore">Explore</a><a href="/leaderboard">Leaderboard</a><a href="/blog">Blog</a></footer>
</div>
<script>
var CM=${JSON.stringify(cafeMap)};
var TRAILS=${JSON.stringify(TRAILS)};
var MV=${JSON.stringify(mustVisitSlugs)};
var saved=JSON.parse(localStorage.getItem("kr_saved")||"[]");
var visited=JSON.parse(localStorage.getItem("kr_visited")||"[]");
var wouldReturn=JSON.parse(localStorage.getItem("kr_return")||"[]");
document.getElementById("savedCount").textContent=saved.length;
document.getElementById("visitedCount").textContent=visited.length;
document.getElementById("returnCount").textContent=wouldReturn.length;
var mvDone=visited.filter(function(s){return MV.indexOf(s)!==-1;}).length;
document.getElementById("mvProgress").textContent=mvDone+" / "+MV.length;
document.getElementById("mvBar").style.width=Math.round(mvDone/MV.length*100)+"%";

function gc(s){if(s>=9.1)return"#ffffff";if(s>=8.1)return"#4ade80";if(s>=7.5)return"#2dd4bf";if(s>=7.1)return"#2dd4bf";if(s>=6.5)return"#facc15";if(s>=6.1)return"#facc15";if(s>=5.5)return"#fb923c";if(s>=5.1)return"#fb923c";return"#f87171";}

function cafeCard(slug){
var c=CM[slug];
if(!c){var keys=Object.keys(CM);for(var k=0;k<keys.length;k++){if(keys[k].indexOf(slug)!==-1||slug.indexOf(keys[k])!==-1){c=CM[keys[k]];slug=keys[k];break;}}}
if(!c){var name=slug.replace(/-/g," ").replace(/\b\w/g,function(l){return l.toUpperCase();});return'<a href="/review/'+slug+'" class="cafe-card"><div style="flex:1"><div class="cafe-name">'+name+'</div><div class="cafe-sub">Tap to view review</div></div><div class="arrow">\u203A</div></a>';}
var col=gc(c.sc);
return'<a href="/review/'+slug+'" class="cafe-card"><div class="score-ring" style="border-color:'+col+'"><span class="score-num" style="color:'+col+'">'+c.sc.toFixed(1)+'</span></div><div style="flex:1;min-width:0"><div class="cafe-name">'+c.n+'</div><div class="cafe-sub">'+c.s+', '+c.c+'</div></div><div class="arrow">\u203A</div></a>';}

function renderList(arr,id,msg){var el=document.getElementById(id);if(!arr.length){el.innerHTML='<div class="empty">'+msg+'</div>';return;}el.innerHTML=arr.map(function(s){return cafeCard(s);}).join("");}

function renderTrails(){var el=document.getElementById("panel3");var html="";TRAILS.forEach(function(t){var done=t.cafes.filter(function(s){return visited.indexOf(s)!==-1;}).length;var pct=Math.round(done/t.cafes.length*100);
html+='<div class="trail"><div class="trail-head"><div class="trail-title">'+t.title+'</div><div class="trail-count">'+done+' / '+t.cafes.length+'</div></div><div class="trail-desc">'+t.desc+'</div><div class="bar" style="margin-top:10px"><div class="bar-fill" style="width:'+pct+'%"></div></div><div style="margin-top:12px">'+t.cafes.map(function(s){var isDone=visited.indexOf(s)!==-1;var c=CM[s];var name=c?c.n:s;return'<div class="trail-stop"><div class="check '+(isDone?"check-done":"check-todo")+'">'+(isDone?"\u2713":"")+'</div><a href="/review/'+s+'" class="trail-name" style="color:'+(isDone?"rgba(255,255,255,0.45)":"#fff")+'">'+name+'</a></div>';}).join("")+'</div></div>';});el.innerHTML=html;}

function showTab(idx){for(var i=0;i<4;i++){document.getElementById("panel"+i).style.display=i===idx?"block":"none";}document.querySelectorAll(".tab").forEach(function(b,i){b.className="tab"+(i===idx?" active":"");});}

renderList(saved,"panel0","No cafes saved yet.<br>Tap \u2661 Save on any review page to start your list.");
renderList(visited,"panel1","No visits logged yet.<br>Tap \u25CB Been here on any review page.");
renderList(wouldReturn,"panel2","No cafes marked yet.<br>After visiting, mark ones you\u2019d return to.");
renderTrails();
</script></body></html>`);
  }catch(e){res.status(500).send("Error: "+(e.message||"unknown"));}
}
