import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  // Aquí luego vas a llamar a tu backend Python o directamente a RESTCONF
  console.log("Interface config recibida en API /api/interface:", body);

  return NextResponse.json(
    {
      status: "ok",
      message: "Configuración recibida en el API (mock).",
      received: body,
    },
    { status: 200 }
  );
}
