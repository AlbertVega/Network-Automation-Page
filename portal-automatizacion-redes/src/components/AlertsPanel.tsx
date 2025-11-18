"use client";
import { useEffect, useState, useRef } from "react";
import SeverityPill from "@/components/ui/SeverityPill";

type Alert = {
  id: number;
  device: string;
  interface: string;
  severity: "info" | "critical";
  message: string;
  timestamp: string;
  oldStatus?: string;
  newStatus?: string;
};

export default function AlertsPanel({ onAlertsChange }: { onAlertsChange?: (hasNew: boolean) => void }) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const prevAlertCount = useRef(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/alert", { cache: "no-store" });
        const json = await res.json();
        setAlerts(json.alerts ?? []);
        setError(false);
        if (onAlertsChange) {
          onAlertsChange((json.alerts?.length ?? 0) > prevAlertCount.current);
          prevAlertCount.current = json.alerts?.length ?? 0;
        }
      } catch (e) {
        setError(true);
        setAlerts([]);
      }
    }
    load();
    const interval = setInterval(load, 30000); // Polling cada 30 segundos
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-slate-800/60 border border-slate-700 rounded-2xl p-8 space-y-4 w-full shadow-lg">
      <h2 className="text-xl font-semibold text-sky-400">Alertas recientes</h2>
      {error ? (
        <p className="text-red-500">No se pudo conectar con alertas</p>
      ) : alerts.length === 0 ? (
        <p className="text-sm text-slate-400">No hay alertas recientes.</p>
      ) : (
        <ul className="space-y-3">
          {alerts.map((a) => (
            <li
              key={a.id}
              className={`flex flex-col gap-1 rounded-lg border ${
                a.severity === "critical"
                  ? "border-red-600 bg-red-950/70"
                  : "border-green-600 bg-slate-900/70"
              } p-3`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">{a.device} · {a.interface}</span>
                <SeverityPill severity={a.severity} />
              </div>
              <p className="text-sm text-slate-200">{a.message}</p>
              {/* Opcional: muestra el cambio de estado */}
              {a.oldStatus && a.newStatus && (
                <span className="text-xs text-slate-400">
                  Cambio: <b>{a.oldStatus}</b> → <b>{a.newStatus}</b>
                </span>
              )}
              <span className="text-[10px] text-slate-500">
                {a.timestamp ? new Date(a.timestamp).toLocaleString() : ""}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}