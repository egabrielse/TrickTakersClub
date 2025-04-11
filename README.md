<p align="center" width="100%" vertical>
  <img
    src="https://github.com/user-attachments/assets/8c6b156b-4543-4e61-86df-aa306584394d"
    height="150"
  />
  <br />
  <b width="100%" >
    The unofficial site for the unofficial card game of Wisconsin
  </b>
  <br />
  <br />
  <b width="100%" >
    Checkout <a href="https://tricktakers.club">Trick Takers Club</a>.
  </b>
</p>

___
<p align="center" width="100%" vertical>
  <img src="https://github.com/egabrielse/TrickTakersClub/actions/workflows/automated-tests.yml/badge.svg" />
  <img src="https://github.com/egabrielse/TrickTakersClub/actions/workflows/google-cloudrun-docker.yml/badge.svg?ref=v0.0.4" />
</p>

___

# 🐑 Sheepshead

Sheepshead <a href="https://en.wikipedia.org/wiki/Trick-taking_game#Point-trick_games"> point-trick-taking </a> card game, descended from the game Bavarian Schafkopf (sheep head in German). Likely a result of its strong German heritage, Wisconsin is home to the most Sheepshead players.
<br/><br/>
Typically played with five player and with a deck of 32 cards: 7-10s, Jacks, Queens, Kings, and Aces. The goal of Sheepshead is to win the most points. Each card has a point value that is different from the card's strength. In total there are 120 points at play, and the player or players that take the most points win the hand. Although Sheepshead has a strong base of players, it's not as widely known as other trick based games like Euchre. This may partially be due to the games unconventional rules, which make the learning curve a little steeper. To learn more about Sheepshead and how to play it, checkout the following links:
<br/>
<p align="center" width="100%" vertical>
<a href="https://tricktakers.club/rules">Trick Takers Club Rules</a> ~ <a href="https://en.wikipedia.org/wiki/Sheepshead_(card_game)">Wikipedia Page</a> ~ <a href="https://www.sheepsheadrules.com/home">Sheepshead Rules!</a> ~ <a href="https://www.sheepshead.org/rules/">Sheepshead.org</a>
</p>

# 🌟 Showcase

<p align="center" width="100%" vertical>
  <video src="https://github.com/user-attachments/assets/dc4b2854-0bb3-4281-a3bf-c18c8a30cee5" width="50%" />
</p>

Chat Popup|Scoreboard
--|--
<video src="https://github.com/user-attachments/assets/2714bb48-6d2b-4d67-8c4d-73fa0ac995a9" width="350" />|<video src="https://github.com/user-attachments/assets/87bab245-335c-4a39-aba7-201a7bdd01bb" width="350" />

___

# 🏗️ Architecture
- **Frontend** is built with React and Vite as the build tool. Uses a mix of custom and <a href="https://mui.com/">Material-UI</a> components.
- **Backend** is written in Golang.
- Both the frontend and backend are deployed on <a href="https://cloud.google.com/run?hl=en"><img
    src="https://github.com/user-attachments/assets/456e4df7-bd09-4f4a-b5a7-b01edafc27ee"
    height="16px"
  /> Google Cloud Run</a> (serverless container hosting). This was chosen as it's cost effective and automatically manages scaling.
- <a href="https://firebase.google.com/products/firestore"><img
    src="https://github.com/user-attachments/assets/d32bdcd3-ac05-4d9a-9905-11e265217001"
    height="16px"
  /> Google Firestore</a> is used for long-term data storage.
- <a href="https://firebase.google.com/products/auth"><img
    src="https://github.com/user-attachments/assets/9439904d-1102-4d36-b42a-b4a7b8499836"
    height="16px"
  /> Firebase Authentication</a> is used user authentication. Frontend will depend on this for sign up/in and the backend will depend on this for authenticating requests. 
- <a href="https://ably.com/"><img
    src="https://github.com/user-attachments/assets/80e6fa05-64fc-4193-bd6d-da89f80a30bb"
    height="16px"
  />Ably</a> is used for realtime communication between players and the server. This was chosen, as opposed a messaging system with websockets, 


## Overview of the Architecture:
<p align="center" width="100%" vertical>
  <img
    label="Architecture Overview"
    src="https://github.com/user-attachments/assets/01268fb7-321a-4714-a9d2-c80c0a4d63da"
    width="66%"
    align="center"
  />
</p>

## Game Creation/Connection Flow
- **Game Manager (GM)**: When a user "hosts" a game, a GM is spun up on the server. The GM is a goroutine that loops, listening for messages from one the players' channels. Messages can include actions in the game like playing a card, as well as things like chat messages and changing the settings. When the GM receives a message/action from a user, it updates the game state accordingly, which is stored in memory, and then sends out update messages to players. If enough time has passed since the last received message, the GM times out and shuts down, thereby ending the game. 
- **Broadcast Channel**: All users are subscribed to the broadcast channel. This is where chat messages are sent, as well as public update messages that all players can see (ex. player A played ace of spades).
- **Private Channels**: Each user has a private channel which acts a direct line between them and the GM. This is used for messages that other players shouldn't see the contents of (ex. cards dealt to the player).

<p align="center" width="100%" vertical>
  <img
    label="Game Connection Flow"
    src="https://github.com/user-attachments/assets/aac761f5-4db0-417c-a44a-c431d6dc88ca"
    width="75%"
    align="center"
  />
</p>


# 🚧 Architecture Redesign
I'm currently reworking the architecture of the app, because a flaw was discovered after deploying to Google Cloud Run.

### The Flaw - Current Architecture is Not Scalable
1. Gameplay is managed by the Game Manager (GM), which is a goroutine that runs on the server.
2. Google Cloud Run is serverless, meaning server management is handled automatically by Google. This includes scaling...
3. When the server receives less incoming HTTP requests, it scales down the number of server instances. Possibly down to zero if there's no traffic.
4. Once a game has started, all communication about the game is handled over Ably, which means the server will stop receiving requests from these players.
5. This means a server instance with an active game session could get terminated if it stops receiving traffic, leaving players in the lurch.

### The Workaround (Temporary)
For now, the minimum and maximum number of server instances is set to be the same. This way no instance get prematurely terminated. However, this isn't a long term solution, because it also means the application cannot be scaled up. It's also less cost effective. Since Trick Takers Club has not yet been launched publicly, the site isn't receiving much traffic other than from testers, so this is not a critical problem, but it needs to be resolved before going public. 

### The Redesign
1. Replace Ably with direct Websocket connections between the server and the user clients. So long as there exists an open WS connection, the instance is considered active and will not be scaled down.
2. While not strictly necessary, the backend server will be split into two microservices to make the application more scalable. The **Play Service** will be where all all Game Managers are spun up. The **Core Service** will continue to handle all other request (primarily database requests).

#### Overview of Architecture after Redesign:
<p align="center" width="100%" vertical>
  <img
    label="Architecture Overview - Redesign"
    src="https://github.com/user-attachments/assets/001874d7-2185-43aa-985a-2a9e2a8b5beb"
    width="66%"
    align="center"
  />
</p>

#### Game Creation/Connection Flow after Redesign:
<p align="center" width="100%" vertical>
  <img
    label="Game Connection Flow - Redesign"
    src="https://github.com/user-attachments/assets/4abfb646-0c0d-4898-b663-25e5d7804892"
    width="75%"
    align="center"
  />
</p>
