import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Home from './Views/Home/Home';
import Lobby from './Views/Lobby/Lobby';

function App() 
{
  const [state, setState] = useState('home'); //home, lobby, game
  const [socket, setSocket] = useState(null);
  const [lobby, setLobby] = useState();

  useEffect(() => 
  {
    const newSocket = io();
    setSocket(newSocket);
    return () => newSocket.close();
  }, [setSocket]);

  return (
    <div className="App">
      {state === 'home' && socket && <Home setAppState={setState} socket={socket} setLobby={setLobby}/>}
      {state === 'lobby' && lobby && <Lobby socket={socket} lobby={lobby}/>}
    </div>
  );
}

export default App;