"use client";

type Severity = "info" | "warning" | "critical";

export default function SeverityPill({ severity }: { severity: Severity }) {
  const base =
    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide border";

  const styles = {
    critical: "bg-red-600/20 text-red-300 border-red-600/40",
    warning: "bg-yellow-500/20 text-yellow-200 border-yellow-500/40",
    info: "bg-sky-500/20 text-sky-300 border-sky-500/40",
  };

  const labels = {
    critical: "CRÍTICO",
    warning: "ADVERTENCIA",
    info: "INFO",
  };

  return (
    <span className={`${base} ${styles[severity]}`}>
      <span className="text-lg leading-none">●</span>
      <span className="font-bold">{labels[severity]}</span>
    </span>
  );
}
