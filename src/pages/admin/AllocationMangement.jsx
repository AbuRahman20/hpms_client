import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    User, Hash, MapPin, Bed, ShieldCheck,
    ChevronRight, LogOut, LayoutGrid, Search, Eye
} from "lucide-react";

function AllocationManagement() {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [allocations, setAllocations] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAllocations = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${apiUrl}/api/allocation/all`);
            setAllocations(res.data);
        } catch (error) {
            console.error("Data fetch failed", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAllocations(); }, []);

    const handleVacate = async (id) => {
        if (!window.confirm("Confirm termination of this allocation?")) return;
        await axios.patch(`${apiUrl}/api/allocation/vacate/${id}`);
        fetchAllocations();
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10 font-sans text-slate-900">
            <div className="max-w-7xl mx-auto">

                {/* --- HEADER SECTION --- */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="h-2 w-2 bg-indigo-600 rounded-full animate-pulse"></span>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Live System</span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase">
                            Allocation <span className="text-indigo-600">Portal</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Search by Student or Reg No..."
                                className="pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all w-64 text-sm font-medium"
                            />
                        </div>
                    </div>
                </div>

                {/* --- TABLE CONTAINER --- */}
                <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Identity</th>
                                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Location Details</th>
                                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Registrar</th>
                                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Status</th>
                                    <th className="p-6 text-right text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {allocations.map((a) => (
                                    <tr key={a._id} className="group hover:bg-slate-50/80 transition-all duration-200">

                                        {/* Identity Column */}
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                                                    <User size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-900 leading-none mb-1">{a.studentId?.name}</p>
                                                    <div className="flex items-center gap-1 text-slate-400">
                                                        <Hash size={12} />
                                                        <span className="text-xs font-bold font-mono tracking-tight">{a.studentId?.registerNo}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Location Column */}
                                        <td className="p-6">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-slate-700">
                                                    <MapPin size={14} className="text-indigo-500" />
                                                    <span className="text-sm font-bold uppercase tracking-tight">{a.hostelId?.hostelName}</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-slate-400 text-[11px] font-black uppercase tracking-widest pl-5">
                                                    <span>Room {a.roomId?.roomNumber}</span>
                                                    <span className="h-1 w-1 bg-slate-200 rounded-full"></span>
                                                    <span>{a.bedId?.bedName}</span>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Registrar Column */}
                                        <td className="p-6">
                                            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg w-fit">
                                                <ShieldCheck size={14} className="text-slate-500" />
                                                <span className="text-xs font-bold text-slate-600 tracking-tight">{a.allocatedBy || "System Admin"}</span>
                                            </div>
                                        </td>

                                        {/* Status Column */}
                                        <td className="p-6">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide border ${a.status === "Active"
                                                    ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                                    : "bg-rose-50 text-rose-600 border-rose-100"
                                                }`}>
                                                <span className={`h-1.5 w-1.5 rounded-full ${a.status === "Active" ? "bg-emerald-500" : "bg-rose-500"}`}></span>
                                                {a.status}
                                            </span>
                                        </td>

                                        {/* Action Column */}
                                        <td className="p-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => setSelectedAllocation(a)}>
                                                    <Eye size={18} />
                                                </button>
                                                {a.status === "Active" && (
                                                    <button
                                                        onClick={() => handleVacate(a._id)}
                                                        className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-rose-600 transition-all shadow-md active:scale-95"
                                                    >
                                                        <LogOut size={14} />
                                                        Vacate
                                                    </button>
                                                )}
                                            </div>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* --- FOOTER INFO --- */}
                <div className="mt-8 flex justify-between items-center text-slate-400">
                    <p className="text-xs font-bold uppercase tracking-widest">Total Allocations: {allocations.length}</p>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em]">
                        <LayoutGrid size={12} />
                        Grid v4.0.2
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AllocationManagement;