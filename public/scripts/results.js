document.addEventListener('DOMContentLoaded', ()=> {
    const socket = io();
    const passcode = sessionStorage.getItem('passcode');
    const id = sessionStorage.getItem('userId');
    
    const joinData = {
        passcode: passcode,
        id: id
    };
    socket.emit('rejoinRoom', joinData);

    socket.on('displayResults', (voteCounts, players) => {
        const waiting = document.getElementById('waiting');
        const results = document.getElementById('winner');
        const table = document.getElementById('voteTable');
        const playerArray = Array.from(players);
        let max = 0;
        let winners = [];
        playerArray.forEach(player => {
            const text = document.createElement('div');
            console.log("player: ", player);
            text.textContent = `${player.name} (${player.card.name}): ${player.votes}`
            text.classList.add('player');
            table.appendChild(text);
            if (player.votes === max) {
                winners.push(player);
            } else if (player.votes > max) {
                max = player.votes;
                winners.length = 0;
                winners.push(player);
            }
        })
        let werewolvesVoted = false;
        winners.forEach(player => {
            if (player.card.name === 'Werewolf') {
                werewolvesVoted = true;
                return;
            }
        })
        waiting.classList.add('hidden');
        results.textContent = werewolvesVoted 
        ? 'The werewolf was voted out, the village wins!' : 'The werewolves survived, werewolves win!';

        console.log("VoteCounts: ", voteCounts);
        console.log("Players: ", players);
    });
})