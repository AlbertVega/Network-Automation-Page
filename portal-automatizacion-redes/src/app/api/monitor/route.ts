// src/app/api/monitor/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const data = [
    {
      name: "GigabitEthernet1",
      device: "R1-Core",
      adminUp: true,
      operUp: true,
      trafficInKbps: 1200,
      errors: 0,
    },
    {
      name: "GigabitEthernet2",
      device: "R1-Core",
      adminUp: true,
      operUp: false,
      trafficInKbps: 0,
      errors: 3,
    },
    {
      name: "GigabitEthernet0/0",
      device: "R2-Edge",
      adminUp: true,
      operUp: true,
      trafficInKbps: 340,
      errors: 1,
    },
  ];

  return NextResponse.json(data);
}
