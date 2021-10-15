import React, { useEffect, useState } from 'react';
function Home({setAppView, socket, setLobby}) 
{
    const [nickname, setNickname] = useState("");

    useEffect(() => 
    {
        function join(lobby)
        {
            setLobby(lobby);
            if(lobby.inGame)
                setAppView('game');
            else
                setAppView('lobby');
        }

        socket.on('join', join);

        return () => socket.off('join', join);
    }, [setAppView, socket, setLobby]);
    
    function onSubmit(e)
    {
        e.preventDefault();

        const searchParams = new URLSearchParams(window.location.search);
        const lobbyId = searchParams.keys().next().value;

        let data = {nickname: nickname, lobbyId: lobbyId}
        socket.emit('join', data);
    }

    return (
        <div className="home">
            <h1>Home</h1>
            <form onSubmit={onSubmit}>
                <input type="text" placeholder="Nickname" value={nickname} onChange={e => setNickname(e.target.value)} required />
                <button>Join Lobby</button>
            </form>
        </div>
    );
}

export default Home;
