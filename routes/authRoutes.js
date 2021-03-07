import { Router } from 'express'
import { changePassword, login, signUp } from '../controllers/authController.js'
import protect from '../middleweare/requireAuth.js'

const router = Router()

router.post('/signup', signUp)
router.post('/login', login)
router.patch('/changepassword', protect, changePassword)
export default router
