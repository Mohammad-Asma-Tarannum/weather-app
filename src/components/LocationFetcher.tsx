import React from 'react';

interface Props {
  onLocation: (lat: number, lon: number) => void;
}

const LocationFetcher: React.FC<Props> = ({ onLocation }) => {
  const getLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onLocation(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        alert('Unable to fetch location.');
      }
    );
  };

  const handleManual = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat((e.target as any).lat.value);
    const lon = parseFloat((e.target as any).lon.value);
    if (!isNaN(lat) && !isNaN(lon)) {
      onLocation(lat, lon);
    }
  };

  return (
    <div className="flex flex-col gap-2 mb-4 w-full max-w-sm">
      <button
        className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition"
        onClick={getLocation}
      >
        Use My Location
      </button>
      <form className="flex gap-2" onSubmit={handleManual}>
        <input name="lat" type="number" step="any" placeholder="Latitude" className="border px-2 py-1 flex-1" required />
        <input name="lon" type="number" step="any" placeholder="Longitude" className="border px-2 py-1 flex-1" required />
        <button type="submit" className="bg-gray-900 text-white px-3 py-1 rounded">Go</button>
      </form>
    </div>
  );
};

export default LocationFetcher;
