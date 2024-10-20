const socket = io();

// Frontend function to create a user by inputting a username
function createUser() {
    // Retrieve the inputted text to be used for the name
    let input = document.getElementById('username');
    let text = input.value;
    let id = Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem('userId', id);
    console.log("Created ID: ", sessionStorage.getItem('userId'));
    const userData = {
        name: text,
        id: id
    };
    fetch('/user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    console.log("All good");

    // Register the user to store their socket ID
    socket.emit('register', id);
}



// Frontend function to create a game with a random password
function createGame() {
    let passcode = Math.random().toString(36).substring(2, 6);
    sessionStorage.setItem('passcode', passcode);
    const userId = sessionStorage.getItem('userId');
    const gameData = {
        passcode: passcode,
        id: userId
    }
    console.log("Sessionstorage for the game:, ", sessionStorage.getItem('passcode'));
    socket.emit('createGame', gameData);
} 



// Frontend function to join a game
function joinGame() {
    console.log("Cilikeckd");
    let passcode = document.getElementById('enterPasscode');
    let passcodeText = passcode.value;
    const userId = sessionStorage.getItem('userId');
    const joinData = {
        passcode: passcodeText,
        id: userId
    };
    socket.emit('joinGame', joinData);
}
socket.on('gameJoined', (passcode) => {
    sessionStorage.setItem('passcode', passcode);
    window.location.href='../../game/lobby.html';
}) 
socket.on('noGame', (event) => {
    const errorContainer = document.getElementById("errorContainer");
    errorContainer.innerHTML = '';
    const error = document.createElement('div');
    error.classList.add('errorMessage');
    error.textContent = "Couldn't find game with this passcode!";
    errorContainer.appendChild(error);
})



function checkStatus() {
    console.log("ID at menu rn: ", sessionStorage.getItem('userId'));
    console.log("Local storage: ", sessionStorage);
}