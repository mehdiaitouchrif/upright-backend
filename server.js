import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import connectDB from './config/connectDB.js'

dotenv.config()
const app = express()

// Connect database
connectDB()

// Middleweare
app.use(express.json())

app.get('/', (req, res) => {
	res.send('helloo')
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () =>
	console.log(
		`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
	)
)
