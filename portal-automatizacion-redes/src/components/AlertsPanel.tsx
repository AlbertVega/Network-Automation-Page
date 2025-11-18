"use client";

import { useEffect, useState } from "react";
import SeverityPill from "@/components/ui/SeverityPill";

type Interface = {
  name: string;
  operStatus?: string;
  device?: string;
};

type Alert = {
  id: number;
  device: string;
  interface: string;
  severity: "critical";
  message: string;
  timestamp: string;
};

export default function AlertsPanel() {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/alert", { cache: "no-store" });
      const json = await res.json();

      // Si tu backend no filtra, se asume que json.interfaces está presente
      const interfaces: Interface[] = json.interfaces ?? [];

      // Filtramos solo las interfaces sin conexión
      const critAlerts: Alert[] = interfaces
        .filter(
          (iface) =>
            ["down", "admin-down", "notconnect"].includes(
              (iface.operStatus ?? "").toLowerCase()
            )
        )
        .map((iface, idx) => ({
          id: idx,
          device: json.device ?? iface.device ?? "Desconocido",
          interface: iface.name ?? "Desconocido",
          severity: "critical",
          message: "Crítico: Sin conexión",
          timestamp: new Date().toISOString(),
        }));

      setAlerts(critAlerts);
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
                {a.timestamp
                  ? new Date(a.timestamp).toLocaleString()
                  : ""}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}