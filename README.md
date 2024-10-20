# One-Night-Ultimate-Werewolf
This is an in-progress broswer based implementation of the board game One Night Ultimate Werewolf. The program utilizes Javascript, NodeJS, ExpressJS, Socket.io, HTML, and CSS. I use HTTP requests to create users and run the server, and I use websockets for the gameplay. This is to ensure each players concurrently see changes to the game state as they occur.
Some aspects of the game are still under development, including the voting phase and many UI elements.
To play the game, one player must host and the others join. Add the requisite number of cards and begin the night. During the night phase, each player makes an action depending on their role. After the night phase, there is a set time for discussion. When that time ends, all players vote for who they believe the werewolf is.
To run the program, run the server.js file and go to localhost:3000 in the browser. 
