global.showDebug &&
  (drawGuiRect(i, c - 40, t, 30),
  r(L, i, c - 40, t, 30, color.yellow),
  n(metrics.rendergap, i, c - 40, t, 30, color.pink),
  o(d, i, c - 40, t, 30, color.teal),
  (g -= 40)),
  global.showDebug
    ? (s.debug[6].draw("Dexamenes.io", i + t, g - 142, 15, color.blue, "right"),
      s.debug[9].draw(
        "Players: " + player.getPlayerCount(),
        i + t,
        g - 126,
        10,
        color.guiwhite,
        "right"
      ),
      s.debug[8].draw(
        "Kill Count: " + player.kills,
        i + t,
        g - 112,
        10,
        color.guiwhite,
        "right"
      ),
      s.debug[7].draw(
        "Entities: " + entities.length,
        i + t,
        g - 98,
        10,
        color.guiwhite,
        "right"
      ),
      s.debug[6].draw(
        "Tank Speed: " + (isNaN(u) ? "0" : u) + " tps",
        i + t,
        g - 84,
        10,
        color.guiwhite,
        "right"
      ),
      s.debug[0].draw(
        "Position: (" +
          Math.floor(player.cx) +
          ", " +
          Math.floor(player.cy) +
          ")",
        i + t,
        g - 70,
        10,
        color.guiwhite,
        "right"
      ),
      s.debug[5].draw(
        "Prediction: " + L.toFixed(3),
        i + t,
        g - 56,
        10,
        color.guiwhite,
        "right"
      ),
      s.debug[4].draw(
        "Update Rate: " + metrics.updatetime + "Hz",
        i + t,
        g - 42,
        10,
        color.guiwhite,
        "right"
      ))
    : s.debug[6].draw(
        "Dexamenes.io",
        i + t,
        g - 42 - 2,
        15,
        color.blue,
        "right"
      ),
  s.debug[3].draw(
    "Client Speed: " + metrics.rendertime + " FPS",
    i + t,
    g - 28,
    10,
    metrics.rendertime > 10 ? color.guiwhite : color.orange,
    "right"
  ),
  s.debug[2].draw(
    "Server Speed: " + (100 * gui.fps).toFixed(2) + "%",
    i + t,
    g - 14,
    10,
    1 === gui.fps ? color.guiwhite : color.orange,
    "right"
  ),
  s.debug[1].draw(
    d.toFixed(1) + " ms  : " + global.server.name,
    i + t,
    g,
    10,
    color.guiwhite,
    "right"
  );
