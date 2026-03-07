import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import {
    Building2, DoorOpen, Bed, Search, Plus, Pencil, Trash2,
    X, LayoutGrid, CheckCircle2, MapPin, Users, CreditCard,
    Home, Hash, Wifi, Coffee // added for variety
} from 'lucide-react';

// ------------------------------------------------------------
// Skeleton card (copied from BookingRequest and adapted)
// ------------------------------------------------------------
const SkeletonCard = () => (
    <div className="bg-white border border-slate-100 rounded-[1.5rem] overflow-hidden shadow-sm p-5 animate-pulse">
        <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-200 rounded-full" />
                <div>
                    <div className="h-4 w-24 bg-slate-200 rounded mb-2" />
                    <div className="h-3 w-16 bg-slate-200 rounded" />
                </div>
            </div>
            <div className="h-6 w-16 bg-slate-200 rounded-full" />
        </div>
        <div className="space-y-3 mb-4 bg-slate-50 p-3 rounded-xl">
            <div className="h-4 w-32 bg-slate-200 rounded" />
            <div className="h-4 w-40 bg-slate-200 rounded" />
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="h-4 w-20 bg-slate-200 rounded" />
            <div className="h-4 w-16 bg-slate-200 rounded justify-self-end" />
        </div>
        <div className="flex gap-2 pt-4 border-t border-slate-50">
            <div className="flex-1 h-10 bg-slate-200 rounded-xl" />
            <div className="flex-1 h-10 bg-slate-200 rounded-xl" />
        </div>
    </div>
);

// ------------------------------------------------------------
// Reusable Card for hostels / rooms / beds
// ------------------------------------------------------------
const InfrastructureCard = ({ item, type, onEdit, onDelete }) => {
    // Choose icon and color based on type
    const IconComponent = type === 'hostels' ? Building2 : type === 'rooms' ? DoorOpen : Bed;
    const iconColor = 'text-teal-600';

    // Status badge (only for beds, but could be extended)
    const showStatus = type === 'beds';
    const status = item.status || 'Available';
    const statusColor = status === 'Available' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
        : status === 'Occupied' ? 'bg-amber-50 text-amber-700 border-amber-200'
            : 'bg-slate-50 text-slate-700 border-slate-200';

    return (
        <div className="bg-white border border-slate-100 rounded-[1.5rem] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="p-5">
                {/* Header: icon + title + optional status */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-teal-50 rounded-full flex items-center justify-center">
                            <IconComponent size={20} className={iconColor} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-800 leading-tight">
                                {type === 'hostels' && item.hostelName}
                                {type === 'rooms' && `Room ${item.roomNumber}`}
                                {type === 'beds' && item.bedName}
                            </h3>
                            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                                {type === 'hostels' && (item.hostelId || '—')}
                                {type === 'rooms' && (item.roomId || '—')}
                                {type === 'beds' && (item.bedId || '—')}
                            </p>
                        </div>
                    </div>
                    {showStatus && (
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium border ${statusColor}`}>
                            <CheckCircle2 size={12} />
                            {status}
                        </span>
                    )}
                </div>

                {/* Details section (similar to contact info in BookingRequest) */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4 space-y-2">
                    {type === 'hostels' && (
                        <>
                            <div className="flex items-center gap-2 text-xs text-slate-600">
                                <MapPin size={14} className="text-slate-400" />
                                <span className="font-medium">{item.location || '—'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-600">
                                <Users size={14} className="text-slate-400" />
                                <span className="font-medium">{item.totalRooms || '—'} rooms</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-600">
                                <Building2 size={14} className="text-slate-400" />
                                <span className="font-medium">Warden: {item.wardenName || '—'}</span>
                            </div>
                        </>
                    )}
                    {type === 'rooms' && (
                        <>
                            <div className="flex items-center gap-2 text-xs text-slate-600">
                                <Home size={14} className="text-slate-400" />
                                <span className="font-medium">Hostel: {item.hostelName || '—'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-600">
                                <Hash size={14} className="text-slate-400" />
                                <span className="font-medium">Type: {item.roomType || '—'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-600">
                                <CreditCard size={14} className="text-slate-400" />
                                <span className="font-medium">₹{item.rentAmount ?? '—'}/month</span>
                            </div>
                        </>
                    )}
                    {type === 'beds' && (
                        <>
                            <div className="flex items-center gap-2 text-xs text-slate-600">
                                <DoorOpen size={14} className="text-slate-400" />
                                <span className="font-medium">Room: {item.roomNumber || '—'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-600">
                                <Bed size={14} className="text-slate-400" />
                                <span className="font-medium">Bed ID: {item.bedName || '—'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-600">
                                <Wifi size={14} className="text-slate-400" />
                                <span className="font-medium">Amenities: Standard</span>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer: subtle metadata + action buttons */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <LayoutGrid size={14} />
                        <span>ID: {item._id?.slice(-6) || '—'}</span>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => onEdit(item)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-medium rounded-lg border border-slate-200 hover:bg-slate-200 transition-colors"
                            aria-label="Edit"
                        >
                            <Pencil size={14} /> Edit
                        </button>
                        <button
                            onClick={() => onDelete(item._id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-50 text-rose-700 text-xs font-medium rounded-lg border border-rose-200 hover:bg-rose-100 transition-colors"
                            aria-label="Delete"
                        >
                            <Trash2 size={14} /> Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ------------------------------------------------------------
// Form Modal (themed like BookingRequest)
// ------------------------------------------------------------
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
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none appearance-none cursor-pointer transition-all"
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
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all"
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
                            className="flex-1 px-4 py-3 font-bold bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition disabled:opacity-50 shadow-lg shadow-slate-100"
                        >
                            {isSubmitting ? 'Saving...' : 'Confirm'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ------------------------------------------------------------
// Main Component
// ------------------------------------------------------------
function HostelRoomBedManagement() {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [activeTab, setActiveTab] = useState('hostels');
    const [data, setData] = useState({ hostels: [], rooms: [], beds: [] });
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
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
            // enrich rooms with hostelName for display
            const rooms = (r.data || []).map(room => ({
                ...room,
                hostelName: h.data.find(hostel => hostel._id === room.hostelId)?.hostelName || 'Unassigned'
            }));
            // enrich beds with roomNumber
            const beds = (b.data || []).map(bed => ({
                ...bed,
                roomNumber: rooms.find(room => room._id === bed.roomId)?.roomNumber || '—'
            }));
            setData({
                hostels: h.data || [],
                rooms: rooms,
                beds: beds
            });
        } catch (err) {
            console.error("Critical: Could not sync with database.");
        } finally {
            setLoading(false);
        }
    };

    // Filter logic
    const filteredList = useMemo(() => {
        const query = searchQuery.toLowerCase();
        return data[activeTab].filter(item =>
            Object.values(item).some(val =>
                val && String(val).toLowerCase().includes(query)
            )
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

    // Tab configuration (styled like FilterTabs)
    const tabs = [
        { id: 'hostels', icon: Building2, label: 'Hostels' },
        { id: 'rooms', icon: DoorOpen, label: 'Rooms' },
        { id: 'beds', icon: Bed, label: 'Beds' }
    ];

    return (
        <div className="min-h-screen bg-slate-50/50 font-sans">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                            Infrastructure
                        </h1>
                        <p className="text-slate-500 font-medium">
                            Hierarchical Management: Hostels → Rooms → Beds
                        </p>
                    </div>

                    {/* Tab bar (BookingRequest style) */}
                    <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => { setActiveTab(tab.id); setSearchQuery(''); }}
                                className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === tab.id
                                    ? "bg-slate-900 text-white shadow-lg"
                                    : "text-slate-500 hover:bg-slate-50"
                                    }`}
                                aria-pressed={activeTab === tab.id}
                            >
                                <tab.icon size={16} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Search & Create Bar */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-6 flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder={`Search ${activeTab}...`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-2xl border-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none font-medium transition-all"
                        />
                    </div>
                    <button
                        onClick={() => { setEditingItem(null); setModalOpen(true); }}
                        className="w-full md:w-auto px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition shadow-lg shadow-slate-100"
                    >
                        <Plus size={20} />
                        Create New
                    </button>
                </div>

                {/* Error / Empty / Loading states */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                ) : filteredList.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-[2rem] border border-slate-100">
                        <div className="text-slate-400 text-6xl mb-4">📭</div>
                        <h3 className="text-xl font-bold text-slate-700">No items found</h3>
                        <p className="text-slate-500 mt-2">
                            {searchQuery
                                ? `No ${activeTab.slice(0, -1)} match your search.`
                                : `No ${activeTab.slice(0, -1)} records yet.`}
                        </p>
                    </div>
                ) : (
                    /* Card grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredList.map(item => (
                            <InfrastructureCard
                                key={item._id}
                                item={item}
                                type={activeTab}
                                onEdit={setEditingItem}
                                onDelete={deleteItem}
                            />
                        ))}
                    </div>
                )}

                {/* Footer insight (same style) */}
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

            {/* Modal */}
            <FormModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editingItem ? `Modify ${activeTab.slice(0, -1)}` : `New ${activeTab.slice(0, -1)}`}
                fields={getActiveFields()}
                initialData={editingItem}
                onSubmit={handleAction}
                isSubmitting={isSubmitting}
            />
        </div>
    );
}

export default HostelRoomBedManagement;