document.addEventListener('DOMContentLoaded', ()=> {
    const socket = io();
    const passcode = sessionStorage.getItem('passcode');
    const id = sessionStorage.getItem('userId');
    
    const joinData = {
        passcode: passcode,
        id: id
    };
    console.log("Player with this id has just joined the night: ", sessionStorage.getItem('userId'));
    socket.emit('rejoinRoom', (joinData)); // New page, so need to rejoin room

    socket.emit('requestCard', (joinData));

    socket.on('receivedCard', (card) => {
        console.log("Card retrieved!");
        const cardDisplay = document.getElementById('cardDisplay');
        const cardDOM = generateCard(card, socket);
        cardDisplay.appendChild(cardDOM);
    })
    socket.on('takeAction', (player) => {
        console.log("Received takeAction from server");
        window.location.href='../../game/cardPages/drunkAction.html';
        // if (player.tempCard.name === 'Werewolf') {
        //     window.location.href='../../game/cardPages/werewolfAction.html';
        // } else if (player.tempCard.name === 'Seer') {
        //     window.location.href='../../game/cardPages/seerAction.html';
        // } else if (player.tempCard.name === 'Robber') {
        //     window.location.href='../../game/cardPages/robberAction.html';
        // } else if (player.tempCard.name === 'Troublemaker') {
        //     window.location.href='../../game/cardPages/troublemakerAction.html';
        // } else if (player.tempCard.name === 'Drunk') {
        //     window.location.href='../../game/cardPages/drunkAction.html';
        // } else if (player.tempCard.name === 'Insomniac') {
        //     window.location.href='../../game/cardPages/insomniacAction.html';
        // }
        
    });

    const startNight = document.getElementById('startNight');
    startNight.addEventListener('click', (event) => {
        console.log("Starting Night");
        socket.emit('performActions', (passcode));
    })

    socket.on('nightOver', (event) => {
        window.location.href = '../../game/discussion.html';
    })
});

function generateCard(card, socket) {
    const cardDOM = document.createElement('div');
    cardDOM.classList.add('card');
    cardDOM.id = card.name;
    
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
