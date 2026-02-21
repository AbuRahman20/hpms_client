import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LogOut, Phone, UserCircle, Settings, LayoutDashboard, Users, Building2, DoorOpen, BedDouble } from "lucide-react";

function Layout() {

    const role = sessionStorage.getItem("role");
    const navigate = useNavigate()

    const adminNavItems = [
        { to: "/layout/home", icon: LayoutDashboard, label: "Admin Dashboard" },
        { to: "/layout/contact", icon: Phone, label: "Support Center" },
        { to: "/layout/userManagement", icon: Users, label: "User Administration" },
        { to: "/layout/hostelManagement", icon: Building2, label: "Hostel Management" },
        { to: "/layout/room", icon: DoorOpen, label: "Room Allocation" },
        { to: "/layout/bed", icon: BedDouble, label: "Bed Management" },
        { to: "/layout/settings", icon: Settings, label: "System Settings" },
    ];

    const studentNavItems = [
        { to: "/layout/contact", icon: Phone, label: "Contact Support" },
        { to: "/layout/settings", icon: Settings, label: "Settings" },
    ];

    const navItems = role === "admin" ? adminNavItems : studentNavItems;

    return (
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
                        {navItems.map(({ to, icon: Icon, label }) => (
                            <li key={to}>
                                <NavLink to={to} className={({ isActive }) => `flex items-center gap-3 px-4 py-2.5 rounded-lg transition ${isActive ? "bg-teal-600 text-white shadow-md shadow-teal-600/30" : "text-gray-300 hover:bg-gray-800 hover:text-white"}`}>
                                    <Icon className="w-5 h-5" />
                                    {label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="mt-10 border-t border-gray-700 pt-4 space-y-2">
                    <button
                        onClick={() => {
                            sessionStorage.clear();
                            navigate("/");
                        }}
                        className="w-full text-left flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-red-600/20 transition text-red-400 hover:text-red-500"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* TOP BAR */}
                <header className="bg-white shadow flex items-center justify-between px-8 py-4 z-40 flex-shrink-0">
                    <h2 className="text-xl font-semibold text-gray-700">Hostel Management Panel</h2>
                    <div className="flex items-center gap-6 text-gray-600">
                        {navItems.map(({ to, icon: Icon }) => (
                            <NavLink key={to} to={to} className="hover:text-teal-600 transition">
                                <Icon className="w-6 h-6" />
                            </NavLink>
                        ))}
                    </div>
                </header>

                {/* CONTENT WRAPPER */}
                <main className="flex-1 p-8 overflow-hidden bg-gray-100">
                    <div className="bg-white rounded-2xl shadow-xl p-8 h-full overflow-y-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Layout;
