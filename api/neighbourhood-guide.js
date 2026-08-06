const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYEU8Khk3R5I879v3FcXPqhq0aCXa2ZWM1BwwJOyUitx2Boak_AFTOkwvB8qQrKIeU55NM4htFjHbI/pub?gid=0&single=true&output=csv";
const SPAIN_CITIES = ["barcelona","catalonia","spain"];
const EMAIL_ENDPOINT = "https://script.google.com/macros/s/AKfycbwUf8FChUmnvnUrdvmRZRZV0YhgFZocNHw36RXb5xep1eZIKaKwS-Fx1vKoiyE4aa-9/exec";

function makeSlug(n,s){return(n+"-"+s).toLowerCase().replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-").trim();}
function guideSlug(s,c){return(s+"-"+c+"-coffee").toLowerCase().replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-").trim();}
function esc(s){return(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
function splitCSV(line){var r=[],c="",q=false;for(var i=0;i<line.length;i++){var ch=line[i];if(ch==='"')q=!q;else if(ch===","&&!q){r.push(c.trim());c="";}else c+=ch;}r.push(c.trim());return r;}
function parseCSV(text){var lines=text.split("\n").filter(function(l){return l.trim();});if(lines.length<2)return[];var h=splitCSV(lines[0]).map(function(x){return x.trim().toLowerCase();});var ni=h.indexOf("name"),si=h.indexOf("suburb"),ci=h.indexOf("city"),sci=h.indexOf("score"),pi=h.indexOf("price"),noi=h.indexOf("notes");if(ni===-1||si===-1)return[];var out=[];for(var i=1;i<lines.length;i++){try{var p=splitCSV(lines[i]);var n=(p[ni]||"").trim();if(!n)continue;var sc=parseFloat(p[sci])||0;if(sc<=0)continue;var city=(p[ci]||"").trim();if(SPAIN_CITIES.indexOf(city.toLowerCase())!==-1)continue;out.push({name:n,suburb:(p[si]||"").trim(),city:city,score:sc,price:(p[pi]||"$$$").trim(),notes:(p[noi]||"").trim()});}catch(e){}}return out;}

function gc(s){if(s>=9)return"#ffffff";if(s>=8)return"#4ade80";if(s>=7)return"#2dd4bf";if(s>=6)return"#facc15";if(s>=5)return"#fb923c";return"#f87171";}
function gv(s){if(s>=9.1)return"ELITE";if(s>=8.1)return"GREAT";if(s>=7.5)return"MUST VISIT";if(s>=7.1)return"SOLID";if(s>=6.5)return"DECENT";if(s>=6.1)return"TAKE OR LEAVE";if(s>=5.5)return"AVERAGE";if(s>=5.1)return"JUST OKAY";if(s>=4.1)return"NOT FOR US";return"AVOID";}

// Hand-crafted intros for flagship suburbs
var INTROS = {
  "newstead":"Newstead reads like a coffee destination on paper. Industry Beans, Single O, Tobys Estate — famous roaster names, all inside a few blocks. It should be the strongest coffee suburb in Brisbane. It is not. Not quite. The best coffee in Newstead comes from Coffee Speed Dial, the cafe with the least famous name. Punchy start, smooth body, caramelised chocolate notes. Meanwhile names like Single O (5.8) and Tobys Estate (6.1) deliver cups that do not match the branding. The gap between the names on the door and the coffee in the cup is the whole story of Newstead. {count} cafes reviewed, average {avg}/10.",
  "west end":"West End trades on its reputation as a coffee suburb, and at the very top it earns it. The Twin (7.8) is one of Brisbane's best, full stop. Bold from the jump, smooth full body, faultless execution. But the drop off behind the leader is steeper than the reputation suggests. One elite cafe, then a cluster of decent to average. Blackstar Coffee Roasters, a West End institution since 2007, scored 5.8 — the legacy is older than the shot. West End is The Twin and then a gap. {count} cafes reviewed, average {avg}/10.",
  "fortitude valley":"The Valley has the most cafes of any Brisbane suburb after the CBD — {count} reviewed — and not one of them cracks 7.5. It is a suburb of solid options and a long tail of average ones. Breadth without a peak. Reverends Fine Coffee (7.2) leads with bold plum and dark cherry notes. Death Before Decaf (7.1) holds up at 3am and 3pm. Below them, a wide DECENT middle and a soft tail. The most reliable suburb to find coffee and one of the hardest to find great coffee. Average {avg}/10.",
  "paddington":"Paddington has the postcard streets, the renovated Queenslanders and the boutique foot traffic. What it mostly does not have is standout coffee. Blackout Paddington (7.5) is the only cafe we would send you across town for. Rich and full bodied, DIBS Coffee dialled in properly. The other five sit in a tight 6.2 to 6.7 band — fine if you are passing, not worth a detour. Pretty streets, average espresso. {count} cafes reviewed, average {avg}/10.",
  "nundah":"Nundah does not get written up like the Valley or West End, but on the numbers it out performs both at the top. Two cafes in the 7.5 tier — Clubhouse and Embargos On Chapel — no other outer suburb we cover has two. A solid supporting cast means you rarely go wrong. Nundah is the northside's quiet overachiever, underrated and worth the trip north. {count} cafes reviewed, average {avg}/10.",
  "woolloongabba":"Woolloongabba is one of the most consistent coffee suburbs in Brisbane. A {avg}/10 average across {count} cafes with no genuine duds. It does not have a headline 8, but it has the highest floor of any suburb on this list. Brown Dog Cafe (7.3) leads with robust full bodied espresso. Vacancy Coffee (7.1) is reliable and repeatable. You can walk into almost any cafe here and drink well. The Gabba is Brisbane's floor not ceiling suburb: no 7.5, but no landmines either.",
  "cbd":"Brisbane CBD is the most reviewed suburb in our database with {count} cafes scored. The range is wide, from quick pre meeting espresso bars to proper specialty destinations hidden down laneways. John Mills Himself (7.8) is the standout — a heritage hole in the wall with bold coffee and silky microfoam. Coffee Anthology (7.5) backs it up. Below them, big variation. Average score is {avg}/10. Use our rankings to skip the tourist traps.",
  "burleigh heads":"Burleigh Heads owns Gold Coast coffee. Multiple cafes scoring 7.5+ within walking distance of each other. Quest Coffee Roasters hit 8.1 — the best coffee we have had in Australia. Consistency is the theme: we visited twice, scored identically both times. That is not luck. If you are visiting the Gold Coast and want one guaranteed great coffee experience, go to Burleigh Heads. {count} cafes reviewed, average {avg}/10.",
  "south brisbane":"South Brisbane sits between the cultural precinct and the river, and its cafe scene matches that energy. CoffeeIsh (7.8) anchors the suburb — the flavour hits the upper palate and does not leave. Strong espresso bars, reliable quality, and a few genuine standouts in the mix. {count} cafes reviewed, average {avg}/10.",
  "chermside":"Chermside is Brisbane's northern retail hub and has more reviewed cafes than any other outer suburb in our database. The range is broader here, big mall chains sit alongside independent local roasters. {count} cafes reviewed, average {avg}/10. Our rankings help you find the actual good ones fast."
};

function getIntro(suburb,city,count,avg,top){
  var t=INTROS[suburb.toLowerCase().trim()];
  if(t)return t.replace(/{count}/g,count).replace(/{avg}/g,avg);
  var perf=avg>=7.5?"punches above its weight for coffee quality":avg>=7.0?"holds its own as a reliable coffee suburb":avg>=6.5?"delivers a mixed bag. Use our rankings to find the standouts":avg>=6.0?"has more misses than hits, but the top picks are worth knowing":"is hit and miss. Our rankings exist exactly for suburbs like this";
  return suburb+(city?" in "+city:"")+" "+perf+". We have reviewed "+count+" cafe"+(count!=1?"s":"")+" here with an average score of "+avg+"/10. Top pick is "+top.name+" at "+top.score.toFixed(1)+"/10.";
}

function renderGuide(suburb,city,cafes,allCafes,url){
  var sorted=cafes.slice().sort(function(a,b){return b.score-a.score;});
  var top=sorted[0];
  var avg=(cafes.reduce(function(s,c){return s+c.score;},0)/cafes.length).toFixed(1);
  var mustVisit=cafes.filter(function(c){return c.score>=7.5;}).length;
  var highest=top.score.toFixed(1);
  var citySlug=city.toLowerCase().replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-");
  var subSlug=suburb.toLowerCase().replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-");
  var topCol=gc(top.score);var topVerdict=gv(top.score);var topSlug=makeSlug(top.name,top.suburb);
  var year=new Date().getFullYear();
  var title=esc(suburb)+" Coffee Guide "+year+" | "+cafes.length+" Cafes Reviewed | Koffee Review";
  var desc="Honest reviews of "+cafes.length+" cafes in "+esc(suburb)+", "+esc(city)+". Top pick: "+esc(top.name)+" ("+highest+"/10). One latte, one double shot, every time.";
  var intro=getIntro(suburb,city,cafes.length,avg,top);

  // What to expect
  var avoid=cafes.filter(function(c){return c.score<5.5;}).length;
  var prices=cafes.map(function(c){return c.price;}).filter(Boolean);
  var modalPrice=prices.sort(function(a,b){return prices.filter(function(v){return v===b;}).length-prices.filter(function(v){return v===a;}).length;})[0]||"$$";
  var brisAvg=6.4;
  var expectBullets=[
    mustVisit+" of "+cafes.length+" cafes score 7.5+ (Must Visit tier)",
    "Average score: "+avg+"/10 "+(parseFloat(avg)>=brisAvg?"above":"below")+" the Brisbane average of "+brisAvg,
    "Typical price: "+modalPrice
  ];
  if(avoid>0)expectBullets.push(avoid+" cafe"+(avoid>1?"s":"")+" score below 5.5. Worth skipping");

  // Nearby suburbs
  var subMap={};allCafes.forEach(function(c){if(c.suburb&&c.suburb.toLowerCase()!==suburb.toLowerCase()&&c.city&&c.city.toLowerCase()===city.toLowerCase()){if(!subMap[c.suburb])subMap[c.suburb]={suburb:c.suburb,city:c.city,count:0};subMap[c.suburb].count++;}});
  var nearby=Object.values(subMap).sort(function(a,b){return b.count-a.count;}).slice(0,6);

  // FAQ schema
  var faqSchema={"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
    {"@type":"Question","name":"What is the best cafe in "+suburb+"?","acceptedAnswer":{"@type":"Answer","text":"Based on our reviews, "+top.name+" is the top rated cafe in "+suburb+" with a score of "+highest+"/10."+(top.notes?" "+top.notes.substring(0,120)+"...":"")}},
    {"@type":"Question","name":"How many cafes are reviewed in "+suburb+"?","acceptedAnswer":{"@type":"Answer","text":"Koffee Review has reviewed "+cafes.length+" cafe"+(cafes.length!==1?"s":"")+" in "+suburb+", "+city+". The average score is "+avg+"/10."+(mustVisit>0?" "+mustVisit+" cafe"+(mustVisit>1?"s":"")+" earn a Must Visit rating (7.5+).":"")}},
    {"@type":"Question","name":"Is "+suburb+" good for coffee?","acceptedAnswer":{"@type":"Answer","text":suburb+" has an average coffee score of "+avg+"/10 across "+cafes.length+" reviewed cafes. "+(parseFloat(avg)>=7.0?"With an average above 7.0, it is a strong suburb for quality coffee.":parseFloat(avg)>=6.5?"It has a mixed range. Use our rankings to pick the right one.":"Quality varies. Stick to our top ranked cafes to avoid disappointment.")}},
    {"@type":"Question","name":"How does Koffee Review score cafes?","acceptedAnswer":{"@type":"Answer","text":"We order the same thing at every cafe: one latte and one double shot espresso. No exceptions. We score on taste, consistency, and value out of 10. No sponsorships, no free meals, no paid placements."}}
  ]};

  // Cafe cards
  var cafeCards=sorted.map(function(c,i){
    var col=gc(c.score);var verdict=gv(c.score);var slug=makeSlug(c.name,c.suburb);
    var notes=c.notes?esc(c.notes.substring(0,90))+(c.notes.length>90?"...":""):"";
    return'<a href="/review/'+slug+'" class="cc'+(i===0?" cc-top":"")+'"><div class="cc-rank">'+(i+1)+'</div><div class="cc-ring" style="border-color:'+col+'"><span style="color:'+col+'">'+c.score.toFixed(1)+'</span></div><div class="cc-info"><div class="cc-nm">'+esc(c.name)+(i===0?' <span class="cc-badge">TOP PICK</span>':'')+'</div><div class="cc-loc">'+esc(c.suburb)+(c.price?' &middot; '+esc(c.price):'')+'</div>'+(notes?'<div class="cc-nt">'+notes+'</div>':'')+'</div><div class="cc-vd" style="background:'+col+'18;color:'+col+';border:1px solid '+col+'40">'+verdict+'</div></a>';
  }).join("");

  // Nearby suburb links
  var nearbyCards=nearby.map(function(s){
    return'<a href="/guide/'+guideSlug(s.suburb,s.city)+'" class="nb-pill">'+esc(s.suburb)+' <span class="nb-count">'+s.count+'</span></a>';
  }).join("");

  // Expect bullets HTML
  var expectHTML=expectBullets.map(function(b){return'<div class="ex-item"><div class="ex-dot"></div><span>'+b+'</span></div>';}).join("");

  // FAQ HTML
  var faqHTML=faqSchema.mainEntity.map(function(q){return'<div class="fq-item"><button class="fq-q" onclick="toggleFAQ(this)" aria-expanded="false"><span>'+q.name+'</span><span class="fq-icon">+</span></button><div class="fq-a" hidden>'+q.acceptedAnswer.text+'</div></div>';}).join("");

  return`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${desc}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${url}">
  <meta property="og:title" content="${title}"><meta property="og:description" content="${desc}">
  <meta property="og:image" content="https://koffeereview.com.au/logo.webp"><meta property="og:url" content="${url}">
  <meta property="og:type" content="article"><meta property="og:locale" content="en_AU">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="/logo.webp">
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"CollectionPage","name":"${title}","description":"${desc}","url":"${url}","dateModified":"${new Date().toISOString().split("T")[0]}","publisher":{"@type":"Organization","name":"Our Fair Dinkum Koffee Review","url":"https://koffeereview.com.au","logo":"https://koffeereview.com.au/logo.webp"},"about":{"@type":"Place","name":"${esc(suburb)}, ${esc(city)}","addressCountry":"AU"}}<\/script>
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Koffee Review","item":"https://koffeereview.com.au"},{"@type":"ListItem","position":2,"name":"Best Coffee in ${esc(city)}","item":"https://koffeereview.com.au/city/${citySlug}"},{"@type":"ListItem","position":3,"name":"${esc(suburb)} Coffee Guide","item":"${url}"}]}<\/script>
  <script type="application/ld+json">${JSON.stringify(faqSchema)}<\/script>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{background:#080808;color:rgba(255,255,255,0.88);font-family:'DM Sans',sans-serif;font-size:15px;line-height:1.6;-webkit-font-smoothing:antialiased}
    .pg{max-width:680px;margin:0 auto;padding:0 16px 80px}
    a{color:inherit}

    /* Nav */
    .nav{display:flex;align-items:center;justify-content:space-between;padding:16px 0 12px;border-bottom:1px solid rgba(255,255,255,0.08);margin-bottom:28px}
    .nav-logo{display:flex;align-items:center;gap:10px;text-decoration:none}.nav-logo img{width:36px;height:36px;border-radius:50%}.nav-logo span{font-family:'Bebas Neue',sans-serif;font-size:18px;letter-spacing:3px;color:#E6C073}
    .nav-links{display:flex;gap:16px}.nav-links a{font-size:11px;letter-spacing:2px;color:rgba(255,255,255,0.45);text-decoration:none}.nav-links a:hover{color:#E6C073}

    /* Breadcrumb */
    .bc{font-size:11px;color:rgba(255,255,255,0.22);display:flex;align-items:center;gap:6px;margin-bottom:24px;flex-wrap:wrap}.bc a{color:rgba(255,255,255,0.22);text-decoration:none}.bc a:hover{color:#E6C073}

    /* Hero */
    .hero{margin-bottom:32px}.hero-eye{display:flex;align-items:center;gap:8px;margin-bottom:10px}
    .hero-tag{font-size:9px;letter-spacing:3px;color:#E6C073;background:rgba(197,157,80,0.07);border:1px solid rgba(197,157,80,0.25);border-radius:6px;padding:3px 10px;font-weight:600}
    .hero-city{font-size:9px;letter-spacing:2px;color:rgba(255,255,255,0.22)}
    h1{font-family:'Bebas Neue',sans-serif;font-size:clamp(34px,8vw,52px);letter-spacing:1.5px;color:#fff;line-height:1.05;margin-bottom:8px}
    h1 span{color:#E6C073}
    .hero-sub{font-size:13px;color:rgba(255,255,255,0.45);font-weight:300;line-height:1.6;max-width:480px}

    /* Stat pills */
    .stats{display:flex;gap:8px;margin:20px 0 28px;flex-wrap:wrap}
    .sp{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:20px;padding:7px 16px;display:flex;flex-direction:column;align-items:center;gap:1px}
    .sp-n{font-family:'Bebas Neue',sans-serif;font-size:22px;line-height:1}.sp-l{font-size:9px;letter-spacing:2px;color:rgba(255,255,255,0.22)}

    /* Top pick */
    .tp{position:relative;overflow:hidden;background:#0e0e0e;border-radius:18px;border:1px solid rgba(197,157,80,0.25);padding:22px 20px 18px;margin-bottom:28px;text-decoration:none;display:block;transition:border-color 0.2s,transform 0.2s}
    .tp:hover{border-color:rgba(197,157,80,0.5);transform:translateY(-1px)}
    .tp::before{content:'';position:absolute;top:0;left:20px;right:20px;height:1px;background:linear-gradient(90deg,transparent,rgba(197,157,80,0.7),transparent)}
    .tp-label{font-size:9px;letter-spacing:3px;color:rgba(197,157,80,0.5);margin-bottom:12px}
    .tp-row{display:flex;align-items:center;gap:16px;position:relative;z-index:1}
    .tp-ring{width:64px;height:64px;border-radius:50%;border:2px solid;display:flex;flex-direction:column;align-items:center;justify-content:center;flex-shrink:0}
    .tp-score{font-family:'Bebas Neue',sans-serif;font-size:26px;line-height:1}.tp-denom{font-size:9px;color:rgba(255,255,255,0.22)}
    .tp-info{flex:1;min-width:0}.tp-nm{font-size:17px;font-weight:600;color:#fff;margin-bottom:3px;line-height:1.2}.tp-loc{font-size:12px;color:rgba(255,255,255,0.45);margin-bottom:8px}
    .tp-vd{display:inline-block;padding:3px 12px;border-radius:20px;font-size:10px;font-weight:700;letter-spacing:1.5px;margin-bottom:8px}
    .tp-nt{font-size:12px;color:rgba(255,255,255,0.45);font-style:italic;line-height:1.5;font-weight:300}
    .tp-arrow{font-size:18px;color:rgba(197,157,80,0.5);flex-shrink:0;transition:transform 0.2s}.tp:hover .tp-arrow{transform:translateX(3px)}

    /* Editorial */
    .ed{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:20px;margin-bottom:24px}
    .ed-text{font-size:14px;color:rgba(255,255,255,0.65);line-height:1.75;font-weight:300}

    /* Method strip */
    .ms{background:rgba(197,157,80,0.07);border:1px solid rgba(197,157,80,0.25);border-radius:14px;padding:16px 18px;margin-bottom:28px;display:flex;align-items:center;justify-content:space-between;text-decoration:none;transition:border-color 0.2s}
    .ms:hover{border-color:rgba(197,157,80,0.45)}
    .ms-title{font-size:11px;letter-spacing:2.5px;color:#E6C073;font-weight:600}.ms-sub{font-size:12px;color:rgba(255,255,255,0.45);font-weight:300;margin-top:3px}.ms-arrow{font-size:16px;color:rgba(197,157,80,0.5)}

    /* Expect card */
    .ex-card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:18px 20px;margin-bottom:28px}
    .ex-item{display:flex;align-items:center;gap:10px;font-size:13px;color:rgba(255,255,255,0.45);margin-bottom:8px}.ex-item:last-child{margin:0}
    .ex-dot{width:5px;height:5px;border-radius:50%;background:#E6C073;flex-shrink:0}

    /* Section labels */
    .sl{font-size:10px;letter-spacing:3px;color:rgba(197,157,80,0.5);font-weight:600;margin-bottom:6px}
    .st{font-family:'Bebas Neue',sans-serif;font-size:22px;letter-spacing:1px;color:#fff;line-height:1.1;margin-bottom:16px}

    /* Cafe cards */
    .cl{display:flex;flex-direction:column;gap:8px;margin-bottom:32px}
    .cc{display:flex;align-items:center;gap:12px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:14px 16px;text-decoration:none;color:inherit;transition:border-color 0.15s,background 0.15s}
    .cc:hover{border-color:rgba(255,255,255,0.15);background:rgba(255,255,255,0.04)}
    .cc-top{border-color:rgba(197,157,80,0.25);background:rgba(197,157,80,0.07)}.cc-top:hover{border-color:rgba(197,157,80,0.4)}
    .cc-rank{font-size:11px;color:rgba(255,255,255,0.22);width:18px;flex-shrink:0;text-align:center;font-weight:500}
    .cc-ring{width:44px;height:44px;border-radius:50%;border:2px solid;display:flex;align-items:center;justify-content:center;flex-shrink:0}
    .cc-ring span{font-family:'Bebas Neue',sans-serif;font-size:17px;line-height:1}
    .cc-info{flex:1;min-width:0}.cc-nm{font-size:14px;font-weight:500;color:rgba(255,255,255,0.88);margin-bottom:2px;display:flex;align-items:center;gap:8px}
    .cc-badge{font-size:8px;letter-spacing:1.5px;background:rgba(197,157,80,0.07);color:#E6C073;border:1px solid rgba(197,157,80,0.25);border-radius:4px;padding:2px 6px;font-weight:600}
    .cc-loc{font-size:11px;color:rgba(255,255,255,0.22);margin-bottom:4px}
    .cc-nt{font-size:11px;color:rgba(255,255,255,0.22);font-style:italic;font-weight:300;line-height:1.4;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:300px}
    .cc-vd{padding:3px 10px;border-radius:20px;font-size:9px;font-weight:700;letter-spacing:1.5px;flex-shrink:0;white-space:nowrap}

    /* Email capture */
    .em{background:#0e0e0e;border:1px solid rgba(197,157,80,0.25);border-radius:18px;padding:24px 20px 20px;margin-bottom:32px;position:relative;overflow:hidden}
    .em::before{content:'';position:absolute;top:0;left:20px;right:20px;height:1px;background:linear-gradient(90deg,transparent,rgba(197,157,80,0.7),transparent)}
    .em-eye{display:flex;align-items:center;gap:8px;margin-bottom:10px}
    .em-badge{font-size:9px;letter-spacing:2.5px;color:#E6C073;background:rgba(197,157,80,0.07);border:1px solid rgba(197,157,80,0.25);border-radius:6px;padding:3px 8px;font-weight:600}
    .em-freq{font-size:10px;color:rgba(255,255,255,0.22)}
    .em-h{font-family:'Bebas Neue',sans-serif;font-size:28px;letter-spacing:1.5px;color:#fff;line-height:1;margin-bottom:6px}.em-h span{color:#E6C073}
    .em-sub{font-size:12px;color:rgba(255,255,255,0.22);margin-bottom:18px;font-weight:300;line-height:1.6}
    .em-form{display:flex;border:1px solid rgba(197,157,80,0.25);border-radius:12px;overflow:hidden;background:rgba(0,0,0,0.35);transition:border-color 0.2s}
    .em-form:focus-within{border-color:rgba(197,157,80,0.6)}
    .em-input{flex:1;background:transparent;border:none;padding:12px 16px;font-size:13px;color:rgba(255,255,255,0.88);font-family:'DM Sans',sans-serif;outline:none}
    .em-input::placeholder{color:rgba(255,255,255,0.22)}
    .em-btn{background:linear-gradient(135deg,#E6C073,#c8a050);border:none;padding:12px 20px;font-size:12px;font-weight:700;color:#000;font-family:'DM Sans',sans-serif;cursor:pointer;letter-spacing:0.5px;white-space:nowrap}
    .em-ft{display:flex;align-items:center;gap:6px;margin-top:10px}
    .em-pulse{width:5px;height:5px;border-radius:50%;background:#4ade80;box-shadow:0 0 6px rgba(74,222,128,0.6);flex-shrink:0;animation:pulse 2s infinite}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
    .em-ft-text{font-size:10px;color:rgba(255,255,255,0.22)}
    .em-ok{display:none;flex-direction:column;align-items:center;gap:6px;padding:6px 0}
    .em-ok-icon{width:36px;height:36px;border-radius:50%;background:rgba(74,222,128,0.1);border:1px solid rgba(74,222,128,0.3);display:flex;align-items:center;justify-content:center;color:#4ade80;font-size:16px}
    .em-ok-text{font-size:13px;color:#4ade80;font-weight:500}.em-ok-sub{font-size:11px;color:rgba(255,255,255,0.22)}

    /* Nearby */
    .nb-wrap{margin-bottom:32px}.nb-grid{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
    .nb-pill{display:flex;align-items:center;gap:6px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:20px;padding:7px 14px;font-size:12px;color:rgba(255,255,255,0.45);text-decoration:none;transition:border-color 0.15s,color 0.15s}
    .nb-pill:hover{border-color:rgba(197,157,80,0.25);color:#E6C073}
    .nb-count{font-size:10px;color:rgba(255,255,255,0.22);background:rgba(255,255,255,0.05);border-radius:20px;padding:1px 6px}

    /* Explore links */
    .el-grid{display:flex;flex-direction:column;gap:8px;margin-top:12px}
    .el-link{display:flex;align-items:center;justify-content:space-between;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:13px 16px;font-size:13px;color:rgba(255,255,255,0.45);text-decoration:none;transition:border-color 0.15s,color 0.15s}
    .el-link:hover{border-color:rgba(197,157,80,0.25);color:#E6C073}

    /* FAQ */
    .fq-list{display:flex;flex-direction:column;gap:8px;margin-top:12px}
    .fq-item{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:14px;overflow:hidden}
    .fq-q{width:100%;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 16px;background:none;border:none;font-size:13px;font-weight:500;color:rgba(255,255,255,0.88);font-family:'DM Sans',sans-serif;cursor:pointer;text-align:left}
    .fq-q:hover{color:#E6C073}
    .fq-icon{font-size:18px;color:rgba(255,255,255,0.22);flex-shrink:0;transition:transform 0.2s}
    .fq-q[aria-expanded="true"] .fq-icon{transform:rotate(45deg);color:#E6C073}
    .fq-a{padding:0 16px 14px;font-size:13px;color:rgba(255,255,255,0.45);line-height:1.65;font-weight:300}.fq-a:not([hidden]){display:block}

    /* Footer */
    .ft{border-top:1px solid rgba(255,255,255,0.08);padding-top:28px;margin-top:40px}
    .ft-disc{font-size:12px;color:rgba(255,255,255,0.22);text-align:center;line-height:1.7;margin-bottom:16px}.ft-disc a{color:#E6C073;text-decoration:none}
    .ft-btn{display:flex;align-items:center;justify-content:center;gap:10px;background:linear-gradient(135deg,#E6C073,#c8a050);border-radius:14px;padding:14px 24px;margin-bottom:20px;text-decoration:none;color:#000;font-size:14px;font-weight:700;letter-spacing:0.5px;transition:opacity 0.15s}.ft-btn:hover{opacity:0.9}.ft-btn img{width:24px;height:24px;border-radius:50%}
    .ft-links{display:flex;flex-wrap:wrap;justify-content:center;gap:6px 16px;font-size:11px}.ft-links a{color:rgba(255,255,255,0.22);text-decoration:none}.ft-links a:hover{color:#E6C073}
    .ft-copy{text-align:center;font-size:11px;color:rgba(255,255,255,0.22);margin-top:20px}
    .cc-nt{max-width:200px}.tp-ring{width:54px;height:54px}.tp-score{font-size:22px}}
      .stats{display:flex!important;flex-wrap:wrap!important;gap:6px!important}.sp{flex:1 1 40%!important;min-width:0!important}.tp-ring{width:54px!important;height:54px!important}.tp-score{font-size:22px!important}.tp-row{gap:12px!important}.cl{gap:6px!important}.nb-grid{gap:6px!important}.el-grid{gap:6px!important}.fq-list{gap:6px!important}.em{padding:18px 16px!important}.em-h{font-size:24px!important}
  </style>
</head>
<body>
<div class="pg">
  <nav class="nav"><a href="/" class="nav-logo"><img src="/logo.webp" alt="Koffee Review"><span>KOFFEE REVIEW</span></a><div class="nav-links"><a href="/city/${citySlug}">${esc(city)}</a><a href="/explore">Explore</a><a href="/blog">Blog</a></div></nav>
  <nav class="bc" aria-label="Breadcrumb"><a href="/">Home</a><span>&middot;</span><a href="/city/${citySlug}">${esc(city)}</a><span>&middot;</span><span>${esc(suburb)} Coffee Guide</span></nav>

  <header class="hero">
    <div class="hero-eye"><span class="hero-tag">COFFEE GUIDE</span><span class="hero-city">${esc(city).toUpperCase()} &middot; ${year}</span></div>
    <h1>Best Coffee<br/>in <span>${esc(suburb)}</span></h1>
    <p class="hero-sub">${cafes.length} cafes reviewed. Same order every time. One latte, one double shot espresso. No sponsorships.</p>
    <div class="stats">
      <div class="sp"><span class="sp-n" style="color:#fff">${cafes.length}</span><span class="sp-l">REVIEWED</span></div>
      <div class="sp"><span class="sp-n" style="color:#4ade80">${mustVisit}</span><span class="sp-l">MUST VISIT</span></div>
      <div class="sp"><span class="sp-n" style="color:${gc(parseFloat(avg))}">${avg}</span><span class="sp-l">AVG SCORE</span></div>
      <div class="sp"><span class="sp-n" style="color:${topCol}">${highest}</span><span class="sp-l">HIGHEST</span></div>
    </div>
  </header>

  <a href="/review/${topSlug}" class="tp">
    <p class="tp-label">TOP PICK IN ${esc(suburb).toUpperCase()}</p>
    <div class="tp-row">
      <div class="tp-ring" style="border-color:${topCol}"><span class="tp-score" style="color:${topCol}">${top.score.toFixed(1)}</span><span class="tp-denom">/10</span></div>
      <div class="tp-info"><div class="tp-nm">${esc(top.name)}</div><div class="tp-loc">${esc(top.suburb)}${top.price?' &middot; '+esc(top.price):''}</div><span class="tp-vd" style="background:${topCol}18;color:${topCol};border:1px solid ${topCol}40">${topVerdict}</span>${top.notes?'<div class="tp-nt">"'+esc(top.notes.substring(0,140))+(top.notes.length>140?'...':'')+'"</div>':''}</div>
      <span class="tp-arrow">&#8594;</span>
    </div>
  </a>

  <div class="ed"><p class="ed-text">${intro.trim()}</p></div>
  <a href="/how-we-score" class="ms"><div><span class="ms-title">HOW WE SCORE</span><div class="ms-sub">One latte. One espresso. Every time. No exceptions.</div></div><span class="ms-arrow">&#8250;</span></a>

  <div class="ex-card"><div class="sl">WHAT TO EXPECT IN ${esc(suburb).toUpperCase()}</div>${expectHTML}</div>

  <div style="margin-bottom:16px"><p class="sl">ALL ${cafes.length} CAFES &middot; RANKED</p><h2 class="st">${esc(suburb)} Ranked by Score</h2></div>
  <div class="cl">${cafeCards}</div>

  <div class="em">
    <div class="em-eye"><span class="em-badge">WEEKLY DROP</span><span class="em-freq">Every Monday</span></div>
    <h3 class="em-h">Coffee <span>Intel.</span><br/>Delivered.</h3>
    <p class="em-sub">New reviews, hidden gems, and cafes to avoid. Before everyone else finds out.</p>
    <div class="em-form" id="emForm"><input class="em-input" type="email" placeholder="your@email.com" id="emInput"><button class="em-btn" onclick="handleEmail()">Get Intel &#8594;</button></div>
    <div class="em-ok" id="emOk"><div class="em-ok-icon">&#10003;</div><div class="em-ok-text">You are in the loop.</div><div class="em-ok-sub">First drop lands Monday.</div></div>
    <div class="em-ft"><div class="em-pulse"></div><span class="em-ft-text">No spam &middot; Unsubscribe any time</span></div>
  </div>

  ${nearbyCards?'<div class="nb-wrap"><div class="sl">MORE '+esc(city).toUpperCase()+' SUBURBS</div><div class="nb-grid">'+nearbyCards+'</div></div>':''}

  <div><div class="sl">EXPLORE MORE</div><div class="el-grid"><a href="/city/${citySlug}" class="el-link"><span>Best Coffee in ${esc(city)} &#8594;</span></a><a href="/leaderboard" class="el-link"><span>Full Leaderboard &#8594;</span></a><a href="/explore" class="el-link"><span>Explore All &#8594;</span></a><a href="/map" class="el-link"><span>Coffee Heat Map &#8594;</span></a><a href="/blog" class="el-link"><span>Blog and Guides &#8594;</span></a></div></div>

  <div style="margin-top:32px"><div class="sl">FREQUENTLY ASKED</div><div class="fq-list">${faqHTML}</div></div>

  <footer class="ft">
    <p class="ft-disc">All scores based on one latte and one double shot espresso, ordered the same way every time. No cafe pays for placement. <a href="/how-we-score">How we score &#8594;</a></p>
    <a href="/" class="ft-btn"><img src="/logo.webp" alt="KR">Browse All Reviews</a>
    <div class="ft-links"><a href="/leaderboard">Leaderboard</a><a href="/explore">Explore</a><a href="/compare">Compare</a><a href="/map">Heat Map</a><a href="/blog">Blog</a><a href="/how-we-score">How We Score</a><a href="/about">About</a></div>
    <p class="ft-copy">&copy; ${year} Our Fair Dinkum Koffee Review &middot; koffeereview.com.au</p>
  </footer>
</div>
<script>
  function toggleFAQ(btn){var a=btn.nextElementSibling;var ex=btn.getAttribute("aria-expanded")==="true";btn.setAttribute("aria-expanded",!ex);a.hidden=ex;}
  function handleEmail(){var i=document.getElementById("emInput");var f=document.getElementById("emForm");var ok=document.getElementById("emOk");if(i.value.indexOf("@")!==-1&&i.value.indexOf(".")!==-1){fetch("${EMAIL_ENDPOINT}",{method:"POST",body:JSON.stringify({email:i.value,source:"neighbourhood-guide",suburb:"${suburb}",ts:new Date().toISOString()})}).catch(function(){});f.style.display="none";ok.style.display="flex";}else{i.style.outline="2px solid rgba(248,113,113,0.5)";i.focus();setTimeout(function(){i.style.outline="none";},1200);}}
  document.addEventListener("keydown",function(e){var inp=document.getElementById("emInput");if(inp&&e.key==="Enter"&&document.activeElement===inp)handleEmail();});
<\/script>
</body>
</html>`;
}

export default async function handler(req,res){
  try{
    var suburbSlug=(req.query.suburb||"").replace(/-coffee$/,"");
    if(!suburbSlug)return res.status(400).send("Suburb required");

    var response=await fetch(SHEET_URL);var text=await response.text();var allCafes=parseCSV(text);
    var matched=null,matchedCity=null;

    allCafes.forEach(function(c){
      if(!c.suburb||!c.city)return;
      var slug=(c.suburb+"-"+c.city).toLowerCase().replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-");
      var slugNoCity=c.suburb.toLowerCase().replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-");
      if(slug===suburbSlug||slugNoCity===suburbSlug||suburbSlug.startsWith(slugNoCity)){matched=c.suburb;matchedCity=c.city;}
    });

    if(!matched){return res.status(404).send('<!DOCTYPE html><html><head><title>Not Found</title><meta name="robots" content="noindex"><link rel="icon" href="/logo.webp"></head><body style="background:#080808;color:#fff;font-family:sans-serif;padding:40px;text-align:center"><h1 style="color:#E6C073">No reviews found</h1><p style="color:rgba(255,255,255,0.5)">We have not reviewed any cafes in that suburb yet.</p><a href="/explore" style="color:#E6C073">Explore all reviews &#8594;</a></body></html>');}

    var cafes=allCafes.filter(function(c){return c.suburb&&c.suburb.toLowerCase()===matched.toLowerCase()&&c.city&&c.city.toLowerCase()===matchedCity.toLowerCase();});
    if(cafes.length===0)return res.status(404).send("No cafes found");

    var canonicalUrl="https://koffeereview.com.au/guide/"+guideSlug(matched,matchedCity);
    var html=renderGuide(matched,matchedCity,cafes,allCafes,canonicalUrl);

    res.setHeader("Content-Type","text/html; charset=utf-8");
    res.setHeader("Cache-Control","public, s-maxage=3600, stale-while-revalidate=86400");
    res.status(200).send(html);
  }catch(e){
    res.status(500).send("Error loading guide");
  }
}
