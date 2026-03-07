import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    FiHome,
    FiDollarSign,
    FiAlertCircle,
    FiCheckCircle,
    FiClock,
    FiXCircle,
    FiUser,
    FiCalendar,
    FiStar,
} from 'react-icons/fi';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
} from 'recharts';

function StudentDashboard() {

    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const registerNo = sessionStorage.getItem('registerNo');

    useEffect(() => {
        const fetchDashboard = async () => {
            if (!registerNo) {
                setError('No registration number found. Please login again.');
                setLoading(false);
                return;
            }
            try {
                const res = await axios.get(`http://localhost:5000/api/student/dashboard/${registerNo}`);
                setDashboardData(res.data);
            } catch (err) {
                setError('Failed to load dashboard. ' + (err.response?.data?.message || err.message));
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, [registerNo]);

    // Colors for pie chart
    const COLORS = ['#FF8042', '#FFBB28', '#00C49F', '#FF4D4D'];

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 flex items-center gap-2">
                        <FiAlertCircle />
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    if (!dashboardData) return null;

    const { student, activeAllocation, summary, recentPayments, recentComplaints, charts } = dashboardData;

    // Prepare chart data
    const paymentChartData = charts.paymentsByMonth.map(item => ({
        month: item._id,
        amount: item.total
    }));

    const complaintPieData = Object.entries(charts.complaintsByStatus).map(([name, value]) => ({
        name,
        value
    })).filter(item => item.value > 0);

    return (
        <div className="min-h-screen">
            <div className="">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
                        <FiUser className="text-teal-600" />
                        Student Dashboard
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Welcome back, {student.name} ({student.registerNo})
                    </p>
                </div>

                {/* Active Allocation Card */}
                {activeAllocation ? (
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
                        <div className="flex items-center gap-4 text-gray-700">
                            <FiHome className="text-teal-600 text-2xl" />
                            <div>
                                <p className="text-sm font-medium text-gray-500">Current Allocation</p>
                                <p className="text-lg font-semibold">
                                    {activeAllocation.hostelId?.hostelName} • Room {activeAllocation.roomId?.roomNumber} • Bed {activeAllocation.bedId?.bedName}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                    Rent: ₹{activeAllocation.roomId?.rentAmount?.toLocaleString()}/month
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl p-6 mb-8 flex items-center gap-3">
                        <FiAlertCircle />
                        You are not currently allocated to any room.
                    </div>
                )}

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total Payments</p>
                                <p className="text-2xl font-bold text-gray-800">{summary.totalPayments}</p>
                                <p className="text-xs text-gray-500 mt-1">Paid: ₹{summary.totalAmountPaid.toLocaleString()}</p>
                            </div>
                            <div className="p-3 bg-teal-100 rounded-xl">
                                <FiDollarSign className="text-teal-600 text-xl" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Pending Payments</p>
                                <p className="text-2xl font-bold text-gray-800">{summary.pendingPayments}</p>
                            </div>
                            <div className="p-3 bg-yellow-100 rounded-xl">
                                <FiClock className="text-yellow-600 text-xl" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total Complaints</p>
                                <p className="text-2xl font-bold text-gray-800">{summary.totalComplaints}</p>
                                <p className="text-xs text-gray-500 mt-1">Resolved: {summary.resolvedComplaints}</p>
                            </div>
                            <div className="p-3 bg-orange-100 rounded-xl">
                                <FiAlertCircle className="text-orange-600 text-xl" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Feedback Given</p>
                                <p className="text-2xl font-bold text-gray-800">{summary.feedbackCount}</p>
                            </div>
                            <div className="p-3 bg-purple-100 rounded-xl">
                                <FiStar className="text-purple-600 text-xl" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Payment History Bar Chart */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <FiDollarSign className="text-teal-600" />
                            Payment History (Last 6 Months)
                        </h2>
                        {paymentChartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={paymentChartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                                    <Legend />
                                    <Bar dataKey="amount" fill="#0d9488" name="Amount" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-gray-500 text-center py-8">No payment data available.</p>
                        )}
                    </div>

                    {/* Complaints by Status Pie Chart */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <FiAlertCircle className="text-teal-600" />
                            Complaints by Status
                        </h2>
                        {complaintPieData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={complaintPieData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {complaintPieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-gray-500 text-center py-8">No complaints data.</p>
                        )}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Payments */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <FiDollarSign className="text-teal-600" />
                            Recent Payments
                        </h2>
                        {recentPayments.length > 0 ? (
                            <div className="space-y-3">
                                {recentPayments.map(payment => (
                                    <div key={payment._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-800">₹{payment.amount.toLocaleString()}</p>
                                            <p className="text-xs text-gray-500">{payment.paymentType} • {payment.paymentMethod}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${payment.status === 'Paid' ? 'bg-green-100 text-green-800' :
                                                payment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                {payment.status}
                                            </span>
                                            <p className="text-xs text-gray-500 mt-1">{formatDate(payment.paymentDate)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-4">No recent payments.</p>
                        )}
                    </div>

                    {/* Recent Complaints */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <FiAlertCircle className="text-teal-600" />
                            Recent Complaints
                        </h2>
                        {recentComplaints.length > 0 ? (
                            <div className="space-y-3">
                                {recentComplaints.map(complaint => (
                                    <div key={complaint._id} className="p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="font-medium text-gray-800 truncate">{complaint.title}</p>
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${complaint.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                                                complaint.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                                                    complaint.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                                        'bg-gray-100 text-gray-800'
                                                }`}>
                                                {complaint.status}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500">{complaint.category} • {formatDate(complaint.createdAt)}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-4">No recent complaints.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StudentDashboard;