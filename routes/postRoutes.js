import { Router } from 'express'
import {
	getPosts,
	updatePost,
	createPost,
	getPost,
	deletePost,
	likePost,
	sharePost,
	getLikedPosts,
	getSharedPosts,
} from '../controllers/postController.js'
import protect from '../middleweare/requireAuth.js'

const router = Router({ mergeParams: true })

router.route('/').get(protect, getPosts).post(protect, createPost)
router
	.route('/:id')
	.get(protect, getPost)
	.patch(protect, updatePost)
	.delete(protect, deletePost)
router.patch('/:id/like', protect, likePost)
router.patch('/:id/share', protect, sharePost)
router.get('/:userId/likes', protect, getLikedPosts)
router.get('/:userId/shares', protect, getSharedPosts)

export default router
