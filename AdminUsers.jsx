const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect, useMemo, useCallback } from "react";

import { useAuth } from "@/lib/AuthContext";
import { formatDate } from "@/lib/adminUtils";
import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminEditModal from "@/components/admin/AdminEditModal";
import StatusBadge from "@/components/admin/StatusBadge";
import { UserPlus, UserCog, LogOut, Trash2 } from "lucide-react";

function RowIconBtn({ title, onClick, Icon, color = "text-gray-600 hover:text-gray-900" }) {
  return (
    <button title={title} onClick={onClick} className={`p-1.5 rounded hover:bg-gray-100 ${color}`}>
      <Icon className="w-4 h-4" />
    </button>
  );
}

export default function AdminUsers() {
  const { user: adminUser } = useAuth();
  const [data, setData] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({ key: "created_date", dir: "desc" });
  const [filterAccountType, setFilterAccountType] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selected, setSelected] = useState(new Set());
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [users, comps, plns] = await Promise.all([
        db.entities.User.list("-created_date", 500).catch(() => []),
        db.entities.Company.list("-created_date", 500).catch(() => []),
        db.entities.MembershipPlan.list("-display_order", 50).catch(() => []),
      ]);
      setData(users);
      setCompanies(comps);
      setPlans(plns);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => { load(); }, [load]);

  const companyName = (id) => companies.find((c) => c.id === id)?.name || "—";
  const planName = (id) => plans.find((p) => p.id === id)?.name || "—";

  const filtered = useMemo(() => {
    let arr = data;
    if (filterAccountType) arr = arr.filter((u) => (u.account_type || (u.company_id ? "corporate" : "individual")) === filterAccountType);
    if (filterRole) arr = arr.filter((u) => u.role === filterRole);
    if (filterStatus) arr = arr.filter((u) => (u.status || "active") === filterStatus);
    if (search) {
      const s = search.toLowerCase();
      arr = arr.filter((u) => (u.full_name || "").toLowerCase().includes(s) || (u.email || "").toLowerCase().includes(s));
    }
    return arr;
  }, [data, search, filterAccountType, filterRole, filterStatus]);

  const updateMany = async (ids, payload) => {
    const items = ids.map((id) => ({ id, ...payload }));
    await db.entities.User.bulkUpdate(items);
    await load();
  };

  const toggleSuspend = async (u) => {
    if (u.id === adminUser?.id) return alert("You cannot suspend your own account.");
    await db.entities.User.update(u.id, {
      is_suspended: !u.is_suspended,
      status: u.is_suspended ? "active" : "suspended",
    });
    await load();
  };

  const removeUser = async (u) => {
    if (u.id === adminUser?.id) return alert("You cannot delete your own account.");
    if (!window.confirm(`Delete user ${u.full_name || u.email}? This cannot be undone.`)) return;
    await db.entities.User.delete(u.id);
    await load();
  };

  const inviteUser = async () => {
    const email = window.prompt("Email of the user to invite:");
    if (!email) return;
    const role = window.prompt("Role (founder, admin, staff, vendor, subscriber):", "subscriber");
    if (!role) return;
    try {
      await db.users.inviteUser(email.trim(), role.trim());
      alert(`Invite sent to ${email}. They will be added as ${role}.`);
      await load();
    } catch (err) {
      alert(err?.message || "Failed to invite user.");
    }
  };

  const columns = [
    { key: "full_name", label: "Name", sortable: true,
      accessor: (u) => u.full_name || u.email || "—" },
    { key: "email", label: "Email", sortable: true,
      render: (u) => <span className="text-xs text-gray-500">{u.email}</span> },
    { key: "role", label: "Role", sortable: true,
      render: (u) => <StatusBadge status={u.role} label={u.role} className="capitalize" /> },
    { key: "account_type", label: "Account", sortable: true,
      render: (u) => <StatusBadge status={u.account_type || (u.company_id ? "corporate" : "individual")} label={u.account_type === "corporate" ? "Corporate" : "Individual"} /> },
    { key: "plan_tier", label: "Membership", sortable: true,
      render: (u) => u.plan_tier ? <StatusBadge status={u.plan_tier.toLowerCase()} label={u.plan_tier} /> : <span className="text-xs text-gray-400">—</span> },
    { key: "company_id", label: "Company",
      render: (u) => <span className="text-xs text-gray-600">{companyName(u.company_id)}</span> },
    { key: "status", label: "Status", sortable: true,
      render: (u) => <StatusBadge status={u.status || (u.is_suspended ? "suspended" : "active")} /> },
    { key: "created_date", label: "Joined", sortable: true,
      render: (u) => <span className="text-xs text-gray-500">{formatDate(u.created_date)}</span> },
  ];

  const editFields = [
    { key: "full_name", label: "Full Name", type: "text" },
    { key: "phone", label: "Phone", type: "text" },
    { key: "country", label: "Country", type: "text" },
    { key: "city", label: "City", type: "text" },
    { key: "photo_url", label: "Photo URL (or data URL)", type: "url", help: "Profile photo. JPG/PNG/WebP." },
    { key: "role", label: "Role", type: "select",
      options: [
        { value: "founder", label: "Founder" },
        { value: "admin", label: "Admin" },
        { value: "staff", label: "Staff" },
        { value: "vendor", label: "Vendor" },
        { value: "subscriber", label: "Subscriber" },
        { value: "user", label: "User (legacy)" },
      ] },
    { key: "account_type", label: "Account Type", type: "select",
      options: [
        { value: "individual", label: "Individual" },
        { value: "corporate", label: "Corporate" },
      ] },
    { key: "company_id", label: "Company ID (corporate)", type: "text" },
    { key: "plan_tier", label: "Plan Tier", type: "select",
      options: [
        { value: "Free", label: "Free" },
        { value: "Silver", label: "Silver" },
        { value: "Gold", label: "Gold" },
        { value: "Platinum", label: "Platinum" },
        { value: "Enterprise", label: "Enterprise" },
      ] },
    { key: "membership_status", label: "Membership Status", type: "select",
      options: [
        { value: "active", label: "Active" },
        { value: "expired", label: "Expired" },
        { value: "suspended", label: "Suspended" },
        { value: "none", label: "None" },
      ] },
    { key: "status", label: "Account Status", type: "select",
      options: [
        { value: "active", label: "Active" },
        { value: "suspended", label: "Suspended" },
        { value: "deleted", label: "Deleted" },
      ] },
    { key: "is_suspended", label: "Is Suspended (flag)", type: "bool" },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold font-heading text-gray-900">Users</h1>
          <p className="text-sm text-gray-500 mt-1">{filtered.length} users · Manage individual subscribers and corporate employees.</p>
        </div>
        <button
          onClick={inviteUser}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg"
        >
          <UserPlus className="w-4 h-4" /> Invite user
        </button>
      </div>

      <AdminDataTable
        data={filtered}
        columns={columns}
        loading={loading}
        search={search} setSearch={setSearch}
        sort={sort} setSort={setSort}
        selected={selected} setSelected={setSelected}
        exportName={`users-${Date.now()}.csv`}
        renderActions={(u) => (
          <div className="flex items-center justify-end gap-1">
            <RowIconBtn title="Edit" Icon={UserCog} onClick={() => setEditing(u)} />
            <RowIconBtn
              title={u.is_suspended ? "Activate" : "Suspend"}
              Icon={LogOut}
              onClick={() => toggleSuspend(u)}
            />
            <RowIconBtn title="Delete" Icon={Trash2} color="text-rose-600 hover:text-rose-700" onClick={() => removeUser(u)} />
          </div>
        )}
        bulkActions={[
          { label: "Activate", onClick: (ids) => updateMany(ids, { is_suspended: false, status: "active" }) },
          { label: "Suspend", onClick: (ids) => updateMany(ids, { is_suspended: true, status: "suspended" }) },
          { label: "Delete", onClick: async (ids) => {
            if (!window.confirm(`Delete ${ids.size} users?`)) return;
            for (const id of ids) {
              if (id === adminUser?.id) continue;
              await db.entities.User.delete(id);
            }
            await load();
          } },
        ]}
        filters={[
          { key: "account_type", label: "Account type", value: filterAccountType, onChange: (e) => setFilterAccountType(e.target.value),
            options: [
              { value: "individual", label: "Individual" },
              { value: "corporate", label: "Corporate" },
            ] },
          { key: "role", label: "Role", value: filterRole, onChange: (e) => setFilterRole(e.target.value),
            options: [
              { value: "founder", label: "Founder" },
              { value: "admin", label: "Admin" },
              { value: "staff", label: "Staff" },
              { value: "vendor", label: "Vendor" },
              { value: "subscriber", label: "Subscriber" },
              { value: "user", label: "User (legacy)" },
            ] },
          { key: "status", label: "Status", value: filterStatus, onChange: (e) => setFilterStatus(e.target.value),
            options: [
              { value: "active", label: "Active" },
              { value: "suspended", label: "Suspended" },
              { value: "deleted", label: "Deleted" },
            ] },
        ]}
      />

      <AdminEditModal
        open={!!editing}
        entityName="User"
        record={editing}
        createIfNew={false}
        fields={editFields}
        title={editing?.id ? "Edit user" : "New user"}
        onClose={() => setEditing(null)}
        onSaved={load}
      />
    </div>
  );
}