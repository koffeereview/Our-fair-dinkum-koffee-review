const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYEU8Khk3R5I879v3FcXPqhq0aCXa2ZWM1BwwJOyUitx2Boak_AFTOkwvB8qQrKIeU55NM4htFjHbI/pub?gid=0&single=true&output=csv";
const SPAIN = ["barcelona","catalonia","spain"];
function esc(s){return(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
function splitCSV(line){var r=[],c="",q=false;for(var i=0;i<line.length;i++){var ch=line[i];if(ch==='"')q=!q;else if(ch===","&&!q){r.push(c.trim());c="";}else c+=ch;}r.push(c.trim());return r;}
function makeSlug(n,s){return(n+"-"+s).toLowerCase().replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-").trim();}
function gc(s){if(s>=9.1)return"#ffffff";if(s>=8.1)return"#4ade80";if(s>=7.5)return"#2dd4bf";if(s>=7.1)return"#2dd4bf";if(s>=6.5)return"#facc15";if(s>=6.1)return"#facc15";if(s>=5.5)return"#fb923c";if(s>=5.1)return"#fb923c";return"#f87171";}
function gv(s){if(s>=9.1)return"ELITE";if(s>=8.1)return"GREAT";if(s>=7.5)return"MUST VISIT";if(s>=7.1)return"SOLID";if(s>=6.5)return"DECENT";if(s>=6.1)return"TAKE OR LEAVE";if(s>=5.5)return"AVERAGE";if(s>=5.1)return"JUST OKAY";if(s>=4.1)return"NOT FOR US";return"AVOID";}
function toTitle(s){return s.replace(/\w\S*/g,function(t){return t.charAt(0).toUpperCase()+t.substr(1).toLowerCase();});}

export default async function handler(req,res){
  try{
    var cityParam=(req.query.city||"brisbane").toLowerCase().replace(/-/g," ");
    var response=await fetch(SHEET_URL);var text=await response.text();
    var lines=text.split("\n").filter(function(l){return l.trim();});
    var h=splitCSV(lines[0]).map(function(x){return x.trim().toLowerCase();});
    var ni=h.indexOf("name"),si=h.indexOf("suburb"),ci=h.indexOf("city"),sci=h.indexOf("score"),noi=h.indexOf("notes"),pi=h.indexOf("price");
    var cafes=[];
    for(var i=1;i<lines.length;i++){try{var p=splitCSV(lines[i]);var n=(p[ni]||"").trim();if(!n)continue;var sc=parseFloat(p[sci])||0;if(sc<=0)continue;
    var city=(p[ci]||"").trim();if(SPAIN.indexOf(city.toLowerCase())!==-1)continue;
    if(city.toLowerCase()!==cityParam)continue;
    cafes.push({name:n,suburb:(p[si]||"").trim(),city:city,score:sc,notes:(p[noi]||"").trim(),price:(p[pi]||"").trim()});}catch(e){}}

    var cityDisplay=toTitle(cityParam);
    var citySlug=cityParam.replace(/\s+/g,"-");
    var sorted=cafes.sort(function(a,b){return b.score-a.score;});
    var total=cafes.length;
    if(total===0){res.setHeader("Content-Type","text/html");return res.status(404).send('<!DOCTYPE html><html><head><title>Not Found</title><meta name="robots" content="noindex"></head><body style="background:#0a0a0c;color:#fff;font-family:sans-serif;text-align:center;padding:60px"><h1 style="color:#E6C073">No reviews in '+esc(cityDisplay)+' yet</h1><a href="/explore" style="color:#E6C073">Explore &rarr;</a></body></html>');}
    var top=sorted[0];var second=sorted[1];var third=sorted[2];
    var mustVisit=cafes.filter(function(c){return c.score>=7.5;}).length;
    var avg=(cafes.reduce(function(s,c){return s+c.score;},0)/total).toFixed(1);
    var avoidCount=cafes.filter(function(c){return c.score<5.0;}).length;

    // Suburbs
    var subMap={};cafes.forEach(function(c){if(c.suburb){if(!subMap[c.suburb])subMap[c.suburb]=0;subMap[c.suburb]++;}});
    var suburbList=Object.keys(subMap).sort(function(a,b){return subMap[b]-subMap[a];});
    var suburbCount=suburbList.length;
    var topSuburbs=suburbList.slice(0,5);

    var year=new Date().getFullYear();
    var title="Best Coffee in "+cityDisplay+" "+year+" | "+total+"+ Cafes Ranked & Scored | Koffee Review";
    var desc="We tested "+total+"+ cafes in "+cityDisplay+" with one latte and one double shot espresso. Every cafe scored out of 10. No sponsorships. Top pick: "+esc(top.name)+" ("+top.score.toFixed(1)+"/10). Updated "+year+".";
    var canonical="https://koffeereview.com.au/best-coffee-"+citySlug;

    // Serialize for client-side rendering
    var cafeData=JSON.stringify(sorted.map(function(c){return{n:c.name,s:c.suburb,sc:c.score,nt:(c.notes||"").substring(0,80),p:c.price||""};}));

    // Noscript cards for SEO
    var noscriptCards=sorted.slice(0,30).map(function(c,i){
      var col=gc(c.score);var slug=makeSlug(c.name,c.suburb);
      return'<a href="/review/'+slug+'" style="display:block;padding:12px;margin-bottom:6px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:10px;text-decoration:none;color:#fff;font-size:14px">'+(i+1)+'. '+esc(c.name)+' ('+esc(c.suburb)+') — <span style="color:'+col+'">'+c.score.toFixed(1)+'/10</span></a>';
    }).join("");

    // Top 3 podium
    function podiumCard(c,rank,size){
      if(!c)return'';var col=gc(c.score);var slug=makeSlug(c.name,c.suburb);var v=gv(c.score);
      var isFirst=rank===1;
      return'<a href="/review/'+slug+'" style="flex:1;text-align:center;padding:'+(isFirst?'20px 10px':'16px 10px')+';background:rgba(255,255,255,0.03);border:1px solid '+(isFirst?'rgba(230,192,115,0.25)':'rgba(255,255,255,0.06)')+';border-radius:14px;text-decoration:none;color:inherit'+(isFirst?';position:relative;overflow:hidden':'')+'">'
        +(isFirst?'<div style="position:absolute;top:0;left:20%;right:20%;height:1px;background:linear-gradient(90deg,transparent,rgba(230,192,115,0.5),transparent)"></div>':'')
        +'<div style="font-family:Bebas Neue,sans-serif;font-size:12px;color:rgba(255,255,255,0.3);letter-spacing:2px;margin-bottom:6px">#'+rank+'</div>'
        +'<div style="font-family:Bebas Neue,sans-serif;font-size:'+(isFirst?'36px':'28px')+';color:'+col+';line-height:1">'+c.score.toFixed(1)+'</div>'
        +'<div style="font-size:10px;color:rgba(255,255,255,0.3);margin-bottom:8px">/10</div>'
        +'<div style="font-size:'+(isFirst?'15px':'13px')+';font-weight:600;color:#fff;margin-bottom:4px;line-height:1.2">'+esc(c.name)+'</div>'
        +'<div style="font-size:11px;color:rgba(255,255,255,0.35)">'+esc(c.suburb)+'</div>'
        +'<div style="display:inline-block;margin-top:8px;padding:3px 10px;border-radius:20px;font-size:9px;font-weight:700;letter-spacing:1.5px;background:'+col+'18;color:'+col+';border:1px solid '+col+'40">'+v+'</div></a>';
    }

    // Suburb filter options
    var filterOpts='<option value="all">All Suburbs ('+total+')</option>'+suburbList.map(function(s){return'<option value="'+esc(s)+'">'+esc(s)+' ('+subMap[s]+')</option>';}).join("");

    // Suburb quick links
    var suburbLinks=suburbList.slice(0,16).map(function(s){
      var subSlug=s.toLowerCase().replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-");
      return'<a href="/suburb/'+subSlug+'-'+citySlug+'" style="display:inline-block;padding:7px 14px;border-radius:10px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05);color:rgba(255,255,255,0.45);font-size:11px;text-decoration:none;margin:0 4px 4px 0">'+esc(s)+' ('+subMap[s]+')</a>';
    }).join("");

    // Email endpoint
    var emailEndpoint="https://script.google.com/macros/s/AKfycbwUf8FChUmnvnUrdvmRZRZV0YhgFZocNHw36RXb5xep1eZIKaKwS-Fx1vKoiyE4aa-9/exec";

    // FAQ schema — 6 questions targeting People Also Ask
    var faqSchema=JSON.stringify({"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
      {"@type":"Question","name":"What is the best coffee in "+cityDisplay+"?","acceptedAnswer":{"@type":"Answer","text":"Based on "+total+"+ blind taste tests, "+top.name+" in "+top.suburb+" serves the best coffee in "+cityDisplay+" with a score of "+top.score.toFixed(1)+"/10. We order one latte and one double shot espresso at every cafe. "+mustVisit+" cafes in "+cityDisplay+" score 7.5 or above (Must Visit tier)."}},
      {"@type":"Question","name":"Where to get good coffee in "+cityDisplay+"?","acceptedAnswer":{"@type":"Answer","text":"The best suburbs for coffee in "+cityDisplay+" based on our data are "+topSuburbs.slice(0,3).join(", ")+". We have reviewed "+total+"+ cafes across "+suburbCount+" suburbs. "+mustVisit+" cafes score 7.5+ which is our Must Visit threshold."}},
      {"@type":"Question","name":"How many good cafes are in "+cityDisplay+"?","acceptedAnswer":{"@type":"Answer","text":mustVisit+" cafes in "+cityDisplay+" score 7.5 or above out of "+total+"+ tested. The average score is "+avg+"/10. We use a standardised system: one latte and one double shot espresso at every cafe."}},
      {"@type":"Question","name":"How does Koffee Review rank cafes?","acceptedAnswer":{"@type":"Answer","text":"We visit every cafe anonymously and order one latte and one double shot espresso. Same drinks, same size, every time. We score on extraction quality, milk technique, balance, and finish out of 10. No sponsorships. "+total+"+ cafes tested in "+cityDisplay+"."}},
      {"@type":"Question","name":"What cafes should I avoid in "+cityDisplay+"?","acceptedAnswer":{"@type":"Answer","text":"We publish cafes scoring below 5.0 on our Cafes to Avoid page. In "+cityDisplay+", "+avoidCount+" cafes scored below 5.0. We believe knowing where NOT to go is as valuable as knowing where to go."}},
      {"@type":"Question","name":"Is Koffee Review independent?","acceptedAnswer":{"@type":"Answer","text":"Yes. Koffee Review accepts no sponsorships, no free coffees, and no paid placements. We pay for every coffee. No cafe knows we are reviewing them. "+total+"+ cafes tested independently since 2021."}}
    ]});

    // ItemList schema — top 20
    var itemListSchema=JSON.stringify({"@context":"https://schema.org","@type":"ItemList","name":"Best Coffee in "+cityDisplay+" "+year,"numberOfItems":Math.min(total,20),"itemListElement":sorted.slice(0,20).map(function(c,i){return{"@type":"ListItem","position":i+1,"item":{"@type":"CafeOrCoffeeShop","name":c.name,"address":{"@type":"PostalAddress","addressLocality":c.suburb,"addressRegion":c.city,"addressCountry":"AU"},"aggregateRating":{"@type":"AggregateRating","ratingValue":c.score,"bestRating":10,"worstRating":0,"reviewCount":1}}};})});

    var html=`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${desc}">
  <link rel="canonical" href="${canonical}">
  <meta property="og:title" content="${title}"><meta property="og:description" content="${desc}">
  <meta property="og:url" content="${canonical}"><meta property="og:image" content="https://koffeereview.com.au/logo.webp">
  <link rel="icon" href="/logo.webp">
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
  <script type="application/ld+json">${itemListSchema}<\/script>
  <script type="application/ld+json">${faqSchema}<\/script>
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Koffee Review","item":"https://koffeereview.com.au"},{"@type":"ListItem","position":2,"name":"Best Coffee ${esc(cityDisplay)}","item":"${canonical}"}]}<\/script>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{background:#0a0a0c;color:#fff;font-family:'DM Sans',sans-serif;min-height:100vh;-webkit-font-smoothing:antialiased}
    .c{max-width:720px;margin:0 auto;padding:0 20px 60px}
    .nav{display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid rgba(255,255,255,0.06)}
    .nav-logo{display:flex;align-items:center;gap:10px;text-decoration:none}.nav-logo img{width:34px;height:34px;border-radius:50%}.nav-logo span{font-family:'Bebas Neue',sans-serif;font-size:15px;letter-spacing:3px;color:#E6C073}
    .nav-links{display:flex;gap:14px}.nav-links a{font-size:12px;color:rgba(255,255,255,0.45);text-decoration:none}.nav-links a:hover{color:#E6C073}
    .stats{display:flex;gap:0;margin:0 auto 20px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05);border-radius:14px;overflow:hidden}
    .stat{flex:1;text-align:center;padding:14px 8px;border-right:1px solid rgba(255,255,255,0.03)}.stat:last-child{border:none}
    .stat-n{font-family:'Bebas Neue',sans-serif;font-size:26px;color:#E6C073;line-height:1}.stat-l{font-size:9px;letter-spacing:2px;color:rgba(255,255,255,0.3);margin-top:2px}
    .top3{display:flex;gap:8px;margin-bottom:24px;align-items:flex-end}
    .filter-bar{display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap}
    select{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;color:#fff;padding:10px 14px;font-size:13px;font-family:'DM Sans',sans-serif;cursor:pointer;outline:none;flex:1;min-width:120px}
    .near-btn{padding:10px 16px;border-radius:10px;background:rgba(230,192,115,0.06);border:1px solid rgba(230,192,115,0.15);color:#E6C073;font-size:12px;font-weight:600;cursor:pointer;font-family:'DM Sans',sans-serif;white-space:nowrap}
    .lm-btn{width:100%;padding:14px;border-radius:12px;background:rgba(230,192,115,0.06);border:1px solid rgba(230,192,115,0.15);color:#E6C073;font-size:13px;font-weight:600;cursor:pointer;font-family:'DM Sans',sans-serif;margin-bottom:16px;display:none}
    .ed{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05);border-radius:14px;padding:20px;margin-bottom:24px}
    .ed p{font-size:14px;color:rgba(255,255,255,0.6);line-height:1.8;margin-bottom:10px}.ed p:last-child{margin:0}
    .ed a{color:#E6C073;text-decoration:none;border-bottom:1px solid rgba(230,192,115,0.3)}
    .em{margin:24px 0;padding:16px 18px;border-radius:14px;background:rgba(230,192,115,0.03);border:1px solid rgba(230,192,115,0.12)}
    .ft{margin-top:32px;padding:20px 0;border-top:1px solid rgba(255,255,255,0.04);text-align:center;font-size:11px;color:rgba(255,255,255,0.3)}
    .ft a{color:rgba(255,255,255,0.5);text-decoration:none;margin:0 8px}.ft a:hover{color:#E6C073}
    .fq-item{margin-bottom:8px;border:1px solid rgba(255,255,255,0.08);border-radius:10px;overflow:hidden}
    .fq-item[open]{border-color:rgba(230,192,115,0.25)}
    .fq-q{padding:14px 16px;font-size:14px;font-weight:600;color:#fff;cursor:pointer;list-style:none}
    .fq-q::-webkit-details-marker{display:none}
    .fq-q::after{content:"+";color:#E6C073;font-size:16px;float:right}
    .fq-item[open] .fq-q::after{content:"-"}
    .fq-a{padding:0 16px 14px;font-size:13px;color:rgba(255,255,255,0.55);line-height:1.6}
  </style>
</head>
<body>
<div class="c">
  <nav class="nav"><a href="/" class="nav-logo"><img src="/logo.webp" alt="KR"><span>KOFFEE REVIEW</span></a><div class="nav-links"><a href="/city/${citySlug}">${esc(cityDisplay)}</a><a href="/explore">Explore</a><a href="/blog">Blog</a></div></nav>

  <div style="padding:28px 0 16px">
    <div style="font-size:10px;letter-spacing:3px;color:rgba(230,192,115,0.5);margin-bottom:8px">${esc(cityDisplay).toUpperCase()} &middot; ${year} &middot; UPDATED ${new Date().toLocaleDateString("en-AU",{month:"long"}).toUpperCase()}</div>
    <h1 style="font-family:Bebas Neue,sans-serif;font-size:clamp(28px,7vw,44px);letter-spacing:2px;color:#fff;margin-bottom:8px">Best Coffee in ${esc(cityDisplay)}</h1>
    <p style="font-size:14px;color:rgba(255,255,255,0.45);line-height:1.6">${total}+ cafes reviewed with one latte and one double shot espresso. Every cafe scored out of 10. No sponsorships, no agendas. Just honest scores.</p>
  </div>

  <div class="stats">
    <div class="stat"><div class="stat-n">${total}+</div><div class="stat-l">REVIEWED</div></div>
    <div class="stat"><div class="stat-n">${mustVisit}</div><div class="stat-l">MUST VISIT</div></div>
    <div class="stat"><div class="stat-n">${avg}</div><div class="stat-l">AVG SCORE</div></div>
    <div class="stat"><div class="stat-n">${suburbCount}</div><div class="stat-l">SUBURBS</div></div>
  </div>

  <!-- EDITORIAL INTRO — Google indexes this -->
  <div class="ed">
    <p>${esc(cityDisplay)} has ${total}+ cafes and counting. We have reviewed every one with the same order: one latte and one double shot espresso. No substitutions, no freebies, no sponsorships. Every score on this page is earned.</p>
    <p>${mustVisit} cafes hit our Must Visit threshold (7.5+). The average score across ${esc(cityDisplay)} is ${avg}/10. ${parseFloat(avg) >= 6.5 ? "That puts " + esc(cityDisplay) + " above the national average for coffee quality." : "Quality varies by suburb. Use our rankings to find the standouts."} The best suburbs are ${topSuburbs.slice(0,3).join(", ")}.</p>
    <p style="font-size:13px;color:rgba(230,192,115,0.5);margin:0">Last updated ${new Date().toLocaleDateString("en-AU",{month:"long",year:"numeric"})} &middot; <a href="/how-we-score">How we score &rarr;</a></p>
  </div>

  <!-- TOP 3 PODIUM -->
  <div style="font-family:Bebas Neue,sans-serif;font-size:12px;letter-spacing:3px;color:rgba(255,255,255,0.25);margin-bottom:10px">TOP 3 IN ${esc(cityDisplay).toUpperCase()}</div>
  <div class="top3">
    ${second?podiumCard(second,2,"small"):''}
    ${podiumCard(top,1,"large")}
    ${third?podiumCard(third,3,"small"):''}
  </div>

  <!-- FILTERS -->
  <div class="filter-bar">
    <select onchange="filterSuburb(this.value)">${filterOpts}</select>
    <button class="near-btn" onclick="nearMe()">&#128205; Near Me</button>
  </div>
  <div id="nbanner" style="display:none;padding:10px 14px;border-radius:10px;background:rgba(74,222,128,0.06);border:1px solid rgba(74,222,128,0.15);color:#4ade80;font-size:12px;margin-bottom:12px"></div>

  <!-- CAFE LIST -->
  <div id="cl"></div>
  <div id="countLabel" style="text-align:center;font-size:12px;color:rgba(255,255,255,0.3);margin:8px 0"></div>
  <button class="lm-btn" id="lmBtn" onclick="loadMore()">LOAD MORE</button>
  <noscript>${noscriptCards}</noscript>

  <!-- EMAIL CAPTURE -->
  <div class="em">
    <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:10px">
      <div>
        <div style="font-family:Bebas Neue,sans-serif;font-size:11px;letter-spacing:3px;color:#E6C073">WEEKLY COFFEE INTEL</div>
        <div style="font-size:12px;color:rgba(255,255,255,0.45);margin-top:4px"><strong style="color:rgba(255,255,255,0.7)">Know before you go</strong> &mdash; new reviews and hidden gems.</div>
      </div>
      <span style="font-size:8px;letter-spacing:2px;color:#0d0d0f;background:linear-gradient(135deg,#c8a96e,#E6C073);padding:3px 10px;border-radius:5px;font-weight:700;white-space:nowrap;margin-left:10px;flex-shrink:0">WEEKLY</span>
    </div>
    <div style="display:flex;gap:6px" id="emailRow">
      <input type="email" id="emailInput" placeholder="your@email.com" onkeydown="if(event.key==='Enter')submitEmail()" style="flex:1;padding:10px 12px;border-radius:8px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);color:#fff;font-size:12px;outline:none;font-family:DM Sans,sans-serif;min-width:0">
      <button onclick="submitEmail()" id="emailBtn" style="padding:10px 18px;border-radius:8px;background:linear-gradient(135deg,#c8a96e,#f5e6c8);border:none;color:#0a0a0a;font-size:11px;font-weight:700;cursor:pointer;font-family:DM Sans,sans-serif;white-space:nowrap">Notify Me</button>
    </div>
  </div>

  <!-- SUBURB QUICK LINKS -->
  <div style="margin-top:24px">
    <div style="font-family:Bebas Neue,sans-serif;font-size:12px;letter-spacing:3px;color:rgba(255,255,255,0.25);margin-bottom:10px">BROWSE ${esc(cityDisplay).toUpperCase()} BY SUBURB</div>
    <div style="display:flex;flex-wrap:wrap">${suburbLinks}</div>
  </div>

  <!-- FAQ -->
  <div style="margin-top:28px">
    <div style="font-family:Bebas Neue,sans-serif;font-size:12px;letter-spacing:3px;color:rgba(255,255,255,0.25);margin-bottom:10px">FREQUENTLY ASKED</div>
    <details class="fq-item"><summary class="fq-q">What is the best coffee in ${esc(cityDisplay)}?</summary><p class="fq-a">Based on ${total}+ blind taste tests, ${esc(top.name)} in ${esc(top.suburb)} serves the best coffee in ${esc(cityDisplay)} with ${top.score.toFixed(1)}/10. ${mustVisit} cafes score 7.5+ (Must Visit tier).</p></details>
    <details class="fq-item"><summary class="fq-q">Where to get good coffee in ${esc(cityDisplay)}?</summary><p class="fq-a">The best suburbs are ${topSuburbs.slice(0,3).join(", ")}. We have reviewed ${total}+ cafes across ${suburbCount} suburbs. ${mustVisit} cafes score 7.5+ which is our Must Visit threshold.</p></details>
    <details class="fq-item"><summary class="fq-q">How does Koffee Review rank cafes?</summary><p class="fq-a">We order one latte and one double shot espresso at every cafe. Same drinks, same size, every time. We score on extraction, milk technique, balance, and finish. No sponsorships. ${total}+ cafes tested.</p></details>
    <details class="fq-item"><summary class="fq-q">What cafes should I avoid in ${esc(cityDisplay)}?</summary><p class="fq-a">${avoidCount} cafes in ${esc(cityDisplay)} scored below 5.0 in our system. See our full Cafes to Avoid page at koffeereview.com.au.</p></details>
    <details class="fq-item"><summary class="fq-q">Is Koffee Review independent?</summary><p class="fq-a">Yes. No sponsorships, no free coffees, no paid placements. We pay for every coffee. No cafe knows we are reviewing them. ${total}+ cafes tested independently since 2021.</p></details>
  </div>

  <!-- EXPLORE MORE LINKS -->
  <div style="margin-top:28px">
    <div style="font-family:Bebas Neue,sans-serif;font-size:12px;letter-spacing:3px;color:rgba(255,255,255,0.25);margin-bottom:10px">EXPLORE MORE</div>
    <div style="display:flex;flex-direction:column;gap:8px">
      <a href="/best-latte-${citySlug}" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;text-decoration:none;color:rgba(255,255,255,0.5);font-size:13px">Best Latte in ${esc(cityDisplay)} <span style="color:rgba(255,255,255,0.2)">&rarr;</span></a>
      <a href="/best-espresso-${citySlug}" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;text-decoration:none;color:rgba(255,255,255,0.5);font-size:13px">Best Espresso in ${esc(cityDisplay)} <span style="color:rgba(255,255,255,0.2)">&rarr;</span></a>
      <a href="/must-visit-cafes" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:rgba(230,192,115,0.03);border:1px solid rgba(230,192,115,0.12);border-radius:14px;text-decoration:none;color:#E6C073;font-size:13px">All Must Visit Cafes (7.5+) <span style="color:rgba(230,192,115,0.4)">&rarr;</span></a>
      <a href="/brisbane-cafes-to-avoid" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;text-decoration:none;color:rgba(255,255,255,0.5);font-size:13px">Cafes to Avoid <span style="color:rgba(255,255,255,0.2)">&rarr;</span></a>
      <a href="/leaderboard" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;text-decoration:none;color:rgba(255,255,255,0.5);font-size:13px">National Leaderboard <span style="color:rgba(255,255,255,0.2)">&rarr;</span></a>
      <a href="/explore" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;text-decoration:none;color:rgba(255,255,255,0.5);font-size:13px">Explore Koffee Review <span style="color:rgba(255,255,255,0.2)">&rarr;</span></a>
    </div>
  </div>

  <footer class="ft">
    <p>&copy; ${year} Our Fair Dinkum Koffee Review</p>
    <div style="margin-top:10px"><a href="/leaderboard">Leaderboard</a><a href="/explore">Explore</a><a href="/blog">Blog</a><a href="/how-we-score">How We Score</a></div>
  </footer>
</div>

<script>
  var AC=${cafeData};var page=0;var PP=10;var filtered=AC;var nearMode=false;
  function gc(s){if(s>=9.1)return"#ffffff";if(s>=8.1)return"#4ade80";if(s>=7.5)return"#2dd4bf";if(s>=7.1)return"#2dd4bf";if(s>=6.5)return"#facc15";if(s>=6.1)return"#facc15";if(s>=5.5)return"#fb923c";if(s>=5.1)return"#fb923c";return"#f87171";}
  function gv(s){if(s>=9.1)return"ELITE";if(s>=8.1)return"GREAT";if(s>=7.5)return"MUST VISIT";if(s>=7.1)return"SOLID";if(s>=6.5)return"DECENT";if(s>=6.1)return"TAKE OR LEAVE";if(s>=5.5)return"AVERAGE";if(s>=5.1)return"JUST OKAY";if(s>=4.1)return"NOT FOR US";return"AVOID";}
  function ms(n,s){return(n+"-"+s).toLowerCase().replace(/[^a-z0-9\\s-]/g,"").replace(/\\s+/g,"-").replace(/-+/g,"-").trim();}
  function render(){
    var show=filtered.slice(0,(page+1)*PP);var h="";
    show.forEach(function(c,i){var col=gc(c.sc);var v=gv(c.sc);var slug=ms(c.n,c.s);
      h+='<a href="/review/'+slug+'" style="display:flex;align-items:center;gap:14px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;padding:14px 18px;margin-bottom:8px;text-decoration:none;color:inherit"><div style="font-size:12px;color:rgba(255,255,255,0.25);width:22px;text-align:center;flex-shrink:0">'+(i+1)+'</div><div style="width:44px;height:44px;border-radius:50%;border:2px solid '+col+';display:flex;align-items:center;justify-content:center;flex-shrink:0"><span style="font-family:Bebas Neue,sans-serif;font-size:18px;color:'+col+'">'+c.sc.toFixed(1)+'</span></div><div style="flex:1;min-width:0"><div style="font-size:14px;font-weight:600;color:#fff">'+c.n+'</div><div style="font-size:11px;color:rgba(255,255,255,0.35)">'+c.s+(c.p?" \\u00b7 "+c.p:"")+'</div>'+(c.nt?'<div style="font-size:11px;color:rgba(255,255,255,0.25);font-style:italic;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:280px">'+c.nt+'</div>':'')+'</div><div style="padding:3px 10px;border-radius:20px;font-size:9px;font-weight:700;letter-spacing:1.5px;background:'+col+'18;color:'+col+';border:1px solid '+col+'40;flex-shrink:0;white-space:nowrap">'+v+'</div></a>';
    });
    document.getElementById("cl").innerHTML=h;
    if(filtered.length<=PP){document.getElementById("countLabel").textContent="";document.getElementById("lmBtn").style.display="none";}
    else{document.getElementById("countLabel").textContent="Showing "+show.length+" of "+filtered.length+" cafes";
    var btn=document.getElementById("lmBtn");
    if(show.length<filtered.length){btn.style.display="block";btn.textContent="LOAD "+Math.min(PP,filtered.length-show.length)+" MORE \\u00b7 "+show.length+" of "+filtered.length+" shown";}else btn.style.display="none";}
  }
  function loadMore(){page++;render();}
  function filterSuburb(v){page=0;nearMode=false;document.getElementById("nbanner").style.display="none";
    if(v==="all")filtered=AC;else filtered=AC.filter(function(c){return c.s===v;});render();}
  function nearMe(){
    if(!navigator.geolocation)return;
    navigator.geolocation.getCurrentPosition(function(pos){
      nearMode=true;page=0;
      document.getElementById("nbanner").style.display="block";
      document.getElementById("nbanner").textContent="Showing cafes nearest to you";
      filtered=AC;render();
    });
  }
  function submitEmail(){
    var input=document.getElementById("emailInput");var btn=document.getElementById("emailBtn");
    var email=(input.value||"").trim();if(!email||email.indexOf("@")===-1){input.style.borderColor="rgba(248,113,113,0.5)";return;}
    btn.textContent="...";btn.style.opacity="0.6";
    fetch("${emailEndpoint}",{method:"POST",body:JSON.stringify({email:email,source:"best-coffee",ts:new Date().toISOString()})}).catch(function(){});
    document.getElementById("emailRow").innerHTML='<div style="text-align:center;width:100%;padding:4px 0"><span style="color:#4ade80">\\u2713</span> You are in. Weekly coffee intel incoming.</div>';
  }
  render();
<\/script>
</body>
</html>`;

    res.setHeader("Content-Type","text/html; charset=utf-8");
    res.setHeader("Cache-Control","public, s-maxage=3600, stale-while-revalidate=86400");
    res.status(200).send(html);
  }catch(e){res.status(500).send("Error");}
}
