// ─── USER CONFIG ────────────────────────────────────────────────────────────
// Change DONATION_URL to update the donate button everywhere at once.
const CONFIG = {
  DONATION_URL:
    "https://supportthepmcf.ca/ui/Ride26/p/c9777d5aaeb240b8a016feb40ab23247",

  COLORS: {
    primary: "#3A7BD5", // blue (logo top)
    accent: "#E8842A", // orange (logo bottom)
    road: "#555555",
    roadDark: "#4A4A4A", // alternating stripe for asphalt texture
    roadLine: "#FFFFFF",
    shoulder: "#888888",
    ui: "#FFFFFF",
    overlay: "rgba(0,0,0,0.78)",
    shadow: "rgba(0,0,0,0.45)",
  },

  // Sprite PNG paths. Set any value to null to keep the canvas placeholder.
  SPRITES: {
    bikerPedal1: "assets/sprites/biker-pedal1.png",
    bikerPedal2: "assets/sprites/biker-pedal2.png",
    bikerLeft: "assets/sprites/biker-left.png",
    bikerRight: "assets/sprites/biker-right.png",
    bikerCrash: "assets/sprites/biker-crash.png",
    obstacleRock: "assets/sprites/obstacle-rock.png",
    obstacleCyclist: "assets/sprites/obstacle-cyclist.png",
    obstacleCell: "assets/sprites/obstacle-cancer-cell.png",
  },
  SPRITE_SIZE: 64, // all sprites must be this many px square

  // ─── GAME TUNING ──────────────────────────────────────────────────────────
  BASE_SPEED: 4, // world px/frame at start
  MAX_SPEED: 14,
  SPEED_INCREMENT: 0.4, // added to speed every SPEED_INTERVAL ms
  SPEED_INTERVAL: 4000, // ms between speed increases

  MAX_LATERAL_SPEED: 6, // px/frame max left/right drift
  MAX_WORLD_X: 1400, // hard clamp: biker can't drift beyond ±this

  OBSTACLE_INTERVAL: 1400, // ms between obstacle spawns
  MIN_OBSTACLE_INTERVAL: 500,
  PEDAL_FRAME_MS: 160, // ms per pedal animation frame swap

  BIKER_SCREEN_Y_RATIO: 0.42, // biker drawn this far from top of screen
  SPAWN_DIST_RATIO: 0.65, // spawn obstacles this many screen-heights ahead

  HITBOX_SHRINK: 0.72, // collision box = sprite size × this (forgiving)
};
