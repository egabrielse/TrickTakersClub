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
## Overview
<p align="center" width="100%" vertical>
  <img
    label="Architecture Overview"
    src="https://github.com/user-attachments/assets/65c8f238-824a-4761-8b35-1f9e3355d980"
    width="66%"
    align="center"
  />
</p>

- **Frontend Service**
  - React app with Vite as the build tool.
  - Deployed on <a href="https://cloud.google.com/run?hl=en"><img
    src="https://github.com/user-attachments/assets/456e4df7-bd09-4f4a-b5a7-b01edafc27ee"
    height="16px"
  /> Google Cloud Run</a> (serverless container hosting).
- **Backend Services**
  - The backend is split into two key services: core and play.
  - Play service is responsible for all gameplay and session logic and operations.
  - Core service is responsible for all other operations, which for now is primarily database operations.
- **Databases**
  - <a href="https://firebase.google.com/products/firestore"><img
    src="https://github.com/user-attachments/assets/d32bdcd3-ac05-4d9a-9905-11e265217001"
    height="16px"
  /> Google Firestore</a> is used for long-term data storage, such as user settings.
  - Redis is used for short-term storage of game session data. Redis PubSub channels are used by the Play service for communication between players.
- **Authentication**
  - User accounts are managed using <a href="https://firebase.google.com/products/auth"><img
    src="https://github.com/user-attachments/assets/9439904d-1102-4d36-b42a-b4a7b8499836"
    height="16px"
  /> Firebase Authentication</a>.
  - Frontend services will use this for user sign up/in.
  - Core and Play services will use this for authenticating requests. 

## Play Service Architecture
The Play service is responsible for all game session logic. Each game session is backed by a worker (the Session Worker) on the Play service. Session Workers manage session state and gameplay. Additionally, each connected player is backed by a worker (the Client Worker), which is responsible for establishing a connection with the correct Session Worker, forwarding messages from the player/client to the Session Worker and vis versa. Players connect to their respective Client Workers via websockets. Client and Session workers communicate via Redis PubSub channels. There is a many-to-one relationship between Client Workers and Session Workers. 

<p align="center" width="100%" vertical>
  <img
    label="Play Service Architecture"
    src="https://github.com/user-attachments/assets/77637e03-cbdf-48da-8b34-47fd3e86ff03"
    align="center"
  />
</p>

### Data Flow Loop
Below is an example of how an action in the game (playing a card) is communicated to the Session Worker and the result is communitcated back to players.

<p align="center" width="100%" vertical>
  <img
    label="Data Flow Loop"
    src="https://github.com/user-attachments/assets/f01d3598-62ad-4c46-80c4-986902f2c0ca"
    align="center"
  />
</p>

Another example of this occurs when a player attempts to join a session: The Client Worker sends a "enter" message to the Session Worker. If there is space at the table, the Session Worker will return a "welcome" message containing the current state of the session, and will broadcast to all players a "entered" message so that they are notified of the new player's presence.

# FAQ
1. Why is the backend split into two services?
This is so they can scale independently and have different timeouts. Play service will have a relatively small number of long-standing websocket connections and long-running workers, whereas the Core service will handle many quick requests. 
2. If Session and Client Workers are all on the same service, why is Redis PubSub needed?
While both of these types of workers will be running on the same service, they may be running on different instances of the service. 
