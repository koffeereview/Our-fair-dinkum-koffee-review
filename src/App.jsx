import { useState, useEffect } from "react";

const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYEU8Khk3R5I879v3FcXPqhq0aCXa2ZWM1BwwJOyUitx2Boak_AFTOkwvB8qQrKIeU55NM4htFjHbI/pub?gid=0&single=true&output=csv";

function parseCSV(text) {
  const lines = text.trim().split("\n");
  const headers = lines[0].split(",").map(h => h.trim().replace(/"/g, ""));
  return lines.slice(1).map((line, i) => {
    const values = line.split(",").map(v => v.trim().replace(/"/g, ""));
    const obj = {};
    headers.forEach((h, idx) => obj[h] = values[idx] || "");
    obj.score = parseFloat(obj.score) || 0;
    obj.id = i + 1;
    return obj;
  });
}

function getScoreColor(score) {
  if (score >= 9.0) return "#FFD700";
  if (score >= 8.0) return "#4ade80";
  if (score >= 7.0) return "#2dd4bf";
  if (score >= 6.0) return "#facc15";
  if (score >= 5.0) return "#fb923c";
  return "#f87171";
}

function getScoreBg(score) {
  if (score >= 9.0) return "rgba(255,215,0,0.15)";
  if (score >= 8.0) return "rgba(74,222,128,0.15)";
  if (score >= 7.0) return "rgba(45,212,191,0.15)";
  if (score >= 6.0) return "rgba(250,204,21,0.15)";
  if (score >= 5.0) return "rgba(251,146,60,0.15)";
  return "rgba(248,113,113,0.15)";
}

function getScoreBorder(score) {
  if (score >= 9.0) return "rgba(255,215,0,0.3)";
  if (score >= 8.0) return "rgba(74,222,128,0.3)";
  if (score >= 7.0) return "rgba(45,212,191,0.3)";
  if (score >= 6.0) return "rgba(250,204,21,0.3)";
  if (score >= 5.0) return "rgba(251,146,60,0.3)";
  return "rgba(248,113,113,0.3)";
}

const ScoreRing = ({ score }) => {
  const color = getScoreColor(score);
  const pct = (score / 10) * 100;
  const r = 28, circ = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", width: 72, height: 72, flexShrink: 0 }}>
      <svg width="72" height="72" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="36" cy="36" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5" />
        <circle cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="5"
          strokeDasharray={circ} strokeDashoffset={circ - (pct / 100) * circ}
          strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s ease" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color, lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", letterSpacing: 1 }}>/10</span>
      </div>
    </div>
  );
};

const VerdictBadge = ({ verdict, score }) => (
  <div style={{
    padding: "4px 14px", borderRadius: 20, fontSize: 11, fontWeight: 700, letterSpacing: 2,
    background: getScoreBg(score), color: getScoreColor(score), border: `1px solid ${getScoreBorder(score)}`,
  }}>
    {verdict?.toUpperCase() || "UNRATED"}
  </div>
);

function shareCard(cafe) {
  const text = "Coffee: " + cafe.name + " - " + cafe.score + "/10 (" + cafe.verdict + ")\nLocation: " + cafe.suburb + ", " + cafe.city + "\n\nSee more at koffeereview.com.au";
  if (navigator.share) {
    navigator.share({ title: cafe.name, text });
  } else {
    window.open("https://wa.me/?text=" + encodeURIComponent(text), "_blank");
  }
}

export default function App() {
  const [cafes, setCafes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [sort, setSort] = useState("high");

  useEffect(() => {
    fetch(SHEET_URL)
      .then(r => r.text())
      .then(text => { setCafes(parseCSV(text)); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const cities = ["All", ...new Set(cafes.map(c => c.city))];
  let filtered = cafes
    .filter(c => city === "All" || c.city === city)
    .filter(c => c.name?.toLowerCase().includes(search.toLowerCase()) || c.suburb?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sort === "high" ? b.score - a.score : a.score - b.score);

  const mustVisit = cafes.filter(c => c.score >= 7.5).length;
  const avoid = cafes.filter(c => c.score < 5).length;
  const avg = cafes.length ? (cafes.reduce((s, c) => s + c.score, 0) / cafes.length).toFixed(1) : "0";

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", fontFamily: "'DM Sans', sans-serif", color: "#fff" }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
      <div style={{ position: "fixed", inset: 0, opacity: 0.03, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")", pointerEvents: "none", zIndex: 999 }} />

      <div style={{ padding: "40px 24px 24px", maxWidth: 800, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 12, marginBottom: 4 }}>
            <span style={{ fontSize: 36 }}>&#9749;</span>
            <div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 38, letterSpacing: 3, lineHeight: 1, background: "linear-gradient(135deg, #f5e6c8, #c8a96e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                OUR FAIR DINKUM
              </div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: 6, color: "rgba(255,255,255,0.35)" }}>
                KOFFEE REVIEW
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 8 }}>
            <a href="https://www.instagram.com/koffeereview" target="_blank" rel="noreferrer"
              style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", fontSize: 13, fontWeight: 600, letterSpacing: 1, padding: "6px 12px", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20 }}>
              IG
            </a>
            <a href="https://www.tiktok.com/@koffeereview" target="_blank" rel="noreferrer"
              style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", fontSize: 13, fontWeight: 600, letterSpacing: 1, padding: "6px 12px", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20 }}>
              TT
            </a>
            <a href="https://www.youtube.com/@koffeereview" target="_blank" rel="noreferrer"
              style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", fontSize: 13, fontWeight: 600, letterSpacing: 1, padding: "6px 12px", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20 }}>
              YT
            </a>
          </div>
        </div>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginTop: 8 }}>600+ cafes reviewed across Australia - Know before you go</p>

        {!loading && (
          <div style={{ display: "flex", gap: 16, marginTop: 24 }}>
            {[
              { label: "Reviewed", val: cafes.length },
              { label: "Must Visit", val: mustVisit, color: "#4ade80" },
              { label: "Avoid", val: avoid, color: "#f87171" },
              { label: "Avg Score", val: avg, color: "#facc15" },
            ].map(s => (
              <div key={s.label} style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "12px 16px" }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: s.color || "#fff", lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2, letterSpacing: 0.5 }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ padding: "0 24px 20px", maxWidth: 800, margin: "0 auto" }}>
        <input placeholder="Search cafe or suburb..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "12px 16px", color: "#fff", fontSize: 14, marginBottom: 12, outline: "none", boxSizing: "border-box" }} />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          {cities.map(c => (
            <button key={c} onClick={() => setCity(c)} style={{ padding: "7px 16px", borderRadius: 20, fontSize: 12, fontWeight: 500, cursor: "pointer", border: "1px solid rgba(255,255,255,0.15)", background: city === c ? "rgba(197,157,80,0.2)" : "transparent", color: city === c ? "#c8a96e" : "rgba(255,255,255,0.5)", transition: "all 0.2s" }}>
              {c}
            </button>
          ))}
          <div style={{ width: 1, background: "rgba(255,255,255,0.1)", margin: "0 4px", height: 20 }} />
          <button onClick={() => setSort("high")} style={{ padding: "7px 16px", borderRadius: 20, fontSize: 12, fontWeight: 500, cursor: "pointer", border: `1px solid ${sort === "high" ? "rgba(74,222,128,0.4)" : "rgba(255,255,255,0.15)"}`, background: sort === "high" ? "rgba(74,222,128,0.15)" : "transparent", color: sort === "high" ? "#4ade80" : "rgba(255,255,255,0.5)", transition: "all 0.2s" }}>
            High Score
          </button>
          <button onClick={() => setSort("low")} style={{ padding: "7px 16px", borderRadius: 20, fontSize: 12, fontWeight: 500, cursor: "pointer", border: `1px solid ${sort === "low" ? "rgba(248,113,113,0.4)" : "rgba(255,255,255,0.15)"}`, background: sort === "low" ? "rgba(248,113,113,0.15)" : "transparent", color: sort === "low" ? "#f87171" : "rgba(255,255,255,0.5)", transition: "all 0.2s" }}>
            Low Score
          </button>
        </div>
      </div>

      <div style={{ padding: "0 24px 60px", maxWidth: 800, margin: "0 auto" }}>
        {loading && <div style={{ textAlign: "center", padding: 60, color: "rgba(255,255,255,0.4)" }}>Loading cafes...</div>}
        {!loading && filtered.length === 0 && <div style={{ textAlign: "center", padding: 60, color: "rgba(255,255,255,0.3)" }}>No cafes found</div>}
        {filtered.map(cafe => (
          <div key={cafe.id}
            style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${selected?.id === cafe.id ? "rgba(197,157,80,0.4)" : "rgba(255,255,255,0.07)"}`, borderRadius: 16, padding: 20, marginBottom: 10, cursor: "pointer", transition: "all 0.2s", position: "relative", overflow: "hidden" }}
            onClick={() => setSelected(selected?.id === cafe.id ? null : cafe)}>

            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <ScoreRing score={cafe.score} />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontWeight: 600, fontSize: 16 }}>{cafe.name}</span>
                  <VerdictBadge verdict={cafe.verdict} score={cafe.score} />
                </div>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginTop: 3 }}>{cafe.suburb}, {cafe.city} - {cafe.price}</div>
              </div>
            </div>

            {selected?.id === cafe.id && (
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.6, margin: 0, fontStyle: "italic" }}>"{cafe.notes}"</p>
                <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ flex: 1, height: 4, borderRadius: 4, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${cafe.score * 10}%`, background: `linear-gradient(90deg, ${getScoreColor(cafe.score)}, ${getScoreColor(cafe.score)}99)`, borderRadius: 4 }} />
                  </div>
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: getScoreColor(cafe.score) }}>{cafe.score}/10</span>
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                  
                    href={"https://www.google.com/maps/search/" + encodeURIComponent(cafe.name + " " + cafe.suburb + " " + cafe.city)}
                    target="_blank" rel="noreferrer"
                    onClick={e => e.stopPropagation()}
                    style={{ flex: 1, padding: "10px", borderRadius: 10, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", textDecoration: "none", fontSize: 12, textAlign: "center", fontWeight: 500 }}>
                    Maps
                  </a>
                  <button
                    onClick={e => { e.stopPropagation(); shareCard(cafe); }}
                    style={{ flex: 1, padding: "10px", borderRadius: 10, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: 12, cursor: "pointer", fontWeight: 500 }}>
                    Share
                  </button>
                  
                    href={"https://wa.me/?text=" + encodeURIComponent("Coffee: " + cafe.name + " - " + cafe.score + "/10\nLocation: " + cafe.suburb + ", " + cafe.city + "\n\nSee full review at koffeereview.com.au")}
                    target="_blank" rel="noreferrer"
                    onClick={e => e.stopPropagation()}
                    style={{ flex: 1, padding: "10px", borderRadius: 10, background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.2)", color: "#25D366", textDecoration: "none", fontSize: 12, textAlign: "center", fontWeight: 500 }}>
                    WhatsApp
                  </a>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
