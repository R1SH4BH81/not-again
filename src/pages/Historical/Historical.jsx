import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, BarChart, TrendingUp, Wind, CloudRain, Sunrise, Sunset, Activity } from 'lucide-react';
import useWeatherStore from '../../store/useWeatherStore';
import { fetchHistoricalData, fetchAirQualityData } from '../../services/weatherService';
import WeatherChart from '../../components/WeatherChart/WeatherChart';
import styles from './Historical.module.css';

const Historical = () => {
  const { location, unit } = useWeatherStore();
  const [dateRange, setDateRange] = useState(() => {
    const end = new Date();
    const start = new Date();
    start.setFullYear(end.getFullYear() - 2);
    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0]
    };
  });
  const [historicalData, setHistoricalData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadHistorical = async () => {
      setLoading(true);
      try {
        const [weatherData, aqData] = await Promise.all([
          fetchHistoricalData(
            location.lat, 
            location.lon, 
            dateRange.start, 
            dateRange.end, 
            unit
          ),
          fetchAirQualityData(
            location.lat,
            location.lon,
            null,
            dateRange.start,
            dateRange.end
          )
        ]);
        
        setHistoricalData({
          ...weatherData,
          hourly: aqData.hourly // AQ data is hourly
        });
        setError(null);
      } catch (err) {
        setError('Failed to fetch historical data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadHistorical();
  }, [location, unit, dateRange]);

  const chartData = useMemo(() => {
    if (!historicalData) return [];
    
    const { daily, hourly } = historicalData;
    
    // Format Sunrise and Sunset in IST (UTC+5:30)
    const formatToIST = (utcString) => {
      if (!utcString) return null;
      const date = new Date(utcString);
      // IST is UTC + 5:30
      const istTime = new Date(date.getTime() + (5.5 * 60 * 60 * 1000));
      return istTime.getHours() + (istTime.getMinutes() / 60);
    };

    return daily.time.map((time, index) => {
      // Find AQI data for this day from hourly if available
      // For simplicity, we'll average the hourly PM values for the day
      const dayStart = index * 24;
      const dayEnd = (index + 1) * 24;
      const dayPm10 = hourly?.pm10 ? hourly.pm10.slice(dayStart, dayEnd).reduce((a, b) => a + b, 0) / 24 : 0;
      const dayPm25 = hourly?.pm2_5 ? hourly.pm2_5.slice(dayStart, dayEnd).reduce((a, b) => a + b, 0) / 24 : 0;

      return {
        time,
        temp_max: daily.temperature_2m_max[index],
        temp_min: daily.temperature_2m_min[index],
        temp_mean: daily.temperature_2m_mean[index],
        sunrise: formatToIST(daily.sunrise[index]),
        sunset: formatToIST(daily.sunset[index]),
        precipitation: daily.precipitation_sum[index],
        wind_speed_max: daily.wind_speed_10m_max[index],
        wind_direction: daily.wind_direction_10m_dominant[index],
        pm10: dayPm10,
        pm25: dayPm25
      };
    });
  }, [historicalData]);

  const totalPrecipitation = useMemo(() => {
    if (!chartData.length) return 0;
    return chartData.reduce((sum, day) => sum + day.precipitation, 0).toFixed(2);
  }, [chartData]);

  return (
    <div className={styles.historicalPage}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h2>Historical Analysis</h2>
          <p className={styles.subtitle}>Analyzing trends for {location.city}</p>
        </div>
        <div className={styles.datePicker}>
          <div className={styles.inputGroup}>
            <Calendar size={18} />
            <input 
              type="date" 
              value={dateRange.start} 
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
            />
          </div>
          <span className={styles.toText}>to</span>
          <div className={styles.inputGroup}>
            <Calendar size={18} />
            <input 
              type="date" 
              value={dateRange.end} 
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <span>Analyzing historical trends...</span>
        </div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : (
        <div className={styles.content}>
          <div className={styles.summaryRow}>
            <div className={styles.summaryCard}>
              <CloudRain size={24} color="#10b981" />
              <div className={styles.summaryInfo}>
                <span className={styles.summaryLabel}>Total Precipitation</span>
                <span className={styles.summaryValue}>{totalPrecipitation} mm</span>
              </div>
            </div>
          </div>

          <div className={styles.chartsGrid}>
            <div className={styles.chartWrapper}>
              <WeatherChart 
                data={chartData} 
                title="Temperature: Max, Min, & Mean" 
                dataKey="temp_max" 
                dataKey2="temp_min"
                unit={unit === 'celsius' ? '°C' : '°F'} 
                type="line"
                color="#ef4444"
                color2="#3b82f6"
                height={300}
              />
            </div>
            
            <div className={styles.chartWrapper}>
              <WeatherChart 
                data={chartData} 
                title="Sun Cycle (Sunrise/Sunset in IST)" 
                dataKey="sunrise" 
                dataKey2="sunset"
                unit="h" 
                type="area"
                color="#f59e0b"
                color2="#6366f1"
                height={300}
              />
            </div>

            <div className={styles.chartWrapper}>
              <WeatherChart 
                data={chartData} 
                title="Precipitation Sum" 
                dataKey="precipitation" 
                unit=" mm" 
                type="bar"
                color="#10b981"
                height={300}
              />
            </div>

            <div className={styles.chartWrapper}>
              <WeatherChart 
                data={chartData} 
                title="Max Wind Speed & Direction" 
                dataKey="wind_speed_max" 
                unit=" km/h" 
                type="line"
                color="#f59e0b"
                height={300}
              />
            </div>

            <div className={styles.chartWrapper}>
              <WeatherChart 
                data={chartData} 
                title="Air Quality Trends (PM10 & PM2.5)" 
                dataKey="pm10" 
                dataKey2="pm25"
                unit=" µg/m³" 
                type="area"
                color="#868e96"
                color2="#495057"
                height={300}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Historical;
