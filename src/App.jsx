import { useState, useEffect, useRef } from "react";

const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYEU8Khk3R5I879v3FcXPqhq0aCXa2ZWM1BwwJOyUitx2Boak_AFTOkwvB8qQrKIeU55NM4htFjHbI/pub?gid=0&single=true&output=csv";

function parseCSV(text) {
  const lines = text.trim().split("\n");
  const headers = lines[0].split(",").map(function(h) { return h.trim().replace(/"/g, ""); });
  return lines.slice(1).map(function(line, i) {
    const values = line.split(",").map(function(v) { return v.trim().replace(/"/g, ""); });
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

function getMapsUrl(cafe) {
  return "https://www.google.com/maps/search/" + encodeURIComponent(cafe.name + " " + cafe.suburb + " " + cafe.city);
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
          strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s ease" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: color, lineHeight: 1 }}>{score}</span>
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
    <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, marginTop:16, overflow:"hidden" }}>
      <div onClick={function() { setOpen(!open); }}
        style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 20px", cursor:"pointer" }}>
        <div style={{ fontSize:11, color:"rgba(255,255,255,0.3)", letterSpacing:1 }}>SCORE DISTRIBUTION</div>
        <div style={{ color:"rgba(255,255,255,0.3)", fontSize:14, transition:"transform 0.3s", transform:open?"rotate(180deg)":"rotate(0deg)" }}>▼</div>
      </div>
      {open && (
        <div style={{ padding:"0 20px 16px" }}>
          {buckets.map(function(b, i) {
            const count = counts[i];
            const pct = (count / max) * 100;
            const color = getScoreColor(b.ref);
            return (
              <div key={b.label} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
                <div style={{ width:24, fontSize:11, color, fontFamily:"'Bebas Neue',sans-serif", letterSpacing:1 }}>{b.label}</div>
                <div style={{ flex:1, height:8, background:"rgba(255,255,255,0.06)", borderRadius:4, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:pct+"%", background:color, borderRadius:4, opacity:0.8 }}/>
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
    <div style={{ background: "rgba(197,157,80,0.06)", border: "1px solid rgba(197,157,80,0.15)", borderRadius: 16, padding: "14px 20px", marginBottom: 16, display: "flex", gap: 12, alignItems: "flex-start" }}>
      <div style={{ color: "rgba(197,157,80,0.5)", fontSize: 28, lineHeight: 1, marginTop: -4 }}>"</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", fontStyle: "italic", lineHeight: 1.5 }}>{random.notes}</div>
        <div style={{ fontSize: 11, color: "rgba(197,157,80,0.6)", marginTop: 6 }}>— {random.name} {random.score}/10</div>
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
        '<img src="/logo.jpg" style="width:36px;height:36px;border-radius:50%;object-fit:cover;" /></div>' +
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
  return (
    <>
      {open && (
        <div onClick={onClose}
          style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", zIndex:200, backdropFilter:"blur(4px)" }}/>
      )}
      <div style={{
        position:"fixed", top:0, left:0, bottom:0, width:"min(340px, 90vw)",
        background:"#111", borderRight:"1px solid rgba(255,255,255,0.08)",
        transform:open?"translateX(0)":"translateX(-100%)",
        transition:"transform 0.35s cubic-bezier(0.4,0,0.2,1)",
        zIndex:201, overflowY:"scroll", padding:"40px 24px 60px",
        WebkitOverflowScrolling:"touch"
      }}>
        <button onClick={onClose}
          style={{ position:"absolute", top:16, right:16, background:"rgba(255,255,255,0.08)", border:"none", color:"#fff", borderRadius:"50%", width:32, height:32, cursor:"pointer", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center" }}>
          ×
        </button>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:28 }}>
          <img src="/logo.jpg" style={{ width:52, height:52, borderRadius:"50%", objectFit:"cover" }}/>
          <div>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:22, letterSpacing:2, background:"linear-gradient(135deg,#f5e6c8,#c8a96e)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>OUR FAIR DINKUM</div>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:12, letterSpacing:4, color:"rgba(255,255,255,0.3)" }}>KOFFEE REVIEW</div>
          </div>
        </div>
        <div style={{ marginBottom:28 }}>
          <div style={{ fontSize:11, color:"rgba(197,157,80,0.7)", letterSpacing:2, marginBottom:12 }}>OUR STORY</div>
          <p style={{ fontSize:13, color:"rgba(255,255,255,0.65)", lineHeight:1.9, margin:"0 0 10px" }}>In 2021, we started Koffee Review with a simple question. There are so many coffee shops out there, so when you're spending $4.50 to $5 on a cup back in 2021, shouldn't it actually be good?</p>
          <p style={{ fontSize:13, color:"rgba(255,255,255,0.65)", lineHeight:1.9, margin:"0 0 10px" }}>We're coffee lovers who drink 6 to 7 coffees a day. So we decided to travel across the country, visit different cafes, and review them based on what we personally feel about the coffee. No sponsorships, no agendas. Just our honest opinion.</p>
          <p style={{ fontSize:13, color:"rgba(255,255,255,0.65)", lineHeight:1.9, margin:"0 0 10px" }}>Over 600 cafes reviewed across Australia and yes, even a few from Spain, and we're still going.</p>
          <p style={{ fontSize:13, color:"rgba(255,255,255,0.65)", lineHeight:1.9, margin:0 }}>Now in 2026, we've built this website so it's easy for anyone to search for cafes and find real ratings before they visit.</p>
        </div>
        <div style={{ marginBottom:28 }}>
          <div style={{ fontSize:11, color:"rgba(197,157,80,0.7)", letterSpacing:2, marginBottom:12 }}>OUR METHOD</div>
          <div style={{ background:"rgba(197,157,80,0.08)", border:"1px solid rgba(197,157,80,0.2)", borderRadius:12, padding:"12px 16px", marginBottom:16 }}>
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
                <div style={{ fontSize:13, color:color, fontWeight:700 }}>{item.range} {item.label}</div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.45)", marginTop:3, lineHeight:1.6 }}>{item.desc}</div>
              </div>
            );
          })}
          <div style={{ marginTop:16, padding:"12px 16px", background:"rgba(255,255,255,0.03)", borderRadius:12, border:"1px solid rgba(255,255,255,0.06)" }}>
            <p style={{ fontSize:13, color:"rgba(197,157,80,0.8)", fontStyle:"italic", margin:0, textAlign:"center", lineHeight:1.6 }}>600+ cups in. Still chasing that perfect 10.</p>
          </div>
        </div>
        <div>
          <div style={{ fontSize:11, color:"rgba(197,157,80,0.7)", letterSpacing:2, marginBottom:12 }}>FIND US ON</div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
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
  const scoreRef = useRef(null);
  const cityRef = useRef(null);

  useEffect(function() {
    fetch(SHEET_URL)
      .then(function(r) { return r.text(); })
      .then(function(text) { setCafes(parseCSV(text)); setLoading(false); })
      .catch(function() { setLoading(false); });
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
  const avoid = cafes.filter(function(c) { return c.score < 5; }).length;

  function handleStatClick(type) {
    if (quickFilter === type) { setQuickFilter(null); } else { setQuickFilter(type); setScoreBucket(null); setSort("all"); }
  }
  function handleSortClick(val) { setSort(val); setQuickFilter(null); setScoreBucket(null); }
  function handleReviewedClick() { clearAll(setSort, setQuickFilter, setScoreBucket, setCity); setSearch(""); setView("list"); }
  function handleBucketSelect(bucket) {
    if (scoreBucket === bucket.label) { setScoreBucket(null); } else { setScoreBucket(bucket.label); setQuickFilter(null); }
    setScoreDropdown(false);
  }

  const filtered = cafes
    .filter(function(c) { return city === "All" || c.city === city; })
    .filter(function(c) {
      const s = search.toLowerCase();
      return (c.name && c.name.toLowerCase().includes(s)) || (c.suburb && c.suburb.toLowerCase().includes(s));
    })
    .filter(function(c) {
      if (quickFilter === "must") return c.score >= 7.5;
      if (quickFilter === "avoid") return c.score < 5;
      if (scoreBucket) {
        const bucket = SCORE_BUCKETS.find(function(b) { return b.label === scoreBucket; });
        if (bucket) return c.score >= bucket.min && c.score <= bucket.max;
      }
      return true;
    })
    .sort(function(a, b) {
      if (sort === "high") return b.score - a.score;
      if (sort === "low") return a.score - b.score;
      return (a.name || "").localeCompare(b.name || "");
    });

  const btnBase = { padding: "7px 16px", borderRadius: 20, fontSize: 12, fontWeight: 500, cursor: "pointer", transition: "all 0.2s" };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", fontFamily: "'DM Sans', sans-serif", color: "#fff" }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
      <AboutDrawer open={aboutOpen} onClose={function() { setAboutOpen(false); }} />

      <div style={{ padding: "40px 24px 24px", maxWidth: 800, margin: "0 auto" }}>

        {/* HEADER ROW */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
          <button onClick={function() { setAboutOpen(true); }}
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "rgba(255,255,255,0.6)", padding: "8px 10px", cursor: "pointer", fontSize: 16, flexShrink: 0 }}>
            ☰
          </button>
          <img src="/logo.jpg" alt="Koffee Review" style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
          <div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "min(46px, 7vw)", whiteSpace: "nowrap", letterSpacing: 3, lineHeight: 1, background: "linear-gradient(135deg, #f5e6c8, #c8a96e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              OUR FAIR DINKUM
            </div>
           <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "min(20px, 3.5vw)", whiteSpace: "nowrap", letterSpacing: 6, color: "rgba(255,255,255,0.75)" }}>
  KOFFEE REVIEW
</div>
          </div>
        </div>

        {/* TAGLINES */}
        <p style={{ color: "#f5e6c8", fontSize: 13, margin: "0 0 4px" }}>600+ cafes reviewed across Australia - Know before you go</p>
        <p style={{ color: "rgba(197,157,80,0.7)", fontSize: 12, margin: "0 0 14px" }}>One Latte & One Double Shot Espresso Please.</p>

        {/* SOCIAL ICONS — brand accurate */}
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 4 }}>

          {/* Instagram — gradient purple/pink bg, white icon */}
          <a href="https://www.instagram.com/koffeereview" target="_blank" rel="noreferrer"
            style={{ textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", width: 33, height: 33, borderRadius: 12, background: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)", color: "#fff", flexShrink: 0 }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
          </a>

          {/* TikTok — black bg, white icon with cyan/red accent */}
          <a href="https://www.tiktok.com/@koffeereview" target="_blank" rel="noreferrer"
            style={{ textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", width: 33, height: 33, borderRadius: 12, background: "#000", border: "1px solid #333", color: "#fff", flexShrink: 0, position: "relative" }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.54V6.78a4.85 4.85 0 01-1.02-.09z"/></svg>
          </a>

          {/* YouTube — red bg, white play icon */}
          <a href="https://www.youtube.com/@koffeereview" target="_blank" rel="noreferrer"
            style={{ textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", width: 33, height: 33, borderRadius: 12, background: "#ff0000", color: "#fff", flexShrink: 0 }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg>
          </a>

        </div>

        {!loading && <ScoreChart cafes={cafes} />}

        {!loading && (
          <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
            <div onClick={handleReviewedClick}
              style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "12px 16px", cursor: "pointer", transition: "all 0.2s" }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: "#fff", lineHeight: 1 }}>{cafes.length}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2, letterSpacing: 0.5 }}>Reviewed</div>
            </div>
            <div onClick={function() { handleStatClick("must"); setView("list"); }}
              style={{ flex: 1, background: quickFilter === "must" ? "rgba(74,222,128,0.2)" : "rgba(255,255,255,0.04)", border: "1px solid " + (quickFilter === "must" ? "rgba(74,222,128,0.5)" : "rgba(255,255,255,0.08)"), borderRadius: 12, padding: "12px 16px", cursor: "pointer", transition: "all 0.2s" }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: "#4ade80", lineHeight: 1 }}>{mustVisit}</div>
              <div style={{ fontSize: 11, color: quickFilter === "must" ? "#4ade80" : "rgba(255,255,255,0.4)", marginTop: 2, letterSpacing: 0.5 }}>Must Visit</div>
            </div>
            <div onClick={function() { handleStatClick("avoid"); setView("list"); }}
              style={{ flex: 1, background: quickFilter === "avoid" ? "rgba(248,113,113,0.2)" : "rgba(255,255,255,0.04)", border: "1px solid " + (quickFilter === "avoid" ? "rgba(248,113,113,0.5)" : "rgba(255,255,255,0.08)"), borderRadius: 12, padding: "12px 16px", cursor: "pointer", transition: "all 0.2s" }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: "#f87171", lineHeight: 1 }}>{avoid}</div>
              <div style={{ fontSize: 11, color: quickFilter === "avoid" ? "#f87171" : "rgba(255,255,255,0.4)", marginTop: 2, letterSpacing: 0.5 }}>Avoid</div>
            </div>
            <div onClick={function() { setView(view === "map" ? "list" : "map"); }}
              style={{ flex: 1, background: view === "map" ? "rgba(197,157,80,0.2)" : "rgba(255,255,255,0.04)", border: "1px solid " + (view === "map" ? "rgba(197,157,80,0.5)" : "rgba(255,255,255,0.08)"), borderRadius: 12, padding: "12px 16px", cursor: "pointer", transition: "all 0.2s" }}>
              <div style={{ fontSize: 24, lineHeight: 1 }}>&#128205;</div>
              <div style={{ fontSize: 11, color: view === "map" ? "#c8a96e" : "rgba(255,255,255,0.4)", marginTop: 2, letterSpacing: 0.5 }}>Map</div>
            </div>
          </div>
        )}
      </div>

      {view === "map" ? (
        <div style={{ padding: "0 24px 60px", maxWidth: 800, margin: "0 auto" }}>
          {leafletLoaded ? <MapView cafes={cafes} /> : <div style={{ textAlign: "center", padding: 60, color: "rgba(255,255,255,0.4)" }}>Loading map...</div>}
        </div>
      ) : (
        <>
          <div style={{ padding: "0 24px 20px", maxWidth: 800, margin: "0 auto" }}>
            {!loading && cafes.length > 0 && <PullQuote cafes={cafes} />}
            <input placeholder="Search cafe or suburb..." value={search}
              onChange={function(e) { setSearch(e.target.value); }}
              style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "12px 16px", color: "#fff", fontSize: 14, marginBottom: 12, outline: "none", boxSizing: "border-box" }} />
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              <button onClick={function() { handleSortClick("all"); }}
                style={{ ...btnBase, border: "1px solid " + (sort === "all" && !quickFilter ? "rgba(197,157,80,0.5)" : "rgba(255,255,255,0.15)"), background: sort === "all" && !quickFilter ? "rgba(197,157,80,0.15)" : "transparent", color: sort === "all" && !quickFilter ? "#c8a96e" : "rgba(255,255,255,0.5)" }}>All</button>
              <button onClick={function() { handleSortClick("high"); }}
                style={{ ...btnBase, border: "1px solid " + (sort === "high" && !quickFilter ? "rgba(74,222,128,0.4)" : "rgba(255,255,255,0.15)"), background: sort === "high" && !quickFilter ? "rgba(74,222,128,0.15)" : "transparent", color: sort === "high" && !quickFilter ? "#4ade80" : "rgba(255,255,255,0.5)" }}>High Score</button>
              <button onClick={function() { handleSortClick("low"); }}
                style={{ ...btnBase, border: "1px solid " + (sort === "low" && !quickFilter ? "rgba(248,113,113,0.4)" : "rgba(255,255,255,0.15)"), background: sort === "low" && !quickFilter ? "rgba(248,113,113,0.15)" : "transparent", color: sort === "low" && !quickFilter ? "#f87171" : "rgba(255,255,255,0.5)" }}>Low Score</button>
              <div style={{ width: 1, background: "rgba(255,255,255,0.1)", margin: "0 4px", height: 20 }} />
              <div ref={scoreRef} style={{ position: "relative" }}>
                <button onClick={function() { setScoreDropdown(!scoreDropdown); setCityDropdown(false); }}
                  style={{ ...btnBase, border: "1px solid " + (scoreBucket ? "rgba(197,157,80,0.5)" : "rgba(255,255,255,0.15)"), background: scoreBucket ? "rgba(197,157,80,0.15)" : "transparent", color: scoreBucket ? "#c8a96e" : "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", gap: 6 }}>
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
                  style={{ ...btnBase, border: "1px solid " + (city !== "All" ? "rgba(197,157,80,0.5)" : "rgba(255,255,255,0.15)"), background: city !== "All" ? "rgba(197,157,80,0.15)" : "transparent", color: city !== "All" ? "#c8a96e" : "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", gap: 6 }}>
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
            </div>
          </div>

          <div style={{ padding: "0 24px 60px", maxWidth: 800, margin: "0 auto" }}>
            {loading && <div style={{ textAlign: "center", padding: 60, color: "rgba(255,255,255,0.4)" }}>Loading cafes...</div>}
            {!loading && filtered.length === 0 && <div style={{ textAlign: "center", padding: 60, color: "rgba(255,255,255,0.3)" }}>No cafes found</div>}
            {filtered.map(function(cafe) {
              const isSelected = selected && selected.id === cafe.id;
              return (
                <div key={cafe.id}
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid " + (isSelected ? "rgba(197,157,80,0.4)" : "rgba(255,255,255,0.07)"), borderRadius: 16, padding: 20, marginBottom: 10, cursor: "pointer", transition: "all 0.2s" }}
                  onClick={function() { setSelected(isSelected ? null : cafe); }}>
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
                  {isSelected && (
                    <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                      <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.6, margin: 0, fontStyle: "italic" }}>"{cafe.notes}"</p>
                      <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ flex: 1, height: 4, borderRadius: 4, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                          <div style={{ height: "100%", width: (cafe.score * 10) + "%", background: "linear-gradient(90deg, " + getScoreColor(cafe.score) + ", " + getScoreColor(cafe.score) + "99)", borderRadius: 4 }} />
                        </div>
                        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: getScoreColor(cafe.score) }}>{cafe.score}/10</span>
                      </div>
                      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                        <a href={getMapsUrl(cafe)} target="_blank" rel="noreferrer"
                          onClick={function(e) { e.stopPropagation(); }}
                          style={{ flex: 1, padding: "10px", borderRadius: 10, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", textDecoration: "none", fontSize: 12, textAlign: "center", fontWeight: 500 }}>Maps</a>
                        <button onClick={function(e) { e.stopPropagation(); doShare(cafe); }}
                          style={{ flex: 1, padding: "10px", borderRadius: 10, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: 12, cursor: "pointer", fontWeight: 500 }}>Share</button>
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
            })}
          </div>
        </>
      )}
    </div>
  );
}
