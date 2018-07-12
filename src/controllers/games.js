const Board = require('../models/board');
const User = require('../models/user');
const Game = require('../models/game');
const shortid = require('shortid');

let checkIfAddCodeUnique = async addCode => {
	console.log('checking if add code unique');
	await Game.count({ addCode: addCode }, (err, count) => {
		if (count > 0) {
			console.log('there are ' + count + ' games with that add code');
			return false;
		} else {
			return true;
		}
	});
};

module.exports = {
	index: async (req, res, next) => {
		const games = await Game.find({});

		res.status(200).json(games);
	},

	newGame: async (req, res, next) => {
		let board = await Board.findById(req.value.body.board);
		let organizer = await User.findById(req.value.body.organizer);
		for (let i = 0; i < board.squares.length; i++) {
			board.squares[i] = { text: board.squares[i], selected: false };
		}
		board.numPlays = board.numPlays + 1;
		await board.save();
		let newGame = req.value.body;
		delete newGame.board;
		newGame.board = board;
		console.log('orgnaizer object', organizer);
		newGame.organizer = organizer.userName;
		let addCode = shortid.generate();
		while (!checkIfAddCodeUnique(addCode.substring(0, addCode.length - 4))) {
			// console.log('addcode not unique, making a new one');
			addCode = shortid.generate();
		}
		newGame.addCode = addCode.substring(0, addCode.length - 4);
		const game = new Game(newGame);
		await game.save();
		res.status(200).json(game);
	},

	searchGames: async (req, res, next) => {
		console.log('add code search', req.body);
		const game = await Game.find({ addCode: req.body.addCode });
		console.log('game returned', game);
		if (game[0]._id) {
			res.status(200).json({ gameId: game[0]._id, organizer: game[0].organizer });
		} else {
			res.status(200).json('No games with that add code!');
		}
	},

	getGame: async (req, res, next) => {
		const game = await Game.findById(req.value.params.id);
		// const board = await Board.findById(game.board);
		// delete game.board;
		// game.board = board;
		res.status(200).json(game);
	},

	deleteGame: async (req, res, next) => {
		const game = await Game.findByIdAndRemove(req.value.params.id);
		if (!game) {
			return res.status(404).json({ error: "Game doesn't exist." });
		}
		res.status(200).json({ success: true });
	}
};
