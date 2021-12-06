import React, { useEffect, useState } from 'react'
import './Chat.scss'

function Chat({socket}) 
{
    const [messages, setMessages] = useState([]);

    useEffect(() =>
    {
        function messageSent(message)
        {
            console.log(message);
            setMessages([...messages, message]);
        }

        socket.on('messageSent', messageSent);

        return () =>
        {
            socket.off('messageSent', messageSent);
        }
    }, [socket]);

    function onKeyDown(e)
    {
        if(e.key === 'Enter')
        {
            let message = e.target.value;
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
                {messages.map((message, index) => <p className='message' key={index}>{message}</p>)}
            </div>
            <input type="text" onKeyDown={onKeyDown}/>
        </div>
    );
}

export default Chat
