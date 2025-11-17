"use client";

import { useState, ChangeEvent } from "react";

type InterfaceConfig = {
  deviceIp: string;
  interfaceName: string;
  description?: string;
  enabled: boolean;
  ipv4Address?: string;
  ipv4Prefix?: string;
};

export default function BulkInterfaceUpload() {
  const [fileConfigs, setFileConfigs] = useState<InterfaceConfig[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    setSuccessMsg(null);

    const file = e.target.files?.[0];
    if (!file) {
      setFileConfigs(null);
      return;
    }

    try {
      const text = await file.text();
      const json = JSON.parse(text);

      if (!Array.isArray(json)) {
        throw new Error("El archivo JSON debe contener un arreglo de objetos.");
      }

      setFileConfigs(json);
    } catch (err) {
      console.error(err);
      setFileConfigs(null);
      setErrorMsg(
        "No se pudo leer o interpretar el archivo. Verifique el formato JSON."
      );
    }
  };

  const handleSendBulk = async () => {
    if (!fileConfigs || fileConfigs.length === 0) {
      setErrorMsg("No hay configuraciones cargadas desde el archivo.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch("/api/interface", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fileConfigs),
      });

      if (!res.ok) {
        throw new Error("Error en API");
      }

      const data = await res.json();
      console.log("Respuesta /api/interface (bulk):", data);

      if (data.mode === "bulk") {
        setSuccessMsg(
          `Configuraciones procesadas: ${data.total} (exitosas: ${data.success}, fallidas: ${data.failed}).`
        );
      } else {
        setSuccessMsg("Respuesta inesperada del API (no es modo bulk).");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Ocurrió un error al enviar la configuración masiva.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-slate-800/60 border border-slate-700 rounded-xl p-6 space-y-4">
      <h2 className="text-xl font-semibold text-sky-400">
        Configuración por archivo
      </h2>

      <p className="text-sm text-slate-300">
        Cargue un archivo JSON con una lista de interfaces para aplicar la configuración de forma masiva.
      </p>

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        {/* Botón de archivo resaltado */}
        <label
          htmlFor="bulk-json-upload"
          className="cursor-pointer px-4 py-2 rounded-md bg-green-500 hover:bg-green-400 text-slate-900 font-semibold border border-green-300 shadow transition"
        >
          {fileConfigs ? "Archivo cargado" : "Elegir archivo JSON"}
          <input
            id="bulk-json-upload"
            type="file"
            accept="application/json"
            onChange={handleFileChange}
            className="hidden" // Oculta el input nativo
          />
        </label>

        <button
          type="button"
          disabled={!fileConfigs || loading}
          onClick={handleSendBulk}
          className="px-4 py-2 rounded-md bg-sky-500 hover:bg-sky-400 font-semibold text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? "Procesando..." : "Aplicar archivo"}
        </button>
      </div>

      {fileConfigs && (
        <p className="text-xs text-slate-400">
          Entradas cargadas desde archivo: {fileConfigs.length}
        </p>
      )}

      {errorMsg && <p className="text-xs text-red-400">{errorMsg}</p>}
      {successMsg && <p className="text-xs text-green-400">{successMsg}</p>}
    </section>
  );
}