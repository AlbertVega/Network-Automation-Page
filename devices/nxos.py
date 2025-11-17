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
    # NX-OS 9K does not support 'banner login'. Use MOTD instead.
    # Choose a delimiter not present in the text and send as multiline.
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
