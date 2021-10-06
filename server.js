const express = require('express');
const Lobby = require('./models/Lobby.js');

let lobbies = [];

const app = express();
app.use(express.static(__dirname + '/public'));
app.use(express.json());
const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
{
    console.log('Listening on port ' + PORT);
});

app.get('/backend', (req, res) =>
{
    res.send({express: 'Express backend is connected to React frontend.'});
});

app.post('/join', (req, res) =>
{
    let player = req.body.player;

    let lobby = new Lobby();
    lobby.addPlayer(player);
    lobby.setWords(['Jedna', 'Pes']);
    lobbies.push(lobby);
    res.send(lobby);
});