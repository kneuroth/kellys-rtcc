// Biker state and animation
const Player = (() => {
  // Animation frame keys
  const FRAME = { PEDAL1: "bikerPedal1", PEDAL2: "bikerPedal2",
                  LEFT: "bikerLeft", RIGHT: "bikerRight", CRASH: "bikerCrash" };

  let worldX, worldY, crashed, pedalTimer, pedalToggle, frameKey;

  function reset() {
    worldX     = 0;
    worldY     = 0;
    crashed    = false;
    pedalTimer = 0;
    pedalToggle = false;
    frameKey   = FRAME.PEDAL1;
  }

  function update(dt, gameSpeed) {
    if (crashed) return;

    worldY += gameSpeed;

    const steer = Input.steer;
    worldX += steer * CONFIG.MAX_LATERAL_SPEED;
    worldX = Math.max(-CONFIG.MAX_WORLD_X, Math.min(CONFIG.MAX_WORLD_X, worldX));

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
    crashed  = true;
    frameKey = FRAME.CRASH;
  }

  return {
    reset,
    update,
    crash,
    get worldX()   { return worldX; },
    get worldY()   { return worldY; },
    get crashed()  { return crashed; },
    get frameKey() { return frameKey; },
  };
})();
