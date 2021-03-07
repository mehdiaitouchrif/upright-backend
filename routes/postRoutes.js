import { Router } from 'express'
import {
	getPosts,
	updatePost,
	createPost,
	getPost,
	deletePost,
	likePost,
} from '../controllers/postController.js'
import protect from '../middleweare/requireAuth.js'

const router = Router({ mergeParams: true })

router.route('/').get(protect, getPosts).post(protect, createPost)
router
	.route('/:id')
	.get(protect, getPost)
	.patch(protect, updatePost)
	.delete(protect, deletePost)
router.route('/:id/like').patch(protect, likePost)

export default router
