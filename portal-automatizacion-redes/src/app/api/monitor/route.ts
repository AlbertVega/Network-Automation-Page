import { NextResponse } from "next/server";
import axios from "axios";
import { FASTAPI_URL } from "@/lib/config";

export async function GET() {
  // Puedes parametrizar los dispositivos aquí si lo deseas.
  const devices = "xe,xr,nx";
  try {
    const res = await axios.get(`${FASTAPI_URL}/status/interfaces?devices=${devices}`);
    return NextResponse.json(res.data, { status: 200 });
  } catch (err: any) {
    return NextResponse.json([], { status: 200 });
  }
}