const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
	title: { type: String, required: [true, 'Title is required!'] },
	body: { type: String, required: [true, 'Body is required!'] },
	author: { type: mongoose.Types.ObjectId, ref: 'user', required: true },
	createdAt: { type: Date, default: Date.now },
	updatedAt: Date,
});

const Post = mongoose.model('post', postSchema);
module.exports = Post;
