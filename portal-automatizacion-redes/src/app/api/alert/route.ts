import { NextResponse } from "next/server";
import axios from "axios";
import { FASTAPI_URL } from "@/lib/config";

// Helper para enviar alerta a Discord
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

// Helper para definir reglas por plataforma
function getAlertsFromInterfaces(device: string, interfaces: any[]): any[] {
  if (device === "xe") {
    // XE: alerta si {operStatus} es "down"
    return interfaces
      .filter(
        (iface) =>
          (iface["status"] ?? iface.operStatus ?? "").toLowerCase() === "down"
      )
      .map((iface, idx) => ({
        id: `${device}-${iface.name}-${idx}`,
        device,
        interface: iface.name ?? "Unknown",
        severity: "critical",
        message: `Crítico: Sin conexión (${iface.name ?? "Unknown"}, XE)`,
        timestamp: new Date().toISOString(),
      }));
  }
  if (device === "xr") {
    // XR: alerta si {operStatus} es "admin-down" para interfaces cuyo name empiece por 'Gi'
    return interfaces
      .filter((iface) => {
        const name = iface.name ?? "";
        const status = (iface["status"] ?? iface.operStatus ?? "").toLowerCase();
        return name.startsWith("Gi") && status === "admin-down";
      })
      .map((iface, idx) => ({
        id: `${device}-${iface.name}-${idx}`,
        device,
        interface: iface.name ?? "Unknown",
        severity: "critical",
        message: `Crítico: Sin conexión (${iface.name ?? "Unknown"}, XR)`,
        timestamp: new Date().toISOString(),
      }));
  }
  if (device === "nx") {
    // NX: alerta si {operStatus} es "notconnect" para interfaces cuyo name empiece por 'Et'
    return interfaces
      .filter((iface) => {
        const name = iface.name ?? "";
        const status = (iface.status ?? iface.operStatus ?? "").toLowerCase();
        return name.startsWith("Et") && status === "notconnect";
      })
      .map((iface, idx) => ({
        id: `${device}-${iface.name}-${idx}`,
        device,
        interface: iface.name ?? "Unknown",
        severity: "critical",
        message: `Crítico: Sin conexión (${iface.name ?? "Unknown"}, NX)`,
        timestamp: new Date().toISOString(),
      }));
  }
  return [];
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const device = url.searchParams.get("device") ?? "xe";

  try {
    const res = await axios.get(`${FASTAPI_URL}/status/interfaces?device=${device}`);
    const raw = res.data;
    const interfacesRaw = Array.isArray(raw.interfaces) ? raw.interfaces : [];

    // Genera las alertas de desconexión SEGÚN plataforma
    const alerts = getAlertsFromInterfaces(device, interfacesRaw);

    // Envia cada alerta crítica a Discord
    for (const alert of alerts) {
      await sendDiscordAlert(alert.message);
    }

    return NextResponse.json({ device, alerts }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ device, alerts: [] }, { status: 200 });
  }
}