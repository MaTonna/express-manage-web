const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 创建模型和所需要的字段
const ProfileSchema = new Schema({
	type: {
		type: String
	},
	desc: {
		type: String
	},
	income: {
		type: String,
		required: true
	},
	data: {
		type: Date,
		default: Date.now
	}
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);
