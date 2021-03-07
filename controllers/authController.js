import ErrorResponse from '../helpers/errorResponse.js'
import asyncHandler from '../middleweare/asyncHandler.js'
import User from '../models/User.js'

// @desc	Sign up
// @route	/api/v1/auth/signup
export const signUp = asyncHandler(async (req, res, next) => {
	const user = await User.create(req.body)
	const token = user.getSignedJwtToken()
	res.status(201).json({
		success: true,
		data: user,
		token,
	})
})

// @desc	Login
// @route	/api/v1/auth/login
export const login = asyncHandler(async (req, res, next) => {
	const { username, email, password } = req.body

	if (!username && !email) {
		return next(new ErrorResponse('Please enter your email or username', 400))
	}
	if (!password) {
		return next(new ErrorResponse('Please enter your password', 400))
	}
	const user =
		(await User.findOne({ username })) || (await User.findOne({ email }))

	if (!user) {
		// Invalid email
		return next(new ErrorResponse('Invalid email or password', 400))
	}

	const isMatch = await user.matchPasswords(password)
	if (!isMatch) {
		return next(new ErrorResponse('Invalid email or password', 400))
	}
	const token = user.getSignedJwtToken()
	res.status(200).json({
		success: true,
		data: user,
		token,
	})
})

// @desc	Change password
// @route	/api/v1/auth/changepassword
export const changePassword = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.user._id)
	if (!user) {
		return next(new ErrorResponse(`No user found`, 404))
	}

	const { currentPassword, newPassword } = req.body
	if (!currentPassword) {
		next(new ErrorResponse('Please enter your current password', 400))
	}
	if (!newPassword) {
		next(new ErrorResponse('Please enter the new password', 400))
	}

	const isMatch = await user.matchPasswords(currentPassword)
	if (isMatch) {
		user.password = newPassword
		await user.save()
		res.status(200).json({
			success: true,
			data: user,
		})
	} else {
		return next(new ErrorResponse('Incorrect password', 400))
	}
})
