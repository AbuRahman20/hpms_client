import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Building2, DoorOpen, BedDouble, Search, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

function Bed() {

    const apiUrl = import.meta.env.VITE_API_URL;
    // --- State Management ---
    const [hostels, setHostels] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [beds, setBeds] = useState([]);
    const [selectedHostel, setSelectedHostel] = useState('');
    const [selectedRoom, setSelectedRoom] = useState('');
    const [loading, setLoading] = useState({ hostels: true, rooms: false, beds: false });

    // --- Logic: Fetch Hostels ---
    useEffect(() => {
        axios.get(`${apiUrl}/api/hostels`)
            .then(res => {
                setHostels(res.data);
                setLoading(prev => ({ ...prev, hostels: false }));
            })
            .catch(err => console.error("Hostel Fetch Error:", err));
    }, [apiUrl]);

    // --- Logic: Cascading Room Load ---
    useEffect(() => {
        if (selectedHostel) {
            setLoading(prev => ({ ...prev, rooms: true }));
            axios.get(`${apiUrl}/api/rooms/${selectedHostel}`)
                .then(res => {
                    setRooms(res.data);
                    setLoading(prev => ({ ...prev, rooms: false }));
                })
                .catch(err => console.error(err));
        } else {
            setRooms([]);
            setSelectedRoom('');
        }
    }, [selectedHostel, apiUrl]);

    // --- Logic: Fetch Beds ---
    const handleFetchBeds = async () => {
        if (!selectedRoom) return;
        setLoading(prev => ({ ...prev, beds: true }));
        try {
            const res = await axios.get(`${apiUrl}/api/beds/${selectedRoom}`);
            setBeds(res.data);
        } catch (error) {
            setBeds([]);
        } finally {
            setLoading(prev => ({ ...prev, beds: false }));
        }
    };

    return (
        <div className="font-sans text-slate-900">
            <div className="mx-auto">

                {/* --- HEADER --- */}
                <header className="mb-8">
                    <h1 className="text-4xl font-black tracking-tight text-slate-900">Bed <span className="text-teal-600">Allocation</span></h1>
                    <p className="text-slate-500 mt-2 font-medium">Manage and visualize real-time bed availability across units.</p>
                </header>

                {/* --- SELECTION PANEL --- */}
                <div className="bg-white p-6 rounded-[1rem] shadow-xl shadow-slate-200/60 border border-slate-100 flex flex-col md:flex-row items-end gap-6 mb-8">

                    {/* Hostel Select */}
                    <div className="flex-1 w-full group">
                        <label className="text-[10px] font-black uppercase tracking-widest text-teal-600 mb-3 block ml-2">Property Reference</label>
                        <div className="relative">
                            <select
                                onChange={(e) => setSelectedHostel(e.target.value)}
                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-12 py-4 text-sm font-bold text-slate-700 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/5 transition-all outline-none appearance-none cursor-pointer"
                            >
                                <option value="">{loading.hostels ? "Syncing..." : "Select Hostel"}</option>
                                {hostels.map(h => <option key={h._id} value={h.hostelId}>{h.hostelId}</option>)}
                            </select>
                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-teal-600" />
                        </div>
                    </div>

                    {/* Room Select */}
                    <div className="flex-1 w-full group">
                        <label className="text-[10px] font-black uppercase tracking-widest text-teal-600 mb-3 block ml-2">Unit Number</label>
                        <div className="relative">
                            <select
                                disabled={!selectedHostel}
                                onChange={(e) => setSelectedRoom(e.target.value)}
                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-12 py-4 text-sm font-bold text-slate-700 focus:border-teal-500 transition-all outline-none appearance-none cursor-pointer disabled:opacity-40"
                            >
                                <option value="">{loading.rooms ? "Loading Units..." : "Select Room"}</option>
                                {rooms.map(r => <option key={r._id} value={r.roomId}>Room {r.roomNumber || r.roomId}</option>)}
                            </select>
                            <DoorOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-teal-600" />
                        </div>
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={handleFetchBeds}
                        disabled={!selectedRoom || loading.beds}
                        className="w-full md:w-auto bg-slate-900 hover:bg-teal-600 text-white font-bold py-4 px-10 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg active:scale-95 disabled:opacity-20"
                    >
                        {loading.beds ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-4 h-4" />}
                        Retrieve
                    </button>
                </div>

                {/* --- BED VISUALIZER GRID --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {beds.length > 0 ? (
                        beds.map((bed) => (
                            <div
                                key={bed._id}
                                className="bg-white border border-slate-100 p-6 rounded-[1rem] shadow-sm hover:shadow-md transition-all group"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`p-3 rounded-xl ${bed.status === 'Available' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                        <BedDouble className="w-6 h-6" />
                                    </div>
                                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${bed.status === 'Available' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                                        }`}>
                                        {bed.status === 'Available' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                        {bed.status}
                                    </div>
                                </div>

                                <h3 className="text-xl font-black text-slate-800 tracking-tight">{bed.bedName}</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Ref: {bed.bedId}</p>

                                <button className="w-full mt-6 py-3 rounded-xl bg-slate-50 text-slate-600 text-xs font-bold hover:bg-slate-900 hover:text-white transition-colors">
                                    View Details
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-24 flex flex-col items-center justify-center text-center opacity-40">
                            <BedDouble className="w-16 h-16 mb-4 stroke-[1]" />
                            <p className="font-medium italic">Select property and unit to view bed map.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Bed;