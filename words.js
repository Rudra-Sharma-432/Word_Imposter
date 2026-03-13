// words.js
// ─────────────────────────────────────────────────────────────────
// All word categories used by the game to assign a secret word.
// Structure:  WORD_LIST  →  category[]  →  subCategory[]  →  word[]
//
// When startGame() picks a word it does:
//   category    = random pick from WORD_LIST
//   subCategory = random pick from that category
//   word        = random pick from that subCategory
// ─────────────────────────────────────────────────────────────────

const WORD_LIST = [

  /* ── Nature ── */
  [
    ["river", "waterfall", "ocean", "reef"],
    ["valley", "canyon", "cliff", "glacier", "desert", "dune", "swamp", "cave", "forest", "jungle", "savanna", "meadow", "island"],
    ["sunrise", "sunset", "rainbow", "storm", "thunder", "shadow"],
    ["planet", "galaxy", "satellite"]
  ],

  /* ── Places & Structures ── */
  [
    ["building", "library", "castle", "pyramid"],
    ["bridge", "harbor", "ladder"],
    ["mirror", "candle", "lantern", "compass", "map"]
  ],

  /* ── Professions ── */
  [
    ["artist", "writer", "singer", "photographer"],
    ["scientist", "engineer", "architect", "mechanic", "inventor"],
    ["teacher", "doctor", "chef", "driver"],
    ["explorer", "farmer", "gardener", "fisherman", "pilot", "detective", "tailor"]
  ],

  /* ── Actions ── */
  [
    ["running", "climbing", "jumping", "swimming", "dancing", "traveling", "exploring"],
    ["writing", "drawing", "painting", "cooking", "building"],
    ["thinking", "learning", "solving", "searching", "discovering"],
    ["whispering", "laughing", "singing"]
  ],

  /* ── Feelings ── */
  [
    ["joy", "hope", "trust", "gratitude", "confidence", "excitement", "calmness"],
    ["fear", "anger", "envy", "doubt", "loneliness"],
    ["courage", "patience", "ambition", "pride", "determination"],
    ["curiosity", "surprise", "wonder", "nostalgia"]
  ],

  /* ── Instruments & Tools ── */
  [
    ["guitar", "violin"],
    ["piano"],
    ["flute", "trumpet"],
    ["drum"],
    ["camera", "microscope", "binoculars", "telescope"],
    ["notebook", "calculator", "keyboard", "typewriter"],
    ["backpack", "helmet", "umbrella", "watch", "speaker", "projector"]
  ],

  /* ── Vehicles ── */
  [
    ["rocket", "spaceship", "airplane", "helicopter", "balloon", "parachute"],
    ["submarine", "canoe", "yacht"],
    ["train", "truck", "tractor", "bicycle", "motorcycle", "scooter", "skateboard", "sled"],
    ["ambulance", "firetruck"]
  ],

  /* ── Games & Concepts ── */
  [
    ["puzzle", "chess", "maze"],
    ["treasure", "adventure", "mission"],
    ["challenge", "strategy", "victory", "defeat"],
    ["alliance", "betrayal"],
    ["mystery", "secret", "legend", "myth"],
    ["signal", "code", "cipher"]
  ],

  /* ── Animals ── */
  [
    ["tiger", "wolf", "cheetah", "elephant", "gorilla", "panda", "kangaroo", "camel", "antelope", "squirrel", "hedgehog", "beaver"],
    ["dolphin", "octopus"],
    ["owl", "falcon", "parrot", "peacock"],
    ["butterfly", "penguin"]
  ]

];