// models/comment.js

const mongoose = require('mongoose');

//Comment Schema
const commentSchema = new mongoose.Schema ({
	comment: {
		type: String,
		required: true
	},
	post: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Post',
		required: true
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	}
}, { timestamps: true });

module.exports = mongoose.models.Comment || mongoose.model('Comment', commentSchema);