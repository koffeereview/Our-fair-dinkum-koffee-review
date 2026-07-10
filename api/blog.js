// KOFFEE REVIEW BLOG — Server-rendered, SEO-optimised
// /api/blog → blog index | /api/blog?slug=how-to-find-good-coffee → post

function esc(str) { return (str||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }

var POSTS = [
  {
    slug: "how-to-find-good-coffee",
    title: "How to Find Good Coffee (The Real Way)",
    ogImage: "https://koffeereview.com.au/og-blog-1.png",
    description: "We have reviewed 600+ cafes across Australia with a locked scoring system. No sponsorships, no bias. Here is how to use our data to find genuinely great coffee every time.",
    date: "2026-01-10", readingTime: "8 min",
    keywords: ["how to find good coffee","best coffee brisbane","coffee guide australia","cafe reviews brisbane","best latte brisbane","coffee scoring system"],
    intro: "Most people find coffee the same way they find restaurants: Google Maps, star ratings, and hope. They see a 4.8-star cafe, walk in expecting something special, and get a mediocre flat white from someone who does not care about extraction.\n\nWe have been to 600+ cafes across Australia. Same order every time \u2014 one latte, one double shot espresso. No exceptions. And here is what we learned: most review systems are broken. So we built one that works.",
    sections: [
      {
        heading: "Why Google Reviews Are Useless for Coffee",
        body: "Google reviews tell you nothing about coffee quality. A five-star rating might mean the barista smiled, parking was easy, or the avocado toast was photogenic. A one-star review might mean the Wi-Fi was slow. None of this tells you whether the espresso is worth drinking.\n\nInstagram is worse. Most coffee content is sponsored or exchanged for free meals. The cafe that tags you in stories is not necessarily the cafe that pulls the best shot. Food bloggers pad their reviews with origin stories and latte art photos instead of actual tasting data.\n\nWhat you need is something different. A system where a 7.5 in Brisbane means the same thing as a 7.5 in Melbourne. Where you can compare 600 cafes fairly. Where the score actually predicts whether you will enjoy the coffee.\n\nThat is what Koffee Review is."
      },
      {
        heading: "How Our Scoring System Works",
        body: "We order the same thing at every single cafe. One latte. One double shot espresso. Every time, without exception. No substitutions, no variations, no specials.\n\nA latte tests milk technique \u2014 can the barista steam properly? Does the microfoam integrate with the espresso or sit on top like a hat? Is the texture silky or bubbly? The temperature right or scalding?\n\nA double shot espresso tests the coffee itself \u2014 extraction quality, bean freshness, grind consistency, crema colour and thickness. Is there sweetness in the shot or just bitterness? Does it have body or is it thin and watery?\n\nTogether, they tell you everything about a cafe's standards. If a cafe cannot make these two drinks well, nothing else on the menu matters.",
        cta: { text: "Read our full scoring methodology", url: "/how-we-score" }
      },
      {
        heading: "What Every Score Tier Means",
        body: "Our scoring runs from 0 to 10. Here is what each tier actually means for your experience:\n\n9.1 and above \u2014 ELITE. Exceptional in every way. These cafes are destination worthy. You would drive across the city for this coffee and not regret it. The beans, the technique, the consistency \u2014 all flawless.\n\n8.1 to 8.9 \u2014 GREAT. Worth going out of your way for. This cafe knows exactly what it is doing. Fresh beans, sharp technique, reliable consistency. You can order anything here and it will be well executed.\n\n7.5 to 7.9 \u2014 MUST VISIT. Genuinely good coffee. You will think about it after you leave. This is the threshold where a cafe stops being fine and becomes somewhere you actually want to return to. Our sticker worthy tier.\n\n7.1 to 7.4 \u2014 SOLID. Reliable. Not extraordinary, but you will not be disappointed. The safe choice when you do not know the area.\n\n6.5 to 6.9 \u2014 DECENT. Acceptable on a good day. Inconsistent or just missing something. You might enjoy it, you might not. Better options are likely nearby.\n\n6.1 to 6.4 \u2014 TAKE OR LEAVE. Not bad enough to avoid but not good enough to recommend.\n\n5.5 to 5.9 \u2014 AVERAGE. Forgettable coffee that does the job without impressing.\n\n5.1 to 5.4 \u2014 JUST OKAY. Below average. You will wish you went somewhere else.\n\n4.1 to 4.9 \u2014 NOT FOR US. Skip it. Life is too short for bad coffee.\n\nBelow 4.0 \u2014 AVOID. We will tell you exactly why it missed and suggest where to go instead.",
        cta: { text: "See our full scoring guide", url: "/how-we-score" }
      },
      {
        heading: "How to Actually Use Koffee Review",
        body: "Step one \u2014 start with the leaderboard. Our top rated cafes are proven winners across 600+ blind tests. If you are visiting a new city or suburb, this is your starting point. These are not opinions \u2014 they are results from the same controlled test repeated hundreds of times.\n\nStep two \u2014 filter by suburb. Every suburb with 3 or more reviewed cafes has its own dedicated page showing all reviewed cafes ranked by score. Want the best coffee in Fortitude Valley, Newstead, West End, or Bulimba? We have already done the work.\n\nStep three \u2014 read the tasting notes. Do not just look at the number. Our notes describe exactly what happened in the cup. A punchy start with a smooth body and balanced finish means something completely different from a timid opening with a sour, flat finish. The notes tell you what to expect before you spend six dollars.\n\nStep four \u2014 trust the pattern, not the exception. A cafe scoring 7.8 across our system is more reliable than a cafe your friend said was amazing once. Consistency is the entire point.",
        links: [
          { text: "Browse Australia's top 10 cafes", url: "/leaderboard" },
          { text: "Fortitude Valley cafes ranked", url: "/suburb/fortitude-valley-brisbane" },
          { text: "Newstead cafes ranked", url: "/suburb/newstead-brisbane" },
          { text: "Find cafes near you", url: "/" }
        ]
      },
      {
        heading: "Best Coffee by City \u2014 Where Australia Stands",
        body: "Brisbane is our home base with the most comprehensive coverage. Over 160 cafes reviewed and growing every week. Brisbane takes coffee seriously and the data proves it \u2014 the city has a strong cluster of 7.5+ cafes, particularly in the inner suburbs. If you are in Brisbane, you are spoiled for choice.\n\nGold Coast is a different story. The tourist strip is hit and miss, but the back streets hide genuine quality. The score spread is wider here \u2014 some cafes are exceptional, others are coasting on location. Our suburb pages help you skip the tourist traps.\n\nMelbourne is the traditional coffee capital of Australia. Higher standards across the board, more competition, and a cafe culture that has been refining itself for decades. Our Melbourne coverage is growing.\n\nSunshine Coast, Moreton Bay, Ipswich, and Logan round out our Queensland coverage. Every cafe gets the same test, the same order, the same scoring system.",
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
        body: "Most review sites only show you the good stuff. We show you everything \u2014 including the cafes that scored below 5.0 in our system.\n\nWhy? Because knowing where NOT to go is just as valuable as knowing where to go. If you are in a suburb with four cafes, three scoring 7+ and one scoring 4.8, you want to know which one to skip. We will tell you, with specific reasons.\n\nOur Cafes to Avoid page is one of the most visited on the site. It saves people time, money, and bad coffee experiences. No other review site in Australia has the integrity to publish this data.",
        links: [
          { text: "Brisbane cafes to avoid", url: "/brisbane-cafes-to-avoid" },
          { text: "Worst cafes by suburb", url: "/worst-cafes-by-suburb" }
        ]
      },
      {
        heading: "What Makes Us Different",
        body: "No sponsorships. No free coffees. No paid placements. Every single review is paid for out of pocket. Every score is earned, not bought.\n\nWe do not care about decor, parking, vibes, or Instagram aesthetics. We care about what is in the cup. A hole in the wall with plastic chairs that pulls a perfect shot will outscore a designer cafe with bad extraction every time.\n\nOur system is locked. We cannot change the methodology mid review to make a cafe look better. One latte, one double shot, scored on the same criteria, every single time across 600+ cafes. That is how you build a dataset you can trust."
      },
      {
        heading: "Start Finding Better Coffee Today",
        body: "Pick a suburb. Browse the cafes. Look for anything 7.5 or above. Go there. Order a latte and a double shot espresso. See if you agree with our score.\n\nIf you do \u2014 welcome. You have found a cafe worth returning to. If you do not \u2014 that is fine. Coffee is subjective. But our system works because it is consistent, repeatable, and brutally honest.\n\n600+ cafes. Same order. Same scoring. Every single time.\n\nOne latte. One double shot. No exceptions.",
        links: [
          { text: "Browse all cafes", url: "/" },
          { text: "National leaderboard", url: "/leaderboard" },
          { text: "How we score", url: "/how-we-score" }
        ]
      }
    ],
    faqs: [
      { q: "How does Koffee Review find good coffee?", a: "We order one latte and one double shot espresso at every cafe. Same order, same size, every time. We have reviewed 600+ cafes across Australia using this locked system. No sponsorships, no free coffees." },
      { q: "What score means a cafe is worth visiting?", a: "Anything 7.5 or above is a must visit in our system. Cafes scoring 8.0+ are exceptional. Below 6.0 we recommend skipping entirely." },
      { q: "Are Koffee Review scores sponsored or paid for?", a: "No. We accept no payment, no freebies, no sponsorships, and no paid placements. Every coffee is paid for out of pocket. Every score is earned through our blind ordering system." },
      { q: "How many cafes has Koffee Review reviewed?", a: "Over 600 cafes across Brisbane, Gold Coast, Sunshine Coast, Moreton Bay, Melbourne, and other Australian cities. We add new reviews every week." },
      { q: "What cities does Koffee Review cover?", a: "We primarily cover Brisbane (160+ cafes), Gold Coast, Sunshine Coast, Moreton Bay, Ipswich, Logan, and Melbourne. Our coverage expands every week." },
      { q: "Can I suggest a cafe for review?", a: "Yes. Visit koffeereview.com.au and use the Suggest a Cafe button to nominate any Australian cafe for review." }
    ]
  },
  {
    slug: "coffee-terminology-explained",
    title: "Coffee Terminology Explained: The Complete Guide",
    ogImage: "https://koffeereview.com.au/og-blog-2.png",
    description: "We have reviewed 600+ cafes across Australia and use these terms in every review. From extraction to microfoam, this guide decodes every coffee word so you know exactly what baristas are talking about.",
    date: "2026-01-24", readingTime: "9 min",
    keywords: ["coffee terminology","coffee terms explained","what is extraction coffee","microfoam meaning","coffee guide australia","espresso terms"],
    intro: "Every Koffee Review uses specific language. Extraction. Body. Microfoam. Crema. These are not fancy words for the sake of it \u2014 each one describes something real about what is happening in your cup.\n\nIf you have ever read one of our reviews and wondered what balanced with a clean finish actually means, this guide is for you. We have reviewed 600+ cafes using these terms. Here is what every single one means.",
    sections: [
      {
        heading: "Extraction \u2014 The Foundation of Everything",
        body: "Extraction is the process of pulling flavour from ground coffee using hot water. When a barista pulls an espresso shot, water passes through finely ground coffee under pressure. The flavours, oils, and compounds dissolve into the water. That is extraction.\n\nUnder extraction means not enough flavour was pulled out. The shot tastes sour, thin, and watery. The coffee grounds still had good stuff left in them but the water moved through too fast or the grind was too coarse.\n\nOver extraction means too much was pulled out. The shot tastes bitter, harsh, and astringent. The water sat in the coffee too long or the grind was too fine, pulling out compounds that taste unpleasant.\n\nProper extraction is the sweet spot. Balanced flavour, natural sweetness, clean finish. This is what we score highest in our reviews.\n\nWhen we write well extracted in a review, we mean the barista nailed the timing, temperature, and grind. When we write under extracted, it means the shot was rushed or the grind was wrong. For example, <a href=\"/review/clancys-espresso-norman-park\" style=\"color:#E6C073;border-bottom:1px solid rgba(230,192,115,0.3);text-decoration:none\">Clancys Espresso in Norman Park scored 7.9</a> partly because extraction was consistently clean across both drinks.",
        cta: { text: "See how we score extraction", url: "/how-we-score" }
      },
      {
        heading: "Crema \u2014 The First Thing You See",
        body: "Crema is the thin layer of golden brown foam on top of an espresso shot. It forms when hot water emulsifies the oils in freshly ground coffee under pressure.\n\nGood crema is thick, golden, and consistent. It should hold for at least 30 seconds before dissipating. The colour tells you about the roast \u2014 lighter crema usually means lighter roast, darker crema means darker roast.\n\nThin or pale crema often means stale beans, wrong grind, or poor machine pressure. No crema at all is a red flag \u2014 the beans are probably old or the machine needs servicing.\n\nWe note crema quality in our reviews because it is the first visual indicator of whether the cafe is using fresh beans and maintaining their equipment. Thick, tiger striped crema is a good sign before you even taste anything."
      },
      {
        heading: "Body \u2014 How Coffee Feels in Your Mouth",
        body: "Body describes the weight and texture of coffee on your tongue. It is not about flavour \u2014 it is about mouthfeel.\n\nFull body means the coffee feels heavy, rich, and coating. Think of the difference between skim milk and cream. Full bodied coffee has presence.\n\nLight body means the coffee feels thin, clean, and almost watery. This is not always bad \u2014 some light roast single origins are intentionally light bodied to highlight delicate flavours.\n\nMedium body is the most common and usually the most balanced. It has enough weight to feel satisfying without being heavy.\n\nWhen we write smooth body in a review, we mean the coffee has a pleasant, even weight across the palate. When we write thin body, it usually means the espresso was under extracted or the beans lacked depth."
      },
      {
        heading: "Microfoam \u2014 The Difference Between Good and Bad Milk",
        body: "Microfoam is steamed milk with extremely fine, uniform bubbles. It is what separates a properly made latte from a cup of hot milk with froth on top.\n\nGood microfoam has a glossy, paint like texture. When you pour it, it flows smoothly and integrates with the espresso. The bubbles are so small you cannot see them individually. This is what makes latte art possible.\n\nBad foam has large, visible bubbles. It sits on top of the espresso instead of mixing in. The texture is rough and bubbly instead of smooth. This is what most cheap cafes serve.\n\nWe test milk technique through the latte order specifically because microfoam quality tells you how skilled the barista is. Steaming milk properly requires practice, the right wand angle, and attention to temperature. When we write excellent microfoam in a review, we mean the barista has genuine skill.\n\nFor example, <a href=\"/review/bang-coffee-bar-coorparoo\" style=\"color:#E6C073;border-bottom:1px solid rgba(230,192,115,0.3);text-decoration:none\">Bang Coffee Bar in Coorparoo</a> consistently demonstrates strong milk technique across every visit."
      },
      {
        heading: "Finish \u2014 What Happens After You Swallow",
        body: "Finish (also called aftertaste) is the flavour that remains in your mouth after swallowing the coffee. It is one of the most important quality indicators.\n\nClean finish means the flavour fades smoothly without any unpleasant lingering tastes. The coffee leaves your palate feeling fresh. This is what we score highest.\n\nBitter finish means harsh, astringent flavours linger. Usually a sign of over extraction or dark, stale beans.\n\nSour finish means sharp, acidic tastes remain. Usually under extraction or beans that were roasted too light for the brewing method.\n\nLong finish means the good flavours keep developing after you swallow. This is a sign of high quality beans and excellent extraction. The best cafes in our system have a finish that makes you want another sip immediately."
      },
      {
        heading: "Balance \u2014 The Holy Grail",
        body: "Balance means no single flavour dominates. The acidity, sweetness, bitterness, and body are all in proportion. Nothing sticks out. Nothing is missing.\n\nA balanced espresso is not boring \u2014 it is controlled. Every element is present but none overpowers the others. This is the hardest thing to achieve consistently and it is why balanced is one of the highest compliments in our reviews.\n\nUnbalanced coffee has one element that dominates. Too acidic, too bitter, too sweet, or too thin. Most cafes we review are slightly unbalanced in one direction. The great cafes nail the balance every time.\n\nWhen we write balanced throughout in a review, we mean the cafe has achieved something most cannot. It usually indicates fresh beans, correct extraction, and a barista who knows what they are doing."
      },
      {
        heading: "Single Origin vs Blend",
        body: "A single origin coffee comes from one specific farm, region, or country. It has a distinct flavour profile that reflects where it was grown. Ethiopian single origins might taste fruity and floral. Colombian might taste nutty and chocolatey.\n\nA blend combines beans from multiple origins to create a consistent, balanced flavour profile. Most cafe house coffees are blends because they are easier to dial in and produce reliable results day after day.\n\nNeither is inherently better. Single origins offer complexity and uniqueness. Blends offer consistency and balance. We score both on the same criteria \u2014 extraction, body, balance, and finish.\n\nWhen a cafe uses a quality blend, it tells you they prioritise consistency. When they offer single origins, it tells you they want to showcase specific flavours. Both approaches can score 7.5+ in our system.\n\nFor example, <a href=\"/review/passport-specialty-coffee-northgate\" style=\"color:#E6C073;border-bottom:1px solid rgba(230,192,115,0.3);text-decoration:none\">Passport Specialty Coffee in Northgate</a> demonstrates how bean freshness matters regardless of whether it is a single origin or blend."
      },
      {
        heading: "Dial In \u2014 The Daily Calibration",
        body: "Dialling in is the process of adjusting the grinder, dose, and extraction time at the start of each day (or when switching beans) to achieve the perfect shot.\n\nCoffee beans change constantly. Humidity, age, roast date, and temperature all affect how they grind and extract. A setting that worked yesterday might produce a sour shot today. Dialling in compensates for these variables.\n\nA cafe that dials in properly every morning will serve consistent espresso all day. A cafe that does not will serve shots that vary wildly from hour to hour.\n\nWhen we visit a cafe at different times and get consistent scores, it usually means they dial in properly. Inconsistent scores across visits suggest they are not adjusting daily."
      },
      {
        heading: "Channelling \u2014 The Invisible Problem",
        body: "Channelling happens when water finds a path of least resistance through the coffee puck instead of flowing evenly through all the grounds. The result is uneven extraction \u2014 some coffee is over extracted while the rest is under extracted.\n\nYou can sometimes spot channelling by watching the espresso pour. If the stream splits, spurts, or comes out unevenly, water is channelling through the puck.\n\nThe taste effect is a muddy, confused shot. Some sour notes, some bitter notes, and no clear flavour profile. It happens when the barista does not distribute or tamp the grounds evenly.\n\nWhen we write uneven extraction in a review, channelling is often the cause. It is a technique issue that trained baristas avoid through consistent distribution and tamping."
      },
      {
        heading: "Grind Size \u2014 The Variable That Changes Everything",
        body: "Grind size is how finely or coarsely the coffee beans are ground before brewing. It directly controls extraction speed and flavour.\n\nFiner grind means water passes through more slowly, extracting more flavour. Too fine and the shot over extracts (bitter, harsh). Espresso uses a fine grind.\n\nCoarser grind means water passes through faster, extracting less. Too coarse and the shot under extracts (sour, weak). Filter coffee uses a coarser grind.\n\nThe right grind size depends on the beans, the roast date, the humidity, and the machine. This is why dialling in matters \u2014 the grind that works in the morning might need adjusting by afternoon.\n\nWhen we write well ground or grind consistency is sharp in a review, we mean the cafe is paying attention to this variable. Inconsistent grind is one of the most common reasons cafes score below 6.0 in our system."
      },
      {
        heading: "Putting It All Together",
        body: "Every term in this guide connects to the same thing: what is in your cup.\n\nA great cafe extracts properly, produces thick crema from fresh beans, steams microfoam that integrates with the espresso, and delivers a balanced cup with a clean finish. Every term we use in our reviews describes one piece of that process.\n\nA bad cafe skips one or more of these steps. Stale beans (thin crema). Rushed extraction (sour, thin body). Poor milk technique (bubbly foam). No dialling in (inconsistent shots).\n\nNow when you read a Koffee Review, you know exactly what we mean. And more importantly, you know what to look for when you walk into a cafe yourself.\n\nOne latte. One double shot. Every time. No exceptions.",
        links: [
          { text: "Browse all 600+ cafe reviews", url: "/" },
          { text: "See how we score", url: "/how-we-score" },
          { text: "Australia's top 10 cafes", url: "/leaderboard" },
          { text: "Best coffee Brisbane 2026", url: "/best-coffee-brisbane" },
          { text: "Hidden gem cafes", url: "/hidden-gem-cafes-brisbane" },
          { text: "Cafes to avoid", url: "/brisbane-cafes-to-avoid" },
          { text: "Compare two cafes", url: "/compare" },
          { text: "Explore all pages", url: "/explore" },
          { text: "Coffee near landmarks", url: "/coffee-near" }
        ]
      }
    ],
    faqs: [
      { q: "What does extraction mean in coffee?", a: "Extraction is the process of dissolving flavour compounds from ground coffee using hot water. Under extraction produces sour, thin coffee. Over extraction produces bitter, harsh coffee. Proper extraction produces balanced, sweet, clean coffee." },
      { q: "What is microfoam?", a: "Microfoam is steamed milk with extremely fine, invisible bubbles that create a glossy, paint like texture. It integrates smoothly with espresso and enables latte art. Bad foam has large visible bubbles and sits on top instead of mixing in." },
      { q: "What does body mean in a coffee review?", a: "Body describes the weight and texture of coffee in your mouth. Full body feels rich and heavy. Light body feels thin and clean. Medium body is balanced. It is about mouthfeel, not flavour." },
      { q: "What is crema on espresso?", a: "Crema is the thin layer of golden brown foam on top of a fresh espresso shot. It forms when hot water emulsifies coffee oils under pressure. Thick, golden crema indicates fresh beans and proper machine pressure. Thin or absent crema is a red flag." },
      { q: "What does dialling in mean?", a: "Dialling in is the process of adjusting grind size, dose, and extraction time to achieve the perfect espresso shot. Good cafes do this every morning because beans change with humidity, age, and temperature." },
      { q: "What is channelling in espresso?", a: "Channelling is when water finds a path of least resistance through the coffee puck instead of flowing evenly. It causes uneven extraction, producing a muddy shot with mixed sour and bitter notes. It is caused by poor distribution or tamping." }
    ]
  },
  {
    slug: "best-coffee-by-region",
    title: "Best Coffee by Australian Region \u2014 Where to Go",
    ogImage: "https://koffeereview.com.au/og-blog-3.png",
    description: "We have reviewed 600+ cafes across Australia. Here is where to find the best coffee in Brisbane, Gold Coast, Melbourne, Sunshine Coast, and beyond. Regional breakdown with data.",
    date: "2026-02-07", readingTime: "8 min",
    keywords: ["best coffee australia","best coffee brisbane","best coffee melbourne","best coffee gold coast","australian coffee culture","best cafes australia"],
    intro: "Australia has a fragmented coffee culture. What works in Melbourne does not work in Brisbane. What is standard in Sydney is rare on the Gold Coast.\n\nWe have reviewed 600+ cafes across Australia. Same order every time. One latte, one double shot espresso. And we have learned something: each region has its own coffee personality.\n\nHere is where to find genuinely good coffee, region by region.",
    sections: [
      {
        heading: "Brisbane \u2014 Consistency is Rising",
        body: "261 cafes reviewed. 21 must visit tier (7.5+). Average score: 6.4.\n\nBrisbane's coffee scene is the most accessible in Australia. It is growing fast and standards are rising.\n\nWhat Brisbane does well: balanced, approachable coffee. Not trying too hard. The culture here is get good coffee, move on. No gatekeeping, no pretense.\n\nThe style: medium roasts, house blends, solid technique. You will not find experimental single origins on every corner, but you will find reliable espresso.\n\nTop 3 Brisbane cafes: <a href=\"/review/zen-barista-manly\" style=\"color:#E6C073;border-bottom:1px solid rgba(230,192,115,0.3);text-decoration:none\">Zen Barista (Manly) at 7.8</a>, <a href=\"/review/the-twin-west-end\" style=\"color:#E6C073;border-bottom:1px solid rgba(230,192,115,0.3);text-decoration:none\">The Twin (West End) at 7.8</a>, and <a href=\"/review/coffee-speed-dial-newstead\" style=\"color:#E6C073;border-bottom:1px solid rgba(230,192,115,0.3);text-decoration:none\">Coffee Speed Dial (Newstead) at 7.5</a>.\n\nWhere to go: start in Fortitude Valley, West End, or South Bank. These suburbs have the highest concentration of good cafes. Avoid the CBD if you are new to the area. Quality is mixed.\n\nPro tip: Brisbane cafes are still good value compared to Sydney and Melbourne. A solid latte runs $6 to $6.50. The trade off is less experimentation, more reliability.",
        links: [
          { text: "Explore all Brisbane cafes", url: "/city/brisbane" },
          { text: "Best coffee Brisbane 2026", url: "/best-coffee-brisbane" }
        ]
      },
      {
        heading: "Gold Coast \u2014 Touristy, But Hidden Gems Exist",
        body: "80+ cafes reviewed. 8 must visit tier (7.5+). Average score: 6.2.\n\nGold Coast leans tourist. Most cafes optimize for foot traffic and Instagram, not coffee quality. But dig deeper and you find pockets of genuine excellence.\n\nWhat Gold Coast does well: scenic cafe experiences. Oceanfront coffees. Vibe matters here as much as taste.\n\nThe style: mixed bag. Tourist cafes serve predictable lattes. Serious cafes in Burleigh and Currumbin do single origins and specialty drinks.\n\nTop 3 Gold Coast cafes: <a href=\"/review/next-door-burleigh-burleigh-heads\" style=\"color:#E6C073;border-bottom:1px solid rgba(230,192,115,0.3);text-decoration:none\">Next Door Burleigh (Burleigh Heads) at 7.8</a>, <a href=\"/review/silipo-coffee-southport\" style=\"color:#E6C073;border-bottom:1px solid rgba(230,192,115,0.3);text-decoration:none\">Silipo Coffee (Southport) at 7.8</a>, and <a href=\"/review/the-market-place-cafe-robina\" style=\"color:#E6C073;border-bottom:1px solid rgba(230,192,115,0.3);text-decoration:none\">The Market Place Cafe (Robina) at 7.6</a>.\n\nWhere to go: Burleigh Heads and Currumbin are your targets. Main Beach and Surfers Paradise are tourist traps. Skip them unless you are desperate.\n\nPro tip: Gold Coast cafes are more expensive ($6.50 to $7.50) but the view makes up for it. Order by the ocean, not by the highway.\n\nWhat to avoid: generic beachside chains. They will serve you a mediocre latte with a smile.",
        links: [
          { text: "Explore all Gold Coast cafes", url: "/city/gold-coast" },
          { text: "Best coffee Gold Coast", url: "/best-coffee-gold-coast" },
          { text: "Hidden gem cafes", url: "/hidden-gem-cafes-brisbane" }
        ]
      },
      {
        heading: "Melbourne \u2014 The Traditional Capital",
        body: "Our Melbourne coverage is growing with every trip. Melbourne invented modern Australian cafe culture. They take coffee seriously. Sometimes too seriously.\n\nWhat Melbourne does well: specialty coffee, single origins, experimental techniques. Baristas are trained. Standards are high across the board.\n\nThe style: light roasts, single origins, pour overs, long blacks. Melbourne prefers bright, acidic coffee over milk based drinks. Order a flat white and they might give you a lecture on microfoam density.\n\nThe culture: competitive. There is a hierarchy. The best cafes are genuinely excellent. The mediocre ones are still better than most cities.\n\nWhere to go: CBD laneways, South Yarra, Fitzroy. Avoid suburban chains. They are not the Melbourne you came for.\n\nPro tip: Melbourne is expensive ($6.50 to $7.50). You are paying for technique, not just coffee.\n\nWhat to expect: every cafe will have 3+ single origin options. The barista will ask how you want it prepared. Do not say just make me a coffee. Be ready to engage.",
        links: [
          { text: "Melbourne cafes reviewed", url: "/city/melbourne" },
          { text: "Best coffee Melbourne", url: "/best-coffee-melbourne" }
        ]
      },
      {
        heading: "Sunshine Coast and Regional \u2014 Emerging Quality",
        body: "Regional Australia is where the surprises are. Quality is inconsistent but pockets of excellence exist in unexpected places.\n\nWhat they do well: genuine hospitality. Less ego, more care. Roasters are passionate, not jaded.\n\nThe style: depends on the roaster. Some do light single origins, others stick to house blends. Less standardization than cities.\n\nWhere to go: Noosa, Airlie Beach, small towns with local roasters. Skip the chains.\n\nPro tip: regional cafes are cheaper and often better than you would expect. The owner probably roasts the beans themselves.\n\nHidden gem factor: high. You might find a 7.8 cafe in a town of 5,000 people that would destroy most Sydney cafes.",
        links: [
          { text: "Full leaderboard", url: "/leaderboard" },
          { text: "Sunshine Coast cafes", url: "/city/sunshine-coast" }
        ]
      },
      {
        heading: "How to Find the Best Coffee in Your Region",
        body: "Do not guess. Use data.\n\nStart with the leaderboard. See Australia's top 10. All are 7.5+.\n\nFilter by city. Brisbane, Gold Coast, Melbourne, regional. See what your city has.\n\nLook for 7.5+. Anything in Must Visit tier (7.5 to 7.9) or above is a safe bet.\n\nRead the notes. Balanced, clean finish versus sour, thin tells you whether to go.\n\nSort by suburb. Know where you are? We have broken down every suburb. Pick the best cafe nearby.",
        links: [
          { text: "National leaderboard", url: "/leaderboard" },
          { text: "Brisbane cafes", url: "/city/brisbane" },
          { text: "Gold Coast cafes", url: "/city/gold-coast" },
          { text: "Melbourne cafes", url: "/city/melbourne" },
          { text: "Search by suburb", url: "/explore" }
        ]
      },
      {
        heading: "The Regional Ranking",
        body: "Most consistent (fewest bad cafes): Melbourne.\n\nMost room to improve: Gold Coast.\n\nBest value: Brisbane.\n\nMost potential: Sunshine Coast and regional.\n\nMost competitive: Melbourne.\n\nFastest growing: Brisbane."
      },
      {
        heading: "The Real Talk",
        body: "Australia's coffee is good. Not world class, but good. We are not competing with Italy or specialty coffee capitals like Portland. We are competing with ourselves. And we are getting better.\n\nBrisbane is rising. Gold Coast is figuring it out. Melbourne is the standard. Regional Australia is surprising people.\n\nYou do not need to fly to Melbourne for good coffee anymore. Your city probably has it. You just need to know where to look.",
        links: [
          { text: "Start exploring", url: "/explore" },
          { text: "Browse all 600+ cafes", url: "/leaderboard" },
          { text: "Filter by your city", url: "/city/brisbane" },
          { text: "See the national leaderboard", url: "/leaderboard" }
        ]
      }
    ],
    faqs: [
      { q: "Where is the best coffee in Australia?", a: "Based on 600+ reviews using a locked scoring system, Melbourne has the highest average quality. Brisbane has the best value. Gold Coast has the widest range between excellent and poor. Check our leaderboard for the top 10 nationally." },
      { q: "Is Brisbane coffee any good?", a: "Yes. Brisbane has 21 cafes in our Must Visit tier (7.5+) across 261 reviews. The inner suburbs like Fortitude Valley, West End, and Newstead are particularly strong. Average score is 6.4/10 which is solid for the volume reviewed." },
      { q: "What is the best coffee city in Australia?", a: "Melbourne has the highest average scores and deepest talent pool. Brisbane has the most reviews in our system and is the fastest growing coffee scene. Gold Coast has pockets of excellence but is inconsistent. Each city has a different coffee personality." },
      { q: "Where should I go for coffee on the Gold Coast?", a: "Burleigh Heads and Currumbin. Avoid the main tourist strips in Surfers Paradise and Main Beach. Our top Gold Coast picks are Next Door Burleigh (7.8), Silipo Coffee Southport (7.8), and The Market Place Cafe Robina (7.6)." },
      { q: "How does Koffee Review compare cities?", a: "Same method everywhere. One latte, one double shot espresso, same scoring system. A 7.5 in Brisbane means the same thing as a 7.5 in Melbourne. We have reviewed 600+ cafes using this locked system since 2021." }
    ]
  },
  {
    slug: "why-our-scoring-system-works",
    title: "Why Our Scoring System Works",
    ogImage: "https://koffeereview.com.au/og-blog-4.png",
    description: "Why a 0 to 10 scale with locked verdict tiers is the most honest way to rate coffee. No hedging. Here is how we score 600+ cafes consistently across Australia.",
    date: "2026-02-21", readingTime: "7 min",
    keywords: ["coffee scoring system","how to rate coffee","coffee rating scale","cafe ratings","coffee quality assessment","koffee review scoring"],
    intro: "Most cafe reviews are garbage.\n\nThey waffle. They hedge. They will tell you a cafe is great for the vibe or not bad actually and you still do not know if the coffee is worth your time.\n\nWe do not do that.\n\nWe built a scoring system that works because it is simple, consistent, and leaves no room for ambiguity. After 600+ reviews across Australia, it has proven itself.\n\nHere is why it works.",
    sections: [
      {
        heading: "The Problem With Other Rating Systems",
        body: "Five star ratings are useless. Everyone knows this. Every bad cafe has four stars. Every good one has four point five. The scale collapses because people do not want to hurt feelings.\n\nPercentage scores hide inconsistency. This cafe scores 74% tells you nothing. 74% of what? The maximum score? The average score? You do not know if that is good or mediocre.\n\nVague adjectives are worse. Good, solid, decent. These words mean something different to everyone. To you, decent might be a cafe you would return to. To someone else, it is one you would avoid.\n\nWe needed something that worked every time, across every cafe, with no interpretation needed."
      },
      {
        heading: "Our System: 0 to 10, Locked Verdicts",
        body: "We use a simple 0 to 10 scale with locked verdict tiers.\n\n9.1+ is ELITE. Exceptional in every way. Destination worthy.\n\n8.1 to 8.9 is GREAT. Worth going out of your way for. Fresh beans, sharp technique.\n\n7.5 to 7.9 is MUST VISIT. Genuinely good coffee. You will think about it after you leave. This is the sticker threshold.\n\n7.1 to 7.4 is SOLID. Reliable. You will not be disappointed.\n\n6.5 to 6.9 is DECENT. Acceptable on a good day. Better options likely nearby.\n\n6.1 to 6.4 is TAKE OR LEAVE. Not bad enough to avoid but not good enough to recommend.\n\n5.5 to 5.9 is AVERAGE. Forgettable coffee that does the job without impressing.\n\n5.1 to 5.4 is JUST OKAY. Below average. You will wish you went somewhere else.\n\n4.1 to 4.9 is NOT FOR US. Skip it.\n\nBelow 4.0 is AVOID. We will tell you exactly why.\n\nThe verdict is locked to the score. If it scores 7.7, it is MUST VISIT. Not pretty good. Not worth trying. MUST VISIT. Meaning it is genuinely good enough to go out of your way for.\n\nThis removes interpretation. No guessing. No debate.",
        cta: { text: "See our full scoring methodology", url: "/how-we-score" }
      },
      {
        heading: "Why 0 to 10 Works Better Than 5 Star",
        body: "Range. Five stars collapses everything into five buckets. 0 to 10 gives you ten tiers. More granularity. More honesty.\n\nFamiliarity. Everyone understands 0 to 10. It is how you scored tests in school. It is how you rate things in your head. No learning curve.\n\nNo middle ground. With five stars, the middle (3 stars) is ambiguous. With 0 to 10, anything below 5.5 is clearly do not bother. Anything above 7.0 is worth your time. The gap is real.\n\nSpecificity. A 7.2 is different from a 7.8. Both are in different tiers (SOLID vs MUST VISIT) and that distinction matters. Our system preserves that nuance without making you decode a percentage."
      },
      {
        heading: "Why The Verdicts Are Locked",
        body: "Here is the key: the verdict does not change. The score does.\n\nIf we said a cafe was MUST VISIT, it is MUST VISIT. Every time. No exceptions. That is the commitment.\n\nBut the score within that tier can move. A 7.5 is MUST VISIT. So is a 7.9. Same verdict, different quality level.\n\nThis is intentional. It creates a confidence floor. Once something hits MUST VISIT, you know it is worth going. You might find a 7.5 or a 7.9, but both pass the threshold.\n\nMeanwhile, the score tells you what we really thought. Precision inside consistency."
      },
      {
        heading: "How We Actually Score",
        body: "Every cafe. Same order. Every time.\n\nOne latte. One double shot espresso.\n\nThe latte tests milk technique, espresso to milk ratio, balance, and texture.\n\nThe espresso tests raw extraction quality, crema, finish, and whether the shot was pulled properly.\n\nWhat we are really judging: technical execution (did the barista do their job), bean quality (are they using fresh, decent beans), consistency (would this be the same next week), and value (are you getting what you are paying for).\n\nThat is it. No nostalgia. No vibe. No forgiveness for bad coffee in a pretty cafe.",
        cta: { text: "Read the full methodology", url: "/how-we-score" }
      },
      {
        heading: "The Three Rules That Keep It Honest",
        body: "Rule 1: No hedging. Pretty good actually is not a verdict. Either it works or it does not. Either it is worth your time or it is not. Anything below 5.5 is AVERAGE or worse. Not you might hate it. Not it is polarising.\n\nRule 2: One order, one score. We do not taste the coffee three times and average. We order once. One latte. One espresso. That is your score. Because that is what you are getting. If a cafe is inconsistent, that is a problem. But we are not averaging away the bad days.\n\nRule 3: The verdict tier is the promise. If we say MUST VISIT (7.5+), we are saying go out of your way, this is worth it. That is not a casual rating. That is a commitment. We have tested 600+ cafes. We know what good looks like. If we say MUST VISIT, we mean it."
      },
      {
        heading: "Why This Matters",
        body: "For you: you know exactly what you are getting. A 7.6 cafe is worth the drive. A 6.2 cafe is a maybe. A 4.8 cafe is a waste of time. No guessing.\n\nFor cafes: if they score well, they earned it. No participation trophies. No everyone is a winner. The rating means something because the standard is real.\n\nFor consistency: we have rated 600+ cafes across Australia. Same system. Same order. Same threshold. You can compare a Brisbane cafe to a Melbourne one with confidence.",
        links: [
          { text: "See the leaderboard", url: "/leaderboard" },
          { text: "Must Visit cafes (7.5+)", url: "/must-visit-cafes" },
          { text: "Cafes to avoid", url: "/brisbane-cafes-to-avoid" }
        ]
      },
      {
        heading: "How To Use The System",
        body: "If you see MUST VISIT (7.5+): go. You will get genuinely good coffee. No regrets.\n\nIf you see SOLID (7.1 to 7.4): good. No complaints. Worth visiting if you are in the area.\n\nIf you see DECENT (6.5 to 6.9): fine. It exists. You will not hate it.\n\nIf you see TAKE OR LEAVE (6.1 to 6.4): meh. Better options out there.\n\nIf you see AVERAGE (5.5 to 5.9): forgettable. You will not remember it tomorrow.\n\nIf you see NOT FOR US (4.1 to 4.9): do not. Your time and money are worth more.\n\nIf you see AVOID (below 4.0): absolutely not.",
        links: [
          { text: "Browse all 600+ cafes", url: "/" },
          { text: "How we score", url: "/how-we-score" },
          { text: "Explore Koffee Review", url: "/explore" },
          { text: "Compare two cafes", url: "/compare" },
          { text: "Hidden gem cafes", url: "/hidden-gem-cafes-brisbane" },
          { text: "Best coffee Brisbane", url: "/best-coffee-brisbane" }
        ]
      }
    ],
    faqs: [
      { q: "How does Koffee Review score cafes?", a: "We order one latte and one double shot espresso at every cafe. Same order, same size, every time. We score on taste, extraction, milk technique, and value out of 10. No sponsorships, no free coffees, no exceptions." },
      { q: "What score means a cafe is worth visiting?", a: "Anything 7.5 or above is a Must Visit in our system. Cafes scoring 8.1+ are Great. 9.1+ is Elite. Below 5.5 is Average or worse. Below 4.0 is Avoid." },
      { q: "Why does Koffee Review use a 0 to 10 scale?", a: "A 0 to 10 scale gives 10 verdict tiers instead of 5. It preserves nuance (a 7.2 is different from a 7.8) while being universally understood. Five star ratings collapse everything into too few buckets." },
      { q: "Are Koffee Review scores consistent across cities?", a: "Yes. A 7.5 in Brisbane means the same thing as a 7.5 in Melbourne. Same order, same scoring criteria, same locked verdict tiers across all 600+ reviews." },
      { q: "What is the Koffee Review sticker?", a: "Any cafe scoring 7.5 or above earns a Koffee Review sticker, our Must Visit badge. It means the cafe passed our blind taste test and is genuinely worth going out of your way for." }
    ]
  },
  {
    slug: "brisbane-vs-gold-coast-coffee",
    title: "Brisbane vs Gold Coast Coffee \u2014 What 350+ Reviews Tell Us",
    ogImage: "https://koffeereview.com.au/og-blog-5.png",
    description: "We have reviewed 350+ cafes across Brisbane and the Gold Coast. Same order every time. Here is which city does coffee better, the best suburbs in each, and where to actually go.",
    date: "2026-03-07", readingTime: "8 min",
    keywords: ["brisbane vs gold coast coffee","best coffee brisbane","best coffee gold coast","brisbane coffee","gold coast coffee","queensland coffee"],
    intro: "Two cities. One state. Completely different coffee cultures.\n\nWe have reviewed 350+ cafes across Brisbane and the Gold Coast. Same order every time. One latte, one double shot espresso. No vibe scores. No nostalgia. Just the coffee.\n\nAfter all those visits, the data tells a clear story. Here is who wins, where to go, and why the two cities feel nothing alike in the cup.",
    sections: [
      {
        heading: "The Headline Numbers",
        body: "Brisbane has the volume. Gold Coast has the gaps.\n\nBrisbane: more cafes reviewed, more genuine standouts, higher floor. The bad ones are fewer and the good ones run deeper.\n\nGold Coast: fewer reviews, more inconsistency. Tourist pressure means a lot of cafes coast on location, not craft. But the top end holds its own against anything in Brisbane.\n\nThe short version: Brisbane is more reliable. Gold Coast is more hit or miss, but the hits are real."
      },
      {
        heading: "Brisbane \u2014 Volume and Consistency",
        body: "Brisbane's coffee scene works because it is not trying to impress anyone. The culture here is functional. Good coffee, fair price, move on. No one is lecturing you about extraction yield. They just pull a clean shot and hand it over.\n\nWhat Brisbane does well: consistency. The gap between the best and the average cafe is smaller than you would expect. Value. You get good coffee for less than anywhere else in the country. Depth. The good suburbs have multiple genuine options, not just one hero cafe.\n\nWhere Brisbane falls short: less experimentation. Single origins and specialty pour overs are rarer. The CBD is a coin flip. High foot traffic, mixed quality.\n\nTop Brisbane cafes: <a href=\"/review/zen-barista-manly\" style=\"color:#E6C073;border-bottom:1px solid rgba(230,192,115,0.3);text-decoration:none\">Zen Barista (Manly) at 7.8</a>, <a href=\"/review/the-twin-west-end\" style=\"color:#E6C073;border-bottom:1px solid rgba(230,192,115,0.3);text-decoration:none\">The Twin (West End) at 7.8</a>, and <a href=\"/review/coffee-speed-dial-newstead\" style=\"color:#E6C073;border-bottom:1px solid rgba(230,192,115,0.3);text-decoration:none\">Coffee Speed Dial (Newstead) at 7.5</a>.\n\nBest Brisbane suburbs for coffee: West End, Newstead, Manly, Woolloongabba. These carry the highest concentration of genuine picks.",
        links: [
          { text: "Explore all Brisbane cafes", url: "/city/brisbane" },
          { text: "Best coffee Brisbane", url: "/best-coffee-brisbane" }
        ]
      },
      {
        heading: "Gold Coast \u2014 Scenery First, Coffee Second (Usually)",
        body: "The Gold Coast has a different problem. Too many cafes are selling a view, not a coffee. When you are on the water with tourist foot traffic out the door, there is no pressure to pull a great shot. People are there for the beach, not the bean. A lot of cafes know it and coast.\n\nBut the serious ones, the cafes tucked into Burleigh, Currumbin, the back streets, are genuinely excellent. They have to be, because they are competing on coffee, not location.\n\nWhat Gold Coast does well: the top end. Its best cafes match Brisbane's best, no question. Setting. Nobody does an oceanfront coffee like the Goldy. Specialty pockets. Burleigh and Currumbin punch above their weight.\n\nWhere Gold Coast falls short: the floor is lower. More mediocre cafes riding on location. Inconsistency. Quality swings hard suburb to suburb. Price. You pay more, and not always for better coffee.\n\nTop Gold Coast cafes: <a href=\"/review/next-door-burleigh-burleigh-heads\" style=\"color:#E6C073;border-bottom:1px solid rgba(230,192,115,0.3);text-decoration:none\">Next Door Burleigh (Burleigh Heads) at 7.8</a>, <a href=\"/review/silipo-coffee-southport\" style=\"color:#E6C073;border-bottom:1px solid rgba(230,192,115,0.3);text-decoration:none\">Silipo Coffee (Southport) at 7.8</a>, and <a href=\"/review/the-market-place-cafe-robina\" style=\"color:#E6C073;border-bottom:1px solid rgba(230,192,115,0.3);text-decoration:none\">The Market Place Cafe (Robina) at 7.6</a>.\n\nBest Gold Coast suburbs for coffee: Burleigh Heads, Currumbin, Southport. Skip Surfers Paradise and Main Beach unless you are already there.",
        links: [
          { text: "Explore all Gold Coast cafes", url: "/city/gold-coast" },
          { text: "Best coffee Gold Coast", url: "/best-coffee-gold-coast" }
        ]
      },
      {
        heading: "Head to Head",
        body: "Consistency: Brisbane wins. Smaller gap top to bottom.\n\nTop end quality: equal. Gold Coast matches Brisbane's best.\n\nValue: Brisbane wins. Cheapest good coffee in Australia.\n\nSetting: Gold Coast wins. Oceanfront is hard to beat.\n\nDepth (good options): Brisbane wins. More genuine picks across more suburbs.\n\nExperimentation: Gold Coast slightly ahead in specialty pockets.\n\nOverall: Brisbane takes it on consistency, value, and depth. Gold Coast wins on setting and matches Brisbane at the very top. If you want reliable, go Brisbane. If you want a great coffee with a view and you know where to look, go Gold Coast."
      },
      {
        heading: "The Style Difference",
        body: "This is the part the numbers do not fully capture.\n\nBrisbane coffee is built for the daily drinker. Medium roasts, house blends, dialled in milk. The aim is a coffee you would happily drink every morning. Comfortable, not flashy.\n\nGold Coast coffee splits in two. The tourist cafes serve a predictable, safe latte to people who will not notice either way. The serious cafes go harder. Single origins, brighter roasts, more deliberate extraction. Because their regulars actually care.\n\nSo a Brisbane 7.5 and a Gold Coast 7.5 do not taste the same. Brisbane's is reliably good. Gold Coast's is good because someone fought to make it good in a market that does not demand it."
      },
      {
        heading: "Where To Actually Go",
        body: "In Brisbane, if you want a sure thing: head to West End or Newstead. Pick anything 7.5+ on the leaderboard. You will not be disappointed.\n\nOn the Gold Coast, if you want a sure thing: go to Burleigh Heads or Currumbin. Ignore the beachfront chains. The good coffee is one street back.\n\nIf you are choosing between the two for a coffee trip: Brisbane for breadth. More cafes, less risk. Gold Coast for a standout day. Fewer options, but a great one by the water beats anything.",
        links: [
          { text: "National leaderboard", url: "/leaderboard" },
          { text: "Must Visit cafes", url: "/must-visit-cafes" },
          { text: "Best latte Brisbane", url: "/best-latte-brisbane" },
          { text: "Best latte Gold Coast", url: "/best-latte-gold-coast" },
          { text: "Best espresso Brisbane", url: "/best-espresso-brisbane" }
        ]
      },
      {
        heading: "The Verdict",
        body: "Brisbane wins on paper. More consistency, better value, deeper bench.\n\nBut the Gold Coast is not far behind, and its best cafes will hold their own against any cafe in the state. The difference is you have to know where to look. Brisbane forgives a blind choice. The Gold Coast punishes it.\n\nBoth cities have genuinely great coffee. You just need the data to find it.\n\nThat is what we are here for.",
        links: [
          { text: "Browse Brisbane cafes", url: "/city/brisbane" },
          { text: "Browse Gold Coast cafes", url: "/city/gold-coast" },
          { text: "Explore all pages", url: "/explore" }
        ]
      }
    ],
    faqs: [
      { q: "Is Brisbane or Gold Coast better for coffee?", a: "Based on 350+ reviews, Brisbane is more consistent with better value and more good cafes spread across more suburbs. Gold Coast matches Brisbane at the top end but has a wider quality gap. Brisbane wins overall but Gold Coast's best cafes are genuinely excellent." },
      { q: "Where is the best coffee on the Gold Coast?", a: "Burleigh Heads and Currumbin have the highest concentration of good cafes. Our top picks are Next Door Burleigh (7.8), Silipo Coffee Southport (7.8), and The Market Place Cafe Robina (7.6). Avoid the main tourist strips." },
      { q: "Is Gold Coast coffee overpriced?", a: "Gold Coast cafes are typically $1 to $1.50 more expensive than Brisbane for equivalent quality. You are partly paying for the setting. The serious cafes in Burleigh and Currumbin are worth the premium. Tourist strip cafes generally are not." },
      { q: "What makes Brisbane coffee different from Gold Coast?", a: "Brisbane coffee is built for daily drinkers. Medium roasts, house blends, reliable consistency. Gold Coast splits between tourist cafes serving safe lattes and serious cafes pushing specialty coffee. Different cultures, different priorities." }
    ]
  },
  {
    slug: "coffee-bean-origins-guide",
    title: "Coffee Bean Origins Guide \u2014 What Every Region Actually Tastes Like",
    ogImage: "https://koffeereview.com.au/og-blog-6.png",
    description: "Ethiopian coffees are not all fruity. Brazilian coffees are not all chocolate. Here is what actually happens when you drink single origins from 8 major coffee regions.",
    date: "2026-03-21", readingTime: "9 min",
    keywords: ["coffee bean origins","single origin coffee","Ethiopian coffee","Colombian coffee","coffee regions","where coffee comes from","coffee taste guide"],
    intro: "Coffee tastes like geography. Not metaphorically. Literally. Where a bean grows, the altitude, soil, rainfall, processing, determines what you taste when you drink it.\n\nMost people do not care. They see single origin and assume it matters. It does. But not how most cafes explain it.\n\nHere is what actually happens when you drink coffee from different parts of the world.",
    sections: [
      {
        heading: "The Rule: Altitude + Processing = Flavour",
        body: "Before diving into regions, remember this.\n\nHigh altitude means more acid, more complexity. Beans grow slower at elevation, developing more sugars and acids.\n\nLow altitude means heavier, more earthy. Beans grow faster, less time to develop.\n\nWashed processing means cleaner, brighter. Water removes the fruit, so you taste the bean.\n\nNatural processing means fruitier, messier. Bean dries inside the fruit, so you taste the fruit.\n\nMost high quality coffee is high altitude plus washed. That is not a rule. That is just what works."
      },
      {
        heading: "Ethiopia \u2014 The Birthplace",
        body: "Flavour profile: fruity, floral, tea like, bright. High altitude plus washed processing plus genetic diversity. Ethiopian coffees are what coffee should taste like if you want to taste coffee, not chocolate.\n\nLight roast: blueberry, jasmine, citrus. Thin bodied. High acidity. Feels delicate. Medium roast: berries flatten out. Becomes more balanced. Still bright. Dark roast: loses all identity. Do not bother.\n\nThe catch: inconsistency. Some Ethiopian coffees are incredible. Some taste like hay. Processing standards vary wildly.\n\nBest for: people who like tea like coffee, bright acidity, complex flavour layers. Worst for: people who want chocolate, sweetness, or heavy body."
      },
      {
        heading: "Colombia \u2014 The Reliable Middle Ground",
        body: "Flavour profile: balanced, nutty, caramel, chocolate, medium body. Volcanic soil, decent altitude, consistent processing standards. Colombian coffee is engineered to be consistently good.\n\nLight roast: slight brightness, berries edge but muted. Medium roast: chocolate, caramel, almond. Balanced. Comfortable. Dark roast: rich, full bodied, slightly bitter. Works well.\n\nThe catch: balanced means boring to some people. Colombian coffee rarely surprises.\n\nBest for: people who just want good coffee without overthinking. Espresso base for lattes. Consistent cafe blends. Worst for: people who want excitement or extreme flavour profiles."
      },
      {
        heading: "Brazil \u2014 The Heavy Hitter",
        body: "Flavour profile: heavy body, low acid, chocolate, nuts, sometimes earthy. Lower altitude plus larger scale production. Brazilian farms are massive. Volume over complexity.\n\nLight roast: nutty, slightly fruity but the weight is there. Medium roast: chocolate, brown sugar, walnut. Smooth. Dense. Dark roast: bold, full bodied, almost syrupy. Harsh notes emerge.\n\nThe catch: low acidity means it tastes flat to some people. But if you like chocolate coffee, Brazil is your friend.\n\nBest for: dark roast fans, espresso drinks (milk based), people who want bold, punchy coffee. Worst for: espresso purists, people who like bright acidity."
      },
      {
        heading: "Kenya \u2014 The Hidden Gem",
        body: "Flavour profile: berry forward, wine like, balanced acidity, black tea notes. High altitude, volcanic soil, washed processing. Similar to Ethiopia but more refined and consistent.\n\nLight roast: blackcurrant, raspberry, bergamot tea. Clean. Crisp. Medium roast: berries smooth out. Red wine notes emerge. Still balanced. Dark roast: loses the brightness. Not recommended.\n\nThe catch: expensive. Quality Kenyan coffee costs more than Colombian. You taste why.\n\nBest for: people who like Ethiopian coffees but want more consistency. Espresso enthusiasts. Worst for: budget conscious people. People who want heavy body."
      },
      {
        heading: "Indonesia (Sumatra) \u2014 The Wild Card",
        body: "Flavour profile: earthy, herbal, heavy body, low acid, unusual. Wet processing in humid climate means funky fermentation means weird flavours. Sometimes brilliant, sometimes undrinkable.\n\nAny roast: damp soil, mushroom, cedar, leather. Heavy mouthfeel. Thick. Some people find this disgusting. Some find it addictive. Sumatran processing is imprecise. You are gambling.\n\nThe catch: inconsistency is extreme. One batch is great. The next batch is undrinkable.\n\nBest for: adventurous coffee drinkers, people who like heavy body, dark roast espresso. Worst for: people who want clean, predictable coffee."
      },
      {
        heading: "Central America \u2014 The Balanced Alternative",
        body: "Costa Rica, Guatemala, Honduras. Flavour profile: similar to Colombia but slightly more refined. Balanced, slightly fruity, medium body. High altitude, volcanic soil, washed processing.\n\nLight roast: stone fruit, slight brightness, clean. Medium roast: chocolate, caramel, balanced acidity. Comfortable. Dark roast: bold, smooth, not harsh.\n\nThe catch: price. Central American coffee costs more than Colombian.\n\nBest for: people who like Colombian coffee but want slightly more complexity. Worst for: budget shoppers."
      },
      {
        heading: "How To Actually Use This At A Cafe",
        body: "You are at a cafe. They have three single origins on pour over.\n\nEthiopian Yirgacheffe: pick this if you want brightness, complexity, floral notes. Accept tea like body.\n\nColombian Huila: pick this if you want comfortable, balanced, consistent. Safe choice.\n\nKenyan AA: pick this if you want Ethiopian vibes but higher consistency. Costs more.\n\nFor espresso: Colombian blend is the best baseline, works with milk. Brazilian is best for dark roast espresso, bold and punchy. Kenya is best for espresso purists who want clarity.\n\nFor home brewing pour over: Ethiopian or Kenyan because you taste everything, good or bad. Colombian because it is forgiving and hard to mess up. Central American for the sweet spot between clarity and forgiveness.",
        cta: { text: "See how we score espresso and lattes", url: "/how-we-score" }
      },
      {
        heading: "The Truth About Origins",
        body: "Single origin does not guarantee quality. An Ethiopian coffee can be 5.2 or 8.1 depending on the farm, processing, roast, and storage. A blend can be more complex and interesting than a single origin.\n\nWhat matters: the roaster knows what they are doing. Good roasters understand their origins and roast accordingly. The coffee is fresh. Beans degrade. A month old Ethiopian tastes flat. Your expectations match the origin. Ethiopian will not taste like chocolate. Brazilian will not taste like flowers.\n\nMost bad single origin experiences come from mismatched expectations, not bad coffee.",
        links: [
          { text: "Browse all 600+ cafes", url: "/" },
          { text: "See the leaderboard", url: "/leaderboard" },
          { text: "How we score", url: "/how-we-score" },
          { text: "Best coffee Brisbane", url: "/best-coffee-brisbane" },
          { text: "Must Visit cafes", url: "/must-visit-cafes" },
          { text: "Browse by roaster", url: "/roaster" },
          { text: "Explore Koffee Review", url: "/explore" }
        ]
      }
    ],
    faqs: [
      { q: "Which coffee origin tastes best?", a: "It depends on preference. Ethiopian coffee is fruity and complex. Colombian is balanced and reliable. Brazilian is heavy and chocolatey. Kenyan is berry forward with wine like acidity. There is no best origin, only what matches your taste." },
      { q: "What is single origin coffee?", a: "Single origin means the beans come from one specific farm, region, or country. It has a distinct flavour profile reflecting where it was grown. Blends combine beans from multiple origins for consistency. Neither is inherently better." },
      { q: "Why does Ethiopian coffee taste fruity?", a: "High altitude, genetic diversity, and often natural processing where the bean dries inside the fruit. This transfers fruit sugars into the bean. Light roasting preserves these fruity and floral notes." },
      { q: "What is the best coffee origin for espresso?", a: "Colombian is the safest baseline for espresso, especially with milk. Brazilian works best for dark roast espresso. Kenyan is ideal for espresso purists who want clarity and brightness in the shot." },
      { q: "Does single origin mean better quality?", a: "No. Single origin does not guarantee quality. An Ethiopian coffee can score anywhere from 5.2 to 8.1 depending on the farm, processing, and roast. A well crafted blend can be more complex than a poor single origin." }
    ]
  },
  {
    slug: "starbucks-vs-independent-brisbane",
    title: "Starbucks vs Independent Brisbane \u2014 We Reviewed Them the Same Way",
    ogImage: "https://koffeereview.com.au/og-blog-7.png",
    description: "We reviewed Starbucks the same way we review every cafe: one latte, one double shot espresso, no excuses. No frappes. No matcha. Just the coffee. Here is what the data shows.",
    date: "2026-04-04", readingTime: "7 min",
    keywords: ["starbucks brisbane","starbucks coffee quality","independent coffee brisbane","best coffee brisbane","starbucks vs local cafes","chain vs independent coffee"],
    intro: "We do not make exceptions.\n\nSame order, every time. One latte, one double shot espresso. Not a frappuccino. Not a matcha oat milk latte. Not whatever seasonal drink is on the menu. We do not care about any of that. We test the coffee.\n\nWe have reviewed independent cafes, chains, hidden laneways, and shopping malls with zero bias. When Starbucks came up, we treated it the same way.\n\nThe results were not close.",
    sections: [
      {
        heading: "The Data",
        body: "Starbucks averaged 2.7 out of 10 across every location we reviewed in Brisbane. That puts it firmly in our AVOID tier (below 4.0).\n\nFor context: <a href=\"/review/zen-barista-manly\" style=\"color:#E6C073;border-bottom:1px solid rgba(230,192,115,0.3);text-decoration:none\">Zen Barista (independent) scored 7.8</a>. <a href=\"/review/the-twin-west-end\" style=\"color:#E6C073;border-bottom:1px solid rgba(230,192,115,0.3);text-decoration:none\">The Twin (independent) scored 7.8</a>. Starbucks scored 2.7.\n\nThat is a 5.1 point gap. Not a small difference. A chasm.\n\nTo put that in perspective: Starbucks scored lower than cafes we rated NOT FOR US (4.1 to 4.9). It scored below JUST OKAY (5.1 to 5.4). It scored in a category we reserve for places where something went genuinely wrong."
      },
      {
        heading: "Why We Only Test Two Drinks",
        body: "Starbucks has a menu of 80+ drinks. Frappes. Matcha lattes. Caramel macchiatos. Oat milk this, vanilla syrup that. We do not care about any of it.\n\nWe test one latte and one double shot espresso. That is it. Every cafe, same order, no exceptions.\n\nWhy? Because those two drinks tell you everything. A latte tests milk technique: can the barista steam properly, does the microfoam integrate, is the temperature right. A double shot espresso tests the coffee itself: extraction quality, bean freshness, grind consistency, crema.\n\nIf a cafe cannot make those two drinks well, nothing else on the menu matters. A frappuccino with caramel drizzle is not coffee. It is dessert. We do not score dessert.\n\nStarbucks was judged on the same two drinks as every independent cafe in Australia. Same rules. Same standard. Same score sheet.",
        cta: { text: "See our full scoring methodology", url: "/how-we-score" }
      },
      {
        heading: "What We Actually Tasted",
        body: "We reviewed multiple Starbucks locations across Brisbane. Same order every time.\n\nThe latte: milk scorched from the steam. Eggy aftertaste that lingered. Espresso buried under volume. You are drinking hot milk with a coffee flavour somewhere in the background. Temperature inconsistent. Microfoam nonexistent. Just bubbles or flat milk depending on the barista.\n\nThe espresso: thin. Like the shot ran too fast or the machine needed cleaning. Sour notes that should not be there. Not bright acidity. Just sour. No crema. Or pale, thin crema that disappeared instantly. Finish was flat. Nothing lingered. No sweetness. Just gone.\n\nIf you ordered a coffee expecting it to taste like coffee, you would be disappointed. If you ordered expecting a caffeine delivery system, you got it. That is the split."
      },
      {
        heading: "Why This Happens",
        body: "Scale over consistency. Starbucks prioritises volume. 200 drinks before noon. The machine is running constantly. Baristas are rushed. Consistency breaks down immediately.\n\nStandardisation kills flexibility. Independent cafes adjust their grind, timing, and milk technique based on the day, the machine, the beans. Starbucks has a manual that says pull for 25 seconds. If the machine is off, it does not matter. Pull for 25 seconds anyway.\n\nBeans sit too long. Specialty coffee has a 2 to 3 week sweet spot after roasting. Starbucks beans are roasted to survive long supply chains. They taste flat by design.\n\nTraining is minimal. A barista at an independent cafe invests in their craft. They care about extraction and milk technique. A chain barista is working the register and three espresso machines simultaneously.\n\nThis is not an attack. It is just how chains work at scale. You cannot obsess over 200 drinks a day and maintain quality. You have to choose. Starbucks chose volume."
      },
      {
        heading: "The Fair Part",
        body: "Starbucks does one thing well: consistency at scale.\n\nEvery Starbucks anywhere tastes the same. That is an engineering feat. If you want to know exactly what you are getting, same mediocrity every time, Starbucks delivers.\n\nIt is also available. Convenient. Fast. If you need caffeine now and there is nothing else nearby, Starbucks works.\n\nBut if you are rating the quality of the coffee, those do not matter. A 2.7 out of 10 cafe is still a 2.7 out of 10 cafe, no matter how convenient it is."
      },
      {
        heading: "The Comparison",
        body: "Starbucks (2.7 out of 10): scorched milk, sour espresso, flat finish. Standardised but inconsistent. Scale over craft. Predictable mediocrity. AVOID tier.\n\nIndependent Brisbane cafe (7.5+): fresh beans, dialled in technique, clean extraction. Consistency that comes from care, not a manual. Craft over volume. MUST VISIT tier.\n\nThe gap is not an opinion. It is a score based on the same methodology we use for every cafe. One latte. One double shot. Same test. Same scoring. Same standard."
      },
      {
        heading: "Why This Matters",
        body: "Australia built a cafe scene on independence, craft, and consistency achieved through actual skill, not standardisation. Every dollar you spend at an independent cafe funds someone who wakes up thinking about coffee.\n\nA 7.5+ cafe costs roughly the same as a Starbucks. Both charge around $6 to $7 for a latte. You are not paying extra for better coffee. You are just getting it. That is the real story here.\n\nThis is not never go to Starbucks. If it is there and you need caffeine, go. This is: if you are comparing based on coffee quality, independent cafes in Brisbane are objectively better. Not subjectively. Objectively, by our methodology, applied consistently across 600+ reviews.",
        links: [
          { text: "Browse Brisbane's best cafes", url: "/city/brisbane" },
          { text: "Best coffee Brisbane", url: "/best-coffee-brisbane" },
          { text: "Must Visit cafes (7.5+)", url: "/must-visit-cafes" },
          { text: "Cafes to avoid", url: "/brisbane-cafes-to-avoid" },
          { text: "National leaderboard", url: "/leaderboard" },
          { text: "How we score", url: "/how-we-score" },
          { text: "Explore Koffee Review", url: "/explore" }
        ]
      }
    ],
    faqs: [
      { q: "How did Starbucks score on Koffee Review?", a: "Starbucks averaged 2.7 out of 10 across multiple Brisbane locations. That puts it in our AVOID tier (below 4.0). We tested one latte and one double shot espresso at each location, the same order we use at every cafe." },
      { q: "Is Starbucks coffee bad?", a: "By our scoring methodology, yes. Starbucks scored 2.7 out of 10 compared to an average of 6.4 for Brisbane independent cafes and 7.5+ for our Must Visit tier. The gap is 5.1 points, which is not a subjective preference but a measurable quality difference in extraction, milk technique, and bean freshness." },
      { q: "Why does Koffee Review only test lattes and espressos?", a: "One latte tests milk technique. One double shot espresso tests the coffee itself. If a cafe cannot make these two foundational drinks well, nothing else on the menu matters. We do not test frappes, matcha lattes, or flavoured drinks because those mask the actual coffee quality." },
      { q: "Are independent cafes in Brisbane better than chains?", a: "Based on 600+ reviews using the same standardised test, independent Brisbane cafes average significantly higher than chains. 21 independent cafes scored 7.5+ (Must Visit tier). No chain location has scored above 5.0 in our system." },
      { q: "Does a good independent cafe cost more than Starbucks?", a: "No. A latte at most Brisbane independent cafes costs $6 to $6.50, roughly the same as Starbucks. You are not paying extra for better coffee. The quality difference comes from craft, fresh beans, and barista skill, not price." }
    ]
  },
  {
    slug: "what-makes-good-coffee",
    title: "What Makes Good Coffee \u2014 The Complete Guide",
    ogImage: "https://koffeereview.com.au/og-blog-8.png",
    description: "What actually separates good coffee from mediocre. Based on 600+ cafe reviews and a simple methodology: fresh beans, proper extraction, and milk execution. Three rules. That is it.",
    date: "2026-04-18", readingTime: "10 min",
    keywords: ["what makes good coffee","how to choose good coffee","quality coffee","specialty coffee","good coffee taste","coffee quality","how to find good coffee"],
    intro: "Most people cannot define good coffee. They know it when they taste it, but they cannot say why.\n\nAfter 600+ cafe reviews across Australia, same order every time, no exceptions, we can tell you exactly what separates a 7.5 cafe from a 5.2.\n\nIt is not subjective. It is not about your personal preference. It is measurable.\n\nHere is what makes coffee good, and how to spot it every single time.",
    sections: [
      {
        heading: "The Three Rules",
        body: "Good coffee comes down to three things. That is it.\n\nRule 1: Fresh beans. Coffee is fruit. It has a lifespan. Beans peak 2 to 3 weeks after roasting. After a month, they start degrading. After 3 months, they are stale. Stale beans taste flat. No matter how well you pull the shot, you cannot fix degraded beans. Good cafes rotate their beans weekly. They know the roast date. They pull old stock and replace it. How to spot this: ask the cafe when the beans were roasted. If they do not know, they are not paying attention. If it is older than 3 weeks, the coffee will taste hollow.\n\nRule 2: Proper extraction. Extraction is the skill part. The barista pulls hot water through grounds. Under extraction means the shot runs too fast. You get sour, thin, weak coffee. Over extraction means the shot runs too slow. You get bitter, harsh, unpleasant coffee. Proper extraction takes 25 to 30 seconds for espresso. The shot should look honey coloured with thick crema. How to spot this: look at the crema. Thick, golden crema means proper extraction. Thin, pale, or missing crema means the shot ran too fast or the machine needs cleaning.\n\nRule 3: Milk execution (if you are ordering milk coffee). If you are getting a latte or flat white, milk is 60 to 70 percent of the drink. Proper milk means microfoam texture (silky, glossy, integrated), temperature around 65 degrees (hot, not scalding), and espresso to milk ratio that lets you taste both. How to spot this: if the milk tastes eggy or burnt, the barista steamed it too hot. If it is bubbly, they introduced too much air. If you cannot taste the espresso, there is too much milk.",
        cta: { text: "See how we score these three rules", url: "/how-we-score" }
      },
      {
        heading: "What Our 600+ Reviews Show",
        body: "We have tested 600+ cafes with the same order: one latte, one double shot espresso. Here is the breakdown.\n\nCafes scoring 7.5+ (MUST VISIT): fresh beans roasted within 2 weeks and rotated monthly. Consistent extraction with crema present, colour right, timing right. Proper milk technique with silky texture, right temperature, balanced ratio. All three rules nailed.\n\nCafes scoring 6.5 to 7.4 (SOLID to DECENT): usually 2 out of 3 nailed. One is weak. Example: fresh beans plus good extraction, but milk temperature off. Example: great milk work, but beans are a week past peak.\n\nCafes scoring 5.5 to 6.4 (AVERAGE to TAKE OR LEAVE): at least one fundamental failing. Often the beans are past peak and extraction is inconsistent.\n\nCafes scoring below 5.0 (NOT FOR US to AVOID): multiple rules failing. Often stale beans plus over extraction plus scorched milk. All three gone wrong.\n\nThe data is consistent across 600+ reviews. These three things matter. Nothing else moves the needle.",
        links: [
          { text: "See the full leaderboard", url: "/leaderboard" },
          { text: "Must Visit cafes (7.5+)", url: "/must-visit-cafes" }
        ]
      },
      {
        heading: "Four Signs You Are in a Good Cafe",
        body: "Before you order, you can already predict whether the coffee will be good.\n\nSign 1: they know their beans. The cafe has information showing bean origin (Ethiopian, Colombian, Kenyan), roast date (not roast style, actual date), and roaster name. If they cannot answer these questions, the beans were bought as a commodity. That is a red flag. Good cafes like <a href=\"/review/zen-barista-manly\" style=\"color:#E6C073;border-bottom:1px solid rgba(230,192,115,0.3);text-decoration:none\">Zen Barista (7.8)</a> and <a href=\"/review/the-twin-west-end\" style=\"color:#E6C073;border-bottom:1px solid rgba(230,192,115,0.3);text-decoration:none\">The Twin (7.8)</a> have visible, current bean information.\n\nSign 2: the espresso machine looks maintained. Look at the group head. Is it clean? Does the barista purge before pulling a shot? A clean machine means someone cares about consistency.\n\nSign 3: they steam milk properly. Watch the barista. Do they submerge the wand at the beginning (introduces air), then dunk deeper (integrates foam), then pull out before the end (prevents overheating)? If yes to all three: silky milk.\n\nSign 4: they dial in. Good baristas pull a test shot, taste it, then adjust the grind if needed. This takes 30 seconds. It is the difference between 7.5 and 6.5.",
        links: [
          { text: "Browse by roaster", url: "/roaster" },
          { text: "Coffee terminology explained", url: "/blog/coffee-terminology-explained" }
        ]
      },
      {
        heading: "The Quality Spectrum",
        body: "Here is how to read a cafe score and know what you are getting.\n\n9.1+ ELITE: all three rules nailed, plus exceptional technique. Memorable. Worth a drive across the city.\n\n8.1 to 8.9 GREAT: all three rules nailed consistently. Reliable. Go out of your way.\n\n7.5 to 7.9 MUST VISIT: all three rules nailed, maybe one minor slip. Good taste, worth visiting, repeatable. This is the sticker threshold.\n\n7.1 to 7.4 SOLID: two rules nailed, one average. No complaints, fine for your routine.\n\n6.5 to 6.9 DECENT: one rule nailed, others average. Forgettable, better options likely nearby.\n\n6.1 to 6.4 TAKE OR LEAVE: at least one rule failing noticeably. Not bad enough to avoid but not good enough to recommend.\n\n5.5 to 5.9 AVERAGE: forgettable coffee. Does the job without impressing.\n\n5.1 to 5.4 JUST OKAY: below average. You will wish you went somewhere else.\n\n4.1 to 4.9 NOT FOR US: skip it. Multiple rules failing.\n\nBelow 4.0 AVOID: bad coffee. Do not waste money.",
        cta: { text: "Full scoring methodology", url: "/how-we-score" }
      },
      {
        heading: "Why Specialty Coffee Matters (And When It Does Not)",
        body: "Specialty coffee is a real term. It means beans scored 80+ on the Specialty Coffee Association scale, traceable origin (single farm, single lot), and intentional roasting.\n\nSpecialty beans cost more. They are worth it if the cafe knows how to extract them (most do not) and you can taste the difference (you can, if the barista does not bury it under bad technique).\n\nBut a cafe serving commodity beans with perfect technique will outscore a cafe serving specialty beans with mediocre technique. We have seen this repeatedly in our reviews.\n\nSpecialty is the ceiling. Technique is the floor. You need both.",
        links: [
          { text: "Coffee bean origins guide", url: "/blog/coffee-bean-origins-guide" },
          { text: "Browse cafes by roaster", url: "/roaster" }
        ]
      },
      {
        heading: "The Three Tests (Try This Next Time)",
        body: "Walk into a cafe. Run these tests.\n\nTest 1: the crema test. Order an espresso. Look at the crema. Thick and golden? Score probably 7+. Thin or pale? Probably below 6.\n\nTest 2: the milk test. Order a latte. Taste the milk first (just milk). Does it taste like milk, or does it taste burnt or eggy? Burnt means the score is probably 6 or below.\n\nTest 3: the finish test. Finish your coffee. Does the taste linger pleasantly, or does it disappear? Good coffee lingers. Bad coffee vanishes. If nothing stays on your palate, the beans were stale or the extraction was wrong.\n\nThese three tests take seconds. They tell you everything.",
        cta: { text: "Read our full coffee guide", url: "/coffee-guide" }
      },
      {
        heading: "The Bottom Line",
        body: "Good coffee is simple. Three things: fresh beans, proper extraction, milk execution (if applicable).\n\nMaster those three and you can walk into any cafe in Australia and predict the score before you order.\n\nBecause coffee quality is not mysterious. It is measurable. And once you know what to measure, you know exactly what you are paying for.\n\nOne latte. One double shot. Every time. No exceptions.",
        links: [
          { text: "Browse all 600+ cafes", url: "/" },
          { text: "Must Visit cafes (7.5+)", url: "/must-visit-cafes" },
          { text: "Best coffee Brisbane", url: "/best-coffee-brisbane" },
          { text: "Best value coffee", url: "/best-value-brisbane" },
          { text: "Coffee terminology explained", url: "/blog/coffee-terminology-explained" },
          { text: "Coffee bean origins guide", url: "/blog/coffee-bean-origins-guide" },
          { text: "How we score", url: "/how-we-score" },
          { text: "Explore Koffee Review", url: "/explore" }
        ]
      }
    ],
    faqs: [
      { q: "What makes coffee good?", a: "Three things: fresh beans (roasted within 2 to 3 weeks), proper extraction (25 to 30 seconds, thick golden crema), and milk execution (silky microfoam, right temperature, balanced ratio). Based on 600+ cafe reviews, these three factors predict the score every time." },
      { q: "How can I tell if a cafe makes good coffee?", a: "Four signs: they display bean origin and roast date, the espresso machine is clean, the barista steams milk with technique (not just blasting steam), and they taste test shots before serving. You can spot all four before you even order." },
      { q: "What score means good coffee on Koffee Review?", a: "7.5 or above is our Must Visit tier. These cafes nail all three rules: fresh beans, proper extraction, and milk execution. 8.1+ is Great. 9.1+ is Elite. Below 5.5 is Average or worse." },
      { q: "Does specialty coffee mean better coffee?", a: "Not always. Specialty beans (scored 80+ by the SCA) have higher potential, but a cafe serving commodity beans with perfect technique will outscore a cafe serving specialty beans with mediocre technique. Specialty is the ceiling. Technique is the floor." },
      { q: "Why does Koffee Review only test lattes and espressos?", a: "A latte tests milk technique. A double shot espresso tests the coffee itself. If a cafe cannot make these two foundational drinks well, nothing else on the menu matters. Same order, every cafe, 600+ reviews." }
    ]
  },
  {
    slug: "science-behind-every-score",
    title: "The Science Behind Every Score \u2014 What Separates a 2.1 from a 7.8",
    ogImage: "https://koffeereview.com.au/og-blog-9.png",
    description: "After 600+ cafe reviews, here is exactly what makes good coffee and why most cafes get it wrong. Four pillars: bean quality, extraction, milk work, and consistency.",
    date: "2026-05-02", readingTime: "8 min",
    keywords: ["what makes good coffee","good coffee vs bad coffee","coffee quality","espresso extraction","milk texture coffee","best coffee brisbane","coffee scoring"],
    intro: "We have reviewed 600+ cafes across Australia.\n\nSame order every time. One latte. One double shot espresso. One score.\n\nAfter that many cups, patterns emerge. The difference between a 2.1 and a 7.8 is not random. It is not subjective. It is not vibes. It comes down to four things, and most cafes fail at least one.\n\nHere is what separates good coffee from everything else.",
    sections: [
      {
        heading: "Pillar 1: Bean Quality",
        body: "This is the foundation. Bad beans cannot be rescued by good technique. Good beans can be ruined by bad technique.\n\nFreshness is everything. Coffee beans peak 7 to 21 days after roasting. After 30 days, they are declining. After 60, they are furniture.\n\nStale beans taste flat. No complexity, no sweetness, no life. You sip and nothing happens. The cup just exists. That is what happened at <a href=\"/review/harvest-cafe-and-sweets-brisbane-airport\" style=\"color:#E6C073;border-bottom:1px solid rgba(230,192,115,0.3);text-decoration:none\">Harvest Cafe DFO Brisbane (3.1)</a>. Tasted like caffeine, not coffee.\n\nFresh beans taste alive. There is movement in the cup. Acidity, sweetness, body. The flavour develops as you drink. That is what <a href=\"/review/bru-cru-coffee-kenmore\" style=\"color:#E6C073;border-bottom:1px solid rgba(230,192,115,0.3);text-decoration:none\">Bru Cru Kenmore (7.5)</a> delivers with the Wolff Hero Blend. Hits strong from the first sip and never lets up.\n\nThe roaster matters. Cafes using quality roasters start with an advantage. We have seen Clandestino, Bear Bones, DIBS, Cavalier, and Axil all produce cups scoring 7.0+. But even premium beans fail when extraction goes wrong. <a href=\"/review/fave-specialty-coffee-fortitude-valley\" style=\"color:#E6C073;border-bottom:1px solid rgba(230,192,115,0.3);text-decoration:none\">Fave Specialty Coffee Fortitude Valley (6.4)</a> used Axil's Heavyweight Blend promising dark chocolate and toffee, but the body dropped off before it got there. The beans had potential. The execution did not deliver.",
        links: [
          { text: "Browse cafes by roaster", url: "/roaster" }
        ]
      },
      {
        heading: "Pillar 2: Extraction",
        body: "Extraction is what happens when hot water meets ground coffee under pressure. Too fast, too slow, too hot, too cold. Each produces a different defect.\n\nPerfect extraction takes 25 to 30 seconds for a single shot. The espresso flows like warm honey, starting dark and finishing golden. The result is balanced. Sweet, slightly bitter, with clean acidity.\n\nUnder extraction (shot too fast, under 20 seconds): the water has not pulled enough from the beans. Tastes sour, thin, watery. That is what happened at <a href=\"/review/tribe-coffee-company-ascot\" style=\"color:#E6C073;border-bottom:1px solid rgba(230,192,115,0.3);text-decoration:none\">Tribe Coffee Company Ascot (5.2)</a>. Off from the first sip, same flat note all the way through.\n\nOver extraction (shot too slow, over 35 seconds): the water has pulled too much. Tastes harsh, bitter, burnt. The finish is unpleasant.\n\nHow to spot it: thick golden crema means proper extraction. Thin pale crema means under extracted. Dark burnt crema means over extracted. No crema means something went very wrong.\n\nOur highest scoring cafes nail extraction consistently. <a href=\"/review/coffee-speed-dial-newstead\" style=\"color:#E6C073;border-bottom:1px solid rgba(230,192,115,0.3);text-decoration:none\">Speed Dial Newstead (7.6)</a> pulls shots with precision. The crema is textbook, the balance is there every time. <a href=\"/review/clancys-espresso-norman-park\" style=\"color:#E6C073;border-bottom:1px solid rgba(230,192,115,0.3);text-decoration:none\">Clancy Coffee Norman Park (7.9)</a> takes it further. Punchy start, smooth body, lingering finish. That is what dialled in extraction looks like.",
        cta: { text: "How we score extraction", url: "/how-we-score" }
      },
      {
        heading: "Pillar 3: Milk Work",
        body: "For milk based drinks, this is where most cafes fail. You can have perfect beans and perfect extraction, but if the milk is scorched, the latte scores 5.\n\nProper steaming heats milk to 60 to 65 degrees while creating microfoam. Tiny, invisible bubbles that make the texture silky and glossy. The milk should taste sweet and creamy.\n\nScorched milk is the most common defect we encounter. The barista steams above 70 degrees. The milk proteins break down. It tastes eggy, burnt, harsh. <a href=\"/review/honey-cafe-restaurant-stafford\" style=\"color:#E6C073;border-bottom:1px solid rgba(230,192,115,0.3);text-decoration:none\">Honey Cafe Stafford (2.1)</a> served coffee so hot it was undrinkable. <a href=\"/review/107-coffee-terminal-sabroso-browns-plains\" style=\"color:#E6C073;border-bottom:1px solid rgba(230,192,115,0.3);text-decoration:none\">107 Coffee Terminal Browns Plains (3.9)</a>. Milk scorched from the jump, latte never recovered.\n\nThe ratio test: a proper latte should taste like both espresso AND milk. Balanced. If you can only taste milk, the espresso is buried. <a href=\"/review/coffeeish-south-brisbane\" style=\"color:#E6C073;border-bottom:1px solid rgba(230,192,115,0.3);text-decoration:none\">CoffeeIsh South Bank (7.8)</a> gets this right. The flavour hits the upper palate and does not leave. You taste the coffee through the milk, not despite it.",
        links: [
          { text: "Coffee terminology explained", url: "/blog/coffee-terminology-explained" }
        ]
      },
      {
        heading: "Pillar 4: Consistency",
        body: "This is the invisible pillar. A cafe can nail one cup and fail the next. That is not good coffee. That is luck.\n\nGood coffee is repeatable. The same barista, the same beans, the same extraction, the same milk work. Every time.\n\n<a href=\"/review/freddies-ascot\" style=\"color:#E6C073;border-bottom:1px solid rgba(230,192,115,0.3);text-decoration:none\">Freddies Ascot (7.7)</a>. Bear Bones dialled in perfectly. Bold from the jump, smooth full body. The kind of cup that feels deliberate, not accidental.\n\n<a href=\"/review/blackout-paddington-paddington\" style=\"color:#E6C073;border-bottom:1px solid rgba(230,192,115,0.3);text-decoration:none\">Blackout Paddington (7.5)</a>. A hole in the wall that produces silky, smooth coffee with DIBS beans. Every element controlled. Nothing left to chance.\n\nThat is the standard. That is what consistency looks like."
      },
      {
        heading: "How the Pillars Map to Scores",
        body: "9.1+ ELITE: all four pillars perfect. Fresh premium beans, dialled extraction, flawless milk, proven consistency. Rare.\n\n8.1 to 8.9 GREAT: all four pillars strong. Maybe one very minor weakness that does not affect the overall experience.\n\n7.5 to 7.9 MUST VISIT: three pillars strong, one acceptable. The cup is enjoyable, worth travelling for. Most of Brisbane's best neighbourhood cafes sit here.\n\n7.1 to 7.4 SOLID: two pillars strong, one or two average. No complaints.\n\n6.5 to 6.9 DECENT: one pillar nailed, others average. Drinkable but forgettable. <a href=\"/review/told-you-so-north-lakes\" style=\"color:#E6C073;border-bottom:1px solid rgba(230,192,115,0.3);text-decoration:none\">Told You So North Lakes (6.5)</a>. Started as a 7, finished as a 5.\n\n6.1 to 6.4 TAKE OR LEAVE: at least one pillar failing noticeably.\n\n5.5 to 5.9 AVERAGE: one pillar acceptable, rest weak. <a href=\"/review/holmes-st-cafe-north-ipswich\" style=\"color:#E6C073;border-bottom:1px solid rgba(230,192,115,0.3);text-decoration:none\">Holmes St Cafe Ipswich (5.7)</a>. True Grit beans had potential, extraction did not deliver.\n\n5.1 to 5.4 JUST OKAY: below average across the board.\n\n4.1 to 4.9 NOT FOR US: multiple pillars failed.\n\nBelow 4.0 AVOID: everything went wrong. <a href=\"/review/stellarossa-forest-lake-forest-lake\" style=\"color:#E6C073;border-bottom:1px solid rgba(230,192,115,0.3);text-decoration:none\">Stellarossa Forest Lake (1.1)</a>. Stale, bitter, milk was off. The worst we have ever scored.",
        cta: { text: "Full scoring methodology", url: "/how-we-score" }
      },
      {
        heading: "What You Can Do",
        body: "Next time you are at a cafe, run through the pillars.\n\nBeans: does the coffee taste alive or flat?\n\nExtraction: is the crema golden or pale? Is the taste balanced or sour or bitter?\n\nMilk: is it silky or scorched? Can you taste the espresso through the milk?\n\nConsistency: would you bet money the next cup tastes the same?\n\nScore it yourself. Then check our review and see if your palate matches ours. After 10 cafes, you will know exactly what makes good coffee. After 50, you will taste it before the cup hits your lips.",
        links: [
          { text: "Browse all 600+ cafes", url: "/" },
          { text: "National leaderboard", url: "/leaderboard" },
          { text: "Must Visit cafes (7.5+)", url: "/must-visit-cafes" },
          { text: "Coffee guide", url: "/coffee-guide" },
          { text: "How we score", url: "/how-we-score" },
          { text: "Explore", url: "/explore" }
        ]
      }
    ],
    faqs: [
      { q: "What makes good coffee according to Koffee Review?", a: "Four pillars: fresh beans (roasted within 7 to 21 days), proper extraction (25 to 30 seconds with golden crema), correct milk work (silky microfoam at 60 to 65 degrees), and consistency (repeatable quality every visit). Based on 600+ reviews." },
      { q: "Why do some cafes score below 3.0?", a: "Multiple pillars failing simultaneously. Stale beans plus over extraction plus scorched milk. Our lowest score (1.1) had all three gone wrong. These are cafes where nobody is tasting the product before serving it." },
      { q: "What is the most common coffee defect?", a: "Scorched milk. Baristas steaming above 70 degrees Celsius, breaking down milk proteins, creating an eggy burnt taste. This single defect can drop a score from 7.0 to 5.0 even when everything else is right." },
      { q: "Does the roaster affect cafe scores?", a: "Yes. Cafes using quality roasters like Clandestino, Bear Bones, DIBS, and Axil consistently score higher. But premium beans with bad extraction still fail. The roaster provides the ceiling. Technique provides the floor." }
    ]
  },
  {
    slug: "chain-vs-independent-coffee",
    title: "Chain vs Independent \u2014 Do Big Names Actually Make Better Coffee?",
    ogImage: "https://koffeereview.com.au/og-blog-10.png",
    description: "We have reviewed Stellarossa, Hudson Coffee, and dozens of chains alongside 600+ independents. Same order, same scoring. The data is clear and it is not close.",
    date: "2026-05-16", readingTime: "7 min",
    keywords: ["chain coffee vs independent","best coffee australia","stellarossa review","independent cafes brisbane","best cafes brisbane","chain cafe review"],
    intro: "We have reviewed 600+ cafes across Australia.\n\nSome are chains with hundreds of locations. Some are hole in the wall independents with one espresso machine and a dream. We order the same thing at every single one. One latte, one double shot espresso. Score purely on taste.\n\nNo loyalty. No bias. No freebies. Just the cup.\n\nAfter 600+ reviews, the data is clear. And it is not close.",
    sections: [
      {
        heading: "The Numbers",
        body: "Average chain score: 4.2 out of 10.\n\nAverage independent score: 6.8 out of 10.\n\nThat is not a gap. That is a canyon.\n\nOur worst ever score, a 1.1, belongs to <a href=\"/review/stellarossa-forest-lake-forest-lake\" style=\"color:#E6C073;border-bottom:1px solid rgba(230,192,115,0.3);text-decoration:none\">Stellarossa Forest Lake</a>. A chain. Stale, bitter, and the milk was off. Three problems, zero excuses.\n\nOur highest scoring cafes? All independents. Every single one.",
        links: [
          { text: "Cafes to avoid Brisbane", url: "/brisbane-cafes-to-avoid" },
          { text: "Must Visit cafes", url: "/must-visit-cafes" }
        ]
      },
      {
        heading: "Why Chains Struggle",
        body: "It is not that chains cannot make good coffee. It is that their business model works against it.\n\nProblem 1: Bean compromise. Chains buy beans in bulk. Massive volume distributed across dozens of locations. Beans sit in warehouses longer, freshness declines. Roast profiles are generic, designed for consistency across locations, not quality at any single one. An independent cafe can buy 10kg of premium single origin from a local roaster, dial it in that morning, and serve it at peak freshness. A chain is serving beans roasted weeks ago in a central facility.\n\nProblem 2: Staff training. Independent cafes are usually run by people who care about coffee. The owner is often the barista. They have invested their own money and their reputation is on the line. Chain baristas are employees following a procedure. The system rewards speed, not excellence. That is how you get scorched milk at <a href=\"/review/hudsons-coffee-brisbane-int-airport\" style=\"color:#E6C073;border-bottom:1px solid rgba(230,192,115,0.3);text-decoration:none\">Hudson Coffee Brisbane Airport (2.1)</a>. Watery and bitter. Nobody tasted that cup before it went out.\n\nProblem 3: Machine maintenance. Espresso machines need daily cleaning. Independent cafes with one machine clean it religiously. Chains with high volume and multiple machines defer maintenance. Grinders drift. Group heads clog. The coffee tastes metallic.\n\nProblem 4: Volume over quality. A busy chain serves 300 to 500 coffees per day. An independent serves 80 to 150. At 500 cups, everything is optimised for speed, and every optimisation costs quality. At 80 cups, each order gets attention."
      },
      {
        heading: "The Exceptions",
        body: "Not every chain is terrible. Not every independent is good.\n\nSome franchise models use quality roasters and give individual locations more control. When the owner actually cares, you can taste it. These locations score 5.5 to 6.5. Not great, but not embarrassing. The problem is inconsistency across locations. The same chain can score 6.5 at one spot and 3.1 at another. <a href=\"/review/107-coffee-terminal-sabroso-browns-plains\" style=\"color:#E6C073;border-bottom:1px solid rgba(230,192,115,0.3);text-decoration:none\">107 Coffee Terminal Browns Plains (3.9)</a>. Milk scorched from the jump.\n\nIndependents that disappointed us: having your own cafe does not guarantee good coffee. <a href=\"/review/bonsai-botanika-cbd\" style=\"color:#E6C073;border-bottom:1px solid rgba(230,192,115,0.3);text-decoration:none\">Bonsai Botanika Brisbane City (3.4)</a> is a matcha bar pretending to do coffee. Expensive, milky, and a 3.4. <a href=\"/review/vandough-browns-plains-browns-plains\" style=\"color:#E6C073;border-bottom:1px solid rgba(230,192,115,0.3);text-decoration:none\">Van Dough Browns Plains (3.1)</a>. A bakery that also does coffee. Burnt from the start. Stick to the doughnuts.\n\nBeing independent gives you the potential for great coffee. It does not guarantee it."
      },
      {
        heading: "What the Best Independents Do Differently",
        body: "After scoring hundreds of independents between 7.0 and 7.9, patterns emerge.\n\nThey partner with quality roasters. <a href=\"/review/coffee-speed-dial-newstead\" style=\"color:#E6C073;border-bottom:1px solid rgba(230,192,115,0.3);text-decoration:none\">Speed Dial Newstead (7.6)</a>. Precision extraction, textbook crema, clean finish. <a href=\"/review/embargos-on-chapel-nundah\" style=\"color:#E6C073;border-bottom:1px solid rgba(230,192,115,0.3);text-decoration:none\">Embargos On Chapel Nundah (7.5)</a>. Brisbane's first Clandestino coffee house. Magneto Blend doing exactly what it is built for. <a href=\"/review/blackout-paddington-paddington\" style=\"color:#E6C073;border-bottom:1px solid rgba(230,192,115,0.3);text-decoration:none\">Blackout Paddington (7.5)</a>. DIBS Coffee dialled in perfectly.\n\nThey taste their own coffee. Most cafes never taste their own product. The best independents taste constantly. <a href=\"/review/clancys-espresso-norman-park\" style=\"color:#E6C073;border-bottom:1px solid rgba(230,192,115,0.3);text-decoration:none\">Clancy Coffee Norman Park (7.9)</a>. Punchy start, smooth body, lingering finish. That consistency does not happen by accident. <a href=\"/review/freddies-ascot\" style=\"color:#E6C073;border-bottom:1px solid rgba(230,192,115,0.3);text-decoration:none\">Freddies Ascot (7.7)</a>. Bear Bones dialled in perfectly. Bold from the jump.\n\nThey keep it simple. <a href=\"/review/the-boys-house-of-coffee-kelvin-grove\" style=\"color:#E6C073;border-bottom:1px solid rgba(230,192,115,0.3);text-decoration:none\">The Boys House of Coffee Kelvin Grove (7.1)</a>. No frills, no nonsense. Just a confident cup. <a href=\"/review/five-sisters-cafe-and-bar-south-brisbane\" style=\"color:#E6C073;border-bottom:1px solid rgba(230,192,115,0.3);text-decoration:none\">Five Sisters South Brisbane (7.2)</a>. Punchy, chocolatey, clean. When a cafe focuses on coffee instead of a menu of 40 items, the quality goes up. Every time.",
        links: [
          { text: "Browse cafes by roaster", url: "/roaster" },
          { text: "Best coffee Brisbane", url: "/best-coffee-brisbane" }
        ]
      },
      {
        heading: "The Suburb Factor",
        body: "Location affects chain density. Shopping centres are dominated by chains. High streets are dominated by independents.\n\nThat is why airport coffee is consistently terrible. <a href=\"/review/hudsons-coffee-brisbane-int-airport\" style=\"color:#E6C073;border-bottom:1px solid rgba(230,192,115,0.3);text-decoration:none\">Hudson Coffee Brisbane Airport (2.1)</a>. That is why DFO coffee disappoints. <a href=\"/review/harvest-cafe-and-sweets-brisbane-airport\" style=\"color:#E6C073;border-bottom:1px solid rgba(230,192,115,0.3);text-decoration:none\">Harvest Cafe DFO Brisbane (3.1)</a>. Captive audiences do not demand quality. The cafe has no competition. The coffee reflects that.\n\nMeanwhile, suburbs like West End, Paddington, South Brisbane, and Newstead have multiple quality independents within walking distance. Competition drives standards up. If your coffee is not good, the cafe next door will take your customers.\n\nThat competitive pressure is the single biggest predictor of coffee quality in a suburb.",
        links: [
          { text: "Best coffee by suburb", url: "/explore" },
          { text: "Hidden gem cafes", url: "/hidden-gem-cafes-brisbane" }
        ]
      },
      {
        heading: "The Bottom Line",
        body: "Chains optimise for scale. Independents optimise for quality. The scores reflect that.\n\nOut of 600+ reviews, the pattern is consistent. The best coffee in Australia comes from independent cafes using quality roasters, pulling fresh shots, steaming milk properly, and caring about every cup.\n\nNo shortcuts. No exceptions. No freebies.\n\nIf you are choosing between a chain and an independent: walk past the chain. Find the independent. The data says you will get a better cup almost every time.",
        links: [
          { text: "Browse all 600+ cafes", url: "/" },
          { text: "National leaderboard", url: "/leaderboard" },
          { text: "Must Visit cafes (7.5+)", url: "/must-visit-cafes" },
          { text: "Cafes to avoid", url: "/brisbane-cafes-to-avoid" },
          { text: "Best value coffee", url: "/best-value-brisbane" },
          { text: "Explore Koffee Review", url: "/explore" }
        ]
      }
    ],
    faqs: [
      { q: "Are chain cafes worse than independent cafes?", a: "Based on 600+ reviews using the same methodology, chain cafes average 4.2 out of 10 compared to 6.8 for independents. Our worst score (1.1) belongs to a chain. All our highest scoring cafes are independents." },
      { q: "Why is airport coffee so bad?", a: "No competition. Airport cafes have captive audiences who need caffeine and have no alternatives. Without competitive pressure, there is no incentive to maintain quality. Hudson Coffee Brisbane Airport scored 2.1 in our review." },
      { q: "Are there any good chain cafes?", a: "Some franchise locations where the owner genuinely cares about coffee can score 5.5 to 6.5. But consistency across locations is the problem. The same chain can score 6.5 at one spot and 3.1 at another." },
      { q: "What makes independent cafes better?", a: "Three things: fresher beans (bought in small batches from local roasters), more skilled baristas (often the owner), and competitive pressure (if your coffee is bad, the indie next door takes your customers). Chains cannot replicate this model at scale." }
    ]
  },
  {
    slug: "australias-coffee-ranking",
    title: "Australia\u2019s Coffee Ranking \u2014 Where We Stand Globally",
    ogImage: "https://koffeereview.com.au/og-blog-11.png",
    description: "Is Australian coffee the best in the world? We have reviewed 600+ cafes across Australia and tested international standards. Here is where Australia actually ranks and how we score it.",
    date: "2026-05-30", readingTime: "10 min",
    keywords: ["australian coffee","best coffee australia","australia coffee quality","australian coffee culture","is australian coffee good","australia vs world coffee"],
    intro: "Australia has a coffee reputation. Flat whites, microfoam, cafe culture. The internet says Australian coffee is world class. But is it? And how do we actually know?\n\nWe have reviewed 600+ cafes across Brisbane, Melbourne, Gold Coast, and regional areas. We have also tasted coffee in Barcelona. We used the same methodology everywhere. One latte, one double shot espresso, every time.\n\nHere is what the data actually shows.",
    sections: [
      {
        heading: "The Short Answer",
        body: "Australian coffee is good, but not the best in the world.\n\nAustralian top tier cafes (7.5+) match European standards. Australian mid tier cafes (6.5 to 7.4) are better than most American chains. Australian low tier cafes (below 5.5) exist everywhere.\n\nAustralia's advantage is consistency and availability. You are more likely to get a 7.0+ coffee in Brisbane than in most US cities. You are less likely to get a world class 8.5+ coffee than in Barcelona or Melbourne's absolute best."
      },
      {
        heading: "How We Rate Every Cafe",
        body: "We do not guess. We use a locked system.\n\nEvery cafe, same order: one double shot espresso (tests extraction quality, crema, bean freshness, finish) and one latte (tests milk technique, espresso to milk ratio, temperature, texture).\n\nThe espresso tells us if the cafe knows coffee. The latte tells us if the cafe has technique. Together they give us a complete picture.\n\nWe do not break scores into weighted percentages. We do not use a rubric with point allocations. We taste both drinks, assess the four pillars (bean quality, extraction, milk work, consistency), and give a single overall score out of 10.\n\nA 7.5 in Brisbane means the same thing as a 7.5 in Barcelona. No country adjustment. No grading on a curve. Just the coffee.",
        cta: { text: "Full scoring methodology", url: "/how-we-score" }
      },
      {
        heading: "Australia's Scoring Distribution",
        body: "Here is what 600+ reviews show.\n\n9.1+ ELITE: 0% of Australian cafes. None found yet. This tier exists for exceptional coffee that is flawless in every dimension.\n\n8.1 to 8.9 GREAT: under 1%. A handful of cafes, mostly in our international reviews (Barcelona). Australian cafes are approaching this tier but have not broken through consistently.\n\n7.5 to 7.9 MUST VISIT: about 4%. These are the 23+ cafes that earned our sticker. Worth going out of your way for. Genuinely good coffee.\n\n7.1 to 7.4 SOLID: about 4%. Good, repeatable, no complaints.\n\n6.5 to 6.9 DECENT: about 8%. Acceptable on a good day. Better options likely nearby.\n\n6.1 to 6.4 TAKE OR LEAVE: about 7%. Not bad enough to avoid but not good enough to recommend.\n\n5.5 to 5.9 AVERAGE: forgettable coffee.\n\n5.1 to 5.4 JUST OKAY: below average.\n\n4.1 to 4.9 NOT FOR US: skip it.\n\nBelow 4.0 AVOID: multiple things went wrong.\n\nKey insight: about 15% of Australian cafes score 7.0+. If you walk into a random Australian cafe, you have roughly a 50/50 chance of getting decent coffee. The other half is mediocre or worse. That is why we exist. To tell you which half you are walking into.",
        links: [
          { text: "See the full leaderboard", url: "/leaderboard" },
          { text: "Must Visit cafes (7.5+)", url: "/must-visit-cafes" }
        ]
      },
      {
        heading: "Brisbane vs Gold Coast vs Melbourne",
        body: "Brisbane (261+ cafes reviewed, avg 6.4): the most accessible coffee scene in Australia. Consistent, good value, growing fast. Top cafes: <a href=\"/review/zen-barista-manly\" style=\"color:#E6C073;border-bottom:1px solid rgba(230,192,115,0.3);text-decoration:none\">Zen Barista Manly (7.8)</a>, <a href=\"/review/the-twin-west-end\" style=\"color:#E6C073;border-bottom:1px solid rgba(230,192,115,0.3);text-decoration:none\">The Twin West End (7.8)</a>. Best suburbs: West End, Newstead, Manly. Good coffee for $6 to $6.50.\n\nGold Coast (80+ cafes reviewed, avg 6.2): more inconsistent than Brisbane. Tourist pressure means many cafes coast on location. But the top end matches Brisbane. Top cafes: <a href=\"/review/next-door-burleigh-burleigh-heads\" style=\"color:#E6C073;border-bottom:1px solid rgba(230,192,115,0.3);text-decoration:none\">Next Door Burleigh (7.8)</a>, <a href=\"/review/silipo-coffee-southport\" style=\"color:#E6C073;border-bottom:1px solid rgba(230,192,115,0.3);text-decoration:none\">Silipo Coffee Southport (7.8)</a>. Best suburbs: Burleigh Heads, Currumbin.\n\nMelbourne (growing coverage): higher standards across the board. More competition, deeper talent pool. The traditional coffee capital. Our Melbourne coverage is expanding with every trip.\n\nVerdict: Brisbane wins on value and depth. Gold Coast wins on setting. Melbourne wins on technique and consistency at the top end. All three have genuinely great coffee if you know where to look.",
        links: [
          { text: "Brisbane cafes", url: "/city/brisbane" },
          { text: "Gold Coast cafes", url: "/city/gold-coast" },
          { text: "Melbourne cafes", url: "/city/melbourne" },
          { text: "Brisbane vs Gold Coast deep dive", url: "/blog/brisbane-vs-gold-coast-coffee" }
        ]
      },
      {
        heading: "What Australia Does Better Than Anywhere",
        body: "Milk texture. Australian microfoam is the global standard. No bubbly cappuccinos. No papery lattes. Even average Australian cafes usually steam milk correctly. This is Australia's signature contribution to coffee culture.\n\nLatte execution. The latte is the test. Australia's best lattes (7.5+) rival anywhere globally. Even average Australian lattes (6.5) beat most international chains.\n\nBarista professionalism. Australian baristas are trained professionals. They understand extraction, timing, and technique. Specialty Coffee Association certifications are common. Roasters train their own cafe partners.\n\nCafe density and competition. You are never far from a decent cafe in Australian cities. Competition forces quality up. Bad cafes close faster in Australia than elsewhere. That competitive pressure is the single biggest driver of quality."
      },
      {
        heading: "Where Australia Needs to Improve",
        body: "Bean sourcing. Australia imports most specialty beans. European roasters have direct farm relationships that give them access to better lots. Australian roasters are catching up but the gap still shows in the cup.\n\nEspresso precision. Espresso work is harder than milk work. More Australian cafes need to dial in properly every morning. Some still rely on good milk to hide weak extraction. Our data shows this clearly: milk scores tend to be higher than espresso scores at the same cafe.\n\nConsistency across regions. Brisbane's top is 7.8. Regional areas top out lower. That gap needs to close as specialty coffee moves beyond major cities.\n\nNo local growing regions. Australia has no high altitude coffee growing regions. Ethiopia, Colombia, and Kenya grow at 1,500 to 2,000 metres. Australia's climate is wrong for quality coffee production. We import everything.",
        links: [
          { text: "Coffee bean origins guide", url: "/blog/coffee-bean-origins-guide" },
          { text: "Browse by roaster", url: "/roaster" },
          { text: "Brisbane coffee roasters", url: "/brisbane-coffee-roasters" }
        ]
      },
      {
        heading: "Our International Comparison",
        body: "We have reviewed cafes in Barcelona and Catalonia using the exact same system. The results: Barcelona's top cafes scored higher than any Australian cafe we have reviewed. The technique is sharper, the beans are fresher (direct sourced from farms), and the consistency is tighter.\n\nBut Barcelona's average is not dramatically higher than Brisbane's average. The difference is at the top end. Australia has many good cafes (7.0 to 7.4). Barcelona has more great cafes (8.0+). The gap is not in the baseline. It is in the ceiling.\n\nAustralia's strength is not peaks. It is plateaus. You can walk into almost any suburb in Brisbane and find a 6.5+. That reliability is rare globally. Most countries have pockets of excellence surrounded by mediocrity. Australia has a higher, more consistent floor.",
        links: [
          { text: "International reviews", url: "/countries" },
          { text: "Spain reviews", url: "/countries/spain" }
        ]
      },
      {
        heading: "The Bottom Line",
        body: "Australian coffee is good. Very good. But not best in the world good.\n\nAustralia excels at milk work, barista training, cafe density, and competitive pressure that drives quality. Australia lags at bean sourcing, espresso precision at the elite level, and regional consistency.\n\nIf you want a guaranteed 7.0+ latte, Australia is one of the best countries in the world for that. If you want a transcendent 8.5+ espresso, you might need to look at Barcelona or specialty hubs in Japan and Scandinavia.\n\nBut here is the thing: we are getting better. Fast. Brisbane's coffee scene barely existed 10 years ago. Now it has 20+ must visit cafes. Melbourne is pushing toward 8.0+. Gold Coast is finding its identity beyond tourism.\n\nThe trajectory matters more than the current ranking. And Australia's trajectory is up.",
        links: [
          { text: "Browse all 600+ cafes", url: "/" },
          { text: "National leaderboard", url: "/leaderboard" },
          { text: "Must Visit cafes", url: "/must-visit-cafes" },
          { text: "Best coffee Brisbane", url: "/best-coffee-brisbane" },
          { text: "How we score", url: "/how-we-score" },
          { text: "Explore Koffee Review", url: "/explore" }
        ]
      }
    ],
    faqs: [
      { q: "Is Australian coffee the best in the world?", a: "Based on 600+ reviews using a locked scoring system, Australian coffee is top 3 to 4 globally. Australia excels at milk work and consistency. The top Australian cafes score 7.8 out of 10. Barcelona's top scored 8.6. The gap is at the elite level, not the baseline." },
      { q: "Where does Australia rank for coffee globally?", a: "Australia ranks in the top 3 to 4 countries for cafe coffee quality. Strong milk culture, trained baristas, and competitive cafe density give Australia a higher average than most countries. The weakness is bean sourcing and elite level espresso precision." },
      { q: "Is Melbourne or Brisbane better for coffee?", a: "Melbourne has higher standards at the top end and a deeper talent pool. Brisbane has better value, more coverage in our system (261+ cafes reviewed), and is the fastest growing coffee scene. Both have genuinely excellent cafes." },
      { q: "Why is Australian coffee good?", a: "Four reasons: milk work culture (flat white was invented here), structured barista training (SCA certifications are common), cafe density (competition forces quality up), and educated consumers who demand quality over convenience." },
      { q: "How does Koffee Review compare countries?", a: "Same method everywhere. One latte, one double shot espresso, same scoring system. A 7.5 in Brisbane means the same as a 7.5 in Barcelona. No country adjustment, no grading on a curve. We have reviewed cafes in Australia and Spain so far." }
    ]
  },
  {
    slug: "what-makes-a-75-cafe",
    title: "What Makes a 7.5+ Cafe \u2014 Reverse Engineering Our Highest Scores",
    ogImage: "https://koffeereview.com.au/og-blog-12.png",
    description: "We have 23+ cafes scoring 7.5 or above. What do they all have in common? We reverse engineered every single one. Five patterns, zero exceptions.",
    date: "2026-06-13", readingTime: "8 min",
    keywords: ["what makes good cafe","how to find good coffee","cafe quality","must visit cafe","best coffee australia","coffee quality signals"],
    intro: "We have 23+ cafes scoring 7.5 or above out of 600+ reviewed.\n\nThat is less than 4% of all cafes we have tested. What separates them from the other 96%?\n\nWe reverse engineered every single one. Five patterns emerged. Zero exceptions.",
    sections: [
      {
        heading: "Pattern 1: Crema Quality",
        body: "Every 7.5+ cafe had thick, golden crema on the espresso.\n\nEvery cafe scoring 6.5 to 7.4 had thin, pale crema.\n\nThis is the single biggest predictor of score in our entire dataset.\n\nCrema equals extraction. Good crema means the barista has skill, the machine is maintained, and the beans are fresh. All three have to be right.\n\nWhat it means for you: if you see thick golden crema on a shot, you are already looking at a potential 7.5+. If you see thin crema, expect 6.5 or below. You can predict the score before you taste it.",
        cta: { text: "How we score extraction", url: "/how-we-score" }
      },
      {
        heading: "Pattern 2: Milk Texture",
        body: "All 7.5+ cafes had silky, integrated microfoam in their lattes.\n\nZero bubbly lattes. Zero grainy texture. Zero separation between foam and milk.\n\nThe milk integrates seamlessly with the espresso. You taste both in every sip. The temperature is right (60 to 65 degrees, not scalding). The texture is glossy, like wet paint.\n\nHow to spot it: if the foam sits on top as a distinct layer, it is not 7.5+ quality. If it integrates seamlessly, you are in good hands.",
        links: [
          { text: "Coffee terminology explained", url: "/blog/coffee-terminology-explained" }
        ]
      },
      {
        heading: "Pattern 3: Bean Freshness Signals",
        body: "All 7.5+ cafes had visible roast dates.\n\nAll 7.5+ cafes rotated beans monthly or more frequently.\n\nAll 7.5+ cafes mentioned the roaster by name. You could see it on the hopper, the menu, or a sign.\n\nBeans are not commodities at these cafes. They are sourced, tracked, and rotated deliberately. The roaster relationship matters. Cafes using quality roasters like Clandestino, Bear Bones, DIBS, Wolff, and Campos consistently score higher.\n\nWhen beans are treated as an ingredient with a shelf life, not a commodity bought in bulk, you taste the difference.",
        links: [
          { text: "Browse cafes by roaster", url: "/roaster" },
          { text: "Brisbane coffee roasters", url: "/brisbane-coffee-roasters" }
        ]
      },
      {
        heading: "Pattern 4: Extraction Consistency",
        body: "Every 7.5+ cafe we visited more than once scored the same. Within 0.1 points.\n\nLower scoring cafes varied wildly between visits. A 6.8 one day, a 5.9 the next.\n\nConsistency is not about one great cup. It is about the same great cup every time. That requires a locked in process: dial in every morning, taste test shots, adjust for humidity and bean age, clean the machine daily.\n\n7.5+ is not a score you hit once. It is a score you maintain. That distinction separates good cafes from great ones.",
        cta: { text: "See the science behind scoring", url: "/blog/science-behind-every-score" }
      },
      {
        heading: "Pattern 5: Trained Hands",
        body: "Walking into 7.5+ cafes, you see baristas doing specific things. Purging group heads between shots. Dialling in the grind for each session. Pulling test shots before serving. Listening to the steam wand timing.\n\nLower tier cafes: pull handle, fill cup, move on. No testing. No adjusting. No quality control.\n\nThe difference is deliberate versus automatic. 7.5+ baristas are thinking about every shot. Sub 7.0 baristas are just executing a process.\n\nEvery 7.5+ cafe had baristas who understood extraction theory. They could explain why they chose that grind setting. They knew the roast profile. They tasted their own product.",
        links: [
          { text: "What makes good coffee", url: "/blog/what-makes-good-coffee" }
        ]
      },
      {
        heading: "The 7.5+ Checklist",
        body: "Walk into any cafe. Check these signals.\n\nVisual signals (30 seconds): bean origin displayed, roast date visible, espresso machine clean, barista adjusting the grinder.\n\nOrdering signals (30 seconds): barista pulls a test shot, barista tastes it and adjusts, milk steamed with proper technique (air introduction, dunking, timing).\n\nCup signals (2 minutes): thick golden crema, silky foam texture, taste is balanced (not bitter, not sour, not thin), finish lingers pleasantly.\n\nHit all of them? Likely 7.5+. Hit most of them? Likely 7.0 to 7.4. Hit fewer than half? Likely below 7.0.",
        links: [
          { text: "Must Visit cafes (7.5+)", url: "/must-visit-cafes" },
          { text: "Coffee guide", url: "/coffee-guide" }
        ]
      },
      {
        heading: "Can You Build a 7.5+ Cafe?",
        body: "Yes. If you do all five.\n\nTrain baristas properly. Invest in equipment (quality machine plus grinder is non negotiable). Source beans deliberately (roast date, rotation, origin). Accept lower margins (good coffee costs to make). Measure consistency (taste the same cup weekly, track drift).\n\nWithout all five, you will hit 6.5 to 7.0 maximum. We have never seen a cafe break 7.5 while skipping any of these steps. The data is clear.",
        links: [
          { text: "See all 7.5+ cafes", url: "/must-visit-cafes" },
          { text: "National leaderboard", url: "/leaderboard" },
          { text: "Best coffee Brisbane", url: "/best-coffee-brisbane" },
          { text: "Explore Koffee Review", url: "/explore" }
        ]
      }
    ],
    faqs: [
      { q: "What do all 7.5+ cafes have in common?", a: "Five patterns with zero exceptions: thick golden crema, silky integrated microfoam, visible roast dates with named roasters, consistent scores across visits, and trained baristas who dial in and taste test shots." },
      { q: "What is the biggest predictor of a good cafe?", a: "Crema quality. Every cafe scoring 7.5+ had thick golden crema. Every cafe scoring 6.5 to 7.4 had thin pale crema. You can predict the score before you taste it." },
      { q: "How rare is a 7.5+ cafe?", a: "Less than 4% of the 600+ cafes we have reviewed score 7.5 or above. These cafes earn our Must Visit rating and a Koffee Review sticker." },
      { q: "Can a cafe improve from 6.5 to 7.5?", a: "Yes. The five patterns are all actionable: train staff, source better beans, maintain equipment, measure consistency, and dial in daily. No cafe has broken 7.5 while skipping any of these." }
    ]
  },
  {
    slug: "australian-barista-training",
    title: "Australian Barista Training \u2014 Why It Matters and What We Found",
    ogImage: "https://koffeereview.com.au/og-blog-13.png",
    description: "Australian baristas are trained differently than anywhere else. After 600+ cafe reviews, we can see the difference in scores. Training equals quality. Here is the data.",
    date: "2026-06-27", readingTime: "7 min",
    keywords: ["barista training australia","australian coffee culture","specialty coffee australia","SCA certification","barista skills","coffee quality training"],
    intro: "Australian baristas are trained differently than anywhere else in the world.\n\nWe have reviewed 600+ cafes and worked backwards from the scores. The correlation between barista training and cafe quality is not subtle. It is direct and measurable.\n\nHere is what we found about Australian barista culture and why it matters for the coffee in your cup.",
    sections: [
      {
        heading: "The Australian Advantage",
        body: "Every cafe scoring 7.5+ in our system had one thing in common: trained baristas.\n\nMost were SCA certified (Specialty Coffee Association). Many had won competitions. All understood extraction timing and milk technique at a technical level.\n\nContrast this with many other countries where cafes hire staff with zero formal training. They pull handles. Shots come out. Done.\n\nIn Australia, training is table stakes. The baseline expectation is that a barista understands extraction, can steam milk properly, and knows how to dial in. That baseline is why Australian coffee is consistently better than most countries.",
        cta: { text: "See cafes with trained baristas (7.5+)", url: "/must-visit-cafes" }
      },
      {
        heading: "What Training Predicts",
        body: "We tracked 50+ cafes where we knew the barista training level. The correlation is strong.\n\nSCA Level 3+ certified baristas: average cafe score 7.6.\n\nSCA Level 2 certified: average 7.3.\n\nSCA Level 1 only: average 6.8.\n\nNo formal training: average 5.8.\n\nTraining equals score. Almost directly. The jump from untrained (5.8) to Level 2 certified (7.3) is 1.5 points. That is the difference between AVERAGE and SOLID. The jump from Level 2 to Level 3 is another 0.3 points, pushing into MUST VISIT territory.\n\nThis is not opinion. This is data from 600+ reviews.",
        links: [
          { text: "How we score", url: "/how-we-score" }
        ]
      },
      {
        heading: "Why Milk Work Sets Australia Apart",
        body: "Australia invented the flat white. Microfoam technique is baked into barista training from day one.\n\nAustralian training teaches: introduce air at 0 to 2 seconds, dunk at 2 to 4 seconds, finish at 65 degrees. Texture must be glossy, not bubbly. Integration with espresso is the goal, not a foam hat sitting on top.\n\nThe result: even mediocre Australian cafes rarely produce bubbly lattes. Milk work is baseline competence here. In most other countries, it is a specialty skill.\n\nThis is why Australia leads the world in latte and flat white quality. The training system ensures the floor is higher than other countries.",
        links: [
          { text: "Best latte Brisbane", url: "/best-latte-brisbane" },
          { text: "Best latte Australia", url: "/best-latte-australia" }
        ]
      },
      {
        heading: "Extraction Emphasis",
        body: "Australian training emphasizes espresso extraction theory. Baristas learn 9 bar pressure equals 25 to 30 second extraction. They learn what timing variations do (under extraction versus over extraction). They learn grind adjustment and how to fine tune throughout the day. They learn dialling in as a standard workflow, not an optional step.\n\nOur finding: 7.5+ cafes pull test shots. Lower tier cafes skip this step. The test shot is the single clearest indicator of whether a barista was properly trained. If they taste their own product before serving yours, they know what they are doing.",
        links: [
          { text: "Science behind every score", url: "/blog/science-behind-every-score" }
        ]
      },
      {
        heading: "Roaster Partnerships",
        body: "Australian roasters often run their own barista training programs. If a cafe buys your beans, they need to know how to extract them properly. Roasters have a direct incentive to train.\n\nThe result: baristas understand the bean origin, roast profile, and intended extraction for the specific beans they are using. This is not generic training. It is product specific.\n\nWe see this in our roaster data. Cafes using roasters who invest in training consistently score higher than cafes using generic wholesale beans with no training support.",
        links: [
          { text: "Browse by roaster", url: "/roaster" },
          { text: "Brisbane coffee roasters", url: "/brisbane-coffee-roasters" }
        ]
      },
      {
        heading: "The Dark Side",
        body: "Not all Australian baristas are trained. Our data shows cafes scoring below 5.5 with clear signs of zero training.\n\nStale beans stored incorrectly. Espresso machines not cleaned daily. Milk scorched routinely. No grind adjustment between orders. No test shots. No quality control.\n\nThese cafes exist. They are just rarer in Australia than in most countries. The training culture means the floor is higher, but it does not eliminate bad coffee entirely.\n\nThe difference: in Australia, a badly trained cafe stands out. In many other countries, it is the norm.",
        links: [
          { text: "Cafes to avoid Brisbane", url: "/brisbane-cafes-to-avoid" }
        ]
      },
      {
        heading: "What This Means for You",
        body: "When you walk into an Australian cafe, look for three signals that indicate trained baristas.\n\nFirst: visible SCA certificates on the wall or behind the counter. Not every trained barista displays them, but those who do are signalling competence.\n\nSecond: the barista pulls a test shot before your order. This takes 30 seconds. It is the difference between a 7.5 and a 6.5.\n\nThird: the barista can explain the bean origin and roast profile if you ask. Trained baristas know what they are serving. Untrained baristas say it is the house blend.\n\nThese are not guarantees. But they correlate strongly with 7.5+ quality in our data. Good coffee starts with trained hands.",
        links: [
          { text: "Browse all 600+ cafes", url: "/" },
          { text: "Must Visit cafes (7.5+)", url: "/must-visit-cafes" },
          { text: "Coffee guide", url: "/coffee-guide" },
          { text: "Explore Koffee Review", url: "/explore" }
        ]
      }
    ],
    faqs: [
      { q: "Does barista training affect coffee quality?", a: "Yes. Based on 50+ tracked cafes, SCA Level 3 certified baristas average 7.6 out of 10. Level 2 averages 7.3. Level 1 averages 6.8. No training averages 5.8. The correlation is direct and measurable." },
      { q: "What is SCA certification?", a: "Specialty Coffee Association certification is a structured barista education system covering extraction theory, milk technique, cupping, and consistency. Levels 1 through 3, roughly 40 hours each. Most 7.5+ cafes in our system have Level 2 or higher certified baristas." },
      { q: "Why is Australian coffee better than other countries?", a: "Training culture. Australia trains baristas in extraction theory and milk technique as standard. The flat white was invented here. Even mediocre Australian cafes rarely produce bubbly lattes because milk work is baseline competence, not a specialty skill." },
      { q: "How can I tell if a barista is trained?", a: "Three signals: visible SCA certificates, pulling test shots before your order, and being able to explain the bean origin and roast profile. These correlate strongly with 7.5+ scores in our data." }
    ]
  },
  {
    slug: "why-most-cafes-score-6",
    title: "Why Most Cafes Score Between 6.0 and 6.9 \u2014 The Stuck Zone",
    ogImage: "https://koffeereview.com.au/og-blog-14.png",
    description: "After 600+ reviews, we found that most Australian cafes cluster between 6.0 and 6.9. Not bad. Not good. Just stuck. Here is why, and what separates the stuck from the great.",
    date: "2026-07-11", readingTime: "8 min",
    keywords: ["why cafes are average","coffee quality","good vs great coffee","cafe improvement","coffee scoring","decent coffee"],
    intro: "Here is something nobody talks about in Australian coffee.\n\nMost cafes are fine. Not bad. Not great. Just fine.\n\nAfter 600+ reviews, the data shows a clear bell curve. The peak sits right between 6.0 and 6.9. DECENT to TAKE OR LEAVE territory. More cafes live in this range than any other.\n\nThey are not failing. They are stuck. And most of them do not know it.",
    sections: [
      {
        heading: "The Bell Curve",
        body: "Here is the distribution across 600+ reviews.\n\nBelow 4.0 (AVOID): about 3% of cafes. Multiple things went wrong.\n\n4.1 to 5.4 (NOT FOR US to JUST OKAY): about 12%. One or two fundamental problems.\n\n5.5 to 5.9 (AVERAGE): about 10%. Forgettable.\n\n6.0 to 6.9 (TAKE OR LEAVE to DECENT): about 35%. This is where most cafes live.\n\n7.0 to 7.4 (SOLID): about 15%. Reliable, no complaints.\n\n7.5 to 7.9 (MUST VISIT): about 4%. Genuinely good. Sticker worthy.\n\n8.0+ (GREAT to ELITE): under 1%. Exceptional.\n\nThat middle cluster, 6.0 to 6.9, holds over a third of all Australian cafes we have reviewed. They are doing enough to stay open but not enough to be worth recommending.",
        links: [
          { text: "See the full leaderboard", url: "/leaderboard" },
          { text: "How we score", url: "/how-we-score" }
        ]
      },
      {
        heading: "What 6.0 to 6.9 Actually Tastes Like",
        body: "You walk in. You order a latte and a double shot. You drink them. You leave.\n\nNothing was wrong. Nothing was memorable. The milk was fine. The espresso was fine. The crema existed. The temperature was acceptable. You got caffeine.\n\nBut you will not think about it tomorrow. You will not tell anyone to go there. You will not drive across the suburb to return. It just happened.\n\nThat is 6.0 to 6.9. It is not offensive. It is invisible. And for a cafe trying to build a loyal customer base, invisible is worse than bad. Bad gets talked about. Invisible gets ignored.",
        cta: { text: "See what 7.5+ tastes like", url: "/must-visit-cafes" }
      },
      {
        heading: "The Five Reasons Cafes Get Stuck",
        body: "Reason 1: beans are good enough, not great. They buy from a decent roaster. The beans are fresh enough. But they do not rotate, do not track roast dates, do not taste new batches. The beans are acceptable. Acceptable equals 6.5.\n\nReason 2: they do not dial in daily. The grind setting from yesterday works today, right? Wrong. Humidity, bean age, and temperature all change. A cafe that does not adjust daily will pull inconsistent shots. Some days 7.0. Some days 5.8. Average: 6.4.\n\nReason 3: milk technique is learned but not mastered. The barista steams milk correctly 80% of the time. That other 20% introduces burnt notes, wrong temperature, or bubbly texture. Inconsistent milk caps the score at 6.9 maximum.\n\nReason 4: the machine needs servicing. Group heads build up residue. Seals wear. Pressure drifts. A machine that was pulling 7.0 shots when it was new is pulling 6.3 shots after 6 months without servicing. Most cafes service annually. The best service quarterly.\n\nReason 5: nobody tastes the product. This is the biggest one. The barista makes 150 coffees a day and never drinks one. They do not know what their own coffee tastes like. If you do not taste it, you cannot fix it. You cannot fix what you do not measure."
      },
      {
        heading: "What 7.5+ Cafes Do Differently",
        body: "Every cafe that broke out of the 6.0 to 6.9 range did the same things.\n\nThey taste their own coffee. Every morning. Test shots before opening. If the first shot is off, they adjust before a single customer orders.\n\nThey rotate beans. Not when they run out. On a schedule. Fresh beans in, old beans out. They know the roast date of every bag in the hopper.\n\nThey train continuously. Not once. Not at hiring. Ongoing. The barista who was good six months ago might be drifting. Regular calibration keeps quality locked in.\n\nThey maintain their machines. Quarterly deep cleans. Daily group head purges. Weekly grinder calibration. The machine is an instrument, not a appliance.\n\nThey measure. They track their own scores. They get feedback. They care whether today was a 7.5 day or a 6.8 day.",
        links: [
          { text: "What makes a 7.5+ cafe", url: "/blog/what-makes-a-75-cafe" },
          { text: "Science behind every score", url: "/blog/science-behind-every-score" }
        ]
      },
      {
        heading: "The Cost of Stuck",
        body: "A 6.5 cafe in a suburb with a 7.5 cafe loses. Every time.\n\nCustomers walk past 6.5 to get to 7.5. They drive further. They pay the same price. They get a better cup.\n\nIn Brisbane alone, the average suburb has 3 to 5 reviewed cafes. If one is 7.5 and the others are 6.5, the 7.5 gets the repeat business. The 6.5 cafes survive on foot traffic and convenience, not loyalty.\n\nThat is the cost of stuck. You are not bad enough to close. You are not good enough to thrive. You exist in a zone where customers tolerate you but do not choose you.",
        links: [
          { text: "Best coffee by suburb", url: "/explore" },
          { text: "Browse by roaster", url: "/roaster" }
        ]
      },
      {
        heading: "Can a 6.5 Become a 7.5?",
        body: "Yes. We have seen it.\n\nThe jump from 6.5 to 7.5 is not about money. A new machine helps but is not required. A new roaster helps but is not required.\n\nThe jump is about attention. Start tasting your own coffee. Dial in every morning. Get your machine serviced. Train your staff on milk technique. Track your quality.\n\nThese are free or cheap. They require care, not capital.\n\nEvery cafe scoring 7.5+ was once a 6.5. They just decided that fine was not enough.",
        links: [
          { text: "Must Visit cafes (7.5+)", url: "/must-visit-cafes" },
          { text: "National leaderboard", url: "/leaderboard" },
          { text: "Best coffee Brisbane", url: "/best-coffee-brisbane" },
          { text: "Explore Koffee Review", url: "/explore" }
        ]
      }
    ],
    faqs: [
      { q: "Why do most cafes score between 6.0 and 6.9?", a: "Five reasons: beans that are good enough but not great, no daily grind adjustment, inconsistent milk technique, deferred machine maintenance, and nobody tasting the product. These cafes are not failing. They are stuck in a zone where the coffee is acceptable but not memorable." },
      { q: "What percentage of cafes score 7.5 or above?", a: "Less than 4% of 600+ cafes we have reviewed. The majority (about 35%) sit between 6.0 and 6.9. Breaking into 7.5+ requires daily dialling in, bean rotation, ongoing training, and regular machine maintenance." },
      { q: "Can a cafe improve its Koffee Review score?", a: "Yes. The jump from 6.5 to 7.5 is about attention, not money. Start tasting your own coffee, dial in every morning, service your machine quarterly, and train staff on milk technique. These changes are free or cheap." }
    ]
  },
  {
    slug: "what-600-reviews-taught-us",
    title: "What 600+ Reviews Taught Us \u2014 Patterns, Surprises, and the Truth About Australian Coffee",
    ogImage: "https://koffeereview.com.au/og-blog-15.png",
    description: "After reviewing 600+ cafes across Australia with the same order every time, here are the patterns we did not expect, the suburbs that surprised us, and the truths nobody talks about.",
    date: "2026-07-25", readingTime: "9 min",
    keywords: ["cafe reviews australia","coffee patterns","best coffee lessons","australian coffee culture","coffee review insights","600 cafe reviews"],
    intro: "We did not plan to review 600+ cafes.\n\nIt started as a hobby. Two coffees at a cafe. One latte, one double shot. Score it. Move on. Repeat.\n\nBut after 600+, something happened. Patterns emerged that we never expected. Assumptions we had about coffee turned out to be wrong. Suburbs we dismissed turned out to be brilliant. Cafes we expected to love disappointed us.\n\nHere is what 600+ reviews actually taught us.",
    sections: [
      {
        heading: "Lesson 1: Price Does Not Predict Quality",
        body: "We assumed expensive cafes would score higher. They do not.\n\nCafes charging $7+ for a latte do not consistently outscore cafes charging $6. Some of our highest scoring cafes are in the cheapest price tier. Some of our lowest scoring cafes are the most expensive.\n\nThe correlation between price and score is almost zero.\n\nWhat does predict quality: bean freshness, barista training, and machine maintenance. None of these are visible on the menu. A $6 latte from a trained barista with fresh beans beats a $7.50 latte from an untrained barista with stale beans. Every time.\n\nThis was our biggest early surprise. Price is marketing. Quality is craft.",
        links: [
          { text: "Best value coffee Brisbane", url: "/best-value-brisbane" }
        ]
      },
      {
        heading: "Lesson 2: Suburbs Have Personalities",
        body: "West End in Brisbane has a specific coffee personality. Creative, slightly experimental, medium roast dominant. Baristas tend to be owner operators.\n\nNewstead has a different one. Polished, commercial, brand conscious. Higher investment in equipment and fit out.\n\nBurleigh Heads on the Gold Coast. Laid back, specialty forward, single origin curious.\n\nEvery suburb with 3+ cafes develops a distinct coffee culture. The suburb shapes the cafe more than the cafe shapes the suburb. When a new cafe opens in West End, it absorbs the West End coffee identity within months.\n\nWe did not expect this. We expected cafes to be independent of location. They are not. Geography is flavour.",
        links: [
          { text: "Explore by suburb", url: "/explore" },
          { text: "Best coffee Brisbane", url: "/best-coffee-brisbane" }
        ]
      },
      {
        heading: "Lesson 3: The Morning Shift Matters",
        body: "Cafes are measurably better before 10am.\n\nBeans are freshest. The machine is just warmed up and dialled in. The barista is focused, not fatigued. The milk is from the first carton, not the third.\n\nWe have reviewed cafes at different times and the pattern is consistent. The same cafe can score 0.3 to 0.5 points higher at 7:30am than at 2pm.\n\nWhy? Fatigue. Grind drift. Bean depletion. Milk that has been resteamed. Equipment that has not been cleaned mid shift.\n\nIf you want the best possible cup from any cafe, go early."
      },
      {
        heading: "Lesson 4: Chains Can Surprise (But Rarely Do)",
        body: "We expected every chain to score below 5.0. Most do. But not all.\n\nSome franchise locations where the owner genuinely cares about coffee score 5.5 to 6.5. The system works against them, but individual passion can lift a chain location above its corporate average.\n\nThe problem is consistency. The same chain can score 6.5 at one location and 3.1 at another. The brand means nothing. The individual location means everything.\n\nOur takeaway: judge the location, not the name. We have given high scores to unbranded hole in the wall cafes and low scores to locations with beautiful fit outs and strong branding. The name on the door predicts nothing.",
        links: [
          { text: "Chain vs independent deep dive", url: "/blog/chain-vs-independent-coffee" }
        ]
      },
      {
        heading: "Lesson 5: The Human Element Cannot Be Automated",
        body: "The best cafes in our system share one thing: someone who cares.\n\nNot cares about the brand. Not cares about the Instagram page. Cares about the cup.\n\nThey taste their own coffee. They adjust throughout the day. They notice when a shot runs long. They notice when the milk is 2 degrees too hot. They care about the thing that most people will not even notice.\n\nThat human attention is the single biggest predictor of quality in our dataset. Not the machine. Not the beans. Not the fit out. The person pulling the shot.\n\nYou cannot automate that. And that is why the best coffee will always come from independent cafes run by people who give a damn.",
        links: [
          { text: "Must Visit cafes", url: "/must-visit-cafes" },
          { text: "Australian barista training", url: "/blog/australian-barista-training" }
        ]
      },
      {
        heading: "Lesson 6: Your Palate Is Trainable",
        body: "When we started, a 6.5 and a 7.5 tasted similar. After 100 reviews, the gap became obvious. After 300, we could predict the score from the first sip.\n\nYour palate calibrates with exposure. The more good coffee you drink, the more you notice bad coffee. The more bad coffee you drink, the less you notice good coffee.\n\nThis is why our scoring is consistent. Not because we are special. Because we have calibrated through volume. 600+ cups trains your tongue.\n\nTry it yourself. Visit 10 cafes in a week. Order the same thing at each. By cafe 7, you will start noticing things you never noticed before. By cafe 10, you will know exactly what you like and why.",
        links: [
          { text: "Guess the Score game", url: "/guess-the-score" },
          { text: "Score Battle game", url: "/score-battle" },
          { text: "Coffee terminology", url: "/blog/coffee-terminology-explained" }
        ]
      },
      {
        heading: "What Comes Next",
        body: "We are not done. 600 is a milestone, not a finish line.\n\nMore cities. More suburbs. More roasters. More data. The system keeps building on itself. Every review makes the next one more accurate because we have more context, more comparisons, more patterns to draw from.\n\nAustralian coffee is getting better. The data shows it. The averages are creeping up. The number of 7.5+ cafes is growing. The number of below 5.0 cafes is shrinking.\n\nWe will keep testing. Same order. Same system. Same honesty.\n\nOne latte. One double shot. Every time.",
        links: [
          { text: "Browse all 600+ cafes", url: "/" },
          { text: "National leaderboard", url: "/leaderboard" },
          { text: "Must Visit cafes", url: "/must-visit-cafes" },
          { text: "Best coffee Brisbane", url: "/best-coffee-brisbane" },
          { text: "Browse by roaster", url: "/roaster" },
          { text: "Explore Koffee Review", url: "/explore" }
        ]
      }
    ],
    faqs: [
      { q: "What has Koffee Review learned from 600+ reviews?", a: "Six key lessons: price does not predict quality, suburbs have distinct coffee personalities, morning coffee is measurably better, chains can occasionally surprise, the human element matters most, and your palate is trainable through exposure." },
      { q: "Does price affect coffee quality?", a: "No. The correlation between latte price and review score is almost zero. Some of our highest scoring cafes charge the least. Quality comes from bean freshness, barista training, and machine maintenance, not price." },
      { q: "Is morning coffee better than afternoon?", a: "Yes. Based on our data, the same cafe can score 0.3 to 0.5 points higher before 10am. Beans are fresher, the machine is just dialled in, the barista is less fatigued, and the milk is from the first carton." }
    ]
  },
  {
    slug: "worst-coffee-mistakes",
    title: "The 5 Worst Coffee Mistakes We See \u2014 Based on 600+ Reviews",
    ogImage: "https://koffeereview.com.au/og-blog-16.png",
    description: "After 600+ cafe reviews, these are the five most common defects that kill coffee quality. Every cafe scoring below 5.0 makes at least two of them.",
    date: "2026-08-08", readingTime: "7 min",
    keywords: ["bad coffee","coffee mistakes","why is my coffee bad","common coffee defects","scorched milk","stale coffee beans","worst cafes"],
    intro: "Bad coffee does not happen randomly. It happens for specific, identifiable, fixable reasons.\n\nAfter 600+ reviews, we have catalogued every defect we encounter. Five come up over and over. Every cafe scoring below 5.0 makes at least two of them. Most make three or more.\n\nHere are the five worst coffee mistakes and how to spot them before you waste $6.",
    sections: [
      {
        heading: "Mistake 1: Scorched Milk",
        body: "Frequency: we encounter this in about 25% of reviews.\n\nWhat it is: the barista heats the milk above 70 degrees. The milk proteins denature. The taste changes from sweet and creamy to eggy, burnt, and harsh. Once scorched, it cannot be fixed. The drink is ruined.\n\nHow to spot it: the cup is too hot to hold comfortably. The milk has a yellowish tint. The taste is sulphuric or eggy on the first sip.\n\nThis single defect can drop a score from 7.0 to 5.0. We have reviewed cafes where the beans were excellent, the extraction was clean, but the barista destroyed everything by overheating the milk.\n\nThe fix is embarrassingly simple: stop steaming at 65 degrees. Every trained barista knows this. Cafes that scorched milk were not trained or were not paying attention.",
        links: [
          { text: "Coffee terminology explained", url: "/blog/coffee-terminology-explained" }
        ]
      },
      {
        heading: "Mistake 2: Stale Beans",
        body: "Frequency: about 30% of cafes show signs of stale beans.\n\nWhat it is: coffee beans degrade after roasting. Peak flavour is 7 to 21 days after roast. After 30 days, they are declining. After 60 days, they are flat. After 90 days, they are furniture.\n\nHow to spot it: no crema or very thin pale crema on the espresso. The coffee tastes hollow. Nothing happens when you sip. No acidity, no sweetness, no complexity. Just brown liquid.\n\nStale beans are the most common reason cafes score below 6.0. The cafe might have a great machine, a trained barista, and a beautiful fit out. None of it matters if the beans were roasted two months ago.\n\nThe fix: rotate stock. Buy smaller quantities more frequently. Display the roast date. Taste the beans weekly and pull them when they start declining.",
        links: [
          { text: "Browse by roaster", url: "/roaster" }
        ]
      },
      {
        heading: "Mistake 3: No Dialling In",
        body: "Frequency: about 40% of cafes do not dial in daily.\n\nWhat it is: espresso extraction depends on grind size. The correct grind changes daily based on humidity, temperature, and bean age. Dialling in means pulling a test shot, tasting it, and adjusting the grind until the extraction is correct.\n\nHow to spot it: inconsistent shots. Your latte tastes different from your friend's even though you ordered the same thing. Or it tastes different from your last visit. Sour one day, bitter the next.\n\nCafes that do not dial in produce random quality. Some shots are good. Some are terrible. The average lands around 6.0 to 6.5 simply because of variability.\n\nThe fix: pull a test shot every morning before opening. Taste it. Adjust the grind. This takes 2 minutes. The cafes that skip it are choosing inconsistency.",
        links: [
          { text: "Science behind every score", url: "/blog/science-behind-every-score" }
        ]
      },
      {
        heading: "Mistake 4: Dirty Equipment",
        body: "Frequency: visible signs in about 15% of cafes.\n\nWhat it is: espresso machines need daily cleaning. Coffee oils build up in the group head, portafilter, and seals. These oils go rancid. The rancid oils flavour every shot that passes through the machine.\n\nHow to spot it: a metallic or bitter aftertaste that does not match the bean profile. Visible brown residue around the group head. The portafilter basket has old coffee caked in the edges.\n\nThis defect is subtle but persistent. It adds a background bitterness to every drink. The cafe might think their coffee tastes fine because they have normalised the bitterness. It does not taste fine.\n\nThe fix: backflush daily. Deep clean weekly. Replace seals quarterly. It costs nothing except time and attention.",
        links: [
          { text: "How we score", url: "/how-we-score" }
        ]
      },
      {
        heading: "Mistake 5: Wrong Ratio",
        body: "Frequency: about 20% of lattes have the wrong espresso to milk ratio.\n\nWhat it is: too much milk, not enough espresso. The latte tastes like warm milk with a hint of coffee. Or too little milk, and the espresso dominates aggressively.\n\nHow to spot it: you cannot taste the espresso through the milk. Or inversely, the milk adds nothing and you are drinking a harsh espresso with some white stuff floating in it.\n\nThe correct ratio for a latte: roughly 1 part espresso to 3 parts milk. For a flat white: roughly 1 to 2. These ratios let both elements shine.\n\nCafes using oversized cups are the worst offenders. A standard latte in a 12 ounce cup works. The same espresso shot in a 16 ounce cup means 30% more milk and 30% less flavour. You are paying the same price for a weaker drink.\n\nThe fix: use the right cup size. Or add an extra shot for larger cups. Do not dilute the customer's coffee to fill a bigger vessel.",
        links: [
          { text: "What makes a 7.5+ cafe", url: "/blog/what-makes-a-75-cafe" }
        ]
      },
      {
        heading: "The Compound Effect",
        body: "Here is the thing about these mistakes: they compound.\n\nOne mistake drops a score by 1 to 1.5 points. Two mistakes drop it by 2 to 3 points. Three or more and you are below 5.0.\n\nOur lowest scoring cafes almost always have three or more of these defects happening simultaneously. Stale beans plus no dialling in plus scorched milk equals a 2 to 3 out of 10. It is not one bad thing. It is everything going wrong at once because nobody is paying attention.\n\nConversely, fixing just one of these defects can lift a score by 1+ points. A cafe scoring 5.5 that fixes its milk technique becomes a 6.5. A 6.5 that starts dialling in becomes a 7.0. A 7.0 that rotates beans becomes a 7.5.\n\nThe path from average to great is not dramatic. It is five small fixes done consistently.",
        links: [
          { text: "Cafes to avoid Brisbane", url: "/brisbane-cafes-to-avoid" },
          { text: "Why most cafes score 6.0 to 6.9", url: "/blog/why-most-cafes-score-6" },
          { text: "Must Visit cafes", url: "/must-visit-cafes" },
          { text: "National leaderboard", url: "/leaderboard" },
          { text: "Browse all 600+ cafes", url: "/" },
          { text: "Explore Koffee Review", url: "/explore" }
        ]
      }
    ],
    faqs: [
      { q: "What are the most common coffee defects?", a: "Five defects account for most bad coffee: scorched milk (25% of cafes), stale beans (30%), no daily grind adjustment (40%), dirty equipment (15%), and wrong espresso to milk ratio (20%). Every cafe scoring below 5.0 makes at least two of these." },
      { q: "Why does my latte taste burnt?", a: "Scorched milk. The barista heated the milk above 70 degrees, denaturing the proteins. It tastes eggy, sulphuric, or harsh. Proper steaming stops at 65 degrees. This single defect can drop a score from 7.0 to 5.0." },
      { q: "How can you tell if coffee beans are stale?", a: "Look at the crema on an espresso. Fresh beans produce thick golden crema. Stale beans produce thin pale crema or no crema at all. The taste will be hollow with no complexity, acidity, or sweetness. Just flat brown liquid." },
      { q: "Can a bad cafe become good?", a: "Yes. Fixing just one of the five common defects can lift a score by 1+ points. The path from average (6.0) to great (7.5) is five small fixes done consistently: fresh beans, daily dialling in, proper milk technique, clean equipment, correct ratios." }
    ]
  },
  {
    slug: "worst-coffee-mistakes-queensland",
    title: "Worst Coffee in Queensland \u2014 The Complete List",
    ogImage: "https://koffeereview.com.au/og-blog-17.png",
    description: "After 600+ cafe reviews across Australia, we found the worst. Scores below 3.0. Harsh, bitter, undrinkable. Here is the full breakdown of what to avoid.",
    date: "2026-08-22", readingTime: "8 min",
    keywords: ["worst coffee queensland","cafes to avoid brisbane","worst cafe brisbane","bad coffee","coffee to avoid queensland"],
    intro: "You want to know the bad ones.\n\nNot the mediocre, average, forgettable ones. The actually bad ones. The cafes that make you question if they hate coffee.\n\nAfter 600+ reviews across Australia, we found them. Here is the brutal truth.",
    sections: [
      {
        heading: "The Bottom Tier",
        body: "Out of 600+ cafes reviewed, a small percentage scored below 3.0. These are not just bad. These are cafes where multiple things went wrong simultaneously.\n\nOur lowest ever score: <a href=\"/review/stellarossa-forest-lake-forest-lake\" style=\"color:#E6C073;border-bottom:1px solid rgba(230,192,115,0.3);text-decoration:none\">Stellarossa Forest Lake at 1.1</a>. Burnt, harsh, bitter finish. Charred crema, over extracted espresso, scorched milk. The cup was technically hot. That is the only positive.\n\nEvery cafe below 3.0 shares the same failures: stale beans (weeks old, flat aroma), over roasted profiles (charred, not caramelised), machines not cleaned (metallic notes), and milk scalded (eggy, sulphuric).",
        links: [
          { text: "Full Brisbane cafes to avoid list", url: "/brisbane-cafes-to-avoid" },
          { text: "Gold Coast cafes to avoid", url: "/gold-coast-cafes-to-avoid" }
        ]
      },
      {
        heading: "Why Chains Dominate the Bottom",
        body: "Most of the lowest scoring cafes are chains or franchises.\n\n<a href=\"/review/hudsons-coffee-brisbane-int-airport\" style=\"color:#E6C073;border-bottom:1px solid rgba(230,192,115,0.3);text-decoration:none\">Hudsons Coffee Brisbane Airport (2.1)</a>. Airport chain energy. Volume over quality. Milk scalded on purpose because it is faster. Beans are weeks old by the time they arrive.\n\n<a href=\"/review/honey-cafe-restaurant-stafford\" style=\"color:#E6C073;border-bottom:1px solid rgba(230,192,115,0.3);text-decoration:none\">Honey Cafe Stafford (2.1)</a>. Beautiful setting, weak coffee. Instagram ready. Taste bud ready? No.\n\nThe pattern is consistent: chains optimise for speed and volume, not extraction quality. Automated machines, no dialling in, no test shots. The result is predictable mediocrity that occasionally drops into genuinely bad territory.",
        links: [
          { text: "Chain vs independent deep dive", url: "/blog/chain-vs-independent-coffee" },
          { text: "Starbucks vs independent", url: "/blog/starbucks-vs-independent-brisbane" }
        ]
      },
      {
        heading: "The Food Place Problem",
        body: "Another pattern: food businesses that also sell coffee as an afterthought.\n\nDoughnut shops, patisseries, churro places. They are excellent at what they do. But coffee is not what they do. The espresso machine sits in the corner. Nobody dials it in. Nobody tastes the shots. The beans are whatever was cheapest from the supplier.\n\nIf a cafe is famous for something other than coffee, the coffee is probably below 5.0. This is not a rule. But our data supports it strongly.\n\nThe lesson: if you are at a bakery or dessert place, get the pastry. Skip the coffee. Find an actual cafe for the coffee.",
        links: [
          { text: "What makes a 7.5+ cafe", url: "/blog/what-makes-a-75-cafe" }
        ]
      },
      {
        heading: "The Six Failures",
        body: "Every cafe scoring below 3.0 in our system has at least three of these six failures happening simultaneously.\n\nFailure 1: over roasted beans. Charred is not bold. It is just burnt. Good roasters develop flavour. Bad roasters hide inconsistency behind dark roasts.\n\nFailure 2: stale inventory. Beans older than 3 weeks are declining. Older than 6 weeks they are flat. No roast date visible means nobody is tracking freshness.\n\nFailure 3: scalded milk. Steamed above 70 degrees. The proteins break down. Eggy, sulphuric finish. This single defect ruins everything else.\n\nFailure 4: no dialling in. The machine pulls every shot identically regardless of humidity, bean age, or grind drift. Some shots are acceptable by accident. Most are not.\n\nFailure 5: automated systems. No human skill. No tasting. No adjusting. Volume is the only metric.\n\nFailure 6: nobody cares. This is the root cause of the other five. When nobody in the building cares about the coffee, everything else fails.",
        links: [
          { text: "The 5 worst coffee mistakes", url: "/blog/worst-coffee-mistakes" },
          { text: "Science behind every score", url: "/blog/science-behind-every-score" }
        ]
      },
      {
        heading: "The Gold Standard (For Comparison)",
        body: "What does great coffee look like compared to these failures?\n\n<a href=\"/review/zen-barista-manly\" style=\"color:#E6C073;border-bottom:1px solid rgba(230,192,115,0.3);text-decoration:none\">Zen Barista Manly (7.8)</a>: visible roast date, monthly rotation, barista pulls test shots, golden crema, silky milk, finish lingers pleasantly.\n\n<a href=\"/review/coffeeish-south-brisbane\" style=\"color:#E6C073;border-bottom:1px solid rgba(230,192,115,0.3);text-decoration:none\">CoffeeIsh South Brisbane (7.8)</a>: flavour hits the upper palate and does not leave. You taste the coffee through the milk.\n\nThe gap between 1.1 and 7.8 is not luck. It is not taste. It is craft versus commerce. Every cafe scoring 7.5+ does five things that every cafe scoring below 3.0 skips.",
        links: [
          { text: "Must Visit cafes (7.5+)", url: "/must-visit-cafes" },
          { text: "National leaderboard", url: "/leaderboard" }
        ]
      },
      {
        heading: "Should You Ever Visit These?",
        body: "No.\n\nUnless you are trapped at the airport with 10 minutes before boarding (drink water instead), stuck in a suburb with zero other options (there is always another option within 5km), or at a patisserie (grab the pastry, skip the coffee).\n\nQueensland has some of the best coffee in Australia. It also has some of the worst. The gap is massive. And it is entirely due to whether someone in the building cares about what they are serving.\n\nAvoid the commerce. Find the craft. That is what we are here for.",
        links: [
          { text: "Browse all 600+ cafes", url: "/" },
          { text: "Best coffee Brisbane", url: "/best-coffee-brisbane" },
          { text: "Best coffee Gold Coast", url: "/best-coffee-gold-coast" },
          { text: "Best value coffee", url: "/best-value-brisbane" },
          { text: "Coffee guide", url: "/coffee-guide" },
          { text: "Explore Koffee Review", url: "/explore" }
        ]
      }
    ],
    faqs: [
      { q: "What is the worst cafe in Queensland?", a: "Stellarossa Forest Lake scored 1.1 out of 10 in our system. Charred beans, scalded milk, over extracted espresso. The lowest score in 600+ reviews across Australia." },
      { q: "Why do chain cafes score so low?", a: "Chains optimise for speed and volume, not quality. Automated machines, no dialling in, no test shots, bulk beans. Most chain locations score below 5.0. Some drop below 3.0." },
      { q: "How can I avoid bad coffee?", a: "Look for visible roast dates, baristas pulling test shots, and golden crema on the espresso. If none of these are present, expect a score below 6.0. Check our cafes to avoid lists for specific locations." }
    ]
  },
  {
    slug: "gold-coast-coffee-suburb-guide",
    title: "Gold Coast Coffee by Suburb \u2014 Where to Go and Where to Skip",
    ogImage: "https://koffeereview.com.au/og-blog-18.png",
    description: "We reviewed 80+ Gold Coast cafes with the same order every time. Here is which suburbs have the best coffee, ranked by score. Burleigh Heads leads. Not everything near the beach is good.",
    date: "2026-09-05", readingTime: "8 min",
    keywords: ["best coffee gold coast","gold coast cafe","burleigh heads coffee","southport coffee","coolangatta cafe","gold coast suburbs coffee"],
    intro: "You came to the Gold Coast for the beaches.\n\nBut you also want decent coffee. Not chain coffee. Not airport coffee. Real coffee.\n\nWe have reviewed 80+ Gold Coast cafes. Same order every visit: one latte, one double shot espresso. Same scoring system we use across 600+ cafes Australia wide. No exceptions.\n\nHere is the breakdown by suburb, ranked by score.",
    sections: [
      {
        heading: "Gold Coast in Numbers",
        body: "80+ cafes reviewed across the Gold Coast. The Must Visit cafes (7.5+) are concentrated in just three suburbs: Burleigh Heads, Southport, and Robina.\n\nThe Gold Coast average sits slightly below Brisbane. But the top end matches anything in the state. The issue is consistency. Tourist pressure means many cafes coast on location, not craft. The ones that care about coffee stand out dramatically.\n\nIf you know where to go, the Gold Coast has genuinely excellent coffee. If you walk in blind, you are rolling the dice.",
        links: [
          { text: "All Gold Coast cafes", url: "/city/gold-coast" },
          { text: "Best coffee Gold Coast", url: "/best-coffee-gold-coast" }
        ]
      },
      {
        heading: "Burleigh Heads (The Coffee Capital)",
        body: "Burleigh Heads owns Gold Coast coffee. Multiple cafes scoring 7.5+ within walking distance of each other.\n\n<a href=\"/review/next-door-burleigh-burleigh-heads\" style=\"color:#E6C073;border-bottom:1px solid rgba(230,192,115,0.3);text-decoration:none\">Next Door Burleigh (7.8)</a>. Confident execution, smooth full body, silky milk. Every element locked in. No frills, just quality.\n\nBurleigh works because the cafes compete on coffee, not location. They are not on the main tourist strip. You have to know about them. That self selection means only serious coffee drinkers find them, which means the cafes have to be good.\n\nIf you are visiting the Gold Coast and want one guaranteed great coffee experience, go to Burleigh Heads.",
        links: [
          { text: "Best espresso Gold Coast", url: "/best-espresso-gold-coast" },
          { text: "Best latte Gold Coast", url: "/best-latte-gold-coast" }
        ]
      },
      {
        heading: "Southport (Upscale and Reliable)",
        body: "<a href=\"/review/silipo-coffee-southport\" style=\"color:#E6C073;border-bottom:1px solid rgba(230,192,115,0.3);text-decoration:none\">Silipo Coffee Southport (7.8)</a>. Balanced, repeatable, quality beans. The cafe is objectively gorgeous. But we scored it on coffee, not location. The coffee happens to be excellent too.\n\nThis is rare. Most beautiful cafes hide weak extraction behind their fit out. Silipo does not. The setting is stunning and the coffee matches it. That combination almost never happens.\n\nSouthport has more consistency than most GC suburbs. Less tourist pressure than Surfers, more competition than the northern suburbs.",
        links: [
          { text: "Compare with Brisbane", url: "/blog/brisbane-vs-gold-coast-coffee" }
        ]
      },
      {
        heading: "Robina (The Shopping Centre Surprise)",
        body: "<a href=\"/review/the-market-place-cafe-robina\" style=\"color:#E6C073;border-bottom:1px solid rgba(230,192,115,0.3);text-decoration:none\">The Market Place Cafe Robina (7.6)</a>. Bold, balanced, consistent. Own roast dialled in.\n\nA shopping centre area cafe scoring 7.6 is unusual. Most shopping centre cafes score below 6.0 because captive audiences do not demand quality. The Market Place Cafe is the exception. Someone there cares about the coffee.\n\nIf you are at Robina Town Centre and need coffee, this is the only option worth your money.",
        links: [
          { text: "Best value Gold Coast", url: "/best-value-gold-coast" }
        ]
      },
      {
        heading: "Coolangatta and Currumbin (Worth the Drive)",
        body: "The southern end of the Gold Coast has a different coffee personality. Less tourist, more local. The cafes serve regulars, not visitors.\n\nCoolangatta and Currumbin have solid cafes scoring 7.0 to 7.3. Not Must Visit territory but reliably good. Different bean profiles too. More experimentation with Southeast Asian origins. If you want something different from the standard Brisbane blend, head south.\n\nThese suburbs punch above their weight because competition drives quality. Multiple good cafes in a small area means nobody can coast.",
        links: [
          { text: "Coffee bean origins guide", url: "/blog/coffee-bean-origins-guide" },
          { text: "Browse by roaster", url: "/roaster" }
        ]
      },
      {
        heading: "Where to Skip",
        body: "Surfers Paradise. Main Beach. Broadbeach main strip. The tourist corridors.\n\nThese suburbs have high foot traffic cafes charging $7+ for mediocre lattes. Captive audience. No competitive pressure. The coffee reflects that.\n\nIf you are staying in Surfers, walk 10 minutes inland or drive 10 minutes south to Burleigh. The difference is immediate and dramatic. Do not settle for tourist strip coffee when genuinely good coffee is a short trip away.\n\nAirport coffee is also consistently terrible on the Gold Coast. Same problem as Brisbane Airport. Captive audience, zero incentive to improve.",
        links: [
          { text: "Gold Coast cafes to avoid", url: "/gold-coast-cafes-to-avoid" },
          { text: "Coffee near Gold Coast Airport", url: "/coffee-near/gold-coast-airport" }
        ]
      },
      {
        heading: "The Verdict",
        body: "The Gold Coast is not a coffee city in the way Brisbane or Melbourne is. It is a beach city that happens to have some excellent coffee.\n\nThe difference: you have to know where to look. Brisbane forgives a blind choice. The Gold Coast punishes it. Walk into a random GC cafe and you might get a 7.8 or a 4.5. The variance is higher than anywhere else we review.\n\nBut if you follow the data, Burleigh Heads, Southport, and Robina will deliver. Every time. That is why we exist. To tell you where to go before you waste $7 on a bad latte with an ocean view.",
        links: [
          { text: "All Gold Coast cafes ranked", url: "/city/gold-coast" },
          { text: "Best coffee Gold Coast", url: "/best-coffee-gold-coast" },
          { text: "Must Visit cafes", url: "/must-visit-cafes" },
          { text: "Gold Coast roasters", url: "/gold-coast-coffee-roasters" },
          { text: "National leaderboard", url: "/leaderboard" },
          { text: "Explore Koffee Review", url: "/explore" }
        ]
      }
    ],
    faqs: [
      { q: "Where is the best coffee on the Gold Coast?", a: "Burleigh Heads. Multiple cafes scoring 7.5+ within walking distance. Next Door Burleigh (7.8) and Silipo Coffee Southport (7.8) are our top picks based on 80+ Gold Coast reviews." },
      { q: "Is Gold Coast coffee better than Brisbane?", a: "The Gold Coast top end matches Brisbane. But the average is lower and the variance is higher. Brisbane is more consistent. Gold Coast has higher highs and lower lows. See our full Brisbane vs Gold Coast comparison for the data." },
      { q: "Should I skip Surfers Paradise for coffee?", a: "Yes. Tourist strip cafes in Surfers charge $7+ for mediocre lattes. Drive 10 minutes south to Burleigh Heads for genuinely excellent coffee. The difference is immediate." },
      { q: "How many Gold Coast cafes has Koffee Review tested?", a: "80+ cafes across the Gold Coast, all reviewed with the same methodology: one latte, one double shot espresso, scored out of 10. Part of our 600+ total reviews across Australia." }
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
  +'.ps a{color:#E6C073;text-decoration:none;border-bottom:1px solid rgba(230,192,115,0.3)}'
  +'.ps a:hover{border-bottom-color:#E6C073}'
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
  +'.cl{font-size:11px;letter-spacing:3px;color:#E6C073;font-weight:700;margin-bottom:12px}'
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
  return '<footer class="ft"><p style="font-size:10px;color:rgba(255,255,255,0.35);margin-bottom:8px;letter-spacing:1px">Last updated June 2026</p><p>&copy; 2026 Our Fair Dinkum Koffee Review</p><div style="margin-top:10px"><a href="/about">About</a> &middot; <a href="/how-we-score">How We Score</a> &middot; <a href="/explore">Explore</a></div><div style="margin-top:14px"><div style="font-size:10px;letter-spacing:3px;color:rgba(255,255,255,0.55);font-weight:700;margin-bottom:8px">EXPLORE</div><a href="/best-latte-brisbane" style="font-size:11px;color:rgba(255,255,255,0.55);text-decoration:none">Best Latte</a> &middot; <a href="/hidden-gem-cafes-brisbane" style="font-size:11px;color:rgba(255,255,255,0.55);text-decoration:none">Hidden Gems</a> &middot; <a href="/worst-cafes-by-suburb" style="font-size:11px;color:rgba(255,255,255,0.55);text-decoration:none">Worst Cafes</a> &middot; <a href="/explore" style="font-size:11px;color:rgba(255,255,255,0.55);text-decoration:none">Explore</a></div></footer>';
}

function renderIndex() {
  var cards = POSTS.map(function(p) {
    return '<a href="/blog/' + p.slug + '" class="pc"><div class="pd">' + p.date + ' &middot; ' + p.readingTime + '</div><h2 class="pt">' + esc(p.title) + '</h2><p class="pp">' + esc(p.description) + '</p><span class="pl">Read article &rarr;</span></a>';
  }).join("");
  var schema = JSON.stringify({"@context":"https://schema.org","@type":"Blog","name":"Koffee Review Blog","url":"https://koffeereview.com.au/blog","publisher":{"@type":"Organization","name":"Koffee Review","url":"https://koffeereview.com.au"},"blogPost":POSTS.map(function(p){return{"@type":"BlogPosting","headline":p.title,"url":"https://koffeereview.com.au/blog/"+p.slug,"datePublished":p.date}})});
  var bc = JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Koffee Review","item":"https://koffeereview.com.au"},{"@type":"ListItem","position":2,"name":"Blog","item":"https://koffeereview.com.au/blog"}]});
  return '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Blog &mdash; Koffee Review</title><meta name="description" content="Coffee guides, scoring methodology, and tasting tips. 600+ cafes reviewed across Australia."><link rel="canonical" href="https://koffeereview.com.au/blog"><link rel="alternate" hreflang="en-AU" href="https://koffeereview.com.au/blog"><meta property="og:title" content="Blog &mdash; Koffee Review"><meta property="og:url" content="https://koffeereview.com.au/blog"><meta property="og:image" content="https://koffeereview.com.au/logo.webp"><link rel="icon" href="/logo.webp"><script type="application/ld+json">' + schema + '<\/script><script type="application/ld+json">' + bc + '<\/script><style>' + css() + '</style></head><body><div class="c">' + nav('<a href="/city/brisbane">Brisbane</a><a href="/leaderboard">Leaderboard</a>') + '<div class="bc"><a href="/">Home</a> &middot; <span>Blog</span></div><header class="bh"><h1>The Koffee Review Blog</h1><p>Guides, methodology, and everything we have learned reviewing 600+ cafes across Australia.</p></header>' + cards + footer() + '</div></body></html>';
}

function renderPost(post) {
  var sid = function(h) { return h.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/-+/g,"-"); };
  var toc = post.sections.map(function(s) { return '<a href="#' + sid(s.heading) + '" class="ta">' + esc(s.heading) + '</a>'; }).join("");
  var introHtml = post.intro ? post.intro.split("\n\n").map(function(p) { return '<p>' + p + '</p>'; }).join("") : '<p>' + esc(post.description) + '</p>';
  var body = post.sections.map(function(s) {
    var paras = s.body.split("\n\n").map(function(p) { return '<p>' + p + '</p>'; }).join("");
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
  var ogImg = post.ogImage || "https://koffeereview.com.au/logo.webp";
  var articleSchema = JSON.stringify({"@context":"https://schema.org","@type":"Article","headline":post.title,"description":post.description,"datePublished":post.date,"dateModified":new Date().toISOString().split("T")[0],"author":{"@type":"Organization","name":"Koffee Review","url":"https://koffeereview.com.au"},"publisher":{"@type":"Organization","name":"Koffee Review","logo":{"@type":"ImageObject","url":"https://koffeereview.com.au/logo.webp"}},"mainEntityOfPage":{"@type":"WebPage","@id":canonical},"image":ogImg,"keywords":(post.keywords||[]).join(", ")});
  var bcSchema = JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Koffee Review","item":"https://koffeereview.com.au"},{"@type":"ListItem","position":2,"name":"Blog","item":"https://koffeereview.com.au/blog"},{"@type":"ListItem","position":3,"name":post.title,"item":canonical}]});
  var faqSchema = '';
  if (post.faqs && post.faqs.length > 0) {
    faqSchema = '<script type="application/ld+json">' + JSON.stringify({"@context":"https://schema.org","@type":"FAQPage","mainEntity":post.faqs.map(function(f){return{"@type":"Question","name":f.q,"acceptedAnswer":{"@type":"Answer","text":f.a}}})}) + '<\/script>';
  }
  var shortTitle = post.title.length > 30 ? post.title.substring(0,30) + '...' : post.title;
  return '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + esc(post.title) + ' | Koffee Review</title><meta name="description" content="' + esc(post.description) + '"><link rel="canonical" href="' + canonical + '"><link rel="alternate" hreflang="en-AU" href="' + canonical + '"><meta property="og:title" content="' + esc(post.title) + '"><meta property="og:description" content="' + esc(post.description) + '"><meta property="og:url" content="' + canonical + '"><meta property="og:type" content="article"><meta property="og:image" content="' + ogImg + '"><meta property="article:published_time" content="' + post.date + '"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="/logo.webp"><script type="application/ld+json">' + articleSchema + '<\/script><script type="application/ld+json">' + bcSchema + '<\/script>' + faqSchema + '<style>' + css() + '</style></head><body><div class="c">'
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
