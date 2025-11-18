"use client";

import { useState, FormEvent } from "react";

// Operaciones POST soportadas por tu API FastAPI
type FormMode =
  | "hostname"
  | "description"
  | "banner"
  | "ip"
  | "status"
  | "user"
  | "ospf";

export default function InterfaceForm() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Campos comunes
  const [device, setDevice] = useState("");
  // hostname
  const [hostname, setHostname] = useState("");
  // description
  const [iface, setIface] = useState("");
  const [desc, setDesc] = useState("");
  // banner
  const [bannerText, setBannerText] = useState("");
  // ip
  const [ipAddress, setIpAddress] = useState("");
  const [netmask, setNetmask] = useState("");
  // status
  const [intStatus, setIntStatus] = useState("up");
  // user
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // Para XR y NX
  const [privilege, setPrivilege] = useState(15); // XE default
  const [group, setGroup] = useState("netadmin"); // XR default
  const [role, setRole] = useState("network-admin"); // NX default
  // ospf
  const [ospfProcessId, setOspfProcessId] = useState("");
  const [ospfRouterId, setOspfRouterId] = useState("");

  const [mode, setMode] = useState<FormMode>("description");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    let url = "";
    let payload: any = { device };

    if (mode === "hostname") {
      url = "/api/interface?mode=hostname";
      payload.hostname = hostname;
    } else if (mode === "description") {
      url = "/api/interface?mode=description";
      payload.interface = iface;
      payload.description = desc;
    } else if (mode === "banner") {
      url = "/api/interface?mode=banner";
      payload.banner_text = bannerText;
    } else if (mode === "ip") {
      url = "/api/interface?mode=ip";
      payload.interface = iface;
      payload.ip_address = ipAddress;
      payload.netmask = netmask;
    } else if (mode === "status") {
      url = "/api/interface?mode=status";
      payload.interface = iface;
      payload.status = intStatus;
    } else if (mode === "user") {
      url = "/api/interface?mode=user";
      payload.username = username;
      payload.password = password;
      payload.privilege = privilege; // XE
      if (device === "xr") {
        payload.group = [group]; // ENVIAR como array para XR
      } else {
        payload.group = group;
      }
      payload.role = role; // NX
    } else if (mode === "ospf") {
      url = "/api/interface?mode=ospf";
      payload.process_id = ospfProcessId;
      payload.router_id = ospfRouterId;
    }

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        // Lee el cuerpo del error, si hay
        const errorBody = await res.text();
        console.error('HTTP error:', res.status, errorBody);
        setErrorMsg(`Error en API (${res.status}): ${errorBody}`);
        return;
      }
      const data = await res.json();
      console.log("Respuesta de /api/interface:", data);
      setErrorMsg(null);
      alert("Configuración enviada al API.");
    } catch (err) {
      console.error("Error al enviar configuración:", err);
      setErrorMsg(`Error al enviar configuración: ${err instanceof Error ? err.message : err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-800/60 border border-slate-700 rounded-xl p-6 space-y-5"
    >
      <h2 className="text-xl font-semibold text-sky-400">
        Administrar Dispositivo
      </h2>
      {/* MODE + DEVICE */}
      <div className="flex flex-wrap gap-4">
        <select
          value={mode}
          onChange={e => setMode(e.target.value as FormMode)}
          className="input"
        >
          <option value="description">Descripción de interfaz</option>
          <option value="hostname">Hostname</option>
          <option value="banner">Banner</option>
          <option value="ip">IP de interfaz</option>
          <option value="status">Estado de interfaz</option>
          <option value="user">Crear usuario</option>
          <option value="ospf">Activar OSPF</option>
        </select>
        <select
          value={device}
          onChange={e => setDevice(e.target.value)}
          className="input"
          required
        >
          <option value="">Tipo de equipo</option>
          <option value="xe">IOS XE</option>
          <option value="xr">IOS XR</option>
          <option value="nx">NX-OS</option>
        </select>
      </div>

      {/* FIELDS BY MODE */}
      {mode === "hostname" && (
        <input
          type="text"
          placeholder="Nuevo hostname"
          value={hostname}
          onChange={e => setHostname(e.target.value)}
          className="input"
          required
        />
      )}

      {mode === "description" && (
        <>
          <input
            type="text"
            placeholder="Nombre de interfaz (ej: Gi1)"
            value={iface}
            onChange={e => setIface(e.target.value)}
            className="input"
            required
          />
          <textarea
            placeholder="Descripción"
            value={desc}
            onChange={e => setDesc(e.target.value)}
            className="input"
            required
          />
        </>
      )}

      {mode === "banner" && (
        <textarea
          placeholder="Texto del banner de login"
          value={bannerText}
          onChange={e => setBannerText(e.target.value)}
          className="input"
          required
        />
      )}

      {mode === "ip" && (
        <>
          <input
            type="text"
            placeholder="Nombre de interfaz"
            value={iface}
            onChange={e => setIface(e.target.value)}
            className="input"
            required
          />
          <input
            type="text"
            placeholder="Dirección IPv4"
            value={ipAddress}
            onChange={e => setIpAddress(e.target.value)}
            className="input"
            required
          />
          <input
            type="text"
            placeholder="Máscara (ej: 255.255.255.0) o prefijo (ej: 24)"
            value={netmask}
            onChange={e => setNetmask(e.target.value)}
            className="input"
            required
          />
        </>
      )}

      {mode === "status" && (
        <>
          <input
            type="text"
            placeholder="Nombre de interfaz"
            value={iface}
            onChange={e => setIface(e.target.value)}
            className="input"
            required
          />
          <select
            value={intStatus}
            onChange={e => setIntStatus(e.target.value)}
            className="input"
            required
          >
            <option value="up">Habilitar (up)</option>
            <option value="down">Deshabilitar (down)</option>
          </select>
        </>
      )}

      {mode === "user" && (
        <>
          <input
            type="text"
            placeholder="Nombre de usuario"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="input"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="input"
            required
          />
          <input
            type="number"
            min={1} max={15}
            placeholder="Privilegio (XE, ej: 15)"
            value={privilege}
            onChange={e => setPrivilege(Number(e.target.value))}
            className="input"
          />
          <input
            type="text"
            placeholder="Grupo (XR, ej: netadmin)"
            value={group}
            onChange={e => setGroup(e.target.value)}
            className="input"
          />
          <input
            type="text"
            placeholder="Rol (NX, ej: network-admin)"
            value={role}
            onChange={e => setRole(e.target.value)}
            className="input"
          />
        </>
      )}

      {mode === "ospf" && (
        <>
          <input
            type="text"
            placeholder="ID de proceso OSPF"
            value={ospfProcessId}
            onChange={e => setOspfProcessId(e.target.value)}
            className="input"
            required
          />
          <input
            type="text"
            placeholder="Router ID OSPF (ej: 1.1.1.1)"
            value={ospfRouterId}
            onChange={e => setOspfRouterId(e.target.value)}
            className="input"
            required
          />
        </>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 rounded-md bg-green-500 hover:bg-green-400 font-semibold text-slate-900 transition-all"
      >
        {loading ? "Enviando..." : "Aplicar Configuración"}
      </button>

      {/* Muestra el mensaje de error si existió */}
      {errorMsg && (
        <div className="mt-2 text-sm text-red-400">
          {errorMsg}
        </div>
      )}
    </form>
  );
}