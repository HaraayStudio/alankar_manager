import React, { useMemo } from 'react';
import styles from './OrdersDash.module.scss';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {useData } from "../../context/DataContext"
// Mock useData hook - replace with your actual implementation

// Helpers
function formatDate(dateStr) {
  if (!dateStr) return '--';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function getWeekDates() {
  // Monday to Sunday of current week
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7)); // Monday as start
  monday.setHours(0, 0, 0, 0);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function sameDay(d1, d2) {
  return (
    d1 &&
    d2 &&
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear()
  );
}

const dayLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function OrdersDash() {
  const { Orders = [] } = useData();

  // 1. Filter orders "this week"
  const weekDates = getWeekDates();
  const weekStart = weekDates[0];
  const weekEnd = new Date(weekDates[6]);
  weekEnd.setHours(23, 59, 59, 999);

  const ordersThisWeek = useMemo(
    () =>
      Orders.filter(order => {
        const created = new Date(order.createdAtDateTime);
        return created >= weekStart && created <= weekEnd;
      }),
    [Orders, weekStart, weekEnd]
  );

  // 2. Count by status this week
  const statusCounts = useMemo(() => {
    const out = { IN_PROGRESS: 0, CREATED: 0, COMPLETED: 0 };
    ordersThisWeek.forEach(order => {
      if (out[order.status] !== undefined) out[order.status]++;
    });
    return out;
  }, [ordersThisWeek]);

  // 3. For Ongoing: Progress of one sample order
  function getStepProgress(order) {
    if (!order || !order.steps || order.steps.length === 0) return { step: '3rd step', percent: 0 };
    // 3rd step (index 2)
    const third = order.steps[2];
    const completed = order.steps.filter(s => s.status === 'COMPLETED').length;
    const percent = Math.round((completed / order.steps.length) * 100);
    return {
      step: third?.orderStepName || '3rd step',
      percent,
    };
  }

  // 4. Chart Data
  const chartData = useMemo(() => {
    return weekDates.map((date, i) => {
      const count = Orders.filter(order =>
        sameDay(new Date(order.createdAtDateTime), date)
      ).length;
      return {
        day: dayLabels[i],
        Orders: count,
      };
    });
  }, [Orders, weekDates]);

  // 5. Stats
  const totalOrders = Orders.length;
  const mostRecentOrderDate = Orders.length
    ? Orders.reduce((a, b) =>
        new Date(a.createdAtDateTime) > new Date(b.createdAtDateTime) ? a : b
      ).createdAtDateTime
    : null;
  const growth = 10; // Or calculate real growth if you want

  // 6. Pick a sample Ongoing order for progress bar
  const ongoingOrder = ordersThisWeek.find(o => o.status === 'IN_PROGRESS');

  return (
    <div className={styles.dashboard}>
      <div className={styles.topRow}>
        <div className={`${styles.statCard} ${styles.totalOrders}`}>
          <div className={styles.title}>Total Orders</div>
          <div className={styles.date}>{formatDate(mostRecentOrderDate)}</div>
          <div className={styles.bigNumber}>{totalOrders}</div>
          <div className={styles.growthChip}>↑ {growth}%</div>
        </div>
        <div className={styles.chartWrapper}>
          <ResponsiveContainer width="100%" height={120}>
            <AreaChart data={chartData} margin={{ top: 18, right: 22, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#408cff" stopOpacity={0.19}/>
                  <stop offset="95%" stopColor="#cbe9ff" stopOpacity={0.07}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="day" axisLine={false} tickLine={false} fontSize={13} />
              <YAxis hide />
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#eee" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="Orders"
                stroke="#408cff"
                fillOpacity={1}
                fill="url(#colorOrders)"
                strokeWidth={4}
                dot={false}
                activeDot={{ r: 6, fill: "#1e70fd" }}
                isAnimationActive={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className={styles.cardsRow}>
        {/* Ongoing Orders Card */}
        <div className={styles.statCard}>
          <div className={styles.cardHeader}>
            <span>Ongoing Orders</span>
            <span className={styles.growthChip}>↑ {growth}%</span>
          </div>
          <div className={styles.cardNumber}>{statusCounts['IN_PROGRESS']}</div>
          <div className={styles.cardSub}>This Week</div>
          <div className={styles.progressLabel}>
            {ongoingOrder ? (
              <>
                <span className={styles.stepText}>
                  {getStepProgress(ongoingOrder).step}
                </span>
                <span className={styles.percentText}>{getStepProgress(ongoingOrder).percent}%</span>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressInner}
                    style={{ width: getStepProgress(ongoingOrder).percent + '%' }}
                  />
                </div>
              </>
            ) : (
              <>
                <span className={styles.stepText}>-</span>
                <span className={styles.percentText}>0%</span>
                <div className={styles.progressBar}>
                  <div className={styles.progressInner} style={{ width: '0%' }} />
                </div>
              </>
            )}
          </div>
        </div>
        {/* Pending Orders Card */}
        <div className={styles.statCard}>
          <div className={styles.cardHeader}>
            <span>Pending Orders</span>
            <span className={styles.growthChip}>↑ {growth}%</span>
          </div>
          <div className={styles.cardNumber}>{statusCounts['CREATED']}</div>
          <div className={styles.cardSub}>This Week</div>
        </div>
        {/* Completed Orders Card */}
        <div className={styles.statCard}>
          <div className={styles.cardHeader}>
            <span>Completed Orders</span>
            <span className={styles.growthChip}>↑ {growth}%</span>
          </div>
          <div className={styles.cardNumber}>{statusCounts['COMPLETED']}</div>
          <div className={styles.cardSub}>This Week</div>
        </div>
      </div>
    </div>
  );
}