// All canvas drawing: road, sprites (with placeholder fallback), HUD
const Renderer = (() => {
  let canvas, ctx;
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
    bikerLeft: (x, y) => _drawBiker(x, y, -0.25, false),
    bikerRight: (x, y) => _drawBiker(x, y, 0.25, false),
    bikerCrash: (x, y) => _drawBikerCrash(x, y),
    obstacleRock: (x, y) => _drawRock(x, y),
    obstacleCyclist: (x, y) => _drawCyclist(x, y),
    obstacleCell: (x, y) => _drawCancerCell(x, y),
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

  function _drawRock(x, y) {
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    // Irregular boulder shape
    const pts = [
      [-14, 4],
      [-8, -12],
      [4, -14],
      [14, -4],
      [12, 8],
      [4, 14],
      [-8, 12],
      [-14, 4],
    ];
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.closePath();
    ctx.fillStyle = "#7a6a5a";
    ctx.strokeStyle = "#4a3a2a";
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();
    // Highlight
    ctx.beginPath();
    ctx.ellipse(-3, -4, 4, 3, -0.4, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.25)";
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

  function _drawCrack(x, y, r0, r1) {
    const arms = 2 + ((r0 * 3) | 0); // 2–4 arms per crack
    const baseAng = r1 * Math.PI * 2;
    ctx.beginPath();
    for (let i = 0; i < arms; i++) {
      const ang = baseAng + (i / arms) * Math.PI * 2;
      const len = 7 + r0 * 12;
      // Two-segment jagged arm for a realistic crack look
      const jx = x + Math.cos(ang) * len * 0.45 + (r1 - 0.5) * 5;
      const jy = y + Math.sin(ang) * len * 0.45 + (r0 - 0.5) * 5;
      ctx.moveTo(x, y);
      ctx.lineTo(jx, jy);
      ctx.lineTo(x + Math.cos(ang) * len, y + Math.sin(ang) * len);
    }
    ctx.stroke();
  }

  function _drawCracks(w, h) {
    const camX = World.cameraX();
    const camY = World.cameraY();
    const BY = CONFIG.BIKER_SCREEN_Y_RATIO;
    const margin = CRACK_CELL;

    // Cell ranges that are on screen
    const gx0 = Math.floor((camX - w / 2 - margin) / CRACK_CELL);
    const gx1 = Math.ceil((camX + w / 2 + margin) / CRACK_CELL);
    const gy0 = Math.floor((camY - h * BY - margin) / CRACK_CELL);
    const gy1 = Math.ceil((camY + h * (1 - BY) + margin) / CRACK_CELL);

    ctx.save();
    ctx.strokeStyle = "rgba(0,0,0,0.20)";
    ctx.lineWidth = 1.5;
    ctx.lineCap = "round";

    for (let gx = gx0; gx <= gx1; gx++) {
      for (let gy = gy0; gy <= gy1; gy++) {
        const r0 = _hash(gx, gy);
        if (r0 > CRACK_RATE) continue;

        // Sub-cell position (each cell always gets the same crack)
        const r1 = _hash(gx + 997, gy);
        const r2 = _hash(gx, gy + 997);
        const wx = gx * CRACK_CELL + r1 * CRACK_CELL;
        const wy = gy * CRACK_CELL + r2 * CRACK_CELL;

        const sp = World.toScreen(wx, wy);
        _drawCrack(sp.x, sp.y, r0, _hash(gx * 7, gy * 13));
      }
    }
    ctx.restore();
  }

  function _drawRoad() {
    const w = canvas.width, h = canvas.height;
    const BY = CONFIG.BIKER_SCREEN_Y_RATIO;

    // Solid asphalt
    ctx.fillStyle = CONFIG.COLORS.road;
    ctx.fillRect(0, 0, w, h);

    // Cracks — world-space positions, scroll identically to obstacles
    _drawCracks(w, h);

    // Road edges at fixed world X positions — shift with camera like everything else
    const ROAD_HALF_W = 800;  // world units from centre to each road edge
    const lx = Math.floor(World.toScreen(-ROAD_HALF_W, 0).x);
    const rx = Math.floor(World.toScreen( ROAD_HALF_W, 0).x);

    // Shoulder fills (only drawn when the edge is on screen)
    ctx.fillStyle = CONFIG.COLORS.shoulder;
    if (lx > 0)  ctx.fillRect(0,  0, lx,      h);
    if (rx < w)  ctx.fillRect(rx, 0, w - rx,  h);

    // Solid white edge lines
    ctx.strokeStyle = CONFIG.COLORS.roadLine;
    ctx.lineWidth = 4;
    if (lx > -4 && lx < w + 4) {
      ctx.beginPath(); ctx.moveTo(lx, 0); ctx.lineTo(lx, h); ctx.stroke();
    }
    if (rx > -4 && rx < w + 4) {
      ctx.beginPath(); ctx.moveTo(rx, 0); ctx.lineTo(rx, h); ctx.stroke();
    }

    // Centre dashes — worldX=0, shift with camera
    const camY      = World.cameraY();
    const centerX   = Math.floor(World.toScreen(0, 0).x);
    const firstWY   = Math.floor((camY - h * BY      - DASH_H) / DASH_CYCLE) * DASH_CYCLE;
    const lastWY    = Math.ceil( (camY + h * (1 - BY) + DASH_H) / DASH_CYCLE) * DASH_CYCLE;
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
    ctx.fillText(`${score} m`, 18, 38);
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

  // ── Steering hint text ──────────────────────────────────────────────────────
  function _drawControlHint() {
    const isTouchDevice = navigator.maxTouchPoints > 0;
    const msg = isTouchDevice
      ? "← touch here to steer →"
      : "← hover here to steer →";
    ctx.font      = "13px 'Arial', sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.textAlign = "center";
    ctx.fillText(msg, canvas.width / 2, canvas.height - 14);
  }

  // ── Public draw frame ────────────────────────────────────────────────────────
  function drawFrame(state, score, gameSpeed) {
    _drawRoad();

    if (state === "PLAYING" || state === "GAMEOVER") {
      // Obstacles
      for (const obs of Obstacles.pool) {
        const s = World.toScreen(obs.worldX, obs.worldY);
        _centeredSprite(obs.spriteKey, s.x, s.y);
      }

      // Biker
      const bp = World.toScreen(Player.worldX, Player.worldY);
      _centeredSprite(Player.frameKey, bp.x, bp.y);

      _drawHUD(score, gameSpeed);
      _drawControlHint();
    }
  }

  return { init, drawFrame };
})();
