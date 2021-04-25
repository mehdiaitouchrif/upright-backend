import { Router } from 'express'
import {
	getComments,
	updateComment,
	deleteComment,
	addComment,
	getComment,
} from '../controllers/commentController.js'
import protect from '../middleweare/requireAuth.js'
const router = Router({ mergeParams: true })

router.route('/').get(protect, getComments).post(protect, addComment)
router
	.route('/:id')
	.get(protect, getComment)
	.patch(protect, updateComment)
	.delete(protect, deleteComment)
export default router
