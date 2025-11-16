"use client";

export default function AlertsPanel() {
  return (
    <section className="bg-slate-800/60 border border-slate-700 rounded-2xl p-8 space-y-4 w-full shadow-lg">
      <h2 className="text-xl font-semibold text-sky-400">
        Sistema de alertas
      </h2>
      <p className="text-sm text-slate-200">
        Aquí se configurarán los destinos de notificación para eventos críticos
        en la red. La idea es definir:
      </p>
      <ul className="list-disc pl-5 text-sm text-slate-200 space-y-1">
        <li>Webhooks de Discord (canal de alertas).</li>
        <li>Bot o webhook de Telegram para notificaciones móviles.</li>
        <li>Niveles de severidad (info, warning, critical).</li>
        <li>Umbrales de disparo (uso de ancho de banda, errores, enlace caído, etc.).</li>
      </ul>
      <p className="text-sm text-slate-400">
        Más adelante, este panel se conectará con el backend en Python que
        analizará métricas de monitoreo y generará alertas automáticas.
      </p>
    </section>
  );
}
