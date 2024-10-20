const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const app = express();
const session = require('express-session');
const path = require('path');
const socketIo = require('socket.io');
const setupSockets = require('./websockets');
const port = 3000;


app.use(bodyParser.json());
app.use(express.static(__dirname));

// Uses the session extension
app.use(session({
    secret: 'ABCD',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false}
}));

// HTML ROUTES
// Loads the front page
app.get('/', (req, res)=>{
    console.log('here');
    res.sendFile(path.join(__dirname, 'game', 'title.html'));
})

// Loads the 'create or join game' page
app.get('/menu', (req, res)=>{
    res.sendFile(path.join(__dirname, 'game', 'menu.html'));
})

// Loads the lobby page
app.get('/host', (req, res)=>{
    res.sendFile(path.join(__dirname, 'game', 'host.html'));
})

app.get('/join', (req, res)=>{
    res.sendFile(path.join(__dirname, 'game', 'join.html'));
})

app.get('/lobby', (req, res)=>{
    res.sendFile(path.join(__dirname, 'game', 'lobby.html'));
})

app.get('/night', (req, res)=>{
    res.sendFile(path.join(__dirname, 'game', 'night.html'));
})

app.get('/werewolfAction', (req, res)=>{
    res.sendFile(path.join(__dirname, 'game', 'werewolfAction.html'));
})

app.get('/seerAction', (req, res)=>{
    res.sendFile(path.join(__dirname, 'game', 'seerAction.html'));
})

app.get('/robberAction', (req, res)=>{
    res.sendFile(path.join(__dirname, 'game', 'robberAction.html'));
})

app.get('/troublemakerAction', (req, res)=>{
    res.sendFile(path.join(__dirname, 'game', 'troublemakerAction.html'));
})

app.get('/drunkAction', (req, res)=>{
    res.sendFile(path.join(__dirname, 'game', 'drunkAction.html'));
})

app.get('/insomniacAction', (req, res)=>{
    res.sendFile(path.join(__dirname, 'game', 'insomniacAction.html'));
})

app.get('/discussion', (req, res) => {
    res.sendFile(path.join(__dirname, 'game', 'discussion.html'));
})

app.get('/vote', (req, res) => {
    res.sendFile(path.join(__dirname, 'game', 'vote.html'));
})

app.get('/results', (req, res) => {
    res.sendFile(path.join(__dirname, 'game', 'results.html'));
})







// Loads routes
const gameRouter = require('./routes/game');
const userRouter = require('./routes/user');
app.use('/', gameRouter);
app.use('/', userRouter);

// Websocket setup
const server = http.createServer(app);
const io = socketIo(server);
setupSockets(io);


server.listen(port, () => {
    console.log("here");
});

