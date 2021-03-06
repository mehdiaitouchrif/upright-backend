import mongoose from 'mongoose'

const { Schema, model } = mongoose

const commentSchema = new Schema(
	{
		post: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Post',
		},
		user: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
		comment: {
			type: String,
			required: [true, "Comment can't be empty"],
		},
		likes: [
			{
				type: Schema.Types.ObjectId,
				ref: 'User',
			},
		],
		replies: [this],
	},
	{ timestamps: true }
)

const Comment = model('comment', commentSchema)

export default Comment
