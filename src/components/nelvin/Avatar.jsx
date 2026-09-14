import React, { useState, useEffect } from "react";

export function getInitials(user) {
  return (user?.full_name || user?.email || "U")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function Avatar({
  user,
  className = "w-9 h-9",
  fallbackClassName = "bg-[#D6B56D] text-white font-semibold text-sm",
}) {
  const photo = user?.photo_url;
  const [failed, setFailed] = useState(false);
  useEffect(() => { setFailed(false); }, [photo]);

  if (photo && !failed) {
    return (
      <img
        src={photo}
        alt={user?.full_name || "Avatar"}
        onError={() => setFailed(true)}
        className={`${className} rounded-full object-cover flex-shrink-0`}
      />
    );
  }
  return (
    <div className={`${className} rounded-full flex items-center justify-center flex-shrink-0 ${fallbackClassName}`}>
      {getInitials(user)}
    </div>
  );
}