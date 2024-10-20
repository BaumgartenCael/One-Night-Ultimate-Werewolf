document.addEventListener('DOMContentLoaded', ()=> {
    const socket = io();
    const passcode = sessionStorage.getItem('passcode');
    const id = sessionStorage.getItem('userId');
    
    const joinData = {
        passcode: passcode,
        id: id
    };
    socket.emit('rejoinRoom', (joinData)); // New page, so need to rejoin room
    

    socket.emit('requestCardData', (joinData));

    // Populates both the player table and the middle so that data is retrieved for either case
    let selectedPlayers = [];
    socket.on('cardData', (cardData) => {

        ///  POPULATE THE PLAYER TABLE
        updatePlayerTable(cardData.players);
        const playerTable = document.getElementById("playerTable");
        const playersArray = Array.from(playerTable.children);

        // Iterate through each player and add an event listener. When clicked, reveal their name
        // and set don't allow any other names to be clicked. Reveal the submit button
        playersArray.forEach(player => {
            player.addEventListener('click', (event) => {
                if (selectedPlayers.includes(player)) {
                    console.log("SelectedPlayers before remove: ", selectedPlayers);
                    const playerIndex = selectedPlayers.indexOf(player);
                    playerIndex? selectedPlayers.pop(): selectedPlayers.shift();
                    console.log("SelectedPlayers after remove: ", selectedPlayers);
                    player.classList.remove('clicked');
                    submitButton.classList.add('hidden');
                    return
                }
                if (selectedPlayers.length <= 2) {
                    player.classList.add('clicked');
                    console.log("SelectedPlayers before push: ", selectedPlayers);
                    selectedPlayers.push(player);
                    console.log("SelectedPlayers after push: ", selectedPlayers);
                    if (selectedPlayers.length === 2) {
                        submitButton.classList.remove('hidden');
                    }
                }
                // const robData = {robberId: id, robbeeId: player.id, passcode: passcode};
                // socket.emit('robberAction', robData, (response) => {
                //     if (response.success) {
                //         console.log("Request received");
                //         submitButton.classList.remove('hidden');
                //         socket.emit('receiveCard', joinData);
                //     }
                // });
            })
        })
    })

    const submitButton = document.getElementById('submitButton');
    submitButton.addEventListener('click', (event) => {
        socket.emit('troublemakerAction', passcode, selectedPlayers[0].id, selectedPlayers[1].id);
        socket.emit('performActions', (passcode));
        console.log("Returning player to night screen")
        window.location.href='../../game/night.html';
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