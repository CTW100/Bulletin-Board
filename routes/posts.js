const { render } = require('ejs');
const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const util = require('../util');

// New - 생성폼(form)을 사용자에게 보여줌 (GET)
router.get('/new', util.isLoggedin, (req, res) => {
	const post = req.flash('post')[0] || {};
	const errors = req.flash('errors')[0] || {};
	res.render('posts/new', { post: post, errors: errors });
});

// Create - 전달 받은 자료를 실제로 생성 (POST)
router.post('/', util.isLoggedin, (req, res) => {
	req.body.author = req.user._id;
	Post.create(req.body, (err, post) => {
		if (err) {
			req.flash('post', req.body);
			req.flash('errors', util.parseError(err));
			return res.redirect('/posts/new');
		}
		res.redirect('/posts');
	});
});

// Edit - 수정폼을 사용자에게 보여줌 (GET)
router.get('/:id/edit', util.isLoggedin, checkPermission, (req, res) => {
	const post = req.flash('post')[0];
	const errors = req.flash('errors')[0] || {};
	if (!post) {
		Post.findOne({ _id: req.params.id }, (err, post) => {
			if (err) return res.json(err);
			res.render('posts/edit', { post: post, erorrs: errors });
		});
	} else {
		post._id = req.params.id;
		render('posts/edit', { post: post, errors: errors });
	}
});

// Update - 전달 받은 자료를 바탕으로 현재 자료 수정 (PUT)
router.put('/:id', util.isLoggedin, checkPermission, (req, res) => {
	req.body.updatedAt = Date.now();
	Post.findOneAndUpdate(
		{ _id: req.params.id },
		req.body,
		{ runValidators: true },
		(err, post) => {
			if (err) {
				req.flash('post', req.body);
				req.flash('errors', util.parseError(err));
				return res.redirect('/posts/' + req.params.id + '/edit');
			}
			res.redirect('/posts/' + req.params.id);
		}
	);
});

// Index - 자료들 목록 조회 (GET)
router.get('/', (req, res) => {
	Post.find({})
		.populate('author')
		.sort('-createdAt')
		.exec((err, posts) => {
			console.log(posts);
			res.render('posts/index', { posts: posts });
		});
});

// Show - 하나의 자료를 상세히 보여줌 (GET)
router.get('/:id', (req, res) => {
	Post.findOne({ _id: req.params.id })
		.populate('author')
		.exec((err, post) => {
			if (err) return res.json(err);
			res.render('posts/show', { post: post });
		});
});

// Destroy - 자료 삭제 (DELETE)
router.delete('/:id', util.isLoggedin, checkPermission, (req, res) => {
	Post.deleteOne({ _id: req.params.id }, (err) => {
		if (err) return res.json(err);
		res.redirect('/posts');
	});
});

module.exports = router;

function checkPermission(req, res, next) {
	Post.findOne({ _id: req.params.id }, (err, post) => {
		if (err) return res.json(err);
		if (post.author != req.params.id) return util.noPermission(req, res);

		next();
	});
}
