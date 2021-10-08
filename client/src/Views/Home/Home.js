import React, { useState } from 'react';

function Home({setAppState, setLobby}) 
{
    const [nickname, setNickname] = useState("");

    function onSubmit(e)
    {
        e.preventDefault();

        const searchParams = new URLSearchParams(window.location.search);
        const lobbyId = searchParams.keys().next().value;

        let options = 
        {
            method: 'POST',
            body: JSON.stringify({nickname: nickname, id: lobbyId}),
            headers: 
            {
              'Content-Type': 'application/json'
            }
        }
        
        fetch('/join', options)
        .then(res =>
        {
            return res.json();
        })
        .then(data =>
        {
            setLobby(data);
            setAppState('lobby');
        });
    }

    return (
        <div>
            <h1>Home</h1>
            <form onSubmit={onSubmit}>
                <input type="text" placeholder="Nickname" value={nickname} onChange={e => setNickname(e.target.value)}/>
                <button>Create Lobby</button>
            </form>
        </div>
    );
}

export default Home;
