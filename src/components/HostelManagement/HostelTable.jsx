import React from 'react';
import { Edit3, Trash2, MapPin, DoorOpen, User, Hash, Building2 } from 'lucide-react';

function HostelTable({ filteredHostels, searchTerm, onEdit, onDelete }) {
    return (
        <div className="w-full py-6">
            {filteredHostels.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredHostels.map((hostel, index) => (
                        <div 
                            key={hostel._id || index}
                            className="group relative bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-xl hover:shadow-teal-500/5 hover:border-teal-500/30 transition-all duration-300"
                        >
                            {/* --- TOP SECTION: IDENTITY --- */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center shadow-lg shadow-slate-200">
                                        <Building2 className="w-6 h-6 text-teal-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800 leading-tight group-hover:text-teal-600 transition-colors">
                                            {hostel.hostelName}
                                        </h3>
                                        <span className="flex items-center text-xs font-medium text-slate-400 mt-1 uppercase tracking-wider">
                                            <Hash className="w-3 h-3 mr-1" /> {hostel.hostelId}
                                        </span>
                                    </div>
                                </div>
                                
                                {/* Quick Action Menu */}
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => onEdit(hostel)}
                                        className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                                    >
                                        <Edit3 className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => onDelete(hostel)}
                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* --- MIDDLE SECTION: CONFIGURATION --- */}
                            <div className="grid grid-cols-2 gap-3 py-4 border-y border-slate-50">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-slate-50 rounded-md">
                                        <MapPin className="w-4 h-4 text-slate-500" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Location</p>
                                        <p className="text-sm font-semibold text-slate-700 truncate">{hostel.location}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-slate-50 rounded-md">
                                        <DoorOpen className="w-4 h-4 text-slate-500" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Capacity</p>
                                        <p className="text-sm font-semibold text-slate-700">{hostel.totalRooms} Rooms</p>
                                    </div>
                                </div>
                            </div>

                            {/* --- BOTTOM SECTION: MANAGEMENT --- */}
                            <div className="mt-4 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-slate-600">
                                    <div className="w-7 h-7 rounded-full bg-teal-50 flex items-center justify-center border border-teal-100">
                                        <User className="w-4 h-4 text-teal-600" />
                                    </div>
                                    <span className="text-sm font-bold">{hostel.wardenName}</span>
                                </div>
                                <div className="px-2.5 py-1 bg-slate-50 rounded-md border border-slate-100">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* --- EMPTY STATE --- */
                <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
                        <Building2 className="w-8 h-8 text-slate-200" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">No hostels found</h3>
                    <p className="text-slate-400 mt-1 text-center max-w-xs">
                        No records match <span className="text-teal-600 font-bold">"{searchTerm}"</span>.
                    </p>
                </div>
            )}
        </div>
    );
}

export default HostelTable;