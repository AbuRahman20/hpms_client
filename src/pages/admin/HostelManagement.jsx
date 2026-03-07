import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import {
    Building2, DoorOpen, Bed, Search, Plus, Pencil, Trash2,
    X, LayoutGrid, CheckCircle2, AlertCircle
} from 'lucide-react';

// --- Improved Form Modal with Dynamic Selects ---
const FormModal = ({ isOpen, onClose, title, fields, initialData, onSubmit, isSubmitting }) => {
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (isOpen) setFormData(initialData || {});
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
                    <h2 className="text-xl font-bold text-slate-800">{title}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition shadow-sm text-slate-400 hover:text-slate-600">
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="p-6 space-y-4">
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto px-1">
                        {fields.map(field => (
                            <div key={field.name}>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                                    {field.label} {field.required && <span className="text-rose-500">*</span>}
                                </label>
                                {field.type === 'select' ? (
                                    <select
                                        name={field.name}
                                        value={formData[field.name] || ''}
                                        onChange={handleChange}
                                        required={field.required}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none appearance-none cursor-pointer transition-all"
                                    >
                                        <option value="">-- Choose {field.label} --</option>
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
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-3 pt-4 border-t border-slate-100 mt-6">
                        <button type="button" onClick={onClose} className="flex-1 px-4 py-3 font-bold text-slate-600 rounded-xl hover:bg-slate-100 transition">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-3 font-bold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition disabled:opacity-50 shadow-lg shadow-indigo-100"
                        >
                            {isSubmitting ? 'Saving...' : 'Confirm'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

function HostelRoomBedManagement() {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [activeTab, setActiveTab] = useState('hostels');
    const [data, setData] = useState({ hostels: [], rooms: [], beds: [] });
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Modal states
    const [modalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [h, r, b] = await Promise.all([
                axios.get(`${apiUrl}/fetchhosteldata`),
                axios.get(`${apiUrl}/fetchroomdata`),
                axios.get(`${apiUrl}/fetchbeddata`)
            ]);
            setData({ 
                hostels: h.data || [], 
                rooms: r.data || [], 
                beds: b.data || [] 
            });
        } catch (err) {
            console.error("Critical: Could not sync with database.");
        } finally {
            setLoading(false);
        }
    };

    // Table Column Definitions based on Tab
    const columns = {
        hostels: [
            { key: 'hostelId', label: 'Hostel id' },
            { key: 'location', label: 'Location' },
            { key: 'totalRooms', label: 'Capacity' },
            { key: 'wardenName', label: 'Warden' }
        ],
        rooms: [
            { key: 'roomNumber', label: 'Room No' },
            { key: 'hostelName', label: 'Hostel', render: (item) => data.hostels.find(h => h._id === item.hostelId)?.hostelName || 'Unassigned' },
            { key: 'roomType', label: 'Category' },
            { key: 'rentAmount', label: 'Rent', render: (item) => `₹${item.rentAmount}` }
        ],
        beds: [
            { key: 'bedName', label: 'Bed Identifier' },
            { key: 'roomRef', label: 'Room Context', render: (item) => {
                const room = data.rooms.find(r => r._id === item.roomId);
                return room ? `Room ${room.roomNumber}` : 'N/A';
            }},
            { key: 'status', label: 'Current Status' }
        ]
    };

    // Filter Logic
    const filteredList = useMemo(() => {
        const query = searchQuery.toLowerCase();
        return data[activeTab].filter(item => 
            Object.values(item).some(val => String(val).toLowerCase().includes(query))
        );
    }, [data, activeTab, searchQuery]);

    const handleAction = async (formData) => {
        setIsSubmitting(true);
        const entity = activeTab === 'hostels' ? 'hostel' : activeTab === 'rooms' ? 'room' : 'bed';
        try {
            if (editingItem) {
                await axios.put(`${apiUrl}/update${entity}/${editingItem._id}`, formData);
            } else {
                await axios.post(`${apiUrl}/add${entity}`, formData);
            }
            setModalOpen(false);
            fetchAllData();
        } catch (err) {
            alert("Error: Database rejected the request.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const deleteItem = async (id) => {
        if (!window.confirm("Permanent Action: Are you sure?")) return;
        const entity = activeTab === 'hostels' ? 'hostel' : activeTab === 'rooms' ? 'room' : 'bed';
        try {
            await axios.delete(`${apiUrl}/delete${entity}/${id}`);
            fetchAllData();
        } catch (err) { alert("Delete failed."); }
    };

    // --- Dynamic Field Generation ---
    const getActiveFields = () => {
        if (activeTab === 'hostels') return [
            { name: 'hostelId', label: 'System ID', required: true, placeholder: 'H-101' },
            { name: 'hostelName', label: 'Name', required: true, placeholder: 'Main Campus Boys' },
            { name: 'location', label: 'Location', required: true, placeholder: 'Block A, North Sector' },
            { name: 'totalRooms', label: 'Total Rooms', type: 'number', required: true },
            { name: 'wardenName', label: 'Warden Name' }
        ];
        if (activeTab === 'rooms') return [
            { name: 'roomId', label: 'System ID', required: true },
            { 
                name: 'hostelId', 
                label: 'Parent Hostel', 
                type: 'select', 
                required: true,
                options: data.hostels.map(h => ({ value: h._id, label: h.hostelName }))
            },
            { name: 'roomNumber', label: 'Room Number', type: 'number', required: true },
            { name: 'roomType', label: 'Room Type', placeholder: 'Standard/AC/Deluxe', required: true },
            { name: 'rentAmount', label: 'Monthly Rent', type: 'number', required: true }
        ];
        if (activeTab === 'beds') return [
            { name: 'bedId', label: 'System ID', required: true },
            { 
                name: 'roomId', 
                label: 'Assign to Room', 
                type: 'select', 
                required: true,
                options: data.rooms.map(r => ({ value: r._id, label: `Room ${r.roomNumber}` }))
            },
            { name: 'bedName', label: 'Bed Designation', placeholder: 'Bed-A1', required: true },
            { name: 'status', label: 'Status', placeholder: 'Available' }
        ];
        return [];
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans antialiased text-slate-900">
            <div className="max-w-7xl mx-auto px-4 py-8">
                
                {/* Dashboard Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight text-slate-900">Infrastructure</h1>
                        <p className="text-slate-500 font-medium mt-1">Hierarchical Management: Hostels → Rooms → Beds</p>
                    </div>

                    <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-slate-200">
                        {[
                            { id: 'hostels', icon: Building2, label: 'Hostels' },
                            { id: 'rooms', icon: DoorOpen, label: 'Rooms' },
                            { id: 'beds', icon: Bed, label: 'Beds' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => { setActiveTab(tab.id); setSearchQuery(''); }}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                                    activeTab === tab.id 
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                                    : 'text-slate-400 hover:text-slate-600'
                                }`}
                            >
                                <tab.icon size={18} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Search and Action Bar */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-4 mb-6 flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder={`Search ${activeTab}...`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium transition-all"
                        />
                    </div>
                    <button 
                        onClick={() => { setEditingItem(null); setModalOpen(true); }}
                        className="w-full md:w-auto px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition"
                    >
                        <Plus size={20} />
                        Create New
                    </button>
                </div>

                {/* Data Table */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                {columns[activeTab].map(col => (
                                    <th key={col.key} className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">{col.label}</th>
                                ))}
                                <th className="px-6 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr><td colSpan="10" className="p-20 text-center text-slate-400 animate-pulse font-medium">Fetching infrastructure data...</td></tr>
                            ) : filteredList.length === 0 ? (
                                <tr><td colSpan="10" className="p-20 text-center text-slate-400 font-medium">No records found for this category.</td></tr>
                            ) : filteredList.map(item => (
                                <tr key={item._id} className="hover:bg-indigo-50/30 transition-colors group">
                                    {columns[activeTab].map(col => (
                                        <td key={col.key} className="px-6 py-4 text-sm font-semibold text-slate-700">
                                            {col.render ? col.render(item) : item[col.key] || '—'}
                                        </td>
                                    ))}
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                            <button onClick={() => { setEditingItem(item); setModalOpen(true); }} className="p-2 text-slate-400 hover:text-indigo-600 bg-white rounded-lg shadow-sm border border-slate-100 transition">
                                                <Pencil size={16} />
                                            </button>
                                            <button onClick={() => deleteItem(item._id)} className="p-2 text-slate-400 hover:text-rose-600 bg-white rounded-lg shadow-sm border border-slate-100 transition">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer Insight */}
                <div className="mt-8 flex items-center justify-between text-slate-400 px-4">
                    <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-tighter">
                        <span className="flex items-center gap-1"><CheckCircle2 size={14} className="text-emerald-500" /> Database Sync Active</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                        <span>{filteredList.length} Items Displayed</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-medium">
                        <LayoutGrid size={14} /> 
                        Infrastructure Engine v2.0
                    </div>
                </div>
            </div>

            <FormModal 
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editingItem ? `Modify ${activeTab.slice(0,-1)}` : `New ${activeTab.slice(0,-1)}`}
                fields={getActiveFields()}
                initialData={editingItem}
                onSubmit={handleAction}
                isSubmitting={isSubmitting}
            />
        </div>
    );
}

export default HostelRoomBedManagement;