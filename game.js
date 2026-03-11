// this is like the back end of the game.

// Create a Room System
function createRoom(playerName) {

  const roomId = Math.floor(Math.random() * 10000);
  const roomName = "room_" + roomId;
  const playerID = "player_" + Date.now();

  const roomRef = db.ref("games/Word_Imposter/rooms/" + roomName);

  roomRef.set({
    host: playerID,
    roomID: roomId,
    password: "",
    state: "lobby",
    players: {
      [playerID]: {
        name: playerName,
        score: 0
      }
    },
    playerCount: 1,
    alivePlayers: 1,
    settings: {
      eachPlayerDiscussionTime: 60,
      maxPlayers: 8,
      maxRounds: 5
    },
    game: {
      round: 1
    }
  });



  db.ref("games/Word_Imposter/rooms/" + roomName)
    .on("value", snapshot => {

      const room = snapshot.val();
      console.log("the room is ");
      console.log(room);

    });



  joinRoom(roomName, playerID);
}


// Join Room
function joinRoom(roomName, playerId) {

  if (!playerId) {
    playerId = "player_" + Date.now();
    var playerName = "Player"; // later from account system

    db.ref("games/Word_Imposter/rooms/" + roomName + "/players/" + playerId).set({
      name: playerName,
      score: 0
    });
  }


  currentRoom = roomName;
  currentPlayer = playerId;

  listenToRoom(roomName);

  goToPanel("lobby");
}


// Listen to Room Updates
function listenToRoom(roomName) {

  db.ref("games/Word_Imposter/rooms/" + roomName)
    .on("value", snapshot => {

      const room = snapshot.val();

      updatePlayersUI(room);

      if (room.state === "playing") {
        startGame(room);
      }

    });

}

// Start Gmae by host
function startGameByHost() {
  const roomId = document_LOBBY_ROOM_ID.innerText.trim().split(/\s+/).pop();
  const roomRef = db.ref("games/Word_Imposter/rooms/room_" + roomId);

  roomRef.update({
    state: "playing",
  });
}


// join the started game
function startGame(room) {

  const roomRef = db.ref("games/Word_Imposter/rooms/room_" + room.roomID);


  const players = Object.keys(room.players);

  const imposter = players[Math.floor(Math.random() * players.length)];
  room.game.imposter = imposter;

  const word = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
  room.game.word = word;


  roomRef.update({
    state: "playing",
    playerCount: players.length,
    alivePlayers: players.length,
    game: {
      round: 1,
      impster: imposter,
      word: word
    }
  });

  console.log(room);

}


// Player Role logic
// function startGame(room){
// 
//   const game = room.game;
// 
//   if(currentPlayer === game.imposter){
//       showRole("You are the IMPOSTER");
//   }else{
//       showRole("Word: " + game.word);
//   }
// 
// }


const WORD_LIST = [

  /* Nature */
  [
    ["river", "waterfall", "ocean", "lagoon", "reef"],
    ["valley", "canyon", "cliff", "glacier", "desert", "dune", "swamp", "cave", "forest", "jungle", "savanna", "meadow", "island"],
    ["sunrise", "sunset", "rainbow", "storm", "thunder", "shadow"],
    ["planet", "galaxy", "satellite"]
  ],

  /* Places & Structures */
  [
    ["building", "library", "castle", "pyramid"],
    ["bridge", "harbor", "ladder"],
    ["mirror", "candle", "lantern", "compass", "map"]
  ],

  /* Professions */
  [
    ["artist", "writer", "singer", "photographer"],
    ["scientist", "engineer", "architect", "mechanic", "inventor"],
    ["teacher", "doctor", "chef", "driver"],
    ["explorer", "farmer", "gardener", "fisherman", "pilot", "detective", "tailor"]
  ],

  /* Actions */
  [
    ["running", "climbing", "jumping", "swimming", "dancing", "traveling", "exploring"],
    ["writing", "drawing", "painting", "cooking", "building"],
    ["thinking", "learning", "solving", "searching", "discovering"],
    ["whispering", "laughing", "singing"]
  ],

  /* Feelings */
  [
    ["joy", "hope", "trust", "gratitude", "confidence", "excitement", "calmness"],
    ["fear", "anger", "envy", "doubt", "loneliness"],
    ["courage", "patience", "ambition", "pride", "determination"],
    ["curiosity", "surprise", "wonder", "nostalgia"]
  ],

  /* Instruments & Tools */
  [
    ["guitar", "violin"],
    ["piano"],
    ["flute", "trumpet"],
    ["drum"],
    ["camera", "microscope", "binoculars", "telescope"],
    ["notebook", "calculator", "keyboard", "typewriter"],
    ["backpack", "helmet", "umbrella", "watch", "speaker", "projector"]
  ],

  /* Vehicles */
  [
    ["rocket", "spaceship", "airplane", "helicopter", "balloon", "parachute"],
    ["submarine", "canoe", "yacht"],
    ["train", "truck", "tractor", "bicycle", "motorcycle", "scooter", "skateboard", "sled"],
    ["ambulance", "firetruck"]
  ],

  /* Games & Concepts */
  [
    ["puzzle", "chess", "maze"],
    ["treasure", "adventure", "mission"],
    ["challenge", "strategy", "victory", "defeat"],
    ["alliance", "betrayal"],
    ["mystery", "secret", "legend", "myth"],
    ["signal", "code", "cipher"]
  ],

  /* Animals */
  [
    ["tiger", "wolf", "cheetah", "elephant", "gorilla", "panda", "kangaroo", "camel", "antelope", "squirrel", "hedgehog", "beaver"],
    ["dolphin", "octopus"],
    ["owl", "falcon", "parrot", "peacock"],
    ["butterfly", "penguin"]
  ]

];