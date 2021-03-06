import mongoose from 'mongoose'

const { Schema, model } = mongoose

const postSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
	text: {
		type: String,
		required: [true, 'Please say something'],
	},
	image: {
		type: String,
	},
	likedBy: [
		{
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
	],
	sharedBy: [
		{
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
	],
	comments: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Comment',
		},
	],
})

const Post = model('post', postSchema)

export default Post
