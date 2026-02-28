import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Building2, DoorOpen, BedDouble, CheckCircle2,
    ChevronRight, Calendar, MapPin, Loader2, Sparkles,
    Clock, AlertCircle, Home, Users, CreditCard,
    Shield, ArrowRight, Check, X, HelpCircle,
    ChevronDown, Info, Wifi, Coffee, Star,
    Award, Heart, TrendingUp
} from "lucide-react";

function HostelBooking() {

    const apiUrl = import.meta.env.VITE_API_URL;

    // State Management
    const [data, setData] = useState({ hostels: [], rooms: [], beds: [] });
    const [selection, setSelection] = useState({ hostel: "", room: "", bed: "" });
    const [ui, setUi] = useState({ loading: true, processing: false });
    const registerNo = sessionStorage.getItem("registerNo");

    // 1. Fetch Hostels
    useEffect(() => {
        axios.get(`${apiUrl}/api/hostelBooking/available`)
            .then(res => setData(prev => ({ ...prev, hostels: res.data })))
            .finally(() => setUi(prev => ({ ...prev, loading: false })));
    }, [apiUrl]);

    // 2. Fetch Rooms (Cascading)
    useEffect(() => {
        if (selection.hostel) {
            axios.get(`${apiUrl}/api/hostelBooking/hostel/${selection.hostel}`)
                .then(res => setData(prev => ({ ...prev, rooms: res.data })));
        }
    }, [selection.hostel, apiUrl]);

    // 3. Fetch Beds (Cascading)
    useEffect(() => {
        if (selection.room) {
            axios.get(`${apiUrl}/api/hostelBooking/room/${selection.room}`)
                .then(res => setData(prev => ({ ...prev, beds: res.data })));
        }
    }, [selection.room, apiUrl]);

    const activeHostel = data.hostels.find(h => h._id === selection.hostel);
    const activeRoom = data.rooms.find(r => r._id === selection.room);

    const handleBookingRequest = async () => {

        if (!selection.hostel || !selection.room || !selection.bed) {
            alert("Please complete selection");
            return;
        }

        setUi(prev => ({ ...prev, processing: true }));

        try {
            await axios.post(`${apiUrl}/api/hostelBooking/booking-request`, {
                registerNo,
                hostelId: selection.hostel,
                roomId: selection.room,
                bedId: selection.bed,
                message: "Requesting this bed"
            });
            setSelection({ hostel: "", room: "", bed: "" });
        } catch (error) {
            console.log('Error in saving booking request : ', error);
            alert(error.response?.data?.message || "Error");
        } finally {
            setUi(prev => ({ ...prev, processing: false }));
        }
    };

    if (ui.loading) {
        return (
            <div className="bg-gradient-to-br from-teal-50 to-emerald-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600 font-medium">Loading available accommodations...</p>
                </div>
            </div>
        );
    }

    return (
        <div>

            {/* Header Section with Teal Accents */}
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20">
                        <Home size={22} className="text-white" />
                    </div>
                    <div>
                        <span className="text-sm font-semibold text-teal-600 tracking-wider">STUDENT ACCOMMODATION</span>
                        <h1 className="text-4xl font-bold text-slate-900">
                            Find your <span className="text-teal-600">perfect space</span>
                        </h1>
                    </div>
                </div>
                <p className="text-lg text-slate-600 ml-16">Select from our premium accommodation options</p>
            </div>

            {/* Main Form Container */}
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">

                {/* Progress Steps with Teal */}
                <div className="bg-gradient-to-r from-teal-50/50 to-emerald-50/30 border-b border-slate-100 p-6">
                    <div className="flex items-center justify-between max-w-3xl mx-auto">
                        {[
                            { number: "01", label: "Choose Property", icon: Building2, active: selection.hostel },
                            { number: "02", label: "Select Room", icon: DoorOpen, active: selection.room },
                            { number: "03", label: "Pick Bed", icon: BedDouble, active: selection.bed }
                        ].map((step, index) => {
                            const Icon = step.icon;
                            return (
                                <div key={step.label} className="flex items-center flex-1">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${step.active
                                            ? 'bg-gradient-to-br from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-500/20'
                                            : 'bg-white text-slate-400 border border-slate-200'
                                            }`}>
                                            <Icon size={18} />
                                        </div>
                                        <div className="hidden sm:block">
                                            <p className="text-xs text-slate-500">{step.number}</p>
                                            <p className={`text-sm font-medium ${step.active ? 'text-slate-900' : 'text-slate-500'
                                                }`}>{step.label}</p>
                                        </div>
                                    </div>
                                    {index < 2 && (
                                        <ChevronRight size={16} className="mx-4 text-slate-300 hidden sm:block" />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Form Content */}
                <div className="p-6 md:p-8">

                    {/* Selection Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

                        {/* Property Selection */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                                <Building2 size={16} className="text-teal-600" />
                                Select Property
                                <span className="text-xs text-slate-400 font-normal">(Step 1)</span>
                            </label>
                            <div className="relative group">
                                <select
                                    value={selection.hostel}
                                    onChange={(e) => setSelection({ hostel: e.target.value, room: "", bed: "" })}
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-slate-700 appearance-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all cursor-pointer hover:border-teal-300 group-hover:border-teal-300"
                                >
                                    <option value="">Choose a hostel...</option>
                                    {data.hostels.map(h => (
                                        <option key={h._id} value={h._id}>
                                            {h.hostelName} {h.location ? `• ${h.location}` : ''}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-teal-500 transition-colors" />
                            </div>

                            {activeHostel && (
                                <div className="mt-3 p-3 bg-teal-50/50 rounded-lg border border-teal-100 animate-in fade-in slide-in-from-top-2">
                                    <div className="flex items-start gap-2">
                                        <MapPin size={14} className="text-teal-600 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-teal-700 font-medium">Location</p>
                                            <p className="text-sm text-slate-600">{activeHostel.address || 'Address available upon selection'}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Room Selection */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                                <DoorOpen size={16} className="text-teal-600" />
                                Select Room
                                <span className="text-xs text-slate-400 font-normal">(Step 2)</span>
                            </label>
                            <div className="relative group">
                                <select
                                    value={selection.room}
                                    disabled={!selection.hostel || data.rooms.length === 0}
                                    onChange={(e) => setSelection({ ...selection, room: e.target.value, bed: "" })}
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-slate-700 appearance-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed hover:border-teal-300 group-hover:border-teal-300 disabled:hover:border-slate-200"
                                >
                                    <option value="">
                                        {!selection.hostel
                                            ? 'Select a property first'
                                            : data.rooms.length === 0
                                                ? 'No rooms available'
                                                : 'Choose a room...'}
                                    </option>
                                    {data.rooms.map(r => (
                                        <option key={r._id} value={r._id}>
                                            Room {r.roomNumber} • {r.availableBeds} bed{r.availableBeds !== 1 ? 's' : ''} available
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-teal-500 transition-colors" />
                            </div>

                            {activeRoom && (
                                <div className="mt-3 grid grid-cols-2 gap-2">
                                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                                        <p className="text-xs text-slate-500">Room Type</p>
                                        <p className="text-sm font-medium text-slate-700">{activeRoom.roomType || 'Standard'}</p>
                                    </div>
                                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                                        <p className="text-xs text-slate-500">Capacity</p>
                                        <p className="text-sm font-medium text-slate-700">{activeRoom.capacity || 'N/A'} persons</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bed Selection Section */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                                <BedDouble size={16} className="text-teal-600" />
                                Choose Your Bed
                                <span className="text-xs text-slate-400 font-normal">(Step 3)</span>
                            </label>
                            {selection.room && (
                                <span className="px-3 py-1.5 bg-teal-50 text-teal-700 rounded-lg text-xs font-medium flex items-center gap-1.5 border border-teal-200">
                                    <Users size={14} />
                                    {data.beds.length} bed{data.beds.length !== 1 ? 's' : ''} available
                                </span>
                            )}
                        </div>

                        {data.beds.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                {data.beds.map(b => (
                                    <button
                                        key={b._id}
                                        onClick={() => setSelection({ ...selection, bed: b._id })}
                                        className={`relative p-4 rounded-xl border-2 transition-all group ${selection.bed === b._id
                                            ? 'border-teal-500 bg-teal-50 shadow-md shadow-teal-500/10'
                                            : 'border-slate-100 hover:border-teal-200 bg-white hover:shadow-sm'
                                            }`}
                                    >
                                        <div className="flex flex-col items-center text-center">
                                            <BedDouble
                                                size={24}
                                                className={`mb-2 transition-colors ${selection.bed === b._id
                                                    ? 'text-teal-600'
                                                    : 'text-slate-400 group-hover:text-teal-500'
                                                    }`}
                                            />
                                            <span className={`text-sm font-medium ${selection.bed === b._id ? 'text-teal-700' : 'text-slate-600'
                                                }`}>
                                                {b.bedName}
                                            </span>
                                            <span className="text-[10px] text-slate-400 mt-1">
                                                {b.bedType || 'Standard Bed'}
                                            </span>
                                        </div>

                                        {selection.bed === b._id && (
                                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center shadow-sm animate-in zoom-in">
                                                <Check size={12} className="text-white" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                                <div className="text-center">
                                    <BedDouble size={40} className="mx-auto text-slate-300 mb-3" />
                                    <p className="text-slate-500 font-medium">
                                        {!selection.room
                                            ? 'Select a room to view available beds'
                                            : 'No beds available in this room'}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-2">
                                        {!selection.room
                                            ? 'Please complete steps 1 and 2 first'
                                            : 'Try selecting a different room'}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Amenities Preview */}
                    {activeRoom && activeRoom.amenities && activeRoom.amenities.length > 0 && (
                        <div className="mb-8 p-4 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl border border-teal-100">
                            <h4 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-1.5">
                                <Award size={14} className="text-teal-600" />
                                Room Amenities
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {activeRoom.amenities.map((amenity, index) => (
                                    <span key={index} className="px-3 py-1 bg-white rounded-full text-xs text-slate-600 border border-teal-200 shadow-sm">
                                        {amenity}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Confirmation Button */}
                    {selection.bed && (
                        <div className="border-t border-slate-100 pt-6">
                            <button
                                onClick={handleBookingRequest}
                                disabled={ui.processing}
                                className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg shadow-teal-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                {ui.processing ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Processing Request...
                                    </>
                                ) : (
                                    <>
                                        Confirm Booking Request
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                            <p className="text-center text-xs text-slate-400 mt-5 flex items-center justify-center gap-1">
                                <Info size={12} className="text-teal-500" />
                                By confirming, you agree to our terms and conditions
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default HostelBooking;