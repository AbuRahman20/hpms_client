import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Building2, Search, ArrowRight, Table as TableIcon, Info } from 'lucide-react';

function Room() {
    const apiUrl = import.meta.env.VITE_API_URL;

    const [hostels, setHostels] = useState([]);
    const [selectedHostelId, setSelectedHostelId] = useState('');
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hostelLoading, setHostelLoading] = useState(true);

    // Initial Fetch for Dropdown
    useEffect(() => {
        const fetchHostels = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/hostels`);
                setHostels(response.data || []);
            } catch (error) {
                console.error("Hostel Fetch Error:", error);
            } finally {
                setHostelLoading(false);
            }
        };
        fetchHostels();
    }, [apiUrl]);

    // Fetch Rooms on Click
    const handleFetchRooms = async () => {
        if (!selectedHostelId) return;
        
        setLoading(true);
        try {
            const response = await axios.get(`${apiUrl}/api/rooms/${selectedHostelId}`);
            setRooms(response.data);
        } catch (error) {
            setRooms([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="font-sans">
            <div className="mx-auto">
                
                {/* --- HEADER SECTION --- */}
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Room Inventory</h1>
                    <p className="text-slate-500">Search and manage room allocations by property.</p>
                </div>

                {/* --- SEARCH BAR / DROPDOWN --- */}
                <div className="bg-white p-6 rounded-[1rem] shadow-sm border border-slate-100 flex flex-col md:flex-row items-end gap-4 mb-10">
                    <div className="flex-1 w-full">
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-teal-600 mb-3 ml-2">
                            Property Selection
                        </label>
                        <div className="relative">
                            <select
                                value={selectedHostelId}
                                onChange={(e) => setSelectedHostelId(e.target.value)}
                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-12 py-4 text-sm font-bold text-slate-700 focus:border-teal-500 focus:ring-0 transition-all appearance-none outline-none cursor-pointer"
                            >
                                <option value="">{hostelLoading ? "Loading Hostels..." : "Select Hostel ID"}</option>
                                {hostels.map((hostel) => (
                                    <option key={hostel._id} value={hostel.hostelId}>
                                        { hostel.hostelId}
                                    </option>
                                ))}
                            </select>
                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        </div>
                    </div>

                    <button
                        onClick={handleFetchRooms}
                        disabled={loading || !selectedHostelId}
                        className="w-full md:w-auto bg-slate-900 hover:bg-teal-600 text-white font-bold py-4 px-10 rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-slate-200"
                    >
                        {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Search className="w-4 h-4" />}
                        Fetch Inventory
                    </button>
                </div>

                {/* --- TABLE SECTION --- */}
                <div className="bg-white rounded-[1rem] shadow-sm border border-slate-100 overflow-hidden">
                    {rooms.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 border-b border-slate-100">
                                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Room Id.</th>
                                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Room Number</th>
                                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Room Type</th>
                                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Total Beds</th>
                                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Rent Amount</th>
                                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {rooms.map((room) => (
                                        <tr key={room._id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-6 py-5 font-bold text-slate-700">{room.roomId}</td>
                                            <td className="px-6 py-5 font-bold text-slate-700">{room.roomNumber}</td>
                                            <td className="px-6 py-5">
                                                <span className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-semibold text-slate-600">
                                                    {room.roomType}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-slate-600 font-medium">{room.totalBeds} Beds</td>
                                            <td className="px-6 py-5 font-bold text-teal-600">₹{room.rentAmount}</td>
                                            <td className="px-6 py-5">
                                                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                                                    room.status === 'Available' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                                                }`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${room.status === 'Available' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                                    {room.status}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="py-24 flex flex-col items-center text-center">
                            <div className="bg-slate-50 p-6 rounded-full mb-4">
                                <TableIcon className="w-10 h-10 text-slate-300" />
                            </div>
                            <h3 className="text-slate-800 font-bold text-lg">No Inventory Selected</h3>
                            <p className="text-slate-400 max-w-xs mx-auto">Select a property above to view current room status and pricing.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Room;