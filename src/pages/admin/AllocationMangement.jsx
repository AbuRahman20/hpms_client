import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Bed, Eye, LogOut, Search, LayoutGrid, User, MapPin, X, Check
} from 'lucide-react';

function AllocationManagement() {

    const apiUrl = import.meta.env.VITE_API_URL;
    const [beds, setBeds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const [showAllocationModal, setShowAllocationModal] = useState(false);
    const [selectedBed, setSelectedBed] = useState(null);
    const [unallocatedStudents, setUnallocatedStudents] = useState([]);
    const [loadingStudents, setLoadingStudents] = useState(false);
    const [allocating, setAllocating] = useState(false);

    const fetchBedsWithStatus = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${apiUrl}/api/allocation/with-status`);
            setBeds(res.data);
        } catch (error) {
            console.error('Failed to fetch beds', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBedsWithStatus();
    }, []);

    const handleVacate = async (allocationId) => {
        if (!window.confirm('Confirm termination of this allocation?')) return;
        try {
            await axios.patch(`${apiUrl}/api/allocation/vacate/${allocationId}`);
            fetchBedsWithStatus();
        } catch (error) {
            console.error('Failed to vacate', error);
        }
    };

    const handleView = async (bed) => {

        if (bed.status !== 'Available') {
            alert('This bed is currently occupied. Please vacate it first if you want to reassign.');
            return;
        }

        setSelectedBed(bed);
        setShowAllocationModal(true);

        setLoadingStudents(true);
        try {
            const res = await axios.get(`${apiUrl}/api/allocation/students/unallocated`);
            setUnallocatedStudents(res.data);
        } catch (error) {
            console.error('Failed to fetch unallocated students', error);
        } finally {
            setLoadingStudents(false);
        }
    };

    const handleAllocate = async (studentId) => {

        console.log('first')

        try {
            await axios.post(`${apiUrl}/api/allocation/allocate`, {
                studentId,
                bedId: selectedBed._id,
            });
            setShowAllocationModal(false);
            fetchBedsWithStatus();
        } catch (error) {
            console.error('Allocation failed', error);
            alert(error.response?.data?.message || 'Allocation failed');
        } finally {
            setAllocating(false);
        }
    };

    const filteredBeds = beds.filter(bed => {
        const studentName = bed.allocation?.student?.name || '';
        const studentReg = bed.allocation?.student?.registerNo || '';
        const bedName = bed.bedName || '';
        const roomNumber = bed.room?.roomNumber?.toString() || '';
        const hostelName = bed.hostel?.hostelName || '';
        const term = searchTerm.toLowerCase();
        return studentName.toLowerCase().includes(term) ||
            studentReg.toLowerCase().includes(term) ||
            bedName.toLowerCase().includes(term) ||
            roomNumber.includes(term) ||
            hostelName.toLowerCase().includes(term);
    });

    return (
        <div className="min-h-screen font-sans antialiased">
            <div className="">

                <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                                Allocation Management
                            </h1>
                            <p className="text-slate-500 font-medium">
                                Overview of all beds and current allocations
                            </p>
                        </div>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by student, bed, room..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2.5 w-full sm:w-72 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-shadow"
                        />
                    </div>
                </div>

                {/* Table Card (mostly unchanged) */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-center">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Hostel</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Bed</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Room</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Student</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                                            Loading beds...
                                        </td>
                                    </tr>
                                ) : filteredBeds.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                                            No beds found matching your search.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredBeds.map((bed) => (
                                        <tr key={bed._id} className="hover:bg-slate-50/80 transition-colors">

                                            {/* Hostel */}
                                            <td className="px-6 py-4 text-slate-700">
                                                {bed.hostel?.hostelName || '—'}
                                            </td>

                                            {/* Bed */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-3">
                                                    <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                                                        <Bed size={16} />
                                                    </div>
                                                    <span className="font-medium text-slate-900">{bed.bedName || 'Unnamed'}</span>
                                                </div>
                                            </td>

                                            {/* Room */}
                                            <td className="px-6 py-4 text-slate-700">
                                                {bed.room?.roomNumber || '—'}
                                            </td>

                                            {/* Status */}
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${bed.status === 'Available'
                                                    ? 'bg-emerald-50 text-emerald-700'
                                                    : 'bg-rose-50 text-rose-700'
                                                    }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${bed.status === 'Available' ? 'bg-emerald-500' : 'bg-rose-500'
                                                        }`} />
                                                    {bed.status}
                                                </span>
                                            </td>

                                            {/* Student */}
                                            <td className="px-6 py-4">
                                                {bed.allocation ? (
                                                    <div>
                                                        <p className="font-medium text-slate-900">{bed.allocation.student?.name}</p>
                                                        <p className="text-xs text-slate-500 font-mono mt-0.5">{bed.allocation.student?.registerNo}</p>
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-300">—</span>
                                                )}
                                            </td>

                                            {/* Actions */}
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleView(bed)}
                                                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                        title="Allocate student to this bed"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => bed.allocation && handleVacate(bed.allocation._id)}
                                                        disabled={!bed.allocation}
                                                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${bed.allocation
                                                            ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 cursor-pointer'
                                                            : 'bg-slate-50 text-slate-300 cursor-not-allowed'
                                                            }`}
                                                        title={bed.allocation ? 'Vacate this bed' : 'Bed is not occupied'}
                                                    >
                                                        <LogOut size={14} />
                                                        Vacate
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer (unchanged) */}
                <div className="mt-6 flex items-center justify-between text-xs text-slate-400">
                    <p className="font-medium">
                        Total beds: <span className="text-slate-700">{beds.length}</span>
                    </p>
                    <div className="flex items-center gap-1">
                        <LayoutGrid size={14} />
                        <span>Bed Overview</span>
                    </div>
                </div>
            </div>

            {/* NEW: Allocation Modal */}
            {showAllocationModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div
                        className="fixed inset-0 bg-slate-900/50 bg-opacity-50 transition-opacity"
                        onClick={() => setShowAllocationModal(false)}
                    />

                    <div className="flex min-h-full items-center justify-center p-4">
                        <div
                            className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal content */}
                            <div className="px-6 py-5">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-bold text-slate-900">Allocate Bed</h3>
                                    <button
                                        onClick={() => setShowAllocationModal(false)}
                                        className="text-slate-400 hover:text-slate-600"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                {selectedBed && (
                                    <div className="mb-4 p-3 bg-slate-50 rounded-lg text-sm">
                                        <p className="text-slate-600">
                                            <span className="font-medium">Bed:</span> {selectedBed.bedName} (Room {selectedBed.room?.roomNumber})
                                        </p>
                                        <p className="text-slate-600">
                                            <span className="font-medium">Hostel:</span> {selectedBed.hostel?.hostelName}
                                        </p>
                                    </div>
                                )}

                                {loadingStudents ? (
                                    <div className="py-8 text-center text-slate-400">Loading students...</div>
                                ) : unallocatedStudents.length === 0 ? (
                                    <div className="py-8 text-center text-slate-400">No unallocated students available.</div>
                                ) : (
                                    <div className="max-h-80 overflow-y-auto hide-scrollbar">
                                        <ul className="divide-y divide-slate-100">
                                            {unallocatedStudents.map(student => (
                                                <li key={student._id} className="py-3 flex items-center justify-between">
                                                    <div>
                                                        <p className="font-medium text-slate-900">{student.name}</p>
                                                        <p className="text-xs text-slate-500">{student.registerNo}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleAllocate(student._id)}
                                                        disabled={allocating}
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {allocating ? 'Allocating...' : (
                                                            <>
                                                                <Check size={14} />
                                                                Allocate
                                                            </>
                                                        )}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Footer actions */}
                            <div className="bg-slate-50 px-6 py-3 flex justify-end rounded-b-2xl">
                                <button
                                    type="button"
                                    onClick={() => setShowAllocationModal(false)}
                                    className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div >
            )
            }
        </div >
    );
}

export default AllocationManagement;