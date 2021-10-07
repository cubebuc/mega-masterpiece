const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const Lobby = require('./models/Lobby.js');

const PORT = process.env.PORT || 5000;

let lobbies = [];

const app = express();
app.use(express.static(__dirname + '/public'));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server);
//io.emit('key', value);

server.listen(PORT, () =>
{
    console.log('Listening on port ' + PORT);
});

app.post('/join', (req, res) =>
{
    io.emit('test', 'test');

    let player = req.body.player;
    let id = req.body.id;

    let lobby = lobbies.find(l => l.id == id)
    if(!lobby)
    {
        lobby = new Lobby();
        lobby.setWords(['Kočka', 'Pes', 'Žirafa', 'Slon', 'Ptakopysk', 'Lemur']);
    }

    lobby.addPlayer(player);
    lobbies.push(lobby);
    res.send(lobby);
});