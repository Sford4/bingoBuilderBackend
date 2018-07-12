const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BoardSchema = new Schema({
	title: String,
	keywords: [String],
	squares: [String],
	creator: String,
	numPlays: Number
}, {
    versionKey: false // You should be aware of the outcome after set to false
});

const Board = mongoose.model('board', BoardSchema);

module.exports = Board;
