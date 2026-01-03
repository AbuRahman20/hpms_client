import React,{useState} from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { useEffect } from 'react';
import axios from 'axios';

function HostelManagement() {

    const [hostels, setHostels] = useState({
        hostelId: '', hostelName: '', location: '', totalRooms: '', wardenName: ''
    });
    const [searchTerm, setSearchTerm] = useState('');

    const fetchHostel = async () => {
        try {
            const response = await axios.get('http://localhost:5000/fetchhosteldata');
            setHostels(response.data);
        } catch (err) {
            console.log('Error in fetching hostel data : ', err);
        }
    };

    useEffect(() => {
        fetchHostel();
    }, [])

    return (
        <div className="relative">
            <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
                <table className="min-w-full divide-y divide-gray-200">

                    {/* TABLE HEADER */}
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                                Hostel ID
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                                Hostel Name
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                                Location
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                                Total Rooms
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                                Warden Name
                            </th>
                            <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    {/* TABLE BODY */}
                    <tbody className="divide-y divide-gray-200">
                        {hostels.length > 0 ? (
                            hostels.map((hostel, index) => (
                                <tr
                                    key={hostel.hostelId || index}
                                    className="hover:bg-teal-50"
                                >
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

                                    {/* ACTION BUTTONS */}
                                    <td className="px-6 py-4 text-right whitespace-nowrap">
                                        <button
                                            onClick={() => onEdit(hostel)}
                                            className="text-teal-600 hover:text-teal-900 mx-2 p-1 rounded-full hover:bg-teal-100 transition"
                                        >
                                            <Edit2 className="w-5 h-5 inline" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(hostel)}
                                            className="text-red-600 hover:text-red-900 mx-2 p-1 rounded-full hover:bg-red-100 transition"
                                        >
                                            <Trash2 className="w-5 h-5 inline" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-6 py-10 text-center text-gray-500 text-lg">
                                    No hostels found matching "{searchTerm}".
                                </td>
                            </tr>
                        )}
                    </tbody>

                </table>
            </div>
        </div>
    );
}

export default HostelManagement;
