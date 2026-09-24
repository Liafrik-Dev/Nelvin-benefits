import { db } from "@/services/api/dataClient";

import React, { useState, useEffect } from "react";
import { Bell } from "lucide-react";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    db.entities.Notification.list("-created_date", 10)
      .then(setNotifications)
      .catch(() => {});
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleOpen = async () => {
    const next = !open;
    setOpen(next);
    if (next && unreadCount > 0) {
      const unread = notifications.filter((n) => !n.read);
      await Promise.all(unread.map((n) => db.entities.Notification.update(n.id, { read: true })));
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    }
  };

  return (
    <div className="relative">
      <button onClick={handleOpen} aria-label={unreadCount > 0 ? `Notifications (${unreadCount} unread)` : "Notifications"} aria-expanded={open} className="relative text-[#282828] hover:text-[#1B4F9C]">
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#1B4F9C] rounded-full text-[10px] font-bold text-white flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-3 w-80 bg-[#FFFFFF] rounded-xl shadow-2xl border border-[#F1F1F1] max-h-96 overflow-y-auto z-50">
          <div className="p-3 border-b border-[#F1F1F1] font-semibold text-sm text-ivory">Notifications</div>
          {notifications.length === 0 ? (
            <p className="p-4 text-sm text-ivory-dim">No notifications yet.</p>
          ) : (
            notifications.map((n) => (
              <div key={n.id} className="p-3 border-b border-gray-50 last:border-0">
                <p className="text-sm font-medium text-ivory">{n.title}</p>
                <p className="text-xs text-ivory-muted mt-0.5">{n.message}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}