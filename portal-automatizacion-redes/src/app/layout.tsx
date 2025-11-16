// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NetAutoLab",
  description: "Panel de automatización y monitoreo de red.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-slate-900 text-slate-100 min-h-screen">
        <div className="min-h-screen flex flex-col">
          <header className="w-full border-b border-slate-800">
            <div className="mx-auto max-w-7xl px-6 py-4">
              <h1 className="text-3xl font-bold text-green-400">NetAutoLab</h1>
              <p className="text-slate-400 text-sm">
                Automatización y monitoreo usando RESTCONF y Python.
              </p>
            </div>
          </header>

          <main className="flex-1">
            <div className="mx-auto max-w-7xl px-6 py-10">
              {children}
            </div>
          </main>

          <footer className="border-t border-slate-800 py-3 text-center text-xs text-slate-500">
            © 2024 NetAutoLab. Todos los derechos reservados.
          </footer>
        </div>
      </body>
    </html>
  );
}
