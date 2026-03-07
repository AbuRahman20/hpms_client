import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    FiAlertCircle,
    FiCheckCircle,
    FiClock,
    FiXCircle,
    FiFileText,
    FiHome,
    FiUser,
    FiCalendar,
} from "react-icons/fi";

function MyComplaints() {

    const [complaints, setComplaints] = useState([]);
    const [allocation, setAllocation] = useState(null);
    const [formData, setFormData] = useState({
        category: "Electrical",
        title: "",
        description: "",
    });
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const registerNo = sessionStorage.getItem("registerNo");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [allocRes, compRes] = await Promise.all([
                    axios.get(`http://localhost:5000/api/myComplaints/active/${registerNo}`),
                    axios.get(`http://localhost:5000/api/myComplaints/${registerNo}`),
                ]);
                setAllocation(allocRes.data);
                setComplaints(compRes.data);
            } catch (err) {
                setError("Failed to load data. Please try again.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (registerNo) fetchData();
    }, [registerNo]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!allocation) {
            alert("You are not currently allocated to any room.");
            return;
        }

        setSubmitting(true);
        setError("");

        try {
            const payload = {
                hostelId: allocation.hostelId._id || allocation.hostelId,
                roomId: allocation.roomId._id || allocation.roomId,
                category: formData.category,
                title: formData.title,
                description: formData.description,
            };

            const response = await axios.post(
                `http://localhost:5000/api/myComplaints/${registerNo}`,
                payload
            );
            setComplaints([response.data, ...complaints]);
            setFormData({ category: "Electrical", title: "", description: "" });
            alert("Complaint submitted successfully!");
        } catch (err) {
            setError("Failed to submit complaint. Please try again.");
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    // Status icon with white color for bright badges
    const getStatusIcon = (status, isBadge = false) => {
        const iconClass = isBadge ? "text-white" : "";
        switch (status) {
            case "Resolved":
                return <FiCheckCircle className={iconClass} />;
            case "In Progress":
                return <FiClock className={iconClass} />;
            case "Rejected":
                return <FiXCircle className={iconClass} />;
            default:
                return <FiAlertCircle className={iconClass} />;
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
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
                        <FiFileText className="text-teal-600" />
                        My Complaints
                    </h1>
                    <p className="text-gray-600 mt-2">Track and manage your hostel complaints</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2">
                        <FiAlertCircle />
                        {error}
                    </div>
                )}

                {/* Active Allocation Card */}
                {allocation && (
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
                        <div className="flex items-center gap-4 text-gray-700">
                            <FiHome className="text-teal-600 text-2xl" />
                            <div>
                                <p className="text-sm font-medium text-gray-500">Current Allocation</p>
                                <p className="text-lg font-semibold">
                                    {allocation.hostelId?.hostelName} • Room {allocation.roomId?.roomNumber} • Bed{" "}
                                    {allocation.bedId?.bedName}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* New Complaint Form */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8 mb-10">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                        <FiAlertCircle className="text-teal-600" />
                        Lodge a New Complaint
                    </h2>

                    {!allocation ? (
                        <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-800 flex items-center gap-3">
                            <FiAlertCircle />
                            You are not currently allocated to any room. You cannot lodge a complaint.
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition bg-white"
                                        required
                                    >
                                        <option value="Electrical">⚡ Electrical</option>
                                        <option value="Water">💧 Water</option>
                                        <option value="Maintenance">🔧 Maintenance</option>
                                        <option value="Cleaning">🧹 Cleaning</option>
                                        <option value="Internet">🌐 Internet</option>
                                        <option value="Other">📌 Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="e.g., Light not working"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="4"
                                    placeholder="Provide details about the problem..."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition resize-none"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl shadow-lg shadow-teal-200 transition transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {submitting ? "Submitting..." : "Submit Complaint"}
                            </button>
                        </form>
                    )}
                </div>

                {/* Complaint History - IMPROVED */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                        <FiFileText className="text-teal-600" />
                        Complaint History
                    </h2>

                    {complaints.length === 0 ? (
                        <div className="text-center py-12">
                            <FiFileText className="mx-auto text-gray-400 text-5xl mb-4" />
                            <p className="text-gray-500 text-lg">No complaints lodged yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {complaints.map((complaint) => {
                                // Category colors (soft pastels)
                                const categoryColor = {
                                    Electrical: "bg-yellow-100 text-yellow-800 border-yellow-200",
                                    Water: "bg-teal-100 text-teal-800 border-teal-200",
                                    Maintenance: "bg-orange-100 text-orange-800 border-orange-200",
                                    Cleaning: "bg-green-100 text-green-800 border-green-200",
                                    Internet: "bg-purple-100 text-purple-800 border-purple-200",
                                    Other: "bg-gray-100 text-gray-800 border-gray-200",
                                }[complaint.category] || "bg-gray-100 text-gray-800 border-gray-200";

                                // Status badge colors (solid bright)
                                const statusColors = {
                                    Resolved: "bg-green-500 text-white",
                                    "In Progress": "bg-yellow-500 text-white",
                                    Rejected: "bg-red-500 text-white",
                                    Pending: "bg-gray-500 text-white",
                                };

                                // Left border accent color (same as status)
                                const leftBorderColor = {
                                    Resolved: "border-l-green-500",
                                    "In Progress": "border-l-yellow-500",
                                    Rejected: "border-l-red-500",
                                    Pending: "border-l-gray-400",
                                }[complaint.status] || "border-l-gray-300";

                                return (
                                    <div
                                        key={complaint._id}
                                        className={`group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden ${leftBorderColor ? `border-l-4 ${leftBorderColor}` : ""
                                            }`}
                                    >
                                        {/* Subtle gradient overlay on hover */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                                        <div className="relative p-6">
                                            {/* Header with category and status */}
                                            <div className="flex items-start justify-between mb-4">
                                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${categoryColor}`}>
                                                    {complaint.category}
                                                </span>
                                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${statusColors[complaint.status]}`}>
                                                    {getStatusIcon(complaint.status, true)}
                                                    {complaint.status}
                                                </span>
                                            </div>

                                            {/* Title */}
                                            <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                                                {complaint.title}
                                            </h3>

                                            {/* Description */}
                                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                                {complaint.description}
                                            </p>

                                            {/* Footer with metadata */}
                                            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 border-t border-gray-100 pt-4 mt-2">
                                                <span className="flex items-center gap-1">
                                                    <FiCalendar className="text-gray-400" />
                                                    {formatDate(complaint.createdAt)}
                                                </span>
                                                {complaint.resolvedDate && (
                                                    <span className="flex items-center gap-1">
                                                        <FiCheckCircle className="text-green-400" />
                                                        {formatDate(complaint.resolvedDate)}
                                                    </span>
                                                )}
                                                {complaint.resolvedBy && (
                                                    <span className="flex items-center gap-1">
                                                        <FiUser className="text-gray-400" />
                                                        {complaint.resolvedBy.name || "Admin"}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MyComplaints;