import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Home, MapPin, Bed, Calendar, User,
    AlertCircle, CheckCircle2, Clock, ChevronRight, Building2
} from 'lucide-react';

function MyAllocations() {

    const apiUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const [allocations, setAllocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMyAllocations = async () => {
            const registerNo = sessionStorage.getItem('registerNo');
            if (!registerNo) {
                navigate('/login');
                return;
            }

            try {
                const res = await axios.get(`${apiUrl}/api/myAllocation/student/${registerNo}`);
                setAllocations(res.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load allocations');
            } finally {
                setLoading(false);
            }
        };

        fetchMyAllocations();
    }, [apiUrl, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                <p className="text-slate-500 font-medium">Fetching your records...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="mx-auto">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                            My <span className="text-indigo-600">Allocations</span>
                        </h1>
                        <p className="text-slate-500 mt-2 text-lg">
                            Track your housing history and current residence.
                        </p>
                    </div>
                    <div className="hidden md:block">
                        <span className="bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 text-sm font-semibold text-slate-600">
                            Total Records: {allocations.length}
                        </span>
                    </div>
                </div>

                {error ? (
                    <div className="bg-white p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 text-center">
                        <div className="bg-rose-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertCircle className="h-10 w-10 text-rose-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Something went wrong</h2>
                        <p className="text-slate-500 mb-8 max-w-xs mx-auto">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-indigo-600 transition-all active:scale-95"
                        >
                            Try Again
                        </button>
                    </div>
                ) : allocations.length === 0 ? (
                    <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-20 text-center">
                        <div className="bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Home className="h-8 w-8 text-slate-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">No active housing</h3>
                        <p className="text-slate-500 mt-2">You haven't been assigned to a room yet.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {allocations.map((alloc) => (
                            <div
                                key={alloc._id}
                                className="group relative bg-white rounded-3xl border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-100/50 hover:-translate-y-1"
                            >
                                <div className="flex flex-col md:flex-row">
                                    {/* Left Status Accent */}
                                    <div className={`w-full md:w-2 flex md:block ${alloc.status === 'Active' ? 'bg-teal-500' : 'bg-slate-300'
                                        }`} />

                                    <div className="p-8 w-full">
                                        {/* Header: Status & ID */}
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${alloc.status === 'Active'
                                                    ? 'bg-teal-100 text-teal-700'
                                                    : 'bg-slate-100 text-slate-600'
                                                    }`}>
                                                    {alloc.status === 'Active' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                                                    {alloc.status}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] uppercase font-bold text-slate-400">Allocated Date</p>
                                                <p className="text-sm font-semibold text-slate-700">
                                                    {new Date(alloc.allocationDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Main Content Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                            {/* Primary Info */}
                                            <div className="md:col-span-2 flex items-center gap-6">
                                                <div className="hidden sm:flex w-16 h-16 bg-indigo-50 rounded-2xl items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                                                    <Building2 size={32} />
                                                </div>
                                                <div>
                                                    <h3 className="text-2xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                                        {alloc.hostelId?.hostelName || 'N/A'}
                                                    </h3>
                                                    <div className="flex items-center gap-2 text-slate-500 mt-1 font-medium">
                                                        <MapPin size={16} className="text-slate-400" />
                                                        {alloc.hostelId?.location}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Details Pills */}
                                            <div className="flex flex-col justify-center gap-3 border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-8">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-slate-400 text-sm flex items-center gap-2"><Bed size={16} /> Room</span>
                                                    <span className="font-bold text-slate-900 bg-slate-50 px-3 py-1 rounded-md">{alloc.roomId?.roomNumber}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-slate-400 text-sm flex items-center gap-2"><User size={16} /> Bed</span>
                                                    <span className="font-bold text-slate-900">{alloc.bedId?.bedName || '—'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Footer Info */}
                                        <div className="mt-8 pt-6 border-t border-slate-50 flex flex-wrap items-center justify-between gap-4">
                                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                                <User size={14} />
                                                Approved by <span className="font-semibold text-slate-600">{alloc.allocatedBy?.name || 'System'}</span>
                                            </div>
                                            {alloc.vacateDate && (
                                                <div className="text-xs font-medium text-rose-500 bg-rose-50 px-3 py-1 rounded-full">
                                                    Vacated on {new Date(alloc.vacateDate).toLocaleDateString()}
                                                </div>
                                            )}
                                        </div>
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

export default MyAllocations;