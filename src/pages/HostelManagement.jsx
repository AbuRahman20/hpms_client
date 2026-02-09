import React, { useEffect, useState } from 'react';
import axios from 'axios';
import HostelTable from '../components/HostelManagement/HostelTable';

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
                <HostelTable
                    filteredHostels={filteredHostels}
                    searchTerm={searchTerm}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            )}
        </div>
    );
}
export default HostelManagement;