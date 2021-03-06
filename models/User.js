import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

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
		following: [
			{
				type: Schema.Types.ObjectId,
				ref: 'User',
			},
		],
		followers: [
			{
				type: Schema.Types.ObjectId,
				ref: 'User',
			},
		],
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

// Hashing the password
userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		next()
	}

	const salt = await bcrypt.genSalt(10)
	this.password = await bcrypt.hash(this.password, salt)
})

// Get JWT token
userSchema.methods.getSignedJwtToken = function () {
	return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRE,
	})
}

// Match passwords
userSchema.methods.matchPasswords = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password)
}

const User = model('User', userSchema)

export default User
