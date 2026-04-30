// Camera + world-to-screen transform
const World = (() => {
  let canvas;

  function init(c) { canvas = c; }

  // Camera tracks the player exactly
  function cameraX() { return Player.worldX; }
  function cameraY() { return Player.worldY; }

  function toScreen(worldX, worldY) {
    return {
      x: worldX - cameraX() + canvas.width  / 2,
      y: worldY - cameraY() + canvas.height * CONFIG.BIKER_SCREEN_Y_RATIO,
    };
  }

  // Road tile scroll offsets (keep values in [0, size) for seamless tiling)
  function roadOffsetY(tileH) { return ((cameraY() % tileH) + tileH) % tileH; }
  function roadOffsetX(tileW) { return ((cameraX() % tileW) + tileW) % tileW; }

  return { init, toScreen, roadOffsetY, roadOffsetX, cameraX, cameraY };
})();
