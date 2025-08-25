import React from "react";

interface AlertsHeaderProps {
  onCreate: () => void;
}

const AlertsHeader: React.FC<AlertsHeaderProps> = ({ onCreate }) => (
  <div className="flex items-center justify-between mb-6 border-b border-gray-300 pb-2">
    <h2 className="text-2xl font-semibold text-gray-700">Active Alerts</h2>
    <button
      className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 text-2xl"
      aria-label="Create Alert"
      onClick={onCreate}
    >
      <span className="pointer-events-none select-none">+</span>
    </button>
  </div>
);

export default AlertsHeader;
