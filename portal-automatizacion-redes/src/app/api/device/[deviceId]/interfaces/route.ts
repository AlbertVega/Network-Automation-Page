import { NextResponse } from "next/server";

const MOCK_INTERFACES = [
  {
    name: "GigabitEthernet1",
    deviceId: "r1-core",
    adminUp: true,
    operUp: true,
    trafficInKbps: 1200,
    errors: 0,
  },
  {
    name: "GigabitEthernet2",
    deviceId: "r1-core",
    adminUp: true,
    operUp: false,
    trafficInKbps: 0,
    errors: 3,
  },
  {
    name: "GigabitEthernet0/0",
    deviceId: "r2-edge",
    adminUp: true,
    operUp: true,
    trafficInKbps: 340,
    errors: 1,
  },
];

// Nota: params viene como Promise, hay que hacer await
export async function GET(
  _req: Request,
  context: { params: Promise<{ deviceId: string }> }
) {
  const { deviceId } = await context.params;

  const filtered = MOCK_INTERFACES.filter(
    (iface) => iface.deviceId === deviceId
  );

  return NextResponse.json(filtered);
}
