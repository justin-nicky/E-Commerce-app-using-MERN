import asyncHandler from 'express-async-handler'
import Razorpay from 'razorpay'
import dotenv from 'dotenv'
import Order from '../models/orderModel.js'
import Product from '../models/productModel.js'

dotenv.config()

// @desc   Create a new order
// @route  POST /api/orders
// @access Private
export const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body

  if (orderItems && orderItems.length === 0) {
    res.status(400)
    throw new Error('No order Items')
  } else {
    orderItems.forEach(async (item) => {
      const product = await Product.findById(item.product)
      product.countInStock -= item.qty
      await product.save()
    })

    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    })

    const createdOrder = await order.save()
    res.status(201).json(createdOrder)
  }
})

// @desc   Get order by id
// @route  GET /api/orders/:id
// @access Private
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  )
  if (order) {
    res.json(order)
  } else {
    res.status(404)
    throw new Error('Order not found.')
  }
})

// @desc   Update order to paid
// @route  PUT /api/orders/:id/pay
// @access Private
export const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
  if (order) {
    order.isPaid = true
    order.paidAt = Date.now()
    const updatedOrder = await order.save()
    res.json(updatedOrder)
  } else {
    res.status(404)
    throw new Error('Order not found.')
  }
})

// @desc   Update order status
// @route  PUT /api/orders/:id/status
// @access Private/Admin
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
  if (order) {
    if (order.status === 'Cancelled') {
      res.status(400)
      throw new Error('Order was cancelled by the user.')
    } else if (req.body.status === 'Delivered') {
      order.isPaid = true
      order.deliveredAt = Date.now()
    }
    order.status = req.body.status
    const updatedOrder = await order.save()
    res.json(updatedOrder)
  } else {
    res.status(404)
    throw new Error('Order not found.')
  }
})

// @desc   Cancel order
// @route  PUT /api/orders/:id/cancel
// @access Private/
export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
  if (order) {
    order.status = 'Cancelled'
    const updatedOrder = await order.save()

    //update product stock count
    order.orderItems.forEach(async (item) => {
      const product = await Product.findById(item.product)
      product.countInStock += item.qty
      await product.save()
    })

    res.json(updatedOrder)
  } else {
    res.status(404)
    throw new Error('Order not found.')
  }
})

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort('-createdAt')
  res.json(orders)
})

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .sort('-createdAt')
    .populate('user', 'id name')
  res.json(orders)
})

export const razorpayOrder = asyncHandler(async (req, res) => {
  const amount = Math.floor(req.body.order.totalPrice)
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    })
    //console.log('instance', instance)
    const options = {
      amount: String(amount) + '00',
      currency: 'INR',
      receipt: Date.now(),
    }

    const order = await instance.orders.create(options)
    if (!order) return res.status(500).send('Some error occured')

    res.json(order)
  } catch (error) {
    res.status(500).send(error)
  }
})
