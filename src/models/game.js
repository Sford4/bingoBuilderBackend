const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GameSchema = new Schema({
	addCode: String,
	players: [String],
	board: Object,
	organizer: String,
	winner: String
});

const Game = mongoose.model('game', GameSchema);

module.exports = Game;
