import React from 'react';

// SCSS Module styles
const styles = {
  chartContainer: 'chartContainer',
  chartWrapper: 'chartWrapper',
  barsContainer: 'barsContainer',
  barColumn: 'barColumn',
  barWrapper: 'barWrapper',
  bar: 'bar',
  todayBar: 'todayBar',
  barValue: 'barValue',
  dayLabel: 'dayLabel',
  todayLabel: 'todayLabel'
};

const VerticalBarChart = () => {
  // Dummy data for the week
  const data = [
    { day: 'S', fullDay: 'Sunday', value: 45 },
    { day: 'M', fullDay: 'Monday', value: 52 },
    { day: 'T', fullDay: 'Tuesday', value: 38 },
    { day: 'W', fullDay: 'Wednesday', value: 85 }, // Today - highest value
    { day: 'T', fullDay: 'Thursday', value: 42 },
    { day: 'F', fullDay: 'Friday', value: 58 },
    { day: 'S', fullDay: 'Saturday', value: 49 }
  ];

  // Get today's day (Wednesday in this example)
  const today = 'Wednesday';
  const todayIndex = data.findIndex(item => item.fullDay === today);
  const maxValue = Math.max(...data.map(item => item.value));

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartWrapper}>
        <div className={styles.barsContainer}>
          {data.map((item, index) => {
            const isToday = index === todayIndex;
            const barHeight = (item.value / maxValue) * 100;
            
            return (
              <div key={index} className={styles.barColumn}>
                <div className={styles.barWrapper}>
                  {/* Value dot at top */}
                  <div className={styles.barValue}></div>
                  
                  {/* Bar */}
                  <div 
                    className={`${styles.bar} ${isToday ? styles.todayBar : ''}`}
                    style={{ height: `${barHeight * 2.5}px` }}
                  ></div>
                  
                  {/* Day label */}
                  <div className={`${styles.dayLabel} ${isToday ? styles.todayLabel : ''}`}>
                    {item.day}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VerticalBarChart;

// CSS-in-JS implementation of the SCSS module
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .chartContainer {
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
    padding: 40px 20px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  }

  .chartWrapper {
    background: #ffffff;
    border-radius: 16px;
    padding: 30px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  }

  .barsContainer {
    display: flex;
    justify-content: space-between;
    align-items: end;
    gap: 12px;
    height: 280px;
    position: relative;
  }

  .barColumn {
    flex: 1;
    display: flex;
    justify-content: center;
  }

  .barWrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    position: relative;
  }

  .barValue {
    width: 8px;
    height: 8px;
    background: #2563eb;
    border-radius: 50%;
    margin-bottom: 8px;
    flex-shrink: 0;
  }

  .bar {
    width: 4px;
    background: #e5e7eb;
    border-radius: 2px;
    margin-bottom: 16px;
    flex-shrink: 0;
    transition: all 0.3s ease;
  }

  .todayBar {
    background: linear-gradient(to bottom, #3b82f6, #93c5fd);
    width: 6px;
    box-shadow: 0 0 12px rgba(59, 130, 246, 0.3);
    position: relative;
  }

  .todayBar::before {
    content: '';
    position: absolute;
    top: -20px;
    left: 50%;
    transform: translateX(-50%);
    width: 24px;
    height: 24px;
    background: linear-gradient(135deg, #3b82f6, #60a5fa);
    border-radius: 50%;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }

  .dayLabel {
    width: 36px;
    height: 36px;
    background: #f1f5f9;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 600;
    color: #64748b;
    transition: all 0.3s ease;
  }

  .todayLabel {
    background: linear-gradient(135deg, #3b82f6, #60a5fa);
    color: #ffffff;
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    border: 2px solid #ffffff;
  }

  .barColumn:hover .bar:not(.todayBar) {
    background: #cbd5e1;
  }

  .barColumn:hover .dayLabel:not(.todayLabel) {
    background: #e2e8f0;
    transform: scale(1.05);
  }

  @media (max-width: 480px) {
    .chartContainer {
      padding: 20px 10px;
    }
    
    .chartWrapper {
      padding: 20px;
    }
    
    .barsContainer {
      height: 220px;
      gap: 8px;
    }
    
    .dayLabel {
      width: 32px;
      height: 32px;
      font-size: 12px;
    }
  }
`;

if (!document.head.querySelector('style[data-vertical-chart]')) {
  styleSheet.setAttribute('data-vertical-chart', 'true');
  document.head.appendChild(styleSheet);
}