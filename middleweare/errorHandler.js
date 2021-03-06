import ErrorResponse from '../helpers/errorResponse.js'

const errorHandler = (err, req, res, next) => {
	// Log error
	console.log(err)

	let error = { ...err }
	error.message = err.message

	// Validation errors
	if (err.name === 'ValidationError') {
		let errors = {}
		Object.keys(err.errors).forEach((key) => {
			errors[key] = err.errors[key].properties.message
		})
		error.message = errors
		error.statusCode = 400
	}

	// Invalid ObjectId
	if (err.name === 'CastError') {
		const message = `No resource found with ID: ${err.value}`
		error = new ErrorResponse(message, 404)
	}

	// Duplicate key value
	if (err.code === 11000) {
		// Get the key - which field?
		let key = Object.keys(err.keyValue)[0]
		// Update message
		const message = `${err.keyValue[key]} is already taken`
		error = new ErrorResponse(message, 400)
	}

	res.status(error.statusCode || 500).json({
		success: false,
		error: error.message || 'Internal Server Error',
	})
}

export default errorHandler
