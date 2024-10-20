document.addEventListener('DOMContentLoaded', ()=> {
    const socket = io();
    const passcode = sessionStorage.getItem('passcode');
    const id = sessionStorage.getItem('userId');
    const joinData = {
        passcode: passcode,
        id: id
    };

    // Display the passcode at the top of the screen
    const passcodeDisplay = document.getElementById('passcode');
    passcodeDisplay.textContent = sessionStorage.getItem('passcode');


    /// JOINING THE ROOM ///

    // New page, so we need to rejoin room
    socket.emit('rejoinRoom', joinData, (response) => {
        if (response.success) { // After successfully rejoining, send data to update player table
            console.log("EMitting rejoinroom clientside and enterLobby")
            socket.emit('enterLobby', (joinData));
        }
    }); 

    // After joining the room, update the player table
    socket.on('populateLobby', (players) => {
        console.log("Get populated!");
        console.log("Players: ", players);
        updatePlayerTable(players)
    });


    /// STARTING THE GAME ///

    // Starts the game after pressing the start button
    const start = document.getElementById('startButton');
    start.addEventListener('click', (event) => {
        console.log("ID as startGame clicked: ", sessionStorage.getItem('userId'));
        socket.emit('startGame', (passcode));
    });

    // Redirect the players after the game starts
    socket.on('gameStarted', (game) => {
        console.log("ID before redirect: ", sessionStorage.getItem('userId'));
        window.location.href = '../../game/night.html';
    });
    


    /// CARD MANIPULATION ///

    // Generate the cards in the card selector on the frontend
    socket.emit('getCardData', (passcode));
    socket.on('populateCards', (cards) => {
        const cardSelector = document.getElementById('cardSelector')
        cards.forEach(card => {
            cardSelector.appendChild(generateCard(card, socket));
        })
    })

    socket.on('cardToggled', (card) => {
        updateCard(card);
    });

});

// Updates cards by reducing/increases their opacity on the screen
function updateCard(card) {
    cardDOM = document.getElementById(card.id);
    card.active ? cardDOM.classList.remove('inactive') : cardDOM.classList.add('inactive');
}

function updatePlayerTable(players) {
    let playerTable = document.getElementById('playerTable');
    playerTable.innerHTML = ''; // Clear current table
    players.forEach(player => {
        const listItem = document.createElement('div');
        listItem.textContent = player.name;
        listItem.className = 'player';
        playerTable.appendChild(listItem);
    });
};

function generateCard(card, socket) {
    const cardDOM = document.createElement('div');
    cardDOM.classList.add('card');
    cardDOM.id = card.id;
    
    const cardTop = document.createElement('div');
    cardTop.classList.add('cardTop');
    cardTop.textContent = card.name;

    const cardMiddle = document.createElement('div');
    cardMiddle.classList.add('cardMiddle');
    const cardImage = document.createElement('img'); // Create an img element
    cardImage.src = card.imageURL; // Set the src attribute
    cardImage.alt = `${card.name} image`; // Set the alt attribute
    cardMiddle.appendChild(cardImage); // Add image to the middle section

    const cardBottom = document.createElement('div');
    cardBottom.classList.add('cardBottom');
    cardBottom.textContent = card.description;

    cardDOM.appendChild(cardTop);
    cardDOM.appendChild(cardMiddle);
    cardDOM.appendChild(cardBottom);

    cardDOM.addEventListener('click', (event) => {
        const cardData = {cardID: card.id, passcode: sessionStorage.getItem('passcode')}; 
        socket.emit('toggleCard', cardData);
    })

    return cardDOM;
}

// Only used for host page
function displayCards() {
    const cardSelector = document.getElementById('cardSelector');
    cardSelector.classList.toggle('hidden');
}
