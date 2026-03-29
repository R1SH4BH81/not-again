import axios from 'axios';

const FORECAST_BASE_URL = 'https://api.open-meteo.com/v1/forecast';
const AIR_QUALITY_BASE_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';
const ARCHIVE_BASE_URL = 'https://archive-api.open-meteo.com/v1/archive';
const BIG_DATA_CLOUD_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client';

export const fetchWeatherData = async (lat, lon, unit = 'celsius', date = null) => {
  try {
    const params = {
      latitude: lat,
      longitude: lon,
      current: [
        'temperature_2m', 'relative_humidity_2m', 'precipitation', 'weather_code', 
        'wind_speed_10m', 'uv_index', 'is_day'
      ],
      hourly: [
        'temperature_2m', 'relative_humidity_2m', 'precipitation', 'weather_code', 
        'visibility', 'wind_speed_10m'
      ],
      daily: ['temperature_2m_max', 'temperature_2m_min', 'sunrise', 'sunset', 'precipitation_probability_max'],
      temperature_unit: unit,
      timezone: 'auto'
    };

    if (date) {
      params.start_date = date;
      params.end_date = date;
    }

    const response = await axios.get(FORECAST_BASE_URL, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

export const fetchAirQualityData = async (lat, lon, date = null, startDate = null, endDate = null) => {
  try {
    const params = {
      latitude: lat,
      longitude: lon,
      current: ['european_aqi', 'pm10', 'pm2_5', 'carbon_monoxide', 'nitrogen_dioxide', 'sulphur_dioxide'],
      hourly: ['pm10', 'pm2_5', 'carbon_monoxide', 'nitrogen_dioxide', 'sulphur_dioxide'],
      timezone: 'auto'
    };

    if (date) {
      params.start_date = date;
      params.end_date = date;
    } else if (startDate && endDate) {
      params.start_date = startDate;
      params.end_date = endDate;
    }

    const response = await axios.get(AIR_QUALITY_BASE_URL, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching air quality data:', error);
    throw error;
  }
};

export const fetchHistoricalData = async (lat, lon, startDate, endDate, unit = 'celsius') => {
  try {
    const params = {
      latitude: lat,
      longitude: lon,
      start_date: startDate,
      end_date: endDate,
      daily: [
        'temperature_2m_max', 'temperature_2m_min', 'temperature_2m_mean', 
        'sunrise', 'sunset', 'precipitation_sum', 'wind_speed_10m_max', 'wind_direction_10m_dominant'
      ],
      temperature_unit: unit,
      timezone: 'auto'
    };

    const response = await axios.get(ARCHIVE_BASE_URL, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching historical data:', error);
    throw error;
  }
};

export const reverseGeocode = async (lat, lon) => {
  try {
    const response = await axios.get(BIG_DATA_CLOUD_URL, {
      params: { latitude: lat, longitude: lon, localityLanguage: 'en' }
    });
    return response.data;
  } catch (error) {
    console.error('Error in reverse geocoding:', error);
    return null;
  }
};
