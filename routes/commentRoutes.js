import { Router } from 'express'
import {
	getComments,
	updateComment,
	deleteComment,
	addComment,
} from '../controllers/commentController.js'
import protect from '../middleweare/requireAuth.js'
const router = Router({ mergeParams: true })

router.route('/').get(protect, getComments).post(protect, addComment)
router
	.route('/:id')
	.patch(protect, updateComment)
	.delete(protect, deleteComment)
export default router
