from fastapi import FastAPI
from pydantic import BaseModel

from devices.ios_xe import (
    xe_set_hostname,
    xe_set_interface_desc,
    xe_set_login_banner,
    xe_create_user,
    xe_get_interfaces_status,
    xe_set_interface_ip, 
    xe_set_interface_status, 
    xe_activate_ospf
)
from devices.ios_xr import (
    xr_set_hostname,
    xr_set_interface_desc,
    xr_set_login_banner,
    xr_create_user,
    xr_get_interfaces_status,
    xr_set_interface_ip, 
    xr_set_interface_status
)
from devices.nxos import (
    nx_set_hostname,
    nx_set_interface_desc,
    nx_set_login_banner,
    nx_create_user,
    nx_get_interfaces_status,
    nx_set_interface_ip,
    nx_set_interface_status
)

app = FastAPI()

# --- MODELOS ---
class HostnamePayload(BaseModel):
    device: str
    hostname: str

class InterfaceDescPayload(BaseModel):
    device: str
    interface: str
    description: str

class BannerPayload(BaseModel):
    device: str
    banner_text: str

class InterfaceIpPayload(BaseModel):
    device: str
    interface: str
    ip_address: str
    netmask: str

class UserPayload(BaseModel):
    device: str
    username: str
    password: str
    privilege: int = 15
    group: str = "netadmin"
    role: str = "network-admin"

class InterfaceStatusPayload(BaseModel):
    device: str
    interface: str
    status: str

class OspfPayload(BaseModel):
    device: str
    process_id: str
    router_id: str

# --- ENDPOINTS POST ---
@app.post("/configure/hostname")
def set_hostname(payload: HostnamePayload):
    if payload.device == "xe":
        return xe_set_hostname(payload.hostname)
    elif payload.device == "xr":
        return xr_set_hostname(payload.hostname)
    elif payload.device == "nx":
        return nx_set_hostname(payload.hostname)
    else:
        return {"error": "Unknown device"}

@app.post("/configure/interface")
def set_interface(payload: InterfaceDescPayload):
    if payload.device == "xe":
        return xe_set_interface_desc(payload.interface, payload.description)
    elif payload.device == "xr":
        return xr_set_interface_desc(payload.interface, payload.description)
    elif payload.device == "nx":
        return nx_set_interface_desc(payload.interface, payload.description)
    else:
        return {"error": "Unknown device"}

@app.post("/configure/banner")
def set_login_banner(payload: BannerPayload):
    if payload.device == "xe":
        return xe_set_login_banner(payload.banner_text)
    elif payload.device == "xr":
        return xr_set_login_banner(payload.banner_text)
    elif payload.device == "nx":
        return nx_set_login_banner(payload.banner_text)
    else:
        return {"error": "Unknown device"}

@app.post("/configure/interface-ip")
def set_interface_ip(payload: InterfaceIpPayload):
    if payload.device == "xe":
        return xe_set_interface_ip(payload.interface, payload.ip_address, payload.netmask)
    elif payload.device == "xr":
        return xr_set_interface_ip(payload.interface, payload.ip_address, payload.netmask)
    elif payload.device == "nx":
        return nx_set_interface_ip(payload.interface, payload.ip_address, payload.netmask)
    else:
        return {"error": "Unknown device"}

@app.post("/configure/user")
def create_user(payload: UserPayload):
    if payload.device == "xe":
        return xe_create_user(payload.username, payload.password, payload.privilege)
    elif payload.device == "xr":
        return xr_create_user(payload.username, payload.password, payload.group)
    elif payload.device == "nx":
        return nx_create_user(payload.username, payload.password, payload.role)
    else:
        return {"error": "Unknown device"}

@app.post("/configure/interface-status")
def set_interface_status(payload: InterfaceStatusPayload):
    """Set interface status: 'up' to enable, 'down' to disable"""
    if payload.device == "xe":
        return xe_set_interface_status(payload.interface, payload.status)
    elif payload.device == "xr":
        return xr_set_interface_status(payload.interface, payload.status)
    elif payload.device == "nx":
        return nx_set_interface_status(payload.interface, payload.status)
    else:
        return {"error": "Unknown device"}

@app.post("/configure/ospf")
def activate_ospf(payload: OspfPayload):
    """Activate OSPF protocol with process ID"""
    if payload.device == "xe":
        return xe_activate_ospf(payload.process_id)
    else:
        return {"error": "Unknown device"}

# --- ENDPOINTS GET ---
@app.get("/status/interfaces")
def get_interfaces_status(device: str):
    if device == "xe":
        return xe_get_interfaces_status()
    elif device == "xr":
        return xr_get_interfaces_status()
    elif device == "nx":
        return nx_get_interfaces_status()
    else:
        return {"error": "Unknown device"}