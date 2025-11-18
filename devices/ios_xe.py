import requests
from requests.auth import HTTPBasicAuth
import urllib3
urllib3.disable_warnings()
import json
import time

XE_HOST = "10.10.20.48"
XE_USER = "developer"
XE_PASS = "C1sco12345"

BASE_URL = f"https://{XE_HOST}:443/restconf/data"

HEADERS = {
    "Content-Type": "application/yang-data+json",
    "Accept": "application/yang-data+json"
}

def xe_set_hostname(hostname):
    url = f"{BASE_URL}/Cisco-IOS-XE-native:native/hostname"
    payload = {"Cisco-IOS-XE-native:hostname": hostname}

    response = requests.put(
        url,
        auth=HTTPBasicAuth(XE_USER, XE_PASS),
        json=payload,
        headers=HEADERS,
        verify=False
    )
    return response.status_code, response.text


def xe_set_interface_desc(interface, description):
    import re
    match = re.match(r'([A-Za-z]+)(\d+(?:/\d+)*)', interface)
    if not match:
        return 400, "Invalid interface format"
    
    interface_type, interface_num = match.groups()
    
    url = f"{BASE_URL}/Cisco-IOS-XE-native:native/interface/{interface_type}={interface_num}"
    payload = {
        interface_type: {
            "name": interface_num,
            "description": description
        }
    }

    response = requests.patch(
        url,
        auth=HTTPBasicAuth(XE_USER, XE_PASS),
        json=payload,
        headers=HEADERS,
        verify=False
    )
    return response.status_code, response.text


def xe_set_login_banner(banner_text):
    url = f"{BASE_URL}/Cisco-IOS-XE-native:native/banner/login/banner"
    payload = {"Cisco-IOS-XE-native:banner": banner_text}

    response = requests.put(
        url,
        auth=HTTPBasicAuth(XE_USER, XE_PASS),
        json=payload,
        headers=HEADERS,
        verify=False
    )
    return response.status_code, response.text

def xe_create_user(username, password, privilege: int = 15):
    url = f"{BASE_URL}/Cisco-IOS-XE-native:native/username"
    payload = {
        "Cisco-IOS-XE-native:username": [
            {
                "name": username,
                "privilege": privilege,
                "password": {
                    "encryption": 0,
                    "password": password
                }
            }
        ]
    }

    response = requests.patch(
        url,
        auth=HTTPBasicAuth(XE_USER, XE_PASS),
        json=payload,
        headers=HEADERS,
        verify=False
    )
    return response.status_code, response.text


def xe_set_interface_ip(interface, ip_address, netmask):
    import re
    match = re.match(r'([A-Za-z]+)(\d+(?:/\d+)*)', interface)
    if not match:
        return 400, "Invalid interface format"
    
    interface_type, interface_num = match.groups()
    
    url = f"{BASE_URL}/Cisco-IOS-XE-native:native/interface/{interface_type}={interface_num}"
    payload = {
        interface_type: {
            "name": interface_num,
            "ip": {
                "address": {
                    "primary": {
                        "address": ip_address,
                        "mask": netmask
                    }
                }
            }
        }
    }

    response = requests.patch(
        url,
        auth=HTTPBasicAuth(XE_USER, XE_PASS),
        json=payload,
        headers=HEADERS,
        verify=False
    )
    return response.status_code, response.text


def xe_set_interface_status(interface, status):
    """Set interface status (up or down). status: 'up' or 'down'"""
    import re
    match = re.match(r'([A-Za-z]+)(\d+(?:/\d+)*)', interface)
    if not match:
        return 400, "Invalid interface format"
    
    interface_type, interface_num = match.groups()
    
    url = f"{BASE_URL}/Cisco-IOS-XE-native:native/interface/{interface_type}={interface_num}"
    
    if status.lower() == 'down':
        payload = {
            interface_type: {
                "name": interface_num,
                "shutdown": [None]  
            }
        }
    else:
        payload = {
            interface_type: {
                "name": interface_num
            }
        }

    response = requests.patch(
        url,
        auth=HTTPBasicAuth(XE_USER, XE_PASS),
        json=payload,
        headers=HEADERS,
        verify=False
    )
    return response.status_code, response.text

def xe_activate_ospf(process_id):
    url = f"{BASE_URL}/Cisco-IOS-XE-native:native/router"
    headers = {'Content-Type': 'application/yang-data+json','Accept': 'application/yang-data+json'}

    ospf_data = {
        "Cisco-IOS-XE-native:router": {
            "Cisco-IOS-XE-ospf:router-ospf": {
                "ospf": {
                    "process-id": [
                        {
                            "id": process_id
                        }
                    ]
                }
            }
        }
    }

    response = requests.request("PUT",
                                         url=url, 
                                         auth=(XE_USER,XE_PASS), 
                                         json=ospf_data, 
                                         headers=headers, 
                                         verify=False)
    
    return response.status_code, response.text


def xe_get_interfaces_status():
    url = f"{BASE_URL}/ietf-interfaces:interfaces-state"

    response = requests.get(
        url,
        auth=HTTPBasicAuth(XE_USER, XE_PASS),
        headers=HEADERS,
        verify=False
    )

    if response.status_code != 200:
        return {"error": "Failed to retrieve interfaces", "status_code": response.status_code}

    data = response.json()
    interfaces = []

    if "ietf-interfaces:interfaces-state" in data and "interface" in data["ietf-interfaces:interfaces-state"]:
        for iface in data["ietf-interfaces:interfaces-state"]["interface"]:
            interfaces.append({
                "name": iface.get("name", "Unknown"),
                "status": iface.get("oper-status", "unknown"),
                "admin-status": iface.get("admin-status", "unknown")
            })

    return {"interfaces": interfaces}
