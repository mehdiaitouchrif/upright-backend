import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import connectDB from './config/connectDB.js'
import errorHandler from './middleweare/errorHandler.js'

// Load config vars
dotenv.config()

// Connect database
connectDB()

// Routes
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import postRoutes from './routes/postRoutes.js'
import commentRoutes from './routes/commentRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'

// Init app
const app = express()

// Middleweare
app.use(express.json())

const __dirname = path.resolve()
app.use(express.static(path.join(__dirname, '/public')))

app.get('/', (req, res) => {
	res.send('helloo')
})

// Mount routers
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/posts', postRoutes)
app.use('/api/v1/comments', commentRoutes)
app.use('/api/v1/upload', uploadRoutes)

// Error handler
app.use(errorHandler)
const PORT = process.env.PORT || 5000
app.listen(PORT, () =>
	console.log(
		`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
	)
)
