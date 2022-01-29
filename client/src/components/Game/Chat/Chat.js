import React, { useEffect, useState } from 'react'
import './Chat.scss'

function Chat({socket, lobby, setLobby}) 
{
    const [messages, setMessages] = useState([]);

    useEffect(() =>
    {
        function messageSent(message)
        {
            setMessages([...messages, message]);
        }

        function playerGuessed(socketId)
        {
            let newLobby = JSON.parse(JSON.stringify(lobby));
            let index = newLobby.players.findIndex(player => player.id === socketId);
            newLobby.players[index].guessed = true;
            setLobby(newLobby);
            setMessages([...messages, {sender: 'Player ' + lobby.players[index].nickname, value: 'guessed the word!'}]);
        }

        socket.on('messageSent', messageSent);
        socket.on('playerGuessed', playerGuessed);

        return () =>
        {
            socket.off('messageSent', messageSent);
            socket.off('playerGuessed', playerGuessed);
        }
    }, [socket, lobby, setLobby, messages]);

    function onKeyDown(e)
    {
        if(e.key === 'Enter')
        {
            let message = {sender: lobby.players.find(p => p.id === socket.id).nickname, value: e.target.value};
            e.target.value = '';
            setMessages([...messages, message]);
            sendMessage(message);
        }
    }

    function sendMessage(message)
    {
        socket.emit('messageSent', message);
    }

    return (
        <div className='Chat'>
            <div className='messages'>
                {messages.map((message, index) => <p className='message' key={index}>{message.sender}: {message.value}</p>)}
            </div>
            <input type='text' onKeyDown={onKeyDown}/>
        </div>
    );
}

export default Chat
