import axios from "axios";

// URL de tu backend FastAPI. Ajusta al dominio correcto.
const FASTAPI_URL = process.env.FASTAPI_URL || "http://localhost:8000/api/interface";

/**
 * Envía una sola configuración de interfaz a FastAPI.
 */
export async function pushInterfaceConfig(config: any) {
  // ajusta la URL o manejo según tu backend
  const res = await axios.post(FASTAPI_URL, config);
  return res.data;
}

/**
 * Envía múltiples configuraciones de interfaz a FastAPI.
 * Puede enviar una por una o hacer batching, según tu backend.
 */
export async function pushBulkInterfaceConfigs(configs: any[]) {
  // Ejemplo: envío de cada configuracion por separado (más robusto para errores)
  let success = 0, failed = 0;
  let results = [];

  for (const config of configs) {
    try {
      const data = await pushInterfaceConfig(config);
      results.push({ config, status: "success", data });
      success++;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      results.push({ config, status: "failed", error: errorMessage });
      failed++;
    }
  }
  return {
    mode: "bulk",
    total: configs.length,
    success,
    failed,
    results,
  };
}