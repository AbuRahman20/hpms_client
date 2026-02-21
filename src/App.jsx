import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Common Routes
import Login from './pages/common/Login'
import Layout from './pages/common/Layout'

// Admin Routes
import HostelManagement from './pages/admin/HostelManagement'
import UserAdministration from './pages/admin/UserAdministration'
import RoomAllocation from './pages/admin/RoomAllocation'
import BedManagement from './pages/admin/BedManagement'

function App() {
	return (
		<Router>
			<Routes>
				<Route path='/' element={<Login />} />
				<Route path='/layout/*' element={<Layout />}>
					{/* Admin Routes */}
					<Route path='hostelManagement' element={<HostelManagement />} />
					<Route path='bedManagement' element={<BedManagement />} />
					<Route path='roomAllocation' element={<RoomAllocation />} />
					<Route path='userAdministration' element={<UserAdministration />} />
                    {/* Student Routes */}
				</Route>
			</Routes>
		</Router>
	)
}

export default App;