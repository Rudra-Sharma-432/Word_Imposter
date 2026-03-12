const PANEL_DIVS = document.querySelectorAll('div.panel');
let gameStarted = false;
let gameJoined = false;

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();


function goToPanel(name) {
  PANEL_DIVS.forEach(function (div) {
    div.classList.add('hidden');
  });

  document.getElementById(`${name}-panel`).classList.remove('hidden');
}


db.ref("games/Word_Imposter/rooms")
  .on("value", snapshot => {

    const rooms = snapshot.val();

    const container = document.getElementById("rooms");
    container.innerHTML = "";

    if (!rooms) return;
    for (const roomId in rooms) {

      const room = rooms[roomId];
      const playerCount = room.players ? Object.keys(room.players).length : 0;
      // const maxPlayers = room.settings.maxPlayers;

      // Get host name from players object using host ID
      const hostId = room.host;
      const hostName = room.players?.[hostId]?.name ?? "Unknown";

      const div = document.createElement("div");
      div.className = "room-joining-div";

      div.innerHTML = `
        <div class="room-info">
          <span class="room-id">${roomId}</span>
          <span class="host-name">${hostName}</span>
        </div>
        <p>${playerCount}/${room.settings.maxPlayers}</p>
      `;

      div.onclick = () => joinRoom(roomId);
      container.appendChild(div);
    }

  });



const document_LOBBY_PANEL = document.getElementById("lobby-panel");
const document_LOBBY_ROOM_ID = document.getElementById("lobby-room-id");
const document_LOBBY_HOST = document.getElementById("lobby-host");
const document_LOBBY_PLAYER_COUNT = document.getElementById("lobby-player-count");
const document_LOBBY_PLAYER_LIST = document.getElementById("lobby-player-list");
const document_LOBBY_START_BUTTON = document.getElementById("lobby-start-button");
const document_SHOW_ROLE_DIV = document.getElementById("show-role");


function updatePlayersUI(room) {
  // console.log("update player ui, the room is :");
  // console.log(room);

  document_LOBBY_ROOM_ID.innerText = "room id : " + room.roomID;
  document_LOBBY_HOST.innerText = "host : " + room.players[room.host].name;
  document_LOBBY_PLAYER_COUNT.innerText = "player count : " + Object.keys(room.players).length + "/" + room.settings.maxPlayers;


  if (currentPlayer === room.host) {
    document_LOBBY_START_BUTTON.classList.remove("hidden");
  } else {
    document_LOBBY_START_BUTTON.classList.add("hidden");
  }

  let playerListHTML = "";
  for (const playerId in room.players) {
    const player = room.players[playerId];
    playerListHTML += `<p>${player.name}</p>`;
  }
  document_LOBBY_PLAYER_LIST.innerHTML = playerListHTML;

}


// Start Gmae by host
async function startGameByHost() {
  const roomId = document_LOBBY_ROOM_ID.innerText.trim().split(/\s+/).pop();
  const roomRef = db.ref("games/Word_Imposter/rooms/room_" + roomId);

  document_LOBBY_START_BUTTON.classList.add("hidden");

  // Use the dedicated countdown element instead of innerHTML +=
  const countdown = document.getElementById("lobby-countdown");
  countdown.innerText = "Starting Game in 3...";
  await wait(1000);
  countdown.innerText = "Starting Game in 2...";
  await wait(1000);
  countdown.innerText = "Starting Game in 1...";
  await wait(1000);
  countdown.innerText = "";  // ← clears itself

  roomRef.update({
    state: "playing",
  });

}


// wait function
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}



const document_MEETING_TABLET = document.getElementById("meeting-tablet");
const document_VOTNG_TABLET = document.getElementById("voting-tablet");

function createDivs(parentDIV, num, room) {
  parentDIV.innerHTML = '';

  // 2. Loop 'num' times to create the child divs
  for (let i = 0; i < num; i++) {
    // 3. Create a new div element for each iteration
    const newDiv = document.createElement("div");

    newDiv.id = `${parentDIV.id}-child-${i + 1}`; // Set a unique ID for the new div
    // 4. Customize the new div (optional)
    newDiv.innerHTML = `<p>${room.players[room.game.discussionOrder[i]].name}</p>`; // Add some text content
    newDiv.style.margin = "0px";
    newDiv.style.padding = "15px 20px"; // Set padding
    newDiv.style.backgroundColor = "#000"; // Set background color
    newDiv.style.borderRadius = "10px"; // Set border radius
    newDiv.classList.add("child-div"); // Add a CSS class for styling

    // 5. Append the new div to the parent container
    parentDIV.appendChild(newDiv);
  }
}

function modifyMeetingTablet(numberOfPlayers) {
  for (let i = 0; i < numberOfPlayers; i++) {
    const div = document.getElementById(`meeting-tablet-child-${i + 1}`);



  }
}

// createDivs(document_MEETING_TABLET, 7);
// modifyMeetingTablet(7);


// when 'i' index player's turn comes
const document_MEETING_ROUND = document.getElementById("meeting-round");
async function playerTurn(i, room, round) {

  document_MEETING_ROUND.innerText = `Round : ${round}/${room.settings.maxRounds}`;

  const div = document.getElementById(`meeting-tablet-child-${i + 1}`);
  div.style.backgroundColor = "var(--accent)";
  div.style.color = "var(--text-secondary)";
  div.style.width = "100%";

  const timer = room.settings.eachPlayerDiscussionTime;

  div.innerHTML = `<p>${room.players[room.game.discussionOrder[i]].name}</p> <p id='player${i + 1}-timer'>${timer} sec</p>`;
  div.style.flexDirection = "row";
  div.style.justifyContent = "space-between";


  for (let j = timer  - 1; j >= 0; j--) {
    await wait(1000);
    document.getElementById(`player${i + 1}-timer`).innerText = `${j} sec`;
  }

}


const document_CURRENT_USERNAME = document.getElementById("current-username");
const document_USERNAME_INPUT = document.getElementById("username-input");
var username = localStorage.getItem("username") ? localStorage.getItem("username") : "Player_" + Math.floor(Math.random() * 100);

document_CURRENT_USERNAME.innerText = "Current Username: " + username;

function setUserName() {
  const tag = document_USERNAME_INPUT.value.trim().replaceAll(" ", "_");
  if (username.length === 0) {
    alert("Username cannot be empty");
    return;
  }

  localStorage.setItem("username", tag);
  username = tag;
  document_CURRENT_USERNAME.innerText = "Current Username: " + username;
  document_USERNAME_INPUT.value = "";

}


var maxPlayers = 6;
var totalRounds = 2;
var eachPlayerDiscussionTime = 20;

document.getElementById('maxPlayer-input').addEventListener('input', function () {
  maxPlayers = parseInt(this.value);
  document.getElementById('maxPlayer-val').textContent = maxPlayers;
});

document.getElementById('totalRounds-input').addEventListener('input', function () {
  totalRounds = parseInt(this.value);
  document.getElementById('totalRounds-val').textContent = totalRounds;
});

document.getElementById('eachPlayerDiscussionTime-input').addEventListener('input', function () {
  eachPlayerDiscussionTime = parseInt(this.value);
  document.getElementById('discussionTime-val').textContent = eachPlayerDiscussionTime;
});



// UID - generated once, stored forever
var UID = localStorage.getItem("uid");
if (!UID) {
  UID = "player_" + Date.now() + "_" + Math.floor(Math.random() * 10000);
  localStorage.setItem("uid", UID);
}


// RESTART GAME
function restartGame() {
  gameJoined = false;
  const roomRef = db.ref("games/Word_Imposter/rooms/" + currentRoom);

  roomRef.update({
    state: "lobby",
    votes: null,
    game: { round: 1 }
  });
}

// UPDATE showPlayAgainUI — called when voting panel is shown
function showPlayAgainUI(room) {
  const btn = document.getElementById("play-again-btn");
  const msg = document.getElementById("play-again-msg");

  if (currentPlayer === room.host) {
    btn.classList.remove("hidden");
    msg.classList.add("hidden");
  } else {
    btn.classList.add("hidden");
    msg.classList.remove("hidden");
  }
}