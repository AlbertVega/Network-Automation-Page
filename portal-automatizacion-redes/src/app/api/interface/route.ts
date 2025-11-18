import { FASTAPI_URL } from "@/lib/config";
import axios from "axios";
import { NextResponse } from "next/server";

type Mode = 'hostname' | 'description' | 'banner' | 'ip' | 'status' | 'user' | 'ospf';

const endpoints: Record<Mode, string> = {
  hostname: "/configure/hostname",
  description: "/configure/interface",
  banner: "/configure/banner",
  ip: "/configure/interface-ip",
  status: "/configure/interface-status",
  user: "/configure/user",
  ospf: "/configure/ospf",
};

const allowedModes: Mode[] = [
  "hostname", "description", "banner", "ip", "status", "user", "ospf"
];

export async function POST(req: Request) {
  const url = new URL(req.url);
  const modeParam = url.searchParams.get("mode");

  if (!modeParam || !allowedModes.includes(modeParam as Mode)) {
    return NextResponse.json({ error: "Modo no soportado" }, { status: 400 });
  }

  const mode = modeParam as Mode;
  const endpointUrl = endpoints[mode];
  const payload = await req.json();

  // Si tienes mappers para campos:
  // const mappedPayload = mappers[mode](payload);

  try {
    const res = await axios.post(`${FASTAPI_URL}${endpointUrl}`, payload, {
      headers: { "Content-Type": "application/json" }
    });
    return NextResponse.json(res.data, { status: 200 });
  } catch (err: any) {
    const status = err?.response?.status ?? 500;
    const data = err?.response?.data ?? err.message ?? "Error interno";
    return NextResponse.json({ error: data }, { status });
  }
}