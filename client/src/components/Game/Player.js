function Player({player}) 
{
  return (
    <div className='Player' style={{backgroundColor: player.onTurn ? 'blue' : player.guessed ? 'green' : 'gray'}}>
        <p className='nickname'>{player.nickname}</p>
        <p className="points">{player.points}</p>
    </div>
  );
}

export default Player;
