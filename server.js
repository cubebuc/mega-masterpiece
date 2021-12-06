const { randomInt } = require('crypto');
const http = require('http');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 5000;

let lobbies = [];

const server = http.createServer();
const io = new Server(server, 
{
    cors: 
    {
        origin: "http://localhost:3000"
    }
});

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
        return getLobby().players[0].id === socket.id;
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
            lobby.players[0].onTurn = true;
            
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

    function pictureDataRequested(socketId)
    {
        otherEmit('pictureDataRequested', socketId);
    }

    function pictureDataSent(data)
    {
        if(isAdmin())
        {
            io.to(data.socketId).emit('pictureDataSent', data.pictureData);
        }
    }

    function messageSent(message)
    {
        console.log('Message recieved: ' + message);
        otherEmit('messageSent', message);
    }

    function join(data)
    {
        let lobby = lobbies.find(l => l.id === data.lobbyId)
        if(!lobby)
        {
            lobby = {id: socket.id.substr(0, 16), inGame: false, players: [], rounds: "5", time: "90", words: ['Kočka', 'Pes', 'Žirafa', 'Slon', 'Ptakopysk', 'Lemur'], currentWord: ""};
            lobbies.push(lobby);
        }

        let player = {id: socket.id, nickname: data.nickname, onTurn: false, ready: false};
        lobby.players.push(player);

        io.to(lobby.id).emit('playerJoined', player);
        io.to(socket.id).socketsJoin(lobby.id);
        io.to(socket.id).emit('join', lobby);
    }

    function ready()
    {
        let lobby = getLobby();
        let index = lobby.players.findIndex(p => p.id === socket.id);
        lobby.players[index].ready = true;

        if(lobby.players.every(p => p.ready))
        {
            nextTurn();
        }
    }

    function nextTurn()
    {
        let lobby = getLobby();
        let playerIndex = randomInt(0, lobby.players.length);
        let wordIndex = randomInt(0, lobby.words.length);
        lobby.players[playerIndex].onTurn = true;
        lobby.currentWord = lobby.words[wordIndex];
        console.log('--------------\nOn turn: ' + lobby.players[playerIndex].nickname + '\nWith word: ' + lobby.currentWord);
        roomEmit('newPlayerOnTurn', [playerIndex, wordIndex]);
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
            let lobbyIndex = lobbies.indexOf(lobby);
            lobbies.splice(lobbyIndex, 1);
        }
        otherEmit('playerDisconnecting', socket.id);
    }

    socket.on('roundsChanged', roundsChanged);
    socket.on('timeChanged', timeChanged);
    socket.on('wordsChanged', wordsChanged);
    socket.on('joinGame', joinGame);
    socket.on('draw', draw);
    socket.on('startDrawing', startDrawing);
    socket.on('pictureDataRequested', pictureDataRequested);
    socket.on('pictureDataSent', pictureDataSent);
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
