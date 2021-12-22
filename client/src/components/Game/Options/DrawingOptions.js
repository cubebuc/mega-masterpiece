import React from 'react';
import './DrawingOptions.scss'

function DrawingOptions({socket, isOnTurn, drawColor, setDrawColor, setDrawMode, setDrawWidth}) 
{
    const colors = ['#fcfcfc', 
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

    function onColorChange(color)
    {
        setDrawColor(color);
        socket.emit('colorChanged', color);
    }

    function onModeChange(e)
    {
        setDrawMode(e.target.value);
    }

    return (
        <div className='DrawingOptions'>
                <div className='current-color' style={{backgroundColor: drawColor}} />
                <div className='colors'>
                    {colors.map((color, index) => <button key={index} style={{backgroundColor: color}} onClick={() => onColorChange(color)} disabled={!isOnTurn()} />)}
                </div>
                <div className='drawing-modes' onChange={onModeChange}>
                    <input type="radio" name='mode' value={'brush'} className='brush' defaultChecked disabled={!isOnTurn()} />
                    <input type="radio" name='mode' value={'line'} className='line' disabled={!isOnTurn()} />
                </div>
                <div className='brush-size'>

                </div>
                <div className='clear-canvas'>

                </div>
        </div>
    );
}

export default DrawingOptions;
