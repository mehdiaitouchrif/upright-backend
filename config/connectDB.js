import mongoose from 'mongoose'

const connectDB = async function () {
	try {
		const res = await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useCreateIndex: true,
			useFindAndModify: true,
			useUnifiedTopology: true,
		})

		console.log(`MongoDB connected ${res.connection.host}`.cyan)
	} catch (error) {
		console.error(error.red)
		process.exit(1)
	}
}

export default connectDB
