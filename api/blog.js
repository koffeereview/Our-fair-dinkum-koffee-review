// KOFFEE REVIEW BLOG — Server-rendered, SEO-optimised, world-class content
// /api/blog → blog index | /api/blog?slug=how-to-find-good-coffee → post

function esc(str) { return (str||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }

var POSTS = [
  {
    slug: "how-to-find-good-coffee",
    title: "How to Find Good Coffee (The Real Way)",
    description: "We have reviewed 600+ cafes across Australia with a locked scoring system. No sponsorships, no bias. Here is how to use our data to find genuinely great coffee every time.",
    date: "2026-05-23", readingTime: "8 min",
    keywords: ["how to find good coffee","best coffee brisbane","coffee guide australia","cafe reviews brisbane","best latte brisbane","coffee scoring system"],
    intro: "Most people find coffee the same way they find restaurants: Google Maps, star ratings, and hope. They see a 4.8-star cafe, walk in expecting something special, and get a mediocre flat white from someone who does not care about extraction.\n\nWe have been to 600+ cafes across Australia. Same order every time — one latte, one double shot espresso. No exceptions. And here is what we learned: most review systems are broken. So we built one that works.",
    sections: [
      {
        heading: "Why Google Reviews Are Useless for Coffee",
        body: "Google reviews tell you nothing about coffee quality. A five-star rating might mean the barista smiled, parking was easy, or the avocado toast was photogenic. A one-star review might mean the Wi-Fi was slow. None of this tells you whether the espresso is worth drinking.\n\nInstagram is worse. Most coffee content is sponsored or exchanged for free meals. The cafe that tags you in stories is not necessarily the cafe that pulls the best shot. Food bloggers pad their reviews with origin stories and latte art photos instead of actual tasting data.\n\nWhat you need is something different. A system where a 7.5 in Brisbane means the same thing as a 7.5 in Melbourne. Where you can compare 600 cafes fairly. Where the score actually predicts whether you will enjoy the coffee.\n\nThat is what Koffee Review is."
      },
      {
        heading: "How Our Scoring System Works",
        body: "We order the same thing at every single cafe. One latte. One double shot espresso. Every time, without exception. No substitutions, no variations, no specials.\n\nA latte tests milk technique — can the barista steam properly? Does the microfoam integrate with the espresso or sit on top like a hat? Is the texture silky or bubbly? The temperature right or scalding?\n\nA double shot espresso tests the coffee itself — extraction quality, bean freshness, grind consistency, crema colour and thickness. Is there sweetness in the shot or just bitterness? Does it have body or is it thin and watery?\n\nTogether, they tell you everything about a cafe's standards. If a cafe cannot make these two drinks well, nothing else on the menu matters.",
        cta: { text: "Read our full scoring methodology", url: "/how-we-score" }
      },
      {
        heading: "What Every Score Tier Means",
        body: "Our scoring runs from 0 to 10. Here is what each tier actually means for your experience:\n\n9.0 and above — ELITE. Exceptional in every way. These cafes are destination-worthy. You would drive across the city for this coffee and not regret it. The beans, the technique, the consistency — all flawless.\n\n8.0 to 8.9 — GREAT. Worth going out of your way for. This cafe knows exactly what it is doing. Fresh beans, sharp technique, reliable consistency. You can order anything here and it will be well-executed.\n\n7.5 to 7.9 — MUST VISIT. Genuinely good coffee. You will think about it after you leave. This is the threshold where a cafe stops being fine and becomes somewhere you actually want to return to. Our sticker-worthy tier.\n\n7.0 to 7.4 — SOLID. Reliable. Not extraordinary, but you will not be disappointed. The safe choice when you do not know the area.\n\n6.0 to 6.9 — DECENT. Acceptable on a good day. Inconsistent or just missing something. You might enjoy it, you might not. Better options are likely nearby.\n\nBelow 6.0 — NOT FOR US. Skip it. Life is too short for bad coffee. We will tell you exactly why it missed and suggest where to go instead.",
        cta: { text: "See our full scoring guide", url: "/how-we-score" }
      },
      {
        heading: "How to Actually Use Koffee Review",
        body: "Step one — start with the leaderboard. Our top-rated cafes are proven winners across 600+ blind tests. If you are visiting a new city or suburb, this is your starting point. These are not opinions — they are results from the same controlled test repeated hundreds of times.\n\nStep two — filter by suburb. Every suburb with 3 or more reviewed cafes has its own dedicated page showing all reviewed cafes ranked by score. Want the best coffee in Fortitude Valley, Newstead, West End, or Bulimba? We have already done the work.\n\nStep three — read the tasting notes. Do not just look at the number. Our notes describe exactly what happened in the cup. A punchy start with a smooth body and balanced finish means something completely different from a timid opening with a sour, flat finish. The notes tell you what to expect before you spend six dollars.\n\nStep four — trust the pattern, not the exception. A cafe scoring 7.8 across our system is more reliable than a cafe your friend said was amazing once. Consistency is the entire point.",
        links: [
          { text: "Browse Australia's top 10 cafes", url: "/leaderboard" },
          { text: "Fortitude Valley cafes ranked", url: "/suburb/fortitude-valley-brisbane" },
          { text: "Newstead cafes ranked", url: "/suburb/newstead-brisbane" },
          { text: "Find cafes near you", url: "/" }
        ]
      },
      {
        heading: "Best Coffee by City — Where Australia Stands",
        body: "Brisbane is our home base with the most comprehensive coverage. Over 160 cafes reviewed and growing every week. Brisbane takes coffee seriously and the data proves it — the city has a strong cluster of 7.5+ cafes, particularly in the inner suburbs. If you are in Brisbane, you are spoiled for choice.\n\nGold Coast is a different story. The tourist strip is hit-and-miss, but the back streets hide genuine quality. The score spread is wider here — some cafes are exceptional, others are coasting on location. Our suburb pages help you skip the tourist traps.\n\nMelbourne is the traditional coffee capital of Australia. Higher standards across the board, more competition, and a cafe culture that has been refining itself for decades. Our Melbourne coverage is growing.\n\nSunshine Coast, Moreton Bay, Ipswich, and Logan round out our Queensland coverage. Every cafe gets the same test, the same order, the same scoring system.",
        links: [
          { text: "Best coffee Brisbane 2026", url: "/best-coffee-brisbane" },
          { text: "Best latte Brisbane", url: "/best-latte-brisbane" },
          { text: "Gold Coast reviews", url: "/city/gold-coast" },
          { text: "Melbourne cafes", url: "/city/melbourne" },
          { text: "Hidden gem cafes", url: "/hidden-gem-cafes-brisbane" }
        ]
      },
      {
        heading: "The Cafes to Avoid (and Why We Tell You)",
        body: "Most review sites only show you the good stuff. We show you everything — including the cafes that scored below 5.0 in our system.\n\nWhy? Because knowing where NOT to go is just as valuable as knowing where to go. If you are in a suburb with four cafes, three scoring 7+ and one scoring 4.8, you want to know which one to skip. We will tell you, with specific reasons.\n\nOur Cafes to Avoid page is one of the most visited on the site. It saves people time, money, and bad coffee experiences. No other review site in Australia has the integrity to publish this data.",
        links: [
          { text: "Brisbane cafes to avoid", url: "/brisbane-cafes-to-avoid" },
          { text: "Worst cafes by suburb", url: "/worst-cafes-by-suburb" }
        ]
      },
      {
        heading: "What Makes Us Different",
        body: "No sponsorships. No free coffees. No paid placements. Every single review is paid for out of pocket. Every score is earned, not bought.\n\nWe do not care about decor, parking, vibes, or Instagram aesthetics. We care about what is in the cup. A hole-in-the-wall with plastic chairs that pulls a perfect shot will outscore a designer cafe with bad extraction every time.\n\nOur system is locked. We cannot change the methodology mid-review to make a cafe look better. One latte, one double shot, scored on the same criteria, every single time across 600+ cafes. That is how you build a dataset you can trust."
      },
      {
        heading: "Start Finding Better Coffee Today",
        body: "Pick a suburb. Browse the cafes. Look for anything 7.5 or above. Go there. Order a latte and a double shot espresso. See if you agree with our score.\n\nIf you do — welcome. You have found a cafe worth returning to. If you do not — that is fine. Coffee is subjective. But our system works because it is consistent, repeatable, and brutally honest.\n\n600+ cafes. Same order. Same scoring. Every single time.\n\nOne latte. One double shot. No exceptions.",
        links: [
          { text: "Browse all cafes", url: "/" },
          { text: "National leaderboard", url: "/leaderboard" },
          { text: "How we score", url: "/how-we-score" }
        ]
      }
    ],
    faqs: [
      { q: "How does Koffee Review find good coffee?", a: "We order one latte and one double shot espresso at every cafe. Same order, same size, every time. We have reviewed 600+ cafes across Australia using this locked system. No sponsorships, no free coffees." },
      { q: "What score means a cafe is worth visiting?", a: "Anything 7.5 or above is a must-visit in our system. Cafes scoring 8.0+ are exceptional. Below 6.0 we recommend skipping entirely." },
      { q: "Are Koffee Review scores sponsored or paid for?", a: "No. We accept no payment, no freebies, no sponsorships, and no paid placements. Every coffee is paid for out of pocket. Every score is earned through our blind ordering system." },
      { q: "How many cafes has Koffee Review reviewed?", a: "Over 600 cafes across Brisbane, Gold Coast, Sunshine Coast, Moreton Bay, Melbourne, and other Australian cities. We add new reviews every week." },
      { q: "What cities does Koffee Review cover?", a: "We primarily cover Brisbane (160+ cafes), Gold Coast, Sunshine Coast, Moreton Bay, Ipswich, Logan, and Melbourne. Our coverage expands every week." },
      { q: "Can I suggest a cafe for review?", a: "Yes. Visit koffeereview.com.au and use the Suggest a Cafe button to nominate any Australian cafe for review." }
    ]
  },
  {
    slug: "coffee-terminology-explained",
    title: "Coffee Terminology Explained: The Complete Guide",
    description: "We have reviewed 600+ cafes across Australia and use these terms in every review. From extraction to microfoam, this guide decodes every coffee word so you know exactly what baristas are talking about.",
    date: "2026-05-30", readingTime: "9 min",
    keywords: ["coffee terminology","what is espresso","microfoam","coffee extraction","coffee glossary","barista terms","coffee guide australia","espresso terms explained"],
    intro: "Walk into a cafe and order a coffee. The barista asks: single or double shot? Microfoam or wet? Single origin or blend?\n\nIf you do not know what these words mean, you are lost.\n\nWe have reviewed over 600 cafes across Australia. Every review uses coffee terminology to describe exactly what we tasted. This guide breaks down every word so you understand what baristas are actually talking about and more importantly, what it means for your coffee.",
    sections: [
      {
        heading: "Why Terminology Matters",
        body: "Coffee language is not gatekeeping. It is precision.\n\n\"Good espresso\" could mean anything. \"Balanced extraction with a clean finish and no bitter bite\" tells you exactly what you are getting. The terminology exists because coffee quality has specific, measurable components. Learning the words means you can predict whether you will like a cafe before you buy a drink.\n\nWhen we write our reviews, we use these terms to be precise about what happened in the cup. A punchy start is not the same as a smooth opening. A clean finish is not the same as a short finish. Once you learn the difference, you will start tasting it yourself."
      },
      {
        heading: "Extraction and Shot Terms",
        body: "A shot is a single pull of espresso. Standard size: 30ml of liquid pulled from 18 to 20 grams of ground coffee in about 27 to 30 seconds.\n\nSingle shot means one pull. Standard in some regions. Double shot means two pulls, or the standard in Australia. When we order a latte, it comes with a double shot espresso.\n\nExtraction is how much flavour the water pulls from the coffee grounds. Think of it like brewing tea. Steep for 10 seconds and you get weak tea. Steep for 5 minutes and it is bitter. Same with espresso.\n\nProper extraction takes 25 to 30 seconds and produces smooth, balanced sweetness. Under extraction at 15 to 20 seconds tastes sour or thin. Over extraction at 35 plus seconds tastes bitter or burnt.\n\nWhen we review a cafe and say \"smooth extraction\" it means the espresso hit that sweet spot perfectly. You can see this in action in our review of <a href=\"/review/ona-coffee-east-brisbane\" style=\"color:#E6C073\">Ona Coffee in East Brisbane</a>.\n\nA pull is the act of running water through ground coffee. \"Shots are pulling thin today\" means the espresso is coming out too fast, which means under extraction.",
        cta: { text: "See how we score every cafe", url: "/how-we-score" }
      },
      {
        heading: "Flavour Descriptors: The Opening",
        body: "These words describe what the coffee tastes like. We use them in every review because they predict whether you will enjoy it.\n\nPunchy start means bold, immediate flavour. Coffee hits your palate right away. Good sign.\n\nTimid opening means weak initial flavour. Often means under extraction or stale beans.\n\nSmooth opening means no harshness. Balanced right from the first sip. Excellent technique. This is what separates a 7.5 from a 6.5 in our system."
      },
      {
        heading: "Flavour Descriptors: The Body",
        body: "Body is the weight and texture of the coffee in your mouth. Like the difference between skim milk and whole milk.\n\nLight body is thin, clean, tea like. Can be intentional in pour over style or a sign of under extraction.\n\nSmooth body is medium weight, pleasant to drink. This is the target for most espresso based drinks and what we look for in a latte.\n\nFull body is heavy, rich, creamy. Often from dark roasts or excellent milk integration. Many of our <a href=\"/leaderboard\" style=\"color:#E6C073\">top rated cafes on the leaderboard</a> achieve full body without sacrificing balance."
      },
      {
        heading: "Flavour Descriptors: The Profile",
        body: "Bright means acidic in a good way. Fruity, citrus notes. Light roasts or African beans are typically bright.\n\nFruity means it literally tastes like fruit. Berries, citrus, stone fruit. Not artificial flavour. This comes from quality beans and proper roasting.\n\nNutty means chocolate, hazelnut, almond notes. Often from South American or Indonesian beans.\n\nEarthy means soil, wood, tobacco depth. Deeper coffees often from darker roasts or Indonesian regions.\n\nChocolatey or cocoa notes are sweet and rich. Sign of good balance and proper roasting.\n\nBalanced means all the flavours work together. No single note dominates. This is the gold standard. When we give a cafe 8.0 or above, balance is almost always present.\n\nAcidic in a bad way means sour, sharp, uncomfortable. Under extraction or stale beans. We always note this when it is a problem."
      },
      {
        heading: "Flavour Descriptors: The Finish",
        body: "The finish is the aftertaste. What does the flavour do after you swallow?\n\nClean finish means flavour fades cleanly. No bitterness lingering. Excellent.\n\nLingering sweetness means pleasant aftertaste. Coffee continues to taste good after you have swallowed. Great sign of quality.\n\nBitter finish means bitterness sticks around. Often over extraction. Not pleasant.\n\nSour finish means sourness stays on your palate. Usually under extraction or poor bean quality.\n\nShort finish means flavour disappears quickly. Can mean the coffee is not complex enough or beans were not fresh.\n\nWhen we say <a href=\"/review/bang-coffee-bar-brisbane\" style=\"color:#E6C073\">a cafe like Bang Coffee Bar has a clean, sweet finish</a>, we mean your mouth feels pleasant even 30 seconds after swallowing."
      },
      {
        heading: "Milk and Texture Terms",
        body: "Milk technique separates good baristas from great ones. These terms describe how well the milk is steamed and integrated with espresso.\n\nMicrofoam is tiny, uniform bubbles in steamed milk. Not big foam bubbles like hot chocolate. These are microscopic, created by injecting steam into cold milk.\n\nProper microfoam is velvety, pourable, and integrates perfectly with espresso. The milk and espresso blend seamlessly. This is what you want in a latte and what we test for at every single cafe.\n\nWet microfoam is more liquid, less foam. Easier to pour, better for latte art.\n\nDry microfoam is more foam, less liquid. You get a thicker layer on top. Better for cappuccinos.\n\nSteamed milk is milk heated and aerated using the steam wand. Properly steamed milk hits 65 to 70 degrees, creates microfoam naturally, and integrates well with espresso. Over steamed milk goes above 70 degrees and tastes burnt.\n\nIntegration is how well the milk and espresso blend together. In a great latte, you do not taste them separately. They are one unified drink. <a href=\"/how-we-score\" style=\"color:#E6C073\">This is exactly what we are looking for when we score a latte.</a>\n\nCrema is the thin layer of caramel coloured foam on top of properly pulled espresso. Good crema is thick, golden, and slightly caramel coloured. No crema means stale beans or improper extraction.",
        cta: { text: "See our full scoring methodology", url: "/how-we-score" }
      },
      {
        heading: "Coffee Bean Terms",
        body: "Single origin coffee comes from one specific region, farm, or country. Not blended with beans from anywhere else.\n\nEthiopian single origin is usually bright, fruity, floral. Colombian single origin is usually balanced, nutty, chocolate. Indonesian single origin is usually earthy, full bodied, smoky.\n\nSingle origin coffees let you taste the terroir, the unique flavours that come from that specific place. More expensive, but typically higher quality. <a href=\"/leaderboard\" style=\"color:#E6C073\">Many of our top rated cafes on the leaderboard</a> highlight single origins.\n\nA blend is coffee from multiple origins mixed together. A roaster blends beans to create a consistent flavour profile year round. House blend is the cafe's signature mix. Espresso blend is specifically designed to work well as espresso.\n\nFreshness matters enormously for coffee. Beans are best 2 to 4 weeks after roasting. After that, flavour degrades. Fresh beans produce bright flavour, good crema, vibrant taste. Stale beans produce flat flavour, no crema, and bitter or dull taste.\n\nWhen we note that <a href=\"/review/the-source-specialty-coffee-brisbane\" style=\"color:#E6C073\">a cafe like The Source has fresh bean flavour</a>, it means the beans are at their peak."
      },
      {
        heading: "Roast Levels Explained",
        body: "Light roast beans are roasted for a shorter time. More of the original bean flavour comes through. Characteristics include bright acidity, fruity notes, and pronounced origin flavours. Best for single origin, pour over, and espresso at cafes with excellent technique.\n\nMedium roast is the sweet spot for most cafes. Balanced between origin flavours and roast character. Balanced acidity, balanced body, with chocolate and nut notes plus some acidity. Most house blends are medium roast.\n\nDark roast beans are roasted longer. The roasting process flavours dominate over origin flavours. Low acidity, full body, smoky and sometimes burnt flavours. Best for milk based drinks where you want bold coffee to cut through milk."
      },
      {
        heading: "How We Use These Terms in Real Reviews",
        body: "Here is an example from a real review. We wrote: \"Punchy start, smooth body, balanced, clean finish. Bright acidity without harshness. Single origin Ethiopian beans really sing. Microfoam integrated beautifully with the espresso.\"\n\nTranslation: The espresso had excellent technique (punchy opening, clean finish, balanced). The Ethiopian beans' natural fruity flavours came through (bright acidity). The barista steamed the milk perfectly (integrated microfoam, smooth body). This is a 7.5 plus cafe.\n\nNow you can read that and know exactly what to expect before you walk in.",
        links: [
          { text: "Browse all Brisbane cafes", url: "/city/brisbane" },
          { text: "See Australia's top 10 cafes", url: "/leaderboard" },
          { text: "Read how we score", url: "/how-we-score" },
          { text: "Explore the coffee heat map", url: "/map" }
        ]
      },
      {
        heading: "Common Mistakes in Coffee Language",
        body: "Bitter does not mean bad. Bitterness is a flavour note found in dark chocolate and espresso. \"Unpleasantly bitter\" is a problem because it means burnt or over extracted.\n\nAcidic is not always negative. Good acidic coffee is bright and fruity. Bad acidic coffee is sour and sharp. Context matters.\n\nHeavy coffee is not better. Light, bright coffee from quality Ethiopian beans is often more complex than heavy, dark roast. Preference is personal.\n\nConsistency matters more than any single term. A cafe that is consistently balanced at 7.6 is better than one that is sometimes bright but sometimes sour."
      },
      {
        heading: "Start Understanding Coffee",
        body: "Pick any cafe from our Brisbane reviews or the leaderboard. Read the tasting notes. Now you know what the barista was working with, what the beans brought, and how well the technique executed.\n\nNext time you order, ask the barista about the origin. Ask if it is a blend or single origin. Notice the microfoam. Taste the opening, the body, the finish.\n\nYou will start tasting what we are tasting. And you will stop accepting mediocre coffee.\n\nThat is the point of learning the terminology. Not to sound smart. But to know what you are drinking, why it matters, and whether it is worth coming back.\n\n600 plus cafes. Same order. Same scoring. Every single time.\n\nOne latte. One double shot. No exceptions.",
        links: [
          { text: "Browse all cafes", url: "/" },
          { text: "National leaderboard", url: "/leaderboard" },
          { text: "Best coffee Brisbane 2026", url: "/best-coffee-brisbane" },
          { text: "Hidden gem cafes", url: "/hidden-gem-cafes-brisbane" }
        ]
      }
    ],
    faqs: [
      { q: "What is coffee extraction?", a: "Extraction is how much flavour the water pulls from coffee grounds. Proper extraction takes 25 to 30 seconds and produces balanced, smooth espresso. Under extraction tastes sour. Over extraction tastes bitter." },
      { q: "What is microfoam?", a: "Microfoam is tiny, uniform bubbles in steamed milk created by the steam wand. Proper microfoam is velvety and pourable, integrating seamlessly with espresso. It is what makes a great latte." },
      { q: "What does single origin coffee mean?", a: "Single origin means the coffee comes from one specific region, farm, or country. It lets you taste the unique flavours of that place. Ethiopian is typically fruity, Colombian is nutty, Indonesian is earthy." },
      { q: "What is a clean finish in coffee?", a: "A clean finish means the flavour fades away smoothly after swallowing with no lingering bitterness. It is a sign of proper extraction and fresh beans. Most cafes scoring 7.5 plus in our system have clean finishes." },
      { q: "How does Koffee Review use these terms?", a: "Every one of our 600 plus cafe reviews uses these terms to describe exactly what we tasted. We order one latte and one double shot espresso at every cafe, then describe the opening, body, flavour profile, and finish using precise terminology." },
      { q: "What is the difference between light and dark roast?", a: "Light roast preserves more of the original bean flavour with bright, fruity notes. Dark roast has smoky, bold flavours from the roasting process itself. Medium roast is the balance point and most common in Australian cafes." }
    ]
  }
];

function css() {
  return '*{margin:0;padding:0;box-sizing:border-box}'
  +'body{font-family:Georgia,"Times New Roman",serif;background:#000;color:#E8E8E8;line-height:1.85;-webkit-font-smoothing:antialiased}'
  +'.c{max-width:720px;margin:0 auto;padding:0 24px 60px}'
  +'.nav{display:flex;align-items:center;justify-content:space-between;padding:16px 0;border-bottom:1px solid rgba(255,255,255,0.06)}'
  +'.nav-logo{display:flex;align-items:center;gap:10px;text-decoration:none}'
  +'.nav-logo img{width:32px;height:32px;border-radius:50%}'
  +'.nav-logo span{font-size:11px;letter-spacing:3px;color:#E6C073;font-weight:600}'
  +'.nav-links{display:flex;gap:16px}'
  +'.nav-links a{font-size:12px;color:rgba(255,255,255,0.55);text-decoration:none}'
  +'.nav-links a:hover{color:#E6C073}'
  +'.bc{padding:12px 0;font-size:12px;color:rgba(255,255,255,0.5)}'
  +'.bc a{color:#E6C073;text-decoration:none}'
  +'.bh{text-align:center;padding:40px 0 32px}'
  +'.bh h1{font-size:36px;line-height:1.1;margin-bottom:12px;color:#fff}'
  +'.bh p{color:rgba(255,255,255,0.6);font-size:16px}'
  +'.pc{display:block;padding:24px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:16px;text-decoration:none;color:inherit;transition:all 0.2s;margin-bottom:16px}'
  +'.pc:hover{border-color:rgba(230,192,115,0.3);background:rgba(255,255,255,0.05)}'
  +'.pd{font-size:12px;color:rgba(255,255,255,0.5);letter-spacing:1px;margin-bottom:8px}'
  +'.pt{font-size:22px;color:#fff;margin-bottom:8px;line-height:1.3}'
  +'.pp{font-size:14px;color:rgba(255,255,255,0.6);line-height:1.6;margin-bottom:12px}'
  +'.pl{font-size:13px;color:#E6C073;font-weight:600;letter-spacing:1px}'
  +'.post{padding:40px 0}'
  +'.post h1{font-size:36px;line-height:1.15;margin-bottom:16px;color:#fff}'
  +'.pm{display:flex;align-items:center;gap:8px;flex-wrap:wrap;font-size:13px;color:rgba(255,255,255,0.5);margin-bottom:32px}'
  +'.md{color:rgba(255,255,255,0.2)}'
  +'.toc{padding:20px 24px;background:rgba(230,192,115,0.04);border:1px solid rgba(230,192,115,0.15);border-radius:12px;margin-bottom:32px}'
  +'.tl{font-size:10px;letter-spacing:3px;color:#E6C073;font-weight:700;margin-bottom:12px}'
  +'.ta{display:block;font-size:14px;color:rgba(255,255,255,0.7);text-decoration:none;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.04)}'
  +'.ta:hover{color:#E6C073}'
  +'.pi{font-size:18px;color:rgba(255,255,255,0.8);margin-bottom:40px;padding-bottom:24px;border-bottom:1px solid rgba(255,255,255,0.06)}'
  +'.ps{margin-bottom:48px}'
  +'.ps h2{font-size:24px;margin-bottom:16px;color:#fff;padding-top:8px}'
  +'.ps p{font-size:16px;color:rgba(255,255,255,0.75);margin-bottom:16px}'
  +'.sc a{color:#E6C073;text-decoration:none;font-weight:600;font-size:14px}.sc a:hover{text-decoration:underline}'
  +'.sl{display:flex;flex-direction:column;gap:8px;margin-top:16px}'
  +'.sl a{display:block;padding:12px 16px;background:rgba(230,192,115,0.04);border:1px solid rgba(230,192,115,0.15);border-radius:10px;color:#E6C073;text-decoration:none;font-size:14px;transition:all 0.2s}'
  +'.sl a:hover{border-color:rgba(230,192,115,0.4);background:rgba(230,192,115,0.08)}'
  +'.fs{margin:40px 0;padding-top:32px;border-top:1px solid rgba(255,255,255,0.06)}'
  +'.fl{font-size:12px;letter-spacing:4px;color:#E6C073;font-weight:700;margin-bottom:16px}'
  +'.fi{margin-bottom:8px;border:1px solid rgba(255,255,255,0.1);border-radius:10px;overflow:hidden}'
  +'.fi[open]{border-color:rgba(230,192,115,0.3)}'
  +'.fq{padding:14px 16px;font-size:15px;font-weight:600;color:#fff;cursor:pointer;list-style:none}'
  +'.fq::-webkit-details-marker{display:none}'
  +'.fq::after{content:"+";color:#E6C073;font-size:18px;float:right;font-weight:400}'
  +'.fi[open] .fq::after{content:"-"}'
  +'.fa{padding:0 16px 14px;font-size:14px;color:rgba(255,255,255,0.65);line-height:1.7}'
  +'.cb{padding:24px;background:rgba(230,192,115,0.04);border:1px solid rgba(230,192,115,0.2);border-radius:16px;margin:32px 0}'
  +'.cl{font-size:10px;letter-spacing:3px;color:#E6C073;font-weight:700;margin-bottom:12px}'
  +'.cg{display:grid;grid-template-columns:1fr 1fr;gap:8px}'
  +'.ca{padding:12px;background:rgba(255,255,255,0.03);border:1px solid rgba(230,192,115,0.15);border-radius:10px;color:#E6C073;text-decoration:none;font-size:13px;text-align:center;transition:all 0.2s}'
  +'.ca:hover{border-color:rgba(230,192,115,0.4);background:rgba(230,192,115,0.06)}'
  +'.ft{margin-top:48px;padding-top:24px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;font-size:11px;color:rgba(255,255,255,0.45)}'
  +'.ft a{color:rgba(255,255,255,0.6);text-decoration:none;margin:0 8px}'
  +'@media(max-width:480px){.post h1,.bh h1{font-size:28px}.cg{grid-template-columns:1fr}}';
}

function nav(extra) {
  return '<nav class="nav"><a href="/" class="nav-logo"><img src="/logo.webp" alt="Koffee Review"><span>KOFFEE REVIEW</span></a><div class="nav-links">' + (extra||'<a href="/blog">Blog</a><a href="/leaderboard">Leaderboard</a>') + '</div></nav>';
}

function footer() {
  return '<footer class="ft"><p style="font-size:10px;color:rgba(255,255,255,0.35);margin-bottom:8px;letter-spacing:1px">Last updated May 2026</p><p>&copy; 2026 Our Fair Dinkum Koffee Review</p><div style="margin-top:10px"><a href="/about">About</a> &middot; <a href="/disclosure">Disclosure</a> &middot; <a href="/how-we-score">How We Score</a></div><div style="margin-top:14px"><div style="font-size:10px;letter-spacing:3px;color:rgba(255,255,255,0.55);font-weight:700;margin-bottom:8px">EXPLORE</div><a href="/best-latte-brisbane" style="font-size:11px;color:rgba(255,255,255,0.55);text-decoration:none">Best Latte</a> &middot; <a href="/hidden-gem-cafes-brisbane" style="font-size:11px;color:rgba(255,255,255,0.55);text-decoration:none">Hidden Gems</a> &middot; <a href="/worst-cafes-by-suburb" style="font-size:11px;color:rgba(255,255,255,0.55);text-decoration:none">Worst Cafes</a> &middot; <a href="/map" style="font-size:11px;color:rgba(255,255,255,0.55);text-decoration:none">Map</a></div></footer>';
}

function renderIndex() {
  var cards = POSTS.map(function(p) {
    return '<a href="/blog/' + p.slug + '" class="pc"><div class="pd">' + p.date + ' &middot; ' + p.readingTime + '</div><h2 class="pt">' + esc(p.title) + '</h2><p class="pp">' + esc(p.description) + '</p><span class="pl">Read article &rarr;</span></a>';
  }).join("");
  var schema = JSON.stringify({"@context":"https://schema.org","@type":"Blog","name":"Koffee Review Blog","url":"https://koffeereview.com.au/blog","publisher":{"@type":"Organization","name":"Koffee Review","url":"https://koffeereview.com.au"},"blogPost":POSTS.map(function(p){return{"@type":"BlogPosting","headline":p.title,"url":"https://koffeereview.com.au/blog/"+p.slug,"datePublished":p.date}})});
  var bc = JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Koffee Review","item":"https://koffeereview.com.au"},{"@type":"ListItem","position":2,"name":"Blog","item":"https://koffeereview.com.au/blog"}]});
  return '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Blog &mdash; Koffee Review</title><meta name="description" content="Coffee guides, scoring methodology, and tasting tips. 600+ cafes reviewed across Australia."><link rel="canonical" href="https://koffeereview.com.au/blog"><link rel="alternate" hreflang="en-AU" href="https://koffeereview.com.au/blog"><meta property="og:title" content="Blog &mdash; Koffee Review"><meta property="og:url" content="https://koffeereview.com.au/blog"><meta property="og:image" content="https://koffeereview.com.au/logo.webp"><link rel="icon" href="/logo.webp"><script type="application/ld+json">' + schema + '</script><script type="application/ld+json">' + bc + '</script><style>' + css() + '</style></head><body><div class="c">' + nav('<a href="/city/brisbane">Brisbane</a><a href="/leaderboard">Leaderboard</a>') + '<div class="bc"><a href="/">Home</a> &middot; <span>Blog</span></div><header class="bh"><h1>The Koffee Review Blog</h1><p>Guides, methodology, and everything we have learned reviewing 600+ cafes across Australia.</p></header>' + cards + footer() + '</div></body></html>';
}

function renderPost(post) {
  var sid = function(h) { return h.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/-+/g,"-"); };
  var toc = post.sections.map(function(s) { return '<a href="#' + sid(s.heading) + '" class="ta">' + esc(s.heading) + '</a>'; }).join("");
  var introHtml = post.intro ? post.intro.split("\n\n").map(function(p) { return '<p>' + esc(p) + '</p>'; }).join("") : '<p>' + esc(post.description) + '</p>';
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
  return '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + esc(post.title) + ' | Koffee Review</title><meta name="description" content="' + esc(post.description) + '"><link rel="canonical" href="' + canonical + '"><link rel="alternate" hreflang="en-AU" href="' + canonical + '"><meta property="og:title" content="' + esc(post.title) + '"><meta property="og:description" content="' + esc(post.description) + '"><meta property="og:url" content="' + canonical + '"><meta property="og:type" content="article"><meta property="og:image" content="https://koffeereview.com.au/logo.webp"><meta property="article:published_time" content="' + post.date + '"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="/logo.webp"><script type="application/ld+json">' + articleSchema + '</script><script type="application/ld+json">' + bcSchema + '</script>' + faqSchema + '<style>' + css() + '</style></head><body><div class="c">'
  + nav()
  + '<div class="bc"><a href="/">Home</a> &middot; <a href="/blog">Blog</a> &middot; <span>' + esc(shortTitle) + '</span></div>'
  + '<article class="post"><h1>' + esc(post.title) + '</h1><div class="pm"><span>By Koffee Review</span><span class="md">&middot;</span><span>' + post.date + '</span><span class="md">&middot;</span><span>' + post.readingTime + ' read</span></div>'
  + '<div class="toc"><div class="tl">IN THIS ARTICLE</div>' + toc + '</div>'
  + '<div class="pi">' + introHtml + '</div>'
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
