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
	]
});

const User = mongoose.model('user', UserSchema);

module.exports = User;
