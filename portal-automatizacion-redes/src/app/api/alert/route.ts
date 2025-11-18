import { NextResponse } from "next/server";
import axios from "axios";
import { FASTAPI_URL } from "@/lib/config";

const previousStates: Record<string, string> = {};
const alertHistory: any[] = []; // Almacena las últimas alertas generadas

async function sendDiscordAlert(message: string) {
  try {
    await fetch("http://localhost:3000/api/discord/alert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    console.log("✓ Alerta enviada a Discord:", message);
  } catch (err) {
    console.error("✗ Error enviando alerta a Discord:", err);
  }
}

function getAlertForChange({
  device,
  ifaceName,
  oldStatus,
  newStatus,
}: {
  device: string;
  ifaceName: string;
  oldStatus: string;
  newStatus: string;
}) {
  let severity: "info" | "critical";
  let message: string;

  if (device === "xe") {
    if (["up", "down"].includes(newStatus)) {
      severity = newStatus === "up" ? "info" : "critical";
      message =
        newStatus === "up"
          ? `Aceptable: Interfaz ${ifaceName} está UP en ${device.toUpperCase()}`
          : `Crítico: Interfaz ${ifaceName} está DOWN en ${device.toUpperCase()}`;
      return { device, interface: ifaceName, severity, message, timestamp: new Date().toISOString(), oldStatus, newStatus };
    }
    return null;
  }

  if (device === "xr") {
    if (ifaceName.startsWith("Gi") && ["up", "admin-down"].includes(newStatus)) {
      severity = newStatus === "up" ? "info" : "critical";
      message =
        newStatus === "up"
          ? `Aceptable: Interfaz ${ifaceName} está UP en ${device.toUpperCase()}`
          : `Crítico: Interfaz ${ifaceName} está ADMIN-DOWN en ${device.toUpperCase()}`;
      return { device, interface: ifaceName, severity, message, timestamp: new Date().toISOString(), oldStatus, newStatus };
    }
    return null;
  }

  if (device === "nx") {
    if (ifaceName.startsWith("Et") && ["connected", "notconnect"].includes(newStatus)) {
      severity = newStatus === "connected" ? "info" : "critical";
      message =
        newStatus === "connected"
          ? `Aceptable: Interfaz ${ifaceName} está CONNECTED en ${device.toUpperCase()}`
          : `Crítico: Interfaz ${ifaceName} está NOTCONNECT en ${device.toUpperCase()}`;
      return { device, interface: ifaceName, severity, message, timestamp: new Date().toISOString(), oldStatus, newStatus };
    }
    return null;
  }
  return null;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const device = url.searchParams.get("device") ?? "xe";

  try {
    const res = await axios.get(`${FASTAPI_URL}/status/interfaces?device=${device}`);
    const raw = res.data;
    const interfacesRaw = Array.isArray(raw.interfaces) ? raw.interfaces : [];

    console.log(`\n[${device}] Interfaces recibidas: ${interfacesRaw.length}`);

    for (const [idx, iface] of interfacesRaw.entries()) {
      const ifaceName = iface.name ?? `Unknown-${idx}`;
      let status = (iface.status ?? iface.operStatus ?? "").toLowerCase();
      const key = `${device}-${ifaceName}`;
      const prevStatus = previousStates[key];

      console.log(`  ${ifaceName}: ${prevStatus ?? 'INIT'} -> ${status}`);

      // Inicializar estado si no existe
      if (prevStatus === undefined) {
        previousStates[key] = status;
        continue;
      }

      // Detectar cambio
      if (prevStatus !== status) {
        const alert = getAlertForChange({
          device,
          ifaceName,
          oldStatus: prevStatus,
          newStatus: status,
        });
        
        if (alert) {
          const alertWithId = { ...alert, id: Date.now() + idx };
          alertHistory.unshift(alertWithId);
          if (alertHistory.length > 50) alertHistory.pop(); // Mantener últimas 50
          
          console.log(`  ⚠️  ALERTA: ${alert.message}`);
          await sendDiscordAlert(alert.message);
        }
      }
      
      previousStates[key] = status;
    }

    return NextResponse.json({ device, alerts: alertHistory }, { status: 200 });
  } catch (err: any) {
    console.error(`Error en GET /api/alert:`, err.message);
    return NextResponse.json({ device, alerts: alertHistory }, { status: 200 });
  }
}