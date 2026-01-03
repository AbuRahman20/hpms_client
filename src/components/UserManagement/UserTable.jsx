import React, { useState } from 'react';
import { Edit2, Trash2, } from 'lucide-react';

function UserTable({ filteredUsers, searchTerm, onDelete, onEdit }) {

    return (
        <div className="relative">
            <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Reg No</th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Department</th>
                 
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Year</th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Phone No</th>
                            <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user, index) => (
                                <tr key={user.registerNo || index} className="hover:bg-teal-50">
                                    <td className="px-6 py-4 text-sm font-medium">{user.registerNo}</td>
                                    <td className="px-6 py-4 text-sm">{user.name}</td>
                                    <td className="px-6 py-4 text-sm ">{user.department}</td>
                                    <td className="px-6 py-4 text-sm">{user.year}</td>
                                    <td className="px-6 py-4 text-sm">{user.phone}</td>
                                    <td className="px-6 py-4 text-right whitespace-nowrap">
                                        <button
                                            onClick={() => onEdit(user)}
                                            className="text-teal-600 hover:text-teal-900 mx-2 p-1 rounded-full hover:bg-teal-100 transition"
                                        >
                                            <Edit2 className="w-5 h-5 inline" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(user)}
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
                                    No users found matching "{searchTerm}".
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default UserTable;