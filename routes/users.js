const express = require('express');
const router = express.Router();
const User = require('../models/User');
const util = require('../util');

// New (GET)
router.get('/new', (req, res) => {
	const user = req.flash('user')[0] || {};
	const errors = req.flash('errors')[0] || {};
	res.render('users/new', { user: user, errors: errors });
});

// Create (POST)
router.post('/', (req, res) => {
	User.create(req.body, (err, user) => {
		if (err) {
			req.flash('user', req.body);
			req.flash('errors', util.parseError(err));
			return res.redirect('/users/new');
		}
		res.redirect('/');
	});
});

// Edit (GET)
router.get('/:username/edit', util.isLoggedin, checkPermission, (req, res) => {
	const user = req.flash('user')[0];
	const errors = req.flash('errors')[0] || {};
	if (!user) {
		User.findOne({ username: req.params.username }, (err, user) => {
			if (err) return res.json(err);
			res.render('users/edit', {
				username: req.params.username,
				user: user,
				errors: errors,
			});
		});
	} else {
		res.render('users/edit', {
			username: req.params.username,
			user: user,
			errors: errors,
		});
	}
});

// Update (PUT)
router.put(
	'/:username',
	util.isLoggedin,
	checkPermission,
	function (req, res, next) {
		User.findOne({ username: req.params.username })
			.select('password')
			.exec(function (err, user) {
				if (err) return res.json(err);

				// update user object
				user.originalPassword = user.password;
				user.password = req.body.newPassword
					? req.body.newPassword
					: user.password;
				for (var p in req.body) {
					user[p] = req.body[p];
				}

				// save updated user
				user.save(function (err, user) {
					if (err) {
						req.flash('user', req.body);
						req.flash('errors', util.parseError(err));
						return res.redirect(
							'/users/' + req.params.username + '/edit'
						);
					}
					res.redirect('/users/' + user.username);
				});
			});
	}
);

// Show (GET)
router.get('/:username', util.isLoggedin, checkPermission, (req, res) => {
	User.findOne({ username: req.params.username }, (err, user) => {
		if (err) return res.json(err);
		res.render('users/show', { user: user });
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
