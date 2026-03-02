import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
    Building2, BedDouble, DoorOpen, Calendar,
    Loader2, Inbox, ArrowUpRight, CheckCircle2,
    Clock, XCircle, RefreshCw
} from "lucide-react";

function MyBookingRequest() {

    const apiUrl = import.meta.env.VITE_API_URL;
    const registerNo = sessionStorage.getItem("registerNo");
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchRequests = useCallback(async (quiet = false) => {
        if (!quiet) setLoading(true);
        else setIsRefreshing(true);
        try {
            const res = await axios.get(`${apiUrl}/api/myRequest/my-requests/${registerNo}`);
            setRequests(res.data);
        } catch (error) {
            console.error("Fetch Error:", error);
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    }, [apiUrl, registerNo]);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="relative">
                    <Loader2 className="animate-spin text-teal-600" size={48} strokeWidth={1.5} />
                    <div className="absolute inset-0 bg-teal-500/10 blur-xl rounded-full" />
                </div>
                <p className="text-slate-400 font-medium animate-pulse text-sm">Syncing your requests...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">

            {/* --- HEADER --- */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <div className="flex items-center gap-2 text-teal-600 font-black text-[10px] uppercase tracking-[0.3em] mb-2">
                        <div className="w-4 h-px bg-teal-600" /> Activity Log
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Booking History</h1>
                    <p className="text-slate-500 mt-2 font-medium">Track the real-time status of your accommodation requests.</p>
                </div>

                <button
                    onClick={() => fetchRequests(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
                >
                    <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
                    {isRefreshing ? "Updating..." : "Refresh Data"}
                </button>
            </header>

            {/* --- CONTENT --- */}
            {requests.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-slate-100 rounded-[3rem] bg-slate-50/30">
                    <div className="p-6 bg-white rounded-full shadow-xl mb-6">
                        <Inbox className="text-slate-200" size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">No History Found</h3>
                    <p className="text-slate-400 max-w-xs text-center mt-2 leading-relaxed">It looks like you haven't submitted any booking requests yet.</p>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {requests
                        .filter((req) => req.status === "Pending")
                        .map((req) => (
                            <div
                                key={req._id}
                                className="group relative bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300 flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
                                            <Building2 size={24} />
                                        </div>
                                        <StatusBadge status={req.status} />
                                    </div>

                                    <h3 className="text-xl font-black text-slate-800 tracking-tight mb-4 group-hover:text-teal-700 transition-colors">
                                        {req.hostelId?.hostelName || "General Hostel"}
                                    </h3>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                                <DoorOpen size={10} /> Unit
                                            </p>
                                            <p className="text-sm font-bold text-slate-700">{req.roomId?.roomNumber || "N/A"}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                                <BedDouble size={10} /> Position
                                            </p>
                                            <p className="text-sm font-bold text-slate-700">{req.bedId?.bedName || "N/A"}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <Calendar size={14} />
                                        <span className="text-xs font-medium uppercase tracking-tighter">
                                            {new Date(req.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </span>
                                    </div>
                                    <button className="text-slate-300 group-hover:text-teal-600 transition-colors">
                                        <ArrowUpRight size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
}

const StatusBadge = ({ status }) => {
    const styles = {
        Approved: "bg-emerald-50 text-emerald-700 border-emerald-100 ring-emerald-500/10",
        Rejected: "bg-rose-50 text-rose-700 border-rose-100 ring-rose-500/10",
        Pending: "bg-amber-50 text-amber-700 border-amber-100 ring-amber-500/10",
    };

    const icons = {
        Approved: <CheckCircle2 size={12} />,
        Rejected: <XCircle size={12} />,
        Pending: <Clock size={12} />,
    };

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ring-2 ${styles[status] || styles.Pending}`}>
            {icons[status] || icons.Pending}
            {status}
        </span>
    );
};

export default MyBookingRequest;