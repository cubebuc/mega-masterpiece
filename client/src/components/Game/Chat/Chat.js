import React, { useEffect, useState } from 'react'
import './Chat.scss'

function Chat({socket, lobby}) 
{
    const [messages, setMessages] = useState([]);

    useEffect(() =>
    {
        function messageSent(message)
        {
            console.log(message);
            setMessages([...messages, message]);
        }

        function playerGuessed(socketId)
        {
            let player = lobby.players.find(p => p.id === socketId);
            console.log(player);
            player.guessed = true;
            setMessages([...messages, {sender: 'Player ' + player.nickname, value: 'guessed the word!'}]);
        }

        socket.on('messageSent', messageSent);
        socket.on('playerGuessed', playerGuessed);

        return () =>
        {
            socket.off('messageSent', messageSent);
        }
    }, [socket, lobby, messages]);

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
        console.log(message);
        socket.emit('messageSent', message);
    }

    return (
        <div className="Chat">
            <div className="messages">
                {messages.map((message, index) => <p className="message" key={index}>{message.sender}: {message.value}</p>)}
            </div>
            <input type="text" onKeyDown={onKeyDown}/>
        </div>
    );
}

export default Chat
