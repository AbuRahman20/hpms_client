import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Home, Phone, UserCircle, Settings, LayoutDashboard, Users, Building2,DoorOpen,BedDouble     } from 'lucide-react';

export default function Layout() {
    const role = sessionStorage.getItem('role');

    const navClass = ({ isActive }) => {
        return `flex items-center gap-3 px-4 py-2.5 rounded-lg transition ${isActive
            ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`;
    }


    return (
        /* Change 1: h-screen and overflow-hidden on the wrapper prevents the whole page from scrolling */
        <div className="h-screen flex bg-gray-100 font-sans antialiased overflow-hidden">

            {/* SIDEBAR */}
            <aside className="w-72 bg-gray-900 text-gray-200 shadow-2xl hidden md:flex flex-col p-6 flex-shrink-0">
                <div className="flex items-center gap-3 mb-10 pb-4 border-b border-gray-700">
                    <UserCircle className="w-10 h-10 text-teal-400" />
                    <div>
                        <h1 className="text-lg font-bold tracking-tight text-white">HostelSphere</h1>
                        <p className="text-xs text-gray-400">Welcome {role}</p>
                    </div>
                </div>

                <nav className="flex-1">
                    <ul className="space-y-2 text-sm">


                        {role === 'admin' && (
                            <>
                                <li>
                                    <NavLink
                                        to="/layout/home"
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 px-4 py-2.5 rounded-lg transition ${isActive
                                                ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                                                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                            }`
                                        }
                                    >
                                        <LayoutDashboard className="w-5 h-5" />
                                        Dashboard
                                    </NavLink>
                                </li>

                                <li>
                                    <NavLink
                                        to="/layout/contact"
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 px-4 py-2.5 rounded-lg transition ${isActive
                                                ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                                                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                            }`
                                        }
                                    >
                                        <Phone className="w-5 h-5" />
                                        Contact Support
                                    </NavLink>
                                </li>

                                <li>
                                    <NavLink
                                        to="/layout/userManagement"
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 px-4 py-2.5 rounded-lg transition ${isActive
                                                ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                                                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                            }`
                                        }
                                    >
                                        <Users className="w-5 h-5" />
                                        User Management
                                    </NavLink>
                                </li>

                                <li>
                                    <NavLink
                                        to="/layout/hostelManagement"
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 px-4 py-2.5 rounded-lg transition ${isActive
                                                ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                                                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                            }`
                                        }
                                    >
                                        <Building2 className="w-5 h-5" />
                                        Hostel
                                    </NavLink>
                                </li>

                                 <li>
                                    <NavLink
                                        to="/layout/room"
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 px-4 py-2.5 rounded-lg transition ${isActive
                                                ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                                                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                            }`
                                        }
                                    >
                                        <DoorOpen className="w-5 h-5" strokeWidth={2.5} />
                                        Room
                                    </NavLink>
                                </li>

                                 <li>
                                    <NavLink
                                        to="/layout/bed"
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 px-4 py-2.5 rounded-lg transition ${isActive
                                                ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                                                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                            }`
                                        }
                                    >
                                        <BedDouble className="w-5 h-5" />
                                        Bed
                                    </NavLink>
                                </li>

                                <li>
                                    <NavLink
                                        to="/layout/settings"
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 px-4 py-2.5 rounded-lg transition ${isActive
                                                ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                                                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                            }`
                                        }
                                    >
                                        <Settings className="w-5 h-5" />
                                        Settings
                                    </NavLink>
                                </li>


                            </>
                        )}

                        {role === 'student' && (
                            <>
                                <li>
                                    <NavLink
                                        to="/layout/contact"
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 px-4 py-2.5 rounded-lg transition ${isActive
                                                ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                                                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                            }`
                                        }
                                    >
                                        <Phone className="w-5 h-5" />
                                        Contact Support
                                    </NavLink>
                                </li>

                                <li>
                                    <NavLink
                                        to="/layout/settings"
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 px-4 py-2.5 rounded-lg transition ${isActive
                                                ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                                                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                            }`
                                        }
                                    >
                                        <Settings className="w-5 h-5" />
                                        Settings
                                    </NavLink>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>

                <div className="mt-10 border-t border-gray-700 pt-4">
                    <button className="w-full text-left flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-800 transition text-gray-300 hover:text-white">
                        <UserCircle className="w-5 h-5" />
                        Profile
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col min-w-0">

                {/* TOP BAR */}
                <header className="bg-white shadow flex items-center justify-between px-8 py-4 z-40 flex-shrink-0">
                    <h2 className="text-xl font-semibold text-gray-700">Hostel Management Panel</h2>

                    <div className="flex items-center gap-6 text-gray-600">
                        {role === 'admin' && (
                            <>
                                <NavLink to="/layout/home" className="hover:text-teal-600 transition"><LayoutDashboard className="w-6 h-6" /></NavLink>
                                <NavLink to="/layout/contact" className="hover:text-teal-600 transition"><Phone className="w-6 h-6" /></NavLink>
                                <NavLink to="/layout/userManagement" className="hover:text-teal-600 transition"><Users className="w-6 h-6" /></NavLink>
                                <NavLink to="/layout/hostelManagement" className="hover:text-teal-600 transition"><Building2 className="w-6 h-6" /></NavLink>
                                <NavLink to="/layout/room" className="hover:text-teal-600 transition"><DoorOpen className="w-6 h-6" /></NavLink>
                                <NavLink to="/layout/bed" className="hover:text-teal-600 transition"><BedDouble className="w-6 h-6" /></NavLink>
                                <NavLink to="/layout/settings" className="hover:text-teal-600 transition"><Settings className="w-6 h-6" /></NavLink>
                            </>
                        )}

                        {role === 'student' && (
                            <>
                                <NavLink to="/layout/contact" className="hover:text-teal-600 transition"><Phone className="w-6 h-6" /></NavLink>
                                <NavLink to="/layout/settings" className="hover:text-teal-600 transition"><Settings className="w-6 h-6" /></NavLink>
                            </>
                        )}
                    </div>
                </header>

                {/* CONTENT WRAPPER */}
                {/* Change 2: overflow-hidden on the main tag and overflow-y-auto on the inner div */}
                <main className="flex-1 p-8 overflow-hidden bg-gray-100">
                    <div className="bg-white rounded-2xl shadow-xl p-8 h-full overflow-y-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}