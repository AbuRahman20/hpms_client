import React from 'react'
import { useNavigate } from 'react-router-dom'

function LoginForm() {

    const navigate = useNavigate();

    const changePage = () => {
        navigate('/layout');
    }

    return (
        <div className="p-10 md:p-14 flex flex-col justify-center bg-white">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
            <p className="text-gray-500 mb-10">Sign in to access your management dashboard.</p>

            <form className="space-y-6">

                {/* Username */}
                <div>
                    <label className="block text-sm mb-1 font-medium text-gray-700">Username / Email</label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">👤</span>
                        <input
                            type="text"
                            placeholder="manager.id@hostel.com"
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm text-gray-700 placeholder-gray-400 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                            required
                        />
                    </div>
                </div>

                {/* Password */}
                <div>
                    <label className="block text-sm mb-1 font-medium text-gray-700">Password</label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">🔒</span>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm text-gray-700 placeholder-gray-400 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                            required
                        />
                    </div>
                </div>

                {/* Options */}
                <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 text-gray-700">
                        <input type="checkbox" className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500" />
                        Remember me
                    </label>
                    <a href="#" className="text-teal-600 hover:text-teal-700 font-medium">Forgot Password?</a>
                </div>

                {/* Login Button */}
                <button
                    onClick={changePage}
                    type="submit"
                    className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl shadow-md shadow-teal-200 transition"
                >
                    Sign In
                </button>

            </form>
        </div>
    )
}

export default LoginForm