# Mega Masterpiece
Website: https://mega-masterpiece.herokuapp.com/

This is my final project for high school exams.

It is an online drawing game inspired by [Skribble.io](https://skribbl.io/).<br>
Multiple players gather in a lobby and one of them is drawing a word.<br>
The others are trying to guess the word.

## Development
Server is written with [node.js](https://nodejs.org/).<br>
Mainly [socket.io](https://socket.io/), but also [express.js](https://expressjs.com/).

Client is written with [React](https://reactjs.org/).
### Install dependecies
Do this both in root folder and client folder (server-side, client-side)<br>
`npm install`
### Dev server
Local server at localhost:5000<br>
`npm run dev`
### Server only
Starts the local server without rebuilding the front-end<br>
`npm run start:server`
### Client only
Starts the front-end without server<br>
(Kind of useless, unles you need just the home page for some reason)<br>
`npm run start:client`
### Builds
Full build<br>
`npm run build:full`

Documentation build ([JSDocs](https://jsdoc.app/) is required)<br>
`npm run build:docs`

[Documentation](https://mega-masterpiece.herokuapp.com/docs)

## Contributing
Create a pull-request.<br>
I will review it in my precious time :)

## License
[MIT](https://choosealicense.com/licenses/mit/)
