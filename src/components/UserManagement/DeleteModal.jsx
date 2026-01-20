import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import axios from 'axios';

function DeleteModal({ isDeleteModalOpen, setIsDeleteModalOpen, deleteUser }) {
    
    const handleDeleteItem = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/deleteUser', { 
                registerNo: deleteUser.registerNo 
            });
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.log('Error in deleting user:', error);
        }
    };

    if (!isDeleteModalOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 transition-all">
            <div className="bg-white rounded-[2rem] shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 animate-in zoom-in-95 fade-in duration-200">
                
                {/* Visual Danger Header */}
                <div className="relative h-2 bg-red-500 w-full" />
                
                <div className="p-8">
                    {/* Icon & Close Toggle */}
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center">
                            <AlertTriangle className="w-7 h-7 text-red-600" />
                        </div>
                        <button 
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="space-y-3">
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                            Confirm Deletion
                        </h2>
                        <p className="text-slate-500 leading-relaxed">
                            You are about to permanently remove <span className="font-bold text-slate-900 underline decoration-red-200 underline-offset-4">{deleteUser?.name}</span> from the system database.
                        </p>
                    </div>

                    {/* Meta Info Box */}
                    <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Registration ID</span>
                            <span className="text-sm font-mono font-bold text-slate-700">{deleteUser?.registerNo}</span>
                        </div>
                    </div>

                    {/* Warning Note */}
                    <div className="mt-6 flex items-start gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                        <div className="mt-0.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        </div>
                        <p className="text-xs text-amber-700 font-medium leading-relaxed">
                            This action is irreversible. All associated academic records and system logs for this user will be archived.
                        </p>
                    </div>

                    {/* Professional Action Grid */}
                    <div className="mt-8 grid grid-cols-2 gap-3">
                        <button
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="px-6 py-3.5 text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-2xl transition-all"
                        >
                            Keep Record
                        </button>
                        <button
                            onClick={handleDeleteItem}
                            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-red-600 text-white rounded-2xl text-sm font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200 active:scale-95"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete Profile
                        </button>
                    </div>
                </div>

                {/* Bottom Audit Footer */}
                <div className="bg-slate-50 px-8 py-4 border-t border-slate-100">
                    <p className="text-[10px] text-center font-bold text-slate-400 uppercase tracking-[0.2em]">
                        System Administration Protocol
                    </p>
                </div>
            </div>
        </div>
    );
}

export default DeleteModal;