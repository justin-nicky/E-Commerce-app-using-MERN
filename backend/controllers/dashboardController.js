import asyncHandler from 'express-async-handler'
import Order from '../models/orderModel.js'
import Product from '../models/productModel.js'
import User from '../models/userModel.js'

// @desc   Fetch dashboard data
// @route  GET /api/dashboard
// @access Private/Admin
export const getDashboardData = asyncHandler(async (req, res) => {
  const dayOfYear = (date) =>
    Math.floor(
      (date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24
    )

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
  const salesOfLastWeek = await Order.aggregate([
    {
      $match: {
        status: { $ne: 'Cancelled' },
        createdAt: {
          $gte: new Date(new Date() - 7 * 60 * 60 * 24 * 1000),
        },
      },
    },
    { $group: { _id: { $dayOfYear: '$createdAt' }, count: { $sum: 1 } } },
  ])
  const paymentMethods = Order.aggregate([
    {
      $match: {
        status: { $ne: 'Cancelled' },
        //$and: [{ paymentMethod: { $ne: 'COD' } }, { isPaid: { $eq: false } }],
      },
    },
    {
      $group: { _id: '$paymentMethod', count: { $sum: 1 } },
    },
    {
      $project: { _id: 0, paymentMethod: '$_id', count: 1 },
    },
  ])
  let data = await Promise.all([
    totalSalesAndOrderCount,
    productCount,
    userCount,
    salesOfLastWeek,
    paymentMethods,
  ])
  const thisDay = dayOfYear(new Date())
  let salesOfLastWeekData = []
  for (let i = 0; i < 7; i++) {
    let count = data[3].find((d) => d._id === thisDay + i - 7)

    if (count) {
      salesOfLastWeekData.push(count.count)
    } else {
      salesOfLastWeekData.push(0)
    }
  }
  res.json({
    totalSales: Math.round(data[0][0].sum),
    orderCount: data[0][0].count,
    productCount: data[1],
    userCount: data[2],
    salesOfLastWeek: salesOfLastWeekData,
    paymentMethods: data[4],
  })
})
