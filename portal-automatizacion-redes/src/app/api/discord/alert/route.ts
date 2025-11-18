import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const res = await fetch("http://localhost:5000/send-alert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await res.json();
    return NextResponse.json({ ok: true, result: data });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error enviando alerta" }, { status: 500 });
  }
}
