import React from 'react'
import { Plus, X } from 'lucide-react';


function AddNewUser({ isAddModalOpen, setIsAddModalOpen, formData, handleInputChange, handleAddUser }) {

    return (
        <div>
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
                    {/* Added max-h-[90vh] and flex flex-col */}
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col relative">

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
                                form="addUserForm" 
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

export default AddNewUser