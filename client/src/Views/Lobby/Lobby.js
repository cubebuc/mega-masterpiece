import React, { useEffect } from 'react';
import Options from './Options';
import PlayerList from '../PlayerList';

function Lobby({setAppView, socket, lobby, setLobby, isAdmin}) 
{
    useEffect(() => 
    {
        function start()
        {
            setAppView('game');
        }

        socket.on('start', start);

        return () => socket.off('start');
    }, [socket, setAppView])

    

    function onClick()
    {
        setAppView('game');
        socket.emit('start');
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
