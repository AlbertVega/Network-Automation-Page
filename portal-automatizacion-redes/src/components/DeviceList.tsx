"use client";

type Device = {
  name: string;
  mgmtIp: string;
  role: string;
  status: "online" | "offline";
};

const MOCK_DEVICES: Device[] = [
  { name: "R1-Core", mgmtIp: "10.0.0.1", role: "Core / Backbone", status: "online" },
  { name: "R2-Edge", mgmtIp: "10.0.0.2", role: "Edge / ISP", status: "online" },
  { name: "R3-Branch", mgmtIp: "10.0.0.3", role: "Sucursal", status: "offline" },
];

export default function DeviceList() {
  return (
    <section className="bg-slate-800/60 border border-slate-700 rounded-2xl p-8 space-y-4 w-full shadow-lg">
      <h2 className="text-xl font-semibold text-sky-400">
        Dispositivos en la topología
      </h2>
      <p className="text-sm text-slate-200">
        Esta vista resume los dispositivos que forman parte del sandbox. Más
        adelante, se alimentará desde el backend en Python o una base de datos.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase text-slate-400 border-b border-slate-700">
            <tr>
              <th className="py-2 text-left">Nombre</th>
              <th className="py-2 text-left">IP gestión</th>
              <th className="py-2 text-left">Rol</th>
              <th className="py-2 text-left">Estado</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_DEVICES.map((d) => (
              <tr key={d.name} className="border-b border-slate-800">
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
                    ● {d.status}
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
