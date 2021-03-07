import Post from '../models/Post.js'
import ErrorResponse from '../helpers/errorResponse.js'
import asyncHandler from '../middleweare/asyncHandler.js'

// desc     GET Posts
// @route   /api/v1/posts
// @route   user posts: /api/v1/users/:userId/posts
export const getPosts = asyncHandler(async (req, res, next) => {
	let posts
	if (req.params.userId) {
		posts = await Post.find({ user: req.params.userId }).populate(
			'user',
			'firstName lastName username profilePhoto'
		)
	} else {
		posts = await Post.find().populate(
			'user likedBy',
			'firstName lastName username profilePhoto'
		)
	}

	res.status(200).json({
		success: true,
		count: posts.length,
		data: posts,
	})
})

// @desc    GET single post
// @route   /api/v1/posts/:id
export const getPost = asyncHandler(async (req, res, next) => {
	const post = await Post.findById(req.params.id).populate(
		'user',
		'firstName lastName username profilePhoto'
	)

	if (!post) {
		return next(
			new ErrorResponse(`No post found with ID: ${req.params.id}`, 404)
		)
	}

	res.status(200).json({
		success: true,
		data: post,
	})
})

// @desc    Create Post
// @route   /api/v1/posts
export const createPost = asyncHandler(async (req, res, next) => {
	req.body.user = req.user._id
	const post = await Post.create(req.body)
	res.status(201).json({
		success: true,
		data: post,
	})
})

// @desc    Update Post
// @route   /api/v1/posts/:id
export const updatePost = asyncHandler(async (req, res, next) => {
	const post = await Post.findById(req.params.id)
	if (!post) {
		return next(
			new ErrorResponse(`No post found with ID: ${req.params.id}`, 404)
		)
	}
	if (
		req.user._id.toString() !== post.user.toString() &&
		user.role !== 'admin'
	) {
		return next(
			new ErrorResponse(`You're not allowed to perform this action`, 403)
		)
	}
	const { text, image } = req.body
	post.text = text || post.text
	post.image = image || post.image
	await post.save()

	res.json({
		success: true,
		data: post,
	})
})

// @desc    Delete post
// @route   /api/v1/posts/:id
export const deletePost = asyncHandler(async (req, res, next) => {
	const post = await Post.findById(req.params.id)

	if (!post) {
		return next(
			new ErrorResponse(`No post found with ID: ${req.params.id}`, 404)
		)
	}

	if (
		req.user_id.toString() !== post.user.toString() &&
		user.role !== 'admin'
	) {
		return next(
			new ErrorResponse(`You're not allowed to perform this action`, 403)
		)
	}
	await post.delete()
	res.status(200).json({
		success: true,
		data: 'Post deleted successfully',
	})
})

// @desc	Like a post
// @route	/api/v1/posts/:id/like
export const likePost = asyncHandler(async (req, res, next) => {
	const post = await Post.findById(req.params.id)
	if (!post) {
		return next(
			new ErrorResponse(`No post found with ID: ${req.params.id}`, 404)
		)
	}

	if (post.likedBy.includes(req.user._id.toString())) {
		post.likedBy = post.likedBy.filter(
			(like) => like.toString() !== req.user._id.toString()
		)
	} else {
		post.likedBy = [...post.likedBy, req.user._id]
	}
	await post.save()

	res.status(200).json({
		success: true,
		data: post,
	})
})
