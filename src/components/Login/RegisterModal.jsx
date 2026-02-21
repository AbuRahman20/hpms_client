import React, { useState } from "react";
import axios from "axios";
import { Plus, X, User, ShieldCheck, Phone, GraduationCap, Globe, Mail, MapPin, Calendar, Hash, Users, BookOpen, Lock, CreditCard, Home, Award } from "lucide-react";

export default function RegisterModal({ isOpen, onClose }) {

    const [formData, setFormData] = useState({
        registerNo: "",
        password: "",
        role: "student",
        name: "",
        email: "",
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
        pincode: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await axios.post("http://localhost:5000/addUser", formData);
            alert("Account created successfully");
            onClose();
        } catch (err) {
            alert(err.response?.data?.message || "Registration failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    const InputField = ({ label, name, type = "text", required = false, icon: Icon, placeholder = "", className = "", ...props }) => (
        <div className={`space-y-1.5 ${className}`}>
            <label className="flex items-center gap-1 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                {label}
                {required && <span className="text-red-500 text-sm">*</span>}
            </label>
            <div className="relative">
                {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />}
                <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    className={`
                        w-full bg-gray-50 border border-gray-200 rounded-xl 
                        ${Icon ? "pl-10" : "px-4"} py-2.5 text-sm
                        focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20
                        transition-all duration-200 outline-none
                        placeholder:text-gray-400
                    `}
                    required={required}
                    {...props}
                />
            </div>
        </div>
    );

    const SelectField = ({ label, name, options, required = false, icon: Icon, className = "" }) => (
        <div className={`space-y-1.5 ${className}`}>
            <label className="flex items-center gap-1 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                {label}
                {required && <span className="text-red-500 text-sm">*</span>}
            </label>
            <div className="relative">
                {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />}
                <select
                    name={name}
                    value={formData[name]}
                    onChange={handleInputChange}
                    className={`
                        w-full bg-gray-50 border border-gray-200 rounded-xl 
                        ${Icon ? "pl-10" : "px-4"} py-2.5 text-sm
                        focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20
                        transition-all duration-200 outline-none appearance-none
                        cursor-pointer
                    `}
                    required={required}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );

    const departments = [
        { value: "cse", label: "Computer Science Engineering" },
        { value: "ece", label: "Electronics & Communication" },
        { value: "eee", label: "Electrical & Electronics" },
        { value: "mech", label: "Mechanical Engineering" },
        { value: "civil", label: "Civil Engineering" },
        { value: "it", label: "Information Technology" },
    ];

    const years = [1, 2, 3, 4].map((y) => ({ value: y, label: `Year ${y}` }));
    const semesters = [1, 2, 3, 4, 5, 6, 7, 8].map((s) => ({ value: s, label: `Semester ${s}` }));
    const sections = ["A", "B", "C"].map((s) => ({ value: s, label: `Section ${s}` }));
    const categories = [
        { value: "general", label: "General" },
        { value: "obc", label: "OBC" },
        { value: "sc", label: "SC" },
        { value: "st", label: "ST" },
    ];

    const SectionHeader = ({ icon: Icon, title, description }) => (
        <div className="flex items-start gap-3 mb-6">
            <div className="p-2.5 bg-teal-50 rounded-xl">
                <Icon className="w-5 h-5 text-teal-600" />
            </div>
            <div>
                <h3 className="font-semibold text-gray-900">{title}</h3>
                <p className="text-sm text-gray-500">{description}</p>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[83vh] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
                {/* HEADER */}
                <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg shadow-teal-500/20 flex items-center justify-center">
                            <Plus className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Create New Account</h2>
                            <p className="text-sm text-gray-500">Fill in the details to register a new user</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* FORM */}
                <div className="overflow-y-auto flex-1 p-8">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Access Control */}
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                            <SectionHeader icon={ShieldCheck} title="Access Control" description="Configure user permissions and security" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <SelectField
                                    label="Role"
                                    name="role"
                                    icon={Users}
                                    options={[
                                        { value: "student", label: "Student" },
                                        { value: "teacher", label: "Teacher" },
                                        { value: "admin", label: "Administrator" },
                                    ]}
                                    required
                                />
                                <InputField label="Password" name="password" type="password" icon={Lock} placeholder="••••••••" required />
                            </div>
                        </div>

                        {/* Primary Information */}
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                            <SectionHeader icon={GraduationCap} title="Primary Information" description="Basic identification and academic details" />
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <InputField label="Full Name" name="name" icon={User} placeholder="John Doe" className="lg:col-span-2" required />
                                <InputField label="Register No" name="registerNo" icon={Hash} placeholder="2024001" required />
                                <InputField label="Email Address" name="email" type="email" icon={Mail} placeholder="john@college.edu" required />
                                <InputField label="Phone Number" name="phone" icon={Phone} placeholder="+91 98765 43210" required />
                                <InputField label="Aadhar Number" name="aadharNo" icon={CreditCard} placeholder="1234 5678 9012" required />
                                <SelectField label="Department" name="department" icon={BookOpen} options={departments} required />
                                <SelectField label="Year" name="year" icon={Calendar} options={years} required />
                                <SelectField label="Semester" name="semester" icon={Calendar} options={semesters} required />
                                <SelectField label="Section" name="section" icon={Users} options={sections} required />
                                <InputField label="Academic Year" name="academicYear" icon={Calendar} placeholder="2024-2025" required />
                            </div>
                        </div>

                        {/* Personal Details */}
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                            <SectionHeader icon={User} title="Personal Details" description="Additional personal information" />
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <InputField label="Father's Name" name="parentName" icon={User} placeholder="John Doe Sr." required />
                                <InputField label="Religion" name="religion" placeholder="Hindu / Muslim / Christian" required />
                                <SelectField label="Category" name="category" icon={Users} options={categories} required />
                                <InputField label="Graduate (Previous)" name="graduate" placeholder="B.Sc Computer Science" />
                            </div>
                        </div>

                        {/* Address Information */}
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                            <SectionHeader icon={MapPin} title="Address Information" description="Current residential address" />
                            <div className="space-y-6">
                                <InputField label="Address" name="address" icon={Home} placeholder="Street address, Building, Area" className="w-full" required />
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <InputField label="District" name="district" icon={MapPin} placeholder="District" required />
                                    <InputField label="State" name="state" placeholder="State" required />
                                    <InputField label="Pincode" name="pincode" placeholder="600001" required />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* FOOTER */}
                <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        <span className="text-red-500">*</span> Required fields
                    </p>
                    <div className="flex gap-3">
                        <button type="button" onClick={onClose} className="px-6 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                            Cancel
                        </button>
                        <button onClick={handleSubmit} disabled={isSubmitting} className="px-8 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-teal-600 to-teal-500 rounded-xl hover:from-teal-500 hover:to-teal-600 shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                "Register User"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}