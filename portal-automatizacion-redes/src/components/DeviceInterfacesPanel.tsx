import { useEffect, useState } from "react";

type Device = {
  id: string;
  name: string;
  mgmtIp: string;
  role: string;
  status: "online" | "offline";
  type: "xe" | "xr" | "nx";
};

type PanelProps = { device: Device; };

export default function DeviceInterfacesPanel({ device }: PanelProps) {
  const [interfaces, setInterfaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchIfaces() {
      setLoading(true);
      // Aquí va tu fetch por ID
      const res = await fetch(`/api/device/${device.id}/interfaces`);
      const data = await res.json();
      setInterfaces(data.interfaces ?? []);
      setLoading(false);
    }
    fetchIfaces();
  }, [device.id]);

  return (
    <div className="mt-4 bg-slate-700/50 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-sky-300 mb-2">
        Interfaces para {device.name} ({device.type.toUpperCase()}) — {device.mgmtIp}
      </h3>

      {loading ? (
        <div className="text-slate-400">Cargando interfaces...</div>
      ) : (
        <table className="w-full text-sm">
          <thead className="text-xs uppercase text-slate-400 border-b border-slate-700">
            <tr>
              <th className="py-2 text-left">Interfaz</th>
              {device.type === "xe" && <th className="py-2 text-left">Admin-status</th>}
              <th className="py-2 text-left">Oper-status</th>
              {device.type === "xr" && <th className="py-2 text-left">Protocolo</th>}
              {device.type === "nx" && (
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
              <tr key={idx} className="border-b border-slate-800">
                <td className="py-2 pr-2">{iface.name}</td>
                {device.type === "xe" && <td className="py-2 pr-2">{iface.adminStatus}</td>}
                <td className="py-2 pr-2">{iface.operStatus}</td>
                {device.type === "xr" && <td className="py-2 pr-2">{iface.protocol}</td>}
                {device.type === "nx" && (
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
      )}
    </div>
  );
}