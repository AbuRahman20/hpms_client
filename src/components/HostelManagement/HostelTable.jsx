import React from 'react'
import { Edit2, Trash2 } from 'lucide-react';

function HostelTable({ filteredHostels,searchTerm,onEdit,onDelete }) {

    return (
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
    )
}

export default HostelTable