import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
    Building2, Calendar, Bed, DoorOpen, Info, 
    LogOut, MoreHorizontal, X, CheckCircle, AlertCircle 
} from "lucide-react";

function AllocationManagement() {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [allocations, setAllocations] = useState([]);
    const [selectedDetail, setSelectedDetail] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchAllocations = async () => {
        setIsRefreshing(true);
        try {
            const res = await axios.get(`${apiUrl}/api/allocation/all`);
            setAllocations(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchAllocations();
    }, []);

    const handleVacate = async (id) => {
        // Professional confirmation instead of alert
        if (!window.confirm("Confirm Vacate: This action will release the bed back into the inventory. Proceed?")) return;

        try {
            await axios.patch(`${apiUrl}/api/allocation/vacate/${id}`);
            fetchAllocations();
        } catch (error) {
            alert(error.response?.data?.message);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
            <div className="max-w-6xl mx-auto">
                
                {/* --- HEADER --- */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                            Allocation <span className="text-indigo-600">History</span>
                        </h1>
                        <p className="text-slate-500 font-medium mt-1">Manage residency records and bed occupancy.</p>
                    </div>
                    <button 
                        onClick={fetchAllocations}
                        className={`px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition-all shadow-sm ${isRefreshing ? 'animate-pulse' : ''}`}
                    >
                        Refresh Data
                    </button>
                </header>

                {/* --- DATA TABLE / EMPTY STATE --- */}
                {allocations.length === 0 ? (
                    <div className="bg-white rounded-[2rem] border-2 border-dashed border-slate-200 py-20 flex flex-col items-center justify-center text-center">
                        <div className="bg-slate-100 p-6 rounded-full mb-4">
                            <AlertCircle className="w-10 h-10 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">No Allocations Found</h3>
                        <p className="text-slate-400 mt-1 max-w-xs">There are currently no active or historical allocations recorded in the system.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 border-b border-slate-100">
                                        <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Hostel & Room</th>
                                        <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Bed Asset</th>
                                        <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Entry Date</th>
                                        <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                                        <th className="p-5 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Management</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {allocations.map((item) => (
                                        <tr key={item._id} className="hover:bg-slate-50/80 transition-colors group">
                                            <td className="p-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                                        <Building2 size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-800 leading-tight">{item.hostelId?.hostelName}</p>
                                                        <p className="text-xs text-slate-400 font-medium">Room {item.roomId?.roomNumber}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <div className="flex items-center gap-2 text-slate-600 font-bold">
                                                    <Bed size={16} className="text-slate-300" />
                                                    {item.bedId?.bedName}
                                                </div>
                                            </td>
                                            <td className="p-5 font-medium text-slate-600">
                                                {new Date(item.allocationDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </td>
                                            <td className="p-5">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide ${
                                                    item.status === "Active" 
                                                    ? "bg-emerald-50 text-emerald-600" 
                                                    : "bg-slate-100 text-slate-500"
                                                }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${item.status === "Active" ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="p-5 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button 
                                                        onClick={() => setSelectedDetail(item)}
                                                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                                        title="View Details"
                                                    >
                                                        <Info size={18} />
                                                    </button>
                                                    {item.status === "Active" && (
                                                        <button 
                                                            onClick={() => handleVacate(item._id)}
                                                            className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 text-xs font-black uppercase tracking-widest rounded-lg hover:bg-rose-600 hover:text-white transition-all shadow-sm"
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
                )}
            </div>

            {/* --- DETAILS MODAL --- */}
            {selectedDetail && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setSelectedDetail(null)} />
                    
                    <div className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-4 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-200">
                                    <CheckCircle size={28} />
                                </div>
                                <button onClick={() => setSelectedDetail(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                    <X size={20} className="text-slate-400" />
                                </button>
                            </div>

                            <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Allocation Details</h3>
                            <p className="text-slate-400 text-sm font-medium mb-8">Verified Registry Record</p>

                            <div className="space-y-4">
                                <DetailRow icon={<Building2 />} label="Property" value={selectedDetail.hostelId?.hostelName} />
                                <DetailRow icon={<DoorOpen />} label="Unit Number" value={`Room ${selectedDetail.roomId?.roomNumber}`} />
                                <DetailRow icon={<Bed />} label="Assigned Bed" value={selectedDetail.bedId?.bedName} />
                                <DetailRow icon={<Calendar />} label="Allocation Date" value={new Date(selectedDetail.allocationDate).toLocaleDateString()} />
                                {selectedDetail.vacateDate && (
                                    <DetailRow icon={<LogOut />} label="Vacated On" value={new Date(selectedDetail.vacateDate).toLocaleDateString()} />
                                )}
                            </div>

                            <button 
                                onClick={() => setSelectedDetail(null)}
                                className="w-full mt-10 py-4 bg-slate-900 text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200"
                            >
                                Close Record
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Helper Component for Modal Rows
function DetailRow({ icon, label, value }) {
    return (
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
            <div className="flex items-center gap-3">
                <div className="text-slate-400 bg-white p-2 rounded-lg shadow-sm">{icon}</div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{label}</span>
            </div>
            <span className="font-bold text-slate-700">{value}</span>
        </div>
    );
}

export default AllocationManagement;