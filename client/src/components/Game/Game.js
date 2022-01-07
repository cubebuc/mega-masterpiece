import React, { useEffect, useRef, useState } from 'react';
import PlayerList from '../PlayerList';
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

        function pictureDataRequested(socketId)
        {
            if(isAdmin())
            {
                let bufferT = context.getImageData(0, 0, 800, 300).data.buffer;
                let bufferB = context.getImageData(0, 300, 800, 300).data.buffer;
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
            context.putImageData(imageT, 0, 0);
            context.putImageData(imageB, 0, 300);
        }

        function thisPlayerOnTurn(word)
        {
            startTurn();
            lobby.players.find(p => p.id === socket.id).onTurn = true;
            lobby.currentWord = word;

            setWord(word);
            setOverlayContent(<p>YOU WILL BE DRAWING<br/>{word}</p>);
        }

        function otherPlayerOnTurn(data)
        {
            startTurn();
            lobby.players[data[0]].onTurn = true;

            setWord(data[1]);
            setOverlayContent(<p>NEXT WILL BE DRAWING<br/>{lobby.players[data[0]].nickname}</p>);
        }

        function startTurn()
        {
            lobby.players.forEach(player => player.onTurn = false);
            lobby.players.forEach(player => player.guessed = false);

            timeCounter.current = -1;
            setTime(lobby.time);
            setRound(round + 1);
            setOverlayActive(' active');
            clearCanvas();

            setTimeout(() => {
                setOverlayActive('');
                timeCounter.current = lobby.time;
            }, 2000);
        }

        socket.emit('pictureDataRequested', socket.id);

        socket.on('startDrawing', startDrawing);
        socket.on('draw', draw);
        socket.on('colorChanged', colorChanged);
        socket.on('widthChanged', widthChanged);
        socket.on('clearCanvas', clearCanvas);
        socket.on('pictureDataRequested', pictureDataRequested);
        socket.on('pictureDataSent', pictureDataSent);
        socket.on('thisPlayerOnTurn', thisPlayerOnTurn);
        socket.on('otherPlayerOnTurn', otherPlayerOnTurn);

        return () =>
        {
            socket.off('startDrawing', startDrawing);
            socket.off('draw', draw);
            socket.off('colorChanged', colorChanged);
            socket.off('widthChanged', widthChanged);
            socket.off('clearCanvas', clearCanvas);
            socket.off('pictureDataRequested', pictureDataRequested);
            socket.off('pictureDataSent', pictureDataSent);
            socket.off('thisPlayerOnTurn', thisPlayerOnTurn);
            socket.off('otherPlayerOnTurn', otherPlayerOnTurn);
        }
    }, [socket, lobby, isAdmin, time, setTime, drawColor, drawMode, drawWidth]);

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
                <PlayerList socket={socket} lobby={lobby} setLobby={setLobby} />
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
