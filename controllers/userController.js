import User from '../models/User.js'
import ErrorResponse from '../helpers/errorResponse.js'
import asyncHandler from '../middleweare/asyncHandler.js'

// @desc    GET all users
// @route   /api/v1/users
export const getUsers = asyncHandler(async (req, res, next) => {
	const users = await User.find()
	res.status(200).json({
		success: true,
		count: users.length,
		data: users,
	})
})

// @desc    GET single user
// @route   /api/v1/users/:id
export const getUser = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.params.id)
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
