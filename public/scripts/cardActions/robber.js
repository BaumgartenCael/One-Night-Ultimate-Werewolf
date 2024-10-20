document.addEventListener('DOMContentLoaded', ()=> {
    const socket = io();
    const passcode = sessionStorage.getItem('passcode');
    const id = sessionStorage.getItem('userId');
    
    const joinData = {
        passcode: passcode,
        id: id
    };
    socket.emit('rejoinRoom', (joinData)); // New page, so need to rejoin room
    
    const submitButton = document.getElementById('submitButton');
    submitButton.addEventListener('click', (event) => {
        socket.emit('performActions', (passcode));
        console.log("Returning player to night screen")
        window.location.href='../../game/night.html';
    })

    socket.emit('requestCardData', (joinData));

    // Populates both the player table and the middle so that data is retrieved for either case
    socket.on('cardData', (cardData) => {

        ///  POPULATE THE PLAYER TABLE
        updatePlayerTable(cardData.players);
        const playerTable = document.getElementById("playerTable");
        const playersArray = Array.from(playerTable.children);

        // Iterate through each player and add an event listener. When clicked, reveal their name
        // and set don't allow any other names to be clicked. Reveal the submit button
        playersArray.forEach(player => {
            player.addEventListener('click', (event) => {
                const robData = {robberId: id, robbeeId: player.id, passcode: passcode};
                socket.emit('robberAction', robData, (response) => {
                    if (response.success) {
                        console.log("Request received");
                        submitButton.classList.remove('hidden');
                        socket.emit('receiveCard', joinData);
                    }
                });
            })
        })
    })

    // Universal submit button for all actions, only becomes visible onces action is completed
    socket.on('nightOver', (event) => {
        window.location.href = '../../game/discussion.html';
    })
});

function revealTable(socket) {
    const viewPlayer = document.getElementById('viewPlayer');
    const seerChoose = document.getElementById('seerChoose');
    viewPlayer.classList.remove('hidden');
    seerChoose.classList.add('hidden');
}

function revealMiddle(socket) {
    const viewMiddle = document.getElementById('viewMiddle');
    const seerChoose = document.getElementById('seerChoose');
    viewMiddle.classList.remove('hidden');
    seerChoose.classList.add('hidden');
}

function updatePlayerTable(players) {
    let playerTable = document.getElementById('playerTable');
    playerTable.innerHTML = ''; // Clear current table
    players.forEach(player => {
        const listItem = document.createElement('div');
        listItem.textContent = player.name;
        listItem.className = 'player';
        listItem.id = player.id;
        playerTable.appendChild(listItem);
    });
};

function updateMiddle(cards) {
    const middle = document.getElementById('middle');
    cards.forEach(card => {
        const middleCard = document.createElement('div');
        middleCard.classList.add('card');
        middleCard.classList.add('flippedOver');
        middleCard.id = card.id;
        middle.appendChild(middleCard);
    });
}