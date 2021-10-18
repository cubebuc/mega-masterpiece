import React, { useState, useEffect } from 'react';

function Options({socket, lobby, isAdmin}) 
{
    const [rounds, setRounds] = useState(lobby.rounds);
    const [time, setTime] = useState(lobby.time);
    const [words, setWords] = useState(lobby.words);
    
    useEffect(() => 
    {
        function roundsChanged(rounds)
        {
            setRounds(rounds);
        }

        function timeChanged(time)
        {
            setTime(time);
        }

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
    }, [socket]);

    function onRoundsSelectChange(e)
    {
        let newRounds = e.target.value;
        setRounds(newRounds);
        socket.emit('roundsChanged', newRounds);
    }

    function onTimeSelectChange(e)
    {
        let newTime = e.target.value;
        setTime(newTime);
        socket.emit('timeChanged', newTime);
    }

    function onWordsTextAreaChange(e)
    {
        let newWords = (e.target.value).split(',');
        setWords(newWords);
        socket.emit('wordsChanged', newWords);
    }

    return (
        <div className="Options">
            <label htmlFor="rounds">Rounds</label>
            <select className="rounds" name="rounds" disabled={!isAdmin()} value={rounds} onChange={onRoundsSelectChange}>
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
            <select className="time" name="time" disabled={!isAdmin()} value={time} onChange={onTimeSelectChange}>
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
            <textarea className="words" value={words.join(',')} onChange={onWordsTextAreaChange} disabled={!isAdmin()}></textarea>
        </div>
    )
}

export default Options;
