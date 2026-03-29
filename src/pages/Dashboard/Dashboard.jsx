import React, { useEffect, useMemo, useState } from 'react';
import { 
  Thermometer, Wind, CloudRain, Droplets, Sun, Eye, Wind as WindIcon, Activity, 
  MapPin, Sun as SunIcon, Sunrise, Sunset, Cloud, CloudSun, Snowflake, CloudLightning,
  Calendar, Zap, Waves, Gauge
} from 'lucide-react';
import useWeatherStore from '../../store/useWeatherStore';
import { fetchWeatherData, fetchAirQualityData } from '../../services/weatherService';
import WeatherChart from '../../components/WeatherChart/WeatherChart';
import WeatherMetric from '../../components/WeatherMetric/WeatherMetric';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const { 
    location, 
    unit, 
    weatherData, 
    setWeatherData, 
    loading, 
    setLoading, 
    error, 
    setError,
    getWeatherInfo,
    getWeatherIcon,
    getBgImage
  } = useWeatherStore();

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [weather, airQuality] = await Promise.all([
          fetchWeatherData(location.lat, location.lon, unit, selectedDate),
          fetchAirQualityData(location.lat, location.lon, selectedDate)
        ]);
        
        setWeatherData({ ...weather, air_quality: airQuality });
        setError(null);
      } catch (err) {
        setError('Failed to fetch weather data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [location, unit, selectedDate, setWeatherData, setLoading, setError]);

  const weatherInfo = useMemo(() => {
    if (!weatherData) return null;
    return getWeatherInfo(weatherData.current.weather_code);
  }, [weatherData, getWeatherInfo]);

  const bgImage = useMemo(() => {
    if (!weatherInfo) return '';
    return getBgImage(weatherInfo.bg);
  }, [weatherInfo, getBgImage]);

  const hourlyChartData = useMemo(() => {
    if (!weatherData || !weatherData.hourly) return [];
    const { hourly } = weatherData;
    const { hourly: aqHourly } = weatherData.air_quality || {};
    
    return hourly.time.map((time, index) => ({
      time,
      temp: hourly.temperature_2m[index],
      humidity: hourly.relative_humidity_2m[index],
      precipitation: hourly.precipitation[index],
      visibility: hourly.visibility[index],
      wind_speed: hourly.wind_speed_10m[index],
      pm10: aqHourly?.pm10?.[index] || 0,
      pm25: aqHourly?.pm2_5?.[index] || 0
    }));
  }, [weatherData]);

  if (loading) return <div className={styles.loading}>Loading weather data...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!weatherData) return null;

  const current = weatherData.current;
  const daily = weatherData.daily;
  const aq = weatherData.air_quality?.current || {};
  
  const iconMap = {
    Sun: SunIcon,
    CloudSun: CloudSun,
    Cloud: Cloud,
    CloudRain: CloudRain,
    Snowflake: Snowflake,
    CloudLightning: CloudLightning
  };

  

  return (
    <div className={styles.dashboard}>
      <div className={styles.overlay}>
        <div className={styles.header}>
          <div className={styles.dateSelector}>
            <Calendar size={18} />
            <input 
              type="date" 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)}
              className={styles.dateInput}
            />
          </div>
        </div>

        <div className={styles.mainLayout}>
          {/* Left Section: Main Weather Info */}
          <div className={styles.leftSection}>
            <div className={styles.weatherInfo}>
              <h1 className={styles.conditionTitle}>{weatherInfo.label}s</h1>
              <p className={styles.subCondition}>{weatherInfo.sub}</p>
              <p className={styles.description}>
                Current conditions at {location.city}. Precipitation probability is {daily.precipitation_probability_max[0]}%.
              </p>
            </div>

            <div className={styles.mainTempContainer}>
              <div className={styles.tempLarge}>
                {Math.round(current.temperature_2m)}°
              </div>
              <div className={styles.locationInfo}>
                <div className={styles.cityRow}>
                  <MapPin size={18} />
                  <span>{location.city}</span>
                </div>
                <div className={styles.uvIndex}>
                  UV Ind.: {current.uv_index}
                </div>
              </div>
            </div>
          </div>

          {/* Center Section: Individual Metrics */}
          <div className={styles.centerSection}>
            <div className={styles.metricsGrid}>
              <WeatherMetric 
                icon={Thermometer} 
                label="Temp (Max/Min)" 
                value={`${Math.round(daily.temperature_2m_max[0])}° / ${Math.round(daily.temperature_2m_min[0])}°`} 
              />
              <WeatherMetric 
                icon={Droplets} 
                label="Humidity" 
                value={current.relative_humidity_2m} 
                unit="%" 
              />
              <WeatherMetric 
                icon={CloudRain} 
                label="Precipitation" 
                value={current.precipitation} 
                unit=" mm" 
              />
              <WeatherMetric 
                icon={Zap} 
                label="UV Index" 
                value={current.uv_index} 
              />
              <WeatherMetric 
                icon={Sunrise} 
                label="Sunrise" 
                value={new Date(daily.sunrise[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
              />
              <WeatherMetric 
                icon={Sunset} 
                label="Sunset" 
                value={new Date(daily.sunset[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
              />
              <WeatherMetric 
                icon={WindIcon} 
                label="Max Wind" 
                value={current.wind_speed_10m} 
                unit=" km/h" 
              />
              <WeatherMetric 
                icon={Waves} 
                label="Precip. Prob." 
                value={daily.precipitation_probability_max[0]} 
                unit="%" 
              />
            </div>

            <div className={styles.airQualitySection}>
              <h3>Air Quality Metrics</h3>
              <div className={styles.aqGrid}>
                <WeatherMetric 
                  icon={Activity} 
                  label="AQI" 
                  value={aq.european_aqi || 'N/A'} 
                />
                <WeatherMetric 
                  icon={Gauge} 
                  label="PM10" 
                  value={aq.pm10 || 'N/A'} 
                />
                <WeatherMetric 
                  icon={Gauge} 
                  label="PM2.5" 
                  value={aq.pm2_5 || 'N/A'} 
                />
                <WeatherMetric 
                  icon={Gauge} 
                  label="CO" 
                  value={aq.carbon_monoxide || 'N/A'} 
                />
                <WeatherMetric 
                  icon={Gauge} 
                  label="NO2" 
                  value={aq.nitrogen_dioxide || 'N/A'} 
                />
                <WeatherMetric 
                  icon={Gauge} 
                  label="SO2" 
                  value={aq.sulphur_dioxide || 'N/A'} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Hourly Charts */}
        <div className={styles.chartsContainer}>
          <div className={styles.chartsGrid}>
            <WeatherChart 
              data={hourlyChartData} 
              title="Temperature" 
              dataKey="temp" 
              unit={unit === 'celsius' ? '°C' : '°F'} 
              color="#ff6b6b" 
              height={180}
            />
            <WeatherChart 
              data={hourlyChartData} 
              title="Humidity" 
              dataKey="humidity" 
              unit="%" 
              color="#4dabf7" 
              height={180}
            />
            <WeatherChart 
              data={hourlyChartData} 
              title="Precipitation" 
              dataKey="precipitation" 
              unit=" mm" 
              color="#51cf66" 
              height={180}
            />
            <WeatherChart 
              data={hourlyChartData} 
              title="Visibility" 
              dataKey="visibility" 
              unit=" m" 
              color="#fab005" 
              height={180}
            />
            <WeatherChart 
              data={hourlyChartData} 
              title="Wind Speed" 
              dataKey="wind_speed" 
              unit=" km/h" 
              color="#be4bdb" 
              height={180}
            />
            <WeatherChart 
              data={hourlyChartData} 
              title="PM10 & PM2.5" 
              dataKey="pm10" 
              dataKey2="pm25"
              unit=" µg/m³" 
              color="#868e96" 
              color2="#495057"
              height={180}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
