/** @module Home */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import './Home.scss'

function Home({setAppView, socket, setLobby}) 
{
    const [nickname, setNickname] = useState('');
    const navigate = useNavigate();

    useEffect(() => 
    {
        /**
         * Sets the lobby recieved from the server and switches the view.
         * @function join
         * @param {Object} lobby Lobby object.
         */
        function join(lobby)
        {
            setLobby(JSON.parse(lobby));
            if(JSON.parse(lobby).inGame)
            {
                setAppView('game');
            }
            else
            {
                const params = new URLSearchParams();
                params.append(lobby.id);
                navigate.push({search: params.toString()});
                setAppView('lobby');
            }    
        }

        socket.on('join', join);

        return () => socket.off('join', join);
    }, [setAppView, socket, setLobby]);
    
    /**
     * Sends join request to the server.
     * @function onSubmit
     * @param {Event} e Form submit event.
     */
    function onSubmit(e)
    {
        e.preventDefault();

        const searchParams = new URLSearchParams(window.location.search);
        const lobbyId = searchParams.keys().next().value;

        let data = {nickname: nickname, lobbyId: lobbyId}
        socket.emit('join', data);
    }

    return (
        <div className='Home'>
            <h1>Home</h1>
            <form onSubmit={onSubmit}>
                <input type='text' placeholder='Nickname' value={nickname} onChange={e => setNickname(e.target.value)} required />
                <button>Join Lobby</button>
            </form>
        </div>
    );
}

export default Home;
