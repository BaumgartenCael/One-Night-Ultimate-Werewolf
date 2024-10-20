const express = require('express');
const router = express.Router();
const { Player, users } = require('../classes/player');


// Creates a new user
router.post('/user', async (req, res) => {
    const {name, id} = req.body;
    const newPlayer = new Player(name);
    newPlayer.id = id;
    console.log("New user id: ", id);
    users.set(newPlayer.id, newPlayer);
    res.status(201).json({ message: 'User created', name });
    console.log("USers: ", users);
    });

// Gets a user by id
router.get('/user/:id', async (req, res) => {
    const userId = req.params.id;
    res.status(200).json({ message: 'User fetched', userID });
});
module.exports = router;


