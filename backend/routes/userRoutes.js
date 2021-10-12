import express from 'express'
import {
  authUser,
  getUserProfile,
  registerUser,
  googleSignInUser,
  getAllUsers,
  updateUser,
} from '../controllers/userController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/').post(registerUser).get(protect, admin, getAllUsers)

router.post('/signinwithgoogle', googleSignInUser)
router.post('/login', authUser)
router.route('/profile').get(protect, getUserProfile)
router.route('/:id').patch(protect, admin, updateUser)

export default router
