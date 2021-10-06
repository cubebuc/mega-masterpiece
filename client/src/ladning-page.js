console.log('Client-side code running');

const inputNickname = document.getElementById('input-nickname');
const buttonJoin = document.getElementById('button-join');

buttonJoin.onclick = onClickButtonJoin;

function onClickButtonJoin()
{
    let player = inputNickname.value;
    let options = 
    {
        method: "POST",
        body: JSON.stringify({player: player}),
        headers: 
        {
          "Content-Type": "application/json"
        }
    }

    fetch('/join', options)
    .then(res =>
    {
        return res.json();
    })
    .then(json => 
    {
        console.log(json);
    });
}