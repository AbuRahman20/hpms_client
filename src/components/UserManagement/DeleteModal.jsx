import React from 'react'
import { AlertTriangle } from 'lucide-react';
import axios from 'axios';

function DeleteModal({ isDeleteModalOpen, setIsDeleteModalOpen, deleteUser }) {

    const handleDeleteItem = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/deleteUser', { registerNo: deleteUser.registerNo });
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.log('Error in deleting user:', error)
        }
    }

    return (
        <div>
            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-[60] p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6 animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <h3 className="text-lg font-bold text-center text-gray-900 mb-2">Confirm Delete</h3>
                        <p className="text-sm text-center text-gray-500 mb-6">
                            Are you sure you want to delete <span className="font-semibold text-gray-800">{deleteUser.name}</span>?
                            This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteItem}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default DeleteModal