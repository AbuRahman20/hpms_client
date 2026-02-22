import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Common Routes
import Login from "./pages/common/Login";
import Layout from "./pages/common/Layout";

// Admin Routes
import HostelManagement from "./pages/admin/HostelManagement";
import UserAdministration from "./pages/admin/UserAdministration";
import RoomAllocation from "./pages/admin/RoomAllocation";
import BedManagement from "./pages/admin/BedManagement";
import BookingRequest from "./pages/admin/BookingRequest";
import AllocationMangement from "./pages/admin/AllocationMangement";

// StudentRoutes
import HostelBooking from './pages/student/HostelBooking';
import MyBookingRequest from './pages/student/MyBookingRequest';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/layout/*" element={<Layout />}>
                    {/* Admin Routes */}
                    <Route path="hostelManagement" element={<HostelManagement />} />
                    <Route path="bedManagement" element={<BedManagement />} />
                    <Route path="roomAllocation" element={<RoomAllocation />} />
                    <Route path="userAdministration" element={<UserAdministration />} />
                    <Route path="bookingRequests" element={<BookingRequest />} />
                    <Route path='allocationManagement' element={<AllocationMangement />} />
                    {/* Student Routes */}
                    <Route path='hostelBooking' element={<HostelBooking />} />
                    <Route path='myBookingRequests' element={<MyBookingRequest />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
