import React, { useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Lenis from '@studio-freight/lenis';
import useWeatherStore from './store/useWeatherStore';
import { reverseGeocode } from './services/weatherService';
import Navbar from './components/Navbar/Navbar';
import Dashboard from './pages/Dashboard/Dashboard';
import Historical from './pages/Historical/Historical';
import './App.css';

function App() {
  const { 
    setLocation, 
    weatherData, 
    getWeatherInfo, 
    getBgImage,
    sidebarExpanded 
  } = useWeatherStore();

  const weatherInfo = useMemo(() => {
    if (!weatherData) return null;
    return getWeatherInfo(weatherData.current.weather_code);
  }, [weatherData, getWeatherInfo]);

  const bgImage = useMemo(() => {
    if (!weatherInfo) return 'https://res.cloudinary.com/djap3kkqi/image/upload/v1774769710/Gemini_Generated_Image_surxlasurxlasurx_tfh9d5.avif';
    return getBgImage(weatherInfo.bg);
  }, [weatherInfo, getBgImage]);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const geoInfo = await reverseGeocode(latitude, longitude);
        
        if (geoInfo) {
          setLocation({
            lat: latitude,
            lon: longitude,
            city: geoInfo.locality || geoInfo.city || geoInfo.principalSubdivision || 'Current Location',
            country: geoInfo.countryName || ''
          });
        } else {
          setLocation({
            lat: latitude,
            lon: longitude,
            city: 'My Location',
            country: ''
          });
        }
      }, (error) => {
        console.error("Error getting location:", error);
      });
    }
  }, [setLocation]);

  return (
    <Router>
      <div 
        className="app-container"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          transition: 'background-image 0.5s ease-in-out'
        }}
       >
         <main className="main-content">
           <Navbar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/historical" element={<Historical />} />
            {/* Fallback routes */}
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
