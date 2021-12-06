import React, { useEffect, useRef } from 'react';
import PlayerList from '../PlayerList';
import './Game.scss'

function Game({socket, lobby, setLobby, isAdmin, isOnTurn}) 
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

        function pictureDataRequested(socketId)
        {
            if(isAdmin())
            {
                console.log(canvasRef.current.width, canvasRef.current.height);
                let bufferT = contextRef.current.getImageData(0, 0, 800, 300).data.buffer;
                let bufferB = contextRef.current.getImageData(0, 300, 800, 300).data.buffer;
                let arrayT = new Uint8ClampedArray(bufferT);
                let arrayB = new Uint8ClampedArray(bufferB);
                let array = [arrayT, arrayB];
                let data = {socketId: socketId, pictureData: array};
                socket.emit('pictureDataSent', data);
            }
        }

        function pictureDataSent(data)
        {
            let arrayT = new Uint8ClampedArray(data[0]);
            let arrayB = new Uint8ClampedArray(data[1]);
            let imageT = new ImageData(arrayT, 800, 300);
            let imageB = new ImageData(arrayB, 800, 300);
            contextRef.current.putImageData(imageT, 0, 0);
            contextRef.current.putImageData(imageB, 0, 300);
        }

        function allReady()
        {
            socket.emit('initGame');
        }

        function newPlayerOnTurn(index)
        {
            lobby.players[index].onTurn = true;
            console.log('On turn: ' + lobby.players[index].nickname);
        }

        socket.emit('pictureDataRequested', socket.id);

        socket.on('startDrawing', startDrawing);
        socket.on('draw', draw);
        socket.on('pictureDataRequested', pictureDataRequested);
        socket.on('pictureDataSent', pictureDataSent);
        socket.on('allReady', allReady);
        socket.on('newPlayerOnTurn', newPlayerOnTurn);

        return () =>
        {
            socket.off('startDrawing', startDrawing);
            socket.off('draw', draw);
            socket.off('pictureDataRequested', pictureDataRequested);
            socket.off('pictureDataSent', pictureDataSent);
            socket.off('allReady', allReady);
        }
    }, [socket, isAdmin]);

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
                <canvas width="800" height="600" style={{backgroundColor: 'lightgray'}} ref={canvasRef} onMouseDown={onMouseDown} onMouseMove={onMouseMove} />
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
