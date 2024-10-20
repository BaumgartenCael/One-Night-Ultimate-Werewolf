document.addEventListener('DOMContentLoaded', ()=> {
    const socket = io();
    const passcode = sessionStorage.getItem('passcode');
    const id = sessionStorage.getItem('userId');
    
    const joinData = {
        passcode: passcode,
        id: id
    };
    socket.emit('rejoinRoom', joinData);
    
    console.log("Emitting the time thing to the server");
    socket.emit('time', passcode);
    socket.on('timeReceived', (time) => {
        console.log("Received the time thing from the server");
        document.getElementById('Timer').innerText = time;
        let timer = setInterval(() => {
            time--;
            document.getElementById('Timer').innerText = time;
            console.log("Timer!")
            if (time <= 0) {
                clearInterval(timer);
                window.location.href='../game/vote.html';
            }
            }, 1000);
    })

});
