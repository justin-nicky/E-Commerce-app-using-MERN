import express from 'express'
import {
  addCoupon,
  getAllCoupons,
  deleteCoupon,
  verifyCoupon,
} from '../controllers/couponController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

router
  .route('/')
  .post(protect, admin, addCoupon)
  .get(protect, admin, getAllCoupons)

router
  .route('/:code')
  .delete(protect, admin, deleteCoupon)
  .get(protect, verifyCoupon)

export default router
