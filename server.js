const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 5000;

let lobbies = [];

const app = express();
app.use(express.static(__dirname + '/public'));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) =>
{
    function getLobbyRoom()
    {
        return Array.from(socket.rooms)[1];
    }

    function isAdmin()
    {
        return lobbies.some(l => l.players[0].id === socket.id);
    }

    function roundsChanged(rounds)
    {
        if(isAdmin())
            io.to(getLobbyRoom()).except(socket.id).emit('roundsChanged', rounds);
    }

    function timeChanged(time)
    {
        if(isAdmin())
            io.to(getLobbyRoom()).except(socket.id).emit('timeChanged', time);
    }

    function wordsChanged(words)
    {
        if(isAdmin())
            io.to(getLobbyRoom()).except(socket.id).emit('wordsChanged', words);
    }
    
    function disconnecting()
    {
        io.to(getLobbyRoom()).except(socket.id).emit('playerDisconnecting', socket.id);
    }

    socket.on('roundsChanged', roundsChanged);
    socket.on('timeChanged', timeChanged);
    socket.on('wordsChanged', wordsChanged);
    socket.on('disconnecting', disconnecting);
});

server.listen(PORT, () =>
{
    console.log('Listening on port ' + PORT);
});

app.post('/join', (req, res) =>
{
    let nickname = req.body.nickname;
    let lobbyId = req.body.lobbyId;
    let socketId = req.body.socketId;

    let lobby = lobbies.find(l => l.id == lobbyId)
    if(!lobby)
    {
        lobby = {id: socketId.substr(0, 16), players: [], rounds: "5", time: "90", words: ['Kočka', 'Pes', 'Žirafa', 'Slon', 'Ptakopysk', 'Lemur']};
    }

    let player = {id: socketId, nickname: nickname};
    lobby.players.push(player);
    lobbies.push(lobby);

    io.to(lobby.id).emit('playerJoined', player);
    io.in(socketId).socketsJoin(lobby.id);

    res.send(lobby);
});