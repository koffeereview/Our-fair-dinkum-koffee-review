// KOFFEE REVIEW BLOG — Server-rendered, SEO-optimised
// /api/blog → blog index | /api/blog?slug=how-to-find-good-coffee → post

function esc(str) { return (str||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }

var POSTS = [
  {
    slug: "how-to-find-good-coffee",
    title: "How to Find Good Coffee (The Real Way)",
    ogImage: "https://koffeereview.com.au/og-blog-1.png",
    description: "We have reviewed 600+ cafes across Australia with a locked scoring system. No sponsorships, no bias. Here is how to use our data to find genuinely great coffee every time.",
    date: "2026-05-23", readingTime: "8 min",
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
    date: "2026-05-30", readingTime: "9 min",
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
    date: "2026-06-06", readingTime: "8 min",
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
    date: "2026-06-13", readingTime: "7 min",
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
    date: "2026-06-20", readingTime: "8 min",
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
    date: "2026-06-27", readingTime: "9 min",
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
    date: "2026-07-04", readingTime: "7 min",
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
    date: "2026-07-11", readingTime: "10 min",
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
