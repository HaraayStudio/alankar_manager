import React from "react";
import DashbaordStructure from "../../Layout/DashbordStructure";
import styles from "./ClientsDashboard.module.scss";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
// src/data/clientStats.js
export const clientStats = [
  { day: "Mon", count: 10 },
  { day: "Tue", count: 35 },
  { day: "Wed", count: 30 },
  { day: "Thu", count: 25 },
  { day: "Fri", count: 40 },
  { day: "Sat", count: 28 },
  { day: "Sun", count: 32 },
];

export default function Clients() {
  const links = [
    { to: "/clients/new", label: "Add New Client" },
    { to: "/clients/list", label: "All Clients" },
    { to: "/clients/billing", label: "GST Plans & Billing" },
  ];

  return (
    <DashbaordStructure links={links}>
      <div className={styles.sec1}>
        <div className={styles.leftDiv}>
          <div className={styles.upDiv}>
            <div className={styles.chart}>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart
                  data={clientStats}
                  margin={{ top: 10, right: 20, left: 20, bottom: 0 }} // 👈 Add margin here
                >
                  <XAxis dataKey="day" stroke="#666" />
                  <YAxis hide />{" "}
                  {/* Hides Y-axis properly without affecting X labels */}
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#00FF44"
                    strokeWidth={3}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className={styles.downDiv}>
            <div className={styles.div1}>
              <h4>Total Clients</h4>
              <h2>50</h2>
              <p>This Week</p>
            </div>
            <div className={styles.div2}> <h4>Active Clients </h4>
              <h2>50</h2>
              <p>This Week</p></div>
            <div className={styles.div3}> <h4>New Clients </h4>
              <h2>50</h2>
              <p>This Week</p></div>
          </div>
        </div>
        <div className={styles.rightDiv}></div>
      </div>
      <div className={styles.sec2}>
        <div className={styles.allClient}></div>
      </div>
    </DashbaordStructure>
  );
}
