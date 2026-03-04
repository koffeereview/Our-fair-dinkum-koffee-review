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

const ScoreRing = ({ score }) => {
  const color = score >= 8 ? "#4ade80" : score >= 6 ? "#facc15" : "#f87171";
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

const VerdictBadge = ({ verdict }) => (
  <div style={{
    padding: "4px 14px", borderRadius: 20, fontSize: 11, fontWeight: 700, letterSpacing: 2,
    background: verdict === "GO" ? "rgba(74,222,128,0.15)" : "rgba(248,113,113,0.15)",
    color: verdict === "GO" ? "#4ade80" : "#f87171",
    border: `1px solid ${verdict === "GO" ? "rgba(74,222,128,0.3)" : "rgba(248,113,113,0.3)"}`,
  }}>
    {verdict === "GO" ? "✓ GO" : "✕ BIN"}
  </div>
);

export default function App() {
  const [cafes, setCafes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [city, setCity] = useState("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [sort, setSort] = useState("score");

  useEffect(() => {
    fetch(SHEET_URL)
      .then(r => r.text())
      .then(text => {
        setCafes(parseCSV(text));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const cities = ["All", ...new Set(cafes.map(c => c.city))];
  const verdicts = ["All", "GO", "BIN"];

  let filtered = cafes
    .filter(c => city === "All" || c.city === city)
    .filter(c => filter === "All" || c.verdict === filter)
    .filter(c => c.name?.toLowerCase().includes(search.toLowerCase()) || c.suburb?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sort === "score" ? b.score - a.score : a.name?.localeCompare(b.name));

  const go = cafes.filter(c => c.verdict === "GO").length;
  const bin = cafes.filter(c => c.verdict === "BIN").length;
  const avg = cafes.length ? (cafes.reduce((s, c) => s + c.score, 0) / cafes.length).toFixed(1) : "0";

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", fontFamily: "'DM Sans', sans-serif", color: "#fff" }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
      <div style={{ position: "fixed", inset: 0, opacity: 0.03, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")", pointerEvents: "none", zIndex: 999 }} />

      <div style={{ padding: "40px 24px 24px", maxWidth: 800, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 12, marginBottom: 4 }}>
          <span style={{ fontSize: 36 }}>☕</span>
          <div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 38, letterSpacing: 3, lineHeight: 1, background: "linear-gradient(135deg, #f5e6c8, #c8a96e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              OUR FAIR DINKUM
            </div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: 6, color: "rgba(255,255,255,0.35)" }}>
              KOFFEE REVIEW
            </div>
          </div>
        </div>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginTop: 8 }}>600+ cafés reviewed across Australia · Know before you go</p>

        {loading ? (
          <div style={{ textAlign: "center", padding: 40, color: "rgba(255,255,255,0.4)" }}>Loading cafés...</div>
        ) : (
          <div style={{ display: "flex", gap: 16, marginTop: 24 }}>
            {[
              { label: "Reviewed", val: cafes.length },
              { label: "Worth Going", val: go, color: "#4ade80" },
              { label: "Binned", val: bin, color: "#f87171" },
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
        <input placeholder="Search café or suburb..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "12px 16px", color: "#fff", fontSize: 14, marginBottom: 12, outline: "none", boxSizing: "border-box" }} />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {cities.map(c => (
            <button key={c} onClick={() => setCity(c)} style={{ padding: "7px 16px", borderRadius: 20, fontSize: 12, fontWeight: 500, cursor: "pointer", border: "1px solid rgba(255,255,255,0.15)", background: city === c ? "rgba(197,157,80,0.2)" : "transparent", color: city === c ? "#c8a96e" : "rgba(255,255,255,0.5)", transition: "all 0.2s" }}>
              {c}
            </button>
          ))}
          <div style={{ width: 1, background: "rgba(255,255,255,0.1)", margin: "0 4px" }} />
          {verdicts.map(v => (
            <button key={v} onClick={() => setFilter(v)} style={{ padding: "7px 16px", borderRadius: 20, fontSize: 12, fontWeight: 500, cursor: "pointer", border: `1px solid ${filter === v && v === "GO" ? "rgba(74,222,128,0.4)" : filter === v && v === "BIN" ? "rgba(248,113,113,0.4)" : "rgba(255,255,255,0.15)"}`, background: filter === v && v === "GO" ? "rgba(74,222,128,0.15)" : filter === v && v === "BIN" ? "rgba(248,113,113,0.15)" : filter === v ? "rgba(255,255,255,0.08)" : "transparent", color: filter === v && v === "GO" ? "#4ade80" : filter === v && v === "BIN" ? "#f87171" : "rgba(255,255,255,0.5)", transition: "all 0.2s" }}>
              {v === "GO" ? "✓ GO" : v === "BIN" ? "✕ BIN" : v}
            </button>
          ))}
          <div style={{ marginLeft: "auto" }}>
            <button onClick={() => setSort(s => s === "score" ? "name" : "score")} style={{ padding: "7px 14px", borderRadius: 20, fontSize: 12, cursor: "pointer", border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "rgba(255,255,255,0.4)" }}>
              Sort: {sort === "score" ? "Score ↓" : "A–Z"}
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: "0 24px 60px", maxWidth: 800, margin: "0 auto" }}>
        {!loading && filtered.length === 0 && <div style={{ textAlign: "center", padding: 60, color: "rgba(255,255,255,0.3)" }}>No cafés found</div>}
        {filtered.map(cafe => (
          <div key={cafe.id} onClick={() => setSelected(selected?.id === cafe.id ? null : cafe)}
            style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${selected?.id === cafe.id ? "rgba(197,157,80,0.4)" : "rgba(255,255,255,0.07)"}`, borderRadius: 16, padding: 20, marginBottom: 10, cursor: "pointer", transition: "all 0.2s", position: "relative", overflow: "hidden" }}>
            {cafe.score >= 8.5 && <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, background: "radial-gradient(circle, rgba(74,222,128,0.06), transparent 70%)", pointerEvents: "none" }} />}
            {cafe.score < 5 && <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, background: "radial-gradient(circle, rgba(248,113,113,0.06), transparent 70%)", pointerEvents: "none" }} />}
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <ScoreRing score={cafe.score} />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontWeight: 600, fontSize: 16 }}>{cafe.name}</span>
                  <VerdictBadge verdict={cafe.verdict} />
                </div>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginTop: 3 }}>{cafe.suburb}, {cafe.city} · {cafe.price}</div>
              </div>
            </div>
            {selected?.id === cafe.id && (
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.6, margin: 0, fontStyle: "italic" }}>"{cafe.notes}"</p>
                <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ flex: 1, height: 4, borderRadius: 4, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${cafe.score * 10}%`, background: cafe.score >= 8 ? "linear-gradient(90deg, #4ade80, #22c55e)" : cafe.score >= 6 ? "linear-gradient(90deg, #facc15, #f59e0b)" : "linear-gradient(90deg, #f87171, #ef4444)", borderRadius: 4 }} />
                  </div>
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: cafe.score >= 8 ? "#4ade80" : cafe.score >= 6 ? "#facc15" : "#f87171" }}>{cafe.score}/10</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
