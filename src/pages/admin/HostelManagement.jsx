import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Building2, DoorOpen, Bed, Search, Plus, Pencil, Trash2,
    X, AlertCircle, LayoutGrid
} from 'lucide-react';

const FormModal = ({ isOpen, onClose, title, fields, initialData, onSubmit, isSubmitting }) => {

    const [formData, setFormData] = useState(initialData || {});

    useEffect(() => {
        setFormData(initialData || {});
    }, [initialData]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900">{title}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {fields.map(field => (
                        <div key={field.name}>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                {field.label} {field.required && <span className="text-rose-500">*</span>}
                            </label>
                            {field.type === 'select' ? (
                                <select
                                    name={field.name}
                                    value={formData[field.name] || ''}
                                    onChange={handleChange}
                                    required={field.required}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                                >
                                    <option value="">Select {field.label}</option>
                                    {field.options?.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type={field.type || 'text'}
                                    name={field.name}
                                    value={formData[field.name] || ''}
                                    onChange={handleChange}
                                    placeholder={field.placeholder}
                                    required={field.required}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                                />
                            )}
                        </div>
                    ))}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

function Table({ data, columns, loading, error, onEdit, onDelete, entityName }) {
    if (loading) {
        return <div className="p-8 text-center text-slate-400">Loading {entityName}...</div>;
    }

    if (error) {
        return (
            <div className="p-8 text-center text-rose-500 flex items-center justify-center gap-2">
                <AlertCircle size={18} />
                {error}
            </div>
        );
    }

    if (data.length === 0) {
        return <div className="p-8 text-center text-slate-400">No {entityName} found.</div>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                        {columns.map(col => (
                            <th key={col.key} className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                {col.label}
                            </th>
                        ))}
                        <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {data.map((item, idx) => (
                        <tr key={item._id || idx} className="hover:bg-slate-50/80 transition-colors">
                            {columns.map(col => (
                                <td key={col.key} className="px-6 py-4 text-slate-700">
                                    {col.render ? col.render(item) : item[col.key] || '—'}
                                </td>
                            ))}
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <button
                                        onClick={() => onEdit(item)}
                                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                                        title="Edit"
                                    >
                                        <Pencil size={16} />
                                    </button>
                                    <button
                                        onClick={() => onDelete(item)}
                                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function HostelRoomBedManagement() {

    const apiUrl = import.meta.env.VITE_API_URL;

    // Data states
    const [hostels, setHostels] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [beds, setBeds] = useState([]);

    // UI states
    const [loading, setLoading] = useState({ hostels: false, rooms: false, beds: false });
    const [error, setError] = useState({ hostels: null, rooms: null, beds: null });

    // Search terms per entity
    const [hostelSearch, setHostelSearch] = useState('');
    const [roomSearch, setRoomSearch] = useState('');
    const [bedSearch, setBedSearch] = useState('');

    // Modal states
    const [modalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [modalType, setModalType] = useState(null); // 'hostel', 'room', 'bed'
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch all data on mount
    useEffect(() => {
        fetchHostels();
        fetchRooms();
        fetchBeds();
    }, []);

    const fetchHostels = async () => {
        setLoading(prev => ({ ...prev, hostels: true }));
        try {
            const res = await axios.get(`${apiUrl}/fetchhosteldata`);
            setHostels(res.data || []);
        } catch (err) {
            setError(prev => ({ ...prev, hostels: 'Failed to load hostels' }));
        } finally {
            setLoading(prev => ({ ...prev, hostels: false }));
        }
    };

    const fetchRooms = async () => {
        setLoading(prev => ({ ...prev, rooms: true }));
        try {
            const res = await axios.get(`${apiUrl}/fetchroomdata`);
            setRooms(res.data || []);
        } catch (err) {
            setError(prev => ({ ...prev, rooms: 'Failed to load rooms' }));
        } finally {
            setLoading(prev => ({ ...prev, rooms: false }));
        }
    };

    const fetchBeds = async () => {
        setLoading(prev => ({ ...prev, beds: true }));
        try {
            const res = await axios.get(`${apiUrl}/fetchbeddata`);
            setBeds(res.data || []);
        } catch (err) {
            setError(prev => ({ ...prev, beds: 'Failed to load beds' }));
        } finally {
            setLoading(prev => ({ ...prev, beds: false }));
        }
    };

    // Delete handlers
    const handleDelete = async (type, id, name) => {
        if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;
        try {
            let endpoint = '';
            switch (type) {
                case 'hostel': endpoint = `/deletehostel/${id}`; break;
                case 'room': endpoint = `/deleteroom/${id}`; break;
                case 'bed': endpoint = `/deletebed/${id}`; break;
                default: return;
            }
            await axios.delete(`${apiUrl}${endpoint}`);
            // Refresh appropriate list
            if (type === 'hostel') fetchHostels();
            if (type === 'room') fetchRooms();
            if (type === 'bed') fetchBeds();
        } catch (err) {
            alert('Failed to delete');
        }
    };

    // Open modal for add/edit
    const openModal = (type, item = null) => {
        setModalType(type);
        setEditingItem(item);
        setModalOpen(true);
    };

    // Submit modal form
    const handleModalSubmit = async (formData) => {
        setIsSubmitting(true);
        try {
            const isEditing = !!editingItem;
            let endpoint = '';
            let method = 'post';
            let payload = { ...formData };

            switch (modalType) {
                case 'hostel':
                    endpoint = isEditing ? `/updatehostel/${editingItem._id}` : '/addhostel';
                    break;
                case 'room':
                    endpoint = isEditing ? `/updateroom/${editingItem._id}` : '/addroom';
                    break;
                case 'bed':
                    endpoint = isEditing ? `/updatebed/${editingItem._id}` : '/addbed';
                    break;
                default: return;
            }

            if (isEditing) {
                await axios.put(`${apiUrl}${endpoint}`, payload);
            } else {
                await axios.post(`${apiUrl}${endpoint}`, payload);
            }

            // Refresh appropriate list
            if (modalType === 'hostel') fetchHostels();
            if (modalType === 'room') fetchRooms();
            if (modalType === 'bed') fetchBeds();

            setModalOpen(false);
            setEditingItem(null);
        } catch (err) {
            alert('Operation failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Filtering
    const filteredHostels = hostels.filter(h =>
        h.hostelName?.toLowerCase().includes(hostelSearch.toLowerCase()) ||
        h.location?.toLowerCase().includes(hostelSearch.toLowerCase())
    );

    const filteredRooms = rooms.filter(r =>
        r.roomNumber?.toString().includes(roomSearch) ||
        r.roomType?.toLowerCase().includes(roomSearch.toLowerCase()) ||
        hostels.find(h => h._id === r.hostelId)?.hostelName?.toLowerCase().includes(roomSearch.toLowerCase())
    );

    const filteredBeds = beds.filter(b =>
        b.bedName?.toLowerCase().includes(bedSearch.toLowerCase()) ||
        rooms.find(r => r._id === b.roomId)?.roomNumber?.toString().includes(bedSearch) ||
        hostels.find(h => h._id === rooms.find(r => r._id === b.roomId)?.hostelId)?.hostelName?.toLowerCase().includes(bedSearch.toLowerCase())
    );

    // Modal field definitions (same as before)
    const getModalFields = () => {
        if (modalType === 'hostel') {
            return [
                { name: 'hostelId', label: 'Hostel ID', type: 'text', placeholder: 'e.g. HST001', required: true },
                { name: 'hostelName', label: 'Hostel Name', type: 'text', placeholder: 'e.g. Boys Hostel', required: true },
                { name: 'location', label: 'Location', type: 'text', placeholder: 'e.g. North Campus', required: true },
                { name: 'totalRooms', label: 'Total Rooms', type: 'number', placeholder: 'e.g. 50', required: true },
                { name: 'wardenName', label: 'Warden Name', type: 'text', placeholder: 'e.g. Mr. Sharma', required: false },
            ];
        }
        if (modalType === 'room') {
            return [
                { name: 'roomId', label: 'Room ID', type: 'text', placeholder: 'e.g. RM001', required: true },
                {
                    name: 'hostelId', label: 'Hostel', type: 'select', required: true,
                    options: hostels.map(h => ({ value: h._id, label: h.hostelName }))
                },
                { name: 'roomNumber', label: 'Room Number', type: 'number', placeholder: 'e.g. 101', required: true },
                { name: 'roomType', label: 'Room Type', type: 'text', placeholder: 'e.g. Deluxe', required: true },
                { name: 'totalBeds', label: 'Total Beds', type: 'number', placeholder: 'e.g. 2', required: true },
                { name: 'rentAmount', label: 'Rent Amount', type: 'number', placeholder: 'e.g. 5000', required: true },
                { name: 'status', label: 'Status', type: 'text', placeholder: 'e.g. Available', required: false },
            ];
        }
        if (modalType === 'bed') {
            return [
                { name: 'bedId', label: 'Bed ID', type: 'text', placeholder: 'e.g. BD001', required: true },
                {
                    name: 'roomId', label: 'Room', type: 'select', required: true,
                    options: rooms.map(r => ({ value: r._id, label: `${r.roomNumber} (${hostels.find(h => h._id === r.hostelId)?.hostelName})` }))
                },
                { name: 'bedName', label: 'Bed Name', type: 'text', placeholder: 'e.g. Bed A1', required: true },
                { name: 'status', label: 'Status', type: 'text', placeholder: 'e.g. Available', required: false },
            ];
        }
        return [];
    };

    return (
        <div className="min-h-screen  font-sans antialiased">
            <div>
                {/* Header */}
                <div className="mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                            Hostel Infrastructure
                        </h1>
                        <p className="text-slate-500 font-medium">
                            Manage hostels, rooms, and beds
                        </p>
                    </div>
                </div>

                {/* Hostels Section */}
                <section className="mb-10">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                            <Building2 size={20} className="text-indigo-600" />
                            Hostels
                        </h2>
                        <button
                            onClick={() => openModal('hostel')}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition shadow-sm"
                        >
                            <Plus size={16} />
                            Add Hostel
                        </button>
                    </div>
                    <div className="mb-8">
                        <div className="relative max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search hostels..."
                                value={hostelSearch}
                                onChange={(e) => setHostelSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                            />
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                        <Table
                            data={filteredHostels}
                            columns={[
                                { key: 'hostelId', label: 'ID' },
                                { key: 'hostelName', label: 'Name' },
                                { key: 'location', label: 'Location' },
                                { key: 'totalRooms', label: 'Rooms' },
                                { key: 'wardenName', label: 'Warden' },
                            ]}
                            loading={loading.hostels}
                            error={error.hostels}
                            onEdit={(item) => openModal('hostel', item)}
                            onDelete={(item) => handleDelete('hostel', item._id, item.hostelName)}
                            entityName="hostels"
                        />
                    </div>
                </section>

                {/* Rooms Section */}
                <section className="mb-10">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                            <DoorOpen size={20} className="text-indigo-600" />
                            Rooms
                        </h2>
                        <button
                            onClick={() => openModal('room')}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition shadow-sm"
                        >
                            <Plus size={16} />
                            Add Room
                        </button>
                    </div>
                    <div className="mb-4">
                        <div className="relative max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search rooms..."
                                value={roomSearch}
                                onChange={(e) => setRoomSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                            />
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                        <Table
                            data={filteredRooms}
                            columns={[
                                { key: 'roomId', label: 'ID' },
                                {
                                    key: 'hostelId',
                                    label: 'Hostel',
                                    render: (item) => hostels.find(h => h._id === item.hostelId)?.hostelName || '—'
                                },
                                { key: 'roomNumber', label: 'Room No.' },
                                { key: 'roomType', label: 'Type' },
                                { key: 'totalBeds', label: 'Beds' },
                                { key: 'rentAmount', label: 'Rent' },
                                { key: 'status', label: 'Status' },
                            ]}
                            loading={loading.rooms}
                            error={error.rooms}
                            onEdit={(item) => openModal('room', item)}
                            onDelete={(item) => handleDelete('room', item._id, `Room ${item.roomNumber}`)}
                            entityName="rooms"
                        />
                    </div>
                </section>

                {/* Beds Section */}
                <section className="mb-10">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                            <Bed size={20} className="text-indigo-600" />
                            Beds
                        </h2>
                        <button
                            onClick={() => openModal('bed')}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition shadow-sm"
                        >
                            <Plus size={16} />
                            Add Bed
                        </button>
                    </div>
                    <div className="mb-4">
                        <div className="relative max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search beds..."
                                value={bedSearch}
                                onChange={(e) => setBedSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                            />
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                        <Table
                            data={filteredBeds}
                            columns={[
                                { key: 'bedId', label: 'ID' },
                                {
                                    key: 'roomId',
                                    label: 'Room',
                                    render: (item) => {
                                        const room = rooms.find(r => r._id === item.roomId);
                                        return room ? `${room.roomNumber} (${hostels.find(h => h._id === room.hostelId)?.hostelName})` : '—';
                                    }
                                },
                                { key: 'bedName', label: 'Bed Name' },
                                { key: 'status', label: 'Status' },
                            ]}
                            loading={loading.beds}
                            error={error.beds}
                            onEdit={(item) => openModal('bed', item)}
                            onDelete={(item) => handleDelete('bed', item._id, item.bedName)}
                            entityName="beds"
                        />
                    </div>
                </section>

                {/* Footer */}
                <div className="mt-6 flex items-center justify-between text-xs text-slate-400">
                    <p className="font-medium">
                        Total: {hostels.length} Hostels, {rooms.length} Rooms, {beds.length} Beds
                    </p>
                    <div className="flex items-center gap-1">
                        <LayoutGrid size={14} />
                        <span>Infrastructure Manager</span>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <FormModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={`${editingItem ? 'Edit' : 'Add'} ${modalType}`}
                fields={getModalFields()}
                initialData={editingItem}
                onSubmit={handleModalSubmit}
                isSubmitting={isSubmitting}
            />
        </div>
    );
}

export default HostelRoomBedManagement;