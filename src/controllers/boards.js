const Board = require('../models/board');
const User = require('../models/user');

module.exports = {
	index: async (req, res, next) => {
		const boards = await Board.find({});

		res.status(200).json(boards);
	},

	newBoard: async (req, res, next) => {
		const creator = await User.findById(req.value.body.creator);

		const newBoard = req.value.body;
		delete newBoard.creator;

		const board = new Board(newBoard);
		board.creator = creator;
		board.numPlays = 0;
		board.keywords.unshift(board.title);
		board.keywords.unshift(creator.userName);
		await board.save();

		creator.boards.push(board);
		await creator.save();

		res.status(200).json(board);
	},

	getBoard: async (req, res, next) => {
		const board = await Board.findById(req.value.params.id);

		res.status(200).json(board);
	},

	replaceBoard: async (req, res, next) => {
		const board = await Board.findByIdAndUpdate(req.value.params.id, req.value.body);

		res.status(200).json({ success: true });
	},

	updateBoard: async (req, res, next) => {
		const board = await Board.findByIdAndUpdate(req.value.params.id, req.value.body);

		res.status(200).json({ success: true });
	},

	deleteBoard: async (req, res, next) => {
		const board = await Board.findByIdAndRemove(req.value.params.id);
		if (!board) {
			return res.status(404).json({ error: "Board doesn't exist." });
		}

		const user = await User.findById(board.creators);
		user.boards.pull(board);
		await user.save();

		res.status(200).json({ success: true });
	}
};
