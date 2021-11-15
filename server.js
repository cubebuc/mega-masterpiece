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
    function roomEmit(event, args)
    {
        if(args === undefined)
            io.to(getLobbyRoom()).except(socket.id).emit(event);
        else
            io.to(getLobbyRoom()).except(socket.id).emit(event, args);
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
        return lobbies.some(l => l.players[0].id === socket.id);
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
            io.to(getLobbyRoom()).emit('ready');
        }
    }

    function roundsChanged(rounds)
    {
        if(isAdmin())
        {
            getLobby().rounds = rounds;
            roomEmit('roundsChanged', rounds);
        }
    }

    function timeChanged(time)
    {
        if(isAdmin())
        {
            getLobby().time = time;
            roomEmit('timeChanged', time);
        }
    }

    function wordsChanged(words)
    {
        if(isAdmin())
        {
            getLobby().words = words;
            roomEmit('wordsChanged', words);
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

            roomEmit('joinGame');
        }
    }

    function startDrawing(pos)
    {
        if(isAdmin())
        {
            roomEmit('startDrawing', pos);
        }
    }

    function draw(pos)
    {
        if(isAdmin())
        {
            roomEmit('draw', pos);
        }
    }

    function pictureDataRequested(socketId)
    {
        roomEmit('pictureDataRequested', socketId);
    }

    function pictureDataSent(data)
    {
        if(isAdmin())
        {
            io.to(data.socketId).emit('pictureDataSent', data.pictureData);
        }
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
        roomEmit('playerDisconnecting', socket.id);
    }

    socket.on('join', join);
    socket.on('ready', ready);
    socket.on('roundsChanged', roundsChanged);
    socket.on('timeChanged', timeChanged);
    socket.on('wordsChanged', wordsChanged);
    socket.on('joinGame', joinGame);
    socket.on('draw', draw);
    socket.on('startDrawing', startDrawing);
    socket.on('pictureDataRequested', pictureDataRequested);
    socket.on('pictureDataSent', pictureDataSent);
    socket.on('disconnecting', disconnecting);
});

server.listen(PORT, () =>
{
    console.log('Listening on port ' + PORT);
});
