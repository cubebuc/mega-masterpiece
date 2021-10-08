const express = require('express');
const http = require('http');
const { Server, Socket } = require('socket.io');
const Lobby = require('./models/Lobby.js');

const PORT = process.env.PORT || 5000;

let lobbies = [];

const app = express();
app.use(express.static(__dirname + '/public'));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server);

server.listen(PORT, () =>
{
    console.log('Listening on port ' + PORT);
});

app.post('/join', (req, res) =>
{
    let nickname = req.body.nickname;
    let id = req.body.id;

    let lobby = lobbies.find(l => l.id == id)
    if(!lobby)
    {
        lobby = new Lobby();
        lobby.setWords(['Kočka', 'Pes', 'Žirafa', 'Slon', 'Ptakopysk', 'Lemur']);
    }

    console.log(lobby.id);

    lobby.addPlayer(nickname);
    lobbies.push(lobby);

    io.emit(lobby.id + '/connect', nickname);
    res.send(lobby);
});