import React from 'react';
import { Plus, X, User, BookOpen, MapPin, ShieldCheck, Phone, GraduationCap, Globe } from 'lucide-react';

function AddNewUser({ isAddModalOpen, setIsAddModalOpen, formData, handleInputChange, handleAddUser }) {
    if (!isAddModalOpen) return null;

    const InputLabel = ({ label, required }) => (
        <label className="flex items-center gap-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
            {label} {required && <span className="text-red-500 text-lg leading-none">*</span>}
        </label>
    );

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-6 transition-all">
            <div className="bg-[#fcfcfd] rounded-3xl shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden border border-white/20 animate-in zoom-in-95 duration-300">
                
                {/* --- STEALTH HEADER --- */}
                <div className="px-10 py-7 bg-white border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center">
                            <Plus className="w-6 h-6 text-teal-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight">System Registration</h2>
                            <p className="text-sm text-slate-400 font-medium font-sans">Initialize new user profile and access credentials</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsAddModalOpen(false)}
                        className="p-2 hover:bg-slate-100 rounded-xl transition-all group"
                    >
                        <X className="w-6 h-6 text-slate-300 group-hover:text-slate-600" />
                    </button>
                </div>

                {/* --- DATA ENTRY GRID --- */}
                <div className="overflow-y-auto p-10 flex-1 custom-scrollbar">
                    <form id="addUserForm" onSubmit={handleAddUser} className="grid grid-cols-12 gap-x-8 gap-y-10">
                        
                        {/* ZONE A: SECURITY & ACCESS */}
                        <div className="col-span-12 lg:col-span-4 space-y-6">
                            <div className="flex items-center gap-2 mb-4">
                                <ShieldCheck className="w-5 h-5 text-teal-500" />
                                <h3 className="font-bold text-slate-700">Access Control</h3>
                            </div>
                            <div className="space-y-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                <div>
                                    <InputLabel label="Role Allocation" required />
                                    <select name="role" onChange={handleInputChange} value={formData.role} className="w-full bg-slate-200 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-teal-500/20 transition-all cursor-pointer">
                                        <option value="">Select Role</option>
                                        <option value="student">Student</option>
                                        <option value="admin">Admin</option>
                                        <option value="faculty">Faculty</option>
                                    </select>
                                </div>
                                <div>
                                    <InputLabel label="System Password" required />
                                    <input name="password" type="password" onChange={handleInputChange} value={formData.password} placeholder="••••••••" className="w-full bg-slate-200 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-teal-500/20 transition-all" required />
                                </div>
                            </div>
                        </div>

                        {/* ZONE B: IDENTITY & ACADEMICS */}
                        <div className="col-span-12 lg:col-span-8 space-y-6">
                            <div className="flex items-center gap-2 mb-4">
                                <GraduationCap className="w-5 h-5 text-teal-500" />
                                <h3 className="font-bold text-slate-700">Primary Information</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                <div className="col-span-2">
                                    <InputLabel label="Legal Full Name" required />
                                    <input name='name' onChange={handleInputChange} value={formData.name} type="text" className="w-full bg-slate-200 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-teal-500/20" />
                                </div>
                                <div>
                                    <InputLabel label="Registration No." required />
                                    <input name='registerNo' onChange={handleInputChange} value={formData.registerNo} type="text" className="w-full bg-slate-200 border-none rounded-xl px-4 py-3 text-sm font-mono focus:ring-2 focus:ring-teal-500/20" />
                                </div>
                                <div>
                                    <InputLabel label="Aadhar Reference" required/>
                                    <input name='aadharNo' onChange={handleInputChange} value={formData.aadharNo} type="text" className="w-full bg-slate-200 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-teal-500/20" />
                                </div>
                                <div className="col-span-2 md:col-span-1">
                                    <InputLabel label="Department" required />
                                    <input name='department' onChange={handleInputChange} value={formData.department} type="text" className="w-full bg-slate-200 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-teal-500/20" />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <InputLabel label="Year" required />
                                        <input name='year' onChange={handleInputChange} value={formData.year} type="number" className="w-full bg-slate-200 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-teal-500/20" />
                                    </div>
                                    <div>
                                        <InputLabel label="Sem" required/>
                                        <input name='semester' onChange={handleInputChange} value={formData.semester} type="number" className="w-full bg-slate-200 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-teal-500/20" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ZONE C: FULL ATTRIBUTE TABLE (PERSONAL) */}
                        <div className="col-span-12 space-y-6 pt-4">
                            <div className="flex items-center gap-2">
                                <User className="w-5 h-5 text-teal-500" />
                                <h3 className="font-bold text-slate-700">Bio-Metrics & Personal Records</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-white p-8 rounded-3xl border border-slate-200/50">
                                <div>
                                    <InputLabel label="Father's Name" required/>
                                    <input name='fatherName' onChange={handleInputChange} value={formData.fatherName} type="text" className="w-full bg-slate-200 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-teal-500 outline-none" />
                                </div>
                                <div>
                                    <InputLabel label="Religion" required/>
                                    <input name='religion' onChange={handleInputChange} value={formData.religion} type="text" className="w-full bg-slate-200 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-teal-500 outline-none" />
                                </div>
                                <div>
                                    <InputLabel label="Caste / Category" required/>
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

                        {/* ZONE D: GEOGRAPHIC DATA */}
                        <div className="col-span-12 space-y-6 pt-4">
                            <div className="flex items-center gap-2">
                                <Globe className="w-5 h-5 text-teal-500" />
                                <h3 className="font-bold text-slate-700">Residency & Address</h3>
                            </div>
                            <div className="grid grid-cols-12 gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                <div className="col-span-12 lg:col-span-6">
                                    <InputLabel label="Permanent Address" required />
                                    <textarea name='address' onChange={handleInputChange} value={formData.address} rows="3" className="w-full bg-slate-200 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-teal-500/20 resize-none" placeholder="Door No, Street name..."></textarea>
                                </div>
                                <div className="col-span-12 lg:col-span-6 grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
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
                        </div>
                    </form>
                </div>

                {/* --- ACTION FOOTER --- */}
                <div className="px-10 py-6 bg-white border-t border-slate-100 flex items-center justify-between">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Double check information before submission</p>
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => setIsAddModalOpen(false)}
                            className="px-8 py-3 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
                        >
                            Discard
                        </button>
                        <button
                            form="addUserForm" 
                            type="submit"
                            className="bg-slate-900 text-white px-10 py-3 rounded-2xl text-sm font-bold hover:bg-teal-600 transition-all shadow-xl shadow-slate-200 active:scale-95"
                        >
                            Finalize Profile Registration
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddNewUser;