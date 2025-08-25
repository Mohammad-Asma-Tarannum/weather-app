
import AlertItem from "./AlertItem";

interface Alert {
  discord_webhook: string;
  id: number;
  label: string;
  last_alerted: string;
  loki_url: string;
  search_term: string;
  value: string;
}

interface AlertsSectionProps {
  alerts: Alert[];
  onDelete: (id: number) => void;
  onEdit: (alert: Alert) => void;
}

const AlertsSection: React.FC<AlertsSectionProps> = ({ alerts, onDelete, onEdit }) => {
  return (
    <section className="w-full py-8 px-4">
      <ul className="space-y-6">
        {alerts.map((alert) => (
          <AlertItem key={alert.id} alert={alert} onDelete={onDelete} onEdit={onEdit} />
        ))}
      </ul>
      {alerts.length === 0 && (
        <div className="text-gray-400 text-center py-8">No alerts found.</div>
      )}
    </section>
  );
};

export { AlertsSection };
