import React, { useEffect, useState } from 'react';
import { X, Save, User, ShieldCheck, Phone, GraduationCap, Globe } from 'lucide-react';
import axios from 'axios';

function EditTable({ isEditModalOpen, setIsEditModalOpen, editUser }) {
    const [userEdit, setUserEdit] = useState({
        registerNo: '', name: '', department: '', year: '', phone: '',
        password: '', role: '', aadharNo: '', academicYear: '',
        graduate: '', semester: '', section: '',
        fatherName: '', religion: '', category: '',
        address: '', district: '', state: '', pincode: '' // Fixed case to match form
    });

    useEffect(() => {
        if (editUser) setUserEdit(editUser);
    }, [editUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserEdit({ ...userEdit, [name]: value });
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            await axios.put('http://localhost:5000/updateUser', userEdit);
            setIsEditModalOpen(false);
        } catch (err) {
            console.error('Update error : ', err);
        }
    };

    if (!isEditModalOpen) return null;

    const InputLabel = ({ label, required, note }) => (
        <label className="flex items-center gap-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
            {label} {required && <span className="text-red-500">*</span>}
            {note && <span className="lowercase font-normal text-slate-400 ml-1">({note})</span>}
        </label>
    );

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-6 transition-all">
            <div className="bg-[#fcfcfd] rounded-3xl shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden border border-white/20 animate-in zoom-in-95 duration-300">
                
                {/* --- HEADER (MATCHES ADD MODAL) --- */}
                <div className="px-10 py-7 bg-white border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center">
                            <User className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Edit Profile</h2>
                            <p className="text-sm text-slate-400 font-medium font-sans">Updating records for: <span className="text-teal-600 font-bold">{userEdit.registerNo}</span></p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsEditModalOpen(false)}
                        className="p-2 hover:bg-slate-100 rounded-xl transition-all group"
                    >
                        <X className="w-6 h-6 text-slate-300 group-hover:text-slate-600" />
                    </button>
                </div>

                {/* --- DATA ENTRY GRID --- */}
                <div className="overflow-y-auto p-10 flex-1 custom-scrollbar">
                    <form id="editUserForm" onSubmit={handleUpdateUser} className="grid grid-cols-12 gap-x-8 gap-y-10">
                        
                        {/* ZONE A: SECURITY & ACCESS */}
                        <div className="col-span-12 lg:col-span-4 space-y-6">
                            <div className="flex items-center gap-2 mb-4">
                                <ShieldCheck className="w-5 h-5 text-teal-500" />
                                <h3 className="font-bold text-slate-700">Access Control</h3>
                            </div>
                            <div className="space-y-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                <div>
                                    <InputLabel label="Role Allocation" required />
                                    <select name="role" onChange={handleChange} value={userEdit.role} className="w-full bg-slate-200 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-teal-500/20 cursor-pointer">
                                        <option value="student">Student</option>
                                        <option value="admin">Admin</option>
                                        <option value="faculty">Faculty</option>
                                    </select>
                                </div>
                                <div>
                                    <InputLabel label="Password" note="Leave blank to keep current" />
                                    <input name="password" type="password" onChange={handleChange} value={userEdit.password} placeholder="••••••••" className="w-full bg-slate-200 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-teal-500/20" />
                                </div>
                            </div>
                        </div>

                        {/* ZONE B: IDENTITY & ACADEMICS */}
                        <div className="col-span-12 lg:col-span-8 space-y-6">
                            <div className="flex items-center gap-2 mb-4">
                                <GraduationCap className="w-5 h-5 text-teal-500" />
                                <h3 className="font-bold text-slate-700">Academic & Identity</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                <div className="col-span-2">
                                    <InputLabel label="Legal Full Name" required />
                                    <input name='name' onChange={handleChange} value={userEdit.name} type="text" className="w-full bg-slate-200 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-teal-500/20" />
                                </div>
                                <div>
                                    <InputLabel label="Registration No." required />
                                    <input name='registerNo' readOnly value={userEdit.registerNo} type="text" className="w-full bg-slate-200 border-none rounded-xl px-4 py-3 text-sm font-mono text-slate-500 cursor-not-allowed" />
                                </div>
                                <div>
                                    <InputLabel label="Aadhar Reference" />
                                    <input name='aadharNo' onChange={handleChange} value={userEdit.aadharNo} type="text" className="w-full bg-slate-200 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-teal-500/20" />
                                </div>
                                <div>
                                    <InputLabel label="Department" required />
                                    <input name='department' onChange={handleChange} value={userEdit.department} type="text" className="w-full bg-slate-200 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-teal-500/20" />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <InputLabel label="Year" />
                                        <input name='year' onChange={handleChange} value={userEdit.year} type="number" className="w-full bg-slate-200 border-none rounded-xl px-4 py-3 text-sm" />
                                    </div>
                                    <div>
                                        <InputLabel label="Sem" />
                                        <input name='semester' onChange={handleChange} value={userEdit.semester} type="number" className="w-full bg-slate-200 border-none rounded-xl px-4 py-3 text-sm" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ZONE C: PERSONAL BIODATA */}
                        <div className="col-span-12 space-y-6 pt-4">
                            <div className="flex items-center gap-2">
                                <User className="w-5 h-5 text-teal-500" />
                                <h3 className="font-bold text-slate-700">Bio-Metrics & Personal Records</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-white p-8 rounded-3xl border border-slate-200/50">
                                <div>
                                    <InputLabel label="Father's Name" />
                                    <input name='fatherName' onChange={handleChange} value={userEdit.fatherName} type="text" className="w-full bg-slate-200 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-teal-500 outline-none" />
                                </div>
                                <div>
                                    <InputLabel label="Religion" />
                                    <input name='religion' onChange={handleChange} value={userEdit.religion} type="text" className="w-full bg-slate-200 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-teal-500 outline-none" />
                                </div>
                                <div>
                                    <InputLabel label="Caste / Category" />
                                    <input name='category' onChange={handleChange} value={userEdit.category} type="text" className="w-full bg-slate-200 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-teal-500 outline-none" />
                                </div>
                                <div>
                                    <InputLabel label="Phone Contact" />
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                        <input name='phone' onChange={handleChange} value={userEdit.phone} type="tel" className="w-full bg-slate-200 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:border-teal-500 outline-none" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ZONE D: GEOGRAPHIC DATA */}
                        <div className="col-span-12 space-y-6 pt-4">
                            <div className="flex items-center gap-2">
                                <Globe className="w-5 h-5 text-teal-500" />
                                <h3 className="font-bold text-slate-700">Residency & Address</h3>
                            </div>
                            <div className="grid grid-cols-12 gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                <div className="col-span-12 lg:col-span-6">
                                    <InputLabel label="Permanent Address" />
                                    <textarea name='address' onChange={handleChange} value={userEdit.address} rows="3" className="w-full bg-slate-200 border-none rounded-xl px-4 py-3 text-sm resize-none focus:ring-2 focus:ring-teal-500/20"></textarea>
                                </div>
                                <div className="col-span-12 lg:col-span-6 grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <InputLabel label="District" />
                                        <input name='district' onChange={handleChange} value={userEdit.district} type="text" className="w-full bg-slate-200 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-teal-500/20" />
                                    </div>
                                    <div>
                                        <InputLabel label="State" />
                                        <input name='state' onChange={handleChange} value={userEdit.state} type="text" className="w-full bg-slate-200 border-none rounded-xl px-4 py-3 text-sm" />
                                    </div>
                                    <div>
                                        <InputLabel label="Pincode" />
                                        <input name='pincode' onChange={handleChange} value={userEdit.pincode} type="text" className="w-full bg-slate-200 border-none rounded-xl px-4 py-3 text-sm" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* --- FOOTER (MATCHES ADD MODAL) --- */}
                <div className="px-10 py-6 bg-white border-t border-slate-100 flex items-center justify-between">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Changes will be logged in the system audit</p>
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => setIsEditModalOpen(false)}
                            className="px-8 py-3 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            form="editUserForm" 
                            type="submit"
                            className="flex items-center gap-2 bg-slate-900 text-white px-10 py-3 rounded-2xl text-sm font-bold hover:bg-teal-600 transition-all shadow-xl shadow-slate-200 active:scale-95"
                        >
                            <Save className="w-4 h-4" />
                            Update Record
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditTable;