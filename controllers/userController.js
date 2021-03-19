import User from '../models/User.js'
import Post from '../models/Post.js'
import ErrorResponse from '../helpers/errorResponse.js'
import asyncHandler from '../middleweare/asyncHandler.js'

// @desc    GET all users
// @route   /api/v1/users
export const getUsers = asyncHandler(async (req, res, next) => {
	const users = await User.find().populate(
		'following followers',
		'firstName lastName username profilePhoto'
	)
	res.status(200).json({
		success: true,
		count: users.length,
		data: users,
	})
})

// @desc    GET single user
// @route   /api/v1/users/:id
export const getUser = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.params.id).populate(
		'following followers',
		'firstName lastName username profilePhoto'
	)
	if (!user) {
		return next(
			new ErrorResponse(`No user found with ID: ${req.params.id}`, 404)
		)
	}
	res.status(200).json({
		success: true,
		data: user,
	})
})

// @desc    PATCH a user
// @route   /api/v1/users/:id
export const updateUser = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.params.id)
	if (!user) {
		return next(
			new ErrorResponse(`No user found with ID: ${req.params.id}`, 404)
		)
	}

	if (
		req.user._id.toString() !== user._id.toString() &&
		user.role !== 'admin'
	) {
		return next(
			new ErrorResponse(`You're not allowed to perform this action`, 403)
		)
	}

	const { firstName, lastName, username, email } = req.body
	user.firstName = firstName || user.firstName
	user.lastName = lastName || user.lastName
	user.username = username || user.username
	user.email = email || user.email

	await user.save()

	res.status(200).json({
		success: true,
		data: user,
	})
})

// @desc    DELETE a user
// @route   /api/v1/users/:id
export const deleteUser = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.params.id)
	if (!user) {
		return next(
			new ErrorResponse(`No user found with ID: ${req.params.id}`, 404)
		)
	}

	if (
		req.user._id.toString() !== user._id.toString() &&
		user.role !== 'admin'
	) {
		return next(
			new ErrorResponse(`You're not allowed to perform this action`, 403)
		)
	}

	await user.delete()

	res.status(200).json({
		success: true,
		data: 'User deleted permanently',
	})
})

// @desc	Follow a user
// @route 	/api/v1/users/:id/follow
export const followUser = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.params.id)
	const loggedUser = await User.findById(req.user._id)
	if (!user) {
		return next(
			new ErrorResponse(`No user found with ID: ${req.params.id}`, 404)
		)
	}

	if (user._id.toString() === loggedUser._id.toString()) {
		return next(new ErrorResponse('You cannot follow yourself', 400))
	}

	if (user.followers.includes(loggedUser._id)) {
		// Un-follow
		user.followers = user.followers.filter(
			(user) => user._id.toString() !== loggedUser._id.toString()
		)
		loggedUser.following = loggedUser.following.filter(
			(user) => user._id.toString() !== user._id.toString()
		)
	} else {
		// Follow
		user.followers = [...user.followers, loggedUser._id]
		loggedUser.following = [...loggedUser.following, user._id]
	}

	await user.save()
	await loggedUser.save()

	res.status(200).json({
		success: true,
		data: user,
	})
})

// desc		Populate user feed
// @route	GET /api/v1/users/populate
export const populateFeed = asyncHandler(async (req, res, next) => {
	const loggedUser = await User.findById(req.user._id)

	const posts = await Post.find({ user: loggedUser.following })
		.populate('user', 'firstName lastName username profilePhoto')
		.sort({ createdAt: -1 })

	const userPosts = await Post.find({ user: req.user._id })
		.populate('user', 'firstName lastName username profilePhoto')
		.sort({ createdAt: -1 })

	res.json({
		success: true,
		count: [...posts, ...userPosts].length,
		data: [...posts, ...userPosts],
	})
})

// @desc	Recommend people to follow
// @route	GET /api/v1/users/recommend
export const recommendFollows = asyncHandler(async (req, res, next) => {
	const notFollowing = await User.find().where('_id').nin(req.user.following)
	const recommended = notFollowing.filter(
		(us) => us._id.toString() !== req.user._id.toString()
	)

	res.status(200).json({
		success: true,
		count: recommended.length,
		data: recommended,
	})
})
