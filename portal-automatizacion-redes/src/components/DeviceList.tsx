"use client";

import { useState } from "react";
import DeviceInterfacesPanel from "@/components/DeviceInterfacesPanel";

type Device = {
  id: string;
  name: string;
  mgmtIp: string;
  role: string;
  status: "online" | "offline";
  type: "xe" | "xr" | "nx";
};

const devices: Device[] = [
  {
    id: "1",
    name: "Catalyst 8000v",
    mgmtIp: "10.10.20.48",
    role: "router",
    status: "online",
    type: "xe"
  },
  {
    id: "2",
    name: "IOS XRv 9K",
    mgmtIp: "10.10.20.35",
    role: "router",
    status: "online",
    type: "xr"
  },
  {
    id: "3",
    name: "Nexus 9K",
    mgmtIp: "10.10.20.40",
    role: "switch",
    status: "online",
    type: "nx"
  }
];

export default function DeviceList() {
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const selectedDevice = devices.find(d => d.id === selectedDeviceId);

  return (
    <section className="bg-slate-800/60 border border-slate-700 rounded-2xl p-8 space-y-4 w-full shadow-lg">
      <h2 className="text-xl font-semibold text-sky-400">
        Dispositivos en la topología
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase text-slate-400 border-b border-slate-700">
            <tr>
              <th className="py-2 text-left">Nombre</th>
              <th className="py-2 text-left">IP gestión</th>
              <th className="py-2 text-left">Rol</th>
              <th className="py-2 text-left">Estado</th>
              <th className="py-2 text-left">Plataforma</th>
              <th className="py-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {devices.map((d) => (
              <tr key={d.id} className="border-b border-slate-800">
                <td className="py-2 pr-2">{d.name}</td>
                <td className="py-2 pr-2">{d.mgmtIp}</td>
                <td className="py-2 pr-2">{d.role}</td>
                <td className="py-2 pr-2">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                      d.status === "online"
                        ? "bg-green-500/20 text-green-300 border border-green-500/50"
                        : "bg-red-500/20 text-red-300 border border-red-500/50"
                    }`}
                  >
                    {d.status}
                  </span>
                </td>
                <td className="py-2 pr-2 uppercase">{d.type}</td>
                <td className="py-2 pr-2">
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedDeviceId(
                        selectedDeviceId === d.id ? null : d.id
                      )
                    }
                    className="text-xs px-3 py-1 rounded-md border border-slate-600 bg-slate-900/70 hover:bg-slate-700/70 font-semibold text-slate-100"
                  >
                    {selectedDeviceId === d.id
                      ? "Ocultar interfaces"
                      : "Ver interfaces"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Panel de interfaces del dispositivo seleccionado */}
      {selectedDevice && (
        <DeviceInterfacesPanel device={selectedDevice} />
      )}
    </section>
  );
}