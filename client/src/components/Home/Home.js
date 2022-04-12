/** @module Home */

import React, { useEffect, useState } from 'react';
import './Home.scss'

function Home({setAppView, socket, setLobby}) 
{
    const [nickname, setNickname] = useState('');
    const [buttonDisabled, setButtonDisabled] = useState(false);
    
    useEffect(() => 
    {
        /**
         * Sets the lobby recieved from the server and switches the view.
         * @function join
         * @param {Object} lobby Lobby object.
         */
        function join(lobby)
        {
            let parsedLobby = JSON.parse(lobby);
            setLobby(parsedLobby);
            if(parsedLobby.inGame)
            {
                setAppView('game');
            }
            else
            {
                const url = new URL(window.location);
                url.searchParams.set('id', parsedLobby.id);
                window.history.replaceState({}, '', url);
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
        setButtonDisabled(true);
        e.preventDefault();

        const searchParams = new URLSearchParams(window.location.search);
        const lobbyId = searchParams.get('id');

        let data = {nickname: nickname, lobbyId: lobbyId}
        socket.emit('join', data);
    }

    return (
        <div className='Home'>
            <h1>Home</h1>
            <form onSubmit={onSubmit}>
                <input type='text' placeholder='Nickname' value={nickname} onChange={e => setNickname(e.target.value)} maxLength={16} required />
                <button disabled={buttonDisabled}>Join Lobby</button>
            </form>
            <div>
                <h2>How to play</h2>
                <ul>
                    <li><p>Join a friend's lobby by using his URL or create a new one by simply entering a name and joining.</p></li>
                    <li><p>As a lobby admin you can set the game options, others wait until you start the game.</p></li>
                    <li><p>If you are drawing, try your best to express the word with your Picasso skills.</p></li>
                    <li><p>If you are guessing, try to guess the word by typing in the chat.<br/>You can see the number of the letters shown by underscores above the drawing.</p></li>
                </ul>
            </div>
        </div>
    );
}

export default Home;
