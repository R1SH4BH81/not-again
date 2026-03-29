import React from 'react';
import styles from './WeatherCard.module.css';

const WeatherCard = ({ title, value, unit, icon: Icon, footer, range, rangeLabels }) => {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.iconWrapper}>
          <Icon size={18} className={styles.icon} />
          <span className={styles.title}>{title}</span>
        </div>
        {range && <div className={styles.rangeInfo}>{range}</div>}
      </div>
      
      <div className={styles.body}>
        <div className={styles.valueContainer}>
          <span className={styles.value}>{value}</span>
          <span className={styles.unit}>{unit}</span>
        </div>
      </div>
      
      {rangeLabels && (
        <div className={styles.visualRange}>
          <div className={styles.rangeBar}>
            <div className={styles.rangeIndicator} style={{ left: '40%' }}></div>
          </div>
          <div className={styles.rangeLabels}>
            <div className={styles.labelGroup}>
              <span className={styles.labelValue}>{rangeLabels.min}</span>
              <span className={styles.labelTime}>{rangeLabels.minTime}</span>
            </div>
            <div className={styles.labelGroup}>
              <span className={styles.labelValue}>{rangeLabels.max}</span>
              <span className={styles.labelTime}>{rangeLabels.maxTime}</span>
            </div>
          </div>
        </div>
      )}
      
      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );
};

export default WeatherCard;
