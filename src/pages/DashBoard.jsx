import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, Building2, DoorOpen, BedDouble, IndianRupee } from 'lucide-react';

function Dashboard() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get(`${apiUrl}/api/dashboard`)
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, [apiUrl]);

  if (!stats) return <div className="p-10">Loading Dashboard...</div>;

  const cards = [
    { title: "Total Users", value: stats.totalUsers, icon: <Users /> },
    { title: "Total Hostels", value: stats.totalHostels, icon: <Building2 /> },
    { title: "Total Rooms", value: stats.totalRooms, icon: <DoorOpen /> },
    { title: "Total Beds", value: stats.totalBeds, icon: <BedDouble /> },
    { title: "Available Beds", value: stats.availableBeds, icon: <BedDouble /> },
    { title: "Occupied Beds", value: stats.occupiedBeds, icon: <BedDouble /> },
    { title: "Total Revenue", value: `₹${stats.totalRevenue}`, icon: <IndianRupee /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <h1 className="text-3xl font-black mb-10 text-slate-800">
        Hostel Management Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div key={index}
            className="bg-white p-6 rounded-3xl shadow-md border border-slate-100 hover:shadow-xl transition">
            
            <div className="flex justify-between items-center mb-6">
              <div className="text-teal-600">{card.icon}</div>
              <span className="text-2xl font-black text-slate-800">
                {card.value}
              </span>
            </div>

            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">
              {card.title}
            </h3>

          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;