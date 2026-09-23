const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYEU8Khk3R5I879v3FcXPqhq0aCXa2ZWM1BwwJOyUitx2Boak_AFTOkwvB8qQrKIeU55NM4htFjHbI/pub?gid=0&single=true&output=csv";
const SPAIN = ["barcelona","catalonia","spain"];
function esc(s){return(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
function splitCSV(line){var r=[],c="",q=false;for(var i=0;i<line.length;i++){var ch=line[i];if(ch==='"')q=!q;else if(ch===","&&!q){r.push(c.trim());c="";}else c+=ch;}r.push(c.trim());return r;}
function makeSlug(n,s){return(n+"-"+s).toLowerCase().replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-").trim();}
function gc(s){if(s>=9.1)return"#ffffff";if(s>=8.1)return"#4ade80";if(s>=7.5)return"#2dd4bf";if(s>=7.1)return"#2dd4bf";if(s>=6.5)return"#facc15";if(s>=6.1)return"#facc15";if(s>=5.5)return"#fb923c";if(s>=5.1)return"#fb923c";return"#f87171";}
function gv(s){if(s>=9.1)return"ELITE";if(s>=8.1)return"GREAT";if(s>=7.5)return"MUST VISIT";if(s>=7.1)return"SOLID";if(s>=6.5)return"DECENT";if(s>=6.1)return"TAKE OR LEAVE";if(s>=5.5)return"AVERAGE";if(s>=5.1)return"JUST OKAY";if(s>=4.1)return"NOT FOR US";return"AVOID";}

var CSS='*{margin:0;padding:0;box-sizing:border-box}body{background:#0a0a0c;color:#e2e8f0;font-family:DM Sans,sans-serif;-webkit-font-smoothing:antialiased}.c{max-width:620px;margin:0 auto;padding:0 20px 60px}.nav{display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid rgba(255,255,255,0.06)}.nav-logo{display:flex;align-items:center;gap:10px;text-decoration:none}.nav-logo img{width:34px;height:34px;border-radius:50%}.nav-logo span{font-family:Bebas Neue,sans-serif;font-size:15px;letter-spacing:3px;color:#E6C073}.ft{margin-top:32px;padding:20px 0;border-top:1px solid rgba(255,255,255,0.04);text-align:center;font-size:11px;color:rgba(255,255,255,0.3)}.ft a{color:rgba(255,255,255,0.5);text-decoration:none;margin:0 8px}';

// Hardcoded trails
var TRAILS = [
  {id:"cbd-crawl",title:"Brisbane CBD Coffee Trail",desc:"Hit the best CBD cafes on foot",cafes:["john-mills-himself-cbd","coffee-anthology-cbd","strauss-cbd"]},
  {id:"woolloongabba",title:"The Gabba Walk",desc:"Woolloongabba's most consistent strip",cafes:["brown-dog-cafe-woolloongabba","vacancy-coffee-woolloongabba","coffee-mentality-roast-woolloongabba","echo-and-bounce-woolloongabba"]},
  {id:"northside-gems",title:"Northside Gems",desc:"Cafes worth the trip north",cafes:["clubhouse-nundah","embargos-on-chapel-nundah","ant-espresso-nundah"]},
  {id:"gold-coast-day",title:"Gold Coast Day Trip",desc:"Drive the coast, drink the best",cafes:["quest-coffee-roasters-burleigh-heads","silipo-coffee-southport","commune-cafe-burleigh-heads"]},
  {id:"must-visit-10",title:"Must Visit Top 10",desc:"The ten highest scoring cafes in Australia",cafes:["bellissimo-coffee-bulimba","zen-barista-manly","the-twin-west-end","john-mills-himself-cbd","coffee-anthology-cbd","industry-beans-newstead-newstead","bunker-coffee-milton","blackout-paddington-paddington","clubhouse-nundah","embargos-on-chapel-nundah"]},
  {id:"west-end-walk",title:"West End Walk",desc:"Every reviewed cafe in West End",cafes:["the-twin-west-end","nodo-west-village-west-end","veneziano-coffee-roasters-west-end","coffee-boy-west-end"]},
  {id:"kenmore-run",title:"Kenmore Coffee Run",desc:"Brisbane's quiet scoring leader",cafes:["bru-cru-coffee-kenmore","blackjam-bakers-kenmore","d-and-d-espresso-kenmore"]}
];

export default async function handler(req,res){
  try{
    var response=await fetch(SHEET_URL);var text=await response.text();
    var lines=text.split("\n").filter(function(l){return l.trim();});
    var h=splitCSV(lines[0]).map(function(x){return x.trim().toLowerCase();});
    var ni=h.indexOf("name"),si=h.indexOf("suburb"),ci=h.indexOf("city"),sci=h.indexOf("score"),noi=h.indexOf("notes");
    var cafes=[];var cafeMap={};
    for(var i=1;i<lines.length;i++){try{var p=splitCSV(lines[i]);var n=(p[ni]||"").trim();if(!n)continue;var sc=parseFloat(p[sci])||0;if(sc<=0)continue;var city=(p[ci]||"").trim();if(SPAIN.indexOf(city.toLowerCase())!==-1)continue;var sl=makeSlug(n,(p[si]||"").trim());
    var cafe={n:n,s:(p[si]||"").trim(),c:city,sc:sc,sl:sl};cafes.push(cafe);cafeMap[sl]=cafe;}catch(e){}}

    var mustVisitSlugs=cafes.filter(function(c){return c.sc>=7.5;}).map(function(c){return c.sl;});
    var trailsJSON=JSON.stringify(TRAILS);
    var cafeMapJSON=JSON.stringify(cafeMap);

    res.setHeader("Content-Type","text/html; charset=utf-8");
    res.setHeader("Cache-Control","no-cache");
    res.status(200).send('<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>My Koffee Passport | Koffee Review</title><meta name="robots" content="noindex"><link rel="icon" href="/logo.webp"><link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"><style>'+CSS+'.tab{display:flex;gap:0;margin:16px 0;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:14px;overflow:hidden}.tab-btn{flex:1;padding:11px;text-align:center;font-size:12px;font-weight:600;cursor:pointer;border:none;background:transparent;color:rgba(255,255,255,0.35);font-family:DM Sans,sans-serif;transition:all 0.15s}.tab-btn.active{background:rgba(230,192,115,0.1);color:#E6C073}.card{display:flex;align-items:center;gap:12px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:14px 16px;margin-bottom:8px;text-decoration:none;color:inherit;transition:border 0.15s}.card:hover{border-color:rgba(230,192,115,0.3)}.trail{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:18px;margin-bottom:10px}.progress-bar{height:6px;background:rgba(255,255,255,0.06);border-radius:3px;overflow:hidden;margin-top:10px}.progress-fill{height:100%;background:linear-gradient(90deg,#c8a96e,#E6C073);border-radius:3px;transition:width 0.3s}.empty{text-align:center;padding:30px 0;color:rgba(255,255,255,0.25);font-size:13px;line-height:1.7}</style></head><body><div class="c">'
    +'<nav class="nav"><a href="/" class="nav-logo"><img src="/logo.webp" alt="KR"><span>KOFFEE REVIEW</span></a><div style="display:flex;gap:12px"><a href="/find-my-coffee" style="font-size:11px;color:#E6C073;text-decoration:none">Find My Coffee</a><a href="/explore" style="font-size:11px;color:rgba(255,255,255,0.4);text-decoration:none">Explore</a></div></nav>'
    +'<div style="padding:24px 0 0;text-align:center"><div style="font-size:10px;letter-spacing:3px;color:rgba(230,192,115,0.5);margin-bottom:6px">YOUR JOURNEY</div><h1 style="font-family:Bebas Neue,sans-serif;font-size:clamp(28px,7vw,40px);letter-spacing:2px;color:#fff">My Koffee Passport</h1></div>'

    // Stats bar
    +'<div style="display:flex;gap:0;margin:16px 0;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:14px;overflow:hidden"><div onclick="showTab(0)" style="flex:1;text-align:center;padding:12px 8px;cursor:pointer"><div style="font-family:Bebas Neue,sans-serif;font-size:22px;color:#E6C073" id="savedCount">0</div><div style="font-size:8px;letter-spacing:2px;color:rgba(255,255,255,0.3)">WANT TO TRY</div></div><div onclick="showTab(1)" style="flex:1;text-align:center;padding:12px 8px;border-left:1px solid rgba(255,255,255,0.03);border-right:1px solid rgba(255,255,255,0.03);cursor:pointer"><div style="font-family:Bebas Neue,sans-serif;font-size:22px;color:#4ade80" id="visitedCount">0</div><div style="font-size:8px;letter-spacing:2px;color:rgba(255,255,255,0.3)">VISITED</div></div><div onclick="showTab(2)" style="flex:1;text-align:center;padding:12px 8px;cursor:pointer"><div style="font-family:Bebas Neue,sans-serif;font-size:22px;color:#2dd4bf" id="returnCount">0</div><div style="font-size:8px;letter-spacing:2px;color:rgba(255,255,255,0.3)">WOULD RETURN</div></div></div>'

    // Must Visit progress
    +'<div style="background:rgba(230,192,115,0.03);border:1px solid rgba(230,192,115,0.12);border-radius:14px;padding:14px 16px;margin-bottom:16px"><div style="display:flex;justify-content:space-between;align-items:center"><div style="font-size:13px;font-weight:600;color:#E6C073">Must Visit Progress</div><div style="font-size:12px;color:rgba(255,255,255,0.4)" id="mvProgress">0 of '+mustVisitSlugs.length+'</div></div><div class="progress-bar"><div class="progress-fill" id="mvBar" style="width:0%"></div></div></div>'

    // Tabs
    +'<div class="tab"><button class="tab-btn active" onclick="showTab(0)">Want to Try</button><button class="tab-btn" onclick="showTab(1)">Visited</button><button class="tab-btn" onclick="showTab(2)">Would Return</button><button class="tab-btn" onclick="showTab(3)">Trails</button></div>'
    +'<div id="panel0"></div><div id="panel1" style="display:none"></div><div id="panel2" style="display:none"></div><div id="panel3" style="display:none"></div>'

    // Links
    +'<div style="margin-top:20px;display:flex;flex-direction:column;gap:8px"><a href="/find-my-coffee" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:rgba(230,192,115,0.03);border:1px solid rgba(230,192,115,0.12);border-radius:14px;text-decoration:none;color:#E6C073;font-size:13px">Find My Coffee &rarr;</a><a href="/quiz" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;text-decoration:none;color:rgba(255,255,255,0.5);font-size:13px">Coffee Personality Quiz &rarr;</a><a href="/explore" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;text-decoration:none;color:rgba(255,255,255,0.5);font-size:13px">Explore &rarr;</a></div>'
    +'<footer class="ft"><a href="/explore">Explore</a><a href="/leaderboard">Leaderboard</a></footer></div>'

    +'<script>'
    +'var CM='+cafeMapJSON+';'
    +'var TRAILS='+trailsJSON+';'
    +'var MV='+JSON.stringify(mustVisitSlugs)+';'
    +'var saved=JSON.parse(localStorage.getItem("kr_saved")||"[]");'
    +'var visited=JSON.parse(localStorage.getItem("kr_visited")||"[]");'
    +'var wouldReturn=JSON.parse(localStorage.getItem("kr_return")||"[]");'

    +'document.getElementById("savedCount").textContent=saved.length;'
    +'document.getElementById("visitedCount").textContent=visited.length;'
    +'document.getElementById("returnCount").textContent=wouldReturn.length;'

    // Must Visit progress
    +'var mvDone=visited.filter(function(s){return MV.indexOf(s)!==-1;}).length;'
    +'document.getElementById("mvProgress").textContent=mvDone+" of "+MV.length;'
    +'document.getElementById("mvBar").style.width=Math.round(mvDone/MV.length*100)+"%";'

    // Render cafe card
    +'function cafeCard(slug){var c=CM[slug];if(!c){var keys=Object.keys(CM);for(var k=0;k<keys.length;k++){if(keys[k].indexOf(slug)!==-1||slug.indexOf(keys[k])!==-1){c=CM[keys[k]];break;}}}'
    +'if(!c){var name=slug.replace(/-/g," ").replace(/\\b\\w/g,function(l){return l.toUpperCase();});return\'<a href="/review/\'+slug+\'" class="card"><div style="flex:1;min-width:0"><div style="font-size:14px;font-weight:600;color:#fff">\'+name+\'</div><div style="font-size:11px;color:rgba(255,255,255,0.4)">Tap to view review</div></div><div style="font-size:12px;color:rgba(255,255,255,0.2)">&rarr;</div></a>\';}'
    +'var col=gc(c.sc);'
    +'return\'<a href="/review/\'+slug+\'" class="card"><div style="width:42px;height:42px;border-radius:50%;border:2px solid \'+col+\';display:flex;align-items:center;justify-content:center;flex-shrink:0"><span style="font-family:Bebas Neue,sans-serif;font-size:16px;color:\'+col+\'">\'+c.sc.toFixed(1)+\'</span></div><div style="flex:1;min-width:0"><div style="font-size:14px;font-weight:700;color:#ffffff">\'+c.n+\'</div><div style="font-size:12px;color:rgba(255,255,255,0.5)">\'+c.s+\', \'+c.c+\'</div></div><div style="font-size:12px;color:rgba(255,255,255,0.2)">&rarr;</div></a>\';}'
    
    +'function gc(s){if(s>=9.1)return"#ffffff";if(s>=8.1)return"#4ade80";if(s>=7.5)return"#2dd4bf";if(s>=7.1)return"#2dd4bf";if(s>=6.5)return"#facc15";if(s>=6.1)return"#facc15";if(s>=5.5)return"#fb923c";if(s>=5.1)return"#fb923c";return"#f87171";}'

    // Render list
    +'function renderList(arr,panelId,emptyMsg,extra){var el=document.getElementById(panelId);if(!arr.length){el.innerHTML="<div class=\\"empty\\">"+emptyMsg+"</div>";return;}el.innerHTML=arr.map(function(s){return cafeCard(s,extra);}).join("");}'

    // Render trails
    +'function renderTrails(){var el=document.getElementById("panel3");var html="";TRAILS.forEach(function(t){var done=t.cafes.filter(function(s){return visited.indexOf(s)!==-1;}).length;var pct=Math.round(done/t.cafes.length*100);html+="<div class=\\"trail\\"><div style=\\"display:flex;justify-content:space-between;align-items:center\\"><div style=\\"font-size:14px;font-weight:600;color:#fff\\">"+t.title+"</div><div style=\\"font-size:12px;color:rgba(255,255,255,0.4)\\">"+done+"/"+t.cafes.length+"</div></div><div style=\\"font-size:12px;color:rgba(255,255,255,0.35);margin-top:4px\\">"+t.desc+"</div><div class=\\"progress-bar\\"><div class=\\"progress-fill\\" style=\\"width:"+pct+"%\\"></div></div><div style=\\"margin-top:10px\\">"+t.cafes.map(function(s){var isDone=visited.indexOf(s)!==-1;var c=CM[s];var name=c?c.n:s;return"<div style=\\"display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.03)\\"><div style=\\"width:20px;height:20px;border-radius:50%;border:1.5px solid "+(isDone?"#4ade80":"rgba(255,255,255,0.15)")+";display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:10px;color:"+(isDone?"#4ade80":"rgba(255,255,255,0.15)")+"\\">"+( isDone?"\\u2713":"")+"</div><a href=\\"/review/"+s+"\\" style=\\"font-size:13px;color:"+(isDone?"rgba(255,255,255,0.5)":"#fff")+";text-decoration:none\\">"+ name+"</a></div>";}).join("")+"</div></div>";});el.innerHTML=html;}'

    // Tab switching
    +'function showTab(idx){for(var i=0;i<4;i++){document.getElementById("panel"+i).style.display=i===idx?"block":"none";}document.querySelectorAll(".tab-btn").forEach(function(b,i){b.className="tab-btn"+(i===idx?" active":"");});}'

    // Initial render
    +'renderList(saved,"panel0","No cafes saved yet.<br>Tap \\u2661 Save on any review page.");'
    +'renderList(visited,"panel1","No visits logged yet.<br>Tap \\u25cb Been here on any review page.");'
    +'renderList(wouldReturn,"panel2","No cafes marked yet.<br>After visiting, mark ones you would return to.");'
    +'renderTrails();'
    +'<\/script></body></html>');
  }catch(e){res.status(500).send("Error: "+(e.message||"unknown"));}
}
