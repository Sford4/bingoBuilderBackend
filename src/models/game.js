const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GameSchema = new Schema({
	addCode: String,
	players: [String],
	board: {
		type: Schema.Types.ObjectId,
		ref: 'board'
	},
	organizer: {
		type: Schema.Types.ObjectId,
		ref: 'user'
	},
	winner: String
});

const Game = mongoose.model('game', GameSchema);

module.exports = Game;
