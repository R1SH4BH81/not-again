# Weather Dashboard

A modern, responsive weather dashboard built with React and Vite. It provides real-time weather data, air quality metrics, and historical analysis with interactive charts.

## Features

- **Real-time Weather**: Current temperature, conditions, and precipitation probability.
- **Detailed Metrics**: Humidity, UV Index, Wind Speed, Sunrise, Sunset, and more.
- **Air Quality**: Comprehensive AQI monitoring including PM10 and PM2.5.
- **Historical Analysis**: Analyze weather trends over time with interactive charts.
- **Interactive Charts**:
  - Zoom in/out of specific timeframes using the range selector (Brush).
  - Multiple chart types (Line, Area, Bar) for different metrics.
- **Responsive Design**: Optimized for mobile, tablet, and desktop views.
- **Location Based**: Weather data based on coordinates and city names.
  
## Screenshot
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/32d89aa3-b9b7-4545-b271-2214922ad1d7" />


## Tech Stack

- **Frontend**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Styling**: CSS Modules
- **API**: [Open-Meteo](https://open-meteo.com/) (Weather & Air Quality)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. Clone the repository:
   ```bash
   https://github.com/R1SH4BH81/not-again.git
   cd not-again
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.

## Project Structure

- `src/components`: Reusable UI components like `WeatherChart`, `WeatherCard`, and `Navbar`.
- `src/pages`: Main application views (`Dashboard` and `Historical`).
- `src/services`: API service layers for fetching weather and air quality data.
- `src/store`: Global state management using Zustand.
- `src/assets`: Static assets and images.



## License

MIT
