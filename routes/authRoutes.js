import { Router } from 'express'
import {
	changePassword,
	confirmEmail,
	login,
	sendConfirmationEmail,
	signUp,
} from '../controllers/authController.js'
import protect from '../middleweare/requireAuth.js'

const router = Router()

router.post('/signup', signUp)
router.post('/login', login)
router.patch('/changepassword', protect, changePassword)
router.post('/sendconfirmationemail', protect, sendConfirmationEmail)
router.patch('/confirmemail/:token', confirmEmail)
export default router
