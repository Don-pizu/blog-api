// models/post.js

const mongoose = require('mongoose');

//Post Schema
const postSchema = new mongoose.Schema ({
	title: {
		type: String,
		required: true
	},
	content: {
		type: String,
		required: true
	},
	tags: {
		type: [String]
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	}
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);