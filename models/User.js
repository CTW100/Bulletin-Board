const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
	{
		username: {
			type: String,
			required: [true, 'Username is required!'],
			match: [/^.{4,12}$/, 'Should be 4-12 characters!'],
			trim: true,
			unique: true,
		},
		password: {
			type: String,
			required: [true, 'Password is required!'],
			select: false,
		},
		name: {
			type: String,
			required: [true, 'Name is required!'],
			match: [/^.{4,12}$/, 'Should be 4-12 characters!'],
			trim: true,
		},

		email: {
			type: String,
			match: [
				/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
				'Should be a vaild email address!',
			],
			trim: true,
		},
	},
	{
		toObject: { virtuals: true },
	}
);

userSchema
	.virtual('passwordConfirmation')
	.get(() => this._passwordConfirmation)
	.set((value) => {
		this._passwordConfirmation = value;
	});

userSchema
	.virtual('originalPassword')
	.get(() => this._originalPassword)
	.set((value) => {
		this._originalPassword = value;
	});

userSchema
	.virtual('currentPassword')
	.get(() => this._currentPassword)
	.set((value) => {
		this._currentPassword = value;
	});

userSchema
	.virtual('newPassword')
	.get(() => this._newPassword)
	.set((value) => {
		this._newPassword = value;
	});

// Password validation // 2
var passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/; // 2-1
var passwordRegexErrorMessage =
	'Should be minimum 8 characters of alphabet and number combination!'; // 2-2
userSchema.path('password').validate(function (v) {
	var user = this;

	// create user
	if (user.isNew) {
		if (!user.passwordConfirmation) {
			user.invalidate(
				'passwordConfirmation',
				'Password Confirmation is required.'
			);
		}

		if (!passwordRegex.test(user.password)) {
			// 2-3
			user.invalidate('password', passwordRegexErrorMessage); // 2-4
		} else if (user.password !== user.passwordConfirmation) {
			user.invalidate(
				'passwordConfirmation',
				'Password Confirmation does not matched!'
			);
		}
	}

	// update user
	if (!user.isNew) {
		if (!user.currentPassword) {
			user.invalidate('currentPassword', 'Current Password is required!');
		} else if (
			!bcrypt.compareSync(user.currentPassword, user.originalPassword)
		) {
			user.invalidate('currentPassword', 'Current Password is invalid!');
		}

		if (user.newPassword && !passwordRegex.test(user.newPassword)) {
			// 2-3
			user.invalidate('newPassword', passwordRegexErrorMessage); // 2-4
		} else if (user.newPassword !== user.passwordConfirmation) {
			user.invalidate(
				'passwordConfirmation',
				'Password Confirmation does not matched!'
			);
		}
	}
});

userSchema.pre('save', (req, res, next) => {
	const user = this;

	if (!user.isModified('password')) {
		return next();
	} else {
		user.password = bcrypt.hashSync(user.password);
		user.next();
	}
});

userSchema.methods.authenticate = (password) => {
	const user = this;
	return bcrypt.compareSync(password, user.password);
};

const User = mongoose.model('user', userSchema);
module.exports = User;
