import express from 'express'
import {
  getDashboardData,
  getRestrictedSalesReport,
} from '../controllers/dashboardController.js'

import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/').get(protect, admin, getDashboardData)
router
  .route('/salesreport/:startDate/:endDate')
  .get(protect, admin, getRestrictedSalesReport)

export default router
