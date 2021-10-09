import React, { useState } from 'react';
function Home({setAppView, socket, setLobby}) 
{
    const [nickname, setNickname] = useState("");

    function onSubmit(e)
    {
        e.preventDefault();

        const searchParams = new URLSearchParams(window.location.search);
        const lobbyId = searchParams.keys().next().value;

        console.log({nickname: nickname, lobbyId: lobbyId, socketId: socket.id});

        let options = 
        {
            method: 'POST',
            body: JSON.stringify({nickname: nickname, lobbyId: lobbyId, socketId: socket.id}),
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
            setAppView('lobby');
        })
        .catch(e =>
        {
            console.log(e);
        });
    }

    return (
        <div>
            <h1>Home</h1>
            <form onSubmit={onSubmit}>
                <input type="text" placeholder="Nickname" value={nickname} onChange={e => setNickname(e.target.value)}/>
                <button>Join Lobby</button>
            </form>
        </div>
    );
}

export default Home;
