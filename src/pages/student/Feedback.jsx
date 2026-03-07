import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiStar, FiMessageSquare, FiCheckCircle, FiXCircle, FiHome, FiCalendar } from 'react-icons/fi';

function Feedback() {

    const [resolvedComplaints, setResolvedComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [feedbackForm, setFeedbackForm] = useState({
        complaintId: null,
        rating: 5,
        message: ''
    });
    const [showForm, setShowForm] = useState(false);

    const registerNo = sessionStorage.getItem('registerNo');

    useEffect(() => {
        const fetchResolvedComplaints = async () => {
            if (!registerNo) {
                setError('No registration number found. Please login again.');
                setLoading(false);
                return;
            }
            try {
                const res = await axios.get(`http://localhost:5000/api/feedback/resolved-complaints/${registerNo}`);
                setResolvedComplaints(res.data);
            } catch (err) {
                setError('Failed to load resolved complaints. ' + (err.response?.data?.message || err.message));
            } finally {
                setLoading(false);
            }
        };
        fetchResolvedComplaints();
    }, [registerNo]);

    const handleInputChange = (e) => {
        setFeedbackForm({ ...feedbackForm, [e.target.name]: e.target.value });
    };

    const openFeedbackForm = (complaint) => {
        setFeedbackForm({
            complaintId: complaint._id,
            rating: 5,
            message: ''
        });
        setShowForm(true);
    };

    const closeFeedbackForm = () => {
        setShowForm(false);
        setFeedbackForm({ complaintId: null, rating: 5, message: '' });
    };

    const submitFeedback = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            await axios.post('http://localhost:5000/api/feedback/submit', {
                registerNo,
                ...feedbackForm
            });
            setResolvedComplaints(prev =>
                prev.map(c => c._id === feedbackForm.complaintId ? { ...c, feedbackGiven: true } : c)
            );
            closeFeedbackForm();
            alert('Feedback submitted successfully!');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit feedback. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
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

    return (
        <div className="min-h-screen">
            <div className="">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
                        <FiStar className="text-teal-600" />
                        Feedback on Resolved Complaints
                    </h1>
                    <p className="text-gray-600 mt-2">Share your experience about how your complaints were handled</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2">
                        <FiXCircle />
                        {error}
                    </div>
                )}

                {/* List of resolved complaints */}
                {resolvedComplaints.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                        <FiCheckCircle className="mx-auto text-gray-400 text-5xl mb-4" />
                        <p className="text-gray-500 text-lg">No resolved complaints found.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {resolvedComplaints.map((complaint) => (
                            <div
                                key={complaint._id}
                                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition"
                            >
                                <div className="p-6">
                                    {/* Header with category (from complaint) and resolved date */}
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm font-medium">
                                            {complaint.category}
                                        </span>
                                        <span className="text-xs text-gray-500 flex items-center gap-1">
                                            <FiCalendar />
                                            {formatDate(complaint.resolvedDate)}
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{complaint.title}</h3>

                                    {/* Description (truncated) */}
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{complaint.description}</p>

                                    {/* Hostel/Room info */}
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                                        <FiHome />
                                        <span>{complaint.hostelId?.hostelName} • Room {complaint.roomId?.roomNumber}</span>
                                    </div>

                                    {/* Feedback status / button */}
                                    {complaint.feedbackGiven ? (
                                        <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
                                            <FiCheckCircle />
                                            <span className="text-sm font-medium">Feedback already submitted</span>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => openFeedbackForm(complaint)}
                                            className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
                                        >
                                            <FiMessageSquare />
                                            Give Feedback
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Feedback Form Modal */}
                {showForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Submit Feedback</h2>
                            <form onSubmit={submitFeedback} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5)</label>
                                    <select
                                        name="rating"
                                        value={feedbackForm.rating}
                                        onChange={handleInputChange}
                                        className="w-full px-4 mt-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                                        required
                                    >
                                        {[5, 4, 3, 2, 1].map(num => (
                                            <option key={num} value={num}>{num} Star{num !== 1 ? 's' : ''}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Feedback (optional)</label>
                                    <textarea
                                        name="message"
                                        value={feedbackForm.message}
                                        onChange={handleInputChange}
                                        rows="4"
                                        placeholder="Tell us about your experience..."
                                        className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 resize-none"
                                    />
                                </div>

                                {error && <p className="text-red-600 text-sm">{error}</p>}

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex-1 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg disabled:opacity-50"
                                    >
                                        {submitting ? 'Submitting...' : 'Submit'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={closeFeedbackForm}
                                        className="flex-1 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Feedback;