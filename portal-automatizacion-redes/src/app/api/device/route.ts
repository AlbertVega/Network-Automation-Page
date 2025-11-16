import { NextResponse } from "next/server";

const MOCK_DEVICES = [
  { id: "r1-core", name: "R1-Core", mgmtIp: "10.0.0.1", role: "Core", status: "online" },
  { id: "r2-edge", name: "R2-Edge", mgmtIp: "10.0.0.2", role: "Edge", status: "online" },
  { id: "r3-branch", name: "R3-Branch", mgmtIp: "10.0.0.3", role: "Sucursal", status: "online" },
];

export async function GET() {
  return NextResponse.json(MOCK_DEVICES);
}
