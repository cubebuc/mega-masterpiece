import React, { useEffect, useState } from 'react';

function Home({setAppState, socket}) 
{
    const [nickname, setNickname] = useState("");

    useEffect(() => 
    {
        function test(value)
        {
            console.log(value);
        }

        socket.on('test', test);
    }, [socket])

    function onClick()
    {
        setAppState('lobby');

        const searchParams = new URLSearchParams(window.location.search);
        const lobbyId = searchParams.keys().next().value;

        let options = 
        {
            method: 'POST',
            body: JSON.stringify({player: nickname, id: lobbyId}),
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
            console.log(data);
        });
    }

    return (
        <div>
            <h1>Home</h1>
            <input type="text" placeholder="Nickname" value={nickname} onChange={e => setNickname(e.target.value)}/>
            <button onClick={onClick}>Create Lobby</button>
        </div>
    );
}

export default Home;
