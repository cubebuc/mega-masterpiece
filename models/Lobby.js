class Lobby
{
    constructor()
    {
        this.id = getRandomInt(100000, 1000000);
        this.players = [];
        this.words = [];
    }

    addPlayer(player)
    {
        this.players.push(player);
    }

    removePlayer(player)
    {
        let index = this.players.indexOf(player);
        this.players.splice(index, 1);
    }

    setWords(words)
    {
        this.words = words;
    }
}

function getRandomInt(min, max) 
{
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

module.exports = Lobby;