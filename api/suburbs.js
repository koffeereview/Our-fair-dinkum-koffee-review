const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYEU8Khk3R5I879v3FcXPqhq0aCXa2ZWM1BwwJOyUitx2Boak_AFTOkwvB8qQrKIeU55NM4htFjHbI/pub?gid=0&single=true&output=csv";
const SPAIN = ["barcelona","catalonia","spain"];
function esc(s){return(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
function splitCSV(line){var r=[],c="",q=false;for(var i=0;i<line.length;i++){var ch=line[i];if(ch==='"')q=!q;else if(ch===","&&!q){r.push(c.trim());c="";}else c+=ch;}r.push(c.trim());return r;}
function slug(s){return(s||"").toLowerCase().replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-").trim();}
function gc(s){if(s>=9.1)return"#ffffff";if(s>=8.1)return"#4ade80";if(s>=7.5)return"#2dd4bf";if(s>=7.1)return"#2dd4bf";if(s>=6.5)return"#facc15";if(s>=6.1)return"#facc15";if(s>=5.5)return"#fb923c";if(s>=5.1)return"#fb923c";return"#f87171";}

export default async function handler(req,res){
  try{
    var response=await fetch(SHEET_URL);var text=await response.text();
    var lines=text.split("\n").filter(function(l){return l.trim();});
    var h=splitCSV(lines[0]).map(function(x){return x.trim().toLowerCase();});
    var ni=h.indexOf("name"),si=h.indexOf("suburb"),ci=h.indexOf("city"),sci=h.indexOf("score");
    var cafes=[];
    for(var i=1;i<lines.length;i++){try{var p=splitCSV(lines[i]);var n=(p[ni]||"").trim();if(!n)continue;var sc=parseFloat(p[sci])||0;if(sc<=0)continue;
    var city=(p[ci]||"").trim();if(SPAIN.indexOf(city.toLowerCase())!==-1)continue;
    cafes.push({n:n,s:(p[si]||"").trim(),c:city,sc:sc});}catch(e){}}

    // Build suburb map grouped by city
    var cityMap={};
    cafes.forEach(function(c){
      var ck=c.c||"Brisbane";
      if(!cityMap[ck])cityMap[ck]={};
      var sk=c.s;
      if(!cityMap[ck][sk])cityMap[ck][sk]={count:0,total:0,top:0,topName:"",cafes:[]};
      cityMap[ck][sk].count++;
      cityMap[ck][sk].total+=c.sc;
      if(c.sc>cityMap[ck][sk].top){cityMap[ck][sk].top=c.sc;cityMap[ck][sk].topName=c.n;}
      cityMap[ck][sk].cafes.push(c);
    });

    var year=new Date().getFullYear();
    var totalSuburbs=0;
    var cityOrder=Object.keys(cityMap).sort(function(a,b){
      var ca=Object.keys(cityMap[a]).length;
      var cb=Object.keys(cityMap[b]).length;
      return cb-ca;
    });

    var cityColors={"Brisbane":"#E6C073","Gold Coast":"#4ade80","Sunshine Coast":"#60a5fa","Moreton Bay":"#a78bfa","Ipswich":"#fb923c","Melbourne":"#f472b6","Logan":"#38bdf8","Redland":"#facc15","Noosa":"#2dd4bf"};

    var sections=cityOrder.map(function(city){
      var suburbs=cityMap[city];
      var subList=Object.keys(suburbs).map(function(s){
        var d=suburbs[s];
        d.name=s;
        d.avg=d.total/d.count;
        return d;
      }).sort(function(a,b){return b.avg-a.avg;});
      totalSuburbs+=subList.length;
      var color=cityColors[city]||"#E6C073";
      var citySlug=slug(city);

      var cards=subList.map(function(sub){
        var avgCol=gc(sub.avg);
        var topCol=gc(sub.top);
        var subSlug=slug(sub.name)+"-"+citySlug;
        return'<a href="/suburb/'+subSlug+'" style="display:flex;align-items:center;gap:14px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;padding:14px 16px;text-decoration:none;color:inherit;transition:border 0.2s" onmouseover="this.style.borderColor=\'rgba(230,192,115,0.25)\'" onmouseout="this.style.borderColor=\'rgba(255,255,255,0.06)\'">'
          +'<div style="width:48px;height:48px;border-radius:50%;border:2px solid '+avgCol+';display:flex;align-items:center;justify-content:center;flex-shrink:0"><span style="font-family:Bebas Neue,sans-serif;font-size:18px;color:'+avgCol+'">'+sub.avg.toFixed(1)+'</span></div>'
          +'<div style="flex:1;min-width:0"><div style="font-size:15px;font-weight:600;color:#fff">'+esc(sub.name)+'</div>'
          +'<div style="font-size:11px;color:rgba(255,255,255,0.4);margin-top:2px">'+sub.count+' cafe'+(sub.count>1?"s":"")+' reviewed &middot; Top: <span style="color:'+topCol+'">'+sub.top.toFixed(1)+'</span></div></div>'
          +'<div style="font-size:13px;color:rgba(255,255,255,0.2);flex-shrink:0">&rarr;</div></a>';
      }).join("");

      return'<div style="margin-bottom:32px">'
        +'<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;padding-bottom:8px;border-bottom:1px solid rgba(255,255,255,0.04)">'
        +'<div style="width:8px;height:8px;border-radius:50%;background:'+color+'"></div>'
        +'<div style="font-family:Bebas Neue,sans-serif;font-size:13px;letter-spacing:3px;color:rgba(255,255,255,0.35)">'+city.toUpperCase()+'</div>'
        +'<div style="font-size:11px;color:rgba(255,255,255,0.2)">'+subList.length+' suburbs</div>'
        +'<a href="/city/'+citySlug+'" style="margin-left:auto;font-size:11px;color:rgba(230,192,115,0.5);text-decoration:none">All '+city+' &rarr;</a></div>'
        +'<div style="display:flex;flex-direction:column;gap:8px">'+cards+'</div></div>';
    }).join("");

    var stats='<div style="display:flex;gap:0;margin-bottom:24px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:14px;overflow:hidden">'
      +'<div style="flex:1;text-align:center;padding:14px 8px;border-right:1px solid rgba(255,255,255,0.03)"><div style="font-family:Bebas Neue,sans-serif;font-size:26px;color:#E6C073">'+totalSuburbs+'</div><div style="font-size:9px;letter-spacing:2px;color:rgba(255,255,255,0.3)">SUBURBS</div></div>'
      +'<div style="flex:1;text-align:center;padding:14px 8px;border-right:1px solid rgba(255,255,255,0.03)"><div style="font-family:Bebas Neue,sans-serif;font-size:26px;color:#E6C073">'+cafes.length+'</div><div style="font-size:9px;letter-spacing:2px;color:rgba(255,255,255,0.3)">CAFES</div></div>'
      +'<div style="flex:1;text-align:center;padding:14px 8px"><div style="font-family:Bebas Neue,sans-serif;font-size:26px;color:#E6C073">'+cityOrder.length+'</div><div style="font-size:9px;letter-spacing:2px;color:rgba(255,255,255,0.3)">CITIES</div></div></div>';

    res.setHeader("Content-Type","text/html; charset=utf-8");
    res.setHeader("Cache-Control","public, s-maxage=3600, stale-while-revalidate=86400");
    res.status(200).send('<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
      +'<title>All Suburbs '+year+' | Coffee Reviews by Suburb | Koffee Review</title>'
      +'<meta name="description" content="'+totalSuburbs+' suburbs reviewed across '+cityOrder.length+' cities. Find the best coffee in your suburb. Every cafe scored with one latte, one double shot.">'
      +'<link rel="canonical" href="https://koffeereview.com.au/suburbs"><link rel="icon" href="/logo.webp">'
      +'<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">'
      +'<style>*{margin:0;padding:0;box-sizing:border-box}body{background:#0a0a0c;color:#e2e8f0;font-family:DM Sans,sans-serif;-webkit-font-smoothing:antialiased}.c{max-width:720px;margin:0 auto;padding:0 20px 60px}.nav{display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid rgba(255,255,255,0.06)}.nav-logo{display:flex;align-items:center;gap:10px;text-decoration:none}.nav-logo img{width:34px;height:34px;border-radius:50%}.nav-logo span{font-family:Bebas Neue,sans-serif;font-size:15px;letter-spacing:3px;color:#E6C073}.nav-links{display:flex;gap:14px}.nav-links a{font-size:12px;color:rgba(255,255,255,0.45);text-decoration:none}.ft{margin-top:32px;padding:20px 0;border-top:1px solid rgba(255,255,255,0.04);text-align:center;font-size:11px;color:rgba(255,255,255,0.3)}.ft a{color:rgba(255,255,255,0.5);text-decoration:none;margin:0 8px}</style>'
      +'</head><body><div class="c">'
      +'<nav class="nav"><a href="/" class="nav-logo"><img src="/logo.webp" alt="KR"><span>KOFFEE REVIEW</span></a><div class="nav-links"><a href="/explore">Explore</a><a href="/leaderboard">Leaderboard</a></div></nav>'
      +'<div style="font-size:12px;color:rgba(255,255,255,0.35);padding:12px 0"><a href="/" style="color:#E6C073;text-decoration:none">Home</a> &middot; Suburbs</div>'
      +'<div style="padding:16px 0 20px"><div style="font-size:10px;letter-spacing:3px;color:rgba(230,192,115,0.5);margin-bottom:8px">BROWSE BY SUBURB</div>'
      +'<h1 style="font-family:Bebas Neue,sans-serif;font-size:clamp(28px,7vw,44px);letter-spacing:2px;color:#fff">All Suburbs Reviewed</h1>'
      +'<p style="font-size:14px;color:rgba(255,255,255,0.45);margin-top:10px;line-height:1.6">Every suburb we have reviewed, sorted by average score. Click any suburb to see all cafes ranked.</p></div>'
      +stats+sections
      +'<div style="margin-top:20px;display:flex;flex-direction:column;gap:8px">'
      +'<a href="/best-coffee-brisbane" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:rgba(230,192,115,0.03);border:1px solid rgba(230,192,115,0.12);border-radius:14px;text-decoration:none;color:#E6C073;font-size:13px">Best Coffee Brisbane &rarr;</a>'
      +'<a href="/coffee-near" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;text-decoration:none;color:rgba(255,255,255,0.5);font-size:13px">Coffee Near You (90+ Locations) &rarr;</a>'
      +'<a href="/map" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;text-decoration:none;color:rgba(255,255,255,0.5);font-size:13px">Interactive Map &rarr;</a>'
      +'<a href="/explore" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;text-decoration:none;color:rgba(255,255,255,0.5);font-size:13px">Explore &rarr;</a></div>'
      +'<footer class="ft"><a href="/explore">Explore</a><a href="/leaderboard">Leaderboard</a><a href="/blog">Blog</a></footer></div></body></html>');
  }catch(e){res.status(500).send("Error: "+(e.message||"unknown"));}
}
