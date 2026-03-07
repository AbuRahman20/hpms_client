import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    FiStar,
    FiMessageSquare,
    FiSearch,
    FiFilter,
    FiCalendar,
    FiHome,
    FiUser,
    FiAlertCircle,
} from 'react-icons/fi';

function ServiceReview() {

    const [feedbacks, setFeedbacks] = useState([]);
    const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [hostelFilter, setHostelFilter] = useState('all');
    const [hostels, setHostels] = useState([]);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/feedback/admin/all');
                setFeedbacks(res.data);
                setFilteredFeedbacks(res.data);
                const uniqueHostels = [...new Set(res.data.map(f => f.hostelId?.hostelName).filter(Boolean))];
                setHostels(uniqueHostels);
            } catch (err) {
                setError('Failed to load feedback. ' + (err.response?.data?.message || err.message));
            } finally {
                setLoading(false);
            }
        };
        fetchFeedbacks();
    }, []);

    useEffect(() => {

        let filtered = feedbacks;

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(f =>
                f.studentId?.name?.toLowerCase().includes(term) ||
                f.studentId?.registerNo?.toLowerCase().includes(term) ||
                f.complaintId?.title?.toLowerCase().includes(term) ||
                f.message?.toLowerCase().includes(term)
            );
        }

        if (hostelFilter !== 'all') {
            filtered = filtered.filter(f => f.hostelId?.hostelName === hostelFilter);
        }

        setFilteredFeedbacks(filtered);
    }, [searchTerm, hostelFilter, feedbacks]);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const renderStars = (rating) => {
        return (
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map(star => (
                    <FiStar
                        key={star}
                        className={star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                        size={16}
                    />
                ))}
                <span className="ml-1 text-sm text-gray-600">({rating})</span>
            </div>
        );
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
                        <FiStar className="text-teal-600" />
                        Service Reviews / Feedback
                    </h1>
                    <p className="text-gray-600 mt-2">
                        View all feedback submitted by students on resolved complaints
                    </p>
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
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative w-full md:w-96">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by student, complaint, or message..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                            />
                        </div>
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <FiFilter className="text-gray-400" />
                            <select
                                value={hostelFilter}
                                onChange={(e) => setHostelFilter(e.target.value)}
                                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition bg-white"
                            >
                                <option value="all">All Hostels</option>
                                {hostels.map(hostel => (
                                    <option key={hostel} value={hostel}>{hostel}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Feedback Table */}
                {filteredFeedbacks.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                        <FiMessageSquare className="mx-auto text-gray-400 text-5xl mb-4" />
                        <p className="text-gray-500 text-lg">No feedback found matching your criteria.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-600">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-6 py-4">Student</th>
                                        <th className="px-6 py-4">Hostel</th>
                                        <th className="px-6 py-4">Complaint</th>
                                        <th className="px-6 py-4">Rating</th>
                                        <th className="px-6 py-4">Feedback</th>
                                        <th className="px-6 py-4">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {filteredFeedbacks.map((fb) => (
                                        <tr key={fb._id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-800">{fb.studentId?.name}</div>
                                                <div className="text-xs text-gray-500">{fb.studentId?.registerNo}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1">
                                                    <FiHome className="text-gray-400" size={14} />
                                                    {fb.hostelId?.hostelName || 'N/A'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 max-w-xs">
                                                <div className="font-medium text-gray-800 truncate">{fb.complaintId?.title}</div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    <span className="inline-block px-2 py-0.5 bg-teal-100 text-teal-800 rounded-full">
                                                        {fb.complaintId?.category}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {renderStars(fb.rating)}
                                            </td>
                                            <td className="px-6 py-4 max-w-sm">
                                                <p className="truncate">{fb.message || <span className="italic text-gray-400">No message</span>}</p>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-1 text-gray-500">
                                                    <FiCalendar size={14} />
                                                    {formatDate(fb.createdAt)}
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
        </div>
    );
}

export default ServiceReview;