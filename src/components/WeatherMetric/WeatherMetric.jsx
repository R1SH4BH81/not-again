import React from 'react';
import styles from './WeatherMetric.module.css';

const WeatherMetric = ({ icon: Icon, value, label, unit = '' }) => {
  return (
    <div className={styles.metricCard}>
      <div className={styles.iconWrapper}>
        <Icon size={20} className={styles.icon} />
      </div>
      <div className={styles.content}>
        <div className={styles.value}>
          {value}{unit}
        </div>
        <div className={styles.label}>
          {label}
        </div>
      </div>
    </div>
  );
};

export default WeatherMetric;
