import mongoose from 'mongoose'

const { Schema, model } = mongoose
const commentSchema = new Schema({
	post: {
		type: Schema.Types.ObjectId,
		ref: 'Post',
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
	text: {
		type: String,
		required: [true, 'Please say something'],
	},
	replies: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Comment',
		},
	],
})

const Comment = model('comment', commentSchema)

export default Comment
