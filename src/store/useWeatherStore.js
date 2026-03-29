import { create } from 'zustand';

const useWeatherStore = create((set) => ({
  location: {
    lat: 51.5074, // Default to London
    lon: -0.1278,
    city: 'London',
    country: 'United Kingdom',
  },
  unit: 'celsius', // 'celsius' or 'fahrenheit'
  weatherData: null,
  hourlyData: null,
  historicalData: null,
  loading: false,
  error: null,

  setLocation: (location) => set({ location }),
  setUnit: (unit) => set({ unit }),
  setWeatherData: (weatherData) => set({ weatherData }),
  setHourlyData: (hourlyData) => set({ hourlyData }),
  setHistoricalData: (historicalData) => set({ historicalData }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  
  getWeatherInfo: (code) => {
    // Open-Meteo Weather Codes Mapping
    if (code === 0) return { label: 'Sunny', sub: 'Clear sky conditions', bg: 'sunny' };
    if ([1, 2, 3, 45, 48].includes(code)) return { label: 'Overcast', sub: 'Mainly cloudy conditions', bg: 'overcast' };
    if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 71, 73, 75, 77, 80, 81, 82, 85, 86, 95, 96, 99].includes(code)) {
      return { label: 'Rainy', sub: 'Precipitation expected', bg: 'rainy' };
    }
    return { label: 'Unknown', sub: 'Checking weather...', bg: 'sunny' };
  },

  getWeatherIcon: (code) => {
    // Basic mapping for Lucide icons
    if (code === 0) return 'Sun';
    if ([1, 2, 3].includes(code)) return 'CloudSun';
    if ([45, 48].includes(code)) return 'Cloud';
    if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'CloudRain';
    if ([71, 73, 75, 77, 85, 86].includes(code)) return 'Snowflake';
    if ([95, 96, 99].includes(code)) return 'CloudLightning';
    return 'Cloud';
  },

  getBgImage: (type) => {
    const bgs = {
      sunny: '/Gemini_Generated_Image_surxlasurxlasurx.png',
      rainy: '/Gemini_Generated_Image_qbweklqbweklqbwe.png',
      overcast: '/Gemini_Generated_Image_dzx2ywdzx2ywdzx2.png'
    };
    return bgs[type] || bgs.sunny;
  },
  
  toggleUnit: () => set((state) => ({ 
    unit: state.unit === 'celsius' ? 'fahrenheit' : 'celsius' 
  })),
}));

export default useWeatherStore;
