const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYEU8Khk3R5I879v3FcXPqhq0aCXa2ZWM1BwwJOyUitx2Boak_AFTOkwvB8qQrKIeU55NM4htFjHbI/pub?gid=0&single=true&output=csv";
const SPAIN = ["barcelona","catalonia","spain"];
function esc(s){return(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
function splitCSV(line){var r=[],c="",q=false;for(var i=0;i<line.length;i++){var ch=line[i];if(ch==='"')q=!q;else if(ch===","&&!q){r.push(c.trim());c="";}else c+=ch;}r.push(c.trim());return r;}
function makeSlug(n,s){return(n+"-"+s).toLowerCase().replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-").trim();}
function gc(s){if(s>=9.1)return"#ffffff";if(s>=8.1)return"#4ade80";if(s>=7.5)return"#2dd4bf";if(s>=7.1)return"#2dd4bf";if(s>=6.5)return"#facc15";if(s>=6.1)return"#facc15";if(s>=5.5)return"#fb923c";if(s>=5.1)return"#fb923c";return"#f87171";}

var CSS='*{margin:0;padding:0;box-sizing:border-box}body{background:#0a0a0c;color:#e2e8f0;font-family:DM Sans,sans-serif;-webkit-font-smoothing:antialiased}.c{max-width:520px;margin:0 auto;padding:0 20px 60px}.nav{display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid rgba(255,255,255,0.06)}.nav-logo{display:flex;align-items:center;gap:10px;text-decoration:none}.nav-logo img{width:34px;height:34px;border-radius:50%}.nav-logo span{font-family:Bebas Neue,sans-serif;font-size:15px;letter-spacing:3px;color:#E6C073}.ft{margin-top:32px;padding:20px 0;border-top:1px solid rgba(255,255,255,0.04);text-align:center;font-size:11px;color:rgba(255,255,255,0.3)}.ft a{color:rgba(255,255,255,0.5);text-decoration:none;margin:0 8px}';

// Flavour keywords to scan in notes
var FLAVOUR_TAGS = {
  chocolate:["chocolate","chocolat","cocoa","cacao","dark choc","milk choc","mocha"],
  caramel:["caramel","toffee","butterscotch","caramelised","dulce"],
  nutty:["nutty","hazelnut","almond","walnut","nut","pecan","macadamia"],
  fruity:["fruity","fruit","berry","citrus","plum","cherry","stone fruit","tropical","blueberry","raspberry"],
  floral:["floral","jasmine","rose","lavender","hibiscus","blossom"]
};
var BODY_TAGS = {
  light:["light body","thin body","delicate","soft start","gentle"],
  full:["full body","full-body","full bodied","rich body","heavy","robust"],
  smooth:["smooth","silky","velvety","creamy","balanced"]
};
var INTENSITY_TAGS = {
  punchy:["punchy","bold","strong","intense","powerful","hit","kick","punch"],
  gentle:["gentle","soft","mild","subtle","mellow","easy"],
  balanced:["balanced","even","consistent","steady"]
};
var ACIDITY_TAGS = {
  bright:["bright","acidic","acidity","tangy","zesty","sharp","crisp"],
  low:["low acid","smooth","mellow","deep","earthy","dark"]
};

export default async function handler(req,res){
  try{
    var response=await fetch(SHEET_URL);var text=await response.text();
    var lines=text.split("\n").filter(function(l){return l.trim();});
    var h=splitCSV(lines[0]).map(function(x){return x.trim().toLowerCase();});
    var ni=h.indexOf("name"),si=h.indexOf("suburb"),ci=h.indexOf("city"),sci=h.indexOf("score"),noi=h.indexOf("notes"),lati=h.indexOf("lat"),lngi=h.indexOf("lng");
    var cafes=[];
    for(var i=1;i<lines.length;i++){try{var p=splitCSV(lines[i]);var n=(p[ni]||"").trim();if(!n)continue;var sc=parseFloat(p[sci])||0;if(sc<=0||sc<6.0)continue;var city=(p[ci]||"").trim();if(SPAIN.indexOf(city.toLowerCase())!==-1)continue;
    var notes=(p[noi]||"").toLowerCase();var lat=parseFloat(p[lati])||0;var lng=parseFloat(p[lngi])||0;

    // Extract flavour profile from notes
    var profile={flavours:[],body:"unknown",intensity:"unknown",acidity:"unknown"};
    Object.keys(FLAVOUR_TAGS).forEach(function(tag){FLAVOUR_TAGS[tag].forEach(function(kw){if(notes.indexOf(kw)!==-1&&profile.flavours.indexOf(tag)===-1)profile.flavours.push(tag);});});
    Object.keys(BODY_TAGS).forEach(function(tag){BODY_TAGS[tag].forEach(function(kw){if(notes.indexOf(kw)!==-1)profile.body=tag;});});
    Object.keys(INTENSITY_TAGS).forEach(function(tag){INTENSITY_TAGS[tag].forEach(function(kw){if(notes.indexOf(kw)!==-1)profile.intensity=tag;});});
    Object.keys(ACIDITY_TAGS).forEach(function(tag){ACIDITY_TAGS[tag].forEach(function(kw){if(notes.indexOf(kw)!==-1)profile.acidity=tag;});});

    cafes.push({n:n,s:(p[si]||"").trim(),c:city,sc:sc,sl:makeSlug(n,(p[si]||"").trim()),lat:lat,lng:lng,notes:(p[noi]||"").trim().substring(0,100),profile:profile});}catch(e){}}

    var cafesJSON=JSON.stringify(cafes);

    res.setHeader("Content-Type","text/html; charset=utf-8");
    res.setHeader("Cache-Control","public, s-maxage=3600, stale-while-revalidate=86400");
    res.status(200).send('<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Find My Coffee | Koffee Review</title><meta name="description" content="Tell us what you like. We match you to the best cafes from 600+ reviews. Taste matching powered by real tasting notes, not algorithms."><link rel="canonical" href="https://koffeereview.com.au/find-my-coffee"><link rel="icon" href="/logo.webp"><link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"><style>'+CSS
    +'.q-card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:20px;padding:24px;margin:16px 0;text-align:center}'
    +'.q-title{font-size:15px;font-weight:600;color:#fff;margin-bottom:16px;line-height:1.5}'
    +'.opts{display:flex;flex-wrap:wrap;gap:8px;justify-content:center}'
    +'.opt{padding:12px 18px;border-radius:12px;background:rgba(255,255,255,0.04);border:1.5px solid rgba(255,255,255,0.08);color:rgba(255,255,255,0.6);font-size:13px;cursor:pointer;font-family:DM Sans,sans-serif;transition:all 0.15s}'
    +'.opt:hover{border-color:rgba(230,192,115,0.3)}'
    +'.opt.selected{border-color:#E6C073;color:#E6C073;background:rgba(230,192,115,0.08)}'
    +'.opt-multi.selected{border-color:#E6C073;color:#E6C073;background:rgba(230,192,115,0.08)}'
    +'.result-card{display:flex;align-items:center;gap:14px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:16px;margin-bottom:10px;text-decoration:none;color:inherit;transition:border 0.15s}'
    +'.result-card:hover{border-color:rgba(230,192,115,0.25)}'
    +'.match-tag{display:inline-block;padding:3px 10px;border-radius:10px;font-size:10px;font-weight:700;letter-spacing:1px}'
    +'</style></head><body><div class="c">'
    +'<nav class="nav"><a href="/" class="nav-logo"><img src="/logo.webp" alt="KR"><span>KOFFEE REVIEW</span></a><div style="display:flex;gap:12px"><a href="/passport" style="font-size:11px;color:#E6C073;text-decoration:none">Passport</a><a href="/explore" style="font-size:11px;color:rgba(255,255,255,0.4);text-decoration:none">Explore</a></div></nav>'
    +'<div style="text-align:center;padding:24px 0 0"><div style="font-size:10px;letter-spacing:3px;color:rgba(230,192,115,0.5);margin-bottom:6px">TASTE MATCHING</div><h1 style="font-family:Bebas Neue,sans-serif;font-size:clamp(28px,7vw,40px);letter-spacing:2px;color:#fff">Find My Coffee</h1><p style="font-size:13px;color:rgba(255,255,255,0.4);margin-top:8px">Tell us what you like. We match you to real cafes.</p></div>'
    +'<div id="quizArea"></div>'
    +'<div id="resultsArea" style="display:none"></div>'
    +'<div style="margin-top:20px"><a href="/passport" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:rgba(230,192,115,0.03);border:1px solid rgba(230,192,115,0.12);border-radius:14px;text-decoration:none;color:#E6C073;font-size:13px">My Koffee Passport &rarr;</a></div>'
    +'<footer class="ft"><a href="/explore">Explore</a><a href="/leaderboard">Leaderboard</a></footer></div>'

    +'<script>'
    +'var CAFES='+cafesJSON+';'
    +'var prefs={flavours:[],body:"any",intensity:"any",acidity:"any"};'
    +'var step=0;'

    +'var QUESTIONS=['
    +'{q:"What flavours do you prefer?",type:"multi",key:"flavours",opts:['
    +'{label:"Chocolate / Cocoa",val:"chocolate"},'
    +'{label:"Nuts / Caramel",val:"nutty"},'
    +'{label:"Fruity / Citrus",val:"fruity"},'
    +'{label:"Floral",val:"floral"},'
    +'{label:"No preference",val:"any"}'
    +']},'
    +'{q:"What kind of cup?",type:"single",key:"body",opts:['
    +'{label:"Smooth and gentle",val:"smooth"},'
    +'{label:"Rich and full-bodied",val:"full"},'
    +'{label:"Light and delicate",val:"light"},'
    +'{label:"No preference",val:"any"}'
    +']},'
    +'{q:"How intense?",type:"single",key:"intensity",opts:['
    +'{label:"Punchy and bold",val:"punchy"},'
    +'{label:"Gentle and mellow",val:"gentle"},'
    +'{label:"Balanced",val:"balanced"},'
    +'{label:"No preference",val:"any"}'
    +']},'
    +'{q:"How about acidity?",type:"single",key:"acidity",opts:['
    +'{label:"Prefer low acidity",val:"low"},'
    +'{label:"Enjoy bright acidity",val:"bright"},'
    +'{label:"Either is fine",val:"any"}'
    +']}'
    +'];'

    +'function renderQ(){if(step>=QUESTIONS.length){findMatches();return;}var q=QUESTIONS[step];var h="<div class=\\"q-card\\"><div style=\\"display:inline-block;padding:3px 12px;border-radius:10px;font-size:10px;letter-spacing:2px;font-weight:700;background:rgba(230,192,115,0.1);color:#E6C073;border:1px solid rgba(230,192,115,0.2);margin-bottom:12px\\">"+(step+1)+" OF "+QUESTIONS.length+"</div><div class=\\"q-title\\">"+q.q+"</div><div class=\\"opts\\">";'
    +'q.opts.forEach(function(o){h+="<div class=\\"opt\\" onclick=\\"pick(\'"+q.key+"\',\'"+o.val+"\',\'"+q.type+"\',this)\\">"+o.label+"</div>";});'
    +'h+="</div>"+(q.type==="multi"?"<div style=\\"margin-top:14px\\"><button onclick=\\"nextStep()\\" style=\\"padding:10px 24px;border-radius:12px;background:rgba(230,192,115,0.1);border:1px solid rgba(230,192,115,0.2);color:#E6C073;font-size:13px;cursor:pointer;font-family:DM Sans,sans-serif\\">Next &rarr;</button></div>":"")+"</div>";'
    +'document.getElementById("quizArea").innerHTML=h;}'

    +'function pick(key,val,type,el){if(type==="single"){if(val==="any")prefs[key]="any";else prefs[key]=val;step++;if(navigator.vibrate)navigator.vibrate(20);renderQ();}else{if(val==="any"){prefs.flavours=[];step++;renderQ();return;}var idx=prefs.flavours.indexOf(val);if(idx===-1){prefs.flavours.push(val);el.classList.add("selected");}else{prefs.flavours.splice(idx,1);el.classList.remove("selected");}if(navigator.vibrate)navigator.vibrate(15);}}'
    +'function nextStep(){step++;renderQ();}'

    +'function findMatches(){document.getElementById("quizArea").style.display="none";document.getElementById("resultsArea").style.display="block";'
    +'var scored=CAFES.map(function(c){var score=0;var reasons=[];var p=c.profile;'
    // Flavour match (40%)
    +'if(prefs.flavours.length>0){var hits=prefs.flavours.filter(function(f){return p.flavours.indexOf(f)!==-1;}).length;if(hits>0){score+=40*(hits/prefs.flavours.length);reasons.push(prefs.flavours.filter(function(f){return p.flavours.indexOf(f)!==-1;}).join(", "));}}'
    +'else{score+=20;}'
    // Body match (20%)
    +'if(prefs.body!=="any"&&p.body!=="unknown"){if(p.body===prefs.body){score+=20;reasons.push(prefs.body);}else if(p.body==="smooth"){score+=10;}}'
    +'else{score+=10;}'
    // Intensity match (15%)
    +'if(prefs.intensity!=="any"&&p.intensity!=="unknown"){if(p.intensity===prefs.intensity){score+=15;reasons.push(prefs.intensity);}}'
    +'else{score+=7;}'
    // Acidity match (25%)
    +'if(prefs.acidity!=="any"&&p.acidity!=="unknown"){if(p.acidity===prefs.acidity){score+=25;reasons.push(prefs.acidity==="low"?"low acidity":"bright acidity");}}'
    +'else{score+=12;}'
    // Bonus for high official score
    +'score+=(c.sc-6)*3;'
    +'return{cafe:c,match:Math.min(Math.round(score),100),reasons:reasons};'
    +'}).sort(function(a,b){return b.match-a.match;}).slice(0,8);'

    +'var html="<div style=\\"text-align:center;margin:16px 0\\"><div style=\\"font-family:Bebas Neue,sans-serif;font-size:22px;color:#E6C073;letter-spacing:2px\\">YOUR MATCHES</div><div style=\\"font-size:12px;color:rgba(255,255,255,0.35);margin-top:4px\\">Based on your taste preferences</div></div>";'
    +'scored.forEach(function(r,i){var c=r.cafe;var col="'+"#E6C073"+'";var matchCol=r.match>=70?"#4ade80":r.match>=40?"#facc15":"rgba(255,255,255,0.4)";var matchLabel=r.match>=70?"Strong match":r.match>=40?"Good match":"Partial match";'
    +'html+=\'<a href="/review/\'+c.sl+\'" class="result-card"><div style="width:48px;height:48px;border-radius:50%;border:2px solid \'+col+\';display:flex;align-items:center;justify-content:center;flex-shrink:0"><span style="font-family:Bebas Neue,sans-serif;font-size:18px;color:\'+col+\'">\'+c.sc.toFixed(1)+\'</span></div><div style="flex:1;min-width:0"><div style="display:flex;align-items:center;gap:8px;margin-bottom:3px"><div style="font-size:14px;font-weight:600;color:#fff">\'+c.n+\'</div><span class="match-tag" style="background:\'+matchCol+\'20;color:\'+matchCol+\';border:1px solid \'+matchCol+\'40">\'+matchLabel+\'</span></div><div style="font-size:11px;color:rgba(255,255,255,0.35)">\'+c.s+\', \'+c.c+\'</div>\'+(r.reasons.length?\'<div style="font-size:11px;color:rgba(255,255,255,0.45);margin-top:3px;font-style:italic">\'+r.reasons.join(" · ")+\'</div>\':"")+\'</div></a>\';});'
    +'html+="<div style=\\"text-align:center;margin-top:16px\\"><button onclick=\\"resetQuiz()\\" style=\\"padding:12px 28px;border-radius:14px;background:rgba(230,192,115,0.1);border:1px solid rgba(230,192,115,0.2);color:#E6C073;font-size:13px;cursor:pointer;font-family:DM Sans,sans-serif\\">Try Different Preferences</button></div>";'
    +'document.getElementById("resultsArea").innerHTML=html;}'

    +'function resetQuiz(){step=0;prefs={flavours:[],body:"any",intensity:"any",acidity:"any"};document.getElementById("quizArea").style.display="block";document.getElementById("resultsArea").style.display="none";renderQ();}'
    +'renderQ();'
    +'<\/script></body></html>');
  }catch(e){res.status(500).send("Error: "+(e.message||"unknown"));}
}
