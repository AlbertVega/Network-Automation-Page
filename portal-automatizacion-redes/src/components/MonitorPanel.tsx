"use client";

import { useEffect, useState } from "react";

type XEInterface = { name: string; adminStatus: string; operStatus: string };
type XRInterface = { name: string; operStatus: string; protocol: string };
type NXInterface = { name: string; operStatus: string; vlan: string; duplex: string; speed: string };

export default function MonitorPanel() {
  const [device, setDevice] = useState("xe");
  const [interfaces, setInterfaces] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`/api/monitor?device=${device}`, { cache: "no-store" });
        if (!res.ok) throw new Error("API error");
        const data = await res.json();
        setInterfaces(data.interfaces ?? []);
      } catch {
        setInterfaces([]);
      }
    }
    loadData();
  }, [device]);

  return (
    <section className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 space-y-4 shadow-lg">
      <header className="flex items-center justify-between gap-2 pb-2 border-b border-slate-700">
        <h2 className="text-2xl font-semibold text-sky-400">Monitoreo de interfaces</h2>
        <select
          value={device}
          onChange={e => setDevice(e.target.value)}
          className="input"
        >
          <option value="xe">IOS XE</option>
          <option value="xr">IOS XR</option>
          <option value="nx">NX-OS</option>
        </select>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase text-slate-400 border-b border-slate-700">
            <tr>
              <th className="py-2 text-left">Interfaz</th>
              {device === "xe" && <th className="py-2 text-left">Admin-status</th>}
              <th className="py-2 text-left">Oper-status</th>
              {device === "xr" && <th className="py-2 text-left">Protocolo</th>}
              {device === "nx" && (
                <>
                  <th className="py-2 text-left">VLAN</th>
                  <th className="py-2 text-left">Duplex</th>
                  <th className="py-2 text-left">Speed</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {interfaces.map((iface, idx) => (
              <tr key={idx} className="border-b border-slate-800 hover:bg-slate-700/20 transition">
                <td className="py-2 pr-2">{iface.name}</td>
                {device === "xe" && <td className="py-2 pr-2">{iface.adminStatus}</td>}
                <td className="py-2 pr-2">{iface.operStatus}</td>
                {device === "xr" && <td className="py-2 pr-2">{iface.protocol}</td>}
                {device === "nx" && (
                  <>
                    <td className="py-2 pr-2">{iface.vlan}</td>
                    <td className="py-2 pr-2">{iface.duplex}</td>
                    <td className="py-2 pr-2">{iface.speed}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}