// Obstacle pool, spawning, movement, collision
const Obstacles = (() => {
  const TYPES = [
    { key: "rock",       spriteKey: "obstacleRock",    weight: 4 },
    { key: "cyclist",    spriteKey: "obstacleCyclist",  weight: 3 },
    { key: "cancerCell", spriteKey: "obstacleCell",     weight: 3 },
  ];
  const TOTAL_WEIGHT = TYPES.reduce((s, t) => s + t.weight, 0);

  let pool, spawnTimer, spawnInterval, canvas;

  function init(c) {
    canvas = c;
    reset();
  }

  function reset() {
    pool          = [];
    spawnTimer    = 0;
    spawnInterval = CONFIG.OBSTACLE_INTERVAL;
  }

  function _pickType() {
    let r = Math.random() * TOTAL_WEIGHT;
    for (const t of TYPES) { r -= t.weight; if (r <= 0) return t; }
    return TYPES[0];
  }

  function _spawn(gameSpeed) {
    const type = _pickType();
    // Spawn just off the bottom of the screen in world coordinates.
    // worldY decreases as the player moves forward, so "below" the visible
    // area is at player.worldY + spawnDist.
    const spawnDist = canvas.height * CONFIG.SPAWN_DIST_RATIO;
    const spreadX   = Math.min(CONFIG.MAX_WORLD_X, canvas.width * 0.9);
    pool.push({
      type:      type.key,
      spriteKey: type.spriteKey,
      worldX:    (Math.random() * 2 - 1) * spreadX,
      worldY:    Player.worldY + spawnDist,
    });
  }

  function update(dt, gameSpeed) {
    // Decrease spawn interval as game speeds up
    spawnInterval = Math.max(
      CONFIG.MIN_OBSTACLE_INTERVAL,
      CONFIG.OBSTACLE_INTERVAL * (CONFIG.BASE_SPEED / gameSpeed)
    );

    spawnTimer += dt;
    if (spawnTimer >= spawnInterval) {
      spawnTimer = 0;
      _spawn(gameSpeed);
    }

    // Cull obstacles that have scrolled past the top of screen
    pool = pool.filter(obs => {
      const s = World.toScreen(obs.worldX, obs.worldY);
      return s.y > -CONFIG.SPRITE_SIZE * 2;
    });
  }

  function checkCollision() {
    const hw   = (CONFIG.SPRITE_SIZE * CONFIG.HITBOX_SHRINK) / 2;
    const bikerScreen = World.toScreen(Player.worldX, Player.worldY);
    const bx = bikerScreen.x, by = bikerScreen.y;

    for (const obs of pool) {
      const s  = World.toScreen(obs.worldX, obs.worldY);
      const ox = s.x, oy = s.y;
      if (
        Math.abs(bx - ox) < hw * 2 &&
        Math.abs(by - oy) < hw * 2
      ) return true;
    }
    return false;
  }

  return {
    init,
    reset,
    update,
    checkCollision,
    get pool() { return pool; },
  };
})();
