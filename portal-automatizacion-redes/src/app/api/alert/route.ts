import { NextResponse } from "next/server";
import axios from "axios";
import { FASTAPI_URL } from "@/lib/config";

const previousStates: Record<string, string> = {};
const alertHistory: any[] = [];

async function sendDiscordAlert(message: string) {
  try {
    const res = await fetch("http://localhost:5000/send-alert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    const data = await res.json();
    console.log("✓ Alerta enviada a Discord:", data);
    return true;
  } catch (err) {
    console.error("✗ Error enviando alerta a Discord:", err);
    return false;
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
    if (!["up", "down"].includes(newStatus)) {
      return null;
    }
    severity = newStatus === "up" ? "info" : "critical";
    message =
      newStatus === "up"
        ? `Aceptable: Interfaz ${ifaceName} está UP en ${device.toUpperCase()}`
        : `Crítico: Interfaz ${ifaceName} está DOWN en ${device.toUpperCase()}`;
    return { device, interface: ifaceName, severity, message, timestamp: new Date().toISOString(), oldStatus, newStatus };
  }

  if (device === "xr") {
    if (!ifaceName.startsWith("Gi")) {
      return null;
    }
    if (!["up", "admin-down"].includes(newStatus)) {
      return null;
    }
    severity = newStatus === "up" ? "info" : "critical";
    message =
      newStatus === "up"
        ? `Aceptable: Interfaz ${ifaceName} está UP en ${device.toUpperCase()}`
        : `Crítico: Interfaz ${ifaceName} está ADMIN-DOWN en ${device.toUpperCase()}`;
    return { device, interface: ifaceName, severity, message, timestamp: new Date().toISOString(), oldStatus, newStatus };
  }

  if (device === "nx") {
    if (!ifaceName.startsWith("Et")) {
      return null;
    }
    if (!["connected", "notconnect"].includes(newStatus)) {
      return null;
    }
    severity = newStatus === "connected" ? "info" : "critical";
    message =
      newStatus === "connected"
        ? `Aceptable: Interfaz ${ifaceName} está CONNECTED en ${device.toUpperCase()}`
        : `Crítico: Interfaz ${ifaceName} está NOTCONNECT en ${device.toUpperCase()}`;
    return { device, interface: ifaceName, severity, message, timestamp: new Date().toISOString(), oldStatus, newStatus };
  }

  return null;
}

async function checkDeviceInterfaces(device: string) {
  try {
    const res = await axios.get(`${FASTAPI_URL}/status/interfaces?device=${device}`);
    const raw = res.data;
    const interfacesRaw = Array.isArray(raw.interfaces) ? raw.interfaces : [];

    console.log(`[${device.toUpperCase()}] Interfaces recibidas: ${interfacesRaw.length}`);

    for (const [idx, iface] of interfacesRaw.entries()) {
      const ifaceName = iface.name ?? `Unknown-${idx}`;
      let status = (iface.status ?? iface.operStatus ?? "").toLowerCase();
      const key = `${device}-${ifaceName}`;
      const prevStatus = previousStates[key];

      console.log(`  ${ifaceName}: ${prevStatus ?? 'INIT'} -> ${status}`);

      if (prevStatus === undefined) {
        previousStates[key] = status;
        continue;
      }

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
          if (alertHistory.length > 50) alertHistory.pop();
          
          console.log(`  ⚠️  ALERTA: ${alert.message}`);
          await sendDiscordAlert(alert.message);
        }
      }
      
      previousStates[key] = status;
    }
  } catch (err: any) {
    console.error(`Error verificando ${device.toUpperCase()}:`, err.message);
  }
}

export async function GET(req: Request) {
  const devices = ["xe", "xr", "nx"];

  console.log("\n=== Verificando todos los dispositivos ===");
  
  for (const device of devices) {
    await checkDeviceInterfaces(device);
  }

  console.log(`\nTotal alertas en historial: ${alertHistory.length}\n`);
  
  return NextResponse.json({ alerts: alertHistory }, { status: 200 });
}