import React, { useState } from "react";
import { ClipboardList, Plus, BarChart2 } from "lucide-react";

export default function SurveysPanel({ company }) {
  const [surveys] = useState([
    { id: "s1", title: "2026 Employee Benefits Preference Survey", responses: 112, status: "active" },
    { id: "s2", title: "Gym & Fitness Perk Satisfaction Poll", responses: 84, status: "closed" },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-ivory">Employee Surveys & Feedback</h1>
          <p className="text-sm text-ivory-muted mt-1">Gather feedback on benefit satisfaction and preferred brand partnerships.</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-[#0866FF] hover:bg-[#0866FF] text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-sm">
          <Plus className="w-4 h-4" /> Create Survey
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {surveys.map((s) => (
          <div key={s.id} className="bg-emerald-black ring-1 ring-[#F1F1F1] rounded-lg p-6 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0866FF] bg-[#FFFFFF] px-2.5 py-0.5 rounded-full uppercase">{s.status}</span>
              <ClipboardList className="w-4 h-4 text-[#0866FF]" />
            </div>
            <h3 className="font-bold text-ivory text-base font-heading">{s.title}</h3>
            <div className="pt-3 border-t border-gray-50 flex items-center justify-between text-xs font-bold text-ivory">
              <span>{s.responses} Responses Collected</span>
              <button className="text-[#0866FF] hover:underline flex items-center gap-1">
                <BarChart2 className="w-3.5 h-3.5" /> View Report
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}