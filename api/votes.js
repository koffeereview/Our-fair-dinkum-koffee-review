const VOTE_API = "https://script.google.com/macros/s/AKfycbxkjSu9sB2yB4fkqbyD2sOV7uIplW8TTR4IXtCQDuHm3cFlThyFYlUnJxqIF6FzEhM/exec";

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      var body = req.body || {};
      var slug = body.slug || "";
      var vote = body.vote || "";
      if (!slug || !vote) return res.status(400).json({ error: "missing slug or vote" });
      var response = await fetch(VOTE_API, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({ slug: slug, vote: vote }),
        redirect: "follow"
      });
      var text = await response.text();
      res.setHeader("Cache-Control", "no-cache");
      return res.status(200).json({ ok: true });
    }

    // GET — fetch vote counts
    var slug = req.query.slug || "";
    if (!slug) return res.status(400).json({ error: "missing slug" });
    var response = await fetch(VOTE_API + "?slug=" + encodeURIComponent(slug), { redirect: "follow" });
    var data = await response.json();
    res.setHeader("Cache-Control", "no-cache");
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ up: 0, down: 0 });
  }
}
