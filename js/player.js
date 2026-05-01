// Biker state and animation
const Player = (() => {
  // Animation frame keys
  const FRAME = {
    PEDAL1: "bikerPedal1",
    PEDAL2: "bikerPedal2",
    LEFT: "bikerLeft",
    RIGHT: "bikerRight",
    CRASH: "bikerCrash",
  };

  const TRAIL_FADE = 0.012; // alpha lost per frame (~83 frames to vanish)

  let worldX, worldY, crashed, pedalTimer, pedalToggle, frameKey, trail;

  function reset() {
    worldX = 0;
    worldY = 0;
    crashed = false;
    pedalTimer = 0;
    pedalToggle = false;
    frameKey = FRAME.PEDAL1;
    trail = [];
  }

  function update(dt, gameSpeed) {
    if (crashed) return;

    worldY += gameSpeed;

    const steer = Input.steer;
    worldX += steer * CONFIG.MAX_LATERAL_SPEED;
    worldX = Math.max(
      -CONFIG.MAX_WORLD_X,
      Math.min(CONFIG.MAX_WORLD_X, worldX),
    );

    // Grass trail — record a point each frame the biker is off-road
    const onGrass = Math.abs(worldX) > CONFIG.ROAD_HALF_W;
    if (onGrass) trail.push({ worldX, worldY, alpha: 1.0 });
    for (const pt of trail) pt.alpha -= TRAIL_FADE;
    while (trail.length && trail[0].alpha <= 0) trail.shift();

    // Animation
    if (steer < -0.15) {
      frameKey = FRAME.LEFT;
      pedalTimer = 0;
    } else if (steer > 0.15) {
      frameKey = FRAME.RIGHT;
      pedalTimer = 0;
    } else {
      pedalTimer += dt;
      if (pedalTimer >= CONFIG.PEDAL_FRAME_MS) {
        pedalTimer = 0;
        pedalToggle = !pedalToggle;
      }
      frameKey = pedalToggle ? FRAME.PEDAL2 : FRAME.PEDAL1;
    }
  }

  function crash() {
    crashed = true;
    frameKey = FRAME.CRASH;
  }

  return {
    reset,
    update,
    crash,
    get worldX() { return worldX; },
    get worldY() { return worldY; },
    get crashed() { return crashed; },
    get frameKey() { return frameKey; },
    get trail() { return trail; },
  };
})();
