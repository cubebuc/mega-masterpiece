const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const { randomInt } = require('crypto');
const path = require('path')

const POINTS = [20, 14, 9, 6, 4, 2, 1];
let lobbies = [];

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

app.use(express.static(path.join(__dirname, 'client', 'build')));

app.get('/', function(_req, res) 
{
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

const io = new Server(server);

io.on('connection', (socket) =>
{
    function otherEmit(event, args)
    {
        if(args === undefined)
            io.to(getLobbyRoom()).except(socket.id).emit(event);
        else
            io.to(getLobbyRoom()).except(socket.id).emit(event, args);
    }

    function roomEmit(event, args)
    {
        if(args === undefined)
            io.to(getLobbyRoom()).emit(event);
        else
            io.to(getLobbyRoom()).emit(event, args);
    }

    function getLobbyRoom()
    {
        return Array.from(socket.rooms)[1];
    }

    function getLobby()
    {
        return lobbies.find(l => l.players.some(p => p.id === socket.id));
    }

    function isAdmin()
    {
        return getLobby() && getLobby().players[0].id === socket.id;
    }

    function isOnTurn()
    {
        return getLobby().players.find(p => socket.id === p.id).onTurn;
    }

    function roundsChanged(rounds)
    {
        if(isAdmin())
        {
            getLobby().rounds = rounds;
            otherEmit('roundsChanged', rounds);
        }
    }

    function timeChanged(time)
    {
        if(isAdmin())
        {
            getLobby().time = time;
            otherEmit('timeChanged', time);
        }
    }

    function wordsChanged(words)
    {
        if(isAdmin())
        {
            getLobby().words = words;
            otherEmit('wordsChanged', words);
        }
    }

    function joinGame()
    {
        if(isAdmin())
        {
            let lobby = getLobby();
            lobby.inGame = true;
            
            let index = randomInt(lobby.words.length);
            lobby.currentWord = lobby.words[index];

            otherEmit('joinGame');
        }
    }

    function startDrawing(pos)
    {
        if(isOnTurn())
        {
            otherEmit('startDrawing', pos);
        }
    }

    function draw(pos)
    {
        if(isOnTurn())
        {
            otherEmit('draw', pos);
        }
    }

    function colorChanged(color)
    {
        if(isOnTurn())
        {
            otherEmit('colorChanged', color);
        }
    }

    function widthChanged(width)
    {
        if(isOnTurn())
        {
            otherEmit('widthChanged', width);
        }
    }

    function clearCanvas()
    {
        if(isOnTurn())
        {
            otherEmit('clearCanvas');
        }
    }

    function turnDataRequested(socketId)
    {
        io.to(getLobby().players[0].id).emit('turnDataRequested', socketId);
    }

    function turnDataSent(data)
    {
        if(isAdmin())
        {
            io.to(data.socketId).emit('turnDataSent', {timeCounter: data.timeCounter, pictureData: data.pictureData});
        }
    }

    function messageSent(message)
    {
        let lobby = getLobby();
        let player = lobby.players.find(p => p.id === socket.id);
        if(player.guessed)
        {
            for(let p of lobby.players)
            {
                if(p.guessed && p.id != socket.id)
                {
                    io.to(p.id).emit('messageSent', message);
                }
            }
            return;
        }
        else if(message.value.trim().toUpperCase().normalize() === lobby.currentWord.trim().toUpperCase().normalize())
        {
            player.guessed = true;
            let points = POINTS[lobby.playersGuessed.length] || POINTS[POINTS.length - 1]
            player.points += points;
            player.pointsThisTurn = points;
            lobby.playersGuessed.push(player.id);
            roomEmit('playerGuessed', [socket.id, points]);

            if(!lobby.players.some(p => !p.guessed))
            {
                endTurn();
            }

            return;
        }
        
        otherEmit('messageSent', message);
    }

    function join(data)
    {
        let lobby = lobbies.find(l => l.id === data.lobbyId)
        if(!lobby)
        {
            lobby = {id: socket.id.substring(0, 16), inGame: false, players: [], rounds: "5", currentRound: "1", time: "90", words: ['Kočka Pes', 'Žirafa Slon', 'Ptakopysk Lemur'], currentWord: "", playersGuessed: []};
            lobbies.push(lobby);
        }

        let player = {id: socket.id, nickname: data.nickname, onTurn: false, ready: false, guessed: false, points: 0, pointsThisTurn: 0};
        lobby.players.push(player);
        
        let newLobby = {id: lobby.id, inGame: lobby.inGame, players: lobby.players, rounds: lobby.rounds, currentRound: lobby.currentRound, time: lobby.time, words: lobby.words, currentWord: lobby.currentWord};

        io.to(lobby.id).emit('playerJoined', player);
        io.to(socket.id).socketsJoin(lobby.id);
        io.to(socket.id).emit('join', JSON.stringify(newLobby));
    }

    function ready()
    {
        let lobby = getLobby();
        let index = lobby.players.findIndex(p => p.id === socket.id);
        lobby.players[index].ready = true;

        if(lobby.players.every(p => p.ready))
        {
            endTurn();
            nextTurn();
        }
    }

    function nextTurn()
    {
        let lobby = getLobby();
        lobby.playersGuessed = [];
        lobby.players.forEach(player =>
        {
            player.onTurn = false;
            player.guessed = false;
            player.pointsThisTurn = 0;
        });
        clearTimeout(lobby.timeout);

        let playerIndex = randomInt(0, lobby.players.length);
        let wordIndex = randomInt(0, lobby.words.length);
        let player = lobby.players[playerIndex];
        player.onTurn = true;
        player.guessed = true;
        lobby.currentWord = lobby.words[wordIndex];

        io.to(player.id).emit('newPlayerOnTurn', [playerIndex, lobby.currentWord]);
        io.to(getLobbyRoom()).except(player.id).emit('newPlayerOnTurn', [playerIndex, lobby.currentWord.replace(/[^\s]/g, '_')]);
    
        let preTurnTimeout = 4000;
        lobby.timeout = setTimeout(() =>
        {
            roomEmit('startTurn');
            lobby.timeout = setTimeout(() => 
            {
                endTurn();
            }, lobby.time * 1000);
        }, preTurnTimeout);
    }

    function endTurn()
    {
        let lobby = getLobby();
        clearTimeout(lobby.timeout);

        roomEmit('endTurn');

        let endTurnTimeout = 4000;
        lobby.timeout = setTimeout(() => 
        {
            nextTurn();
        }, endTurnTimeout);
    }
    
    function disconnecting()
    {
        let lobby = getLobby();
        if(!lobby)
            return;
        let playerIndex = lobby.players.findIndex(p => p.id === socket.id);
        lobby.players.splice(playerIndex, 1);
        if(lobby.players.length == 0)
        {
            clearTimeout(lobby.timeout);

            let lobbyIndex = lobbies.indexOf(lobby);
            lobbies.splice(lobbyIndex, 1);
        }
        otherEmit('playerDisconnected', socket.id);
    }

    socket.on('roundsChanged', roundsChanged);
    socket.on('timeChanged', timeChanged);
    socket.on('wordsChanged', wordsChanged);
    socket.on('joinGame', joinGame);
    socket.on('draw', draw);
    socket.on('startDrawing', startDrawing);
    socket.on('colorChanged', colorChanged);
    socket.on('clearCanvas', clearCanvas);
    socket.on('widthChanged', widthChanged);
    socket.on('turnDataRequested', turnDataRequested);
    socket.on('turnDataSent', turnDataSent);
    socket.on('messageSent', messageSent);
    socket.on('join', join);
    socket.on('ready', ready);
    socket.on('nextTurn', nextTurn);
    socket.on('disconnecting', disconnecting);
});

server.listen(PORT, () =>
{
    console.log('Listening on port ' + PORT);
});
