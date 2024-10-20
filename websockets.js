const {games, Game} = require('./classes/game');
const {users, Player} = require('./classes/player');
const {cards, Card} = require('./classes/card');
const sockets = {};

module.exports = function(io) {
    io.on('connection', (socket) => {
      //  console.log("Connected!");

        // Associates userID with socketID
        socket.on('register', (id) => {
           // console.log("Official socket id: ", socket.id);
            sockets[id] = socket.id;
            //console.log('registered!');
        })

        // Creates a game, adds the host, and creates a server room with the passcode
        // as the key
        socket.on('createGame', (data) => {
            const passcode = data.passcode;
            const newGame = new Game(passcode);
            console.log("Players before: ", newGame.players, newGame.players instanceof Set);
            const host = users.get(data.id);
            newGame.addPlayer(host);
            console.log("Players after: ", newGame.players, newGame.players instanceof Set);
            games.set(passcode, newGame)
            console.log("games: ", games);
            socket.join(passcode);     
        });

        // Adds a player to the game and to the socket room
        socket.on('joinGame', (data) => {
            const passcode = data.passcode;
            const player = users.get(data.id);
            const game = games.get(passcode);
            if (game && player) {
                game.addPlayer(player);
                socket.join(passcode);
                console.log("Joined the game with this passcode successfully: ", passcode);
                socket.emit('gameJoined', (passcode));
            } else {
                socket.emit("noGame");
            }
        });

        // Triggers whenever a player joins to update the player table
        socket.on('enterLobby', (data) => {
            console.log("Received enterLobby serverside");
            const passcode = data.passcode
            const game = games.get(passcode);
            io.to(passcode).emit('populateLobby', Array.from(game.players));
        })

        socket.on('getCardData', (passcode) => {
           // console.log("Sending cards to the client: ", Object.values(cards));
            const tempCards = Object.values(cards);
           // console.log("Tempcards: ", tempCards);
            io.to(passcode).emit('populateCards', tempCards);
        })

        socket.on('toggleCard', (data) => {
            const passcode = data.passcode;
            console.log("data: ", data);
            const card = cards[data.cardID];
            card.toggle();
            //console.log(" BUUBUBUBU Card: ", card);
            console.log("emitting cardToggled", card);
            io.to(passcode).emit('cardToggled', card);
        })

        // Called each time the user is redirected to a new page
        socket.on('rejoinRoom', (data, callback) => {
            console.log("REJOINING user ID with socket ID: ", data.id, socket.id);
            socket.join(data.passcode);
            sockets[data.id] = socket.id;
            if (callback) callback({success: true});
        });

        // Starts the game by distributing cards, defining action order, and directing players to 
        // their nighttime screen
        socket.on('startGame', (passcode) => {
            const game = games.get(passcode);

            // Convert players and cards structs to arrays for operations
            const cardsArray = Object.values(cards);
            const active = (card) => card.active;
            const inGameCards = cardsArray.filter(active);
            const inGamePlayers = Array.from(game.players);

            // Check that there are exactly three more cards than players to populate the middle and that
            // there are at least two players
            if (inGameCards.length === inGamePlayers.length + 3 && inGamePlayers.length> 1) {
                game.cards = inGameCards; // Set this game's cards to the ones marked as active
                game.state.middle = distributeCards(shuffleCards(inGameCards), inGamePlayers); // Shuffle, distribute, and set middle to remaining cards

                // Create a new map to map card orderIndexes to players
                const actionOrder = new Map();
                const playersArray = Array.from(game.players);
                const filteredPlayers = playersArray.filter(player => player.card.orderIndex != null);
                filteredPlayers.forEach(player => {
                    actionOrder.set(player.card.orderIndex, player);
                });

                // Create a new array of each orderIndex. We will iterate through this array and pass the indexes into the map
                // to determine which player should be performing their action
                const indexes = (Array.from(actionOrder.keys())).sort();
                game.indexes = indexes;
                game.actionOrder = actionOrder;
                io.to(passcode).emit('gameStarted', game);

                // Not enough players
            } else if (game.players.length <= 1) {
                console.log("Not enough players");
                io.to(passcode).emit('notEnoughPlayers');
                
                // Not enough/too many cards
            } else {
                console.log("Not enough cards")
                io.to(passcode).emit('wrongCards');
            }
        })
        socket.on('displayCard', (id) => {
            const player = users.get(id);
            const playerCard = player.card;
            io.to(id).emit('cardRetrieved', (playerCard));
        })
        
        socket.on('performActions', (passcode) => {
            const game = games.get(passcode);
            if (game.indexes.length === 0) {
                console.log("NIGHT OVER!");
                io.to(passcode).emit('nightOver');
                return;
            }
            //console.log("Game indexes: ", game.indexes)
            const index = game.indexes.shift();
            //console.log("Index: ", index);
            const indexedPlayer = game.actionOrder.get(index);
            // console.log("IndexedPlayers: ", indexedPlayer);
            // console.log("Id we are sending to: ", indexedPlayer.name, sockets[indexedPlayer.id]);
            io.to(sockets[indexedPlayer.id]).emit('takeAction', indexedPlayer);
        })

        socket.on('checkWerewolf', (data) => {
            console.log('received checkWerewolf from the client');
            const game = games.get(data.passcode);
            game.players.forEach(player => {
                if (player.card.name === 'Werewolf' && player.id != data.id) {
                    console.log("Multiple werewolves");
                    io.to(sockets[data.id]).emit('showWerewolves', player);
                    return;
                }
            })
            console.log("Found no werewolves");
            console.log("Middle on the server ", game.state.middle);
            io.to(sockets[data.id]).emit('noWerewolves', game.state.middle);
        })

        socket.on('robberAction', (data, callback) => {
            const game = games.get(data.passcode);
            console.log("Players before:  ", game.players);
            const robber = users.get(data.robberId);
            const robbee = users.get(data.robbeeId);
            let holder = robber.card;
            robber.card = robbee.card;
            robbee.card = holder;
            console.log("Players After: ", game.players);
            if (callback) callback({success: true});
        })

        socket.on('troublemakerAction', (passcode, player1ID, player2ID) => {
            const game = games.get(passcode);
            console.log("Players before troublemaking: ", game.players);
            const player1 = users.get(player1ID);
            console.log("Player1: ", player1);
            const player2 = users.get(player2ID);
            console.log("Player 1 before: ", player1.card);
            console.log("Player 2 before: ", player2.card);
            const holder = player1.card;
            player1.card = player2.card;
            player2.card = holder;
            console.log("Player 1 after: ", player1.card);
            console.log("Player 2 after: ", player2.card);
        })

        socket.on('drunkAction', (passcode, id, cardID) => {
            // console.log("WTF passcode: ", passcode);
            // console.log("WTF id: ", id);
            const game = games.get(passcode);
            // console.log("Game at the start", game);
            const player = users.get(id);
            // console.log("Cards: ", game.cards);
            // console.log("Card.id: ", cardID);
            console.log("Card id: ", cardID);
            const newCard = cards[cardID];
            console.log("New card: ", newCard);
            // console.log("Player before Drunk: ", player);
            console.log("Middle before drunk: ", game.state.middle);
            const middleIndex = game.state.middle.indexOf(newCard);
            console.log("middleIndex: ", middleIndex);
            game.state.middle[middleIndex] = player.card;
            player.card = newCard;
            console.log("Player after drunk: ", player);
            console.log("Middle after drunk: ", game.state.middle);
        })
        socket.on('requestCard', (data) => {
            const player = users.get(data.id);
            const card = player.card;
            console.log("Emitting the received card!");
            io.to(sockets[data.id]).emit('receivedCard', (card));
        })
        socket.on('requestCardData', (data) => {
            const game = games.get(data.passcode);
            // console.log("Game: ", game)
            let otherPlayers = Array.from(game.players)
            // console.log("Other players pre filter: ", otherPlayers);
            otherPlayers = otherPlayers.filter(player => player.id !== data.id);
            // console.log("Other players post filter: ", otherPlayers);
            const cardData = {players: otherPlayers, middle: game.state.middle};
            io.to(sockets[data.id]).emit('cardData', (cardData));
        })

        socket.on('time', (passcode) => {
            const game = games.get(passcode);
            // console.log("received the time thing from the client and here's the game: ", game);
            // console.log("And here's the timer just to be safe: ", game.state.timer);
            io.to(passcode).emit('timeReceived', (game.state.timer));
        })

        socket.on('vote',(playerID, data) => {
            const game = games.get(data.passcode);
            const votee = users.get(playerID);
            console.log("votee: ", votee);
            votee.votes += 1;
            game.state.votes += 1;
            console.log("voteCounter: ", game.state.votes);
            console.log("PLayers length: ", game.players.size);
            if (game.state.votes === game.players.size) {
                const voteCounts = {};
                const players = Array.from(game.players);
                players.forEach(player => {
                    voteCounts[player.name] = player.votes;
                });
                // players.reduce((prev, curr) => {
                //     return (curr.votes > prev.votes) ? curr: previous;
                // })
                console.log("Emitting displayResults");
                console.log("Players: ", players);
                console.log("votecounter: ", voteCounts);
                io.to(data.passcode).emit('displayResults', voteCounts, players);
            }
        })

        socket.on('close', () => {
            console.log('WebSocket connection closed');
            });
    });
}

function shuffleCards(cards) {
    const tempCards = cards;
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (1 + i));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    return tempCards;
}

function distributeCards(cards, players) {
    for (let i = 0; i < (cards.length - 3); i++) {
        for (let j = 0; j < players.length; j++) {
            const card = cards.pop();
            players[j].card = card;
            players[j].tempCard = card;
        }
    }
    return cards;
}
