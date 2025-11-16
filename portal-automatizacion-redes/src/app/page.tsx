"use client";

import { useState } from "react";
import InterfaceForm from "@/components/InterfaceForm";
import MonitorPanel from "@/components/MonitorPanel";
import AlertsPanel from "@/components/AlertsPanel";
import DeviceList from "@/components/DeviceList";

type TabId = "config" | "monitor" | "alerts" | "devices";

const TABS: { id: TabId; label: string }[] = [
  { id: "config", label: "Configuración" },
  { id: "monitor", label: "Monitoreo" },
  { id: "alerts", label: "Alertas" },
  { id: "devices", label: "Dispositivos" },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<TabId>("config");

  return (
    <section className="space-y-8">
      {/* Barra de tabs */}
      <nav className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all
                ${
                  isActive
                    ? "bg-slate-800 text-green-300 border border-green-400/60 shadow-md"
                    : "bg-slate-900 text-slate-300 border border-slate-700 hover:border-slate-500 hover:text-sky-300"
                }`}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Contenido de cada tab */}
      <div>
        {activeTab === "config" && (
          <div className="max-w-3xl">
            <InterfaceForm />
          </div>
        )}

        {activeTab === "monitor" && (
          <div className="max-w-5xl">
            <MonitorPanel />
          </div>
        )}

        {activeTab === "alerts" && (
          <div className="max-w-3xl">
            <AlertsPanel />
          </div>
        )}

        {activeTab === "devices" && (
          <div className="max-w-4xl">
            <DeviceList />
          </div>
        )}
      </div>
    </section>
  );
}
