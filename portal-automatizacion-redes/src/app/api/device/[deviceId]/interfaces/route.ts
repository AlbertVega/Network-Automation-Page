import { NextResponse } from "next/server";
import axios from "axios";
import { FASTAPI_URL } from "@/lib/config";

// Normaliza la respuesta según tipo
function normalizeInterfaces(type: "xe" | "xr" | "nx", raw: any): any[] {
  if (!raw || !Array.isArray(raw.interfaces)) return [];
  
  if (type === "xe") {
    // XE backend example:
    // {interfaces: [{name, status, admin-status}]}
    return raw.interfaces.map((iface: any) => ({
      name: iface.name ?? "Unknown",
      adminStatus: iface["admin-status"] ?? "unknown",
      operStatus: iface.status ?? "unknown",
    }));
  }
  if (type === "xr") {
    // XR backend example:
    // {interfaces: [{name, status, protocol}]}
    return raw.interfaces.map((iface: any) => ({
      name: iface.name ?? "Unknown",
      operStatus: iface.status ?? "unknown",
      protocol: iface.protocol ?? "unknown",
    }));
  }
  if (type === "nx") {
    // NX backend example:
    // {interfaces: [{name, status, vlan, duplex, speed}]}
    return raw.interfaces.map((iface: any) => ({
      name: iface.name ?? "Unknown",
      operStatus: iface.status ?? "unknown",
      vlan: iface.vlan ?? "",
      duplex: iface.duplex ?? "",
      speed: iface.speed ?? "",
    }));
  }
  return [];
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const type = (url.searchParams.get("type") ?? "xe") as "xe" | "xr" | "nx";
  const mgmtIp = url.searchParams.get("mgmtIp");

  // Llama tu backend (puede que solo uses "type" en FastAPI, o también "mgmtIp" si lo soporta)
  let queryParams = `?type=${type}`;
  if (mgmtIp) queryParams += `&mgmtIp=${mgmtIp}`;
  try {
    const res = await axios.get(`${FASTAPI_URL}/status/interfaces${queryParams}`);
    const normalized = normalizeInterfaces(type, res.data);
    return NextResponse.json({ interfaces: normalized }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ interfaces: [] }, { status: 200 });
  }
}