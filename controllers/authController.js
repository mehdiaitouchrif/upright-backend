import crypto from 'crypto'
import ErrorResponse from '../helpers/errorResponse.js'
import sendEmail from '../helpers/sendEmail.js'
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

	// Send emails
	const url = `${req.protocol}://${req.get('host')}/confirmemail/${token}`

	try {
		await sendEmail({
			to: user.email,
			subject: 'Upright - Welcome',
			greeting: `Hey ${user.firstName}`,
			message:
				"Welcome to Upright. You've just opened an Upright account and are set to begin interacting with other users around the world.",
			url: 'upright.netlify.app',
			urlTitle: 'Visit Upright',
		})
		await sendEmail({
			to: user.email,
			subject: 'Upright - Verify your Email',
			greeting: `Hey ${user.firstName}`,
			message:
				'Please confirm your Upright email address by following the link below.',
			url,
			urlTitle: 'Verify your Email',
		})
	} catch (error) {
		console.error(error)
		return next(
			new ErrorResponse('Confirmation and/or welcome emails failed', 500)
		)
	}
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

// @desc	Get currently logged in user
// @route	/api/v1/auth/current
export const getCurrent = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.user._id)

	if (!user) {
		return next(
			new ErrorResponse(`No user found with ID: ${req.user._id}`, 404)
		)
	}

	res.status(200).json({
		success: true,
		data: user,
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

// @desc	Request password reset
// @route 	POST /api/v1/auth/resetpassword
export const requestPasswordReset = async (req, res, next) => {
	const { email, username } = req.body

	if (!email && !username) {
		return next(
			new ErrorResponse('Please enter your account email or username', 400)
		)
	}
	const user =
		(await User.findOne({ email })) || (await User.findOne({ username }))

	if (!user) {
		return next(
			new ErrorResponse("Sorry. We couldn't find any user with this data", 404)
		)
	}

	const token = user.getResetPasswordToken()
	await user.save()

	const url = `${req.protocol}://${req.get('host')}/resetpassword/${token}`

	try {
		await sendEmail({
			to: user.email,
			subject: 'Upright - Reset Password',
			greeting: `Hey ${user.firstName}`,
			message:
				'You are recieving this email because you or someone else request a password reset.',
			url,
			additionalHTML: `
				<p style="color: #000; font-size: 17px; margin-bottom:5px">To reset your password, please  copy the code bellow to the reset form. </p>
				<p style="background: #eee; padding: 10px; font-size: 18px; margin: 5px 0; display: inline-block;">${token}</p>
				<p style="color: #333; font-size: 14.5px;">PS: Please note that this code will expire within 15 minutes</p>
			`,
		})
		res.status(200).json({
			success: true,
			data: 'Reset email succeeded',
		})
	} catch (error) {
		console.error(error)
		user.resetPasswordToken = undefined
		user.resetPasswordExpire = undefined
		await user.save()
		return next(new ErrorResponse('Reset email failed', 500))
	}
}

// @desc 	Reset password
// @route 	PATCH /api/v1/auth/resetpassword/:token
export const resetPassword = asyncHandler(async (req, res, next) => {
	const token = req.params.token

	// Hash token
	const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

	const user = await User.findOne({
		resetPasswordToken: hashedToken,
		resetPasswordExpire: { $gt: Date.now() },
	})

	if (!user) {
		return next(new ErrorResponse('Invalid reset token', 400))
	}

	user.password = req.body.password
	user.resetPasswordExpire = undefined
	user.resetPasswordToken = undefined

	await user.save()

	res.status(200).json({
		success: true,
		data: 'Password reset succeeded',
	})
})

// @desc 	Send confirmation email
// @route	POST /api/v1/auth/sendconfirmationemail
export const sendConfirmationEmail = async (req, res, next) => {
	const user = await User.findById(req.user._id)
	const token = await user.getConfirmationToken()
	await user.save()

	const url = `${req.protocol}://${req.get('host')}/confirmemail/${token}`

	try {
		await sendEmail({
			to: user.email,
			subject: 'Upright - Verify your Email',
			greeting: `Hey ${user.firstName}`,
			message:
				'Please confirm your Upright email address by following the link below.',
			url,
			urlTitle: 'Verify your Email',
		})
		res.status(200).json({
			success: true,
			data: 'Confirmation email succeeded',
		})
	} catch (error) {
		console.error(error)
		user.confirmEmailToken = undefined
		await user.save()
		return next(new ErrorResponse('Confirmation email failed', 500))
	}
}

// @desc	Confirm email
// @route 	/api/v1/auth/confirmemail/:token
export const confirmEmail = asyncHandler(async (req, res, next) => {
	const token = req.params.token

	// Hash token
	const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

	const user = await User.findOne({ confirmEmailToken: hashedToken })

	if (!user) {
		return next(new ErrorResponse('Invalid email confirmation token', 400))
	}

	user.confirmEmailToken = undefined
	user.isEmailConfirmed = true
	await user.save()

	const jwtToken = user.getSignedJwtToken()
	res.status(200).json({
		success: true,
		data: user,
		token: jwtToken,
	})
})
