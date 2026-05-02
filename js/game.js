// Main game loop and state machine
const Game = (() => {
  const STATES = { MENU: "MENU", PLAYING: "PLAYING", GAMEOVER: "GAMEOVER" };
  let state, gameSpeed, lastTime, speedTimer, score;
  let canvas, overlayStart, overlayGameover, finalScoreEl, crashIntoEl;

  function _setState(s) {
    state = s;
    overlayStart.classList.toggle("hidden", s !== STATES.MENU);
    overlayGameover.classList.toggle("hidden", s !== STATES.GAMEOVER);
  }

  function _startGame() {
    Player.reset();
    Obstacles.reset();
    gameSpeed = CONFIG.BASE_SPEED;
    speedTimer = 0;
    score = 0;
    _setState(STATES.PLAYING);
  }

  function _triggerGameOver() {
    Player.crash();
    finalScoreEl.textContent = score;
    const hit = Obstacles.lastHit;
    if (hit) {
      const def = CONFIG.OBSTACLE_TYPES[hit.key];
      crashIntoEl.textContent = def.name;
    }
    _setState(STATES.GAMEOVER);
  }

  function _tick(now) {
    requestAnimationFrame(_tick);
    const dt = Math.min(now - lastTime, 100); // cap dt to avoid spiral of death
    lastTime = now;

    if (state === STATES.PLAYING) {
      // Speed ramp
      speedTimer += dt;
      if (speedTimer >= CONFIG.SPEED_INTERVAL) {
        speedTimer = 0;
        gameSpeed = Math.min(
          CONFIG.MAX_SPEED,
          gameSpeed + CONFIG.SPEED_INCREMENT,
        );
      }

      Player.update(dt, gameSpeed);
      Obstacles.update(dt, gameSpeed);
      score = Math.floor(Player.worldY / 10);

      if (Obstacles.checkCollision()) _triggerGameOver();
    }

    Renderer.drawFrame(state, score, gameSpeed);
  }

  function init() {
    canvas = document.getElementById("game");
    overlayStart = document.getElementById("overlay-start");
    overlayGameover = document.getElementById("overlay-gameover");
    finalScoreEl = document.getElementById("final-score");
    finalMoneyEl = document.getElementById("final-money");
    crashIntoEl = document.getElementById("crash-into-name");

    _resizeCanvas();
    window.addEventListener("resize", _resizeCanvas);

    Input.init(canvas);
    World.init(canvas);
    Obstacles.init(canvas);
    Renderer.init(canvas);

    // Wire up donation URLs from config
    document.querySelectorAll(".donate-link").forEach((el) => {
      el.href = CONFIG.DONATION_URL;
    });

    // Button listeners
    document.getElementById("btn-start").addEventListener("click", _startGame);
    document.getElementById("btn-start").addEventListener("touchend", (e) => {
      e.preventDefault();
      _startGame();
    });
    document
      .getElementById("btn-restart")
      .addEventListener("click", _startGame);
    document.getElementById("btn-restart").addEventListener("touchend", (e) => {
      e.preventDefault();
      _startGame();
    });

    // Debug toggle — press D
    let _debug = false;
    window.addEventListener("keydown", (e) => {
      if (e.key === "d" || e.key === "D") {
        _debug = !_debug;
        Renderer.setDebug(_debug);
      }
    });

    _setState(STATES.MENU);
    lastTime = performance.now();
    requestAnimationFrame(_tick);
  }

  function _resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  return { init };
})();

window.addEventListener("DOMContentLoaded", Game.init);
