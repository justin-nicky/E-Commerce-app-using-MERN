import express from 'express'
import Product from '../models/productModel.js'
import asyncHandler from 'express-async-handler'

const router = express.Router()
// @desc Fetch all products
// @route GET /api/products
// @acces Public
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const products = await Product.find({})
    res.json(products)
  })
)

// @desc Fetch a product
// @route GET /api/products/:id
// @acces Public
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)

    if (product != null) {
      res.json(product)
    } else {
      res.status(404)
      throw new Error('Product not found.')
    }
  })
)

export default router
