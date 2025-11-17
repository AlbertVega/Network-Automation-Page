import requests
from requests.auth import HTTPBasicAuth
import urllib3
urllib3.disable_warnings()

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
    # Parse interface type and number (e.g., "GigabitEthernet1" -> "GigabitEthernet", "1")
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