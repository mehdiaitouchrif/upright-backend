import Comment from '../models/Comment.js'
import ErrorResponse from '../helpers/errorResponse.js'
import asyncHandler from '../middleweare/asyncHandler.js'

// @desc    Get User comments | Get all comments
// @route   GET /api/v1/users/:userId/comments
// @route   GET /api/v1/comments
// @router  /api/v1/posts/:postId/comment
export const getComments = asyncHandler(async (req, res, next) => {
	if (req.params.userId) {
		const comments = await Comment.find({ user: req.params.userId }).populate(
			'user post'
		)

		res.status(200).json({
			success: true,
			count: comments.length,
			data: comments,
		})
	} else if (req.params.postId) {
		const comments = await Comment.find({ post: req.params.postId })
			.sort({ createdAt: '-1' })
			.populate('user post')

		res.status(200).json({
			success: true,
			count: comments.length,
			data: comments,
		})
	} else {
		const comments = await Comment.find().populate('user post')

		res.status(200).json({
			success: true,
			count: comments.length,
			data: comments,
		})
	}
})

// @desc 	GET single Comment
// @route	/api/v1/comments/:id
export const getComment = asyncHandler(async (req, res, next) => {
	const comment = await Comment.findById(req.params.id).populate('user')

	if (!comment) {
		return next(
			new ErrorResponse(`No comment found with ID: ${req.params.id}`, 404)
		)
	}

	res.status(200).json({
		success: true,
		data: comment,
	})
})

// @desc    Add comment
// @route   POST /api/v1/posts/:postId/comment
export const addComment = asyncHandler(async (req, res, next) => {
	if (req.params.postId) {
		req.body.post = req.params.postId
		req.body.user = req.user._id
		const comment = await Comment.create(req.body)
		const populated = await Comment.findById(comment._id).populate('user')

		res.status(201).json({
			success: true,
			data: populated,
		})
	}
})

// @desc    Update comment
// @route   PATCH /api/v1/comments/:id
export const updateComment = asyncHandler(async (req, res, next) => {
	const comment = await Comment.findById(req.params.id)

	if (!comment) {
		return next(new ErrorResponse(`No comment found with ID:`, 404))
	}

	if (
		req.user._id.toString() !== comment.user.toString() &&
		req.user.role !== 'admin'
	) {
		return next(
			new ErrorResponse(`You're not allowed to perform this action`, 403)
		)
	}

	comment.text = req.body.text || comment.text
	await comment.save()

	const populated = await Comment.findById(comment._id).populate('user')

	res.status(200).json({
		success: true,
		data: populated,
	})
})

// @desc    Delete comment
// @route   DELETE /api/v1/comments/:id
export const deleteComment = asyncHandler(async (req, res, next) => {
	const comment = await Comment.findById(req.params.id)

	if (!comment) {
		return next(new ErrorResponse(`No comment found with ID:`, 404))
	}

	if (
		req.user._id.toString() !== comment.user.toString() &&
		req.user.role !== 'admin'
	) {
		return next(
			new ErrorResponse(`You're not allowed to perform this action`, 403)
		)
	}

	await comment.delete()

	res.status(200).json({
		success: true,
		data: {},
	})
})
