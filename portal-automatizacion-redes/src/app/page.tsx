"use client";

import { useState } from "react";
import InterfaceForm from "@/components/InterfaceForm";
import MonitorPanel from "@/components/MonitorPanel";
import AlertsPanel from "@/components/AlertsPanel";
import DeviceList from "@/components/DeviceList";
import DiscortAlert from "@/components/DiscordTest";
import BulkInterfaceUpload from "@/components/BulkInterfaceUpload";

// ¡AGREGA ESTO!
type TabId = "config" | "monitor" | "alerts" | "devices"| "discord";

const TABS: { id: TabId; label: string }[] = [
  { id: "config", label: "Configuración" },
  { id: "monitor", label: "Monitoreo" },
  { id: "alerts", label: "Alertas" },
  { id: "devices", label: "Dispositivos" },
  { id: "discord", label: "Discord Test" },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<TabId>("config");
  const [alertsChanged, setAlertsChanged] = useState(false);

  // Callback para AlertsPanel: se ejecuta si hay nuevas alertas
  const handleAlertsChange = (hasNewAlerts: boolean) => {
    // Si no estás en la tab de alertas, muestra el punto; si ya la abriste, lo apaga
    if (activeTab !== "alerts" && hasNewAlerts) setAlertsChanged(true);
    if (activeTab === "alerts") setAlertsChanged(false);
  };

  // Si el usuario entra a la tab de alertas, borra el punto rojo
  const handleTabClick = (id: TabId) => {
    setActiveTab(id);
    if (id === "alerts") setAlertsChanged(false);
  };

  return (
    <section className="space-y-8">
      {/* Barra de tabs */}
      <nav className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all
                ${
                  isActive
                    ? "bg-slate-800 text-green-300 border border-green-400/60 shadow-md"
                    : "bg-slate-900 text-slate-300 border border-slate-700 hover:border-slate-500 hover:text-sky-300"
                }`}
            >
              {tab.label}
              {/* Si hay cambios, muestra el dot rojo a la derecha del texto */}
              {tab.id === "alerts" && alertsChanged && (
                <span
                  className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 animate-pulse"
                  aria-label="Nuevas alertas"
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Contenido de cada tab */}
      <div>
        {activeTab === "config" && (
          <div className="max-w-5xl">
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
            <AlertsPanel onAlertsChange={handleAlertsChange} />
          </div>
        )}

        {activeTab === "devices" && (
          <div className="max-w-8xl">
            <DeviceList />
          </div>
        )}
        {activeTab === "discord" && (
          <div className="max-w-4xl">
            <DiscortAlert />
          </div>
        )}
      </div>
    </section>
  );
}