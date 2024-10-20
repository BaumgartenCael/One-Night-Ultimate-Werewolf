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
    let selectedCard;
    socket.on('cardData', (cardData) => {

        /// POPULATE THE MIDDLE
        updateMiddle(cardData.middle);
        const middle = document.getElementById('middle');
        const cards = Array.from(middle.children);

        cards.forEach(card => {
            card.addEventListener('click', (event) => {
                if (selectedCard) {
                    selectedCard.classList.remove('clicked')
                }
                selectedCard = card;
                selectedCard.classList.add('clicked');
                submitButton.classList.remove('hidden');
                console.log("SelectedCard: ", selectedCard);
            })
        })
    })

    const submitButton = document.getElementById('submitButton');
    submitButton.addEventListener('click', (event) => {
        // console.log("selectedCard before emitting: ", selectedCard.id);
        socket.emit('drunkAction', passcode, id, selectedCard.id);
        socket.emit('performActions', (passcode));
        console.log("Returning player to night screen")
        window.location.href='../../game/night.html';
    })


    // Universal submit button for all actions, only becomes visible onces action is completed
    socket.on('nightOver', (event) => {
        window.location.href = '../../game/discussion.html';
    })
});

// function revealTable(socket) {
//     const viewPlayer = document.getElementById('viewPlayer');
//     const seerChoose = document.getElementById('seerChoose');
//     viewPlayer.classList.remove('hidden');
//     seerChoose.classList.add('hidden');
// }

// function revealMiddle(socket) {
//     const viewMiddle = document.getElementById('viewMiddle');
//     const seerChoose = document.getElementById('seerChoose');
//     viewMiddle.classList.remove('hidden');
//     seerChoose.classList.add('hidden');
// }

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
        const middleCard = document.createElement('div');
        middleCard.classList.add('card');
        middleCard.classList.add('flippedOver');
        middleCard.id = card.id;
        middle.appendChild(middleCard);
    });
}