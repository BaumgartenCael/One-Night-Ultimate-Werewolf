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
        const viewPlayer = document.getElementById('viewPlayer');

        // Iterate through each player and add an event listener. When clicked, reveal their name
        // and set don't allow any other names to be clicked. Reveal the submit button
        let i = false;
        playersArray.forEach(player => {
            player.addEventListener('click', (event) => {
                if (!i) {
                    console.log("Clicked on ", player);
                    console.log("Text: ", viewPlayer.textContent);
                    viewPlayer.textContent = 'This player is the ' + player.id;
                    console.log("Text after: ", viewPlayer.textContent);
                    i = true;
                    submitButton.classList.remove('hidden');
                }
            })
        })

        /// POPULATE THE MIDDLE
        updateMiddle(cardData.middle);
        const middle = document.getElementById('middle');
        const cards = Array.from(middle.children);

        // Do as above for the middle
        let j = 0;
        cards.forEach(card => {
            card.addEventListener('click', (event) => {
                // Do not iterate j if the card has already been flipped.
                if (!card.classList.contains('flippedOver')) {
                    console.log("Already flipped!");
                    return
                }
                if (j <= 1) {
                    console.log("Flipped");
                    card.classList.remove('flippedOver');
                    j++;
                    if (j >= 2) { // Check when two cards have been flipped over to reveal the submitbutton
                        console.log("Done Flipping!");
                        submitButton.classList.remove('hidden');
                    }
                }
            })
        })
    })


    // Universal submit button for all actions, only becomes visible onces action is completed
    socket.on('nightOver', (event) => {
        window.location.href = '../../game/discussion.html';
    })
});

function revealTable() {
    const viewPlayer = document.getElementById('viewPlayer');
    const seerChoose = document.getElementById('seerChoose');
    console.log("Clicked!");
    viewPlayer.classList.remove('hidden');
    seerChoose.classList.add('hidden');
}

function revealMiddle() {
    const viewMiddle = document.getElementById('viewMiddle');
    const seerChoose = document.getElementById('seerChoose');
    console.log("Clicked!");
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
        listItem.id = player.card.id;
        playerTable.appendChild(listItem);
    });
};

function updateMiddle(cards) {
    const middle = document.getElementById('middle');
    cards.forEach(card => {
        const middleCard = generateCard(card, submitButton);
        middle.appendChild(middleCard);
    });
}

function generateCard(card, submitButton) {
    const cardDOM = document.createElement('div');
    cardDOM.classList.add('card');
    cardDOM.classList.add('flippedOver')
    
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

    return cardDOM;
}