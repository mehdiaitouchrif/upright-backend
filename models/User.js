import mongoose from 'mongoose'

const { Schema, model } = mongoose

const userSchema = new Schema(
	{
		firstName: {
			type: String,
			required: [true, 'Please enter your first name'],
		},
		lastName: {
			type: String,
			required: [true, 'Please enter your last name'],
		},
		username: {
			type: String,
			required: [true, 'Please enter a username'],
			unique: true,
			minlength: [4, 'minimum length is 4 characters'],
			match: [
				/^(?=.{4})[a-z][a-z\d]*_?[a-z\d]+$/i,
				'Only letters, numbers and underscores',
			],
		},
		email: {
			type: String,
			required: [true, 'Please enter your email'],
			unique: true,
			match: [
				/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
				'Please add a valid email',
			],
		},
		password: {
			type: String,
			required: [true, 'Please enter a password'],
			minlength: [6, 'Minimum password length is 6 characters'],
		},
		profilePhoto: {
			type: String,
			required: true,
			default: '/images/profile.webp',
		},
		coverPhoto: {
			type: String,
		},
		following: [this],
		followers: [this],
		bio: String,
		website: {
			type: String,
			match: [
				/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi,
				'Please enter a valid url',
			],
		},
		company: String,
		feed: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Post',
			},
		],
		resetPasswordToken: String,
		resetPasswordExpire: Date,
		confirmEmailToken: String,
		isEmailConfirmed: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
)

const User = model('user', userSchema)

export default User
