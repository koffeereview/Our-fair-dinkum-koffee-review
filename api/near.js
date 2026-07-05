const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYEU8Khk3R5I879v3FcXPqhq0aCXa2ZWM1BwwJOyUitx2Boak_AFTOkwvB8qQrKIeU55NM4htFjHbI/pub?gid=0&single=true&output=csv";
const SPAIN = ["barcelona","catalonia","spain"];
function esc(s){return(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
function splitCSV(line){var r=[],c="",q=false;for(var i=0;i<line.length;i++){var ch=line[i];if(ch==='"')q=!q;else if(ch===","&&!q){r.push(c.trim());c="";}else c+=ch;}r.push(c.trim());return r;}
function makeSlug(n,s){return(n+"-"+s).toLowerCase().replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-").trim();}
function gc(s){if(s>=9.1)return"#ffffff";if(s>=8.1)return"#4ade80";if(s>=7.5)return"#2dd4bf";if(s>=7.1)return"#2dd4bf";if(s>=6.5)return"#facc15";if(s>=6.1)return"#facc15";if(s>=5.5)return"#fb923c";if(s>=5.1)return"#fb923c";return"#f87171";}
function gv(s){if(s>=9.1)return"ELITE";if(s>=8.1)return"GREAT";if(s>=7.5)return"MUST VISIT";if(s>=7.1)return"SOLID";if(s>=6.5)return"DECENT";if(s>=6.1)return"TAKE OR LEAVE";if(s>=5.5)return"AVERAGE";if(s>=5.1)return"JUST OKAY";if(s>=4.1)return"NOT FOR US";return"AVOID";}
function hav(lat1,lng1,lat2,lng2){var R=6371;var dLat=(lat2-lat1)*Math.PI/180;var dLon=(lng2-lng1)*Math.PI/180;var a=Math.sin(dLat/2)*Math.sin(dLat/2)+Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)*Math.sin(dLon/2);return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));}

var LM=[
{s:"central-station",n:"Central Station",lat:-27.4660,lng:153.0260,c:"train"},
{s:"roma-street-station",n:"Roma Street Station",lat:-27.4645,lng:153.0145,c:"train"},
{s:"fortitude-valley-station",n:"Fortitude Valley Station",lat:-27.4565,lng:153.0360,c:"train"},
{s:"south-bank-station",n:"South Bank Station",lat:-27.4805,lng:153.0220,c:"train"},
{s:"south-brisbane-station",n:"South Brisbane Station",lat:-27.4780,lng:153.0170,c:"train"},
{s:"bowen-hills-station",n:"Bowen Hills Station",lat:-27.4500,lng:153.0345,c:"train"},
{s:"wooloowin-station",n:"Wooloowin Station",lat:-27.4300,lng:153.0405,c:"train"},
{s:"eagle-junction-station",n:"Eagle Junction Station",lat:-27.4260,lng:153.0460,c:"train"},
{s:"toowong-station",n:"Toowong Station",lat:-27.4845,lng:152.9880,c:"train"},
{s:"indooroopilly-station",n:"Indooroopilly Station",lat:-27.4990,lng:152.9730,c:"train"},
{s:"graceville-station",n:"Graceville Station",lat:-27.5120,lng:152.9820,c:"train"},
{s:"sherwood-station",n:"Sherwood Station",lat:-27.5175,lng:152.9780,c:"train"},
{s:"corinda-station",n:"Corinda Station",lat:-27.5385,lng:152.9795,c:"train"},
{s:"yeronga-station",n:"Yeronga Station",lat:-27.5120,lng:153.0195,c:"train"},
{s:"fairfield-station",n:"Fairfield Station",lat:-27.5090,lng:153.0250,c:"train"},
{s:"dutton-park-station",n:"Dutton Park Station",lat:-27.4950,lng:153.0310,c:"train"},
{s:"park-road-station",n:"Park Road Station",lat:-27.4850,lng:153.0340,c:"train"},
{s:"buranda-station",n:"Buranda Station",lat:-27.4845,lng:153.0435,c:"train"},
{s:"coorparoo-station",n:"Coorparoo Station",lat:-27.4940,lng:153.0525,c:"train"},
{s:"norman-park-station",n:"Norman Park Station",lat:-27.4860,lng:153.0600,c:"train"},
{s:"morningside-station",n:"Morningside Station",lat:-27.4750,lng:153.0720,c:"train"},
{s:"cannon-hill-station",n:"Cannon Hill Station",lat:-27.4660,lng:153.0840,c:"train"},
{s:"wynnum-station",n:"Wynnum Station",lat:-27.4480,lng:153.1570,c:"train"},
{s:"manly-station",n:"Manly Station",lat:-27.4545,lng:153.1910,c:"train"},
{s:"milton-station",n:"Milton Station",lat:-27.4700,lng:153.0020,c:"train"},
{s:"auchenflower-station",n:"Auchenflower Station",lat:-27.4740,lng:152.9940,c:"train"},
{s:"albion-station",n:"Albion Station",lat:-27.4385,lng:153.0440,c:"train"},
{s:"nundah-station",n:"Nundah Station",lat:-27.4015,lng:153.0600,c:"train"},
{s:"northgate-station",n:"Northgate Station",lat:-27.3890,lng:153.0680,c:"train"},
{s:"sandgate-station",n:"Sandgate Station",lat:-27.3260,lng:153.0690,c:"train"},
{s:"ipswich-station",n:"Ipswich Station",lat:-27.6160,lng:152.7630,c:"train"},
{s:"springfield-station",n:"Springfield Station",lat:-27.6680,lng:152.9060,c:"train"},
{s:"richlands-station",n:"Richlands Station",lat:-27.6010,lng:152.9550,c:"train"},
{s:"darra-station",n:"Darra Station",lat:-27.5690,lng:152.9540,c:"train"},
{s:"oxley-station",n:"Oxley Station",lat:-27.5490,lng:152.9730,c:"train"},
{s:"rbwh",n:"Royal Brisbane Hospital",lat:-27.4490,lng:153.0285,c:"hospital"},
{s:"pa-hospital",n:"Princess Alexandra Hospital",lat:-27.4980,lng:153.0335,c:"hospital"},
{s:"mater-hospital",n:"Mater Hospital",lat:-27.4840,lng:153.0290,c:"hospital"},
{s:"qe2-hospital",n:"QEII Hospital",lat:-27.5540,lng:153.0810,c:"hospital"},
{s:"prince-charles-hospital",n:"Prince Charles Hospital",lat:-27.3960,lng:153.0310,c:"hospital"},
{s:"greenslopes-hospital",n:"Greenslopes Hospital",lat:-27.5010,lng:153.0510,c:"hospital"},
{s:"gcuh",n:"Gold Coast University Hospital",lat:-28.0040,lng:153.4130,c:"hospital"},
{s:"uq-st-lucia",n:"UQ St Lucia",lat:-27.4975,lng:153.0130,c:"uni"},
{s:"qut-gardens-point",n:"QUT Gardens Point",lat:-27.4775,lng:153.0285,c:"uni"},
{s:"qut-kelvin-grove",n:"QUT Kelvin Grove",lat:-27.4490,lng:153.0120,c:"uni"},
{s:"griffith-nathan",n:"Griffith University Nathan",lat:-27.5510,lng:153.0560,c:"uni"},
{s:"griffith-gold-coast",n:"Griffith University Gold Coast",lat:-27.9620,lng:153.3810,c:"uni"},
{s:"bond-university",n:"Bond University",lat:-28.0730,lng:153.4150,c:"uni"},
{s:"chermside-shopping-centre",n:"Chermside Shopping Centre",lat:-27.3860,lng:153.0310,c:"shopping"},
{s:"indooroopilly-shopping-centre",n:"Indooroopilly Shopping Centre",lat:-27.4990,lng:152.9710,c:"shopping"},
{s:"garden-city",n:"Garden City Shopping Centre",lat:-27.5615,lng:153.0765,c:"shopping"},
{s:"carindale",n:"Carindale Shopping Centre",lat:-27.5020,lng:153.1005,c:"shopping"},
{s:"pacific-fair",n:"Pacific Fair",lat:-28.0370,lng:153.4265,c:"shopping"},
{s:"robina-town-centre",n:"Robina Town Centre",lat:-28.0780,lng:153.3860,c:"shopping"},
{s:"westfield-north-lakes",n:"Westfield North Lakes",lat:-27.2340,lng:152.9890,c:"shopping"},
{s:"westfield-coomera",n:"Westfield Coomera",lat:-27.8640,lng:153.2960,c:"shopping"},
{s:"dfo-brisbane",n:"DFO Brisbane",lat:-27.4010,lng:153.1120,c:"shopping"},
{s:"harbour-town",n:"Harbour Town Gold Coast",lat:-27.9290,lng:153.3680,c:"shopping"},
{s:"brisbane-airport",n:"Brisbane Airport",lat:-27.3940,lng:153.1170,c:"transport"},
{s:"gold-coast-airport",n:"Gold Coast Airport",lat:-28.1650,lng:153.5050,c:"transport"},
{s:"queen-street-mall",n:"Queen Street Mall",lat:-27.4700,lng:153.0260,c:"landmark"},
{s:"south-bank",n:"South Bank Parklands",lat:-27.4820,lng:153.0225,c:"landmark"},
{s:"howard-smith-wharves",n:"Howard Smith Wharves",lat:-27.4615,lng:153.0360,c:"landmark"},
{s:"james-street",n:"James Street",lat:-27.4535,lng:153.0375,c:"landmark"},
{s:"new-farm-park",n:"New Farm Park",lat:-27.4685,lng:153.0495,c:"landmark"},
{s:"west-village",n:"West Village",lat:-27.4885,lng:153.0095,c:"landmark"},
{s:"eat-street",n:"Eat Street Northshore",lat:-27.4310,lng:153.0775,c:"landmark"},
{s:"mt-coot-tha",n:"Mt Coot-tha",lat:-27.4760,lng:152.9610,c:"landmark"},
{s:"kangaroo-point",n:"Kangaroo Point",lat:-27.4800,lng:153.0360,c:"landmark"},
{s:"suncorp-stadium",n:"Suncorp Stadium",lat:-27.4645,lng:153.0095,c:"landmark"},
{s:"the-gabba",n:"The Gabba",lat:-27.4860,lng:153.0380,c:"landmark"},
{s:"surfers-paradise",n:"Surfers Paradise",lat:-28.0020,lng:153.4300,c:"landmark"},
{s:"burleigh-beach",n:"Burleigh Beach",lat:-28.0870,lng:153.4480,c:"landmark"},
{s:"broadbeach",n:"Broadbeach",lat:-28.0290,lng:153.4320,c:"landmark"},
{s:"coolangatta",n:"Coolangatta",lat:-28.1680,lng:153.5360,c:"landmark"},
{s:"noosa-main-beach",n:"Noosa Main Beach",lat:-26.3880,lng:153.0870,c:"landmark"},
{s:"king-george-square",n:"King George Square",lat:-27.4680,lng:153.0240,c:"landmark"},
{s:"brisbane-convention-centre",n:"Brisbane Convention Centre",lat:-27.4810,lng:153.0175,c:"landmark"},
{s:"emporium-south-bank",n:"Emporium South Bank",lat:-27.4780,lng:153.0200,c:"landmark"},
{s:"bulimba",n:"Bulimba Oxford Street",lat:-27.4570,lng:153.0565,c:"area"},
{s:"paddington",n:"Paddington Latrobe Terrace",lat:-27.4600,lng:152.9970,c:"area"},
{s:"stones-corner",n:"Stones Corner",lat:-27.4980,lng:153.0470,c:"area"},
{s:"wynnum-central",n:"Wynnum Central",lat:-27.4480,lng:153.1555,c:"area"},
{s:"cleveland",n:"Cleveland",lat:-27.5265,lng:153.2650,c:"area"},
{s:"north-lakes",n:"North Lakes",lat:-27.2330,lng:152.9870,c:"area"},
{s:"springfield-orion",n:"Springfield Orion",lat:-27.6700,lng:152.9090,c:"area"}
];

var CAT_NAMES={"train":"TRAIN STATIONS","hospital":"HOSPITALS","uni":"UNIVERSITIES","shopping":"SHOPPING CENTRES","transport":"AIRPORTS","landmark":"LANDMARKS AND ATTRACTIONS","area":"NEIGHBOURHOODS"};
var CAT_ORDER=["train","hospital","uni","shopping","transport","landmark","area"];
var CAT_COLORS={"train":"#60a5fa","hospital":"#f87171","uni":"#a78bfa","shopping":"#4ade80","transport":"#38bdf8","landmark":"#E6C073","area":"#fb923c"};
var CSS='*{margin:0;padding:0;box-sizing:border-box}body{background:#0a0a0c;color:#e2e8f0;font-family:DM Sans,sans-serif;-webkit-font-smoothing:antialiased}.c{max-width:720px;margin:0 auto;padding:0 20px 60px}.nav{display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid rgba(255,255,255,0.06)}.nav-logo{display:flex;align-items:center;gap:10px;text-decoration:none}.nav-logo img{width:34px;height:34px;border-radius:50%}.nav-logo span{font-family:Bebas Neue,sans-serif;font-size:15px;letter-spacing:3px;color:#E6C073}.nav-links{display:flex;gap:14px}.nav-links a{font-size:12px;color:rgba(255,255,255,0.45);text-decoration:none}.stats{display:flex;gap:0;margin:0 auto 24px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:14px;overflow:hidden}.stat{flex:1;text-align:center;padding:14px 8px;border-right:1px solid rgba(255,255,255,0.03)}.stat:last-child{border:none}.stat-n{font-family:Bebas Neue,sans-serif;font-size:26px;color:#E6C073;line-height:1}.stat-l{font-size:9px;letter-spacing:2px;color:rgba(255,255,255,0.3);margin-top:2px}.cat-section{margin-bottom:28px}.cat-header{display:flex;align-items:center;gap:10px;margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid rgba(255,255,255,0.04)}.cat-dot{width:8px;height:8px;border-radius:50%}.cat-title{font-family:Bebas Neue,sans-serif;font-size:13px;letter-spacing:3px;color:rgba(255,255,255,0.35)}.cat-count{font-size:11px;color:rgba(255,255,255,0.2)}.loc-btn{display:inline-block;padding:9px 16px;border-radius:12px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);color:rgba(255,255,255,0.6);font-size:12px;text-decoration:none;margin:0 5px 7px 0;transition:all 0.2s}.loc-btn:hover{background:rgba(230,192,115,0.06);border-color:rgba(230,192,115,0.2);color:#E6C073}.cafe-card{display:flex;align-items:center;gap:14px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;padding:14px 18px;margin-bottom:8px;text-decoration:none;color:inherit;transition:border 0.2s}.cafe-card:hover{border-color:rgba(230,192,115,0.25)}.ft{margin-top:32px;padding:20px 0;border-top:1px solid rgba(255,255,255,0.04);text-align:center;font-size:11px;color:rgba(255,255,255,0.3)}.ft a{color:rgba(255,255,255,0.5);text-decoration:none;margin:0 8px}.ft a:hover{color:#E6C073}';

export default async function handler(req,res){
  try{
    var landmark=req.query.landmark||"";
    var response=await fetch(SHEET_URL);var text=await response.text();
    var lines=text.split("\n").filter(function(l){return l.trim();});
    var h=splitCSV(lines[0]).map(function(x){return x.trim().toLowerCase();});
    var ni=h.indexOf("name"),si=h.indexOf("suburb"),ci=h.indexOf("city"),sci=h.indexOf("score"),noi=h.indexOf("notes"),lati=h.indexOf("lat"),lngi=h.indexOf("lng");
    var cafes=[];
    for(var i=1;i<lines.length;i++){try{var p=splitCSV(lines[i]);var n=(p[ni]||"").trim();if(!n)continue;var sc=parseFloat(p[sci])||0;if(sc<=0)continue;
    var city=(p[ci]||"").trim();if(SPAIN.indexOf(city.toLowerCase())!==-1)continue;
    var lat=parseFloat(p[lati])||0;var lng=parseFloat(p[lngi])||0;if(!lat||!lng)continue;
    cafes.push({n:n,s:(p[si]||"").trim(),sc:sc,sl:makeSlug(n,(p[si]||"").trim()),lat:lat,lng:lng});}catch(e){}}
    var year=new Date().getFullYear();
    var NAV='<nav class="nav"><a href="/" class="nav-logo"><img src="/logo.webp" alt="KR"><span>KOFFEE REVIEW</span></a><div class="nav-links"><a href="/explore">Explore</a><a href="/leaderboard">Leaderboard</a></div></nav>';
    var FT='<footer class="ft"><a href="/explore">Explore</a><a href="/leaderboard">Leaderboard</a><a href="/blog">Blog</a></footer>';
    res.setHeader("Content-Type","text/html; charset=utf-8");
    res.setHeader("Cache-Control","public, s-maxage=3600, stale-while-revalidate=86400");

    if(!landmark){
      var cats={};LM.forEach(function(l){if(!cats[l.c])cats[l.c]=[];cats[l.c].push(l);});
      var sections=CAT_ORDER.map(function(cat){
        if(!cats[cat])return"";
        var color=CAT_COLORS[cat]||"#E6C073";
        var items=cats[cat].map(function(l){
          return'<a href="/coffee-near/'+l.s+'" class="loc-btn">'+esc(l.n)+'</a>';
        }).join("");
        return'<div class="cat-section"><div class="cat-header"><div class="cat-dot" style="background:'+color+'"></div><div class="cat-title">'+(CAT_NAMES[cat]||cat.toUpperCase())+'</div><div class="cat-count">'+cats[cat].length+'</div></div><div style="display:flex;flex-wrap:wrap">'+items+'</div></div>';
      }).join("");
      return res.status(200).send('<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Coffee Near You '+year+' | '+LM.length+' Locations | Koffee Review</title><meta name="description" content="Find the best coffee near any train station, hospital, uni, or shopping centre. '+LM.length+' locations mapped to 600+ reviewed cafes."><link rel="canonical" href="https://koffeereview.com.au/coffee-near"><link rel="icon" href="/logo.webp"><link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet"><style>'+CSS+'</style></head><body><div class="c">'+NAV+'<div style="padding:28px 0 20px"><div style="font-size:10px;letter-spacing:3px;color:rgba(230,192,115,0.5);margin-bottom:8px">COFFEE NEAR YOU</div><h1 style="font-family:Bebas Neue,sans-serif;font-size:clamp(28px,7vw,44px);letter-spacing:2px;color:#fff">Find Coffee Near Any Location</h1><p style="font-size:14px;color:rgba(255,255,255,0.45);margin-top:10px;line-height:1.6">'+LM.length+' locations across Brisbane, Gold Coast, and beyond. Click any location to see the nearest reviewed cafes ranked by score.</p></div><div class="stats"><div class="stat"><div class="stat-n">'+LM.length+'</div><div class="stat-l">LOCATIONS</div></div><div class="stat"><div class="stat-n">600+</div><div class="stat-l">CAFES REVIEWED</div></div><div class="stat"><div class="stat-n">7</div><div class="stat-l">CATEGORIES</div></div></div>'+sections+'<div style="margin-top:20px;display:flex;flex-direction:column;gap:8px"><a href="/must-visit-cafes" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:rgba(230,192,115,0.03);border:1px solid rgba(230,192,115,0.12);border-radius:14px;text-decoration:none;color:#E6C073;font-size:13px">Must Visit Cafes (7.5+) &rarr;</a><a href="/explore" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;text-decoration:none;color:rgba(255,255,255,0.5);font-size:13px">Explore Koffee Review &rarr;</a></div>'+FT+'</div></body></html>');
    }

    var lm=LM.find(function(l){return l.s===landmark;});
    if(!lm)return res.status(404).send('<!DOCTYPE html><html><head><title>Not Found</title><meta name="robots" content="noindex"></head><body style="background:#111827;color:#fff;font-family:sans-serif;text-align:center;padding:60px"><h1 style="color:#E6C073">Location Not Found</h1><a href="/coffee-near" style="color:#E6C073">All Locations</a></body></html>');
    var nearby=cafes.map(function(cf){return{n:cf.n,s:cf.s,sc:cf.sc,sl:cf.sl,d:hav(lm.lat,lm.lng,cf.lat,cf.lng)};}).filter(function(cf){return cf.d<=3;}).sort(function(a,b){return a.d-b.d;}).slice(0,10);
    var cards=nearby.map(function(cf,i){
      var col=gc(cf.sc);var v=gv(cf.sc);
      return'<a href="/review/'+cf.sl+'" class="cafe-card"><div style="font-size:12px;color:rgba(255,255,255,0.3);width:22px;text-align:center;flex-shrink:0">'+(i+1)+'</div><div style="width:48px;height:48px;border-radius:50%;border:2px solid '+col+';display:flex;align-items:center;justify-content:center;flex-shrink:0"><span style="font-family:Bebas Neue,sans-serif;font-size:19px;color:'+col+'">'+cf.sc.toFixed(1)+'</span></div><div style="flex:1;min-width:0"><div style="font-size:15px;font-weight:600;color:#fff">'+esc(cf.n)+'</div><div style="font-size:12px;color:rgba(255,255,255,0.4);margin-top:2px">'+esc(cf.s)+' &middot; '+(cf.d<1?(cf.d*1000).toFixed(0)+'m':cf.d.toFixed(1)+'km')+' away</div></div><div style="padding:4px 12px;border-radius:20px;font-size:9px;font-weight:700;letter-spacing:1.5px;background:'+col+'18;color:'+col+';border:1px solid '+col+'40;flex-shrink:0">'+v+'</div></a>';
    }).join("");
    if(!cards)cards='<p style="text-align:center;color:rgba(255,255,255,0.4);padding:40px 0">No reviewed cafes within 3km of '+esc(lm.n)+' yet.</p>';
    var catLabel=(CAT_NAMES[lm.c]||"LOCATION");
    var catColor=CAT_COLORS[lm.c]||"#E6C073";
    return res.status(200).send('<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Best Coffee Near '+esc(lm.n)+' '+year+' | Koffee Review</title><meta name="description" content="'+nearby.length+' reviewed cafes within walking distance of '+esc(lm.n)+'. Ranked by distance. Scored out of 10."><link rel="canonical" href="https://koffeereview.com.au/coffee-near/'+lm.s+'"><link rel="icon" href="/logo.webp"><link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet"><style>'+CSS+'</style></head><body><div class="c">'+NAV+'<div style="font-size:12px;color:rgba(255,255,255,0.35);padding:12px 0"><a href="/" style="color:#E6C073;text-decoration:none">Home</a> &middot; <a href="/coffee-near" style="color:#E6C073;text-decoration:none">Coffee Near</a> &middot; '+esc(lm.n)+'</div><div style="padding:16px 0 20px"><div style="display:inline-block;padding:4px 14px;border-radius:20px;font-size:10px;letter-spacing:2px;font-weight:700;background:'+catColor+'15;color:'+catColor+';border:1px solid '+catColor+'40;margin-bottom:12px">'+catLabel+'</div><h1 style="font-family:Bebas Neue,sans-serif;font-size:clamp(26px,6vw,38px);letter-spacing:2px;color:#fff;margin-bottom:10px">Best Coffee Near '+esc(lm.n)+'</h1><p style="font-size:14px;color:rgba(255,255,255,0.45);line-height:1.6">'+nearby.length+' reviewed cafes within 3km. Ranked by distance. All scored with one latte and one double shot espresso.</p></div><div class="stats"><div class="stat"><div class="stat-n">'+nearby.length+'</div><div class="stat-l">NEARBY</div></div><div class="stat"><div class="stat-n">3km</div><div class="stat-l">RADIUS</div></div><div class="stat"><div class="stat-n">'+(nearby.length>0?nearby[0].sc.toFixed(1):"--")+'</div><div class="stat-l">TOP SCORE</div></div></div>'+cards+'<div style="margin-top:24px;display:flex;flex-direction:column;gap:8px"><a href="/coffee-near" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;text-decoration:none;color:rgba(255,255,255,0.5);font-size:13px">All '+LM.length+' Locations &rarr;</a><a href="/must-visit-cafes" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:rgba(230,192,115,0.03);border:1px solid rgba(230,192,115,0.12);border-radius:14px;text-decoration:none;color:#E6C073;font-size:13px">Must Visit Cafes &rarr;</a><a href="/explore" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;text-decoration:none;color:rgba(255,255,255,0.5);font-size:13px">Explore &rarr;</a></div>'+FT+'</div></body></html>');
  }catch(e){res.status(500).send("Error: "+(e.message||"unknown"));}
}
