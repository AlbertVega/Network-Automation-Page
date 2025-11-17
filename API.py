from fastapi import FastAPI
from devices.ios_xe import xe_set_hostname, xe_set_interface_desc, xe_set_login_banner, xe_set_interface_ip, xe_set_interface_status
from devices.ios_xr import xr_set_hostname, xr_set_interface_desc, xr_set_login_banner, xr_set_interface_ip, xr_set_interface_status
from devices.nxos import nx_set_hostname, nx_set_interface_desc, nx_set_login_banner, nx_set_interface_ip, nx_set_interface_status

app = FastAPI()

@app.post("/configure/hostname")
def set_hostname(device: str, hostname: str):
    if device == "xe":
        return xe_set_hostname(hostname)
    elif device == "xr":
        return xr_set_hostname(hostname)
    elif device == "nx":
        return nx_set_hostname(hostname)
    else:
        return {"error": "Unknown device"}


@app.post("/configure/interface")
def set_interface(device: str, interface: str, description: str):
    if device == "xe":
        return xe_set_interface_desc(interface, description)
    elif device == "xr":
        return xr_set_interface_desc(interface, description)
    elif device == "nx":
        return nx_set_interface_desc(interface, description)
    else:
        return {"error": "Unknown device"}


@app.post("/configure/banner")
def set_login_banner(device: str, banner_text: str):
    if device == "xe":
        return xe_set_login_banner(banner_text)
    elif device == "xr":
        return xr_set_login_banner(banner_text)
    elif device == "nx":
        return nx_set_login_banner(banner_text)
    else:
        return {"error": "Unknown device"}
    
@app.post("/configure/interface-ip")
def set_interface_ip(device: str, interface: str, ip_address: str, netmask: str):
    if device == "xe":
        return xe_set_interface_ip(interface, ip_address, netmask)
    elif device == "xr":
        return xr_set_interface_ip(interface, ip_address, netmask)
    elif device == "nx":
        return nx_set_interface_ip(interface, ip_address, netmask)
    else:
        return {"error": "Unknown device"}


@app.post("/configure/interface-status")
def set_interface_status(device: str, interface: str, status: str):
    """Set interface status: 'up' to enable, 'down' to disable"""
    if device == "xe":
        return xe_set_interface_status(interface, status)
    elif device == "xr":
        return xr_set_interface_status(interface, status)
    elif device == "nx":
        return nx_set_interface_status(interface, status)
    else:
        return {"error": "Unknown device"}