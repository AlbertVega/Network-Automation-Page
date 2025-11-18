import { NextResponse } from "next/server";
import axios from "axios";
import { FASTAPI_URL } from "@/lib/config";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const device = url.searchParams.get("device") ?? "xe";

  try {
    const res = await axios.get(`${FASTAPI_URL}/status/interfaces?device=${device}`);
    const raw = res.data;
    const interfacesRaw = Array.isArray(raw.interfaces) ? raw.interfaces : [];

    // Normalizar aquí los datos para que el frontend reciba siempre (name, admin-status, status, protocol, vlan, etc)
    const interfaces = interfacesRaw.map((iface: any) => {
      // Adapta el mapeo según cada equipo
      if (device === "xe") {
        return {
          name: iface.name ?? "Unknown",
          adminStatus: iface["admin-status"] ?? "unknown",
          operStatus: iface["status"] ?? "unknown"
        };
      }
      if (device === "xr") {
        return {
          name: iface.name ?? "Unknown",
          operStatus: iface["status"] ?? "unknown",
          protocol: iface.protocol ?? "unknown"
        };
      }
      if (device === "nx") {
        return {
          name: iface.name ?? "Unknown",
          operStatus: iface.status ?? "unknown",
          vlan: iface.vlan ?? "",
          duplex: iface.duplex ?? "",
          speed: iface.speed ?? ""
        };
      }
      return iface; // fallback
    });

    return NextResponse.json({ device, interfaces }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ device, interfaces: [] }, { status: 200 });
  }
}