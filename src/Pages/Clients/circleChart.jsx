import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from "recharts";

// Dummy data as per your chart
const data = [
  { name: "Total Clients", value: 60, color: "#0598FF" },   // blue
  { name: "New Clients", value: 25, color: "#1DAB46" },     // green
  { name: "Active Clients", value: 15, color: "#FFB531" }   // orange
];

const RADIAN = Math.PI / 180;

// Custom label (like the 60% with black background and pointer)
const renderActiveShape = (props) => {
  const {
    cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
    fill, payload, percent, value
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        cornerRadius={15}
      />
      {/* Callout label for the blue (Total Clients) */}
      {payload.name === "Total Clients" && (
        <>
          <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke="#000" fill="none"/>
          <g>
            <rect
              x={ex + (cos >= 0 ? 0 : -48)}
              y={ey - 16}
              rx={8}
              width={48}
              height={32}
              fill="#000"
            />
            <text
              x={ex + (cos >= 0 ? 24 : -24)}
              y={ey}
              fill="#fff"
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={18}
              fontWeight={700}
            >{`${value}%`}</text>
          </g>
        </>
      )}
    </g>
  );
};

export default function ClientsSummaryCard() {
  // Only blue segment is active (to show the label as in your image)
  const [activeIndex, setActiveIndex] = React.useState(0);

  return (
    <div style={{
      background: "linear-gradient(135deg, #f5f9ff 60%, #eaf2fe 100%)",
      borderRadius: 18,
      padding: "24px 20px 12px 20px",
      width: 340,
      minWidth: 280,
      boxShadow: "0 4px 24px 0 #eaf1fd",
      fontFamily: "Inter, sans-serif"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontWeight: 700, fontSize: 20 }}>Clients <span style={{ fontWeight: 400 }}>Summary</span></span>
        <button style={{
          background: "#EDF3FF",
          color: "#343D4C",
          fontWeight: 500,
          fontSize: 16,
          border: "none",
          borderRadius: 18,
          padding: "4px 18px",
          cursor: "pointer"
        }}>
          Weekly <span style={{ marginLeft: 6, fontSize: 15 }}>▼</span>
        </button>
      </div>
      <div style={{ width: "100%", height: 180 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={48}
              outerRadius={100}
              paddingAngle={50}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              cornerRadius={10}
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              onMouseEnter={(_, idx) => setActiveIndex(idx)}
              onMouseLeave={() => setActiveIndex(0)}
            >
              {data.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* Custom legend */}
      <div style={{ display: "flex", justifyContent: "center", gap: 28, marginTop: 12 }}>
        {data.map((item, i) => (
          <div key={item.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{
              display: "inline-block",
              width: 15,
              height: 15,
              borderRadius: "50%",
              background: item.color
            }} />
            <span style={{ fontSize: 15, color: "#222", fontWeight: 500 }}>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
