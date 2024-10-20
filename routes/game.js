const express = require('express');
const router = express.Router();
const {games, Game} = require('../classes/game');
const { Player, users } = require('../classes/player');


// Creates a new game
router.post('/game', async (req, res) => {
    const {passcode} = req.body;
    const userId = req.session.userId;
    const newGame = new Game(passcode);
    req.session.gameId = newGame.gameId;

    // Retrieve the player that created the game
    const player = users.get(userId);
    console.log("BIG PENIS");
    newGame.addPlayer(player);
    console.log("Game: ", newGame);

    // Add game into the games map
    games.set(newGame.passcode, newGame);
    try {
        res.status(201).json(newGame);
    } catch (err) {
        console.log('failed');
        res.status(500).json({ error: 'Fucked up' });
    }
});


// Joins a game
router.post('/game/join', async (req, res) => {
    const { passcode } = req.body;
    const userId = req.session.userId;
    const game = games[passcode];
    const player = users.get(userId);
    if (game && player) {
        game.addPlayer(player);
        req.session.gameId = game.gameId;
        res.json({Message: 'User added to game', game: game});
    } else {
        res.status(404).json({message: 'Game or user not found'});
    }
});

// Gets a game's data by the id
router.get('/game/:id', async (req, res) => {
    const gameId = req.params.id;
    const game = games.get(gameId);
    if (game) {
        res.status(200).json(game);
    } else {
        res.status(404).json({ message: 'Game not found' });
    }
})

module.exports = router;


