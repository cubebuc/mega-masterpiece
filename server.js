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
        let lobby = lobbies.find(l => l.id == data.lobbyId)
        if(!lobby)
        {
            lobby = {id: socket.id.substr(0, 16), inGame: false, players: [], rounds: "5", time: "90", words: ['Kočka', 'Pes', 'Žirafa', 'Slon', 'Ptakopysk', 'Lemur']};
            lobbies.push(lobby);
        }

        let player = {id: socket.id, nickname: data.nickname};
        lobby.players.push(player);

        io.to(lobby.id).emit('playerJoined', player);
        io.to(socket.id).socketsJoin(lobby.id);
        io.to(socket.id).emit('join', lobby);
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

    function start()
    {
        if(isAdmin())
        {
            getLobby().inGame = true;
            roomEmit('start');
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
    
    function disconnecting()
    {
        console.log(getLobby());
        let index = getLobby().players.findIndex(p => p.id === socket.id);
        getLobby().players.splice(index, 1);
        roomEmit('playerDisconnecting', socket.id);
    }

    socket.on('join', join);
    socket.on('roundsChanged', roundsChanged);
    socket.on('timeChanged', timeChanged);
    socket.on('wordsChanged', wordsChanged);
    socket.on('start', start);
    socket.on('draw', draw);
    socket.on('startDrawing', startDrawing);
    socket.on('disconnecting', disconnecting);
});

server.listen(PORT, () =>
{
    console.log('Listening on port ' + PORT);
});
