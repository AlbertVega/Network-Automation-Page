"use client";

import { useEffect, useState } from "react";

type InterfaceStatus = {
  name: string;
  device: string;
  adminUp: boolean;
  operUp: boolean;
  trafficInKbps: number;
  errors: number;
};

const MOCK_DATA: InterfaceStatus[] = [
  {
    name: "GigabitEthernet1",
    device: "R1-Core",
    adminUp: true,
    operUp: true,
    trafficInKbps: 1200,
    errors: 0,
  },
  {
    name: "GigabitEthernet2",
    device: "R1-Core",
    adminUp: true,
    operUp: false,
    trafficInKbps: 0,
    errors: 3,
  },
  {
    name: "GigabitEthernet0/0",
    device: "R2-Edge",
    adminUp: true,
    operUp: true,
    trafficInKbps: 340,
    errors: 1,
  },
];

export default function MonitorPanel() {
  const [interfaces, setInterfaces] = useState<InterfaceStatus[]>(MOCK_DATA);

  // Aquí después podrías hacer polling al backend
  useEffect(() => {
    // Ejemplo futuro:
    // fetch("/api/monitor")
    //   .then((r) => r.json())
    //   .then((data) => setInterfaces(data));
  }, []);

  return (
    <section className="bg-slate-800/60 border border-slate-700 rounded-xl p-6 space-y-4">
      <header className="flex items-center justify-between gap-2">
        <h2 className="text-xl font-semibold text-sky-400">
          Monitoreo de interfaces
        </h2>
        <span className="text-xs bg-slate-900 border border-slate-700 px-2 py-1 rounded-full text-slate-300">
          Modo demo (datos simulados)
        </span>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase text-slate-400 border-b border-slate-700">
            <tr>
              <th className="py-2 text-left">Dispositivo</th>
              <th className="py-2 text-left">Interfaz</th>
              <th className="py-2 text-left">Admin</th>
              <th className="py-2 text-left">Oper</th>
              <th className="py-2 text-right">Tráfico (kbps)</th>
              <th className="py-2 text-right">Errores</th>
            </tr>
          </thead>
          <tbody>
            {interfaces.map((iface) => (
              <tr key={`${iface.device}-${iface.name}`} className="border-b border-slate-800">
                <td className="py-2 pr-2">{iface.device}</td>
                <td className="py-2 pr-2">{iface.name}</td>
                <td className="py-2 pr-2">
                  <StatusPill up={iface.adminUp} label={iface.adminUp ? "up" : "down"} />
                </td>
                <td className="py-2 pr-2">
                  <StatusPill
                    up={iface.operUp}
                    label={iface.operUp ? "up" : "down"}
                    critical={!iface.operUp && iface.adminUp}
                  />
                </td>
                <td className="py-2 pr-2 text-right">
                  {iface.trafficInKbps.toLocaleString("en-US")}
                </td>
                <td className="py-2 text-right">
                  <span
                    className={
                      iface.errors > 0
                        ? "text-red-400 font-semibold"
                        : "text-slate-300"
                    }
                  >
                    {iface.errors}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function StatusPill({
  up,
  label,
  critical,
}: {
  up: boolean;
  label: string;
  critical?: boolean;
}) {
  const base =
    "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold";
  if (up) {
    return (
      <span className={`${base} bg-green-500/20 text-green-300 border border-green-500/40`}>
        ● {label}
      </span>
    );
  }
  if (critical) {
    return (
      <span className={`${base} bg-red-500/20 text-red-300 border border-red-500/40`}>
        ● {label}
      </span>
    );
  }
  return (
    <span className={`${base} bg-slate-700 text-slate-200 border border-slate-600`}>
      ● {label}
    </span>
  );
}
