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
			requried: [true, 'Password is required!'],
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
	.get(() => this._originalPassword)
	.set((value) => {
		this._originalPassword = value;
	});

userSchema
	.virtual('newPassword')
	.get(() => this._newPassword)
	.set((value) => {
		this._newPassword = value;
	});

// Password validation


const User = mongoose.model('user', userSchema);
module.exports = User;
