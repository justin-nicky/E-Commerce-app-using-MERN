import express from 'express'
import {
  authUser,
  getUserProfile,
  registerUser,
  googleSignInUser,
  getAllUsers,
  updateUser,
  updateUserProfile,
  addAddress,
  getAddresses,
  deleteAddress,
} from '../controllers/userController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/').post(registerUser).get(protect, admin, getAllUsers)

router.post('/signinwithgoogle', googleSignInUser)
router.post('/login', authUser)
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile)
router.route('/:id').patch(protect, admin, updateUser)
router.route('/address').post(protect, addAddress).get(protect, getAddresses)
router.route('/address/:id').delete(protect, deleteAddress)

export default router
