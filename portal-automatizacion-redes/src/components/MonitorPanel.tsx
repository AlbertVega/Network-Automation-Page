"use client";

import { useEffect, useState } from "react";

type InterfaceStatus = {
  name: string;
  device: string;
  adminUp: boolean;
};

const FALLBACK_DATA: InterfaceStatus[] = [];

export default function MonitorPanel() {
  const [interfaces, setInterfaces] = useState<InterfaceStatus[]>(FALLBACK_DATA);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/monitor", { cache: "no-store" });
        if (!res.ok) throw new Error("API error");
        const data = await res.json();

        // Puede venir como { interfaces: [...] } o como [...]
        // Detectamos cuáles son interfaces
        const interfacesRaw =
          Array.isArray(data)
            ? data
            : Array.isArray(data.interfaces)
              ? data.interfaces
              : [];

        // Adaptamos los campos para todos los tipos de equipo
        const mappedData: InterfaceStatus[] = interfacesRaw.map((iface: any) => {
          // XE: admin-status
          let adminStatus = iface["admin-status"];
          // NXOS: state
          if (adminStatus === undefined && iface.state) adminStatus = iface.state;
          // XR: status
          if (adminStatus === undefined && iface.status) adminStatus = iface.status;
          // Si oper-status mejor te sirve, también puedes usarlo

          // El campo device puede no venir, así que lo inferimos por fuente (puedes mejorarlo en backend)
          // Ejemplo: siéntete libre de mejorar esto según tu API
          const device =
            iface.device ||
            iface.source === "cli" ? "xr"
            : iface.vlan !== undefined ? "nx"
            : "xe";

          return {
            name: iface.name || iface.interface || iface["interface-name"] || "Unknown",
            device,
            adminUp: (adminStatus ?? "unknown").toLowerCase() === "up"
          };
        });

        setInterfaces(mappedData);
      } catch (e) {
        console.warn("Usando datos simulados (fallback)");
        setInterfaces(FALLBACK_DATA);
      }
    }

    loadData();
  }, []);

  return (
    <section className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 space-y-4 shadow-lg">
      <header className="flex items-center justify-between gap-2 pb-2 border-b border-slate-700">
        <h2 className="text-2xl font-semibold text-sky-400">
          Monitoreo de interfaces
        </h2>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase text-slate-400 border-b border-slate-700">
            <tr>
              <th className="py-2 text-left">Dispositivo</th>
              <th className="py-2 text-left">Interfaz</th>
              <th className="py-2 text-left">Admin</th>
            </tr>
          </thead>

          <tbody>
            {interfaces.map((iface) => (
              <tr
                key={`${iface.device}-${iface.name}`}
                className="border-b border-slate-800 hover:bg-slate-700/20 transition"
              >
                <td className="py-2 pr-2">{iface.device}</td>
                <td className="py-2 pr-2">{iface.name}</td>
                <td className="py-2 pr-2">
                  <StatusPill up={iface.adminUp} label={iface.adminUp ? "up" : "down"} />
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
}: {
  up: boolean;
  label: string;
}) {
  const base =
    "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold";

  if (up) {
    return (
      <span className={`${base} bg-green-500/20 text-green-300 border border-green-500/40`}>
        {label}
      </span>
    );
  }

  return (
    <span className={`${base} bg-slate-700 text-slate-200 border border-slate-600`}>
      {label}
    </span>
  );
}