import React, { useEffect, useState } from "react";
import axios from "axios";

function BookingRequest() {

    const apiUrl = import.meta.env.VITE_API_URL;
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        const res = await axios.get(`${apiUrl}/api/booking/all-requests`);
        setRequests(res.data);
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">All Booking Requests</h1>

            <div className="overflow-x-auto bg-white shadow rounded-xl">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-3">Student</th>
                            <th className="px-6 py-3">Register No</th>
                            <th className="px-6 py-3">Hostel</th>
                            <th className="px-6 py-3">Room</th>
                            <th className="px-6 py-3">Bed</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((req) => (
                            <tr key={req._id} className="border-b hover:bg-gray-50">
                                <td className="px-6 py-4">{req.studentId?.name}</td>
                                <td className="px-6 py-4">{req.studentId?.registerNo}</td>
                                <td className="px-6 py-4">{req.hostelId?.hostelName}</td>
                                <td className="px-6 py-4">{req.roomId?.roomNumber}</td>
                                <td className="px-6 py-4">{req.bedId?.bedName}</td>
                                <td className="px-6 py-4">{req.status}</td>
                                <td className="px-6 py-4">
                                    {new Date(req.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default BookingRequest;