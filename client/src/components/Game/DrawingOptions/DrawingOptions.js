/** @module DrawingOptions */

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

    const widths = [3, 10, 25, 50];

    /**
     * Changes the color and transmits it to others in the lobby if this socket is on turn.
     * @function onColorChange
     * @param {string} color Hex value of the new color. 
     */
    function onColorChange(color)
    {
        if(isOnTurn())
        {
            setDrawColor(color);
            socket.emit('colorChanged', color);
        }
    }

    /**
     * Changes the drawing mode and transmits it to the others in the lobby if this socket is on turn.
     * @function onModeChange
     * @param {Event} e Radio button click event.
     */
    function onModeChange(e)
    {
        if(isOnTurn())
        {
            setDrawMode(e.target.value);
        }
    }

    /**
     * Changes the brush width and transmits it to others in the lobby if this socket is on turn.
     * @function onWidthChange
     * @param {number} width New brush width value.
     */
    function onWidthChange(e)
    {
        if(isOnTurn())
        {
            setDrawWidth(e.target.value);
            socket.emit('widthChanged', e.target.value);
        }
    }

    /**
     * Clears the canvas and transmits it to others in the lobby if this socket is on turn.
     * @function onClearCanvas
     */
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
                    <label>
                        <input type='radio' name='mode' value={'brush'} defaultChecked disabled={!isOnTurn()} />
                        <img src='images/brush.png' alt='brush.png' />
                    </label>
                    <label>
                        <input type='radio' name='mode' value={'line'} disabled={!isOnTurn()} />
                        <img src='images/line.png' alt='line.png' />
                    </label>
                </div>
                <div className='brush-size' onChange={onWidthChange}>
                    {widths.map((width, index) => 
                    <label>
                        <input key={index} type='radio' name='width' value={width} defaultChecked={index === 1} disabled={!isOnTurn()} />
                        <img src={'images/size' + (index + 1).toString() + '.png'} alt={'size' + (index + 1).toString() + '.png'} />
                    </label>)}
                </div>
                <div className='clear-canvas'>
                    <button onClick={() => onClearCanvas()} disabled={!isOnTurn()} />
                </div>
        </div>
    );
}

export default DrawingOptions;
