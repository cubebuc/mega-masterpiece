/** @module Lobby */

import React, { useEffect, useState } from 'react';
import LobbyOptions from './LobbyOptions';
import './Lobby.scss'

function Lobby({setAppView, socket, lobby, setLobby, isAdmin}) 
{
    const [buttonDisabled, setButtonDisabled] = useState(false);

    useEffect(() => 
    {
        /**
         * Switches to the game view transmits to the server, that this socket is ready.
         * @function joinGame
         */
        function joinGame()
        {
            setAppView('game');
            socket.emit('ready');
        }

        socket.on('joinGame', joinGame);

        return () => socket.off('joinGame');
    }, [socket, setAppView])

    /**
     * Transmits to the server, that others can start joining the game.
     * Switches to the game view and transmits to the server, that this socket is ready.
     * @function onClick
     */
    function onClick()
    {
        setButtonDisabled(true);
        socket.emit('joinGame');
        setAppView('game');
        socket.emit('ready');
    }

    return (
        <div className='Lobby'>
            <h1>Lobby</h1>
            <strong>{window.location.protocol}//{window.location.host}/?id={lobby.id}</strong>
            <div className='options-players'>
                <LobbyOptions socket={socket} lobby={lobby} setLobby={setLobby} isAdmin={isAdmin} />
                <div className='players'>
                    <label htmlFor='player-list'>Players</label>
                    <div className='player-list'>
                        {lobby.players.map((player, index) => <p key={index}>{player.nickname}</p>)}
                    </div>
                </div>
            </div>
            <button onClick={onClick} disabled={!isAdmin() || buttonDisabled}>Start</button>
        </div>
    );
}

export default Lobby;
