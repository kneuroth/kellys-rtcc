// All canvas drawing: road, sprites (with placeholder fallback), HUD
const Renderer = (() => {
  let canvas, ctx;
  let debugMode = false;
  const loaded = {}; // spriteKey → Image (only entries that loaded successfully)

  // ── Sprite loading ──────────────────────────────────────────────────────────
  function loadSprites() {
    for (const [key, path] of Object.entries(CONFIG.SPRITES)) {
      if (!path) continue;
      const img = new Image();
      img.onload = () => {
        loaded[key] = img;
      };
      img.onerror = () => {
        /* keep placeholder */
      };
      img.src = path;
    }
  }

  function init(c) {
    canvas = c;
    ctx = c.getContext("2d");
    loadSprites();
  }

  // ── Helpers ─────────────────────────────────────────────────────────────────
  function _centeredSprite(key, x, y) {
    const s = CONFIG.SPRITE_SIZE;
    if (loaded[key]) {
      ctx.drawImage(loaded[key], x - s / 2, y - s / 2, s, s);
    } else {
      _placeholders[key]?.(x, y);
    }
  }

  // ── Placeholder drawing functions ───────────────────────────────────────────
  const _placeholders = {
    bikerPedal1: (x, y) => _drawBiker(x, y, 0, false),
    bikerPedal2: (x, y) => _drawBiker(x, y, 0, true),
    bikerLeft: (x, y) => _drawBiker(x, y, 0.25, false),
    bikerRight: (x, y) => _drawBiker(x, y, -0.25, false),
    bikerCrash: (x, y) => _drawBikerCrash(x, y),
    obstacleTree:    (x, y) => _drawTree(x, y),
    obstacleCyclist: (x, y) => _drawCyclist(x, y),
    obstacleCell:    (x, y) => _drawCancerCell(x, y),
    obstaclePothole: (x, y) => _drawPothole(x, y),
  };

  function _drawBiker(x, y, lean, altPedal) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(lean);

    // Shadow
    ctx.beginPath();
    ctx.ellipse(2, 4, 14, 8, 0, 0, Math.PI * 2);
    ctx.fillStyle = CONFIG.COLORS.shadow;
    ctx.fill();

    // Body (jersey)
    ctx.beginPath();
    ctx.ellipse(0, 4, 10, 15, 0, 0, Math.PI * 2);
    ctx.fillStyle = CONFIG.COLORS.primary;
    ctx.fill();

    // Head (helmet)
    ctx.beginPath();
    ctx.ellipse(0, -12, 8, 9, 0, 0, Math.PI * 2);
    ctx.fillStyle = CONFIG.COLORS.accent;
    ctx.fill();

    // Legs (pedalling alternation)
    ctx.strokeStyle = "#1a1a1a";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    const legY = altPedal ? [6, 14] : [14, 6];
    ctx.beginPath();
    ctx.moveTo(-8, 2);
    ctx.lineTo(-11, legY[0]);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(8, 2);
    ctx.lineTo(11, legY[1]);
    ctx.stroke();

    // Handlebars
    ctx.beginPath();
    ctx.moveTo(-9, -5);
    ctx.lineTo(9, -5);
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.restore();
  }

  function _drawBikerCrash(x, y) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.PI / 3);

    ctx.beginPath();
    ctx.ellipse(0, 4, 10, 15, 0, 0, Math.PI * 2);
    ctx.fillStyle = CONFIG.COLORS.primary;
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(0, -12, 8, 9, 0, 0, Math.PI * 2);
    ctx.fillStyle = CONFIG.COLORS.accent;
    ctx.fill();

    // Stars
    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 14px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("★", -14, -18);
    ctx.fillText("★", 14, -22);

    ctx.restore();
  }

  function _drawTree(x, y) {
    ctx.save();
    ctx.translate(x, y);

    // Shadow on ground
    ctx.beginPath();
    ctx.ellipse(4, 5, 16, 10, 0, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.fill();

    // Outer foliage
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, Math.PI * 2);
    ctx.fillStyle = "#2d7a2d";
    ctx.fill();

    // Mid foliage highlight (gives depth)
    ctx.beginPath();
    ctx.arc(-2, -2, 11, 0, Math.PI * 2);
    ctx.fillStyle = "#3da33d";
    ctx.fill();

    // Top highlight cluster
    ctx.beginPath();
    ctx.arc(-3, -4, 6, 0, Math.PI * 2);
    ctx.fillStyle = "#55bb55";
    ctx.fill();

    // Tiny bright specular dot
    ctx.beginPath();
    ctx.arc(-5, -6, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.2)";
    ctx.fill();

    ctx.restore();
  }

  function _drawCyclist(x, y) {
    ctx.save();
    ctx.translate(x, y);

    // Shadow
    ctx.beginPath();
    ctx.ellipse(2, 4, 14, 8, 0, 0, Math.PI * 2);
    ctx.fillStyle = CONFIG.COLORS.shadow;
    ctx.fill();

    // Body (red jersey — distinct from player)
    ctx.beginPath();
    ctx.ellipse(0, 4, 10, 15, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#CC2233";
    ctx.fill();

    // Head
    ctx.beginPath();
    ctx.ellipse(0, -12, 8, 9, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#FFCC88";
    ctx.fill();

    // Handlebars
    ctx.beginPath();
    ctx.moveTo(-9, -5);
    ctx.lineTo(9, -5);
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.restore();
  }

  function _drawCancerCell(x, y) {
    ctx.save();
    ctx.translate(x, y);

    const SPIKES = 9;
    const innerR = 9;
    const outerR = 16;

    ctx.beginPath();
    for (let i = 0; i < SPIKES * 2; i++) {
      const angle = (i * Math.PI) / SPIKES - Math.PI / 2;
      const r = i % 2 === 0 ? outerR : innerR;
      i === 0
        ? ctx.moveTo(Math.cos(angle) * r, Math.sin(angle) * r)
        : ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
    }
    ctx.closePath();
    ctx.fillStyle = "#55CC44";
    ctx.strokeStyle = "#2a7a22";
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();

    // Nucleus
    ctx.beginPath();
    ctx.ellipse(0, 0, 5, 5, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#2a7a22";
    ctx.fill();

    ctx.restore();
  }

  function _drawPothole(x, y) {
    ctx.save();
    ctx.translate(x, y);

    // Outer rim (cracked asphalt edge)
    ctx.beginPath();
    ctx.ellipse(0, 0, 18, 13, 0.2, 0, Math.PI * 2);
    ctx.fillStyle = "#3a3a3a";
    ctx.fill();

    // Dark pit
    ctx.beginPath();
    ctx.ellipse(-1, 1, 13, 9, 0.2, 0, Math.PI * 2);
    ctx.fillStyle = "#111111";
    ctx.fill();

    // Rim highlight (one edge catches light)
    ctx.beginPath();
    ctx.ellipse(-4, -3, 7, 4, 0.5, 0, Math.PI);
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // A couple of crack lines radiating from edge
    ctx.strokeStyle = "#2a2a2a";
    ctx.lineWidth = 1.5;
    ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(14, 3);  ctx.lineTo(20, 7);  ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-15, -4); ctx.lineTo(-21, -8); ctx.stroke();

    ctx.restore();
  }

  // ── Road ────────────────────────────────────────────────────────────────────
  const DASH_H = 40;
  const DASH_GAP = 30;
  const DASH_CYCLE = DASH_H + DASH_GAP;
  const CRACK_CELL = 180; // world-unit grid cell size for crack placement
  const CRACK_RATE = 0.32; // fraction of cells that contain a crack

  // Integer hash of two grid coords → 0..1 (deterministic, no RNG state)
  function _hash(a, b) {
    let h = (Math.imul(a, 374761393) ^ Math.imul(b, 1234567891)) | 0;
    h = (Math.imul(h ^ (h >>> 13), 1664525) + 1013904223) | 0;
    return (h >>> 0) / 0xffffffff;
  }

  function _drawRoad() {
    const w = canvas.width,
      h = canvas.height;
    const BY = CONFIG.BIKER_SCREEN_Y_RATIO;

    // Solid asphalt
    ctx.fillStyle = CONFIG.COLORS.road;
    ctx.fillRect(0, 0, w, h);

    // Cracks — world-space positions, scroll identically to obstacles
    // _drawCracks(w, h);

    // Road edges at fixed world X positions — shift with camera like everything else
    const lx = Math.floor(World.toScreen(-CONFIG.ROAD_HALF_W, 0).x);
    const rx = Math.floor(World.toScreen( CONFIG.ROAD_HALF_W, 0).x);

    // Shoulder fills (only drawn when the edge is on screen)
    ctx.fillStyle = CONFIG.COLORS.grass;
    if (lx > 0) ctx.fillRect(0, 0, lx, h);
    if (rx < w) ctx.fillRect(rx, 0, w - rx, h);

    // Solid white edge lines
    ctx.strokeStyle = CONFIG.COLORS.roadLine;
    ctx.lineWidth = 4;
    if (lx > -4 && lx < w + 4) {
      ctx.beginPath();
      ctx.moveTo(lx, 0);
      ctx.lineTo(lx, h);
      ctx.stroke();
    }
    if (rx > -4 && rx < w + 4) {
      ctx.beginPath();
      ctx.moveTo(rx, 0);
      ctx.lineTo(rx, h);
      ctx.stroke();
    }

    // Centre dashes — worldX=0, shift with camera
    const camY = World.cameraY();
    const centerX = Math.floor(World.toScreen(0, 0).x);
    const firstWY =
      Math.floor((camY - h * BY - DASH_H) / DASH_CYCLE) * DASH_CYCLE;
    const lastWY =
      Math.ceil((camY + h * (1 - BY) + DASH_H) / DASH_CYCLE) * DASH_CYCLE;
    ctx.fillStyle = CONFIG.COLORS.roadLine;
    for (let wy = firstWY; wy <= lastWY; wy += DASH_CYCLE) {
      ctx.fillRect(centerX - 2, Math.floor(World.toScreen(0, wy).y), 4, DASH_H);
    }
  }

  // ── HUD ─────────────────────────────────────────────────────────────────────
  function _drawHUD(score, gameSpeed) {
    ctx.font = "bold 22px 'Arial', sans-serif";
    ctx.fillStyle = CONFIG.COLORS.ui;
    ctx.shadowColor = "rgba(0,0,0,0.7)";
    ctx.shadowBlur = 6;
    ctx.textAlign = "left";
    ctx.fillText(`${score} m`, 18, 78);
    ctx.shadowBlur = 0;

    // Speed bar (bottom left)
    const barW = 120,
      barH = 8;
    const bx = 18,
      by = canvas.height - 28;
    const pct = Math.min(
      1,
      (gameSpeed - CONFIG.BASE_SPEED) / (CONFIG.MAX_SPEED - CONFIG.BASE_SPEED),
    );
    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.beginPath();
    ctx.roundRect(bx, by, barW, barH, 4);
    ctx.fill();
    ctx.fillStyle = CONFIG.COLORS.accent;
    ctx.beginPath();
    ctx.roundRect(bx, by, barW * pct, barH, 4);
    ctx.fill();
    ctx.font = "12px 'Arial', sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.fillText("Speed", bx, by - 5);
  }

  // ── Grass trail ─────────────────────────────────────────────────────────────
  function _drawTrail(trail) {
    if (!trail.length) return;
    for (let i = 0; i < trail.length; i++) {
      const pt = trail[i];
      const sp = World.toScreen(pt.worldX, pt.worldY);
      if (sp.y < -20 || sp.y > canvas.height + 20) continue;

      const a  = Math.max(0, pt.alpha);
      const r1 = _hash(pt.worldX | 0, pt.worldY | 0);
      const r2 = _hash((pt.worldX | 0) + 500, pt.worldY | 0);

      ctx.save();
      ctx.globalAlpha = a;

      // Two tyre-width pressed-grass marks
      ctx.fillStyle = "#3a7a36";
      for (const dx of [-5, 5]) {
        ctx.beginPath();
        ctx.ellipse(sp.x + dx, sp.y, 2.5, 5, (r1 - 0.5) * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // A few lighter grass blade streaks for texture
      ctx.strokeStyle = "#5db558";
      ctx.lineWidth = 1;
      ctx.lineCap = "round";
      for (let b = 0; b < 3; b++) {
        const bx = sp.x + (r2 * 16 - 8) + b * 5 - 5;
        const by = sp.y + (r1 * 6  - 3);
        ctx.beginPath();
        ctx.moveTo(bx, by);
        ctx.lineTo(bx + (r1 - 0.5) * 5, by - 5 - r2 * 4);
        ctx.stroke();
      }

      ctx.restore();
    }
  }

  // ── Debug hitbox overlay ────────────────────────────────────────────────────
  function _drawHitbox(x, y, color) {
    const hw = (CONFIG.SPRITE_SIZE * CONFIG.HITBOX_SHRINK) / 2;
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth   = 1.5;
    ctx.globalAlpha = 0.85;
    // Hitbox rect
    ctx.strokeRect(x - hw, y - hw, hw * 2, hw * 2);
    // Centre crosshair
    ctx.beginPath();
    ctx.moveTo(x - 4, y); ctx.lineTo(x + 4, y);
    ctx.moveTo(x, y - 4); ctx.lineTo(x, y + 4);
    ctx.stroke();
    // World coords label
    ctx.fillStyle   = color;
    ctx.globalAlpha = 0.9;
    ctx.font        = "9px monospace";
    ctx.textAlign   = "center";
    ctx.fillText(`${Math.round(x)},${Math.round(y)}`, x, y - hw - 3);
    ctx.restore();
  }

  // ── Steering hint text ──────────────────────────────────────────────────────
  function _drawControlHint() {
    const isTouchDevice = navigator.maxTouchPoints > 0;
    const msg = isTouchDevice
      ? "← touch here to steer →"
      : "← hover here to steer →";
    ctx.font = "13px 'Arial', sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.textAlign = "center";
    ctx.fillText(msg, canvas.width / 2, canvas.height - 14);
  }

  // ── Public draw frame ────────────────────────────────────────────────────────
  function drawFrame(state, score, gameSpeed) {
    _drawRoad();

    if (state === "PLAYING" || state === "GAMEOVER") {
      // Grass trail (under everything else)
      _drawTrail(Player.trail);

      // Obstacles
      for (const obs of Obstacles.pool) {
        const s = World.toScreen(obs.worldX, obs.worldY);
        _centeredSprite(obs.spriteKey, s.x, s.y);
        if (debugMode) _drawHitbox(s.x, s.y, "#ff4444");
      }

      // Biker
      const bp = World.toScreen(Player.worldX, Player.worldY);
      _centeredSprite(Player.frameKey, bp.x, bp.y);
      if (debugMode) _drawHitbox(bp.x, bp.y, "#44aaff");

      _drawHUD(score, gameSpeed);
      if (debugMode) _drawDebugHUD(score, gameSpeed);
      _drawControlHint();
    }
  }

  function _drawDebugHUD() {
    const steer = Input.steer.toFixed(2);
    const wx    = Math.round(Player.worldX);
    const wy    = Math.round(Player.worldY);
    ctx.save();
    ctx.font        = "11px monospace";
    ctx.fillStyle   = "#00ff88";
    ctx.textAlign   = "right";
    ctx.shadowColor = "rgba(0,0,0,0.8)";
    ctx.shadowBlur  = 4;
    ctx.fillText(`[DEBUG] D to toggle`, canvas.width - 12, 20);
    ctx.fillText(`steer: ${steer}`, canvas.width - 12, 36);
    ctx.fillText(`worldX: ${wx}  worldY: ${wy}`, canvas.width - 12, 52);
    ctx.fillText(`obstacles: ${Obstacles.pool.length}`, canvas.width - 12, 68);
    ctx.restore();
  }

  function drawObstaclePreview(spriteKey, previewCanvas) {
    const pCtx = previewCanvas.getContext("2d");
    const s    = previewCanvas.width;
    pCtx.clearRect(0, 0, s, s);

    // Subtle background disc so the sprite reads against the dark overlay
    pCtx.beginPath();
    pCtx.arc(s / 2, s / 2, s / 2 - 2, 0, Math.PI * 2);
    pCtx.fillStyle = "rgba(255,255,255,0.07)";
    pCtx.fill();

    if (loaded[spriteKey]) {
      pCtx.drawImage(loaded[spriteKey], 0, 0, s, s);
    } else {
      // Scale placeholders (designed for SPRITE_SIZE) up to fill the preview canvas
      const scale = s / CONFIG.SPRITE_SIZE;
      const prev  = ctx;
      ctx = pCtx;
      pCtx.save();
      pCtx.translate(s / 2, s / 2);
      pCtx.scale(scale, scale);
      _placeholders[spriteKey]?.(0, 0);  // placeholder already does translate(x,y) internally
      pCtx.restore();
      ctx = prev;
    }
  }

  return { init, drawFrame, setDebug: v => { debugMode = v; }, drawObstaclePreview };
})();
