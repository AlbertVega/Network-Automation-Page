import { NextResponse } from "next/server";

const MOCK_ALERTS = [
  {
    id: 1,
    device: "R1-Core",
    interface: "GigabitEthernet2",
    severity: "critical",
    message: "Interfaz administrativamente UP pero operativamente DOWN",
    timestamp: "2025-11-16T01:23:00Z",
  },
  {
    id: 2,
    device: "R2-Edge",
    interface: "GigabitEthernet0/0",
    severity: "warning",
    message: "Errores crecientes en la interfaz (CRC)",
    timestamp: "2025-11-16T01:25:10Z",
  },
];

export async function GET() {
  return NextResponse.json(MOCK_ALERTS);
}
