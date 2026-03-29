import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Cloud, LayoutGrid, BarChart3 } from 'lucide-react';
import useWeatherStore from '../../store/useWeatherStore';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { location } = useWeatherStore();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentTime.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short'
  });

  const formattedTime = currentTime.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <header className={styles.navbar}>
      <div className={styles.left}>
        <div className={styles.logo}>
          <Cloud size={24} fill="currentColor" />
          <span className={styles.locationName}>{location.city}</span>
        </div>
      </div>

      <div className={styles.center}>
        <div className={styles.navPill}>
          <NavLink 
            to="/" 
            className={({ isActive }) => `${styles.navIcon} ${isActive ? styles.active : ''}`}
            title="Dashboard"
          >
            <LayoutGrid size={20} />
          </NavLink>
          <NavLink 
            to="/historical" 
            className={({ isActive }) => `${styles.navIcon} ${isActive ? styles.active : ''}`}
            title="Historical"
          >
            <BarChart3 size={20} />
          </NavLink>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.dateTime}>
          {formattedDate} | {formattedTime}
        </div>
    
      </div>
    </header>
  );
};

export default Navbar;
