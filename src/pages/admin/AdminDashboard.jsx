import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    FiUsers,
    FiHome,
    FiGrid,
    FiLayers,
    FiClock,
    FiAlertCircle,
    FiStar,
    FiDollarSign,
    FiCheckCircle,
    FiTrendingUp,
    FiPieChart,
    FiBarChart2,
    FiActivity,
} from 'react-icons/fi';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell,
    LineChart, Line
} from 'recharts';

function AdminDashboard() {

    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/admin/dashboard/stats`);
                setStats(res.data);
            } catch (err) {
                setError('Failed to load dashboard data. ' + (err.response?.data?.message || err.message));
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-md border-l-4 border-red-500">
                    <div className="flex items-center">
                        <FiAlertCircle className="text-red-500 mr-3" size={24} />
                        <p className="text-gray-800 font-medium">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    const { totals, complaintsByStatus, recentComplaints, recentPayments, monthlyRevenue, complaintsTrend } = stats;

    // Chart data
    const complaintStatusData = complaintsByStatus.map(item => ({
        name: item._id,
        value: item.count
    }));

    const monthlyRevenueData = monthlyRevenue.map(item => ({
        name: `${item._id.year}-${item._id.month.toString().padStart(2, '0')}`,
        revenue: item.total
    }));

    const trendData = complaintsTrend.map(item => ({
        name: `${item._id.year}-${item._id.month.toString().padStart(2, '0')}`,
        count: item.count
    }));

    // Colors for pie chart
    const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

    // Custom tooltip style
    const customTooltipStyle = {
        backgroundColor: '#fff',
        border: 'none',
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        padding: '8px 12px',
    };

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600 mt-1">Overview of your hostel management system</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    <StatCard
                        icon={<FiUsers className="text-blue-600" size={20} />}
                        label="Students"
                        value={totals.students}
                    />
                    <StatCard
                        icon={<FiHome className="text-green-600" size={20} />}
                        label="Hostels"
                        value={totals.hostels}
                    />
                    <StatCard
                        icon={<FiGrid className="text-purple-600" size={20} />}
                        label="Rooms"
                        value={totals.rooms}
                    />
                    <StatCard
                        icon={<FiLayers className="text-amber-600" size={20} />}
                        label="Beds"
                        value={totals.beds}
                    />
                    <StatCard
                        icon={<FiCheckCircle className="text-teal-600" size={20} />}
                        label="Active Allocations"
                        value={totals.activeAllocations}
                    />
                    <StatCard
                        icon={<FiClock className="text-yellow-600" size={20} />}
                        label="Pending Requests"
                        value={totals.pendingRequests}
                    />
                    <StatCard
                        icon={<FiStar className="text-rose-600" size={20} />}
                        label="Avg Rating"
                        value={totals.averageRating}
                        suffix="/5"
                    />
                    <StatCard
                        icon={<FiDollarSign className="text-cyan-600" size={20} />}
                        label="Total Revenue"
                        value={`₹${totals.revenue.toLocaleString()}`}
                    />
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Pie Chart */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                        <div className="flex items-center mb-4">
                            <FiPieChart className="text-gray-500 mr-2" size={18} />
                            <h2 className="text-lg font-semibold text-gray-800">Complaints by Status</h2>
                        </div>
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie
                                    data={complaintStatusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={2}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                    labelLine={{ stroke: '#9CA3AF', strokeWidth: 1 }}
                                >
                                    {complaintStatusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={customTooltipStyle} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Bar Chart */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                        <div className="flex items-center mb-4">
                            <FiBarChart2 className="text-gray-500 mr-2" size={18} />
                            <h2 className="text-lg font-semibold text-gray-800">Monthly Revenue</h2>
                        </div>
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={monthlyRevenueData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 12 }} />
                                <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} />
                                <Tooltip contentStyle={customTooltipStyle} />
                                <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Line Chart */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
                    <div className="flex items-center mb-4">
                        <FiActivity className="text-gray-500 mr-2" size={18} />
                        <h2 className="text-lg font-semibold text-gray-800">Complaints Trend</h2>
                    </div>
                    <ResponsiveContainer width="100%" height={280}>
                        <LineChart data={trendData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                            <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 12 }} />
                            <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} />
                            <Tooltip contentStyle={customTooltipStyle} />
                            <Line type="monotone" dataKey="count" stroke="#8B5CF6" strokeWidth={2} dot={{ r: 3, fill: '#8B5CF6' }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Tables */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Complaints */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                        <div className="flex items-center mb-4">
                            <FiAlertCircle className="text-gray-500 mr-2" size={18} />
                            <h2 className="text-lg font-semibold text-gray-800">Recent Complaints</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 text-gray-600 font-medium">Student</th>
                                        <th className="text-left py-3 text-gray-600 font-medium">Title</th>
                                        <th className="text-left py-3 text-gray-600 font-medium">Status</th>
                                        <th className="text-left py-3 text-gray-600 font-medium">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentComplaints.map(c => (
                                        <tr key={c._id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                                            <td className="py-3 text-gray-800">{c.studentId?.name || 'N/A'}</td>
                                            <td className="py-3 text-gray-600 max-w-xs truncate">{c.title}</td>
                                            <td className="py-3">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${c.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                                                    c.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                                                        c.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                                            'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {c.status}
                                                </span>
                                            </td>
                                            <td className="py-3 text-gray-600">{new Date(c.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Recent Payments */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                        <div className="flex items-center mb-4">
                            <FiDollarSign className="text-gray-500 mr-2" size={18} />
                            <h2 className="text-lg font-semibold text-gray-800">Recent Payments</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 text-gray-600 font-medium">Student</th>
                                        <th className="text-left py-3 text-gray-600 font-medium">Amount</th>
                                        <th className="text-left py-3 text-gray-600 font-medium">Type</th>
                                        <th className="text-left py-3 text-gray-600 font-medium">Status</th>
                                        <th className="text-left py-3 text-gray-600 font-medium">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentPayments.map(p => (
                                        <tr key={p._id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                                            <td className="py-3 text-gray-800">{p.studentId?.name || 'N/A'}</td>
                                            <td className="py-3 text-gray-800 font-medium">₹{p.amount}</td>
                                            <td className="py-3 text-gray-600">{p.paymentType}</td>
                                            <td className="py-3">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${p.status === 'Paid' ? 'bg-green-100 text-green-800' :
                                                    p.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                    {p.status}
                                                </span>
                                            </td>
                                            <td className="py-3 text-gray-600">{new Date(p.paymentDate).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Stat Card Component
function StatCard({ icon, label, value, suffix = '' }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex items-center hover:shadow-md transition-shadow">
            <div className="p-2 bg-gray-50 rounded-lg mr-4">
                {icon}
            </div>
            <div>
                <p className="text-sm text-gray-600 font-medium">{label}</p>
                <p className="text-2xl font-bold text-gray-900">{value}{suffix}</p>
            </div>
        </div>
    );
}

export default AdminDashboard;