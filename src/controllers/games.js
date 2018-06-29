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
		const board = await Board.findById(req.value.body.board);
		const organizer = await User.findById(req.value.body.organizer);
		for (let i = 0; i < board.squares.length; i++) {
			board.squares[i] = { text: board.squares[i], selected: false };
		}
		const newGame = req.value.body;
		delete newGame.board;
		newGame.board = board;
		newGame.organizer = organizer;
		let addCode = shortid.generate();
		while (!checkIfAddCodeUnique(addCode.substring(0, addCode.length - 3))) {
			// console.log('addcode not unique, making a new one');
			addCode = shortid.generate();
		}
		newGame.addCode = addCode.substring(0, addCode.length - 3);

		newGame.winner = null;
		const game = new Game(newGame);
		await game.save();

		res.status(200).json(game);
	},

	getGame: async (req, res, next) => {
		const game = await Game.findById(req.value.params.id);

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
