import React from 'react'
import { Search, Plus } from 'lucide-react';

function SearchInput({ searchTerm,setSearchTerm,setIsAddModalOpen }) {
    return (
        <div>
            <h1 className="text-3xl font-extrabold text-gray-800 mb-6 border-b pb-4">
                User Management
            </h1>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                {/* Search Input */}
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name, Reg No, or Dept..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                    />
                </div>

                {/* Add New User Button */}
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 bg-teal-600 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-teal-700 transition w-full sm:w-auto justify-center"
                >
                    <Plus className="w-5 h-5" />
                    Add New User
                </button>
            </div>
        </div>
    )
}

export default SearchInput