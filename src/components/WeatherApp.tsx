import React, { useState } from 'react';
import LocationFetcher from './LocationFetcher';
import WeatherDisplay from './WeatherDisplay';
import LocationDisplay from './LocationDisplay';
import Loader from './Loader';
import ErrorDisplay from './ErrorDisplay';

export interface WeatherData {
  temperature: number;
  windspeed: number;
  winddirection: number;
  is_day: number;
  weathercode: number;
  time: string;
}

export interface LocationData {
  display_name: string;
  address: Record<string, string>;
}

const WeatherApp: React.FC = () => {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLocation = async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    setCoords({ lat, lon });
    try {
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
      );
      const weatherJson = await weatherRes.json();
      setWeather(weatherJson.current_weather);
      const locRes = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
      );
      const locJson = await locRes.json();
      setLocation({ display_name: locJson.display_name, address: locJson.address });
    } catch (e: any) {
      setError('Failed to fetch weather or location data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col items-center justify-center px-4">
      <h1 className="text-3xl font-bold mb-4">Weather App</h1>
      <LocationFetcher onLocation={handleLocation} />
      {loading && <Loader />}
      {error && <ErrorDisplay message={error} />}
      {location && <LocationDisplay location={location} />}
      {weather && <WeatherDisplay weather={weather} />}
    </div>
  );
};

export default WeatherApp;
