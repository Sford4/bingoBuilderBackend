import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
var io = require('socket.io')(http);
app.use(morgan('dev'));
app.use(cors());

import http from 'http';
const server = http.Server(app);

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/codeworkr-rest-api', () => {
	console.log('Connected to mongodb.');
});

const users = require('./routes/users');
const boards = require('./routes/boards');
const games = require('./routes/games');

try {
	const port = process.env.PORT || 8000;
	server.listen(port);
	console.log(`Listening on port: ${port}`);
} catch (err) {
	console.log('INIT_ERROR:', err);
}

// Middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());

// Routes
app.use('/boards', boards);
app.use('/users', users);
app.use('/games', games);

// Catch 404 Errors and forward them to error handler
app.use((req, res, next) => {
	const err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// Error handler function
app.use((err, req, res, next) => {
	const error = app.get('env') === 'development' ? err : {};
	const status = err.status || 500;

	// Respond to client
	res.status(status).json({
		error: {
			message: error.message
		}
	});

	// Respond to ourselves
	console.error(err);
});

//
// WEB SOCKET CODE
//
const Game = require('./models/game');
const Board = require('./models/board');

io.listen(server);

io.on('connection', socket => {
	console.log('a user connected');

	socket.on('join', async (addCode, userId, gameId) => {
		console.log('join: ', { addCode: addCode, userId: userId, gameId: gameId });
		socket.join(addCode);
		let game = await Game.findById(gameId);
		if (!game.players.includes(userId)) {
			game.players.push(userId);
			game.save();
		}
	});

	socket.on('leave', async (addCode, gameId, userId) => {
		socket.leave(addCode);
		let game = await Game.findById(gameId);
		game.players.filter(player => player !== userId);
		if (!game.players.length) {
			Game.remove({ _id: gameId });
		} else {
			game.save();
		}
		console.log('user disconnected', userId);
	});

	socket.on('squarePressed', async (square, addCode, gameId) => {
		// update the backend game object
		let game = await Game.findById(gameId);
		for (let i = 0; i < game.board.squares.length; i++) {
			if (square.text === game.board.squares[i].text) {
				game.board.squares[i].selected = !game.board.squares[i].selected;
			}
		}
		game.save();
		// LET THE PLAYERS KNOW
		socket.broadcast.to(addCode).emit('squarePressed', square);
	});

	socket.on('bingo', (userName, addCode) => {
		console.log('bingo called by: ' + userName);
		// update the backend game object
		socket.broadcast.to(addCode).emit('bingo', userName);
	});

	socket.on('playAgain', async (addCode, boardId) => {
		let board = await Board.findById(boardId);
		board.numPlays = board.numPlays + 1;
		board.save();
		socket.broadcast.to(addCode).emit('playAgain');
	});
});
