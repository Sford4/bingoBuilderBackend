const User = require('../models/user');
const Board = require('../models/board');

module.exports = {
	index: async (req, res, next) => {
		const users = await User.find({});

		res.status(200).json(users);
	},

	newUser: async (req, res, next) => {
		const newUser = new User(req.value.body);
		const user = await newUser.save();

		res.status(201).json(user);
	},

	getUser: async (req, res, next) => {
		const user = await User.findById(req.value.params.id);

		res.status(200).json(user);
	},

	replaceUser: async (req, res, next) => {
		const user = await User.findByIdAndUpdate(req.value.params.id, req.value.body);

		res.status(200).json({ success: true });
	},

	updateUser: async (req, res, next) => {
		const user = await User.findByIdAndUpdate(req.value.params.id, req.value.body);

		res.status(200).json({ success: true });
	},

	deleteUser: async (req, res, next) => {
		const user = await User.findByIdAndRemove(req.value.params.id);

		res.status(200).json({ success: true });
	},

	getUserBoards: async (req, res, next) => {
		const user = await User.findById(req.value.params.id).populate({
			path: 'boards',
			ref: 'board',
			select: 'model make year -_id'
		});

		res.status(200).json(user.cars);
	},

	newUserBoard: async (req, res, next) => {
		const newBoard = new Board(req.value.body);
		// await newBoard.save();
		const user = await User.findByIdAndUpdate(req.value.params.id, {
			$push: { boards: newBoard }
		});

		res.status(200).json(newBoard);
	}
};
