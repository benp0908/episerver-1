# Breaking Changes

## November 6th, 2018

If you've created a private server with this template before November 6th, 2018, the minimap and leaderboard will no longer work without this update!

Showing all entities on the minimap have been permanently removed due to lag issues. If you want to disable the minimap completely, you can do this:

Find the following in your server.js:
```
update: (data) => {
    // Flag all old data as to be removed
    for (let e of internalmap)
      e[0] = -1
    // Round all the old data
    data = data.map(d => [
      Math.round(255 * util.clamp(d[0] / room.width, 0, 1)),
      Math.round(255 * util.clamp(d[1] / room.height, 0, 1)),
      d[2]
    ])
    // Add new data and stabilze existing data, then emove old data
    for (let d of data) {
        // Find if it's already there
        let i = internalmap.findIndex(e => {
          return e[1] === d[0] &&
            e[2] === d[1] &&
            e[3] === d[2]
        })
        if (i === -1) { // if not add it
            internalmap.push([1, ...d])
        } else { // if so, flag it as stable
            internalmap[i][0] = 0
        }
    }
    // Export all new and old data
    let ex = internalmap.filter(e => e[0] !== 0)
    // Remove outdated data
    internalmap = internalmap.filter(e => e[0] !== -1)
    // Flatten the exports
    return flatten(ex)
    return [0]
},
```

Replace it with
```
update: (data) => [0, 0, 0],
```

If you want teammates and bosses to still be shown, however, ~~you can replace the entire `broadcast` function, which you can find by searching `const broadcast = \(\(\) => {`~~ you'll need to wait a bit, and you can check back on this document within a few days.

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
