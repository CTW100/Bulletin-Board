const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// Index
// Get , posts/
router.get('/', (req, res) => {
	Post.find({}) // 1
		.sort('-createdAt') // 1
		.exec((err, posts) => {
			// 1
			if (err) return res.json(err);
			res.render('posts/index', { posts: posts });
		});
});

// New
// Get , posts/new
router.get('/new', (req, res) => {
	res.render('posts/new');
});

// Create
// Post , posts/
router.post('/', (req, res) => {
	Post.create(req.body, (err, post) => {
		if (err) return res.json(err);
		res.redirect('/posts');
	});
});

// Show
// Get , posts/:id
router.get('/:id', (req, res) => {
	Post.findOne({ _id: req.params.id }, (err, post) => {
		if (err) return res.json(err);
		res.render('posts/show', { post: post });
	});
});

// Edit
// Get , posts/:id/edit
router.get('/:id/edit', (req, ers) => {
	Post.findOne({ _id: req.params.id }, (err, post) => {
		if (err) return res.json(err);
		res.render('posts/edit', { post: post });
	});
});

// Update
// Put , posts/:id
router.put('/:id', (req, res) => {
	req.body.updatedAt = Date.now(); //2
	Post.findOneAndUpdate({ _id: req.params.id }, req.body, (err, post) => {
		if (err) return res.json(err);
		res.redirect('/posts/' + req.params.id);
	});
});

// Destroy
// Delete , posts/:id
router.delete('/:id', (req, res) => {
	Post.deleteOne({ _id: req.params.id }, (err) => {
		if (err) return res.json(err);
		res.redirect('/posts');
	});
});

module.exports = router;
