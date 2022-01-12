import React, { useEffect } from 'react';
import LobbyOptions from './LobbyOptions';
import './Lobby.scss'

function Lobby({setAppView, socket, lobby, setLobby, isAdmin}) 
{
    useEffect(() => 
    {
        function joinGame()
        {
            setAppView('game');
            socket.emit('ready');
        }

        socket.on('joinGame', joinGame);

        return () => socket.off('joinGame');
    }, [socket, setAppView])

    function onClick()
    {
        socket.emit('joinGame');
        setAppView('game');
        socket.emit('ready');
    }

    return (
        <div className='Lobby'>
            <h1>Lobby</h1>
            <strong>{window.location.protocol}//{window.location.host}/?{lobby.id}</strong>
            <div className='options-players'>
                <LobbyOptions socket={socket} lobby={lobby} setLobby={setLobby} isAdmin={isAdmin} />
                <div className='players'>
                    <label htmlFor='player-list'>Players</label>
                    <div className='player-list'>
                        {lobby.players.map((player, index) => <p key={index}>{player.nickname}</p>)}
                    </div>
                </div>
            </div>
            <button onClick={onClick} disabled={!isAdmin()}>Start</button>
        </div>
    );
}

export default Lobby;
