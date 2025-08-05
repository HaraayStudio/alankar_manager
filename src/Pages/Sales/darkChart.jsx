import React, { useState } from "react";

// Dummy data for each month
const months = [
  { label: "Jan", value: 1 },
  { label: "Feb", value: 1 },
  { label: "Mar", value: 1 },
  { label: "Apr", value: 1 },
  { label: "May", value: 1 },
  { label: "Jun", value: 1 }, // highlight
  { label: "Jul", value: 1 },
  { label: "Aug", value: 1 },
  { label: "Sep", value: 50 },
  { label: "Oct", value: 55 },
  { label: "Nov", value: 55 },
  { label: "Dec", value: 55 }
];

const W = 420; // SVG width
const H = 70;  // SVG height
const PADX = 16; // padding X for nicer edges
const PADY = 12; // padding Y for headroom

// Utility: get max for scaling
const maxVal = Math.max(...months.map(m => m.value));
const minVal = Math.min(...months.map(m => m.value));

// Map values to SVG coordinates
function getPoints() {
  return months.map((m, i) => {
    const x = PADX + (i * (W - 2 * PADX)) / (months.length - 1);
    // Invert y, scale to chart height (lower value = more profit)
    const y = PADY + ((maxVal - m.value) * (H - 2 * PADY)) / (maxVal - minVal || 1);
    return { x, y, value: m.value, label: m.label };
  });
}

// SVG cubic Bezier smoothing
function curvePath(points) {
  if (points.length < 2) return "";
  let d = `M${points[0].x},${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const p0 = points[i - 1], p1 = points[i];
    const cpx = (p0.x + p1.x) / 2;
    d += ` Q${cpx},${p0.y} ${p1.x},${p1.y}`;
  }
  return d;
}

export default function YearProfitCurveCard() {
  const [tooltip, setTooltip] = useState(null);
  const points = getPoints();

  // Find the max month for the dot
  const maxIdx = months.findIndex(m => m.value === maxVal);
  const maxPoint = points[maxIdx];

  return (
    <div style={{
      background: "linear-gradient(135deg, #112137 70%, #182848 100%)",
      borderRadius: 22,
      padding: "28px 22px 20px 22px",
      width: 410,
      minWidth: 280,
      maxWidth: 460,
      color: "#fff",
      fontFamily: "Inter, sans-serif",
      position: "relative",
      overflow: "hidden",
      boxShadow: "0 4px 24px #202b3a40"
    }}>
      {/* Dropdown */}
      <div style={{ position: "absolute", top: 18, right: 22, zIndex: 2 }}>
        <button style={{
          background: "#233966", color: "#bdd4ff", fontWeight: 600,
          fontSize: 15, border: "none", borderRadius: 18, padding: "4px 18px", cursor: "pointer"
        }}>
          Yearly <span style={{ marginLeft: 6, fontSize: 15 }}>▼</span>
        </button>
      </div>
      {/* Title */}
      <div style={{ fontWeight: 600, fontSize: 20, marginBottom: 8 }}>
        Highest Sales Record
      </div>
      {/* SVG Curve */}
      <div style={{ width: "100%", height: 92, margin: "8px 0 10px 0", position: "relative" }}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none" style={{ display: "block" }}>
          <defs>
            <linearGradient id="curve-gradient" x1="0" y1={H/2} x2={W} y2={H/2} gradientUnits="userSpaceOnUse">
              <stop stopColor="#0584FE" stopOpacity="0"/>
              <stop offset="0.52" stopColor="#0584FE"/>
              <stop offset="1" stopColor="#0584FE" stopOpacity="0"/>
            </linearGradient>
          </defs>
          {/* Curve Path */}
          <path
            d={curvePath(points)}
            stroke="url(#curve-gradient)"
            strokeWidth={3}
            fill="none"
          />
          {/* Blue dot for max */}
          <circle
            cx={maxPoint.x}
            cy={maxPoint.y}
            r={7}
            fill="#0584FE"
            stroke="#fff"
            strokeWidth={2}
            style={{ cursor: "pointer" }}
            onMouseEnter={() => setTooltip(maxPoint)}
            onMouseLeave={() => setTooltip(null)}
          />
        </svg>
        {/* Tooltip */}
        {tooltip &&
          <div style={{
            position: "absolute",
            left: tooltip.x - 60,
            top: tooltip.y - 35,
            background: "#151b28",
            color: "#fff",
            borderRadius: 12,
            padding: "7px 16px",
            fontSize: 15,
            boxShadow: "0 2px 12px #0002",
            pointerEvents: "none",
            zIndex: 5,
            whiteSpace: "nowrap",
            fontFamily: "inherit"
          }}>
            {months[maxIdx].label + " 2025"}
          </div>
        }
      </div>
      {/* Currency and badge */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 18 }}>
        <span style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-2px" }}>
          ₹{maxVal.toLocaleString()}
          <span style={{ fontSize: 16, fontWeight: 500, color: "#bdd4ff", marginLeft: 2 }}>/month</span>
        </span>
        <span style={{
          background: "#12bf69",
          color: "#fff",
          borderRadius: 20,
          padding: "6px 16px 6px 14px",
          fontSize: 17,
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          marginLeft: 10,
          boxShadow: "0 2px 8px #0b683955"
        }}>
          <svg width="17" height="17" style={{marginRight: 5, marginTop: 0}} viewBox="0 0 16 16" fill="none"><path d="M8 3v10M8 3l4.5 4.5M8 3L3.5 7.5" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
          10%
        </span>
      </div>
    </div>
  );
}
