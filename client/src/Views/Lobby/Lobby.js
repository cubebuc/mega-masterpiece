import React from 'react';
import Options from './Options';
import PlayerList from './PlayerList';

function Lobby({setAppView, socket, lobby, setLobby}) 
{
    function isAdmin()
    {
        return socket.id === lobby.players[0].id;
    }

    function onClick()
    {
        setAppView('game');
    }

    return (
        <div>
            <h1>Lobby</h1>
            <strong>{window.location.protocol}//{window.location.host}/?{lobby.id}</strong>
            <Options socket={socket} lobby={lobby} isAdmin={isAdmin} />
            <PlayerList socket={socket} lobby={lobby} setLobby={setLobby} />
            <button onClick={onClick} disabled={!isAdmin()}>Start</button>
        </div>
    );
}

export default Lobby;
