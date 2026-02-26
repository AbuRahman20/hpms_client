import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Building2, DoorOpen, BedDouble, CheckCircle2,
    ChevronRight, Calendar, MapPin, Loader2, Sparkles
} from "lucide-react";

function MyBookingRequest() {
    const apiUrl = import.meta.env.VITE_API_URL;

    // State Management
    const [data, setData] = useState({ hostels: [], rooms: [], beds: [] });
    const [selection, setSelection] = useState({ hostel: "", room: "", bed: "" });
    const [ui, setUi] = useState({ loading: true, processing: false });
    const [bookingHistory, setBookingHistory] = useState([]);
    const studentId = "65f3c2e81a45c3f67b123456"; // replace with real user

    // 1. Fetch Hostels
    useEffect(() => {
        axios.get(`${apiUrl}/api/hostels/available`)
            .then(res => setData(prev => ({ ...prev, hostels: res.data })))
            .finally(() => setUi(prev => ({ ...prev, loading: false })));
    }, [apiUrl]);

    // 2. Fetch Rooms (Cascading)
    useEffect(() => {
        if (selection.hostel) {
            axios.get(`${apiUrl}/api/rooms/available/${selection.hostel}`)
                .then(res => setData(prev => ({ ...prev, rooms: res.data })));
        }
    }, [selection.hostel, apiUrl]);

    // 3. Fetch Beds (Cascading)
    useEffect(() => {
        if (selection.room) {
            axios.get(`${apiUrl}/api/beds/available/${selection.room}`)
                .then(res => setData(prev => ({ ...prev, beds: res.data })));
        }
    }, [selection.room, apiUrl]);

    const activeHostel = data.hostels.find(h => h._id === selection.hostel);

    const handleBookingRequest = async () => {
        if (!selection.hostel || !selection.room || !selection.bed) {
            alert("Please complete selection");
            return;
        }

        try {
            await axios.post(`${apiUrl}/api/student/booking-request`, {
                studentId,
                hostelId: selection.hostel,
                roomId: selection.room,
                bedId: selection.bed,
                message: "Requesting this bed"
            });

            alert("Booking Request Submitted");

            // Reload booking history
            const res = await axios.get(`${apiUrl}/api/student/booking-request/${studentId}`);
            setBookingHistory(res.data);

        } catch (error) {
            alert(error.response?.data?.message || "Error");
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFDFD] flex flex-col md:flex-row font-sans text-slate-900">

            {/* --- SIDEBAR SUMMARY --- */}
            <aside className="w-full md:w-80 bg-slate-900 p-8 text-white flex flex-col justify-between border-r border-slate-800">
                <div>
                    <div className="flex items-center gap-2 mb-12">
                        <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
                            <Sparkles size={18} className="text-white" />
                        </div>
                        <span className="font-black tracking-tighter text-xl italic">LIVIN<span className="text-teal-500">PRO</span></span>
                    </div>

                    <div className="space-y-8">
                        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Booking Summary</h2>

                        <div className="flex gap-4">
                            <div className="w-px bg-slate-700 relative">
                                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full ${selection.hostel ? 'bg-teal-500' : 'bg-slate-600'}`} />
                            </div>
                            <div className="pb-8">
                                <p className="text-[10px] uppercase font-bold text-slate-500">Hostel</p>
                                <p className="text-sm font-medium mt-1">{activeHostel?.hostelName || "Not selected"}</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-px bg-slate-700 relative">
                                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full ${selection.room ? 'bg-teal-500' : 'bg-slate-600'}`} />
                            </div>
                            <div className="pb-8">
                                <p className="text-[10px] uppercase font-bold text-slate-500">Room</p>
                                <p className="text-sm font-medium mt-1">{selection.room ? `Room ${data.rooms.find(r => r._id === selection.room)?.roomNumber}` : "Waiting..."}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
                    <p className="text-[10px] text-slate-400 font-bold mb-1">SUPPORT</p>
                    <p className="text-xs text-slate-300 italic">Need help? Contact property admin directly.</p>
                </div>
            </aside>

            {/* --- MAIN INTERFACE --- */}
            <main className="flex-1 p-6 md:p-16 overflow-y-auto">
                <div className="max-w-4xl">

                    <header className="mb-12">
                        <div className="flex items-center gap-2 text-teal-600 mb-2 font-black text-[10px] uppercase tracking-widest">
                            <Calendar size={14} /> Available Inventory
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Reserve your stay.</h1>
                    </header>

                    {/* STEP 1 & 2: SELECTION GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">

                        <div className="space-y-3">
                            <label className="text-xs font-black text-slate-400 uppercase ml-1">1. Choose Property</label>
                            <div className="relative group">
                                <select
                                    onChange={(e) => setSelection({ hostel: e.target.value, room: "", bed: "" })}
                                    className="w-full bg-white border border-slate-200 rounded-2xl px-12 py-5 text-sm font-bold shadow-sm focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500 appearance-none transition-all outline-none cursor-pointer"
                                >
                                    <option value="">Search Hostels...</option>
                                    {data.hostels.map(h => <option key={h._id} value={h._id}>{h.hostelName}</option>)}
                                </select>
                                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600" size={18} />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-black text-slate-400 uppercase ml-1">2. Select Room Unit</label>
                            <div className="relative group">
                                <select
                                    disabled={!selection.hostel}
                                    onChange={(e) => setSelection({ ...selection, room: e.target.value, bed: "" })}
                                    className="w-full bg-white border border-slate-200 rounded-2xl px-12 py-5 text-sm font-bold shadow-sm focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500 appearance-none transition-all outline-none cursor-pointer disabled:bg-slate-50 disabled:text-slate-300"
                                >
                                    <option value="">Search Rooms...</option>
                                    {data.rooms.map(r => <option key={r._id} value={r._id}>Unit {r.roomNumber} ({r.availableBeds} Vacant)</option>)}
                                </select>
                                <DoorOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            </div>
                        </div>
                    </div>

                    {/* STEP 3: BED VISUALIZER */}
                    <section className="bg-white border border-slate-100 rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-slate-200/40">
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="text-lg font-black tracking-tight text-slate-800 uppercase text-xs">3. Choose Available Bed</h3>
                            {selection.room && <span className="text-[10px] font-bold bg-teal-50 text-teal-600 px-3 py-1 rounded-full uppercase tracking-tighter">Live Vacancy</span>}
                        </div>

                        {data.beds.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {data.beds.map(b => (
                                    <button
                                        key={b._id}
                                        onClick={() => setSelection({ ...selection, bed: b._id })}
                                        className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 relative overflow-hidden group ${selection.bed === b._id
                                            ? 'border-teal-500 bg-teal-50/50 ring-4 ring-teal-500/10 scale-[1.02]'
                                            : 'border-slate-50 bg-slate-50/50 hover:bg-white hover:border-slate-200'
                                            }`}
                                    >
                                        <BedDouble size={20} className={selection.bed === b._id ? 'text-teal-600' : 'text-slate-300'} />
                                        <span className={`text-xs font-black uppercase tracking-widest ${selection.bed === b._id ? 'text-teal-700' : 'text-slate-500'}`}>{b.bedName}</span>
                                        {selection.bed === b._id && <CheckCircle2 size={14} className="absolute top-3 right-3 text-teal-500" />}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 border-2 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center justify-center text-slate-300">
                                <MapPin size={32} className="mb-2 opacity-20" />
                                <p className="text-sm font-medium italic">Parameters required to generate bed map</p>
                            </div>
                        )}

                        {selection.bed && (
                            <div className="mt-12 animate-in fade-in slide-in-from-bottom-2">
                                <button
                                    onClick={handleBookingRequest}
                                    className="w-full bg-slate-900 hover:bg-teal-600 text-white font-black py-5 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                                >
                                    Confirm Reservation Request
                                    <ChevronRight size={18} />
                                </button>
                                <p className="text-center text-[10px] text-slate-400 font-bold mt-4 tracking-widest uppercase italic">Subject to property manager approval</p>
                            </div>
                        )}
                    </section>
                    <section className="mt-16">
                        <h3 className="text-lg font-black mb-6">My Booking Requests</h3>

                        {bookingHistory.length === 0 ? (
                            <p className="text-sm text-slate-400 italic">No booking requests yet.</p>
                        ) : (
                            <div className="space-y-4">
                                {bookingHistory.map(b => (
                                    <div key={b._id} className="p-6 bg-white rounded-2xl shadow border">
                                        <p><strong>Hostel:</strong> {b.hostelId?.hostelName}</p>
                                        <p><strong>Room:</strong> {b.roomId?.roomNumber}</p>
                                        <p><strong>Bed:</strong> {b.bedId?.bedName}</p>
                                        <p><strong>Status:</strong>
                                            <span className={`ml-2 font-bold ${b.status === "Approved" ? "text-green-600" :
                                                    b.status === "Rejected" ? "text-red-600" :
                                                        "text-yellow-600"
                                                }`}>
                                                {b.status}
                                            </span>
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}

export default MyBookingRequest;