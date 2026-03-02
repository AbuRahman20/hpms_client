import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
    User, Phone, GraduationCap, Building2,
    BedDouble, CreditCard, Clock, CheckCircle, DoorOpen, XCircle, Search, Filter
} from "lucide-react";

function BookingRequest() {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("All");

    const fetchRequests = useCallback(async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${apiUrl}/api/booking/all`);
            setRequests(res.data);
        } catch (err) {
            console.error("Failed to sync requests", err);
        } finally {
            setLoading(false);
        }
    }, [apiUrl]);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    const handleAction = async (id, status) => {
        try {
            await axios.patch(`${apiUrl}/api/booking/update/${id}`, {
                status,
            });

            // Update status inside UI instead of removing
            setRequests((prev) =>
                prev.map((req) =>
                    req._id === id ? { ...req, status } : req
                )
            );

        } catch (error) {
            console.error("Update failed:", error);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 font-sans">
            <div className="max-w-7xl mx-auto">

                {/* --- HEADER & CONTROLS --- */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Incoming Requests</h1>
                        <p className="text-slate-500 font-medium">Manage student hostel allocations and pending approvals.</p>
                    </div>

                    <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200">
                        {['All', 'Pending', 'Approved', 'Rejected'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setFilter(tab)}
                                className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${filter === tab ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* --- DATA CARDS --- */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-50 pointer-events-none">
                        {[1, 2, 3].map(i => <div key={i} className="h-64 bg-white rounded-[2rem] animate-pulse" />)}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {requests
                            .filter((req) => {
                                if (filter === "All") return true;
                                return req.status === filter;
                            })
                            .map((req) => (
                                <div key={req._id} className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all group">

                                    {/* Status Top-Bar */}
                                    <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm ${req.status === 'Approved'
                                        ? 'bg-emerald-50 text-emerald-600'
                                        : req.status === 'Rejected'
                                            ? 'bg-rose-50 text-rose-600'
                                            : 'bg-amber-50 text-amber-600'
                                        }`}>
                                        {req.status}
                                    </div>

                                    <div className="p-6">
                                        {/* Student Identity */}
                                        <div className="flex items-start justify-between mb-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-bold">
                                                    {req.studentId?.name?.charAt(0)}
                                                </div>
                                                <div>
                                                    <h3 className="font-black text-slate-800 tracking-tight leading-none mb-1">
                                                        {req.studentId?.name}
                                                    </h3>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                        ID: {req.studentId?.registerNo}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm ${req.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                                }`}>
                                                {req.status}
                                            </div>
                                        </div>

                                        {/* Student Details Grid */}
                                        <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                            <div className="flex items-center gap-3 text-slate-600">
                                                <Phone size={14} className="text-slate-400" />
                                                <span className="text-xs font-bold">{req.studentId?.phone}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-slate-600">
                                                <GraduationCap size={14} className="text-slate-400" />
                                                <span className="text-xs font-bold">{req.studentId?.department}</span>
                                            </div>
                                        </div>

                                        {/* Allocation Details */}
                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div className="flex items-center gap-2">
                                                <Building2 size={14} className="text-teal-600" />
                                                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tighter">{req.hostelId?.hostelName}</span>
                                            </div>
                                            <div className="flex items-center gap-2 justify-end">
                                                <CreditCard size={14} className="text-teal-600" />
                                                <span className="text-xs font-black text-slate-800 italic">₹{req.roomId?.rentAmount}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <DoorOpen size={14} className="text-teal-600" />
                                                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tighter">Room {req.roomId?.roomNumber}</span>
                                            </div>
                                            <div className="flex items-center gap-2 justify-end">
                                                <BedDouble size={14} className="text-teal-600" />
                                                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tighter">{req.bedId?.bedName}</span>
                                            </div>
                                        </div>

                                        {/* ADMIN ACTIONS */}
                                        <div className="flex gap-2 pt-4 border-t border-slate-50">
                                            <button
                                                onClick={() => handleAction(req._id, 'Approved')}
                                                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-xs active:scale-95 shadow-lg shadow-emerald-200"
                                            >
                                                <CheckCircle size={14} /> Approve
                                            </button>
                                            <button
                                                onClick={() => handleAction(req._id, 'Rejected')}
                                                className="flex-1 bg-white hover:bg-rose-50 text-rose-600 border border-rose-100 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-xs active:scale-95"
                                            >
                                                <XCircle size={14} /> Reject
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default BookingRequest;