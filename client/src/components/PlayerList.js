import React, { useEffect } from 'react';
import Player from './Player'

function PlayerList({socket, lobby, setLobby}) 
{
    useEffect(() => 
    {
        function playerJoined(player)
        {
            let newLobby = JSON.parse(JSON.stringify(lobby));
            newLobby.players.push(player);
            setLobby(newLobby);
        }

        socket.on('playerJoined', playerJoined);

        return () =>
        {
            socket.off('playerJoined', playerJoined);
        }
    }, [socket, lobby, setLobby]);

    return (
        <div className="PlayerList">
            {lobby.players.map((player, index) => <Player key={index} nickname={player.nickname}/>)}
        </div>
    )
}

export default PlayerList;
