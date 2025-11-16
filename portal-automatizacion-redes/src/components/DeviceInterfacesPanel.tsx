"use client";

import { useEffect, useState } from "react";

type InterfaceStatus = {
  name: string;
  deviceId: string;
  adminUp: boolean;
  operUp: boolean;
  trafficInKbps: number;
  errors: number;
};

export default function DeviceInterfacesPanel({
  deviceId,
}: {
  deviceId: string;
}) {
  const [interfaces, setInterfaces] = useState<InterfaceStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/device/${deviceId}/interfaces`, {
          cache: "no-store",
        });
        const json = await res.json();
        setInterfaces(json);
      } catch (e) {
        console.error("Error cargando interfaces:", e);
        setInterfaces([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [deviceId]);

  return (
    <section className="mt-4 bg-slate-900/70 border border-slate-700 rounded-2xl p-6 space-y-4 shadow-lg">
      <h3 className="text-lg font-semibold text-sky-300">
        Interfaces del dispositivo: {deviceId}
      </h3>

      {loading ? (
        <p className="text-sm text-slate-400">Cargando interfaces...</p>
      ) : interfaces.length === 0 ? (
        <p className="text-sm text-slate-400">
          No se encontraron interfaces para este dispositivo.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase text-slate-400 border-b border-slate-700">
              <tr>
                <th className="py-2 text-left">Interfaz</th>
                <th className="py-2 text-left">Admin</th>
                <th className="py-2 text-left">Oper</th>
                <th className="py-2 text-right">Tráfico (kbps)</th>
                <th className="py-2 text-right">Errores</th>
              </tr>
            </thead>
            <tbody>
              {interfaces.map((iface) => (
                <tr
                  key={iface.name}
                  className="border-b border-slate-800 hover:bg-slate-800/40 transition"
                >
                  <td className="py-2 pr-2">{iface.name}</td>
                  <td className="py-2 pr-2">
                    {iface.adminUp ? "up" : "down"}
                  </td>
                  <td className="py-2 pr-2">
                    {iface.operUp ? "up" : "down"}
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
      )}
    </section>
  );
}
