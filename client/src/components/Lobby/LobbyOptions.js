/** @module LobbyOptions */

import React, { useEffect } from 'react';

function LobbyOptions({socket, lobby, setLobby, isAdmin}) 
{    
    useEffect(() => 
    {
        /**
         * Sets the new round count.
         * @function roundsChanged
         * @param {number} rounds Number of rounds for the game.
         */
        function roundsChanged(rounds)
        {
            setRounds(rounds);
        }

        /**
         * Sets the new time in a turn.
         * @function timeChanged
         * @param {number} time Amount of time in a turn.
         */
        function timeChanged(time)
        {
            setTime(time);
        }

        /**
         * Sets the new word array.
         * @function wordsChanged
         * @param {string[]} words Array of the words for the game.
         */
        function wordsChanged(words)
        {
            setWords(words);
        }

        socket.on('roundsChanged', roundsChanged);
        socket.on('timeChanged', timeChanged);
        socket.on('wordsChanged', wordsChanged);

        return () =>
        {
            socket.off('roundsChanged', roundsChanged);
            socket.off('timeChanged', timeChanged);
            socket.off('wordsChanged', wordsChanged);
        }
    }, [socket, lobby]);

    /**
     * Transmits the round count change if this socket is an admin.
     * @function onRoundsSelectChange
     * @param {Event} e Select change event.
     */
    function onRoundsSelectChange(e)
    {
        if(isAdmin())
        {
            let newRounds = e.target.value;
            setRounds(newRounds);

            socket.emit('roundsChanged', newRounds);
        }
    }

    /**
     * Transmits the time amount change if this socket is an admin.
     * @function onTimeSelectChange
     * @param {Event} e Select change event.
     */
    function onTimeSelectChange(e)
    {
        if(isAdmin())
        {
            let newTime = e.target.value;
            setTime(newTime);

            socket.emit('timeChanged', newTime);
        }
    }

    /**
     * Transmits the word array change if this socket is and admin.
     * @function onWordsTextAreaChange
     * @param {Event} e Text area change event.
     */
    function onWordsTextAreaChange(e)
    {
        if(isAdmin())
        {
            let newWords = (e.target.value).split(',');
            setWords(newWords);

            socket.emit('wordsChanged', newWords);
        }
    }

    /**
     * Sets the rounds for the game.
     * @function setRounds
     * @param {number} rounds Number of rounds for the game.
     */
    function setRounds(rounds)
    {
        let newLobby = JSON.parse(JSON.stringify(lobby));
        newLobby.rounds = rounds;
        setLobby(newLobby);
    }

    /**
     * Sets the time in a round.
     * @function setTime
     * @param {number} time Amount of time in a turn.
     */
    function setTime(time)
    {
        let newLobby = JSON.parse(JSON.stringify(lobby));
        newLobby.time = time;
        setLobby(newLobby);
    }

    /**
     * Sets the word array for the game.
     * @function setWords
     * @param {string[]} words Word array.
     */
    function setWords(words)
    {
        let newLobby = JSON.parse(JSON.stringify(lobby));
        newLobby.words = words;
        setLobby(newLobby);
    }

    return (
        <div className="LobbyOptions">
            <label htmlFor="rounds">Rounds</label>
            <select className="rounds" name="rounds" disabled={!isAdmin()} value={lobby.rounds} onChange={onRoundsSelectChange}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5" defaultValue>5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
            </select>
            <label htmlFor="time">Drawing time (seconds)</label>
            <select className="time" name="time" disabled={!isAdmin()} value={lobby.time} onChange={onTimeSelectChange}>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
                <option value="40">40</option>
                <option value="50">50</option>
                <option value="60">60</option>
                <option value="70">70</option>
                <option value="80">80</option>
                <option value="90" defaultValue>90</option>
                <option value="100">100</option>
                <option value="110">110</option>
                <option value="120">120</option>
                <option value="130">130</option>
                <option value="140">140</option>
                <option value="150">150</option>
                <option value="160">160</option>
                <option value="170">170</option>
                <option value="180">180</option>
            </select>
            <label htmlFor="words">Words</label>
            <textarea className="words" value={lobby.words.join(',')} onChange={onWordsTextAreaChange} disabled={!isAdmin()}></textarea>
        </div>
    )
}

export default LobbyOptions;
