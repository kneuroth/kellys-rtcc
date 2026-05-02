// Obstacle pool — each type has its own independent spawn timer
const Obstacles = (() => {
  let pool, timers, canvas, lastHit;

  function init(c) { canvas = c; reset(); }

  function reset() {
    pool    = [];
    lastHit = null;
    timers  = {};
    for (const key of Object.keys(CONFIG.OBSTACLE_TYPES)) timers[key] = 0;
  }

  function _scaledInterval(def, gameSpeed) {
    return Math.max(def.minInterval, def.interval * (CONFIG.BASE_SPEED / gameSpeed));
  }

  function _spawnX(zone) {
    const road  = CONFIG.ROAD_HALF_W;
    const max   = CONFIG.MAX_WORLD_X;
    if (zone === "road") {
      return (Math.random() * 2 - 1) * road * 0.88;
    }
    // grass — pick left or right side randomly
    const inner = road * 1.08;
    const outer = max  * 0.92;
    const side  = Math.random() < 0.5 ? 1 : -1;
    return side * (inner + Math.random() * (outer - inner));
  }

  function update(dt, gameSpeed) {
    const spawnDist = canvas.height * CONFIG.SPAWN_DIST_RATIO;

    for (const [key, def] of Object.entries(CONFIG.OBSTACLE_TYPES)) {
      timers[key] += dt;
      if (timers[key] >= _scaledInterval(def, gameSpeed)) {
        timers[key] = 0;
        pool.push({
          key,
          spriteKey: def.spriteKey,
          worldX: _spawnX(def.zone),
          worldY: Player.worldY + spawnDist,
          speed:  def.speed  ?? 0,
          zLayer: def.zLayer ?? 1,
        });
      }
    }

    // Move obstacles that have their own velocity
    for (const obs of pool) {
      if (obs.speed) obs.worldY += obs.speed;
    }

    // Cull anything that has scrolled off the top of the screen
    pool = pool.filter(obs => World.toScreen(obs.worldX, obs.worldY).y > -CONFIG.SPRITE_SIZE * 2);
  }

  function checkCollision() {
    const hw = (CONFIG.SPRITE_SIZE * CONFIG.HITBOX_SHRINK) / 2;
    const bp = World.toScreen(Player.worldX, Player.worldY);
    for (const obs of pool) {
      const sp = World.toScreen(obs.worldX, obs.worldY);
      if (Math.abs(bp.x - sp.x) < hw * 2 && Math.abs(bp.y - sp.y) < hw * 2) {
        lastHit = obs;
        return true;
      }
    }
    return false;
  }

  return { init, reset, update, checkCollision, get pool() { return pool; }, get lastHit() { return lastHit; } };
})();
