import axios from "axios";

// Usar variable de entorno para flexibilidad
import { FASTAPI_URL } from "@/lib/config";

// Helpers para la ruta de cada tipo
const HOSTNAME_URL = `${FASTAPI_URL}/configure/hostname`;
const INTERFACE_URL = `${FASTAPI_URL}/configure/interface`;
const BANNER_URL = `${FASTAPI_URL}/configure/banner`;
const INTERFACE_IP_URL = `${FASTAPI_URL}/configure/interface-ip`;
const INTERFACE_STATUS_URL = `${FASTAPI_URL}/configure/interface-status`;
const USER_URL = `${FASTAPI_URL}/configure/user`;
const OSPF_URL = `${FASTAPI_URL}/configure/ospf`;

// HOSTNAME
export async function pushHostnameConfig({device, hostname}: {device: string, hostname: string}) {
  const res = await axios.post(HOSTNAME_URL, {device, hostname});
  return res.data;
}

// INTERFACE DESCRIPTION
export async function pushInterfaceConfig({
  device,
  interfaceName,
  description,
}: {
  device: string;
  interfaceName: string;
  description: string;
}) {
  const res = await axios.post(INTERFACE_URL, {
    device,
    interface: interfaceName,
    description,
  });
  return res.data;
}

// BANNER
export async function pushBannerConfig({device, banner_text}: {device: string, banner_text: string}) {
  const res = await axios.post(BANNER_URL, {device, banner_text});
  return res.data;
}

// INTERFACE IP
export async function pushInterfaceIpConfig({
  device,
  interfaceName,
  ip_address,
  netmask,
}: {
  device: string;
  interfaceName: string;
  ip_address: string;
  netmask: string;
}) {
  const res = await axios.post(INTERFACE_IP_URL, {
    device,
    interface: interfaceName,
    ip_address,
    netmask,
  });
  return res.data;
}

// INTERFACE STATUS
export async function pushInterfaceStatusConfig({
  device,
  interfaceName,
  status,
}: {
  device: string;
  interfaceName: string;
  status: string;
}) {
  const res = await axios.post(INTERFACE_STATUS_URL, {
    device,
    interface: interfaceName,
    status,
  });
  return res.data;
}

// CREATE USER
export async function pushCreateUserConfig({
  device,
  username,
  password,
  privilege,
  group,
  role,
}: {
  device: string;
  username: string;
  password: string;
  privilege?: number;
  group?: string;
  role?: string;
}) {
  const res = await axios.post(USER_URL, {
    device,
    username,
    password,
    privilege,
    group,
    role,
  });
  return res.data;
}

// ACTIVATE OSPF
export async function pushActivateOspfConfig({
  device,
  process_id,
  router_id,
}: {
  device: string;
  process_id: string;
  router_id: string;
}) {
  const res = await axios.post(OSPF_URL, {
    device,
    process_id,
    router_id,
  });
  return res.data;
}

// --- Bulk Interface Description ---
export async function pushBulkInterfaceConfigs(configs: any[]) {
  let success = 0, failed = 0;
  const results: any[] = [];
  for (const config of configs) {
    try {
      const resp = await pushInterfaceConfig(config);
      results.push({ config, status: "success", resp });
      success++;
    } catch (error: any) {
      results.push({ config, status: "failed", error: error?.message });
      failed++;
    }
  }
  return {
    mode: "bulk",
    total: configs.length,
    success,
    failed,
    results,
  };
}