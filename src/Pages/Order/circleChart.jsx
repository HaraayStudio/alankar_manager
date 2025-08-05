import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

// Chart Data and Colors
const data = [
  { name: "Active", value: 45, color: "#19D100" },      // Green
  { name: "Complated", value: 25, color: "#02D1FF" },   // Cyan
  { name: "Assigned", value: 30, color: "#FFD600" },    // Yellow
];

export default function DonutChartWithLegend() {
  return (
    <div style={{
      width: 360,
      maxWidth: "100%",
      margin: "0 auto",
      background: "#fff",
      paddingTop: 32,
      paddingBottom: 24,
      borderRadius: 12,
      fontFamily: "Inter, sans-serif"
    }}>
      <div style={{ width: "100%", height: 220 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={85}
              paddingAngle={0}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              stroke="none"
            >
              {data.map((entry, i) => (
                <Cell key={`cell-${i}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* Legend */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: 22,
        marginTop: 24,
        fontSize: 17,
        fontWeight: 500
      }}>
        {data.map((item, i) => (
          <div key={item.name} style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{
              display: "inline-block",
              width: 16,
              height: 16,
              borderRadius: "50%",
              background: item.color,
            }} />
            <span style={{
              color: i === 1 ? "#02D1FF" : (i === 2 ? "#8F6900" : "#19D100"),
              fontWeight: 500,
            }}>
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
