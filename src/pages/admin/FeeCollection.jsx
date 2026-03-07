import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    FiDollarSign,
    FiFilter,
    FiCheckSquare,
    FiSquare,
    FiAlertCircle,
    FiHome,
    FiUser,
    FiCalendar,
    FiCheckCircle,
    FiX,
    FiRefreshCw
} from 'react-icons/fi';

function FeeCollection() {

    const [allocations, setAllocations] = useState([]);
    const [filteredAllocations, setFilteredAllocations] = useState([]);
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Filters
    const [hostels, setHostels] = useState([]);
    const [selectedHostel, setSelectedHostel] = useState('all');
    const [roomTypeFilter, setRoomTypeFilter] = useState('all');
    const [paymentType, setPaymentType] = useState('Hostel Fee');
    const [customAmount, setCustomAmount] = useState('');
    const [useRentAmount, setUseRentAmount] = useState(true);

    // State for payments management
    const [payments, setPayments] = useState([]);
    const [loadingPayments, setLoadingPayments] = useState(false);
    const [updatingPaymentId, setUpdatingPaymentId] = useState(null);
    const [paymentError, setPaymentError] = useState('');
    const [paymentSuccess, setPaymentSuccess] = useState('');

    // Fetch active allocations on mount
    useEffect(() => {
        fetchAllocations();
        fetchPayments();
    }, []);

    const fetchAllocations = async (hostelId = '') => {
        setLoading(true);
        setError('');
        try {
            const url = `http://localhost:5000/api/payments/admin/active-allocations${hostelId ? `?hostelId=${hostelId}` : ''}`;
            const token = localStorage.getItem('token');
            const res = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAllocations(res.data);
            setFilteredAllocations(res.data);

            // Extract unique hostels for filter
            const uniqueHostels = [...new Set(res.data.map(a => a.hostelId?._id).filter(Boolean))];
            setHostels(uniqueHostels.map(id => {
                const hostel = res.data.find(a => a.hostelId?._id === id)?.hostelId;
                return { _id: id, hostelName: hostel?.hostelName };
            }));
        } catch (err) {
            setError('Failed to load allocations. ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    // Fetch all payments
    const fetchPayments = async () => {
        setLoadingPayments(true);
        setPaymentError('');
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/payments/admin/all', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPayments(res.data);
        } catch (err) {
            setPaymentError('Failed to load payments. ' + (err.response?.data?.message || err.message));
        } finally {
            setLoadingPayments(false);
        }
    };

    // Apply filters
    useEffect(() => {
        let filtered = allocations;

        if (selectedHostel !== 'all') {
            filtered = filtered.filter(a => a.hostelId?._id === selectedHostel);
        }

        if (roomTypeFilter !== 'all') {
            filtered = filtered.filter(a => a.roomId?.roomType === roomTypeFilter);
        }

        setFilteredAllocations(filtered);
        setSelectedIds(new Set());
    }, [selectedHostel, roomTypeFilter, allocations]);

    const handleSelectAll = () => {
        if (selectedIds.size === filteredAllocations.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filteredAllocations.map(a => a._id)));
        }
    };

    const handleSelect = (id) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setSelectedIds(newSet);
    };

    const handleSubmit = async () => {
        if (selectedIds.size === 0) {
            setError('Please select at least one student.');
            return;
        }

        const amount = useRentAmount ? null : parseFloat(customAmount);
        if (!useRentAmount && (isNaN(amount) || amount <= 0)) {
            setError('Please enter a valid custom amount.');
            return;
        }

        setSubmitting(true);
        setError('');
        setSuccess('');

        // Build payment objects for selected allocations
        const paymentsToCreate = [];
        for (const id of selectedIds) {
            const alloc = allocations.find(a => a._id === id);
            if (!alloc) continue;
            paymentsToCreate.push({
                studentId: alloc.studentId._id,
                hostelId: alloc.hostelId._id,
                roomId: alloc.roomId._id,
                amount: useRentAmount ? alloc.roomId.rentAmount : amount,
                paymentType,
                paymentMethod: 'Cash',
                dueDate: new Date().toISOString().split('T')[0],
            });
        }

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/payments/admin/bulk-create',
                { payments: paymentsToCreate },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSuccess(`${paymentsToCreate.length} payments created successfully.`);
            setSelectedIds(new Set());
            // Refresh payments list
            fetchPayments();
        } catch (err) {
            setError('Failed to create payments. ' + (err.response?.data?.message || err.message));
        } finally {
            setSubmitting(false);
        }
    };

    // Update payment status
    const handleUpdateStatus = async (paymentId, newStatus) => {
        setUpdatingPaymentId(paymentId);
        setPaymentError('');
        setPaymentSuccess('');
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/payments/admin/${paymentId}`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setPaymentSuccess(`Payment marked as ${newStatus}.`);
            fetchPayments(); // Refresh list
        } catch (err) {
            setPaymentError('Failed to update status. ' + (err.response?.data?.message || err.message));
        } finally {
            setUpdatingPaymentId(null);
        }
    };

    const roomTypes = [...new Set(allocations.map(a => a.roomId?.roomType).filter(Boolean))];

    // Calculate total amount for selected students
    const calculateTotal = () => {
        let total = 0;
        for (const id of selectedIds) {
            const alloc = allocations.find(a => a._id === id);
            if (alloc) {
                total += useRentAmount ? alloc.roomId.rentAmount : (parseFloat(customAmount) || 0);
            }
        }
        return total;
    };

    if (loading && allocations.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-teal-50 to-indigo-100 flex items-center justify-center">
                <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-600 border-t-transparent"></div>
                    <p className="mt-4 text-lg text-gray-600">Loading allocations...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="">
                {/* Header */}
                <div className="mb-10 text-center md:text-left">
                    <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-teal-600 flex items-center justify-center md:justify-start gap-4">
                        <FiDollarSign className="text-teal-600" />
                        Bulk Payment Creation
                    </h1>
                    <p className="text-gray-500 mt-2">Generate payments for multiple students at once</p>
                </div>

                {/* Alert messages */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-800 rounded-r-xl shadow-md flex items-center gap-3 animate-slideIn">
                        <FiAlertCircle className="text-red-500 flex-shrink-0" size={20} />
                        <span>{error}</span>
                    </div>
                )}
                {success && (
                    <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-800 rounded-r-xl shadow-md flex items-center gap-3 animate-slideIn">
                        <FiCheckCircle className="text-green-500 flex-shrink-0" size={20} />
                        <span>{success}</span>
                    </div>
                )}

                {/* Summary Card */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8 border border-white/50">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-teal-100 rounded-xl">
                                <FiUser className="text-teal-700" size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Selected Students</p>
                                <p className="text-3xl font-bold text-gray-800">{selectedIds.size}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-indigo-100 rounded-xl">
                                <FiDollarSign className="text-indigo-700" size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total Amount</p>
                                <p className="text-3xl font-bold text-gray-800">
                                    ₹{calculateTotal().toLocaleString()}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-100 rounded-xl">
                                <FiCalendar className="text-purple-700" size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Due Date</p>
                                <p className="text-lg font-semibold text-gray-800">Today (default)</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters & Options - Card */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8 border border-white/50">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <FiFilter className="text-teal-600" />
                        Filter Students
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                                <FiHome /> Hostel
                            </label>
                            <select
                                value={selectedHostel}
                                onChange={(e) => setSelectedHostel(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white shadow-sm"
                            >
                                <option value="all">All Hostels</option>
                                {hostels.map(h => (
                                    <option key={h._id} value={h._id}>{h.hostelName}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                                <FiHome /> Room Type
                            </label>
                            <select
                                value={roomTypeFilter}
                                onChange={(e) => setRoomTypeFilter(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white shadow-sm"
                            >
                                <option value="all">All Types</option>
                                {roomTypes.map(rt => (
                                    <option key={rt} value={rt}>{rt}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                                <FiDollarSign /> Payment Type
                            </label>
                            <select
                                value={paymentType}
                                onChange={(e) => setPaymentType(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white shadow-sm"
                            >
                                <option value="Hostel Fee">Hostel Fee</option>
                                <option value="Mess Fee">Mess Fee</option>
                                <option value="Maintenance">Maintenance</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Amount</label>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm text-gray-600">
                                    <input
                                        type="checkbox"
                                        checked={useRentAmount}
                                        onChange={() => setUseRentAmount(!useRentAmount)}
                                        className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                                    />
                                    Use room rent
                                </label>
                                {!useRentAmount && (
                                    <input
                                        type="number"
                                        value={customAmount}
                                        onChange={(e) => setCustomAmount(e.target.value)}
                                        placeholder="Enter amount"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white shadow-sm"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Student List Card (Bulk Creation) */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/50">
                    <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <FiUser className="text-teal-600" />
                            Active Allocations
                            <span className="bg-teal-100 text-teal-800 text-sm font-medium px-3 py-1 rounded-full">
                                {filteredAllocations.length}
                            </span>
                        </h2>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleSelectAll}
                                className="flex items-center gap-2 px-5 py-2 text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-xl transition font-medium"
                            >
                                {selectedIds.size === filteredAllocations.length ? (
                                    <> <FiCheckSquare /> Deselect All </>
                                ) : (
                                    <> <FiSquare /> Select All </>
                                )}
                            </button>
                            {selectedIds.size > 0 && (
                                <button
                                    onClick={() => setSelectedIds(new Set())}
                                    className="flex items-center gap-2 px-5 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition font-medium"
                                >
                                    <FiX /> Clear
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gradient-to-r from-teal-50 to-indigo-50 text-xs uppercase text-gray-700 font-semibold">
                                <tr>
                                    <th className="px-6 py-4">Select</th>
                                    <th className="px-6 py-4">Student</th>
                                    <th className="px-6 py-4">Hostel</th>
                                    <th className="px-6 py-4">Room/Bed</th>
                                    <th className="px-6 py-4">Room Type</th>
                                    <th className="px-6 py-4">Rent Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredAllocations.map(alloc => (
                                    <tr
                                        key={alloc._id}
                                        className={`hover:bg-teal-50/50 transition-colors ${selectedIds.has(alloc._id) ? 'bg-teal-50/30' : ''}`}
                                    >
                                        <td className="px-6 py-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.has(alloc._id)}
                                                onChange={() => handleSelect(alloc._id)}
                                                className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500 border-gray-300"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{alloc.studentId?.name}</div>
                                            <div className="text-xs text-gray-500">{alloc.studentId?.registerNo}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-700">{alloc.hostelId?.hostelName}</td>
                                        <td className="px-6 py-4 text-gray-700">
                                            Room {alloc.roomId?.roomNumber} • Bed {alloc.bedId?.bedName}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium">
                                                {alloc.roomId?.roomType || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-gray-900">
                                            ₹{alloc.roomId?.rentAmount?.toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                                {filteredAllocations.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="text-center py-12 text-gray-500">
                                            <div className="flex flex-col items-center">
                                                <FiAlertCircle size={40} className="text-gray-300 mb-2" />
                                                <p>No active allocations found.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-6 border-t border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="text-sm text-gray-600">
                            {selectedIds.size > 0 ? (
                                <span className="font-medium">{selectedIds.size} student{selectedIds.size > 1 ? 's' : ''} selected</span>
                            ) : (
                                <span>No students selected</span>
                            )}
                        </div>
                        <button
                            onClick={handleSubmit}
                            disabled={submitting || selectedIds.size === 0}
                            className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl shadow-lg shadow-teal-200 transition-all transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {submitting ? (
                                <>
                                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                                    Creating...
                                </>
                            ) : (
                                <> <FiDollarSign /> Create Payments for {selectedIds.size} Students </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Payments Management Card */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/50 mt-8">
                    <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <FiDollarSign className="text-teal-600" />
                            Recent Payments
                            <span className="bg-teal-100 text-teal-800 text-sm font-medium px-3 py-1 rounded-full">
                                {payments.length}
                            </span>
                        </h2>
                        <button
                            onClick={fetchPayments}
                            className="flex items-center gap-2 px-4 py-2 text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-xl transition font-medium"
                        >
                            <FiRefreshCw className={loadingPayments ? 'animate-spin' : ''} />
                            Refresh
                        </button>
                    </div>

                    {paymentError && (
                        <div className="m-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-800 rounded-r-xl shadow-md flex items-center gap-3">
                            <FiAlertCircle className="text-red-500 flex-shrink-0" size={20} />
                            <span>{paymentError}</span>
                        </div>
                    )}
                    {paymentSuccess && (
                        <div className="m-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-800 rounded-r-xl shadow-md flex items-center gap-3">
                            <FiCheckCircle className="text-green-500 flex-shrink-0" size={20} />
                            <span>{paymentSuccess}</span>
                        </div>
                    )}

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gradient-to-r from-teal-50 to-indigo-50 text-xs uppercase text-gray-700 font-semibold">
                                <tr>
                                    <th className="px-6 py-4">Student</th>
                                    <th className="px-6 py-4">Hostel</th>
                                    <th className="px-6 py-4">Room</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Type</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Due Date</th>
                                    <th className="px-6 py-4">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loadingPayments ? (
                                    <tr><td colSpan="8" className="text-center py-8">Loading payments...</td></tr>
                                ) : payments.length === 0 ? (
                                    <tr><td colSpan="8" className="text-center py-8 text-gray-500">No payments found.</td></tr>
                                ) : (
                                    payments.map(payment => (
                                        <tr key={payment._id} className="hover:bg-teal-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900">{payment.studentId?.name}</div>
                                                <div className="text-xs text-gray-500">{payment.studentId?.registerNo}</div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-700">{payment.hostelId?.hostelName}</td>
                                            <td className="px-6 py-4 text-gray-700">{payment.roomId?.roomNumber}</td>
                                            <td className="px-6 py-4 font-semibold text-gray-900">₹{payment.amount?.toLocaleString()}</td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium">
                                                    {payment.paymentType}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${payment.status === 'Paid' ? 'bg-green-100 text-green-800' :
                                                    payment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                    {payment.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-700">
                                                {payment.dueDate ? new Date(payment.dueDate).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td className="px-6 py-4">
                                                {payment.status === 'Paid' ? (
                                                    <button
                                                        disabled
                                                        className="px-3 py-1 bg-gray-400 text-white text-xs font-medium rounded-lg cursor-not-allowed"
                                                    >
                                                        Paid
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleUpdateStatus(payment._id, 'Paid')}
                                                        disabled={updatingPaymentId === payment._id}
                                                        className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition disabled:opacity-50"
                                                    >
                                                        {updatingPaymentId === payment._id ? 'Updating...' : 'Mark Paid'}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Background pattern */}
            <div className="fixed inset-0 -z-10 opacity-5 pointer-events-none" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
        </div>
    );
}

export default FeeCollection;