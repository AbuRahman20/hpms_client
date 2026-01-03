import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Layout from './pages/Layout'
import Home from './pages/Home'
import Contact from './pages/Contact'
import UserManagement from './pages/UserManagement'
import HostelManagement from './pages/HostelManagement'

function App() {

	return (
		<Router>
			<Routes>
				<Route path='/' element={<Login />} />
				<Route path='/layout/*' element={<Layout />}>
					<Route path='home' element={<Home />} />
					<Route path='contact' element={<Contact />} />
					<Route path='userManagement' element={<UserManagement />} />
					<Route path='hostelManagement' element={<HostelManagement />} />
				</Route>

			</Routes>
		</Router>
	)
}

export default App;