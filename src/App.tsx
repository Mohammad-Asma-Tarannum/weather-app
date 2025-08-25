import React from "react";
import { AlertsSection } from "./AlertsSection";
import AlertsHeader from "./AlertsHeader";
import CreateAlertModal from "./CreateAlertModal";
import EditAlertModal from "./EditAlertModal";


interface Alert {
	discord_webhook: string;
	id: number;
	label: string;
	last_alerted: string;
	loki_url: string;
	search_term: string;
	value: string;
}

type AlertForm = {
	loki_url: string;
	label: string;
	value: string;
	search_term: string;
	discord_webhook: string;
	[key: string]: string;
};

const BASE_URL = 'http://localhost:6969';

function fetchAlerts(): Promise<Alert[]> {
	return fetch(`${BASE_URL}/show-alerts`)
		.then((res) => res.json())
		.then((data) => data.alerts || []);
}

const App: React.FC = () => {
	const [alerts, setAlerts] = React.useState<Alert[]>([]);
	const [loading, setLoading] = React.useState(true);
	const [error, setError] = React.useState<string | null>(null);
	const [showModal, setShowModal] = React.useState(false);
	const [form, setForm] = React.useState<AlertForm>({
		loki_url: '',
		label: '',
		value: '',
		search_term: '',
		discord_webhook: '',
	});
	const [formError, setFormError] = React.useState<string | null>(null);
	const [formLoading, setFormLoading] = React.useState(false);
	const [editModalOpen, setEditModalOpen] = React.useState(false);
	const [editForm, setEditForm] = React.useState<AlertForm>({
		loki_url: '',
		label: '',
		value: '',
		search_term: '',
		discord_webhook: '',
	});
	const [editFormError, setEditFormError] = React.useState<string | null>(null);
	const [editFormLoading, setEditFormLoading] = React.useState(false);
	const [editAlertId, setEditAlertId] = React.useState<number | null>(null);

	React.useEffect(() => {
		fetchAlerts()
			.then(setAlerts)
			.catch(() => setError('Failed to load alerts'))
			.finally(() => setLoading(false));
	}, []);

	function handleOpenModal() {
		setShowModal(true);
		setForm({
			loki_url: '',
			label: '',
			value: '',
			search_term: '',
			discord_webhook: '',
		});
		setFormError(null);
	}

	function handleCloseModal() {
		setShowModal(false);
		setFormError(null);
	}

	function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
		setForm({ ...form, [e.target.name]: e.target.value });
	}

	async function handleCreateAlert(e: React.FormEvent) {
		e.preventDefault();
		setFormError(null);
		setFormLoading(true);
		// Validate required fields
		const required = ['loki_url', 'label', 'value', 'search_term', 'discord_webhook'];
		if (!required.every((f) => form[f])) {
			setFormError('Please fill all fields.');
			setFormLoading(false);
			return;
		}
		try {
			const res = await fetch(`${BASE_URL}/create-alert`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(form),
			});
			if (!res.ok) {
				const data = await res.json();
				setFormError(data.error || 'Failed to create alert');
				setFormLoading(false);
				return;
			}
			setShowModal(false);
			setFormLoading(false);
			// Refresh alerts
			setLoading(true);
			fetchAlerts()
				.then(setAlerts)
				.catch(() => setError('Failed to load alerts'))
				.finally(() => setLoading(false));
		} catch (err) {
			setFormError('Failed to create alert');
			setFormLoading(false);
		}
	}
        
	async function handleDeleteAlert(_id: number) {
		setLoading(true);
		try {
			// Optionally handle error response
			fetchAlerts()
				.then(setAlerts)
				.catch(() => setError('Failed to load alerts'))
				.finally(() => setLoading(false));
		} catch (err) {
			setError('Failed to delete alert');
			setLoading(false);
		}
	}

	function handleEditAlert(alert: Alert) {
		setEditAlertId(alert.id);
		setEditForm({
			loki_url: alert.loki_url,
			label: alert.label,
			value: alert.value,
			search_term: alert.search_term,
			discord_webhook: alert.discord_webhook,
		});
		setEditFormError(null);
		setEditModalOpen(true);
	}

	function handleEditFormChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
		setEditForm({ ...editForm, [e.target.name]: e.target.value });
	}

	function handleCloseEditModal() {
		setEditModalOpen(false);
		setEditFormError(null);
		setEditAlertId(null);
	}

	async function handleEditFormSubmit(e: React.FormEvent) {
		e.preventDefault();
		setEditFormError(null);
		setEditFormLoading(true);
		if (!editAlertId) {
			setEditFormError('No alert selected');
			setEditFormLoading(false);
			return;
		}
		try {
			const res = await fetch(`${BASE_URL}/edit-alert/${editAlertId}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(editForm),
			});
			if (!res.ok) {
				const data = await res.json();
				setEditFormError(data.error || 'Failed to edit alert');
				setEditFormLoading(false);
				return;
			}
			setEditModalOpen(false);
			setEditFormLoading(false);
			setEditAlertId(null);
			// Refresh alerts
			setLoading(true);
			fetchAlerts()
				.then(setAlerts)
				.catch(() => setError('Failed to load alerts'))
				.finally(() => setLoading(false));
		} catch (err) {
			setEditFormError('Failed to edit alert');
			setEditFormLoading(false);
		}
	}

	return (
		<div className="min-h-screen bg-gray-50 w-full">
			<div className="w-full p-4">
				<AlertsHeader onCreate={handleOpenModal} />
				{loading ? (
					<div className="text-gray-400 text-center py-8">Loading alerts...</div>
				) : error ? (
					<div className="text-red-400 text-center py-8">{error}</div>
				) : (
					<AlertsSection alerts={alerts} onDelete={handleDeleteAlert} onEdit={handleEditAlert} />
				)}
			</div>
			<CreateAlertModal
				open={showModal}
				form={form}
				formError={formError}
				formLoading={formLoading}
				onChange={handleChange}
				onClose={handleCloseModal}
				onSubmit={handleCreateAlert}
			/>
			<EditAlertModal
				open={editModalOpen}
				form={editForm}
				formError={editFormError}
				formLoading={editFormLoading}
				onChange={handleEditFormChange}
				onClose={handleCloseEditModal}
				onSubmit={handleEditFormSubmit}
				alertId={editAlertId}
			/>
		</div>
	);
};


export default App;
