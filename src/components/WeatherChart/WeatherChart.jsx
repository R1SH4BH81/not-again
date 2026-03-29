import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, BarChart, Bar, Legend
} from 'recharts';
import styles from './WeatherChart.module.css';

const WeatherChart = ({ 
  data, 
  title, 
  dataKey, 
  color = '#3b82f6', 
  type = 'area', 
  unit = '',
  height = 200,
  dataKey2 = null,
  color2 = '#ef4444'
}) => {
  const formatXAxis = (time) => {
    const date = new Date(time);
    return date.getHours() + ':00';
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.customTooltip}>
          <p className={styles.tooltipLabel}>{new Date(label).toLocaleString()}</p>
          {payload.map((entry, index) => (
            <p key={index} className={styles.tooltipValue} style={{ color: entry.color }}>
              {entry.name}: {entry.value}{unit}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    if (type === 'area') {
      return (
        <AreaChart data={data}>
          <defs>
            <linearGradient id={`color${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2229" />
          <XAxis 
            dataKey="time" 
            tickFormatter={formatXAxis} 
            stroke="#666" 
            fontSize={12} 
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#666" 
            fontSize={12} 
            tickLine={false}
            axisLine={false}
            unit={unit}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey={dataKey} 
            stroke={color} 
            fillOpacity={1} 
            fill={`url(#color${dataKey})`} 
            strokeWidth={2}
          />
        </AreaChart>
      );
    }

    if (type === 'line') {
      return (
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2229" />
          <XAxis 
            dataKey="time" 
            tickFormatter={formatXAxis} 
            stroke="#666" 
            fontSize={12} 
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#666" 
            fontSize={12} 
            tickLine={false}
            axisLine={false}
            unit={unit}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend iconType="circle" wrapperStyle={{ paddingTop: '1rem' }} />
          <Line 
            type="monotone" 
            dataKey={dataKey} 
            stroke={color} 
            strokeWidth={2} 
            dot={false}
            name={dataKey.replace('_', ' ')}
          />
          {dataKey2 && (
            <Line 
              type="monotone" 
              dataKey={dataKey2} 
              stroke={color2} 
              strokeWidth={2} 
              dot={false}
              name={dataKey2.replace('_', ' ')}
            />
          )}
        </LineChart>
      );
    }

    return null;
  };

  return (
    <div className={styles.chartContainer}>
      <h4 className={styles.chartTitle}>{title}</h4>
      <div className={styles.chartWrapper} style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeatherChart;
