import React from 'react';
import { LocationData } from './WeatherApp';

const LocationDisplay: React.FC<{ location: LocationData }> = ({ location }) => {
  return (
    <div className="mt-2 mb-2 p-2 w-full max-w-sm border bg-white">
      <div className="text-sm text-gray-700">Location:</div>
      <div className="font-medium">{location.display_name}</div>
    </div>
  );
};

export default LocationDisplay;
