import { NextResponse } from "next/server";
import { pushInterfaceConfig, pushBulkInterfaceConfigs } from "@/lib/interfaceService";

export async function POST(request: Request) {
  const body = await request.json();

  try {
    if (Array.isArray(body)) {
      // Bulk...
      const result = await pushBulkInterfaceConfigs(body);
      return NextResponse.json(result, { status: 200 });
    } else {
      // Individual...
      const result = await pushInterfaceConfig(body);
      return NextResponse.json(result, { status: 200 });
    }
  } catch (err: any) {
    return NextResponse.json(
      { status: "error", message: err.message ?? "Error enviando configuración" },
      { status: 500 }
    );
  }
}