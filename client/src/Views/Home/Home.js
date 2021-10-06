import React, { useEffect } from 'react'

function Home() 
{
    function test()
    {
        console.log('Client log');
    }

    return (
        <div>
            <h1>OMG TITLE</h1>
            <input type="text" placeholder="Nickname" />
            <button onClick={test}>Create Lobby</button>
        </div>
    );
}

export default Home
