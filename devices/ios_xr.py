from ncclient import manager

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
    # IOS-XR requires the banner text to be wrapped with delimiters (e.g., 'c' character)
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
