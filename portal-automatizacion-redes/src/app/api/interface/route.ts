import { NextResponse } from "next/server";
import { pushInterfaceConfig, pushBulkInterfaceConfigs } from "@/lib/interfaceService";

export async function POST(request: Request) {
  const body = await request.json();

  let result;
  try {
    if (Array.isArray(body)) {
      // Bulk upload
      result = await pushBulkInterfaceConfigs(body);
    } else {
      // Individual
      result = await pushInterfaceConfig(body);
    }
    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      {
        status: "error",
        message: err.message ?? "Error enviando configuraciones",
      },
      { status: 500 }
    );
  }
}