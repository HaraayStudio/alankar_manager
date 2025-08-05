import React from "react";
import styles from "./OrdersDash.module.scss";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function getTodayIdx() {
  const jsDay = new Date().getDay(); // 0 (Sun) - 6 (Sat)
  return jsDay === 0 ? 6 : jsDay - 1; // 0=Monday
}

function getAreaChartData(orders) {
  // Group by createdAtDateTime day of week
  const dayMap = Object.fromEntries(days.map(day => [day, 0]));
  orders.forEach(order => {
    const date = new Date(order.createdAtDateTime);
    const day = days[date.getDay() === 0 ? 6 : date.getDay() - 1];
    dayMap[day] = (dayMap[day] || 0) + 1;
  });
  return days.map(day => ({ day, value: dayMap[day] }));
}

export default function OrdersAreaChart({ orders }) {
  const chartWidth = 410;
  const chartHeight = 110;
  const chartData = getAreaChartData(orders);
  const maxValue = Math.max(...chartData.map(d => d.value), 4);
  const todayIdx = getTodayIdx();

  // Build SVG points
  const points = chartData.map((item, i) => ({
    x: (i * chartWidth) / (days.length - 1),
    y: chartHeight - (item.value / maxValue) * (chartHeight - 24) - 10
  }));

  // Smooth curve (bezier)
  const curvePath = (() => {
    if (points.length < 2) return "";
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1], curr = points[i];
      const cpx = (prev.x + curr.x) / 2;
      d += ` Q${cpx},${prev.y} ${curr.x},${curr.y}`;
    }
    return d;
  })();
  const areaPath = curvePath + ` L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`;

  return (
    <div className={styles.chartAreaCard}>
      <svg width={chartWidth} height={chartHeight} style={{ width: "100%", height: "110px" }}>
        {/* Area fill */}
        <defs>
          <linearGradient id="orderAreaGrad" x1="0" y1="0" x2="0" y2={chartHeight}>
            <stop offset="0%" stopColor="#0584FE" stopOpacity={0.18}/>
            <stop offset="100%" stopColor="#0584FE" stopOpacity={0.02}/>
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#orderAreaGrad)" stroke="none" />
        {/* Curve */}
        <path d={curvePath} fill="none" stroke="#0584FE" strokeWidth="2.5" />
        {/* Today bar */}
        {todayIdx !== -1 && (
          <rect
            x={points[todayIdx].x - 8}
            y={18}
            width="16"
            height={chartHeight - 32}
            fill="#0584FE"
            rx="8"
          />
        )}
      </svg>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2, padding: "0 7px" }}>
        {days.map(day => (
          <span key={day} style={{
            fontSize: 14, color: "#757a8a", fontWeight: 500, width: 50, textAlign: "center"
          }}>{day.slice(0, 3)}</span>
        ))}
      </div>
    </div>
  );
}
