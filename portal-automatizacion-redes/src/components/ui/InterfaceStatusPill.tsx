"use client";

type InterfaceStatusProps = {
  type: "admin" | "oper";
  up: boolean;
  critical?: boolean;  // ahora sí existe siempre
};

export default function InterfaceStatusPill({
  type,
  up,
  critical,
}: InterfaceStatusProps) {
  const base =
    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide border";

  let style = "";
  let label = "";

  if (up) {
    style = "bg-green-600/20 text-green-300 border-green-600/40";
    label = type === "admin" ? "ADMIN UP" : "OPER UP";
  } else {
    // Estado abajo
    if (critical) {
      style = "bg-red-600/20 text-red-300 border-red-600/40";
      label = type === "admin" ? "ADMIN DOWN" : "OPER DOWN";
    } else {
      style = "bg-slate-700 text-slate-300 border-slate-500";
      label = type === "admin" ? "ADMIN DOWN" : "OPER DOWN";
    }
  }

  return (
    <span className={`${base} ${style}`}>
      <span className="text-lg leading-none">●</span>
      <span className="font-bold">{label}</span>
    </span>
  );
}
