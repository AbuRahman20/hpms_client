import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Building2, 
  Search, 
  Table as TableIcon, 
  Info, 
  ChevronRight, 
  CircleDot,
  LayoutGrid,
  Filter
} from 'lucide-react';

function Room() {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [hostels, setHostels] = useState([]);
  const [selectedHostelId, setSelectedHostelId] = useState('');
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hostelLoading, setHostelLoading] = useState(true);

  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/hostels`);
        setHostels(response.data || []);
      } catch (error) {
        console.error("Hostel Fetch Error:", error);
      } finally {
        setHostelLoading(false);
      }
    };
    fetchHostels();
  }, [apiUrl]);

  const handleFetchRooms = async () => {
    if (!selectedHostelId) return;
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/api/rooms/${selectedHostelId}`);
      setRooms(response.data);
    } catch (error) {
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">
        
        {/* --- HEADER SECTION --- */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-1 bg-indigo-600 rounded-full" />
              <span className="text-xs font-black uppercase tracking-widest text-indigo-600">Operations</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Room Inventory</h1>
            <p className="text-slate-500 font-medium">Real-time room occupancy and pricing management.</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-200">
                <LayoutGrid size={20} className="text-slate-400" />
             </div>
          </div>
        </header>

        {/* --- SEARCH & FILTERS --- */}
        <section className="bg-white rounded-[2rem] p-2 shadow-xl shadow-slate-200/50 border border-white mb-10">
          <div className="flex flex-col md:flex-row items-center gap-2">
            <div className="relative flex-1 w-full group">
              <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <select
                value={selectedHostelId}
                onChange={(e) => setSelectedHostelId(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-[1.5rem] pl-14 pr-6 py-5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 transition-all appearance-none outline-none cursor-pointer"
              >
                <option value="">{hostelLoading ? "Loading Properties..." : "Select Property ID"}</option>
                {hostels.map((hostel) => (
                  <option key={hostel._id} value={hostel.hostelId}>
                    {hostel.hostelId} - {hostel.hostelName || 'View Property'}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleFetchRooms}
              disabled={loading || !selectedHostelId}
              className="w-full md:w-auto bg-slate-900 hover:bg-indigo-600 text-white font-bold py-5 px-12 rounded-[1.5rem] transition-all flex items-center justify-center gap-3 disabled:opacity-30 shadow-lg shadow-slate-200"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
              <span>Fetch Live Inventory</span>
            </button>
          </div>
        </section>

        {/* --- DATA DISPLAY --- */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
          {rooms.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-8 py-6 text-[11px] font-black uppercase tracking-widest text-slate-400">Room Info</th>
                    <th className="px-8 py-6 text-[11px] font-black uppercase tracking-widest text-slate-400">Configuration</th>
                    <th className="px-8 py-6 text-[11px] font-black uppercase tracking-widest text-slate-400">Financials</th>
                    <th className="px-8 py-6 text-[11px] font-black uppercase tracking-widest text-slate-400 text-center">Availability</th>
                    <th className="px-8 py-6"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rooms.map((room) => (
                    <tr key={room._id} className="hover:bg-indigo-50/30 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-slate-900">#{room.roomNumber}</span>
                          <span className="text-xs text-slate-400 font-medium">ID: {room.roomId}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 uppercase">
                            {room.roomType}
                          </div>
                          <span className="text-sm text-slate-500 font-medium">{room.totalBeds} Beds</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-lg font-black text-slate-900">₹{room.rentAmount.toLocaleString()}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Per Billing Cycle</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex justify-center">
                          <span className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                            room.status === 'Available' 
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                              : 'bg-rose-50 text-rose-600 border-rose-100'
                          }`}>
                            <CircleDot size={12} className={room.status === 'Available' ? 'animate-pulse' : ''} />
                            {room.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button className="p-2 hover:bg-white rounded-xl transition-colors opacity-0 group-hover:opacity-100">
                          <ChevronRight className="w-5 h-5 text-slate-400" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-32 flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-indigo-100 rounded-full blur-2xl opacity-50 animate-pulse" />
                <div className="relative bg-white p-8 rounded-full border border-slate-100 shadow-inner">
                  <TableIcon className="w-12 h-12 text-indigo-200" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-2">Inventory Ready</h3>
              <p className="text-slate-400 max-w-sm mx-auto font-medium">
                Please select a property from the dropdown above to synchronize and view room availability.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Room;