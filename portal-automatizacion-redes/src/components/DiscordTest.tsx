"use client";
import { useState } from "react";

export default function MonitorPanel() {
  const [msg, setMsg] = useState("");

  const enviar = async () => {
    await fetch("/api/discord/alert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg })
    });
    alert("Alerta enviada a Discord!");
  };

  return (
    <div>
      <h2>Enviar Alerta</h2>
      <input
        type="text"
        placeholder="Mensaje..."
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
      />
      <button onClick={enviar}>Enviar</button>
    </div>
  );
}
