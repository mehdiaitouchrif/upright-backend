import { Router } from 'express'
import { getLikedPosts } from '../controllers/mixedController.js'
import protect from '../middleweare/requireAuth.js'
const router = Router()

router.get('/:userId/likes', protect, getLikedPosts)
router.get('/:userId/shares', protect, getLikedPosts)

export default router
