# Arras.io Private Server Template

## Quick Start Guide

1. Click the top left where it says **arras-template**
2. Remix the project
3. Give your new project a name
4. Your private server name will be at <http://arras.surge.sh/#private=new-name-here.glitch.me> (replace `new-name-here` with it's new name)

## IMPORTANT CHANGES

If you've created a private server before July 2nd, 2018, it will no longer work without this new update!
Find the following in your server.js:
```
if (needsRoom !== 0 && needsRoom !== 1) { socket.kick('Bad spawn request.'); return 1; }
// Bring to life
socket.status.deceased = false;
// Define the player.
if (players.indexOf(socket.player) != -1) { util.remove(players, players.indexOf(socket.player));  }
// Free the old view
if (views.indexOf(socket.view) != -1) { util.remove(views, views.indexOf(socket.view)); socket.makeView(); }
socket.player = socket.spawn(name);     
// Give it the room state
if (needsRoom) { 
    socket.talk(
        'R',
        room.width,
        room.height,
        JSON.stringify(c.ROOM_SETUP), 
        JSON.stringify(util.serverStartTime),
        roomSpeed
    );
}
```
Replace it with
```
if (needsRoom !== -1 && needsRoom !== 0) { socket.kick('Bad spawn request.'); return 1; }
// Bring to life
socket.status.deceased = false;
// Define the player.
if (players.indexOf(socket.player) != -1) { util.remove(players, players.indexOf(socket.player));  }
// Free the old view
if (views.indexOf(socket.view) != -1) { util.remove(views, views.indexOf(socket.view)); socket.makeView(); }
socket.player = socket.spawn(name);     
// Give it the room state
if (!needsRoom) { 
    socket.talk(
        'R',
        room.width,
        room.height,
        JSON.stringify(c.ROOM_SETUP), 
        JSON.stringify(util.serverStartTime),
        roomSpeed
    );
}
```
and your server will be back to normal!

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