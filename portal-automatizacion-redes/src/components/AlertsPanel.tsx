"use client";

import { useEffect, useState } from "react";

type Alert = {
  id: number;
  device: string;
  interface: string;
  severity: "info" | "warning" | "critical";
  message: string;
  timestamp: string;
};

export default function AlertsPanel() {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/alert", { cache: "no-store" });
      const json = await res.json();
      setAlerts(json);
    }
    load();
  }, []);

  return (
    <section className="bg-slate-800/60 border border-slate-700 rounded-2xl p-8 space-y-4 w-full shadow-lg">
      <h2 className="text-xl font-semibold text-sky-400">Alertas recientes</h2>

      {alerts.length === 0 ? (
        <p className="text-sm text-slate-400">No hay alertas activas.</p>
      ) : (
        <ul className="space-y-3">
          {alerts.map((a) => (
            <li
              key={a.id}
              className="flex flex-col gap-1 rounded-lg border border-slate-600 bg-slate-900/70 p-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">
                  {a.device} · {a.interface}
                </span>
                <SeverityPill severity={a.severity} />
              </div>
              <p className="text-sm text-slate-200">{a.message}</p>
              <span className="text-[10px] text-slate-500">
                {new Date(a.timestamp).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function SeverityPill({ severity }: { severity: Alert["severity"] }) {
  const base =
    "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold";

  if (severity === "critical") {
    return (
      <span className={`${base} bg-red-500/20 text-red-300 border border-red-500/40`}>
        ● critical
      </span>
    );
  }
  if (severity === "warning") {
    return (
      <span className={`${base} bg-yellow-500/20 text-yellow-300 border border-yellow-500/40`}>
        ● warning
      </span>
    );
  }
  return (
    <span className={`${base} bg-sky-500/20 text-sky-300 border border-sky-500/40`}>
      ● info
    </span>
  );
}
