import React, { useState, useEffect } from "react";
import { db } from "@/services/api/dataClient";
import { MapPin, Plus, Building2 } from "lucide-react";

export default function LocationsPanel({ company }) {
  const [locations, setLocations] = useState([
    { id: "loc1", name: "Lagos HQ", address: "Victoria Island, Lagos", country: "Nigeria", headcount: 140 },
    { id: "loc2", name: "Nairobi Hub", address: "Kilimani, Nairobi", country: "Kenya", headcount: 65 },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  const handleCreate = (e) => {
    e.preventDefault();
    if (!name) return;
    setLocations([...locations, { id: String(Date.now()), name, address, country: company.country || "Nigeria", headcount: 1 }]);
    setName("");
    setAddress("");
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-ivory">Office Locations</h1>
          <p className="text-sm text-ivory-muted mt-1">Manage global and regional corporate office locations.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 bg-[#1B4F9C] hover:bg-[#1B4F9C] text-white text-sm font-semibold px-4 py-2 rounded-full shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Office Location
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {locations.map((loc) => (
          <div key={loc.id} className="bg-emerald-black ring-1 ring-[#F1F1F1] rounded-lg p-6 space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-[#FFFFFF] text-ivory flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-ivory text-base font-heading">{loc.name}</h3>
              <p className="text-xs text-ivory-muted flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-ivory-dim" /> {loc.address}
              </p>
            </div>
            <div className="pt-3 border-t border-gray-50 flex items-center justify-between text-xs font-bold text-ivory">
              <span>{loc.headcount} Employees</span>
              <span className="text-[#1B4F9C]">{loc.country}</span>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-emerald-black rounded-lg p-6 max-w-md w-full space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-ivory font-heading">Add Office Location</h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-ivory mb-1">Office Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Accra Tech Hub"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 border border-[#F1F1F1] rounded-xl text-xs outline-none focus:border-[#1B4F9C]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-ivory mb-1">Address & City</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Airport Residential Area, Accra"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2 border border-[#F1F1F1] rounded-xl text-xs outline-none focus:border-[#1B4F9C]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-bold text-ivory-muted hover:bg-[#F4F4F4] rounded-full"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#1B4F9C] rounded-full hover:bg-[#1B4F9C]"
                >
                  Save Location
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}