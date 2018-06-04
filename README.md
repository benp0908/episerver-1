# Arras.io Private Server Template

## Quick Start Guide

1. Click the top left where it says **arras-template**
2. Remix the project
3. Give your new project a name
4. Your private server name will be at <http://arras.surge.sh/#private=new-name-here.glitch.me> (replace `new-name-here` with it's new name)

## More Information

1. Open the file at the left named `🔑 .env`
2. Fill it in with
```
SECRET=aSecretPasswordHere
```
3. Open the private server with <http://arras.surge.sh/#private=new-name-here.glitch.me;aSecretPasswordHere> (replace `aSecretPasswordHere` with the password)
4. The map/config data are in the `config.js` file
5. The tank data are in the `lib/definitions.js` file
6. Other stuff (score curve, stat amount) are in the `server.js` file