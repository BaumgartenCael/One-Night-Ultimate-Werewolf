document.addEventListener('DOMContentLoaded', ()=> {
    const socket = io();
    const passcode = sessionStorage.getItem('passcode');
    const id = sessionStorage.getItem('userId');
    
    const joinData = {
        passcode: passcode,
        id: id
    };
    // New page, so we need to rejoin room
    socket.emit('rejoinRoom', joinData, (response) => {
        if (response.success) { // After successfully rejoining, send data to update player table
            console.log("EMitting rejoinroom clientside and enterLobby")
            socket.emit('enterLobby', (joinData));
        }
    }); 
    console.log("USER ID IN LOBBY: ", id);

    socket.on('populateLobby', (players) => {
        console.log("Get populated!");
        console.log("Players: ", players);
        updatePlayerTable(players)
    });

    socket.on('gameStarted', (game) => {
        console.log("ID before redirect: ", sessionStorage.getItem('userId'));
        window.location.href = '../../game/night.html';
    });



    // Updates the table on the lobby and host pages dynamically
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
});
