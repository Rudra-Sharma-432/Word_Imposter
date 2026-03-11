const PANEL_DIVS = document.querySelectorAll('div.panel');



const firebaseConfig = {
  apiKey: "AIzaSyADn8tGOng9AcBI3s-y-X49i6eoLetyPsE",
  authDomain: "rudra-games-432.firebaseapp.com",
  databaseURL: "https://rudra-games-432-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "rudra-games-432",
  storageBucket: "rudra-games-432.firebasestorage.app",
  messagingSenderId: "94889134612",
  appId: "1:94889134612:web:e72655db86827f1e253501",
  measurementId: "G-1XP9W5D6XF"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Join room
// db.ref("games/Word_Imposter/rooms/" + roomId + "/players/" + playerId)

// Listen for updates
// db.ref("games/Word_Imposter/rooms/" + roomId)
//   .on("value", updateGameUI);

// Auto removal when a player leaves
// db.ref("games/Word_Imposter/rooms/" + roomId + "/players/" + playerId)
//   .onDisconnect()
//   .remove();


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
      const maxPlayers = room.settings.maxPlayers;

      const div = document.createElement("div");
      div.className = "room-joining-div";

      div.innerHTML = `
      <p>${roomId}</p>
      <p>Players: ${playerCount}/${maxPlayers}</p>
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
  console.log("update player ui");
  console.log(room);

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
  document_LOBBY_PANEL.innerHTML += "<h2>Starting Game in 3...</h2>";
  await wait(1000);
  document_LOBBY_PANEL.innerHTML = document_LOBBY_PANEL.innerHTML.replace(/3\.\.\./, "2...");
  await wait(1000);
  document_LOBBY_PANEL.innerHTML = document_LOBBY_PANEL.innerHTML.replace(/2\.\.\./, "1...");
  await wait(1000);
  document_LOBBY_PANEL.innerHTML = document_LOBBY_PANEL.innerHTML.replace(/1\.\.\./, "...");

  roomRef.update({
    state: "playing",
  });


}


// wait function
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}




const document_VOATING_TABLET = document.getElementById("voating-tablet");
function createDivs(parentDIV, num) {
  parentDIV.innerHTML = "";

  // 2. Loop 'num' times to create the child divs
  for (let i = 0; i < num; i++) {
    // 3. Create a new div element for each iteration
    const newDiv = document.createElement("div");

    // 4. Customize the new div (optional)
    newDiv.textContent = `Div number ${i + 1}`; // Add some text content
    newDiv.style.margin = "0px";
    newDiv.style.padding = "15px 20px"; // Set padding
    newDiv.style.backgroundColor = "#000"; // Set background color
    newDiv.style.borderRadius = "10px"; // Set border radius
    newDiv.classList.add("child-div"); // Add a CSS class for styling

    // 5. Append the new div to the parent container
    parentDIV.appendChild(newDiv);
  }
}

// Call the function to create
createDivs(document_VOATING_TABLET, 7);