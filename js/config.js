// ─── USER CONFIG ────────────────────────────────────────────────────────────
// Change DONATION_URL to update the donate button everywhere at once.

// Best-guess mobile detection: same signal used for the touch/hover hint.
const IS_MOBILE = window.innerWidth <= 768;

const CONFIG = {
  DONATION_URL:
    "https://supportthepmcf.ca/ui/Ride26/p/c9777d5aaeb240b8a016feb40ab23247",
  SHARE_URL: "kelly-conquers-cancer.netlify.app/",

  COLORS: {
    primary: "#3A7BD5", // blue (logo top)
    accent: "#E8842A", // orange (logo bottom)
    road: "#555555",
    roadDark: "#4A4A4A",
    roadEdgeLine: "#7e7e7e",
    roadLine: "#FFFFFF",
    grass: "#246728",
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
    obstacleTree: "assets/sprites/obstacle-tree.png",
    obstacleCyclist: "assets/sprites/obstacle-cyclist.png",
    obstacleCell: "assets/sprites/obstacle-cancer-cell.png",
    obstaclePothole: "assets/sprites/obstacle-pothole.png",
  },
  SPRITE_SIZE: 64, // all sprites must be this many px square

  // ─── GAME TUNING ──────────────────────────────────────────────────────────
  //   Mobile values are nerfed — touch steering is less precise than a mouse.
  BASE_SPEED: IS_MOBILE ? 2.5 : 4, // world px/frame at start
  MAX_SPEED: IS_MOBILE ? 8 : 14,
  SPEED_INCREMENT: IS_MOBILE ? 0.2 : 0.4, // ramps more gently on mobile
  SPEED_INTERVAL: 3500, // ms between speed increases

  MAX_LATERAL_SPEED: IS_MOBILE ? 4 : 6, // px/frame max left/right drift
  MAX_WORLD_X: 1400, // hard clamp: biker can't drift beyond ±this

  // ─── OBSTACLE SPAWN RATES ─────────────────────────────────────────────────
  // interval: ms between spawns at base speed (scales down as speed ramps up)
  // minInterval: fastest it can ever spawn regardless of speed
  // zone: "road" spawns on tarmac, "grass" spawns on both grass sides
  OBSTACLE_TYPES: {
    cyclist: {
      name: "a cyclist",
      emoji: "🚴",
      spriteKey: "obstacleCyclist",
      zone: "road",
      interval: 2200,
      minInterval: 700,
      speed: 2.2,
      zLayer: 1, // drawn on top of ground-level obstacles
    },
    cancerCell: {
      name: "a cancer cell",
      emoji: "🦠",
      spriteKey: "obstacleCell",
      zone: "road",
      interval: 3000,
      minInterval: 900,
      speed: 0,
      zLayer: 1,
    },
    pothole: {
      name: "a pothole",
      emoji: "🕳️",
      spriteKey: "obstaclePothole",
      zone: "road",
      interval: 2100,
      minInterval: 380,
      speed: 0,
      zLayer: 0, // ground level — drawn first so cyclists ride over them
    },
    tree: {
      name: "a tree",
      emoji: "🌲",
      spriteKey: "obstacleTree",
      zone: "grass",
      interval: 1800,
      minInterval: 650,
      speed: 0,
      zLayer: 1,
    },
  },

  PEDAL_FRAME_MS: 160, // ms per pedal animation frame swap

  BIKER_SCREEN_Y_RATIO: 0.42, // biker drawn this far from top of screen
  SPAWN_DIST_RATIO: 0.65, // spawn obstacles this many screen-heights ahead

  HITBOX_SHRINK: 0.72, // collision box = sprite size × this (forgiving)

  ROAD_HALF_W: 800, // world units from centre to each road/grass edge
};
