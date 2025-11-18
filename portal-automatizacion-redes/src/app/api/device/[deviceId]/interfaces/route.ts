import { NextResponse } from "next/server";
import axios from "axios";
import { FASTAPI_URL } from "@/lib/config";

// Definimos tu lista fija para el demo (puede venir de una base de datos real)
const devices = [
  { id: "1", name: "Catalyst 8000v", mgmtIp: "10.10.20.48", type: "xe" },
  { id: "2", name: "IOS XRv 9K", mgmtIp: "10.10.20.35", type: "xr" },
  { id: "3", name: "Nexus 9K", mgmtIp: "10.10.20.40", type: "nx" },
];

export async function GET(req: Request, { params }: { params: { deviceId: string } }) {
  const device = devices.find(d => d.id === params.deviceId);

  if (!device) {
    return NextResponse.json({ error: "Device not found", interfaces: [] }, { status: 404 });
  }

  // Llama tu FastAPI con los parámetros correctos
  let fastApiParams = `?device=${device.type}&mgmtIp=${device.mgmtIp}`;
  try {
    const res = await axios.get(`${FASTAPI_URL}/status/interfaces${fastApiParams}`);
    const raw = res.data;
    const interfacesRaw = Array.isArray(raw.interfaces) ? raw.interfaces : [];

    // Normaliza según tipo de dispositivo
    const interfaces = interfacesRaw.map((iface: any) => {
      if (device.type === "xe") {
        return {
          name: iface.name ?? "Unknown",
          adminStatus: iface["admin-status"] ?? "unknown",
          operStatus: iface["status"] ?? "unknown"
        };
      }
      if (device.type === "xr") {
        return {
          name: iface.name ?? "Unknown",
          operStatus: iface["status"] ?? "unknown",
          protocol: iface.protocol ?? "unknown"
        };
      }
      if (device.type === "nx") {
        return {
          name: iface.name ?? "Unknown",
          operStatus: iface.status ?? "unknown",
          vlan: iface.vlan ?? "",
          duplex: iface.duplex ?? "",
          speed: iface.speed ?? ""
        };
      }
      return iface;
    });

    return NextResponse.json({ device: device.name, interfaces }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ device: device.name, interfaces: [] }, { status: 200 });
  }
}