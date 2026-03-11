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

  for(const roomId in rooms){

    const room = rooms[roomId];
    const playerCount = Object.keys(room.players).length;
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


const document_LOBBY_ROOM_ID = document.getElementById("lobby-room-id");
const document_LOBBY_HOST = document.getElementById("lobby-host");
const document_LOBBY_PLAYER_COUNT = document.getElementById("lobby-player-count");
const document_LOBBY_PLAYER_LIST = document.getElementById("lobby-player-list");
const document_LOBBY_START_BUTTON = document.getElementById("lobby-start-button");

function updatePlayersUI(room){
  console.log("update player ui");
  console.log(room);

  document_LOBBY_ROOM_ID.innerText = "room id : " + room.roomID;
  document_LOBBY_HOST.innerText = "host : " + room.players[room.host].name;
  document_LOBBY_PLAYER_COUNT.innerText = "player count : " + Object.keys(room.players).length +"/"+ room.settings.maxPlayers;

  
  if (currentPlayer === room.host){
    document_LOBBY_START_BUTTON.classList.remove("hidden");
  } else {
    document_LOBBY_START_BUTTON.classList.add("hidden");
  }

  let playerListHTML = "";
  for(const playerId in room.players){
    const player = room.players[playerId];
    playerListHTML += `<p>${player.name}</p>`;
  }
  document_LOBBY_PLAYER_LIST.innerHTML = playerListHTML;

}