import { Router } from 'express'
import {
	getUsers,
	getUser,
	deleteUser,
	updateUser,
} from '../controllers/userController.js'
import protect from '../middleweare/requireAuth.js'

const router = Router()

// Include post resource
import postRouter from './postRoutes.js'
router.use('/:userId/posts', postRouter)

router.route('/').get(protect, getUsers)
router
	.route('/:id')
	.delete(protect, deleteUser)
	.patch(protect, updateUser)
	.get(protect, getUser)
export default router
