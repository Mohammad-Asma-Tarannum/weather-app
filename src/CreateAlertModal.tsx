import React from "react";

type AlertForm = {
  loki_url: string;
  label: string;
  value: string;
  search_term: string;
  discord_webhook: string;
  [key: string]: string;
};

interface CreateAlertModalProps {
  open: boolean;
  form: AlertForm;
  formError: string | null;
  formLoading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}


const BASE_URL = 'http://localhost:6969';

const CreateAlertModal: React.FC<CreateAlertModalProps> = ({ open, form, formError, formLoading, onChange, onClose, onSubmit }) => {
  const [labels, setLabels] = React.useState<string[]>([]);
  const [values, setValues] = React.useState<string[]>([]);
  const [labelsLoading, setLabelsLoading] = React.useState(false);
  const [valuesLoading, setValuesLoading] = React.useState(false);
  const [labelsError, setLabelsError] = React.useState<string | null>(null);
  const [valuesError, setValuesError] = React.useState<string | null>(null);

  // Fetch labels when loki_url changes and is valid
  React.useEffect(() => {
    if (form.loki_url) {
      setLabelsLoading(true);
      setLabelsError(null);
      fetch(`${BASE_URL}/get-labels?loki_url=${encodeURIComponent(form.loki_url)}`)
        .then((res) => res.json())
        .then((data) => setLabels(data.labels || []))
        .catch(() => setLabelsError('Failed to fetch labels'))
        .finally(() => setLabelsLoading(false));
    } else {
      setLabels([]);
    }
  }, [form.loki_url]);

  // Fetch values when label changes and is valid
  React.useEffect(() => {
    if (form.loki_url && form.label) {
      setValuesLoading(true);
      setValuesError(null);
      fetch(`${BASE_URL}/get-label-values?loki_url=${encodeURIComponent(form.loki_url)}&label=${encodeURIComponent(form.label)}`)
        .then((res) => res.json())
        .then((data) => setValues(data.values || []))
        .catch(() => setValuesError('Failed to fetch values'))
        .finally(() => setValuesLoading(false));
    } else {
      setValues([]);
    }
  }, [form.loki_url, form.label]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-gray-50 border border-gray-300 rounded-lg shadow-lg p-8 w-full max-w-md">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Create Alert</h3>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <input
            name="loki_url"
            value={form.loki_url}
            onChange={onChange}
            placeholder="Loki URL"
            className="border border-gray-300 rounded px-3 py-2 text-gray-700 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
            required
          />
          {/* Label dropdown */}
          <div>
            <label className="block text-gray-600 text-sm mb-1">Label</label>
            {labelsLoading ? (
              <div className="text-gray-400 text-xs">Loading labels...</div>
            ) : labelsError ? (
              <div className="text-red-400 text-xs">{labelsError}</div>
            ) : (
              <select
                name="label"
                value={form.label}
                onChange={onChange}
                className="border border-gray-300 rounded px-3 py-2 text-gray-700 bg-gray-100 w-full"
                required
                disabled={!form.loki_url || labels.length === 0}
              >
                <option value="" disabled>
                  {labels.length === 0 ? 'Enter Loki URL first' : 'Select Label'}
                </option>
                {labels.map((label) => (
                  <option key={label} value={label}>{label}</option>
                ))}
              </select>
            )}
          </div>
          {/* Value dropdown */}
          <div>
            <label className="block text-gray-600 text-sm mb-1">Value</label>
            {valuesLoading ? (
              <div className="text-gray-400 text-xs">Loading values...</div>
            ) : valuesError ? (
              <div className="text-red-400 text-xs">{valuesError}</div>
            ) : (
              <select
                name="value"
                value={form.value}
                onChange={onChange}
                className="border border-gray-300 rounded px-3 py-2 text-gray-700 bg-gray-100 w-full"
                required
                disabled={!form.label || values.length === 0}
              >
                <option value="" disabled>
                  {values.length === 0 ? 'Select label first' : 'Select Value'}
                </option>
                {values.map((value) => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            )}
          </div>
          <input
            name="search_term"
            value={form.search_term}
            onChange={onChange}
            placeholder="Search Term"
            className="border border-gray-300 rounded px-3 py-2 text-gray-700 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
            required
          />
          <input
            name="discord_webhook"
            value={form.discord_webhook}
            onChange={onChange}
            placeholder="Discord Webhook"
            className="border border-gray-300 rounded px-3 py-2 text-gray-700 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
            required
          />
          {formError && <div className="text-red-500 text-sm">{formError}</div>}
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
              onClick={onClose}
              disabled={formLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-gray-700 text-gray-50 hover:bg-gray-800"
              disabled={formLoading}
            >
              {formLoading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAlertModal;
