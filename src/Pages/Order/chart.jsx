import React from 'react';

// SCSS Module styles
const styles = {
  chartContainer: 'chartContainer',
  chartWrapper: 'chartWrapper',
  yAxis: 'yAxis',
  yAxisLabel: 'yAxisLabel',
  chartArea: 'chartArea',
  gridLines: 'gridLines',
  gridLine: 'gridLine',
  svgContainer: 'svgContainer',
  xAxisLabels: 'xAxisLabels',
  xAxisLabel: 'xAxisLabel',
  todayIndicator: 'todayIndicator'
};

const AreaChart = () => {
  // Dummy data matching the chart
  const data = [
    { day: 'Monday', value: 150 },
    { day: 'Tuesday', value: 120 },
    { day: 'Wednesday', value: 350 },
    { day: 'Thursday', value: 400 },
    { day: 'Friday', value: 420 },
    { day: 'Saturday', value: 380 },
    { day: 'Sunday', value: 320 }
  ];

  // Get today's day
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todayIndex = data.findIndex(item => item.day === today);

  const maxValue = 450;
  const yAxisLabels = [400, 300, 200, 100];
  const chartWidth = 700;
  const chartHeight = 200;

  // Calculate points for the curve
  const points = data.map((item, index) => {
    const x = (index * chartWidth) / (data.length - 1);
    const y = chartHeight - (item.value / maxValue) * chartHeight;
    return { x, y };
  });

  // Create smooth curve path using cubic bezier curves
  const createSmoothPath = (points) => {
    if (points.length < 2) return '';
    
    // Calculate control points for smooth curves
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
  };

  const curvePath = createSmoothPath(points);
  const areaPath = curvePath + ` L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`;

  return (
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
                fill="rgba(191, 219, 254, 0.8)"
                stroke="none"
              />
              
              {/* Curve line */}
              <path
                d={curvePath}
                fill="none"
                stroke="#93c5fd"
                strokeWidth="2"
              />

              {/* Today indicator bar */}
              {todayIndex !== -1 && (
                <rect
                  x={((todayIndex + 0.5) * chartWidth) / data.length - 6}
                  y={chartHeight * 0.25}
                  width="12"
                  height={chartHeight * 0.5}
                  fill="#2563eb"
                  rx="6"
                />
              )}
            </svg>
          </div>

          {/* X-axis labels */}
          <div className={styles.xAxisLabels}>
            {data.map((item, index) => (
              <div key={index} className={styles.xAxisLabel}>
                {item.day}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AreaChart;

// CSS-in-JS implementation of the SCSS module
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .chartContainer {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  }

  .chartWrapper {
    display: flex;
    height: 280px;
    background: #ffffff;
    border-radius: 8px;
    padding: 20px;
    position: relative;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .yAxis {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 50px;
    height: calc(100% - 40px);
    padding-right: 15px;
    padding-top: 10px;
  }

  .yAxisLabel {
    font-size: 14px;
    color: #6b7280;
    font-weight: 500;
    text-align: right;
    line-height: 1;
  }

  .chartArea {
    flex: 1;
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .gridLines {
    position: absolute;
    top: 10px;
    left: 0;
    right: 0;
    height: calc(100% - 50px);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    pointer-events: none;
    z-index: 1;
  }

  .gridLine {
    height: 1px;
    background: #f3f4f6;
    width: 100%;
  }

  .svgContainer {
    flex: 1;
    position: relative;
    margin-top: 10px;
    margin-bottom: 10px;
    z-index: 2;
  }

  .xAxisLabels {
    display: flex;
    justify-content: space-between;
    padding-top: 10px;
    margin-top: auto;
  }

  .xAxisLabel {
    font-size: 14px;
    color: #6b7280;
    font-weight: 500;
    text-align: center;
    flex: 1;
    position: relative;
  }

  .svgContainer svg {
    overflow: visible;
  }
`;

if (!document.head.querySelector('style[data-area-chart]')) {
  styleSheet.setAttribute('data-area-chart', 'true');
  document.head.appendChild(styleSheet);
}