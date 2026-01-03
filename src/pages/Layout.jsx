import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Home, Phone, UserCircle, Settings, BarChart3,Users,Building2 } from 'lucide-react';
import UserManagement from './UserManagement';

// More Realistic, Professional & Modern Admin Layout
export default function Layout() {
	return (
		<div className="min-h-screen flex bg-gray-100 font-sans antialiased">

			{/* SIDEBAR */}
			<aside className="w-72 bg-gray-900 text-gray-200 shadow-2xl hidden md:flex flex-col p-6">
				<div className="flex items-center gap-3 mb-10 pb-4 border-b border-gray-700">
					<UserCircle className="w-10 h-10 text-teal-400" />
					<div>
						<h1 className="text-lg font-bold tracking-tight text-white">HostelSphere</h1>
						<p className="text-xs text-gray-400">Admin Panel</p>
					</div>
				</div>

				{/* NAVIGATION */}
				<nav className="flex-1">
					<ul className="space-y-2 text-sm">

						{/* Dashboard */}
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
								<BarChart3 className="w-5 h-5" />
								Dashboard
							</NavLink>
						</li>

						{/* Contact */}
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

						{/* User management */}
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
								{/* <Settings className="w-5 h-5" /> */}
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
								{/* <Settings className="w-5 h-5" /> */}
								< Building2 className="w-5 h-5" />
								Hostel
							</NavLink>
						</li>

						{/* Payment Management */}

						<li>
							<NavLink
								to="/layout/Payment"
								className={({ isActive }) =>
									`flex items-center gap-3 px-4 py-2.5 rounded-lg transition ${isActive
										? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
										: 'text-gray-300 hover:bg-gray-800 hover:text-white'
									}`
								}
							>
								{/* <Settings className="w-5 h-5" /> */}
								< Building2 className="w-5 h-5" />
								Hostel
							</NavLink>
						</li>

						{/* Settings */}
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

					</ul>
				</nav>

				{/* FOOTER USER SECTION */}
				<div className="mt-10 border-t border-gray-700 pt-4">
					<button className="w-full text-left flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-800 transition text-gray-300 hover:text-white">
						<UserCircle className="w-5 h-5" />
						Profile
					</button>
				</div>
			</aside>

			{/* MAIN CONTENT AREA */}
			<div className="flex-1 flex flex-col">

				{/* TOP BAR */}
				<header className="bg-white shadow flex items-center justify-between px-8 py-4 sticky top-0 z-40">
					<h2 className="text-xl font-semibold text-gray-700">Hostel Management Panel</h2>

					<div className="flex items-center gap-6 text-gray-600">
						<NavLink to="/layout/home" className="hover:text-teal-600 transition">
							<Home className="w-6 h-6" />
						</NavLink>
						<NavLink to="/layout/contact" className="hover:text-teal-600 transition">
							<Phone className="w-6 h-6" />
						</NavLink>
						<NavLink to="/layout/userManagement" className="hover:text-teal-600 transition">
							<Users className="w-6 h-6" />
						</NavLink>
						<NavLink to="/layout/hostelManagement" className="hover:text-teal-600 transition">
							<Building2  className="w-6 h-6" />
						</NavLink>
						<NavLink to="/layout/Payment" className="hover:text-teal-600 transition">
							<Building2  className="w-6 h-6" />
						</NavLink>
						<NavLink to="/layout/settings" className="hover:text-teal-600 transition">
							<Settings className="w-6 h-6" />
						</NavLink>
					</div>
				</header>

				{/* CONTENT WRAPPER */}
				<main className="flex-1 p-8 overflow-y-auto bg-gray-100">
					<div className="bg-white rounded-2xl shadow-xl p-8 min-h-[75vh]">
						<Outlet />
					</div>
				</main>
			</div>
		</div>
	);
}
