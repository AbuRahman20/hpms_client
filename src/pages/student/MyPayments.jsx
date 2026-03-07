import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    FiDollarSign,
    FiCheckCircle,
    FiXCircle,
    FiClock,
    FiFilter,
    FiSearch,
    FiCalendar,
    FiHome,
    FiCreditCard,
    FiAlertCircle,
} from 'react-icons/fi';

function MyPayment() {

    const [payments, setPayments] = useState([]);
    const [filteredPayments, setFilteredPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    const registerNo = sessionStorage.getItem('registerNo');

    useEffect(() => {
        const fetchPayments = async () => {
            if (!registerNo) {
                setError('No registration number found. Please login again.');
                setLoading(false);
                return;
            }
            try {
                const res = await axios.get(`http://localhost:5000/api/payments/student/${registerNo}`);
                setPayments(res.data);
                setFilteredPayments(res.data);
            } catch (err) {
                setError('Failed to load payments. ' + (err.response?.data?.message || err.message));
            } finally {
                setLoading(false);
            }
        };
        fetchPayments();
    }, [registerNo]);

    useEffect(() => {

        let filtered = payments;

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(p =>
                p.transactionId?.toLowerCase().includes(term) ||
                p.paymentType?.toLowerCase().includes(term) ||
                p.amount.toString().includes(term)
            );
        }

        if (typeFilter !== 'all') {
            filtered = filtered.filter(p => p.paymentType === typeFilter);
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(p => p.status === statusFilter);
        }

        setFilteredPayments(filtered);
    }, [searchTerm, typeFilter, statusFilter, payments]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Paid':
                return <FiCheckCircle className="text-green-500" />;
            case 'Pending':
                return <FiClock className="text-yellow-500" />;
            case 'Failed':
                return <FiXCircle className="text-red-500" />;
            default:
                return <FiAlertCircle className="text-gray-500" />;
        }
    };

    const getStatusBadge = (status) => {
        const baseClasses = 'px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1';
        switch (status) {
            case 'Paid':
                return `${baseClasses} bg-green-100 text-green-800`;
            case 'Pending':
                return `${baseClasses} bg-yellow-100 text-yellow-800`;
            case 'Failed':
                return `${baseClasses} bg-red-100 text-red-800`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-800`;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
                        <FiDollarSign className="text-teal-600" />
                        My Payments
                    </h1>
                    <p className="text-gray-600 mt-2">View your payment history and transaction details</p>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2">
                        <FiAlertCircle />
                        {error}
                    </div>
                )}

                {/* Filters */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="relative md:col-span-2">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by transaction ID, type, amount..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                            />
                        </div>

                        {/* Type Filter */}
                        <div>
                            <select
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition bg-white"
                            >
                                <option value="all">All Types</option>
                                <option value="Hostel Fee">Hostel Fee</option>
                                <option value="Mess Fee">Mess Fee</option>
                                <option value="Maintenance">Maintenance</option>
                            </select>
                        </div>

                        {/* Status Filter */}
                        <div>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition bg-white"
                            >
                                <option value="all">All Status</option>
                                <option value="Paid">Paid</option>
                                <option value="Pending">Pending</option>
                                <option value="Failed">Failed</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Payment Cards */}
                {filteredPayments.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                        <FiDollarSign className="mx-auto text-gray-400 text-5xl mb-4" />
                        <p className="text-gray-500 text-lg">No payments found.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredPayments.map((payment) => (
                            <div
                                key={payment._id}
                                className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
                            >
                                <div className="p-6">
                                    {/* Header with type and status */}
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-800">
                                            {payment.paymentType}
                                        </span>
                                        <span className={getStatusBadge(payment.status)}>
                                            {getStatusIcon(payment.status)}
                                            {payment.status}
                                        </span>
                                    </div>

                                    {/* Amount */}
                                    <div className="mb-4">
                                        <p className="text-3xl font-bold text-gray-800">
                                            ₹{payment.amount.toLocaleString()}
                                        </p>
                                    </div>

                                    {/* Details Grid */}
                                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                                        <div>
                                            <p className="text-gray-500">Transaction ID</p>
                                            <p className="font-medium text-gray-800 truncate">{payment.transactionId || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Method</p>
                                            <p className="font-medium text-gray-800 flex items-center gap-1">
                                                <FiCreditCard />
                                                {payment.paymentMethod || 'N/A'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Date</p>
                                            <p className="font-medium text-gray-800 flex items-center gap-1">
                                                <FiCalendar />
                                                {formatDate(payment.paymentDate)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Hostel/Room</p>
                                            <p className="font-medium text-gray-800 flex items-center gap-1">
                                                <FiHome />
                                                {payment.hostelId?.hostelName} • {payment.roomId?.roomNumber || 'N/A'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Footer note if pending/failed */}
                                    {payment.status !== 'Paid' && (
                                        <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500">
                                            {payment.status === 'Pending' && 'Your payment is being processed.'}
                                            {payment.status === 'Failed' && 'Payment failed. Please try again or contact admin.'}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyPayment;