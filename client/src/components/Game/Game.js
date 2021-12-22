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
        else if(drawMode === 'fill')
        {
            let imageData = contextRef.current.getImageData(0, 0, 800, 600);
            floodFill(imageData, pos.x, pos.y, hexToRgb(drawColor));
            contextRef.current.putImageData(imageData, 0, 0);

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
    
    function floodFill(imageData, x, y, color)
    {
        let basePixel = getPixel(imageData, x, y);
        if(colorsMatch(basePixel, getPixel(imageData, x, y - 1)))
        {
            setPixel(imageData, x, y - 1, color);
            floodFill(imageData, x, y - 1, color);
        }
        if(colorsMatch(basePixel, getPixel(imageData, x, y + 1)))
        {
            setPixel(imageData, x, y + 1, color);
            floodFill(imageData, x, y + 1, color);
        }
        if(colorsMatch(basePixel, getPixel(imageData, x - 1, y)))
        {
            setPixel(imageData, x - 1, y, color);
            floodFill(imageData, x - 1, y, color);
        }
        if(colorsMatch(basePixel, getPixel(imageData, x + 1, y)))
        {
            setPixel(imageData, x + 1, y, color);
            floodFill(imageData, x + 1, y, color);
        }
    }

    function getPixel(imageData, x, y)
    {
        if (x < 0 || y < 0 || x >= imageData.width || y >= imageData.height) 
        {
            return [-1, -1, -1, -1];
        }
        else
        {
            const offset = (y * imageData.width + x) * 4;
            return imageData.data.slice(offset, offset + 4);
        }
    }
    
    function setPixel(imageData, x, y, color) 
    {
        const offset = (y * imageData.width + x) * 4;
        imageData.data[offset] = color[0];
        imageData.data[offset + 1] = color[1];
        imageData.data[offset + 2] = color[2];
        imageData.data[offset + 3] = color[0];
    }
    
    function colorsMatch(a, b)
    {
        return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
    }

    function hexToRgb(hex) 
    {
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
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
