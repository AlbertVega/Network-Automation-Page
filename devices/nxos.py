import requests
import urllib3
urllib3.disable_warnings()

NX_HOST = "10.10.20.40"
NX_USER = "admin"
NX_PASS = "RG!_Yw200"

BASE_URL = f"https://{NX_HOST}/ins"

HEADERS = {"Content-Type": "application/json"}

def nx_set_hostname(hostname):
    payload = {
        "ins_api": {
            "version": "1.0",
            "type": "cli_conf",
            "chunk": "0",
            "sid": "1",
            "input": f"hostname {hostname}",
            "output_format": "json"
        }
    }

    r = requests.post(
        BASE_URL,
        auth=(NX_USER, NX_PASS),
        json=payload,
        headers=HEADERS,
        verify=False
    )
    return r.json()

def nx_set_interface_desc(interface, description):
    payload = {
        "ins_api": {
            "version": "1.0",
            "type": "cli_conf",
            "chunk": "0",
            "sid": "1",
            "input": f"interface {interface} ; description {description}",
            "output_format": "json"
        }
    }

    r = requests.post(
        BASE_URL,
        auth=(NX_USER, NX_PASS),
        json=payload,
        headers=HEADERS,
        verify=False
    )
    return r.json()


def nx_set_login_banner(banner_text):
    for d in "@#!%~^|_":
        if d not in banner_text:
            delim = d
            break
    else:
        delim = "Z"

    input_cmd = f"banner motd {delim}\n{banner_text}\n{delim}"

    payload = {
        "ins_api": {
            "version": "1.0",
            "type": "cli_conf",
            "chunk": "0",
            "sid": "1",
            "input": input_cmd,
            "output_format": "json"
        }
    }

    r = requests.post(
        BASE_URL,
        auth=(NX_USER, NX_PASS),
        json=payload,
        headers=HEADERS,
        verify=False
    )
    return r.json()

def nx_set_interface_ip(interface, ip_address, netmask):
    payload = {
        "ins_api": {
            "version": "1.0",
            "type": "cli_conf",
            "chunk": "0",
            "sid": "1",
            "input": f"interface {interface} ; ip address {ip_address} {netmask}",
            "output_format": "json"
        }
    }

    r = requests.post(
        BASE_URL,
        auth=(NX_USER, NX_PASS),
        json=payload,
        headers=HEADERS,
        verify=False
    )
    return r.json()


def nx_set_interface_status(interface, status):
    """Set interface status (up or down). status: 'up' or 'down'"""
    command = "shutdown" if status.lower() == 'down' else "no shutdown"
    
    payload = {
        "ins_api": {
            "version": "1.0",
            "type": "cli_conf",
            "chunk": "0",
            "sid": "1",
            "input": f"interface {interface} ; {command}",
            "output_format": "json"
        }
    }

    r = requests.post(
        BASE_URL,
        auth=(NX_USER, NX_PASS),
        json=payload,
        headers=HEADERS,
        verify=False
    )
    return r.json()


def nx_create_user(username, password, role: str = "network-admin"):
    payload = {
        "ins_api": {
            "version": "1.0",
            "type": "cli_conf",
            "chunk": "0",
            "sid": "1",
            "input": f"username {username} password 0 {password} role {role}",
            "output_format": "json"
        }
    }

    r = requests.post(
        BASE_URL,
        auth=(NX_USER, NX_PASS),
        json=payload,
        headers=HEADERS,
        verify=False
    )
    return r.json()


def nx_get_interfaces_status():
    payload = {
        "ins_api": {
            "version": "1.0",
            "type": "cli_show",
            "chunk": "0",
            "sid": "1",
            "input": "show interface status",
            "output_format": "json"
        }
    }

    r = requests.post(
        BASE_URL,
        auth=(NX_USER, NX_PASS),
        json=payload,
        headers=HEADERS,
        verify=False
    )

    data = r.json()
    interfaces = []

    try:
        if "ins_api" in data and "outputs" in data["ins_api"]:
            output = data["ins_api"]["outputs"]["output"]
            if "body" in output and "TABLE_interface" in output["body"]:
                ifaces = output["body"]["TABLE_interface"]["ROW_interface"]
                if not isinstance(ifaces, list):
                    ifaces = [ifaces]
            
                for iface in ifaces:
                    interfaces.append({
                        "name": iface.get("interface", "Unknown"),
                        "status": iface.get("state", "unknown"),
                        "vlan": iface.get("vlan", ""),
                        "duplex": iface.get("duplex", ""),
                        "speed": iface.get("speed", "")
                    })
    except Exception as e:
        return {"error": str(e), "raw_data": data}

    return {"interfaces": interfaces}