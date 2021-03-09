import mongoose from 'mongoose'

const { Schema, model } = mongoose

const postSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'User',
	},
	text: {
		type: String,
		required: [true, 'Please say something'],
	},
	image: {
		type: String,
	},
	likes: [
		{
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
	],
	shares: [
		{
			user: {
				type: Schema.Types.ObjectId,
				ref: 'User',
			},
			text: String,
		},
	],
})

const Post = model('Post', postSchema)

export default Post
