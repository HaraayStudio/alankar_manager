import React from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

// Dummy data matching your visual
const data = [
  { name: "Mon", value: 250 },
  { name: "Tue", value: 250 },
  { name: "Wed", value: 0 },
  { name: "Thu", value: 0 },
  { name: "Fri", value: 500 },
  { name: "Sat", value: 500 },
  { name: "Sun", value: 500 }
];

export default function InvoicesCard() {
  return (
    <div style={{
      background: "#fff",
      borderRadius: "24px",
      boxShadow: "0 4px 24px 0 #eaf1fd",
      padding: "28px 24px 20px 24px",
      width: 320,
      minWidth: 280,
      maxWidth: 360,
      fontFamily: "Inter, sans-serif",
      position: "relative"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 8 }}>
        <span style={{ fontWeight: 700, fontSize: 22 }}>Invoices</span>
        <button style={{
          background: "#EDF3FF",
          color: "#343D4C",
          fontWeight: 500,
          fontSize: 16,
          border: "none",
          borderRadius: 18,
          padding: "4px 18px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center"
        }}>
          Weekly <span style={{ marginLeft: 6, fontSize: 15 }}>▼</span>
        </button>
      </div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 10, gap: 12 }}>
        <span style={{ fontWeight: 700, fontSize: 36 }}>100</span>
        <span style={{
          background: "#D2F5DB",
          color: "#19B871",
          borderRadius: 24,
          padding: "5px 16px",
          fontWeight: 500,
          fontSize: 17,
          display: "inline-block"
        }}>↑ 10%</span>
      </div>
      <div style={{
        width: "100%",
        height: 155,
        marginTop: 0,
        marginBottom: -16
      }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ left: -18, right: 0, top: 6, bottom: 0 }}>
            <defs>
              <linearGradient id="colorInvoices" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0584FE" stopOpacity={1}/>
                <stop offset="100%" stopColor="#0584FE" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#C9D7EC" strokeDasharray="4 4" />
            <YAxis
              axisLine={false}
              tickLine={false}
              ticks={[0, 250, 500, 750]}
              fontSize={15}
              stroke="#ABB5C4"
              domain={[0, 750]}
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              fontSize={17}
              stroke="#ABB5C4"
              tickMargin={10}
            />
            <Area
              type="linear"
              dataKey="value"
              stroke="#0584FE"
              strokeWidth={3}
              fill="url(#colorInvoices)"
              dot={false}
              activeDot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
