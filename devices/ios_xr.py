from ncclient import manager
import paramiko
import time

XR_HOST = "10.10.20.35"
XR_PORT = 22
XR_USER = "developer"
XR_PASS = "C1sco12345"

def xr_set_hostname(hostname):
    config = f"""
    <config>
      <host-names xmlns="http://cisco.com/ns/yang/Cisco-IOS-XR-shellutil-cfg">    
        <host-name>{hostname}</host-name>
      </host-names>
    </config>
    """

    with manager.connect(host=XR_HOST, port=XR_PORT,
                         username=XR_USER, password=XR_PASS,
                         hostkey_verify=False,
                         device_params={'name': 'iosxr'}) as m:

        response = m.edit_config(target="candidate", config=config)
        m.commit()
        return str(response)


def xr_set_interface_desc(interface, description):
    config = f"""
    <config>
      <interface-configurations xmlns="http://cisco.com/ns/yang/Cisco-IOS-XR-ifmgr-cfg">
        <interface-configuration>
          <active>act</active>
          <interface-name>{interface}</interface-name>
          <description>{description}</description>
        </interface-configuration>
      </interface-configurations>
    </config>
    """

    with manager.connect(host=XR_HOST, port=XR_PORT,
                         username=XR_USER, password=XR_PASS,
                         hostkey_verify=False,
                         device_params={'name': 'iosxr'}) as m:

        response = m.edit_config(target="candidate", config=config)
        m.commit()
        return str(response)


def xr_set_login_banner(banner_text):
    formatted_banner = f"c{banner_text}c"
    
    config = f"""
    <config>
      <banners xmlns="http://cisco.com/ns/yang/Cisco-IOS-XR-infra-infra-cfg">
        <banner>
          <banner-name>login</banner-name>
          <banner-text>{formatted_banner}</banner-text>
        </banner>
      </banners>
    </config>
    """

    with manager.connect(host=XR_HOST, port=XR_PORT,
                         username=XR_USER, password=XR_PASS,
                         hostkey_verify=False,
                         device_params={'name': 'iosxr'}) as m:

        response = m.edit_config(target="candidate", config=config) 
        m.commit()
        return str(response)

def xr_set_interface_ip(interface, ip_address, netmask):
    config = f"""
    <config>
      <interface-configurations xmlns="http://cisco.com/ns/yang/Cisco-IOS-XR-ifmgr-cfg">
        <interface-configuration>
          <active>act</active>
          <interface-name>{interface}</interface-name>
          <ipv4-network xmlns="http://cisco.com/ns/yang/Cisco-IOS-XR-ipv4-io-cfg">
            <addresses>
              <primary>
                <address>{ip_address}</address>
                <netmask>{netmask}</netmask>
              </primary>
            </addresses>
          </ipv4-network>
        </interface-configuration>
      </interface-configurations>
    </config>
    """

    with manager.connect(host=XR_HOST, port=XR_PORT,
                         username=XR_USER, password=XR_PASS,
                         hostkey_verify=False,
                         device_params={'name': 'iosxr'}) as m:

        response = m.edit_config(target="candidate", config=config)
        m.commit()
        return str(response)


def xr_set_interface_status(interface, status):
    """Set interface status (up or down). status: 'up' or 'down'"""
    st = status.lower()
    if st not in ('up', 'down'):
        raise ValueError("status must be 'up' or 'down'")

    if st == 'down':
        shutdown_tag = "<shutdown/>"
    else:  # st == 'up'
        shutdown_tag = ('<shutdown xmlns:nc="urn:ietf:params:xml:ns:netconf:base:1.0" '
                        'nc:operation="delete"/>')

    config = f"""
<config>
  <interface-configurations xmlns="http://cisco.com/ns/yang/Cisco-IOS-XR-ifmgr-cfg">
    <interface-configuration>
      <active>act</active>
      <interface-name>{interface}</interface-name>
      {shutdown_tag}
    </interface-configuration>
  </interface-configurations>
</config>
"""

    with manager.connect(host=XR_HOST, port=XR_PORT,
                         username=XR_USER, password=XR_PASS,
                         hostkey_verify=False,
                         device_params={'name':'iosxr'}) as m:

        response = m.edit_config(target="candidate", config=config)
        m.commit()
        return str(response)
    
def xr_create_user(username, password, groups=None):
    if groups is None:
        groups = ["netadmin"]

    commands = [
        "configure",
        f"username {username}"
    ]

    for g in groups:
        commands.append(f" group {g}")

    commands.append(f" password 0 {password}")
    commands.append("commit")
    commands.append("end")

    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(
        XR_HOST, username=XR_USER, password=XR_PASS,
        look_for_keys=False, allow_agent=False
    )

    chan = ssh.invoke_shell()
    time.sleep(0.3)
    chan.recv(9999)

    for cmd in commands:
        chan.send(cmd + "\n")
        time.sleep(0.3)

    output = chan.recv(99999).decode()
    chan.close()
    ssh.close()
    return output

def xr_get_interfaces_status():
  interfaces = []

  if interfaces:
    return {"interfaces": interfaces}

  ssh = paramiko.SSHClient()
  ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
  ssh.connect(
      XR_HOST, username=XR_USER, password=XR_PASS,
      look_for_keys=False, allow_agent=False
  )
  chan = ssh.invoke_shell()
  time.sleep(0.5)
  chan.recv(9999)
  chan.send("show interfaces brief\n")
  time.sleep(1.5)
  output = chan.recv(100000).decode(errors="ignore")
  chan.close(); ssh.close()

  for line in output.splitlines():
    line = line.strip()
    if not line or line.startswith("Interface") or line.startswith("------"):
      continue
    parts = line.split()
    if len(parts) < 3:
      continue
    name = parts[0]
    oper = parts[1]
    proto = parts[2]
    interfaces.append({
      "name": name,
      "status": oper,
      "protocol": proto,
      "source": "cli"
    })

  return {"interfaces": interfaces}
