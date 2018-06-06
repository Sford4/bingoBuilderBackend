const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BoardSchema = new Schema({
	title: String,
	keywords: [String],
	squares: [String],
	creator: {
		type: Schema.Types.ObjectId,
		ref: 'user'
	},
	numPlays: Number
});

const Board = mongoose.model('board', BoardSchema);

module.exports = Board;
