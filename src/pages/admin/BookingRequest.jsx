import React, { useState, useMemo, useCallback, useEffect } from "react";
import axios from "axios";
import {
    User, Phone, GraduationCap, Building2, Clock, Calendar,
    BedDouble, CreditCard, CheckCircle, XCircle, DoorOpen
} from "lucide-react";

const useBookingRequests = (apiUrl) => {

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchRequests = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await axios.get(`${apiUrl}/api/booking/all`);
            setRequests(res.data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load requests");
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    }, [apiUrl]);

    const updateRequestStatus = useCallback(async (id, status) => {
        try {
            await axios.patch(`${apiUrl}/api/booking/update/${id}`, { status });
            setRequests((prev) =>
                prev.map((req) => (req._id === id ? { ...req, status } : req))
            );
            return { success: true };
        } catch (err) {
            console.error("Update failed:", err.response?.data);
            return { success: false, error: err.response?.data?.message || "Update failed" };
        }
    }, [apiUrl]);

    return { requests, loading, error, fetchRequests, updateRequestStatus };
};

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

const SkeletonCard = () => (
    <div className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm p-6 animate-pulse">
        <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-200 rounded-2xl" />
                <div>
                    <div className="h-4 w-24 bg-slate-200 rounded mb-2" />
                    <div className="h-3 w-16 bg-slate-200 rounded" />
                </div>
            </div>
            <div className="h-6 w-16 bg-slate-200 rounded-full" />
        </div>
        <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-2xl">
            <div className="h-4 w-32 bg-slate-200 rounded" />
            <div className="h-4 w-40 bg-slate-200 rounded" />
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="h-4 w-20 bg-slate-200 rounded" />
            <div className="h-4 w-16 bg-slate-200 rounded justify-self-end" />
            <div className="h-4 w-16 bg-slate-200 rounded" />
            <div className="h-4 w-12 bg-slate-200 rounded justify-self-end" />
        </div>
        <div className="flex gap-2 pt-4 border-t border-slate-50">
            <div className="flex-1 h-10 bg-slate-200 rounded-xl" />
            <div className="flex-1 h-10 bg-slate-200 rounded-xl" />
        </div>
    </div>
);

const RequestCard = ({ request, onApprove, onReject }) => {
    const { studentId, hostelId, roomId, bedId, status, _id, createdAt } = request;

    const statusStyles = {
        Approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
        Rejected: "bg-rose-50 text-rose-700 border-rose-200",
        Pending: "bg-amber-50 text-amber-700 border-amber-200",
    };

    const statusIcons = {
        Approved: <CheckCircle size={12} className="text-emerald-600" />,
        Rejected: <XCircle size={12} className="text-rose-600" />,
        Pending: <Clock size={12} className="text-amber-600" />,
    };

    const handleApprove = () => {
        if (window.confirm("Approve this request?")) onApprove(_id);
    };

    const handleReject = () => {
        if (window.confirm("Reject this request?")) onReject(_id);
    };

    return (
        <div className="bg-white border border-slate-100 rounded-[1rem] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="p-5">
                {/* Header: avatar + name + status badge */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {studentId?.name?.charAt(0) || "?"}
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-800 leading-tight">
                                {studentId?.name || "Unknown"}
                            </h3>
                            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                                {studentId?.registerNo || "N/A"}
                            </p>
                        </div>
                    </div>
                    <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium border ${statusStyles[status] || "bg-slate-100 text-slate-600 border-slate-200"}`}
                    >
                        {statusIcons[status] || <Clock size={12} />}
                        {status}
                    </span>
                </div>

                {/* Contact info with icons */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Phone size={14} className="text-slate-400" />
                        <span className="font-medium">{studentId?.phone || "—"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                        <GraduationCap size={14} className="text-slate-400" />
                        <span className="font-medium">{studentId?.department || "—"}</span>
                    </div>
                </div>

                {/* Room details grid */}
                <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-600">
                        <Building2 size={14} className="text-teal-600" />
                        <span className="font-medium">{hostelId?.hostelName || "—"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600 justify-end">
                        <CreditCard size={14} className="text-teal-600" />
                        <span className="font-medium">₹{roomId?.rentAmount ?? "—"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600">
                        <DoorOpen size={14} className="text-teal-600" />
                        <span className="font-medium">Room {roomId?.roomNumber || "—"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600 justify-end">
                        <BedDouble size={14} className="text-teal-600" />
                        <span className="font-medium">{bedId?.bedName || "—"}</span>
                    </div>
                </div>

                {/* Footer: date + approve/reject buttons */}
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
                    <div className="flex gap-2">
                        <button
                            onClick={handleApprove}
                            disabled={status !== "Pending"}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-lg border border-emerald-200 hover:bg-emerald-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            aria-label="Approve"
                        >
                            <CheckCircle size={14} /> Approve
                        </button>
                        <button
                            onClick={handleReject}
                            disabled={status !== "Pending"}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-50 text-rose-700 text-xs font-medium rounded-lg border border-rose-200 hover:bg-rose-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            aria-label="Reject"
                        >
                            <XCircle size={14} /> Reject
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

function BookingRequest() {

    const apiUrl = import.meta.env.VITE_API_URL;
    const { requests, loading, error, fetchRequests, updateRequestStatus } =
        useBookingRequests(apiUrl);
    const [filter, setFilter] = useState("All");

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    const filteredRequests = useMemo(() => {
        if (filter === "All") return requests;
        return requests.filter((req) => req.status === filter);
    }, [requests, filter]);

    const handleApprove = useCallback(
        async (id) => {
            const result = await updateRequestStatus(id, "Approved");
            if (!result.success) {
                alert(`Error: ${result.error}`);
            }
        },
        [updateRequestStatus]
    );

    const handleReject = useCallback(
        async (id) => {
            const result = await updateRequestStatus(id, "Rejected");
            if (!result.success) {
                alert(`Error: ${result.error}`);
            }
        },
        [updateRequestStatus]
    );

    return (
        <div className="min-h-screen bg-slate-50/50 font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                            Incoming Requests
                        </h1>
                        <p className="text-slate-500 font-medium">
                            Manage student hostel allocations and pending approvals.
                        </p>
                    </div>
                    <FilterTabs filter={filter} setFilter={setFilter} />
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 font-medium">
                        ⚠️ {error}{" "}
                        <button
                            onClick={fetchRequests}
                            className="underline underline-offset-2 font-bold"
                        >
                            Retry
                        </button>
                    </div>
                )}

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
                                ? "There are no booking requests yet."
                                : `No ${filter.toLowerCase()} requests at the moment.`}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredRequests.map((request) => (
                            <RequestCard
                                key={request._id}
                                request={request}
                                onApprove={handleApprove}
                                onReject={handleReject}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default BookingRequest;