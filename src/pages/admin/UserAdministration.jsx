import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Plus, Edit2, Trash2, Loader2, AlertTriangle, Users, X } from 'lucide-react';
import UserTable from '../../components/UserAdministration/UserTable';
import SearchInput from '../../components/UserAdministration/SearchInput';
import AddModal from '../../components/UserAdministration/AddModal';
import EditModal from '../../components/UserAdministration/EditModal';
import DeleteModal from '../../components/UserAdministration/DeleteModal';

function UserAdministration() {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteUser, setDeleteUser] = useState(null);

    const [formData, setFormData] = useState({
        registerNo: '', name: '', department: '', year: '', phone: '', password: '', role: '', aadharNo: '', academicYear: '', graduate: '', semester: '', section: '',
        fatherName: '', religion: '', category: '', address: '', district: '', state: '', pincode: ''
    })

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('http://localhost:5000/fetchdata');
            setUsers(response.data);
        } catch (err) {
            setError('Failed to load user data. Please check the backend server and network connection.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user =>
        (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
        (user.registerNo?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
        (user.department?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
    )

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20 text-teal-600">
                <Loader2 className="w-8 h-8 animate-spin mr-3" />
                <span className="text-xl font-medium">Loading user data...</span>
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <div className="flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-3" />
                    <p className="font-bold">Data Error</p>
                </div>
                <p className="ml-8">{error}</p>
            </div>
        )
    }

    if (users.length === 0 && searchTerm === '') {
        return (
            <div className="text-center py-20">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-gray-700">No Users Found</h2>
                <p className="text-gray-500">The database returned an empty list of users.</p>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="mt-6 flex items-center gap-2 mx-auto bg-teal-600 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-teal-700 transition"
                >
                    <Plus className="w-5 h-5" />
                    Add First User
                </button>
            </div>
        );
    }

    const handleAddUser = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post('http://localhost:5000/addUser', formData);
        } catch (error) {
            console.log('Error in adding user:', error)
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value })
    }

    return (
        <div className="">

            {/* {Search Input} */}
            <SearchInput
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                setIsAddModalOpen={setIsAddModalOpen}
            />

            {/* User Table */}
            <UserTable
                filteredUsers={filteredUsers}
                searchTerm={searchTerm}
                onDelete={(user) => {
                    setIsDeleteModalOpen(true);
                    setDeleteUser(user);
                }}
                onEdit={(user) => {
                    setIsEditModalOpen(true)
                    setEditUser(user)
                }}

            />

            {/* Add User Modal */}
            <AddModal
                isAddModalOpen={isAddModalOpen}
                setIsAddModalOpen={setIsAddModalOpen}
                handleInputChange={handleInputChange}
                handleAddUser={handleAddUser}
                formData={formData}
            />

            {/* Edit User Modal */}
            <EditModal
                isEditModalOpen={isEditModalOpen}
                setIsEditModalOpen={setIsEditModalOpen}
                editUser={editUser}
            />

            {/* Delete Modal */}
            <DeleteModal
                isDeleteModalOpen={isDeleteModalOpen}
                setIsDeleteModalOpen={setIsDeleteModalOpen}
                deleteUser={deleteUser}
            />

        </div>
    )
}

export default UserAdministration;