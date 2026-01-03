import React, { useEffect, useState } from 'react'
import { X, Save } from 'lucide-react'
import axios from 'axios'

function EditTable({ isEditModalOpen, setIsEditModalOpen, editUser }) {

    const [userEdit, setUserEdit] = useState({
        registerNo: '', name: '', department: '', year: '', phone: '',
        password: '', role: '', aadharNo: '', academicYear: '',
        graduate: '', semester: '', section: '',
        fatherName: '', religion: '', category: '',
        address: '', district: '', state: '', pinCode: ''
    })

    useEffect(() => {
        if (editUser) setUserEdit(editUser)
    }, [editUser])

    const handleChange = (e) => {
        const { name, value } = e.target
        setUserEdit({ ...userEdit, [name]: value })
    }

    const handleUpdateUser = async (e) => {
        e.preventDefault()
        try {
            await axios.put('http://localhost:5000/updateUser', userEdit)
            setIsEditModalOpen(false)
        } catch (err) {
            console.error('Update error : ', err)
        }
    }

    return (
        <>
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
                    {/* Main Modal Container */}
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col relative">

                        {/* Header - Stays Fixed at Top */}
                        <div className="p-6 border-b">
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-6 h-6" />
                            </button>
                            <h2 className="text-2xl font-bold text-gray-800">
                                Edit User Details
                            </h2>
                        </div>

                        {/* Scrollable Content Area */}
                        <div className="overflow-y-auto p-6 flex-1 custom-scrollbar">
                            <form id="editUserForm" className="space-y-6" onSubmit={handleUpdateUser}>

                                {/* Credentials & Role */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Password <span className="text-gray-400 text-xs">(Leave blank to keep current)</span>
                                        </label>
                                        <input
                                            name="password"
                                            type="password"
                                            onChange={handleChange}
                                            value={userEdit.password || ''}
                                            placeholder="••••••••"
                                            className="w-full border border-gray-300 rounded-md p-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Role <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="role"
                                            onChange={handleChange}
                                            value={userEdit.role}
                                            className="w-full border border-gray-300 rounded-md p-2"
                                        >
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
                                        <input name='registerNo' onChange={handleChange} readOnly value={userEdit.registerNo} type="text" className="w-full border border-gray-300 rounded-md p-2" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Aadhar No.</label>
                                        <input name='aadharNo' onChange={handleChange} value={userEdit.aadharNo} type="text" className="w-full border border-gray-300 rounded-md p-2" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                                        <input name='name' onChange={handleChange} value={userEdit.name} type="text" className="w-full border border-gray-300 rounded-md p-2" />
                                    </div>
                                </div>

                                {/* Academic Details */}
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                                        <input name='department' onChange={handleChange} value={userEdit.department} type="text" className="w-full border border-gray-300 rounded-md p-2" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
                                        <input name='academicYear' onChange={handleChange} value={userEdit.academicYear} type="text" placeholder="2023-27" className="w-full border border-gray-300 rounded-md p-2" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Graduate (UG/PG)</label>
                                        <select name='graduate' onChange={handleChange} value={userEdit.graduate} className="w-full border border-gray-300 rounded-md p-2">
                                            <option value="UG">UG</option>
                                            <option value="PG">PG</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                                        <input name='year' onChange={handleChange} value={userEdit.year} type="number" className="w-full border border-gray-300 rounded-md p-2" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                                        <input name='semester' onChange={handleChange} value={userEdit.semester} type="number" className="w-full border border-gray-300 rounded-md p-2" />
                                    </div>
                                </div>

                                {/* Personal & Address Details */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                                        <input name='section' onChange={handleChange} value={userEdit.section} type="text" className="w-full border border-gray-300 rounded-md p-2" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone No</label>
                                        <input name='phone' onChange={handleChange} value={userEdit.phone} type="tel" className="w-full border border-gray-300 rounded-md p-2" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Father's Name</label>
                                        <input name='fatherName' onChange={handleChange} value={userEdit.fatherName} type="text" className="w-full border border-gray-300 rounded-md p-2" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Religion</label>
                                        <input name='religion' onChange={handleChange} value={userEdit.religion} type="text" className="w-full border border-gray-300 rounded-md p-2" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Category (Caste)</label>
                                        <input name='category' onChange={handleChange} value={userEdit.category} type="text" className="w-full border border-gray-300 rounded-md p-2" />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                        <textarea name='address' onChange={handleChange} value={userEdit.address} rows="2" className="w-full border border-gray-300 rounded-md p-2" placeholder="Street, House No..."></textarea>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <input name='district' onChange={handleChange} value={userEdit.district} type="text" placeholder="District" className="w-full border border-gray-300 rounded-md p-2" />
                                        <input name='state' onChange={handleChange} value={userEdit.state} type="text" placeholder="State" className="w-full border border-gray-300 rounded-md p-2" />
                                        <input name='pincode' onChange={handleChange} value={userEdit.pinCode} type="text" placeholder="Pincode" className="w-full border border-gray-300 rounded-md p-2" />
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Footer - Stays Fixed at Bottom */}
                        <div className="p-6 border-t bg-gray-50 flex justify-end rounded-b-lg">
                            <button
                                type="button"
                                onClick={() => setIsEditModalOpen(false)}
                                className="mr-3 px-6 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                            >
                                Cancel
                            </button>
                            <button
                                form="editUserForm"
                                type="submit"
                                onClick={handleUpdateUser}
                                className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-md transition"
                            >
                                <Save className="w-5 h-5" />
                                Update User
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </>
    )
}

export default EditTable
