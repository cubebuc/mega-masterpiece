import React, { useEffect } from 'react';
import Options from './Options';
import PlayerList from '../PlayerList';
import './Lobby.scss'

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
        <div className="Lobby">
            <h1>Lobby</h1>
            <strong>{window.location.protocol}//{window.location.host}/?{lobby.id}</strong>
            <div className="options-players">
                <Options socket={socket} lobby={lobby} isAdmin={isAdmin} />
                <div className="players">
                    <label htmlFor="player-list">Players</label>
                    <PlayerList id="player-list" socket={socket} lobby={lobby} setLobby={setLobby} />
                </div>
            </div>
            <button onClick={onClick} disabled={!isAdmin()}>Start</button>
        </div>
    );
}

export default Lobby;
