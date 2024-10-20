const express = require('express');
const {cards, Card} = require('./card');
class Game {
    constructor (passcode) {
        this.gameId = Math.random().toString(36).substring(2, 15);
        this.players = new Set();
        this.passcode = passcode;
        this.cards;
        this.indexes;
        this.actionOrder;
        this.state = {
            setup: 1,
            middle: [],
            timer: 1,
            votes: 0
        };
    }
    addPlayer(player) {
        this.players.add(player);
    }
    removePlayer(player) {
        this.players.delete(player);
    }
    checkPlayers() {
        return this.players.length;
    }
    checkActiveCards() {
        cardsArray = Array.from(this.cards);
        const active = (card) => card.active;
        const length = cardsArray.filter(active).length;
        return length;
    }
}
const games = new Map();
module.exports = {games, Game};