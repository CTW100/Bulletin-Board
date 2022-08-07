const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy; // 2
const User = require('../models/User');

// serialize & deserialize User // 2
passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	User.findOne({ _id: id }, (err, user) => {
		done(err, user);
	});
});

// local strategy // 3
passport.use(
	'local-login',
	new LocalStrategy(
		{
			usernameField: 'username', // 3-1
			passportField: 'password', // 3-1
			passReqToCallback: true,
		},
		(req, username, password, done) => { // 3-2
			// 3-2
			User.findOne({ username: username })
				.select({ password: 1 })
				.exec((err, user) => {
					if (err) return done(err);

					if (user && user.authenticate(password)) {
						// 3-3
						return done(null, user);
					} else {
						req.flash('username', username);
						req.flash('errors', {
							login: 'The username or password is incorrect.',
						});
						return done(null, false);
					}
				});
		}
	)
);

module.exports = passport;
