import { NextResponse } from "next/server";
import {
  pushHostnameConfig,
  pushInterfaceConfig,
  pushBannerConfig,
  pushInterfaceIpConfig,
  pushInterfaceStatusConfig,
  pushCreateUserConfig,
  pushActivateOspfConfig,
} from "@/lib/interfaceService";

export async function POST(request: Request) {
  const body = await request.json();
  const url = new URL(request.url);
  const mode = url.searchParams.get("mode");

  try {
    if (mode === "hostname") {
      return NextResponse.json(await pushHostnameConfig(body), { status: 200 });
    }
    if (mode === "description") {
      return NextResponse.json(await pushInterfaceConfig(body), { status: 200 });
    }
    if (mode === "banner") {
      return NextResponse.json(await pushBannerConfig(body), { status: 200 });
    }
    if (mode === "ip") {
      return NextResponse.json(await pushInterfaceIpConfig(body), { status: 200 });
    }
    if (mode === "status") {
      return NextResponse.json(await pushInterfaceStatusConfig(body), { status: 200 });
    }
    if (mode === "user") {
      return NextResponse.json(await pushCreateUserConfig(body), { status: 200 });
    }
    if (mode === "ospf") {
      return NextResponse.json(await pushActivateOspfConfig(body), { status: 200 });
    }
    // Default/fallback
    return NextResponse.json({ error: "Modo no soportado" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Error interno" },
      { status: 500 }
    );
  }
}