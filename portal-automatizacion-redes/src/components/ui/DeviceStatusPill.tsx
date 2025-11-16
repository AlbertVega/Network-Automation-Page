"use client";

type DeviceStatus = "online" | "offline";

export default function DeviceStatusPill({ status }: { status: DeviceStatus }) {
  const base =
    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide border";

  const styles = {
    online: "bg-green-600/20 text-green-300 border-green-600/40",
    offline: "bg-red-600/20 text-red-300 border-red-600/40",
  };

  const labels = {
    online: "ONLINE",
    offline: "OFFLINE",
  };

  return (
    <span className={`${base} ${styles[status]}`}>
      <span className="text-lg leading-none">●</span>
      <span className="font-bold">{labels[status]}</span>
    </span>
  );
}
