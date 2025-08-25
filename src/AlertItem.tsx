import React from "react";

interface Alert {
  discord_webhook: string;
  id: number;
  label: string;
  last_alerted: string;
  loki_url: string;
  search_term: string;
  value: string;
}


interface AlertItemProps {
  alert: Alert;
  onDelete: (id: number) => void;
  onEdit: (alert: Alert) => void;
}


const AlertItem: React.FC<AlertItemProps> = ({ alert, onDelete, onEdit }) => (
  <li className="bg-gray-100 border border-gray-300 rounded-lg shadow-sm p-6 hover:bg-gray-200 transition-colors">
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500">ID: {alert.id}</span>
        <div className="flex gap-2">
          <button
            className="text-gray-400 hover:text-blue-500"
            title="Edit Alert"
            onClick={() => onEdit(alert)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.293-6.293a1 1 0 011.414 0l1.586 1.586a1 1 0 010 1.414L11 15H9v-2z" />
            </svg>
          </button>
          <button
            className="text-gray-400 hover:text-red-500"
            title="Delete Alert"
            onClick={() => onDelete(alert.id)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      <div className="text-gray-700 text-sm">
        <span className="font-semibold">Search Term:</span> {alert.search_term}
      </div>
      <div className="text-gray-700 text-sm">
        <span className="font-semibold">{alert.label} : </span> {alert.value}
      </div>
      <div className="text-gray-500 text-xs">
        <span className="font-semibold">Last Alerted:</span> {alert.last_alerted}
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        <a
          href={alert.loki_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:underline text-xs"
        >
          Loki URL
        </a>
        <a
          href={alert.discord_webhook}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:underline text-xs"
        >
          Discord Webhook
        </a>
      </div>
    </div>
  </li>
);

export default AlertItem;
