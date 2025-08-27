import React from 'react';
import { WeatherData } from './WeatherApp';

const WeatherDisplay: React.FC<{ weather: WeatherData }> = ({ weather }) => {
  return (
    <div className="mt-4 p-4 border w-full max-w-sm bg-gray-50">
      <div className="text-xl font-semibold mb-2">Current Weather</div>
      <div className="flex flex-col gap-1">
        <span>Temperature: <b>{weather.temperature}°C</b></span>
        <span>Wind Speed: <b>{weather.windspeed} km/h</b></span>
        <span>Wind Direction: <b>{weather.winddirection}°</b></span>
        <span>Daytime: <b>{weather.is_day ? 'Day' : 'Night'}</b></span>
        <span>Weather Code: <b>{weather.weathercode}</b></span>
        <span>Time: <b>{weather.time}</b></span>
      </div>
    </div>
  );
};

export default WeatherDisplay;
