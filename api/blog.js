// KOFFEE REVIEW BLOG — Server-rendered, SEO-optimised
// /api/blog → blog index | /api/blog?slug=how-to-find-good-coffee → post

function esc(str) { return (str||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }

var POSTS = [
  {
    slug: "how-to-find-good-coffee",
    title: "How to Find Good Coffee (The Real Way)",
    description: "We have reviewed 261+ cafes with a locked scoring system. Here is how to read the data and never waste money on mediocre coffee again.",
    date: "2026-05-23", readingTime: "7 min",
    keywords: ["how to find good coffee","best coffee","coffee guide","cafe reviews","brisbane coffee"],
    sections: [
      { heading: "The Problem With Standard Reviews", body: "Google reviews tell you nothing about coffee quality. People leave five stars because the barista smiled. They leave one star because parking was hard. Coffee reviews on Instagram are sponsored or biased. Food bloggers pad their reviews with backstories instead of actual data.\n\nWhat you need is consistency. A system where a 7.5 in Brisbane means the same thing as a 7.5 in Melbourne. Where you can compare 261 cafes fairly. Where the score actually predicts whether you will enjoy the coffee.\n\nThat is what we built." },
      { heading: "The Locked Scoring System Explained", body: "We order the same thing every time. One latte. One double shot espresso. Every single cafe, every single time. No substitutions, no variations.\n\nWhy? Because consistency is everything.\n\nA latte tests milk technique. Can the barista steam milk properly? Does the microfoam integrate with the espresso or sit separate? A double shot espresso tests the coffee itself — extraction quality, bean freshness, grind consistency. Together, they tell you everything about a cafe's standards.", cta: { text: "Learn more about how we score", url: "/how-we-score" } },
      { heading: "What the Scores Actually Mean", body: "Not all 7.5s are equal, but they are comparable. Here is what to expect:\n\n8.0 and above (GREAT to ELITE) — Worth going out of your way for. This cafe knows what it is doing. Beans are fresh, technique is sharp, consistency is reliable.\n\n7.5 to 7.9 (MUST VISIT) — Genuinely good coffee. You will think about it after you leave. This is the threshold where a cafe stops being fine and becomes somewhere you actually want to return to.\n\n7.0 to 7.4 (SOLID) — Good. Reliable. Not extraordinary, but you will not be disappointed.\n\n6.5 to 6.9 (DECENT) — Acceptable. Has moments. Inconsistent or just missing something.\n\n6.0 to 6.4 (TAKE IT OR LEAVE IT) — It exists. Would not rush back.\n\nBelow 6.0 (NOT FOR US) — Skip it. Life is too short for bad coffee.", cta: { text: "See our full scoring guide", url: "/how-we-score" } },
      { heading: "How to Use Our Reviews", body: "Start with the leaderboard. Our top-rated cafes are proven winners. If you are new to an area, start here.\n\nFilter by suburb. Know which suburb you are in? Every suburb has a page showing all reviewed cafes, sorted by score.\n\nRead the tasting notes. Do not just look at the score. Punchy start, smooth body, balanced tells you what the coffee tastes like.\n\nLook for consistency clues. A cafe in our MUST VISIT tier has proven it can execute consistently.", links: [ { text: "Browse Australia's top 10 cafes", url: "/leaderboard" }, { text: "See all Fortitude Valley cafes", url: "/suburb/fortitude-valley-brisbane" } ] },
      { heading: "Best Coffee by City", body: "Brisbane has 161 reviewed cafes. The top tier (7.5+) shows Brisbane takes coffee seriously.\n\nGold Coast leans tourist, but has hidden gems. The quality spread is wider.\n\nMelbourne is the traditional coffee capital. Expect higher standards across the board.", links: [ { text: "Brisbane top-rated guide", url: "/best-coffee-brisbane" }, { text: "Gold Coast reviews", url: "/city/gold-coast" }, { text: "Melbourne cafes", url: "/city/melbourne" } ] },
      { heading: "The One Rule to Never Break", body: "Do not trust a single review. Trust a pattern.\n\nIf a cafe scores 7.5 in our system, go. If it scores 5.8, skip it. We have tested it the same way 261+ times. That consistency matters more than any individual opinion." },
      { heading: "Start Now", body: "Pick a suburb. Browse the cafes. Look for anything 7.5 or above. Go there. Order a latte and a double shot espresso. See if you agree with our score.\n\nNo sponsorships. No agendas. Just 261+ cafes scored the same way, every single time.", links: [ { text: "See all Brisbane cafes", url: "/city/brisbane" }, { text: "View the national leaderboard", url: "/leaderboard" } ] }
    ],
    faqs: [
      { q: "How does Koffee Review find good coffee?", a: "We order one latte and one double shot espresso at every cafe. Same order every time. We have reviewed 261+ cafes across Australia using this locked system." },
      { q: "What score means a cafe is worth visiting?", a: "Anything 7.5 or above is a must-visit. Cafes scoring 8.0+ are exceptional. Below 6.0 we recommend skipping." },
      { q: "Are Koffee Review scores sponsored?", a: "No. We accept no payment, no freebies, no sponsorships. Every score is earned through our blind ordering system." },
      { q: "How many cafes has Koffee Review reviewed?", a: "We have reviewed 261+ cafes across Brisbane, Gold Coast, Sunshine Coast, Melbourne, and other Australian cities." }
    ]
  }
];

function css() {
  return '*{margin:0;padding:0;box-sizing:border-box}body{font-family:Georgia,"Times New Roman",serif;background:#000;color:#fff;line-height:1.8;-webkit-font-smoothing:antialiased}.c{max-width:720px;margin:0 auto;padding:0 24px 60px}'
  +'.nav{display:flex;align-items:center;justify-content:space-between;padding:16px 0;border-bottom:1px solid rgba(255,255,255,0.06)}.nav-logo{display:flex;align-items:center;gap:10px;text-decoration:none}.nav-logo img{width:32px;height:32px;border-radius:50%}.nav-logo span{font-size:11px;letter-spacing:3px;color:#E6C073;font-weight:600}.nav-links{display:flex;gap:16px}.nav-links a{font-size:12px;color:rgba(255,255,255,0.5);text-decoration:none}.nav-links a:hover{color:#E6C073}'
  +'.bc{padding:12px 0;font-size:12px;color:rgba(255,255,255,0.4)}.bc a{color:#E6C073;text-decoration:none}'
  +'.bh{text-align:center;padding:40px 0 32px}.bh h1{font-size:36px;line-height:1.1;margin-bottom:12px}.bh p{color:rgba(255,255,255,0.5);font-size:16px}'
  +'.pc{display:block;padding:24px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:16px;text-decoration:none;color:inherit;transition:all 0.2s;margin-bottom:16px}.pc:hover{border-color:rgba(230,192,115,0.3);background:rgba(255,255,255,0.05)}.pd{font-size:12px;color:rgba(255,255,255,0.4);letter-spacing:1px;margin-bottom:8px}.pt{font-size:22px;color:#fff;margin-bottom:8px;line-height:1.3}.pp{font-size:14px;color:rgba(255,255,255,0.5);line-height:1.6;margin-bottom:12px}.pl{font-size:13px;color:#E6C073;font-weight:600;letter-spacing:1px}'
  +'.post{padding:40px 0}.post h1{font-size:36px;line-height:1.15;margin-bottom:16px}.pm{display:flex;align-items:center;gap:8px;flex-wrap:wrap;font-size:13px;color:rgba(255,255,255,0.4);margin-bottom:32px}.md{color:rgba(255,255,255,0.15)}'
  +'.toc{padding:20px 24px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:12px;margin-bottom:32px}.tl{font-size:10px;letter-spacing:3px;color:#E6C073;font-weight:700;margin-bottom:12px}.ta{display:block;font-size:14px;color:rgba(255,255,255,0.6);text-decoration:none;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.04)}.ta:hover{color:#E6C073}'
  +'.pi{font-size:18px;color:rgba(255,255,255,0.7);margin-bottom:40px;padding-bottom:24px;border-bottom:1px solid rgba(255,255,255,0.06)}'
  +'.ps{margin-bottom:40px}.ps h2{font-size:24px;margin-bottom:16px;color:#fff;padding-top:8px}.ps p{font-size:16px;color:rgba(255,255,255,0.7);margin-bottom:16px}'
  +'.sc a{color:#E6C073;text-decoration:none;font-weight:600;font-size:14px}.sc a:hover{text-decoration:underline}'
  +'.sl{display:flex;flex-direction:column;gap:8px;margin-top:16px}.sl a{display:block;padding:12px 16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:10px;color:#E6C073;text-decoration:none;font-size:14px;transition:all 0.2s}.sl a:hover{border-color:rgba(230,192,115,0.3)}'
  +'.fs{margin:40px 0;padding-top:32px;border-top:1px solid rgba(255,255,255,0.06)}.fl{font-size:12px;letter-spacing:4px;color:#E6C073;font-weight:700;margin-bottom:16px}'
  +'.fi{margin-bottom:8px;border:1px solid rgba(255,255,255,0.08);border-radius:10px;overflow:hidden}.fi[open]{border-color:rgba(230,192,115,0.25)}.fq{padding:14px 16px;font-size:14px;font-weight:600;color:#fff;cursor:pointer;list-style:none}.fq::-webkit-details-marker{display:none}.fq::after{content:"＋";color:#E6C073;font-size:16px;float:right}.fi[open] .fq::after{content:"－"}.fa{padding:0 16px 14px;font-size:13px;color:rgba(255,255,255,0.6);line-height:1.6}'
  +'.cb{padding:24px;background:rgba(230,192,115,0.04);border:1px solid rgba(230,192,115,0.2);border-radius:16px;margin:32px 0}.cl{font-size:10px;letter-spacing:3px;color:#E6C073;font-weight:700;margin-bottom:12px}.cg{display:grid;grid-template-columns:1fr 1fr;gap:8px}.ca{padding:12px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:10px;color:#E6C073;text-decoration:none;font-size:13px;text-align:center;transition:all 0.2s}.ca:hover{border-color:rgba(230,192,115,0.3)}'
  +'.ft{margin-top:48px;padding-top:24px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;font-size:11px;color:rgba(255,255,255,0.4)}.ft a{color:rgba(255,255,255,0.55);text-decoration:none;margin:0 8px}'
  +'@media(max-width:480px){.post h1,.bh h1{font-size:28px}.cg{grid-template-columns:1fr}}';
}

function nav(extra) {
  return '<nav class="nav"><a href="/" class="nav-logo"><img src="/logo.webp" alt="Koffee Review"><span>KOFFEE REVIEW</span></a><div class="nav-links">' + (extra||'<a href="/blog">Blog</a><a href="/leaderboard">Leaderboard</a>') + '</div></nav>';
}

function footer() {
  return '<footer class="ft"><p style="font-size:10px;color:rgba(255,255,255,0.3);margin-bottom:8px;letter-spacing:1px">Last updated May 2026</p><p>&copy; 2026 Our Fair Dinkum Koffee Review</p><div style="margin-top:10px"><a href="/about">About</a> &middot; <a href="/disclosure">Disclosure</a> &middot; <a href="/how-we-score">How We Score</a></div><div style="margin-top:14px"><div style="font-size:10px;letter-spacing:3px;color:rgba(255,255,255,0.55);font-weight:700;margin-bottom:8px">EXPLORE</div><a href="/best-latte-brisbane" style="font-size:11px;color:rgba(255,255,255,0.55);text-decoration:none">Best Latte</a> &middot; <a href="/hidden-gem-cafes-brisbane" style="font-size:11px;color:rgba(255,255,255,0.55);text-decoration:none">Hidden Gems</a> &middot; <a href="/worst-cafes-by-suburb" style="font-size:11px;color:rgba(255,255,255,0.55);text-decoration:none">Worst Cafes</a></div></footer>';
}

function renderIndex() {
  var cards = POSTS.map(function(p) {
    return '<a href="/blog/' + p.slug + '" class="pc"><div class="pd">' + p.date + ' &middot; ' + p.readingTime + '</div><h2 class="pt">' + esc(p.title) + '</h2><p class="pp">' + esc(p.description) + '</p><span class="pl">Read article &rarr;</span></a>';
  }).join("");

  var schema = JSON.stringify({"@context":"https://schema.org","@type":"Blog","name":"Koffee Review Blog","url":"https://koffeereview.com.au/blog","publisher":{"@type":"Organization","name":"Koffee Review","url":"https://koffeereview.com.au"},"blogPost":POSTS.map(function(p){return{"@type":"BlogPosting","headline":p.title,"url":"https://koffeereview.com.au/blog/"+p.slug,"datePublished":p.date}})});
  var bc = JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Koffee Review","item":"https://koffeereview.com.au"},{"@type":"ListItem","position":2,"name":"Blog","item":"https://koffeereview.com.au/blog"}]});

  return '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Blog &mdash; Koffee Review</title><meta name="description" content="Coffee guides, scoring methodology, and tasting tips from Australia\'s most honest cafe review system."><link rel="canonical" href="https://koffeereview.com.au/blog"><link rel="alternate" hreflang="en-AU" href="https://koffeereview.com.au/blog"><meta property="og:title" content="Blog &mdash; Koffee Review"><meta property="og:url" content="https://koffeereview.com.au/blog"><meta property="og:image" content="https://koffeereview.com.au/logo.webp"><link rel="icon" href="/logo.webp" type="image/webp"><script type="application/ld+json">' + schema + '</script><script type="application/ld+json">' + bc + '</script><style>' + css() + '</style></head><body><div class="c">' + nav('<a href="/city/brisbane">Brisbane</a><a href="/leaderboard">Leaderboard</a>') + '<div class="bc"><a href="/">Home</a> &middot; <span>Blog</span></div><header class="bh"><h1>The Koffee Review Blog</h1><p>Guides, methodology, and everything we have learned reviewing 261+ cafes across Australia.</p></header>' + cards + footer() + '</div></body></html>';
}

function renderPost(post) {
  var sid = function(h) { return h.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/-+/g,"-"); };
  var toc = post.sections.map(function(s) { return '<a href="#' + sid(s.heading) + '" class="ta">' + esc(s.heading) + '</a>'; }).join("");

  var body = post.sections.map(function(s) {
    var paras = s.body.split("\n\n").map(function(p) { return '<p>' + esc(p) + '</p>'; }).join("");
    var cta = s.cta ? '<p class="sc"><a href="' + s.cta.url + '">' + esc(s.cta.text) + ' &rarr;</a></p>' : '';
    var links = '';
    if (s.links && s.links.length > 0) {
      links = '<div class="sl">' + s.links.map(function(l) { return '<a href="' + l.url + '">' + esc(l.text) + ' &rarr;</a>'; }).join("") + '</div>';
    }
    return '<section id="' + sid(s.heading) + '" class="ps"><h2>' + esc(s.heading) + '</h2>' + paras + cta + links + '</section>';
  }).join("");

  var faqHtml = '';
  if (post.faqs && post.faqs.length > 0) {
    faqHtml = '<section class="fs"><h2 class="fl">FREQUENTLY ASKED</h2>' + post.faqs.map(function(f) {
      return '<details class="fi"><summary class="fq">' + esc(f.q) + '</summary><p class="fa">' + esc(f.a) + '</p></details>';
    }).join("") + '</section>';
  }

  var canonical = "https://koffeereview.com.au/blog/" + post.slug;
  var articleSchema = JSON.stringify({"@context":"https://schema.org","@type":"Article","headline":post.title,"description":post.description,"datePublished":post.date,"dateModified":new Date().toISOString().split("T")[0],"author":{"@type":"Organization","name":"Koffee Review","url":"https://koffeereview.com.au"},"publisher":{"@type":"Organization","name":"Koffee Review","logo":{"@type":"ImageObject","url":"https://koffeereview.com.au/logo.webp"}},"mainEntityOfPage":{"@type":"WebPage","@id":canonical},"image":"https://koffeereview.com.au/logo.webp","keywords":(post.keywords||[]).join(", ")});
  var bcSchema = JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Koffee Review","item":"https://koffeereview.com.au"},{"@type":"ListItem","position":2,"name":"Blog","item":"https://koffeereview.com.au/blog"},{"@type":"ListItem","position":3,"name":post.title,"item":canonical}]});
  var faqSchema = '';
  if (post.faqs && post.faqs.length > 0) {
    faqSchema = '<script type="application/ld+json">' + JSON.stringify({"@context":"https://schema.org","@type":"FAQPage","mainEntity":post.faqs.map(function(f){return{"@type":"Question","name":f.q,"acceptedAnswer":{"@type":"Answer","text":f.a}}})}) + '</script>';
  }

  var shortTitle = post.title.length > 30 ? post.title.substring(0,30) + '...' : post.title;

  return '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + esc(post.title) + ' | Koffee Review</title><meta name="description" content="' + esc(post.description) + '"><link rel="canonical" href="' + canonical + '"><link rel="alternate" hreflang="en-AU" href="' + canonical + '"><meta property="og:title" content="' + esc(post.title) + '"><meta property="og:description" content="' + esc(post.description) + '"><meta property="og:url" content="' + canonical + '"><meta property="og:type" content="article"><meta property="og:image" content="https://koffeereview.com.au/logo.webp"><meta property="article:published_time" content="' + post.date + '"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="/logo.webp" type="image/webp"><script type="application/ld+json">' + articleSchema + '</script><script type="application/ld+json">' + bcSchema + '</script>' + faqSchema + '<style>' + css() + '</style></head><body><div class="c">'
  + nav()
  + '<div class="bc"><a href="/">Home</a> &middot; <a href="/blog">Blog</a> &middot; <span>' + esc(shortTitle) + '</span></div>'
  + '<article class="post"><h1>' + esc(post.title) + '</h1><div class="pm"><span>By Koffee Review</span><span class="md">&middot;</span><span>' + post.date + '</span><span class="md">&middot;</span><span>' + post.readingTime + ' read</span></div>'
  + '<div class="toc"><div class="tl">IN THIS ARTICLE</div>' + toc + '</div>'
  + '<div class="pi"><p>' + esc(post.description) + '</p></div>'
  + body
  + '</article>'
  + faqHtml
  + '<div class="cb"><div class="cl">EXPLORE REVIEWS</div><div class="cg"><a href="/city/brisbane" class="ca">All Brisbane Cafes &rarr;</a><a href="/leaderboard" class="ca">Top 10 Australia &rarr;</a><a href="/best-latte-brisbane" class="ca">Best Latte Brisbane &rarr;</a><a href="/hidden-gem-cafes-brisbane" class="ca">Hidden Gems &rarr;</a></div></div>'
  + footer()
  + '</div></body></html>';
}

export default function handler(req, res) {
  var slug = req.query.slug || "";
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");

  if (!slug) return res.status(200).send(renderIndex());

  var post = POSTS.find(function(p) { return p.slug === slug; });
  if (!post) return res.status(404).send('<!DOCTYPE html><html><head><title>Not Found</title><meta name="robots" content="noindex"></head><body style="background:#000;color:#fff;font-family:sans-serif;text-align:center;padding:60px"><h1 style="color:#E6C073">Post not found</h1><a href="/blog" style="color:#E6C073">&larr; Back to Blog</a></body></html>');

  return res.status(200).send(renderPost(post));
}
