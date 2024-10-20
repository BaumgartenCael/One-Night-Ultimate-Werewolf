document.addEventListener('DOMContentLoaded', ()=> {
    const socket = io();
    const passcode = sessionStorage.getItem('passcode');
    const id = sessionStorage.getItem('userId');
    
    const joinData = {
        passcode: passcode,
        id: id
    };
    socket.emit('rejoinRoom', (joinData)); // New page, so need to rejoin room
    
    socket.emit('checkWerewolf', (joinData));
    console.log("emitted checkWerewolf to the Server")

    socket.on('showWerewolves', (player) => {
        console.log("received showWerewolves from the server");
        const name = document.getElementById('nameReveal');
        name.textContent = player.name;
        const submitButton = document.getElementById('submitButton');
        submitButton.classList.remove('hidden');
        name.classList.remove('hidden');
    }) 

    socket.on('noWerewolves', (cards) => {
        console.log("received noWerewolves from the server");
        console.log("Middle client side: ", cards);
        const middle = document.getElementById('middle');
        let used = 0;
        cards.forEach(card => {
            const middleCard = generateCard(card, socket, submitButton);
            middleCard.id = card.id;
            middleCard.addEventListener('click', (event) => {
                console.log("Clicked the card: ", card.name);
                if (!used) {
                    console.log("That actually did something because used is set to false");
                    middleCard.classList.remove('flippedOver');
                    used = true;
                    const submitButton = document.getElementById('submitButton');
                    submitButton.classList.remove('hidden');
                }
            })
            middle.appendChild(middleCard);
        })
        middle.classList.remove('hidden');
    })



    // Universal submit button for all actions, only becomes visible onces action is completed
    const submitButton = document.getElementById('submitButton');
    submitButton.addEventListener('click', (event) => {
        socket.emit('performActions', (passcode));
        console.log("Returning player to night screen")
        window.location.href='../../game/night.html';
    })
    socket.on('nightOver', (event) => {
        window.location.href = '../../game/discussion.html';
    })
});
function updateMiddle(cards) {
    const middle = document.getElementById('middle');
    cards.forEach(card => {
        const middleCard = generateCard(card);
        middleCard.classList.add('flippedOver');
        middleCard.id = card.id;
        middle.appendChild(middleCard);
    })
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