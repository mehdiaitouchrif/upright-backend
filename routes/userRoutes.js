import { Router } from 'express'
import {
	getUsers,
	getUser,
	deleteUser,
	updateUser,
	followUser,
	populateFeed,
	recommendFollows,
} from '../controllers/userController.js'
import protect from '../middleweare/requireAuth.js'

const router = Router()

// Include post resource
import postRouter from './postRoutes.js'
import commentRouter from './commentRoutes.js'
router.use('/:userId/posts', postRouter)
router.use('/:userId/comments', commentRouter)

router.get('/populate', protect, populateFeed)
router.get('/recommend', protect, recommendFollows)

router.route('/').get(protect, getUsers)
router.route('/:id').delete(protect, deleteUser).patch(protect, updateUser)
router.get('/:username', protect, getUser)
router.patch('/:id/follow', protect, followUser)

export default router
