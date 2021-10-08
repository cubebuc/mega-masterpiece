import React, { useEffect } from 'react';
import Player from './Player'

function Lobby({socket, lobby}) 
{
    useEffect(() => 
    {
        function userConnectedToLobby(nickname)
        {
            lobby.players.push(nickname);
        }

        console.log('on ' + lobby.id);
        socket.on(lobby.id + '/connect', userConnectedToLobby);
    }, [socket]);

    return (
        <div>
            <h1>Lobby</h1>
            {lobby.players.map((player, index) => <Player key={index} nickname={player}/>)}
        </div>
    );
}

export default Lobby;
