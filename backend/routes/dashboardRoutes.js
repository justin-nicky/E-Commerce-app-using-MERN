import express from 'express'
import { getDashboardData } from '../controllers/dashboardController.js'

import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/').get(protect, admin, getDashboardData)
//router.route('/salesreport/:type').get(protect, admin, getSalesReport)

export default router
