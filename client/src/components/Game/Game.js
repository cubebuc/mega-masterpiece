import React, { useEffect, useRef } from 'react';
import PlayerList from '../PlayerList';
import './Game.scss'

function Game({socket, lobby, setLobby, isAdmin}) 
{
    const canvasRef = useRef(null);
    const contextRef = useRef(null);

    useEffect(() =>
    {
        const context = canvasRef.current.getContext('2d');
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.strokeStyle = 'black';
        context.lineWidth = 15;
        contextRef.current = context;

        socket.on('startDrawing', startDrawing);
        socket.on('draw', draw);

        return () =>
        {
            socket.off('startDrawing', startDrawing);
            socket.off('draw', draw);
        }
    }, [socket]);

    function onMouseDown(e)
    {
        if(e.buttons !== 1 || !isAdmin())
            return;

        const x = e.clientX - e.target.offsetLeft;
        const y = e.clientY - e.target.offsetTop;
        let pos = {x: x, y: y};
        startDrawing(pos);

        socket.emit('startDrawing', pos);
    }

    function onMouseMove(e)
    {
        if(e.buttons !== 1 || !isAdmin())
            return;

        const x = e.clientX - e.target.offsetLeft;
        const y = e.clientY - e.target.offsetTop;
        let pos = {x: x, y: y};
        draw(pos);

        socket.emit('draw', pos);
    }

    function startDrawing(pos)
    {
        contextRef.current.beginPath();
        contextRef.current.moveTo(pos.x, pos.y);
        draw(pos);
    }

    function draw(pos)
    {
        contextRef.current.lineTo(pos.x, pos.y);
        contextRef.current.stroke();
    }

    return (
        <div className="Game">
            <h1>Game</h1>
            <div className="info">
                <div className="time">
                    <p>Time</p>
                </div>
                <div className="word">
                    <p>Current Word</p>
                </div>
                <div className="rounds">
                    <p>Round X of X</p>
                </div>
            </div>
            <div className="players-game-chat">
                <PlayerList socket={socket} lobby={lobby} setLobby={setLobby} />
                <canvas width="1000" height="1000" style={{backgroundColor: 'lightgray'}} ref={canvasRef} onMouseDown={onMouseDown} onMouseMove={onMouseMove} />
                <div className="chat">
                    
                </div>
            </div>
            <div className="drawing-options">
                    <div className="current-color">

                    </div>
                    <div className="colors">

                    </div>
                    <div className="drawing-modes">

                    </div>
                    <div className="brush-size">

                    </div>
                    <div className="clear-canvas">

                    </div>
            </div>
        </div>
    )
}

export default Game;
