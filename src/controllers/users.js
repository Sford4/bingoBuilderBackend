const User = require('../models/user');
const Board = require('../models/board');
var bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = {
	index: async (req, res, next) => {
		const users = await User.find({});

		res.status(200).json(users);
	},

	newUser: async (req, res, next) => {
		try {
			bcrypt.hash(req.value.body.password, saltRounds, function(err, hash) {
				req.value.body.password = hash;
			});
			const newUser = new User(req.value.body);
			// CHECK IF AN EMAIL OR USERNAME WAS ALREADY USED
			const uniqueUserPromise = User.count({ userName: req.value.body.userName }, (err, count) => {
				if (count > 0) {
					throw 'That username is taken!';
				}
			});
			const uniqueEmailPromise = User.count({ email: req.value.body.email }, (err, count) => {
				if (count > 0) {
					throw 'That email has already been used! Go to login?';
				}
			});
			Promise.all([uniqueUserPromise, uniqueEmailPromise]);

			const user = await newUser.save();
			res.status(201).json(user);
		} catch (err) {
			console.log('error caught here', err);
			if (
				err.toString() === ['That email has already been used! Go to login?'] ||
				err.toString() === ['That username is taken!'] ||
				err.toString() === ['That email has already been used! Go to login?', 'That username is taken!']
			) {
				res.status(400).json({
					error: {
						message: err.toString()
					}
				});
			}
		}
	},

	login: async (req, res, next) => {
		const user = await User.findOne({ email: req.body.email.toLowerCase() });

		res.status(200).json(user);
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
	},

	saveUnfinishedBoard: async (req, res, next) => {
		console.log('made it to save func');
		const user = await User.findByIdAndUpdate(
			req.value.params.id,
			{ saved: req.body.saved },
			{ multi: true },
			function(err, numberAffected) {
				console.log(err);
			}
		);
		res.status(200).json(user);
	}
};
