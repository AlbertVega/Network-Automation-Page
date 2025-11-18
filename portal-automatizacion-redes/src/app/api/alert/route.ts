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
  let severity: "info" | "critical";
  let message: string;
  // XE
  if (device === "xe") {
    if (["up", "down"].includes(newStatus)) {
      severity = newStatus === "up" ? "info" : "critical";
      message =
        newStatus === "up"
          ? `Aceptable: Interfaz ${ifaceName} está UP en ${device.toUpperCase()}`
          : `Crítico: Interfaz ${ifaceName} está DOWN en ${device.toUpperCase()}`;
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
    return null;
  }
  // XR
  if (device === "xr") {
    if (ifaceName.startsWith("Gi") && ["up", "admin-down"].includes(newStatus)) {
      severity = newStatus === "up" ? "info" : "critical";
      message =
        newStatus === "up"
          ? `Aceptable: Interfaz ${ifaceName} está UP en ${device.toUpperCase()}`
          : `Crítico: Interfaz ${ifaceName} está ADMIN-DOWN en ${device.toUpperCase()}`;
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
    return null;
  }
  // NX
  if (device === "nx") {
    if (ifaceName.startsWith("Et") && ["connected", "notconnect"].includes(newStatus)) {
      severity = newStatus === "connected" ? "info" : "critical";
      message =
        newStatus === "connected"
          ? `Aceptable: Interfaz ${ifaceName} está CONNECTED en ${device.toUpperCase()}`
          : `Crítico: Interfaz ${ifaceName} está NOTCONNECT en ${device.toUpperCase()}`;
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

    const alerts = [];

    for (const [idx, iface] of interfacesRaw.entries()) {
      const ifaceName = iface.name ?? `Unknown-${idx}`;
      // Normaliza status según tipo de dispositivo
      let status = (iface.status ?? iface.operStatus ?? "").toLowerCase();

      const key = `${device}-${ifaceName}`;
      const prevStatus = previousStates[key];

      // Comprueba cambio relevante
      if (
        prevStatus !== undefined &&
        prevStatus !== status
      ) {
        const alert = getAlertForChange({
          device,
          ifaceName,
          oldStatus: prevStatus,
          newStatus: status,
        });
        if (alert) {
          alerts.push({ ...alert, id: idx });
          await sendDiscordAlert(alert.message);
        }
      }

      // Actualiza estado
      previousStates[key] = status;
    }

    return NextResponse.json({ device, alerts }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ device, alerts: [] }, { status: 200 });
  }
}