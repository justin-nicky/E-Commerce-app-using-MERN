import express from 'express'
import {
  addOrderItems,
  cancelOrder,
  getMyOrders,
  getOrderById,
  getOrders,
  razorpayOrder,
  updateOrderStatus,
  updateOrderToPaid,
} from '../controllers/orderController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders)
router.route('/myorders').get(protect, getMyOrders)
router.route('/:id').get(protect, getOrderById)
router.route('/:id/status').put(protect, admin, updateOrderStatus)
router.route('/:id/pay').put(protect, updateOrderToPaid)
router.route('/:id/razorpay').post(protect, razorpayOrder)
router.route('/:id/cancel').put(protect, cancelOrder)

export default router
