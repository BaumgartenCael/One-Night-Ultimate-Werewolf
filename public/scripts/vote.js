document.addEventListener('DOMContentLoaded', ()=> {
    const socket = io();
    const passcode = sessionStorage.getItem('passcode');
    const id = sessionStorage.getItem('userId');
    
    const joinData = {
        passcode: passcode,
        id: id
    };
    socket.emit('rejoinRoom', joinData);

    socket.emit('enterLobby', joinData);

    socket.on('populateLobby', (players) => {
        console.log("POpulating lobby!");
        updatePlayerTable(players, socket, joinData)
        const playerTable = document.getElementById("playerTable");
        const playersArray = Array.from(playerTable.children);
        playersArray.forEach(player => {
            player.addEventListener('click', (event) => {
                socket.emit('vote', player.id, joinData);
                console.log("player.id: ", player.id);
                window.location.href = "../game/results.html";
            })
        })
    });
})

function updatePlayerTable(players, socket, joinData) {
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
    