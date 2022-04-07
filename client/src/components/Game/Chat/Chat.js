/** @module Chat */

import React, { useEffect, useState } from 'react'
import './Chat.scss'

function Chat({socket, lobby, setLobby}) 
{
    const [messages, setMessages] = useState([]);

    useEffect(() =>
    {
        /**
         * Adds the recieved message to the message array.
         * @function messageSent
         * @param {Object} message Object containing the message sender and the message's content.
         */
        function messageSent(message)
        {
            setMessages([...messages, message]);
        }

        /**
         * Set the player's points and shows who guessed the word.
         * @function playerGuessed
         * @param {Object} data Object containing the player's socket id and the amount of points recieved.
         */
        function playerGuessed(data)
        {
            let newLobby = JSON.parse(JSON.stringify(lobby));
            let index = newLobby.players.findIndex(player => player.id === data[0]);
            newLobby.players[index].guessed = true;
            newLobby.players[index].points += data[1];
            newLobby.players[index].pointsThisTurn = data[1];
            setLobby(newLobby);
            setMessages([...messages, {value: 'Player ' + lobby.players[index].nickname + ' guessed the word!', raw: ''}]);
        }

        /**
         * Writes out a message, that a word was nearly correct.
         * @function playerNearGuess
         * @param {string} word The word, which was close to the word being guessed.
         */
        function playerNearGuess(word)
        {
            setMessages([...messages, {value: '*' + word + '* was close!', raw: ''}]);
        }

        socket.on('messageSent', messageSent);
        socket.on('playerGuessed', playerGuessed);
        socket.on('playerNearGuess', playerNearGuess);

        return () =>
        {
            socket.off('messageSent', messageSent);
            socket.off('playerGuessed', playerGuessed);
            socket.off('playerNearGuess', playerNearGuess);
        }
    }, [socket, lobby, setLobby, messages]);

    /**
     * Sends the message, when the user presses Enter.
     * @function onKeyDown
     * @param {Event} e OnKeyDown event object.
     */
    function onKeyDown(e)
    {
        if(e.key === 'Enter')
        {
            let message = {value: lobby.players.find(p => p.id === socket.id).nickname + ': ' + e.target.value, raw: e.target.value};
            e.target.value = '';
            setMessages([...messages, message]);
            sendMessage(message);
        }
    }

    /**
     * Transmits the message to the server.
     * @function sendMessage
     * @param {Object} message Object containing the message sender and the message's content.
     */
    function sendMessage(message)
    {
        socket.emit('messageSent', message);
    }
    
    return (
        <div className='Chat'>
            <div className='messages' >
                {messages.map((message, index) => <p className='message' key={index}>{message.value}</p>)}
            </div>
            <input type='text' onKeyDown={onKeyDown} maxLength={40} />
        </div>
    );
}

export default Chat
