import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import connectDB from './config/connectDB.js'
import errorHandler from './middleweare/errorHandler.js'

// Routes
import authRoutes from './routes/authRoutes.js'

dotenv.config()
const app = express()

// Connect database
connectDB()

// Middleweare
app.use(express.json())

app.get('/', (req, res) => {
	res.send('helloo')
})

// Mount routers
app.use('/api/v1/auth', authRoutes)

// Error handler
app.use(errorHandler)
const PORT = process.env.PORT || 5000
app.listen(PORT, () =>
	console.log(
		`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
	)
)
