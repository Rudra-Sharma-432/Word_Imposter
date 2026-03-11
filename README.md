# Word Imposter

A multiplayer browser game built using **HTML, CSS, JavaScript** with **Firebase Realtime Database** as the backend.

Players join a room, receive a secret word (except the imposter), and try to identify the imposter through discussion.

---

# Tech Stack

* HTML
* CSS
* JavaScript
* Firebase Realtime Database
* Firebase Hosting (for deployment)

---

# Database Structure

The Word Imposter game stores its data in the following structure:

```
games
   wordImposter
      rooms
         room_4821

            host: "player1"
            state: "lobby"

            settings
               maxPlayers: 8
               rounds: 5

            players
               player1
                  name: "Rudra"
                  score: 0
                  status: "alive"

               player2
                  name: "Aman"
                  score: 0
                  status: "alive"

            game
               word: "river"
               imposter: "player3"
               round: 1

            votes
               player1: "player3"
               player2: "player3"
```

---

# Game States

The room progresses through different states.

```
lobby
playing
discussion
voting
result
```

Clients listen to the room state and update the UI accordingly.

---

# Core Multiplayer Functions

The multiplayer system is built around these core functions:

```
createRoom()
joinRoom()
leaveRoom()
startGame()
assignImposter()
```

---

# Room System

Rooms allow friends to play together.

Example flow:

```
Player creates room
Room code generated
Friends join using code
Players appear in lobby
Host starts the game
```
