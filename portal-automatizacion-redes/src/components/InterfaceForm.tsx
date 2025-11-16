"use client";

import { useState, FormEvent } from "react";

export default function InterfaceForm() {
  const [loading, setLoading] = useState(false);
  const [deviceIp, setDeviceIp] = useState("");
  const [iface, setIface] = useState("");
  const [desc, setDesc] = useState("");
  const [ip, setIp] = useState("");
  const [prefix, setPrefix] = useState("24");
  const [enabled, setEnabled] = useState(true);
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
        const res = await fetch("/api/interface", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            deviceIp: deviceIp,
            interfaceName: iface,
            description: desc,
            enabled: enabled,
            ipv4Address: ip,
            ipv4Prefix: prefix,
        }),
        });

        if (!res.ok) {
        throw new Error("Error en API");
        }

        const data = await res.json();
        console.log("Respuesta de /api/interface:", data);
        alert("Configuración enviada al API (mock).");
    } catch (err) {
        console.error(err);
        alert("Error al enviar configuración.");
    } finally {
        setLoading(false);
    }
    };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-800/60 border border-slate-700 rounded-xl p-6 space-y-5"
    >
      <h2 className="text-xl font-semibold text-sky-400">
        Configurar Interfaz
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="IP del dispositivo"
          value={deviceIp}
          onChange={(e) => setDeviceIp(e.target.value)}
          className="input"
          required
        />

        <input
          type="text"
          placeholder="Nombre de interfaz (Gi1, Gi2...)"
          value={iface}
          onChange={(e) => setIface(e.target.value)}
          className="input"
          required
        />
      </div>

      <textarea
        placeholder="Descripción"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        className="input"
      />

      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Dirección IPv4"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          className="input"
        />
        <input
          type="number"
          placeholder="Prefijo"
          min={0}
          max={32}
          value={prefix}
          onChange={(e) => setPrefix(e.target.value)}
          className="input"
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
          className="h-4 w-4"
        />
        Habilitar interfaz
      </label>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 rounded-md bg-green-500 hover:bg-green-400 font-semibold text-slate-900 transition-all"
      >
        {loading ? "Enviando..." : "Aplicar Configuración"}
      </button>
    </form>
  );
}
