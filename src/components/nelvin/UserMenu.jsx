import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPortal } from "react-dom";
import { useAuth } from "@/lib/AuthContext";
import { User, LayoutDashboard, Crown, LogOut, ChevronDown } from "lucide-react";
import Avatar from "@/components/nelvin/Avatar";

export default function UserMenu() {
  const { user, isAuthenticated, logout, navigateToLogin } = useAuth();
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, right: 0 });
  const btnRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onAway = (e) => {
      if (btnRef.current?.contains(e.target) || menuRef.current?.contains(e.target)) return;
      setOpen(false);
    };
    const onScrollOrResize = () => setOpen(false);
    document.addEventListener("pointerdown", onAway);
    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      document.removeEventListener("pointerdown", onAway);
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [open]);

  if (!isAuthenticated) {
    return (
      <button
        onClick={navigateToLogin}
        className="bg-[#FFFFFF]/15 hover:bg-[#FFFFFF]/25 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors"
      >
        Log in
      </button>
    );
  }

  const initials = (user?.full_name || user?.email || "U")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const toggle = () => {
    if (!open && btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setCoords({ top: r.bottom + 10, right: Math.max(8, window.innerWidth - r.right) });
    }
    setOpen((p) => !p);
  };

  const dropdown = (
    <div
      ref={menuRef}
      style={{ position: "fixed", top: `${coords.top}px`, right: `${coords.right}px` }}
      className="w-64 bg-[#FFFFFF] rounded-lg shadow-2xl border border-[#F1F1F1] overflow-hidden z-[100]"
    >
      <div className="p-4 border-b border-[#F1F1F1]">
        <p className="font-bold text-ivory">{user?.full_name || "Member"}</p>
        <p className="text-xs text-ivory-dim break-all">{user?.email}</p>
        <span className="inline-block mt-2 border border-[#E3E3E3] bg-[#FFFFFF] text-[#282828] text-xs font-bold px-3 py-1 rounded-full">
          {user?.role === "admin" ? "Admin" : "Free"}
        </span>
      </div>
      <Link to="/profile" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-ivory hover:bg-[#F9F8F7]">
        <User className="w-4 h-4" /> Profile
      </Link>
      <Link to="/dashboard" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-ivory hover:bg-[#F9F8F7]">
        <LayoutDashboard className="w-4 h-4" /> Dashboard
      </Link>
      <Link to="/benefits" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-ivory hover:bg-[#F9F8F7]">
        <Crown className="w-4 h-4" /> Membership
      </Link>
      <button
        onClick={() => logout(true)}
        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-ivory hover:bg-[#F9F8F7] border-t border-[#F1F1F1]"
      >
        <LogOut className="w-4 h-4" /> Sign out
      </button>
    </div>
  );

  return (
    <div ref={btnRef} className="relative">
      <button onClick={toggle} className="flex items-center gap-1" aria-label="Open account menu">
        <Avatar user={user} />
        <ChevronDown className="w-4 h-4 text-[#282828]" />
      </button>
      {open && createPortal(dropdown, document.body)}
    </div>
  );
}