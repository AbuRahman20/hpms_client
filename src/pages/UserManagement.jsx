import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Plus, Edit2, Trash2, Loader2, AlertTriangle, Users, X } from 'lucide-react';

function UserManagement() {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [submissionError, setSubmissionError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [registerNo, setRegisterNo] = useState('')
    const [name, setName] = useState('')
    const [department, setDepartment] = useState('')
    const [year, setYear] = useState('')
    const [phone, setPhone] = useState('')

    const [formData, setFormData] = useState({
        registerNo: '', name: '', department: '', year: '', phone: '', password: '', role: '', aadharNo: '', academicYear: '', graduate: '', semester: '', section: '',
        fatherName: '', religion: '', category: '', address: '', district: '', state: '', pincode: ''
    })



    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('http://localhost:5000/fetchdata');
            setUsers(response.data);
        } catch (err) {
            setError('Failed to load user data. Please check the backend server and network connection.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user =>
        (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
        (user.registerNo?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
        (user.department?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
    )

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20 text-teal-600">
                <Loader2 className="w-8 h-8 animate-spin mr-3" />
                <span className="text-xl font-medium">Loading user data...</span>
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <div className="flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-3" />
                    <p className="font-bold">Data Error</p>
                </div>
                <p className="ml-8">{error}</p>
            </div>
        )
    }

    if (users.length === 0 && searchTerm === '') {
        return (
            <div className="text-center py-20">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-gray-700">No Users Found</h2>
                <p className="text-gray-500">The database returned an empty list of users.</p>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="mt-6 flex items-center gap-2 mx-auto bg-teal-600 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-teal-700 transition"
                >
                    <Plus className="w-5 h-5" />
                    Add First User
                </button>
            </div>
        );
    }

    const handleAddUser = async (e) => {

        e.preventDefault()

        try {
            const response = await axios.post('http://localhost:5000/addUser', formData);
        } catch (error) {
            console.log('Error in adding user:', error)
        }
    }

    const handleInputChange = (e) => {

        const { name, value } = e.target;

        setFormData({ ...formData, [name]: value })
        console.log(formData)
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8">

            <h1 className="text-3xl font-extrabold text-gray-800 mb-6 border-b pb-4">
                User Management
            </h1>

            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                {/* Search Input */}
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name, Reg No, or Dept..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                    />
                </div>

                {/* Add New User Button */}
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 bg-teal-600 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-teal-700 transition w-full sm:w-auto justify-center"
                >
                    <Plus className="w-5 h-5" />
                    Add New User
                </button>
            </div>

            {/* User Table */}
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
                                            onClick={() => handleEdit(user)}
                                            className="text-teal-600 hover:text-teal-900 mx-2 p-1 rounded-full hover:bg-teal-100 transition"
                                        >
                                            <Edit2 className="w-5 h-5 inline" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user.registerNo)}
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

            {/* Add User Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
                    {/* Added max-h-[90vh] and flex flex-col */}
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col relative">

                        {/* Header - Stays Fixed at Top */}
                        <div className="p-6 border-b">
                            <button
                                onClick={() => setIsAddModalOpen(false)} // Ensure you have a close handler
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-6 h-6" />
                            </button>
                            <h2 className="text-2xl font-bold text-gray-800">
                                Add New User
                            </h2>
                        </div>

                        {/* Scrollable Content Area */}
                        <div className="overflow-y-auto p-6 flex-1 custom-scrollbar">
                            {/* Error Message UI */}
                            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4 text-sm">
                                <p className="font-medium">Error message goes here</p>
                            </div>

                            <form id="addUserForm" className="space-y-6" onSubmit={handleAddUser}>
                                {/* Credentials & Role */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Password <span className="text-red-500">*</span>
                                        </label>
                                        <input name="password" type="password" onChange={handleInputChange} value={formData.password} placeholder="••••••••" className="w-full border border-gray-300 rounded-md p-2" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Role <span className="text-red-500">*</span>
                                        </label>
                                        <select name="role" onChange={handleInputChange} value={formData.role} className="w-full border border-gray-300 rounded-md p-2">
                                            <option value="">Select Role</option>
                                            <option value="student">Student</option>
                                            <option value="admin">Admin</option>
                                            <option value="faculty">Faculty</option>
                                        </select>
                                    </div>
                                </div>

                                <hr />

                                {/* Identity & Basic Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Register No. *</label>
                                        <input name='registerNo' onChange={handleInputChange} value={formData.registerNo} type="text" className="w-full border border-gray-300 rounded-md p-2" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Aadhar No.</label>
                                        <input name='aadharNo' onChange={handleInputChange} value={formData.aadharNo} type="text" className="w-full border border-gray-300 rounded-md p-2" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                                        <input name='name' onChange={handleInputChange} value={formData.name} type="text" className="w-full border border-gray-300 rounded-md p-2" />
                                    </div>
                                </div>

                                {/* Academic Details */}
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                                        <input name='department' onChange={handleInputChange} value={formData.department} type="text" className="w-full border border-gray-300 rounded-md p-2" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
                                        <input name='academicYear' onChange={handleInputChange} value={formData.academicYear} type="text" placeholder="2023-27" className="w-full border border-gray-300 rounded-md p-2" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Graduate (UG/PG)</label>
                                        <select name='graduate' onChange={handleInputChange} value={formData.graduate} className="w-full border border-gray-300 rounded-md p-2">
                                            <option value="UG">UG</option>
                                            <option value="PG">PG</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                                        <input name='year' onChange={handleInputChange} value={formData.year} type="number" className="w-full border border-gray-300 rounded-md p-2" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                                        <input name='semester' onChange={handleInputChange} value={formData.semester} type="number" className="w-full border border-gray-300 rounded-md p-2" />
                                    </div>
                                </div>

                                {/* Personal Details */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                                        <input name='section' onChange={handleInputChange} value={formData.section} type="text" className="w-full border border-gray-300 rounded-md p-2" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone No</label>
                                        <input name='phone' onChange={handleInputChange} value={formData.phone} type="tel" className="w-full border border-gray-300 rounded-md p-2" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Father's Name</label>
                                        <input name='fatherName' onChange={handleInputChange} value={formData.fatherName} type="text" className="w-full border border-gray-300 rounded-md p-2" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Religion</label>
                                        <input name='religion' onChange={handleInputChange} value={formData.religion} type="text" className="w-full border border-gray-300 rounded-md p-2" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Category (Caste)</label>
                                        <input name='category' onChange={handleInputChange} value={formData.category} type="text" className="w-full border border-gray-300 rounded-md p-2" />
                                    </div>
                                </div>

                                {/* Address Details */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                        <textarea name='address' onChange={handleInputChange} value={formData.address} rows="2" className="w-full border border-gray-300 rounded-md p-2" placeholder="Street, House No..."></textarea>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <input name='district' onChange={handleInputChange} value={formData.district} type="text" placeholder="District" className="w-full border border-gray-300 rounded-md p-2" />
                                        <input name='state' onChange={handleInputChange} value={formData.state} type="text" placeholder="State" className="w-full border border-gray-300 rounded-md p-2" />
                                        <input name='pincode' onChange={handleInputChange} value={formData.pincode} type="text" placeholder="Pincode" className="w-full border border-gray-300 rounded-md p-2" />
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Footer - Stays Fixed at Bottom */}
                        <div className="p-6 border-t bg-gray-50 flex justify-end rounded-b-lg">
                            <button
                                type="button"
                                onClick={() => setIsAddModalOpen(false)}
                                className="mr-3 px-6 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                            >
                                Cancel
                            </button>
                            <button
                                form="addUserForm" // Connects button to the form inside the scroll area
                                type="submit"
                                className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-md transition"
                            >
                                <Plus className="w-5 h-5" />
                                Save User
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    )
}

export default UserManagement;