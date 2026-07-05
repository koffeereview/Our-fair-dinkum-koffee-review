const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYEU8Khk3R5I879v3FcXPqhq0aCXa2ZWM1BwwJOyUitx2Boak_AFTOkwvB8qQrKIeU55NM4htFjHbI/pub?gid=0&single=true&output=csv";
const SPAIN = ["barcelona","catalonia","spain"];
function esc(s){return(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
function splitCSV(line){var r=[],c="",q=false;for(var i=0;i<line.length;i++){var ch=line[i];if(ch==='"')q=!q;else if(ch===","&&!q){r.push(c.trim());c="";}else c+=ch;}r.push(c.trim());return r;}
function makeSlug(n,s){return(n+"-"+s).toLowerCase().replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-").trim();}
function gc(s){if(s>=9.1)return"#ffffff";if(s>=8.1)return"#4ade80";if(s>=7.5)return"#2dd4bf";if(s>=7.1)return"#2dd4bf";if(s>=6.5)return"#facc15";if(s>=6.1)return"#facc15";if(s>=5.5)return"#fb923c";if(s>=5.1)return"#fb923c";return"#f87171";}
function gv(s){if(s>=9.1)return"ELITE";if(s>=8.1)return"GREAT";if(s>=7.5)return"MUST VISIT";if(s>=7.1)return"SOLID";if(s>=6.5)return"DECENT";if(s>=6.1)return"TAKE OR LEAVE";if(s>=5.5)return"AVERAGE";if(s>=5.1)return"JUST OKAY";if(s>=4.1)return"NOT FOR US";return"AVOID";}
function dist(lat1,lng1,lat2,lng2){var R=6371;var dLat=(lat2-lat1)*Math.PI/180;var dLon=(lng2-lng1)*Math.PI/180;var a=Math.sin(dLat/2)*Math.sin(dLat/2)+Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)*Math.sin(dLon/2);return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));}

var LANDMARKS=[
{s:"central-station",n:"Central Station",lat:-27.4660,lng:153.0260,cat:"train"},
{s:"roma-street-station",n:"Roma Street Station",lat:-27.4645,lng:153.0145,cat:"train"},
{s:"fortitude-valley-station",n:"Fortitude Valley Station",lat:-27.4565,lng:153.0360,cat:"train"},
{s:"south-bank-station",n:"South Bank Station",lat:-27.4805,lng:153.0220,cat:"train"},
{s:"south-brisbane-station",n:"South Brisbane Station",lat:-27.4780,lng:153.0170,cat:"train"},
{s:"bowen-hills-station",n:"Bowen Hills Station",lat:-27.4500,lng:153.0345,cat:"train"},
{s:"wooloowin-station",n:"Wooloowin Station",lat:-27.4300,lng:153.0405,cat:"train"},
{s:"eagle-junction-station",n:"Eagle Junction Station",lat:-27.4260,lng:153.0460,cat:"train"},
{s:"toowong-station",n:"Toowong Station",lat:-27.4845,lng:152.9880,cat:"train"},
{s:"indooroopilly-station",n:"Indooroopilly Station",lat:-27.4990,lng:152.9730,cat:"train"},
{s:"graceville-station",n:"Graceville Station",lat:-27.5120,lng:152.9820,cat:"train"},
{s:"sherwood-station",n:"Sherwood Station",lat:-27.5175,lng:152.9780,cat:"train"},
{s:"corinda-station",n:"Corinda Station",lat:-27.5385,lng:152.9795,cat:"train"},
{s:"yeronga-station",n:"Yeronga Station",lat:-27.5120,lng:153.0195,cat:"train"},
{s:"fairfield-station",n:"Fairfield Station",lat:-27.5090,lng:153.0250,cat:"train"},
{s:"dutton-park-station",n:"Dutton Park Station",lat:-27.4950,lng:153.0310,cat:"train"},
{s:"park-road-station",n:"Park Road Station",lat:-27.4850,lng:153.0340,cat:"train"},
{s:"buranda-station",n:"Buranda Station",lat:-27.4845,lng:153.0435,cat:"train"},
{s:"coorparoo-station",n:"Coorparoo Station",lat:-27.4940,lng:153.0525,cat:"train"},
{s:"norman-park-station",n:"Norman Park Station",lat:-27.4860,lng:153.0600,cat:"train"},
{s:"morningside-station",n:"Morningside Station",lat:-27.4750,lng:153.0720,cat:"train"},
{s:"cannon-hill-station",n:"Cannon Hill Station",lat:-27.4660,lng:153.0840,cat:"train"},
{s:"wynnum-station",n:"Wynnum Station",lat:-27.4480,lng:153.1570,cat:"train"},
{s:"manly-station",n:"Manly Station",lat:-27.4545,lng:153.1910,cat:"train"},
{s:"milton-station",n:"Milton Station",lat:-27.4700,lng:153.0020,cat:"train"},
{s:"auchenflower-station",n:"Auchenflower Station",lat:-27.4740,lng:152.9940,cat:"train"},
{s:"albion-station",n:"Albion Station",lat:-27.4385,lng:153.0440,cat:"train"},
{s:"nundah-station",n:"Nundah Station",lat:-27.4015,lng:153.0600,cat:"train"},
{s:"northgate-station",n:"Northgate Station",lat:-27.3890,lng:153.0680,cat:"train"},
{s:"sandgate-station",n:"Sandgate Station",lat:-27.3260,lng:153.0690,cat:"train"},
{s:"ipswich-station",n:"Ipswich Station",lat:-27.6160,lng:152.7630,cat:"train"},
{s:"springfield-station",n:"Springfield Station",lat:-27.6680,lng:152.9060,cat:"train"},
{s:"richlands-station",n:"Richlands Station",lat:-27.6010,lng:152.9550,cat:"train"},
{s:"darra-station",n:"Darra Station",lat:-27.5690,lng:152.9540,cat:"train"},
{s:"oxley-station",n:"Oxley Station",lat:-27.5490,lng:152.9730,cat:"train"},
{s:"rbwh",n:"Royal Brisbane Hospital",lat:-27.4490,lng:153.0285,cat:"hospital"},
{s:"pa-hospital",n:"Princess Alexandra Hospital",lat:-27.4980,lng:153.0335,cat:"hospital"},
{s:"mater-hospital",n:"Mater Hospital",lat:-27.4840,lng:153.0290,cat:"hospital"},
{s:"qe2-hospital",n:"QEII Hospital",lat:-27.5540,lng:153.0810,cat:"hospital"},
{s:"prince-charles-hospital",n:"Prince Charles Hospital",lat:-27.3960,lng:153.0310,cat:"hospital"},
{s:"greenslopes-hospital",n:"Greenslopes Hospital",lat:-27.5010,lng:153.0510,cat:"hospital"},
{s:"gcuh",n:"Gold Coast University Hospital",lat:-28.0040,lng:153.4130,cat:"hospital"},
{s:"uq-st-lucia",n:"UQ St Lucia",lat:-27.4975,lng:153.0130,cat:"uni"},
{s:"qut-gardens-point",n:"QUT Gardens Point",lat:-27.4775,lng:153.0285,cat:"uni"},
{s:"qut-kelvin-grove",n:"QUT Kelvin Grove",lat:-27.4490,lng:153.0120,cat:"uni"},
{s:"griffith-nathan",n:"Griffith University Nathan",lat:-27.5510,lng:153.0560,cat:"uni"},
{s:"griffith-gold-coast",n:"Griffith University Gold Coast",lat:-27.9620,lng:153.3810,cat:"uni"},
{s:"bond-university",n:"Bond University",lat:-28.0730,lng:153.4150,cat:"uni"},
{s:"chermside-shopping-centre",n:"Chermside Shopping Centre",lat:-27.3860,lng:153.0310,cat:"shopping"},
{s:"indooroopilly-shopping-centre",n:"Indooroopilly Shopping Centre",lat:-27.4990,lng:152.9710,cat:"shopping"},
{s:"garden-city",n:"Garden City Shopping Centre",lat:-27.5615,lng:153.0765,cat:"shopping"},
{s:"carindale",n:"Carindale Shopping Centre",lat:-27.5020,lng:153.1005,cat:"shopping"},
{s:"pacific-fair",n:"Pacific Fair",lat:-28.0370,lng:153.4265,cat:"shopping"},
{s:"robina-town-centre",n:"Robina Town Centre",lat:-28.0780,lng:153.3860,cat:"shopping"},
{s:"westfield-north-lakes",n:"Westfield North Lakes",lat:-27.2340,lng:152.9890,cat:"shopping"},
{s:"westfield-coomera",n:"Westfield Coomera",lat:-27.8640,lng:153.2960,cat:"shopping"},
{s:"dfo-brisbane",n:"DFO Brisbane",lat:-27.4010,lng:153.1120,cat:"shopping"},
{s:"harbour-town",n:"Harbour Town Gold Coast",lat:-27.9290,lng:153.3680,cat:"shopping"},
{s:"brisbane-airport",n:"Brisbane Airport",lat:-27.3940,lng:153.1170,cat:"transport"},
{s:"gold-coast-airport",n:"Gold Coast Airport",lat:-28.1650,lng:153.5050,cat:"transport"},
{s:"queen-street-mall",n:"Queen Street Mall",lat:-27.4700,lng:153.0260,cat:"landmark"},
{s:"south-bank",n:"South Bank Parklands",lat:-27.4820,lng:153.0225,cat:"landmark"},
{s:"howard-smith-wharves",n:"Howard Smith Wharves",lat:-27.4615,lng:153.0360,cat:"landmark"},
{s:"james-street",n:"James Street",lat:-27.4535,lng:153.0375,cat:"landmark"},
{s:"new-farm-park",n:"New Farm Park",lat:-27.4685,lng:153.0495,cat:"landmark"},
{s:"west-village",n:"West Village",lat:-27.4885,lng:153.0095,cat:"landmark"},
{s:"eat-street",n:"Eat Street Northshore",lat:-27.4310,lng:153.0775,cat:"landmark"},
{s:"mt-coot-tha",n:"Mt Coot-tha",lat:-27.4760,lng:152.9610,cat:"landmark"},
{s:"kangaroo-point",n:"Kangaroo Point",lat:-27.4800,lng:153.0360,cat:"landmark"},
{s:"fortitude-valley",n:"Fortitude Valley",lat:-27.4570,lng:153.0355,cat:"landmark"},
{s:"suncorp-stadium",n:"Suncorp Stadium",lat:-27.4645,lng:153.0095,cat:"landmark"},
{s:"the-gabba",n:"The Gabba",lat:-27.4860,lng:153.0380,cat:"landmark"},
{s:"surfers-paradise",n:"Surfers Paradise",lat:-28.0020,lng:153.4300,cat:"landmark"},
{s:"burleigh-beach",n:"Burleigh Beach",lat:-28.0870,lng:153.4480,cat:"landmark"},
{s:"broadbeach",n:"Broadbeach",lat:-28.0290,lng:153.4320,cat:"landmark"},
{s:"coolangatta",n:"Coolangatta",lat:-28.1680,lng:153.5360,cat:"landmark"},
{s:"noosa-main-beach",n:"Noosa Main Beach",lat:-26.3880,lng:153.0870,cat:"landmark"},
{s:"king-george-square",n:"King George Square",lat:-27.4680,lng:153.0240,cat:"landmark"},
{s:"brisbane-convention-centre",n:"Brisbane Convention Centre",lat:-27.4810,lng:153.0175,cat:"landmark"},
{s:"emporium-south-bank",n:"Emporium South Bank",lat:-27.4780,lng:153.0200,cat:"landmark"},
{s:"bulimba",n:"Bulimba Oxford Street",lat:-27.4570,lng:153.0565,cat:"area"},
{s:"paddington",n:"Paddington Latrobe Terrace",lat:-27.4600,lng:152.9970,cat:"area"},
{s:"stones-corner",n:"Stones Corner",lat:-27.4980,lng:153.0470,cat:"area"},
{s:"wynnum-central",n:"Wynnum Central",lat:-27.4480,lng:153.1555,cat:"area"},
{s:"cleveland",n:"Cleveland",lat:-27.5265,lng:153.2650,cat:"area"},
{s:"north-lakes",n:"North Lakes",lat:-27.2330,lng:152.9870,cat:"area"},
{s:"springfield-orion",n:"Springfield Orion",lat:-27.6700,lng:152.9090,cat:"area"}
];

var CAT_LABELS={"train":"Train Stations","hospital":"Hospitals","uni":"Universities","shopping":"Shopping Centres","transport":"Transport","landmark":"Landmarks & Attractions","area":"Neighbourhoods"};
var CAT_ICONS={"train":"\\ud83d\\ude89","hospital":"\\ud83c\\udfe5","uni":"\\ud83c\\udf93","shopping":"\\ud83d\\udecd","transport":"\\u2708\\ufe0f","landmark":"\\ud83d\\udccd","area":"\\ud83c\\udfd8"};

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
    cafes.push({n:n,s:(p[si]||"").trim(),c:city,sc:sc,nt:((p[noi]||"").trim()).substring(0,80),sl:makeSlug(n,(p[si]||"").trim()),lat:lat,lng:lng});}catch(e){}}

    var year=new Date().getFullYear();
    res.setHeader("Content-Type","text/html; charset=utf-8");
    res.setHeader("Cache-Control","public, s-maxage=3600, stale-while-revalidate=86400");

    // INDEX PAGE
    if(!landmark){
      var cats={};LANDMARKS.forEach(function(l){if(!cats[l.cat])cats[l.cat]=[];cats[l.cat].push(l);});
      var catOrder=["train","hospital","uni","shopping","transport","landmark","area"];
      var sections=catOrder.map(function(cat){
        if(!cats[cat])return"";
        var items=cats[cat].map(function(l){
          return'<a href="/coffee-near/'+l.s+'" style="display:inline-block;padding:8px 14px;border-radius:10px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);color:rgba(255,255,255,0.6);font-size:12px;text-decoration:none;margin:0 4px 6px 0;transition:border 0.15s">'+esc(l.n)+'</a>';
        }).join("");
        return'<div style="margin-bottom:24px"><div style="font-family:Bebas Neue,sans-serif;font-size:12px;letter-spacing:3px;color:rgba(255,255,255,0.25);margin-bottom:10px">'+(CAT_ICONS[cat]||"")+" "+CAT_LABELS[cat].toUpperCase()+' ('+cats[cat].length+')</div><div style="display:flex;flex-wrap:wrap">'+items+'</div></div>';
      }).join("");

      return res.status(200).send('<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Coffee Near You '+year+' | '+LANDMARKS.length+' Locations | Koffee Review</title><meta name="description" content="Find the best coffee near any train station, hospital, uni, or shopping centre. '+LANDMARKS.length+' locations mapped to '+cafes.length+'+ reviewed cafes."><link rel="canonical" href="https://koffeereview.com.au/coffee-near"><link rel="icon" href="/logo.webp"><link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet"><style>*{margin:0;padding:0;box-sizing:border-box}body{background:#111827;color:#e2e8f0;font-family:DM Sans,sans-serif;-webkit-font-smoothing:antialiased}.c{max-width:720px;margin:0 auto;padding:0 20px 60px}.nav{display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid rgba(255,255,255,0.08)}.nav-logo{display:flex;align-items:center;gap:10px;text-decoration:none}.nav-logo img{width:34px;height:34px;border-radius:50%}.nav-logo span{font-family:Bebas Neue,sans-serif;font-size:15px;letter-spacing:3px;color:#E6C073}.nav-links{display:flex;gap:14px}.nav-links a{font-size:12px;color:rgba(255,255,255,0.45);text-decoration:none}.ft{margin-top:32px;padding:20px 0;border-top:1px solid rgba(255,255,255,0.06);text-align:center;font-size:11px;color:rgba(255,255,255,0.3)}.ft a{color:rgba(255,255,255,0.5);text-decoration:none;margin:0 8px}</style></head><body><div class="c"><nav class="nav"><a href="/" class="nav-logo"><img src="/logo.webp" alt="KR"><span>KOFFEE REVIEW</span></a><div class="nav-links"><a href="/explore">Explore</a><a href="/leaderboard">Leaderboard</a></div></nav><div style="padding:28px 0 20px"><div style="font-size:10px;letter-spacing:3px;color:rgba(230,192,115,0.5);margin-bottom:8px">COFFEE NEAR YOU</div><h1 style="font-family:Bebas Neue,sans-serif;font-size:clamp(28px,7vw,42px);letter-spacing:2px;color:#fff">Find Coffee Near Any Location</h1><p style="font-size:14px;color:rgba(255,255,255,0.5);margin-top:8px">'+LANDMARKS.length+' locations. '+cafes.length+'+ reviewed cafes. Click any location to see the nearest cafes ranked by score.</p></div>'+sections+'<footer class="ft"><a href="/explore">Explore</a><a href="/leaderboard">Leaderboard</a><a href="/blog">Blog</a></footer></div></body></html>');
    }

    // INDIVIDUAL LANDMARK PAGE
    var lm=LANDMARKS.find(function(l){return l.s===landmark;});
    if(!lm)return res.status(404).send('<!DOCTYPE html><html><head><title>Not Found</title><meta name="robots" content="noindex"></head><body style="background:#111827;color:#fff;font-family:sans-serif;text-align:center;padding:60px"><h1 style="color:#E6C073">Location Not Found</h1><a href="/coffee-near" style="color:#E6C073">&larr; All Locations</a></body></html>');

    var nearby=cafes.map(function(c){c.d=dist(lm.lat,lm.lng,c.lat,c.lng);return c;}).filter(function(c){return c.d<=3;}).sort(function(a,b){return a.d-b.d;}).slice(0,10);
    var title="Best Coffee Near "+lm.n+" "+year+" | Koffee Review";
    var desc=nearby.length+" reviewed cafes within walking distance of "+lm.n+". Ranked by distance and scored out of 10.";

    var cards=nearby.map(function(c,i){
      var col=gc(c.sc);var v=gv(c.sc);
      return'<a href="/review/'+c.sl+'" style="display:flex;align-items:center;gap:14px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:14px 18px;margin-bottom:8px;text-decoration:none;color:inherit"><div style="font-size:12px;color:rgba(255,255,255,0.3);width:22px;text-align:center;flex-shrink:0">'+(i+1)+'</div><div style="width:44px;height:44px;border-radius:50%;border:2px solid '+col+';display:flex;align-items:center;justify-content:center;flex-shrink:0"><span style="font-family:Bebas Neue,sans-serif;font-size:18px;color:'+col+'">'+c.sc.toFixed(1)+'</span></div><div style="flex:1;min-width:0"><div style="font-size:14px;font-weight:600;color:#fff">'+esc(c.n)+'</div><div style="font-size:11px;color:rgba(255,255,255,0.4)">'+esc(c.s)+' &middot; '+(c.d<1?(c.d*1000).toFixed(0)+'m':c.d.toFixed(1)+'km')+' away</div></div><div style="padding:3px 10px;border-radius:20px;font-size:9px;font-weight:700;letter-spacing:1.5px;background:'+col+'18;color:'+col+';border:1px solid '+col+'40;flex-shrink:0">'+v+'</div></a>';
    }).join("");

    if(nearby.length===0)cards='<p style="text-align:center;color:rgba(255,255,255,0.4);padding:40px 0">No reviewed cafes within 3km of '+esc(lm.n)+' yet.</p>';

    return res.status(200).send('<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+title+'</title><meta name="description" content="'+esc(desc)+'"><link rel="canonical" href="https://koffeereview.com.au/coffee-near/'+lm.s+'"><link rel="icon" href="/logo.webp"><link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet"><style>*{margin:0;padding:0;box-sizing:border-box}body{background:#111827;color:#e2e8f0;font-family:DM Sans,sans-serif;-webkit-font-smoothing:antialiased}.c{max-width:620px;margin:0 auto;padding:0 20px 60px}.nav{display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid rgba(255,255,255,0.08)}.nav-logo{display:flex;align-items:center;gap:10px;text-decoration:none}.nav-logo img{width:34px;height:34px;border-radius:50%}.nav-logo span{font-family:Bebas Neue,sans-serif;font-size:15px;letter-spacing:3px;color:#E6C073}.nav-links{display:flex;gap:14px}.nav-links a{font-size:12px;color:rgba(255,255,255,0.45);text-decoration:none}.ft{margin-top:32px;padding:20px 0;border-top:1px solid rgba(255,255,255,0.06);text-align:center;font-size:11px;color:rgba(255,255,255,0.3)}.ft a{color:rgba(255,255,255,0.5);text-decoration:none;margin:0 8px}</style></head><body><div class="c"><nav class="nav"><a href="/" class="nav-logo"><img src="/logo.webp" alt="KR"><span>KOFFEE REVIEW</span></a><div class="nav-links"><a href="/coffee-near">All Locations</a><a href="/explore">Explore</a></div></nav><div style="font-size:12px;color:rgba(255,255,255,0.35);padding:12px 0"><a href="/" style="color:#E6C073;text-decoration:none">Home</a> &middot; <a href="/coffee-near" style="color:#E6C073;text-decoration:none">Coffee Near</a> &middot; '+esc(lm.n)+'</div><div style="padding:16px 0 16px"><div style="font-size:10px;letter-spacing:3px;color:rgba(230,192,115,0.5);margin-bottom:8px">'+(CAT_ICONS[lm.cat]||"")+" "+esc((CAT_LABELS[lm.cat]||"LOCATION").toUpperCase())+'</div><h1 style="font-family:Bebas Neue,sans-serif;font-size:clamp(24px,6vw,36px);letter-spacing:2px;color:#fff;margin-bottom:8px">Best Coffee Near '+esc(lm.n)+'</h1><p style="font-size:14px;color:rgba(255,255,255,0.5);line-height:1.6">'+nearby.length+' reviewed cafes within 3km. Ranked by distance. All scored with one latte, one double shot espresso.</p></div>'+cards+'<div style="margin-top:24px;display:flex;flex-direction:column;gap:8px"><a href="/coffee-near" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:14px;text-decoration:none;color:rgba(255,255,255,0.5);font-size:13px">&larr; All '+LANDMARKS.length+' Locations</a><a href="/explore" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:14px;text-decoration:none;color:rgba(255,255,255,0.5);font-size:13px">Explore &rarr;</a></div><footer class="ft"><a href="/explore">Explore</a><a href="/leaderboard">Leaderboard</a><a href="/blog">Blog</a></footer></div></body></html>');
  }catch(e){res.status(500).send("Error: "+e.message);}
}
