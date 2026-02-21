import React from 'react';
import { Edit3, Trash2, Phone, GraduationCap, Hash, ArrowUpRight } from 'lucide-react';

function UserTable({ filteredUsers, searchTerm, onDelete, onEdit }) {
    
    const getInitials = (name) => {
        return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : '??';
    };

    return (
        <div className="w-full mt-6">
            {filteredUsers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredUsers.map((user, index) => (
                        <div 
                            key={user.registerNo || index}
                            className="group relative bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-xl hover:shadow-teal-500/5 hover:border-teal-500/30 transition-all duration-300"
                        >
                            {/* --- TOP SECTION: IDENTITY --- */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white font-bold shadow-lg shadow-teal-500/20">
                                        {getInitials(user.name)}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800 leading-tight group-hover:text-teal-600 transition-colors">
                                            {user.name}
                                        </h3>
                                        <span className="flex items-center text-xs font-medium text-slate-400 mt-1 uppercase tracking-wider">
                                            <Hash className="w-3 h-3 mr-1" /> {user.registerNo}
                                        </span>
                                    </div>
                                </div>
                                
                                {/* Quick Action Menu (Visible on Hover) */}
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => onEdit(user)}
                                        className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                                    >
                                        <Edit3 className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => onDelete(user)}
                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* --- MIDDLE SECTION: DETAILS --- */}
                            <div className="grid grid-cols-2 gap-3 py-4 border-y border-slate-50">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-slate-50 rounded-md">
                                        <GraduationCap className="w-4 h-4 text-slate-500" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Dept</p>
                                        <p className="text-sm font-semibold text-slate-700 truncate">{user.department}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-slate-50 rounded-md">
                                        <ArrowUpRight className="w-4 h-4 text-slate-500" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Year</p>
                                        <p className="text-sm font-semibold text-slate-700">{user.year}</p>
                                    </div>
                                </div>
                            </div>

                            {/* --- BOTTOM SECTION: CONTACT --- */}
                            <div className="mt-4 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-slate-500">
                                    <Phone className="w-4 h-4" />
                                    <span className="text-sm font-medium">{user.phone}</span>
                                </div>
                               
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* --- EMPTY STATE --- */
                <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
                        <Hash className="w-8 h-8 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">No results found</h3>
                    <p className="text-slate-400 mt-1 text-center max-w-xs">
                        We couldn't find anyone matching <span className="text-teal-600 font-bold">"{searchTerm}"</span>.
                    </p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="mt-6 text-sm font-bold text-teal-600 hover:underline"
                    >
                        Clear search filters
                    </button>
                </div>
            )}
        </div>
    );
}

export default UserTable;