export default function handler(req, res) {
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.status(200).send('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>https://koffeereview.com.au/</loc>\n    <priority>1.0</priority>\n  </url>\n</urlset>');
}
 
