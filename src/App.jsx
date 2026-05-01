import { useState, useEffect, useRef } from "react";

const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYEU8Khk3R5I879v3FcXPqhq0aCXa2ZWM1BwwJOyUitx2Boak_AFTOkwvB8qQrKIeU55NM4htFjHbI/pub?gid=0&single=true&output=csv";

function parseCSV(text) {
  const lines = text.trim().split("\n");
  
  function splitCSVLine(line) {
    const result = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  }

  const headers = splitCSVLine(lines[0]);
  return lines.slice(1).map(function(line, i) {
    const values = splitCSVLine(line);
    const obj = {};
    headers.forEach(function(h, idx) { obj[h] = values[idx] || ""; });
    obj.score = parseFloat(obj.score) || 0;
    obj.lat = parseFloat(obj.lat) || 0;
    obj.lng = parseFloat(obj.lng) || 0;
    obj.id = i + 1;
    return obj;
  });
}

function getScoreColor(score) {
  if (score >= 9.0) return "#ffffff";
  if (score >= 8.0) return "#4ade80";
  if (score >= 7.0) return "#2dd4bf";
  if (score >= 6.0) return "#facc15";
  if (score >= 5.0) return "#fb923c";
  return "#f87171";
}

function getScoreBg(score) {
  if (score >= 9.0) return "rgba(255,255,255,0.15)";
  if (score >= 8.0) return "rgba(74,222,128,0.15)";
  if (score >= 7.0) return "rgba(45,212,191,0.15)";
  if (score >= 6.0) return "rgba(250,204,21,0.15)";
  if (score >= 5.0) return "rgba(251,146,60,0.15)";
  return "rgba(248,113,113,0.15)";
}

function getScoreBorder(score) {
  if (score >= 9.0) return "rgba(255,255,255,0.3)";
  if (score >= 8.0) return "rgba(74,222,128,0.3)";
  if (score >= 7.0) return "rgba(45,212,191,0.3)";
  if (score >= 6.0) return "rgba(250,204,21,0.3)";
  if (score >= 5.0) return "rgba(251,146,60,0.3)";
  return "rgba(248,113,113,0.3)";
}

function getMapsUrl(cafe) {
  return "https://www.google.com/maps/search/" + encodeURIComponent(cafe.name + " " + cafe.suburb + " " + cafe.city);
}

function makeSlug(name, suburb) {
  return (name + "-" + suburb).toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function doShare(cafe) {
  const text = "Coffee: " + cafe.name + " - " + cafe.score + "/10. Location: " + cafe.suburb + ", " + cafe.city + ". koffeereview.com.au";
  if (navigator.share) {
    navigator.share({ title: cafe.name, text: text });
  } else {
    window.open("https://wa.me/?text=" + encodeURIComponent(text), "_blank");
  }
}

function ScoreRing(props) {
  const score = props.score;
  const color = getScoreColor(score);
  const pct = (score / 10) * 100;
  const r = 28;
  const circ = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", width: 72, height: 72, flexShrink: 0 }}>
      <svg width="72" height="72" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="36" cy="36" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5" />
        <circle cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="5"
          strokeDasharray={circ} strokeDashoffset={circ - (pct / 100) * circ}
          strokeLinecap="round" />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "'Bebas Neue', 'Bebas Neue Fallback', sans-serif", fontSize: 20, color: color, lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", letterSpacing: 1 }}>/10</span>
      </div>
    </div>
  );
}

function VerdictBadge(props) {
  const verdict = props.verdict;
  const score = props.score;
  return (
    <div style={{
      padding: "4px 14px", borderRadius: 20, fontSize: 11, fontWeight: 700, letterSpacing: 2,
      background: getScoreBg(score), color: getScoreColor(score), border: "1px solid " + getScoreBorder(score),
    }}>
      {verdict ? verdict.toUpperCase() : "UNRATED"}
    </div>
  );
}

const SCORE_BUCKETS = [
  { label: "9+ (Elite)", min: 9.0, max: 10, ref: 9.5 },
  { label: "8s (Great)", min: 8.0, max: 8.99, ref: 8.5 },
  { label: "7s (Solid)", min: 7.0, max: 7.99, ref: 7.5 },
  { label: "6s (Decent)", min: 6.0, max: 6.99, ref: 6.5 },
  { label: "5s (Meh)", min: 5.0, max: 5.99, ref: 5.5 },
  { label: "4s (Risky)", min: 4.0, max: 4.99, ref: 4.5 },
  { label: "3s (Bad)", min: 3.0, max: 3.99, ref: 3.5 },
  { label: "2s (Terrible)", min: 2.0, max: 2.99, ref: 2.5 },
  { label: "1s (Crime)", min: 1.0, max: 1.99, ref: 1.5 },
];

function clearAll(setSort, setQuickFilter, setScoreBucket, setCity) {
  setSort("all");
  setQuickFilter(null);
  setScoreBucket(null);
  setCity("All");
}

function ScoreChart({ cafes }) {
  const [open, setOpen] = useState(false);
  const buckets = [
    { label:"9+", min:9.0, max:10, ref:9.5 },
    { label:"8s", min:8.0, max:8.99, ref:8.5 },
    { label:"7s", min:7.0, max:7.99, ref:7.5 },
    { label:"6s", min:6.0, max:6.99, ref:6.5 },
    { label:"5s", min:5.0, max:5.99, ref:5.5 },
    { label:"4s", min:4.0, max:4.99, ref:4.5 },
    { label:"3s", min:3.0, max:3.99, ref:3.5 },
    { label:"2s", min:2.0, max:2.99, ref:2.5 },
    { label:"1s", min:1.0, max:1.99, ref:1.5 },
  ];
  const counts = buckets.map(function(b) {
    return cafes.filter(function(c) { return c.score >= b.min && c.score <= b.max; }).length;
  });
  const max = Math.max.apply(null, counts) || 1;
  return (
    <div style={{ background:"#0D0D0D", border:"1px solid rgba(255,255,255,0.16)", borderRadius:16, marginTop:16, overflow:"hidden" }}>
      <div onClick={function() { setOpen(!open); }}
        style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 20px", cursor:"pointer" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ display:"flex", alignItems:"flex-end", gap:3, height:18 }}>
            <div style={{ width:4, height:10, background:"#E6C073", borderRadius:2, opacity:0.6 }}></div>
            <div style={{ width:4, height:18, background:"#E6C073", borderRadius:2 }}></div>
            <div style={{ width:4, height:13, background:"#E6C073", borderRadius:2, opacity:0.7 }}></div>
          </div>
          <div style={{ fontSize:12, color:"#ffffff", letterSpacing:1, fontWeight:500 }}>SCORE DISTRIBUTION</div>
        </div>
        <div style={{ color:"#D9D9D9", fontSize:14, transition:"transform 0.3s", transform:open?"rotate(180deg)":"rotate(0deg)" }}>▼</div>
      </div>
      {open && (
        <div style={{ padding:"0 20px 16px" }}>
          <style>{`
            @keyframes growBar {
              from { width: 0%; }
              to { width: var(--bar-width); }
            }
          `}</style>
          {buckets.map(function(b, i) {
            const count = counts[i];
            const pct = (count / max) * 100;
            const color = getScoreColor(b.ref);
            return (
              <div key={b.label} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
                <div style={{ width:24, fontSize:11, color, fontFamily:"'Bebas Neue', 'Bebas Neue Fallback', sans-serif", letterSpacing:1 }}>{b.label}</div>
                <div style={{ flex:1, height:8, background:"rgba(255,255,255,0.06)", borderRadius:4, overflow:"hidden" }}>
                  <div style={{
                    height:"100%",
                    width: pct + "%",
                    background: color,
                    borderRadius:4,
                    opacity:0.8,
                    animation: "growBar 0.6s cubic-bezier(0.4,0,0.2,1) " + (i * 0.05) + "s both",
                    "--bar-width": pct + "%"
                  }}/>
                </div>
                <div style={{ width:20, fontSize:11, color:"rgba(255,255,255,0.4)", textAlign:"right" }}>{count}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function PullQuote(props) {
  const cafes = props.cafes;
  const withNotes = cafes.filter(function(c) { return c.notes && c.notes.length > 10; });
  if (withNotes.length === 0) return null;
  const random = withNotes[Math.floor(Math.random() * withNotes.length)];
  return (
    <div style={{ background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.16)", borderLeft: "3px solid #E6C073", borderRadius: 16, padding: "12px 16px", marginBottom: 16, display: "flex", gap: 12, alignItems: "flex-start" }}>
      <div style={{ color: "#E6C073", fontSize: 22, lineHeight: 1, marginTop: -2, flexShrink: 0 }}>"</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, color: "#D9D9D9", fontStyle: "italic", lineHeight: 1.6 }}>{random.notes.length > 100 ? random.notes.substring(0, 100) + "..." : random.notes}</div>
        <div style={{ fontSize: 11, color: "#E6C073", marginTop: 6, fontWeight: 600 }}>— {random.name}, {random.city}</div>
      </div>
    </div>
  );
}

function MapView(props) {
  const cafes = props.cafes;
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [selectedCafe, setSelectedCafe] = useState(null);
  const [locationError, setLocationError] = useState(false);

  useEffect(function() {
    if (mapInstanceRef.current) return;
    const L = window.L;
    if (!L) return;
    const validCafes = cafes.filter(function(c) { return c.lat && c.lng; });
    const avgLat = validCafes.length > 0 ? validCafes.reduce(function(s, c) { return s + c.lat; }, 0) / validCafes.length : -27.4698;
    const avgLng = validCafes.length > 0 ? validCafes.reduce(function(s, c) { return s + c.lng; }, 0) / validCafes.length : 153.0251;
    const map = L.map(mapRef.current).setView([avgLat, avgLng], 11);
    mapInstanceRef.current = map;
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "" }).addTo(map);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function(position) {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          map.setView([userLat, userLng], 13);
          const youAreHereIcon = L.divIcon({
            html: '<div style="background:#3b82f6;border:3px solid #fff;border-radius:50%;width:16px;height:16px;box-shadow:0 0 0 4px rgba(59,130,246,0.3);"></div>',
            className: "", iconSize: [16, 16], iconAnchor: [8, 8],
          });
          L.marker([userLat, userLng], { icon: youAreHereIcon }).addTo(map).bindPopup("You are here");
        },
        function() { setLocationError(true); }
      );
    }
    validCafes.forEach(function(cafe) {
      const color = getScoreColor(cafe.score);
      const markerHtml = '<div style="background:#0a0a0a;border:2px solid ' + color + ';border-radius:50%;width:40px;height:40px;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.5);overflow:hidden;">' +
        '<img src="/logo.webp" alt="Koffee Review" style="width:36px;height:36px;border-radius:50%;object-fit:cover;" /></div>' +
        '<div style="background:' + color + ';color:#000;border-radius:10px;font-size:10px;font-weight:700;text-align:center;margin-top:2px;padding:1px 5px;">' + cafe.score + '</div>';
      const icon = L.divIcon({ html: markerHtml, className: "", iconSize: [40, 55], iconAnchor: [20, 55] });
      const marker = L.marker([cafe.lat, cafe.lng], { icon: icon }).addTo(map);
      marker.on("click", function() { setSelectedCafe(cafe); });
    });
  }, [cafes]);

  return (
    <div style={{ position: "relative" }}>
      {locationError && (
        <div style={{ background: "rgba(251,146,60,0.15)", border: "1px solid rgba(251,146,60,0.3)", borderRadius: 10, padding: "10px 16px", marginBottom: 12, fontSize: 13, color: "#fb923c" }}>
          Location access denied — showing all cafes
        </div>
      )}
      <div ref={mapRef} style={{ height: "60vh", width: "100%", borderRadius: 16, overflow: "hidden" }} />
      {selectedCafe && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px 20px 0 0", padding: 20, zIndex: 1000 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
            <ScoreRing score={selectedCafe.score} />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <span style={{ fontWeight: 600, fontSize: 16 }}>{selectedCafe.name}</span>
                <VerdictBadge verdict={selectedCafe.verdict} score={selectedCafe.score} />
              </div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginTop: 3 }}>{selectedCafe.suburb}, {selectedCafe.city} - {selectedCafe.price}</div>
            </div>
            <button onClick={function() { setSelectedCafe(null); }}
              style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", borderRadius: "50%", width: 30, height: 30, cursor: "pointer", fontSize: 16 }}>×</button>
          </div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", fontStyle: "italic", margin: "0 0 12px" }}>"{selectedCafe.notes}"</p>
          <div style={{ display: "flex", gap: 8 }}>
            <a href={getMapsUrl(selectedCafe)} target="_blank" rel="noreferrer"
              style={{ flex: 1, padding: "10px", borderRadius: 10, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", textDecoration: "none", fontSize: 12, textAlign: "center", fontWeight: 500 }}>Maps</a>
            <button onClick={function() { doShare(selectedCafe); }}
              style={{ flex: 1, padding: "10px", borderRadius: 10, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: 12, cursor: "pointer", fontWeight: 500 }}>Share</button>
            {selectedCafe.link && (
              <a href={selectedCafe.link} target="_blank" rel="noreferrer"
                style={{ flex: 1, padding: "10px", borderRadius: 10, background: "rgba(197,157,80,0.15)", border: "1px solid rgba(197,157,80,0.3)", color: "#c8a96e", textDecoration: "none", fontSize: 12, textAlign: "center", fontWeight: 500 }}>Our Review</a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function AboutDrawer({ open, onClose }) {
  const [expanded, setExpanded] = useState(null);

  function toggle(id) {
    setExpanded(function(prev) { return prev === id ? null : id; });
  }

  return (
    <>
      {open && (
        <div onClick={onClose}
          style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:200, backdropFilter:"blur(4px)" }}/>
      )}
      <div style={{
        position:"fixed", top:0, left:0, right:0,
        background:"#111", borderBottom:"1px solid rgba(255,255,255,0.08)",
        transform:open?"translateY(0)":"translateY(-100%)",
        transition:"transform 0.35s cubic-bezier(0.4,0,0.2,1)",
        zIndex:201, maxHeight:"85vh", overflowY:"auto",
        WebkitOverflowScrolling:"touch", borderRadius:"0 0 24px 24px",
        boxShadow:"0 20px 60px rgba(0,0,0,0.6)"
      }}>
        {/* HEADER */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"20px 24px 16px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <img src="/logo.webp" alt="Koffee Review" style={{ width:36, height:36, borderRadius:"50%", objectFit:"cover" }}/>
            <div style={{ fontFamily:"'Bebas Neue', 'Bebas Neue Fallback', sans-serif", fontSize:16, letterSpacing:2, background:"linear-gradient(135deg,#f5e6c8,#c8a96e)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>OUR FAIR DINKUM KOFFEE REVIEW</div>
          </div>
          <button onClick={onClose}
            style={{ background:"rgba(255,255,255,0.08)", border:"none", color:"#fff", borderRadius:"50%", width:32, height:32, cursor:"pointer", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            ×
          </button>
        </div>

        {/* ACCORDION */}
        <div style={{ padding:"0 24px 32px", display:"flex", flexDirection:"column", gap:10 }}>

          {/* OUR STORY */}
          <div style={{ borderRadius:14, border:"1px solid " + (expanded==="story" ? "rgba(197,157,80,0.4)" : "rgba(255,255,255,0.08)"), overflow:"hidden", transition:"border 0.2s" }}>
            <button onClick={function() { toggle("story"); }}
              style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 18px", background: expanded==="story" ? "rgba(197,157,80,0.1)" : "rgba(255,255,255,0.03)", border:"none", color: expanded==="story" ? "#c8a96e" : "rgba(255,255,255,0.7)", fontSize:14, fontWeight:600, cursor:"pointer", textAlign:"left" }}>
              Our Story
              <span style={{ fontSize:12, transition:"transform 0.3s", transform: expanded==="story" ? "rotate(180deg)" : "rotate(0deg)", color:"rgba(255,255,255,0.3)" }}>▼</span>
            </button>
            {expanded==="story" && (
              <div style={{ padding:"0 18px 18px", background:"rgba(197,157,80,0.05)" }}>
                <p style={{ fontSize:13, color:"rgba(255,255,255,0.65)", lineHeight:1.9, margin:"0 0 10px" }}>In 2021, we started Koffee Review with a simple question. There are so many coffee shops out there, so when you're spending $4.50 to $5 on a cup back in 2021, shouldn't it actually be good?</p>
                <p style={{ fontSize:13, color:"rgba(255,255,255,0.65)", lineHeight:1.9, margin:"0 0 10px" }}>We're coffee lovers who drink 6 to 7 coffees a day. So we decided to travel across the country, visit different cafes, and review them based on what we personally feel about the coffee. No sponsorships, no agendas. Just our honest opinion.</p>
                <p style={{ fontSize:13, color:"rgba(255,255,255,0.65)", lineHeight:1.9, margin:"0 0 10px" }}>Over 600 cafes reviewed across Australia and yes, even a few from Spain, and we're still going.</p>
                <p style={{ fontSize:13, color:"rgba(255,255,255,0.65)", lineHeight:1.9, margin:0 }}>Now in 2026, we've built this website so it's easy for anyone to search for cafes and find real ratings before they visit.</p>
              </div>
            )}
          </div>

          {/* LEADERBOARD LINK */}
          <a href="/leaderboard" style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 18px", borderRadius:14, border:"1px solid rgba(255,215,0,0.25)", background:"rgba(255,215,0,0.06)", textDecoration:"none" }}>
            <span style={{ fontSize:14, fontWeight:600, color:"#FFD700" }}>Leaderboard</span>
            <span style={{ fontSize:12, color:"rgba(255,215,0,0.5)" }}>→</span>
          </a>

          {/* BEST BRISBANE LINK */}
          <a href="/best-coffee-brisbane" style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 18px", borderRadius:14, border:"1px solid rgba(197,157,80,0.25)", background:"rgba(197,157,80,0.06)", textDecoration:"none" }}>
            <span style={{ fontSize:14, fontWeight:600, color:"#c8a96e" }}>Best Coffee in Brisbane</span>
            <span style={{ fontSize:12, color:"rgba(197,157,80,0.5)" }}>→</span>
          </a>

          {/* CAFES TO AVOID */}
          <a href="/brisbane-cafes-to-avoid" style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 18px", borderRadius:14, border:"1px solid rgba(248,113,113,0.2)", background:"rgba(248,113,113,0.05)", textDecoration:"none" }}>
            <span style={{ fontSize:14, fontWeight:600, color:"#f87171" }}>Cafés to Avoid</span>
            <span style={{ fontSize:12, color:"rgba(248,113,113,0.4)" }}>→</span>
          </a>

          {/* EXPLORE BY CITY */}
          <div style={{ borderRadius:14, border:"1px solid " + (expanded==="explore" ? "rgba(197,157,80,0.4)" : "rgba(255,255,255,0.08)"), overflow:"hidden", transition:"border 0.2s" }}>
            <button onClick={function() { toggle("explore"); }}
              style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 18px", background: expanded==="explore" ? "rgba(197,157,80,0.1)" : "rgba(255,255,255,0.03)", border:"none", color: expanded==="explore" ? "#c8a96e" : "rgba(255,255,255,0.7)", fontSize:14, fontWeight:600, cursor:"pointer", textAlign:"left" }}>
              Explore
              <span style={{ fontSize:12, transition:"transform 0.3s", transform: expanded==="explore" ? "rotate(180deg)" : "rotate(0deg)", color:"rgba(255,255,255,0.3)" }}>▼</span>
            </button>
            {expanded==="explore" && (
              <div style={{ padding:"12px 18px 18px", background:"rgba(197,157,80,0.05)", display:"flex", flexDirection:"column", gap:8 }}>
                <div style={{ fontSize:10, letterSpacing:2, color:"rgba(197,157,80,0.5)", marginBottom:4 }}>BRISBANE</div>
                <a href="/city/brisbane" style={{ fontSize:13, color:"rgba(255,255,255,0.6)", textDecoration:"none", padding:"8px 12px", borderRadius:10, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", display:"flex", justifyContent:"space-between" }}>All Brisbane Cafés <span style={{ color:"rgba(255,255,255,0.2)" }}>→</span></a>
                <a href="/suburb/cbd-brisbane" style={{ fontSize:13, color:"rgba(255,255,255,0.6)", textDecoration:"none", padding:"8px 12px", borderRadius:10, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", display:"flex", justifyContent:"space-between" }}>CBD <span style={{ color:"rgba(255,255,255,0.2)" }}>→</span></a>
                <a href="/suburb/newstead-brisbane" style={{ fontSize:13, color:"rgba(255,255,255,0.6)", textDecoration:"none", padding:"8px 12px", borderRadius:10, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", display:"flex", justifyContent:"space-between" }}>Newstead <span style={{ color:"rgba(255,255,255,0.2)" }}>→</span></a>
                <a href="/suburb/chermside-brisbane" style={{ fontSize:13, color:"rgba(255,255,255,0.6)", textDecoration:"none", padding:"8px 12px", borderRadius:10, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", display:"flex", justifyContent:"space-between" }}>Chermside <span style={{ color:"rgba(255,255,255,0.2)" }}>→</span></a>
                <a href="/suburb/west-end-brisbane" style={{ fontSize:13, color:"rgba(255,255,255,0.6)", textDecoration:"none", padding:"8px 12px", borderRadius:10, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", display:"flex", justifyContent:"space-between" }}>West End <span style={{ color:"rgba(255,255,255,0.2)" }}>→</span></a>
                <a href="/suburb/fortitude-valley-brisbane" style={{ fontSize:13, color:"rgba(255,255,255,0.6)", textDecoration:"none", padding:"8px 12px", borderRadius:10, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", display:"flex", justifyContent:"space-between" }}>Fortitude Valley <span style={{ color:"rgba(255,255,255,0.2)" }}>→</span></a>
                <a href="/suburb/paddington-brisbane" style={{ fontSize:13, color:"rgba(255,255,255,0.6)", textDecoration:"none", padding:"8px 12px", borderRadius:10, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", display:"flex", justifyContent:"space-between" }}>Paddington <span style={{ color:"rgba(255,255,255,0.2)" }}>→</span></a>
                <a href="/suburb/south-brisbane-brisbane" style={{ fontSize:13, color:"rgba(255,255,255,0.6)", textDecoration:"none", padding:"8px 12px", borderRadius:10, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", display:"flex", justifyContent:"space-between" }}>South Brisbane <span style={{ color:"rgba(255,255,255,0.2)" }}>→</span></a>
                <a href="/suburb/hamilton-brisbane" style={{ fontSize:13, color:"rgba(255,255,255,0.6)", textDecoration:"none", padding:"8px 12px", borderRadius:10, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", display:"flex", justifyContent:"space-between" }}>Hamilton <span style={{ color:"rgba(255,255,255,0.2)" }}>→</span></a>
                <a href="/suburb/woolloongabba-brisbane" style={{ fontSize:13, color:"rgba(255,255,255,0.6)", textDecoration:"none", padding:"8px 12px", borderRadius:10, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", display:"flex", justifyContent:"space-between" }}>Woolloongabba <span style={{ color:"rgba(255,255,255,0.2)" }}>→</span></a>
                <a href="/suburb/upper-mount-gravatt-brisbane" style={{ fontSize:13, color:"rgba(255,255,255,0.6)", textDecoration:"none", padding:"8px 12px", borderRadius:10, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", display:"flex", justifyContent:"space-between" }}>Upper Mount Gravatt <span style={{ color:"rgba(255,255,255,0.2)" }}>→</span></a>

                <div style={{ fontSize:10, letterSpacing:2, color:"rgba(197,157,80,0.5)", marginTop:8, marginBottom:4 }}>GOLD COAST</div>
                <a href="/city/gold-coast" style={{ fontSize:13, color:"rgba(255,255,255,0.6)", textDecoration:"none", padding:"8px 12px", borderRadius:10, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", display:"flex", justifyContent:"space-between" }}>All Gold Coast Cafés <span style={{ color:"rgba(255,255,255,0.2)" }}>→</span></a>
                <a href="/best-coffee-gold-coast" style={{ fontSize:13, color:"rgba(255,255,255,0.6)", textDecoration:"none", padding:"8px 12px", borderRadius:10, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", display:"flex", justifyContent:"space-between" }}>Best Coffee Gold Coast <span style={{ color:"rgba(255,255,255,0.2)" }}>→</span></a>
                <a href="/suburb/burleigh-heads-gold-coast" style={{ fontSize:13, color:"rgba(255,255,255,0.6)", textDecoration:"none", padding:"8px 12px", borderRadius:10, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", display:"flex", justifyContent:"space-between" }}>Burleigh Heads <span style={{ color:"rgba(255,255,255,0.2)" }}>→</span></a>

                <div style={{ fontSize:10, letterSpacing:2, color:"rgba(197,157,80,0.5)", marginTop:8, marginBottom:4 }}>MORE CITIES</div>
                <a href="/city/moreton-bay" style={{ fontSize:13, color:"rgba(255,255,255,0.6)", textDecoration:"none", padding:"8px 12px", borderRadius:10, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", display:"flex", justifyContent:"space-between" }}>Moreton Bay <span style={{ color:"rgba(255,255,255,0.2)" }}>→</span></a>
                <a href="/city/sunshine-coast" style={{ fontSize:13, color:"rgba(255,255,255,0.6)", textDecoration:"none", padding:"8px 12px", borderRadius:10, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", display:"flex", justifyContent:"space-between" }}>Sunshine Coast <span style={{ color:"rgba(255,255,255,0.2)" }}>→</span></a>
                <a href="/city/ipswich" style={{ fontSize:13, color:"rgba(255,255,255,0.6)", textDecoration:"none", padding:"8px 12px", borderRadius:10, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", display:"flex", justifyContent:"space-between" }}>Ipswich <span style={{ color:"rgba(255,255,255,0.2)" }}>→</span></a>
                <a href="/city/logan" style={{ fontSize:13, color:"rgba(255,255,255,0.6)", textDecoration:"none", padding:"8px 12px", borderRadius:10, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", display:"flex", justifyContent:"space-between" }}>Logan <span style={{ color:"rgba(255,255,255,0.2)" }}>→</span></a>
                <a href="/city/redland" style={{ fontSize:13, color:"rgba(255,255,255,0.6)", textDecoration:"none", padding:"8px 12px", borderRadius:10, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", display:"flex", justifyContent:"space-between" }}>Redland <span style={{ color:"rgba(255,255,255,0.2)" }}>→</span></a>
                <a href="/city/melbourne" style={{ fontSize:13, color:"rgba(255,255,255,0.6)", textDecoration:"none", padding:"8px 12px", borderRadius:10, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", display:"flex", justifyContent:"space-between" }}>Melbourne <span style={{ color:"rgba(255,255,255,0.2)" }}>→</span></a>
                <a href="/city/sydney" style={{ fontSize:13, color:"rgba(255,255,255,0.6)", textDecoration:"none", padding:"8px 12px", borderRadius:10, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", display:"flex", justifyContent:"space-between" }}>Sydney <span style={{ color:"rgba(255,255,255,0.2)" }}>→</span></a>
              </div>
            )}
          </div>

          {/* OUR METHOD */}
          <div style={{ borderRadius:14, border:"1px solid " + (expanded==="method" ? "rgba(197,157,80,0.4)" : "rgba(255,255,255,0.08)"), overflow:"hidden", transition:"border 0.2s" }}>
            <button onClick={function() { toggle("method"); }}
              style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 18px", background: expanded==="method" ? "rgba(197,157,80,0.1)" : "rgba(255,255,255,0.03)", border:"none", color: expanded==="method" ? "#c8a96e" : "rgba(255,255,255,0.7)", fontSize:14, fontWeight:600, cursor:"pointer", textAlign:"left" }}>
              Our Method
              <span style={{ fontSize:12, transition:"transform 0.3s", transform: expanded==="method" ? "rotate(180deg)" : "rotate(0deg)", color:"rgba(255,255,255,0.3)" }}>▼</span>
            </button>
            {expanded==="method" && (
              <div style={{ padding:"0 18px 18px", background:"rgba(197,157,80,0.05)" }}>
                <div style={{ background:"rgba(197,157,80,0.08)", border:"1px solid rgba(197,157,80,0.2)", borderRadius:12, padding:"12px 16px", marginBottom:16, marginTop:4 }}>
                  <div style={{ fontSize:13, color:"#c8a96e", fontWeight:700, marginBottom:4 }}>Same order. Every time.</div>
                  <div style={{ fontSize:12, color:"rgba(255,255,255,0.5)", lineHeight:1.7 }}>One Latte & One Double Shot Espresso, no exceptions. That's how we keep every review fair and consistent.</div>
                </div>
                <p style={{ fontSize:12, color:"rgba(255,255,255,0.45)", lineHeight:1.7, margin:"0 0 16px" }}>We look for balance, strength, and whether it leaves you wanting another sip. We don't overhype. We score coffee purely on the taste we personally enjoy.</p>
                {[
                  { range:"5.1 to 5.9", label:"Just Okay", desc:"Average cup. Drinkable, not memorable.", ref:5.5 },
                  { range:"6.1 to 6.9", label:"Good Coffee", desc:"If we're around, we'll have it but we won't travel for it.", ref:6.5 },
                  { range:"7.1 to 7.9", label:"Really Good", desc:"We'd happily travel up to 5km just to have this again.", ref:7.5 },
                  { range:"8.1 to 8.9", label:"Great Coffee 👑", desc:"Top tier. Sits on the king seat.", ref:8.5 },
                  { range:"9.1 to 9.9", label:"Elite / Anytime Coffee", desc:"Rare level. Exceptional taste. We'll go anywhere for this, any day, any time.", ref:9.5 },
                ].map(function(item) {
                  const color = getScoreColor(item.ref);
                  return (
                    <div key={item.range} style={{ borderLeft:"2px solid "+color, paddingLeft:12, marginBottom:14 }}>
                      <div style={{ fontSize:13, color:color, fontWeight:700 }}>{item.range} — {item.label}</div>
                      <div style={{ fontSize:12, color:"rgba(255,255,255,0.45)", marginTop:3, lineHeight:1.6 }}>{item.desc}</div>
                    </div>
                  );
                })}
                <div style={{ marginTop:16, padding:"12px 16px", background:"rgba(255,255,255,0.03)", borderRadius:12, border:"1px solid rgba(255,255,255,0.06)" }}>
                  <p style={{ fontSize:13, color:"rgba(197,157,80,0.8)", fontStyle:"italic", margin:0, textAlign:"center", lineHeight:1.6 }}>600+ cups in. Still chasing that perfect 10.</p>
                </div>
                <a href="/how-we-score.html" style={{ display:"block", marginTop:14, textAlign:"center", fontSize:13, color:"#c8a96e", textDecoration:"none", padding:"12px", borderRadius:12, border:"1px solid rgba(197,157,80,0.25)", background:"rgba(197,157,80,0.06)" }}>
                  Read the full methodology →
                </a>
              </div>
            )}
          </div>

          {/* HOW WE OPERATE removed from drawer - lives in footer as Disclosure */}

          {/* CONTACT */}
          <div style={{ borderRadius:14, border:"1px solid " + (expanded==="contact" ? "rgba(197,157,80,0.4)" : "rgba(255,255,255,0.08)"), overflow:"hidden", transition:"border 0.2s" }}>
            <button onClick={function() { toggle("contact"); }}
              style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 18px", background: expanded==="contact" ? "rgba(197,157,80,0.1)" : "rgba(255,255,255,0.03)", border:"none", color: expanded==="contact" ? "#c8a96e" : "rgba(255,255,255,0.7)", fontSize:14, fontWeight:600, cursor:"pointer", textAlign:"left" }}>
              Contact
              <span style={{ fontSize:12, transition:"transform 0.3s", transform: expanded==="contact" ? "rotate(180deg)" : "rotate(0deg)", color:"rgba(255,255,255,0.3)" }}>▼</span>
            </button>
            {expanded==="contact" && (
              <div style={{ padding:"0 18px 18px", background:"rgba(197,157,80,0.05)", display:"flex", flexDirection:"column", gap:10, marginTop:4 }}>
                <a href="https://www.instagram.com/koffeereview" target="_blank" rel="noreferrer"
                  style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 16px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, textDecoration:"none", color:"#fff" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  <div><div style={{ fontSize:13, fontWeight:600 }}>Instagram</div><div style={{ fontSize:11, color:"rgba(255,255,255,0.4)" }}>@koffeereview</div></div>
                </a>
                <a href="https://www.tiktok.com/@koffeereview" target="_blank" rel="noreferrer"
                  style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 16px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, textDecoration:"none", color:"#fff" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.54V6.78a4.85 4.85 0 01-1.02-.09z"/></svg>
                  <div><div style={{ fontSize:13, fontWeight:600 }}>TikTok</div><div style={{ fontSize:11, color:"rgba(255,255,255,0.4)" }}>@koffeereview</div></div>
                </a>
                <a href="https://www.youtube.com/@koffeereview" target="_blank" rel="noreferrer"
                  style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 16px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, textDecoration:"none", color:"#fff" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg>
                  <div><div style={{ fontSize:13, fontWeight:600 }}>YouTube</div><div style={{ fontSize:11, color:"rgba(255,255,255,0.4)" }}>@koffeereview</div></div>
                </a>
                <a href="https://linktr.ee/koffeereview" target="_blank" rel="noreferrer"
                  style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 16px", background:"rgba(197,157,80,0.08)", border:"1px solid rgba(197,157,80,0.2)", borderRadius:12, textDecoration:"none", color:"#c8a96e" }}>
                  <span style={{ fontSize:20 }}>🔗</span>
                  <div><div style={{ fontSize:13, fontWeight:600 }}>Linktree</div><div style={{ fontSize:11, color:"rgba(197,157,80,0.5)" }}>linktr.ee/koffeereview</div></div>
                </a>
              </div>
            )}
          </div>

          {/* ABOUT US — last item in drawer */}
          <a href="/about"
            style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 18px", borderRadius:14, border:"1px solid rgba(255,255,255,0.08)", background:"rgba(255,255,255,0.03)", textDecoration:"none" }}>
            <span style={{ fontSize:14, fontWeight:600, color:"rgba(255,255,255,0.7)" }}>About Us</span>
            <span style={{ fontSize:12, color:"rgba(255,255,255,0.3)" }}>→</span>
          </a>

        </div>
      </div>
    </>
  );
}

export default function App() {
  const [cafes, setCafes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [sort, setSort] = useState("all");
  const [quickFilter, setQuickFilter] = useState(null);
  const [scoreBucket, setScoreBucket] = useState(null);
  const [scoreDropdown, setScoreDropdown] = useState(false);
  const [cityDropdown, setCityDropdown] = useState(false);
  const [view, setView] = useState("list");
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [suggestName, setSuggestName] = useState("");
  const [suggestSuburb, setSuggestSuburb] = useState("");
  const [suggestCity, setSuggestCity] = useState("");
  const [suggestDone, setSuggestDone] = useState(false);
  const [suggestNominee, setSuggestNominee] = useState("");
  const [suggestWhy, setSuggestWhy] = useState("");
  const [shareCardUrl, setShareCardUrl] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [nearMe, setNearMe] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const scoreRef = useRef(null);
  const cityRef = useRef(null);

  useEffect(function() {
    fetch(SHEET_URL)
      .then(function(r) { return r.text(); })
      .then(function(text) { setCafes(parseCSV(text)); setLoading(false); })
      .catch(function() { setLoading(false); });
  }, []);

  // PULL TO REFRESH
  useEffect(function() {
    let startY = 0;
    let isPulling = false;
    function onTouchStart(e) { startY = e.touches[0].clientY; }
    function onTouchMove(e) { if (window.scrollY === 0 && e.touches[0].clientY - startY > 80) { isPulling = true; } }
    function onTouchEnd() {
      if (isPulling) {
        isPulling = false;
        setLoading(true);
        fetch(SHEET_URL)
          .then(function(r) { return r.text(); })
          .then(function(text) { setCafes(parseCSV(text)); setLoading(false); })
          .catch(function() { setLoading(false); });
      }
    }
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    return function() {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  useEffect(function() {
    if (view === "map" && !leafletLoaded) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
      document.head.appendChild(link);
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
      script.onload = function() { setLeafletLoaded(true); };
      document.head.appendChild(script);
    }
  }, [view]);

  useEffect(function() {
    function handleClick(e) {
      if (scoreRef.current && !scoreRef.current.contains(e.target)) setScoreDropdown(false);
      if (cityRef.current && !cityRef.current.contains(e.target)) setCityDropdown(false);
    }
    document.addEventListener("mousedown", handleClick);
    return function() { document.removeEventListener("mousedown", handleClick); };
  }, []);

  const allCities = Array.from(new Set(cafes.map(function(c) { return c.city; }))).sort();
  const mustVisit = cafes.filter(function(c) { return c.score >= 7.5; }).length;
  const avoid = cafes.filter(function(c) { return c.score < 4.0; }).length;

  function handleStatClick(type) {
    if (quickFilter === type) { setQuickFilter(null); } else { setQuickFilter(type); setScoreBucket(null); setSort("all"); }
    setNearMe(false); setUserLocation(null);
  }
  function handleSortClick(val) { setSort(val); setQuickFilter(null); setScoreBucket(null); setNearMe(false); setUserLocation(null); }
  function handleReviewedClick() { clearAll(setSort, setQuickFilter, setScoreBucket, setCity); setSearch(""); setView("list"); setNearMe(false); setUserLocation(null); }
  function handleBucketSelect(bucket) {
    if (scoreBucket === bucket.label) { setScoreBucket(null); } else { setScoreBucket(bucket.label); setQuickFilter(null); }
    setScoreDropdown(false);
    setNearMe(false); setUserLocation(null);
  }

  function getDistance(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  }

  function handleNearMe() {
    if (nearMe) { setNearMe(false); setUserLocation(null); setSort("all"); return; }
    setLocationLoading(true);
    setSort("nearme");
    setQuickFilter(null);
    setScoreBucket(null);
    navigator.geolocation.getCurrentPosition(
      function(pos) {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setNearMe(true);
        setLocationLoading(false);
        setView("list");
      },
      function() {
        setLocationLoading(false);
        setSort("all");
        alert("Could not get your location. Please allow location access and try again.");
      }
    );
  }

  const SPAIN_CITIES = ["barcelona", "catalonia", "spain"];

  // Calculate best cafe per suburb (Australian cafes only, 7.5+ score)
  const bestInSuburb = {};
  cafes.forEach(function(c) {
    if (SPAIN_CITIES.includes((c.city || "").toLowerCase())) return;
    if (c.score < 7.5) return;
    const key = (c.suburb + "-" + c.city).toLowerCase();
    if (!bestInSuburb[key] || c.score > bestInSuburb[key].score) {
      bestInSuburb[key] = c;
    }
  });

  const filtered = cafes
    .filter(function(c) { return city === "All" || c.city === city; })
    .filter(function(c) {
      const s = search.toLowerCase();
      return (c.name && c.name.toLowerCase().includes(s)) || (c.suburb && c.suburb.toLowerCase().includes(s)) || (c.city && c.city.toLowerCase().includes(s));
    })
    .filter(function(c) {
      if (quickFilter === "must") return c.score >= 7.5;
      if (quickFilter === "avoid") return c.score < 4.0;
      if (scoreBucket) {
        const bucket = SCORE_BUCKETS.find(function(b) { return b.label === scoreBucket; });
        if (bucket) return c.score >= bucket.min && c.score <= bucket.max;
      }
      return true;
    })
    .map(function(c) {
      if (nearMe && userLocation && c.lat && c.lng && Math.abs(c.lat) > 1) {
        c._distance = getDistance(userLocation.lat, userLocation.lng, c.lat, c.lng);
      } else {
        c._distance = null;
      }
      return c;
    })
    .filter(function(c) {
      if (nearMe && userLocation) {
        const withinDistance = c._distance !== null && c._distance <= 4;
        const inCity = city === "All" || c.city === city;
        return withinDistance && inCity;
      }
      return true;
    })
    .sort(function(a, b) {
      if (nearMe && userLocation) return (a._distance || 999) - (b._distance || 999);
      if (sort === "high") return b.score - a.score;
      if (sort === "low") return a.score - b.score;
      return (a.name || "").localeCompare(b.name || "");
    });
  const btnBase = { padding: "7px 16px", borderRadius: 20, fontSize: 12, fontWeight: 500, cursor: "pointer", transition: "all 0.2s" };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", fontFamily: "'DM Sans', sans-serif", color: "#fff" }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
      <AboutDrawer open={aboutOpen} onClose={function() { setAboutOpen(false); }} />

      <div style={{ padding: "32px 28px 24px", maxWidth: 800, margin: "0 auto" }}>

        {/* HEADER ROW — Logo+Title LEFT, Drawer RIGHT */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img src="/logo.webp" alt="Koffee Review" style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: "2px solid rgba(230,192,115,0.3)" }} />
            <div>
              <div style={{ fontFamily: "'Bebas Neue', 'Bebas Neue Fallback', sans-serif", fontSize: "min(50px, 7.5vw)", whiteSpace: "nowrap", letterSpacing: 4, lineHeight: 1, background: "linear-gradient(135deg, #F6DDAA, #E6C073)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                OUR FAIR DINKUM
              </div>
              <div style={{ fontFamily: "'Bebas Neue', 'Bebas Neue Fallback', sans-serif", fontSize: "min(22px, 3.8vw)", whiteSpace: "nowrap", letterSpacing: 7, color: "#D9D9D9" }}>
                KOFFEE REVIEW
              </div>
            </div>
          </div>
          <button onClick={function() { setAboutOpen(true); }}
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.16)", borderRadius: 12, color: "#fff", padding: "10px 12px", cursor: "pointer", fontSize: 18, flexShrink: 0, transition: "all 0.2s" }}>
            ☰
          </button>
        </div>

        {/* HERO TEXT */}
        <div style={{ marginBottom: 16 }}>
          <p style={{ color: "#ffffff", fontSize: 15, fontWeight: 600, margin: "0 0 3px", letterSpacing: 0.3 }}>600+ cafés reviewed across Australia</p>
          <p style={{ color: "#E6C073", fontSize: 13, margin: 0 }}>Know before you go.</p>
        </div>

        {/* BRAND RULE */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ height: 1, background: "linear-gradient(90deg, #E6C073, transparent)", marginBottom: 10, width: "60%" }} />
          <p style={{ color: "#E6C073", fontSize: 12, fontWeight: 700, margin: "0 0 2px", letterSpacing: 0.5 }}>We order the same thing every time.</p>
          <p style={{ color: "#D9D9D9", fontSize: 12, margin: 0 }}>Latte + Double Espresso.</p>
        </div>

        {/* SOCIAL ICONS + SUGGEST */}
        <div style={{ display: "flex", gap: 10, alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <a href="https://www.instagram.com/koffeereview" target="_blank" rel="noreferrer"
              style={{ textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", width: 38, height: 38, borderRadius: 12, background: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)", color: "#fff", flexShrink: 0, transition: "transform 0.2s" }}>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            <a href="https://www.tiktok.com/@koffeereview" target="_blank" rel="noreferrer"
              style={{ textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", width: 38, height: 38, borderRadius: 12, background: "#000", border: "1px solid rgba(255,255,255,0.22)", color: "#fff", flexShrink: 0, transition: "transform 0.2s" }}>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.54V6.78a4.85 4.85 0 01-1.02-.09z"/></svg>
            </a>
            <a href="https://www.youtube.com/@koffeereview" target="_blank" rel="noreferrer"
              style={{ textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", width: 38, height: 38, borderRadius: 12, background: "#ff0000", color: "#fff", flexShrink: 0, transition: "transform 0.2s" }}>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg>
            </a>
          </div>
          <button onClick={function() { setSuggestOpen(true); setSuggestDone(false); setSuggestName(""); setSuggestSuburb(""); setSuggestCity(""); setSuggestNominee(""); setSuggestWhy(""); setView("list"); }}
            style={{ background: "linear-gradient(135deg, #E6C073, #F6DDAA)", border: "none", cursor: "pointer", padding: "9px 18px", borderRadius: 20, display: "flex", alignItems: "center", gap: 4, boxShadow: "0 0 12px rgba(230,192,115,0.25)", transition: "transform 0.2s" }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#000", letterSpacing: 0.5 }}>+ Suggest a Café</span>
          </button>
        </div>

        {/* SUGGEST MODAL */}
        {suggestOpen && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 300, display: "flex", alignItems: "flex-end", justifyContent: "center" }}
            onClick={function(e) { if (e.target === e.currentTarget) setSuggestOpen(false); }}>
            <div style={{ background: "#111", borderRadius: "20px 20px 0 0", padding: 24, width: "100%", maxWidth: 500, border: "1px solid rgba(255,255,255,0.08)" }}>
              {!suggestDone ? (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#c8a96e", letterSpacing: 1 }}>SUGGEST A CAFÉ</div>
                    <button onClick={function() { setSuggestOpen(false); }} style={{ background: "rgba(255,255,255,0.08)", border: "none", color: "#fff", borderRadius: "50%", width: 28, height: 28, cursor: "pointer", fontSize: 16 }}>×</button>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <input value={suggestName} onChange={function(e) { setSuggestName(e.target.value); }} placeholder="Café name"
                      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "12px 14px", color: "#fff", fontSize: 14, outline: "none", fontFamily: "'DM Sans', sans-serif" }} />
                    <input value={suggestSuburb} onChange={function(e) { setSuggestSuburb(e.target.value); }} placeholder="Suburb"
                      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "12px 14px", color: "#fff", fontSize: 14, outline: "none", fontFamily: "'DM Sans', sans-serif" }} />
                    <input value={suggestCity} onChange={function(e) { setSuggestCity(e.target.value); }} placeholder="City"
                      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "12px 14px", color: "#fff", fontSize: 14, outline: "none", fontFamily: "'DM Sans', sans-serif" }} />
                    <input value={suggestNominee} onChange={function(e) { setSuggestNominee(e.target.value); }} placeholder="Your name or @handle (optional)"
                      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "12px 14px", color: "#fff", fontSize: 14, outline: "none", fontFamily: "'DM Sans', sans-serif" }} />
                    <textarea value={suggestWhy} onChange={function(e) { setSuggestWhy(e.target.value); }} placeholder="Why should we visit? (optional)" rows={2}
                      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "12px 14px", color: "#fff", fontSize: 14, outline: "none", fontFamily: "'DM Sans', sans-serif", resize: "none" }} />
                    <button onClick={function() {
                      if (!suggestName.trim() || !suggestCity.trim()) return;
                      fetch("https://script.google.com/macros/s/AKfycbwujHwDH5lzmhJw9Sx4dFMuy41-LYCoKlkoTOIIYmwWB_8xxpQVCbaaAUgqOG5gYUCL/exec", {
                        method: "POST",
                        body: JSON.stringify({ name: suggestName, suburb: suggestSuburb, city: suggestCity, nominee: suggestNominee, why: suggestWhy })
                      }).catch(function() {});
                      setSuggestDone(true);
                    }} style={{ padding: "13px", borderRadius: 12, background: "linear-gradient(135deg, #c8a96e, #f5e6c8)", border: "none", color: "#0a0a0a", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginTop: 4, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                      <img src="/logo.webp" alt="Koffee Review" style={{ width: 20, height: 20, borderRadius: "50%", objectFit: "cover" }} />
                      Submit Suggestion
                    </button>
                  </div>
                </>
              ) : (
                <div style={{ textAlign: "center", padding: "28px 0" }}>
                  <div style={{ fontSize: 32, marginBottom: 12, color: "#c8a96e" }}>✓</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Café submitted.</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 24, lineHeight: 1.7 }}>We'll add it to the visit list.</div>
                  <button onClick={function() { setSuggestOpen(false); }} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "10px 24px", borderRadius: 10, fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Close</button>
                </div>
              )}
            </div>
          </div>
        )}

        {!loading && <ScoreChart cafes={cafes} />}

        {/* HOW WE SCORE BLOCK */}
        {!loading && cafes.length > 0 && (
          <a href="/how-we-score.html" style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:8, marginBottom:8, padding:"12px 14px", borderRadius:10, background:"#1a1a1a", borderLeft:"2px solid #C9A84C", textDecoration:"none" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ display:"flex", alignItems:"flex-end", gap:3, height:14 }}>
                <div style={{ width:3, height:8, background:"#E6C073", borderRadius:2, opacity:0.6 }}></div>
                <div style={{ width:3, height:14, background:"#E6C073", borderRadius:2 }}></div>
                <div style={{ width:3, height:10, background:"#E6C073", borderRadius:2, opacity:0.7 }}></div>
              </div>
              <div style={{ fontSize:10, fontWeight:700, letterSpacing:2, color:"#E6C073", textTransform:"uppercase" }}>How We Score</div>
              <div style={{ fontSize:11, color:"#ffffff", letterSpacing:0.5 }}>· One latte. One espresso. Every time.</div>
            </div>
            <div style={{ fontSize:18, color:"#C9A84C", marginLeft:8, flexShrink:0 }}>›</div>
          </a>
        )}

        {!loading && (
          <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
            <div onClick={handleReviewedClick}
              style={{ flex: 1, background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.16)", borderRadius: 16, padding: "14px 16px", cursor: "pointer", transition: "all 0.2s" }}>
              <div style={{ fontFamily: "'Bebas Neue', 'Bebas Neue Fallback', sans-serif", fontSize: 32, color: "#fff", lineHeight: 1 }}>{cafes.length}</div>
              <div style={{ height: 2, background: "linear-gradient(90deg, #E6C073, #F6DDAA)", borderRadius: 2, margin: "8px 0" }} />
              <div style={{ fontSize: 11, color: "#AFAFAF", letterSpacing: 0.5 }}>Reviewed</div>
            </div>
            <div onClick={function() { handleStatClick("must"); setView("list"); }}
              style={{ flex: 1, background: quickFilter === "must" ? "rgba(78,220,119,0.15)" : "#0D0D0D", border: "1px solid " + (quickFilter === "must" ? "rgba(78,220,119,0.5)" : "rgba(255,255,255,0.16)"), borderRadius: 16, padding: "14px 16px", cursor: "pointer", transition: "all 0.2s" }}>
              <div style={{ fontFamily: "'Bebas Neue', 'Bebas Neue Fallback', sans-serif", fontSize: 32, color: "#4EDC77", lineHeight: 1 }}>{mustVisit}</div>
              <div style={{ height: 2, background: "linear-gradient(90deg, #E6C073, #F6DDAA)", borderRadius: 2, margin: "8px 0" }} />
              <div style={{ fontSize: 11, color: quickFilter === "must" ? "#4EDC77" : "#AFAFAF", letterSpacing: 0.5 }}>Must Visit</div>
            </div>
            <div onClick={function() { handleStatClick("avoid"); setView("list"); }}
              style={{ flex: 1, background: quickFilter === "avoid" ? "rgba(255,94,102,0.15)" : "#0D0D0D", border: "1px solid " + (quickFilter === "avoid" ? "rgba(255,94,102,0.5)" : "rgba(255,255,255,0.16)"), borderRadius: 16, padding: "14px 16px", cursor: "pointer", transition: "all 0.2s" }}>
              <div style={{ fontFamily: "'Bebas Neue', 'Bebas Neue Fallback', sans-serif", fontSize: 32, color: "#FF5E66", lineHeight: 1 }}>{avoid}</div>
              <div style={{ height: 2, background: "linear-gradient(90deg, #E6C073, #F6DDAA)", borderRadius: 2, margin: "8px 0" }} />
              <div style={{ fontSize: 11, color: quickFilter === "avoid" ? "#FF5E66" : "#AFAFAF", letterSpacing: 0.5 }}>Avoid</div>
            </div>
            <div onClick={function() { setView(view === "map" ? "list" : "map"); }}
              style={{ flex: 1, background: view === "map" ? "rgba(230,192,115,0.15)" : "#0D0D0D", border: "1px solid " + (view === "map" ? "rgba(230,192,115,0.5)" : "rgba(230,192,115,0.3)"), borderRadius: 16, padding: "14px 16px", cursor: "pointer", transition: "all 0.2s", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 40%, rgba(230,192,115,0.08), transparent 70%)", pointerEvents: "none" }} />
              <svg width="20" height="25" viewBox="0 0 26 32" fill="none">
                <path d="M13 0C7.48 0 3 4.48 3 10c0 7.5 10 18 10 18S23 17.5 23 10c0-5.52-4.48-10-10-10z" fill="#E6C073" opacity="0.9"/>
                <circle cx="13" cy="10" r="6" fill="#000"/>
                <image href="/logo.webp" x="7" y="4" width="12" height="12" style={{ borderRadius: "50%", clipPath: "circle(6px at 6px 6px)" }}/>
              </svg>
              <div style={{ height: 2, background: "linear-gradient(90deg, #E6C073, #F6DDAA)", borderRadius: 2, margin: "8px 0", width: "100%" }} />
              <div style={{ fontSize: 11, color: "#E6C073", letterSpacing: 0.5, fontWeight: 600 }}>Map</div>
            </div>
          </div>
        )}
      </div>

      {view === "map" ? (
        <div style={{ padding: "0 28px 60px", maxWidth: 800, margin: "0 auto" }}>
          {leafletLoaded ? <MapView cafes={cafes} /> : <div style={{ textAlign: "center", padding: 60, color: "rgba(255,255,255,0.4)" }}>Loading map...</div>}
        </div>
      ) : (
        <>
          <div style={{ padding: "0 28px 20px", maxWidth: 800, margin: "0 auto" }}>
            {!loading && cafes.length > 0 && <PullQuote cafes={cafes} />}
            <input placeholder="Search café, suburb or city..." value={search}
              onChange={function(e) { setSearch(e.target.value); }}
              style={{ width: "100%", background: "#111111", border: "1px solid rgba(230,192,115,0.35)", borderRadius: 12, padding: "13px 16px", color: "#fff", fontSize: 14, marginBottom: 12, outline: "none", boxSizing: "border-box" }} />
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              <button onClick={function() { handleSortClick("all"); }}
                style={{ ...btnBase, border: "1px solid " + (sort === "all" && !quickFilter && !nearMe ? "#E6C073" : "rgba(255,255,255,0.16)"), background: sort === "all" && !quickFilter && !nearMe ? "#E6C073" : "transparent", color: sort === "all" && !quickFilter && !nearMe ? "#000" : "#D9D9D9" }}>All</button>
              <button onClick={function() { handleSortClick("high"); }}
                style={{ ...btnBase, border: "1px solid " + (sort === "high" && !quickFilter ? "rgba(78,220,119,0.5)" : "rgba(255,255,255,0.16)"), background: sort === "high" && !quickFilter ? "rgba(78,220,119,0.15)" : "transparent", color: sort === "high" && !quickFilter ? "#4EDC77" : "#D9D9D9" }}>High Score</button>
              <button onClick={function() { handleSortClick("low"); }}
                style={{ ...btnBase, border: "1px solid " + (sort === "low" && !quickFilter ? "rgba(255,94,102,0.5)" : "rgba(255,255,255,0.16)"), background: sort === "low" && !quickFilter ? "rgba(255,94,102,0.15)" : "transparent", color: sort === "low" && !quickFilter ? "#FF5E66" : "#D9D9D9" }}>Low Score</button>
              <div style={{ width: 1, background: "rgba(255,255,255,0.1)", margin: "0 4px", height: 20 }} />
              <div ref={scoreRef} style={{ position: "relative" }}>
                <button onClick={function() { setScoreDropdown(!scoreDropdown); setCityDropdown(false); }}
                  style={{ ...btnBase, border: "1px solid " + (scoreBucket ? "#E6C073" : "rgba(255,255,255,0.16)"), background: scoreBucket ? "#E6C073" : "transparent", color: scoreBucket ? "#000" : "#D9D9D9", display: "flex", alignItems: "center", gap: 6 }}>
                  {scoreBucket ? scoreBucket : "Score"} {scoreDropdown ? "▲" : "▼"}
                </button>
                {scoreDropdown && (
                  <div style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16, overflow: "hidden", zIndex: 100, minWidth: 190, boxShadow: "0 20px 40px rgba(0,0,0,0.6)" }}>
                    {scoreBucket && (
                      <div onClick={function() { setScoreBucket(null); setScoreDropdown(false); }}
                        style={{ padding: "12px 20px", fontSize: 13, color: "rgba(255,255,255,0.4)", cursor: "pointer", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>Clear filter</div>
                    )}
                    {SCORE_BUCKETS.map(function(bucket) {
                      const isActive = scoreBucket === bucket.label;
                      const col = getScoreColor(bucket.ref);
                      return (
                        <div key={bucket.label} onClick={function() { handleBucketSelect(bucket); }}
                          style={{ padding: "13px 20px", fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", background: isActive ? "rgba(255,255,255,0.06)" : "transparent", color: isActive ? col : "#fff", transition: "background 0.15s" }}>
                          <span style={{ fontWeight: isActive ? 600 : 400 }}>{bucket.label}</span>
                          {isActive && <span style={{ color: col, fontSize: 16 }}>&#10003;</span>}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <div ref={cityRef} style={{ position: "relative" }}>
                <button onClick={function() { setCityDropdown(!cityDropdown); setScoreDropdown(false); }}
                  style={{ ...btnBase, border: "1px solid " + (city !== "All" ? "#E6C073" : "rgba(255,255,255,0.16)"), background: city !== "All" ? "#E6C073" : "transparent", color: city !== "All" ? "#000" : "#D9D9D9", display: "flex", alignItems: "center", gap: 6 }}>
                  {city !== "All" ? city : "City"} {cityDropdown ? "▲" : "▼"}
                </button>
                {cityDropdown && (
                  <div style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16, overflow: "hidden", zIndex: 100, minWidth: 170, boxShadow: "0 20px 40px rgba(0,0,0,0.6)" }}>
                    {city !== "All" && (
                      <div onClick={function() { setCity("All"); setCityDropdown(false); }}
                        style={{ padding: "12px 20px", fontSize: 13, color: "rgba(255,255,255,0.4)", cursor: "pointer", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>Clear filter</div>
                    )}
                    {allCities.map(function(c) {
                      const isActive = city === c;
                      return (
                        <div key={c} onClick={function() { setCity(c); setCityDropdown(false); }}
                          style={{ padding: "13px 20px", fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", background: isActive ? "rgba(255,255,255,0.06)" : "transparent", color: isActive ? "#c8a96e" : "#fff", transition: "background 0.15s" }}>
                          <span style={{ fontWeight: isActive ? 600 : 400 }}>{c}</span>
                          {isActive && <span style={{ color: "#c8a96e", fontSize: 16 }}>&#10003;</span>}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              {(scoreBucket || quickFilter || city !== "All") && (
                <button onClick={function() { clearAll(setSort, setQuickFilter, setScoreBucket, setCity); }}
                  style={{ ...btnBase, border: "1px solid rgba(255,255,255,0.15)", background: "transparent", color: "rgba(255,255,255,0.4)" }}>Clear</button>
              )}
              <button onClick={handleNearMe}
                style={{ ...btnBase, border: "1px solid " + (nearMe ? "#E6C073" : "rgba(255,255,255,0.16)"), background: nearMe ? "#E6C073" : "transparent", color: nearMe ? "#000" : "#D9D9D9" }}>
                {locationLoading ? "..." : "📍 Near Me"}
              </button>
            </div>
            {city !== "All" && (function() {
              const citySlugMap = { "Brisbane": "brisbane", "Gold Coast": "gold-coast", "Moreton Bay": "moreton-bay", "Sunshine Coast": "sunshine-coast", "Ipswich": "ipswich", "Melbourne": "melbourne", "Sydney": "sydney", "Logan": "logan", "Redland": "redland" };
              const slug = citySlugMap[city];
              if (!slug) return null;
              return (
                <a href={"/city/" + slug} style={{ display:"inline-flex", alignItems:"center", gap:6, marginTop:10, fontSize:12, color:"#c8a96e", textDecoration:"none", fontWeight:600 }}>
                  View full {city} guide →
                </a>
              );
            })()}
          </div>

          <div style={{ padding: "0 24px", maxWidth: 800, margin: "0 auto" }}>
            {nearMe && <div style={{ background: "rgba(197,157,80,0.08)", border: "1px solid rgba(197,157,80,0.2)", borderRadius: 12, padding: "10px 16px", marginBottom: 12, fontSize: 13, color: "#c8a96e" }}>
              📍 Showing cafés within 4km of your location — closest first
            </div>}
            {nearMe && filtered.length === 0 && <div style={{ textAlign: "center", padding: 40, color: "rgba(255,255,255,0.3)", fontSize: 14 }}>No reviewed cafés within 4km. Try browsing all cafés instead.</div>}
            {loading && (
              <div>
                <style>{`
                  @keyframes pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.4; }
                    100% { opacity: 1; }
                  }
                  .skeleton-pulse { animation: pulse 1.5s ease-in-out infinite; }
                  @keyframes scoreReveal {
                    from { opacity: 0; transform: scale(0.7); }
                    to { opacity: 1; transform: scale(1); }
                  }
                  .score-reveal { animation: scoreReveal 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
                `}</style>
                {[1,2,3,4,5,6,7,8].map(function(i) {
                  return (
                    <div key={i} className="skeleton-pulse" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 20, marginBottom: 10, display: "flex", alignItems: "center", gap: 16, position: "relative", overflow: "hidden", animationDelay: (i * 0.1) + "s" }}>
                      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: "rgba(255,255,255,0.06)", borderRadius: "16px 0 0 16px" }} />
                      <div style={{ width: 44, height: 44, background: "rgba(255,255,255,0.06)", borderRadius: "50%", marginLeft: 8, flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ height: 14, background: "rgba(255,255,255,0.07)", borderRadius: 6, marginBottom: 8, width: Math.random() > 0.5 ? "55%" : "70%" }} />
                        <div style={{ height: 11, background: "rgba(255,255,255,0.04)", borderRadius: 6, width: "35%" }} />
                      </div>
                      <div style={{ width: 58, height: 22, background: "rgba(255,255,255,0.06)", borderRadius: 20 }} />
                    </div>
                  );
                })}
              </div>
            )}
            {!loading && !nearMe && filtered.length === 0 && <div style={{ textAlign: "center", padding: 60, color: "rgba(255,255,255,0.3)" }}>No cafes found</div>}
            {!loading && !showAll && !nearMe && !quickFilter && !scoreBucket && sort === "all" && city === "All" && !search && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, paddingTop: 8, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ fontSize: 11, letterSpacing: 3, color: "#E6C073", fontWeight: 700 }}>LATEST REVIEWS</div>
              </div>
            )}
            {!loading && showAll && !nearMe && !quickFilter && !scoreBucket && sort === "all" && city === "All" && !search && (
              <div style={{ fontSize: 11, letterSpacing: 2, color: "rgba(197,157,80,0.5)", marginBottom: 12 }}>ALL CAFÉS — A TO Z</div>
            )}
            {(function() {
              const isDefaultView = !showAll && !nearMe && !quickFilter && !scoreBucket && sort === "all" && city === "All" && !search;
              const displayList = isDefaultView ? [...cafes].reverse().slice(0, 10) : filtered;
              return displayList.map(function(cafe) {
                const isSelected = selected && selected.id === cafe.id;
                const cardColor = getScoreColor(cafe.score);
              return (
                <div key={cafe.id}
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid " + (isSelected ? "rgba(197,157,80,0.4)" : "rgba(255,255,255,0.07)"), borderRadius: 16, padding: 20, marginBottom: 10, cursor: "pointer", transition: "all 0.2s", position: "relative", overflow: "hidden" }}
                  onClick={function() {
                    setSelected(isSelected ? null : cafe);
                    if (navigator.vibrate) {
                      if (cafe.score >= 8.0) navigator.vibrate([40, 20, 40]);
                      else if (cafe.score >= 7.5) navigator.vibrate(40);
                      else if (cafe.score < 4.0) navigator.vibrate([30, 10, 30, 10, 30]);
                      else navigator.vibrate(20);
                    }
                  }}>
                  <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: cardColor, borderRadius: "16px 0 0 16px" }} />
                  <div style={{ display: "flex", alignItems: "center", gap: 16, marginLeft: 8 }}>
                    <ScoreRing score={cafe.score} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ fontWeight: 600, fontSize: 16 }}>{cafe.name}</span>
                        <VerdictBadge verdict={cafe.verdict} score={cafe.score} />
                      </div>
                      <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginTop: 3 }}>
                        {cafe.suburb}, {cafe.city} · {cafe.price}
                        {nearMe && cafe._distance !== null && <span style={{ color: "#c8a96e", marginLeft: 6 }}>· {cafe._distance.toFixed(1)} km away</span>}
                      </div>
                      {(function() {
                        const key = (cafe.suburb + "-" + cafe.city).toLowerCase();
                        const best = bestInSuburb[key];
                        if (best && best.id === cafe.id && !SPAIN_CITIES.includes((cafe.city || "").toLowerCase())) {
                          return <div style={{ fontSize: 11, color: "#c8a96e", marginTop: 4, fontWeight: 600, letterSpacing: 1 }}>⭐ Best in {cafe.suburb}</div>;
                        }
                        return null;
                      })()}
                    </div>
                  </div>
                  {isSelected && (
                    <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                      <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.6, margin: 0, fontStyle: "italic" }}>"{cafe.notes}"</p>
                      <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ flex: 1, height: 4, borderRadius: 4, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                          <div style={{ height: "100%", width: (cafe.score * 10) + "%", background: "linear-gradient(90deg, " + getScoreColor(cafe.score) + ", " + getScoreColor(cafe.score) + "99)", borderRadius: 4 }} />
                        </div>
                        <span style={{ fontFamily: "'Bebas Neue', 'Bebas Neue Fallback', sans-serif", fontSize: 18, color: getScoreColor(cafe.score) }}>{cafe.score}/10</span>
                      </div>
                      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                        <a href={getMapsUrl(cafe)} target="_blank" rel="noreferrer"
                          onClick={function(e) { e.stopPropagation(); }}
                          style={{ flex: 1, padding: "10px", borderRadius: 10, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", textDecoration: "none", fontSize: 12, textAlign: "center", fontWeight: 500 }}>Maps</a>
                        <a href={"/review/" + makeSlug(cafe.name, cafe.suburb)}
                          onClick={function(e) { e.stopPropagation(); }}
                          style={{ flex: 1, padding: "10px", borderRadius: 10, background: "rgba(197,157,80,0.1)", border: "1px solid rgba(197,157,80,0.25)", color: "#c8a96e", textDecoration: "none", fontSize: 12, textAlign: "center", fontWeight: 500 }}>Full Review</a>
                        <button onClick={function(e) {
                          e.stopPropagation();
                          const color = getScoreColor(cafe.score);

                          function toTitleCase(str) {
                            return (str || "").replace(/\w\S*/g, function(txt) {
                              return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                            });
                          }

                          function generateCard() {
                            const card = document.createElement("div");
                            card.style.cssText = "position:fixed;top:-9999px;left:-9999px;background:#0a0a0a;border-radius:24px;padding:32px 28px;display:flex;flex-direction:column;align-items:center;gap:16px;border:2px solid " + color + "55;width:320px;font-family:sans-serif;";
                            const suburbDisplay = toTitleCase(cafe.suburb);
                            const noteText = cafe.notes ? cafe.notes.substring(0, 80) + (cafe.notes.length > 80 ? "..." : "") : "";
                            card.innerHTML = `
                              <div style="display:flex;align-items:center;gap:10px;width:100%;">
                                <img src="https://koffeereview.com.au/logo.webp" crossorigin="anonymous" style="width:40px;height:40px;border-radius:50%;object-fit:cover;" />
                                <div>
                                  <div style="font-size:11px;letter-spacing:3px;color:#c8a96e;font-weight:700;">KOFFEE REVIEW</div>
                                  <div style="font-size:10px;color:rgba(255,255,255,0.6);">koffeereview.com.au</div>
                                </div>
                              </div>
                              <div style="position:relative;width:110px;height:110px;">
                                <svg width="110" height="110" style="transform:rotate(-90deg);"><circle cx="55" cy="55" r="44" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="7"/><circle cx="55" cy="55" r="44" fill="none" stroke="${color}" stroke-width="7" stroke-dasharray="276" stroke-dashoffset="${276 - (cafe.score / 10) * 276}" stroke-linecap="round"/></svg>
                                <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;">
                                  <span style="font-size:30px;font-weight:700;color:${color};line-height:1;">${cafe.score}</span>
                                  <span style="font-size:11px;color:rgba(255,255,255,0.3);">/10</span>
                                </div>
                              </div>
                              <div style="text-align:center;">
                                <div style="font-size:20px;font-weight:700;color:#fff;margin-bottom:4px;">${cafe.name}</div>
                                <div style="font-size:13px;color:rgba(255,255,255,0.4);margin-bottom:${noteText ? "10px" : "0"};">${suburbDisplay}, ${toTitleCase(cafe.city)}</div>
                                ${noteText ? `<div style="font-size:12px;color:rgba(255,255,255,0.55);font-style:italic;line-height:1.6;padding:0 8px;">${noteText}</div>` : ""}
                              </div>
                              <div style="padding:8px 24px;border-radius:20px;background:${color};font-size:12px;font-weight:700;letter-spacing:3px;color:#000;">${cafe.verdict ? cafe.verdict.toUpperCase() : "RATED"}</div>
                              <div style="font-size:11px;color:rgba(255,255,255,0.25);letter-spacing:2px;margin-top:4px;">ONE LATTE · ONE DOUBLE SHOT</div>
                            `;
                            document.body.appendChild(card);
                            window.html2canvas(card, { backgroundColor: "#0a0a0a", scale: 3, useCORS: true }).then(function(canvas) {
                              document.body.removeChild(card);
                              setShareCardUrl(canvas.toDataURL("image/png"));
                            });
                          }

                          if (window.html2canvas) {
                            generateCard();
                          } else {
                            const script = document.createElement("script");
                            script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
                            script.onload = generateCard;
                            document.head.appendChild(script);
                          }
                        }}
                          style={{ flex: 1, padding: "10px", borderRadius: 10, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: 12, cursor: "pointer", fontWeight: 500 }}>Share Card</button>
                        {cafe.link && (
                          <a href={cafe.link} target="_blank" rel="noreferrer"
                            onClick={function(e) { e.stopPropagation(); }}
                            style={{ flex: 1, padding: "10px", borderRadius: 10, background: "rgba(197,157,80,0.15)", border: "1px solid rgba(197,157,80,0.3)", color: "#c8a96e", textDecoration: "none", fontSize: 12, textAlign: "center", fontWeight: 500 }}>Our Review</a>
                        )}
                        {!cafe.link && (
                          <a href={getMapsUrl(cafe)} target="_blank" rel="noreferrer"
                            onClick={function(e) { e.stopPropagation(); }}
                            style={{ flex: 1, padding: "10px", borderRadius: 10, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", textDecoration: "none", fontSize: 12, textAlign: "center", fontWeight: 500 }}>Direction</a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            });
            })()}
          </div>

          {/* SHOW ALL BUTTON */}
          {!loading && !showAll && !nearMe && !quickFilter && !scoreBucket && sort === "all" && city === "All" && !search && (
            <div style={{ padding: "0 24px 8px", maxWidth: 800, margin: "0 auto" }}>
              <button onClick={function() { setShowAll(true); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                style={{ width: "100%", padding: "14px", borderRadius: 12, background: "rgba(197,157,80,0.1)", border: "1px solid rgba(197,157,80,0.3)", color: "#c8a96e", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", letterSpacing: 1 }}>
                SHOW ALL {cafes.length} CAFÉS →
              </button>
            </div>
          )}

          {/* FOOTER */}
          {(!loading && (showAll || nearMe || quickFilter || scoreBucket || sort !== "all" || city !== "All" || search)) && (
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "28px 24px", maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 12 }}>© 2026 Our Fair Dinkum Koffee Review · koffeereview.com.au</p>
              <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
                <a href="/about" style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>About Us</a>
                <span style={{ color: "rgba(255,255,255,0.2)" }}>·</span>
                <a href="/disclosure" style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Disclosure</a>
                <span style={{ color: "rgba(255,255,255,0.2)" }}>·</span>
                <a href="/privacy" style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Privacy</a>
                <span style={{ color: "rgba(255,255,255,0.2)" }}>·</span>
                <a href="/how-we-score.html" style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>How We Score</a>
              </div>
            </div>
          )}

          {/* FOOTER ON DEFAULT VIEW */}
          {!loading && !showAll && !nearMe && !quickFilter && !scoreBucket && sort === "all" && city === "All" && !search && (
            <div style={{ padding: "8px 24px 40px", maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 10 }}>© 2026 Our Fair Dinkum Koffee Review · koffeereview.com.au</p>
              <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
                <a href="/about" style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>About Us</a>
                <span style={{ color: "rgba(255,255,255,0.2)" }}>·</span>
                <a href="/disclosure" style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Disclosure</a>
                <span style={{ color: "rgba(255,255,255,0.2)" }}>·</span>
                <a href="/privacy" style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Privacy</a>
                <span style={{ color: "rgba(255,255,255,0.2)" }}>·</span>
                <a href="/how-we-score.html" style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>How We Score</a>
              </div>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 10 }}>
                <a href="/best-latte-brisbane" style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", textDecoration: "none" }}>Best Latte Brisbane</a>
                <span style={{ color: "rgba(255,255,255,0.15)" }}>·</span>
                <a href="/hidden-gem-cafes-brisbane" style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", textDecoration: "none" }}>Hidden Gems Brisbane</a>
                <span style={{ color: "rgba(255,255,255,0.15)" }}>·</span>
                <a href="/worst-cafes-by-suburb" style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", textDecoration: "none" }}>Worst Cafés by Suburb</a>
              </div>
            </div>
          )}
        </>
      )}
      {shareCardUrl && (
        <div onClick={function(e) { if (e.target === e.currentTarget) setShareCardUrl(null); }}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 400, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 16, letterSpacing: 1 }}>YOUR SCORE CARD</div>
          <img src={shareCardUrl} alt="Score Card"
            style={{ maxWidth: "min(320px, 90vw)", borderRadius: 24, boxShadow: "0 20px 60px rgba(0,0,0,0.8)" }} />
          <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
            <button onClick={function() {
              const link = document.createElement("a");
              link.download = "koffee-review-score-card.png";
              link.href = shareCardUrl;
              link.click();
            }} style={{ background: "rgba(197,157,80,0.15)", border: "1px solid rgba(197,157,80,0.3)", color: "#c8a96e", padding: "11px 20px", borderRadius: 12, fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
              ↓ Save
            </button>
            <button onClick={function() {
              if (navigator.share) {
                fetch(shareCardUrl).then(function(r) { return r.blob(); }).then(function(blob) {
                  const file = new File([blob], "koffee-review-score-card.png", { type: "image/png" });
                  navigator.share({ files: [file], title: "Koffee Review Score Card" }).catch(function() {});
                });
              } else {
                const link = document.createElement("a");
                link.download = "koffee-review-score-card.png";
                link.href = shareCardUrl;
                link.click();
              }
            }} style={{ background: "rgba(197,157,80,0.15)", border: "1px solid rgba(197,157,80,0.3)", color: "#c8a96e", padding: "11px 20px", borderRadius: 12, fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
              ↑ Share
            </button>
            <button onClick={function() { setShareCardUrl(null); }}
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.6)", padding: "11px 20px", borderRadius: 12, fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
