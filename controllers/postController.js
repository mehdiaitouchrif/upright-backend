import Post from '../models/Post.js'
import ErrorResponse from '../helpers/errorResponse.js'
import asyncHandler from '../middleweare/asyncHandler.js'

// desc     GET Posts
// @route   /api/v1/posts
// @route   user posts: /api/v1/users/userId/posts
export const getPosts = asyncHandler(async (req, res, next) => {
	let posts
	if (req.params.userId) {
		posts = await Post.find({ user: req.params.userId }).populate(
			'user',
			'firstName lastName username profilePhoto'
		)
	} else {
		posts = await Post.find().populate(
			'user',
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
	const post = await Post.create({ ...req.body, user: req.user._id })
	console.log(req.user)
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
	console.log(req.user)
	if (post.user.toString() === req.user._id.toString()) {
		const { text, image } = req.body
		post.text = text || post.text
		post.image = image || post.image
		await post.save()

		res.json({
			success: true,
			data: post,
		})
	}
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
	if (post.user.toString() === req.user._id.toString()) {
		await post.delete()
		res.status(200).json({
			success: true,
			data: 'Post deleted successfully',
		})
	} else {
		return next(new ErrorResponse(`Not authorized to commit this action`, 403))
	}
})