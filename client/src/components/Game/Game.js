import React, { useEffect, useRef, useState } from 'react';
import PlayerList from '../PlayerList';
import Chat from './Chat/Chat';
import DrawingOptions from './Options/DrawingOptions';
import './Game.scss'

function Game({socket, lobby, setLobby, isAdmin, isOnTurn}) 
{
    const [currentWordLength, setCurrentWordLength] = useState(0);
    const [overlayContent, setOverlayContent] = useState('');
    const [overlayActive, setOverlayActive] = useState('');
    const [time, setTime] = useState('Time: X');
    const [word, setWord] = useState('');
    const [rounds, setRounds] = useState('Rounds: X/X');

    const [drawColor, setDrawColor] = useState('#000000');
    const [drawMode, setDrawMode] = useState('brush');
    const [drawWidth, setDrawWidth] = useState(15);

    const canvasRef = useRef(null);
    const contextRef = useRef(null);

    useEffect(() =>
    {
        const context = canvasRef.current.getContext('2d');
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.strokeStyle = drawColor;
        context.lineWidth = drawWidth;
        contextRef.current = context;
        contextRef.current.beginPath();

        function pictureDataRequested(socketId)
        {
            if(isAdmin())
            {
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

        function thisPlayerOnTurn(word)
        {
            lobby.players.find(p => p.id === socket.id).onTurn = true;
            lobby.currentWord = word;

            setWord(word);
            setOverlayContent(<p>YOU WILL BE DRAWING<br/>{word}</p>);
            setOverlayActive(' active');
            setTimeout(() => {
                setOverlayActive('');
            }, 6000);

            console.log('--------------\nOn turn: THIS PLAYER\nWith word: ' + word);
        }

        function otherPlayerOnTurn(data)
        {
            lobby.players[data[0]].onTurn = true;
            setCurrentWordLength(data[1]);

            setWord(Array(data[1] + 1).join('_ '));
            setOverlayContent(<p>NEXT WILL BE DRAWING<br/>{lobby.players[data[0]].nickname}</p>);
            setOverlayActive(' active');
            setTimeout(() => {
                setOverlayActive('');
            }, 6000);

            console.log('--------------\nOn turn: ' + lobby.players[data[0]].nickname + '\nWith word length: ' + data[1]);
        }

        socket.emit('pictureDataRequested', socket.id);

        socket.on('startDrawing', startDrawing);
        socket.on('draw', draw);
        socket.on('pictureDataRequested', pictureDataRequested);
        socket.on('pictureDataSent', pictureDataSent);
        socket.on('thisPlayerOnTurn', thisPlayerOnTurn);
        socket.on('otherPlayerOnTurn', otherPlayerOnTurn);

        return () =>
        {
            socket.off('startDrawing', startDrawing);
            socket.off('draw', draw);
            socket.off('pictureDataRequested', pictureDataRequested);
            socket.off('pictureDataSent', pictureDataSent);
            socket.off('thisPlayerOnTurn', thisPlayerOnTurn);
            socket.off('otherPlayerOnTurn', otherPlayerOnTurn);
        }
    }, [socket, lobby, isAdmin, currentWordLength, drawColor, drawMode, drawWidth]);

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
        const x = e.clientX - e.target.offsetLeft;
        const y = e.clientY - e.target.offsetTop;
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
                    <p>{time}</p>
                </div>
                <div className='word'>
                    <p>{word}</p>
                </div>
                <div className='rounds'>
                    <p>{rounds}</p>
                </div>
            </div>
            <div className='players-game-chat'>
                <PlayerList socket={socket} lobby={lobby} setLobby={setLobby} />
                <div className='canvas'>
                    <div className={'overlay' + overlayActive}>
                        {overlayContent}
                    </div>
                    <canvas width='800' height='600' style={{backgroundColor: 'lightgray'}} ref={canvasRef} onMouseDown={onMouseDown} onMouseUp={onMouseUp} onMouseMove={onMouseMove} />
                </div>
                <Chat socket={socket} lobby={lobby} />
            </div>
            <DrawingOptions drawColor={drawColor} setDrawColor={setDrawColor} setDrawMode={setDrawMode} setDrawWidth={setDrawWidth} />
        </div>
    );
}

export default Game;
