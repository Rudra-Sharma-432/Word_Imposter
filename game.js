// this is like the back end of the game.

let currentRoom = null;
let currentPlayer = null;

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
    var playerName = "Player";

    const playerRef = db.ref("games/Word_Imposter/rooms/" + roomName + "/players/" + playerId);

    playerRef.set({
      name: playerName,
      score: 0
    });

    // AUTO REMOVE PLAYER WHEN THEY LEAVE
    playerRef.onDisconnect().remove();
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

      // ONLY HOST creates the game
      if (room.state === "playing" && currentPlayer === room.host && room.game && !room.game.word) {
        startGame(room);
      }

      // everyone joins the started game
      if (room.state === "playing" && room.game.word) {
        joinStartedGame(room);
      }

    });

}



// host start the game and join it
function startGame(room) {

  const roomRef = db.ref("games/Word_Imposter/rooms/" + currentRoom);

  const players = Object.keys(room.players);
  const playerCount = room.players ? Object.keys(room.players).length : 0;

  const imposter = players[Math.floor(Math.random() * players.length)];

  const category = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
  const subCategory = category[Math.floor(Math.random() * category.length)];
  const word = subCategory[Math.floor(Math.random() * subCategory.length)];


  // arrange the players in random order for the meeting discussion and store it in the database to loop through it in the startMeeting function
  const playerOrder = players.sort(() => Math.random() - 0.5);


  roomRef.update({
    state: "playing",
    playerCount: playerCount,
    alivePlayers: playerCount,

    // TODO: arrange the order of meeting randomly in the room.game.playerOrder and loop through it in startMeeting function
    game: {
      round: 1,
      imposter: imposter,
      word: word,
      currentSpeakerIndex: 0,
      discussionOrder: playerOrder,
    }

  });





  console.log(room);

}


// other players join the game
async function joinStartedGame(room) {

  console.log("Game started");

  const game = room.game;

  goToPanel("meeting");

  const playerCount = room.players ? Object.keys(room.players).length : 0;


  // create the meeting and voting tablets
  createDivs(document_MEETING_TABLET, playerCount);
  modifyMeetingTablet(playerCount);
  createDivs(document_VOTNG_TABLET, playerCount);
  document.getElementById('meeting-tablet-container').classList.remove("hidden");

  // show the role for 3 seconds
  document_SHOW_ROLE_DIV.style.backgroundColor = "var(--card-bg)";
  document_SHOW_ROLE_DIV.style.display = "flex";
  if (currentPlayer === game.imposter) {
    document_SHOW_ROLE_DIV.innerHTML = "<h1>You are the IMPOSTER</h1>";
    console.log("You are the IMPOSTER");
  } else {
    document_SHOW_ROLE_DIV.innerHTML = `<h1>Word: ${game.word}</h1>`;
    console.log("Word:", game.word);
  }

  await wait(3000);
  document_SHOW_ROLE_DIV.innerHTML = "";
  document_SHOW_ROLE_DIV.style.display = "none";


  startMeeting(room);
}


async function startMeeting(room) {
  console.log("Meeting started");

  const playerCount = room.players ? Object.keys(room.players).length : 0;
  console.log(room.game.discussionOrder[0]);
  console.log(playerCount);
  for (let i = 0; i < playerCount; i++) {
    console.log(i)
    playerTurn(i, room);

    await wait()
  }

  console.log("Meeting ended");

}




const WORD_LIST = [

  /* Nature */
  [
    ["river", "waterfall", "ocean", "reef"],
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