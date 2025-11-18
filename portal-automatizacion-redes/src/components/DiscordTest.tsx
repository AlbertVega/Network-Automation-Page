"use client";
import { useState } from "react";

export default function MonitorPanel() {
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const enviar = async () => {
    setLoading(true);
    setSent(false);
    const res = await fetch("/api/discord/alert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg })
    });
    setLoading(false);
    setSent(true);
    setMsg("");
  };

  return (
    <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-6 shadow-md max-w-lg mx-auto space-y-5">
      <h2 className="text-xl font-semibold text-sky-400">Enviar alerta manual a Discord</h2>
      <div>
        <textarea
          placeholder="Escribe el mensaje de alerta..."
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          rows={5}
          className="w-full p-3 rounded-md border border-slate-600 bg-slate-900/50 text-slate-100 resize-none focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
      </div>
      <button
        onClick={enviar}
        disabled={loading || !msg.trim()}
        className={`px-4 py-2 rounded-md font-semibold text-white bg-sky-600 hover:bg-sky-700 transition flex items-center ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {loading ? "Enviando..." : "Enviar"}
      </button>
      {sent && (
        <div className="text-green-400 font-medium">
          ¡Alerta enviada a Discord!
        </div>
      )}
    </div>
  );
}