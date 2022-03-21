/** @module server */

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
app.use(express.static(path.join(__dirname, 'docs', 'build')));

app.get('/', function(_req, res) 
{
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

app.get('/docs', function(_req, res)
{
    res.sendFile(path.join(__dirname, 'docs', 'build', 'index.html'));
});

const io = new Server(server);

io.on('connection', (socket) =>
{
    /**
     * Emits to everyone in the lobby except the origin.
     * @function otherEmit
     * @param {string} event - Event name.
     * @param {*} args - Event arguments.
     */
    function otherEmit(event, args)
    {
        if(args === undefined)
            io.to(getLobbyRoom()).except(socket.id).emit(event);
        else
            io.to(getLobbyRoom()).except(socket.id).emit(event, args);
    }

    /**
     * Emits to everyone in the lobby.
     * @function roomEmit
     * @param {string} event - Event name.
     * @param {*} args - Event arguments.
     */
    function roomEmit(event, args)
    {
        if(args === undefined)
            io.to(getLobbyRoom()).emit(event);
        else
            io.to(getLobbyRoom()).emit(event, args);
    }

    /**
     * Gets the id of this socket's lobby.
     * @function getLobbyRoom
     * @returns {string} Id of this socket's lobby.
     */
    function getLobbyRoom()
    {
        return Array.from(socket.rooms)[1];
    }

    /**
     * Gets this socket's lobby.
     * @function getLobbyRoom
     * @returns {Object} This socket's lobby.
     */
    function getLobby()
    {
        return lobbies.find(l => l.players.some(p => p.id === socket.id));
    }

    /**
     * Returns whether this socket is an admin.
     * @function isAdmin
     * @returns {boolean} Whether this socket is an admin.
     */
    function isAdmin()
    {
        return getLobby() && getLobby().players[0].id === socket.id;
    }

    /**
     * Returns whether this socket is on turn.
     * @function isOnTurn
     * @returns {boolean} Whether this socket is on turn.
     */
    function isOnTurn()
    {
        return getLobby().players.find(p => socket.id === p.id).onTurn;
    }
    
    /**
     * Transmits the newly set number of rounds by admin to others in the lobby.
     * @function roundsChanged
     * @param {number} rounds Number of rounds in a game.
     */
    function roundsChanged(rounds)
    {
        if(isAdmin())
        {
            getLobby().rounds = rounds;
            otherEmit('roundsChanged', rounds);
        }
    }
    
    /**
     * Transmits the newly set amount of times by admin to others in the lobby.
     * @function timeChanged
     * @param {number} time Amount of time for one turn.
     */
    function timeChanged(time)
    {
        if(isAdmin())
        {
            getLobby().time = time;
            otherEmit('timeChanged', time);
        }
    }
    
    /**
     * Transmits the newly set words by admin to others in the lobby.
     * @function wordsChanged
     * @param {string[]} words Array of words to choose from in the game.
     */
    function wordsChanged(words)
    {
        if(isAdmin())
        {
            getLobby().words = words;
            otherEmit('wordsChanged', words);
        }
    }
    
    /**
     * Tells all other sockets to join the game, if this socket is an admin.
     * @function joinGame
     */
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
    
    /**
     * Transmits the position where this socket started drawing to others in the lobby.
     * @function startDrawing
     * @param {Object} pos Position object containing x, y position where this socket started drawing.
     */
    function startDrawing(pos)
    {
        if(isOnTurn())
        {
            otherEmit('startDrawing', pos);
        }
    }

    /**
     * Transmits the position where this socket is drawing to others in the lobby.
     * @function draw
     * @param {Object} pos Position object containing x, y position where this socket is drawing.
     */
    function draw(pos)
    {
        if(isOnTurn())
        {
            otherEmit('draw', pos);
        }
    }

    /**
     * Transmits the newly set drawing color by the player on turn to others in the lobby.
     * @function colorChanged
     * @param {string} color Hex value of the new drawing color.
     */
    function colorChanged(color)
    {
        if(isOnTurn())
        {
            otherEmit('colorChanged', color);
        }
    }

    /**
     * Transmits the newly set line width by the player on turn to others in the lobby.
     * @function widthChanged
     * @param {number} width The width of the brush.
     */
    function widthChanged(width)
    {
        if(isOnTurn())
        {
            otherEmit('widthChanged', width);
        }
    }

    /**
     * Transmits the action of clearing the canvas by the player on turn to others in the lobby.
     * @function clearCanvas
     */
    function clearCanvas()
    {
        if(isOnTurn())
        {
            otherEmit('clearCanvas');
        }
    }

    /**
     * Sends a request to the admin for sending the data to the corresponding socket.
     * @function turnDataRequested
     * @param {string} socketId Id of the socket, that requested the data.
     */
    function turnDataRequested(socketId)
    {
        io.to(getLobby().players[0].id).emit('turnDataRequested', socketId);
    }

    /**
     * Sends the data recieved from the admin to the socket, that requested it.
     * @function turnDataSent
     * @param {*} data Object containing current turn time and picture data.
     */
    function turnDataSent(data)
    {
        if(isAdmin())
        {
            io.to(data.socketId).emit('turnDataSent', {timeCounter: data.timeCounter, pictureData: data.pictureData});
        }
    }

    /**
     * Checks whether the sender guessed the word, gives the points
     * and transmits it to others in the lobby.
     * @function messageSent
     * @param {Object} message Object containing the message sender and the message's content.
     */
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

    /**
     * Connects the socket to the desired lobby and transmit it to others in the lobby.
     * If the lobby doesn't exist, create a new one.
     * @function join
     * @param {Object} data Object containing the newly joined player's nickname and lobby id.
     */
    function join(data)
    {
        let lobby = lobbies.find(l => l.id === data.lobbyId)
        if(!lobby)
        {
            lobby = {id: socket.id.substring(0, 16), inGame: false, players: [], currentPlayer: -1, rounds: 5, currentRound: 0, time: '90', words: ['Kočka Pes', 'Žirafa Slon', 'Ptakopysk Lemur'], currentWord: '', playersGuessed: []};
            lobbies.push(lobby);
        }

        let player = {id: socket.id, nickname: data.nickname, onTurn: false, ready: false, guessed: false, points: 0, pointsThisTurn: 0};
        lobby.players.push(player);
        
        let newLobby = {id: lobby.id, inGame: lobby.inGame, players: lobby.players, currentPlayer: lobby.currentPlayer, rounds: lobby.rounds, currentRound: lobby.currentRound, time: lobby.time, words: lobby.words, currentWord: lobby.currentWord};

        io.to(lobby.id).emit('playerJoined', player);
        io.to(socket.id).socketsJoin(lobby.id);
        io.to(socket.id).emit('join', JSON.stringify(newLobby));
    }

    /**
     * Marks this socket as ready.
     * If all the sockets in a lobby are ready, the game starts.
     * @function ready
     */
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

    /**
     * Prepares all lobby variables for the next turn.
     * Transmits the data about the next turn to others in the lobby.
     * 
     * @function nextTurn
     */
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

        lobby.currentPlayer++;
        if(lobby.currentPlayer >= lobby.players.length)
            lobby.currentPlayer = 0;

        if(lobby.currentPlayer == 0)
            lobby.currentRound++;

        if(lobby.currentRound > lobby.rounds)
        {
            endGame();
            return;
        }

        let playerIndex = lobby.currentPlayer;
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

    /**
     * Transmits the end of the turn to the others in the lobby.
     * Then starts a new turn.
     * @function endTurn
     */
    function endTurn()
    {
        let lobby = getLobby();
        clearTimeout(lobby.timeout);

        roomEmit('endTurn', lobby.currentWord);

        let endTurnTimeout = 4000;
        lobby.timeout = setTimeout(() => 
        {
            nextTurn();
        }, endTurnTimeout);
    }

    /**
     * Transmits the end of the game to the others in the lobby.
     * Then sends everyone back to the lobby.
     * @function endGame
     */
    function endGame()
    {
        let lobby = getLobby();
        roomEmit('endGame');

        let leaderboardTime = 4000;
        lobby.timeout = setTimeout(() =>
        {
            lobby.inGame = false;
            lobby.currentPlayer = -1;
            lobby.currentRound = 0;
            lobby.playersGuessed = [];

            lobby.players.forEach(player =>
            {
                player.ready = false;
                player.points = 0;
            });

            roomEmit('restartGame');
        }, leaderboardTime);
    }
    
    /**
     * Removes a player from the lobby and transmits it to the others in the lobby.
     * @function disconnecting
     */
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
