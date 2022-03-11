/** @module App */

import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Home from '../Home/Home';
import Lobby from '../Lobby/Lobby';
import Game from '../Game/Game'
import './App.scss'

function App() 
{
    const [appView, setAppView] = useState('home'); //home, lobby, game
    const [socket, setSocket] = useState();
    const [lobby, setLobby] = useState();

    useEffect(() => 
    {
        const newSocket = io();
        setSocket(newSocket);

        return () => 
        {
            newSocket.close();
        }
    }, [setSocket]);

    useEffect(() =>
    {
        /**
         * Adds the newly joined player to the lobby.
         * @function playerJoined
         * @param {Object} player Object containing the player's data.
         */
        function playerJoined(player)
        {
            let newLobby = JSON.parse(JSON.stringify(lobby));
            newLobby.players.push(player);
            setLobby(newLobby);
        }

        /**
         * Removes the disconnected player from the lobby.
         * @function playerDisconnected
         * @param {string} id Id of the player, that disconnected.
         */
        function playerDisconnected(id)
        {
            let newLobby = JSON.parse(JSON.stringify(lobby));
            let index = newLobby.players.findIndex(player => player.id === id);
            newLobby.players.splice(index, 1);
            setLobby(newLobby);
        }

        if(socket)
        {
            socket.on('playerJoined', playerJoined);
            socket.on('playerDisconnected', playerDisconnected);
        }

        return () => 
        {
            if(socket)
            {
                socket.off('playerJoined', playerJoined);
                socket.off('playerDisconnected', playerDisconnected);
            }
        }
    }, [socket, lobby, setLobby]);

    /**
     * Returns whether this socket is an admin.
     * @function isAdmin
     * @returns {boolean} Whether this socket is an admin.
     */
    function isAdmin()
    {
        return socket.id === lobby.players[0].id;
    }

    /**
     * Returns whether this socket is on turn.
     * @function isOnTurn
     * @returns {boolean} Whether this socket is on turn.
     */
    function isOnTurn()
    {
        return lobby.players.find(p => socket.id === p.id).onTurn;
    }

    return (
        <div className='App'>
            {appView === 'home' && socket && <Home setAppView={setAppView} socket={socket} setLobby={setLobby} />}
            {appView === 'lobby' && lobby && <Lobby setAppView={setAppView} socket={socket} lobby={lobby} setLobby={setLobby} isAdmin={isAdmin} />}
            {appView === 'game' && <Game socket={socket} lobby={lobby} setLobby={setLobby} isAdmin={isAdmin} isOnTurn={isOnTurn} />}
        </div>
    );
}

export default App;
