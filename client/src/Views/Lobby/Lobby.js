import React, { useEffect, useState } from 'react';
import Player from './Player'

function Lobby({socket, lobby, setLobby}) 
{
    const [words, setWords] = useState(lobby.words);

    useEffect(() => 
    {
        function userConnectedToLobby(nickname)
        {
            let newLobby = JSON.parse(JSON.stringify(lobby));
            newLobby.players.push(nickname);
            setLobby(newLobby);
        }

        socket.on(lobby.id + '/connect', userConnectedToLobby);

        return () =>
        {
            socket.off(lobby.id + '/connect', userConnectedToLobby);
        }
    });

    useEffect(() => 
    {
        console.log(lobby.players);
    }, [lobby])

    return (
        <div>
            <h1>Lobby</h1>
            <strong>{window.location.protocol}//{window.location.host}/?{lobby.id}</strong>
            {lobby.players.map((player, index) => <Player key={index} nickname={player}/>)}
            <textarea cols="50" rows="10" style={{resize: 'none'}} value={words.join(',')} onChange={e => setWords((e.target.value).split(','))}></textarea>
        </div>
    );
}

export default Lobby;
