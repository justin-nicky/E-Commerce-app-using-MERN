import asyncHandler from 'express-async-handler'
import Coupon from '../models/couponModel.js'

export const addCoupon = asyncHandler(async (req, res) => {
  const coupon = req.body.coupon
  const existingCoupon = await Coupon.findOne({ code: coupon.code })
  if (existingCoupon) {
    res.status(400).json({
      message: 'Coupon already exists',
    })
  }
  if (coupon) {
    const couponData = await Coupon.create(coupon)
    console.log(couponData)
    res.status(201).json({
      data: couponData,
    })
  } else {
    res.status(400).json({
      message: 'Invalid coupon',
    })
  }
})

export const getAllCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find()
  res.status(200).json({
    data: coupons,
  })
})

export const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findOne({ code: req.params.code })
  if (!coupon) {
    res.status(404).json({
      message: 'Coupon not found',
    })
  } else {
    await Coupon.deleteOne({ _id: coupon._id })
    res.status(200).json({
      message: 'Coupon deleted successfully',
    })
  }
})

export const verifyCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findOne({ code: req.params.code })
  if (!coupon) {
    res.status(404).json({
      message: 'Coupon not found',
    })
  } else {
    res.status(200).json({
      coupon: coupon,
    })
  }
})
