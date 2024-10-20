const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    gameId: String,
    users: [String],
    state: Object,
    passcode: String,
});
const Game = mongoose.model('Game', gameSchema);
module.exports = Game;