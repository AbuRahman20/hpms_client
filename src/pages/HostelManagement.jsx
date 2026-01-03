import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Edit2, Trash2 } from 'lucide-react';

function HostelManagement() {
    
    const apiUrl = import.meta.env.VITE_API_URL;

    const [hostels, setHostels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // FETCH HOSTEL DATA
    const fetchHostels = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${apiUrl}/fetchhosteldata`);
            setHostels(response.data || []);
        } catch (err) {
            console.error(err);
            setError('Failed to load hostel data. Please check server connection.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHostels();
    }, []);

    // FILTER HOSTELS
    const filteredHostels = hostels.filter((hostel) =>
        hostel.hostelName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hostel.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // EDIT HANDLER
    const onEdit = (hostel) => {
        console.log('Edit hostel:', hostel);
        // open edit modal here
    };

    // DELETE HANDLER
    const onDelete = async (hostel) => {
        if (!window.confirm(`Delete ${hostel.hostelName}?`)) return;

        try {
            await axios.delete(`${apiUrl}/deletehostel/${hostel._id}`);
            fetchHostels();
        } catch (err) {
            console.error(err);
            alert('Failed to delete hostel');
        }
    };

    return (
        <div className="relative p-4">

            {/* SEARCH */}
            <input
                type="text"
                placeholder="Search hostel..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-4 px-4 py-2 border rounded-lg w-full md:w-1/3"
            />

            {/* LOADING */}
            {loading && (
                <div className="text-center py-6 text-gray-500">
                    Loading hostels...
                </div>
            )}

            {/* ERROR */}
            {error && (
                <div className="text-center py-6 text-red-600">
                    {error}
                </div>
            )}

            {!loading && !error && (
                <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
                    <table className="min-w-full divide-y divide-gray-200">

                        {/* TABLE HEADER */}
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hostel ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hostel Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Rooms</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Warden Name</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>

                        {/* TABLE BODY */}
                        <tbody className="divide-y divide-gray-200">
                            {filteredHostels.length > 0 ? (
                                filteredHostels.map((hostel, index) => (
                                    <tr key={hostel._id || index} className="hover:bg-teal-50">
                                        <td className="px-6 py-4 text-sm font-medium">
                                            {hostel.hostelId}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {hostel.hostelName}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {hostel.location}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {hostel.totalRooms}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {hostel.wardenName}
                                        </td>
                                        <td className="px-6 py-4 text-right whitespace-nowrap">
                                            <button
                                                onClick={() => onEdit(hostel)}
                                                className="text-teal-600 hover:text-teal-900 mx-2 p-1 rounded-full hover:bg-teal-100 transition"
                                            >
                                                <Edit2 className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => onDelete(hostel)}
                                                className="text-red-600 hover:text-red-900 mx-2 p-1 rounded-full hover:bg-red-100 transition"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-10 text-center text-gray-500 text-lg">
                                        No hostels found matching "{searchTerm}"
                                    </td>
                                </tr>
                            )}
                        </tbody>

                    </table>
                </div>
            )}
        </div>
    );
}

export default HostelManagement;
