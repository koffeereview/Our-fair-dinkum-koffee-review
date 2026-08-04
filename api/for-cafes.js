const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYEU8Khk3R5I879v3FcXPqhq0aCXa2ZWM1BwwJOyUitx2Boak_AFTOkwvB8qQrKIeU55NM4htFjHbI/pub?gid=0&single=true&output=csv";
const SPAIN = ["barcelona","catalonia","spain"];
function splitCSV(line){var r=[],c="",q=false;for(var i=0;i<line.length;i++){var ch=line[i];if(ch==='"')q=!q;else if(ch===","&&!q){r.push(c.trim());c="";}else c+=ch;}r.push(c.trim());return r;}

export default async function handler(req,res){
  try{
    var response=await fetch(SHEET_URL);var text=await response.text();
    var lines=text.split("\n").filter(function(l){return l.trim();});
    var h=splitCSV(lines[0]).map(function(x){return x.trim().toLowerCase();});
    var sci=h.indexOf("score");
    var total=0;var mustVisit=0;
    for(var i=1;i<lines.length;i++){try{var p=splitCSV(lines[i]);var sc=parseFloat(p[sci])||0;if(sc<=0)continue;var city=(p[h.indexOf("city")]||"").trim();if(SPAIN.indexOf(city.toLowerCase())!==-1)continue;total++;if(sc>=7.5)mustVisit++;}catch(e){}}
    var year=new Date().getFullYear();

    var html='<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
    +'<title>For Cafe Owners '+year+' | Get Your Score | Koffee Review</title>'
    +'<meta name="description" content="See how your cafe ranks against '+total+'+ others. Get your verified Koffee Review badge. Understand our scoring. Improve your cup.">'
    +'<link rel="canonical" href="https://koffeereview.com.au/for-cafes"><link rel="icon" href="/logo.webp">'
    +'<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">'
    +'<style>*{margin:0;padding:0;box-sizing:border-box}body{background:#0a0a0c;color:#e2e8f0;font-family:DM Sans,sans-serif;-webkit-font-smoothing:antialiased}.c{max-width:680px;margin:0 auto;padding:0 20px 60px}.nav{display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid rgba(255,255,255,0.06)}.nav-logo{display:flex;align-items:center;gap:10px;text-decoration:none}.nav-logo img{width:34px;height:34px;border-radius:50%}.nav-logo span{font-family:Bebas Neue,sans-serif;font-size:15px;letter-spacing:3px;color:#E6C073}.sec{margin-bottom:32px}.sec h2{font-family:Bebas Neue,sans-serif;font-size:20px;letter-spacing:2px;color:#E6C073;margin-bottom:12px}.sec p{font-size:14px;color:rgba(255,255,255,0.55);line-height:1.8;margin-bottom:12px}.tier{display:flex;align-items:center;gap:12px;padding:12px 16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:12px;margin-bottom:6px}.tier-score{font-family:Bebas Neue,sans-serif;font-size:20px;min-width:60px}.tier-name{font-size:13px;font-weight:600;color:#fff}.tier-desc{font-size:11px;color:rgba(255,255,255,0.4)}.step{display:flex;gap:14px;margin-bottom:16px}.step-num{width:36px;height:36px;border-radius:50%;background:rgba(230,192,115,0.1);border:1px solid rgba(230,192,115,0.25);display:flex;align-items:center;justify-content:center;font-family:Bebas Neue,sans-serif;font-size:16px;color:#E6C073;flex-shrink:0}.step-txt{flex:1}.step-txt h3{font-size:14px;font-weight:600;color:#fff;margin-bottom:4px}.step-txt p{font-size:13px;color:rgba(255,255,255,0.5);line-height:1.6;margin:0}.ft{margin-top:32px;padding:20px 0;border-top:1px solid rgba(255,255,255,0.04);text-align:center;font-size:11px;color:rgba(255,255,255,0.3)}.ft a{color:rgba(255,255,255,0.5);text-decoration:none;margin:0 8px}</style>'
    +'</head><body><div class="c">'
    +'<nav class="nav"><a href="/" class="nav-logo"><img src="/logo.webp" alt="KR"><span>KOFFEE REVIEW</span></a></nav>'

    // HERO
    +'<div style="padding:32px 0 24px;text-align:center"><div style="font-size:10px;letter-spacing:3px;color:rgba(230,192,115,0.5);margin-bottom:8px">FOR CAFE OWNERS</div>'
    +'<h1 style="font-family:Bebas Neue,sans-serif;font-size:clamp(30px,7vw,48px);letter-spacing:2px;color:#fff;margin-bottom:12px">Your Cafe. Scored.</h1>'
    +'<p style="font-size:16px;color:rgba(255,255,255,0.5);line-height:1.7;max-width:500px;margin:0 auto">We have reviewed '+total+'+ cafes across Australia. '+mustVisit+' scored 7.5 or above and earned our Must Visit badge. Here is how it works and what it means for you.</p></div>'

    // STATS
    +'<div style="display:flex;gap:0;margin-bottom:28px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:14px;overflow:hidden">'
    +'<div style="flex:1;text-align:center;padding:14px 8px;border-right:1px solid rgba(255,255,255,0.03)"><div style="font-family:Bebas Neue,sans-serif;font-size:26px;color:#E6C073">'+total+'</div><div style="font-size:9px;letter-spacing:2px;color:rgba(255,255,255,0.3)">REVIEWED</div></div>'
    +'<div style="flex:1;text-align:center;padding:14px 8px;border-right:1px solid rgba(255,255,255,0.03)"><div style="font-family:Bebas Neue,sans-serif;font-size:26px;color:#4ade80">'+mustVisit+'</div><div style="font-size:9px;letter-spacing:2px;color:rgba(255,255,255,0.3)">MUST VISIT</div></div>'
    +'<div style="flex:1;text-align:center;padding:14px 8px"><div style="font-family:Bebas Neue,sans-serif;font-size:26px;color:#E6C073">7.5+</div><div style="font-size:9px;letter-spacing:2px;color:rgba(255,255,255,0.3)">STICKER THRESHOLD</div></div></div>'

    // HOW WE REVIEW
    +'<div class="sec"><h2>HOW WE REVIEW YOUR CAFE</h2>'
    +'<p>We visit unannounced. No bookings, no press invites, no free coffees. We order one latte and one double shot espresso. Same order, same size, every cafe.</p>'
    +'<p>We score on five elements: crema quality, extraction timing, bean freshness, milk texture, and balance. The score is the average of espresso and latte performance.</p>'
    +'<p>Your score is permanent until we revisit. We do not accept payment to change scores. We do not accept free product. We pay full price at every cafe.</p></div>'

    // SCORING TIERS
    +'<div class="sec"><h2>THE SCORING TIERS</h2>'
    +'<div class="tier"><div class="tier-score" style="color:#ffffff">9.1+</div><div><div class="tier-name">Elite</div><div class="tier-desc">Exceptional in every element. Rarest tier.</div></div></div>'
    +'<div class="tier"><div class="tier-score" style="color:#4ade80">8.1-9.0</div><div><div class="tier-name">Great</div><div class="tier-desc">Outstanding. Multiple standout elements.</div></div></div>'
    +'<div class="tier"><div class="tier-score" style="color:#2dd4bf">7.5-8.0</div><div><div class="tier-name">Must Visit</div><div class="tier-desc">Earns our sticker and badge. Top 4% of all cafes.</div></div></div>'
    +'<div class="tier"><div class="tier-score" style="color:#2dd4bf">7.1-7.4</div><div><div class="tier-name">Solid</div><div class="tier-desc">Reliable. Good coffee. Worth visiting if nearby.</div></div></div>'
    +'<div class="tier"><div class="tier-score" style="color:#facc15">6.5-7.0</div><div><div class="tier-name">Decent</div><div class="tier-desc">Fine. Nothing wrong, nothing memorable.</div></div></div>'
    +'<div class="tier"><div class="tier-score" style="color:#fb923c">5.5-6.4</div><div><div class="tier-name">Average to Take or Leave</div><div class="tier-desc">Forgettable. One or more elements weak.</div></div></div>'
    +'<div class="tier"><div class="tier-score" style="color:#f87171">Below 5.5</div><div><div class="tier-name">Not Recommended</div><div class="tier-desc">Significant quality issues.</div></div></div></div>'

    // GET YOUR BADGE
    +'<div class="sec"><h2>GET YOUR KOFFEE REVIEW BADGE</h2>'
    +'<p>Cafes scoring 7.5 or above earn a free verified badge. Display it on your website, in your window, or on your socials.</p>'
    +'<div style="text-align:center;padding:24px;background:rgba(230,192,115,0.03);border:1px solid rgba(230,192,115,0.15);border-radius:16px;margin:16px 0">'
    +'<div style="font-family:Bebas Neue,sans-serif;font-size:14px;color:rgba(230,192,115,0.6);letter-spacing:3px;margin-bottom:12px">EXAMPLE BADGE</div>'
    +'<div style="display:inline-block;padding:16px 28px;background:#0a0a0c;border:2px solid #E6C073;border-radius:16px"><span style="font-family:Bebas Neue,sans-serif;font-size:24px;color:#E6C073;letter-spacing:1px">KOFFEE REVIEW</span><br><span style="font-family:Bebas Neue,sans-serif;font-size:36px;color:#2dd4bf">7.8</span><span style="font-size:14px;color:rgba(255,255,255,0.3)">/10</span><br><span style="font-size:10px;letter-spacing:2px;color:rgba(255,255,255,0.4)">MUST VISIT</span></div>'
    +'<p style="font-size:12px;color:rgba(255,255,255,0.35);margin-top:14px">Your score. Your badge. Verified by data.</p></div></div>'

    // HOW TO IMPROVE
    +'<div class="sec"><h2>HOW TO IMPROVE YOUR SCORE</h2>'
    +'<p>Every cafe that broke into 7.5+ territory did these five things:</p>'
    +'<div class="step"><div class="step-num">1</div><div class="step-txt"><h3>Dial in every morning</h3><p>Pull test shots before opening. Taste them. Adjust the grind. This takes 2 minutes and is the difference between 6.5 and 7.5.</p></div></div>'
    +'<div class="step"><div class="step-num">2</div><div class="step-txt"><h3>Rotate beans</h3><p>Visible roast dates. Monthly rotation. Throw out stock older than 3 weeks. Stale beans cap your score at 6.5 maximum.</p></div></div>'
    +'<div class="step"><div class="step-num">3</div><div class="step-txt"><h3>Train milk technique</h3><p>Introduce air at 0 to 2 seconds. Dunk at 2 to 4 seconds. Finish at 65 degrees. Silky integrated microfoam, not bubbly foam on top.</p></div></div>'
    +'<div class="step"><div class="step-num">4</div><div class="step-txt"><h3>Service your machine</h3><p>Daily backflush. Weekly deep clean. Quarterly professional service. A dirty machine adds background bitterness to every shot.</p></div></div>'
    +'<div class="step"><div class="step-num">5</div><div class="step-txt"><h3>Taste your own product</h3><p>Drink your own coffee every day. If you do not know what your cup tastes like, you cannot fix it. This is the most common failure we see.</p></div></div></div>'

    // REQUEST A REVIEW
    +'<div class="sec"><h2>REQUEST A REVIEW</h2>'
    +'<p>We do not accept payment for reviews. We do not guarantee timing. But if your cafe is in Southeast Queensland and you want us to visit, let us know.</p>'
    +'<div style="text-align:center;margin-top:16px"><a href="https://docs.google.com/forms/d/e/1FAIpQLSfX1234567890/viewform" style="display:inline-block;padding:16px 36px;border-radius:14px;background:linear-gradient(135deg,#c8a96e,#E6C073);color:#0a0a0c;font-size:15px;font-weight:700;text-decoration:none;font-family:DM Sans,sans-serif">Suggest Your Cafe &rarr;</a></div>'
    +'<p style="font-size:11px;color:rgba(255,255,255,0.25);text-align:center;margin-top:10px">Suggestion does not guarantee a review. We visit on our own schedule.</p></div>'

    // LINKS
    +'<div style="margin-top:20px;display:flex;flex-direction:column;gap:8px">'
    +'<a href="/how-we-score" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;text-decoration:none;color:rgba(255,255,255,0.5);font-size:13px">Full Scoring Methodology &rarr;</a>'
    +'<a href="/blog/what-makes-a-75-cafe" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;text-decoration:none;color:rgba(255,255,255,0.5);font-size:13px">What Makes a 7.5+ Cafe &rarr;</a>'
    +'<a href="/blog/worst-coffee-mistakes" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;text-decoration:none;color:rgba(255,255,255,0.5);font-size:13px">5 Worst Coffee Mistakes &rarr;</a>'
    +'<a href="/blog/why-most-cafes-score-6" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;text-decoration:none;color:rgba(255,255,255,0.5);font-size:13px">Why Most Cafes Score 6.0-6.9 &rarr;</a>'
    +'<a href="/must-visit-cafes" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:rgba(230,192,115,0.03);border:1px solid rgba(230,192,115,0.12);border-radius:14px;text-decoration:none;color:#E6C073;font-size:13px">Must Visit Cafes (7.5+) &rarr;</a>'
    +'<a href="/explore" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:rgba(230,192,115,0.03);border:1px solid rgba(230,192,115,0.12);border-radius:14px;text-decoration:none;color:#E6C073;font-size:13px">Explore Koffee Review &rarr;</a></div>'
    +'<footer class="ft"><a href="/explore">Explore</a><a href="/leaderboard">Leaderboard</a><a href="/blog">Blog</a></footer></div></body></html>';

    res.setHeader("Content-Type","text/html; charset=utf-8");
    res.setHeader("Cache-Control","public, s-maxage=3600, stale-while-revalidate=86400");
    res.status(200).send(html);
  }catch(e){res.status(500).send("Error");}
}
