from fastapi import FastAPI
from devices.ios_xe import xe_set_hostname, xe_set_interface_desc
from devices.ios_xr import xr_set_hostname, xr_set_interface_desc
from devices.nxos import nx_set_hostname, nx_set_interface_desc

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
