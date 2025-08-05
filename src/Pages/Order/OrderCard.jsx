import React from 'react';
import styles from './orders.module.scss';
import ProgressBar from './ProgressBar.jsx';

const OrderCard = ({ title, value, percentageChange, showProgress }) => {
  return (
    <div className={styles.card}>
      <h3>{title}</h3>
      <div className={styles.orderValue}>{value}</div>
      <div className={styles.orderInfo}>
        <span>This Week</span>
        <span className={styles.increase}>↑{percentageChange}%</span>
      </div>
      
      {showProgress && <ProgressBar percentage={70} />}
    </div>
  );
};

export default OrderCard;