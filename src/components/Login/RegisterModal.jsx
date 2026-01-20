import React, { useState } from "react";
import axios from "axios";
import {
    Plus,
    X,
    User,
    ShieldCheck,
    Phone,
    GraduationCap,
    Globe
} from "lucide-react";

export default function RegisterModal({ isOpen, onClose }) {

    const [formData, setFormData] = useState({
        registerNo: "",
        password: "",
        role: "student",
        name: "",
        phone: "",
        aadharNo: "",

        department: "",
        year: "",
        semester: "",
        section: "",
        academicYear: "",
        graduate: "",

        parentName: "",
        religion: "",
        category: "",

        address: "",
        state: "",
        district: "",
        pincode: ""
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/addUser", formData);
            alert("Account created successfully");
            onClose();
        } catch (err) {
            alert(err.response?.data?.message || "Registration failed");
        }
    };

    if (!isOpen) return null;

    const InputLabel = ({ label, required }) => (
        <label className="flex items-center gap-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
            {label} {required && <span className="text-red-500 text-lg">*</span>}
        </label>
    );

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-6">
            <div className="bg-[#fcfcfd] rounded-3xl shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden">

                {/* HEADER */}
                <div className="px-10 py-7 bg-white border-b flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center">
                            <Plus className="w-6 h-6 text-teal-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-800">
                                User Registration
                            </h2>
                            <p className="text-sm text-slate-400">
                                Complete user profile & credentials
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose}>
                        <X className="w-6 h-6 text-slate-400 hover:text-slate-600" />
                    </button>
                </div>

                {/* FORM */}
                <div className="overflow-y-auto p-10 flex-1">
                    <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-8">

                        {/* ACCESS */}
                        <div className="col-span-12 lg:col-span-4">
                            <div className="flex items-center gap-2 mb-4">
                                <ShieldCheck className="text-teal-500" />
                                <h3 className="font-bold text-slate-700">Access Control</h3>
                            </div>
                            <div className="bg-white p-6 rounded-2xl space-y-4">
                                <div>
                                    <InputLabel label="Role" required />
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-200 rounded-xl px-4 py-3"
                                    >
                                        <option value="student">Student</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                <div>
                                    <InputLabel label="Password" required />
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-200 rounded-xl px-4 py-3 "
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* IDENTITY */}
                        <div className="col-span-12 lg:col-span-8">
                            <div className="flex items-center gap-2 mb-4">
                                <GraduationCap className="text-teal-500" />
                                <h3 className="font-bold text-slate-700">Primary Information</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4 bg-white p-6 rounded-2xl">
                                <div className="col-span-2">
                                    <InputLabel label="Full Name" required />
                                    <input name="name" value={formData.name} onChange={handleInputChange}
                                        className="w-full bg-slate-200 rounded-xl px-4 py-3" />
                                </div>
                                <div>
                                    <InputLabel label="Register No" required />
                                    <input name="registerNo" value={formData.registerNo} onChange={handleInputChange}
                                        className="w-full bg-slate-200 rounded-xl px-4 py-3" />
                                </div>
                                <div>
                                    <InputLabel label="Aadhar No" required />
                                    <input name="aadharNo" value={formData.aadharNo} onChange={handleInputChange}
                                        className="w-full bg-slate-200 rounded-xl px-4 py-3" />
                                </div>
                                <div>
                                    <InputLabel label="Department" required />
                                    <input name="department" value={formData.department} onChange={handleInputChange}
                                        className="w-full bg-slate-200 rounded-xl px-4 py-3" />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <InputLabel label="Year" required />
                                        <input name='year' onChange={handleInputChange} value={formData.year} type="number" className="w-full bg-slate-200 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-teal-500/20" />
                                    </div>
                                    <div>
                                        <InputLabel label="Sem" required />
                                        <input name='semester' onChange={handleInputChange} value={formData.semester} type="number" className="w-full bg-slate-200 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-teal-500/20" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* PERSONAL */}
                        <div className="col-span-12">
                            <div className="flex items-center gap-2 mb-4">
                                <User className="text-teal-500" />
                                <h3 className="font-bold text-slate-700">Personal Details</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-white p-8 rounded-3xl border border-slate-200/50">
                                <div>
                                    <InputLabel label="Father's Name" required />
                                    <input name='fatherName' onChange={handleInputChange} value={formData.fatherName} type="text" className="w-full bg-slate-200 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-teal-500 outline-none" />
                                </div>
                                <div>
                                    <InputLabel label="Religion" required />
                                    <input name='religion' onChange={handleInputChange} value={formData.religion} type="text" className="w-full bg-slate-200 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-teal-500 outline-none" />
                                </div>
                                <div>
                                    <InputLabel label="Caste / Category" required />
                                    <input name='category' onChange={handleInputChange} value={formData.category} type="text" className="w-full bg-slate-200 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-teal-500 outline-none" />
                                </div>
                                <div>
                                    <InputLabel label="Phone Contact" required />
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                        <input name='phone' onChange={handleInputChange} value={formData.phone} type="tel" className="w-full bg-slate-200 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:border-teal-500 outline-none" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ADDRESS */}
                        <div className="col-span-12">
                            <div className="flex items-center gap-2 mb-4">
                                <Globe className="text-teal-500" />
                                <h3 className="font-bold text-slate-700">Address</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4 bg-white p-6 rounded-2xl">
                                <textarea name="address" placeholder="Address" rows="3"
                                    onChange={handleInputChange}
                                    className="bg-slate-200 rounded-xl px-4 py-3 col-span-2" />
                            </div>
                            <div className="col-span-12 lg:col-span-6 grid grid-cols-3 gap-4">
                                <div>
                                    <InputLabel label="District" required />
                                    <input name='district' onChange={handleInputChange} value={formData.district} type="text" className="w-full bg-slate-200 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-teal-500/20" />
                                </div>
                                <div>
                                    <InputLabel label="State" required />
                                    <input name='state' onChange={handleInputChange} value={formData.state} type="text" className="w-full bg-slate-200 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-teal-500/20" />
                                </div>
                                <div>
                                    <InputLabel label="Pincode" required />
                                    <input name='pincode' onChange={handleInputChange} value={formData.pincode} type="text" className="w-full bg-slate-200 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-teal-500/20" />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* FOOTER */}
                <div className="px-10 py-6 bg-white border-t flex justify-end gap-4">
                    <button onClick={onClose} className="text-slate-500 font-bold">
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="bg-slate-900 hover:bg-teal-600 text-white px-10 py-3 rounded-2xl font-bold"
                    >
                        Register User
                    </button>
                </div>
            </div>
        </div>
    );
}
