import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Common Routes
import Login from "./pages/common/Login";
import Layout from "./pages/common/Layout";

// Admin Routes
import HostelManagement from "./pages/admin/HostelManagement";
import UserAdministration from "./pages/admin/UserAdministration";
import BookingRequest from "./pages/admin/BookingRequest";
import AllocationMangement from "./pages/admin/AllocationMangement";
import SupportTickets from "./pages/admin/SupportTickets";
import ServiceReview from "./pages/admin/ServiceReview";
import FeeCollectin from "./pages/admin/FeeCollection";
import AdminDashboard from "./pages/admin/AdminDashboard";

// StudentRoutes
import HostelBooking from './pages/student/HostelBooking';
import MyBookingRequest from './pages/student/MyBookingRequest';
import MyAllocations from './pages/student/MyAllocations';
import MyComplaints from "./pages/student/MyComplaints";
import MyPayments from "./pages/student/MyPayments";
import Feedback from "./pages/student/Feedback";
import StudentDashboard from "./pages/student/StudentDashboard";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/layout/*" element={<Layout />}>

                    {/* Admin Routes */}
                    <Route path="hostelManagement" element={<HostelManagement />} />
                    <Route path="userAdministration" element={<UserAdministration />} />
                    <Route path="bookingRequests" element={<BookingRequest />} />
                    <Route path='allocationManagement' element={<AllocationMangement />} />
                    <Route path='supportTickets' element={<SupportTickets />} />
                    <Route path='serviceReviews' element={<ServiceReview />} />
                    <Route path='feeCollection' element={<FeeCollectin />} />
                    <Route path='adminDashboard' element={<AdminDashboard />} />

                    {/* Student Routes */}
                    <Route path='hostelBooking' element={<HostelBooking />} />
                    <Route path='myBookingRequests' element={<MyBookingRequest />} />
                    <Route path='myAllocations' element={<MyAllocations />} />
                    <Route path='myComplaints' element={<MyComplaints />} />
                    <Route path='myPayments' element={<MyPayments />} />
                    <Route path='feedback' element={<Feedback />} />
                    <Route path="studentDashboard" element={<StudentDashboard />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
