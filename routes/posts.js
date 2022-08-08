const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// New - 생성폼(form)을 사용자에게 보여줌 (GET)
router.get('/new', (req, res) => {
	res.render('posts/new');
});

// Create - 전달 받은 자료를 실제로 생성 (POST)
router.post('/', (req, res) => {
	console.log(req.body);
	Post.create(req.body, (err) => {
		if (err) return res.json(err);
		res.redirect('/posts');
	});
});

// Edit - 수정폼을 사용자에게 보여줌 (GET)
router.get('/:id/edit', (req, res) => {
	Post.findOne({ _id: req.params.id }, (err, post) => {
		if (err) return res.json(err);
		res.render('posts/edit', { post: post });
	});
});

// Update - 전달 받은 자료를 바탕으로 현재 자료 수정 (PUT)
router.put('/:id', (req, res) => {
	req.body.createdAd = Date.now();
	Post.findOneAndUpdate({ _id: req.params.id }, req.body, (err, post) => {
		if (err) return res.json(err);
		res.redirect('/posts/' + req.params.id);
	});
});

// Index - 자료들 목록 조회 (GET)
router.get('/', (req, res) => {
	Post.find({})
		.sort('-createdAt')
		.exec((err, posts) => {
			console.log(posts);
			res.render('posts/index', { posts: posts });
		});
});

// Show - 하나의 자료를 상세히 보여줌 (GET)
router.get('/:id', (req, res) => {
	Post.findOne({ _id: req.params.id }, (err, post) => {
		if (err) return res.json(err);
		res.render('posts/show', { post: post });
	});
});

// Destroy - 자료 삭제 (DELETE)
router.delete('/:id', (req, res) => {
	Post.deleteOne({ _id: req.params.id }, (err) => {
		if (err) return res.json(err);
		res.redirect('/posts');
	});
});

module.exports = router;
