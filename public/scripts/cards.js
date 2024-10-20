const socket = io();
const passcode = sessionStorage.getItem('passcode');
const id = sessionStorage.getItem('userId');

function startGame() {
    socket.emit('startGame', (passcode));
}

function shuffleCards(cards) {
    tempCards = Array.from(cards);
    for (let i = tempCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (1 + i));
        [tempCards[i], tempCards[j]] = [tempCards[j], tempCards[i]];
    }
    return tempCards;
}

function distributeCards(cards, players) {
    tempPlayers = Array.from(players);
    for (let i = 0; i < (cards.length - 3); i++) {
        for (let j = 0; j < players.length; j++) {
            players[j].card = cards.pop();
        }
    }
    console.log("Cards: ", cards);
}

