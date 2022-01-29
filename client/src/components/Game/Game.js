import React, { useEffect, useRef, useState } from 'react';
import Player from './Player'
import Chat from './Chat/Chat';
import DrawingOptions from './DrawingOptions/DrawingOptions';
import './Game.scss'

function Game({socket, lobby, setLobby, isAdmin, isOnTurn}) 
{
    const [overlayContent, setOverlayContent] = useState('');
    const [overlayActive, setOverlayActive] = useState('');
    const [time, setTime] = useState(lobby.time);
    const [word, setWord] = useState('');
    const [round, setRound] = useState(0);

    const [drawColor, setDrawColor] = useState('#000000');
    const [drawMode, setDrawMode] = useState('brush');
    const [drawWidth, setDrawWidth] = useState(15);

    const canvasRef = useRef(null);
    const contextRef = useRef(null);

    const timeCounter = useRef(-1);

    useEffect(() =>
    {
        socket.emit('turnDataRequested', socket.id);
        
        setInterval(() => {
            if(timeCounter.current >= 0)
            {
                setTime(timeCounter.current);
                timeCounter.current--;
            }
        }, 1000);
    }, []);

    useEffect(() =>
    {
        const context = canvasRef.current.getContext('2d');
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.strokeStyle = drawColor;
        context.lineWidth = drawWidth;
        context.beginPath();
        contextRef.current = context;

        function colorChanged(color)
        {
            setDrawColor(color);
        }

        function widthChanged(width)
        {
            setDrawWidth(width);
        }

        function clearCanvas()
        {
            context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }

        function turnDataRequested(socketId)
        {
            if(isAdmin())
            {
                let bufferT = context.getImageData(0, 0, 800, 300).data.buffer;
                let bufferB = context.getImageData(0, 300, 800, 300).data.buffer;
                let arrayT = new Uint8ClampedArray(bufferT);
                let arrayB = new Uint8ClampedArray(bufferB);
                let array = [arrayT, arrayB];
                let data = {socketId: socketId, timeCounter: timeCounter.current, pictureData: array};
                socket.emit('turnDataSent', data);
            }
        }

        function turnDataSent(data)
        {
            if(data.timeCounter != -1)
                setTime(data.timeCounter - 1);
            timeCounter.current = data.timeCounter - 1;

            let arrayT = new Uint8ClampedArray(data.pictureData[0]);
            let arrayB = new Uint8ClampedArray(data.pictureData[1]);
            let imageT = new ImageData(arrayT, 800, 300);
            let imageB = new ImageData(arrayB, 800, 300);
            context.putImageData(imageT, 0, 0);
            context.putImageData(imageB, 0, 300);
        }

        function newPlayerOnTurn(data)
        {
            let newLobby = JSON.parse(JSON.stringify(lobby));
            newLobby.players.forEach(player => player.onTurn = false);
            newLobby.players.forEach(player => player.guessed = false);
            newLobby.players[data[0]].onTurn = true;
            setLobby(newLobby);
            
            setWord(data[1]);

            if(data[0] == lobby.players.findIndex(player => player.id === socket.id))
            {
                setOverlayContent(<p>YOU WILL BE DRAWING<br/>{data[1]}</p>);
            }
            else
            {
                setOverlayContent(<p>NEXT WILL BE DRAWING<br/>{lobby.players[data[0]].nickname}</p>);
            }
            setOverlayActive(' active');
            
            timeCounter.current = -1;
            setTime(lobby.time);
            setRound(round + 1);
            clearCanvas();
        }

        function startTurn()
        {
            setOverlayActive('');
            timeCounter.current = lobby.time;
        }

        function endTurn()
        {
            
        }

        socket.on('startDrawing', startDrawing);
        socket.on('draw', draw);
        socket.on('colorChanged', colorChanged);
        socket.on('widthChanged', widthChanged);
        socket.on('clearCanvas', clearCanvas);
        socket.on('turnDataRequested', turnDataRequested);
        socket.on('turnDataSent', turnDataSent);
        socket.on('newPlayerOnTurn', newPlayerOnTurn);
        socket.on('startTurn', startTurn);
        socket.on('endTurn', endTurn);

        return () =>
        {
            socket.off('startDrawing', startDrawing);
            socket.off('draw', draw);
            socket.off('colorChanged', colorChanged);
            socket.off('widthChanged', widthChanged);
            socket.off('clearCanvas', clearCanvas);
            socket.off('turnDataRequested', turnDataRequested);
            socket.off('turnDataSent', turnDataSent);
            socket.off('newPlayerOnTurn', newPlayerOnTurn);
            socket.off('startTurn', startTurn);
            socket.off('endTurn', endTurn);
        }
    }, [socket, lobby, setLobby, isAdmin, time, setTime, drawColor, drawMode, drawWidth]);

    function onMouseDown(e)
    {
        if(e.buttons !== 1   || !isOnTurn())
            return;

        let pos = getMousePos(e);

        if(drawMode === 'brush')
        {
            startDrawing(pos);
            draw(pos);
    
            socket.emit('startDrawing', pos);
            socket.emit('draw', pos);
        }
        else if(drawMode === 'line')
        {
            startDrawing(pos);
    
            socket.emit('startDrawing', pos);
        }
    }

    function onMouseUp(e)
    {
        if(e.button !== 0 || !isOnTurn())
            return;

        let pos = getMousePos(e);

        if(drawMode === 'line')
        {
            draw(pos);
    
            socket.emit('draw', pos);
        }
    }

    function onMouseMove(e)
    {
        if(e.buttons !== 1 || !isOnTurn())
            return;

        let pos = getMousePos(e);

        if(drawMode === 'brush')
        {
            draw(pos);
    
            socket.emit('draw', pos);
        }
    }

    function getMousePos(e)
    {
        let rect = canvasRef.current.getBoundingClientRect();
        let borderLeft = getComputedStyle(canvasRef.current).borderLeftWidth;
        let borderTop = getComputedStyle(canvasRef.current).borderTopWidth;

        const x = e.clientX - rect.left - borderLeft.substring(0, borderLeft.length - 2);
        const y = e.clientY - rect.top - borderTop.substring(0, borderTop.length - 2);
        let pos = {x: x, y: y};

        return pos;
    }

    function startDrawing(pos)
    {
        contextRef.current.beginPath();
        contextRef.current.moveTo(pos.x, pos.y);
    }

    function draw(pos)
    {
        contextRef.current.lineTo(pos.x, pos.y);
        contextRef.current.stroke();
    }

    return (
        <div className='Game'>
            <h1>Game</h1>
            <div className='info'>
                <div className='time'>
                    <p>Time: {time}</p>
                </div>
                <div className='word'>
                    <p>{word}</p>
                </div>
                <div className='rounds'>
                    <p>Round: {round}/{lobby.rounds}</p>
                </div>
            </div>
            <div className='players-game-chat'>
                <div className='player-list'>
                    {lobby.players.map((_player, index) => <Player key={index} lobby={lobby} index={index}/>)}
                </div>
                <div className='canvas'>
                    <div className={'overlay' + overlayActive}>
                        {overlayContent}
                    </div>
                    <canvas width='800' height='600' ref={canvasRef} onMouseDown={onMouseDown} onMouseUp={onMouseUp} onMouseMove={onMouseMove} />
                </div>
                <Chat socket={socket} lobby={lobby} setLobby={setLobby} />
            </div>
            <DrawingOptions socket={socket} isOnTurn={isOnTurn} canvasRef={canvasRef} contextRef={contextRef} drawColor={drawColor} setDrawColor={setDrawColor} setDrawMode={setDrawMode} setDrawWidth={setDrawWidth} />
        </div>
    );
}

export default Game;
