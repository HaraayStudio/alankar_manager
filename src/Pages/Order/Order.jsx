// // src/pages/OrderDashboard.jsx
// import React, { useMemo } from "react";
// import styles from "./Orders.module.scss";
// import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
// import { ChevronDown } from "lucide-react";
// import { useData } from "../../context/DataContext";

// function getCurrentWeekRange() {
//   const today = new Date();
//   const curr = new Date(today.setHours(0,0,0,0));
//   const day = curr.getDay() || 7;
//   const monday = new Date(curr);
//   monday.setDate(curr.getDate() - day + 1);
//   return Array.from({length: 7}).map((_, i) => { 
//     const d = new Date(monday);
//     d.setDate(monday.getDate() + i);
//     return d;
//   });
// }
// function formatDate(date) {
//   return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
// }
// function getWeekdayName(date) {
//   return date.toLocaleDateString('en-US', { weekday: 'long' });
// }

// export default function Order() {
//   const { postSales } = useData();
//   const orders = postSales;
//   console.log(postSales);

//   // --- Data Aggregation ---
//   const weekDates = useMemo(() => getCurrentWeekRange(), []);
//   const chartData = useMemo(() => {
//     const dailyTotals = weekDates.map(date => {
//       const yyyymmdd = date.toISOString().slice(0, 10);
//       const count = (orders || []).filter(o => o.postSalesdateTime?.slice(0, 10) === yyyymmdd).length;
//       return {
//         name: getWeekdayName(date),
//         value: count,
//       };
//     });
//     return dailyTotals;
//   }, [orders, weekDates]);

//   const totalOrders = (orders || []).length;
//   let ongoing = 0, pending = 0, completed = 0, stepProgress = 0;
//   (orders || []).forEach((o) => {
//     o.orders.forEach(ord => {
//       if (ord.status === "IN_PROGRESS") ongoing++;
//       else if (ord.status === "CREATED" || ord.status === "PENDING") pending++;
//       else if (ord.status === "COMPLETED") completed++;
//       if (ord.status === "IN_PROGRESS" && !stepProgress) {
//         const doneSteps = ord.steps?.filter(st => st.status === "COMPLETED").length || 0;
//         stepProgress = ord.steps?.length ? Math.round((doneSteps / ord.steps.length) * 100) : 0;
//       }
//     });
//   });
//   if (!stepProgress) stepProgress = 70;
//   if (!ongoing && !pending && !completed) {
//     pending = totalOrders;
//   }
//   const delta = "+10%";

//   return (
//     <div className={styles.dashboardContainer}>
//       <div className={styles.topRow}>
//         <div className={styles.statsBox}>
//           <div className={styles.statsLabel}>Total Orders</div>
//           <div className={styles.statsDate}>{formatDate(new Date())}</div>
//           <div className={styles.statsMain}>
//             <span className={styles.statsTotal}>{totalOrders}</span>
//             <span className={styles.statsDelta}>
//               <span className={styles.upArrow}>↑</span>
//               <span>{delta}</span>
//             </span>
//           </div>
//         </div>
//         <div className={styles.chartBox}>
//           <div className={styles.chartHeader}>
//             <span> </span>
//             <button className={styles.dropdownBtn}>
//               Weekly <ChevronDown size={16} />
//             </button>
//           </div>
//           <div className={styles.chartBody}>
//             <ResponsiveContainer width="100%" height={120}>
//               <AreaChart
//                 data={chartData}
//                 margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
//               >
//                 <defs>
//                   <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="10%" stopColor="#3B82F6" stopOpacity={0.25}/>
//                     <stop offset="90%" stopColor="#3B82F6" stopOpacity={0.08}/>
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid strokeDasharray="3 3" vertical={false} />
//                 <XAxis dataKey="name" fontSize={13} tickLine={false} axisLine={false}/>
//                 <YAxis fontSize={12} axisLine={false} tickLine={false} width={32} />
//                 <Tooltip contentStyle={{ borderRadius: 8, fontSize: 13 }}/>
//                 <Area
//                   type="monotone"
//                   dataKey="value"
//                   stroke="#3B82F6"
//                   fill="url(#colorOrders)"
//                   strokeWidth={4}
//                   dot={{ r: 3, fill: "#2563EB", stroke: "#fff", strokeWidth: 1.5 }}
//                   activeDot={{ r: 6, fill: "#2563EB", stroke: "#fff", strokeWidth: 2 }}
//                 />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>
//       <div className={styles.cardsRow}>
//         <div className={styles.card}>
//           <div className={styles.cardTop}>
//             <span>Ongoing Orders</span>
//             <span className={styles.statsDelta}><span className={styles.upArrow}>↑</span>{delta}</span>
//           </div>
//           <div className={styles.cardMain}>{ongoing || 0}</div>
//           <div className={styles.cardSub}>This Week</div>
//           <div className={styles.progressBarWrap}>
//             <span>3rd step</span>
//             <div className={styles.progressBar}>
//               <div className={styles.progressBarFill} style={{ width: `${stepProgress}%` }}/>
//             </div>
//             <span className={styles.progressPercent}>{stepProgress}%</span>
//           </div>
//         </div>
//         <div className={styles.card}>
//           <div className={styles.cardTop}>
//             <span>Pending Orders</span>
//             <span className={styles.statsDelta}><span className={styles.upArrow}>↑</span>{delta}</span>
//           </div>
//           <div className={styles.cardMain}>{pending || 0}</div>
//           <div className={styles.cardSub}>This Week</div>
//         </div>
//         <div className={styles.card}>
//           <div className={styles.cardTop}>
//             <span>Completed Orders</span>
//             <span className={styles.statsDelta}><span className={styles.upArrow}>↑</span>{delta}</span>
//           </div>
//           <div className={styles.cardMain}>{completed || 0}</div>
//           <div className={styles.cardSub}>This Week</div>
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useData } from '../../context/DataContext'; // Adjust path as needed
import styles from './OrdersDash.module.scss';

const Dashboard = () => {
  const { Orders } = useData();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  // Update current time every second for live display
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Live Statistics Calculations
  const liveStats = useMemo(() => {
    if (!Orders || Orders.length === 0) {
      return {
        totalOrders: 0,
        createdOrders: 0,
        inProgressOrders: 0,
        completedOrders: 0,
        totalRevenue: 0,
        pendingRevenue: 0,
        avgOrderValue: 0,
        completionRate: 0,
        priorityStats: { HIGH: 0, MEDIUM: 0, LOW: 0 },
        todayOrders: 0,
        todayRevenue: 0,
        thisWeekOrders: 0,
        thisWeekRevenue: 0
      };
    }

    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const thisWeekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    
    // Basic counts
    const totalOrders = Orders.length;
    const createdOrders = Orders.filter(order => order.status === 'CREATED').length;
    const inProgressOrders = Orders.filter(order => order.status === 'IN_PROGRESS').length;
    const completedOrders = Orders.filter(order => order.status === 'COMPLETED').length;

    // Revenue calculations
    const totalRevenue = Orders.reduce((sum, order) => sum + (order.totalAmountWithGST || 0), 0);
    const pendingRevenue = Orders
      .filter(order => order.status === 'CREATED')
      .reduce((sum, order) => sum + (order.totalAmountWithGST || 0), 0);

    // Today's statistics
    const todayOrders = Orders.filter(order => 
      order.createdAtDateTime && order.createdAtDateTime.startsWith(today)
    );
    const todayRevenue = todayOrders.reduce((sum, order) => sum + (order.totalAmountWithGST || 0), 0);

    // This week statistics
    const thisWeekOrders = Orders.filter(order => {
      const orderDate = new Date(order.createdAtDateTime);
      return orderDate >= thisWeekStart;
    });
    const thisWeekRevenue = thisWeekOrders.reduce((sum, order) => sum + (order.totalAmountWithGST || 0), 0);

    // Priority distribution
    const priorityStats = {
      HIGH: Orders.filter(order => order.priority === 'HIGH').length,
      MEDIUM: Orders.filter(order => order.priority === 'MEDIUM').length,
      LOW: Orders.filter(order => order.priority === 'LOW').length
    };

    // Calculations
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const completionRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;

    return {
      totalOrders,
      createdOrders,
      inProgressOrders,
      completedOrders,
      totalRevenue,
      pendingRevenue,
      avgOrderValue,
      completionRate,
      priorityStats,
      todayOrders: todayOrders.length,
      todayRevenue,
      thisWeekOrders: thisWeekOrders.length,
      thisWeekRevenue
    };
  }, [Orders, currentTime]);

  // Weekly chart data calculation (last 7 days)
  const weeklyChartData = useMemo(() => {
    if (!Orders || Orders.length === 0) {
      return Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return {
          day: date.toLocaleDateString('en-US', { weekday: 'long' }),
          ordersCount: 0,
          revenue: 0,
          isToday: i === 6
        };
      });
    }

    const today = new Date();
    const last7Days = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      
      const dayOrders = Orders.filter(order => 
        order.createdAtDateTime && order.createdAtDateTime.startsWith(dateKey)
      );
      
      const dayRevenue = dayOrders.reduce((sum, order) => sum + (order.totalAmountWithGST || 0), 0);
      
      last7Days.push({
        day: dayName,
        ordersCount: dayOrders.length,
        revenue: dayRevenue,
        isToday: i === 0
      });
    }

    return last7Days;
  }, [Orders]);

  // Chart configuration
  const maxValue = Math.max(...weeklyChartData.map(day => day.ordersCount), 1);
  const yAxisLabels = [
    Math.round(maxValue),
    Math.round(maxValue * 0.75),
    Math.round(maxValue * 0.5),
    Math.round(maxValue * 0.25)
  ];
  const chartWidth = 700;
  const chartHeight = 200;

  // Calculate points for the curve
  const points = weeklyChartData.map((item, index) => {
    const x = (index * chartWidth) / (weeklyChartData.length - 1);
    const y = chartHeight - (item.ordersCount / maxValue) * chartHeight;
    return { x, y };
  });

  // Create smooth curve path using cubic bezier curves
  const createSmoothPath = useCallback((points) => {
    if (points.length < 2) return '';
    
    const getControlPoints = (p0, p1, p2, tension = 0.3) => {
      const d01 = Math.sqrt(Math.pow(p1.x - p0.x, 2) + Math.pow(p1.y - p0.y, 2));
      const d12 = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
      
      const fa = tension * d01 / (d01 + d12);
      const fb = tension * d12 / (d01 + d12);
      
      const p1x = p1.x - fa * (p2.x - p0.x);
      const p1y = p1.y - fa * (p2.y - p0.y);
      
      const p2x = p1.x + fb * (p2.x - p0.x);
      const p2y = p1.y + fb * (p2.y - p0.y);
      
      return { cp1: { x: p1x, y: p1y }, cp2: { x: p2x, y: p2y } };
    };
    
    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      const p0 = points[i - 2] || points[i - 1];
      const p1 = points[i - 1];
      const p2 = points[i];
      const p3 = points[i + 1] || points[i];
      
      const { cp1, cp2 } = getControlPoints(p0, p1, p2);
      const { cp1: cp3, cp2: cp4 } = getControlPoints(p1, p2, p3);
      
      path += ` C ${cp2.x} ${cp2.y} ${cp3.x} ${cp3.y} ${p2.x} ${p2.y}`;
    }
    
    return path;
  }, []);

  const curvePath = createSmoothPath(points);
  const areaPath = curvePath + ` L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`;

  // Get today's index for indicator
  const todayIndex = weeklyChartData.findIndex(item => item.isToday);

  // Format currency
  const formatCurrency = useCallback((amount) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`;
    } else {
      return `₹${Math.round(amount)}`;
    }
  }, []);

  // Format time
  const formatTime = useCallback((date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  }, []);

  // Calculate growth percentages
  const calculateGrowth = useCallback((current, previous) => {
    if (previous === 0) return current > 0 ? '+100%' : '0%';
    const growth = ((current - previous) / previous) * 100;
    return `${growth >= 0 ? '+' : ''}${growth.toFixed(1)}%`;
  }, []);

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>Printing Orders Dashboard</h1>
          <p className={styles.subtitle}>Live analytics and order management</p>
        </div>
        <div className={styles.liveIndicator}>
          <span className={styles.liveDot}></span>
          <span className={styles.liveText}>Live</span>
          <span className={styles.liveTime}>{formatTime(currentTime)}</span>
        </div>
      </div>

      {/* Quick Stats Summary */}
      <div className={styles.quickStats}>
        <div className={styles.statQuick}>
          <span className={styles.statQuickLabel}>Today</span>
          <span className={styles.statQuickValue}>{liveStats.todayOrders}</span>
          <span className={styles.statQuickUnit}>orders</span>
        </div>
        <div className={styles.statQuick}>
          <span className={styles.statQuickLabel}>This Week</span>
          <span className={styles.statQuickValue}>{liveStats.thisWeekOrders}</span>
          <span className={styles.statQuickUnit}>orders</span>
        </div>
        <div className={styles.statQuick}>
          <span className={styles.statQuickLabel}>Total Revenue</span>
          <span className={styles.statQuickValue}>{formatCurrency(liveStats.totalRevenue)}</span>
          <span className={styles.statQuickUnit}>including GST</span>
        </div>
        <div className={styles.statQuick}>
          <span className={styles.statQuickLabel}>Completion</span>
          <span className={styles.statQuickValue}>{liveStats.completionRate.toFixed(1)}%</span>
          <span className={styles.statQuickUnit}>rate</span>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className={styles.statsGrid}>
        {/* Total Orders */}
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statIcon}>📊</div>
            <span className={styles.growthBadge}>+15%</span>
          </div>
          <div className={styles.statValue}>{liveStats.totalOrders}</div>
          <div className={styles.statLabel}>Total Orders</div>
          <div className={styles.statSubtext}>
            Avg Value: {formatCurrency(liveStats.avgOrderValue)}
          </div>
          <div className={styles.progressContainer}>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill}
                style={{ width: '100%' }}
              ></div>
            </div>
          </div>
        </div>

        {/* Pending Orders */}
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statIcon}>⏳</div>
            <span className={`${styles.growthBadge} ${styles.pending}`}>
              {Math.round((liveStats.createdOrders / liveStats.totalOrders) * 100)}%
            </span>
          </div>
          <div className={styles.statValue}>{liveStats.createdOrders}</div>
          <div className={styles.statLabel}>Pending Orders</div>
          <div className={styles.statSubtext}>
            Value: {formatCurrency(liveStats.pendingRevenue)}
          </div>
          <div className={styles.progressContainer}>
            <div className={styles.progressBar}>
              <div 
                className={`${styles.progressFill} ${styles.pendingProgress}`}
                style={{ width: `${(liveStats.createdOrders / liveStats.totalOrders) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* In Progress Orders */}
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statIcon}>🔄</div>
            <span className={`${styles.growthBadge} ${styles.progress}`}>
              {Math.round((liveStats.inProgressOrders / liveStats.totalOrders) * 100)}%
            </span>
          </div>
          <div className={styles.statValue}>{liveStats.inProgressOrders}</div>
          <div className={styles.statLabel}>In Progress</div>
          <div className={styles.statSubtext}>Currently processing</div>
          <div className={styles.progressContainer}>
            <div className={styles.progressBar}>
              <div 
                className={`${styles.progressFill} ${styles.inProgressFill}`}
                style={{ width: liveStats.inProgressOrders > 0 ? '70%' : '0%' }}
              ></div>
            </div>
          </div>
        </div>

        {/* Completed Orders */}
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statIcon}>✅</div>
            <span className={`${styles.growthBadge} ${styles.completed}`}>
              {liveStats.completionRate.toFixed(1)}%
            </span>
          </div>
          <div className={styles.statValue}>{liveStats.completedOrders}</div>
          <div className={styles.statLabel}>Completed Orders</div>
          <div className={styles.statSubtext}>Success rate</div>
          <div className={styles.progressContainer}>
            <div className={styles.progressBar}>
              <div 
                className={`${styles.progressFill} ${styles.completedFill}`}
                style={{ width: `${liveStats.completionRate}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Priority Distribution */}
        <div className={`${styles.statCard} ${styles.priorityCard}`}>
          <div className={styles.statHeader}>
            <div className={styles.statIcon}>🎯</div>
            <span className={styles.liveBadge}>LIVE</span>
          </div>
          <div className={styles.statLabel}>Priority Distribution</div>
          <div className={styles.priorityList}>
            <div className={styles.priorityItem}>
              <span className={`${styles.priorityDot} ${styles.high}`}></span>
              <span className={styles.priorityText}>High Priority</span>
              <span className={styles.priorityCount}>{liveStats.priorityStats.HIGH}</span>
            </div>
            <div className={styles.priorityItem}>
              <span className={`${styles.priorityDot} ${styles.medium}`}></span>
              <span className={styles.priorityText}>Medium Priority</span>
              <span className={styles.priorityCount}>{liveStats.priorityStats.MEDIUM}</span>
            </div>
            <div className={styles.priorityItem}>
              <span className={`${styles.priorityDot} ${styles.low}`}></span>
              <span className={styles.priorityText}>Low Priority</span>
              <span className={styles.priorityCount}>{liveStats.priorityStats.LOW}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className={styles.chartSection}>
        <div className={styles.chartHeader}>
          <h2 className={styles.chartTitle}>Weekly Orders Trend</h2>
          <div className={styles.chartMeta}>
            <span className={styles.chartPeriod}>Last 7 days • Live data</span>
            <span className={styles.chartTotal}>
              Total: {weeklyChartData.reduce((sum, day) => sum + day.ordersCount, 0)} orders
            </span>
          </div>
        </div>

        <div className={styles.chartContainer}>
          <div className={styles.chartWrapper}>
            {/* Y-axis labels */}
            <div className={styles.yAxis}>
              {yAxisLabels.map((label, index) => (
                <div key={index} className={styles.yAxisLabel}>
                  {label}
                </div>
              ))}
            </div>

            {/* Chart area */}
            <div className={styles.chartArea}>
              {/* Grid lines */}
              <div className={styles.gridLines}>
                {yAxisLabels.map((_, index) => (
                  <div key={index} className={styles.gridLine}></div>
                ))}
              </div>

              {/* SVG Chart */}
              <div className={styles.svgContainer}>
                <svg width="100%" height="100%" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
                  {/* Filled area */}
                  <path
                    d={areaPath}
                    fill="rgba(59, 130, 246, 0.2)"
                    stroke="none"
                  />
                  
                  {/* Curve line */}
                  <path
                    d={curvePath}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                  />

                  {/* Data points */}
                  {points.map((point, index) => (
                    <circle
                      key={index}
                      cx={point.x}
                      cy={point.y}
                      r="4"
                      fill="#3b82f6"
                      stroke="#ffffff"
                      strokeWidth="2"
                      className={styles.dataPoint}
                    />
                  ))}

                  {/* Today indicator */}
                  {todayIndex !== -1 && (
                    <rect
                      x={((todayIndex + 0.5) * chartWidth) / weeklyChartData.length - 6}
                      y={chartHeight * 0.25}
                      width="12"
                      height={chartHeight * 0.5}
                      fill="#ef4444"
                      rx="6"
                      className={styles.todayIndicator}
                    />
                  )}
                </svg>
              </div>

              {/* X-axis labels */}
              <div className={styles.xAxisLabels}>
                {weeklyChartData.map((item, index) => (
                  <div 
                    key={index} 
                    className={`${styles.xAxisLabel} ${item.isToday ? styles.today : ''}`}
                  >
                    <div className={styles.dayName}>{item.day}</div>
                    <div className={styles.dayCount}>{item.ordersCount}</div>
                    <div className={styles.dayRevenue}>{formatCurrency(item.revenue)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className={styles.actionSection}>
        <h3 className={styles.actionTitle}>Quick Actions</h3>
        <div className={styles.actionButtons}>
          <button className={`${styles.actionBtn} ${styles.primary}`}>
            📝 New Order
          </button>
          <button className={`${styles.actionBtn} ${styles.secondary}`}>
            📊 View All Orders
          </button>
          <button className={`${styles.actionBtn} ${styles.secondary}`}>
            🔍 Search Orders
          </button>
          <button className={`${styles.actionBtn} ${styles.warning}`}>
            ⚠️ Pending Review ({liveStats.createdOrders})
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;