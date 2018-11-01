const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 创建模型和所需要的字段
const UserSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	avatar: {
		type: String
	},
	identity: {
		type: String,
		required: true
	},
	data: {
		type: Date,
		default: Date.now
	}
});

module.exports = User = mongoose.model('users', UserSchema);
