const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	userName: String,
	email: String,
	boards: [
		{
			type: Schema.Types.ObjectId,
			ref: 'board'
		}
	],
	saved: Object
});

const User = mongoose.model('user', UserSchema);

module.exports = User;
