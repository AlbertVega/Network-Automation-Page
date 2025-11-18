import { NextResponse } from "next/server";
import axios from "axios";
import { FASTAPI_URL } from "@/lib/config";

// Simple store para demo; usa memoria del proceso
const previousStates: Record<string, string> = {}; // key: device-interface, value: status

async function sendDiscordAlert(message: string) {
  try {
    await fetch("http://localhost:3000/api/discord/alert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
  } catch (err) {
    console.error("Error enviando alerta a Discord", err);
  }
}

function getAlertForChange({ device, ifaceName, oldStatus, newStatus }: {
  device: string;
  ifaceName: string;
  oldStatus: string;
  newStatus: string;
}) {
  let severity: "info" | "warning" | "critical";
  let message: string;
  if (newStatus === "up") {
    severity = "info";
    message = `Aceptable: Conexión estable en ${ifaceName} (${device.toUpperCase()})`;
  } else if (
    newStatus === "down" ||
    newStatus === "admin-down" ||
    newStatus === "notconnect"
  ) {
    severity = "critical";
    message = `Crítico: Sin conexión en ${ifaceName} (${device.toUpperCase()})`;
  } else {
    severity = "warning";
    message = `Advertencia: Estado no reconocido en ${ifaceName} (${device.toUpperCase()}): ${newStatus}`;
  }
  return {
    device,
    interface: ifaceName,
    severity,
    message,
    timestamp: new Date().toISOString(),
    oldStatus,
    newStatus,
  };
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const device = url.searchParams.get("device") ?? "xe";

  try {
    const res = await axios.get(`${FASTAPI_URL}/status/interfaces?device=${device}`);
    const raw = res.data;
    const interfacesRaw = Array.isArray(raw.interfaces) ? raw.interfaces : [];

    // List of alerts to return/show
    const alerts = [];

    for (const [idx, iface] of interfacesRaw.entries()) {
      const ifaceName = iface.name ?? `Unknown-${idx}`;
      const status = (iface.status ?? iface.operStatus ?? "").toLowerCase();

      const key = `${device}-${ifaceName}`;
      const prevStatus = previousStates[key];

      // Solo alertamos si hubo CAMBIO de estado (o nunca hemos visto ese estado)
      if (prevStatus !== undefined && prevStatus !== status) {
        const alert = getAlertForChange({
          device,
          ifaceName,
          oldStatus: prevStatus,
          newStatus: status,
        });
        alerts.push({ ...alert, id: idx });

        // ALERTA a Discord solo en caso de cambio
        await sendDiscordAlert(alert.message);
      }

      // Guardamos el estado actual
      previousStates[key] = status;
    }

    // Devuelve solo alertas de cambio en esta consulta
    return NextResponse.json({ device, alerts }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ device, alerts: [] }, { status: 200 });
  }
}