import React from 'react';
import './DrawingOptions.scss'

function DrawingOptions({socket, isOnTurn, canvasRef, contextRef, drawColor, setDrawColor, setDrawMode, setDrawWidth}) 
{
    const colors = ['#ffffff', 
                    '#000000', 
                    '#b9b9b9', 
                    '#7d8180', 
                    '#e0222c', 
                    '#92000d', 
                    '#f98a21', 
                    '#f4620b', 
                    '#ffd011', 
                    '#f5bb00', 
                    '#63ba2d', 
                    '#267637', 
                    '#78cdf2', 
                    '#009ada', 
                    '#0060b4', 
                    '#022c78', 
                    '#8b159f', 
                    '#5b1577', 
                    '#df177a', 
                    '#ab1b7a', 
                    '#ba5901', 
                    '#763100',];

        const widths = [3, 10, 25, 40];

    function onColorChange(color)
    {
        if(isOnTurn())
        {
            setDrawColor(color);
            socket.emit('colorChanged', color);
        }
    }

    function onModeChange(e)
    {
        if(isOnTurn())
        {
            setDrawMode(e.target.value);
        }
    }

    function onWidthChange(width)
    {
        if(isOnTurn())
        {
            setDrawWidth(width);
            socket.emit('widthChanged', width);
        }
    }

    function onClearCanvas()
    {
        if(isOnTurn())
        {
            contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            socket.emit('clearCanvas');
        }
    }

    return (
        <div className='DrawingOptions'>
                <div className='current-color' style={{backgroundColor: isOnTurn() ? drawColor : '#000000'}} />
                <div className='colors'>
                    {colors.map((color, index) => <button key={index} style={{backgroundColor: color}} onClick={() => onColorChange(color)} disabled={!isOnTurn()} />)}
                </div>
                <div className='drawing-modes' onChange={onModeChange}>
                    <input type="radio" name='mode' value={'brush'} className='brush' defaultChecked disabled={!isOnTurn()} />
                    <input type="radio" name='mode' value={'line'} className='line' disabled={!isOnTurn()} />
                </div>
                <div className='brush-size'>
                    {widths.map((width, index) => <button key={index} onClick={() => onWidthChange(width)} disabled={!isOnTurn()} />)}
                </div>
                <div className='clear-canvas'>
                    <button onClick={() => onClearCanvas()} disabled={!isOnTurn()} />
                </div>
        </div>
    );
}

export default DrawingOptions;
