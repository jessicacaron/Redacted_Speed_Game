# Speed Game
![SpeedGameDemo](https://github.com/jessicacaron/Redacted_Speed_Game/assets/77312057/3b300ede-aed7-4e75-a852-936615ae405f)


## Project Overview

The card game speed created using the MERN stack with authentication and multi-user chat functionality.


## Technologies:
- MERN
- HTML
- CSS
- Javascript
- MongoDB
- Nodejs
      
## Project Description:

The login system passwords are hashed with salt on the server end.

A functioning main chat room, allowing one user to create a room, and another to join a room.

The gameplay is as follows:
Upon a second player joining a game, both players push a button to signal they are ready to start. Only when both players have signaled will the game supply a countdown timer of 5 seconds. After those five seconds, deal cards into appropriate piles and seen by appropriate players. The room's single deck of cards is managed by the server, and the server sends info about each pile to each player. If a player leaves, both players are sent back to the main lobby.

## Time to complete:

 6 Weeks

## Challenges:
For this project, we incorporated user authentication including input validation.  We wanted to make sure password information stayed private and wasn't sent through the browser as raw data.  Including a salt and hashing with sha-256 helped us accomplish this.  
      
Another challenge with this project was multi-user chat interface.  We used sockets to send and receive data between all users.  Sockets were used to transfer game data to users as well.
