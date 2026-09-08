import React, { useState, useEffect } from "react";
import { db } from "@/services/api/base44Client";
import { Users, Plus, Edit, Trash2, Search, CheckCircle } from "lucide-react";

export default function TeamsPanel({ company }) {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [lead, setLead] = useState("");

  useEffect(() => {
    async function loadTeams() {
      try {
        const data = await db.entities.Team.filter({ company_id: company.id }).catch(() => []);
        setTeams(data || []);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }
    loadTeams();
  }, [company.id]);

  const defaultTeams = [
    { id: "t1", name: "Frontend Engineering", lead_name: "Sarah Connor", member_count: 12, status: "active" },
    { id: "t2", name: "Product Design", lead_name: "Alex Smith", member_count: 6, status: "active" },
    { id: "t3", name: "Growth & Marketing", lead_name: "David Kim", member_count: 8, status: "active" },
  ];

  const list = teams.length > 0 ? teams : defaultTeams;

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name) return;
    try {
      const created = await db.entities.Team.create({
        company_id: company.id,
        name,
        lead_name: lead || "Team Lead",
        member_count: 1,
        status: "active",
      }).catch(() => null);
      if (created) setTeams((prev) => [...prev, created]);
      else setTeams((prev) => [...prev, { id: String(Date.now()), name, lead_name: lead || "Team Lead", member_count: 1, status: "active" }]);
    } catch {}
    setName("");
    setLead("");
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-gray-900">Company Teams</h1>
          <p className="text-sm text-gray-500 mt-1">Organize employees into functional working units and assign team leaders.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-sm"
        >
          <Plus className="w-4 h-4" /> Create Team
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider font-semibold border-b border-gray-100">
            <tr>
              <th className="px-6 py-3.5">Team Name</th>
              <th className="px-6 py-3.5">Team Lead</th>
              <th className="px-6 py-3.5">Members</th>
              <th className="px-6 py-3.5">Status</th>
              <th className="px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {list.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-bold text-gray-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-600" /> {t.name}
                </td>
                <td className="px-6 py-4 text-gray-600 font-medium">{t.lead_name || "—"}</td>
                <td className="px-6 py-4 text-gray-600 font-bold">{t.member_count} Employees</td>
                <td className="px-6 py-4">
                  <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full uppercase">
                    {t.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button className="text-xs font-bold text-emerald-700 hover:underline">Edit</button>
                  <button className="text-xs font-bold text-rose-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 font-heading">Add New Team</h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Team Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Frontend Engineering"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Team Lead Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sarah Connor"
                  value={lead}
                  onChange={(e) => setLead(e.target.value)}
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:border-emerald-600"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700"
                >
                  Save Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}