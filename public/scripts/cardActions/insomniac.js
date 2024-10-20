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

    socket.emit('requestCard', (joinData));

    // Populates both the player table and the middle so that data is retrieved for either case
    socket.on('receivedCard', (card) => {
        const cardDisplay = document.getElementById('cardDisplay');
        cardDisplay.appendChild(generateCard(card, socket, submitButton));
    })


    // Universal submit button for all actions, only becomes visible onces action is completed
    socket.on('nightOver', (event) => {
        window.location.href = '../../game/discussion.html';
    })
});

function generateCard(card, socket, submitButton) {
    const cardDOM = document.createElement('div');
    cardDOM.classList.add('card');
    cardDOM.classList.add('flippedOver')
    cardDOM.addEventListener('click', (event) => {
        cardDOM.classList.remove('flippedOver');
        submitButton.classList.remove('hidden');
    })
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