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
    function getLobbyRoom()
    {
        return Array.from(socket.rooms)[1];
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
            lobby = {id: socket.id.substr(0, 16), players: [], rounds: "5", time: "90", words: ['Kočka', 'Pes', 'Žirafa', 'Slon', 'Ptakopysk', 'Lemur']};
        }

        let player = {id: socket.id, nickname: data.nickname};
        lobby.players.push(player);
        lobbies.push(lobby);

        io.to(lobby.id).emit('playerJoined', player);
        io.to(socket.id).socketsJoin(lobby.id);
        io.to(socket.id).emit('join', lobby);
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

    function start()
    {
        if(isAdmin())
            io.to(getLobbyRoom()).except(socket.id).emit('start');
    }

    function startDrawing(pos)
    {
        if(isAdmin())
            io.to(getLobbyRoom()).except(socket.id).emit('startDrawing', pos);
    }

    function draw(pos)
    {
        if(isAdmin())
            io.to(getLobbyRoom()).except(socket.id).emit('draw', pos);
    }
    
    function disconnecting()
    {
        io.to(getLobbyRoom()).except(socket.id).emit('playerDisconnecting', socket.id);
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