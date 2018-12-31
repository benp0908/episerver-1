# Breaking Changes

## December 30th, 2018

If you've created a private server with this template before December 30th, 2018, it will not support custom body shapes without this update!

Find the following in your server.js:
```
if (set.SHAPE != null) {
    this.shape = set.SHAPE;
}
```
Replace it with
```
if (set.SHAPE != null) {
    this.shape = typeof set.SHAPE === 'number' ? set.SHAPE : 0
    this.shapeData = set.SHAPE;
}
```
Then find
```
shape: e.shape
```
Replace it with
```
shape: e.shapeData
```
And you should be able to create custom bodies by putting an array of coordinates as the coordinates of the custom body. You can see an example of this in the TESTBED tank in definitions.js. It's also possible to put a SVG path data instead of simply an array, which can offer more customization.

## November 12th, 2018

If you've created a private server with this template before November 12th, 2018, the minimap and leaderboard will no longer work without this update!

Showing all entities on the minimap have been permanently removed due to lag issues. If you only want teammates and bosses to still be shown, however, you can replace the entire `broadcast` function, which you can find by searching `const broadcast = (() => {` and replacing it with the one in the template.

## July 2nd, 2018

If you've created a private server with this template before July 2nd, 2018, respawning will no longer work without this update:

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
