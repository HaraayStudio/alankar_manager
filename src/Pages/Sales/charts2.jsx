import React from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot, BarChart, Bar, Cell
} from "recharts";

// Dummy data (matches your visual)
const salesData = [
  { name: "Jan", pre: 80, post: 60 },
  { name: "Feb", pre: 120, post: 80 },
  { name: "Mar", pre: 130, post: 110 },
  { name: "Apr", pre: 140, post: 120 },
  { name: "May", pre: 110, post: 120 },
  { name: "Jun", pre: 70, post: 110 },
  { name: "Jul", pre: 65, post: 95 },
  { name: "Aug", pre: 70, post: 110 },
  { name: "Sep", pre: 95, post: 125 },
  { name: "Oct", pre: 150, post: 145 },
  { name: "Nov", pre: 170, post: 170 },
  { name: "Dec", pre: 180, post: 175 },
];

// For Active Sales
const barData = [
  { name: "Post-sales", value: 20, color: "#B08EFF" }, // light purple
  { name: "Pre-sales", value: 80, color: "#1877F2" }, // blue
];

export default function SalesDashboard() {
  return (
    <div style={{
      display: "flex",
      flexWrap: "wrap",
      gap: 24,
      background: "#f8fbff",
      padding: 24,
      borderRadius: 18,
      boxSizing: "border-box",
      minHeight: 320,
    }}>
      {/* Sales Summary */}
      <div style={{
        flex: 1.7,
        minWidth: 320,
        background: "#fff",
        borderRadius: 18,
        padding: "24px 22px 18px 28px",
        boxShadow: "0 4px 24px #eaf1fd",
        display: "flex",
        flexDirection: "column",
      }}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8
        }}>
          <span style={{ fontWeight: 700, fontSize: 21 }}>Sales Summary</span>
          <button style={{
            background: "#EDF3FF", color: "#343D4C", fontWeight: 500, fontSize: 15,
            border: "none", borderRadius: 18, padding: "3px 18px", cursor: "pointer"
          }}>
            Month <span style={{ marginLeft: 6, fontSize: 15 }}>▼</span>
          </button>
        </div>
        <div style={{ width: "100%", height: 220 }}>
          <ResponsiveContainer>
            <LineChart data={salesData} margin={{ top: 25, right: 15, left: -15, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#E6E9F0" strokeDasharray="4 6" />
              <XAxis dataKey="name" fontSize={15} axisLine={false} tickLine={false} tickMargin={10} />
              <YAxis axisLine={false} tickLine={false} fontSize={14} stroke="#B6B6B6" />
              {/* Orange Line */}
              <Line
                type="monotone"
                dataKey="post"
                stroke="#FFA726"
                strokeWidth={3}
                dot={false}
                activeDot={false}
              />
              {/* Blue Line */}
              <Line
                type="monotone"
                dataKey="pre"
                stroke="#1877F2"
                strokeWidth={3}
                dot={false}
                activeDot={false}
              />
              {/* Orange Dot (Post-sales, June) */}
              <ReferenceDot x="Jun" y={110} r={8} fill="#FFA726" stroke="white" strokeWidth={2} />
              {/* Blue Dot (Pre-sales, June) */}
              <ReferenceDot x="Jun" y={70} r={8} fill="#1877F2" stroke="white" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Active Sales */}
      <div style={{
        flex: 1,
        minWidth: 270,
        background: "#fff",
        borderRadius: 18,
        padding: "24px 18px 18px 18px",
        boxShadow: "0 4px 24px #eaf1fd",
        display: "flex",
        flexDirection: "column",
      }}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8
        }}>
          <span style={{ fontWeight: 700, fontSize: 19 }}>Active Sales</span>
          <button style={{
            background: "#EDF3FF", color: "#343D4C", fontWeight: 500, fontSize: 15,
            border: "none", borderRadius: 18, padding: "3px 18px", cursor: "pointer"
          }}>
            Month <span style={{ marginLeft: 6, fontSize: 15 }}>▼</span>
          </button>
        </div>
        <div style={{ width: "100%", height: 108, marginBottom: 14 }}>
          <ResponsiveContainer>
            <BarChart data={barData}>
              <CartesianGrid vertical={false} stroke="#E6E9F0" strokeDasharray="4 6" />
              <Bar
                dataKey="value"
                barSize={36}
                radius={[6, 6, 0, 0]}
              >
                {barData.map((entry, idx) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Legend and Percentages */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          marginLeft: 5,
        }}>
          {barData.map((item, i) => (
            <div key={item.name} style={{ display: "flex", alignItems: "center", fontSize: 16, fontWeight: 500 }}>
              <span style={{
                display: "inline-block", width: 15, height: 15, borderRadius: "50%",
                background: item.color, marginRight: 7,
              }} />
              <span style={{
                color: "#444", width: 84, display: "inline-block"
              }}>{item.name}</span>
              <span style={{
                marginLeft: "auto", fontWeight: 600, color: "#222"
              }}>{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
