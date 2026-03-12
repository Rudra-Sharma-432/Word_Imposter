// game.js
// ─────────────────────────────────────────────────────────────────
// Game back-end: all Firebase room/game operations live here.
// UI helpers and DOM references stay in main.js.
// Word data lives in words.js.
// ─────────────────────────────────────────────────────────────────

// Tracks which room and player seat belong to this browser tab
let currentRoom   = null;
let currentPlayer = null;


// ═══════════════════════════════════════════════════════
//  ROOM MANAGEMENT
// ═══════════════════════════════════════════════════════

/** Creates a new room in Firebase and immediately joins it as host. */
function createRoom(playerName) {

  const roomId   = Math.floor(Math.random() * 10000);
  const roomName = "room_" + roomId;
  const playerID = UID;

  const roomRef = db.ref("games/Word_Imposter/rooms/" + roomName);

  roomRef.set({
    host:     playerID,
    roomID:   roomId,
    password: document.getElementById("room-password-input").value,
    state:    "lobby",
    players: {
      [playerID]: {
        name:   playerName,
        score:  0,
        status: "alive"
      }
    },
    playerCount:  1,
    alivePlayers: 1,
    settings: {
      eachPlayerDiscussionTime: eachPlayerDiscussionTime,
      maxPlayers:               maxPlayers,
      maxRounds:                totalRounds
    },
    game: {
      round: 1
    }
  });

  // After writing to Firebase, join the room as host
  joinRoom(roomName, playerID);
}


/** Adds the current player to an existing room and starts listening for updates. */
function joinRoom(roomName, playerId) {

  // If no playerId was supplied this is a regular (non-host) join
  if (!playerId) {
    playerId = UID;
    const playerRef = db.ref("games/Word_Imposter/rooms/" + roomName + "/players/" + playerId);
    playerRef.set({ name: username, score: 0 });
  }

  // Remove the player from the database automatically if they disconnect
  const playerRef = db.ref("games/Word_Imposter/rooms/" + roomName + "/players/" + playerId);
  playerRef.onDisconnect().remove();

  currentRoom   = roomName;
  currentPlayer = playerId;

  listenToRoom(roomName);
  goToPanel("lobby");
}


/** Removes the current player from the room and navigates back to the join screen. */
function leaveRoom() {
  gameJoined  = false;
  gameStarted = false;

  if (currentRoom && currentPlayer) {
    // Delete this player's node from the database
    const playerRef = db.ref("games/Word_Imposter/rooms/" + currentRoom + "/players/" + currentPlayer);
    playerRef.remove();

    // Detach the Firebase listener so it stops firing after leaving
    db.ref("games/Word_Imposter/rooms/" + currentRoom).off();

    currentRoom   = null;
    currentPlayer = null;
  }

  goToPanel("join-room");
}


// ═══════════════════════════════════════════════════════
//  REAL-TIME ROOM LISTENER
// ═══════════════════════════════════════════════════════

/** Attaches a Firebase "value" listener to the room; handles all state transitions. */
function listenToRoom(roomName) {
  db.ref("games/Word_Imposter/rooms/" + roomName)
    .on("value", snapshot => {

      const room = snapshot.val();

      // ── Auto-delete empty rooms ──
      if (!room || !room.players || Object.keys(room.players).length === 0) {
        db.ref("games/Word_Imposter/rooms/" + roomName).remove();
        return;
      }

      // ── Game was restarted: send everyone back to lobby ──
      if (room.state === "lobby" && gameStarted) {
        gameStarted = false;
        gameJoined  = false;
        updatePlayersUI(room);
        goToPanel("lobby");
        return;
      }

      // ── Always keep the lobby player list up to date ──
      updatePlayersUI(room);

      // ── Only the host writes game data to Firebase (prevents duplicate writes) ──
      if (room.state === "playing" && currentPlayer === room.host && room.game && !room.game.word) {
        startGame(room);
      }

      // ── Every player joins the game once the word has been set by the host ──
      if (room.state === "playing" && room.game.word && !gameJoined) {
        gameJoined = true;
        joinStartedGame(room);
      }

    });
}


// ═══════════════════════════════════════════════════════
//  GAME START  (host only)
// ═══════════════════════════════════════════════════════

/**
 * Called by the host when state changes to "playing" and no word exists yet.
 * Picks a random imposter, word, and discussion order, then writes them to Firebase.
 * All players read these values through listenToRoom().
 */
function startGame(room) {

  const roomRef     = db.ref("games/Word_Imposter/rooms/" + currentRoom);
  const players     = Object.keys(room.players);
  const playerCount = players.length;

  // Pick a random imposter from the player list
  const imposter = players[Math.floor(Math.random() * players.length)];

  // Pick a random word: category → subCategory → word  (using words.js)
  const category    = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
  const subCategory = category[Math.floor(Math.random() * category.length)];
  const word        = subCategory[Math.floor(Math.random() * subCategory.length)];

  // Shuffle player order for the discussion phase
  const playerOrder = players.sort(() => Math.random() - 0.5);

  roomRef.update({
    state:        "playing",
    playerCount:  playerCount,
    alivePlayers: playerCount,
    game: {
      round:               1,
      imposter:            imposter,
      word:                word,
      currentSpeakerIndex: 0,
      discussionOrder:     playerOrder,
    }
  });
}


// ═══════════════════════════════════════════════════════
//  GAME JOIN  (all players)
// ═══════════════════════════════════════════════════════

/**
 * Runs on every client once startGame() has written word/imposter to Firebase.
 * Sets up the meeting UI and shows each player their role for 3 seconds.
 */
async function joinStartedGame(room) {

  gameStarted = true;
  const game        = room.game;
  const playerCount = room.players ? Object.keys(room.players).length : 0;

  goToPanel("meeting");

  // Build the meeting and voting player cards
  createDivs(document_MEETING_TABLET, playerCount, room);
  modifyMeetingTablet(playerCount);
  createDivs(document_VOTNG_TABLET, playerCount, room);
  document.getElementById('meeting-tablet-container').classList.remove("hidden");

  // ── Role reveal: show word (or "IMPOSTER") for 3 seconds ──
  document_SHOW_ROLE_DIV.style.backgroundColor = "var(--card-bg)";
  document_SHOW_ROLE_DIV.style.display         = "flex";

  if (currentPlayer === game.imposter) {
    document_SHOW_ROLE_DIV.innerHTML = "<h1>You are the IMPOSTER</h1>";
    console.log("You are the IMPOSTER");
  } else {
    document_SHOW_ROLE_DIV.innerHTML = `<h1>Word: ${game.word}</h1>`;
    console.log("Word:", game.word);
  }

  await wait(3000);
  document_SHOW_ROLE_DIV.innerHTML     = "";
  document_SHOW_ROLE_DIV.style.display = "none";

  startMeeting(room);
}


// ═══════════════════════════════════════════════════════
//  MEETING PHASE
// ═══════════════════════════════════════════════════════

/**
 * Loops through all rounds and all players, giving each their discussion turn.
 * After all rounds complete, moves everyone to the voting panel.
 */
async function startMeeting(room) {

  const playerCount = room.players ? Object.keys(room.players).length : 0;

  // Outer loop: rounds
  for (let j = 0; j < room.settings.maxRounds; j++) {
    // Inner loop: each player's turn within the round
    for (let i = 0; i < playerCount; i++) {
      playerTurn(i, room, j + 1);
      // Wait for the player's discussion time + 2s buffer before moving to next player
      await wait((room.settings.eachPlayerDiscussionTime + 2) * 1000);
    }

    // Reset tablet display for the next round
    createDivs(document_MEETING_TABLET, playerCount, room);
    modifyMeetingTablet(playerCount);
  }

  // All rounds done — hide meeting tablet and proceed to voting
  document.getElementById('meeting-tablet-container').classList.add("hidden");
  goToPanel("voting");

  showPlayAgainUI(room);
}