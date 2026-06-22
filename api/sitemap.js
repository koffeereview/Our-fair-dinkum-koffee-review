const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYEU8Khk3R5I879v3FcXPqhq0aCXa2ZWM1BwwJOyUitx2Boak_AFTOkwvB8qQrKIeU55NM4htFjHbI/pub?gid=0&single=true&output=csv";
const SPAIN = ["barcelona","catalonia","spain"];
const BASE = "https://koffeereview.com.au";

function splitCSV(line){var r=[],c="",q=false;for(var i=0;i<line.length;i++){var ch=line[i];if(ch==='"')q=!q;else if(ch===","&&!q){r.push(c.trim());c="";}else c+=ch;}r.push(c.trim());return r;}
function slug(s){return s.toLowerCase().replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-").trim();}
function makeSlug(n,s){return slug(n+"-"+s);}

function parseCSV(text){
  var lines=text.split("\n").filter(function(l){return l.trim();});if(lines.length<2)return[];
  var h=splitCSV(lines[0]).map(function(x){return x.trim().toLowerCase();});
  var ni=h.indexOf("name"),si=h.indexOf("suburb"),ci=h.indexOf("city"),sci=h.indexOf("score"),ri=h.indexOf("roaster");
  if(ni===-1||si===-1)return[];var out=[];
  for(var i=1;i<lines.length;i++){try{var p=splitCSV(lines[i]);var n=(p[ni]||"").trim();if(!n)continue;var sc=parseFloat(p[sci])||0;if(sc<=0)continue;
  var city=(p[ci]||"").trim();if(SPAIN.indexOf(city.toLowerCase())!==-1)continue;
  out.push({name:n,suburb:(p[si]||"").trim(),city:city,score:sc,roaster:(ri!==-1?(p[ri]||""):"").trim()});}catch(e){}}
  return out;
}

function xmlHeader(){return'<?xml version="1.0" encoding="UTF-8"?>\n';}
function url(loc,mod,freq,pri){return'<url><loc>'+loc+'</loc><lastmod>'+mod+'</lastmod><changefreq>'+freq+'</changefreq><priority>'+pri+'</priority></url>\n';}

export default async function handler(req,res){
  try{
    var type=req.query.type||"index";
    var today=new Date().toISOString().split("T")[0];

    // SITEMAP INDEX — /sitemap.xml
    if(type==="index"){
      var xml=xmlHeader()+'<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
      ["static","reviews","cities","suburbs"].forEach(function(s){
        xml+='<sitemap><loc>'+BASE+'/sitemap-'+s+'.xml</loc><lastmod>'+today+'</lastmod></sitemap>\n';
      });
      xml+='</sitemapindex>';
      res.setHeader("Content-Type","application/xml; charset=utf-8");
      res.setHeader("Cache-Control","public, s-maxage=3600, stale-while-revalidate=86400");
      return res.status(200).send(xml);
    }

    // All sub-sitemaps need sheet data
    var response=await fetch(SHEET_URL);
    if(!response.ok)throw new Error("Sheet fetch failed");
    var text=await response.text();
    var cafes=parseCSV(text);
    var xml=xmlHeader()+'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // STATIC PAGES — /sitemap-static.xml
    if(type==="static"){
      xml+=url(BASE,today,"weekly","1.00");
      xml+=url(BASE+"/explore",today,"weekly","0.90");
      xml+=url(BASE+"/about",today,"monthly","0.85");
      xml+=url(BASE+"/leaderboard",today,"weekly","0.90");
      xml+=url(BASE+"/must-visit-cafes",today,"weekly","0.90");
      xml+=url(BASE+"/blog",today,"weekly","0.85");
      xml+=url(BASE+"/blog/how-to-find-good-coffee",today,"monthly","0.80");
      xml+=url(BASE+"/blog/coffee-terminology-explained",today,"monthly","0.80");
      xml+=url(BASE+"/blog/best-coffee-by-region",today,"monthly","0.80");
      xml+=url(BASE+"/how-we-score",today,"monthly","0.75");
      xml+=url(BASE+"/map",today,"weekly","0.80");
      xml+=url(BASE+"/compare",today,"weekly","0.75");
      xml+=url(BASE+"/random",today,"weekly","0.70");
      xml+=url(BASE+"/new",today,"daily","0.80");
      xml+=url(BASE+"/coffee-near",today,"weekly","0.75");
      xml+=url(BASE+"/brisbane-cafes-to-avoid",today,"weekly","0.80");
      xml+=url(BASE+"/gold-coast-cafes-to-avoid",today,"weekly","0.75");
      xml+=url(BASE+"/melbourne-cafes-to-avoid",today,"weekly","0.75");
      xml+=url(BASE+"/sunshine-coast-cafes-to-avoid",today,"weekly","0.70");
      xml+=url(BASE+"/moreton-bay-cafes-to-avoid",today,"weekly","0.70");
      xml+=url(BASE+"/redland-cafes-to-avoid",today,"weekly","0.70");
      xml+=url(BASE+"/best-value-brisbane",today,"weekly","0.80");
      xml+=url(BASE+"/best-value-gold-coast",today,"weekly","0.75");
      xml+=url(BASE+"/best-value-australia",today,"weekly","0.80");
      xml+=url(BASE+"/worst-cafes-by-suburb",today,"weekly","0.75");
      xml+=url(BASE+"/hidden-gem-cafes-brisbane",today,"weekly","0.80");
      xml+=url(BASE+"/best-latte-brisbane",today,"weekly","0.80");
      xml+=url(BASE+"/best-latte-australia",today,"weekly","0.85");
      xml+=url(BASE+"/best-espresso-brisbane",today,"weekly","0.80");
      xml+=url(BASE+"/best-espresso-australia",today,"weekly","0.85");
      xml+=url(BASE+"/roaster",today,"weekly","0.85");
      xml+=url(BASE+"/coffee-guide",today,"monthly","0.85");
      xml+=url(BASE+"/countries",today,"monthly","0.75");
      xml+=url(BASE+"/best-cafes-australia",today,"weekly","0.85");
      xml+=url(BASE+"/best-coffee-australia",today,"weekly","0.85");
      // Landmarks
      var landmarks=["south-bank","queen-street-mall","brisbane-cbd","suncorp-stadium","the-gabba","fortitude-valley","howard-smith-wharves","james-street","new-farm-park","uq-st-lucia","qut-gardens-point","roma-street","west-village","eat-street","mt-coot-tha","kangaroo-point","brisbane-airport","surfers-paradise","pacific-fair","burleigh-beach"];
      landmarks.forEach(function(l){xml+=url(BASE+"/coffee-near/"+l,today,"monthly","0.65");});
    }

    // REVIEWS — /sitemap-reviews.xml
    if(type==="reviews"){
      cafes.forEach(function(c){
        xml+=url(BASE+"/review/"+makeSlug(c.name,c.suburb),today,"monthly","0.70");
      });
    }

    // CITIES — /sitemap-cities.xml
    if(type==="cities"){
      var cityMap={};cafes.forEach(function(c){if(c.city)cityMap[c.city]=true;});
      Object.keys(cityMap).forEach(function(c){
        var s=slug(c);
        xml+=url(BASE+"/city/"+s,today,"weekly","0.85");
        xml+=url(BASE+"/best-coffee-"+s,today,"weekly","0.85");
        xml+=url(BASE+"/best-latte-"+s,today,"weekly","0.80");
        xml+=url(BASE+"/best-espresso-"+s,today,"weekly","0.80");
      });
    }

    // SUBURBS — /sitemap-suburbs.xml
    if(type==="suburbs"){
      // Roaster pages
      var roasterMap={};cafes.forEach(function(c){
        if(c.roaster){var rs=c.roaster.toLowerCase().replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-").trim();
        if(rs)roasterMap[rs]=true;}
      });
      Object.keys(roasterMap).forEach(function(r){
        xml+=url(BASE+"/roaster/"+r,today,"weekly","0.75");
      });
      var subMap={};cafes.forEach(function(c){
        if(c.suburb&&c.city){
          var key=c.suburb+"|||"+c.city;
          if(!subMap[key])subMap[key]={suburb:c.suburb,city:c.city,count:0};
          subMap[key].count++;
        }
      });
      Object.values(subMap).forEach(function(s){
        var subSlug=slug(s.suburb+"-"+s.city);
        xml+=url(BASE+"/suburb/"+subSlug,today,"weekly","0.75");
        // Neighbourhood guide for suburbs with 3+ cafes
        if(s.count>=3){
          var guideSlug=slug(s.suburb+"-"+s.city+"-coffee");
          xml+=url(BASE+"/guide/"+guideSlug,today,"weekly","0.80");
        }
      });
    }

    xml+='</urlset>';
    res.setHeader("Content-Type","application/xml; charset=utf-8");
    res.setHeader("Cache-Control","public, s-maxage=3600, stale-while-revalidate=86400");
    return res.status(200).send(xml);
  }catch(e){
    // Return valid but minimal sitemap on error — never return empty
    var fallback=xmlHeader()+'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    fallback+='<url><loc>'+BASE+'</loc></url>\n</urlset>';
    res.setHeader("Content-Type","application/xml; charset=utf-8");
    return res.status(200).send(fallback);
  }
}
