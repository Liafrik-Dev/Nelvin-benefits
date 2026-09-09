import React, { useState } from "react";
import { MapPin, Plus, Building2 } from "lucide-react";

export default function BusinessLocations() {
  const [locations, setLocations] = useState([
    { id: "1", name: "Nike Flagship Store - Victoria Island", address: "Adeola Odeku St, Lagos", city: "Lagos", status: "active" },
    { id: "2", name: "Nike Store - Ikeja City Mall", address: "Obafemi Awolowo Way, Ikeja", city: "Lagos", status: "active" },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading text-gray-900">Store Branches & Locations</h1>
          <p className="text-sm text-gray-500 mt-1">Manage physical store branches where members can redeem in-person perks.</p>
        </div>
        <button className="bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Branch
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {locations.map((loc) => (
          <div key={loc.id} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <Building2 className="w-6 h-6 text-emerald-600" />
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full uppercase">{loc.status}</span>
            </div>
            <h3 className="font-bold text-gray-900 text-base font-heading">{loc.name}</h3>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-gray-400" /> {loc.address}, {loc.city}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}