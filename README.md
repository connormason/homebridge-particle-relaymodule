# homebridge-particle-relaymodule
A homebridge plugin allowing control of relays with a Particle Photon

## Installation
1. Clone this repo
2. ```cd homebridge-particle-relaymodule```
3. ```sudo npm install -g .```
4. Create a ```credentials.json``` file structured like this:
    ```
    {
        "username": "<Particle username>",
        "password": "<Particle password>",
        "deviceID": "<Particle device ID>"
    }
    ```
   and drop it in the root of this repo.
   
## Example config.json Using RelayModule
```
{
    "bridge": {
        "name": "Homebridge",
        "username": "DC:21:12:C2:CE:3D",
        "port": 51826,
        "pin": "013-75-138",
	      "ssdp": 1900
    },
    
    "description": "This is an example config",

    "platforms": [
        {
            "platform": "RelayModule",
            "name": "My Outlet Module",
            "devices": [
                {
                    "name": "Floop Lamp",
                    "type": "LIGHT",
                    "relayPin": "3"
                },
                {
                    "name": "Fan",
                    "type": "SWITCH",
                    "relayPin": "4"
                },
                {
                    "name": "Desk Lamp",
                    "type": "LIGHT",
                    "relayPin": "5"
                },
                {
                    "name": "Christmas Lights",
                    "type": "SWITCH",
                    "relayPin": "6"
                }
            ]
       }
    ]
}
```
