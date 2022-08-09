const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
	{
		username: {
			type: String,
			required: [true, 'Username is required!'],
			unique: true,
		},
		password: {
			type: String,
			required: [true, 'Password is required!'],
			select: false,
		},
		name: { type: String, required: [true, 'Name is required!'] },
		email: { type: String },
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

// Password validation
userSchema.path('password').validate(function (v) {
	const user = this;

	// 회원가입
	if (user.isNew) {
		if (!user.passwordConfirmation) {
			user.invalidate(
				'passwordConfirmation',
				'Password Confirmation is required!'
			);
		}

		if (user.password !== user.passwordConfirmation) {
			user.invalidate(
				'passwordConfirmation',
				'Password Confirmation does not matched!'
			);
		}
	}

	// 회원 정보 수정
	if (!user.isNew) {
		if (!user.currentPassword) {
			user.invalidate('currentPassword', 'Current Password is required!');
		} else if (user.currentPassword != user.originalPassword) {
			user.invalidate('currentPassword', 'Current Password is invalid!');
		}
		if (user.newPassword !== user.passwordConfirmation) {
			user.invalidate(
				'passwordConfirmation',
				'Password Confirmation does not matched!'
			);
		}
	}
});

const User = mongoose.model('user', userSchema);
module.exports = User;
