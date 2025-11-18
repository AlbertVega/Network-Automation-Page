"use client";
import { useEffect, useState } from "react";

type Syslog = {
  cpu_percent: number | null;
  memory_percent: number | null;
};

export default function SyslogsPanel() {
  const [syslogs, setSyslogs] = useState<Syslog | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/syslogs");
        if (!res.ok) throw new Error("No se pudo conectar con la API");
        const data = await res.json();
        setSyslogs(data.syslogs);
        setError(null);
      } catch (err) {
        setSyslogs(null);
        setError("Error de conexión");
      }
    }
    load();
    // Opcional: refresca cada 60 segundos
    // const interval = setInterval(load, 60000);
    // return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-slate-800/70 border border-slate-700 rounded-xl p-6 w-full space-y-6 max-w-md mx-auto shadow-lg">
      <h2 className="text-xl font-bold text-yellow-400">Syslogs (Monitoreo XE)</h2>
      {error ? (
        <div className="text-red-500 font-bold">Error: {error}</div>
      ) : (
        <div>
          <div className="py-2 border-b border-slate-600 flex items-center">
            <span className="font-semibold text-sky-300 min-w-[70px]">CPU:</span>
            {typeof syslogs?.cpu_percent === "number" ? (
              <span className={syslogs.cpu_percent > 80 ? "text-red-400 font-bold" : "text-green-400"}>
                {syslogs.cpu_percent}%
              </span>
            ) : (
              <span className="text-slate-400">Sin datos</span>
            )}
          </div>
          <div className="py-2 flex items-center">
            <span className="font-semibold text-sky-300 min-w-[70px]">Memoria:</span>
            {typeof syslogs?.memory_percent === "number" ? (
              <span className={syslogs.memory_percent > 80 ? "text-red-400 font-bold" : "text-green-400"}>
                {syslogs.memory_percent}%
              </span>
            ) : (
              <span className="text-slate-400">Sin datos</span>
            )}
          </div>
        </div>
      )}
    </section>
  );
}