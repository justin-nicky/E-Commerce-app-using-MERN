import asyncHandler from 'express-async-handler'
import Order from '../models/orderModel.js'
import Product from '../models/productModel.js'
import User from '../models/userModel.js'

// @desc   Fetch dashboard data
// @route  GET /api/dashboard
// @access Private/Admin
export const getDashboardData = asyncHandler(async (req, res) => {
  const totalSalesAndOrderCount = Order.aggregate([
    { $match: { status: { $ne: 'Cancelled' } } },
    {
      $group: { _id: null, sum: { $sum: '$totalPrice' }, count: { $sum: 1 } },
    },
    {
      $project: { _id: 0, sum: 1, count: 1 },
    },
  ])
  const productCount = Product.count()
  const userCount = User.count()
  const data = await Promise.all([
    totalSalesAndOrderCount,
    productCount,
    userCount,
  ])
  res.json({
    totalSales: Math.round(data[0][0].sum),
    orderCount: data[0][0].count,
    productCount: data[1],
    userCount: data[2],
  })
})
