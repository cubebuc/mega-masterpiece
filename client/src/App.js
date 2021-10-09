import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Home from './Views/Home/Home';
import Lobby from './Views/Lobby/Lobby';
import Game from './Views/Game/Game'

function App() 
{
  const [appView, setAppView] = useState('home'); //home, lobby, game
  const [socket, setSocket] = useState();
  const [lobby, setLobby] = useState();

  useEffect(() => 
  {
    const newSocket = io();
    setSocket(newSocket);

    return () => 
    {
      newSocket.close();
    }
  }, [setSocket]);

  useEffect(() =>
  {
    function playerDisconnecting(id)
    {
      let newLobby = JSON.parse(JSON.stringify(lobby));
      let index = newLobby.players.findIndex(player => player.id === id);
      newLobby.players.splice(index, 1);
      setLobby(newLobby);
    }

    if(socket)
      socket.on('playerDisconnecting', playerDisconnecting);

    return () => 
    {
      if(socket)
        socket.off('playerDisconnecting', playerDisconnecting);
    }
  }, [socket, lobby]);

  return (
    <div className="App">
      {appView === 'home' && socket && <Home setAppView={setAppView} socket={socket} setLobby={setLobby} />}
      {appView === 'lobby' && lobby && <Lobby setAppView={setAppView} socket={socket} lobby={lobby} setLobby={setLobby} />}
      {appView === 'game' && <Game socket={socket} lobby={lobby}/>}
    </div>
  );
}

export default App;