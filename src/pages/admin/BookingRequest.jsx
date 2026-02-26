import React, { useEffect, useState } from "react";
import axios from "axios";

function BookingRequest() {

    const apiUrl = import.meta.env.VITE_API_URL;
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        axios.get(`${apiUrl}/api/booking-requests`)
            .then(res => setBookings(res.data));
    }, []);

    return (
        <div className="p-10">
            <h2 className="text-2xl font-bold mb-6">
                Admin Booking Requests
            </h2>

            {bookings.map(b => (
                <div key={b._id}
                     className="p-6 bg-white shadow rounded-xl border mb-4">

                    <p><strong>Student:</strong> {b.studentId?.name}</p>
                    <p><strong>Hostel:</strong> {b.hostelId?.hostelName}</p>
                    <p><strong>Room:</strong> {b.roomId?.roomNumber}</p>
                    <p><strong>Bed:</strong> {b.bedId?.bedName}</p>
                    <p>
                        <strong>Status:</strong>
                        <span className={`ml-2 ${
                            b.status === "Approved"
                                ? "text-green-600"
                                : b.status === "Rejected"
                                ? "text-red-600"
                                : "text-yellow-600"
                        }`}>
                            {b.status}
                        </span>
                    </p>
                </div>
            ))}
        </div>
    );
}

export default BookingRequest;