import { Router } from 'express'
import {
	changePassword,
	confirmEmail,
	login,
	sendConfirmationEmail,
	requestPasswordReset,
	signUp,
	resetPassword,
	getCurrent,
} from '../controllers/authController.js'
import protect from '../middleweare/requireAuth.js'

const router = Router()

router.post('/signup', signUp)
router.post('/login', login)
router.get('/me', protect, getCurrent)
router.patch('/changepassword', protect, changePassword)
router.post('/sendconfirmationemail', protect, sendConfirmationEmail)
router.patch('/confirmemail/:token', confirmEmail)
router.post('/requestpasswordreset', requestPasswordReset)
router.patch('/resetpassword/:token', resetPassword)
export default router
