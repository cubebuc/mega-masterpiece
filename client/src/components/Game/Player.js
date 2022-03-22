import React, { useEffect, useState } from 'react';

function Player({lobby, index}) 
{
    const [player, setPlayer] = useState(lobby.players[index]);

    useEffect(() =>
    {
        setPlayer(lobby.players[index]);
    }, [lobby, setPlayer, index])

    return (
        <div className='Player' style={{backgroundColor: player.onTurn ? '#6ed1ff' : player.guessed ? '#6eff8b' : 'gray'}}>
            <p className='nickname'>{player.nickname}</p>
            <p className="points">{player.points}</p>
        </div>
    );
}

export default Player;