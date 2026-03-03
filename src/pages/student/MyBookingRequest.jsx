import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import {
    Building2, BedDouble, DoorOpen, Calendar,
    Clock, CheckCircle2, XCircle, CreditCard
} from "lucide-react";

// ----- Filter Tabs (copied from admin) -----
const FilterTabs = ({ filter, setFilter }) => {
    const tabs = ["All", "Pending", "Approved", "Rejected"];
    return (
        <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200">
            {tabs.map((tab) => (
                <button
                    key={tab}
                    onClick={() => setFilter(tab)}
                    className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${filter === tab
                        ? "bg-slate-900 text-white shadow-lg"
                        : "text-slate-500 hover:bg-slate-50"
                        }`}
                    aria-pressed={filter === tab}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
};

// ----- Status Badge (reused) -----
const StatusBadge = ({ status }) => {
    const styles = {
        Approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
        Rejected: "bg-rose-50 text-rose-700 border-rose-200",
        Pending: "bg-amber-50 text-amber-700 border-amber-200",
    };
    const icons = {
        Approved: <CheckCircle2 size={12} className="text-emerald-600" />,
        Rejected: <XCircle size={12} className="text-rose-600" />,
        Pending: <Clock size={12} className="text-amber-600" />,
    };
    return (
        <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium border ${styles[status] || "bg-slate-100 text-slate-600 border-slate-200"
                }`}
        >
            {icons[status] || <Clock size={12} />}
            {status}
        </span>
    );
};

// ----- Skeleton Card (matching student card layout) -----
const SkeletonCard = () => (
    <div className="bg-white border border-slate-100 rounded-[1rem] overflow-hidden shadow-sm p-5 animate-pulse">
        <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 bg-slate-200 rounded-xl" />
            <div className="h-5 w-16 bg-slate-200 rounded-full" />
        </div>
        <div className="h-5 w-3/4 bg-slate-200 rounded mb-4" />
        <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="h-4 w-20 bg-slate-200 rounded" />
            <div className="h-4 w-16 bg-slate-200 rounded justify-self-end" />
            <div className="h-4 w-24 bg-slate-200 rounded" />
            <div className="h-4 w-14 bg-slate-200 rounded justify-self-end" />
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <div className="h-4 w-24 bg-slate-200 rounded" />
            <div className="h-4 w-16 bg-slate-200 rounded" />
        </div>
    </div>
);

// ----- Student Request Card (simplified, no actions) -----
const StudentRequestCard = ({ request }) => {

    const { hostelId, roomId, bedId, status, createdAt } = request;

    return (
        <div className="bg-white border border-slate-100 rounded-[1rem] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="p-5">
                {/* Header: icon + status badge */}
                <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center text-white">
                        <Building2 size={20} />
                    </div>
                    <StatusBadge status={status} />
                </div>

                {/* Hostel name */}
                <h3 className="font-semibold text-slate-800 text-lg mb-4">
                    {hostelId?.hostelName || "Unknown Hostel"}
                </h3>

                {/* Room & bed details grid */}
                <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-600">
                        <DoorOpen size={14} className="text-teal-600" />
                        <span className="font-medium">Room {roomId?.roomNumber || "—"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600 justify-end">
                        <BedDouble size={14} className="text-teal-600" />
                        <span className="font-medium">{bedId?.bedName || "—"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600">
                        <CreditCard size={14} className="text-teal-600" />
                        <span className="font-medium">₹{roomId?.rentAmount ?? "—"}</span>
                    </div>
                </div>

                {/* Footer: date only (no actions) */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Calendar size={14} />
                        <span>
                            {new Date(createdAt).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                            })}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ----- Main Component -----
function MyBookingRequest() {

    const apiUrl = import.meta.env.VITE_API_URL;
    const registerNo = sessionStorage.getItem("registerNo");
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState("All");

    const fetchRequests = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await axios.get(`${apiUrl}/api/myRequest/my-requests/${registerNo}`);
            setRequests(res.data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load your requests");
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    }, [apiUrl, registerNo]);

    useEffect(() => {
        if (registerNo) fetchRequests();
    }, [fetchRequests, registerNo]);

    const filteredRequests = useMemo(() => {
        if (filter === "All") return requests;
        return requests.filter((req) => req.status === filter);
    }, [requests, filter]);

    if (!registerNo) {
        return (
            <div className="text-center py-20 bg-white rounded-[1rem] border border-slate-100">
                <div className="text-slate-400 text-6xl mb-4">🔒</div>
                <h3 className="text-xl font-bold text-slate-700">Not logged in</h3>
                <p className="text-slate-500 mt-2">Please log in to view your requests.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50 font-sans">
            <div className="mx-auto">
                {/* Header with title and filter tabs */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                            My Booking Requests
                        </h1>
                        <p className="text-slate-500 font-medium">
                            Track the status of your hostel accommodation requests.
                        </p>
                    </div>
                    <FilterTabs filter={filter} setFilter={setFilter} />
                </div>

                {/* Error message */}
                {error && (
                    <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 font-medium flex items-center justify-between">
                        <span>⚠️ {error}</span>
                        <button
                            onClick={fetchRequests}
                            className="underline underline-offset-2 font-bold"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* Content */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(3)].map((_, i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                ) : filteredRequests.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-[2rem] border border-slate-100">
                        <div className="text-slate-400 text-6xl mb-4">📭</div>
                        <h3 className="text-xl font-bold text-slate-700">No requests found</h3>
                        <p className="text-slate-500 mt-2">
                            {filter === "All"
                                ? "You haven't submitted any booking requests yet."
                                : `You have no ${filter.toLowerCase()} requests at the moment.`}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredRequests.map((request) => (
                            <StudentRequestCard key={request._id} request={request} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyBookingRequest;