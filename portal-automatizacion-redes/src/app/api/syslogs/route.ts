import { NextResponse } from "next/server";
import axios from "axios";
import { FASTAPI_URL } from "@/lib/config";

export async function GET() {
  try {
    // Cambié la ruta al endpoint de FastAPI solicitado
    const res = await axios.get(`${FASTAPI_URL}/status/syslogs`);
    const data = res.data;

    // data debe contener { syslogs: { cpu_percent, memory_percent } }
    return NextResponse.json(data);
  } catch (err) {
    console.error("Error en /api/syslogs:", err);
    return NextResponse.json(
      { error: "No se pudieron obtener syslogs desde status/syslogs." },
      { status: 500 }
    );
  }
}