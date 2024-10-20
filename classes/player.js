class Player {
    constructor (name) {
        this.name = name;
        this.id;
        this.card;
        this.tempCard;
        this.votes = 0;
    }
    vote(player) {
        player.votes += 1;
    }
}
// Map used to store all users of the application. A user is one using the
// application, a player is a specific user within a game
const users = new Map();
module.exports = {Player, users};